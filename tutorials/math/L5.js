var MATH_L5 = {

en: '<p class="l-text"><strong>Every machine learning model is, at its core, an optimization problem.</strong> Training a neural network means searching through millions of parameters to find the configuration that minimizes a loss function. The quality of your optimizer, learning rate schedule, and regularization strategy directly determines whether your model converges to a good solution or gets stuck in a terrible one. Optimization theory is the engine that powers all of modern ML.</p>'

+ '<p class="l-text">This lesson covers the complete optimization toolkit for ML practitioners: from the mathematical foundations of convexity and gradient descent, through modern optimizers like Adam and AdamW, to practical considerations like mixed-precision training and gradient accumulation. Every concept is connected to real NLP and deep learning workflows.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU’LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Frame any supervised model as θ* = argmin L(θ) and read its components</li>'
+ '<li>Test convexity with the Hessian and predict gradient descent convergence</li>'
+ '<li>Pick batch, stochastic, or mini-batch SGD based on dataset size and noise</li>'
+ '<li>Implement Adam from its bias-corrected first and second moment updates</li>'
+ '<li>Tune learning rate with warmup, cosine, and step decay schedules</li>'
+ '<li>Apply gradient clipping and accumulation to stabilize large transformer training</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: Optimization in ML
   ============================================================ */
+ '<h2 class="l-title">1. Optimization in ML</h2>'

+ '<div class="calc-highlight"><strong>The universal ML recipe:</strong> Define a model with parameters $\\theta$, define a loss function $\\mathcal{L}(\\theta)$ that measures how bad the model is, then use optimization to find $\\theta^* = \\arg\\min_\\theta \\mathcal{L}(\\theta)$. Every supervised learning algorithm follows this pattern without exception.</div>'

+ '<p class="l-text">The optimization perspective unifies all of ML. Linear regression minimizes mean squared error. Logistic regression minimizes cross-entropy. Neural networks minimize whatever loss you choose. The only differences are (1) the parameterization of the model, (2) the choice of loss function, and (3) the optimization algorithm used to find the minimum.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Parameters</div><div class="card-body">The knobs we turn: weights, biases, embeddings. A GPT-scale model has billions of parameters living in a space with billions of dimensions.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss Function</div><div class="card-body">Measures model quality. Cross-entropy for classification, MSE for regression, contrastive loss for embeddings. Must be differentiable (almost everywhere).</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradients</div><div class="card-body">The direction of steepest ascent. We move opposite to the gradient to decrease loss. Backpropagation computes these efficiently via the chain rule.</div></div>'
+ '<div class="calc-card"><div class="card-title">Learning Rate</div><div class="card-body">Step size for each update. Too large = divergence. Too small = painfully slow convergence. The single most important hyperparameter.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">THE ML OPTIMIZATION PROBLEM</div><div class="formula-main">$$\\theta^* = \\arg\\min_\\theta \\frac{1}{N} \\sum_{i=1}^{N} \\mathcal{L}(f_\\theta(x_i), y_i) + \\lambda \\Omega(\\theta)$$</div><div class="formula-sub">Find parameters $\\theta$ that minimize average loss over $N$ training samples, plus a regularization term $\\Omega(\\theta)$ weighted by $\\lambda$.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Forward Pass</div><div class="step-detail">Compute predictions $\\hat{y}_i = f_\\theta(x_i)$ for a batch of inputs. In a transformer, this means embedding, attention, feed-forward, output projection.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Loss Computation</div><div class="step-detail">Compute $\\mathcal{L} = \\frac{1}{B} \\sum_{i=1}^{B} \\ell(\\hat{y}_i, y_i)$ over the batch. Cross-entropy for language modeling, MSE for regression.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Backward Pass</div><div class="step-detail">Compute $\\nabla_\\theta \\mathcal{L}$ via backpropagation (reverse-mode autodiff). Every parameter gets a gradient telling it how to change.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Parameter Update</div><div class="step-detail">Apply $\\theta \\leftarrow \\theta - \\eta \\nabla_\\theta \\mathcal{L}$ (or a fancier update rule). Repeat from step 1 until convergence.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">LOSS LANDSCAPE INTUITION</div><div class="example-body">'
+ 'Imagine the loss function as a mountainous terrain in high-dimensional space:<br><br>'
+ '<strong>Global minimum:</strong> The lowest valley &mdash; the best possible parameters. We want to reach here.<br>'
+ '<strong>Local minima:</strong> Other valleys that are not the lowest. We might get trapped here.<br>'
+ '<strong>Saddle points:</strong> Points that are minima in some directions but maxima in others. Very common in high dimensions.<br>'
+ '<strong>Plateaus:</strong> Flat regions where gradients are near zero. Training appears to stall.<br><br>'
+ 'In practice, for neural networks with millions of parameters, most "bad" critical points are saddle points rather than local minima. SGD with momentum tends to escape saddle points naturally.'
+ '</div></div>'

+ '<div class="l-note"><strong>Why NLP models are hard to optimize:</strong> Language models have discrete inputs (tokens), massive vocabularies (30k&ndash;100k), long-range dependencies (thousands of tokens), and extremely non-convex loss surfaces. The transformer architecture was partly successful because it is <em>easier to optimize</em> than RNNs &mdash; self-attention provides direct gradient paths between all positions.</div>'

/* ============================================================
   SECTION 2: Convex vs Non-Convex
   ============================================================ */
+ '<h2 class="l-title">2. Convex vs Non-Convex Optimization</h2>'

+ '<p class="l-text">The distinction between convex and non-convex optimization is the most important theoretical divide in the field. Convex problems have a single global minimum that gradient descent is guaranteed to find. Non-convex problems (like training neural networks) have complex landscapes with many local minima, saddle points, and plateaus.</p>'

+ '<div class="calc-formula"><div class="formula-label">CONVEXITY DEFINITION</div><div class="formula-main">$$f(\\lambda x + (1-\\lambda) y) \\leq \\lambda f(x) + (1-\\lambda) f(y) \\quad \\forall \\lambda \\in [0, 1]$$</div><div class="formula-sub">A function is convex if the line segment between any two points on the graph lies above or on the graph. Geometrically: the function "curves upward."</div></div>'

+ '<div class="calc-highlight"><strong>Jensen\'s Inequality:</strong> For a convex function $f$ and random variable $X$: $f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]$. This is the foundation of variational inference (ELBO), EM algorithm, and many bounds in ML. For concave functions the inequality reverses.</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Convex Problems</div>'
+ '<div class="compare-item">&#8226; Single global minimum (no local minima traps)</div>'
+ '<div class="compare-item">&#8226; Gradient descent guaranteed to converge</div>'
+ '<div class="compare-item">&#8226; Examples: linear/logistic regression, SVM, lasso</div>'
+ '<div class="compare-item">&#8226; Theory is mature and elegant</div>'
+ '<div class="compare-item">&#8226; Any local minimum is also the global minimum</div></div>'
+ '<div class="compare-col"><div class="compare-title">Non-Convex Problems</div>'
+ '<div class="compare-item">&#8226; Multiple local minima + saddle points</div>'
+ '<div class="compare-item">&#8226; No convergence guarantees to global optimum</div>'
+ '<div class="compare-item">&#8226; Examples: neural networks, matrix factorization</div>'
+ '<div class="compare-item">&#8226; Theory is still active research</div>'
+ '<div class="compare-item">&#8226; Practice works better than theory predicts</div></div>'
+ '</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Hessian Test</div><div class="card-body">$f$ is convex iff its Hessian $\\nabla^2 f$ is positive semi-definite everywhere. All eigenvalues $\\geq 0$ at every point.</div></div>'
+ '<div class="calc-card"><div class="card-title">Strict Convexity</div><div class="card-body">Strict inequality: the minimum is <em>unique</em>. Hessian is positive definite ($\\lambda_i > 0$). L2-regularized problems are strictly convex.</div></div>'
+ '<div class="calc-card"><div class="card-title">Strong Convexity</div><div class="card-body">$f(y) \\geq f(x) + \\nabla f(x)^T(y-x) + \\frac{\\mu}{2}\\|y-x\\|^2$. Guarantees linear convergence rate. Parameter $\\mu$ controls curvature lower bound.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lipschitz Smoothness</div><div class="card-body">$\\|\\nabla f(x) - \\nabla f(y)\\| \\leq L\\|x - y\\|$. Gradients don\'t change too fast. Needed for convergence proofs. Sets max safe learning rate as $1/L$.</div></div>'
+ '</div>'

/* Plotly: Convex vs Non-Convex */
+ '<div id="plot-convex-landscape" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x=[];var yConv=[];var yNonConv=[];'
+ 'for(var i=-30;i<=30;i++){var xi=i/10;x.push(xi);yConv.push(xi*xi);yNonConv.push(xi*xi+2*Math.sin(3*xi));}'
+ 'var t1={x:x,y:yConv,mode:"lines",name:"Convex: x\\u00b2",line:{color:"#4ecdc4",width:3}};'
+ 'var t2={x:x,y:yNonConv,mode:"lines",name:"Non-Convex: x\\u00b2+2sin(3x)",line:{color:"#c8a96e",width:3}};'
+ 'var layout={title:{text:"Convex vs Non-Convex Loss Landscapes",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Parameter \\u03b8"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Loss"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-convex-landscape",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Convex (teal) vs Non-convex (gold):</strong> The convex function has a single minimum that gradient descent reaches from any starting point. The non-convex function has multiple local minima where optimization can get trapped.</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If neural networks are non-convex, why do they work so well? Recent research suggests that (1) most local minima in high-dimensional networks have similar loss values, (2) the real challenge is saddle points, not local minima, and (3) SGD noise helps escape sharp minima and find flat minima that generalize better. The loss landscape of overparameterized networks is surprisingly benign.</div></div>'

/* ============================================================
   SECTION 3: Gradient-Based Methods
   ============================================================ */
+ '<h2 class="l-title">3. Gradient-Based Methods</h2>'

+ '<p class="l-text">Gradient descent is the workhorse of ML optimization. The idea is beautifully simple: compute the gradient (direction of steepest ascent), then take a step in the opposite direction. Repeat until convergence. The variants differ in how much data they use to estimate the gradient and how they adjust the step size.</p>'

+ '<div class="calc-formula"><div class="formula-label">GRADIENT DESCENT UPDATE</div><div class="formula-main">$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}(\\theta_t)$$</div><div class="formula-sub">Move parameters in the negative gradient direction, scaled by learning rate $\\eta$. This is the foundation of all gradient-based methods.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Batch GD</div><div class="card-body">Use entire dataset for each gradient. Exact gradient, stable convergence. But $O(N)$ per step is too expensive for large datasets. Rarely used in DL.</div></div>'
+ '<div class="calc-card"><div class="card-title">Stochastic GD</div><div class="card-body">Use a single sample per step. Very noisy gradient but $O(1)$ per step. The noise acts as implicit regularization, helping generalization.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mini-Batch GD</div><div class="card-body">Use $B$ samples per step (typical: 16&ndash;512). Best of both worlds: reduced noise, GPU parallelism, manageable memory. The standard in DL.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradient Noise</div><div class="card-body">$\\text{Var}[\\nabla \\mathcal{L}_B] \\propto \\sigma^2 / B$. Larger batches reduce variance. But some noise is beneficial &mdash; it helps escape sharp minima.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Convergence for Convex</div><div class="step-detail">For $L$-smooth convex functions, GD with $\\eta = 1/L$ converges at rate $O(1/T)$. For $\\mu$-strongly convex: $O((1-\\mu/L)^T)$ &mdash; linear convergence. The condition number $\\kappa = L/\\mu$ controls difficulty.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Convergence for Non-Convex</div><div class="step-detail">GD finds a point with $\\|\\nabla f\\| \\leq \\epsilon$ in $O(1/\\epsilon^2)$ steps. This is a <em>stationary point</em>, not necessarily a minimum. But in practice, SGD finds good solutions consistently.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Learning Rate Selection</div><div class="step-detail">$\\eta < 2/L$ is required for convergence. In practice, start with $\\eta \\in [10^{-4}, 10^{-2}]$ and tune. For transformers, $\\eta = 3 \\times 10^{-4}$ with warmup is a common starting point.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">gradient_descent</span>(grad_fn, theta0, lr=<span class="num">0.01</span>, steps=<span class="num">1000</span>):\n    <span class="str">"""Vanilla gradient descent."""</span>\n    theta = theta0.copy()\n    history = [theta.copy()]\n    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(steps):\n        g = <span class="fn">grad_fn</span>(theta)\n        theta = theta - lr * g\n        history.<span class="fn">append</span>(theta.copy())\n    <span class="kw">return</span> theta, history\n\n<span class="cm"># Example: minimize f(x) = x^2 + 3y^2</span>\n<span class="kw">def</span> <span class="fn">grad_f</span>(theta):\n    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*theta[<span class="num">0</span>], <span class="num">6</span>*theta[<span class="num">1</span>]])\n\ntheta0 = np.<span class="fn">array</span>([<span class="num">4.0</span>, <span class="num">3.0</span>])\nresult, hist = <span class="fn">gradient_descent</span>(grad_f, theta0, lr=<span class="num">0.1</span>, steps=<span class="num">50</span>)\n<span class="fn">print</span>(<span class="str">f"Minimum at: {result}"</span>)  <span class="cm"># ~[0, 0]</span></code></pre></div>'

+ '<div class="l-warn"><strong>The gradient is all you need (almost):</strong> In theory, second-order information (Hessian) gives much faster convergence. But for neural networks, the Hessian is an $n \\times n$ matrix where $n$ can be billions &mdash; impossible to store or invert. First-order methods with clever tricks (momentum, adaptive rates) dominate in practice.</div>'

/* ============================================================
   SECTION 4: SGD Variants
   ============================================================ */
+ '<h2 class="l-title">4. SGD Variants &amp; Adaptive Optimizers</h2>'

+ '<p class="l-text">Vanilla SGD has two major problems: (1) it oscillates in directions with high curvature, and (2) it uses the same learning rate for all parameters regardless of their gradient magnitude. Modern optimizers address both issues. Understanding each optimizer\'s behavior is critical for training NLP models.</p>'

+ '<div class="calc-formula"><div class="formula-label">SGD WITH MOMENTUM</div><div class="formula-main">$$v_t = \\beta v_{t-1} + \\nabla \\mathcal{L}(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - \\eta v_t$$</div><div class="formula-sub">Accumulate an exponential moving average of gradients. Typical $\\beta = 0.9$. Acts like a ball rolling downhill &mdash; builds up speed in consistent directions.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">ADAM OPTIMIZER</div><div class="formula-main">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$$</div><div class="formula-sub">$$\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Momentum</div><div class="card-body">$v_t = \\beta v_{t-1} + g_t$. Smooths gradients over time. Reduces oscillation. Like a heavy ball that resists sudden direction changes. $\\beta = 0.9$ typical.</div></div>'
+ '<div class="calc-card"><div class="card-title">Nesterov</div><div class="card-body">"Look ahead" momentum: compute gradient at $\\theta - \\beta v$, not at $\\theta$. Slightly better convergence theory. Used in classical ML but less common in DL.</div></div>'
+ '<div class="calc-card"><div class="card-title">RMSProp</div><div class="card-body">Divide by running average of gradient magnitudes: $\\theta -= \\eta g / \\sqrt{\\mathbb{E}[g^2]+\\epsilon}$. Adapts per-parameter learning rates. Good for RNNs.</div></div>'
+ '<div class="calc-card"><div class="card-title">Adam</div><div class="card-body">Combines momentum (first moment) + RMSProp (second moment) with bias correction. Default choice: $\\beta_1=0.9, \\beta_2=0.999, \\epsilon=10^{-8}$.</div></div>'
+ '<div class="calc-card"><div class="card-title">AdamW</div><div class="card-body">Adam with decoupled weight decay: $\\theta -= \\eta(\\hat{m}/\\sqrt{\\hat{v}+\\epsilon} + \\lambda\\theta)$. The standard for transformers and LLMs. Fixes Adam\'s L2 regularization bug.</div></div>'
+ '<div class="calc-card"><div class="card-title">LAMB/LARS</div><div class="card-body">Layer-wise adaptive rates for large-batch training. Scale learning rate per layer by $\\|\\theta\\|/\\|\\nabla\\theta\\|$. Used for pretraining BERT with batch size 64k+.</div></div>'
+ '</div>'

/* Plotly: Optimizer comparison on Rosenbrock-like function */
+ '<div id="plot-optimizer-comparison" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var steps=100;var lr=0.01;'
+ 'function rosenbrock_grad(x,y){return[2*(x-1)-400*x*(y-x*x),200*(y-x*x)];}'
+ 'function sim_gd(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);x-=lr*g[0];y-=lr*g[1];path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'function sim_mom(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0,vx=0,vy=0,beta=0.9;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);vx=beta*vx+g[0];vy=beta*vy+g[1];x-=lr*vx;y-=lr*vy;path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'function sim_adam(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0,mx=0,my=0,vvx=0,vvy=0,b1=0.9,b2=0.999,eps=1e-8;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);mx=b1*mx+(1-b1)*g[0];my=b1*my+(1-b1)*g[1];vvx=b2*vvx+(1-b2)*g[0]*g[0];vvy=b2*vvy+(1-b2)*g[1]*g[1];var mxh=mx/(1-Math.pow(b1,i+1));var myh=my/(1-Math.pow(b1,i+1));var vxh=vvx/(1-Math.pow(b2,i+1));var vyh=vvy/(1-Math.pow(b2,i+1));x-=lr*mxh/(Math.sqrt(vxh)+eps);y-=lr*myh/(Math.sqrt(vyh)+eps);path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'var gd=sim_gd(-1,2);var mom=sim_mom(-1,2);var adam=sim_adam(-1,2);'
+ 'var t1={x:gd.x,y:gd.y,mode:"lines+markers",name:"Vanilla GD",line:{color:"#e74c3c",width:2},marker:{size:3}};'
+ 'var t2={x:mom.x,y:mom.y,mode:"lines+markers",name:"Momentum",line:{color:"#4ecdc4",width:2},marker:{size:3}};'
+ 'var t3={x:adam.x,y:adam.y,mode:"lines+markers",name:"Adam",line:{color:"#c8a96e",width:2},marker:{size:3}};'
+ 'var t4={x:[1],y:[1],mode:"markers",name:"Minimum",marker:{color:"#4de87a",size:12,symbol:"star"}};'
+ 'var layout={title:{text:"Optimizer Trajectories on Rosenbrock Function",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2081"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2082"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-optimizer-comparison",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Optimizer trajectories:</strong> Vanilla GD oscillates, Momentum builds speed but overshoots, Adam adapts per-parameter rates and converges most smoothly toward the minimum at (1,1).</div></div>'

+ '<div class="calc-example"><div class="example-label">WHEN TO USE WHICH OPTIMIZER</div><div class="example-body">'
+ '<strong>SGD + Momentum:</strong> Best for CNNs (image models), often gives best generalization. Needs careful LR tuning. Used in ResNet, EfficientNet training.<br>'
+ '<strong>Adam:</strong> Default for most tasks. Fast convergence, less tuning needed. Good for sparse gradients (embeddings, NLP).<br>'
+ '<strong>AdamW:</strong> Adam + decoupled weight decay. The standard for transformers. Used in BERT, GPT, T5, LLaMA pretraining.<br>'
+ '<strong>Adafactor:</strong> Memory-efficient Adam alternative. Factorizes second moment matrix. Used for T5 and very large models.<br>'
+ '<strong>LAMB:</strong> For very large batch training (>8k). Layer-wise rate scaling. Used for fast BERT pretraining.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\nmodel = nn.<span class="fn">TransformerEncoder</span>(...)\n\n<span class="cm"># AdamW — the standard for transformers</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">3e-4</span>,\n    betas=(<span class="num">0.9</span>, <span class="num">0.999</span>),\n    eps=<span class="num">1e-8</span>,\n    weight_decay=<span class="num">0.01</span>   <span class="cm"># decoupled weight decay</span>\n)\n\n<span class="cm"># SGD with momentum — for CNNs</span>\noptimizer_sgd = torch.optim.<span class="fn">SGD</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">0.1</span>,\n    momentum=<span class="num">0.9</span>,\n    weight_decay=<span class="num">5e-4</span>,\n    nesterov=<span class="num">True</span>\n)\n\n<span class="cm"># Training loop</span>\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    optimizer.<span class="fn">zero_grad</span>()\n    loss = model(batch)\n    loss.<span class="fn">backward</span>()\n    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="l-note"><strong>Adam vs AdamW &mdash; why it matters:</strong> Original Adam applies weight decay inside the adaptive rate: $\\theta -= \\eta(\\hat{m}+\\lambda\\theta)/(\\sqrt{\\hat{v}}+\\epsilon)$. This means parameters with large gradients get <em>less</em> regularization, which is wrong. AdamW decouples: $\\theta -= \\eta\\hat{m}/(\\sqrt{\\hat{v}}+\\epsilon) + \\eta\\lambda\\theta$. This gives uniform regularization across all parameters. Every modern transformer uses AdamW.</div>'

/* ============================================================
   SECTION 5: Learning Rate Schedules
   ============================================================ */
+ '<h2 class="l-title">5. Learning Rate Schedules</h2>'

+ '<p class="l-text">The learning rate is the most impactful hyperparameter in deep learning. But using a fixed learning rate is suboptimal: you want <strong>large steps early</strong> (explore quickly) and <strong>small steps later</strong> (fine-tune near minimum). Learning rate schedules formalize this idea, and choosing the right schedule can make or break your training run.</p>'

+ '<div class="calc-highlight"><strong>The warmup paradox:</strong> Transformers require learning rate warmup (starting from ~0 and increasing for the first few thousand steps). Without warmup, Adam\'s initial second-moment estimates are unreliable, causing dangerously large updates that destabilize training. This is especially critical for large models.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Step Decay</div><div class="card-body">Multiply LR by $\\gamma$ every $k$ epochs: $\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/k \\rfloor}$. Simple, effective. Used in ResNet (divide by 10 at epochs 30, 60, 90).</div></div>'
+ '<div class="calc-card"><div class="card-title">Exponential Decay</div><div class="card-body">$\\eta_t = \\eta_0 \\cdot \\gamma^t$. Smooth continuous decay. More gradual than step decay. Risk: may decay too fast if $\\gamma$ is too small.</div></div>'
+ '<div class="calc-card"><div class="card-title">Cosine Annealing</div><div class="card-body">$\\eta_t = \\eta_{min} + \\frac{\\eta_0 - \\eta_{min}}{2}(1 + \\cos(\\pi t / T))$. Smooth decay from $\\eta_0$ to $\\eta_{min}$. The standard for transformer pretraining.</div></div>'
+ '<div class="calc-card"><div class="card-title">Linear Warmup</div><div class="card-body">$\\eta_t = \\eta_0 \\cdot t / T_{warm}$ for $t < T_{warm}$. Ramp up from 0 to $\\eta_0$ over warmup steps. Essential for Adam with transformers.</div></div>'
+ '<div class="calc-card"><div class="card-title">Cyclical LR</div><div class="card-body">Oscillate between $\\eta_{min}$ and $\\eta_{max}$. Can help escape local minima. Super-convergence: one big cycle with very high max LR.</div></div>'
+ '<div class="calc-card"><div class="card-title">Warmup + Cosine</div><div class="card-body">Linear warmup then cosine decay. The dominant schedule for LLM pretraining. BERT: 10k warmup steps. GPT-3: warmup + cosine over 300B tokens.</div></div>'
+ '</div>'

/* Plotly: LR Schedules comparison */
+ '<div id="plot-lr-schedules" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var T=200;var steps=[];var step_d=[];var exp_d=[];var cos_d=[];var warmup_cos=[];var eta0=0.001;'
+ 'for(var i=0;i<T;i++){steps.push(i);'
+ 'step_d.push(eta0*Math.pow(0.1,Math.floor(i/50)));'
+ 'exp_d.push(eta0*Math.pow(0.99,i));'
+ 'cos_d.push(0.5*eta0*(1+Math.cos(Math.PI*i/T)));'
+ 'var warm=20;if(i<warm){warmup_cos.push(eta0*i/warm);}else{warmup_cos.push(0.5*eta0*(1+Math.cos(Math.PI*(i-warm)/(T-warm))));}}'
+ 'var t1={x:steps,y:step_d,mode:"lines",name:"Step Decay",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:steps,y:exp_d,mode:"lines",name:"Exponential",line:{color:"#9b59b6",width:2}};'
+ 'var t3={x:steps,y:cos_d,mode:"lines",name:"Cosine",line:{color:"#4ecdc4",width:2}};'
+ 'var t4={x:steps,y:warmup_cos,mode:"lines",name:"Warmup + Cosine",line:{color:"#c8a96e",width:3}};'
+ 'var layout={title:{text:"Learning Rate Schedules Compared",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Training Step"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Learning Rate",tickformat:".1e"},margin:{t:50,r:30,b:50,l:65},legend:{x:0.6,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-lr-schedules",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Learning rate schedules:</strong> Step decay drops abruptly, exponential decays smoothly but fast, cosine provides a gentle S-curve, and warmup + cosine (gold, thick) is the modern standard &mdash; ramp up then smooth decay.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> CosineAnnealingLR\n<span class="kw">from</span> transformers <span class="kw">import</span> get_linear_schedule_with_warmup\n\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)\n\n<span class="cm"># Option 1: Cosine annealing (PyTorch native)</span>\nscheduler = <span class="fn">CosineAnnealingLR</span>(optimizer, T_max=<span class="num">10000</span>, eta_min=<span class="num">1e-6</span>)\n\n<span class="cm"># Option 2: Linear warmup + linear decay (HuggingFace)</span>\ntotal_steps = <span class="num">50000</span>\nwarmup_steps = <span class="num">5000</span>\nscheduler = <span class="fn">get_linear_schedule_with_warmup</span>(\n    optimizer,\n    num_warmup_steps=warmup_steps,\n    num_training_steps=total_steps\n)\n\n<span class="cm"># Use in training loop</span>\n<span class="kw">for</span> step, batch <span class="kw">in</span> <span class="fn">enumerate</span>(dataloader):\n    loss = model(batch)\n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()\n    scheduler.<span class="fn">step</span>()   <span class="cm"># update LR after each step</span>\n    optimizer.<span class="fn">zero_grad</span>()</code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does cosine annealing work better than linear decay? The cosine curve spends more time at intermediate learning rates (the "belly" of the cosine) and transitions slowly near both ends. This means the model explores broadly during mid-training and fine-tunes gently at the end. The smooth transition avoids the sudden shocks of step decay that can temporarily increase loss.</div></div>'

/* ============================================================
   SECTION 6: Constrained Optimization
   ============================================================ */
+ '<h2 class="l-title">6. Constrained Optimization</h2>'

+ '<p class="l-text">Not all optimization is unconstrained. Sometimes we need to minimize a function subject to constraints. The crown jewel of constrained optimization &mdash; <strong>Lagrange multipliers</strong> &mdash; appears throughout ML: SVMs, entropy maximization, KKT conditions for sparse solutions, and dual formulations that enable kernel tricks.</p>'

+ '<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(\\theta, \\lambda) = f(\\theta) + \\sum_i \\lambda_i g_i(\\theta)$$</div><div class="formula-sub">Convert constrained problem $\\min f(\\theta)$ s.t. $g_i(\\theta) = 0$ into an unconstrained problem. The $\\lambda_i$ are Lagrange multipliers &mdash; shadow prices for each constraint.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Equality Constraints</div><div class="step-detail">Minimize $f(\\theta)$ subject to $g(\\theta) = 0$. At the optimum, $\\nabla f = \\lambda \\nabla g$ &mdash; the gradients are parallel. The multiplier $\\lambda$ tells you how much the optimal value changes per unit constraint relaxation.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Inequality Constraints (KKT)</div><div class="step-detail">Minimize $f(\\theta)$ subject to $g(\\theta) \\leq 0$. KKT conditions: (1) $\\nabla f + \\lambda \\nabla g = 0$, (2) $g(\\theta) \\leq 0$, (3) $\\lambda \\geq 0$, (4) $\\lambda g(\\theta) = 0$ (complementary slackness).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Duality</div><div class="step-detail">The dual problem: $\\max_\\lambda \\min_\\theta \\mathcal{L}(\\theta, \\lambda)$. Strong duality (primal = dual) holds for convex problems under Slater\'s condition. This enables the kernel trick in SVMs.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">SVM AS CONSTRAINED OPTIMIZATION</div><div class="example-body">'
+ 'The Support Vector Machine is a beautiful example of constrained optimization:<br><br>'
+ '<strong>Primal:</strong> $\\min_{w,b} \\frac{1}{2}\\|w\\|^2$ subject to $y_i(w \\cdot x_i + b) \\geq 1$ for all $i$<br><br>'
+ '<strong>Dual:</strong> $\\max_\\alpha \\sum_i \\alpha_i - \\frac{1}{2}\\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i \\cdot x_j)$ subject to $\\alpha_i \\geq 0$<br><br>'
+ 'The dual form only depends on dot products $x_i \\cdot x_j$, enabling the <strong>kernel trick</strong>: replace $x_i \\cdot x_j$ with $K(x_i, x_j)$ for any valid kernel. This maps data into infinite-dimensional spaces without ever computing the mapping.'
+ '</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Lagrange Multipliers</div>'
+ '<div class="compare-item">&#8226; Handle equality constraints $g(\\theta) = 0$</div>'
+ '<div class="compare-item">&#8226; Optimum: $\\nabla f = \\lambda \\nabla g$</div>'
+ '<div class="compare-item">&#8226; Used in: max entropy, PCA, Fisher LDA</div>'
+ '<div class="compare-item">&#8226; $\\lambda$ = sensitivity of objective to constraint</div></div>'
+ '<div class="compare-col"><div class="compare-title">KKT Conditions</div>'
+ '<div class="compare-item">&#8226; Handle inequality constraints $g(\\theta) \\leq 0$</div>'
+ '<div class="compare-item">&#8226; Key: complementary slackness $\\lambda g = 0$</div>'
+ '<div class="compare-item">&#8226; Used in: SVMs, L1 regularization (sparsity)</div>'
+ '<div class="compare-item">&#8226; Active constraint: $g=0, \\lambda>0$. Inactive: $g<0, \\lambda=0$</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Why constrained optimization matters for NLP:</strong> Maximum entropy models (MaxEnt) are constrained optimization problems: maximize entropy subject to feature expectation constraints. This gives logistic regression! The regularized softmax output of transformers can be viewed through this lens too. Understanding duality also explains why kernel SVMs were so powerful for text classification before deep learning.</div>'

/* ============================================================
   SECTION 7: Regularization as Optimization
   ============================================================ */
+ '<h2 class="l-title">7. Regularization as Optimization</h2>'

+ '<p class="l-text">Regularization is not just a "trick" to prevent overfitting &mdash; it is a <strong>modification of the optimization problem itself</strong>. Adding a penalty term changes the loss landscape, the optimal solution, and the geometry of the optimization trajectory. Understanding regularization as optimization reveals deep connections between L1 sparsity, L2 smoothness, and Bayesian priors.</p>'

+ '<div class="calc-formula"><div class="formula-label">REGULARIZED OBJECTIVE</div><div class="formula-main">$$\\mathcal{L}_{reg}(\\theta) = \\mathcal{L}_{data}(\\theta) + \\lambda \\Omega(\\theta)$$</div><div class="formula-sub">The total loss is data loss plus a penalty $\\Omega(\\theta)$ scaled by $\\lambda$. The penalty pushes parameters toward simpler solutions.</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">L1 (Lasso) &mdash; $\\lambda\\|\\theta\\|_1$</div>'
+ '<div class="compare-item">&#8226; Penalty: sum of absolute values</div>'
+ '<div class="compare-item">&#8226; Produces <strong>sparse</strong> solutions ($\\theta_i = 0$)</div>'
+ '<div class="compare-item">&#8226; Equivalent to Laplace prior</div>'
+ '<div class="compare-item">&#8226; Non-differentiable at 0 (needs subgradients)</div>'
+ '<div class="compare-item">&#8226; Feature selection: irrelevant features get exactly 0</div></div>'
+ '<div class="compare-col"><div class="compare-title">L2 (Ridge) &mdash; $\\frac{\\lambda}{2}\\|\\theta\\|_2^2$</div>'
+ '<div class="compare-item">&#8226; Penalty: sum of squared values</div>'
+ '<div class="compare-item">&#8226; Produces <strong>small</strong> but non-zero weights</div>'
+ '<div class="compare-item">&#8226; Equivalent to Gaussian prior</div>'
+ '<div class="compare-item">&#8226; Smooth, differentiable everywhere</div>'
+ '<div class="compare-item">&#8226; Weight decay: $\\theta -= \\eta \\lambda \\theta$ at each step</div></div>'
+ '</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Elastic Net</div><div class="card-body">$\\alpha \\|\\theta\\|_1 + (1-\\alpha)\\|\\theta\\|_2^2$. Combines L1 sparsity with L2 smoothness. Parameter $\\alpha$ controls the mix. Works when features are correlated (L1 alone picks arbitrarily among correlated features).</div></div>'
+ '<div class="calc-card"><div class="card-title">Dropout</div><div class="card-body">Randomly zero out neurons with probability $p$ during training. Approximates an ensemble of $2^n$ subnetworks. Acts as implicit L2 regularization + noise injection.</div></div>'
+ '<div class="calc-card"><div class="card-title">Weight Decay</div><div class="card-body">$\\theta_{t+1} = (1 - \\eta\\lambda)\\theta_t - \\eta \\nabla \\mathcal{L}$. Equivalent to L2 for SGD, but NOT for Adam. AdamW correctly decouples weight decay from the adaptive step.</div></div>'
+ '<div class="calc-card"><div class="card-title">Early Stopping</div><div class="card-body">Stop training when validation loss increases. Implicitly limits the effective number of parameters. Equivalent to L2 regularization for linear models with appropriate learning rate.</div></div>'
+ '</div>'

/* Plotly: L1 vs L2 constraint geometry */
+ '<div id="plot-regularization-geometry" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var theta=[];for(var i=0;i<=360;i++){var a=i*Math.PI/180;theta.push(a);}'
+ 'var l2x=theta.map(function(a){return Math.cos(a);});var l2y=theta.map(function(a){return Math.sin(a);});'
+ 'var n=100;var l1x=[];var l1y=[];for(var i=0;i<=n;i++){l1x.push(1-i/n);l1y.push(i/n);}for(var i=0;i<=n;i++){l1x.push(-i/n);l1y.push(1-i/n);}for(var i=0;i<=n;i++){l1x.push(-1+i/n);l1y.push(-i/n);}for(var i=0;i<=n;i++){l1x.push(i/n);l1y.push(-1+i/n);}'
+ 'var t1={x:l2x,y:l2y,mode:"lines",name:"L2 (circle)",line:{color:"#4ecdc4",width:3},fill:"toself",fillcolor:"rgba(78,205,196,0.1)"};'
+ 'var t2={x:l1x,y:l1y,mode:"lines",name:"L1 (diamond)",line:{color:"#c8a96e",width:3},fill:"toself",fillcolor:"rgba(200,169,110,0.1)"};'
+ 'var t3={x:[0.3],y:[0],mode:"markers",name:"L1 sparse solution",marker:{color:"#c8a96e",size:12,symbol:"star"},showlegend:true};'
+ 'var t4={x:[0.7,0.65,0.6,0.55,0.5],y:[0.7,0.65,0.6,0.55,0.5],mode:"lines",name:"Loss contours",line:{color:"#e74c3c",width:1,dash:"dot"},showlegend:true};'
+ 'var layout={title:{text:"L1 vs L2 Constraint Geometry",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2081",range:[-1.5,1.5],scaleanchor:"y"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2082",range:[-1.5,1.5]},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"},annotations:[{x:0.3,y:0,text:"Sparse!",showarrow:true,arrowhead:2,ax:40,ay:-30,font:{color:"#c8a96e",size:11}}]};'
+ 'Plotly.newPlot("plot-regularization-geometry",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Why L1 produces sparsity:</strong> The L1 constraint region (diamond) has corners on the axes. Loss contours (ellipses from unconstrained optimum) are more likely to first touch the diamond at a corner, where one parameter is exactly zero. The L2 ball (circle) has no corners, so solutions are rarely exactly sparse.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="cm"># L2 regularization via weight_decay in optimizer</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">3e-4</span>,\n    weight_decay=<span class="num">0.01</span>  <span class="cm"># L2 penalty strength</span>\n)\n\n<span class="cm"># Explicit L1 regularization (add to loss)</span>\n<span class="kw">def</span> <span class="fn">l1_loss</span>(model, lambda_l1=<span class="num">1e-5</span>):\n    l1 = <span class="fn">sum</span>(p.<span class="fn">abs</span>().<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    <span class="kw">return</span> lambda_l1 * l1\n\n<span class="cm"># Elastic Net: combine L1 + L2</span>\n<span class="kw">def</span> <span class="fn">elastic_net</span>(model, alpha=<span class="num">0.5</span>, lam=<span class="num">1e-4</span>):\n    l1 = <span class="fn">sum</span>(p.<span class="fn">abs</span>().<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    l2 = <span class="fn">sum</span>((p**<span class="num">2</span>).<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    <span class="kw">return</span> lam * (alpha * l1 + (<span class="num">1</span>-alpha) * l2)\n\n<span class="cm"># Training with explicit regularization</span>\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    loss = criterion(model(batch), targets)\n    loss += <span class="fn">l1_loss</span>(model)  <span class="cm"># add L1 penalty</span>\n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does L1 produce exact zeros but L2 only produces small values? Consider the gradient: L1 gradient is $\\pm \\lambda$ (constant regardless of parameter magnitude), so it applies the same "shrinkage force" to all parameters. Small parameters get pushed all the way to zero. L2 gradient is $\\lambda \\theta$ (proportional to parameter magnitude), so the force weakens as parameters approach zero &mdash; they shrink but never quite reach zero.</div></div>'

/* ============================================================
   SECTION 8: Second-Order Methods
   ============================================================ */
+ '<h2 class="l-title">8. Second-Order Methods</h2>'

+ '<p class="l-text">First-order methods use only the gradient (first derivative). Second-order methods also use the <strong>Hessian</strong> (second derivative), which captures curvature information. This allows them to take much better steps &mdash; adapting to the shape of the loss surface rather than just the slope. The tradeoff: second-order methods converge faster per step but each step is vastly more expensive.</p>'

+ '<div class="calc-formula"><div class="formula-label">NEWTON\'S METHOD</div><div class="formula-main">$$\\theta_{t+1} = \\theta_t - [\\nabla^2 f(\\theta_t)]^{-1} \\nabla f(\\theta_t)$$</div><div class="formula-sub">Use the inverse Hessian to transform the gradient into a Newton step. Converges quadratically near the minimum, but requires $O(n^2)$ storage and $O(n^3)$ inversion per step.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Newton\'s Method</div><div class="card-body">Quadratic convergence (doubles correct digits each step). But $O(n^3)$ per step and $O(n^2)$ memory. Impossible for neural networks with $n > 10^6$ parameters.</div></div>'
+ '<div class="calc-card"><div class="card-title">BFGS</div><div class="card-body">Builds approximate inverse Hessian from gradient history. No explicit Hessian computation. Still $O(n^2)$ memory. Good for small-to-medium problems.</div></div>'
+ '<div class="calc-card"><div class="card-title">L-BFGS</div><div class="card-body">Limited-memory BFGS: stores only last $m$ gradient pairs ($m \\approx 5$-$20$). $O(mn)$ memory. Used for fine-tuning, full-batch training, classical NLP models.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hessian-Free</div><div class="card-body">Never stores the Hessian. Uses CG to solve $H\\cdot v$ via automatic differentiation ($Hv$ products are $O(n)$). Can work for medium-sized neural networks.</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">First-Order (Gradient)</div>'
+ '<div class="compare-item">&#8226; Uses only $\\nabla f$ &mdash; $O(n)$ per step</div>'
+ '<div class="compare-item">&#8226; Linear convergence rate at best</div>'
+ '<div class="compare-item">&#8226; Struggles with ill-conditioned problems</div>'
+ '<div class="compare-item">&#8226; Scales to billions of parameters</div>'
+ '<div class="compare-item">&#8226; Examples: SGD, Adam, AdamW</div></div>'
+ '<div class="compare-col"><div class="compare-title">Second-Order (Hessian)</div>'
+ '<div class="compare-item">&#8226; Uses $\\nabla f$ + $\\nabla^2 f$ &mdash; $O(n^2)$+ per step</div>'
+ '<div class="compare-item">&#8226; Quadratic convergence near optimum</div>'
+ '<div class="compare-item">&#8226; Handles ill-conditioning naturally</div>'
+ '<div class="compare-item">&#8226; Practical only for $n < 10^5$ parameters</div>'
+ '<div class="compare-item">&#8226; Examples: Newton, BFGS, L-BFGS</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">WHEN TO USE SECOND-ORDER METHODS</div><div class="example-body">'
+ '<strong>Use L-BFGS when:</strong><br>'
+ '&#8226; Problem is convex or nearly convex (logistic regression, CRF)<br>'
+ '&#8226; Full-batch gradients are feasible (small dataset)<br>'
+ '&#8226; Fine-tuning a pretrained model with frozen features<br>'
+ '&#8226; Classical NLP: MaxEnt, CRFs, structured prediction<br><br>'
+ '<strong>Stick with first-order when:</strong><br>'
+ '&#8226; Model has millions+ parameters (transformers, LLMs)<br>'
+ '&#8226; Stochastic gradients needed (large dataset, mini-batch)<br>'
+ '&#8226; Training from scratch with random initialization'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize\n<span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># L-BFGS in PyTorch (for small models / fine-tuning)</span>\noptimizer = torch.optim.<span class="fn">LBFGS</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">1.0</span>,\n    max_iter=<span class="num">20</span>,\n    history_size=<span class="num">10</span>\n)\n\n<span class="kw">def</span> <span class="fn">closure</span>():\n    optimizer.<span class="fn">zero_grad</span>()\n    output = <span class="fn">model</span>(X_train)\n    loss = <span class="fn">criterion</span>(output, y_train)\n    loss.<span class="fn">backward</span>()\n    <span class="kw">return</span> loss\n\n<span class="cm"># L-BFGS requires a closure that recomputes the loss</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):\n    loss = optimizer.<span class="fn">step</span>(closure)\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: loss = {loss.item():.6f}"</span>)\n\n<span class="cm"># SciPy L-BFGS-B for classical ML</span>\n<span class="kw">def</span> <span class="fn">objective</span>(w):\n    <span class="cm"># logistic regression loss + gradient</span>\n    z = X @ w\n    loss = np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> + np.<span class="fn">exp</span>(-y * z)))\n    grad = -X.T @ (y / (<span class="num">1</span> + np.<span class="fn">exp</span>(y * z))) / <span class="fn">len</span>(y)\n    <span class="kw">return</span> loss, grad\n\nresult = <span class="fn">minimize</span>(objective, x0=np.<span class="fn">zeros</span>(d), method=<span class="str">"L-BFGS-B"</span>, jac=<span class="num">True</span>)</code></pre></div>'

+ '<div class="l-note"><strong>The Hessian in deep learning:</strong> While we can\'t store the full Hessian, we can compute Hessian-vector products efficiently using autodiff ($Hv$ costs the same as 1 gradient computation). This enables techniques like spectral analysis of the loss landscape, which reveals that neural network Hessians have very few large eigenvalues &mdash; most curvature is concentrated in a small subspace. This partly explains why first-order methods work so well.</div>'

/* ============================================================
   SECTION 9: Optimization in Practice
   ============================================================ */
+ '<h2 class="l-title">9. Optimization in Practice</h2>'

+ '<p class="l-text">There is a significant gap between optimization theory and what works in practice for training modern NLP models. This section covers the practical techniques that are essential for training transformers: batch size effects, gradient accumulation, mixed precision, gradient clipping, and distributed training. These are not theoretical niceties &mdash; they determine whether your training run succeeds or fails.</p>'

+ '<div class="calc-highlight"><strong>The practitioner\'s golden rule:</strong> Start with AdamW, warmup + cosine schedule, gradient clipping at 1.0, and weight decay 0.01. This configuration works for the vast majority of transformer training scenarios. Only deviate if you have a specific reason.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Batch Size</div><div class="card-body">Larger batches = lower gradient variance but less implicit regularization. Linear scaling rule: multiply LR by $k$ when multiplying batch by $k$. Critical for distributed training.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradient Accumulation</div><div class="card-body">Simulate large batches on small GPUs. Accumulate gradients over $k$ mini-batches before updating. Effective batch = $k \\times$ mini-batch size. Essential for LLM fine-tuning.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mixed Precision</div><div class="card-body">FP16/BF16 for forward/backward, FP32 for optimizer states. Halves memory, doubles throughput. BF16 is preferred (wider range, no loss scaling needed). Standard for modern training.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradient Clipping</div><div class="card-body">$g \\leftarrow g \\cdot \\min(1, c/\\|g\\|)$. Prevents exploding gradients. Max norm 1.0 is standard for transformers. Essential for stability, especially early in training.</div></div>'
+ '<div class="calc-card"><div class="card-title">Data Parallel</div><div class="card-body">Split batch across GPUs, each computes gradient, then all-reduce to sync. PyTorch DDP handles this automatically. Near-linear scaling up to 8&ndash;64 GPUs.</div></div>'
+ '<div class="calc-card"><div class="card-title">FSDP / ZeRO</div><div class="card-body">Shard model parameters, gradients, and optimizer states across GPUs. Enables training models too large for one GPU. ZeRO Stage 3 = FSDP = full sharding.</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Forward</div><div class="flow-desc">FP16/BF16</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Loss</div><div class="flow-desc">FP32</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Backward</div><div class="flow-desc">FP16/BF16</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Clip Grad</div><div class="flow-desc">max norm 1.0</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Update</div><div class="flow-desc">FP32</div></div>'
+ '</div>'

/* Plotly: Batch size vs convergence */
+ '<div id="plot-batch-convergence" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var steps=[];var loss_b16=[];var loss_b128=[];var loss_b512=[];'
+ 'for(var i=0;i<100;i++){steps.push(i);'
+ 'var noise16=(Math.random()-0.5)*0.4;var noise128=(Math.random()-0.5)*0.15;var noise512=(Math.random()-0.5)*0.06;'
+ 'loss_b16.push(3*Math.exp(-0.05*i)+0.3+noise16);'
+ 'loss_b128.push(3*Math.exp(-0.04*i)+0.25+noise128);'
+ 'loss_b512.push(3*Math.exp(-0.035*i)+0.22+noise512);}'
+ 'var t1={x:steps,y:loss_b16,mode:"lines",name:"Batch=16 (noisy, fast early)",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:steps,y:loss_b128,mode:"lines",name:"Batch=128 (balanced)",line:{color:"#4ecdc4",width:2}};'
+ 'var t3={x:steps,y:loss_b512,mode:"lines",name:"Batch=512 (smooth, slower)",line:{color:"#c8a96e",width:2}};'
+ 'var layout={title:{text:"Batch Size Effect on Training Loss",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Training Steps"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Loss"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.4,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-batch-convergence",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Batch size tradeoff:</strong> Small batches (16) have noisy but fast-moving loss curves with better generalization. Large batches (512) are smoother but may converge to sharper minima. Medium batches (128) balance noise and stability.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\n<span class="cm"># Mixed precision + gradient accumulation</span>\nscaler = <span class="fn">GradScaler</span>()\naccum_steps = <span class="num">4</span>  <span class="cm"># effective batch = 4 x mini_batch</span>\n\noptimizer.<span class="fn">zero_grad</span>()\n<span class="kw">for</span> i, batch <span class="kw">in</span> <span class="fn">enumerate</span>(dataloader):\n    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):  <span class="cm"># FP16/BF16 forward</span>\n        loss = model(batch) / accum_steps  <span class="cm"># scale loss</span>\n    \n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># accumulate gradients</span>\n    \n    <span class="kw">if</span> (i + <span class="num">1</span>) % accum_steps == <span class="num">0</span>:\n        scaler.<span class="fn">unscale_</span>(optimizer)\n        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(\n            model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>\n        )\n        scaler.<span class="fn">step</span>(optimizer)\n        scaler.<span class="fn">update</span>()\n        optimizer.<span class="fn">zero_grad</span>()\n        scheduler.<span class="fn">step</span>()\n\n<span class="cm"># Distributed training with DDP</span>\n<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP\n\nmodel = DDP(model, device_ids=[local_rank])\n<span class="cm"># Training loop is identical — DDP handles gradient sync</span></code></pre></div>'

+ '<div class="calc-example"><div class="example-label">TYPICAL TRAINING CONFIGURATIONS</div><div class="example-body">'
+ '<strong>BERT Fine-tuning:</strong> AdamW, LR=2e-5, warmup 10% of steps, weight decay 0.01, batch 32, 3 epochs, gradient clip 1.0<br><br>'
+ '<strong>GPT Pretraining:</strong> AdamW, LR=6e-4, warmup 2000 steps, cosine decay to LR/10, weight decay 0.1, batch 512 (via accumulation), ~300B tokens<br><br>'
+ '<strong>LoRA Fine-tuning:</strong> AdamW, LR=2e-4, constant LR or cosine, no weight decay on LoRA params, batch 4 + accumulation 8, 1-3 epochs<br><br>'
+ '<strong>Image Model (ResNet):</strong> SGD + momentum 0.9, LR=0.1, step decay /10 at epochs 30/60/90, weight decay 5e-4, batch 256'
+ '</div></div>'

+ '<div class="l-warn"><strong>Common optimization failures and fixes:</strong> (1) Loss NaN/Inf &rarr; reduce LR, add gradient clipping, check for division by zero. (2) Loss plateaus &rarr; try warmup, different scheduler, or larger batch. (3) Validation loss diverges early &rarr; increase weight decay, add dropout, reduce model size. (4) Training is too slow &rarr; use mixed precision, gradient accumulation, increase batch size.</div>'

/* ============================================================
   SECTION 10: Summary & Next Steps
   ============================================================ */
+ '<h2 class="l-title">10. Summary &amp; Next Steps</h2>'

+ '<p class="l-text">You now have a complete understanding of optimization theory for machine learning, from mathematical foundations to practical training recipes. Here is your optimization toolkit:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Gradient Descent</div><div class="card-body">$\\theta -= \\eta \\nabla \\mathcal{L}$. The foundation. Batch, stochastic, and mini-batch variants. Convergence depends on smoothness and convexity.</div><div class="card-formula">O(1/T) convex, O(1/T^2) strongly convex</div></div>'
+ '<div class="calc-card"><div class="card-title">AdamW</div><div class="card-body">Momentum + adaptive rates + decoupled weight decay. The standard optimizer for transformers and LLMs. Defaults: $\\beta_1$=0.9, $\\beta_2$=0.999.</div><div class="card-formula">The practitioner\'s default choice</div></div>'
+ '<div class="calc-card"><div class="card-title">Cosine Schedule</div><div class="card-body">Warmup + cosine annealing. Smooth decay with gentle transitions. The dominant LR schedule for modern NLP pretraining and fine-tuning.</div><div class="card-formula">With linear warmup for stability</div></div>'
+ '<div class="calc-card"><div class="card-title">Regularization</div><div class="card-body">L1 for sparsity, L2/weight decay for smoothness, dropout for ensembling. Modify the optimization landscape to favor simpler solutions.</div><div class="card-formula">Bayesian interpretation: priors on parameters</div></div>'
+ '<div class="calc-card"><div class="card-title">Constrained Opt</div><div class="card-body">Lagrange multipliers + KKT conditions. Enable SVMs, maximum entropy models, and dual formulations with kernel tricks.</div><div class="card-formula">Foundation for classical ML theory</div></div>'
+ '<div class="calc-card"><div class="card-title">Practical Training</div><div class="card-body">Mixed precision (BF16), gradient accumulation, clipping, DDP/FSDP. The engineering that makes training at scale possible.</div><div class="card-formula">Theory meets engineering</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Convexity</div><div class="flow-desc">Theory foundation</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Gradient Methods</div><div class="flow-desc">SGD, Adam, AdamW</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">LR Schedule</div><div class="flow-desc">Warmup + cosine</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Regularization</div><div class="flow-desc">L1, L2, dropout</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">At Scale</div><div class="flow-desc">Mixed prec, DDP</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Next Lesson:</strong> In Lesson 6 we move to <strong>Statistics for ML</strong> &mdash; probability distributions, maximum likelihood estimation, Bayesian inference, and hypothesis testing. You\'ll see how optimization (this lesson) and probability theory combine: MLE is just minimizing negative log-likelihood, and MAP estimation is MLE with a regularization term that comes from a Bayesian prior.</div>',

/* ============================================================
   TURKISH TRANSLATION
   ============================================================ */

tr: '<p class="l-text"><strong>Her makine öğrenmesi modeli, özünde bir optimizasyon problemidir.</strong> Bir sinir ağını eğitmek, bir kayıp fonksiyonunu minimize eden konfigürasyonu bulmak için milyonlarca parametre arasında arama yapmak demektir. Optimizer, öğrenme oranı programı ve regularizasyon stratejinizin kalitesi, modelinizin iyi bir çözüme yakınsayıp yakınsamamasını doğrudan belirler. Optimizasyon teorisi, tüm modern ML\'nin motorudur.</p>'

+ '<p class="l-text">Bu ders, ML pratisyenleri için eksiksiz optimizasyon araç kutusunu kapsar: konvekslik ve gradyan inişinin matematiksel temellerinden, Adam ve AdamW gibi modern optimizerlara, karışık hassasiyet eğitimi ve gradyan birikimi gibi pratik konulara kadar. Her kavram gerçek NLP ve derin öğrenme iş akışlarına bağlanmıştır.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Her denetimli modeli θ* = argmin L(θ) olarak çerçeveleyip bileşenlerini okumayı</li>'
+ '<li>Hessian ile konveksliği test edip gradyan inişinin yakınsamasını öngörmeyi</li>'
+ '<li>Veri büyüklüğüne ve gürültüsüne göre batch, stokastik veya mini-batch SGD seçmeyi</li>'
+ '<li>Bias-düzeltilmiş birinci/ikinci moment güncellemelerinden Adam\'ı uygulamayı</li>'
+ '<li>Öğrenme oranını warmup, kosinüs ve adım azaltma programlarıyla ayarlamayı</li>'
+ '<li>Büyük transformer eğitimini gradyan kırpma ve birikim ile kararlı kılmayı</li>'
+ '</ul>'
+ '</div>'

/* ── 1. ML\'de Optimizasyon ── */
+ '<h2 class="l-title">1. ML\'de Optimizasyon</h2>'

+ '<div class="calc-highlight"><strong>Evrensel ML tarifi:</strong> Parametreleri $\\theta$ olan bir model tanımla, modelin ne kadar kötü olduğunu ölçen bir kayıp fonksiyonu $\\mathcal{L}(\\theta)$ tanımla, sonra $\\theta^* = \\arg\\min_\\theta \\mathcal{L}(\\theta)$ bulmak için optimizasyon kullan. Her denetimli öğrenme algoritması bu kalıba istisna olmaksızın uyar.</div>'

+ '<p class="l-text">Optimizasyon bakış açısı tüm ML\'yi birleştirir. Doğrusal regresyon ortalama kare hatayı minimize eder. Lojistik regresyon çapraz entropiyi minimize eder. Sinir ağları seçtiğiniz kayıp fonksiyonunu minimize eder. Tek farklar (1) modelin parametrizasyonu, (2) kayıp fonksiyonu seçimi ve (3) minimumu bulmak için kullanılan optimizasyon algoritmasıdır.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Parametreler</div><div class="card-body">Çevirdiği düğmeler: ağırlıklar, biaslar, gömülümler. GPT ölçeğinde bir modelin milyarlarca boyutlu uzayda milyarlarca parametresi vardır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kayıp Fonksiyonu</div><div class="card-body">Model kalitesini ölçer. Sınıflandırma için çapraz entropi, regresyon için MSE, gömülümler için kontrastif kayıp. (Neredeyse her yerde) türevlenebilir olmalıdır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradyanlar</div><div class="card-body">En dik çıkış yönü. Kaybı azaltmak için gradyanın tersine hareket ederiz. Geri yayılım bunları zincir kuralı ile verimli hesaplar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Öğrenme Oranı</div><div class="card-body">Her güncelleme için adım boyutu. Çok büyük = ıraksaklık. Çok küçük = acımasızca yavaş yakınsama. En önemli hiperparametre.</div></div>'
+ '</div>'

+ '<div class="calc-formula"><div class="formula-label">ML OPTİMİZASYON PROBLEMİ</div><div class="formula-main">$$\\theta^* = \\arg\\min_\\theta \\frac{1}{N} \\sum_{i=1}^{N} \\mathcal{L}(f_\\theta(x_i), y_i) + \\lambda \\Omega(\\theta)$$</div><div class="formula-sub">$N$ eğitim örneği üzerinden ortalama kaybı artı $\\lambda$ ile ağırlıklandırılmış regularizasyon terimi $\\Omega(\\theta)$\'yı minimize eden $\\theta$ parametrelerini bul.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">İleri Geçiş</div><div class="step-detail">Bir girdi toplu işlemesi için tahminleri hesapla $\\hat{y}_i = f_\\theta(x_i)$. Transformer\'da bu gömülüme, dikkat, ileri beslemeli, çıkış projeksiyonu anlamına gelir.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Kayıp Hesaplama</div><div class="step-detail">Toplu işlem üzerinden $\\mathcal{L} = \\frac{1}{B} \\sum_{i=1}^{B} \\ell(\\hat{y}_i, y_i)$ hesapla. Dil modelleme için çapraz entropi, regresyon için MSE.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Geri Geçiş</div><div class="step-detail">Geri yayılım (ters mod otomatik türev) ile $\\nabla_\\theta \\mathcal{L}$ hesapla. Her parametre nasıl değişmesi gerektiğini söyleyen bir gradyan alır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">4</div><div class="step-content"><div class="step-title">Parametre Güncellemesi</div><div class="step-detail">$\\theta \\leftarrow \\theta - \\eta \\nabla_\\theta \\mathcal{L}$ uygula (veya daha gelişmiş bir güncelleme kuralı). Yakınsama sağlanana kadar adım 1\'den tekrarla.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">KAYIP MANZARASI SEZGİSİ</div><div class="example-body">'
+ 'Kayıp fonksiyonunu yüksek boyutlu uzayda dağlık bir arazi olarak hayal edin:<br><br>'
+ '<strong>Global minimum:</strong> En derin vadi &mdash; mümkün olan en iyi parametreler. Buraya ulaşmak istiyoruz.<br>'
+ '<strong>Yerel minimumlar:</strong> En derin olmayan diğer vadiler. Burada sıkışıp kalabiliriz.<br>'
+ '<strong>Eyer noktaları:</strong> Bazı yönlerde minimum ama diğer yönlerde maksimum olan noktalar. Yüksek boyutlarda çok yaygındır.<br>'
+ '<strong>Platolar:</strong> Gradyanların sıfıra yakın olduğu düz bölgeler. Eğitim durmuş gibi görünür.<br><br>'
+ 'Pratikte, milyonlarca parametreli sinir ağları için "kötü" kritik noktaların çoğu yerel minimum değil eyer noktasıdır. Momentum\'lu SGD eyer noktalarından doğal olarak kaçar.'
+ '</div></div>'

+ '<div class="l-note"><strong>NLP modelleri neden optimize etmesi zor:</strong> Dil modelleri ayrık girdilere (tokenler), devasa kelime dağarcıklarına (30k-100k), uzun menzilli bağımlılıklara (binlerce token) ve son derece konveks olmayan kayıp yüzeyine sahiptir. Transformer mimarisi kısmen başarılı oldu çünkü RNN\'lerden <em>optimize etmesi daha kolay</em> &mdash; öz-dikkat tüm pozisyonlar arasında doğrudan gradyan yolları sağlar.</div>'

/* ── 2. Konveks vs Konveks Olmayan ── */
+ '<h2 class="l-title">2. Konveks vs Konveks Olmayan Optimizasyon</h2>'

+ '<p class="l-text">Konveks ve konveks olmayan optimizasyon arasındaki ayrım, alandaki en önemli teorik ayrımdır. Konveks problemlerin gradyan inişinin bulması garanti edilen tek bir global minimumu vardır. Konveks olmayan problemlerin (sinir ağları eğitimi gibi) birden fazla yerel minimum, eyer noktası ve plato içeren karmaşık manzaraları vardır.</p>'

+ '<div class="calc-formula"><div class="formula-label">KONVEKSLİK TANIMI</div><div class="formula-main">$$f(\\lambda x + (1-\\lambda) y) \\leq \\lambda f(x) + (1-\\lambda) f(y) \\quad \\forall \\lambda \\in [0, 1]$$</div><div class="formula-sub">Bir fonksiyon, grafik üzerindeki herhangi iki noktayı birleştiren doğru parçası grafiğin üstünde veya üzerinde kalıyorsa konvekstir. Geometrik olarak: fonksiyon "yukarı doğru bükük."</div></div>'

+ '<div class="calc-highlight"><strong>Jensen Eşitsizliği:</strong> Konveks $f$ ve rastgele değişken $X$ için: $f(\\mathbb{E}[X]) \\leq \\mathbb{E}[f(X)]$. Bu varyasyonel çıkarım (ELBO), EM algoritması ve ML\'deki birçok sınırın temelidir. İçbükey fonksiyonlar için eşitsizlik tersine döner.</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Konveks Problemler</div>'
+ '<div class="compare-item">&#8226; Tek global minimum (yerel minimum tuzağı yok)</div>'
+ '<div class="compare-item">&#8226; Gradyan inişinin yakınsama garantisi</div>'
+ '<div class="compare-item">&#8226; Örnekler: doğrusal/lojistik regresyon, SVM, lasso</div>'
+ '<div class="compare-item">&#8226; Teori olgun ve zariftir</div>'
+ '<div class="compare-item">&#8226; Herhangi bir yerel minimum aynı zamanda global minimumdur</div></div>'
+ '<div class="compare-col"><div class="compare-title">Konveks Olmayan Problemler</div>'
+ '<div class="compare-item">&#8226; Birden fazla yerel minimum + eyer noktaları</div>'
+ '<div class="compare-item">&#8226; Global optimuma yakınsama garantisi yok</div>'
+ '<div class="compare-item">&#8226; Örnekler: sinir ağları, matris faktorlestirme</div>'
+ '<div class="compare-item">&#8226; Teori hâlâ aktif araştırma alanı</div>'
+ '<div class="compare-item">&#8226; Pratikte teorinin öngördüğünden daha iyi çalışır</div></div>'
+ '</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Hessian Testi</div><div class="card-body">$f$ ancak ve ancak Hessian\'ı $\\nabla^2 f$ her yerde pozitif yarı-kesin ise konvekstir. Her noktada tüm özdeğerler $\\geq 0$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kesin Konvekslik</div><div class="card-body">Kesin eşitsizlik: minimum <em>tektir</em>. Hessian pozitif kesindir ($\\lambda_i > 0$). L2-regularizeli problemler kesin konvekstir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Güçlü Konvekslik</div><div class="card-body">$f(y) \\geq f(x) + \\nabla f(x)^T(y-x) + \\frac{\\mu}{2}\\|y-x\\|^2$. Doğrusal yakınsama hızını garanti eder. $\\mu$ parametresi eğrilik alt sınırını kontrol eder.</div></div>'
+ '<div class="calc-card"><div class="card-title">Lipschitz Pürüzsüzlük</div><div class="card-body">$\\|\\nabla f(x) - \\nabla f(y)\\| \\leq L\\|x - y\\|$. Gradyanlar çok hızlı değişmez. Yakınsama kanıtları için gerekli. Maks güvenli öğrenme oranını $1/L$ olarak belirler.</div></div>'
+ '</div>'

/* Plotly: Convex vs Non-Convex (TR) */
+ '<div id="plot-convex-landscape-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var x=[];var yConv=[];var yNonConv=[];'
+ 'for(var i=-30;i<=30;i++){var xi=i/10;x.push(xi);yConv.push(xi*xi);yNonConv.push(xi*xi+2*Math.sin(3*xi));}'
+ 'var t1={x:x,y:yConv,mode:"lines",name:"Konveks: x\\u00b2",line:{color:"#4ecdc4",width:3}};'
+ 'var t2={x:x,y:yNonConv,mode:"lines",name:"Konveks Olmayan: x\\u00b2+2sin(3x)",line:{color:"#c8a96e",width:3}};'
+ 'var layout={title:{text:"Konveks vs Konveks Olmayan Kayıp Manzaraları",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Parametre \\u03b8"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Kayıp"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-convex-landscape-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Konveks (turkuaz) vs Konveks olmayan (altın):</strong> Konveks fonksiyonun herhangi bir başlangıç noktasından gradyan inişinin ulaştığı tek bir minimumu vardır. Konveks olmayan fonksiyonda optimizasyonun sıkışabileceği birden fazla yerel minimum vardır.</div></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Sinir ağları konveks değilse neden bu kadar iyi çalışır? Son araştırmalar şunu önermektedir: (1) yüksek boyutlu ağlardaki çoğu yerel minimum benzer kayıp değerlerine sahiptir, (2) gerçek zorluk yerel minimumlar değil eyer noktalarıdır ve (3) SGD gürültüsü keskin minimumlardan kaçmaya ve daha iyi genelleştiren düz minimumları bulmaya yardımcı olur.</div></div>'

/* ── 3. Gradyan Tabanlı Yöntemler ── */
+ '<h2 class="l-title">3. Gradyan Tabanlı Yöntemler</h2>'

+ '<p class="l-text">Gradyan inişi ML optimizasyonunun temel atıdır. Fikir güzel bir şekilde basittir: gradyanı (en dik çıkış yönü) hesapla, sonra ters yönde bir adım at. Yakınsama sağlanana kadar tekrarla. Varyantlar, gradyanı tahmin etmek için ne kadar veri kullandıkları ve adım boyutunu nasıl ayarladıkları bakımından farklıdır.</p>'

+ '<div class="calc-formula"><div class="formula-label">GRADYAN İNİŞİ GÜNCELLEMESİ</div><div class="formula-main">$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_\\theta \\mathcal{L}(\\theta_t)$$</div><div class="formula-sub">Parametreleri negatif gradyan yönünde, öğrenme oranı $\\eta$ ile ölçekleyerek hareket ettir. Bu tüm gradyan tabanlı yöntemlerin temelidir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Toplu GD</div><div class="card-body">Her gradyan için tüm veri setini kullan. Tam gradyan, kararlı yakınsama. Ama adım başına $O(N)$ büyük veri setleri için çok pahalı. DL\'de nadiren kullanılır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Stokastik GD</div><div class="card-body">Adım başına tek örnek kullan. Çok gürültülü gradyan ama adım başına $O(1)$. Gürültü örtük regularizasyon görevi görür, genellemeye yardımcı olur.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mini-Toplu GD</div><div class="card-body">Adım başına $B$ örnek kullan (tipik: 16-512). Her iki dünyanın en iyisi: azaltılmış gürültü, GPU paralelizmi, yönetilebilir bellek. DL\'de standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradyan Gürültüsü</div><div class="card-body">$\\text{Var}[\\nabla \\mathcal{L}_B] \\propto \\sigma^2 / B$. Daha büyük toplular varyansı azaltır. Ama biraz gürültü faydalıdır &mdash; keskin minimumlardan kaçmaya yardımcı olur.</div></div>'
+ '</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Konveks için Yakınsama</div><div class="step-detail">$L$-pürüzsüz konveks fonksiyonlar için, $\\eta = 1/L$ ile GD $O(1/T)$ hızında yakınsar. $\\mu$-güçlü konveks için: $O((1-\\mu/L)^T)$ &mdash; doğrusal yakınsama. Koşul sayısı $\\kappa = L/\\mu$ zorluğu kontrol eder.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Konveks Olmayan için Yakınsama</div><div class="step-detail">GD $O(1/\\epsilon^2)$ adımda $\\|\\nabla f\\| \\leq \\epsilon$ olan bir nokta bulur. Bu bir <em>durağan nokta</em>dır, zorunlu olarak minimum değildir. Ama pratikte SGD tutarlı bir şekilde iyi çözümler bulur.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Öğrenme Oranı Seçimi</div><div class="step-detail">Yakınsama için $\\eta < 2/L$ gereklidir. Pratikte $\\eta \\in [10^{-4}, 10^{-2}]$ ile başla ve ayarla. Transformer\'lar için warmup ile $\\eta = 3 \\times 10^{-4}$ yaygın bir başlangıç noktasıdır.</div></div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">gradient_descent</span>(grad_fn, theta0, lr=<span class="num">0.01</span>, steps=<span class="num">1000</span>):\n    <span class="str">"""Temel gradyan inisi."""</span>\n    theta = theta0.copy()\n    history = [theta.copy()]\n    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(steps):\n        g = <span class="fn">grad_fn</span>(theta)\n        theta = theta - lr * g\n        history.<span class="fn">append</span>(theta.copy())\n    <span class="kw">return</span> theta, history\n\n<span class="cm"># Ornek: f(x) = x^2 + 3y^2 minimize et</span>\n<span class="kw">def</span> <span class="fn">grad_f</span>(theta):\n    <span class="kw">return</span> np.<span class="fn">array</span>([<span class="num">2</span>*theta[<span class="num">0</span>], <span class="num">6</span>*theta[<span class="num">1</span>]])\n\ntheta0 = np.<span class="fn">array</span>([<span class="num">4.0</span>, <span class="num">3.0</span>])\nsonuc, gecmis = <span class="fn">gradient_descent</span>(grad_f, theta0, lr=<span class="num">0.1</span>, steps=<span class="num">50</span>)\n<span class="fn">print</span>(<span class="str">f"Minimum noktasi: {sonuc}"</span>)  <span class="cm"># ~[0, 0]</span></code></pre></div>'

+ '<div class="l-warn"><strong>Gradyan yeterlidir (neredeyse):</strong> Teoride ikinci derece bilgi (Hessian) çok daha hızlı yakınsama verir. Ama sinir ağları için Hessian, $n$\'nin milyarlar olabileceği bir $n \\times n$ matristir &mdash; depolamak veya ters almak imkansız. Akıllı hilelerle (momentum, uyarlanabilir oranlar) birinci derece yöntemler pratikte hakim olur.</div>'

/* ── 4. SGD Varyantları ve Uyarlanabilir Optimizer\'lar ── */
+ '<h2 class="l-title">4. SGD Varyantları ve Uyarlanabilir Optimizer\'lar</h2>'

+ '<p class="l-text">Temel SGD\'nin iki önemli sorunu vardır: (1) yüksek eğrilikli yönlerde salınır ve (2) gradyan büyüklüğünden bağımsız olarak tüm parametreler için aynı öğrenme oranını kullanır. Modern optimizer\'lar her iki sorunu da çözer. Her optimizer\'ın davranışını anlamak NLP modelleri eğitmek için kritiktir.</p>'

+ '<div class="calc-formula"><div class="formula-label">MOMENTUMLU SGD</div><div class="formula-main">$$v_t = \\beta v_{t-1} + \\nabla \\mathcal{L}(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - \\eta v_t$$</div><div class="formula-sub">Gradyanların üstel hareketli ortalamasını biriktir. Tipik $\\beta = 0.9$. Yokuştan yuvarlanan bir top gibi davranır &mdash; tutarlı yönlerde hız kazanır.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">ADAM OPTİMİZER</div><div class="formula-main">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$$</div><div class="formula-sub">$$\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Momentum</div><div class="card-body">$v_t = \\beta v_{t-1} + g_t$. Gradyanları zaman içerisinde yumuşatır. Salınımı azaltır. Ani yön değişikliklerine direnen ağır bir top gibi. Tipik $\\beta = 0.9$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Nesterov</div><div class="card-body">"İleriye bak" momentumu: gradyanı $\\theta$\'da değil $\\theta - \\beta v$\'da hesapla. Biraz daha iyi yakınsama teorisi. Klasik ML\'de kullanılır ama DL\'de daha az yaygındır.</div></div>'
+ '<div class="calc-card"><div class="card-title">RMSProp</div><div class="card-body">Gradyan büyüklüklerinin çalışma ortalamasına böl: $\\theta -= \\eta g / \\sqrt{\\mathbb{E}[g^2]+\\epsilon}$. Parametre bazında öğrenme oranlarını uyarlar. RNN\'ler için iyi.</div></div>'
+ '<div class="calc-card"><div class="card-title">Adam</div><div class="card-body">Momentum (birinci moment) + RMSProp (ikinci moment) + bias düzeltme. Varsayılan seçim: $\\beta_1=0.9, \\beta_2=0.999, \\epsilon=10^{-8}$.</div></div>'
+ '<div class="calc-card"><div class="card-title">AdamW</div><div class="card-body">Ayrıştırılmış ağırlık azalmalı Adam: $\\theta -= \\eta(\\hat{m}/\\sqrt{\\hat{v}+\\epsilon} + \\lambda\\theta)$. Transformer\'lar ve LLM\'ler için standart. Adam\'ın L2 regularizasyon hatasını düzeltir.</div></div>'
+ '<div class="calc-card"><div class="card-title">LAMB/LARS</div><div class="card-body">Büyük toplu eğitim için katman bazında uyarlanabilir oranlar. Her katman için öğrenme oranını $\\|\\theta\\|/\\|\\nabla\\theta\\|$ ile ölçekle. BERT\'i 64k+ toplu boyutuyla ön-eğitmek için kullanılır.</div></div>'
+ '</div>'

/* Plotly: Optimizer comparison (TR) */
+ '<div id="plot-optimizer-comparison-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var steps=100;var lr=0.01;'
+ 'function rosenbrock_grad(x,y){return[2*(x-1)-400*x*(y-x*x),200*(y-x*x)];}'
+ 'function sim_gd(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);x-=lr*g[0];y-=lr*g[1];path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'function sim_mom(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0,vx=0,vy=0,beta=0.9;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);vx=beta*vx+g[0];vy=beta*vy+g[1];x-=lr*vx;y-=lr*vy;path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'function sim_adam(x0,y0){var path_x=[x0],path_y=[y0],x=x0,y=y0,mx=0,my=0,vvx=0,vvy=0,b1=0.9,b2=0.999,eps=1e-8;for(var i=0;i<steps;i++){var g=rosenbrock_grad(x,y);mx=b1*mx+(1-b1)*g[0];my=b1*my+(1-b1)*g[1];vvx=b2*vvx+(1-b2)*g[0]*g[0];vvy=b2*vvy+(1-b2)*g[1]*g[1];var mxh=mx/(1-Math.pow(b1,i+1));var myh=my/(1-Math.pow(b1,i+1));var vxh=vvx/(1-Math.pow(b2,i+1));var vyh=vvy/(1-Math.pow(b2,i+1));x-=lr*mxh/(Math.sqrt(vxh)+eps);y-=lr*myh/(Math.sqrt(vyh)+eps);path_x.push(x);path_y.push(y);}return{x:path_x,y:path_y};}'
+ 'var gd=sim_gd(-1,2);var mom=sim_mom(-1,2);var adam=sim_adam(-1,2);'
+ 'var t1={x:gd.x,y:gd.y,mode:"lines+markers",name:"Temel GD",line:{color:"#e74c3c",width:2},marker:{size:3}};'
+ 'var t2={x:mom.x,y:mom.y,mode:"lines+markers",name:"Momentum",line:{color:"#4ecdc4",width:2},marker:{size:3}};'
+ 'var t3={x:adam.x,y:adam.y,mode:"lines+markers",name:"Adam",line:{color:"#c8a96e",width:2},marker:{size:3}};'
+ 'var t4={x:[1],y:[1],mode:"markers",name:"Minimum",marker:{color:"#4de87a",size:12,symbol:"star"}};'
+ 'var layout={title:{text:"Rosenbrock Fonksiyonunda Optimizer Yolları",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2081"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2082"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-optimizer-comparison-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Optimizer yolları:</strong> Temel GD sallanır, Momentum hız kazanır ama aşırı atar, Adam parametre bazında oranları uyarlar ve (1,1)\'deki minimuma en pürüzsüz şekilde yakınsar.</div></div>'

+ '<div class="calc-example"><div class="example-label">HANGİ OPTİMİZER NE ZAMAN KULLANILIR</div><div class="example-body">'
+ '<strong>SGD + Momentum:</strong> CNN\'ler (görüntü modelleri) için en iyisi, genellikle en iyi genelleme verir. Dikkatli LR ayarı gerektirir. ResNet, EfficientNet eğitiminde kullanılır.<br>'
+ '<strong>Adam:</strong> Çoğu görev için varsayılan. Hızlı yakınsama, daha az ayar gerekli. Seyrek gradyanlar için iyi (gömülümler, NLP).<br>'
+ '<strong>AdamW:</strong> Ayrıştırılmış ağırlık azalmalı Adam. Transformer\'lar için standart. BERT, GPT, T5, LLaMA ön-eğitiminde kullanılır.<br>'
+ '<strong>Adafactor:</strong> Bellek verimli Adam alternatifi. İkinci moment matrisini faktorlize eder. T5 ve çok büyük modeller için kullanılır.<br>'
+ '<strong>LAMB:</strong> Çok büyük toplu eğitim için (>8k). Katman bazında oran ölçekleme. Hızlı BERT ön-eğitimi için kullanılır.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\nmodel = nn.<span class="fn">TransformerEncoder</span>(...)\n\n<span class="cm"># AdamW — transformer\'lar icin standart</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">3e-4</span>,\n    betas=(<span class="num">0.9</span>, <span class="num">0.999</span>),\n    eps=<span class="num">1e-8</span>,\n    weight_decay=<span class="num">0.01</span>   <span class="cm"># ayristirilmis agirlik azalmasi</span>\n)\n\n<span class="cm"># CNN\'ler icin Momentumlu SGD</span>\noptimizer_sgd = torch.optim.<span class="fn">SGD</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">0.1</span>,\n    momentum=<span class="num">0.9</span>,\n    weight_decay=<span class="num">5e-4</span>,\n    nesterov=<span class="num">True</span>\n)\n\n<span class="cm"># Egitim dongusu</span>\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    optimizer.<span class="fn">zero_grad</span>()\n    loss = model(batch)\n    loss.<span class="fn">backward</span>()\n    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>)\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="l-note"><strong>Adam vs AdamW &mdash; neden önemli:</strong> Orijinal Adam ağırlık azalmasını uyarlanabilir oran içerisinde uygular: $\\theta -= \\eta(\\hat{m}+\\lambda\\theta)/(\\sqrt{\\hat{v}}+\\epsilon)$. Bu, büyük gradyanlara sahip parametrelerin <em>daha az</em> regularizasyon alacağı anlamına gelir, bu yanlıştır. AdamW ayrıştırır: $\\theta -= \\eta\\hat{m}/(\\sqrt{\\hat{v}}+\\epsilon) + \\eta\\lambda\\theta$. Bu tüm parametreler arasında tekdüze regularizasyon verir. Her modern transformer AdamW kullanır.</div>'

/* ── 5. Öğrenme Oranı Programları ── */
+ '<h2 class="l-title">5. Öğrenme Oranı Programları</h2>'

+ '<p class="l-text">Öğrenme oranı derin öğrenmede en etkili hiperparametredir. Ama sabit bir öğrenme oranı kullanmak optimalin altındadır: erken <strong>büyük adımlar</strong> (hızlı keşfet) ve sonra <strong>küçük adımlar</strong> (minimum yakınında ince ayar) istersiniz. Öğrenme oranı programları bu fikri formalize eder ve doğru programı seçmek eğitim çalışmanızı başarısız kılar veya başarılı yapar.</p>'

+ '<div class="calc-highlight"><strong>Warmup paradoksu:</strong> Transformer\'lar öğrenme oranı warmup gerektirir (yakl. 0\'dan başlayarak ilk birkaç bin adım içerisinde artırma). Warmup olmadan, Adam\'ın başlangıç ikinci-moment tahminleri güvenilmez olur ve eğitimi istikrarsızlaştıran tehlikeli büyük güncellemelere neden olur. Bu özellikle büyük modeller için kritiktir.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Adım Azalması</div><div class="card-body">Her $k$ epoch\'ta LR\'yi $\\gamma$ ile çarp: $\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/k \\rfloor}$. Basit, etkili. ResNet\'te kullanılır (30, 60, 90 epoch\'larda 10\'a böl).</div></div>'
+ '<div class="calc-card"><div class="card-title">Üstel Azalma</div><div class="card-body">$\\eta_t = \\eta_0 \\cdot \\gamma^t$. Pürüzsüz sürekli azalma. Adım azalmasından daha kademeli. Risk: $\\gamma$ çok küçükse çok hızlı azalabilir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kosinüs Tavlama</div><div class="card-body">$\\eta_t = \\eta_{min} + \\frac{\\eta_0 - \\eta_{min}}{2}(1 + \\cos(\\pi t / T))$. $\\eta_0$\'dan $\\eta_{min}$\'e pürüzsüz azalma. Transformer ön-eğitimi için standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">Doğrusal Warmup</div><div class="card-body">$t < T_{warm}$ için $\\eta_t = \\eta_0 \\cdot t / T_{warm}$. Warmup adımları boyunca 0\'dan $\\eta_0$\'a rampa yap. Transformer\'larla Adam için zorunlu.</div></div>'
+ '<div class="calc-card"><div class="card-title">Döngüsel LR</div><div class="card-body">$\\eta_{min}$ ile $\\eta_{max}$ arasında salınır. Yerel minimumlardan kaçmaya yardımcı olabilir. Süper-yakınsama: çok yüksek maks LR ile tek büyük döngü.</div></div>'
+ '<div class="calc-card"><div class="card-title">Warmup + Kosinüs</div><div class="card-body">Doğrusal warmup sonra kosinüs azalma. LLM ön-eğitimi için baskın program. BERT: 10k warmup adımı. GPT-3: 300B token üzerinde warmup + kosinüs.</div></div>'
+ '</div>'

/* Plotly: LR Schedules (TR) */
+ '<div id="plot-lr-schedules-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var T=200;var steps=[];var step_d=[];var exp_d=[];var cos_d=[];var warmup_cos=[];var eta0=0.001;'
+ 'for(var i=0;i<T;i++){steps.push(i);'
+ 'step_d.push(eta0*Math.pow(0.1,Math.floor(i/50)));'
+ 'exp_d.push(eta0*Math.pow(0.99,i));'
+ 'cos_d.push(0.5*eta0*(1+Math.cos(Math.PI*i/T)));'
+ 'var warm=20;if(i<warm){warmup_cos.push(eta0*i/warm);}else{warmup_cos.push(0.5*eta0*(1+Math.cos(Math.PI*(i-warm)/(T-warm))));}}'
+ 'var t1={x:steps,y:step_d,mode:"lines",name:"Adım Azalması",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:steps,y:exp_d,mode:"lines",name:"Üstel",line:{color:"#9b59b6",width:2}};'
+ 'var t3={x:steps,y:cos_d,mode:"lines",name:"Kosinüs",line:{color:"#4ecdc4",width:2}};'
+ 'var t4={x:steps,y:warmup_cos,mode:"lines",name:"Warmup + Kosinüs",line:{color:"#c8a96e",width:3}};'
+ 'var layout={title:{text:"Öğrenme Oranı Programlarının Karşılaştırılması",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Eğitim Adımı"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Öğrenme Oranı",tickformat:".1e"},margin:{t:50,r:30,b:50,l:65},legend:{x:0.6,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-lr-schedules-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Öğrenme oranı programları:</strong> Adım azalması ani düşer, üstel pürüzsüz ama hızlı azalır, kosinüs nazik bir S-eğrisi sağlar ve warmup + kosinüs (altın, kalın) modern standarttır &mdash; rampa yap sonra pürüzsüz azalt.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.optim.lr_scheduler <span class="kw">import</span> CosineAnnealingLR\n<span class="kw">from</span> transformers <span class="kw">import</span> get_linear_schedule_with_warmup\n\noptimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)\n\n<span class="cm"># Secenek 1: Kosinus tavlama (PyTorch yerlesik)</span>\nscheduler = <span class="fn">CosineAnnealingLR</span>(optimizer, T_max=<span class="num">10000</span>, eta_min=<span class="num">1e-6</span>)\n\n<span class="cm"># Secenek 2: Dogrusal warmup + dogrusal azalma (HuggingFace)</span>\ntoplam_adim = <span class="num">50000</span>\nwarmup_adim = <span class="num">5000</span>\nscheduler = <span class="fn">get_linear_schedule_with_warmup</span>(\n    optimizer,\n    num_warmup_steps=warmup_adim,\n    num_training_steps=toplam_adim\n)\n\n<span class="cm"># Egitim dongusunde kullan</span>\n<span class="kw">for</span> adim, batch <span class="kw">in</span> <span class="fn">enumerate</span>(dataloader):\n    loss = model(batch)\n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()\n    scheduler.<span class="fn">step</span>()   <span class="cm"># her adimda LR guncelle</span>\n    optimizer.<span class="fn">zero_grad</span>()</code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">Kosinüs tavlama neden doğrusal azalmadan daha iyi çalışır? Kosinüs eğrisi ara öğrenme oranlarında daha fazla zaman harcar (kosinüsün "karnı") ve her iki uçta yavaş geçiş yapar. Bu, modelin orta-eğitimde geniş çaplı keşfettiğini ve sonunda nazikçe ince ayar yaptığını gösterir. Pürüzsüz geçiş, kaybı geçici olarak artırabilen adım azalmasının ani şoklarından kaçınır.</div></div>'

/* ── 6. Kısıtlı Optimizasyon ── */
+ '<h2 class="l-title">6. Kısıtlı Optimizasyon</h2>'

+ '<p class="l-text">Tüm optimizasyon kısıtsız değildir. Bazen kısıtlar altında bir fonksiyonu minimize etmemiz gerekir. Kısıtlı optimizasyonun taç mücevheri &mdash; <strong>Lagrange çarpanları</strong> &mdash; ML boyunca görünür: SVM\'ler, entropi maksimizasyonu, seyrek çözümler için KKT koşulları ve çekirdek hilelerini mümkün kılan ikili formülasyonlar.</p>'

+ '<div class="calc-formula"><div class="formula-label">LAGRANGIAN</div><div class="formula-main">$$\\mathcal{L}(\\theta, \\lambda) = f(\\theta) + \\sum_i \\lambda_i g_i(\\theta)$$</div><div class="formula-sub">$g_i(\\theta) = 0$ koşulu altında $\\min f(\\theta)$ kısıtlı problemini kısıtsız probleme dönüştür. $\\lambda_i$\'ler Lagrange çarpanlarıdır &mdash; her kısıt için gölge fiyatlar.</div></div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Eşitlik Kısıtları</div><div class="step-detail">$g(\\theta) = 0$ koşulu altında $f(\\theta)$\'yi minimize et. Optimumda $\\nabla f = \\lambda \\nabla g$ &mdash; gradyanlar paraleldir. Çarpan $\\lambda$, birim kısıt gevşetme başına optimal değerin ne kadar değişeceğini söyler.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Eşitsizlik Kısıtları (KKT)</div><div class="step-detail">$g(\\theta) \\leq 0$ koşulu altında $f(\\theta)$\'yi minimize et. KKT koşulları: (1) $\\nabla f + \\lambda \\nabla g = 0$, (2) $g(\\theta) \\leq 0$, (3) $\\lambda \\geq 0$, (4) $\\lambda g(\\theta) = 0$ (tamamlayıcı gevşetme).</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Dualite</div><div class="step-detail">İkili problem: $\\max_\\lambda \\min_\\theta \\mathcal{L}(\\theta, \\lambda)$. Güçlü dualite (asıl = ikili) Slater koşulu altında konveks problemler için geçerlidir. Bu SVM\'lerde çekirdek hilesini mümkün kılar.</div></div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">KISITLI OPTİMİZASYON OLARAK SVM</div><div class="example-body">'
+ 'Destek Vektör Makinesi kısıtlı optimizasyonun güzel bir örneğidir:<br><br>'
+ '<strong>Asıl:</strong> Tüm $i$ için $y_i(w \\cdot x_i + b) \\geq 1$ koşulu altında $\\min_{w,b} \\frac{1}{2}\\|w\\|^2$<br><br>'
+ '<strong>İkili:</strong> $\\alpha_i \\geq 0$ koşulu altında $\\max_\\alpha \\sum_i \\alpha_i - \\frac{1}{2}\\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i \\cdot x_j)$<br><br>'
+ 'İkili form yalnızca iç çarpımlar $x_i \\cdot x_j$\'ye bağlıdır, <strong>çekirdek hilesini</strong> mümkün kılar: herhangi bir geçerli çekirdek için $x_i \\cdot x_j$\'yı $K(x_i, x_j)$ ile değiştir. Bu, haritalamayı hiç hesaplamadan verileri sonsuz boyutlu uzaylara eşler.'
+ '</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Lagrange Çarpanları</div>'
+ '<div class="compare-item">&#8226; Eşitlik kısıtlarını yönetir $g(\\theta) = 0$</div>'
+ '<div class="compare-item">&#8226; Optimum: $\\nabla f = \\lambda \\nabla g$</div>'
+ '<div class="compare-item">&#8226; Kullanım alanları: maks entropi, PCA, Fisher LDA</div>'
+ '<div class="compare-item">&#8226; $\\lambda$ = amacın kısıta duyarlılığı</div></div>'
+ '<div class="compare-col"><div class="compare-title">KKT Koşulları</div>'
+ '<div class="compare-item">&#8226; Eşitsizlik kısıtlarını yönetir $g(\\theta) \\leq 0$</div>'
+ '<div class="compare-item">&#8226; Anahtar: tamamlayıcı gevşetme $\\lambda g = 0$</div>'
+ '<div class="compare-item">&#8226; Kullanım alanları: SVM\'ler, L1 regularizasyon (seyreklik)</div>'
+ '<div class="compare-item">&#8226; Aktif kısıt: $g=0, \\lambda>0$. Pasif: $g<0, \\lambda=0$</div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Kısıtlı optimizasyon NLP için neden önemlidir:</strong> Maksimum entropi modelleri (MaxEnt) kısıtlı optimizasyon problemleridir: özellik beklentisi kısıtlarına tabi entropiyi maksimize et. Bu lojistik regresyon verir! Transformer\'ların regularize edilmiş softmax çıktısı da bu gözlükten görülebilir. Dualiteyi anlamak, derin öğrenme öncesi metin sınıflandırması için çekirdek SVM\'lerin neden bu kadar güçlü olduğunu da açıklar.</div>'

/* ── 7. Optimizasyon Olarak Regularizasyon ── */
+ '<h2 class="l-title">7. Optimizasyon Olarak Regularizasyon</h2>'

+ '<p class="l-text">Regularizasyon sadece aşırı uyumu önlemek için bir "hile" değildir &mdash; <strong>optimizasyon probleminin kendisinin modifikasyonudur</strong>. Bir ceza terimi eklemek kayıp manzarasını, optimal çözümü ve optimizasyon yolunun geometrisini değiştirir. Regularizasyonu optimizasyon olarak anlamak L1 seyrekliği, L2 pürüzsüzlüğü ve Bayesian önceleri arasındaki derin bağlantıları ortaya çıkarır.</p>'

+ '<div class="calc-formula"><div class="formula-label">REGULARİZE EDİLMİŞ AMAÇ</div><div class="formula-main">$$\\mathcal{L}_{reg}(\\theta) = \\mathcal{L}_{data}(\\theta) + \\lambda \\Omega(\\theta)$$</div><div class="formula-sub">Toplam kayıp, veri kaybı artı $\\lambda$ ile ölçeklendirilmiş bir ceza $\\Omega(\\theta)$\'dır. Ceza parametreleri daha basit çözümlere doğru iter.</div></div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">L1 (Lasso) &mdash; $\\lambda\\|\\theta\\|_1$</div>'
+ '<div class="compare-item">&#8226; Ceza: mutlak değerlerin toplamı</div>'
+ '<div class="compare-item">&#8226; <strong>Seyrek</strong> çözümler üretir ($\\theta_i = 0$)</div>'
+ '<div class="compare-item">&#8226; Laplace önceline eşdeğer</div>'
+ '<div class="compare-item">&#8226; 0\'da türevlenebilir değil (alt-gradyanlar gerekir)</div>'
+ '<div class="compare-item">&#8226; Özellik seçimi: ilgisiz özellikler tam 0 alır</div></div>'
+ '<div class="compare-col"><div class="compare-title">L2 (Ridge) &mdash; $\\frac{\\lambda}{2}\\|\\theta\\|_2^2$</div>'
+ '<div class="compare-item">&#8226; Ceza: kareli değerlerin toplamı</div>'
+ '<div class="compare-item">&#8226; <strong>Küçük</strong> ama sıfır olmayan ağırlıklar üretir</div>'
+ '<div class="compare-item">&#8226; Gauss önceline eşdeğer</div>'
+ '<div class="compare-item">&#8226; Her yerde pürüzsüz, türevlenebilir</div>'
+ '<div class="compare-item">&#8226; Ağırlık azalması: her adımda $\\theta -= \\eta \\lambda \\theta$</div></div>'
+ '</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Elastik Ağ</div><div class="card-body">$\\alpha \\|\\theta\\|_1 + (1-\\alpha)\\|\\theta\\|_2^2$. L1 seyrekliği ile L2 pürüzsüzlüğünü birleştirir. $\\alpha$ parametresi karışımı kontrol eder. Özellikler koreleli olduğunda çalışır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dropout</div><div class="card-body">Eğitim sırasında nöronları $p$ olasılıkla rastgele sıfırla. $2^n$ alt ağın topluluğunun yaklaşımı. Örtük L2 regularizasyonu + gürültü enjeksiyonu görevi görür.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ağırlık Azalması</div><div class="card-body">$\\theta_{t+1} = (1 - \\eta\\lambda)\\theta_t - \\eta \\nabla \\mathcal{L}$. SGD için L2\'ye eşdeğer, ama Adam için DEĞİL. AdamW ağırlık azalmasını uyarlanabilir adımdan doğru şekilde ayrıştırır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Erken Durdurma</div><div class="card-body">Doğrulama kaybı arttığında eğitimi durdur. Etkin parametre sayısını örtük olarak sınırlar. Uygun öğrenme oranlı doğrusal modeller için L2 regularizasyona eşdeğerdir.</div></div>'
+ '</div>'

/* Plotly: L1 vs L2 (TR) */
+ '<div id="plot-regularization-geometry-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var theta=[];for(var i=0;i<=360;i++){var a=i*Math.PI/180;theta.push(a);}'
+ 'var l2x=theta.map(function(a){return Math.cos(a);});var l2y=theta.map(function(a){return Math.sin(a);});'
+ 'var n=100;var l1x=[];var l1y=[];for(var i=0;i<=n;i++){l1x.push(1-i/n);l1y.push(i/n);}for(var i=0;i<=n;i++){l1x.push(-i/n);l1y.push(1-i/n);}for(var i=0;i<=n;i++){l1x.push(-1+i/n);l1y.push(-i/n);}for(var i=0;i<=n;i++){l1x.push(i/n);l1y.push(-1+i/n);}'
+ 'var t1={x:l2x,y:l2y,mode:"lines",name:"L2 (daire)",line:{color:"#4ecdc4",width:3},fill:"toself",fillcolor:"rgba(78,205,196,0.1)"};'
+ 'var t2={x:l1x,y:l1y,mode:"lines",name:"L1 (elmas)",line:{color:"#c8a96e",width:3},fill:"toself",fillcolor:"rgba(200,169,110,0.1)"};'
+ 'var t3={x:[0.3],y:[0],mode:"markers",name:"L1 seyrek çözüm",marker:{color:"#c8a96e",size:12,symbol:"star"},showlegend:true};'
+ 'var t4={x:[0.7,0.65,0.6,0.55,0.5],y:[0.7,0.65,0.6,0.55,0.5],mode:"lines",name:"Kayıp konturları",line:{color:"#e74c3c",width:1,dash:"dot"},showlegend:true};'
+ 'var layout={title:{text:"L1 vs L2 Kısıt Geometrisi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2081",range:[-1.5,1.5],scaleanchor:"y"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"\\u03b8\\u2082",range:[-1.5,1.5]},margin:{t:50,r:30,b:50,l:50},legend:{x:0.02,y:0.98,bgcolor:"rgba(0,0,0,0.3)"},annotations:[{x:0.3,y:0,text:"Seyrek!",showarrow:true,arrowhead:2,ax:40,ay:-30,font:{color:"#c8a96e",size:11}}]};'
+ 'Plotly.newPlot("plot-regularization-geometry-tr",[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>L1 neden seyreklik üretir:</strong> L1 kısıt bölgesi (elmas) eksenlerde köşelere sahiptir. Kayıp konturları (kısıtsız optimumdan elipsler) elmasa köşe noktasında &mdash; bir parametrenin tam sıfır olduğu yerde &mdash; dokunma olasılığı daha yüksektir. L2 topu (daire) köşesi yoktur, bu yüzden çözümler nadiren tam seyrek olur.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="cm"># Optimizer\'da weight_decay ile L2 regularizasyonu</span>\noptimizer = torch.optim.<span class="fn">AdamW</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">3e-4</span>,\n    weight_decay=<span class="num">0.01</span>  <span class="cm"># L2 ceza gucu</span>\n)\n\n<span class="cm"># Acik L1 regularizasyonu (kayba ekle)</span>\n<span class="kw">def</span> <span class="fn">l1_loss</span>(model, lambda_l1=<span class="num">1e-5</span>):\n    l1 = <span class="fn">sum</span>(p.<span class="fn">abs</span>().<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    <span class="kw">return</span> lambda_l1 * l1\n\n<span class="cm"># Elastik Ag: L1 + L2 birlestir</span>\n<span class="kw">def</span> <span class="fn">elastic_net</span>(model, alpha=<span class="num">0.5</span>, lam=<span class="num">1e-4</span>):\n    l1 = <span class="fn">sum</span>(p.<span class="fn">abs</span>().<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    l2 = <span class="fn">sum</span>((p**<span class="num">2</span>).<span class="fn">sum</span>() <span class="kw">for</span> p <span class="kw">in</span> model.<span class="fn">parameters</span>())\n    <span class="kw">return</span> lam * (alpha * l1 + (<span class="num">1</span>-alpha) * l2)\n\n<span class="cm"># Acik regularizasyonla egitim</span>\n<span class="kw">for</span> batch <span class="kw">in</span> dataloader:\n    loss = criterion(model(batch), targets)\n    loss += <span class="fn">l1_loss</span>(model)  <span class="cm"># L1 cezasi ekle</span>\n    loss.<span class="fn">backward</span>()\n    optimizer.<span class="fn">step</span>()</code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜN</div><div class="think-body">L1 neden tam sıfırlar üretir ama L2 sadece küçük değerler üretir? Gradyanı düşünün: L1 gradyanı $\\pm \\lambda$\'dır (parametre büyüklüğünden bağımsız sabit), bu yüzden tüm parametrelere aynı "küçülme kuvveti" uygular. Küçük parametreler tamamen sıfıra itilir. L2 gradyanı $\\lambda \\theta$\'dır (parametre büyüklüğü ile orantılı), bu yüzden parametreler sıfıra yaklaştıkça kuvvet zayıflar &mdash; küçülürler ama asla tam sıfıra ulaşamazlar.</div></div>'

/* ── 8. İkinci Derece Yöntemler ── */
+ '<h2 class="l-title">8. İkinci Derece Yöntemler</h2>'

+ '<p class="l-text">Birinci derece yöntemler yalnızca gradyanı (birinci türev) kullanır. İkinci derece yöntemler eğrilik bilgisini yakalayan <strong>Hessian</strong>\'ı (ikinci türev) da kullanır. Bu, kayıp yüzeyinin şekline uyum sağlayan &mdash; sadece eğime değil &mdash; çok daha iyi adımlar atmalarını sağlar. Ödenek: ikinci derece yöntemler adım başına daha hızlı yakınsar ama her adım çok daha pahalıdır.</p>'

+ '<div class="calc-formula"><div class="formula-label">NEWTON YÖNTEMİ</div><div class="formula-main">$$\\theta_{t+1} = \\theta_t - [\\nabla^2 f(\\theta_t)]^{-1} \\nabla f(\\theta_t)$$</div><div class="formula-sub">Gradyanı Newton adımına dönüştürmek için ters Hessian kullan. Minimum yakınında kuadratik yakınsar, ama adım başına $O(n^2)$ depolama ve $O(n^3)$ ters alma gerektirir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Newton Yöntemi</div><div class="card-body">Kuadratik yakınsama (her adımda doğru basamak sayısını ikiye katlar). Ama adım başına $O(n^3)$ ve $O(n^2)$ bellek. $n > 10^6$ parametreli sinir ağları için imkansız.</div></div>'
+ '<div class="calc-card"><div class="card-title">BFGS</div><div class="card-body">Gradyan geçmişinden yaklaşık ters Hessian oluşturur. Açık Hessian hesaplaması yok. Hâlâ $O(n^2)$ bellek. Küçük-orta problemler için iyi.</div></div>'
+ '<div class="calc-card"><div class="card-title">L-BFGS</div><div class="card-body">Sınırlı bellekli BFGS: sadece son $m$ gradyan çiftini depolar ($m \\approx 5$-$20$). $O(mn)$ bellek. İnce ayar, tam toplu eğitim, klasik NLP modelleri için kullanılır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Hessian-Free</div><div class="card-body">Hessian\'ı asla depolamaz. Otomatik türev ile $H \\cdot v$ çözmek için CG kullanır ($Hv$ çarpımları $O(n)$\'dır). Orta boyutlu sinir ağları için çalışabilir.</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Birinci Derece (Gradyan)</div>'
+ '<div class="compare-item">&#8226; Sadece $\\nabla f$ kullanır &mdash; adım başına $O(n)$</div>'
+ '<div class="compare-item">&#8226; En iyi ihtimalle doğrusal yakınsama hızı</div>'
+ '<div class="compare-item">&#8226; Kötü koşullu problemlerle zorlanır</div>'
+ '<div class="compare-item">&#8226; Milyarlarca parametreye ölçeklenir</div>'
+ '<div class="compare-item">&#8226; Örnekler: SGD, Adam, AdamW</div></div>'
+ '<div class="compare-col"><div class="compare-title">İkinci Derece (Hessian)</div>'
+ '<div class="compare-item">&#8226; $\\nabla f$ + $\\nabla^2 f$ kullanır &mdash; adım başına $O(n^2)$+</div>'
+ '<div class="compare-item">&#8226; Optimum yakınında kuadratik yakınsama</div>'
+ '<div class="compare-item">&#8226; Kötü koşullanmayı doğal olarak yönetir</div>'
+ '<div class="compare-item">&#8226; Sadece $n < 10^5$ parametre için pratik</div>'
+ '<div class="compare-item">&#8226; Örnekler: Newton, BFGS, L-BFGS</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">İKİNCİ DERECE YÖNTEMLER NE ZAMAN KULLANILIR</div><div class="example-body">'
+ '<strong>L-BFGS\'yi şu durumlarda kullan:</strong><br>'
+ '&#8226; Problem konveks veya neredeyse konveks (lojistik regresyon, CRF)<br>'
+ '&#8226; Tam toplu gradyanlar uygundur (küçük veri seti)<br>'
+ '&#8226; Dondurulmuş özelliklerle ön-eğitimli modeli ince ayar<br>'
+ '&#8226; Klasik NLP: MaxEnt, CRF\'ler, yapısal tahmin<br><br>'
+ '<strong>Şu durumlarda birinci dereceyle kal:</strong><br>'
+ '&#8226; Model milyonlarca+ parametreye sahip (transformer\'lar, LLM\'ler)<br>'
+ '&#8226; Stokastik gradyanlar gerekli (büyük veri seti, mini-toplu)<br>'
+ '&#8226; Rastgele başlangıç ile sıfırdan eğitim'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> scipy.optimize <span class="kw">import</span> minimize\n<span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># PyTorch\'ta L-BFGS (kucuk modeller / ince ayar icin)</span>\noptimizer = torch.optim.<span class="fn">LBFGS</span>(\n    model.<span class="fn">parameters</span>(),\n    lr=<span class="num">1.0</span>,\n    max_iter=<span class="num">20</span>,\n    history_size=<span class="num">10</span>\n)\n\n<span class="kw">def</span> <span class="fn">closure</span>():\n    optimizer.<span class="fn">zero_grad</span>()\n    output = <span class="fn">model</span>(X_train)\n    loss = <span class="fn">criterion</span>(output, y_train)\n    loss.<span class="fn">backward</span>()\n    <span class="kw">return</span> loss\n\n<span class="cm"># L-BFGS kaybi yeniden hesaplayan bir closure gerektirir</span>\n<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">100</span>):\n    loss = optimizer.<span class="fn">step</span>(closure)\n    <span class="fn">print</span>(<span class="str">f"Epoch {epoch}: kayip = {loss.item():.6f}"</span>)\n\n<span class="cm"># Klasik ML icin SciPy L-BFGS-B</span>\n<span class="kw">def</span> <span class="fn">objective</span>(w):\n    <span class="cm"># lojistik regresyon kaybi + gradyan</span>\n    z = X @ w\n    loss = np.<span class="fn">mean</span>(np.<span class="fn">log</span>(<span class="num">1</span> + np.<span class="fn">exp</span>(-y * z)))\n    grad = -X.T @ (y / (<span class="num">1</span> + np.<span class="fn">exp</span>(y * z))) / <span class="fn">len</span>(y)\n    <span class="kw">return</span> loss, grad\n\nsonuc = <span class="fn">minimize</span>(objective, x0=np.<span class="fn">zeros</span>(d), method=<span class="str">"L-BFGS-B"</span>, jac=<span class="num">True</span>)</code></pre></div>'

+ '<div class="l-note"><strong>Derin öğrenmede Hessian:</strong> Tam Hessian\'ı depolayamasak da, otomatik türev kullanarak Hessian-vektör çarpımlarını verimli bir şekilde hesaplayabiliriz ($Hv$ 1 gradyan hesaplamasıyla aynı maliyettedir). Bu, sinir ağı Hessian\'larının çok az sayıda büyük özdeğere sahip olduğunu ortaya koyan kayıp manzarası spektral analizini mümkün kılar &mdash; çoğu eğrilik küçük bir alt uzayda yoğunlaşmıştır. Bu, birinci derece yöntemlerin neden bu kadar iyi çalıştığını kısmen açıklar.</div>'

/* ── 9. Pratikte Optimizasyon ── */
+ '<h2 class="l-title">9. Pratikte Optimizasyon</h2>'

+ '<p class="l-text">Optimizasyon teorisi ile modern NLP modelleri eğitmede işlerin pratikte yürümesi arasında önemli bir fark vardır. Bu bölüm, transformer eğitmek için vazgeçilmez olan pratik teknikleri kapsar: toplu boyut etkileri, gradyan birikimi, karışık hassasiyet, gradyan kırpma ve dağıtık eğitim. Bunlar teorik incelikler değildir &mdash; eğitim çalışmanızın başarılı olup olmayacağını belirlerler.</p>'

+ '<div class="calc-highlight"><strong>Pratisyenin altın kuralı:</strong> AdamW, warmup + kosinüs programı, 1.0\'da gradyan kırpma ve 0.01 ağırlık azalması ile başla. Bu konfigürasyon transformer eğitim senaryolarının büyük çoğunluğu için çalışır. Özel bir nedeniniz yoksa sapmayın.</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Toplu Boyut</div><div class="card-body">Daha büyük toplular = daha düşük gradyan varyansı ama daha az örtük regularizasyon. Doğrusal ölçekleme kuralı: topluyu $k$ ile çarptığınızda LR\'yi $k$ ile çarpın. Dağıtık eğitim için kritik.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradyan Birikimi</div><div class="card-body">Küçük GPU\'larda büyük topluları simüle et. Güncellemeden önce $k$ mini-toplu üzerinde gradyanları biriktir. Etkin toplu = $k \\times$ mini-toplu boyutu. LLM ince ayarı için vazgeçilmez.</div></div>'
+ '<div class="calc-card"><div class="card-title">Karışık Hassasiyet</div><div class="card-body">İleri/geri için FP16/BF16, optimizer durumları için FP32. Belleği yarılar, iş hacmini ikiye katlar. BF16 tercih edilir (daha geniş aralık, kayıp ölçekleme gerekmiyor). Modern eğitim için standart.</div></div>'
+ '<div class="calc-card"><div class="card-title">Gradyan Kırpma</div><div class="card-body">$g \\leftarrow g \\cdot \\min(1, c/\\|g\\|)$. Patlayan gradyanları önler. Transformer\'lar için maks norm 1.0 standarttır. Kararlılık için zorunlu, özellikle eğitimin başında.</div></div>'
+ '<div class="calc-card"><div class="card-title">Veri Paralel</div><div class="card-body">Topluyu GPU\'lar arasında böl, her biri gradyan hesaplar, sonra senkronize etmek için all-reduce. PyTorch DDP bunu otomatik yönetir. 8-64 GPU\'ya kadar yaklaşık doğrusal ölçekleme.</div></div>'
+ '<div class="calc-card"><div class="card-title">FSDP / ZeRO</div><div class="card-body">Model parametrelerini, gradyanlarını ve optimizer durumlarını GPU\'lar arasında paylaştır. Tek GPU\'ya sığmayan modelleri eğitmeyi mümkün kılar. ZeRO Aşama 3 = FSDP = tam paylaştırma.</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">İleri</div><div class="flow-desc">FP16/BF16</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Kayıp</div><div class="flow-desc">FP32</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Geri</div><div class="flow-desc">FP16/BF16</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Grad Kırp</div><div class="flow-desc">maks norm 1.0</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Güncelle</div><div class="flow-desc">FP32</div></div>'
+ '</div>'

/* Plotly: Batch size (TR) */
+ '<div id="plot-batch-convergence-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var steps=[];var loss_b16=[];var loss_b128=[];var loss_b512=[];'
+ 'for(var i=0;i<100;i++){steps.push(i);'
+ 'var noise16=(Math.random()-0.5)*0.4;var noise128=(Math.random()-0.5)*0.15;var noise512=(Math.random()-0.5)*0.06;'
+ 'loss_b16.push(3*Math.exp(-0.05*i)+0.3+noise16);'
+ 'loss_b128.push(3*Math.exp(-0.04*i)+0.25+noise128);'
+ 'loss_b512.push(3*Math.exp(-0.035*i)+0.22+noise512);}'
+ 'var t1={x:steps,y:loss_b16,mode:"lines",name:"Toplu=16 (gürültülü, erken hızlı)",line:{color:"#e74c3c",width:2}};'
+ 'var t2={x:steps,y:loss_b128,mode:"lines",name:"Toplu=128 (dengeli)",line:{color:"#4ecdc4",width:2}};'
+ 'var t3={x:steps,y:loss_b512,mode:"lines",name:"Toplu=512 (pürüzsüz, yavaş)",line:{color:"#c8a96e",width:2}};'
+ 'var layout={title:{text:"Toplu Boyutun Eğitim Kaybına Etkisi",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Eğitim Adımı"},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Kayıp"},margin:{t:50,r:30,b:50,l:50},legend:{x:0.4,y:0.98,bgcolor:"rgba(0,0,0,0.3)"}};'
+ 'Plotly.newPlot("plot-batch-convergence-tr",[t1,t2,t3],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'
+ '<div class="calc-graph"><div class="graph-caption"><strong>Toplu boyut ödünleşimi:</strong> Küçük toplular (16) gürültülü ama hızlı hareket eden kayıp eğrileriyle daha iyi genelleme sağlar. Büyük toplular (512) daha pürüzsüz ama daha keskin minimumlara yakınsayabilir. Orta toplular (128) gürültü ve kararlılık arasında denge kurar.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler\n\n<span class="cm"># Karisik hassasiyet + gradyan birikimi</span>\nscaler = <span class="fn">GradScaler</span>()\nbirikm_adim = <span class="num">4</span>  <span class="cm"># etkin toplu = 4 x mini_toplu</span>\n\noptimizer.<span class="fn">zero_grad</span>()\n<span class="kw">for</span> i, batch <span class="kw">in</span> <span class="fn">enumerate</span>(dataloader):\n    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):  <span class="cm"># FP16/BF16 ileri</span>\n        loss = model(batch) / birikm_adim  <span class="cm"># kaybi olcekle</span>\n    \n    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()  <span class="cm"># gradyanlari biriktir</span>\n    \n    <span class="kw">if</span> (i + <span class="num">1</span>) % birikm_adim == <span class="num">0</span>:\n        scaler.<span class="fn">unscale_</span>(optimizer)\n        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(\n            model.<span class="fn">parameters</span>(), max_norm=<span class="num">1.0</span>\n        )\n        scaler.<span class="fn">step</span>(optimizer)\n        scaler.<span class="fn">update</span>()\n        optimizer.<span class="fn">zero_grad</span>()\n        scheduler.<span class="fn">step</span>()\n\n<span class="cm"># DDP ile dagitik egitim</span>\n<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP\n\nmodel = DDP(model, device_ids=[local_rank])\n<span class="cm"># Egitim dongusu ayni — DDP gradyan senkronizasyonunu yonetir</span></code></pre></div>'

+ '<div class="calc-example"><div class="example-label">TİPİK EĞİTİM KONFİGÜRASYONLARI</div><div class="example-body">'
+ '<strong>BERT İnce Ayar:</strong> AdamW, LR=2e-5, adımların %10\'u warmup, ağırlık azalması 0.01, toplu 32, 3 epoch, gradyan kırpma 1.0<br><br>'
+ '<strong>GPT Ön-Eğitim:</strong> AdamW, LR=6e-4, 2000 adım warmup, LR/10\'a kosinüs azalma, ağırlık azalması 0.1, toplu 512 (birikimle), ~300B token<br><br>'
+ '<strong>LoRA İnce Ayar:</strong> AdamW, LR=2e-4, sabit LR veya kosinüs, LoRA parametrelerinde ağırlık azalması yok, toplu 4 + birikim 8, 1-3 epoch<br><br>'
+ '<strong>Görüntü Modeli (ResNet):</strong> SGD + momentum 0.9, LR=0.1, 30/60/90 epoch\'larda adım azalması /10, ağırlık azalması 5e-4, toplu 256'
+ '</div></div>'

+ '<div class="l-warn"><strong>Yaygın optimizasyon hataları ve çözümleri:</strong> (1) Kayıp NaN/Inf &rarr; LR\'yi azalt, gradyan kırpma ekle, sıfıra bölmeyi kontrol et. (2) Kayıp platoları &rarr; warmup, farklı program veya daha büyük toplu dene. (3) Doğrulama kaybı erken ıraksıyor &rarr; ağırlık azalmasını artır, dropout ekle, model boyutunu küçült. (4) Eğitim çok yavaş &rarr; karışık hassasiyet, gradyan birikimi kullan, toplu boyutu artır.</div>'

/* ── 10. Özet ve Sonraki Adımlar ── */
+ '<h2 class="l-title">10. Özet ve Sonraki Adımlar</h2>'

+ '<p class="l-text">Artık makine öğrenmesi için optimizasyon teorisini matematiksel temellerden pratik eğitim tariflerine kadar tam olarak anlıyorsunuz. İşte optimizasyon araç kutunuz:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Gradyan İnişi</div><div class="card-body">$\\theta -= \\eta \\nabla \\mathcal{L}$. Temel. Toplu, stokastik ve mini-toplu varyantlar. Yakınsama pürüzsüzlük ve konveksliğe bağlıdır.</div><div class="card-formula">O(1/T) konveks, O(1/T^2) güçlü konveks</div></div>'
+ '<div class="calc-card"><div class="card-title">AdamW</div><div class="card-body">Momentum + uyarlanabilir oranlar + ayrıştırılmış ağırlık azalması. Transformer\'lar ve LLM\'ler için standart optimizer. Varsayılan: $\\beta_1$=0.9, $\\beta_2$=0.999.</div><div class="card-formula">Pratisyenin varsayılan seçimi</div></div>'
+ '<div class="calc-card"><div class="card-title">Kosinüs Programı</div><div class="card-body">Warmup + kosinüs tavlama. Nazik geçişlerle pürüzsüz azalma. Modern NLP ön-eğitimi ve ince ayarı için baskın LR programı.</div><div class="card-formula">Kararlılık için doğrusal warmup ile</div></div>'
+ '<div class="calc-card"><div class="card-title">Regularizasyon</div><div class="card-body">Seyreklik için L1, pürüzsüzlük için L2/ağırlık azalması, topluluk oluşturma için dropout. Daha basit çözümleri tercih etmek için optimizasyon manzarasını değiştir.</div><div class="card-formula">Bayesian yorumu: parametreler üzerinde önceler</div></div>'
+ '<div class="calc-card"><div class="card-title">Kısıtlı Opt</div><div class="card-body">Lagrange çarpanları + KKT koşulları. SVM\'leri, maksimum entropi modellerini ve çekirdek hileli ikili formülasyonları mümkün kılar.</div><div class="card-formula">Klasik ML teorisinin temeli</div></div>'
+ '<div class="calc-card"><div class="card-title">Pratik Eğitim</div><div class="card-body">Karışık hassasiyet (BF16), gradyan birikimi, kırpma, DDP/FSDP. Ölçekte eğitimi mümkün kılan mühendislik.</div><div class="card-formula">Teori mühendislikle buluşuyor</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Konvekslik</div><div class="flow-desc">Teori temeli</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Gradyan Yöntemleri</div><div class="flow-desc">SGD, Adam, AdamW</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">LR Programı</div><div class="flow-desc">Warmup + kosinüs</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Regularizasyon</div><div class="flow-desc">L1, L2, dropout</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Ölçekte</div><div class="flow-desc">Karışık hass, DDP</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Sonraki Ders:</strong> Ders 6\'da <strong>ML için İstatistik</strong>\'e geçiyoruz &mdash; olasılık dağılımları, maksimum olabilirlik tahmini, Bayesian çıkarım ve hipotez testi. Optimizasyonun (bu ders) ve olasılık teorisinin nasıl birleştiğini göreceksiniz: MLE sadece negatif log-olabilirliğin minimizasyonudur ve MAP tahmini, Bayesian öncesinden gelen bir regularizasyon terimi ile MLE\'dir.</div>'

};
