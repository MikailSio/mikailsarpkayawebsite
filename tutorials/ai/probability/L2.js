var MATH_L2 = {

en: '<p class="l-text"><strong>Statistics is the science of learning from data.</strong> Before any machine learning model can make predictions, we must first understand what our data looks like, how features relate to each other, and what patterns the numbers reveal. Every ML pipeline starts with statistics — from exploratory data analysis to model evaluation, from feature engineering to A/B testing. Master statistics, and you hold the key to understanding <em>why</em> ML works, not just <em>how</em>.</p>'

+ '<p class="l-text">This lesson takes you from the very basics — descriptive measures like mean and variance — all the way to probability distributions, maximum likelihood estimation, and hypothesis testing. Every formula explained, every concept connected to real ML/NLP applications.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU’LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Tell descriptive from inferential statistics with concrete ML examples</li>'
+ '<li>Compute mean, median, mode, variance, and IQR with NumPy on a dataset</li>'
+ '<li>Visualize distributions and read skew, kurtosis, and outliers from a histogram</li>'
+ '<li>Apply the Central Limit Theorem to justify the normal approximation</li>'
+ '<li>Build a confidence interval for a sample mean and report it correctly</li>'
+ '<li>Run a t-test and a chi-square test and interpret the resulting p-value</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Descriptive vs Inferential Statistics
   ============================================================ */
+ '<h2 class="l-title">1. Descriptive vs Inferential Statistics</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> Imagine measuring the heights of 30 students in your class and computing the average. That\'s <em>descriptive</em> statistics — summarizing what you see. Now imagine using those 30 heights to estimate the average height of <em>all</em> university students in the country. That\'s <em>inferential</em> statistics — making predictions about a larger group from a smaller sample.</div>'

+ '<p class="l-text">Statistics has two fundamental branches, and understanding the distinction is critical for ML:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">DESCRIPTIVE STATISTICS</div><div class="compare-item">&bull; <strong>Summarizes</strong> data you already have</div><div class="compare-item">&bull; Deals with the entire dataset</div><div class="compare-item">&bull; Tools: mean, median, histograms, std dev</div><div class="compare-item">&bull; "What does my data look like?"</div><div class="compare-item">&bull; ML: feature exploration, EDA</div></div><div class="compare-col"><div class="compare-title">INFERENTIAL STATISTICS</div><div class="compare-item">&bull; <strong>Predicts</strong> beyond your data</div><div class="compare-item">&bull; Uses a sample to infer about a population</div><div class="compare-item">&bull; Tools: hypothesis tests, confidence intervals</div><div class="compare-item">&bull; "What can I conclude about the world?"</div><div class="compare-item">&bull; ML: generalization, model evaluation</div></div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Population</div><div class="card-body">The <strong>entire</strong> group you care about. "All emails ever sent" or "all possible images." Usually too large to observe completely.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sample</div><div class="card-body">A <strong>subset</strong> of the population that you actually collect. Your training set is a sample from the true data distribution.</div></div>'
+ '<div class="calc-card"><div class="card-title">Parameters</div><div class="card-body">True values of the population (mean &mu;, std &sigma;). Usually <strong>unknown</strong> — we try to estimate them from data.</div></div>'
+ '<div class="calc-card"><div class="card-title">Statistics</div><div class="card-body">Values computed from a sample (sample mean x&#772;, sample std s). These are <strong>estimates</strong> of the true parameters.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">POPULATION vs SAMPLE NOTATION</div><div class="formula-main">$$\\text{Population mean: } \\mu = \\frac{1}{N}\\sum_{i=1}^{N} x_i \\qquad \\text{Sample mean: } \\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$</div><div class="formula-sub">Same formula, different scope. Population uses N (all data), sample uses n (subset). Greek letters for population, Latin for sample.</div></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Your training set is a <em>sample</em> from the true data distribution. The goal of ML is <strong>inference</strong> — using this sample to learn patterns that <strong>generalize</strong> to unseen data (the population). Overfitting happens when your model memorizes the sample instead of learning the population pattern.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Population: all 10,000 customer ages</span>\npopulation = np.random.<span class="fn">normal</span>(loc=<span class="num">35</span>, scale=<span class="num">10</span>, size=<span class="num">10000</span>)\n\n<span class="cm"># Sample: randomly pick 100</span>\nsample = np.random.<span class="fn">choice</span>(population, size=<span class="num">100</span>, replace=<span class="num">False</span>)\n\n<span class="cm"># Population parameter vs sample statistic</span>\n<span class="fn">print</span>(<span class="str">f"Population mean (mu):  {population.mean():.2f}"</span>)  <span class="cm"># ~35.0</span>\n<span class="fn">print</span>(<span class="str">f"Sample mean (x-bar):   {sample.mean():.2f}"</span>)      <span class="cm"># ~35 (close!)</span>\n<span class="fn">print</span>(<span class="str">f"Population std (sigma): {population.std():.2f}"</span>)  <span class="cm"># ~10.0</span>\n<span class="fn">print</span>(<span class="str">f"Sample std (s):        {sample.std(ddof=1):.2f}"</span>) <span class="cm"># ~10 (ddof=1 for unbiased)</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why do we use <code>ddof=1</code> (dividing by n-1 instead of n) for the sample standard deviation? Because dividing by n systematically <em>underestimates</em> the true population variance. Dividing by n-1 corrects this bias — it\'s called <strong>Bessel\'s correction</strong>. With large n, the difference is negligible.</div></div>'

/* ============================================================
   SECTION 2: Measures of Central Tendency
   ============================================================ */
+ '<h2 class="l-title">2. Measures of Central Tendency</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> If someone asks "what\'s a typical salary at this company?", you could answer three ways: the average salary (mean), the middle salary when ranked (median), or the most common salary (mode). Each tells a different story — and choosing the wrong one can be very misleading.</div>'

+ '<p class="l-text">Central tendency measures describe the <strong>"center"</strong> of a dataset — where most values cluster. The three main measures are:</p>'

+ '<div class="calc-formula"><div class="formula-label">MEAN (AVERAGE)</div><div class="formula-main">$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\cdots + x_n}{n}$$</div><div class="formula-sub">Sum all values and divide by the count. Sensitive to outliers — one billionaire skews the average salary.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MEDIAN</div><div class="formula-main">$$\\tilde{x} = \\begin{cases} x_{(n+1)/2} & \\text{if n is odd} \\\\ \\frac{x_{n/2} + x_{n/2+1}}{2} & \\text{if n is even} \\end{cases}$$</div><div class="formula-sub">The middle value when data is sorted. Robust to outliers — unaffected by extreme values.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MODE</div><div class="formula-main">$$\\text{Mode} = \\text{most frequently occurring value}$$</div><div class="formula-sub">The value that appears most often. Can have multiple modes (bimodal, multimodal) or no mode at all.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Mean</div><div class="card-body"><strong>Best for:</strong> symmetric data without outliers. Uses all data points. Minimizes squared errors.</div></div>'
+ '<div class="calc-card"><div class="card-title">Median</div><div class="card-body"><strong>Best for:</strong> skewed data or data with outliers. Robust. Minimizes absolute errors.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mode</div><div class="card-body"><strong>Best for:</strong> categorical data (most popular category). The only measure usable for non-numeric data.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Salaries:</strong> [30k, 35k, 40k, 42k, 45k, 50k, 55k, 1000k]<br><br><strong>Mean:</strong> (30+35+40+42+45+50+55+1000)/8 = 1297/8 = <strong>162.1k</strong> &larr; misleading!<br><strong>Median:</strong> sort and take middle two: (42+45)/2 = <strong>43.5k</strong> &larr; representative<br><strong>Mode:</strong> no repeated values, so <strong>no mode</strong><br><br>The mean is dragged up by the CEO\'s salary. The median tells the true story of "typical" salary. This is why median household income is reported instead of mean.</div></div>'

/* --- Plotly: Central Tendency --- */
+ '<div id="plot-central-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var data=[30,32,33,34,35,35,36,36,36,37,37,38,38,39,40,40,41,42,55,80];'
+ 'var mean=data.reduce(function(a,b){return a+b},0)/data.length;'
+ 'var sorted=data.slice().sort(function(a,b){return a-b});'
+ 'var median=(sorted[9]+sorted[10])/2;'
+ 'var t1={x:data,type:"histogram",marker:{color:"rgba(200,169,110,0.7)",line:{color:"#c8a96e",width:1}},nbinsx:15,name:"Data"};'
+ 'var layout={title:{text:"Distribution of Ages with Mean vs Median",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Value"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Count"},shapes:[{type:"line",x0:mean,x1:mean,y0:0,y1:1,yref:"paper",line:{color:"#f87171",width:2.5,dash:"dash"}},{type:"line",x0:median,x1:median,y0:0,y1:1,yref:"paper",line:{color:"#4ecdc4",width:2.5,dash:"dot"}}],annotations:[{x:mean,y:1,yref:"paper",text:"Mean="+mean.toFixed(1),showarrow:false,font:{color:"#f87171",size:12},yanchor:"bottom"},{x:median,y:0.9,yref:"paper",text:"Median="+median.toFixed(1),showarrow:false,font:{color:"#4ecdc4",size:12},yanchor:"bottom"}],margin:{t:50,r:30,b:50,l:50},showlegend:false};'
+ 'Plotly.newPlot("plot-central-en",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> A right-skewed dataset. The red dashed line is the mean (pulled right by outliers), while the teal dotted line is the median (stays near the bulk of data). When data is skewed, the median is more representative than the mean.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\ndata = np.<span class="fn">array</span>([<span class="num">30</span>, <span class="num">35</span>, <span class="num">40</span>, <span class="num">42</span>, <span class="num">45</span>, <span class="num">50</span>, <span class="num">55</span>, <span class="num">1000</span>])\n\n<span class="fn">print</span>(<span class="str">f"Mean:   {np.mean(data):.1f}"</span>)           <span class="cm"># 162.1</span>\n<span class="fn">print</span>(<span class="str">f"Median: {np.median(data):.1f}"</span>)         <span class="cm"># 43.5</span>\n<span class="fn">print</span>(<span class="str">f"Mode:   {stats.mode(data).mode}"</span>)       <span class="cm"># 30 (first value, all unique)</span>\n\n<span class="cm"># Weighted mean (useful for class-weighted losses)</span>\nweights = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0.1</span>])  <span class="cm"># downweight outlier</span>\nweighted_mean = np.<span class="fn">average</span>(data, weights=weights)\n<span class="fn">print</span>(<span class="str">f"Weighted mean: {weighted_mean:.1f}"</span>)      <span class="cm"># ~55.7</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Loss functions are deeply connected to central tendency. <strong>Mean Squared Error (MSE)</strong> minimization recovers the mean of the target distribution. <strong>Mean Absolute Error (MAE)</strong> minimization recovers the median. If your target has outliers, use MAE — it\'s more robust, just like the median.</div>'

/* ============================================================
   SECTION 3: Measures of Spread
   ============================================================ */
+ '<h2 class="l-title">3. Measures of Spread</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> Two classes have the same average test score of 70. But in class A, everyone scored between 65-75. In class B, scores ranged from 20 to 100. The <em>center</em> is the same, but the <em>spread</em> is wildly different. Spread measures tell you how much your data varies around the center.</div>'

+ '<p class="l-text">Knowing the center is not enough — we need to know <strong>how spread out</strong> the data is. Here are the key measures:</p>'

+ '<div class="calc-formula"><div class="formula-label">VARIANCE</div><div class="formula-main">$$\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2 \\qquad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$$</div><div class="formula-sub">Average of squared deviations from the mean. Left: population variance. Right: sample variance (Bessel\'s correction: n-1).</div></div>'

+ '<div class="calc-formula"><div class="formula-label">STANDARD DEVIATION</div><div class="formula-main">$$\\sigma = \\sqrt{\\sigma^2} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}$$</div><div class="formula-sub">Square root of variance. Same units as the original data — much more interpretable than variance.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Variance</div><div class="card-body">Average squared distance from the mean. Units are squared (e.g., cm&sup2;), making it hard to interpret directly.</div></div>'
+ '<div class="calc-card"><div class="card-title">Standard Deviation</div><div class="card-body">Square root of variance. Same units as data. "On average, data points are &sigma; away from the mean."</div></div>'
+ '<div class="calc-card"><div class="card-title">Range</div><div class="card-body">max - min. Simplest spread measure, but very sensitive to outliers. One extreme value ruins it.</div></div>'
+ '<div class="calc-card"><div class="card-title">Interquartile Range</div><div class="card-body">Q3 - Q1 (75th percentile minus 25th percentile). Robust to outliers. Measures spread of the middle 50%.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Compute the mean: x&#772; = (2+4+4+4+5+5+7+9)/8 = 5</div><div class="step-detail">Sum all values and divide by count</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Subtract the mean from each value: [-3, -1, -1, -1, 0, 0, 2, 4]</div><div class="step-detail">These are the deviations. Note they sum to zero!</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Square each deviation: [9, 1, 1, 1, 0, 0, 4, 16]</div><div class="step-detail">Squaring makes all values positive and penalizes large deviations more</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Average the squared deviations: variance = 32/8 = 4</div><div class="step-detail">For sample variance, divide by n-1 = 7 instead: 32/7 = 4.57</div></div></div>'
+ '<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Square root: &sigma; = &radic;4 = 2</div><div class="step-detail">Standard deviation = 2. On average, values deviate by 2 from the mean.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">INTERQUARTILE RANGE (IQR)</div><div class="formula-main">$$\\text{IQR} = Q_3 - Q_1$$</div><div class="formula-sub">Q1 = 25th percentile, Q3 = 75th percentile. Outliers are often defined as values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR.</div></div>'

/* --- Plotly: Spread Comparison --- */
+ '<div id="plot-spread-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var n=500;var narrow=[];var wide=[];for(var i=0;i<n;i++){narrow.push(70+5*((Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-3)/3));wide.push(70+20*((Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-3)/3));}'
+ 'var t1={x:narrow,type:"histogram",name:"Class A (low spread, &sigma;&asymp;5)",marker:{color:"rgba(78,205,196,0.6)",line:{color:"#4ecdc4",width:1}},opacity:0.7,nbinsx:30};'
+ 'var t2={x:wide,type:"histogram",name:"Class B (high spread, &sigma;&asymp;20)",marker:{color:"rgba(248,113,113,0.6)",line:{color:"#f87171",width:1}},opacity:0.7,nbinsx:30};'
+ 'var layout={title:{text:"Same Mean, Different Spread",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Score"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Count"},barmode:"overlay",margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-spread-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Two distributions with the same mean (~70) but very different spreads. Class A (teal) has low variance — students performed consistently. Class B (red) has high variance — scores are all over the place. The mean alone hides this crucial difference.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\ndata = np.<span class="fn">array</span>([<span class="num">2</span>, <span class="num">4</span>, <span class="num">4</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">9</span>])\n\n<span class="fn">print</span>(<span class="str">f"Mean:     {np.mean(data):.2f}"</span>)           <span class="cm"># 5.00</span>\n<span class="fn">print</span>(<span class="str">f"Variance: {np.var(data):.2f}"</span>)            <span class="cm"># 4.00 (population)</span>\n<span class="fn">print</span>(<span class="str">f"Var(ddof=1): {np.var(data, ddof=1):.2f}"</span>) <span class="cm"># 4.57 (sample)</span>\n<span class="fn">print</span>(<span class="str">f"Std Dev:  {np.std(data):.2f}"</span>)             <span class="cm"># 2.00</span>\n<span class="fn">print</span>(<span class="str">f"Range:    {np.ptp(data)}"</span>)                <span class="cm"># 7 (9-2)</span>\n\n<span class="cm"># IQR</span>\nQ1 = np.<span class="fn">percentile</span>(data, <span class="num">25</span>)\nQ3 = np.<span class="fn">percentile</span>(data, <span class="num">75</span>)\nIQR = Q3 - Q1\n<span class="fn">print</span>(<span class="str">f"Q1={Q1}, Q3={Q3}, IQR={IQR}"</span>)           <span class="cm"># Q1=3.5, Q3=6.0, IQR=2.5</span>\n<span class="fn">print</span>(<span class="str">f"Outlier bounds: [{Q1-1.5*IQR:.1f}, {Q3+1.5*IQR:.1f}]"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> <strong>Feature scaling</strong> (standardization) uses both mean and std: z = (x - &mu;) / &sigma;. This transforms features to have mean 0 and std 1, which is critical for gradient-based optimization. Without it, features on different scales dominate the loss landscape and training becomes unstable.</div>'

/* ============================================================
   SECTION 4: Covariance & Correlation
   ============================================================ */
+ '<h2 class="l-title">4. Covariance & Correlation</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> When the temperature goes up, ice cream sales go up too. When hours of study increase, exam anxiety tends to decrease. Covariance and correlation measure these <em>joint</em> relationships between two variables — do they move together, move oppositely, or show no pattern at all?</div>'

+ '<p class="l-text">So far we\'ve measured single variables. Now we look at <strong>relationships between pairs</strong> of variables — the foundation of feature engineering and understanding model behavior.</p>'

+ '<div class="calc-formula"><div class="formula-label">COVARIANCE</div><div class="formula-main">$$\\text{Cov}(X, Y) = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})$$</div><div class="formula-sub">Measures the direction of linear relationship. Positive = move together. Negative = move oppositely. Zero = no linear relationship.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">PEARSON CORRELATION COEFFICIENT</div><div class="formula-main">$$r = \\frac{\\text{Cov}(X, Y)}{s_X \\cdot s_Y} = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2 \\cdot \\sum(y_i - \\bar{y})^2}}$$</div><div class="formula-sub">Normalized covariance. Always between -1 and +1. Scale-independent — the "standardized" version of covariance.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Perfect Positive</div><div class="card-body">When X increases, Y increases proportionally. Points lie exactly on an upward-sloping line.</div></div>'
+ '<div class="calc-card"><div class="card-title">No Linear Correlation</div><div class="card-body">No linear relationship. But there could still be a nonlinear one! r=0 does NOT mean "unrelated."</div></div>'
+ '<div class="calc-card"><div class="card-title">Perfect Negative</div><div class="card-body">When X increases, Y decreases proportionally. Points lie exactly on a downward-sloping line.</div></div>'
+ '</div>'

/* --- Plotly: Correlation Scatter --- */
+ '<div id="plot-corr-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var n=80;var x1=[],y1=[],x2=[],y2=[],x3=[],y3=[];'
+ 'for(var i=0;i<n;i++){'
+ 'var a=Math.random()*10;x1.push(a);y1.push(2*a+3+(Math.random()-0.5)*3);'
+ 'var b=Math.random()*10;x2.push(b);y2.push(-1.5*b+15+(Math.random()-0.5)*3);'
+ 'var c=Math.random()*10;x3.push(c);y3.push(5+5*Math.sin(c)+(Math.random()-0.5)*2);'
+ '}'
+ 'var t1={x:x1,y:y1,mode:"markers",name:"r &asymp; +0.95",marker:{color:"#4ecdc4",size:5}};'
+ 'var t2={x:x2,y:y2,mode:"markers",name:"r &asymp; -0.95",marker:{color:"#f87171",size:5}};'
+ 'var t3={x:x3,y:y3,mode:"markers",name:"r &asymp; 0 (nonlinear!)",marker:{color:"#c8a96e",size:5}};'
+ 'var layout={title:{text:"Three Types of Relationships",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"X"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Y"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-corr-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Three scatterplots overlaid. Teal dots show strong positive correlation (r near +1). Red dots show strong negative correlation (r near -1). Gold dots show a clear sinusoidal pattern but near-zero Pearson r — proving that correlation only measures <em>linear</em> relationships.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Hours studied (X):</strong> [1, 2, 3, 4, 5]<br><strong>Exam score (Y):</strong> [50, 55, 65, 70, 80]<br><br>x&#772; = 3, y&#772; = 64<br>Deviations: X: [-2,-1,0,1,2], Y: [-14,-9,1,6,16]<br>Products: [28, 9, 0, 6, 32] &rarr; sum = 75<br><br>Cov(X,Y) = 75/(5-1) = <strong>18.75</strong><br>s_X = &radic;(10/4) = 1.58, s_Y = &radic;(534/4) = 11.55<br>r = 18.75 / (1.58 &times; 11.55) = <strong>0.99</strong> (very strong positive)</div></div>'

+ '<div class="l-warn"><strong>Correlation &ne; Causation!</strong> Ice cream sales and drowning deaths are highly correlated — but ice cream doesn\'t cause drowning. Both are caused by a third variable: hot weather. In ML, correlated features are useful for prediction, but don\'t assume one causes the other. This distinction matters for interpretability and causal inference.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nX = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>])\nY = np.<span class="fn">array</span>([<span class="num">50</span>, <span class="num">55</span>, <span class="num">65</span>, <span class="num">70</span>, <span class="num">80</span>])\n\n<span class="cm"># Covariance matrix</span>\ncov_matrix = np.<span class="fn">cov</span>(X, Y)\n<span class="fn">print</span>(<span class="str">"Cov matrix:\\n"</span>, cov_matrix)\n<span class="cm"># [[2.5, 18.75],</span>\n<span class="cm">#  [18.75, 133.5]]</span>\n<span class="cm"># Diagonal = variances, off-diagonal = covariance</span>\n\n<span class="cm"># Pearson correlation</span>\nr = np.<span class="fn">corrcoef</span>(X, Y)\n<span class="fn">print</span>(<span class="str">"Correlation matrix:\\n"</span>, r)\n<span class="cm"># [[1.0, 0.99],</span>\n<span class="cm">#  [0.99, 1.0]]</span>\n\n<span class="fn">print</span>(<span class="str">f"Cov(X,Y) = {cov_matrix[0,1]:.2f}"</span>)  <span class="cm"># 18.75</span>\n<span class="fn">print</span>(<span class="str">f"r(X,Y) = {r[0,1]:.4f}"</span>)              <span class="cm"># 0.9934</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> The <strong>covariance matrix</strong> is the heart of PCA (Principal Component Analysis). PCA finds the eigenvectors of the covariance matrix — these are the directions of maximum variance in your data. In NLP, you can use PCA to reduce 300-dimensional word embeddings to 2D for visualization.</div>'

/* ============================================================
   SECTION 5: The Gaussian Distribution
   ============================================================ */
+ '<h2 class="l-title">5. The Gaussian (Normal) Distribution</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> Measure the heights of 10,000 people. Most cluster around the average (say 170 cm), fewer are very tall or very short, and the distribution forms a symmetric bell shape. This is the Gaussian distribution — the most important distribution in all of statistics and ML.</div>'

+ '<p class="l-text">The <strong>Gaussian distribution</strong> (also called the normal distribution or bell curve) is defined by just two parameters: the mean &mu; (center) and the standard deviation &sigma; (spread).</p>'

+ '<div class="calc-formula"><div class="formula-label">GAUSSIAN PDF (PROBABILITY DENSITY FUNCTION)</div><div class="formula-main">$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">The bell curve formula. &mu; shifts the center left/right, &sigma; controls width. The 1/(&sigma;&radic;2&pi;) ensures the total area = 1.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Mean (Center)</div><div class="card-body">The peak of the bell curve. The distribution is symmetric around &mu;. Shifting &mu; moves the entire curve left or right.</div></div>'
+ '<div class="calc-card"><div class="card-title">Std Dev (Width)</div><div class="card-body">Controls how spread out the curve is. Small &sigma; = tall, narrow peak. Large &sigma; = flat, wide curve.</div></div>'
+ '<div class="calc-card"><div class="card-title">Exponential Decay</div><div class="card-body">Values far from &mu; get exponentially unlikely. The squared term in the exponent creates the symmetric bell shape.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">THE 68-95-99.7 RULE</div><div class="formula-main">$$P(\\mu - 1\\sigma \\leq X \\leq \\mu + 1\\sigma) = 68.3\\% \\quad P(\\mu - 2\\sigma \\leq X \\leq \\mu + 2\\sigma) = 95.4\\% \\quad P(\\mu - 3\\sigma \\leq X \\leq \\mu + 3\\sigma) = 99.7\\%$$</div><div class="formula-sub">For any Gaussian: 68% of data within 1&sigma;, 95% within 2&sigma;, 99.7% within 3&sigma; of the mean.</div></div>'

/* --- Plotly: Gaussian Distribution --- */
+ '<div id="plot-gauss-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function gauss(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}'
+ 'var xv=[];for(var i=-50;i<=50;i++)xv.push(i/10);'
+ 'var y1=xv.map(function(x){return gauss(x,0,1);});'
+ 'var y2=xv.map(function(x){return gauss(x,0,2);});'
+ 'var y3=xv.map(function(x){return gauss(x,2,1);});'
+ 'var t1={x:xv,y:y1,mode:"lines",name:"N(0,1) Standard",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xv,y:y2,mode:"lines",name:"N(0,2) Wider",line:{color:"#4ecdc4",width:2.5}};'
+ 'var t3={x:xv,y:y3,mode:"lines",name:"N(2,1) Shifted",line:{color:"#f87171",width:2.5}};'
+ 'var layout={title:{text:"Gaussian Distributions: Effect of &mu; and &sigma;",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-gauss-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Three Gaussians. Gold: the standard normal N(0,1). Teal: N(0,2) — same center but wider (larger &sigma;). Red: N(2,1) — same width but shifted right (larger &mu;). Changing &mu; shifts the peak; changing &sigma; changes the spread.</div></div>'

+ '<div class="calc-highlight"><strong>The Central Limit Theorem (CLT):</strong> No matter what distribution your original data follows, the <em>mean of many samples</em> will be approximately Gaussian. Take 30+ random samples, compute each sample\'s mean, and those means will form a bell curve. This is why the Gaussian appears everywhere — and why many ML algorithms assume normality.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Central Limit Theorem</div><div class="card-body">The sum (or mean) of many independent random variables tends toward Gaussian, regardless of original distribution. The cornerstone of inferential statistics.</div></div>'
+ '<div class="calc-card"><div class="card-title">Z-Score</div><div class="card-body">z = (x - &mu;) / &sigma;. Measures how many standard deviations x is from the mean. z=2 means "2 sigma above average."</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Standard normal distribution</span>\nstandard = stats.<span class="fn">norm</span>(loc=<span class="num">0</span>, scale=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">"P(-1 < Z < 1):"</span>, standard.<span class="fn">cdf</span>(<span class="num">1</span>) - standard.<span class="fn">cdf</span>(-<span class="num">1</span>))  <span class="cm"># 0.6827 (68%)</span>\n<span class="fn">print</span>(<span class="str">"P(-2 < Z < 2):"</span>, standard.<span class="fn">cdf</span>(<span class="num">2</span>) - standard.<span class="fn">cdf</span>(-<span class="num">2</span>))  <span class="cm"># 0.9545 (95%)</span>\n<span class="fn">print</span>(<span class="str">"P(-3 < Z < 3):"</span>, standard.<span class="fn">cdf</span>(<span class="num">3</span>) - standard.<span class="fn">cdf</span>(-<span class="num">3</span>))  <span class="cm"># 0.9973 (99.7%)</span>\n\n<span class="cm"># Z-score: How unusual is a value?</span>\nmu, sigma = <span class="num">170</span>, <span class="num">10</span>   <span class="cm"># heights in cm</span>\nx = <span class="num">195</span>\nz = (x - mu) / sigma\n<span class="fn">print</span>(<span class="str">f"Height {x}cm has z-score {z:.1f}"</span>)   <span class="cm"># z=2.5 (very tall!)</span>\n<span class="fn">print</span>(<span class="str">f"Only {(1-standard.cdf(z))*100:.2f}% are taller"</span>)  <span class="cm"># 0.62%</span>\n\n<span class="cm"># Central Limit Theorem demo</span>\nuniform = np.random.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, size=(<span class="num">10000</span>, <span class="num">30</span>))  <span class="cm"># 10k samples of 30</span>\nsample_means = uniform.<span class="fn">mean</span>(axis=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">f"Sample means std: {sample_means.std():.4f}"</span>)  <span class="cm"># ~0.0527 (Gaussian!)</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Gaussian distributions are everywhere in ML: (1) <strong>Weight initialization</strong> — neural network weights are initialized from N(0, small_value). (2) <strong>Gaussian Naive Bayes</strong> — assumes features are Gaussian per class. (3) <strong>Batch normalization</strong> — normalizes activations to N(0,1). (4) <strong>VAEs</strong> — the latent space is regularized to be Gaussian.</div>'

/* ============================================================
   SECTION 6: Other Important Distributions
   ============================================================ */
+ '<h2 class="l-title">6. Other Important Distributions</h2>'

+ '<div class="calc-highlight"><strong>Key insight:</strong> The Gaussian is the most famous distribution, but real-world data follows many different patterns. Coin flips are Bernoulli, word counts are Poisson, waiting times are Exponential, and class labels are Categorical. Recognizing which distribution fits your data determines which ML model is appropriate.</div>'

+ '<p class="l-text">Here are the distributions you will encounter most frequently in machine learning and NLP:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Bernoulli</div><div class="card-body"><strong>Single binary outcome.</strong> Coin flip: P(heads)=p, P(tails)=1-p. Spam/not-spam. The building block of classification.</div><div class="card-formula">P(X=1) = p</div></div>'
+ '<div class="calc-card"><div class="card-title">Binomial</div><div class="card-body"><strong>Number of successes in n trials.</strong> "Out of 100 emails, how many are spam?" Each trial is independent Bernoulli.</div><div class="card-formula">P(X=k) = C(n,k) p^k (1-p)^(n-k)</div></div>'
+ '<div class="calc-card"><div class="card-title">Poisson</div><div class="card-body"><strong>Count of rare events in fixed time/space.</strong> "How many typos per page?" "How many server errors per hour?" Mean = &lambda;.</div><div class="card-formula">P(X=k) = &lambda;^k e^(-&lambda;) / k!</div></div>'
+ '<div class="calc-card"><div class="card-title">Exponential</div><div class="card-body"><strong>Time between events.</strong> "How long until the next server error?" Memoryless: past waiting gives no info about future.</div><div class="card-formula">f(x) = &lambda; e^(-&lambda;x)</div></div>'
+ '<div class="calc-card"><div class="card-title">Uniform</div><div class="card-body"><strong>Equal probability everywhere.</strong> Rolling a fair die. Random initialization seeds. Every value in [a,b] equally likely.</div><div class="card-formula">f(x) = 1/(b-a)</div></div>'
+ '<div class="calc-card"><div class="card-title">Categorical</div><div class="card-body"><strong>One of K categories.</strong> Generalization of Bernoulli to multiple classes. Used for multiclass classification output (softmax).</div><div class="card-formula">P(X=k) = p_k</div></div>'
+ '</div>'

/* --- Plotly: Multiple Distributions --- */
+ '<div id="plot-dists-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function poisson(k,lam){return Math.pow(lam,k)*Math.exp(-lam)/([1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000][k]||1);}'
+ 'function binom(k,n,p){var c=1;for(var i=0;i<k;i++)c*=(n-i)/(i+1);return c*Math.pow(p,k)*Math.pow(1-p,n-k);}'
+ 'var kv=[];for(var i=0;i<=15;i++)kv.push(i);'
+ 'var pois=kv.map(function(k){return poisson(k,4);});'
+ 'var bino=kv.map(function(k){return binom(k,15,0.3);});'
+ 'var t1={x:kv,y:pois,type:"bar",name:"Poisson(&lambda;=4)",marker:{color:"rgba(200,169,110,0.7)"},width:0.35,offset:-0.175};'
+ 'var t2={x:kv,y:bino,type:"bar",name:"Binomial(n=15,p=0.3)",marker:{color:"rgba(78,205,196,0.7)"},width:0.35,offset:0.175};'
+ 'var layout={title:{text:"Poisson vs Binomial Distributions",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"k (number of events)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X=k)"},margin:{t:50,r:30,b:50,l:50},barmode:"group",showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-dists-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Two discrete distributions. Gold bars: Poisson with &lambda;=4 (most likely outcome is 3-4 events). Teal bars: Binomial with n=15, p=0.3 (most likely outcome is 4-5 successes). Note how both peak near their means (&lambda;=4 for Poisson, np=4.5 for Binomial) and tail off asymmetrically.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Bernoulli: single coin flip</span>\nbern = stats.<span class="fn">bernoulli</span>(p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"P(X=1):"</span>, bern.<span class="fn">pmf</span>(<span class="num">1</span>))  <span class="cm"># 0.7</span>\n\n<span class="cm"># Binomial: 10 coin flips, P(exactly 7 heads)?</span>\nbino = stats.<span class="fn">binom</span>(n=<span class="num">10</span>, p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"P(X=7):"</span>, bino.<span class="fn">pmf</span>(<span class="num">7</span>))  <span class="cm"># 0.2668</span>\n\n<span class="cm"># Poisson: average 3 typos per page</span>\npois = stats.<span class="fn">poisson</span>(mu=<span class="num">3</span>)\n<span class="fn">print</span>(<span class="str">"P(X=5):"</span>, pois.<span class="fn">pmf</span>(<span class="num">5</span>))  <span class="cm"># 0.1008</span>\n\n<span class="cm"># Exponential: avg wait 10 min between buses</span>\nexpo = stats.<span class="fn">expon</span>(scale=<span class="num">10</span>)\n<span class="fn">print</span>(<span class="str">"P(wait &lt; 5 min):"</span>, expo.<span class="fn">cdf</span>(<span class="num">5</span>))  <span class="cm"># 0.3935</span>\n\n<span class="cm"># Categorical: softmax output</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>])\nprobs = np.<span class="fn">exp</span>(logits) / np.<span class="fn">exp</span>(logits).<span class="fn">sum</span>()\n<span class="fn">print</span>(<span class="str">"Categorical probs:"</span>, probs.round(<span class="num">3</span>))  <span class="cm"># [0.659, 0.242, 0.099]</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Classification outputs are <strong>Categorical</strong> distributions (softmax). Word frequency in documents follows <strong>Zipf/Poisson</strong>-like patterns. <strong>Dropout</strong> uses Bernoulli — each neuron independently "on" with probability p. The <strong>exponential</strong> distribution models token inter-arrival times in streaming NLP.</div>'

/* ============================================================
   SECTION 7: Maximum Likelihood Estimation
   ============================================================ */
+ '<h2 class="l-title">7. Maximum Likelihood Estimation (MLE)</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> You flip a coin 100 times and get 73 heads. What\'s the "best guess" for the coin\'s true probability of heads? Intuitively, p=0.73. Maximum Likelihood Estimation formalizes this intuition: find the parameter values that make your observed data <em>most probable</em>.</div>'

+ '<p class="l-text"><strong>Maximum Likelihood Estimation (MLE)</strong> is the most fundamental parameter estimation method in statistics and ML. It answers: "Given the data I observed, what parameter values would have made this data most likely?"</p>'

+ '<div class="calc-formula"><div class="formula-label">LIKELIHOOD FUNCTION</div><div class="formula-main">$$\\mathcal{L}(\\theta | x_1, \\ldots, x_n) = \\prod_{i=1}^{n} P(x_i | \\theta)$$</div><div class="formula-sub">The probability of observing your data, viewed as a function of the parameter &theta;. For independent data, it\'s the product of individual probabilities.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">LOG-LIKELIHOOD</div><div class="formula-main">$$\\ell(\\theta) = \\ln \\mathcal{L}(\\theta) = \\sum_{i=1}^{n} \\ln P(x_i | \\theta)$$</div><div class="formula-sub">Log transforms products into sums — much easier to optimize. Since log is monotonic, maximizing log-likelihood = maximizing likelihood.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MLE SOLUTION</div><div class="formula-main">$$\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_{\\theta} \\sum_{i=1}^{n} \\ln P(x_i | \\theta)$$</div><div class="formula-sub">Find &theta; that maximizes the log-likelihood. Take derivative, set to zero, solve. Or use gradient ascent numerically.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Likelihood</div><div class="card-body">NOT a probability of &theta;! It\'s the probability of data given &theta;, viewed as a function of &theta;. Higher = data more compatible with this &theta;.</div></div>'
+ '<div class="calc-card"><div class="card-title">Log-Likelihood</div><div class="card-body">Products become sums (no numerical underflow). Logarithm is monotonically increasing, so the max doesn\'t change.</div></div>'
+ '<div class="calc-card"><div class="card-title">MLE Estimate</div><div class="card-body">The parameter value that maximizes likelihood. "The most plausible explanation for the data." It\'s a point estimate.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write down the likelihood: L(p) = p^73 (1-p)^27</div><div class="step-detail">For 73 heads and 27 tails with coin probability p</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Take the log: ln L(p) = 73 ln(p) + 27 ln(1-p)</div><div class="step-detail">Product becomes sum — much easier to differentiate</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Differentiate and set to zero: 73/p - 27/(1-p) = 0</div><div class="step-detail">Find the critical point of the log-likelihood</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve: p&#770; = 73/100 = 0.73</div><div class="step-detail">The MLE estimate is simply the observed proportion. Intuitive!</div></div></div>'
+ '</div>'

/* --- Plotly: Likelihood Function --- */
+ '<div id="plot-mle-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var pv=[];var lv=[];for(var i=1;i<=99;i++){var p=i/100;pv.push(p);lv.push(73*Math.log(p)+27*Math.log(1-p));}'
+ 'var t1={x:pv,y:lv,mode:"lines",name:"Log-Likelihood",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:[0.73],y:[73*Math.log(0.73)+27*Math.log(0.27)],mode:"markers",name:"MLE: p=0.73",marker:{size:12,color:"#f87171",symbol:"star"}};'
+ 'var layout={title:{text:"Log-Likelihood for Coin Flip (73 heads, 27 tails)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"p (probability of heads)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"ln L(p)"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}},annotations:[{x:0.73,y:73*Math.log(0.73)+27*Math.log(0.27),text:"Maximum at p=0.73",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f87171",size:12}}]};'
+ 'Plotly.newPlot("plot-mle-en",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The log-likelihood function for a coin with 73 heads and 27 tails. The curve peaks at p=0.73 (red star) — this is the MLE estimate. Any other value of p would make the observed data less likely. MLE always finds the peak of this curve.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize_scalar\n\n<span class="cm"># Coin flip MLE</span>\nheads, tails = <span class="num">73</span>, <span class="num">27</span>\n\n<span class="cm"># Negative log-likelihood (we minimize the negative)</span>\n<span class="kw">def</span> <span class="fn">neg_log_likelihood</span>(p):\n    <span class="kw">if</span> p <= <span class="num">0</span> <span class="kw">or</span> p >= <span class="num">1</span>: <span class="kw">return</span> <span class="num">1e10</span>\n    <span class="kw">return</span> -(heads * np.<span class="fn">log</span>(p) + tails * np.<span class="fn">log</span>(<span class="num">1</span> - p))\n\nresult = <span class="fn">minimize_scalar</span>(neg_log_likelihood, bounds=(<span class="num">0.01</span>, <span class="num">0.99</span>), method=<span class="str">"bounded"</span>)\n<span class="fn">print</span>(<span class="str">f"MLE estimate: p = {result.x:.4f}"</span>)  <span class="cm"># 0.7300</span>\n\n<span class="cm"># MLE for Gaussian: best mu and sigma</span>\ndata = np.random.<span class="fn">normal</span>(loc=<span class="num">5</span>, scale=<span class="num">2</span>, size=<span class="num">1000</span>)\nmu_mle = data.<span class="fn">mean</span>()     <span class="cm"># MLE for mean = sample mean</span>\nsig_mle = data.<span class="fn">std</span>()     <span class="cm"># MLE for std = sample std (biased)</span>\n<span class="fn">print</span>(<span class="str">f"MLE mu={mu_mle:.3f}, sigma={sig_mle:.3f}"</span>)  <span class="cm"># ~5, ~2</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Almost every ML training procedure is MLE in disguise! <strong>Logistic regression</strong> maximizes the likelihood of observed labels under a Bernoulli model. <strong>Cross-entropy loss</strong> is the negative log-likelihood of a Categorical distribution. Training a neural network with cross-entropy loss = finding the MLE of the network parameters. Even <strong>linear regression with MSE</strong> is MLE under Gaussian noise assumptions.</div>'

/* ============================================================
   SECTION 8: Hypothesis Testing Basics
   ============================================================ */
+ '<h2 class="l-title">8. Hypothesis Testing Basics</h2>'

+ '<div class="calc-highlight"><strong>Everyday analogy:</strong> A pharmaceutical company claims a new drug works. A court assumes "innocent until proven guilty." Similarly, hypothesis testing starts by assuming the drug does NOT work (null hypothesis), then asks: "Is the observed evidence so extreme that this assumption is probably wrong?" If yes, we reject the null and conclude the drug likely works.</div>'

+ '<p class="l-text"><strong>Hypothesis testing</strong> is a formal framework for making decisions from data. It quantifies "is this result real, or just random noise?" — a question every ML practitioner must answer.</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">NULL HYPOTHESIS (H&sub0;)</div><div class="compare-item">&bull; The "boring" explanation: nothing interesting happened</div><div class="compare-item">&bull; "The new model is NOT better than baseline"</div><div class="compare-item">&bull; "The drug has NO effect"</div><div class="compare-item">&bull; We assume H&sub0; is true and try to disprove it</div></div><div class="compare-col"><div class="compare-title">ALTERNATIVE HYPOTHESIS (H&sub1;)</div><div class="compare-item">&bull; The "interesting" claim we want to support</div><div class="compare-item">&bull; "The new model IS better than baseline"</div><div class="compare-item">&bull; "The drug HAS an effect"</div><div class="compare-item">&bull; We accept H&sub1; only if evidence against H&sub0; is strong</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">P-VALUE</div><div class="formula-main">$$p\\text{-value} = P(\\text{observing data this extreme} \\,|\\, H_0 \\text{ is true})$$</div><div class="formula-sub">Small p-value = data is unlikely under H&sub0; = evidence against H&sub0;. Typically, p < 0.05 is considered "statistically significant."</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">P-Value</div><div class="card-body">NOT the probability H&sub0; is true! It\'s "if H&sub0; were true, how surprising is this data?" Small p = very surprising = reject H&sub0;.</div></div>'
+ '<div class="calc-card"><div class="card-title">Significance Level</div><div class="card-body">The threshold for rejection (usually 0.05). If p < &alpha;, reject H&sub0;. Smaller &alpha; = stricter standard of evidence.</div></div>'
+ '<div class="calc-card"><div class="card-title">Confidence Interval</div><div class="card-body">A range likely containing the true parameter. "95% CI: [2.1, 3.9]" means we\'re 95% confident the true value is in this range.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">CONFIDENCE INTERVAL FOR THE MEAN</div><div class="formula-main">$$\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{s}{\\sqrt{n}}$$</div><div class="formula-sub">Sample mean &plusmn; margin of error. For 95% CI: z = 1.96. Larger n = narrower interval = more precise estimate.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">False Positive</div><div class="card-body">Reject H&sub0; when it\'s actually true. "We said the model is better, but it\'s not." Probability = &alpha;.</div></div>'
+ '<div class="calc-card"><div class="card-title">False Negative</div><div class="card-body">Fail to reject H&sub0; when it\'s actually false. "We missed a real improvement." Probability = &beta;.</div></div>'
+ '<div class="calc-card"><div class="card-title">Power</div><div class="card-body">Probability of correctly detecting a real effect. Higher power = fewer missed discoveries. Increase with more data.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Scenario:</strong> Your new NLP model scores 87.3% accuracy, while the baseline scores 85.1%. Is this improvement real?<br><br><strong>H&sub0;:</strong> No difference (the improvement is due to random variation)<br><strong>H&sub1;:</strong> The new model is genuinely better<br><br>After running a paired t-test on 50 test sets:<br>t-statistic = 2.84, p-value = 0.006<br><br>Since p = 0.006 < &alpha; = 0.05, we <strong>reject H&sub0;</strong>. The improvement is statistically significant. But always also check if it\'s <em>practically</em> significant — a 0.1% improvement on a production system may not justify the extra complexity.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Two models tested on 50 test sets each</span>\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)\nmodel_a = np.random.<span class="fn">normal</span>(<span class="num">85.1</span>, <span class="num">3</span>, size=<span class="num">50</span>)  <span class="cm"># baseline</span>\nmodel_b = np.random.<span class="fn">normal</span>(<span class="num">87.3</span>, <span class="num">3</span>, size=<span class="num">50</span>)  <span class="cm"># new model</span>\n\n<span class="cm"># Paired t-test (same test sets)</span>\nt_stat, p_value = stats.<span class="fn">ttest_rel</span>(model_b, model_a)\n<span class="fn">print</span>(<span class="str">f"t-statistic: {t_stat:.3f}"</span>)\n<span class="fn">print</span>(<span class="str">f"p-value: {p_value:.4f}"</span>)\n<span class="fn">print</span>(<span class="str">f"Significant? {p_value < 0.05}"</span>)  <span class="cm"># True</span>\n\n<span class="cm"># 95% Confidence Interval for the mean difference</span>\ndiff = model_b - model_a\nmean_diff = diff.<span class="fn">mean</span>()\nse = diff.<span class="fn">std</span>(ddof=<span class="num">1</span>) / np.<span class="fn">sqrt</span>(<span class="fn">len</span>(diff))\nci_low = mean_diff - <span class="num">1.96</span> * se\nci_high = mean_diff + <span class="num">1.96</span> * se\n<span class="fn">print</span>(<span class="str">f"Mean improvement: {mean_diff:.2f}%"</span>)\n<span class="fn">print</span>(<span class="str">f"95% CI: [{ci_low:.2f}, {ci_high:.2f}]"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> Always report <strong>confidence intervals</strong>, not just point estimates. "Our model achieves 87.3% &plusmn; 1.2% accuracy" is much more informative than "87.3% accuracy." In NLP papers, <strong>paired bootstrap tests</strong> are standard for comparing models. A p-value of 0.03 means there\'s only a 3% chance the improvement is due to luck.</div>'

/* ============================================================
   SECTION 9: Statistics in ML
   ============================================================ */
+ '<h2 class="l-title">9. Statistics in ML Practice</h2>'

+ '<div class="calc-highlight"><strong>Key insight:</strong> Everything in ML evaluation is statistics. Cross-validation is repeated sampling. Bootstrapping estimates uncertainty. A/B testing uses hypothesis tests. Feature selection uses correlation. If you understand statistics, you understand why ML best practices work — and when they can go wrong.</div>'

+ '<p class="l-text">Let\'s connect the statistical concepts we\'ve learned to the ML techniques you will use every day:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">K-Fold Cross-Validation</div><div class="card-body">Split data into K folds, train on K-1, test on 1, rotate. Gives K accuracy estimates &rarr; compute <strong>mean &plusmn; std</strong>. This IS descriptive statistics on model performance.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bootstrap</div><div class="card-body">Sample with replacement from your data, compute statistic, repeat 1000+ times. Get a full distribution of your estimate — mean, std, confidence intervals — all from one dataset!</div></div>'
+ '<div class="calc-card"><div class="card-title">A/B Testing</div><div class="card-body">Show version A to half of users, version B to the other half. Hypothesis test: "Is B significantly better than A?" Used by every tech company for product decisions.</div></div>'
+ '<div class="calc-card"><div class="card-title">Feature Correlation</div><div class="card-body">Compute correlation matrix of features. Highly correlated features are redundant — drop one to reduce multicollinearity and improve model interpretability.</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-num">1</div><div class="flow-label">EDA</div><div class="flow-desc">Descriptive stats: mean, std, histograms, correlation matrix. Understand your data before modeling.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">2</div><div class="flow-label">Feature Engineering</div><div class="flow-desc">Standardization (z-scores), outlier detection (IQR), correlation-based selection.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">3</div><div class="flow-label">Model Training</div><div class="flow-desc">Loss minimization = MLE. Cross-entropy = negative log-likelihood. MSE = Gaussian MLE.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">4</div><div class="flow-label">Evaluation</div><div class="flow-desc">Cross-validation, bootstrap CIs, paired t-tests, A/B testing. All inferential statistics.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Bootstrap Confidence Interval for Model Accuracy:</strong><br><br>You tested your model on 200 samples and got 174 correct (87% accuracy). But how confident are you?<br><br>Bootstrap procedure:<br>1. Resample 200 predictions with replacement<br>2. Compute accuracy on this bootstrap sample<br>3. Repeat 10,000 times<br>4. Take 2.5th and 97.5th percentiles<br><br>Result: 95% CI = [82.0%, 91.5%]<br><br>You can say: "Our model achieves 87% accuracy (95% CI: 82-91.5%)"</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression\n\n<span class="cm"># K-Fold Cross-Validation: get mean +/- std</span>\n<span class="cm"># model = LogisticRegression()</span>\n<span class="cm"># scores = cross_val_score(model, X, y, cv=5)</span>\n<span class="cm"># print(f"Accuracy: {scores.mean():.3f} +/- {scores.std():.3f}")</span>\n\n<span class="cm"># Bootstrap confidence interval</span>\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)\ny_true = np.<span class="fn">array</span>([<span class="num">1</span>]*<span class="num">174</span> + [<span class="num">0</span>]*<span class="num">26</span>)  <span class="cm"># 174 correct, 26 wrong</span>\n\nn_bootstrap = <span class="num">10000</span>\nboot_accs = []\n<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_bootstrap):\n    sample = np.random.<span class="fn">choice</span>(y_true, size=<span class="fn">len</span>(y_true), replace=<span class="num">True</span>)\n    boot_accs.<span class="fn">append</span>(sample.<span class="fn">mean</span>())\n\nboot_accs = np.<span class="fn">array</span>(boot_accs)\nci_low = np.<span class="fn">percentile</span>(boot_accs, <span class="num">2.5</span>) * <span class="num">100</span>\nci_high = np.<span class="fn">percentile</span>(boot_accs, <span class="num">97.5</span>) * <span class="num">100</span>\n<span class="fn">print</span>(<span class="str">f"Bootstrap 95% CI: [{ci_low:.1f}%, {ci_high:.1f}%]"</span>)\n\n<span class="cm"># Feature correlation analysis</span>\n<span class="cm"># corr_matrix = df.corr()</span>\n<span class="cm"># high_corr = (corr_matrix.abs() > 0.9) &amp; (corr_matrix != 1.0)</span>\n<span class="cm"># print("Highly correlated feature pairs:", high_corr.sum().sum() // 2)</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Connection:</strong> <strong>Regularization</strong> (L1, L2) has a statistical interpretation: it adds a <strong>prior</strong> to MLE, turning it into MAP (Maximum A Posteriori) estimation. L2 regularization = Gaussian prior on weights. L1 regularization = Laplace prior on weights. This is the bridge between frequentist and Bayesian statistics.</div>'

/* ============================================================
   SECTION 10: Summary & Next Steps
   ============================================================ */
+ '<h2 class="l-title">10. Summary & Next Steps</h2>'

+ '<p class="l-text">This lesson covered the statistical toolkit that every ML practitioner needs. Here is your complete concept map:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Descriptive vs Inferential</div><div class="card-body">Summarize your data (descriptive) vs. generalize from samples to populations (inferential). ML training = inference from a sample.</div><div class="card-formula">Sample &rarr; Population</div></div>'
+ '<div class="calc-card"><div class="card-title">Central Tendency</div><div class="card-body">Mean (average), median (middle), mode (most frequent). Use median for skewed data. MSE &rarr; mean, MAE &rarr; median.</div><div class="card-formula">x&#772; = &Sigma;x/n</div></div>'
+ '<div class="calc-card"><div class="card-title">Spread</div><div class="card-body">Variance, std dev, IQR. Standard deviation = average distance from mean. Standardization: z = (x-&mu;)/&sigma;.</div><div class="card-formula">&sigma; = &radic;Var(X)</div></div>'
+ '<div class="calc-card"><div class="card-title">Correlation</div><div class="card-body">Covariance normalized by std devs. -1 to +1. Measures linear relationship only. Correlation &ne; causation!</div><div class="card-formula">r = Cov(X,Y)/(s_X s_Y)</div></div>'
+ '<div class="calc-card"><div class="card-title">Gaussian Distribution</div><div class="card-body">Bell curve defined by &mu; and &sigma;. 68-95-99.7 rule. Central Limit Theorem makes it universal.</div><div class="card-formula">f(x) = (1/&sigma;&radic;2&pi;)e^(-(x-&mu;)&sup2;/2&sigma;&sup2;)</div></div>'
+ '<div class="calc-card"><div class="card-title">Other Distributions</div><div class="card-body">Bernoulli (binary), Binomial (count), Poisson (rare events), Exponential (waiting times), Categorical (classes).</div><div class="card-formula">Match distribution to data type</div></div>'
+ '<div class="calc-card"><div class="card-title">Maximum Likelihood</div><div class="card-body">Find parameters that make observed data most probable. Cross-entropy = negative log-likelihood. Training = MLE!</div><div class="card-formula">&theta;&#770; = argmax &Sigma; ln P(x|&theta;)</div></div>'
+ '<div class="calc-card"><div class="card-title">Hypothesis Testing</div><div class="card-body">Null vs alternative hypothesis. p-value measures surprise under H&sub0;. Always report confidence intervals.</div><div class="card-formula">p < 0.05 &rarr; significant</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Next Lesson:</strong> In Lesson 3, we move to <strong>Optimization</strong> — gradient descent, learning rates, convexity, and convergence. Optimization is where statistics meets calculus: we use gradients (calculus) to maximize likelihood (statistics) and find the best model parameters. This is the engine that powers every neural network.</div>'

/* ============================================================
   TURKISH VERSION
   ============================================================ */
,tr: '<p class="l-text"><strong>İstatistik, veriden öğrenme bilimidir.</strong> Herhangi bir makine öğrenmesi modeli tahmin yapabilmeden önce, verimizin nasıl göründüğünü, özelliklerin birbirleriyle nasıl ilişkili olduğunu ve sayıların hangi kalıpları ortaya koyduğunu anlamamız gerekir. Her ML işlem hattı istatistikle başlar — keşifsel veri analizinden model değerlendirmeye, özellik mühendisliğinden A/B testine kadar. İstatistiği kavrayın ve ML\'nin <em>neden</em> çalıştığını anlayacaksınız, sadece <em>nasıl</em> çalıştığını değil.</p>'

+ '<p class="l-text">Bu ders sizi en temellerden — ortalama ve varyans gibi betimsel ölçümlerden — olasılık dağılımlarına, maksimum olabilirlik tahminine ve hipotez testine kadar götürür. Her formül açıklanır, her kavram gerçek ML/NLP uygulamalarına bağlanır.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Somut ML örnekleriyle betimsel ve çıkarımsal istatistiği ayırt etmeyi</li>'
+ '<li>NumPy ile veri üzerinde ortalama, medyan, mod, varyans ve IQR hesaplamayı</li>'
+ '<li>Bir histogramdan dağılımı görselleştirip çarpıklık, basıklık ve aykırı değerleri okumayı</li>'
+ '<li>Normal yaklaşımı gerekçelendirmek için Merkezi Limit Teoremini uygulamayı</li>'
+ '<li>Örneklem ortalaması için güven aralığı inşa edip doğru raporlamayı</li>'
+ '<li>Bir t-testi ve ki-kare testi çalıştırıp çıkan p-değerini yorumlamayı</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   BÖLÜM 1: Betimsel vs Çıkarımsal İstatistik
   ============================================================ */
+ '<h2 class="l-title">1. Betimsel vs Çıkarımsal İstatistik</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> Sınıfınızdaki 30 öğrencinin boylarını ölçüp ortalama hesapladığınızı düşünün. Bu <em>betimsel</em> istatistiktir — gördüklerinizi özetlemek. Şimdi bu 30 boyu kullanarak ülkedeki <em>tüm</em> üniversite öğrencilerinin ortalama boyunu tahmin ettiğinizi düşünün. Bu <em>çıkarımsal</em> istatistiktir — küçük bir örneklemden büyük bir grup hakkında tahmin yapmak.</div>'

+ '<p class="l-text">İstatistiğin iki temel dalı vardır ve bu ayrımı anlamak ML için kritiktir:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">BETİMSEL İSTATİSTİK</div><div class="compare-item">&bull; Elinizdeki veriyi <strong>özetler</strong></div><div class="compare-item">&bull; Tüm veri setiyle ilgilenir</div><div class="compare-item">&bull; Araçlar: ortalama, medyan, histogram, std sapma</div><div class="compare-item">&bull; "Verim nasıl görünüyor?"</div></div><div class="compare-col"><div class="compare-title">ÇIKARIMSAL İSTATİSTİK</div><div class="compare-item">&bull; Verinizin ötesine <strong>tahmin</strong> yapar</div><div class="compare-item">&bull; Örneklemden popülasyon hakkında çıkarım yapar</div><div class="compare-item">&bull; Araçlar: hipotez testleri, güven aralıkları</div><div class="compare-item">&bull; "Dünya hakkında ne sonuç çıkarabilirim?"</div></div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Popülasyon</div><div class="card-body">İlgilendiğiniz <strong>tüm</strong> grup. "Gönderilen tüm e-postalar" veya "tüm olası görseller." Genellikle tamamen gözlemlenemeyecek kadar büyük.</div></div>'
+ '<div class="calc-card"><div class="card-title">Örneklem</div><div class="card-body">Popülasyonun gerçekten topladığınız bir <strong>alt kümesi</strong>. Eğitim setiniz, gerçek veri dağılımının bir örneklemidir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Parametreler</div><div class="card-body">Popülasyonun gerçek değerleri (ortalama &mu;, std &sigma;). Genellikle <strong>bilinmez</strong> — onları veriden tahmin etmeye çalışırız.</div></div>'
+ '<div class="calc-card"><div class="card-title">İstatistikler</div><div class="card-body">Örneklemden hesaplanan değerler (örneklem ortalaması x&#772;, örneklem std\'si s). Bunlar gerçek parametrelerin <strong>tahminleridir</strong>.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">POPÜLASYON vs ÖRNEKLEM NOTASYONU</div><div class="formula-main">$$\\text{Population mean: } \\mu = \\frac{1}{N}\\sum_{i=1}^{N} x_i \\qquad \\text{Sample mean: } \\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$</div><div class="formula-sub">Aynı formül, farklı kapsam. Popülasyon N (tüm veri), örneklem n (alt küme) kullanır. Popülasyon için Yunanca, örneklem için Latin harfleri.</div></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Eğitim setiniz, gerçek veri dağılımından bir <em>örneklemdir</em>. ML\'nin amacı <strong>çıkarım</strong>dır — bu örneklemi kullanarak görünmeyen verilere (popülasyona) <strong>genellenebilecek</strong> kalıpları öğrenmek. Aşırı uyum (overfitting), modeliniz popülasyon kalıbını öğrenmek yerine örneklemi ezberlediğinde olur.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Populasyon: 10.000 musteri yasi</span>\npopulasyon = np.random.<span class="fn">normal</span>(loc=<span class="num">35</span>, scale=<span class="num">10</span>, size=<span class="num">10000</span>)\n\n<span class="cm"># Orneklem: rastgele 100 sec</span>\norneklem = np.random.<span class="fn">choice</span>(populasyon, size=<span class="num">100</span>, replace=<span class="num">False</span>)\n\n<span class="cm"># Populasyon parametresi vs orneklem istatistigi</span>\n<span class="fn">print</span>(<span class="str">f"Populasyon ort (mu):    {populasyon.mean():.2f}"</span>)  <span class="cm"># ~35.0</span>\n<span class="fn">print</span>(<span class="str">f"Orneklem ort (x-bar):  {orneklem.mean():.2f}"</span>)    <span class="cm"># ~35 (yakin!)</span>\n<span class="fn">print</span>(<span class="str">f"Populasyon std (sigma): {populasyon.std():.2f}"</span>)  <span class="cm"># ~10.0</span>\n<span class="fn">print</span>(<span class="str">f"Orneklem std (s):      {orneklem.std(ddof=1):.2f}"</span>) <span class="cm"># ~10 (ddof=1: yansiz)</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Örneklem standart sapması için neden <code>ddof=1</code> (n yerine n-1\'e bölme) kullanırız? Çünkü n\'e bölmek gerçek popülasyon varyansını sistematik olarak <em>küçümser</em>. n-1\'e bölmek bu yanlılığı düzeltir — buna <strong>Bessel düzeltmesi</strong> denir. Büyük n için fark ihmal edilebilir.</div></div>'

/* ============================================================
   BÖLÜM 2: Merkezi Eğilim Ölçüleri
   ============================================================ */
+ '<h2 class="l-title">2. Merkezi Eğilim Ölçüleri</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> Birisi "bu şirkette tipik maaş nedir?" diye sorarsa, üç şekilde cevaplayabilirsiniz: ortalama maaş (aritmetik ortalama), sıralanan maaşların ortasındaki (medyan) veya en yaygın maaş (mod). Her biri farklı bir hikaye anlatır — ve yanlış olanı seçmek çok yanıltıcı olabilir.</div>'

+ '<p class="l-text">Merkezi eğilim ölçüleri, bir veri setinin <strong>"merkezi"</strong>ni tanımlar — değerlerin çoğunun nerede kümelendiği:</p>'

+ '<div class="calc-formula"><div class="formula-label">ORTALAMA</div><div class="formula-main">$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\cdots + x_n}{n}$$</div><div class="formula-sub">Tüm değerleri toplayıp sayıya bölün. Aykırı değerlere duyarlı — bir milyarder ortalama maaşı çarpıtır.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MEDYAN</div><div class="formula-main">$$\\tilde{x} = \\begin{cases} x_{(n+1)/2} & \\text{n odd} \\\\ \\frac{x_{n/2} + x_{n/2+1}}{2} & \\text{n even} \\end{cases}$$</div><div class="formula-sub">Veri sıralandığında ortadaki değer. Aykırı değerlere dayanıklı — aşırı değerlerden etkilenmez.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Ortalama</div><div class="card-body"><strong>En iyi:</strong> aykırı değeri olmayan simetrik veri. Tüm veri noktalarını kullanır. Kare hataları minimize eder.</div></div>'
+ '<div class="calc-card"><div class="card-title">Medyan</div><div class="card-body"><strong>En iyi:</strong> çarpık veri veya aykırı değerler. Dayanıklı. Mutlak hataları minimize eder.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mod</div><div class="card-body"><strong>En iyi:</strong> kategorik veri (en popüler kategori). Sayısal olmayan veri için kullanılabilen tek ölçü.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Maaşlar:</strong> [30k, 35k, 40k, 42k, 45k, 50k, 55k, 1000k]<br><br><strong>Ortalama:</strong> (30+35+40+42+45+50+55+1000)/8 = 1297/8 = <strong>162.1k</strong> &larr; yanıltıcı!<br><strong>Medyan:</strong> ortadaki ikisinin ortalaması: (42+45)/2 = <strong>43.5k</strong> &larr; temsil edici<br><br>Ortalama CEO\'nun maaşıyla yukarıya çekilir. Medyan "tipik" maaşın gerçek hikayesini anlatır.</div></div>'

+ '<div id="plot-central-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var data=[30,32,33,34,35,35,36,36,36,37,37,38,38,39,40,40,41,42,55,80];'
+ 'var mean=data.reduce(function(a,b){return a+b},0)/data.length;'
+ 'var sorted=data.slice().sort(function(a,b){return a-b});'
+ 'var median=(sorted[9]+sorted[10])/2;'
+ 'var t1={x:data,type:"histogram",marker:{color:"rgba(200,169,110,0.7)",line:{color:"#c8a96e",width:1}},nbinsx:15,name:"Veri"};'
+ 'var layout={title:{text:"Ortalama vs Medyan ile Dağılım",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Değer"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Sayı"},shapes:[{type:"line",x0:mean,x1:mean,y0:0,y1:1,yref:"paper",line:{color:"#f87171",width:2.5,dash:"dash"}},{type:"line",x0:median,x1:median,y0:0,y1:1,yref:"paper",line:{color:"#4ecdc4",width:2.5,dash:"dot"}}],annotations:[{x:mean,y:1,yref:"paper",text:"Ort="+mean.toFixed(1),showarrow:false,font:{color:"#f87171",size:12},yanchor:"bottom"},{x:median,y:0.9,yref:"paper",text:"Medyan="+median.toFixed(1),showarrow:false,font:{color:"#4ecdc4",size:12},yanchor:"bottom"}],margin:{t:50,r:30,b:50,l:50},showlegend:false};'
+ 'Plotly.newPlot("plot-central-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Sağa çarpık bir veri seti. Kırmızı kesikli çizgi ortalama (aykırı değerlerle sağa çekiliyor), turkuaz noktalı çizgi ise medyandır (verinin yoğunluğuna yakın kalır).</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\ndata = np.<span class="fn">array</span>([<span class="num">30</span>, <span class="num">35</span>, <span class="num">40</span>, <span class="num">42</span>, <span class="num">45</span>, <span class="num">50</span>, <span class="num">55</span>, <span class="num">1000</span>])\n\n<span class="fn">print</span>(<span class="str">f"Ortalama: {np.mean(data):.1f}"</span>)        <span class="cm"># 162.1</span>\n<span class="fn">print</span>(<span class="str">f"Medyan:   {np.median(data):.1f}"</span>)        <span class="cm"># 43.5</span>\n<span class="fn">print</span>(<span class="str">f"Mod:      {stats.mode(data).mode}"</span>)      <span class="cm"># 30 (ilk değer, hepsi tekil)</span>\n\n<span class="cm"># Ağırlıklı ortalama (sınıf-ağırlıklı kayıplar için faydalı)</span>\nweights = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0.1</span>])  <span class="cm"># aykırıyı ağırlıkla azalt</span>\nweighted_mean = np.<span class="fn">average</span>(data, weights=weights)\n<span class="fn">print</span>(<span class="str">f"Ağırlıklı ortalama: {weighted_mean:.1f}"</span>)   <span class="cm"># ~55.7</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Kayıp fonksiyonları merkezi eğilimle doğrudan bağlantılıdır. <strong>MSE</strong> minimizasyonu hedef dağılımının ortalamasını verir. <strong>MAE</strong> minimizasyonu medyanı verir. Hedefinizde aykırı değerler varsa MAE kullanın — tıpkı medyan gibi daha dayanıklıdır.</div>'

/* ============================================================
   BÖLÜM 3: Yayılım Ölçüleri
   ============================================================ */
+ '<h2 class="l-title">3. Yayılım Ölçüleri</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> İki sınıfın aynı ortalama sınav puanı 70\'tir. Ama A sınıfında herkes 65-75 arası almıştır. B sınıfında ise puanlar 20\'den 100\'e kadar değişir. <em>Merkez</em> aynı, ama <em>yayılım</em> çok farklı. Yayılım ölçüleri verinizin merkez etrafında ne kadar değişkenlik gösterdiğini söyler.</div>'

+ '<p class="l-text">Merkezi bilmek yeterli değil — verinin <strong>ne kadar yayıldığını</strong> da bilmemiz gerekiyor. İşte temel ölçüler:</p>'

+ '<div class="calc-formula"><div class="formula-label">VARYANS</div><div class="formula-main">$$\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2 \\qquad s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$$</div><div class="formula-sub">Ortalamadan kare sapmaların ortalaması. Sol: popülasyon varyansı. Sağ: örneklem varyansı (Bessel düzeltmesi: n-1).</div></div>'

+ '<div class="calc-formula"><div class="formula-label">STANDART SAPMA</div><div class="formula-main">$$\\sigma = \\sqrt{\\sigma^2} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}$$</div><div class="formula-sub">Varyansın karekökü. Orijinal veriyle aynı birimde — varyansa göre çok daha anlaşılabilir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Varyans</div><div class="card-body">Ortalamadan ortalama kare uzaklık. Birimleri kareli (örn: cm&sup2;), doğrudan yorumlaması zor.</div></div>'
+ '<div class="calc-card"><div class="card-title">Standart Sapma</div><div class="card-body">Varyansın karekökü. Veriyle aynı birim. "Ortalama olarak veri noktaları &sigma; kadar ortalamadan uzaktır."</div></div>'
+ '<div class="calc-card"><div class="card-title">Aralık</div><div class="card-body">max - min. En basit yayılım ölçüsü, ama aykırı değerlere çok duyarlı. Tek bir uç değer hepsini bozar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Çeyrekler Arası Aralık</div><div class="card-body">Q3 - Q1 (75. yüzdelik - 25. yüzdelik). Aykırı değerlere dayanıklı. Ortadaki %50\'nin yayılımını ölçer.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Ortalamayı hesapla: x&#772; = (2+4+4+4+5+5+7+9)/8 = 5</div><div class="step-detail">Tüm değerleri toplayıp sayıya böl</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Her değerden ortalamayı çıkar: [-3, -1, -1, -1, 0, 0, 2, 4]</div><div class="step-detail">Bunlar sapmalardır. Toplamlarının sıfır olduğuna dikkat edin!</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Her sapmanın karesini al: [9, 1, 1, 1, 0, 0, 4, 16]</div><div class="step-detail">Kare alma tüm değerleri pozitifleştirir ve büyük sapmaları daha çok cezalandırır</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Kare sapmaların ortalamasını al: varyans = 32/8 = 4</div><div class="step-detail">Örneklem varyansı için n-1 = 7\'ye bölün: 32/7 = 4.57</div></div></div>'
+ '<div class="calc-step"><div class="step-num">5</div><div class="step-content"><div class="step-title">Karekök al: &sigma; = &radic;4 = 2</div><div class="step-detail">Standart sapma = 2. Değerler ortalamadan ortalama 2 birim sapar.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">ÇEYREKLER ARASI ARALIK (IQR)</div><div class="formula-main">$$\\text{IQR} = Q_3 - Q_1$$</div><div class="formula-sub">Q1 = 25. yüzdelik, Q3 = 75. yüzdelik. Aykırı değerler genellikle Q1 - 1.5*IQR altında veya Q3 + 1.5*IQR üstünde tanımlanır.</div></div>'

+ '<div id="plot-spread-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var n=500;var narrow=[];var wide=[];for(var i=0;i<n;i++){narrow.push(70+5*((Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-3)/3));wide.push(70+20*((Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()-3)/3));}'
+ 'var t1={x:narrow,type:"histogram",name:"Sınıf A (düşük yayılım)",marker:{color:"rgba(78,205,196,0.6)",line:{color:"#4ecdc4",width:1}},opacity:0.7,nbinsx:30};'
+ 'var t2={x:wide,type:"histogram",name:"Sınıf B (yüksek yayılım)",marker:{color:"rgba(248,113,113,0.6)",line:{color:"#f87171",width:1}},opacity:0.7,nbinsx:30};'
+ 'var layout={title:{text:"Aynı Ortalama, Farklı Yayılım",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Puan"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Sayı"},barmode:"overlay",margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-spread-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Aynı ortalamaya (~70) sahip iki dağılım. Sınıf A (turkuaz) düşük varyans — tutarlı performans. Sınıf B (kırmızı) yüksek varyans — puanlar her yere dağılmış. Ortalama tek başına bu kritik farkı gizler.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\ndata = np.<span class="fn">array</span>([<span class="num">2</span>, <span class="num">4</span>, <span class="num">4</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">9</span>])\n\n<span class="fn">print</span>(<span class="str">f"Ortalama: {np.mean(data):.2f}"</span>)         <span class="cm"># 5.00</span>\n<span class="fn">print</span>(<span class="str">f"Varyans:  {np.var(data):.2f}"</span>)          <span class="cm"># 4.00 (popülasyon)</span>\n<span class="fn">print</span>(<span class="str">f"Var(ddof=1): {np.var(data, ddof=1):.2f}"</span>) <span class="cm"># 4.57 (örneklem)</span>\n<span class="fn">print</span>(<span class="str">f"Std Sapma: {np.std(data):.2f}"</span>)           <span class="cm"># 2.00</span>\n<span class="fn">print</span>(<span class="str">f"Aralık:    {np.ptp(data)}"</span>)              <span class="cm"># 7 (9-2)</span>\n\n<span class="cm"># IQR (Çeyrekler Arası Aralık)</span>\nQ1 = np.<span class="fn">percentile</span>(data, <span class="num">25</span>)\nQ3 = np.<span class="fn">percentile</span>(data, <span class="num">75</span>)\nIQR = Q3 - Q1\n<span class="fn">print</span>(<span class="str">f"Q1={Q1}, Q3={Q3}, IQR={IQR}"</span>)           <span class="cm"># Q1=3.5, Q3=6.0, IQR=2.5</span>\n<span class="fn">print</span>(<span class="str">f"Aykırı sınırları: [{Q1-1.5*IQR:.1f}, {Q3+1.5*IQR:.1f}]"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> <strong>Özellik ölçeklendirme</strong> (standardizasyon) hem ortalama hem std kullanır: z = (x - &mu;) / &sigma;. Bu, özellikleri ortalama 0 ve std 1\'e dönüştürür; bu, gradyan tabanlı optimizasyon için kritiktir. Ölçekleme olmadan, farklı ölçeklerdeki özellikler kayıp manzarasına hakim olur ve eğitim kararsız hale gelir.</div>'

/* ============================================================
   BÖLÜM 4: Kovaryans & Korelasyon
   ============================================================ */
+ '<h2 class="l-title">4. Kovaryans & Korelasyon</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> Sıcaklık arttığında dondurma satışları da artar. Çalışma saatleri arttığında sınav kaygısı azalma eğilimindedir. Kovaryans ve korelasyon, iki değişken arasındaki bu <em>ortak</em> ilişkileri ölçer — birlikte mi, zıt yönde mi hareket ediyorlar, yoksa hiç kalıbı yok mu?</div>'

+ '<p class="l-text">Şimdiye kadar tek değişkenleri ölçtük. Şimdi <strong>değişken çiftleri arasındaki ilişkilere</strong> bakıyoruz — özellik mühendisliğinin ve model davranışını anlamanın temeli.</p>'

+ '<div class="calc-formula"><div class="formula-label">KOVARYANS</div><div class="formula-main">$$\\text{Cov}(X, Y) = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})$$</div><div class="formula-sub">Doğrusal ilişkinin yönünü ölçer. Pozitif = birlikte hareket. Negatif = zıt hareket. Sıfır = doğrusal ilişki yok.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">PEARSON KORELASYON KATSAYISI</div><div class="formula-main">$$r = \\frac{\\text{Cov}(X, Y)}{s_X \\cdot s_Y}$$</div><div class="formula-sub">Normalize edilmiş kovaryans. Her zaman -1 ile +1 arasında. Ölçekten bağımsız.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Mükemmel Pozitif</div><div class="card-body">X arttığında Y orantılı olarak artar. Noktalar tam olarak yukarı eğimli bir çizgi üzerinde yer alır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Doğrusal Korelasyon Yok</div><div class="card-body">Doğrusal ilişki yok. Ama doğrusal olmayan bir ilişki olabilir! r=0 "ilişkisiz" anlamına GELMEZ.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mükemmel Negatif</div><div class="card-body">X arttığında Y orantılı olarak azalır. Noktalar tam olarak aşağı eğimli bir çizgi üzerinde yer alır.</div></div>'
+ '</div>'

+ '<div id="plot-corr-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var n=80;var x1=[],y1=[],x2=[],y2=[],x3=[],y3=[];'
+ 'for(var i=0;i<n;i++){'
+ 'var a=Math.random()*10;x1.push(a);y1.push(2*a+3+(Math.random()-0.5)*3);'
+ 'var b=Math.random()*10;x2.push(b);y2.push(-1.5*b+15+(Math.random()-0.5)*3);'
+ 'var c=Math.random()*10;x3.push(c);y3.push(5+5*Math.sin(c)+(Math.random()-0.5)*2);'
+ '}'
+ 'var t1={x:x1,y:y1,mode:"markers",name:"r &asymp; +0.95",marker:{color:"#4ecdc4",size:5}};'
+ 'var t2={x:x2,y:y2,mode:"markers",name:"r &asymp; -0.95",marker:{color:"#f87171",size:5}};'
+ 'var t3={x:x3,y:y3,mode:"markers",name:"r &asymp; 0 (doğrusal değil!)",marker:{color:"#c8a96e",size:5}};'
+ 'var layout={title:{text:"Üç Tür İlişki",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"X"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Y"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-corr-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Üç saçılım grafiği. Turkuaz noktalar güçlü pozitif korelasyon (r yaklaşık +1). Kırmızı noktalar güçlü negatif korelasyon (r yaklaşık -1). Altın noktalar açık bir sinüzoidal kalıp gösteriyor ama sıfıra yakın Pearson r — korelasyonun sadece <em>doğrusal</em> ilişkileri ölçtüğünü kanıtlıyor.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Çalışma saati (X):</strong> [1, 2, 3, 4, 5]<br><strong>Sınav puanı (Y):</strong> [50, 55, 65, 70, 80]<br><br>x&#772; = 3, y&#772; = 64<br>Sapmalar: X: [-2,-1,0,1,2], Y: [-14,-9,1,6,16]<br>Çarpımlar: [28, 9, 0, 6, 32] &rarr; toplam = 75<br><br>Cov(X,Y) = 75/(5-1) = <strong>18.75</strong><br>s_X = &radic;(10/4) = 1.58, s_Y = &radic;(534/4) = 11.55<br>r = 18.75 / (1.58 &times; 11.55) = <strong>0.99</strong> (çok güçlü pozitif)</div></div>'

+ '<div class="l-warn"><strong>Korelasyon &ne; Nedensellik!</strong> Dondurma satışları ve boğulma ölümleri yüksek korelasyonludur — ama dondurma boğulmaya neden olmaz. İkisi de üçüncü bir değişken tarafından oluşur: sıcak hava. ML\'de korelasyonlu özellikler tahmin için faydalıdır, ama birinin diğerine neden olduğunu varsaymayın.</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\nX = np.<span class="fn">array</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>])\nY = np.<span class="fn">array</span>([<span class="num">50</span>, <span class="num">55</span>, <span class="num">65</span>, <span class="num">70</span>, <span class="num">80</span>])\n\n<span class="cm"># Kovaryans matrisi</span>\ncov_matrix = np.<span class="fn">cov</span>(X, Y)\n<span class="fn">print</span>(<span class="str">"Kov matrisi:\\n"</span>, cov_matrix)\n<span class="cm"># [[2.5, 18.75],</span>\n<span class="cm">#  [18.75, 133.5]]</span>\n<span class="cm"># Köşegen = varyanslar, köşegen dışı = kovaryans</span>\n\n<span class="cm"># Pearson korelasyonu</span>\nr = np.<span class="fn">corrcoef</span>(X, Y)\n<span class="fn">print</span>(<span class="str">"Korelasyon matrisi:\\n"</span>, r)\n<span class="cm"># [[1.0, 0.99],</span>\n<span class="cm">#  [0.99, 1.0]]</span>\n\n<span class="fn">print</span>(<span class="str">f"Cov(X,Y) = {cov_matrix[0,1]:.2f}"</span>)  <span class="cm"># 18.75</span>\n<span class="fn">print</span>(<span class="str">f"r(X,Y) = {r[0,1]:.4f}"</span>)              <span class="cm"># 0.9934</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> <strong>Kovaryans matrisi</strong> PCA\'nın (Temel Bileşenler Analizi) kalbidir. PCA kovaryans matrisinin özvektörlerini bulur — bunlar verinizdeki maksimum varyans yönleridir.</div>'

/* ============================================================
   BÖLÜM 5: Gaussian Dağılımı
   ============================================================ */
+ '<h2 class="l-title">5. Gaussian (Normal) Dağılım</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> 10.000 kişinin boyunu ölçün. Çoğu ortalamanın etrafında kümelenir (diyelim 170 cm), çok uzun veya çok kısa olanlar azdır ve dağılım simetrik bir çan şeklini oluşturur. Bu Gaussian dağılımıdır — tüm istatistik ve ML\'deki en önemli dağılım.</div>'

+ '<p class="l-text"><strong>Gaussian dağılımı</strong> (normal dağılım ya da çan eğrisi olarak da bilinir) sadece iki parametreyle tanımlanır: ortalama &mu; (merkez) ve standart sapma &sigma; (yayılım).</p>'

+ '<div class="calc-formula"><div class="formula-label">GAUSSIAN PDF (OLASILIK YOĞUNLUK FONKSİYONU)</div><div class="formula-main">$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">Çan eğrisi formülü. &mu; merkezi sola/sağa kaydırır, &sigma; genişliği kontrol eder. 1/(&sigma;&radic;2&pi;) terimi toplam alanın 1 olmasını sağlar.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Ortalama (Merkez)</div><div class="card-body">Çan eğrisinin tepesi. Dağılım &mu; etrafında simetriktir. &mu;\'yu kaydırmak tüm eğriyi sola veya sağa hareket ettirir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Std Sapma (Genişlik)</div><div class="card-body">Eğrinin ne kadar yaygın olduğunu kontrol eder. Küçük &sigma; = uzun, dar tepe. Büyük &sigma; = düz, geniş eğri.</div></div>'
+ '<div class="calc-card"><div class="card-title">Üstel Azalma</div><div class="card-body">&mu;\'dan uzak değerler üstel olarak olasılığını yitirir. Üsteki kare terimi simetrik çan şeklini oluşturur.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">68-95-99.7 KURALI</div><div class="formula-main">$$P(\\mu - 1\\sigma \\leq X \\leq \\mu + 1\\sigma) = \\%68.3 \\quad P(\\mu - 2\\sigma \\leq X \\leq \\mu + 2\\sigma) = \\%95.4 \\quad P(\\mu - 3\\sigma \\leq X \\leq \\mu + 3\\sigma) = \\%99.7$$</div><div class="formula-sub">Her Gaussian için: verinin %68\'i 1&sigma;, %95\'i 2&sigma;, %99.7\'si 3&sigma; içindedir.</div></div>'

+ '<div id="plot-gauss-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function gauss(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}'
+ 'var xv=[];for(var i=-50;i<=50;i++)xv.push(i/10);'
+ 'var y1=xv.map(function(x){return gauss(x,0,1);});'
+ 'var y2=xv.map(function(x){return gauss(x,0,2);});'
+ 'var y3=xv.map(function(x){return gauss(x,2,1);});'
+ 'var t1={x:xv,y:y1,mode:"lines",name:"N(0,1) Standart",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xv,y:y2,mode:"lines",name:"N(0,2) Daha Geniş",line:{color:"#4ecdc4",width:2.5}};'
+ 'var t3={x:xv,y:y3,mode:"lines",name:"N(2,1) Kaymış",line:{color:"#f87171",width:2.5}};'
+ 'var layout={title:{text:"Gaussian Dağılımları: &mu; ve &sigma; Etkisi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"f(x)"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-gauss-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Üç Gaussian. Altın: standart normal N(0,1). Turkuaz: N(0,2) — aynı merkez ama daha geniş. Kırmızı: N(2,1) — aynı genişlik ama sağa kaymış.</div></div>'

+ '<div class="calc-highlight"><strong>Merkezi Limit Teoremi (CLT):</strong> Orijinal veriniz hangi dağılımı izlerse izlesin, <em>birçok örneklemin ortalaması</em> yaklaşık olarak Gaussian olacaktır. 30+ rastgele örneklem alın, her birinin ortalamasını hesaplayın — bu ortalamalar bir çan eğrisi oluşturacaktır. Bu yüzden Gaussian her yerde belirir — ve birçok ML algoritması normallik varsayar.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Merkezi Limit Teoremi</div><div class="card-body">Birçok bağımsız rastgele değişkenin toplamı (veya ortalaması), orijinal dağılımdan bağımsız olarak Gaussian\'a yaklaşır. Çıkarımsal istatistiğin köşe taşı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Z-Skoru</div><div class="card-body">z = (x - &mu;) / &sigma;. x\'in ortalamadan kaç standart sapma uzakta olduğunu ölçer. z=2 "ortalamanın 2 sigma üstü" demek.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Standart normal dağılım</span>\nstandard = stats.<span class="fn">norm</span>(loc=<span class="num">0</span>, scale=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">"P(-1 < Z < 1):"</span>, standard.<span class="fn">cdf</span>(<span class="num">1</span>) - standard.<span class="fn">cdf</span>(-<span class="num">1</span>))  <span class="cm"># 0.6827 (%68)</span>\n<span class="fn">print</span>(<span class="str">"P(-2 < Z < 2):"</span>, standard.<span class="fn">cdf</span>(<span class="num">2</span>) - standard.<span class="fn">cdf</span>(-<span class="num">2</span>))  <span class="cm"># 0.9545 (%95)</span>\n<span class="fn">print</span>(<span class="str">"P(-3 < Z < 3):"</span>, standard.<span class="fn">cdf</span>(<span class="num">3</span>) - standard.<span class="fn">cdf</span>(-<span class="num">3</span>))  <span class="cm"># 0.9973 (%99.7)</span>\n\n<span class="cm"># Z-skoru: Bir değer ne kadar olağandışı?</span>\nmu, sigma = <span class="num">170</span>, <span class="num">10</span>   <span class="cm"># cm cinsinden boylar</span>\nx = <span class="num">195</span>\nz = (x - mu) / sigma\n<span class="fn">print</span>(<span class="str">f"Boy {x}cm z-skoru {z:.1f}"</span>)         <span class="cm"># z=2.5 (çok uzun!)</span>\n<span class="fn">print</span>(<span class="str">f"Sadece %{(1-standard.cdf(z))*100:.2f} daha uzun"</span>)  <span class="cm"># %0.62</span>\n\n<span class="cm"># Merkezi Limit Teoremi demosu</span>\nuniform = np.random.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, size=(<span class="num">10000</span>, <span class="num">30</span>))  <span class="cm"># 30\'luk 10k örneklem</span>\nsample_means = uniform.<span class="fn">mean</span>(axis=<span class="num">1</span>)\n<span class="fn">print</span>(<span class="str">f"Örneklem ortalamaları std: {sample_means.std():.4f}"</span>)  <span class="cm"># ~0.0527 (Gaussian!)</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Gaussian dağılımları ML\'nin her yerindedir: (1) <strong>Ağırlık başlangıç değerleri</strong> — N(0, küçük_değer)\'den. (2) <strong>Gaussian Naive Bayes</strong> — özelliklerin sınıf başına Gaussian olduğunu varsayar. (3) <strong>Batch normalization</strong> — aktivasyonları N(0,1)\'e normalize eder. (4) <strong>VAE\'ler</strong> — gizli uzay Gaussian olmaya düzenlenir.</div>'

/* ============================================================
   BÖLÜM 6: Diğer Önemli Dağılımlar
   ============================================================ */
+ '<h2 class="l-title">6. Diğer Önemli Dağılımlar</h2>'

+ '<div class="calc-highlight"><strong>Temel fikir:</strong> Gaussian en ünlü dağılımdır, ama gerçek dünya verileri birçok farklı kalıp izler. Yazı-tura Bernoulli\'dir, kelime sayıları Poisson\'dur, bekleme süreleri Üstel\'dir ve sınıf etiketleri Kategorik\'tir. Verinize hangi dağılımın uyduğunu tanımak, hangi ML modelinin uygun olduğunu belirler.</div>'

+ '<p class="l-text">İşte makine öğrenmesi ve NLP\'de en sık karşılaşacağınız dağılımlar:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Bernoulli</div><div class="card-body"><strong>Tek ikili sonuç.</strong> Yazı-tura: P(yazı)=p, P(tura)=1-p. Spam/spam değil. Sınıflandırmanın yapı taşı.</div><div class="card-formula">P(X=1) = p</div></div>'
+ '<div class="calc-card"><div class="card-title">Binom</div><div class="card-body"><strong>n denemede başarı sayısı.</strong> "100 e-postadan kaçı spam?" Her deneme bağımsız Bernoulli.</div><div class="card-formula">P(X=k) = C(n,k) p^k (1-p)^(n-k)</div></div>'
+ '<div class="calc-card"><div class="card-title">Poisson</div><div class="card-body"><strong>Sabit zaman/alanda nadir olay sayısı.</strong> "Sayfa başına kaç yazım hatası?" Ortalama = &lambda;.</div><div class="card-formula">P(X=k) = &lambda;^k e^(-&lambda;) / k!</div></div>'
+ '<div class="calc-card"><div class="card-title">Üstel</div><div class="card-body"><strong>Olaylar arası süre.</strong> "Sonraki sunucu hatasına kadar ne kadar bekleyeceğiz?" Hafızasız özellik.</div><div class="card-formula">f(x) = &lambda; e^(-&lambda;x)</div></div>'
+ '<div class="calc-card"><div class="card-title">Düzgün</div><div class="card-body"><strong>Her yerde eşit olasılık.</strong> Adil zar atma. [a,b] içerisindeki her değer eşit derecede olası.</div><div class="card-formula">f(x) = 1/(b-a)</div></div>'
+ '<div class="calc-card"><div class="card-title">Kategorik</div><div class="card-body"><strong>K kategoriden biri.</strong> Bernoulli\'nin çoklu sınıfa genellemesi. Çoklu sınıf çıktısı (softmax) için kullanılır.</div><div class="card-formula">P(X=k) = p_k</div></div>'
+ '</div>'

+ '<div id="plot-dists-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'function poisson(k,lam){return Math.pow(lam,k)*Math.exp(-lam)/([1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000][k]||1);}'
+ 'function binom(k,n,p){var c=1;for(var i=0;i<k;i++)c*=(n-i)/(i+1);return c*Math.pow(p,k)*Math.pow(1-p,n-k);}'
+ 'var kv=[];for(var i=0;i<=15;i++)kv.push(i);'
+ 'var pois=kv.map(function(k){return poisson(k,4);});'
+ 'var bino=kv.map(function(k){return binom(k,15,0.3);});'
+ 'var t1={x:kv,y:pois,type:"bar",name:"Poisson(&lambda;=4)",marker:{color:"rgba(200,169,110,0.7)"},width:0.35,offset:-0.175};'
+ 'var t2={x:kv,y:bino,type:"bar",name:"Binom(n=15,p=0.3)",marker:{color:"rgba(78,205,196,0.7)"},width:0.35,offset:0.175};'
+ 'var layout={title:{text:"Poisson vs Binom Dağılımları",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"k (olay sayısı)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X=k)"},margin:{t:50,r:30,b:50,l:50},barmode:"group",showlegend:true,legend:{font:{color:"#ebe6dc"}}};'
+ 'Plotly.newPlot("plot-dists-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> İki ayrık dağılım. Altın çubuklar: &lambda;=4 ile Poisson. Turkuaz çubuklar: n=15, p=0.3 ile Binom. İkisi de ortalamalarına yakın tepe yapar.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Bernoulli: tek yazı-tura</span>\nbern = stats.<span class="fn">bernoulli</span>(p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"P(X=1):"</span>, bern.<span class="fn">pmf</span>(<span class="num">1</span>))  <span class="cm"># 0.7</span>\n\n<span class="cm"># Binom: 10 atış, P(tam 7 yazı)?</span>\nbino = stats.<span class="fn">binom</span>(n=<span class="num">10</span>, p=<span class="num">0.7</span>)\n<span class="fn">print</span>(<span class="str">"P(X=7):"</span>, bino.<span class="fn">pmf</span>(<span class="num">7</span>))  <span class="cm"># 0.2668</span>\n\n<span class="cm"># Poisson: sayfa başına ortalama 3 yazım hatası</span>\npois = stats.<span class="fn">poisson</span>(mu=<span class="num">3</span>)\n<span class="fn">print</span>(<span class="str">"P(X=5):"</span>, pois.<span class="fn">pmf</span>(<span class="num">5</span>))  <span class="cm"># 0.1008</span>\n\n<span class="cm"># Üstel: otobüsler arası ort. 10 dk bekleme</span>\nexpo = stats.<span class="fn">expon</span>(scale=<span class="num">10</span>)\n<span class="fn">print</span>(<span class="str">"P(bekleme &lt; 5 dk):"</span>, expo.<span class="fn">cdf</span>(<span class="num">5</span>))  <span class="cm"># 0.3935</span>\n\n<span class="cm"># Kategorik: softmax çıktısı</span>\nlogits = np.<span class="fn">array</span>([<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>])\nprobs = np.<span class="fn">exp</span>(logits) / np.<span class="fn">exp</span>(logits).<span class="fn">sum</span>()\n<span class="fn">print</span>(<span class="str">"Kategorik olasılıklar:"</span>, probs.round(<span class="num">3</span>))  <span class="cm"># [0.659, 0.242, 0.099]</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Sınıflandırma çıktıları <strong>Kategorik</strong> dağılımlardır (softmax). Belgelerdeki kelime sıklığı <strong>Poisson</strong> benzeri kalıpları izler. <strong>Dropout</strong> Bernoulli kullanır — her nöron bağımsız olarak p olasılığıyla "açık"tır.</div>'

/* ============================================================
   BÖLÜM 7: Maksimum Olabilirlik Tahmini
   ============================================================ */
+ '<h2 class="l-title">7. Maksimum Olabilirlik Tahmini (MLE)</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> Bir madeni parayı 100 kez atıp 73 yazı elde ediyorsunuz. Paranın gerçek yazı olasılığı için "en iyi tahmin" nedir? Sezgisel olarak p=0.73. Maksimum Olabilirlik Tahmini bu sezgiyi resmileştirir: gözlemlenen verinizi <em>en olası</em> kılan parametre değerlerini bul.</div>'

+ '<p class="l-text"><strong>Maksimum Olabilirlik Tahmini (MLE)</strong> istatistik ve ML\'deki en temel parametre tahmin yöntemidir. Şu soruyu cevaplar: "Gözlemlediğim veri göz önüne alındığında, hangi parametre değerleri bu veriyi en olası kılardı?"</p>'

+ '<div class="calc-formula"><div class="formula-label">OLABİLİRLİK FONKSİYONU</div><div class="formula-main">$$\\mathcal{L}(\\theta | x_1, \\ldots, x_n) = \\prod_{i=1}^{n} P(x_i | \\theta)$$</div><div class="formula-sub">Verinin gözlemlenme olasılığı, &theta; parametresinin bir fonksiyonu olarak görülen. Bağımsız veri için bireysel olasılıkların çarpımıdır.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">LOG-OLABİLİRLİK</div><div class="formula-main">$$\\ell(\\theta) = \\ln \\mathcal{L}(\\theta) = \\sum_{i=1}^{n} \\ln P(x_i | \\theta)$$</div><div class="formula-sub">Log, çarpımları toplamlara dönüştürür — optimize etmesi çok daha kolay. Log monoton olduğu için, log-olabilirlik maksimize etmek = olabilirlik maksimize etmek.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MLE ÇÖZÜMÜ</div><div class="formula-main">$$\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_{\\theta} \\sum_{i=1}^{n} \\ln P(x_i | \\theta)$$</div><div class="formula-sub">Log-olabilirliği maksimize eden &theta;\'yı bul. Türev al, sıfıra eşitle, çöz. Veya numerik olarak gradyan yükselmesi kullan.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Olabilirlik</div><div class="card-body">&theta;\'nın olasılığı DEĞİL! &theta; verilen verinin olasılığı, &theta;\'nın bir fonksiyonu olarak görülür. Yüksek = veri bu &theta; ile daha uyumlu.</div></div>'
+ '<div class="calc-card"><div class="card-title">Log-Olabilirlik</div><div class="card-body">Çarpımlar toplamlara dönüşür (sayısal alttaşma yok). Logaritma monoton artan, bu yüzden maksimum değişmez.</div></div>'
+ '<div class="calc-card"><div class="card-title">MLE Tahmini</div><div class="card-body">Olabilirliği maksimize eden parametre değeri. "Veri için en akla yatkın açıklama." Bir nokta tahminidir.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Olabilirliği yaz: L(p) = p^73 (1-p)^27</div><div class="step-detail">p yazı olasılıklı parayla 73 yazı ve 27 tura için</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Logaritmasını al: ln L(p) = 73 ln(p) + 27 ln(1-p)</div><div class="step-detail">Çarpım toplama dönüşür — türev almak çok daha kolay</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Türevi al ve sıfıra eşitle: 73/p - 27/(1-p) = 0</div><div class="step-detail">Log-olabilirliğin kritik noktasını bul</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Çöz: p&#770; = 73/100 = 0.73</div><div class="step-detail">MLE tahmini sadece gözlemlenen orandır. Sezgisel!</div></div></div>'
+ '</div>'

+ '<div id="plot-mle-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var pv=[];var lv=[];for(var i=1;i<=99;i++){var p=i/100;pv.push(p);lv.push(73*Math.log(p)+27*Math.log(1-p));}'
+ 'var t1={x:pv,y:lv,mode:"lines",name:"Log-Olabilirlik",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:[0.73],y:[73*Math.log(0.73)+27*Math.log(0.27)],mode:"markers",name:"MLE: p=0.73",marker:{size:12,color:"#f87171",symbol:"star"}};'
+ 'var layout={title:{text:"Yazı-Tura için Log-Olabilirlik (73 yazı, 27 tura)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"p (yazı olasılığı)"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"ln L(p)"},margin:{t:50,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}},annotations:[{x:0.73,y:73*Math.log(0.73)+27*Math.log(0.27),text:"Maksimum: p=0.73",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f87171",size:12}}]};'
+ 'Plotly.newPlot("plot-mle-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> 73 yazı ve 27 tura ile bir madeni para için log-olabilirlik fonksiyonu. Eğri p=0.73\'te (kırmızı yıldız) tepe yapar — bu MLE tahminidir.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize_scalar\n\n<span class="cm"># Yazı-tura MLE</span>\nheads, tails = <span class="num">73</span>, <span class="num">27</span>\n\n<span class="cm"># Negatif log-olabilirlik (negatifini minimize ederiz)</span>\n<span class="kw">def</span> <span class="fn">neg_log_likelihood</span>(p):\n    <span class="kw">if</span> p <= <span class="num">0</span> <span class="kw">or</span> p >= <span class="num">1</span>: <span class="kw">return</span> <span class="num">1e10</span>\n    <span class="kw">return</span> -(heads * np.<span class="fn">log</span>(p) + tails * np.<span class="fn">log</span>(<span class="num">1</span> - p))\n\nresult = <span class="fn">minimize_scalar</span>(neg_log_likelihood, bounds=(<span class="num">0.01</span>, <span class="num">0.99</span>), method=<span class="str">"bounded"</span>)\n<span class="fn">print</span>(<span class="str">f"MLE tahmini: p = {result.x:.4f}"</span>)  <span class="cm"># 0.7300</span>\n\n<span class="cm"># Gaussian için MLE: en iyi mu ve sigma</span>\ndata = np.random.<span class="fn">normal</span>(loc=<span class="num">5</span>, scale=<span class="num">2</span>, size=<span class="num">1000</span>)\nmu_mle = data.<span class="fn">mean</span>()     <span class="cm"># Ortalama için MLE = örneklem ortalaması</span>\nsig_mle = data.<span class="fn">std</span>()     <span class="cm"># Std için MLE = örneklem std (yanlı)</span>\n<span class="fn">print</span>(<span class="str">f"MLE mu={mu_mle:.3f}, sigma={sig_mle:.3f}"</span>)  <span class="cm"># ~5, ~2</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Neredeyse her ML eğitim prosedürü kılık değiştirmiş MLE\'dir! <strong>Lojistik regresyon</strong> Bernoulli modeli altında gözlemlenen etiketlerin olabilirliğini maksimize eder. <strong>Çapraz entropi kaybı</strong> Kategorik dağılımın negatif log-olabilirliğidir. Bir sinir ağını çapraz entropi kaybıyla eğitmek = ağ parametrelerinin MLE\'sini bulmaktır.</div>'

/* ============================================================
   BÖLÜM 8: Hipotez Testi Temelleri
   ============================================================ */
+ '<h2 class="l-title">8. Hipotez Testi Temelleri</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayat benzetmesi:</strong> Bir ilaç şirketi yeni bir ilacın işe yaradığını iddia ediyor. Bir mahkeme "aksi kanıtlanana kadar masum" varsayar. Benzer şekilde, hipotez testi ilacın işe yaraMAdığını varsayarak başlar (sıfır hipotezi), sonra sorar: "Gözlemlenen kanıt bu varsayımı yanlış kılacak kadar aşırı mı?" Eğer cevap evet ise, sıfırı reddediyor ve ilacın muhtemelen işe yaradığını sonuçlandırıyoruz.</div>'

+ '<p class="l-text"><strong>Hipotez testi</strong>, veriden karar verme için resmi bir çerçevedir. "Bu sonuç gerçek mi, yoksa sadece rastgele gürültü mü?" sorusunu sayısallaştırır — her ML uygulayıcısının cevaplaması gereken bir soru.</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">SIFIR HİPOTEZİ (H&sub0;)</div><div class="compare-item">&bull; "Sıkıcı" açıklama: ilginç bir şey olmadı</div><div class="compare-item">&bull; "Yeni model taban çizgisinden daha iyi DEĞİL"</div><div class="compare-item">&bull; H&sub0;\'ın doğru olduğunu varsayarız</div></div><div class="compare-col"><div class="compare-title">ALTERNATİF HİPOTEZ (H&sub1;)</div><div class="compare-item">&bull; Desteklemek istediğimiz "ilginç" iddia</div><div class="compare-item">&bull; "Yeni model taban çizgisinden daha iyi"</div><div class="compare-item">&bull; H&sub0;\'a karşı kanıt güçlüyse H&sub1;\'i kabul ederiz</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">P-DEĞERİ</div><div class="formula-main">$$p\\text{-value} = P(\\text{observe data this extreme} \\,|\\, H_0 \\text{ true})$$</div><div class="formula-sub">Küçük p-değeri = veri H&sub0; altında olası değil = H&sub0;\'a karşı kanıt. Genellikle p < 0.05 "istatistiksel olarak anlamlı" kabul edilir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">P-Değeri</div><div class="card-body">H&sub0;\'ın doğru olma olasılığı DEĞİL! "H&sub0; doğru olsaydı, bu veri ne kadar şaşırtıcı olurdu?" Küçük p = çok şaşırtıcı = H&sub0;\'ı reddet.</div></div>'
+ '<div class="calc-card"><div class="card-title">Anlamlılık Düzeyi</div><div class="card-body">Red eşiği (genellikle 0.05). p < &alpha; ise H&sub0;\'ı reddet. Daha küçük &alpha; = daha sıkı kanıt standardı.</div></div>'
+ '<div class="calc-card"><div class="card-title">Güven Aralığı</div><div class="card-body">Gerçek parametreyi içerme olasılığı yüksek bir aralık. "%95 GA: [2.1, 3.9]" gerçek değerin bu aralıkta olduğuna %95 güvendiğimiz anlamına gelir.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">ORTALAMA İÇİN GÜVEN ARALIĞI</div><div class="formula-main">$$\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{s}{\\sqrt{n}}$$</div><div class="formula-sub">Örneklem ortalaması &plusmn; hata payı. %95 GA için: z = 1.96. Büyük n = dar aralık = daha kesin tahmin.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Yanlış Pozitif</div><div class="card-body">H&sub0; aslında doğruyken reddetmek. "Model daha iyi dedik, ama değil." Olasılık = &alpha;.</div></div>'
+ '<div class="calc-card"><div class="card-title">Yanlış Negatif</div><div class="card-body">H&sub0; aslında yanlışken reddedememek. "Gerçek bir iyileşmeyi kaçırdık." Olasılık = &beta;.</div></div>'
+ '<div class="calc-card"><div class="card-title">Güç (Power)</div><div class="card-body">Gerçek bir etkiyi doğru biçimde tespit etme olasılığı. Daha yüksek güç = daha az kaçırılan keşif. Daha fazla veriyle artar.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Senaryo:</strong> Yeni NLP modeliniz %87.3 doğruluk, taban çizgisi %85.1 alıyor. Bu iyileşme gerçek mi?<br><br><strong>H&sub0;:</strong> Fark yok (iyileşme rastgele değişkenlikten kaynaklanır)<br><strong>H&sub1;:</strong> Yeni model gerçekten daha iyi<br><br>50 test setinde eşleştirilmiş t-testi sonrası:<br>t-istatistiği = 2.84, p-değeri = 0.006<br><br>p = 0.006 < &alpha; = 0.05 olduğu için <strong>H&sub0;\'ı reddediyoruz</strong>. İyileşme istatistiksel olarak anlamlıdır. Fakat aynı zamanda <em>pratik</em> olarak anlamlı olup olmadığını kontrol edin — üretim sisteminde %0.1 iyileşme ekstra karmaşıklığı haklı çıkarmayabilir.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> scipy <span class="kw">import</span> stats\n\n<span class="cm"># Her biri 50 test setinde test edilen iki model</span>\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)\nmodel_a = np.random.<span class="fn">normal</span>(<span class="num">85.1</span>, <span class="num">3</span>, size=<span class="num">50</span>)  <span class="cm"># taban çizgisi</span>\nmodel_b = np.random.<span class="fn">normal</span>(<span class="num">87.3</span>, <span class="num">3</span>, size=<span class="num">50</span>)  <span class="cm"># yeni model</span>\n\n<span class="cm"># Eşleştirilmiş t-testi (aynı test setleri)</span>\nt_stat, p_value = stats.<span class="fn">ttest_rel</span>(model_b, model_a)\n<span class="fn">print</span>(<span class="str">f"t-istatistiği: {t_stat:.3f}"</span>)\n<span class="fn">print</span>(<span class="str">f"p-değeri: {p_value:.4f}"</span>)\n<span class="fn">print</span>(<span class="str">f"Anlamlı mı? {p_value < 0.05}"</span>)  <span class="cm"># True</span>\n\n<span class="cm"># Ortalama fark için %95 Güven Aralığı</span>\ndiff = model_b - model_a\nmean_diff = diff.<span class="fn">mean</span>()\nse = diff.<span class="fn">std</span>(ddof=<span class="num">1</span>) / np.<span class="fn">sqrt</span>(<span class="fn">len</span>(diff))\nci_low = mean_diff - <span class="num">1.96</span> * se\nci_high = mean_diff + <span class="num">1.96</span> * se\n<span class="fn">print</span>(<span class="str">f"Ortalama iyileşme: {mean_diff:.2f}%"</span>)\n<span class="fn">print</span>(<span class="str">f"%95 GA: [{ci_low:.2f}, {ci_high:.2f}]"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> Her zaman sadece nokta tahminleri değil <strong>güven aralıkları</strong> raporlayın. "Modelimiz %87.3 &plusmn; %1.2 doğruluk elde ediyor" "%87.3 doğruluk"tan çok daha bilgilendiricidir. NLP makalelerinde modelleri karşılaştırmak için <strong>eşleştirilmiş bootstrap testleri</strong> standarttır.</div>'

/* ============================================================
   BÖLÜM 9: ML\'de İstatistik
   ============================================================ */
+ '<h2 class="l-title">9. ML Pratiğinde İstatistik</h2>'

+ '<div class="calc-highlight"><strong>Temel fikir:</strong> ML değerlendirmesindeki her şey istatistiktir. Çapraz doğrulama tekrarlanan örneklemedir. Bootstrap belirsizlik tahmin eder. A/B testi hipotez testleri kullanır. Özellik seçimi korelasyon kullanır. İstatistiği anlarsanız, ML en iyi uygulamalarının neden işe yaradığını — ve ne zaman yanlış gidebileceğini — anlarsınız.</div>'

+ '<p class="l-text">Öğrendiğimiz istatistiksel kavramları, her gün kullanacağınız ML tekniklerine bağlayalım:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">K-Katlamalı Çapraz Doğrulama</div><div class="card-body">Veriyi K kata böl, K-1\'inde eğit, 1\'inde test et, rotasyon yap. K doğruluk tahmini verir &rarr; <strong>ortalama &plusmn; std</strong> hesapla.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bootstrap</div><div class="card-body">Yerine koyarak örnekle, istatistik hesapla, 1000+ kez tekrarla. Tahmininizin tam dağılımını elde edin.</div></div>'
+ '<div class="calc-card"><div class="card-title">A/B Testi</div><div class="card-body">Kullanıcıların yarısına A versiyonunu, diğer yarısına B\'yi gösterin. Hipotez testi: "B anlamlı olarak A\'dan iyi mi?"</div></div>'
+ '<div class="calc-card"><div class="card-title">Özellik Korelasyonu</div><div class="card-body">Özelliklerin korelasyon matrisini hesaplayın. Yüksek korelasyonlu özellikler gereksiz — birini çıkararak çoklu doğrusallığı azaltın.</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-num">1</div><div class="flow-label">KVA</div><div class="flow-desc">Betimsel istatistik: ortalama, std, histogram, korelasyon matrisi.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">2</div><div class="flow-label">Özellik Müh.</div><div class="flow-desc">Standardizasyon, aykırı değer tespiti, korelasyon tabanlı seçim.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">3</div><div class="flow-label">Model Eğitimi</div><div class="flow-desc">Kayıp minimizasyonu = MLE. Çapraz entropi = negatif log-olabilirlik.</div></div>'
+ '<div class="flow-arrow">&rarr;</div>'
+ '<div class="flow-step"><div class="flow-num">4</div><div class="flow-label">Değerlendirme</div><div class="flow-desc">Çapraz doğrulama, bootstrap GA, eşleştirilmiş t-testleri, A/B testi.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Model Doğruluğu için Bootstrap Güven Aralığı:</strong><br><br>Modelinizi 200 örnek üzerinde test ettiniz ve 174 doğru (%87 doğruluk) elde ettiniz. Ama ne kadar eminsiniz?<br><br>Bootstrap prosedürü:<br>1. 200 tahmini yerine koyarak yeniden örnekleyin<br>2. Bu bootstrap örneklemi üzerinde doğruluğu hesaplayın<br>3. 10.000 kez tekrarlayın<br>4. 2.5. ve 97.5. yüzdelikleri alın<br><br>Sonuç: %95 GA = [%82.0, %91.5]</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score\n<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression\n\n<span class="cm"># K-Katlamalı Çapraz Doğrulama: ortalama +/- std elde et</span>\n<span class="cm"># model = LogisticRegression()</span>\n<span class="cm"># scores = cross_val_score(model, X, y, cv=5)</span>\n<span class="cm"># print(f"Doğruluk: {scores.mean():.3f} +/- {scores.std():.3f}")</span>\n\n<span class="cm"># Bootstrap güven aralığı</span>\nnp.random.<span class="fn">seed</span>(<span class="num">42</span>)\ny_true = np.<span class="fn">array</span>([<span class="num">1</span>]*<span class="num">174</span> + [<span class="num">0</span>]*<span class="num">26</span>)  <span class="cm"># 174 doğru, 26 yanlış</span>\n\nn_bootstrap = <span class="num">10000</span>\nboot_accs = []\n<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_bootstrap):\n    sample = np.random.<span class="fn">choice</span>(y_true, size=<span class="fn">len</span>(y_true), replace=<span class="num">True</span>)\n    boot_accs.<span class="fn">append</span>(sample.<span class="fn">mean</span>())\n\nboot_accs = np.<span class="fn">array</span>(boot_accs)\nci_low = np.<span class="fn">percentile</span>(boot_accs, <span class="num">2.5</span>) * <span class="num">100</span>\nci_high = np.<span class="fn">percentile</span>(boot_accs, <span class="num">97.5</span>) * <span class="num">100</span>\n<span class="fn">print</span>(<span class="str">f"Bootstrap %95 GA: [{ci_low:.1f}%, {ci_high:.1f}%]"</span>)\n\n<span class="cm"># Özellik korelasyon analizi</span>\n<span class="cm"># corr_matrix = df.corr()</span>\n<span class="cm"># high_corr = (corr_matrix.abs() > 0.9) &amp; (corr_matrix != 1.0)</span>\n<span class="cm"># print("Yüksek korelasyonlu özellik çiftleri:", high_corr.sum().sum() // 2)</span></code></pre></div>'

+ '<div class="l-note"><strong>ML Bağlantısı:</strong> <strong>Düzenlileştirme</strong> (L1, L2) istatistiksel bir yoruma sahiptir: MLE\'ye bir <strong>önsav</strong> ekler, MAP (Sonsal Maksimum) tahminine dönüştürür. L2 düzenlileştirme = ağırlıklarda Gaussian önsav. L1 düzenlileştirme = ağırlıklarda Laplace önsav. Bu, frekansçı ve Bayesçi istatistik arasındaki köprüdür.</div>'

/* ============================================================
   BÖLÜM 10: Özet & Sonraki Adımlar
   ============================================================ */
+ '<h2 class="l-title">10. Özet & Sonraki Adımlar</h2>'

+ '<p class="l-text">Bu ders, her ML uygulayıcısının ihtiyaç duyduğu istatistiksel araçları kapsadı. İşte tam kavram haritanız:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Betimsel vs Çıkarımsal</div><div class="card-body">Verinizi özetleyin (betimsel) vs. örneklemlerden popülasyonlara genelleyin (çıkarımsal). ML eğitimi = bir örneklemden çıkarım.</div><div class="card-formula">Örneklem &rarr; Popülasyon</div></div>'
+ '<div class="calc-card"><div class="card-title">Merkezi Eğilim</div><div class="card-body">Ortalama, medyan, mod. Çarpık veri için medyan kullanın. MSE &rarr; ortalama, MAE &rarr; medyan.</div><div class="card-formula">x&#772; = &Sigma;x/n</div></div>'
+ '<div class="calc-card"><div class="card-title">Yayılım</div><div class="card-body">Varyans, std sapma, IQR. Standart sapma = ortalamadan ortalama mesafe. Standardizasyon: z = (x-&mu;)/&sigma;.</div><div class="card-formula">&sigma; = &radic;Var(X)</div></div>'
+ '<div class="calc-card"><div class="card-title">Korelasyon</div><div class="card-body">Std sapmalarla normalize kovaryans. -1 ile +1. Sadece doğrusal ilişkiyi ölçer. Korelasyon &ne; nedensellik!</div><div class="card-formula">r = Cov(X,Y)/(s_X s_Y)</div></div>'
+ '<div class="calc-card"><div class="card-title">Gaussian Dağılımı</div><div class="card-body">&mu; ve &sigma; ile tanımlanan çan eğrisi. 68-95-99.7 kuralı. Merkezi Limit Teoremi onu evrensel kılar.</div><div class="card-formula">f(x) = (1/&sigma;&radic;2&pi;)e^(-(x-&mu;)&sup2;/2&sigma;&sup2;)</div></div>'
+ '<div class="calc-card"><div class="card-title">Diğer Dağılımlar</div><div class="card-body">Bernoulli (ikili), Binom (sayım), Poisson (nadir olaylar), Üstel (bekleme), Kategorik (sınıflar).</div><div class="card-formula">Dağılımı veri türüne eşleştir</div></div>'
+ '<div class="calc-card"><div class="card-title">Maksimum Olabilirlik</div><div class="card-body">Gözlemlenen veriyi en olası kılan parametreleri bul. Çapraz entropi = negatif log-olabilirlik. Eğitim = MLE!</div><div class="card-formula">&theta;&#770; = argmax &Sigma; ln P(x|&theta;)</div></div>'
+ '<div class="calc-card"><div class="card-title">Hipotez Testi</div><div class="card-body">Sıfır vs alternatif hipotez. p-değeri H&sub0; altında şaşırmayı ölçer. Her zaman güven aralıkları raporlayın.</div><div class="card-formula">p < 0.05 &rarr; anlamlı</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Sonraki Ders:</strong> Ders 3\'te <strong>Optimizasyon</strong>\'a geçiyoruz — gradyan inişi, öğrenme hızı, dışbükeylik ve yakınsama. Optimizasyon, istatistiğin kalkülüs ile buluştuğu noktadır: olabilirliği (istatistik) maksimize etmek için gradyanları (kalkülüs) kullanırız. Bu, her sinir ağını güçlendiren motordur.</div>'

};