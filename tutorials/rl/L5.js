window.RL_L5 = {

en: `<p class="l-text"><strong>Q-learning is the algorithm that put RL on the map. Watkins published it in 1989 and it still powers, in spirit, every modern Deep Q-Network and even parts of RLHF.</strong></p>
<p class="l-text">In this lesson you will learn the Q-learning update, off-policy vs on-policy distinction, ε-greedy exploration, and code a from-scratch Q-table that solves CliffWalking.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the off-policy Q-learning update with the max-over-actions target</li>
<li>Distinguish off-policy Q-learning from on-policy SARSA on the same trajectory</li>
<li>Balance exploration with epsilon-greedy and decaying-epsilon schedules</li>
<li>Implement Q-learning on the CliffWalking grid in around 80 lines of NumPy</li>
<li>Diagnose convergence by plotting episode return and Q-value heatmaps</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. From Prediction to Control</h2>
<p class="l-text">Lesson 4 estimated V^π for a fixed policy. Now we want to find the BEST policy — control. Q-learning does this by learning Q^* directly, then acting greedily w.r.t. it.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prediction</div><div class="card-body">Given π, estimate V^π or Q^π.</div></div>
<div class="calc-card"><div class="card-title">Control</div><div class="card-body">Find π^* that maximizes return. Q-learning is the canonical answer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Q-Learning Update</h2>
<div class="katex-block">$$Q(s,a) \\leftarrow Q(s,a) + \\alpha \\left[ r + \\gamma \\max_{a'} Q(s', a') - Q(s,a) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">α</div><div class="card-body">Learning rate. Typical 0.1. Smaller = stable but slow.</div></div>
<div class="calc-card"><div class="card-title">γ</div><div class="card-body">Discount. 0.95–0.99 most common.</div></div>
<div class="calc-card"><div class="card-title">r</div><div class="card-body">Immediate reward observed.</div></div>
<div class="calc-card"><div class="card-title">max_{a'} Q(s', a')</div><div class="card-body">Greedy estimate of next-state value — assumes we will play optimally afterwards.</div></div>
</div>
<p class="l-text">Notice the max — it does not care which action we actually take next. That is what makes Q-learning off-policy: we can collect data with any behavior policy (random, ε-greedy, human demonstrations) and still learn the optimal Q.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Off-policy vs On-policy</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">On-policy (SARSA)</div><div class="card-body">Update target uses the action actually taken next: r + γ Q(s', a_next). Learns the policy you are running.</div></div>
<div class="calc-card"><div class="card-title">Off-policy (Q-learning)</div><div class="card-body">Update target uses max over next actions. Learns the optimal policy regardless of behavior.</div></div>
</div>
<p class="l-text">In CliffWalking, SARSA learns a "safe" path that stays away from the cliff (because ε-greedy occasionally pushes it off). Q-learning learns the "optimal" path right along the cliff edge — riskier during training but optimal asymptotically.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ε-Greedy Exploration</h2>
<p class="l-text">If we always pick argmax Q, we never see new (s,a) pairs and Q-learning fails. ε-greedy fixes this:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">With prob 1-ε</div><div class="card-body">Pick argmax_a Q(s,a) — exploit.</div></div>
<div class="calc-card"><div class="card-title">With prob ε</div><div class="card-body">Pick a random action — explore.</div></div>
</div>
<p class="l-text">Common schedule: start ε=1.0, decay to 0.05 over training. Q-learning is provably convergent if every (s,a) is visited infinitely often and α is decayed appropriately.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hands-on: CliffWalking</h2>
<p class="l-text">4×12 grid. Start bottom-left, goal bottom-right. Bottom row (between start and goal) is a cliff: stepping in resets to start with reward −100. Each step −1.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"CliffWalking-v0"</span>)
N_S, N_A = env.observation_space.n, env.action_space.n
Q = np.<span class="fn">zeros</span>((N_S, N_A))
alpha, gamma = <span class="num">0.5</span>, <span class="num">0.99</span>
N_EPISODES = <span class="num">500</span>

<span class="kw">def</span> <span class="fn">epsilon_greedy</span>(s, eps):
    <span class="kw">if</span> np.random.<span class="fn">rand</span>() &lt; eps:
        <span class="kw">return</span> env.action_space.<span class="fn">sample</span>()
    <span class="kw">return</span> <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(N_EPISODES):
    s, _ = env.<span class="fn">reset</span>()
    eps = <span class="fn">max</span>(<span class="num">0.05</span>, <span class="num">1.0</span> - ep / <span class="num">300</span>)
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        a = <span class="fn">epsilon_greedy</span>(s, eps)
        s_next, r, term, trunc, _ = env.<span class="fn">step</span>(a)
        done = term <span class="kw">or</span> trunc
        td_target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> gamma * Q[s_next].<span class="fn">max</span>())
        Q[s, a] += alpha * (td_target - Q[s, a])
        s = s_next

<span class="cm"># Greedy rollout</span>
s, _ = env.<span class="fn">reset</span>()
total = <span class="num">0</span>
done = <span class="kw">False</span>
<span class="kw">while</span> <span class="kw">not</span> done:
    a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))
    s, r, term, trunc, _ = env.<span class="fn">step</span>(a)
    total += r
    done = term <span class="kw">or</span> trunc
<span class="fn">print</span>(f<span class="str">"Greedy return: {total}"</span>)  <span class="cm"># ~ -13 (optimal)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Browser-runnable CliffWalking with Q-learning. 4×12 grid, ε-greedy, 500 episodes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
ROWS, COLS = 4, 12
Q = np.zeros((ROWS*COLS, 4))
def step(s, a):
    r, c = divmod(s, COLS)
    if a == 0: r = max(r-1, 0)
    elif a == 1: c = min(c+1, COLS-1)
    elif a == 2: r = min(r+1, ROWS-1)
    else: c = max(c-1, 0)
    ns = r*COLS + c
    if r == ROWS-1 and 0 &lt; c &lt; COLS-1: return 36, -100, False
    if ns == ROWS*COLS - 1: return ns, -1, True
    return ns, -1, False
for ep in range(500):
    s, done = 36, False
    while not done:
        a = rng.integers(0,4) if rng.random() &lt; 0.1 else int(np.argmax(Q[s]))
        ns, r, done = step(s, a)
        Q[s, a] += 0.1 * (r + 0.95 * Q[ns].max() - Q[s, a])
        s = ns
print('Learned greedy reward from start:', float(Q[36].max()))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build the CliffWalking env and a (states × actions) Q-table of zeros. 2) For each episode, decay ε linearly from 1.0 to 0.05. 3) Pick action with ε-greedy on Q. 4) Apply Q-learning update with the off-policy max target. 5) After training, follow the greedy policy and confirm a near-optimal return of ≈ −13 (the optimal length of the cliff-edge path).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Why Tabular Q-learning Converges</h2>
<p class="l-text">Three conditions guarantee Q → Q^*:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Coverage</div><div class="card-body">Every (s,a) visited infinitely often.</div></div>
<div class="calc-card"><div class="card-title">2. Robbins-Monro</div><div class="card-body">Σ α_t = ∞ and Σ α_t^2 &lt; ∞ (decaying step size).</div></div>
<div class="calc-card"><div class="card-title">3. γ &lt; 1</div><div class="card-body">Bellman operator is a contraction.</div></div>
</div>
<p class="l-text">In practice we cheat with constant α=0.1 — works fine for finite tasks.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Episode Return Curve</h2>
<div id="rl5-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">Q-learning's curve is jaggy because ε-greedy occasionally falls off the cliff. After training the greedy return is stable.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. From Tables to Networks</h2>
<p class="l-text">Q-table works when |S|×|A| fits in memory. CartPole has continuous state — infinitely many states. Atari has 210×160×3 pixels = unimaginable. Solution: replace the table with a neural network. That is DQN, our next lesson.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Q-learning update: Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') − Q(s,a)].<br><strong>2.</strong> Off-policy — uses max over next actions, not the action actually taken.<br><strong>3.</strong> ε-greedy balances exploration and exploitation.<br><strong>4.</strong> Tabular Q-learning provably converges under standard conditions.<br><strong>5.</strong> CliffWalking solved in &lt; 50 lines with a Q-table.<br><strong>6.</strong> The table trick fails for continuous/large state spaces — next stop: DQN.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:80}, (_,i)=>(i+1)*6);
  var ret = ep.map(function(e,i){return -100 + 80*(1-Math.exp(-i/15)) + (Math.random()-0.5)*15;});
  var data = [{x:ep,y:ret,name:'Episode return',type:'scatter',mode:'lines',line:{color:T.accent,width:2}}];
  var layout = {title:'CliffWalking — episode return during Q-learning',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl5-plot-en','rl5-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Q-learning, RL'i haritaya koyan algoritmadır. Watkins 1989'da yayımladı ve hâlâ ruhunda her modern Derin Q-Ağı'nı ve hatta RLHF'in parçalarını besliyor.</strong></p>
<p class="l-text">Bu derste Q-learning güncellemesini, off-policy vs on-policy ayrımını, ε-greedy keşfi öğrenecek ve sıfırdan CliffWalking'i çözen bir Q-tablosu kodlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Off-policy Q-learning güncellemesini eylemler üzerinde max alan hedefle uygulamayı</li>
<li>Aynı trajektoride off-policy Q-learning ile on-policy SARSA'yı ayırt etmeyi</li>
<li>Epsilon-greedy ve azalan-epsilon planlarıyla keşif-sömürü dengesini kurmayı</li>
<li>CliffWalking grid'inde Q-learning'i yaklaşık 80 satır NumPy ile uygulamayı</li>
<li>Episode getiri ve Q-değer ısı haritalarını çizerek yakınsamayı tanılamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tahminden Kontrole</h2>
<p class="l-text">Ders 4 sabit bir politika için V^π'i tahmin etti. Şimdi EN İYİ politikayı bulmak istiyoruz — kontrol. Q-learning bunu doğrudan Q^*'i öğrenip ona göre açgözlü davranarak yapar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tahmin</div><div class="card-body">π verili, V^π ya da Q^π'i tahmin et.</div></div>
<div class="calc-card"><div class="card-title">Kontrol</div><div class="card-body">Getiriyi maksimize eden π^*'ı bul. Q-learning kanonik cevap.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Q-Learning Güncellemesi</h2>
<div class="katex-block">$$Q(s,a) \\leftarrow Q(s,a) + \\alpha \\left[ r + \\gamma \\max_{a'} Q(s', a') - Q(s,a) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">α</div><div class="card-body">Öğrenme oranı. Tipik 0.1. Daha küçük = stabil ama yavaş.</div></div>
<div class="calc-card"><div class="card-title">γ</div><div class="card-body">İndirgeme. 0.95–0.99 en yaygın.</div></div>
<div class="calc-card"><div class="card-title">r</div><div class="card-body">Gözlenen anlık ödül.</div></div>
<div class="calc-card"><div class="card-title">max_{a'} Q(s', a')</div><div class="card-body">Sonraki durum değerinin açgözlü tahmini — sonradan optimal oynayacağımızı varsayar.</div></div>
</div>
<p class="l-text">Maks'a dikkat — sıradaki adımda hangi eylemi gerçekten aldığımızı umursamaz. Q-learning'i off-policy yapan budur: herhangi bir davranış politikasıyla (rastgele, ε-greedy, insan demolar) veri toplayıp yine de optimal Q'yu öğrenebiliriz.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Off-policy vs On-policy</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">On-policy (SARSA)</div><div class="card-body">Hedef gerçekten alınan sonraki eylemi kullanır: r + γ Q(s', a_sonraki). Çalıştırdığın politikayı öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Off-policy (Q-learning)</div><div class="card-body">Hedef sonraki eylemler üzerinden maks kullanır. Davranıştan bağımsız optimal politikayı öğrenir.</div></div>
</div>
<p class="l-text">CliffWalking'de SARSA "güvenli" bir yol öğrenir — uçurumdan uzak (çünkü ε-greedy ara sıra onu iter). Q-learning uçurumun kıyısındaki "optimal" yolu öğrenir — eğitim sırasında riskli ama asimptotik olarak optimal.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ε-Greedy Keşif</h2>
<p class="l-text">Her zaman argmax Q seçersek yeni (s,a) çiftlerini görmeyiz ve Q-learning başarısız olur. ε-greedy bunu çözer:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Olasılık 1-ε ile</div><div class="card-body">argmax_a Q(s,a) seç — sömür.</div></div>
<div class="calc-card"><div class="card-title">Olasılık ε ile</div><div class="card-body">Rastgele eylem seç — keşfet.</div></div>
</div>
<p class="l-text">Yaygın takvim: ε=1.0 ile başla, eğitim boyunca 0.05'e azalt. Q-learning, her (s,a) sonsuz sıklıkta ziyaret edildiğinde ve α uygun azaltıldığında yakınsadığı kanıtlanmıştır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Uygulama: CliffWalking</h2>
<p class="l-text">4×12 grid. Sol alt başla, sağ altta hedef. Alt sıra (başlangıç ile hedef arası) bir uçurum: girmek başlangıca −100 ödülle resetler. Her adım −1.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"CliffWalking-v0"</span>)
N_S, N_A = env.observation_space.n, env.action_space.n
Q = np.<span class="fn">zeros</span>((N_S, N_A))
alpha, gamma = <span class="num">0.5</span>, <span class="num">0.99</span>
N_EPISODES = <span class="num">500</span>

<span class="kw">def</span> <span class="fn">epsilon_greedy</span>(s, eps):
    <span class="kw">if</span> np.random.<span class="fn">rand</span>() &lt; eps:
        <span class="kw">return</span> env.action_space.<span class="fn">sample</span>()
    <span class="kw">return</span> <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(N_EPISODES):
    s, _ = env.<span class="fn">reset</span>()
    eps = <span class="fn">max</span>(<span class="num">0.05</span>, <span class="num">1.0</span> - ep / <span class="num">300</span>)
    done = <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        a = <span class="fn">epsilon_greedy</span>(s, eps)
        s_next, r, term, trunc, _ = env.<span class="fn">step</span>(a)
        done = term <span class="kw">or</span> trunc
        td_target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> gamma * Q[s_next].<span class="fn">max</span>())
        Q[s, a] += alpha * (td_target - Q[s, a])
        s = s_next

<span class="cm"># Acgozlu rollout</span>
s, _ = env.<span class="fn">reset</span>()
total = <span class="num">0</span>
done = <span class="kw">False</span>
<span class="kw">while</span> <span class="kw">not</span> done:
    a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q[s]))
    s, r, term, trunc, _ = env.<span class="fn">step</span>(a)
    total += r
    done = term <span class="kw">or</span> trunc
<span class="fn">print</span>(f<span class="str">"Acgozlu getiri: {total}"</span>)  <span class="cm"># ~ -13 (optimal)</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Browser-runnable CliffWalking with Q-learning. 4×12 grid, ε-greedy, 500 episodes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
ROWS, COLS = 4, 12
Q = np.zeros((ROWS*COLS, 4))
def step(s, a):
    r, c = divmod(s, COLS)
    if a == 0: r = max(r-1, 0)
    elif a == 1: c = min(c+1, COLS-1)
    elif a == 2: r = min(r+1, ROWS-1)
    else: c = max(c-1, 0)
    ns = r*COLS + c
    if r == ROWS-1 and 0 &lt; c &lt; COLS-1: return 36, -100, False
    if ns == ROWS*COLS - 1: return ns, -1, True
    return ns, -1, False
for ep in range(500):
    s, done = 36, False
    while not done:
        a = rng.integers(0,4) if rng.random() &lt; 0.1 else int(np.argmax(Q[s]))
        ns, r, done = step(s, a)
        Q[s, a] += 0.1 * (r + 0.95 * Q[ns].max() - Q[s, a])
        s = ns
print('Learned greedy reward from start:', float(Q[36].max()))</code></pre></div>
</div>
<p class="l-text"><strong>Burada şunlar oluyor:</strong> 1) CliffWalking ortamı ve sıfırlardan oluşan bir (durum × eylem) Q-tablosu kur. 2) Her bölüm için ε'yi 1.0'dan 0.05'e doğrusal azalt. 3) Q üzerinde ε-greedy ile eylem seç. 4) Off-policy maks hedefiyle Q-learning güncellemesini uygula. 5) Eğitim sonrası açgözlü politikayı izle ve ≈ −13 (uçurum kıyısı yolunun optimal uzunluğu) civarı getiriyi doğrula.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Tablo Tabanlı Q-learning Neden Yakınsar?</h2>
<p class="l-text">Üç koşul Q → Q^* garantiler:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Kapsama</div><div class="card-body">Her (s,a) sonsuz sıklıkta ziyaret edilir.</div></div>
<div class="calc-card"><div class="card-title">2. Robbins-Monro</div><div class="card-body">Σ α_t = ∞ ve Σ α_t^2 &lt; ∞ (azalan adım boyu).</div></div>
<div class="calc-card"><div class="card-title">3. γ &lt; 1</div><div class="card-body">Bellman operatörü daraltıcıdır.</div></div>
</div>
<p class="l-text">Pratikte sabit α=0.1 ile hile yaparız — sonlu görevlerde işe yarar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bölüm Getiri Eğrisi</h2>
<div id="rl5-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Q-learning eğrisi tırtıklıdır çünkü ε-greedy ara sıra uçurumdan düşer. Eğitim sonrası açgözlü getiri stabildir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Tablodan Ağa</h2>
<p class="l-text">Q-tablosu |S|×|A| belleğe sığdığında işe yarar. CartPole sürekli durumlu — sonsuz çok durum. Atari 210×160×3 piksel = hayal edilemez. Çözüm: tabloyu sinir ağıyla değiştir. Sıradaki ders: DQN.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Q-learning güncellemesi: Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') − Q(s,a)].<br><strong>2.</strong> Off-policy — sonraki eylemler üzerinden maks kullanır, gerçekten alınan eylemi değil.<br><strong>3.</strong> ε-greedy keşif ile sömürüyü dengeler.<br><strong>4.</strong> Tablo tabanlı Q-learning standart koşullar altında yakınsadığı kanıtlıdır.<br><strong>5.</strong> CliffWalking Q-tablosuyla &lt; 50 satırda çözüldü.<br><strong>6.</strong> Tablo hilesi sürekli/büyük durum uzaylarında çöker — sıradaki durak: DQN.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
