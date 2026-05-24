window.LISE_MAT_L84 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A triangle has only three sides and three angles, yet hidden inside it are an astonishing number of segments that obey beautiful numerical laws.</strong> Drop a perpendicular from the right-angle vertex to the hypotenuse and the geometric mean appears out of nowhere. Join a vertex to the midpoint of the opposite side and you produce a median whose length is fixed by the triangle's three sides. The area itself can be written in five different ways, all giving the same number. Triangle metric relations is the toolbox you use whenever a problem asks for a length that is not one of the original sides — a height, a median, an angle bisector, an inradius, a circumradius.</p>

<p class="l-text">In this lesson you will master the Euclidean (altitude-on-hypotenuse) relations for right triangles, the median length formula known as Apollonius' theorem, the angle bisector length formula, Stewart's theorem (a unifying relation), and the full family of area formulas — including Heron's formula, which computes the area from the three sides alone. You will leave with enough machinery to crack almost any geometry problem at high-school level without trigonometry.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the Euclidean theorems in a right triangle: $h^2 = pq$, $a^2 = cp$, $b^2 = cq$, $c^2 = a^2 + b^2$</li>
<li>Define a median; locate the centroid; use the 2:1 ratio that the centroid imposes on each median</li>
<li>Compute the length of a median using Apollonius' theorem: $m_c^2 = (2a^2 + 2b^2 - c^2)/4$</li>
<li>Use the angle bisector length formula and Stewart's theorem to handle cevians</li>
<li>Switch fluently between five area formulas: $\\tfrac{1}{2}bh$, $\\tfrac{1}{2}ab\\sin C$, $abc/(4R)$, $rs$, and Heron's formula</li>
<li>Solve mixed problems combining altitude, median, area, and the inradius/circumradius</li>
</ul>
</div>

<h2 class="lesson-title">1. The Right-Triangle Altitude Theorem</h2>

<div class="calc-highlight"><strong>Start with a right triangle</strong> with legs $a$, $b$ and hypotenuse $c$. Drop a perpendicular from the right-angle vertex $C$ onto the hypotenuse, hitting it at a point $H$. This altitude $h$ splits the hypotenuse into two segments: $p$ on the side of vertex $A$ and $q$ on the side of vertex $B$, with $p + q = c$. From this single picture, four classical relations fall out for free.</div>

<p class="l-text">The picture is the famous "three similar triangles" configuration: $\\triangle ACH$, $\\triangle CBH$, and the original $\\triangle ABC$ are all similar to one another by AA (they all share the right angle, and each pair shares one acute angle of the original triangle). Pairing them up and writing the ratios produces the four formulas below.</p>

<div class="calc-formula"><div class="formula-label">EUCLIDEAN RELATIONS (RIGHT TRIANGLE)</div><div class="formula-main">$$h^2 \\;=\\; p \\cdot q \\qquad a^2 \\;=\\; c \\cdot p \\qquad b^2 \\;=\\; c \\cdot q \\qquad c^2 \\;=\\; a^2 + b^2$$</div><div class="formula-sub">$h$ is the altitude from the right-angle vertex to the hypotenuse $c$; the foot of the altitude divides $c$ into $p$ (adjacent to side $a$) and $q$ (adjacent to side $b$). The last formula is Pythagoras itself.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$h^2 = pq$</div><div class="card-body">The altitude is the geometric mean of the two pieces of the hypotenuse. Same as saying $h$ is the mean proportional between $p$ and $q$.</div></div>
<div class="calc-card"><div class="card-title">$a^2 = cp$</div><div class="card-body">Each leg squared equals the hypotenuse times its OWN projection (the piece of the hypotenuse adjacent to that leg).</div></div>
<div class="calc-card"><div class="card-title">$b^2 = cq$</div><div class="card-body">Symmetric statement for the other leg. Add $a^2 + b^2 = c(p+q) = c \\cdot c = c^2$ — Pythagoras drops out instantly.</div></div>
</div>

<div class="calc-graph"><div id="plot-l84-euclid-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a right triangle with the altitude from the right-angle vertex dropped to the hypotenuse. The hypotenuse is split into segments $p$ (orange) and $q$ (green). The altitude $h$ (red, dashed) is the geometric mean of $p$ and $q$. The three similar right triangles share one acute angle each, giving the four Euclidean identities for free.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=10,By=0;var Cx=3.6,Cy=4.8;
var Hx=3.6,Hy=0;
var hyp={x:[Ax,Bx],y:[Ay,By],mode:'lines',name:'hypotenuse c',line:{color:'#3b82f6',width:3}};
var legA={x:[Ax,Cx],y:[Ay,Cy],mode:'lines',name:'leg b',line:{color:'#3b82f6',width:3}};
var legB={x:[Bx,Cx],y:[By,Cy],mode:'lines',name:'leg a',line:{color:'#3b82f6',width:3}};
var alt={x:[Cx,Hx],y:[Cy,Hy],mode:'lines',name:'altitude h',line:{color:'#ef4444',width:2.5,dash:'dash'}};
var segP={x:[Ax,Hx],y:[-0.25,-0.25],mode:'lines',name:'p',line:{color:'#f59e0b',width:5}};
var segQ={x:[Hx,Bx],y:[-0.25,-0.25],mode:'lines',name:'q',line:{color:'#22c55e',width:5}};
var rightAngle={x:[Cx-0.32,Cx-0.32,Cx],y:[Cy-0.4,Cy-0.08,Cy-0.08],mode:'lines',name:'90°',line:{color:'rgba(255,255,255,0.5)',width:1.4},showlegend:false};
var rightAngleH={x:[Hx-0.3,Hx-0.3,Hx],y:[0,0.3,0.3],mode:'lines',name:'90°',line:{color:'rgba(255,255,255,0.5)',width:1.4},showlegend:false};
var labs={x:[Ax-0.3,Bx+0.3,Cx,Hx,Ax+Hx/2,Hx+(Bx-Hx)/2,Cx-0.7,Cx+0.5,(Cx+Bx)/2+0.2,(Cx+Ax)/2-0.4],y:[Ay-0.3,By-0.3,Cy+0.35,-0.7,-0.7,-0.7,Cy/2,Cy/2,(Cy+By)/2,(Cy+Ay)/2],mode:'text',name:'labels',text:['A','B','C','H','p','q','h','','a','b'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-euclid-en',[hyp,legA,legB,alt,segP,segQ,rightAngle,rightAngleH,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Altitude in a 6-8-10 triangle</div><div class="example-body">A right triangle has legs $a = 6$, $b = 8$, hypotenuse $c = 10$. Find the altitude $h$ from the right angle to the hypotenuse, and the two segments $p$ and $q$.<br><br><strong>Method 1 — area.</strong> Area $= \\tfrac{1}{2} \\cdot 6 \\cdot 8 = 24$. But the area is also $\\tfrac{1}{2} \\cdot c \\cdot h = 5h$. So $5h = 24 \\implies h = 4.8$.<br><br><strong>Method 2 — Euclidean.</strong> $a^2 = cp \\implies 36 = 10p \\implies p = 3.6$. Similarly $b^2 = cq \\implies 64 = 10q \\implies q = 6.4$. Check: $p+q = 10$ ✓ and $h^2 = pq = 3.6 \\cdot 6.4 = 23.04 \\implies h = 4.8$ ✓.<br><br>Both methods give $\\mathbf{h = 4.8}$, $\\mathbf{p = 3.6}$, $\\mathbf{q = 6.4}$.</div></div>

<div class="l-note"><strong>Why the geometric mean?</strong> In the three-similar-triangles picture, the small triangle on the $p$ side has legs $p$ and $h$, with $h/p$ equal to the ratio of legs in the original. The small triangle on the $q$ side has legs $h$ and $q$. Matching ratios gives $h/p = q/h$, i.e. $h^2 = pq$. The altitude is sandwiched as the geometric mean between the two hypotenuse pieces.</div>

<h2 class="lesson-title">2. Medians and the Centroid</h2>

<div class="calc-highlight"><strong>A median of a triangle</strong> is a segment from a vertex to the midpoint of the opposite side. Every triangle has three medians, one from each vertex. Astonishingly, the three medians always meet at a single point called the <em>centroid</em> $G$, and the centroid divides each median in a fixed 2:1 ratio.</div>

<p class="l-text">Notation. Let $\\triangle ABC$ have side lengths $a = |BC|$, $b = |CA|$, $c = |AB|$. The median from vertex $A$ goes to the midpoint $M_a$ of side $BC$; call its length $m_a$. Similarly $m_b$ goes from $B$ to the midpoint of $CA$, and $m_c$ from $C$ to the midpoint of $AB$.</p>

<div class="calc-formula"><div class="formula-label">THE CENTROID DIVIDES EACH MEDIAN 2:1</div><div class="formula-main">$$|AG| : |GM_a| \\;=\\; 2 : 1 \\qquad\\text{i.e.}\\qquad |AG| \\;=\\; \\frac{2}{3}\\,m_a, \\qquad |GM_a| \\;=\\; \\frac{1}{3}\\,m_a$$</div><div class="formula-sub">The centroid sits two-thirds of the way from any vertex to the opposite midpoint, and one-third of the way back. Same 2:1 split happens on all three medians.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Physical meaning</div><div class="card-body">The centroid is the centre of mass of a uniformly dense triangular plate. Balance the plate on a pin at $G$ and it stays level.</div></div>
<div class="calc-card"><div class="card-title">Coordinate formula</div><div class="card-body">If $A = (x_1,y_1)$, $B = (x_2,y_2)$, $C = (x_3,y_3)$, then $G = \\left(\\dfrac{x_1+x_2+x_3}{3},\\;\\dfrac{y_1+y_2+y_3}{3}\\right)$ — just the average.</div></div>
<div class="calc-card"><div class="card-title">Six small triangles</div><div class="card-body">The three medians cut the triangle into six smaller triangles of equal area. Each has area equal to one-sixth of the whole.</div></div>
</div>

<div class="calc-graph"><div id="plot-l84-medians-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> a triangle $\\triangle ABC$ with all three medians (orange) meeting at the centroid $G$ (red dot). Each median is split 2:1 — the longer segment (from vertex to $G$) is twice the shorter one (from $G$ to the midpoint). Midpoints of the sides are shown as smaller markers.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=8,By=0;var Cx=2.5,Cy=5;
var MaX=(Bx+Cx)/2,MaY=(By+Cy)/2;
var MbX=(Cx+Ax)/2,MbY=(Cy+Ay)/2;
var McX=(Ax+Bx)/2,McY=(Ay+By)/2;
var Gx=(Ax+Bx+Cx)/3,Gy=(Ay+By+Cy)/3;
var tri={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var med1={x:[Ax,MaX],y:[Ay,MaY],mode:'lines',name:'median from A',line:{color:'#f59e0b',width:2}};
var med2={x:[Bx,MbX],y:[By,MbY],mode:'lines',name:'median from B',line:{color:'#f59e0b',width:2}};
var med3={x:[Cx,McX],y:[Cy,McY],mode:'lines',name:'median from C',line:{color:'#f59e0b',width:2}};
var midpts={x:[MaX,MbX,McX],y:[MaY,MbY,McY],mode:'markers',name:'midpoints',marker:{color:'#22c55e',size:9}};
var centroid={x:[Gx],y:[Gy],mode:'markers',name:'centroid G',marker:{color:'#ef4444',size:13,symbol:'star'}};
var labs={x:[Ax-0.3,Bx+0.3,Cx,MaX+0.3,MbX-0.3,McX,Gx+0.3],y:[Ay-0.3,By-0.3,Cy+0.3,MaY,MbY,McY-0.3,Gy+0.3],mode:'text',name:'labels',text:['A','B','C','Ma','Mb','Mc','G'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-medians-en',[tri,med1,med2,med3,midpts,centroid,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Median Length — Apollonius' Theorem</h2>

<div class="calc-highlight"><strong>How long is each median?</strong> Apollonius of Perga (3rd century BCE) gave a closed formula for the length of a median in terms of the three sides of the triangle. No angles needed.</div>

<div class="calc-formula"><div class="formula-label">APOLLONIUS' MEDIAN LENGTH FORMULA</div><div class="formula-main">$$m_a^2 \\;=\\; \\frac{2b^2 + 2c^2 - a^2}{4} \\qquad m_b^2 \\;=\\; \\frac{2a^2 + 2c^2 - b^2}{4} \\qquad m_c^2 \\;=\\; \\frac{2a^2 + 2b^2 - c^2}{4}$$</div><div class="formula-sub">The square of the median from a vertex equals "twice the squares of the two adjacent sides, minus the square of the opposite side, all divided by 4." Pattern: $2 \\cdot (\\text{adjacent}^2 + \\text{adjacent}^2) - (\\text{opposite}^2)$, divided by 4.</div></div>

<p class="l-text"><strong>How does the formula come about?</strong> Place the triangle with $B = (-a/2, 0)$ and $C = (a/2, 0)$, so the midpoint of $BC$ is the origin. Let $A = (x_A, y_A)$. Then the squared distance from $A$ to $B$ is $c^2 = (x_A + a/2)^2 + y_A^2$, the squared distance from $A$ to $C$ is $b^2 = (x_A - a/2)^2 + y_A^2$, and the median length squared is $m_a^2 = x_A^2 + y_A^2$. Adding $b^2 + c^2$ and rearranging gives Apollonius' formula. The proof is one line of algebra.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Median in a 5-12-13 right triangle</div><div class="example-body">Find the median $m_c$ from the right-angle vertex $C$ to the hypotenuse $AB$ in the right triangle with $a = 5$, $b = 12$, $c = 13$.<br><br>Apollonius gives $m_c^2 = \\dfrac{2 a^2 + 2 b^2 - c^2}{4} = \\dfrac{2(25) + 2(144) - 169}{4} = \\dfrac{50 + 288 - 169}{4} = \\dfrac{169}{4}$.<br><br>So $m_c = \\dfrac{13}{2} = \\mathbf{6.5}$.<br><br><strong>Sanity check.</strong> In any right triangle, the median from the right angle to the hypotenuse equals half the hypotenuse. Indeed $m_c = c/2 = 13/2 = 6.5$ ✓. This is a famous property worth memorising on its own.</div></div>

<div class="l-note"><strong>Right-triangle median fact.</strong> If $\\angle C = 90^\\circ$, then $m_c = c/2$. Equivalently, the right-angle vertex sits on a circle whose diameter is the hypotenuse (Thales' circle theorem). The centre of that circle is the midpoint of the hypotenuse, and the radius is half the hypotenuse — which is exactly $m_c$.</div>

<h2 class="lesson-title">4. The Angle Bisector Length Formula</h2>

<div class="calc-highlight"><strong>If $AD$ is the internal angle bisector of $\\angle A$ in $\\triangle ABC$ with $D$ on $BC$,</strong> the length of $AD$ depends only on the three sides of the triangle. It is a slightly fancier cousin of the median formula.</div>

<div class="calc-formula"><div class="formula-label">ANGLE BISECTOR LENGTH</div><div class="formula-main">$$t_a^2 \\;=\\; b\\,c \\;-\\; |BD| \\cdot |DC|$$</div><div class="formula-sub">where $t_a$ is the bisector length and $|BD|$, $|DC|$ are the two pieces of side $a$ cut off by the bisector. From the bisector theorem we know $|BD| = \\dfrac{ac}{b+c}$ and $|DC| = \\dfrac{ab}{b+c}$.</div></div>

<p class="l-text">Substituting the bisector-theorem pieces gives the closed-form version, sometimes called the <em>Stewart-style</em> angle bisector formula:</p>

<div class="calc-formula"><div class="formula-label">ANGLE BISECTOR — CLOSED FORM</div><div class="formula-main">$$t_a^2 \\;=\\; b\\,c\\left[1 - \\left(\\frac{a}{b+c}\\right)^2\\right] \\;=\\; \\frac{b\\,c\\,\\big[(b+c)^2 - a^2\\big]}{(b+c)^2}$$</div><div class="formula-sub">All quantities on the right are side lengths of the triangle. No angles, no projections — just $a$, $b$, $c$.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Bisector length</div><div class="example-body">In $\\triangle ABC$ with $a = 8$, $b = 5$, $c = 7$, find the length of the bisector from $A$.<br><br>By the bisector theorem, $|BD| = \\dfrac{ac}{b+c} = \\dfrac{8 \\cdot 7}{12} = \\dfrac{56}{12} = \\dfrac{14}{3}$ and $|DC| = \\dfrac{ab}{b+c} = \\dfrac{8 \\cdot 5}{12} = \\dfrac{40}{12} = \\dfrac{10}{3}$.<br><br>Then $t_a^2 = b c - |BD||DC| = 5 \\cdot 7 - \\dfrac{14}{3} \\cdot \\dfrac{10}{3} = 35 - \\dfrac{140}{9} = \\dfrac{315 - 140}{9} = \\dfrac{175}{9}$.<br><br>So $t_a = \\dfrac{\\sqrt{175}}{3} = \\dfrac{5\\sqrt{7}}{3} \\approx \\mathbf{4.41}$.</div></div>

<h2 class="lesson-title">5. Stewart's Theorem (Optional, Unifying)</h2>

<div class="calc-highlight"><strong>Both the median formula and the bisector formula are special cases of a single more general identity</strong> due to the Scottish mathematician Matthew Stewart (1746). It deals with an arbitrary <em>cevian</em> — any segment from a vertex to a point on the opposite side.</div>

<div class="calc-formula"><div class="formula-label">STEWART'S THEOREM</div><div class="formula-main">$$b^2 m + c^2 n - d^2 a \\;=\\; a m n$$</div><div class="formula-sub">A cevian of length $d$ from vertex $A$ meets side $a = BC$ at a point that splits it into pieces $m$ (next to $C$) and $n$ (next to $B$), with $m + n = a$. Mnemonic ("<em>a man and his dad put a bomb in the sink</em>"): $a(d^2 + mn) = b^2 m + c^2 n$.</div></div>

<p class="l-text"><strong>Why it matters.</strong> Set $m = n = a/2$ and Stewart's theorem reduces to Apollonius. Set $m/n = b/c$ (the bisector ratio) and it reduces to the angle bisector formula. One identity, two famous specialisations — plus a way to compute the length of any cevian whose foot you know on the opposite side.</p>

<h2 class="lesson-title">6. The Five Area Formulas</h2>

<div class="calc-highlight"><strong>The area of a triangle can be written in at least five equivalent ways</strong>, each useful when a different set of pieces is known. Memorise the table.</div>

<div class="calc-formula"><div class="formula-label">FIVE FACES OF THE TRIANGLE AREA</div><div class="formula-main">$$\\text{Area} \\;=\\; \\tfrac{1}{2}\\,\\text{base} \\cdot \\text{height} \\;=\\; \\tfrac{1}{2}\\,a\\,b\\,\\sin C \\;=\\; \\frac{a\\,b\\,c}{4R} \\;=\\; r\\,s \\;=\\; \\sqrt{s(s-a)(s-b)(s-c)}$$</div><div class="formula-sub">Here $a, b, c$ are the sides; $C$ is the angle opposite side $c$; $R$ is the circumradius; $r$ is the inradius; $s = (a+b+c)/2$ is the semi-perimeter; the last is Heron's formula.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\tfrac{1}{2}bh$</div><div class="card-body">The everyday formula: half base times height. Use when you know a side and the altitude dropped onto it.</div></div>
<div class="calc-card"><div class="card-title">$\\tfrac{1}{2}ab\\sin C$</div><div class="card-body">Trigonometric form. Use when you know two sides and the angle between them (SAS data).</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{abc}{4R}$</div><div class="card-body">Circumradius form. Use when you know all three sides and want to find $R$, or vice versa.</div></div>
<div class="calc-card"><div class="card-title">$r\\,s$</div><div class="card-body">Inradius times semi-perimeter. Use when the incircle is in play.</div></div>
<div class="calc-card"><div class="card-title">Heron's</div><div class="card-body">$\\sqrt{s(s-a)(s-b)(s-c)}$. Use when you know only the three sides and want the area in one shot.</div></div>
</div>

<p class="l-text"><strong>Why are they all equivalent?</strong> Because they all give the area of the same triangle. Pick any two of them and you get an identity. For example, equating $\\tfrac{1}{2}ab\\sin C = \\tfrac{abc}{4R}$ gives the <em>law of sines</em>: $\\dfrac{c}{\\sin C} = 2R$. Equating $rs = \\sqrt{s(s-a)(s-b)(s-c)}$ gives a closed expression for $r$ in terms of sides only.</p>

<div class="calc-formula"><div class="formula-label">USEFUL CONSEQUENCES</div><div class="formula-main">$$R \\;=\\; \\frac{a\\,b\\,c}{4 \\cdot \\text{Area}} \\qquad r \\;=\\; \\frac{\\text{Area}}{s} \\qquad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$</div><div class="formula-sub">Three formulas you should be able to reproduce on the spot. The first two solve for the radii of the circumscribed and inscribed circles; the third is the law of sines.</div></div>

<h2 class="lesson-title">7. Heron's Formula in Action</h2>

<div class="calc-highlight"><strong>Heron's formula</strong> (1st century CE) is the answer to a question Euclid never quite asked directly: <em>given only the three side lengths of a triangle, what is its area?</em> No angle measurement, no altitude, no trig — just the three sides.</div>

<div class="calc-formula"><div class="formula-label">HERON'S FORMULA</div><div class="formula-main">$$\\text{Area} \\;=\\; \\sqrt{s(s-a)(s-b)(s-c)} \\qquad\\text{where}\\qquad s \\;=\\; \\frac{a+b+c}{2}$$</div><div class="formula-sub">$s$ is the semi-perimeter. Each of $s-a, s-b, s-c$ is positive iff the three sides actually form a triangle (triangle inequality).</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE — Heron's formula on a 5-6-7 triangle</div><div class="example-body">Find the area of the triangle with sides $a = 5$, $b = 6$, $c = 7$.<br><br>Semi-perimeter: $s = \\dfrac{5+6+7}{2} = 9$.<br><br>Differences: $s-a = 4$, $s-b = 3$, $s-c = 2$.<br><br>Area $= \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = 6\\sqrt{6} \\approx \\mathbf{14.70}$.<br><br><strong>Cross-check with another formula.</strong> The altitude to side $c$ is $h_c = \\dfrac{2 \\cdot \\text{Area}}{c} = \\dfrac{12\\sqrt{6}}{7} \\approx 4.20$. So $\\tfrac{1}{2} \\cdot 7 \\cdot 4.20 = 14.70$ ✓.</div></div>

<div class="calc-graph"><div id="plot-l84-heron-en" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the 5-6-7 triangle drawn to scale. Side lengths are labelled; the altitude from vertex $C$ to side $c$ (the side of length 7) is shown in red and computed to be approximately 4.20. Heron's formula gives the area as $6\\sqrt{6} \\approx 14.70$ — verifiable by $\\tfrac{1}{2} \\cdot 7 \\cdot 4.20 \\approx 14.70$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c=7;var a=5;var b=6;
var Bx=0,By=0;var Cx=c,Cy=0;
var Ax=(c*c+b*b-a*a)/(2*c);var Ay=Math.sqrt(b*b-Ax*Ax);
var hFootX=Ax,hFootY=0;
var tri={x:[Bx,Cx,Ax,Bx],y:[By,Cy,Ay,By],mode:'lines+markers',name:'triangle 5-6-7',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var alt={x:[Ax,hFootX],y:[Ay,hFootY],mode:'lines',name:'altitude h≈4.20',line:{color:'#ef4444',width:2,dash:'dash'}};
var labs={x:[Bx-0.25,Cx+0.25,Ax,(Bx+Cx)/2,(Bx+Ax)/2-0.4,(Cx+Ax)/2+0.4,Ax+0.3],y:[By-0.3,Cy-0.3,Ay+0.3,By-0.5,(By+Ay)/2,(Cy+Ay)/2,Ay/2],mode:'text',name:'labels',text:['B','C','A','c=7','b=6','a=5','h'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.2,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-heron-en',[tri,alt,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Common Errors</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">EUCLIDEAN RELATIONS</div><div class="compare-item">"$a^2 = c \\cdot q$" — wrong. The leg $a$ pairs with its OWN projection $p$, not $q$. Match the leg to the piece of the hypotenuse adjacent to it.</div><div class="compare-item">"$h^2 = p + q$" — wrong. The altitude squared is $p \\cdot q$ (geometric mean), not $p+q$ (which is just $c$).</div><div class="compare-item">Always re-draw the right triangle and label $p$, $q$, $h$ from scratch before plugging numbers in.</div></div><div class="compare-col"><div class="compare-title">MEDIAN AND BISECTOR</div><div class="compare-item">The median formula uses TWICE the squares of the two ADJACENT sides minus the OPPOSITE side, all over 4 — not the other way round.</div><div class="compare-item">The bisector length depends on $bc - mn$, but $m$ and $n$ come from the bisector theorem (not equal halves like in the median case).</div><div class="compare-item">Heron's formula needs the semi-perimeter $s = (a+b+c)/2$, NOT the perimeter $a+b+c$.</div></div></div>

<div class="l-note"><strong>Three frequent slips:</strong><br>(1) <strong>Confusing $p$ and $q$.</strong> The piece $p$ is adjacent to leg $a$; the piece $q$ is adjacent to leg $b$. Some textbooks swap the letters — always re-check the diagram before using the formula.<br>(2) <strong>Forgetting the half in $\\tfrac{1}{2}ab\\sin C$.</strong> The formula needs a factor of $\\tfrac{1}{2}$. Missing it doubles your area.<br>(3) <strong>Wrong angle in $\\tfrac{1}{2}ab\\sin C$.</strong> The angle must be the one BETWEEN the two sides $a$ and $b$ — not some other angle of the triangle.</div>

<h2 class="lesson-title">9. Worked Problems</h2>

<p class="l-text">A consolidated practice set. Cover the solution, attempt each problem, then reveal.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — Altitude to the hypotenuse</div><div class="example-body"><strong>A right triangle has legs 9 and 12. Find the altitude to the hypotenuse.</strong><br><br>Hypotenuse $c = \\sqrt{9^2 + 12^2} = \\sqrt{225} = 15$.<br><br>Area $= \\tfrac{1}{2} \\cdot 9 \\cdot 12 = 54$. Also area $= \\tfrac{1}{2} \\cdot 15 \\cdot h \\implies h = \\dfrac{108}{15} = \\mathbf{7.2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — Projections of the legs</div><div class="example-body"><strong>In the same 9-12-15 right triangle, find the segments $p$ and $q$ of the hypotenuse on each side of the altitude foot.</strong><br><br>$a^2 = cp \\implies 81 = 15p \\implies p = 5.4$. And $b^2 = cq \\implies 144 = 15q \\implies q = 9.6$. Check: $p+q = 15$ ✓, $pq = 5.4 \\cdot 9.6 = 51.84 = h^2 = 7.2^2$ ✓.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — Median in an equilateral triangle</div><div class="example-body"><strong>Find the median length in an equilateral triangle of side $a$.</strong><br><br>By Apollonius with all sides equal: $m^2 = \\dfrac{2a^2 + 2a^2 - a^2}{4} = \\dfrac{3a^2}{4}$. So $m = \\dfrac{a\\sqrt{3}}{2}$.<br><br>In an equilateral triangle medians, altitudes, and angle bisectors coincide, so this is also the altitude — the familiar $h = \\dfrac{a\\sqrt{3}}{2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — Median in a 5-12-13 right triangle revisited</div><div class="example-body"><strong>Find the median from $B$ to the midpoint of $CA$ in the 5-12-13 right triangle ($a = 5$, $b = 12$, $c = 13$, right angle at $C$).</strong><br><br>Apollonius: $m_b^2 = \\dfrac{2a^2 + 2c^2 - b^2}{4} = \\dfrac{2(25) + 2(169) - 144}{4} = \\dfrac{50 + 338 - 144}{4} = \\dfrac{244}{4} = 61$.<br><br>$m_b = \\sqrt{61} \\approx \\mathbf{7.81}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Area by Heron's formula</div><div class="example-body"><strong>Find the area of the triangle with sides 13, 14, 15.</strong><br><br>$s = 21$. $s-a = 8$, $s-b = 7$, $s-c = 6$.<br><br>Area $= \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = \\mathbf{84}$.<br><br>This is the famous "13-14-15 triangle" with integer area.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — Inradius and circumradius</div><div class="example-body"><strong>For the 13-14-15 triangle of Problem 5, find $r$ and $R$.</strong><br><br>$r = \\dfrac{\\text{Area}}{s} = \\dfrac{84}{21} = \\mathbf{4}$.<br><br>$R = \\dfrac{abc}{4 \\cdot \\text{Area}} = \\dfrac{13 \\cdot 14 \\cdot 15}{4 \\cdot 84} = \\dfrac{2730}{336} = \\mathbf{\\dfrac{65}{8}} = 8.125$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Apollonius backwards</div><div class="example-body"><strong>A triangle has $b = 7$, $c = 8$, and the median from $A$ to side $a$ has length $m_a = 5$. Find $a$.</strong><br><br>$m_a^2 = \\dfrac{2b^2 + 2c^2 - a^2}{4} \\implies 25 = \\dfrac{98 + 128 - a^2}{4} \\implies 100 = 226 - a^2 \\implies a^2 = 126$.<br><br>$a = \\sqrt{126} = 3\\sqrt{14} \\approx \\mathbf{11.22}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Right-triangle median equals half hypotenuse</div><div class="example-body"><strong>In a right triangle, the median from the right-angle vertex to the hypotenuse has length 10. Find the hypotenuse.</strong><br><br>$m_c = c/2 \\implies 10 = c/2 \\implies c = \\mathbf{20}$.<br><br>This works because the right-angle vertex lies on a circle of diameter $c$ (Thales' circle theorem), and the median is the radius.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Euclidean relations in a right triangle: $h^2 = pq$, $a^2 = cp$, $b^2 = cq$, $c^2 = a^2 + b^2$</li>
<li>The three medians of any triangle meet at the centroid $G$, which divides each median 2:1</li>
<li>In a right triangle the median to the hypotenuse equals half the hypotenuse: $m_c = c/2$</li>
<li>Apollonius' formula gives each median's length from the three sides: $m_a^2 = (2b^2 + 2c^2 - a^2)/4$</li>
<li>Angle bisector length: $t_a^2 = bc - |BD||DC|$ with $|BD|/|DC| = c/b$</li>
<li>Stewart's theorem unifies the median and bisector formulas for any cevian</li>
<li>Five area formulas: $\\tfrac{1}{2}bh$, $\\tfrac{1}{2}ab\\sin C$, $abc/(4R)$, $rs$, and Heron's $\\sqrt{s(s-a)(s-b)(s-c)}$</li>
<li>Useful corollaries: $R = abc/(4\\cdot\\text{Area})$, $r = \\text{Area}/s$, law of sines $c/\\sin C = 2R$</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>Bir üçgenin yalnızca üç kenarı ve üç açısı vardır, ama içinde gizli pek çok doğru parçası vardır ve hepsi güzel sayısal yasalara uyar.</strong> Dik açının köşesinden hipotenüse bir dikme indir, hiç beklenmedik şekilde geometrik ortalama ortaya çıkar. Bir köşeyi karşı kenarın orta noktasına birleştirirsen, uzunluğu üçgenin üç kenarıyla tamamen belirlenen bir kenarortay elde edersin. Alanın kendisi de beş farklı biçimde yazılabilir, hepsi aynı sayıyı verir. Üçgende metrik bağıntılar, bir problem üçgenin orijinal kenarlarından biri olmayan bir uzunluk — bir yükseklik, kenarortay, açıortay, iç teğet yarıçapı ya da çevrel çember yarıçapı — istediğinde kullandığın alet çantasıdır.</p>

<p class="l-text">Bu derste dik üçgenler için Öklid (hipotenüse indirilen yükseklik) bağıntılarını, Apollonius teoremi olarak bilinen kenarortay uzunluğu formülünü, açıortay uzunluğu formülünü, Stewart teoremini (birleştirici bir bağıntı) ve alan formüllerinin tam ailesini — Heron formülü dahil, ki yalnızca üç kenardan alanı hesaplar — kavrayacaksın. Dersi bitirdiğinde, lise düzeyindeki hemen hemen her geometri problemini trigonometriye başvurmadan çözmek için yeterli donanıma sahip olacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dik üçgende Öklid teoremlerini uygulamayı: $h^2 = pq$, $a^2 = cp$, $b^2 = cq$, $c^2 = a^2 + b^2$</li>
<li>Kenarortayı tanımlamayı; ağırlık merkezini bulmayı; ağırlık merkezinin her kenarortaya dayattığı 2:1 oranını kullanmayı</li>
<li>Apollonius teoremiyle bir kenarortayın uzunluğunu hesaplamayı: $m_c^2 = (2a^2 + 2b^2 - c^2)/4$</li>
<li>Çevyenleri ele almak için açıortay uzunluk formülünü ve Stewart teoremini kullanmayı</li>
<li>Beş alan formülü arasında akıcı geçiş yapmayı: $\\tfrac{1}{2}bh$, $\\tfrac{1}{2}ab\\sin C$, $abc/(4R)$, $rs$ ve Heron formülü</li>
<li>Yükseklik, kenarortay, alan ve iç teğet/çevrel çember yarıçapını birleştiren karışık problemleri çözmeyi</li>
</ul>
</div>

<h2 class="lesson-title">1. Dik Üçgende Hipotenüse İnen Yükseklik Teoremi</h2>

<div class="calc-highlight"><strong>Bir dik üçgenle başla:</strong> dik kenarlar $a$ ve $b$, hipotenüs $c$. Dik açının köşesi $C$'den hipotenüse bir dikme indir, hipotenüsü $H$ noktasında kessin. Bu yükseklik $h$, hipotenüsü iki parçaya böler: $A$ köşesi tarafında $p$ ve $B$ köşesi tarafında $q$, ve $p + q = c$. Bu tek resimden dört klasik bağıntı bedavaya çıkar.</div>

<p class="l-text">Bu, ünlü "üç benzer üçgen" konfigürasyonudur: $\\triangle ACH$, $\\triangle CBH$ ve orijinal $\\triangle ABC$ — AA ile birbirine benzerdirler (üçü de dik açıyı paylaşır ve her çift, orijinal üçgenin bir dar açısını paylaşır). Onları çift çift eşleyip oranları yazınca aşağıdaki dört formül çıkar.</p>

<div class="calc-formula"><div class="formula-label">ÖKLİD BAĞINTILARI (DİK ÜÇGEN)</div><div class="formula-main">$$h^2 \\;=\\; p \\cdot q \\qquad a^2 \\;=\\; c \\cdot p \\qquad b^2 \\;=\\; c \\cdot q \\qquad c^2 \\;=\\; a^2 + b^2$$</div><div class="formula-sub">$h$, dik açının köşesinden hipotenüs $c$'ye inen yüksekliktir; yüksekliğin ayağı $c$'yi $p$ (kenar $a$ tarafına) ve $q$ (kenar $b$ tarafına) olarak böler. Son formül Pisagor'un ta kendisidir.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$h^2 = pq$</div><div class="card-body">Yükseklik, hipotenüsün iki parçasının geometrik ortalamasıdır. Yani $h$, $p$ ile $q$ arasındaki orta orantıdır.</div></div>
<div class="calc-card"><div class="card-title">$a^2 = cp$</div><div class="card-body">Her dik kenarın karesi, hipotenüsün kendi izdüşümüyle (o kenarın yanındaki hipotenüs parçasıyla) çarpımına eşittir.</div></div>
<div class="calc-card"><div class="card-title">$b^2 = cq$</div><div class="card-body">Diğer kenar için simetrik ifade. $a^2 + b^2 = c(p+q) = c \\cdot c = c^2$ olarak topla — Pisagor anında ortaya çıkar.</div></div>
</div>

<div class="calc-graph"><div id="plot-l84-euclid-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> dik açının köşesinden hipotenüse inen yüksekliği olan bir dik üçgen. Hipotenüs $p$ (turuncu) ve $q$ (yeşil) parçalarına bölünmüştür. Yükseklik $h$ (kırmızı, kesikli), $p$ ile $q$'nun geometrik ortalamasıdır. Üç benzer dik üçgen her biri bir dar açıyı paylaşır ve dört Öklid özdeşliğini bedavaya verir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=10,By=0;var Cx=3.6,Cy=4.8;
var Hx=3.6,Hy=0;
var hyp={x:[Ax,Bx],y:[Ay,By],mode:'lines',name:'hipotenüs c',line:{color:'#3b82f6',width:3}};
var legA={x:[Ax,Cx],y:[Ay,Cy],mode:'lines',name:'kenar b',line:{color:'#3b82f6',width:3}};
var legB={x:[Bx,Cx],y:[By,Cy],mode:'lines',name:'kenar a',line:{color:'#3b82f6',width:3}};
var alt={x:[Cx,Hx],y:[Cy,Hy],mode:'lines',name:'yükseklik h',line:{color:'#ef4444',width:2.5,dash:'dash'}};
var segP={x:[Ax,Hx],y:[-0.25,-0.25],mode:'lines',name:'p',line:{color:'#f59e0b',width:5}};
var segQ={x:[Hx,Bx],y:[-0.25,-0.25],mode:'lines',name:'q',line:{color:'#22c55e',width:5}};
var rightAngle={x:[Cx-0.32,Cx-0.32,Cx],y:[Cy-0.4,Cy-0.08,Cy-0.08],mode:'lines',name:'90°',line:{color:'rgba(255,255,255,0.5)',width:1.4},showlegend:false};
var rightAngleH={x:[Hx-0.3,Hx-0.3,Hx],y:[0,0.3,0.3],mode:'lines',name:'90°',line:{color:'rgba(255,255,255,0.5)',width:1.4},showlegend:false};
var labs={x:[Ax-0.3,Bx+0.3,Cx,Hx,Ax+Hx/2,Hx+(Bx-Hx)/2,Cx-0.7,Cx+0.5,(Cx+Bx)/2+0.2,(Cx+Ax)/2-0.4],y:[Ay-0.3,By-0.3,Cy+0.35,-0.7,-0.7,-0.7,Cy/2,Cy/2,(Cy+By)/2,(Cy+Ay)/2],mode:'text',name:'etiketler',text:['A','B','C','H','p','q','h','','a','b'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,12],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-euclid-tr',[hyp,legA,legB,alt,segP,segQ,rightAngle,rightAngleH,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 6-8-10 üçgeninde yükseklik</div><div class="example-body">Bir dik üçgenin dik kenarları $a = 6$, $b = 8$ ve hipotenüsü $c = 10$. Dik açıdan hipotenüse inen yüksekliği $h$'yı ve iki parça $p$ ile $q$'yu bul.<br><br><strong>Yöntem 1 — alan.</strong> Alan $= \\tfrac{1}{2} \\cdot 6 \\cdot 8 = 24$. Ama alan $\\tfrac{1}{2} \\cdot c \\cdot h = 5h$ de olduğundan, $5h = 24 \\implies h = 4.8$.<br><br><strong>Yöntem 2 — Öklid.</strong> $a^2 = cp \\implies 36 = 10p \\implies p = 3.6$. Benzer şekilde $b^2 = cq \\implies 64 = 10q \\implies q = 6.4$. Kontrol: $p+q = 10$ ✓ ve $h^2 = pq = 3.6 \\cdot 6.4 = 23.04 \\implies h = 4.8$ ✓.<br><br>İki yöntem de $\\mathbf{h = 4.8}$, $\\mathbf{p = 3.6}$, $\\mathbf{q = 6.4}$ verir.</div></div>

<div class="l-note"><strong>Neden geometrik ortalama?</strong> Üç-benzer-üçgen resminde, $p$ tarafındaki küçük üçgenin dik kenarları $p$ ve $h$'dır, $h/p$ orijinaldeki kenar oranına eşittir. $q$ tarafındaki küçük üçgenin dik kenarları ise $h$ ve $q$'dur. Oranları eşitlediğinde $h/p = q/h$, yani $h^2 = pq$. Yükseklik, hipotenüsün iki parçası arasında geometrik ortalama olarak sıkışmıştır.</div>

<h2 class="lesson-title">2. Kenarortaylar ve Ağırlık Merkezi</h2>

<div class="calc-highlight"><strong>Bir üçgenin kenarortayı,</strong> bir köşeyi karşı kenarın orta noktasına birleştiren doğru parçasıdır. Her üçgenin üç kenarortayı vardır, her köşeden bir tane. Şaşırtıcı biçimde, üç kenarortay her zaman tek bir noktada — <em>ağırlık merkezi</em> $G$'de — kesişir ve ağırlık merkezi her kenarortayı sabit bir 2:1 oranıyla böler.</div>

<p class="l-text">Notasyon. $\\triangle ABC$'nin kenar uzunlukları $a = |BC|$, $b = |CA|$, $c = |AB|$ olsun. $A$ köşesinden çıkan kenarortay, $BC$ kenarının orta noktası $M_a$'ya gider; uzunluğuna $m_a$ diyelim. Benzer şekilde $m_b$, $B$'den $CA$'nın orta noktasına; $m_c$ ise $C$'den $AB$'nin orta noktasına gider.</p>

<div class="calc-formula"><div class="formula-label">AĞIRLIK MERKEZİ HER KENARORTAYI 2:1 BÖLER</div><div class="formula-main">$$|AG| : |GM_a| \\;=\\; 2 : 1 \\qquad\\text{yani}\\qquad |AG| \\;=\\; \\frac{2}{3}\\,m_a, \\qquad |GM_a| \\;=\\; \\frac{1}{3}\\,m_a$$</div><div class="formula-sub">Ağırlık merkezi, herhangi bir köşeden karşı orta noktaya gidişin üçte ikisi konumundadır; ve karşı orta noktadan üçte biri kadar uzaklıktadır. Aynı 2:1 ayrımı üç kenarortayda da olur.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fiziksel anlam</div><div class="card-body">Ağırlık merkezi, eş yoğunluklu üçgensel bir levhanın kütle merkezidir. Levhayı $G$'de bir iğne üzerinde dengeye al; yatay kalır.</div></div>
<div class="calc-card"><div class="card-title">Koordinat formülü</div><div class="card-body">$A = (x_1,y_1)$, $B = (x_2,y_2)$, $C = (x_3,y_3)$ ise $G = \\left(\\dfrac{x_1+x_2+x_3}{3},\\;\\dfrac{y_1+y_2+y_3}{3}\\right)$ — sadece ortalamadır.</div></div>
<div class="calc-card"><div class="card-title">Altı küçük üçgen</div><div class="card-body">Üç kenarortay üçgeni eşit alanlı altı küçük üçgene böler. Her birinin alanı, bütünün altıda biridir.</div></div>
</div>

<div class="calc-graph"><div id="plot-l84-medians-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> üç kenarortayı (turuncu) ağırlık merkezi $G$'de (kırmızı nokta) kesişen $\\triangle ABC$ üçgeni. Her kenarortay 2:1 oranında bölünmüştür — uzun parça (köşeden $G$'ye) kısa parçanın (G'den orta noktaya) iki katıdır. Kenarların orta noktaları daha küçük işaretleyicilerle gösterilmiştir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var Ax=0,Ay=0;var Bx=8,By=0;var Cx=2.5,Cy=5;
var MaX=(Bx+Cx)/2,MaY=(By+Cy)/2;
var MbX=(Cx+Ax)/2,MbY=(Cy+Ay)/2;
var McX=(Ax+Bx)/2,McY=(Ay+By)/2;
var Gx=(Ax+Bx+Cx)/3,Gy=(Ay+By+Cy)/3;
var tri={x:[Ax,Bx,Cx,Ax],y:[Ay,By,Cy,Ay],mode:'lines+markers',name:'△ABC',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var med1={x:[Ax,MaX],y:[Ay,MaY],mode:'lines',name:'A kenarortayı',line:{color:'#f59e0b',width:2}};
var med2={x:[Bx,MbX],y:[By,MbY],mode:'lines',name:'B kenarortayı',line:{color:'#f59e0b',width:2}};
var med3={x:[Cx,McX],y:[Cy,McY],mode:'lines',name:'C kenarortayı',line:{color:'#f59e0b',width:2}};
var midpts={x:[MaX,MbX,McX],y:[MaY,MbY,McY],mode:'markers',name:'orta noktalar',marker:{color:'#22c55e',size:9}};
var centroid={x:[Gx],y:[Gy],mode:'markers',name:'ağırlık merkezi G',marker:{color:'#ef4444',size:13,symbol:'star'}};
var labs={x:[Ax-0.3,Bx+0.3,Cx,MaX+0.3,MbX-0.3,McX,Gx+0.3],y:[Ay-0.3,By-0.3,Cy+0.3,MaY,MbY,McY-0.3,Gy+0.3],mode:'text',name:'etiketler',text:['A','B','C','Ma','Mb','Mc','G'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,10],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.5,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-medians-tr',[tri,med1,med2,med3,midpts,centroid,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">3. Kenarortay Uzunluğu — Apollonius Teoremi</h2>

<div class="calc-highlight"><strong>Her kenarortayın uzunluğu nedir?</strong> Perga'lı Apollonius (MÖ 3. yüzyıl), kenarortayın uzunluğu için üçgenin üç kenarına dayalı kapalı bir formül vermiştir. Açıya gerek yok.</div>

<div class="calc-formula"><div class="formula-label">APOLLONIUS KENARORTAY UZUNLUK FORMÜLÜ</div><div class="formula-main">$$m_a^2 \\;=\\; \\frac{2b^2 + 2c^2 - a^2}{4} \\qquad m_b^2 \\;=\\; \\frac{2a^2 + 2c^2 - b^2}{4} \\qquad m_c^2 \\;=\\; \\frac{2a^2 + 2b^2 - c^2}{4}$$</div><div class="formula-sub">Bir köşeden çıkan kenarortayın karesi "iki komşu kenarın karelerinin iki katı eksi karşı kenarın karesi, hepsi 4'e bölünmüş" şeklindedir. Örüntü: $2 \\cdot (\\text{komşu}^2 + \\text{komşu}^2) - (\\text{karşı}^2)$, 4'e bölünmüş.</div></div>

<p class="l-text"><strong>Formül nasıl ortaya çıkıyor?</strong> Üçgeni $B = (-a/2, 0)$ ve $C = (a/2, 0)$ olacak şekilde yerleştir, böylece $BC$'nin orta noktası orijin olur. $A = (x_A, y_A)$ olsun. O zaman $A$'dan $B$'ye uzaklığın karesi $c^2 = (x_A + a/2)^2 + y_A^2$, $A$'dan $C$'ye uzaklığın karesi $b^2 = (x_A - a/2)^2 + y_A^2$ ve kenarortay uzunluğunun karesi $m_a^2 = x_A^2 + y_A^2$ olur. $b^2 + c^2$ toplanıp düzenlenince Apollonius formülü çıkar. İspat bir satırlık cebirdir.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 5-12-13 dik üçgeninde kenarortay</div><div class="example-body">Dik kenarları $a = 5$ ve $b = 12$, hipotenüsü $c = 13$ olan dik üçgende, dik açının köşesi $C$'den hipotenüs $AB$'ye giden kenarortay $m_c$'yi bul.<br><br>Apollonius: $m_c^2 = \\dfrac{2 a^2 + 2 b^2 - c^2}{4} = \\dfrac{2(25) + 2(144) - 169}{4} = \\dfrac{50 + 288 - 169}{4} = \\dfrac{169}{4}$.<br><br>Yani $m_c = \\dfrac{13}{2} = \\mathbf{6.5}$.<br><br><strong>Anlam kontrolü.</strong> Herhangi bir dik üçgende, dik açıdan hipotenüse inen kenarortay hipotenüsün yarısına eşittir. Gerçekten $m_c = c/2 = 13/2 = 6.5$ ✓. Bu, başlı başına ezberlenmeye değer ünlü bir özelliktir.</div></div>

<div class="l-note"><strong>Dik üçgende kenarortay özelliği.</strong> $\\angle C = 90^\\circ$ ise $m_c = c/2$. Eşdeğer olarak, dik açının köşesi, çapı hipotenüs olan bir çember üzerindedir (Thales çember teoremi). O çemberin merkezi hipotenüsün orta noktası, yarıçapı ise hipotenüsün yarısıdır — ki bu tam olarak $m_c$'dir.</div>

<h2 class="lesson-title">4. Açıortay Uzunluğu Formülü</h2>

<div class="calc-highlight"><strong>$\\triangle ABC$'de $D$ noktası $BC$ üzerinde olmak üzere, $\\angle A$'nın iç açıortayı $AD$ ise,</strong> $AD$'nin uzunluğu yalnızca üçgenin üç kenarına bağlıdır. Kenarortay formülünün biraz daha karmaşık bir kuzenidir.</div>

<div class="calc-formula"><div class="formula-label">AÇIORTAY UZUNLUĞU</div><div class="formula-main">$$t_a^2 \\;=\\; b\\,c \\;-\\; |BD| \\cdot |DC|$$</div><div class="formula-sub">$t_a$ açıortay uzunluğu, $|BD|$ ile $|DC|$ ise açıortayın $a$ kenarından kestiği iki parçadır. Açıortay teoreminden $|BD| = \\dfrac{ac}{b+c}$ ve $|DC| = \\dfrac{ab}{b+c}$ olduğunu biliriz.</div></div>

<p class="l-text">Açıortay teoreminin verdiği parçaları yerine koyunca kapalı biçim ortaya çıkar — bazen <em>Stewart tarzı</em> açıortay formülü olarak adlandırılır:</p>

<div class="calc-formula"><div class="formula-label">AÇIORTAY — KAPALI BİÇİM</div><div class="formula-main">$$t_a^2 \\;=\\; b\\,c\\left[1 - \\left(\\frac{a}{b+c}\\right)^2\\right] \\;=\\; \\frac{b\\,c\\,\\big[(b+c)^2 - a^2\\big]}{(b+c)^2}$$</div><div class="formula-sub">Sağ taraftaki tüm büyüklükler üçgenin kenar uzunluklarıdır. Açı yok, izdüşüm yok — sadece $a$, $b$, $c$.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — Açıortay uzunluğu</div><div class="example-body">$\\triangle ABC$'de $a = 8$, $b = 5$, $c = 7$. $A$'dan çıkan açıortayın uzunluğunu bul.<br><br>Açıortay teoremine göre $|BD| = \\dfrac{ac}{b+c} = \\dfrac{8 \\cdot 7}{12} = \\dfrac{56}{12} = \\dfrac{14}{3}$ ve $|DC| = \\dfrac{ab}{b+c} = \\dfrac{8 \\cdot 5}{12} = \\dfrac{40}{12} = \\dfrac{10}{3}$.<br><br>Sonra $t_a^2 = b c - |BD||DC| = 5 \\cdot 7 - \\dfrac{14}{3} \\cdot \\dfrac{10}{3} = 35 - \\dfrac{140}{9} = \\dfrac{315 - 140}{9} = \\dfrac{175}{9}$.<br><br>Yani $t_a = \\dfrac{\\sqrt{175}}{3} = \\dfrac{5\\sqrt{7}}{3} \\approx \\mathbf{4.41}$.</div></div>

<h2 class="lesson-title">5. Stewart Teoremi (İsteğe Bağlı, Birleştirici)</h2>

<div class="calc-highlight"><strong>Hem kenarortay formülü hem de açıortay formülü, tek bir daha genel özdeşliğin özel durumlarıdır</strong> — bu özdeşlik İskoç matematikçi Matthew Stewart'a (1746) aittir. Herhangi bir <em>çevyenle</em> (bir köşeden karşı kenar üzerindeki bir noktaya giden doğru parçası) ilgilenir.</div>

<div class="calc-formula"><div class="formula-label">STEWART TEOREMİ</div><div class="formula-main">$$b^2 m + c^2 n - d^2 a \\;=\\; a m n$$</div><div class="formula-sub">$A$ köşesinden çıkan $d$ uzunluğundaki çevyen, $a = BC$ kenarına bir noktada değer ve onu $m$ ($C$'ye yakın) ile $n$ ($B$'ye yakın) parçalarına böler; $m + n = a$. Anımsatıcı: $a(d^2 + mn) = b^2 m + c^2 n$.</div></div>

<p class="l-text"><strong>Neden önemli.</strong> $m = n = a/2$ koyunca Stewart, Apollonius'a indirgenir. $m/n = b/c$ (açıortay oranı) koyunca açıortay formülüne indirgenir. Tek bir özdeşlik, iki ünlü özelleşme — artı, ayağı karşı kenarda bilinen herhangi bir çevyenin uzunluğunu hesaplamanın bir yolu.</p>

<h2 class="lesson-title">6. Beş Alan Formülü</h2>

<div class="calc-highlight"><strong>Bir üçgenin alanı en az beş eşdeğer biçimde yazılabilir,</strong> her biri farklı parçalar bilindiğinde kullanışlıdır. Tabloyu ezberle.</div>

<div class="calc-formula"><div class="formula-label">ÜÇGEN ALANININ BEŞ YÜZÜ</div><div class="formula-main">$$\\text{Alan} \\;=\\; \\tfrac{1}{2}\\,\\text{taban} \\cdot \\text{yükseklik} \\;=\\; \\tfrac{1}{2}\\,a\\,b\\,\\sin C \\;=\\; \\frac{a\\,b\\,c}{4R} \\;=\\; r\\,s \\;=\\; \\sqrt{s(s-a)(s-b)(s-c)}$$</div><div class="formula-sub">Burada $a, b, c$ kenarlar; $C$, $c$ kenarının karşısındaki açı; $R$ çevrel çember yarıçapı; $r$ iç teğet çember yarıçapı; $s = (a+b+c)/2$ yarı çevredir; sonuncu Heron formülüdür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\tfrac{1}{2}bh$</div><div class="card-body">Gündelik formül: yarım taban çarpı yükseklik. Bir kenarı ve ona inen yüksekliği biliyorsan kullan.</div></div>
<div class="calc-card"><div class="card-title">$\\tfrac{1}{2}ab\\sin C$</div><div class="card-body">Trigonometrik biçim. İki kenarı ve aralarındaki açıyı biliyorsan (SAS verisi) kullan.</div></div>
<div class="calc-card"><div class="card-title">$\\dfrac{abc}{4R}$</div><div class="card-body">Çevrel çember biçimi. Üç kenarın hepsini biliyorsan ve $R$'yi bulmak istiyorsan ya da tersi.</div></div>
<div class="calc-card"><div class="card-title">$r\\,s$</div><div class="card-body">İç teğet yarıçapı çarpı yarı çevre. İç teğet çember devredeyse kullan.</div></div>
<div class="calc-card"><div class="card-title">Heron</div><div class="card-body">$\\sqrt{s(s-a)(s-b)(s-c)}$. Yalnızca üç kenarı biliyorsan ve alanı tek hamlede istiyorsan kullan.</div></div>
</div>

<p class="l-text"><strong>Hepsi neden eşdeğer?</strong> Çünkü hepsi aynı üçgenin alanını verir. Herhangi ikisini seç ve bir özdeşlik elde et. Örneğin $\\tfrac{1}{2}ab\\sin C = \\tfrac{abc}{4R}$ eşitlenince <em>sinüs teoremi</em> çıkar: $\\dfrac{c}{\\sin C} = 2R$. $rs = \\sqrt{s(s-a)(s-b)(s-c)}$ eşitlenince $r$ yalnızca kenarlar cinsinden kapalı bir ifade olarak çıkar.</p>

<div class="calc-formula"><div class="formula-label">KULLANIŞLI SONUÇLAR</div><div class="formula-main">$$R \\;=\\; \\frac{a\\,b\\,c}{4 \\cdot \\text{Alan}} \\qquad r \\;=\\; \\frac{\\text{Alan}}{s} \\qquad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$</div><div class="formula-sub">Anında yeniden üretebilmen gereken üç formül. İlk ikisi çevrel ve iç teğet çemberlerin yarıçaplarını verir; üçüncüsü sinüs teoremidir.</div></div>

<h2 class="lesson-title">7. İş Başında Heron Formülü</h2>

<div class="calc-highlight"><strong>Heron formülü</strong> (MS 1. yüzyıl), Öklid'in doğrudan sormadığı bir sorunun yanıtıdır: <em>yalnızca üç kenar uzunluğu verilmiş bir üçgenin alanı nedir?</em> Açı ölçümü yok, yükseklik yok, trigonometri yok — sadece üç kenar.</div>

<div class="calc-formula"><div class="formula-label">HERON FORMÜLÜ</div><div class="formula-main">$$\\text{Alan} \\;=\\; \\sqrt{s(s-a)(s-b)(s-c)} \\qquad\\text{burada}\\qquad s \\;=\\; \\frac{a+b+c}{2}$$</div><div class="formula-sub">$s$ yarı çevredir. $s-a, s-b, s-c$ değerlerinin her biri, ancak ve ancak üç kenar gerçek bir üçgen oluşturuyorsa pozitiftir (üçgen eşitsizliği).</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK — 5-6-7 üçgeninde Heron</div><div class="example-body">Kenarları $a = 5$, $b = 6$, $c = 7$ olan üçgenin alanını bul.<br><br>Yarı çevre: $s = \\dfrac{5+6+7}{2} = 9$.<br><br>Farklar: $s-a = 4$, $s-b = 3$, $s-c = 2$.<br><br>Alan $= \\sqrt{9 \\cdot 4 \\cdot 3 \\cdot 2} = \\sqrt{216} = 6\\sqrt{6} \\approx \\mathbf{14.70}$.<br><br><strong>Başka bir formülle çapraz kontrol.</strong> $c$ kenarına inen yükseklik $h_c = \\dfrac{2 \\cdot \\text{Alan}}{c} = \\dfrac{12\\sqrt{6}}{7} \\approx 4.20$. Yani $\\tfrac{1}{2} \\cdot 7 \\cdot 4.20 = 14.70$ ✓.</div></div>

<div class="calc-graph"><div id="plot-l84-heron-tr" class="plotly-graph" style="height:430px"></div><div class="graph-caption"><strong>Grafik ne gösteriyor:</strong> ölçekli çizilmiş 5-6-7 üçgeni. Kenar uzunlukları etiketlenmiştir; $C$ köşesinden $c$ kenarına (7 uzunluğundaki kenara) inen yükseklik kırmızıyla gösterilmiş ve yaklaşık 4.20 olarak hesaplanmıştır. Heron formülü alanı $6\\sqrt{6} \\approx 14.70$ verir — $\\tfrac{1}{2} \\cdot 7 \\cdot 4.20 \\approx 14.70$ ile doğrulanabilir.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var c=7;var a=5;var b=6;
var Bx=0,By=0;var Cx=c,Cy=0;
var Ax=(c*c+b*b-a*a)/(2*c);var Ay=Math.sqrt(b*b-Ax*Ax);
var hFootX=Ax,hFootY=0;
var tri={x:[Bx,Cx,Ax,Bx],y:[By,Cy,Ay,By],mode:'lines+markers',name:'5-6-7 üçgeni',line:{color:'#3b82f6',width:3},marker:{color:'#3b82f6',size:8}};
var alt={x:[Ax,hFootX],y:[Ay,hFootY],mode:'lines',name:'yükseklik h≈4.20',line:{color:'#ef4444',width:2,dash:'dash'}};
var labs={x:[Bx-0.25,Cx+0.25,Ax,(Bx+Cx)/2,(Bx+Ax)/2-0.4,(Cx+Ax)/2+0.4,Ax+0.3],y:[By-0.3,Cy-0.3,Ay+0.3,By-0.5,(By+Ay)/2,(Cy+Ay)/2,Ay/2],mode:'text',name:'etiketler',text:['B','C','A','c=7','b=6','a=5','h'],textfont:{color:'#e8e8e8',size:13},showlegend:false};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-1.5,9],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)',scaleanchor:'y',scaleratio:1},yaxis:{title:'y',range:[-1.2,6.5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.2)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l84-heron-tr',[tri,alt,labs],lay,{responsive:true,displayModeBar:false});
},250);</script>

<h2 class="lesson-title">8. Sık Yapılan Hatalar</h2>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ÖKLİD BAĞINTILARI</div><div class="compare-item">"$a^2 = c \\cdot q$" — yanlış. $a$ kenarı kendi izdüşümü $p$ ile eşleşir, $q$ ile değil. Kenarı, hipotenüsün ona komşu parçasıyla eşle.</div><div class="compare-item">"$h^2 = p + q$" — yanlış. Yüksekliğin karesi $p \\cdot q$'dur (geometrik ortalama), $p+q$ değil ($p+q$ sadece $c$'dir).</div><div class="compare-item">Sayıları yerine koymadan önce her zaman dik üçgeni yeniden çiz ve $p$, $q$, $h$ etiketlerini sıfırdan yerleştir.</div></div><div class="compare-col"><div class="compare-title">KENARORTAY VE AÇIORTAY</div><div class="compare-item">Kenarortay formülünde iki KOMŞU kenarın karelerinin İKİ KATI eksi KARŞI kenarın karesi vardır, hepsi 4'e bölünür — tersi değil.</div><div class="compare-item">Açıortay uzunluğu $bc - mn$'ye bağlıdır, ama $m$ ile $n$, açıortay teoreminden gelir (kenarortayda olduğu gibi eşit yarılar değil).</div><div class="compare-item">Heron formülü yarı çevre $s = (a+b+c)/2$'ye ihtiyaç duyar, çevreye DEĞİL ($a+b+c$).</div></div></div>

<div class="l-note"><strong>Üç sık yapılan hata:</strong><br>(1) <strong>$p$ ve $q$'yu karıştırmak.</strong> $p$ parçası $a$ kenarına komşudur; $q$ parçası $b$ kenarına komşudur. Bazı ders kitapları harfleri yer değiştirir — formülü kullanmadan önce çizimi tekrar kontrol et.<br>(2) <strong>$\\tfrac{1}{2}ab\\sin C$ formülünde yarısını unutmak.</strong> Formülde $\\tfrac{1}{2}$ çarpanı vardır. Unutursan alanın iki katına çıkar.<br>(3) <strong>$\\tfrac{1}{2}ab\\sin C$ formülünde yanlış açı.</strong> Açı, $a$ ile $b$ kenarları ARASINDAKİ açı olmalıdır — üçgenin başka bir açısı değil.</div>

<h2 class="lesson-title">9. Çözümlü Problemler</h2>

<p class="l-text">Konsolide bir uygulama seti. Çözümün üstünü kapat, her problemi dene, sonra aç.</p>

<div class="calc-example"><div class="example-label">PROBLEM 1 — Hipotenüse yükseklik</div><div class="example-body"><strong>Dik kenarları 9 ve 12 olan bir dik üçgende, hipotenüse inen yüksekliği bul.</strong><br><br>Hipotenüs $c = \\sqrt{9^2 + 12^2} = \\sqrt{225} = 15$.<br><br>Alan $= \\tfrac{1}{2} \\cdot 9 \\cdot 12 = 54$. Aynı zamanda alan $= \\tfrac{1}{2} \\cdot 15 \\cdot h \\implies h = \\dfrac{108}{15} = \\mathbf{7.2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 — Dik kenarların izdüşümleri</div><div class="example-body"><strong>Aynı 9-12-15 dik üçgeninde, yüksekliğin ayağının iki yanındaki $p$ ve $q$ hipotenüs parçalarını bul.</strong><br><br>$a^2 = cp \\implies 81 = 15p \\implies p = 5.4$. Ve $b^2 = cq \\implies 144 = 15q \\implies q = 9.6$. Kontrol: $p+q = 15$ ✓, $pq = 5.4 \\cdot 9.6 = 51.84 = h^2 = 7.2^2$ ✓.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 — Eşkenar üçgende kenarortay</div><div class="example-body"><strong>Kenarı $a$ olan eşkenar üçgende kenarortay uzunluğunu bul.</strong><br><br>Tüm kenarlar eşit Apollonius ile: $m^2 = \\dfrac{2a^2 + 2a^2 - a^2}{4} = \\dfrac{3a^2}{4}$. Yani $m = \\dfrac{a\\sqrt{3}}{2}$.<br><br>Eşkenar üçgende kenarortaylar, yükseklikler ve açıortaylar çakışır, dolayısıyla bu aynı zamanda yüksekliktir — bilinen $h = \\dfrac{a\\sqrt{3}}{2}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 — 5-12-13 dik üçgeninde başka bir kenarortay</div><div class="example-body"><strong>5-12-13 dik üçgeninde ($a = 5$, $b = 12$, $c = 13$, dik açı $C$'de), $B$'den $CA$'nın orta noktasına giden kenarortayı bul.</strong><br><br>Apollonius: $m_b^2 = \\dfrac{2a^2 + 2c^2 - b^2}{4} = \\dfrac{2(25) + 2(169) - 144}{4} = \\dfrac{50 + 338 - 144}{4} = \\dfrac{244}{4} = 61$.<br><br>$m_b = \\sqrt{61} \\approx \\mathbf{7.81}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5 — Heron formülüyle alan</div><div class="example-body"><strong>Kenarları 13, 14, 15 olan üçgenin alanını bul.</strong><br><br>$s = 21$. $s-a = 8$, $s-b = 7$, $s-c = 6$.<br><br>Alan $= \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = \\mathbf{84}$.<br><br>Bu, tam sayı alanlı ünlü "13-14-15 üçgeni"dir.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 — İç teğet ve çevrel çember yarıçapları</div><div class="example-body"><strong>Problem 5'teki 13-14-15 üçgeni için $r$ ve $R$'yi bul.</strong><br><br>$r = \\dfrac{\\text{Alan}}{s} = \\dfrac{84}{21} = \\mathbf{4}$.<br><br>$R = \\dfrac{abc}{4 \\cdot \\text{Alan}} = \\dfrac{13 \\cdot 14 \\cdot 15}{4 \\cdot 84} = \\dfrac{2730}{336} = \\mathbf{\\dfrac{65}{8}} = 8.125$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 — Apollonius tersine</div><div class="example-body"><strong>Bir üçgende $b = 7$, $c = 8$ ve $A$'dan $a$ kenarına giden kenarortay $m_a = 5$ uzunluğundadır. $a$'yı bul.</strong><br><br>$m_a^2 = \\dfrac{2b^2 + 2c^2 - a^2}{4} \\implies 25 = \\dfrac{98 + 128 - a^2}{4} \\implies 100 = 226 - a^2 \\implies a^2 = 126$.<br><br>$a = \\sqrt{126} = 3\\sqrt{14} \\approx \\mathbf{11.22}$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 — Dik üçgende kenarortay hipotenüsün yarısı</div><div class="example-body"><strong>Bir dik üçgende, dik açının köşesinden hipotenüse giden kenarortayın uzunluğu 10. Hipotenüsü bul.</strong><br><br>$m_c = c/2 \\implies 10 = c/2 \\implies c = \\mathbf{20}$.<br><br>Bu, dik açının köşesinin çapı $c$ olan bir çember üzerinde olduğu için işler (Thales çember teoremi) ve kenarortay o çemberin yarıçapıdır.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dik üçgende Öklid bağıntıları: $h^2 = pq$, $a^2 = cp$, $b^2 = cq$, $c^2 = a^2 + b^2$</li>
<li>Herhangi bir üçgenin üç kenarortayı ağırlık merkezi $G$'de kesişir ve her birini 2:1 böler</li>
<li>Dik üçgende hipotenüse giden kenarortay hipotenüsün yarısına eşittir: $m_c = c/2$</li>
<li>Apollonius formülü her kenarortayın uzunluğunu üç kenardan verir: $m_a^2 = (2b^2 + 2c^2 - a^2)/4$</li>
<li>Açıortay uzunluğu: $t_a^2 = bc - |BD||DC|$ ve $|BD|/|DC| = c/b$</li>
<li>Stewart teoremi herhangi bir çevyen için kenarortay ve açıortay formüllerini birleştirir</li>
<li>Beş alan formülü: $\\tfrac{1}{2}bh$, $\\tfrac{1}{2}ab\\sin C$, $abc/(4R)$, $rs$ ve Heron'un $\\sqrt{s(s-a)(s-b)(s-c)}$ formülü</li>
<li>Kullanışlı sonuçlar: $R = abc/(4\\cdot\\text{Alan})$, $r = \\text{Alan}/s$, sinüs teoremi $c/\\sin C = 2R$</li>
</ul>
</div>`
};
