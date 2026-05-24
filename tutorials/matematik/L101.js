window.LISE_MAT_L101 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Roll a fair die a thousand times and add the numbers up. What do you get?</strong> Not 6 (the largest face) nor 1 (the smallest), but something close to 3500 — about 3.5 per roll, on average. That number 3.5 is the <em>expected value</em> of the die, and it never actually appears on any face. The expected value is not a prediction of any single outcome; it is the long-run average we expect when the same experiment is repeated again and again. This lesson turns that intuition into a precise definition, then asks a second question: <em>how much do the outcomes spread around the average?</em> The answer to that is the <em>variance</em>.</p>

<p class="l-text">By the end of this lesson, you will be able to compute the expected value of any discrete random variable from a probability mass function, use linearity of expectation to break complicated sums into easy pieces, compute variance two different ways and verify they agree, decide whether a game or a bet is fair using expected value, and interpret standard deviation as a "typical distance from the mean." These four skills — average, spread, fairness, typical deviation — are the bedrock of every statistical argument you will ever read.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define a discrete random variable and write down its probability mass function (PMF)</li>
<li>Compute the expected value $E[X] = \\sum x_i \\, P(X = x_i)$ as a weighted average of outcomes</li>
<li>Use linearity $E[aX + bY] = aE[X] + bE[Y]$ to short-cut messy direct sums</li>
<li>Compute variance via $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - \\mu^2$</li>
<li>Interpret standard deviation $\\sigma = \\sqrt{\\operatorname{Var}(X)}$ as a typical spread, in the same units as $X$</li>
<li>Decide whether a game, lottery or insurance premium is fair, favourable or unfavourable from $E[\\text{net profit}]$</li>
</ul>
</div>

<h2 class="lesson-title">1. Random Variables: Numbers Born of Chance</h2>

<div class="calc-highlight"><strong>A random variable is a number whose value depends on the outcome of a random experiment.</strong> Before the experiment runs, we do not know its value; after it runs, we do. Toss a coin: let $X = 1$ if heads, $X = 0$ if tails. Roll a die: let $Y$ be the number shown. Draw a card: let $Z$ be its rank. In every case, the experiment produces an outcome and the variable assigns it a number.</div>

<p class="l-text">Formally, a <strong>random variable</strong> $X$ is a function from the sample space $\\Omega$ (the set of all possible outcomes) to the real numbers. We write $X : \\Omega \\to \\mathbb{R}$. The output $X(\\omega)$ is the number assigned to the outcome $\\omega$. We almost never write the function explicitly; we just talk about "the random variable $X$" and use whichever rule defines it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Discrete</div><div class="card-body">Takes finitely many or countably many values: $0, 1, 2, \\ldots$ or $\\{1, 2, 3, 4, 5, 6\\}$. Examples: die roll, number of heads in 10 tosses, number of customers in a queue.</div></div>
<div class="calc-card"><div class="card-title">Continuous</div><div class="card-body">Takes any value in an interval of real numbers. Examples: a person's height, time until the next bus, a measurement error. Continuous variables need integrals; we focus on the discrete case in this lesson.</div></div>
<div class="calc-card"><div class="card-title">Notation</div><div class="card-body">Capital letter for the random variable ($X, Y, Z$), small letter for a specific value ($x, y, z$). So $P(X = x)$ reads "the probability that the random variable $X$ takes the specific value $x$."</div></div>
</div>

<h2 class="lesson-title">2. The Probability Mass Function (PMF)</h2>

<div class="calc-highlight"><strong>A discrete random variable is fully described by its probability mass function</strong> — a list of all the values it can take, each paired with the probability of taking that value. The PMF answers every question you can ask about the variable, including its mean and variance.</div>

<div class="calc-formula"><div class="formula-label">PROBABILITY MASS FUNCTION</div><div class="formula-main">$$p(x_i) \\;=\\; P(X = x_i), \\qquad i = 1, 2, \\ldots, n$$</div><div class="formula-sub">Two rules: each $p(x_i) \\geq 0$, and $\\sum_i p(x_i) = 1$ (the total probability of all outcomes is one).</div></div>

<p class="l-text">The PMF is often given as a short table. For a fair six-sided die:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x$ (face value)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">1</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">2</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">3</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">4</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">5</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">6</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr><td style="padding:0.5rem 0.8rem"><strong>$P(X = x)$</strong></td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td></tr>
</tbody></table>
</div>

<p class="l-text">All six probabilities are equal — that is what "fair" means. They sum to $6 \\cdot \\tfrac{1}{6} = 1$, as the PMF rules require. For a biased coin with heads probability $p$, the PMF of the indicator $X$ (where $X = 1$ if heads, $X = 0$ if tails) is $p(1) = p$, $p(0) = 1 - p$.</p>

<h2 class="lesson-title">3. Expected Value: The Long-Run Average</h2>

<div class="calc-highlight"><strong>The expected value (also called the mean) is what you would get if you repeated the experiment infinitely many times and averaged all the outcomes.</strong> It is the centre of mass of the PMF treated as a system of weights. Formally, it is a weighted sum of the values, with weights equal to their probabilities.</div>

<div class="calc-formula"><div class="formula-label">DEFINITION OF EXPECTED VALUE</div><div class="formula-main">$$E[X] \\;=\\; \\mu \\;=\\; \\sum_{i} x_i \\cdot P(X = x_i)$$</div><div class="formula-sub">Each possible value $x_i$ is multiplied by its probability $P(X = x_i)$, then everything is added. The result is also called the mean of $X$ and is denoted $\\mu$ (the Greek letter mu).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 &mdash; FAIR DIE</div><div class="example-body">Compute $E[X]$ for a fair six-sided die.<br><br>$E[X] = 1 \\cdot \\tfrac{1}{6} + 2 \\cdot \\tfrac{1}{6} + 3 \\cdot \\tfrac{1}{6} + 4 \\cdot \\tfrac{1}{6} + 5 \\cdot \\tfrac{1}{6} + 6 \\cdot \\tfrac{1}{6} = \\dfrac{1 + 2 + 3 + 4 + 5 + 6}{6} = \\dfrac{21}{6} = \\mathbf{3.5}$.<br><br>Note: 3.5 is not a face of the die. Expected value need not be a possible outcome &mdash; it is the long-run average over many rolls.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 &mdash; COIN INDICATOR</div><div class="example-body">Let $X = 1$ if a fair coin lands heads, $X = 0$ otherwise. Compute $E[X]$.<br><br>$E[X] = 1 \\cdot P(\\text{heads}) + 0 \\cdot P(\\text{tails}) = 1 \\cdot \\tfrac{1}{2} + 0 \\cdot \\tfrac{1}{2} = \\mathbf{0.5}$.<br><br>For an indicator variable, $E[X]$ is just the probability of the event being indicated. This is one of the most useful facts in all of probability.</div></div>

<div class="calc-graph"><div id="plot-l101-die-pmf-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the PMF of a fair six-sided die as bars of equal height $1/6$. The dashed vertical line marks $E[X] = 3.5$ &mdash; the balance point of the distribution. If the bars were physical weights on a seesaw, the pivot at 3.5 would keep the seesaw level.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[1,2,3,4,5,6];var ps=[1/6,1/6,1/6,1/6,1/6,1/6];
var bars={x:xs,y:ps,type:'bar',name:'P(X = x)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.5}},text:xs.map(function(v){return '1/6';}),textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var meanLine={x:[3.5,3.5],y:[0,0.22],mode:'lines',name:'E[X] = 3.5',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var meanAnnot={x:[3.5],y:[0.21],mode:'text',name:'mean',text:['E[X] = 3.5'],textfont:{color:'#f59e0b',size:13},textposition:'top center',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'face value x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'P(X = x)',range:[0,0.24],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},bargap:0.35};
Plotly.newPlot('plot-l101-die-pmf-en',[bars,meanLine,meanAnnot],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Reading the formula in words:</strong> "for each possible value, multiply the value by its probability, then add". Expected value weights the rare outcomes less and the common outcomes more. If a $\\$10$ prize has probability $0.01$ and a $\\$1$ prize has probability $0.5$, the latter contributes $0.50$ to the expectation while the former contributes only $0.10$ &mdash; even though the prize is ten times bigger.</div>

<h2 class="lesson-title">4. Linearity of Expectation</h2>

<div class="calc-highlight"><strong>Expected value is linear:</strong> it commutes with sums and with multiplication by constants. This single property is what makes expectation a practical tool. It works even when the variables are dependent &mdash; no independence assumption is needed for linearity.</div>

<div class="calc-formula"><div class="formula-label">LINEARITY OF EXPECTATION</div><div class="formula-main">$$E[aX + bY] \\;=\\; a \\, E[X] + b \\, E[Y]$$</div><div class="formula-sub">Constants $a, b$ slide out of the expectation. Sums break apart. True for any random variables $X$ and $Y$, even if they are dependent.</div></div>

<p class="l-text">Two special cases that you will use constantly:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adding a constant</div><div class="card-body">$E[X + c] = E[X] + c$. Shifting every outcome by $c$ shifts the mean by $c$. The "centre of mass" moves with the data.</div></div>
<div class="calc-card"><div class="card-title">Scaling by a constant</div><div class="card-body">$E[aX] = a \\, E[X]$. Doubling every outcome doubles the mean. Multiplying by $-1$ flips the sign of the mean.</div></div>
<div class="calc-card"><div class="card-title">Sum of variables</div><div class="card-body">$E[X_1 + X_2 + \\cdots + X_n] = E[X_1] + E[X_2] + \\cdots + E[X_n]$. The mean of a sum is the sum of the means.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 &mdash; SUM OF TWO DICE</div><div class="example-body">Roll two fair dice. Let $S$ be their sum. Compute $E[S]$ without summing all 36 outcomes.<br><br>Write $S = X_1 + X_2$, where $X_1, X_2$ are the two faces. By linearity, $E[S] = E[X_1] + E[X_2] = 3.5 + 3.5 = \\mathbf{7}$.<br><br>No independence was assumed &mdash; linearity works regardless. It also works for ten dice: $E[\\text{sum of 10 dice}] = 10 \\cdot 3.5 = 35$.</div></div>

<h2 class="lesson-title">5. Variance: Measuring Spread</h2>

<div class="calc-highlight"><strong>Two random variables can have the same mean yet behave very differently.</strong> Consider a constant variable that always equals $5$ versus a die that takes values $1$ through $6$. Both have $E = 3.5$ on average (the first one trivially, the second by symmetry), but the die spreads its outcomes from $1$ to $6$ while the constant variable does not budge. <em>Variance</em> captures that difference.</div>

<div class="calc-formula"><div class="formula-label">VARIANCE &mdash; DEFINITION</div><div class="formula-main">$$\\operatorname{Var}(X) \\;=\\; E\\left[(X - \\mu)^2\\right] \\;=\\; \\sum_{i} (x_i - \\mu)^2 \\cdot P(X = x_i)$$</div><div class="formula-sub">Take each outcome's distance from the mean, square it (so positives and negatives don't cancel), then take the weighted average using the PMF.</div></div>

<p class="l-text"><strong>Why square the deviations?</strong> Two reasons. First, raw deviations $x_i - \\mu$ always average to zero (positives cancel negatives &mdash; that is what "mean" means). Squaring removes the cancellation problem. Second, squared distance is the most mathematically convenient measure of spread &mdash; it leads to clean formulas in calculus and statistics. The trade-off is that variance has the <em>square</em> of the units of $X$ (if $X$ is in metres, $\\operatorname{Var}(X)$ is in m²).</p>

<div class="calc-formula"><div class="formula-label">THE SHORTCUT FORMULA</div><div class="formula-main">$$\\operatorname{Var}(X) \\;=\\; E[X^2] - \\bigl(E[X]\\bigr)^2 \\;=\\; E[X^2] - \\mu^2$$</div><div class="formula-sub">Almost always faster than the definition. Compute $E[X^2]$ directly, then subtract the square of the mean. Same answer, less arithmetic.</div></div>

<p class="l-text">A quick algebraic check that the shortcut equals the definition:</p>

<div class="calc-example"><div class="example-label">DERIVING THE SHORTCUT</div><div class="example-body">$E[(X - \\mu)^2] = E[X^2 - 2\\mu X + \\mu^2]$.<br><br>Apply linearity: $= E[X^2] - 2\\mu \\, E[X] + \\mu^2 = E[X^2] - 2\\mu \\cdot \\mu + \\mu^2 = E[X^2] - 2\\mu^2 + \\mu^2 = \\mathbf{E[X^2] - \\mu^2}$. Done.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 &mdash; VARIANCE OF A FAIR DIE</div><div class="example-body">Compute $\\operatorname{Var}(X)$ for a fair six-sided die using the shortcut.<br><br>First, $E[X^2] = 1^2 \\cdot \\tfrac{1}{6} + 2^2 \\cdot \\tfrac{1}{6} + 3^2 \\cdot \\tfrac{1}{6} + 4^2 \\cdot \\tfrac{1}{6} + 5^2 \\cdot \\tfrac{1}{6} + 6^2 \\cdot \\tfrac{1}{6} = \\dfrac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\dfrac{91}{6}$.<br><br>Then $\\mu = 3.5 = \\tfrac{7}{2}$, so $\\mu^2 = \\tfrac{49}{4}$.<br><br>$\\operatorname{Var}(X) = \\dfrac{91}{6} - \\dfrac{49}{4} = \\dfrac{182}{12} - \\dfrac{147}{12} = \\dfrac{35}{12} \\approx \\mathbf{2.917}$.<br><br>Standard deviation: $\\sigma = \\sqrt{35/12} \\approx 1.708$.</div></div>

<h2 class="lesson-title">6. Standard Deviation: Variance in the Right Units</h2>

<div class="calc-highlight"><strong>Standard deviation is the square root of variance.</strong> Variance lives in squared units (m², kg², dollars²), which is hard to interpret. Taking the square root brings us back to the original units of $X$, so we can talk about typical spread in the natural scale of the problem.</div>

<div class="calc-formula"><div class="formula-label">STANDARD DEVIATION</div><div class="formula-main">$$\\sigma \\;=\\; \\sqrt{\\operatorname{Var}(X)} \\;=\\; \\sqrt{E[X^2] - \\mu^2}$$</div><div class="formula-sub">Same units as $X$. Roughly, $\\sigma$ is the "typical distance" of an outcome from the mean.</div></div>

<p class="l-text"><strong>Concrete interpretation.</strong> If you roll a fair die many times, individual rolls will be scattered around the mean $3.5$. On average, their distance from $3.5$ (when you square and average) is about $2.92$, so the standard deviation is about $1.71$. Rolls of $2, 3, 4, 5$ are within one standard deviation of the mean; rolls of $1$ and $6$ are at the edges. This matches the rough intuition that "most rolls are not too far from the average."</p>

<h2 class="lesson-title">7. Properties of Variance</h2>

<div class="calc-highlight"><strong>Variance behaves differently from expected value under arithmetic operations.</strong> A constant shift doesn't change spread &mdash; everyone just slides over. A constant multiplier squares its effect &mdash; doubling the values quadruples the variance. Sums work cleanly only when variables are <em>independent</em>.</div>

<div class="calc-formula"><div class="formula-label">VARIANCE RULES</div><div class="formula-main">$$\\operatorname{Var}(aX + b) \\;=\\; a^2 \\operatorname{Var}(X)$$</div><div class="formula-sub">The constant $b$ disappears (shift doesn't affect spread). The constant $a$ becomes $a^2$ (squared, because variance is in squared units).</div></div>

<div class="calc-formula"><div class="formula-label">VARIANCE OF A SUM (INDEPENDENT)</div><div class="formula-main">$$\\operatorname{Var}(X + Y) \\;=\\; \\operatorname{Var}(X) + \\operatorname{Var}(Y) \\qquad \\text{if } X \\text{ and } Y \\text{ are independent}$$</div><div class="formula-sub">Caution: independence is required. Without it, you need a covariance term: $\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">EXPECTATION</div><div class="compare-item">$E[aX + b] = aE[X] + b$</div><div class="compare-item">$E[X + Y] = E[X] + E[Y]$ (always)</div><div class="compare-item">Linear; no independence needed</div><div class="compare-item">Units: same as $X$</div></div><div class="compare-col"><div class="compare-title">VARIANCE</div><div class="compare-item">$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$</div><div class="compare-item">$\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ (independent only)</div><div class="compare-item">Non-linear in $a$; independence required for sums</div><div class="compare-item">Units: square of $X$. Standard deviation $\\sigma$ has the same units as $X$.</div></div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 &mdash; SCALED DIE</div><div class="example-body">Let $X$ be a fair die. Define $Y = 3X + 10$. Compute $E[Y]$ and $\\operatorname{Var}(Y)$.<br><br>$E[Y] = 3 \\, E[X] + 10 = 3 \\cdot 3.5 + 10 = 20.5$.<br><br>$\\operatorname{Var}(Y) = 3^2 \\operatorname{Var}(X) = 9 \\cdot \\tfrac{35}{12} = \\tfrac{315}{12} = \\tfrac{105}{4} = 26.25$.<br><br>Standard deviation: $\\sigma_Y = \\sqrt{26.25} \\approx 5.12$. Notice $\\sigma_Y = 3 \\, \\sigma_X = 3 \\cdot 1.708 = 5.12$ &mdash; the standard deviation scales <em>linearly</em> with $a$, even though variance scales quadratically.</div></div>

<h2 class="lesson-title">8. Two Distributions, Same Mean</h2>

<div class="calc-graph"><div id="plot-l101-same-mean-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two PMFs side by side. Both have mean $3$. The left distribution is concentrated near the mean (low variance); the right is spread to the extremes (high variance). Mean alone cannot distinguish them &mdash; you need variance.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[1,2,3,4,5];var lowVar=[0.05,0.20,0.50,0.20,0.05];var highVar=[0.40,0.05,0.10,0.05,0.40];
var t1={x:xs,y:lowVar,type:'bar',name:'low variance (σ²≈0.7)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.4}}};
var t2={x:xs.map(function(v){return v+6;}),y:highVar,type:'bar',name:'high variance (σ²≈2.8)',marker:{color:'#ef4444',line:{color:'#991b1b',width:1.4}}};
var meanL={x:[3,3],y:[0,0.55],mode:'lines',name:'mean = 3',line:{color:'#f59e0b',width:2,dash:'dash'}};
var meanR={x:[9,9],y:[0,0.55],mode:'lines',name:'mean = 3',line:{color:'#f59e0b',width:2,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'value (two distributions shown side by side)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',tickvals:[1,2,3,4,5,7,8,9,10,11],ticktext:['1','2','3','4','5','1','2','3','4','5']},yaxis:{title:'P(X = x)',range:[0,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},bargap:0.3};
Plotly.newPlot('plot-l101-same-mean-en',[t1,t2,meanL,meanR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Computation for the two PMFs above:</p>

<div class="calc-example"><div class="example-label">CONCRETE COMPUTATION</div><div class="example-body"><strong>Left (low variance):</strong> $E[X] = 1(0.05) + 2(0.20) + 3(0.50) + 4(0.20) + 5(0.05) = 0.05 + 0.40 + 1.50 + 0.80 + 0.25 = 3.0$.<br>$E[X^2] = 1(0.05) + 4(0.20) + 9(0.50) + 16(0.20) + 25(0.05) = 0.05 + 0.80 + 4.50 + 3.20 + 1.25 = 9.80$.<br>$\\operatorname{Var}(X) = 9.80 - 9 = 0.80$, $\\sigma \\approx 0.89$.<br><br><strong>Right (high variance):</strong> $E[Y] = 1(0.40) + 2(0.05) + 3(0.10) + 4(0.05) + 5(0.40) = 0.40 + 0.10 + 0.30 + 0.20 + 2.00 = 3.0$.<br>$E[Y^2] = 1(0.40) + 4(0.05) + 9(0.10) + 16(0.05) + 25(0.40) = 0.40 + 0.20 + 0.90 + 0.80 + 10.00 = 12.30$.<br>$\\operatorname{Var}(Y) = 12.30 - 9 = 3.30$, $\\sigma \\approx 1.82$.<br><br>Same mean, but $\\operatorname{Var}(Y)$ is over four times larger than $\\operatorname{Var}(X)$.</div></div>

<h2 class="lesson-title">9. Expected Value in Decision Making</h2>

<div class="calc-highlight"><strong>Expected value is the universal yardstick for "is this game fair?"</strong> Compute the expected net profit per play. If it is positive, the game favours you; if it is negative, the game favours the house; if it is zero, the game is fair. Casinos exist because almost every game they offer has negative expected value for the player.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 &mdash; THE LOTTERY TICKET</div><div class="example-body">A lottery ticket costs $\\$2$. With probability $0.01$ it wins $\\$100$ (gross); otherwise it pays nothing.<br><br>Let $W$ be the gross prize. $W = 100$ with probability $0.01$, $W = 0$ with probability $0.99$. So $E[W] = 100 \\cdot 0.01 + 0 \\cdot 0.99 = 1.00$.<br><br>Net profit per ticket: $N = W - 2$. By linearity, $E[N] = E[W] - 2 = 1 - 2 = \\mathbf{-\\$1.00}$.<br><br>Conclusion: on average you lose $\\$1$ per ticket. Over 1000 tickets you should expect to lose about $\\$1000$. The lottery is <em>unfavourable</em>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7 &mdash; FAIR INSURANCE PREMIUM</div><div class="example-body">An insurance company sells a policy that pays $\\$10\\,000$ if a customer's house burns down. The probability of fire in a year is $0.001$. What is the <em>fair premium</em> the company should charge?<br><br>Let $C$ be the cost the company pays out: $C = 10000$ with probability $0.001$, $C = 0$ otherwise.<br><br>$E[C] = 10000 \\cdot 0.001 + 0 \\cdot 0.999 = \\mathbf{\\$10.00}$.<br><br>A fair premium is $\\$10$ per year: it exactly equals the expected payout. In practice the company charges more (say, $\\$15$) to cover overhead and profit; that surplus is the company's expected gain per customer.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Favourable game</div><div class="card-body">$E[\\text{net profit}] > 0$. Play this game if you can. Rare in real life unless you have an edge.</div></div>
<div class="calc-card"><div class="card-title">Fair game</div><div class="card-body">$E[\\text{net profit}] = 0$. Break even in the long run. The "expected" outcome is zero gain.</div></div>
<div class="calc-card"><div class="card-title">Unfavourable game</div><div class="card-body">$E[\\text{net profit}] < 0$. You lose on average. Lotteries, casino games, most "get rich quick" schemes.</div></div>
</div>

<div class="l-note"><strong>A subtle caveat.</strong> Expected value tells you about the <em>average</em> over many plays. If you only play once, a $\\$1$ ticket that wins $\\$1\\,000\\,000$ with probability $10^{-6}$ has $E = 0$ (fair!) but it is almost certain to lose. People buy lottery tickets in part because the variance is enormous &mdash; a small expected loss buys a tiny chance at a life-changing win. The expected-value test is necessary but not sufficient for deciding whether to play.</div>

<h2 class="lesson-title">10. Visualising Spread</h2>

<div class="calc-graph"><div id="plot-l101-spread-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three bell-shaped distributions, all centred at zero but with standard deviations $\\sigma = 1$, $\\sigma = 2$, $\\sigma = 3$. As $\\sigma$ grows, the curves flatten and spread out; the area under each curve stays at $1$ (total probability is preserved). Standard deviation is exactly the horizontal "width" of the curve.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-100;i<=100;i++){xs.push(i*0.1);}
function bell(x,s){return Math.exp(-x*x/(2*s*s))/(s*Math.sqrt(2*Math.PI));}
var y1=xs.map(function(x){return bell(x,1);});
var y2=xs.map(function(x){return bell(x,2);});
var y3=xs.map(function(x){return bell(x,3);});
var t1={x:xs,y:y1,mode:'lines',name:'σ = 1 (narrow, tall)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'σ = 2 (medium)',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:y3,mode:'lines',name:'σ = 3 (wide, flat)',line:{color:'#ef4444',width:2.5}};
var meanL={x:[0,0],y:[0,0.42],mode:'lines',name:'mean = 0',line:{color:'#f59e0b',width:1.5,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (distance from mean)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-10,10]},yaxis:{title:'probability density',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l101-spread-en',[t1,t2,t3,meanL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Common Errors and How to Avoid Them</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting to subtract $\\mu^2$</div><div class="card-body">In the shortcut $\\operatorname{Var}(X) = E[X^2] - \\mu^2$, students sometimes compute only $E[X^2]$ and forget the correction. Always finish with the subtraction.</div></div>
<div class="calc-card"><div class="card-title">Confusing $E[X^2]$ with $(E[X])^2$</div><div class="card-body">These are different! $E[X^2]$ is the mean of the squares; $(E[X])^2$ is the square of the mean. Variance is exactly their difference, and the difference is non-negative by Jensen's inequality.</div></div>
<div class="calc-card"><div class="card-title">Using $a$ instead of $a^2$ in variance</div><div class="card-body">$\\operatorname{Var}(aX) = a^2 \\operatorname{Var}(X)$, not $a \\operatorname{Var}(X)$. Variance is in squared units, so a constant multiplier gets squared too.</div></div>
<div class="calc-card"><div class="card-title">Adding variances of dependent variables</div><div class="card-body">$\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ <em>only</em> when $X, Y$ are independent. For expectation, no such restriction exists.</div></div>
<div class="calc-card"><div class="card-title">Treating $\\sigma$ as if it adds</div><div class="card-body">Standard deviations do <em>not</em> add: $\\sigma_{X+Y} \\neq \\sigma_X + \\sigma_Y$. Variances add (for independent variables); only then take the square root.</div></div>
<div class="calc-card"><div class="card-title">Expecting $E[X]$ to be a possible outcome</div><div class="card-body">The mean of a die is $3.5$, not on the die at all. The expected value is a balance point, not a face.</div></div>
</div>

<h2 class="lesson-title">12. Practice Problems</h2>

<p class="l-text">Work each problem yourself before reading the solution. Each tests one or two of the ideas from the lesson.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; BIASED COIN</div><div class="example-body"><strong>A coin lands heads with probability $0.7$. Let $X = 1$ for heads, $X = 0$ for tails. Find $E[X]$ and $\\operatorname{Var}(X)$.</strong><br><br>$E[X] = 1 \\cdot 0.7 + 0 \\cdot 0.3 = 0.7$.<br><br>$E[X^2] = 1^2 \\cdot 0.7 + 0^2 \\cdot 0.3 = 0.7$. Note $X^2 = X$ when $X \\in \\{0, 1\\}$.<br><br>$\\operatorname{Var}(X) = E[X^2] - \\mu^2 = 0.7 - 0.49 = \\mathbf{0.21}$. General formula for a Bernoulli indicator with parameter $p$: $\\operatorname{Var} = p(1-p)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; PRIZE WHEEL</div><div class="example-body"><strong>A wheel has four equal sectors paying $\\$0$, $\\$1$, $\\$3$, $\\$8$. Find the expected payout and its standard deviation.</strong><br><br>$E[X] = \\tfrac{1}{4}(0 + 1 + 3 + 8) = \\tfrac{12}{4} = 3$.<br><br>$E[X^2] = \\tfrac{1}{4}(0 + 1 + 9 + 64) = \\tfrac{74}{4} = 18.5$.<br><br>$\\operatorname{Var}(X) = 18.5 - 9 = 9.5$, $\\sigma = \\sqrt{9.5} \\approx \\mathbf{3.08}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; CARNIVAL GAME</div><div class="example-body"><strong>A game costs $\\$5$ to play. You roll a fair die: win $\\$12$ on a 6, win $\\$3$ on a 4 or 5, win nothing otherwise. Compute expected net profit. Is the game favourable, fair or unfavourable?</strong><br><br>Gross winnings $W$: $W = 12$ with $P = 1/6$; $W = 3$ with $P = 2/6$; $W = 0$ with $P = 3/6$.<br><br>$E[W] = 12 \\cdot \\tfrac{1}{6} + 3 \\cdot \\tfrac{2}{6} + 0 \\cdot \\tfrac{3}{6} = 2 + 1 + 0 = 3$.<br><br>Net profit $N = W - 5$, so $E[N] = 3 - 5 = \\mathbf{-\\$2.00}$. The game is <strong>unfavourable</strong> &mdash; you lose $\\$2$ on average per play.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SUM OF THREE DICE</div><div class="example-body"><strong>Roll three fair dice. Let $S$ be their sum. Find $E[S]$ and $\\operatorname{Var}(S)$.</strong><br><br>By linearity, $E[S] = 3 \\cdot E[X] = 3 \\cdot 3.5 = \\mathbf{10.5}$.<br><br>By independence, $\\operatorname{Var}(S) = 3 \\cdot \\operatorname{Var}(X) = 3 \\cdot \\tfrac{35}{12} = \\tfrac{105}{12} = \\tfrac{35}{4} = \\mathbf{8.75}$.<br><br>$\\sigma_S \\approx \\sqrt{8.75} \\approx 2.96$. Standard deviation grew by $\\sqrt{3} \\approx 1.73$, not by $3$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; INSURANCE WITH OVERHEAD</div><div class="example-body"><strong>An insurer pays $\\$5000$ if event $A$ occurs (probability $0.002$). Overhead is $\\$3$ per policy. What premium gives the insurer an expected profit of $\\$5$ per policy?</strong><br><br>Expected cost of payouts: $E[C] = 5000 \\cdot 0.002 = 10$.<br><br>Total expected expense per policy: $10 + 3 = 13$.<br><br>For an expected profit of $5$: premium $= 13 + 5 = \\mathbf{\\$18}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; COTERMINAL CHECK</div><div class="example-body"><strong>$X$ has PMF $P(X = 0) = 0.5$, $P(X = 1) = 0.3$, $P(X = 2) = 0.2$. Find $E[X]$, $\\operatorname{Var}(X)$, then $E[3X + 1]$ and $\\operatorname{Var}(3X + 1)$.</strong><br><br>$E[X] = 0(0.5) + 1(0.3) + 2(0.2) = 0.7$.<br><br>$E[X^2] = 0(0.5) + 1(0.3) + 4(0.2) = 1.1$.<br><br>$\\operatorname{Var}(X) = 1.1 - 0.49 = 0.61$.<br><br>$E[3X + 1] = 3(0.7) + 1 = \\mathbf{3.1}$, $\\operatorname{Var}(3X + 1) = 9 \\cdot 0.61 = \\mathbf{5.49}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; SAME MEAN, COMPARE SPREAD</div><div class="example-body"><strong>Variable $A$ takes values $\\{2, 3, 4\\}$ with probabilities $\\{0.25, 0.50, 0.25\\}$. Variable $B$ takes values $\\{0, 3, 6\\}$ with probabilities $\\{0.25, 0.50, 0.25\\}$. Show they have the same mean. Which has larger variance?</strong><br><br>$E[A] = 2(0.25) + 3(0.50) + 4(0.25) = 0.5 + 1.5 + 1.0 = 3$.<br>$E[B] = 0(0.25) + 3(0.50) + 6(0.25) = 0 + 1.5 + 1.5 = 3$. Same mean.<br><br>$E[A^2] = 4(0.25) + 9(0.50) + 16(0.25) = 1 + 4.5 + 4 = 9.5$, $\\operatorname{Var}(A) = 9.5 - 9 = 0.5$.<br>$E[B^2] = 0(0.25) + 9(0.50) + 36(0.25) = 0 + 4.5 + 9 = 13.5$, $\\operatorname{Var}(B) = 13.5 - 9 = 4.5$.<br><br>$\\operatorname{Var}(B) = 9 \\cdot \\operatorname{Var}(A)$ &mdash; expected, since $B$ is obtained from $A$ by tripling distance from the mean.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; FAIR-GAME PRICE</div><div class="example-body"><strong>You roll one die. The house pays you the face value in dollars. What price for the game makes it fair?</strong><br><br>Expected payoff $= E[X] = \\$3.50$. For the game to be fair (expected net profit zero), the price should be $\\mathbf{\\$3.50}$.<br><br>If the house charges $\\$4$, the game is unfavourable for the player (and a $\\$0.50$ edge for the house per roll). If the house charges $\\$3$, it is favourable for the player.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A discrete random variable is a function from outcomes to numbers, described fully by its PMF $p(x_i) = P(X = x_i)$</li>
<li>Expected value $E[X] = \\sum_i x_i \\, p(x_i)$ is the long-run average; the centre of mass of the PMF</li>
<li>Linearity: $E[aX + bY] = aE[X] + bE[Y]$, no independence required</li>
<li>Variance $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - \\mu^2$; same answer, second form usually faster</li>
<li>Standard deviation $\\sigma = \\sqrt{\\operatorname{Var}(X)}$; same units as $X$; rough size of typical deviation</li>
<li>$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$ (shift doesn't change spread; scaling squares its effect)</li>
<li>$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ only when $X, Y$ are independent</li>
<li>Decision rule: positive expected net profit = favourable, zero = fair, negative = unfavourable</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Adil bir zarı bin kez at ve sayıları topla. Ne elde edersin?</strong> Ne 6 (en büyük yüz) ne de 1 (en küçük), ama 3500'e yakın bir sayı — atış başına ortalama yaklaşık 3.5. İşte bu 3.5, zarın <em>beklenen değeridir</em> ve hiçbir yüzde aslında görünmez. Beklenen değer, herhangi tek bir sonucun tahmini değildir; aynı deney tekrar tekrar yapıldığında beklediğimiz uzun-vadeli ortalamadır. Bu ders, o sezgiyi kesin bir tanıma dönüştürüyor ve ardından ikinci bir soru soruyor: <em>sonuçlar ortalamanın etrafında ne kadar yayılıyor?</em> Cevap <em>varyanstır</em>.</p>

<p class="l-text">Bu dersin sonunda, herhangi bir kesikli rastgele değişkenin beklenen değerini olasılık kütle fonksiyonundan hesaplayabileceksin, beklentinin doğrusallığını kullanarak karmaşık toplamları kolay parçalara bölebileceksin, varyansı iki farklı yolla hesaplayıp aynı sonucu aldığını doğrulayabileceksin, bir oyunun veya bahsin adil olup olmadığına beklenen değerle karar verebileceksin ve standart sapmayı "ortalamadan tipik uzaklık" olarak yorumlayabileceksin. Bu dört beceri — ortalama, yayılım, adillik, tipik sapma — okuyacağın her istatistiksel argümanın temelidir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kesikli bir rastgele değişkeni tanımlamayı ve olasılık kütle fonksiyonunu (PMF) yazmayı</li>
<li>Beklenen değeri $E[X] = \\sum x_i \\, P(X = x_i)$ ile sonuçların ağırlıklı ortalaması olarak hesaplamayı</li>
<li>Doğrusallık $E[aX + bY] = aE[X] + bE[Y]$ ile karmaşık doğrudan toplamlardan kısa yola çıkmayı</li>
<li>Varyansı $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - \\mu^2$ yoluyla hesaplamayı</li>
<li>Standart sapmayı $\\sigma = \\sqrt{\\operatorname{Var}(X)}$, $X$ ile aynı birimde tipik yayılım olarak yorumlamayı</li>
<li>Bir oyunun, piyangonun veya sigorta priminin $E[\\text{net profit}]$ değerinden adil, lehte ya da aleyhte olduğuna karar vermeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Rastgele Değişkenler: Şanstan Doğan Sayılar</h2>

<div class="calc-highlight"><strong>Rastgele değişken, değeri rastgele bir deneyin sonucuna bağlı olan bir sayıdır.</strong> Deney çalışmadan önce değerini bilmeyiz; çalıştıktan sonra biliriz. Bir madeni para at: $X = 1$ tura gelirse, $X = 0$ yazı gelirse. Zar at: $Y$ görünen sayı olsun. Kart çek: $Z$ kartın rütbesi olsun. Her durumda, deney bir sonuç üretir ve değişken o sonuca bir sayı atar.</div>

<p class="l-text">Biçimsel olarak, bir <strong>rastgele değişken</strong> $X$, örnek uzayı $\\Omega$ (tüm olası sonuçların kümesi) üzerinden gerçek sayılara bir fonksiyondur. $X : \\Omega \\to \\mathbb{R}$ yazarız. Çıktı $X(\\omega)$, $\\omega$ sonucuna atanmış sayıdır. Fonksiyonu neredeyse hiçbir zaman açıkça yazmayız; sadece "$X$ rastgele değişkeni" deriz ve onu tanımlayan kuralı kullanırız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesikli</div><div class="card-body">Sonlu ya da sayılabilir sonsuz değer alır: $0, 1, 2, \\ldots$ ya da $\\{1, 2, 3, 4, 5, 6\\}$. Örnekler: zar atışı, 10 atışta tura sayısı, sıradaki müşteri sayısı.</div></div>
<div class="calc-card"><div class="card-title">Sürekli</div><div class="card-body">Gerçek sayılarda bir aralıktaki herhangi bir değeri alır. Örnekler: bir kişinin boyu, bir sonraki otobüse kalan süre, ölçüm hatası. Sürekli değişkenler integral gerektirir; bu derste kesikli durumla ilgilenmekteyiz.</div></div>
<div class="calc-card"><div class="card-title">Gösterim</div><div class="card-body">Rastgele değişken için büyük harf ($X, Y, Z$), belirli bir değer için küçük harf ($x, y, z$). Yani $P(X = x)$, "$X$ rastgele değişkeninin belirli $x$ değerini alma olasılığı" olarak okunur.</div></div>
</div>

<h2 class="lesson-title">2. Olasılık Kütle Fonksiyonu (PMF)</h2>

<div class="calc-highlight"><strong>Kesikli bir rastgele değişken, olasılık kütle fonksiyonu ile tam olarak tanımlanır</strong> — alabileceği tüm değerlerin bir listesi ve her birinin alınma olasılığı. PMF, ortalama ve varyans dahil değişken hakkında sorabileceğin her soruyu yanıtlar.</div>

<div class="calc-formula"><div class="formula-label">OLASILIK KÜTLE FONKSİYONU</div><div class="formula-main">$$p(x_i) \\;=\\; P(X = x_i), \\qquad i = 1, 2, \\ldots, n$$</div><div class="formula-sub">İki kural: her $p(x_i) \\geq 0$ ve $\\sum_i p(x_i) = 1$ (tüm sonuçların toplam olasılığı birdir).</div></div>

<p class="l-text">PMF genellikle kısa bir tablo olarak verilir. Adil bir altı yüzlü zar için:</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$x$ (yüz değeri)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">1</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">2</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">3</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">4</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">5</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">6</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr><td style="padding:0.5rem 0.8rem"><strong>$P(X = x)$</strong></td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td><td style="padding:0.5rem 0.8rem">1/6</td></tr>
</tbody></table>
</div>

<p class="l-text">Altı olasılığın hepsi eşit — "adil" tam olarak bunu ifade eder. Toplamları $6 \\cdot \\tfrac{1}{6} = 1$, PMF kurallarının gerektirdiği gibi. Tura olasılığı $p$ olan hileli bir madeni para için, $X$ göstergesinin ($X = 1$ tura, $X = 0$ yazı) PMF'i $p(1) = p$, $p(0) = 1 - p$ şeklindedir.</p>

<h2 class="lesson-title">3. Beklenen Değer: Uzun-Vadeli Ortalama</h2>

<div class="calc-highlight"><strong>Beklenen değer (ortalama olarak da bilinir), deneyi sonsuz kez tekrarlayıp tüm sonuçları ortalarsan elde edeceğin değerdir.</strong> PMF'in kütle sistemi olarak değerlendirildiğinde ağırlık merkezidir. Biçimsel olarak, ağırlıkları olasılıklara eşit olan değerlerin ağırlıklı toplamıdır.</div>

<div class="calc-formula"><div class="formula-label">BEKLENEN DEĞERİN TANIMI</div><div class="formula-main">$$E[X] \\;=\\; \\mu \\;=\\; \\sum_{i} x_i \\cdot P(X = x_i)$$</div><div class="formula-sub">Her olası $x_i$ değeri olasılığı $P(X = x_i)$ ile çarpılır, sonra hepsi toplanır. Sonuç aynı zamanda $X$'in ortalaması olarak adlandırılır ve $\\mu$ (mu, Yunan harfi) ile gösterilir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 1 &mdash; ADİL ZAR</div><div class="example-body">Adil altı yüzlü zar için $E[X]$'i hesapla.<br><br>$E[X] = 1 \\cdot \\tfrac{1}{6} + 2 \\cdot \\tfrac{1}{6} + 3 \\cdot \\tfrac{1}{6} + 4 \\cdot \\tfrac{1}{6} + 5 \\cdot \\tfrac{1}{6} + 6 \\cdot \\tfrac{1}{6} = \\dfrac{1 + 2 + 3 + 4 + 5 + 6}{6} = \\dfrac{21}{6} = \\mathbf{3.5}$.<br><br>Dikkat: 3.5 zarda bir yüz değildir. Beklenen değerin olası bir sonuç olması gerekmez — bu, çok sayıda atış üzerinden uzun vadeli ortalamadır.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 2 &mdash; PARA GÖSTERGESİ</div><div class="example-body">Adil bir madeni para tura geldiğinde $X = 1$, aksi halde $X = 0$ olsun. $E[X]$'i hesapla.<br><br>$E[X] = 1 \\cdot P(\\text{heads}) + 0 \\cdot P(\\text{tails}) = 1 \\cdot \\tfrac{1}{2} + 0 \\cdot \\tfrac{1}{2} = \\mathbf{0.5}$.<br><br>Bir gösterge değişken için $E[X]$, gösterilen olayın olasılığıdır. Bu, tüm olasılık biliminin en kullanışlı gerçeklerinden biridir.</div></div>

<div class="calc-graph"><div id="plot-l101-die-pmf-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> adil altı yüzlü zarın PMF'i, eşit yükseklikte $1/6$ çubuklar olarak. Kesik dikey çizgi $E[X] = 3.5$'i işaretler — dağılımın denge noktası. Çubuklar fiziksel ağırlıklar olsa, 3.5'teki mil tahterevalliyi dengede tutardı.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[1,2,3,4,5,6];var ps=[1/6,1/6,1/6,1/6,1/6,1/6];
var bars={x:xs,y:ps,type:'bar',name:'P(X = x)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.5}},text:xs.map(function(v){return '1/6';}),textposition:'outside',textfont:{color:'#e8e8e8',size:11}};
var meanLine={x:[3.5,3.5],y:[0,0.22],mode:'lines',name:'E[X] = 3.5',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var meanAnnot={x:[3.5],y:[0.21],mode:'text',name:'ortalama',text:['E[X] = 3.5'],textfont:{color:'#f59e0b',size:13},textposition:'top center',showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'yüz değeri x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',dtick:1},yaxis:{title:'P(X = x)',range:[0,0.24],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},bargap:0.35};
Plotly.newPlot('plot-l101-die-pmf-tr',[bars,meanLine,meanAnnot],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Formülün sözlü okunuşu:</strong> "her olası değer için, değeri olasılığıyla çarp, sonra topla". Beklenen değer, nadir sonuçlara daha az, sık sonuçlara daha çok ağırlık verir. $\\$10$'luk bir ödülün olasılığı $0.01$ ve $\\$1$'lık ödülün olasılığı $0.5$ ise, ikincisi beklentiye $0.50$ katarken, birincisi yalnızca $0.10$ katar — ödül on kat büyük olsa bile.</div>

<h2 class="lesson-title">4. Beklentinin Doğrusallığı</h2>

<div class="calc-highlight"><strong>Beklenen değer doğrusaldır:</strong> toplamla ve sabitlerle çarpımla yer değiştirir. Bu tek özellik, beklentiyi pratik bir araç yapan şeydir. Değişkenler bağımlı bile olsa çalışır — doğrusallık için bağımsızlık varsayımı gerekmez.</div>

<div class="calc-formula"><div class="formula-label">BEKLENTİNİN DOĞRUSALLIĞI</div><div class="formula-main">$$E[aX + bY] \\;=\\; a \\, E[X] + b \\, E[Y]$$</div><div class="formula-sub">$a, b$ sabitleri beklentinin dışına çıkar. Toplamlar parçalanır. Her $X$ ve $Y$ rastgele değişkeni için, bağımlı olsalar bile geçerlidir.</div></div>

<p class="l-text">Sürekli kullanacağın iki özel durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sabit ekleme</div><div class="card-body">$E[X + c] = E[X] + c$. Her sonucu $c$ kadar kaydırmak ortalamayı $c$ kadar kaydırır. "Ağırlık merkezi" veriyle birlikte hareket eder.</div></div>
<div class="calc-card"><div class="card-title">Sabitle ölçekleme</div><div class="card-body">$E[aX] = a \\, E[X]$. Her sonucu ikiye katlamak ortalamayı ikiye katlar. $-1$ ile çarpmak ortalamanın işaretini değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Değişkenlerin toplamı</div><div class="card-body">$E[X_1 + X_2 + \\cdots + X_n] = E[X_1] + E[X_2] + \\cdots + E[X_n]$. Toplamın ortalaması, ortalamaların toplamıdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 3 &mdash; İKİ ZARIN TOPLAMI</div><div class="example-body">İki adil zar at. Toplamları $S$ olsun. 36 sonucu toplamadan $E[S]$'i hesapla.<br><br>$S = X_1 + X_2$ yaz, burada $X_1, X_2$ iki zarın yüzleri. Doğrusallıkla $E[S] = E[X_1] + E[X_2] = 3.5 + 3.5 = \\mathbf{7}$.<br><br>Bağımsızlık varsayılmadı — doğrusallık her durumda işler. On zar için de geçerlidir: $E[\\text{sum of 10 dice}] = 10 \\cdot 3.5 = 35$.</div></div>

<h2 class="lesson-title">5. Varyans: Yayılımı Ölçmek</h2>

<div class="calc-highlight"><strong>İki rastgele değişken aynı ortalamaya sahip olabilir ama çok farklı davranabilir.</strong> Her zaman $5$ değerini alan sabit bir değişkeni, $1$'den $6$'ya kadar değer alan bir zarla karşılaştır. Her ikisinin de ortalama olarak $E = 3.5$'i vardır (ilki açıkça, ikincisi simetri yoluyla), ama zar sonuçlarını $1$'den $6$'ya yayar, sabit değişken ise kıpırdamaz. <em>Varyans</em> bu farkı yakalar.</div>

<div class="calc-formula"><div class="formula-label">VARYANS &mdash; TANIM</div><div class="formula-main">$$\\operatorname{Var}(X) \\;=\\; E\\left[(X - \\mu)^2\\right] \\;=\\; \\sum_{i} (x_i - \\mu)^2 \\cdot P(X = x_i)$$</div><div class="formula-sub">Her sonucun ortalamadan uzaklığını al, karesini al (pozitiflerle negatifler birbirini sıfırlamasın), sonra PMF kullanarak ağırlıklı ortalama al.</div></div>

<p class="l-text"><strong>Neden sapmaların karesi alınır?</strong> İki nedeni var. Birincisi, ham sapmalar $x_i - \\mu$ her zaman sıfıra ortalanır (pozitifler negatifleri götürür — "ortalama"nın anlamı budur). Karesi almak götürme sorununu çözer. İkincisi, karesel uzaklık matematiksel olarak en uygun yayılım ölçüsüdür — kalkülüs ve istatistikte temiz formüllere yol açar. Bedeli ise varyansın, $X$'in birimlerinin <em>karesinde</em> olmasıdır (eğer $X$ metre cinsindense, $\\operatorname{Var}(X)$ m² cinsindendir).</p>

<div class="calc-formula"><div class="formula-label">KISA YOL FORMÜLÜ</div><div class="formula-main">$$\\operatorname{Var}(X) \\;=\\; E[X^2] - \\bigl(E[X]\\bigr)^2 \\;=\\; E[X^2] - \\mu^2$$</div><div class="formula-sub">Neredeyse her zaman tanımdan daha hızlı. $E[X^2]$'yi doğrudan hesapla, sonra ortalamanın karesini çıkar. Aynı cevap, daha az aritmetik.</div></div>

<p class="l-text">Kısa yolun tanıma eşit olduğunu hızlıca cebirsel kontrol edelim:</p>

<div class="calc-example"><div class="example-label">KISA YOLUN TÜRETİLİŞİ</div><div class="example-body">$E[(X - \\mu)^2] = E[X^2 - 2\\mu X + \\mu^2]$.<br><br>Doğrusallığı uygula: $= E[X^2] - 2\\mu \\, E[X] + \\mu^2 = E[X^2] - 2\\mu \\cdot \\mu + \\mu^2 = E[X^2] - 2\\mu^2 + \\mu^2 = \\mathbf{E[X^2] - \\mu^2}$. Tamam.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 4 &mdash; ADİL ZARIN VARYANSI</div><div class="example-body">Adil altı yüzlü zar için $\\operatorname{Var}(X)$'i kısa yolla hesapla.<br><br>Önce, $E[X^2] = 1^2 \\cdot \\tfrac{1}{6} + 2^2 \\cdot \\tfrac{1}{6} + 3^2 \\cdot \\tfrac{1}{6} + 4^2 \\cdot \\tfrac{1}{6} + 5^2 \\cdot \\tfrac{1}{6} + 6^2 \\cdot \\tfrac{1}{6} = \\dfrac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\dfrac{91}{6}$.<br><br>Sonra $\\mu = 3.5 = \\tfrac{7}{2}$, yani $\\mu^2 = \\tfrac{49}{4}$.<br><br>$\\operatorname{Var}(X) = \\dfrac{91}{6} - \\dfrac{49}{4} = \\dfrac{182}{12} - \\dfrac{147}{12} = \\dfrac{35}{12} \\approx \\mathbf{2.917}$.<br><br>Standart sapma: $\\sigma = \\sqrt{35/12} \\approx 1.708$.</div></div>

<h2 class="lesson-title">6. Standart Sapma: Varyansın Doğru Birimlerle Hali</h2>

<div class="calc-highlight"><strong>Standart sapma, varyansın kareköküdür.</strong> Varyans kare birimlerde yaşar (m², kg², dolar²) ki yorumlanması zordur. Karekök almak bizi $X$'in orijinal birimlerine geri getirir, böylece problemin doğal ölçeğinde tipik yayılımdan söz edebiliriz.</div>

<div class="calc-formula"><div class="formula-label">STANDART SAPMA</div><div class="formula-main">$$\\sigma \\;=\\; \\sqrt{\\operatorname{Var}(X)} \\;=\\; \\sqrt{E[X^2] - \\mu^2}$$</div><div class="formula-sub">$X$ ile aynı birim. Kabaca, $\\sigma$ bir sonucun ortalamadan "tipik uzaklığıdır".</div></div>

<p class="l-text"><strong>Somut yorum.</strong> Adil bir zarı çok kez atarsan, bireysel atışlar ortalama $3.5$'in etrafında dağılır. Ortalama olarak $3.5$'ten uzaklıkları (kare alıp ortaladığında) yaklaşık $2.92$'dir, yani standart sapma yaklaşık $1.71$'dir. $2, 3, 4, 5$ atışları ortalamadan bir standart sapma içindedir; $1$ ve $6$ atışları kenarlardadır. Bu, "atışların çoğu ortalamadan çok uzak değil" sezgisine uyar.</p>

<h2 class="lesson-title">7. Varyansın Özellikleri</h2>

<div class="calc-highlight"><strong>Varyans, aritmetik işlemlerde beklenen değerden farklı davranır.</strong> Sabit bir kayma yayılımı değiştirmez — herkes aynı miktarda kayar. Sabit bir çarpan etkisini karesine çıkarır — değerleri ikiye katlamak varyansı dörde katlar. Toplamlar yalnızca değişkenler <em>bağımsız</em> olduğunda temiz şekilde çalışır.</div>

<div class="calc-formula"><div class="formula-label">VARYANS KURALLARI</div><div class="formula-main">$$\\operatorname{Var}(aX + b) \\;=\\; a^2 \\operatorname{Var}(X)$$</div><div class="formula-sub">$b$ sabiti kaybolur (kayma yayılımı etkilemez). $a$ sabiti $a^2$ olur (karesi alınır, çünkü varyans kare birimlerdedir).</div></div>

<div class="calc-formula"><div class="formula-label">TOPLAMIN VARYANSI (BAĞIMSIZ)</div><div class="formula-main">$$\\operatorname{Var}(X + Y) \\;=\\; \\operatorname{Var}(X) + \\operatorname{Var}(Y) \\qquad \\text{(if } X, Y \\text{ independent)}$$</div><div class="formula-sub">Uyarı: bağımsızlık gereklidir. Bağımsız değillerse kovaryans terimi gerekir: $\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BEKLENTİ</div><div class="compare-item">$E[aX + b] = aE[X] + b$</div><div class="compare-item">$E[X + Y] = E[X] + E[Y]$ (her zaman)</div><div class="compare-item">Doğrusal; bağımsızlık gerekmez</div><div class="compare-item">Birim: $X$ ile aynı</div></div><div class="compare-col"><div class="compare-title">VARYANS</div><div class="compare-item">$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$</div><div class="compare-item">$\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ (yalnızca bağımsızsa)</div><div class="compare-item">$a$'da doğrusal değil; toplamlar için bağımsızlık şart</div><div class="compare-item">Birim: $X$'in karesi. Standart sapma $\\sigma$, $X$ ile aynı birimdedir.</div></div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 5 &mdash; ÖLÇEKLENMİŞ ZAR</div><div class="example-body">$X$ adil bir zar olsun. $Y = 3X + 10$ tanımla. $E[Y]$ ve $\\operatorname{Var}(Y)$'yi hesapla.<br><br>$E[Y] = 3 \\, E[X] + 10 = 3 \\cdot 3.5 + 10 = 20.5$.<br><br>$\\operatorname{Var}(Y) = 3^2 \\operatorname{Var}(X) = 9 \\cdot \\tfrac{35}{12} = \\tfrac{315}{12} = \\tfrac{105}{4} = 26.25$.<br><br>Standart sapma: $\\sigma_Y = \\sqrt{26.25} \\approx 5.12$. Dikkat: $\\sigma_Y = 3 \\, \\sigma_X = 3 \\cdot 1.708 = 5.12$ — standart sapma $a$ ile <em>doğrusal</em> ölçeklenir, varyans karesel ölçeklense bile.</div></div>

<h2 class="lesson-title">8. İki Dağılım, Aynı Ortalama</h2>

<div class="calc-graph"><div id="plot-l101-same-mean-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yan yana iki PMF. Her ikisinin de ortalaması $3$. Soldaki dağılım ortalamaya yakın yoğunlaşmış (düşük varyans); sağdaki uçlara yayılmış (yüksek varyans). Ortalama tek başına bunları ayırt edemez — varyansa ihtiyacın var.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[1,2,3,4,5];var lowVar=[0.05,0.20,0.50,0.20,0.05];var highVar=[0.40,0.05,0.10,0.05,0.40];
var t1={x:xs,y:lowVar,type:'bar',name:'düşük varyans (σ²≈0.7)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.4}}};
var t2={x:xs.map(function(v){return v+6;}),y:highVar,type:'bar',name:'yüksek varyans (σ²≈2.8)',marker:{color:'#ef4444',line:{color:'#991b1b',width:1.4}}};
var meanL={x:[3,3],y:[0,0.55],mode:'lines',name:'ortalama = 3',line:{color:'#f59e0b',width:2,dash:'dash'}};
var meanR={x:[9,9],y:[0,0.55],mode:'lines',name:'ortalama = 3',line:{color:'#f59e0b',width:2,dash:'dash'},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'değer (yan yana iki dağılım)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',tickvals:[1,2,3,4,5,7,8,9,10,11],ticktext:['1','2','3','4','5','1','2','3','4','5']},yaxis:{title:'P(X = x)',range:[0,0.6],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},bargap:0.3};
Plotly.newPlot('plot-l101-same-mean-tr',[t1,t2,meanL,meanR],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text">Yukarıdaki iki PMF için hesaplama:</p>

<div class="calc-example"><div class="example-label">SOMUT HESAPLAMA</div><div class="example-body"><strong>Sol (düşük varyans):</strong> $E[X] = 1(0.05) + 2(0.20) + 3(0.50) + 4(0.20) + 5(0.05) = 0.05 + 0.40 + 1.50 + 0.80 + 0.25 = 3.0$.<br>$E[X^2] = 1(0.05) + 4(0.20) + 9(0.50) + 16(0.20) + 25(0.05) = 0.05 + 0.80 + 4.50 + 3.20 + 1.25 = 9.80$.<br>$\\operatorname{Var}(X) = 9.80 - 9 = 0.80$, $\\sigma \\approx 0.89$.<br><br><strong>Sağ (yüksek varyans):</strong> $E[Y] = 1(0.40) + 2(0.05) + 3(0.10) + 4(0.05) + 5(0.40) = 0.40 + 0.10 + 0.30 + 0.20 + 2.00 = 3.0$.<br>$E[Y^2] = 1(0.40) + 4(0.05) + 9(0.10) + 16(0.05) + 25(0.40) = 0.40 + 0.20 + 0.90 + 0.80 + 10.00 = 12.30$.<br>$\\operatorname{Var}(Y) = 12.30 - 9 = 3.30$, $\\sigma \\approx 1.82$.<br><br>Aynı ortalama, ama $\\operatorname{Var}(Y)$, $\\operatorname{Var}(X)$'in dört katından fazla.</div></div>

<h2 class="lesson-title">9. Karar Vermede Beklenen Değer</h2>

<div class="calc-highlight"><strong>Beklenen değer, "bu oyun adil mi?" sorusu için evrensel ölçüttür.</strong> Oyun başına beklenen net kârı hesapla. Pozitifse oyun sana yarar; negatifse kasaya yarar; sıfırsa oyun adildir. Kasinolar var olabiliyor, çünkü sundukları neredeyse her oyun oyuncu için negatif beklenen değere sahiptir.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 6 &mdash; PİYANGO BİLETİ</div><div class="example-body">Bir piyango bileti $\\$2$. $0.01$ olasılıkla $\\$100$ (brüt) kazanır; aksi halde sıfır öder.<br><br>$W$ brüt ödül olsun. $W = 100$ olasılıkla $0.01$, $W = 0$ olasılıkla $0.99$. Yani $E[W] = 100 \\cdot 0.01 + 0 \\cdot 0.99 = 1.00$.<br><br>Bilet başına net kâr: $N = W - 2$. Doğrusallıkla $E[N] = E[W] - 2 = 1 - 2 = \\mathbf{-\\$1.00}$.<br><br>Sonuç: ortalama olarak bilet başına $\\$1$ kaybedersin. 1000 bilet üzerinden yaklaşık $\\$1000$ kayıp beklenebilir. Piyango <em>aleyhte</em>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK 7 &mdash; ADİL SİGORTA PRİMİ</div><div class="example-body">Bir sigorta şirketi, müşterisinin evi yanarsa $\\$10\\,000$ ödeyen bir poliçe satar. Bir yılda yangın olasılığı $0.001$. Şirketin alacağı <em>adil prim</em> nedir?<br><br>$C$ şirketin ödediği maliyet olsun: $C = 10000$ olasılıkla $0.001$, aksi halde $C = 0$.<br><br>$E[C] = 10000 \\cdot 0.001 + 0 \\cdot 0.999 = \\mathbf{\\$10.00}$.<br><br>Adil prim yılda $\\$10$'dur: beklenen ödemeye tam olarak eşittir. Pratikte şirket overhead ve kâr için daha fazla (mesela $\\$15$) talep eder; bu fazlalık şirketin müşteri başına beklenen kazancıdır.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lehte oyun</div><div class="card-body">$E[\\text{net profit}] > 0$. Yapabiliyorsan oyna. Bir avantajın yoksa gerçek hayatta nadirdir.</div></div>
<div class="calc-card"><div class="card-title">Adil oyun</div><div class="card-body">$E[\\text{net profit}] = 0$. Uzun vadede başabaş. "Beklenen" sonuç sıfır kazançtır.</div></div>
<div class="calc-card"><div class="card-title">Aleyhte oyun</div><div class="card-body">$E[\\text{net profit}] < 0$. Ortalama olarak kaybedersin. Piyangolar, kasino oyunları, çoğu "hızlı zengin ol" planları.</div></div>
</div>

<div class="l-note"><strong>İnce bir uyarı.</strong> Beklenen değer çok sayıda oyunda <em>ortalama</em> hakkında bilgi verir. Yalnızca bir kez oynarsan, $10^{-6}$ olasılıkla $\\$1\\,000\\,000$ kazanan $\\$1$'lık bir bilet $E = 0$'a (adil!) sahiptir ama neredeyse kesinlikle kaybedersin. İnsanlar piyango bileti almasının nedeni kısmen büyük varyanstır — küçük beklenen kayıp, hayat değiştiren bir kazanç için minik bir şans satın alır. Beklenen-değer testi oynanıp oynanmayacağına karar vermek için gerekli ama yeterli değildir.</div>

<h2 class="lesson-title">10. Yayılımı Görselleştirmek</h2>

<div class="calc-graph"><div id="plot-l101-spread-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> hepsi sıfır merkezli ama standart sapmaları $\\sigma = 1$, $\\sigma = 2$, $\\sigma = 3$ olan üç çan biçimli dağılım. $\\sigma$ büyüdükçe eğriler düzleşir ve yayılır; her eğrinin altındaki alan $1$'de kalır (toplam olasılık korunur). Standart sapma tam olarak eğrinin yatay "genişliğidir".</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-100;i<=100;i++){xs.push(i*0.1);}
function bell(x,s){return Math.exp(-x*x/(2*s*s))/(s*Math.sqrt(2*Math.PI));}
var y1=xs.map(function(x){return bell(x,1);});
var y2=xs.map(function(x){return bell(x,2);});
var y3=xs.map(function(x){return bell(x,3);});
var t1={x:xs,y:y1,mode:'lines',name:'σ = 1 (dar, yüksek)',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:y2,mode:'lines',name:'σ = 2 (orta)',line:{color:'#10b981',width:2.5}};
var t3={x:xs,y:y3,mode:'lines',name:'σ = 3 (geniş, düz)',line:{color:'#ef4444',width:2.5}};
var meanL={x:[0,0],y:[0,0.42],mode:'lines',name:'ortalama = 0',line:{color:'#f59e0b',width:1.5,dash:'dot'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x (ortalamadan uzaklık)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[-10,10]},yaxis:{title:'olasılık yoğunluğu',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l101-spread-tr',[t1,t2,t3,meanL],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. Yaygın Hatalar ve Bunlardan Nasıl Kaçınılır</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mu^2$ çıkarmayı unutmak</div><div class="card-body">$\\operatorname{Var}(X) = E[X^2] - \\mu^2$ kısa yolunda öğrenciler bazen yalnızca $E[X^2]$'yi hesaplar, düzeltmeyi unutur. Çıkarma ile her zaman bitir.</div></div>
<div class="calc-card"><div class="card-title">$E[X^2]$ ile $(E[X])^2$'yi karıştırmak</div><div class="card-body">Bunlar farklıdır! $E[X^2]$ karelerin ortalamasıdır; $(E[X])^2$ ortalamanın karesidir. Varyans tam olarak farkıdır ve fark Jensen eşitsizliğine göre negatif değildir.</div></div>
<div class="calc-card"><div class="card-title">Varyansta $a^2$ yerine $a$ kullanmak</div><div class="card-body">$\\operatorname{Var}(aX) = a^2 \\operatorname{Var}(X)$, $a \\operatorname{Var}(X)$ değil. Varyans kare birimlerde olduğundan, sabit çarpanın da karesi alınır.</div></div>
<div class="calc-card"><div class="card-title">Bağımlı değişkenlerin varyansını toplamak</div><div class="card-body">$\\operatorname{Var}(X+Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ <em>yalnızca</em> $X, Y$ bağımsızken. Beklenti için böyle bir kısıt yoktur.</div></div>
<div class="calc-card"><div class="card-title">$\\sigma$'yı toplanır gibi düşünmek</div><div class="card-body">Standart sapmalar toplanmaz: $\\sigma_{X+Y} \\neq \\sigma_X + \\sigma_Y$. Varyanslar toplanır (bağımsız değişkenler için); ancak ondan sonra karekök alınır.</div></div>
<div class="calc-card"><div class="card-title">$E[X]$'in olası bir sonuç olmasını beklemek</div><div class="card-body">Zarın ortalaması $3.5$'tir, zarda yoktur. Beklenen değer bir denge noktasıdır, bir yüz değil.</div></div>
</div>

<h2 class="lesson-title">12. Alıştırma Problemleri</h2>

<p class="l-text">Her problemi çözmeden önce kendin dene. Her biri dersteki bir veya iki fikri test ediyor.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; HİLELİ MADENİ PARA</div><div class="example-body"><strong>Bir madeni para $0.7$ olasılıkla tura geliyor. $X = 1$ tura, $X = 0$ yazı olsun. $E[X]$ ve $\\operatorname{Var}(X)$'i bul.</strong><br><br>$E[X] = 1 \\cdot 0.7 + 0 \\cdot 0.3 = 0.7$.<br><br>$E[X^2] = 1^2 \\cdot 0.7 + 0^2 \\cdot 0.3 = 0.7$. Dikkat: $X \\in \\{0, 1\\}$ olduğunda $X^2 = X$.<br><br>$\\operatorname{Var}(X) = E[X^2] - \\mu^2 = 0.7 - 0.49 = \\mathbf{0.21}$. $p$ parametreli Bernoulli göstergesi için genel formül: $\\operatorname{Var} = p(1-p)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ÖDÜL ÇARKI</div><div class="example-body"><strong>Bir çark dört eşit dilime sahip, ödüller $\\$0$, $\\$1$, $\\$3$, $\\$8$. Beklenen ödemeyi ve standart sapmasını bul.</strong><br><br>$E[X] = \\tfrac{1}{4}(0 + 1 + 3 + 8) = \\tfrac{12}{4} = 3$.<br><br>$E[X^2] = \\tfrac{1}{4}(0 + 1 + 9 + 64) = \\tfrac{74}{4} = 18.5$.<br><br>$\\operatorname{Var}(X) = 18.5 - 9 = 9.5$, $\\sigma = \\sqrt{9.5} \\approx \\mathbf{3.08}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; PANAYIR OYUNU</div><div class="example-body"><strong>Bir oyun $\\$5$ tutuyor. Adil zar atıyorsun: 6'da $\\$12$ kazanırsın, 4 veya 5'te $\\$3$, aksi halde sıfır. Beklenen net kârı hesapla. Oyun lehte, adil, yoksa aleyhte midir?</strong><br><br>Brüt kazanç $W$: $W = 12$ olasılıkla $1/6$; $W = 3$ olasılıkla $2/6$; $W = 0$ olasılıkla $3/6$.<br><br>$E[W] = 12 \\cdot \\tfrac{1}{6} + 3 \\cdot \\tfrac{2}{6} + 0 \\cdot \\tfrac{3}{6} = 2 + 1 + 0 = 3$.<br><br>Net kâr $N = W - 5$, yani $E[N] = 3 - 5 = \\mathbf{-\\$2.00}$. Oyun <strong>aleyhtedir</strong> — atış başına ortalama $\\$2$ kaybedersin.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ÜÇ ZARIN TOPLAMI</div><div class="example-body"><strong>Üç adil zar at. Toplamları $S$ olsun. $E[S]$ ve $\\operatorname{Var}(S)$'yi bul.</strong><br><br>Doğrusallıkla $E[S] = 3 \\cdot E[X] = 3 \\cdot 3.5 = \\mathbf{10.5}$.<br><br>Bağımsızlıkla $\\operatorname{Var}(S) = 3 \\cdot \\operatorname{Var}(X) = 3 \\cdot \\tfrac{35}{12} = \\tfrac{105}{12} = \\tfrac{35}{4} = \\mathbf{8.75}$.<br><br>$\\sigma_S \\approx \\sqrt{8.75} \\approx 2.96$. Standart sapma $\\sqrt{3} \\approx 1.73$ kat büyüdü, $3$ kat değil.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; OVERHEAD'Lİ SİGORTA</div><div class="example-body"><strong>Bir sigorta şirketi $A$ olayı gerçekleşirse $\\$5000$ ödüyor (olasılık $0.002$). Poliçe başına genel gider $\\$3$. Şirketin poliçe başına $\\$5$ beklenen kâr elde etmesi için prim ne olmalı?</strong><br><br>Ödeme beklenen maliyeti: $E[C] = 5000 \\cdot 0.002 = 10$.<br><br>Poliçe başına toplam beklenen gider: $10 + 3 = 13$.<br><br>$5$'lik beklenen kâr için: prim $= 13 + 5 = \\mathbf{\\$18}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; DOĞRUSALLIK KONTROLÜ</div><div class="example-body"><strong>$X$'in PMF'i $P(X = 0) = 0.5$, $P(X = 1) = 0.3$, $P(X = 2) = 0.2$. $E[X]$, $\\operatorname{Var}(X)$, ardından $E[3X + 1]$ ve $\\operatorname{Var}(3X + 1)$'i bul.</strong><br><br>$E[X] = 0(0.5) + 1(0.3) + 2(0.2) = 0.7$.<br><br>$E[X^2] = 0(0.5) + 1(0.3) + 4(0.2) = 1.1$.<br><br>$\\operatorname{Var}(X) = 1.1 - 0.49 = 0.61$.<br><br>$E[3X + 1] = 3(0.7) + 1 = \\mathbf{3.1}$, $\\operatorname{Var}(3X + 1) = 9 \\cdot 0.61 = \\mathbf{5.49}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; AYNI ORTALAMA, YAYILIM KARŞILAŞTIRMASI</div><div class="example-body"><strong>$A$ değişkeni $\\{2, 3, 4\\}$ değerlerini $\\{0.25, 0.50, 0.25\\}$ olasılıklarıyla alır. $B$ değişkeni $\\{0, 3, 6\\}$ değerlerini $\\{0.25, 0.50, 0.25\\}$ olasılıklarıyla alır. Aynı ortalamaya sahip olduklarını göster. Hangisinin varyansı daha büyük?</strong><br><br>$E[A] = 2(0.25) + 3(0.50) + 4(0.25) = 0.5 + 1.5 + 1.0 = 3$.<br>$E[B] = 0(0.25) + 3(0.50) + 6(0.25) = 0 + 1.5 + 1.5 = 3$. Aynı ortalama.<br><br>$E[A^2] = 4(0.25) + 9(0.50) + 16(0.25) = 1 + 4.5 + 4 = 9.5$, $\\operatorname{Var}(A) = 9.5 - 9 = 0.5$.<br>$E[B^2] = 0(0.25) + 9(0.50) + 36(0.25) = 0 + 4.5 + 9 = 13.5$, $\\operatorname{Var}(B) = 13.5 - 9 = 4.5$.<br><br>$\\operatorname{Var}(B) = 9 \\cdot \\operatorname{Var}(A)$ — beklenen sonuç, çünkü $B$, $A$'dan ortalamadan uzaklığı üçe katlayarak elde edilir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; ADİL OYUN FİYATI</div><div class="example-body"><strong>Bir zar atıyorsun. Kasa sana yüz değerini dolar olarak ödüyor. Oyunu adil yapan fiyat nedir?</strong><br><br>Beklenen ödeme $= E[X] = \\$3.50$. Oyunun adil olması için (beklenen net kâr sıfır), fiyat $\\mathbf{\\$3.50}$ olmalı.<br><br>Kasa $\\$4$ alırsa, oyun oyuncu için aleyhte olur (kasa için atış başına $\\$0.50$ avantaj). Kasa $\\$3$ alırsa, oyuncu için lehte olur.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kesikli rastgele değişken, sonuçlardan sayılara bir fonksiyondur; PMF $p(x_i) = P(X = x_i)$ ile tam tanımlanır</li>
<li>Beklenen değer $E[X] = \\sum_i x_i \\, p(x_i)$, uzun-vadeli ortalamadır; PMF'in ağırlık merkezidir</li>
<li>Doğrusallık: $E[aX + bY] = aE[X] + bE[Y]$, bağımsızlık gerekmez</li>
<li>Varyans $\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - \\mu^2$; aynı cevap, ikinci form genellikle daha hızlı</li>
<li>Standart sapma $\\sigma = \\sqrt{\\operatorname{Var}(X)}$; $X$ ile aynı birim; tipik sapmanın kaba boyutu</li>
<li>$\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)$ (kayma yayılımı değiştirmez; ölçekleme etkisini karesine çıkarır)</li>
<li>$\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$ yalnızca $X, Y$ bağımsızken</li>
<li>Karar kuralı: pozitif beklenen net kâr = lehte, sıfır = adil, negatif = aleyhte</li>
</ul>
</div>`

};
