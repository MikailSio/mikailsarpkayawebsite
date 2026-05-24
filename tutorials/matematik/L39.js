window.LISE_MAT_L39 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>Logarithms are not just an abstract trick for solving exponential equations.</strong> They are the natural language of the physical world whenever quantities span enormous ranges. The faintest whisper and a jet engine differ in sound intensity by a factor of one trillion. The acidity of pure water and battery acid differ in hydrogen-ion concentration by a factor of ten million. The energy released by a magnitude-5 earthquake versus a magnitude-9 earthquake differs by a factor of about thirty thousand. Writing these numbers in scientific notation is awkward; ranking them on a linear axis is impossible. The logarithm <em>compresses</em> these ranges into something the human eye can read.</p>

<p class="l-text">In this lesson we tour the four classical applications: the decibel scale for sound, the pH scale for acidity, the Richter scale for earthquakes, and the exponential growth and decay models used for populations, radioactive isotopes, and first-order chemical reactions. Each application uses the same idea — take a ratio of "the thing we measure" to "a reference value", then take a logarithm to compress it.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Use the decibel formula $\\beta = 10\\,\\log(I / I_0)$ to convert sound intensity to dB and back</li>
<li>Compute pH from hydrogen-ion concentration via $\\text{pH} = -\\log[H^+]$ and rank everyday substances</li>
<li>Interpret the Richter scale magnitude $M = \\log(A / A_0)$ and convert magnitude differences into energy ratios</li>
<li>Use $P(t) = P_0\\,e^{rt}$ for continuous growth and derive the doubling time $t_d = \\ln 2 / r$</li>
<li>Use the half-life formula $t_{1/2} = \\ln 2 / \\lambda$ for radioactive decay and first-order chemistry</li>
<li>Solve five classic word problems combining all four applications</li>
</ul>
</div>

<h2 class="lesson-title">1. Why Logarithms? Compressing Huge Ranges</h2>

<div class="calc-highlight"><strong>Everyday picture:</strong> imagine you want to plot, on a single chart, the loudness of a falling leaf, an ordinary conversation, a chainsaw, and a jet at takeoff. Their sound intensities (in watts per square metre) are roughly $10^{-12}$, $10^{-6}$, $10^{-3}$, and $10^{2}$. On a linear axis, the first three points all collapse to "nearly zero" and only the jet is visible. Take the logarithm: $-12, -6, -3, +2$. Now everything fits on a single line and every point is meaningful.</div>

<p class="l-text">Many physical quantities have this property: they range over many <em>orders of magnitude</em>. An order of magnitude is a factor of ten. When measurements span six, ten, or twenty orders of magnitude, a linear scale is useless. The logarithmic scale converts <em>multiplicative</em> differences into <em>additive</em> differences:</p>

<div class="calc-formula"><div class="formula-label">THE KEY PROPERTY</div><div class="formula-main">$$\\log(10 \\cdot x) \\;=\\; \\log 10 + \\log x \\;=\\; 1 + \\log x.$$</div><div class="formula-sub">Multiplying $x$ by 10 simply adds 1 to its logarithm. So a quantity that grows tenfold moves the logarithm one step; a quantity that grows a hundredfold moves the logarithm two steps; and so on.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear scale</div><div class="card-body">Equal spacing means equal <em>difference</em>. Useful when all values are roughly the same size. Hopeless when values range from $10^{-12}$ to $10^{12}$.</div></div>
<div class="calc-card"><div class="card-title">Logarithmic scale</div><div class="card-body">Equal spacing means equal <em>ratio</em> (factor). One step always corresponds to a factor of 10 (or $e$, or 2 depending on the base). Perfect for huge dynamic ranges.</div></div>
<div class="calc-card"><div class="card-title">Human perception</div><div class="card-body">Many human senses (hearing, sight, even the sensation of weight) respond approximately logarithmically. Doubling sound intensity is heard as a small increment, not as twice as loud. The logarithm matches biology.</div></div>
</div>

<h2 class="lesson-title">2. Sound and Decibels (dB)</h2>

<p class="l-text">Sound intensity $I$ is power per unit area, measured in watts per square metre $(\\text{W}/\\text{m}^2)$. The threshold of human hearing — the quietest sound a healthy ear can detect — is taken as the reference:</p>

<div class="calc-formula"><div class="formula-label">REFERENCE INTENSITY</div><div class="formula-main">$$I_0 \\;=\\; 10^{-12}\\;\\text{W}/\\text{m}^2.$$</div><div class="formula-sub">Any other sound is compared to this reference. The comparison is done multiplicatively (as a ratio), then compressed with a logarithm.</div></div>

<p class="l-text">The <strong>sound level</strong> $\\beta$ in decibels is defined as</p>

<div class="calc-formula"><div class="formula-label">DECIBEL FORMULA</div><div class="formula-main">$$\\beta \\;=\\; 10\\,\\log_{10}\\!\\left(\\frac{I}{I_0}\\right) \\quad \\text{(in dB)}.$$</div><div class="formula-sub">The factor 10 in front comes from converting "bels" (named after Alexander Graham Bell) to the smaller, more convenient unit of decibels.</div></div>

<p class="l-text"><strong>Why this works.</strong> If $I = I_0$ (the quietest audible sound), then $\\beta = 10 \\log 1 = 0$ dB. If $I = 10 \\cdot I_0$, then $\\beta = 10 \\log 10 = 10$ dB. If $I = 100 \\cdot I_0$, then $\\beta = 10 \\log 100 = 20$ dB. Every factor of 10 in intensity adds 10 dB; every factor of 100 adds 20 dB. The whole range from the threshold of hearing $(10^{-12}\\;\\text{W}/\\text{m}^2)$ to the threshold of pain $(10\\;\\text{W}/\\text{m}^2)$ — a factor of $10^{13}$ — fits between $0$ and $130$ dB.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Whisper</div><div class="card-body">$\\sim 30$ dB. Intensity $\\sim 10^{-9}\\;\\text{W}/\\text{m}^2$, about a thousand times louder than the bare hearing threshold.</div></div>
<div class="calc-card"><div class="card-title">Normal speech</div><div class="card-body">$\\sim 60$ dB at conversational distance. A million times more intense than the threshold but only twice the dB number of a whisper.</div></div>
<div class="calc-card"><div class="card-title">City traffic</div><div class="card-body">$\\sim 80$ dB. Long exposure starts to harm hearing.</div></div>
<div class="calc-card"><div class="card-title">Rock concert</div><div class="card-body">$\\sim 110$ dB. Intensity $\\sim 0.1\\;\\text{W}/\\text{m}^2$. Brief exposure already approaches the pain threshold.</div></div>
</div>

<div id="plot-l39-db-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sources=['Hearing\\nthreshold','Whisper','Library','Normal\\nspeech','Office','City\\ntraffic','Vacuum\\ncleaner','Subway','Lawn\\nmower','Rock\\nconcert','Jet at 30 m','Pain\\nthreshold'];
var dbs=[0,30,40,60,70,80,90,95,100,110,140,130];
var colors=dbs.map(function(d){if(d<40)return '#22c55e';if(d<70)return '#3b82f6';if(d<90)return '#c8a96e';if(d<110)return '#f59e0b';return '#f87171';});
var trace={x:sources,y:dbs,type:'bar',marker:{color:colors,line:{color:'rgba(255,255,255,0.18)',width:1}},text:dbs.map(function(d){return d+' dB';}),textposition:'outside',textfont:{color:'#ebe6dc',size:11},hovertemplate:'%{x}<br>%{y} dB<extra></extra>'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',tickangle:-30,title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'Sound level (dB)',range:[0,160]},margin:{t:30,r:30,b:90,l:60},showlegend:false};
Plotly.newPlot('plot-l39-db-en',[trace],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> common sound sources arranged by decibel level. The vertical axis is linear in dB but each 10 dB step is a tenfold jump in intensity. Sounds above $\\sim 85$ dB damage hearing with prolonged exposure; above 130 dB, damage is essentially immediate.</div></div>

<h2 class="lesson-title">3. Worked Example: Tenfold Intensity = +10 dB</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 1 — A SINGLE FACTOR OF TEN</div><div class="example-body"><strong>A sound is measured at 65 dB. The intensity is then increased tenfold. What is the new dB reading?</strong><br><br>Let $I_1$ be the original intensity, $I_2 = 10\\,I_1$ the new intensity.<br><br>$\\beta_2 - \\beta_1 = 10\\log\\!\\frac{I_2}{I_0} - 10\\log\\!\\frac{I_1}{I_0} = 10\\log\\!\\frac{I_2}{I_1} = 10\\log 10 = 10$ dB.<br><br>So $\\beta_2 = 65 + 10 = \\boxed{75\\;\\text{dB}}$. Multiplying the intensity by 10 always adds exactly 10 dB.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 2 — COMPARING SOURCES</div><div class="example-body"><strong>How many times more intense is a 100 dB lawnmower than a 60 dB conversation?</strong><br><br>Let $I_L$ and $I_C$ be the two intensities. Then $\\beta_L - \\beta_C = 10\\log(I_L / I_C)$, so<br><br>$100 - 60 = 10\\log(I_L / I_C) \\;\\Longrightarrow\\; \\log(I_L / I_C) = 4 \\;\\Longrightarrow\\; I_L / I_C = 10^4 = 10{,}000$.<br><br>The lawnmower is <strong>ten thousand times more intense</strong> than the conversation, even though the dB difference is "only" 40.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 3 — INTENSITY FROM dB</div><div class="example-body"><strong>A rock concert measures 110 dB. What is the actual intensity?</strong><br><br>Solve $110 = 10\\log(I / I_0)$ for $I$:<br><br>$\\log(I / I_0) = 11 \\;\\Longrightarrow\\; I / I_0 = 10^{11} \\;\\Longrightarrow\\; I = 10^{11} \\cdot 10^{-12}\\;\\text{W}/\\text{m}^2 = 10^{-1}\\;\\text{W}/\\text{m}^2 = 0.1\\;\\text{W}/\\text{m}^2$.<br><br>So a rock concert delivers $0.1\\;\\text{W}/\\text{m}^2$ — a hundred billion times more intense than the threshold of hearing.</div></div>

<div class="think-box"><div class="think-label">PERCEPTION VS INTENSITY</div><div class="think-body">Doubling the physical intensity corresponds to roughly $10\\log 2 \\approx 3$ dB extra. The human ear, however, reports a sound as "twice as loud" only when the dB level rises by about 10 (a tenfold intensity jump). This is why amplifier knobs feel like they "don't do much" until you turn them past a threshold.</div></div>

<h2 class="lesson-title">4. The pH Scale</h2>

<p class="l-text">Acidity and basicity are governed by the concentration of hydrogen ions $[H^+]$, measured in moles per litre (mol/L). Pure water at 25 °C has $[H^+] = 10^{-7}$ mol/L; battery acid has $[H^+] \\approx 1$ mol/L; oven cleaner has $[H^+] \\approx 10^{-14}$ mol/L. The full range spans fourteen orders of magnitude. The pH scale compresses this:</p>

<div class="calc-formula"><div class="formula-label">pH DEFINITION</div><div class="formula-main">$$\\text{pH} \\;=\\; -\\log_{10}[H^+].$$</div><div class="formula-sub">The minus sign makes the pH positive (since $[H^+]$ is a small number, its logarithm is negative). The result usually lies between 0 (very acidic) and 14 (very basic), with 7 representing neutral water.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Acid (pH &lt; 7)</div><div class="card-body">$[H^+] > 10^{-7}$ mol/L. Examples: lemon juice $\\sim 2$, vinegar $\\sim 3$, black coffee $\\sim 5$.</div></div>
<div class="calc-card"><div class="card-title">Neutral (pH = 7)</div><div class="card-body">$[H^+] = 10^{-7}$ mol/L. Pure water at 25 °C is the canonical example.</div></div>
<div class="calc-card"><div class="card-title">Base (pH &gt; 7)</div><div class="card-body">$[H^+] < 10^{-7}$ mol/L. Examples: baking soda solution $\\sim 9$, soap $\\sim 10$, bleach $\\sim 13$.</div></div>
<div class="calc-card"><div class="card-title">A unit jump = 10×</div><div class="card-body">Lemon juice (pH 2) has ten times more hydrogen ions per litre than vinegar (pH 3) and a thousand times more than coffee (pH 5).</div></div>
</div>

<div id="plot-l39-ph-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['Battery\\nacid','Stomach\\nacid','Lemon\\njuice','Vinegar','Tomato','Coffee','Milk','Pure\\nwater','Sea\\nwater','Baking\\nsoda','Ammonia','Bleach','Lye'];
var ph=[0.5,1.5,2,3,4.5,5,6.5,7,8,9,11,12.5,14];
var colors=ph.map(function(p){
  if(p<3)return '#dc2626';
  if(p<5)return '#f59e0b';
  if(p<6.5)return '#fbbf24';
  if(p<7.5)return '#22c55e';
  if(p<9)return '#10b981';
  if(p<11)return '#06b6d4';
  if(p<13)return '#3b82f6';
  return '#7c3aed';
});
var trace={x:labels,y:ph,type:'bar',marker:{color:colors,line:{color:'rgba(255,255,255,0.2)',width:1}},text:ph.map(function(p){return 'pH '+p;}),textposition:'outside',textfont:{color:'#ebe6dc',size:11},hovertemplate:'%{x}<br>pH %{y}<extra></extra>'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',tickangle:-30,title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'pH',range:[0,16],dtick:2},margin:{t:30,r:30,b:90,l:50},showlegend:false,shapes:[{type:'line',x0:-0.5,x1:12.5,y0:7,y1:7,line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'}}],annotations:[{x:12,y:7.6,text:'neutral (pH 7)',showarrow:false,font:{color:'rgba(255,255,255,0.55)',size:11},xanchor:'right'}]};
Plotly.newPlot('plot-l39-ph-en',[trace],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> common substances on the pH scale, with red tones for strong acids, green for neutral, and blue/violet for strong bases. The dashed line at pH 7 separates acids (below) from bases (above).</div></div>

<h2 class="lesson-title">5. Worked Example: pH 3 vs pH 6</h2>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 4 — RATIO OF ACIDITIES</div><div class="example-body"><strong>How many times more acidic is a liquid at pH 3 compared with a liquid at pH 6?</strong><br><br>Let $[H^+]_3$ and $[H^+]_6$ be the two concentrations. Since pH = $-\\log[H^+]$,<br><br>$[H^+]_3 = 10^{-3}$ mol/L and $[H^+]_6 = 10^{-6}$ mol/L.<br><br>The ratio:<br><br>$\\dfrac{[H^+]_3}{[H^+]_6} \\;=\\; \\dfrac{10^{-3}}{10^{-6}} \\;=\\; 10^{3} \\;=\\; 1000$.<br><br>The pH 3 liquid is <strong>one thousand times more acidic</strong> (more hydrogen ions per litre) than the pH 6 liquid, even though the pH numbers differ by only 3.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 5 — pH FROM CONCENTRATION</div><div class="example-body"><strong>An acidic rainwater sample contains $[H^+] = 4.2 \\times 10^{-5}$ mol/L. Find its pH.</strong><br><br>$\\text{pH} = -\\log(4.2 \\times 10^{-5}) = -[\\log 4.2 + \\log 10^{-5}] = -[0.623 - 5] = 4.377$.<br><br>So the rainwater has pH $\\approx 4.4$ — distinctly acidic (normal rain is around pH 5.6). This is the regime of "acid rain" from sulphur and nitrogen oxides dissolved in atmospheric water.</div></div>

<div class="think-box"><div class="think-label">WHY pH MATTERS BIOLOGICALLY</div><div class="think-body">Human blood is buffered very tightly to pH 7.35–7.45. A drop to 7.0 or a rise to 7.8 is medically catastrophic — both correspond to roughly a factor-of-three change in $[H^+]$. The logarithm scale hides how sensitive biology is to small pH shifts.</div></div>

<h2 class="lesson-title">6. Earthquake Magnitude — The Richter Scale</h2>

<p class="l-text">The Richter magnitude, introduced by Charles Richter in 1935, also uses a base-10 logarithm to compress a huge range. The magnitude $M$ is defined from the amplitude $A$ of the largest seismic wave recorded by a standard seismograph at a standard distance, divided by a reference amplitude $A_0$:</p>

<div class="calc-formula"><div class="formula-label">RICHTER MAGNITUDE</div><div class="formula-main">$$M \\;=\\; \\log_{10}\\!\\left(\\frac{A}{A_0}\\right).$$</div><div class="formula-sub">A magnitude-5 earthquake has wave amplitude $10^5$ times larger than the reference. A magnitude-7 earthquake has amplitude $10^7$ times the reference — a hundred times larger than M = 5.</div></div>

<p class="l-text"><strong>Amplitude vs energy.</strong> Doubling the magnitude does not double the destructiveness. The <em>energy</em> released by an earthquake scales as roughly $10^{1.5 M}$. Each unit jump in magnitude corresponds to about $10^{1.5} \\approx 31.6$ times more energy.</p>

<div class="calc-formula"><div class="formula-label">ENERGY RATIO BETWEEN TWO QUAKES</div><div class="formula-main">$$\\frac{E_2}{E_1} \\;\\approx\\; 10^{1.5\\,(M_2 - M_1)}.$$</div><div class="formula-sub">A magnitude-6 quake releases about $10^{1.5} \\approx 32$ times more energy than a magnitude-5; a magnitude-8 quake releases about $10^{1.5 \\cdot 3} \\approx 32{,}000$ times more energy than a magnitude-5.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 6 — AMPLITUDE RATIO</div><div class="example-body"><strong>The 1999 Marmara earthquake had magnitude 7.4. The 2020 Elazığ earthquake had magnitude 6.8. How many times larger were the seismic waves of the Marmara quake?</strong><br><br>Amplitude ratio: $\\dfrac{A_1}{A_2} = 10^{M_1 - M_2} = 10^{7.4 - 6.8} = 10^{0.6} \\approx 3.98$.<br><br>The Marmara waves were about <strong>four times larger</strong> in amplitude than Elazığ.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 7 — ENERGY RATIO</div><div class="example-body"><strong>How many times more energy did the Marmara quake (M = 7.4) release than the Elazığ quake (M = 6.8)?</strong><br><br>$\\dfrac{E_1}{E_2} \\approx 10^{1.5 \\cdot (7.4 - 6.8)} = 10^{0.9} \\approx 7.94$.<br><br>The Marmara earthquake released about <strong>eight times more energy</strong> — significantly more destructive, even though the magnitude difference is "only" 0.6.</div></div>

<div class="think-box"><div class="think-label">WHY MEDIA HEADLINES MISLEAD</div><div class="think-body">News reports often say "the new quake was stronger than the old one by 0.5 magnitude." That sounds small, but $0.5$ on a log scale corresponds to roughly $\\sqrt{10} \\approx 3.2$ times the amplitude and about $10^{0.75} \\approx 5.6$ times the energy. Always translate magnitude differences into factors before judging severity.</div></div>

<h2 class="lesson-title">7. Population Growth — Continuous Model and Doubling Time</h2>

<p class="l-text">If a population grows at a continuous rate $r$ (per year), its size at time $t$ follows the exponential model</p>

<div class="calc-formula"><div class="formula-label">CONTINUOUS GROWTH</div><div class="formula-main">$$P(t) \\;=\\; P_0\\,e^{rt},$$</div><div class="formula-sub">where $P_0$ is the initial population at $t = 0$ and $r$ is the continuous (instantaneous) growth rate. Note this is base $e$ growth; the same data can equivalently be written with base 2, base 10, or any base, but $e$ is mathematically the cleanest.</div></div>

<p class="l-text">The most-asked question for such a model is: <em>how long until the population doubles?</em> Set $P(t_d) = 2P_0$ and solve for $t_d$:</p>

<div class="calc-formula"><div class="formula-main">$$2P_0 \\;=\\; P_0\\,e^{r t_d} \\;\\Longrightarrow\\; 2 = e^{r t_d} \\;\\Longrightarrow\\; \\ln 2 = r t_d \\;\\Longrightarrow\\; t_d \\;=\\; \\dfrac{\\ln 2}{r}.$$</div></div>

<div class="calc-formula"><div class="formula-label">DOUBLING TIME</div><div class="formula-main">$$\\boxed{\\;t_d \\;=\\; \\frac{\\ln 2}{r} \\;\\approx\\; \\frac{0.693}{r}\\;}$$</div><div class="formula-sub">A useful rule of thumb: if $r$ is given as a percentage per year, the doubling time in years is approximately $70 / (r\\,\\text{percent})$. This is the famous "rule of 70" used in economics and demography.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 8 — DOUBLING A CITY</div><div class="example-body"><strong>A city of population 500,000 grows continuously at 2.5% per year ($r = 0.025$). When will the population double?</strong><br><br>$t_d = \\dfrac{\\ln 2}{0.025} = \\dfrac{0.693}{0.025} \\approx 27.7$ years.<br><br>The rule of 70 gives $70 / 2.5 = 28$ years — essentially the same answer. So the city will reach a million inhabitants in about <strong>28 years</strong>.</div></div>

<div id="plot-l39-pop-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],p1=[],p2=[],p3=[];
var P0=500;
for(var i=0;i<=80;i++){t.push(i);p1.push(P0*Math.exp(0.01*i));p2.push(P0*Math.exp(0.025*i));p3.push(P0*Math.exp(0.05*i));}
var tr1={x:t,y:p1,mode:'lines',name:'r = 1% / yr',line:{color:'#3b82f6',width:2.6}};
var tr2={x:t,y:p2,mode:'lines',name:'r = 2.5% / yr',line:{color:'#c8a96e',width:2.8}};
var tr3={x:t,y:p3,mode:'lines',name:'r = 5% / yr',line:{color:'#f87171',width:2.6}};
var line2x={x:[0,80],y:[2*P0,2*P0],mode:'lines',name:'2× initial',line:{color:'rgba(255,255,255,0.35)',width:1.2,dash:'dash'},hoverinfo:'skip'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'time (years)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'Population (thousands)'},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:69,y:1080,text:'r=1%, doubles ~69 yr',showarrow:false,font:{color:'#3b82f6',size:11}},{x:28,y:1080,text:'r=2.5%, doubles ~28 yr',showarrow:false,font:{color:'#c8a96e',size:11}},{x:14,y:1080,text:'r=5%, doubles ~14 yr',showarrow:false,font:{color:'#f87171',size:11}}]};
Plotly.newPlot('plot-l39-pop-en',[tr1,tr2,tr3,line2x],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> three populations starting at 500,000 with continuous growth rates 1%, 2.5%, and 5%. The dashed line marks twice the initial value; the doubling time is read off as the $t$-coordinate where each curve crosses the dashed line. Higher $r$ gives a much shorter $t_d$ via $t_d = \\ln 2 / r$.</div></div>

<h2 class="lesson-title">8. Half-Life — Radioactive Decay</h2>

<p class="l-text">Radioactive isotopes follow the same exponential law as growth, but with a negative rate. If $N(t)$ denotes the number of undecayed nuclei at time $t$, then</p>

<div class="calc-formula"><div class="formula-label">RADIOACTIVE DECAY</div><div class="formula-main">$$N(t) \\;=\\; N_0\\,e^{-\\lambda t},$$</div><div class="formula-sub">where $\\lambda > 0$ is the decay constant. The half-life $t_{1/2}$ is the time it takes for half the nuclei to decay.</div></div>

<p class="l-text">Set $N(t_{1/2}) = N_0 / 2$ and solve:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{N_0}{2} = N_0\\,e^{-\\lambda t_{1/2}} \\;\\Longrightarrow\\; \\frac{1}{2} = e^{-\\lambda t_{1/2}} \\;\\Longrightarrow\\; \\ln(1/2) = -\\lambda t_{1/2} \\;\\Longrightarrow\\; t_{1/2} = \\dfrac{\\ln 2}{\\lambda}.$$</div></div>

<div class="calc-formula"><div class="formula-label">HALF-LIFE FORMULA</div><div class="formula-main">$$\\boxed{\\;t_{1/2} \\;=\\; \\frac{\\ln 2}{\\lambda}\\;}$$</div><div class="formula-sub">Mathematically identical to the doubling time formula, with $\\lambda$ playing the role of $r$. After $n$ half-lives the surviving fraction is $1/2^n$.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Carbon-14</div><div class="card-body">$t_{1/2} \\approx 5730$ years. Used for archaeological dating.</div></div>
<div class="calc-card"><div class="card-title">Iodine-131</div><div class="card-body">$t_{1/2} \\approx 8$ days. Used in medicine; decays rapidly.</div></div>
<div class="calc-card"><div class="card-title">Uranium-238</div><div class="card-body">$t_{1/2} \\approx 4.5 \\times 10^9$ years. Comparable to the age of the Earth.</div></div>
<div class="calc-card"><div class="card-title">Plutonium-239</div><div class="card-body">$t_{1/2} \\approx 24{,}100$ years. The reason nuclear waste storage is a multi-millennium problem.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 9 — CARBON DATING</div><div class="example-body"><strong>A wooden artefact contains 38% of its original C-14. Estimate its age. (Half-life of C-14: 5730 yr.)</strong><br><br>Use $N(t) / N_0 = e^{-\\lambda t}$ with $\\lambda = \\ln 2 / 5730$.<br><br>$0.38 = e^{-\\lambda t} \\;\\Longrightarrow\\; \\ln 0.38 = -\\lambda t \\;\\Longrightarrow\\; t = -\\dfrac{\\ln 0.38}{\\lambda}$.<br><br>$\\ln 0.38 \\approx -0.968$ and $\\lambda \\approx 0.000121$ / yr. So<br><br>$t \\approx \\dfrac{0.968}{0.000121} \\approx 8000$ years.<br><br>The artefact is roughly <strong>8000 years old</strong>.</div></div>

<div id="plot-l39-decay-en" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],N=[];
var th=5730;
var lam=Math.LN2/th;
for(var i=0;i<=60;i++){var x=i*th*4/60;t.push(x);N.push(100*Math.exp(-lam*x));}
var tN={x:t,y:N,mode:'lines',name:'N(t) / N₀ (%)',line:{color:'#c8a96e',width:2.8}};
var halfX=[th,2*th,3*th,4*th];
var halfY=[50,25,12.5,6.25];
var marks={x:halfX,y:halfY,mode:'markers+text',name:'half-lives',marker:{size:10,color:'#22c55e'},text:['50%','25%','12.5%','6.25%'],textposition:'top right',textfont:{color:'#22c55e',size:11}};
var shapes=halfX.map(function(x){return{type:'line',x0:x,x1:x,y0:0,y1:100,line:{color:'rgba(34,197,94,0.3)',width:1,dash:'dash'}};});
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'time (years)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'remaining fraction (%)',range:[0,110]},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},shapes:shapes};
Plotly.newPlot('plot-l39-decay-en',[tN,marks],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>What this plot shows:</strong> radioactive decay of carbon-14 ($t_{1/2} = 5730$ yr). Each dashed vertical line marks a successive half-life; the remaining fraction halves at every line. After four half-lives ($\\sim 23{,}000$ years) only 6.25% remains.</div></div>

<h2 class="lesson-title">9. First-Order Chemical Kinetics</h2>

<p class="l-text">Many chemical reactions follow first-order kinetics: the rate of disappearance of a reactant $A$ is proportional to its current concentration $[A]$. This gives the same exponential law:</p>

<div class="calc-formula"><div class="formula-label">FIRST-ORDER REACTION</div><div class="formula-main">$$[A](t) \\;=\\; [A]_0\\,e^{-k t},$$</div><div class="formula-sub">where $k$ is the rate constant. Taking the natural log of both sides linearises the curve:</div></div>

<div class="calc-formula"><div class="formula-main">$$\\ln[A](t) \\;=\\; \\ln[A]_0 - k t.$$</div></div>

<p class="l-text"><strong>Why this matters in the lab.</strong> If you plot $\\ln[A]$ versus $t$ and the points fall on a straight line, the reaction is first order. The slope is $-k$ and the intercept is $\\ln[A]_0$. This is exactly how chemists determine reaction orders experimentally.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE 10 — FIRST-ORDER REACTION</div><div class="example-body"><strong>A first-order reaction has rate constant $k = 0.15$ / min. How long until 90% of the reactant is consumed?</strong><br><br>If 90% is consumed, 10% remains: $[A]/[A]_0 = 0.10$.<br><br>$0.10 = e^{-0.15 t} \\;\\Longrightarrow\\; \\ln 0.10 = -0.15 t \\;\\Longrightarrow\\; t = \\dfrac{-\\ln 0.10}{0.15} = \\dfrac{2.303}{0.15} \\approx 15.4\\;\\text{min}$.<br><br>The reaction takes about <strong>15.4 minutes</strong> to consume 90% of the reactant.</div></div>

<h2 class="lesson-title">10. Classic Exercises — Five Applications</h2>

<div class="calc-example"><div class="example-label">EXERCISE 1 — DECIBEL DIFFERENCE</div><div class="example-body"><strong>The sound level of a factory machine is 95 dB. A second identical machine starts running next to it. What is the new sound level?</strong><br><br><em>Solution.</em> Two identical sources double the total intensity. Doubling intensity adds $10 \\log 2 \\approx 3.01$ dB. New level: $95 + 3 = \\boxed{98\\;\\text{dB}}$.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 2 — pH OF MIXED SOLUTIONS</div><div class="example-body"><strong>1 L of pH 3 acid is diluted with 9 L of pure water. Find the new pH.</strong><br><br><em>Solution.</em> Original $[H^+] = 10^{-3}$ mol/L in 1 L, total $10^{-3}$ mol. New volume 10 L, so new $[H^+] = 10^{-3}/10 = 10^{-4}$ mol/L. New pH = $-\\log 10^{-4} = \\boxed{4}$. Tenfold dilution raises pH by 1.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 3 — EARTHQUAKE</div><div class="example-body"><strong>Earthquake A has magnitude 4.5 and earthquake B has magnitude 6.5. How many times larger is B's amplitude, and how many times more energetic?</strong><br><br><em>Solution.</em> Amplitude ratio: $10^{6.5 - 4.5} = 10^{2} = \\boxed{100}$ times larger. Energy ratio: $10^{1.5 \\cdot 2} = 10^{3} = \\boxed{1000}$ times more energetic.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 4 — BACTERIAL CULTURE</div><div class="example-body"><strong>A bacterial culture doubles every 20 minutes. Starting with 1000 bacteria, how many are there after 3 hours?</strong><br><br><em>Solution.</em> 3 hours = 180 minutes = 9 doubling periods. After $n$ doublings the count is $1000 \\cdot 2^9 = 1000 \\cdot 512 = \\boxed{512{,}000}$ bacteria. Equivalently, $r = \\ln 2 / 20$ per minute, so $P(180) = 1000 \\cdot e^{(\\ln 2/20)\\cdot 180} = 1000 \\cdot 2^{9} = 512{,}000$ — the two methods agree.</div></div>

<div class="calc-example"><div class="example-label">EXERCISE 5 — RADIOACTIVE COOLING-OFF</div><div class="example-body"><strong>Iodine-131 has a half-life of 8 days. After how many days has a sample decayed to 5% of its original mass?</strong><br><br><em>Solution.</em> $\\lambda = \\ln 2 / 8$ per day. Solve $0.05 = e^{-\\lambda t}$: $\\ln 0.05 = -\\lambda t$, so $t = -\\ln 0.05 \\cdot 8 / \\ln 2 = 2.996 \\cdot 8 / 0.693 \\approx \\boxed{34.6\\;\\text{days}}$. About one month for I-131 to fall to 5%, which is why hospitals can store and dispose of small medical doses safely.</div></div>

<div class="think-box"><div class="think-label">SUMMARY OF THE LOGARITHMIC TOOLBOX</div><div class="think-body">Every application in this lesson follows the same pattern: a quantity $Q$ varies over a huge range; we form the ratio $Q / Q_0$ to a chosen reference, then apply $\\log$ (base 10 or $e$ depending on convention) to compress the scale. The decibel uses $10\\log_{10}$; pH uses $-\\log_{10}$; Richter uses $\\log_{10}$; growth and decay use $\\ln$ implicitly through $e^{rt}$. Once you see the pattern, every "log application" reduces to the same algebra.</div></div>

<p class="l-text">In the next lesson we will turn from these applied uses of logarithms back to their abstract structure and study <em>logarithmic differentiation</em> — a technique that combines the algebraic properties of logarithms with the derivative tools you already know. The connections between high-school logarithm algebra and calculus run deep, and you have now seen both the algebraic and the modelling sides of the story.</p>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Logaritma sadece üstel denklem çözmek için kullanılan soyut bir hile değildir.</strong> Çok büyük aralıkları kapsayan fiziksel büyüklüklerin doğal dilidir. En hafif fısıltı ile jet motoru, ses şiddetinde bir trilyon kat fark gösterir. Saf su ile akü asidi, hidrojen iyonu derişiminde on milyon kat fark içerir. 5 büyüklüğündeki bir depremin enerjisi ile 9 büyüklüğündeki bir depremin enerjisi yaklaşık otuz bin kat farklıdır. Bu sayıları bilimsel gösterimle yazmak hantal; doğrusal eksende sıralamak imkânsızdır. Logaritma bu aralıkları insan gözünün okuyabileceği bir biçime <em>sıkıştırır</em>.</p>

<p class="l-text">Bu derste dört klasik uygulamayı dolaşacağız: ses için desibel ölçeği, asitlik için pH ölçeği, depremler için Richter ölçeği, nüfus, radyoaktif izotop ve birinci derece kimyasal tepkimeler için üstel büyüme/azalma modelleri. Hepsi aynı fikri kullanır — "ölçtüğümüz şey"in "referans değer"e oranını alıp logaritmasını alarak sıkıştırırız.</p>

<div class="lesson-outcomes" style="background:rgba(34,197,94,0.06);border-left:3px solid #22c55e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#22c55e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Desibel formülü $\\beta = 10\\,\\log(I / I_0)$ ile ses şiddetini dB'ye ve tersine çevirme</li>
<li>$\\text{pH} = -\\log[H^+]$ ile hidrojen iyonu derişiminden pH hesaplama ve günlük maddeleri sıralama</li>
<li>Richter büyüklüğü $M = \\log(A / A_0)$ değerini yorumlama ve büyüklük farkını enerji oranına çevirme</li>
<li>$P(t) = P_0\\,e^{rt}$ sürekli büyüme modelinde ikileme zamanı $t_d = \\ln 2 / r$ türetimi</li>
<li>Radyoaktif bozunma ve birinci derece kimya için yarı ömür formülü $t_{1/2} = \\ln 2 / \\lambda$</li>
<li>Dört uygulamanın birleştirildiği beş klasik problem çözme</li>
</ul>
</div>

<h2 class="lesson-title">1. Neden Logaritma? Büyük Aralıkları Sıkıştırmak</h2>

<div class="calc-highlight"><strong>Günlük bir görüntü:</strong> tek bir grafik üzerinde, düşen bir yaprağın, sıradan bir sohbetin, motorlu testerenin ve havalanan jetin sesinin şiddetini gösterelim. Yaklaşık değerler (watt/m²): $10^{-12}$, $10^{-6}$, $10^{-3}$ ve $10^{2}$. Doğrusal eksende ilk üç nokta "neredeyse sıfır" olarak üst üste biner, sadece jet görünür. Logaritma alın: $-12, -6, -3, +2$. Şimdi her şey tek bir doğruya sığar ve her nokta anlamlıdır.</div>

<p class="l-text">Birçok fiziksel büyüklük bu özelliğe sahiptir: pek çok <em>büyüklük mertebesi</em> üzerinde değişirler. Bir büyüklük mertebesi, on çarpanıdır. Ölçümler altı, on hatta yirmi büyüklük mertebesi kapsadığında doğrusal ölçek işe yaramaz. Logaritmik ölçek <em>çarpımsal</em> farkları <em>toplamsal</em> farklara dönüştürür:</p>

<div class="calc-formula"><div class="formula-label">TEMEL ÖZELLİK</div><div class="formula-main">$$\\log(10 \\cdot x) \\;=\\; \\log 10 + \\log x \\;=\\; 1 + \\log x.$$</div><div class="formula-sub">$x$'i 10 ile çarpmak, logaritmasına yalnızca 1 ekler. On katına çıkan büyüklük, logaritmasını bir basamak öteler; yüz katına çıkan iki basamak; ve böyle devam eder.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusal ölçek</div><div class="card-body">Eşit aralık, eşit <em>fark</em> demektir. Tüm değerler birbirine yakınken kullanışlıdır. $10^{-12}$ ile $10^{12}$ arasını göstermesi imkânsızdır.</div></div>
<div class="calc-card"><div class="card-title">Logaritmik ölçek</div><div class="card-body">Eşit aralık, eşit <em>oran</em> (çarpan) demektir. Bir basamak her zaman 10 katı (ya da $e$, ya da 2 — tabana göre) anlamına gelir. Geniş dinamik aralıklar için mükemmeldir.</div></div>
<div class="calc-card"><div class="card-title">Algı</div><div class="card-body">İnsanın birçok duyusu (işitme, görme, hatta ağırlık hissi) yaklaşık olarak logaritmik tepki verir. Ses şiddetini iki katına çıkarmak "iki kat yüksek" olarak değil, küçük bir artış olarak duyulur. Logaritma biyolojiyle örtüşür.</div></div>
</div>

<h2 class="lesson-title">2. Ses ve Desibel (dB)</h2>

<p class="l-text">Ses şiddeti $I$, birim alandan geçen güçtür; birimi watt/m² $(\\text{W}/\\text{m}^2)$. İnsan kulağının duyabileceği en sessiz ses — sağlıklı bir kulağın algılayabildiği eşik — referans olarak alınır:</p>

<div class="calc-formula"><div class="formula-label">REFERANS ŞİDDET</div><div class="formula-main">$$I_0 \\;=\\; 10^{-12}\\;\\text{W}/\\text{m}^2.$$</div><div class="formula-sub">Diğer her ses bu referansa kıyaslanır. Karşılaştırma çarpımsal olarak (oran) yapılır, sonra logaritma ile sıkıştırılır.</div></div>

<p class="l-text"><strong>Ses düzeyi</strong> $\\beta$, desibel cinsinden şöyle tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">DESİBEL FORMÜLÜ</div><div class="formula-main">$$\\beta \\;=\\; 10\\,\\log_{10}\\!\\left(\\frac{I}{I_0}\\right) \\quad (\\text{dB cinsinden}).$$</div><div class="formula-sub">Önündeki 10 çarpanı, "bel" biriminden (Alexander Graham Bell'den) daha küçük ve pratik birim olan desibele dönüşümden gelir.</div></div>

<p class="l-text"><strong>Neden işe yarıyor.</strong> $I = I_0$ ise (en sessiz duyulabilir ses), $\\beta = 10 \\log 1 = 0$ dB. $I = 10 \\cdot I_0$ ise $\\beta = 10 \\log 10 = 10$ dB. $I = 100 \\cdot I_0$ ise $\\beta = 10 \\log 100 = 20$ dB. Şiddetteki her 10 katı 10 dB ekler; her 100 katı 20 dB ekler. Duyma eşiğinden $(10^{-12}\\;\\text{W}/\\text{m}^2)$ acı eşiğine $(10\\;\\text{W}/\\text{m}^2)$ — yani $10^{13}$ katlık aralık — tamamı $0$–$130$ dB arasına sığar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fısıltı</div><div class="card-body">$\\sim 30$ dB. Şiddet $\\sim 10^{-9}\\;\\text{W}/\\text{m}^2$, duyma eşiğinden yaklaşık bin kat yüksek.</div></div>
<div class="calc-card"><div class="card-title">Normal konuşma</div><div class="card-body">Sohbet mesafesinde $\\sim 60$ dB. Eşiğin bir milyon katı kadar şiddetli ama dB sayısı fısıltının sadece iki katı.</div></div>
<div class="calc-card"><div class="card-title">Şehir trafiği</div><div class="card-body">$\\sim 80$ dB. Uzun süreli maruziyet işitmeye zarar vermeye başlar.</div></div>
<div class="calc-card"><div class="card-title">Rock konseri</div><div class="card-body">$\\sim 110$ dB. Şiddet $\\sim 0.1\\;\\text{W}/\\text{m}^2$. Kısa süreli maruziyet bile acı eşiğine yaklaşır.</div></div>
</div>

<div id="plot-l39-db-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var sources=['Duyma\\neşiği','Fısıltı','Kütüphane','Normal\\nkonuşma','Ofis','Şehir\\ntrafiği','Elektrik\\nsüpürgesi','Metro','Çim\\nbiçme','Rock\\nkonseri','Jet 30 m','Acı\\neşiği'];
var dbs=[0,30,40,60,70,80,90,95,100,110,140,130];
var colors=dbs.map(function(d){if(d<40)return '#22c55e';if(d<70)return '#3b82f6';if(d<90)return '#c8a96e';if(d<110)return '#f59e0b';return '#f87171';});
var trace={x:sources,y:dbs,type:'bar',marker:{color:colors,line:{color:'rgba(255,255,255,0.18)',width:1}},text:dbs.map(function(d){return d+' dB';}),textposition:'outside',textfont:{color:'#ebe6dc',size:11},hovertemplate:'%{x}<br>%{y} dB<extra></extra>'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',tickangle:-30,title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'Ses düzeyi (dB)',range:[0,160]},margin:{t:30,r:30,b:90,l:60},showlegend:false};
Plotly.newPlot('plot-l39-db-tr',[trace],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte:</strong> gündelik ses kaynakları desibel düzeylerine göre sıralanmıştır. Dikey eksen dB'de doğrusaldır ama her 10 dB adımı şiddette 10 katlık bir sıçramadır. $\\sim 85$ dB üstü uzun süreli maruziyet işitmeye zarar verir; 130 dB üstünde zarar neredeyse anında oluşur.</div></div>

<h2 class="lesson-title">3. Çalışılmış Örnek: 10× Şiddet = +10 dB</h2>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 1 — TEK BİR ON KATI</div><div class="example-body"><strong>Bir ses 65 dB ölçülüyor. Şiddet sonra on katına çıkarılıyor. Yeni dB değeri nedir?</strong><br><br>$I_1$ ilk şiddet, $I_2 = 10\\,I_1$ yeni şiddet olsun.<br><br>$\\beta_2 - \\beta_1 = 10\\log\\!\\frac{I_2}{I_0} - 10\\log\\!\\frac{I_1}{I_0} = 10\\log\\!\\frac{I_2}{I_1} = 10\\log 10 = 10$ dB.<br><br>Demek ki $\\beta_2 = 65 + 10 = \\boxed{75\\;\\text{dB}}$. Şiddeti 10 ile çarpmak her zaman tam olarak 10 dB ekler.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 2 — KAYNAK KARŞILAŞTIRMASI</div><div class="example-body"><strong>100 dB'lik bir çim biçme makinesi, 60 dB'lik bir konuşmadan kaç kat daha şiddetlidir?</strong><br><br>$I_L$ ve $I_C$ iki şiddet olsun. $\\beta_L - \\beta_C = 10\\log(I_L / I_C)$ olduğundan:<br><br>$100 - 60 = 10\\log(I_L / I_C) \\;\\Longrightarrow\\; \\log(I_L / I_C) = 4 \\;\\Longrightarrow\\; I_L / I_C = 10^4 = 10{.}000$.<br><br>Çim biçme makinesi konuşmadan <strong>on bin kat</strong> daha şiddetlidir, oysa dB farkı "yalnızca" 40.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 3 — dB'DEN ŞİDDETE</div><div class="example-body"><strong>Bir rock konseri 110 dB ölçülüyor. Şiddetin gerçek değeri nedir?</strong><br><br>$110 = 10\\log(I / I_0)$ denkleminden $I$'yi çözelim:<br><br>$\\log(I / I_0) = 11 \\;\\Longrightarrow\\; I / I_0 = 10^{11} \\;\\Longrightarrow\\; I = 10^{11} \\cdot 10^{-12}\\;\\text{W}/\\text{m}^2 = 10^{-1}\\;\\text{W}/\\text{m}^2 = 0{,}1\\;\\text{W}/\\text{m}^2$.<br><br>Rock konseri $0{,}1\\;\\text{W}/\\text{m}^2$ taşır — duyma eşiğinin yüz milyar katı şiddetinde.</div></div>

<div class="think-box"><div class="think-label">ALGI İLE ŞİDDET</div><div class="think-body">Fiziksel şiddeti iki katına çıkarmak yaklaşık $10\\log 2 \\approx 3$ dB ekler. Ancak insan kulağı bir sesi yaklaşık 10 dB (on katı şiddet sıçraması) arttığında "iki kat yüksek" olarak algılar. Bu, amplifikatör düğmelerinin belirli bir eşiğe kadar "bir şey yapmıyor" gibi hissedilmesinin nedenidir.</div></div>

<h2 class="lesson-title">4. pH Ölçeği</h2>

<p class="l-text">Asitlik ve bazlık, hidrojen iyonu derişimi $[H^+]$ tarafından belirlenir (mol/L olarak ölçülür). 25 °C'de saf suyun $[H^+] = 10^{-7}$ mol/L'dir; akü asidi $[H^+] \\approx 1$ mol/L; fırın temizleyici $[H^+] \\approx 10^{-14}$ mol/L. Tüm aralık on dört büyüklük mertebesi kapsar. pH ölçeği bunu sıkıştırır:</p>

<div class="calc-formula"><div class="formula-label">pH TANIMI</div><div class="formula-main">$$\\text{pH} \\;=\\; -\\log_{10}[H^+].$$</div><div class="formula-sub">Eksi işareti pH'ı pozitif yapar (çünkü $[H^+]$ küçük bir sayıdır ve logaritması negatif olur). Sonuç genellikle 0 (çok asidik) ile 14 (çok bazik) arasındadır; 7 nötr suyu temsil eder.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Asit (pH &lt; 7)</div><div class="card-body">$[H^+] > 10^{-7}$ mol/L. Limon suyu $\\sim 2$, sirke $\\sim 3$, sade kahve $\\sim 5$.</div></div>
<div class="calc-card"><div class="card-title">Nötr (pH = 7)</div><div class="card-body">$[H^+] = 10^{-7}$ mol/L. 25 °C'de saf su klasik örnektir.</div></div>
<div class="calc-card"><div class="card-title">Baz (pH &gt; 7)</div><div class="card-body">$[H^+] < 10^{-7}$ mol/L. Karbonat çözeltisi $\\sim 9$, sabun $\\sim 10$, çamaşır suyu $\\sim 13$.</div></div>
<div class="calc-card"><div class="card-title">Bir birim = 10×</div><div class="card-body">Limon suyu (pH 2), sirke (pH 3)'ten on kat, kahve (pH 5)'ten bin kat daha fazla hidrojen iyonuna sahiptir.</div></div>
</div>

<div id="plot-l39-ph-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var labels=['Akü\\nasidi','Mide\\nasidi','Limon\\nsuyu','Sirke','Domates','Kahve','Süt','Saf\\nsu','Deniz\\nsuyu','Karbonat','Amonyak','Çamaşır\\nsuyu','Kostik'];
var ph=[0.5,1.5,2,3,4.5,5,6.5,7,8,9,11,12.5,14];
var colors=ph.map(function(p){
  if(p<3)return '#dc2626';
  if(p<5)return '#f59e0b';
  if(p<6.5)return '#fbbf24';
  if(p<7.5)return '#22c55e';
  if(p<9)return '#10b981';
  if(p<11)return '#06b6d4';
  if(p<13)return '#3b82f6';
  return '#7c3aed';
});
var trace={x:labels,y:ph,type:'bar',marker:{color:colors,line:{color:'rgba(255,255,255,0.2)',width:1}},text:ph.map(function(p){return 'pH '+p;}),textposition:'outside',textfont:{color:'#ebe6dc',size:11},hovertemplate:'%{x}<br>pH %{y}<extra></extra>'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',tickangle:-30,title:''},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'pH',range:[0,16],dtick:2},margin:{t:30,r:30,b:90,l:50},showlegend:false,shapes:[{type:'line',x0:-0.5,x1:12.5,y0:7,y1:7,line:{color:'rgba(255,255,255,0.35)',width:1.5,dash:'dash'}}],annotations:[{x:12,y:7.6,text:'nötr (pH 7)',showarrow:false,font:{color:'rgba(255,255,255,0.55)',size:11},xanchor:'right'}]};
Plotly.newPlot('plot-l39-ph-tr',[trace],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte:</strong> gündelik maddeler pH ölçeğinde gösterilmiştir; kırmızı tonlar güçlü asitleri, yeşil nötrü, mavi/mor güçlü bazları temsil eder. pH 7'deki kesikli çizgi asitleri (alt) bazlardan (üst) ayırır.</div></div>

<h2 class="lesson-title">5. Çalışılmış Örnek: pH 3 ile pH 6</h2>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 4 — ASİTLİK ORANI</div><div class="example-body"><strong>pH 3 olan bir sıvı, pH 6 olan bir sıvıdan kaç kat daha asidiktir?</strong><br><br>$[H^+]_3$ ve $[H^+]_6$ derişimler olsun. pH = $-\\log[H^+]$ olduğundan:<br><br>$[H^+]_3 = 10^{-3}$ mol/L ve $[H^+]_6 = 10^{-6}$ mol/L.<br><br>Oran:<br><br>$\\dfrac{[H^+]_3}{[H^+]_6} \\;=\\; \\dfrac{10^{-3}}{10^{-6}} \\;=\\; 10^{3} \\;=\\; 1000$.<br><br>pH 3 sıvısı, pH 6 sıvısından <strong>bin kat daha asidiktir</strong>, hâlbuki pH değerleri arasındaki fark sadece 3.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 5 — DERİŞİMDEN pH</div><div class="example-body"><strong>Asidik bir yağmur örneğinde $[H^+] = 4{,}2 \\times 10^{-5}$ mol/L bulundu. pH değerini hesaplayın.</strong><br><br>$\\text{pH} = -\\log(4{,}2 \\times 10^{-5}) = -[\\log 4{,}2 + \\log 10^{-5}] = -[0{,}623 - 5] = 4{,}377$.<br><br>Yağmurun pH'ı $\\approx 4{,}4$ — belirgin biçimde asidik (normal yağmur yaklaşık pH 5,6). Bu, atmosferik kükürt ve azot oksitlerinin suda çözünmesinden kaynaklanan "asit yağmuru" bölgesidir.</div></div>

<div class="think-box"><div class="think-label">pH BİYOLOJİK OLARAK NEDEN ÖNEMLİ</div><div class="think-body">İnsan kanı pH 7,35–7,45 arasında çok sıkı tamponlanır. 7,0'a düşmek veya 7,8'e çıkmak tıbben felakettir — her ikisi de $[H^+]$'da yaklaşık üç katlık değişime karşılık gelir. Logaritma ölçeği, biyolojinin küçük pH kaymalarına ne kadar duyarlı olduğunu gizler.</div></div>

<h2 class="lesson-title">6. Deprem Büyüklüğü — Richter Ölçeği</h2>

<p class="l-text">1935'te Charles Richter tarafından tanıtılan Richter büyüklüğü de büyük bir aralığı sıkıştırmak için 10 tabanlı logaritmadan yararlanır. Büyüklük $M$, standart bir sismografın belirli bir uzaklıkta kaydettiği en büyük sismik dalganın genliği $A$ ile referans genliği $A_0$ arasındaki oranla tanımlanır:</p>

<div class="calc-formula"><div class="formula-label">RICHTER BÜYÜKLÜĞÜ</div><div class="formula-main">$$M \\;=\\; \\log_{10}\\!\\left(\\frac{A}{A_0}\\right).$$</div><div class="formula-sub">5 büyüklüğündeki bir depremin dalga genliği referansın $10^5$ katıdır. 7 büyüklüğündekinin genliği $10^7$ kat — yani M = 5'ten yüz kat daha büyüktür.</div></div>

<p class="l-text"><strong>Genlik ile enerji farkı.</strong> Büyüklüğü iki katına çıkarmak yıkıcılığı iki katına çıkarmaz. Depremin <em>enerji</em>si yaklaşık $10^{1{,}5 M}$ ile ölçeklenir. Büyüklükte her bir birim sıçraması yaklaşık $10^{1{,}5} \\approx 31{,}6$ kat daha fazla enerjiye karşılık gelir.</p>

<div class="calc-formula"><div class="formula-label">İKİ DEPREMİN ENERJİ ORANI</div><div class="formula-main">$$\\frac{E_2}{E_1} \\;\\approx\\; 10^{1{,}5\\,(M_2 - M_1)}.$$</div><div class="formula-sub">6 büyüklüğündeki bir deprem, 5 büyüklüğündekinden $10^{1{,}5} \\approx 32$ kat; 8 büyüklüğündeki ise 5 büyüklüğündekinden $10^{4{,}5} \\approx 32{.}000$ kat daha fazla enerji açığa çıkarır.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 6 — GENLİK ORANI</div><div class="example-body"><strong>1999 Marmara depreminin büyüklüğü 7,4 idi. 2020 Elazığ depreminin büyüklüğü 6,8 idi. Marmara depreminin sismik dalgaları kaç kat daha büyüktü?</strong><br><br>Genlik oranı: $\\dfrac{A_1}{A_2} = 10^{M_1 - M_2} = 10^{7{,}4 - 6{,}8} = 10^{0{,}6} \\approx 3{,}98$.<br><br>Marmara dalgaları Elazığ'dan yaklaşık <strong>dört kat daha büyüktü</strong>.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 7 — ENERJİ ORANI</div><div class="example-body"><strong>Marmara depremi (M = 7,4), Elazığ depreminden (M = 6,8) kaç kat daha fazla enerji açığa çıkardı?</strong><br><br>$\\dfrac{E_1}{E_2} \\approx 10^{1{,}5 \\cdot (7{,}4 - 6{,}8)} = 10^{0{,}9} \\approx 7{,}94$.<br><br>Marmara depremi yaklaşık <strong>sekiz kat daha fazla enerji</strong> açığa çıkardı — büyüklük farkı "sadece" 0,6 olsa da çok daha yıkıcıdır.</div></div>

<div class="think-box"><div class="think-label">HABER MANŞETLERİ NEDEN YANILTICI</div><div class="think-body">Haberler sık sık "yeni deprem öncekinden 0,5 büyüklük daha güçlüydü" der. Kulağa az gibi gelir ama logaritma ölçeğinde $0{,}5$, genlikte yaklaşık $\\sqrt{10} \\approx 3{,}2$ ve enerjide $10^{0{,}75} \\approx 5{,}6$ katına denk düşer. Büyüklük farklarını her zaman çarpana çevirip yıkıcılık değerlendirmesini öyle yapın.</div></div>

<h2 class="lesson-title">7. Nüfus Büyümesi — Sürekli Model ve İkileme Zamanı</h2>

<p class="l-text">Bir nüfus, sürekli $r$ oranıyla (yıllık) artıyorsa, $t$ zamanındaki büyüklüğü üstel modeli izler:</p>

<div class="calc-formula"><div class="formula-label">SÜREKLİ BÜYÜME</div><div class="formula-main">$$P(t) \\;=\\; P_0\\,e^{rt},$$</div><div class="formula-sub">burada $P_0$ başlangıç ($t = 0$ anındaki) nüfus, $r$ sürekli (anlık) büyüme oranıdır. Bu $e$ tabanlı bir büyümedir; aynı veri 2, 10 veya başka bir tabanla da yazılabilir, ancak $e$ matematiksel olarak en temizidir.</div></div>

<p class="l-text">Bu modelle en çok sorulan soru: <em>nüfusun ikiye katlanması ne kadar sürer?</em> $P(t_d) = 2P_0$ koyup $t_d$'yi çözelim:</p>

<div class="calc-formula"><div class="formula-main">$$2P_0 \\;=\\; P_0\\,e^{r t_d} \\;\\Longrightarrow\\; 2 = e^{r t_d} \\;\\Longrightarrow\\; \\ln 2 = r t_d \\;\\Longrightarrow\\; t_d \\;=\\; \\dfrac{\\ln 2}{r}.$$</div></div>

<div class="calc-formula"><div class="formula-label">İKİLEME ZAMANI</div><div class="formula-main">$$\\boxed{\\;t_d \\;=\\; \\frac{\\ln 2}{r} \\;\\approx\\; \\frac{0{,}693}{r}\\;}$$</div><div class="formula-sub">Pratik kural: $r$ yüzde/yıl olarak verilirse, ikileme zamanı yıl cinsinden yaklaşık $70 / (r\\,\\text{yüzde})$'dir. Bu, ekonomi ve demografide bilinen "70 kuralı"dır.</div></div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 8 — BİR ŞEHİR İKİYE KATLANIYOR</div><div class="example-body"><strong>500.000 nüfuslu bir şehir yıllık %2,5 sürekli oranıyla büyüyor ($r = 0{,}025$). Nüfus ne zaman ikiye katlanır?</strong><br><br>$t_d = \\dfrac{\\ln 2}{0{,}025} = \\dfrac{0{,}693}{0{,}025} \\approx 27{,}7$ yıl.<br><br>70 kuralı $70 / 2{,}5 = 28$ yıl verir — neredeyse aynı sonuç. Şehir bir milyon kişiye yaklaşık <strong>28 yılda</strong> ulaşır.</div></div>

<div id="plot-l39-pop-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],p1=[],p2=[],p3=[];
var P0=500;
for(var i=0;i<=80;i++){t.push(i);p1.push(P0*Math.exp(0.01*i));p2.push(P0*Math.exp(0.025*i));p3.push(P0*Math.exp(0.05*i));}
var tr1={x:t,y:p1,mode:'lines',name:'r = %1 / yıl',line:{color:'#3b82f6',width:2.6}};
var tr2={x:t,y:p2,mode:'lines',name:'r = %2,5 / yıl',line:{color:'#c8a96e',width:2.8}};
var tr3={x:t,y:p3,mode:'lines',name:'r = %5 / yıl',line:{color:'#f87171',width:2.6}};
var line2x={x:[0,80],y:[2*P0,2*P0],mode:'lines',name:'2× başlangıç',line:{color:'rgba(255,255,255,0.35)',width:1.2,dash:'dash'},hoverinfo:'skip'};
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'zaman (yıl)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'Nüfus (bin)'},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},annotations:[{x:69,y:1080,text:'r=%1, ~69 yıl',showarrow:false,font:{color:'#3b82f6',size:11}},{x:28,y:1080,text:'r=%2,5, ~28 yıl',showarrow:false,font:{color:'#c8a96e',size:11}},{x:14,y:1080,text:'r=%5, ~14 yıl',showarrow:false,font:{color:'#f87171',size:11}}]};
Plotly.newPlot('plot-l39-pop-tr',[tr1,tr2,tr3,line2x],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte:</strong> 500.000'den başlayan üç nüfus %1, %2,5 ve %5 sürekli oranlarda büyür. Kesikli çizgi başlangıcın iki katını gösterir; ikileme zamanı, eğrinin kesikli çizgiyi kestiği $t$ değeridir. Daha yüksek $r$, $t_d = \\ln 2 / r$ uyarınca daha kısa süre verir.</div></div>

<h2 class="lesson-title">8. Yarı Ömür — Radyoaktif Bozunma</h2>

<p class="l-text">Radyoaktif izotoplar büyüme ile aynı üstel kanunu izler, sadece oran negatiftir. $N(t)$, $t$ anında henüz bozunmamış çekirdek sayısını gösterirse:</p>

<div class="calc-formula"><div class="formula-label">RADYOAKTİF BOZUNMA</div><div class="formula-main">$$N(t) \\;=\\; N_0\\,e^{-\\lambda t},$$</div><div class="formula-sub">burada $\\lambda > 0$ bozunma sabitidir. Yarı ömür $t_{1/2}$, çekirdeklerin yarısının bozunması için geçen süredir.</div></div>

<p class="l-text">$N(t_{1/2}) = N_0 / 2$ koyup çözelim:</p>

<div class="calc-formula"><div class="formula-main">$$\\frac{N_0}{2} = N_0\\,e^{-\\lambda t_{1/2}} \\;\\Longrightarrow\\; \\frac{1}{2} = e^{-\\lambda t_{1/2}} \\;\\Longrightarrow\\; \\ln(1/2) = -\\lambda t_{1/2} \\;\\Longrightarrow\\; t_{1/2} = \\dfrac{\\ln 2}{\\lambda}.$$</div></div>

<div class="calc-formula"><div class="formula-label">YARI ÖMÜR FORMÜLÜ</div><div class="formula-main">$$\\boxed{\\;t_{1/2} \\;=\\; \\frac{\\ln 2}{\\lambda}\\;}$$</div><div class="formula-sub">İkileme zamanı formülüyle matematiksel olarak aynıdır, $\\lambda$ burada $r$'nin rolünü oynar. $n$ yarı ömür sonra kalan oran $1/2^n$'dir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karbon-14</div><div class="card-body">$t_{1/2} \\approx 5730$ yıl. Arkeolojik tarihleme için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">İyot-131</div><div class="card-body">$t_{1/2} \\approx 8$ gün. Tıpta kullanılır; hızla bozunur.</div></div>
<div class="calc-card"><div class="card-title">Uranyum-238</div><div class="card-body">$t_{1/2} \\approx 4{,}5 \\times 10^9$ yıl. Dünya'nın yaşına yakın.</div></div>
<div class="calc-card"><div class="card-title">Plutonyum-239</div><div class="card-body">$t_{1/2} \\approx 24{.}100$ yıl. Nükleer atık depolamanın bin yıllık bir sorun olmasının nedeni.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 9 — KARBON TARİHLENDİRME</div><div class="example-body"><strong>Bir ahşap eserin orijinal C-14'ünün %38'i kalmıştır. Yaşını tahmin edin. (C-14 yarı ömrü: 5730 yıl.)</strong><br><br>$N(t) / N_0 = e^{-\\lambda t}$ ile $\\lambda = \\ln 2 / 5730$ kullanın.<br><br>$0{,}38 = e^{-\\lambda t} \\;\\Longrightarrow\\; \\ln 0{,}38 = -\\lambda t \\;\\Longrightarrow\\; t = -\\dfrac{\\ln 0{,}38}{\\lambda}$.<br><br>$\\ln 0{,}38 \\approx -0{,}968$ ve $\\lambda \\approx 0{,}000121$ / yıl. O hâlde<br><br>$t \\approx \\dfrac{0{,}968}{0{,}000121} \\approx 8000$ yıl.<br><br>Eser yaklaşık <strong>8000 yıllıktır</strong>.</div></div>

<div id="plot-l39-decay-tr" class="plotly-graph" style="height:420px"></div>
<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var t=[],N=[];
var th=5730;
var lam=Math.LN2/th;
for(var i=0;i<=60;i++){var x=i*th*4/60;t.push(x);N.push(100*Math.exp(-lam*x));}
var tN={x:t,y:N,mode:'lines',name:'N(t) / N₀ (%)',line:{color:'#c8a96e',width:2.8}};
var halfX=[th,2*th,3*th,4*th];
var halfY=[50,25,12.5,6.25];
var marks={x:halfX,y:halfY,mode:'markers+text',name:'yarı ömürler',marker:{size:10,color:'#22c55e'},text:['50%','25%','12,5%','6,25%'],textposition:'top right',textfont:{color:'#22c55e',size:11}};
var shapes=halfX.map(function(x){return{type:'line',x0:x,x1:x,y0:0,y1:100,line:{color:'rgba(34,197,94,0.3)',width:1,dash:'dash'}};});
var layout={paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ebe6dc'},xaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'zaman (yıl)'},yaxis:{gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.15)',title:'kalan oran (%)',range:[0,110]},margin:{t:30,r:30,b:55,l:60},showlegend:true,legend:{font:{color:'#ebe6dc'},orientation:'h',x:0.5,xanchor:'center',y:-0.22},shapes:shapes};
Plotly.newPlot('plot-l39-decay-tr',[tN,marks],layout,{responsive:true,displayModeBar:false});
},120)</script>

<div class="calc-graph"><div class="graph-caption"><strong>Bu grafikte:</strong> karbon-14'ün radyoaktif bozunması ($t_{1/2} = 5730$ yıl). Her kesikli dikey çizgi ardışık bir yarı ömrü gösterir; kalan oran her çizgide yarılanır. Dört yarı ömür sonra ($\\sim 23{.}000$ yıl) yalnızca %6,25 kalır.</div></div>

<h2 class="lesson-title">9. Birinci Derece Kimyasal Kinetik</h2>

<p class="l-text">Birçok kimyasal tepkime birinci derece kinetiği izler: bir tepken $A$'nın kaybolma hızı, anlık derişimi $[A]$ ile orantılıdır. Bu da aynı üstel kanunu verir:</p>

<div class="calc-formula"><div class="formula-label">BİRİNCİ DERECE TEPKİME</div><div class="formula-main">$$[A](t) \\;=\\; [A]_0\\,e^{-k t},$$</div><div class="formula-sub">burada $k$ tepkime hız sabitidir. İki tarafın doğal logaritması, eğriyi doğrusallaştırır:</div></div>

<div class="calc-formula"><div class="formula-main">$$\\ln[A](t) \\;=\\; \\ln[A]_0 - k t.$$</div></div>

<p class="l-text"><strong>Bunun laboratuvarda anlamı.</strong> $\\ln[A]$'yı $t$'ye karşı çizdiğinizde noktalar bir doğruya yakınsıyorsa, tepkime birinci derecedir. Eğim $-k$, kesim noktası $\\ln[A]_0$'dır. Kimyagerler tepkime mertebesini deneysel olarak tam bu şekilde belirler.</p>

<div class="calc-example"><div class="example-label">ÇALIŞILMIŞ ÖRNEK 10 — BİRİNCİ DERECE TEPKİME</div><div class="example-body"><strong>Birinci derece bir tepkimenin hız sabiti $k = 0{,}15$ / dk. Tepkenin %90'ı tüketilene kadar ne kadar süre geçer?</strong><br><br>%90 tüketilirse %10 kalır: $[A]/[A]_0 = 0{,}10$.<br><br>$0{,}10 = e^{-0{,}15 t} \\;\\Longrightarrow\\; \\ln 0{,}10 = -0{,}15 t \\;\\Longrightarrow\\; t = \\dfrac{-\\ln 0{,}10}{0{,}15} = \\dfrac{2{,}303}{0{,}15} \\approx 15{,}4\\;\\text{dk}$.<br><br>Tepkime %90 tüketim için yaklaşık <strong>15,4 dakika</strong> sürer.</div></div>

<h2 class="lesson-title">10. Klasik Alıştırmalar — Beş Uygulama</h2>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — DESİBEL FARKI</div><div class="example-body"><strong>Bir fabrika makinesinin ses düzeyi 95 dB'dir. Yanına aynı türde ikinci bir makine çalıştırılırsa yeni ses düzeyi ne olur?</strong><br><br><em>Çözüm.</em> Aynı türden iki kaynak toplam şiddeti ikiye katlar. Şiddeti iki katına çıkarmak $10 \\log 2 \\approx 3{,}01$ dB ekler. Yeni düzey: $95 + 3 = \\boxed{98\\;\\text{dB}}$.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — KARIŞIK ÇÖZELTİLERİN pH'I</div><div class="example-body"><strong>1 L pH 3 asit, 9 L saf su ile seyreltilir. Yeni pH'ı bulun.</strong><br><br><em>Çözüm.</em> Orijinal $[H^+] = 10^{-3}$ mol/L $\\times$ 1 L = $10^{-3}$ mol. Yeni hacim 10 L, dolayısıyla yeni $[H^+] = 10^{-3}/10 = 10^{-4}$ mol/L. Yeni pH = $-\\log 10^{-4} = \\boxed{4}$. On katlık seyreltme pH'ı 1 birim arttırır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — DEPREM</div><div class="example-body"><strong>A depreminin büyüklüğü 4,5; B depreminin büyüklüğü 6,5. B'nin genliği kaç kat daha büyük ve kaç kat daha enerjiktir?</strong><br><br><em>Çözüm.</em> Genlik oranı: $10^{6{,}5 - 4{,}5} = 10^{2} = \\boxed{100}$ kat daha büyük. Enerji oranı: $10^{1{,}5 \\cdot 2} = 10^{3} = \\boxed{1000}$ kat daha enerjik.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — BAKTERİ KÜLTÜRÜ</div><div class="example-body"><strong>Bir bakteri kültürü her 20 dakikada bir ikiye katlanıyor. 1000 bakteri ile başlanırsa 3 saat sonra kaç bakteri olur?</strong><br><br><em>Çözüm.</em> 3 saat = 180 dakika = 9 ikileme dönemi. $n$ ikileme sonrası sayı $1000 \\cdot 2^9 = 1000 \\cdot 512 = \\boxed{512{.}000}$ bakteri. Eşdeğer olarak $r = \\ln 2 / 20$ /dk, böylece $P(180) = 1000 \\cdot e^{(\\ln 2/20)\\cdot 180} = 1000 \\cdot 2^{9} = 512{.}000$ — iki yöntem aynıdır.</div></div>

<div class="calc-example"><div class="example-label">ALIŞTIRMA 5 — RADYOAKTİF SOĞUMA</div><div class="example-body"><strong>İyot-131'in yarı ömrü 8 gündür. Bir örnek orijinal kütlesinin %5'ine kaç gün sonra düşer?</strong><br><br><em>Çözüm.</em> $\\lambda = \\ln 2 / 8$ /gün. $0{,}05 = e^{-\\lambda t}$ denklemini çözelim: $\\ln 0{,}05 = -\\lambda t$, dolayısıyla $t = -\\ln 0{,}05 \\cdot 8 / \\ln 2 = 2{,}996 \\cdot 8 / 0{,}693 \\approx \\boxed{34{,}6\\;\\text{gün}}$. I-131'in %5'e düşmesi yaklaşık bir ay sürer; bu nedenle hastaneler küçük tıbbi dozları güvenle saklayıp imha edebilir.</div></div>

<div class="think-box"><div class="think-label">LOGARİTMA ALETLERİNİN ÖZETİ</div><div class="think-body">Bu derste işlenen her uygulama aynı örüntüyü izler: bir büyüklük $Q$ çok geniş bir aralıkta değişir; seçilmiş bir referansa oranı $Q / Q_0$ alınır, sonra logaritma (gelenekselliğe göre 10 ya da $e$ tabanlı) uygulanır. Desibel $10\\log_{10}$ kullanır; pH $-\\log_{10}$ kullanır; Richter $\\log_{10}$ kullanır; büyüme ve bozunma örtük olarak $e^{rt}$ ile $\\ln$ kullanır. Örüntüyü görünce her "log uygulaması" aynı cebire indirgenir.</div></div>

<p class="l-text">Bir sonraki derste bu uygulamalı yaklaşımdan logaritmanın soyut yapısına dönüp <em>logaritmik türev</em>'i çalışacağız — logaritmanın cebirsel özelliklerini hâlihazırda bildiğiniz türev araçlarıyla birleştiren bir teknik. Lise logaritma cebiri ile kalkülüs arasındaki bağlar derindir ve siz şimdi hikâyenin hem cebirsel hem modelleme tarafını gördünüz.</p>
`
};
