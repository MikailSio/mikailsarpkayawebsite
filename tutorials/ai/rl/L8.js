window.RL_L8 = {

en: `<p class="l-text"><strong>Actor-Critic combines the best of both worlds: a policy network that decides what to do (the actor) plus a value network that critiques those decisions (the critic).</strong> This combination cuts variance dramatically and is the foundation of A2C, A3C, GAE, and PPO.</p>
<p class="l-text">In this lesson you will learn the actor-critic architecture, the advantage function, GAE, and code A2C from scratch in PyTorch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Combine an actor policy network with a critic value network in one model</li>
<li>Compute the advantage A(s, a) = Q(s, a) - V(s) and use it in the policy loss</li>
<li>Implement Generalized Advantage Estimation (GAE) for low-variance advantage</li>
<li>Code A2C from scratch in PyTorch and train it on CartPole or LunarLander</li>
<li>Compare synchronous A2C with asynchronous A3C in throughput and stability</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Two-Network Architecture</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Actor π_θ(a|s)</div><div class="card-body">Policy network — picks actions. Same as REINFORCE.</div></div>
<div class="calc-card"><div class="card-title">Critic V_φ(s)</div><div class="card-body">Value network — estimates how good a state is. Trained via TD.</div></div>
</div>
<p class="l-text">The critic gives the actor a low-variance feedback signal: "is this state better than average?" That is the advantage.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Advantage Function</h2>
<p class="l-text">A(s,a) = Q(s,a) − V(s). It measures how much better a is than average behavior at s.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A(s,a) &gt; 0</div><div class="card-body">a is better than typical — increase its probability.</div></div>
<div class="calc-card"><div class="card-title">A(s,a) &lt; 0</div><div class="card-body">a is worse than typical — decrease its probability.</div></div>
<div class="calc-card"><div class="card-title">A(s,a) ≈ 0</div><div class="card-body">a is average — no update needed.</div></div>
</div>
<p class="l-text">The actor update becomes:</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) = \\mathbb{E}\\left[ \\nabla_{\\theta} \\log \\pi_{\\theta}(a|s) \\cdot A(s,a) \\right]$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. One-Step Advantage Estimate</h2>
<p class="l-text">Q(s,a) is unknown. Use the TD residual as a one-step Monte Carlo estimate of A:</p>
<div class="katex-block">$$\\hat{A}(s_t, a_t) = r_{t+1} + \\gamma V_{\\phi}(s_{t+1}) - V_{\\phi}(s_t)$$</div>
<p class="l-text">This is exactly the TD error δ_t. It is a 1-step bootstrap, low variance, slightly biased.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Two Losses, One Optimizer</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Actor loss</div><div class="card-body">L_π = − E[ log π_θ(a|s) · Â ] (negate to ascend).</div></div>
<div class="calc-card"><div class="card-title">Critic loss</div><div class="card-body">L_V = E[ (r + γ V_φ(s') − V_φ(s))^2 ] — MSE TD error.</div></div>
<div class="calc-card"><div class="card-title">Entropy bonus</div><div class="card-body">+β H(π_θ(·|s)) keeps the policy from collapsing too quickly.</div></div>
</div>
<p class="l-text">Total loss = L_π + c_v · L_V − β · H. Minimize with one Adam step.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A2C vs A3C</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A3C (2016)</div><div class="card-body">Asynchronous Advantage Actor-Critic. Many parallel workers, each with own env, send gradients to a shared net asynchronously. CPU-friendly.</div></div>
<div class="calc-card"><div class="card-title">A2C</div><div class="card-body">Synchronous version. Workers run in lockstep, gradient averaged across them. GPU-friendly, simpler, often better.</div></div>
</div>
<p class="l-text">In practice the modern recipe is A2C-style synchronous rollouts plus PPO clipping (next lesson).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Generalized Advantage Estimation (GAE)</h2>
<p class="l-text">Schulman 2016. Trade off bias and variance with a single knob λ ∈ [0,1]:</p>
<div class="katex-block">$$\\hat{A}^{GAE}_t = \\sum_{l=0}^{\\infty} (\\gamma \\lambda)^l \\delta_{t+l}$$</div>
<p class="l-text">where δ_t = r_{t+1} + γ V(s_{t+1}) − V(s_t). λ=0 → pure 1-step TD (low variance, biased); λ=1 → pure Monte Carlo (unbiased, high variance). λ=0.95 is a great default and is what PPO uses.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. PyTorch A2C on CartPole</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)

<span class="kw">class</span> <span class="fn">ActorCritic</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.shared = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>())
        self.actor = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>)
        self.critic = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, s):
        h = self.<span class="fn">shared</span>(s)
        <span class="kw">return</span> self.<span class="fn">actor</span>(h), self.<span class="fn">critic</span>(h).<span class="fn">squeeze</span>(-<span class="num">1</span>)

ac = <span class="fn">ActorCritic</span>()
opt = torch.optim.<span class="fn">Adam</span>(ac.<span class="fn">parameters</span>(), lr=<span class="num">3e-3</span>)
gamma = <span class="num">0.99</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s, _ = env.<span class="fn">reset</span>()
    log_probs, values, rewards, entropies = [], [], [], []
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        logits, v = <span class="fn">ac</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32))
        dist = <span class="fn">Categorical</span>(logits=logits)
        a = dist.<span class="fn">sample</span>()
        log_probs.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a))
        values.<span class="fn">append</span>(v)
        entropies.<span class="fn">append</span>(dist.<span class="fn">entropy</span>())
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        rewards.<span class="fn">append</span>(r); done = term <span class="kw">or</span> trunc

    <span class="cm"># Compute returns and advantages</span>
    R = <span class="num">0</span>; returns = []
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">reversed</span>(rewards):
        R = r + gamma * R
        returns.<span class="fn">insert</span>(<span class="num">0</span>, R)
    returns = torch.<span class="fn">tensor</span>(returns, dtype=torch.float32)
    values_t = torch.<span class="fn">stack</span>(values)
    advantages = returns - values_t.<span class="fn">detach</span>()

    actor_loss = -(torch.<span class="fn">stack</span>(log_probs) * advantages).<span class="fn">mean</span>()
    critic_loss = nn.functional.<span class="fn">mse_loss</span>(values_t, returns)
    entropy_loss = -torch.<span class="fn">stack</span>(entropies).<span class="fn">mean</span>()
    loss = actor_loss + <span class="num">0.5</span> * critic_loss + <span class="num">0.01</span> * entropy_loss

    opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="kw">if</span> ep % <span class="num">20</span> == <span class="num">0</span>: <span class="fn">print</span>(f<span class="str">"ep={ep} return={sum(rewards):.0f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Actor-Critic in numpy: shared linear features, separate policy + value heads.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((3, 2))                # 3 states × 2 actions
V = np.zeros(3)
def policy(s):
    p = np.exp(theta[s]); return p / p.sum()
def env(s, a):
    ns = min(2, s + 1) if a == 1 else max(0, s - 1)
    return ns, (1.0 if ns == 2 else -0.05), ns == 2
for ep in range(1500):
    s, done = 0, False
    while not done:
        p = policy(s); a = int(rng.choice(2, p=p))
        ns, r, done = env(s, a)
        td = r + (0 if done else 0.9 * V[ns]) - V[s]
        V[s] += 0.1 * td
        grad = -p; grad[a] += 1
        theta[s] += 0.05 * td * grad
        s = ns
print('V:', np.round(V, 3))
print('policy(0):', np.round(policy(0), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) One network with shared trunk, two heads (actor logits + critic V). 2) Roll out an episode storing log-probs, values, rewards, entropies. 3) Compute Monte Carlo returns. 4) Advantage = returns − V (note .detach() — critic's gradient should flow through critic loss only). 5) Three losses: −log π · A (actor), MSE(V, returns) (critic), −H (entropy bonus to keep exploring). 6) Combine and step. CartPole solves in ~150 episodes — much faster than REINFORCE.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Why Actor-Critic Beats REINFORCE</h2>
<div id="rl8-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">The critic acts as a smart baseline that adapts to the state, dramatically lowering gradient variance and speeding up learning.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Actor-critic = policy net + value net.<br><strong>2.</strong> Advantage A(s,a) = Q(s,a) − V(s) — direction and magnitude for actor update.<br><strong>3.</strong> 1-step advantage = TD error δ.<br><strong>4.</strong> A2C is synchronous; A3C is async; A2C is the modern default.<br><strong>5.</strong> GAE blends 1-step and Monte Carlo with λ — typical λ=0.95.<br><strong>6.</strong> Loss = actor + c_v · critic − β · entropy.<br><strong>7.</strong> Foundation for PPO, the modern workhorse.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:200}, (_,i)=>i+1);
  var reinf = ep.map(function(e){return Math.min(500, 30 + e*1.5) + (Math.random()-0.5)*120;});
  var ac = ep.map(function(e){return Math.min(500, 30 + e*3) + (Math.random()-0.5)*40;});
  var data = [
    {x:ep,y:reinf,name:'REINFORCE',type:'scatter',mode:'lines',line:{color:'#888',width:1.6}},
    {x:ep,y:ac,name:'A2C',type:'scatter',mode:'lines',line:{color:T.accent,width:2}}
  ];
  var layout = {title:'CartPole — A2C vs REINFORCE',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl8-plot-en','rl8-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Actor-Critic iki dünyanın en iyilerini birleştirir: ne yapacağına karar veren bir politika ağı (actor) artı bu kararları eleştiren bir değer ağı (critic).</strong> Bu kombinasyon varyansı dramatik azaltır ve A2C, A3C, GAE ve PPO'nun zeminidir.</p>
<p class="l-text">Bu derste actor-critic mimarisini, avantaj fonksiyonunu, GAE'yi öğrenecek ve PyTorch'ta sıfırdan A2C kodlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tek bir modelde actor politika ağı ile critic değer ağını birleştirmeyi</li>
<li>Avantajı A(s, a) = Q(s, a) - V(s) olarak hesaplayıp politika kaybında kullanmayı</li>
<li>Düşük varyanslı avantaj için Generalized Advantage Estimation (GAE) uygulamayı</li>
<li>PyTorch'ta sıfırdan A2C kodlamayı ve CartPole veya LunarLander'da eğitmeyi</li>
<li>Senkron A2C ile asenkron A3C'yi verimlilik ve istikrar açısından karşılaştırmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İki Ağlı Mimari</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Actor π_θ(a|s)</div><div class="card-body">Politika ağı — eylem seçer. REINFORCE ile aynı.</div></div>
<div class="calc-card"><div class="card-title">Critic V_φ(s)</div><div class="card-body">Değer ağı — bir durumun ne kadar iyi olduğunu tahmin eder. TD ile eğitilir.</div></div>
</div>
<p class="l-text">Critic, actor'a düşük-varyanslı geri bildirim verir: "bu durum ortalamadan iyi mi?" İşte avantaj bu.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Avantaj Fonksiyonu</h2>
<p class="l-text">A(s,a) = Q(s,a) − V(s). a'nın s'deki tipik davranıştan ne kadar iyi olduğunu ölçer.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A(s,a) &gt; 0</div><div class="card-body">a tipikten iyi — olasılığını arttır.</div></div>
<div class="calc-card"><div class="card-title">A(s,a) &lt; 0</div><div class="card-body">a tipikten kötü — olasılığını azalt.</div></div>
<div class="calc-card"><div class="card-title">A(s,a) ≈ 0</div><div class="card-body">a ortalama — güncelleme gerekmez.</div></div>
</div>
<p class="l-text">Actor güncellemesi olur:</p>
<div class="katex-block">$$\\nabla_{\\theta} J(\\theta) = \\mathbb{E}\\left[ \\nabla_{\\theta} \\log \\pi_{\\theta}(a|s) \\cdot A(s,a) \\right]$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tek-Adım Avantaj Tahmini</h2>
<p class="l-text">Q(s,a) bilinmez. A için tek-adım Monte Carlo tahmini olarak TD kalanını kullan:</p>
<div class="katex-block">$$\\hat{A}(s_t, a_t) = r_{t+1} + \\gamma V_{\\phi}(s_{t+1}) - V_{\\phi}(s_t)$$</div>
<p class="l-text">Bu tam olarak TD hatası δ_t. 1-adım bootstrap, düşük varyans, hafif yanlı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İki Kayıp, Tek Optimizer</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Actor kaybı</div><div class="card-body">L_π = − E[ log π_θ(a|s) · Â ] (tırmanmak için negatif).</div></div>
<div class="calc-card"><div class="card-title">Critic kaybı</div><div class="card-body">L_V = E[ (r + γ V_φ(s') − V_φ(s))^2 ] — MSE TD hatası.</div></div>
<div class="calc-card"><div class="card-title">Entropi bonusu</div><div class="card-body">+β H(π_θ(·|s)) politikayı çok hızlı çökmekten korur.</div></div>
</div>
<p class="l-text">Toplam kayıp = L_π + c_v · L_V − β · H. Tek Adam adımıyla minimize et.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A2C vs A3C</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A3C (2016)</div><div class="card-body">Asenkron Avantaj Actor-Critic. Birçok paralel işçi, her biri kendi ortamında, asenkron olarak paylaşılan ağa gradyan gönderir. CPU dostu.</div></div>
<div class="calc-card"><div class="card-title">A2C</div><div class="card-body">Senkron versiyon. İşçiler aynı anda yürür, gradyan ortalanır. GPU dostu, daha basit, çoğu zaman daha iyi.</div></div>
</div>
<p class="l-text">Pratikte modern tarif A2C-tarzı senkron yürütme + PPO kırpma (sıradaki ders).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Generalized Advantage Estimation (GAE)</h2>
<p class="l-text">Schulman 2016. Tek bir λ ∈ [0,1] düğmesiyle yanlılık ve varyans dengelenir:</p>
<div class="katex-block">$$\\hat{A}^{GAE}_t = \\sum_{l=0}^{\\infty} (\\gamma \\lambda)^l \\delta_{t+l}$$</div>
<p class="l-text">δ_t = r_{t+1} + γ V(s_{t+1}) − V(s_t). λ=0 → saf 1-adım TD (düşük varyans, yanlı); λ=1 → saf Monte Carlo (yansız, yüksek varyans). λ=0.95 mükemmel bir varsayılan ve PPO'nun kullandığıdır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. CartPole'da PyTorch A2C</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)

<span class="kw">class</span> <span class="fn">ActorCritic</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.shared = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(<span class="num">4</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>())
        self.actor = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">2</span>)
        self.critic = nn.<span class="fn">Linear</span>(<span class="num">128</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, s):
        h = self.<span class="fn">shared</span>(s)
        <span class="kw">return</span> self.<span class="fn">actor</span>(h), self.<span class="fn">critic</span>(h).<span class="fn">squeeze</span>(-<span class="num">1</span>)

ac = <span class="fn">ActorCritic</span>()
opt = torch.optim.<span class="fn">Adam</span>(ac.<span class="fn">parameters</span>(), lr=<span class="num">3e-3</span>)
gamma = <span class="num">0.99</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s, _ = env.<span class="fn">reset</span>()
    log_probs, values, rewards, entropies = [], [], [], []
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        logits, v = <span class="fn">ac</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32))
        dist = <span class="fn">Categorical</span>(logits=logits)
        a = dist.<span class="fn">sample</span>()
        log_probs.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a))
        values.<span class="fn">append</span>(v)
        entropies.<span class="fn">append</span>(dist.<span class="fn">entropy</span>())
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        rewards.<span class="fn">append</span>(r); done = term <span class="kw">or</span> trunc

    <span class="cm"># Getiriler ve avantajlar</span>
    R = <span class="num">0</span>; returns = []
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">reversed</span>(rewards):
        R = r + gamma * R
        returns.<span class="fn">insert</span>(<span class="num">0</span>, R)
    returns = torch.<span class="fn">tensor</span>(returns, dtype=torch.float32)
    values_t = torch.<span class="fn">stack</span>(values)
    advantages = returns - values_t.<span class="fn">detach</span>()

    actor_loss = -(torch.<span class="fn">stack</span>(log_probs) * advantages).<span class="fn">mean</span>()
    critic_loss = nn.functional.<span class="fn">mse_loss</span>(values_t, returns)
    entropy_loss = -torch.<span class="fn">stack</span>(entropies).<span class="fn">mean</span>()
    loss = actor_loss + <span class="num">0.5</span> * critic_loss + <span class="num">0.01</span> * entropy_loss

    opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="kw">if</span> ep % <span class="num">20</span> == <span class="num">0</span>: <span class="fn">print</span>(f<span class="str">"ep={ep} getiri={sum(rewards):.0f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Actor-Critic in numpy: shared linear features, separate policy + value heads.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((3, 2))                # 3 states × 2 actions
V = np.zeros(3)
def policy(s):
    p = np.exp(theta[s]); return p / p.sum()
def env(s, a):
    ns = min(2, s + 1) if a == 1 else max(0, s - 1)
    return ns, (1.0 if ns == 2 else -0.05), ns == 2
for ep in range(1500):
    s, done = 0, False
    while not done:
        p = policy(s); a = int(rng.choice(2, p=p))
        ns, r, done = env(s, a)
        td = r + (0 if done else 0.9 * V[ns]) - V[s]
        V[s] += 0.1 * td
        grad = -p; grad[a] += 1
        theta[s] += 0.05 * td * grad
        s = ns
print('V:', np.round(V, 3))
print('policy(0):', np.round(policy(0), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Kodu okumak:</strong> 1) Paylaşımlı gövdeli tek ağ, iki başlık (actor logit + critic V). 2) Bir bölümü yürütüp log-prob, değer, ödül, entropi sakla. 3) Monte Carlo getirilerini hesapla. 4) Avantaj = getiri − V (.detach() önemli — critic'in gradyanı yalnızca critic kaybından akmalı). 5) Üç kayıp: −log π · A (actor), MSE(V, returns) (critic), −H (keşfi sürdüren entropi bonusu). 6) Birleştir ve adım at. CartPole ~150 bölümde çözülür — REINFORCE'tan çok hızlı.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Actor-Critic REINFORCE'u Neden Yener?</h2>
<div id="rl8-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Critic duruma uyarlanan akıllı bir baseline gibi davranır, gradyan varyansını dramatik azaltır ve öğrenmeyi hızlandırır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Actor-critic = politika ağı + değer ağı.<br><strong>2.</strong> Avantaj A(s,a) = Q(s,a) − V(s) — actor güncellemesi için yön ve büyüklük.<br><strong>3.</strong> 1-adım avantaj = TD hatası δ.<br><strong>4.</strong> A2C senkron; A3C asenkron; A2C modern varsayılan.<br><strong>5.</strong> GAE 1-adım ile Monte Carlo'yu λ ile harmanlar — tipik λ=0.95.<br><strong>6.</strong> Kayıp = actor + c_v · critic − β · entropi.<br><strong>7.</strong> PPO için zemin — modern iş gücü.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
