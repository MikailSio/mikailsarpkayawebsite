window.MARKOV_L1 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li>
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li>
<li><a href="/tutorials/matematik/97" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Bayes' Theorem</a> <span style="opacity:0.55;font-size:0.82em">(Math L97)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Expected Value &amp; Variance</a> <span style="opacity:0.55;font-size:0.82em">(Math L101)</span></li>
</ul>
</div>
<p class="l-text"><strong>You have heard the word "Markov" three times already this year.</strong> Once in an NLP class when somebody mentioned n-gram language models. Once in a reinforcement learning tutorial that talked about "Markov decision processes." Once in a PageRank explainer that breezed past "stationary distribution" as if everyone already knew what that meant. Each time, the word arrived attached to something useful, and each time it slipped past before anyone slowed down to say what it actually <em>is</em>.</p>

<p class="l-text">This lesson stops the slipping. We will build the Markov chain from the ground up — states, transitions, matrices, equilibrium — and only once the machinery is in your hands will we turn it on the three AI applications that put Markov's name on every modern syllabus: <strong>n-gram language models</strong>, <strong>PageRank</strong>, and <strong>random-walk graph embeddings</strong>. By the end you will understand why a 19th-century Russian mathematician's pure-probability invention silently powers half of the internet.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Markov (memoryless) property in plain English and in a single conditional-probability equation</li>
<li>Build a transition matrix <em>P</em> from a problem description and verify it is row-stochastic</li>
<li>Compute multi-step transition probabilities via matrix powers <em>P<sup>k</sup></em> and evolve a distribution forward in time</li>
<li>Solve for the stationary distribution <em>π</em> as a left eigenvector and reproduce the same answer by power iteration</li>
<li>Classify states as recurrent / transient, periodic / aperiodic, and recognise when a chain is ergodic</li>
<li>Connect the same matrix machinery to three real AI systems: bigram text generation, PageRank, and DeepWalk-style node embeddings</li>
</ul>
</div>

<h2 class="lesson-title">1. The Memoryless Property</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> tomorrow's weather depends mostly on today's. Whether last Tuesday was sunny or stormy hardly matters once you know what today looks like. A frog on a lily pond decides where to jump based only on which pad it is sitting on, not on the route it took to get there. A piece on a Snakes-and-Ladders board next moves according to the dice and its current square — the squares it visited five turns ago are irrelevant. Every one of these is a Markov chain in disguise.</div>

<p class="l-text">A <strong>stochastic process</strong> is just a sequence of random variables <em>X<sub>0</sub>, X<sub>1</sub>, X<sub>2</sub>, …</em> indexed by time. Each <em>X<sub>n</sub></em> takes a value in some set of <em>states</em>. The process is called a <strong>Markov chain</strong> when its future is completely summarised by its present:</p>

<div class="calc-formula"><div class="formula-label">DEFINITION: THE MARKOV PROPERTY</div><div class="formula-main">$$P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i,\\; X_{n-1} = i_{n-1},\\; \\ldots,\\; X_0 = i_0 \\right) \\;=\\; P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i \\right)$$</div><div class="formula-sub">Conditioning on the entire past collapses to conditioning on the present alone. The chain has no memory beyond its current state.</div></div>

<p class="l-text">Read the equation slowly. The left-hand side says "given the <em>entire</em> history of where I have been, what is the probability my next step lands in state <em>j</em>?" The right-hand side throws away every piece of history except the current state and gets the same answer. The past matters only insofar as it produced the present. Once the present is known, the past is statistically irrelevant.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">What this is NOT</div><div class="card-body">Markov does not mean "independent of the past." It means "independent of the past <em>given the present</em>." Knowing yesterday's weather still tells you something about today's — but only because it told you something about today, which is what we are conditioning on.</div></div>
<div class="calc-card"><div class="card-title">First-order assumption</div><div class="card-body">This is a <em>first-order</em> Markov chain. The next state depends on the most recent one. We will later see <em>k</em>-th order chains (trigram models look at the last two words, etc.), which are equivalent to first-order chains on a larger state space.</div></div>
<div class="calc-card"><div class="card-title">Discrete time and state</div><div class="card-body">We focus on chains where time steps are integers and the state space is finite. Continuous-time chains and continuous-state Markov processes exist (Brownian motion, Itô diffusions) but are L4/L5 material.</div></div>
</div>

<div class="l-note"><strong>Why "memoryless" is a feature, not a bug:</strong> the Markov property is the strongest <em>useful</em> simplification of a stochastic process. Drop it and you must track infinitely many histories. Keep it and you can describe everything with a single matrix. Almost every tractable stochastic model in AI either is Markov or becomes Markov after augmenting the state.</div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is the price of a stock a Markov process if the state is just "today's price"? Probably not — momentum, recent volatility, news cycles all matter. But if you augment the state with several lagged prices and a volatility estimate, you recover something much closer to Markov. The trick of "making a process Markov by enlarging the state" recurs everywhere — including in Transformers, where the attention window is exactly such an enlargement.</div></div>

<h2 class="lesson-title">2. States, Transitions, and the Transition Matrix</h2>

<div class="calc-highlight"><strong>Concrete example: the three-state weather chain.</strong> Each day in our toy city is either Sunny (S), Rainy (R), or Cloudy (C). Long-term observation gives us: a sunny day is followed by sunny 70% of the time, rainy 10%, cloudy 20%. A rainy day is followed by sunny 30%, rainy 40%, cloudy 30%. A cloudy day is followed by sunny 40%, rainy 20%, cloudy 40%. Three states, nine transition probabilities — and you already have a complete Markov chain.</div>

<p class="l-text">Formally, we work with a finite state space <em>S = {s<sub>1</sub>, s<sub>2</sub>, …, s<sub>n</sub>}</em>. The transition probability from state <em>i</em> to state <em>j</em> is</p>

<div class="calc-formula"><div class="formula-label">TRANSITION PROBABILITY</div><div class="formula-main">$$p_{ij} \\;=\\; P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i \\right)$$</div><div class="formula-sub">The probability of jumping from state i to state j in one step. We assume the chain is time-homogeneous: p_{ij} does not depend on n.</div></div>

<p class="l-text">Collect all these numbers into an <em>n × n</em> matrix <strong>P</strong> with entry <em>P<sub>ij</sub> = p<sub>ij</sub></em>. Two structural rules are forced on us by the rules of probability:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Non-negativity</div><div class="card-body">Every entry satisfies p_{ij} ≥ 0. You cannot have a negative probability of moving anywhere.</div><div class="card-formula">p_{ij} ≥ 0</div></div>
<div class="calc-card"><div class="card-title">Rows sum to one</div><div class="card-body">From any state i, the chain must end up <em>somewhere</em> on the next step. The probabilities of all possible destinations sum to one.</div><div class="card-formula">Σ_j p_{ij} = 1</div></div>
<div class="calc-card"><div class="card-title">Stochastic matrix</div><div class="card-body">A matrix satisfying both rules is called <em>row-stochastic</em>. Every Markov chain has one; every row-stochastic matrix defines one.</div><div class="card-formula">P · 1 = 1</div></div>
</div>

<div class="calc-formula"><div class="formula-label">WEATHER CHAIN TRANSITION MATRIX</div><div class="formula-main">$$P \\;=\\; \\begin{pmatrix} 0.70 & 0.10 & 0.20 \\\\ 0.30 & 0.40 & 0.30 \\\\ 0.40 & 0.20 & 0.40 \\end{pmatrix}$$</div><div class="formula-sub">Rows in order S, R, C; columns in the same order. Row 1 (Sunny) sums to 0.70 + 0.10 + 0.20 = 1.00. Check the other two.</div></div>

<div class="calc-graph"><div id="plot-l1-weather-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three-state weather chain as a directed graph. Three nodes (Sunny, Rainy, Cloudy) sit at the vertices of a triangle. Arrows connect every node to every other node — and to itself — labelled with the corresponding transition probability. The thickness of each arrow is proportional to the probability. Self-loops (sunny → sunny, etc.) capture the strong tendency of weather to persist day-to-day.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodes=[{name:'Sunny',x:0,y:1.2,color:'#f59e0b'},{name:'Rainy',x:-1.05,y:-0.55,color:'#3b82f6'},{name:'Cloudy',x:1.05,y:-0.55,color:'#9ca3af'}];
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
var traces=[];
for(var i=0;i<3;i++){for(var j=0;j<3;j++){if(i===j)continue;var x0=nodes[i].x,y0=nodes[i].y,x1=nodes[j].x,y1=nodes[j].y;var dx=x1-x0,dy=y1-y0,L=Math.sqrt(dx*dx+dy*dy);var ux=dx/L,uy=dy/L;var nx=-uy*0.07,ny=ux*0.07;var sx=x0+ux*0.18+nx,sy=y0+uy*0.18+ny;var ex=x1-ux*0.18+nx,ey=y1-uy*0.18+ny;var mx=(sx+ex)/2,my=(sy+ey)/2;traces.push({x:[sx,ex],y:[sy,ey],mode:'lines',line:{color:'rgba(232,232,232,0.45)',width:1+P[i][j]*5},hoverinfo:'skip',showlegend:false});traces.push({x:[mx],y:[my],mode:'text',text:[P[i][j].toFixed(2)],textfont:{size:12,color:'#fbbf24'},showlegend:false,hoverinfo:'skip'});}}
for(var i=0;i<3;i++){var cx=nodes[i].x*1.32,cy=nodes[i].y*1.32;traces.push({x:[cx],y:[cy],mode:'text',text:['self: '+P[i][i].toFixed(2)],textfont:{size:11,color:'#10b981'},showlegend:false,hoverinfo:'skip'});}
var nx=[],ny=[],nt=[],nc=[];for(var i=0;i<3;i++){nx.push(nodes[i].x);ny.push(nodes[i].y);nt.push(nodes[i].name);nc.push(nodes[i].color);}
traces.push({x:nx,y:ny,mode:'markers+text',text:nt,textposition:'middle center',textfont:{size:13,color:'#0a0a0a',family:'Geist'},marker:{size:64,color:nc,line:{color:'#e8e8e8',width:2}},hoverinfo:'skip',showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-2.1,2.1]},yaxis:{visible:false,range:[-1.5,2.0],scaleanchor:'x'},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l1-weather-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Given today is <strong>Sunny</strong>, what is the probability tomorrow is <strong>Rainy</strong>?<br><br>Read off entry P[S, R] = <strong>0.10</strong>. One step, one lookup. The matrix is the entire model.</div></div>

<div class="l-note"><strong>Vocabulary that will come back:</strong> a <em>walk</em> on the chain is any sequence <em>i<sub>0</sub>, i<sub>1</sub>, …, i<sub>k</sub></em> of states it might visit. The probability of a specific walk starting from <em>i<sub>0</sub></em> is the product P[i<sub>0</sub>, i<sub>1</sub>] · P[i<sub>1</sub>, i<sub>2</sub>] · … · P[i<sub>k-1</sub>, i<sub>k</sub>] — a direct consequence of conditioning step by step.</div>

<h2 class="lesson-title">3. Multi-Step Transitions: Powers of P</h2>

<div class="calc-highlight"><strong>The single most beautiful identity in elementary Markov theory.</strong> If <em>P</em> gives one-step transition probabilities, then <em>P<sup>2</sup></em> gives two-step transition probabilities, <em>P<sup>k</sup></em> gives <em>k</em>-step transition probabilities, and you never need to do anything more complicated than matrix multiplication.</div>

<p class="l-text">Why does this work? To go from state <em>i</em> to state <em>j</em> in two steps, the chain must pass through some intermediate state <em>m</em>. By the Markov property, the two halves of the journey are conditionally independent given <em>m</em>:</p>

<div class="calc-formula"><div class="formula-label">TWO-STEP TRANSITION VIA TOTAL PROBABILITY</div><div class="formula-main">$$P\\!\\left( X_{n+2} = j \\,\\big|\\, X_n = i \\right) \\;=\\; \\sum_m p_{im} \\, p_{mj} \\;=\\; (P^2)_{ij}$$</div><div class="formula-sub">The sum over all possible intermediate states m is exactly the (i, j) entry of the matrix product P·P.</div></div>

<p class="l-text">Iterating gives the general result. The proof is one line of induction:</p>

<div class="calc-formula"><div class="formula-label">CHAPMAN–KOLMOGOROV (DISCRETE FORM)</div><div class="formula-main">$$P\\!\\left( X_{n+k} = j \\,\\big|\\, X_n = i \\right) \\;=\\; (P^k)_{ij}$$</div><div class="formula-sub">k-step probabilities are simply the k-th matrix power. Time becomes an exponent.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">For the weather chain, compute <em>P<sup>2</sup></em>.<br><br>$$P^2 \\;=\\; \\begin{pmatrix} 0.60 & 0.15 & 0.25 \\\\ 0.45 & 0.25 & 0.30 \\\\ 0.50 & 0.20 & 0.30 \\end{pmatrix}$$<br>Entry P²[S, S] = 0.7·0.7 + 0.1·0.3 + 0.2·0.4 = 0.49 + 0.03 + 0.08 = <strong>0.60</strong>. Read it: starting from Sunny today, the probability the day-after-tomorrow is also Sunny is 0.60 (lower than 0.70 because some weather can drift in between).</div></div>

<p class="l-text">As we raise <em>P</em> to higher powers something striking happens — the rows start to look the same:</p>

<div class="calc-formula"><div class="formula-label">P TO THE TENTH POWER (WEATHER CHAIN)</div><div class="formula-main">$$P^{10} \\;\\approx\\; \\begin{pmatrix} 0.518 & 0.184 & 0.298 \\\\ 0.518 & 0.184 & 0.298 \\\\ 0.518 & 0.184 & 0.298 \\end{pmatrix}$$</div><div class="formula-sub">All three rows have converged to the same vector. Whatever weather you start with, after ten days the distribution of the current weather is essentially independent of the start.</div></div>

<p class="l-text">This is not an accident. It is the fingerprint of the <em>stationary distribution</em>, which we meet in section 5. Before that, one more piece of machinery.</p>

<h2 class="lesson-title">4. Initial Distribution and Marginal Evolution</h2>

<div class="calc-highlight"><strong>So far we have asked "given state i now, what about k steps later?"</strong> But in many problems we are uncertain about the current state too. The full description is then a <em>probability vector</em> over states — and a single matrix multiplication evolves it forward by one step.</div>

<p class="l-text">An <strong>initial distribution</strong> <em>π<sub>0</sub></em> is a row vector with one entry per state:</p>

<div class="calc-formula"><div class="formula-label">INITIAL DISTRIBUTION</div><div class="formula-main">$$\\pi_0 \\;=\\; \\bigl(\\pi_0[1],\\; \\pi_0[2],\\; \\ldots,\\; \\pi_0[n]\\bigr), \\qquad \\pi_0[i] \\geq 0, \\qquad \\sum_i \\pi_0[i] = 1$$</div><div class="formula-sub">π_0[i] is the probability that the chain starts in state i. Almost the same kind of object as a row of P.</div></div>

<p class="l-text">After one step the distribution becomes <em>π<sub>1</sub></em>. Component <em>j</em> is the probability the chain is in state <em>j</em> at time 1:</p>

<div class="calc-formula"><div class="formula-label">ONE-STEP EVOLUTION</div><div class="formula-main">$$\\pi_1[j] \\;=\\; \\sum_i \\pi_0[i] \\, p_{ij} \\;=\\; (\\pi_0 \\, P)[j]$$</div><div class="formula-sub">A row vector times the transition matrix. The total probability of landing in j is the sum, over every possible starting state i, of (probability of starting at i) times (probability of going from i to j).</div></div>

<p class="l-text">Iterate the same formula for <em>n</em> steps:</p>

<div class="calc-formula"><div class="formula-label">n-STEP EVOLUTION</div><div class="formula-main">$$\\pi_n \\;=\\; \\pi_0 \\, P^n$$</div><div class="formula-sub">Evolution by matrix multiplication. Pure linear algebra in service of pure probability.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Start certain it is Sunny today: <em>π<sub>0</sub> = (1, 0, 0)</em>. Then π<sub>1</sub> = π<sub>0</sub>·P = (0.70, 0.10, 0.20) — exactly the first row of P. After two steps, π<sub>2</sub> = π<sub>0</sub>·P² = (0.60, 0.15, 0.25). After five steps the uncertainty has spread further: π<sub>5</sub> ≈ (0.522, 0.183, 0.295). After twenty steps, π<sub>20</sub> ≈ (0.5179, 0.1843, 0.2978) — and we are inside three decimal digits of the stationary distribution.</div></div>

<div class="calc-graph"><div id="plot-l1-evolve-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the distribution π_n over the three weather states at n = 0, 1, 2, 5, 20 days, starting from "definitely Sunny today." The first bar group is a delta on Sunny. Each subsequent group spreads probability mass toward Rainy and Cloudy. By n = 20 the three groups have settled into the stationary distribution — the rightmost set of bars no longer changes if you go further.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
function step(v){var r=[0,0,0];for(var j=0;j<3;j++){for(var i=0;i<3;i++){r[j]+=v[i]*P[i][j];}}return r;}
var pis={};var v=[1,0,0];pis[0]=v.slice();for(var k=1;k<=20;k++){v=step(v);pis[k]=v.slice();}
var ks=[0,1,2,5,20];var labels=['Sunny','Rainy','Cloudy'];var colors=['#f59e0b','#3b82f6','#9ca3af'];
var traces=[];for(var s=0;s<3;s++){var ys=[];for(var i=0;i<ks.length;i++){ys.push(pis[ks[i]][s]);}traces.push({x:ks.map(function(k){return 'n='+k;}),y:ys,type:'bar',name:labels[s],marker:{color:colors[s]}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},barmode:'group',xaxis:{gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'probability',gridcolor:'rgba(255,255,255,0.07)',range:[0,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-evolve-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Row vs column convention warning.</strong> We are using <em>row vectors</em> on the left: π<sub>n+1</sub> = π<sub>n</sub>·P. Many textbooks (and most physics and PageRank papers) use column vectors on the right with a <em>column-stochastic</em> matrix M: π<sub>n+1</sub> = M·π<sub>n</sub>. They are the same object — M = P<sup>T</sup>. Watch which convention an author uses before you copy their formulas.</div>

<h2 class="lesson-title">5. The Stationary Distribution</h2>

<div class="calc-highlight"><strong>The fixed point.</strong> A distribution <em>π</em> that does not change when you apply one step of the chain is called a <strong>stationary distribution</strong>. Once the chain reaches such a distribution it stays there forever — in distribution, not in path. The chain still jumps from state to state, but the <em>probabilities</em> of being in each state stop evolving.</div>

<div class="calc-formula"><div class="formula-label">STATIONARY DISTRIBUTION: DEFINITION</div><div class="formula-main">$$\\pi \\;=\\; \\pi \\, P, \\qquad \\sum_i \\pi[i] = 1, \\qquad \\pi[i] \\geq 0$$</div><div class="formula-sub">π is a left eigenvector of P with eigenvalue 1, normalised to be a probability vector.</div></div>

<p class="l-text">The "left eigenvector with eigenvalue 1" view is the cleanest. Every row-stochastic matrix has an eigenvalue exactly equal to 1 — proof: <em>P · 1 = 1</em> (the all-ones column vector is a right eigenvector), and a square matrix has the same eigenvalues as its transpose, so 1 is also a <em>left</em> eigenvalue. The Perron–Frobenius theorem promises a nonneg­ative left eigenvector at that eigenvalue, and after normalising it is exactly <em>π</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Existence</div><div class="card-body">Every finite Markov chain has <em>at least one</em> stationary distribution. (Infinite-state chains can fail to.)</div></div>
<div class="calc-card"><div class="card-title">Uniqueness</div><div class="card-body">If the chain is <em>irreducible</em> (all states communicate) the stationary distribution is unique.</div></div>
<div class="calc-card"><div class="card-title">Convergence</div><div class="card-body">If the chain is also <em>aperiodic</em>, then π_n → π for <em>every</em> starting distribution π_0. (This is exactly the "rows of P^k look identical" phenomenon from section 3.)</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SOLVE FOR π IN THE WEATHER CHAIN</div><div class="example-body">We want π = πP with π = (a, b, c) and a + b + c = 1. Writing out the three equations:<br><br>0.70a + 0.30b + 0.40c = a<br>0.10a + 0.40b + 0.20c = b<br>0.20a + 0.30b + 0.40c = c<br><br>Rearrange the first: −0.30a + 0.30b + 0.40c = 0. Together with a + b + c = 1 and one more equation, solving (by hand or with numpy.linalg.solve) gives<br><br>π ≈ <strong>(0.5179, 0.1842, 0.2979)</strong><br><br>In the long run our toy city is sunny 51.8% of days, rainy 18.4%, and cloudy 29.8% — regardless of what today's weather is.</div></div>

<div class="calc-graph"><div id="plot-l1-converge-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the L1 distance ||π_n − π||_1 between the current distribution and the stationary one, plotted on a log scale, for three different starting distributions (definitely Sunny, definitely Rainy, definitely Cloudy). All three curves drop in a straight line on the log axis — geometric convergence at rate determined by the second-largest eigenvalue of P. The starting point hardly matters; the asymptotic slope is the same.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
var pi=[0.5179,0.1842,0.2979];
function step(v){var r=[0,0,0];for(var j=0;j<3;j++){for(var i=0;i<3;i++){r[j]+=v[i]*P[i][j];}}return r;}
function l1(v){var s=0;for(var i=0;i<3;i++){s+=Math.abs(v[i]-pi[i]);}return s;}
var starts=[[1,0,0],[0,1,0],[0,0,1]];var names=['start: Sunny','start: Rainy','start: Cloudy'];var colors=['#f59e0b','#3b82f6','#9ca3af'];
var traces=[];
for(var s=0;s<3;s++){var v=starts[s].slice();var xs=[],ys=[];for(var k=0;k<=20;k++){var d=l1(v);if(d>1e-10){xs.push(k);ys.push(d);}v=step(v);}traces.push({x:xs,y:ys,mode:'lines+markers',name:names[s],line:{color:colors[s],width:2.2},marker:{size:5}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'step n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'|| π_n − π ||_1',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-converge-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Detailed balance (a sneak peek for MCMC, L3):</strong> a distribution π satisfies <em>detailed balance</em> if π[i]·p<sub>ij</sub> = π[j]·p<sub>ji</sub> for all i, j. Detailed balance ⇒ stationary, but not the other way around. Chains designed for sampling (Metropolis–Hastings, Gibbs) are usually constructed to satisfy detailed balance — much easier to engineer than the global balance equation π = πP.</div>

<h2 class="lesson-title">6. Classification of States</h2>

<div class="calc-highlight"><strong>Not every chain reaches a unique equilibrium.</strong> Some have unreachable corners. Some oscillate forever between subsets without ever settling. Some have absorbing states the chain falls into and never leaves. The vocabulary of recurrence, periodicity, and irreducibility is how we tell these cases apart.</div>

<p class="l-text">Two states <em>i</em> and <em>j</em> <strong>communicate</strong> (written <em>i ↔ j</em>) if there is a positive probability of getting from <em>i</em> to <em>j</em> in some number of steps, <em>and</em> from <em>j</em> back to <em>i</em>. Communication partitions the state space into <strong>communicating classes</strong>. A chain is <strong>irreducible</strong> if the entire state space is one communicating class — equivalently, you can get from any state to any other given enough steps.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Recurrent state</div><div class="card-body">Starting from i, the chain returns to i with probability 1. (Visited infinitely often in the long run.)</div></div>
<div class="calc-card"><div class="card-title">Transient state</div><div class="card-body">Starting from i, there is positive probability the chain <em>never</em> returns to i. Visited only finitely many times.</div></div>
<div class="calc-card"><div class="card-title">Absorbing state</div><div class="card-body">A state with p_{ii} = 1: once entered, never left. The trivial extreme of recurrent.</div></div>
<div class="calc-card"><div class="card-title">Period of state i</div><div class="card-body">gcd of all n ≥ 1 with (P^n)_{ii} > 0. If the period is 1, the state is <em>aperiodic</em>.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ERGODIC CHAIN</div><div class="formula-main">$$\\text{ergodic} \\;\\;\\equiv\\;\\; \\text{irreducible} \\;\\wedge\\; \\text{aperiodic} \\;\\wedge\\; \\text{positive recurrent}$$</div><div class="formula-sub">Ergodic chains have a unique stationary distribution AND converge to it from every starting distribution. This is the sweet spot we want for sampling, learning, and prediction.</div></div>

<div class="calc-graph"><div id="plot-l1-period-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two two-state chains side by side. Left: P = [[0, 1], [1, 0]] — the chain oscillates A → B → A → B forever. Period = 2. The probability of being in state A at time n alternates between 0 and 1 and <em>never</em> converges. Right: P = [[0.5, 0.5], [0.5, 0.5]] — pure aperiodic chain. The probability of state A jumps to 0.5 in one step and stays there. Same number of states, completely different long-run behaviour. The period is the silent killer of convergence.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P1=[[0,1],[1,0]];var P2=[[0.5,0.5],[0.5,0.5]];
function step(v,P){var n=v.length;var r=[];for(var j=0;j<n;j++){var s=0;for(var i=0;i<n;i++){s+=v[i]*P[i][j];}r.push(s);}return r;}
var v1=[1,0],v2=[1,0];var xs=[],y1=[],y2=[];for(var k=0;k<=12;k++){xs.push(k);y1.push(v1[0]);y2.push(v2[0]);v1=step(v1,P1);v2=step(v2,P2);}
var d1={x:xs,y:y1,mode:'lines+markers',name:'periodic (period 2)',line:{color:'#ef4444',width:2.2},marker:{size:7}};
var d2={x:xs,y:y2,mode:'lines+markers',name:'aperiodic',line:{color:'#3b82f6',width:2.2},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'step n',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'P(state = A at time n)',gridcolor:'rgba(255,255,255,0.07)',range:[-0.05,1.1]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-period-en',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Quick sanity check on the weather chain.</strong> Is it irreducible? Yes — every state can reach every other in one step (every entry of P is positive). Is it aperiodic? Yes — every diagonal entry is positive, so the period of every state is 1. Is it positive recurrent? Yes — finite irreducible chains automatically are. Therefore the weather chain is ergodic, which is why section 5's convergence theorem applied without complications.</div>

<h2 class="lesson-title">7. Mean Hitting Times and Mean Return Times</h2>

<div class="calc-highlight"><strong>Beyond "where will I end up?" lies "how long will it take to get there?"</strong> The expected number of steps to reach a target state from a starting state is the <em>mean hitting time</em>; the expected steps until the chain returns to its starting state is the <em>mean return time</em>. Both reduce to systems of linear equations — no new theory, just clever bookkeeping.</div>

<p class="l-text">Fix a target state <em>j</em>. Define <em>h<sub>i</sub></em> = expected number of steps to reach <em>j</em>, starting from <em>i</em>. Condition on the first step:</p>

<div class="calc-formula"><div class="formula-label">MEAN HITTING TIMES</div><div class="formula-main">$$h_j = 0, \\qquad h_i \\;=\\; 1 + \\sum_{k \\neq j} p_{ik} \\, h_k \\quad \\text{for } i \\neq j$$</div><div class="formula-sub">From j we are already there (0 steps). From any other state i, we spend one step and then face the same problem from wherever we landed.</div></div>

<p class="l-text">This is a square linear system in the unknowns <em>h<sub>i</sub></em>; solve it with <code>numpy.linalg.solve</code> and you have the expected times for every starting state. The <strong>mean return time</strong> to a state <em>j</em> is then 1 + Σ<sub>i ≠ j</sub> p<sub>ji</sub> · h<sub>i</sub>, where <em>h<sub>i</sub></em> is the hitting time of <em>j</em> from <em>i</em>.</p>

<div class="calc-formula"><div class="formula-label">A SURPRISING THEOREM</div><div class="formula-main">$$\\mathbb{E}\\!\\left[ T_j \\,\\big|\\, X_0 = j \\right] \\;=\\; \\frac{1}{\\pi[j]}$$</div><div class="formula-sub">For an ergodic chain, the mean return time to state j is exactly the reciprocal of its stationary probability. States the chain spends more time in are returned to more frequently — beautifully, exactly.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Weather chain: stationary distribution is π ≈ (0.518, 0.184, 0.298). Mean return time to a Sunny day is 1/0.518 ≈ <strong>1.93 days</strong>. To a Rainy day: 1/0.184 ≈ <strong>5.43 days</strong>. To a Cloudy day: 1/0.298 ≈ <strong>3.36 days</strong>. Rare states wait longer between visits — a single line of theorem captures something a year of weather logging would empirically confirm.</div></div>

<h2 class="lesson-title">8. AI Application 1: n-Gram Language Models</h2>

<div class="calc-highlight"><strong>Bigram language models = first-order Markov chains on word tokens.</strong> Before Transformers (and decades before LSTMs), n-gram models were the working tool of computational linguistics. Their math is exactly what you have just learned — and understanding their limitations explains why the field eventually moved past them.</div>

<p class="l-text">Let the state space be a vocabulary <em>V</em> of words. A <strong>bigram</strong> model assumes the next word depends only on the previous word:</p>

<div class="calc-formula"><div class="formula-label">BIGRAM (FIRST-ORDER) LANGUAGE MODEL</div><div class="formula-main">$$P\\!\\left( w_n \\,\\big|\\, w_{n-1}, w_{n-2}, \\ldots, w_1 \\right) \\;\\approx\\; P\\!\\left( w_n \\,\\big|\\, w_{n-1} \\right)$$</div><div class="formula-sub">A Markov assumption on text. Conditioning on the entire prefix is replaced by conditioning on the single previous word.</div></div>

<p class="l-text">Where does the transition matrix come from? <strong>From counting.</strong> Maximum likelihood estimation says:</p>

<div class="calc-formula"><div class="formula-label">MAXIMUM LIKELIHOOD ESTIMATE</div><div class="formula-main">$$\\hat{P}(w_n = j \\,|\\, w_{n-1} = i) \\;=\\; \\frac{\\#(i, j)}{\\#(i)}$$</div><div class="formula-sub">Numerator: number of times bigram (i, j) appears in the training corpus. Denominator: number of times word i appears (followed by anything). Pure counting; no neural network, no embeddings.</div></div>

<p class="l-text"><strong>Generating text.</strong> Pick a start word. Look up its row in <em>P</em>. Sample the next word from that row's distribution. Repeat. The resulting text is locally fluent ("of the the of the of the" if your data is small enough), occasionally surprisingly coherent, and globally incoherent — because once you have moved one word forward, the model has forgotten everything else.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trigram model</div><div class="card-body">Condition on the previous <em>two</em> words. State = ordered word-pair. Vocabulary size V means up to V² states — already millions for English. The transition matrix becomes sparse and huge.</div></div>
<div class="calc-card"><div class="card-title">k-gram model</div><div class="card-body">Condition on previous k − 1 words. State space grows as V<sup>k−1</sup>. Even with smoothing tricks, beyond k ≈ 5 the model overfits the training corpus.</div></div>
<div class="calc-card"><div class="card-title">Why they fail</div><div class="card-body">Real text has long-range dependencies. "The cat that was sleeping on the warm windowsill at the end of the hallway" — a 4-gram cannot remember that "cat" is the subject by the time we hit the verb. Transformers solved this with full attention.</div></div>
</div>

<div class="l-note"><strong>Smoothing matters.</strong> A naive bigram model assigns probability zero to any bigram that didn't appear in training, which makes the whole sentence probability zero (one zero in a product). <em>Laplace smoothing</em>, <em>Kneser–Ney smoothing</em>, <em>Good–Turing smoothing</em> all add small fractions to unseen bigrams. Modern LLMs do not need this because every prediction is a softmax over the full vocabulary — there are no zeros.</div>

<p class="l-text"><strong>The historical arc.</strong> From the 1950s into the early 2010s, n-gram models powered speech recognition, machine translation, spell checkers, and predictive keyboards. Google's massive web-scale n-gram corpus (released 2006) was the state of the art before deep learning. Today they are a teaching example and a baseline — but the Markov assumption that defined them is exactly the same one we have been studying in this lesson.</p>

<h2 class="lesson-title">9. AI Application 2: PageRank</h2>

<div class="calc-highlight"><strong>Brin and Page, 1998: the founding paper of Google.</strong> The PageRank algorithm assigns an "importance" score to every web page. The trick: model a "random surfer" who clicks links uniformly at random and occasionally teleports to a random page. The stationary distribution of this Markov chain is the importance score. The entire ranking algorithm is one stationary distribution.</div>

<p class="l-text">Let <em>N</em> be the number of web pages. Build a column-stochastic matrix <em>M</em> where</p>

<div class="calc-formula"><div class="formula-label">LINK MATRIX</div><div class="formula-main">$$M_{ji} \\;=\\; \\begin{cases} 1 / \\text{out-degree}(i) & \\text{if page } i \\text{ links to page } j \\\\ 0 & \\text{otherwise} \\end{cases}$$</div><div class="formula-sub">A surfer on page i with out-degree k clicks each outgoing link with probability 1/k. M is the transition matrix of this pure-clicking chain (column convention: columns sum to 1).</div></div>

<p class="l-text">Two problems with this naive chain: <strong>dangling pages</strong> have no outgoing links (their column is all zero — not stochastic), and the chain can have absorbing components that trap the surfer. The fix is to add a probability <em>(1 − α)</em> of <strong>teleporting</strong> to a uniformly random page on each step:</p>

<div class="calc-formula"><div class="formula-label">PAGERANK EQUATION</div><div class="formula-main">$$\\pi \\;=\\; \\alpha \\, M \\, \\pi \\;+\\; (1 - \\alpha) \\, v$$</div><div class="formula-sub">α (typically 0.85) is the probability of following a link; (1 − α) is the probability of teleporting. v is the teleport distribution (uniform 1/N, or personalised). The PageRank vector π is the unique fixed point of this equation.</div></div>

<p class="l-text"><strong>Solving it.</strong> Two methods:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Direct: linear solve</div><div class="card-body">Rewrite as (I − αM) π = (1 − α) v and solve the N × N linear system. Exact but O(N³) — infeasible for billions of pages.</div></div>
<div class="calc-card"><div class="card-title">Power iteration</div><div class="card-body">Start with π<sup>(0)</sup> = uniform. Iterate π<sup>(t+1)</sup> = α M π<sup>(t)</sup> + (1 − α) v. Converges geometrically; each step is one sparse matrix-vector multiply. This is how it is done at web scale.</div></div>
<div class="calc-card"><div class="card-title">Why it converges</div><div class="card-body">The matrix αM + (1 − α) v 1<sup>T</sup> is column-stochastic, irreducible, aperiodic — i.e. ergodic. The chain converges to the unique stationary distribution at rate determined by α (smaller α ⇒ faster convergence, but less faithful to link structure).</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-pagerank-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> PageRank scores on a toy 5-page web. Page A links to B and C; B links to C; C links to A; D and E link only to A. Power iteration over 40 steps with α = 0.85, uniform teleport. Page A wins the highest rank — it is pointed to by C (which itself gets credit from A and B) and by both isolated pages D and E. The bars show the converged scores after iteration; the line traces show how each score evolved during iteration and stabilised within ~15 steps.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=5;var labels=['A','B','C','D','E'];
var M=[[0,0,1,1,1],[0.5,0,0,0,0],[0.5,1,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var alpha=0.85;var v=[1/N,1/N,1/N,1/N,1/N];
var pi=v.slice();var hist=[[],[],[],[],[]];var xs=[];
for(var t=0;t<=40;t++){xs.push(t);for(var i=0;i<N;i++){hist[i].push(pi[i]);}var npi=new Array(N).fill(0);for(var i=0;i<N;i++){for(var j=0;j<N;j++){npi[i]+=alpha*M[i][j]*pi[j];}npi[i]+=(1-alpha)*v[i];}pi=npi;}
var colors=['#3b82f6','#f59e0b','#10b981','#9ca3af','#a78bfa'];
var traces=[];for(var i=0;i<N;i++){traces.push({x:xs,y:hist[i],mode:'lines',name:labels[i],line:{color:colors[i],width:2}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'power iteration step',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'PageRank score',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-pagerank-en',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Personalised PageRank.</strong> Change the teleport vector v from uniform to a distribution biased toward a particular set of "seed" pages, and the stationary distribution becomes biased the same way — measuring importance <em>relative to those seeds</em>. This single tweak underlies recommendation systems, fraud detection, and node-similarity in modern knowledge graphs (Pinterest's Pixie, Twitter/X's Who-To-Follow, many GNN baselines).</div>

<h2 class="lesson-title">10. AI Application 3: Random Walks for Graph Embedding</h2>

<div class="calc-highlight"><strong>DeepWalk (Perozzi et al. 2014), node2vec (Grover & Leskovec 2016).</strong> The bridge from Markov chains to modern representation learning. Take any graph. Run random walks on it. Treat each walk as a "sentence" of node IDs. Feed the sentences to Word2vec. Out comes a vector for each node — a <em>node embedding</em> — that captures graph structure with no hand-engineered features.</div>

<p class="l-text">The pipeline is staggeringly simple:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Build the Markov chain</div><div class="step-detail">States = nodes of the graph. Transition probabilities = uniform over neighbours (DeepWalk) or biased toward in-/out-neighbourhood structure (node2vec uses parameters p and q to interpolate between BFS-like and DFS-like walks).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Sample walks</div><div class="step-detail">From every node, simulate many random walks of fixed length (say 80 steps each, 10 walks per node). Each walk is a sequence of node IDs — a "sentence" with the nodes as "words."</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Apply Word2vec</div><div class="step-detail">Treat the walks as a text corpus. Train a skip-gram model: each node's embedding is learned by predicting which other nodes appear within a window around it in the walks. The Word2vec objective does the rest.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Use the embeddings</div><div class="step-detail">Downstream tasks (node classification, link prediction, community detection) become standard ML on a Euclidean vector. Nodes that frequently co-occur in random walks end up close in embedding space.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l1-walk-en" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a single random walk of 100 steps on a 1-D cycle of 12 nodes (states 0..11, neighbours wrap around). At each step the walker chooses left or right with probability 0.5. The y-axis traces the visited state versus step. Notice the diffusive square-root behaviour: even after 100 steps, the walker has not strayed too far from its average drift. This is the same kind of process that DeepWalk samples on a real graph; only the connectivity is more interesting.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=12;var T=100;var state=6;var xs=[0],ys=[state];
for(var t=1;t<=T;t++){if(Math.random()<0.5){state=(state-1+N)%N;}else{state=(state+1)%N;}xs.push(t);ys.push(state);}
var d1={x:xs,y:ys,mode:'lines+markers',name:'random walk',line:{color:'#3b82f6',width:1.6},marker:{size:4,color:'#fbbf24'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'step',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'node id (cycle of 12)',gridcolor:'rgba(255,255,255,0.07)',dtick:1,range:[-0.5,11.5]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-walk-en',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Modern relevance.</strong> Random-walk embeddings preceded Graph Neural Networks but were not replaced by them. They still hold their own on many benchmarks because the random-walk distribution itself encodes meaningful structural information. Many production GNNs use random-walk features as input; many graph-LLM hybrids use random-walk sampling to feed neighbourhoods into a Transformer context window.</div>

<h2 class="lesson-title">11. The Limitations of First-Order Markov Chains</h2>

<div class="calc-highlight"><strong>The same property that makes Markov chains tractable is exactly what makes them weak.</strong> Memorylessness gives us a single matrix; it also throws away every signal beyond the most recent state. Real sequences — natural language, music, DNA, dialogue, code — have structure that stretches across hundreds or thousands of tokens. First-order chains cannot represent any of it.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Long-range dependencies</div><div class="card-body">"The book that the woman who lived in the house with the red door wrote ___." A Markov chain on words has no way to know we are waiting for a verb. Transformers solved this with attention over the full context.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical structure</div><div class="card-body">Code has nested scopes, language has parse trees, music has phrasing. Flat Markov chains see only a sliding window and miss the hierarchy entirely.</div></div>
<div class="calc-card"><div class="card-title">Hidden state</div><div class="card-body">Many real processes are Markov in a hidden state we cannot observe directly — only its noisy emissions. Hidden Markov Models (next lesson) recover the chain by jointly modelling state and observation.</div></div>
<div class="calc-card"><div class="card-title">Continuous outputs</div><div class="card-body">Markov chains in their pure form are discrete-state. Most modern generative models work in continuous spaces — but they are still often Markov: a diffusion model is literally a continuous-state Markov chain on noise levels.</div></div>
</div>

<p class="l-text"><strong>How the field moved on.</strong> Higher-order Markov chains (trigrams, etc.) are equivalent to first-order chains on a richer state space — buying memory at the cost of state-space blow-up. Hidden Markov Models (L2) keep the chain hidden and observe noisy emissions. MCMC methods (L3) <em>use</em> Markov chains as a tool to sample from arbitrary distributions. Bayesian inference and variational methods (L4, L5) build on the same probabilistic foundations. Diffusion models are a continuous-time Markov chain we run backwards. Transformers replace the Markov assumption entirely with full attention. Every one of these is best understood by first owning the simple object we have built today.</p>

<h2 class="lesson-title">12. Classical Exercises</h2>
<p class="l-text"><em>Hand-worked exercises with step-by-step solutions will be added in the next content pass. For now, the visualizations above and the derivations within sections serve as your working examples — pause at each formula and verify the algebra on paper.</em></p>
<div class="calc-highlight"><strong>How to study this lesson</strong><br>1. Read each section, redo the derivations on paper.<br>2. Pause at each formula and confirm the algebra.<br>3. For visualizations, sketch them by hand first, then check against the plot.<br>4. Solve any worked example yourself before reading the solution.</div>

<p class="l-text"><strong>What to play with:</strong> change one entry of <em>P</em> (say make Sunny → Sunny equal to 0.95) and watch the stationary distribution shift toward all-Sunny. Increase <em>N</em> in part 4 to 100 000 and the empirical fractions should match π to three decimals. Replace the Turkish corpus with English text from a book; with 1000+ words the bigram output becomes startlingly readable for short stretches. Try fitting a trigram (condition on the previous two words) and notice how locally coherent the output becomes — and how exponentially the count tables grow.</p>

<h2 class="lesson-title">13. Summary &amp; What You Can Now Do</h2>

<p class="l-text">In one lesson we have built the entire foundation that the rest of the track will reuse. Here is the model on one page:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Markov property</div><div class="card-body">The future depends on the past only through the present. P(X_{n+1} = j | history) = P(X_{n+1} = j | X_n).</div><div class="card-formula">memoryless</div></div>
<div class="calc-card"><div class="card-title">Transition matrix</div><div class="card-body">Row-stochastic matrix P with P[i,j] = P(X_{n+1} = j | X_n = i). Encodes the entire one-step dynamics.</div><div class="card-formula">P · 1 = 1</div></div>
<div class="calc-card"><div class="card-title">Multi-step</div><div class="card-body">k-step transition probabilities are entries of P^k. Chapman–Kolmogorov in matrix form.</div><div class="card-formula">P^k_{ij}</div></div>
<div class="calc-card"><div class="card-title">Distribution evolution</div><div class="card-body">A probability row vector π_n evolves by π_{n+1} = π_n · P. After n steps: π_n = π_0 · P^n.</div><div class="card-formula">π_n = π_0 P^n</div></div>
<div class="calc-card"><div class="card-title">Stationary distribution</div><div class="card-body">π = πP, a left eigenvector of P with eigenvalue 1. Unique and globally attracting for ergodic chains.</div><div class="card-formula">π = π P</div></div>
<div class="calc-card"><div class="card-title">Classification</div><div class="card-body">Recurrent / transient, periodic / aperiodic, irreducible / reducible. Ergodic = the friendly case.</div><div class="card-formula">ergodic = ✓✓✓</div></div>
<div class="calc-card"><div class="card-title">n-grams</div><div class="card-body">Bigram language models are first-order Markov chains on words; trigrams are second-order; etc. Counting estimates the matrix.</div><div class="card-formula">P(w_n | w_{n-1})</div></div>
<div class="calc-card"><div class="card-title">PageRank</div><div class="card-body">Stationary distribution of a random-surfer Markov chain on the web graph with teleport. π = αMπ + (1-α)v.</div><div class="card-formula">π = αMπ + (1-α)v</div></div>
</div>

<div class="l-warn"><strong>Coming next (Lesson 2):</strong> the <strong>Hidden Markov Model</strong>. We will let the chain run in a hidden state we cannot see — only its noisy emissions. The result is one of the most successful models in the history of signal processing (speech recognition, bioinformatics, finance) and a natural stepping stone to the variational / latent-variable models that dominate modern generative AI.</p>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li>
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li>
<li><a href="/tutorials/matematik/97" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Bayes Teoremi</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L97)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Beklenen Değer</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L101)</span></li>
</ul>
</div>
<p class="l-text"><strong>"Markov" kelimesini bu yıl içinde en az üç kez duydun.</strong> Bir kere NLP dersinde, biri n-gram dil modellerinden bahsederken. Bir kere bir pekiştirmeli öğrenme tutorial'ında, "Markov karar süreçleri" geçerken. Bir kere de bir PageRank açıklamasında, "kararlı dağılım" terimi sanki herkes biliyormuşçasına süzülürken. Her seferinde kelime işe yarar bir şeye iliştirilmiş halde geldi, ve her seferinde kimse durup "bu aslında <em>nedir</em>?" diye sormadı.</p>

<p class="l-text">Bu ders o akışı durduruyor. Markov zincirini sıfırdan inşa edeceğiz — durumlar, geçişler, matrisler, denge — ve makineyi elimize aldığımız anda onu Markov'un adını her modern müfredata yazdıran üç AI uygulamasına çevireceğiz: <strong>n-gram dil modelleri</strong>, <strong>PageRank</strong>, ve <strong>rastgele yürüyüş tabanlı graf gömülmeleri</strong>. Dersin sonunda 19. yüzyıl bir Rus matematikçisinin saf-olasılık icadının nasıl olup da internetin yarısını sessizce çalıştırdığını anlamış olacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Markov (belleksizlik) özelliğini sade bir cümleyle ve tek bir koşullu olasılık denklemiyle ifade etmeyi</li>
<li>Bir problem tanımından geçiş matrisi <em>P</em>'yi kurup satır-stokastik olduğunu doğrulamayı</li>
<li>Çok adımlı geçiş olasılıklarını <em>P<sup>k</sup></em> matris üsleriyle hesaplayıp bir dağılımı zamanda ileri taşımayı</li>
<li>Kararlı dağılım <em>π</em>'yi sol özvektör olarak çözmeyi ve aynı sonucu güç iterasyonuyla yeniden üretmeyi</li>
<li>Durumları yinelenen/geçici, periyodik/aperiyodik olarak sınıflandırmayı ve bir zincirin ergodik olduğunu tanımayı</li>
<li>Aynı matris makinesini üç gerçek AI sistemine bağlamayı: bigram metin üretimi, PageRank, DeepWalk tarzı düğüm gömülmeleri</li>
</ul>
</div>

<h2 class="lesson-title">1. Belleksizlik Özelliği</h2>

<div class="calc-highlight"><strong>Günlük resim:</strong> yarının havası büyük ölçüde bugünkünden bellidir. Geçen Salı'nın güneşli mi fırtınalı mı olduğu, bugünkü havayı bildiğin sürece pek bir şey ifade etmez. Bir gölet üzerindeki kurbağa hangi nilüfere atlayacağına yalnızca üzerinde oturduğu yaprağa bakarak karar verir, oraya hangi rotayla geldiği değil. Yılan ve Merdiven oyunundaki bir taş zarın sonucuna ve şu anki karesine göre hareket eder — beş tur önce bulunduğu kareler artık önemsizdir. Bu örneklerin her biri kılık değiştirmiş bir Markov zinciridir.</div>

<p class="l-text">Bir <strong>stokastik süreç</strong>, zamanla indekslenmiş bir rastgele değişken dizisidir: <em>X<sub>0</sub>, X<sub>1</sub>, X<sub>2</sub>, …</em>. Her <em>X<sub>n</sub></em> bir <em>durum</em> kümesindeki bir değeri alır. Süreç, geleceği tamamen şimdiki durumu tarafından özetleniyorsa <strong>Markov zinciri</strong> olarak adlandırılır:</p>

<div class="calc-formula"><div class="formula-label">TANIM: MARKOV ÖZELLİĞİ</div><div class="formula-main">$$P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i,\\; X_{n-1} = i_{n-1},\\; \\ldots,\\; X_0 = i_0 \\right) \\;=\\; P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i \\right)$$</div><div class="formula-sub">Tüm geçmiş üzerinde koşullamak yalnızca şimdiki üzerinde koşullamaya çöker. Zincirin şimdiki durumunun ötesinde belleği yoktur.</div></div>

<p class="l-text">Denklemi yavaş oku. Sol taraf "nereye gittiğimin <em>tüm</em> geçmişi verildiğinde, bir sonraki adımımın <em>j</em> durumuna inme olasılığı nedir?" diyor. Sağ taraf, şimdiki durum dışında her geçmişi atıp aynı cevabı veriyor. Geçmiş yalnızca şimdiyi ürettiği ölçüde önemlidir. Şimdiki bilindiğinde, geçmiş istatistiksel olarak önemsizdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bu NE DEĞİL</div><div class="card-body">Markov, "geçmişten bağımsız" demek değildir. "<em>Şimdiki verildiğinde</em> geçmişten bağımsız" demektir. Dünkü havayı bilmek bugünkü hakkında hâlâ bilgi verir — ama yalnızca bugünkü hakkında bilgi verdiği için, ki biz zaten ona koşulluyoruz.</div></div>
<div class="calc-card"><div class="card-title">Birinci-mertebe varsayım</div><div class="card-body">Bu <em>birinci-mertebeden</em> bir Markov zinciridir. Sonraki durum yalnızca en son olana bağlıdır. Daha sonra <em>k</em>-inci mertebe zincirleri göreceğiz (trigram modelleri son iki kelimeye bakar vb.), bunlar daha büyük bir durum uzayında birinci-mertebe zincirlere eşdeğerdir.</div></div>
<div class="calc-card"><div class="card-title">Ayrık zaman ve durum</div><div class="card-body">Zaman adımlarının tamsayı ve durum uzayının sonlu olduğu zincirlere odaklanıyoruz. Sürekli-zaman zincirleri ve sürekli-durum Markov süreçleri (Brown hareketi, Itô difüzyonları) vardır ama bunlar L4/L5 konusu.</div></div>
</div>

<div class="l-note"><strong>"Belleksizlik" neden hata değil, özellik?</strong> Markov özelliği bir stokastik süreç üzerindeki en güçlü <em>kullanışlı</em> basitleştirmedir. Bırak, sonsuz tane geçmişi takip etmek zorunda kalırsın. Tut, her şeyi tek bir matrisle tanımlayabilirsin. AI'daki çözülebilir hemen her stokastik model ya Markov'dur ya da durum genişletilince Markov'a dönüşür.</div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir hisse senedi fiyatı, durum sadece "bugünkü fiyat" ise Markov sürecidir denebilir mi? Muhtemelen hayır — momentum, son volatilite, haber döngüleri hepsi önemli. Ama durumu birkaç gecikmeli fiyat ve bir volatilite tahminiyle genişletirsen, Markov'a çok daha yakın bir şey elde edersin. "Durumu büyüterek bir süreci Markov yapma" hilesi her yerde tekrar eder — Transformer'lar dahil, attention penceresi tam olarak böyle bir genişletmedir.</div></div>

<h2 class="lesson-title">2. Durumlar, Geçişler ve Geçiş Matrisi</h2>

<div class="calc-highlight"><strong>Somut örnek: üç-durumlu hava zinciri.</strong> Oyuncak şehrimizde her gün ya Güneşli (G), Yağmurlu (Y) ya da Bulutlu (B). Uzun gözlemler veriyor: güneşli bir günün ardından %70 olasılıkla güneşli, %10 yağmurlu, %20 bulutlu gelir. Yağmurlu bir günün ardından %30 güneşli, %40 yağmurlu, %30 bulutlu. Bulutlu bir günün ardından %40 güneşli, %20 yağmurlu, %40 bulutlu. Üç durum, dokuz geçiş olasılığı — ve elinde zaten tam bir Markov zinciri var.</div>

<p class="l-text">Resmi olarak sonlu bir durum uzayı ile çalışıyoruz: <em>S = {s<sub>1</sub>, s<sub>2</sub>, …, s<sub>n</sub>}</em>. <em>i</em> durumundan <em>j</em> durumuna geçiş olasılığı:</p>

<div class="calc-formula"><div class="formula-label">GEÇİŞ OLASILIĞI</div><div class="formula-main">$$p_{ij} \\;=\\; P\\!\\left( X_{n+1} = j \\;\\big|\\; X_n = i \\right)$$</div><div class="formula-sub">Bir adımda i durumundan j durumuna atlama olasılığı. Zincirin zaman-homojen olduğunu varsayıyoruz: p_{ij}, n'ye bağlı değil.</div></div>

<p class="l-text">Tüm bu sayıları <em>n × n</em> bir matris <strong>P</strong>'ye topla, <em>P<sub>ij</sub> = p<sub>ij</sub></em>. Olasılık kuralları iki yapısal kuralı zorunlu kılar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Negatif olmama</div><div class="card-body">Her giriş p_{ij} ≥ 0 koşulunu sağlar. Herhangi bir yere gitmenin negatif olasılığı olamaz.</div><div class="card-formula">p_{ij} ≥ 0</div></div>
<div class="calc-card"><div class="card-title">Satırlar 1'e toplanır</div><div class="card-body">Herhangi bir i durumundan zincir bir sonraki adımda <em>bir yere</em> gitmek zorundadır. Olası tüm varış noktalarının olasılıkları 1'e toplanır.</div><div class="card-formula">Σ_j p_{ij} = 1</div></div>
<div class="calc-card"><div class="card-title">Stokastik matris</div><div class="card-body">İki kuralı da sağlayan matrise <em>satır-stokastik</em> denir. Her Markov zincirinin böyle bir matrisi vardır; her satır-stokastik matris böyle bir zinciri tanımlar.</div><div class="card-formula">P · 1 = 1</div></div>
</div>

<div class="calc-formula"><div class="formula-label">HAVA ZİNCİRİ GEÇİŞ MATRİSİ</div><div class="formula-main">$$P \\;=\\; \\begin{pmatrix} 0.70 & 0.10 & 0.20 \\\\ 0.30 & 0.40 & 0.30 \\\\ 0.40 & 0.20 & 0.40 \\end{pmatrix}$$</div><div class="formula-sub">Satırlar G, Y, B sırasında; sütunlar aynı sırada. Satır 1 (Güneşli) toplamı 0.70 + 0.10 + 0.20 = 1.00. Diğer ikisini de kontrol et.</div></div>

<div class="calc-graph"><div id="plot-l1-weather-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç-durumlu hava zinciri yönlü graf olarak. Üç düğüm (Güneşli, Yağmurlu, Bulutlu) bir üçgenin köşelerinde duruyor. Oklar her düğümü her diğerine — ve kendine — bağlar; etiketler ilgili geçiş olasılığı. Her okun kalınlığı olasılıkla orantılı. Öz-döngüler (güneşli → güneşli, vb.) havanın günden güne ısrarlı eğilimini yakalar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var nodes=[{name:'Güneşli',x:0,y:1.2,color:'#f59e0b'},{name:'Yağmurlu',x:-1.05,y:-0.55,color:'#3b82f6'},{name:'Bulutlu',x:1.05,y:-0.55,color:'#9ca3af'}];
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
var traces=[];
for(var i=0;i<3;i++){for(var j=0;j<3;j++){if(i===j)continue;var x0=nodes[i].x,y0=nodes[i].y,x1=nodes[j].x,y1=nodes[j].y;var dx=x1-x0,dy=y1-y0,L=Math.sqrt(dx*dx+dy*dy);var ux=dx/L,uy=dy/L;var nx=-uy*0.07,ny=ux*0.07;var sx=x0+ux*0.18+nx,sy=y0+uy*0.18+ny;var ex=x1-ux*0.18+nx,ey=y1-uy*0.18+ny;var mx=(sx+ex)/2,my=(sy+ey)/2;traces.push({x:[sx,ex],y:[sy,ey],mode:'lines',line:{color:'rgba(232,232,232,0.45)',width:1+P[i][j]*5},hoverinfo:'skip',showlegend:false});traces.push({x:[mx],y:[my],mode:'text',text:[P[i][j].toFixed(2)],textfont:{size:12,color:'#fbbf24'},showlegend:false,hoverinfo:'skip'});}}
for(var i=0;i<3;i++){var cx=nodes[i].x*1.32,cy=nodes[i].y*1.32;traces.push({x:[cx],y:[cy],mode:'text',text:['öz: '+P[i][i].toFixed(2)],textfont:{size:11,color:'#10b981'},showlegend:false,hoverinfo:'skip'});}
var nx=[],ny=[],nt=[],nc=[];for(var i=0;i<3;i++){nx.push(nodes[i].x);ny.push(nodes[i].y);nt.push(nodes[i].name);nc.push(nodes[i].color);}
traces.push({x:nx,y:ny,mode:'markers+text',text:nt,textposition:'middle center',textfont:{size:13,color:'#0a0a0a',family:'Geist'},marker:{size:64,color:nc,line:{color:'#e8e8e8',width:2}},hoverinfo:'skip',showlegend:false});
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{visible:false,range:[-2.1,2.1]},yaxis:{visible:false,range:[-1.5,2.0],scaleanchor:'x'},margin:{t:20,r:20,b:20,l:20},showlegend:false};
Plotly.newPlot('plot-l1-weather-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">Bugün <strong>Güneşli</strong> ise yarının <strong>Yağmurlu</strong> olma olasılığı nedir?<br><br>Doğrudan giriş P[G, Y] = <strong>0.10</strong>. Tek adım, tek bakış. Matris tüm modeldir.</div></div>

<div class="l-note"><strong>Geri dönecek kelime dağarcığı:</strong> zincir üzerinde bir <em>yürüyüş</em>, ziyaret edebileceği herhangi bir durum dizisidir: <em>i<sub>0</sub>, i<sub>1</sub>, …, i<sub>k</sub></em>. <em>i<sub>0</sub></em>'dan başlayan belirli bir yürüyüşün olasılığı çarpımdır: P[i<sub>0</sub>, i<sub>1</sub>] · P[i<sub>1</sub>, i<sub>2</sub>] · … · P[i<sub>k-1</sub>, i<sub>k</sub>] — adım adım koşullamanın doğrudan sonucu.</div>

<h2 class="lesson-title">3. Çok Adımlı Geçişler: P'nin Üsleri</h2>

<div class="calc-highlight"><strong>Temel Markov teorisindeki tek en güzel özdeşlik.</strong> <em>P</em> tek-adımlı geçiş olasılıklarını veriyorsa, <em>P<sup>2</sup></em> iki-adımlı geçiş olasılıklarını, <em>P<sup>k</sup></em> <em>k</em>-adımlı geçiş olasılıklarını verir ve matris çarpımından daha karmaşık hiçbir şey yapmanıza gerek kalmaz.</div>

<p class="l-text">Bu neden işliyor? <em>i</em>'den <em>j</em>'ye iki adımda gitmek için zincir bir ara <em>m</em> durumundan geçmek zorundadır. Markov özelliği gereği, yolculuğun iki yarısı <em>m</em> verildiğinde koşullu olarak bağımsızdır:</p>

<div class="calc-formula"><div class="formula-label">TOPLAM OLASILIKLA İKİ-ADIMLI GEÇİŞ</div><div class="formula-main">$$P\\!\\left( X_{n+2} = j \\,\\big|\\, X_n = i \\right) \\;=\\; \\sum_m p_{im} \\, p_{mj} \\;=\\; (P^2)_{ij}$$</div><div class="formula-sub">Tüm olası ara durumlar m üzerinden toplam, tam olarak P·P matris çarpımının (i, j) girişidir.</div></div>

<p class="l-text">Yineleme genel sonucu verir. İspat tek satırlık bir tümevarımdır:</p>

<div class="calc-formula"><div class="formula-label">CHAPMAN–KOLMOGOROV (AYRIK FORM)</div><div class="formula-main">$$P\\!\\left( X_{n+k} = j \\,\\big|\\, X_n = i \\right) \\;=\\; (P^k)_{ij}$$</div><div class="formula-sub">k-adımlı olasılıklar basitçe k'inci matris üssüdür. Zaman bir üs haline gelir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">Hava zinciri için <em>P<sup>2</sup></em>'yi hesapla.<br><br>$$P^2 \\;=\\; \\begin{pmatrix} 0.60 & 0.15 & 0.25 \\\\ 0.45 & 0.25 & 0.30 \\\\ 0.50 & 0.20 & 0.30 \\end{pmatrix}$$<br>Giriş P²[G, G] = 0.7·0.7 + 0.1·0.3 + 0.2·0.4 = 0.49 + 0.03 + 0.08 = <strong>0.60</strong>. Oku: bugün Güneşli ile başlayınca, öbür günün de Güneşli olma olasılığı 0.60 (0.70'ten düşük, çünkü arada başka hava akıp gidebilir).</div></div>

<p class="l-text"><em>P</em>'yi daha yüksek üslere yükselttikçe çarpıcı bir şey olur — satırlar birbirinin aynısı görünmeye başlar:</p>

<div class="calc-formula"><div class="formula-label">HAVA ZİNCİRİNİN ONUNCU ÜSSÜ</div><div class="formula-main">$$P^{10} \\;\\approx\\; \\begin{pmatrix} 0.518 & 0.184 & 0.298 \\\\ 0.518 & 0.184 & 0.298 \\\\ 0.518 & 0.184 & 0.298 \\end{pmatrix}$$</div><div class="formula-sub">Üç satır da aynı vektöre yakınsadı. Hangi hava ile başlarsan başla, on gün sonra bugünkü havanın dağılımı başlangıçtan bağımsızdır.</div></div>

<p class="l-text">Bu tesadüf değil. 5. bölümde tanışacağımız <em>kararlı dağılımın</em> parmak izi. Ondan önce bir parça daha makine.</p>

<h2 class="lesson-title">4. Başlangıç Dağılımı ve Marjinal Evrim</h2>

<div class="calc-highlight"><strong>Şu ana dek "şimdi i durumunda iken, k adım sonra ne?" diye sorduk.</strong> Ama çoğu problemde şimdiki durumdan da emin değiliz. Tam tanım o halde durumlar üzerinde bir <em>olasılık vektörüdür</em> — ve tek bir matris çarpımı onu bir adım ileri taşır.</div>

<p class="l-text">Bir <strong>başlangıç dağılımı</strong> <em>π<sub>0</sub></em>, her duruma bir giriş düşen bir satır vektörüdür:</p>

<div class="calc-formula"><div class="formula-label">BAŞLANGIÇ DAĞILIMI</div><div class="formula-main">$$\\pi_0 \\;=\\; \\bigl(\\pi_0[1],\\; \\pi_0[2],\\; \\ldots,\\; \\pi_0[n]\\bigr), \\qquad \\pi_0[i] \\geq 0, \\qquad \\sum_i \\pi_0[i] = 1$$</div><div class="formula-sub">π_0[i], zincirin i durumunda başlama olasılığıdır. P'nin bir satırı ile neredeyse aynı nesnedir.</div></div>

<p class="l-text">Bir adım sonra dağılım <em>π<sub>1</sub></em> olur. <em>j</em> bileşeni, zincirin zaman 1'de <em>j</em> durumunda olma olasılığıdır:</p>

<div class="calc-formula"><div class="formula-label">TEK-ADIM EVRİMİ</div><div class="formula-main">$$\\pi_1[j] \\;=\\; \\sum_i \\pi_0[i] \\, p_{ij} \\;=\\; (\\pi_0 \\, P)[j]$$</div><div class="formula-sub">Satır vektörü çarpı geçiş matrisi. j'ye inme toplam olasılığı, olası her başlangıç durumu i üzerinden (i'den başlama olasılığı) çarpı (i'den j'ye gitme olasılığı) toplamıdır.</div></div>

<p class="l-text">Aynı formülü <em>n</em> adım için yinele:</p>

<div class="calc-formula"><div class="formula-label">n-ADIMLI EVRİM</div><div class="formula-main">$$\\pi_n \\;=\\; \\pi_0 \\, P^n$$</div><div class="formula-sub">Matris çarpımıyla evrim. Saf olasılığa hizmet eden saf lineer cebir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">Bugün kesin Güneşli ile başla: <em>π<sub>0</sub> = (1, 0, 0)</em>. O halde π<sub>1</sub> = π<sub>0</sub>·P = (0.70, 0.10, 0.20) — tam olarak P'nin ilk satırı. İki adım sonra: π<sub>2</sub> = π<sub>0</sub>·P² = (0.60, 0.15, 0.25). Beş adım sonra belirsizlik yayılmıştır: π<sub>5</sub> ≈ (0.522, 0.183, 0.295). Yirmi adım sonra: π<sub>20</sub> ≈ (0.5179, 0.1843, 0.2978) — ve kararlı dağılımın üç ondalık hassasiyeti içindeyiz.</div></div>

<div class="calc-graph"><div id="plot-l1-evolve-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç hava durumu üzerinde n = 0, 1, 2, 5, 20 günlerdeki π_n dağılımı, "bugün kesin Güneşli" ile başlanarak. İlk çubuk grubu Güneşli üzerinde bir delta. Sonraki her grup olasılık kütlesini Yağmurlu ve Bulutlu'ya yayar. n = 20'ye gelindiğinde üç grup kararlı dağılıma oturmuştur — en sağdaki çubuk seti daha ileri gitsen değişmez.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
function step(v){var r=[0,0,0];for(var j=0;j<3;j++){for(var i=0;i<3;i++){r[j]+=v[i]*P[i][j];}}return r;}
var pis={};var v=[1,0,0];pis[0]=v.slice();for(var k=1;k<=20;k++){v=step(v);pis[k]=v.slice();}
var ks=[0,1,2,5,20];var labels=['Güneşli','Yağmurlu','Bulutlu'];var colors=['#f59e0b','#3b82f6','#9ca3af'];
var traces=[];for(var s=0;s<3;s++){var ys=[];for(var i=0;i<ks.length;i++){ys.push(pis[ks[i]][s]);}traces.push({x:ks.map(function(k){return 'n='+k;}),y:ys,type:'bar',name:labels[s],marker:{color:colors[s]}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},barmode:'group',xaxis:{gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'olasılık',gridcolor:'rgba(255,255,255,0.07)',range:[0,1.05]},margin:{t:30,r:30,b:50,l:55},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-evolve-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Satır mı sütun mu yazım uyarısı.</strong> Biz solda <em>satır vektörleri</em> kullanıyoruz: π<sub>n+1</sub> = π<sub>n</sub>·P. Pek çok ders kitabı (ve çoğu fizik ve PageRank makalesi) sağda sütun vektörleri kullanır, <em>sütun-stokastik</em> matris M ile: π<sub>n+1</sub> = M·π<sub>n</sub>. Aynı nesnelerdir — M = P<sup>T</sup>. Bir yazarın formüllerini kopyalamadan önce hangi yazımı kullandığına dikkat et.</div>

<h2 class="lesson-title">5. Kararlı Dağılım</h2>

<div class="calc-highlight"><strong>Sabit nokta.</strong> Zincirin bir adımı uygulandığında değişmeyen bir <em>π</em> dağılımına <strong>kararlı dağılım</strong> denir. Zincir böyle bir dağılıma vardıktan sonra orada sonsuza kadar kalır — dağılım olarak, yol olarak değil. Zincir hâlâ durumdan duruma sıçramaya devam eder ama her durumda olma <em>olasılıkları</em> evrimleşmeyi bırakır.</div>

<div class="calc-formula"><div class="formula-label">KARARLI DAĞILIM: TANIM</div><div class="formula-main">$$\\pi \\;=\\; \\pi \\, P, \\qquad \\sum_i \\pi[i] = 1, \\qquad \\pi[i] \\geq 0$$</div><div class="formula-sub">π, özdeğeri 1 olan P'nin sol özvektörüdür, olasılık vektörü olacak şekilde normalize edilmiştir.</div></div>

<p class="l-text">"Özdeğeri 1 olan sol özvektör" bakışı en temiz olanıdır. Her satır-stokastik matrisin tam olarak 1'e eşit bir özdeğeri vardır — ispat: <em>P · 1 = 1</em> (tümü-bir sütun vektörü bir sağ özvektördür), ve bir kare matris transpozuyla aynı özdeğerlere sahiptir, dolayısıyla 1 aynı zamanda <em>sol</em> özdeğerdir. Perron–Frobenius teoremi o özdeğerde negatif olmayan bir sol özvektörün varlığını garantiler ve normalize ettikten sonra bu tam olarak <em>π</em>'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Varlık</div><div class="card-body">Her sonlu Markov zincirinin <em>en az bir</em> kararlı dağılımı vardır. (Sonsuz-durumlu zincirlerde olmayabilir.)</div></div>
<div class="calc-card"><div class="card-title">Teklik</div><div class="card-body">Zincir <em>indirgenemez</em> ise (tüm durumlar birbirine iletişim kuruyor) kararlı dağılım tektir.</div></div>
<div class="calc-card"><div class="card-title">Yakınsama</div><div class="card-body">Zincir aynı zamanda <em>aperiyodik</em> ise <em>her</em> başlangıç dağılımı için π_n → π. (3. bölümdeki "P^k'nin satırları aynı görünüyor" olgusu tam budur.)</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK — HAVA ZİNCİRİNDE π'Yİ ÇÖZ</div><div class="example-body">π = πP istiyoruz, π = (a, b, c) ve a + b + c = 1 ile. Üç denklemi açınca:<br><br>0.70a + 0.30b + 0.40c = a<br>0.10a + 0.40b + 0.20c = b<br>0.20a + 0.30b + 0.40c = c<br><br>İlkini düzenle: −0.30a + 0.30b + 0.40c = 0. Bunu a + b + c = 1 ve bir denklem daha ile birleştirip (elle ya da numpy.linalg.solve ile) çözünce<br><br>π ≈ <strong>(0.5179, 0.1842, 0.2979)</strong><br><br>Uzun vadede oyuncak şehrimiz günlerin %51.8'inde güneşli, %18.4'ünde yağmurlu, %29.8'inde bulutludur — bugünkü hava ne olursa olsun.</div></div>

<div class="calc-graph"><div id="plot-l1-converge-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> üç farklı başlangıç dağılımı için (kesin Güneşli, kesin Yağmurlu, kesin Bulutlu) şu anki dağılım ile kararlı dağılım arasındaki L1 uzaklığı ||π_n − π||_1, log ekseninde. Üç eğri de log ekseninde düz bir çizgide düşer — P'nin ikinci-en-büyük özdeğeri tarafından belirlenen oranda geometrik yakınsama. Başlangıç noktası neredeyse hiç önemli değil; asimptotik eğim aynı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P=[[0.70,0.10,0.20],[0.30,0.40,0.30],[0.40,0.20,0.40]];
var pi=[0.5179,0.1842,0.2979];
function step(v){var r=[0,0,0];for(var j=0;j<3;j++){for(var i=0;i<3;i++){r[j]+=v[i]*P[i][j];}}return r;}
function l1(v){var s=0;for(var i=0;i<3;i++){s+=Math.abs(v[i]-pi[i]);}return s;}
var starts=[[1,0,0],[0,1,0],[0,0,1]];var names=['başlangıç: Güneşli','başlangıç: Yağmurlu','başlangıç: Bulutlu'];var colors=['#f59e0b','#3b82f6','#9ca3af'];
var traces=[];
for(var s=0;s<3;s++){var v=starts[s].slice();var xs=[],ys=[];for(var k=0;k<=20;k++){var d=l1(v);if(d>1e-10){xs.push(k);ys.push(d);}v=step(v);}traces.push({x:xs,y:ys,mode:'lines+markers',name:names[s],line:{color:colors[s],width:2.2},marker:{size:5}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'adım n',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'|| π_n − π ||_1',type:'log',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-converge-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Ayrıntılı denge (MCMC için ön gösterim, L3):</strong> bir π dağılımı, tüm i, j için π[i]·p<sub>ij</sub> = π[j]·p<sub>ji</sub> sağlıyorsa <em>ayrıntılı dengeyi</em> sağlar. Ayrıntılı denge ⇒ kararlı, ama tersi geçerli değil. Örnekleme için tasarlanan zincirler (Metropolis–Hastings, Gibbs) genellikle ayrıntılı dengeyi sağlayacak şekilde kurulur — küresel denge denklemi π = πP'yi tasarlamaktan çok daha kolaydır.</div>

<h2 class="lesson-title">6. Durumların Sınıflandırılması</h2>

<div class="calc-highlight"><strong>Her zincir tek bir dengeye varmaz.</strong> Bazılarında erişilemeyen köşeler vardır. Bazıları sonsuza kadar alt-kümeler arasında salınır ve hiç oturmaz. Bazılarının zincirin içine düşüp bir daha çıkmadığı yutucu durumları vardır. Yinelenme, periyodiklik ve indirgenmezlik kelime dağarcığı bu durumları birbirinden ayırmamızı sağlar.</div>

<p class="l-text">İki <em>i</em> ve <em>j</em> durumu <strong>iletişim kurar</strong> (<em>i ↔ j</em> diye yazılır), eğer <em>i</em>'den <em>j</em>'ye bir sayıda adımda gitme pozitif olasılığı varsa <em>ve</em> <em>j</em>'den <em>i</em>'ye geri dönme pozitif olasılığı varsa. İletişim, durum uzayını <strong>iletişim sınıflarına</strong> böler. Bir zincir <strong>indirgenemez</strong>dir eğer tüm durum uzayı tek bir iletişim sınıfıysa — eşdeğer olarak, yeterli adım verildiğinde herhangi bir durumdan herhangi bir diğerine gidebilirsin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yinelenen durum</div><div class="card-body">i'den başlayarak zincir i'ye olasılık 1 ile döner. (Uzun vadede sonsuz sık ziyaret edilir.)</div></div>
<div class="calc-card"><div class="card-title">Geçici durum</div><div class="card-body">i'den başlayarak zincirin i'ye <em>hiç</em> dönmeme pozitif olasılığı vardır. Yalnızca sonlu kere ziyaret edilir.</div></div>
<div class="calc-card"><div class="card-title">Yutucu durum</div><div class="card-body">p_{ii} = 1 olan bir durum: bir kez girilince çıkılmaz. Yinelenenin trivial uç hâli.</div></div>
<div class="calc-card"><div class="card-title">i durumunun periyodu</div><div class="card-body">(P^n)_{ii} > 0 olan tüm n ≥ 1'in OBEB'i. Periyot 1 ise durum <em>aperiyodiktir</em>.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">ERGODİK ZİNCİR</div><div class="formula-main">$$\\text{ergodik} \\;\\;\\equiv\\;\\; \\text{indirgenemez} \\;\\wedge\\; \\text{aperiyodik} \\;\\wedge\\; \\text{pozitif yinelenen}$$</div><div class="formula-sub">Ergodik zincirlerin tek bir kararlı dağılımı VARDIR VE her başlangıç dağılımından ona yakınsar. Bu, örnekleme, öğrenme ve tahmin için istediğimiz tatlı bölgedir.</div></div>

<div class="calc-graph"><div id="plot-l1-period-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> yan yana iki iki-durumlu zincir. Sol: P = [[0, 1], [1, 0]] — zincir A → B → A → B şeklinde sonsuza dek salınır. Periyot = 2. Zaman n'de A durumunda olma olasılığı 0 ile 1 arasında alternatif olur ve <em>asla</em> yakınsamaz. Sağ: P = [[0.5, 0.5], [0.5, 0.5]] — saf aperiyodik zincir. A durumu olasılığı bir adımda 0.5'e atlar ve orada kalır. Aynı sayıda durum, tamamen farklı uzun-vade davranışı. Periyot, yakınsamanın sessiz katilidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var P1=[[0,1],[1,0]];var P2=[[0.5,0.5],[0.5,0.5]];
function step(v,P){var n=v.length;var r=[];for(var j=0;j<n;j++){var s=0;for(var i=0;i<n;i++){s+=v[i]*P[i][j];}r.push(s);}return r;}
var v1=[1,0],v2=[1,0];var xs=[],y1=[],y2=[];for(var k=0;k<=12;k++){xs.push(k);y1.push(v1[0]);y2.push(v2[0]);v1=step(v1,P1);v2=step(v2,P2);}
var d1={x:xs,y:y1,mode:'lines+markers',name:'periyodik (periyot 2)',line:{color:'#ef4444',width:2.2},marker:{size:7}};
var d2={x:xs,y:y2,mode:'lines+markers',name:'aperiyodik',line:{color:'#3b82f6',width:2.2},marker:{size:7}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'adım n',gridcolor:'rgba(255,255,255,0.07)',dtick:1},yaxis:{title:'P(durum = A, adim n)',gridcolor:'rgba(255,255,255,0.07)',range:[-0.05,1.1]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-period-tr',[d1,d2],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Hava zincirinde hızlı sağlık kontrolü.</strong> İndirgenemez mi? Evet — her durum diğer her duruma bir adımda erişebilir (P'nin her girişi pozitif). Aperiyodik mi? Evet — her köşegen giriş pozitif, dolayısıyla her durumun periyodu 1. Pozitif yinelenen mi? Evet — sonlu indirgenemez zincirler otomatik olarak öyledir. Yani hava zinciri ergodiktir, bu yüzden 5. bölümün yakınsama teoremi komplikasyon olmaksızın geçerliydi.</div>

<h2 class="lesson-title">7. Ortalama Vuruş Süreleri ve Ortalama Geri Dönüş Süreleri</h2>

<div class="calc-highlight"><strong>"Nereye varacağım?"nın ötesinde "oraya varmam ne kadar sürecek?" yatar.</strong> Bir başlangıç durumundan bir hedef duruma erişmek için beklenen adım sayısı <em>ortalama vuruş süresi</em>; zincirin başlangıç durumuna dönmesine kadar beklenen adım sayısı ise <em>ortalama geri dönüş süresidir</em>. Her ikisi de lineer denklem sistemlerine indirgenir — yeni teori yok, sadece akıllı muhasebe.</div>

<p class="l-text">Hedef durum <em>j</em>'yi sabitle. <em>h<sub>i</sub></em> = <em>i</em>'den başlayıp <em>j</em>'ye varmak için beklenen adım sayısı olarak tanımla. İlk adım üzerinde koşulla:</p>

<div class="calc-formula"><div class="formula-label">ORTALAMA VURUŞ SÜRELERİ</div><div class="formula-main">$$h_j = 0, \\qquad h_i \\;=\\; 1 + \\sum_{k \\neq j} p_{ik} \\, h_k \\quad \\text{for } i \\neq j$$</div><div class="formula-sub">j'den oradayız (0 adım). Herhangi başka bir i durumundan bir adım harcayıp, geldiğimiz yerden aynı sorunla yüzleşiriz.</div></div>

<p class="l-text">Bu, <em>h<sub>i</sub></em> bilinmeyenlerinde kare bir lineer sistemdir; <code>numpy.linalg.solve</code> ile çöz ve her başlangıç durumu için beklenen süreyi elde et. Bir <em>j</em> durumuna <strong>ortalama geri dönüş süresi</strong> ise 1 + Σ<sub>i ≠ j</sub> p<sub>ji</sub> · h<sub>i</sub>'dir; burada <em>h<sub>i</sub></em>, <em>i</em>'den <em>j</em>'ye vuruş süresidir.</p>

<div class="calc-formula"><div class="formula-label">ŞAŞIRTICI BİR TEOREM</div><div class="formula-main">$$\\mathbb{E}\\!\\left[ T_j \\,\\big|\\, X_0 = j \\right] \\;=\\; \\frac{1}{\\pi[j]}$$</div><div class="formula-sub">Ergodik bir zincir için j durumuna ortalama geri dönüş süresi tam olarak kararlı olasılığının tersidir. Zincirin daha çok zaman geçirdiği durumlara daha sık geri dönülür — güzelce, tam olarak.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body">Hava zinciri: kararlı dağılım π ≈ (0.518, 0.184, 0.298). Bir Güneşli güne ortalama geri dönüş süresi 1/0.518 ≈ <strong>1.93 gün</strong>. Bir Yağmurlu güne: 1/0.184 ≈ <strong>5.43 gün</strong>. Bir Bulutlu güne: 1/0.298 ≈ <strong>3.36 gün</strong>. Nadir durumlar ziyaretler arasında daha uzun bekler — tek satırlık teorem, bir yıllık hava kaydının ampirik olarak doğrulayacağı şeyi yakalar.</div></div>

<h2 class="lesson-title">8. AI Uygulaması 1: n-Gram Dil Modelleri</h2>

<div class="calc-highlight"><strong>Bigram dil modelleri = kelime tokenleri üzerinde birinci-mertebe Markov zincirleri.</strong> Transformer'lardan önce (ve LSTM'lerden onlarca yıl önce) n-gram modeller hesaplamalı dilbilimin işçi aletiydi. Matematikleri tam olarak öğrendiğiniz şeydir — ve sınırlamalarını anlamak alanın neden bunların ötesine geçtiğini açıklar.</div>

<p class="l-text">Durum uzayı bir sözcük dağarcığı <em>V</em> olsun. Bir <strong>bigram</strong> modeli sonraki kelimenin yalnızca önceki kelimeye bağlı olduğunu varsayar:</p>

<div class="calc-formula"><div class="formula-label">BİGRAM (BİRİNCİ-MERTEBE) DİL MODELİ</div><div class="formula-main">$$P\\!\\left( w_n \\,\\big|\\, w_{n-1}, w_{n-2}, \\ldots, w_1 \\right) \\;\\approx\\; P\\!\\left( w_n \\,\\big|\\, w_{n-1} \\right)$$</div><div class="formula-sub">Metin üzerinde Markov varsayımı. Tüm önek üzerinde koşullama, tek bir önceki kelime üzerinde koşullamayla yer değiştirir.</div></div>

<p class="l-text">Geçiş matrisi nereden gelir? <strong>Sayımdan.</strong> Maksimum olabilirlik tahmini der ki:</p>

<div class="calc-formula"><div class="formula-label">MAKSİMUM OLABİLİRLİK TAHMİNİ</div><div class="formula-main">$$\\hat{P}(w_n = j \\,|\\, w_{n-1} = i) \\;=\\; \\frac{\\#(i, j)}{\\#(i)}$$</div><div class="formula-sub">Pay: (i, j) bigramının eğitim derleminde göründüğü sayı. Payda: i kelimesinin (herhangi bir şey takip ederek) göründüğü sayı. Saf sayım; sinir ağı yok, gömme yok.</div></div>

<p class="l-text"><strong>Metin üretme.</strong> Bir başlangıç kelimesi seç. <em>P</em>'deki satırına bak. Bir sonraki kelimeyi o satırın dağılımından örnekle. Tekrarla. Ortaya çıkan metin yerel olarak akıcıdır ("ve ve ve" küçük veride), ara sıra şaşırtıcı derecede tutarlıdır, ve küresel olarak tutarsızdır — çünkü bir kelime ileri gittiğinde model diğer her şeyi unutmuştur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trigram modeli</div><div class="card-body">Önceki <em>iki</em> kelimeye koşulla. Durum = sıralı kelime çifti. V boyutlu sözcük dağarcığı V²'ye kadar durum demek — Türkçe için zaten milyonlar. Geçiş matrisi seyrek ve devasa olur.</div></div>
<div class="calc-card"><div class="card-title">k-gram modeli</div><div class="card-body">Önceki k − 1 kelimeye koşulla. Durum uzayı V<sup>k−1</sup> gibi büyür. Yumuşatma hilelerle bile k ≈ 5'in ötesinde model eğitim derlemine aşırı uyar.</div></div>
<div class="calc-card"><div class="card-title">Neden başarısız oluyorlar</div><div class="card-body">Gerçek metinde uzun-menzilli bağımlılıklar vardır. "Koridorun ucundaki sıcak pencere kenarında uyuyan kedi" — bir 4-gram fiile geldiğimizde "kedi"nin özne olduğunu hatırlayamaz. Transformer'lar bunu tam attention ile çözdü.</div></div>
</div>

<div class="l-note"><strong>Yumuşatma önemli.</strong> Naif bir bigram modeli eğitimde görünmeyen herhangi bir bigrama sıfır olasılık atar, bu da tüm cümle olasılığını sıfır yapar (çarpımdaki bir sıfır). <em>Laplace yumuşatma</em>, <em>Kneser–Ney yumuşatma</em>, <em>Good–Turing yumuşatma</em> hepsi görünmeyen bigramlara küçük kesirler ekler. Modern LLM'lere bu gerek yok çünkü her tahmin tüm sözcük dağarcığı üzerinde bir softmax'tır — sıfır yoktur.</div>

<p class="l-text"><strong>Tarihsel yay.</strong> 1950'lerden 2010'ların başına kadar n-gram modelleri konuşma tanımayı, makine çevirisini, yazım denetleyicileri ve tahmin klavyelerini çalıştırdı. Google'ın devasa web ölçekli n-gram derlemi (2006'da yayımlandı) derin öğrenmeden önceki son teknolojiydi. Bugün bir öğretim örneği ve bir baseline — ama onları tanımlayan Markov varsayımı bu derste çalıştığımızla tam olarak aynı.</p>

<h2 class="lesson-title">9. AI Uygulaması 2: PageRank</h2>

<div class="calc-highlight"><strong>Brin ve Page, 1998: Google'ın kuruluş makalesi.</strong> PageRank algoritması her web sayfasına bir "önem" puanı atar. Hile: "rastgele sörfçü" modelleyin, bağlantıları rastgele tıklayan ve ara sıra rastgele bir sayfaya teleport olan. Bu Markov zincirinin kararlı dağılımı önem puanıdır. Tüm sıralama algoritması tek bir kararlı dağılımdır.</div>

<p class="l-text"><em>N</em>, web sayfalarının sayısı olsun. Sütun-stokastik bir matris <em>M</em> kur, öyle ki</p>

<div class="calc-formula"><div class="formula-label">BAĞLANTI MATRİSİ</div><div class="formula-main">$$M_{ji} \\;=\\; \\begin{cases} 1 / \\text{out-degree}(i) & \\text{if page } i \\text{ links to page } j \\\\ 0 & \\text{otherwise} \\end{cases}$$</div><div class="formula-sub">i sayfasında k çıkış derecesine sahip bir sörfçü her çıkış bağlantısını 1/k olasılıkla tıklar. M, bu saf-tıklama zincirinin geçiş matrisidir (sütun yazımı: sütunlar 1'e toplanır).</div></div>

<p class="l-text">Bu naif zincirde iki sorun: <strong>sarkık sayfalar</strong> çıkış bağlantısı içermez (sütunu tamamen sıfır — stokastik değil), ve zincirde sörfçüyü tuzaklayan yutucu bileşenler olabilir. Çözüm, her adımda <em>(1 − α)</em> olasılıkla uniform rastgele bir sayfaya <strong>teleport</strong> eklemek:</p>

<div class="calc-formula"><div class="formula-label">PAGERANK DENKLEMİ</div><div class="formula-main">$$\\pi \\;=\\; \\alpha \\, M \\, \\pi \\;+\\; (1 - \\alpha) \\, v$$</div><div class="formula-sub">α (tipik olarak 0.85) bağlantı izleme olasılığı; (1 − α) teleport olasılığı. v teleport dağılımıdır (uniform 1/N, ya da kişiselleştirilmiş). PageRank vektörü π bu denklemin tek sabit noktasıdır.</div></div>

<p class="l-text"><strong>Çözmek.</strong> İki yöntem:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrudan: lineer çözüm</div><div class="card-body">(I − αM) π = (1 − α) v olarak yeniden yaz ve N × N lineer sistemi çöz. Kesin ama O(N³) — milyarlarca sayfa için uygulanabilir değil.</div></div>
<div class="calc-card"><div class="card-title">Güç iterasyonu</div><div class="card-body">π<sup>(0)</sup> = uniform ile başla. π<sup>(t+1)</sup> = α M π<sup>(t)</sup> + (1 − α) v iterasyonu. Geometrik yakınsar; her adım bir seyrek matris-vektör çarpımı. Web ölçeğinde böyle yapılır.</div></div>
<div class="calc-card"><div class="card-title">Neden yakınsar</div><div class="card-body">αM + (1 − α) v 1<sup>T</sup> matrisi sütun-stokastik, indirgenemez, aperiyodiktir — yani ergodik. Zincir, α tarafından belirlenen oranda tek kararlı dağılıma yakınsar (daha küçük α ⇒ daha hızlı yakınsama ama bağlantı yapısına daha az sadık).</div></div>
</div>

<div class="calc-graph"><div id="plot-l1-pagerank-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 5 sayfalı oyuncak bir web üzerinde PageRank puanları. A sayfası B ve C'ye bağlanır; B C'ye; C A'ya; D ve E yalnızca A'ya bağlanır. α = 0.85 ve uniform teleport ile 40 adım güç iterasyonu. A sayfası en yüksek rütbeyi kazanır — kendisi A ve B'den kredi alan C tarafından ve hem izole sayfa D hem de E tarafından işaret ediliyor. Eğriler her puanın iterasyon sırasında nasıl evrildiğini ve ~15 adım içinde nasıl kararlı hâle geldiğini gösteriyor.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=5;var labels=['A','B','C','D','E'];
var M=[[0,0,1,1,1],[0.5,0,0,0,0],[0.5,1,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var alpha=0.85;var v=[1/N,1/N,1/N,1/N,1/N];
var pi=v.slice();var hist=[[],[],[],[],[]];var xs=[];
for(var t=0;t<=40;t++){xs.push(t);for(var i=0;i<N;i++){hist[i].push(pi[i]);}var npi=new Array(N).fill(0);for(var i=0;i<N;i++){for(var j=0;j<N;j++){npi[i]+=alpha*M[i][j]*pi[j];}npi[i]+=(1-alpha)*v[i];}pi=npi;}
var colors=['#3b82f6','#f59e0b','#10b981','#9ca3af','#a78bfa'];
var traces=[];for(var i=0;i<N;i++){traces.push({x:xs,y:hist[i],mode:'lines',name:labels[i],line:{color:colors[i],width:2}});}
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'güç iterasyonu adımı',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'PageRank puanı',gridcolor:'rgba(255,255,255,0.07)'},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-pagerank-tr',traces,layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Kişiselleştirilmiş PageRank.</strong> Teleport vektörü v'yi uniformdan belirli bir "tohum" sayfa setine yönelik bir dağılıma değiştir, kararlı dağılım da aynı şekilde yön bulur — önemi <em>o tohumlara göre</em> ölçer. Bu tek değişiklik öneri sistemlerinin, dolandırıcılık tespitinin, ve modern bilgi graflarında düğüm benzerliğinin (Pinterest'in Pixie'si, Twitter/X'in Who-To-Follow'u, pek çok GNN baseline'ı) altında yatar.</div>

<h2 class="lesson-title">10. AI Uygulaması 3: Graf Gömmesi için Rastgele Yürüyüşler</h2>

<div class="calc-highlight"><strong>DeepWalk (Perozzi vd. 2014), node2vec (Grover & Leskovec 2016).</strong> Markov zincirlerinden modern temsil öğrenmeye köprü. Herhangi bir grafı al. Üzerinde rastgele yürüyüşler çalıştır. Her yürüyüşü düğüm ID'lerinden oluşan bir "cümle" olarak ele al. Cümleleri Word2vec'e ver. Her düğüm için bir vektör çıkar — bir <em>düğüm gömmesi</em> — graf yapısını elle tasarlanmış özellikler olmaksızın yakalayan.</div>

<p class="l-text">İş akışı şaşırtıcı derecede basit:</p>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Markov zincirini kur</div><div class="step-detail">Durumlar = grafın düğümleri. Geçiş olasılıkları = komşular üzerinde uniform (DeepWalk) ya da iç-/dış-komşuluk yapısına yönelik biased (node2vec, BFS-benzeri ile DFS-benzeri arasında interpolasyon yapmak için p ve q parametrelerini kullanır).</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Yürüyüş örnekle</div><div class="step-detail">Her düğümden sabit uzunlukta birçok rastgele yürüyüş simüle et (örneğin her biri 80 adım, düğüm başına 10 yürüyüş). Her yürüyüş bir düğüm ID dizisidir — düğümler "kelime" olarak bir "cümle".</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Word2vec uygula</div><div class="step-detail">Yürüyüşleri bir metin derlemi olarak ele al. Bir skip-gram modeli eğit: her düğümün gömmesi, yürüyüşlerde çevresindeki bir pencere içinde hangi diğer düğümlerin göründüğünü tahmin ederek öğrenilir. Word2vec hedefi gerisini halleder.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Gömleri kullan</div><div class="step-detail">Aşağı akış görevleri (düğüm sınıflandırma, bağlantı tahmini, topluluk tespiti) Öklid vektörü üzerinde standart ML olur. Rastgele yürüyüşlerde sık birlikte görünen düğümler gömme uzayında yakın olur.</div></div></div>
</div>

<div class="calc-graph"><div id="plot-l1-walk-tr" class="plotly-graph" style="height:340px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 12 düğümlü 1-B bir döngü üzerinde 100 adımlık tek bir rastgele yürüyüş (durum 0..11, komşular sarmal). Her adımda yürüyücü 0.5 olasılıkla sola ya da sağa seçer. Y ekseni ziyaret edilen durumu adıma karşı izler. Difüzif karekök davranışına dikkat: 100 adım sonra bile yürüyücü ortalama sürüklenmesinden çok uzaklaşmamış. Bu, DeepWalk'un gerçek grafta örneklediği aynı süreçtir; yalnızca bağlantı daha ilginç.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var N=12;var T=100;var state=6;var xs=[0],ys=[state];
for(var t=1;t<=T;t++){if(Math.random()<0.5){state=(state-1+N)%N;}else{state=(state+1)%N;}xs.push(t);ys.push(state);}
var d1={x:xs,y:ys,mode:'lines+markers',name:'rastgele yürüyüş',line:{color:'#3b82f6',width:1.6},marker:{size:4,color:'#fbbf24'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'adım',gridcolor:'rgba(255,255,255,0.07)'},yaxis:{title:'düğüm id (12 döngü)',gridcolor:'rgba(255,255,255,0.07)',dtick:1,range:[-0.5,11.5]},margin:{t:30,r:30,b:50,l:65},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l1-walk-tr',[d1],layout,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Modern alaka.</strong> Rastgele-yürüyüş gömmeleri Graf Sinir Ağları'ndan (GNN) önce vardı ve onlar tarafından değiştirilmediler. Pek çok benchmark'ta hâlâ rekabetçidirler çünkü rastgele yürüyüş dağılımı kendisi anlamlı yapısal bilgiyi kodlar. Pek çok üretim GNN'i rastgele yürüyüş özelliklerini girdi olarak kullanır; pek çok graf-LLM hibridi bir Transformer bağlam penceresine komşulukları beslemek için rastgele yürüyüş örneklemesi kullanır.</div>

<h2 class="lesson-title">11. Birinci-Mertebe Markov Zincirlerinin Sınırlamaları</h2>

<div class="calc-highlight"><strong>Markov zincirlerini çözülebilir kılan aynı özellik, onları zayıf kılan şeydir.</strong> Belleksizlik bize tek bir matris verir; aynı zamanda en son durumun ötesindeki her sinyali atar. Gerçek diziler — doğal dil, müzik, DNA, diyalog, kod — yüzlerce ya da binlerce token üzerinde uzanan yapıya sahiptir. Birinci-mertebe zincirler bunlardan hiçbirini temsil edemez.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uzun-menzilli bağımlılıklar</div><div class="card-body">"Kırmızı kapılı evde yaşayan kadının yazdığı kitap ___." Kelimeler üzerinde Markov zinciri, bir fiil beklediğimizi bilmenin hiçbir yolu yoktur. Transformer'lar bunu tüm bağlam üzerinde attention ile çözdü.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşik yapı</div><div class="card-body">Kodda iç içe kapsamlar, dilde sözdizimi ağaçları, müzikte ifadeleme vardır. Düz Markov zincirleri yalnızca kayan pencereyi görür ve hiyerarşiyi tamamen kaçırır.</div></div>
<div class="calc-card"><div class="card-title">Gizli durum</div><div class="card-body">Pek çok gerçek süreç, doğrudan gözlemleyemediğimiz gizli bir durumda Markov'dur — yalnızca gürültülü yayımlarını görürüz. Saklı Markov Modelleri (sonraki ders) zinciri, durumu ve gözlemi ortak modelleyerek geri kazanır.</div></div>
<div class="calc-card"><div class="card-title">Sürekli çıktılar</div><div class="card-body">Saf hâlinde Markov zincirleri ayrık-durumludur. Çoğu modern üretici model sürekli uzaylarda çalışır — ama hâlâ sıklıkla Markov'dur: bir difüzyon modeli, gürültü seviyeleri üzerinde tam anlamıyla sürekli-durumlu bir Markov zinciridir.</div></div>
</div>

<p class="l-text"><strong>Alan nasıl ilerledi.</strong> Yüksek-mertebe Markov zincirleri (trigramlar vb.) daha zengin bir durum uzayında birinci-mertebe zincirlere eşdeğerdir — durum uzayı patlamasının bedeliyle bellek satın alır. Saklı Markov Modelleri (L2) zinciri saklı tutar ve gürültülü yayımlar gözlemler. MCMC yöntemleri (L3) keyfi dağılımlardan örnekleme aracı olarak Markov zincirlerini <em>kullanır</em>. Bayes çıkarımı ve varyasyonel yöntemler (L4, L5) aynı olasılıksal temeller üzerine inşa eder. Difüzyon modelleri sürekli-zaman Markov zinciridir, geriye doğru çalıştırılır. Transformer'lar Markov varsayımını tamamen tam attention ile değiştirir. Bunların her biri, bugün inşa ettiğimiz basit nesneyi önce sahiplenerek en iyi anlaşılır.</p>

<h2 class="lesson-title">12. Klasik Alıştırmalar</h2>
<p class="l-text"><em>Elle çözülen, adım adım çözümlü alıştırmalar bir sonraki içerik turunda eklenecek. Şimdilik yukarıdaki görselleştirmeler ve bölüm içindeki türetmeler senin çalışma örneklerin — her formülde durup cebiri kağıt üzerinde doğrula.</em></p>
<div class="calc-highlight"><strong>Bu dersi nasıl çalış</strong><br>1. Her bölümü oku, türetmeleri kağıt üzerinde yeniden yap.<br>2. Her formülde dur ve cebiri doğrula.<br>3. Görselleştirmeleri önce elle çiz, sonra grafiklerle karşılaştır.<br>4. Her işlenmiş örneği önce kendin çöz, sonra çözümü oku.</div>

<p class="l-text"><strong>Oynanacak yerler:</strong> <em>P</em>'nin bir girişini değiştir (örneğin Güneşli → Güneşli'yi 0.95 yap) ve kararlı dağılımın tamamen-Güneşli'ye doğru kaymasını izle. 4. parçada <em>N</em>'yi 100 000'e çıkar; ampirik kesirler π ile üç ondalığa kadar eşleşmeli. Türkçe derlemini bir kitaptan İngilizce metinle değiştir; 1000+ kelimeyle bigram çıktısı kısa parçalar için şaşırtıcı derecede okunabilir olur. Bir trigram dene (önceki iki kelimeye koşulla) ve çıktının ne kadar yerel olarak tutarlı olduğunu, ve sayım tablolarının ne kadar üstel büyüdüğünü gör.</p>

<h2 class="lesson-title">13. Özet ve Artık Yapabileceklerin</h2>

<p class="l-text">Tek bir derste, izin geri kalanında yeniden kullanılacak tüm temeli inşa ettik. Model tek bir sayfada:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Markov özelliği</div><div class="card-body">Gelecek geçmişe yalnızca şimdiki aracılığıyla bağlıdır. P(X_{n+1} = j | geçmiş) = P(X_{n+1} = j | X_n).</div><div class="card-formula">belleksiz</div></div>
<div class="calc-card"><div class="card-title">Geçiş matrisi</div><div class="card-body">Satır-stokastik matris P, P[i,j] = P(X_{n+1} = j | X_n = i). Tüm tek-adımlı dinamikleri kodlar.</div><div class="card-formula">P · 1 = 1</div></div>
<div class="calc-card"><div class="card-title">Çok adım</div><div class="card-body">k-adımlı geçiş olasılıkları P^k'nın girişleridir. Chapman–Kolmogorov matris formunda.</div><div class="card-formula">P^k_{ij}</div></div>
<div class="calc-card"><div class="card-title">Dağılım evrimi</div><div class="card-body">Bir π_n olasılık satır vektörü π_{n+1} = π_n · P ile evrilir. n adım sonra: π_n = π_0 · P^n.</div><div class="card-formula">π_n = π_0 P^n</div></div>
<div class="calc-card"><div class="card-title">Kararlı dağılım</div><div class="card-body">π = πP, özdeğeri 1 olan P'nin sol özvektörü. Ergodik zincirler için tek ve global çekici.</div><div class="card-formula">π = π P</div></div>
<div class="calc-card"><div class="card-title">Sınıflandırma</div><div class="card-body">Yinelenen / geçici, periyodik / aperiyodik, indirgenemez / indirgenebilir. Ergodik = dost durum.</div><div class="card-formula">ergodik = ✓✓✓</div></div>
<div class="calc-card"><div class="card-title">n-gramlar</div><div class="card-body">Bigram dil modelleri kelimeler üzerinde birinci-mertebe Markov zincirleridir; trigramlar ikinci-mertebe; vb. Sayım matrisi tahmin eder.</div><div class="card-formula">P(w_n | w_{n-1})</div></div>
<div class="calc-card"><div class="card-title">PageRank</div><div class="card-body">Web grafı üzerinde teleportlu rastgele-sörfçü Markov zincirinin kararlı dağılımı. π = αMπ + (1-α)v.</div><div class="card-formula">π = αMπ + (1-α)v</div></div>
</div>

<div class="l-warn"><strong>Sıradaki (Ders 2):</strong> <strong>Saklı Markov Modeli</strong>. Zinciri göremediğimiz gizli bir durumda çalıştıracağız — yalnızca gürültülü yayımlarını göreceğiz. Sonuç, sinyal işleme tarihinin en başarılı modellerinden biridir (konuşma tanıma, biyoinformatik, finans) ve modern üretici AI'ya hakim olan varyasyonel / saklı-değişken modellerine doğal bir basamaktır.</p>`

};
