window.LISE_MAT_L103 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>The previous lesson asked: where is the centre of a dataset?</strong> The mean, the median and the mode each gave a different one-number answer. But two datasets can share the exact same mean and still tell completely different stories. Compare two classes that both averaged 70 on an exam: in the first class everyone scored between 65 and 75; in the second, half the class scored 40 and the other half scored 100. The centre is identical; the <em>spread</em> is wildly different. To finish describing a dataset you need a second number — one that captures how tightly or loosely the values cluster around the centre.</p>

<p class="l-text">This lesson teaches the four classical measures of spread used at high-school level: the <em>range</em> (simplest), the <em>variance</em> and the <em>standard deviation</em> (most important), and the <em>interquartile range</em> based on quartiles (most robust). You will learn to compute each by hand, understand why statisticians divide by $n-1$ instead of $n$ for samples (Bessel's correction), draw a box plot, and detect outliers using the 1.5&middot;IQR rule. Together with the lesson on mean, median and mode, this completes the descriptive-statistics toolkit you need for any small dataset.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise why two datasets with the same mean can be radically different and need a measure of spread</li>
<li>Compute the range, variance and standard deviation of any small dataset by hand</li>
<li>Tell apart the population variance ($\\sigma^2$, divide by N) from the sample variance ($s^2$, divide by $n-1$) and explain Bessel's correction</li>
<li>Find Q1, Q2 (the median) and Q3, write the five-number summary, and compute the interquartile range</li>
<li>Read a box plot and apply the $1.5\\cdot\\text{IQR}$ rule to flag outliers</li>
<li>Compute the coefficient of variation $\\text{CV} = \\sigma/\\mu$ to compare relative spread across datasets with different units</li>
</ul>
</div>

<h2 class="lesson-title">1. Why a Measure of Spread Is Needed</h2>

<div class="calc-highlight"><strong>The mean alone can be deeply misleading.</strong> Consider two small classes that took the same maths exam. Class A scores: $\\{68,\\,69,\\,70,\\,71,\\,72\\}$. Class B scores: $\\{50,\\,60,\\,70,\\,80,\\,90\\}$. Both have mean exactly 70. Both have median exactly 70. By every measure of centre, the two classes are identical. But anyone who has stood in front of these two rooms knows they are not the same group of students at all.</div>

<p class="l-text">Class A is tightly clustered: every student is within 2 points of the average. Teaching them is uniform — everyone is roughly at the same level. Class B is wildly heterogeneous: some students need more support, others need extension material. The teacher's lesson plan, the pace of the course, and even the choice of textbook depend on this difference. None of it is captured by the mean. You need a number that quantifies <em>how far the values spread out</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Centre</div><div class="card-body">Where the data sits on the number line. Tools: mean, median, mode.</div></div>
<div class="calc-card"><div class="card-title">Spread</div><div class="card-body">How widely the values are scattered around the centre. Tools: range, variance, standard deviation, IQR.</div></div>
<div class="calc-card"><div class="card-title">Shape</div><div class="card-body">Whether the distribution is symmetric, skewed, single-peaked or multi-peaked. Read off a histogram or box plot.</div></div>
</div>

<h2 class="lesson-title">2. The Range</h2>

<div class="calc-highlight"><strong>The simplest measure of spread.</strong> The range is the difference between the largest and the smallest value. It uses only two numbers from the whole dataset, so it is fast to compute but throws away nearly all the information — and it is extremely sensitive to outliers.</div>

<div class="calc-formula"><div class="formula-label">RANGE</div><div class="formula-main">$$\\text{range} \\;=\\; x_{\\max} \\;-\\; x_{\\min}$$</div><div class="formula-sub">Always non-negative. Equal to zero only when every value in the dataset is identical.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Daily high temperatures in &deg;C in one week: $\\{18,\\,21,\\,17,\\,24,\\,20,\\,19,\\,23\\}$.<br><br>Maximum: 24. Minimum: 17. Range: $24 - 17 = \\mathbf{7}$ &deg;C.<br><br>The temperatures spanned 7 degrees this week. Quick and intuitive, but tells you nothing about the values in between.</div></div>

<p class="l-text"><strong>The fatal weakness of the range.</strong> Consider two datasets: $\\{20,\\,21,\\,22,\\,23,\\,24\\}$ (range 4) and $\\{20,\\,22,\\,22,\\,22,\\,24\\}$ (range also 4). The range cannot distinguish them, yet the second is far more concentrated. Worse, a single outlier can inflate the range dramatically: adding the value 100 to $\\{20,\\,21,\\,22,\\,23,\\,24\\}$ shoots the range from 4 to 80, suggesting wild dispersion that does not actually exist. The range is a coarse first glance, nothing more.</p>

<h2 class="lesson-title">3. The Idea Behind Variance</h2>

<div class="calc-highlight"><strong>A better measure of spread should use every data point, not just the two extremes.</strong> The natural idea: for each value, measure how far it deviates from the mean. Then average those deviations.</div>

<p class="l-text">There is one obvious problem. Some deviations are positive (values above the mean) and some are negative (values below). If we average them directly, the positives and negatives cancel out. In fact they cancel out <em>exactly</em>: the sum of deviations from the mean is always zero. That is not a coincidence — it is a defining property of the mean (it is the balance point of the data). So we need a way to make all deviations non-negative before averaging.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Absolute deviation</div><div class="card-body">Take $|x_i - \\bar{x}|$. Works mathematically but absolute values are awkward to differentiate; statisticians prefer the next option.</div></div>
<div class="calc-card"><div class="card-title">Squared deviation</div><div class="card-body">Take $(x_i - \\bar{x})^2$. Always non-negative, smooth, and leads to the variance — the standard choice.</div></div>
<div class="calc-card"><div class="card-title">Why squaring wins</div><div class="card-body">Squared deviations have neat algebraic and calculus properties. The variance is the foundation of nearly all advanced statistics: regression, ANOVA, machine learning loss functions.</div></div>
</div>

<h2 class="lesson-title">4. Population Variance and Standard Deviation</h2>

<div class="calc-highlight"><strong>When you have the entire population, the variance is the average squared deviation from the mean.</strong> The standard deviation is the square root of the variance, which brings the units back to the original scale.</div>

<div class="calc-formula"><div class="formula-label">POPULATION VARIANCE</div><div class="formula-main">$$\\sigma^2 \\;=\\; \\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2$$</div><div class="formula-sub">$\\mu$ is the population mean, $N$ is the population size. Variance is in squared units (e.g. square metres if x is metres).</div></div>

<div class="calc-formula"><div class="formula-label">POPULATION STANDARD DEVIATION</div><div class="formula-main">$$\\sigma \\;=\\; \\sqrt{\\sigma^2} \\;=\\; \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2}$$</div><div class="formula-sub">Standard deviation is in the same units as the data. It is the more useful number to quote.</div></div>

<p class="l-text"><strong>Reading the standard deviation.</strong> Roughly speaking, $\\sigma$ measures the "typical" distance of a data point from the mean. If $\\sigma$ is small, the data is concentrated near the mean; if $\\sigma$ is large, the data is widely spread. For a bell-shaped distribution, about 68% of values fall within $\\mu \\pm \\sigma$, and about 95% within $\\mu \\pm 2\\sigma$ — a rule of thumb worth remembering.</p>

<h2 class="lesson-title">5. Sample Variance and Bessel's Correction</h2>

<div class="calc-highlight"><strong>When the data is a sample rather than the whole population, divide by $n-1$, not $n$.</strong> This adjustment is called Bessel's correction. The reason is subtle but important: when you use the sample mean $\\bar{x}$ in place of the unknown $\\mu$, the squared deviations $(x_i - \\bar{x})^2$ tend to be slightly smaller than $(x_i - \\mu)^2$ would be. Dividing by $n-1$ instead of $n$ exactly compensates for this bias.</div>

<div class="calc-formula"><div class="formula-label">SAMPLE VARIANCE</div><div class="formula-main">$$s^2 \\;=\\; \\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2$$</div><div class="formula-sub">$\\bar{x}$ is the sample mean, $n$ is the sample size. The denominator $n-1$ is the number of "degrees of freedom".</div></div>

<div class="calc-formula"><div class="formula-label">SAMPLE STANDARD DEVIATION</div><div class="formula-main">$$s \\;=\\; \\sqrt{s^2} \\;=\\; \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$</div><div class="formula-sub">When $n$ is large (say $n > 30$), dividing by $n$ versus $n-1$ makes very little difference. For small samples it matters.</div></div>

<div class="l-note"><strong>Why $n-1$, intuitively.</strong> The sample mean $\\bar{x}$ is computed from the same data you are measuring against. That data has one less independent piece of information than it appears to: once you know $n-1$ of the values plus the mean, the last value is forced. So only $n-1$ "free" pieces of information remain — the degrees of freedom. Dividing by this smaller number produces an estimate that is, on average, exactly right.</div>

<h2 class="lesson-title">6. Computational Shortcut</h2>

<div class="calc-highlight"><strong>For hand calculation, expanding the squared deviation gives a much faster formula.</strong> The identity $E[(X - \\mu)^2] = E[X^2] - (E[X])^2$ lets you compute variance from two sums instead of one sum and a list of differences.</div>

<div class="calc-formula"><div class="formula-label">COMPUTATIONAL VARIANCE (POPULATION)</div><div class="formula-main">$$\\sigma^2 \\;=\\; \\frac{1}{N}\\sum_{i=1}^{N} x_i^2 \\;-\\; \\mu^2 \\;=\\; \\overline{x^2} \\;-\\; (\\bar{x})^2$$</div><div class="formula-sub">"Mean of the squares minus the square of the mean." Only two sums needed: $\\sum x_i$ and $\\sum x_i^2$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — SHORTCUT</div><div class="example-body">Compute the population variance of $\\{2,\\,4,\\,4,\\,6\\}$ using both methods.<br><br><strong>Standard method.</strong> Mean: $\\mu = (2+4+4+6)/4 = 4$. Deviations: $-2,\\,0,\\,0,\\,2$. Squared deviations: $4,\\,0,\\,0,\\,4$. Sum: 8. Variance: $\\sigma^2 = 8/4 = 2$.<br><br><strong>Shortcut.</strong> $\\sum x_i^2 = 4+16+16+36 = 72$. Mean of squares: $72/4 = 18$. Square of mean: $\\mu^2 = 16$. Variance: $\\sigma^2 = 18 - 16 = 2$. Same answer.<br><br>SD: $\\sigma = \\sqrt{2} \\approx \\mathbf{1.41}$.</div></div>

<h2 class="lesson-title">7. Full Worked Example — Standard Deviation</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DATASET OF SEVEN</div><div class="example-body">Compute the sample mean, sample variance and sample standard deviation of $\\{4,\\,8,\\,6,\\,5,\\,3,\\,10,\\,7\\}$.<br><br><strong>Step 1: Sample mean.</strong> $\\bar{x} = (4+8+6+5+3+10+7)/7 = 43/7 \\approx 6.143$.<br><br><strong>Step 2: Deviations from the mean.</strong><br>$4 - 6.143 = -2.143$<br>$8 - 6.143 = 1.857$<br>$6 - 6.143 = -0.143$<br>$5 - 6.143 = -1.143$<br>$3 - 6.143 = -3.143$<br>$10 - 6.143 = 3.857$<br>$7 - 6.143 = 0.857$<br><br><strong>Step 3: Squared deviations.</strong><br>$4.592,\\;3.449,\\;0.020,\\;1.306,\\;9.878,\\;14.878,\\;0.734$.<br>Sum of squared deviations: $\\sum (x_i - \\bar{x})^2 \\approx 34.857$.<br><br><strong>Step 4: Sample variance.</strong> $s^2 = 34.857 / (7-1) = 34.857 / 6 \\approx 5.810$.<br><br><strong>Step 5: Sample standard deviation.</strong> $s = \\sqrt{5.810} \\approx \\mathbf{2.41}$.<br><br>Compare to population variance (divide by 7 instead of 6): $\\sigma^2 \\approx 4.980$, $\\sigma \\approx 2.23$. The sample version is slightly larger — Bessel's correction.</div></div>

<h2 class="lesson-title">8. Quartiles</h2>

<div class="calc-highlight"><strong>Quartiles split a sorted dataset into four equal parts.</strong> The first quartile $Q_1$ is the 25th percentile: a quarter of the data lies below it. The second quartile $Q_2$ is the 50th percentile — that is, the median. The third quartile $Q_3$ is the 75th percentile: three quarters of the data lies below it. Together with the minimum and maximum they form the <em>five-number summary</em>.</div>

<p class="l-text"><strong>Computing quartiles by hand.</strong> Sort the data. Find the median $Q_2$, which splits the data into a lower half and an upper half. $Q_1$ is the median of the lower half; $Q_3$ is the median of the upper half. There are several conventions for what to do when n is odd (does $Q_2$ go into the lower half, the upper half, or neither?); high schools usually use the simplest rule, which is to exclude the median itself from both halves.</p>

<div class="calc-formula"><div class="formula-label">FIVE-NUMBER SUMMARY</div><div class="formula-main">$$\\{x_{\\min},\\; Q_1,\\; Q_2 = \\text{median},\\; Q_3,\\; x_{\\max}\\}$$</div><div class="formula-sub">Five numbers that capture the centre, spread and tails of any dataset. Compact and robust.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — EVEN n</div><div class="example-body">Quartiles of $\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$.<br><br>Already sorted, $n = 6$. Median: average of 6 and 8, so $Q_2 = 7$.<br>Lower half: $\\{2, 4, 6\\}$. Median of lower half: $Q_1 = 4$.<br>Upper half: $\\{8, 10, 12\\}$. Median of upper half: $Q_3 = 10$.<br><br>Five-number summary: $\\{2,\\,4,\\,7,\\,10,\\,12\\}$. Minimum 2, $Q_1 = 4$, median 7, $Q_3 = 10$, maximum 12.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ODD n</div><div class="example-body">Quartiles of $\\{1,\\,3,\\,5,\\,7,\\,9,\\,11,\\,13\\}$.<br><br>Sorted, $n = 7$. Median: middle position (4th value), so $Q_2 = 7$.<br>Lower half (excluding median): $\\{1, 3, 5\\}$. $Q_1 = 3$.<br>Upper half (excluding median): $\\{9, 11, 13\\}$. $Q_3 = 11$.<br><br>Five-number summary: $\\{1,\\,3,\\,7,\\,11,\\,13\\}$.</div></div>

<h2 class="lesson-title">9. The Interquartile Range</h2>

<div class="calc-highlight"><strong>The interquartile range (IQR) is the spread of the middle 50% of the data.</strong> It is the difference between the third and first quartiles. Because it ignores the extreme top 25% and bottom 25%, the IQR is highly resistant to outliers — a much more robust measure of spread than the range or even the standard deviation.</div>

<div class="calc-formula"><div class="formula-label">INTERQUARTILE RANGE</div><div class="formula-main">$$\\text{IQR} \\;=\\; Q_3 \\;-\\; Q_1$$</div><div class="formula-sub">The width of the central 50% of the data. Always non-negative.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IQR</div><div class="example-body">Back to $\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$: $Q_1 = 4$, $Q_3 = 10$.<br><br>IQR $= 10 - 4 = \\mathbf{6}$.<br><br>Half of the data sits within a 6-unit window centred near the median. Compare with the range, which is $12 - 2 = 10$: the IQR is smaller because it trims off the extremes.</div></div>

<h2 class="lesson-title">10. The Box Plot</h2>

<div class="calc-highlight"><strong>The box plot is a visual of the five-number summary.</strong> A box is drawn from $Q_1$ to $Q_3$ (its width is the IQR), with a line at the median inside it. Whiskers extend from the box to the smallest and largest non-outlier values. Outliers, if any, are drawn as separate dots beyond the whiskers. In a single picture the viewer sees the centre, the spread, the skewness and the outliers — there is no more compact summary in all of statistics.</div>

<div class="calc-graph"><div id="plot-l103-box5-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a box plot of the dataset $\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$ with the five-number summary annotated: minimum, $Q_1$, median, $Q_3$, maximum. The box spans the middle 50% (the IQR); the whiskers reach to the extremes.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var data=[2,4,6,8,10,12];
var trace={y:data,type:'box',name:'dataset',marker:{color:'#3b82f6'},line:{color:'#60a5fa'},fillcolor:'rgba(59,130,246,0.25)',boxmean:false,boxpoints:'all',jitter:0,pointpos:0};
var anns=[
{x:0.16,y:2,xref:'paper',yref:'y',text:'min = 2',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:4,xref:'paper',yref:'y',text:'Q1 = 4',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:7,xref:'paper',yref:'y',text:'median = 7',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:10,xref:'paper',yref:'y',text:'Q3 = 10',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:12,xref:'paper',yref:'y',text:'max = 12',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'}
];
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{showticklabels:false,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'value',gridcolor:'rgba(255,255,255,0.06)',range:[0,14]},margin:{t:40,r:120,b:40,l:60},annotations:anns,showlegend:false};
Plotly.newPlot('plot-l103-box5-en',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l103-hist-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two histograms with the same mean (50) but different standard deviations. The blue distribution is tight ($\\sigma \\approx 5$); the orange one is wide ($\\sigma \\approx 15$). Centre alone cannot distinguish them; the standard deviation can.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function gauss(n,mu,sg,seed){var arr=[];var s=seed;for(var i=0;i<n;i++){var u1,u2;s=(s*9301+49297)%233280;u1=Math.max(s/233280,1e-9);s=(s*9301+49297)%233280;u2=s/233280;var z=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);arr.push(mu+sg*z);}return arr;}
var tight=gauss(400,50,5,7);
var wide=gauss(400,50,15,11);
var hT={x:tight,type:'histogram',name:'sigma = 5 (tight)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},opacity:0.75,xbins:{start:0,end:100,size:2.5}};
var hW={x:wide,type:'histogram',name:'sigma = 15 (wide)',marker:{color:'#f59e0b',line:{color:'#b45309',width:1}},opacity:0.65,xbins:{start:0,end:100,size:2.5}};
var meanLine={x:[50,50],y:[0,80],mode:'lines',line:{color:'#ef4444',width:3,dash:'dash'},name:'mean = 50 (both)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'value',gridcolor:'rgba(255,255,255,0.06)',range:[0,100]},yaxis:{title:'frequency',gridcolor:'rgba(255,255,255,0.06)'},barmode:'overlay',margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l103-hist-en',[hT,hW,meanLine],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. The 1.5&middot;IQR Outlier Rule</h2>

<div class="calc-highlight"><strong>An outlier is a value far from the bulk of the data.</strong> The most widely used rule of thumb: a value is an outlier if it lies below $Q_1 - 1.5 \\cdot \\text{IQR}$ or above $Q_3 + 1.5 \\cdot \\text{IQR}$. These two cutoffs are sometimes called the lower fence and the upper fence. On a box plot, the whiskers stop at the most extreme non-outlier values, and any outliers are plotted as separate dots beyond them.</div>

<div class="calc-formula"><div class="formula-label">OUTLIER FENCES</div><div class="formula-main">$$\\text{lower fence} = Q_1 - 1.5 \\cdot \\text{IQR}, \\qquad \\text{upper fence} = Q_3 + 1.5 \\cdot \\text{IQR}$$</div><div class="formula-sub">Values below the lower fence or above the upper fence are flagged as outliers. The factor 1.5 is a convention chosen by John Tukey in the 1970s.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — DETECT THE OUTLIER</div><div class="example-body">Find outliers in $\\{1,\\,2,\\,2,\\,3,\\,3,\\,4,\\,4,\\,5,\\,20\\}$.<br><br><strong>Step 1: Quartiles.</strong> Sorted, $n = 9$. Median $Q_2$ is the 5th value = 3. Lower half (first 4 values): $\\{1, 2, 2, 3\\}$, median $(2+2)/2 = Q_1 = 2$. Upper half (last 4 values): $\\{4, 4, 5, 20\\}$, median $(4+5)/2 = Q_3 = 4.5$.<br><br><strong>Step 2: IQR.</strong> $\\text{IQR} = Q_3 - Q_1 = 4.5 - 2 = 2.5$.<br><br><strong>Step 3: Fences.</strong> Lower fence: $2 - 1.5 \\cdot 2.5 = 2 - 3.75 = -1.75$. Upper fence: $4.5 + 1.5 \\cdot 2.5 = 4.5 + 3.75 = 8.25$.<br><br><strong>Step 4: Check.</strong> Any value below $-1.75$? No (the minimum is 1). Any value above $8.25$? Yes — the value <strong>20</strong>. It is the single outlier.<br><br>Notice how robust this is: even though 20 is wildly larger than the rest, the IQR-based rule still identifies it cleanly because the quartiles themselves were not affected by it.</div></div>

<div class="calc-graph"><div id="plot-l103-box2-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two box plots side by side. Left: a clean dataset with no outliers. Right: the same data plus a single extreme value (20); the box itself barely changes, but a separate dot beyond the whisker flags the outlier. The 1.5&middot;IQR rule isolated it.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var clean=[1,2,2,3,3,4,4,5,5,6];
var withOut=[1,2,2,3,3,4,4,5,20];
var t1={y:clean,type:'box',name:'no outliers',marker:{color:'#10b981'},line:{color:'#34d399'},fillcolor:'rgba(16,185,129,0.25)',boxpoints:'all',jitter:0.3,pointpos:0};
var t2={y:withOut,type:'box',name:'with outlier',marker:{color:'#ef4444'},line:{color:'#f87171'},fillcolor:'rgba(239,68,68,0.25)',boxpoints:'outliers'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'value',gridcolor:'rgba(255,255,255,0.06)',range:[-2,22]},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l103-box2-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Coefficient of Variation</h2>

<div class="calc-highlight"><strong>Standard deviation alone cannot be compared across datasets with different units or different scales.</strong> An SD of 5 might be huge for one quantity (heights of children, where $\\sigma$ is normally about 7 cm) and tiny for another (annual incomes in TL, where $\\sigma$ might be tens of thousands). The coefficient of variation (CV) gives a unit-free measure of relative spread by dividing the SD by the mean.</div>

<div class="calc-formula"><div class="formula-label">COEFFICIENT OF VARIATION</div><div class="formula-main">$$\\text{CV} \\;=\\; \\frac{\\sigma}{\\mu} \\quad \\text{(often expressed as a percentage)}$$</div><div class="formula-sub">Unitless. Larger CV means the data is more spread out relative to its centre. Requires $\\mu > 0$ to be meaningful.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — COMPARING SPREAD</div><div class="example-body">Two datasets:<br>(a) Heights in cm: $\\mu = 170$, $\\sigma = 8$. CV $= 8/170 \\approx 0.047 = \\mathbf{4.7\\%}$.<br>(b) Incomes in TL: $\\mu = 30{,}000$, $\\sigma = 9{,}000$. CV $= 9000/30000 = 0.30 = \\mathbf{30\\%}$.<br><br>Although the income SD (9000) is much larger in absolute terms than the height SD (8), the relative spread of incomes is far greater — incomes vary by 30% around their mean, heights only by 4.7%. The CV makes the comparison fair.</div></div>

<h2 class="lesson-title">13. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting Bessel's correction</div><div class="card-body">If your data is a sample, divide by $n - 1$, not $n$. For small samples this can change the SD noticeably. Read the question: "population" or "sample"?</div></div>
<div class="calc-card"><div class="card-title">Mixing population and sample formulas</div><div class="card-body">$\\sigma^2$ uses $N$ in the denominator; $s^2$ uses $n - 1$. Greek vs Latin letters tell you which is which.</div></div>
<div class="calc-card"><div class="card-title">Forgetting to sort before quartiles</div><div class="card-body">Quartile positions assume sorted data. Always sort first, then split into halves.</div></div>
<div class="calc-card"><div class="card-title">Miscounting quartile positions</div><div class="card-body">There are several conventions for handling an odd $n$. The most common rule (used here) is to exclude the median when computing $Q_1$ and $Q_3$.</div></div>
<div class="calc-card"><div class="card-title">Treating range as a serious measure</div><div class="card-body">The range uses only two values and is wildly sensitive to outliers. Quote it only as a quick first glance, never as the main measure of spread.</div></div>
<div class="calc-card"><div class="card-title">Squaring the SD by mistake</div><div class="card-body">The SD is already the square root of the variance — do not square it again. Variance has squared units (cm&sup2;, TL&sup2;), SD has the original units (cm, TL).</div></div>
</div>

<h2 class="lesson-title">14. Worked Practice Problems</h2>

<p class="l-text">Eight problems consolidating the lesson. Do each yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — RANGE AND IQR</div><div class="example-body"><strong>Find the range and the IQR of $\\{5,\\,7,\\,8,\\,12,\\,15,\\,18,\\,22\\}$.</strong><br><br>Already sorted, $n = 7$.<br>Range: $22 - 5 = \\mathbf{17}$.<br>Median $Q_2 = 12$ (4th value). Lower half $\\{5, 7, 8\\}$, $Q_1 = 7$. Upper half $\\{15, 18, 22\\}$, $Q_3 = 18$.<br>IQR: $18 - 7 = \\mathbf{11}$.<br><br>The middle 50% of the data sits within an 11-unit window; the total spread is 17.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — SAMPLE SD BY HAND</div><div class="example-body"><strong>Compute the sample standard deviation of $\\{6,\\,8,\\,10,\\,12,\\,14\\}$.</strong><br><br>Mean: $\\bar{x} = (6+8+10+12+14)/5 = 50/5 = 10$.<br>Deviations: $-4, -2, 0, 2, 4$.<br>Squared: $16, 4, 0, 4, 16$. Sum: 40.<br>Sample variance: $s^2 = 40 / (5-1) = 40/4 = 10$.<br>Sample SD: $s = \\sqrt{10} \\approx \\mathbf{3.16}$.<br><br>Notice the data is symmetric around 10 — the deviations cancel perfectly when summed without squaring.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — POPULATION SD</div><div class="example-body"><strong>Compute the population standard deviation of the same dataset $\\{6,\\,8,\\,10,\\,12,\\,14\\}$.</strong><br><br>Mean unchanged: $\\mu = 10$. Sum of squared deviations also unchanged: 40.<br>Population variance: $\\sigma^2 = 40 / 5 = 8$.<br>Population SD: $\\sigma = \\sqrt{8} \\approx \\mathbf{2.83}$.<br><br>Slightly smaller than the sample SD (3.16) — that is Bessel's correction in action.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — FIVE-NUMBER SUMMARY</div><div class="example-body"><strong>Give the five-number summary of $\\{3,\\,5,\\,7,\\,9,\\,10,\\,13,\\,15,\\,18,\\,22,\\,25\\}$.</strong><br><br>Sorted, $n = 10$. Median: average of 5th and 6th values, $(10 + 13)/2 = Q_2 = 11.5$.<br>Lower half: $\\{3, 5, 7, 9, 10\\}$. Median $Q_1 = 7$.<br>Upper half: $\\{13, 15, 18, 22, 25\\}$. Median $Q_3 = 18$.<br><br>Five-number summary: $\\{\\mathbf{3,\\,7,\\,11.5,\\,18,\\,25}\\}$. IQR $= 18 - 7 = 11$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — OUTLIER DETECTION</div><div class="example-body"><strong>Are there outliers in $\\{12,\\,15,\\,16,\\,17,\\,18,\\,19,\\,20,\\,21,\\,45\\}$?</strong><br><br>Sorted, $n = 9$. Median: 5th value = 18. Lower half $\\{12, 15, 16, 17\\}$, $Q_1 = (15+16)/2 = 15.5$. Upper half $\\{19, 20, 21, 45\\}$, $Q_3 = (20+21)/2 = 20.5$.<br>IQR: $20.5 - 15.5 = 5$.<br>Upper fence: $20.5 + 1.5 \\cdot 5 = 28$. Lower fence: $15.5 - 7.5 = 8$.<br><br>Any value above 28? Yes — <strong>45</strong> is an outlier. No values below 8.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — SHORTCUT FORMULA</div><div class="example-body"><strong>Use the computational shortcut to find the population variance of $\\{1,\\,3,\\,5,\\,7\\}$.</strong><br><br>$\\sum x_i = 16$, so $\\mu = 16/4 = 4$.<br>$\\sum x_i^2 = 1 + 9 + 25 + 49 = 84$. Mean of squares: $84/4 = 21$.<br>Square of mean: $\\mu^2 = 16$.<br>Variance: $\\sigma^2 = 21 - 16 = \\mathbf{5}$.<br>SD: $\\sigma = \\sqrt{5} \\approx 2.24$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — COEFFICIENT OF VARIATION</div><div class="example-body"><strong>Class A: exam scores have mean 70, SD 10. Class B: exam scores have mean 50, SD 8. Which class has more relative variability?</strong><br><br>Class A: CV $= 10 / 70 \\approx 0.143 = 14.3\\%$.<br>Class B: CV $= 8 / 50 = 0.16 = 16\\%$.<br><br>Class B is slightly more variable in <strong>relative</strong> terms, even though its raw SD is smaller. CV makes the comparison fair across different means.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — INTERPRETING A BOX PLOT</div><div class="example-body"><strong>A box plot of weekly study hours for a class shows: minimum 2, $Q_1 = 6$, median 9, $Q_3 = 13$, maximum 28, with the value 28 marked as a separate outlier dot. Comment on the spread, the skewness and the outlier.</strong><br><br>IQR: $13 - 6 = 7$ hours. Half the class studies between 6 and 13 hours per week.<br>The upper fence is $13 + 1.5 \\cdot 7 = 23.5$. The value 28 exceeds this, hence the outlier marker.<br>Skewness: the upper whisker would normally extend to the largest non-outlier (perhaps around 20), making it noticeably longer than the lower whisker. The distribution is right-skewed — most students study moderately, with one very dedicated student.<br>The teacher knows: most students need help with time management at a "6-13 hours" baseline; one student is studying nearly four times the median amount.</div></div>

<h2 class="lesson-title">15. Looking Ahead</h2>

<p class="l-text">Mean, median, mode tell you where the data sits; range, variance, standard deviation and the IQR tell you how spread out it is; a histogram or box plot lets you eyeball the shape. With these tools you can summarise any small dataset in a single sentence ("the mean is 70, the standard deviation is 5, no outliers"). The next steps in statistics build on this foundation: probability turns these descriptive numbers into predictions about uncertain outcomes; inferential statistics uses sample SDs to compute margins of error and test hypotheses. Master the formulas in this lesson and the rest of statistics becomes a sequence of small, well-motivated extensions rather than a wall of new symbols.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Two datasets can share the same mean yet have completely different spreads — always quote a measure of spread alongside the centre</li>
<li>Range $= x_{\\max} - x_{\\min}$ is quick but uses only two values</li>
<li>Population variance $\\sigma^2 = \\frac{1}{N}\\sum (x_i - \\mu)^2$; population SD $\\sigma = \\sqrt{\\sigma^2}$</li>
<li>Sample variance $s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar{x})^2$ uses Bessel's correction; sample SD is its square root</li>
<li>Computational shortcut: $\\sigma^2 = \\overline{x^2} - (\\bar{x})^2$</li>
<li>Quartiles split sorted data into four equal parts; five-number summary is $\\{\\min, Q_1, \\text{med}, Q_3, \\max\\}$</li>
<li>IQR $= Q_3 - Q_1$ is the spread of the middle 50% and is highly robust to outliers</li>
<li>Outlier rule: values below $Q_1 - 1.5\\cdot\\text{IQR}$ or above $Q_3 + 1.5\\cdot\\text{IQR}$ are flagged</li>
<li>Coefficient of variation CV $= \\sigma / \\mu$ gives unit-free relative spread for comparing different datasets</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Önceki ders şunu sordu: bir veri setinin merkezi nerede?</strong> Ortalama, medyan ve mod her biri farklı bir tek sayı yanıt verdi. Ama iki veri seti tam olarak aynı ortalamayı paylaşıp tamamen farklı hikâyeler anlatabilir. Aynı sınavda ortalaması 70 olan iki sınıfı karşılaştır: ilk sınıfta herkes 65 ile 75 arasında almış; ikincide sınıfın yarısı 40, diğer yarısı 100 almış. Merkez aynı; <em>yayılım</em> alabildiğine farklı. Bir veri setini tanımlamayı bitirmek için ikinci bir sayıya ihtiyacın var — değerlerin merkez etrafında ne kadar sıkı ya da ne kadar gevşek toplandığını yakalayan bir sayı.</p>

<p class="l-text">Bu ders lise düzeyinde kullanılan dört klasik yayılım ölçüsünü öğretiyor: <em>değişim aralığı</em> (en basit), <em>varyans</em> ve <em>standart sapma</em> (en önemli) ve çeyrekliklere dayalı <em>çeyrekler arası açıklık</em> (en dayanıklı). Her birini elle hesaplamayı, istatistikçilerin örneklem için neden $n$ yerine $n-1$'e böldüğünü (Bessel düzeltmesi), bir kutu grafiği çizmeyi ve $1.5\\cdot\\text{IQR}$ kuralı ile uç değer tespit etmeyi öğreneceksin. Ortalama, medyan ve mod dersiyle birlikte, bu ders küçük bir veri seti için ihtiyaç duyacağın betimsel istatistik araç kutusunu tamamlar.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Aynı ortalamaya sahip iki veri setinin neden tamamen farklı olabileceğini ve bir yayılım ölçüsüne neden ihtiyacın olduğunu kavramayı</li>
<li>Herhangi bir küçük veri setinin değişim aralığı, varyans ve standart sapmasını elle hesaplamayı</li>
<li>Anakütle varyansını ($\\sigma^2$, $N$'ye böl) örneklem varyansından ($s^2$, $n-1$'e böl) ayırt etmeyi ve Bessel düzeltmesini açıklamayı</li>
<li>$Q_1$, $Q_2$ (medyan) ve $Q_3$'ü bulmayı, beş sayı özetini yazmayı ve çeyrekler arası açıklığı hesaplamayı</li>
<li>Bir kutu grafiğini okumayı ve $1.5\\cdot\\text{IQR}$ kuralı ile uç değer işaretlemeyi</li>
<li>Farklı birimli veri setlerinin göreli yayılımını karşılaştırmak için değişim katsayısı $\\text{CV} = \\sigma/\\mu$ hesaplamayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Yayılım Ölçüsüne İhtiyaç Var</h2>

<div class="calc-highlight"><strong>Tek başına ortalama son derece yanıltıcı olabilir.</strong> Aynı matematik sınavını alan iki küçük sınıf düşün. A sınıfı notları: $\\{68,\\,69,\\,70,\\,71,\\,72\\}$. B sınıfı notları: $\\{50,\\,60,\\,70,\\,80,\\,90\\}$. Her ikisinin ortalaması tam olarak 70. Her ikisinin medyanı tam olarak 70. Her merkez ölçüsüne göre iki sınıf birebir aynı. Ama bu iki sınıfın önünde duran herkes bilir ki bunlar hiç de aynı öğrenci grubu değildir.</div>

<p class="l-text">A sınıfı sıkı kümelenmiş: her öğrenci ortalamadan en fazla 2 puan uzakta. Onlara ders anlatmak homojen — herkes yaklaşık aynı düzeyde. B sınıfı son derece heterojen: bazı öğrencilerin desteğe, diğerlerinin ek materyale ihtiyacı var. Öğretmenin ders planı, derslerin temposu, hatta ders kitabı seçimi bile bu farka bağlıdır. Bunların hiçbiri ortalamadan görünmez. <em>Değerlerin ne kadar yayıldığını</em> sayısallaştıran bir sayıya ihtiyacın var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Merkez</div><div class="card-body">Verinin sayı doğrusu üzerinde nerede oturduğu. Araçlar: ortalama, medyan, mod.</div></div>
<div class="calc-card"><div class="card-title">Yayılım</div><div class="card-body">Değerlerin merkez etrafında ne kadar geniş dağıldığı. Araçlar: değişim aralığı, varyans, standart sapma, IQR.</div></div>
<div class="calc-card"><div class="card-title">Şekil</div><div class="card-body">Dağılım simetrik, çarpık, tek tepeli ya da çok tepeli mi. Histogramdan ya da kutu grafiğinden okunur.</div></div>
</div>

<h2 class="lesson-title">2. Değişim Aralığı</h2>

<div class="calc-highlight"><strong>En basit yayılım ölçüsü.</strong> Değişim aralığı, en büyük değer ile en küçük değer arasındaki farktır. Tüm veri setinden yalnızca iki sayı kullanır, dolayısıyla hesaplaması hızlıdır ama bilgilerin neredeyse tamamını atar — ve uç değerlere son derece duyarlıdır.</div>

<div class="calc-formula"><div class="formula-label">DEĞİŞİM ARALIĞI</div><div class="formula-main">$$\\text{aralik} \\;=\\; x_{\\max} \\;-\\; x_{\\min}$$</div><div class="formula-sub">Her zaman negatif olmayan. Yalnızca veri setindeki her değer aynıysa sıfıra eşittir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">Bir haftanın günlük en yüksek sıcaklıkları (&deg;C): $\\{18,\\,21,\\,17,\\,24,\\,20,\\,19,\\,23\\}$.<br><br>En yüksek: 24. En düşük: 17. Değişim aralığı: $24 - 17 = \\mathbf{7}$ &deg;C.<br><br>Bu hafta sıcaklıklar 7 derecelik bir aralıkta dolaşmış. Hızlı ve sezgisel ama aradaki değerler hakkında hiçbir şey söylemez.</div></div>

<p class="l-text"><strong>Değişim aralığının ölümcül zayıflığı.</strong> İki veri setine bak: $\\{20,\\,21,\\,22,\\,23,\\,24\\}$ (aralık 4) ve $\\{20,\\,22,\\,22,\\,22,\\,24\\}$ (aralık yine 4). Aralık bunları ayırt edemez, oysa ikincisi çok daha yoğun. Daha kötüsü, tek bir uç değer aralığı çarpıcı biçimde şişirebilir: $\\{20,\\,21,\\,22,\\,23,\\,24\\}$ veri setine 100 değerini eklemek aralığı 4'ten 80'e fırlatır ve aslında var olmayan çok geniş bir dağılım izlenimi verir. Değişim aralığı yalnızca kaba bir ilk bakıştır, fazlası değil.</p>

<h2 class="lesson-title">3. Varyansın Arkasındaki Fikir</h2>

<div class="calc-highlight"><strong>Daha iyi bir yayılım ölçüsü iki uç noktayı değil, her veri noktasını kullanmalıdır.</strong> Doğal fikir: her değer için ortalamadan ne kadar uzakta olduğunu ölç. Sonra bu sapmaların ortalamasını al.</div>

<p class="l-text">Bariz bir problem var. Bazı sapmalar pozitif (ortalamanın üstündeki değerler), bazıları negatif (ortalamanın altındaki değerler). Doğrudan ortalamalarını alırsak pozitifler ve negatifler birbirini götürür. Aslında <em>tam olarak</em> götürür: ortalamadan sapmaların toplamı her zaman sıfırdır. Bu rastlantı değil — ortalamanın tanımlayıcı bir özelliğidir (ortalama verinin denge noktasıdır). Yani ortalamadan önce tüm sapmaları negatif olmayan yapacak bir yola ihtiyacımız var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mutlak sapma</div><div class="card-body">$|x_i - \\bar{x}|$ al. Matematiksel olarak çalışır ama mutlak değer türevi almakta hantaldır; istatistikçiler bir sonraki seçeneği tercih eder.</div></div>
<div class="calc-card"><div class="card-title">Kare sapma</div><div class="card-body">$(x_i - \\bar{x})^2$ al. Her zaman negatif olmayan, düzgün ve varyansa yol açar — standart seçim.</div></div>
<div class="calc-card"><div class="card-title">Karenin kazanması</div><div class="card-body">Kare sapmalar şık cebirsel ve kalkülüs özelliklere sahiptir. Varyans neredeyse tüm ileri istatistiklerin temelidir: regresyon, ANOVA, makine öğrenmesi kayıp fonksiyonları.</div></div>
</div>

<h2 class="lesson-title">4. Anakütle Varyansı ve Standart Sapması</h2>

<div class="calc-highlight"><strong>Tüm anakütleye sahip olduğunda varyans, ortalamadan kare sapmaların ortalamasıdır.</strong> Standart sapma varyansın karekökü olup, birimleri orijinal ölçeğe geri taşır.</div>

<div class="calc-formula"><div class="formula-label">ANAKÜTLE VARYANSI</div><div class="formula-main">$$\\sigma^2 \\;=\\; \\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2$$</div><div class="formula-sub">$\\mu$ anakütle ortalaması, $N$ anakütle büyüklüğü. Varyansın birimleri karelidir (örneğin x metre ise metrekare).</div></div>

<div class="calc-formula"><div class="formula-label">ANAKÜTLE STANDART SAPMASI</div><div class="formula-main">$$\\sigma \\;=\\; \\sqrt{\\sigma^2} \\;=\\; \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N} (x_i - \\mu)^2}$$</div><div class="formula-sub">Standart sapma veri ile aynı birimdedir. Aktarılması daha yararlı olan sayı budur.</div></div>

<p class="l-text"><strong>Standart sapmayı okumak.</strong> Kabaca söylersek, $\\sigma$ bir veri noktasının ortalamadan "tipik" uzaklığını ölçer. $\\sigma$ küçükse veri ortalama etrafında yoğundur; $\\sigma$ büyükse veri geniş yayılmıştır. Çan şeklinde bir dağılım için değerlerin yaklaşık %68'i $\\mu \\pm \\sigma$ aralığına, %95'i $\\mu \\pm 2\\sigma$ aralığına düşer — hatırda tutulmaya değer bir pratik kural.</p>

<h2 class="lesson-title">5. Örneklem Varyansı ve Bessel Düzeltmesi</h2>

<div class="calc-highlight"><strong>Veri anakütlenin tamamı değil bir örneklemse, $n$ yerine $n-1$'e böl.</strong> Bu düzeltmeye Bessel düzeltmesi denir. Sebebi ince ama önemlidir: bilinmeyen $\\mu$ yerine örneklem ortalaması $\\bar{x}$'ı kullandığında, kare sapmalar $(x_i - \\bar{x})^2$ olması gerekenden (yani $(x_i - \\mu)^2$'den) bir miktar daha küçük olur. $n$ yerine $n-1$'e bölmek bu yanlılığı tam olarak telafi eder.</div>

<div class="calc-formula"><div class="formula-label">ÖRNEKLEM VARYANSI</div><div class="formula-main">$$s^2 \\;=\\; \\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2$$</div><div class="formula-sub">$\\bar{x}$ örneklem ortalaması, $n$ örneklem büyüklüğü. Payda $n-1$, "serbestlik derecesi" sayısıdır.</div></div>

<div class="calc-formula"><div class="formula-label">ÖRNEKLEM STANDART SAPMASI</div><div class="formula-main">$$s \\;=\\; \\sqrt{s^2} \\;=\\; \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$</div><div class="formula-sub">$n$ büyükse (örneğin $n > 30$), $n$'e bölmekle $n-1$'e bölmek arasında çok az fark olur. Küçük örneklemde fark eder.</div></div>

<div class="l-note"><strong>$n-1$ neden, sezgisel olarak.</strong> Örneklem ortalaması $\\bar{x}$, ölçtüğün verinin kendisinden hesaplanır. Bu veride göründüğünden bir bağımsız bilgi daha azı vardır: $n-1$ değeri ve ortalamayı bildiğinde son değer zorunlu olarak belirlenir. Yani yalnızca $n-1$ "serbest" bilgi parçası kalır — serbestlik dereceleri. Bu küçük sayıya bölmek, ortalama olarak tam doğru bir tahmin üretir.</div>

<h2 class="lesson-title">6. Hesaplamada Kısa Yol</h2>

<div class="calc-highlight"><strong>Elde hesap için kare sapmayı açmak çok daha hızlı bir formül verir.</strong> $E[(X - \\mu)^2] = E[X^2] - (E[X])^2$ özdeşliği, varyansı tek bir toplam ve fark listesi yerine iki toplamdan hesaplamana izin verir.</div>

<div class="calc-formula"><div class="formula-label">HESAPLAMA VARYANSI (ANAKÜTLE)</div><div class="formula-main">$$\\sigma^2 \\;=\\; \\frac{1}{N}\\sum_{i=1}^{N} x_i^2 \\;-\\; \\mu^2 \\;=\\; \\overline{x^2} \\;-\\; (\\bar{x})^2$$</div><div class="formula-sub">"Karelerin ortalaması eksi ortalamanın karesi." Yalnızca iki toplam gerekir: $\\sum x_i$ ve $\\sum x_i^2$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — KISA YOL</div><div class="example-body">$\\{2,\\,4,\\,4,\\,6\\}$ anakütle varyansını her iki yöntemle hesapla.<br><br><strong>Standart yöntem.</strong> Ortalama: $\\mu = (2+4+4+6)/4 = 4$. Sapmalar: $-2,\\,0,\\,0,\\,2$. Kare sapmalar: $4,\\,0,\\,0,\\,4$. Toplam: 8. Varyans: $\\sigma^2 = 8/4 = 2$.<br><br><strong>Kısa yol.</strong> $\\sum x_i^2 = 4+16+16+36 = 72$. Karelerin ortalaması: $72/4 = 18$. Ortalamanın karesi: $\\mu^2 = 16$. Varyans: $\\sigma^2 = 18 - 16 = 2$. Aynı sonuç.<br><br>SS: $\\sigma = \\sqrt{2} \\approx \\mathbf{1.41}$.</div></div>

<h2 class="lesson-title">7. Çözümlü Tam Örnek — Standart Sapma</h2>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YEDİ ELEMANLI VERİ SETİ</div><div class="example-body">$\\{4,\\,8,\\,6,\\,5,\\,3,\\,10,\\,7\\}$ için örneklem ortalama, örneklem varyansı ve örneklem standart sapmasını hesapla.<br><br><strong>Adım 1: Örneklem ortalaması.</strong> $\\bar{x} = (4+8+6+5+3+10+7)/7 = 43/7 \\approx 6.143$.<br><br><strong>Adım 2: Ortalamadan sapmalar.</strong><br>$4 - 6.143 = -2.143$<br>$8 - 6.143 = 1.857$<br>$6 - 6.143 = -0.143$<br>$5 - 6.143 = -1.143$<br>$3 - 6.143 = -3.143$<br>$10 - 6.143 = 3.857$<br>$7 - 6.143 = 0.857$<br><br><strong>Adım 3: Kare sapmalar.</strong><br>$4.592,\\;3.449,\\;0.020,\\;1.306,\\;9.878,\\;14.878,\\;0.734$.<br>Kare sapmaların toplamı: $\\sum (x_i - \\bar{x})^2 \\approx 34.857$.<br><br><strong>Adım 4: Örneklem varyansı.</strong> $s^2 = 34.857 / (7-1) = 34.857 / 6 \\approx 5.810$.<br><br><strong>Adım 5: Örneklem standart sapması.</strong> $s = \\sqrt{5.810} \\approx \\mathbf{2.41}$.<br><br>Anakütle varyansı ile karşılaştır (6 yerine 7'ye böl): $\\sigma^2 \\approx 4.980$, $\\sigma \\approx 2.23$. Örneklem versiyonu biraz daha büyük — Bessel düzeltmesi.</div></div>

<h2 class="lesson-title">8. Çeyrekler</h2>

<div class="calc-highlight"><strong>Çeyrekler, sıralı bir veri setini dört eşit parçaya böler.</strong> Birinci çeyrek $Q_1$, 25. yüzdeliktir: verinin dörtte biri onun altındadır. İkinci çeyrek $Q_2$, 50. yüzdeliktir — yani medyandır. Üçüncü çeyrek $Q_3$, 75. yüzdeliktir: verinin dörtte üçü onun altındadır. Minimum ve maksimumla birlikte <em>beş sayı özetini</em> oluştururlar.</div>

<p class="l-text"><strong>Elle çeyrek hesabı.</strong> Veriyi sırala. Medyanı $Q_2$'yi bul; bu veriyi alt yarı ve üst yarı olmak üzere ikiye ayırır. $Q_1$ alt yarının medyanıdır; $Q_3$ üst yarının medyanıdır. $n$ tek olduğunda ne yapılacağına dair birkaç sözleşme vardır ($Q_2$ alt yarıya mı, üst yarıya mı, hiçbirine mi dahil edilir?); liseler genellikle en basit kuralı kullanır: medyanın kendisini her iki yarıdan da dışlamak.</p>

<div class="calc-formula"><div class="formula-label">BEŞ SAYI ÖZETİ</div><div class="formula-main">$$\\{x_{\\min},\\; Q_1,\\; Q_2 = \\text{medyan},\\; Q_3,\\; x_{\\max}\\}$$</div><div class="formula-sub">Herhangi bir veri setinin merkezini, yayılımını ve kuyruklarını yakalayan beş sayı. Kompakt ve dayanıklı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÇİFT n</div><div class="example-body">$\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$ çeyrekleri.<br><br>Zaten sıralı, $n = 6$. Medyan: 6 ile 8'in ortalaması, yani $Q_2 = 7$.<br>Alt yarı: $\\{2, 4, 6\\}$. Alt yarının medyanı: $Q_1 = 4$.<br>Üst yarı: $\\{8, 10, 12\\}$. Üst yarının medyanı: $Q_3 = 10$.<br><br>Beş sayı özeti: $\\{2,\\,4,\\,7,\\,10,\\,12\\}$. Minimum 2, $Q_1 = 4$, medyan 7, $Q_3 = 10$, maksimum 12.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TEK n</div><div class="example-body">$\\{1,\\,3,\\,5,\\,7,\\,9,\\,11,\\,13\\}$ çeyrekleri.<br><br>Sıralı, $n = 7$. Medyan: orta konum (4. değer), yani $Q_2 = 7$.<br>Alt yarı (medyan hariç): $\\{1, 3, 5\\}$. $Q_1 = 3$.<br>Üst yarı (medyan hariç): $\\{9, 11, 13\\}$. $Q_3 = 11$.<br><br>Beş sayı özeti: $\\{1,\\,3,\\,7,\\,11,\\,13\\}$.</div></div>

<h2 class="lesson-title">9. Çeyrekler Arası Açıklık</h2>

<div class="calc-highlight"><strong>Çeyrekler arası açıklık (IQR), verinin ortadaki %50'sinin yayılımıdır.</strong> Üçüncü ve birinci çeyrek arasındaki farktır. En üstteki %25 ve en alttaki %25'i göz ardı ettiği için, IQR uç değerlere son derece dayanıklıdır — değişim aralığından ya da hatta standart sapmadan çok daha sağlam bir yayılım ölçüsüdür.</div>

<div class="calc-formula"><div class="formula-label">ÇEYREKLER ARASI AÇIKLIK</div><div class="formula-main">$$\\text{IQR} \\;=\\; Q_3 \\;-\\; Q_1$$</div><div class="formula-sub">Verinin orta %50'sinin genişliği. Her zaman negatif olmayan.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — IQR</div><div class="example-body">$\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$'ye geri dön: $Q_1 = 4$, $Q_3 = 10$.<br><br>IQR $= 10 - 4 = \\mathbf{6}$.<br><br>Verinin yarısı medyana yakın 6 birimlik bir pencere içine sığar. Değişim aralığıyla karşılaştır: $12 - 2 = 10$ — IQR daha küçük çünkü uçları kırpıyor.</div></div>

<h2 class="lesson-title">10. Kutu Grafiği</h2>

<div class="calc-highlight"><strong>Kutu grafiği, beş sayı özetinin görsel halidir.</strong> $Q_1$'den $Q_3$'e bir kutu çizilir (genişliği IQR'dir) ve içine medyanda bir çizgi konur. Kutudan en küçük ve en büyük uç-olmayan değerlere bıyıklar uzanır. Varsa uç değerler bıyıkların ötesinde ayrı noktalar olarak çizilir. Tek bir resimde izleyici merkezi, yayılımı, çarpıklığı ve uç değerleri görür — istatistikte daha kompakt bir özet yoktur.</div>

<div class="calc-graph"><div id="plot-l103-box5-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $\\{2,\\,4,\\,6,\\,8,\\,10,\\,12\\}$ veri setinin beş sayı özetiyle açıklanmış kutu grafiği: minimum, $Q_1$, medyan, $Q_3$, maksimum. Kutu orta %50'yi (IQR'yi) kapsar; bıyıklar uç noktalara ulaşır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var data=[2,4,6,8,10,12];
var trace={y:data,type:'box',name:'veri seti',marker:{color:'#3b82f6'},line:{color:'#60a5fa'},fillcolor:'rgba(59,130,246,0.25)',boxmean:false,boxpoints:'all',jitter:0,pointpos:0};
var anns=[
{x:0.16,y:2,xref:'paper',yref:'y',text:'min = 2',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:4,xref:'paper',yref:'y',text:'Q1 = 4',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:7,xref:'paper',yref:'y',text:'medyan = 7',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:10,xref:'paper',yref:'y',text:'Q3 = 10',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'},
{x:0.16,y:12,xref:'paper',yref:'y',text:'max = 12',showarrow:true,arrowhead:2,ax:60,ay:0,font:{color:'#e8e8e8'},arrowcolor:'#94a3b8'}
];
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{showticklabels:false,gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'değer',gridcolor:'rgba(255,255,255,0.06)',range:[0,14]},margin:{t:40,r:120,b:40,l:60},annotations:anns,showlegend:false};
Plotly.newPlot('plot-l103-box5-tr',[trace],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l103-hist-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı ortalamaya (50) ama farklı standart sapmalara sahip iki histogram. Mavi dağılım sıkı ($\\sigma \\approx 5$); turuncu olan geniş ($\\sigma \\approx 15$). Tek başına merkez bunları ayırt edemez; standart sapma ayırt eder.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function gauss(n,mu,sg,seed){var arr=[];var s=seed;for(var i=0;i<n;i++){var u1,u2;s=(s*9301+49297)%233280;u1=Math.max(s/233280,1e-9);s=(s*9301+49297)%233280;u2=s/233280;var z=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);arr.push(mu+sg*z);}return arr;}
var tight=gauss(400,50,5,7);
var wide=gauss(400,50,15,11);
var hT={x:tight,type:'histogram',name:'sigma = 5 (sıkı)',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},opacity:0.75,xbins:{start:0,end:100,size:2.5}};
var hW={x:wide,type:'histogram',name:'sigma = 15 (geniş)',marker:{color:'#f59e0b',line:{color:'#b45309',width:1}},opacity:0.65,xbins:{start:0,end:100,size:2.5}};
var meanLine={x:[50,50],y:[0,80],mode:'lines',line:{color:'#ef4444',width:3,dash:'dash'},name:'ortalama = 50 (her ikisi)'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'değer',gridcolor:'rgba(255,255,255,0.06)',range:[0,100]},yaxis:{title:'frekans',gridcolor:'rgba(255,255,255,0.06)'},barmode:'overlay',margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l103-hist-tr',[hT,hW,meanLine],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">11. 1.5&middot;IQR Uç Değer Kuralı</h2>

<div class="calc-highlight"><strong>Uç değer (outlier), verinin geneline uzak bir değerdir.</strong> En çok kullanılan pratik kural: bir değer $Q_1 - 1.5 \\cdot \\text{IQR}$ altında ya da $Q_3 + 1.5 \\cdot \\text{IQR}$ üstündeyse uç değerdir. Bu iki sınıra alt çit ve üst çit denir. Kutu grafiğinde bıyıklar en uzaktaki uç-olmayan değerlerde durur ve uç değerler bıyıkların ötesinde ayrı noktalar olarak çizilir.</div>

<div class="calc-formula"><div class="formula-label">UÇ DEĞER ÇİTLERİ</div><div class="formula-main">$$\\text{alt cit} = Q_1 - 1.5 \\cdot \\text{IQR}, \\qquad \\text{ust cit} = Q_3 + 1.5 \\cdot \\text{IQR}$$</div><div class="formula-sub">Alt çitin altındaki ya da üst çitin üstündeki değerler uç değer olarak işaretlenir. 1.5 katsayısı 1970'lerde John Tukey'nin koyduğu bir sözleşmedir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — UÇ DEĞERİ TESPİT ET</div><div class="example-body">$\\{1,\\,2,\\,2,\\,3,\\,3,\\,4,\\,4,\\,5,\\,20\\}$ veri setinde uç değer var mı?<br><br><strong>Adım 1: Çeyrekler.</strong> Sıralı, $n = 9$. Medyan $Q_2$ 5. değerdir = 3. Alt yarı (ilk 4 değer): $\\{1, 2, 2, 3\\}$, medyan $(2+2)/2 = Q_1 = 2$. Üst yarı (son 4 değer): $\\{4, 4, 5, 20\\}$, medyan $(4+5)/2 = Q_3 = 4.5$.<br><br><strong>Adım 2: IQR.</strong> $\\text{IQR} = Q_3 - Q_1 = 4.5 - 2 = 2.5$.<br><br><strong>Adım 3: Çitler.</strong> Alt çit: $2 - 1.5 \\cdot 2.5 = 2 - 3.75 = -1.75$. Üst çit: $4.5 + 1.5 \\cdot 2.5 = 4.5 + 3.75 = 8.25$.<br><br><strong>Adım 4: Kontrol.</strong> $-1.75$'tan küçük değer var mı? Hayır (minimum 1). $8.25$'ten büyük değer var mı? Evet — <strong>20</strong> değeri. Tek uç değer odur.<br><br>Bunun ne kadar dayanıklı olduğuna dikkat et: 20 geri kalandan alabildiğine büyük olsa da, IQR'ye dayalı kural onu temiz biçimde tanır çünkü çeyreklerin kendisi ondan etkilenmemiştir.</div></div>

<div class="calc-graph"><div id="plot-l103-box2-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yan yana iki kutu grafiği. Solda: uç değeri olmayan temiz bir veri seti. Sağda: aynı veri artı tek bir aşırı değer (20); kutunun kendisi neredeyse hiç değişmiyor, ama bıyığın ötesinde ayrı bir nokta uç değeri işaret ediyor. $1.5\\cdot\\text{IQR}$ kuralı onu izole etti.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var clean=[1,2,2,3,3,4,4,5,5,6];
var withOut=[1,2,2,3,3,4,4,5,20];
var t1={y:clean,type:'box',name:'uç değer yok',marker:{color:'#10b981'},line:{color:'#34d399'},fillcolor:'rgba(16,185,129,0.25)',boxpoints:'all',jitter:0.3,pointpos:0};
var t2={y:withOut,type:'box',name:'uç değerli',marker:{color:'#ef4444'},line:{color:'#f87171'},fillcolor:'rgba(239,68,68,0.25)',boxpoints:'outliers'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'değer',gridcolor:'rgba(255,255,255,0.06)',range:[-2,22]},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l103-box2-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Değişim Katsayısı</h2>

<div class="calc-highlight"><strong>Tek başına standart sapma farklı birimleri ya da farklı ölçekleri olan veri setleri arasında karşılaştırılamaz.</strong> SS'nin 5 olması bir nicelik için çok büyük olabilir (çocuk boyları, normalde $\\sigma$ yaklaşık 7 cm) ve bir başkası için çok küçük olabilir (TL cinsinden yıllık gelir, $\\sigma$ on binlerle ifade edilebilir). Değişim katsayısı (CV), SS'yi ortalamaya bölerek birim-bağımsız bir göreli yayılım ölçüsü verir.</div>

<div class="calc-formula"><div class="formula-label">DEĞİŞİM KATSAYISI</div><div class="formula-main">$$\\text{CV} \\;=\\; \\frac{\\sigma}{\\mu} \\quad \\text{(genellikle yuzde olarak ifade edilir)}$$</div><div class="formula-sub">Birimsiz. Büyük CV verinin merkezine göre daha yayılmış olduğu anlamına gelir. Anlamlı olması için $\\mu > 0$ olmalı.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — YAYILIM KARŞILAŞTIRMASI</div><div class="example-body">İki veri seti:<br>(a) cm cinsinden boylar: $\\mu = 170$, $\\sigma = 8$. CV $= 8/170 \\approx 0.047 = \\mathbf{\\%4.7}$.<br>(b) TL cinsinden gelirler: $\\mu = 30{,}000$, $\\sigma = 9{,}000$. CV $= 9000/30000 = 0.30 = \\mathbf{\\%30}$.<br><br>Gelir SS'si (9000) boy SS'sinden (8) mutlak olarak çok daha büyük olsa da, gelirlerin göreli yayılımı çok daha fazla — gelirler ortalama etrafında %30, boylar yalnızca %4.7 değişiyor. CV karşılaştırmayı adil kılar.</div></div>

<h2 class="lesson-title">13. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bessel düzeltmesini unutmak</div><div class="card-body">Veri bir örneklemse $n$ değil $n - 1$'e böl. Küçük örneklemlerde bu SS'yi belirgin biçimde değiştirebilir. Soruyu oku: "anakütle" mi "örneklem" mi?</div></div>
<div class="calc-card"><div class="card-title">Anakütle ve örneklem formüllerini karıştırmak</div><div class="card-body">$\\sigma^2$ paydasında $N$ kullanır; $s^2$ paydasında $n - 1$ kullanır. Yunan ve Latin harfleri sana hangisinin hangisi olduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">Çeyrek öncesi sıralamayı unutmak</div><div class="card-body">Çeyrek konumları sıralı veriyi varsayar. Önce sırala, sonra yarılara böl.</div></div>
<div class="calc-card"><div class="card-title">Çeyrek konumlarını yanlış saymak</div><div class="card-body">$n$ tek olduğunda yapılacak birkaç sözleşme vardır. En yaygın kural (burada kullanılan): $Q_1$ ve $Q_3$ hesaplanırken medyanı dışla.</div></div>
<div class="calc-card"><div class="card-title">Değişim aralığını ciddi ölçü saymak</div><div class="card-body">Değişim aralığı yalnızca iki değer kullanır ve uç değerlere son derece duyarlıdır. Yalnızca hızlı ilk bakış olarak aktar, ana yayılım ölçüsü olarak değil.</div></div>
<div class="calc-card"><div class="card-title">SS'yi yanlışlıkla karelemek</div><div class="card-body">SS zaten varyansın kareköküdür — tekrar karesini alma. Varyansın birimleri karelidir (cm&sup2;, TL&sup2;), SS'nin birimleri orijinaldir (cm, TL).</div></div>
</div>

<h2 class="lesson-title">14. Çözümlü Alıştırma Problemleri</h2>

<p class="l-text">Dersi pekiştiren sekiz problem. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; DEĞİŞİM ARALIĞI VE IQR</div><div class="example-body"><strong>$\\{5,\\,7,\\,8,\\,12,\\,15,\\,18,\\,22\\}$ için değişim aralığı ve IQR'yi bul.</strong><br><br>Zaten sıralı, $n = 7$.<br>Değişim aralığı: $22 - 5 = \\mathbf{17}$.<br>Medyan $Q_2 = 12$ (4. değer). Alt yarı $\\{5, 7, 8\\}$, $Q_1 = 7$. Üst yarı $\\{15, 18, 22\\}$, $Q_3 = 18$.<br>IQR: $18 - 7 = \\mathbf{11}$.<br><br>Verinin orta %50'si 11 birimlik bir pencereye sığıyor; toplam yayılım 17.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; ELLE ÖRNEKLEM SS</div><div class="example-body"><strong>$\\{6,\\,8,\\,10,\\,12,\\,14\\}$ örneklem standart sapmasını hesapla.</strong><br><br>Ortalama: $\\bar{x} = (6+8+10+12+14)/5 = 50/5 = 10$.<br>Sapmalar: $-4, -2, 0, 2, 4$.<br>Kare: $16, 4, 0, 4, 16$. Toplam: 40.<br>Örneklem varyansı: $s^2 = 40 / (5-1) = 40/4 = 10$.<br>Örneklem SS: $s = \\sqrt{10} \\approx \\mathbf{3.16}$.<br><br>Verinin 10 etrafında simetrik olduğuna dikkat — kareleme olmadan toplandığında sapmalar tam olarak götürür.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; ANAKÜTLE SS</div><div class="example-body"><strong>Aynı $\\{6,\\,8,\\,10,\\,12,\\,14\\}$ veri seti için anakütle standart sapmasını hesapla.</strong><br><br>Ortalama değişmedi: $\\mu = 10$. Kare sapmaların toplamı da değişmedi: 40.<br>Anakütle varyansı: $\\sigma^2 = 40 / 5 = 8$.<br>Anakütle SS: $\\sigma = \\sqrt{8} \\approx \\mathbf{2.83}$.<br><br>Örneklem SS'sinden (3.16) biraz daha küçük — Bessel düzeltmesi iş başında.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; BEŞ SAYI ÖZETİ</div><div class="example-body"><strong>$\\{3,\\,5,\\,7,\\,9,\\,10,\\,13,\\,15,\\,18,\\,22,\\,25\\}$ için beş sayı özetini ver.</strong><br><br>Sıralı, $n = 10$. Medyan: 5. ve 6. değerlerin ortalaması, $(10 + 13)/2 = Q_2 = 11.5$.<br>Alt yarı: $\\{3, 5, 7, 9, 10\\}$. Medyan $Q_1 = 7$.<br>Üst yarı: $\\{13, 15, 18, 22, 25\\}$. Medyan $Q_3 = 18$.<br><br>Beş sayı özeti: $\\{\\mathbf{3,\\,7,\\,11.5,\\,18,\\,25}\\}$. IQR $= 18 - 7 = 11$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; UÇ DEĞER TESPİTİ</div><div class="example-body"><strong>$\\{12,\\,15,\\,16,\\,17,\\,18,\\,19,\\,20,\\,21,\\,45\\}$ veri setinde uç değer var mı?</strong><br><br>Sıralı, $n = 9$. Medyan: 5. değer = 18. Alt yarı $\\{12, 15, 16, 17\\}$, $Q_1 = (15+16)/2 = 15.5$. Üst yarı $\\{19, 20, 21, 45\\}$, $Q_3 = (20+21)/2 = 20.5$.<br>IQR: $20.5 - 15.5 = 5$.<br>Üst çit: $20.5 + 1.5 \\cdot 5 = 28$. Alt çit: $15.5 - 7.5 = 8$.<br><br>28'den büyük değer var mı? Evet — <strong>45</strong> uç değer. 8'den küçük değer yok.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; KISA YOL FORMÜLÜ</div><div class="example-body"><strong>$\\{1,\\,3,\\,5,\\,7\\}$ anakütle varyansını hesaplama kısa yolunu kullanarak bul.</strong><br><br>$\\sum x_i = 16$, yani $\\mu = 16/4 = 4$.<br>$\\sum x_i^2 = 1 + 9 + 25 + 49 = 84$. Karelerin ortalaması: $84/4 = 21$.<br>Ortalamanın karesi: $\\mu^2 = 16$.<br>Varyans: $\\sigma^2 = 21 - 16 = \\mathbf{5}$.<br>SS: $\\sigma = \\sqrt{5} \\approx 2.24$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; DEĞİŞİM KATSAYISI</div><div class="example-body"><strong>A sınıfı: sınav notları ortalaması 70, SS'si 10. B sınıfı: sınav notları ortalaması 50, SS'si 8. Hangi sınıfta göreli değişkenlik daha fazla?</strong><br><br>A sınıfı: CV $= 10 / 70 \\approx 0.143 = \\%14.3$.<br>B sınıfı: CV $= 8 / 50 = 0.16 = \\%16$.<br><br>B sınıfı, ham SS'si daha küçük olsa da <strong>göreli</strong> olarak biraz daha değişken. CV, farklı ortalamalar arasında karşılaştırmayı adil kılar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; KUTU GRAFİĞİNİ YORUMLAMAK</div><div class="example-body"><strong>Bir sınıfın haftalık ders çalışma saatlerinin kutu grafiği şunu gösteriyor: minimum 2, $Q_1 = 6$, medyan 9, $Q_3 = 13$, maksimum 28; 28 değeri ayrı bir uç değer noktası olarak işaretli. Yayılım, çarpıklık ve uç değer hakkında yorum yap.</strong><br><br>IQR: $13 - 6 = 7$ saat. Sınıfın yarısı haftada 6 ile 13 saat arası çalışıyor.<br>Üst çit: $13 + 1.5 \\cdot 7 = 23.5$. 28 değeri bunu aşıyor, dolayısıyla uç değer işareti.<br>Çarpıklık: üst bıyık normalde en büyük uç-olmayan değere (belki 20 civarına) uzanır ve alt bıyıktan belirgin biçimde uzun olur. Dağılım sağa çarpık — çoğu öğrenci ılımlı çalışıyor, bir tane çok özverili öğrenci var.<br>Öğretmen bilir ki: çoğu öğrencinin "6-13 saat" temelinde zaman yönetimi desteğine ihtiyacı var; bir öğrenci medyanın neredeyse dört katı kadar çalışıyor.</div></div>

<h2 class="lesson-title">15. İleriye Bakış</h2>

<p class="l-text">Ortalama, medyan, mod sana verinin nerede oturduğunu söyler; değişim aralığı, varyans, standart sapma ve IQR ne kadar yayıldığını söyler; histogram ya da kutu grafiği şekli görmeni sağlar. Bu araçlarla herhangi bir küçük veri setini tek cümlede özetleyebilirsin ("ortalama 70, standart sapma 5, uç değer yok"). İstatistiğin bir sonraki adımları bu temel üzerine kurulur: olasılık bu betimsel sayıları belirsiz sonuçlar hakkında öngörülere çevirir; çıkarımsal istatistik örneklem SS'lerini kullanarak hata payları hesaplar ve hipotezleri test eder. Bu dersteki formülleri özümse, kalan istatistik bir sürü yeni sembol duvarı yerine ufak, iyi gerekçelendirilmiş genişletmelerin dizisi haline gelir.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Aynı ortalamayı paylaşan iki veri seti tamamen farklı yayılımlara sahip olabilir — merkez yanında her zaman bir yayılım ölçüsü aktar</li>
<li>Değişim aralığı $= x_{\\max} - x_{\\min}$ hızlıdır ama yalnızca iki değer kullanır</li>
<li>Anakütle varyansı $\\sigma^2 = \\frac{1}{N}\\sum (x_i - \\mu)^2$; anakütle SS'si $\\sigma = \\sqrt{\\sigma^2}$</li>
<li>Örneklem varyansı $s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar{x})^2$ Bessel düzeltmesini kullanır; örneklem SS'si onun kareköküdür</li>
<li>Hesaplama kısa yolu: $\\sigma^2 = \\overline{x^2} - (\\bar{x})^2$</li>
<li>Çeyrekler, sıralı veriyi dört eşit parçaya böler; beş sayı özeti $\\{\\min, Q_1, \\text{med}, Q_3, \\max\\}$</li>
<li>IQR $= Q_3 - Q_1$, orta %50'nin yayılımıdır ve uç değerlere son derece dayanıklıdır</li>
<li>Uç değer kuralı: $Q_1 - 1.5\\cdot\\text{IQR}$ altındaki ya da $Q_3 + 1.5\\cdot\\text{IQR}$ üstündeki değerler işaretlenir</li>
<li>Değişim katsayısı CV $= \\sigma / \\mu$, farklı veri setlerini karşılaştırmak için birim-bağımsız göreli yayılım verir</li>
</ul>
</div>`
};
