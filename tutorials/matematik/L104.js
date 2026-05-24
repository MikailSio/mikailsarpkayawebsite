window.LISE_MAT_L104 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Imagine handing someone a list of 200 raw exam scores</strong> and asking them to tell you, at a glance, how the class did. They would freeze. The list is too long to read, too unsorted to scan, and individual numbers tell you nothing about the overall picture. What you need is a way to compress those 200 numbers into a single image — one that shows you where most students fall, how spread out the scores are, and whether the distribution is symmetric or lopsided. That compression tool is the <em>histogram</em>, and the bookkeeping behind it is the <em>frequency distribution</em>.</p>

<p class="l-text">This lesson teaches you how to take a raw list of numbers, slice the number line into equal-width <em>classes</em>, count how many data points fall into each class, and draw the resulting bar picture. You will learn how to choose a sensible number of classes, how to read three closely related counts (frequency, relative frequency, cumulative frequency), how to recognise the four classic distribution shapes by eye, and how to estimate the median and mean from grouped data when the original numbers are no longer available.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Turn a raw list of numbers into a <em>frequency distribution table</em> with equal-width classes</li>
<li>Choose a sensible number of classes using the Sturges rule $k \\approx 1 + \\log_2(n)$</li>
<li>Distinguish frequency, relative frequency (proportion), and cumulative frequency, and know when each is most useful</li>
<li>Tell a <em>histogram</em> apart from a bar chart: continuous classes touch each other, categorical bars have gaps</li>
<li>Recognise the four classic shapes — symmetric, right-skewed, left-skewed, uniform — and notice bimodal data when it appears</li>
<li>Read an <em>ogive</em> (cumulative frequency curve) to extract the median and any other percentile by horizontal interpolation</li>
<li>Estimate the mean from grouped data using class midpoints and avoid the common density mistake when class widths are unequal</li>
</ul>
</div>

<h2 class="lesson-title">1. Raw Data vs Grouped Data</h2>

<div class="calc-highlight"><strong>Raw data is the list as it came out of the world.</strong> Thirty test scores, two hundred reaction times, a million daily temperatures. Each value is exact, but the list itself is unreadable. <em>Grouped data</em> sacrifices exact values for an organised summary: the number line is sliced into intervals (called <em>classes</em>), and each data point is counted into whichever class it lands in. You lose the individual numbers; you gain a picture.</div>

<p class="l-text">Here is the raw dataset we will use throughout the lesson. Thirty students take a 100-point exam and score the following marks:</p>

<div class="calc-example"><div class="example-label">RAW DATA — 30 EXAM SCORES</div><div class="example-body">52, 67, 73, 41, 88, 79, 65, 58, 72, 90, 84, 76, 63, 49, 55, 81, 68, 71, 77, 62, 85, 59, 74, 67, 92, 70, 64, 78, 83, 69<br><br>Out of 30, raw, nothing sorted. Try to summarise it in your head.<br><br>You can't. That is the point: 30 numbers are too many to grasp without grouping. We need a method.</div></div>

<p class="l-text"><strong>The trick is to give up some precision in exchange for clarity.</strong> Instead of remembering each score, we ask: how many students scored between 40 and 49? Between 50 and 59? And so on. The answers form a much shorter table that the brain <em>can</em> hold all at once.</p>

<h2 class="lesson-title">2. Building a Frequency Table</h2>

<div class="calc-highlight"><strong>A frequency table is the bookkeeping behind every histogram.</strong> It lists the classes (intervals) in the left column and the count of data points falling into each class in the right column. Done. The graph is just this table turned into bars.</div>

<p class="l-text"><strong>Recipe.</strong> Find the smallest and largest values (the <em>range</em> in size). Decide how many classes you want. Divide the range by the class count to get the <em>class width</em>. Round the width up to a friendly number so the class boundaries are easy to read. Then tally each data point into the class that contains it.</p>

<div class="calc-formula"><div class="formula-label">CLASS WIDTH</div><div class="formula-main">$$w \\;=\\; \\frac{\\text{range}}{k} \\;=\\; \\frac{x_{\\max} - x_{\\min}}{k}$$</div><div class="formula-sub">$k$ is the number of classes you chose; $w$ is the width of each class. Round $w$ upward to a convenient integer.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — TURN RAW DATA INTO A FREQUENCY TABLE</div><div class="example-body">For our 30 exam scores: smallest = 41, largest = 92. Range = 92 &minus; 41 = 51.<br><br>Choose $k = 6$ classes (we will justify this in section 3). Class width: $w = 51 / 6 = 8.5 \\rightarrow$ round up to <strong>10</strong>. Friendly boundaries.<br><br>Classes: $[40, 50)$, $[50, 60)$, $[60, 70)$, $[70, 80)$, $[80, 90)$, $[90, 100)$. The square bracket means "included", the round bracket means "excluded" — so a score of exactly 50 lands in $[50, 60)$, not in $[40, 50)$.<br><br>Tally each score: 41, 49 in the first class (2 scores); 52, 55, 58, 59 in $[50, 60)$ (4 scores); 62, 63, 64, 65, 67, 67, 68, 69 in $[60, 70)$ (8 scores); 70, 71, 72, 73, 74, 76, 77, 78, 79 in $[70, 80)$ (9 scores); 81, 83, 84, 85, 88 in $[80, 90)$ (5 scores); 90, 92 in $[90, 100)$ (2 scores). Total: $2+4+8+9+5+2 = 30$. Check!</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Class</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Midpoint $m_i$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Frequency $f_i$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Relative $f_i/n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Cumulative</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[40, 50)</td><td style="padding:0.5rem 0.8rem">45</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">0.067</td><td style="padding:0.5rem 0.8rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[50, 60)</td><td style="padding:0.5rem 0.8rem">55</td><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">0.133</td><td style="padding:0.5rem 0.8rem">6</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[60, 70)</td><td style="padding:0.5rem 0.8rem">65</td><td style="padding:0.5rem 0.8rem">8</td><td style="padding:0.5rem 0.8rem">0.267</td><td style="padding:0.5rem 0.8rem">14</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[70, 80)</td><td style="padding:0.5rem 0.8rem">75</td><td style="padding:0.5rem 0.8rem">9</td><td style="padding:0.5rem 0.8rem">0.300</td><td style="padding:0.5rem 0.8rem">23</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[80, 90)</td><td style="padding:0.5rem 0.8rem">85</td><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem">0.167</td><td style="padding:0.5rem 0.8rem">28</td></tr>
<tr><td style="padding:0.5rem 0.8rem">[90, 100)</td><td style="padding:0.5rem 0.8rem">95</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">0.067</td><td style="padding:0.5rem 0.8rem">30</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>One row of the table is one bar of the histogram.</strong> The table is the data; the histogram is the same data drawn. If you can build the table you can build the picture — there is nothing extra to learn.</div>

<h2 class="lesson-title">3. How Many Classes? The Sturges Rule</h2>

<div class="calc-highlight"><strong>Too few classes hide the shape; too many fragment the data into noise.</strong> A standard rule-of-thumb due to Sturges (1926) chooses the number of classes from the sample size $n$ alone, ignoring the data itself.</div>

<div class="calc-formula"><div class="formula-label">STURGES RULE</div><div class="formula-main">$$k \\;\\approx\\; 1 + \\log_2(n) \\;\\approx\\; 1 + 3.322 \\, \\log_{10}(n)$$</div><div class="formula-sub">$k$ is the recommended number of classes. Round to the nearest integer. Works well for $30 \\leq n \\leq 200$; for larger samples consider a refinement such as Scott or Freedman&ndash;Diaconis.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — APPLY STURGES TO OUR DATA</div><div class="example-body">$n = 30$ students. Sturges: $k = 1 + \\log_2(30) = 1 + 4.91 \\approx \\mathbf{5.9}$, round to 6.<br><br>That is exactly the choice we used. With 100 data points we would get $k = 1 + \\log_2(100) \\approx 7.6$, i.e. 8 classes. With 1000 points, $k \\approx 11$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Too few classes (e.g. $k=2$)</div><div class="card-body">The histogram becomes a coarse "low" vs "high" pair of bars. You lose all detail about the shape and miss any skewness or bimodality.</div></div>
<div class="calc-card"><div class="card-title">Too many classes (e.g. $k=20$ for $n=30$)</div><div class="card-body">Most classes hold zero or one data point. The bars wobble at random and you see noise, not shape.</div></div>
<div class="calc-card"><div class="card-title">Sturges' sweet spot</div><div class="card-body">Around $1 + \\log_2 n$ classes. The shape is visible but each bar still has enough counts to be stable.</div></div>
</div>

<h2 class="lesson-title">4. Frequency, Relative Frequency, Cumulative Frequency</h2>

<div class="calc-highlight"><strong>Three counts, three perspectives on the same table.</strong> Frequency answers "how many in this class?", relative frequency answers "what proportion in this class?", cumulative frequency answers "how many up to and including this class?". Each is just an arithmetic operation on the previous column.</div>

<div class="calc-formula"><div class="formula-label">THREE FREQUENCY MEASURES</div><div class="formula-main">$$f_i \\;=\\; \\text{count in class } i, \\qquad \\text{rel} = \\frac{f_i}{n}, \\qquad F_i = f_1 + f_2 + \\cdots + f_i$$</div><div class="formula-sub">Relative frequencies sum to 1; the final cumulative frequency $F_k$ equals $n$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — READ THE TABLE</div><div class="example-body">From our exam table:<br><br>&bull; How many students scored between 70 and 79? <strong>9 students</strong> (frequency of $[70, 80)$).<br>&bull; What proportion of the class scored in that range? $9/30 = \\mathbf{0.30}$ or 30% (relative frequency).<br>&bull; How many scored under 80? <strong>23 students</strong> (cumulative frequency at $[70, 80)$).<br>&bull; What proportion failed (under 60)? $6/30 = \\mathbf{0.20}$, i.e. 20% (cumulative relative frequency).</div></div>

<div class="l-note"><strong>When to use which.</strong> Use plain frequency for raw counts ("9 students in that range"). Use relative frequency when comparing two datasets of different sizes ("30% of class A vs 25% of class B scored 70&ndash;79"). Use cumulative frequency when asking "how many up to a threshold" questions ("how many scored below the passing mark of 60?").</div>

<h2 class="lesson-title">5. The Histogram</h2>

<div class="calc-highlight"><strong>A histogram draws one bar per class, with the bar's height equal to the class frequency.</strong> Crucially, the bars <em>touch</em> each other: there are no gaps because the classes themselves are continuous along the number line. This is the single most important visual difference between a histogram and a bar chart.</div>

<p class="l-text">Below is the histogram of our 30 exam scores. Read it directly: the shape rises from 41&ndash;49 (only 2 students), peaks at 70&ndash;79 (the modal class, 9 students), and tails off toward 90&ndash;99 (2 students). Most of the class scored in the 60&ndash;79 band; the distribution is roughly symmetric with a slight left lean.</p>

<div class="calc-graph"><div id="plot-l104-hist-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the frequency histogram of 30 exam scores grouped into six classes of width 10. The tallest bar (modal class) is $[70, 80)$ with 9 students. The bars touch because the classes are continuous; the x-axis is a number line, not a list of categories.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var classes=['40-49','50-59','60-69','70-79','80-89','90-99'];
var freqs=[2,4,8,9,5,2];
var bars={x:classes,y:freqs,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.2}},text:freqs.map(function(v){return v.toString();}),textposition:'outside',textfont:{color:'#e8e8e8',size:12},name:'frequency'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'exam score (class)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'frequency (number of students)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,11]},margin:{t:30,r:30,b:60,l:60},bargap:0.02,showlegend:false};
Plotly.newPlot('plot-l104-hist-en',[bars],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Histogram vs Bar Chart</h2>

<div class="calc-highlight"><strong>Bar charts and histograms look similar but encode different things.</strong> A bar chart represents <em>categorical</em> data (favourite colour, blood type, country) — the bars are separated by gaps because the categories are independent labels with no order. A histogram represents <em>quantitative continuous</em> data — bars touch because adjacent classes share a boundary on the number line.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">BAR CHART</div><div class="compare-item">Data type: categorical (labels)</div><div class="compare-item">Bars have <strong>gaps</strong> between them</div><div class="compare-item">Order of bars is arbitrary (you can rearrange)</div><div class="compare-item">Example: number of students by favourite sport</div></div><div class="compare-col"><div class="compare-title">HISTOGRAM</div><div class="compare-item">Data type: continuous (numbers on a line)</div><div class="compare-item">Bars <strong>touch</strong> each other</div><div class="compare-item">Order of bars is fixed (the number line)</div><div class="compare-item">Example: exam scores grouped into intervals</div></div></div>

<div class="l-note"><strong>Quick test.</strong> Could you swap two bars without confusing the reader? If yes (e.g. swap "football" and "tennis"), it is a bar chart. If swapping would corrupt the message (you cannot put 60&ndash;69 before 50&ndash;59), it is a histogram.</div>

<h2 class="lesson-title">7. Shape Descriptors</h2>

<div class="calc-highlight"><strong>Once you have a histogram, the next question is: what shape is it?</strong> Four canonical patterns cover almost everything you will meet at high-school level: symmetric (bell-shaped), right-skewed, left-skewed, and uniform. Bimodal distributions (two peaks) are a fifth important case that often signals two underlying populations mixed together.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Shape</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Visual cue</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Mean vs median</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Real-world example</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Symmetric</strong></td><td style="padding:0.5rem 0.8rem">Mirror image about its peak</td><td style="padding:0.5rem 0.8rem">mean &asymp; median</td><td style="padding:0.5rem 0.8rem">Adult heights, IQ scores</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Right-skewed</strong></td><td style="padding:0.5rem 0.8rem">Long tail to the right</td><td style="padding:0.5rem 0.8rem">mean &gt; median</td><td style="padding:0.5rem 0.8rem">Salaries, house prices</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Left-skewed</strong></td><td style="padding:0.5rem 0.8rem">Long tail to the left</td><td style="padding:0.5rem 0.8rem">mean &lt; median</td><td style="padding:0.5rem 0.8rem">Age at retirement, easy exams</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Uniform</strong></td><td style="padding:0.5rem 0.8rem">All bars roughly equal</td><td style="padding:0.5rem 0.8rem">mean = midpoint = median</td><td style="padding:0.5rem 0.8rem">Last digit of phone numbers, dice rolls</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>Bimodal</strong></td><td style="padding:0.5rem 0.8rem">Two distinct peaks with a dip</td><td style="padding:0.5rem 0.8rem">mean between peaks</td><td style="padding:0.5rem 0.8rem">Heights of men+women mixed, exam where some studied and some didn't</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l104-shapes-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three side-by-side histograms generated from synthetic data illustrating right-skewed, symmetric (bell-shaped), and left-skewed distributions. Notice how the long tail moves: to the right when the distribution is right-skewed, to the left when it is left-skewed. The symmetric case is the canonical bell shape.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var binsRight=['1','2','3','4','5','6','7','8','9','10'];
var freqRight=[28,22,17,12,8,5,3,2,2,1];
var binsSym=['1','2','3','4','5','6','7','8','9','10'];
var freqSym=[2,5,10,17,22,22,17,10,5,2];
var binsLeft=['1','2','3','4','5','6','7','8','9','10'];
var freqLeft=[1,2,2,3,5,8,12,17,22,28];
var bR={x:binsRight,y:freqRight,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'right-skewed',xaxis:'x',yaxis:'y'};
var bS={x:binsSym,y:freqSym,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'symmetric',xaxis:'x2',yaxis:'y2'};
var bL={x:binsLeft,y:freqLeft,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'left-skewed',xaxis:'x3',yaxis:'y3'};
var annot=[{text:'<b>right-skewed</b>',x:0.16,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}},{text:'<b>symmetric</b>',x:0.50,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}},{text:'<b>left-skewed</b>',x:0.84,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'class',domain:[0,0.31],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'frequency',domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},xaxis2:{title:'class',domain:[0.35,0.65],gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{title:'',domain:[0,1],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},xaxis3:{title:'class',domain:[0.69,1],gridcolor:'rgba(255,255,255,0.06)'},yaxis3:{title:'',domain:[0,1],anchor:'x3',gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},margin:{t:50,r:20,b:60,l:60},bargap:0.02,showlegend:false,annotations:annot};
Plotly.newPlot('plot-l104-shapes-en',[bR,bS,bL],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Cumulative Frequency and the Ogive</h2>

<div class="calc-highlight"><strong>An ogive (pronounced "oh-jive") is the cumulative frequency curve.</strong> Plot the upper class boundary on the x-axis against the cumulative frequency on the y-axis, then connect the points with line segments. The curve always starts at 0 and ends at $n$. It is monotonically non-decreasing — that is, it never goes down.</div>

<p class="l-text"><strong>Why bother?</strong> Because the ogive lets you read off any <em>percentile</em> by drawing a horizontal line and seeing where it meets the curve. The median is the 50th percentile: draw a horizontal line at $y = n/2$ and read the x-value where it intersects the ogive. The first quartile ($Q_1$) is at $y = n/4$, the third quartile at $y = 3n/4$. Any percentile you want, the ogive hands you.</p>

<div class="calc-formula"><div class="formula-label">MEDIAN FROM AN OGIVE — LINEAR INTERPOLATION</div><div class="formula-main">$$\\text{median} \\;\\approx\\; L \\;+\\; \\frac{n/2 - F}{f} \\cdot w$$</div><div class="formula-sub">$L$ = lower boundary of the median class, $F$ = cumulative frequency just before the median class, $f$ = frequency of the median class, $w$ = class width. Assumes data is uniformly distributed within each class (linear interpolation).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — MEDIAN FROM THE OGIVE</div><div class="example-body">For our exam scores, $n/2 = 15$. From the cumulative column: 14 students scored under 70, 23 students scored under 80. So the 15th student lies in the $[70, 80)$ class — that is the <strong>median class</strong>.<br><br>Linear interpolation: $L = 70$, $F = 14$ (cumulative just before), $f = 9$ (frequency of median class), $w = 10$ (class width).<br><br>$\\text{median} \\approx 70 + \\dfrac{15 - 14}{9} \\cdot 10 = 70 + \\dfrac{10}{9} \\approx \\mathbf{71.1}$.<br><br>For comparison the exact median of the raw data (15th and 16th values when sorted: 70 and 71) is $(70+71)/2 = 70.5$. Our grouped estimate 71.1 is close — within about half a point.</div></div>

<div class="calc-graph"><div id="plot-l104-ogive-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the ogive (cumulative frequency curve) for the 30 exam scores. The dashed red horizontal line at $y = 15$ marks the median level; it intersects the curve at $x \\approx 71.1$, which is our linear-interpolation estimate of the median. The curve starts at 0 and ends at 30, monotonically rising.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[40,50,60,70,80,90,100];
var cum=[0,2,6,14,23,28,30];
var ogive={x:xs,y:cum,mode:'lines+markers',name:'ogive',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:8}};
var medLine={x:[40,71.1],y:[15,15],mode:'lines',line:{color:'#ef4444',width:2,dash:'dash'},name:'median level (n/2 = 15)'};
var medDrop={x:[71.1,71.1],y:[15,0],mode:'lines',line:{color:'#ef4444',width:2,dash:'dash'},name:'median &asymp; 71.1',showlegend:false};
var medMark={x:[71.1],y:[15],mode:'markers+text',marker:{color:'#ef4444',size:10,symbol:'x'},text:['median &asymp; 71.1'],textposition:'top right',textfont:{color:'#ef4444',size:11},name:'median point',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'exam score (upper class boundary)',range:[38,102],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'cumulative frequency',range:[0,32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l104-ogive-en',[ogive,medLine,medDrop,medMark],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Estimating the Mean from Grouped Data</h2>

<div class="calc-highlight"><strong>Once the raw data has been thrown away and only the frequency table remains, you cannot compute the exact mean.</strong> But you can estimate it by treating every observation in a class as if it sat at the <em>midpoint</em> of that class. The estimate is biased toward the centre of each interval, but for reasonably narrow classes the bias is small.</div>

<div class="calc-formula"><div class="formula-label">MEAN FROM GROUPED DATA</div><div class="formula-main">$$\\bar{x} \\;\\approx\\; \\frac{\\sum_{i=1}^{k} f_i \\, m_i}{\\sum_{i=1}^{k} f_i} \\;=\\; \\frac{\\sum f_i m_i}{n}$$</div><div class="formula-sub">$f_i$ = frequency of class $i$, $m_i$ = midpoint of class $i$, $n = \\sum f_i$ = total sample size.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — ESTIMATE THE MEAN OF OUR EXAM SCORES</div><div class="example-body">From the table: classes $[40,50), \\ldots, [90,100)$ with midpoints $45, 55, 65, 75, 85, 95$ and frequencies $2, 4, 8, 9, 5, 2$.<br><br>$\\sum f_i m_i = 2 \\cdot 45 + 4 \\cdot 55 + 8 \\cdot 65 + 9 \\cdot 75 + 5 \\cdot 85 + 2 \\cdot 95 = 90 + 220 + 520 + 675 + 425 + 190 = 2120$.<br><br>$\\bar{x} \\approx 2120 / 30 \\approx \\mathbf{70.7}$.<br><br>The exact mean of the 30 raw scores (sum them all up) is 2107 / 30 &approx; 70.2. Our grouped estimate 70.7 is within half a point — the midpoint assumption is doing its job.</div></div>

<div class="l-note"><strong>Why the midpoint?</strong> If the data within a class is roughly evenly spread, the average of those values is the midpoint of the interval. The midpoint is the unbiased "best guess" when you know only that a value sits between two boundaries.</div>

<h2 class="lesson-title">10. Unequal Class Widths: Use Density, Not Frequency</h2>

<div class="calc-highlight"><strong>If your classes do not all have the same width, plotting frequency on the y-axis distorts the picture.</strong> A wider class contains more data simply because it covers more of the number line, not because the underlying density is higher. The fix is to plot <em>frequency density</em> instead: divide the frequency by the class width.</div>

<div class="calc-formula"><div class="formula-label">FREQUENCY DENSITY</div><div class="formula-main">$$\\text{density}_i \\;=\\; \\frac{f_i}{w_i}$$</div><div class="formula-sub">When classes have equal width, density and frequency are proportional, so plotting either is fine. When widths differ, only the density plot is honest.</div></div>

<div class="calc-example"><div class="example-label">QUICK ILLUSTRATION</div><div class="example-body">Suppose ages are grouped as $[0, 5)$, $[5, 18)$, $[18, 65)$, $[65, 100)$, with frequencies 10, 20, 50, 15. Class widths are 5, 13, 47, 35. Densities are $10/5 = 2.0$, $20/13 \\approx 1.54$, $50/47 \\approx 1.06$, $15/35 \\approx 0.43$.<br><br>Frequency suggests the 18&ndash;65 class is dominant (50 people). Density tells the truer story: per year of life the 0&ndash;5 group has the highest concentration (2 people per year), the 65+ group the lowest (0.43 per year).</div></div>

<h2 class="lesson-title">11. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ambiguous class boundaries</div><div class="card-body">Writing classes as "40&ndash;50, 50&ndash;60, &hellip;" is unclear: which class contains exactly 50? Use half-open notation $[40, 50)$, $[50, 60)$ &mdash; left boundary included, right excluded &mdash; so every value belongs to exactly one class.</div></div>
<div class="calc-card"><div class="card-title">Unequal widths plotted as frequency</div><div class="card-body">If one class is twice as wide as the others, its bar will look "too tall" even if the per-unit density is normal. For unequal widths use frequency density.</div></div>
<div class="calc-card"><div class="card-title">Treating a histogram as a bar chart</div><div class="card-body">Leaving gaps between bars suggests categorical data and hides the continuity of the underlying variable. Histogram bars touch.</div></div>
<div class="calc-card"><div class="card-title">Too few or too many classes</div><div class="card-body">Both extremes destroy the shape. Use the Sturges rule as a starting point and adjust if the picture looks jagged or featureless.</div></div>
<div class="calc-card"><div class="card-title">Misreading the ogive</div><div class="card-body">The ogive plots cumulative frequency against the <em>upper</em> class boundary, not the midpoint. Reading off the wrong x-value gives the wrong percentile.</div></div>
<div class="calc-card"><div class="card-title">Reporting grouped estimates as exact</div><div class="card-body">The mean and median computed from grouped data are <em>estimates</em>, accurate within roughly half a class width. Quote them as approximations, not exact values.</div></div>
</div>

<h2 class="lesson-title">12. Worked Practice Problems</h2>

<p class="l-text">Six exercises to consolidate the lesson. Work each one yourself before reading the solution.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; SET UP A FREQUENCY TABLE</div><div class="example-body"><strong>Twenty students' heights (cm): 152, 158, 160, 164, 166, 167, 168, 170, 170, 172, 173, 174, 175, 176, 178, 179, 180, 182, 184, 188. Build a frequency table with 4 classes.</strong><br><br>Range = $188 - 152 = 36$. Width $= 36/4 = 9 \\rightarrow$ round to 10. Classes: $[150, 160)$, $[160, 170)$, $[170, 180)$, $[180, 190)$.<br>Counts: 2, 5, 9, 4. Total 20. Check!</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; STURGES FOR $n = 64$</div><div class="example-body"><strong>How many classes does the Sturges rule recommend for a sample of 64 observations?</strong><br><br>$k = 1 + \\log_2(64) = 1 + 6 = \\mathbf{7}$ classes.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; RELATIVE FREQUENCY</div><div class="example-body"><strong>A class of 25 students recorded weekly study hours. The frequency for the $[6, 9)$ class is 8. What is the relative frequency?</strong><br><br>Relative frequency $= 8/25 = 0.32$, i.e. <strong>32%</strong> of the class studied between 6 and 9 hours per week.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; ESTIMATE THE MEAN FROM GROUPED DATA</div><div class="example-body"><strong>Frequency table: class $[0, 10)$ has 5 values, $[10, 20)$ has 12, $[20, 30)$ has 8, $[30, 40)$ has 5. Estimate the mean.</strong><br><br>Midpoints: 5, 15, 25, 35. $\\sum f_i m_i = 5 \\cdot 5 + 12 \\cdot 15 + 8 \\cdot 25 + 5 \\cdot 35 = 25 + 180 + 200 + 175 = 580$. $n = 30$.<br>$\\bar{x} \\approx 580 / 30 \\approx \\mathbf{19.3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; MEDIAN FROM OGIVE</div><div class="example-body"><strong>Cumulative frequencies for 40 students' scores: cumulative at upper boundaries 50, 60, 70, 80, 90 are 4, 12, 25, 35, 40. Estimate the median.</strong><br><br>$n/2 = 20$. Median class is the one whose cumulative first reaches or exceeds 20: that is $[60, 70)$ (cumulative jumps from 12 to 25).<br>$L = 60$, $F = 12$, $f = 25 - 12 = 13$, $w = 10$.<br>$\\text{median} \\approx 60 + \\dfrac{20 - 12}{13} \\cdot 10 = 60 + \\dfrac{80}{13} \\approx \\mathbf{66.2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; SHAPE IDENTIFICATION</div><div class="example-body"><strong>Match each scenario with a likely distribution shape: (a) household incomes in a city, (b) heights of 17-year-olds, (c) last digit of national-ID numbers, (d) ages at retirement.</strong><br><br>(a) Right-skewed &mdash; a long tail of very high incomes drags the mean above the median.<br>(b) Symmetric (approximately bell-shaped) &mdash; biology produces a roughly normal spread.<br>(c) Uniform &mdash; digits 0&ndash;9 occur roughly equally.<br>(d) Left-skewed &mdash; most people retire near the legal age, a few retire much earlier, almost none retire much later.</div></div>

<h2 class="lesson-title">13. Looking Ahead</h2>

<p class="l-text">A histogram gives you the shape of a dataset in one picture. The next lesson uses that shape to define a new measure &mdash; <em>standard deviation</em> &mdash; that quantifies how wide the histogram is. Together with the mean and median you met in Lesson 102, the standard deviation completes the toolkit you need to summarise any dataset in two numbers: <em>where is the centre?</em> and <em>how spread out is it around that centre?</em> Histograms remain the visual companion to those summaries: a single number is never as convincing as the picture that produced it.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Raw data $\\rightarrow$ frequency table $\\rightarrow$ histogram is the standard summarisation pipeline</li>
<li>Choose the class count with Sturges' rule $k \\approx 1 + \\log_2(n)$; round to the nearest integer</li>
<li>Frequency = count, relative frequency = proportion, cumulative frequency = running total &mdash; three perspectives on the same table</li>
<li>Histogram bars <em>touch</em> (continuous classes); bar-chart bars have gaps (categorical labels)</li>
<li>Four standard shapes: symmetric, right-skewed, left-skewed, uniform; bimodal often signals two underlying populations</li>
<li>Ogive (cumulative frequency curve) yields median and any percentile by horizontal interpolation</li>
<li>Estimate the mean from grouped data as $\\sum f_i m_i / n$ using class midpoints</li>
<li>For unequal class widths use <em>frequency density</em> ($f/w$) on the y-axis, never raw frequency</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Birine ham 200 sınav notu uzattığını ve bir bakışta sınıfın nasıl olduğunu söylemesini istediğini düşün.</strong> Donar kalır. Liste okunamayacak kadar uzun, taramaya yeterince sıralı değil ve tek tek sayılar genel resim hakkında hiçbir şey söylemez. İhtiyacın olan şey, bu 200 sayıyı tek bir görüntüye sıkıştırmak — öğrencilerin çoğunun nerede toplandığını, notların ne kadar yayıldığını ve dağılımın simetrik mi yoksa yamuk mu olduğunu gösteren bir görüntü. Bu sıkıştırma aracı <em>histogram</em>dır ve arkasındaki kayıt tutma işine de <em>frekans dağılımı</em> denir.</p>

<p class="l-text">Bu derste ham bir sayı listesini alıp sayı doğrusunu eşit genişlikte <em>sınıflara</em> bölmeyi, her sınıfa kaç veri noktasının düştüğünü saymayı ve ortaya çıkan çubuk resmini çizmeyi öğreneceksin. Mantıklı bir sınıf sayısı seçmeyi, birbiriyle yakından ilişkili üç sayıyı (frekans, göreli frekans, birikimli frekans) okumayı, dört klasik dağılım şeklini gözle tanımayı ve ham veri kaybolduğunda gruplanmış veriden medyan ve ortalamayı tahmin etmeyi öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ham bir sayı listesini eşit genişlikli sınıflarla <em>frekans dağılım tablosu</em>na dönüştürmeyi</li>
<li>Sturges kuralı $k \\approx 1 + \\log_2(n)$ ile mantıklı bir sınıf sayısı seçmeyi</li>
<li>Frekansı, göreli frekansı (oran) ve birikimli frekansı ayırt etmeyi ve hangisinin ne zaman en yararlı olduğunu bilmeyi</li>
<li>Bir <em>histogramı</em> çubuk grafikten ayırmayı: sürekli sınıflar birbirine değer, kategorik çubuklar arasında boşluk vardır</li>
<li>Dört klasik şekli tanımayı — simetrik, sağa çarpık, sola çarpık, düzgün — ve karşılaştığında iki modlu veriyi fark etmeyi</li>
<li>Bir <em>ogive</em> (birikimli frekans eğrisi) okuyup medyanı ve istediğin yüzdeliği yatay enterpolasyonla çıkarmayı</li>
<li>Sınıf orta noktalarını kullanarak gruplanmış veriden ortalamayı tahmin etmeyi ve sınıf genişlikleri eşit olmadığında sık yapılan yoğunluk hatasından kaçınmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Ham Veri ve Gruplanmış Veri</h2>

<div class="calc-highlight"><strong>Ham veri, dünyadan geldiği haliyle listedir.</strong> Otuz sınav notu, iki yüz tepki süresi, bir milyon günlük sıcaklık. Her değer kesin, ama listenin kendisi okunamaz. <em>Gruplanmış veri</em>, kesin değerleri organize bir özet karşılığında feda eder: sayı doğrusu aralıklara (<em>sınıflara</em>) bölünür ve her veri noktası düştüğü sınıfta sayılır. Tek tek sayıları kaybedersin; bir resim kazanırsın.</div>

<p class="l-text">İşte ders boyunca kullanacağımız ham veri seti. Otuz öğrenci 100 puanlık bir sınavda şu notları alıyor:</p>

<div class="calc-example"><div class="example-label">HAM VERİ — 30 SINAV NOTU</div><div class="example-body">52, 67, 73, 41, 88, 79, 65, 58, 72, 90, 84, 76, 63, 49, 55, 81, 68, 71, 77, 62, 85, 59, 74, 67, 92, 70, 64, 78, 83, 69<br><br>Otuz tane, ham, sıralanmamış. Kafanda özetlemeyi dene.<br><br>Yapamazsın. Mesele bu: 30 sayı gruplandırılmadan kavranamayacak kadar çoktur. Bir yönteme ihtiyacımız var.</div></div>

<p class="l-text"><strong>İncelik, biraz hassasiyetten vazgeçip netlik kazanmaktır.</strong> Her notu tek tek hatırlamak yerine şunu soruyoruz: kaç öğrenci 40 ile 49 arasında not aldı? 50 ile 59 arasında? Ve böyle devam eder. Cevaplar, beynin bir kerede tutabileceği çok daha kısa bir tablo oluşturur.</p>

<h2 class="lesson-title">2. Frekans Tablosu Kurmak</h2>

<div class="calc-highlight"><strong>Frekans tablosu her histogramın arkasındaki kayıt tutma işidir.</strong> Sol sütunda sınıfları (aralıkları) ve sağ sütunda her sınıfa düşen veri sayısını listeler. Hepsi bu. Grafik bu tablonun çubuklara dönüştürülmüş halinden başka bir şey değildir.</div>

<p class="l-text"><strong>Tarif.</strong> En küçük ve en büyük değeri bul (büyüklüğün <em>açıklığı</em>). Kaç sınıf istediğine karar ver. Açıklığı sınıf sayısına bölerek <em>sınıf genişliğini</em> bul. Sınıf sınırlarının okunmasını kolaylaştırmak için genişliği yukarı yuvarla. Sonra her veri noktasını içeren sınıfın altına çetele at.</p>

<div class="calc-formula"><div class="formula-label">SINIF GENİŞLİĞİ</div><div class="formula-main">$$w \\;=\\; \\frac{\\text{aciklik}}{k} \\;=\\; \\frac{x_{\\max} - x_{\\min}}{k}$$</div><div class="formula-sub">$k$ seçtiğin sınıf sayısı; $w$ her sınıfın genişliği. $w$'yi pratik bir tam sayıya yukarı yuvarla.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — HAM VERİYİ FREKANS TABLOSUNA DÖNÜŞTÜR</div><div class="example-body">30 sınav notumuz için: en küçük = 41, en büyük = 92. Açıklık = 92 &minus; 41 = 51.<br><br>$k = 6$ sınıf seç (3. bölümde gerekçelendireceğiz). Sınıf genişliği: $w = 51 / 6 = 8.5 \\rightarrow$ <strong>10</strong>'a yuvarla. Sınırlar pratik olur.<br><br>Sınıflar: $[40, 50)$, $[50, 60)$, $[60, 70)$, $[70, 80)$, $[80, 90)$, $[90, 100)$. Köşeli parantez "dahil", yuvarlak parantez "hariç" anlamına gelir — yani tam 50 olan bir not $[50, 60)$ sınıfına düşer, $[40, 50)$'ye değil.<br><br>Her notu çetelele: 41, 49 birinci sınıfta (2 not); 52, 55, 58, 59 $[50, 60)$'da (4 not); 62, 63, 64, 65, 67, 67, 68, 69 $[60, 70)$'de (8 not); 70, 71, 72, 73, 74, 76, 77, 78, 79 $[70, 80)$'de (9 not); 81, 83, 84, 85, 88 $[80, 90)$'da (5 not); 90, 92 $[90, 100)$'de (2 not). Toplam: $2+4+8+9+5+2 = 30$. Doğrula!</div></div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Sınıf</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Orta nokta $m_i$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Frekans $f_i$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Göreli $f_i/n$</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Birikimli</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[40, 50)</td><td style="padding:0.5rem 0.8rem">45</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">0.067</td><td style="padding:0.5rem 0.8rem">2</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[50, 60)</td><td style="padding:0.5rem 0.8rem">55</td><td style="padding:0.5rem 0.8rem">4</td><td style="padding:0.5rem 0.8rem">0.133</td><td style="padding:0.5rem 0.8rem">6</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[60, 70)</td><td style="padding:0.5rem 0.8rem">65</td><td style="padding:0.5rem 0.8rem">8</td><td style="padding:0.5rem 0.8rem">0.267</td><td style="padding:0.5rem 0.8rem">14</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[70, 80)</td><td style="padding:0.5rem 0.8rem">75</td><td style="padding:0.5rem 0.8rem">9</td><td style="padding:0.5rem 0.8rem">0.300</td><td style="padding:0.5rem 0.8rem">23</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem">[80, 90)</td><td style="padding:0.5rem 0.8rem">85</td><td style="padding:0.5rem 0.8rem">5</td><td style="padding:0.5rem 0.8rem">0.167</td><td style="padding:0.5rem 0.8rem">28</td></tr>
<tr><td style="padding:0.5rem 0.8rem">[90, 100)</td><td style="padding:0.5rem 0.8rem">95</td><td style="padding:0.5rem 0.8rem">2</td><td style="padding:0.5rem 0.8rem">0.067</td><td style="padding:0.5rem 0.8rem">30</td></tr>
</tbody></table>
</div>

<div class="l-note"><strong>Tablonun bir satırı histogramın bir çubuğudur.</strong> Tablo veridir; histogram aynı verinin çizilmiş halidir. Tabloyu kurabiliyorsan resmi de kurabilirsin — öğrenilecek fazladan bir şey yok.</div>

<h2 class="lesson-title">3. Kaç Sınıf? Sturges Kuralı</h2>

<div class="calc-highlight"><strong>Çok az sınıf şekli gizler; çok fazla sınıf veriyi gürültüye böler.</strong> Sturges'a (1926) ait standart bir pratik kural, sınıf sayısını yalnızca örneklem büyüklüğü $n$'den seçer; verinin kendisini görmezden gelir.</div>

<div class="calc-formula"><div class="formula-label">STURGES KURALI</div><div class="formula-main">$$k \\;\\approx\\; 1 + \\log_2(n) \\;\\approx\\; 1 + 3.322 \\, \\log_{10}(n)$$</div><div class="formula-sub">$k$ önerilen sınıf sayısıdır. En yakın tam sayıya yuvarla. $30 \\leq n \\leq 200$ aralığında iyi çalışır; daha büyük örneklemler için Scott ya da Freedman&ndash;Diaconis gibi rafine kurallar düşünülebilir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — STURGES'U VERİMİZE UYGULA</div><div class="example-body">$n = 30$ öğrenci. Sturges: $k = 1 + \\log_2(30) = 1 + 4.91 \\approx \\mathbf{5.9}$, 6'ya yuvarla.<br><br>Kullandığımız seçim tam olarak budur. 100 veri noktasıyla $k = 1 + \\log_2(100) \\approx 7.6$, yani 8 sınıf. 1000 nokta ile $k \\approx 11$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çok az sınıf (örn. $k=2$)</div><div class="card-body">Histogram kaba bir "düşük" ve "yüksek" çubuk çiftine dönüşür. Şekil hakkındaki tüm ayrıntıyı kaybedersin, çarpıklığı ya da iki modluluğu kaçırırsın.</div></div>
<div class="calc-card"><div class="card-title">Çok fazla sınıf (örn. $n=30$ için $k=20$)</div><div class="card-body">Çoğu sınıfta sıfır ya da bir veri noktası vardır. Çubuklar rastgele sallanır, sen de şekil yerine gürültü görürsün.</div></div>
<div class="calc-card"><div class="card-title">Sturges'un altın noktası</div><div class="card-body">$1 + \\log_2 n$ civarında sınıf. Şekil görünür ama her çubukta hâlâ kararlı olacak kadar sayım vardır.</div></div>
</div>

<h2 class="lesson-title">4. Frekans, Göreli Frekans, Birikimli Frekans</h2>

<div class="calc-highlight"><strong>Üç sayım, aynı tabloya üç farklı bakış.</strong> Frekans "bu sınıfta kaç tane?" sorusuna, göreli frekans "bu sınıfta hangi oran?" sorusuna, birikimli frekans ise "bu sınıfa kadar dahil kaç tane?" sorusuna yanıt verir. Her biri, bir önceki sütun üzerinde basit bir aritmetik işlemden ibarettir.</div>

<div class="calc-formula"><div class="formula-label">ÜÇ FREKANS ÖLÇÜSÜ</div><div class="formula-main">$$f_i \\;=\\; i \\text{ sinifindaki sayim}, \\qquad \\text{gor} = \\frac{f_i}{n}, \\qquad F_i = f_1 + f_2 + \\cdots + f_i$$</div><div class="formula-sub">Göreli frekanslar 1'e toplanır; son birikimli frekans $F_k$ ise $n$'e eşittir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — TABLOYU OKU</div><div class="example-body">Sınav tablomuzdan:<br><br>&bull; Kaç öğrenci 70 ile 79 arasında not aldı? <strong>9 öğrenci</strong> ($[70, 80)$ frekansı).<br>&bull; Sınıfın hangi oranı bu aralıkta not aldı? $9/30 = \\mathbf{0.30}$ ya da %30 (göreli frekans).<br>&bull; 80'in altında kaç öğrenci not aldı? <strong>23 öğrenci</strong> ($[70, 80)$'deki birikimli frekans).<br>&bull; Hangi oran başarısız oldu (60'ın altı)? $6/30 = \\mathbf{0.20}$, yani %20 (birikimli göreli frekans).</div></div>

<div class="l-note"><strong>Hangisi ne zaman.</strong> Ham sayım için frekans ("bu aralıkta 9 öğrenci"). Farklı büyüklükteki iki veri setini karşılaştırırken göreli frekans ("A sınıfının %30'u, B sınıfının %25'i 70&ndash;79 aldı"). "Bir eşiğe kadar kaç tane" sorularında birikimli frekans ("geçme notu 60'ın altında kaç tane?").</div>

<h2 class="lesson-title">5. Histogram</h2>

<div class="calc-highlight"><strong>Histogram, her sınıf için bir çubuk çizer ve çubuğun yüksekliği o sınıfın frekansına eşittir.</strong> Çok önemli olan şey: çubuklar <em>birbirine değer</em> — boşluk yoktur çünkü sınıfların kendisi sayı doğrusu üzerinde süreklidir. Histogram ile çubuk grafik arasındaki tek en önemli görsel fark budur.</div>

<p class="l-text">Aşağıda 30 sınav notumuzun histogramı var. Doğrudan oku: şekil 41&ndash;49'dan yükselir (yalnızca 2 öğrenci), 70&ndash;79'da tepe yapar (modal sınıf, 9 öğrenci) ve 90&ndash;99'a doğru azalır (2 öğrenci). Sınıfın çoğu 60&ndash;79 bandında not aldı; dağılım yaklaşık simetrik, hafif sola yatık.</p>

<div class="calc-graph"><div id="plot-l104-hist-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 30 sınav notunun, genişliği 10 olan altı sınıfa bölünmüş frekans histogramı. En yüksek çubuk (modal sınıf) $[70, 80)$ ve 9 öğrenciye sahip. Sınıflar sürekli olduğu için çubuklar birbirine değer; x-ekseni bir kategori listesi değil, sayı doğrusudur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var classes=['40-49','50-59','60-69','70-79','80-89','90-99'];
var freqs=[2,4,8,9,5,2];
var bars={x:classes,y:freqs,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1.2}},text:freqs.map(function(v){return v.toString();}),textposition:'outside',textfont:{color:'#e8e8e8',size:12},name:'frekans'};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'sınav notu (sınıf)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'frekans (öğrenci sayısı)',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',range:[0,11]},margin:{t:30,r:30,b:60,l:60},bargap:0.02,showlegend:false};
Plotly.newPlot('plot-l104-hist-tr',[bars],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">6. Histogram ve Çubuk Grafik</h2>

<div class="calc-highlight"><strong>Çubuk grafikler ve histogramlar benzer görünür ama farklı şeyleri kodlar.</strong> Çubuk grafik <em>kategorik</em> veriyi temsil eder (sevilen renk, kan grubu, ülke) — kategoriler bağımsız etiketler olduğu ve sıraları olmadığı için çubuklar arasında boşluk vardır. Histogram <em>sürekli sayısal</em> veriyi temsil eder — komşu sınıflar sayı doğrusunda bir sınırı paylaştığı için çubuklar birbirine değer.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ÇUBUK GRAFİK</div><div class="compare-item">Veri tipi: kategorik (etiketler)</div><div class="compare-item">Çubuklar arasında <strong>boşluk</strong> vardır</div><div class="compare-item">Çubukların sırası keyfidir (yeniden düzenleyebilirsin)</div><div class="compare-item">Örnek: sevilen spor dalına göre öğrenci sayısı</div></div><div class="compare-col"><div class="compare-title">HİSTOGRAM</div><div class="compare-item">Veri tipi: sürekli (doğru üzerinde sayılar)</div><div class="compare-item">Çubuklar <strong>birbirine değer</strong></div><div class="compare-item">Çubukların sırası sabittir (sayı doğrusu)</div><div class="compare-item">Örnek: aralıklara gruplanmış sınav notları</div></div></div>

<div class="l-note"><strong>Hızlı test.</strong> İki çubuğu okuyucuyu yanıltmadan yer değiştirebilir misin? Eğer evet ise ("futbol" ile "tenis" yer değiştirebilir), bu çubuk grafiktir. Eğer yer değiştirme mesajı bozarsa (60&ndash;69'u 50&ndash;59'dan önce koyamazsın), bu histogramdır.</div>

<h2 class="lesson-title">7. Şekil Tanımlayıcıları</h2>

<div class="calc-highlight"><strong>Histogramı çizdikten sonra bir sonraki soru: bu hangi şekil?</strong> Lise düzeyinde karşılaşacağın hemen her şeyi kapsayan dört kanonik desen vardır: simetrik (çan biçimli), sağa çarpık, sola çarpık ve düzgün. İki modlu dağılımlar (iki tepeli) beşinci önemli durumdur ve çoğu zaman iki farklı alt popülasyonun karışmış olduğunun işaretidir.</div>

<div style="overflow-x:auto;margin:1.2rem 0">
<table style="width:100%;border-collapse:collapse;font-size:0.92rem">
<thead><tr style="background:rgba(59,130,246,0.1);border-bottom:2px solid rgba(59,130,246,0.4)">
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Şekil</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Görsel ipucu</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Ortalama vs medyan</th>
<th style="padding:0.6rem 0.8rem;text-align:left;color:#3b82f6">Gerçek dünya örneği</th>
</tr></thead>
<tbody style="color:rgba(235,230,220,0.88)">
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Simetrik</strong></td><td style="padding:0.5rem 0.8rem">Tepe etrafında ayna görüntüsü</td><td style="padding:0.5rem 0.8rem">ortalama &asymp; medyan</td><td style="padding:0.5rem 0.8rem">Yetişkin boyları, IQ skoru</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Sağa çarpık</strong></td><td style="padding:0.5rem 0.8rem">Sağda uzun kuyruk</td><td style="padding:0.5rem 0.8rem">ortalama &gt; medyan</td><td style="padding:0.5rem 0.8rem">Maaşlar, ev fiyatları</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Sola çarpık</strong></td><td style="padding:0.5rem 0.8rem">Solda uzun kuyruk</td><td style="padding:0.5rem 0.8rem">ortalama &lt; medyan</td><td style="padding:0.5rem 0.8rem">Emeklilik yaşı, kolay sınavlar</td></tr>
<tr style="border-bottom:1px solid rgba(255,255,255,0.05)"><td style="padding:0.5rem 0.8rem"><strong>Düzgün</strong></td><td style="padding:0.5rem 0.8rem">Tüm çubuklar yaklaşık eşit</td><td style="padding:0.5rem 0.8rem">ortalama = orta nokta = medyan</td><td style="padding:0.5rem 0.8rem">Telefon numarasının son hanesi, zar atışları</td></tr>
<tr><td style="padding:0.5rem 0.8rem"><strong>İki modlu</strong></td><td style="padding:0.5rem 0.8rem">Arasında çukur olan iki belirgin tepe</td><td style="padding:0.5rem 0.8rem">ortalama tepeler arasında</td><td style="padding:0.5rem 0.8rem">Erkek+kadın boylarının karışımı, bazılarının çalıştığı bazılarının çalışmadığı sınav</td></tr>
</tbody></table>
</div>

<div class="calc-graph"><div id="plot-l104-shapes-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> sağa çarpık, simetrik (çan biçimli) ve sola çarpık dağılımları gösteren yan yana üç histogram. Uzun kuyruğun nasıl hareket ettiğine dikkat et: sağa çarpık olduğunda sağa, sola çarpık olduğunda sola. Simetrik durum kanonik çan şeklidir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var binsRight=['1','2','3','4','5','6','7','8','9','10'];
var freqRight=[28,22,17,12,8,5,3,2,2,1];
var binsSym=['1','2','3','4','5','6','7','8','9','10'];
var freqSym=[2,5,10,17,22,22,17,10,5,2];
var binsLeft=['1','2','3','4','5','6','7','8','9','10'];
var freqLeft=[1,2,2,3,5,8,12,17,22,28];
var bR={x:binsRight,y:freqRight,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'sağa çarpık',xaxis:'x',yaxis:'y'};
var bS={x:binsSym,y:freqSym,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'simetrik',xaxis:'x2',yaxis:'y2'};
var bL={x:binsLeft,y:freqLeft,type:'bar',marker:{color:'#3b82f6',line:{color:'#1d4ed8',width:1}},name:'sola çarpık',xaxis:'x3',yaxis:'y3'};
var annot=[{text:'<b>sağa çarpık</b>',x:0.16,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}},{text:'<b>simetrik</b>',x:0.50,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}},{text:'<b>sola çarpık</b>',x:0.84,y:1.04,xref:'paper',yref:'paper',showarrow:false,font:{color:'#e8e8e8',size:12}}];
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'sınıf',domain:[0,0.31],gridcolor:'rgba(255,255,255,0.06)'},yaxis:{title:'frekans',domain:[0,1],gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},xaxis2:{title:'sınıf',domain:[0.35,0.65],gridcolor:'rgba(255,255,255,0.06)'},yaxis2:{title:'',domain:[0,1],anchor:'x2',gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},xaxis3:{title:'sınıf',domain:[0.69,1],gridcolor:'rgba(255,255,255,0.06)'},yaxis3:{title:'',domain:[0,1],anchor:'x3',gridcolor:'rgba(255,255,255,0.06)',range:[0,30]},margin:{t:50,r:20,b:60,l:60},bargap:0.02,showlegend:false,annotations:annot};
Plotly.newPlot('plot-l104-shapes-tr',[bR,bS,bL],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Birikimli Frekans ve Ogive</h2>

<div class="calc-highlight"><strong>Ogive ("oh-jiv" diye okunur), birikimli frekans eğrisidir.</strong> Üst sınıf sınırlarını x-eksenine, birikimli frekansı y-eksenine koy ve noktaları doğru parçalarıyla birleştir. Eğri her zaman 0'dan başlar ve $n$'de biter. Monoton olarak azalmayan bir eğridir — yani asla aşağı inmez.</div>

<p class="l-text"><strong>Ne işe yarar?</strong> Çünkü ogive sayesinde yatay bir çizgi çizip eğriyi nerede kestiğine bakarak istediğin <em>yüzdeliği</em> okuyabilirsin. Medyan 50. yüzdeliktir: $y = n/2$'de yatay bir çizgi çiz ve ogive ile kesiştiği x değerini oku. Birinci çeyrek ($Q_1$) $y = n/4$'te, üçüncü çeyrek $y = 3n/4$'te. İstediğin herhangi bir yüzdeliği ogive sana verir.</p>

<div class="calc-formula"><div class="formula-label">OGIVE'DEN MEDYAN — DOĞRUSAL ENTERPOLASYON</div><div class="formula-main">$$\\text{medyan} \\;\\approx\\; L \\;+\\; \\frac{n/2 - F}{f} \\cdot w$$</div><div class="formula-sub">$L$ = medyan sınıfının alt sınırı, $F$ = medyan sınıfından hemen önceki birikimli frekans, $f$ = medyan sınıfının frekansı, $w$ = sınıf genişliği. Her sınıfta verinin düzgün dağıldığını varsayar (doğrusal enterpolasyon).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — OGIVE'DEN MEDYAN</div><div class="example-body">Sınav notlarımız için $n/2 = 15$. Birikimli sütundan: 14 öğrenci 70'in altında, 23 öğrenci 80'in altında not aldı. Yani 15. öğrenci $[70, 80)$ sınıfındadır — bu <strong>medyan sınıfı</strong>dır.<br><br>Doğrusal enterpolasyon: $L = 70$, $F = 14$ (hemen önceki birikimli), $f = 9$ (medyan sınıfının frekansı), $w = 10$ (sınıf genişliği).<br><br>$\\text{medyan} \\approx 70 + \\dfrac{15 - 14}{9} \\cdot 10 = 70 + \\dfrac{10}{9} \\approx \\mathbf{71.1}$.<br><br>Karşılaştırma için ham verinin tam medyanı (sıralandığında 15. ve 16. değer: 70 ve 71) $(70+71)/2 = 70.5$. Gruplanmış tahminimiz 71.1, yaklaşık yarım puan içinde — yakın.</div></div>

<div class="calc-graph"><div id="plot-l104-ogive-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 30 sınav notu için ogive (birikimli frekans eğrisi). $y = 15$'teki kesikli kırmızı yatay çizgi medyan seviyesini gösterir; eğriyi $x \\approx 71.1$'de keser, bu da doğrusal enterpolasyonla medyan tahminimizdir. Eğri 0'da başlar ve 30'da biter, monoton olarak yükselir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[40,50,60,70,80,90,100];
var cum=[0,2,6,14,23,28,30];
var ogive={x:xs,y:cum,mode:'lines+markers',name:'ogive',line:{color:'#3b82f6',width:2.5},marker:{color:'#3b82f6',size:8}};
var medLine={x:[40,71.1],y:[15,15],mode:'lines',line:{color:'#ef4444',width:2,dash:'dash'},name:'medyan seviyesi (n/2 = 15)'};
var medDrop={x:[71.1,71.1],y:[15,0],mode:'lines',line:{color:'#ef4444',width:2,dash:'dash'},name:'medyan &asymp; 71.1',showlegend:false};
var medMark={x:[71.1],y:[15],mode:'markers+text',marker:{color:'#ef4444',size:10,symbol:'x'},text:['medyan &asymp; 71.1'],textposition:'top right',textfont:{color:'#ef4444',size:11},name:'medyan noktası',showlegend:false};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'sınav notu (üst sınıf sınırı)',range:[38,102],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},yaxis:{title:'birikimli frekans',range:[0,32],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:60,l:60},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5,font:{size:11}}};
Plotly.newPlot('plot-l104-ogive-tr',[ogive,medLine,medDrop,medMark],layout,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">9. Gruplanmış Veriden Ortalamayı Tahmin Etmek</h2>

<div class="calc-highlight"><strong>Ham veri atılıp yalnızca frekans tablosu kaldığında tam ortalamayı hesaplayamazsın.</strong> Ama her sınıftaki her gözlemi sanki o sınıfın <em>orta noktasında</em> oturuyormuş gibi ele alarak tahmin edebilirsin. Tahmin her aralığın merkezine doğru yanlıdır, ama makul derecede dar sınıflar için bu yanlılık küçüktür.</div>

<div class="calc-formula"><div class="formula-label">GRUPLANMIŞ VERİDEN ORTALAMA</div><div class="formula-main">$$\\bar{x} \\;\\approx\\; \\frac{\\sum_{i=1}^{k} f_i \\, m_i}{\\sum_{i=1}^{k} f_i} \\;=\\; \\frac{\\sum f_i m_i}{n}$$</div><div class="formula-sub">$f_i$ = $i$ sınıfının frekansı, $m_i$ = $i$ sınıfının orta noktası, $n = \\sum f_i$ = toplam örneklem büyüklüğü.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — SINAV NOTLARIMIZIN ORTALAMASINI TAHMİN ET</div><div class="example-body">Tablodan: $[40,50), \\ldots, [90,100)$ sınıfları, orta noktalar $45, 55, 65, 75, 85, 95$ ve frekanslar $2, 4, 8, 9, 5, 2$.<br><br>$\\sum f_i m_i = 2 \\cdot 45 + 4 \\cdot 55 + 8 \\cdot 65 + 9 \\cdot 75 + 5 \\cdot 85 + 2 \\cdot 95 = 90 + 220 + 520 + 675 + 425 + 190 = 2120$.<br><br>$\\bar{x} \\approx 2120 / 30 \\approx \\mathbf{70.7}$.<br><br>30 ham notun tam ortalaması (hepsini topla) 2107 / 30 &approx; 70.2. Gruplanmış tahminimiz 70.7, yarım puan içinde — orta nokta varsayımı işini yapıyor.</div></div>

<div class="l-note"><strong>Niye orta nokta?</strong> Bir sınıftaki veri kabaca düzgün yayılmışsa, o değerlerin ortalaması aralığın orta noktasıdır. Orta nokta, bir değerin yalnızca iki sınır arasında olduğunu bildiğinde tarafsız "en iyi tahmin"dir.</div>

<h2 class="lesson-title">10. Eşit Olmayan Sınıf Genişlikleri: Frekans Yerine Yoğunluk</h2>

<div class="calc-highlight"><strong>Eğer sınıfların tümü aynı genişlikte değilse, y-ekseninde frekansı çizmek resmi bozar.</strong> Daha geniş bir sınıf, altındaki yoğunluk daha yüksek olduğu için değil, sayı doğrusunun daha fazlasını kapladığı için daha fazla veri içerir. Çözüm <em>frekans yoğunluğunu</em> çizmektir: frekansı sınıf genişliğine böl.</div>

<div class="calc-formula"><div class="formula-label">FREKANS YOĞUNLUĞU</div><div class="formula-main">$$\\text{yogunluk}_i \\;=\\; \\frac{f_i}{w_i}$$</div><div class="formula-sub">Sınıflar eşit genişlikte olduğunda yoğunluk ve frekans orantılıdır, dolayısıyla ikisi de çizilebilir. Genişlikler farklı olduğunda yalnızca yoğunluk grafiği dürüsttür.</div></div>

<div class="calc-example"><div class="example-label">HIZLI ÖRNEK</div><div class="example-body">Yaşların $[0, 5)$, $[5, 18)$, $[18, 65)$, $[65, 100)$ olarak gruplandığını ve frekansların 10, 20, 50, 15 olduğunu düşün. Sınıf genişlikleri 5, 13, 47, 35. Yoğunluklar $10/5 = 2.0$, $20/13 \\approx 1.54$, $50/47 \\approx 1.06$, $15/35 \\approx 0.43$.<br><br>Frekans, 18&ndash;65 sınıfının baskın olduğunu (50 kişi) öneriyor. Yoğunluk daha doğru hikâyeyi anlatıyor: yıl başına 0&ndash;5 grubu en yüksek yoğunluğa (yılda 2 kişi), 65+ grubu en düşüğüne (yılda 0.43) sahip.</div></div>

<h2 class="lesson-title">11. Sık Yapılan Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Belirsiz sınıf sınırları</div><div class="card-body">Sınıfları "40&ndash;50, 50&ndash;60, &hellip;" diye yazmak belirsizdir: tam 50 hangi sınıfa girer? Yarı-açık gösterim kullan $[40, 50)$, $[50, 60)$ &mdash; sol sınır dahil, sağ sınır hariç &mdash; böylece her değer tam olarak bir sınıfa ait olur.</div></div>
<div class="calc-card"><div class="card-title">Eşit olmayan genişliklerin frekans olarak çizilmesi</div><div class="card-body">Bir sınıf diğerlerinin iki katı genişse, birim başına yoğunluğu normal olsa bile çubuğu "çok yüksek" görünür. Eşit olmayan genişliklerde frekans yoğunluğunu kullan.</div></div>
<div class="calc-card"><div class="card-title">Histogramı çubuk grafik gibi çizmek</div><div class="card-body">Çubuklar arasına boşluk koymak kategorik veri ima eder ve altta yatan değişkenin sürekliliğini gizler. Histogram çubukları birbirine değer.</div></div>
<div class="calc-card"><div class="card-title">Çok az ya da çok fazla sınıf</div><div class="card-body">Her iki uç da şekli yok eder. Başlangıç noktası olarak Sturges kuralını kullan ve resim çentikli ya da özelliksiz görünüyorsa ayarla.</div></div>
<div class="calc-card"><div class="card-title">Ogive'yi yanlış okumak</div><div class="card-body">Ogive birikimli frekansı sınıfın orta noktasına değil, <em>üst</em> sınırına karşı çizer. Yanlış x değerinin okunması yanlış yüzdeliği verir.</div></div>
<div class="calc-card"><div class="card-title">Gruplanmış tahminleri kesin gibi vermek</div><div class="card-body">Gruplanmış veriden hesaplanan ortalama ve medyan <em>tahminlerdir</em>, yaklaşık olarak yarım sınıf genişliği içinde doğrudur. Onları kesin değerler olarak değil, yaklaşık değerler olarak ver.</div></div>
</div>

<h2 class="lesson-title">12. Çözümlü Uygulama Problemleri</h2>

<p class="l-text">Dersi pekiştirmek için altı alıştırma. Çözümleri okumadan önce her birini kendin çöz.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; FREKANS TABLOSU KUR</div><div class="example-body"><strong>Yirmi öğrencinin boyları (cm): 152, 158, 160, 164, 166, 167, 168, 170, 170, 172, 173, 174, 175, 176, 178, 179, 180, 182, 184, 188. 4 sınıflı frekans tablosu kur.</strong><br><br>Açıklık = $188 - 152 = 36$. Genişlik $= 36/4 = 9 \\rightarrow$ 10'a yuvarla. Sınıflar: $[150, 160)$, $[160, 170)$, $[170, 180)$, $[180, 190)$.<br>Sayımlar: 2, 5, 9, 4. Toplam 20. Doğrula!</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; $n = 64$ İÇİN STURGES</div><div class="example-body"><strong>Sturges kuralı 64 gözlemli bir örneklem için kaç sınıf önerir?</strong><br><br>$k = 1 + \\log_2(64) = 1 + 6 = \\mathbf{7}$ sınıf.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; GÖRELİ FREKANS</div><div class="example-body"><strong>25 öğrencilik bir sınıf haftalık çalışma saatlerini kaydetti. $[6, 9)$ sınıfının frekansı 8. Göreli frekans nedir?</strong><br><br>Göreli frekans $= 8/25 = 0.32$, yani sınıfın <strong>%32'si</strong> haftada 6 ile 9 saat arasında çalışıyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; GRUPLANMIŞ VERİDEN ORTALAMA TAHMİN ET</div><div class="example-body"><strong>Frekans tablosu: $[0, 10)$ sınıfında 5 değer, $[10, 20)$'da 12, $[20, 30)$'da 8, $[30, 40)$'da 5. Ortalamayı tahmin et.</strong><br><br>Orta noktalar: 5, 15, 25, 35. $\\sum f_i m_i = 5 \\cdot 5 + 12 \\cdot 15 + 8 \\cdot 25 + 5 \\cdot 35 = 25 + 180 + 200 + 175 = 580$. $n = 30$.<br>$\\bar{x} \\approx 580 / 30 \\approx \\mathbf{19.3}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 &mdash; OGIVE'DEN MEDYAN</div><div class="example-body"><strong>40 öğrencinin notları için birikimli frekanslar: üst sınırlar 50, 60, 70, 80, 90'da birikimli değerler 4, 12, 25, 35, 40. Medyanı tahmin et.</strong><br><br>$n/2 = 20$. Medyan sınıfı, birikimli değerin ilk kez 20'ye ulaştığı ya da geçtiği sınıftır: bu $[60, 70)$ sınıfıdır (birikimli 12'den 25'e atlıyor).<br>$L = 60$, $F = 12$, $f = 25 - 12 = 13$, $w = 10$.<br>$\\text{medyan} \\approx 60 + \\dfrac{20 - 12}{13} \\cdot 10 = 60 + \\dfrac{80}{13} \\approx \\mathbf{66.2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; ŞEKİL TANIMLAMA</div><div class="example-body"><strong>Her senaryoyu olası bir dağılım şekliyle eşleştir: (a) bir şehirdeki hane gelirleri, (b) 17 yaşındakilerin boyları, (c) kimlik numaralarının son hanesi, (d) emeklilik yaşı.</strong><br><br>(a) Sağa çarpık &mdash; çok yüksek gelirlerin uzun kuyruğu ortalamayı medyanın üzerine çeker.<br>(b) Simetrik (yaklaşık çan biçimli) &mdash; biyoloji kabaca normal bir yayılım üretir.<br>(c) Düzgün &mdash; 0&ndash;9 haneleri yaklaşık olarak eşit görünür.<br>(d) Sola çarpık &mdash; çoğu insan yasal yaşa yakın emekli olur, birkaçı çok daha erken, neredeyse kimse çok daha geç emekli olmaz.</div></div>

<h2 class="lesson-title">13. İleriye Bakış</h2>

<p class="l-text">Histogram sana bir veri setinin şeklini tek bir resimde verir. Bir sonraki ders bu şekli kullanarak yeni bir ölçü tanımlar &mdash; <em>standart sapma</em> &mdash; ki bu histogramın ne kadar geniş olduğunu sayısallaştırır. Ders 102'de tanıştığın ortalama ve medyanla birlikte, standart sapma herhangi bir veri setini iki sayıyla özetlemek için ihtiyacın olan araç kutusunu tamamlar: <em>merkez nerede?</em> ve <em>o merkez etrafında ne kadar yayılmış?</em> Histogramlar bu özetlerin görsel arkadaşı olmaya devam eder: tek bir sayı, onu üreten resim kadar ikna edici asla olmaz.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Ham veri $\\rightarrow$ frekans tablosu $\\rightarrow$ histogram standart özetleme süreci budur</li>
<li>Sınıf sayısını Sturges kuralı $k \\approx 1 + \\log_2(n)$ ile seç; en yakın tam sayıya yuvarla</li>
<li>Frekans = sayım, göreli frekans = oran, birikimli frekans = koşan toplam &mdash; aynı tabloya üç bakış</li>
<li>Histogram çubukları <em>birbirine değer</em> (sürekli sınıflar); çubuk grafiklerinin arasında boşluk vardır (kategorik etiketler)</li>
<li>Dört standart şekil: simetrik, sağa çarpık, sola çarpık, düzgün; iki modlu çoğu zaman iki alt popülasyonun işaretidir</li>
<li>Ogive (birikimli frekans eğrisi) yatay enterpolasyonla medyanı ve istediğin yüzdeliği verir</li>
<li>Sınıf orta noktalarını kullanarak gruplanmış veriden ortalamayı $\\sum f_i m_i / n$ olarak tahmin et</li>
<li>Eşit olmayan sınıf genişliklerinde y-ekseninde ham frekansı değil, <em>frekans yoğunluğunu</em> ($f/w$) kullan</li>
</ul>
</div>`
};
