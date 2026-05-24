window.LISE_MAT_L102 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Statistics begins with a deceptively small question:</strong> if I hand you a list of numbers — test scores, salaries, daily rainfall, heart rates — what single number best <em>summarises</em> it? You cannot quote the whole list every time someone asks "how did the class do on the exam?" or "how much does a software engineer earn in Istanbul?" You need a one-number answer that captures the essence of the data. The bad news: there is no single best answer. The good news: there are three classical contenders — <em>mean</em>, <em>median</em>, and <em>mode</em> — and each is useful in a different situation.</p>

<p class="l-text">This lesson teaches you what those three numbers mean, how to compute them by hand, when to prefer one over the others, and the most common mistakes students make. We will also meet two specialised cousins of the arithmetic mean — the <em>weighted</em> mean and the <em>geometric</em> mean — that appear when you average grades, prices, or growth rates. By the end you should be able to look at any small dataset and pick the right summary statistic without thinking twice.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish descriptive statistics (summarising data you have) from inferential statistics (drawing conclusions about a larger population)</li>
<li>Tell apart a <em>population parameter</em> (Greek letter, e.g. &mu;) from a <em>sample statistic</em> (Latin letter, e.g. x&#772;)</li>
<li>Compute the arithmetic mean, median and mode by hand for any small dataset</li>
<li>Recognise when an outlier makes the mean misleading and the median more honest</li>
<li>Use the weighted mean for GPAs and the geometric mean for compound growth rates</li>
<li>Read a histogram and decide whether the distribution is symmetric, right-skewed, or left-skewed</li>
</ul>
</div>

<h2 class="lesson-title">1. Descriptive vs Inferential Statistics</h2>

<div class="calc-highlight"><strong>Statistics is the science of summarising data.</strong> It comes in two flavours. <em>Descriptive statistics</em> takes a list of numbers and squeezes it into a few summary values: a centre, a spread, a shape. <em>Inferential statistics</em> goes one step further — given a small sample, it estimates properties of the much larger population the sample came from. This lesson is entirely descriptive: we will summarise what is in front of us, nothing more.</div>

<p class="l-text">A simple example: you record the height of every student in your class. The class is the <em>population</em>. The list of heights you wrote down is the <em>complete data</em> for that population. Descriptive statistics asks: <em>what was the average height?</em> Inferential statistics asks the harder question: <em>given my class average, what can I say about the average height of all 17-year-olds in Turkey?</em> The first uses only the numbers you have; the second extrapolates beyond them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Descriptive</div><div class="card-body">Summarise data already collected. No claims beyond it. Tools: mean, median, mode, standard deviation, histograms, box plots.</div></div>
<div class="calc-card"><div class="card-title">Inferential</div><div class="card-body">Use a sample to estimate something about a population you did not measure entirely. Tools: confidence intervals, hypothesis tests, regression.</div></div>
<div class="calc-card"><div class="card-title">Where we are</div><div class="card-body">Pure descriptive. The numbers we compute summarise the dataset we are looking at; we do not yet draw conclusions about anything bigger.</div></div>
</div>

<h2 class="lesson-title">2. Population vs Sample: Parameters vs Statistics</h2>

<div class="calc-highlight"><strong>A population is the complete group you care about; a sample is a subset you actually measure.</strong> Statisticians distinguish them rigorously, because a number computed from the whole population is a <em>parameter</em>, while the same number computed from a sample is a <em>statistic</em>. They get different names <em>and</em> different symbols.</div>

<p class="l-text">The convention is universal: parameters use <strong>Greek letters</strong>, statistics use <strong>Latin letters</strong>. The mean of an entire population is written &mu; (Greek mu); the mean of a sample drawn from that population is written x&#772; (Latin x-bar). The standard deviation of a population is &sigma; (Greek sigma); the standard deviation of a sample is s (Latin s). Mixing them up is one of the easiest ways to lose points on an exam.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Quantity</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Population (parameter)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sample (statistic)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Size</td><td style="padding:0.5rem 0.8rem">N (capital)</td><td style="padding:0.5rem 0.8rem">n (lowercase)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Mean</td><td style="padding:0.5rem 0.8rem">&mu;</td><td style="padding:0.5rem 0.8rem">x&#772;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Standard deviation</td><td style="padding:0.5rem 0.8rem">&sigma;</td><td style="padding:0.5rem 0.8rem">s</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Proportion</td><td style="padding:0.5rem 0.8rem">p</td><td style="padding:0.5rem 0.8rem">p&#770;</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Why two notations?</strong> Because a sample mean x&#772; is itself a <em>random number</em> — different samples give different x&#772;'s — while the population mean &mu; is a <em>fixed but unknown</em> number. Inferential statistics is essentially the art of using one (x&#772;) to estimate the other (&mu;). Using the right symbol keeps the two ideas clearly separated.</div>

<h2 class="lesson-title">3. The Arithmetic Mean</h2>

<div class="calc-highlight"><strong>The arithmetic mean is the everyday "average".</strong> Add up all the values, divide by how many there are. It balances the dataset like the centre of mass of a seesaw: if you placed equal weights at every data point on a number line, the mean is the single point where the seesaw would balance.</div>

<div class="calc-formula"><div class="formula-label">ARITHMETIC MEAN — SAMPLE</div><div class="formula-main">$$\\bar{x} \\;=\\; \\frac{x_1 + x_2 + \\cdots + x_n}{n} \\;=\\; \\frac{1}{n}\\sum_{i=1}^{n} x_i$$</div><div class="formula-sub">x&#772; is the sample mean, n is the sample size, &Sigma; is the summation symbol meaning "add up all the terms".</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body">Compute the mean of the dataset $\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$ (seven test scores).<br><br>Sum: $2 + 3 + 5 + 7 + 8 + 11 + 13 = 49$.<br>Count: $n = 7$.<br>Mean: $\\bar{x} = 49 / 7 = \\mathbf{7}$.<br><br>So the average score is 7. This sits right in the middle of the list — no surprise, because the data is roughly symmetric.</div></div>

<p class="l-text"><strong>The fatal weakness of the mean: outliers.</strong> An outlier is a single value far from the rest. Because the mean adds every value, one extreme number can pull it far away from where most of the data actually lies. The mean is <em>not robust</em>.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — OUTLIER</div><div class="example-body">Five friends report their monthly income (in thousand TL): $\\{15,\\, 18,\\, 20,\\, 22,\\, 25\\}$. Their mean is $(15+18+20+22+25)/5 = 100/5 = \\mathbf{20}$ thousand TL — a sensible summary.<br><br>Now a sixth friend joins, an unusually successful entrepreneur earning 200 thousand TL: dataset becomes $\\{15,\\, 18,\\, 20,\\, 22,\\, 25,\\, 200\\}$. New mean: $(100+200)/6 = 300/6 = \\mathbf{50}$ thousand TL.<br><br>The "average income" jumped from 20 to 50 because of a single person — yet five of the six friends still earn far less than 50. Quoting "the average is 50" is technically correct but deeply misleading. The mean has been hijacked by one outlier.</div></div>

<h2 class="lesson-title">4. The Median</h2>

<div class="calc-highlight"><strong>The median is the middle value once the data is sorted.</strong> Half the dataset is below it, half is above. It is far more robust to outliers than the mean: a single extreme value can shift the median by at most one position, while it can drag the mean arbitrarily far.</div>

<p class="l-text"><strong>The recipe.</strong> Sort the data in increasing order. If the sample size n is odd, the median is the single middle value (position $(n+1)/2$). If n is even, the median is the average of the two middle values (positions $n/2$ and $n/2 + 1$).</p>

<div class="calc-formula"><div class="formula-label">MEDIAN</div><div class="formula-main">$$\\text{median} \\;=\\; \\begin{cases} x_{(n+1)/2} & \\text{if } n \\text{ odd} \\\\[0.2em] \\dfrac{x_{n/2} + x_{n/2+1}}{2} & \\text{if } n \\text{ even} \\end{cases}$$</div><div class="formula-sub">where the data is sorted: $x_1 \\leq x_2 \\leq \\cdots \\leq x_n$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ODD n</div><div class="example-body">Median of $\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$.<br><br>Already sorted. $n = 7$ is odd. Middle position: $(7+1)/2 = 4$. Fourth value: <strong>7</strong>.<br><br>Median = 7. Notice that the mean was also 7 — this is typical for symmetric data.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — EVEN n</div><div class="example-body">Median of $\\{4,\\, 6,\\, 9,\\, 12,\\, 15,\\, 21\\}$.<br><br>$n = 6$ is even. Middle positions: 3 and 4. Values there: 9 and 12. Average: $(9 + 12)/2 = 10.5$.<br><br>Median = <strong>10.5</strong>.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — OUTLIER REVISITED</div><div class="example-body">Recall the six-friend income dataset $\\{15,\\, 18,\\, 20,\\, 22,\\, 25,\\, 200\\}$. The mean was 50, badly distorted.<br><br>Sorted (it already is). $n = 6$, middle positions 3 and 4, values 20 and 22. Median = $(20+22)/2 = \\mathbf{21}$.<br><br>That is much more representative: five of the six friends earn between 15 and 25 thousand, and the median sits squarely inside that range. <strong>The median ignored the outlier.</strong></div></div>

<div class="l-note"><strong>Forgetting to sort is the number-one student error.</strong> If you take the "middle position" of the original list without sorting first, you get a meaningless number. Always sort first, then count to the middle.</div>

<h2 class="lesson-title">5. The Mode</h2>

<div class="calc-highlight"><strong>The mode is the value that appears most frequently.</strong> Unlike the mean and median it does not require the data to be numerical at all — you can take the mode of colours, brand names, or letter grades. A dataset can have one mode (unimodal), two modes (bimodal), three or more (multimodal), or even no mode at all if every value occurs the same number of times.</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TEST GRADES</div><div class="example-body">Letter grades for ten students on a quiz: $\\{A,\\, A,\\, B,\\, C,\\, D,\\, A,\\, B,\\, C,\\, A,\\, B\\}$.<br><br>Count each: A appears 4 times, B appears 3 times, C appears 2 times, D appears 1 time.<br><br>Mode = <strong>A</strong>. The grade you would most often hear if you asked a random student.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — NO MODE</div><div class="example-body">$\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$ — the first dataset of this lesson.<br><br>Every value occurs exactly once. <strong>No mode exists</strong> (or, equivalently, every value is a mode — both conventions are used).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — BIMODAL</div><div class="example-body">Daily shoe sizes sold in a small shop on Saturday: $\\{38,\\, 39,\\, 40,\\, 40,\\, 41,\\, 42,\\, 42,\\, 43,\\, 44\\}$.<br><br>40 appears twice; 42 appears twice; all others appear once. Two modes: <strong>40 and 42</strong>. The distribution is <em>bimodal</em>.</div></div>

<div class="l-note"><strong>Mode and continuous data.</strong> If your data is continuous (heights, weights, exact reaction times), the chance that any two measurements are <em>exactly</em> equal is essentially zero, so the literal mode is not useful. In that case statisticians use the peak of a histogram or smoothed density curve as an approximate mode. For a high-school course, treat the mode as a tool for <em>discrete</em> or <em>categorical</em> data.</div>

<h2 class="lesson-title">6. The Weighted Mean</h2>

<div class="calc-highlight"><strong>Sometimes some data points matter more than others.</strong> Weighted-mean problems arise whenever values come with explicit importance weights: a 4-credit course matters twice as much as a 2-credit course in your GPA; a price-weighted index gives bigger stocks more pull. The weighted mean generalises x&#772; by attaching a weight $w_i$ to each value $x_i$.</div>

<div class="calc-formula"><div class="formula-label">WEIGHTED MEAN</div><div class="formula-main">$$\\bar{x}_w \\;=\\; \\frac{w_1 x_1 + w_2 x_2 + \\cdots + w_n x_n}{w_1 + w_2 + \\cdots + w_n} \\;=\\; \\frac{\\sum w_i x_i}{\\sum w_i}$$</div><div class="formula-sub">When all weights are equal ($w_i = 1$), this reduces to the ordinary arithmetic mean. The denominator is the total weight, not n.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — GPA</div><div class="example-body">A student takes four courses one semester with these grades and credit weights:<br><br>&bull; Math, 4 credits, grade 90<br>&bull; Physics, 4 credits, grade 80<br>&bull; History, 3 credits, grade 70<br>&bull; Music, 1 credit, grade 100<br><br>Naive arithmetic mean: $(90+80+70+100)/4 = 340/4 = 85$.<br><br>Weighted mean (the correct GPA): $\\dfrac{4 \\cdot 90 + 4 \\cdot 80 + 3 \\cdot 70 + 1 \\cdot 100}{4+4+3+1} = \\dfrac{360 + 320 + 210 + 100}{12} = \\dfrac{990}{12} = \\mathbf{82.5}$.<br><br>Notice the weighted answer (82.5) is lower than the naive average (85) because the high music grade carries only 1/12 of the total weight, while the lower history grade carries 3/12.</div></div>

<h2 class="lesson-title">7. The Geometric Mean</h2>

<div class="calc-highlight"><strong>For ratios, growth rates, or anything multiplicative, the arithmetic mean is the wrong tool.</strong> The geometric mean multiplies the values together and takes the n-th root. It is the right average for compound interest, population growth, return on investment, and any quantity that grows or shrinks by percentages.</div>

<div class="calc-formula"><div class="formula-label">GEOMETRIC MEAN</div><div class="formula-main">$$\\text{GM} \\;=\\; \\sqrt[n]{x_1 \\cdot x_2 \\cdots x_n} \\;=\\; \\left( \\prod_{i=1}^{n} x_i \\right)^{1/n}$$</div><div class="formula-sub">Requires all $x_i > 0$. Always less than or equal to the arithmetic mean (with equality only when all values are identical).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — COMPOUND GROWTH</div><div class="example-body">An investment grows 10% in year 1, 20% in year 2, and 30% in year 3. The growth factors are 1.10, 1.20, 1.30. What is the average annual growth?<br><br>Arithmetic mean of growth rates: $(0.10 + 0.20 + 0.30)/3 = 0.20 = 20\\%$. <em>Wrong</em> — let us check what 20% per year would give after three years: $1.20^3 = 1.728$.<br><br>Actual three-year growth: $1.10 \\times 1.20 \\times 1.30 = 1.716$.<br><br>Geometric mean: $\\sqrt[3]{1.716} \\approx 1.1972$, i.e. about $\\mathbf{19.72\\%}$ per year on average.<br><br>Verify: $1.1972^3 \\approx 1.716$. The geometric mean is the only one that compounds correctly.</div></div>

<h2 class="lesson-title">8. The Harmonic Mean</h2>

<div class="calc-highlight"><strong>For rates such as speeds, the harmonic mean is what you want.</strong> It is the reciprocal of the average of the reciprocals. The classic textbook example: if you drive to a destination at 60 km/h and back at 40 km/h, your average speed is <em>not</em> 50 km/h.</div>

<div class="calc-formula"><div class="formula-label">HARMONIC MEAN</div><div class="formula-main">$$\\text{HM} \\;=\\; \\frac{n}{\\dfrac{1}{x_1} + \\dfrac{1}{x_2} + \\cdots + \\dfrac{1}{x_n}}$$</div><div class="formula-sub">Always less than or equal to the geometric mean, which is less than or equal to the arithmetic mean: $\\text{HM} \\leq \\text{GM} \\leq \\text{AM}$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — AVERAGE SPEED</div><div class="example-body">Same distance covered twice, once at 60 km/h and once at 40 km/h. Average speed?<br><br>Harmonic mean: $\\dfrac{2}{1/60 + 1/40} = \\dfrac{2}{(2 + 3)/120} = \\dfrac{2 \\cdot 120}{5} = \\mathbf{48}$ km/h.<br><br>Check: suppose the one-way distance is 120 km. Time for the outbound trip: $120/60 = 2$ h. Return: $120/40 = 3$ h. Total time 5 h; total distance 240 km; average speed $240/5 = 48$ km/h. Matches.</div></div>

<h2 class="lesson-title">9. When to Use Which</h2>

<div class="calc-highlight"><strong>The choice depends on the shape of your data and the question you want to answer.</strong> Three rules of thumb cover the vast majority of cases.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SYMMETRIC DATA</div><div class="compare-item">Mean &asymp; median &asymp; mode</div><div class="compare-item">Either mean or median works</div><div class="compare-item">Mean is usually preferred (uses all values)</div><div class="compare-item">Example: heights in a class</div></div><div class="compare-col"><div class="compare-title">SKEWED DATA</div><div class="compare-item">Mean is pulled toward the tail; median is robust</div><div class="compare-item">Use median for a typical-value summary</div><div class="compare-item">Quote mean only with the warning that outliers inflate it</div><div class="compare-item">Example: incomes, house prices, reaction times</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Categorical data</div><div class="card-body">Use the <strong>mode</strong>. Mean and median are not defined when the values are labels (favourite colour, brand, blood type).</div></div>
<div class="calc-card"><div class="card-title">Numeric symmetric</div><div class="card-body">Use the <strong>mean</strong>. It uses every value and has the cleanest mathematical properties.</div></div>
<div class="calc-card"><div class="card-title">Numeric skewed / outliers</div><div class="card-body">Use the <strong>median</strong>. It survives outliers unchanged. Quote the mean as well if you want, but never alone.</div></div>
</div>

<h2 class="lesson-title">10. Skewness: The Shape of a Distribution</h2>

<div class="calc-highlight"><strong>Skewness measures how asymmetric a distribution is.</strong> A symmetric distribution has equal tails on either side of the centre. A <em>right-skewed</em> (or positively skewed) distribution has a long tail on the right — a few very large values pulling the mean upward. A <em>left-skewed</em> (or negatively skewed) distribution mirrors this, with a long tail on the left.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Shape</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Tail</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ordering</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Example</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Symmetric</strong></td><td style="padding:0.5rem 0.8rem">Equal on both sides</td><td style="padding:0.5rem 0.8rem">mean &asymp; median &asymp; mode</td><td style="padding:0.5rem 0.8rem">Heights of adults</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Right-skewed</strong></td><td style="padding:0.5rem 0.8rem">Long on the right</td><td style="padding:0.5rem 0.8rem">mode &lt; median &lt; mean</td><td style="padding:0.5rem 0.8rem">Incomes, house prices</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Left-skewed</strong></td><td style="padding:0.5rem 0.8rem">Long on the left</td><td style="padding:0.5rem 0.8rem">mean &lt; median &lt; mode</td><td style="padding:0.5rem 0.8rem">Age at retirement, exam scores when most students do well</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>The ordering rule is worth memorising.</strong> In a right-skewed distribution the mean is dragged to the right by the long tail, so the mean is the largest of the three. In a left-skewed distribution the mean is dragged to the left, so the mean is the smallest. The median always sits between the mode and the mean — closer to the data's centre of mass than to the extremes.</p>

<h2 class="lesson-title">11. Visualising the Three Measures</h2>

<p class="l-text">Pictures make the relationship between the three measures vivid. Below is a histogram of a symmetric dataset with all three measures coinciding, followed by a right-skewed dataset where mean, median, and mode separate.</p>

<div class="calc-graph"><div id="plot-l102-hist-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> two histograms side by side. Left: a symmetric (bell-shaped) distribution where mean, median, and mode all coincide at the centre. Right: a right-skewed distribution where mean &gt; median &gt; mode, the mean dragged toward the long right tail.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var symData=[];var symBins=[1,2,3,4,5,6,7,8,9,10,11];var symCounts=[2,5,9,14,18,20,18,14,9,5,2];
for(var i=0;i<symBins.length;i++){for(var j=0;j<symCounts[i];j++){symData.push(symBins[i]);}}
var skData=[];var skBins=[1,2,3,4,5,6,7,8,9,10,11,12,13,14];var skCounts=[24,22,18,14,10,7,5,3,2,1,1,1,1,1];
for(var i=0;i<skBins.length;i++){for(var j=0;j<skCounts[i];j++){skData.push(skBins[i]);}}
var hSym={x:symData,type:'histogram',name:'symmetric',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},xbins:{start:0.5,end:11.5,size:1},opacity:0.9,xaxis:'x',yaxis:'y'};
var hSk={x:skData,type:'histogram',name:'right-skewed',marker:{color:'#f59e0b',line:{color:'#b45309',width:1}},xbins:{start:0.5,end:14.5,size:1},opacity:0.9,xaxis:'x2',yaxis:'y2'};
var symMean=6;var symMed=6;var symMode=6;
var skSum=0;for(var k=0;k<skData.length;k++){skSum+=skData[k];}
var skMean=skSum/skData.length;var skSorted=skData.slice().sort(function(a,b){return a-b;});var skMed=skSorted[Math.floor(skSorted.length/2)];var skMode=1;
var meanLineSym={x:[symMean,symMean],y:[0,22],mode:'lines',line:{color:'#ef4444',width:3,dash:'solid'},name:'mean = '+symMean.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var medLineSym={x:[symMed,symMed],y:[0,22],mode:'lines',line:{color:'#10b981',width:3,dash:'dash'},name:'median = '+symMed.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var modeLineSym={x:[symMode,symMode],y:[0,22],mode:'lines',line:{color:'#a855f7',width:3,dash:'dot'},name:'mode = '+symMode.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var meanLineSk={x:[skMean,skMean],y:[0,28],mode:'lines',line:{color:'#ef4444',width:3,dash:'solid'},name:'mean = '+skMean.toFixed(2),xaxis:'x2',yaxis:'y2',showlegend:true};
var medLineSk={x:[skMed,skMed],y:[0,28],mode:'lines',line:{color:'#10b981',width:3,dash:'dash'},name:'median = '+skMed.toFixed(1),xaxis:'x2',yaxis:'y2',showlegend:true};
var modeLineSk={x:[skMode,skMode],y:[0,28],mode:'lines',line:{color:'#a855f7',width:3,dash:'dot'},name:'mode = '+skMode.toFixed(1),xaxis:'x2',yaxis:'y2',showlegend:true};
var layH={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'value (symmetric data)',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'frequency',domain:[0,1],gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'value (right-skewed data)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{title:'frequency',domain:[0,1],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}},barmode:'overlay'};
Plotly.newPlot('plot-l102-hist-en',[hSym,hSk,meanLineSym,medLineSym,modeLineSym,meanLineSk,medLineSk,modeLineSk],layH,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l102-bar-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the three measures (mean, median, mode) of a single right-skewed dataset displayed as a bar chart. The mean is the largest, the mode the smallest. The gap between them is a direct visual estimate of the skewness.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['Mean','Median','Mode'];var vals=[4.17,3,1];
var tBar={x:labels,y:vals,type:'bar',marker:{color:['#ef4444','#10b981','#a855f7'],line:{color:'rgba(255,255,255,0.2)',width:1}},text:vals.map(function(v){return v.toFixed(2);}),textposition:'auto'};
var layB={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'measure',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'value',range:[0,5],gridcolor:'rgba(255,255,255,0.06)'},margin:{t:40,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l102-bar-en',[tBar],layB,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l102-skew-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a smooth right-skewed distribution with the three measures marked. Mode is at the peak, median splits the area in half, mean is pulled toward the heavy right tail. The ordering mode &lt; median &lt; mean is characteristic of right-skewness.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=i*0.1;xs.push(x);var k=2.0;var th=1.5;var pdf=Math.pow(x,k-1)*Math.exp(-x/th)/(Math.pow(th,k)*1.0);if(!isFinite(pdf))pdf=0;ys.push(pdf);}
var curve={x:xs,y:ys,mode:'lines',name:'density',line:{color:'#3b82f6',width:2.5},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.15)'};
var modeX=1.5;var medX=2.51;var meanX=3.0;
var maxY=Math.max.apply(null,ys);
var modeL={x:[modeX,modeX],y:[0,maxY*0.95],mode:'lines+text',line:{color:'#a855f7',width:3,dash:'dot'},name:'mode',text:['','mode'],textposition:'top center',textfont:{color:'#a855f7'}};
var medL={x:[medX,medX],y:[0,maxY*0.80],mode:'lines+text',line:{color:'#10b981',width:3,dash:'dash'},name:'median',text:['','median'],textposition:'top center',textfont:{color:'#10b981'}};
var meanL={x:[meanX,meanX],y:[0,maxY*0.65],mode:'lines+text',line:{color:'#ef4444',width:3},name:'mean',text:['','mean'],textposition:'top center',textfont:{color:'#ef4444'}};
var layS={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'value',gridcolor:'rgba(255,255,255,0.06)',range:[0,15]},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:40,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l102-skew-en',[curve,modeL,medL,meanL],layS,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting to sort</div><div class="card-body">The median requires sorted data. Reading off the middle value of an unsorted list is a meaningless number. Always sort first.</div></div>
<div class="calc-card"><div class="card-title">Confusing mean and median</div><div class="card-body">"The average house price in London is &pound;700,000" — is that mean or median? They differ by 100,000s for skewed data. Always state which you mean.</div></div>
<div class="calc-card"><div class="card-title">Mode of continuous data</div><div class="card-body">Heights measured to 0.1 cm rarely repeat exactly. Saying "the mode is 168.3" because one student happened to have that value is misleading. Use a histogram peak instead.</div></div>
<div class="calc-card"><div class="card-title">Misusing the arithmetic mean for rates</div><div class="card-body">Average speed, compound growth, and ratios need harmonic or geometric mean. The naive arithmetic answer is wrong, sometimes by a lot.</div></div>
<div class="calc-card"><div class="card-title">Ignoring outliers</div><div class="card-body">Always sanity-check: plot the data, look for extreme values. If they are real, the median is honest. If they are typos, fix them before computing anything.</div></div>
<div class="calc-card"><div class="card-title">Wrong weight denominator</div><div class="card-body">In a weighted mean, divide by the sum of weights, not by n. With unequal weights these differ, and dividing by n gives a wrong answer.</div></div>
</div>

<h2 class="lesson-title">13. Worked Practice Problems</h2>

<p class="l-text">Eight problems consolidating the lesson. Do each yourself first, then read the worked solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — MEAN AND MEDIAN OF SAME DATA</div><div class="example-body"><strong>Find the mean and median of $\\{4,\\, 7,\\, 9,\\, 11,\\, 14\\}$.</strong><br><br>Mean: $(4+7+9+11+14)/5 = 45/5 = \\mathbf{9}$.<br>Median: data sorted, $n=5$ odd, middle position 3, value $\\mathbf{9}$.<br><br>They agree — typical for symmetric data.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — OUTLIER EFFECT</div><div class="example-body"><strong>Salary data (thousand TL): $\\{30, 32, 35, 35, 40, 42, 250\\}$. Which is more representative, mean or median?</strong><br><br>Mean: $(30+32+35+35+40+42+250)/7 = 464/7 \\approx 66.3$.<br>Median: sorted, $n=7$ odd, middle is the 4th value = $\\mathbf{35}$.<br><br>Six of seven employees earn 42 or less. The median (35) is far more representative. The mean (66) is hijacked by one extreme value.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — MODE</div><div class="example-body"><strong>Mode of $\\{5, 7, 7, 9, 9, 9, 11, 13\\}$.</strong><br><br>Counts: 5(1), 7(2), 9(3), 11(1), 13(1). Maximum count is 3, for the value 9.<br><br>Mode = <strong>9</strong>. The dataset is unimodal.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — WEIGHTED MEAN (GPA)</div><div class="example-body"><strong>A student's three courses: Math (4 cr, 85), Chemistry (3 cr, 70), Literature (2 cr, 95). What is the weighted GPA?</strong><br><br>Weighted mean: $\\dfrac{4 \\cdot 85 + 3 \\cdot 70 + 2 \\cdot 95}{4+3+2} = \\dfrac{340 + 210 + 190}{9} = \\dfrac{740}{9} \\approx \\mathbf{82.2}$.<br><br>Notice this is closer to 85 than to 70 — Math's higher weight pulls the GPA upward.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — EVEN n MEDIAN</div><div class="example-body"><strong>Median of $\\{3, 6, 8, 10, 14, 17, 20, 25\\}$.</strong><br><br>Already sorted. $n = 8$ is even. Middle positions: 4 and 5. Values: 10 and 14. Median = $(10 + 14)/2 = \\mathbf{12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — GEOMETRIC MEAN</div><div class="example-body"><strong>A stock returns 5%, 10%, and &minus;3% in three consecutive years. What is the average annual return?</strong><br><br>Growth factors: 1.05, 1.10, 0.97.<br>Product: $1.05 \\cdot 1.10 \\cdot 0.97 = 1.12035$.<br>Cube root: $\\sqrt[3]{1.12035} \\approx 1.0386$.<br><br>Average annual return &approx; <strong>3.86%</strong>. The arithmetic mean of the rates would give $(5+10-3)/3 = 4\\%$ — close but wrong.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — HARMONIC MEAN (SPEED)</div><div class="example-body"><strong>Drive 100 km at 80 km/h, then 100 km at 50 km/h. Average speed?</strong><br><br>Harmonic mean of $\\{80, 50\\}$: $\\dfrac{2}{1/80 + 1/50} = \\dfrac{2}{(5 + 8)/400} = \\dfrac{800}{13} \\approx \\mathbf{61.5}$ km/h.<br><br>Check: time for first leg $100/80 = 1.25$ h; second leg $100/50 = 2$ h; total 3.25 h for 200 km gives $200/3.25 \\approx 61.5$ km/h. Confirmed.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — DECIDE WHICH MEASURE</div><div class="example-body"><strong>For each scenario, pick mean, median, or mode and justify briefly.</strong><br><br>(a) Daily temperatures in October in Ankara &rarr; <strong>mean</strong> (roughly symmetric, no outliers).<br>(b) House prices in Istanbul &rarr; <strong>median</strong> (right-skewed by a few luxury properties).<br>(c) Most popular ice-cream flavour &rarr; <strong>mode</strong> (categorical data, mean is meaningless).<br>(d) Final exam grades, where most students did well &rarr; <strong>median</strong> (likely left-skewed).<br>(e) Reaction times of athletes &rarr; <strong>median</strong> (right-skewed by occasional slow trials).</div></div>

<h2 class="lesson-title">14. Looking Ahead</h2>

<p class="l-text">Mean, median, and mode tell you where the centre of a dataset is. They say nothing about how spread out the data is around that centre — two classes with the same mean grade of 75 can look completely different if one has scores tightly clustered around 75 and the other has scores ranging from 30 to 100. The next lesson introduces <em>measures of dispersion</em>: range, variance, and standard deviation — the second half of the descriptive-statistics toolkit. Together with the three measures of centre, they give a complete one-paragraph summary of any dataset.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Descriptive statistics summarises data you have; inferential statistics extrapolates to a population</li>
<li>Population parameters use Greek letters (&mu;, &sigma;); sample statistics use Latin letters (x&#772;, s)</li>
<li>Arithmetic mean: sum divided by count, sensitive to outliers</li>
<li>Median: middle value of sorted data, robust to outliers, ideal for skewed distributions</li>
<li>Mode: most frequent value, only sensible measure for categorical data</li>
<li>Weighted mean: each value times its weight, divided by the sum of weights — used for GPAs</li>
<li>Geometric mean: for growth rates and compounded returns; harmonic mean for averaging rates such as speeds</li>
<li>Skewness ordering: right-skewed has mode &lt; median &lt; mean; left-skewed has mean &lt; median &lt; mode</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İstatistik aldatıcı biçimde küçük bir soruyla başlar:</strong> sana bir sayı listesi verilirse — sınav notları, maaşlar, günlük yağış miktarı, kalp atışları — bunu en iyi <em>özetleyen</em> tek sayı nedir? Birisi "sınıf sınavda nasıldı?" ya da "İstanbul'da yazılım mühendisi ne kadar kazanıyor?" diye her sorduğunda bütün listeyi tek tek söyleyemezsin. Verinin özünü yakalayan tek bir sayıya ihtiyacın var. Kötü haber: tek bir "en iyi" cevap yok. İyi haber: üç klasik aday var — <em>ortalama (aritmetik)</em>, <em>medyan</em> ve <em>mod</em> — ve her biri farklı bir durumda işe yarar.</p>

<p class="l-text">Bu derste bu üç sayının ne anlama geldiğini, elle nasıl hesaplandığını, hangisinin ne zaman tercih edileceğini ve öğrencilerin en sık yaptığı hataları öğreneceksin. Ayrıca aritmetik ortalamanın iki uzman kuzeniyle de tanışacağız: not ortalaması ve fiyat hesaplarında karşına çıkan <em>ağırlıklı ortalama</em>, büyüme oranlarında karşına çıkan <em>geometrik ortalama</em>. Ders sonunda küçük bir veri setine bakıp doğru özet istatistiği bir saniye bile düşünmeden seçebilmelisin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Betimsel istatistiği (elindeki veriyi özetleme) çıkarımsal istatistikten (daha büyük bir kitle hakkında sonuç çıkarma) ayırt etmeyi</li>
<li><em>Anakütle parametresi</em>ni (Yunan harfi, örneğin &mu;) <em>örneklem istatistiği</em>nden (Latin harfi, örneğin x&#772;) ayırt etmeyi</li>
<li>Aritmetik ortalama, medyan ve modu küçük veri setlerinde elle hesaplamayı</li>
<li>Bir uç değerin ortalamayı yanıltıcı yaptığını ve medyanın daha dürüst olduğunu fark etmeyi</li>
<li>Not ortalaması için ağırlıklı ortalamayı, bileşik büyüme için geometrik ortalamayı kullanmayı</li>
<li>Bir histogramı okuyup dağılımın simetrik, sağa çarpık ya da sola çarpık olduğunu söylemeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Betimsel ve Çıkarımsal İstatistik</h2>

<div class="calc-highlight"><strong>İstatistik, veriyi özetleme bilimidir.</strong> İki türü vardır. <em>Betimsel istatistik</em> bir sayı listesini alır ve birkaç özet değere sıkıştırır: bir merkez, bir yayılım, bir şekil. <em>Çıkarımsal istatistik</em> bir adım daha gider — küçük bir örneklem verildiğinde, örneklemin geldiği çok daha büyük anakütlenin özelliklerini tahmin eder. Bu ders tamamen betimsel: önümüzdekini özetleyeceğiz, fazlası değil.</div>

<p class="l-text">Basit bir örnek: sınıfındaki her öğrencinin boyunu kaydediyorsun. Sınıf <em>anakütledir</em>. Yazdığın boy listesi o anakütlenin <em>tam verisidir</em>. Betimsel istatistik soruyor: <em>ortalama boy ne kadardı?</em> Çıkarımsal istatistik daha zor olanı soruyor: <em>sınıf ortalamamı bilince, Türkiye'deki tüm 17 yaşındakilerin ortalama boyu hakkında ne diyebilirim?</em> Birincisi yalnızca elindeki sayıları kullanır; ikincisi onların ötesine geçer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Betimsel</div><div class="card-body">Zaten toplanmış veriyi özetler. Ötesinde iddia yoktur. Araçlar: ortalama, medyan, mod, standart sapma, histogram, kutu grafiği.</div></div>
<div class="calc-card"><div class="card-title">Çıkarımsal</div><div class="card-body">Tamamen ölçmediğin bir anakütle hakkında bir şey tahmin etmek için örneklem kullanır. Araçlar: güven aralıkları, hipotez testleri, regresyon.</div></div>
<div class="calc-card"><div class="card-title">Bizim konumumuz</div><div class="card-body">Tamamen betimsel. Hesapladığımız sayılar baktığımız veri setini özetler; henüz daha büyük bir şey hakkında sonuç çıkarmıyoruz.</div></div>
</div>

<h2 class="lesson-title">2. Anakütle ve Örneklem: Parametreler ve İstatistikler</h2>

<div class="calc-highlight"><strong>Anakütle ilgilendiğin tüm grup; örneklem ise gerçekten ölçtüğün alt kümedir.</strong> İstatistikçiler bunları titizlikle ayırır, çünkü tüm anakütleden hesaplanan bir sayı <em>parametre</em>dir, aynı sayı bir örneklemden hesaplandığında ise <em>istatistik</em>tir. Farklı isimler <em>ve</em> farklı semboller alırlar.</div>

<p class="l-text">Sözleşme evrenseldir: parametreler <strong>Yunan harfleri</strong>, istatistikler ise <strong>Latin harfleri</strong> kullanır. Tüm anakütlenin ortalaması &mu; (Yunan mu) ile yazılır; o anakütleden çekilmiş bir örneklemin ortalaması x&#772; (Latin x-bar) ile gösterilir. Anakütlenin standart sapması &sigma; (Yunan sigma); örneklemin standart sapması s (Latin s) ile gösterilir. Bunları karıştırmak sınavda puan kaybetmenin en kolay yollarından biridir.</p>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Büyüklük</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Anakütle (parametre)</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örneklem (istatistik)</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Büyüklük</td><td style="padding:0.5rem 0.8rem">N (büyük)</td><td style="padding:0.5rem 0.8rem">n (küçük)</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Ortalama</td><td style="padding:0.5rem 0.8rem">&mu;</td><td style="padding:0.5rem 0.8rem">x&#772;</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">Standart sapma</td><td style="padding:0.5rem 0.8rem">&sigma;</td><td style="padding:0.5rem 0.8rem">s</td></tr>
<tr><td style="padding:0.5rem 0.8rem">Oran</td><td style="padding:0.5rem 0.8rem">p</td><td style="padding:0.5rem 0.8rem">p&#770;</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Neden iki gösterim?</strong> Çünkü örneklem ortalaması x&#772; aslında bir <em>rasgele sayıdır</em> — farklı örneklemler farklı x&#772; değerleri verir — oysa anakütle ortalaması &mu; <em>sabit ama bilinmeyen</em> bir sayıdır. Çıkarımsal istatistik özünde birini (x&#772;) kullanarak diğerini (&mu;) tahmin etme sanatıdır. Doğru sembolü kullanmak iki fikri net biçimde ayrı tutar.</div>

<h2 class="lesson-title">3. Aritmetik Ortalama</h2>

<div class="calc-highlight"><strong>Aritmetik ortalama, günlük dildeki "ortalama"dır.</strong> Tüm değerleri topla, kaç tane olduğuna böl. Veri setini bir tahterevallinin ağırlık merkezi gibi dengeler: sayı doğrusunda her veri noktasına eşit ağırlıklar koysan, ortalama tahterevallinin denge kuracağı tek noktadır.</div>

<div class="calc-formula"><div class="formula-label">ARİTMETİK ORTALAMA — ÖRNEKLEM</div><div class="formula-main">$$\\bar{x} \\;=\\; \\frac{x_1 + x_2 + \\cdots + x_n}{n} \\;=\\; \\frac{1}{n}\\sum_{i=1}^{n} x_i$$</div><div class="formula-sub">x&#772; örneklem ortalamasıdır, n örneklem büyüklüğüdür, &Sigma; "tüm terimleri topla" anlamına gelen toplam sembolüdür.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK</div><div class="example-body">$\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$ veri setinin (yedi sınav notu) ortalamasını hesapla.<br><br>Toplam: $2 + 3 + 5 + 7 + 8 + 11 + 13 = 49$.<br>Eleman sayısı: $n = 7$.<br>Ortalama: $\\bar{x} = 49 / 7 = \\mathbf{7}$.<br><br>Yani ortalama not 7. Listenin tam ortasında yer alıyor — şaşırtıcı değil, çünkü veri yaklaşık olarak simetrik.</div></div>

<p class="l-text"><strong>Ortalamanın ölümcül zayıflığı: uç değerler.</strong> Bir uç değer (outlier), geri kalandan çok uzak tek bir değerdir. Ortalama her değeri topladığı için, tek bir aşırı sayı onu verinin gerçek bulunduğu yerden çok uzağa çekebilir. Ortalama <em>dayanıklı değildir</em>.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — UÇ DEĞER</div><div class="example-body">Beş arkadaş aylık gelirlerini (bin TL) bildiriyor: $\\{15,\\, 18,\\, 20,\\, 22,\\, 25\\}$. Ortalamaları $(15+18+20+22+25)/5 = 100/5 = \\mathbf{20}$ bin TL — mantıklı bir özet.<br><br>Şimdi altıncı arkadaş katılıyor; alışılmadık biçimde başarılı bir girişimci, 200 bin TL kazanıyor: veri seti $\\{15,\\, 18,\\, 20,\\, 22,\\, 25,\\, 200\\}$ oluyor. Yeni ortalama: $(100+200)/6 = 300/6 = \\mathbf{50}$ bin TL.<br><br>"Ortalama gelir" tek bir kişi yüzünden 20'den 50'ye fırladı — oysa altı arkadaşın beşi hâlâ 50'den çok daha az kazanıyor. "Ortalama 50" demek teknik olarak doğru ama son derece yanıltıcı. Ortalama, tek bir uç değer tarafından ele geçirildi.</div></div>

<h2 class="lesson-title">4. Medyan</h2>

<div class="calc-highlight"><strong>Medyan, veri sıralandıktan sonraki ortadaki değerdir.</strong> Veri setinin yarısı altında, yarısı üstündedir. Uç değerlere ortalamadan çok daha dayanıklıdır: tek bir aşırı değer medyanı en fazla bir konum kaydırabilir, oysa aynı uç değer ortalamayı sınırsız uzağa çekebilir.</div>

<p class="l-text"><strong>Tarif.</strong> Veriyi artan sıraya diz. Eğer örneklem büyüklüğü n tek ise, medyan tek olan ortadaki değerdir (konum $(n+1)/2$). Eğer n çift ise, medyan iki ortadaki değerin ortalamasıdır (konumlar $n/2$ ve $n/2 + 1$).</p>

<div class="calc-formula"><div class="formula-label">MEDYAN</div><div class="formula-main">$$\\text{medyan} \\;=\\; \\begin{cases} x_{(n+1)/2} & n \\text{ tek ise} \\\\[0.2em] \\dfrac{x_{n/2} + x_{n/2+1}}{2} & n \\text{ cift ise} \\end{cases}$$</div><div class="formula-sub">veri sirali olmali: $x_1 \\leq x_2 \\leq \\cdots \\leq x_n$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TEK n</div><div class="example-body">$\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$ medyanı.<br><br>Zaten sıralı. $n = 7$ tek. Orta konum: $(7+1)/2 = 4$. Dördüncü değer: <strong>7</strong>.<br><br>Medyan = 7. Ortalama da 7 idi — simetrik veride tipik durum.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ÇİFT n</div><div class="example-body">$\\{4,\\, 6,\\, 9,\\, 12,\\, 15,\\, 21\\}$ medyanı.<br><br>$n = 6$ çift. Orta konumlar: 3 ve 4. Değerler: 9 ve 12. Ortalama: $(9 + 12)/2 = 10.5$.<br><br>Medyan = <strong>10.5</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — UÇ DEĞERE GERİ DÖNÜŞ</div><div class="example-body">Altı arkadaşın gelir veri setini hatırla: $\\{15,\\, 18,\\, 20,\\, 22,\\, 25,\\, 200\\}$. Ortalama 50 idi ve kötü biçimde çarpıtılmıştı.<br><br>Sıralı (zaten öyle). $n = 6$, orta konumlar 3 ve 4, değerler 20 ve 22. Medyan = $(20+22)/2 = \\mathbf{21}$.<br><br>Bu çok daha temsili: altı arkadaşın beşi 15 ile 25 bin arasında kazanıyor ve medyan bu aralığın tam ortasında. <strong>Medyan, uç değeri görmezden geldi.</strong></div></div>

<div class="l-note"><strong>Sıralamayı unutmak öğrencilerin bir numaralı hatasıdır.</strong> Eğer sıralamadan ham listenin "orta konumunu" alırsan anlamsız bir sayı elde edersin. Önce sırala, sonra ortaya kadar say.</div>

<h2 class="lesson-title">5. Mod</h2>

<div class="calc-highlight"><strong>Mod, en sık görünen değerdir.</strong> Ortalamanın ve medyanın aksine verinin sayısal olmasını gerektirmez — renklerin, marka adlarının ya da harf notlarının modunu alabilirsin. Bir veri setinin bir modu (tek modlu), iki modu (iki modlu), üç ya da daha fazla modu (çok modlu) olabilir veya her değer aynı sayıda görünürse mod hiç olmayabilir.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SINAV NOTLARI</div><div class="example-body">On öğrencinin küçük bir sınavdan harf notları: $\\{A,\\, A,\\, B,\\, C,\\, D,\\, A,\\, B,\\, C,\\, A,\\, B\\}$.<br><br>Sayalım: A 4 kez, B 3 kez, C 2 kez, D 1 kez geçer.<br><br>Mod = <strong>A</strong>. Rastgele bir öğrenciye sorsan en sık duyacağın not.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — MOD YOK</div><div class="example-body">$\\{2,\\, 3,\\, 5,\\, 7,\\, 8,\\, 11,\\, 13\\}$ — bu dersin ilk veri seti.<br><br>Her değer tam olarak bir kez görünüyor. <strong>Mod yok</strong> (ya da eşdeğer olarak, her değer bir moddur — her iki sözleşme de kullanılır).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — İKİ MODLU</div><div class="example-body">Bir ayakkabı dükkânında cumartesi günü satılan numaralar: $\\{38,\\, 39,\\, 40,\\, 40,\\, 41,\\, 42,\\, 42,\\, 43,\\, 44\\}$.<br><br>40 iki kez geçer; 42 iki kez geçer; geri kalanı birer kez. İki mod: <strong>40 ve 42</strong>. Dağılım <em>iki modludur</em>.</div></div>

<div class="l-note"><strong>Mod ve sürekli veri.</strong> Eğer veri sürekli ise (boylar, ağırlıklar, kesin tepki süreleri), herhangi iki ölçümün <em>tam olarak</em> eşit olma şansı esasen sıfırdır, dolayısıyla harfi harfine mod kullanışsızdır. O durumda istatistikçiler bir histogramın ya da düzleştirilmiş yoğunluk eğrisinin tepe noktasını yaklaşık mod olarak kullanır. Lise düzeyinde modu <em>kesikli</em> ya da <em>kategorik</em> veri için bir araç olarak düşün.</div>

<h2 class="lesson-title">6. Ağırlıklı Ortalama</h2>

<div class="calc-highlight"><strong>Bazen bazı veri noktaları diğerlerinden daha çok önemlidir.</strong> Ağırlıklı ortalama problemleri, değerlerin açık önem ağırlıklarıyla geldiği her durumda ortaya çıkar: 4 kredilik bir ders not ortalamanda 2 kredilik bir dersin iki katı önem taşır; fiyat ağırlıklı bir endeks büyük hisselere daha fazla ağırlık verir. Ağırlıklı ortalama, her $x_i$ değerine bir $w_i$ ağırlığı iliştirerek x&#772;'yi genelleştirir.</div>

<div class="calc-formula"><div class="formula-label">AĞIRLIKLI ORTALAMA</div><div class="formula-main">$$\\bar{x}_w \\;=\\; \\frac{w_1 x_1 + w_2 x_2 + \\cdots + w_n x_n}{w_1 + w_2 + \\cdots + w_n} \\;=\\; \\frac{\\sum w_i x_i}{\\sum w_i}$$</div><div class="formula-sub">Tüm ağırlıklar eşit olduğunda ($w_i = 1$), bu sıradan aritmetik ortalamaya indirgenir. Payda toplam ağırlıktır, n değildir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — GANO</div><div class="example-body">Bir öğrenci bir dönem dört ders alıyor; notları ve kredi ağırlıkları şöyle:<br><br>&bull; Matematik, 4 kredi, not 90<br>&bull; Fizik, 4 kredi, not 80<br>&bull; Tarih, 3 kredi, not 70<br>&bull; Müzik, 1 kredi, not 100<br><br>Yanlış aritmetik ortalama: $(90+80+70+100)/4 = 340/4 = 85$.<br><br>Ağırlıklı ortalama (doğru GANO): $\\dfrac{4 \\cdot 90 + 4 \\cdot 80 + 3 \\cdot 70 + 1 \\cdot 100}{4+4+3+1} = \\dfrac{360 + 320 + 210 + 100}{12} = \\dfrac{990}{12} = \\mathbf{82.5}$.<br><br>Dikkat: ağırlıklı cevap (82.5), basit ortalamadan (85) düşüktür çünkü yüksek müzik notu yalnızca toplam ağırlığın 1/12'sini taşır, daha düşük tarih notu ise 3/12'sini taşır.</div></div>

<h2 class="lesson-title">7. Geometrik Ortalama</h2>

<div class="calc-highlight"><strong>Oranlar, büyüme hızları ya da çarpımsal herhangi bir şey için aritmetik ortalama yanlış araçtır.</strong> Geometrik ortalama değerleri çarpar ve n'inci kökünü alır. Bileşik faiz, nüfus artışı, yatırım getirisi ve yüzdelerle büyüyen ya da küçülen herhangi bir nicelik için doğru ortalamadır.</div>

<div class="calc-formula"><div class="formula-label">GEOMETRİK ORTALAMA</div><div class="formula-main">$$\\text{GO} \\;=\\; \\sqrt[n]{x_1 \\cdot x_2 \\cdots x_n} \\;=\\; \\left( \\prod_{i=1}^{n} x_i \\right)^{1/n}$$</div><div class="formula-sub">Tüm $x_i > 0$ olmalı. Her zaman aritmetik ortalamaya eşit ya da ondan küçüktür (eşitlik yalnızca tüm değerler aynı olduğunda).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — BİLEŞİK BÜYÜME</div><div class="example-body">Bir yatırım 1. yıl %10, 2. yıl %20, 3. yıl %30 büyüyor. Büyüme çarpanları 1.10, 1.20, 1.30. Ortalama yıllık büyüme nedir?<br><br>Büyüme oranlarının aritmetik ortalaması: $(0.10 + 0.20 + 0.30)/3 = 0.20 = \\%20$. <em>Yanlış</em> — yılda %20'nin üç yılda ne vereceğine bakalım: $1.20^3 = 1.728$.<br><br>Gerçek üç yıllık büyüme: $1.10 \\times 1.20 \\times 1.30 = 1.716$.<br><br>Geometrik ortalama: $\\sqrt[3]{1.716} \\approx 1.1972$, yani yılda ortalama yaklaşık <strong>%19.72</strong>.<br><br>Doğrula: $1.1972^3 \\approx 1.716$. Doğru biçimde bileşiklenen tek ortalama geometrik ortalamadır.</div></div>

<h2 class="lesson-title">8. Harmonik Ortalama</h2>

<div class="calc-highlight"><strong>Hız gibi oranlar için harmonik ortalama istediğin şeydir.</strong> Tersinin ortalamasının tersidir. Klasik ders kitabı örneği: bir varış noktasına 60 km/sa hızla gidip 40 km/sa hızla dönersen, ortalama hızın 50 km/sa <em>değildir</em>.</div>

<div class="calc-formula"><div class="formula-label">HARMONİK ORTALAMA</div><div class="formula-main">$$\\text{HO} \\;=\\; \\frac{n}{\\dfrac{1}{x_1} + \\dfrac{1}{x_2} + \\cdots + \\dfrac{1}{x_n}}$$</div><div class="formula-sub">Her zaman geometrik ortalamaya eşit ya da ondan küçüktür, o da aritmetik ortalamaya eşit ya da ondan küçüktür: $\\text{HO} \\leq \\text{GO} \\leq \\text{AO}$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — ORTALAMA HIZ</div><div class="example-body">Aynı mesafe iki kez kat edilir: bir kere 60 km/sa hızla, bir kere 40 km/sa hızla. Ortalama hız?<br><br>Harmonik ortalama: $\\dfrac{2}{1/60 + 1/40} = \\dfrac{2}{(2 + 3)/120} = \\dfrac{2 \\cdot 120}{5} = \\mathbf{48}$ km/sa.<br><br>Doğrula: tek yön mesafe 120 km olsun. Gidiş süresi: $120/60 = 2$ sa. Dönüş: $120/40 = 3$ sa. Toplam 5 sa; toplam mesafe 240 km; ortalama hız $240/5 = 48$ km/sa. Eşleşiyor.</div></div>

<h2 class="lesson-title">9. Hangisini Ne Zaman Kullanmalı</h2>

<div class="calc-highlight"><strong>Seçim verinin şekline ve cevaplamak istediğin soruya bağlıdır.</strong> Üç pratik kural durumların büyük çoğunluğunu kapsar.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SİMETRİK VERİ</div><div class="compare-item">Ortalama &asymp; medyan &asymp; mod</div><div class="compare-item">Ortalama ya da medyan, her ikisi de işe yarar</div><div class="compare-item">Genellikle ortalama tercih edilir (tüm değerleri kullanır)</div><div class="compare-item">Örnek: bir sınıftaki boylar</div></div><div class="compare-col"><div class="compare-title">ÇARPIK VERİ</div><div class="compare-item">Ortalama kuyruğa doğru çekilir; medyan dayanıklıdır</div><div class="compare-item">Tipik değer özeti için medyanı kullan</div><div class="compare-item">Ortalamayı sadece "uç değerler şişirir" uyarısıyla aktar</div><div class="compare-item">Örnek: gelirler, ev fiyatları, tepki süreleri</div></div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kategorik veri</div><div class="card-body"><strong>Modu</strong> kullan. Değerler etiket olduğunda (sevilen renk, marka, kan grubu) ortalama ve medyan tanımsızdır.</div></div>
<div class="calc-card"><div class="card-title">Sayısal simetrik</div><div class="card-body"><strong>Ortalamayı</strong> kullan. Her değeri kullanır ve en temiz matematiksel özelliklere sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Sayısal çarpık / uç değerli</div><div class="card-body"><strong>Medyanı</strong> kullan. Uç değerler karşısında değişmez. İstersen ortalamayı da aktar, ama asla yalnız değil.</div></div>
</div>

<h2 class="lesson-title">10. Çarpıklık: Bir Dağılımın Şekli</h2>

<div class="calc-highlight"><strong>Çarpıklık (skewness), bir dağılımın ne kadar asimetrik olduğunu ölçer.</strong> Simetrik dağılımın merkezin iki yanında eşit kuyrukları vardır. <em>Sağa çarpık</em> (ya da pozitif çarpık) dağılımın sağda uzun kuyruğu vardır — birkaç çok büyük değer ortalamayı yukarı çeker. <em>Sola çarpık</em> (ya da negatif çarpık) dağılım bunun aynasıdır; uzun kuyruk soldadır.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Şekil</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Kuyruk</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sıralama</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Örnek</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Simetrik</strong></td><td style="padding:0.5rem 0.8rem">Her iki tarafta eşit</td><td style="padding:0.5rem 0.8rem">ortalama &asymp; medyan &asymp; mod</td><td style="padding:0.5rem 0.8rem">Yetişkin boyları</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Sağa çarpık</strong></td><td style="padding:0.5rem 0.8rem">Sağda uzun</td><td style="padding:0.5rem 0.8rem">mod &lt; medyan &lt; ortalama</td><td style="padding:0.5rem 0.8rem">Gelirler, ev fiyatları</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Sola çarpık</strong></td><td style="padding:0.5rem 0.8rem">Solda uzun</td><td style="padding:0.5rem 0.8rem">ortalama &lt; medyan &lt; mod</td><td style="padding:0.5rem 0.8rem">Emeklilik yaşı, çoğu öğrencinin iyi yaptığı sınav notları</td></tr>
</tbody></table>
</div>

<p class="l-text"><strong>Sıralama kuralını ezberlemeye değer.</strong> Sağa çarpık dağılımda ortalama uzun kuyruk tarafından sağa çekilir, yani üçü arasında en büyüktür. Sola çarpık dağılımda ortalama sola çekilir, yani en küçüktür. Medyan her zaman mod ile ortalama arasında oturur — verinin ağırlık merkezine uç değerlerden daha yakın.</p>

<h2 class="lesson-title">11. Üç Ölçüyü Görselleştirme</h2>

<p class="l-text">Resimler üç ölçü arasındaki ilişkiyi canlı hale getirir. Aşağıda her üç ölçünün üst üste bindiği simetrik bir veri setinin histogramı, ardından ortalama, medyan ve modun birbirinden ayrıldığı sağa çarpık bir veri seti var.</p>

<div class="calc-graph"><div id="plot-l102-hist-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> yan yana iki histogram. Solda: ortalama, medyan ve modun merkezde çakıştığı simetrik (çan şeklinde) dağılım. Sağda: ortalama &gt; medyan &gt; mod olan sağa çarpık dağılım; ortalama uzun sağ kuyruğa doğru çekilmiş.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var symData=[];var symBins=[1,2,3,4,5,6,7,8,9,10,11];var symCounts=[2,5,9,14,18,20,18,14,9,5,2];
for(var i=0;i<symBins.length;i++){for(var j=0;j<symCounts[i];j++){symData.push(symBins[i]);}}
var skData=[];var skBins=[1,2,3,4,5,6,7,8,9,10,11,12,13,14];var skCounts=[24,22,18,14,10,7,5,3,2,1,1,1,1,1];
for(var i=0;i<skBins.length;i++){for(var j=0;j<skCounts[i];j++){skData.push(skBins[i]);}}
var hSymT={x:symData,type:'histogram',name:'simetrik',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},xbins:{start:0.5,end:11.5,size:1},opacity:0.9,xaxis:'x',yaxis:'y'};
var hSkT={x:skData,type:'histogram',name:'sağa çarpık',marker:{color:'#f59e0b',line:{color:'#b45309',width:1}},xbins:{start:0.5,end:14.5,size:1},opacity:0.9,xaxis:'x2',yaxis:'y2'};
var symMean=6;var symMed=6;var symMode=6;
var skSum=0;for(var k=0;k<skData.length;k++){skSum+=skData[k];}
var skMean=skSum/skData.length;var skSortedT=skData.slice().sort(function(a,b){return a-b;});var skMed=skSortedT[Math.floor(skSortedT.length/2)];var skMode=1;
var meanLineSymT={x:[symMean,symMean],y:[0,22],mode:'lines',line:{color:'#ef4444',width:3,dash:'solid'},name:'ortalama = '+symMean.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var medLineSymT={x:[symMed,symMed],y:[0,22],mode:'lines',line:{color:'#10b981',width:3,dash:'dash'},name:'medyan = '+symMed.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var modeLineSymT={x:[symMode,symMode],y:[0,22],mode:'lines',line:{color:'#a855f7',width:3,dash:'dot'},name:'mod = '+symMode.toFixed(1),xaxis:'x',yaxis:'y',showlegend:true};
var meanLineSkT={x:[skMean,skMean],y:[0,28],mode:'lines',line:{color:'#ef4444',width:3,dash:'solid'},name:'ortalama = '+skMean.toFixed(2),xaxis:'x2',yaxis:'y2',showlegend:true};
var medLineSkT={x:[skMed,skMed],y:[0,28],mode:'lines',line:{color:'#10b981',width:3,dash:'dash'},name:'medyan = '+skMed.toFixed(1),xaxis:'x2',yaxis:'y2',showlegend:true};
var modeLineSkT={x:[skMode,skMode],y:[0,28],mode:'lines',line:{color:'#a855f7',width:3,dash:'dot'},name:'mod = '+skMode.toFixed(1),xaxis:'x2',yaxis:'y2',showlegend:true};
var layHT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'değer (simetrik veri)',domain:[0,0.46],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'frekans',domain:[0,1],gridcolor:'rgba(255,255,255,0.06)'},xaxis2:{title:'değer (sağa çarpık veri)',domain:[0.54,1],gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{title:'frekans',domain:[0,1],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:60,r:30,b:60,l:60},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}},barmode:'overlay'};
Plotly.newPlot('plot-l102-hist-tr',[hSymT,hSkT,meanLineSymT,medLineSymT,modeLineSymT,meanLineSkT,medLineSkT,modeLineSkT],layHT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l102-bar-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> tek bir sağa çarpık veri setinin üç ölçüsü (ortalama, medyan, mod) çubuk grafik olarak gösteriliyor. Ortalama en büyük, mod en küçük. Aralarındaki boşluk doğrudan görsel bir çarpıklık tahminidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['Ortalama','Medyan','Mod'];var vals=[4.17,3,1];
var tBarT={x:labels,y:vals,type:'bar',marker:{color:['#ef4444','#10b981','#a855f7'],line:{color:'rgba(255,255,255,0.2)',width:1}},text:vals.map(function(v){return v.toFixed(2);}),textposition:'auto'};
var layBT={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'ölçü',gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'değer',range:[0,5],gridcolor:'rgba(255,255,255,0.06)'},margin:{t:40,r:30,b:60,l:60},showlegend:false};
Plotly.newPlot('plot-l102-bar-tr',[tBarT],layBT,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-graph"><div id="plot-l102-skew-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç ölçüsü işaretlenmiş düzgün bir sağa çarpık dağılım. Mod tepe noktasında, medyan alanı ikiye böler, ortalama ağır sağ kuyruğa çekilmiştir. mod &lt; medyan &lt; ortalama sıralaması sağa çarpıklığın karakteristik göstergesidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];var ys=[];for(var i=0;i<=200;i++){var x=i*0.1;xs.push(x);var k=2.0;var th=1.5;var pdf=Math.pow(x,k-1)*Math.exp(-x/th)/(Math.pow(th,k)*1.0);if(!isFinite(pdf))pdf=0;ys.push(pdf);}
var curveT={x:xs,y:ys,mode:'lines',name:'yoğunluk',line:{color:'#3b82f6',width:2.5},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.15)'};
var modeX=1.5;var medX=2.51;var meanX=3.0;
var maxY=Math.max.apply(null,ys);
var modeLT={x:[modeX,modeX],y:[0,maxY*0.95],mode:'lines+text',line:{color:'#a855f7',width:3,dash:'dot'},name:'mod',text:['','mod'],textposition:'top center',textfont:{color:'#a855f7'}};
var medLT={x:[medX,medX],y:[0,maxY*0.80],mode:'lines+text',line:{color:'#10b981',width:3,dash:'dash'},name:'medyan',text:['','medyan'],textposition:'top center',textfont:{color:'#10b981'}};
var meanLT={x:[meanX,meanX],y:[0,maxY*0.65],mode:'lines+text',line:{color:'#ef4444',width:3},name:'ortalama',text:['','ortalama'],textposition:'top center',textfont:{color:'#ef4444'}};
var layST={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'değer',gridcolor:'rgba(255,255,255,0.06)',range:[0,15]},yaxis:{title:'yoğunluk',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:40,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l102-skew-tr',[curveT,modeLT,medLT,meanLT],layST,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">12. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıralamayı unutmak</div><div class="card-body">Medyan sıralı veri gerektirir. Sıralanmamış bir listenin ortadaki değerini okumak anlamsız bir sayıdır. Önce sırala.</div></div>
<div class="calc-card"><div class="card-title">Ortalamayla medyanı karıştırmak</div><div class="card-body">"Londra'da ortalama ev fiyatı 700.000 sterlin" — bu ortalama mı, medyan mı? Çarpık veride yüz binlerce sterlin fark edebilirler. Her zaman hangisi olduğunu belirt.</div></div>
<div class="calc-card"><div class="card-title">Sürekli verinin modu</div><div class="card-body">0.1 cm hassasiyetle ölçülen boylar nadiren birebir tekrarlanır. Bir öğrencinin 168.3 olduğu için "mod 168.3" demek yanıltıcıdır. Yerine histogram tepesini kullan.</div></div>
<div class="calc-card"><div class="card-title">Oranlar için aritmetik ortalama</div><div class="card-body">Ortalama hız, bileşik büyüme ve oranlar için harmonik ya da geometrik ortalama gerekir. Naif aritmetik cevap yanlıştır, bazen çok yanlış.</div></div>
<div class="calc-card"><div class="card-title">Uç değerleri görmezden gelmek</div><div class="card-body">Her zaman sağduyu kontrolü yap: veriyi çiz, aşırı değerleri ara. Gerçeklerse medyan dürüsttür. Yazım hatasıysa hesaplamadan önce düzelt.</div></div>
<div class="calc-card"><div class="card-title">Yanlış ağırlık paydası</div><div class="card-body">Ağırlıklı ortalamada ağırlıkların toplamına böl, n'e değil. Ağırlıklar eşitsizse ikisi farklıdır ve n'e bölmek yanlış sonuç verir.</div></div>
</div>

<h2 class="lesson-title">13. Çözümlü Alıştırma Problemleri</h2>

<p class="l-text">Dersi pekiştiren sekiz problem. Önce her birini kendin dene, sonra çözümü oku.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; AYNI VERİNİN ORTALAMA VE MEDYANI</div><div class="example-body"><strong>$\\{4,\\, 7,\\, 9,\\, 11,\\, 14\\}$ veri setinin ortalama ve medyanını bul.</strong><br><br>Ortalama: $(4+7+9+11+14)/5 = 45/5 = \\mathbf{9}$.<br>Medyan: veri sıralı, $n=5$ tek, orta konum 3, değer $\\mathbf{9}$.<br><br>Birbirine uyuyor — simetrik veride tipik.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; UÇ DEĞER ETKİSİ</div><div class="example-body"><strong>Maaş verisi (bin TL): $\\{30, 32, 35, 35, 40, 42, 250\\}$. Hangisi daha temsili: ortalama mı, medyan mı?</strong><br><br>Ortalama: $(30+32+35+35+40+42+250)/7 = 464/7 \\approx 66.3$.<br>Medyan: sıralı, $n=7$ tek, orta 4. değer = $\\mathbf{35}$.<br><br>Yedi çalışanın altısı 42 ya da daha az kazanıyor. Medyan (35) çok daha temsili. Ortalama (66) tek bir aşırı değer tarafından ele geçirildi.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; MOD</div><div class="example-body"><strong>$\\{5, 7, 7, 9, 9, 9, 11, 13\\}$ modu.</strong><br><br>Sayımlar: 5(1), 7(2), 9(3), 11(1), 13(1). En yüksek sayım 3, 9 değeri için.<br><br>Mod = <strong>9</strong>. Veri seti tek modludur.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; AĞIRLIKLI ORTALAMA (GANO)</div><div class="example-body"><strong>Bir öğrencinin üç dersi: Matematik (4 kr, 85), Kimya (3 kr, 70), Edebiyat (2 kr, 95). Ağırlıklı GANO nedir?</strong><br><br>Ağırlıklı ortalama: $\\dfrac{4 \\cdot 85 + 3 \\cdot 70 + 2 \\cdot 95}{4+3+2} = \\dfrac{340 + 210 + 190}{9} = \\dfrac{740}{9} \\approx \\mathbf{82.2}$.<br><br>Sonucun 70'ten çok 85'e yakın olduğuna dikkat — Matematik'in daha yüksek ağırlığı GANO'yu yukarı çekiyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; ÇİFT n MEDYANI</div><div class="example-body"><strong>$\\{3, 6, 8, 10, 14, 17, 20, 25\\}$ medyanı.</strong><br><br>Zaten sıralı. $n = 8$ çift. Orta konumlar: 4 ve 5. Değerler: 10 ve 14. Medyan = $(10 + 14)/2 = \\mathbf{12}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; GEOMETRİK ORTALAMA</div><div class="example-body"><strong>Bir hisse senedi ardışık üç yılda %5, %10, &minus;%3 getiri sağlıyor. Ortalama yıllık getiri nedir?</strong><br><br>Büyüme çarpanları: 1.05, 1.10, 0.97.<br>Çarpım: $1.05 \\cdot 1.10 \\cdot 0.97 = 1.12035$.<br>Küp kök: $\\sqrt[3]{1.12035} \\approx 1.0386$.<br><br>Ortalama yıllık getiri &approx; <strong>%3.86</strong>. Oranların aritmetik ortalaması $(5+10-3)/3 = \\%4$ verir — yakın ama yanlış.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; HARMONİK ORTALAMA (HIZ)</div><div class="example-body"><strong>100 km'yi 80 km/sa hızla sür, sonra 100 km'yi 50 km/sa hızla. Ortalama hız?</strong><br><br>$\\{80, 50\\}$'in harmonik ortalaması: $\\dfrac{2}{1/80 + 1/50} = \\dfrac{2}{(5 + 8)/400} = \\dfrac{800}{13} \\approx \\mathbf{61.5}$ km/sa.<br><br>Doğrula: ilk etap süresi $100/80 = 1.25$ sa; ikinci etap $100/50 = 2$ sa; toplam 3.25 sa, 200 km için $200/3.25 \\approx 61.5$ km/sa. Doğrulandı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; HANGİ ÖLÇÜYE KARAR VER</div><div class="example-body"><strong>Her senaryo için ortalama, medyan ya da modu seç ve kısaca gerekçelendir.</strong><br><br>(a) Ankara'da ekim ayı günlük sıcaklıkları &rarr; <strong>ortalama</strong> (yaklaşık simetrik, uç değer yok).<br>(b) İstanbul'da ev fiyatları &rarr; <strong>medyan</strong> (birkaç lüks konut sağa çarpıklık yaratıyor).<br>(c) En popüler dondurma aroması &rarr; <strong>mod</strong> (kategorik veri, ortalama anlamsız).<br>(d) Final sınavı notları, çoğu öğrencinin iyi yaptığı &rarr; <strong>medyan</strong> (büyük olasılıkla sola çarpık).<br>(e) Atletlerin tepki süreleri &rarr; <strong>medyan</strong> (zaman zaman yavaş denemelerle sağa çarpık).</div></div>

<h2 class="lesson-title">14. İleriye Bakış</h2>

<p class="l-text">Ortalama, medyan ve mod sana veri setinin merkezinin nerede olduğunu söyler. Verinin o merkez etrafında ne kadar yayıldığı hakkında hiçbir şey söylemez — ortalaması 75 olan iki sınıf, biri notların 75 etrafında sıkı kümelendiği, diğeri ise notların 30'dan 100'e dağıldığı sınıflar olabilir ve birbirinden çok farklı görünebilir. Bir sonraki ders <em>yayılım ölçülerini</em> tanıtıyor: değişim aralığı, varyans ve standart sapma — betimsel istatistik araç kutusunun ikinci yarısı. Üç merkez ölçüsüyle birlikte, herhangi bir veri setinin tek paragraflık eksiksiz bir özetini verirler.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Betimsel istatistik elindeki veriyi özetler; çıkarımsal istatistik anakütleye uzanır</li>
<li>Anakütle parametreleri Yunan harflerini (&mu;, &sigma;), örneklem istatistikleri Latin harflerini (x&#772;, s) kullanır</li>
<li>Aritmetik ortalama: toplam bölü eleman sayısı, uç değerlere duyarlıdır</li>
<li>Medyan: sıralı verinin ortadaki değeri, uç değerlere dayanıklıdır, çarpık dağılımlar için idealdir</li>
<li>Mod: en sık görünen değer, kategorik veri için tek anlamlı ölçüdür</li>
<li>Ağırlıklı ortalama: her değer ağırlığıyla çarpılır, sonra ağırlıkların toplamına bölünür — GANO için kullanılır</li>
<li>Geometrik ortalama: büyüme oranları ve bileşiklenmiş getiriler için; harmonik ortalama hız gibi oranları ortalamak için</li>
<li>Çarpıklık sıralaması: sağa çarpık için mod &lt; medyan &lt; ortalama; sola çarpık için ortalama &lt; medyan &lt; mod</li>
</ul>
</div>`
};
