window.LISE_MAT_L100 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Flip a fair coin ten times. How many heads do you expect to see?</strong> Five, obviously — but how often do you actually get exactly five? Is it half the time? More? Less? And what is the chance you get all ten heads in a row? These are the kinds of questions the <em>binomial distribution</em> answers. It is the single most important discrete probability distribution in elementary statistics, and once you understand it, an enormous range of real-world situations — quality control, polling, free-throw shooting, multiple-choice exams, clinical trials — become straightforward arithmetic.</p>

<p class="l-text">In this lesson we build the binomial distribution from a tiny ingredient (the <em>Bernoulli trial</em>: a single experiment with two outcomes), stack n copies of it together to get a binomial random variable, and derive the exact formula for the probability of getting k successes. Then we compute mean and variance, study the shape of the distribution, and apply the result to a handful of realistic problems. By the end you will be able to answer any "how many successes in n tries" question that uses a fixed success probability p.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a Bernoulli trial and recognise the four conditions for a binomial setting (fixed n, two outcomes, constant p, independence)</li>
<li>Apply the binomial probability formula $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ to compute exact probabilities</li>
<li>Compute the mean $E[X] = np$ and variance $\\text{Var}(X) = np(1-p)$ of a binomial random variable</li>
<li>Describe how the shape of the distribution changes with p (symmetric, right-skewed, left-skewed)</li>
<li>Compute cumulative probabilities $P(X \\leq k)$, $P(X \\geq k)$, and $P(a \\leq X \\leq b)$</li>
<li>Recognise when the binomial can be approximated by a normal distribution for large n</li>
</ul>
</div>

<h2 class="lesson-title">1. The Bernoulli Trial: A Single Yes/No Experiment</h2>

<div class="calc-highlight"><strong>The atom of all probability is a single experiment with exactly two outcomes.</strong> Flip a coin and you see heads or tails. Take a free throw and you score or you miss. Inspect one item from a factory and it is defective or it is not. These two-outcome experiments are called <em>Bernoulli trials</em>, named after Jacob Bernoulli (1654&ndash;1705), who first studied them systematically.</div>

<p class="l-text">Mathematically, a <strong>Bernoulli trial</strong> is any random experiment with the following structure:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two outcomes</div><div class="card-body">Exactly two possible results, traditionally called <em>success</em> and <em>failure</em>. The labels are arbitrary — "success" is just the outcome we are counting.</div></div>
<div class="calc-card"><div class="card-title">Success probability p</div><div class="card-body">The probability of success is a fixed number $p$ with $0 \\leq p \\leq 1$. Then the probability of failure is $1-p$ (often written $q$).</div></div>
<div class="calc-card"><div class="card-title">Single trial</div><div class="card-body">We run the experiment <em>once</em>. The outcome is a random variable that takes value 1 (success) with probability p and 0 (failure) with probability $1-p$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BERNOULLI RANDOM VARIABLE</div><div class="formula-main">$$X \\sim \\text{Bernoulli}(p) \\;\\Longleftrightarrow\\; P(X=1) = p, \\quad P(X=0) = 1-p$$</div><div class="formula-sub">Mean: $E[X] = p$. Variance: $\\text{Var}(X) = p(1-p)$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE</div><div class="example-body">A fair coin flip is a Bernoulli trial with $p = 0.5$. The two outcomes are heads (success) and tails (failure). A free throw by a 70% shooter is a Bernoulli trial with $p = 0.7$. The two outcomes are made (success) and missed (failure). Inspecting an item from a factory with 2% defect rate is a Bernoulli trial with $p = 0.02$ if we count defective as success.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Which of these are Bernoulli trials? (a) Rolling a die. (b) Rolling a die and recording whether it lands on 6. (c) Drawing a card from a deck. (d) Drawing a card and checking if it is a heart. Answers: (b) and (d) are Bernoulli trials with $p = 1/6$ and $p = 1/4$ respectively. (a) and (c) have more than two outcomes — but they become Bernoulli trials as soon as we group outcomes into two categories.</div></div>

<h2 class="lesson-title">2. The Binomial Setting: Stacking Bernoulli Trials</h2>

<div class="calc-highlight"><strong>Run the same Bernoulli trial n times in a row, count the successes, and you have a binomial random variable.</strong> The total count is the binomial. It takes integer values from 0 (no successes) to n (all successes).</div>

<p class="l-text">For the binomial formula to apply, four conditions must hold. Memorise them — they are the boundary between problems where you can use the binomial and problems where you cannot.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Fixed number of trials</div><div class="card-body">We run exactly $n$ trials, where $n$ is decided in advance (not "until something happens").</div></div>
<div class="calc-card"><div class="card-title">2. Two outcomes per trial</div><div class="card-body">Each trial is a Bernoulli trial with the same definition of success.</div></div>
<div class="calc-card"><div class="card-title">3. Constant success probability</div><div class="card-body">The probability $p$ of success is the same for every trial.</div></div>
<div class="calc-card"><div class="card-title">4. Independence</div><div class="card-body">The outcome of one trial does not affect the outcome of another.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BINOMIAL RANDOM VARIABLE</div><div class="formula-main">$$X \\sim \\text{Bin}(n, p) \\;:\\; \\text{number of successes in } n \\text{ independent Bernoulli}(p) \\text{ trials}$$</div><div class="formula-sub">$X$ takes values $0, 1, 2, \\ldots, n$.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE</div><div class="example-body">Flip a fair coin 10 times. The number of heads $X$ is binomial with $n = 10$ and $p = 0.5$. Write $X \\sim \\text{Bin}(10, 0.5)$. Take 8 free throws as a 70% shooter. The number you make is $X \\sim \\text{Bin}(8, 0.7)$. Inspect 100 items from a production line with a 2% defect rate. The number of defectives is $X \\sim \\text{Bin}(100, 0.02)$.</div></div>

<div class="l-note"><strong>Where the binomial does NOT apply:</strong> Drawing 5 cards from a deck without replacement. Why? Because the probability of drawing a heart changes after each card — independence fails, and p is not constant. For this situation we need the <em>hypergeometric</em> distribution (covered in a future lesson).</div>

<h2 class="lesson-title">3. The Binomial Probability Formula</h2>

<div class="calc-highlight"><strong>Here is the master formula of this lesson:</strong> if $X \\sim \\text{Bin}(n, p)$, the probability of getting exactly $k$ successes in $n$ trials is</div>

<div class="calc-formula"><div class="formula-label">BINOMIAL PROBABILITY MASS FUNCTION</div><div class="formula-main">$$P(X = k) \\;=\\; \\binom{n}{k} p^k (1-p)^{n-k} \\qquad k = 0, 1, 2, \\ldots, n$$</div><div class="formula-sub">$\\binom{n}{k}$ is the number of ways to choose which $k$ of the $n$ trials are the successes. $p^k$ is the probability that those $k$ trials all succeed. $(1-p)^{n-k}$ is the probability that the remaining $n-k$ trials all fail.</div></div>

<p class="l-text"><strong>Where does this formula come from?</strong> Three pieces multiplied together:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\binom{n}{k}$ &mdash; ways to arrange</div><div class="card-body">There are $\\binom{n}{k}$ different orderings in which $k$ successes and $n-k$ failures can appear. For 10 coin flips with exactly 5 heads, the heads can occur on trials $\\{1,2,3,4,5\\}$ or $\\{1,2,3,4,6\\}$ or ... — a total of $\\binom{10}{5} = 252$ arrangements.</div></div>
<div class="calc-card"><div class="card-title">$p^k$ &mdash; successes' probability</div><div class="card-body">For any one such arrangement, the probability that the chosen $k$ trials all succeed is $p \\cdot p \\cdots p = p^k$ (by independence).</div></div>
<div class="calc-card"><div class="card-title">$(1-p)^{n-k}$ &mdash; failures' probability</div><div class="card-body">The probability that the remaining $n-k$ trials all fail is $(1-p)(1-p)\\cdots(1-p) = (1-p)^{n-k}$.</div></div>
</div>

<p class="l-text">Each arrangement is one mutually exclusive event with probability $p^k (1-p)^{n-k}$. There are $\\binom{n}{k}$ of them. Add up the probabilities and you get the formula.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; FAIR COIN</div><div class="example-body">Ten fair coin flips. Find $P(\\text{exactly 5 heads})$.<br><br>$n = 10$, $k = 5$, $p = 0.5$, $1 - p = 0.5$.<br><br>$P(X = 5) = \\binom{10}{5} (0.5)^5 (0.5)^5 = 252 \\cdot (0.5)^{10} = 252 / 1024 \\approx \\mathbf{0.2461}$.<br><br>So about 24.6% of the time you get exactly five heads. Notice that's much less than half — five heads is the most likely single outcome, but it still occurs only about 1 in 4 trials.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ALL HEADS</div><div class="example-body">Ten fair coin flips. Find $P(\\text{exactly 10 heads})$.<br><br>$n = 10$, $k = 10$, $p = 0.5$.<br><br>$P(X = 10) = \\binom{10}{10} (0.5)^{10} (0.5)^0 = 1 \\cdot (0.5)^{10} \\cdot 1 = 1/1024 \\approx \\mathbf{0.000977}$.<br><br>About 1 in 1024 — roughly once every thousand sequences of ten flips.</div></div>

<h2 class="lesson-title">4. Mean and Variance of the Binomial</h2>

<div class="calc-highlight"><strong>The binomial has two beautifully simple summary statistics.</strong> The mean is $np$ — exactly what your intuition predicts. The variance is $np(1-p)$, which is largest when $p = 0.5$ and shrinks to zero at the extremes $p = 0$ or $p = 1$.</div>

<div class="calc-formula"><div class="formula-label">MEAN, VARIANCE, STANDARD DEVIATION</div><div class="formula-main">$$E[X] = np \\qquad \\text{Var}(X) = np(1-p) \\qquad \\sigma_X = \\sqrt{np(1-p)}$$</div><div class="formula-sub">$X \\sim \\text{Bin}(n, p)$. These follow because a binomial is the sum of $n$ independent Bernoulli$(p)$ variables: means add, variances add (when independent).</div></div>

<p class="l-text"><strong>Why the mean is $np$.</strong> Write $X = X_1 + X_2 + \\cdots + X_n$ where each $X_i$ is the Bernoulli outcome of trial $i$. Each $X_i$ has mean $p$. By linearity of expectation, $E[X] = E[X_1] + \\cdots + E[X_n] = np$.</p>

<p class="l-text"><strong>Why the variance is $np(1-p)$.</strong> Each Bernoulli $X_i$ has variance $p(1-p)$ (you can verify: $E[X_i^2] = p$, so $\\text{Var}(X_i) = p - p^2 = p(1-p)$). Because the trials are independent, the variances add: $\\text{Var}(X) = np(1-p)$.</p>

<div class="calc-example"><div class="example-label">EXAMPLE</div><div class="example-body">For $X \\sim \\text{Bin}(100, 0.3)$:<br><br>Mean: $E[X] = 100 \\cdot 0.3 = 30$.<br>Variance: $\\text{Var}(X) = 100 \\cdot 0.3 \\cdot 0.7 = 21$.<br>Standard deviation: $\\sigma_X = \\sqrt{21} \\approx 4.58$.<br><br>Interpretation: in 100 trials with success rate 30%, expect about 30 successes give or take 4 or 5. The empirical rule says roughly 95% of outcomes fall in $[30 - 2 \\cdot 4.58, 30 + 2 \\cdot 4.58] = [20.84, 39.16]$ — that is, between about 21 and 39.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A fair coin flipped 400 times: expected heads $= 400 \\cdot 0.5 = 200$; std dev $= \\sqrt{400 \\cdot 0.5 \\cdot 0.5} = \\sqrt{100} = 10$. So you typically see 200 heads give or take 10. Getting 250 heads (5 standard deviations away) would be astronomically unlikely.</div></div>

<h2 class="lesson-title">5. The Shape of the Distribution</h2>

<div class="calc-highlight"><strong>The shape of the binomial depends entirely on p.</strong> Symmetric when $p = 0.5$, skewed right when $p < 0.5$ (long tail toward larger values), skewed left when $p > 0.5$ (long tail toward smaller values). All three are bell-shaped for large enough $n$.</div>

<div class="calc-graph"><div id="plot-l100-symmetric-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the probability mass function of $\\text{Bin}(10, 0.5)$. Notice the perfect symmetry: $P(X=k) = P(X=10-k)$. The peak is at $k = 5$ with probability about 0.246. The probabilities of the extremes ($k = 0$ or $k = 10$) are both tiny — about 0.001.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nA=10,pA=0.5;var xA=[];var yA=[];for(var k=0;k<=nA;k++){xA.push(k);yA.push(binProb(nA,k,pA));}
var trA={x:xA,y:yA,type:'bar',name:'Bin(10, 0.5)',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}}};
var layA={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (number of successes)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},showlegend:false};
Plotly.newPlot('plot-l100-symmetric-en',[trA],layA,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l100-skewed-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $\\text{Bin}(10, 0.2)$. The peak shifts left to $k = 2$ (the expected value $np = 2$) and the distribution leans right: small chance of large $k$, very large chance of small $k$. This is called <em>right-skewed</em> because the long tail points to the right.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nB=10,pB=0.2;var xB=[];var yB=[];for(var k=0;k<=nB;k++){xB.push(k);yB.push(binProb(nB,k,pB));}
var trB={x:xB,y:yB,type:'bar',name:'Bin(10, 0.2)',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}}};
var layB={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (number of successes)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},showlegend:false};
Plotly.newPlot('plot-l100-skewed-en',[trB],layB,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Symmetry rule:</strong> the binomial $\\text{Bin}(n, p)$ is symmetric if and only if $p = 0.5$. For any other $p$ there is skew. As $n$ grows, even skewed binomials start to look bell-shaped — this is the route to the normal approximation in section 9.</p>

<h2 class="lesson-title">6. Cumulative Probabilities</h2>

<div class="calc-highlight"><strong>Often we want the probability of a <em>range</em> of outcomes, not just one specific value.</strong> "At most 3 defects" means $P(X \\leq 3)$. "At least 6 free throws made" means $P(X \\geq 6)$. These are <em>cumulative probabilities</em>, and they are sums of binomial probabilities.</div>

<div class="calc-formula"><div class="formula-label">CUMULATIVE BINOMIAL PROBABILITIES</div><div class="formula-main">$$P(X \\leq k) = \\sum_{i=0}^{k} \\binom{n}{i} p^i (1-p)^{n-i}$$</div><div class="formula-sub">For "at least k", use the complement: $P(X \\geq k) = 1 - P(X \\leq k-1)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">At most k</div><div class="card-body">$P(X \\leq k) = P(X=0) + P(X=1) + \\cdots + P(X=k)$</div></div>
<div class="calc-card"><div class="card-title">At least k</div><div class="card-body">$P(X \\geq k) = P(X=k) + P(X=k+1) + \\cdots + P(X=n) = 1 - P(X \\leq k-1)$</div></div>
<div class="calc-card"><div class="card-title">Between a and b</div><div class="card-body">$P(a \\leq X \\leq b) = P(X \\leq b) - P(X \\leq a-1)$</div></div>
</div>

<div class="l-note"><strong>Common mistake:</strong> confusing "more than 5" with "at least 5". "More than 5" means $X > 5$, i.e. $X \\geq 6$, so $P(X \\geq 6)$. "At least 5" means $X \\geq 5$, so $P(X \\geq 5)$. Always rewrite ranges carefully using $\\leq$ and $\\geq$ before computing.</div>

<h2 class="lesson-title">7. Worked Examples in Full</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 &mdash; FREE THROWS</div><div class="example-body">A basketball player makes 70% of her free throws. She attempts 8 free throws. Find $P(X \\geq 6)$, the probability she makes at least 6.<br><br>$X \\sim \\text{Bin}(8, 0.7)$. We want $P(X = 6) + P(X = 7) + P(X = 8)$.<br><br>$P(X=6) = \\binom{8}{6}(0.7)^6(0.3)^2 = 28 \\cdot 0.117649 \\cdot 0.09 \\approx 0.2965$.<br>$P(X=7) = \\binom{8}{7}(0.7)^7(0.3)^1 = 8 \\cdot 0.082354 \\cdot 0.3 \\approx 0.1977$.<br>$P(X=8) = \\binom{8}{8}(0.7)^8(0.3)^0 = 1 \\cdot 0.057648 \\cdot 1 \\approx 0.0576$.<br><br>Sum: $0.2965 + 0.1977 + 0.0576 \\approx \\mathbf{0.5518}$.<br><br>So she makes at least 6 of 8 about 55% of the time. Note that the expected value is $np = 8 \\cdot 0.7 = 5.6$, so 6 is just above the mean — making it slightly more likely than not.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 &mdash; BLIND GUESSING</div><div class="example-body">A 12-question multiple-choice test has 4 options per question, exactly one correct. A student guesses blindly on every question. Find $P(\\text{at least 4 correct})$.<br><br>$X \\sim \\text{Bin}(12, 0.25)$. We want $P(X \\geq 4)$.<br><br>Use the complement: $P(X \\geq 4) = 1 - P(X \\leq 3)$.<br><br>$P(X=0) = \\binom{12}{0}(0.25)^0(0.75)^{12} \\approx 0.0317$.<br>$P(X=1) = \\binom{12}{1}(0.25)^1(0.75)^{11} \\approx 0.1267$.<br>$P(X=2) = \\binom{12}{2}(0.25)^2(0.75)^{10} \\approx 0.2323$.<br>$P(X=3) = \\binom{12}{3}(0.25)^3(0.75)^{9} \\approx 0.2581$.<br><br>$P(X \\leq 3) \\approx 0.0317 + 0.1267 + 0.2323 + 0.2581 \\approx 0.6488$.<br><br>$P(X \\geq 4) \\approx 1 - 0.6488 \\approx \\mathbf{0.3512}$.<br><br>Roughly 35%. Pure guessing produces 4 or more correct out of 12 about a third of the time — high enough to matter on short tests, low enough to fail any reasonable cut-off.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 &mdash; QUALITY CONTROL</div><div class="example-body">A factory has a 5% defect rate. A quality inspector samples 20 items. Find $P(\\text{no defects})$.<br><br>$X \\sim \\text{Bin}(20, 0.05)$. We want $P(X = 0)$.<br><br>$P(X=0) = \\binom{20}{0}(0.05)^0(0.95)^{20} = 1 \\cdot 1 \\cdot (0.95)^{20}$.<br><br>$(0.95)^{20} \\approx 0.3585$.<br><br>So $P(X=0) \\approx \\mathbf{0.3585}$ &mdash; about 36% of inspections find no defects. Not as high as you might guess, even with a low defect rate, because there are 20 chances for a defect to appear.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 &mdash; VACCINE TRIAL</div><div class="example-body">A vaccine is 95% effective at preventing a disease. 50 vaccinated people are exposed. What is the expected number who do NOT catch the disease, and the standard deviation?<br><br>Let success = does not catch disease, $p = 0.95$, $n = 50$.<br><br>Mean: $E[X] = np = 50 \\cdot 0.95 = \\mathbf{47.5}$.<br>Variance: $\\text{Var}(X) = np(1-p) = 50 \\cdot 0.95 \\cdot 0.05 = 2.375$.<br>Std dev: $\\sigma = \\sqrt{2.375} \\approx \\mathbf{1.54}$.<br><br>Expect about 47 or 48 to remain healthy, with typical deviation about 1.5 people. Almost all outcomes lie in $[47.5 - 3 \\cdot 1.54, 47.5 + 3 \\cdot 1.54] \\approx [42.9, 52.1]$ — and since $X \\leq 50$, the upper end is capped at 50.</div></div>

<h2 class="lesson-title">8. The Normal Approximation (Preview)</h2>

<div class="calc-highlight"><strong>For large n, the binomial looks like a bell curve.</strong> Specifically, $\\text{Bin}(n, p)$ becomes approximately Normal with mean $np$ and standard deviation $\\sqrt{np(1-p)}$. This is one of the most important facts in statistics — it is why political polls work, why quality control formulas are so simple, and why the bell curve appears everywhere.</div>

<div class="calc-formula"><div class="formula-label">NORMAL APPROXIMATION RULE</div><div class="formula-main">$$\\text{If } np \\geq 10 \\text{ and } n(1-p) \\geq 10, \\text{ then } \\text{Bin}(n, p) \\;\\approx\\; \\text{Normal}\\left(np, \\sqrt{np(1-p)}\\right)$$</div><div class="formula-sub">A useful rule of thumb: both $np$ and $n(1-p)$ should be at least 10 for the approximation to work well.</div></div>

<div class="calc-graph"><div id="plot-l100-normal-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $\\text{Bin}(20, 0.5)$ as bars next to the matching Normal density curve, mean 10 and std dev $\\sqrt{5} \\approx 2.236$. Notice how closely the smooth bell hugs the discrete bars. By $n = 100$ the match becomes nearly exact.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var nC=20,pC=0.5;var muC=nC*pC,sigC=Math.sqrt(nC*pC*(1-pC));
var xC=[];var yC=[];for(var k=0;k<=nC;k++){xC.push(k);yC.push(binProb(nC,k,pC));}
var xCn=[];var yCn=[];for(var t=0;t<=400;t++){var v=nC*t/400;xCn.push(v);yCn.push(normPdf(v,muC,sigC));}
var bars={x:xC,y:yC,type:'bar',name:'Bin(20, 0.5)',marker:{color:'#3b82f6',opacity:0.85,line:{color:'#60a5fa',width:1}}};
var curve={x:xCn,y:yCn,mode:'lines',name:'Normal(10, 2.236)',line:{color:'#f59e0b',width:2.8}};
var layC={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',range:[0,20],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k) and density',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l100-normal-en',[bars,curve],layC,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting (1-p)</div><div class="card-body">Writing $P(X=k) = \\binom{n}{k} p^k$ without the $(1-p)^{n-k}$ factor. The full formula has BOTH factors — successes give $p^k$ and failures give $(1-p)^{n-k}$.</div></div>
<div class="calc-card"><div class="card-title">Confusing $X=k$ and $X \\leq k$</div><div class="card-body">"At most 5" includes $k=0, 1, 2, 3, 4, 5$ — it is a sum of six probabilities, not one. Always re-read the problem to see if "exactly", "at most", or "at least" is meant.</div></div>
<div class="calc-card"><div class="card-title">Off-by-one in cumulative</div><div class="card-body">$P(X \\geq 6) \\neq 1 - P(X \\leq 6)$. The correct complement is $P(X \\geq 6) = 1 - P(X \\leq 5)$. Be careful: "at least 6" excludes 5, so the cumulative threshold is 5.</div></div>
<div class="calc-card"><div class="card-title">Forgetting independence check</div><div class="card-body">Sampling without replacement breaks independence. Drawing 5 cards from a 52-card deck is NOT binomial. Always verify that p stays constant and trials do not influence each other before applying the formula.</div></div>
</div>

<h2 class="lesson-title">10. Practice Exercises</h2>

<p class="l-text">Try each problem before reading the solution. The first three are short; the last three are realistic application problems.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1</div><div class="example-body"><strong>A fair die is rolled 6 times. Find the probability of getting exactly 2 sixes.</strong><br><br>Each roll is a Bernoulli trial with success = "rolling a 6", so $p = 1/6$. $X \\sim \\text{Bin}(6, 1/6)$.<br><br>$P(X = 2) = \\binom{6}{2}(1/6)^2(5/6)^4 = 15 \\cdot \\dfrac{1}{36} \\cdot \\dfrac{625}{1296} = \\dfrac{15 \\cdot 625}{36 \\cdot 1296} = \\dfrac{9375}{46656} \\approx \\mathbf{0.2009}$.<br><br>About 20%.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2</div><div class="example-body"><strong>Find the mean and variance of $X \\sim \\text{Bin}(50, 0.4)$.</strong><br><br>$E[X] = np = 50 \\cdot 0.4 = \\mathbf{20}$.<br>$\\text{Var}(X) = np(1-p) = 50 \\cdot 0.4 \\cdot 0.6 = \\mathbf{12}$.<br>$\\sigma_X = \\sqrt{12} \\approx 3.46$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3</div><div class="example-body"><strong>A coin is biased with $P(\\text{heads}) = 0.6$. Flip it 5 times. Find $P(\\text{at least one head})$.</strong><br><br>Easier to use the complement: $P(X \\geq 1) = 1 - P(X = 0)$.<br><br>$P(X = 0) = (0.4)^5 = 0.01024$.<br><br>$P(X \\geq 1) = 1 - 0.01024 \\approx \\mathbf{0.9898}$.<br><br>Almost certain — only about 1% chance of zero heads in 5 flips.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 &mdash; OPINION POLL</div><div class="example-body"><strong>A poll asks 100 people whether they support a policy. 60% of the population truly supports it. Find $P(\\text{at most 55 say yes})$.</strong><br><br>$X \\sim \\text{Bin}(100, 0.6)$. Want $P(X \\leq 55)$.<br><br>Mean: $\\mu = 60$. Std dev: $\\sigma = \\sqrt{100 \\cdot 0.6 \\cdot 0.4} = \\sqrt{24} \\approx 4.90$.<br><br>Using the normal approximation: standardise to $z = (55 - 60)/4.90 \\approx -1.02$.<br><br>$P(Z \\leq -1.02) \\approx \\mathbf{0.154}$.<br><br>About 15%. So even when the population is 60% in favour, there is a 15% chance the poll undercounts to 55 or fewer.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 &mdash; PRODUCT WARRANTY</div><div class="example-body"><strong>A laptop manufacturer ships products with a 3% defect rate. In a shipment of 200 laptops, find (a) the expected number of defects, (b) the standard deviation, (c) the probability of 10 or more defects.</strong><br><br>(a) $E[X] = 200 \\cdot 0.03 = \\mathbf{6}$ defects expected.<br>(b) $\\sigma = \\sqrt{200 \\cdot 0.03 \\cdot 0.97} = \\sqrt{5.82} \\approx \\mathbf{2.41}$.<br>(c) Normal approximation: $z = (9.5 - 6) / 2.41 \\approx 1.45$ (using continuity correction). $P(Z \\geq 1.45) \\approx \\mathbf{0.0735}$.<br><br>About a 7% chance of 10 or more defects. The manufacturer can budget around 6 returns per shipment.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 &mdash; CLINICAL TRIAL</div><div class="example-body"><strong>A new drug works in 80% of patients. A doctor prescribes it to 15 patients. Find (a) $P(\\text{exactly 12 cures})$, (b) $P(\\text{at least 13 cures})$.</strong><br><br>$X \\sim \\text{Bin}(15, 0.8)$.<br><br>(a) $P(X = 12) = \\binom{15}{12}(0.8)^{12}(0.2)^3 = 455 \\cdot 0.0687 \\cdot 0.008 \\approx \\mathbf{0.2501}$.<br><br>(b) $P(X \\geq 13) = P(X=13) + P(X=14) + P(X=15)$.<br>$P(X=13) = \\binom{15}{13}(0.8)^{13}(0.2)^2 = 105 \\cdot 0.05498 \\cdot 0.04 \\approx 0.2309$.<br>$P(X=14) = \\binom{15}{14}(0.8)^{14}(0.2)^1 = 15 \\cdot 0.04398 \\cdot 0.2 \\approx 0.1319$.<br>$P(X=15) = (0.8)^{15} \\approx 0.0352$.<br>Sum: $\\approx \\mathbf{0.3980}$.<br><br>About 40% chance of 13 or more cures out of 15.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> The binomial is the foundation for a whole family of distributions. The <em>Poisson</em> distribution is the limit when $n \\to \\infty$ and $p \\to 0$ keeping $np$ fixed — perfect for rare events like radioactive decays or website visits. The <em>geometric</em> distribution counts the number of trials until the first success. And as we saw in section 8, for large $n$ the binomial itself becomes approximately normal — the bridge from discrete to continuous probability.</div>

<h2 class="lesson-title">11. Visual Comparison: How Shape Changes with p</h2>

<div class="calc-highlight"><strong>Three binomials side by side, same n = 20, different success probabilities p = 0.1, 0.5, 0.9.</strong> The plot below overlays all three PMFs. Low p pushes mass to the left, high p pushes it to the right, and p = 0.5 sits perfectly centered. The spread (standard deviation $\\sqrt{np(1-p)}$) is also largest in the middle — try moving the mouse over the bars to compare exact probabilities.</div>

<div class="calc-graph"><div id="plot-l100-shape-compare-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three overlaid bar charts for $\\text{Bin}(20, 0.1)$ (blue), $\\text{Bin}(20, 0.5)$ (amber), and $\\text{Bin}(20, 0.9)$ (emerald). The left distribution peaks near $k = 2$, the middle peaks at $k = 10$, and the right peaks near $k = 18$. Note the mirror symmetry: $\\text{Bin}(n, p)$ and $\\text{Bin}(n, 1-p)$ are reflections of each other about $k = n/2$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nX=20;
var xX=[];for(var k=0;k<=nX;k++){xX.push(k);}
var y1=xX.map(function(k){return binProb(nX,k,0.1);});
var y2=xX.map(function(k){return binProb(nX,k,0.5);});
var y3=xX.map(function(k){return binProb(nX,k,0.9);});
var tr1={x:xX,y:y1,type:'bar',name:'Bin(20, 0.1)',marker:{color:'#3b82f6',opacity:0.8,line:{color:'#60a5fa',width:1}}};
var tr2={x:xX,y:y2,type:'bar',name:'Bin(20, 0.5)',marker:{color:'#f59e0b',opacity:0.8,line:{color:'#fbbf24',width:1}}};
var tr3={x:xX,y:y3,type:'bar',name:'Bin(20, 0.9)',marker:{color:'#10b981',opacity:0.8,line:{color:'#34d399',width:1}}};
var layX={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},barmode:'overlay',xaxis:{title:'k (number of successes out of 20)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:50,r:30,b:60,l:70},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l100-shape-compare-en-extra',[tr1,tr2,tr3],layX,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Properties Reference Table</h2>

<div class="calc-highlight"><strong>A one-stop reference for everything we have proved about the binomial.</strong> Each row gives a quantity, its closed-form formula in terms of $n$ and $p$, and a worked example for $X \\sim \\text{Bin}(20, 0.3)$ (mean 6, variance 4.2, std dev about 2.05). Keep this table handy as you work through the exercises.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:#e8e8e8;font-size:0.92rem;border:1px solid rgba(59,130,246,0.25)">
<thead>
<tr style="background:rgba(59,130,246,0.12);border-bottom:2px solid #3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Quantity</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Formula</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Example: Bin(20, 0.3)</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">PMF $P(X = k)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\binom{n}{k} p^k (1-p)^{n-k}$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$P(X = 6) = \\binom{20}{6}(0.3)^6(0.7)^{14} \\approx 0.1916$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.015)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Mean $E[X]$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$20 \\cdot 0.3 = 6$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Variance $\\text{Var}(X)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np(1-p)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$20 \\cdot 0.3 \\cdot 0.7 = 4.2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.015)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Std dev $\\sigma$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\sqrt{np(1-p)}$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\sqrt{4.2} \\approx 2.049$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Mode (most likely $k$)</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\lfloor (n+1)p \\rfloor$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\lfloor 21 \\cdot 0.3 \\rfloor = \\lfloor 6.3 \\rfloor = 6$</td>
</tr>
<tr>
<td style="padding:0.65rem 0.9rem;vertical-align:top">Normal approx. valid when</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np \\geq 10$ AND $n(1-p) \\geq 10$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np = 6 < 10$, so NO &mdash; use exact PMF</td>
</tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A Bernoulli trial is a single experiment with two outcomes and success probability $p$</li>
<li>A binomial $X \\sim \\text{Bin}(n, p)$ counts successes in $n$ independent Bernoulli$(p)$ trials</li>
<li>Four conditions: fixed n, two outcomes, constant p, independence</li>
<li>Master formula: $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$ for $k = 0, 1, \\ldots, n$</li>
<li>Mean $E[X] = np$, variance $np(1-p)$, std dev $\\sqrt{np(1-p)}$</li>
<li>Shape: symmetric if $p = 0.5$, right-skewed if $p < 0.5$, left-skewed if $p > 0.5$</li>
<li>Cumulative: $P(X \\leq k)$ is a sum; use complement for "at least"</li>
<li>For large $n$ (and $np, n(1-p) \\geq 10$) the binomial is approximately Normal$(np, \\sqrt{np(1-p)})$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Hilesiz bir parayı on kez at. Kaç tura beklersin?</strong> Beş, açıkça — peki gerçekten tam olarak beş turayı ne sıklıkla elde edersin? Zamanın yarısında mı? Daha çok mu? Daha az mı? Ve üst üste on tura gelme şansı nedir? Bunlar <em>binom dağılımının</em> cevapladığı sorulardır. Temel istatistikteki en önemli ayrık olasılık dağılımıdır ve bir kez anladığında, gerçek dünyadaki çok geniş bir durum yelpazesi — kalite kontrolü, kamuoyu araştırmaları, serbest atış, çoktan seçmeli sınavlar, klinik denemeler — basit aritmetiğe dönüşür.</p>

<p class="l-text">Bu derste binom dağılımını çok küçük bir bileşenden (<em>Bernoulli denemesi</em>: iki sonuçlu tek bir deney) inşa ediyoruz, bunun n kopyasını üst üste koyarak binom rastgele değişkeni elde ediyoruz ve k başarı elde etme olasılığının tam formülünü türetiyoruz. Sonra ortalama ve varyansı hesaplıyoruz, dağılımın şeklini inceliyoruz ve sonucu birkaç gerçekçi probleme uyguluyoruz. Ders sonunda, sabit başarı olasılığı p kullanan herhangi bir "n denemede kaç başarı" sorusunu cevaplayabileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bernoulli denemesi tanımlamayı ve binom kurulumunun dört koşulunu (sabit n, iki sonuç, sabit p, bağımsızlık) tanımayı</li>
<li>Binom olasılık formülü $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$ ile tam olasılık hesaplamayı</li>
<li>Binom rastgele değişkeninin ortalamasını $E[X] = np$ ve varyansını $\\text{Var}(X) = np(1-p)$ hesaplamayı</li>
<li>p değiştikçe dağılımın şeklinin nasıl değiştiğini açıklamayı (simetrik, sağa çarpık, sola çarpık)</li>
<li>Yığmalı olasılıkları hesaplamayı: $P(X \\leq k)$, $P(X \\geq k)$ ve $P(a \\leq X \\leq b)$</li>
<li>Büyük n için binomun normal dağılımla yaklaşılabileceğini tanımayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Bernoulli Denemesi: Tek Bir Evet/Hayır Deneyi</h2>

<div class="calc-highlight"><strong>Tüm olasılığın atomu, tam olarak iki sonucu olan tek bir deneydir.</strong> Para at, tura ya da yazı görürsün. Serbest atış yap, ya skor yaparsın ya kaçırırsın. Bir fabrikadan tek bir ürün incele, ya kusurludur ya değildir. Bu iki sonuçlu deneylere, sistemli olarak ilk inceleyen Jacob Bernoulli'nin (1654&ndash;1705) adıyla <em>Bernoulli denemeleri</em> denir.</div>

<p class="l-text">Matematiksel olarak, bir <strong>Bernoulli denemesi</strong> aşağıdaki yapıya sahip herhangi bir rastgele deneydir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki sonuç</div><div class="card-body">Tam olarak iki olası sonuç, geleneksel olarak <em>başarı</em> ve <em>başarısızlık</em> olarak adlandırılır. Etiketler keyfidir — "başarı", saydığımız sonuçtan başka bir şey değildir.</div></div>
<div class="calc-card"><div class="card-title">Başarı olasılığı p</div><div class="card-body">Başarı olasılığı sabit bir sayı $p$ olup $0 \\leq p \\leq 1$. O halde başarısızlık olasılığı $1-p$'dir (sıklıkla $q$ olarak yazılır).</div></div>
<div class="calc-card"><div class="card-title">Tek deneme</div><div class="card-body">Deneyi <em>bir kez</em> çalıştırırız. Sonuç, p olasılığıyla 1 (başarı) ve $1-p$ olasılığıyla 0 (başarısızlık) değerini alan bir rastgele değişkendir.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BERNOULLI RASTGELE DEĞİŞKENİ</div><div class="formula-main">$$X \\sim \\text{Bernoulli}(p) \\;\\Longleftrightarrow\\; P(X=1) = p, \\quad P(X=0) = 1-p$$</div><div class="formula-sub">Ortalama: $E[X] = p$. Varyans: $\\text{Var}(X) = p(1-p)$.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">Hilesiz bir para atışı, $p = 0.5$ olan bir Bernoulli denemesidir. İki sonuç turadır (başarı) ve yazıdır (başarısızlık). %70 isabet oranına sahip bir oyuncunun serbest atışı, $p = 0.7$ olan bir Bernoulli denemesidir. İki sonuç başarılıdır (başarı) ve kaçırılmıştır (başarısızlık). %2 kusur oranı olan bir fabrikadan bir ürünü incelemek, kusurluyu başarı sayarsak, $p = 0.02$ olan bir Bernoulli denemesidir.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bunlardan hangileri Bernoulli denemesidir? (a) Zar atmak. (b) Zar atıp 6 gelip gelmediğini kaydetmek. (c) Desteden bir kart çekmek. (d) Bir kart çekip kupa olup olmadığını kontrol etmek. Cevaplar: (b) ve (d) sırasıyla $p = 1/6$ ve $p = 1/4$ olan Bernoulli denemeleridir. (a) ve (c) ikiden fazla sonuca sahiptir — ancak sonuçları iki kategoriye gruplayınca Bernoulli denemesi haline gelirler.</div></div>

<h2 class="lesson-title">2. Binom Kurulumu: Bernoulli Denemelerini Üst Üste Koymak</h2>

<div class="calc-highlight"><strong>Aynı Bernoulli denemesini n kez ardarda yap, başarıları say ve binom rastgele değişkenine sahip olursun.</strong> Toplam sayı binomdur. 0'dan (hiç başarı yok) n'e (hepsi başarı) kadar tamsayı değerleri alır.</div>

<p class="l-text">Binom formülünün uygulanabilmesi için dört koşul sağlanmalıdır. Bunları ezberle — binomu kullanabileceğin ve kullanamayacağın problemleri ayıran sınırdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Sabit deneme sayısı</div><div class="card-body">Tam olarak $n$ deneme yaparız, $n$ önceden kararlaştırılmıştır ("bir şey olana kadar" değil).</div></div>
<div class="calc-card"><div class="card-title">2. Her denemede iki sonuç</div><div class="card-body">Her deneme aynı başarı tanımıyla bir Bernoulli denemesidir.</div></div>
<div class="calc-card"><div class="card-title">3. Sabit başarı olasılığı</div><div class="card-body">Başarı olasılığı $p$ her deneme için aynıdır.</div></div>
<div class="calc-card"><div class="card-title">4. Bağımsızlık</div><div class="card-body">Bir denemenin sonucu diğer bir denemenin sonucunu etkilemez.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">BİNOM RASTGELE DEĞİŞKENİ</div><div class="formula-main">$$X \\sim \\text{Bin}(n, p) \\;:\\; n \\text{ bagimsiz Bernoulli}(p) \\text{ denemesindeki basari sayisi}$$</div><div class="formula-sub">$X$, $0, 1, 2, \\ldots, n$ değerlerini alır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">Hilesiz bir parayı 10 kez at. Tura sayısı $X$, $n = 10$ ve $p = 0.5$ ile binomdur. $X \\sim \\text{Bin}(10, 0.5)$ yaz. %70 isabet oranıyla 8 serbest atış yap. Kazandığın sayı $X \\sim \\text{Bin}(8, 0.7)$. %2 kusur oranlı bir üretim hattından 100 ürün incele. Kusurlu sayısı $X \\sim \\text{Bin}(100, 0.02)$.</div></div>

<div class="l-note"><strong>Binomun uygulanmadığı yerler:</strong> Yerine koymadan desteden 5 kart çekmek. Neden? Çünkü her karttan sonra kupa çekme olasılığı değişir — bağımsızlık bozulur ve p sabit değildir. Bu durum için <em>hipergeometrik</em> dağılıma ihtiyacımız var (gelecekteki bir derste anlatılacak).</div>

<h2 class="lesson-title">3. Binom Olasılık Formülü</h2>

<div class="calc-highlight"><strong>İşte bu dersin ana formülü:</strong> $X \\sim \\text{Bin}(n, p)$ ise, $n$ denemede tam $k$ başarı elde etme olasılığı</div>

<div class="calc-formula"><div class="formula-label">BİNOM OLASILIK FONKSİYONU</div><div class="formula-main">$$P(X = k) \\;=\\; \\binom{n}{k} p^k (1-p)^{n-k} \\qquad k = 0, 1, 2, \\ldots, n$$</div><div class="formula-sub">$\\binom{n}{k}$, $n$ denemenin hangi $k$ tanesinin başarı olduğunu seçmenin yollarının sayısıdır. $p^k$, o $k$ denemenin tümünün başarılı olma olasılığıdır. $(1-p)^{n-k}$, kalan $n-k$ denemenin tümünün başarısız olma olasılığıdır.</div></div>

<p class="l-text"><strong>Bu formül nereden geliyor?</strong> Birbirleriyle çarpılan üç parça:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\binom{n}{k}$ &mdash; dizilim sayısı</div><div class="card-body">$k$ başarı ve $n-k$ başarısızlığın görünebileceği $\\binom{n}{k}$ farklı sıralama vardır. Tam 5 turalı 10 para atışı için, turalar $\\{1,2,3,4,5\\}$ veya $\\{1,2,3,4,6\\}$ veya ... denemelerde olabilir — toplamda $\\binom{10}{5} = 252$ dizilim.</div></div>
<div class="calc-card"><div class="card-title">$p^k$ &mdash; başarıların olasılığı</div><div class="card-body">Bu sıralamalardan herhangi biri için, seçilen $k$ denemenin tümünün başarılı olma olasılığı $p \\cdot p \\cdots p = p^k$'dir (bağımsızlık nedeniyle).</div></div>
<div class="calc-card"><div class="card-title">$(1-p)^{n-k}$ &mdash; başarısızlık olasılığı</div><div class="card-body">Kalan $n-k$ denemenin tümünün başarısız olma olasılığı $(1-p)(1-p)\\cdots(1-p) = (1-p)^{n-k}$.</div></div>
</div>

<p class="l-text">Her sıralama, $p^k (1-p)^{n-k}$ olasılıklı ayrık bir olaydır. $\\binom{n}{k}$ tane vardır. Olasılıkları topla ve formülü elde edersin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; HİLESİZ PARA</div><div class="example-body">On hilesiz para atışı. $P(\\text{tam 5 tura})$ değerini bul.<br><br>$n = 10$, $k = 5$, $p = 0.5$, $1 - p = 0.5$.<br><br>$P(X = 5) = \\binom{10}{5} (0.5)^5 (0.5)^5 = 252 \\cdot (0.5)^{10} = 252 / 1024 \\approx \\mathbf{0.2461}$.<br><br>Yani zamanın yaklaşık %24.6'sında tam beş tura elde edersin. Bunun yarıdan çok daha az olduğuna dikkat et — beş tura tek başına en olası sonuçtur, ama yine de yalnızca 4 denemede 1 görülür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; HEPSİ TURA</div><div class="example-body">On hilesiz para atışı. $P(\\text{tam 10 tura})$ değerini bul.<br><br>$n = 10$, $k = 10$, $p = 0.5$.<br><br>$P(X = 10) = \\binom{10}{10} (0.5)^{10} (0.5)^0 = 1 \\cdot (0.5)^{10} \\cdot 1 = 1/1024 \\approx \\mathbf{0.000977}$.<br><br>1024'te 1 — kabaca her bin on-atışlık dizide bir kez.</div></div>

<h2 class="lesson-title">4. Binomun Ortalaması ve Varyansı</h2>

<div class="calc-highlight"><strong>Binomun çok güzel basit iki özet istatistiği vardır.</strong> Ortalama $np$ — sezginin tam olarak öngördüğü şey. Varyans $np(1-p)$, $p = 0.5$ olduğunda en büyüktür ve uç noktalarda $p = 0$ ya da $p = 1$ olduğunda sıfıra düşer.</div>

<div class="calc-formula"><div class="formula-label">ORTALAMA, VARYANS, STANDART SAPMA</div><div class="formula-main">$$E[X] = np \\qquad \\text{Var}(X) = np(1-p) \\qquad \\sigma_X = \\sqrt{np(1-p)}$$</div><div class="formula-sub">$X \\sim \\text{Bin}(n, p)$. Bunlar, binomun $n$ bağımsız Bernoulli$(p)$ değişkeninin toplamı olmasından kaynaklanır: ortalamalar toplanır, varyanslar da (bağımsızken) toplanır.</div></div>

<p class="l-text"><strong>Ortalamanın neden $np$ olduğu.</strong> $X = X_1 + X_2 + \\cdots + X_n$ yaz, burada her $X_i$, $i$. denemenin Bernoulli sonucudur. Her $X_i$ ortalama $p$'ye sahiptir. Beklentinin doğrusallığı nedeniyle $E[X] = E[X_1] + \\cdots + E[X_n] = np$.</p>

<p class="l-text"><strong>Varyansın neden $np(1-p)$ olduğu.</strong> Her Bernoulli $X_i$ varyansı $p(1-p)$'dir (doğrulayabilirsin: $E[X_i^2] = p$, dolayısıyla $\\text{Var}(X_i) = p - p^2 = p(1-p)$). Denemeler bağımsız olduğu için varyanslar toplanır: $\\text{Var}(X) = np(1-p)$.</p>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">$X \\sim \\text{Bin}(100, 0.3)$ için:<br><br>Ortalama: $E[X] = 100 \\cdot 0.3 = 30$.<br>Varyans: $\\text{Var}(X) = 100 \\cdot 0.3 \\cdot 0.7 = 21$.<br>Standart sapma: $\\sigma_X = \\sqrt{21} \\approx 4.58$.<br><br>Yorum: %30 başarı oranıyla 100 denemede yaklaşık 30 başarı bekle, artı eksi 4 ya da 5. Ampirik kural sonuçların yaklaşık %95'inin $[30 - 2 \\cdot 4.58, 30 + 2 \\cdot 4.58] = [20.84, 39.16]$ aralığında — yani yaklaşık 21 ile 39 arasında — düştüğünü söyler.</div></div>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">400 kez atılan hilesiz para: beklenen tura $= 400 \\cdot 0.5 = 200$; standart sapma $= \\sqrt{400 \\cdot 0.5 \\cdot 0.5} = \\sqrt{100} = 10$. Yani genellikle 200 tura görürsün, artı eksi 10. 250 tura elde etmek (5 standart sapma uzakta) astronomik düzeyde olasılıksız olur.</div></div>

<h2 class="lesson-title">5. Dağılımın Şekli</h2>

<div class="calc-highlight"><strong>Binomun şekli tamamen p'ye bağlıdır.</strong> $p = 0.5$ olduğunda simetrik, $p < 0.5$ olduğunda sağa çarpık (uzun kuyruk büyük değerlere doğru), $p > 0.5$ olduğunda sola çarpık (uzun kuyruk küçük değerlere doğru). Yeterince büyük $n$ için üçü de çan şekline sahiptir.</div>

<div class="calc-graph"><div id="plot-l100-symmetric-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\text{Bin}(10, 0.5)$'in olasılık fonksiyonu. Mükemmel simetriye dikkat et: $P(X=k) = P(X=10-k)$. Tepe noktası $k = 5$'te yaklaşık 0.246 olasılıkla. Uç noktaların olasılıkları ($k = 0$ ya da $k = 10$) çok küçüktür — her ikisi de yaklaşık 0.001.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nAt=10,pAt=0.5;var xAt=[];var yAt=[];for(var k=0;k<=nAt;k++){xAt.push(k);yAt.push(binProb(nAt,k,pAt));}
var trAt={x:xAt,y:yAt,type:'bar',name:'Bin(10, 0.5)',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}}};
var layAt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (basari sayisi)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},showlegend:false};
Plotly.newPlot('plot-l100-symmetric-tr',[trAt],layAt,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l100-skewed-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\text{Bin}(10, 0.2)$. Tepe noktası sola, $k = 2$'ye kayar (beklenen değer $np = 2$) ve dağılım sağa eğilir: büyük $k$ için küçük şans, küçük $k$ için çok büyük şans. Buna <em>sağa çarpık</em> denir çünkü uzun kuyruk sağa işaret eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nBt=10,pBt=0.2;var xBt=[];var yBt=[];for(var k=0;k<=nBt;k++){xBt.push(k);yBt.push(binProb(nBt,k,pBt));}
var trBt={x:xBt,y:yBt,type:'bar',name:'Bin(10, 0.2)',marker:{color:'#3b82f6',line:{color:'#60a5fa',width:1}}};
var layBt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k (basari sayisi)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},showlegend:false};
Plotly.newPlot('plot-l100-skewed-tr',[trBt],layBt,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Simetri kuralı:</strong> $\\text{Bin}(n, p)$ binomu, ancak ve ancak $p = 0.5$ ise simetriktir. Diğer her $p$ için çarpıklık vardır. $n$ büyüdükçe, çarpık binomlar bile çan şeklinde görünmeye başlar — bu, 8. bölümdeki normal yaklaşımına giden yoldur.</p>

<h2 class="lesson-title">6. Yığmalı Olasılıklar</h2>

<div class="calc-highlight"><strong>Çoğu zaman, tek bir spesifik değerin değil, sonuçların bir <em>aralığının</em> olasılığını isteriz.</strong> "En fazla 3 kusur" $P(X \\leq 3)$ demektir. "En az 6 serbest atış başarılı" $P(X \\geq 6)$ demektir. Bunlar <em>yığmalı olasılıklardır</em> ve binom olasılıklarının toplamlarıdır.</div>

<div class="calc-formula"><div class="formula-label">YIĞMALI BİNOM OLASILIKLARI</div><div class="formula-main">$$P(X \\leq k) = \\sum_{i=0}^{k} \\binom{n}{i} p^i (1-p)^{n-i}$$</div><div class="formula-sub">"En az k" için tümleyeni kullan: $P(X \\geq k) = 1 - P(X \\leq k-1)$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">En fazla k</div><div class="card-body">$P(X \\leq k) = P(X=0) + P(X=1) + \\cdots + P(X=k)$</div></div>
<div class="calc-card"><div class="card-title">En az k</div><div class="card-body">$P(X \\geq k) = P(X=k) + P(X=k+1) + \\cdots + P(X=n) = 1 - P(X \\leq k-1)$</div></div>
<div class="calc-card"><div class="card-title">a ile b arası</div><div class="card-body">$P(a \\leq X \\leq b) = P(X \\leq b) - P(X \\leq a-1)$</div></div>
</div>

<div class="l-note"><strong>Yaygın hata:</strong> "5'ten fazla" ile "en az 5"i karıştırmak. "5'ten fazla" $X > 5$, yani $X \\geq 6$ demektir, dolayısıyla $P(X \\geq 6)$. "En az 5" $X \\geq 5$ demektir, dolayısıyla $P(X \\geq 5)$. Aralıkları hesaplamadan önce her zaman $\\leq$ ve $\\geq$ kullanarak dikkatlice yeniden yaz.</div>

<h2 class="lesson-title">7. Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 &mdash; SERBEST ATIŞLAR</div><div class="example-body">Bir basketbol oyuncusu serbest atışlarının %70'ini kazanır. 8 serbest atış denemesi yapar. En az 6'yı kazanma olasılığı olan $P(X \\geq 6)$ değerini bul.<br><br>$X \\sim \\text{Bin}(8, 0.7)$. $P(X = 6) + P(X = 7) + P(X = 8)$ istiyoruz.<br><br>$P(X=6) = \\binom{8}{6}(0.7)^6(0.3)^2 = 28 \\cdot 0.117649 \\cdot 0.09 \\approx 0.2965$.<br>$P(X=7) = \\binom{8}{7}(0.7)^7(0.3)^1 = 8 \\cdot 0.082354 \\cdot 0.3 \\approx 0.1977$.<br>$P(X=8) = \\binom{8}{8}(0.7)^8(0.3)^0 = 1 \\cdot 0.057648 \\cdot 1 \\approx 0.0576$.<br><br>Toplam: $0.2965 + 0.1977 + 0.0576 \\approx \\mathbf{0.5518}$.<br><br>Yani 8 atışın en az 6'sını yaklaşık %55 oranında kazanır. Beklenen değerin $np = 8 \\cdot 0.7 = 5.6$ olduğuna dikkat et; dolayısıyla 6, ortalamanın hemen üstündedir — bu da onu hafifçe daha olası kılar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 &mdash; KÖRLEMESİNE TAHMİN</div><div class="example-body">12 soruluk çoktan seçmeli bir testin her sorusunda 4 seçenek var, sadece biri doğru. Bir öğrenci her soruyu körlemesine tahmin ediyor. $P(\\text{en az 4 dogru})$ olasılığını bul.<br><br>$X \\sim \\text{Bin}(12, 0.25)$. $P(X \\geq 4)$ istiyoruz.<br><br>Tümleyeni kullan: $P(X \\geq 4) = 1 - P(X \\leq 3)$.<br><br>$P(X=0) = \\binom{12}{0}(0.25)^0(0.75)^{12} \\approx 0.0317$.<br>$P(X=1) = \\binom{12}{1}(0.25)^1(0.75)^{11} \\approx 0.1267$.<br>$P(X=2) = \\binom{12}{2}(0.25)^2(0.75)^{10} \\approx 0.2323$.<br>$P(X=3) = \\binom{12}{3}(0.25)^3(0.75)^{9} \\approx 0.2581$.<br><br>$P(X \\leq 3) \\approx 0.0317 + 0.1267 + 0.2323 + 0.2581 \\approx 0.6488$.<br><br>$P(X \\geq 4) \\approx 1 - 0.6488 \\approx \\mathbf{0.3512}$.<br><br>Kabaca %35. Salt tahmin, 12 soruda 4 ya da daha fazla doğru cevabı yaklaşık her üç testten birinde üretir — kısa testlerde önemli olabilecek kadar yüksek, makul bir geçme barajını geçemeyecek kadar düşük.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 &mdash; KALİTE KONTROLÜ</div><div class="example-body">Bir fabrikanın %5 kusur oranı var. Bir kalite müfettişi 20 ürün örnekliyor. $P(\\text{kusursuz})$ olasılığını bul.<br><br>$X \\sim \\text{Bin}(20, 0.05)$. $P(X = 0)$ istiyoruz.<br><br>$P(X=0) = \\binom{20}{0}(0.05)^0(0.95)^{20} = 1 \\cdot 1 \\cdot (0.95)^{20}$.<br><br>$(0.95)^{20} \\approx 0.3585$.<br><br>Yani $P(X=0) \\approx \\mathbf{0.3585}$ &mdash; muayenelerin yaklaşık %36'sı kusur bulmaz. Düşük kusur oranıyla bile tahmin edebileceğinden daha az, çünkü kusurun ortaya çıkması için 20 şans vardır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 &mdash; AŞI DENEMESİ</div><div class="example-body">Bir aşı, hastalığın önlenmesinde %95 etkili. 50 aşılı kişi virüse maruz kalıyor. Hastalığı KAPMAYANLARIN beklenen sayısı ve standart sapması nedir?<br><br>Başarı = hastalığı kapmama olsun, $p = 0.95$, $n = 50$.<br><br>Ortalama: $E[X] = np = 50 \\cdot 0.95 = \\mathbf{47.5}$.<br>Varyans: $\\text{Var}(X) = np(1-p) = 50 \\cdot 0.95 \\cdot 0.05 = 2.375$.<br>Standart sapma: $\\sigma = \\sqrt{2.375} \\approx \\mathbf{1.54}$.<br><br>Yaklaşık 47 veya 48 kişinin sağlıklı kalmasını bekle, tipik sapma yaklaşık 1.5 kişi. Hemen hemen tüm sonuçlar $[47.5 - 3 \\cdot 1.54, 47.5 + 3 \\cdot 1.54] \\approx [42.9, 52.1]$ aralığında — ve $X \\leq 50$ olduğundan üst uç 50'de sınırlıdır.</div></div>

<h2 class="lesson-title">8. Normal Yaklaşımı (Önizleme)</h2>

<div class="calc-highlight"><strong>Büyük n için, binom çan eğrisine benzer.</strong> Daha kesin olarak, $\\text{Bin}(n, p)$, ortalaması $np$ ve standart sapması $\\sqrt{np(1-p)}$ olan Normal dağılıma yaklaşık olarak eşit olur. Bu, istatistikteki en önemli olgulardan biridir — siyasi anketlerin neden işe yaradığını, kalite kontrol formüllerinin neden bu kadar basit olduğunu ve çan eğrisinin neden her yerde göründüğünü açıklar.</div>

<div class="calc-formula"><div class="formula-label">NORMAL YAKLAŞIM KURALI</div><div class="formula-main">$$np \\geq 10 \\text{ ve } n(1-p) \\geq 10 \\text{ ise } \\text{Bin}(n, p) \\;\\approx\\; \\text{Normal}\\left(np, \\sqrt{np(1-p)}\\right)$$</div><div class="formula-sub">Pratik bir kural: yaklaşımın iyi çalışması için hem $np$ hem de $n(1-p)$ en az 10 olmalıdır.</div></div>

<div class="calc-graph"><div id="plot-l100-normal-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\text{Bin}(20, 0.5)$ çubukları, ortalaması 10 ve standart sapması $\\sqrt{5} \\approx 2.236$ olan Normal yoğunluk eğrisinin yanında. Pürüzsüz çanın ayrık çubuklara ne kadar yakın olduğuna dikkat et. $n = 100$'e ulaştığında eşleşme neredeyse tam olur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var nCt=20,pCt=0.5;var muCt=nCt*pCt,sigCt=Math.sqrt(nCt*pCt*(1-pCt));
var xCt=[];var yCt=[];for(var k=0;k<=nCt;k++){xCt.push(k);yCt.push(binProb(nCt,k,pCt));}
var xCnt=[];var yCnt=[];for(var t=0;t<=400;t++){var v=nCt*t/400;xCnt.push(v);yCnt.push(normPdf(v,muCt,sigCt));}
var barsT={x:xCt,y:yCt,type:'bar',name:'Bin(20, 0.5)',marker:{color:'#3b82f6',opacity:0.85,line:{color:'#60a5fa',width:1}}};
var curveT={x:xCnt,y:yCnt,mode:'lines',name:'Normal(10, 2.236)',line:{color:'#f59e0b',width:2.8}};
var layCt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'k',range:[0,20],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k) ve yogunluk',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l100-normal-tr',[barsT,curveT],layCt,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">(1-p)'yi unutmak</div><div class="card-body">$P(X=k) = \\binom{n}{k} p^k$ yazıp $(1-p)^{n-k}$ çarpanını eklememek. Tam formülde HER İKİ çarpan vardır — başarılar $p^k$ verir ve başarısızlıklar $(1-p)^{n-k}$ verir.</div></div>
<div class="calc-card"><div class="card-title">$X=k$ ile $X \\leq k$'yi karıştırmak</div><div class="card-body">"En fazla 5" $k=0, 1, 2, 3, 4, 5$ değerlerini içerir — bu altı olasılığın toplamıdır, tek bir tane değil. "Tam olarak", "en fazla" veya "en az" kullanılıp kullanılmadığını görmek için problemi her zaman yeniden oku.</div></div>
<div class="calc-card"><div class="card-title">Yığmalı bir-eksik hatası</div><div class="card-body">$P(X \\geq 6) \\neq 1 - P(X \\leq 6)$. Doğru tümleyen $P(X \\geq 6) = 1 - P(X \\leq 5)$'tir. Dikkat: "en az 6", 5'i hariç tutar, dolayısıyla yığmalı eşik 5'tir.</div></div>
<div class="calc-card"><div class="card-title">Bağımsızlık kontrolünü unutmak</div><div class="card-body">Yerine koymadan örnekleme bağımsızlığı bozar. 52'li desteden 5 kart çekmek binom DEĞİLDİR. Formülü uygulamadan önce her zaman p'nin sabit kaldığını ve denemelerin birbirini etkilemediğini doğrula.</div></div>
</div>

<h2 class="lesson-title">10. Alıştırma Problemleri</h2>

<p class="l-text">Çözümü okumadan önce her problemi kendin dene. İlk üçü kısa; son üçü gerçekçi uygulama problemleri.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body"><strong>Hilesiz bir zar 6 kez atılır. Tam 2 kez 6 gelme olasılığını bul.</strong><br><br>Her atış, başarı = "6 atma" olan Bernoulli denemesi, dolayısıyla $p = 1/6$. $X \\sim \\text{Bin}(6, 1/6)$.<br><br>$P(X = 2) = \\binom{6}{2}(1/6)^2(5/6)^4 = 15 \\cdot \\dfrac{1}{36} \\cdot \\dfrac{625}{1296} = \\dfrac{15 \\cdot 625}{36 \\cdot 1296} = \\dfrac{9375}{46656} \\approx \\mathbf{0.2009}$.<br><br>Yaklaşık %20.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body"><strong>$X \\sim \\text{Bin}(50, 0.4)$'ın ortalamasını ve varyansını bul.</strong><br><br>$E[X] = np = 50 \\cdot 0.4 = \\mathbf{20}$.<br>$\\text{Var}(X) = np(1-p) = 50 \\cdot 0.4 \\cdot 0.6 = \\mathbf{12}$.<br>$\\sigma_X = \\sqrt{12} \\approx 3.46$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body"><strong>Hileli bir parada $P(\\text{tura}) = 0.6$. 5 kez at. $P(\\text{en az bir tura})$ değerini bul.</strong><br><br>Tümleyeni kullanmak daha kolay: $P(X \\geq 1) = 1 - P(X = 0)$.<br><br>$P(X = 0) = (0.4)^5 = 0.01024$.<br><br>$P(X \\geq 1) = 1 - 0.01024 \\approx \\mathbf{0.9898}$.<br><br>Neredeyse kesin — 5 atışta sıfır tura ihtimali yalnızca %1.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; KAMUOYU YOKLAMASI</div><div class="example-body"><strong>Bir anket 100 kişiye bir politikayı destekleyip desteklemediğini soruyor. Nüfusun gerçek %60'ı onu destekliyor. $P(\\text{en fazla 55 evet})$ olasılığını bul.</strong><br><br>$X \\sim \\text{Bin}(100, 0.6)$. $P(X \\leq 55)$ istiyoruz.<br><br>Ortalama: $\\mu = 60$. Standart sapma: $\\sigma = \\sqrt{100 \\cdot 0.6 \\cdot 0.4} = \\sqrt{24} \\approx 4.90$.<br><br>Normal yaklaşımı kullan: $z = (55 - 60)/4.90 \\approx -1.02$'ye standartlaştır.<br><br>$P(Z \\leq -1.02) \\approx \\mathbf{0.154}$.<br><br>Yaklaşık %15. Yani nüfusun %60'ı lehte olsa bile, anketin 55 veya daha az olarak az sayım yapma şansı %15'tir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; ÜRÜN GARANTİSİ</div><div class="example-body"><strong>Bir dizüstü üreticisi %3 kusur oranıyla ürün gönderiyor. 200 dizüstü bilgisayarlık bir sevkıyatta (a) beklenen kusur sayısını, (b) standart sapmayı, (c) 10 ya da daha fazla kusur olasılığını bul.</strong><br><br>(a) $E[X] = 200 \\cdot 0.03 = \\mathbf{6}$ kusur beklenir.<br>(b) $\\sigma = \\sqrt{200 \\cdot 0.03 \\cdot 0.97} = \\sqrt{5.82} \\approx \\mathbf{2.41}$.<br>(c) Normal yaklaşımı: $z = (9.5 - 6) / 2.41 \\approx 1.45$ (süreklilik düzeltmesi kullanılarak). $P(Z \\geq 1.45) \\approx \\mathbf{0.0735}$.<br><br>Yaklaşık %7 olasılıkla 10 ya da daha fazla kusur. Üretici, sevkıyat başına yaklaşık 6 iade için bütçe ayırabilir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KLİNİK DENEME</div><div class="example-body"><strong>Yeni bir ilaç hastaların %80'inde işe yarar. Bir doktor 15 hastaya yazıyor. (a) $P(\\text{tam 12 iyilesme})$, (b) $P(\\text{en az 13 iyilesme})$ olasılıklarını bul.</strong><br><br>$X \\sim \\text{Bin}(15, 0.8)$.<br><br>(a) $P(X = 12) = \\binom{15}{12}(0.8)^{12}(0.2)^3 = 455 \\cdot 0.0687 \\cdot 0.008 \\approx \\mathbf{0.2501}$.<br><br>(b) $P(X \\geq 13) = P(X=13) + P(X=14) + P(X=15)$.<br>$P(X=13) = \\binom{15}{13}(0.8)^{13}(0.2)^2 = 105 \\cdot 0.05498 \\cdot 0.04 \\approx 0.2309$.<br>$P(X=14) = \\binom{15}{14}(0.8)^{14}(0.2)^1 = 15 \\cdot 0.04398 \\cdot 0.2 \\approx 0.1319$.<br>$P(X=15) = (0.8)^{15} \\approx 0.0352$.<br>Toplam: $\\approx \\mathbf{0.3980}$.<br><br>15 hastanın 13 ya da daha fazlasının iyileşme olasılığı yaklaşık %40.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Binom, tüm bir dağılım ailesinin temelidir. <em>Poisson</em> dağılımı, $np$ sabit tutulurken $n \\to \\infty$ ve $p \\to 0$ olduğunda binomun limitidir — radyoaktif bozunma ya da web sitesi ziyaretleri gibi nadir olaylar için mükemmel. <em>Geometrik</em> dağılım, ilk başarıya kadar gereken deneme sayısını sayar. Ve 8. bölümde gördüğümüz gibi, büyük $n$ için binom kendisi de yaklaşık olarak normal hale gelir — ayrık olasılıktan sürekli olasılığa giden köprü.</div>

<h2 class="lesson-title">11. Görsel Karşılaştırma: p Değiştikçe Şekil Nasıl Değişir</h2>

<div class="calc-highlight"><strong>Aynı n = 20 ile üç farklı başarı olasılığı p = 0.1, 0.5, 0.9 için üç binom yan yana.</strong> Aşağıdaki grafik üçünün de olasılık fonksiyonunu üst üste bindiriyor. Düşük p kütleyi sola iter, yüksek p sağa iter ve p = 0.5 tam ortada durur. Yayılım (standart sapma $\\sqrt{np(1-p)}$) da ortada en büyüktür — fareyi çubukların üzerine getirerek tam olasılıkları karşılaştırabilirsin.</div>

<div class="calc-graph"><div id="plot-l100-shape-compare-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\text{Bin}(20, 0.1)$ (mavi), $\\text{Bin}(20, 0.5)$ (kehribar) ve $\\text{Bin}(20, 0.9)$ (zümrüt) için üst üste bindirilmiş üç çubuk grafiği. Soldaki dağılım tepe noktasını $k = 2$ civarına, ortadaki $k = 10$'a, sağdaki ise $k = 18$ civarına koyar. Ayna simetrisine dikkat et: $\\text{Bin}(n, p)$ ve $\\text{Bin}(n, 1-p)$, $k = n/2$ etrafında birbirinin yansımasıdır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function binCoef(n,k){if(k<0||k>n)return 0;if(k===0||k===n)return 1;k=Math.min(k,n-k);var c=1;for(var i=0;i<k;i++){c=c*(n-i)/(i+1);}return c;}
function binProb(n,k,p){return binCoef(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);}
var nXt=20;
var xXt=[];for(var k=0;k<=nXt;k++){xXt.push(k);}
var y1t=xXt.map(function(k){return binProb(nXt,k,0.1);});
var y2t=xXt.map(function(k){return binProb(nXt,k,0.5);});
var y3t=xXt.map(function(k){return binProb(nXt,k,0.9);});
var tr1t={x:xXt,y:y1t,type:'bar',name:'Bin(20, 0.1)',marker:{color:'#3b82f6',opacity:0.8,line:{color:'#60a5fa',width:1}}};
var tr2t={x:xXt,y:y2t,type:'bar',name:'Bin(20, 0.5)',marker:{color:'#f59e0b',opacity:0.8,line:{color:'#fbbf24',width:1}}};
var tr3t={x:xXt,y:y3t,type:'bar',name:'Bin(20, 0.9)',marker:{color:'#10b981',opacity:0.8,line:{color:'#34d399',width:1}}};
var layXt={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},barmode:'overlay',xaxis:{title:'k (20 denemedeki basari sayisi)',dtick:1,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'P(X = k)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:50,r:30,b:60,l:70},legend:{orientation:'h',y:1.1,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l100-shape-compare-tr-extra',[tr1t,tr2t,tr3t],layXt,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Özellikler Referans Tablosu</h2>

<div class="calc-highlight"><strong>Binom hakkında ispatladığımız her şey için tek-sayfalık bir referans.</strong> Her satır bir niceliği, bunun $n$ ve $p$ cinsinden kapalı formdaki formülünü ve $X \\sim \\text{Bin}(20, 0.3)$ için bir çözümlü örneğini verir (ortalama 6, varyans 4.2, standart sapma yaklaşık 2.05). Alıştırmaları çalışırken bu tabloyu el altında tut.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;background:#0a0a0a;color:#e8e8e8;font-size:0.92rem;border:1px solid rgba(59,130,246,0.25)">
<thead>
<tr style="background:rgba(59,130,246,0.12);border-bottom:2px solid #3b82f6">
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Nicelik</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Formül</th>
<th style="padding:0.7rem 0.9rem;text-align:left;font-weight:700;color:#3b82f6;letter-spacing:0.04em">Örnek: Bin(20, 0.3)</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Olasılık fonksiyonu $P(X = k)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\binom{n}{k} p^k (1-p)^{n-k}$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$P(X = 6) = \\binom{20}{6}(0.3)^6(0.7)^{14} \\approx 0.1916$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.015)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Ortalama $E[X]$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$20 \\cdot 0.3 = 6$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Varyans $\\text{Var}(X)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np(1-p)$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$20 \\cdot 0.3 \\cdot 0.7 = 4.2$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.015)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Standart sapma $\\sigma$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\sqrt{np(1-p)}$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\sqrt{4.2} \\approx 2.049$</td>
</tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
<td style="padding:0.65rem 0.9rem;vertical-align:top">Mod (en olası $k$)</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\lfloor (n+1)p \\rfloor$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$\\lfloor 21 \\cdot 0.3 \\rfloor = \\lfloor 6.3 \\rfloor = 6$</td>
</tr>
<tr>
<td style="padding:0.65rem 0.9rem;vertical-align:top">Normal yaklaşımı geçerli olduğunda</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np \\geq 10$ VE $n(1-p) \\geq 10$</td>
<td style="padding:0.65rem 0.9rem;vertical-align:top">$np = 6 < 10$, dolayısıyla HAYIR &mdash; tam PMF kullan</td>
</tr>
</tbody>
</table>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bernoulli denemesi, iki sonuçlu ve başarı olasılığı $p$ olan tek bir deneydir</li>
<li>Binom $X \\sim \\text{Bin}(n, p)$, $n$ bağımsız Bernoulli$(p)$ denemesindeki başarı sayısını sayar</li>
<li>Dört koşul: sabit n, iki sonuç, sabit p, bağımsızlık</li>
<li>Ana formül: $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$, $k = 0, 1, \\ldots, n$ için</li>
<li>Ortalama $E[X] = np$, varyans $np(1-p)$, standart sapma $\\sqrt{np(1-p)}$</li>
<li>Şekil: $p = 0.5$ ise simetrik, $p < 0.5$ ise sağa çarpık, $p > 0.5$ ise sola çarpık</li>
<li>Yığmalı: $P(X \\leq k)$ bir toplamdır; "en az" için tümleyen kullan</li>
<li>Büyük $n$ için (ve $np, n(1-p) \\geq 10$) binom yaklaşık olarak Normal$(np, \\sqrt{np(1-p)})$'dur</li>
</ul>
</div>`
};
