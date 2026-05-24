window.LISE_MAT_L53 = {

/* ============================================================
   ENGLISH VERSION
   ============================================================ */
en: `<p class="l-text"><strong>A single equation in two unknowns has infinitely many solutions.</strong> Write $x + y = 10$ on the board and the pair $(1, 9)$ works; so does $(2, 8)$, $(3.5, 6.5)$, $(-4, 14)$, and every other point on a certain straight line. To pin a problem down to a <em>unique</em> answer, we usually need a second equation — a second relationship between the same unknowns. The pair of equations is then called a <strong>system</strong>, and finding the pair $(x, y)$ that satisfies <em>both</em> of them at once is what this lesson is about.</p>

<p class="l-text">Two equations, two unknowns is the simplest setting, and it appears everywhere: a mixture problem in chemistry, an age problem in everyday life, a meeting-point problem in physics, a break-even calculation in business. The methods you will meet here — substitution and elimination — are the same techniques that, in matrix form, solve systems with thousands of unknowns in engineering and computer science. Master them here on $2 \\times 2$ systems and the larger machinery in linear algebra will feel natural later.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognise a $2 \\times 2$ linear system in the standard form $ax + by = c$, $dx + ey = f$</li>
<li>Interpret a system geometrically as two lines and read the solution off as their intersection point</li>
<li>Solve a system by <strong>substitution</strong> — isolate one variable, plug into the other equation</li>
<li>Solve a system by <strong>elimination</strong> — scale rows and add to cancel a variable</li>
<li>Decide which method is faster for a given system based on the shape of the coefficients</li>
<li>Classify a system as having one solution, no solution, or infinitely many solutions from the coefficient ratios</li>
</ul>
</div>

<h2 class="lesson-title">1. Two Equations in Two Unknowns</h2>

<div class="calc-highlight"><strong>A linear equation in $x$ and $y$ can be written $ax + by = c$.</strong> Two of them, sharing the same unknowns, make a <em>system</em>. Solving the system means finding every pair $(x, y)$ that satisfies both equations at the same time.</div>

<div class="calc-formula"><div class="formula-label">GENERAL $2 \\times 2$ LINEAR SYSTEM</div><div class="formula-main">$$\\begin{cases} a\\,x + b\\,y = c \\\\ d\\,x + e\\,y = f \\end{cases}$$</div><div class="formula-sub">Here $a, b, c, d, e, f$ are given numbers (coefficients and constants). The unknowns are $x$ and $y$. A <em>solution</em> is a pair of numbers $(x_0, y_0)$ that makes both equations true when substituted.</div></div>

<p class="l-text">A single linear equation $ax + by = c$ (with $a$ and $b$ not both zero) graphs as a straight line in the plane. Every point on the line is a solution; every point off the line is not. Two equations therefore mean two lines, and a common solution must lie on <em>both</em> lines — that is, at their intersection.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coefficient</div><div class="card-body">The number multiplying an unknown. In $3x - 5y = 7$ the coefficient of $x$ is $3$, the coefficient of $y$ is $-5$.</div></div>
<div class="calc-card"><div class="card-title">Constant term</div><div class="card-body">The number with no unknown attached. In $3x - 5y = 7$ the constant term is $7$.</div></div>
<div class="calc-card"><div class="card-title">Solution</div><div class="card-body">A pair $(x_0, y_0)$ that turns <em>both</em> equations into true numerical statements when substituted.</div></div>
</div>

<div class="calc-example"><div class="example-label">CHECKING A CANDIDATE</div><div class="example-body">Is $(x, y) = (2, 3)$ a solution of $\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}$?<br><br>Equation 1: $2 + 3 = 5$ &check;<br>Equation 2: $2(2) - 3 = 4 - 3 = 1$ &check;<br><br>Both hold, so <strong>$(2, 3)$ is a solution</strong>. (And we will soon see it is the only one.)</div></div>

<h2 class="lesson-title">2. Geometric Picture: Two Lines in the Plane</h2>

<div class="calc-highlight"><strong>Every solution of a system is an intersection point of the corresponding lines.</strong> Two distinct lines in a plane can meet in exactly three ways: at one point, at no point, or at every point.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">ONE SOLUTION</div><div class="compare-item">The two lines cross at a single point</div><div class="compare-item">Different slopes</div><div class="compare-item">System is called <em>consistent and independent</em></div></div><div class="compare-col"><div class="compare-title">NO SOLUTION</div><div class="compare-item">The lines are parallel and never meet</div><div class="compare-item">Same slope, different y-intercepts</div><div class="compare-item">System is called <em>inconsistent</em></div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">INFINITELY MANY SOLUTIONS</div><div class="compare-item">The two equations describe the <em>same</em> line</div><div class="compare-item">Coefficients of one are a multiple of the other</div><div class="compare-item">Every point on the line is a solution</div></div><div class="compare-col"><div class="compare-title">QUICK TEST FROM COEFFICIENTS</div><div class="compare-item">Compare the ratios $\\dfrac{a}{d}$, $\\dfrac{b}{e}$, $\\dfrac{c}{f}$</div><div class="compare-item">All three equal &rarr; same line (infinite)</div><div class="compare-item">First two equal, third different &rarr; parallel (none)</div><div class="compare-item">First two differ &rarr; single intersection (one)</div></div></div>

<div class="calc-graph"><div id="plot-l53-cases-en" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three sample pairs of lines on the same axes. The blue pair crosses at one point (unique solution). The orange pair is parallel (no solution). The green pair is two copies of the same line drawn slightly apart for visibility (infinite solutions). The geometric category determines what your algebra will produce.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var xs2=xs.slice();
var y1a=xs.map(function(x){return 2-x;});
var y1b=xs.map(function(x){return 3*x-2;});
var y2a=xs.map(function(x){return 2*x+1;});
var y2b=xs.map(function(x){return 2*x-2;});
var y3a=xs.map(function(x){return x;});
var y3b=xs.map(function(x){return x+0.04;});
var t1a={x:xs,y:y1a,mode:'lines',name:'one: line A',line:{color:'#3b82f6',width:2.5}};
var t1b={x:xs,y:y1b,mode:'lines',name:'one: line B',line:{color:'#60a5fa',width:2.5,dash:'dash'}};
var t2a={x:xs,y:y2a,mode:'lines',name:'none: line A',line:{color:'#f59e0b',width:2.5}};
var t2b={x:xs,y:y2b,mode:'lines',name:'none: line B',line:{color:'#fbbf24',width:2.5,dash:'dash'}};
var t3a={x:xs,y:y3a,mode:'lines',name:'infinite: same line',line:{color:'#10b981',width:2.5}};
var t3b={x:xs,y:y3b,mode:'lines',name:'infinite: same line',line:{color:'#34d399',width:2.5,dash:'dash'}};
var mk={x:[1],y:[1],mode:'markers',name:'intersection (1, 1)',marker:{color:'#3b82f6',size:11,symbol:'circle'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l53-cases-en',[t1a,t1b,t2a,t2b,t3a,t3b,mk],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Why three cases and not more?</strong> In two dimensions, two distinct straight lines either cross once, never cross (parallel), or — if they happen to be the same line written two different ways — overlap completely. There is no fourth possibility. Sections 7 will return to this and show what the algebra looks like in each case.</div>

<h2 class="lesson-title">3. The Substitution Method</h2>

<div class="calc-highlight"><strong>Substitution is the most direct algebraic method:</strong> isolate one unknown from one equation, plug the resulting expression into the other equation, solve a single equation in one variable, then back-substitute.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Pick whichever equation has the simplest coefficient for one of the unknowns (ideally $1$ or $-1$).</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Solve that equation for the chosen unknown in terms of the other.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Substitute the expression into the <em>other</em> equation.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Solve the resulting one-variable equation.</div></div>
<div class="calc-card"><div class="card-title">Step 5</div><div class="card-body">Back-substitute the value you just found to recover the other unknown.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; SUBSTITUTION</div><div class="example-body">Solve the system $\\begin{cases} x + y = 7 \\\\ 2x - y = 5 \\end{cases}$.<br><br><strong>Step 1.</strong> The first equation is the simpler one (every coefficient is $\\pm 1$).<br><br><strong>Step 2.</strong> Solve it for $y$: $\\;y = 7 - x$.<br><br><strong>Step 3.</strong> Substitute into the second equation:<br>$2x - (7 - x) = 5$.<br><br><strong>Step 4.</strong> Expand and solve:<br>$2x - 7 + x = 5 \\;\\Rightarrow\\; 3x = 12 \\;\\Rightarrow\\; x = 4$.<br><br><strong>Step 5.</strong> Back-substitute: $y = 7 - 4 = 3$.<br><br><strong>Solution:</strong> $(x, y) = (4, 3)$. Check: $4 + 3 = 7$ &check;, $2(4) - 3 = 5$ &check;.</div></div>

<div class="think-box"><div class="think-label">CHECKPOINT</div><div class="think-body">In the example above, would the algebra have been any worse if you had instead isolated $x$ from equation 1, giving $x = 7 - y$, and substituted? No — it would have been equally clean. The choice of which variable to isolate is often a matter of taste when both have coefficient $\\pm 1$. When one variable has coefficient $1$ and the other does not, always isolate the one with coefficient $1$.</div></div>

<h2 class="lesson-title">4. The Elimination Method</h2>

<div class="calc-highlight"><strong>Elimination kills one variable by adding (or subtracting) the equations after scaling them so that the coefficients of one unknown become opposite numbers.</strong> No isolation, no substitution — just one disciplined arithmetic move.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Look at the coefficients of $x$ (or $y$) in both equations. Decide which variable you want to eliminate.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Multiply each equation by a constant so that the chosen variable's coefficients become opposites (e.g. $+6$ and $-6$).</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Add the two scaled equations. The chosen variable disappears, leaving a single equation in the other unknown.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Solve and then back-substitute into either original equation to find the second unknown.</div></div>
</div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ELIMINATION</div><div class="example-body">Solve $\\begin{cases} 3x + 2y = 16 \\\\ 5x - 2y = 8 \\end{cases}$.<br><br><strong>Step 1.</strong> The coefficients of $y$ are already $+2$ and $-2$ — opposites. We can eliminate $y$ with no scaling.<br><br><strong>Step 2.</strong> Add the equations:<br>$(3x + 2y) + (5x - 2y) = 16 + 8$.<br>$8x = 24 \\;\\Rightarrow\\; x = 3$.<br><br><strong>Step 3.</strong> Back-substitute into equation 1: $3(3) + 2y = 16 \\;\\Rightarrow\\; 2y = 7 \\;\\Rightarrow\\; y = 3.5$.<br><br><strong>Solution:</strong> $(x, y) = (3,\\, 3.5)$. Check: $3(3) + 2(3.5) = 9 + 7 = 16$ &check;, $5(3) - 2(3.5) = 15 - 7 = 8$ &check;.</div></div>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; ELIMINATION WITH SCALING</div><div class="example-body">Solve $\\begin{cases} 2x + 3y = 12 \\\\ 4x - y = 10 \\end{cases}$.<br><br>To eliminate $x$, multiply equation 1 by $2$ and subtract: $(4x + 6y) - (4x - y) = 24 - 10$, giving $7y = 14$, so $y = 2$. Back-substitute into equation 1: $2x + 6 = 12 \\Rightarrow x = 3$.<br><br>Alternatively, to eliminate $y$, multiply equation 2 by $3$: $12x - 3y = 30$. Add to equation 1: $14x = 42 \\Rightarrow x = 3$.<br><br><strong>Solution:</strong> $(3, 2)$.</div></div>

<h2 class="lesson-title">5. Which Method, When?</h2>

<div class="calc-highlight"><strong>The two methods always reach the same answer.</strong> The question is which one is faster <em>for this particular system</em>. A two-second glance at the coefficients usually decides.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prefer substitution when&hellip;</div><div class="card-body">One variable already has coefficient $1$ or $-1$ (or is already isolated). Then "solve for it" is free, and the substitution writes itself.</div></div>
<div class="calc-card"><div class="card-title">Prefer elimination when&hellip;</div><div class="card-body">Coefficients are small integers that are easy to scale into opposites — especially when the coefficients of one variable are already opposites (or equal, so a single subtraction works).</div></div>
<div class="calc-card"><div class="card-title">Either works when&hellip;</div><div class="card-body">Coefficients are arbitrary. In an exam, pick whichever you think is less error-prone for you personally.</div></div>
</div>

<div class="l-note"><strong>Practical tip.</strong> Whichever method you use, <em>always check your answer</em> by substituting back into both original equations. A 10-second verification catches arithmetic slips that would otherwise cost full marks.</div>

<h2 class="lesson-title">6. Three Equations in Three Unknowns &mdash; A First Look</h2>

<div class="calc-highlight"><strong>Adding a third unknown adds a third dimension.</strong> A linear equation in $x$, $y$, $z$ graphs as a flat <em>plane</em> in 3D space. Three such planes generically meet at a single point — the solution of the system.</div>

<div class="calc-formula"><div class="formula-label">GENERAL $3 \\times 3$ LINEAR SYSTEM</div><div class="formula-main">$$\\begin{cases} a_1 x + b_1 y + c_1 z = d_1 \\\\ a_2 x + b_2 y + c_2 z = d_2 \\\\ a_3 x + b_3 y + c_3 z = d_3 \\end{cases}$$</div></div>

<p class="l-text">The same two ideas — substitution and elimination — still work. The standard approach is repeated elimination: combine two equations to kill one variable, then combine the result with a third equation to kill another, reducing the problem to a single equation in one unknown. Back-substitute twice.</p>

<div class="calc-example"><div class="example-label">WORKED EXAMPLE &mdash; $3 \\times 3$ SYSTEM</div><div class="example-body">Solve $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$.<br><br><strong>Eliminate $z$ from equations 1 and 3</strong> by adding them: $2x + 3y = 8$. Call this $(\\ast)$.<br><br><strong>Eliminate $z$ from equations 1 and 2</strong> by subtracting equation 1 from equation 2: $x - 2y = -3$. Call this $(\\ast\\ast)$.<br><br>Now solve the $2 \\times 2$ subsystem $\\{(\\ast), (\\ast\\ast)\\}$. From $(\\ast\\ast)$: $x = 2y - 3$. Substitute into $(\\ast)$: $2(2y - 3) + 3y = 8 \\Rightarrow 7y = 14 \\Rightarrow y = 2$. Then $x = 1$. Finally from equation 1: $z = 6 - 1 - 2 = 3$.<br><br><strong>Solution:</strong> $(x, y, z) = (1, 2, 3)$.</div></div>

<div class="calc-graph"><div id="plot-l53-3d-en" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>What this plot shows:</strong> three planes in 3D space, one for each equation. They meet at a single point, marked in orange — that is the unique solution. Rotate the figure to confirm that all three sheets actually pass through the marked point.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var grid=[];for(var i=-2;i<=4;i+=0.5){grid.push(i);}
var xx=[];var yy=[];for(var i=0;i<grid.length;i++){xx.push(grid.slice());yy.push(grid.map(function(){return grid[i];}));}
var z1=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(6-grid[j]-grid[i]);}z1.push(r);}
var z2=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(3-2*grid[j]+grid[i]);}z2.push(r);}
var z3=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(grid[j]+2*grid[i]-2);}z3.push(r);}
var p1={x:grid,y:grid,z:z1,type:'surface',name:'x+y+z=6',colorscale:[[0,'#3b82f6'],[1,'#1e3a8a']],opacity:0.55,showscale:false};
var p2={x:grid,y:grid,z:z2,type:'surface',name:'2x-y+z=3',colorscale:[[0,'#10b981'],[1,'#065f46']],opacity:0.55,showscale:false};
var p3={x:grid,y:grid,z:z3,type:'surface',name:'x+2y-z=2',colorscale:[[0,'#a855f7'],[1,'#581c87']],opacity:0.55,showscale:false};
var pt={x:[1],y:[2],z:[3],mode:'markers',type:'scatter3d',name:'solution (1, 2, 3)',marker:{color:'#f59e0b',size:7}};
var lay={paper_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'}},margin:{t:30,r:0,b:0,l:0},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l53-3d-en',[p1,p2,p3,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Looking ahead.</strong> The same idea scales up: $n$ equations in $n$ unknowns can be solved by systematic elimination, and the resulting algorithm has a name (Gauss elimination) that you will meet again in a linear algebra course. The $2 \\times 2$ examples in this lesson are the friendly entry point.</div>

<h2 class="lesson-title">7. No Solution and Infinitely Many Solutions</h2>

<div class="calc-highlight"><strong>How does the algebra signal "no solution" or "every point is a solution"?</strong> Both cases produce an unmistakable arithmetic fingerprint: either a contradiction like $0 = 5$, or a tautology like $0 = 0$.</div>

<div class="calc-example"><div class="example-label">NO SOLUTION &mdash; PARALLEL LINES</div><div class="example-body">Solve $\\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 5 \\end{cases}$.<br><br>Multiply equation 1 by $2$: $2x + 4y = 8$. Subtract equation 2: $0 = 3$.<br><br>This is a false statement, no value of $x$ or $y$ can make it true. The system has <strong>no solution</strong>.<br><br><em>Geometric check:</em> rewrite both equations in slope form. Equation 1: $y = -\\tfrac{1}{2}x + 2$. Equation 2: $y = -\\tfrac{1}{2}x + \\tfrac{5}{4}$. Same slope, different y-intercepts &mdash; parallel.</div></div>

<div class="calc-graph"><div id="plot-l53-parallel-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> the two lines $x + 2y = 4$ and $2x + 4y = 5$ plotted on the same axes. They run perfectly parallel, never meeting &mdash; which is why the algebra produced the impossible $0 = 3$.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (4-x)/2;});
var l2=xs.map(function(x){return (5-2*x)/4;});
var t1={x:xs,y:l1,mode:'lines',name:'x+2y=4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:l2,mode:'lines',name:'2x+4y=5',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l53-parallel-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">INFINITELY MANY SOLUTIONS &mdash; COINCIDENT LINES</div><div class="example-body">Solve $\\begin{cases} x + 2y = 4 \\\\ 3x + 6y = 12 \\end{cases}$.<br><br>Equation 2 is exactly $3 \\times$ equation 1, so they describe the same line. Eliminating: multiply equation 1 by $3$ and subtract equation 2 to get $0 = 0$, a tautology.<br><br>Every pair $(x, y)$ satisfying $x + 2y = 4$ is a solution. We can describe the solution set as $\\{(x, y) : x = 4 - 2y\\}$ &mdash; one free parameter, infinitely many specific solutions.</div></div>

<div class="calc-graph"><div id="plot-l53-coincident-en" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>What this plot shows:</strong> $x + 2y = 4$ and $3x + 6y = 12$ as two slightly offset traces of the <em>same</em> line, drawn that way so you can see them. Algebraically they overlap perfectly. Every point on the line is a solution.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (4-x)/2;});
var l2=xs.map(function(x){return (4-x)/2 + 0.03;});
var t1={x:xs,y:l1,mode:'lines',name:'x+2y=4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:l2,mode:'lines',name:'3x+6y=12',line:{color:'#10b981',width:2.5,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l53-coincident-en',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">SUMMARY OF CASES</div><div class="formula-main">$$\\begin{array}{l|l|l} \\textbf{Algebraic outcome} & \\textbf{Geometry} & \\textbf{Solutions} \\\\ \\hline \\text{unique values for } x, y & \\text{lines cross} & 1 \\\\ \\text{contradiction like } 0 = 5 & \\text{parallel lines} & 0 \\\\ \\text{tautology like } 0 = 0 & \\text{same line} & \\infty \\end{array}$$</div></div>

<h2 class="lesson-title">8. Word Problems: From Sentences to Systems</h2>

<div class="calc-highlight"><strong>The hard step in a word problem is rarely the algebra &mdash; it is the translation.</strong> Pick a letter for each unknown, write one equation per relationship the problem mentions, then solve the system mechanically.</div>

<div class="calc-example"><div class="example-label">WORD PROBLEM 1 &mdash; AGES</div><div class="example-body">A father is currently three times as old as his son. In 12 years, he will be only twice as old as his son. How old are they now?<br><br><strong>Let</strong> $f$ = father's current age, $s$ = son's current age.<br><br><strong>Equation 1</strong> (now): $f = 3s$.<br><strong>Equation 2</strong> (in 12 years): $f + 12 = 2(s + 12)$, i.e. $f = 2s + 12$.<br><br>Substitute equation 1 into equation 2: $3s = 2s + 12 \\Rightarrow s = 12$, so $f = 36$.<br><br><strong>Answer:</strong> the son is 12, the father is 36. Check: in 12 years the son is 24 and the father is 48 &mdash; indeed twice as old.</div></div>

<div class="calc-example"><div class="example-label">WORD PROBLEM 2 &mdash; MIXTURE</div><div class="example-body">A pharmacist needs to prepare 200 mL of a 30% saline solution by mixing a 20% solution with a 50% solution. How many millilitres of each should they use?<br><br><strong>Let</strong> $a$ = mL of 20% solution, $b$ = mL of 50% solution.<br><br><strong>Equation 1</strong> (total volume): $a + b = 200$.<br><strong>Equation 2</strong> (total salt): $0.20\\,a + 0.50\\,b = 0.30 \\cdot 200 = 60$.<br><br>From equation 1: $b = 200 - a$. Substitute into equation 2: $0.20a + 0.50(200 - a) = 60 \\Rightarrow 0.20a + 100 - 0.50a = 60 \\Rightarrow -0.30a = -40 \\Rightarrow a = 133.\\overline{3}$ mL.<br><br>Then $b = 66.\\overline{6}$ mL.<br><br><strong>Answer:</strong> $\\approx 133.3$ mL of the 20% solution and $\\approx 66.7$ mL of the 50% solution.</div></div>

<div class="calc-example"><div class="example-label">WORD PROBLEM 3 &mdash; SPEED, DISTANCE, TIME</div><div class="example-body">Two cars leave the same city heading in opposite directions. One drives at 60 km/h and the other at 80 km/h. After how many hours will they be 350 km apart, and what distance has each travelled?<br><br><strong>Let</strong> $t$ = time in hours, $d_1, d_2$ = distances of each car. Three unknowns, three relationships:<br>$d_1 = 60 t$, $d_2 = 80 t$, $d_1 + d_2 = 350$.<br><br>Substitute the first two into the third: $60 t + 80 t = 350 \\Rightarrow 140 t = 350 \\Rightarrow t = 2.5$ hours.<br><br>Then $d_1 = 150$ km, $d_2 = 200$ km.<br><br><strong>Answer:</strong> after $2.5$ hours; the slow car has driven 150 km, the fast car 200 km.</div></div>

<div class="think-box"><div class="think-label">CHECKLIST FOR WORD PROBLEMS</div><div class="think-body">(1) Read the problem twice. (2) Write down what each letter stands for, with units. (3) Translate each sentence containing a numerical relation into one equation. (4) Count: number of unknowns should equal number of equations. (5) Solve. (6) Plug the answer back into the <em>original sentence</em>, not just the equations, to make sure the answer makes physical sense (no negative ages, no 1000% concentrations).</div></div>

<h2 class="lesson-title">9. Practice Problems</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">Solve by substitution: $\\begin{cases} y = 2x - 1 \\\\ 3x + y = 14 \\end{cases}$.<br><br><strong>Solution.</strong> Substitute equation 1 into equation 2: $3x + (2x - 1) = 14 \\Rightarrow 5x = 15 \\Rightarrow x = 3$. Then $y = 2(3) - 1 = 5$. Answer: $(3, 5)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">Solve by elimination: $\\begin{cases} 2x + 3y = 13 \\\\ 4x - 3y = 5 \\end{cases}$.<br><br><strong>Solution.</strong> Add: $6x = 18 \\Rightarrow x = 3$. Then $2(3) + 3y = 13 \\Rightarrow y = 7/3$. Answer: $(3,\\, 7/3)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">Solve $\\begin{cases} 3x - 2y = 4 \\\\ 5x + y = 11 \\end{cases}$ by your preferred method.<br><br><strong>Solution.</strong> Equation 2 has a coefficient of $1$ on $y$ &mdash; substitution is faster. $y = 11 - 5x$. Substitute: $3x - 2(11 - 5x) = 4 \\Rightarrow 13x = 26 \\Rightarrow x = 2$. Then $y = 1$. Answer: $(2, 1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; CLASSIFY</div><div class="example-body">Without fully solving, classify each system:<br>(a) $\\begin{cases} 2x + 4y = 6 \\\\ x + 2y = 3 \\end{cases}$ &nbsp;(b) $\\begin{cases} 3x - y = 1 \\\\ 6x - 2y = 5 \\end{cases}$ &nbsp;(c) $\\begin{cases} x + y = 4 \\\\ 2x - y = 1 \\end{cases}$.<br><br><strong>(a)</strong> Equation 1 is twice equation 2 (both sides). <em>Same line</em>, infinite solutions.<br><strong>(b)</strong> Coefficients ratio: $3/6 = 1/2$ and $-1/-2 = 1/2$, but constants $1/5 \\neq 1/2$. Parallel, <em>no solution</em>.<br><strong>(c)</strong> Coefficients $1/2 \\neq 1/(-1)$. Different slopes, <em>unique solution</em>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">Solve $\\begin{cases} \\dfrac{x}{2} + \\dfrac{y}{3} = 5 \\\\ \\dfrac{x}{3} - \\dfrac{y}{4} = 1 \\end{cases}$.<br><br><strong>Solution.</strong> Clear fractions first. Multiply equation 1 by 6: $3x + 2y = 30$. Multiply equation 2 by 12: $4x - 3y = 12$. Now eliminate $y$: multiply the first by 3 and the second by 2 then add: $9x + 6y + 8x - 6y = 90 + 24 \\Rightarrow 17x = 114 \\Rightarrow x = 114/17$. (You may then back-substitute for $y$.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; AGE WORD PROBLEM</div><div class="example-body">Ali is 4 years older than Berk. The sum of their ages is 30. How old is each?<br><br><strong>Solution.</strong> Let $a$ = Ali, $b$ = Berk. Then $a = b + 4$ and $a + b = 30$. Substitute: $(b+4) + b = 30 \\Rightarrow b = 13$, so $a = 17$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; TICKET PROBLEM</div><div class="example-body">A cinema sold 200 tickets in one screening and collected 1500 TL. Adult tickets cost 10 TL, child tickets cost 5 TL. How many of each were sold?<br><br><strong>Solution.</strong> Let $a$ = adults, $c$ = children. Then $a + c = 200$ and $10a + 5c = 1500$. From equation 1: $c = 200 - a$. Substitute: $10a + 5(200 - a) = 1500 \\Rightarrow 5a = 500 \\Rightarrow a = 100$, $c = 100$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; $3 \\times 3$ SYSTEM</div><div class="example-body">Solve $\\begin{cases} x + y + z = 9 \\\\ x - y + z = 3 \\\\ x + y - z = 1 \\end{cases}$.<br><br><strong>Solution.</strong> Subtract equation 2 from equation 1: $2y = 6 \\Rightarrow y = 3$. Subtract equation 3 from equation 1: $2z = 8 \\Rightarrow z = 4$. Then equation 1 gives $x = 9 - 3 - 4 = 2$. Answer: $(2, 3, 4)$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">LESSON SUMMARY</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>A $2 \\times 2$ linear system is two equations of the form $ax + by = c$ sharing the same unknowns</li>
<li>Geometrically: two lines that meet in 1 point (unique), 0 points (parallel), or every point (coincident)</li>
<li>Substitution: isolate one variable, plug into the other equation, solve, back-substitute</li>
<li>Elimination: scale the equations so one variable's coefficients become opposites, then add</li>
<li>Substitution shines when a variable has coefficient $\\pm 1$; elimination shines when coefficients are small integers ready to scale</li>
<li>$0 = $ nonzero &rArr; no solution; $0 = 0$ &rArr; infinite solutions; otherwise unique</li>
<li>Word problems: pick letters, write one equation per relationship, solve, sanity-check the answer in real units</li>
<li>The same methods extend to $3 \\times 3$ and larger systems via repeated elimination</li>
</ul>
</div>`,

/* ============================================================
   TURKISH VERSION
   ============================================================ */
tr: `<p class="l-text"><strong>İki bilinmeyenli tek bir denklemin sonsuz çözümü vardır.</strong> Tahtaya $x + y = 10$ yaz; $(1, 9)$ çifti uyar; $(2, 8)$, $(3.5, 6.5)$, $(-4, 14)$ ve belirli bir doğru üzerindeki her nokta da. Problemi <em>tek</em> bir cevaba indirgemek için genellikle ikinci bir denklem gerekir &mdash; aynı bilinmeyenler arasında ikinci bir bağıntı. Bu denklem çiftine <strong>denklem sistemi</strong> denir; her iki denklemi de aynı anda sağlayan $(x, y)$ ikilisini bulmak bu dersin konusudur.</p>

<p class="l-text">İki bilinmeyenli iki denklem en sade ortamdır ve her yerde karşımıza çıkar: kimyada karışım problemi, gündelik yaşamda yaş problemi, fizikte buluşma problemi, ticarette başabaş hesabı. Burada öğreneceğin <strong>yerine koyma</strong> ve <strong>yok etme</strong> yöntemleri, matris biçiminde mühendislik ve bilgisayar bilimindeki binlerce bilinmeyenli sistemleri de çözen tekniklerdir. Burada $2 \\times 2$ sistemlerde ustalaş, ileride lineer cebirin daha büyük makinesi sana doğal gelecek.</p>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">ÖĞRENECEKLERİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$ax + by = c$, $dx + ey = f$ standart biçimindeki $2 \\times 2$ doğrusal sistemi tanımak</li>
<li>Sistemi geometrik olarak iki doğru ve çözümü onların kesişim noktası olarak yorumlamak</li>
<li><strong>Yerine koyma</strong> yöntemiyle sistem çözmek &mdash; bir değişkeni izole et, diğerine yerleştir</li>
<li><strong>Yok etme (eliminasyon)</strong> yöntemiyle sistem çözmek &mdash; denklemleri ölçekleyip toplayarak bir değişkeni yok et</li>
<li>Katsayıların biçimine bakarak hangi yöntemin daha hızlı olduğuna karar vermek</li>
<li>Katsayı oranlarına bakarak sistemi tek çözüm / çözümsüz / sonsuz çözüm olarak sınıflandırmak</li>
</ul>
</div>

<h2 class="lesson-title">1. İki Bilinmeyenli Doğrusal Sistem</h2>

<div class="calc-highlight"><strong>$x$ ve $y$ cinsinden bir doğrusal denklem $ax + by = c$ biçiminde yazılır.</strong> Aynı bilinmeyenleri paylaşan iki tanesi bir <em>sistem</em> oluşturur. Sistemi çözmek, her iki denklemi aynı anda sağlayan tüm $(x, y)$ çiftlerini bulmak demektir.</div>

<div class="calc-formula"><div class="formula-label">GENEL $2 \\times 2$ DOĞRUSAL SİSTEM</div><div class="formula-main">$$\\begin{cases} a\\,x + b\\,y = c \\\\ d\\,x + e\\,y = f \\end{cases}$$</div><div class="formula-sub">Burada $a, b, c, d, e, f$ verilen sayılardır (katsayılar ve sabitler). Bilinmeyenler $x$ ve $y$'dir. <em>Çözüm</em>, yerine konduğunda her iki denklemi de doğru kılan bir $(x_0, y_0)$ ikilisidir.</div></div>

<p class="l-text">Tek bir $ax + by = c$ doğrusal denklemi ($a$ ve $b$ birlikte sıfır değilse) düzlemde bir doğru çizer. Doğru üzerindeki her nokta bir çözümdür; doğru dışındaki hiçbir nokta çözüm değildir. İki denklem demek iki doğru demektir; ortak bir çözüm her iki doğru üzerinde olmalı &mdash; yani kesişim noktasında.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katsayı</div><div class="card-body">Bilinmeyeni çarpan sayı. $3x - 5y = 7$ denkleminde $x$'in katsayısı $3$, $y$'nin katsayısı $-5$'tir.</div></div>
<div class="calc-card"><div class="card-title">Sabit terim</div><div class="card-body">Hiçbir bilinmeyenle birlikte olmayan sayı. $3x - 5y = 7$ denkleminde sabit terim $7$'dir.</div></div>
<div class="calc-card"><div class="card-title">Çözüm</div><div class="card-body">Yerine konulduğunda <em>her iki</em> denklemi de doğru sayısal eşitliklere dönüştüren bir $(x_0, y_0)$ ikilisi.</div></div>
</div>

<div class="calc-example"><div class="example-label">ADAY DEĞERİ KONTROL ETME</div><div class="example-body">$(x, y) = (2, 3)$ ikilisi $\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}$ sisteminin çözümü müdür?<br><br>1. denklem: $2 + 3 = 5$ &check;<br>2. denklem: $2(2) - 3 = 4 - 3 = 1$ &check;<br><br>Her ikisi de sağlanıyor, demek ki <strong>$(2, 3)$ bir çözümdür</strong>. (Birazdan göreceğimiz gibi, tek çözüm de odur.)</div></div>

<h2 class="lesson-title">2. Geometrik Yorum: Düzlemde İki Doğru</h2>

<div class="calc-highlight"><strong>Sistemin her çözümü, ilgili doğruların bir kesişim noktasıdır.</strong> Düzlemdeki iki farklı doğru tam olarak üç biçimde buluşabilir: bir noktada, hiç noktada veya her noktada.</div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">TEK ÇÖZÜM</div><div class="compare-item">İki doğru tek bir noktada kesişir</div><div class="compare-item">Eğimleri farklıdır</div><div class="compare-item">Sisteme <em>tutarlı ve bağımsız</em> denir</div></div><div class="compare-col"><div class="compare-title">ÇÖZÜMSÜZ</div><div class="compare-item">Doğrular paraleldir, hiç kesişmezler</div><div class="compare-item">Eğimleri aynı, y-kesimleri farklıdır</div><div class="compare-item">Sisteme <em>tutarsız</em> denir</div></div></div>

<div class="calc-compare"><div class="compare-col"><div class="compare-title">SONSUZ ÇÖZÜM</div><div class="compare-item">İki denklem <em>aynı</em> doğruyu betimler</div><div class="compare-item">Bir denklemin katsayıları diğerinin katıdır</div><div class="compare-item">Doğru üzerindeki her nokta bir çözümdür</div></div><div class="compare-col"><div class="compare-title">KATSAYILARDAN HIZLI TEST</div><div class="compare-item">$\\dfrac{a}{d}$, $\\dfrac{b}{e}$, $\\dfrac{c}{f}$ oranlarını karşılaştır</div><div class="compare-item">Üçü de eşit &rarr; aynı doğru (sonsuz çözüm)</div><div class="compare-item">İlk ikisi eşit, üçüncü farklı &rarr; paralel (çözümsüz)</div><div class="compare-item">İlk ikisi farklı &rarr; tek kesişim (tek çözüm)</div></div></div>

<div class="calc-graph"><div id="plot-l53-cases-tr" class="plotly-graph" style="height:420px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> aynı eksenler üzerinde üç örnek doğru çifti. Mavi çift tek bir noktada kesişiyor (tek çözüm). Turuncu çift paralel (çözümsüz). Yeşil çift, görünür olsun diye birbirinden hafifçe ayrı çizilmiş aynı doğrunun iki kopyası (sonsuz çözüm). Geometrik kategori, cebrin ne üreteceğini belirler.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var y1a=xs.map(function(x){return 2-x;});
var y1b=xs.map(function(x){return 3*x-2;});
var y2a=xs.map(function(x){return 2*x+1;});
var y2b=xs.map(function(x){return 2*x-2;});
var y3a=xs.map(function(x){return x;});
var y3b=xs.map(function(x){return x+0.04;});
var t1a={x:xs,y:y1a,mode:'lines',name:'tek: A',line:{color:'#3b82f6',width:2.5}};
var t1b={x:xs,y:y1b,mode:'lines',name:'tek: B',line:{color:'#60a5fa',width:2.5,dash:'dash'}};
var t2a={x:xs,y:y2a,mode:'lines',name:'yok: A',line:{color:'#f59e0b',width:2.5}};
var t2b={x:xs,y:y2b,mode:'lines',name:'yok: B',line:{color:'#fbbf24',width:2.5,dash:'dash'}};
var t3a={x:xs,y:y3a,mode:'lines',name:'sonsuz: aynı',line:{color:'#10b981',width:2.5}};
var t3b={x:xs,y:y3b,mode:'lines',name:'sonsuz: aynı',line:{color:'#34d399',width:2.5,dash:'dash'}};
var mk={x:[1],y:[1],mode:'markers',name:'kesişim (1, 1)',marker:{color:'#3b82f6',size:11,symbol:'circle'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l53-cases-tr',[t1a,t1b,t2a,t2b,t3a,t3b,mk],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>Neden tam üç durum?</strong> İki boyutta, iki farklı doğru ya bir kez kesişir, ya hiç kesişmez (paralel), ya da &mdash; iki farklı şekilde yazılmış aynı doğru iseler &mdash; tamamen üst üste biner. Dördüncü bir olasılık yoktur. 7. bölüm bu konuya geri dönüp her durumda cebrin nasıl göründüğünü gösterecek.</div>

<h2 class="lesson-title">3. Yerine Koyma Yöntemi</h2>

<div class="calc-highlight"><strong>Yerine koyma en doğrudan cebirsel yöntemdir:</strong> bir denklemden bir bilinmeyeni yalnız bırak, elde ettiğin ifadeyi diğer denkleme yerleştir, tek değişkenli bir denklem çöz, sonra geri yerine koy.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Bir bilinmeyenin katsayısının en sade olduğu denklemi seç (ideal olarak $1$ ya da $-1$).</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">O denklemi seçtiğin bilinmeyen için, diğer bilinmeyen cinsinden çöz.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">Bu ifadeyi <em>diğer</em> denkleme yerleştir.</div></div>
<div class="calc-card"><div class="card-title">Adım 4</div><div class="card-body">Elde ettiğin tek değişkenli denklemi çöz.</div></div>
<div class="calc-card"><div class="card-title">Adım 5</div><div class="card-body">Bulduğun değeri geri yerleştirerek diğer bilinmeyeni de bul.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; YERİNE KOYMA</div><div class="example-body">$\\begin{cases} x + y = 7 \\\\ 2x - y = 5 \\end{cases}$ sistemini çöz.<br><br><strong>Adım 1.</strong> 1. denklem daha sade (her katsayı $\\pm 1$).<br><br><strong>Adım 2.</strong> $y$ için çöz: $\\;y = 7 - x$.<br><br><strong>Adım 3.</strong> 2. denkleme yerleştir:<br>$2x - (7 - x) = 5$.<br><br><strong>Adım 4.</strong> Aç ve çöz:<br>$2x - 7 + x = 5 \\;\\Rightarrow\\; 3x = 12 \\;\\Rightarrow\\; x = 4$.<br><br><strong>Adım 5.</strong> Geri yerleştir: $y = 7 - 4 = 3$.<br><br><strong>Çözüm:</strong> $(x, y) = (4, 3)$. Kontrol: $4 + 3 = 7$ &check;, $2(4) - 3 = 5$ &check;.</div></div>

<div class="think-box"><div class="think-label">DURAK</div><div class="think-body">Yukarıdaki örnekte, 1. denklemden $y$ yerine $x$'i yalnız bırakıp $x = 7 - y$ ile başlasaydık, cebir daha mı zor olurdu? Hayır &mdash; aynı derece temiz olurdu. Her iki değişkenin de katsayısı $\\pm 1$ olduğunda hangisini yalnız bırakacağın çoğunlukla bir zevk meselesi. Biri 1 katsayılı, diğeri değilse, her zaman 1 katsayılı olanı seç.</div></div>

<h2 class="lesson-title">4. Yok Etme (Eliminasyon) Yöntemi</h2>

<div class="calc-highlight"><strong>Yok etme; denklemleri ölçeklendirip toplayarak (ya da çıkararak), bir bilinmeyenin katsayılarını ters işaretli yapıp o bilinmeyeni denklemden silmek demektir.</strong> İzole etme yok, yerine koyma yok &mdash; tek bir disiplinli aritmetik hareketi.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Her iki denklemdeki $x$'in (ya da $y$'nin) katsayılarına bak. Hangi değişkeni yok edeceğine karar ver.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">Her denklemi öyle bir sabitle çarp ki seçtiğin değişkenin katsayıları zıt işaretli olsun (örneğin $+6$ ve $-6$).</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">İki ölçeklenmiş denklemi topla. Seçtiğin değişken kaybolur, geriye diğer bilinmeyende tek bir denklem kalır.</div></div>
<div class="calc-card"><div class="card-title">Adım 4</div><div class="card-body">Çöz ve ardından özgün denklemlerden birine geri yerleştirerek ikinci bilinmeyeni de bul.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; YOK ETME</div><div class="example-body">$\\begin{cases} 3x + 2y = 16 \\\\ 5x - 2y = 8 \\end{cases}$ sistemini çöz.<br><br><strong>Adım 1.</strong> $y$'nin katsayıları zaten $+2$ ve $-2$ &mdash; zıt işaretliler. Ölçeklemeden $y$'yi yok edebiliriz.<br><br><strong>Adım 2.</strong> Denklemleri topla:<br>$(3x + 2y) + (5x - 2y) = 16 + 8$.<br>$8x = 24 \\;\\Rightarrow\\; x = 3$.<br><br><strong>Adım 3.</strong> 1. denkleme geri yerleştir: $3(3) + 2y = 16 \\;\\Rightarrow\\; 2y = 7 \\;\\Rightarrow\\; y = 3.5$.<br><br><strong>Çözüm:</strong> $(x, y) = (3,\\, 3.5)$. Kontrol: $3(3) + 2(3.5) = 9 + 7 = 16$ &check;, $5(3) - 2(3.5) = 15 - 7 = 8$ &check;.</div></div>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; ÖLÇEKLEMELİ YOK ETME</div><div class="example-body">$\\begin{cases} 2x + 3y = 12 \\\\ 4x - y = 10 \\end{cases}$ sistemini çöz.<br><br>$x$'i yok etmek için 1. denklemi $2$ ile çarp ve çıkar: $(4x + 6y) - (4x - y) = 24 - 10$, yani $7y = 14$, dolayısıyla $y = 2$. 1. denkleme geri yerleştir: $2x + 6 = 12 \\Rightarrow x = 3$.<br><br>Alternatif olarak, $y$'yi yok etmek için 2. denklemi $3$ ile çarp: $12x - 3y = 30$. 1. denkleme ekle: $14x = 42 \\Rightarrow x = 3$.<br><br><strong>Çözüm:</strong> $(3, 2)$.</div></div>

<h2 class="lesson-title">5. Hangi Yöntem, Ne Zaman?</h2>

<div class="calc-highlight"><strong>İki yöntem her zaman aynı sonuca ulaşır.</strong> Asıl soru, <em>bu belirli sistem</em> için hangisinin daha hızlı olduğudur. Katsayılara iki saniyelik bir bakış genellikle karar verir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerine koymayı tercih et eğer&hellip;</div><div class="card-body">Bir değişkenin katsayısı zaten $1$ veya $-1$ ise (veya zaten yalnızsa). O zaman "ona göre çöz" bedavadır ve yerleştirme kendiliğinden çıkar.</div></div>
<div class="calc-card"><div class="card-title">Yok etmeyi tercih et eğer&hellip;</div><div class="card-body">Katsayılar küçük tam sayılarsa &mdash; özellikle bir değişkenin katsayıları zaten zıt işaretliyse (ya da eşitse, tek bir çıkarma yeter).</div></div>
<div class="calc-card"><div class="card-title">İkisi de iş görür eğer&hellip;</div><div class="card-body">Katsayılar rastgele ise. Sınavda, sana en az hata yaptıracak olanı seç.</div></div>
</div>

<div class="l-note"><strong>Pratik ipucu.</strong> Hangi yöntemi kullanırsan kullan, <em>cevabını her zaman her iki orijinal denklemde geri yerine koyarak kontrol et</em>. 10 saniyelik doğrulama, tam puan kaybettirecek aritmetik kaymaları yakalar.</div>

<h2 class="lesson-title">6. Üç Bilinmeyenli Üç Denklem &mdash; Kısa Giriş</h2>

<div class="calc-highlight"><strong>Üçüncü bir bilinmeyen eklemek üçüncü bir boyut ekler.</strong> $x$, $y$, $z$ cinsinden doğrusal bir denklem 3 boyutlu uzayda bir <em>düzlem</em> çizer. Üç böyle düzlem genel olarak tek bir noktada buluşur &mdash; sistemin çözümü.</div>

<div class="calc-formula"><div class="formula-label">GENEL $3 \\times 3$ DOĞRUSAL SİSTEM</div><div class="formula-main">$$\\begin{cases} a_1 x + b_1 y + c_1 z = d_1 \\\\ a_2 x + b_2 y + c_2 z = d_2 \\\\ a_3 x + b_3 y + c_3 z = d_3 \\end{cases}$$</div></div>

<p class="l-text">Aynı iki fikir &mdash; yerine koyma ve yok etme &mdash; hâlâ işe yarar. Standart yaklaşım tekrar tekrar yok etmedir: iki denklemi birleştirip bir değişkeni yok et, sonra sonucu üçüncü denklemle birleştirip başka bir değişkeni yok et; problemi tek bilinmeyenli tek bir denkleme indirgersin. Sonra iki kez geri yerleştirirsin.</p>

<div class="calc-example"><div class="example-label">ÇÖZÜMLÜ ÖRNEK &mdash; $3 \\times 3$ SİSTEM</div><div class="example-body">$\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$ sistemini çöz.<br><br><strong>1. ve 3. denklemlerden $z$'yi yok et</strong> toplayarak: $2x + 3y = 8$. Buna $(\\ast)$ diyelim.<br><br><strong>1. ve 2. denklemlerden $z$'yi yok et</strong>: 1. denklemi 2. denklemden çıkar: $x - 2y = -3$. Buna $(\\ast\\ast)$ diyelim.<br><br>Şimdi $\\{(\\ast), (\\ast\\ast)\\}$ alt-sistemini çöz. $(\\ast\\ast)$'dan: $x = 2y - 3$. $(\\ast)$'a yerleştir: $2(2y - 3) + 3y = 8 \\Rightarrow 7y = 14 \\Rightarrow y = 2$. Sonra $x = 1$. Son olarak 1. denklemden: $z = 6 - 1 - 2 = 3$.<br><br><strong>Çözüm:</strong> $(x, y, z) = (1, 2, 3)$.</div></div>

<div class="calc-graph"><div id="plot-l53-3d-tr" class="plotly-graph" style="height:460px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> 3 boyutlu uzayda her denklem için bir düzlem. Tek bir noktada kesişiyorlar &mdash; turuncu işaretli nokta benzersiz çözüm. Şekli döndür ve üç yüzeyin de gerçekten o noktadan geçtiğini doğrula.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var grid=[];for(var i=-2;i<=4;i+=0.5){grid.push(i);}
var z1=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(6-grid[j]-grid[i]);}z1.push(r);}
var z2=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(3-2*grid[j]+grid[i]);}z2.push(r);}
var z3=[];for(var i=0;i<grid.length;i++){var r=[];for(var j=0;j<grid.length;j++){r.push(grid[j]+2*grid[i]-2);}z3.push(r);}
var p1={x:grid,y:grid,z:z1,type:'surface',name:'x+y+z=6',colorscale:[[0,'#3b82f6'],[1,'#1e3a8a']],opacity:0.55,showscale:false};
var p2={x:grid,y:grid,z:z2,type:'surface',name:'2x-y+z=3',colorscale:[[0,'#10b981'],[1,'#065f46']],opacity:0.55,showscale:false};
var p3={x:grid,y:grid,z:z3,type:'surface',name:'x+2y-z=2',colorscale:[[0,'#a855f7'],[1,'#581c87']],opacity:0.55,showscale:false};
var pt={x:[1],y:[2],z:[3],mode:'markers',type:'scatter3d',name:'çözüm (1, 2, 3)',marker:{color:'#f59e0b',size:7}};
var lay={paper_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},scene:{xaxis:{title:'x',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'},yaxis:{title:'y',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'},zaxis:{title:'z',gridcolor:'rgba(255,255,255,0.1)',backgroundcolor:'#0a0a0a'}},margin:{t:30,r:0,b:0,l:0},legend:{orientation:'h',y:1.05,xanchor:'center',x:0.5,font:{size:10}}};
Plotly.newPlot('plot-l53-3d-tr',[p1,p2,p3,pt],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="l-note"><strong>İleriye bakış.</strong> Aynı fikir ölçeklenir: $n$ bilinmeyenli $n$ denklem sistemli yok etme ile çözülebilir ve ortaya çıkan algoritmanın bir adı vardır (Gauss yok etme) &mdash; lineer cebir dersinde tekrar karşılaşacaksın. Bu derste gördüğün $2 \\times 2$ örnekler dostane bir giriş kapısıdır.</div>

<h2 class="lesson-title">7. Çözümsüz ve Sonsuz Çözüm</h2>

<div class="calc-highlight"><strong>Cebir "çözümsüz" veya "her nokta çözüm" durumlarını nasıl haber verir?</strong> Her iki durum da hatasız tanınan bir aritmetik iz bırakır: ya $0 = 5$ gibi bir çelişki ya da $0 = 0$ gibi bir totoloji.</div>

<div class="calc-example"><div class="example-label">ÇÖZÜMSÜZ &mdash; PARALEL DOĞRULAR</div><div class="example-body">$\\begin{cases} x + 2y = 4 \\\\ 2x + 4y = 5 \\end{cases}$ sistemini çöz.<br><br>1. denklemi $2$ ile çarp: $2x + 4y = 8$. 2. denklemden çıkar: $0 = 3$.<br><br>Bu yanlış bir ifadedir; hiçbir $x$ veya $y$ değeri onu doğru yapamaz. Sistemin <strong>çözümü yoktur</strong>.<br><br><em>Geometrik kontrol:</em> her iki denklemi eğim biçiminde yaz. 1. denklem: $y = -\\tfrac{1}{2}x + 2$. 2. denklem: $y = -\\tfrac{1}{2}x + \\tfrac{5}{4}$. Aynı eğim, farklı y-kesimleri &mdash; paralel.</div></div>

<div class="calc-graph"><div id="plot-l53-parallel-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> aynı eksenler üzerinde $x + 2y = 4$ ve $2x + 4y = 5$ doğruları. Mükemmel paralel, hiç buluşmuyorlar &mdash; cebrin imkânsız $0 = 3$ üretmesinin nedeni budur.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (4-x)/2;});
var l2=xs.map(function(x){return (5-2*x)/4;});
var t1={x:xs,y:l1,mode:'lines',name:'x+2y=4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:l2,mode:'lines',name:'2x+4y=5',line:{color:'#f59e0b',width:2.5,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l53-parallel-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-example"><div class="example-label">SONSUZ ÇÖZÜM &mdash; ÇAKIŞIK DOĞRULAR</div><div class="example-body">$\\begin{cases} x + 2y = 4 \\\\ 3x + 6y = 12 \\end{cases}$ sistemini çöz.<br><br>2. denklem tam olarak 1. denklemin $3$ katıdır, yani aynı doğruyu betimlerler. Yok etme: 1. denklemi $3$ ile çarp ve 2. denklemi çıkar: $0 = 0$, bir totoloji.<br><br>$x + 2y = 4$ denklemini sağlayan her $(x, y)$ ikilisi bir çözümdür. Çözüm kümesini $\\{(x, y) : x = 4 - 2y\\}$ olarak yazabiliriz &mdash; bir serbest parametre, sonsuz tane belirli çözüm.</div></div>

<div class="calc-graph"><div id="plot-l53-coincident-tr" class="plotly-graph" style="height:380px"></div><div class="graph-caption"><strong>Grafiğin gösterdiği:</strong> $x + 2y = 4$ ve $3x + 6y = 12$, görünür olsun diye birbirinden hafifçe kaydırılmış olarak çizilen <em>aynı</em> doğrunun iki izi. Cebirsel olarak birbirine tam oturur. Doğru üzerindeki her nokta bir çözümdür.</div></div>

<script>setTimeout(function(){
if(typeof Plotly==='undefined')return;
var xs=[];for(var i=-50;i<=50;i++){xs.push(i/10);}
var l1=xs.map(function(x){return (4-x)/2;});
var l2=xs.map(function(x){return (4-x)/2 + 0.03;});
var t1={x:xs,y:l1,mode:'lines',name:'x+2y=4',line:{color:'#3b82f6',width:2.5}};
var t2={x:xs,y:l2,mode:'lines',name:'3x+6y=12',line:{color:'#10b981',width:2.5,dash:'dash'}};
var lay={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8',family:'Geist'},xaxis:{title:'x',range:[-5,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},yaxis:{title:'y',range:[-3,5],gridcolor:'rgba(255,255,255,0.06)',zerolinecolor:'rgba(255,255,255,0.25)'},margin:{t:30,r:30,b:50,l:50},legend:{orientation:'h',y:1.12,xanchor:'center',x:0.5}};
Plotly.newPlot('plot-l53-coincident-tr',[t1,t2],lay,{responsive:true,displayModeBar:false});
},250);</script>

<div class="calc-formula"><div class="formula-label">DURUMLARIN ÖZETİ</div><div class="formula-main">$$\\begin{array}{l|l|l} \\textbf{Cebirsel sonuç} & \\textbf{Geometri} & \\textbf{Çözüm sayısı} \\\\ \\hline x, y \\text{ için tek değer} & \\text{doğrular kesişir} & 1 \\\\ 0 = 5 \\text{ gibi çelişki} & \\text{paralel doğrular} & 0 \\\\ 0 = 0 \\text{ gibi totoloji} & \\text{aynı doğru} & \\infty \\end{array}$$</div></div>

<h2 class="lesson-title">8. Sözel Problemler: Cümleden Sisteme</h2>

<div class="calc-highlight"><strong>Sözel problemde zor adım nadiren cebirdir &mdash; çeviridir.</strong> Her bilinmeyene bir harf seç, problemin bahsettiği her bağıntı için bir denklem yaz, sonra sistemi mekanik şekilde çöz.</div>

<div class="calc-example"><div class="example-label">PROBLEM 1 &mdash; YAŞLAR</div><div class="example-body">Bir baba şu anda oğlunun üç katı yaştadır. 12 yıl sonra, sadece iki katı olacaktır. Şu anki yaşları nedir?<br><br><strong>Olsun</strong> $b$ = babanın şu anki yaşı, $o$ = oğulun şu anki yaşı.<br><br><strong>1. denklem</strong> (şimdi): $b = 3o$.<br><strong>2. denklem</strong> (12 yıl sonra): $b + 12 = 2(o + 12)$, yani $b = 2o + 12$.<br><br>1. denklemi 2.'ye yerleştir: $3o = 2o + 12 \\Rightarrow o = 12$, yani $b = 36$.<br><br><strong>Cevap:</strong> oğul 12, baba 36 yaşında. Kontrol: 12 yıl sonra oğul 24, baba 48 &mdash; gerçekten iki katı.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2 &mdash; KARIŞIM</div><div class="example-body">Bir eczacı, %20'lik bir tuzlu su çözeltisini %50'lik bir çözeltiyle karıştırarak 200 mL'lik %30'luk bir tuzlu su çözeltisi hazırlamak istiyor. Her birinden kaç mL kullanmalıdır?<br><br><strong>Olsun</strong> $a$ = %20'lik çözeltiden mL, $b$ = %50'lik çözeltiden mL.<br><br><strong>1. denklem</strong> (toplam hacim): $a + b = 200$.<br><strong>2. denklem</strong> (toplam tuz): $0.20\\,a + 0.50\\,b = 0.30 \\cdot 200 = 60$.<br><br>1. denklemden: $b = 200 - a$. 2. denkleme yerleştir: $0.20a + 0.50(200 - a) = 60 \\Rightarrow 0.20a + 100 - 0.50a = 60 \\Rightarrow -0.30a = -40 \\Rightarrow a = 133.\\overline{3}$ mL.<br><br>Sonra $b = 66.\\overline{6}$ mL.<br><br><strong>Cevap:</strong> %20'lik çözeltiden $\\approx 133.3$ mL ve %50'lik çözeltiden $\\approx 66.7$ mL.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3 &mdash; HIZ, MESAFE, ZAMAN</div><div class="example-body">İki araba aynı şehirden zıt yönlere doğru yola çıkıyor. Biri 60 km/sa, diğeri 80 km/sa hızla gidiyor. Kaç saat sonra aralarındaki mesafe 350 km olur ve her biri ne kadar yol almıştır?<br><br><strong>Olsun</strong> $t$ = saat cinsinden zaman, $d_1, d_2$ = her arabanın aldığı yol. Üç bilinmeyen, üç bağıntı:<br>$d_1 = 60 t$, $d_2 = 80 t$, $d_1 + d_2 = 350$.<br><br>İlk ikisini üçüncüye yerleştir: $60 t + 80 t = 350 \\Rightarrow 140 t = 350 \\Rightarrow t = 2.5$ saat.<br><br>Sonra $d_1 = 150$ km, $d_2 = 200$ km.<br><br><strong>Cevap:</strong> 2.5 saat sonra; yavaş araba 150 km, hızlı araba 200 km yol almıştır.</div></div>

<div class="think-box"><div class="think-label">SÖZEL PROBLEM KONTROL LİSTESİ</div><div class="think-body">(1) Problemi iki kez oku. (2) Her harfin neyi temsil ettiğini birim ile birlikte yaz. (3) Sayısal bağıntı içeren her cümleyi bir denkleme çevir. (4) Say: bilinmeyen sayısı denklem sayısına eşit olmalı. (5) Çöz. (6) Cevabını sadece denklemlere değil, <em>orijinal cümleye</em> de geri koy; fiziksel olarak anlamlı olduğunu kontrol et (negatif yaş yok, %1000 yoğunluk yok).</div></div>

<h2 class="lesson-title">9. Alıştırmalar</h2>

<div class="calc-example"><div class="example-label">PROBLEM 1</div><div class="example-body">Yerine koyma ile çöz: $\\begin{cases} y = 2x - 1 \\\\ 3x + y = 14 \\end{cases}$.<br><br><strong>Çözüm.</strong> 1. denklemi 2.'ye yerleştir: $3x + (2x - 1) = 14 \\Rightarrow 5x = 15 \\Rightarrow x = 3$. Sonra $y = 2(3) - 1 = 5$. Cevap: $(3, 5)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 2</div><div class="example-body">Yok etme ile çöz: $\\begin{cases} 2x + 3y = 13 \\\\ 4x - 3y = 5 \\end{cases}$.<br><br><strong>Çözüm.</strong> Topla: $6x = 18 \\Rightarrow x = 3$. Sonra $2(3) + 3y = 13 \\Rightarrow y = 7/3$. Cevap: $(3,\\, 7/3)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 3</div><div class="example-body">Tercih ettiğin yöntemle çöz: $\\begin{cases} 3x - 2y = 4 \\\\ 5x + y = 11 \\end{cases}$.<br><br><strong>Çözüm.</strong> 2. denklemde $y$'nin katsayısı $1$ &mdash; yerine koyma daha hızlı. $y = 11 - 5x$. Yerleştir: $3x - 2(11 - 5x) = 4 \\Rightarrow 13x = 26 \\Rightarrow x = 2$. Sonra $y = 1$. Cevap: $(2, 1)$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 4 &mdash; SINIFLANDIRMA</div><div class="example-body">Tam çözmeden, her sistemi sınıflandır:<br>(a) $\\begin{cases} 2x + 4y = 6 \\\\ x + 2y = 3 \\end{cases}$ &nbsp;(b) $\\begin{cases} 3x - y = 1 \\\\ 6x - 2y = 5 \\end{cases}$ &nbsp;(c) $\\begin{cases} x + y = 4 \\\\ 2x - y = 1 \\end{cases}$.<br><br><strong>(a)</strong> 1. denklem, 2. denklemin iki katıdır (her iki taraf). <em>Aynı doğru</em>, sonsuz çözüm.<br><strong>(b)</strong> Katsayı oranları: $3/6 = 1/2$ ve $-1/-2 = 1/2$, ancak sabitler $1/5 \\neq 1/2$. Paralel, <em>çözümsüz</em>.<br><strong>(c)</strong> Katsayılar $1/2 \\neq 1/(-1)$. Eğimler farklı, <em>tek çözüm</em>.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 5</div><div class="example-body">$\\begin{cases} \\dfrac{x}{2} + \\dfrac{y}{3} = 5 \\\\ \\dfrac{x}{3} - \\dfrac{y}{4} = 1 \\end{cases}$ sistemini çöz.<br><br><strong>Çözüm.</strong> Önce kesirleri temizle. 1. denklemi 6 ile çarp: $3x + 2y = 30$. 2. denklemi 12 ile çarp: $4x - 3y = 12$. Şimdi $y$'yi yok et: birincisini 3, ikincisini 2 ile çarp ve topla: $9x + 6y + 8x - 6y = 90 + 24 \\Rightarrow 17x = 114 \\Rightarrow x = 114/17$. (Sonra $y$ için geri yerleştirebilirsin.)</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 6 &mdash; YAŞ PROBLEMİ</div><div class="example-body">Ali, Berk'ten 4 yaş büyüktür. Yaşlarının toplamı 30'dur. Her biri kaç yaşındadır?<br><br><strong>Çözüm.</strong> $a$ = Ali, $b$ = Berk olsun. O zaman $a = b + 4$ ve $a + b = 30$. Yerleştir: $(b+4) + b = 30 \\Rightarrow b = 13$, yani $a = 17$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 7 &mdash; BİLET PROBLEMİ</div><div class="example-body">Bir sinema bir seansta 200 bilet sattı ve 1500 TL topladı. Yetişkin bileti 10 TL, çocuk bileti 5 TL. Her birinden kaç tane satılmıştır?<br><br><strong>Çözüm.</strong> $y$ = yetişkin, $ç$ = çocuk olsun. O zaman $y + ç = 200$ ve $10y + 5ç = 1500$. 1. denklemden: $ç = 200 - y$. Yerleştir: $10y + 5(200 - y) = 1500 \\Rightarrow 5y = 500 \\Rightarrow y = 100$, $ç = 100$.</div></div>

<div class="calc-example"><div class="example-label">PROBLEM 8 &mdash; $3 \\times 3$ SİSTEM</div><div class="example-body">$\\begin{cases} x + y + z = 9 \\\\ x - y + z = 3 \\\\ x + y - z = 1 \\end{cases}$ sistemini çöz.<br><br><strong>Çözüm.</strong> 2. denklemi 1. denklemden çıkar: $2y = 6 \\Rightarrow y = 3$. 3. denklemi 1. denklemden çıkar: $2z = 8 \\Rightarrow z = 4$. Sonra 1. denklemden $x = 9 - 3 - 4 = 2$. Cevap: $(2, 3, 4)$.</div></div>

<div class="lesson-outcomes" style="background:rgba(59,130,246,0.06);border-left:3px solid #3b82f6;padding:1rem 1.2rem;margin:2rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#3b82f6;margin-bottom:0.6rem">DERS ÖZETİ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>$2 \\times 2$ doğrusal sistem, aynı bilinmeyenleri paylaşan $ax + by = c$ biçiminde iki denklemdir</li>
<li>Geometrik olarak: 1 noktada (tek), 0 noktada (paralel) veya her noktada (çakışık) buluşan iki doğru</li>
<li>Yerine koyma: bir değişkeni yalnız bırak, diğer denkleme yerleştir, çöz, geri yerleştir</li>
<li>Yok etme: bir değişkenin katsayıları zıt işaretli olacak şekilde denklemleri ölçeklendir, sonra topla</li>
<li>Yerine koyma; bir değişkenin katsayısı $\\pm 1$ olduğunda parlar; yok etme; katsayılar ölçeklendirilmeye hazır küçük tam sayılar olduğunda parlar</li>
<li>$0 = $ sıfırdan farklı sayı &rArr; çözümsüz; $0 = 0$ &rArr; sonsuz çözüm; aksi halde tek çözüm</li>
<li>Sözel problemler: harf seç, her bağıntı için bir denklem yaz, çöz, cevabı gerçek birimlerle akıl süzgecinden geçir</li>
<li>Aynı yöntemler tekrarlı yok etme ile $3 \\times 3$ ve daha büyük sistemlere uzar</li>
</ul>
</div>`

};
