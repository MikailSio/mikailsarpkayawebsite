window.LISE_MAT_L105 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Height, weight, blood pressure, IQ, exam scores, measurement errors, daily temperature, manufacturing tolerances.</strong> If you collect enough data on almost any natural quantity, the histogram you get back has the same shape: a single peak in the middle, symmetric, gently rounded shoulders, tails that fade quickly. This shape — the <em>bell curve</em> — is called the <strong>normal distribution</strong>, and it is so prevalent that the word "normal" became its name. It is the single most important continuous probability distribution in all of statistics.</p>

<p class="l-text">In this lesson we meet the normal distribution as a preview: enough to read $\\mu$ and $\\sigma$ off a curve, to use the famous 68-95-99.7 rule, to compute z-scores and standardise, and to handle questions like "what percent of adults are taller than 190 cm?" or "what IQ score puts you in the top 2.5%?". The deep theory (calculus integrals, central limit theorem proofs) comes later — but the practical power is already here.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise the bell-shaped normal distribution $N(\\mu, \\sigma^2)$ and read $\\mu, \\sigma$ off its graph</li>
<li>Apply the empirical rule (68-95-99.7) to estimate probabilities of intervals around the mean</li>
<li>Standardise any normal variable to the standard normal $Z \\sim N(0,1)$ using $z = (x-\\mu)/\\sigma$</li>
<li>Use z-scores to compare values from different distributions and find percentiles</li>
<li>Compute common probabilities like $P(Z \\leq 1.96) \\approx 0.975$ and recognise their use in confidence intervals</li>
<li>Recognise when the normal can approximate the binomial and preview the central limit theorem</li>
</ul>
</div>

<h2 class="lesson-title">1. The Bell Curve: A First Look</h2>

<div class="calc-highlight"><strong>A normal distribution is described by exactly two numbers: the mean $\\mu$ and the standard deviation $\\sigma$.</strong> The mean tells you where the peak sits on the horizontal axis. The standard deviation tells you how wide the bell is — small $\\sigma$ gives a tall thin bell, large $\\sigma$ gives a short wide one. The total area under the curve is always 1, because it represents total probability.</div>

<p class="l-text">We write $X \\sim N(\\mu, \\sigma^2)$ to say "$X$ is a normal random variable with mean $\\mu$ and variance $\\sigma^2$" (so standard deviation $\\sigma$). Sometimes you will see $X \\sim N(\\mu, \\sigma)$ in textbooks; the variance vs standard deviation convention varies, so always check.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shape</div><div class="card-body">Symmetric about $\\mu$. One peak (unimodal). The peak height is $1/(\\sigma\\sqrt{2\\pi})$. Tails approach the x-axis but never touch it.</div></div>
<div class="calc-card"><div class="card-title">Location</div><div class="card-body">The mean $\\mu$ is the centre. It equals the median and the mode — all three coincide because the curve is symmetric.</div></div>
<div class="calc-card"><div class="card-title">Spread</div><div class="card-body">The standard deviation $\\sigma$ controls width. Inflection points (where the curve changes concavity) sit exactly at $\\mu \\pm \\sigma$.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">NORMAL PROBABILITY DENSITY (PREVIEW)</div><div class="formula-main">$$f(x) \\;=\\; \\frac{1}{\\sigma\\sqrt{2\\pi}} \\, \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">You will not be asked to integrate this in high school. Just know its shape: a symmetric bell centred at $\\mu$ with spread $\\sigma$. Probabilities are areas under this curve.</div></div>

<p class="l-text">Areas under the curve give probabilities. For a continuous distribution, $P(X = c) = 0$ for any single point $c$ (a line has zero width), so we always work with intervals: $P(a < X < b)$ is the area of the strip between $x=a$ and $x=b$.</p>

<div class="calc-graph"><div id="plot-l105-three-bells-en" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three different normal curves on the same axes. $N(0,1)$ is the standard normal (centre, narrow). $N(0,4)$ has the same mean but variance 4 ($\\sigma = 2$): the same centre but twice as wide and half as tall. $N(3,1)$ has mean 3 (shifted right) and the same width as the standard normal. Notice how $\\mu$ slides the curve left/right and $\\sigma$ stretches it.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-60;i<=80;i++){xs.push(i/10);}
var y1=xs.map(function(x){return normPdf(x,0,1);});
var y2=xs.map(function(x){return normPdf(x,0,2);});
var y3=xs.map(function(x){return normPdf(x,3,1);});
var t1={x:xs,y:y1,mode:'lines',name:'N(0, 1)',line:{color:'#3b82f6',width:2.6}};
var t2={x:xs,y:y2,mode:'lines',name:'N(0, 4)',line:{color:'#f59e0b',width:2.4}};
var t3={x:xs,y:y3,mode:'lines',name:'N(3, 1)',line:{color:'#10b981',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'density f(x)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-three-bells-en',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. The Standard Normal $Z \\sim N(0,1)$</h2>

<div class="calc-highlight"><strong>Among all normal distributions one is special: the standard normal with $\\mu = 0$ and $\\sigma = 1$.</strong> We give it its own letter — $Z$. Every normal distribution can be converted into the standard normal by a simple change of units, so any probability question about any normal can be answered using a single table of $Z$ values.</div>

<div class="calc-formula"><div class="formula-label">STANDARD NORMAL</div><div class="formula-main">$$Z \\sim N(0, 1), \\qquad f_Z(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2}$$</div><div class="formula-sub">Mean 0, variance 1, standard deviation 1. The peak height is $1/\\sqrt{2\\pi} \\approx 0.3989$.</div></div>

<p class="l-text">The graph of $Z$ is the famous symmetric bell centred at zero with inflection points at $\\pm 1$. Almost all of its area sits between $z = -3$ and $z = 3$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$P(Z \\leq 0) = 0.5$</div><div class="card-body">By symmetry the area to the left of zero equals the area to the right. Each half has total probability $0.5$.</div></div>
<div class="calc-card"><div class="card-title">$P(Z \\leq z) + P(Z \\geq z) = 1$</div><div class="card-body">Any single point has probability zero, so the two complementary intervals sum to 1. Useful for converting "right tail" into "left tail" and vice versa.</div></div>
<div class="calc-card"><div class="card-title">$P(Z \\leq -z) = P(Z \\geq z)$</div><div class="card-body">Symmetry of the bell: reflecting $z$ through zero reflects the area. So negative z-values can be looked up using their absolute value.</div></div>
</div>

<h2 class="lesson-title">3. Standardising: From Any Normal to $Z$</h2>

<div class="calc-highlight"><strong>If $X \\sim N(\\mu, \\sigma^2)$, then $Z = (X - \\mu)/\\sigma$ has the standard normal distribution.</strong> This single transformation lets one z-table answer every normal-distribution question. Subtract the mean, divide by the standard deviation: now everything is measured in units of "standard deviations from the mean".</div>

<div class="calc-formula"><div class="formula-label">STANDARDISATION</div><div class="formula-main">$$Z \\;=\\; \\frac{X - \\mu}{\\sigma} \\qquad \\Longleftrightarrow \\qquad X \\;=\\; \\mu + \\sigma Z$$</div><div class="formula-sub">$z$ is called the <em>z-score</em> of $x$. It says how many standard deviations above (or below, if negative) the mean the value $x$ lies.</div></div>

<p class="l-text">The point of the z-score is comparison. A score of 75 on a test where $\\mu = 70, \\sigma = 5$ gives $z = (75-70)/5 = 1$ — one standard deviation above average. A score of 80 on a different test with $\\mu = 60, \\sigma = 20$ gives $z = (80-60)/20 = 1$ — also one standard deviation above average. The raw scores are very different, but the z-scores say "equally above average for that test".</p>

<div class="calc-example"><div class="example-label">EXAMPLE</div><div class="example-body">Heights of adult men in some population are modelled by $X \\sim N(175, 8^2)$, i.e. $\\mu = 175$ cm, $\\sigma = 8$ cm. Find the z-scores for $x = 167$, $x = 175$, $x = 191$.<br><br>$z(167) = (167-175)/8 = -1$. One SD below the mean.<br>$z(175) = (175-175)/8 = 0$. Exactly at the mean.<br>$z(191) = (191-175)/8 = 2$. Two SDs above the mean.<br><br>So a man 191 cm tall is unusually tall in this population — only about 2.5% of men are taller (by the empirical rule).</div></div>

<h2 class="lesson-title">4. The Empirical Rule: 68-95-99.7</h2>

<div class="calc-highlight"><strong>For any normal distribution, the percentages of data within 1, 2, and 3 standard deviations of the mean are universal.</strong> These numbers do not depend on $\\mu$ or $\\sigma$ — only on the shape of the normal curve. They are the single most useful fact about the normal distribution.</div>

<div class="calc-formula"><div class="formula-label">EMPIRICAL RULE</div><div class="formula-main">$$P(\\mu - \\sigma \\leq X \\leq \\mu + \\sigma) \\approx 0.68$$ $$P(\\mu - 2\\sigma \\leq X \\leq \\mu + 2\\sigma) \\approx 0.95$$ $$P(\\mu - 3\\sigma \\leq X \\leq \\mu + 3\\sigma) \\approx 0.997$$</div><div class="formula-sub">In words: about 68% of the data falls within 1 SD, about 95% within 2 SDs, and about 99.7% within 3 SDs of the mean.</div></div>

<div class="calc-graph"><div id="plot-l105-empirical-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the standard normal curve with the 68%, 95%, and 99.7% regions shaded in three different shades of blue. The darkest band ($z \\in [-1,1]$) contains about 68% of the area. Extending to $[-2,2]$ adds another 27% (total 95%). Extending to $[-3,3]$ adds the last 4.7% (total 99.7%). Beyond $\\pm 3$ lies only 0.3% of the area.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-400;i<=400;i++){xs.push(i/100);}
var ys=xs.map(function(x){return normPdf(x,0,1);});
function band(lo,hi){var bx=[],by=[];for(var i=0;i<xs.length;i++){if(xs[i]>=lo&&xs[i]<=hi){bx.push(xs[i]);by.push(ys[i]);}}return {x:bx,y:by};}
var b3=band(-3,3),b2=band(-2,2),b1=band(-1,1);
var t3={x:b3.x,y:b3.y,fill:'tozeroy',mode:'none',name:'99.7% (3σ)',fillcolor:'rgba(59,130,246,0.18)'};
var t2={x:b2.x,y:b2.y,fill:'tozeroy',mode:'none',name:'95% (2σ)',fillcolor:'rgba(59,130,246,0.35)'};
var t1={x:b1.x,y:b1.y,fill:'tozeroy',mode:'none',name:'68% (1σ)',fillcolor:'rgba(59,130,246,0.60)'};
var curve={x:xs,y:ys,mode:'lines',name:'N(0, 1)',line:{color:'#60a5fa',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z (standard deviations from mean)',gridcolor:'rgba(255,255,255,0.06)',dtick:1,range:[-4,4],zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-empirical-en',[t3,t2,t1,curve],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Half of each band sits on each side.</strong> By symmetry, $P(\\mu \\leq X \\leq \\mu + \\sigma) \\approx 0.34$ (half of 68%), $P(X \\geq \\mu + \\sigma) \\approx 0.16$ (half of the leftover 32%), $P(X \\geq \\mu + 2\\sigma) \\approx 0.025$ (half of the leftover 5%), and $P(X \\geq \\mu + 3\\sigma) \\approx 0.0015$ (half of the leftover 0.3%). These few numbers are enough to answer most exam questions.</p>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">If $X \\sim N(50, 10^2)$, between which two values does the middle 95% of the data lie? Answer: between $\\mu - 2\\sigma = 50 - 20 = 30$ and $\\mu + 2\\sigma = 50 + 20 = 70$. So 95% of outcomes fall in $[30, 70]$.</div></div>

<div class="calc-graph"><div id="plot-l105-empirical-en-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 68-95-99.7 rule made explicit on the standard normal $N(0,1)$. The innermost blue band ($\\pm 1\\sigma$) holds <strong>68%</strong> of the area, the orange ring ($\\pm 2\\sigma$ minus $\\pm 1\\sigma$) adds another <strong>27%</strong> (for 95% total), and the outer red ring ($\\pm 3\\sigma$ minus $\\pm 2\\sigma$) adds the last <strong>4.7%</strong> (for 99.7% total). Beyond $\\pm 3\\sigma$ only 0.3% of area remains in the two tails combined.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-400;i<=400;i++){xs.push(i/100);}
var ys=xs.map(function(x){return normPdf(x,0,1);});
function band(lo,hi){var bx=[],by=[];for(var i=0;i<xs.length;i++){if(xs[i]>=lo&&xs[i]<=hi){bx.push(xs[i]);by.push(ys[i]);}}return {x:bx,y:by};}
var b3=band(-3,3),b2=band(-2,2),b1=band(-1,1);
var t3={x:b3.x,y:b3.y,fill:'tozeroy',mode:'none',name:'±3σ → 99.7%',fillcolor:'rgba(239,68,68,0.45)'};
var t2={x:b2.x,y:b2.y,fill:'tozeroy',mode:'none',name:'±2σ → 95%',fillcolor:'rgba(245,158,11,0.55)'};
var t1={x:b1.x,y:b1.y,fill:'tozeroy',mode:'none',name:'±1σ → 68%',fillcolor:'rgba(59,130,246,0.72)'};
var curve={x:xs,y:ys,mode:'lines',name:'N(0, 1)',line:{color:'#e8e8e8',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z (standard deviations from mean)',gridcolor:'rgba(255,255,255,0.06)',dtick:1,range:[-4,4],zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.06)',range:[0,0.46]},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:0,y:0.20,text:'<b>68%</b>',showarrow:false,font:{color:'#ffffff',size:15}},{x:-1.5,y:0.10,text:'<b>13.5%</b>',showarrow:false,font:{color:'#1a1a1a',size:12}},{x:1.5,y:0.10,text:'<b>13.5%</b>',showarrow:false,font:{color:'#1a1a1a',size:12}},{x:-2.5,y:0.030,text:'<b>2.35%</b>',showarrow:false,font:{color:'#ffffff',size:11}},{x:2.5,y:0.030,text:'<b>2.35%</b>',showarrow:false,font:{color:'#ffffff',size:11}},{x:-3.5,y:0.012,text:'<b>0.15%</b>',showarrow:true,arrowhead:2,arrowcolor:'#ef4444',ax:-30,ay:-30,font:{color:'#fca5a5',size:11}},{x:3.5,y:0.012,text:'<b>0.15%</b>',showarrow:true,arrowhead:2,arrowcolor:'#ef4444',ax:30,ay:-30,font:{color:'#fca5a5',size:11}}]};
Plotly.newPlot('plot-l105-empirical-en-extra',[t3,t2,t1,curve],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Common Z-Values and Their Probabilities</h2>

<div class="calc-highlight"><strong>A handful of z-values come up so often you should memorise their associated probabilities.</strong> These are the "critical values" behind 90%, 95%, and 99% confidence intervals — the most important intervals in introductory statistics.</div>

<div class="calc-formula"><div class="formula-label">CRITICAL Z-VALUES (LEFT-TAIL PROBABILITIES)</div><div class="formula-main">$$P(Z \\leq 1.645) \\approx 0.95 \\qquad P(Z \\leq 1.96) \\approx 0.975 \\qquad P(Z \\leq 2.576) \\approx 0.995$$</div><div class="formula-sub">By symmetry: $P(Z \\leq -1.645) \\approx 0.05$, $P(Z \\leq -1.96) \\approx 0.025$, $P(Z \\leq -2.576) \\approx 0.005$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Middle 90%</div><div class="card-body">$P(-1.645 \\leq Z \\leq 1.645) \\approx 0.90$. So 5% lies in each tail beyond $\\pm 1.645$.</div></div>
<div class="calc-card"><div class="card-title">Middle 95%</div><div class="card-body">$P(-1.96 \\leq Z \\leq 1.96) \\approx 0.95$. So 2.5% lies in each tail beyond $\\pm 1.96$. This is the most-used pair of critical values in all of statistics.</div></div>
<div class="calc-card"><div class="card-title">Middle 99%</div><div class="card-body">$P(-2.576 \\leq Z \\leq 2.576) \\approx 0.99$. So 0.5% lies in each tail beyond $\\pm 2.576$.</div></div>
</div>

<div class="l-note"><strong>Common notation:</strong> $z_{\\alpha}$ denotes the value with right-tail area $\\alpha$, i.e. $P(Z \\geq z_{\\alpha}) = \\alpha$. So $z_{0.025} = 1.96$, $z_{0.05} = 1.645$, $z_{0.005} = 2.576$. You will meet these symbols in later statistics courses for confidence intervals and hypothesis tests.</div>

<div style="margin:1.5rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.25);border-radius:8px;overflow:hidden"><caption style="caption-side:top;text-align:left;font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;padding:0.6rem 0.9rem;background:rgba(59,130,246,0.10)">REFERENCE TABLE — COMMON Z-SCORES &amp; CONFIDENCE LEVELS</caption><thead><tr style="background:rgba(59,130,246,0.14);color:#e8e8e8"><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">z-score</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">$P(Z \\leq z)$ (left tail)</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">Two-tailed confidence $P(-z \\leq Z \\leq z)$</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">Use case</th></tr></thead><tbody style="color:rgba(235,230,220,0.92)"><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.282</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.900</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>80%</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Quick estimates, loose bounds</td></tr><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.645</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.950</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>90%</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">One-tailed 5% tests; 90% CIs</td></tr><tr style="background:rgba(59,130,246,0.06)"><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.960</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.975</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>95%</strong> (most common)</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Standard 95% CIs and tests</td></tr><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">2.326</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.990</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>98%</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">One-tailed 1% tests</td></tr><tr><td style="padding:0.6rem 0.9rem;font-weight:600;color:#60a5fa">2.576</td><td style="padding:0.6rem 0.9rem">0.995</td><td style="padding:0.6rem 0.9rem"><strong>99%</strong></td><td style="padding:0.6rem 0.9rem">Strict 99% CIs; tight tolerance</td></tr></tbody></table></div>

<h2 class="lesson-title">6. The IQ Example: Putting It All Together</h2>

<div class="calc-highlight"><strong>IQ scores are designed by definition to follow a normal distribution with $\\mu = 100$ and $\\sigma = 15$.</strong> So $X \\sim N(100, 15^2)$. This makes IQ the textbook example for normal distribution problems.</div>

<div class="calc-graph"><div id="plot-l105-iq-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the IQ distribution $N(100, 15^2)$ with vertical dashed lines at $x = 85, 100, 115, 130$ — corresponding to z-scores $-1, 0, 1, 2$. The middle hump between 85 and 115 holds about 68% of the population. Going out to 130 (z = 2) covers about 97.5% on the left side, leaving only 2.5% of the population above IQ 130.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=400;i<=1600;i++){xs.push(i/10);}
var ys=xs.map(function(x){return normPdf(x,100,15);});
var curve={x:xs,y:ys,mode:'lines',name:'IQ ~ N(100, 15²)',line:{color:'#3b82f6',width:2.6},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.12)'};
function vline(xv,col,lbl){return {x:[xv,xv],y:[0,normPdf(xv,100,15)*1.05],mode:'lines',name:lbl,line:{color:col,width:2,dash:'dash'},showlegend:true};}
var v1=vline(85,'#f59e0b','IQ 85 (z = -1)');
var v2=vline(100,'#e2e8f0','IQ 100 (z = 0)');
var v3=vline(115,'#10b981','IQ 115 (z = 1)');
var v4=vline(130,'#ef4444','IQ 130 (z = 2)');
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'IQ score',gridcolor:'rgba(255,255,255,0.06)',range:[40,160]},yaxis:{title:'density',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-iq-en',[curve,v1,v2,v3,v4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IQ ABOVE 130</div><div class="example-body">What percent of people have IQ above 130?<br><br>Standardise: $z = (130 - 100)/15 = 2$.<br><br>So we want $P(X > 130) = P(Z > 2)$.<br><br>By the empirical rule, 95% of values lie within $\\mu \\pm 2\\sigma$. The remaining 5% is split symmetrically into the two tails — so each tail holds about 2.5%.<br><br>$P(X > 130) \\approx \\mathbf{0.025}$ or 2.5%.<br><br>About 1 person in 40 has IQ above 130. This is roughly the threshold for "gifted" classification.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IQ BETWEEN 85 AND 115</div><div class="example-body">What percent of people have IQ between 85 and 115?<br><br>Standardise: $z_1 = (85-100)/15 = -1$ and $z_2 = (115-100)/15 = +1$.<br><br>So we want $P(-1 \\leq Z \\leq 1) \\approx \\mathbf{0.68}$ — directly from the empirical rule.<br><br>About 68% of the population — roughly two out of three people — have IQ within one standard deviation of 100.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — IQ BELOW 70</div><div class="example-body">What percent of people have IQ below 70?<br><br>$z = (70-100)/15 = -2$.<br><br>$P(X < 70) = P(Z < -2) = P(Z > 2) \\approx \\mathbf{0.025}$ by symmetry.<br><br>About 2.5% of the population has IQ below 70. This is roughly the threshold for "intellectual disability" classification — note how the same z-score boundary (z = ±2) appears at both ends.</div></div>

<h2 class="lesson-title">7. Worked Examples — Heights and Test Scores</h2>

<div class="calc-example"><div class="example-label">EXAMPLE — ADULT HEIGHTS</div><div class="example-body">Adult heights in a population follow $X \\sim N(170, 10^2)$. What percent of adults are taller than 190 cm?<br><br>Standardise: $z = (190 - 170)/10 = 2$.<br><br>$P(X > 190) = P(Z > 2) \\approx \\mathbf{0.025}$ — about 2.5%.<br><br>Equivalently, 1 in 40 adults exceeds 190 cm. In a room of 200 people, you expect about 5 of them to be taller than 190 cm.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — COMPARING TEST SCORES</div><div class="example-body">Ayşe scored 84 on a maths test with $\\mu = 75$, $\\sigma = 6$. Mehmet scored 90 on a physics test with $\\mu = 80$, $\\sigma = 10$. Who did better relative to their class?<br><br>z-score of Ayşe: $z_A = (84 - 75)/6 = 1.5$.<br>z-score of Mehmet: $z_M = (90 - 80)/10 = 1.0$.<br><br>Ayşe is 1.5 SDs above average; Mehmet is only 1.0 SD above. <strong>Ayşe did better relative to her class.</strong><br><br>Although Mehmet's raw score is higher, his class also has a higher mean and a wider spread. The z-score puts both students on a common scale.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — TWO SDS BELOW MEAN</div><div class="example-body">Test scores follow $X \\sim N(70, 8^2)$. What is the probability that a randomly chosen student scores more than 2 SDs below the mean?<br><br>"More than 2 SDs below" means $z < -2$, i.e. $X < 70 - 16 = 54$.<br><br>$P(Z < -2) = P(Z > 2) \\approx \\mathbf{0.025}$.<br><br>About 2.5% of students score below 54.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — FIND THE CUTOFF FOR TOP 5%</div><div class="example-body">University entrance exam scores follow $X \\sim N(500, 100^2)$. What score puts you in the top 5%?<br><br>"Top 5%" means right-tail area 0.05, so we need $z_{0.05} = 1.645$.<br><br>Un-standardise: $x = \\mu + \\sigma z = 500 + 100 \\cdot 1.645 = \\mathbf{664.5}$.<br><br>A score of about 665 puts you in the top 5%. By the same logic, top 1% needs $z = 2.326$, giving $x = 500 + 232.6 \\approx 733$.</div></div>

<h2 class="lesson-title">8. Normal Approximation to the Binomial</h2>

<div class="calc-highlight"><strong>When the binomial parameter $n$ is large, the binomial distribution looks remarkably like a normal distribution.</strong> Specifically: $\\text{Bin}(n,p)$ is well-approximated by $N(np, np(1-p))$ whenever $np$ and $n(1-p)$ are both at least 5 (some textbooks demand 10). This makes a lot of binomial computations vastly easier.</div>

<div class="calc-formula"><div class="formula-label">NORMAL APPROXIMATION TO BINOMIAL</div><div class="formula-main">$$\\text{If } np > 5 \\text{ and } n(1-p) > 5, \\;\\; \\text{Bin}(n, p) \\;\\approx\\; N\\!\\left(np, \\, np(1-p)\\right)$$</div><div class="formula-sub">Match the mean ($\\mu = np$) and the variance ($\\sigma^2 = np(1-p)$). Then apply z-score techniques as usual.</div></div>

<div class="calc-example"><div class="example-label">EXAMPLE — COIN FLIPS</div><div class="example-body">Flip a fair coin 100 times. Find the approximate probability of getting between 45 and 55 heads (inclusive).<br><br>$X \\sim \\text{Bin}(100, 0.5)$. Mean $\\mu = 50$, variance $\\sigma^2 = 100 \\cdot 0.5 \\cdot 0.5 = 25$, SD $\\sigma = 5$.<br><br>Approximate by $X \\approx N(50, 25)$. Standardise:<br><br>$z_1 = (45 - 50)/5 = -1, \\quad z_2 = (55 - 50)/5 = +1$.<br><br>$P(45 \\leq X \\leq 55) \\approx P(-1 \\leq Z \\leq 1) \\approx \\mathbf{0.68}$.<br><br>So about 68% of the time you get between 45 and 55 heads in 100 flips.</div></div>

<div class="l-note"><strong>Continuity correction.</strong> Because the binomial is discrete and the normal is continuous, more accurate answers use $P(a - 0.5 \\leq X \\leq b + 0.5)$ instead of $P(a \\leq X \\leq b)$. For high-school problems the basic approximation without correction is usually accepted, but if you want sharper results, shift the endpoints by $0.5$.</div>

<h2 class="lesson-title">9. The Central Limit Theorem (Preview)</h2>

<div class="calc-highlight"><strong>Why does the normal distribution appear so often in nature?</strong> The deep reason is the <em>central limit theorem</em>: if you add up many independent random variables — no matter what each one looks like individually — the sum tends toward a normal distribution. Heights are sums of many genetic and environmental factors. Exam scores are sums of many questions. Measurement errors are sums of many tiny random influences. They all turn out approximately normal.</div>

<div class="calc-formula"><div class="formula-label">CENTRAL LIMIT THEOREM (INFORMAL)</div><div class="formula-main">$$X_1, X_2, \\ldots, X_n \\text{ independent, identically distributed} \\implies \\frac{X_1 + \\cdots + X_n - n\\mu}{\\sigma\\sqrt{n}} \\;\\xrightarrow[n \\to \\infty]{}\\; N(0, 1)$$</div><div class="formula-sub">In words: the sum (or average) of many independent random variables, properly standardised, approaches the standard normal — whatever the original distribution looked like.</div></div>

<p class="l-text">This is the single deepest reason normal distributions are so common. You will study it carefully in a university statistics course. For now, it explains why: anywhere you find a quantity built up from many small independent contributions, expect to see a bell curve.</p>

<h2 class="lesson-title">10. Common Errors</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Confusing $\\sigma$ and $\\sigma^2$</div><div class="card-body">$N(\\mu, \\sigma^2)$ uses variance as the second argument in most textbooks, but standard deviation in others. Always check whether the number quoted is $\\sigma$ or $\\sigma^2$ before standardising. For $N(100, 225)$ the SD is $\\sqrt{225} = 15$, not 225.</div></div>
<div class="calc-card"><div class="card-title">Treating z-score as a percent</div><div class="card-body">A z-score of 1.5 is NOT 1.5% or 15%. It is "1.5 standard deviations above the mean". To convert it to a probability you must look it up in a z-table or use the empirical rule.</div></div>
<div class="calc-card"><div class="card-title">Applying empirical rule loosely</div><div class="card-body">68-95-99.7 applies only to intervals centred on $\\mu$. It does NOT directly give $P(X > \\mu + 1.7\\sigma)$ — only the standard distances $1\\sigma, 2\\sigma, 3\\sigma$. For other distances you need a z-table.</div></div>
<div class="calc-card"><div class="card-title">Forgetting symmetry</div><div class="card-body">$P(Z > z)$ for negative $z$ equals $P(Z < |z|)$. Don't compute negative-tail probabilities directly; use symmetry to flip to a positive z-value.</div></div>
<div class="calc-card"><div class="card-title">Computing $P(X = c)$</div><div class="card-body">For a continuous distribution, the probability of any single point is exactly zero. Questions about continuous variables must always be about intervals: "$X < 50$" or "$45 < X < 55$", never just "$X = 50$".</div></div>
<div class="calc-card"><div class="card-title">Off-by-half in approximation</div><div class="card-body">When approximating $\\text{Bin}(n,p)$ by a normal, the continuity correction shifts endpoints by 0.5. So $P(X \\leq 6)$ in binomial becomes $P(X \\leq 6.5)$ under the normal. Forgetting this can introduce small but visible errors.</div></div>
</div>

<h2 class="lesson-title">11. Practice Exercises</h2>

<p class="l-text">Work each problem before reading the solution. The empirical rule (68-95-99.7) handles most of them; the rest use the critical values $1.645, 1.96, 2.576$.</p>

<div class="calc-example"><div class="example-label">EXERCISE 1 — Z-SCORE</div><div class="example-body"><strong>For $X \\sim N(50, 100)$ (so $\\sigma = 10$), what is the z-score of $x = 73$?</strong><br><br>$z = (73 - 50)/10 = \\mathbf{2.3}$.<br><br>A value of 73 lies 2.3 standard deviations above the mean.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — STANDARDISING</div><div class="example-body"><strong>For $X \\sim N(60, 144)$ find the range of values within one standard deviation of the mean.</strong><br><br>$\\sigma = \\sqrt{144} = 12$. So $\\mu \\pm \\sigma = 60 \\pm 12 = [\\mathbf{48}, \\mathbf{72}]$.<br><br>About 68% of the data lies in $[48, 72]$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — EMPIRICAL RULE</div><div class="example-body"><strong>Battery lifetimes follow $X \\sim N(40, 5^2)$ hours. What percent of batteries last between 30 and 50 hours?</strong><br><br>$z_1 = (30-40)/5 = -2, \\; z_2 = (50-40)/5 = 2$. So we want $P(-2 \\leq Z \\leq 2) \\approx \\mathbf{0.95}$.<br><br>About 95% of batteries last between 30 and 50 hours.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — RIGHT TAIL</div><div class="example-body"><strong>For $X \\sim N(100, 15^2)$ (the IQ example), what percent of values exceed 145?</strong><br><br>$z = (145-100)/15 = 3$. So $P(X > 145) = P(Z > 3) \\approx (1 - 0.997)/2 \\approx \\mathbf{0.0015}$.<br><br>About 0.15% of people — roughly 1 in 700.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — PERCENTILE</div><div class="example-body"><strong>Adult male heights follow $X \\sim N(175, 64)$ (so $\\sigma = 8$ cm). What height marks the 97.5th percentile?</strong><br><br>97.5th percentile means $P(X \\leq x) = 0.975$, which corresponds to $z = 1.96$.<br><br>Un-standardise: $x = 175 + 8 \\cdot 1.96 = 175 + 15.68 \\approx \\mathbf{190.7 \\text{ cm}}$.<br><br>So about 2.5% of adult men are taller than 190.7 cm.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 6 — COMPARING STUDENTS</div><div class="example-body"><strong>Two students take different exams. Ali scores 88 on Exam A ($\\mu = 75, \\sigma = 8$). Veli scores 82 on Exam B ($\\mu = 70, \\sigma = 4$). Who performed better relative to their cohort?</strong><br><br>$z_{\\text{Ali}} = (88-75)/8 = 1.625$.<br>$z_{\\text{Veli}} = (82-70)/4 = 3.0$.<br><br>Veli's z-score is much higher. <strong>Veli performed better relative to his cohort.</strong> His raw score is lower, but the spread of Exam B is tighter, making his lead more significant in standard-deviation units.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 7 — BINOMIAL APPROXIMATION</div><div class="example-body"><strong>A factory produces light bulbs with a 10% defect rate. In a batch of 400, find the approximate probability that the number of defects is between 35 and 45.</strong><br><br>$X \\sim \\text{Bin}(400, 0.1)$. Check: $np = 40 > 5$, $n(1-p) = 360 > 5$, so normal approximation applies.<br><br>$\\mu = np = 40$, $\\sigma = \\sqrt{400 \\cdot 0.1 \\cdot 0.9} = \\sqrt{36} = 6$.<br><br>$z_1 = (35-40)/6 \\approx -0.83, \\; z_2 = (45-40)/6 \\approx 0.83$.<br><br>By the empirical rule, $P(-0.83 \\leq Z \\leq 0.83)$ is a bit less than 68%. A more precise value is about 0.59.<br><br>$P(35 \\leq X \\leq 45) \\approx \\mathbf{0.59}$, i.e. about 59%.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 8 — INTERVAL FOR MEAN</div><div class="example-body"><strong>For $X \\sim N(20, 9)$ (so $\\sigma = 3$), give the symmetric interval around the mean that contains 99% of the probability.</strong><br><br>99% middle means $z \\in [-2.576, 2.576]$.<br><br>$x \\in [\\mu - 2.576\\sigma, \\mu + 2.576\\sigma] = [20 - 7.73, 20 + 7.73] = [\\mathbf{12.27}, \\mathbf{27.73}]$.<br><br>So 99% of outcomes lie between about 12.3 and 27.7.</div></div>

<div class="l-note"><strong>Looking ahead.</strong> Everything in this lesson is preview-level. Later courses develop the normal distribution more deeply: full z-tables, two-tailed and one-tailed hypothesis tests, confidence intervals built from $z_{\\alpha/2}\\,\\sigma/\\sqrt{n}$, the t-distribution for small samples, multivariate normal distributions, and a proper proof of the central limit theorem. But the empirical rule and the standardisation $z = (x-\\mu)/\\sigma$ stay with you forever — they are the absolute essentials.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A normal distribution $N(\\mu, \\sigma^2)$ is the bell curve centred at $\\mu$ with spread $\\sigma$; total area under the curve is 1</li>
<li>The standard normal $Z \\sim N(0,1)$ is the special case $\\mu = 0, \\sigma = 1$; any normal can be standardised by $z = (x-\\mu)/\\sigma$</li>
<li>Empirical rule: about 68% within $\\mu \\pm \\sigma$, 95% within $\\mu \\pm 2\\sigma$, 99.7% within $\\mu \\pm 3\\sigma$</li>
<li>Key critical values: $z_{0.025} = 1.96$ (middle 95%), $z_{0.05} = 1.645$ (middle 90%), $z_{0.005} = 2.576$ (middle 99%)</li>
<li>Use z-scores to compare values from different distributions and to find percentiles</li>
<li>Normal approximation to binomial: $\\text{Bin}(n,p) \\approx N(np, np(1-p))$ when $np, n(1-p) > 5$</li>
<li>Central limit theorem (preview): sums of many independent random variables tend to be normal — the reason normality appears everywhere in nature</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Boy, kilo, tansiyon, IQ, sınav puanları, ölçüm hataları, günlük sıcaklık, üretim toleransları.</strong> Hemen hemen herhangi bir doğal nicelik hakkında yeterince veri toplarsan, elde ettiğin histogram aynı şekle sahip olur: ortada tek bir tepe, simetrik, yumuşak yuvarlanan omuzlar, hızlıca sönen kuyruklar. Bu şekle — <em>çan eğrisi</em> — <strong>normal dağılım</strong> denir ve o kadar yaygındır ki "normal" sözcüğü onun adı haline gelmiştir. İstatistikteki en önemli sürekli olasılık dağılımıdır.</p>

<p class="l-text">Bu derste normal dağılımı bir önizleme olarak tanıyoruz: bir eğriden $\\mu$ ve $\\sigma$ okumak, ünlü 68-95-99.7 kuralını kullanmak, z-skorlarını hesaplayıp standartlaştırmak ve "yetişkinlerin yüzde kaçı 190 cm'den uzundur?" ya da "hangi IQ skoru seni ilk %2.5'a sokar?" gibi soruları yanıtlamak için yeterince. Derin teori (kalkülüs integralleri, merkezi limit teoremi ispatları) sonra gelir — ama pratik güç şimdiden burada.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Çan şekilli normal dağılımı $N(\\mu, \\sigma^2)$ tanımayı ve grafiğinden $\\mu, \\sigma$ değerlerini okumayı</li>
<li>Ortalama etrafındaki aralıkların olasılıklarını tahmin etmek için ampirik kuralı (68-95-99.7) uygulamayı</li>
<li>Herhangi bir normal değişkeni $z = (x-\\mu)/\\sigma$ kullanarak standart normal $Z \\sim N(0,1)$'e dönüştürmeyi</li>
<li>Farklı dağılımlardan gelen değerleri karşılaştırmak ve yüzdelik dilim bulmak için z-skorlarını kullanmayı</li>
<li>$P(Z \\leq 1.96) \\approx 0.975$ gibi yaygın olasılıkları hesaplamayı ve güven aralıklarındaki kullanımlarını tanımayı</li>
<li>Normal dağılımın binomu ne zaman yaklaşıklayabileceğini tanımayı ve merkezi limit teoremine önizleme yapmayı</li>
</ul>
</div>

<h2 class="lesson-title">1. Çan Eğrisi: İlk Bakış</h2>

<div class="calc-highlight"><strong>Bir normal dağılım tam olarak iki sayıyla tanımlanır: ortalama $\\mu$ ve standart sapma $\\sigma$.</strong> Ortalama, tepenin yatay eksende nerede olduğunu söyler. Standart sapma, çanın ne kadar geniş olduğunu söyler — küçük $\\sigma$ uzun ince bir çan verir, büyük $\\sigma$ kısa geniş bir çan verir. Eğri altındaki toplam alan her zaman 1'dir, çünkü toplam olasılığı temsil eder.</div>

<p class="l-text">"$X$, ortalaması $\\mu$ ve varyansı $\\sigma^2$ olan bir normal rastgele değişkendir" (dolayısıyla standart sapması $\\sigma$) demek için $X \\sim N(\\mu, \\sigma^2)$ yazarız. Bazen ders kitaplarında $X \\sim N(\\mu, \\sigma)$ görürsün; varyans ile standart sapma sözleşmesi değişir, bu yüzden her zaman kontrol et.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Şekil</div><div class="card-body">$\\mu$ etrafında simetrik. Tek bir tepe (tek modlu). Tepe yüksekliği $1/(\\sigma\\sqrt{2\\pi})$'dir. Kuyruklar x-eksenine yaklaşır ama asla dokunmaz.</div></div>
<div class="calc-card"><div class="card-title">Konum</div><div class="card-body">Ortalama $\\mu$ merkezdir. Medyana ve moda eşittir — eğri simetrik olduğu için üçü de çakışır.</div></div>
<div class="calc-card"><div class="card-title">Yayılım</div><div class="card-body">Standart sapma $\\sigma$ genişliği kontrol eder. Bükülme noktaları (eğrinin içbükeylik değiştirdiği yerler) tam olarak $\\mu \\pm \\sigma$'da bulunur.</div></div>
</div>

<div class="calc-formula"><div class="formula-label">NORMAL OLASILIK YOĞUNLUĞU (ÖNİZLEME)</div><div class="formula-main">$$f(x) \\;=\\; \\frac{1}{\\sigma\\sqrt{2\\pi}} \\, \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div><div class="formula-sub">Lisede bunun integralini almak istenmez. Sadece şeklini bil: $\\mu$ merkezli, yayılımı $\\sigma$ olan simetrik bir çan. Olasılıklar bu eğri altındaki alanlardır.</div></div>

<p class="l-text">Eğri altındaki alanlar olasılıkları verir. Sürekli bir dağılım için $P(X = c) = 0$ herhangi bir $c$ tek noktası için (bir doğrunun genişliği sıfırdır), dolayısıyla her zaman aralıklarla çalışırız: $P(a < X < b)$, $x=a$ ile $x=b$ arasındaki şeridin alanıdır.</p>

<div class="calc-graph"><div id="plot-l105-three-bells-tr" class="plotly-graph" style="height:440px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> aynı eksenler üzerinde üç farklı normal eğri. $N(0,1)$ standart normaldir (merkez, dar). $N(0,4)$ aynı ortalama ama varyans 4 ($\\sigma = 2$): aynı merkez ama iki kat geniş ve yarı yükseklik. $N(3,1)$ ortalaması 3 olan (sağa kayık) ve standart normalle aynı genişlikte. $\\mu$'nun eğriyi sola/sağa kaydırdığına ve $\\sigma$'nın onu gerdiğine dikkat et.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-60;i<=80;i++){xs.push(i/10);}
var y1=xs.map(function(x){return normPdf(x,0,1);});
var y2=xs.map(function(x){return normPdf(x,0,2);});
var y3=xs.map(function(x){return normPdf(x,3,1);});
var t1={x:xs,y:y1,mode:'lines',name:'N(0, 1)',line:{color:'#3b82f6',width:2.6}};
var t2={x:xs,y:y2,mode:'lines',name:'N(0, 4)',line:{color:'#f59e0b',width:2.4}};
var t3={x:xs,y:y3,mode:'lines',name:'N(3, 1)',line:{color:'#10b981',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'yogunluk f(x)',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-three-bells-tr',[t1,t2,t3],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">2. Standart Normal $Z \\sim N(0,1)$</h2>

<div class="calc-highlight"><strong>Tüm normal dağılımlar arasında biri özeldir: $\\mu = 0$ ve $\\sigma = 1$ olan standart normal.</strong> Ona kendi harfini veririz — $Z$. Her normal dağılım basit bir birim değişimiyle standart normale dönüştürülebilir, bu yüzden herhangi bir normalle ilgili herhangi bir olasılık sorusu tek bir $Z$ değerleri tablosu kullanılarak yanıtlanabilir.</div>

<div class="calc-formula"><div class="formula-label">STANDART NORMAL</div><div class="formula-main">$$Z \\sim N(0, 1), \\qquad f_Z(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-z^2/2}$$</div><div class="formula-sub">Ortalama 0, varyans 1, standart sapma 1. Tepe yüksekliği $1/\\sqrt{2\\pi} \\approx 0.3989$.</div></div>

<p class="l-text">$Z$'nin grafiği sıfırda merkezli, bükülme noktaları $\\pm 1$'de olan ünlü simetrik çandır. Alanının neredeyse tamamı $z = -3$ ile $z = 3$ arasında durur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$P(Z \\leq 0) = 0.5$</div><div class="card-body">Simetri gereği sıfırın solundaki alan sağındakine eşittir. Her yarı toplam $0.5$ olasılığa sahiptir.</div></div>
<div class="calc-card"><div class="card-title">$P(Z \\leq z) + P(Z \\geq z) = 1$</div><div class="card-body">Herhangi bir tek noktanın olasılığı sıfırdır, dolayısıyla iki tamamlayıcı aralık 1'e toplanır. "Sağ kuyruk"u "sol kuyruk"a dönüştürmek için kullanışlıdır.</div></div>
<div class="calc-card"><div class="card-title">$P(Z \\leq -z) = P(Z \\geq z)$</div><div class="card-body">Çanın simetrisi: $z$'yi sıfırdan yansıtmak alanı yansıtır. Yani negatif z-değerleri mutlak değerleri kullanılarak bakılabilir.</div></div>
</div>

<h2 class="lesson-title">3. Standartlaştırma: Herhangi Bir Normal'den $Z$'ye</h2>

<div class="calc-highlight"><strong>$X \\sim N(\\mu, \\sigma^2)$ ise, $Z = (X - \\mu)/\\sigma$ standart normal dağılıma sahiptir.</strong> Bu tek dönüşüm, tek bir z-tablosuna her normal-dağılım sorusunu cevaplama gücü verir. Ortalamayı çıkar, standart sapmaya böl: artık her şey "ortalamadan standart sapma sayısı" cinsinden ölçülüyor.</div>

<div class="calc-formula"><div class="formula-label">STANDARTLAŞTIRMA</div><div class="formula-main">$$Z \\;=\\; \\frac{X - \\mu}{\\sigma} \\qquad \\Longleftrightarrow \\qquad X \\;=\\; \\mu + \\sigma Z$$</div><div class="formula-sub">$z$, $x$'in <em>z-skoru</em> olarak adlandırılır. $x$ değerinin ortalamanın kaç standart sapma üstünde (ya da negatifse altında) olduğunu söyler.</div></div>

<p class="l-text">Z-skorunun amacı karşılaştırmadır. $\\mu = 70, \\sigma = 5$ olan bir testteki 75 puanı $z = (75-70)/5 = 1$ verir — ortalamanın bir standart sapma üstünde. $\\mu = 60, \\sigma = 20$ olan başka bir testteki 80 puanı $z = (80-60)/20 = 1$ verir — yine ortalamanın bir standart sapma üstünde. Ham puanlar çok farklı, ama z-skorları "o test için eşit derecede ortalamanın üstünde" diyor.</p>

<div class="calc-example"><div class="example-label">ÖRNEK</div><div class="example-body">Bir popülasyondaki yetişkin erkek boyları $X \\sim N(175, 8^2)$ ile modelleniyor, yani $\\mu = 175$ cm, $\\sigma = 8$ cm. $x = 167$, $x = 175$, $x = 191$ için z-skorlarını bul.<br><br>$z(167) = (167-175)/8 = -1$. Ortalamanın bir SS altında.<br>$z(175) = (175-175)/8 = 0$. Tam ortalamada.<br>$z(191) = (191-175)/8 = 2$. Ortalamanın iki SS üstünde.<br><br>Yani bu popülasyondaki 191 cm boylu bir erkek olağanüstü uzundur — sadece yaklaşık %2.5 erkek daha uzundur (ampirik kurala göre).</div></div>

<h2 class="lesson-title">4. Ampirik Kural: 68-95-99.7</h2>

<div class="calc-highlight"><strong>Herhangi bir normal dağılım için, ortalamadan 1, 2 ve 3 standart sapma içindeki veri yüzdeleri evrenseldir.</strong> Bu sayılar $\\mu$ ya da $\\sigma$'ya bağlı değildir — sadece normal eğrinin şekline bağlıdır. Normal dağılım hakkındaki en kullanışlı tek olgudurlar.</div>

<div class="calc-formula"><div class="formula-label">AMPİRİK KURAL</div><div class="formula-main">$$P(\\mu - \\sigma \\leq X \\leq \\mu + \\sigma) \\approx 0.68$$ $$P(\\mu - 2\\sigma \\leq X \\leq \\mu + 2\\sigma) \\approx 0.95$$ $$P(\\mu - 3\\sigma \\leq X \\leq \\mu + 3\\sigma) \\approx 0.997$$</div><div class="formula-sub">Sözle: verilerin yaklaşık %68'i 1 SS içinde, %95'i 2 SS içinde ve %99.7'si ortalamanın 3 SS'i içinde düşer.</div></div>

<div class="calc-graph"><div id="plot-l105-empirical-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> standart normal eğri, %68, %95 ve %99.7 bölgeleri üç farklı mavi tonuyla boyanmış. En koyu bant ($z \\in [-1,1]$) alanın yaklaşık %68'ini içerir. $[-2,2]$'ye genişletmek %27 daha ekler (toplam %95). $[-3,3]$'e genişletmek son %4.7'yi ekler (toplam %99.7). $\\pm 3$'ün ötesinde alanın sadece %0.3'ü yatar.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-400;i<=400;i++){xs.push(i/100);}
var ys=xs.map(function(x){return normPdf(x,0,1);});
function band(lo,hi){var bx=[],by=[];for(var i=0;i<xs.length;i++){if(xs[i]>=lo&&xs[i]<=hi){bx.push(xs[i]);by.push(ys[i]);}}return {x:bx,y:by};}
var b3=band(-3,3),b2=band(-2,2),b1=band(-1,1);
var t3={x:b3.x,y:b3.y,fill:'tozeroy',mode:'none',name:'%99.7 (3σ)',fillcolor:'rgba(59,130,246,0.18)'};
var t2={x:b2.x,y:b2.y,fill:'tozeroy',mode:'none',name:'%95 (2σ)',fillcolor:'rgba(59,130,246,0.35)'};
var t1={x:b1.x,y:b1.y,fill:'tozeroy',mode:'none',name:'%68 (1σ)',fillcolor:'rgba(59,130,246,0.60)'};
var curve={x:xs,y:ys,mode:'lines',name:'N(0, 1)',line:{color:'#60a5fa',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z (ortalamadan standart sapma)',gridcolor:'rgba(255,255,255,0.06)',dtick:1,range:[-4,4],zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'yogunluk',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-empirical-tr',[t3,t2,t1,curve],lay,{responsive:true,displayModeBar:false});
},250);</script>

<p class="l-text"><strong>Her bandın yarısı her tarafta oturur.</strong> Simetri gereği, $P(\\mu \\leq X \\leq \\mu + \\sigma) \\approx 0.34$ (68'in yarısı), $P(X \\geq \\mu + \\sigma) \\approx 0.16$ (kalan %32'nin yarısı), $P(X \\geq \\mu + 2\\sigma) \\approx 0.025$ (kalan %5'in yarısı) ve $P(X \\geq \\mu + 3\\sigma) \\approx 0.0015$ (kalan %0.3'ün yarısı). Bu birkaç sayı, çoğu sınav sorusunu cevaplamak için yeterli.</p>

<div class="think-box"><div class="think-label">KONTROL NOKTASI</div><div class="think-body">$X \\sim N(50, 10^2)$ ise verilerin orta %95'i hangi iki değer arasındadır? Cevap: $\\mu - 2\\sigma = 50 - 20 = 30$ ile $\\mu + 2\\sigma = 50 + 20 = 70$ arasında. Yani sonuçların %95'i $[30, 70]$ aralığına düşer.</div></div>

<div class="calc-graph"><div id="plot-l105-empirical-tr-extra" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> standart normal $N(0,1)$ üzerinde 68-95-99.7 kuralı açıkça gösteriliyor. En içteki mavi bant ($\\pm 1\\sigma$) alanın <strong>%68'ini</strong> tutar, turuncu halka ($\\pm 2\\sigma$ eksi $\\pm 1\\sigma$) <strong>%27 daha</strong> ekler (toplam %95), ve dış kırmızı halka ($\\pm 3\\sigma$ eksi $\\pm 2\\sigma$) son <strong>%4.7'yi</strong> ekler (toplam %99.7). $\\pm 3\\sigma$'nın ötesinde iki kuyrukta toplam yalnızca %0.3 alan kalır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=-400;i<=400;i++){xs.push(i/100);}
var ys=xs.map(function(x){return normPdf(x,0,1);});
function band(lo,hi){var bx=[],by=[];for(var i=0;i<xs.length;i++){if(xs[i]>=lo&&xs[i]<=hi){bx.push(xs[i]);by.push(ys[i]);}}return {x:bx,y:by};}
var b3=band(-3,3),b2=band(-2,2),b1=band(-1,1);
var t3={x:b3.x,y:b3.y,fill:'tozeroy',mode:'none',name:'±3σ → %99.7',fillcolor:'rgba(239,68,68,0.45)'};
var t2={x:b2.x,y:b2.y,fill:'tozeroy',mode:'none',name:'±2σ → %95',fillcolor:'rgba(245,158,11,0.55)'};
var t1={x:b1.x,y:b1.y,fill:'tozeroy',mode:'none',name:'±1σ → %68',fillcolor:'rgba(59,130,246,0.72)'};
var curve={x:xs,y:ys,mode:'lines',name:'N(0, 1)',line:{color:'#e8e8e8',width:2.4}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'z (ortalamadan standart sapma)',gridcolor:'rgba(255,255,255,0.06)',dtick:1,range:[-4,4],zerolinecolor:'rgba(255,255,255,0.15)'},yaxis:{title:'yogunluk',gridcolor:'rgba(255,255,255,0.06)',range:[0,0.46]},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},annotations:[{x:0,y:0.20,text:'<b>%68</b>',showarrow:false,font:{color:'#ffffff',size:15}},{x:-1.5,y:0.10,text:'<b>%13.5</b>',showarrow:false,font:{color:'#1a1a1a',size:12}},{x:1.5,y:0.10,text:'<b>%13.5</b>',showarrow:false,font:{color:'#1a1a1a',size:12}},{x:-2.5,y:0.030,text:'<b>%2.35</b>',showarrow:false,font:{color:'#ffffff',size:11}},{x:2.5,y:0.030,text:'<b>%2.35</b>',showarrow:false,font:{color:'#ffffff',size:11}},{x:-3.5,y:0.012,text:'<b>%0.15</b>',showarrow:true,arrowhead:2,arrowcolor:'#ef4444',ax:-30,ay:-30,font:{color:'#fca5a5',size:11}},{x:3.5,y:0.012,text:'<b>%0.15</b>',showarrow:true,arrowhead:2,arrowcolor:'#ef4444',ax:30,ay:-30,font:{color:'#fca5a5',size:11}}]};
Plotly.newPlot('plot-l105-empirical-tr-extra',[t3,t2,t1,curve],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">5. Yaygın Z-Değerleri ve Olasılıkları</h2>

<div class="calc-highlight"><strong>Birkaç z-değeri o kadar sık karşına çıkar ki ilişkili olasılıklarını ezberlemelisin.</strong> Bunlar %90, %95 ve %99 güven aralıklarının arkasındaki "kritik değerlerdir" — temel istatistikteki en önemli aralıklar.</div>

<div class="calc-formula"><div class="formula-label">KRİTİK Z-DEĞERLERİ (SOL KUYRUK OLASILIKLARI)</div><div class="formula-main">$$P(Z \\leq 1.645) \\approx 0.95 \\qquad P(Z \\leq 1.96) \\approx 0.975 \\qquad P(Z \\leq 2.576) \\approx 0.995$$</div><div class="formula-sub">Simetri gereği: $P(Z \\leq -1.645) \\approx 0.05$, $P(Z \\leq -1.96) \\approx 0.025$, $P(Z \\leq -2.576) \\approx 0.005$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Orta %90</div><div class="card-body">$P(-1.645 \\leq Z \\leq 1.645) \\approx 0.90$. Yani $\\pm 1.645$'in ötesinde her kuyrukta %5 yatar.</div></div>
<div class="calc-card"><div class="card-title">Orta %95</div><div class="card-body">$P(-1.96 \\leq Z \\leq 1.96) \\approx 0.95$. Yani $\\pm 1.96$'nın ötesinde her kuyrukta %2.5 yatar. Bu, istatistikteki en çok kullanılan kritik değer çiftidir.</div></div>
<div class="calc-card"><div class="card-title">Orta %99</div><div class="card-body">$P(-2.576 \\leq Z \\leq 2.576) \\approx 0.99$. Yani $\\pm 2.576$'nın ötesinde her kuyrukta %0.5 yatar.</div></div>
</div>

<div class="l-note"><strong>Yaygın gösterim:</strong> $z_{\\alpha}$, sağ kuyruk alanı $\\alpha$ olan değeri ifade eder, yani $P(Z \\geq z_{\\alpha}) = \\alpha$. Dolayısıyla $z_{0.025} = 1.96$, $z_{0.05} = 1.645$, $z_{0.005} = 2.576$. Bu sembollerle ileri istatistik derslerinde güven aralıkları ve hipotez testleri için karşılaşacaksın.</div>

<div style="margin:1.5rem 0;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.92rem;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.25);border-radius:8px;overflow:hidden"><caption style="caption-side:top;text-align:left;font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;padding:0.6rem 0.9rem;background:rgba(59,130,246,0.10)">REFERANS TABLOSU — YAYGIN Z-SKORLARI VE GÜVEN DÜZEYLERİ</caption><thead><tr style="background:rgba(59,130,246,0.14);color:#e8e8e8"><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">z-skoru</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">$P(Z \\leq z)$ (sol kuyruk)</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">İki kuyruklu güven $P(-z \\leq Z \\leq z)$</th><th style="padding:0.65rem 0.9rem;text-align:left;border-bottom:1px solid rgba(59,130,246,0.30)">Kullanım alanı</th></tr></thead><tbody style="color:rgba(235,230,220,0.92)"><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.282</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.900</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>%80</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Hızlı tahmin, gevşek sınır</td></tr><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.645</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.950</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>%90</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Tek kuyruklu %5 testleri; %90 GA</td></tr><tr style="background:rgba(59,130,246,0.06)"><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">1.960</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.975</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>%95</strong> (en yaygın)</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Standart %95 GA ve testler</td></tr><tr><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;color:#60a5fa">2.326</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">0.990</td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)"><strong>%98</strong></td><td style="padding:0.6rem 0.9rem;border-bottom:1px solid rgba(255,255,255,0.06)">Tek kuyruklu %1 testleri</td></tr><tr><td style="padding:0.6rem 0.9rem;font-weight:600;color:#60a5fa">2.576</td><td style="padding:0.6rem 0.9rem">0.995</td><td style="padding:0.6rem 0.9rem"><strong>%99</strong></td><td style="padding:0.6rem 0.9rem">Sıkı %99 GA; dar tolerans</td></tr></tbody></table></div>

<h2 class="lesson-title">6. IQ Örneği: Hepsini Bir Araya Getirmek</h2>

<div class="calc-highlight"><strong>IQ puanları, tanımı gereği $\\mu = 100$ ve $\\sigma = 15$ olan normal dağılım izleyecek şekilde tasarlanmıştır.</strong> Yani $X \\sim N(100, 15^2)$. Bu, IQ'yu normal dağılım problemleri için ders kitabı örneği yapar.</div>

<div class="calc-graph"><div id="plot-l105-iq-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> $N(100, 15^2)$ IQ dağılımı, $x = 85, 100, 115, 130$'da dikey kesik çizgilerle — z-skorları $-1, 0, 1, 2$'ye karşılık geliyor. 85 ile 115 arasındaki orta tümsek nüfusun yaklaşık %68'ini tutar. 130'a kadar uzanmak (z = 2) sol tarafta yaklaşık %97.5'i kapsar, IQ 130'un üzerinde nüfusun sadece %2.5'ini bırakır.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
function normPdf(x,mu,sig){return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(sig*Math.sqrt(2*Math.PI));}
var xs=[];for(var i=400;i<=1600;i++){xs.push(i/10);}
var ys=xs.map(function(x){return normPdf(x,100,15);});
var curve={x:xs,y:ys,mode:'lines',name:'IQ ~ N(100, 15²)',line:{color:'#3b82f6',width:2.6},fill:'tozeroy',fillcolor:'rgba(59,130,246,0.12)'};
function vline(xv,col,lbl){return {x:[xv,xv],y:[0,normPdf(xv,100,15)*1.05],mode:'lines',name:lbl,line:{color:col,width:2,dash:'dash'},showlegend:true};}
var v1=vline(85,'#f59e0b','IQ 85 (z = -1)');
var v2=vline(100,'#e2e8f0','IQ 100 (z = 0)');
var v3=vline(115,'#10b981','IQ 115 (z = 1)');
var v4=vline(130,'#ef4444','IQ 130 (z = 2)');
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'IQ skoru',gridcolor:'rgba(255,255,255,0.06)',range:[40,160]},yaxis:{title:'yogunluk',gridcolor:'rgba(255,255,255,0.06)'},margin:{t:30,r:30,b:60,l:70},legend:{orientation:'h',y:1.10,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l105-iq-tr',[curve,v1,v2,v3,v4],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — IQ 130'UN ÜZERİ</div><div class="example-body">İnsanların yüzde kaçının IQ'su 130'un üzerinde?<br><br>Standartlaştır: $z = (130 - 100)/15 = 2$.<br><br>Yani $P(X > 130) = P(Z > 2)$ istiyoruz.<br><br>Ampirik kurala göre değerlerin %95'i $\\mu \\pm 2\\sigma$ içinde yatar. Kalan %5 iki kuyrukta simetrik olarak bölünür — dolayısıyla her kuyruk yaklaşık %2.5 tutar.<br><br>$P(X > 130) \\approx \\mathbf{0.025}$ ya da %2.5.<br><br>Her 40 kişiden yaklaşık 1'inin IQ'su 130'un üzerindedir. Bu, "üstün zekâlı" sınıflandırması için yaklaşık eşiktir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — IQ 85 İLE 115 ARASI</div><div class="example-body">İnsanların yüzde kaçının IQ'su 85 ile 115 arasındadır?<br><br>Standartlaştır: $z_1 = (85-100)/15 = -1$ ve $z_2 = (115-100)/15 = +1$.<br><br>Yani $P(-1 \\leq Z \\leq 1) \\approx \\mathbf{0.68}$ istiyoruz — doğrudan ampirik kuraldan.<br><br>Nüfusun yaklaşık %68'i — kabaca her üç kişiden ikisi — IQ'su 100'ün bir standart sapması içindedir.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — IQ 70'İN ALTI</div><div class="example-body">İnsanların yüzde kaçının IQ'su 70'in altındadır?<br><br>$z = (70-100)/15 = -2$.<br><br>$P(X < 70) = P(Z < -2) = P(Z > 2) \\approx \\mathbf{0.025}$, simetri gereği.<br><br>Nüfusun yaklaşık %2.5'inin IQ'su 70'in altındadır. Bu, "zihinsel yetersizlik" sınıflandırması için yaklaşık eşiktir — aynı z-skoru sınırının (z = ±2) iki uçta da nasıl göründüğüne dikkat et.</div></div>

<h2 class="lesson-title">7. Çözümlü Örnekler — Boylar ve Sınav Puanları</h2>

<div class="calc-example"><div class="example-label">ÖRNEK — YETİŞKİN BOYLARI</div><div class="example-body">Bir popülasyondaki yetişkin boyları $X \\sim N(170, 10^2)$ izliyor. Yetişkinlerin yüzde kaçı 190 cm'den uzundur?<br><br>Standartlaştır: $z = (190 - 170)/10 = 2$.<br><br>$P(X > 190) = P(Z > 2) \\approx \\mathbf{0.025}$ — yaklaşık %2.5.<br><br>Eşdeğer olarak, 40 yetişkinden 1'i 190 cm'yi aşar. 200 kişilik bir odada yaklaşık 5 kişinin 190 cm'den uzun olmasını beklersin.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — SINAV PUANLARINI KARŞILAŞTIRMA</div><div class="example-body">Ayşe, $\\mu = 75$, $\\sigma = 6$ olan bir matematik sınavında 84 aldı. Mehmet, $\\mu = 80$, $\\sigma = 10$ olan bir fizik sınavında 90 aldı. Sınıflarına göre kim daha iyi yaptı?<br><br>Ayşe'nin z-skoru: $z_A = (84 - 75)/6 = 1.5$.<br>Mehmet'in z-skoru: $z_M = (90 - 80)/10 = 1.0$.<br><br>Ayşe, ortalamanın 1.5 SS üstünde; Mehmet sadece 1.0 SS üstünde. <strong>Ayşe sınıfına göre daha iyi yaptı.</strong><br><br>Mehmet'in ham puanı daha yüksek olsa da, sınıfının ortalaması da daha yüksek ve yayılımı daha geniş. Z-skoru her iki öğrenciyi ortak bir ölçeğe koyar.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — ORTALAMANIN İKİ SS ALTI</div><div class="example-body">Sınav puanları $X \\sim N(70, 8^2)$ izliyor. Rastgele seçilen bir öğrencinin ortalamadan iki SS'den daha az puan alma olasılığı nedir?<br><br>"Ortalamadan iki SS'den fazla az" $z < -2$ demektir, yani $X < 70 - 16 = 54$.<br><br>$P(Z < -2) = P(Z > 2) \\approx \\mathbf{0.025}$.<br><br>Öğrencilerin yaklaşık %2.5'i 54'ün altında puan alır.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — İLK %5 İÇİN ALT SINIR BUL</div><div class="example-body">Üniversite giriş sınavı puanları $X \\sim N(500, 100^2)$ izliyor. Hangi puan seni ilk %5'e sokar?<br><br>"İlk %5", sağ kuyruk alanı 0.05 demek, dolayısıyla $z_{0.05} = 1.645$ gerekiyor.<br><br>Standartlaştırmayı tersine çevir: $x = \\mu + \\sigma z = 500 + 100 \\cdot 1.645 = \\mathbf{664.5}$.<br><br>Yaklaşık 665 puanı seni ilk %5'e sokar. Aynı mantıkla, ilk %1 için $z = 2.326$ gerekir, bu da $x = 500 + 232.6 \\approx 733$ verir.</div></div>

<h2 class="lesson-title">8. Binoma Normal Yaklaşımı</h2>

<div class="calc-highlight"><strong>Binom parametresi $n$ büyük olduğunda, binom dağılımı şaşırtıcı derecede normal dağılıma benzer.</strong> Daha kesin: $\\text{Bin}(n,p)$, $np$ ve $n(1-p)$ her ikisi de en az 5 olduğunda (bazı ders kitapları 10 ister) $N(np, np(1-p))$ ile iyi şekilde yaklaşıklanır. Bu, çoğu binom hesabını çok daha kolay hale getirir.</div>

<div class="calc-formula"><div class="formula-label">BİNOMA NORMAL YAKLAŞIMI</div><div class="formula-main">$$np > 5 \\text{ ve } n(1-p) > 5 \\text{ ise }, \\;\\; \\text{Bin}(n, p) \\;\\approx\\; N\\!\\left(np, \\, np(1-p)\\right)$$</div><div class="formula-sub">Ortalamayı ($\\mu = np$) ve varyansı ($\\sigma^2 = np(1-p)$) eşleştir. Sonra normal şekilde z-skoru tekniklerini uygula.</div></div>

<div class="calc-example"><div class="example-label">ÖRNEK — PARA ATIŞLARI</div><div class="example-body">Hilesiz bir parayı 100 kez at. 45 ile 55 arası tura (dahil) alma yaklaşık olasılığını bul.<br><br>$X \\sim \\text{Bin}(100, 0.5)$. Ortalama $\\mu = 50$, varyans $\\sigma^2 = 100 \\cdot 0.5 \\cdot 0.5 = 25$, SS $\\sigma = 5$.<br><br>$X \\approx N(50, 25)$ ile yaklaşıkla. Standartlaştır:<br><br>$z_1 = (45 - 50)/5 = -1, \\quad z_2 = (55 - 50)/5 = +1$.<br><br>$P(45 \\leq X \\leq 55) \\approx P(-1 \\leq Z \\leq 1) \\approx \\mathbf{0.68}$.<br><br>Yani 100 atışta 45 ile 55 arası tura zamanın yaklaşık %68'inde alınır.</div></div>

<div class="l-note"><strong>Süreklilik düzeltmesi.</strong> Binom ayrık ve normal sürekli olduğundan, daha doğru cevaplar $P(a \\leq X \\leq b)$ yerine $P(a - 0.5 \\leq X \\leq b + 0.5)$ kullanır. Lise problemleri için düzeltmesiz temel yaklaşım genellikle kabul edilir, ama daha keskin sonuç istersen uçları $0.5$ kaydır.</div>

<h2 class="lesson-title">9. Merkezi Limit Teoremi (Önizleme)</h2>

<div class="calc-highlight"><strong>Normal dağılım neden doğada bu kadar sık ortaya çıkar?</strong> Derin nedeni <em>merkezi limit teoremidir</em>: birçok bağımsız rastgele değişkeni — her biri bireysel olarak nasıl görünürse görünsün — topladığında, toplam normal dağılıma doğru eğilim gösterir. Boylar birçok genetik ve çevresel faktörün toplamıdır. Sınav puanları birçok sorunun toplamıdır. Ölçüm hataları birçok minik rastgele etkinin toplamıdır. Hepsi yaklaşık olarak normal çıkar.</div>

<div class="calc-formula"><div class="formula-label">MERKEZİ LİMİT TEOREMİ (KAYIT DIŞI)</div><div class="formula-main">$$X_1, X_2, \\ldots, X_n \\text{ bagimsiz, ayni dagilimli} \\implies \\frac{X_1 + \\cdots + X_n - n\\mu}{\\sigma\\sqrt{n}} \\;\\xrightarrow[n \\to \\infty]{}\\; N(0, 1)$$</div><div class="formula-sub">Sözle: birçok bağımsız rastgele değişkenin toplamı (ya da ortalaması), uygun şekilde standartlaştırıldığında, standart normale yaklaşır — orijinal dağılım nasıl görünürse görünsün.</div></div>

<p class="l-text">Bu, normal dağılımların bu kadar yaygın olmasının tek en derin nedenidir. Üniversite istatistik dersinde dikkatlice çalışacaksın. Şimdilik açıklıyor: birçok küçük bağımsız katkıdan oluşan bir nicelik bulduğun her yerde, bir çan eğrisi görmeyi bekle.</p>

<h2 class="lesson-title">10. Yaygın Hatalar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sigma$ ve $\\sigma^2$'yi karıştırmak</div><div class="card-body">$N(\\mu, \\sigma^2)$ çoğu ders kitabında ikinci argüman olarak varyansı kullanır, ama bazılarında standart sapmayı. Standartlaştırmadan önce her zaman alıntılanan sayının $\\sigma$ mı yoksa $\\sigma^2$ mi olduğunu kontrol et. $N(100, 225)$ için SS $\\sqrt{225} = 15$, 225 değil.</div></div>
<div class="calc-card"><div class="card-title">Z-skorunu yüzde gibi yorumlamak</div><div class="card-body">1.5'lik bir z-skoru %1.5 ya da %15 DEĞİLDİR. "Ortalamanın 1.5 standart sapma üstünde" demektir. Bunu olasılığa çevirmek için bir z-tablosuna bakmalı ya da ampirik kuralı kullanmalısın.</div></div>
<div class="calc-card"><div class="card-title">Ampirik kuralı gevşek uygulamak</div><div class="card-body">68-95-99.7 sadece $\\mu$ etrafında merkezli aralıklara uygulanır. Doğrudan $P(X > \\mu + 1.7\\sigma)$ vermez — sadece standart mesafeler $1\\sigma, 2\\sigma, 3\\sigma$ için. Diğer mesafeler için z-tablosuna ihtiyacın var.</div></div>
<div class="calc-card"><div class="card-title">Simetriyi unutmak</div><div class="card-body">Negatif $z$ için $P(Z > z)$, $P(Z < |z|)$'ye eşittir. Negatif-kuyruk olasılıklarını doğrudan hesaplama; pozitif z-değerine çevirmek için simetriyi kullan.</div></div>
<div class="calc-card"><div class="card-title">$P(X = c)$ hesaplamak</div><div class="card-body">Sürekli bir dağılım için herhangi bir tek noktanın olasılığı tam olarak sıfırdır. Sürekli değişkenlerle ilgili sorular her zaman aralıklarla ilgili olmalıdır: "$X < 50$" ya da "$45 < X < 55$", asla sadece "$X = 50$" değil.</div></div>
<div class="calc-card"><div class="card-title">Yaklaşımda yarım kaçırmak</div><div class="card-body">$\\text{Bin}(n,p)$'yi normale yaklaşıklarken süreklilik düzeltmesi uçları 0.5 kaydırır. Yani binomda $P(X \\leq 6)$, normalde $P(X \\leq 6.5)$ olur. Bunu unutmak küçük ama gözle görülür hatalar yaratabilir.</div></div>
</div>

<h2 class="lesson-title">11. Alıştırma Problemleri</h2>

<p class="l-text">Çözümü okumadan önce her problemi kendin dene. Ampirik kural (68-95-99.7) çoğunu halleder; geri kalanlar $1.645, 1.96, 2.576$ kritik değerlerini kullanır.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — Z-SKORU</div><div class="example-body"><strong>$X \\sim N(50, 100)$ için (yani $\\sigma = 10$), $x = 73$'ün z-skoru nedir?</strong><br><br>$z = (73 - 50)/10 = \\mathbf{2.3}$.<br><br>73 değeri ortalamanın 2.3 standart sapma üstünde yatar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — STANDARTLAŞTIRMA</div><div class="example-body"><strong>$X \\sim N(60, 144)$ için ortalamanın bir standart sapması içindeki değer aralığını bul.</strong><br><br>$\\sigma = \\sqrt{144} = 12$. Yani $\\mu \\pm \\sigma = 60 \\pm 12 = [\\mathbf{48}, \\mathbf{72}]$.<br><br>Verilerin yaklaşık %68'i $[48, 72]$ aralığında yatar.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — AMPİRİK KURAL</div><div class="example-body"><strong>Pil ömürleri $X \\sim N(40, 5^2)$ saat izliyor. Pillerin yüzde kaçı 30 ile 50 saat arasında dayanır?</strong><br><br>$z_1 = (30-40)/5 = -2, \\; z_2 = (50-40)/5 = 2$. Yani $P(-2 \\leq Z \\leq 2) \\approx \\mathbf{0.95}$ istiyoruz.<br><br>Pillerin yaklaşık %95'i 30 ile 50 saat arasında dayanır.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — SAĞ KUYRUK</div><div class="example-body"><strong>$X \\sim N(100, 15^2)$ için (IQ örneği), değerlerin yüzde kaçı 145'i aşar?</strong><br><br>$z = (145-100)/15 = 3$. Yani $P(X > 145) = P(Z > 3) \\approx (1 - 0.997)/2 \\approx \\mathbf{0.0015}$.<br><br>İnsanların yaklaşık %0.15'i — kabaca 700'de 1.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — YÜZDELİK DİLİM</div><div class="example-body"><strong>Yetişkin erkek boyları $X \\sim N(175, 64)$ izliyor (yani $\\sigma = 8$ cm). 97.5. yüzdelik dilim hangi boyu işaretler?</strong><br><br>97.5. yüzdelik dilim $P(X \\leq x) = 0.975$ demektir, bu da $z = 1.96$'ya karşılık gelir.<br><br>Standartlaştırmayı tersine çevir: $x = 175 + 8 \\cdot 1.96 = 175 + 15.68 \\approx \\mathbf{190.7 \\text{ cm}}$.<br><br>Yani yetişkin erkeklerin yaklaşık %2.5'i 190.7 cm'den uzundur.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — ÖĞRENCİLERİ KARŞILAŞTIRMA</div><div class="example-body"><strong>İki öğrenci farklı sınavlara giriyor. Ali, Sınav A'da 88 alıyor ($\\mu = 75, \\sigma = 8$). Veli, Sınav B'de 82 alıyor ($\\mu = 70, \\sigma = 4$). Kohortuna göre kim daha iyi performans gösterdi?</strong><br><br>$z_{\\text{Ali}} = (88-75)/8 = 1.625$.<br>$z_{\\text{Veli}} = (82-70)/4 = 3.0$.<br><br>Veli'nin z-skoru çok daha yüksek. <strong>Veli kohortuna göre daha iyi performans gösterdi.</strong> Ham puanı daha düşük olsa da Sınav B'nin yayılımı daha sıkı, bu da onun avantajını standart sapma birimleri cinsinden daha anlamlı kılıyor.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — BİNOM YAKLAŞIMI</div><div class="example-body"><strong>Bir fabrika %10 kusur oranıyla ampul üretiyor. 400'lük bir partide kusur sayısının 35 ile 45 arasında olma yaklaşık olasılığını bul.</strong><br><br>$X \\sim \\text{Bin}(400, 0.1)$. Kontrol: $np = 40 > 5$, $n(1-p) = 360 > 5$, dolayısıyla normal yaklaşım uygulanır.<br><br>$\\mu = np = 40$, $\\sigma = \\sqrt{400 \\cdot 0.1 \\cdot 0.9} = \\sqrt{36} = 6$.<br><br>$z_1 = (35-40)/6 \\approx -0.83, \\; z_2 = (45-40)/6 \\approx 0.83$.<br><br>Ampirik kurala göre $P(-0.83 \\leq Z \\leq 0.83)$, %68'den biraz az. Daha kesin değer yaklaşık 0.59.<br><br>$P(35 \\leq X \\leq 45) \\approx \\mathbf{0.59}$, yani yaklaşık %59.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — ORTALAMA İÇİN ARALIK</div><div class="example-body"><strong>$X \\sim N(20, 9)$ için (yani $\\sigma = 3$), olasılığın %99'unu içeren ortalama etrafındaki simetrik aralığı ver.</strong><br><br>%99 orta $z \\in [-2.576, 2.576]$ demek.<br><br>$x \\in [\\mu - 2.576\\sigma, \\mu + 2.576\\sigma] = [20 - 7.73, 20 + 7.73] = [\\mathbf{12.27}, \\mathbf{27.73}]$.<br><br>Yani sonuçların %99'u yaklaşık 12.3 ile 27.7 arasında yatar.</div></div>

<div class="l-note"><strong>İleriye bakış.</strong> Bu dersteki her şey önizleme düzeyindedir. Sonraki dersler normal dağılımı daha derin geliştirir: tam z-tabloları, iki-kuyruklu ve tek-kuyruklu hipotez testleri, $z_{\\alpha/2}\\,\\sigma/\\sqrt{n}$'den inşa edilen güven aralıkları, küçük örnekler için t-dağılımı, çok değişkenli normal dağılımlar ve merkezi limit teoreminin uygun bir ispatı. Ama ampirik kural ve $z = (x-\\mu)/\\sigma$ standartlaştırması seninle sonsuza dek kalır — kesin esaslardır.</div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir normal dağılım $N(\\mu, \\sigma^2)$, $\\mu$ merkezli ve yayılımı $\\sigma$ olan çan eğrisidir; eğri altındaki toplam alan 1'dir</li>
<li>Standart normal $Z \\sim N(0,1)$, $\\mu = 0, \\sigma = 1$ özel durumudur; herhangi bir normal $z = (x-\\mu)/\\sigma$ ile standartlaştırılabilir</li>
<li>Ampirik kural: $\\mu \\pm \\sigma$ içinde yaklaşık %68, $\\mu \\pm 2\\sigma$ içinde %95, $\\mu \\pm 3\\sigma$ içinde %99.7</li>
<li>Anahtar kritik değerler: $z_{0.025} = 1.96$ (orta %95), $z_{0.05} = 1.645$ (orta %90), $z_{0.005} = 2.576$ (orta %99)</li>
<li>Farklı dağılımlardan gelen değerleri karşılaştırmak ve yüzdelik dilim bulmak için z-skorlarını kullan</li>
<li>Binoma normal yaklaşımı: $np, n(1-p) > 5$ olduğunda $\\text{Bin}(n,p) \\approx N(np, np(1-p))$</li>
<li>Merkezi limit teoremi (önizleme): birçok bağımsız rastgele değişkenin toplamı normale eğilim gösterir — doğada her yerde normalliğin görünme nedeni</li>
</ul>
</div>`
};
