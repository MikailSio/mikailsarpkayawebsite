window.RL_L6 = {

en: `<p class="l-text"><strong>In 2013 DeepMind shocked the world: a single neural network learned to play 49 Atari games from raw pixels, achieving human-level performance on 29 of them.</strong> The trick was Deep Q-Networks (DQN) — Q-learning with a neural net plus two crucial stabilization tricks.</p>
<p class="l-text">In this lesson you will learn the DQN architecture, replay buffers, target networks, and code a from-scratch DQN that solves CartPole in PyTorch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Replace the Q-table with an MLP that maps state to action-values</li>
<li>Build a replay buffer to break correlation in sequential transitions</li>
<li>Stabilize the TD target with a periodically synced target network</li>
<li>Implement DQN end-to-end in PyTorch and solve CartPole-v1</li>
<li>Tour Double DQN, Dueling DQN, and Prioritized Experience Replay extensions</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why a Q-Table Fails for Atari</h2>
<p class="l-text">Atari frames are 210×160×3 = 100,800 dimensional. Even after grayscaling and downsampling to 84×84×4 stacked frames, the state space is 256^28224 — astronomical. Tabular Q-learning needs to visit each state, which is impossible. We need a function approximator that generalizes: similar pixel patterns → similar Q values.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Q-Network Architecture</h2>
<p class="l-text">Replace Q(s,a) the table with Q_θ(s) the neural network — a function from state to a vector of Q-values, one per action.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Input</div><div class="card-body">State (CartPole: 4 floats; Atari: 84×84×4 frames).</div></div>
<div class="calc-card"><div class="card-title">Hidden</div><div class="card-body">MLP (CartPole) or CNN (Atari) with ReLU.</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">|A| values — Q(s, a_0), Q(s, a_1), …</div></div>
</div>
<p class="l-text">Loss: minimize squared TD error.</p>
<div class="katex-block">$$L(\\theta) = \\mathbb{E}_{(s,a,r,s')} \\left[ \\left( r + \\gamma \\max_{a'} Q_{\\theta^{-}}(s', a') - Q_{\\theta}(s, a) \\right)^2 \\right]$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Trick #1 — Experience Replay</h2>
<p class="l-text">If we learn from consecutive frames, samples are highly correlated and the network forgets old experience as the policy shifts. Solution: store transitions in a buffer of size ~1M, then sample mini-batches uniformly. This decorrelates samples and reuses experience many times — sample efficiency boost.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Buffer</div><div class="card-body">Deque of (s, a, r, s', done) tuples, FIFO, capacity ~10^5–10^6.</div></div>
<div class="calc-card"><div class="card-title">Mini-batch</div><div class="card-body">Sample 32 or 64 random transitions per gradient step.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Trick #2 — Target Network</h2>
<p class="l-text">The TD target r + γ max Q_θ(s',a') uses the same network we are updating. As θ changes, the target moves — like chasing your own shadow. Solution: keep a frozen copy θ⁻ and update it slowly (every C steps copy θ → θ⁻, or use Polyak averaging).</p>
<div class="katex-block">$$\\text{target} = r + \\gamma \\max_{a'} Q_{\\theta^{-}}(s', a')$$</div>
<p class="l-text">This decouples the bootstrap target from the trained network and dramatically stabilizes learning.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PyTorch DQN on CartPole</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, numpy <span class="kw">as</span> np, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> collections <span class="kw">import</span> deque
<span class="kw">import</span> random

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)
S_DIM, A_DIM = <span class="num">4</span>, <span class="num">2</span>

<span class="kw">class</span> <span class="fn">QNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.net = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(S_DIM,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>, A_DIM))
    <span class="kw">def</span> <span class="fn">forward</span>(self, x): <span class="kw">return</span> self.<span class="fn">net</span>(x)

q, q_tgt = <span class="fn">QNet</span>(), <span class="fn">QNet</span>()
q_tgt.<span class="fn">load_state_dict</span>(q.<span class="fn">state_dict</span>())
opt = torch.optim.<span class="fn">Adam</span>(q.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
buf = <span class="fn">deque</span>(maxlen=<span class="num">10000</span>)
gamma, batch = <span class="num">0.99</span>, <span class="num">64</span>

<span class="kw">def</span> <span class="fn">act</span>(s, eps):
    <span class="kw">if</span> random.<span class="fn">random</span>() &lt; eps: <span class="kw">return</span> env.action_space.<span class="fn">sample</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> <span class="fn">int</span>(<span class="fn">q</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32)).<span class="fn">argmax</span>())

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s, _ = env.<span class="fn">reset</span>(); done=<span class="kw">False</span>; G=<span class="num">0</span>
    eps = <span class="fn">max</span>(<span class="num">0.05</span>, <span class="num">1.0</span> - ep/<span class="num">250</span>)
    <span class="kw">while</span> <span class="kw">not</span> done:
        a = <span class="fn">act</span>(s, eps)
        s2, r, term, trunc, _ = env.<span class="fn">step</span>(a); done=term <span class="kw">or</span> trunc
        buf.<span class="fn">append</span>((s,a,r,s2,done)); G += r; s=s2
        <span class="kw">if</span> <span class="fn">len</span>(buf) &gt;= batch:
            mb = random.<span class="fn">sample</span>(buf, batch)
            ss, aa, rr, ss2, dd = <span class="fn">map</span>(np.array, <span class="fn">zip</span>(*mb))
            ss = torch.<span class="fn">tensor</span>(ss, dtype=torch.float32)
            ss2 = torch.<span class="fn">tensor</span>(ss2, dtype=torch.float32)
            aa = torch.<span class="fn">tensor</span>(aa, dtype=torch.long)
            rr = torch.<span class="fn">tensor</span>(rr, dtype=torch.float32)
            dd = torch.<span class="fn">tensor</span>(dd, dtype=torch.float32)
            q_pred = <span class="fn">q</span>(ss).<span class="fn">gather</span>(<span class="num">1</span>, aa.<span class="fn">unsqueeze</span>(<span class="num">1</span>)).<span class="fn">squeeze</span>(<span class="num">1</span>)
            <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
                q_next = <span class="fn">q_tgt</span>(ss2).<span class="fn">max</span>(<span class="num">1</span>).values
                target = rr + gamma * q_next * (<span class="num">1</span> - dd)
            loss = nn.functional.<span class="fn">mse_loss</span>(q_pred, target)
            opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="kw">if</span> ep % <span class="num">10</span> == <span class="num">0</span>:
        q_tgt.<span class="fn">load_state_dict</span>(q.<span class="fn">state_dict</span>())
        <span class="fn">print</span>(f<span class="str">"ep={ep} return={G:.0f} eps={eps:.2f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PyTorch DQN is blocked. We approximate it with sklearn MLPRegressor as the Q-function on a 5-state chain.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neural_network import MLPRegressor
rng = np.random.default_rng(0)
N_STATES, N_ACTIONS = 5, 2
def step(s, a):
    ns = max(0, min(N_STATES-1, s + (1 if a == 1 else -1)))
    r = 1.0 if ns == N_STATES-1 else -0.05
    return ns, r, ns == N_STATES-1
X, y = [], []
for ep in range(200):
    s = 0
    for _ in range(20):
        a = rng.integers(0, 2)
        ns, r, done = step(s, a)
        X.append([s, a]); y.append(r + 0.9 * (0 if done else (N_STATES-1-ns)*0.1))
        s = ns
        if done: break
Q = MLPRegressor(hidden_layer_sizes=(16,), max_iter=300, random_state=0).fit(X, y)
print('Q(0,right):', round(float(Q.predict([[0,1]])[0]), 3))
print('Q(0,left ):', round(float(Q.predict([[0,0]])[0]), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build two MLPs with identical architecture — online q and frozen q_tgt. 2) Roll out an episode with ε-greedy on q. 3) Store each (s,a,r,s',done) in a 10k FIFO buffer. 4) After enough samples, draw a random batch of 64. 5) Compute predicted Q(s,a) from the online net, target r + γ max Q_tgt(s',·) from the frozen net. 6) MSE loss, Adam step. 7) Every 10 episodes, copy weights to the target net. CartPole solves (return ≈ 500) in roughly 200 episodes.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Modern DQN Variants</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Double DQN</div><div class="card-body">Use online net to pick a*, target net to evaluate Q. Cuts overestimation bias.</div></div>
<div class="calc-card"><div class="card-title">Dueling DQN</div><div class="card-body">Decompose Q(s,a) = V(s) + A(s,a). Better with many similar-value actions.</div></div>
<div class="calc-card"><div class="card-title">Prioritized Replay</div><div class="card-body">Sample high-TD-error transitions more often. ~2× faster on Atari.</div></div>
<div class="calc-card"><div class="card-title">Rainbow</div><div class="card-body">Combine 6 improvements. SOTA for value-based RL until distributional methods.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Training Curve</h2>
<div id="rl6-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">Typical CartPole DQN learning curve. Notice the variance — DQN can be unstable; multiple seeds are wise.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Limitations</h2>
<p class="l-text">DQN handles discrete actions only. For continuous control (robot torques) we need policy gradient. DQN can also overestimate Q values (max bias) and is sample-inefficient compared to model-based methods. But for problems with manageable discrete action sets it remains a strong baseline.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> DQN = Q-learning with a neural net Q_θ(s).<br><strong>2.</strong> Replay buffer decorrelates samples and reuses experience.<br><strong>3.</strong> Target network freezes the bootstrap target → stable bootstrap.<br><strong>4.</strong> Loss: MSE between Q_θ(s,a) and r + γ max Q_θ⁻(s',a').<br><strong>5.</strong> CartPole solves in ~200 episodes with ~50 lines of PyTorch.<br><strong>6.</strong> Variants (Double, Dueling, Prioritized, Rainbow) add measurable wins; basic DQN is the foundation.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:200}, (_,i)=>i+1);
  var ret = ep.map(function(e){var base = Math.min(500, 20 + e*2.5); return base + (Math.random()-0.5)*60;});
  var data = [{x:ep,y:ret,name:'Episode return',type:'scatter',mode:'lines',line:{color:T.accent,width:2}}];
  var layout = {title:'CartPole DQN — return vs episode',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl6-plot-en','rl6-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>2013'te DeepMind dünyayı şoke etti: tek bir sinir ağı 49 Atari oyununu ham piksellerden öğrendi ve 29'unda insan seviyesi performans yakaladı.</strong> Sırrı Derin Q-Ağları (DQN) idi — sinir ağlı Q-learning + iki kritik stabilizasyon hilesi.</p>
<p class="l-text">Bu derste DQN mimarisini, replay buffer'ı, target network'ü öğrenecek ve PyTorch'ta CartPole'u çözen sıfırdan bir DQN kodlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Q-tablosu yerine durumu eylem-değerlerine eşleyen bir MLP kullanmayı</li>
<li>Ardışık geçişlerdeki korelasyonu kırmak için replay buffer kurmayı</li>
<li>Periyodik senkronize target network ile TD hedefini istikrarlandırmayı</li>
<li>PyTorch'ta DQN'i baştan sona uygulamayı ve CartPole-v1'i çözmeyi</li>
<li>Double DQN, Dueling DQN ve Prioritized Experience Replay uzantılarını incelemeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Atari'de Q-Tablosu Neden Çöker?</h2>
<p class="l-text">Atari kareleri 210×160×3 = 100,800 boyutlu. Gri tonlama ve 84×84×4 yığma sonrası bile durum uzayı 256^28224 — astronomik. Tablo tabanlı Q-learning her durumu ziyaret etmek zorunda, bu imkânsız. Genelleyen bir fonksiyon yaklaştırıcısına ihtiyacımız var: benzer piksel desenleri → benzer Q değerleri.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Q-Ağı Mimarisi</h2>
<p class="l-text">Q(s,a) tablosunu Q_θ(s) sinir ağıyla değiştir — durumdan eylem başına bir Q-değer vektörüne giden fonksiyon.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdi</div><div class="card-body">Durum (CartPole: 4 float; Atari: 84×84×4 kare).</div></div>
<div class="calc-card"><div class="card-title">Gizli</div><div class="card-body">MLP (CartPole) ya da CNN (Atari) ReLU ile.</div></div>
<div class="calc-card"><div class="card-title">Çıktı</div><div class="card-body">|A| değer — Q(s, a_0), Q(s, a_1), …</div></div>
</div>
<p class="l-text">Kayıp: kare TD hatasını minimize et.</p>
<div class="katex-block">$$L(\\theta) = \\mathbb{E}_{(s,a,r,s')} \\left[ \\left( r + \\gamma \\max_{a'} Q_{\\theta^{-}}(s', a') - Q_{\\theta}(s, a) \\right)^2 \\right]$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hile #1 — Deneyim Tekrarı</h2>
<p class="l-text">Ardışık karelerden öğrenirsek örnekler yüksek korelasyonlu olur ve politika değiştikçe ağ eski deneyimi unutur. Çözüm: geçişleri ~1M boyutlu bir buffer'da sakla, sonra mini-batch'leri tekdüze örnekle. Bu örnekleri ilişkisizleştirir ve deneyimi tekrar tekrar kullanır — örnek verimliliği artar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Buffer</div><div class="card-body">(s, a, r, s', bitti) demet kuyruğu, FIFO, kapasite ~10^5–10^6.</div></div>
<div class="calc-card"><div class="card-title">Mini-batch</div><div class="card-body">Her gradyan adımı için 32 ya da 64 rastgele geçiş örnekle.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Hile #2 — Hedef Ağı</h2>
<p class="l-text">TD hedefi r + γ max Q_θ(s',a') güncellediğimiz aynı ağı kullanır. θ değiştikçe hedef hareket eder — kendi gölgeni kovalamaya benzer. Çözüm: dondurulmuş bir kopya θ⁻ tut ve onu yavaşça güncelle (her C adımda θ → θ⁻ kopyala ya da Polyak ortalaması kullan).</p>
<div class="katex-block">$$\\text{target} = r + \\gamma \\max_{a'} Q_{\\theta^{-}}(s', a')$$</div>
<p class="l-text">Bu, bootstrap hedefini eğitilen ağdan ayırır ve öğrenmeyi dramatik şekilde stabilize eder.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CartPole'da PyTorch DQN</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym, numpy <span class="kw">as</span> np, torch, torch.nn <span class="kw">as</span> nn
<span class="kw">from</span> collections <span class="kw">import</span> deque
<span class="kw">import</span> random

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>)
S_DIM, A_DIM = <span class="num">4</span>, <span class="num">2</span>

<span class="kw">class</span> <span class="fn">QNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.net = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(S_DIM,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>,<span class="num">128</span>), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(<span class="num">128</span>, A_DIM))
    <span class="kw">def</span> <span class="fn">forward</span>(self, x): <span class="kw">return</span> self.<span class="fn">net</span>(x)

q, q_tgt = <span class="fn">QNet</span>(), <span class="fn">QNet</span>()
q_tgt.<span class="fn">load_state_dict</span>(q.<span class="fn">state_dict</span>())
opt = torch.optim.<span class="fn">Adam</span>(q.<span class="fn">parameters</span>(), lr=<span class="num">1e-3</span>)
buf = <span class="fn">deque</span>(maxlen=<span class="num">10000</span>)
gamma, batch = <span class="num">0.99</span>, <span class="num">64</span>

<span class="kw">def</span> <span class="fn">act</span>(s, eps):
    <span class="kw">if</span> random.<span class="fn">random</span>() &lt; eps: <span class="kw">return</span> env.action_space.<span class="fn">sample</span>()
    <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
        <span class="kw">return</span> <span class="fn">int</span>(<span class="fn">q</span>(torch.<span class="fn">tensor</span>(s, dtype=torch.float32)).<span class="fn">argmax</span>())

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(<span class="num">400</span>):
    s, _ = env.<span class="fn">reset</span>(); done=<span class="kw">False</span>; G=<span class="num">0</span>
    eps = <span class="fn">max</span>(<span class="num">0.05</span>, <span class="num">1.0</span> - ep/<span class="num">250</span>)
    <span class="kw">while</span> <span class="kw">not</span> done:
        a = <span class="fn">act</span>(s, eps)
        s2, r, term, trunc, _ = env.<span class="fn">step</span>(a); done=term <span class="kw">or</span> trunc
        buf.<span class="fn">append</span>((s,a,r,s2,done)); G += r; s=s2
        <span class="kw">if</span> <span class="fn">len</span>(buf) &gt;= batch:
            mb = random.<span class="fn">sample</span>(buf, batch)
            ss, aa, rr, ss2, dd = <span class="fn">map</span>(np.array, <span class="fn">zip</span>(*mb))
            ss = torch.<span class="fn">tensor</span>(ss, dtype=torch.float32)
            ss2 = torch.<span class="fn">tensor</span>(ss2, dtype=torch.float32)
            aa = torch.<span class="fn">tensor</span>(aa, dtype=torch.long)
            rr = torch.<span class="fn">tensor</span>(rr, dtype=torch.float32)
            dd = torch.<span class="fn">tensor</span>(dd, dtype=torch.float32)
            q_pred = <span class="fn">q</span>(ss).<span class="fn">gather</span>(<span class="num">1</span>, aa.<span class="fn">unsqueeze</span>(<span class="num">1</span>)).<span class="fn">squeeze</span>(<span class="num">1</span>)
            <span class="kw">with</span> torch.<span class="fn">no_grad</span>():
                q_next = <span class="fn">q_tgt</span>(ss2).<span class="fn">max</span>(<span class="num">1</span>).values
                target = rr + gamma * q_next * (<span class="num">1</span> - dd)
            loss = nn.functional.<span class="fn">mse_loss</span>(q_pred, target)
            opt.<span class="fn">zero_grad</span>(); loss.<span class="fn">backward</span>(); opt.<span class="fn">step</span>()
    <span class="kw">if</span> ep % <span class="num">10</span> == <span class="num">0</span>:
        q_tgt.<span class="fn">load_state_dict</span>(q.<span class="fn">state_dict</span>())
        <span class="fn">print</span>(f<span class="str">"ep={ep} getiri={G:.0f} eps={eps:.2f}"</span>)</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">PyTorch DQN is blocked. We approximate it with sklearn MLPRegressor as the Q-function on a 5-state chain.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.neural_network import MLPRegressor
rng = np.random.default_rng(0)
N_STATES, N_ACTIONS = 5, 2
def step(s, a):
    ns = max(0, min(N_STATES-1, s + (1 if a == 1 else -1)))
    r = 1.0 if ns == N_STATES-1 else -0.05
    return ns, r, ns == N_STATES-1
X, y = [], []
for ep in range(200):
    s = 0
    for _ in range(20):
        a = rng.integers(0, 2)
        ns, r, done = step(s, a)
        X.append([s, a]); y.append(r + 0.9 * (0 if done else (N_STATES-1-ns)*0.1))
        s = ns
        if done: break
Q = MLPRegressor(hidden_layer_sizes=(16,), max_iter=300, random_state=0).fit(X, y)
print('Q(0,right):', round(float(Q.predict([[0,1]])[0]), 3))
print('Q(0,left ):', round(float(Q.predict([[0,0]])[0]), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Akışı izleyelim:</strong> 1) Aynı mimaride iki MLP kur — çevrimiçi q ve dondurulmuş q_tgt. 2) ε-greedy ile bir bölüm yürüt. 3) Her (s,a,r,s',bitti) demetini 10k FIFO buffer'a yaz. 4) Yeterli örnek olunca rastgele 64'lük batch çek. 5) Çevrimiçi ağdan tahmin Q(s,a)'yı, dondurulmuş ağdan hedef r + γ max Q_tgt(s',·)'i hesapla. 6) MSE kayıp, Adam adımı. 7) Her 10 bölümde target ağa ağırlıkları kopyala. CartPole yaklaşık 200 bölümde çözülür (getiri ≈ 500).</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Modern DQN Çeşitleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Double DQN</div><div class="card-body">a*'yi seçmek için çevrimiçi ağ, Q'yu değerlendirmek için target ağ. Aşırı tahmin yanlılığını azaltır.</div></div>
<div class="calc-card"><div class="card-title">Dueling DQN</div><div class="card-body">Q(s,a) = V(s) + A(s,a) ayrıştır. Benzer-değerli çok eylemde daha iyi.</div></div>
<div class="calc-card"><div class="card-title">Prioritized Replay</div><div class="card-body">Yüksek TD hatalı geçişleri daha sık örnekle. Atari'de ~2× hız.</div></div>
<div class="calc-card"><div class="card-title">Rainbow</div><div class="card-body">6 iyileştirmeyi birleştirir. Dağıtımsal yöntemlere kadar değer-bazlı RL'de SOTA.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Eğitim Eğrisi</h2>
<div id="rl6-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Tipik CartPole DQN öğrenme eğrisi. Varyansa dikkat — DQN stabil olmayabilir; birden fazla seed denemek akıllıca.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Kısıtlar</h2>
<p class="l-text">DQN sadece kesikli eylemleri yönetir. Sürekli kontrol için (robot torkları) policy gradient gerekir. DQN ayrıca Q değerlerini fazla tahmin edebilir (maks yanlılık) ve model-bazlı yöntemlere kıyasla örnek-verimsizdir. Ama yönetilebilir kesikli eylem kümeli problemlerde güçlü bir taban olarak kalır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> DQN = sinir ağlı Q-learning Q_θ(s).<br><strong>2.</strong> Replay buffer örnekleri ilişkisizleştirir ve deneyimi yeniden kullanır.<br><strong>3.</strong> Target network bootstrap hedefini dondurur → stabil bootstrap.<br><strong>4.</strong> Kayıp: Q_θ(s,a) ile r + γ max Q_θ⁻(s',a') arasında MSE.<br><strong>5.</strong> CartPole ~200 bölümde ~50 satır PyTorch ile çözülür.<br><strong>6.</strong> Çeşitler (Double, Dueling, Prioritized, Rainbow) ölçülebilir kazançlar verir; temel DQN zemindir.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
