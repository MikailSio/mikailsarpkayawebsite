var CALCULUS_L1 = {

en: '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Functions &amp; Notation</a> <span style="opacity:0.55;font-size:0.82em">(Math L40)</span></li><li><a href="/tutorials/matematik/11" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Intuitive Limit</a> <span style="opacity:0.55;font-size:0.82em">(Math L11)</span></li><li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Derivative Definition</a> <span style="opacity:0.55;font-size:0.82em">(Math L17)</span></li><li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Antiderivative</a> <span style="opacity:0.55;font-size:0.82em">(Math L27)</span></li></ul></div><p class="l-text"><strong>Calculus is the mathematics of change.</strong> While algebra deals with static quantities — fixed values, balanced equations, geometric shapes that do not move — calculus gives us the language to describe how things <em>move</em>, <em>grow</em>, and <em>transform</em>. A falling stone, the heating of a metal rod, the population of a city, the speed of a car on a winding road: every changing quantity in the natural world can be analyzed with the tools you will meet in this lesson.</p>'

+ '<p class="l-text">This first lesson builds your intuition from scratch. We start with the idea of a limit, use it to define the derivative, and then read derivatives as slopes of tangent lines. We move slowly. Every symbol is explained. Every step is shown.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Read the intuitive and the formal epsilon-delta definition of a limit</li>'
+ '<li>Evaluate one-sided, two-sided, and infinite limits using basic algebraic techniques</li>'
+ '<li>State the three conditions for continuity at a point</li>'
+ '<li>Derive f\'(x) directly from the limit definition for polynomial functions</li>'
+ '<li>Interpret the derivative as the slope of a tangent line and as an instantaneous rate of change</li>'
+ '<li>Recognise where a derivative fails to exist (corners, vertical tangents, jumps)</li>'
+ '<li>Apply derivatives to physics (velocity, acceleration), economics (marginal cost), and geometry (tangent lines)</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: What is Calculus?
   ============================================================ */
+ '<h2 class="l-title">1. What is Calculus?</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> Imagine watching a car on a highway. Algebra tells you "the car is at kilometre 50." Calculus tells you "the car is at kilometre 50, moving at 90 km/h, and accelerating at 5 km/h per second." Calculus captures the full picture of change — position, speed, and how speed itself is changing.</div>'

+ '<p class="l-text">Calculus splits naturally into two large branches:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Differential Calculus</div><div class="card-body">Studies <strong>rates of change</strong> — how a quantity behaves at a single instant. Its main tool is the <em>derivative</em>. It answers questions such as "how fast?", "how steep?", and "where is the slope zero?".</div></div>'
+ '<div class="calc-card"><div class="card-title">Integral Calculus</div><div class="card-body">Studies <strong>accumulation</strong> — total amount built up from infinitely many small contributions. Its main tool is the <em>integral</em>. It answers questions such as "how much area?", "how much distance?", and "what is the total?".</div></div>'
+ '<div class="calc-card"><div class="card-title">Why Both Matter</div><div class="card-body">The two branches are tied together by the <em>Fundamental Theorem of Calculus</em>: differentiation and integration are inverse operations. Knowing one helps you understand the other.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>A short history.</strong> Isaac Newton (England, 1660s) and Gottfried Wilhelm Leibniz (Germany, 1670s) independently invented calculus. Newton was motivated by physics — describing the motion of the planets and falling bodies — and used calculus in his <em>Principia Mathematica</em> (1687). Leibniz approached the subject from a more abstract direction and gave us the elegant notation $\\frac{dy}{dx}$ and $\\int$ that we still use today. A long priority dispute followed; mathematics now credits both.</p>'

+ '<div class="think-box"><div class="think-label">A QUICK MENTAL EXPERIMENT</div><div class="think-body">Drop a stone from a 20-metre cliff. After 1 second its position has changed; after 2 seconds it has changed more. The <em>position</em> as a function of time is the realm of algebra. The <em>speed</em> at any instant is the realm of differential calculus. The <em>total distance covered</em> over the fall is the realm of integral calculus. The same falling stone, three different questions, three layers of mathematics.</div></div>'

/* ============================================================
   SECTION 2: Intuitive Limits
   ============================================================ */
+ '<h2 class="l-title">2. Intuitive Limits</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> Walk toward a wall. First you are 1 m away, then 0.5 m, then 0.25 m, then 0.125 m, and so on. You keep halving the distance but never quite touch the wall. The <em>limit</em> of your position is the wall itself — the value you approach, even if you never exactly reach it.</div>'

+ '<p class="l-text">A <strong>limit</strong> describes the value a function approaches as its input gets arbitrarily close to some number. Limits care about behaviour <em>near</em> a point, not the value <em>at</em> the point. This subtle distinction is the foundation on which all of calculus is built.</p>'

+ '<div class="calc-formula"><div class="formula-label">LIMIT NOTATION</div><div class="formula-main">$$\\lim_{x \\to a} f(x) = L$$</div><div class="formula-sub">Read: "the limit of f(x) as x approaches a equals L."</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Limit</div><div class="card-body">The operation of finding what value a function <em>approaches</em>. Not what it equals at the point, but what it gets close to from nearby points.</div></div>'
+ '<div class="calc-card"><div class="card-title">x approaches a</div><div class="card-body">x gets closer and closer to a, from both sides. The value of x never has to actually equal a.</div></div>'
+ '<div class="calc-card"><div class="card-title">The function</div><div class="card-body">Any well-defined expression in x. As x approaches a we watch the behaviour of f(x).</div></div>'
+ '<div class="calc-card"><div class="card-title">Limit value L</div><div class="card-body">The number f(x) gets arbitrarily close to. If f(x) approaches different values from left and right, the two-sided limit does not exist.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>One-sided limits.</strong> Sometimes we want to approach only from the left or only from the right:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">LEFT-HAND LIMIT</div><div class="compare-item">Notation: lim x→a⁻ f(x)</div><div class="compare-item">x approaches a from the <strong>left</strong> (smaller values)</div><div class="compare-item">Example sequence: x = 1.9, 1.99, 1.999, ...</div></div><div class="compare-col"><div class="compare-title">RIGHT-HAND LIMIT</div><div class="compare-item">Notation: lim x→a⁺ f(x)</div><div class="compare-item">x approaches a from the <strong>right</strong> (larger values)</div><div class="compare-item">Example sequence: x = 2.1, 2.01, 2.001, ...</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">TWO-SIDED LIMIT EXISTS WHEN</div><div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x) \\;=\\; L$$</div><div class="formula-sub">The two-sided limit exists only when both one-sided limits exist and agree.</div></div>'

/* --- Plotly: Limit Visualization --- */
+ '<div id="plot-limit-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push((x*x-4)/(x-2));}'
+ 'var xR=[];var yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push((x*x-4)/(x-2));}'
+ 'var t1={x:xL,y:yL,mode:"lines",name:"f(x) left of 2",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xR,y:yR,mode:"lines",name:"f(x) right of 2",line:{color:"#c8a96e",width:2.5},showlegend:false};'
+ 'var t3={x:[2],y:[4],mode:"markers",name:"limit = 4 (hole)",marker:{size:12,color:"rgba(0,0,0,0)",line:{color:"#f87171",width:2.5}}};'
+ 'var ann=[{x:2,y:4,text:"Limit = 4",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f87171",size:13}}];'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,5.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,8],title:"f(x)"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-limit-en",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The function f(x) = (x²−4)/(x−2) is undefined at x = 2 (division by zero), but as x approaches 2 from both sides, f(x) approaches 4. The open circle marks the "hole" — the function never reaches 4 at x = 2 itself, yet the limit is 4.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE</div><div class="example-body"><strong>Show that</strong> $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = 4$.<br><br>Direct substitution gives 0/0 — undefined. So we factor the numerator:<br><br>$\\frac{x^2 - 4}{x - 2} = \\frac{(x - 2)(x + 2)}{x - 2} = x + 2$ &nbsp;&nbsp;(valid for x ≠ 2)<br><br>Now substitute: $\\lim_{x \\to 2} (x + 2) = 2 + 2 = 4$. The limit is <strong>4</strong>.</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does the limit exist even though f(2) is undefined? Because the limit only inspects values of f at points <em>near</em> 2, never at 2 itself. For every x ≠ 2 the expression simplifies to x + 2, and that simpler function is perfectly well behaved at x = 2.</div></div>'

/* ============================================================
   SECTION 3: The Formal Definition (ε-δ)
   ============================================================ */
+ '<h2 class="l-title">3. The Formal Definition (ε-δ)</h2>'

+ '<p class="l-text">The intuitive description "f(x) gets arbitrarily close to L as x gets close to a" is fine for pictures, but mathematicians wanted something they could prove theorems with. In the 1800s Karl Weierstrass produced the modern formal definition, known as the <strong>epsilon-delta definition</strong>:</p>'

+ '<div class="calc-formula"><div class="formula-label">EPSILON-DELTA DEFINITION OF A LIMIT</div><div class="formula-main">$$\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0 \\;\\; \\exists \\delta > 0 \\;:\\; 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon$$</div><div class="formula-sub">For any tolerance ε around L you choose, there is a tolerance δ around a such that whenever x sits inside the δ-interval around a (and x ≠ a), f(x) sits inside the ε-interval around L.</div></div>'

+ '<p class="l-text"><strong>How to read this.</strong> Imagine the limit value L surrounded by a horizontal band of half-width ε. The definition says: no matter how thin you make that ε-band, you can find a vertical strip of half-width δ around x = a such that the graph of f stays inside the ε-band whenever x stays inside the δ-strip. The smaller you choose ε, the smaller δ may have to be — but a δ always exists.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">ε (epsilon)</div><div class="card-body">A target tolerance on the output. It tells you "I want f(x) to be within ε of L." You may pick ε as small as you like.</div></div>'
+ '<div class="calc-card"><div class="card-title">δ (delta)</div><div class="card-body">A response on the input side. It tells you "stay within δ of a and the output will be within ε of L." δ depends on ε.</div></div>'
+ '<div class="calc-card"><div class="card-title">0 &lt; |x − a|</div><div class="card-body">The "0 &lt;" excludes x = a itself. The limit ignores the actual value f(a) and only inspects nearby points.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (ε-δ PROOF)</div><div class="example-body"><strong>Prove:</strong> $\\lim_{x \\to 3} (2x + 1) = 7$.<br><br>Given any ε > 0 we need to produce a δ > 0 such that<br><br>$0 < |x - 3| < \\delta \\implies |(2x + 1) - 7| < \\varepsilon$.<br><br>Simplify the right side: $|2x + 1 - 7| = |2x - 6| = 2|x - 3|$.<br><br>We want $2|x - 3| < \\varepsilon$, that is $|x - 3| < \\varepsilon / 2$.<br><br>So <strong>choose δ = ε / 2</strong>. Then $0 < |x - 3| < \\delta$ gives $|f(x) - 7| = 2|x - 3| < 2 \\cdot (\\varepsilon/2) = \\varepsilon$, exactly as required. The proof is complete.</div></div>'

+ '<div class="l-note"><strong>Why bother with ε-δ?</strong> In a first course you mostly compute limits using rules and substitution; the formal definition is rarely needed for routine work. But the definition is the precise legal contract that the rules below rely on. Every limit theorem (laws of limits, continuity, derivative existence) is ultimately proved by an ε-δ argument.</div>'

/* ============================================================
   SECTION 4: Limit Laws
   ============================================================ */
+ '<h2 class="l-title">4. Limit Laws</h2>'

+ '<p class="l-text">In practice we almost never reach for ε-δ directly. Instead we use a small toolkit of <strong>limit laws</strong> that follow from the definition. Let $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$, with c a constant:</p>'

+ '<div class="calc-formula"><div class="formula-label">THE BASIC LIMIT LAWS</div><div class="formula-main">$$\\begin{aligned} \\lim_{x \\to a}\\, c &= c \\\\ \\lim_{x \\to a} x &= a \\\\ \\lim_{x \\to a}\\, [f(x) \\pm g(x)] &= L \\pm M \\\\ \\lim_{x \\to a}\\, [c \\cdot f(x)] &= c \\cdot L \\\\ \\lim_{x \\to a}\\, [f(x) \\cdot g(x)] &= L \\cdot M \\\\ \\lim_{x \\to a}\\, \\frac{f(x)}{g(x)} &= \\frac{L}{M} \\quad (M \\neq 0) \\\\ \\lim_{x \\to a}\\, [f(x)]^n &= L^n \\end{aligned}$$</div><div class="formula-sub">Constants pull out, sums split, products split, quotients split provided the denominator does not vanish.</div></div>'

+ '<p class="l-text"><strong>Consequence.</strong> Polynomials are continuous everywhere: if $p(x) = a_n x^n + \\dots + a_1 x + a_0$ then $\\lim_{x \\to a} p(x) = p(a)$. Likewise rational functions $p(x)/q(x)$ are continuous wherever $q(a) \\neq 0$. So for polynomials and most rational functions, you simply <em>substitute</em>.</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (DIRECT SUBSTITUTION)</div><div class="example-body"><strong>Compute:</strong> $\\lim_{x \\to 2} (3x^2 - 5x + 1)$.<br><br>The expression is a polynomial, so substitute x = 2:<br><br>$3(2)^2 - 5(2) + 1 = 12 - 10 + 1 = 3$.<br><br>Therefore the limit is <strong>3</strong>.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (FACTORING TO REMOVE 0/0)</div><div class="example-body"><strong>Compute:</strong> $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.<br><br>Direct substitution gives 0/0. Factor the numerator as a difference of squares:<br><br>$\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3$ &nbsp;(valid for x ≠ 3)<br><br>Now substitute: x + 3 → 3 + 3 = <strong>6</strong>.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (RATIONALISING)</div><div class="example-body"><strong>Compute:</strong> $\\lim_{x \\to 0} \\dfrac{\\sqrt{x + 4} - 2}{x}$.<br><br>Substitution gives 0/0. Multiply numerator and denominator by the conjugate $\\sqrt{x+4}+2$:<br><br>$\\dfrac{(\\sqrt{x+4} - 2)(\\sqrt{x+4} + 2)}{x \\,(\\sqrt{x+4} + 2)} = \\dfrac{(x+4) - 4}{x\\,(\\sqrt{x+4} + 2)} = \\dfrac{x}{x\\,(\\sqrt{x+4} + 2)} = \\dfrac{1}{\\sqrt{x+4} + 2}$.<br><br>Now substitute x = 0: $\\dfrac{1}{\\sqrt{4} + 2} = \\dfrac{1}{4}$. The limit is <strong>1/4</strong>.</div></div>'

/* ============================================================
   SECTION 5: One-Sided & Infinite Limits
   ============================================================ */
+ '<h2 class="l-title">5. One-Sided and Infinite Limits</h2>'

+ '<p class="l-text">Not every limit comes from a smooth two-sided approach. Two important variations:</p>'

+ '<p class="l-text"><strong>(a) One-sided limits split.</strong> Consider the step function</p>'

+ '<div class="calc-formula"><div class="formula-main">$$f(x) = \\begin{cases} -1 & x < 0 \\\\ +1 & x \\geq 0 \\end{cases}$$</div></div>'

+ '<p class="l-text">From the left: $\\lim_{x \\to 0^-} f(x) = -1$. From the right: $\\lim_{x \\to 0^+} f(x) = +1$. The one-sided limits disagree, so the two-sided limit $\\lim_{x \\to 0} f(x)$ <strong>does not exist</strong>.</p>'

+ '<p class="l-text"><strong>(b) Infinite limits.</strong> The function $f(x) = 1/x^2$ grows without bound as x → 0. We write</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\frac{1}{x^2} = +\\infty$$</div><div class="formula-sub">This is <em>not</em> a number; it is shorthand for "f(x) grows beyond any bound as x → 0."</div></div>'

+ '<p class="l-text"><strong>(c) Limits at infinity.</strong> We can also let x grow without bound. For example $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$ — as x gets very large, 1/x gets arbitrarily close to 0.</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (LIMIT AT INFINITY)</div><div class="example-body"><strong>Compute:</strong> $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 2x - 1}{x^2 + 5}$.<br><br>Divide numerator and denominator by the highest power of x, namely $x^2$:<br><br>$\\dfrac{3 + 2/x - 1/x^2}{1 + 5/x^2}$.<br><br>As $x \\to \\infty$, every term containing 1/x or $1/x^2$ tends to 0. So the expression tends to $\\dfrac{3 + 0 - 0}{1 + 0} = 3$.</div></div>'

/* ============================================================
   SECTION 6: Continuity
   ============================================================ */
+ '<h2 class="l-title">6. Continuity</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> A continuous function is one whose graph you can draw without lifting your pen from the page. There are no holes, no jumps, no infinite spikes. Most functions you meet in elementary mathematics — polynomials, sin, cos, $e^x$, $\\ln x$ on its domain — are continuous everywhere they are defined.</div>'

+ '<p class="l-text">Formally, a function f is <strong>continuous at x = a</strong> if all three of the following hold:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">f(a) is defined</div><div class="step-detail">The value f(a) exists — no hole or undefined point at a.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\lim_{x \\to a} f(x)$ exists</div><div class="step-detail">The two-sided limit exists, i.e. left-hand and right-hand limits agree.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\lim_{x \\to a} f(x) = f(a)$</div><div class="step-detail">The limit equals the actual function value — no jump between the approach value and the point value.</div></div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Three classical kinds of discontinuity:</strong></p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Removable</div><div class="card-body">The limit exists but does not equal f(a) (a "hole" in the graph). Patching the value at a single point would make f continuous. Example: $(x^2 - 4)/(x - 2)$ at x = 2.</div></div>'
+ '<div class="calc-card"><div class="card-title">Jump</div><div class="card-body">Both one-sided limits exist but are unequal. The graph "jumps" from one level to another. Example: the step function above.</div></div>'
+ '<div class="calc-card"><div class="card-title">Infinite</div><div class="card-body">At least one one-sided limit is $\\pm \\infty$. The function shoots off to infinity. Example: $1/x$ near x = 0.</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Intermediate Value Theorem.</strong> If f is continuous on the closed interval [a, b] and N is any value between f(a) and f(b), then there exists at least one c in (a, b) with f(c) = N. Continuous functions cannot "skip" output values — a powerful tool for proving that equations have solutions.</div>'

/* ============================================================
   SECTION 7: The Derivative — Limit Definition
   ============================================================ */
+ '<h2 class="l-title">7. The Derivative — Limit Definition</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> You drive from Istanbul to Ankara, a distance of about 450 km, in 5 hours. Your <em>average</em> speed was 90 km/h. But at any single moment the speedometer might read 60, 100, or 120 km/h. That speedometer reading is your <em>instantaneous</em> speed — and finding it is exactly what a derivative does.</div>'

+ '<p class="l-text">Between two points $(a, f(a))$ and $(a+h, f(a+h))$ the <strong>average rate of change</strong> of f is the slope of the secant line:</p>'

+ '<div class="calc-formula"><div class="formula-label">AVERAGE RATE OF CHANGE</div><div class="formula-main">$$\\frac{\\Delta y}{\\Delta x} = \\frac{f(a + h) - f(a)}{h}$$</div><div class="formula-sub">This is sometimes called the <em>difference quotient</em>. It measures the slope over an interval of width h.</div></div>'

+ '<p class="l-text">Now let the interval shrink: send h → 0. The secant line rotates and (if the limit exists) settles into the <strong>tangent line</strong> at x = a. Its slope is the <strong>derivative</strong>:</p>'

+ '<div class="calc-formula"><div class="formula-label">DEFINITION OF THE DERIVATIVE</div><div class="formula-main">$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$$</div><div class="formula-sub">The instantaneous rate of change of f at the point a. Other common notations: $\\dfrac{df}{dx}\\bigg|_{x=a}$, $Df(a)$, $\\dot f(a)$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">f prime at a</div><div class="card-body">The value $f\'(a)$ is the slope of the tangent line at the single point x = a. Pronounced "f prime of a."</div></div>'
+ '<div class="calc-card"><div class="card-title">Step size h</div><div class="card-body">Small increment between two nearby x-values. As h shrinks to 0 the secant becomes the tangent.</div></div>'
+ '<div class="calc-card"><div class="card-title">Difference quotient</div><div class="card-body">The fraction $[f(a+h) - f(a)] / h$. This is rise-over-run for a tiny step.</div></div>'
+ '</div>'

+ '<p class="l-text">Letting a vary, we get the <strong>derivative function</strong>:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$</div></div>'

+ '<p class="l-text"><strong>Worked derivation: derivative of f(x) = x² from the definition.</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the difference quotient</div><div class="step-detail">$\\dfrac{f(x+h) - f(x)}{h} = \\dfrac{(x+h)^2 - x^2}{h}$</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Expand the square</div><div class="step-detail">$(x+h)^2 = x^2 + 2xh + h^2$, so numerator $= 2xh + h^2$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Cancel the common factor h</div><div class="step-detail">$\\dfrac{2xh + h^2}{h} = 2x + h$ for h ≠ 0.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Take the limit as h → 0</div><div class="step-detail">$\\lim_{h \\to 0}(2x + h) = 2x$. Therefore $f\'(x) = 2x$.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">RESULT</div><div class="formula-main">$$f(x) = x^2 \\implies f\'(x) = 2x$$</div><div class="formula-sub">At x = 1 the slope is 2. At x = 3 the slope is 6. At x = 0 the slope is 0 (the vertex of the parabola).</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (DERIVATIVE OF f(x) = 1/x)</div><div class="example-body"><strong>Find f\'(x) from the definition for f(x) = 1/x.</strong><br><br>Difference quotient: $\\dfrac{1/(x+h) - 1/x}{h}$<br><br>Combine over a common denominator: $\\dfrac{1}{h} \\cdot \\dfrac{x - (x+h)}{x(x+h)} = \\dfrac{1}{h} \\cdot \\dfrac{-h}{x(x+h)} = \\dfrac{-1}{x(x+h)}$<br><br>Take the limit as h → 0: $\\dfrac{-1}{x \\cdot x} = -\\dfrac{1}{x^2}$.<br><br>Therefore <strong>$f\'(x) = -1/x^2$</strong>.</div></div>'

/* ============================================================
   SECTION 8: Geometric Meaning — Tangent Slope
   ============================================================ */
+ '<h2 class="l-title">8. Geometric Meaning — Tangent Slope</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> Walking on a hillside, at each point the ground beneath your feet has a slope: gentle uphill, steep uphill, level, gentle downhill, steep downhill. The derivative of the elevation function is exactly that slope reading at every point along your path.</div>'

+ '<p class="l-text">The number $f\'(a)$ gives the <strong>slope of the tangent line</strong> to the curve y = f(x) at the point $(a, f(a))$. Using point-slope form:</p>'

+ '<div class="calc-formula"><div class="formula-label">EQUATION OF THE TANGENT LINE</div><div class="formula-main">$$y = f(a) + f\'(a)\\,(x - a)$$</div><div class="formula-sub">This line touches the curve at $(a, f(a))$ and locally looks like the curve. Near a, it is the best straight-line approximation.</div></div>'

/* --- Plotly: Secant to Tangent --- */
+ '<div id="plot-secant-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];for(var i=-20;i<=40;i++){var x=i/10;xv.push(x);yv.push(x*x);}'
+ 'var curve={x:xv,y:yv,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.5}};'
+ 'var sec={x:[1,3],y:[1,9],mode:"lines+markers",name:"Secant (avg slope = 4)",line:{color:"#4ecdc4",width:2,dash:"dash"},marker:{size:8,color:"#4ecdc4"}};'
+ 'var tan={x:[0,4],y:[-1,7],mode:"lines",name:"Tangent at x=1 (slope = 2)",line:{color:"#f87171",width:2.5}};'
+ 'var pt={x:[1],y:[1],mode:"markers",name:"Point (1, 1)",marker:{size:10,color:"#f87171"}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2.5,4.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,10],title:"f(x)"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-secant-en",[curve,sec,tan,pt],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The gold curve is f(x) = x². The dashed teal line is the secant through (1, 1) and (3, 9) with average slope $(9 - 1)/(3 - 1) = 4$. The red line is the tangent at x = 1 with instantaneous slope $f\'(1) = 2$. As the second point slides toward (1, 1), the secant rotates and becomes the tangent.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (TANGENT LINE)</div><div class="example-body"><strong>Find the tangent line to f(x) = x² at x = 1.</strong><br><br>$f(1) = 1$, so the point of tangency is $(1, 1)$.<br>$f\'(x) = 2x$, so $f\'(1) = 2$ (the slope).<br><br>Tangent: $y = 1 + 2(x - 1) = 2x - 1$.<br><br><strong>Sanity check.</strong> At x = 1.01: the curve gives $f(1.01) = 1.0201$; the tangent line gives $y = 2(1.01) - 1 = 1.02$. The difference is only 0.0001 — the tangent is an excellent local approximation.</div></div>'

+ '<p class="l-text">Watching the derivative function $f\'(x)$ next to the original $f(x)$ is illuminating. Wherever $f$ is flat, $f\'$ is zero; wherever $f$ rises steeply, $f\'$ is large; wherever $f$ falls, $f\'$ is negative.</p>'

/* --- Plotly: Derivative as Slope Function --- */
+ '<div id="plot-slope-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];var yp=[];for(var i=-30;i<=30;i++){var x=i/10;xv.push(x);yv.push(x*x);yp.push(2*x);}'
+ 'var curve={x:xv,y:yv,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.5},yaxis:"y"};'
+ 'var deriv={x:xv,y:yp,mode:"lines",name:"f\'(x) = 2x",line:{color:"#f87171",width:2.5},yaxis:"y2"};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,3.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1,10],title:"f(x)",side:"left",titlefont:{color:"#c8a96e"},tickfont:{color:"#c8a96e"}},yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-7,7],title:"f\'(x)",side:"right",overlaying:"y",titlefont:{color:"#f87171"},tickfont:{color:"#f87171"}},margin:{t:30,r:60,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-slope-en",[curve,deriv],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Gold = $f(x) = x^2$ (the parabola). Red = $f\'(x) = 2x$ (its derivative). Where the parabola is flat (x = 0), the derivative is zero. Where the parabola rises steeply (x = 3), the derivative is large (6). Where the parabola falls (x < 0), the derivative is negative.</div></div>'

/* ============================================================
   SECTION 9: Differentiability vs Continuity
   ============================================================ */
+ '<h2 class="l-title">9. Differentiability vs Continuity</h2>'

+ '<div class="calc-highlight"><strong>Everyday picture:</strong> A continuous graph can be drawn without lifting your pen. A differentiable graph can be drawn without lifting your pen <em>and</em> without making any sharp corners — it must be locally smooth. Every differentiable function is continuous, but not every continuous function is differentiable.</div>'

+ '<p class="l-text">A function is <strong>differentiable at x = a</strong> if the limit defining $f\'(a)$ exists as a finite real number. The implication chain is</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\text{differentiable at } a \\;\\implies\\; \\text{continuous at } a \\;\\implies\\; \\lim_{x \\to a} f(x) \\text{ exists}$$</div><div class="formula-sub">The arrows go one way only. A continuous function may still fail to be differentiable.</div></div>'

+ '<p class="l-text"><strong>Where does the derivative fail to exist?</strong> Three classical cases:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sharp corner</div><div class="card-body">$f(x) = |x|$ at x = 0. The left slope is −1, the right slope is +1. They disagree, so $f\'(0)$ does not exist. The graph forms a V.</div></div>'
+ '<div class="calc-card"><div class="card-title">Vertical tangent</div><div class="card-body">$f(x) = x^{1/3}$ at x = 0. The tangent line is vertical (infinite slope), so the difference quotient diverges. The function is continuous, but $f\'(0)$ does not exist as a real number.</div></div>'
+ '<div class="calc-card"><div class="card-title">Jump discontinuity</div><div class="card-body">A step function jumping from one value to another at x = 0. Not even continuous, hence certainly not differentiable.</div></div>'
+ '</div>'

/* --- Plotly: |x| sharp corner --- */
+ '<div id="plot-nodiff-en" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];for(var i=-30;i<=30;i++){var x=i/10;xv.push(x);yv.push(Math.abs(x));}'
+ 'var abs_fn={x:xv,y:yv,mode:"lines",name:"f(x) = |x|",line:{color:"#c8a96e",width:2.5}};'
+ 'var corner={x:[0],y:[0],mode:"markers",name:"corner: no derivative",marker:{size:12,color:"#f87171",symbol:"x"}};'
+ 'var left_t={x:[-3,0],y:[3,0],mode:"lines",name:"Left slope = -1",line:{color:"#4ecdc4",width:2,dash:"dash"}};'
+ 'var right_t={x:[0,3],y:[0,3],mode:"lines",name:"Right slope = +1",line:{color:"#a78bfa",width:2,dash:"dash"}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,3.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.5,4],title:"f(x)"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};'
+ 'Plotly.newPlot("plot-nodiff-en",[abs_fn,corner,left_t,right_t],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> f(x) = |x| forms a V. At x = 0 the left tangent has slope −1 (teal) and the right tangent has slope +1 (purple). Since the left and right slopes disagree, $f\'(0)$ does not exist. The function is still continuous there.</div></div>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (|x| AT 0)</div><div class="example-body"><strong>Show that f(x) = |x| is continuous but not differentiable at x = 0.</strong><br><br><em>Continuity.</em> For x near 0 from either side, $|x| \\to 0 = f(0)$. So $\\lim_{x \\to 0} |x| = 0 = f(0)$ — continuous.<br><br><em>Differentiability.</em> Compute the one-sided difference quotients at 0:<br>From the right: $\\dfrac{|0 + h| - 0}{h} = \\dfrac{h}{h} = 1$ for h > 0, so $\\lim_{h \\to 0^+} = 1$.<br>From the left: $\\dfrac{|0 + h| - 0}{h} = \\dfrac{-h}{h} = -1$ for h < 0, so $\\lim_{h \\to 0^-} = -1$.<br><br>The two one-sided limits disagree, so the limit defining $f\'(0)$ does not exist.</div></div>'

/* ============================================================
   SECTION 10: Classical Applications
   ============================================================ */
+ '<h2 class="l-title">10. Classical Applications</h2>'

+ '<p class="l-text">Derivatives appear all over classical mathematics, physics, and economics. A small tour:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Physics: velocity and acceleration</div><div class="card-body">If $s(t)$ is position at time t, then $v(t) = s\'(t)$ is the velocity and $a(t) = v\'(t) = s\'\'(t)$ is the acceleration.</div></div>'
+ '<div class="calc-card"><div class="card-title">Economics: marginal cost</div><div class="card-body">If $C(q)$ is the cost of producing q units, then $C\'(q)$ is the <em>marginal cost</em> — approximately the extra cost of one more unit.</div></div>'
+ '<div class="calc-card"><div class="card-title">Biology: growth rate</div><div class="card-body">If $P(t)$ is a population at time t, then $P\'(t)$ is the instantaneous growth rate (individuals per unit time).</div></div>'
+ '<div class="calc-card"><div class="card-title">Geometry: tangent lines</div><div class="card-body">The derivative gives the slope of the tangent to a curve, which is the basis for all linear approximation and Taylor series.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Application 1 — Free fall.</strong> A stone is dropped from rest from a 45 m cliff. Ignoring air resistance, classical mechanics gives the position function $s(t) = 45 - 4.9\\,t^2$ metres, where t is in seconds (here $g \\approx 9.8$ m/s²).</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (VELOCITY AND ACCELERATION)</div><div class="example-body"><strong>Find the velocity and acceleration of the falling stone.</strong><br><br>Velocity: $v(t) = s\'(t)$. Using the result $\\frac{d}{dt}(t^2) = 2t$:<br>$v(t) = 0 - 4.9 \\cdot 2t = -9.8\\,t$ &nbsp;m/s.<br>(Negative because the stone moves downward in our coordinates.)<br><br>Acceleration: $a(t) = v\'(t)$. Differentiating $-9.8\\,t$ gives the constant $-9.8$ m/s².<br><br><strong>Interpretation.</strong> After 2 s the stone is moving at $|v(2)| = 19.6$ m/s. The acceleration is constant at $9.8$ m/s² downward — this is gravity, exactly as Galileo deduced experimentally.</div></div>'

+ '<p class="l-text"><strong>Application 2 — Marginal cost.</strong> A small workshop has a total cost function $C(q) = 0.01\\,q^3 - 0.6\\,q^2 + 30\\,q + 200$ (in euros) for producing q items per day.</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (MARGINAL COST)</div><div class="example-body"><strong>Find the marginal cost when q = 20.</strong><br><br>$C\'(q) = 0.03\\,q^2 - 1.2\\,q + 30$.<br>At q = 20: $C\'(20) = 0.03 \\cdot 400 - 1.2 \\cdot 20 + 30 = 12 - 24 + 30 = 18$ euros per unit.<br><br><strong>Interpretation.</strong> When the workshop is already producing 20 items per day, producing one more item adds approximately 18 euros to the daily cost.</div></div>'

+ '<p class="l-text"><strong>Application 3 — Optimisation by derivative.</strong> One of the most useful classical facts: at a local maximum or minimum of a differentiable function, $f\'(x) = 0$. So to find extrema, solve $f\'(x) = 0$ and test the candidates.</p>'

+ '<div class="calc-example"><div class="example-label">WORKED EXAMPLE (MAXIMISING AN AREA)</div><div class="example-body"><strong>You have 100 m of fencing and want to enclose a rectangular garden against a long wall (no fence needed on the wall side). Maximise the area.</strong><br><br>Let x be the side perpendicular to the wall. Then the side along the wall is $100 - 2x$, and the area is<br>$A(x) = x \\cdot (100 - 2x) = 100x - 2x^2$, with $0 \\leq x \\leq 50$.<br><br>Take the derivative: $A\'(x) = 100 - 4x$. Set $A\'(x) = 0$: $x = 25$.<br><br>Check it is a maximum: $A\'\'(x) = -4 < 0$, so the critical point is a maximum (concave down).<br><br>The optimal rectangle is 25 m × 50 m, area = <strong>1250 m²</strong>.</div></div>'

/* ============================================================
   SECTION 11: Classical Exercises (worked)
   ============================================================ */
+ '<h2 class="l-title">11. Classical Exercises</h2>'

+ '<p class="l-text">Four hand-worked problems that combine everything from the lesson. Try each yourself first, then check the solution.</p>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 1 — LIMIT BY FACTORING</div><div class="example-body"><strong>Compute $\\lim_{x \\to 1} \\dfrac{x^3 - 1}{x - 1}$.</strong><br><br><em>Solution.</em> Direct substitution gives 0/0. Factor the numerator using the identity $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$:<br><br>$x^3 - 1 = (x - 1)(x^2 + x + 1)$.<br><br>So $\\dfrac{x^3 - 1}{x - 1} = x^2 + x + 1$ for x ≠ 1.<br><br>Taking the limit: $\\lim_{x \\to 1} (x^2 + x + 1) = 1 + 1 + 1 = \\mathbf{3}$.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 2 — DERIVATIVE FROM THE DEFINITION</div><div class="example-body"><strong>Use the limit definition to find f\'(x) for $f(x) = \\sqrt{x}$, x > 0.</strong><br><br><em>Solution.</em> Difference quotient:<br>$\\dfrac{\\sqrt{x + h} - \\sqrt{x}}{h}$.<br><br>Multiply by the conjugate $\\sqrt{x+h} + \\sqrt{x}$ over itself:<br>$\\dfrac{(\\sqrt{x+h} - \\sqrt{x})(\\sqrt{x+h} + \\sqrt{x})}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{(x + h) - x}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{1}{\\sqrt{x+h} + \\sqrt{x}}$.<br><br>Now take the limit as h → 0:<br>$f\'(x) = \\dfrac{1}{\\sqrt{x} + \\sqrt{x}} = \\dfrac{1}{2\\sqrt{x}}$.<br><br>So $\\mathbf{f\'(x) = \\dfrac{1}{2\\sqrt{x}}}$. Quick check: at x = 4, this gives 1/4, which matches the geometric slope of $\\sqrt{x}$ at that point.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 3 — TANGENT LINE</div><div class="example-body"><strong>Find the equation of the tangent line to $f(x) = x^3 - 3x$ at the point where x = 2.</strong><br><br><em>Solution.</em> Compute the point. $f(2) = 8 - 6 = 2$, so the point is $(2, 2)$.<br><br>Compute the slope. Using the limit definition (or the power rule, which you can verify the same way as $x^2$): $f\'(x) = 3x^2 - 3$. At x = 2: $f\'(2) = 3 \\cdot 4 - 3 = 9$.<br><br>Tangent line (point-slope form): $y - 2 = 9(x - 2)$, i.e. $\\mathbf{y = 9x - 16}$.<br><br><em>Sanity check.</em> At x = 2 the tangent gives $y = 9 \\cdot 2 - 16 = 2$, matching the point.</div></div>'

+ '<div class="calc-example"><div class="example-label">EXERCISE 4 — MAX/MIN VIA DERIVATIVE</div><div class="example-body"><strong>A farmer wants to build a rectangular pen with two parallel internal dividers (so three internal walls plus the outer rectangle). The total length of fence available is 240 m. What rectangle dimensions maximise the area?</strong><br><br><em>Solution.</em> Let the rectangle have width x (the direction perpendicular to the dividers) and length y. The total fence length is the perimeter plus the two extra divider walls of length x: $2x + 2y + 2x = 4x + 2y = 240$, so $y = 120 - 2x$, valid for $0 \\leq x \\leq 60$.<br><br>Area $A(x) = x \\cdot y = x(120 - 2x) = 120x - 2x^2$.<br><br>Derivative: $A\'(x) = 120 - 4x$. Set to zero: $x = 30$.<br><br>Second-derivative test: $A\'\'(x) = -4 < 0$, so x = 30 is a maximum.<br><br>Then $y = 120 - 60 = 60$. The maximising rectangle is <strong>30 m × 60 m</strong> with area $\\mathbf{1800\\text{ m}^2}$.</div></div>'

+ '<div class="l-warn"><strong>Looking ahead.</strong> In Lesson 2 we develop shortcut rules for differentiation — the power rule, sum rule, product rule, quotient rule, and chain rule — so that we no longer need to return to the limit definition for every new function. From there, computing derivatives becomes routine and we can focus on what derivatives <em>tell</em> us about the functions they come from.</div>'

/* ============================================================
   TURKISH VERSION
   ============================================================ */
,tr: '<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div><p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p><ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none"><li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Fonksiyon Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L40)</span></li><li><a href="/tutorials/matematik/11" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Sezgisel Limit</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L11)</span></li><li><a href="/tutorials/matematik/17" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Türev Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L17)</span></li><li><a href="/tutorials/matematik/27" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Ters Türev</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L27)</span></li></ul></div><p class="l-text"><strong>Kalkülüs, değişimin matematiğidir.</strong> Cebir; sabit büyüklüklerle — hareketsiz değerler, dengeli denklemler, yerinden kıpırdamayan geometrik şekiller — uğraşırken, kalkülüs bize bir şeylerin nasıl <em>hareket ettiğini</em>, <em>büyüdüğünü</em> ve <em>dönüştüğünü</em> betimleyecek dili verir. Düşen bir taş, ısınan bir metal çubuk, bir şehrin nüfusu, virajlı bir yolda bir otomobilin hızı: doğadaki değişen her büyüklük, bu derste tanışacağınız araçlarla incelenebilir.</p>'

+ '<p class="l-text">Bu ilk ders sezginizi sıfırdan kurar. Limit fikriyle başlarız, onu türevi tanımlamak için kullanırız, ardından türevleri teğet doğrularının eğimi olarak okuruz. Yavaş ilerleriz. Her sembol açıklanır. Her adım gösterilir.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKLERİNİZ</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Limitin hem sezgisel hem de formel epsilon-delta tanımını okumayı</li>'
+ '<li>Temel cebirsel teknikleri kullanarak tek-yanlı, iki-yanlı ve sonsuz limitleri hesaplamayı</li>'
+ '<li>Bir noktada sürekliliğin üç koşulunu ifade etmeyi</li>'
+ '<li>Polinom fonksiyonlar için f\'(x)\'i doğrudan limit tanımından türetmeyi</li>'
+ '<li>Türevi teğetin eğimi ve anlık değişim hızı olarak yorumlamayı</li>'
+ '<li>Türevin var olmadığı durumları tanımayı (köşeler, dikey teğetler, sıçramalar)</li>'
+ '<li>Türevleri fiziğe (hız, ivme), iktisada (marjinal maliyet) ve geometriye (teğet doğruları) uygulamayı</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   BÖLÜM 1: Kalkülüs Nedir?
   ============================================================ */
+ '<h2 class="l-title">1. Kalkülüs Nedir?</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Otoyolda bir otomobili izlediğinizi düşünün. Cebir size "otomobil 50. kilometrededir" der. Kalkülüs ise "otomobil 50. kilometrededir, saatte 90 km hızla gitmektedir ve saniyede 5 km/h hızlanmaktadır" der. Kalkülüs değişimin tam resmini yakalar — konum, hız, ve hızın kendisinin nasıl değiştiği.</div>'

+ '<p class="l-text">Kalkülüs doğal olarak iki büyük dala ayrılır:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Diferansiyel Kalkülüs</div><div class="card-body"><strong>Değişim hızlarını</strong> — bir büyüklüğün tek bir andaki davranışını — inceler. Temel aracı <em>türev</em>dir. "Ne kadar hızlı?", "Ne kadar dik?", "Eğim nerede sıfırdır?" sorularını yanıtlar.</div></div>'
+ '<div class="calc-card"><div class="card-title">İntegral Kalkülüs</div><div class="card-body"><strong>Birikimi</strong> — sonsuz sayıda küçük katkıdan oluşan toplam miktarı — inceler. Temel aracı <em>integral</em>dir. "Ne kadar alan?", "Ne kadar yol?", "Toplam ne kadar?" sorularını yanıtlar.</div></div>'
+ '<div class="calc-card"><div class="card-title">İkisi de Niçin Gerekli</div><div class="card-body">İki dal <em>Kalkülüsün Temel Teoremi</em> ile birbirine bağlanır: türev alma ve integral alma ters işlemlerdir. Birini anlamak diğerini anlamayı kolaylaştırır.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Kısa bir tarih.</strong> Isaac Newton (İngiltere, 1660\'lar) ve Gottfried Wilhelm Leibniz (Almanya, 1670\'ler) kalkülüsü birbirinden bağımsız olarak icat etmişlerdir. Newton fizikten — gezegenlerin ve düşen cisimlerin hareketinin betimlenmesinden — yola çıkmış ve kalkülüsü <em>Principia Mathematica</em> (1687) adlı eserinde kullanmıştır. Leibniz konuya daha soyut bir yönden yaklaşmış ve bugün hâlâ kullandığımız zarif $\\frac{dy}{dx}$ ve $\\int$ notasyonlarını bize armağan etmiştir. Uzun bir öncelik tartışması yaşanmış; bugün matematik her ikisini de anar.</p>'

+ '<div class="think-box"><div class="think-label">KÜÇÜK BİR ZİHİN DENEYİ</div><div class="think-body">20 metrelik bir uçurumdan bir taş bırakın. 1 saniye sonra konumu değişmiş olur; 2 saniye sonra daha da değişir. Zamanın fonksiyonu olarak <em>konum</em>, cebirin alanıdır. Bir andaki <em>hız</em>, diferansiyel kalkülüsün alanıdır. Düşüş boyunca kat edilen <em>toplam yol</em>, integral kalkülüsün alanıdır. Aynı taş, üç farklı soru, üç matematik katmanı.</div></div>'

/* ============================================================
   BÖLÜM 2: Sezgisel Limitler
   ============================================================ */
+ '<h2 class="l-title">2. Sezgisel Limitler</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Bir duvara doğru yürüyün. Önce 1 m uzaktasınız, sonra 0.5 m, sonra 0.25 m, sonra 0.125 m, ve böyle gider. Mesafeyi sürekli yarılıyorsunuz ama duvara tam olarak hiç dokunmuyorsunuz. Konumunuzun <em>limiti</em> duvarın kendisidir — yaklaştığınız, fakat hiçbir zaman tam olarak ulaşmasanız da yaklaştığınız değer.</div>'

+ '<p class="l-text">Bir <strong>limit</strong>, bir fonksiyonun girdisi belirli bir sayıya keyfi olarak yakınlaştıkça o fonksiyonun yaklaştığı değeri tanımlar. Limit, bir noktanın <em>kendisindeki</em> değerle değil, yakınındaki davranışla ilgilenir. Bu ince ayrım, tüm kalkülüsün üzerine kurulduğu temeldir.</p>'

+ '<div class="calc-formula"><div class="formula-label">LİMİT NOTASYONU</div><div class="formula-main">$$\\lim_{x \\to a} f(x) = L$$</div><div class="formula-sub">Okunuşu: "x, a\'ya yaklaşırken f(x)\'in limiti L\'dir."</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Limit</div><div class="card-body">Bir fonksiyonun neye <em>yaklaştığını</em> bulma işlemi. Noktadaki değer değil, çevredeki noktalardan yaklaşılan değer.</div></div>'
+ '<div class="calc-card"><div class="card-title">x, a\'ya yaklaşır</div><div class="card-body">x, her iki taraftan a\'ya giderek daha çok yaklaşır. x\'in a\'ya eşit olması gerekmez.</div></div>'
+ '<div class="calc-card"><div class="card-title">Fonksiyon</div><div class="card-body">İyi tanımlı her x ifadesi. x, a\'ya yaklaşırken f(x)\'in davranışını izleriz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Limit değeri L</div><div class="card-body">f(x)\'in keyfi olarak yaklaştığı sayı. Sol ve sağdan farklı değerlere yaklaşılırsa iki-yanlı limit yoktur.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Tek yanlı limitler.</strong> Bazen yalnızca soldan ya da yalnızca sağdan yaklaşmak isteriz:</p>'

+ '<div class="calc-compare"><div class="compare-col"><div class="compare-title">SOLDAN LİMİT</div><div class="compare-item">Notasyon: lim x→a⁻ f(x)</div><div class="compare-item">x, a\'ya <strong>soldan</strong> yaklaşır (daha küçük değerlerden)</div><div class="compare-item">Örnek dizi: x = 1.9, 1.99, 1.999, ...</div></div><div class="compare-col"><div class="compare-title">SAĞDAN LİMİT</div><div class="compare-item">Notasyon: lim x→a⁺ f(x)</div><div class="compare-item">x, a\'ya <strong>sağdan</strong> yaklaşır (daha büyük değerlerden)</div><div class="compare-item">Örnek dizi: x = 2.1, 2.01, 2.001, ...</div></div></div>'

+ '<div class="calc-formula"><div class="formula-label">İKİ YANLI LİMİT NE ZAMAN VARDIR</div><div class="formula-main">$$\\lim_{x \\to a^-} f(x) \\;=\\; \\lim_{x \\to a^+} f(x) \\;=\\; L$$</div><div class="formula-sub">İki yanlı limit, ancak iki tek yanlı limit de var ve birbirine eşitse vardır.</div></div>'

/* --- Plotly: Limit TR --- */
+ '<div id="plot-limit-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xL=[];var yL=[];for(var i=-30;i<20;i++){var x=i/10;xL.push(x);yL.push((x*x-4)/(x-2));}'
+ 'var xR=[];var yR=[];for(var i=21;i<=50;i++){var x=i/10;xR.push(x);yR.push((x*x-4)/(x-2));}'
+ 'var t1={x:xL,y:yL,mode:"lines",name:"f(x) 2\'nin solunda",line:{color:"#c8a96e",width:2.5}};'
+ 'var t2={x:xR,y:yR,mode:"lines",name:"f(x) 2\'nin sağında",line:{color:"#c8a96e",width:2.5},showlegend:false};'
+ 'var t3={x:[2],y:[4],mode:"markers",name:"limit = 4 (boşluk)",marker:{size:12,color:"rgba(0,0,0,0)",line:{color:"#f87171",width:2.5}}};'
+ 'var ann=[{x:2,y:4,text:"Limit = 4",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#f87171",size:13}}];'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,5.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,8],title:"f(x)"},annotations:ann,margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-limit-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> f(x) = (x²−4)/(x−2) fonksiyonu x = 2\'de tanımsızdır (sıfıra bölme), ama x her iki taraftan 2\'ye yaklaştıkça f(x) 4\'e yaklaşır. Açık daire "boşluğu" işaretler — fonksiyon x = 2\'de hiçbir zaman 4 değerine ulaşmaz, yine de limit 4\'tür.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK</div><div class="example-body"><strong>Gösteriniz:</strong> $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = 4$.<br><br>Doğrudan yerine koymak 0/0 verir — tanımsız. O hâlde payı çarpanlarına ayıralım:<br><br>$\\frac{x^2 - 4}{x - 2} = \\frac{(x - 2)(x + 2)}{x - 2} = x + 2$ &nbsp;&nbsp;(x ≠ 2 için geçerlidir)<br><br>Şimdi yerine koyalım: $\\lim_{x \\to 2} (x + 2) = 2 + 2 = 4$. Limit <strong>4</strong>\'tür.</div></div>'

+ '<div class="think-box"><div class="think-label">ŞUNU DÜŞÜNÜN</div><div class="think-body">f(2) tanımsız olduğu hâlde limit niçin var? Çünkü limit f\'nin yalnızca 2\'ye <em>yakın</em> noktalardaki değerlerine bakar, asla 2\'nin kendisine değil. Her x ≠ 2 için ifade x + 2\'ye sadeleşir; ve bu daha basit fonksiyon x = 2\'de gayet düzgün davranır.</div></div>'

/* ============================================================
   BÖLÜM 3: Formel Tanım (ε-δ)
   ============================================================ */
+ '<h2 class="l-title">3. Formel Tanım (ε-δ)</h2>'

+ '<p class="l-text">"f(x), x a\'ya yaklaşırken L\'ye keyfi olarak yaklaşır" şeklindeki sezgisel betim resimler için yeterlidir, ama matematikçiler bununla teorem ispatlayabilecekleri bir tanım istediler. 1800\'lerde Karl Weierstrass modern formel tanımı verdi; bu tanım <strong>epsilon-delta tanımı</strong> olarak bilinir:</p>'

+ '<div class="calc-formula"><div class="formula-label">LİMİTİN EPSİLON-DELTA TANIMI</div><div class="formula-main">$$\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0 \\;\\; \\exists \\delta > 0 \\;:\\; 0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon$$</div><div class="formula-sub">Seçtiğiniz her ε > 0 tolerans için, x; a\'nın δ-aralığında (ve x ≠ a) olduğunda f(x)\'in L\'nin ε-aralığında olmasını sağlayan bir δ > 0 vardır.</div></div>'

+ '<p class="l-text"><strong>Bunu nasıl okumalı.</strong> Limit değeri L\'yi, yarı genişliği ε olan yatay bir bant ile çevreleyin. Tanım şunu söyler: bu ε-bandını ne kadar incelttiğinizden bağımsız olarak, x = a etrafında yarı genişliği δ olan dikey bir şerit bulabilirsiniz, öyle ki x bu δ-şeridinde kaldığı sürece f\'nin grafiği ε-bandının içinde kalır. ε\'u ne kadar küçük seçerseniz δ da o kadar küçülmek zorunda kalabilir — ama bir δ daima vardır.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">ε (epsilon)</div><div class="card-body">Çıkış tarafında bir hedef toleransı. "f(x)\'in L\'ye ε kadar yakın olmasını istiyorum" der. ε\'u dilediğiniz kadar küçük seçebilirsiniz.</div></div>'
+ '<div class="calc-card"><div class="card-title">δ (delta)</div><div class="card-body">Giriş tarafındaki yanıt. "a\'ya δ kadar yakın kal ki çıkış L\'ye ε kadar yakın olsun" der. δ, ε\'a bağlıdır.</div></div>'
+ '<div class="calc-card"><div class="card-title">0 &lt; |x − a|</div><div class="card-body">"0 &lt;" kısmı x = a\'nın kendisini dışarıda bırakır. Limit, f(a)\'nın gerçek değerini görmezden gelir; yalnızca yakındaki noktalara bakar.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (ε-δ İSPATI)</div><div class="example-body"><strong>İspat ediniz:</strong> $\\lim_{x \\to 3} (2x + 1) = 7$.<br><br>Verilen her ε > 0 için şu koşulu sağlayan bir δ > 0 üretmemiz gerekir:<br><br>$0 < |x - 3| < \\delta \\implies |(2x + 1) - 7| < \\varepsilon$.<br><br>Sağ tarafı sadeleştirelim: $|2x + 1 - 7| = |2x - 6| = 2|x - 3|$.<br><br>$2|x - 3| < \\varepsilon$ olmasını, yani $|x - 3| < \\varepsilon / 2$ olmasını istiyoruz.<br><br>O hâlde <strong>δ = ε / 2</strong> seçelim. O zaman $0 < |x - 3| < \\delta$ koşulu $|f(x) - 7| = 2|x - 3| < 2 \\cdot (\\varepsilon/2) = \\varepsilon$ sonucunu verir; tam istediğimiz gibi. İspat tamamlanmıştır.</div></div>'

+ '<div class="l-note"><strong>ε-δ ile niçin uğraşılır?</strong> İlk derste limitleri çoğunlukla kurallarla ve yerine koyma ile hesaplarsınız; günlük işler için formel tanıma nadiren gerek olur. Ama tanım, aşağıdaki kuralların dayandığı kesin hukuki sözleşmedir. Her limit teoremi (limit kuralları, süreklilik, türev varlığı) nihayetinde bir ε-δ argümanıyla ispatlanır.</div>'

/* ============================================================
   BÖLÜM 4: Limit Kuralları
   ============================================================ */
+ '<h2 class="l-title">4. Limit Kuralları</h2>'

+ '<p class="l-text">Pratikte neredeyse hiç doğrudan ε-δ\'ya başvurmayız. Yerine, tanımdan çıkan küçük bir <strong>limit kuralları</strong> takımı kullanırız. $\\lim_{x \\to a} f(x) = L$ ve $\\lim_{x \\to a} g(x) = M$ olsun, c bir sabit olsun:</p>'

+ '<div class="calc-formula"><div class="formula-label">TEMEL LİMİT KURALLARI</div><div class="formula-main">$$\\begin{aligned} \\lim_{x \\to a}\\, c &= c \\\\ \\lim_{x \\to a} x &= a \\\\ \\lim_{x \\to a}\\, [f(x) \\pm g(x)] &= L \\pm M \\\\ \\lim_{x \\to a}\\, [c \\cdot f(x)] &= c \\cdot L \\\\ \\lim_{x \\to a}\\, [f(x) \\cdot g(x)] &= L \\cdot M \\\\ \\lim_{x \\to a}\\, \\frac{f(x)}{g(x)} &= \\frac{L}{M} \\quad (M \\neq 0) \\\\ \\lim_{x \\to a}\\, [f(x)]^n &= L^n \\end{aligned}$$</div><div class="formula-sub">Sabitler dışarı çıkar, toplamlar parçalanır, çarpımlar parçalanır, bölümler payda sıfır olmadıkça parçalanır.</div></div>'

+ '<p class="l-text"><strong>Sonuç.</strong> Polinomlar her yerde süreklidir: $p(x) = a_n x^n + \\dots + a_1 x + a_0$ ise $\\lim_{x \\to a} p(x) = p(a)$. Benzer biçimde, $p(x)/q(x)$ rasyonel fonksiyonları $q(a) \\neq 0$ olduğu her yerde süreklidir. Dolayısıyla polinomlar ve çoğu rasyonel fonksiyon için yapılacak iş, basitçe <em>yerine koymak</em>tır.</p>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (DOĞRUDAN YERİNE KOYMA)</div><div class="example-body"><strong>Hesaplayınız:</strong> $\\lim_{x \\to 2} (3x^2 - 5x + 1)$.<br><br>İfade bir polinomdur, o hâlde x = 2 koyarız:<br><br>$3(2)^2 - 5(2) + 1 = 12 - 10 + 1 = 3$.<br><br>Dolayısıyla limit <strong>3</strong>\'tür.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (0/0\'I ÇARPANLARA AYIRARAK GİDERMEK)</div><div class="example-body"><strong>Hesaplayınız:</strong> $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.<br><br>Doğrudan yerine koyma 0/0 verir. Payı iki kare farkı olarak çarpanlara ayıralım:<br><br>$\\frac{x^2 - 9}{x - 3} = \\frac{(x - 3)(x + 3)}{x - 3} = x + 3$ &nbsp;(x ≠ 3 için geçerli)<br><br>Şimdi yerine koyalım: x + 3 → 3 + 3 = <strong>6</strong>.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (KÖKLÜ İFADEYİ DÜZLEMEK)</div><div class="example-body"><strong>Hesaplayınız:</strong> $\\lim_{x \\to 0} \\dfrac{\\sqrt{x + 4} - 2}{x}$.<br><br>Yerine koymak 0/0 verir. Pay ve paydayı eşlenik $\\sqrt{x+4}+2$ ile çarpalım:<br><br>$\\dfrac{(\\sqrt{x+4} - 2)(\\sqrt{x+4} + 2)}{x \\,(\\sqrt{x+4} + 2)} = \\dfrac{(x+4) - 4}{x\\,(\\sqrt{x+4} + 2)} = \\dfrac{x}{x\\,(\\sqrt{x+4} + 2)} = \\dfrac{1}{\\sqrt{x+4} + 2}$.<br><br>Şimdi x = 0 koyarız: $\\dfrac{1}{\\sqrt{4} + 2} = \\dfrac{1}{4}$. Limit <strong>1/4</strong>\'tür.</div></div>'

/* ============================================================
   BÖLÜM 5: Tek Yanlı ve Sonsuz Limitler
   ============================================================ */
+ '<h2 class="l-title">5. Tek Yanlı ve Sonsuz Limitler</h2>'

+ '<p class="l-text">Her limit, düzgün iki yanlı bir yaklaşımdan gelmez. İki önemli varyasyon:</p>'

+ '<p class="l-text"><strong>(a) Tek yanlı limitler ayrışır.</strong> Aşağıdaki basamak fonksiyonunu düşünün:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$f(x) = \\begin{cases} -1 & x < 0 \\\\ +1 & x \\geq 0 \\end{cases}$$</div></div>'

+ '<p class="l-text">Soldan: $\\lim_{x \\to 0^-} f(x) = -1$. Sağdan: $\\lim_{x \\to 0^+} f(x) = +1$. Tek yanlı limitler uyuşmaz, dolayısıyla iki yanlı limit $\\lim_{x \\to 0} f(x)$ <strong>yoktur</strong>.</p>'

+ '<p class="l-text"><strong>(b) Sonsuz limitler.</strong> $f(x) = 1/x^2$ fonksiyonu x → 0 iken sınırsız büyür. Yazarız:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$\\lim_{x \\to 0} \\frac{1}{x^2} = +\\infty$$</div><div class="formula-sub">Bu bir <em>sayı değildir</em>; "x → 0 iken f(x) her sınırın üstüne çıkar" ifadesinin kısaltmasıdır.</div></div>'

+ '<p class="l-text"><strong>(c) Sonsuzdaki limitler.</strong> x\'i sınırsız büyütebiliriz de. Örneğin $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$ — x çok büyüdükçe 1/x sıfıra keyfi olarak yaklaşır.</p>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (SONSUZDAKİ LİMİT)</div><div class="example-body"><strong>Hesaplayınız:</strong> $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 2x - 1}{x^2 + 5}$.<br><br>Pay ve paydayı x\'in en büyük kuvveti olan $x^2$ ile bölelim:<br><br>$\\dfrac{3 + 2/x - 1/x^2}{1 + 5/x^2}$.<br><br>$x \\to \\infty$ iken 1/x veya $1/x^2$ içeren her terim 0\'a yaklaşır. Dolayısıyla ifade $\\dfrac{3 + 0 - 0}{1 + 0} = 3$\'e yaklaşır.</div></div>'

/* ============================================================
   BÖLÜM 6: Süreklilik
   ============================================================ */
+ '<h2 class="l-title">6. Süreklilik</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Sürekli bir fonksiyon, grafiğini kâğıttan kaleminizi kaldırmadan çizebileceğiniz fonksiyondur. Ne boşluk, ne sıçrama, ne sonsuz sivri uç vardır. Temel matematikte karşılaşacağınız çoğu fonksiyon — polinomlar, sin, cos, $e^x$, tanım kümesinde $\\ln x$ — tanımlı oldukları her yerde süreklidir.</div>'

+ '<p class="l-text">Formel olarak, bir f fonksiyonu x = a\'da <strong>süreklidir</strong>, aşağıdakilerin üçü de sağlanırsa:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">f(a) tanımlıdır</div><div class="step-detail">a\'da f(a) değeri mevcuttur — boşluk veya tanımsız nokta yoktur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$\\lim_{x \\to a} f(x)$ vardır</div><div class="step-detail">İki yanlı limit vardır; yani soldan ve sağdan limitler uyuşur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\lim_{x \\to a} f(x) = f(a)$</div><div class="step-detail">Limit, gerçek fonksiyon değerine eşittir — yaklaşma değeri ile nokta değeri arasında sıçrama yoktur.</div></div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Üç klasik süreksizlik tipi:</strong></p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Giderilebilir</div><div class="card-body">Limit vardır ama f(a)\'ya eşit değildir (grafikte bir "boşluk"). Tek bir noktadaki değeri düzeltmek f\'yi sürekli kılardı. Örnek: x = 2\'de $(x^2 - 4)/(x - 2)$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sıçrama</div><div class="card-body">Her iki tek yanlı limit de vardır ama eşit değildir. Grafik bir seviyeden başka bir seviyeye "sıçrar". Örnek: yukarıdaki basamak fonksiyonu.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sonsuz</div><div class="card-body">Tek yanlı limitlerden en az biri $\\pm \\infty$\'dir. Fonksiyon sonsuza gider. Örnek: x = 0 yakınında $1/x$.</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Ara Değer Teoremi.</strong> f kapalı [a, b] aralığında sürekli ve N, f(a) ile f(b) arasında bir değer ise, f(c) = N olan en az bir c ∈ (a, b) vardır. Sürekli fonksiyonlar çıkış değerlerini "atlayamaz" — denklem köklerinin varlığını ispatlamak için güçlü bir araçtır.</div>'

/* ============================================================
   BÖLÜM 7: Türev — Limit Tanımı
   ============================================================ */
+ '<h2 class="l-title">7. Türev — Limit Tanımı</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> İstanbul\'dan Ankara\'ya, yaklaşık 450 km\'lik bir yolu, 5 saatte gittiniz. <em>Ortalama</em> hızınız 90 km/h\'dir. Ama herhangi bir anda hız göstergesi 60, 100 ya da 120 km/h gösteriyor olabilir. Hız göstergesinin gösterdiği <em>anlık</em> hızdır — ve onu bulmak tam olarak türevin yaptığı şeydir.</div>'

+ '<p class="l-text">İki nokta arasında, $(a, f(a))$ ve $(a+h, f(a+h))$, f\'nin <strong>ortalama değişim hızı</strong> kiriş doğrusunun eğimidir:</p>'

+ '<div class="calc-formula"><div class="formula-label">ORTALAMA DEĞİŞİM HIZI</div><div class="formula-main">$$\\frac{\\Delta y}{\\Delta x} = \\frac{f(a + h) - f(a)}{h}$$</div><div class="formula-sub">Buna bazen <em>fark bölümü</em> denir. h genişliğindeki bir aralık üzerindeki eğimi ölçer.</div></div>'

+ '<p class="l-text">Şimdi aralığı küçültelim: h\'yi 0\'a gönderelim. Kiriş doğrusu döner ve (limit varsa) x = a\'daki <strong>teğet doğrusu</strong>na yerleşir. Onun eğimi de <strong>türev</strong>dir:</p>'

+ '<div class="calc-formula"><div class="formula-label">TÜREVİN TANIMI</div><div class="formula-main">$$f\'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}$$</div><div class="formula-sub">f\'nin a noktasındaki anlık değişim hızı. Diğer yaygın notasyonlar: $\\dfrac{df}{dx}\\bigg|_{x=a}$, $Df(a)$, $\\dot f(a)$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">a noktasında f üs</div><div class="card-body">$f\'(a)$ değeri, tek bir x = a noktasındaki teğet doğrusunun eğimidir. "f prime of a" diye okunur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Adım büyüklüğü h</div><div class="card-body">Yakın iki x değeri arasındaki küçük artış. h sıfıra inerken kiriş teğete dönüşür.</div></div>'
+ '<div class="calc-card"><div class="card-title">Fark bölümü</div><div class="card-body">$[f(a+h) - f(a)] / h$ kesri. Küçük bir adım için yükselme/yatay\'dır.</div></div>'
+ '</div>'

+ '<p class="l-text">a\'yı değiştirirsek <strong>türev fonksiyonunu</strong> elde ederiz:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$</div></div>'

+ '<p class="l-text"><strong>Çözümlü türetme: tanımdan f(x) = x²\'nin türevi.</strong></p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Fark bölümünü yazın</div><div class="step-detail">$\\dfrac{f(x+h) - f(x)}{h} = \\dfrac{(x+h)^2 - x^2}{h}$</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Kareyi açın</div><div class="step-detail">$(x+h)^2 = x^2 + 2xh + h^2$, dolayısıyla pay $= 2xh + h^2$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Ortak çarpan h\'yi sadeleştirin</div><div class="step-detail">h ≠ 0 için $\\dfrac{2xh + h^2}{h} = 2x + h$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">h → 0 limitini alın</div><div class="step-detail">$\\lim_{h \\to 0}(2x + h) = 2x$. Dolayısıyla $f\'(x) = 2x$.</div></div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">SONUÇ</div><div class="formula-main">$$f(x) = x^2 \\implies f\'(x) = 2x$$</div><div class="formula-sub">x = 1\'de eğim 2. x = 3\'te eğim 6. x = 0\'da eğim 0 (parabolün tepesi).</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (f(x) = 1/x\'in TÜREVİ)</div><div class="example-body"><strong>f(x) = 1/x için tanımdan f\'(x)\'i bulunuz.</strong><br><br>Fark bölümü: $\\dfrac{1/(x+h) - 1/x}{h}$.<br><br>Ortak paydada birleştirin: $\\dfrac{1}{h} \\cdot \\dfrac{x - (x+h)}{x(x+h)} = \\dfrac{1}{h} \\cdot \\dfrac{-h}{x(x+h)} = \\dfrac{-1}{x(x+h)}$.<br><br>h → 0 limitini alın: $\\dfrac{-1}{x \\cdot x} = -\\dfrac{1}{x^2}$.<br><br>Dolayısıyla <strong>$f\'(x) = -1/x^2$</strong>.</div></div>'

/* ============================================================
   BÖLÜM 8: Geometrik Anlam — Teğet Eğimi
   ============================================================ */
+ '<h2 class="l-title">8. Geometrik Anlam — Teğet Eğimi</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Bir yamaçta yürürken, her noktada ayağınızın altındaki zeminin bir eğimi vardır: hafif yukarı, dik yukarı, düz, hafif aşağı, dik aşağı. Yükseklik fonksiyonunun türevi, tam olarak yolunuz boyunca her noktadaki bu eğim okumasıdır.</div>'

+ '<p class="l-text">$f\'(a)$ sayısı, y = f(x) eğrisinin $(a, f(a))$ noktasındaki <strong>teğet doğrusunun eğimini</strong> verir. Nokta-eğim biçimini kullanarak:</p>'

+ '<div class="calc-formula"><div class="formula-label">TEĞET DOĞRUSU DENKLEMİ</div><div class="formula-main">$$y = f(a) + f\'(a)\\,(x - a)$$</div><div class="formula-sub">Bu doğru eğriye $(a, f(a))$ noktasında değer ve yerel olarak eğri gibi görünür. a yakınında en iyi doğrusal yaklaşımdır.</div></div>'

/* --- Plotly: Secant to Tangent TR --- */
+ '<div id="plot-secant-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];for(var i=-20;i<=40;i++){var x=i/10;xv.push(x);yv.push(x*x);}'
+ 'var curve={x:xv,y:yv,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.5}};'
+ 'var sec={x:[1,3],y:[1,9],mode:"lines+markers",name:"Kiriş (ort. eğim = 4)",line:{color:"#4ecdc4",width:2,dash:"dash"},marker:{size:8,color:"#4ecdc4"}};'
+ 'var tan={x:[0,4],y:[-1,7],mode:"lines",name:"Teğet, x = 1 (eğim = 2)",line:{color:"#f87171",width:2.5}};'
+ 'var pt={x:[1],y:[1],mode:"markers",name:"Nokta (1, 1)",marker:{size:10,color:"#f87171"}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2.5,4.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-2,10],title:"f(x)"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-secant-tr",[curve,sec,tan,pt],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Altın eğri f(x) = x². Kesikli turkuaz çizgi, (1, 1) ve (3, 9) noktalarından geçen kiriştir; ortalama eğimi $(9 - 1)/(3 - 1) = 4$\'tür. Kırmızı çizgi x = 1\'deki teğettir; anlık eğimi $f\'(1) = 2$\'dir. İkinci nokta (1, 1)\'e doğru kaydıkça kiriş dönerek teğete dönüşür.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (TEĞET DOĞRUSU)</div><div class="example-body"><strong>f(x) = x²\'nin x = 1\'deki teğet doğrusunu bulunuz.</strong><br><br>$f(1) = 1$, o hâlde teğet noktası $(1, 1)$\'dir.<br>$f\'(x) = 2x$, o hâlde $f\'(1) = 2$ (eğim).<br><br>Teğet: $y = 1 + 2(x - 1) = 2x - 1$.<br><br><strong>Sınama.</strong> x = 1.01\'de: eğri $f(1.01) = 1.0201$ verir; teğet ise $y = 2(1.01) - 1 = 1.02$ verir. Fark yalnızca 0.0001\'dir — teğet mükemmel bir yerel yaklaşımdır.</div></div>'

+ '<p class="l-text">Türev fonksiyonu $f\'(x)$\'i orijinal $f(x)$\'in yanında izlemek aydınlatıcıdır. f nerede düzse $f\'$ orada sıfırdır; f nerede dik yükseliyorsa $f\'$ orada büyüktür; f nerede düşüyorsa $f\'$ orada negatiftir.</p>'

/* --- Plotly: Slope Function TR --- */
+ '<div id="plot-slope-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];var yp=[];for(var i=-30;i<=30;i++){var x=i/10;xv.push(x);yv.push(x*x);yp.push(2*x);}'
+ 'var curve={x:xv,y:yv,mode:"lines",name:"f(x) = x²",line:{color:"#c8a96e",width:2.5},yaxis:"y"};'
+ 'var deriv={x:xv,y:yp,mode:"lines",name:"f\'(x) = 2x",line:{color:"#f87171",width:2.5},yaxis:"y2"};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,3.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-1,10],title:"f(x)",side:"left",titlefont:{color:"#c8a96e"},tickfont:{color:"#c8a96e"}},yaxis2:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-7,7],title:"f\'(x)",side:"right",overlaying:"y",titlefont:{color:"#f87171"},tickfont:{color:"#f87171"}},margin:{t:30,r:60,b:50,l:60},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.18}};'
+ 'Plotly.newPlot("plot-slope-tr",[curve,deriv],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> Altın = $f(x) = x^2$ (parabol). Kırmızı = $f\'(x) = 2x$ (türevi). Parabolün düz olduğu yerde (x = 0) türev sıfırdır. Parabolün dik yükseldiği yerde (x = 3) türev büyüktür (6). Parabolün düştüğü yerde (x < 0) türev negatiftir.</div></div>'

/* ============================================================
   BÖLÜM 9: Türevlenebilirlik ve Süreklilik
   ============================================================ */
+ '<h2 class="l-title">9. Türevlenebilirlik ve Süreklilik</h2>'

+ '<div class="calc-highlight"><strong>Günlük hayattan bir görüntü:</strong> Sürekli bir grafiği kâğıttan kaleminizi kaldırmadan çizebilirsiniz. Türevlenebilir bir grafiği kaleminizi kaldırmadan <em>ve</em> hiçbir keskin köşe yapmadan çizebilmelisiniz — yerel olarak pürüzsüz olmalıdır. Her türevlenebilir fonksiyon süreklidir, ama her sürekli fonksiyon türevlenebilir değildir.</div>'

+ '<p class="l-text">Bir f fonksiyonu, $f\'(a)$\'yı tanımlayan limit sonlu bir reel sayı olarak var ise <strong>x = a\'da türevlenebilir</strong>dir. İmplikasyon zinciri şudur:</p>'

+ '<div class="calc-formula"><div class="formula-main">$$a\\text{\'da türevlenebilir} \\;\\implies\\; a\\text{\'da sürekli} \\;\\implies\\; \\lim_{x \\to a} f(x) \\text{ vardır}$$</div><div class="formula-sub">Oklar yalnızca tek yönlü işler. Sürekli bir fonksiyon yine de türevlenemez olabilir.</div></div>'

+ '<p class="l-text"><strong>Türev nerelerde yoktur?</strong> Üç klasik durum:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Keskin köşe</div><div class="card-body">x = 0\'da $f(x) = |x|$. Sol eğim −1, sağ eğim +1. Uyuşmazlar, dolayısıyla $f\'(0)$ yoktur. Grafik bir V oluşturur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dikey teğet</div><div class="card-body">x = 0\'da $f(x) = x^{1/3}$. Teğet doğru dikeydir (sonsuz eğim), o hâlde fark bölümü ıraksaktır. Fonksiyon süreklidir, ama $f\'(0)$ bir reel sayı olarak yoktur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sıçrama süreksizliği</div><div class="card-body">x = 0\'da bir değerden başka bir değere sıçrayan basamak fonksiyonu. Sürekli bile değil, dolayısıyla kesinlikle türevlenemez.</div></div>'
+ '</div>'

/* --- Plotly: |x| TR --- */
+ '<div id="plot-nodiff-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var xv=[];var yv=[];for(var i=-30;i<=30;i++){var x=i/10;xv.push(x);yv.push(Math.abs(x));}'
+ 'var abs_fn={x:xv,y:yv,mode:"lines",name:"f(x) = |x|",line:{color:"#c8a96e",width:2.5}};'
+ 'var corner={x:[0],y:[0],mode:"markers",name:"köşe: türev yok",marker:{size:12,color:"#f87171",symbol:"x"}};'
+ 'var left_t={x:[-3,0],y:[3,0],mode:"lines",name:"Sol eğim = -1",line:{color:"#4ecdc4",width:2,dash:"dash"}};'
+ 'var right_t={x:[0,3],y:[0,3],mode:"lines",name:"Sağ eğim = +1",line:{color:"#a78bfa",width:2,dash:"dash"}};'
+ 'var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-3.5,3.5],title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",range:[-0.5,4],title:"f(x)"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},orientation:"h",x:0.5,xanchor:"center",y:-0.22}};'
+ 'Plotly.newPlot("plot-nodiff-tr",[abs_fn,corner,left_t,right_t],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Bu grafik neyi gösteriyor:</strong> f(x) = |x| bir V oluşturur. x = 0\'da sol teğetin eğimi −1 (turkuaz), sağ teğetinki +1 (mor). Sol ve sağ eğimler uyuşmadığından $f\'(0)$ yoktur. Fonksiyon yine de orada süreklidir.</div></div>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (0\'DA |x|)</div><div class="example-body"><strong>f(x) = |x|\'in x = 0\'da sürekli ama türevlenebilir olmadığını gösteriniz.</strong><br><br><em>Süreklilik.</em> x, 0\'a her iki taraftan yakın iken $|x| \\to 0 = f(0)$. O hâlde $\\lim_{x \\to 0} |x| = 0 = f(0)$ — süreklidir.<br><br><em>Türevlenebilirlik.</em> 0\'daki tek yanlı fark bölümlerini hesaplayalım:<br>Sağdan: h > 0 için $\\dfrac{|0 + h| - 0}{h} = \\dfrac{h}{h} = 1$, dolayısıyla $\\lim_{h \\to 0^+} = 1$.<br>Soldan: h < 0 için $\\dfrac{|0 + h| - 0}{h} = \\dfrac{-h}{h} = -1$, dolayısıyla $\\lim_{h \\to 0^-} = -1$.<br><br>İki tek yanlı limit uyuşmadığından $f\'(0)$\'ı tanımlayan limit yoktur.</div></div>'

/* ============================================================
   BÖLÜM 10: Klasik Uygulamalar
   ============================================================ */
+ '<h2 class="l-title">10. Klasik Uygulamalar</h2>'

+ '<p class="l-text">Türevler klasik matematik, fizik ve iktisadın her yerinde karşımıza çıkar. Kısa bir tur:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Fizik: hız ve ivme</div><div class="card-body">$s(t)$ konum, t zaman ise, $v(t) = s\'(t)$ hız ve $a(t) = v\'(t) = s\'\'(t)$ ivmedir.</div></div>'
+ '<div class="calc-card"><div class="card-title">İktisat: marjinal maliyet</div><div class="card-body">$C(q)$, q birim üretmenin maliyetiyse, $C\'(q)$ <em>marjinal maliyet</em>tir — yaklaşık olarak bir birim daha üretmenin ek maliyeti.</div></div>'
+ '<div class="calc-card"><div class="card-title">Biyoloji: büyüme hızı</div><div class="card-body">$P(t)$ t zamanındaki nüfussa, $P\'(t)$ anlık büyüme hızıdır (birim zamandaki birey sayısı).</div></div>'
+ '<div class="calc-card"><div class="card-title">Geometri: teğet doğruları</div><div class="card-body">Türev bir eğrinin teğetinin eğimini verir; tüm doğrusal yaklaşımın ve Taylor serisinin temelidir.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Uygulama 1 — Serbest düşme.</strong> 45 metrelik bir uçurumdan durağan hâlden bir taş bırakılıyor. Hava sürtünmesi ihmal edilirse klasik mekanik bize $s(t) = 45 - 4.9\\,t^2$ metre konum fonksiyonunu verir; t saniyedir (burada $g \\approx 9.8$ m/s²).</p>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (HIZ VE İVME)</div><div class="example-body"><strong>Düşen taşın hızını ve ivmesini bulunuz.</strong><br><br>Hız: $v(t) = s\'(t)$. $\\frac{d}{dt}(t^2) = 2t$ sonucunu kullanarak:<br>$v(t) = 0 - 4.9 \\cdot 2t = -9.8\\,t$ &nbsp;m/s.<br>(Bizim koordinatlarda taş aşağıya hareket ettiği için negatif.)<br><br>İvme: $a(t) = v\'(t)$. $-9.8\\,t$\'nin türevi sabit $-9.8$ m/s²\'dir.<br><br><strong>Yorum.</strong> 2 saniye sonra taş $|v(2)| = 19.6$ m/s hızla iniyor. İvme sabit olarak aşağıya doğru 9.8 m/s² — Galileo\'nun deneysel olarak çıkardığı gibi, yerçekimi.</div></div>'

+ '<p class="l-text"><strong>Uygulama 2 — Marjinal maliyet.</strong> Küçük bir atölyenin günde q adet ürettiğindeki toplam maliyet fonksiyonu $C(q) = 0.01\\,q^3 - 0.6\\,q^2 + 30\\,q + 200$ (TL) olsun.</p>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (MARJİNAL MALİYET)</div><div class="example-body"><strong>q = 20\'de marjinal maliyeti bulunuz.</strong><br><br>$C\'(q) = 0.03\\,q^2 - 1.2\\,q + 30$.<br>q = 20\'de: $C\'(20) = 0.03 \\cdot 400 - 1.2 \\cdot 20 + 30 = 12 - 24 + 30 = 18$ TL/birim.<br><br><strong>Yorum.</strong> Atölye zaten günde 20 adet üretirken, bir adet daha üretmek günlük maliyete yaklaşık 18 TL ekler.</div></div>'

+ '<p class="l-text"><strong>Uygulama 3 — Türev ile optimizasyon.</strong> Klasik matematiğin en kullanışlı olgularından biri: türevlenebilir bir fonksiyonun yerel maksimum ya da minimumunda $f\'(x) = 0$\'dır. O hâlde uç noktaları bulmak için $f\'(x) = 0$ denklemini çözer ve adayları test ederiz.</p>'

+ '<div class="calc-example"><div class="example-label">ÇÖZÜLMÜŞ ÖRNEK (BİR ALANI MAKSİMİZE ETMEK)</div><div class="example-body"><strong>100 m teliniz var ve uzun bir duvara yaslı dikdörtgen bir bahçe çevirmek istiyorsunuz (duvar tarafına tel gerekmez). Alanı maksimize edin.</strong><br><br>Duvara dik kenarı x olarak alın. O zaman duvar boyunca uzanan kenar $100 - 2x$, alan ise<br>$A(x) = x \\cdot (100 - 2x) = 100x - 2x^2$, $0 \\leq x \\leq 50$ için.<br><br>Türev: $A\'(x) = 100 - 4x$. $A\'(x) = 0$ olsun: $x = 25$.<br><br>Maksimum olduğunu doğrulayın: $A\'\'(x) = -4 < 0$, kritik nokta bir maksimumdur (yukarıya doğru konkav).<br><br>Optimal dikdörtgen 25 m × 50 m, alan = <strong>1250 m²</strong>.</div></div>'

/* ============================================================
   BÖLÜM 11: Klasik Alıştırmalar (çözümlü)
   ============================================================ */
+ '<h2 class="l-title">11. Klasik Alıştırmalar</h2>'

+ '<p class="l-text">Dersin her aşamasını birleştiren dört çözümlü problem. Önce kendiniz deneyin, sonra çözüme bakın.</p>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 1 — ÇARPANLARA AYIRARAK LİMİT</div><div class="example-body"><strong>$\\lim_{x \\to 1} \\dfrac{x^3 - 1}{x - 1}$\'i hesaplayınız.</strong><br><br><em>Çözüm.</em> Doğrudan yerine koymak 0/0 verir. Payı $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ özdeşliğiyle çarpanlara ayıralım:<br><br>$x^3 - 1 = (x - 1)(x^2 + x + 1)$.<br><br>O hâlde x ≠ 1 için $\\dfrac{x^3 - 1}{x - 1} = x^2 + x + 1$.<br><br>Limit alalım: $\\lim_{x \\to 1} (x^2 + x + 1) = 1 + 1 + 1 = \\mathbf{3}$.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 2 — TANIMDAN TÜREV</div><div class="example-body"><strong>x > 0 için $f(x) = \\sqrt{x}$\'in f\'(x)\'ini limit tanımıyla bulunuz.</strong><br><br><em>Çözüm.</em> Fark bölümü:<br>$\\dfrac{\\sqrt{x + h} - \\sqrt{x}}{h}$.<br><br>Eşleniği $\\sqrt{x+h} + \\sqrt{x}$ ile pay ve paydayı çarpalım:<br>$\\dfrac{(\\sqrt{x+h} - \\sqrt{x})(\\sqrt{x+h} + \\sqrt{x})}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{(x + h) - x}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{h}{h\\,(\\sqrt{x+h} + \\sqrt{x})} = \\dfrac{1}{\\sqrt{x+h} + \\sqrt{x}}$.<br><br>Şimdi h → 0 limitini alın:<br>$f\'(x) = \\dfrac{1}{\\sqrt{x} + \\sqrt{x}} = \\dfrac{1}{2\\sqrt{x}}$.<br><br>Dolayısıyla $\\mathbf{f\'(x) = \\dfrac{1}{2\\sqrt{x}}}$. Hızlı sınama: x = 4\'te 1/4 verir; bu $\\sqrt{x}$\'in o noktadaki geometrik eğimine uyar.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 3 — TEĞET DOĞRUSU</div><div class="example-body"><strong>$f(x) = x^3 - 3x$\'in x = 2 noktasındaki teğet doğrusunu bulunuz.</strong><br><br><em>Çözüm.</em> Önce noktayı bulun. $f(2) = 8 - 6 = 2$, o hâlde nokta $(2, 2)$.<br><br>Eğimi bulun. Limit tanımıyla (ya da $x^2$\'de yapılan aynı yolla doğrulanabilecek kuvvet kuralıyla): $f\'(x) = 3x^2 - 3$. x = 2\'de: $f\'(2) = 3 \\cdot 4 - 3 = 9$.<br><br>Teğet doğrusu (nokta-eğim biçiminde): $y - 2 = 9(x - 2)$, yani $\\mathbf{y = 9x - 16}$.<br><br><em>Sınama.</em> x = 2\'de teğet $y = 9 \\cdot 2 - 16 = 2$ verir; nokta ile örtüşür.</div></div>'

+ '<div class="calc-example"><div class="example-label">ALIŞTIRMA 4 — TÜREVLE MAKS./MİN.</div><div class="example-body"><strong>Bir çiftçi, iki paralel iç bölmesi olan (yani dış dikdörtgene ek olarak üç iç duvar) dikdörtgen bir ağıl inşa etmek istiyor. Eldeki toplam tel uzunluğu 240 m. Alanı maksimize eden dikdörtgen boyutları nedir?</strong><br><br><em>Çözüm.</em> Dikdörtgenin bölmelere dik kenarı x, uzun kenarı y olsun. Toplam tel, çevre artı uzunluğu x olan iki ek bölme duvarıdır: $2x + 2y + 2x = 4x + 2y = 240$, o hâlde $y = 120 - 2x$, $0 \\leq x \\leq 60$ için geçerlidir.<br><br>Alan $A(x) = x \\cdot y = x(120 - 2x) = 120x - 2x^2$.<br><br>Türev: $A\'(x) = 120 - 4x$. Sıfıra eşitle: $x = 30$.<br><br>İkinci türev sınaması: $A\'\'(x) = -4 < 0$, dolayısıyla x = 30 bir maksimumdur.<br><br>Sonra $y = 120 - 60 = 60$. Maksimize eden dikdörtgen <strong>30 m × 60 m</strong>, alan $\\mathbf{1800\\text{ m}^2}$.</div></div>'

+ '<div class="l-warn"><strong>Sıradaki ders.</strong> Ders 2\'de türev için kısayol kuralları geliştiriyoruz — kuvvet kuralı, toplam kuralı, çarpım kuralı, bölüm kuralı ve zincir kuralı — böylece her yeni fonksiyon için limit tanımına geri dönmemiz gerekmeyecek. Oradan itibaren türev hesaplama rutinleşir ve dikkatimizi türevlerin geldikleri fonksiyonlar hakkında bize neler <em>söylediğine</em> verebiliriz.</div>'

};
