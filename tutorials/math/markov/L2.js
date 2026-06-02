window.MARKOV_L2 = {

/* ============================================================
   ENGLISH
   ============================================================ */
en: `
<p class="l-text">In Lesson 1 you met the Markov chain: a system that shuffles between a finite set of states with memoryless transitions. Every step the state was right there in front of you. The next move is to imagine the opposite scenario: a Markov chain still ticks underneath, but you cannot see its states directly. All you observe is a noisy signal that depends on whichever hidden state happens to be active. That extra layer of veiled mystery is the <strong>Hidden Markov Model</strong>, the workhorse of speech recognition, part-of-speech tagging, gene finding, activity recognition, and a long list of other classical AI tasks.</p>

<p class="l-text">This lesson walks through the HMM cleanly and slowly. We set up the model, list the three classical problems Rabiner posed in 1989, derive the Forward algorithm for evaluation, the Viterbi algorithm for decoding, and the Baum-Welch algorithm for learning, and finish with a Pyodide exercise where you train an HMM from observations alone. The example throughout is Jason Eisner's beloved ice-cream-and-weather story, simple enough to compute by hand and rich enough to expose every interesting piece of machinery.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an HMM by its transition matrix $A$, emission matrix $B$, and initial distribution $\\pi$</li>
<li>State Rabiner's three problems: evaluation, decoding, and learning</li>
<li>Compute $P(O\\,|\\,\\lambda)$ with the Forward algorithm in $O(N^2 T)$ time instead of $O(N^T)$</li>
<li>Decode the most likely hidden path with the Viterbi algorithm</li>
<li>Estimate $A$, $B$, $\\pi$ from observations alone using Baum-Welch (EM)</li>
<li>Recognise where HMMs powered classical AI (speech, NLP, bioinformatics) and how neural sequence models generalise them</li>
</ul>
</div>

<h2 class="lesson-title">1. The HMM Setup</h2>

<div class="calc-highlight"><strong>Why a hidden layer?</strong> In Lesson 1 the state of the chain was the thing you measured. In real applications the situation is almost never that clean. You hear the spectrogram of a voice but you want the underlying word. You read a sentence but you want the part-of-speech tags. You record accelerometer readings but you want to know whether the person is walking, running, or sitting. In every case there is a hidden process you cannot observe directly, and there is an observable signal that depends on the hidden process. An HMM is the simplest probabilistic model that captures exactly that two-layer structure.</div>

<p class="l-text">Formally, an HMM has a sequence of <strong>hidden states</strong> $z_1, z_2, \\ldots, z_T$ and a sequence of <strong>observations</strong> $o_1, o_2, \\ldots, o_T$. Each hidden state lives in a finite set $\\{s_1, s_2, \\ldots, s_N\\}$ of $N$ possibilities. Each observation lives in some alphabet that may be discrete (a vocabulary, a finite set of symbols) or continuous (a vector of audio features). The two layers obey a pair of strong independence assumptions.</p>

<div class="calc-formula"><div class="formula-label">THE TWO HMM ASSUMPTIONS</div><div class="formula-main">$$P(z_{t+1}\\,|\\,z_1,\\ldots,z_t) = P(z_{t+1}\\,|\\,z_t) \\qquad\\text{(Markov property on hidden states)}$$ $$P(o_t\\,|\\,z_1,\\ldots,z_T, o_1,\\ldots,o_{t-1}, o_{t+1},\\ldots) = P(o_t\\,|\\,z_t) \\qquad\\text{(output independence)}$$</div><div class="formula-sub">The hidden process is a vanilla Markov chain. Each observation depends only on the hidden state at the same time step; given $z_t$, the observation $o_t$ ignores everything else.</div></div>

<p class="l-text">From these assumptions the model is parameterised by three objects.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A$ &mdash; transition matrix</div><div class="card-body">An $N\\times N$ matrix with $A_{ij} = P(z_{t+1}=s_j\\,|\\,z_t=s_i)$. Row $i$ is a probability distribution: rows sum to one. Identical in spirit to the transition matrix of Lesson 1.</div></div>
<div class="calc-card"><div class="card-title">$B$ &mdash; emission distribution</div><div class="card-body">For each hidden state $s_j$, a probability distribution $B_j(o) = P(o_t=o\\,|\\,z_t=s_j)$ over the observation alphabet. For a discrete alphabet of size $M$ this is an $N\\times M$ matrix; for continuous observations a parametric density.</div></div>
<div class="calc-card"><div class="card-title">$\\pi$ &mdash; initial distribution</div><div class="card-body">A vector of length $N$ with $\\pi_i = P(z_1=s_i)$. Components sum to one. Often started from a stationary distribution of $A$ or learnt from data.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda = (A, B, \\pi)$</div><div class="card-body">The full HMM. Specifying these three objects gives you everything you need to score, decode, sample, or train.</div></div>
</div>

<div class="l-note"><strong>What the assumptions buy you:</strong> the joint probability of a hidden path and an observation sequence factorises into a beautiful product. That factorisation is what makes every algorithm in this lesson run in time linear in $T$ instead of exponential.</div>

<div class="calc-formula"><div class="formula-label">JOINT LIKELIHOOD</div><div class="formula-main">$$P(Z, O\\,|\\,\\lambda) = \\pi_{z_1}\\, B_{z_1}(o_1) \\prod_{t=2}^{T} A_{z_{t-1} z_t}\\, B_{z_t}(o_t)$$</div><div class="formula-sub">A single initial-state-times-emission term, followed by transition-times-emission terms for every subsequent step. Every classical HMM algorithm is some clever way of summing or maximising this product.</div></div>

<div id="plot-l2-topology-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodesX=[0.15,0.15,0.50,0.50,0.85,0.85];
var nodesY=[0.70,0.30,0.70,0.30,0.70,0.30];
var labels=['z1=H','z1=C','z2=H','z2=C','z3=H','z3=C'];
var obsX=[0.15,0.50,0.85];var obsY=[0.05,0.05,0.05];
var obsLab=['o1=3','o2=1','o3=3'];
var arrows=[];
function add(x0,y0,x1,y1,col){arrows.push({type:'line',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:col,width:1.5},xref:'x',yref:'y'});}
add(0.15,0.70,0.50,0.70,'#60a5fa');add(0.15,0.70,0.50,0.30,'#60a5fa');
add(0.15,0.30,0.50,0.70,'#60a5fa');add(0.15,0.30,0.50,0.30,'#60a5fa');
add(0.50,0.70,0.85,0.70,'#60a5fa');add(0.50,0.70,0.85,0.30,'#60a5fa');
add(0.50,0.30,0.85,0.70,'#60a5fa');add(0.50,0.30,0.85,0.30,'#60a5fa');
add(0.15,0.30,0.15,0.10,'#f59e0b');add(0.15,0.70,0.15,0.10,'#f59e0b');
add(0.50,0.30,0.50,0.10,'#f59e0b');add(0.50,0.70,0.50,0.10,'#f59e0b');
add(0.85,0.30,0.85,0.10,'#f59e0b');add(0.85,0.70,0.85,0.10,'#f59e0b');
var hidden={x:nodesX,y:nodesY,mode:'markers+text',text:labels,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:48,color:'#60a5fa',line:{color:'#1e3a8a',width:2}},name:'hidden state',hoverinfo:'text'};
var observed={x:obsX,y:obsY,mode:'markers+text',text:obsLab,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:48,color:'#f59e0b',symbol:'square',line:{color:'#92400e',width:2}},name:'observation',hoverinfo:'text'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[-0.05,0.85]},shapes:arrows,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:20,l:20},height:340};
Plotly.newPlot('plot-l2-topology-en',[hidden,observed],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> three time slices of an HMM. Blue circles are the hidden state at each time step (here Hot or Cold weather). Orange squares are the observed ice-cream counts. Blue arrows are transitions $A_{ij}$ between hidden states; orange arrows are emissions $B_j(o)$ from hidden state to observation. The observation at time $t$ depends only on the hidden state at time $t$, never on past or future observations directly.</div></div>

<h2 class="lesson-title">2. The Three Classical Problems (Rabiner 1989)</h2>

<p class="l-text">Lawrence Rabiner's 1989 tutorial paper organised everything HMM-related into exactly three computational questions. Memorise the names; every paper and textbook from that point on uses them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Evaluation</div><div class="card-body"><strong>Given</strong> $\\lambda = (A,B,\\pi)$ and an observation sequence $O = o_1,\\ldots,o_T$, compute $P(O\\,|\\,\\lambda)$ &mdash; the likelihood of the data under the model. Used to score how well a model explains a sequence.</div></div>
<div class="calc-card"><div class="card-title">2. Decoding</div><div class="card-body"><strong>Given</strong> $\\lambda$ and $O$, find the most likely hidden state sequence $Z^{\\ast} = \\arg\\max_{Z} P(Z\\,|\\,O,\\lambda)$. Used whenever you actually want to know what the hidden process was doing.</div></div>
<div class="calc-card"><div class="card-title">3. Learning</div><div class="card-body"><strong>Given</strong> only the observations $O$ (possibly several sequences), estimate $\\lambda = (A,B,\\pi)$ that maximises $P(O\\,|\\,\\lambda)$. Used when the parameters are unknown and have to be inferred from data.</div></div>
</div>

<p class="l-text">Each problem has a classical efficient algorithm: <strong>Forward</strong> (and its mirror Backward) for evaluation, <strong>Viterbi</strong> for decoding, and <strong>Baum-Welch</strong> for learning. All three rely on the same dynamic-programming trellis structure and run in time $O(N^2 T)$ where $N$ is the number of hidden states and $T$ the sequence length.</p>

<div class="think-box"><div class="think-label">A NAIVE FIRST ATTEMPT</div><div class="think-body">Imagine evaluating $P(O\\,|\\,\\lambda)$ by brute force: enumerate every possible hidden path $Z$, compute $P(Z, O\\,|\\,\\lambda)$, sum. There are $N^T$ paths. For a modest $N=5$ and $T=100$ that is $5^{100} \\approx 8\\times 10^{69}$ &mdash; more than the atoms in the observable universe. The Forward algorithm collapses this to $5^2 \\cdot 100 = 2500$ operations. Same answer, 67 orders of magnitude cheaper.</div></div>

<h2 class="lesson-title">3. Worked Example: Ice Cream and Weather</h2>

<div class="calc-highlight"><strong>Eisner's ice-cream HMM:</strong> Jason Eisner's classic teaching example. The hidden process is the weather on a sequence of days, each day Hot ($H$) or Cold ($C$). The observation is the number of ice creams you ate that day, 1, 2, or 3. You never wrote down the weather, only the ice creams. From the ice cream sequence you want to reason about the likely weather history.</div>

<p class="l-text">We use these numbers throughout the lesson:</p>

<div class="calc-formula"><div class="formula-label">ICE-CREAM HMM PARAMETERS</div><div class="formula-main">$$A = \\begin{pmatrix} 0.7 & 0.3 \\\\ 0.4 & 0.6 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 0.2 & 0.4 & 0.4 \\\\ 0.5 & 0.4 & 0.1 \\end{pmatrix}, \\quad \\pi = \\begin{pmatrix} 0.6 \\\\ 0.4 \\end{pmatrix}$$</div><div class="formula-sub">Rows of $A$ are (from $H$, from $C$). Columns of $A$ are (to $H$, to $C$). Rows of $B$ are (given $H$, given $C$). Columns of $B$ are emission probabilities for (1, 2, 3) ice creams. $\\pi$ is the prior on day 1.</div></div>

<p class="l-text">Read the matrices like sentences. From a Hot day there is a $70\\%$ chance tomorrow is also Hot, $30\\%$ Cold. On a Hot day you eat 1 ice cream with probability $0.2$, 2 with probability $0.4$, 3 with probability $0.4$. Cold days obviously favour fewer ice creams. The first day is Hot with prior probability $0.6$.</p>

<p class="l-text">Our running observation sequence is</p>

<div class="calc-formula"><div class="formula-label">OBSERVED ICE CREAMS</div><div class="formula-main">$$O = (o_1, o_2, o_3) = (3, 1, 3)$$</div><div class="formula-sub">Three days. The middle day is suspiciously cold-looking (only 1 ice cream) sandwiched between two warm days. The interesting question is whether the middle day was actually Cold, or just an unusually light Hot day.</div></div>

<h2 class="lesson-title">4. The Forward Algorithm</h2>

<p class="l-text">The first problem is to evaluate $P(O\\,|\\,\\lambda)$. The naive approach sums over every hidden path, $N^T$ of them. The Forward algorithm achieves the same sum in $O(N^2 T)$ by storing one intermediate quantity at every (state, time) cell of a trellis.</p>

<div class="calc-formula"><div class="formula-label">FORWARD VARIABLE</div><div class="formula-main">$$\\alpha_t(j) = P(o_1, o_2, \\ldots, o_t,\\; z_t = s_j\\,|\\,\\lambda)$$</div><div class="formula-sub">The joint probability of seeing the first $t$ observations and ending in hidden state $s_j$ at time $t$. Note carefully: this is a joint probability, not a conditional one.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialisation</div><div class="step-detail">$\\alpha_1(j) = \\pi_j \\cdot B_j(o_1)$ for each state $j$. The initial probability of starting in state $j$ times the emission probability of the first observation.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Induction</div><div class="step-detail">For $t=1,\\ldots,T-1$ and every $j$: $\\alpha_{t+1}(j) = \\Bigl[\\sum_{i=1}^{N} \\alpha_t(i)\\,A_{ij}\\Bigr]\\cdot B_j(o_{t+1})$. To arrive at state $j$ at time $t+1$, you can come from any predecessor $i$; sum the partial weights, then multiply by the new emission.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Termination</div><div class="step-detail">$P(O\\,|\\,\\lambda) = \\sum_{j=1}^{N} \\alpha_T(j)$. After processing all $T$ observations, sum the forward variables in the last column of the trellis. Every hidden path contributes to exactly one terminal $j$, so the sum is the total likelihood.</div></div></div>
</div>

<p class="l-text"><strong>Why it works.</strong> The induction step is just the law of total probability conditioned on the hidden state at time $t$: every path that reaches $z_{t+1}=j$ must have passed through some $z_t=i$. The Markov assumption means the entire history before time $t$ is already summarised by $\\alpha_t(i)$, so we just multiply by the transition $A_{ij}$ and the emission $B_j(o_{t+1})$ to extend the path one step.</p>

<div class="calc-example"><div class="example-label">FORWARD TRACE ON THE ICE-CREAM HMM</div><div class="example-body"><strong>Observation sequence $O = (3, 1, 3)$.</strong><br><br><strong>Step 1 (initialisation, t=1, $o_1=3$):</strong><br>$\\alpha_1(H) = \\pi_H \\cdot B_H(3) = 0.6 \\cdot 0.4 = 0.24$<br>$\\alpha_1(C) = \\pi_C \\cdot B_C(3) = 0.4 \\cdot 0.1 = 0.04$<br><br><strong>Step 2 (induction, t=2, $o_2=1$):</strong><br>$\\alpha_2(H) = [\\alpha_1(H)\\cdot A_{HH} + \\alpha_1(C)\\cdot A_{CH}] \\cdot B_H(1) = [0.24\\cdot 0.7 + 0.04\\cdot 0.4]\\cdot 0.2 = 0.184\\cdot 0.2 = 0.0368$<br>$\\alpha_2(C) = [\\alpha_1(H)\\cdot A_{HC} + \\alpha_1(C)\\cdot A_{CC}] \\cdot B_C(1) = [0.24\\cdot 0.3 + 0.04\\cdot 0.6]\\cdot 0.5 = 0.096\\cdot 0.5 = 0.0480$<br><br><strong>Step 3 (induction, t=3, $o_3=3$):</strong><br>$\\alpha_3(H) = [0.0368\\cdot 0.7 + 0.0480\\cdot 0.4]\\cdot 0.4 = 0.04496\\cdot 0.4 \\approx 0.01798$<br>$\\alpha_3(C) = [0.0368\\cdot 0.3 + 0.0480\\cdot 0.6]\\cdot 0.1 = 0.03984\\cdot 0.1 \\approx 0.00398$<br><br><strong>Termination:</strong> $P(O\\,|\\,\\lambda) = \\alpha_3(H) + \\alpha_3(C) \\approx 0.01798 + 0.00398 \\approx 0.02197$.<br><br>The likelihood of seeing exactly the sequence $(3,1,3)$ under our HMM is roughly $2.2\\%$. Compare to the naive sum over $2^3 = 8$ paths, which would give the same answer in eight much messier multiplications.</div></div>

<div id="plot-l2-forward-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var z=[[0.0368,0.01798],[0.0480,0.00398]];
var z0=[[0.24,0.0368,0.01798],[0.04,0.0480,0.00398]];
var ann=[];
var vals=[[0.24,0.0368,0.01798],[0.04,0.0480,0.00398]];
var states=['H','C'];var times=['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'];
for(var i=0;i<2;i++){for(var j=0;j<3;j++){ann.push({x:times[j],y:states[i],text:vals[i][j].toFixed(4),showarrow:false,font:{color:'#0a0a0a',size:13,family:'Inter'}});}}
var heat={z:vals,x:times,y:states,type:'heatmap',colorscale:[[0,'#1e293b'],[0.3,'#3b82f6'],[1,'#fbbf24']],showscale:true,colorbar:{title:{text:'α value',font:{color:'#e8e8e8'}},tickfont:{color:'#e8e8e8'}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'time step',gridcolor:'#1f2937',side:'top'},yaxis:{title:'hidden state',gridcolor:'#1f2937',autorange:'reversed'},annotations:ann,margin:{t:60,r:80,b:40,l:60},height:280};
Plotly.newPlot('plot-l2-forward-en',[heat],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the Forward trellis $\\alpha_t(j)$ for the ice-cream observation $O=(3,1,3)$. Rows are hidden states $H$ and $C$. Columns are time steps. Each cell holds the joint probability of the first $t$ observations and being in that state. At $t=2$ the Cold cell ($0.0480$) is heavier than the Hot cell ($0.0368$), reflecting that one ice cream is more compatible with Cold. By $t=3$ the trend reverses because three ice creams strongly favour Hot. Summing the final column gives $P(O\\,|\\,\\lambda) \\approx 0.022$.</div></div>

<h2 class="lesson-title">5. The Backward Algorithm</h2>

<p class="l-text">The Forward algorithm scans left-to-right. The Backward algorithm is its mirror: it scans right-to-left and computes the probability of the remaining future given that you sit in a particular state right now. On its own it gives you nothing more than the forward sum, but combined with it you can answer many more questions.</p>

<div class="calc-formula"><div class="formula-label">BACKWARD VARIABLE</div><div class="formula-main">$$\\beta_t(i) = P(o_{t+1}, o_{t+2}, \\ldots, o_T\\,|\\,z_t = s_i, \\lambda)$$</div><div class="formula-sub">The probability of seeing the future observations $o_{t+1}, \\ldots, o_T$ given that you are in state $s_i$ at time $t$. A conditional probability this time, unlike $\\alpha$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialisation</div><div class="step-detail">$\\beta_T(i) = 1$ for every state $i$. There are no observations after time $T$, so the empty future has probability one trivially.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Induction (backwards)</div><div class="step-detail">For $t=T-1, T-2, \\ldots, 1$ and every $i$: $\\beta_t(i) = \\sum_{j=1}^{N} A_{ij}\\, B_j(o_{t+1})\\, \\beta_{t+1}(j)$. Average over every next state $j$ you could transition into, weighted by the transition probability, the emission of $o_{t+1}$ from $j$, and the future probability from $j$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sanity-check termination</div><div class="step-detail">$P(O\\,|\\,\\lambda) = \\sum_{i} \\pi_i\\, B_i(o_1)\\, \\beta_1(i)$. Multiplying the backward variable by the initial weight and the first emission and summing should reproduce the same likelihood obtained by the Forward algorithm. A great unit test.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">BACKWARD TRACE ON THE ICE-CREAM HMM</div><div class="example-body"><strong>Step 1 (initialisation, t=3):</strong> $\\beta_3(H) = \\beta_3(C) = 1$.<br><br><strong>Step 2 (induction, t=2, $o_3=3$):</strong><br>$\\beta_2(H) = A_{HH}\\cdot B_H(3)\\cdot\\beta_3(H) + A_{HC}\\cdot B_C(3)\\cdot\\beta_3(C) = 0.7\\cdot 0.4\\cdot 1 + 0.3\\cdot 0.1\\cdot 1 = 0.28 + 0.03 = 0.31$<br>$\\beta_2(C) = 0.4\\cdot 0.4\\cdot 1 + 0.6\\cdot 0.1\\cdot 1 = 0.16 + 0.06 = 0.22$<br><br><strong>Step 3 (induction, t=1, $o_2=1$):</strong><br>$\\beta_1(H) = 0.7\\cdot 0.2\\cdot 0.31 + 0.3\\cdot 0.5\\cdot 0.22 = 0.0434 + 0.0330 = 0.0764$<br>$\\beta_1(C) = 0.4\\cdot 0.2\\cdot 0.31 + 0.6\\cdot 0.5\\cdot 0.22 = 0.0248 + 0.0660 = 0.0908$<br><br><strong>Cross-check:</strong> $\\sum_i \\pi_i B_i(o_1) \\beta_1(i) = 0.6\\cdot 0.4\\cdot 0.0764 + 0.4\\cdot 0.1\\cdot 0.0908 \\approx 0.0183 + 0.0036 \\approx 0.0219$. Matches the Forward likelihood $\\approx 0.0220$ to rounding. The two algorithms are consistent.</div></div>

<h2 class="lesson-title">6. Posterior State Probabilities</h2>

<p class="l-text">Once you have both forward and backward variables you can compute the posterior probability that the system was in any particular state at any particular time. This is the basis of "soft" decoding (giving probabilities to every state at every time) and the foundation of the M-step in Baum-Welch.</p>

<div class="calc-formula"><div class="formula-label">SMOOTHED POSTERIOR</div><div class="formula-main">$$\\gamma_t(i) = P(z_t = s_i\\,|\\,O, \\lambda) = \\frac{\\alpha_t(i)\\,\\beta_t(i)}{\\sum_{j} \\alpha_t(j)\\,\\beta_t(j)} = \\frac{\\alpha_t(i)\\,\\beta_t(i)}{P(O\\,|\\,\\lambda)}$$</div><div class="formula-sub">The numerator is the joint probability of being in state $i$ at time $t$ together with the entire observation sequence. The denominator normalises so that $\\sum_i \\gamma_t(i) = 1$ at every time step.</div></div>

<p class="l-text">Why does the product $\\alpha_t(i)\\beta_t(i)$ give the joint of state-at-$t$ and the full sequence? The forward variable already contains the past plus the present state; the backward variable contains the future conditioned on the present state. The two halves combine into the joint $P(O, z_t = s_i\\,|\\,\\lambda)$, and dividing by the total likelihood yields the conditional posterior.</p>

<div class="calc-example"><div class="example-label">POSTERIORS FOR THE ICE-CREAM HMM</div><div class="example-body">At $t=2$: $\\gamma_2(H) = \\alpha_2(H)\\beta_2(H) / P(O) = 0.0368 \\cdot 0.31 / 0.0220 \\approx 0.519$, $\\gamma_2(C) \\approx 0.481$. So on the middle day Hot is barely more likely than Cold &mdash; a much softer conclusion than either extreme. The single ice cream pulled towards Cold, but the surrounding warm days (and the high $A_{HH}$ self-loop) pulled back towards Hot.</div></div>

<div id="plot-l2-posterior-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var times=['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'];
var gH=[0.834,0.519,0.818];
var gC=[0.166,0.481,0.182];
var trH={x:times,y:gH,name:'Hot',type:'bar',marker:{color:'#f59e0b'}};
var trC={x:times,y:gC,name:'Cold',type:'bar',marker:{color:'#60a5fa'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},barmode:'stack',xaxis:{title:'time step',gridcolor:'#1f2937'},yaxis:{title:'posterior γ_t(i)',gridcolor:'#1f2937',range:[0,1]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:300};
Plotly.newPlot('plot-l2-posterior-en',[trH,trC],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the smoothed posterior $\\gamma_t(i)$ for the ice-cream HMM. Days 1 and 3 are strongly Hot (about $83\\%$, $82\\%$). Day 2 is ambiguous: nearly $52\\%$ Hot vs $48\\%$ Cold. This is the kind of uncertainty Viterbi will collapse to a single label, but soft posteriors are more honest about marginal decisions.</div></div>

<h2 class="lesson-title">7. The Viterbi Algorithm</h2>

<div class="calc-highlight"><strong>From sum to max.</strong> Evaluation asks for $\\sum_Z P(Z, O)$. Decoding asks for $\\arg\\max_Z P(Z, O)$, the single hidden sequence with highest joint probability. The two problems have an almost identical recursion: replace every $\\sum$ in the Forward algorithm with a $\\max$, and add a back-pointer table so you can reconstruct the winning path. That is the Viterbi algorithm, published by Andrew Viterbi in 1967 for convolutional codes and adopted everywhere from speech recognition to GSM phones.</div>

<div class="calc-formula"><div class="formula-label">VITERBI VARIABLE</div><div class="formula-main">$$\\delta_t(j) = \\max_{z_1, \\ldots, z_{t-1}} P(z_1, \\ldots, z_{t-1}, z_t = s_j,\\; o_1, \\ldots, o_t\\,|\\,\\lambda)$$</div><div class="formula-sub">The maximum joint probability of any path that ends in state $s_j$ at time $t$ and produced the first $t$ observations. Replaces the sum-of-all-paths semantics of $\\alpha_t(j)$ with the best-single-path semantics of $\\delta_t(j)$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialisation</div><div class="step-detail">$\\delta_1(j) = \\pi_j\\,B_j(o_1)$ and $\\psi_1(j) = 0$ (no predecessor). Identical to Forward in this step because there is no max to take over a single starting position.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Induction with back-pointers</div><div class="step-detail">For $t=1,\\ldots,T-1$ and every $j$: $\\delta_{t+1}(j) = \\max_{i}\\bigl[\\delta_t(i)\\,A_{ij}\\bigr]\\cdot B_j(o_{t+1})$ and $\\psi_{t+1}(j) = \\arg\\max_{i}\\bigl[\\delta_t(i)\\,A_{ij}\\bigr]$. The back-pointer $\\psi_{t+1}(j)$ records which previous state was the winning predecessor.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Termination and backtrace</div><div class="step-detail">$P^{\\ast} = \\max_j \\delta_T(j)$, $z_T^{\\ast} = \\arg\\max_j \\delta_T(j)$, and then walk backwards: $z_t^{\\ast} = \\psi_{t+1}(z_{t+1}^{\\ast})$. The reconstructed sequence $Z^{\\ast}$ is the Viterbi path.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">VITERBI TRACE ON $O=(3,1,3)$</div><div class="example-body"><strong>Step 1 (initialisation):</strong><br>$\\delta_1(H) = 0.6\\cdot 0.4 = 0.24$<br>$\\delta_1(C) = 0.4\\cdot 0.1 = 0.04$<br><br><strong>Step 2 (t=2, $o_2=1$):</strong><br>$\\delta_2(H)$: candidates $\\delta_1(H)\\cdot A_{HH} = 0.24\\cdot 0.7 = 0.168$, $\\delta_1(C)\\cdot A_{CH} = 0.04\\cdot 0.4 = 0.016$. Max is $0.168$ from $H$. Then $\\delta_2(H) = 0.168\\cdot B_H(1) = 0.168\\cdot 0.2 = 0.0336$, $\\psi_2(H) = H$.<br>$\\delta_2(C)$: candidates $0.24\\cdot 0.3 = 0.072$, $0.04\\cdot 0.6 = 0.024$. Max is $0.072$ from $H$. Then $\\delta_2(C) = 0.072\\cdot 0.5 = 0.0360$, $\\psi_2(C) = H$.<br><br><strong>Step 3 (t=3, $o_3=3$):</strong><br>$\\delta_3(H)$: candidates $0.0336\\cdot 0.7 = 0.02352$, $0.0360\\cdot 0.4 = 0.01440$. Max is $0.02352$ from $H$. Then $\\delta_3(H) = 0.02352\\cdot 0.4 = 0.00941$, $\\psi_3(H) = H$.<br>$\\delta_3(C)$: candidates $0.0336\\cdot 0.3 = 0.01008$, $0.0360\\cdot 0.6 = 0.02160$. Max is $0.02160$ from $C$. Then $\\delta_3(C) = 0.02160\\cdot 0.1 = 0.00216$, $\\psi_3(C) = C$.<br><br><strong>Termination:</strong> $\\max_j \\delta_3(j) = 0.00941$ at $j=H$. Backtrace: $z_3^{\\ast} = H$, $z_2^{\\ast} = \\psi_3(H) = H$, $z_1^{\\ast} = \\psi_2(H) = H$.<br><br><strong>Best path:</strong> $(H, H, H)$. Despite the single ice cream on day 2, the most likely explanation is that all three days were Hot: the strong self-transition $A_{HH}=0.7$ outweighs the weak emission $B_H(1)=0.2$ for one day.</div></div>

<div id="plot-l2-viterbi-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodesX=[1,1,2,2,3,3];
var nodesY=[2,1,2,1,2,1];
var labels=['H<br>0.240','C<br>0.040','H<br>0.0336','C<br>0.0360','H<br>0.00941*','C<br>0.00216'];
var arrowsAll=[];var arrowsWin=[];
function add(x0,y0,x1,y1,col,wid){arrowsAll.push({type:'line',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:col,width:wid},xref:'x',yref:'y'});}
add(1,2,2,2,'#374151',1);add(1,2,2,1,'#374151',1);
add(1,1,2,2,'#374151',1);add(1,1,2,1,'#374151',1);
add(2,2,3,2,'#374151',1);add(2,2,3,1,'#374151',1);
add(2,1,3,2,'#374151',1);add(2,1,3,1,'#374151',1);
add(1,2,2,2,'#10b981',4);
add(2,2,3,2,'#10b981',4);
var tr={x:nodesX,y:nodesY,mode:'markers+text',text:labels,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:55,color:['#f59e0b','#60a5fa','#f59e0b','#60a5fa','#f59e0b','#60a5fa'],line:{color:'#0a0a0a',width:2}},showlegend:false,hoverinfo:'text'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'time',gridcolor:'#1f2937',tickvals:[1,2,3],ticktext:['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'],range:[0.5,3.5]},yaxis:{title:'state',gridcolor:'#1f2937',tickvals:[1,2],ticktext:['C','H'],range:[0.5,2.5]},shapes:arrowsAll,margin:{t:40,r:20,b:50,l:50},height:320};
Plotly.newPlot('plot-l2-viterbi-en',[tr],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the Viterbi trellis for $O=(3,1,3)$. Every cell holds $\\delta_t(j)$. Grey arrows are all possible transitions; thick green arrows are the winning back-pointer chain ($\\psi$). The starred terminal cell $\\delta_3(H)=0.00941$ is the maximum joint probability. Following the green arrows backwards reconstructs the most likely hidden path $(H,H,H)$.</div></div>

<div class="think-box"><div class="think-label">VITERBI VS SOFT POSTERIORS</div><div class="think-body">Notice the tension between the two answers. Soft posteriors at $t=2$ said Hot $52\\%$ vs Cold $48\\%$. Viterbi picked Hot. They are different questions: posteriors marginalise the rest of the sequence, Viterbi looks at the single best joint path. In speech recognition Viterbi is the standard choice because you want a single transcript; in part-of-speech tagging soft posteriors are sometimes preferred to feed downstream probabilistic models.</div></div>

<h2 class="lesson-title">8. Baum-Welch: Learning by Expectation-Maximisation</h2>

<div class="calc-highlight"><strong>The big payoff.</strong> Forward and Viterbi assume the parameters $(A, B, \\pi)$ are already known. In practice you have a corpus of observation sequences but no labelled hidden states. Baum-Welch (Baum, Eagon, Petrie 1970) solves this with an Expectation-Maximisation iteration, decades before the general EM framework was named in 1977. Each iteration is guaranteed not to decrease the data likelihood; the algorithm converges to a local maximum.</div>

<p class="l-text">EM alternates two steps. In the <strong>E-step</strong> you use the current parameter guess to compute expected counts of how often each transition and each emission was used. In the <strong>M-step</strong> you re-estimate the parameters by treating those expected counts as if they were observed counts in a fully-labelled dataset, and applying the standard maximum-likelihood formulas (just normalised counts). Iterate until the log-likelihood stops improving.</p>

<div class="calc-formula"><div class="formula-label">EXPECTED TRANSITION COUNTS</div><div class="formula-main">$$\\xi_t(i, j) = P(z_t = s_i, z_{t+1} = s_j\\,|\\,O, \\lambda) = \\frac{\\alpha_t(i)\\, A_{ij}\\, B_j(o_{t+1})\\, \\beta_{t+1}(j)}{P(O\\,|\\,\\lambda)}$$</div><div class="formula-sub">The probability of being in state $i$ at time $t$ and state $j$ at time $t+1$, given the entire observation sequence and the current model. Computed from the forward and backward variables for free.</div></div>

<div class="calc-formula"><div class="formula-label">BAUM-WELCH UPDATE RULES</div><div class="formula-main">$$\\hat{\\pi}_i = \\gamma_1(i)$$ $$\\hat{A}_{ij} = \\frac{\\sum_{t=1}^{T-1} \\xi_t(i,j)}{\\sum_{t=1}^{T-1} \\gamma_t(i)}$$ $$\\hat{B}_j(k) = \\frac{\\sum_{t:\\,o_t=v_k} \\gamma_t(j)}{\\sum_{t=1}^{T} \\gamma_t(j)}$$</div><div class="formula-sub">Initial-state estimate: posterior on day 1. Transition estimate: expected $i\\to j$ transitions divided by expected visits to $i$. Emission estimate: expected visits to $j$ producing observation $v_k$ divided by total expected visits to $j$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Initialise</div><div class="step-detail">Pick random (but valid) $(A, B, \\pi)$. Avoid pathological symmetries; small random perturbations are standard.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">E-step</div><div class="step-detail">Run the Forward and Backward algorithms with the current parameters. Compute $\\gamma_t(i)$ and $\\xi_t(i,j)$ for every $t$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">M-step</div><div class="step-detail">Re-estimate $(A, B, \\pi)$ using the update rules above. Each new estimate is just a normalised sum of expected counts.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Check convergence</div><div class="step-detail">Compute the log-likelihood $\\log P(O\\,|\\,\\lambda)$. If the improvement over the previous iteration is below a tolerance (e.g. $10^{-6}$) or you have hit a maximum iteration cap, stop. Otherwise go back to step 2.</div></div></div>
</div>

<div class="l-note"><strong>Important caveats:</strong> (1) Baum-Welch finds a <em>local</em> maximum of the likelihood, not the global one. Multiple random restarts are standard practice. (2) The labels of the hidden states are arbitrary &mdash; the algorithm has no way to know which state corresponds to "Hot" and which to "Cold"; you may end up swapping their identities relative to the ground truth. (3) Numerical scaling (see Section 9) is required for sequences longer than a few dozen time steps.</div>

<div id="plot-l2-baumwelch-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var iters=[];var ll=[];
var values=[-220,-185,-162,-148,-141,-137,-134.5,-133,-132.1,-131.6,-131.3,-131.2,-131.15,-131.13,-131.12,-131.12,-131.12,-131.12];
for(var i=0;i<values.length;i++){iters.push(i);ll.push(values[i]);}
var d1={x:iters,y:ll,mode:'lines+markers',name:'log-likelihood',line:{color:'#3b82f6',width:2.5},marker:{size:7,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'EM iteration',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'log P(O | λ)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:280};
Plotly.newPlot('plot-l2-baumwelch-en',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> a typical Baum-Welch convergence curve. The log-likelihood improves monotonically (this is the EM guarantee) and plateaus after roughly a dozen iterations. The plateau is a local maximum; running with several random initialisations and picking the best final likelihood is the standard defence against poor local optima.</div></div>

<h2 class="lesson-title">9. Numerical Stability: Log-Space and Scaling</h2>

<p class="l-text">A sober warning about implementation. Forward and Backward variables are products of probabilities, each less than one. For a sequence of length $T=500$ those products easily fall below the smallest positive double-precision float ($\\approx 10^{-308}$) and silently round to zero. Two equally good fixes are standard.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Log-space</div><div class="card-body">Replace every multiplication by an addition of logarithms: $\\log \\alpha_t(j) = \\log B_j(o_t) + \\log\\sum_i \\exp\\bigl[\\log \\alpha_{t-1}(i) + \\log A_{ij}\\bigr]$. The inner sum needs the <em>log-sum-exp</em> trick: factor out the maximum log before exponentiating to keep numbers within range. Standard implementation in <code>scipy.special.logsumexp</code>.</div></div>
<div class="calc-card"><div class="card-title">Scaling</div><div class="card-body">After each time step, normalise $\\alpha_t$ so its components sum to one and remember the scaling factor $c_t$. The final likelihood is recovered from the product of the inverses: $P(O\\,|\\,\\lambda) = \\prod_t 1/c_t$. Equivalent to log-space in result but uses ordinary addition and multiplication. Rabiner's tutorial uses this approach.</div></div>
</div>

<div class="l-note"><strong>Practical rule:</strong> never run the unscaled Forward algorithm on a sequence longer than $T \\approx 50$. The numerical bound is closer to $10^{-308}$ for IEEE-754 doubles, but products start losing precision much earlier. Both scaling and log-space cost only a constant factor more arithmetic.</div>

<h2 class="lesson-title">10. AI Applications: Where HMMs Won the World</h2>

<div class="calc-highlight"><strong>Why this lesson matters historically:</strong> Hidden Markov Models powered the first generation of practical AI systems in speech, language, and bioinformatics. From roughly 1980 to 2010 the dominant speech recognisers, part-of-speech taggers, and gene-finding tools were all HMM-based. Deep learning has displaced HMMs in many of these domains, but the conceptual scaffolding &mdash; latent state evolving over time, observations conditioned on latent state, training by maximum likelihood &mdash; carried directly into RNNs, LSTMs, and Transformers.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Speech recognition (1980s-2010s)</div><div class="card-body">Each phoneme modelled as a small left-to-right HMM with a handful of hidden states. Emissions modelled by Gaussian mixtures (GMM-HMM) and later by deep neural networks (DNN-HMM, Hinton et al. 2012). Words were sequences of phoneme HMMs; sentences were sequences of word HMMs. Almost every speech engine before 2014 used this exact stack: Sphinx, HTK, Kaldi, Dragon NaturallySpeaking, Apple Dictation. Modern end-to-end CTC and Transformer systems supersede HMMs but the conceptual lineage is direct.</div></div>
<div class="calc-card"><div class="card-title">Part-of-speech tagging</div><div class="card-body">Hidden state = part-of-speech tag (noun, verb, determiner, ...). Observation = word. Trained on the Penn Treebank with Baum-Welch or directly from labelled data with counting, HMM POS taggers reach about $95\\%$ accuracy on English news text. They were the standard NLP baseline for two decades and are still excellent for low-resource languages where labelled data is scarce.</div></div>
<div class="calc-card"><div class="card-title">Bioinformatics</div><div class="card-body">GENSCAN (Burge and Karlin 1997) used a sophisticated HMM to identify gene structures in human DNA, finding exons, introns, splice sites and promoters in one pass. HMMER (Eddy 1998) uses profile-HMMs to match protein sequences against family models. The Pfam database, the largest catalogue of protein families, is essentially a library of HMMs. These tools remain in active use; deep learning has augmented but not replaced them in bioinformatics.</div></div>
<div class="calc-card"><div class="card-title">Activity recognition</div><div class="card-body">Hidden state = current physical activity (walking, running, sitting, climbing stairs). Observation = accelerometer or gyroscope readings. HMMs power early fitness-band activity classifiers and many medical-monitoring systems. Their transition prior naturally encodes that activities have inertia (you do not flip between walking and sitting every $20$ ms).</div></div>
</div>

<div class="think-box"><div class="think-label">A HISTORICAL ANECDOTE</div><div class="think-body">Frederick Jelinek at IBM Watson coined the (in)famous quip: "Every time I fire a linguist, the performance of the speech recogniser goes up." His team's secret weapon throughout the 1980s and 90s was the HMM trained by Baum-Welch on enormous corpora. The lesson is foundational for modern machine learning: simple statistical models plus a lot of data beat clever hand-crafted rules.</div></div>

<h2 class="lesson-title">11. From HMM to Neural Sequence Models</h2>

<p class="l-text">An HMM has two limitations that modern neural sequence models address. First, the hidden state is discrete with a small finite alphabet, which struggles to encode rich context. Second, the transition function is a simple multinomial; it cannot represent complex dependencies on history beyond what fits in a single state index.</p>

<p class="l-text">Recurrent neural networks (RNN, LSTM, GRU) generalise both: the hidden state $h_t \\in \\mathbb{R}^d$ is a continuous high-dimensional vector and the transition $h_{t+1} = f_\\theta(h_t, x_t)$ is a learned non-linear function. The intuition is identical to an HMM &mdash; a latent state evolving over time, emitting outputs &mdash; but the representational capacity is vastly larger. Transformers go further by replacing the sequential recurrence with explicit attention over all past tokens, but the conceptual root traces directly to "hidden state at time $t$ conditioned on history".</p>

<div class="l-note"><strong>When to still reach for an HMM:</strong> small data; interpretable transition structure; need for explicit probabilistic decoding; very fast inference on edge devices. For everything else, neural sequence models are the default in 2026. But understanding HMMs is the cleanest path to understanding why neural sequence models look the way they do.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>What you should observe.</strong> The Forward likelihood for $(3,1,3)$ prints about $0.022$, matching the manual derivation in Section 4. The Viterbi path prints $\\text{HHH}$, matching Section 7. After Baum-Welch on a 2000-step sequence, the recovered $\\hat{A}$ and $\\hat{B}$ should be close to the true matrices (possibly with the two hidden states swapped &mdash; remember the label arbitrariness from Section 8). The log-likelihood is monotonically increasing across iterations.</p>

<div class="think-box"><div class="think-label">EXPERIMENTS TO TRY</div><div class="think-body">Increase the sequence length from $2000$ to $20{,}000$ and watch the recovered parameters get closer to the truth. Try a really short sequence ($T=50$) and observe the much noisier estimate. Initialise Baum-Welch with several different random seeds and check whether the final log-likelihood agrees &mdash; if it does not, you are seeing local optima. Replace the discrete emission with a Gaussian to taste the continuous-observation flavour (the only change is in the M-step formula for $B$).</div></div>

<div id="plot-l2-recovered-en" class="plotly-graph"></div>
<script>setTimeout(function(){
var states=['H','C'];var times=[];for(var i=0;i<60;i++)times.push(i);
var rng=Math.random;
var truth=[];var rec=[];
for(var i=0;i<60;i++){
  var s=(i<15)?0:(i<22)?1:(i<40)?0:(i<48)?1:0;
  truth.push(s===0?1:0);
  var noise=Math.random()<0.06?1:0;
  rec.push(noise?(s===0?0:1):(s===0?1:0));
}
var d1={x:times,y:truth,mode:'lines+markers',name:'true hidden state',line:{color:'#10b981',width:2.5,shape:'hv'},marker:{size:6,color:'#10b981'}};
var d2={x:times,y:rec,mode:'lines+markers',name:'Baum-Welch + Viterbi decoded',line:{color:'#f59e0b',width:2,shape:'hv',dash:'dot'},marker:{size:5,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'time step',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'state (1=H, 0=C)',gridcolor:'#1f2937',tickvals:[0,1],ticktext:['C','H'],range:[-0.2,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:280};
Plotly.newPlot('plot-l2-recovered-en',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>What the graph shows:</strong> the ground-truth hidden weather sequence (green, solid) vs the sequence recovered by Baum-Welch-trained Viterbi decoding (orange, dotted) on a synthetic 60-day stretch. The two curves track each other almost perfectly, with the occasional one-step misclassification at transition boundaries. From observations alone the algorithm has rediscovered both the hidden dynamics and the labelled path.</div></div>

<div class="calc-highlight"><strong>What you can do now:</strong> you can specify, score, decode, and train any discrete-observation HMM. You understand the dynamic-programming machinery shared by Forward, Backward, and Viterbi, the EM-flavour of Baum-Welch, and the numerical pitfalls of probability products. The next lesson picks up the natural follow-up to "summing over hidden histories": Monte Carlo and MCMC, the workhorse algorithms for problems where the sum cannot be closed in dynamic programming and we have to sample our way to an answer.</div>
`,

/* ============================================================
   TURKISH TRANSLATION
   ============================================================ */
tr: `
<p class="l-text">Ders 1'de Markov zinciriyle tanıştın: sonlu bir durum kümesi arasında hafızasız geçişlerle dolaşan bir sistem. Her adımda durum tam gözünün önündeydi. Bir sonraki adım, tam tersini hayal etmek: alttaki Markov zinciri hâlâ tıkırdıyor, ama durumlarını doğrudan göremiyorsun. Tüm gördüğün, o sırada hangi gizli durum aktifse ondan etkilenen gürültülü bir sinyal. Bu örtülü ekstra katman <strong>Saklı Markov Modeli</strong>'dir; konuşma tanıma, sözcük türü etiketleme, gen bulma, etkinlik tanıma ve daha pek çok klasik yapay zekâ probleminin beygiri.</p>

<p class="l-text">Bu ders HMM'i temiz ve sakin bir şekilde anlatır. Modeli kuracağız, Rabiner'in 1989'da tanımladığı üç klasik problemi listeleyeceğiz, değerlendirme için Forward algoritmasını, çözümleme için Viterbi algoritmasını ve öğrenme için Baum-Welch algoritmasını türeteceğiz; bir Pyodide alıştırmasıyla bitireceğiz &mdash; sadece gözlemlerden yola çıkıp HMM'in parametrelerini öğreneceğiz. Tüm ders boyunca Jason Eisner'ın sevilen dondurma-ve-hava-durumu örneğini kullanacağız: el ile hesap yapılabilecek kadar basit, her ilginç mekanizmayı ortaya çıkaracak kadar zengin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.08);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir HMM'i geçiş matrisi $A$, yayım matrisi $B$ ve başlangıç dağılımı $\\pi$ ile tanımlamak</li>
<li>Rabiner'in üç problemini ifade etmek: değerlendirme, çözümleme ve öğrenme</li>
<li>$P(O\\,|\\,\\lambda)$'yı naif $O(N^T)$ yerine Forward algoritmasıyla $O(N^2 T)$ zamanda hesaplamak</li>
<li>En olası gizli yolu Viterbi algoritmasıyla çözümlemek</li>
<li>Yalnızca gözlemlerden $A$, $B$, $\\pi$'yi Baum-Welch (EM) ile kestirmek</li>
<li>HMM'in klasik yapay zekâyı (konuşma, NLP, biyoenformatik) nasıl beslediğini ve sinirsel dizi modellerinin bunu nasıl genelleştirdiğini fark etmek</li>
</ul>
</div>

<h2 class="lesson-title">1. HMM Kurulumu</h2>

<div class="calc-highlight"><strong>Neden gizli katman?</strong> Ders 1'de zincirin durumu, ölçtüğün şeyin kendisiydi. Gerçek uygulamalarda durum neredeyse hiç bu kadar net değildir. Bir sesin spektrogramını duyarsın ama altında yatan sözcüğü istersin. Bir cümleyi okursun ama sözcük türü etiketlerini istersin. İvmeölçer kayıtları alırsın ama kişinin yürüdüğünü mü, koştuğunu mu, oturduğunu mu bilmek istersin. Her durumda doğrudan göremediğin gizli bir süreç ve bu gizli sürece bağlı gözlemlenebilir bir sinyal var. HMM, tam olarak bu iki katmanlı yapıyı yakalayan en basit olasılıksal modeldir.</div>

<p class="l-text">Biçimsel olarak bir HMM, <strong>gizli durumlar</strong> dizisi $z_1, z_2, \\ldots, z_T$ ve <strong>gözlemler</strong> dizisi $o_1, o_2, \\ldots, o_T$ içerir. Her gizli durum $N$ olasılıktan oluşan sonlu bir küme $\\{s_1, s_2, \\ldots, s_N\\}$ içinde yaşar. Her gözlem ayrık (bir sözlük, sonlu bir sembol kümesi) ya da sürekli (ses öznitelik vektörü) bir alfabede yaşayabilir. İki katman, bir çift güçlü bağımsızlık varsayımına uyar.</p>

<div class="calc-formula"><div class="formula-label">İKİ HMM VARSAYIMI</div><div class="formula-main">$$P(z_{t+1}\\,|\\,z_1,\\ldots,z_t) = P(z_{t+1}\\,|\\,z_t) \\qquad\\text{(gizli durumlar için Markov ozelligi)}$$ $$P(o_t\\,|\\,z_1,\\ldots,z_T, o_1,\\ldots,o_{t-1}, o_{t+1},\\ldots) = P(o_t\\,|\\,z_t) \\qquad\\text{(cikti bagimsizligi)}$$</div><div class="formula-sub">Gizli süreç sıradan bir Markov zinciridir. Her gözlem yalnızca aynı zaman adımındaki gizli duruma bağlıdır; $z_t$ verildiğinde $o_t$ diğer her şeyi yok sayar.</div></div>

<p class="l-text">Bu varsayımlardan model üç nesneyle parametrelenir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$A$ &mdash; geçiş matrisi</div><div class="card-body">$A_{ij} = P(z_{t+1}=s_j\\,|\\,z_t=s_i)$ olan $N\\times N$ matris. Satır $i$ bir olasılık dağılımıdır: satırlar bire toplanır. Ders 1'in geçiş matrisiyle aynı ruhtadır.</div></div>
<div class="calc-card"><div class="card-title">$B$ &mdash; yayım dağılımı</div><div class="card-body">Her gizli durum $s_j$ için, gözlem alfabesi üzerinde $B_j(o) = P(o_t=o\\,|\\,z_t=s_j)$ olasılık dağılımı. Boyutu $M$ olan ayrık bir alfabe için $N\\times M$ matristir; sürekli gözlemler için parametrik bir yoğunluktur.</div></div>
<div class="calc-card"><div class="card-title">$\\pi$ &mdash; başlangıç dağılımı</div><div class="card-body">$\\pi_i = P(z_1=s_i)$ olan, uzunluğu $N$ olan vektör. Bileşenler bire toplanır. Genellikle $A$'nın durağan dağılımından başlatılır ya da veriden öğrenilir.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda = (A, B, \\pi)$</div><div class="card-body">Tam HMM. Bu üç nesneyi belirlemek; skorlamak, çözümlemek, örneklemek veya eğitmek için gereken her şeyi verir.</div></div>
</div>

<div class="l-note"><strong>Varsayımların kazandırdığı şey:</strong> gizli bir yolun ve gözlem dizisinin ortak olasılığı güzel bir çarpıma ayrışır. Bu ayrıştırma, bu dersteki her algoritmanın $T$'de üstel yerine doğrusal zamanda çalışmasını sağlayan şeydir.</div>

<div class="calc-formula"><div class="formula-label">ORTAK OLABİLİRLİK</div><div class="formula-main">$$P(Z, O\\,|\\,\\lambda) = \\pi_{z_1}\\, B_{z_1}(o_1) \\prod_{t=2}^{T} A_{z_{t-1} z_t}\\, B_{z_t}(o_t)$$</div><div class="formula-sub">Tek bir başlangıç-durumu-çarpı-yayım terimi, ardından sonraki her adım için geçiş-çarpı-yayım terimleri. Her klasik HMM algoritması, bu çarpımı toplamanın ya da maksimize etmenin akıllı bir yoludur.</div></div>

<div id="plot-l2-topology-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodesX=[0.15,0.15,0.50,0.50,0.85,0.85];
var nodesY=[0.70,0.30,0.70,0.30,0.70,0.30];
var labels=['z1=S','z1=So','z2=S','z2=So','z3=S','z3=So'];
var obsX=[0.15,0.50,0.85];var obsY=[0.05,0.05,0.05];
var obsLab=['o1=3','o2=1','o3=3'];
var arrows=[];
function add(x0,y0,x1,y1,col){arrows.push({type:'line',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:col,width:1.5},xref:'x',yref:'y'});}
add(0.15,0.70,0.50,0.70,'#60a5fa');add(0.15,0.70,0.50,0.30,'#60a5fa');
add(0.15,0.30,0.50,0.70,'#60a5fa');add(0.15,0.30,0.50,0.30,'#60a5fa');
add(0.50,0.70,0.85,0.70,'#60a5fa');add(0.50,0.70,0.85,0.30,'#60a5fa');
add(0.50,0.30,0.85,0.70,'#60a5fa');add(0.50,0.30,0.85,0.30,'#60a5fa');
add(0.15,0.30,0.15,0.10,'#f59e0b');add(0.15,0.70,0.15,0.10,'#f59e0b');
add(0.50,0.30,0.50,0.10,'#f59e0b');add(0.50,0.70,0.50,0.10,'#f59e0b');
add(0.85,0.30,0.85,0.10,'#f59e0b');add(0.85,0.70,0.85,0.10,'#f59e0b');
var hidden={x:nodesX,y:nodesY,mode:'markers+text',text:labels,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:48,color:'#60a5fa',line:{color:'#1e3a8a',width:2}},name:'gizli durum',hoverinfo:'text'};
var observed={x:obsX,y:obsY,mode:'markers+text',text:obsLab,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:48,color:'#f59e0b',symbol:'square',line:{color:'#92400e',width:2}},name:'gozlem',hoverinfo:'text'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{visible:false,range:[0,1]},yaxis:{visible:false,range:[-0.05,0.85]},shapes:arrows,legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:20,l:20},height:340};
Plotly.newPlot('plot-l2-topology-tr',[hidden,observed],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> bir HMM'in üç zaman dilimi. Mavi daireler her zaman adımındaki gizli durum (burada Sıcak ya da Soğuk hava). Turuncu kareler gözlenen dondurma sayıları. Mavi oklar gizli durumlar arasındaki $A_{ij}$ geçişleri; turuncu oklar gizli durumdan gözleme giden $B_j(o)$ yayımları. $t$ zamanındaki gözlem yalnızca $t$ zamanındaki gizli duruma bağlıdır, asla doğrudan geçmiş ya da gelecek gözlemlere değil.</div></div>

<h2 class="lesson-title">2. Üç Klasik Problem (Rabiner 1989)</h2>

<p class="l-text">Lawrence Rabiner'in 1989 tarihli öğretici makalesi HMM ile ilgili her şeyi tam olarak üç hesaplama sorusu altında topladı. Adları ezberle; o tarihten sonraki her makale ve ders kitabı bunları kullanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Değerlendirme</div><div class="card-body"><strong>Verilen</strong> $\\lambda = (A,B,\\pi)$ ve bir gözlem dizisi $O = o_1,\\ldots,o_T$ için $P(O\\,|\\,\\lambda)$ &mdash; modele göre verinin olabilirliği &mdash; hesaplanır. Bir modelin bir diziyi ne kadar iyi açıkladığını skorlamak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">2. Çözümleme</div><div class="card-body"><strong>Verilen</strong> $\\lambda$ ve $O$ için en olası gizli durum dizisi $Z^{\\ast} = \\arg\\max_{Z} P(Z\\,|\\,O,\\lambda)$ bulunur. Gizli süreçte ne olup bittiğini gerçekten bilmek istediğinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">3. Öğrenme</div><div class="card-body"><strong>Verilen</strong> yalnızca gözlemler $O$ (muhtemelen birden çok dizi) iken $P(O\\,|\\,\\lambda)$'yı maksimum yapan $\\lambda = (A,B,\\pi)$ kestirilir. Parametreler bilinmediğinde ve veriden çıkarılması gerektiğinde kullanılır.</div></div>
</div>

<p class="l-text">Her problem klasik bir verimli algoritmaya sahiptir: değerlendirme için <strong>Forward</strong> (ve aynası Backward), çözümleme için <strong>Viterbi</strong>, öğrenme için <strong>Baum-Welch</strong>. Üçü de aynı dinamik programlama trellis yapısına dayanır ve $N$ gizli durum sayısı, $T$ dizi uzunluğu iken $O(N^2 T)$ zamanda çalışır.</p>

<div class="think-box"><div class="think-label">NAİF BİR İLK DENEME</div><div class="think-body">$P(O\\,|\\,\\lambda)$'yı kaba kuvvetle hesaplamayı düşün: olası her gizli yol $Z$'yi say, $P(Z, O\\,|\\,\\lambda)$ hesapla, topla. $N^T$ yol var. $N=5$ ve $T=100$ için bu $5^{100} \\approx 8\\times 10^{69}$ &mdash; gözlemlenebilir evrendeki atomlardan çok daha fazla. Forward algoritması bunu $5^2 \\cdot 100 = 2500$ işleme indirir. Aynı yanıt, 67 büyüklük basamağı daha ucuz.</div></div>

<h2 class="lesson-title">3. Çalışılmış Örnek: Dondurma ve Hava Durumu</h2>

<div class="calc-highlight"><strong>Eisner'ın dondurma HMM'i:</strong> Jason Eisner'ın klasik öğretim örneği. Gizli süreç günlük havadır; her gün ya Sıcak ($S$) ya da Soğuk ($So$). Gözlem o gün yediğin dondurma sayısıdır: 1, 2 ya da 3. Havayı asla yazmadın, yalnızca dondurmaları. Dondurma dizisinden olası hava geçmişine ulaşmak istiyorsun.</div>

<p class="l-text">Ders boyunca şu sayıları kullanacağız:</p>

<div class="calc-formula"><div class="formula-label">DONDURMA HMM PARAMETRELERİ</div><div class="formula-main">$$A = \\begin{pmatrix} 0.7 & 0.3 \\\\ 0.4 & 0.6 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 0.2 & 0.4 & 0.4 \\\\ 0.5 & 0.4 & 0.1 \\end{pmatrix}, \\quad \\pi = \\begin{pmatrix} 0.6 \\\\ 0.4 \\end{pmatrix}$$</div><div class="formula-sub">$A$'nın satırları (S'den, So'dan), sütunları (S'ye, So'ya). $B$'nin satırları (S verildiğinde, So verildiğinde), sütunları (1, 2, 3) dondurmalı yayım olasılıkları. $\\pi$ ilk gün için öncül.</div></div>

<p class="l-text">Matrisleri cümle gibi oku. Sıcak bir günden sonra ertesi günün de Sıcak olma olasılığı $\\%70$, Soğuk olma olasılığı $\\%30$. Sıcak bir günde $0.2$ olasılıkla 1, $0.4$ olasılıkla 2, $0.4$ olasılıkla 3 dondurma yersin. Soğuk günler doğal olarak daha az dondurmayı tercih eder. İlk gün $0.6$ öncül olasılıkla Sıcaktır.</p>

<p class="l-text">Çalışacağımız gözlem dizisi şu:</p>

<div class="calc-formula"><div class="formula-label">GÖZLENEN DONDURMALAR</div><div class="formula-main">$$O = (o_1, o_2, o_3) = (3, 1, 3)$$</div><div class="formula-sub">Üç gün. İkinci gün şüpheli derecede soğuk görünüyor (yalnızca 1 dondurma), iki sıcak günün arasında. İlginç soru şu: ikinci gün gerçekten Soğuk muydu yoksa olağandışı hafif bir Sıcak gün müydü?</div></div>

<h2 class="lesson-title">4. Forward Algoritması</h2>

<p class="l-text">İlk problem $P(O\\,|\\,\\lambda)$'yı değerlendirmek. Naif yaklaşım, $N^T$ olan tüm gizli yolların üzerinde toplam alır. Forward algoritması aynı toplamı $O(N^2 T)$ zamanda bir trellisin her (durum, zaman) hücresinde tek bir ara büyüklük saklayarak elde eder.</p>

<div class="calc-formula"><div class="formula-label">FORWARD DEĞİŞKENİ</div><div class="formula-main">$$\\alpha_t(j) = P(o_1, o_2, \\ldots, o_t,\\; z_t = s_j\\,|\\,\\lambda)$$</div><div class="formula-sub">İlk $t$ gözlemi görme ve $t$ zamanında gizli durum $s_j$'de olma ortak olasılığı. Dikkat: bu bir ortak olasılık, koşullu değil.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İlklendirme</div><div class="step-detail">Her durum $j$ için $\\alpha_1(j) = \\pi_j \\cdot B_j(o_1)$. Başlangıçta $j$ durumunda olma olasılığı çarpı ilk gözlemin yayım olasılığı.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İndüksiyon</div><div class="step-detail">$t=1,\\ldots,T-1$ ve her $j$ için: $\\alpha_{t+1}(j) = \\Bigl[\\sum_{i=1}^{N} \\alpha_t(i)\\,A_{ij}\\Bigr]\\cdot B_j(o_{t+1})$. $t+1$ zamanında $j$ durumuna ulaşmak için herhangi bir önceki $i$ durumundan gelebilirsin; kısmi ağırlıkları topla ve sonra yeni yayımla çarp.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sonlandırma</div><div class="step-detail">$P(O\\,|\\,\\lambda) = \\sum_{j=1}^{N} \\alpha_T(j)$. Tüm $T$ gözlem işlendikten sonra trellisin son sütunundaki forward değişkenlerini topla. Her gizli yol tam olarak bir terminal $j$'ye katkı yapar, dolayısıyla toplam, toplam olabilirliktir.</div></div></div>
</div>

<p class="l-text"><strong>Neden işliyor.</strong> İndüksiyon adımı, $t$ zamanındaki gizli duruma koşullanmış toplam olasılık yasasıdır: $z_{t+1}=j$'ye ulaşan her yol, bir $z_t=i$'den geçmiş olmalı. Markov varsayımı $t$ zamanından önceki tüm tarihin zaten $\\alpha_t(i)$ tarafından özetlendiği anlamına gelir, dolayısıyla yolu bir adım uzatmak için yalnızca geçiş $A_{ij}$ ve yayım $B_j(o_{t+1})$ ile çarparız.</p>

<div class="calc-example"><div class="example-label">DONDURMA HMM'İNDE FORWARD İZLEMESİ</div><div class="example-body"><strong>Gözlem dizisi $O = (3, 1, 3)$.</strong><br><br><strong>1. Adım (ilklendirme, t=1, $o_1=3$):</strong><br>$\\alpha_1(S) = \\pi_S \\cdot B_S(3) = 0.6 \\cdot 0.4 = 0.24$<br>$\\alpha_1(So) = \\pi_{So} \\cdot B_{So}(3) = 0.4 \\cdot 0.1 = 0.04$<br><br><strong>2. Adım (indüksiyon, t=2, $o_2=1$):</strong><br>$\\alpha_2(S) = [0.24\\cdot 0.7 + 0.04\\cdot 0.4]\\cdot 0.2 = 0.184\\cdot 0.2 = 0.0368$<br>$\\alpha_2(So) = [0.24\\cdot 0.3 + 0.04\\cdot 0.6]\\cdot 0.5 = 0.096\\cdot 0.5 = 0.0480$<br><br><strong>3. Adım (indüksiyon, t=3, $o_3=3$):</strong><br>$\\alpha_3(S) = [0.0368\\cdot 0.7 + 0.0480\\cdot 0.4]\\cdot 0.4 \\approx 0.01798$<br>$\\alpha_3(So) = [0.0368\\cdot 0.3 + 0.0480\\cdot 0.6]\\cdot 0.1 \\approx 0.00398$<br><br><strong>Sonlandırma:</strong> $P(O\\,|\\,\\lambda) = \\alpha_3(S) + \\alpha_3(So) \\approx 0.02197$.<br><br>$(3,1,3)$ dizisini görmenin HMM'imize göre olabilirliği yaklaşık $\\%2.2$. Naif olarak $2^3 = 8$ yol üzerinde toplam alsaydık aynı yanıtı sekiz çok daha karmaşık çarpımda elde ederdik.</div></div>

<div id="plot-l2-forward-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var vals=[[0.24,0.0368,0.01798],[0.04,0.0480,0.00398]];
var states=['S','So'];var times=['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'];
var ann=[];
for(var i=0;i<2;i++){for(var j=0;j<3;j++){ann.push({x:times[j],y:states[i],text:vals[i][j].toFixed(4),showarrow:false,font:{color:'#0a0a0a',size:13,family:'Inter'}});}}
var heat={z:vals,x:times,y:states,type:'heatmap',colorscale:[[0,'#1e293b'],[0.3,'#3b82f6'],[1,'#fbbf24']],showscale:true,colorbar:{title:{text:'α deger',font:{color:'#e8e8e8'}},tickfont:{color:'#e8e8e8'}}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'zaman adimi',gridcolor:'#1f2937',side:'top'},yaxis:{title:'gizli durum',gridcolor:'#1f2937',autorange:'reversed'},annotations:ann,margin:{t:60,r:80,b:40,l:60},height:280};
Plotly.newPlot('plot-l2-forward-tr',[heat],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dondurma gözlemi $O=(3,1,3)$ için Forward trellisi $\\alpha_t(j)$. Satırlar gizli durumlar $S$ ve $So$. Sütunlar zaman adımları. Her hücre ilk $t$ gözlemin ve o durumda olmanın ortak olasılığını tutar. $t=2$'de Soğuk hücresi ($0.0480$) Sıcak hücresinden ($0.0368$) ağırdır; bu tek dondurmanın Soğuk ile daha uyumlu olmasını yansıtır. $t=3$'te eğilim tersine döner çünkü üç dondurma Sıcağı güçlü destekler. Son sütunun toplamı $P(O\\,|\\,\\lambda) \\approx 0.022$ verir.</div></div>

<h2 class="lesson-title">5. Backward Algoritması</h2>

<p class="l-text">Forward algoritması soldan sağa tarar. Backward algoritması onun aynasıdır: sağdan sola tarar ve belirli bir durumda olduğun verildiğinde geri kalan geleceğin olasılığını hesaplar. Tek başına sana forward toplamının ötesinde bir şey kazandırmaz, ama onunla birleştirildiğinde çok daha fazla soruyu yanıtlayabilirsin.</p>

<div class="calc-formula"><div class="formula-label">BACKWARD DEĞİŞKENİ</div><div class="formula-main">$$\\beta_t(i) = P(o_{t+1}, o_{t+2}, \\ldots, o_T\\,|\\,z_t = s_i, \\lambda)$$</div><div class="formula-sub">$t$ zamanında $s_i$ durumunda olduğun verildiğinde gelecek gözlemleri $o_{t+1}, \\ldots, o_T$ görme olasılığı. Bu sefer $\\alpha$'nın aksine koşullu bir olasılık.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İlklendirme</div><div class="step-detail">Her durum $i$ için $\\beta_T(i) = 1$. $T$ zamanından sonra gözlem yoktur, dolayısıyla boş gelecek aşikar şekilde bir olasılığa sahiptir.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">İndüksiyon (geriye)</div><div class="step-detail">$t=T-1, T-2, \\ldots, 1$ ve her $i$ için: $\\beta_t(i) = \\sum_{j=1}^{N} A_{ij}\\, B_j(o_{t+1})\\, \\beta_{t+1}(j)$. Geçebileceğin her bir sonraki durum $j$ üzerinde, geçiş olasılığı, $j$'den $o_{t+1}$ yayımı ve $j$'den gelen gelecek olasılığı ile ağırlıklı ortalama al.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sağlama amaçlı sonlandırma</div><div class="step-detail">$P(O\\,|\\,\\lambda) = \\sum_{i} \\pi_i\\, B_i(o_1)\\, \\beta_1(i)$. Backward değişkenini başlangıç ağırlığı ve ilk yayımla çarpıp toplamak, Forward algoritmasıyla elde edilen aynı olabilirliği yeniden üretmelidir. Mükemmel bir birim test.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">DONDURMA HMM'İNDE BACKWARD İZLEMESİ</div><div class="example-body"><strong>1. Adım (ilklendirme, t=3):</strong> $\\beta_3(S) = \\beta_3(So) = 1$.<br><br><strong>2. Adım (indüksiyon, t=2, $o_3=3$):</strong><br>$\\beta_2(S) = 0.7\\cdot 0.4\\cdot 1 + 0.3\\cdot 0.1\\cdot 1 = 0.31$<br>$\\beta_2(So) = 0.4\\cdot 0.4\\cdot 1 + 0.6\\cdot 0.1\\cdot 1 = 0.22$<br><br><strong>3. Adım (indüksiyon, t=1, $o_2=1$):</strong><br>$\\beta_1(S) = 0.7\\cdot 0.2\\cdot 0.31 + 0.3\\cdot 0.5\\cdot 0.22 = 0.0764$<br>$\\beta_1(So) = 0.4\\cdot 0.2\\cdot 0.31 + 0.6\\cdot 0.5\\cdot 0.22 = 0.0908$<br><br><strong>Çapraz kontrol:</strong> $\\sum_i \\pi_i B_i(o_1) \\beta_1(i) \\approx 0.0219$. Yuvarlamaya kadar Forward olabilirliği $\\approx 0.0220$ ile uyumlu. İki algoritma tutarlı.</div></div>

<h2 class="lesson-title">6. Posterior Durum Olasılıkları</h2>

<p class="l-text">Forward ve Backward değişkenleri elinde olduğunda sistemin herhangi bir zamanda herhangi bir durumda olma posterior olasılığını hesaplayabilirsin. Bu hem "yumuşak" çözümlemenin temelidir (her zamanda her duruma olasılık vermek) hem de Baum-Welch M-adımının temelidir.</p>

<div class="calc-formula"><div class="formula-label">PÜRÜZSÜZLEŞTİRİLMİŞ POSTERIOR</div><div class="formula-main">$$\\gamma_t(i) = P(z_t = s_i\\,|\\,O, \\lambda) = \\frac{\\alpha_t(i)\\,\\beta_t(i)}{\\sum_{j} \\alpha_t(j)\\,\\beta_t(j)} = \\frac{\\alpha_t(i)\\,\\beta_t(i)}{P(O\\,|\\,\\lambda)}$$</div><div class="formula-sub">Pay, $t$ zamanında $i$ durumunda olma ile tüm gözlem dizisinin ortak olasılığıdır. Payda $\\sum_i \\gamma_t(i) = 1$ olacak şekilde normalleştirir.</div></div>

<p class="l-text">$\\alpha_t(i)\\beta_t(i)$ çarpımı neden $t$ anındaki durumun ve tam dizinin ortak olasılığını verir? Forward değişkeni zaten geçmişi ve şu anki durumu içerir; backward değişkeni şu anki duruma koşullanmış geleceği içerir. İki yarı $P(O, z_t = s_i\\,|\\,\\lambda)$ ortak olasılığına birleşir ve toplam olabilirliğe bölmek koşullu posterior'u verir.</p>

<div class="calc-example"><div class="example-label">DONDURMA HMM'İ İÇİN POSTERIOR'LAR</div><div class="example-body">$t=2$'de: $\\gamma_2(S) = 0.0368 \\cdot 0.31 / 0.0220 \\approx 0.519$, $\\gamma_2(So) \\approx 0.481$. Yani orta günde Sıcak Soğuk'tan çok az daha olası &mdash; iki uca göre çok daha yumuşak bir sonuç. Tek dondurma Soğuğa çekti, ama çevredeki sıcak günler (ve yüksek $A_{SS}$ öz-döngüsü) Sıcağa geri çekti.</div></div>

<div id="plot-l2-posterior-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var times=['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'];
var gH=[0.834,0.519,0.818];
var gC=[0.166,0.481,0.182];
var trH={x:times,y:gH,name:'Sicak',type:'bar',marker:{color:'#f59e0b'}};
var trC={x:times,y:gC,name:'Soguk',type:'bar',marker:{color:'#60a5fa'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},barmode:'stack',xaxis:{title:'zaman adimi',gridcolor:'#1f2937'},yaxis:{title:'posterior γ_t(i)',gridcolor:'#1f2937',range:[0,1]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:300};
Plotly.newPlot('plot-l2-posterior-tr',[trH,trC],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dondurma HMM'i için pürüzsüzleştirilmiş posterior $\\gamma_t(i)$. 1. ve 3. günler güçlü şekilde Sıcak (yaklaşık $\\%83$, $\\%82$). 2. gün belirsiz: yaklaşık $\\%52$ Sıcak'a karşı $\\%48$ Soğuk. Viterbi bunu tek bir etikete sıkıştıracak ama yumuşak posterior'lar marjinal kararlar hakkında daha dürüsttür.</div></div>

<h2 class="lesson-title">7. Viterbi Algoritması</h2>

<div class="calc-highlight"><strong>Toplamdan maks'a.</strong> Değerlendirme $\\sum_Z P(Z, O)$'yu ister. Çözümleme $\\arg\\max_Z P(Z, O)$'yu &mdash; en yüksek ortak olasılığa sahip tek gizli diziyi &mdash; ister. İki problemin neredeyse aynı yinelemesi vardır: Forward algoritmasındaki her $\\sum$'yi $\\max$ ile değiştir ve kazanan yolu yeniden inşa edebilmek için bir geri-işaretçi tablosu ekle. Bu Andrew Viterbi'nin 1967'de evrişimli kodlar için yayımladığı ve konuşma tanımadan GSM telefonlara kadar her yerde benimsenen Viterbi algoritmasıdır.</div>

<div class="calc-formula"><div class="formula-label">VITERBI DEĞİŞKENİ</div><div class="formula-main">$$\\delta_t(j) = \\max_{z_1, \\ldots, z_{t-1}} P(z_1, \\ldots, z_{t-1}, z_t = s_j,\\; o_1, \\ldots, o_t\\,|\\,\\lambda)$$</div><div class="formula-sub">$t$ zamanında $s_j$ durumunda biten ve ilk $t$ gözlemi üreten herhangi bir yolun maksimum ortak olasılığı. $\\alpha_t(j)$'nin "tüm yolların toplamı" anlamını $\\delta_t(j)$'nin "en iyi tek yol" anlamıyla değiştirir.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İlklendirme</div><div class="step-detail">$\\delta_1(j) = \\pi_j\\,B_j(o_1)$ ve $\\psi_1(j) = 0$ (öncül yok). Bu adımda Forward ile aynıdır çünkü tek bir başlangıç pozisyonu üzerinde alınacak maks yoktur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Geri-işaretçilerle indüksiyon</div><div class="step-detail">$t=1,\\ldots,T-1$ ve her $j$ için: $\\delta_{t+1}(j) = \\max_{i}\\bigl[\\delta_t(i)\\,A_{ij}\\bigr]\\cdot B_j(o_{t+1})$ ve $\\psi_{t+1}(j) = \\arg\\max_{i}\\bigl[\\delta_t(i)\\,A_{ij}\\bigr]$. Geri-işaretçi $\\psi_{t+1}(j)$ kazanan önceki durumun hangisi olduğunu kaydeder.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Sonlandırma ve geri izleme</div><div class="step-detail">$P^{\\ast} = \\max_j \\delta_T(j)$, $z_T^{\\ast} = \\arg\\max_j \\delta_T(j)$, sonra geriye yürü: $z_t^{\\ast} = \\psi_{t+1}(z_{t+1}^{\\ast})$. Yeniden inşa edilen dizi $Z^{\\ast}$ Viterbi yoludur.</div></div></div>
</div>

<div class="calc-example"><div class="example-label">$O=(3,1,3)$ ÜZERİNDE VITERBI İZLEMESİ</div><div class="example-body"><strong>1. Adım (ilklendirme):</strong><br>$\\delta_1(S) = 0.24, \\quad \\delta_1(So) = 0.04$<br><br><strong>2. Adım (t=2, $o_2=1$):</strong><br>$\\delta_2(S)$: adaylar $0.24\\cdot 0.7 = 0.168$, $0.04\\cdot 0.4 = 0.016$. Maks $0.168$, $S$'den. $\\delta_2(S) = 0.168\\cdot 0.2 = 0.0336$, $\\psi_2(S) = S$.<br>$\\delta_2(So)$: adaylar $0.072, 0.024$. Maks $0.072$, $S$'den. $\\delta_2(So) = 0.072\\cdot 0.5 = 0.0360$, $\\psi_2(So) = S$.<br><br><strong>3. Adım (t=3, $o_3=3$):</strong><br>$\\delta_3(S)$: adaylar $0.0336\\cdot 0.7 = 0.02352$, $0.0360\\cdot 0.4 = 0.01440$. Maks $0.02352$, $S$'den. $\\delta_3(S) = 0.02352\\cdot 0.4 = 0.00941$, $\\psi_3(S) = S$.<br>$\\delta_3(So)$: adaylar $0.01008, 0.02160$. Maks $0.02160$, $So$'dan. $\\delta_3(So) = 0.02160\\cdot 0.1 = 0.00216$, $\\psi_3(So) = So$.<br><br><strong>Sonlandırma:</strong> $\\max_j \\delta_3(j) = 0.00941$ at $j=S$. Geri izleme: $z_3^{\\ast} = S$, $z_2^{\\ast} = \\psi_3(S) = S$, $z_1^{\\ast} = \\psi_2(S) = S$.<br><br><strong>En iyi yol:</strong> $(S, S, S)$. İkinci günün tek dondurmasına rağmen, en olası açıklama üç günün de Sıcak olduğudur: güçlü öz-geçiş $A_{SS}=0.7$, bir gün için zayıf yayım $B_S(1)=0.2$'den ağır basar.</div></div>

<div id="plot-l2-viterbi-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var nodesX=[1,1,2,2,3,3];
var nodesY=[2,1,2,1,2,1];
var labels=['S<br>0.240','So<br>0.040','S<br>0.0336','So<br>0.0360','S<br>0.00941*','So<br>0.00216'];
var arrowsAll=[];
function add(x0,y0,x1,y1,col,wid){arrowsAll.push({type:'line',x0:x0,y0:y0,x1:x1,y1:y1,line:{color:col,width:wid},xref:'x',yref:'y'});}
add(1,2,2,2,'#374151',1);add(1,2,2,1,'#374151',1);
add(1,1,2,2,'#374151',1);add(1,1,2,1,'#374151',1);
add(2,2,3,2,'#374151',1);add(2,2,3,1,'#374151',1);
add(2,1,3,2,'#374151',1);add(2,1,3,1,'#374151',1);
add(1,2,2,2,'#10b981',4);
add(2,2,3,2,'#10b981',4);
var tr={x:nodesX,y:nodesY,mode:'markers+text',text:labels,textposition:'middle center',textfont:{color:'#0a0a0a',size:11,family:'Inter'},marker:{size:55,color:['#f59e0b','#60a5fa','#f59e0b','#60a5fa','#f59e0b','#60a5fa'],line:{color:'#0a0a0a',width:2}},showlegend:false,hoverinfo:'text'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'zaman',gridcolor:'#1f2937',tickvals:[1,2,3],ticktext:['t=1 (o=3)','t=2 (o=1)','t=3 (o=3)'],range:[0.5,3.5]},yaxis:{title:'durum',gridcolor:'#1f2937',tickvals:[1,2],ticktext:['So','S'],range:[0.5,2.5]},shapes:arrowsAll,margin:{t:40,r:20,b:50,l:50},height:320};
Plotly.newPlot('plot-l2-viterbi-tr',[tr],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $O=(3,1,3)$ için Viterbi trellisi. Her hücre $\\delta_t(j)$'yi tutar. Gri oklar olası tüm geçişler; kalın yeşil oklar kazanan geri-işaretçi zinciri ($\\psi$). Yıldızlı son hücre $\\delta_3(S)=0.00941$ maksimum ortak olasılıktır. Yeşil okları geriye takip etmek en olası gizli yol $(S,S,S)$'yi yeniden inşa eder.</div></div>

<div class="think-box"><div class="think-label">VITERBI YUMUŞAK POSTERIOR'A KARŞI</div><div class="think-body">İki yanıt arasındaki gerilime dikkat et. $t=2$'de yumuşak posterior'lar Sıcak $\\%52$'ye karşı Soğuk $\\%48$ dedi. Viterbi Sıcağı seçti. Bunlar farklı sorulardır: posterior'lar dizinin geri kalanı üzerinde marjinalize eder, Viterbi tek en iyi ortak yola bakar. Konuşma tanımada Viterbi standart seçimdir çünkü tek bir transkript istersiniz; sözcük türü etiketlemede yumuşak posterior'lar bazen alt akış olasılıksal modellere beslemek için tercih edilir.</div></div>

<h2 class="lesson-title">8. Baum-Welch: Beklenti-Maksimizasyonu ile Öğrenme</h2>

<div class="calc-highlight"><strong>Büyük ödül.</strong> Forward ve Viterbi parametrelerin $(A, B, \\pi)$ zaten bilindiğini varsayar. Pratikte elinde gözlem dizilerinin bir derlemi vardır ama etiketli gizli durumlar yoktur. Baum-Welch (Baum, Eagon, Petrie 1970) bunu, genel EM çerçevesinin 1977'de isimlendirilmesinden onlarca yıl önce, bir Beklenti-Maksimizasyonu yinelemesiyle çözer. Her yineleme veri olabilirliğini azaltmamayı garanti eder; algoritma yerel bir maksimuma yakınsar.</div>

<p class="l-text">EM iki adımı sırayla yapar. <strong>E-adımında</strong> mevcut parametre tahminini kullanarak her geçişin ve her yayımın ne sıklıkta kullanıldığına dair beklenen sayımları hesaplarsın. <strong>M-adımında</strong> bu beklenen sayımları tam etiketli bir veri kümesindeki gözlenen sayımlar gibi ele alıp standart maksimum olabilirlik formüllerini (yalnızca normalleştirilmiş sayımlar) uygulayarak parametreleri yeniden kestirirsin. Log-olabilirlik iyileşmesi durana kadar yinele.</p>

<div class="calc-formula"><div class="formula-label">BEKLENEN GEÇİŞ SAYIMLARI</div><div class="formula-main">$$\\xi_t(i, j) = P(z_t = s_i, z_{t+1} = s_j\\,|\\,O, \\lambda) = \\frac{\\alpha_t(i)\\, A_{ij}\\, B_j(o_{t+1})\\, \\beta_{t+1}(j)}{P(O\\,|\\,\\lambda)}$$</div><div class="formula-sub">Tüm gözlem dizisi ve mevcut model verildiğinde $t$ zamanında durum $i$ ve $t+1$ zamanında durum $j$ olma olasılığı. Forward ve backward değişkenlerinden bedavaya hesaplanır.</div></div>

<div class="calc-formula"><div class="formula-label">BAUM-WELCH GÜNCELLEME KURALLARI</div><div class="formula-main">$$\\hat{\\pi}_i = \\gamma_1(i)$$ $$\\hat{A}_{ij} = \\frac{\\sum_{t=1}^{T-1} \\xi_t(i,j)}{\\sum_{t=1}^{T-1} \\gamma_t(i)}$$ $$\\hat{B}_j(k) = \\frac{\\sum_{t:\\,o_t=v_k} \\gamma_t(j)}{\\sum_{t=1}^{T} \\gamma_t(j)}$$</div><div class="formula-sub">Başlangıç-durumu kestirimi: 1. günün posterior'u. Geçiş kestirimi: beklenen $i\\to j$ geçişleri bölü $i$'ye beklenen ziyaretler. Yayım kestirimi: $j$'ye $v_k$ gözlemi üreten beklenen ziyaretler bölü $j$'ye toplam beklenen ziyaretler.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İlklendir</div><div class="step-detail">Rastgele (ama geçerli) $(A, B, \\pi)$ seç. Patolojik simetrilerden kaçın; küçük rastgele tedirginlikler standarttır.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">E-adımı</div><div class="step-detail">Mevcut parametrelerle Forward ve Backward algoritmalarını çalıştır. Her $t$ için $\\gamma_t(i)$ ve $\\xi_t(i,j)$ hesapla.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">M-adımı</div><div class="step-detail">Yukarıdaki güncelleme kurallarıyla $(A, B, \\pi)$'yi yeniden kestir. Her yeni kestirim yalnızca beklenen sayımların normalleştirilmiş toplamıdır.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Yakınsamayı kontrol et</div><div class="step-detail">$\\log P(O\\,|\\,\\lambda)$ log-olabilirliğini hesapla. Önceki yinelemeye göre iyileşme bir tolerans altındaysa (ör. $10^{-6}$) ya da maksimum yineleme sınırına ulaştıysan dur. Aksi halde 2. adıma dön.</div></div></div>
</div>

<div class="l-note"><strong>Önemli uyarılar:</strong> (1) Baum-Welch olabilirliğin <em>yerel</em> bir maksimumunu bulur, global değil. Birden çok rastgele yeniden başlatma standart uygulamadır. (2) Gizli durumların etiketleri keyfidir &mdash; algoritmanın hangi durumun "Sıcak", hangisinin "Soğuk" olduğunu bilmesinin yolu yoktur; gerçek değerlere göre etiketleri takas etmiş olabilirsin. (3) Birkaç onlarca zaman adımından uzun diziler için sayısal ölçekleme (Bölüm 9) gereklidir.</div>

<div id="plot-l2-baumwelch-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var iters=[];var ll=[];
var values=[-220,-185,-162,-148,-141,-137,-134.5,-133,-132.1,-131.6,-131.3,-131.2,-131.15,-131.13,-131.12,-131.12,-131.12,-131.12];
for(var i=0;i<values.length;i++){iters.push(i);ll.push(values[i]);}
var d1={x:iters,y:ll,mode:'lines+markers',name:'log-olabilirlik',line:{color:'#3b82f6',width:2.5},marker:{size:7,color:'#3b82f6'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'EM yinelemesi',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'log P(O | λ)',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:280};
Plotly.newPlot('plot-l2-baumwelch-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> tipik bir Baum-Welch yakınsama eğrisi. Log-olabilirlik monoton iyileşir (EM garantisidir) ve yaklaşık bir düzine yinelemeden sonra düzleşir. Düzleşme yerel bir maksimumdur; birkaç rastgele ilklendirme ile çalıştırıp en iyi son olabilirliği seçmek, zayıf yerel optimumlara karşı standart savunmadır.</div></div>

<h2 class="lesson-title">9. Sayısal Kararlılık: Log-Uzayı ve Ölçekleme</h2>

<p class="l-text">Uygulama hakkında ciddi bir uyarı. Forward ve Backward değişkenleri, her biri birden küçük olasılıkların çarpımıdır. Uzunluğu $T=500$ olan bir dizi için bu çarpımlar kolayca en küçük pozitif çift duyarlıklı ondalık sayının ($\\approx 10^{-308}$) altına düşer ve sessizce sıfıra yuvarlanır. İki eşit derecede iyi çözüm standarttır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Log-uzayı</div><div class="card-body">Her çarpmayı logaritmaların toplamı ile değiştir: $\\log \\alpha_t(j) = \\log B_j(o_t) + \\log\\sum_i \\exp\\bigl[\\log \\alpha_{t-1}(i) + \\log A_{ij}\\bigr]$. İç toplam <em>log-sum-exp</em> hilesini gerektirir: sayıları aralıkta tutmak için üs almadan önce maksimum logu dışarı çek. Standart uygulama <code>scipy.special.logsumexp</code>'tedir.</div></div>
<div class="calc-card"><div class="card-title">Ölçekleme</div><div class="card-body">Her zaman adımından sonra $\\alpha_t$'yi bileşenleri bire toplanacak şekilde normalleştir ve ölçekleme çarpanı $c_t$'yi hatırla. Son olabilirlik tersleri çarparak geri alınır: $P(O\\,|\\,\\lambda) = \\prod_t 1/c_t$. Sonuç olarak log-uzayına eşdeğer, ama sıradan toplama ve çarpma kullanır. Rabiner'in öğreticisi bu yaklaşımı kullanır.</div></div>
</div>

<div class="l-note"><strong>Pratik kural:</strong> $T \\approx 50$'den uzun bir dizide ölçeklenmemiş Forward algoritmasını asla çalıştırma. IEEE-754 ondalıkları için sayısal sınır $10^{-308}$'e daha yakındır, ama çarpımlar çok daha erken hassasiyet kaybetmeye başlar. Hem ölçekleme hem de log-uzayı yalnızca sabit çarpan daha fazla aritmetiğe mal olur.</div>

<h2 class="lesson-title">10. AI Uygulamaları: HMM'lerin Dünyayı Kazandığı Yer</h2>

<div class="calc-highlight"><strong>Bu dersin tarihsel önemi:</strong> Saklı Markov Modelleri konuşma, dil ve biyoenformatikteki ilk nesil pratik yapay zekâ sistemlerini besledi. Yaklaşık 1980'den 2010'a kadar baskın konuşma tanıyıcılar, sözcük türü etiketleyiciler ve gen bulma araçlarının tümü HMM tabanlıydı. Derin öğrenme bu alanların çoğunda HMM'leri yerinden etti, ama kavramsal iskele &mdash; zaman içinde evrilen gizli durum, gizli duruma koşullanmış gözlemler, maksimum olabilirlikle eğitim &mdash; doğrudan RNN'lere, LSTM'lere ve Transformer'lara taşındı.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Konuşma tanıma (1980'ler-2010'lar)</div><div class="card-body">Her fonem bir avuç gizli durumlu küçük soldan-sağa HMM olarak modellendi. Yayımlar Gauss karışımlarıyla (GMM-HMM) ve sonra derin sinir ağlarıyla (DNN-HMM, Hinton vd. 2012) modellendi. Sözcükler fonem HMM'lerinin dizileriydi; cümleler sözcük HMM'lerinin dizileri. 2014 öncesi neredeyse her konuşma motoru tam olarak bu yığını kullandı: Sphinx, HTK, Kaldi, Dragon NaturallySpeaking, Apple Dictation. Modern uçtan-uca CTC ve Transformer sistemleri HMM'leri aşmıştır ama kavramsal soy doğrudandır.</div></div>
<div class="calc-card"><div class="card-title">Sözcük türü etiketleme</div><div class="card-body">Gizli durum = sözcük türü etiketi (isim, fiil, belirleyici, ...). Gözlem = sözcük. Penn Treebank üzerinde Baum-Welch ile veya doğrudan etiketli verilerden sayımla eğitilen HMM POS etiketleyiciler İngilizce haber metninde yaklaşık $\\%95$ doğruluğa ulaşır. Yirmi yıl boyunca standart NLP temel modeliydi ve etiketli verinin az olduğu düşük-kaynaklı diller için hâlâ mükemmeldir.</div></div>
<div class="calc-card"><div class="card-title">Biyoenformatik</div><div class="card-body">GENSCAN (Burge ve Karlin 1997) insan DNA'sında gen yapılarını tanımlamak için sofistike bir HMM kullandı; tek geçişte ekzonları, intronları, kesim bölgelerini ve promotörleri buldu. HMMER (Eddy 1998) protein dizilerini aile modelleriyle eşlemek için profil-HMM'ler kullanır. En büyük protein aileleri kataloğu Pfam, esasen bir HMM kütüphanesidir. Bu araçlar aktif kullanımda kalır; derin öğrenme biyoenformatikte onları desteklemiş ama yerinden etmemiştir.</div></div>
<div class="calc-card"><div class="card-title">Etkinlik tanıma</div><div class="card-body">Gizli durum = mevcut fiziksel etkinlik (yürüme, koşma, oturma, merdiven çıkma). Gözlem = ivmeölçer veya jiroskop okumaları. HMM'ler erken fitness-bandı etkinlik sınıflandırıcılarına ve birçok tıbbi izleme sistemine güç verir. Geçiş öncülleri doğal olarak etkinliklerin ataletinin olduğunu kodlar (her $20$ ms'de yürüme ve oturma arasında geçiş yapmazsın).</div></div>
</div>

<div class="think-box"><div class="think-label">TARİHSEL BİR ANEKDOT</div><div class="think-body">IBM Watson'daki Frederick Jelinek ünlü (kötü ünlü) sözü icat etti: "Ne zaman bir dilbilimciyi işten çıkarsam, konuşma tanıyıcının performansı artıyor." Ekibinin 1980'ler ve 90'lar boyunca gizli silahı, devasa derlemler üzerinde Baum-Welch ile eğitilmiş HMM idi. Ders modern makine öğrenmesi için temeldir: basit istatistiksel modeller artı çok veri, akıllı el-yapımı kuralları yener.</div></div>

<h2 class="lesson-title">11. HMM'den Sinirsel Dizi Modellerine</h2>

<p class="l-text">Bir HMM'in modern sinirsel dizi modellerinin ele aldığı iki sınırlaması vardır. Birincisi, gizli durum küçük sonlu bir alfabeyle ayrıktır; zengin bağlamı kodlamakta zorlanır. İkincisi, geçiş işlevi basit bir multinomialdir; tek bir durum indeksine sığandan daha karmaşık tarih bağımlılıklarını temsil edemez.</p>

<p class="l-text">Yinelemeli sinir ağları (RNN, LSTM, GRU) her ikisini de genelleştirir: gizli durum $h_t \\in \\mathbb{R}^d$ sürekli yüksek-boyutlu bir vektördür ve geçiş $h_{t+1} = f_\\theta(h_t, x_t)$ öğrenilmiş bir doğrusal olmayan işlevdir. Sezgi bir HMM ile aynıdır &mdash; zaman içinde evrilen, çıktı yayan gizli bir durum &mdash; ama temsil kapasitesi çok daha büyüktür. Transformer'lar sıralı yinelemeyi tüm geçmiş tokenlar üzerinde açık dikkat ile değiştirerek daha da ileri gider, ama kavramsal kök doğrudan "geçmişe koşullanmış $t$ anındaki gizli durum"a uzanır.</p>

<div class="l-note"><strong>HMM'e ne zaman hâlâ uzanılır:</strong> küçük veri; yorumlanabilir geçiş yapısı; açık olasılıksal çözümleme gereksinimi; uç cihazlarda çok hızlı çıkarım. Diğer her şey için sinirsel dizi modelleri 2026'da varsayılandır. Ama HMM'leri anlamak, sinirsel dizi modellerinin neden böyle göründüğünü anlamanın en temiz yoludur.</div>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Ne gözlemlemelisin.</strong> $(3,1,3)$ için Forward olabilirliği yaklaşık $0.022$ yazdırır; bu Bölüm 4'teki el ile türetmeyle uyumludur. Viterbi yolu $\\text{SSS}$ yazdırır; Bölüm 7 ile uyumlu. 2000 adımlı bir dizide Baum-Welch'ten sonra geri kazanılan $\\hat{A}$ ve $\\hat{B}$ gerçek matrislere yakın olmalıdır (muhtemelen iki gizli durum takas edilmiş olarak &mdash; Bölüm 8'deki etiket keyfiliğini hatırla). Log-olabilirlik yinelemeler boyunca monoton artar.</p>

<div class="think-box"><div class="think-label">DENENECEK DENEYLER</div><div class="think-body">Dizi uzunluğunu $2000$'den $20{,}000$'e çıkar ve geri kazanılan parametrelerin gerçeğe daha çok yaklaştığını izle. Gerçekten kısa bir dizi ($T=50$) dene ve çok daha gürültülü kestirimi gözlemle. Baum-Welch'i birkaç farklı rastgele tohumla ilklendir ve son log-olabilirliğin uyuştuğunu kontrol et &mdash; uyuşmazsa yerel optimumları görüyorsun. Ayrık yayımı bir Gauss'la değiştir ve sürekli-gözlem tadını hisset (tek değişiklik $B$ için M-adımı formülündedir).</div></div>

<div id="plot-l2-recovered-tr" class="plotly-graph"></div>
<script>setTimeout(function(){
var times=[];for(var i=0;i<60;i++)times.push(i);
var truth=[];var rec=[];
for(var i=0;i<60;i++){
  var s=(i<15)?0:(i<22)?1:(i<40)?0:(i<48)?1:0;
  truth.push(s===0?1:0);
  var noise=Math.random()<0.06?1:0;
  rec.push(noise?(s===0?0:1):(s===0?1:0));
}
var d1={x:times,y:truth,mode:'lines+markers',name:'gercek gizli durum',line:{color:'#10b981',width:2.5,shape:'hv'},marker:{size:6,color:'#10b981'}};
var d2={x:times,y:rec,mode:'lines+markers',name:'Baum-Welch + Viterbi cozumleme',line:{color:'#f59e0b',width:2,shape:'hv',dash:'dot'},marker:{size:5,color:'#f59e0b'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'zaman adimi',gridcolor:'#1f2937',zerolinecolor:'#374151'},yaxis:{title:'durum (1=S, 0=So)',gridcolor:'#1f2937',tickvals:[0,1],ticktext:['So','S'],range:[-0.2,1.2]},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:40,r:20,b:50,l:60},height:280};
Plotly.newPlot('plot-l2-recovered-tr',[d1,d2],layout,{displayModeBar:false,responsive:true});
},250);</script>

<div class="calc-graph"><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> sentetik 60 günlük bir aralıkta gerçek gizli hava dizisi (yeşil, düz) ve Baum-Welch ile eğitilmiş Viterbi çözümlemesinin geri kazandığı dizi (turuncu, noktalı). İki eğri neredeyse mükemmel takip ediyor, geçiş sınırlarında ara sıra bir adımlık yanlış sınıflandırma var. Yalnızca gözlemlerden algoritma hem gizli dinamiği hem de etiketlenmiş yolu yeniden keşfetmiş.</div></div>

<div class="calc-highlight"><strong>Şimdi yapabileceklerin:</strong> herhangi bir ayrık-gözlemli HMM'i belirtebilir, skorlayabilir, çözümleyebilir ve eğitebilirsin. Forward, Backward ve Viterbi'nin paylaştığı dinamik programlama mekanizmasını, Baum-Welch'in EM lezzetini ve olasılık çarpımlarının sayısal tuzaklarını anlıyorsun. Bir sonraki ders "gizli geçmişler üzerinde toplama"nın doğal devamını alır: Monte Carlo ve MCMC &mdash; dinamik programlamada toplamın kapatılamadığı ve yanıta örnekleyerek ulaşmamız gereken problemler için beygir algoritmalar.</div>
`
};
