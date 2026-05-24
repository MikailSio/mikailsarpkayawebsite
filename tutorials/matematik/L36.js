/* ============================================================
   tutorials/matematik/L36.js
   Lise Matematik · Ders 36: Logaritma Tanımı ve Özellikleri
   Lesson 36 — Logarithm Definition and Properties
   Pure educational content for Turkish high school students.
   Bilingual EN/TR · KaTeX + Plotly · NO Python, NO ML
   ============================================================ */

window.LISE_MAT_L36 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `
<p class="l-text"><strong>The logarithm is the inverse of the exponential.</strong> In Lesson 35 we built the exponential function $f(x) = a^x$ and watched it grow with explosive speed — doubling, tripling, multiplying without end. But many natural questions run the other way. <em>How many times must I multiply 2 by itself to reach 1024? After how many years does $1$ TL at $5\\%$ interest become $10$ TL? On what decibel scale does sound pressure double?</em> Each of these is an <strong>inverse</strong> question: given the output of an exponential, recover the input. The logarithm is exactly the tool we need.</p>

<p class="l-text">In this lesson we define $\\log_a x$ rigorously, study its domain, graph, and asymptotic behaviour, and then derive the three classical "rules" — the product, quotient, and power laws — directly from the exponential rules they invert. We finish with the inverse-function identities $a^{\\log_a x} = x$ and $\\log_a(a^x) = x$, and a battery of practice problems that train your fingers to manipulate logarithms as fluently as ordinary algebraic expressions.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Translate fluently between the logarithmic equation $\\log_a x = y$ and the exponential equation $a^y = x$.</li>
<li>Identify the natural domain ($x > 0$) and range ($y \\in \\mathbb{R}$) of $\\log_a x$ and explain why.</li>
<li>Sketch $y = \\log_a x$ for $a > 1$ and for $0 < a < 1$, including the vertical asymptote at $x = 0$.</li>
<li>Prove the product, quotient, and power rules from the exponential rules they mirror.</li>
<li>Use the inverse-function identities $a^{\\log_a x} = x$ and $\\log_a (a^x) = x$ to simplify expressions.</li>
<li>Apply all three rules together to condense or expand complicated logarithmic expressions.</li>
</ul>
</div>

<!-- ============================================================
     SECTION 1 — History and Motivation
     ============================================================ -->
<h2 class="l-title">1. A Short History: Why Logarithms Were Invented</h2>

<p class="l-text">Before electronic calculators, multiplying two large numbers — say, $4789.31 \\times 6523.07$ — was painful, slow work, easy to get wrong. In 1614 the Scottish mathematician <strong>John Napier</strong> published a book called <em>Mirifici Logarithmorum Canonis Descriptio</em> ("Description of the Wonderful Canon of Logarithms"), which introduced a table that turned every multiplication problem into an <em>addition</em> problem.</p>

<div class="l-highlight"><strong>Napier's insight.</strong> Suppose we have a table that, for every positive number $x$, gives a special value $L(x)$ with the property that $L(x \\cdot y) = L(x) + L(y)$. Then to multiply $x \\cdot y$, we just look up $L(x)$ and $L(y)$, add them, and reverse-look-up the result in the table. Multiplication has become addition.</div>

<p class="l-text">That special function $L$ is the <strong>logarithm</strong>. Napier's tables, refined later by Henry Briggs into base-10 (common) logarithms, were the workhorse of every engineer, navigator, and astronomer from the 1600s until the 1970s. The slide rule — a sliding pair of logarithmic scales — let scientists multiply in seconds for over three centuries. The pocket calculator made the tables obsolete, but the function they tabulated, $\\log$, remained central to mathematics.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1614</div><div class="card-body">John Napier publishes the first logarithm table. Computation by hand becomes faster overnight.</div></div>
<div class="calc-card"><div class="card-title">1617</div><div class="card-body">Henry Briggs invents the base-10 logarithm $\\log_{10}$, tailored to decimal arithmetic.</div></div>
<div class="calc-card"><div class="card-title">1622</div><div class="card-body">William Oughtred invents the slide rule, a mechanical logarithm "calculator." Used until the 1970s.</div></div>
<div class="calc-card"><div class="card-title">Today</div><div class="card-body">Logarithms describe pH, decibels, the Richter scale, entropy, complexity, and almost every "scale" with order-of-magnitude meaning.</div></div>
</div>

<p class="l-text">Even though we no longer need logarithms to multiply, the function itself appears everywhere a quantity is best measured in <em>orders of magnitude</em>: pH measures hydrogen-ion concentration logarithmically, decibels measure sound intensity logarithmically, the Richter scale measures earthquake energy logarithmically, and the human eye and ear perceive light and sound logarithmically (the Weber–Fechner law).</p>

<!-- ============================================================
     SECTION 2 — Definition
     ============================================================ -->
<h2 class="l-title">2. The Definition: Logarithm as Inverse of Exponential</h2>

<p class="l-text">Recall from Lesson 35 that for a fixed base $a > 0$ with $a \\neq 1$, the exponential function</p>

$$f(x) = a^x$$

<p class="l-text">is strictly monotone (increasing if $a > 1$, decreasing if $0 < a < 1$) and takes every positive value exactly once. A strictly monotone function has an <strong>inverse</strong>. We give that inverse a name.</p>

<div class="calc-formula">
<div class="formula-label">DEFINITION OF THE LOGARITHM</div>
<div class="formula-main">$$\\log_a x = y \\quad \\Longleftrightarrow \\quad a^y = x$$</div>
<div class="formula-sub">"$\\log_a x$" is read "log base $a$ of $x$." It is the exponent to which we must raise $a$ to obtain $x$.</div>
</div>

<p class="l-text"><strong>Word-by-word.</strong> The number $\\log_a x$ <em>is itself an exponent</em>. It is the unique exponent that, applied to base $a$, produces $x$. The logarithm and the exponential are two sides of the same coin: the exponential takes an exponent and produces a value; the logarithm takes a value and recovers the exponent.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">EXPONENTIAL FORM</div>
<div class="compare-item">$2^3 = 8$</div>
<div class="compare-item">$10^4 = 10000$</div>
<div class="compare-item">$5^0 = 1$</div>
<div class="compare-item">$a^1 = a$</div>
</div>
<div class="compare-col">
<div class="compare-title">LOGARITHMIC FORM</div>
<div class="compare-item">$\\log_2 8 = 3$</div>
<div class="compare-item">$\\log_{10} 10000 = 4$</div>
<div class="compare-item">$\\log_5 1 = 0$</div>
<div class="compare-item">$\\log_a a = 1$</div>
</div>
</div>

<div class="calc-example">
<div class="example-label">WORKED EXAMPLE — TRANSLATION DRILL</div>
<div class="example-body"><strong>Convert each to the opposite form.</strong><br><br>
(a) $3^4 = 81 \\;\\Longleftrightarrow\\; \\log_3 81 = 4$.<br>
(b) $\\log_{10} 1000 = 3 \\;\\Longleftrightarrow\\; 10^3 = 1000$.<br>
(c) $\\log_2 \\tfrac{1}{8} = -3 \\;\\Longleftrightarrow\\; 2^{-3} = \\tfrac{1}{8}$.<br>
(d) $\\log_a 1 = 0 \\;\\Longleftrightarrow\\; a^0 = 1$ (any allowed base).</div>
</div>

<p class="l-text"><strong>Notation conventions.</strong> Three special bases get their own shorthand:</p>

<ul style="line-height:1.7;padding-left:1.5rem">
<li><strong>$\\log_{10} x$</strong> (base ten) is often written simply as $\\log x$ or $\\lg x$. This is the <em>common</em> logarithm, used in pH, decibels, etc.</li>
<li><strong>$\\log_e x$</strong> (base $e \\approx 2.71828$) is written $\\ln x$ and called the <em>natural</em> logarithm. We will meet $e$ properly in Lesson 38; for now, just know that it is the natural base of calculus.</li>
<li><strong>$\\log_2 x$</strong> (base two) appears in computer science (bits of information) and is sometimes written $\\operatorname{lb} x$ or $\\log_2 x$.</li>
</ul>

<div class="l-note"><strong>Allowed bases.</strong> We require $a > 0$ and $a \\neq 1$. If $a \\le 0$ the exponential $a^x$ is not defined for all real $x$ (no real square root of a negative, for instance), and if $a = 1$ then $a^x \\equiv 1$ is constant, so it has no inverse.</div>

<!-- ============================================================
     SECTION 3 — Domain and Range
     ============================================================ -->
<h2 class="l-title">3. Domain and Range</h2>

<p class="l-text">Because $\\log_a x$ inverts $a^x$, its <strong>domain</strong> equals the <em>range</em> of $a^x$, and its <strong>range</strong> equals the <em>domain</em> of $a^x$.</p>

<div class="calc-formula">
<div class="formula-label">DOMAIN AND RANGE OF $\\log_a$</div>
<div class="formula-main">$$\\text{Dom}(\\log_a) = (0, \\infty), \\qquad \\text{Range}(\\log_a) = (-\\infty, \\infty) = \\mathbb{R}.$$</div>
<div class="formula-sub">The input $x$ must be strictly positive; the output $y$ can be any real number.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$x > 0$</div><div class="card-body">$a^y$ is always positive (no real exponent makes a positive base into zero or a negative number), so the equation $a^y = x$ has a solution <em>only</em> when $x > 0$. Hence $\\log_a$ of a non-positive number does not exist.</div></div>
<div class="calc-card"><div class="card-title">$y \\in \\mathbb{R}$</div><div class="card-body">Any real number can serve as an exponent. Positive $y$ gives $x > 1$; $y = 0$ gives $x = 1$; negative $y$ gives $0 < x < 1$.</div></div>
<div class="calc-card"><div class="card-title">$\\log_a 0$</div><div class="card-body">Undefined. The equation $a^y = 0$ has no solution, since $a^y > 0$ for every real $y$.</div></div>
<div class="calc-card"><div class="card-title">$\\log_a(-3)$</div><div class="card-body">Undefined in real numbers. The equation $a^y = -3$ has no real solution. (Complex logarithms exist, but only beyond high school.)</div></div>
</div>

<div class="calc-example">
<div class="example-label">DOMAIN PROBLEMS</div>
<div class="example-body"><strong>Find the domain of each function.</strong><br><br>
(a) $f(x) = \\log_2(x - 5)$. We need $x - 5 > 0$, i.e., $x > 5$. Domain: $(5, \\infty)$.<br><br>
(b) $g(x) = \\log_3(9 - x^2)$. We need $9 - x^2 > 0$, i.e., $x^2 < 9$, i.e., $-3 < x < 3$. Domain: $(-3, 3)$.<br><br>
(c) $h(x) = \\log_{10}\\bigl(\\log_2 x\\bigr)$. The outer log needs $\\log_2 x > 0$, which means $x > 1$. Domain: $(1, \\infty)$.</div>
</div>

<!-- ============================================================
     SECTION 4 — The Graph
     ============================================================ -->
<h2 class="l-title">4. The Graph of $y = \\log_a x$</h2>

<p class="l-text">The graph of $y = \\log_a x$ is the reflection of $y = a^x$ across the line $y = x$ — that is the geometric meaning of "inverse function." Two cases:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">CASE 1: $a > 1$ (e.g., $\\log_2 x$, $\\log_{10} x$, $\\ln x$)</div>
<div class="compare-item">Strictly <strong>increasing</strong>.</div>
<div class="compare-item">Passes through $(1, 0)$ because $a^0 = 1$.</div>
<div class="compare-item">Passes through $(a, 1)$ because $a^1 = a$.</div>
<div class="compare-item">As $x \\to 0^+$, $y \\to -\\infty$ (vertical asymptote at $x = 0$).</div>
<div class="compare-item">As $x \\to \\infty$, $y \\to \\infty$ — but very slowly.</div>
</div>
<div class="compare-col">
<div class="compare-title">CASE 2: $0 < a < 1$ (e.g., $\\log_{1/2} x$)</div>
<div class="compare-item">Strictly <strong>decreasing</strong>.</div>
<div class="compare-item">Still passes through $(1, 0)$ and $(a, 1)$.</div>
<div class="compare-item">As $x \\to 0^+$, $y \\to +\\infty$.</div>
<div class="compare-item">As $x \\to \\infty$, $y \\to -\\infty$.</div>
<div class="compare-item">Rare in practice; almost all real applications use $a > 1$.</div>
</div>
</div>

<div id="plot-logbases-en" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
  var xs=[]; for(var i=1;i<=600;i++){ xs.push(i/30); }
  var y2 = xs.map(function(x){return Math.log(x)/Math.log(2);});
  var y10 = xs.map(function(x){return Math.log(x)/Math.log(10);});
  var ye = xs.map(function(x){return Math.log(x);});
  var t1={x:xs, y:y2, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:xs, y:ye, mode:"lines", name:"y = ln x (base e)", line:{color:"#06b6d4",width:2.6}};
  var t3={x:xs, y:y10, mode:"lines", name:"y = log₁₀ x", line:{color:"#f87171",width:2.6}};
  var t4={x:[1], y:[0], mode:"markers", name:"(1, 0) common to all", marker:{size:10,color:"#fbbf24",line:{color:"#fff",width:1}}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,20],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-5,5],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-logbases-en",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Three logarithms with different bases. All three pass through $(1, 0)$. The larger the base, the more "flattened" the curve — $\\log_{10}$ grows slowest, $\\log_2$ fastest. All share the same shape: a vertical asymptote at $x=0$, slow growth to the right.</p>

<!-- Reflection plot -->
<div id="plot-reflection-en" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
  var xe=[]; for(var i=-30;i<=30;i++){ xe.push(i/10); }
  var ye = xe.map(function(x){return Math.pow(2,x);});
  var xl=[]; for(var i=1;i<=300;i++){ xl.push(i/30); }
  var yl = xl.map(function(x){return Math.log(x)/Math.log(2);});
  var xline=[]; var yline=[];
  for(var k=-6;k<=10;k++){ xline.push(k); yline.push(k); }
  var t1={x:xe, y:ye, mode:"lines", name:"y = 2ˣ (exponential)", line:{color:"#06b6d4",width:2.6}};
  var t2={x:xl, y:yl, mode:"lines", name:"y = log₂ x (logarithm)", line:{color:"#c8a96e",width:2.6}};
  var t3={x:xline, y:yline, mode:"lines", name:"y = x (mirror)", line:{color:"rgba(255,255,255,0.4)",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[-3,10],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-3,10],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)",scaleanchor:"x",scaleratio:1},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-reflection-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},200)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">The exponential $y = 2^x$ and its inverse $y = \\log_2 x$ are mirror images across the line $y = x$. Every point $(p, q)$ on the exponential corresponds to a point $(q, p)$ on the logarithm. This reflection symmetry is the geometric face of the algebraic identity $\\log_a(a^x) = x$.</p>

<!-- Asymptote / characteristic points plot -->
<div id="plot-loginfo-en" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[]; for(var i=1;i<=600;i++){ xs.push(i/40); }
  var ys = xs.map(function(x){return Math.log(x)/Math.log(2);});
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var asy={x:[0,0], y:[-6,6], mode:"lines", name:"vertical asymptote x=0", line:{color:"#f87171",width:1.5,dash:"dot"}};
  var pts={x:[1,2,4,8,0.5,0.25], y:[0,1,2,3,-1,-2], mode:"markers+text", name:"key points",
           marker:{size:10,color:"#fbbf24",line:{color:"#fff",width:1}},
           text:["(1,0)","(2,1)","(4,2)","(8,3)","(½,-1)","(¼,-2)"],
           textposition:"top center", textfont:{color:"#ebe6dc",size:10}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[-0.5,12],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-4,5],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-loginfo-en",[t1,asy,pts],layout,{responsive:true,displayModeBar:false});
},250)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Key features of $y = \\log_2 x$. Powers of 2 produce integer outputs: $\\log_2 2 = 1$, $\\log_2 4 = 2$, $\\log_2 8 = 3$. Powers of $\\tfrac12$ produce negative integers: $\\log_2 \\tfrac12 = -1$, $\\log_2 \\tfrac14 = -2$. The $y$-axis is a vertical asymptote — the curve hugs it but never touches.</p>

<!-- ============================================================
     SECTION 5 — Product Rule
     ============================================================ -->
<h2 class="l-title">5. The Product Rule: $\\log_a(xy) = \\log_a x + \\log_a y$</h2>

<p class="l-text">This is the rule that made Napier famous: a logarithm of a product equals the sum of the logarithms. We can prove it directly from the corresponding exponential rule $a^p \\cdot a^q = a^{p+q}$.</p>

<div class="calc-formula">
<div class="formula-label">PRODUCT RULE FOR LOGARITHMS</div>
<div class="formula-main">$$\\log_a(x \\cdot y) = \\log_a x + \\log_a y \\quad (x, y > 0)$$</div>
<div class="formula-sub">The log of a product is the sum of the logs. Inverts the exponential rule $a^p \\cdot a^q = a^{p+q}$.</div>
</div>

<div class="l-highlight"><strong>Proof.</strong> Let $p = \\log_a x$ and $q = \\log_a y$. By the definition of the logarithm, $x = a^p$ and $y = a^q$. Multiply:
$$x \\cdot y = a^p \\cdot a^q = a^{p+q}.$$
Now translate the equation $x \\cdot y = a^{p+q}$ back to logarithmic form: $\\log_a(x \\cdot y) = p + q = \\log_a x + \\log_a y$. $\\blacksquare$</div>

<div class="calc-example">
<div class="example-label">WORKED EXAMPLES</div>
<div class="example-body">
<strong>(a)</strong> $\\log_2(8 \\cdot 16) = \\log_2 8 + \\log_2 16 = 3 + 4 = 7$. Check: $8 \\cdot 16 = 128 = 2^7$. ✓<br><br>
<strong>(b)</strong> $\\log_{10}(20 \\cdot 50) = \\log_{10} 20 + \\log_{10} 50 = \\log_{10}(1000) = 3$. We did not need to know each summand separately — knowing they combine to $\\log_{10} 1000$ was enough.<br><br>
<strong>(c)</strong> Expand $\\log_a(7 x y z)$ into a sum:
$$\\log_a(7xyz) = \\log_a 7 + \\log_a x + \\log_a y + \\log_a z.$$
The product rule extends inductively to any finite product.
</div>
</div>

<div class="l-note"><strong>Careful — what the rule does NOT say.</strong> $\\log_a(x + y) \\neq \\log_a x + \\log_a y$ in general. The product rule applies only to <em>products inside the log</em>. There is no comparable simple rule for the log of a sum.</div>

<!-- ============================================================
     SECTION 6 — Quotient Rule
     ============================================================ -->
<h2 class="l-title">6. The Quotient Rule: $\\log_a(x/y) = \\log_a x - \\log_a y$</h2>

<p class="l-text">By the same reasoning as the product rule — division of exponentials subtracts exponents — the logarithm of a quotient is a difference of logarithms.</p>

<div class="calc-formula">
<div class="formula-label">QUOTIENT RULE FOR LOGARITHMS</div>
<div class="formula-main">$$\\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y \\quad (x, y > 0)$$</div>
<div class="formula-sub">The log of a quotient is the difference of the logs. Inverts the rule $a^p / a^q = a^{p-q}$.</div>
</div>

<div class="l-highlight"><strong>Proof.</strong> Let $p = \\log_a x$ and $q = \\log_a y$. Then $x = a^p$ and $y = a^q$, so
$$\\frac{x}{y} = \\frac{a^p}{a^q} = a^{p-q}.$$
Translating back: $\\log_a(x/y) = p - q = \\log_a x - \\log_a y$. $\\blacksquare$</div>

<p class="l-text"><strong>Useful corollary — the reciprocal.</strong> Set $x = 1$ in the quotient rule and recall that $\\log_a 1 = 0$:</p>

$$\\log_a \\!\\left(\\frac{1}{y}\\right) = \\log_a 1 - \\log_a y = -\\log_a y.$$

<div class="calc-example">
<div class="example-label">WORKED EXAMPLES</div>
<div class="example-body">
<strong>(a)</strong> $\\log_3(81/9) = \\log_3 81 - \\log_3 9 = 4 - 2 = 2$. Check: $81/9 = 9 = 3^2$. ✓<br><br>
<strong>(b)</strong> Combine into one logarithm: $\\log_2 60 - \\log_2 5 = \\log_2(60/5) = \\log_2 12$.<br><br>
<strong>(c)</strong> $\\log_a \\tfrac{1}{1000} = -\\log_a 1000$. With $a = 10$ this gives $-3$.<br><br>
<strong>(d)</strong> Expand $\\log_a \\dfrac{xy}{z}$:
$$\\log_a \\frac{xy}{z} = \\log_a(xy) - \\log_a z = \\log_a x + \\log_a y - \\log_a z.$$
</div>
</div>

<!-- ============================================================
     SECTION 7 — Power Rule
     ============================================================ -->
<h2 class="l-title">7. The Power Rule: $\\log_a(x^n) = n \\, \\log_a x$</h2>

<p class="l-text">The third classical rule lets us pull exponents out front. It inverts the exponential identity $(a^p)^n = a^{p n}$ and turns repeated multiplication inside the log into ordinary multiplication outside.</p>

<div class="calc-formula">
<div class="formula-label">POWER RULE FOR LOGARITHMS</div>
<div class="formula-main">$$\\log_a(x^n) = n \\cdot \\log_a x \\quad (x > 0, \\; n \\in \\mathbb{R})$$</div>
<div class="formula-sub">An exponent inside the log comes out as a coefficient. Inverts $(a^p)^n = a^{pn}$.</div>
</div>

<div class="l-highlight"><strong>Proof.</strong> Let $p = \\log_a x$, so $x = a^p$. Then
$$x^n = (a^p)^n = a^{pn}.$$
Translating back: $\\log_a(x^n) = p \\cdot n = n \\log_a x$. $\\blacksquare$</div>

<p class="l-text">The power rule is the most flexible of the three. Because <em>any</em> root is a fractional power and any reciprocal is a negative power, it handles radicals and reciprocals at once:</p>

$$\\log_a \\sqrt{x} = \\log_a x^{1/2} = \\tfrac{1}{2} \\log_a x, \\qquad \\log_a \\sqrt[n]{x} = \\tfrac{1}{n} \\log_a x.$$

$$\\log_a \\!\\left(\\frac{1}{x^k}\\right) = \\log_a x^{-k} = -k \\log_a x.$$

<div class="calc-example">
<div class="example-label">WORKED EXAMPLES</div>
<div class="example-body">
<strong>(a)</strong> $\\log_2(2^{10}) = 10 \\log_2 2 = 10 \\cdot 1 = 10$.<br><br>
<strong>(b)</strong> $\\log_5 25^3 = 3 \\log_5 25 = 3 \\cdot 2 = 6$. (Equivalently, $25^3 = (5^2)^3 = 5^6$.)<br><br>
<strong>(c)</strong> Solve $\\log_3 x = 4$. By definition, $x = 3^4 = 81$.<br><br>
<strong>(d)</strong> Solve $2 \\log_{10} x = 6$. Divide by 2: $\\log_{10} x = 3$, so $x = 10^3 = 1000$. Or push the 2 inside as a power: $\\log_{10} x^2 = 6$, so $x^2 = 10^6 = 10^6$, giving $x = 1000$ (positive root, since logs need $x > 0$).<br><br>
<strong>(e)</strong> Expand $\\log_a \\dfrac{x^3 \\sqrt{y}}{z^2}$:
$$\\log_a \\frac{x^3 \\sqrt{y}}{z^2} = 3 \\log_a x + \\tfrac{1}{2} \\log_a y - 2 \\log_a z.$$
This single line uses the product, quotient, and power rules all at once. It is the kind of manipulation you should be able to do in your head by the end of the chapter.
</div>
</div>

<!-- ============================================================
     SECTION 8 — Inverse Identities
     ============================================================ -->
<h2 class="l-title">8. Inverse-Function Identities</h2>

<p class="l-text">Because $\\log_a$ and $a^{(\\cdot)}$ are inverses of one another, applying one and then the other cancels — like adding and subtracting, or doubling and halving. There are exactly two identities to memorize:</p>

<div class="calc-formula">
<div class="formula-label">INVERSE IDENTITIES</div>
<div class="formula-main">$$a^{\\log_a x} = x \\;\\; (x > 0), \\qquad \\log_a(a^x) = x \\;\\; (x \\in \\mathbb{R}).$$</div>
<div class="formula-sub">"Exp of log" returns the original positive number; "log of exp" returns the original real exponent.</div>
</div>

<p class="l-text"><strong>Why they hold.</strong> Both are immediate from the definition. Set $y = \\log_a x$. By definition this means $a^y = x$. Substitute: $a^{\\log_a x} = a^y = x$. For the other direction, set $z = a^x$. By definition $\\log_a z = x$, i.e., $\\log_a(a^x) = x$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Special values</div><div class="card-body">$\\log_a 1 = 0$ (because $a^0 = 1$) and $\\log_a a = 1$ (because $a^1 = a$). Every logarithm of every base passes through $(1, 0)$ and $(a, 1)$.</div></div>
<div class="calc-card"><div class="card-title">Cancel anywhere</div><div class="card-body">If you see $e^{\\ln 7}$, replace it with $7$ on sight. If you see $\\log_{10}(10^{2.3})$, replace it with $2.3$. The identities collapse compositions instantly.</div></div>
<div class="calc-card"><div class="card-title">Sanity check</div><div class="card-body">If you compute $a^{\\log_a x}$ and get something other than $x$, recheck — you have made an error somewhere. The identity is bulletproof.</div></div>
</div>

<div class="calc-example">
<div class="example-label">QUICK SIMPLIFICATIONS</div>
<div class="example-body">
<strong>(a)</strong> $3^{\\log_3 7} = 7$.<br>
<strong>(b)</strong> $\\log_5(5^{12}) = 12$.<br>
<strong>(c)</strong> $10^{\\log_{10} \\pi} = \\pi$.<br>
<strong>(d)</strong> $\\ln(e^{x+1}) = x + 1$.<br>
<strong>(e)</strong> $e^{2 \\ln x} = e^{\\ln x^2} = x^2$ (combining the power rule and the inverse identity).<br>
<strong>(f)</strong> $2 \\cdot 3^{\\log_3 5} - 5 = 2 \\cdot 5 - 5 = 5$.
</div>
</div>

<!-- ============================================================
     SECTION 9 — Worked Examples Putting It All Together
     ============================================================ -->
<h2 class="l-title">9. Worked Examples — All Rules Together</h2>

<p class="l-text">In real problems you rarely use a single rule in isolation. The art is to combine the product, quotient, power, and inverse identities in the right order, just as algebra problems combine factoring, expanding, and substitution.</p>

<div class="calc-example">
<div class="example-label">EXAMPLE 1 — Condense</div>
<div class="example-body"><strong>Write as a single logarithm:</strong>
$$3 \\log_2 x + \\tfrac{1}{2} \\log_2 y - 2 \\log_2 z.$$
<strong>Solution.</strong> Pull each coefficient inside as an exponent (power rule):
$$\\log_2 x^3 + \\log_2 y^{1/2} - \\log_2 z^2.$$
Now combine the two sums into a product (product rule) and subtract the third as a quotient (quotient rule):
$$\\log_2 \\!\\left(\\frac{x^3 \\sqrt{y}}{z^2}\\right).$$
</div>
</div>

<div class="calc-example">
<div class="example-label">EXAMPLE 2 — Expand</div>
<div class="example-body"><strong>Expand fully:</strong>
$$\\log_{10} \\!\\left(\\frac{100 \\, x^4}{\\sqrt[3]{y^2 z}}\\right).$$
<strong>Solution.</strong> Step by step. First split the quotient:
$$= \\log_{10}(100 x^4) - \\log_{10} \\sqrt[3]{y^2 z}.$$
The first piece splits as a product, and $\\log_{10} 100 = 2$:
$$= 2 + 4 \\log_{10} x - \\log_{10}(y^2 z)^{1/3}.$$
The last piece uses the power and product rules:
$$= 2 + 4 \\log_{10} x - \\tfrac{1}{3}\\bigl(2 \\log_{10} y + \\log_{10} z\\bigr).$$
$$= 2 + 4 \\log_{10} x - \\tfrac{2}{3} \\log_{10} y - \\tfrac{1}{3} \\log_{10} z.$$
</div>
</div>

<div class="calc-example">
<div class="example-label">EXAMPLE 3 — Solve</div>
<div class="example-body"><strong>Solve for $x$:</strong> $\\log_2(x+2) + \\log_2(x-1) = 2.$<br><br>
<strong>Solution.</strong> Combine the left-hand side with the product rule:
$$\\log_2\\bigl[(x+2)(x-1)\\bigr] = 2.$$
Convert to exponential form using the definition:
$$(x+2)(x-1) = 2^2 = 4.$$
Expand: $x^2 + x - 2 = 4$, i.e., $x^2 + x - 6 = 0$. Factor: $(x+3)(x-2) = 0$, giving $x = -3$ or $x = 2$. The candidate $x = -3$ violates the domain (makes $\\log_2(x+2)$ and $\\log_2(x-1)$ negative arguments), so the only solution is $\\boxed{x = 2}$.<br><br>
<strong>Lesson.</strong> Always check candidates against the original domain — logarithmic equations frequently introduce spurious roots.
</div>
</div>

<div class="calc-example">
<div class="example-label">EXAMPLE 4 — Inverse-Identity Trick</div>
<div class="example-body"><strong>Simplify:</strong> $2^{1 + \\log_2 5}$.<br><br>
<strong>Solution.</strong> Split the exponent: $2^{1 + \\log_2 5} = 2^1 \\cdot 2^{\\log_2 5} = 2 \\cdot 5 = 10$.</div>
</div>

<!-- ============================================================
     SECTION 10 — Practice
     ============================================================ -->
<h2 class="l-title">10. Practice Problems</h2>

<p class="l-text">Work through these by hand before checking the answers. Try to do steps mentally where you can. If you get stuck, return to the rule statements above.</p>

<ol style="line-height:1.85;padding-left:1.4rem">
<li>Compute (i) $\\log_3 27$, (ii) $\\log_5 \\tfrac{1}{25}$, (iii) $\\log_2 \\sqrt{32}$, (iv) $\\log_{10} 0.001$.</li>
<li>Convert (i) $\\log_4 64 = 3$ to exponential form, (ii) $7^2 = 49$ to logarithmic form.</li>
<li>Expand $\\log_a \\dfrac{x^2 y^5}{z^3}$ as a sum and difference of basic logarithms.</li>
<li>Combine $4 \\log_a x - 2 \\log_a y + \\tfrac{1}{2} \\log_a z$ into a single logarithm.</li>
<li>Simplify $5^{\\log_5 11 - \\log_5 2}$.</li>
<li>Find the domain of $f(x) = \\log_2(x^2 - 5x + 6)$.</li>
<li>Solve $\\log_3(x+1) + \\log_3(x-1) = \\log_3 8$.</li>
<li>Show that for any $a > 0$ with $a \\neq 1$: $\\log_a(x^2) = 2 \\log_a |x|$, NOT $2 \\log_a x$ in general. Why must we use the absolute value?</li>
</ol>

<h3 style="color:#c8a96e;margin-top:1.5rem">Answers (with brief steps)</h3>

<p class="l-text"><strong>1.</strong> (i) $\\log_3 27 = \\log_3 3^3 = 3$. (ii) $\\log_5 \\tfrac{1}{25} = \\log_5 5^{-2} = -2$. (iii) $\\log_2 \\sqrt{32} = \\tfrac{1}{2} \\log_2 32 = \\tfrac{1}{2} \\cdot 5 = \\tfrac{5}{2}$. (iv) $\\log_{10} 0.001 = \\log_{10} 10^{-3} = -3$.</p>

<p class="l-text"><strong>2.</strong> (i) $4^3 = 64$. (ii) $\\log_7 49 = 2$.</p>

<p class="l-text"><strong>3.</strong> $\\log_a \\dfrac{x^2 y^5}{z^3} = 2 \\log_a x + 5 \\log_a y - 3 \\log_a z$.</p>

<p class="l-text"><strong>4.</strong> Pull coefficients inside as exponents, combine: $\\log_a \\dfrac{x^4 \\sqrt{z}}{y^2}$.</p>

<p class="l-text"><strong>5.</strong> By the quotient rule, $\\log_5 11 - \\log_5 2 = \\log_5 \\tfrac{11}{2}$, so $5^{\\log_5(11/2)} = \\tfrac{11}{2}$.</p>

<p class="l-text"><strong>6.</strong> $x^2 - 5x + 6 = (x-2)(x-3) > 0$ when $x < 2$ or $x > 3$. Domain: $(-\\infty, 2) \\cup (3, \\infty)$.</p>

<p class="l-text"><strong>7.</strong> Combine: $\\log_3(x^2 - 1) = \\log_3 8$, so $x^2 - 1 = 8$, $x^2 = 9$, $x = \\pm 3$. Reject $x = -3$ (domain), so $x = 3$.</p>

<p class="l-text"><strong>8.</strong> $\\log_a(x^2)$ is defined for all $x \\neq 0$, since $x^2 > 0$. But $\\log_a x$ requires $x > 0$. Writing $\\log_a(x^2) = 2 \\log_a x$ would lose the negative-$x$ part of the domain. The correct identity, valid for all $x \\neq 0$, is $\\log_a(x^2) = 2 \\log_a |x|$.</p>

<div class="l-highlight"><strong>Takeaway.</strong> A logarithm is just an exponent in disguise. The product, quotient, and power rules are precisely the exponential rules read backwards. Combined with the two inverse identities $a^{\\log_a x} = x$ and $\\log_a(a^x) = x$, they turn nearly every expression containing logs into something you can simplify by hand. In Lesson 37 we will use these rules to invent the <em>change-of-base formula</em>, the bridge that lets calculators compute $\\log$ for any base using only $\\ln$ and $\\log_{10}$.</div>
`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `
<p class="l-text"><strong>Logaritma, üstelin tersidir.</strong> 35. derste $f(x) = a^x$ üstel fonksiyonunu kurduk ve patlayıcı bir hızla büyüdüğünü gördük — ikiye katlayan, üçe katlayan, sonsuza dek çarpan. Ne var ki pek çok doğal soru ters yöne işler. <em>2'yi kendisiyle kaç kez çarparsam 1024 olur? Yıllık $\\%5$ faizle 1 TL kaç yılda 10 TL'ye çıkar? Sesin basıncı hangi desibel ölçeğinde iki katına ulaşır?</em> Bunların hepsi <strong>ters</strong> sorulardır: üstelin çıktısı verildiğinde girdiyi geri kazandırmak. Logaritma tam da bu işe yarayan araçtır.</p>

<p class="l-text">Bu derste $\\log_a x$'i titizlikle tanımlıyoruz, tanım kümesini, grafiğini ve asimptotik davranışını inceliyoruz, sonra üç klasik "kuralı" — çarpım, bölüm ve kuvvet — onları ters çevirdikleri üstel kurallardan doğrudan türetiyoruz. Ters-fonksiyon özdeşlikleri $a^{\\log_a x} = x$ ve $\\log_a(a^x) = x$ ile bitiriyoruz; ardından parmaklarınızın logaritmaları sıradan cebirsel ifadeler kadar akıcı oynatmasını sağlayacak bir alıştırma bataryası geliyor.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Logaritma denklemi $\\log_a x = y$ ile üstel denklem $a^y = x$ arasında akıcı çeviri yapma.</li>
<li>$\\log_a x$'in doğal tanım kümesinin ($x > 0$) ve değer kümesinin ($y \\in \\mathbb{R}$) <em>neden</em> öyle olduğunu açıklama.</li>
<li>$a > 1$ ve $0 < a < 1$ için $y = \\log_a x$'in grafiğini, $x = 0$'daki düşey asimptotuyla birlikte çizme.</li>
<li>Çarpım, bölüm ve kuvvet kurallarını yansıttıkları üstel kurallardan kanıtlama.</li>
<li>$a^{\\log_a x} = x$ ve $\\log_a(a^x) = x$ ters-fonksiyon özdeşlikleriyle ifadeleri sadeleştirme.</li>
<li>Üç kuralı birlikte kullanarak karmaşık logaritmik ifadeleri yoğunlaştırma veya açma.</li>
</ul>
</div>

<!-- ============================================================
     BÖLÜM 1 — Tarihçe ve Motivasyon
     ============================================================ -->
<h2 class="l-title">1. Kısa Tarih: Logaritma Neden İcat Edildi?</h2>

<p class="l-text">Elektronik hesap makineleri yokken iki büyük sayıyı çarpmak — diyelim $4789{,}31 \\times 6523{,}07$ — acı verici, yavaş ve hata kaldırmaz bir işti. 1614'te İskoç matematikçi <strong>John Napier</strong> <em>Mirifici Logarithmorum Canonis Descriptio</em> ("Logaritmaların Şaşırtıcı Kanonu") başlıklı kitabını yayımladı; kitap her çarpma problemini bir <em>toplama</em> problemine dönüştüren bir cetvel sunuyordu.</p>

<div class="l-highlight"><strong>Napier'ın sezgisi.</strong> Her pozitif $x$ sayısına bir $L(x)$ değeri eşleyen bir cetvelimiz olsun ve bu cetvel $L(x \\cdot y) = L(x) + L(y)$ özelliğini sağlasın. O hâlde $x \\cdot y$'yi çarpmak için $L(x)$ ve $L(y)$'yi arar, toplar ve sonucu cetvelde geriye doğru ararız. Çarpma toplamaya dönüşmüştür.</div>

<p class="l-text">İşte o özel $L$ fonksiyonu, <strong>logaritmadır</strong>. Napier'ın cetvelleri, daha sonra Henry Briggs eliyle 10 tabanına (yaygın logaritma) dönüştürüldü ve 1600'lerden 1970'lere kadar her mühendisin, denizcinin ve gökbilimcinin iş atı oldu. Sürgülü cetvel — iki logaritmik ölçeğin kaydırılmasıyla çalışan — bilim insanlarının üç yüzyıl boyunca saniyeler içinde çarpma yapmasını sağladı. Cep hesap makinesi cetvelleri tarihe gömdü, ama cetvelin tablo hâline getirdiği $\\log$ fonksiyonu matematiğin kalbinde kaldı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1614</div><div class="card-body">John Napier ilk logaritma cetvelini yayımlar. El hesabı bir gecede hızlanır.</div></div>
<div class="calc-card"><div class="card-title">1617</div><div class="card-body">Henry Briggs, ondalık aritmetiğe uyarlı 10 tabanlı logaritma $\\log_{10}$'u tanımlar.</div></div>
<div class="calc-card"><div class="card-title">1622</div><div class="card-body">William Oughtred mekanik bir logaritma "hesap makinesi" olan sürgülü cetveli icat eder. 1970'lere kadar kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Günümüz</div><div class="card-body">Logaritma; pH'ı, desibeli, Richter ölçeğini, entropi ve karmaşıklığı, hatta neredeyse her "büyüklük mertebesi" anlamı taşıyan ölçeği betimler.</div></div>
</div>

<p class="l-text">Bugün çarpma için logaritmaya ihtiyacımız olmasa da fonksiyonun kendisi, miktarın en iyi <em>büyüklük mertebeleriyle</em> ölçüldüğü her yerde karşımıza çıkar: pH hidrojen iyonu derişimini logaritmik ölçer, desibel ses şiddetini logaritmik ölçer, Richter ölçeği deprem enerjisini logaritmik ölçer ve insan gözü ile kulağı ışık ile sesi logaritmik algılar (Weber–Fechner yasası).</p>

<!-- ============================================================
     BÖLÜM 2 — Tanım
     ============================================================ -->
<h2 class="l-title">2. Tanım: Üstelin Tersi Olarak Logaritma</h2>

<p class="l-text">35. derste sabit bir $a > 0$, $a \\neq 1$ tabanı için</p>

$$f(x) = a^x$$

<p class="l-text">üstel fonksiyonunun kesin monoton olduğunu ($a > 1$ ise artan, $0 < a < 1$ ise azalan) ve her pozitif değeri tam bir kez aldığını gördük. Kesin monoton bir fonksiyonun bir <strong>tersi</strong> vardır. Bu tersi adlandırıyoruz.</p>

<div class="calc-formula">
<div class="formula-label">LOGARİTMA TANIMI</div>
<div class="formula-main">$$\\log_a x = y \\quad \\Longleftrightarrow \\quad a^y = x$$</div>
<div class="formula-sub">"$\\log_a x$" "$a$ tabanında $x$'in logaritması" okunur. $x$'i elde etmek için $a$'yı hangi kuvvete yükseltmemiz gerektiğini gösterir.</div>
</div>

<p class="l-text"><strong>Sözlü okuyalım.</strong> $\\log_a x$ sayısının kendisi <em>bir üsdür</em>. $a$ tabanına uygulandığında $x$ üreten tek üstür. Logaritma ile üstel aynı madalyonun iki yüzüdür: üstel bir üs alır ve değer üretir; logaritma bir değer alır ve üssü geri çıkarır.</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">ÜSTEL HÂL</div>
<div class="compare-item">$2^3 = 8$</div>
<div class="compare-item">$10^4 = 10000$</div>
<div class="compare-item">$5^0 = 1$</div>
<div class="compare-item">$a^1 = a$</div>
</div>
<div class="compare-col">
<div class="compare-title">LOGARİTMİK HÂL</div>
<div class="compare-item">$\\log_2 8 = 3$</div>
<div class="compare-item">$\\log_{10} 10000 = 4$</div>
<div class="compare-item">$\\log_5 1 = 0$</div>
<div class="compare-item">$\\log_a a = 1$</div>
</div>
</div>

<div class="calc-example">
<div class="example-label">İŞLENMİŞ ÖRNEK — ÇEVİRİ ALIŞTIRMASI</div>
<div class="example-body"><strong>Aşağıdakilerin her birini karşı hâle çevir.</strong><br><br>
(a) $3^4 = 81 \\;\\Longleftrightarrow\\; \\log_3 81 = 4$.<br>
(b) $\\log_{10} 1000 = 3 \\;\\Longleftrightarrow\\; 10^3 = 1000$.<br>
(c) $\\log_2 \\tfrac{1}{8} = -3 \\;\\Longleftrightarrow\\; 2^{-3} = \\tfrac{1}{8}$.<br>
(d) $\\log_a 1 = 0 \\;\\Longleftrightarrow\\; a^0 = 1$ (izin verilen herhangi bir taban).</div>
</div>

<p class="l-text"><strong>Yazım kısaltmaları.</strong> Üç özel tabanın kendi gösterimi vardır:</p>

<ul style="line-height:1.7;padding-left:1.5rem">
<li><strong>$\\log_{10} x$</strong> (on tabanı) çoğu kez yalnızca $\\log x$ ya da $\\lg x$ diye yazılır. Buna <em>yaygın</em> logaritma denir; pH, desibel gibi yerlerde kullanılır.</li>
<li><strong>$\\log_e x$</strong> ($e \\approx 2{,}71828$ tabanı) $\\ln x$ diye yazılır ve <em>doğal</em> logaritma olarak adlandırılır. $e$ ile tam anlamıyla 38. derste tanışacağız; şimdilik analizdeki doğal taban olduğunu bilmek yeter.</li>
<li><strong>$\\log_2 x$</strong> (iki tabanı) bilgisayar biliminde (bit cinsinden bilgi) karşımıza çıkar ve bazen $\\operatorname{lb} x$ olarak yazılır.</li>
</ul>

<div class="l-note"><strong>İzin verilen tabanlar.</strong> $a > 0$ ve $a \\neq 1$ koşullarını isteriz. Eğer $a \\le 0$ ise $a^x$ tüm reel $x$'ler için tanımlı olmaz (örneğin negatif sayının reel karekökü yok), $a = 1$ ise $a^x \\equiv 1$ sabittir ve tersi olmaz.</div>

<!-- ============================================================
     BÖLÜM 3 — Tanım ve Değer Kümesi
     ============================================================ -->
<h2 class="l-title">3. Tanım ve Değer Kümesi</h2>

<p class="l-text">$\\log_a x$, $a^x$'i tersine çevirdiğinden, <strong>tanım kümesi</strong> $a^x$'in değer kümesine; <strong>değer kümesi</strong> ise $a^x$'in tanım kümesine eşittir.</p>

<div class="calc-formula">
<div class="formula-label">$\\log_a$'NIN TANIM VE DEĞER KÜMESİ</div>
<div class="formula-main">$$\\text{Tan}(\\log_a) = (0, \\infty), \\qquad \\text{Değ}(\\log_a) = (-\\infty, \\infty) = \\mathbb{R}.$$</div>
<div class="formula-sub">Girdi $x$ kesinlikle pozitif olmak zorundadır; çıktı $y$ ise her reel değer olabilir.</div>
</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$x > 0$</div><div class="card-body">$a^y$ daima pozitiftir (hiçbir reel üs pozitif bir tabanı sıfıra ya da negatife indiremez), o yüzden $a^y = x$ denkleminin çözümü <em>yalnızca</em> $x > 0$ için vardır. Dolayısıyla pozitif olmayan bir sayının $\\log_a$'sı yoktur.</div></div>
<div class="calc-card"><div class="card-title">$y \\in \\mathbb{R}$</div><div class="card-body">Her reel sayı bir üs olarak görev yapabilir. Pozitif $y$ değerleri $x > 1$ verir; $y = 0$ ise $x = 1$; negatif $y$ ise $0 < x < 1$.</div></div>
<div class="calc-card"><div class="card-title">$\\log_a 0$</div><div class="card-body">Tanımsızdır. $a^y = 0$ denkleminin çözümü yoktur, çünkü her reel $y$ için $a^y > 0$'dır.</div></div>
<div class="calc-card"><div class="card-title">$\\log_a(-3)$</div><div class="card-body">Reel sayılarda tanımsız. $a^y = -3$ denkleminin reel çözümü yoktur. (Karmaşık logaritmalar var ama lise sonrasıdır.)</div></div>
</div>

<div class="calc-example">
<div class="example-label">TANIM KÜMESİ PROBLEMLERİ</div>
<div class="example-body"><strong>Her fonksiyonun tanım kümesini bul.</strong><br><br>
(a) $f(x) = \\log_2(x - 5)$. $x - 5 > 0$, yani $x > 5$ olmalı. Tanım kümesi: $(5, \\infty)$.<br><br>
(b) $g(x) = \\log_3(9 - x^2)$. $9 - x^2 > 0$, yani $x^2 < 9$, yani $-3 < x < 3$ olmalı. Tanım kümesi: $(-3, 3)$.<br><br>
(c) $h(x) = \\log_{10}\\bigl(\\log_2 x\\bigr)$. Dış log $\\log_2 x > 0$ ister; bu da $x > 1$ demektir. Tanım kümesi: $(1, \\infty)$.</div>
</div>

<!-- ============================================================
     BÖLÜM 4 — Grafik
     ============================================================ -->
<h2 class="l-title">4. $y = \\log_a x$'in Grafiği</h2>

<p class="l-text">$y = \\log_a x$ grafiği, $y = a^x$ grafiğinin $y = x$ doğrusu boyunca yansımasıdır — "ters fonksiyon"un geometrik anlamı budur. İki durum:</p>

<div class="calc-compare">
<div class="compare-col">
<div class="compare-title">DURUM 1: $a > 1$ (örn. $\\log_2 x$, $\\log_{10} x$, $\\ln x$)</div>
<div class="compare-item">Kesin <strong>artan</strong>.</div>
<div class="compare-item">$(1, 0)$ noktasından geçer, çünkü $a^0 = 1$.</div>
<div class="compare-item">$(a, 1)$ noktasından geçer, çünkü $a^1 = a$.</div>
<div class="compare-item">$x \\to 0^+$ iken $y \\to -\\infty$ (düşey asimptot $x = 0$).</div>
<div class="compare-item">$x \\to \\infty$ iken $y \\to \\infty$ — ama çok yavaş.</div>
</div>
<div class="compare-col">
<div class="compare-title">DURUM 2: $0 < a < 1$ (örn. $\\log_{1/2} x$)</div>
<div class="compare-item">Kesin <strong>azalan</strong>.</div>
<div class="compare-item">Yine $(1, 0)$ ve $(a, 1)$ noktalarından geçer.</div>
<div class="compare-item">$x \\to 0^+$ iken $y \\to +\\infty$.</div>
<div class="compare-item">$x \\to \\infty$ iken $y \\to -\\infty$.</div>
<div class="compare-item">Pratikte nadir; gerçek uygulamaların neredeyse tamamı $a > 1$ kullanır.</div>
</div>
</div>

<div id="plot-logbases-tr" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
  var xs=[]; for(var i=1;i<=600;i++){ xs.push(i/30); }
  var y2 = xs.map(function(x){return Math.log(x)/Math.log(2);});
  var y10 = xs.map(function(x){return Math.log(x)/Math.log(10);});
  var ye = xs.map(function(x){return Math.log(x);});
  var t1={x:xs, y:y2, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var t2={x:xs, y:ye, mode:"lines", name:"y = ln x (taban e)", line:{color:"#06b6d4",width:2.6}};
  var t3={x:xs, y:y10, mode:"lines", name:"y = log₁₀ x", line:{color:"#f87171",width:2.6}};
  var t4={x:[1], y:[0], mode:"markers", name:"(1, 0) hepsinde ortak", marker:{size:10,color:"#fbbf24",line:{color:"#fff",width:1}}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[0,20],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-5,5],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-logbases-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
},150)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Üç farklı tabanlı logaritma. Üçü de $(1, 0)$ noktasından geçer. Taban büyüdükçe eğri daha "yatık" görünür — en yavaş büyüyen $\\log_{10}$, en hızlı büyüyen $\\log_2$'dir. Hepsi aynı şekli paylaşır: $x = 0$'da düşey asimptot, sağa doğru yavaş büyüme.</p>

<div id="plot-reflection-tr" class="plotly-graph" style="height:400px"></div>
<script>setTimeout(function(){
  var xe=[]; for(var i=-30;i<=30;i++){ xe.push(i/10); }
  var ye = xe.map(function(x){return Math.pow(2,x);});
  var xl=[]; for(var i=1;i<=300;i++){ xl.push(i/30); }
  var yl = xl.map(function(x){return Math.log(x)/Math.log(2);});
  var xline=[]; var yline=[];
  for(var k=-6;k<=10;k++){ xline.push(k); yline.push(k); }
  var t1={x:xe, y:ye, mode:"lines", name:"y = 2ˣ (üstel)", line:{color:"#06b6d4",width:2.6}};
  var t2={x:xl, y:yl, mode:"lines", name:"y = log₂ x (logaritma)", line:{color:"#c8a96e",width:2.6}};
  var t3={x:xline, y:yline, mode:"lines", name:"y = x (ayna)", line:{color:"rgba(255,255,255,0.4)",width:1.5,dash:"dash"}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[-3,10],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-3,10],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)",scaleanchor:"x",scaleratio:1},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-reflection-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
},200)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">Üstel $y = 2^x$ ile tersi $y = \\log_2 x$, $y = x$ doğrusu boyunca birbirinin aynası gibidir. Üstel üzerindeki her $(p, q)$ noktasına logaritma üzerindeki bir $(q, p)$ noktası karşılık gelir. Bu yansıma simetrisi, $\\log_a(a^x) = x$ cebirsel özdeşliğinin geometrik yüzüdür.</p>

<div id="plot-loginfo-tr" class="plotly-graph" style="height:380px"></div>
<script>setTimeout(function(){
  var xs=[]; for(var i=1;i<=600;i++){ xs.push(i/40); }
  var ys = xs.map(function(x){return Math.log(x)/Math.log(2);});
  var t1={x:xs, y:ys, mode:"lines", name:"y = log₂ x", line:{color:"#c8a96e",width:2.6}};
  var asy={x:[0,0], y:[-6,6], mode:"lines", name:"düşey asimptot x=0", line:{color:"#f87171",width:1.5,dash:"dot"}};
  var pts={x:[1,2,4,8,0.5,0.25], y:[0,1,2,3,-1,-2], mode:"markers+text", name:"anahtar noktalar",
           marker:{size:10,color:"#fbbf24",line:{color:"#fff",width:1}},
           text:["(1,0)","(2,1)","(4,2)","(8,3)","(½,-1)","(¼,-2)"],
           textposition:"top center", textfont:{color:"#ebe6dc",size:10}};
  var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{title:"x",range:[-0.5,12],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},yaxis:{title:"y",range:[-4,5],zeroline:true,zerolinecolor:"rgba(255,255,255,0.2)",gridcolor:"rgba(255,255,255,0.05)"},margin:{t:30,r:20,b:60,l:60},showlegend:true,legend:{font:{color:"#ebe6dc",size:11},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};
  Plotly.newPlot("plot-loginfo-tr",[t1,asy,pts],layout,{responsive:true,displayModeBar:false});
},250)</script>

<p class="l-text" style="text-align:center;font-style:italic;color:rgba(235,230,220,0.7)">$y = \\log_2 x$'in temel özellikleri. 2'nin tam kuvvetleri tamsayı çıktı verir: $\\log_2 2 = 1$, $\\log_2 4 = 2$, $\\log_2 8 = 3$. $\\tfrac12$'nin tam kuvvetleri ise negatif tamsayı verir: $\\log_2 \\tfrac12 = -1$, $\\log_2 \\tfrac14 = -2$. $y$ ekseni düşey asimptottur — eğri eksene yakınsar ama asla dokunmaz.</p>

<!-- ============================================================
     BÖLÜM 5 — Çarpım Kuralı
     ============================================================ -->
<h2 class="l-title">5. Çarpım Kuralı: $\\log_a(xy) = \\log_a x + \\log_a y$</h2>

<p class="l-text">Napier'ı ünlü yapan kural budur: çarpımın logaritması, logaritmaların toplamına eşittir. Karşılık gelen üstel kural olan $a^p \\cdot a^q = a^{p+q}$'dan doğrudan kanıtlayabiliriz.</p>

<div class="calc-formula">
<div class="formula-label">LOGARİTMA İÇİN ÇARPIM KURALI</div>
<div class="formula-main">$$\\log_a(x \\cdot y) = \\log_a x + \\log_a y \\quad (x, y > 0)$$</div>
<div class="formula-sub">Çarpımın logaritması, logaritmaların toplamıdır. $a^p \\cdot a^q = a^{p+q}$ üstel kuralının tersidir.</div>
</div>

<div class="l-highlight"><strong>Kanıt.</strong> $p = \\log_a x$ ve $q = \\log_a y$ olsun. Logaritma tanımına göre $x = a^p$ ve $y = a^q$. Çarpalım:
$$x \\cdot y = a^p \\cdot a^q = a^{p+q}.$$
Şimdi $x \\cdot y = a^{p+q}$ denklemini logaritmik hâle çevirelim: $\\log_a(x \\cdot y) = p + q = \\log_a x + \\log_a y$. $\\blacksquare$</div>

<div class="calc-example">
<div class="example-label">İŞLENMİŞ ÖRNEKLER</div>
<div class="example-body">
<strong>(a)</strong> $\\log_2(8 \\cdot 16) = \\log_2 8 + \\log_2 16 = 3 + 4 = 7$. Kontrol: $8 \\cdot 16 = 128 = 2^7$. ✓<br><br>
<strong>(b)</strong> $\\log_{10}(20 \\cdot 50) = \\log_{10} 20 + \\log_{10} 50 = \\log_{10}(1000) = 3$. Her terimi ayrı ayrı bilmek zorunda değildik — birleşince $\\log_{10} 1000$ olmaları yeterliydi.<br><br>
<strong>(c)</strong> $\\log_a(7 x y z)$'yi toplam hâline aç:
$$\\log_a(7xyz) = \\log_a 7 + \\log_a x + \\log_a y + \\log_a z.$$
Çarpım kuralı tümevarımla herhangi sonlu bir çarpıma genişler.
</div>
</div>

<div class="l-note"><strong>Dikkat — kuralın söylemediği şey.</strong> Genel olarak $\\log_a(x + y) \\neq \\log_a x + \\log_a y$. Çarpım kuralı yalnızca <em>logun içindeki çarpımlara</em> uygulanır. Toplamın logu için benzer bir basit kural yoktur.</div>

<!-- ============================================================
     BÖLÜM 6 — Bölüm Kuralı
     ============================================================ -->
<h2 class="l-title">6. Bölüm Kuralı: $\\log_a(x/y) = \\log_a x - \\log_a y$</h2>

<p class="l-text">Çarpım kuralındaki mantığın aynısıyla — üstellerin bölünmesi üsleri çıkarır — bir bölümün logaritması, logaritmaların farkıdır.</p>

<div class="calc-formula">
<div class="formula-label">LOGARİTMA İÇİN BÖLÜM KURALI</div>
<div class="formula-main">$$\\log_a\\!\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y \\quad (x, y > 0)$$</div>
<div class="formula-sub">Bölümün logaritması, logaritmaların farkıdır. $a^p / a^q = a^{p-q}$ kuralının tersidir.</div>
</div>

<div class="l-highlight"><strong>Kanıt.</strong> $p = \\log_a x$, $q = \\log_a y$ olsun. O zaman $x = a^p$ ve $y = a^q$, dolayısıyla
$$\\frac{x}{y} = \\frac{a^p}{a^q} = a^{p-q}.$$
Geri çeviri: $\\log_a(x/y) = p - q = \\log_a x - \\log_a y$. $\\blacksquare$</div>

<p class="l-text"><strong>Yararlı sonuç — çarpmaya tersi.</strong> Bölüm kuralında $x = 1$ alıp $\\log_a 1 = 0$'ı hatırlayalım:</p>

$$\\log_a \\!\\left(\\frac{1}{y}\\right) = \\log_a 1 - \\log_a y = -\\log_a y.$$

<div class="calc-example">
<div class="example-label">İŞLENMİŞ ÖRNEKLER</div>
<div class="example-body">
<strong>(a)</strong> $\\log_3(81/9) = \\log_3 81 - \\log_3 9 = 4 - 2 = 2$. Kontrol: $81/9 = 9 = 3^2$. ✓<br><br>
<strong>(b)</strong> Tek bir logaritma hâlinde topla: $\\log_2 60 - \\log_2 5 = \\log_2(60/5) = \\log_2 12$.<br><br>
<strong>(c)</strong> $\\log_a \\tfrac{1}{1000} = -\\log_a 1000$. $a = 10$ ile bu $-3$ verir.<br><br>
<strong>(d)</strong> $\\log_a \\dfrac{xy}{z}$'yi aç:
$$\\log_a \\frac{xy}{z} = \\log_a(xy) - \\log_a z = \\log_a x + \\log_a y - \\log_a z.$$
</div>
</div>

<!-- ============================================================
     BÖLÜM 7 — Kuvvet Kuralı
     ============================================================ -->
<h2 class="l-title">7. Kuvvet Kuralı: $\\log_a(x^n) = n \\, \\log_a x$</h2>

<p class="l-text">Üçüncü klasik kural, üsleri logun önüne çekmemizi sağlar. $(a^p)^n = a^{p n}$ üstel özdeşliğini tersine çevirir ve logun içindeki tekrarlı çarpmayı, logun dışındaki sıradan çarpmaya dönüştürür.</p>

<div class="calc-formula">
<div class="formula-label">LOGARİTMA İÇİN KUVVET KURALI</div>
<div class="formula-main">$$\\log_a(x^n) = n \\cdot \\log_a x \\quad (x > 0, \\; n \\in \\mathbb{R})$$</div>
<div class="formula-sub">Logun içindeki üs, katsayı olarak öne çıkar. $(a^p)^n = a^{pn}$'in tersidir.</div>
</div>

<div class="l-highlight"><strong>Kanıt.</strong> $p = \\log_a x$ olsun, yani $x = a^p$. O zaman
$$x^n = (a^p)^n = a^{pn}.$$
Geri çeviri: $\\log_a(x^n) = p \\cdot n = n \\log_a x$. $\\blacksquare$</div>

<p class="l-text">Üç kuralın en esnegi kuvvet kuralıdır. <em>Her</em> kök bir kesirli üs ve her tersi alma negatif üs olduğundan, kural kökleri ve tersleri tek başına halleder:</p>

$$\\log_a \\sqrt{x} = \\log_a x^{1/2} = \\tfrac{1}{2} \\log_a x, \\qquad \\log_a \\sqrt[n]{x} = \\tfrac{1}{n} \\log_a x.$$

$$\\log_a \\!\\left(\\frac{1}{x^k}\\right) = \\log_a x^{-k} = -k \\log_a x.$$

<div class="calc-example">
<div class="example-label">İŞLENMİŞ ÖRNEKLER</div>
<div class="example-body">
<strong>(a)</strong> $\\log_2(2^{10}) = 10 \\log_2 2 = 10 \\cdot 1 = 10$.<br><br>
<strong>(b)</strong> $\\log_5 25^3 = 3 \\log_5 25 = 3 \\cdot 2 = 6$. (Eşdeğer olarak, $25^3 = (5^2)^3 = 5^6$.)<br><br>
<strong>(c)</strong> $\\log_3 x = 4$ denklemini çöz. Tanımdan, $x = 3^4 = 81$.<br><br>
<strong>(d)</strong> $2 \\log_{10} x = 6$ denklemini çöz. 2'ye böl: $\\log_{10} x = 3$, yani $x = 10^3 = 1000$. Ya da 2'yi içeri kuvvet olarak ittir: $\\log_{10} x^2 = 6$, dolayısıyla $x^2 = 10^6$, yani $x = 1000$ (pozitif kök, çünkü loglar $x > 0$ ister).<br><br>
<strong>(e)</strong> $\\log_a \\dfrac{x^3 \\sqrt{y}}{z^2}$'yi aç:
$$\\log_a \\frac{x^3 \\sqrt{y}}{z^2} = 3 \\log_a x + \\tfrac{1}{2} \\log_a y - 2 \\log_a z.$$
Bu tek satır çarpım, bölüm ve kuvvet kurallarını aynı anda kullanır. Bölümün sonunda zihinden yapabilmen gereken türden bir oynatmadır.
</div>
</div>

<!-- ============================================================
     BÖLÜM 8 — Ters Fonksiyon Özdeşlikleri
     ============================================================ -->
<h2 class="l-title">8. Ters-Fonksiyon Özdeşlikleri</h2>

<p class="l-text">$\\log_a$ ile $a^{(\\cdot)}$ birbirinin tersi olduğundan, birini sonra diğerini uygulamak birbirini götürür — toplama ile çıkarma, ikiye katlama ile yarılama gibi. Ezberlenecek tam iki özdeşlik vardır:</p>

<div class="calc-formula">
<div class="formula-label">TERS ÖZDEŞLİKLER</div>
<div class="formula-main">$$a^{\\log_a x} = x \\;\\; (x > 0), \\qquad \\log_a(a^x) = x \\;\\; (x \\in \\mathbb{R}).$$</div>
<div class="formula-sub">"Logun üsteli" özgün pozitif sayıyı geri verir; "üstelin logu" özgün reel üssü geri verir.</div>
</div>

<p class="l-text"><strong>Neden doğrudur.</strong> İkisi de tanımdan hemen çıkar. $y = \\log_a x$ alalım. Tanım gereği $a^y = x$. Yerine koy: $a^{\\log_a x} = a^y = x$. Diğer yön için $z = a^x$ alalım. Tanım gereği $\\log_a z = x$, yani $\\log_a(a^x) = x$.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Özel değerler</div><div class="card-body">$\\log_a 1 = 0$ ($a^0 = 1$ olduğu için) ve $\\log_a a = 1$ ($a^1 = a$ olduğu için). Her tabanlı her logaritma $(1, 0)$ ve $(a, 1)$ noktalarından geçer.</div></div>
<div class="calc-card"><div class="card-title">Her yerde götür</div><div class="card-body">$e^{\\ln 7}$ gördüğünde anında $7$ yaz. $\\log_{10}(10^{2{,}3})$ gördüğünde anında $2{,}3$ yaz. Özdeşlikler bileşimleri anında çökertir.</div></div>
<div class="calc-card"><div class="card-title">Aklın kontrolü</div><div class="card-body">$a^{\\log_a x}$ hesaplayıp $x$'ten başka bir şey çıkarsa, bir yerde hata yaptın demektir. Özdeşlik kurşun geçirmezdir.</div></div>
</div>

<div class="calc-example">
<div class="example-label">HIZLI SADELEŞTİRMELER</div>
<div class="example-body">
<strong>(a)</strong> $3^{\\log_3 7} = 7$.<br>
<strong>(b)</strong> $\\log_5(5^{12}) = 12$.<br>
<strong>(c)</strong> $10^{\\log_{10} \\pi} = \\pi$.<br>
<strong>(d)</strong> $\\ln(e^{x+1}) = x + 1$.<br>
<strong>(e)</strong> $e^{2 \\ln x} = e^{\\ln x^2} = x^2$ (kuvvet kuralı ile ters özdeşliği birlikte).<br>
<strong>(f)</strong> $2 \\cdot 3^{\\log_3 5} - 5 = 2 \\cdot 5 - 5 = 5$.
</div>
</div>

<!-- ============================================================
     BÖLÜM 9 — Hepsini Birden Kullanan Örnekler
     ============================================================ -->
<h2 class="l-title">9. İşlenmiş Örnekler — Tüm Kurallar Birlikte</h2>

<p class="l-text">Gerçek problemlerde nadiren tek bir kural başlı başına kullanılır. Sanat; çarpım, bölüm, kuvvet ve ters özdeşlikleri doğru sırayla birleştirmektir — tıpkı cebir problemlerinin çarpanlara ayırma, açma ve yerine koymayı birleştirmesi gibi.</p>

<div class="calc-example">
<div class="example-label">ÖRNEK 1 — Yoğunlaştır</div>
<div class="example-body"><strong>Tek bir logaritma olarak yaz:</strong>
$$3 \\log_2 x + \\tfrac{1}{2} \\log_2 y - 2 \\log_2 z.$$
<strong>Çözüm.</strong> Her katsayıyı üs olarak içeri çek (kuvvet kuralı):
$$\\log_2 x^3 + \\log_2 y^{1/2} - \\log_2 z^2.$$
Şimdi ilk iki toplamı çarpıma çevir (çarpım kuralı) ve üçüncüyü bölüm olarak çıkar (bölüm kuralı):
$$\\log_2 \\!\\left(\\frac{x^3 \\sqrt{y}}{z^2}\\right).$$
</div>
</div>

<div class="calc-example">
<div class="example-label">ÖRNEK 2 — Aç</div>
<div class="example-body"><strong>Tamamen aç:</strong>
$$\\log_{10} \\!\\left(\\frac{100 \\, x^4}{\\sqrt[3]{y^2 z}}\\right).$$
<strong>Çözüm.</strong> Adım adım. Önce bölümü ayır:
$$= \\log_{10}(100 x^4) - \\log_{10} \\sqrt[3]{y^2 z}.$$
İlk parça çarpım olarak ayrılır, $\\log_{10} 100 = 2$:
$$= 2 + 4 \\log_{10} x - \\log_{10}(y^2 z)^{1/3}.$$
Son parça için kuvvet ve çarpım kurallarını kullan:
$$= 2 + 4 \\log_{10} x - \\tfrac{1}{3}\\bigl(2 \\log_{10} y + \\log_{10} z\\bigr).$$
$$= 2 + 4 \\log_{10} x - \\tfrac{2}{3} \\log_{10} y - \\tfrac{1}{3} \\log_{10} z.$$
</div>
</div>

<div class="calc-example">
<div class="example-label">ÖRNEK 3 — Çöz</div>
<div class="example-body"><strong>$x$'i bul:</strong> $\\log_2(x+2) + \\log_2(x-1) = 2.$<br><br>
<strong>Çözüm.</strong> Çarpım kuralıyla sol tarafı birleştir:
$$\\log_2\\bigl[(x+2)(x-1)\\bigr] = 2.$$
Tanımla üstel hâle dönüştür:
$$(x+2)(x-1) = 2^2 = 4.$$
Aç: $x^2 + x - 2 = 4$, yani $x^2 + x - 6 = 0$. Çarpanlara ayır: $(x+3)(x-2) = 0$, çözümler $x = -3$ veya $x = 2$. Aday $x = -3$ tanım kümesini ihlal eder ($\\log_2(x+2)$ ve $\\log_2(x-1)$ argümanlarını pozitif olmayan yapar), dolayısıyla tek çözüm $\\boxed{x = 2}$.<br><br>
<strong>Çıkarım.</strong> Adayları her zaman özgün tanım kümesine karşı sına — logaritmik denklemler sıkça hayalet kök üretir.
</div>
</div>

<div class="calc-example">
<div class="example-label">ÖRNEK 4 — Ters Özdeşlik Hilesi</div>
<div class="example-body"><strong>Sadeleştir:</strong> $2^{1 + \\log_2 5}$.<br><br>
<strong>Çözüm.</strong> Üssü ayır: $2^{1 + \\log_2 5} = 2^1 \\cdot 2^{\\log_2 5} = 2 \\cdot 5 = 10$.</div>
</div>

<!-- ============================================================
     BÖLÜM 10 — Klasik Alıştırmalar
     ============================================================ -->
<h2 class="l-title">10. Klasik Alıştırmalar</h2>

<p class="l-text">Cevaplara bakmadan önce elinle çalış. Yapabildiğin adımları zihinden yap. Takıldığında yukarıdaki kural ifadelerine geri dön.</p>

<ol style="line-height:1.85;padding-left:1.4rem">
<li>Hesapla: (i) $\\log_3 27$, (ii) $\\log_5 \\tfrac{1}{25}$, (iii) $\\log_2 \\sqrt{32}$, (iv) $\\log_{10} 0{,}001$.</li>
<li>Dönüştür: (i) $\\log_4 64 = 3$'ü üstel hâle, (ii) $7^2 = 49$'u logaritmik hâle.</li>
<li>$\\log_a \\dfrac{x^2 y^5}{z^3}$'ü temel logaritmaların toplam ve farkı olarak aç.</li>
<li>$4 \\log_a x - 2 \\log_a y + \\tfrac{1}{2} \\log_a z$'yi tek bir logaritma hâlinde topla.</li>
<li>$5^{\\log_5 11 - \\log_5 2}$'yi sadeleştir.</li>
<li>$f(x) = \\log_2(x^2 - 5x + 6)$ fonksiyonunun tanım kümesini bul.</li>
<li>$\\log_3(x+1) + \\log_3(x-1) = \\log_3 8$ denklemini çöz.</li>
<li>Her $a > 0$, $a \\neq 1$ için $\\log_a(x^2) = 2 \\log_a |x|$ olduğunu — genel olarak $2 \\log_a x$ <em>olmadığını</em> — göster. Mutlak değer neden gerekli?</li>
</ol>

<h3 style="color:#c8a96e;margin-top:1.5rem">Cevaplar (kısa adımlarla)</h3>

<p class="l-text"><strong>1.</strong> (i) $\\log_3 27 = \\log_3 3^3 = 3$. (ii) $\\log_5 \\tfrac{1}{25} = \\log_5 5^{-2} = -2$. (iii) $\\log_2 \\sqrt{32} = \\tfrac{1}{2} \\log_2 32 = \\tfrac{1}{2} \\cdot 5 = \\tfrac{5}{2}$. (iv) $\\log_{10} 0{,}001 = \\log_{10} 10^{-3} = -3$.</p>

<p class="l-text"><strong>2.</strong> (i) $4^3 = 64$. (ii) $\\log_7 49 = 2$.</p>

<p class="l-text"><strong>3.</strong> $\\log_a \\dfrac{x^2 y^5}{z^3} = 2 \\log_a x + 5 \\log_a y - 3 \\log_a z$.</p>

<p class="l-text"><strong>4.</strong> Katsayıları üs olarak içeri çek, sonra birleştir: $\\log_a \\dfrac{x^4 \\sqrt{z}}{y^2}$.</p>

<p class="l-text"><strong>5.</strong> Bölüm kuralına göre $\\log_5 11 - \\log_5 2 = \\log_5 \\tfrac{11}{2}$, dolayısıyla $5^{\\log_5(11/2)} = \\tfrac{11}{2}$.</p>

<p class="l-text"><strong>6.</strong> $x^2 - 5x + 6 = (x-2)(x-3) > 0$ koşulu $x < 2$ veya $x > 3$ ile sağlanır. Tanım kümesi: $(-\\infty, 2) \\cup (3, \\infty)$.</p>

<p class="l-text"><strong>7.</strong> Birleştir: $\\log_3(x^2 - 1) = \\log_3 8$, dolayısıyla $x^2 - 1 = 8$, $x^2 = 9$, $x = \\pm 3$. $x = -3$ tanım kümesini ihlal eder, çözüm $x = 3$.</p>

<p class="l-text"><strong>8.</strong> $\\log_a(x^2)$ her $x \\neq 0$ için tanımlıdır, çünkü $x^2 > 0$. Oysa $\\log_a x$, $x > 0$ ister. $\\log_a(x^2) = 2 \\log_a x$ yazmak negatif-$x$ kısmını tanım kümesinden düşürür. Her $x \\neq 0$ için doğru olan özdeşlik $\\log_a(x^2) = 2 \\log_a |x|$'dir.</p>

<div class="l-highlight"><strong>Çıkarım.</strong> Logaritma, kılık değiştirmiş bir üstür. Çarpım, bölüm ve kuvvet kuralları, üstel kuralların tam tersinden okunmuş hâlleridir. İki ters özdeşlik $a^{\\log_a x} = x$ ve $\\log_a(a^x) = x$ ile birleştiğinde içerisinde log barındıran hemen hemen her ifadeyi elle sadeleştirebileceğin bir şeye dönüştürür. 37. derste bu kuralları kullanarak <em>taban değişimi formülünü</em> icat edeceğiz — hesap makinelerinin sadece $\\ln$ ile $\\log_{10}$ kullanarak herhangi tabanlı $\\log$'u hesaplamasını sağlayan köprü.</div>
`

};
