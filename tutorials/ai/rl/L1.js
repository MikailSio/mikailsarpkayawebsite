window.RL_L1 = {

en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Expected Value &amp; Variance</a> <span style="opacity:0.55;font-size:0.82em">(Math L101)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrices</a> <span style="opacity:0.55;font-size:0.82em">(Math L72)</span></li>
</ul>
</div>
<p class="l-text"><strong>AlphaGo beat Lee Sedol in 2016. ChatGPT learned to be polite via RLHF. Boston Dynamics robots learn to walk by falling.</strong> What unites these systems is Reinforcement Learning — a paradigm where machines learn by acting in an environment and receiving feedback.</p>
<p class="l-text">In this first lesson you will learn the fundamental RL loop, the key components (agent, environment, state, action, reward, policy), and how RL differs from supervised and unsupervised learning.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trace the agent-environment loop with state, action, and reward at each step</li>
<li>Distinguish RL from supervised and unsupervised learning by feedback type</li>
<li>Define a policy as a function from states to action probabilities</li>
<li>Connect AlphaGo, RLHF in ChatGPT, and Boston Dynamics to one shared paradigm</li>
<li>Run a tiny Gymnasium episode and inspect the (s, a, r, s') tuples</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why RL Matters</h2>
<p class="l-text">RL solves problems where the correct answer is not labeled, but consequences exist. A robot does not have a teacher saying "move left, now right" — it tries, falls, and gets a reward signal. The same idea trained ChatGPT to follow human preferences and trained DeepMind agents to master 57 Atari games from raw pixels.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Game playing</div><div class="card-body">AlphaGo, AlphaZero, MuZero — superhuman board game and Atari performance.</div></div>
<div class="calc-card"><div class="card-title">Robotics</div><div class="card-body">Locomotion, manipulation, dexterous hands. Sim-to-real transfer.</div></div>
<div class="calc-card"><div class="card-title">LLM alignment</div><div class="card-body">RLHF turns a raw language model into a helpful assistant.</div></div>
<div class="calc-card"><div class="card-title">Recommendation</div><div class="card-body">YouTube, news feeds — bandit and contextual RL flavors.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Agent–Environment Loop</h2>
<p class="l-text">At every time step t the agent observes a state S_t, picks an action A_t, then the environment returns a new state S_{t+1} and a reward R_{t+1}. The cycle repeats. The agent's job is to choose actions that maximize cumulative reward over time.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">State S_t</div><div class="card-body">What the agent sees right now (game pixels, robot joint angles, conversation tokens).</div></div>
<div class="calc-card"><div class="card-title">Action A_t</div><div class="card-body">What the agent can do (move left, apply torque, generate next token).</div></div>
<div class="calc-card"><div class="card-title">Reward R_{t+1}</div><div class="card-body">A scalar number sent by the environment after the action.</div></div>
<div class="calc-card"><div class="card-title">Policy π</div><div class="card-body">A function S → A that says "in state s, pick action a with probability π(a|s)".</div></div>
</div>
<p class="l-text">This is the entire abstraction. Everything else in RL is a clever way of estimating one of these quantities or improving the policy.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. RL vs Supervised vs Unsupervised</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Supervised</div><div class="card-body">Each input has a correct label (cat / dog). Learn input → label.</div></div>
<div class="calc-card"><div class="card-title">Unsupervised</div><div class="card-body">No labels. Find structure (clusters, embeddings, density).</div></div>
<div class="calc-card"><div class="card-title">Reinforcement</div><div class="card-body">No labels, but a reward signal. Learn behavior, not classification.</div></div>
</div>
<p class="l-text">Two complications make RL harder than supervised learning. First, the data the agent sees depends on the policy it is currently following — non i.i.d. samples. Second, rewards may be sparse and delayed: a chess move's value is only known many steps later.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Tabular vs Deep RL</h2>
<p class="l-text">Tabular RL stores values for every state-action pair in a literal table. This works for tiny problems (gridworlds, small games) and gives strong theoretical guarantees. Deep RL replaces the table with a neural network that generalizes to unseen states — required for Atari, Go, robotics, and language. The conceptual algorithms are the same; only the function approximator changes.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tabular</div><div class="card-body">Q(s,a) is a numpy array. Convergence is provable. Limited to small state spaces.</div></div>
<div class="calc-card"><div class="card-title">Deep</div><div class="card-body">Q(s,a) is a neural network. Scales to images and language. Requires tricks (replay buffer, target net).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hands-on: Gymnasium CartPole</h2>
<p class="l-text">Gymnasium (Gym's successor) is the standard RL environment library. CartPole is the "hello world" — balance a pole on a cart by pushing left or right.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>, render_mode=<span class="str">"human"</span>)
observation, info = env.<span class="fn">reset</span>(seed=<span class="num">42</span>)

total_reward = <span class="num">0</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    <span class="cm"># Random policy: pick 0 (left) or 1 (right) uniformly</span>
    action = env.action_space.<span class="fn">sample</span>()
    observation, reward, terminated, truncated, info = env.<span class="fn">step</span>(action)
    total_reward += reward
    <span class="kw">if</span> terminated <span class="kw">or</span> truncated:
        <span class="fn">print</span>(f<span class="str">"Episode ended at step {step}, total reward = {total_reward}"</span>)
        observation, info = env.<span class="fn">reset</span>()
        total_reward = <span class="num">0</span>

env.<span class="fn">close</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gymnasium is blocked. We replicate the Agent-Env loop by hand on a tiny 1-D 'CartPole-lite' state with a random policy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
state = np.array([0.0, 0.0])               # [x, x_dot]
total = 0
for step in range(200):
    action = rng.integers(0, 2)            # 0=left 1=right
    force = 1.0 if action == 1 else -1.0
    state[1] += 0.02 * force + 0.01 * rng.standard_normal()
    state[0] += 0.02 * state[1]
    reward = 1.0
    total += reward
    if abs(state[0]) &gt; 2.4:
        print(f'Episode ended at step {step}, total reward = {total}')
        break
else:
    print(f'Survived all 200 steps, total reward = {total}')</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Create a CartPole environment with a visual window. 2) Reset to get the initial state (4 numbers: cart position, cart velocity, pole angle, pole angular velocity). 3) Loop: sample a random action, send it to the env, receive (next state, reward, done flags). 4) Reward is +1 per step the pole stays up. A random policy survives roughly 20–30 steps.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Exploration–Exploitation Trade-off</h2>
<p class="l-text">If the agent always picks what currently looks best (exploit), it never discovers a better strategy. If it always tries new things (explore), it never cashes in on what it learned. This tension is fundamental and shows up in every RL algorithm. We will see ε-greedy, UCB, Thompson sampling, and entropy bonuses as concrete answers.</p>
<div class="think-box"><div class="think-label">INTUITION</div><div class="think-body">Imagine eating at restaurants in a new city. Always going to your one good spot is exploitation. Trying a new place each night is exploration. The smart move is mostly exploit, occasionally explore.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Episode Length Visualization</h2>
<p class="l-text">A random policy on CartPole produces short episodes. After we learn a policy in later lessons, episodes will reach the maximum 500 steps.</p>
<div id="rl1-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> RL = agent acts in an environment and learns from a scalar reward.<br><strong>2.</strong> Core symbols: state S, action A, reward R, policy π.<br><strong>3.</strong> Different from supervised (no labels) and unsupervised (no signal at all).<br><strong>4.</strong> Tabular RL = arrays; Deep RL = neural networks. Same ideas.<br><strong>5.</strong> Gymnasium gives us a sandbox; CartPole is our first toy.<br><strong>6.</strong> Exploration vs exploitation is the central tension.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var x = Array.from({length:30}, (_,i)=>i+1);
  var rand = x.map(()=> 15 + Math.random()*20);
  var learned = x.map(i=> Math.min(500, 30 + i*16 + Math.random()*15));
  var data = [
    {x:x,y:rand,name:'Random policy',type:'scatter',mode:'lines+markers',line:{color:'#888'}},
    {x:x,y:learned,name:'Learned policy',type:'scatter',mode:'lines+markers',line:{color:T.accent}}
  ];
  var layout = {title:'CartPole episode length over training',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'Steps survived',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl1-plot-en','rl1-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Beklenen Değer</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L101)</span></li>
<li><a href="/tutorials/matematik/72" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Matrisler</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L72)</span></li>
</ul>
</div>
<p class="l-text"><strong>2016'da AlphaGo, Lee Sedol'u yendi. ChatGPT, RLHF sayesinde nazik olmayı öğrendi. Boston Dynamics robotları düşe kalka yürümeyi öğrendi.</strong> Bu sistemleri birleştiren şey Pekiştirmeli Öğrenme — makinelerin bir ortamda eylemler yaparak ve geri bildirim alarak öğrendiği bir paradigma.</p>
<p class="l-text">Bu ilk derste temel RL döngüsünü, anahtar bileşenleri (ajan, ortam, durum, eylem, ödül, politika) ve RL'nin denetimli/denetimsiz öğrenmeden nasıl ayrıldığını öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her adımda durum, eylem ve ödülle ajan-ortam döngüsünü izlemeyi</li>
<li>RL'yi geri bildirim türüne göre denetimli ve denetimsiz öğrenmeden ayırt etmeyi</li>
<li>Politikayı, durumlardan eylem olasılıklarına bir fonksiyon olarak tanımlamayı</li>
<li>AlphaGo, ChatGPT'deki RLHF ve Boston Dynamics'i tek bir paradigmada birleştirmeyi</li>
<li>Küçük bir Gymnasium bölümü çalıştırıp (s, a, r, s') tuple'larını incelemeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. RL Neden Önemli?</h2>
<p class="l-text">RL, doğru cevabın etiketlenmediği ama sonuçların var olduğu problemleri çözer. Bir robotun "şimdi sola git, şimdi sağa" diyen bir öğretmeni yoktur — dener, düşer ve bir ödül sinyali alır. Aynı fikir ChatGPT'yi insan tercihlerine uyumlu hale getirdi ve DeepMind ajanlarına 57 Atari oyununu ham piksellerden ustalaştırdı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Oyun oynama</div><div class="card-body">AlphaGo, AlphaZero, MuZero — masa oyunları ve Atari'de insanüstü performans.</div></div>
<div class="calc-card"><div class="card-title">Robotik</div><div class="card-body">Hareket, manipülasyon, becerikli eller. Simülasyondan gerçeğe transfer.</div></div>
<div class="calc-card"><div class="card-title">LLM hizalama</div><div class="card-body">RLHF, ham bir dil modelini yardımcı bir asistana çevirir.</div></div>
<div class="calc-card"><div class="card-title">Öneri sistemleri</div><div class="card-body">YouTube, haber akışları — bandit ve bağlamsal RL çeşitleri.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ajan–Ortam Döngüsü</h2>
<p class="l-text">Her zaman adımı t'de ajan bir durum S_t gözlemler, bir eylem A_t seçer, ortam yeni bir durum S_{t+1} ve ödül R_{t+1} döndürür. Döngü tekrarlanır. Ajanın görevi, zaman içinde toplam ödülü maksimize eden eylemleri seçmektir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum S_t</div><div class="card-body">Ajanın şu an gördüğü şey (oyun pikselleri, robot eklem açıları, konuşma tokenleri).</div></div>
<div class="calc-card"><div class="card-title">Eylem A_t</div><div class="card-body">Ajanın yapabileceği şey (sola git, tork uygula, sonraki tokeni üret).</div></div>
<div class="calc-card"><div class="card-title">Ödül R_{t+1}</div><div class="card-body">Eylemden sonra ortam tarafından gönderilen skaler bir sayı.</div></div>
<div class="calc-card"><div class="card-title">Politika π</div><div class="card-body">"s durumunda π(a|s) olasılığıyla a eylemini seç" diyen S → A fonksiyonu.</div></div>
</div>
<p class="l-text">Tüm soyutlama bu kadar. RL'deki diğer her şey, bu büyüklüklerden birini tahmin etmenin ya da politikayı iyileştirmenin akıllı bir yoludur.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. RL vs Denetimli vs Denetimsiz</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Denetimli</div><div class="card-body">Her girdinin doğru bir etiketi var (kedi / köpek). Girdi → etiket öğrenilir.</div></div>
<div class="calc-card"><div class="card-title">Denetimsiz</div><div class="card-body">Etiket yok. Yapı bulunur (kümeler, gömmeler, yoğunluk).</div></div>
<div class="calc-card"><div class="card-title">Pekiştirmeli</div><div class="card-body">Etiket yok ama ödül sinyali var. Sınıflandırma değil, davranış öğrenilir.</div></div>
</div>
<p class="l-text">İki şey RL'yi denetimli öğrenmeden zorlaştırır. Birincisi, ajanın gördüğü veri o anki politikaya bağlıdır — i.i.d. olmayan örnekler. İkincisi, ödüller seyrek ve gecikmeli olabilir: bir satranç hamlesinin değeri ancak çok adım sonra anlaşılır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Tablo Tabanlı vs Derin RL</h2>
<p class="l-text">Tablo tabanlı RL her durum-eylem çifti için değerleri gerçek bir tabloda saklar. Bu küçük problemler (gridworld, küçük oyunlar) için işe yarar ve güçlü teorik garantiler verir. Derin RL ise tabloyu görülmemiş durumlara genelleyen bir sinir ağıyla değiştirir — Atari, Go, robotik ve dil için zorunludur. Kavramsal algoritmalar aynı; sadece fonksiyon yaklaştırıcı değişir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tablo tabanlı</div><div class="card-body">Q(s,a) bir numpy dizisidir. Yakınsama kanıtlanabilir. Küçük durum uzayıyla sınırlı.</div></div>
<div class="calc-card"><div class="card-title">Derin</div><div class="card-body">Q(s,a) bir sinir ağıdır. Görüntü ve dile ölçeklenir. Hileler gerektirir (replay buffer, target net).</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Uygulama: Gymnasium CartPole</h2>
<p class="l-text">Gymnasium (Gym'in halefi) standart RL ortam kütüphanesidir. CartPole "merhaba dünya"sıdır — bir arabayı sola sağa iterek üstündeki çubuğu dengele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym

env = gym.<span class="fn">make</span>(<span class="str">"CartPole-v1"</span>, render_mode=<span class="str">"human"</span>)
observation, info = env.<span class="fn">reset</span>(seed=<span class="num">42</span>)

total_reward = <span class="num">0</span>
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
    <span class="cm"># Rastgele politika: 0 (sol) ya da 1 (sag) esit olasilikla</span>
    action = env.action_space.<span class="fn">sample</span>()
    observation, reward, terminated, truncated, info = env.<span class="fn">step</span>(action)
    total_reward += reward
    <span class="kw">if</span> terminated <span class="kw">or</span> truncated:
        <span class="fn">print</span>(f<span class="str">"Bolum {step}. adimda bitti, toplam odul = {total_reward}"</span>)
        observation, info = env.<span class="fn">reset</span>()
        total_reward = <span class="num">0</span>

env.<span class="fn">close</span>()</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gymnasium engellendi. Agent-Env döngüsünü elle taklit ediyoruz — küçük 1-B 'CartPole-lite' durumu üzerinde rastgele politika ile.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
state = np.array([0.0, 0.0])               # [x, x_dot]
total = 0
for step in range(200):
    action = rng.integers(0, 2)            # 0=left 1=right
    force = 1.0 if action == 1 else -1.0
    state[1] += 0.02 * force + 0.01 * rng.standard_normal()
    state[0] += 0.02 * state[1]
    reward = 1.0
    total += reward
    if abs(state[0]) &gt; 2.4:
        print(f'Episode ended at step {step}, total reward = {total}')
        break
else:
    print(f'Survived all 200 steps, total reward = {total}')</code></pre></div>
</div>
<p class="l-text"><strong>Adım adım inceleyelim:</strong> 1) Görsel pencereli bir CartPole ortamı oluştur. 2) Reset ile başlangıç durumunu al (4 sayı: araba pozisyonu, araba hızı, çubuk açısı, açısal hız). 3) Döngü: rastgele eylem örnekle, ortama gönder, (sonraki durum, ödül, bitiş bayrakları) al. 4) Çubuk ayakta kaldığı her adım için +1 ödül. Rastgele politika yaklaşık 20–30 adım dayanır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Keşif–Sömürü Dengesi</h2>
<p class="l-text">Ajan her zaman şu an en iyi görünen eylemi seçerse (sömürü) daha iyi bir strateji asla keşfedemez. Her zaman yeni şeyler denerse (keşif) öğrendiklerini asla nakde çeviremez. Bu gerilim temel bir sorundur ve her RL algoritmasında karşımıza çıkar. ε-greedy, UCB, Thompson örneklemesi ve entropi bonusu gibi somut cevapları göreceğiz.</p>
<div class="think-box"><div class="think-label">SEZGİ</div><div class="think-body">Yeni bir şehirde restoranlarda yemek yediğini düşün. Hep tek favori mekânına gitmek sömürüdür. Her gece yeni yer denemek keşiftir. Akıllıca olan çoğunlukla sömürmek, ara sıra keşfetmektir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bölüm Uzunluğu Görselleştirmesi</h2>
<p class="l-text">CartPole'da rastgele politika kısa bölümler üretir. İleriki derslerde bir politika öğrendiğimizde bölümler maksimum 500 adıma ulaşacak.</p>
<div id="rl1-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> RL = ajan ortamda eyler ve skaler ödülden öğrenir.<br><strong>2.</strong> Çekirdek semboller: durum S, eylem A, ödül R, politika π.<br><strong>3.</strong> Denetimliden (etiket yok) ve denetimsizden (sinyal hiç yok) farklı.<br><strong>4.</strong> Tablo tabanlı RL = diziler; Derin RL = sinir ağları. Aynı fikirler.<br><strong>5.</strong> Gymnasium bize bir kum havuzu verir; CartPole ilk oyuncağımız.<br><strong>6.</strong> Keşif vs sömürü merkezi gerilimdir.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
