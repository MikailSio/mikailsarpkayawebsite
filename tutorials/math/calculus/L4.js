window.CALCULUS_L4 = {

en: `<p class="l-text">The <strong>chain rule</strong> is the differentiation tool for <strong>composite functions</strong> — functions built by feeding one function into another. Whenever you see "function of a function" ($\\sin(x^2)$, $e^{\\cos x}$, $\\sqrt{1+t^3}$), the chain rule tells you how to differentiate it. This lesson develops the rule from first principles, extends it to multiple variables via tree diagrams, then applies it to two classical problems: <strong>implicit differentiation</strong> and <strong>related rates</strong>.</p>

<div class="calc-highlight"><strong>The key idea:</strong> If $y$ depends on $u$ and $u$ depends on $x$, then a small change in $x$ produces a change in $u$, which produces a change in $y$. The rates multiply: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$. The Leibniz notation almost shows you the rule itself — the $du$'s appear to cancel.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU WILL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Derive the single-variable chain rule from the limit definition</li>
<li>Apply the chain rule to two-, three-, and many-layer compositions</li>
<li>Use the multi-variable chain rule with tree-diagram bookkeeping</li>
<li>Differentiate inverse functions via the chain rule</li>
<li>Perform implicit differentiation on curves like $x^2+y^2=25$</li>
<li>Solve classical related-rates problems: shadow length, ladder, water level</li>
</ul>
</div>

<h2 class="l-heading" id="s1">1. Composite Functions — Review</h2>

<p class="l-text">A <strong>composite function</strong> is built by chaining two functions. If $g$ takes $x$ to $u=g(x)$, and $f$ takes $u$ to $y=f(u)$, then the composition $f\\circ g$ takes $x$ directly to $y$:</p>

<div class="calc-formula"><span class="formula-label">Composition</span><div class="formula-main">$$ (f\\circ g)(x) \\;=\\; f(g(x)) $$</div><div class="formula-sub">First apply $g$ (inner), then apply $f$ (outer). Order matters: in general $f\\circ g \\neq g\\circ f$.</div></div>

<p class="l-text"><strong>Decomposing a function into layers</strong> is the first step before differentiating. The inner function is the one being applied first; the outer function wraps around it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y = \\sin(x^2)$</div><div class="card-body">Inner: $u=x^2$. Outer: $\\sin(u)$. Apply squaring first, then sine.</div></div>
<div class="calc-card"><div class="card-title">$y = \\sqrt{1+t^3}$</div><div class="card-body">Inner: $u=1+t^3$. Outer: $\\sqrt{u}$. Compute polynomial, then take the square root.</div></div>
<div class="calc-card"><div class="card-title">$y = e^{\\cos x}$</div><div class="card-body">Inner: $u=\\cos x$. Outer: $e^u$. Compute cosine, then exponentiate.</div></div>
<div class="calc-card"><div class="card-title">$y = \\ln(\\tan x)$</div><div class="card-body">Inner: $u=\\tan x$. Outer: $\\ln u$. Tangent first, then natural log.</div></div>
</div>

<div class="calc-graph"><div class="graph-title">Composition Visualized: $y = \\sin(x^2)$</div>
<div id="plot-composite-en" style="width:100%;height:320px;"></div>
<script>setTimeout(function(){
var xs=[],u=[],y=[];
for(var i=-300;i<=300;i++){var v=i/100;xs.push(v);u.push(v*v);y.push(Math.sin(v*v));}
var inner={x:xs,y:u,mode:"lines",name:"u = x²",line:{color:"#a78bfa",width:2.2}};
var outer={x:xs,y:y,mode:"lines",name:"y = sin(u) = sin(x²)",line:{color:"#c8a96e",width:2.6}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"value",range:[-2,10]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.98}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-composite-en",[inner,outer],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">Purple: the inner $u=x^2$ grows quadratically. Gold: the outer $\\sin(u)$ oscillates faster and faster as $|x|$ grows because the inner input grows quadratically — the chain rule will reveal exactly why the oscillation rate increases.</div></div>

<h2 class="l-heading" id="s2">2. Chain Rule for Single Variable (Full Derivation)</h2>

<p class="l-text">Let $y=f(u)$ and $u=g(x)$, with $g$ differentiable at $x$ and $f$ differentiable at $u=g(x)$. We want $\\dfrac{dy}{dx}$. Start from the definition:</p>

<div class="calc-formula"><span class="formula-label">Derivative as Limit</span><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x} $$</div><div class="formula-sub">where $\\Delta y = f(g(x+\\Delta x)) - f(g(x))$ and $\\Delta u = g(x+\\Delta x)-g(x)$.</div></div>

<p class="l-text"><strong>Heuristic derivation (algebra trick).</strong> Multiply and divide by $\\Delta u$:</p>

<div class="calc-formula"><span class="formula-label">Multiply / Divide by $\\Delta u$</span><div class="formula-main">$$ \\frac{\\Delta y}{\\Delta x} \\;=\\; \\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x} $$</div><div class="formula-sub">Provided $\\Delta u\\neq 0$. As $\\Delta x\\to 0$, differentiability gives $\\Delta u\\to 0$ too, so each factor approaches a derivative.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Take the limit of each factor</div><div class="step-detail">$\\dfrac{\\Delta y}{\\Delta u}\\to f'(u)$ as $\\Delta u\\to 0$; $\\dfrac{\\Delta u}{\\Delta x}\\to g'(x)$ as $\\Delta x\\to 0$. Continuity of $g$ (implied by differentiability) ties the two limits together.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Product of limits = limit of product</div><div class="step-detail">Both factors converge, so the product rule for limits gives $\\dfrac{dy}{dx} = f'(g(x))\\,g'(x)$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Patch the $\\Delta u = 0$ case</div><div class="step-detail">If $g$ is locally constant, the increment $\\Delta u$ can be zero. A careful proof uses an auxiliary function $E(u)$ (Carathéodory's trick) so the argument works even when $\\Delta u$ vanishes. The formula is unchanged.</div></div></div>
</div>

<div class="calc-formula"><span class="formula-label">The Chain Rule (Single Variable)</span><div class="formula-main">$$ \\boxed{\\;\\frac{dy}{dx} \\;=\\; \\frac{dy}{du}\\cdot \\frac{du}{dx} \\;=\\; f'(g(x))\\,g'(x)\\;} $$</div><div class="formula-sub">"Derivative of the outer (evaluated at the inner) times derivative of the inner." Leibniz form makes the cancellation visual; Lagrange form makes the evaluation point explicit.</div></div>

<p class="l-text"><strong>Worked example.</strong> Differentiate $y=\\sin(x^2)$. Outer $f(u)=\\sin u$ gives $f'(u)=\\cos u$. Inner $g(x)=x^2$ gives $g'(x)=2x$. Therefore</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\cos(x^2)\\cdot 2x \\;=\\; 2x\\cos(x^2). $$</div></div>

<div class="calc-graph"><div class="graph-title">$\\sin(x^2)$ and Its Derivative $2x\\cos(x^2)$</div>
<div id="plot-derivsinx2-en" style="width:100%;height:300px;"></div>
<script>setTimeout(function(){
var xs=[],fx=[],dfx=[];
for(var i=-400;i<=400;i++){var v=i/100;xs.push(v);fx.push(Math.sin(v*v));dfx.push(2*v*Math.cos(v*v));}
var t1={x:xs,y:fx,mode:"lines",name:"y = sin(x²)",line:{color:"#c8a96e",width:2.4}};
var t2={x:xs,y:dfx,mode:"lines",name:"dy/dx = 2x·cos(x²)",line:{color:"#4ecdc4",width:2.0}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y, dy/dx"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.02}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-derivsinx2-en",[t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">As $|x|$ grows, the derivative amplitude grows because the factor $2x$ is unbounded — the function oscillates faster and faster, and its slopes grow without bound, even though $|\\sin(x^2)|\\le 1$.</div></div>

<h2 class="l-heading" id="s3">3. Multiple Layers of Composition</h2>

<p class="l-text">The chain rule extends to any number of nested layers. If $y=f(u)$, $u=g(v)$, $v=h(x)$, then</p>

<div class="calc-formula"><span class="formula-label">Three-Layer Chain</span><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\frac{dy}{du}\\cdot \\frac{du}{dv}\\cdot \\frac{dv}{dx}. $$</div><div class="formula-sub">Differentiate every layer, evaluate each at the proper inner expression, multiply.</div></div>

<p class="l-text"><strong>Example: $y = e^{\\cos x}$.</strong> Two layers: outer $e^u$, inner $u=\\cos x$. Then</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; e^{\\cos x}\\cdot (-\\sin x) \\;=\\; -\\sin x\\, e^{\\cos x}. $$</div></div>

<p class="l-text"><strong>Example: $y = \\sqrt{1+\\sin(x^2)}$.</strong> Three layers. Set $u = 1+\\sin(x^2)$, $v=\\sin(x^2)$, $w=x^2$. Then</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\frac{1}{2\\sqrt{u}}\\cdot \\cos(x^2)\\cdot 2x \\;=\\; \\frac{x\\cos(x^2)}{\\sqrt{1+\\sin(x^2)}}. $$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Onion Peeling</div><div class="card-body">Strip the outermost layer, differentiate it, multiply by the derivative of what is left inside. Repeat.</div></div>
<div class="calc-card"><div class="card-title">Inside-Out Evaluation</div><div class="card-body">When evaluating numerically, compute the innermost layer first, then move outward — opposite of how you take derivatives.</div></div>
<div class="calc-card"><div class="card-title">Always Multiply</div><div class="card-body">Plain composition leads to a product of derivatives, never a sum. Sums appear only with multiple paths (next section).</div></div>
</div>

<div class="l-note"><strong>Identifying layers.</strong> When in doubt, write $y = f(\\underbrace{g(\\underbrace{h(\\underbrace{x}_{x})}_{w})}_{u})$ with explicit $\\underbrace$ labels and differentiate each.</div>

<h2 class="l-heading" id="s4">4. Multi-Variable Chain Rule (Tree Diagrams)</h2>

<p class="l-text">When the dependent quantity depends on several intermediate variables, we get one chain-rule term <em>per path</em> from the top of the dependency tree to the bottom.</p>

<div class="calc-formula"><span class="formula-label">Two-Path Chain Rule</span><div class="formula-main">$$ z=f(x,y),\\quad x=x(t),\\quad y=y(t) \\;\\Longrightarrow\\; \\frac{dz}{dt} \\;=\\; \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} \\;+\\; \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}. $$</div><div class="formula-sub">Two paths from $z$ down to $t$: one through $x$, one through $y$. Sum their contributions.</div></div>

<div class="calc-graph"><div class="graph-title">Tree Diagram: $z(t)=f(x(t),y(t))$</div>
<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
<circle cx="300" cy="30" r="22" fill="none" stroke="#c8a96e" stroke-width="2"/>
<text x="300" y="35" fill="#c8a96e" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">z</text>
<circle cx="180" cy="130" r="22" fill="none" stroke="#4ecdc4" stroke-width="2"/>
<text x="180" y="135" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">x</text>
<circle cx="420" cy="130" r="22" fill="none" stroke="#4ecdc4" stroke-width="2"/>
<text x="420" y="135" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">y</text>
<circle cx="300" cy="225" r="22" fill="none" stroke="#a78bfa" stroke-width="2"/>
<text x="300" y="230" fill="#a78bfa" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">t</text>
<line x1="284" y1="46" x2="196" y2="114" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="316" y1="46" x2="404" y2="114" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="194" y1="146" x2="284" y2="210" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="406" y1="146" x2="316" y2="210" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<text x="218" y="85" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="middle">∂z/∂x</text>
<text x="382" y="85" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="middle">∂z/∂y</text>
<text x="220" y="195" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">dx/dt</text>
<text x="380" y="195" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">dy/dt</text>
</svg>
<div class="graph-caption">Two paths from $z$ to $t$. For each path, multiply the derivatives along it. Sum the products over all paths.</div></div>

<p class="l-text"><strong>Worked example.</strong> Let $z = x^2 + y^2$, $x=\\cos t$, $y=\\sin t$. Then $\\partial z/\\partial x = 2x$, $\\partial z/\\partial y = 2y$, $dx/dt=-\\sin t$, $dy/dt=\\cos t$. So</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dz}{dt} \\;=\\; 2\\cos t \\cdot (-\\sin t) + 2\\sin t\\cdot \\cos t \\;=\\; 0. $$</div></div>

<p class="l-text">This matches intuition: along the unit circle, $z=x^2+y^2=1$ is constant, so its time derivative is zero. The chain rule confirms it.</p>

<div class="calc-formula"><span class="formula-label">Total Derivative (Differential Form)</span><div class="formula-main">$$ dz \\;=\\; \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy. $$</div><div class="formula-sub">A small change in $z$ splits into contributions from $x$ and $y$. Divide by $dt$ to recover the two-path formula; this differential form is the geometric heart of the chain rule.</div></div>

<p class="l-text"><strong>Generalisation.</strong> If $z=f(x_1,\\dots,x_n)$ and each $x_i$ depends on $t_1,\\dots,t_m$, then for each $t_j$</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{\\partial z}{\\partial t_j} \\;=\\; \\sum_{i=1}^{n} \\frac{\\partial z}{\\partial x_i}\\,\\frac{\\partial x_i}{\\partial t_j}. $$</div></div>

<div class="calc-graph"><div class="graph-title">$z=x^2+y^2$ along the Unit Circle: $dz/dt = 0$</div>
<div id="plot-circle-en" style="width:100%;height:340px;"></div>
<script>setTimeout(function(){
var ts=[],xs=[],ys=[],zs=[];
for(var i=0;i<=200;i++){var t=i/200*2*Math.PI;ts.push(t);var x=Math.cos(t),y=Math.sin(t);xs.push(x);ys.push(y);zs.push(x*x+y*y);}
var t1={x:ts,y:zs,mode:"lines",name:"z(t) = x² + y² = 1",line:{color:"#c8a96e",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t",tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"z(t)",range:[0,2]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-circle-en",[t1],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">Along the unit circle parametrised by $(\\cos t, \\sin t)$, the radial-squared distance stays at 1. A horizontal line confirms $dz/dt = 0$, exactly what the multi-variable chain rule predicted.</div></div>

<h2 class="l-heading" id="s5">5. Implicit Differentiation Revisited</h2>

<p class="l-text">Sometimes $y$ is defined implicitly by an equation $F(x,y)=0$ and cannot easily be solved for $y$. The chain rule lets us differentiate both sides with respect to $x$, treating $y$ as an unknown function $y(x)$.</p>

<div class="calc-formula"><span class="formula-label">Implicit Differentiation Formula</span><div class="formula-main">$$ F(x,y)=0 \\;\\Longrightarrow\\; \\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial y}\\,\\frac{dy}{dx} = 0 \\;\\Longrightarrow\\; \\frac{dy}{dx} = -\\frac{\\partial F/\\partial x}{\\partial F/\\partial y}. $$</div><div class="formula-sub">Differentiate the implicit equation using the multi-variable chain rule, then solve for $dy/dx$. Requires $\\partial F/\\partial y \\neq 0$ at the point.</div></div>

<p class="l-text"><strong>Example: circle of radius 5.</strong> Differentiate $x^2 + y^2 = 25$ implicitly:</p>

<div class="calc-formula"><div class="formula-main">$$ 2x + 2y\\frac{dy}{dx} = 0 \\;\\Longrightarrow\\; \\frac{dy}{dx} = -\\frac{x}{y}. $$</div></div>

<p class="l-text">At the point $(3,4)$, the slope of the tangent is $-3/4$. At $(4,-3)$, the slope is $4/3$. No need to choose a branch $y=\\pm\\sqrt{25-x^2}$ — the chain rule handles both branches automatically.</p>

<div class="calc-formula"><span class="formula-label">Inverse Function Derivative</span><div class="formula-main">$$ y = f^{-1}(x) \\;\\Longrightarrow\\; \\frac{dy}{dx} = \\frac{1}{f'(y)}. $$</div><div class="formula-sub">From $f(y) = x$, apply the chain rule: $f'(y)\\,dy/dx = 1$. This is the chain rule giving us inverse-function derivatives.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\arcsin(x)$</div><div class="card-body">From $\\sin y = x$: $\\cos y\\, y' = 1$, so $y' = 1/\\cos y = 1/\\sqrt{1-x^2}$.</div></div>
<div class="calc-card"><div class="card-title">$\\arctan(x)$</div><div class="card-body">From $\\tan y = x$: $\\sec^2 y\\, y' = 1$, so $y' = 1/(1+x^2)$.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(x)$</div><div class="card-body">From $e^y = x$: $e^y\\, y' = 1$, so $y' = 1/e^y = 1/x$.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt[n]{x}$</div><div class="card-body">From $y^n = x$: $n y^{n-1}\\, y' = 1$, so $y' = 1/(n y^{n-1}) = \\tfrac{1}{n} x^{1/n - 1}$.</div></div>
</div>

<h2 class="l-heading" id="s6">6. Related Rates — Classical Applications</h2>

<p class="l-text">In <strong>related-rates problems</strong>, two or more quantities are connected by an equation, and each changes with time. The chain rule lets us link their rates: differentiate the equation with respect to $t$, insert known rates, solve for the unknown one.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Draw a picture. Label every length, angle, and quantity that changes with time.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Find a geometric relationship (Pythagoras, similar triangles, volume formula).</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Differentiate both sides with respect to $t$ using the chain rule.</div></div>
<div class="calc-card"><div class="card-title">Step 4</div><div class="card-body">Plug in instantaneous values and known rates; solve for the unknown rate.</div></div>
</div>

<h3 class="l-subheading">6A. Ladder Sliding Down a Wall</h3>

<p class="l-text">A 10-ft ladder leans against a vertical wall. The base is being pulled away from the wall at $2\\,\\text{ft/s}$. How fast is the top of the ladder sliding down when the base is $6\\,\\text{ft}$ from the wall?</p>

<div class="calc-graph"><div class="graph-title">Sliding Ladder Geometry</div>
<svg viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="240" x2="320" y2="240" stroke="rgba(235,230,220,0.4)" stroke-width="1.5"/>
<line x1="60" y1="40" x2="60" y2="240" stroke="rgba(235,230,220,0.4)" stroke-width="1.5"/>
<line x1="60" y1="70" x2="220" y2="240" stroke="#c8a96e" stroke-width="3"/>
<circle cx="60" cy="70" r="4" fill="#c8a96e"/>
<circle cx="220" cy="240" r="4" fill="#c8a96e"/>
<text x="40" y="160" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle">y</text>
<text x="140" y="258" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle">x</text>
<text x="155" y="145" fill="#c8a96e" font-family="monospace" font-size="12" text-anchor="middle">10</text>
<text x="225" y="225" fill="#a78bfa" font-family="monospace" font-size="11">dx/dt = +2</text>
<text x="30" y="60" fill="#a78bfa" font-family="monospace" font-size="11">dy/dt = ?</text>
</svg>
<div class="graph-caption">A ladder of length 10 ft. Let $x(t)$ be its horizontal distance from the wall and $y(t)$ its height. Pythagoras gives $x^2 + y^2 = 100$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Set up the equation</div><div class="step-detail">$x^2 + y^2 = 10^2 = 100$. Both $x(t)$ and $y(t)$ change with time.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Differentiate implicitly with respect to $t$</div><div class="step-detail">$2x\\,\\dfrac{dx}{dt} + 2y\\,\\dfrac{dy}{dt} = 0$. The chain rule produces the $dx/dt$ and $dy/dt$ factors automatically.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Plug in $x=6$, find $y$</div><div class="step-detail">$y = \\sqrt{100 - 36} = 8$. Known: $dx/dt = +2$. Substitute: $2(6)(2) + 2(8)\\,\\dfrac{dy}{dt} = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve</div><div class="step-detail">$24 + 16\\,\\dfrac{dy}{dt} = 0 \\;\\Longrightarrow\\; \\dfrac{dy}{dt} = -\\dfrac{3}{2}\\,\\text{ft/s}$. The negative sign means the top is sliding <em>down</em>.</div></div></div>
</div>

<h3 class="l-subheading">6B. Shadow Length</h3>

<p class="l-text">A 6-ft-tall person walks away from a 15-ft lamp post at $5\\,\\text{ft/s}$. How fast is the tip of the shadow moving along the ground?</p>

<p class="l-text">By similar triangles, if $x$ is the person's distance from the post and $s$ is the shadow length,</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{x+s}{15} = \\frac{s}{6} \\;\\Longrightarrow\\; 6(x+s) = 15 s \\;\\Longrightarrow\\; s = \\tfrac{2}{3}\\, x. $$</div></div>

<p class="l-text">The tip of the shadow is at position $x + s = x + \\tfrac{2}{3}x = \\tfrac{5}{3}x$ along the ground. Differentiate with respect to $t$:</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{d(x+s)}{dt} \\;=\\; \\frac{5}{3}\\,\\frac{dx}{dt} \\;=\\; \\frac{5}{3}\\cdot 5 \\;=\\; \\frac{25}{3}\\,\\text{ft/s}. $$</div></div>

<p class="l-text">So the tip races forward faster than the person walks — by a factor of $5/3$.</p>

<h3 class="l-subheading">6C. Water Level in an Inverted Cone</h3>

<p class="l-text">Water fills an inverted right-circular cone (apex down) at $4\\,\\text{ft}^3/\\text{min}$. The cone has height $H=12\\,\\text{ft}$ and top radius $R=6\\,\\text{ft}$. How fast is the water level rising when the water is $h=3\\,\\text{ft}$ deep?</p>

<div class="calc-graph"><div class="graph-title">Cone Geometry: Similar Triangles Give $r = h/2$</div>
<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg">
<polygon points="60,40 300,40 180,220" fill="none" stroke="rgba(235,230,220,0.5)" stroke-width="1.5"/>
<polygon points="135,160 225,160 180,220" fill="rgba(78,205,196,0.25)" stroke="#4ecdc4" stroke-width="2"/>
<line x1="180" y1="40" x2="180" y2="220" stroke="rgba(167,139,250,0.4)" stroke-width="1" stroke-dasharray="4,3"/>
<text x="60" y="32" fill="#c8a96e" font-family="monospace" font-size="11">R = 6</text>
<text x="300" y="32" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="end">H = 12</text>
<text x="135" y="155" fill="#4ecdc4" font-family="monospace" font-size="11" text-anchor="end">r</text>
<text x="195" y="195" fill="#4ecdc4" font-family="monospace" font-size="11">h</text>
</svg>
<div class="graph-caption">Inverted cone of height 12 and top radius 6. By similar triangles, at depth $h$ the water surface has radius $r = h/2$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Volume formula</div><div class="step-detail">$V = \\tfrac{1}{3}\\pi r^2 h$. The water forms a smaller similar cone of radius $r$ and height $h$.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eliminate $r$ using similar triangles</div><div class="step-detail">$r/h = R/H = 6/12 = 1/2$, so $r = h/2$. Then $V = \\tfrac{1}{3}\\pi (h/2)^2 h = \\tfrac{\\pi}{12}\\, h^3$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Differentiate with respect to $t$</div><div class="step-detail">$\\dfrac{dV}{dt} = \\dfrac{\\pi}{12}\\cdot 3h^2\\, \\dfrac{dh}{dt} = \\dfrac{\\pi h^2}{4}\\dfrac{dh}{dt}$. The chain rule produces the $dh/dt$ factor on the cubic.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Solve for $dh/dt$ at $h=3$</div><div class="step-detail">$4 = \\dfrac{\\pi (3)^2}{4}\\,\\dfrac{dh}{dt} = \\dfrac{9\\pi}{4}\\dfrac{dh}{dt}\\;\\Longrightarrow\\; \\dfrac{dh}{dt} = \\dfrac{16}{9\\pi}\\,\\text{ft/min} \\approx 0.566\\,\\text{ft/min}.$</div></div></div>
</div>

<div class="l-note"><strong>Common pitfall.</strong> Substitute specific values of $h$, $r$, $x$, $y$ <em>only after</em> differentiating. If you substitute first, you'll be differentiating a constant and get nonsense like $dV/dt = 0$.</div>

<h2 class="l-heading" id="s7">7. Klasik Alıştırmalar</h2>

<p class="l-text">Try these on paper before checking. Hints follow each problem; full solutions are at the end.</p>

<div class="calc-example"><strong>Problem 1.</strong> Differentiate $y = \\sin(x^2)$.<br><em>Hint:</em> Outer $\\sin(u)$, inner $u=x^2$.</div>

<div class="calc-example"><strong>Problem 2.</strong> Differentiate $y = e^{\\cos x}$.<br><em>Hint:</em> Outer $e^u$, inner $u=\\cos x$. Watch the sign on $\\sin x$.</div>

<div class="calc-example"><strong>Problem 3.</strong> Differentiate $y = \\ln(\\sec x + \\tan x)$.<br><em>Hint:</em> Chain rule with outer $\\ln u$. The derivative of the inner is the classical secant identity.</div>

<div class="calc-example"><strong>Problem 4.</strong> Given $z = x y$, $x = e^t$, $y = \\sin t$, find $dz/dt$.<br><em>Hint:</em> Two-path multi-variable chain rule.</div>

<div class="calc-example"><strong>Problem 5.</strong> Differentiate the curve $x^3 + y^3 = 3 x y$ implicitly to find $dy/dx$ (the folium of Descartes).<br><em>Hint:</em> Treat $y$ as a function of $x$; chain rule gives $d(y^3)/dx = 3y^2\\, dy/dx$.</div>

<div class="calc-example"><strong>Problem 6.</strong> Use the inverse-function chain rule to derive $\\dfrac{d}{dx}\\,\\text{arccos}(x)$.<br><em>Hint:</em> From $\\cos y = x$, differentiate both sides.</div>

<div class="calc-example"><strong>Problem 7 (related rate).</strong> A spherical balloon is inflated so that its volume increases at $10\\,\\text{cm}^3/\\text{s}$. How fast is the radius growing when $r=5\\,\\text{cm}$?<br><em>Hint:</em> $V = \\tfrac{4}{3}\\pi r^3$; differentiate implicitly in $t$.</div>

<div class="calc-example"><strong>Problem 8 (tree diagram).</strong> Suppose $w = f(x,y,z)$ where $x = r\\cos\\theta$, $y=r\\sin\\theta$, $z=r$. Write $\\partial w/\\partial r$ and $\\partial w/\\partial \\theta$ in terms of the partials of $f$.<br><em>Hint:</em> Three paths from $w$ down to each of $r,\\theta$.</div>

<h3 class="l-subheading">Solutions</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">$y' = \\cos(x^2)\\cdot 2x = 2x\\cos(x^2)$.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">$y' = e^{\\cos x}\\cdot(-\\sin x) = -\\sin x\\, e^{\\cos x}$.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">Let $u=\\sec x + \\tan x$; $u' = \\sec x \\tan x + \\sec^2 x = \\sec x (\\tan x + \\sec x) = \\sec x \\cdot u$. So $y' = u'/u = \\sec x$. A classical identity used for integrating $\\sec x$.</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">$\\partial z/\\partial x = y$, $\\partial z/\\partial y = x$. So $dz/dt = y\\cdot e^t + x\\cdot \\cos t = e^t \\sin t + e^t \\cos t = e^t(\\sin t + \\cos t)$.</div></div>
<div class="calc-card"><div class="card-title">5.</div><div class="card-body">Differentiate: $3x^2 + 3y^2 y' = 3(y + x y')$. Then $y'(3y^2 - 3x) = 3y - 3x^2$, giving $y' = \\dfrac{y - x^2}{y^2 - x}$.</div></div>
<div class="calc-card"><div class="card-title">6.</div><div class="card-body">From $\\cos y = x$: $-\\sin y\\, y' = 1$, so $y' = -1/\\sin y = -1/\\sqrt{1-x^2}$.</div></div>
<div class="calc-card"><div class="card-title">7.</div><div class="card-body">$dV/dt = 4\\pi r^2\\, dr/dt$. At $r=5$: $10 = 4\\pi (25)\\, dr/dt$, so $dr/dt = 1/(10\\pi)\\,\\text{cm/s} \\approx 0.0318\\,\\text{cm/s}$.</div></div>
<div class="calc-card"><div class="card-title">8.</div><div class="card-body">$\\partial w/\\partial r = f_x \\cos\\theta + f_y \\sin\\theta + f_z$; $\\partial w/\\partial \\theta = -f_x r\\sin\\theta + f_y r\\cos\\theta$. No $\\theta$-dependence from $z=r$, so that path drops out of $\\partial w/\\partial\\theta$.</div></div>
</div>

<div class="calc-highlight"><strong>Recap.</strong> The chain rule converts composition into multiplication and tree structure into summation. Combined with implicit differentiation, it gives slopes of curves without solving for $y$. Combined with the time variable, it converts geometric constraints into related-rates equations. Next lesson: integrals — the inverse operation, and the Fundamental Theorem of Calculus.</div>`,

tr: `<p class="l-text"><strong>Zincir kuralı</strong>, <strong>bileşik fonksiyonları</strong> — yani bir fonksiyonun çıktısının başka bir fonksiyona beslendiği yapıları — türevlemenin aracıdır. "Fonksiyonun fonksiyonu" gördüğünüz her yerde ($\\sin(x^2)$, $e^{\\cos x}$, $\\sqrt{1+t^3}$) zincir kuralı işler. Bu derste kuralı limit tanımından türetir, ağaç diyagramlarıyla çok değişkenliye genişletir, sonra iki klasik uygulamaya geçeriz: <strong>kapalı türev</strong> (implicit differentiation) ve <strong>bağlı oranlar</strong> (related rates).</p>

<div class="calc-highlight"><strong>Ana fikir:</strong> $y$ değişkeni $u$'ya, $u$ ise $x$'e bağlıysa, $x$'teki küçük bir değişim önce $u$'da, sonra $y$'de bir değişim üretir. Oranlar çarpılır: $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$. Leibniz yazımı neredeyse kuralı kendisi söyler — $du$'lar sanki sadeleşiyor.</div>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tek değişkenli zincir kuralını limit tanımından türetmeyi</li>
<li>Zincir kuralını iki, üç ve çok katmanlı bileşimlere uygulamayı</li>
<li>Çok değişkenli zincir kuralını ağaç-diyagramı muhasebesiyle kullanmayı</li>
<li>Ters fonksiyon türevlerini zincir kuralı üzerinden çıkarmayı</li>
<li>$x^2+y^2=25$ gibi eğrilerde kapalı türev almayı</li>
<li>Klasik bağlı-oran problemlerini çözmeyi: gölge boyu, kayan merdiven, su seviyesi</li>
</ul>
</div>

<h2 class="l-heading" id="s1">1. Bileşik Fonksiyonlar — Hatırlatma</h2>

<p class="l-text">Bir <strong>bileşik fonksiyon</strong> iki fonksiyonu zincirleyerek elde edilir. $g$ fonksiyonu $x$'i $u=g(x)$'e götürüyorsa ve $f$ de $u$'yu $y=f(u)$'ya götürüyorsa, $f\\circ g$ bileşimi $x$'i doğrudan $y$'ye götürür:</p>

<div class="calc-formula"><span class="formula-label">Bileşim (Composition)</span><div class="formula-main">$$ (f\\circ g)(x) \\;=\\; f(g(x)) $$</div><div class="formula-sub">Önce $g$ (iç), sonra $f$ (dış) uygulanır. Sıra önemli: genel olarak $f\\circ g \\neq g\\circ f$.</div></div>

<p class="l-text"><strong>Fonksiyonu katmanlara ayırmak</strong> türev almadan önceki ilk adımdır. İç fonksiyon önce uygulanan, dış fonksiyon ise onu saran fonksiyondur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$y = \\sin(x^2)$</div><div class="card-body">İç: $u=x^2$. Dış: $\\sin(u)$. Önce kare, sonra sinüs.</div></div>
<div class="calc-card"><div class="card-title">$y = \\sqrt{1+t^3}$</div><div class="card-body">İç: $u=1+t^3$. Dış: $\\sqrt{u}$. Önce polinom, sonra karekök.</div></div>
<div class="calc-card"><div class="card-title">$y = e^{\\cos x}$</div><div class="card-body">İç: $u=\\cos x$. Dış: $e^u$. Önce kosinüs, sonra üstel.</div></div>
<div class="calc-card"><div class="card-title">$y = \\ln(\\tan x)$</div><div class="card-body">İç: $u=\\tan x$. Dış: $\\ln u$. Önce tanjant, sonra doğal logaritma.</div></div>
</div>

<div class="calc-graph"><div class="graph-title">Bileşimin Görselleştirilmesi: $y = \\sin(x^2)$</div>
<div id="plot-composite-tr" style="width:100%;height:320px;"></div>
<script>setTimeout(function(){
var xs=[],u=[],y=[];
for(var i=-300;i<=300;i++){var v=i/100;xs.push(v);u.push(v*v);y.push(Math.sin(v*v));}
var inner={x:xs,y:u,mode:"lines",name:"u = x²",line:{color:"#a78bfa",width:2.2}};
var outer={x:xs,y:y,mode:"lines",name:"y = sin(u) = sin(x²)",line:{color:"#c8a96e",width:2.6}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"değer",range:[-2,10]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.98}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-composite-tr",[inner,outer],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">Mor eğri iç fonksiyon $u=x^2$, karesel büyür. Altın eğri ise dış $\\sin(u)$; $|x|$ büyüdükçe daha hızlı salınır, çünkü içerideki argüman karesel büyüyor. Zincir kuralı, salınım hızının neden arttığını birazdan açıklayacak.</div></div>

<h2 class="l-heading" id="s2">2. Tek Değişkenli Zincir Kuralı (Tam Türetim)</h2>

<p class="l-text">$y=f(u)$ ve $u=g(x)$ olsun; $g$ noktasında $x$'te, $f$ ise $u=g(x)$ noktasında türevlenebilir. $\\dfrac{dy}{dx}$'i arıyoruz. Tanımdan başlayalım:</p>

<div class="calc-formula"><span class="formula-label">Limit Olarak Türev</span><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x} $$</div><div class="formula-sub">Burada $\\Delta y = f(g(x+\\Delta x)) - f(g(x))$ ve $\\Delta u = g(x+\\Delta x)-g(x)$.</div></div>

<p class="l-text"><strong>Sezgisel türetim (cebirsel kurnazlık).</strong> $\\Delta u$ ile çarpıp böl:</p>

<div class="calc-formula"><span class="formula-label">$\\Delta u$ ile Çarp/Böl</span><div class="formula-main">$$ \\frac{\\Delta y}{\\Delta x} \\;=\\; \\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x} $$</div><div class="formula-sub">$\\Delta u\\neq 0$ olduğu sürece. $\\Delta x\\to 0$ iken türevlenebilirlik $\\Delta u\\to 0$'ı garantiler, böylece her iki faktör de bir türeve yaklaşır.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Her faktörün limitini al</div><div class="step-detail">$\\dfrac{\\Delta y}{\\Delta u}\\to f'(u)$ (çünkü $\\Delta u\\to 0$); $\\dfrac{\\Delta u}{\\Delta x}\\to g'(x)$ (çünkü $\\Delta x\\to 0$). $g$'nin sürekliliği (türevlenebilirliğin doğal sonucu) iki limiti birbirine bağlar.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Limitlerin çarpımı = çarpımın limiti</div><div class="step-detail">Her iki faktör de yakınsadığı için limitlerin çarpım kuralı geçerlidir: $\\dfrac{dy}{dx} = f'(g(x))\\,g'(x)$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$\\Delta u = 0$ durumunu kapat</div><div class="step-detail">$g$ yerel olarak sabitse $\\Delta u$ sıfır olabilir. Tam kanıt yardımcı bir $E(u)$ fonksiyonu (Carathéodory hilesi) kullanır; argüman $\\Delta u$ sıfır olduğunda da çalışır. Sonuç formülü değişmez.</div></div></div>
</div>

<div class="calc-formula"><span class="formula-label">Zincir Kuralı (Tek Değişkenli)</span><div class="formula-main">$$ \\boxed{\\;\\frac{dy}{dx} \\;=\\; \\frac{dy}{du}\\cdot \\frac{du}{dx} \\;=\\; f'(g(x))\\,g'(x)\\;} $$</div><div class="formula-sub">"Dış fonksiyonun türevi (iç fonksiyonda değerlendirilmiş) çarpı iç fonksiyonun türevi." Leibniz biçimi sadeleşmeyi görselleştirir; Lagrange biçimi değerlendirme noktasını açıkça belirtir.</div></div>

<p class="l-text"><strong>Çözümlü örnek.</strong> $y=\\sin(x^2)$'i türevleyin. Dış $f(u)=\\sin u$ için $f'(u)=\\cos u$; iç $g(x)=x^2$ için $g'(x)=2x$. O halde</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\cos(x^2)\\cdot 2x \\;=\\; 2x\\cos(x^2). $$</div></div>

<div class="calc-graph"><div class="graph-title">$\\sin(x^2)$ ve Türevi $2x\\cos(x^2)$</div>
<div id="plot-derivsinx2-tr" style="width:100%;height:300px;"></div>
<script>setTimeout(function(){
var xs=[],fx=[],dfx=[];
for(var i=-400;i<=400;i++){var v=i/100;xs.push(v);fx.push(Math.sin(v*v));dfx.push(2*v*Math.cos(v*v));}
var t1={x:xs,y:fx,mode:"lines",name:"y = sin(x²)",line:{color:"#c8a96e",width:2.4}};
var t2={x:xs,y:dfx,mode:"lines",name:"dy/dx = 2x·cos(x²)",line:{color:"#4ecdc4",width:2.0}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"x"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"y, dy/dx"},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"},x:0.02,y:0.02}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-derivsinx2-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">$|x|$ büyüdükçe türevin genliği büyür çünkü $2x$ çarpanı sınırsız — fonksiyon hızlanır, eğimleri sınırsız büyür, oysa $|\\sin(x^2)|\\le 1$ sınırlı kalır.</div></div>

<h2 class="l-heading" id="s3">3. Çok Katmanlı Bileşimler</h2>

<p class="l-text">Zincir kuralı istediğiniz kadar iç içe katmana genişler. $y=f(u)$, $u=g(v)$, $v=h(x)$ ise</p>

<div class="calc-formula"><span class="formula-label">Üç Katmanlı Zincir</span><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\frac{dy}{du}\\cdot \\frac{du}{dv}\\cdot \\frac{dv}{dx}. $$</div><div class="formula-sub">Her katmanı türevle, her birini doğru içerideki ifadede değerlendir, çarp.</div></div>

<p class="l-text"><strong>Örnek: $y = e^{\\cos x}$.</strong> İki katman: dış $e^u$, iç $u=\\cos x$. O halde</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; e^{\\cos x}\\cdot (-\\sin x) \\;=\\; -\\sin x\\, e^{\\cos x}. $$</div></div>

<p class="l-text"><strong>Örnek: $y = \\sqrt{1+\\sin(x^2)}$.</strong> Üç katman. $u = 1+\\sin(x^2)$, $v=\\sin(x^2)$, $w=x^2$ seç. Sonuç:</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dy}{dx} \\;=\\; \\frac{1}{2\\sqrt{u}}\\cdot \\cos(x^2)\\cdot 2x \\;=\\; \\frac{x\\cos(x^2)}{\\sqrt{1+\\sin(x^2)}}. $$</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Soğan Soyma</div><div class="card-body">En dış katmanı soy, türevle, içeride kalanın türeviyle çarp. Tekrarla.</div></div>
<div class="calc-card"><div class="card-title">İçten Dışa Değerlendirme</div><div class="card-body">Sayısal değer hesaplarken en içteki katmandan başla; bu yön türev almanın tersidir.</div></div>
<div class="calc-card"><div class="card-title">Her Zaman Çarp</div><div class="card-body">Saf bileşim türevlerin çarpımına götürür, asla toplamına değil. Toplam, ancak birden fazla yol varsa görünür (bir sonraki bölüm).</div></div>
</div>

<div class="l-note"><strong>Katmanları belirleme.</strong> Şüphedeyseniz $y = f(\\underbrace{g(\\underbrace{h(\\underbrace{x}_{x})}_{w})}_{u})$ gibi açık $\\underbrace$ etiketleri yazıp her birini türevleyin.</div>

<h2 class="l-heading" id="s4">4. Çok Değişkenli Zincir Kuralı (Ağaç Diyagramları)</h2>

<p class="l-text">Bağımlı değişken birden fazla ara değişkene bağlıysa, bağımlılık ağacının tepesinden tabanına giden <em>her yol</em> için bir zincir-kuralı terimi alırız.</p>

<div class="calc-formula"><span class="formula-label">İki Yollu Zincir Kuralı</span><div class="formula-main">$$ z=f(x,y),\\quad x=x(t),\\quad y=y(t) \\;\\Longrightarrow\\; \\frac{dz}{dt} \\;=\\; \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} \\;+\\; \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}. $$</div><div class="formula-sub">$z$'den $t$'ye iki yol var: biri $x$ üzerinden, biri $y$ üzerinden. Katkılarını topla.</div></div>

<div class="calc-graph"><div class="graph-title">Ağaç Diyagramı: $z(t)=f(x(t),y(t))$</div>
<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg">
<circle cx="300" cy="30" r="22" fill="none" stroke="#c8a96e" stroke-width="2"/>
<text x="300" y="35" fill="#c8a96e" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">z</text>
<circle cx="180" cy="130" r="22" fill="none" stroke="#4ecdc4" stroke-width="2"/>
<text x="180" y="135" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">x</text>
<circle cx="420" cy="130" r="22" fill="none" stroke="#4ecdc4" stroke-width="2"/>
<text x="420" y="135" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">y</text>
<circle cx="300" cy="225" r="22" fill="none" stroke="#a78bfa" stroke-width="2"/>
<text x="300" y="230" fill="#a78bfa" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">t</text>
<line x1="284" y1="46" x2="196" y2="114" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="316" y1="46" x2="404" y2="114" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="194" y1="146" x2="284" y2="210" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<line x1="406" y1="146" x2="316" y2="210" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
<text x="218" y="85" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="middle">∂z/∂x</text>
<text x="382" y="85" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="middle">∂z/∂y</text>
<text x="220" y="195" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">dx/dt</text>
<text x="380" y="195" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">dy/dt</text>
</svg>
<div class="graph-caption">$z$'den $t$'ye iki yol. Her yol boyunca türevleri çarp; sonra yolların çarpımlarını topla.</div></div>

<p class="l-text"><strong>Çözümlü örnek.</strong> $z = x^2 + y^2$, $x=\\cos t$, $y=\\sin t$ olsun. $\\partial z/\\partial x = 2x$, $\\partial z/\\partial y = 2y$, $dx/dt=-\\sin t$, $dy/dt=\\cos t$. Yani</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{dz}{dt} \\;=\\; 2\\cos t \\cdot (-\\sin t) + 2\\sin t\\cdot \\cos t \\;=\\; 0. $$</div></div>

<p class="l-text">Bu sezgisel: birim çember boyunca $z=x^2+y^2=1$ sabittir, dolayısıyla zaman türevi sıfırdır. Zincir kuralı bunu doğrular.</p>

<div class="calc-formula"><span class="formula-label">Tam Diferansiyel</span><div class="formula-main">$$ dz \\;=\\; \\frac{\\partial z}{\\partial x}\\,dx + \\frac{\\partial z}{\\partial y}\\,dy. $$</div><div class="formula-sub">$z$'deki küçük bir değişim $x$ ve $y$ katkılarına ayrılır. $dt$'ye böl, iki-yollu formülü geri al; bu diferansiyel biçim zincir kuralının geometrik özüdür.</div></div>

<p class="l-text"><strong>Genelleme.</strong> $z=f(x_1,\\dots,x_n)$ ve her $x_i$, $t_1,\\dots,t_m$'ye bağlıysa, her $t_j$ için</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{\\partial z}{\\partial t_j} \\;=\\; \\sum_{i=1}^{n} \\frac{\\partial z}{\\partial x_i}\\,\\frac{\\partial x_i}{\\partial t_j}. $$</div></div>

<div class="calc-graph"><div class="graph-title">Birim Çember Üzerinde $z=x^2+y^2$: $dz/dt = 0$</div>
<div id="plot-circle-tr" style="width:100%;height:340px;"></div>
<script>setTimeout(function(){
var ts=[],xs=[],ys=[],zs=[];
for(var i=0;i<=200;i++){var t=i/200*2*Math.PI;ts.push(t);var x=Math.cos(t),y=Math.sin(t);xs.push(x);ys.push(y);zs.push(x*x+y*y);}
var t1={x:ts,y:zs,mode:"lines",name:"z(t) = x² + y² = 1",line:{color:"#c8a96e",width:2.5}};
var layout={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"t",tickvals:[0,Math.PI/2,Math.PI,3*Math.PI/2,2*Math.PI],ticktext:["0","π/2","π","3π/2","2π"]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"z(t)",range:[0,2]},margin:{t:30,r:30,b:50,l:50},showlegend:true,legend:{font:{color:"#ebe6dc"}}};
if(typeof Plotly!=="undefined")Plotly.newPlot("plot-circle-tr",[t1],layout,{responsive:true,displayModeBar:false});
},150)</script>
<div class="graph-caption">$(\\cos t, \\sin t)$ ile parametrize edilen birim çember boyunca $x^2+y^2$ hep 1. Yatay doğru $dz/dt = 0$'ı onaylar — çok-değişkenli zincir kuralının önceden söylediği gibi.</div></div>

<h2 class="l-heading" id="s5">5. Kapalı Türev (Implicit Differentiation) Yeniden</h2>

<p class="l-text">Bazen $y$, $F(x,y)=0$ gibi kapalı bir denklemle tanımlanır ve $y$'yi açıkça çözmek zordur. Zincir kuralı sayesinde her iki tarafı $x$'e göre türevleyebilir, $y$'yi bilinmeyen bir $y(x)$ fonksiyonu olarak ele alabiliriz.</p>

<div class="calc-formula"><span class="formula-label">Kapalı Türev Formülü</span><div class="formula-main">$$ F(x,y)=0 \\;\\Longrightarrow\\; \\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial y}\\,\\frac{dy}{dx} = 0 \\;\\Longrightarrow\\; \\frac{dy}{dx} = -\\frac{\\partial F/\\partial x}{\\partial F/\\partial y}. $$</div><div class="formula-sub">Kapalı denklemi çok-değişkenli zincir kuralıyla türevle, sonra $dy/dx$ için çöz. $\\partial F/\\partial y \\neq 0$ gerektirir.</div></div>

<p class="l-text"><strong>Örnek: yarıçapı 5 olan çember.</strong> $x^2 + y^2 = 25$'i kapalı türevle:</p>

<div class="calc-formula"><div class="formula-main">$$ 2x + 2y\\frac{dy}{dx} = 0 \\;\\Longrightarrow\\; \\frac{dy}{dx} = -\\frac{x}{y}. $$</div></div>

<p class="l-text">$(3,4)$ noktasında teğetin eğimi $-3/4$; $(4,-3)$'te ise $4/3$'tür. $y=\\pm\\sqrt{25-x^2}$ dallarından birini seçmeye gerek yok — zincir kuralı iki dalla da otomatik baş eder.</p>

<div class="calc-formula"><span class="formula-label">Ters Fonksiyon Türevi</span><div class="formula-main">$$ y = f^{-1}(x) \\;\\Longrightarrow\\; \\frac{dy}{dx} = \\frac{1}{f'(y)}. $$</div><div class="formula-sub">$f(y) = x$'ten başla; zincir kuralı: $f'(y)\\,dy/dx = 1$. Ters-fonksiyon türevleri zincir kuralının doğrudan ürünüdür.</div></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\arcsin(x)$</div><div class="card-body">$\\sin y = x$'ten: $\\cos y\\, y' = 1$, yani $y' = 1/\\cos y = 1/\\sqrt{1-x^2}$.</div></div>
<div class="calc-card"><div class="card-title">$\\arctan(x)$</div><div class="card-body">$\\tan y = x$'ten: $\\sec^2 y\\, y' = 1$, yani $y' = 1/(1+x^2)$.</div></div>
<div class="calc-card"><div class="card-title">$\\ln(x)$</div><div class="card-body">$e^y = x$'ten: $e^y\\, y' = 1$, yani $y' = 1/e^y = 1/x$.</div></div>
<div class="calc-card"><div class="card-title">$\\sqrt[n]{x}$</div><div class="card-body">$y^n = x$'ten: $n y^{n-1}\\, y' = 1$, yani $y' = 1/(n y^{n-1}) = \\tfrac{1}{n} x^{1/n - 1}$.</div></div>
</div>

<h2 class="l-heading" id="s6">6. Bağlı Oranlar — Klasik Uygulamalar</h2>

<p class="l-text"><strong>Bağlı-oran problemlerinde</strong> iki veya daha fazla nicelik bir denklemle bağlıdır ve her biri zamanla değişir. Zincir kuralı oranları birbirine bağlar: denklemi $t$'ye göre türevle, bilinen oranları yerine koy, bilinmeyen oranı çöz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Bir şekil çiz. Zamanla değişen her uzunluk, açı ve niceliği etiketle.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">Geometrik ilişkiyi bul (Pisagor, benzer üçgenler, hacim formülü).</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">Her iki tarafı $t$'ye göre zincir kuralıyla türevle.</div></div>
<div class="calc-card"><div class="card-title">Adım 4</div><div class="card-body">Anlık değerleri ve bilinen oranları yerine koy; bilinmeyen oranı çöz.</div></div>
</div>

<h3 class="l-subheading">6A. Duvardan Kayan Merdiven</h3>

<p class="l-text">10 ft uzunluğunda bir merdiven dik bir duvara dayalı. Tabanı duvardan $2\\,\\text{ft/s}$ hızla uzaklaştırılıyor. Taban duvardan $6\\,\\text{ft}$ uzaktayken merdivenin tepesi ne kadar hızlı aşağı kayıyor?</p>

<div class="calc-graph"><div class="graph-title">Kayan Merdiven Geometrisi</div>
<svg viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="240" x2="320" y2="240" stroke="rgba(235,230,220,0.4)" stroke-width="1.5"/>
<line x1="60" y1="40" x2="60" y2="240" stroke="rgba(235,230,220,0.4)" stroke-width="1.5"/>
<line x1="60" y1="70" x2="220" y2="240" stroke="#c8a96e" stroke-width="3"/>
<circle cx="60" cy="70" r="4" fill="#c8a96e"/>
<circle cx="220" cy="240" r="4" fill="#c8a96e"/>
<text x="40" y="160" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle">y</text>
<text x="140" y="258" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle">x</text>
<text x="155" y="145" fill="#c8a96e" font-family="monospace" font-size="12" text-anchor="middle">10</text>
<text x="225" y="225" fill="#a78bfa" font-family="monospace" font-size="11">dx/dt = +2</text>
<text x="30" y="60" fill="#a78bfa" font-family="monospace" font-size="11">dy/dt = ?</text>
</svg>
<div class="graph-caption">10 ft'lik bir merdiven. $x(t)$ duvara yatay uzaklık, $y(t)$ yükseklik. Pisagor: $x^2 + y^2 = 100$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Denklemi kur</div><div class="step-detail">$x^2 + y^2 = 10^2 = 100$. Hem $x(t)$ hem $y(t)$ zamanla değişir.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">$t$'ye göre kapalı türev al</div><div class="step-detail">$2x\\,\\dfrac{dx}{dt} + 2y\\,\\dfrac{dy}{dt} = 0$. Zincir kuralı $dx/dt$ ve $dy/dt$ çarpanlarını otomatik üretir.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$x=6$ yerine koy, $y$'yi bul</div><div class="step-detail">$y = \\sqrt{100 - 36} = 8$. Bilinen: $dx/dt = +2$. Yerine koy: $2(6)(2) + 2(8)\\,\\dfrac{dy}{dt} = 0$.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Çöz</div><div class="step-detail">$24 + 16\\,\\dfrac{dy}{dt} = 0 \\;\\Longrightarrow\\; \\dfrac{dy}{dt} = -\\dfrac{3}{2}\\,\\text{ft/s}$. Eksi işareti tepenin <em>aşağı</em> doğru kaydığını söyler.</div></div></div>
</div>

<h3 class="l-subheading">6B. Gölge Boyu</h3>

<p class="l-text">6 ft boyunda biri 15 ft yüksekliğindeki bir aydınlatma direğinden $5\\,\\text{ft/s}$ hızla uzaklaşıyor. Gölgenin ucu yerde ne kadar hızlı ilerler?</p>

<p class="l-text">Benzer üçgenlerden, $x$ kişinin direğe uzaklığı ve $s$ gölgenin boyu olsun:</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{x+s}{15} = \\frac{s}{6} \\;\\Longrightarrow\\; 6(x+s) = 15 s \\;\\Longrightarrow\\; s = \\tfrac{2}{3}\\, x. $$</div></div>

<p class="l-text">Gölgenin ucu yerde $x + s = x + \\tfrac{2}{3}x = \\tfrac{5}{3}x$ konumundadır. $t$'ye göre türevle:</p>

<div class="calc-formula"><div class="formula-main">$$ \\frac{d(x+s)}{dt} \\;=\\; \\frac{5}{3}\\,\\frac{dx}{dt} \\;=\\; \\frac{5}{3}\\cdot 5 \\;=\\; \\frac{25}{3}\\,\\text{ft/s}. $$</div></div>

<p class="l-text">Yani gölgenin ucu kişinin yürüyüş hızından $5/3$ kat hızlı ilerliyor.</p>

<h3 class="l-subheading">6C. Ters Konide Su Seviyesi</h3>

<p class="l-text">Ters duran bir dik dairesel koniye (uç aşağıda) $4\\,\\text{ft}^3/\\text{dk}$ hızla su doluyor. Koninin yüksekliği $H=12\\,\\text{ft}$, üst yarıçapı $R=6\\,\\text{ft}$. Su $h=3\\,\\text{ft}$ derinlikte iken seviye ne kadar hızlı yükseliyor?</p>

<div class="calc-graph"><div class="graph-title">Koni Geometrisi: Benzer Üçgenlerden $r = h/2$</div>
<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg">
<polygon points="60,40 300,40 180,220" fill="none" stroke="rgba(235,230,220,0.5)" stroke-width="1.5"/>
<polygon points="135,160 225,160 180,220" fill="rgba(78,205,196,0.25)" stroke="#4ecdc4" stroke-width="2"/>
<line x1="180" y1="40" x2="180" y2="220" stroke="rgba(167,139,250,0.4)" stroke-width="1" stroke-dasharray="4,3"/>
<text x="60" y="32" fill="#c8a96e" font-family="monospace" font-size="11">R = 6</text>
<text x="300" y="32" fill="#c8a96e" font-family="monospace" font-size="11" text-anchor="end">H = 12</text>
<text x="135" y="155" fill="#4ecdc4" font-family="monospace" font-size="11" text-anchor="end">r</text>
<text x="195" y="195" fill="#4ecdc4" font-family="monospace" font-size="11">h</text>
</svg>
<div class="graph-caption">Yükseklik 12, üst yarıçap 6 olan ters koni. Benzer üçgenlerden, $h$ derinliğinde su yüzeyinin yarıçapı $r = h/2$.</div></div>

<div class="calc-steps">
<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Hacim formülü</div><div class="step-detail">$V = \\tfrac{1}{3}\\pi r^2 h$. Su, yarıçapı $r$ ve yüksekliği $h$ olan daha küçük benzer bir koni oluşturur.</div></div></div>
<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Benzer üçgenle $r$'yi yok et</div><div class="step-detail">$r/h = R/H = 6/12 = 1/2$, yani $r = h/2$. Buradan $V = \\tfrac{1}{3}\\pi (h/2)^2 h = \\tfrac{\\pi}{12}\\, h^3$.</div></div></div>
<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">$t$'ye göre türev al</div><div class="step-detail">$\\dfrac{dV}{dt} = \\dfrac{\\pi}{12}\\cdot 3h^2\\, \\dfrac{dh}{dt} = \\dfrac{\\pi h^2}{4}\\dfrac{dh}{dt}$. Zincir kuralı küpün üzerine $dh/dt$ çarpanını koyuyor.</div></div></div>
<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">$h=3$'te $dh/dt$'i çöz</div><div class="step-detail">$4 = \\dfrac{\\pi (3)^2}{4}\\,\\dfrac{dh}{dt} = \\dfrac{9\\pi}{4}\\dfrac{dh}{dt}\\;\\Longrightarrow\\; \\dfrac{dh}{dt} = \\dfrac{16}{9\\pi}\\,\\text{ft/dk} \\approx 0.566\\,\\text{ft/dk}.$</div></div></div>
</div>

<div class="l-note"><strong>Yaygın hata.</strong> $h$, $r$, $x$, $y$ için sayısal değerleri <em>türev aldıktan sonra</em> yerine koyun. Önce yerine koyarsanız bir sabiti türevliyor olursunuz ve $dV/dt = 0$ gibi saçma sonuçlar çıkar.</div>

<h2 class="l-heading" id="s7">7. Klasik Alıştırmalar</h2>

<p class="l-text">Kontrol etmeden önce kağıt-kalemle deneyin. Her problemin altında ipucu var; tam çözümler en sonda.</p>

<div class="calc-example"><strong>Problem 1.</strong> $y = \\sin(x^2)$'i türevleyin.<br><em>İpucu:</em> Dış $\\sin(u)$, iç $u=x^2$.</div>

<div class="calc-example"><strong>Problem 2.</strong> $y = e^{\\cos x}$'i türevleyin.<br><em>İpucu:</em> Dış $e^u$, iç $u=\\cos x$. $\\sin x$'in işaretine dikkat.</div>

<div class="calc-example"><strong>Problem 3.</strong> $y = \\ln(\\sec x + \\tan x)$'i türevleyin.<br><em>İpucu:</em> Dış $\\ln u$ ile zincir kuralı. İçin türevi klasik bir sekant özdeşliği üretir.</div>

<div class="calc-example"><strong>Problem 4.</strong> $z = x y$, $x = e^t$, $y = \\sin t$ verildiğine göre $dz/dt$'i bulun.<br><em>İpucu:</em> İki yollu çok-değişkenli zincir kuralı.</div>

<div class="calc-example"><strong>Problem 5.</strong> $x^3 + y^3 = 3 x y$ (Descartes yaprağı) eğrisinde kapalı türevle $dy/dx$'i bulun.<br><em>İpucu:</em> $y$'yi $x$'in fonksiyonu say; $d(y^3)/dx = 3y^2\\, dy/dx$.</div>

<div class="calc-example"><strong>Problem 6.</strong> Ters fonksiyon zincir kuralıyla $\\dfrac{d}{dx}\\,\\text{arccos}(x)$'i türetin.<br><em>İpucu:</em> $\\cos y = x$'ten başla, iki tarafı türevle.</div>

<div class="calc-example"><strong>Problem 7 (bağlı oran).</strong> Bir küresel balonun hacmi $10\\,\\text{cm}^3/\\text{s}$ hızla artırılıyor. $r=5\\,\\text{cm}$ iken yarıçapı ne hızla büyüyor?<br><em>İpucu:</em> $V = \\tfrac{4}{3}\\pi r^3$; $t$'ye göre kapalı türevle.</div>

<div class="calc-example"><strong>Problem 8 (ağaç diyagramı).</strong> $w = f(x,y,z)$ ve $x = r\\cos\\theta$, $y=r\\sin\\theta$, $z=r$ olsun. $\\partial w/\\partial r$ ile $\\partial w/\\partial \\theta$'yı $f$'nin kısmi türevleri cinsinden yazın.<br><em>İpucu:</em> $w$'dan $r$ ve $\\theta$'ya üçer yol.</div>

<h3 class="l-subheading">Çözümler</h3>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">$y' = \\cos(x^2)\\cdot 2x = 2x\\cos(x^2)$.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">$y' = e^{\\cos x}\\cdot(-\\sin x) = -\\sin x\\, e^{\\cos x}$.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">$u=\\sec x + \\tan x$ olsun; $u' = \\sec x \\tan x + \\sec^2 x = \\sec x (\\tan x + \\sec x) = \\sec x \\cdot u$. O halde $y' = u'/u = \\sec x$. $\\sec x$ integraliyle bilinen klasik özdeşlik.</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">$\\partial z/\\partial x = y$, $\\partial z/\\partial y = x$. Yani $dz/dt = y\\cdot e^t + x\\cdot \\cos t = e^t \\sin t + e^t \\cos t = e^t(\\sin t + \\cos t)$.</div></div>
<div class="calc-card"><div class="card-title">5.</div><div class="card-body">Türevle: $3x^2 + 3y^2 y' = 3(y + x y')$. $y'(3y^2 - 3x) = 3y - 3x^2$, yani $y' = \\dfrac{y - x^2}{y^2 - x}$.</div></div>
<div class="calc-card"><div class="card-title">6.</div><div class="card-body">$\\cos y = x$'ten: $-\\sin y\\, y' = 1$, yani $y' = -1/\\sin y = -1/\\sqrt{1-x^2}$.</div></div>
<div class="calc-card"><div class="card-title">7.</div><div class="card-body">$dV/dt = 4\\pi r^2\\, dr/dt$. $r=5$'te: $10 = 4\\pi (25)\\, dr/dt$, yani $dr/dt = 1/(10\\pi)\\,\\text{cm/s} \\approx 0.0318\\,\\text{cm/s}$.</div></div>
<div class="calc-card"><div class="card-title">8.</div><div class="card-body">$\\partial w/\\partial r = f_x \\cos\\theta + f_y \\sin\\theta + f_z$; $\\partial w/\\partial \\theta = -f_x r\\sin\\theta + f_y r\\cos\\theta$. $z=r$, $\\theta$'dan bağımsız olduğu için $\\partial w/\\partial\\theta$'da o yol düşer.</div></div>
</div>

<div class="calc-highlight"><strong>Özet.</strong> Zincir kuralı bileşimi çarpıma, ağaç yapısını toplama çevirir. Kapalı türevle birleşince $y$'yi çözmeden eğrilerin eğimini verir. Zaman değişkeniyle birleşince geometrik kısıtları bağlı-oran denklemlerine dönüştürür. Sonraki ders: integraller — türev almanın ters işlemi ve Kalkülüsün Temel Teoremi.</div>`
};

// Backward compatibility: the lesson shell expects a global `CALCULUS_L4` symbol.
var CALCULUS_L4 = window.CALCULUS_L4;
