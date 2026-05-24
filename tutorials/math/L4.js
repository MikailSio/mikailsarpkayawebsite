var MATH_L4 = {

en: '<p class="l-text"><strong>Information theory is the mathematical foundation of everything from data compression to deep learning loss functions.</strong> Claude Shannon invented this field in 1948 by asking a deceptively simple question: "How do we measure information?" The answer revolutionized communication, statistics, and ultimately machine learning. Every time you train a neural network with cross-entropy loss, you are using information theory.</p>'

+ '<p class="l-text">This lesson takes you from the basic intuition of "surprise" through entropy, cross-entropy, KL divergence, and mutual information &mdash; all the way to how these concepts drive modern NLP and language modeling. Every formula is derived from first principles with concrete examples.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU’LL LEARN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Define self-information I(x) = -log p(x) and connect it to surprise</li>'
+ '<li>Compute Shannon entropy H(X) for discrete distributions in bits and nats</li>'
+ '<li>Derive cross-entropy loss from log-likelihood for a softmax classifier</li>'
+ '<li>Compute KL divergence D(p||q) and explain why it is not symmetric</li>'
+ '<li>Use mutual information to score feature relevance in a tabular dataset</li>'
+ '<li>Read perplexity and compare two language models on the same test set</li>'
+ '</ul>'
+ '</div>'

/* ============================================================
   SECTION 1: What is Information?
   ============================================================ */
+ '<h2 class="l-title">1. What is Information?</h2>'

+ '<div class="calc-highlight"><strong>Shannon\'s key insight:</strong> Information is <em>surprise</em>. An event that you already expected carries no information. An event that shocks you carries a lot. The rarer an event, the more informative it is when it happens.</div>'

+ '<p class="l-text">Think about weather forecasts. If someone tells you "it\'s sunny" in the Sahara desert, you learn almost nothing &mdash; it\'s always sunny there. But if someone tells you "it\'s snowing in the Sahara," that\'s genuinely surprising and informative. Shannon formalized this intuition mathematically.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Surprise</div><div class="card-body">Information = surprise. Low probability events carry high information. High probability events carry low information.</div></div>'
+ '<div class="calc-card"><div class="card-title">Probability</div><div class="card-body">If P(event) is close to 1, learning it happened tells you almost nothing. If P(event) is near 0, it tells you a lot.</div></div>'
+ '<div class="calc-card"><div class="card-title">Additivity</div><div class="card-body">Two independent events together should have information equal to the sum of their individual information. This forces the log form.</div></div>'
+ '<div class="calc-card"><div class="card-title">Certainty = Zero Info</div><div class="card-body">An event with P=1 carries zero information. You already knew it would happen. No surprise at all.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Three axioms</strong> that pin down the formula for information:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Monotonicity</div><div class="step-detail">Less probable events carry more information: if $P(a) < P(b)$, then $I(a) > I(b)$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Additivity</div><div class="step-detail">For independent events: $I(a \\cap b) = I(a) + I(b)$. Information from two independent events adds up.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Continuity</div><div class="step-detail">A small change in probability causes a small change in information. No discontinuous jumps.</div></div></div>'
+ '</div>'

+ '<div class="l-note"><strong>Why this matters for ML:</strong> These axioms uniquely determine that the information function must be a logarithm of the inverse probability. There is no other function that satisfies all three. This is not an arbitrary choice &mdash; it is the <em>only</em> mathematically consistent way to measure information.</div>'

/* ============================================================
   SECTION 2: Self-Information
   ============================================================ */
+ '<h2 class="l-title">2. Self-Information</h2>'

+ '<p class="l-text">Given the three axioms, the unique function that measures the information content of a single event is:</p>'

+ '<div class="calc-formula"><div class="formula-label">SELF-INFORMATION</div><div class="formula-main">$$I(x) = -\\log P(x) = \\log \\frac{1}{P(x)}$$</div><div class="formula-sub">The information gained (or surprise experienced) when event $x$ with probability $P(x)$ occurs.</div></div>'

+ '<p class="l-text">The <strong>base of the logarithm</strong> determines the unit of measurement:</p>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Base 2 (Bits)</div>'
+ '<div class="compare-item">&#8226; $I(x) = -\\log_2 P(x)$</div>'
+ '<div class="compare-item">&#8226; Unit: <strong>bits</strong> (binary digits)</div>'
+ '<div class="compare-item">&#8226; Used in CS, compression, coding theory</div>'
+ '<div class="compare-item">&#8226; A fair coin flip = 1 bit of information</div></div>'
+ '<div class="compare-col"><div class="compare-title">Base e (Nats)</div>'
+ '<div class="compare-item">&#8226; $I(x) = -\\ln P(x)$</div>'
+ '<div class="compare-item">&#8226; Unit: <strong>nats</strong> (natural units)</div>'
+ '<div class="compare-item">&#8226; Used in ML, statistics, deep learning</div>'
+ '<div class="compare-item">&#8226; More convenient for calculus/optimization</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">CONCRETE EXAMPLES</div><div class="example-body">'
+ '<strong>Fair coin (heads):</strong> $I = -\\log_2(0.5) = 1$ bit<br>'
+ '<strong>Fair die (rolling a 6):</strong> $I = -\\log_2(1/6) = 2.585$ bits<br>'
+ '<strong>Certain event (P=1):</strong> $I = -\\log_2(1) = 0$ bits &mdash; no surprise!<br>'
+ '<strong>Rare event (P=0.01):</strong> $I = -\\log_2(0.01) = 6.644$ bits &mdash; very surprising!<br>'
+ '<strong>Conversion:</strong> 1 nat = $1/\\ln 2 \\approx 1.443$ bits'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">self_information</span>(p, base=<span class="num">2</span>):\n    <span class="str">"""Self-information in bits (base=2) or nats (base=e)."""</span>\n    <span class="kw">if</span> base == <span class="num">2</span>:\n        <span class="kw">return</span> -np.<span class="fn">log2</span>(p)\n    <span class="kw">else</span>:\n        <span class="kw">return</span> -np.<span class="fn">log</span>(p)  <span class="cm"># natural log</span>\n\n<span class="cm"># Examples</span>\n<span class="fn">print</span>(<span class="str">"Fair coin:"</span>, <span class="fn">self_information</span>(<span class="num">0.5</span>))     <span class="cm"># 1.0 bit</span>\n<span class="fn">print</span>(<span class="str">"Die roll 6:"</span>, <span class="fn">self_information</span>(<span class="num">1/6</span>))   <span class="cm"># 2.585 bits</span>\n<span class="fn">print</span>(<span class="str">"Certain:"</span>, <span class="fn">self_information</span>(<span class="num">1.0</span>))      <span class="cm"># 0.0 bits</span>\n<span class="fn">print</span>(<span class="str">"Rare:"</span>, <span class="fn">self_information</span>(<span class="num">0.01</span>))       <span class="cm"># 6.644 bits</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does the negative sign appear in $I(x) = -\\log P(x)$? Since $0 \\le P(x) \\le 1$, the logarithm is always negative or zero. The negative sign makes information non-negative. More surprising events (lower $P$) give larger positive values.</div></div>'

/* ============================================================
   SECTION 3: Entropy
   ============================================================ */
+ '<h2 class="l-title">3. Entropy</h2>'

+ '<p class="l-text">Self-information measures surprise for a <em>single</em> event. But what if we want to characterize an entire probability distribution? How "surprising" is a random variable <em>on average</em>? That\'s <strong>entropy</strong>.</p>'

+ '<div class="calc-formula"><div class="formula-label">SHANNON ENTROPY</div><div class="formula-main">$$H(X) = -\\sum_{x} P(x) \\log P(x) = \\mathbb{E}[I(X)]$$</div><div class="formula-sub">The expected (average) self-information over all possible outcomes of random variable $X$.</div></div>'

+ '<div class="calc-highlight"><strong>Entropy = average surprise.</strong> It measures the inherent uncertainty or unpredictability in a probability distribution. High entropy means the distribution is spread out (hard to predict). Low entropy means it is concentrated (easy to predict).</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Minimum Entropy</div><div class="card-body">One outcome has P=1, all others P=0. No uncertainty at all &mdash; you know exactly what will happen. Deterministic.</div></div>'
+ '<div class="calc-card"><div class="card-title">Maximum Entropy</div><div class="card-body">Uniform distribution: all outcomes equally likely. Maximum uncertainty &mdash; every outcome is equally surprising. $H = \\log n$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Fair Coin</div><div class="card-body">$H = -0.5\\log_2(0.5) - 0.5\\log_2(0.5) = 1$ bit. One bit of entropy is the uncertainty of a fair coin flip.</div></div>'
+ '<div class="calc-card"><div class="card-title">Language Entropy</div><div class="card-body">English text has ~1.0&ndash;1.5 bits/character of entropy. Highly predictable! Much less than the theoretical max of ~4.7 bits.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">COMPUTING ENTROPY BY HAND</div><div class="example-body">'
+ '<strong>Biased coin (P(H)=0.8, P(T)=0.2):</strong><br>'
+ '$H = -0.8 \\log_2(0.8) - 0.2 \\log_2(0.2)$<br>'
+ '$H = -0.8(-0.322) - 0.2(-2.322) = 0.258 + 0.464 = 0.722$ bits<br><br>'
+ '<strong>Fair coin (P(H)=0.5, P(T)=0.5):</strong><br>'
+ '$H = -0.5(-1) - 0.5(-1) = 1.0$ bit<br><br>'
+ 'The biased coin has <em>less</em> entropy (0.722 < 1.0) because it is more predictable.'
+ '</div></div>'

/* Plotly: Entropy vs probability for binary random variable */
+ '<div id="plot-entropy-binary" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var p=[];var h=[];for(var i=1;i<=99;i++){var pi=i/100;p.push(pi);h.push(-pi*Math.log2(pi)-(1-pi)*Math.log2(1-pi));}'
+ 'var t1={x:p,y:h,mode:"lines",name:"H(p)",line:{color:"#c8a96e",width:3}};'
+ 'var ann1={x:0.5,y:1.0,xref:"x",yref:"y",text:"Max entropy = 1 bit",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#c8a96e",size:11}};'
+ 'var ann2={x:0.8,y:0.722,xref:"x",yref:"y",text:"Biased (0.8) = 0.72 bits",showarrow:true,arrowhead:2,ax:50,ay:-30,font:{color:"#4ecdc4",size:10}};'
+ 'var layout={title:{text:"Binary Entropy: H(p) = -p log p - (1-p) log(1-p)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X=1)",range:[0,1]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Entropy (bits)",range:[0,1.1]},margin:{t:50,r:30,b:50,l:50},annotations:[ann1,ann2],showlegend:false};'
+ 'Plotly.newPlot("plot-entropy-binary",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>Binary entropy function:</strong> Entropy is maximized at p=0.5 (fair coin, maximum uncertainty) and minimized at p=0 or p=1 (certain outcome, no uncertainty). The curve is symmetric and concave.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">entropy</span>(probs, base=<span class="num">2</span>):\n    <span class="str">"""Shannon entropy of a discrete distribution."""</span>\n    probs = np.<span class="fn">array</span>(probs)\n    probs = probs[probs > <span class="num">0</span>]  <span class="cm"># 0*log(0) = 0 by convention</span>\n    <span class="kw">if</span> base == <span class="num">2</span>:\n        <span class="kw">return</span> -np.<span class="fn">sum</span>(probs * np.<span class="fn">log2</span>(probs))\n    <span class="kw">return</span> -np.<span class="fn">sum</span>(probs * np.<span class="fn">log</span>(probs))\n\n<span class="cm"># Fair coin: maximum binary entropy</span>\n<span class="fn">print</span>(<span class="str">"Fair coin:"</span>, <span class="fn">entropy</span>([<span class="num">0.5</span>, <span class="num">0.5</span>]))     <span class="cm"># 1.0</span>\n<span class="cm"># Biased coin</span>\n<span class="fn">print</span>(<span class="str">"Biased:"</span>, <span class="fn">entropy</span>([<span class="num">0.8</span>, <span class="num">0.2</span>]))       <span class="cm"># 0.722</span>\n<span class="cm"># Fair 6-sided die</span>\n<span class="fn">print</span>(<span class="str">"Fair die:"</span>, <span class="fn">entropy</span>([<span class="num">1/6</span>]*<span class="num">6</span>))        <span class="cm"># 2.585</span>\n<span class="cm"># Deterministic</span>\n<span class="fn">print</span>(<span class="str">"Certain:"</span>, <span class="fn">entropy</span>([<span class="num">1.0</span>, <span class="num">0.0</span>]))      <span class="cm"># 0.0</span></code></pre></div>'

+ '<div class="l-note"><strong>Maximum Entropy Principle:</strong> When you have no additional information, the maximum entropy distribution is the best guess. For a bounded continuous variable with known mean and variance, maximum entropy gives the Gaussian distribution. This is one deep reason why the normal distribution appears everywhere in nature and statistics.</div>'

/* ============================================================
   SECTION 4: Cross-Entropy
   ============================================================ */
+ '<h2 class="l-title">4. Cross-Entropy</h2>'

+ '<p class="l-text">Entropy measures uncertainty using the <em>true</em> distribution. But what if we use a <em>different</em> distribution $q$ to encode events that actually follow distribution $p$? We get <strong>cross-entropy</strong> &mdash; and it always costs more bits than using the true distribution.</p>'

+ '<div class="calc-formula"><div class="formula-label">CROSS-ENTROPY</div><div class="formula-main">$$H(p, q) = -\\sum_{x} p(x) \\log q(x)$$</div><div class="formula-sub">Average number of bits needed to encode events from $p$ when using a code optimized for $q$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">True Distribution</div><div class="card-body">The actual distribution that generates the data. This is what nature provides &mdash; we sample from $p$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Predicted Distribution</div><div class="card-body">Our model\'s estimate. If $q = p$, we achieve optimal coding. Otherwise, we waste bits.</div></div>'
+ '<div class="calc-card"><div class="card-title">Always &ge; H(p)</div><div class="card-body">$H(p, q) \\ge H(p)$ always. Cross-entropy equals entropy only when $q = p$. The gap is KL divergence.</div></div>'
+ '<div class="calc-card"><div class="card-title">Loss Function</div><div class="card-body">In classification: $p$ = one-hot true label, $q$ = model softmax output. Minimizing cross-entropy = making $q$ match $p$.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">CROSS-ENTROPY EXAMPLE</div><div class="example-body">'
+ '<strong>True distribution:</strong> $p = [0.8, 0.1, 0.1]$ (three classes)<br>'
+ '<strong>Model prediction:</strong> $q = [0.6, 0.2, 0.2]$<br><br>'
+ '$H(p, q) = -[0.8 \\log_2(0.6) + 0.1 \\log_2(0.2) + 0.1 \\log_2(0.2)]$<br>'
+ '$= -[0.8(-0.737) + 0.1(-2.322) + 0.1(-2.322)]$<br>'
+ '$= 0.590 + 0.232 + 0.232 = 1.054$ bits<br><br>'
+ '<strong>Compare with entropy:</strong> $H(p) = 0.922$ bits. The extra 0.132 bits is the "penalty" for using $q$ instead of $p$.'
+ '</div></div>'

+ '<div class="calc-formula"><div class="formula-label">KEY RELATIONSHIP</div><div class="formula-main">$$H(p, q) = H(p) + D_{KL}(p \\| q)$$</div><div class="formula-sub">Cross-entropy = entropy + KL divergence. The "extra cost" of using $q$ instead of $p$ is exactly the KL divergence.</div></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">In classification with one-hot labels ($p = [0, ..., 1, ..., 0]$), the entropy $H(p) = 0$ (no uncertainty in the label). So cross-entropy loss $= D_{KL}(p \\| q)$ directly. Minimizing cross-entropy loss IS minimizing KL divergence in this case!</div></div>'

/* ============================================================
   SECTION 5: KL Divergence
   ============================================================ */
+ '<h2 class="l-title">5. KL Divergence</h2>'

+ '<p class="l-text"><strong>Kullback-Leibler divergence</strong> measures how much one probability distribution differs from another. It quantifies the "information lost" when using $q$ to approximate $p$.</p>'

+ '<div class="calc-formula"><div class="formula-label">KL DIVERGENCE</div><div class="formula-main">$$D_{KL}(p \\| q) = \\sum_{x} p(x) \\log \\frac{p(x)}{q(x)} = H(p, q) - H(p)$$</div><div class="formula-sub">The extra bits needed to encode data from $p$ using a code optimized for $q$, beyond the minimum bits $H(p)$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Non-Negative</div><div class="card-body">$D_{KL}(p \\| q) \\ge 0$ always (Gibbs\' inequality). Equals zero if and only if $p = q$. "No divergence" means identical distributions.</div></div>'
+ '<div class="calc-card"><div class="card-title">Asymmetric</div><div class="card-body">$D_{KL}(p \\| q) \\ne D_{KL}(q \\| p)$ in general. It is NOT a true distance metric! The direction matters a lot.</div></div>'
+ '<div class="calc-card"><div class="card-title">Forward KL</div><div class="card-body">$D_{KL}(p \\| q)$: penalizes $q$ heavily where $p > 0$ but $q \\approx 0$. Produces "mean-seeking" approximations. Used in MLE/cross-entropy.</div></div>'
+ '<div class="calc-card"><div class="card-title">Reverse KL</div><div class="card-body">$D_{KL}(q \\| p)$: penalizes where $q > 0$ but $p \\approx 0$. Produces "mode-seeking" approximations. Used in variational inference (VAEs).</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Forward KL: $D_{KL}(p \\| q)$</div>'
+ '<div class="compare-item">&#8226; Used in supervised learning (cross-entropy loss)</div>'
+ '<div class="compare-item">&#8226; Forces $q$ to cover all modes of $p$</div>'
+ '<div class="compare-item">&#8226; "Mean-seeking": $q$ tries to average over $p$</div>'
+ '<div class="compare-item">&#8226; Can produce blurry outputs</div></div>'
+ '<div class="compare-col"><div class="compare-title">Reverse KL: $D_{KL}(q \\| p)$</div>'
+ '<div class="compare-item">&#8226; Used in variational inference (VAE, ELBO)</div>'
+ '<div class="compare-item">&#8226; Forces $q$ to avoid regions where $p \\approx 0$</div>'
+ '<div class="compare-item">&#8226; "Mode-seeking": $q$ locks onto one mode of $p$</div>'
+ '<div class="compare-item">&#8226; Can produce sharp but incomplete outputs</div></div>'
+ '</div>'

/* Plotly: KL divergence visualization */
+ '<div id="plot-kl-divergence" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var q_vals=[];var kl_fwd=[];var kl_rev=[];'
+ 'var p1=0.7;var p2=0.3;'
+ 'for(var i=1;i<=99;i++){var qi=i/100;var q2i=1-qi;'
+ 'q_vals.push(qi);'
+ 'kl_fwd.push(p1*Math.log2(p1/qi)+p2*Math.log2(p2/q2i));'
+ 'kl_rev.push(qi*Math.log2(qi/p1)+q2i*Math.log2(q2i/p2));}'
+ 'var t1={x:q_vals,y:kl_fwd,mode:"lines",name:"D_KL(p||q) Forward",line:{color:"#c8a96e",width:3}};'
+ 'var t2={x:q_vals,y:kl_rev,mode:"lines",name:"D_KL(q||p) Reverse",line:{color:"#4ecdc4",width:3}};'
+ 'var ann={x:0.7,y:0,xref:"x",yref:"y",text:"p = [0.7, 0.3]",showarrow:true,arrowhead:2,ax:0,ay:-35,font:{color:"#f87171",size:11}};'
+ 'var layout={title:{text:"KL Divergence: Forward vs Reverse (p = [0.7, 0.3])",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"q\u2081 (probability of class 1 under q)",range:[0.01,0.99]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"KL Divergence (bits)",range:[0,4]},margin:{t:50,r:30,b:50,l:50},annotations:[ann],showlegend:true,legend:{font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-kl-divergence",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>KL divergence asymmetry:</strong> Both curves reach zero at $q = p = [0.7, 0.3]$, but their shapes differ. Forward KL (gold) blows up when $q_1 \\to 0$ (model assigns zero probability to events that actually occur). Reverse KL (teal) blows up when $q_1 \\to 1$ (model is confident about events that rarely occur).</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">kl_divergence</span>(p, q):\n    <span class="str">"""KL divergence D_KL(p || q) in nats."""</span>\n    p, q = np.<span class="fn">array</span>(p), np.<span class="fn">array</span>(q)\n    <span class="cm"># Only sum where p > 0 (0*log(0/q) = 0)</span>\n    mask = p > <span class="num">0</span>\n    <span class="kw">return</span> np.<span class="fn">sum</span>(p[mask] * np.<span class="fn">log</span>(p[mask] / q[mask]))\n\np = [<span class="num">0.7</span>, <span class="num">0.3</span>]\nq = [<span class="num">0.5</span>, <span class="num">0.5</span>]\n\n<span class="fn">print</span>(<span class="str">"D_KL(p||q) ="</span>, <span class="fn">kl_divergence</span>(p, q))  <span class="cm"># 0.0871 nats</span>\n<span class="fn">print</span>(<span class="str">"D_KL(q||p) ="</span>, <span class="fn">kl_divergence</span>(q, p))  <span class="cm"># 0.0953 nats</span>\n<span class="fn">print</span>(<span class="str">"Not equal! KL is asymmetric."</span>)</code></pre></div>'

+ '<div class="l-note"><strong>Warning:</strong> KL divergence is undefined when $q(x) = 0$ but $p(x) > 0$. This means your model must never assign zero probability to events that can actually happen. In practice, this is why we add small epsilon values or use label smoothing in classification.</div>'

/* ============================================================
   SECTION 6: Cross-Entropy Loss
   ============================================================ */
+ '<h2 class="l-title">6. Cross-Entropy Loss</h2>'

+ '<p class="l-text">Cross-entropy is not just an abstract concept &mdash; it is <strong>THE</strong> standard loss function for classification in deep learning. Here\'s why it dominates over alternatives like MSE for classification tasks.</p>'

+ '<div class="calc-formula"><div class="formula-label">BINARY CROSS-ENTROPY LOSS</div><div class="formula-main">$$\\mathcal{L} = -\\frac{1}{N}\\sum_{i=1}^{N}\\left[y_i \\log(\\hat{y}_i) + (1-y_i)\\log(1-\\hat{y}_i)\\right]$$</div><div class="formula-sub">$y_i \\in \\{0,1\\}$ is the true label, $\\hat{y}_i$ is the predicted probability. Averaged over $N$ samples.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">CATEGORICAL CROSS-ENTROPY LOSS</div><div class="formula-main">$$\\mathcal{L} = -\\frac{1}{N}\\sum_{i=1}^{N}\\sum_{c=1}^{C} y_{i,c} \\log(\\hat{y}_{i,c})$$</div><div class="formula-sub">$C$ classes, $y_{i,c}$ is 1 for the true class and 0 otherwise (one-hot), $\\hat{y}_{i,c}$ is the softmax output.</div></div>'

+ '<div class="calc-highlight"><strong>Connection to Maximum Likelihood:</strong> Minimizing cross-entropy loss is mathematically <em>identical</em> to maximizing the log-likelihood of the data under your model. They are the same optimization! MLE says "find the parameters that make the data most probable." Cross-entropy says "find the parameters whose predicted distribution is closest to the true distribution." Same thing, different perspectives.</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Write the Likelihood</div><div class="step-detail">$\\mathcal{L}_{\\text{likelihood}} = \\prod_i \\hat{y}_i^{y_i} (1-\\hat{y}_i)^{(1-y_i)}$ for binary classification.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Take the Log</div><div class="step-detail">$\\log \\mathcal{L} = \\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]$</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Negate to Get a Loss</div><div class="step-detail">$-\\log \\mathcal{L} = -\\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]$ = cross-entropy loss!</div></div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Cross-Entropy (Classification)</div>'
+ '<div class="compare-item">&#8226; Gradient stays strong even when prediction is wrong</div>'
+ '<div class="compare-item">&#8226; Penalizes confident wrong predictions heavily</div>'
+ '<div class="compare-item">&#8226; Natural pairing with softmax/sigmoid outputs</div>'
+ '<div class="compare-item">&#8226; Equivalent to maximum likelihood estimation</div></div>'
+ '<div class="compare-col"><div class="compare-title">MSE (Why NOT for Classification)</div>'
+ '<div class="compare-item">&#8226; Gradient vanishes near 0 and 1 (sigmoid saturation)</div>'
+ '<div class="compare-item">&#8226; Treats probability errors linearly, not logarithmically</div>'
+ '<div class="compare-item">&#8226; No probabilistic interpretation for classification</div>'
+ '<div class="compare-item">&#8226; Slower convergence, can get stuck in plateaus</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="cm"># Binary cross-entropy</span>\nbce = nn.<span class="fn">BCELoss</span>()\ny_true = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])\ny_pred = torch.<span class="fn">tensor</span>([<span class="num">0.9</span>, <span class="num">0.1</span>, <span class="num">0.8</span>])\n<span class="fn">print</span>(<span class="str">"BCE Loss:"</span>, <span class="fn">bce</span>(y_pred, y_true).<span class="fn">item</span>())  <span class="cm"># 0.164</span>\n\n<span class="cm"># Categorical cross-entropy (with logits for numerical stability)</span>\nce = nn.<span class="fn">CrossEntropyLoss</span>()\nlogits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">0.5</span>, <span class="num">-1.0</span>]])  <span class="cm"># raw scores, NOT softmax</span>\nlabels = torch.<span class="fn">tensor</span>([<span class="num">0</span>])                     <span class="cm"># true class index</span>\n<span class="fn">print</span>(<span class="str">"CE Loss:"</span>, <span class="fn">ce</span>(logits, labels).<span class="fn">item</span>())  <span class="cm"># 0.169</span>\n\n<span class="cm"># Why CrossEntropyLoss takes logits, not probabilities:</span>\n<span class="cm"># It internally computes log_softmax + NLLLoss</span>\n<span class="cm"># This avoids numerical issues from log(softmax(x))</span></code></pre></div>'

+ '<div class="l-warn"><strong>PyTorch gotcha:</strong> <code>nn.CrossEntropyLoss</code> expects <em>raw logits</em>, not softmax probabilities. It internally applies log-softmax for numerical stability. If you pass probabilities through softmax first, you will get wrong results. Use <code>nn.BCELoss</code> for pre-sigmoid outputs or <code>nn.BCEWithLogitsLoss</code> for raw logits in binary classification.</div>'

/* ============================================================
   SECTION 7: Mutual Information
   ============================================================ */
+ '<h2 class="l-title">7. Mutual Information</h2>'

+ '<p class="l-text"><strong>Mutual information</strong> measures how much knowing one variable tells you about another. If $X$ and $Y$ are independent, knowing $X$ tells you nothing about $Y$, so $I(X;Y) = 0$. If they are perfectly correlated, knowing $X$ tells you everything about $Y$.</p>'

+ '<div class="calc-formula"><div class="formula-label">MUTUAL INFORMATION</div><div class="formula-main">$$I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)$$</div><div class="formula-sub">The reduction in uncertainty about $X$ after observing $Y$. Also: $I(X;Y) = H(X) + H(Y) - H(X,Y)$.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">MUTUAL INFORMATION (KL FORM)</div><div class="formula-main">$$I(X;Y) = D_{KL}\\left(P(X,Y) \\| P(X)P(Y)\\right)$$</div><div class="formula-sub">MI measures how far the joint distribution is from the product of marginals (independence). Zero iff $X \\perp Y$.</div></div>'

/* SVG Venn Diagram for Mutual Information */
+ '<div class="calc-graph"><div class="graph-title">Information Venn Diagram</div>'
+ '<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">'
+ '<circle cx="220" cy="140" r="110" fill="rgba(200,169,110,0.15)" stroke="#c8a96e" stroke-width="2"/>'
+ '<circle cx="380" cy="140" r="110" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="2"/>'
+ '<text x="155" y="140" fill="#c8a96e" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">H(X|Y)</text>'
+ '<text x="300" y="130" fill="#f87171" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">I(X;Y)</text>'
+ '<text x="300" y="152" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">Mutual</text>'
+ '<text x="300" y="167" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">Information</text>'
+ '<text x="445" y="140" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">H(Y|X)</text>'
+ '<text x="220" y="38" fill="#c8a96e" font-family="monospace" font-size="14" text-anchor="middle">H(X)</text>'
+ '<text x="380" y="38" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">H(Y)</text>'
+ '<text x="300" y="270" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="11" text-anchor="middle">H(X,Y) = H(X|Y) + I(X;Y) + H(Y|X)</text>'
+ '</svg>'
+ '<div class="graph-caption"><strong>Venn diagram of information:</strong> $H(X)$ is the total uncertainty in $X$. Part of it is "shared" with $Y$ (the overlap = mutual information). The rest, $H(X|Y)$, is the uncertainty that remains after observing $Y$. The entire region is the joint entropy $H(X,Y)$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Marginal Entropy</div><div class="card-body">Total uncertainty in $X$ alone, before seeing $Y$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Conditional Entropy</div><div class="card-body">Remaining uncertainty in $X$ after knowing $Y$. Always $\\le H(X)$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mutual Information</div><div class="card-body">The "shared" information between $X$ and $Y$. Symmetric: $I(X;Y) = I(Y;X)$. Always $\\ge 0$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Feature Selection</div><div class="card-body">In ML, features with high $I(X;Y)$ (where $Y$ is the label) are the most informative. MI-based feature selection captures nonlinear relationships that correlation misses.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">MUTUAL INFORMATION FOR FEATURE SELECTION</div><div class="example-body">'
+ '<strong>Problem:</strong> Which feature is more informative about the class label?<br><br>'
+ 'Feature A: $I(A; Y) = 0.45$ bits &mdash; knowing A reduces uncertainty about Y by 0.45 bits<br>'
+ 'Feature B: $I(B; Y) = 0.12$ bits &mdash; knowing B reduces uncertainty about Y by 0.12 bits<br><br>'
+ 'Feature A carries much more information about the label. Select it first!<br>'
+ 'Unlike Pearson correlation, MI captures <em>any</em> statistical dependency, not just linear ones.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_selection <span class="kw">import</span> mutual_info_classif\n<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_classification\n<span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Generate sample data: 5 features, only 2 informative</span>\nX, y = <span class="fn">make_classification</span>(n_samples=<span class="num">1000</span>, n_features=<span class="num">5</span>,\n                           n_informative=<span class="num">2</span>, random_state=<span class="num">42</span>)\n\n<span class="cm"># Estimate mutual information between each feature and label</span>\nmi = <span class="fn">mutual_info_classif</span>(X, y, random_state=<span class="num">42</span>)\n\n<span class="kw">for</span> i, score <span class="kw">in</span> <span class="fn">enumerate</span>(mi):\n    <span class="fn">print</span>(<span class="str">f"Feature {i}: MI = {score:.4f} nats"</span>)\n\n<span class="cm"># Features 0,1 will have high MI (informative)</span>\n<span class="cm"># Features 2,3,4 will have low MI (noise)</span>\n<span class="cm"># Select top-k features by MI score</span>\ntop_k = np.<span class="fn">argsort</span>(mi)[::-<span class="num">1</span>][:<span class="num">2</span>]\n<span class="fn">print</span>(<span class="str">"Selected features:"</span>, top_k)</code></pre></div>'

+ '<div class="l-note"><strong>MI vs Correlation:</strong> Pearson correlation only detects linear relationships. Mutual information detects <em>any</em> statistical dependency. If $Y = X^2$, correlation can be near zero (symmetric parabola), but MI will be high. This makes MI a more powerful (but computationally expensive) feature selection criterion.</div>'

/* ============================================================
   SECTION 8: Perplexity
   ============================================================ */
+ '<h2 class="l-title">8. Perplexity</h2>'

+ '<p class="l-text"><strong>Perplexity</strong> is the standard evaluation metric for language models. It converts the abstract concept of cross-entropy into an interpretable number: the "effective number of choices" the model is uncertain about at each step.</p>'

+ '<div class="calc-formula"><div class="formula-label">PERPLEXITY</div><div class="formula-main">$$\\text{PPL} = 2^{H(p,q)} = 2^{-\\frac{1}{N}\\sum_{i=1}^{N} \\log_2 q(w_i | w_{<i})}$$</div><div class="formula-sub">Exponentiated cross-entropy. For a language model, $q(w_i | w_{< i})$ is the probability assigned to the actual next word $w_i$.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Intuition</div><div class="card-body">Perplexity = "how many words is the model equally confused between at each position?" Lower = better. PPL of 10 means the model is as confused as if choosing uniformly from 10 words.</div></div>'
+ '<div class="calc-card"><div class="card-title">Perfect Model</div><div class="card-body">PPL = 1 means the model always assigns probability 1 to the correct next word. It is never surprised. (Impossible in practice.)</div></div>'
+ '<div class="calc-card"><div class="card-title">Worst Case</div><div class="card-body">PPL = |V| (vocabulary size) means the model assigns uniform probability. No better than random guessing among all words.</div></div>'
+ '<div class="calc-card"><div class="card-title">Modern LMs</div><div class="card-body">GPT-2: PPL ~20&ndash;35 on standard benchmarks. GPT-3: PPL ~15&ndash;20. Lower perplexity = better language understanding.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">PERPLEXITY CALCULATION</div><div class="example-body">'
+ '<strong>Sentence:</strong> "the cat sat on the mat" (6 words)<br><br>'
+ 'Model probabilities for each word: $q(\\text{the}) = 0.1$, $q(\\text{cat}|\\text{the}) = 0.05$, $q(\\text{sat}|...) = 0.08$, $q(\\text{on}|...) = 0.3$, $q(\\text{the}|...) = 0.15$, $q(\\text{mat}|...) = 0.02$<br><br>'
+ '$H = -\\frac{1}{6}[\\log_2(0.1) + \\log_2(0.05) + \\log_2(0.08) + \\log_2(0.3) + \\log_2(0.15) + \\log_2(0.02)]$<br>'
+ '$= -\\frac{1}{6}[-3.32 - 4.32 - 3.64 - 1.74 - 2.74 - 5.64] = \\frac{21.40}{6} = 3.57$ bits<br><br>'
+ '$\\text{PPL} = 2^{3.57} \\approx 11.9$<br><br>'
+ 'Interpretation: the model is as confused as if choosing uniformly among ~12 words at each step.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">perplexity</span>(probs):\n    <span class="str">"""Compute perplexity from per-word probabilities."""</span>\n    N = <span class="fn">len</span>(probs)\n    log_probs = np.<span class="fn">log2</span>(probs)\n    H = -np.<span class="fn">sum</span>(log_probs) / N  <span class="cm"># cross-entropy in bits</span>\n    <span class="kw">return</span> <span class="num">2</span> ** H\n\n<span class="cm"># Example: "the cat sat on the mat"</span>\nword_probs = [<span class="num">0.1</span>, <span class="num">0.05</span>, <span class="num">0.08</span>, <span class="num">0.3</span>, <span class="num">0.15</span>, <span class="num">0.02</span>]\n<span class="fn">print</span>(<span class="str">"Perplexity:"</span>, <span class="fn">perplexity</span>(word_probs))  <span class="cm"># ~11.9</span>\n\n<span class="cm"># Perfect model: always assigns P=1</span>\n<span class="fn">print</span>(<span class="str">"Perfect:"</span>, <span class="fn">perplexity</span>([<span class="num">1.0</span>]*<span class="num">6</span>))          <span class="cm"># 1.0</span>\n\n<span class="cm"># Random over 50k vocab</span>\n<span class="fn">print</span>(<span class="str">"Random:"</span>, <span class="fn">perplexity</span>([<span class="num">1/50000</span>]*<span class="num">6</span>))    <span class="cm"># 50000.0</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">If a language model has perplexity 1, it predicts every word with 100% confidence and is always right. If it has perplexity equal to the vocabulary size, it is uniformly random. Real models fall somewhere in between. A perplexity drop from 30 to 20 means the model went from being confused among 30 words to 20 words on average &mdash; a significant improvement!</div></div>'

/* ============================================================
   SECTION 9: Information Theory in NLP
   ============================================================ */
+ '<h2 class="l-title">9. Information Theory in NLP</h2>'

+ '<p class="l-text">Information theory is not just background math for NLP &mdash; it is deeply woven into every aspect of modern natural language processing. From tokenization to model evaluation, Shannon\'s ideas are everywhere.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Tokenization</div><div class="card-body">BPE and SentencePiece are essentially data compression algorithms. They find the most common byte pairs to minimize the encoding length &mdash; a direct application of entropy coding.</div></div>'
+ '<div class="calc-card"><div class="card-title">Language Modeling</div><div class="card-body">A language model estimates $P(w_t | w_{< t})$. Training with cross-entropy loss directly minimizes the model\'s entropy over the data &mdash; making it a better predictor.</div></div>'
+ '<div class="calc-card"><div class="card-title">Compression = Prediction</div><div class="card-body">Shannon proved: optimal compression requires perfect prediction. A model that predicts text well can compress it well, and vice versa. GPT is implicitly a compressor.</div></div>'
+ '<div class="calc-card"><div class="card-title">Knowledge Distillation</div><div class="card-body">Student mimics teacher\'s soft output distribution. The loss is KL divergence between teacher and student predictions. Transfers "dark knowledge" in probability tails.</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>Compression = Prediction:</strong> Shannon\'s source coding theorem says the optimal compression rate equals the entropy of the source. If you can predict the next character perfectly, you can compress to 0 bits. Every improvement in language model perplexity is also an improvement in text compression, and vice versa.</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Entropy in Training</div>'
+ '<div class="compare-item">&#8226; Cross-entropy loss trains the model to match $p_{\\text{data}}$</div>'
+ '<div class="compare-item">&#8226; Label smoothing adds entropy to targets to prevent overconfidence</div>'
+ '<div class="compare-item">&#8226; Temperature scaling adjusts output entropy: $T > 1$ = more uniform, $T < 1$ = more peaked</div>'
+ '<div class="compare-item">&#8226; Entropy regularization encourages exploration in RL for NLP</div></div>'
+ '<div class="compare-col"><div class="compare-title">Entropy in Inference</div>'
+ '<div class="compare-item">&#8226; Perplexity evaluates how well the model predicts held-out text</div>'
+ '<div class="compare-item">&#8226; Nucleus (top-p) sampling filters by cumulative probability</div>'
+ '<div class="compare-item">&#8226; Low-entropy outputs = confident/repetitive text</div>'
+ '<div class="compare-item">&#8226; High-entropy outputs = diverse/creative text</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">TEMPERATURE SCALING</div><div class="example-body">'
+ 'Softmax with temperature: $q_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}$<br><br>'
+ '<strong>$T = 1.0$:</strong> Standard softmax (default)<br>'
+ '<strong>$T = 0.5$:</strong> Sharper distribution &mdash; model becomes more confident (lower entropy)<br>'
+ '<strong>$T = 2.0$:</strong> Flatter distribution &mdash; model becomes more uncertain (higher entropy)<br>'
+ '<strong>$T \\to 0$:</strong> Approaches argmax (greedy decoding)<br>'
+ '<strong>$T \\to \\infty$:</strong> Approaches uniform distribution (random sampling)'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">softmax_temperature</span>(logits, temperature=<span class="num">1.0</span>):\n    <span class="str">"""Softmax with temperature scaling."""</span>\n    scaled = np.<span class="fn">array</span>(logits) / temperature\n    exp_scaled = np.<span class="fn">exp</span>(scaled - np.<span class="fn">max</span>(scaled))  <span class="cm"># numerical stability</span>\n    <span class="kw">return</span> exp_scaled / exp_scaled.<span class="fn">sum</span>()\n\nlogits = [<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">-1.0</span>]\n\n<span class="kw">for</span> T <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">5.0</span>]:\n    probs = <span class="fn">softmax_temperature</span>(logits, T)\n    H = -np.<span class="fn">sum</span>(probs * np.<span class="fn">log2</span>(probs + <span class="num">1e-10</span>))\n    <span class="fn">print</span>(<span class="str">f"T={T:.1f}: probs={np.round(probs,3)}, H={H:.3f} bits"</span>)\n\n<span class="cm"># T=0.5: probs=[0.776 0.143 0.070 0.010], H=1.094 bits (confident)</span>\n<span class="cm"># T=1.0: probs=[0.506 0.186 0.113 0.025], H=1.567 bits (standard)</span>\n<span class="cm"># T=2.0: probs=[0.368 0.223 0.170 0.082], H=1.830 bits (flatter)</span>\n<span class="cm"># T=5.0: probs=[0.293 0.260 0.243 0.204], H=1.968 bits (near uniform)</span></code></pre></div>'

+ '<div class="l-note"><strong>BPE and entropy:</strong> Byte Pair Encoding merges the most frequent symbol pairs iteratively. This is an entropy-driven process &mdash; frequent patterns get shorter codes, rare patterns get longer codes, just like Huffman coding. The vocabulary size is a compression/expressiveness trade-off: too small = long sequences (high entropy per token), too large = sparse embeddings.</div>'

/* ============================================================
   SECTION 10: Summary & Next Steps
   ============================================================ */
+ '<h2 class="l-title">10. Summary & Next Steps</h2>'

+ '<p class="l-text">You have now built a complete understanding of information theory and its central role in machine learning and NLP. Here is your toolkit:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Self-Information</div><div class="card-body">$I(x) = -\\log P(x)$: the surprise of a single event. Rare events carry more information.</div><div class="card-formula">Bits (log base 2) or nats (ln)</div></div>'
+ '<div class="calc-card"><div class="card-title">Entropy</div><div class="card-body">$H(X) = -\\sum p(x) \\log p(x)$: average surprise of a distribution. Maximum at uniform.</div><div class="card-formula">Measures inherent uncertainty</div></div>'
+ '<div class="calc-card"><div class="card-title">Cross-Entropy</div><div class="card-body">$H(p,q) = -\\sum p(x) \\log q(x)$: cost of encoding $p$ with code from $q$. Always $\\ge H(p)$.</div><div class="card-formula">THE classification loss function</div></div>'
+ '<div class="calc-card"><div class="card-title">KL Divergence</div><div class="card-body">$D_{KL}(p \\| q) = H(p,q) - H(p)$: extra cost of using $q$ instead of $p$. Asymmetric, $\\ge 0$.</div><div class="card-formula">Forward = MLE, Reverse = VI</div></div>'
+ '<div class="calc-card"><div class="card-title">Mutual Information</div><div class="card-body">$I(X;Y) = H(X) - H(X|Y)$: shared information. Captures any dependency, not just linear.</div><div class="card-formula">Feature selection, dependency detection</div></div>'
+ '<div class="calc-card"><div class="card-title">Perplexity</div><div class="card-body">$PPL = 2^{H(p,q)}$: effective vocabulary size the model is confused about. Lower is better.</div><div class="card-formula">Language model evaluation metric</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Self-Info</div><div class="flow-desc">Single event surprise</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Entropy</div><div class="flow-desc">Average surprise</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Cross-Entropy</div><div class="flow-desc">Model vs truth</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">KL Divergence</div><div class="flow-desc">Extra cost gap</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Perplexity</div><div class="flow-desc">LM evaluation</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Next Lesson:</strong> In Lesson 5, we move to <strong>Probability Distributions for ML</strong> &mdash; Gaussian, Bernoulli, Categorical, and how Maximum Likelihood Estimation connects to cross-entropy. You will see how every loss function in deep learning has a probabilistic interpretation, and how information theory ties it all together. The math you learned here is the foundation for everything that follows.</div>',


/* ============================================================
   TURKISH TRANSLATION
   ============================================================ */

tr: '<p class="l-text"><strong>Bilgi teorisi, veri sıkıştırmadan derin öğrenme kayıp fonksiyonlarına kadar her şeyin matematiksel temelidir.</strong> Claude Shannon bu alanı 1948\'de aldatıcı derecede basit bir soru sorarak icat etti: "Bilgiyi nasıl ölçeriz?" Cevap, iletişimi, istatistiği ve nihayetinde makine öğrenmesini devrimleştirdi. Bir sinir ağını cross-entropy kaybıyla her eğittiğinizde, bilgi teorisi kullanıyorsunuz.</p>'

+ '<p class="l-text">Bu ders sizi "sürpriz"in temel sezgisinden entropi, çapraz-entropi, KL diverjans ve karşılıklı bilgiye &mdash; ve bu kavramların modern NLP ve dil modellemesini nasıl yönlendirdiğine kadar götürür. Her formül ilk ilkelerden somut örneklerle türetilir.</p>'

+ '<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">'
+ '<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>'
+ '<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">'
+ '<li>Öz-bilgiyi I(x) = -log p(x) tanımlayıp sürpriz ile bağlamayı</li>'
+ '<li>Kesikli dağılımlar için Shannon entropisi H(X)\\\'i bit ve nat olarak hesaplamayı</li>'
+ '<li>Softmax sınıflandırıcısı için cross-entropy kaybını log-olabilirlikten türetmeyi</li>'
+ '<li>KL diverjansı D(p||q) hesaplayıp neden simetrik olmadığını açıklamayı</li>'
+ '<li>Tablo verisinde özellik önemini karşılıklı bilgi ile puanlamayı</li>'
+ '<li>Perplexity okuyup aynı test kümesinde iki dil modelini karşılaştırmayı</li>'
+ '</ul>'
+ '</div>'

/* ── 1. Bilgi Nedir? ── */
+ '<h2 class="l-title">1. Bilgi Nedir?</h2>'

+ '<div class="calc-highlight"><strong>Shannon\'ın temel kavrayışı:</strong> Bilgi = <em>sürpriz</em>. Zaten beklediğiniz bir olay bilgi taşımaz. Sizi şok eden bir olay çok bilgi taşır. Bir olay ne kadar nadir ise, gerçekleştiğinde o kadar bilgilendiricidir.</div>'

+ '<p class="l-text">Hava durumu tahminlerini düşünün. Birisi size Sahara Çölü\'nde "hava güneşli" derse neredeyse hiçbir şey öğrenmezsiniz &mdash; orada her zaman güneşlidir. Ama birisi "Sahara\'da kar yağıyor" derse, bu gerçekten şaşırtıcı ve bilgilendiricidir. Shannon bu sezgiyi matematiksel olarak formüle etti.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sürpriz</div><div class="card-body">Bilgi = sürpriz. Düşük olasılıklı olaylar yüksek bilgi taşır. Yüksek olasılıklı olaylar düşük bilgi taşır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Olasılık</div><div class="card-body">P(olay) 1\'e yakınsa, gerçekleştiğini öğrenmek size neredeyse hiçbir şey söylemez. P(olay) 0\'a yakınsa, çok şey söyler.</div></div>'
+ '<div class="calc-card"><div class="card-title">Toplamsallık</div><div class="card-body">İki bağımsız olay birlikte, bireysel bilgilerinin toplamı kadar bilgiye sahip olmalıdır. Bu, logaritma formunu zorunlu kılar.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kesinlik = Sıfır Bilgi</div><div class="card-body">P=1 olan bir olay sıfır bilgi taşır. Zaten olacağını biliyordunuz. Hiç sürpriz yok.</div></div>'
+ '</div>'

+ '<p class="l-text"><strong>Üç aksiyom</strong> bilgi formülünü belirler:</p>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Monotonluk</div><div class="step-detail">Daha az olası olaylar daha fazla bilgi taşır: $P(a) < P(b)$ ise $I(a) > I(b)$.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Toplamsallık</div><div class="step-detail">Bağımsız olaylar için: $I(a \\cap b) = I(a) + I(b)$. İki bağımsız olaydan gelen bilgi toplanır.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Süreklilik</div><div class="step-detail">Olasılıkta küçük bir değişiklik bilgide küçük bir değişikliğe neden olur. Süreksiz atlamalar yok.</div></div></div>'
+ '</div>'

+ '<div class="l-note"><strong>ML için neden önemli:</strong> Bu aksiyomlar bilgi fonksiyonunun ters olasılığın logaritması olması gerektiğini benzersiz olarak belirler. Üçünü de sağlayan başka bir fonksiyon yoktur. Bu rastgele bir seçim değildir &mdash; bilgiyi ölçmenin matematiksel olarak tutarlı <em>tek</em> yoludur.</div>'

/* ── 2. Öz-Bilgi ── */
+ '<h2 class="l-title">2. Öz-Bilgi (Self-Information)</h2>'

+ '<p class="l-text">Üç aksiyom göz önüne alındığında, tek bir olayın bilgi içeriğini ölçen benzersiz fonksiyon:</p>'

+ '<div class="calc-formula"><div class="formula-label">ÖZ-BİLGİ</div><div class="formula-main">$$I(x) = -\\log P(x) = \\log \\frac{1}{P(x)}$$</div><div class="formula-sub">$P(x)$ olasılıklı $x$ olayı gerçekleştiğinde kazanılan bilgi (veya yaşanan sürpriz).</div></div>'

+ '<p class="l-text">Logaritmanın <strong>tabanı</strong> ölçüm birimini belirler:</p>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Taban 2 (Bit)</div>'
+ '<div class="compare-item">&#8226; $I(x) = -\\log_2 P(x)$</div>'
+ '<div class="compare-item">&#8226; Birim: <strong>bit</strong> (ikili basamak)</div>'
+ '<div class="compare-item">&#8226; BT, sıkıştırma, kodlama teorisinde</div>'
+ '<div class="compare-item">&#8226; Adil yazı tura = 1 bit bilgi</div></div>'
+ '<div class="compare-col"><div class="compare-title">Taban e (Nat)</div>'
+ '<div class="compare-item">&#8226; $I(x) = -\\ln P(x)$</div>'
+ '<div class="compare-item">&#8226; Birim: <strong>nat</strong> (doğal birim)</div>'
+ '<div class="compare-item">&#8226; ML, istatistik, derin öğrenmede</div>'
+ '<div class="compare-item">&#8226; Kalkülüs/optimizasyon için daha uygun</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">SOMUT ÖRNEKLER</div><div class="example-body">'
+ '<strong>Adil yazı tura (yazı):</strong> $I = -\\log_2(0.5) = 1$ bit<br>'
+ '<strong>Adil zar (6 gelme):</strong> $I = -\\log_2(1/6) = 2.585$ bit<br>'
+ '<strong>Kesin olay (P=1):</strong> $I = -\\log_2(1) = 0$ bit &mdash; sürpriz yok!<br>'
+ '<strong>Nadir olay (P=0.01):</strong> $I = -\\log_2(0.01) = 6.644$ bit &mdash; çok şaşırtıcı!<br>'
+ '<strong>Dönüştürme:</strong> 1 nat = $1/\\ln 2 \\approx 1.443$ bit'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">self_information</span>(p, base=<span class="num">2</span>):\n    <span class="str">"""Bit (base=2) veya nat (base=e) cinsinden öz-bilgi."""</span>\n    <span class="kw">if</span> base == <span class="num">2</span>:\n        <span class="kw">return</span> -np.<span class="fn">log2</span>(p)\n    <span class="kw">else</span>:\n        <span class="kw">return</span> -np.<span class="fn">log</span>(p)\n\n<span class="fn">print</span>(<span class="str">"Adil yazi tura:"</span>, <span class="fn">self_information</span>(<span class="num">0.5</span>))   <span class="cm"># 1.0 bit</span>\n<span class="fn">print</span>(<span class="str">"Zar 6:"</span>, <span class="fn">self_information</span>(<span class="num">1/6</span>))         <span class="cm"># 2.585 bit</span>\n<span class="fn">print</span>(<span class="str">"Kesin:"</span>, <span class="fn">self_information</span>(<span class="num">1.0</span>))          <span class="cm"># 0.0 bit</span>\n<span class="fn">print</span>(<span class="str">"Nadir:"</span>, <span class="fn">self_information</span>(<span class="num">0.01</span>))        <span class="cm"># 6.644 bit</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">$I(x) = -\\log P(x)$\'ta eksi işareti neden var? $0 \\le P(x) \\le 1$ olduğundan logaritma her zaman negatif veya sıfırdır. Eksi işareti bilgiyi negatif olmayan yapar. Daha şaşırtıcı olaylar (düşük $P$) daha büyük pozitif değerler verir.</div></div>'

/* ── 3. Entropi ── */
+ '<h2 class="l-title">3. Entropi</h2>'

+ '<p class="l-text">Öz-bilgi tek bir olay için sürprizi ölçer. Ama tüm bir olasılık dağılımını karakterize etmek istersek? Bir rastgele değişken <em>ortalama</em> ne kadar "şaşırtıcı"? İşte <strong>entropi</strong>.</p>'

+ '<div class="calc-formula"><div class="formula-label">SHANNON ENTROPİSİ</div><div class="formula-main">$$H(X) = -\\sum_{x} P(x) \\log P(x) = \\mathbb{E}[I(X)]$$</div><div class="formula-sub">$X$ rastgele değişkeninin tüm olası sonuçları üzerindeki beklenen (ortalama) öz-bilgi.</div></div>'

+ '<div class="calc-highlight"><strong>Entropi = ortalama sürpriz.</strong> Bir olasılık dağılımındaki doğal belirsizliği veya öngörülemezliği ölçer. Yüksek entropi dağılımın yaygın olduğu anlamına gelir (tahmin etmek zor). Düşük entropi yoğunlaşmış olduğu anlamına gelir (tahmin etmek kolay).</div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Minimum Entropi</div><div class="card-body">Bir sonuç P=1, diğerleri P=0. Hiç belirsizlik yok &mdash; ne olacağını tam olarak biliyorsunuz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Maksimum Entropi</div><div class="card-body">Düzgün dağılım: tüm sonuçlar eşit olası. Maksimum belirsizlik. $H = \\log n$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Adil Yazı Tura</div><div class="card-body">$H = -0.5\\log_2(0.5) - 0.5\\log_2(0.5) = 1$ bit. Bir bit entropi, adil bir yazı tura atışının belirsizliğidir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dil Entropisi</div><div class="card-body">İngilizce metin ~1.0&ndash;1.5 bit/karakter entropiye sahiptir. Oldukça öngörülebilir! Teorik maks ~4.7 bitten çok daha az.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ELLE ENTROPİ HESAPLAMA</div><div class="example-body">'
+ '<strong>Hileli yazı tura (P(Y)=0.8, P(T)=0.2):</strong><br>'
+ '$H = -0.8 \\log_2(0.8) - 0.2 \\log_2(0.2) = 0.722$ bit<br><br>'
+ '<strong>Adil yazı tura (P(Y)=0.5, P(T)=0.5):</strong><br>'
+ '$H = 1.0$ bit<br><br>'
+ 'Hileli yazı turanın entropisi <em>daha düşüktür</em> (0.722 < 1.0) çünkü daha öngörülebilir.'
+ '</div></div>'

+ '<div id="plot-entropy-binary-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var p=[];var h=[];for(var i=1;i<=99;i++){var pi=i/100;p.push(pi);h.push(-pi*Math.log2(pi)-(1-pi)*Math.log2(1-pi));}'
+ 'var t1={x:p,y:h,mode:"lines",name:"H(p)",line:{color:"#c8a96e",width:3}};'
+ 'var ann1={x:0.5,y:1.0,xref:"x",yref:"y",text:"Maks entropi = 1 bit",showarrow:true,arrowhead:2,ax:60,ay:-30,font:{color:"#c8a96e",size:11}};'
+ 'var layout={title:{text:"İkili Entropi: H(p) = -p log p - (1-p) log(1-p)",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"P(X=1)",range:[0,1]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"Entropi (bit)",range:[0,1.1]},margin:{t:50,r:30,b:50,l:50},annotations:[ann1],showlegend:false};'
+ 'Plotly.newPlot("plot-entropy-binary-tr",[t1],layout,{responsive:true,displayModeBar:false});'
+ '},100)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>İkili entropi fonksiyonu:</strong> Entropi p=0.5\'te maksimize olur (adil yazı tura, maksimum belirsizlik) ve p=0 veya p=1\'de minimize olur (kesin sonuç, belirsizlik yok).</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">entropy</span>(probs, base=<span class="num">2</span>):\n    <span class="str">"""Kesikli dağılımın Shannon entropisi."""</span>\n    probs = np.<span class="fn">array</span>(probs)\n    probs = probs[probs > <span class="num">0</span>]\n    <span class="kw">if</span> base == <span class="num">2</span>:\n        <span class="kw">return</span> -np.<span class="fn">sum</span>(probs * np.<span class="fn">log2</span>(probs))\n    <span class="kw">return</span> -np.<span class="fn">sum</span>(probs * np.<span class="fn">log</span>(probs))\n\n<span class="fn">print</span>(<span class="str">"Adil:"</span>, <span class="fn">entropy</span>([<span class="num">0.5</span>, <span class="num">0.5</span>]))       <span class="cm"># 1.0</span>\n<span class="fn">print</span>(<span class="str">"Hileli:"</span>, <span class="fn">entropy</span>([<span class="num">0.8</span>, <span class="num">0.2</span>]))     <span class="cm"># 0.722</span>\n<span class="fn">print</span>(<span class="str">"Adil zar:"</span>, <span class="fn">entropy</span>([<span class="num">1/6</span>]*<span class="num">6</span>))    <span class="cm"># 2.585</span></code></pre></div>'

+ '<div class="l-note"><strong>Maksimum Entropi İlkesi:</strong> Ek bilginiz olmadığında maksimum entropi dağılımı en iyi tahmindir. Bilinen ortalama ve varyanslı sınırlı sürekli değişken için maksimum entropi Gauss dağılımını verir. Gauss dağılımının doğada her yerde görünmesinin derin nedenlerinden biri budur.</div>'

/* ── 4. Çapraz-Entropi ── */
+ '<h2 class="l-title">4. Çapraz-Entropi</h2>'

+ '<p class="l-text">Entropi, belirsizliği <em>gerçek</em> dağılımla ölçer. Ama aslında $p$ dağılımını izleyen olayları kodlamak için <em>farklı</em> bir $q$ dağılımı kullanırsak? <strong>Çapraz-entropi</strong> elde ederiz &mdash; ve bu her zaman gerçek dağılımı kullanmaktan daha fazla bit\'e mal olur.</p>'

+ '<div class="calc-formula"><div class="formula-label">ÇAPRAZ-ENTROPİ</div><div class="formula-main">$$H(p, q) = -\\sum_{x} p(x) \\log q(x)$$</div><div class="formula-sub">$q$ için optimize edilmiş bir kod kullanarak $p$\'den gelen olayları kodlamak için gereken ortalama bit sayısı.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Gerçek Dağılım</div><div class="card-body">Veriyi oluşturan gerçek dağılım. Doğanın sağladığı şey &mdash; $p$\'den örnekliyoruz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Tahmin Dağılımı</div><div class="card-body">Modelimizin tahmini. $q = p$ ise optimal kodlama sağlarız. Aksi takdirde bit israf ederiz.</div></div>'
+ '<div class="calc-card"><div class="card-title">Her zaman &ge; H(p)</div><div class="card-body">$H(p, q) \\ge H(p)$ her zaman. Sadece $q = p$ olduğunda eşitlenir. Fark, KL diverjansıdır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Kayıp Fonksiyonu</div><div class="card-body">Sınıflandırmada: $p$ = one-hot gerçek etiket, $q$ = model softmax çıktısı. Çapraz-entropiyi minimize etmek = $q$\'yu $p$\'ye yaklaştırmak.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ÇAPRAZ-ENTROPİ ÖRNEĞİ</div><div class="example-body">'
+ '<strong>Gerçek dağılım:</strong> $p = [0.8, 0.1, 0.1]$ (üç sınıf)<br>'
+ '<strong>Model tahmini:</strong> $q = [0.6, 0.2, 0.2]$<br><br>'
+ '$H(p, q) = -[0.8 \\log_2(0.6) + 0.1 \\log_2(0.2) + 0.1 \\log_2(0.2)]$<br>'
+ '$= -[0.8(-0.737) + 0.1(-2.322) + 0.1(-2.322)]$<br>'
+ '$= 0.590 + 0.232 + 0.232 = 1.054$ bit<br><br>'
+ '<strong>Entropiyle karşılaştır:</strong> $H(p) = 0.922$ bit. Ekstra 0.132 bit, $p$ yerine $q$ kullanmanın &quot;cezasıdır&quot;.'
+ '</div></div>'

+ '<div class="calc-formula"><div class="formula-label">TEMEL İLİŞKİ</div><div class="formula-main">$$H(p, q) = H(p) + D_{KL}(p \\| q)$$</div><div class="formula-sub">Çapraz-entropi = entropi + KL diverjans. $p$ yerine $q$ kullanmanın "ekstra maliyeti" tam olarak KL diverjansıdır.</div></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">One-hot etiketlerle sınıflandırmada ($p = [0, ..., 1, ..., 0]$), entropi $H(p) = 0$. Yani çapraz-entropi kaybı $= D_{KL}(p \\| q)$ doğrudan. Çapraz-entropi kaybını minimize etmek bu durumda KL diverjansını minimize etmektir!</div></div>'

/* ── 5. KL Diverjans ── */
+ '<h2 class="l-title">5. KL Diverjans</h2>'

+ '<p class="l-text"><strong>Kullback-Leibler diverjans</strong>, bir olasılık dağılımının diğerinden ne kadar farklı olduğunu ölçer. $p$\'yi yaklaşık olarak $q$ ile ifade ettiğinizde "kaybedilen bilgi"yi nicelleştirir.</p>'

+ '<div class="calc-formula"><div class="formula-label">KL DİVERJANS</div><div class="formula-main">$$D_{KL}(p \\| q) = \\sum_{x} p(x) \\log \\frac{p(x)}{q(x)} = H(p, q) - H(p)$$</div><div class="formula-sub">$q$ için optimize edilmiş bir kodu kullanarak $p$\'den gelen veriyi kodlamanın minimum bit $H(p)$\'nin ötesindeki ekstra maliyeti.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Negatif Olmayan</div><div class="card-body">$D_{KL}(p \\| q) \\ge 0$ her zaman. Sadece $p = q$ olduğunda sıfıra eşittir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Asimetrik</div><div class="card-body">$D_{KL}(p \\| q) \\ne D_{KL}(q \\| p)$ genel olarak. Gerçek bir uzaklık metriği DEĞİLDİR!</div></div>'
+ '<div class="calc-card"><div class="card-title">İleri KL</div><div class="card-body">$p > 0$ ama $q \\approx 0$ olduğunda $q$\'yu ağır cezalandırır. "Ortalama-arayan" yaklaşımlar. MLE/çapraz-entropide.</div></div>'
+ '<div class="calc-card"><div class="card-title">Ters KL</div><div class="card-body">$q > 0$ ama $p \\approx 0$ olduğunda cezalandırır. "Mod-arayan" yaklaşımlar. Varyasyonel çıkarımda (VAE).</div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">İleri KL: $D_{KL}(p \\| q)$</div>'
+ '<div class="compare-item">&#8226; Gözetimli öğrenmede (çapraz-entropi kaybı)</div>'
+ '<div class="compare-item">&#8226; $q$\'yu $p$\'nin tüm modlarını kaplamaya zorlar</div>'
+ '<div class="compare-item">&#8226; "Ortalama-arayan": $q$, $p$ üzerinde ortalama almaya çalışır</div>'
+ '<div class="compare-item">&#8226; Bulanık çıktılar üretebilir</div></div>'
+ '<div class="compare-col"><div class="compare-title">Ters KL: $D_{KL}(q \\| p)$</div>'
+ '<div class="compare-item">&#8226; Varyasyonel çıkarımda (VAE, ELBO)</div>'
+ '<div class="compare-item">&#8226; $q$\'yu $p \\approx 0$ olan bölgelerden kaçınmaya zorlar</div>'
+ '<div class="compare-item">&#8226; "Mod-arayan": $q$, $p$\'nin bir moduna kilitlenir</div>'
+ '<div class="compare-item">&#8226; Keskin ama eksik çıktılar üretebilir</div></div>'
+ '</div>'

+ '<div id="plot-kl-divergence-tr" class="plotly-graph"></div>'
+ '<script>setTimeout(function(){'
+ 'var q_vals=[];var kl_fwd=[];var kl_rev=[];'
+ 'var p1=0.7;var p2=0.3;'
+ 'for(var i=1;i<=99;i++){var qi=i/100;var q2i=1-qi;'
+ 'q_vals.push(qi);'
+ 'kl_fwd.push(p1*Math.log2(p1/qi)+p2*Math.log2(p2/q2i));'
+ 'kl_rev.push(qi*Math.log2(qi/p1)+q2i*Math.log2(q2i/p2));}'
+ 'var t1={x:q_vals,y:kl_fwd,mode:"lines",name:"D_KL(p||q) İleri",line:{color:"#c8a96e",width:3}};'
+ 'var t2={x:q_vals,y:kl_rev,mode:"lines",name:"D_KL(q||p) Ters",line:{color:"#4ecdc4",width:3}};'
+ 'var ann={x:0.7,y:0,xref:"x",yref:"y",text:"p = [0.7, 0.3]",showarrow:true,arrowhead:2,ax:0,ay:-35,font:{color:"#f87171",size:11}};'
+ 'var layout={title:{text:"KL Diverjans: İleri vs Ters (p = [0.7, 0.3])",font:{color:"#ebe6dc",size:14}},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#ebe6dc"},xaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"q\u2081 (q alt\u0131nda s\u0131n\u0131f 1 olas\u0131l\u0131\u011f\u0131)",range:[0.01,0.99]},yaxis:{gridcolor:"rgba(255,255,255,0.06)",zerolinecolor:"rgba(255,255,255,0.15)",title:"KL Diverjans (bit)",range:[0,4]},margin:{t:50,r:30,b:50,l:50},annotations:[ann],showlegend:true,legend:{font:{color:"#ebe6dc",size:10}}};'
+ 'Plotly.newPlot("plot-kl-divergence-tr",[t1,t2],layout,{responsive:true,displayModeBar:false});'
+ '},200)</script>'

+ '<div class="calc-graph"><div class="graph-caption"><strong>KL diverjans asimetrisi:</strong> Her iki eğri $q = p = [0.7, 0.3]$\'te sıfıra ulaşır, ama şekilleri farklıdır. İleri KL (altın), $q_1 \\to 0$ olduğunda patlar. Ters KL (camgöbeği), $q_1 \\to 1$ olduğunda patlar.</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">kl_divergence</span>(p, q):\n    <span class="str">"""Nat cinsinden KL diverjans D_KL(p || q)."""</span>\n    p, q = np.<span class="fn">array</span>(p), np.<span class="fn">array</span>(q)\n    mask = p > <span class="num">0</span>\n    <span class="kw">return</span> np.<span class="fn">sum</span>(p[mask] * np.<span class="fn">log</span>(p[mask] / q[mask]))\n\np = [<span class="num">0.7</span>, <span class="num">0.3</span>]\nq = [<span class="num">0.5</span>, <span class="num">0.5</span>]\n<span class="fn">print</span>(<span class="str">"D_KL(p||q) ="</span>, <span class="fn">kl_divergence</span>(p, q))  <span class="cm"># 0.0871 nat</span>\n<span class="fn">print</span>(<span class="str">"D_KL(q||p) ="</span>, <span class="fn">kl_divergence</span>(q, p))  <span class="cm"># 0.0953 nat</span>\n<span class="fn">print</span>(<span class="str">"Esit değil! KL asimetriktir."</span>)</code></pre></div>'

+ '<div class="l-note"><strong>Uyarı:</strong> $q(x) = 0$ ama $p(x) > 0$ olduğunda KL diverjans tanımsızdır. Bu, modelinizin gerçekleşebilecek olaylara asla sıfır olasılık atamaması gerektiği anlamına gelir. Pratikte bu yüzden küçük epsilon değerleri ekler veya sınıflandırmada etiket yumuşatma kullanırız.</div>'

/* ── 6. Çapraz-Entropi Kaybı ── */
+ '<h2 class="l-title">6. Çapraz-Entropi Kaybı</h2>'

+ '<p class="l-text">Çapraz-entropi sadece soyut bir kavram değildir &mdash; derin öğrenmede sınıflandırma için <strong>standart</strong> kayıp fonksiyonudur. İşte sınıflandırma görevleri için MSE gibi alternatiflere neden baskın olduğu.</p>'

+ '<div class="calc-formula"><div class="formula-label">İKİLİ ÇAPRAZ-ENTROPİ KAYBI</div><div class="formula-main">$$\\mathcal{L} = -\\frac{1}{N}\\sum_{i=1}^{N}\\left[y_i \\log(\\hat{y}_i) + (1-y_i)\\log(1-\\hat{y}_i)\\right]$$</div><div class="formula-sub">$y_i \\in \\{0,1\\}$ gerçek etiket, $\\hat{y}_i$ tahmin edilen olasılık. $N$ örnek üzerinden ortalalanır.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">KATEGORİK ÇAPRAZ-ENTROPİ KAYBI</div><div class="formula-main">$$\\mathcal{L} = -\\frac{1}{N}\\sum_{i=1}^{N}\\sum_{c=1}^{C} y_{i,c} \\log(\\hat{y}_{i,c})$$</div><div class="formula-sub">$C$ sınıf, $y_{i,c}$ gerçek sınıf için 1 diğerleri için 0 (one-hot), $\\hat{y}_{i,c}$ softmax çıktısı.</div></div>'

+ '<div class="calc-highlight"><strong>Maksimum Olabilirlik bağlantısı:</strong> Çapraz-entropi kaybını minimize etmek, modeliniz altında verinin log-olabilirliğini maksimize etmekle matematiksel olarak <em>aynıdır</em>. Aynı optimizasyon! MLE "veriyi en olası kılan parametreleri bul" der. Çapraz-entropi "tahmin dağılımı gerçek dağılıma en yakın olan parametreleri bul" der. Aynı şey, farklı bakış açıları.</div>'

+ '<div class="calc-steps">'
+ '<div class="calc-step"><div class="step-num">1</div><div class="step-content"><div class="step-title">Olabilirliği Yaz</div><div class="step-detail">$\\mathcal{L}_{\\text{likelihood}} = \\prod_i \\hat{y}_i^{y_i} (1-\\hat{y}_i)^{(1-y_i)}$ ikili sınıflandırma için.</div></div></div>'
+ '<div class="calc-step"><div class="step-num">2</div><div class="step-content"><div class="step-title">Logaritmasını Al</div><div class="step-detail">$\\log \\mathcal{L} = \\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]$</div></div></div>'
+ '<div class="calc-step"><div class="step-num">3</div><div class="step-content"><div class="step-title">Negatifini Al (Kayıp)</div><div class="step-detail">$-\\log \\mathcal{L} = -\\sum_i [y_i \\log \\hat{y}_i + (1-y_i) \\log(1-\\hat{y}_i)]$ = çapraz-entropi kaybı!</div></div></div>'
+ '</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Çapraz-Entropi (Sınıflandırma)</div>'
+ '<div class="compare-item">&#8226; Tahmin yanlış olsa bile gradyan güçlü kalır</div>'
+ '<div class="compare-item">&#8226; Emin ama yanlış tahminleri ağır cezalandırır</div>'
+ '<div class="compare-item">&#8226; Softmax/sigmoid çıktılarıyla doğal eşleşme</div>'
+ '<div class="compare-item">&#8226; Maksimum olabilirlik tahminine eşdeğer</div></div>'
+ '<div class="compare-col"><div class="compare-title">MSE (Neden Sınıflandırma için DEĞİL)</div>'
+ '<div class="compare-item">&#8226; 0 ve 1 yakınında gradyan kayboluyor (sigmoid doygunluğu)</div>'
+ '<div class="compare-item">&#8226; Olasılık hatalarını doğrusal ele alır, logaritmik değil</div>'
+ '<div class="compare-item">&#8226; Sınıflandırma için olasılıksal yorumlama yok</div>'
+ '<div class="compare-item">&#8226; Daha yavaş yakınsama, platolara takılabilir</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch\n<span class="kw">import</span> torch.nn <span class="kw">as</span> nn\n\n<span class="cm"># İkili çapraz-entropi</span>\nbce = nn.<span class="fn">BCELoss</span>()\ny_true = torch.<span class="fn">tensor</span>([<span class="num">1.0</span>, <span class="num">0.0</span>, <span class="num">1.0</span>])\ny_pred = torch.<span class="fn">tensor</span>([<span class="num">0.9</span>, <span class="num">0.1</span>, <span class="num">0.8</span>])\n<span class="fn">print</span>(<span class="str">"BCE Kaybi:"</span>, <span class="fn">bce</span>(y_pred, y_true).<span class="fn">item</span>())\n\n<span class="cm"># Kategorik çapraz-entropi (sayisal kararlilik için logitlerle)</span>\nce = nn.<span class="fn">CrossEntropyLoss</span>()\nlogits = torch.<span class="fn">tensor</span>([[<span class="num">2.0</span>, <span class="num">0.5</span>, <span class="num">-1.0</span>]])\nlabels = torch.<span class="fn">tensor</span>([<span class="num">0</span>])\n<span class="fn">print</span>(<span class="str">"CE Kaybi:"</span>, <span class="fn">ce</span>(logits, labels).<span class="fn">item</span>())</code></pre></div>'

+ '<div class="l-warn"><strong>PyTorch tuzağı:</strong> <code>nn.CrossEntropyLoss</code> softmax olasılıklarını değil, <em>ham logitleri</em> bekler. Dahili olarak sayısal kararlılık için log-softmax uygular. Olasılıkları önce softmax\'tan geçirirseniz yanlış sonuçlar alırsınız.</div>'

/* ── 7. Karşılıklı Bilgi ── */
+ '<h2 class="l-title">7. Karşılıklı Bilgi</h2>'

+ '<p class="l-text"><strong>Karşılıklı bilgi</strong>, bir değişkeni bilmenin diğeri hakkında ne kadar söylediğini ölçer. $X$ ve $Y$ bağımsızsa, $X$\'i bilmek $Y$ hakkında hiçbir şey söylemez, yani $I(X;Y) = 0$.</p>'

+ '<div class="calc-formula"><div class="formula-label">KARŞILIKLI BİLGİ</div><div class="formula-main">$$I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)$$</div><div class="formula-sub">$Y$\'yi gözlemledikten sonra $X$ hakkındaki belirsizlikteki azalma. Ayrıca: $I(X;Y) = H(X) + H(Y) - H(X,Y)$.</div></div>'

+ '<div class="calc-formula"><div class="formula-label">KARŞILIKLI BİLGİ (KL FORMU)</div><div class="formula-main">$$I(X;Y) = D_{KL}\\left(P(X,Y) \\| P(X)P(Y)\\right)$$</div><div class="formula-sub">KB, ortak dağılımın marjinallerin çarpımından (bağımsızlık) ne kadar uzak olduğunu ölçer.</div></div>'

+ '<div class="calc-graph"><div class="graph-title">Bilgi Venn Diyagrami</div>'
+ '<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">'
+ '<circle cx="220" cy="140" r="110" fill="rgba(200,169,110,0.15)" stroke="#c8a96e" stroke-width="2"/>'
+ '<circle cx="380" cy="140" r="110" fill="rgba(78,205,196,0.15)" stroke="#4ecdc4" stroke-width="2"/>'
+ '<text x="155" y="140" fill="#c8a96e" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">H(X|Y)</text>'
+ '<text x="300" y="130" fill="#f87171" font-family="monospace" font-size="14" text-anchor="middle" font-weight="bold">I(X;Y)</text>'
+ '<text x="300" y="152" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">Karşılıklı</text>'
+ '<text x="300" y="167" fill="#f87171" font-family="monospace" font-size="10" text-anchor="middle">Bilgi</text>'
+ '<text x="445" y="140" fill="#4ecdc4" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">H(Y|X)</text>'
+ '<text x="220" y="38" fill="#c8a96e" font-family="monospace" font-size="14" text-anchor="middle">H(X)</text>'
+ '<text x="380" y="38" fill="#4ecdc4" font-family="monospace" font-size="14" text-anchor="middle">H(Y)</text>'
+ '<text x="300" y="270" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="11" text-anchor="middle">H(X,Y) = H(X|Y) + I(X;Y) + H(Y|X)</text>'
+ '</svg>'
+ '<div class="graph-caption"><strong>Bilgi Venn diyagramı:</strong> $H(X)$, $X$\'teki toplam belirsizliktir. Bir kısmı $Y$ ile "paylaşılır" (kesişim = karşılıklı bilgi). Geri kalanı $H(X|Y)$, $Y$\'yi gözlemledikten sonra kalan belirsizliktir.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Marjinal Entropi</div><div class="card-body">$Y$\'yi görmeden önce $X$\'teki toplam belirsizlik.</div></div>'
+ '<div class="calc-card"><div class="card-title">Koşullu Entropi</div><div class="card-body">$Y$\'yi bildikten sonra $X$\'te kalan belirsizlik. Her zaman $\\le H(X)$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Karşılıklı Bilgi</div><div class="card-body">$X$ ve $Y$ arasındaki "paylaşılmış" bilgi. Simetrik: $I(X;Y) = I(Y;X)$. Her zaman $\\ge 0$.</div></div>'
+ '<div class="calc-card"><div class="card-title">Öznitelik Seçimi</div><div class="card-body">ML\'de yüksek $I(X;Y)$ ($Y$ etiket) olan öznitelikler en bilgilendiricidir. KB-tabanlı seçim, korelasyonun kaçırdığı doğrusal olmayan ilişkileri yakalar.</div></div>'
+ '</div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_selection <span class="kw">import</span> mutual_info_classif\n<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_classification\n<span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="cm"># Örnek veri: 5 oznitelik, sadece 2 bilgilendirici</span>\nX, y = <span class="fn">make_classification</span>(n_samples=<span class="num">1000</span>, n_features=<span class="num">5</span>,\n                           n_informative=<span class="num">2</span>, random_state=<span class="num">42</span>)\n\nmi = <span class="fn">mutual_info_classif</span>(X, y, random_state=<span class="num">42</span>)\n<span class="kw">for</span> i, score <span class="kw">in</span> <span class="fn">enumerate</span>(mi):\n    <span class="fn">print</span>(<span class="str">f"Oznitelik {i}: KB = {score:.4f} nat"</span>)\n\ntop_k = np.<span class="fn">argsort</span>(mi)[::-<span class="num">1</span>][:<span class="num">2</span>]\n<span class="fn">print</span>(<span class="str">"Secilen oznitelikler:"</span>, top_k)</code></pre></div>'

+ '<div class="l-note"><strong>KB vs Korelasyon:</strong> Pearson korelasyonu sadece doğrusal ilişkileri tespit eder. Karşılıklı bilgi <em>herhangi</em> bir istatistiksel bağımlılığı tespit eder. $Y = X^2$ ise korelasyon sıfıra yakın olabilir ama KB yüksek olacaktır.</div>'

/* ── 8. Şaşkınlık (Perplexity) ── */
+ '<h2 class="l-title">8. Şaşkınlık (Perplexity)</h2>'

+ '<p class="l-text"><strong>Şaşkınlık</strong>, dil modelleri için standart değerlendirme metriğidir. Soyut çapraz-entropi kavramını yorumlanabilir bir sayıya dönüştürür: modelin her adımda belirsiz olduğu "etkili seçenek sayısı".</p>'

+ '<div class="calc-formula"><div class="formula-label">ŞAŞKINLIK</div><div class="formula-main">$$\\text{PPL} = 2^{H(p,q)} = 2^{-\\frac{1}{N}\\sum_{i=1}^{N} \\log_2 q(w_i | w_{<i})}$$</div><div class="formula-sub">Üsselleştirilmiş çapraz-entropi. Bir dil modeli için $q(w_i | w_{< i})$, gerçek bir sonraki kelime $w_i$\'ye atanan olasılıktır.</div></div>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Sezgi</div><div class="card-body">Şaşkınlık = "model her konumda kaç kelime arasında eşit derecede kararsız?" Düşük = daha iyi. PPL=10 modelin 10 kelime arasında düzgün seçim yapar gibi kararsız olduğu anlamına gelir.</div></div>'
+ '<div class="calc-card"><div class="card-title">Mükemmel Model</div><div class="card-body">PPL=1 modelin doğru kelimeye her zaman olasılık 1 atadığı anlamına gelir. Asla şaşırmaz. (Pratikte imkansız.)</div></div>'
+ '<div class="calc-card"><div class="card-title">En Kötü Durum</div><div class="card-body">PPL = |V| (kelime dağarcığı boyutu) modelin düzgün olasılık atadığı anlamına gelir. Rastgele tahminden iyi değil.</div></div>'
+ '<div class="calc-card"><div class="card-title">Modern DM\'ler</div><div class="card-body">GPT-2: PPL ~20&ndash;35. GPT-3: PPL ~15&ndash;20. Düşük şaşkınlık = daha iyi dil anlayışı.</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">ŞAŞKINLIK HESAPLAMA</div><div class="example-body">'
+ '<strong>Cümle:</strong> "the cat sat on the mat" (6 kelime)<br><br>'
+ 'Her kelime için model olasılıkları: 0.1, 0.05, 0.08, 0.3, 0.15, 0.02<br><br>'
+ '$H = 3.57$ bit, $\\text{PPL} = 2^{3.57} \\approx 11.9$<br><br>'
+ 'Yorum: model her adımda ~12 kelime arasında düzgün seçim yapar gibi kararsız.'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">perplexity</span>(probs):\n    <span class="str">"""Kelime basina olasiliklardan saskinlik hesapla."""</span>\n    N = <span class="fn">len</span>(probs)\n    log_probs = np.<span class="fn">log2</span>(probs)\n    H = -np.<span class="fn">sum</span>(log_probs) / N\n    <span class="kw">return</span> <span class="num">2</span> ** H\n\nword_probs = [<span class="num">0.1</span>, <span class="num">0.05</span>, <span class="num">0.08</span>, <span class="num">0.3</span>, <span class="num">0.15</span>, <span class="num">0.02</span>]\n<span class="fn">print</span>(<span class="str">"Saskinlik:"</span>, <span class="fn">perplexity</span>(word_probs))  <span class="cm"># ~11.9</span>\n<span class="fn">print</span>(<span class="str">"Mukemmel:"</span>, <span class="fn">perplexity</span>([<span class="num">1.0</span>]*<span class="num">6</span>))       <span class="cm"># 1.0</span></code></pre></div>'

+ '<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Bir dil modelinin şaşkınlığı 1 ise, her kelimeyi %100 güvenle tahmin eder ve her zaman haklıdır. Şaşkınlık kelime dağarcığı boyutuna eşitse, düzgün rastgeledir. Gerçek modeller arada bir yerdedir. 30\'dan 20\'ye düşen şaşkınlık, modelin 30 kelime arasında kararsız olmaktan 20 kelimeye geçtiği anlamına gelir.</div></div>'

/* ── 9. NLP\'de Bilgi Teorisi ── */
+ '<h2 class="l-title">9. NLP\'de Bilgi Teorisi</h2>'

+ '<p class="l-text">Bilgi teorisi NLP için sadece arka plan matematiği değildir &mdash; modern doğal dil işlemenin her yönüne derinlemesine dokunur. Tokenizasyondan model değerlendirmesine kadar Shannon\'ın fikirleri her yerdedir.</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Tokenizasyon</div><div class="card-body">BPE ve SentencePiece temelde veri sıkıştırma algoritmalarıdır. Kodlama uzunluğunu minimize etmek için en sık bayt çiftlerini bulurlar &mdash; entropi kodlamasının doğrudan uygulaması.</div></div>'
+ '<div class="calc-card"><div class="card-title">Dil Modelleme</div><div class="card-body">Dil modeli $P(w_t | w_{< t})$\'yi tahmin eder. Çapraz-entropi kaybıyla eğitim, modelin veri üzerindeki entropisini doğrudan minimize eder.</div></div>'
+ '<div class="calc-card"><div class="card-title">Sıkıştırma = Tahmin</div><div class="card-body">Shannon kanıtladı: optimal sıkıştırma mükemmel tahmin gerektirir. Metni iyi tahmin eden model onu iyi sıkıştırabilir ve tam tersi. GPT örtük bir sıkıştırıcıdır.</div></div>'
+ '<div class="calc-card"><div class="card-title">Bilgi Damıtma</div><div class="card-body">Öğrenci, öğretmenin yumuşak çıktı dağılımını taklit eder. Kayıp, öğretmen ve öğrenci tahminleri arasındaki KL diverjansıdır.</div></div>'
+ '</div>'

+ '<div class="calc-highlight"><strong>Sıkıştırma = Tahmin:</strong> Shannon\'ın kaynak kodlama teoremi, optimal sıkıştırma oranının kaynağın entropisine eşit olduğunu söyler. Bir sonraki karakteri mükemmel tahmin edebilirseniz, 0 bit\'e sıkıştırabilirsiniz. Dil modeli şaşkınlığındaki her iyileştirme, metin sıkıştırmada da bir iyileştirmedir.</div>'

+ '<div class="calc-compare">'
+ '<div class="compare-col"><div class="compare-title">Eğitimde Entropi</div>'
+ '<div class="compare-item">&#8226; Çapraz-entropi kaybı modeli $p_{\\text{data}}$ ile eşleşmeye eğitir</div>'
+ '<div class="compare-item">&#8226; Etiket yumuşatma, aşırı güven için hedeflere entropi ekler</div>'
+ '<div class="compare-item">&#8226; Sıcaklık ölçekleme çıktı entropisini ayarlar</div>'
+ '<div class="compare-item">&#8226; Entropi düzenlileştirmesi NLP için RL\'de keşfi teşvik eder</div></div>'
+ '<div class="compare-col"><div class="compare-title">Çıkarımda Entropi</div>'
+ '<div class="compare-item">&#8226; Şaşkınlık, modelin saklanan metni ne kadar iyi tahmin ettiğini değerlendirir</div>'
+ '<div class="compare-item">&#8226; Nucleus (top-p) örnekleme kümülatif olasılığa göre filtreler</div>'
+ '<div class="compare-item">&#8226; Düşük entropili çıktılar = güvenli/tekrarlayıcı metin</div>'
+ '<div class="compare-item">&#8226; Yüksek entropili çıktılar = çeşitli/yaratıcı metin</div></div>'
+ '</div>'

+ '<div class="calc-example"><div class="example-label">SICAKLIK ÖLÇEKLEMESİ</div><div class="example-body">'
+ 'Sıcaklıklı softmax: $q_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}$<br><br>'
+ '<strong>$T = 1.0$:</strong> Standart softmax (varsayılan)<br>'
+ '<strong>$T = 0.5$:</strong> Daha keskin dağılım &mdash; daha güvenli (düşük entropi)<br>'
+ '<strong>$T = 2.0$:</strong> Daha düz dağılım &mdash; daha belirsiz (yüksek entropi)<br>'
+ '<strong>$T \\to 0$:</strong> Argmax\'a yaklaşır (açgözlü çözümleme)<br>'
+ '<strong>$T \\to \\infty$:</strong> Düzgün dağılıma yaklaşır (rastgele örnekleme)'
+ '</div></div>'

+ '<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest(\'.code-wrap\').querySelector(\'code\').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np\n\n<span class="kw">def</span> <span class="fn">softmax_temperature</span>(logits, temperature=<span class="num">1.0</span>):\n    <span class="str">"""Sicaklik olceklemeli softmax."""</span>\n    scaled = np.<span class="fn">array</span>(logits) / temperature\n    exp_scaled = np.<span class="fn">exp</span>(scaled - np.<span class="fn">max</span>(scaled))\n    <span class="kw">return</span> exp_scaled / exp_scaled.<span class="fn">sum</span>()\n\nlogits = [<span class="num">2.0</span>, <span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">-1.0</span>]\n<span class="kw">for</span> T <span class="kw">in</span> [<span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">2.0</span>, <span class="num">5.0</span>]:\n    probs = <span class="fn">softmax_temperature</span>(logits, T)\n    H = -np.<span class="fn">sum</span>(probs * np.<span class="fn">log2</span>(probs + <span class="num">1e-10</span>))\n    <span class="fn">print</span>(<span class="str">f"T={T:.1f}: probs={np.round(probs,3)}, H={H:.3f} bit"</span>)</code></pre></div>'

+ '<div class="l-note"><strong>BPE ve entropi:</strong> Byte Pair Encoding en sık sembol çiftlerini yinelemeli olarak birleştirir. Bu entropi güdümlü bir süreçtir &mdash; sık kalıplar kısa kodlar alır, nadir kalıplar uzun kodlar alır. Kelime dağarcığı boyutu bir sıkıştırma/ifade edebilirlik ödünleşimidir.</div>'

/* ── 10. Özet ve Sonraki Adımlar ── */
+ '<h2 class="l-title">10. Özet ve Sonraki Adımlar</h2>'

+ '<p class="l-text">Bilgi teorisini ve makine öğrenmesi ile NLP\'deki merkezi rolünü tam olarak anladınız. İşte araç kutunuz:</p>'

+ '<div class="calc-cards">'
+ '<div class="calc-card"><div class="card-title">Öz-Bilgi</div><div class="card-body">$I(x) = -\\log P(x)$: tek bir olayın sürprizi. Nadir olaylar daha fazla bilgi taşır.</div><div class="card-formula">Bit (log taban 2) veya nat (ln)</div></div>'
+ '<div class="calc-card"><div class="card-title">Entropi</div><div class="card-body">$H(X) = -\\sum p(x) \\log p(x)$: dağılımın ortalama sürprizi. Düzgün dağılımda maksimum.</div><div class="card-formula">Doğal belirsizliği ölçer</div></div>'
+ '<div class="calc-card"><div class="card-title">Çapraz-Entropi</div><div class="card-body">$H(p,q) = -\\sum p(x) \\log q(x)$: $q$ koduyla $p$\'yi kodlamanın maliyeti. Her zaman $\\ge H(p)$.</div><div class="card-formula">Sınıflandırma kayıp fonksiyonu</div></div>'
+ '<div class="calc-card"><div class="card-title">KL Diverjans</div><div class="card-body">$D_{KL}(p \\| q) = H(p,q) - H(p)$: $p$ yerine $q$ kullanmanın ekstra maliyeti. Asimetrik, $\\ge 0$.</div><div class="card-formula">İleri = MLE, Ters = VI</div></div>'
+ '<div class="calc-card"><div class="card-title">Karşılıklı Bilgi</div><div class="card-body">$I(X;Y) = H(X) - H(X|Y)$: paylaşılan bilgi. Sadece doğrusal değil, herhangi bağımlılığı yakalar.</div><div class="card-formula">Öznitelik seçimi, bağımlılık tespiti</div></div>'
+ '<div class="calc-card"><div class="card-title">Şaşkınlık</div><div class="card-body">$PPL = 2^{H(p,q)}$: modelin kararsız kaldığı etkili kelime dağarcığı boyutu. Düşük daha iyi.</div><div class="card-formula">Dil modeli değerlendirme metriği</div></div>'
+ '</div>'

+ '<div class="calc-flow">'
+ '<div class="flow-step"><div class="flow-label">Öz-Bilgi</div><div class="flow-desc">Tek olay sürprizi</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Entropi</div><div class="flow-desc">Ortalama sürpriz</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Çapraz-Entropi</div><div class="flow-desc">Model vs gerçek</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">KL Diverjans</div><div class="flow-desc">Ekstra maliyet farkı</div></div>'
+ '<div class="flow-arrow"></div>'
+ '<div class="flow-step"><div class="flow-label">Şaşkınlık</div><div class="flow-desc">DM değerlendirme</div></div>'
+ '</div>'

+ '<div class="l-warn"><strong>Sonraki Ders:</strong> Ders 5\'te <strong>ML için Olasılık Dağılımları</strong>\'na geçiyoruz &mdash; Gauss, Bernoulli, Kategorik ve Maksimum Olabilirlik Tahmininin çapraz-entropiyle nasıl bağlandığı. Derin öğrenmedeki her kayıp fonksiyonunun olasılıksal bir yorumu olduğunu ve bilgi teorisinin hepsini nasıl birbirine bağladığını göreceksiniz.</div>'

};
