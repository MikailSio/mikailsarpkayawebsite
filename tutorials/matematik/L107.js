window.LISE_MAT_L107 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You have made it to the last lesson.</strong> Across the 106 lessons before this one, you climbed from the geometry of a single angle on the unit circle, through trigonometric identities, sequences, logarithms, derivatives, integrals, and the language of probability. The final stop on this journey is the question that closes the loop on all of statistics: <em>given some data, what should we believe?</em></p>

<p class="l-text">Hypothesis testing is the formal procedure scientists, engineers, and analysts use to answer that question. A coin is tossed 100 times and lands heads 60 times &mdash; is the coin biased? A factory promises packages weighing 50 grams; a sample averages 49.5 grams &mdash; is something wrong with the line? A new drug seems to work in a small trial &mdash; is the effect real or just luck? Hypothesis testing turns each of these vague questions into a sharp yes/no decision, with a controlled probability of being wrong.</p>

<p class="l-text">This is a <em>preview</em>: a full course in statistical inference takes a year. But by the end of this lesson you will know the vocabulary &mdash; null, alternative, significance level, p-value, Type I and Type II errors, confidence interval, power &mdash; and you will be able to walk a small testing problem through from start to finish. That is enough to read a science article without being fooled, to recognize p-hacking when you see it, and to start the next stage of your mathematical education from a strong base.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Set up the null hypothesis H<sub>0</sub> (status quo) and the alternative H<sub>1</sub> (the claim) for a real problem</li>
<li>Distinguish Type I errors (false positive) from Type II errors (false negative) and read off their probabilities &alpha; and &beta;</li>
<li>Convert a sample mean or proportion into a test statistic (a z-score) and compute its p-value</li>
<li>Decide between one-tailed and two-tailed tests based on the direction of the claim</li>
<li>Build a confidence interval for a population parameter and connect it to the corresponding test</li>
<li>See why larger samples give more <em>power</em> and why p-values must never be confused with the probability that H<sub>0</sub> is true</li>
</ul>
</div>

<h2 class="lesson-title">1. The Two Hypotheses</h2>

<div class="calc-highlight"><strong>Every hypothesis test starts by writing down two statements about the world.</strong> The <em>null hypothesis</em> H<sub>0</sub> says nothing unusual is happening (the status quo, the boring case, the default). The <em>alternative</em> H<sub>1</sub> says something unusual <em>is</em> happening (the claim, the effect, the new theory). You always test H<sub>0</sub>, never H<sub>1</sub> directly. Either the data force you to reject H<sub>0</sub>, or they do not.</div>

<p class="l-text">Why this asymmetry? Because the only way to do mathematics with data is to <em>assume something about the population</em> and compute the chance of seeing what we saw. H<sub>0</sub> gives us that assumption; H<sub>1</sub> is just the negation we keep in our pocket as a backup belief. The test is a courtroom procedure: the defendant (H<sub>0</sub>) is presumed innocent. Only overwhelming evidence convicts.</p>

<div class="calc-formula"><div class="formula-label">SETTING UP A HYPOTHESIS TEST</div><div class="formula-main">$$H_0: \\text{ no effect, fair coin, equal means, etc.} \\qquad H_1: \\text{ the claim we want to evaluate}$$</div><div class="formula-sub">H<sub>0</sub> is always a statement of equality (= some value). H<sub>1</sub> is a statement of inequality (&ne;, &lt;, or &gt;).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Example: coin fairness</div><div class="card-body">H<sub>0</sub>: P(heads) = 0.5. H<sub>1</sub>: P(heads) &ne; 0.5. We assume fairness and look for evidence against it.</div></div>
<div class="calc-card"><div class="card-title">Example: factory weight</div><div class="card-body">H<sub>0</sub>: &mu; = 50 g. H<sub>1</sub>: &mu; &ne; 50 g. We assume the line is on target and look for drift.</div></div>
<div class="calc-card"><div class="card-title">Example: new drug</div><div class="card-body">H<sub>0</sub>: &mu;<sub>drug</sub> = &mu;<sub>placebo</sub>. H<sub>1</sub>: &mu;<sub>drug</sub> &gt; &mu;<sub>placebo</sub>. We assume no effect and look for improvement.</div></div>
</div>

<div class="l-note"><strong>Convention:</strong> if you can phrase the question as &quot;did anything change?&quot; H<sub>0</sub> is &quot;nothing changed.&quot; If you can phrase it as &quot;is X equal to some target?&quot; H<sub>0</sub> is &quot;yes, equal.&quot; H<sub>0</sub> is the position the data has to <em>disprove</em>.</div>

<h2 class="lesson-title">2. Two Kinds of Mistakes</h2>

<div class="calc-highlight"><strong>Because we are working with random samples, our decision can be wrong in two opposite ways.</strong> We can reject H<sub>0</sub> when it is actually true (a <em>false alarm</em>), or we can fail to reject H<sub>0</sub> when it is actually false (a <em>missed detection</em>). Both errors have probabilities, and a good test controls them both.</div>

<p class="l-text">Borrowing the language of medical screening: H<sub>0</sub> is &quot;the patient is healthy.&quot; A test that says &quot;sick&quot; when the patient is healthy is a Type I error (false positive). A test that says &quot;healthy&quot; when the patient is sick is a Type II error (false negative). The two errors have different costs, and any honest analysis names which one matters more.</p>

<div class="calc-formula"><div class="formula-label">THE TWO ERRORS</div><div class="formula-main">$$\\alpha \\;=\\; P(\\text{reject } H_0 \\mid H_0 \\text{ true}) \\qquad \\beta \\;=\\; P(\\text{fail to reject } H_0 \\mid H_0 \\text{ false})$$</div><div class="formula-sub">&alpha; is the Type I error rate. &beta; is the Type II error rate. The power of a test is 1 &minus; &beta;.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TYPE I ERROR (FALSE POSITIVE)</div><div class="compare-item">Decision: <strong>reject H<sub>0</sub></strong></div><div class="compare-item">Reality: H<sub>0</sub> was true</div><div class="compare-item">Probability: &alpha; (significance level, chosen <em>in advance</em>)</div><div class="compare-item">Cost: claiming an effect that does not exist</div></div><div class="compare-col"><div class="compare-title">TYPE II ERROR (FALSE NEGATIVE)</div><div class="compare-item">Decision: <strong>fail to reject H<sub>0</sub></strong></div><div class="compare-item">Reality: H<sub>0</sub> was false</div><div class="compare-item">Probability: &beta; (depends on the true effect size and sample size)</div><div class="compare-item">Cost: missing a real effect</div></div></div>

<p class="l-text"><strong>Why both matter.</strong> If you only protect against Type I errors, you can guarantee &alpha; is small by never rejecting H<sub>0</sub>. But then &beta; becomes 100% and the test is useless: you never detect any effect, real or not. A good test balances the two by collecting enough data so that &beta; is also small.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">A smoke alarm has H<sub>0</sub> = &quot;no fire.&quot; Type I error: alarm sounds when there is no fire (annoying but cheap). Type II error: alarm stays silent during a real fire (catastrophic). Smoke alarms are deliberately tuned with high Type I but low Type II &mdash; that is the right trade-off for that problem.</div></div>

<h2 class="lesson-title">3. The Significance Level &alpha;</h2>

<div class="calc-highlight"><strong>&alpha; is a number you choose <em>before looking at the data</em>.</strong> It is the maximum probability of Type I error you are willing to accept. The two conventional values are <strong>&alpha; = 0.05</strong> (used by most scientific fields) and <strong>&alpha; = 0.01</strong> (used when claims need to be more stringent &mdash; e.g. physics, medicine). Smaller &alpha; means a stricter test: more evidence needed to convict.</div>

<p class="l-text">The significance level divides the sample space into a <em>rejection region</em> (where we reject H<sub>0</sub>) and an <em>acceptance region</em> (where we do not). The rejection region is built so that, <em>assuming H<sub>0</sub> is true</em>, the probability of landing in it is at most &alpha;.</p>

<div class="calc-formula"><div class="formula-label">THE RULE</div><div class="formula-main">$$\\text{Reject } H_0 \\;\\;\\text{if}\\;\\; |\\text{test statistic}| \\;\\geq\\; \\text{critical value}_\\alpha$$</div><div class="formula-sub">The critical value is chosen so that, under H<sub>0</sub>, the test statistic exceeds it with probability exactly &alpha;.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">&alpha; = 0.05</div><div class="card-body">For a two-tailed z-test, the critical value is &plusmn;1.96. We reject H<sub>0</sub> if |z| &ge; 1.96. This is the most common choice in published science.</div></div>
<div class="calc-card"><div class="card-title">&alpha; = 0.01</div><div class="card-body">Critical value &plusmn;2.576. Stricter: we want only 1% chance of a false alarm. Used when the cost of being wrong is high.</div></div>
<div class="calc-card"><div class="card-title">&alpha; = 0.10</div><div class="card-body">Critical value &plusmn;1.645. Looser: 10% false-alarm rate. Sometimes used in early exploratory analysis.</div></div>
</div>

<div class="l-note"><strong>Choose &alpha; once.</strong> It is dishonest to set &alpha; = 0.05, see that your p-value is 0.07, and then &quot;switch&quot; to &alpha; = 0.10. The threshold must be picked <em>before</em> the data are inspected. Otherwise &alpha; is meaningless.</div>

<h2 class="lesson-title">4. The Test Statistic</h2>

<div class="calc-highlight"><strong>A test statistic measures how far the sample is from what H<sub>0</sub> predicts, in units of the natural sampling noise.</strong> For a population mean with known standard deviation &sigma;, the natural test statistic is the z-score of the sample mean:</div>

<div class="calc-formula"><div class="formula-label">Z-SCORE OF A SAMPLE MEAN</div><div class="formula-main">$$z \\;=\\; \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$$</div><div class="formula-sub">$\\bar{x}$ is the sample mean. $\\mu_0$ is the value H<sub>0</sub> claims for the population mean. $\\sigma/\\sqrt{n}$ is the standard error &mdash; the typical fluctuation of $\\bar{x}$ around $\\mu$ across repeated samples of size n.</div></div>

<p class="l-text">Under H<sub>0</sub>, by the Central Limit Theorem, this z is approximately a standard normal variable. A z near 0 means the sample agrees with H<sub>0</sub>. A z far from 0 means the sample disagrees. The further |z| from 0, the harder H<sub>0</sub> is to defend.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; STARTUP CALCULATION</div><div class="example-body">A factory claims its packages weigh &mu;<sub>0</sub> = 50 g, with population standard deviation &sigma; = 2 g. A sample of n = 25 packages has mean $\\bar{x} = 49.5$ g. Compute z.<br><br>$z = \\dfrac{49.5 - 50}{2/\\sqrt{25}} = \\dfrac{-0.5}{2/5} = \\dfrac{-0.5}{0.4} = \\mathbf{-1.25}$.<br><br>The sample mean is 1.25 standard errors below the claimed value &mdash; not very far. We will see in section 6 that this does <em>not</em> reject H<sub>0</sub> at &alpha; = 0.05.</div></div>

<h2 class="lesson-title">5. The p-value</h2>

<div class="calc-highlight"><strong>The p-value is the probability, assuming H<sub>0</sub> is true, of seeing a test statistic at least as extreme as the one we observed.</strong> Small p-value &rarr; what we saw is surprising under H<sub>0</sub> &rarr; reject H<sub>0</sub>. Large p-value &rarr; what we saw is unremarkable under H<sub>0</sub> &rarr; do not reject.</div>

<div class="calc-formula"><div class="formula-label">DECISION RULE WITH p-VALUE</div><div class="formula-main">$$\\text{If } p \\leq \\alpha \\;\\Rightarrow\\; \\text{reject } H_0 \\qquad\\qquad \\text{If } p > \\alpha \\;\\Rightarrow\\; \\text{do not reject } H_0$$</div><div class="formula-sub">The p-value translates &quot;how extreme&quot; into a number that can be compared directly to &alpha;.</div></div>

<p class="l-text"><strong>How to compute it for a two-tailed z-test.</strong> &quot;At least as extreme&quot; means at distance &ge; |z| from 0, in either direction. So p = P(|Z| &ge; |z|) = 2 &middot; P(Z &ge; |z|), where Z is standard normal.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z| = 1.00</div><div class="card-body">p &asymp; 0.317. Common under H<sub>0</sub> &mdash; do not reject.</div></div>
<div class="calc-card"><div class="card-title">|z| = 1.96</div><div class="card-body">p &asymp; 0.050. Borderline &mdash; exactly the &alpha; = 0.05 critical value.</div></div>
<div class="calc-card"><div class="card-title">|z| = 2.58</div><div class="card-body">p &asymp; 0.010. Stronger evidence &mdash; reject at &alpha; = 0.01.</div></div>
<div class="calc-card"><div class="card-title">|z| = 3.00</div><div class="card-body">p &asymp; 0.003. Very strong &mdash; reject at almost any conventional level.</div></div>
</div>

<div class="l-note"><strong>What p is <em>not</em>.</strong> The p-value is <em>not</em> the probability that H<sub>0</sub> is true. It is the probability of the data <em>given</em> H<sub>0</sub>. The two are different, and confusing them is the most common mistake in applied statistics. Bayesian methods do compute P(H<sub>0</sub> | data), but they require a prior; a p-value does not.</div>

<h2 class="lesson-title">6. One-Tailed vs Two-Tailed Tests</h2>

<div class="calc-highlight"><strong>The shape of the rejection region depends on the wording of H<sub>1</sub>.</strong> If H<sub>1</sub> is &quot;&ne;&quot;, both tails count (two-tailed). If H<sub>1</sub> is &quot;&gt;&quot;, only the right tail counts (one-tailed). If H<sub>1</sub> is &quot;&lt;&quot;, only the left. Choose <em>before</em> the data are seen, based on the question being asked.</div>

<div class="calc-graph"><div id="plot-l107-onetail-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a one-tailed z-test at &alpha; = 0.05. The rejection region (red) is the right tail beyond z = 1.645. If the observed z falls into the red zone, we reject H<sub>0</sub>; if it lands in the white area, we do not.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=-40;i<=40;i++){var x=i/10;xs.push(x);ys.push(Math.exp(-x*x/2)/Math.sqrt(2*Math.PI));}
var curve={x:xs,y:ys,mode:'lines',name:'standard normal',line:{color:'#3b82f6',width:2.5}};
var xr=[];var yr=[];for(var j=0;j<=100;j++){var u=1.645+j*(4-1.645)/100;xr.push(u);yr.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xr.unshift(1.645);yr.unshift(0);xr.push(4);yr.push(0);
var rej={x:xr,y:yr,fill:'toself',mode:'lines',name:'rejection (α=0.05)',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)'};
var crit={x:[1.645,1.645],y:[0,Math.exp(-1.645*1.645/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'z=1.645',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','z=1.645'],textposition:'top center',textfont:{color:'#f59e0b'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'density',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-onetail-en',[curve,rej,crit],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l107-twotail-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a two-tailed z-test at &alpha; = 0.05. The rejection region is now split between both tails (z &le; &minus;1.96 and z &ge; +1.96), each carrying probability 0.025. Two-tailed tests need a more extreme statistic to reject because the &alpha; budget is divided.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs2=[];var ys2=[];for(var i=-40;i<=40;i++){var x=i/10;xs2.push(x);ys2.push(Math.exp(-x*x/2)/Math.sqrt(2*Math.PI));}
var curve2={x:xs2,y:ys2,mode:'lines',name:'standard normal',line:{color:'#3b82f6',width:2.5}};
var xrR=[];var yrR=[];for(var j=0;j<=100;j++){var u=1.96+j*(4-1.96)/100;xrR.push(u);yrR.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xrR.unshift(1.96);yrR.unshift(0);xrR.push(4);yrR.push(0);
var xrL=[];var yrL=[];for(var j=0;j<=100;j++){var u=-4+j*(-1.96+4)/100;xrL.push(u);yrL.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xrL.unshift(-4);yrL.unshift(0);xrL.push(-1.96);yrL.push(0);
var rejR={x:xrR,y:yrR,fill:'toself',mode:'lines',name:'right tail',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)'};
var rejL={x:xrL,y:yrL,fill:'toself',mode:'lines',name:'left tail',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)',showlegend:false};
var cR={x:[1.96,1.96],y:[0,Math.exp(-1.96*1.96/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'+1.96',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','+1.96'],textposition:'top center',textfont:{color:'#f59e0b'}};
var cL={x:[-1.96,-1.96],y:[0,Math.exp(-1.96*1.96/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'−1.96',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','−1.96'],textposition:'top center',textfont:{color:'#f59e0b'}};
var lay2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'density',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-twotail-en',[curve2,rejR,rejL,cR,cL],lay2,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Two-tailed (H<sub>1</sub>: &mu; &ne; &mu;<sub>0</sub>)</div><div class="card-body">Reject if |z| &ge; 1.96 at &alpha; = 0.05. Use when you do not know in advance which direction an effect would go.</div></div>
<div class="calc-card"><div class="card-title">Right-tailed (H<sub>1</sub>: &mu; &gt; &mu;<sub>0</sub>)</div><div class="card-body">Reject if z &ge; 1.645 at &alpha; = 0.05. Use when only an increase would be of interest (e.g. new drug is better).</div></div>
<div class="calc-card"><div class="card-title">Left-tailed (H<sub>1</sub>: &mu; &lt; &mu;<sub>0</sub>)</div><div class="card-body">Reject if z &le; &minus;1.645 at &alpha; = 0.05. Use when only a decrease would be of interest (e.g. waiting time has decreased).</div></div>
</div>

<div class="l-note"><strong>Honesty rule.</strong> Choose one-tailed or two-tailed based on the <em>question</em>, not on whether your data happen to look like one tail or the other. Switching after seeing the data doubles your real Type I error rate.</div>

<h2 class="lesson-title">7. Confidence Intervals</h2>

<div class="calc-highlight"><strong>A confidence interval is the dual of a hypothesis test.</strong> Instead of asking &quot;is &mu; = &mu;<sub>0</sub>?&quot;, ask &quot;what is the range of &mu; values compatible with the data?&quot; The two views are mirror images: a 95% CI contains all &mu;<sub>0</sub> values that would <em>not</em> be rejected at the 5% level.</div>

<div class="calc-formula"><div class="formula-label">95% CONFIDENCE INTERVAL FOR &mu;</div><div class="formula-main">$$\\bar{x} \\;\\pm\\; 1.96 \\,\\cdot\\, \\frac{\\sigma}{\\sqrt{n}}$$</div><div class="formula-sub">Replace 1.96 by 2.576 for a 99% CI, by 1.645 for a 90% CI. The number is the critical value of the standard normal at the chosen confidence.</div></div>

<p class="l-text"><strong>Interpretation.</strong> A 95% CI is constructed in such a way that, across repeated samples, 95% of the intervals it produces would contain the true &mu;. It is <em>not</em> &quot;there is a 95% probability that &mu; is in this interval&quot; &mdash; the true &mu; is fixed and either in or out. The randomness is in the interval, not in &mu;.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; FACTORY CI</div><div class="example-body">From the earlier example: $\\bar{x} = 49.5$ g, &sigma; = 2 g, n = 25. The 95% CI is<br><br>$49.5 \\pm 1.96 \\cdot \\dfrac{2}{\\sqrt{25}} = 49.5 \\pm 1.96 \\cdot 0.4 = 49.5 \\pm 0.784$.<br><br>That gives <strong>(48.72, 50.28)</strong>. The claim &mu; = 50 lies <em>inside</em> this interval, so we do not reject H<sub>0</sub> at &alpha; = 0.05 &mdash; consistent with the z-test result.</div></div>

<h2 class="lesson-title">8. Sample Size and Power</h2>

<div class="calc-highlight"><strong>The standard error shrinks with $\\sqrt{n}$.</strong> Double the sample and you do not halve the noise &mdash; you only divide it by $\\sqrt{2} \\approx 1.41$. Quadruple the sample to halve the noise. This is why studies need to be large to detect small effects: small effects need small standard errors to surface above the noise.</div>

<p class="l-text"><strong>Power</strong> is the probability of correctly rejecting H<sub>0</sub> when the true mean is &mu;<sub>true</sub> &ne; &mu;<sub>0</sub>. Power = 1 &minus; &beta;. It depends on three things: the true effect size (how far &mu;<sub>true</sub> is from &mu;<sub>0</sub>), the sample size n, and the chosen significance level &alpha;. Increasing n always increases power. Increasing &alpha; also increases power, but at the cost of more false positives.</p>

<div class="calc-graph"><div id="plot-l107-power-en" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>What this plot shows:</strong> an illustrative curve of statistical power versus sample size for a fixed effect size and fixed &alpha;. Power starts low when n is small and rises towards 1 as n grows. The horizontal line at 0.80 marks the conventional minimum power recommendation &mdash; if your design cannot reach it, your test is too weak to be trustworthy.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function erf(x){var sign=x<0?-1:1;x=Math.abs(x);var a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;var t=1/(1+p*x);var y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);return sign*y;}
var ns=[];var pw=[];for(var n=5;n<=300;n+=5){var se=2/Math.sqrt(n);var d=0.5/se;var p=1-(0.5*(1+erf((1.96-d)/Math.sqrt(2))))+(0.5*(1+erf((-1.96-d)/Math.sqrt(2))));ns.push(n);pw.push(p);}
var curveP={x:ns,y:pw,mode:'lines+markers',name:'power',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:5}};
var thr={x:[5,300],y:[0.8,0.8],mode:'lines+text',name:'power = 0.80',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','0.80'],textposition:'top center',textfont:{color:'#f59e0b'}};
var layP={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'sample size n',range:[0,310],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'power = 1 − β',range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-power-en',[curveP,thr],layP,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Two studies report &quot;p = 0.03&quot;. Study A used n = 20, Study B used n = 2000. Which result do you trust more? (Both are statistically significant. But Study A may have detected a large effect with small n, while Study B may have detected a tiny &mdash; possibly meaningless &mdash; effect with huge n. Always look at the <em>effect size</em>, not just the p-value.)</div></div>

<h2 class="lesson-title">9. Worked Example 1: Is the Coin Biased?</h2>

<div class="calc-example"><div class="example-label">FULL WALKTHROUGH</div><div class="example-body"><strong>Problem.</strong> A coin is flipped n = 100 times. We observe X = 60 heads. Test whether the coin is biased at &alpha; = 0.05.<br><br><strong>Step 1 &mdash; Hypotheses.</strong> Let p = P(heads). Then H<sub>0</sub>: p = 0.5, H<sub>1</sub>: p &ne; 0.5 (two-tailed).<br><br><strong>Step 2 &mdash; Sample proportion.</strong> $\\hat{p} = 60/100 = 0.60$.<br><br><strong>Step 3 &mdash; Standard error under H<sub>0</sub>.</strong> $SE = \\sqrt{p_0(1-p_0)/n} = \\sqrt{0.5 \\cdot 0.5 / 100} = \\sqrt{0.0025} = 0.05$.<br><br><strong>Step 4 &mdash; Test statistic.</strong> $z = (\\hat{p} - p_0)/SE = (0.60 - 0.50)/0.05 = 2.00$.<br><br><strong>Step 5 &mdash; p-value.</strong> Two-tailed: $p = 2 P(Z \\geq 2.00) \\approx 2 \\cdot 0.0228 = 0.0456$.<br><br><strong>Step 6 &mdash; Decision.</strong> p = 0.0456 &lt; 0.05 = &alpha;, so <strong>reject H<sub>0</sub></strong>. There is evidence the coin is biased.<br><br><strong>Step 7 &mdash; Effect size.</strong> The point estimate is $\\hat{p} = 0.60$, a 10 percentage-point deviation from 0.5. The 95% CI is $0.60 \\pm 1.96 \\cdot 0.049 = (0.504, 0.696)$ &mdash; notice 0.5 is just barely outside, matching the borderline p-value.</div></div>

<h2 class="lesson-title">10. Worked Example 2: Factory Weights Revisited</h2>

<div class="calc-example"><div class="example-label">FULL WALKTHROUGH</div><div class="example-body"><strong>Problem.</strong> Factory claims &mu; = 50 g, &sigma; = 2 g known. Sample n = 25 gives $\\bar{x} = 49.5$ g. Test at &alpha; = 0.05.<br><br><strong>H<sub>0</sub>:</strong> &mu; = 50. <strong>H<sub>1</sub>:</strong> &mu; &ne; 50 (two-tailed because either deviation matters to quality control).<br><br><strong>Test statistic:</strong> $z = (49.5 - 50)/(2/\\sqrt{25}) = -0.5/0.4 = -1.25$.<br><br><strong>p-value:</strong> $2 P(Z \\geq 1.25) \\approx 2 \\cdot 0.1056 = 0.2113$.<br><br><strong>Decision:</strong> p = 0.21 &gt; 0.05, <strong>do not reject H<sub>0</sub></strong>. The observed mean is consistent with random sampling fluctuation; no evidence the line is off.<br><br><strong>Note.</strong> &quot;Do not reject&quot; does not mean &quot;H<sub>0</sub> is true.&quot; It means we lack evidence to overturn it. A larger sample might still reveal a small bias.</div></div>

<h2 class="lesson-title">11. Worked Example 3: Drug vs Placebo</h2>

<div class="calc-example"><div class="example-label">FULL WALKTHROUGH</div><div class="example-body"><strong>Problem.</strong> A new drug is tested against placebo. Mean blood pressure reduction in the treatment group ($\\bar{x}_T = 8.2$ mmHg, n<sub>T</sub> = 50) versus placebo ($\\bar{x}_P = 5.4$ mmHg, n<sub>P</sub> = 50). Assume known &sigma; = 6 mmHg in both. Test at &alpha; = 0.05.<br><br><strong>H<sub>0</sub>:</strong> &mu;<sub>T</sub> &minus; &mu;<sub>P</sub> = 0. <strong>H<sub>1</sub>:</strong> &mu;<sub>T</sub> &minus; &mu;<sub>P</sub> &gt; 0 (right-tailed: we only care if the drug <em>helps</em>).<br><br><strong>Standard error of difference:</strong> $SE = \\sqrt{\\sigma^2/n_T + \\sigma^2/n_P} = \\sqrt{36/50 + 36/50} = \\sqrt{1.44} = 1.2$.<br><br><strong>Test statistic:</strong> $z = (8.2 - 5.4)/1.2 = 2.8/1.2 \\approx 2.33$.<br><br><strong>p-value (right tail):</strong> $P(Z \\geq 2.33) \\approx 0.0099$.<br><br><strong>Decision:</strong> p &asymp; 0.01 &lt; 0.05, <strong>reject H<sub>0</sub></strong>. Strong evidence the drug reduces blood pressure more than placebo.<br><br>Effect size: 2.8 mmHg, a clinically meaningful number. Sample-size-based power and effect size both matter &mdash; not just the p-value.</div></div>

<h2 class="lesson-title">12. Common Errors and Pitfalls</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confusing p with P(H<sub>0</sub>)</div><div class="card-body">p = P(data | H<sub>0</sub>), not P(H<sub>0</sub> | data). A p-value of 0.04 does <em>not</em> mean &quot;there is a 4% chance H<sub>0</sub> is true.&quot; To talk about the probability of H<sub>0</sub> itself you need Bayesian methods and a prior.</div></div>
<div class="calc-card"><div class="card-title">Statistical vs practical significance</div><div class="card-body">With n large enough, even a meaningless 0.01 mmHg drug effect can become &quot;statistically significant.&quot; Always report the effect size, not just the p-value.</div></div>
<div class="calc-card"><div class="card-title">p-hacking</div><div class="card-body">Running 20 tests at &alpha; = 0.05 and reporting only the one with p &lt; 0.05 guarantees you find a &quot;result&quot; even when H<sub>0</sub> is true. The multiplicity must be corrected (Bonferroni, FDR, etc.).</div></div>
<div class="calc-card"><div class="card-title">Choosing the tail after seeing the data</div><div class="card-body">A one-tailed test halves the p-value but only if the direction was chosen <em>before</em> looking. Flipping the tail based on the sample is a common form of cheating.</div></div>
<div class="calc-card"><div class="card-title">&quot;Not significant&quot; = &quot;no effect&quot;</div><div class="card-body">Wrong. &quot;Not significant&quot; can mean either no effect or insufficient power. Absence of evidence is not evidence of absence.</div></div>
<div class="calc-card"><div class="card-title">Optional stopping</div><div class="card-body">Watching the p-value and stopping data collection as soon as p &lt; 0.05 inflates the Type I error rate well above the nominal &alpha;. The stopping rule must be fixed in advance.</div></div>
</div>

<h2 class="lesson-title">13. Practice Exercises</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1 &mdash; SET UP HYPOTHESES</div><div class="example-body"><strong>Problem.</strong> A teacher claims the average study time of her students is 4 hours per week. A sample of n = 36 students has $\\bar{x} = 3.6$ h, $\\sigma = 1.2$ h. Set up H<sub>0</sub> and H<sub>1</sub> for a two-tailed test and find z.<br><br><strong>Solution.</strong> H<sub>0</sub>: &mu; = 4. H<sub>1</sub>: &mu; &ne; 4. $z = (3.6-4)/(1.2/\\sqrt{36}) = -0.4/0.2 = \\mathbf{-2.00}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 &mdash; P-VALUE</div><div class="example-body"><strong>Problem.</strong> For Exercise 1, compute the two-tailed p-value and decide at &alpha; = 0.05.<br><br><strong>Solution.</strong> $p = 2 P(Z \\geq 2.00) \\approx 2 \\cdot 0.0228 = 0.0456$. p &lt; 0.05, so <strong>reject H<sub>0</sub></strong>. Evidence study time differs from 4 hours.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 &mdash; CONFIDENCE INTERVAL</div><div class="example-body"><strong>Problem.</strong> Build a 95% CI for the population mean from Exercise 1.<br><br><strong>Solution.</strong> $3.6 \\pm 1.96 \\cdot 0.2 = 3.6 \\pm 0.392 = \\mathbf{(3.21, 3.99)}$. Notice 4 is just outside &mdash; consistent with the borderline rejection.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 &mdash; ONE-TAILED</div><div class="example-body"><strong>Problem.</strong> A factory engineer claims a new process reduces defect rate below the current 8%. Sample of n = 200 items shows 12 defective. Test H<sub>1</sub>: p &lt; 0.08 at &alpha; = 0.05.<br><br><strong>Solution.</strong> $\\hat{p} = 12/200 = 0.06$. $SE = \\sqrt{0.08 \\cdot 0.92/200} = \\sqrt{0.000368} \\approx 0.01918$. $z = (0.06 - 0.08)/0.01918 \\approx -1.043$. Left-tailed critical value at &alpha; = 0.05 is &minus;1.645; our z is not extreme enough. p-value = P(Z &le; &minus;1.043) &asymp; 0.148. <strong>Do not reject</strong>. Insufficient evidence the new process is better.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 &mdash; SAMPLE SIZE</div><div class="example-body"><strong>Problem.</strong> How large must n be to detect a true mean shift of $\\Delta = 0.5$ from $\\mu_0$ at &alpha; = 0.05 (two-tailed) with power 0.80, given &sigma; = 2?<br><br><strong>Solution.</strong> Required: $n = \\left(\\dfrac{(z_{\\alpha/2} + z_\\beta)\\sigma}{\\Delta}\\right)^2 = \\left(\\dfrac{(1.96 + 0.84) \\cdot 2}{0.5}\\right)^2 = (11.2)^2 = \\mathbf{125.4}$. Round up to <strong>n = 126</strong>.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 &mdash; TWO-SAMPLE</div><div class="example-body"><strong>Problem.</strong> Two cities' commute times: City A ($\\bar{x}_A = 28$ min, n<sub>A</sub> = 40), City B ($\\bar{x}_B = 32$ min, n<sub>B</sub> = 40). Both have &sigma; = 10. Test H<sub>0</sub>: $\\mu_A = \\mu_B$ vs H<sub>1</sub>: $\\mu_A \\neq \\mu_B$ at &alpha; = 0.05.<br><br><strong>Solution.</strong> $SE = \\sqrt{100/40 + 100/40} = \\sqrt{5} \\approx 2.236$. $z = (28-32)/2.236 \\approx -1.789$. Two-tailed: $p \\approx 2 \\cdot 0.0368 = 0.0736$. p &gt; 0.05, <strong>do not reject</strong> &mdash; difference is suggestive but not significant at the 5% level.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 &mdash; INTERPRET A P-VALUE</div><div class="example-body"><strong>Problem.</strong> A study reports p = 0.30 for a test of H<sub>0</sub>: &mu; = 100. True or false: &quot;There is a 30% probability that &mu; = 100.&quot;<br><br><strong>Solution.</strong> <strong>False.</strong> The p-value is the probability of the observed data (or more extreme) <em>assuming</em> H<sub>0</sub> is true. It is not the probability of H<sub>0</sub>. Correct phrasing: &quot;If H<sub>0</sub> were true, we would see data this extreme about 30% of the time.&quot;</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 &mdash; TYPE I VS TYPE II</div><div class="example-body"><strong>Problem.</strong> A medical test for a rare disease has H<sub>0</sub>: patient healthy. Test gives a positive result for 5% of healthy people (Type I) and misses 2% of sick people (Type II). What are &alpha; and &beta;? What is the power?<br><br><strong>Solution.</strong> &alpha; = 0.05 (Type I rate). &beta; = 0.02 (Type II rate). Power = 1 &minus; &beta; = 0.98 (the test catches 98% of true cases).</div></div>

<h2 class="lesson-title">14. Where to Go Next</h2>

<p class="l-text">This lesson opened the door to <strong>inferential statistics</strong> &mdash; the bridge between data and decision. The full subject contains many more tools you will meet later: <em>t-tests</em> for when the population &sigma; is unknown and n is small; <em>chi-square tests</em> for categorical data and contingency tables; <em>ANOVA</em> for comparing three or more groups; <em>regression</em> for testing relationships between variables; <em>nonparametric tests</em> when the normal model fails. And on the modern side: <em>Bayesian inference</em>, where you compute actual probabilities for H<sub>0</sub> using priors; <em>causal inference</em>, where you distinguish correlation from cause; and <em>machine learning</em>, where the same z-scores and confidence ideas underlie every model evaluation.</p>

<p class="l-text">But the core idea you have now mastered &mdash; that a statement about the world can be tested against random data, with a carefully bounded chance of being wrong &mdash; is the foundation. Every later technique sits on top of it.</p>

<div class="calc-highlight" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(245,158,11,0.08));border-left:4px solid #f59e0b;padding:1.3rem 1.4rem"><strong>Congratulations.</strong> You have completed all 107 lessons of the High School Mathematics curriculum. From measuring an angle on the unit circle to testing a hypothesis with a p-value, you have walked the same path that humanity took over four millennia &mdash; from Babylonian astronomy to modern data science. The same notation, the same logic, the same proof culture you now hold in your head is what every engineer, scientist, economist, and statistician uses every day. Use it well. The mathematics is now part of you.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Every test states a null H<sub>0</sub> (status quo) and an alternative H<sub>1</sub> (the claim)</li>
<li>Type I error: rejecting H<sub>0</sub> when it is true; probability &alpha; (significance level)</li>
<li>Type II error: failing to reject H<sub>0</sub> when it is false; probability &beta;; power = 1 &minus; &beta;</li>
<li>z-score: $z = (\\bar{x} - \\mu_0)/(\\sigma/\\sqrt{n})$</li>
<li>p-value: P(data this extreme or more, given H<sub>0</sub>); reject when p &le; &alpha;</li>
<li>One-tailed vs two-tailed depends on H<sub>1</sub>; choose <em>before</em> seeing data</li>
<li>95% confidence interval: $\\bar{x} \\pm 1.96 \\cdot \\sigma/\\sqrt{n}$</li>
<li>Larger n shrinks SE by $\\sqrt{n}$ &mdash; more power, more sensitivity</li>
<li>p is not P(H<sub>0</sub>); statistical significance is not practical significance</li>
<li>Congratulations &mdash; the High School Math curriculum is complete!</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Son derse ulaştın.</strong> Bundan önceki 106 ders boyunca, birim çember üzerindeki tek bir açının geometrisinden trigonometrik özdeşliklere, dizilere, logaritmalara, türevlere, integrallere ve olasılığın diline tırmandın. Bu yolculuğun son durağı tüm istatistiği bağlayan soruyu kapatıyor: <em>elimizde veri varken neye inanmalıyız?</em></p>

<p class="l-text">Hipotez testi, bilim insanlarının, mühendislerin ve analistlerin bu soruyu cevaplamak için kullandıkları resmî yöntemdir. Bir madeni para 100 kez atılıyor ve 60 kez yazı geliyor &mdash; para hileli mi? Bir fabrika 50 gram ağırlığında paketler vaat ediyor; örneklem ortalaması 49.5 gram &mdash; hatta bir bozukluk mu var? Yeni bir ilaç küçük bir denemede işe yarıyor gibi &mdash; etki gerçek mi yoksa şans mı? Hipotez testi bu belirsiz soruların her birini, yanılma olasılığı kontrol altında bir net evet/hayır kararına dönüştürür.</p>

<p class="l-text">Bu bir <em>önizleme</em>: tam bir istatistiksel çıkarım dersi bir yıl sürer. Ama bu dersin sonunda dağarcığını oluşturmuş olacaksın &mdash; sıfır hipotezi, alternatif, anlamlılık düzeyi, p-değeri, Tip I ve Tip II hatalar, güven aralığı, güç &mdash; ve küçük bir test problemini baştan sona yürütebileceksin. Bu, bir bilim makalesini kanmadan okumaya, gördüğünde p-hacking'i tanımaya ve matematik eğitiminin bir sonraki aşamasına sağlam bir tabandan başlamaya yeter.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Gerçek bir problem için sıfır hipotezi H<sub>0</sub> (statüko) ve alternatif H<sub>1</sub> (iddia) kurmayı</li>
<li>Tip I hatayı (yanlış pozitif) Tip II hatadan (yanlış negatif) ayırt etmeyi ve olasılıkları &alpha; ile &beta;'yı okumayı</li>
<li>Bir örneklem ortalamasını veya oranını bir test istatistiğine (z-skoru) dönüştürmeyi ve p-değerini hesaplamayı</li>
<li>İddianın yönüne göre tek-kuyruklu ile çift-kuyruklu testler arasında karar vermeyi</li>
<li>Bir kitle parametresi için güven aralığı kurmayı ve karşılık gelen testle bağlantısını görmeyi</li>
<li>Büyük örneklemlerin neden daha fazla <em>güç</em> verdiğini ve p-değerinin neden H<sub>0</sub>'ın doğru olma olasılığıyla asla karıştırılmaması gerektiğini</li>
</ul>
</div>

<h2 class="lesson-title">1. İki Hipotez</h2>

<div class="calc-highlight"><strong>Her hipotez testi, dünya hakkında iki ifade yazarak başlar.</strong> <em>Sıfır hipotezi</em> H<sub>0</sub>, olağandışı bir şeyin olmadığını söyler (statüko, sıkıcı durum, varsayılan). <em>Alternatif</em> H<sub>1</sub>, olağandışı bir şeyin <em>olduğunu</em> söyler (iddia, etki, yeni teori). Her zaman H<sub>0</sub>'ı test edersin, H<sub>1</sub>'i doğrudan asla. Ya veri seni H<sub>0</sub>'ı reddetmeye zorlar, ya da zorlamaz.</div>

<p class="l-text">Bu asimetri neden? Çünkü veriyle matematik yapmanın tek yolu <em>kitle hakkında bir şey varsaymak</em> ve gördüğümüzü görme olasılığını hesaplamaktır. H<sub>0</sub> bize bu varsayımı verir; H<sub>1</sub> sadece cebimizde yedek inanç olarak tuttuğumuz olumsuzlamadır. Test bir mahkeme prosedürüdür: sanık (H<sub>0</sub>) suçsuz sayılır. Sadece ezici delil mahkûm eder.</p>

<div class="calc-formula"><div class="formula-label">HİPOTEZ TESTİ KURMA</div><div class="formula-main">$$H_0: \\text{ etki yok, hilesiz para, esit ortalamalar, vb.} \\qquad H_1: \\text{ degerlendirmek istedigimiz iddia}$$</div><div class="formula-sub">H<sub>0</sub> her zaman eşitlik ifadesidir (= bir değer). H<sub>1</sub> eşitsizlik ifadesidir (&ne;, &lt; veya &gt;).</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Örnek: para hilesizliği</div><div class="card-body">H<sub>0</sub>: P(yazı) = 0.5. H<sub>1</sub>: P(yazı) &ne; 0.5. Hilesizliği varsayarız ve aleyhine delil ararız.</div></div>
<div class="calc-card"><div class="card-title">Örnek: fabrika ağırlığı</div><div class="card-body">H<sub>0</sub>: &mu; = 50 g. H<sub>1</sub>: &mu; &ne; 50 g. Hat hedefte varsayarız ve kayma ararız.</div></div>
<div class="calc-card"><div class="card-title">Örnek: yeni ilaç</div><div class="card-body">H<sub>0</sub>: &mu;<sub>ilaç</sub> = &mu;<sub>plasebo</sub>. H<sub>1</sub>: &mu;<sub>ilaç</sub> &gt; &mu;<sub>plasebo</sub>. Etki yok varsayarız ve iyileşme ararız.</div></div>
</div>

<div class="l-note"><strong>Sözleşme:</strong> soruyu &quot;bir şey değişti mi?&quot; diye ifade edebiliyorsan H<sub>0</sub> &quot;hiçbir şey değişmedi&quot;dir. &quot;X bir hedef değere eşit mi?&quot; diye ifade edebiliyorsan H<sub>0</sub> &quot;evet, eşit&quot;tir. H<sub>0</sub>, verinin <em>çürütmesi</em> gereken pozisyondur.</div>

<h2 class="lesson-title">2. İki Tür Hata</h2>

<div class="calc-highlight"><strong>Rastgele örneklemlerle çalıştığımız için kararımız iki zıt yolla yanlış olabilir.</strong> H<sub>0</sub> aslında doğruyken onu reddedebiliriz (bir <em>yanlış alarm</em>) ya da H<sub>0</sub> aslında yanlışken onu reddetmeyebiliriz (bir <em>kaçırılmış tespit</em>). Her iki hatanın da olasılıkları vardır ve iyi bir test her ikisini de kontrol eder.</div>

<p class="l-text">Tıbbi tarama dilini ödünç alalım: H<sub>0</sub> &quot;hasta sağlıklı&quot; demektir. Hasta sağlıklıyken &quot;hasta&quot; diyen bir test Tip I hatadır (yanlış pozitif). Hasta gerçekten hastayken &quot;sağlıklı&quot; diyen bir test Tip II hatadır (yanlış negatif). İki hatanın maliyetleri farklıdır ve dürüst herhangi bir analiz hangisinin daha önemli olduğunu adlandırır.</p>

<div class="calc-formula"><div class="formula-label">İKİ HATA</div><div class="formula-main">$$\\alpha \\;=\\; P(H_0 \\text{ reddet} \\mid H_0 \\text{ dogru}) \\qquad \\beta \\;=\\; P(H_0 \\text{ reddetme} \\mid H_0 \\text{ yanlis})$$</div><div class="formula-sub">&alpha; Tip I hata oranıdır. &beta; Tip II hata oranıdır. Bir testin gücü 1 &minus; &beta;'dır.</div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TİP I HATA (YANLIŞ POZİTİF)</div><div class="compare-item">Karar: <strong>H<sub>0</sub> reddet</strong></div><div class="compare-item">Gerçek: H<sub>0</sub> doğruydu</div><div class="compare-item">Olasılık: &alpha; (anlamlılık düzeyi, <em>önceden</em> seçilir)</div><div class="compare-item">Maliyet: var olmayan bir etkiyi iddia etmek</div></div><div class="compare-col"><div class="compare-title">TİP II HATA (YANLIŞ NEGATİF)</div><div class="compare-item">Karar: <strong>H<sub>0</sub> reddetme</strong></div><div class="compare-item">Gerçek: H<sub>0</sub> yanlıştı</div><div class="compare-item">Olasılık: &beta; (gerçek etki büyüklüğüne ve örneklem büyüklüğüne bağlıdır)</div><div class="compare-item">Maliyet: gerçek bir etkiyi kaçırmak</div></div></div>

<p class="l-text"><strong>Neden her ikisi de önemli.</strong> Sadece Tip I hataya karşı korunursan, H<sub>0</sub>'ı asla reddetmeyerek &alpha;'yı küçük tutabilirsin. Ama o zaman &beta; %100 olur ve test işe yaramaz: gerçek olsun olmasın hiçbir etkiyi tespit etmezsin. İyi bir test, &beta;'nın da küçük olmasını sağlayacak kadar veri toplayarak ikisini dengeler.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">Bir duman alarmında H<sub>0</sub> = &quot;yangın yok&quot;. Tip I hata: yangın yokken alarm çalar (rahatsız edici ama ucuz). Tip II hata: gerçek yangın sırasında alarm sessiz kalır (felaket). Duman alarmları kasıtlı olarak yüksek Tip I, düşük Tip II ile ayarlanır &mdash; bu problem için doğru takas budur.</div></div>

<h2 class="lesson-title">3. Anlamlılık Düzeyi &alpha;</h2>

<div class="calc-highlight"><strong>&alpha; <em>veriye bakmadan önce</em> seçtiğin bir sayıdır.</strong> Kabul etmeye razı olduğun en yüksek Tip I hata olasılığıdır. İki geleneksel değer <strong>&alpha; = 0.05</strong> (çoğu bilim alanı tarafından kullanılır) ve <strong>&alpha; = 0.01</strong>'dir (iddiaların daha sıkı olması gerektiğinde &mdash; örn. fizik, tıp). Daha küçük &alpha; daha katı bir test demek: mahkûm etmek için daha fazla delil gerekir.</div>

<p class="l-text">Anlamlılık düzeyi, örneklem uzayını bir <em>red bölgesine</em> (H<sub>0</sub>'ı reddettiğimiz yer) ve bir <em>kabul bölgesine</em> (reddetmediğimiz yer) ayırır. Red bölgesi öyle kurulur ki, <em>H<sub>0</sub>'ın doğru olduğu varsayımı altında</em>, oraya düşme olasılığı en fazla &alpha;'dır.</p>

<div class="calc-formula"><div class="formula-label">KURAL</div><div class="formula-main">$$H_0 \\text{'i reddet} \\;\\;\\text{eger}\\;\\; |\\text{test istatistigi}| \\;\\geq\\; \\text{kritik deger}_\\alpha$$</div><div class="formula-sub">Kritik değer öyle seçilir ki H<sub>0</sub> altında test istatistiği bunu tam olarak &alpha; olasılıkla aşar.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">&alpha; = 0.05</div><div class="card-body">İki kuyruklu z-testi için kritik değer &plusmn;1.96. |z| &ge; 1.96 ise H<sub>0</sub>'ı reddederiz. Yayımlanan bilimde en yaygın seçim.</div></div>
<div class="calc-card"><div class="card-title">&alpha; = 0.01</div><div class="card-body">Kritik değer &plusmn;2.576. Daha katı: sadece %1 yanlış alarm istiyoruz. Yanılma maliyeti yüksekken kullanılır.</div></div>
<div class="calc-card"><div class="card-title">&alpha; = 0.10</div><div class="card-body">Kritik değer &plusmn;1.645. Daha gevşek: %10 yanlış alarm oranı. Bazen erken keşifsel analizde kullanılır.</div></div>
</div>

<div class="l-note"><strong>&alpha;'yı bir kez seç.</strong> &alpha; = 0.05 ayarlayıp p-değerinin 0.07 olduğunu görüp ardından &alpha; = 0.10'a &quot;geçmek&quot; sahtekarlıktır. Eşik verilere bakılmadan <em>önce</em> seçilmelidir. Aksi halde &alpha; anlamsızdır.</div>

<h2 class="lesson-title">4. Test İstatistiği</h2>

<div class="calc-highlight"><strong>Bir test istatistiği, örneklemin H<sub>0</sub>'ın öngördüğünden ne kadar uzakta olduğunu doğal örnekleme gürültüsü birimleriyle ölçer.</strong> Standart sapması &sigma; bilinen bir kitle ortalaması için doğal test istatistiği örneklem ortalamasının z-skorudur:</div>

<div class="calc-formula"><div class="formula-label">ÖRNEKLEM ORTALAMASININ Z-SKORU</div><div class="formula-main">$$z \\;=\\; \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$$</div><div class="formula-sub">$\\bar{x}$ örneklem ortalaması. $\\mu_0$ H<sub>0</sub>'ın kitle ortalaması için iddia ettiği değer. $\\sigma/\\sqrt{n}$ standart hata &mdash; n büyüklüğünde tekrarlanan örneklemler üzerinde $\\bar{x}$'in $\\mu$ etrafındaki tipik dalgalanması.</div></div>

<p class="l-text">H<sub>0</sub> altında, Merkezi Limit Teoremi'yle, bu z yaklaşık olarak standart normal bir değişkendir. 0'a yakın bir z, örneklemin H<sub>0</sub> ile uyuştuğu anlamına gelir. 0'dan uzak bir z uyuşmadığı anlamına gelir. |z|, 0'dan ne kadar uzaksa, H<sub>0</sub>'ı savunmak o kadar zordur.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; BAŞLANGIÇ HESABI</div><div class="example-body">Bir fabrika paketlerinin &mu;<sub>0</sub> = 50 g ağırlığında olduğunu, kitle standart sapmasının &sigma; = 2 g olduğunu iddia ediyor. n = 25 paketlik bir örneklemin ortalaması $\\bar{x} = 49.5$ g. z'yi hesapla.<br><br>$z = \\dfrac{49.5 - 50}{2/\\sqrt{25}} = \\dfrac{-0.5}{2/5} = \\dfrac{-0.5}{0.4} = \\mathbf{-1.25}$.<br><br>Örneklem ortalaması, iddia edilen değerin 1.25 standart hata altında &mdash; çok uzak değil. 6. bölümde göreceğimiz gibi bu, &alpha; = 0.05'te H<sub>0</sub>'ı <em>reddetmez</em>.</div></div>

<h2 class="lesson-title">5. p-değeri</h2>

<div class="calc-highlight"><strong>p-değeri, H<sub>0</sub>'ın doğru olduğu varsayılarak, gözlemlediğimiz kadar veya daha da uç bir test istatistiği görme olasılığıdır.</strong> Küçük p-değeri &rarr; gördüğümüz H<sub>0</sub> altında şaşırtıcı &rarr; H<sub>0</sub> reddedilir. Büyük p-değeri &rarr; gördüğümüz H<sub>0</sub> altında olağan &rarr; reddetme.</div>

<div class="calc-formula"><div class="formula-label">p-DEGERLI KARAR KURALI</div><div class="formula-main">$$\\text{Eger } p \\leq \\alpha \\;\\Rightarrow\\; H_0 \\text{ reddet} \\qquad\\qquad \\text{Eger } p > \\alpha \\;\\Rightarrow\\; H_0 \\text{ reddetme}$$</div><div class="formula-sub">p-değeri &quot;ne kadar uç&quot; sorusunu doğrudan &alpha; ile karşılaştırılabilen bir sayıya çevirir.</div></div>

<p class="l-text"><strong>İki-kuyruklu bir z-testi için nasıl hesaplanır.</strong> &quot;En az bu kadar uç&quot; demek, her iki yönde de 0'dan |z| veya daha büyük uzaklıktaki değerler demek. Yani p = P(|Z| &ge; |z|) = 2 &middot; P(Z &ge; |z|), burada Z standart normaldir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">|z| = 1.00</div><div class="card-body">p &asymp; 0.317. H<sub>0</sub> altında yaygın &mdash; reddetme.</div></div>
<div class="calc-card"><div class="card-title">|z| = 1.96</div><div class="card-body">p &asymp; 0.050. Sınırda &mdash; tam olarak &alpha; = 0.05 kritik değeri.</div></div>
<div class="calc-card"><div class="card-title">|z| = 2.58</div><div class="card-body">p &asymp; 0.010. Daha güçlü delil &mdash; &alpha; = 0.01'de reddet.</div></div>
<div class="calc-card"><div class="card-title">|z| = 3.00</div><div class="card-body">p &asymp; 0.003. Çok güçlü &mdash; neredeyse her geleneksel düzeyde reddet.</div></div>
</div>

<div class="l-note"><strong>p <em>ne değildir</em>.</strong> p-değeri H<sub>0</sub>'ın doğru olma olasılığı <em>değildir</em>. H<sub>0</sub> <em>verildiğinde</em> verinin olasılığıdır. İkisi farklıdır ve karıştırmak uygulamalı istatistikteki en yaygın hatadır. Bayesçi yöntemler P(H<sub>0</sub> | veri)'yi hesaplar ama bir ön dağılım gerektirir; p-değeri gerektirmez.</div>

<h2 class="lesson-title">6. Tek-Kuyruklu ve İki-Kuyruklu Testler</h2>

<div class="calc-highlight"><strong>Red bölgesinin şekli H<sub>1</sub>'in ifadesine bağlıdır.</strong> H<sub>1</sub> &quot;&ne;&quot; ise iki kuyruk da sayılır (iki-kuyruklu). H<sub>1</sub> &quot;&gt;&quot; ise yalnızca sağ kuyruk sayılır (tek-kuyruklu). H<sub>1</sub> &quot;&lt;&quot; ise yalnızca sol. Veri görülmeden <em>önce</em>, sorulan soruya göre seç.</div>

<div class="calc-graph"><div id="plot-l107-onetail-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> &alpha; = 0.05'te tek-kuyruklu bir z-testi. Red bölgesi (kırmızı) z = 1.645'in ötesindeki sağ kuyruktur. Gözlemlenen z kırmızı bölgeye düşerse H<sub>0</sub>'ı reddederiz; beyaz alanda kalırsa reddetmeyiz.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xsT=[];var ysT=[];for(var i=-40;i<=40;i++){var x=i/10;xsT.push(x);ysT.push(Math.exp(-x*x/2)/Math.sqrt(2*Math.PI));}
var curveT={x:xsT,y:ysT,mode:'lines',name:'standart normal',line:{color:'#3b82f6',width:2.5}};
var xrT=[];var yrT=[];for(var j=0;j<=100;j++){var u=1.645+j*(4-1.645)/100;xrT.push(u);yrT.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xrT.unshift(1.645);yrT.unshift(0);xrT.push(4);yrT.push(0);
var rejT={x:xrT,y:yrT,fill:'toself',mode:'lines',name:'red bölgesi (α=0.05)',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)'};
var critT={x:[1.645,1.645],y:[0,Math.exp(-1.645*1.645/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'z=1.645',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','z=1.645'],textposition:'top center',textfont:{color:'#f59e0b'}};
var layTk={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'yoğunluk',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-onetail-tr',[curveT,rejT,critT],layTk,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l107-twotail-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> &alpha; = 0.05'te iki-kuyruklu z-testi. Red bölgesi artık iki kuyruk arasında bölünmüş (z &le; &minus;1.96 ve z &ge; +1.96), her biri 0.025 olasılık taşıyor. İki-kuyruklu testler reddetmek için daha uç bir istatistiğe ihtiyaç duyar çünkü &alpha; bütçesi bölünmüştür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xsT2=[];var ysT2=[];for(var i=-40;i<=40;i++){var x=i/10;xsT2.push(x);ysT2.push(Math.exp(-x*x/2)/Math.sqrt(2*Math.PI));}
var curveT2={x:xsT2,y:ysT2,mode:'lines',name:'standart normal',line:{color:'#3b82f6',width:2.5}};
var xrRT=[];var yrRT=[];for(var j=0;j<=100;j++){var u=1.96+j*(4-1.96)/100;xrRT.push(u);yrRT.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xrRT.unshift(1.96);yrRT.unshift(0);xrRT.push(4);yrRT.push(0);
var xrLT=[];var yrLT=[];for(var j=0;j<=100;j++){var u=-4+j*(-1.96+4)/100;xrLT.push(u);yrLT.push(Math.exp(-u*u/2)/Math.sqrt(2*Math.PI));}
xrLT.unshift(-4);yrLT.unshift(0);xrLT.push(-1.96);yrLT.push(0);
var rejRT={x:xrRT,y:yrRT,fill:'toself',mode:'lines',name:'sağ kuyruk',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)'};
var rejLT={x:xrLT,y:yrLT,fill:'toself',mode:'lines',name:'sol kuyruk',line:{color:'#ef4444',width:1},fillcolor:'rgba(239,68,68,0.45)',showlegend:false};
var cRT={x:[1.96,1.96],y:[0,Math.exp(-1.96*1.96/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'+1.96',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','+1.96'],textposition:'top center',textfont:{color:'#f59e0b'}};
var cLT={x:[-1.96,-1.96],y:[0,Math.exp(-1.96*1.96/2)/Math.sqrt(2*Math.PI)],mode:'lines+text',name:'−1.96',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','−1.96'],textposition:'top center',textfont:{color:'#f59e0b'}};
var layT2={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z',range:[-4,4],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'yoğunluk',range:[0,0.45],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-twotail-tr',[curveT2,rejRT,rejLT,cRT,cLT],layT2,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İki-kuyruklu (H<sub>1</sub>: &mu; &ne; &mu;<sub>0</sub>)</div><div class="card-body">&alpha; = 0.05'te |z| &ge; 1.96 ise reddet. Etkinin hangi yönde olacağını önceden bilmediğinde kullan.</div></div>
<div class="calc-card"><div class="card-title">Sağ-kuyruklu (H<sub>1</sub>: &mu; &gt; &mu;<sub>0</sub>)</div><div class="card-body">&alpha; = 0.05'te z &ge; 1.645 ise reddet. Sadece artış ilgi çekici olduğunda kullan (örn. yeni ilaç daha iyi).</div></div>
<div class="calc-card"><div class="card-title">Sol-kuyruklu (H<sub>1</sub>: &mu; &lt; &mu;<sub>0</sub>)</div><div class="card-body">&alpha; = 0.05'te z &le; &minus;1.645 ise reddet. Sadece azalış ilgi çekici olduğunda kullan (örn. bekleme süresi azaldı).</div></div>
</div>

<div class="l-note"><strong>Dürüstlük kuralı.</strong> Tek-kuyruklu mu iki-kuyruklu mu kararını <em>soruya</em> göre ver, verilerin bir kuyruğa benzemesine değil. Veriyi gördükten sonra kuyruğu değiştirmek gerçek Tip I hata oranını iki katına çıkarır.</div>

<h2 class="lesson-title">7. Güven Aralıkları</h2>

<div class="calc-highlight"><strong>Bir güven aralığı, hipotez testinin ikilisidir.</strong> &quot;&mu; = &mu;<sub>0</sub> mı?&quot; diye sormak yerine, &quot;verilerle uyumlu &mu; değerlerinin aralığı nedir?&quot; diye sor. İki bakış birbirinin ayna görüntüsüdür: %95 GA, %5 düzeyinde <em>reddedilmeyecek</em> tüm &mu;<sub>0</sub> değerlerini içerir.</div>

<div class="calc-formula"><div class="formula-label">&mu; İÇİN %95 GÜVEN ARALIĞI</div><div class="formula-main">$$\\bar{x} \\;\\pm\\; 1.96 \\,\\cdot\\, \\frac{\\sigma}{\\sqrt{n}}$$</div><div class="formula-sub">%99 GA için 1.96'yı 2.576 ile, %90 GA için 1.645 ile değiştir. Sayı, seçilen güven düzeyindeki standart normalin kritik değeridir.</div></div>

<p class="l-text"><strong>Yorum.</strong> %95 GA öyle bir biçimde kurulur ki, tekrarlanan örneklemler üzerinde, ürettiği aralıkların %95'i gerçek &mu;'yü içerir. &quot;Gerçek &mu;'nün bu aralıkta olma olasılığı %95'tir&quot; <em>değildir</em> &mdash; gerçek &mu; sabittir ve ya içeride ya dışarıdadır. Rastlantısallık aralıkta, &mu;'de değil.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; FABRİKA GA</div><div class="example-body">Önceki örnekten: $\\bar{x} = 49.5$ g, &sigma; = 2 g, n = 25. %95 GA<br><br>$49.5 \\pm 1.96 \\cdot \\dfrac{2}{\\sqrt{25}} = 49.5 \\pm 1.96 \\cdot 0.4 = 49.5 \\pm 0.784$.<br><br>Bu <strong>(48.72, 50.28)</strong> verir. &mu; = 50 iddiası bu aralığın <em>içinde</em> yer alıyor, yani &alpha; = 0.05'te H<sub>0</sub>'ı reddetmiyoruz &mdash; z-testi sonucuyla tutarlı.</div></div>

<h2 class="lesson-title">8. Örneklem Büyüklüğü ve Güç</h2>

<div class="calc-highlight"><strong>Standart hata $\\sqrt{n}$ ile küçülür.</strong> Örneklemi iki katına çıkardığında gürültüyü yarıya indirmezsin &mdash; sadece $\\sqrt{2} \\approx 1.41$'e bölersin. Gürültüyü yarıya indirmek için örneklemi dört katına çıkar. Çalışmaların küçük etkileri tespit etmek için büyük olması gerekmesinin nedeni budur: küçük etkilerin gürültünün üstüne çıkması için küçük standart hatalara ihtiyaç vardır.</div>

<p class="l-text"><strong>Güç</strong>, gerçek ortalama &mu;<sub>gerçek</sub> &ne; &mu;<sub>0</sub> iken H<sub>0</sub>'ı doğru biçimde reddetme olasılığıdır. Güç = 1 &minus; &beta;. Üç şeye bağlıdır: gerçek etki büyüklüğü (&mu;<sub>gerçek</sub>'in &mu;<sub>0</sub>'dan ne kadar uzak olduğu), örneklem büyüklüğü n ve seçilen anlamlılık düzeyi &alpha;. n'yi artırmak gücü her zaman artırır. &alpha;'yı artırmak da gücü artırır, ama daha fazla yanlış pozitif pahasına.</p>

<div class="calc-graph"><div id="plot-l107-power-tr" class="plotly-graph" style="height:400px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> sabit bir etki büyüklüğü ve sabit &alpha; için örneklem büyüklüğüne karşı istatistiksel gücün resimsel eğrisi. Güç n küçükken düşük başlar ve n büyüdükçe 1'e doğru yükselir. 0.80'deki yatay çizgi, geleneksel asgari güç önerisini işaretler &mdash; tasarımın buna ulaşamıyorsa testin güvenilir olamayacak kadar zayıftır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function erfT(x){var sign=x<0?-1:1;x=Math.abs(x);var a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;var t=1/(1+p*x);var y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);return sign*y;}
var nsT=[];var pwT=[];for(var n=5;n<=300;n+=5){var se=2/Math.sqrt(n);var d=0.5/se;var p=1-(0.5*(1+erfT((1.96-d)/Math.sqrt(2))))+(0.5*(1+erfT((-1.96-d)/Math.sqrt(2))));nsT.push(n);pwT.push(p);}
var curvePT={x:nsT,y:pwT,mode:'lines+markers',name:'güç',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:5}};
var thrT={x:[5,300],y:[0.8,0.8],mode:'lines+text',name:'güç = 0.80',line:{color:'#f59e0b',width:2,dash:'dash'},text:['','0.80'],textposition:'top center',textfont:{color:'#f59e0b'}};
var layPT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'örneklem büyüklüğü n',range:[0,310],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'güç = 1 − β',range:[0,1.05],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l107-power-tr',[curvePT,thrT],layPT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">İki çalışma da &quot;p = 0.03&quot; bildiriyor. Çalışma A n = 20, Çalışma B n = 2000 kullandı. Hangi sonuca daha çok güvenirsin? (İkisi de istatistiksel olarak anlamlıdır. Ama Çalışma A küçük n ile büyük bir etki tespit etmiş olabilir, Çalışma B ise dev n ile minicik &mdash; muhtemelen anlamsız &mdash; bir etki tespit etmiş olabilir. Her zaman sadece p-değerine değil, <em>etki büyüklüğüne</em> de bak.)</div></div>

<h2 class="lesson-title">9. Çözümlü Örnek 1: Para Hileli mi?</h2>

<div class="calc-example"><div class="example-label">TAM YÜRÜTME</div><div class="example-body"><strong>Problem.</strong> Bir madeni para n = 100 kez atılıyor. X = 60 yazı gözlemliyoruz. &alpha; = 0.05'te paranın hileli olup olmadığını test et.<br><br><strong>1. Adım &mdash; Hipotezler.</strong> p = P(yazı) olsun. O zaman H<sub>0</sub>: p = 0.5, H<sub>1</sub>: p &ne; 0.5 (iki-kuyruklu).<br><br><strong>2. Adım &mdash; Örneklem oranı.</strong> $\\hat{p} = 60/100 = 0.60$.<br><br><strong>3. Adım &mdash; H<sub>0</sub> altında standart hata.</strong> $SE = \\sqrt{p_0(1-p_0)/n} = \\sqrt{0.5 \\cdot 0.5 / 100} = \\sqrt{0.0025} = 0.05$.<br><br><strong>4. Adım &mdash; Test istatistiği.</strong> $z = (\\hat{p} - p_0)/SE = (0.60 - 0.50)/0.05 = 2.00$.<br><br><strong>5. Adım &mdash; p-değeri.</strong> İki-kuyruklu: $p = 2 P(Z \\geq 2.00) \\approx 2 \\cdot 0.0228 = 0.0456$.<br><br><strong>6. Adım &mdash; Karar.</strong> p = 0.0456 &lt; 0.05 = &alpha;, yani <strong>H<sub>0</sub> reddedilir</strong>. Paranın hileli olduğuna dair delil var.<br><br><strong>7. Adım &mdash; Etki büyüklüğü.</strong> Nokta tahmini $\\hat{p} = 0.60$, 0.5'ten 10 yüzde puanlık sapma. %95 GA: $0.60 \\pm 1.96 \\cdot 0.049 = (0.504, 0.696)$ &mdash; 0.5'in kıl payı dışarıda olduğuna dikkat et, sınırdaki p-değeriyle eşleşiyor.</div></div>

<h2 class="lesson-title">10. Çözümlü Örnek 2: Fabrika Ağırlıkları Tekrar</h2>

<div class="calc-example"><div class="example-label">TAM YÜRÜTME</div><div class="example-body"><strong>Problem.</strong> Fabrika &mu; = 50 g iddia ediyor, &sigma; = 2 g biliniyor. n = 25'lik örneklem $\\bar{x} = 49.5$ g veriyor. &alpha; = 0.05'te test et.<br><br><strong>H<sub>0</sub>:</strong> &mu; = 50. <strong>H<sub>1</sub>:</strong> &mu; &ne; 50 (kalite kontrolde her iki sapma da önemli olduğu için iki-kuyruklu).<br><br><strong>Test istatistiği:</strong> $z = (49.5 - 50)/(2/\\sqrt{25}) = -0.5/0.4 = -1.25$.<br><br><strong>p-değeri:</strong> $2 P(Z \\geq 1.25) \\approx 2 \\cdot 0.1056 = 0.2113$.<br><br><strong>Karar:</strong> p = 0.21 &gt; 0.05, <strong>H<sub>0</sub> reddedilmez</strong>. Gözlemlenen ortalama rastgele örnekleme dalgalanmasıyla tutarlı; hattın bozulduğuna dair delil yok.<br><br><strong>Not.</strong> &quot;Reddetmiyoruz&quot; &quot;H<sub>0</sub> doğru&quot; demek değildir. Onu çürütecek delilimiz olmadığı demektir. Daha büyük bir örneklem yine de küçük bir önyargıyı ortaya çıkarabilir.</div></div>

<h2 class="lesson-title">11. Çözümlü Örnek 3: İlaç vs Plasebo</h2>

<div class="calc-example"><div class="example-label">TAM YÜRÜTME</div><div class="example-body"><strong>Problem.</strong> Yeni bir ilaç plaseboya karşı test ediliyor. Tedavi grubunda ortalama kan basıncı düşüşü ($\\bar{x}_T = 8.2$ mmHg, n<sub>T</sub> = 50), plaseboda ($\\bar{x}_P = 5.4$ mmHg, n<sub>P</sub> = 50). Her ikisinde de &sigma; = 6 mmHg bilindiğini varsay. &alpha; = 0.05'te test et.<br><br><strong>H<sub>0</sub>:</strong> &mu;<sub>T</sub> &minus; &mu;<sub>P</sub> = 0. <strong>H<sub>1</sub>:</strong> &mu;<sub>T</sub> &minus; &mu;<sub>P</sub> &gt; 0 (sağ-kuyruklu: yalnızca ilacın <em>yardım edip etmediği</em> ilgimizi çekiyor).<br><br><strong>Fark için standart hata:</strong> $SE = \\sqrt{\\sigma^2/n_T + \\sigma^2/n_P} = \\sqrt{36/50 + 36/50} = \\sqrt{1.44} = 1.2$.<br><br><strong>Test istatistiği:</strong> $z = (8.2 - 5.4)/1.2 = 2.8/1.2 \\approx 2.33$.<br><br><strong>p-değeri (sağ kuyruk):</strong> $P(Z \\geq 2.33) \\approx 0.0099$.<br><br><strong>Karar:</strong> p &asymp; 0.01 &lt; 0.05, <strong>H<sub>0</sub> reddedilir</strong>. İlacın kan basıncını plasebodan daha çok düşürdüğüne dair güçlü delil.<br><br>Etki büyüklüğü: 2.8 mmHg, klinik olarak anlamlı bir sayı. Örneklem büyüklüğü tabanlı güç ve etki büyüklüğü her ikisi de önemlidir &mdash; sadece p-değeri değil.</div></div>

<h2 class="lesson-title">12. Yaygın Hatalar ve Tuzaklar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">p ile P(H<sub>0</sub>)'ı karıştırmak</div><div class="card-body">p = P(veri | H<sub>0</sub>), P(H<sub>0</sub> | veri) değil. p = 0.04 &quot;H<sub>0</sub>'ın doğru olma olasılığı %4&quot; <em>anlamına gelmez</em>. H<sub>0</sub>'ın kendi olasılığından söz etmek için Bayesçi yöntemler ve bir ön dağılım gerekir.</div></div>
<div class="calc-card"><div class="card-title">İstatistiksel vs pratik anlamlılık</div><div class="card-body">Yeterince büyük n ile, anlamsız bir 0.01 mmHg ilaç etkisi bile &quot;istatistiksel olarak anlamlı&quot; olabilir. Her zaman etki büyüklüğünü bildir, sadece p-değerini değil.</div></div>
<div class="calc-card"><div class="card-title">p-hacking</div><div class="card-body">&alpha; = 0.05'te 20 test çalıştırıp yalnızca p &lt; 0.05 olanı bildirmek, H<sub>0</sub> doğru olsa bile bir &quot;sonuç&quot; bulmanı garantiler. Çokluk düzeltilmelidir (Bonferroni, FDR, vb.).</div></div>
<div class="calc-card"><div class="card-title">Veriyi gördükten sonra kuyruk seçmek</div><div class="card-body">Tek-kuyruklu test p-değerini ikiye böler ama yalnızca yön <em>önceden</em> seçildiyse. Örnekleme göre kuyruğu çevirmek yaygın bir hile biçimidir.</div></div>
<div class="calc-card"><div class="card-title">&quot;Anlamlı değil&quot; = &quot;etki yok&quot;</div><div class="card-body">Yanlış. &quot;Anlamlı değil&quot;, ya etki yok ya da gücün yetersiz olduğu anlamına gelebilir. Delil yokluğu, yokluğun delili değildir.</div></div>
<div class="calc-card"><div class="card-title">Opsiyonel durdurma</div><div class="card-body">p-değerini izleyip p &lt; 0.05 olur olmaz veri toplamayı durdurmak, Tip I hata oranını nominal &alpha;'nın çok üstüne şişirir. Durdurma kuralı önceden belirlenmelidir.</div></div>
</div>

<h2 class="lesson-title">13. Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 &mdash; HİPOTEZLERİ KUR</div><div class="example-body"><strong>Problem.</strong> Bir öğretmen, öğrencilerinin haftalık ortalama ders çalışma süresinin 4 saat olduğunu iddia ediyor. n = 36 öğrencilik örneklemde $\\bar{x} = 3.6$ saat, $\\sigma = 1.2$ saat. İki-kuyruklu test için H<sub>0</sub> ve H<sub>1</sub>'i kur ve z'yi bul.<br><br><strong>Çözüm.</strong> H<sub>0</sub>: &mu; = 4. H<sub>1</sub>: &mu; &ne; 4. $z = (3.6-4)/(1.2/\\sqrt{36}) = -0.4/0.2 = \\mathbf{-2.00}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 &mdash; P-DEĞERİ</div><div class="example-body"><strong>Problem.</strong> Alıştırma 1 için iki-kuyruklu p-değerini hesapla ve &alpha; = 0.05'te karar ver.<br><br><strong>Çözüm.</strong> $p = 2 P(Z \\geq 2.00) \\approx 2 \\cdot 0.0228 = 0.0456$. p &lt; 0.05, yani <strong>H<sub>0</sub> reddedilir</strong>. Çalışma süresinin 4 saatten farklı olduğuna dair delil var.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 &mdash; GÜVEN ARALIĞI</div><div class="example-body"><strong>Problem.</strong> Alıştırma 1'in kitle ortalaması için %95 GA kur.<br><br><strong>Çözüm.</strong> $3.6 \\pm 1.96 \\cdot 0.2 = 3.6 \\pm 0.392 = \\mathbf{(3.21, 3.99)}$. 4'ün kıl payı dışarıda olduğuna dikkat et &mdash; sınırdaki redle tutarlı.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 &mdash; TEK-KUYRUKLU</div><div class="example-body"><strong>Problem.</strong> Bir fabrika mühendisi yeni bir sürecin kusur oranını mevcut %8'in altına düşürdüğünü iddia ediyor. n = 200 ürünlük örneklemde 12 kusurlu çıktı. &alpha; = 0.05'te H<sub>1</sub>: p &lt; 0.08'i test et.<br><br><strong>Çözüm.</strong> $\\hat{p} = 12/200 = 0.06$. $SE = \\sqrt{0.08 \\cdot 0.92/200} = \\sqrt{0.000368} \\approx 0.01918$. $z = (0.06 - 0.08)/0.01918 \\approx -1.043$. &alpha; = 0.05'te sol-kuyruklu kritik değer &minus;1.645; z'miz yeterince uç değil. p-değeri = P(Z &le; &minus;1.043) &asymp; 0.148. <strong>Reddetme</strong>. Yeni sürecin daha iyi olduğuna dair yetersiz delil.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 &mdash; ÖRNEKLEM BÜYÜKLÜĞÜ</div><div class="example-body"><strong>Problem.</strong> &alpha; = 0.05 (iki-kuyruklu) ve 0.80 güçle, &sigma; = 2 verildiğinde, $\\mu_0$'dan $\\Delta = 0.5$ gerçek ortalama kaymasını tespit etmek için n ne kadar büyük olmalı?<br><br><strong>Çözüm.</strong> Gereken: $n = \\left(\\dfrac{(z_{\\alpha/2} + z_\\beta)\\sigma}{\\Delta}\\right)^2 = \\left(\\dfrac{(1.96 + 0.84) \\cdot 2}{0.5}\\right)^2 = (11.2)^2 = \\mathbf{125.4}$. Yukarı yuvarla: <strong>n = 126</strong>.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 6 &mdash; İKİ-ÖRNEKLEM</div><div class="example-body"><strong>Problem.</strong> İki şehrin yolda geçen süresi: Şehir A ($\\bar{x}_A = 28$ dk, n<sub>A</sub> = 40), Şehir B ($\\bar{x}_B = 32$ dk, n<sub>B</sub> = 40). Her ikisinde de &sigma; = 10. &alpha; = 0.05'te H<sub>0</sub>: $\\mu_A = \\mu_B$ vs H<sub>1</sub>: $\\mu_A \\neq \\mu_B$ test et.<br><br><strong>Çözüm.</strong> $SE = \\sqrt{100/40 + 100/40} = \\sqrt{5} \\approx 2.236$. $z = (28-32)/2.236 \\approx -1.789$. İki-kuyruklu: $p \\approx 2 \\cdot 0.0368 = 0.0736$. p &gt; 0.05, <strong>reddetme</strong> &mdash; fark düşündürücü ama %5 düzeyinde anlamlı değil.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 7 &mdash; BİR P-DEĞERİNİ YORUMLA</div><div class="example-body"><strong>Problem.</strong> Bir çalışma H<sub>0</sub>: &mu; = 100 testi için p = 0.30 bildiriyor. Doğru mu yanlış mı: &quot;&mu; = 100 olma olasılığı %30'dur.&quot;<br><br><strong>Çözüm.</strong> <strong>Yanlış.</strong> p-değeri, H<sub>0</sub>'ın doğru olduğu <em>varsayımı altında</em> gözlemlenen veri (veya daha uç) olasılığıdır. H<sub>0</sub>'ın olasılığı değildir. Doğru ifade: &quot;Eğer H<sub>0</sub> doğru olsaydı, bu kadar uç veri yaklaşık %30 oranında görürdük.&quot;</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 8 &mdash; TİP I VS TİP II</div><div class="example-body"><strong>Problem.</strong> Nadir bir hastalık için tıbbi bir testin H<sub>0</sub>'ı: hasta sağlıklı. Test sağlıklı insanların %5'inde pozitif sonuç veriyor (Tip I) ve hasta insanların %2'sini kaçırıyor (Tip II). &alpha; ve &beta; nedir? Güç nedir?<br><br><strong>Çözüm.</strong> &alpha; = 0.05 (Tip I oranı). &beta; = 0.02 (Tip II oranı). Güç = 1 &minus; &beta; = 0.98 (test gerçek vakaların %98'ini yakalıyor).</div></div>

<h2 class="lesson-title">14. Bundan Sonra Nereye?</h2>

<p class="l-text">Bu ders <strong>çıkarımsal istatistiğe</strong> kapı açtı &mdash; veri ile karar arasındaki köprü. Konunun tamamı, daha sonra karşılaşacağın çok daha fazla araç içerir: kitle &sigma;'sı bilinmiyor ve n küçük olduğunda kullanılan <em>t-testleri</em>; kategorik veri ve olumsallık tabloları için <em>ki-kare testleri</em>; üç veya daha fazla grubu karşılaştırmak için <em>ANOVA</em>; değişkenler arası ilişkileri test etmek için <em>regresyon</em>; normal model çöktüğünde <em>parametrik olmayan testler</em>. Ve modern tarafta: gerçek H<sub>0</sub> olasılıklarını ön dağılımlar kullanarak hesaplayan <em>Bayesçi çıkarım</em>; korelasyonu sebepten ayırt eden <em>nedensel çıkarım</em>; aynı z-skorları ve güven fikirlerinin her model değerlendirmesinin altında yattığı <em>makine öğrenmesi</em>.</p>

<p class="l-text">Ama şu anda ustalaştığın çekirdek fikir &mdash; dünya hakkındaki bir ifadenin rastgele veriye karşı, dikkatlice sınırlanmış bir yanılma olasılığıyla test edilebileceği &mdash; temeldir. Sonraki her teknik onun üzerine oturur.</p>

<div class="calc-highlight" style="background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(245,158,11,0.08));border-left:4px solid #f59e0b;padding:1.3rem 1.4rem"><strong>Tebrikler.</strong> Lise Matematik müfredatının 107 dersinin tamamını bitirdin. Birim çember üzerinde bir açı ölçmekten p-değeriyle bir hipotezi test etmeye kadar, insanlığın dört bin yıl boyunca yürüdüğü yolu yürüdün &mdash; Babil astronomisinden modern veri bilimine. Şimdi kafanda taşıdığın aynı gösterim, aynı mantık, aynı ispat kültürü; her mühendisin, bilim insanının, ekonomistin ve istatistikçinin her gün kullandığı şeydir. İyi kullan. Matematik artık senin bir parçan.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her test bir sıfır H<sub>0</sub> (statüko) ve bir alternatif H<sub>1</sub> (iddia) belirtir</li>
<li>Tip I hata: doğruyken H<sub>0</sub>'ı reddetmek; olasılık &alpha; (anlamlılık düzeyi)</li>
<li>Tip II hata: yanlışken H<sub>0</sub>'ı reddetmemek; olasılık &beta;; güç = 1 &minus; &beta;</li>
<li>z-skoru: $z = (\\bar{x} - \\mu_0)/(\\sigma/\\sqrt{n})$</li>
<li>p-değeri: P(bu kadar uç veya daha uç veri, H<sub>0</sub> verildiğinde); p &le; &alpha; iken reddet</li>
<li>Tek-kuyruklu vs iki-kuyruklu, H<sub>1</sub>'e bağlıdır; veriyi görmeden <em>önce</em> seç</li>
<li>%95 güven aralığı: $\\bar{x} \\pm 1.96 \\cdot \\sigma/\\sqrt{n}$</li>
<li>Daha büyük n SE'yi $\\sqrt{n}$ ile küçültür &mdash; daha fazla güç, daha fazla duyarlılık</li>
<li>p, P(H<sub>0</sub>) değildir; istatistiksel anlamlılık, pratik anlamlılık değildir</li>
<li>Tebrikler &mdash; Lise Matematik müfredatı tamamlandı!</li>
</ul>
</div>`
};
