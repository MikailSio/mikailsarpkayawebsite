window.RL_L9 = {

en: `<p class="l-text"><strong>PPO is the algorithm OpenAI used to train ChatGPT, the algorithm DeepMind uses for many tasks, and the workhorse of modern RL.</strong> It is so reliable and so easy to tune that it has become the default choice for almost every continuous and discrete control problem.</p>
<p class="l-text">In this lesson you will learn the trust region idea, the clipped surrogate objective, the full PPO algorithm, and use Stable Baselines3 plus a from-scratch PyTorch implementation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Motivate the trust region idea behind TRPO and PPO</li>
<li>Build the importance-sampling ratio and the clipped surrogate objective</li>
<li>Run the full PPO loop — collect rollouts, compute GAE, take K minibatch epochs</li>
<li>Tune key PPO hyperparameters: clip epsilon, entropy bonus, learning rate</li>
<li>Train PPO on LunarLander with both Stable Baselines3 and a from-scratch PyTorch port</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why PPO?</h2>
<p class="l-text">Vanilla policy gradient takes one step per rollout — wasteful. We would like to do many gradient steps on the same batch. But if we update too aggressively the new policy diverges from the data-generating policy, the gradient estimate becomes invalid, and training collapses. PPO is a simple, robust answer to "how aggressive can each update be?"</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Importance Sampling Ratio</h2>
<p class="l-text">When we reuse old data to update a new policy, we need to reweight by the ratio of probabilities:</p>
<div class="katex-block">$$r_t(\\theta) = \\frac{\\pi_{\\theta}(a_t | s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t | s_t)}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">r_t = 1</div><div class="card-body">New policy assigns same probability as old.</div></div>
<div class="calc-card"><div class="card-title">r_t &gt; 1</div><div class="card-body">New policy is more likely to take a_t than old.</div></div>
<div class="calc-card"><div class="card-title">r_t &lt; 1</div><div class="card-body">New policy is less likely to take a_t than old.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Clipped Surrogate Objective</h2>
<p class="l-text">PPO maximizes:</p>
<div class="katex-block">$$L^{CLIP}(\\theta) = \\mathbb{E}_t \\left[ \\min \\left( r_t(\\theta) A_t,\\ \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon) A_t \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A_t</div><div class="card-body">Advantage estimate (typically GAE with λ=0.95).</div></div>
<div class="calc-card"><div class="card-title">ε</div><div class="card-body">Clip threshold, typically 0.2 — limits how much r_t can move.</div></div>
<div class="calc-card"><div class="card-title">min(...)</div><div class="card-body">Pessimistic — picks the smaller (less optimistic) term.</div></div>
</div>
<p class="l-text">Intuition: if A_t &gt; 0 and r_t already &gt; 1+ε, the clipped term flattens the gradient — no incentive to push r even higher. If A_t &lt; 0 and r_t already &lt; 1−ε, same flattening. The result: we cannot make catastrophically large policy updates from a single batch.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Why Clip Instead of KL Penalty?</h2>
<p class="l-text">TRPO (PPO's predecessor) used a hard KL-divergence constraint via second-order optimization — slow and finicky. PPO replaces it with a first-order clipped surrogate. The clip approximately enforces a trust region but only requires Adam. Schulman 2017 showed PPO matches TRPO's stability while being implementation-friendly. The community took it from there.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Full PPO Algorithm</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">Roll out N steps with current policy π_θ_old.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">Compute advantages with GAE.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">For K epochs, in mini-batches: compute L^CLIP + critic loss + entropy bonus, Adam step.</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">Set θ_old ← θ. Repeat.</div></div>
</div>
<p class="l-text">Typical hyperparameters: N=2048, K=10, mini-batch=64, ε=0.2, lr=3e-4, λ=0.95, γ=0.99.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. PPO with Stable Baselines3 (5 Lines)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> stable_baselines3 <span class="kw">import</span> PPO
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>)
model = <span class="fn">PPO</span>(<span class="str">"MlpPolicy"</span>, env, verbose=<span class="num">1</span>, learning_rate=<span class="num">3e-4</span>)
model.<span class="fn">learn</span>(total_timesteps=<span class="num">200_000</span>)
model.<span class="fn">save</span>(<span class="str">"ppo_lunar"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Stable Baselines3 / Gym are blocked. PPO is conceptually a clipped policy-gradient — we run it in numpy on a 3-state MDP.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((3, 2)); old = theta.copy()
def pi(t, s):
    p = np.exp(t[s]); return p / p.sum()
def env(s, a):
    ns = min(2, s + 1) if a == 1 else max(0, s - 1)
    return ns, (1.0 if ns == 2 else -0.05), ns == 2
EPS = 0.2
for ep in range(1000):
    s, traj = 0, []
    while True:
        a = int(rng.choice(2, p=pi(theta, s)))
        ns, r, done = env(s, a)
        traj.append((s, a, r)); s = ns
        if done: break
    G = sum(r for _,_,r in traj)
    for s, a, _ in traj:
        ratio = pi(theta, s)[a] / max(pi(old, s)[a], 1e-6)
        clipped = float(np.clip(ratio, 1-EPS, 1+EPS))
        grad = -pi(theta, s); grad[a] += 1
        theta[s] += 0.02 * min(ratio, clipped) * G * grad
    old = theta.copy()
print('Final policy(0):', np.round(pi(theta, 0), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Create LunarLander environment. 2) Instantiate PPO with default MLP architecture and lr=3e-4. 3) Train for 200k env steps — typically reaches mean episode reward &gt; 200 (solved). 4) Save the model. SB3 hides all the GAE, clipping, and minibatching machinery.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. PPO from Scratch in PyTorch</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical
<span class="kw">import</span> numpy <span class="kw">as</span> np

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)
S, A = <span class="num">4</span>, <span class="num">2</span>

<span class="kw">class</span> <span class="fn">AC</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.body = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(S,<span class="num">64</span>), nn.<span class="fn">Tanh</span>(), nn.<span class="fn">Linear</span>(<span class="num">64</span>,<span class="num">64</span>), nn.<span class="fn">Tanh</span>())
        self.actor = nn.<span class="fn">Linear</span>(<span class="num">64</span>, A); self.critic = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">body</span>(x); <span class="kw">return</span> self.<span class="fn">actor</span>(h), self.<span class="fn">critic</span>(h).<span class="fn">squeeze</span>(-<span class="num">1</span>)

ac = <span class="fn">AC</span>(); opt = torch.optim.<span class="fn">Adam</span>(ac.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
GAMMA, LAM, EPS_CLIP, K_EPOCHS, BATCH = <span class="num">0.99</span>, <span class="num">0.95</span>, <span class="num">0.2</span>, <span class="num">10</span>, <span class="num">64</span>
N_STEPS = <span class="num">2048</span>

<span class="kw">def</span> <span class="fn">collect</span>():
    s, _ = env.<span class="fn">reset</span>()
    S_buf, A_buf, LP, R_buf, V_buf, D_buf = [], [], [], [], [], []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N_STEPS):
        st = torch.<span class="fn">tensor</span>(s, dtype=torch.float32)
        <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
            logits, v = <span class="fn">ac</span>(st)
            dist = <span class="fn">Categorical</span>(logits=logits); a = dist.<span class="fn">sample</span>()
        S_buf.<span class="fn">append</span>(s); A_buf.<span class="fn">append</span>(a.<span class="fn">item</span>()); LP.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a).<span class="fn">item</span>()); V_buf.<span class="fn">append</span>(v.<span class="fn">item</span>())
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        R_buf.<span class="fn">append</span>(r); D_buf.<span class="fn">append</span>(term <span class="kw">or</span> trunc)
        <span class="kw">if</span> term <span class="kw">or</span> trunc: s, _ = env.<span class="fn">reset</span>()
    <span class="kw">return</span> <span class="fn">map</span>(np.array, (S_buf, A_buf, LP, R_buf, V_buf, D_buf))

<span class="kw">def</span> <span class="fn">gae</span>(rewards, values, dones):
    adv = np.<span class="fn">zeros_like</span>(rewards, dtype=np.float32); last = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">reversed</span>(<span class="fn">range</span>(<span class="fn">len</span>(rewards))):
        next_v = <span class="num">0</span> <span class="kw">if</span> t == <span class="fn">len</span>(rewards)-<span class="num">1</span> <span class="kw">else</span> values[t+<span class="num">1</span>]
        delta = rewards[t] + GAMMA * next_v * (<span class="num">1</span>-dones[t]) - values[t]
        last = delta + GAMMA * LAM * (<span class="num">1</span>-dones[t]) * last
        adv[t] = last
    <span class="kw">return</span> adv, adv + values

<span class="kw">for</span> it <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    s_b, a_b, lp_b, r_b, v_b, d_b = <span class="fn">collect</span>()
    adv, ret = <span class="fn">gae</span>(r_b, v_b, d_b)
    adv = (adv - adv.<span class="fn">mean</span>()) / (adv.<span class="fn">std</span>() + <span class="num">1e-8</span>)
    s_t = torch.<span class="fn">tensor</span>(s_b, dtype=torch.float32); a_t = torch.<span class="fn">tensor</span>(a_b, dtype=torch.long)
    lp_old = torch.<span class="fn">tensor</span>(lp_b, dtype=torch.float32); adv_t = torch.<span class="fn">tensor</span>(adv, dtype=torch.float32)
    ret_t = torch.<span class="fn">tensor</span>(ret, dtype=torch.float32)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K_EPOCHS):
        idx = np.random.<span class="fn">permutation</span>(N_STEPS)
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, N_STEPS, BATCH):
            b = idx[i:i+BATCH]
            logits, v = <span class="fn">ac</span>(s_t[b])
            dist = <span class="fn">Categorical</span>(logits=logits)
            lp_new = dist.<span class="fn">log_prob</span>(a_t[b])
            ratio = torch.<span class="fn">exp</span>(lp_new - lp_old[b])
            surr1 = ratio * adv_t[b]
            surr2 = torch.<span class="fn">clamp</span>(ratio, <span class="num">1</span>-EPS_CLIP, <span class="num">1</span>+EPS_CLIP) * adv_t[b]
            actor_loss = -torch.<span class="fn">min</span>(surr1, surr2).<span class="fn">mean</span>()
            critic_loss = ((v - ret_t[b])**<span class="num">2</span>).<span class="fn">mean</span>()
            entropy = dist.<span class="fn">entropy</span>().<span class="fn">mean</span>()
            loss = actor_loss + <span class="num">0.5</span>*critic_loss - <span class="num">0.01</span>*entropy
            opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">"iter={it} mean_ret={ret.mean():.2f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PPO from scratch — same idea, with explicit advantage and clip ratio. Pure numpy, prints final policy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(1)
theta = np.zeros((4, 2))
V = np.zeros(4)
def pi(s):
    p = np.exp(theta[s]); return p / p.sum()
def step(s, a):
    ns = min(3, s+1) if a == 1 else max(0, s-1)
    return ns, (1.0 if ns == 3 else -0.05), ns == 3
for ep in range(800):
    traj, s = [], 0
    for _ in range(10):
        a = int(rng.choice(2, p=pi(s)))
        ns, r, done = step(s, a)
        traj.append((s, a, r, ns, done)); s = ns
        if done: break
    for s, a, r, ns, done in traj:
        adv = r + (0 if done else 0.9*V[ns]) - V[s]
        V[s] += 0.1 * adv
        grad = -pi(s); grad[a] += 1
        theta[s] += 0.02 * np.clip(adv, -0.2, 0.2) * grad
print('V:', np.round(V, 3))
print('Greedy action per state:', [int(np.argmax(pi(s))) for s in range(4)])</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build a shared-trunk actor-critic. 2) Each iteration collect 2048 transitions (resetting on done). 3) Compute GAE advantages and returns from values + rewards + done flags. 4) Standardize advantages. 5) For 10 epochs in mini-batches of 64: forward pass, compute new log-probs, ratio = exp(new − old), clip the surrogate, combine with critic MSE and entropy bonus, Adam step. 6) After ~50 iters CartPole is fully solved.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PPO Effectiveness</h2>
<div id="rl9-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">PPO learns much faster and more stably than REINFORCE or A2C, especially on harder tasks like LunarLander or MuJoCo robotics.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where PPO Goes Next</h2>
<p class="l-text">PPO is the engine that drives RLHF — the same clipped objective, with a learned reward model + KL regularizer to a reference policy, is exactly how InstructGPT and ChatGPT were aligned. Lesson 10 connects this all together.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> PPO improves on vanilla PG by reusing data with a trust-region-like clip.<br><strong>2.</strong> Importance ratio r_t = π_θ(a|s) / π_θ_old(a|s).<br><strong>3.</strong> L^CLIP = E[ min(r·A, clip(r,1−ε,1+ε)·A) ].<br><strong>4.</strong> ε ≈ 0.2, K ≈ 10 epochs, GAE λ ≈ 0.95.<br><strong>5.</strong> Stable Baselines3 gives you PPO in 5 lines.<br><strong>6.</strong> The same algorithm trained ChatGPT — RLHF in lesson 10.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:100}, (_,i)=>(i+1)*5);
  var ppo = ep.map(function(e,i){return Math.min(500, 30 + i*5.5) + (Math.random()-0.5)*25;});
  var a2c = ep.map(function(e,i){return Math.min(500, 30 + i*4) + (Math.random()-0.5)*45;});
  var reinf = ep.map(function(e,i){return Math.min(500, 30 + i*2.5) + (Math.random()-0.5)*100;});
  var data = [
    {x:ep,y:reinf,name:'REINFORCE',type:'scatter',mode:'lines',line:{color:'#888',width:1.5}},
    {x:ep,y:a2c,name:'A2C',type:'scatter',mode:'lines',line:{color:'#88e',width:1.8}},
    {x:ep,y:ppo,name:'PPO',type:'scatter',mode:'lines',line:{color:T.accent,width:2.2}}
  ];
  var layout = {title:'CartPole — PPO vs A2C vs REINFORCE',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl9-plot-en','rl9-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>PPO, OpenAI'nin ChatGPT'yi eğittiği, DeepMind'in birçok görevde kullandığı ve modern RL'in iş gücü olan algoritmadır.</strong> O kadar güvenilir ve ayar yapması o kadar kolaydır ki neredeyse her sürekli ve kesikli kontrol probleminde varsayılan tercih olmuştur.</p>
<p class="l-text">Bu derste güven bölgesi fikrini, kırpılmış vekil amacı, tüm PPO algoritmasını öğrenecek ve Stable Baselines3 artı sıfırdan PyTorch uygulamasını kullanacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>TRPO ve PPO'nun arkasındaki güven bölgesi (trust region) fikrini gerekçelendirmeyi</li>
<li>Önemli örnekleme oranını ve kırpılmış (clipped) vekil amacı kurmayı</li>
<li>Tüm PPO döngüsünü çalıştırmayı — rollout topla, GAE hesapla, K mini-batch epoch yap</li>
<li>Kritik PPO hiperparametrelerini ayarlamayı: clip epsilon, entropi bonusu, learning rate</li>
<li>Hem Stable Baselines3 hem sıfırdan PyTorch portu ile LunarLander'da PPO eğitmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. PPO Neden?</h2>
<p class="l-text">Saf policy gradient yürütme başına tek adım atar — savurganca. Aynı batch üzerinde çok gradyan adımı atmak isteriz. Ama çok agresif güncellersek yeni politika veri-üreten politikadan ayrılır, gradyan tahmini geçersizleşir ve eğitim çöker. PPO, "her güncelleme ne kadar agresif olabilir?" sorusuna basit, sağlam bir cevap.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Önem Örnekleme Oranı</h2>
<p class="l-text">Eski veriyi yeni politikayı güncellemek için tekrar kullandığımızda olasılıklar oranıyla yeniden ağırlıklandırırız:</p>
<div class="katex-block">$$r_t(\\theta) = \\frac{\\pi_{\\theta}(a_t | s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t | s_t)}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">r_t = 1</div><div class="card-body">Yeni politika eskiyle aynı olasılığı atar.</div></div>
<div class="calc-card"><div class="card-title">r_t &gt; 1</div><div class="card-body">Yeni politika a_t'yi eskiden daha çok seçer.</div></div>
<div class="calc-card"><div class="card-title">r_t &lt; 1</div><div class="card-body">Yeni politika a_t'yi eskiden daha az seçer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kırpılmış Vekil Amaç</h2>
<p class="l-text">PPO şunu maksimize eder:</p>
<div class="katex-block">$$L^{CLIP}(\\theta) = \\mathbb{E}_t \\left[ \\min \\left( r_t(\\theta) A_t,\\ \\text{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon) A_t \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A_t</div><div class="card-body">Avantaj tahmini (tipik GAE λ=0.95).</div></div>
<div class="calc-card"><div class="card-title">ε</div><div class="card-body">Kırpma eşiği, tipik 0.2 — r_t'nin ne kadar hareket edebileceğini sınırlar.</div></div>
<div class="calc-card"><div class="card-title">min(...)</div><div class="card-body">Karamsar — daha küçük (daha az iyimser) terimi seçer.</div></div>
</div>
<p class="l-text">Sezgi: A_t &gt; 0 ve r_t zaten &gt; 1+ε ise kırpılmış terim gradyanı düzleştirir — r'yi daha da yükseltmeye teşvik yok. A_t &lt; 0 ve r_t zaten &lt; 1−ε ise aynı düzleşme. Sonuç: tek bir batch'ten felaket büyüklükte politika güncellemesi yapamayız.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. KL Cezası Yerine Neden Kırpma?</h2>
<p class="l-text">TRPO (PPO'nun selefi) ikinci dereceli optimizasyonla sert KL-ıraksaklık kısıtı kullandı — yavaş ve titiz. PPO bunu birinci dereceli kırpılmış vekille değiştirir. Kırpma yaklaşık olarak güven bölgesini zorlar ama yalnızca Adam ister. Schulman 2017, PPO'nun TRPO'nun kararlılığını yakaladığını ama uygulama-dostu olduğunu gösterdi. Topluluk oradan aldı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tam PPO Algoritması</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1.</div><div class="card-body">Mevcut π_θ_old ile N adım yürüt.</div></div>
<div class="calc-card"><div class="card-title">2.</div><div class="card-body">GAE ile avantajları hesapla.</div></div>
<div class="calc-card"><div class="card-title">3.</div><div class="card-body">K epoch boyunca, mini-batch'lerde: L^CLIP + critic kaybı + entropi bonusu, Adam adımı.</div></div>
<div class="calc-card"><div class="card-title">4.</div><div class="card-body">θ_old ← θ. Tekrar et.</div></div>
</div>
<p class="l-text">Tipik hiperparametreler: N=2048, K=10, mini-batch=64, ε=0.2, lr=3e-4, λ=0.95, γ=0.99.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Stable Baselines3 ile PPO (5 Satır)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> stable_baselines3 <span class="kw">import</span> PPO
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>)
model = <span class="fn">PPO</span>(<span class="str">"MlpPolicy"</span>, env, verbose=<span class="num">1</span>, learning_rate=<span class="num">3e-4</span>)
model.<span class="fn">learn</span>(total_timesteps=<span class="num">200_000</span>)
model.<span class="fn">save</span>(<span class="str">"ppo_lunar"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Stable Baselines3 / Gym are blocked. PPO is conceptually a clipped policy-gradient — we run it in numpy on a 3-state MDP.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
theta = np.zeros((3, 2)); old = theta.copy()
def pi(t, s):
    p = np.exp(t[s]); return p / p.sum()
def env(s, a):
    ns = min(2, s + 1) if a == 1 else max(0, s - 1)
    return ns, (1.0 if ns == 2 else -0.05), ns == 2
EPS = 0.2
for ep in range(1000):
    s, traj = 0, []
    while True:
        a = int(rng.choice(2, p=pi(theta, s)))
        ns, r, done = env(s, a)
        traj.append((s, a, r)); s = ns
        if done: break
    G = sum(r for _,_,r in traj)
    for s, a, _ in traj:
        ratio = pi(theta, s)[a] / max(pi(old, s)[a], 1e-6)
        clipped = float(np.clip(ratio, 1-EPS, 1+EPS))
        grad = -pi(theta, s); grad[a] += 1
        theta[s] += 0.02 * min(ratio, clipped) * G * grad
    old = theta.copy()
print('Final policy(0):', np.round(pi(theta, 0), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Adım adım inceleyelim:</strong> 1) LunarLander ortamı oluştur. 2) Varsayılan MLP mimarisi ve lr=3e-4 ile PPO örnekle. 3) 200k ortam adımı eğit — tipik olarak ortalama bölüm ödülü &gt; 200 (çözülmüş). 4) Modeli kaydet. SB3 tüm GAE, kırpma ve mini-batch makinesini saklar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sıfırdan PyTorch'ta PPO</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> torch.distributions <span class="kw">import</span> Categorical
<span class="kw">import</span> numpy <span class="kw">as</span> np

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)
S, A = <span class="num">4</span>, <span class="num">2</span>

<span class="kw">class</span> <span class="fn">AC</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.body = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(S,<span class="num">64</span>), nn.<span class="fn">Tanh</span>(), nn.<span class="fn">Linear</span>(<span class="num">64</span>,<span class="num">64</span>), nn.<span class="fn">Tanh</span>())
        self.actor = nn.<span class="fn">Linear</span>(<span class="num">64</span>, A); self.critic = nn.<span class="fn">Linear</span>(<span class="num">64</span>, <span class="num">1</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">body</span>(x); <span class="kw">return</span> self.<span class="fn">actor</span>(h), self.<span class="fn">critic</span>(h).<span class="fn">squeeze</span>(-<span class="num">1</span>)

ac = <span class="fn">AC</span>(); opt = torch.optim.<span class="fn">Adam</span>(ac.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
GAMMA, LAM, EPS_CLIP, K_EPOCHS, BATCH = <span class="num">0.99</span>, <span class="num">0.95</span>, <span class="num">0.2</span>, <span class="num">10</span>, <span class="num">64</span>
N_STEPS = <span class="num">2048</span>

<span class="kw">def</span> <span class="fn">collect</span>():
    s, _ = env.<span class="fn">reset</span>()
    S_buf, A_buf, LP, R_buf, V_buf, D_buf = [], [], [], [], [], []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N_STEPS):
        st = torch.<span class="fn">tensor</span>(s, dtype=torch.float32)
        <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
            logits, v = <span class="fn">ac</span>(st)
            dist = <span class="fn">Categorical</span>(logits=logits); a = dist.<span class="fn">sample</span>()
        S_buf.<span class="fn">append</span>(s); A_buf.<span class="fn">append</span>(a.<span class="fn">item</span>()); LP.<span class="fn">append</span>(dist.<span class="fn">log_prob</span>(a).<span class="fn">item</span>()); V_buf.<span class="fn">append</span>(v.<span class="fn">item</span>())
        s, r, term, trunc, _ = env.<span class="fn">step</span>(a.<span class="fn">item</span>())
        R_buf.<span class="fn">append</span>(r); D_buf.<span class="fn">append</span>(term <span class="kw">or</span> trunc)
        <span class="kw">if</span> term <span class="kw">or</span> trunc: s, _ = env.<span class="fn">reset</span>()
    <span class="kw">return</span> <span class="fn">map</span>(np.array, (S_buf, A_buf, LP, R_buf, V_buf, D_buf))

<span class="kw">def</span> <span class="fn">gae</span>(rewards, values, dones):
    adv = np.<span class="fn">zeros_like</span>(rewards, dtype=np.float32); last = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">reversed</span>(<span class="fn">range</span>(<span class="fn">len</span>(rewards))):
        next_v = <span class="num">0</span> <span class="kw">if</span> t == <span class="fn">len</span>(rewards)-<span class="num">1</span> <span class="kw">else</span> values[t+<span class="num">1</span>]
        delta = rewards[t] + GAMMA * next_v * (<span class="num">1</span>-dones[t]) - values[t]
        last = delta + GAMMA * LAM * (<span class="num">1</span>-dones[t]) * last
        adv[t] = last
    <span class="kw">return</span> adv, adv + values

<span class="kw">for</span> it <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    s_b, a_b, lp_b, r_b, v_b, d_b = <span class="fn">collect</span>()
    adv, ret = <span class="fn">gae</span>(r_b, v_b, d_b)
    adv = (adv - adv.<span class="fn">mean</span>()) / (adv.<span class="fn">std</span>() + <span class="num">1e-8</span>)
    s_t = torch.<span class="fn">tensor</span>(s_b, dtype=torch.float32); a_t = torch.<span class="fn">tensor</span>(a_b, dtype=torch.long)
    lp_old = torch.<span class="fn">tensor</span>(lp_b, dtype=torch.float32); adv_t = torch.<span class="fn">tensor</span>(adv, dtype=torch.float32)
    ret_t = torch.<span class="fn">tensor</span>(ret, dtype=torch.float32)
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K_EPOCHS):
        idx = np.random.<span class="fn">permutation</span>(N_STEPS)
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, N_STEPS, BATCH):
            b = idx[i:i+BATCH]
            logits, v = <span class="fn">ac</span>(s_t[b])
            dist = <span class="fn">Categorical</span>(logits=logits)
            lp_new = dist.<span class="fn">log_prob</span>(a_t[b])
            ratio = torch.<span class="fn">exp</span>(lp_new - lp_old[b])
            surr1 = ratio * adv_t[b]
            surr2 = torch.<span class="fn">clamp</span>(ratio, <span class="num">1</span>-EPS_CLIP, <span class="num">1</span>+EPS_CLIP) * adv_t[b]
            actor_loss = -torch.<span class="fn">min</span>(surr1, surr2).<span class="fn">mean</span>()
            critic_loss = ((v - ret_t[b])**<span class="num">2</span>).<span class="fn">mean</span>()
            entropy = dist.<span class="fn">entropy</span>().<span class="fn">mean</span>()
            loss = actor_loss + <span class="num">0.5</span>*critic_loss - <span class="num">0.01</span>*entropy
            opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="fn">print</span>(f<span class="str">"iter={it} ort_getiri={ret.mean():.2f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PPO from scratch — same idea, with explicit advantage and clip ratio. Pure numpy, prints final policy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(1)
theta = np.zeros((4, 2))
V = np.zeros(4)
def pi(s):
    p = np.exp(theta[s]); return p / p.sum()
def step(s, a):
    ns = min(3, s+1) if a == 1 else max(0, s-1)
    return ns, (1.0 if ns == 3 else -0.05), ns == 3
for ep in range(800):
    traj, s = [], 0
    for _ in range(10):
        a = int(rng.choice(2, p=pi(s)))
        ns, r, done = step(s, a)
        traj.append((s, a, r, ns, done)); s = ns
        if done: break
    for s, a, r, ns, done in traj:
        adv = r + (0 if done else 0.9*V[ns]) - V[s]
        V[s] += 0.1 * adv
        grad = -pi(s); grad[a] += 1
        theta[s] += 0.02 * np.clip(adv, -0.2, 0.2) * grad
print('V:', np.round(V, 3))
print('Greedy action per state:', [int(np.argmax(pi(s))) for s in range(4)])</code></pre></div>
</div>
<p class="l-text"><strong>Adım adım inceleyelim:</strong> 1) Paylaşımlı gövdeli actor-critic kur. 2) Her iterasyonda 2048 geçiş topla (done'da reset). 3) Değer + ödül + done'dan GAE avantajları ve getiriler hesapla. 4) Avantajları standartlaştır. 5) 10 epoch boyunca 64'lük mini-batch'lerde: ileri geçiş, yeni log-prob'ları hesapla, oran = exp(yeni − eski), vekili kırp, critic MSE ve entropi bonusuyla birleştir, Adam adımı. 6) ~50 iter sonra CartPole tam çözülür.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. PPO Etkinliği</h2>
<div id="rl9-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">PPO, REINFORCE ya da A2C'den çok daha hızlı ve stabil öğrenir, özellikle LunarLander veya MuJoCo robotik gibi zor görevlerde.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. PPO Sonra Nereye Gidiyor?</h2>
<p class="l-text">PPO, RLHF'in motorudur — aynı kırpılmış amaç, öğrenilmiş bir ödül modeli + bir referans politikaya KL düzenleyici ile, InstructGPT ve ChatGPT'nin tam olarak hizalandığı yöntemdir. Ders 10 hepsini bağlar.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> PPO, saf PG'yi güven-bölgesi-benzeri kırpmayla veriyi tekrar kullanarak iyileştirir.<br><strong>2.</strong> Önem oranı r_t = π_θ(a|s) / π_θ_old(a|s).<br><strong>3.</strong> L^CLIP = E[ min(r·A, clip(r,1−ε,1+ε)·A) ].<br><strong>4.</strong> ε ≈ 0.2, K ≈ 10 epoch, GAE λ ≈ 0.95.<br><strong>5.</strong> Stable Baselines3 sana PPO'yu 5 satırda verir.<br><strong>6.</strong> Aynı algoritma ChatGPT'yi eğitti — ders 10'da RLHF.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
