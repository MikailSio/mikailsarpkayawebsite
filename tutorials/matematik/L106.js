window.LISE_MAT_L106 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>You already have an average and a standard deviation in your toolkit.</strong> Those two numbers compress a column of data into a centre and a spread. But real data rarely arrives as a single column. It arrives as tables — height alongside weight, study hours alongside exam grade, ice cream sales alongside the calendar — and what we really want to know is not "what is the average of this column" but "how does this column move together with that one?" That is the territory of data analysis: relationships, patterns, and the pictures that make them visible.</p>

<p class="l-text">This lesson trains the visual literacy you need to read and produce charts. By the end of it you should know which chart fits which data type, what a scatter plot is telling you about correlation, why a correlation coefficient of 0.9 is not the same as proof that A causes B, and how to spot the cheap tricks people use to make ordinary numbers look dramatic. These skills are not optional. Every news article, science report, and political ad you will read for the rest of your life will lean on them.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish qualitative from quantitative data, and discrete from continuous data</li>
<li>Recognise the four scales of measurement: nominal, ordinal, interval, ratio</li>
<li>Pick the right chart for the job: bar, histogram, line, scatter, box plot, pie</li>
<li>Read a scatter plot and tell positive, negative, and no correlation apart at a glance</li>
<li>Use the correlation coefficient $r$ as a number between &minus;1 and +1 measuring linear association</li>
<li>Never confuse correlation with causation, and spot the classic ways charts mislead</li>
</ul>
</div>

<h2 class="lesson-title">1. Types of Data</h2>

<div class="calc-highlight"><strong>Before you draw anything, ask one question: what kind of variable is in front of me?</strong> The chart that works for one type will be wrong, sometimes misleading, for another. The classification is small and easy.</div>

<p class="l-text">Data comes in two big families. <strong>Qualitative</strong> (or categorical) data names a category — eye colour, favourite football team, blood type. You cannot meaningfully average two eye colours. <strong>Quantitative</strong> (or numerical) data measures a number — height in centimetres, exam score out of 100, number of siblings. You can add, average, and subtract these.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Qualitative (categorical)</div><div class="card-body">Values are labels, not numbers. Examples: blood type {A, B, AB, O}, gender, country of origin, brand of phone. No arithmetic — "A + B" makes no sense.</div></div>
<div class="calc-card"><div class="card-title">Quantitative (numerical)</div><div class="card-body">Values are numbers you can compute with. Examples: height (174 cm), exam grade (87/100), salary (15,000 TL/month), age (16 years). Average, sum, difference all make sense.</div></div>
</div>

<p class="l-text">Quantitative data splits one level further:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Discrete</div><div class="card-body">Only whole values (usually) — counting things. Number of siblings, goals scored, students in a class. You cannot have 2.7 siblings.</div></div>
<div class="calc-card"><div class="card-title">Continuous</div><div class="card-body">Can take any value in a range — measuring things. Height (174.32 cm), weight (62.5 kg), time (3.142 seconds). Between any two values there is always another.</div></div>
</div>

<div class="calc-example"><div class="example-label">CLASSIFY THESE</div><div class="example-body">For each variable, decide qualitative or quantitative; if quantitative, discrete or continuous.<br><br>(a) <em>Hair colour</em> &rarr; qualitative.<br>(b) <em>Number of books read in a year</em> &rarr; quantitative, discrete.<br>(c) <em>Time to finish a 100 m sprint</em> &rarr; quantitative, continuous.<br>(d) <em>Phone brand</em> &rarr; qualitative.<br>(e) <em>Exam grade out of 100</em> &rarr; quantitative, discrete (or treated as continuous if half-points are allowed).<br>(f) <em>Body temperature</em> &rarr; quantitative, continuous.</div></div>

<h2 class="lesson-title">2. Scales of Measurement</h2>

<div class="calc-highlight"><strong>Within each family there is a finer ladder of four levels.</strong> They tell you which operations are meaningful — can you order the values? subtract them? compute a ratio? Each step up adds an operation.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Scale</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Order?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Subtract?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ratio?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Example</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Nominal</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem">Blood type, country, gender</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Ordinal</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem">Race rank (1st, 2nd, 3rd); satisfaction (low, med, high)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Interval</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem;color:#ef4444">no</td><td style="padding:0.5rem 0.8rem">Temperature (&deg;C), calendar year</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Ratio</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem;color:#10b981">yes</td><td style="padding:0.5rem 0.8rem">Height, weight, time, salary</td></tr>
</tbody></table>
</div>

<p class="l-text">The critical distinction is between <strong>interval</strong> and <strong>ratio</strong>. Both let you subtract, but only ratio has a meaningful zero. 20&deg;C is not "twice as hot" as 10&deg;C — the zero on the Celsius scale is arbitrary (water freezes), so ratios are meaningless. But 20 kg <em>is</em> twice as heavy as 10 kg — zero kilograms means no mass, so ratios are real.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">Is "year of birth" an interval or ratio scale? (Interval — the zero of our calendar is arbitrary. Saying "born in 2010" is twice "born in 1005" makes no sense.) Is "age in years" an interval or ratio? (Ratio — a 20-year-old is twice as old as a 10-year-old, and 0 means "just born".)</div></div>

<h2 class="lesson-title">3. Choosing a Visualisation</h2>

<div class="calc-highlight"><strong>The chart you pick depends on the data you have.</strong> Six common types cover almost every situation a high-school student will meet. Pick wrong and the picture is at best confusing, at worst dishonest.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bar chart</div><div class="card-body">Comparing values across <em>categories</em>. One axis is categorical (eye colour, country, year), the other is a count or amount. Bars are separated by gaps because the categories are distinct.</div></div>
<div class="calc-card"><div class="card-title">Histogram</div><div class="card-body">Showing the <em>distribution</em> of a single numerical variable. The x-axis is split into bins, the y-axis counts how many data points fall in each bin. Bars touch because the variable is continuous.</div></div>
<div class="calc-card"><div class="card-title">Line chart</div><div class="card-body">Trend of one variable over time (or another ordered variable). x-axis is time, y-axis is the quantity. Points connected to show change.</div></div>
<div class="calc-card"><div class="card-title">Scatter plot</div><div class="card-body">Relationship between <em>two numerical variables</em>. Each data point becomes a dot at (x, y). The cloud's shape reveals correlation.</div></div>
<div class="calc-card"><div class="card-title">Box plot</div><div class="card-body">Five-number summary at a glance: minimum, Q1, median, Q3, maximum. Shows spread and outliers without showing every individual point. Great for comparing groups.</div></div>
<div class="calc-card"><div class="card-title">Pie chart</div><div class="card-body">Parts of a whole — but only for a small number of categories (3 to 6). Use sparingly: humans are bad at comparing angle areas. A bar chart almost always reads better.</div></div>
</div>

<div class="calc-graph"><div id="plot-l106-comparison-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same data (favourite sport of 60 students) displayed three different ways. The bar chart wins on clarity, the pie chart is acceptable but harder to compare visually, and the line chart is wrong because the categories are not ordered. The choice of chart is part of the data, not decoration.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cats=['Football','Basketball','Volleyball','Swimming','Tennis'];
var vals=[24,14,11,7,4];
var bar={x:cats,y:vals,type:'bar',name:'Bar (best)',marker:{color:'#3b82f6'},xaxis:'x',yaxis:'y'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'sport',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'students',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l106-comparison-en',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Quick rule of thumb:</strong> if your x-axis is a category (a word), use a bar chart. If it is a number, use a histogram, scatter, or line chart. If it is time, use a line. If you want to compare two numerical variables, always go to scatter.</div>

<h2 class="lesson-title">4. Reading a Scatter Plot</h2>

<div class="calc-highlight"><strong>A scatter plot is the single most useful diagram in two-variable statistics.</strong> Each dot represents one observation, plotted at the (x, y) coordinate given by its two measurements. The eye does the rest: from the shape of the cloud you can see whether the variables move together, move against each other, or have no apparent connection.</div>

<p class="l-text">Three patterns dominate:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POSITIVE CORRELATION</div><div class="compare-item">As x grows, y also tends to grow</div><div class="compare-item">Cloud slopes upward from lower-left to upper-right</div><div class="compare-item">Example: height and weight</div></div><div class="compare-col"><div class="compare-title">NEGATIVE CORRELATION</div><div class="compare-item">As x grows, y tends to shrink</div><div class="compare-item">Cloud slopes downward from upper-left to lower-right</div><div class="compare-item">Example: car age vs market value</div></div></div>

<p class="l-text">A third case is <strong>no correlation</strong>: the cloud is a shapeless blob with no direction. Knowing x tells you nothing useful about y.</p>

<div class="calc-graph"><div id="plot-l106-scatter-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three synthetic data sets side by side. Left panel — points climb together (positive correlation, $r \\approx 0.85$). Middle — points climb in opposite directions (negative, $r \\approx -0.85$). Right — points scattered randomly with no pattern (no correlation, $r \\approx 0$). Train your eye to recognise these three shapes instantly.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rand(){return Math.random()-0.5;}
var n=40;var x1=[],y1=[],x2=[],y2=[],x3=[],y3=[];
for(var i=0;i<n;i++){var xi=i/n*10;x1.push(xi);y1.push(xi+rand()*3);x2.push(xi);y2.push(10-xi+rand()*3);x3.push(xi);y3.push(5+rand()*8);}
var pos={x:x1,y:y1,mode:'markers',name:'positive',marker:{color:'#3b82f6',size:8},xaxis:'x',yaxis:'y'};
var neg={x:x2,y:y2,mode:'markers',name:'negative',marker:{color:'#ef4444',size:8},xaxis:'x2',yaxis:'y2'};
var none={x:x3,y:y3,mode:'markers',name:'none',marker:{color:'#f59e0b',size:8},xaxis:'x3',yaxis:'y3'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:3,pattern:'independent'},xaxis:{title:'positive (r≈+0.85)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'negative (r≈−0.85)',gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{gridcolor:'rgba(255,255,255,0.06)'},xaxis3:{title:'none (r≈0)',gridcolor:'rgba(255,255,255,0.06)'},yaxis3:{gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:50},showlegend:false};
Plotly.newPlot('plot-l106-scatter-en',[pos,neg,none],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. The Correlation Coefficient r</h2>

<div class="calc-highlight"><strong>"Tends to" is vague. We want a number.</strong> The <em>Pearson correlation coefficient</em>, written $r$, measures linear association between two numerical variables on a fixed scale from &minus;1 to +1. Closer to the extremes means stronger linear pattern; closer to zero means weaker.</div>

<div class="calc-formula"><div class="formula-label">PEARSON CORRELATION (CONCEPT)</div><div class="formula-main">$$r \\;=\\; \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\cdot \\sum (y_i - \\bar{y})^2}}$$</div><div class="formula-sub">You do not need to compute this by hand at high-school level. What you need is to read the value and understand what it means.</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Value of $r$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Meaning</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Picture</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+1</td><td style="padding:0.5rem 0.8rem">Perfect positive linear</td><td style="padding:0.5rem 0.8rem">All points exactly on an upward-sloping line</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+0.7 to +0.9</td><td style="padding:0.5rem 0.8rem">Strong positive</td><td style="padding:0.5rem 0.8rem">Clear upward trend, some scatter</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+0.3 to +0.6</td><td style="padding:0.5rem 0.8rem">Moderate positive</td><td style="padding:0.5rem 0.8rem">Loose upward tendency</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\approx 0$</td><td style="padding:0.5rem 0.8rem">No linear relationship</td><td style="padding:0.5rem 0.8rem">Cloud with no direction (but might still be non-linear!)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">&minus;0.3 to &minus;0.6</td><td style="padding:0.5rem 0.8rem">Moderate negative</td><td style="padding:0.5rem 0.8rem">Loose downward tendency</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">&minus;0.7 to &minus;0.9</td><td style="padding:0.5rem 0.8rem">Strong negative</td><td style="padding:0.5rem 0.8rem">Clear downward trend</td></tr>
<tr><td style="padding:0.5rem 0.8rem">&minus;1</td><td style="padding:0.5rem 0.8rem">Perfect negative linear</td><td style="padding:0.5rem 0.8rem">All points exactly on a downward line</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The crucial small print.</strong> $r$ measures only <em>linear</em> association. A perfect parabola, $y = x^2$ on a symmetric range around 0, will produce $r = 0$ — even though x and y are deterministically related. The scatter plot would show the parabola immediately; the number $r$ alone would be silent about it.</p>

<div class="l-note"><strong>Always look at the scatter plot before quoting r.</strong> Two data sets can have identical correlation coefficients but utterly different shapes. The most famous example, Anscombe's quartet, shows four data sets all with $r \\approx 0.816$ but one is linear, one is curved, one has an outlier driving the result, and one is a vertical strip with a single far point.</div>

<h2 class="lesson-title">6. Correlation Does Not Imply Causation</h2>

<div class="calc-highlight"><strong>This is the single most-misused idea in all of statistics.</strong> A high $r$ between two variables tells you they move together. It does <em>not</em> tell you that one causes the other. The connection might run the other way, or both might be driven by a hidden third variable, or the alignment might simply be coincidence.</div>

<p class="l-text">Four explanations for a strong correlation between A and B:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A causes B</div><div class="card-body">The straightforward case. More exercise &rarr; lower resting heart rate. The arrow really runs from A to B.</div></div>
<div class="calc-card"><div class="card-title">B causes A</div><div class="card-body">The arrow runs the other way. People with good test scores study a lot — but maybe their natural ability leads them to enjoy studying, not the other way around.</div></div>
<div class="calc-card"><div class="card-title">A common cause C</div><div class="card-body">Both A and B are effects of some third variable C. The classic: ice cream sales and shark attacks both peak in summer. Hot weather drives both. No causal link between them.</div></div>
<div class="calc-card"><div class="card-title">Coincidence</div><div class="card-body">Two unrelated series happen to wiggle similarly. Number of Nicolas Cage films and pool drownings each year. With enough variables, spurious correlations appear by chance.</div></div>
</div>

<div class="calc-example"><div class="example-label">CLASSIC EXAMPLE</div><div class="example-body"><strong>Ice cream sales and shark attacks.</strong><br><br>Take monthly data from a coastal town. Plot ice cream sales (x) against shark attacks at the beach (y). You will see a clear positive correlation — months with high ice cream sales also have high shark attacks. $r$ might be 0.7 or 0.8.<br><br>Does eating ice cream cause shark attacks? Of course not. The hidden variable is <strong>warm weather</strong>. Hot summer days send more people to the beach (more potential targets for sharks) and also drive ice cream sales. The correlation is real and strong; the causal arrow is absent.</div></div>

<div class="think-box"><div class="think-label">YOUR TURN</div><div class="think-body">For each pair, suggest a plausible hidden variable that could explain the correlation without one causing the other.<br><br>(a) Children's shoe size and reading ability. (Age.)<br>(b) Number of firefighters at a fire and damage caused. (Size of the fire.)<br>(c) Coffee consumption and risk of heart attack. (Stress, sleep deprivation, occupational class.)</div></div>

<h2 class="lesson-title">7. Linear Regression: The Line of Best Fit</h2>

<div class="calc-highlight"><strong>When correlation is strong and positive (or strong and negative), one further step is natural: draw a straight line through the cloud.</strong> That line is the <em>line of best fit</em>, also called the regression line. It is the single straight line that minimises the total squared vertical distance from each data point. We will not derive its formula at high-school level — but you should know it exists and what it is for.</div>

<div class="calc-formula"><div class="formula-label">LINE OF BEST FIT</div><div class="formula-main">$$\\hat{y} \\;=\\; a + b \\, x$$</div><div class="formula-sub">$b$ is the slope (how much y changes per unit increase in x), $a$ is the intercept (predicted y when x is zero). The "hat" on $\\hat{y}$ marks it as a prediction, not an observed value.</div></div>

<p class="l-text"><strong>What the line is for.</strong> Given a new x value not in your data set, the line gives you a best guess for y. If the data are study hours (x) versus exam grade (y), and the line says $\\hat{y} = 30 + 5 x$, then a student who studies for 8 hours is predicted to score $30 + 5 \\times 8 = 70$. That is a prediction, not a guarantee — actual scores will scatter around the line.</p>

<div class="l-note"><strong>Do not extrapolate beyond the data.</strong> If your training data only contained study hours from 0 to 10, do not use the line to predict the grade of someone who studies 100 hours. The pattern that held in the observed range may break down outside it. Extrapolation is the single most common forecasting mistake.</div>

<h2 class="lesson-title">8. Misleading Charts</h2>

<div class="calc-highlight"><strong>Charts can lie.</strong> A truthful set of numbers, plotted with the wrong choices, becomes a tool of persuasion rather than a tool of understanding. Knowing the common tricks lets you defend yourself.</div>

<p class="l-text">Three classic tricks:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Truncated y-axis</div><div class="card-body">Bar chart of two values, say 102 and 104. Start the y-axis at 100 instead of 0, and the second bar looks twice as tall as the first. The numbers differ by 2%, the picture screams "doubled". Always check where the y-axis starts.</div></div>
<div class="calc-card"><div class="card-title">3D pie deception</div><div class="card-body">Tilt a pie chart into 3D. The slices closer to the viewer look larger than they really are (perspective foreshortening). The number on each slice may be honest; the visual impression is not.</div></div>
<div class="calc-card"><div class="card-title">Cherry-picked scales</div><div class="card-body">Choose a logarithmic axis where linear would do (or vice versa) to make small changes look big, or big changes look small. Choose a time window that excludes inconvenient periods. The y-axis label might be technically accurate, but the picture's message is selected, not discovered.</div></div>
</div>

<div class="calc-graph"><div id="plot-l106-misleading-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the same four data points (sales for four quarters: 100, 102, 104, 105) drawn two different ways. The left panel has its y-axis truncated to start at 99 — the growth looks dramatic. The right panel uses an honest y-axis starting at 0 — the growth looks like what it actually is, a flat 5% rise. Same data, very different impressions.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=['Q1','Q2','Q3','Q4'];
var ys=[100,102,104,105];
var tricky={x:xs,y:ys,type:'bar',name:'truncated',marker:{color:'#ef4444'},xaxis:'x',yaxis:'y'};
var honest={x:xs,y:ys,type:'bar',name:'honest',marker:{color:'#3b82f6'},xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'misleading (y starts at 99)',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{range:[99,106],gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'honest (y starts at 0)',gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{range:[0,120],gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l106-misleading-en',[tricky,honest],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">DEFENCE CHECKLIST</div><div class="think-body">When you see a chart in a news article, ask: (1) Where does the y-axis start? (2) What time window is shown — is anything cropped out? (3) Is the chart type appropriate for the data type? (4) Is the source cited and credible? (5) If percentages are shown, percentages of what?</div></div>

<h2 class="lesson-title">9. Worked Examples</h2>

<div class="calc-example"><div class="example-label">EXAMPLE 1 — HEIGHT vs WEIGHT</div><div class="example-body">A class of 15 students measures their heights (cm) and weights (kg). A scatter plot shows points trending up: taller students tend to be heavier. Computing the Pearson coefficient gives $r \\approx 0.82$.<br><br><strong>Interpretation:</strong> strong positive correlation. The line of best fit might be $\\hat{y} = -50 + 0.7 x$, meaning each extra centimetre of height predicts roughly 0.7 kg more weight. Does taller cause heavier? Not directly; growth in height and weight both come from the underlying biological development. But the prediction is useful regardless of the causal arrow.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 2 — ICE CREAM AND SHARKS</div><div class="example-body">Monthly data from a coastal town over four years (48 months). x = ice cream sales (kg sold); y = shark attacks at the local beach. Scatter plot shows clear positive trend, $r \\approx 0.75$.<br><br><strong>Spurious correlation.</strong> The third variable is mean monthly temperature. Hot months &rarr; more ice cream sold; hot months &rarr; more beach visitors &rarr; more shark attacks. The arrow does not run between ice cream and sharks. Banning ice cream sales would not reduce shark attacks by a single bite.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 3 — STUDY HOURS vs EXAM GRADE</div><div class="example-body">A teacher records, for 20 students, the number of hours studied for an exam (x) and the grade out of 100 (y). Scatter plot: positive trend, $r \\approx 0.68$.<br><br>Line of best fit: $\\hat{y} = 35 + 4.5 x$. A student who studies 10 hours is predicted to score $35 + 45 = 80$. A student who does not study at all is predicted to score 35.<br><br><strong>Caution:</strong> do not predict for x = 100 hours of study. The line was fitted on data from 0 to ~12 hours. Beyond that range we have no evidence the relationship is still linear (probably it plateaus or saturates).</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 4 — IDENTIFYING THE CHART</div><div class="example-body">Which chart for each task?<br><br>(a) Comparing the populations of five cities &rarr; <strong>bar chart</strong>.<br>(b) Showing how a single class's heights are distributed &rarr; <strong>histogram</strong>.<br>(c) Daily temperature in Istanbul over a year &rarr; <strong>line chart</strong>.<br>(d) Are height and weight related? &rarr; <strong>scatter plot</strong>.<br>(e) Comparing exam grade distributions of three different classes side by side &rarr; <strong>box plot</strong> (one box per class).<br>(f) Showing what fraction of family income goes to rent, food, transport, etc. &rarr; <strong>pie chart</strong> (or stacked bar).</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 5 — READING r</div><div class="example-body">For each scenario, what value of $r$ would you expect?<br><br>(a) A person's height in centimetres vs the same height in inches. (Perfect linear, $r = +1$.)<br>(b) A car's age vs its market value. (Strong negative, $r \\approx -0.85$.)<br>(c) Last digit of phone number vs height. (No relation, $r \\approx 0$.)<br>(d) Outdoor temperature vs heating bill in winter. (Strong negative.)<br>(e) Height squared vs height. (Strong positive, but slightly non-linear so not exactly $+1$.)</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 6 — SPOTTING THE DECEPTION</div><div class="example-body">A campaign poster shows a bar chart of crime rates in two adjacent districts. District A's bar is twice as tall as district B's. The footnote reveals the y-axis starts at 950, with district A at 1000 and district B at 975. The actual difference is 2.5%, but the picture suggests a doubling.<br><br><strong>Defence:</strong> always check the y-axis baseline before interpreting a bar chart's visual differences. If it is not zero, redraw the chart mentally with a zero baseline before drawing conclusions.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 7 — BOX PLOT COMPARISON</div><div class="example-body">Three classes (A, B, C) take the same exam. Box plots side by side show:<br><br>Class A: median 70, IQR (Q1 to Q3) from 60 to 80, no extreme outliers.<br>Class B: median 70 — same median — but IQR from 40 to 95, one outlier at 15.<br>Class C: median 75, IQR from 70 to 80, very tight.<br><br><strong>Interpretation:</strong> A and B have the same centre but very different spread (B is much more variable). C has a slightly higher centre and the tightest spread (most consistent). The mean alone could not have told you any of this; the box plot makes the differences visible in a glance.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE 8 — NON-LINEAR PATTERN</div><div class="example-body">A scatter plot of x and y shows a perfect inverted U: y rises, peaks, falls. Pearson's $r$ is computed and comes out close to 0.<br><br><strong>Conclusion:</strong> there is a strong relationship but it is not linear. $r = 0$ does <em>not</em> mean "no relationship" — only "no linear relationship". The scatter plot's shape is what told you the truth; the single number did not.</div></div>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confusing correlation with causation</div><div class="card-body">"Coffee drinkers have more heart attacks, so coffee causes heart attacks." Maybe — but stress, sleep, occupation, and many other variables differ between coffee drinkers and abstainers. A randomised experiment is the only way to establish causation; an observational study can only show correlation.</div></div>
<div class="calc-card"><div class="card-title">Extrapolating beyond the data</div><div class="card-body">Using a regression line built on data from 0 to 10 hours of study to predict outcomes for 50 hours. The line knows nothing about that range.</div></div>
<div class="calc-card"><div class="card-title">Treating $r = 0$ as "no relationship"</div><div class="card-body">It means no <em>linear</em> relationship only. Always look at the scatter plot.</div></div>
<div class="calc-card"><div class="card-title">Using the wrong chart type</div><div class="card-body">A pie chart with 20 slices, a line chart with categorical x-axis, a bar chart with continuous data. Match the chart to the data type.</div></div>
<div class="calc-card"><div class="card-title">Ignoring the y-axis baseline</div><div class="card-body">A bar chart truncated near the values exaggerates differences. Always check zero.</div></div>
<div class="calc-card"><div class="card-title">Cherry-picking</div><div class="card-body">"Stock market dropped 5% this week." Sure — but it rose 30% over the year. Pick the time window carefully and you can tell any story you want.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Data is qualitative (categorical) or quantitative (numerical, discrete or continuous)</li>
<li>Four measurement scales: nominal, ordinal, interval, ratio &mdash; each adds one allowed operation</li>
<li>Six chart types: bar, histogram, line, scatter, box, pie &mdash; match the chart to the data</li>
<li>Scatter plot reveals positive, negative, or no correlation at a glance</li>
<li>Pearson's $r$ lives in $[-1, +1]$ and measures only <em>linear</em> association</li>
<li>Correlation is not causation &mdash; consider reverse direction, hidden common cause, or coincidence</li>
<li>Line of best fit gives predictions inside the data range, but never extrapolate beyond it</li>
<li>Truncated axes, 3D pies, and cherry-picked windows are the classic ways charts mislead</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Cebinde zaten bir ortalama ve bir standart sapma var.</strong> O iki sayı, bir veri sütununu bir merkez ve bir yayılım olarak özetliyor. Ama gerçek veri nadiren tek bir sütun olarak gelir. Tablolar halinde gelir &mdash; boyla birlikte kilo, ders saatleriyle birlikte sınav notu, dondurma satışıyla birlikte takvim &mdash; ve asıl merak ettiğimiz şey "bu sütunun ortalaması nedir" değil, "bu sütun şu sütunla birlikte nasıl hareket ediyor?" sorusudur. İşte veri analizinin alanı budur: ilişkiler, örüntüler ve onları görünür kılan resimler.</p>

<p class="l-text">Bu ders, grafikleri okumak ve üretmek için ihtiyaç duyacağın görsel okuryazarlığı eğitir. Sonunda hangi grafiğin hangi veri türüne uyduğunu, bir saçılım grafiğinin korelasyon hakkında ne söylediğini, korelasyon katsayısının 0.9 olmasının "A, B'ye sebep olur" anlamına gelmediğini ve insanların sıradan sayıları çarpıcı göstermek için kullandığı ucuz hileleri fark etmeyi biliyor olmalısın. Bu beceriler isteğe bağlı değil. Hayatının geri kalanında okuyacağın her haber, her bilim raporu ve her siyasi reklam bunlara yaslanacak.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Niteliksel veriyi niceliksel veriden, kesikli veriyi sürekli veriden ayırt etmeyi</li>
<li>Dört ölçüm ölçeğini tanımayı: sınıflama (nominal), sıralama (ordinal), aralık (interval), oran (ratio)</li>
<li>İşe doğru grafiği seçmeyi: çubuk, histogram, çizgi, saçılım, kutu, pasta</li>
<li>Bir saçılım grafiğini okuyup pozitif, negatif ve sıfır korelasyonu bir bakışta ayırt etmeyi</li>
<li>Korelasyon katsayısını $r$ olarak, &minus;1 ile +1 arasında lineer ilişkiyi ölçen bir sayı olarak kullanmayı</li>
<li>Korelasyonu asla nedensellikle karıştırmamayı ve grafiklerin klasik yanıltma yollarını fark etmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Veri Türleri</h2>

<div class="calc-highlight"><strong>Bir şey çizmeden önce tek bir soru sor: önümdeki değişken nasıl bir değişken?</strong> Bir tür için iyi çalışan grafik, başka tür için yanlış, hatta yanıltıcı olur. Sınıflandırma küçük ve kolaydır.</div>

<p class="l-text">Veri iki büyük aileye ayrılır. <strong>Niteliksel</strong> (kategorik) veri bir kategoriye isim verir &mdash; göz rengi, en sevilen futbol takımı, kan grubu. İki göz rengini ortalayamazsın. <strong>Niceliksel</strong> (sayısal) veri bir sayıyı ölçer &mdash; cm cinsinden boy, 100 üzerinden sınav puanı, kardeş sayısı. Bunları toplayabilir, ortalayabilir, çıkarabilirsin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Niteliksel (kategorik)</div><div class="card-body">Değerler etiketlerdir, sayı değil. Örnekler: kan grubu {A, B, AB, O}, cinsiyet, ülke, telefon markası. Aritmetik yok &mdash; "A + B" anlamsız.</div></div>
<div class="calc-card"><div class="card-title">Niceliksel (sayısal)</div><div class="card-body">Değerler hesap yapabileceğin sayılardır. Örnekler: boy (174 cm), sınav notu (87/100), maaş (15.000 TL/ay), yaş (16 yıl). Ortalama, toplam, fark hepsi anlamlı.</div></div>
</div>

<p class="l-text">Niceliksel veri bir düzey daha bölünür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesikli</div><div class="card-body">Genelde sadece tam sayı değerleri &mdash; şeyleri saymak. Kardeş sayısı, atılan gol sayısı, sınıftaki öğrenci sayısı. 2,7 kardeş olamaz.</div></div>
<div class="calc-card"><div class="card-title">Sürekli</div><div class="card-body">Bir aralıkta herhangi bir değer alabilir &mdash; şeyleri ölçmek. Boy (174,32 cm), kilo (62,5 kg), zaman (3,142 saniye). Herhangi iki değer arasında her zaman bir başka değer vardır.</div></div>
</div>

<div class="calc-example"><div class="example-label">SINIFLANDIRMAYI DENE</div><div class="example-body">Her değişken için niteliksel mi niceliksel mi olduğuna karar ver; niceliksel ise kesikli mi sürekli mi?<br><br>(a) <em>Saç rengi</em> &rarr; niteliksel.<br>(b) <em>Bir yılda okunan kitap sayısı</em> &rarr; niceliksel, kesikli.<br>(c) <em>100 m koşusunu bitirme süresi</em> &rarr; niceliksel, sürekli.<br>(d) <em>Telefon markası</em> &rarr; niteliksel.<br>(e) <em>100 üzerinden sınav notu</em> &rarr; niceliksel, kesikli (yarım puana izin varsa sürekli muamelesi de yapılabilir).<br>(f) <em>Vücut sıcaklığı</em> &rarr; niceliksel, sürekli.</div></div>

<h2 class="lesson-title">2. Ölçüm Ölçekleri</h2>

<div class="calc-highlight"><strong>Her ailenin içinde dört basamaklı daha ince bir merdiven var.</strong> Hangi işlemlerin anlamlı olduğunu söylerler &mdash; değerleri sıralayabilir misin? çıkarabilir misin? oran hesaplayabilir misin? Her bir basamak yukarı çıktıkça bir işlem eklenir.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ölçek</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sıralama?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Çıkarma?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Oran?</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örnek</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Sınıflama</strong></td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem">Kan grubu, ülke, cinsiyet</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Sıralama</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem">Yarış sırası (1., 2., 3.); memnuniyet (düşük, orta, yüksek)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Aralık</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem;color:#ef4444">hayır</td><td style="padding:0.5rem 0.8rem">Sıcaklık (&deg;C), takvim yılı</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Oran</strong></td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem;color:#10b981">evet</td><td style="padding:0.5rem 0.8rem">Boy, kilo, zaman, maaş</td></tr>
</tbody></table>
</div>

<p class="l-text">En kritik ayrım <strong>aralık</strong> ile <strong>oran</strong> arasındadır. İkisi de çıkarmaya izin verir ama yalnızca oranda anlamlı bir sıfır vardır. 20&deg;C, 10&deg;C'nin "iki katı sıcak" değildir &mdash; Celsius ölçeğinin sıfırı keyfîdir (su donar), dolayısıyla oranlar anlamsızdır. Ama 20 kg, 10 kg'nin gerçekten <em>iki katı</em> ağırdır &mdash; sıfır kilogram "kütle yok" demektir, oranlar gerçektir.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">"Doğum yılı" aralık mı oran ölçeği mi? (Aralık &mdash; takvimimizin sıfırı keyfîdir. "2010'da doğmuş, 1005'te doğanın iki katı" demek anlamsızdır.) "Yıl olarak yaş" aralık mı oran mı? (Oran &mdash; 20 yaşındaki biri 10 yaşındakinin iki katı yaşlıdır, 0 ise "yeni doğmuş" demektir.)</div></div>

<h2 class="lesson-title">3. Doğru Görselleştirmeyi Seçmek</h2>

<div class="calc-highlight"><strong>Seçeceğin grafik elindeki veriye bağlıdır.</strong> Altı yaygın tür, bir lise öğrencisinin karşılaşacağı neredeyse her durumu kapsar. Yanlış seç, resim en iyi ihtimalle kafa karıştırır, en kötü ihtimalle aldatır.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çubuk grafik</div><div class="card-body"><em>Kategoriler</em> arasında değer karşılaştırma. Bir eksen kategoriktir (göz rengi, ülke, yıl), diğeri bir sayım ya da miktardır. Çubuklar arasında boşluk olur çünkü kategoriler birbirinden ayrıktır.</div></div>
<div class="calc-card"><div class="card-title">Histogram</div><div class="card-body">Tek bir sayısal değişkenin <em>dağılımını</em> göstermek için. x ekseni gruplara (bin) bölünür, y ekseni her gruba kaç veri noktası düştüğünü sayar. Çubuklar birbirine değer çünkü değişken süreklidir.</div></div>
<div class="calc-card"><div class="card-title">Çizgi grafik</div><div class="card-body">Tek bir değişkenin zaman içindeki (ya da başka sıralı bir değişkene göre) trendi. x ekseni zaman, y ekseni miktar. Değişimi göstermek için noktalar çizgiyle birleştirilir.</div></div>
<div class="calc-card"><div class="card-title">Saçılım grafiği</div><div class="card-body"><em>İki sayısal değişken</em> arasındaki ilişki. Her veri noktası (x, y) konumunda bir nokta olur. Bulutun şekli korelasyonu açığa çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Kutu grafiği</div><div class="card-body">Bir bakışta beş sayılı özet: minimum, Q1, medyan, Q3, maksimum. Her bir noktayı göstermeden yayılımı ve aykırı değerleri verir. Grupları karşılaştırmak için harikadır.</div></div>
<div class="calc-card"><div class="card-title">Pasta grafik</div><div class="card-body">Bir bütünün parçaları &mdash; ama yalnızca az sayıda kategori için (3 ila 6). Az kullan: insanlar açı alanlarını karşılaştırmakta kötüdür. Hemen her zaman çubuk grafik daha iyi okunur.</div></div>
</div>

<div class="calc-graph"><div id="plot-l106-comparison-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı veri (60 öğrencinin en sevdiği spor) üç farklı biçimde gösterilmiş. Çubuk grafik netlik konusunda kazanıyor, pasta kabul edilebilir ama görsel karşılaştırması daha zor, çizgi grafik ise yanlış çünkü kategoriler sıralı değil. Grafik seçimi verinin bir parçasıdır, süs değil.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var cats=['Futbol','Basketbol','Voleybol','Yüzme','Tenis'];
var vals=[24,14,11,7,4];
var bar={x:cats,y:vals,type:'bar',name:'Çubuk (en iyisi)',marker:{color:'#3b82f6'},xaxis:'x',yaxis:'y'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'spor',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'öğrenci sayısı',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l106-comparison-tr',[bar],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Hızlı pratik kural:</strong> x eksenin bir kategori (bir kelime) ise çubuk grafik. Bir sayı ise histogram, saçılım veya çizgi. Zaman ise çizgi. İki sayısal değişkeni karşılaştırmak istiyorsan her zaman saçılıma git.</div>

<h2 class="lesson-title">4. Saçılım Grafiğini Okumak</h2>

<div class="calc-highlight"><strong>Saçılım grafiği, iki değişkenli istatistikteki en yararlı tek diyagramdır.</strong> Her nokta bir gözlemi temsil eder, iki ölçümünün verdiği (x, y) konumuna yerleştirilir. Gerisini göz halleder: bulutun şeklinden değişkenlerin birlikte mi, ters mi yoksa görünür bir bağ olmadan mı hareket ettiğini görürsün.</div>

<p class="l-text">Üç örüntü baskındır:</p>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">POZİTİF KORELASYON</div><div class="compare-item">x büyürken y de büyüme eğilimindedir</div><div class="compare-item">Bulut sol-alttan sağ-üste yukarı doğru eğilir</div><div class="compare-item">Örnek: boy ve kilo</div></div><div class="compare-col"><div class="compare-title">NEGATİF KORELASYON</div><div class="compare-item">x büyürken y küçülme eğilimindedir</div><div class="compare-item">Bulut sol-üstten sağ-alta aşağı doğru eğilir</div><div class="compare-item">Örnek: bir arabanın yaşı ve piyasa değeri</div></div></div>

<p class="l-text">Üçüncü bir durum <strong>korelasyon yok</strong>: bulut şekilsiz, yönsüz bir lekedir. x'i bilmek y hakkında yararlı bir bilgi vermez.</p>

<div class="calc-graph"><div id="plot-l106-scatter-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yan yana üç yapay veri seti. Solda &mdash; noktalar birlikte yükseliyor (pozitif korelasyon, $r \\approx 0.85$). Ortada &mdash; noktalar ters yönde gidiyor (negatif, $r \\approx -0.85$). Sağda &mdash; örüntüsüz, rastgele dağılım (korelasyon yok, $r \\approx 0$). Bu üç şekli anında tanıyacak şekilde gözünü eğit.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function rand(){return Math.random()-0.5;}
var n=40;var x1=[],y1=[],x2=[],y2=[],x3=[],y3=[];
for(var i=0;i<n;i++){var xi=i/n*10;x1.push(xi);y1.push(xi+rand()*3);x2.push(xi);y2.push(10-xi+rand()*3);x3.push(xi);y3.push(5+rand()*8);}
var pos={x:x1,y:y1,mode:'markers',name:'pozitif',marker:{color:'#3b82f6',size:8},xaxis:'x',yaxis:'y'};
var neg={x:x2,y:y2,mode:'markers',name:'negatif',marker:{color:'#ef4444',size:8},xaxis:'x2',yaxis:'y2'};
var none={x:x3,y:y3,mode:'markers',name:'yok',marker:{color:'#f59e0b',size:8},xaxis:'x3',yaxis:'y3'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:3,pattern:'independent'},xaxis:{title:'pozitif (r≈+0.85)',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'negatif (r≈−0.85)',gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{gridcolor:'rgba(255,255,255,0.06)'},xaxis3:{title:'yok (r≈0)',gridcolor:'rgba(255,255,255,0.06)'},yaxis3:{gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:50},showlegend:false};
Plotly.newPlot('plot-l106-scatter-tr',[pos,neg,none],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Korelasyon Katsayısı r</h2>

<div class="calc-highlight"><strong>"Eğilimindedir" muğlak. Sayı istiyoruz.</strong> $r$ ile gösterilen <em>Pearson korelasyon katsayısı</em>, iki sayısal değişken arasındaki lineer ilişkiyi &minus;1 ile +1 arasında sabit bir ölçekte ölçer. Uçlara yakın olmak güçlü lineer örüntü, sıfıra yakın olmak zayıf örüntü demektir.</div>

<div class="calc-formula"><div class="formula-label">PEARSON KORELASYONU (KAVRAM)</div><div class="formula-main">$$r \\;=\\; \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\cdot \\sum (y_i - \\bar{y})^2}}$$</div><div class="formula-sub">Bunu lise düzeyinde elle hesaplamana gerek yok. İhtiyacın olan, değeri okuyup ne anlama geldiğini anlamak.</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">$r$ değeri</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Anlam</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Resim</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+1</td><td style="padding:0.5rem 0.8rem">Kusursuz pozitif lineer</td><td style="padding:0.5rem 0.8rem">Tüm noktalar yukarı eğimli tek bir doğru üzerinde</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+0.7 ila +0.9</td><td style="padding:0.5rem 0.8rem">Güçlü pozitif</td><td style="padding:0.5rem 0.8rem">Net yukarı trend, biraz saçılma</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">+0.3 ila +0.6</td><td style="padding:0.5rem 0.8rem">Orta düzey pozitif</td><td style="padding:0.5rem 0.8rem">Gevşek yukarı eğilim</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">$\\approx 0$</td><td style="padding:0.5rem 0.8rem">Lineer ilişki yok</td><td style="padding:0.5rem 0.8rem">Yönsüz bulut (ama hâlâ lineer-olmayan örüntü olabilir!)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">&minus;0.3 ila &minus;0.6</td><td style="padding:0.5rem 0.8rem">Orta düzey negatif</td><td style="padding:0.5rem 0.8rem">Gevşek aşağı eğilim</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">&minus;0.7 ila &minus;0.9</td><td style="padding:0.5rem 0.8rem">Güçlü negatif</td><td style="padding:0.5rem 0.8rem">Net aşağı trend</td></tr>
<tr><td style="padding:0.5rem 0.8rem">&minus;1</td><td style="padding:0.5rem 0.8rem">Kusursuz negatif lineer</td><td style="padding:0.5rem 0.8rem">Tüm noktalar aşağı eğimli tek bir doğru üzerinde</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Önemli ince yazı.</strong> $r$ yalnızca <em>lineer</em> ilişkiyi ölçer. Simetrik bir aralıkta $y = x^2$ olan kusursuz bir parabol $r = 0$ üretir &mdash; x ve y deterministik olarak ilişkili olsa bile. Saçılım grafiği paraboliği hemen gösterirdi; yalnızca $r$ sayısı bu konuda sessiz kalırdı.</p>

<div class="l-note"><strong>r'yi söylemeden önce her zaman saçılım grafiğine bak.</strong> İki veri setinin korelasyon katsayıları birebir aynı olsa bile şekilleri tamamen farklı olabilir. En ünlü örnek olan Anscombe dörtlüsü, hepsinin $r \\approx 0.816$ olduğu dört veri seti gösterir, ama biri lineer, biri eğri, birinde sonucu sürükleyen tek bir aykırı değer var, sonuncusunda da tek bir uzak nokta olan dikey bir şerit var.</div>

<h2 class="lesson-title">6. Korelasyon Nedensellik Demek Değildir</h2>

<div class="calc-highlight"><strong>Bu, tüm istatistikteki en çok kötüye kullanılan tek fikirdir.</strong> İki değişken arasında yüksek bir $r$, onların birlikte hareket ettiğini söyler. Birinin diğerine <em>neden olduğunu</em> söylemez. Bağlantı ters yönde olabilir, ikisi de gizli bir üçüncü değişken tarafından sürüklenebilir veya hizalanma sadece tesadüf olabilir.</div>

<p class="l-text">A ile B arasında güçlü korelasyon için dört açıklama:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">A, B'ye neden olur</div><div class="card-body">En basit durum. Daha çok egzersiz &rarr; daha düşük dinlenme nabzı. Ok gerçekten A'dan B'ye gider.</div></div>
<div class="calc-card"><div class="card-title">B, A'ya neden olur</div><div class="card-body">Ok ters yönde gider. İyi sınav notu alanlar çok ders çalışıyor &mdash; ama belki doğal yetenekleri çalışmayı sevdiriyordur, tam tersi değil.</div></div>
<div class="calc-card"><div class="card-title">Ortak bir sebep C</div><div class="card-body">Hem A hem B, üçüncü bir değişken C'nin sonucudur. Klasik örnek: dondurma satışları ve köpekbalığı saldırıları yazın zirve yapar. Sıcak hava ikisini de sürükler. Aralarında nedensel bağ yoktur.</div></div>
<div class="calc-card"><div class="card-title">Tesadüf</div><div class="card-body">İki ilgisiz seri benzer biçimde dalgalanır. Nicolas Cage filmlerinin sayısı ile yıllık havuz boğulmaları. Yeterince değişken alırsan, sahte korelasyonlar tesadüfen ortaya çıkar.</div></div>
</div>

<div class="calc-example"><div class="example-label">KLASİK ÖRNEK</div><div class="example-body"><strong>Dondurma satışları ve köpekbalığı saldırıları.</strong><br><br>Bir kıyı şehrinden aylık veri al. Dondurma satışlarını (x) plajdaki köpekbalığı saldırılarına (y) karşı çiz. Net bir pozitif korelasyon göreceksin &mdash; dondurma satışlarının yüksek olduğu aylarda köpekbalığı saldırıları da yüksek. $r$ belki 0,7 veya 0,8'dir.<br><br>Dondurma yemek köpekbalığı saldırılarına neden olur mu? Tabii ki hayır. Gizli değişken <strong>sıcak hava</strong>. Sıcak yaz günleri daha çok insanı plaja gönderir (köpekbalığı için daha fazla potansiyel hedef) ve aynı zamanda dondurma satışlarını yükseltir. Korelasyon gerçek ve güçlü; nedensel ok yok.</div></div>

<div class="think-box"><div class="think-label">SIRA SENDE</div><div class="think-body">Her çift için, biri diğerine neden olmadan korelasyonu açıklayabilecek inandırıcı bir gizli değişken öner.<br><br>(a) Çocukların ayakkabı numarası ve okuma becerisi. (Yaş.)<br>(b) Bir yangında bulunan itfaiyeci sayısı ve verilen hasar. (Yangının büyüklüğü.)<br>(c) Kahve tüketimi ve kalp krizi riski. (Stres, uyku eksikliği, mesleki sınıf.)</div></div>

<h2 class="lesson-title">7. Lineer Regresyon: En İyi Uyum Doğrusu</h2>

<div class="calc-highlight"><strong>Korelasyon güçlü pozitif (ya da güçlü negatif) olduğunda bir adım daha doğal: bulutun içinden bir doğru çekmek.</strong> Bu doğruya <em>en iyi uyum doğrusu</em> ya da regresyon doğrusu denir. Her veri noktasından dik mesafelerin karelerinin toplamını en küçük yapan tek doğrudur. Lise düzeyinde formülünü türetmeyeceğiz &mdash; ama varlığını ve ne işe yaradığını bilmelisin.</div>

<div class="calc-formula"><div class="formula-label">EN İYİ UYUM DOĞRUSU</div><div class="formula-main">$$\\hat{y} \\;=\\; a + b \\, x$$</div><div class="formula-sub">$b$ eğim (x bir birim arttığında y ne kadar değişir), $a$ kesim noktası (x sıfır iken tahmin edilen y). $\\hat{y}$ üzerindeki şapka, bunun bir tahmin olduğunu, gözlenmiş bir değer olmadığını belirtir.</div></div>

<p class="l-text"><strong>Doğru ne işe yarar.</strong> Veri setinde olmayan yeni bir x değeri verildiğinde, doğru sana y için en iyi tahmini verir. Veriler ders çalışma saatleri (x) ve sınav notu (y) ise ve doğru $\\hat{y} = 30 + 5 x$ diyorsa, 8 saat çalışan bir öğrencinin $30 + 5 \\times 8 = 70$ alması tahmin edilir. Bu bir tahmindir, garanti değil &mdash; gerçek notlar doğrunun etrafında saçılır.</p>

<div class="l-note"><strong>Verinin dışına ekstrapolasyon yapma.</strong> Eğitim verin yalnızca 0 ila 10 saat arası ders çalışmayı içeriyorsa, 100 saat çalışan birinin notunu tahmin etmek için doğruyu kullanma. Gözlenen aralıkta tutan örüntü, dışında bozulabilir. Ekstrapolasyon, tahminlemenin en yaygın tek hatasıdır.</div>

<h2 class="lesson-title">8. Yanıltıcı Grafikler</h2>

<div class="calc-highlight"><strong>Grafikler yalan söyleyebilir.</strong> Doğru bir sayı kümesi, yanlış seçimlerle çizildiğinde bir anlama aracı değil, ikna aracına dönüşür. Yaygın hileleri bilmek seni korur.</div>

<p class="l-text">Üç klasik hile:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesilmiş y ekseni</div><div class="card-body">İki değerli bir çubuk grafik, mesela 102 ve 104. y eksenini 0 yerine 100'den başlat, ikinci çubuk birincinin iki katı kadar yüksek görünür. Sayılar arasında %2 fark var, resim "iki kat" diye bağırıyor. Y ekseninin nereden başladığını her zaman kontrol et.</div></div>
<div class="calc-card"><div class="card-title">3B pasta aldatmacası</div><div class="card-body">Bir pasta grafiği 3B ile eğ. Bakanın yakınındaki dilimler aslında olduklarından daha büyük görünür (perspektif kısalması). Her dilimin üzerindeki sayı dürüst olabilir; görsel izlenim değil.</div></div>
<div class="calc-card"><div class="card-title">Seçilmiş ölçek</div><div class="card-body">Lineer yeterken logaritmik eksen seç (ya da tersi), küçük değişiklikleri büyük göstermek için, ya da tersi. Hoşa gitmeyen dönemleri dışlayan bir zaman penceresi seç. Y ekseni etiketi teknik olarak doğru olabilir, ama resmin mesajı keşfedilmemiş, seçilmiştir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l106-misleading-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı dört veri noktası (dört çeyreğin satışları: 100, 102, 104, 105) iki farklı biçimde çizilmiş. Sol panelin y ekseni 99'dan başlayacak şekilde kesilmiş &mdash; büyüme dramatik görünüyor. Sağ panel 0'dan başlayan dürüst bir y ekseni kullanıyor &mdash; büyüme gerçekte olduğu gibi, sade bir %5 artış olarak görünüyor. Aynı veri, çok farklı izlenimler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=['Ç1','Ç2','Ç3','Ç4'];
var ys=[100,102,104,105];
var tricky={x:xs,y:ys,type:'bar',name:'kesilmiş',marker:{color:'#ef4444'},xaxis:'x',yaxis:'y'};
var honest={x:xs,y:ys,type:'bar',name:'dürüst',marker:{color:'#3b82f6'},xaxis:'x2',yaxis:'y2'};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},grid:{rows:1,columns:2,pattern:'independent'},xaxis:{title:'yanıltıcı (y 99\\'dan başlıyor)',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{range:[99,106],gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'dürüst (y 0\\'dan başlıyor)',gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{range:[0,120],gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l106-misleading-tr',[tricky,honest],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="think-box"><div class="think-label">SAVUNMA LİSTESİ</div><div class="think-body">Bir haber yazısında grafik gördüğünde sor: (1) Y ekseni nereden başlıyor? (2) Hangi zaman penceresi gösterilmiş &mdash; bir şey dışarıda mı bırakılmış? (3) Grafik türü veri türüne uygun mu? (4) Kaynak belirtilmiş ve güvenilir mi? (5) Yüzdeler gösteriliyorsa, nenin yüzdesi?</div></div>

<h2 class="lesson-title">9. Çözümlü Örnekler</h2>

<div class="calc-example"><div class="example-label">ÖRNEK 1 — BOY ve KİLO</div><div class="example-body">15 kişilik bir sınıf boylarını (cm) ve kilolarını (kg) ölçer. Saçılım grafiği yukarı bir trend gösterir: uzun boylu öğrenciler daha ağır olma eğilimindedir. Pearson katsayısı $r \\approx 0.82$ çıkar.<br><br><strong>Yorum:</strong> güçlü pozitif korelasyon. En iyi uyum doğrusu mesela $\\hat{y} = -50 + 0.7 x$ olabilir, yani her ek santim boy yaklaşık 0,7 kg fazla kilo tahmin eder. Uzun olmak ağır olmaya doğrudan neden olur mu? Doğrudan hayır; boyda ve kiloda büyüme, altta yatan biyolojik gelişimden gelir. Ama tahmin nedensel okun yönü ne olursa olsun kullanışlıdır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 2 — DONDURMA VE KÖPEKBALIKLARI</div><div class="example-body">Kıyı şehrinden dört yıllık aylık veri (48 ay). x = dondurma satışları (kg cinsinden); y = yerel plajdaki köpekbalığı saldırıları. Saçılım grafiği net pozitif trend gösteriyor, $r \\approx 0.75$.<br><br><strong>Sahte korelasyon.</strong> Üçüncü değişken aylık ortalama sıcaklık. Sıcak aylar &rarr; daha çok dondurma satışı; sıcak aylar &rarr; daha çok plaj ziyaretçisi &rarr; daha çok köpekbalığı saldırısı. Ok dondurma ile köpekbalığı arasında gitmez. Dondurma satışını yasaklamak köpekbalığı saldırılarını tek bir ısırık bile azaltmaz.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 3 — DERS SAATİ ve SINAV NOTU</div><div class="example-body">Bir öğretmen 20 öğrencinin sınava çalıştığı saat sayısını (x) ve aldıkları notu (y, 100 üzerinden) kaydeder. Saçılım grafiği: pozitif trend, $r \\approx 0.68$.<br><br>En iyi uyum doğrusu: $\\hat{y} = 35 + 4.5 x$. 10 saat çalışan bir öğrencinin $35 + 45 = 80$ alması tahmin edilir. Hiç çalışmayan bir öğrencinin 35 alması tahmin edilir.<br><br><strong>Dikkat:</strong> x = 100 saat çalışma için tahmin yapma. Doğru, 0 ila ~12 saat verisinden uyduruldu. O aralığın ötesinde ilişkinin hâlâ lineer olduğuna dair kanıtımız yok (muhtemelen bir noktadan sonra düzleşir veya doyar).</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 4 — GRAFİK SEÇİMİ</div><div class="example-body">Her görev için hangi grafik?<br><br>(a) Beş şehrin nüfuslarını karşılaştırmak &rarr; <strong>çubuk grafik</strong>.<br>(b) Tek bir sınıfın boylarının nasıl dağıldığını göstermek &rarr; <strong>histogram</strong>.<br>(c) Bir yıl boyunca İstanbul'da günlük sıcaklık &rarr; <strong>çizgi grafik</strong>.<br>(d) Boy ile kilo ilişkili mi? &rarr; <strong>saçılım grafiği</strong>.<br>(e) Üç farklı sınıfın sınav notu dağılımlarını yan yana karşılaştırmak &rarr; <strong>kutu grafiği</strong> (sınıf başına bir kutu).<br>(f) Aile gelirinin ne kadarının kiraya, yiyeceğe, ulaşıma vs. gittiğini göstermek &rarr; <strong>pasta grafik</strong> (veya yığılmış çubuk).</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 5 — r DEĞERİNİ TAHMİN ET</div><div class="example-body">Her senaryo için hangi $r$ değerini beklersin?<br><br>(a) Bir kişinin boyu cm cinsinden ile aynı boyu inç cinsinden. (Kusursuz lineer, $r = +1$.)<br>(b) Bir arabanın yaşı ile piyasa değeri. (Güçlü negatif, $r \\approx -0.85$.)<br>(c) Telefon numarasının son hanesi ile boy. (İlişkisiz, $r \\approx 0$.)<br>(d) Kışın dış sıcaklık ile ısınma faturası. (Güçlü negatif.)<br>(e) Boyun karesi ile boy. (Güçlü pozitif, ama hafif lineer-dışı olduğu için tam $+1$ değil.)</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 6 — ALDATMACAYI YAKALAMAK</div><div class="example-body">Bir kampanya afişi iki komşu ilçedeki suç oranlarının çubuk grafiğini gösteriyor. A ilçesinin çubuğu B ilçesinin iki katı yüksek. Dipnot, y ekseninin 950'den başladığını, A ilçesinin 1000, B ilçesinin 975'te olduğunu açıklıyor. Gerçek fark %2,5, ama resim iki kata çıkartıyor.<br><br><strong>Savunma:</strong> bir çubuk grafiğinin görsel farklarını yorumlamadan önce her zaman y ekseni başlangıcını kontrol et. Sıfır değilse, sonuç çıkarmadan önce grafiği zihinsel olarak sıfır başlangıçla yeniden çiz.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 7 — KUTU GRAFİĞİ KARŞILAŞTIRMASI</div><div class="example-body">Üç sınıf (A, B, C) aynı sınavı alır. Yan yana çizilen kutu grafikleri şunu gösterir:<br><br>A sınıfı: medyan 70, IQR (Q1 ila Q3) 60-80, aşırı aykırı değer yok.<br>B sınıfı: medyan 70 &mdash; aynı medyan &mdash; ama IQR 40-95, 15'te bir aykırı değer.<br>C sınıfı: medyan 75, IQR 70-80, çok dar.<br><br><strong>Yorum:</strong> A ve B'nin merkezi aynı, yayılımları çok farklı (B çok daha değişken). C'nin merkezi biraz daha yüksek, yayılımı en dar (en tutarlı). Yalnız ortalama sana bunların hiçbirini söyleyemezdi; kutu grafiği farkları bir bakışta görünür kıldı.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK 8 — LİNEER-OLMAYAN ÖRÜNTÜ</div><div class="example-body">x ve y'nin saçılım grafiği mükemmel bir ters U gösteriyor: y yükselir, tepe yapar, düşer. Pearson $r$ hesaplanır ve sıfıra yakın çıkar.<br><br><strong>Sonuç:</strong> güçlü bir ilişki var ama lineer değil. $r = 0$ "ilişki yok" demek <em>değildir</em> &mdash; yalnızca "lineer ilişki yok" demektir. Doğruyu anlatan saçılım grafiğinin şekliydi; tek başına sayı değildi.</div></div>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Korelasyonu nedensellikle karıştırmak</div><div class="card-body">"Kahve içenler daha çok kalp krizi geçiriyor, demek ki kahve kalp krizine neden oluyor." Belki &mdash; ama stres, uyku, meslek ve birçok başka değişken kahve içenler ile içmeyenler arasında farklıdır. Nedenselliği kurmanın tek yolu rastgele atamalı bir deneydir; gözlemsel bir çalışma yalnızca korelasyon gösterebilir.</div></div>
<div class="calc-card"><div class="card-title">Verinin dışına tahmin</div><div class="card-body">0 ila 10 saat çalışma verisiyle uydurulan bir regresyon doğrusunu, 50 saat için sonuç tahmin etmek üzere kullanmak. Doğru o aralık hakkında hiçbir şey bilmiyor.</div></div>
<div class="calc-card"><div class="card-title">$r = 0$'ı "ilişki yok" sanmak</div><div class="card-body">Yalnızca <em>lineer</em> ilişki yok demektir. Her zaman saçılım grafiğine bak.</div></div>
<div class="calc-card"><div class="card-title">Yanlış grafik türü kullanmak</div><div class="card-body">20 dilimli pasta, kategorik x eksenli çizgi grafik, sürekli veriyle çubuk grafik. Grafiği veri türüne uydur.</div></div>
<div class="calc-card"><div class="card-title">Y ekseni başlangıcını gözden kaçırmak</div><div class="card-body">Değerlerin yanına kesilmiş bir çubuk grafik farkları abartır. Her zaman sıfırı kontrol et.</div></div>
<div class="calc-card"><div class="card-title">Seçici alıntı (cherry-picking)</div><div class="card-body">"Borsa bu hafta %5 düştü." Tamam &mdash; ama yıl boyunca %30 yükseldi. Zaman penceresini dikkatlice seçersen istediğin hikâyeyi anlatabilirsin.</div></div>
</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Veri niteliksel (kategorik) ya da niceliksel (sayısal, kesikli ya da sürekli) olur</li>
<li>Dört ölçüm ölçeği: sınıflama, sıralama, aralık, oran &mdash; her biri bir işlem daha ekler</li>
<li>Altı grafik türü: çubuk, histogram, çizgi, saçılım, kutu, pasta &mdash; grafiği veriye uydur</li>
<li>Saçılım grafiği pozitif, negatif ya da sıfır korelasyonu bir bakışta gösterir</li>
<li>Pearson'un $r$'si $[-1, +1]$ aralığındadır ve yalnızca <em>lineer</em> ilişkiyi ölçer</li>
<li>Korelasyon nedensellik değildir &mdash; ters yön, gizli ortak sebep ya da tesadüf olasılığını düşün</li>
<li>En iyi uyum doğrusu veri aralığı içinde tahmin verir; asla dışına ekstrapolasyon yapma</li>
<li>Kesilmiş eksen, 3B pasta ve seçilmiş pencere grafiklerin klasik yanıltma yollarıdır</li>
</ul>
</div>`
};
