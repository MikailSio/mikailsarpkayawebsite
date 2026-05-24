window.LISE_MAT_L97 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You have just been told you tested positive for a rare disease.</strong> The test is "95% accurate". What is the probability that you actually have the disease? Most people — including most doctors — guess somewhere around 90%. The correct answer, for a disease that affects 1 in 100 people, is closer to <strong>9%</strong>. Off by a factor of ten. The tool that bridges that gap is the single most important formula in probability: <em>Bayes' theorem</em>.</p>

<p class="l-text">In Lesson 96 you learned how to flip the question "what is the probability of B given A?" into the conditional formulation $P(B \\mid A) = P(A \\cap B) / P(A)$. Bayes' theorem now lets you flip the question the other way: given what you observed, what is the probability of the cause? It is the engine behind spam filters, medical diagnosis, GPS positioning, and most of modern machine learning. By the end of this lesson, you will derive it in two lines, apply it to several classic problems, and understand why "95% accurate" sounds reassuring but is almost meaningless without the prior.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive Bayes' theorem from the symmetry of $P(A \\cap B)$ in two short steps</li>
<li>Identify the four named pieces — <em>prior, likelihood, evidence, posterior</em> — in any Bayes problem</li>
<li>Use the law of total probability to compute the denominator $P(B)$ from a partition</li>
<li>Solve the classic medical-test paradox and explain in plain words why a "95% accurate" test gives a 9% posterior</li>
<li>Update beliefs sequentially as new evidence arrives (today's posterior becomes tomorrow's prior)</li>
<li>Spot the <em>base-rate fallacy</em> and the <em>prosecutor's fallacy</em> — confusing $P(A \\mid B)$ with $P(B \\mid A)$</li>
</ul>
</div>

<h2 class="lesson-title">1. The Symmetry That Starts Everything</h2>

<div class="calc-highlight"><strong>The whole of Bayes' theorem comes from a single observation:</strong> "A and B both happen" is the same event as "B and A both happen". So $P(A \\cap B) = P(B \\cap A)$. Combine that obvious truth with the conditional probability formula from Lesson 96, and the famous theorem falls out in two lines.</div>

<p class="l-text">Recall the definition of conditional probability from the previous lesson. If $P(B) > 0$ and $P(A) > 0$, then:</p>

<div class="calc-formula"><div class="formula-label">CONDITIONAL PROBABILITY (FROM L96)</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)} \\qquad\\text{and}\\qquad P(B \\mid A) \\;=\\; \\frac{P(B \\cap A)}{P(A)}$$</div><div class="formula-sub">Two definitions, one for each direction of conditioning.</div></div>

<p class="l-text"><strong>Multiply both sides through</strong> by the denominator. We get two ways to compute the joint probability:</p>

<div class="calc-formula"><div class="formula-label">JOINT, TWO WAYS</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(A \\mid B) \\, P(B) \\;=\\; P(B \\mid A) \\, P(A)$$</div><div class="formula-sub">The same probability, written through two different conditioning paths.</div></div>

<p class="l-text">Now set the right two expressions equal — because they describe the same number — and divide by $P(B)$:</p>

<div class="calc-formula"><div class="formula-label">BAYES' THEOREM</div><div class="formula-main">$$\\boxed{\\;P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\, P(A)}{P(B)}\\;}$$</div><div class="formula-sub">That's it. One line of algebra from the conditional probability definition.</div></div>

<p class="l-text">No magic. No advanced mathematics. Just the equality $P(A \\cap B) = P(B \\cap A)$ rearranged. But the consequences are enormous, because the left side and the right side flip the direction of conditioning — and in almost every real problem, one direction is easy to know and the other is what you actually want to know.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Verify Bayes' theorem on a tiny example by hand. Suppose $P(A) = 0.3$, $P(B) = 0.4$, $P(B \\mid A) = 0.5$. What is $P(A \\mid B)$? Plug in: $P(A \\mid B) = (0.5)(0.3) / 0.4 = 0.15 / 0.4 = 0.375$. Notice how the answer is bigger than the prior $P(A) = 0.3$ — observing $B$ <em>increased</em> our belief in $A$, because $A$ makes $B$ more likely than average.</div></div>

<h2 class="lesson-title">2. The Vocabulary: Prior, Likelihood, Evidence, Posterior</h2>

<div class="calc-highlight"><strong>Bayes' theorem has four pieces, and each has a name you will hear constantly.</strong> Learn the names now, because every Bayesian problem in this lesson, in machine learning, and in scientific inference uses exactly these four words.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prior &mdash; $P(A)$</div><div class="card-body">What you believed about $A$ <em>before</em> seeing the new evidence $B$. Could come from base rates, past data, or domain knowledge.</div></div>
<div class="calc-card"><div class="card-title">Likelihood &mdash; $P(B \\mid A)$</div><div class="card-body">If $A$ were true, how likely is the evidence $B$? Read forward: cause $\\rightarrow$ effect. Usually the easy quantity to compute or measure.</div></div>
<div class="calc-card"><div class="card-title">Evidence &mdash; $P(B)$</div><div class="card-body">The overall (marginal) probability of seeing $B$, across all possible causes. The normalising constant. Computed from the law of total probability.</div></div>
<div class="calc-card"><div class="card-title">Posterior &mdash; $P(A \\mid B)$</div><div class="card-body">Your updated belief about $A$ <em>after</em> seeing the evidence. The number you usually want. Direction: effect $\\rightarrow$ cause.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BAYES, IN WORDS</div><div class="formula-main">$$\\text{posterior} \\;=\\; \\frac{\\text{likelihood} \\times \\text{prior}}{\\text{evidence}}$$</div><div class="formula-sub">Memorise this skeleton. Every Bayes problem you ever meet plugs into these four slots.</div></div>

<p class="l-text"><strong>Why "flip"?</strong> The likelihood $P(B \\mid A)$ runs <em>forward</em>: if I have the disease, what is the chance the test alerts? That is something a lab can measure by testing 1000 known sick patients. The posterior $P(A \\mid B)$ runs <em>backward</em>: I got a positive test — what is the chance I have the disease? That is what the patient wants to know. Bayes' theorem is the bridge between the forward and backward directions.</p>

<div class="l-note"><strong>Notation reminder.</strong> $A'$ (or $A^c$, or $\\overline{A}$) denotes "not A", the complement. So $P(A') = 1 - P(A)$. We'll use the apostrophe form throughout.</div>

<h2 class="lesson-title">3. Computing the Evidence: Total Probability</h2>

<div class="calc-highlight"><strong>The denominator $P(B)$ in Bayes' theorem is rarely given directly.</strong> Almost always you have to compute it from the law of total probability — by adding up the contributions of $B$ across every possible value of $A$. This is the step where most students stumble. It is mechanical once you have the picture.</div>

<p class="l-text">The simplest version: if $A$ either happens or does not, the event $B$ can occur "via $A$" or "via $A'$". These two paths are mutually exclusive (an outcome cannot have both $A$ true and $A$ false at the same time) and exhaustive (every outcome has $A$ either true or false). So:</p>

<div class="calc-formula"><div class="formula-label">LAW OF TOTAL PROBABILITY (TWO-PART PARTITION)</div><div class="formula-main">$$P(B) \\;=\\; P(B \\mid A) \\, P(A) \\;+\\; P(B \\mid A') \\, P(A')$$</div><div class="formula-sub">"Probability of $B$" = (probability of $B$ given the cause) times (probability of the cause), summed over all causes.</div></div>

<p class="l-text">Substituting this into Bayes' theorem gives the form you will use most often in practice:</p>

<div class="calc-formula"><div class="formula-label">BAYES WITH EXPANDED DENOMINATOR</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\, P(A)}{P(B \\mid A) \\, P(A) + P(B \\mid A') \\, P(A')}$$</div><div class="formula-sub">All four inputs on the right are "forward" quantities: priors and likelihoods. No magic ingredient is needed.</div></div>

<p class="l-text"><strong>General partition.</strong> If the sample space is split into $n$ mutually exclusive and exhaustive events $A_1, A_2, \\ldots, A_n$ (a <em>partition</em>), and we observe $B$, the posterior for any particular cause $A_i$ is:</p>

<div class="calc-formula"><div class="formula-label">BAYES WITH AN $n$-PART PARTITION</div><div class="formula-main">$$P(A_i \\mid B) \\;=\\; \\frac{P(B \\mid A_i) \\, P(A_i)}{\\displaystyle\\sum_{j=1}^{n} P(B \\mid A_j) \\, P(A_j)}$$</div><div class="formula-sub">Numerator: the contribution of the specific cause $A_i$. Denominator: the total contribution across all causes — the normaliser.</div></div>

<div class="think-box"><div class="think-label">SANITY CHECK</div><div class="think-body">If you sum the posteriors over every cause, you should always get 1. That is, $\\sum_{i=1}^{n} P(A_i \\mid B) = 1$. Why? Because the numerators sum to the denominator — that is exactly how the denominator was constructed. Posteriors form a probability distribution over the possible causes.</div></div>

<h2 class="lesson-title">4. The Medical Test Paradox</h2>

<div class="calc-highlight"><strong>This is the most famous Bayes problem in the world.</strong> A test is "95% accurate" and you got a positive result. Surely the chance you have the disease is around 95%? No — and the gap between intuition and reality is huge. Understanding this single example is worth ten lessons of theory.</div>

<p class="l-text"><strong>Setup.</strong> A disease has a base rate (prevalence) of <strong>1%</strong> in the population. A test for the disease has:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sensitivity 95%</div><div class="card-body">$P(\\text{positive} \\mid \\text{disease}) = 0.95$. If you have the disease, the test catches it 95% of the time.</div></div>
<div class="calc-card"><div class="card-title">Specificity 90%</div><div class="card-body">$P(\\text{negative} \\mid \\text{no disease}) = 0.90$. If you don't have the disease, the test is correct 90% of the time, meaning it gives a false positive 10% of the time.</div></div>
</div>

<p class="l-text"><strong>Question.</strong> You tested positive. What is $P(\\text{disease} \\mid \\text{positive})$?</p>

<p class="l-text"><strong>Setting up Bayes.</strong> Let $D$ = "has the disease" and $T^+$ = "test positive". The four ingredients are:</p>

<div class="calc-formula"><div class="formula-label">THE FOUR INGREDIENTS</div><div class="formula-main">$$\\begin{aligned} P(D) &= 0.01 \\quad &\\text{(prior)} \\\\ P(D') &= 0.99 \\\\ P(T^+ \\mid D) &= 0.95 \\quad &\\text{(sensitivity)} \\\\ P(T^+ \\mid D') &= 0.10 \\quad &\\text{(1 - specificity)} \\end{aligned}$$</div></div>

<p class="l-text"><strong>Compute the evidence</strong> using the law of total probability:</p>

<div class="calc-formula"><div class="formula-label">P(T+)</div><div class="formula-main">$$P(T^+) \\;=\\; P(T^+ \\mid D)\\,P(D) + P(T^+ \\mid D')\\,P(D') \\;=\\; (0.95)(0.01) + (0.10)(0.99)$$</div><div class="formula-main">$$= \\; 0.0095 + 0.099 \\;=\\; 0.1085$$</div></div>

<p class="l-text"><strong>Apply Bayes' theorem:</strong></p>

<div class="calc-formula"><div class="formula-label">THE POSTERIOR</div><div class="formula-main">$$P(D \\mid T^+) \\;=\\; \\frac{P(T^+ \\mid D)\\,P(D)}{P(T^+)} \\;=\\; \\frac{(0.95)(0.01)}{0.1085} \\;=\\; \\frac{0.0095}{0.1085} \\;\\approx\\; 0.0876$$</div><div class="formula-sub">About <strong>8.76%</strong>. Not 95%. Not 90%. Less than 9%.</div></div>

<p class="l-text"><strong>Why so low?</strong> Imagine 1000 random people. About 10 have the disease (1%); 990 do not. Of the 10 sick, 9.5 test positive. Of the 990 healthy, 99 test positive (a 10% false-positive rate). Of the $9.5 + 99 \\approx 108.5$ total positives, only 9.5 are actually sick. The ratio is $9.5 / 108.5 \\approx 8.8\\%$. The false positives <em>swamp</em> the true positives because the disease is rare.</p>

<div class="calc-graph"><div id="plot-l97-medtest-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the posterior probability $P(D \\mid T^+)$ on the vertical axis, as a function of the prior (base rate) $P(D)$ on the horizontal axis, for three combinations of test quality. Notice how all curves start near zero on the left — for rare diseases, even a very accurate test cannot push the posterior high. The test's quality matters less than the prior when the disease is rare.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function posterior(prior, sens, spec){var fp = 1 - spec; return sens*prior / (sens*prior + fp*(1-prior));}
var priors = []; for(var i = 0; i <= 100; i++){ priors.push(i/100); }
function curve(sens, spec){return priors.map(function(p){return posterior(p, sens, spec);});}
var c1 = {x: priors, y: curve(0.95, 0.90), mode:'lines', name: 'sens=95%, spec=90%', line:{color:'#3b82f6', width:3}};
var c2 = {x: priors, y: curve(0.99, 0.95), mode:'lines', name: 'sens=99%, spec=95%', line:{color:'#f59e0b', width:3}};
var c3 = {x: priors, y: curve(0.99, 0.999), mode:'lines', name: 'sens=99%, spec=99.9%', line:{color:'#10b981', width:3}};
var diag = {x: [0,1], y: [0,1], mode:'lines', name:'y = x (no info)', line:{color:'rgba(255,255,255,0.25)', width:1.5, dash:'dot'}};
var marker = {x:[0.01], y:[posterior(0.01, 0.95, 0.90)], mode:'markers+text', name:'1% prior example', marker:{color:'#ef4444', size:11}, text:['~8.8%'], textposition:'top right', textfont:{color:'#e8e8e8', size:11}};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{title:'prior P(D)', range:[0,1], gridcolor:'rgba(255,255,255,0.06)', zerolinecolor:'rgba(255,255,255,0.2)'}, yaxis:{title:'posterior P(D | positive)', range:[0,1], gridcolor:'rgba(255,255,255,0.06)', zerolinecolor:'rgba(255,255,255,0.2)'}, margin:{t:30, r:30, b:55, l:65}, legend:{orientation:'h', y:1.1, xanchor:'center', x:0.5}};
Plotly.newPlot('plot-l97-medtest-en',[c1,c2,c3,diag,marker], lay, {responsive:true, displayModeBar:false});
},250);</script>

<div class="l-note"><strong>The practical lesson.</strong> When screening for a rare condition, a single positive test is weak evidence. That is why doctors order confirmatory tests: each independent positive multiplies your posterior odds. After two independent positives, the 8.8% jumps dramatically (we'll do the calculation in section 6).</div>

<h2 class="lesson-title">5. The Tree Diagram: Forward and Backward Flow</h2>

<div class="calc-highlight"><strong>A probability tree makes Bayes visual.</strong> The forward branches give likelihoods (cause $\\rightarrow$ effect). The backward computation flips the conditioning to find the posterior. Drawing the tree is the most reliable way to avoid arithmetic errors in Bayes problems.</div>

<p class="l-text">For the medical test example, the tree splits in two stages. <strong>Stage 1:</strong> branch on the unknown $D$ vs $D'$ with probabilities $P(D) = 0.01$ and $P(D') = 0.99$. <strong>Stage 2:</strong> from each of those, branch on the test result with conditional probabilities $P(T^+ \\mid D), P(T^- \\mid D), P(T^+ \\mid D'), P(T^- \\mid D')$. The four leaf nodes give the four joint probabilities, and they sum to 1.</p>

<div class="calc-graph"><div id="plot-l97-tree-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two-stage tree for the medical test. The forward path multiplies probabilities down a branch to get a joint $P(D \\cap T^+)$. The backward Bayes inversion divides one of those joints by the marginal $P(T^+)$ to get the posterior $P(D \\mid T^+)$. The four red leaves are the four joint outcomes; you can check they sum to 1.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges = {x:[0,1, null, 0,1, null, 1,2, null, 1,2, null, 1,2, null, 1,2], y:[0,1, null, 0,-1, null, 1,1.5, null, 1,0.5, null, -1,-0.5, null, -1,-1.5], mode:'lines', name:'tree edges', line:{color:'rgba(255,255,255,0.35)', width:1.5}, showlegend:false};
var nodes = {x:[0, 1, 1, 2, 2, 2, 2], y:[0, 1, -1, 1.5, 0.5, -0.5, -1.5], mode:'markers+text', name:'nodes', marker:{color:['#3b82f6','#10b981','#10b981','#ef4444','#ef4444','#ef4444','#ef4444'], size:14}, text:['start','D<br>0.01','D\\'<br>0.99','T+<br>0.0095','T-<br>0.0005','T+<br>0.099','T-<br>0.891'], textposition:'middle right', textfont:{color:'#e8e8e8', size:11}};
var labels = {x:[0.5, 0.5, 1.5, 1.5, 1.5, 1.5], y:[0.55, -0.55, 1.32, 0.72, -0.72, -1.32], mode:'text', name:'edge labels', text:['P(D)=0.01','P(D\\')=0.99','P(T+|D)=0.95','P(T-|D)=0.05','P(T+|D\\')=0.10','P(T-|D\\')=0.90'], textfont:{color:'#f59e0b', size:10}, showlegend:false};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{range:[-0.4, 3.2], showgrid:false, zeroline:false, visible:false}, yaxis:{range:[-2, 2], showgrid:false, zeroline:false, visible:false}, margin:{t:20, r:20, b:20, l:20}, showlegend:false};
Plotly.newPlot('plot-l97-tree-en',[edges, labels, nodes], lay, {responsive:true, displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Reading the tree.</strong> Each leaf is a joint probability — the product along its branch. The four leaves sum to $0.0095 + 0.0005 + 0.099 + 0.891 = 1.000$ (good — they exhaust all outcomes). To find $P(D \\mid T^+)$, you collect all leaves with $T^+$ and ask "what fraction of them came from the $D$ branch?" That is exactly Bayes' theorem.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Same tree, but the test returned negative.</strong> What is $P(D \\mid T^-)$?<br><br>$P(T^-) = P(T^- \\mid D) P(D) + P(T^- \\mid D') P(D') = (0.05)(0.01) + (0.90)(0.99) = 0.0005 + 0.891 = 0.8915$.<br><br>$P(D \\mid T^-) = \\dfrac{(0.05)(0.01)}{0.8915} \\approx 0.00056 \\approx \\mathbf{0.056\\%}$.<br><br>So a negative test drops your posterior from 1% prior to 0.056% — a strong reduction. Negative tests carry much more information than positive tests for rare diseases.</div></div>

<h2 class="lesson-title">6. Sequential Bayes: Today's Posterior is Tomorrow's Prior</h2>

<div class="calc-highlight"><strong>You don't have to throw away your posterior when more data arrives.</strong> The posterior from the first observation becomes the prior for the second observation, and you apply Bayes again. This is how scientific belief gets updated as evidence accumulates — and how spam filters and machine learning models learn from streaming data.</div>

<p class="l-text">Suppose after the first positive test, you take a second, <em>independent</em> test with the same characteristics. The first positive shifted your belief from $P(D) = 0.01$ to $P(D \\mid T_1^+) \\approx 0.0876$. Now this becomes your new prior. Re-apply Bayes:</p>

<div class="calc-formula"><div class="formula-label">SECOND POSITIVE TEST</div><div class="formula-main">$$P(D \\mid T_1^+, T_2^+) \\;=\\; \\frac{P(T_2^+ \\mid D)\\,P(D \\mid T_1^+)}{P(T_2^+ \\mid D)\\,P(D \\mid T_1^+) + P(T_2^+ \\mid D')\\,P(D' \\mid T_1^+)}$$</div><div class="formula-main">$$= \\; \\frac{(0.95)(0.0876)}{(0.95)(0.0876) + (0.10)(0.9124)} \\;=\\; \\frac{0.0832}{0.0832 + 0.0912} \\;\\approx\\; 0.477$$</div></div>

<p class="l-text">A second independent positive jumps the posterior from 9% to <strong>about 48%</strong>. Independent confirmation matters enormously. After a third, it would climb past 90%. This is the principle behind multi-stage screening.</p>

<div class="think-box"><div class="think-label">THE KEY INSIGHT</div><div class="think-body">Sequential Bayes commutes: it does not matter in what order you process the evidence. Three independent positives in any sequence give the same final posterior. This is one of the most elegant properties of the framework — the math is order-free, just like the joint probability $P(T_1^+ \\cap T_2^+ \\cap T_3^+ \\cap D)$ is order-free.</div></div>

<h2 class="lesson-title">7. The Spam Filter</h2>

<div class="calc-highlight"><strong>Modern spam filters are built on Bayes' theorem.</strong> The "Naive Bayes" classifier (which you'll meet in the ML track) treats each word in an email as an independent piece of evidence and combines them through Bayes to get $P(\\text{spam} \\mid \\text{email})$. The intuition is high-school-level; the implementation is one of the most successful applications of probability in computer science.</div>

<p class="l-text"><strong>Setup.</strong> Say 30% of all incoming email is spam. We've measured that the word "free" appears in 60% of spam emails but only in 5% of legitimate emails. A new email contains the word "free". Is it spam?</p>

<p class="l-text">Let $S$ = "spam", $F$ = "contains 'free'". The four pieces are:</p>

<div class="calc-formula"><div class="formula-label">SPAM FILTER INPUTS</div><div class="formula-main">$$P(S) = 0.30, \\quad P(S') = 0.70, \\quad P(F \\mid S) = 0.60, \\quad P(F \\mid S') = 0.05$$</div></div>

<p class="l-text"><strong>Apply Bayes:</strong></p>

<div class="calc-formula"><div class="formula-label">SPAM POSTERIOR</div><div class="formula-main">$$P(S \\mid F) \\;=\\; \\frac{(0.60)(0.30)}{(0.60)(0.30) + (0.05)(0.70)} \\;=\\; \\frac{0.18}{0.18 + 0.035} \\;=\\; \\frac{0.18}{0.215} \\;\\approx\\; 0.837$$</div></div>

<p class="l-text">Just the single word "free" pushes a generic email from 30% spam probability to <strong>83.7%</strong>. Now compare with a neutral word like "the" — which appears in maybe 90% of spam <em>and</em> 90% of legitimate email. Plugging that in: posterior = $(0.9)(0.3) / [(0.9)(0.3) + (0.9)(0.7)] = 0.27 / 0.90 = 0.30$. Same as the prior — no information. Words become informative <em>to the extent that they appear in spam at a different rate than in legitimate email</em>.</p>

<div class="l-note"><strong>The general principle.</strong> Evidence shifts your belief by the <em>likelihood ratio</em> $P(B \\mid A) / P(B \\mid A')$. Ratios bigger than 1 push the posterior up; ratios less than 1 push it down; ratio exactly 1 is informationless. Bayes' theorem turns this ratio into a probability for you.</div>

<h2 class="lesson-title">8. Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 &mdash; THREE FACTORY MACHINES</div><div class="example-body">A factory has three machines producing identical bolts. Machine A produces 50% of output and 1% are defective. Machine B produces 30% of output and 2% are defective. Machine C produces 20% of output and 5% are defective. A defective bolt is found in inventory. What is the probability it came from machine C?<br><br>Let $A, B, C$ be the events "produced by machine A, B, C" and $D$ = "defective". Inputs: $P(A) = 0.5, P(B) = 0.3, P(C) = 0.2$, and $P(D \\mid A) = 0.01, P(D \\mid B) = 0.02, P(D \\mid C) = 0.05$.<br><br>Total: $P(D) = (0.01)(0.5) + (0.02)(0.3) + (0.05)(0.2) = 0.005 + 0.006 + 0.010 = 0.021$.<br><br>Posterior: $P(C \\mid D) = (0.05)(0.2) / 0.021 = 0.010 / 0.021 \\approx \\mathbf{47.6\\%}$.<br><br>Even though machine C only makes 20% of the bolts, it accounts for 47.6% of the defective ones — its higher defect rate dominates.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 &mdash; URN PROBLEM</div><div class="example-body">Urn 1 contains 3 red and 7 blue balls. Urn 2 contains 6 red and 4 blue balls. You flip a fair coin: heads, you draw from urn 1; tails, urn 2. The ball you draw is red. What is the probability you drew from urn 1?<br><br>Inputs: $P(U_1) = P(U_2) = 0.5$, $P(R \\mid U_1) = 3/10 = 0.3$, $P(R \\mid U_2) = 6/10 = 0.6$.<br><br>Total: $P(R) = (0.3)(0.5) + (0.6)(0.5) = 0.15 + 0.30 = 0.45$.<br><br>Posterior: $P(U_1 \\mid R) = (0.3)(0.5) / 0.45 = 0.15 / 0.45 = \\mathbf{1/3 \\approx 33.3\\%}$.<br><br>The red ball makes urn 2 more likely (because urn 2 has more red), so the urn-1 posterior dropped from 1/2 prior to 1/3 posterior. Conversely $P(U_2 \\mid R) = 2/3$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 &mdash; MONTY HALL (BRIEFLY)</div><div class="example-body">In the game show, you pick door 1 out of three. The host (who knows where the prize is) opens door 3 to reveal a goat. Should you switch to door 2?<br><br>Let $H_i$ = "prize is behind door $i$", priors $P(H_1) = P(H_2) = P(H_3) = 1/3$. Let $O_3$ = "host opens door 3".<br><br>Likelihoods: $P(O_3 \\mid H_1) = 1/2$ (host picks freely between doors 2 and 3); $P(O_3 \\mid H_2) = 1$ (host must avoid the prize behind door 2 and your choice door 1); $P(O_3 \\mid H_3) = 0$ (host won't reveal the prize).<br><br>Total: $P(O_3) = (1/2)(1/3) + (1)(1/3) + (0)(1/3) = 1/2$.<br><br>$P(H_2 \\mid O_3) = (1)(1/3) / (1/2) = \\mathbf{2/3}$. Switching doubles your winning probability from 1/3 to 2/3.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 &mdash; SENSITIVITY TO PRIOR</div><div class="example-body">Same medical test as section 4 (sens 95%, spec 90%). What if the prior is 30% (a high-risk patient with strong symptoms) instead of 1%?<br><br>$P(T^+) = (0.95)(0.3) + (0.10)(0.7) = 0.285 + 0.070 = 0.355$.<br><br>$P(D \\mid T^+) = (0.95)(0.3) / 0.355 = 0.285 / 0.355 \\approx \\mathbf{80.3\\%}$.<br><br>Same test, same accuracy — but the posterior went from 9% (low prior) to 80% (high prior). <em>The test does not change; only the prior changes the conclusion.</em> This is why "screening the general population" and "testing a sick-seeming patient" give such different posteriors.</div></div>

<h2 class="lesson-title">9. Visualising the Posterior Across Priors</h2>

<div class="calc-graph"><div id="plot-l97-priorpost-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the posterior $P(D \\mid T^+)$ as a bar chart at five different prior probabilities, with sensitivity 95% and specificity 90% fixed. The blue bars give the posterior; the dotted line marks the prior. You can see the posterior is always above the prior (a positive test increases belief), but how far above depends massively on the prior itself. Below 5% prior, the test barely helps; above 30% prior, the test is decisive.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function post(p){return 0.95*p / (0.95*p + 0.10*(1-p));}
var priors = [0.001, 0.01, 0.05, 0.1, 0.3, 0.5, 0.7];
var posts = priors.map(post);
var labs = priors.map(function(p){return (p*100).toFixed(1) + '%';});
var bars = {x: labs, y: posts.map(function(p){return p*100;}), type:'bar', name:'posterior P(D|+)', marker:{color:'#3b82f6'}, text: posts.map(function(p){return (p*100).toFixed(1) + '%';}), textposition:'outside', textfont:{color:'#e8e8e8', size:11}};
var line = {x: labs, y: priors.map(function(p){return p*100;}), type:'scatter', mode:'lines+markers', name:'prior P(D)', line:{color:'#f59e0b', width:2, dash:'dot'}, marker:{color:'#f59e0b', size:8}};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{title:'prior P(D)', gridcolor:'rgba(255,255,255,0.06)'}, yaxis:{title:'probability (%)', range:[0, 100], gridcolor:'rgba(255,255,255,0.06)'}, margin:{t:30, r:30, b:55, l:65}, legend:{orientation:'h', y:1.1, xanchor:'center', x:0.5}, barmode:'group'};
Plotly.newPlot('plot-l97-priorpost-en',[bars, line], lay, {responsive:true, displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BASE-RATE FALLACY</div><div class="compare-item">Ignoring the prior $P(A)$ and reasoning only from the likelihood $P(B \\mid A)$</div><div class="compare-item">"The test is 95% accurate, so I have a 95% chance of being sick" &mdash; <strong>wrong</strong></div><div class="compare-item">Fix: always anchor on the base rate before updating</div><div class="compare-item">Classic example: rare disease tests, rare events in the news, profiling</div></div><div class="compare-col"><div class="compare-title">PROSECUTOR'S FALLACY</div><div class="compare-item">Confusing $P(\\text{evidence} \\mid \\text{innocent})$ with $P(\\text{innocent} \\mid \\text{evidence})$</div><div class="compare-item">"The DNA match probability is 1 in a million if you are innocent, so the defendant is innocent with probability 1 in a million" &mdash; <strong>wrong</strong></div><div class="compare-item">Fix: Bayes' theorem; the posterior depends on the prior probability of guilt</div><div class="compare-item">Classic example: courtrooms, especially with DNA evidence</div></div></div>

<p class="l-text"><strong>Both errors come from confusing the direction of conditioning.</strong> $P(A \\mid B)$ and $P(B \\mid A)$ are different numbers in general, and only Bayes' theorem connects them — through the prior $P(A)$ and the evidence $P(B)$. Whenever someone quotes a "probability" without specifying which way the conditioning runs, treat the claim with suspicion.</p>

<div class="l-note"><strong>A famous miscarriage of justice.</strong> The 1999 conviction of Sally Clark for the deaths of her two infants relied on the testimony that "the probability of two cot deaths in one family is 1 in 73 million". The judge implicitly equated this with "the probability she is innocent". But $P(\\text{two deaths} \\mid \\text{innocent})$ is not the same as $P(\\text{innocent} \\mid \\text{two deaths})$ — without a prior on how rare double-murder by mothers is, the inversion is meaningless. Clark's conviction was later overturned. The fallacy directly cost her three years in prison.</div>

<h2 class="lesson-title">11. Practice Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; THE TWO COINS</div><div class="example-body"><strong>A bag contains two coins. One is fair, one is two-headed. You pick one at random and flip it; it lands heads. What is the probability you picked the two-headed coin?</strong><br><br>Let $F$ = fair, $T$ = two-headed, $H$ = heads. Priors $P(F) = P(T) = 0.5$. Likelihoods $P(H \\mid F) = 0.5$, $P(H \\mid T) = 1$.<br><br>$P(H) = (0.5)(0.5) + (1)(0.5) = 0.75$.<br><br>$P(T \\mid H) = (1)(0.5) / 0.75 = \\mathbf{2/3 \\approx 66.7\\%}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; RARE DISEASE</div><div class="example-body"><strong>A disease affects 1 in 10000 people. A new test has 99% sensitivity and 99% specificity. You test positive. What is $P(\\text{disease} \\mid \\text{positive})$?</strong><br><br>$P(D) = 0.0001$, $P(D') = 0.9999$, $P(T^+ \\mid D) = 0.99$, $P(T^+ \\mid D') = 0.01$.<br><br>$P(T^+) = (0.99)(0.0001) + (0.01)(0.9999) = 0.000099 + 0.009999 = 0.010098$.<br><br>$P(D \\mid T^+) = 0.000099 / 0.010098 \\approx \\mathbf{0.98\\%}$.<br><br>Less than 1%. The disease is so rare that even a 99% accurate test cannot push the posterior high after a single positive.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; QUALITY CONTROL</div><div class="example-body"><strong>Two production lines manufacture light bulbs. Line A produces 70% of output with a 2% defect rate. Line B produces 30% of output with a 6% defect rate. You pick a defective bulb at random — which line is it more likely from?</strong><br><br>$P(A) = 0.7, P(B) = 0.3, P(D \\mid A) = 0.02, P(D \\mid B) = 0.06$.<br><br>$P(D) = (0.02)(0.7) + (0.06)(0.3) = 0.014 + 0.018 = 0.032$.<br><br>$P(A \\mid D) = (0.02)(0.7) / 0.032 = 0.014 / 0.032 \\approx \\mathbf{43.75\\%}$, so $P(B \\mid D) \\approx 56.25\\%$. Line B, despite being smaller, contributes more defective bulbs.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SEQUENTIAL EVIDENCE</div><div class="example-body"><strong>Continuing problem 2: you take a second independent test, also positive. What is your posterior now?</strong><br><br>New prior: $P(D \\mid T_1^+) = 0.0098$ from problem 2. New posterior with second test:<br><br>$P(T_2^+) = (0.99)(0.0098) + (0.01)(0.9902) = 0.009702 + 0.009902 = 0.019604$.<br><br>$P(D \\mid T_1^+, T_2^+) = (0.99)(0.0098) / 0.019604 = 0.009702 / 0.019604 \\approx \\mathbf{49.5\\%}$.<br><br>Two independent positives bring you to about a 50/50 belief. A third would push you well past 90%.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; URN VARIATION</div><div class="example-body"><strong>Three urns: urn 1 has 5 red and 5 blue, urn 2 has 8 red and 2 blue, urn 3 has 1 red and 9 blue. You pick an urn uniformly at random and draw a red ball. What is the probability it came from urn 2?</strong><br><br>$P(U_1) = P(U_2) = P(U_3) = 1/3$. Likelihoods: $P(R \\mid U_1) = 0.5, P(R \\mid U_2) = 0.8, P(R \\mid U_3) = 0.1$.<br><br>$P(R) = (1/3)(0.5 + 0.8 + 0.1) = (1/3)(1.4) = 0.4667$.<br><br>$P(U_2 \\mid R) = (0.8)(1/3) / 0.4667 = 0.2667 / 0.4667 = \\mathbf{4/7 \\approx 57.1\\%}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; THE PROSECUTOR'S FALLACY</div><div class="example-body"><strong>A DNA match has a "random match probability" of 1 in 100,000 — meaning $P(\\text{match} \\mid \\text{innocent}) = 10^{-5}$. The defendant matches. Suppose the prior probability of guilt (before DNA) is 1 in 1000. What is the posterior probability of guilt given the match?</strong><br><br>Let $G$ = guilty. $P(G) = 0.001$, $P(M \\mid G) = 1$ (the guilty person matches), $P(M \\mid G') = 10^{-5}$.<br><br>$P(M) = (1)(0.001) + (10^{-5})(0.999) \\approx 0.001 + 0.00000999 \\approx 0.00101$.<br><br>$P(G \\mid M) = 0.001 / 0.00101 \\approx \\mathbf{99\\%}$.<br><br>A 99% posterior of guilt — strong but not the misleading "99.999% certain because the match probability is 1 in 100,000". The prior matters: change the prior of guilt to 1 in a million, and the posterior drops to about 9%.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; WEATHER FORECAST</div><div class="example-body"><strong>A weather forecaster predicts rain on 30% of days when it will rain, and on 10% of days when it won't. The base rate of rain on any given day is 20%. Today the forecaster predicts rain. What is $P(\\text{rain} \\mid \\text{prediction})$?</strong><br><br>Wait — re-read carefully: "predicts rain on 30% of days when it will rain" means $P(\\text{predict rain} \\mid \\text{rain}) = 0.30$? That seems wrong, but accept the wording. Let $R$ = rain, $P$ = predict rain.<br><br>$P(R) = 0.20$, $P(P \\mid R) = 0.30$, $P(P \\mid R') = 0.10$.<br><br>$P(P) = (0.30)(0.20) + (0.10)(0.80) = 0.06 + 0.08 = 0.14$.<br><br>$P(R \\mid P) = (0.30)(0.20) / 0.14 = 0.06 / 0.14 \\approx \\mathbf{42.9\\%}$.<br><br>The prediction more than doubles your belief in rain (from 20% to 43%), but does not make it likely.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; SCREENING POLICY</div><div class="example-body"><strong>For a disease with 0.5% prevalence, would you prefer a "screening" test with 99% sensitivity and 80% specificity, or a "diagnostic" test with 90% sensitivity and 99.5% specificity?</strong><br><br>Screening test: $P(T^+) = (0.99)(0.005) + (0.20)(0.995) = 0.00495 + 0.199 = 0.20395$.<br>$P(D \\mid T^+) = 0.00495 / 0.20395 \\approx \\mathbf{2.4\\%}$.<br><br>Diagnostic test: $P(T^+) = (0.90)(0.005) + (0.005)(0.995) = 0.0045 + 0.004975 = 0.009475$.<br>$P(D \\mid T^+) = 0.0045 / 0.009475 \\approx \\mathbf{47.5\\%}$.<br><br>The diagnostic test (higher specificity) gives a 20x higher posterior. <em>Specificity matters far more than sensitivity when the disease is rare</em>, because false positives dominate. This is the design principle behind two-stage screening: cheap screening test first, then a high-specificity confirmatory test.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Bayes' theorem is the launchpad for an entire branch of statistics and machine learning. In the ML track, you'll meet the <em>Naive Bayes classifier</em>, <em>Bayesian networks</em>, and <em>Bayesian neural networks</em> — all extensions of the four-piece structure (prior, likelihood, evidence, posterior) you learned today. The two ideas you must take with you: (1) always anchor on the prior before updating; (2) when someone quotes a "probability", ask which direction the conditioning runs.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bayes' theorem: $P(A \\mid B) = P(B \\mid A) P(A) / P(B)$, derived in one line from $P(A \\cap B) = P(B \\cap A)$</li>
<li>Four named pieces: <em>prior, likelihood, evidence, posterior</em></li>
<li>Total probability: $P(B) = \\sum_i P(B \\mid A_i) P(A_i)$ over any partition $\\{A_i\\}$</li>
<li>Medical test paradox: rare disease + 95% accurate test gives a posterior near 9%, not 95%</li>
<li>Sequential updating: today's posterior becomes tomorrow's prior</li>
<li>Likelihood ratio $P(B \\mid A)/P(B \\mid A')$ controls how much evidence shifts belief</li>
<li>Base-rate fallacy: ignoring the prior leads to gross overconfidence in rare-event conclusions</li>
<li>Prosecutor's fallacy: confusing $P(B \\mid A)$ with $P(A \\mid B)$ — courtrooms have done real damage</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Sana nadir görülen bir hastalık için yapılan testin pozitif çıktığı söylendi.</strong> Test "%95 doğru". Hastalığa sahip olma olasılığın gerçekten nedir? Çoğu insan — çoğu doktor da dahil — %90 civarında bir tahmin yapar. 100 kişide 1 görülen bir hastalık için doğru cevap <strong>%9</strong>'a daha yakındır. On katlık bir hata. Bu boşluğu kapatan araç, olasılığın en önemli formülüdür: <em>Bayes teoremi</em>.</p>

<p class="l-text">96. derste "A verildiğinde B'nin olasılığı nedir?" sorusunu $P(B \\mid A) = P(A \\cap B) / P(A)$ koşullu formülüne çevirmeyi öğrendin. Bayes teoremi şimdi soruyu diğer yönde çevirmeyi sağlıyor: gözlemlediğin şey verildiğinde, sebebin olasılığı nedir? Bu, spam filtrelerinin, tıbbi tanının, GPS konumlamasının ve modern makine öğrenmesinin büyük bölümünün arkasındaki motordur. Bu dersin sonunda onu iki satırda türeteceksin, birkaç klasik probleme uygulayacaksın ve "%95 doğru" demenin neden güven verici görünüp önsel (prior) olmadan neredeyse anlamsız olduğunu anlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bayes teoremini $P(A \\cap B)$ simetrisinden iki kısa adımda türetmeyi</li>
<li>Her Bayes problemindeki dört adlandırılmış parçayı — <em>önsel, olabilirlik, kanıt, sonsal</em> — tanımayı</li>
<li>Bir bölümlemeden $P(B)$ paydasını hesaplamak için toplam olasılık yasasını kullanmayı</li>
<li>Klasik tıbbi test paradoksunu çözmeyi ve "%95 doğru" bir testin neden %9'luk sonsal verdiğini düz dille açıklamayı</li>
<li>Yeni kanıt geldikçe inançları ardışık olarak güncellemeyi (bugünün sonsalı yarının önseli olur)</li>
<li><em>Taban oran yanılgısını</em> ve <em>savcı yanılgısını</em> — $P(A \\mid B)$ ile $P(B \\mid A)$'yı karıştırmayı — fark etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Her Şeyi Başlatan Simetri</h2>

<div class="calc-highlight"><strong>Bayes teoreminin tamamı tek bir gözlemden çıkar:</strong> "A ve B birlikte gerçekleşir" olayı ile "B ve A birlikte gerçekleşir" olayı aynı şeydir. Bu yüzden $P(A \\cap B) = P(B \\cap A)$. Bu apaçık doğruyu 96. dersteki koşullu olasılık formülüyle birleştir, ünlü teorem iki satırda ortaya çıkar.</div>

<p class="l-text">Önceki dersteki koşullu olasılık tanımını hatırla. $P(B) > 0$ ve $P(A) > 0$ ise:</p>

<div class="calc-formula"><div class="formula-label">KOŞULLU OLASILIK (L96'DAN)</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)} \\qquad\\text{ve}\\qquad P(B \\mid A) \\;=\\; \\frac{P(B \\cap A)}{P(A)}$$</div><div class="formula-sub">İki tanım, koşullamanın her yönü için bir tane.</div></div>

<p class="l-text"><strong>Her iki tarafı paydayla çarp.</strong> Ortak olasılığı hesaplamanın iki yolunu elde ederiz:</p>

<div class="calc-formula"><div class="formula-label">ORTAK OLASILIK, İKİ YOL</div><div class="formula-main">$$P(A \\cap B) \\;=\\; P(A \\mid B) \\, P(B) \\;=\\; P(B \\mid A) \\, P(A)$$</div><div class="formula-sub">Aynı olasılık, iki farklı koşullama yolundan yazılmış.</div></div>

<p class="l-text">Şimdi sağdaki iki ifadeyi eşitle — çünkü aynı sayıyı tarif ediyorlar — ve $P(B)$'ye böl:</p>

<div class="calc-formula"><div class="formula-label">BAYES TEOREMİ</div><div class="formula-main">$$\\boxed{\\;P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\, P(A)}{P(B)}\\;}$$</div><div class="formula-sub">Hepsi bu. Koşullu olasılık tanımından bir satırlık cebir.</div></div>

<p class="l-text">Sihir yok. İleri matematik yok. Sadece $P(A \\cap B) = P(B \\cap A)$ eşitliğinin yeniden düzenlenmesi. Ama sonuçlar muazzamdır, çünkü sol taraf ile sağ taraf koşullamanın yönünü çevirir — ve hemen hemen her gerçek problemde bir yönü bilmesi kolay, diğer yönü ise asıl bilmek istediğindir.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bayes teoremini küçük bir örnek üzerinde elle doğrula. $P(A) = 0.3$, $P(B) = 0.4$, $P(B \\mid A) = 0.5$ olsun. $P(A \\mid B)$ nedir? Yerine koy: $P(A \\mid B) = (0.5)(0.3) / 0.4 = 0.15 / 0.4 = 0.375$. Cevap önsel $P(A) = 0.3$'ten büyük çıktı — $B$'yi gözlemlemek $A$'ya olan inancımızı <em>artırdı</em>, çünkü $A$, $B$'yi ortalamadan daha olası kılıyor.</div></div>

<h2 class="lesson-title">2. Sözlük: Önsel, Olabilirlik, Kanıt, Sonsal</h2>

<div class="calc-highlight"><strong>Bayes teoreminin dört parçası vardır ve her birinin sürekli duyacağın bir adı vardır.</strong> İsimleri şimdi öğren çünkü bu dersteki her Bayesçi problem, makine öğrenmesi ve bilimsel çıkarım tam olarak bu dört kelimeyi kullanır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Önsel &mdash; $P(A)$</div><div class="card-body">Yeni kanıt $B$'yi görmeden <em>önce</em> $A$ hakkında inandıkların. Taban oranlardan, geçmiş verilerden veya alan bilgisinden gelebilir.</div></div>
<div class="calc-card"><div class="card-title">Olabilirlik &mdash; $P(B \\mid A)$</div><div class="card-body">$A$ doğru olsaydı, $B$ kanıtının ne kadar olası olduğu? İleri yönde oku: sebep $\\rightarrow$ etki. Genellikle hesaplaması veya ölçmesi kolay olan büyüklük.</div></div>
<div class="calc-card"><div class="card-title">Kanıt &mdash; $P(B)$</div><div class="card-body">Tüm olası sebepler üzerinde $B$'yi görmenin toplam (marjinal) olasılığı. Normalleştirme sabiti. Toplam olasılık yasasından hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">Sonsal &mdash; $P(A \\mid B)$</div><div class="card-body">Kanıtı gördükten <em>sonra</em> $A$ hakkındaki güncellenmiş inancın. Genellikle istediğin sayı. Yön: etki $\\rightarrow$ sebep.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BAYES, KELİMELERLE</div><div class="formula-main">$$\\text{sonsal} \\;=\\; \\frac{\\text{olabilirlik} \\times \\text{önsel}}{\\text{kanıt}}$$</div><div class="formula-sub">Bu iskeleti ezberle. Karşılaşacağın her Bayes problemi bu dört yuvaya yerleşir.</div></div>

<p class="l-text"><strong>Neden "ters çevir"?</strong> Olabilirlik $P(B \\mid A)$ <em>ileri</em> yönde işler: hastalığım varsa, testin alarm vermesinin olasılığı nedir? Bu bir laboratuvarın 1000 bilinen hastayı test ederek ölçebileceği bir şeydir. Sonsal $P(A \\mid B)$ <em>geri</em> yönde işler: pozitif test aldım — hastalığım olma olasılığı nedir? Hastanın bilmek istediği budur. Bayes teoremi ileri ve geri yönler arasındaki köprüdür.</p>

<div class="l-note"><strong>Gösterim hatırlatması.</strong> $A'$ (ya da $A^c$, ya da $\\overline{A}$), "A değil" demektir, tümleyendir. Yani $P(A') = 1 - P(A)$. Boyunca kesme işaretli formu kullanacağız.</div>

<h2 class="lesson-title">3. Kanıtı Hesaplamak: Toplam Olasılık</h2>

<div class="calc-highlight"><strong>Bayes teoremindeki $P(B)$ paydası nadiren doğrudan verilir.</strong> Neredeyse her zaman onu toplam olasılık yasasından hesaplaman gerekir — $B$'nin her olası $A$ değerine olan katkılarını toplayarak. Çoğu öğrencinin tökezlediği adım budur. Resme sahip olduğunda mekaniktir.</div>

<p class="l-text">En basit sürüm: $A$ ya gerçekleşir ya da gerçekleşmez ise, $B$ olayı "A yoluyla" ya da "$A'$ yoluyla" oluşabilir. Bu iki yol karşılıklı dışlayıcıdır (bir sonucun aynı anda hem $A$ doğru hem de $A$ yanlış olamaz) ve kapsayıcıdır (her sonuçta $A$ ya doğrudur ya yanlıştır). Yani:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM OLASILIK YASASI (İKİ-PARÇALI BÖLÜMLEME)</div><div class="formula-main">$$P(B) \\;=\\; P(B \\mid A) \\, P(A) \\;+\\; P(B \\mid A') \\, P(A')$$</div><div class="formula-sub">"B'nin olasılığı" = (sebep verildiğinde B'nin olasılığı) çarpı (sebebin olasılığı), tüm sebepler üzerinden toplam.</div></div>

<p class="l-text">Bunu Bayes teoremine yerleştirmek pratikte en sık kullanacağın biçimi verir:</p>

<div class="calc-formula"><div class="formula-label">GENİŞLETİLMİŞ PAYDALI BAYES</div><div class="formula-main">$$P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\, P(A)}{P(B \\mid A) \\, P(A) + P(B \\mid A') \\, P(A')}$$</div><div class="formula-sub">Sağdaki dört giriş de "ileri" büyüklüklerdir: önseller ve olabilirlikler. Sihirli bir bileşene ihtiyaç yok.</div></div>

<p class="l-text"><strong>Genel bölümleme.</strong> Örneklem uzayı $n$ tane karşılıklı dışlayıcı ve kapsayıcı $A_1, A_2, \\ldots, A_n$ olayına (bir <em>bölümlemeye</em>) ayrılırsa ve $B$'yi gözlemlersek, belirli bir sebep $A_i$ için sonsal:</p>

<div class="calc-formula"><div class="formula-label">$n$-PARÇALI BÖLÜMLEMEYLE BAYES</div><div class="formula-main">$$P(A_i \\mid B) \\;=\\; \\frac{P(B \\mid A_i) \\, P(A_i)}{\\displaystyle\\sum_{j=1}^{n} P(B \\mid A_j) \\, P(A_j)}$$</div><div class="formula-sub">Pay: belirli $A_i$ sebebinin katkısı. Payda: tüm sebepler üzerindeki toplam katkı — normalleştirici.</div></div>

<div class="think-box"><div class="think-label">DOĞRULAMA</div><div class="think-body">Her sebep üzerinden sonsalları toplarsan her zaman 1 elde etmelisin. Yani $\\sum_{i=1}^{n} P(A_i \\mid B) = 1$. Neden? Çünkü paylar paydaya toplanır — payda tam olarak böyle inşa edildi. Sonsallar olası sebepler üzerinde bir olasılık dağılımı oluşturur.</div></div>

<h2 class="lesson-title">4. Tıbbi Test Paradoksu</h2>

<div class="calc-highlight"><strong>Bu dünyanın en ünlü Bayes problemidir.</strong> Bir test "%95 doğru" ve pozitif sonuç aldın. Hastalığa sahip olma olasılığın %95 civarındadır, değil mi? Hayır — ve sezgi ile gerçeklik arasındaki uçurum çok büyüktür. Bu tek örneği anlamak on ders teoriye bedeldir.</div>

<p class="l-text"><strong>Kurulum.</strong> Bir hastalığın toplumda taban oranı (yaygınlığı) <strong>%1</strong>. Hastalık için bir test şu özelliklere sahip:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Duyarlılık %95</div><div class="card-body">$P(\\text{pozitif} \\mid \\text{hastalık}) = 0.95$. Hastalığın varsa test bunu %95 yakalar.</div></div>
<div class="calc-card"><div class="card-title">Özgüllük %90</div><div class="card-body">$P(\\text{negatif} \\mid \\text{hastalık yok}) = 0.90$. Hastalığın yoksa test %90 doğru sonuç verir, yani %10 oranında yanlış pozitif verir.</div></div>
</div>

<p class="l-text"><strong>Soru.</strong> Pozitif çıktın. $P(\\text{hastalık} \\mid \\text{pozitif})$ nedir?</p>

<p class="l-text"><strong>Bayes'i kuralım.</strong> $D$ = "hastalığa sahip" ve $T^+$ = "test pozitif" olsun. Dört bileşen:</p>

<div class="calc-formula"><div class="formula-label">DÖRT BİLEŞEN</div><div class="formula-main">$$\\begin{aligned} P(D) &= 0.01 \\quad &\\text{(önsel)} \\\\ P(D') &= 0.99 \\\\ P(T^+ \\mid D) &= 0.95 \\quad &\\text{(duyarlılık)} \\\\ P(T^+ \\mid D') &= 0.10 \\quad &\\text{(1 - özgüllük)} \\end{aligned}$$</div></div>

<p class="l-text"><strong>Toplam olasılık yasasıyla kanıtı hesapla:</strong></p>

<div class="calc-formula"><div class="formula-label">P(T+)</div><div class="formula-main">$$P(T^+) \\;=\\; P(T^+ \\mid D)\\,P(D) + P(T^+ \\mid D')\\,P(D') \\;=\\; (0.95)(0.01) + (0.10)(0.99)$$</div><div class="formula-main">$$= \\; 0.0095 + 0.099 \\;=\\; 0.1085$$</div></div>

<p class="l-text"><strong>Bayes teoremini uygula:</strong></p>

<div class="calc-formula"><div class="formula-label">SONSAL</div><div class="formula-main">$$P(D \\mid T^+) \\;=\\; \\frac{P(T^+ \\mid D)\\,P(D)}{P(T^+)} \\;=\\; \\frac{(0.95)(0.01)}{0.1085} \\;=\\; \\frac{0.0095}{0.1085} \\;\\approx\\; 0.0876$$</div><div class="formula-sub">Yaklaşık <strong>%8.76</strong>. %95 değil. %90 değil. %9'dan az.</div></div>

<p class="l-text"><strong>Neden bu kadar düşük?</strong> 1000 rastgele insan hayal et. Yaklaşık 10'unda hastalık vardır (%1); 990'ında yoktur. Hasta 10 kişiden 9.5'i pozitif çıkar. Sağlıklı 990 kişiden 99'u pozitif çıkar (%10 yanlış-pozitif oranı). Toplam $9.5 + 99 \\approx 108.5$ pozitiften yalnızca 9.5'i gerçekten hastadır. Oran $9.5 / 108.5 \\approx \\%8.8$. Yanlış pozitifler doğru pozitifleri <em>boğar</em>, çünkü hastalık nadirdir.</p>

<div class="calc-graph"><div id="plot-l97-medtest-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Dikey eksende $P(D \\mid T^+)$ sonsal olasılığı, yatay eksende önsel (taban oran) $P(D)$, üç farklı test kalitesi kombinasyonu için. Tüm eğrilerin solda sıfıra yakın başladığına dikkat et — nadir hastalıklar için çok doğru bir test bile sonsalı yükseğe itemiyor. Hastalık nadir olduğunda testin kalitesi önselden daha az önemlidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function posterior(prior, sens, spec){var fp = 1 - spec; return sens*prior / (sens*prior + fp*(1-prior));}
var priors = []; for(var i = 0; i <= 100; i++){ priors.push(i/100); }
function curve(sens, spec){return priors.map(function(p){return posterior(p, sens, spec);});}
var c1 = {x: priors, y: curve(0.95, 0.90), mode:'lines', name: 'duy=%95, özg=%90', line:{color:'#3b82f6', width:3}};
var c2 = {x: priors, y: curve(0.99, 0.95), mode:'lines', name: 'duy=%99, özg=%95', line:{color:'#f59e0b', width:3}};
var c3 = {x: priors, y: curve(0.99, 0.999), mode:'lines', name: 'duy=%99, özg=%99.9', line:{color:'#10b981', width:3}};
var diag = {x: [0,1], y: [0,1], mode:'lines', name:'y = x (bilgisiz)', line:{color:'rgba(255,255,255,0.25)', width:1.5, dash:'dot'}};
var marker = {x:[0.01], y:[posterior(0.01, 0.95, 0.90)], mode:'markers+text', name:'%1 önsel örnek', marker:{color:'#ef4444', size:11}, text:['~%8.8'], textposition:'top right', textfont:{color:'#e8e8e8', size:11}};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{title:'önsel P(D)', range:[0,1], gridcolor:'rgba(255,255,255,0.06)', zerolinecolor:'rgba(255,255,255,0.2)'}, yaxis:{title:'sonsal P(D | pozitif)', range:[0,1], gridcolor:'rgba(255,255,255,0.06)', zerolinecolor:'rgba(255,255,255,0.2)'}, margin:{t:30, r:30, b:55, l:65}, legend:{orientation:'h', y:1.1, xanchor:'center', x:0.5}};
Plotly.newPlot('plot-l97-medtest-tr',[c1,c2,c3,diag,marker], lay, {responsive:true, displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Pratik ders.</strong> Nadir bir durumu tarama yaparken, tek bir pozitif test zayıf bir kanıttır. Bu yüzden doktorlar doğrulayıcı testler ister: her bağımsız pozitif sonsal oranlarını çarpar. İki bağımsız pozitiften sonra %8.8 dramatik şekilde artar (hesabı 6. bölümde yapacağız).</div>

<h2 class="lesson-title">5. Ağaç Diyagramı: İleri ve Geri Akış</h2>

<div class="calc-highlight"><strong>Olasılık ağacı Bayes'i görselleştirir.</strong> İleri dallar olabilirlikleri verir (sebep $\\rightarrow$ etki). Geriye doğru hesaplama, sonsalı bulmak için koşullamayı çevirir. Ağacı çizmek Bayes problemlerinde aritmetik hatalardan kaçınmanın en güvenilir yoludur.</div>

<p class="l-text">Tıbbi test örneği için ağaç iki aşamada bölünür. <strong>Aşama 1:</strong> bilinmeyen $D$ ve $D'$ için $P(D) = 0.01$ ve $P(D') = 0.99$ olasılıklarıyla dallan. <strong>Aşama 2:</strong> her birinden test sonucu için $P(T^+ \\mid D), P(T^- \\mid D), P(T^+ \\mid D'), P(T^- \\mid D')$ koşullu olasılıklarıyla dallan. Dört yaprak düğüm dört ortak olasılığı verir ve bunların toplamı 1'dir.</p>

<div class="calc-graph"><div id="plot-l97-tree-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> tıbbi test için iki aşamalı ağaç. İleri yol bir dal boyunca olasılıkları çarpar ve $P(D \\cap T^+)$ ortak olasılığını verir. Geri yöndeki Bayes ters çevirmesi, bu ortaklardan birini $P(T^+)$ marjinaline böler ve $P(D \\mid T^+)$ sonsalını verir. Dört kırmızı yaprak dört ortak sonucu temsil eder; toplamlarının 1 olduğunu kontrol edebilirsin.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var edges = {x:[0,1, null, 0,1, null, 1,2, null, 1,2, null, 1,2, null, 1,2], y:[0,1, null, 0,-1, null, 1,1.5, null, 1,0.5, null, -1,-0.5, null, -1,-1.5], mode:'lines', name:'ağaç kenarları', line:{color:'rgba(255,255,255,0.35)', width:1.5}, showlegend:false};
var nodes = {x:[0, 1, 1, 2, 2, 2, 2], y:[0, 1, -1, 1.5, 0.5, -0.5, -1.5], mode:'markers+text', name:'düğümler', marker:{color:['#3b82f6','#10b981','#10b981','#ef4444','#ef4444','#ef4444','#ef4444'], size:14}, text:['başlangıç','D<br>0.01','D\\'<br>0.99','T+<br>0.0095','T-<br>0.0005','T+<br>0.099','T-<br>0.891'], textposition:'middle right', textfont:{color:'#e8e8e8', size:11}};
var labels = {x:[0.5, 0.5, 1.5, 1.5, 1.5, 1.5], y:[0.55, -0.55, 1.32, 0.72, -0.72, -1.32], mode:'text', name:'kenar etiketleri', text:['P(D)=0.01','P(D\\')=0.99','P(T+|D)=0.95','P(T-|D)=0.05','P(T+|D\\')=0.10','P(T-|D\\')=0.90'], textfont:{color:'#f59e0b', size:10}, showlegend:false};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{range:[-0.4, 3.2], showgrid:false, zeroline:false, visible:false}, yaxis:{range:[-2, 2], showgrid:false, zeroline:false, visible:false}, margin:{t:20, r:20, b:20, l:20}, showlegend:false};
Plotly.newPlot('plot-l97-tree-tr',[edges, labels, nodes], lay, {responsive:true, displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Ağacı okumak.</strong> Her yaprak bir ortak olasılıktır — dal boyunca çarpım. Dört yaprağın toplamı $0.0095 + 0.0005 + 0.099 + 0.891 = 1.000$ (güzel — tüm sonuçları tüketiyor). $P(D \\mid T^+)$'yi bulmak için $T^+$ içeren tüm yaprakları topla ve "bunların ne kadarı $D$ dalından geldi?" diye sor. Bu tam olarak Bayes teoremidir.</p>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK</div><div class="example-body"><strong>Aynı ağaç, ama test negatif çıktı.</strong> $P(D \\mid T^-)$ nedir?<br><br>$P(T^-) = P(T^- \\mid D) P(D) + P(T^- \\mid D') P(D') = (0.05)(0.01) + (0.90)(0.99) = 0.0005 + 0.891 = 0.8915$.<br><br>$P(D \\mid T^-) = \\dfrac{(0.05)(0.01)}{0.8915} \\approx 0.00056 \\approx \\mathbf{\\%0.056}$.<br><br>Yani negatif test sonsalını %1 önselden %0.056'ya düşürür — güçlü bir azalma. Nadir hastalıklar için negatif testler pozitif testlerden çok daha fazla bilgi taşır.</div></div>

<h2 class="lesson-title">6. Ardışık Bayes: Bugünün Sonsalı Yarının Önselidir</h2>

<div class="calc-highlight"><strong>Daha fazla veri geldiğinde sonsalını atmak zorunda değilsin.</strong> İlk gözlemden gelen sonsal, ikinci gözlem için önsel olur ve Bayes'i tekrar uygularsın. Kanıt biriktikçe bilimsel inanç böyle güncellenir — ve spam filtreleri ile makine öğrenmesi modelleri akış verilerinden böyle öğrenir.</div>

<p class="l-text">İlk pozitif testten sonra, aynı özelliklere sahip ikinci bir <em>bağımsız</em> test yaptığını varsay. İlk pozitif inancını $P(D) = 0.01$'den $P(D \\mid T_1^+) \\approx 0.0876$'ya kaydırdı. Şimdi bu yeni önselin oluyor. Bayes'i tekrar uygula:</p>

<div class="calc-formula"><div class="formula-label">İKİNCİ POZİTİF TEST</div><div class="formula-main">$$P(D \\mid T_1^+, T_2^+) \\;=\\; \\frac{P(T_2^+ \\mid D)\\,P(D \\mid T_1^+)}{P(T_2^+ \\mid D)\\,P(D \\mid T_1^+) + P(T_2^+ \\mid D')\\,P(D' \\mid T_1^+)}$$</div><div class="formula-main">$$= \\; \\frac{(0.95)(0.0876)}{(0.95)(0.0876) + (0.10)(0.9124)} \\;=\\; \\frac{0.0832}{0.0832 + 0.0912} \\;\\approx\\; 0.477$$</div></div>

<p class="l-text">İkinci bağımsız pozitif sonsalı %9'dan <strong>yaklaşık %48'e</strong> sıçratır. Bağımsız doğrulama muazzam fark yaratır. Üçüncüden sonra %90'ı aşar. Bu, çok aşamalı taramanın arkasındaki ilkedir.</p>

<div class="think-box"><div class="think-label">ANAHTAR FİKİR</div><div class="think-body">Ardışık Bayes değişmelidir: kanıtı hangi sırayla işlediğin önemli değildir. Üç bağımsız pozitif herhangi bir sırada aynı son sonsalı verir. Bu, çerçevenin en zarif özelliklerinden biridir — tıpkı $P(T_1^+ \\cap T_2^+ \\cap T_3^+ \\cap D)$ ortak olasılığının sıralamadan bağımsız olduğu gibi, matematik de sıra-bağımsızdır.</div></div>

<h2 class="lesson-title">7. Spam Filtresi</h2>

<div class="calc-highlight"><strong>Modern spam filtreleri Bayes teoremi üzerine inşa edilmiştir.</strong> "Naive Bayes" sınıflandırıcısı (ML rotasında tanışacaksın), bir e-postadaki her kelimeyi bağımsız bir kanıt parçası olarak değerlendirir ve $P(\\text{spam} \\mid \\text{e-posta})$ elde etmek için Bayes ile birleştirir. Sezgi lise düzeyindedir; uygulama bilgisayar biliminde olasılığın en başarılı uygulamalarından biridir.</div>

<p class="l-text"><strong>Kurulum.</strong> Gelen tüm e-postaların %30'unun spam olduğunu varsay. "ücretsiz" kelimesinin spam e-postaların %60'ında, meşru e-postaların yalnızca %5'inde göründüğünü ölçtük. Yeni bir e-posta "ücretsiz" kelimesini içeriyor. Spam mıdır?</p>

<p class="l-text">$S$ = "spam", $F$ = "ücretsiz içerir" olsun. Dört parça:</p>

<div class="calc-formula"><div class="formula-label">SPAM FİLTRESİ GİRİŞLERİ</div><div class="formula-main">$$P(S) = 0.30, \\quad P(S') = 0.70, \\quad P(F \\mid S) = 0.60, \\quad P(F \\mid S') = 0.05$$</div></div>

<p class="l-text"><strong>Bayes'i uygula:</strong></p>

<div class="calc-formula"><div class="formula-label">SPAM SONSAL</div><div class="formula-main">$$P(S \\mid F) \\;=\\; \\frac{(0.60)(0.30)}{(0.60)(0.30) + (0.05)(0.70)} \\;=\\; \\frac{0.18}{0.18 + 0.035} \\;=\\; \\frac{0.18}{0.215} \\;\\approx\\; 0.837$$</div></div>

<p class="l-text">Tek "ücretsiz" kelimesi genel bir e-postayı %30 spam olasılığından <strong>%83.7'ye</strong> iter. Şimdi "ki" gibi nötr bir kelimeyle karşılaştır — bu kelime belki spam'in %90'ında <em>ve</em> meşru e-postaların %90'ında geçer. Yerine koy: sonsal = $(0.9)(0.3) / [(0.9)(0.3) + (0.9)(0.7)] = 0.27 / 0.90 = 0.30$. Önselle aynı — bilgi yok. Kelimeler <em>spam'de meşru e-postadan farklı oranda göründüğü ölçüde</em> bilgi taşır.</p>

<div class="l-note"><strong>Genel ilke.</strong> Kanıt inancını <em>olabilirlik oranı</em> $P(B \\mid A) / P(B \\mid A')$ kadar kaydırır. 1'den büyük oranlar sonsalı yukarı iter; 1'den küçük oranlar aşağı iter; tam 1 oran bilgisizdir. Bayes teoremi senin için bu oranı bir olasılığa dönüştürür.</div>

<h2 class="lesson-title">8. Çalışılmış Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; ÜÇ FABRİKA MAKİNESİ</div><div class="example-body">Bir fabrikada özdeş cıvatalar üreten üç makine vardır. Makine A üretimin %50'sini yapar ve %1 hatalıdır. Makine B üretimin %30'unu yapar ve %2 hatalıdır. Makine C üretimin %20'sini yapar ve %5 hatalıdır. Envanterde hatalı bir cıvata bulundu. Makine C'den gelme olasılığı nedir?<br><br>$A, B, C$ "makine A, B, C tarafından üretilmiş" olaylarını, $D$ = "hatalı" olsun. Girişler: $P(A) = 0.5, P(B) = 0.3, P(C) = 0.2$ ve $P(D \\mid A) = 0.01, P(D \\mid B) = 0.02, P(D \\mid C) = 0.05$.<br><br>Toplam: $P(D) = (0.01)(0.5) + (0.02)(0.3) + (0.05)(0.2) = 0.005 + 0.006 + 0.010 = 0.021$.<br><br>Sonsal: $P(C \\mid D) = (0.05)(0.2) / 0.021 = 0.010 / 0.021 \\approx \\mathbf{\\%47.6}$.<br><br>Makine C cıvataların sadece %20'sini yapsa da hatalıların %47.6'sını oluşturuyor — daha yüksek hata oranı baskındır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; KAVANOZ PROBLEMİ</div><div class="example-body">Kavanoz 1 içinde 3 kırmızı ve 7 mavi top var. Kavanoz 2 içinde 6 kırmızı ve 4 mavi top var. Adil bir parayı atıyorsun: yazı, kavanoz 1'den çekiyorsun; tura, kavanoz 2'den. Çektiğin top kırmızı. Kavanoz 1'den çekmiş olma olasılığın nedir?<br><br>Girişler: $P(U_1) = P(U_2) = 0.5$, $P(R \\mid U_1) = 3/10 = 0.3$, $P(R \\mid U_2) = 6/10 = 0.6$.<br><br>Toplam: $P(R) = (0.3)(0.5) + (0.6)(0.5) = 0.15 + 0.30 = 0.45$.<br><br>Sonsal: $P(U_1 \\mid R) = (0.3)(0.5) / 0.45 = 0.15 / 0.45 = \\mathbf{1/3 \\approx \\%33.3}$.<br><br>Kırmızı top kavanoz 2'yi daha olası kılar (kavanoz 2'de daha fazla kırmızı olduğu için), bu yüzden kavanoz-1 sonsalı 1/2 önselden 1/3 sonsala düştü. Tersi: $P(U_2 \\mid R) = 2/3$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; MONTY HALL (KISACA)</div><div class="example-body">Yarışma programında üç kapıdan 1'i seçiyorsun. Sunucu (ödülün nerede olduğunu bilen), bir keçiyi göstermek için kapı 3'ü açıyor. Kapı 2'ye geçmeli misin?<br><br>$H_i$ = "ödül kapı $i$'nin arkasında" olsun, önseller $P(H_1) = P(H_2) = P(H_3) = 1/3$. $O_3$ = "sunucu kapı 3'ü açar".<br><br>Olabilirlikler: $P(O_3 \\mid H_1) = 1/2$ (sunucu kapı 2 ve 3 arasından serbestçe seçer); $P(O_3 \\mid H_2) = 1$ (sunucu kapı 2 arkasındaki ödülden ve senin seçimin kapı 1'den kaçınmalı); $P(O_3 \\mid H_3) = 0$ (sunucu ödülü göstermez).<br><br>Toplam: $P(O_3) = (1/2)(1/3) + (1)(1/3) + (0)(1/3) = 1/2$.<br><br>$P(H_2 \\mid O_3) = (1)(1/3) / (1/2) = \\mathbf{2/3}$. Geçmek kazanma olasılığını 1/3'ten 2/3'e iki katına çıkarır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; ÖNSELE DUYARLILIK</div><div class="example-body">4. bölümdeki aynı tıbbi test (duy %95, özg %90). Önsel %1 yerine %30 ise (güçlü semptomları olan yüksek riskli bir hasta) ne olur?<br><br>$P(T^+) = (0.95)(0.3) + (0.10)(0.7) = 0.285 + 0.070 = 0.355$.<br><br>$P(D \\mid T^+) = (0.95)(0.3) / 0.355 = 0.285 / 0.355 \\approx \\mathbf{\\%80.3}$.<br><br>Aynı test, aynı doğruluk — ama sonsal %9'dan (düşük önsel) %80'e (yüksek önsel) çıktı. <em>Test değişmiyor; yalnızca önsel sonucu değiştiriyor.</em> "Genel toplumu taramak" ile "hasta görünümlü bir hastayı test etmek" bu kadar farklı sonsallar veriyor.</div></div>

<h2 class="lesson-title">9. Önseller Üzerinden Sonsalı Görselleştirmek</h2>

<div class="calc-graph"><div id="plot-l97-priorpost-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> duyarlılık %95 ve özgüllük %90 sabit tutulduğunda, beş farklı önsel olasılıkta $P(D \\mid T^+)$ sonsalı sütun grafiği olarak. Mavi sütunlar sonsalı verir; kesikli çizgi önseli işaretler. Sonsalın her zaman önselin üstünde olduğunu görebilirsin (pozitif test inancı artırır), ama ne kadar yukarıda olduğu önselin kendisine büyük ölçüde bağlıdır. %5 önselin altında test neredeyse hiç yardımcı olmuyor; %30'un üstünde belirleyicidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function post(p){return 0.95*p / (0.95*p + 0.10*(1-p));}
var priors = [0.001, 0.01, 0.05, 0.1, 0.3, 0.5, 0.7];
var posts = priors.map(post);
var labs = priors.map(function(p){return '%' + (p*100).toFixed(1);});
var bars = {x: labs, y: posts.map(function(p){return p*100;}), type:'bar', name:'sonsal P(D|+)', marker:{color:'#3b82f6'}, text: posts.map(function(p){return '%' + (p*100).toFixed(1);}), textposition:'outside', textfont:{color:'#e8e8e8', size:11}};
var line = {x: labs, y: priors.map(function(p){return p*100;}), type:'scatter', mode:'lines+markers', name:'önsel P(D)', line:{color:'#f59e0b', width:2, dash:'dot'}, marker:{color:'#f59e0b', size:8}};
var lay = {paper_bgcolor:'#0a0a0a', plot_bgcolor:'#0a0a0a', font:{color:'#e8e8e8', family:'Geist'}, xaxis:{title:'önsel P(D)', gridcolor:'rgba(255,255,255,0.06)'}, yaxis:{title:'olasılık (%)', range:[0, 100], gridcolor:'rgba(255,255,255,0.06)'}, margin:{t:30, r:30, b:55, l:65}, legend:{orientation:'h', y:1.1, xanchor:'center', x:0.5}, barmode:'group'};
Plotly.newPlot('plot-l97-priorpost-tr',[bars, line], lay, {responsive:true, displayModeBar:false});
},250);</script>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TABAN ORAN YANILGISI</div><div class="compare-item">Önsel $P(A)$'yı görmezden gelmek ve sadece olabilirlik $P(B \\mid A)$'dan akıl yürütmek</div><div class="compare-item">"Test %95 doğru, yani hasta olma olasılığım %95" &mdash; <strong>yanlış</strong></div><div class="compare-item">Çözüm: güncellemeden önce her zaman taban orana demir at</div><div class="compare-item">Klasik örnek: nadir hastalık testleri, haberlerdeki nadir olaylar, profilleme</div></div><div class="compare-col"><div class="compare-title">SAVCI YANILGISI</div><div class="compare-item">$P(\\text{kanıt} \\mid \\text{masum})$ ile $P(\\text{masum} \\mid \\text{kanıt})$'yi karıştırmak</div><div class="compare-item">"Masumsan DNA eşleşme olasılığı milyonda 1, demek ki sanık milyonda 1 olasılıkla masum" &mdash; <strong>yanlış</strong></div><div class="compare-item">Çözüm: Bayes teoremi; sonsal suçluluk önselinin olasılığına bağlıdır</div><div class="compare-item">Klasik örnek: özellikle DNA kanıtıyla mahkemeler</div></div></div>

<p class="l-text"><strong>Her iki hata da koşullama yönünü karıştırmaktan gelir.</strong> $P(A \\mid B)$ ve $P(B \\mid A)$ genel olarak farklı sayılardır ve onları yalnızca Bayes teoremi bağlar — önsel $P(A)$ ve kanıt $P(B)$ üzerinden. Birisi koşullamanın hangi yönde işlediğini belirtmeden bir "olasılık" alıntıladığında, iddiayı şüpheyle karşıla.</p>

<div class="l-note"><strong>Ünlü bir adli hata.</strong> 1999'da Sally Clark'ın iki bebeğinin ölümünden mahkûm edilmesi, "bir ailede iki beşik ölümü olasılığının 73 milyonda 1 olduğu" tanıklığına dayandı. Yargıç bunu örtük olarak "masum olma olasılığı" ile eşitledi. Ama $P(\\text{iki ölüm} \\mid \\text{masum})$, $P(\\text{masum} \\mid \\text{iki ölüm})$ ile aynı değildir — annelerin çifte cinayet işleme nadirliği üzerine bir önsel olmadan, ters çevirme anlamsızdır. Clark'ın mahkûmiyeti sonradan bozuldu. Yanılgı doğrudan ona üç yıllık hapis cezasına mal oldu.</div>

<h2 class="lesson-title">11. Alıştırma Problemleri</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; İKİ PARA</div><div class="example-body"><strong>Bir torbada iki para var. Biri adil, biri iki yüzlü (her iki tarafı da yazı). Rastgele birini al ve at; yazı geldi. İki yüzlü parayı almış olma olasılığın nedir?</strong><br><br>$F$ = adil, $T$ = iki yüzlü, $H$ = yazı olsun. Önseller $P(F) = P(T) = 0.5$. Olabilirlikler $P(H \\mid F) = 0.5$, $P(H \\mid T) = 1$.<br><br>$P(H) = (0.5)(0.5) + (1)(0.5) = 0.75$.<br><br>$P(T \\mid H) = (1)(0.5) / 0.75 = \\mathbf{2/3 \\approx \\%66.7}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; NADİR HASTALIK</div><div class="example-body"><strong>Bir hastalık 10000 kişiden 1'ini etkiliyor. Yeni bir test %99 duyarlılık ve %99 özgüllüğe sahip. Pozitif çıktın. $P(\\text{hastalık} \\mid \\text{pozitif})$ nedir?</strong><br><br>$P(D) = 0.0001$, $P(D') = 0.9999$, $P(T^+ \\mid D) = 0.99$, $P(T^+ \\mid D') = 0.01$.<br><br>$P(T^+) = (0.99)(0.0001) + (0.01)(0.9999) = 0.000099 + 0.009999 = 0.010098$.<br><br>$P(D \\mid T^+) = 0.000099 / 0.010098 \\approx \\mathbf{\\%0.98}$.<br><br>%1'den az. Hastalık o kadar nadirdir ki %99 doğru bir test bile tek pozitiften sonra sonsalı yükseğe itemiyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; KALİTE KONTROLÜ</div><div class="example-body"><strong>İki üretim hattı ampul üretiyor. Hat A üretimin %70'ini %2 hatalı oranıyla yapıyor. Hat B üretimin %30'unu %6 hatalı oranıyla yapıyor. Rastgele hatalı bir ampul aldın — hangi hattan gelme olasılığı daha yüksek?</strong><br><br>$P(A) = 0.7, P(B) = 0.3, P(D \\mid A) = 0.02, P(D \\mid B) = 0.06$.<br><br>$P(D) = (0.02)(0.7) + (0.06)(0.3) = 0.014 + 0.018 = 0.032$.<br><br>$P(A \\mid D) = (0.02)(0.7) / 0.032 = 0.014 / 0.032 \\approx \\mathbf{\\%43.75}$, yani $P(B \\mid D) \\approx \\%56.25$. Hat B daha küçük olmasına rağmen daha fazla hatalı ampule katkıda bulunuyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ARDIŞIK KANIT</div><div class="example-body"><strong>Problem 2'nin devamı: ikinci bağımsız bir test daha yapıyorsun, o da pozitif. Şu anki sonsalın nedir?</strong><br><br>Yeni önsel: problem 2'den $P(D \\mid T_1^+) = 0.0098$. İkinci testle yeni sonsal:<br><br>$P(T_2^+) = (0.99)(0.0098) + (0.01)(0.9902) = 0.009702 + 0.009902 = 0.019604$.<br><br>$P(D \\mid T_1^+, T_2^+) = (0.99)(0.0098) / 0.019604 = 0.009702 / 0.019604 \\approx \\mathbf{\\%49.5}$.<br><br>İki bağımsız pozitif seni yaklaşık 50/50 inanca getiriyor. Üçüncüsü ise seni %90'ın çok ötesine iter.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; KAVANOZ VARYASYONU</div><div class="example-body"><strong>Üç kavanoz: kavanoz 1'de 5 kırmızı ve 5 mavi, kavanoz 2'de 8 kırmızı ve 2 mavi, kavanoz 3'te 1 kırmızı ve 9 mavi top var. Rastgele bir kavanoz seçip kırmızı top çekiyorsun. Kavanoz 2'den gelme olasılığı nedir?</strong><br><br>$P(U_1) = P(U_2) = P(U_3) = 1/3$. Olabilirlikler: $P(R \\mid U_1) = 0.5, P(R \\mid U_2) = 0.8, P(R \\mid U_3) = 0.1$.<br><br>$P(R) = (1/3)(0.5 + 0.8 + 0.1) = (1/3)(1.4) = 0.4667$.<br><br>$P(U_2 \\mid R) = (0.8)(1/3) / 0.4667 = 0.2667 / 0.4667 = \\mathbf{4/7 \\approx \\%57.1}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; SAVCI YANILGISI</div><div class="example-body"><strong>Bir DNA eşleşmesinin "rastgele eşleşme olasılığı" 100,000'de 1 — yani $P(\\text{eşleşme} \\mid \\text{masum}) = 10^{-5}$. Sanık eşleşiyor. DNA'dan önce suçluluk önsel olasılığının 1000'de 1 olduğunu varsay. Eşleşme verildiğinde sonsal suçluluk olasılığı nedir?</strong><br><br>$G$ = suçlu olsun. $P(G) = 0.001$, $P(M \\mid G) = 1$ (suçlu kişi eşleşir), $P(M \\mid G') = 10^{-5}$.<br><br>$P(M) = (1)(0.001) + (10^{-5})(0.999) \\approx 0.001 + 0.00000999 \\approx 0.00101$.<br><br>$P(G \\mid M) = 0.001 / 0.00101 \\approx \\mathbf{\\%99}$.<br><br>%99 sonsal suçluluk — güçlü ama "eşleşme olasılığı 100,000'de 1 olduğu için %99.999 kesin" yanlışı değildir. Önsel önemlidir: suçluluk önselini milyonda 1'e çevir, sonsal yaklaşık %9'a düşer.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; HAVA TAHMİNİ</div><div class="example-body"><strong>Bir hava durumu tahmincisi yağmurun yağacağı günlerin %30'unda yağmur tahmini yapıyor ve yağmayacağı günlerin %10'unda yağmur tahmini yapıyor. Herhangi bir günde yağmur taban oranı %20. Bugün tahminci yağmur tahmin ediyor. $P(\\text{yağmur} \\mid \\text{tahmin})$ nedir?</strong><br><br>Bekle — dikkatle tekrar oku: "yağmurun yağacağı günlerin %30'unda yağmur tahmin etmek" demek $P(\\text{yağmur tahmini} \\mid \\text{yağmur}) = 0.30$ mu? Tuhaf görünüyor, ama ifadeyi kabul et. $R$ = yağmur, $P$ = yağmur tahmin et.<br><br>$P(R) = 0.20$, $P(P \\mid R) = 0.30$, $P(P \\mid R') = 0.10$.<br><br>$P(P) = (0.30)(0.20) + (0.10)(0.80) = 0.06 + 0.08 = 0.14$.<br><br>$P(R \\mid P) = (0.30)(0.20) / 0.14 = 0.06 / 0.14 \\approx \\mathbf{\\%42.9}$.<br><br>Tahmin yağmura olan inancını iki katından fazlaya çıkarıyor (%20'den %43'e), ama muhtemel kılmıyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; TARAMA POLİTİKASI</div><div class="example-body"><strong>%0.5 yaygınlığa sahip bir hastalık için, %99 duyarlılık ve %80 özgüllüklü bir "tarama" testi mi, yoksa %90 duyarlılık ve %99.5 özgüllüklü bir "tanı" testi mi tercih edersin?</strong><br><br>Tarama testi: $P(T^+) = (0.99)(0.005) + (0.20)(0.995) = 0.00495 + 0.199 = 0.20395$.<br>$P(D \\mid T^+) = 0.00495 / 0.20395 \\approx \\mathbf{\\%2.4}$.<br><br>Tanı testi: $P(T^+) = (0.90)(0.005) + (0.005)(0.995) = 0.0045 + 0.004975 = 0.009475$.<br>$P(D \\mid T^+) = 0.0045 / 0.009475 \\approx \\mathbf{\\%47.5}$.<br><br>Tanı testi (daha yüksek özgüllük) 20 kat daha yüksek sonsal verir. <em>Hastalık nadir olduğunda özgüllük duyarlılıktan çok daha önemlidir</em>, çünkü yanlış pozitifler baskındır. İki aşamalı taramanın arkasındaki tasarım ilkesi budur: önce ucuz tarama testi, sonra yüksek özgüllüklü doğrulayıcı test.</div></div>

<div class="l-note"><strong>İlerisini düşünmek.</strong> Bayes teoremi, istatistik ve makine öğrenmesinin tüm bir dalına fırlatma rampasıdır. ML rotasında <em>Naive Bayes sınıflandırıcısıyla</em>, <em>Bayesçi ağlarla</em> ve <em>Bayesçi sinir ağlarıyla</em> tanışacaksın — hepsi bugün öğrendiğin dört parçalı yapının (önsel, olabilirlik, kanıt, sonsal) uzantıları. Yanında götürmen gereken iki fikir: (1) güncellemeden önce her zaman önsele demir at; (2) birisi bir "olasılık" alıntıladığında koşullamanın hangi yönde işlediğini sor.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bayes teoremi: $P(A \\mid B) = P(B \\mid A) P(A) / P(B)$, $P(A \\cap B) = P(B \\cap A)$'dan tek satırda türetilir</li>
<li>Dört adlandırılmış parça: <em>önsel, olabilirlik, kanıt, sonsal</em></li>
<li>Toplam olasılık: herhangi bir $\\{A_i\\}$ bölümlemesi üzerinde $P(B) = \\sum_i P(B \\mid A_i) P(A_i)$</li>
<li>Tıbbi test paradoksu: nadir hastalık + %95 doğru test, %95 değil, %9'a yakın bir sonsal verir</li>
<li>Ardışık güncelleme: bugünün sonsalı yarının önseli olur</li>
<li>Olabilirlik oranı $P(B \\mid A)/P(B \\mid A')$ kanıtın inancı ne kadar kaydırdığını kontrol eder</li>
<li>Taban oran yanılgısı: önseli görmezden gelmek, nadir-olay sonuçlarında ciddi aşırı güvene yol açar</li>
<li>Savcı yanılgısı: $P(B \\mid A)$'yı $P(A \\mid B)$ ile karıştırmak — mahkemeler gerçek zarar verdi</li>
</ul>
</div>`

};
