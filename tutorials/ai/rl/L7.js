window.RL_L7 = {

en: `<p class="l-text"><strong>Q-learning learns a value, then derives a policy. Policy gradient does the opposite — it learns the policy directly.</strong> This becomes essential for continuous actions, stochastic policies, and (later) for RLHF on language models.</p>
<p class="l-text">In this lesson you will learn the policy gradient theorem, REINFORCE, the variance problem, and code REINFORCE on CartPole in PyTorch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the policy gradient theorem and the log-derivative trick</li>
<li>Parameterize a stochastic policy with a softmax or Gaussian neural network</li>
<li>Implement REINFORCE — sample episodes, compute returns, take a gradient step</li>
<li>Reduce variance with a state-value baseline subtracted from the return</li>
<li>Train REINFORCE on CartPole-v1 in PyTorch and plot the learning curve</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Learn the Policy Directly?</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Continuous actions</div><div class="card-body">A robot's torque is real-valued. argmax over a continuous a is an optimization in itself. A neural net outputting (μ, σ) sidesteps this.</div></div>
<div class="calc-card"><div class="card-title">Stochastic policies</div><div class="card-body">In partial observability and competitive games, the optimal policy is randomized. Q-learning forces deterministic argmax.</div></div>
<div class="calc-card"><div class="card-title">Direct objective</div><div class="card-body">We optimize what we actually care about — expected return — not a proxy.</div></div>
<div class="calc-card"><div class="card-title">Smooth updates</div><div class="card-body">Small changes in θ → small changes in π. Q-learning's argmax is jumpy.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Parameterized Policies</h2>
<p class="l-text">Define π_θ(a|s) — a probability distribution over actions, parameterized by neural net weights θ.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Discrete actions</div><div class="card-body">Softmax over logits: π_θ(a|s) = exp(f_θ(s)_a) / Σ exp(f_θ(s)_·).</div></div>
<div class="calc-card"><div class="card-title">Continuous actions</div><div class="card-body">Gaussian: π_θ(a|s) = N(μ_θ(s), σ_θ(s)).</div></div>
</div>
<p class="l-text">Objective: maximize J(θ) = E_π[G_0] — expected return under the policy.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Policy Gradient Theorem</h2>
<p class="l-text">The miracle: even though J depends on the environment in complicated ways, its gradient has a simple form.</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) = \\mathbb{E}_{\\pi_{\\theta}} \\left[ \\sum_{t} \\nabla_{\\theta} \\log \\pi_{\\theta}(a_t | s_t) \\cdot G_t \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">π_θ(a|s)</div><div class="card-body">Policy probability of action a in state s.</div></div>
<div class="calc-card"><div class="card-title">∇ log π_θ(a|s)</div><div class="card-body">Score function — direction in θ-space that increases this action's probability.</div></div>
<div class="calc-card"><div class="card-title">G_t</div><div class="card-body">Return from time t. The "weight" telling us how much to push.</div></div>
</div>
<p class="l-text">Intuition: if action a led to a high return, increase π(a|s); if low, decrease. Stochastic gradient ascent on this estimate is REINFORCE.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. REINFORCE Algorithm</h2>
<p class="l-text">Williams 1992. Pure Monte Carlo policy gradient.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">Roll out a full episode with π_θ.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">Compute returns G_t for every step.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">Sum of (log π × G) over the episode = loss (negated for ascent).</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">Backprop, gradient step, repeat.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PyTorch REINFORCE on CartPole</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical
<span class="kw">import</span> numpy <span class="kw">as</span> np

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)

<span class="kw">class</span> <span class="fn">Policy</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.net = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>))
    <span class="kw">def</span> <span class="fn">forward</span>(self, s): <span class="kw">return</span> self.<span class="fn">net</span>(s)

pi = <span class="fn">Policy</span>()
opt = torch.optim.<span class="fn">Adam</span>(pi.<span class="fn">parameters</span>(), lr=<span class="num">1e-2</span>)
gamma = <span class="num">0.99</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    s, _ = env.<span class="fn">reset</span>()
    log_probs, rewards = [], []
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        logits = <span class="fn">pi</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32))
        dist = <span class="fn">Categorical</span>(logits=logits)
        a = dist.<span class="fn">sample</span>()
        log_probs.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a))
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        rewards.<span class="fn">append</span>(r); done = term <span class="kw">or</span> trunc

    <span class="cm"># Compute returns G_t</span>
    G, returns = <span class="num">0</span>, []
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">reversed</span>(rewards):
        G = r + gamma * G
        returns.<span class="fn">insert</span>(<span class="num">0</span>, G)
    returns = torch.<span class="fn">tensor</span>(returns, dtype=torch.float32)
    returns = (returns - returns.<span class="fn">mean</span>()) / (returns.<span class="fn">std</span>() + <span class="num">1e-8</span>)  <span class="cm"># baseline</span>

    loss = -torch.<span class="fn">stack</span>([lp * G <span class="kw">for</span> lp, G <span class="kw">in</span> <span class="fn">zip</span>(log_probs, returns)]).<span class="fn">sum</span>()
    opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

    <span class="kw">if</span> ep % <span class="num">20</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"ep={ep} return={sum(rewards):.0f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">REINFORCE in pure numpy on a 2-state, 2-action MDP. Softmax policy + manual gradient.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((2, 2))                             # state × action logits
def policy(s):
    p = np.exp(theta[s]); return p / p.sum()
def step(s, a):
    ns = 1 - s if a == 1 else s
    r  = 1.0 if ns == 1 and s == 0 else 0.0
    return ns, r
for ep in range(2000):
    s = 0; traj = []
    for _ in range(5):
        p = policy(s); a = int(rng.choice(2, p=p))
        ns, r = step(s, a); traj.append((s, a, r)); s = ns
    G = sum(r for _,_,r in traj)
    for s, a, _ in traj:
        p = policy(s); grad = -p; grad[a] += 1
        theta[s] += 0.05 * G * grad
print('Final policy(s=0):', np.round(policy(0), 3), '   policy(s=1):', np.round(policy(1), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Policy is an MLP outputting logits over 2 actions. 2) Each episode: sample actions from the categorical, store log-probs and rewards. 3) Compute discounted returns G_t backwards. 4) Standardize returns (subtract mean, divide std) — this is a simple baseline that drastically reduces variance. 5) Loss = − Σ log π(a_t|s_t) · G_t (negate because we ascend). 6) Backprop. CartPole solves around episode 300–500.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Variance Problem</h2>
<p class="l-text">REINFORCE works but is noisy. G_t sums many random rewards, so the gradient estimate has huge variance — different runs give wildly different curves. Standard remedies:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Baseline b(s)</div><div class="card-body">Subtract a state-dependent baseline: ∇ log π · (G_t − b(s)). Doesn't bias the estimator.</div></div>
<div class="calc-card"><div class="card-title">Reward-to-go</div><div class="card-body">Use only future rewards, not the whole episode return for each step.</div></div>
<div class="calc-card"><div class="card-title">Actor-Critic</div><div class="card-body">Use a learned V(s) as baseline — leads to A2C/A3C/PPO. Next lesson.</div></div>
<div class="calc-card"><div class="card-title">Standardization</div><div class="card-body">Per-batch normalize returns. The trick we used above.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Why Adding a Baseline Doesn't Bias the Gradient</h2>
<p class="l-text">Because E[∇ log π(a|s) · b(s)] = b(s) · ∇ Σ_a π(a|s) = b(s) · ∇ 1 = 0. Subtracting b(s) lowers variance without changing the expected gradient. Use V(s) as b(s) and the weight becomes the advantage A(s,a) = Q(s,a) − V(s) — the central object of actor-critic.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Training Curve</h2>
<div id="rl7-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">REINFORCE on CartPole — characteristic high variance, but eventually solves.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Policy gradient learns π_θ(a|s) directly — handles continuous actions and stochastic policies.<br><strong>2.</strong> ∇J = E[Σ ∇ log π_θ(a_t|s_t) · G_t] — the policy gradient theorem.<br><strong>3.</strong> REINFORCE: roll out, compute G_t, gradient ascent on Σ log π · G.<br><strong>4.</strong> Pure REINFORCE has crippling variance.<br><strong>5.</strong> Baselines (mean-std normalize, V(s)) reduce variance without bias.<br><strong>6.</strong> Subtracting V(s) gives the advantage — the bridge to actor-critic.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:300}, (_,i)=>i+1);
  var ret = ep.map(function(e){var base = Math.min(500, 30 + Math.pow(e,1.05)); return Math.max(10, base + (Math.random()-0.5)*150);});
  var data = [{x:ep,y:ret,name:'Episode return',type:'scatter',mode:'lines',line:{color:T.accent,width:1.8}}];
  var layout = {title:'CartPole REINFORCE — return vs episode',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl7-plot-en','rl7-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Q-learning bir değer öğrenir, sonra politikayı türetir. Policy gradient tam tersini yapar — politikayı doğrudan öğrenir.</strong> Bu sürekli eylemler, stokastik politikalar ve (sonra) dil modellerinde RLHF için zorunlu olur.</p>
<p class="l-text">Bu derste policy gradient teoremini, REINFORCE'u, varyans problemini öğrenecek ve PyTorch'ta CartPole'da REINFORCE'u kodlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Policy gradient teoremini ve log-türev hilesini ifade etmeyi</li>
<li>Stokastik politikayı softmax veya Gaussian sinir ağıyla parametrelemeyi</li>
<li>REINFORCE'u uygulamayı — bölüm örnekle, getirileri hesapla, gradient adımı at</li>
<li>Getiriden çıkarılan durum-değeri baseline ile varyansı düşürmeyi</li>
<li>PyTorch'ta CartPole-v1 üstünde REINFORCE eğitmeyi ve öğrenme eğrisini çizmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Politikayı Neden Doğrudan Öğrenelim?</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sürekli eylemler</div><div class="card-body">Robot torku gerçek değerli. Sürekli a üzerinde argmax başlı başına bir optimizasyondur. (μ, σ) çıktılayan sinir ağı bunu atlatır.</div></div>
<div class="calc-card"><div class="card-title">Stokastik politikalar</div><div class="card-body">Kısmi gözlenebilirlik ve rekabetçi oyunlarda optimal politika rastgeledir. Q-learning deterministik argmax'a zorlar.</div></div>
<div class="calc-card"><div class="card-title">Doğrudan amaç</div><div class="card-body">Gerçekten önemsediğimizi optimize ederiz — beklenen getiri — vekil değil.</div></div>
<div class="calc-card"><div class="card-title">Pürüzsüz güncelleme</div><div class="card-body">θ'da küçük değişim → π'de küçük değişim. Q-learning'in argmax'ı zıplaktır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Parametreli Politikalar</h2>
<p class="l-text">π_θ(a|s) tanımla — sinir ağı ağırlıkları θ ile parametreli, eylemler üzerinde olasılık dağılımı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kesikli eylem</div><div class="card-body">Logit'ler üzerinde softmax: π_θ(a|s) = exp(f_θ(s)_a) / Σ exp(f_θ(s)_·).</div></div>
<div class="calc-card"><div class="card-title">Sürekli eylem</div><div class="card-body">Gauss: π_θ(a|s) = N(μ_θ(s), σ_θ(s)).</div></div>
</div>
<p class="l-text">Amaç: J(θ) = E_π[G_0]'ı maksimize et — politika altında beklenen getiri.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Policy Gradient Teoremi</h2>
<p class="l-text">Mucize: J ortama karmaşık şekilde bağlı olsa da gradyanı basit bir forma sahip.</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) = \\mathbb{E}_{\\pi_{\\theta}} \\left[ \\sum_{t} \\nabla_{\\theta} \\log \\pi_{\\theta}(a_t | s_t) \\cdot G_t \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">π_θ(a|s)</div><div class="card-body">s'de a eyleminin politika olasılığı.</div></div>
<div class="calc-card"><div class="card-title">∇ log π_θ(a|s)</div><div class="card-body">Skor fonksiyonu — bu eylemin olasılığını arttıran θ-uzayı yönü.</div></div>
<div class="calc-card"><div class="card-title">G_t</div><div class="card-body">t anından getiri. Ne kadar iteceğimizi söyleyen "ağırlık".</div></div>
</div>
<p class="l-text">Sezgi: a eylemi yüksek getiriye yol açtıysa π(a|s)'i arttır; düşükse azalt. Bu tahmine stokastik gradyan tırmanışı = REINFORCE.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. REINFORCE Algoritması</h2>
<p class="l-text">Williams 1992. Saf Monte Carlo policy gradient.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">π_θ ile tam bir bölüm yürüt.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">Her adım için G_t getirilerini hesapla.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">Bölüm boyunca (log π × G) toplamı = kayıp (tırmanış için negatif).</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">Backprop, gradyan adımı, tekrar et.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CartPole'da PyTorch REINFORCE</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical
<span class="kw">import</span> numpy <span class="kw">as</span> np

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)

<span class="kw">class</span> <span class="fn">Policy</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.net = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>))
    <span class="kw">def</span> <span class="fn">forward</span>(self, s): <span class="kw">return</span> self.<span class="fn">net</span>(s)

pi = <span class="fn">Policy</span>()
opt = torch.optim.<span class="fn">Adam</span>(pi.<span class="fn">parameters</span>(), lr=<span class="num">1e-2</span>)
gamma = <span class="num">0.99</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>):
    s, _ = env.<span class="fn">reset</span>()
    log_probs, rewards = [], []
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        logits = <span class="fn">pi</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32))
        dist = <span class="fn">Categorical</span>(logits=logits)
        a = dist.<span class="fn">sample</span>()
        log_probs.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a))
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        rewards.<span class="fn">append</span>(r); done = term <span class="kw">or</span> trunc

    <span class="cm"># Getiriler G_t</span>
    G, returns = <span class="num">0</span>, []
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">reversed</span>(rewards):
        G = r + gamma * G
        returns.<span class="fn">insert</span>(<span class="num">0</span>, G)
    returns = torch.<span class="fn">tensor</span>(returns, dtype=torch.float32)
    returns = (returns - returns.<span class="fn">mean</span>()) / (returns.<span class="fn">std</span>() + <span class="num">1e-8</span>)  <span class="cm"># baseline</span>

    loss = -torch.<span class="fn">stack</span>([lp * G <span class="kw">for</span> lp, G <span class="kw">in</span> <span class="fn">zip</span>(log_probs, returns)]).<span class="fn">sum</span>()
    opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()

    <span class="kw">if</span> ep % <span class="num">20</span> == <span class="num">0</span>:
        <span class="fn">print</span>(f<span class="str">"ep={ep} getiri={sum(rewards):.0f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">REINFORCE in pure numpy on a 2-state, 2-action MDP. Softmax policy + manual gradient.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((2, 2))                             # state × action logits
def policy(s):
    p = np.exp(theta[s]); return p / p.sum()
def step(s, a):
    ns = 1 - s if a == 1 else s
    r  = 1.0 if ns == 1 and s == 0 else 0.0
    return ns, r
for ep in range(2000):
    s = 0; traj = []
    for _ in range(5):
        p = policy(s); a = int(rng.choice(2, p=p))
        ns, r = step(s, a); traj.append((s, a, r)); s = ns
    G = sum(r for _,_,r in traj)
    for s, a, _ in traj:
        p = policy(s); grad = -p; grad[a] += 1
        theta[s] += 0.05 * G * grad
print('Final policy(s=0):', np.round(policy(0), 3), '   policy(s=1):', np.round(policy(1), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Akışı izleyelim:</strong> 1) Politika 2 eylem üzerinde logit çıktılayan bir MLP. 2) Her bölüm: kategoriden eylem örnekle, log-prob'ları ve ödülleri sakla. 3) İndirgenmiş G_t'leri geriye doğru hesapla. 4) Getirileri standartlaştır (ortalamayı çıkar, std'ye böl) — varyansı dramatik azaltan basit bir baseline. 5) Kayıp = − Σ log π(a_t|s_t) · G_t (tırmandığımız için negatif). 6) Backprop. CartPole 300–500 bölüm civarı çözülür.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Varyans Problemi</h2>
<p class="l-text">REINFORCE çalışır ama gürültülüdür. G_t birçok rastgele ödül toplar, gradyan tahmini çok yüksek varyanslı — farklı koşular vahşice farklı eğriler verir. Standart çareler:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Baseline b(s)</div><div class="card-body">Duruma bağlı baseline çıkar: ∇ log π · (G_t − b(s)). Tahminciyi yanlamaz.</div></div>
<div class="calc-card"><div class="card-title">Reward-to-go</div><div class="card-body">Her adım için tüm bölüm getirisi yerine sadece gelecek ödülleri kullan.</div></div>
<div class="calc-card"><div class="card-title">Actor-Critic</div><div class="card-body">Öğrenilmiş V(s)'i baseline olarak kullan — A2C/A3C/PPO'ya götürür. Sıradaki ders.</div></div>
<div class="calc-card"><div class="card-title">Standartlaştırma</div><div class="card-body">Batch başı getirileri normalize et. Yukarıda kullandığımız hile.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Baseline Eklemek Neden Gradyanı Yanlamaz?</h2>
<p class="l-text">Çünkü E[∇ log π(a|s) · b(s)] = b(s) · ∇ Σ_a π(a|s) = b(s) · ∇ 1 = 0. b(s) çıkarmak varyansı düşürür ama beklenen gradyanı değiştirmez. b(s) = V(s) olunca ağırlık avantaj A(s,a) = Q(s,a) − V(s) olur — actor-critic'in merkez nesnesi.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Eğitim Eğrisi</h2>
<div id="rl7-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">CartPole'da REINFORCE — karakteristik yüksek varyans ama nihayetinde çözer.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Policy gradient π_θ(a|s)'i doğrudan öğrenir — sürekli eylemleri ve stokastik politikaları yönetir.<br><strong>2.</strong> ∇J = E[Σ ∇ log π_θ(a_t|s_t) · G_t] — policy gradient teoremi.<br><strong>3.</strong> REINFORCE: yürüt, G_t hesapla, Σ log π · G üzerinde gradyan tırmanışı.<br><strong>4.</strong> Saf REINFORCE'un sakatlayıcı bir varyansı vardır.<br><strong>5.</strong> Baseline'lar (ort-std normalize, V(s)) yanlılaştırmadan varyansı düşürür.<br><strong>6.</strong> V(s) çıkarmak avantajı verir — actor-critic'e köprü.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
