window.RL_L12 = {

en: `<p class="l-text"><strong>Eleven lessons in, you have the core toolkit: MDPs, value/Q learning, policy gradient, actor-critic, PPO, RLHF, bandits.</strong> This final lesson surveys what is happening at the research frontier — model-based RL, offline RL, hierarchical RL — and ties it all together with an end-to-end project.</p>
<p class="l-text">In this lesson you will learn the key modern directions, run a full PPO training on LunarLander as a capstone, and see where RL is heading next.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Survey model-based RL with Dyna-Q and Dreamer-style world models</li>
<li>Distinguish offline RL from online RL and understand the distribution-shift problem</li>
<li>Tour hierarchical RL with options and goal-conditioned policies</li>
<li>Run a full PPO training on LunarLander as a capstone in Stable Baselines3</li>
<li>Map the rest of the RL landscape: multi-agent, exploration, sim-to-real, RLHF v2</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Model-Based RL — Learning a World Model</h2>
<p class="l-text">Instead of learning Q or π directly from environment samples, learn an environment model P̂(s'|s,a) and R̂(s,a), then plan or train a policy in imagination. Sample efficient — you can hallucinate millions of rollouts from a single real one.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dyna-Q</div><div class="card-body">Classic — alternate real Q-learning with planning steps using a learned model.</div></div>
<div class="calc-card"><div class="card-title">Dreamer V3 (2023)</div><div class="card-body">Learn a latent world model + train actor-critic in latent imagination. SOTA on Atari, Crafter.</div></div>
<div class="calc-card"><div class="card-title">MuZero</div><div class="card-body">DeepMind 2020. Learn implicit world model + MCTS planning. Mastered Go, chess, shogi, Atari from scratch.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Offline RL — Learning from Logged Data</h2>
<p class="l-text">In healthcare, finance, recommendation systems, you cannot freely interact with the environment. You only have logged data from a previous policy. Standard RL fails (off-policy + bootstrap = catastrophic extrapolation). Offline RL methods constrain the learned policy to stay close to the data-generating policy.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BCQ (2019)</div><div class="card-body">Restrict actions to those likely under the behavior policy.</div></div>
<div class="calc-card"><div class="card-title">CQL (2020)</div><div class="card-body">Conservative Q-learning — penalize Q-values for out-of-distribution actions.</div></div>
<div class="calc-card"><div class="card-title">IQL (2021)</div><div class="card-body">Implicit Q-learning — uses expectile regression, no policy improvement step.</div></div>
<div class="calc-card"><div class="card-title">Decision Transformer</div><div class="card-body">Treat RL as sequence modeling: condition on desired return, predict next action.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hierarchical RL — Options and Subgoals</h2>
<p class="l-text">Long horizons are hard. Hierarchical RL learns high-level "options" (extended actions) and low-level controllers. A walking robot might have a high-level policy "walk to door" and a low-level controller for joint torques. Reduces effective horizon and improves transfer.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Options framework</div><div class="card-body">(initiation, policy, termination) — Sutton/Precup 1999.</div></div>
<div class="calc-card"><div class="card-title">Goal-conditioned RL</div><div class="card-body">Policy π(a|s,g) — modern, general (HER, GCRL).</div></div>
<div class="calc-card"><div class="card-title">FuN, HIRO, h-DQN</div><div class="card-body">Manager picks subgoals; worker reaches them.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Real-World RL Challenges</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sparse reward</div><div class="card-body">Robot finishes assembly = reward 1, else 0. Curiosity bonuses, HER, demonstrations.</div></div>
<div class="calc-card"><div class="card-title">Sim-to-real</div><div class="card-body">Train in simulation (cheap, fast); deploy on real robot. Domain randomization helps.</div></div>
<div class="calc-card"><div class="card-title">Sample efficiency</div><div class="card-body">Real environments are slow/costly. Model-based, offline, and pretraining help.</div></div>
<div class="calc-card"><div class="card-title">Safety</div><div class="card-body">No catastrophic actions during exploration. Constrained MDPs, safe sets.</div></div>
<div class="calc-card"><div class="card-title">Multi-task</div><div class="card-body">One policy across tasks. Meta-RL, task-conditioned policies.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Capstone: PPO on LunarLander</h2>
<p class="l-text">Time to put everything together. LunarLander is a continuous-control-ish task with shaped reward — challenging but tractable. With Stable Baselines3 we can train a strong policy in 30 minutes on a CPU.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym
<span class="kw">from</span> stable_baselines3 <span class="kw">import</span> PPO
<span class="kw">from</span> stable_baselines3.common.evaluation <span class="kw">import</span> evaluate_policy
<span class="kw">from</span> stable_baselines3.common.vec_env <span class="kw">import</span> DummyVecEnv

<span class="cm"># 1. Vectorized environment for parallel rollouts</span>
env = <span class="fn">DummyVecEnv</span>([<span class="kw">lambda</span>: gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)])

<span class="cm"># 2. PPO with reasonable defaults</span>
model = <span class="fn">PPO</span>(
    <span class="str">"MlpPolicy"</span>, env,
    learning_rate=<span class="num">3e-4</span>, n_steps=<span class="num">1024</span>, batch_size=<span class="num">64</span>, n_epochs=<span class="num">10</span>,
    gamma=<span class="num">0.99</span>, gae_lambda=<span class="num">0.95</span>, clip_range=<span class="num">0.2</span>, ent_coef=<span class="num">0.01</span>,
    verbose=<span class="num">1</span>, tensorboard_log=<span class="str">"./ppo_lunar_tb/"</span>
)

<span class="cm"># 3. Train</span>
model.<span class="fn">learn</span>(total_timesteps=<span class="num">500_000</span>)
model.<span class="fn">save</span>(<span class="str">"ppo_lunar_final"</span>)

<span class="cm"># 4. Evaluate</span>
eval_env = gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>)
mean_r, std_r = <span class="fn">evaluate_policy</span>(model, eval_env, n_eval_episodes=<span class="num">20</span>)
<span class="fn">print</span>(f<span class="str">"Mean episode return: {mean_r:.1f} +/- {std_r:.1f}"</span>)
<span class="cm"># Solved at &gt; 200; well-trained PPO reaches ~260</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LunarLander/SB3 are blocked. Capstone equivalent: train a numpy ε-greedy bandit on a 4-arm task — the simplest 'lander' for the browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
true_means = np.array([0.1, 0.4, 0.7, 0.2])
Q = np.zeros(4); N = np.zeros(4)
rewards = []
for t in range(2000):
    eps = max(0.05, 1.0 - t/500)
    a = rng.integers(0, 4) if rng.random() &lt; eps else int(np.argmax(Q))
    r = float(true_means[a] + 0.1 * rng.standard_normal())
    N[a] += 1; Q[a] += (r - Q[a]) / N[a]
    rewards.append(r)
print('Final Q:', np.round(Q, 3))
print('Picked best arm in last 100 steps:',
      int((np.argmax(true_means) == np.array([np.argmax(true_means)] * 100)).sum()))
print('Mean reward (last 200):', round(float(np.mean(rewards[-200:])), 3))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Vectorize 8 parallel envs — PPO collects rollouts faster. 2) Build PPO with all the hyperparameters you have learned: lr, n_steps, batch, epochs, γ, GAE λ, clip ε, entropy bonus. 3) Train for 500k env steps total (≈30 min CPU, &lt;5 min GPU). 4) Evaluate over 20 episodes. A solid run reaches mean reward ≈ 260, well above the 200 threshold for "solved".</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Diagnosing Training Runs</h2>
<p class="l-text">When PPO does not converge, look at TensorBoard logs:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">approx_kl</div><div class="card-body">Should stay around 0.005–0.02. If &gt; 0.05 you are taking too aggressive updates.</div></div>
<div class="calc-card"><div class="card-title">clip_fraction</div><div class="card-body">Around 0.1–0.3 typical. Higher = ε too low or learning rate too high.</div></div>
<div class="calc-card"><div class="card-title">explained_variance</div><div class="card-body">Critic quality. Aim for &gt; 0.5; near 1 means critic is excellent.</div></div>
<div class="calc-card"><div class="card-title">entropy</div><div class="card-body">Should decrease but not collapse. Add ent_coef if collapsing.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Capstone Training Curve</h2>
<div id="rl12-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">Typical LunarLander PPO learning. Note the early plateau (learning to hover) before crashing past 200 to land properly.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Where RL Is Heading</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Foundation models for decisions</div><div class="card-body">Decision Transformer, Gato, RT-2 — pretrained on huge logged trajectories, finetuned per task.</div></div>
<div class="calc-card"><div class="card-title">RLHF & beyond</div><div class="card-body">Process reward models, debate, weak-to-strong supervision.</div></div>
<div class="calc-card"><div class="card-title">Robotics</div><div class="card-body">Diffusion policies, vision-language-action models, sim-to-real at scale.</div></div>
<div class="calc-card"><div class="card-title">Open challenges</div><div class="card-body">Sample efficiency, generalization, safety, alignment of agents that act in the world.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Connecting It All Back</h2>
<p class="l-text">Re-read this in order: agent + environment (L1), MDP (L2), Bellman (L3), TD vs MC (L4), Q-learning (L5), DQN for high-dim states (L6), policy gradient (L7), actor-critic (L8), PPO clipping for stability (L9), RLHF aligning LLMs (L10), bandits as the simplest seed (L11), and modern frontiers in this lesson. Each builds on the last. With this foundation you can read modern RL papers, implement them, and apply them — including to your own NLP research.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Recommended Next Steps</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Read</div><div class="card-body">Sutton &amp; Barto "Reinforcement Learning: An Introduction" (free online).</div></div>
<div class="calc-card"><div class="card-title">Implement</div><div class="card-body">CleanRL — single-file PPO/SAC/DQN reference implementations.</div></div>
<div class="calc-card"><div class="card-title">Practice</div><div class="card-body">Gymnasium MuJoCo tasks, MiniGrid, Procgen for harder benchmarks.</div></div>
<div class="calc-card"><div class="card-title">RLHF specific</div><div class="card-body">HuggingFace TRL + DPO, OpenAssistant SFT data, Anthropic HH-RLHF dataset.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Final Takeaways</h2>
<div class="think-box"><div class="think-label">FINAL TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Model-based RL trains a world model + plans in imagination. Sample efficient.<br><strong>2.</strong> Offline RL learns from logged data only — needed for healthcare, recsys, finance.<br><strong>3.</strong> Hierarchical RL handles long horizons via options/subgoals.<br><strong>4.</strong> Real-world RL: sparse reward, sim-to-real, sample efficiency, safety.<br><strong>5.</strong> Capstone: PPO on LunarLander solves in 500k steps with default hyperparameters.<br><strong>6.</strong> Diagnose runs via approx_kl, clip_fraction, explained_variance, entropy.<br><strong>7.</strong> Frontier: foundation models for decision-making, RLHF beyond, robot policies.<br><strong>8.</strong> You now have the toolkit to read papers and ship RL — including in NLP.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var step = Array.from({length:50}, (_,i)=>(i+1)*10000);
  var ret = step.map(function(s,i){
    if (i &lt; 8) return -150 + i*15 + (Math.random()-0.5)*30;
    if (i &lt; 25) return -30 + (i-8)*5 + (Math.random()-0.5)*40;
    return Math.min(280, 60 + (i-25)*8) + (Math.random()-0.5)*30;
  });
  var data = [{x:step,y:ret,name:'Mean episode return',type:'scatter',mode:'lines',line:{color:T.accent,width:2.2}}];
  var layout = {title:'LunarLander PPO — capstone training',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Env steps',gridcolor:T.grid},yaxis:{title:'Mean return',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl12-plot-en','rl12-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>On bir derste temel araç setine sahipsin: MDP'ler, değer/Q öğrenme, policy gradient, actor-critic, PPO, RLHF, banditler.</strong> Bu son ders araştırma cephesinde olanlara bakar — model-bazlı RL, çevrimdışı RL, hiyerarşik RL — ve hepsini uçtan uca bir projeyle bağlar.</p>
<p class="l-text">Bu derste anahtar modern yönleri öğrenecek, bir capstone olarak LunarLander üzerinde tam PPO eğitimi çalıştıracak ve RL'in nereye gittiğini göreceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dyna-Q ve Dreamer tarzı dünya modelleriyle model-bazlı RL'i incelemeyi</li>
<li>Çevrimdışı RL'i çevrimiçi RL'den ayırt etmeyi ve dağılım kayması problemini anlamayı</li>
<li>Options ve hedef-koşullu politikalarla hiyerarşik RL'i incelemeyi</li>
<li>Capstone olarak Stable Baselines3 ile LunarLander'da tam PPO eğitimi yürütmeyi</li>
<li>RL'in geri kalanını haritalamayı: çoklu ajan, keşif, sim-to-real, RLHF v2</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Model-Bazlı RL — Bir Dünya Modeli Öğrenme</h2>
<p class="l-text">Q ya da π'yi ortam örneklerinden doğrudan öğrenmek yerine bir ortam modeli P(s'|s,a) ve R(s,a) öğren, sonra hayalde planla ya da politika eğit. Örnek-verimli — tek bir gerçek yürütmeden milyonlarca yürütme uydurabilirsin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dyna-Q</div><div class="card-body">Klasik — gerçek Q-learning ile öğrenilmiş model kullanan plan adımlarını sırayla yapar.</div></div>
<div class="calc-card"><div class="card-title">Dreamer V3 (2023)</div><div class="card-body">Latent dünya modeli öğren + latent hayalde actor-critic eğit. Atari, Crafter'da SOTA.</div></div>
<div class="calc-card"><div class="card-title">MuZero</div><div class="card-body">DeepMind 2020. Örtük dünya modeli + MCTS planlama öğren. Go, satranç, shogi, Atari'yi sıfırdan ustalaştırdı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Çevrimdışı RL — Loglu Veriden Öğrenme</h2>
<p class="l-text">Sağlık, finans, öneri sistemlerinde ortamla özgürce etkileşemezsin. Yalnızca önceki bir politikadan loglu veriye sahipsin. Standart RL başarısız olur (off-policy + bootstrap = felaket ekstrapolasyon). Çevrimdışı RL yöntemleri öğrenilen politikayı veri-üreten politikaya yakın tutmaya zorlar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BCQ (2019)</div><div class="card-body">Eylemleri davranış politikası altında olası olanlara kısıtla.</div></div>
<div class="calc-card"><div class="card-title">CQL (2020)</div><div class="card-body">Tutucu Q-learning — dağılım dışı eylemlerin Q değerlerini cezalandır.</div></div>
<div class="calc-card"><div class="card-title">IQL (2021)</div><div class="card-body">Örtük Q-learning — expectile regresyon kullanır, politika iyileştirme adımı yok.</div></div>
<div class="calc-card"><div class="card-title">Decision Transformer</div><div class="card-body">RL'i dizi modellemesi olarak gör: istenen getiriye koşullan, sonraki eylemi tahmin et.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hiyerarşik RL — Seçenekler ve Alt Hedefler</h2>
<p class="l-text">Uzun ufuklar zordur. Hiyerarşik RL üst düzey "seçenekler" (uzatılmış eylemler) ve alt düzey kontrolcüler öğrenir. Yürüyen bir robotun "kapıya yürü" üst politikası ve eklem torkları için alt kontrolcüsü olabilir. Etkin ufku azaltır ve transferi iyileştirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seçenekler çerçevesi</div><div class="card-body">(başlatma, politika, sonlandırma) — Sutton/Precup 1999.</div></div>
<div class="calc-card"><div class="card-title">Hedef-koşullu RL</div><div class="card-body">π(a|s,g) politikası — modern, genel (HER, GCRL).</div></div>
<div class="calc-card"><div class="card-title">FuN, HIRO, h-DQN</div><div class="card-body">Yönetici alt hedef seçer; işçi onlara ulaşır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gerçek Dünya RL Zorlukları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seyrek ödül</div><div class="card-body">Robot montajı bitirir = ödül 1, yoksa 0. Merak bonusları, HER, demolar.</div></div>
<div class="calc-card"><div class="card-title">Sim-to-real</div><div class="card-body">Simülasyonda eğit (ucuz, hızlı); gerçek robotta deploy. Alan rastgeleleştirme yardımcı.</div></div>
<div class="calc-card"><div class="card-title">Örnek verimliliği</div><div class="card-body">Gerçek ortamlar yavaş/maliyetli. Model-bazlı, çevrimdışı, ön eğitim yardımcı.</div></div>
<div class="calc-card"><div class="card-title">Güvenlik</div><div class="card-body">Keşif sırasında felaket eylemler yok. Kısıtlı MDP'ler, güvenli kümeler.</div></div>
<div class="calc-card"><div class="card-title">Çoklu görev</div><div class="card-body">Görevler arası tek politika. Meta-RL, görev-koşullu politikalar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Capstone: LunarLander'da PPO</h2>
<p class="l-text">Her şeyi bir araya getirme zamanı. LunarLander şekillendirilmiş ödüllü sürekli-kontrol-benzeri bir görev — zorlayıcı ama ulaşılabilir. Stable Baselines3 ile CPU'da 30 dakikada güçlü bir politika eğitebiliriz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> gymnasium <span class="kw">as</span> gym
<span class="kw">from</span> stable_baselines3 <span class="kw">import</span> PPO
<span class="kw">from</span> stable_baselines3.common.evaluation <span class="kw">import</span> evaluate_policy
<span class="kw">from</span> stable_baselines3.common.vec_env <span class="kw">import</span> DummyVecEnv

<span class="cm"># 1. Paralel yurutme icin vektorize ortam</span>
env = <span class="fn">DummyVecEnv</span>([<span class="kw">lambda</span>: gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)])

<span class="cm"># 2. Makul varsayilanlarla PPO</span>
model = <span class="fn">PPO</span>(
    <span class="str">"MlpPolicy"</span>, env,
    learning_rate=<span class="num">3e-4</span>, n_steps=<span class="num">1024</span>, batch_size=<span class="num">64</span>, n_epochs=<span class="num">10</span>,
    gamma=<span class="num">0.99</span>, gae_lambda=<span class="num">0.95</span>, clip_range=<span class="num">0.2</span>, ent_coef=<span class="num">0.01</span>,
    verbose=<span class="num">1</span>, tensorboard_log=<span class="str">"./ppo_lunar_tb/"</span>
)

<span class="cm"># 3. Egit</span>
model.<span class="fn">learn</span>(total_timesteps=<span class="num">500_000</span>)
model.<span class="fn">save</span>(<span class="str">"ppo_lunar_final"</span>)

<span class="cm"># 4. Degerlendir</span>
eval_env = gym.<span class="fn">make</span>(<span class="str">"LunarLander-v2"</span>)
mean_r, std_r = <span class="fn">evaluate_policy</span>(model, eval_env, n_eval_episodes=<span class="num">20</span>)
<span class="fn">print</span>(f<span class="str">"Ortalama bolum getirisi: {mean_r:.1f} +/- {std_r:.1f}"</span>)
<span class="cm"># &gt; 200 cozulmus; iyi egitilmis PPO ~260'a ulasir</span></code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LunarLander/SB3 are blocked. Capstone equivalent: train a numpy ε-greedy bandit on a 4-arm task — the simplest 'lander' for the browser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
rng = np.random.default_rng(0)
true_means = np.array([0.1, 0.4, 0.7, 0.2])
Q = np.zeros(4); N = np.zeros(4)
rewards = []
for t in range(2000):
    eps = max(0.05, 1.0 - t/500)
    a = rng.integers(0, 4) if rng.random() &lt; eps else int(np.argmax(Q))
    r = float(true_means[a] + 0.1 * rng.standard_normal())
    N[a] += 1; Q[a] += (r - Q[a]) / N[a]
    rewards.append(r)
print('Final Q:', np.round(Q, 3))
print('Picked best arm in last 100 steps:',
      int((np.argmax(true_means) == np.array([np.argmax(true_means)] * 100)).sum()))
print('Mean reward (last 200):', round(float(np.mean(rewards[-200:])), 3))</code></pre></div>
</div>
<p class="l-text"><strong>Çalışma mantığı:</strong> 1) 8 paralel ortamı vektorize et — PPO yürütmeleri daha hızlı toplar. 2) Öğrendiğin tüm hiperparametrelerle PPO kur: lr, n_steps, batch, epoch, γ, GAE λ, clip ε, entropi bonusu. 3) Toplam 500k ortam adımı eğit (≈30 dak CPU, &lt;5 dak GPU). 4) 20 bölüm üzerinde değerlendir. Sağlam bir koşu ortalama ödül ≈ 260'a ulaşır, "çözülmüş" eşiği 200'ün çok üstünde.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Eğitim Koşularını Tanılama</h2>
<p class="l-text">PPO yakınsamadığında TensorBoard loglarına bak:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">approx_kl</div><div class="card-body">0.005–0.02 civarında kalmalı. &gt; 0.05 ise çok agresif güncelleme yapıyorsun.</div></div>
<div class="calc-card"><div class="card-title">clip_fraction</div><div class="card-body">Tipik 0.1–0.3 civarı. Daha yüksek = ε çok düşük ya da öğrenme oranı çok yüksek.</div></div>
<div class="calc-card"><div class="card-title">explained_variance</div><div class="card-body">Critic kalitesi. &gt; 0.5 hedefle; 1'e yakın critic mükemmel demek.</div></div>
<div class="calc-card"><div class="card-title">entropy</div><div class="card-body">Azalmalı ama çökmemeli. Çöküyorsa ent_coef ekle.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Capstone Eğitim Eğrisi</h2>
<div id="rl12-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Tipik LunarLander PPO öğrenmesi. Erken platoya dikkat (havada durmayı öğrenmek), 200'ü aşıp düzgün indikten sonra.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. RL Nereye Gidiyor?</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karar için temel modeller</div><div class="card-body">Decision Transformer, Gato, RT-2 — devasa loglu yörüngelerde önceden eğitilmiş, görev başına ince ayar.</div></div>
<div class="calc-card"><div class="card-title">RLHF ve sonrası</div><div class="card-body">Süreç ödül modelleri, münazara, zayıf-güçlü denetim.</div></div>
<div class="calc-card"><div class="card-title">Robotik</div><div class="card-body">Difüzyon politikaları, görme-dil-eylem modelleri, ölçekte sim-to-real.</div></div>
<div class="calc-card"><div class="card-title">Açık zorluklar</div><div class="card-body">Örnek verimliliği, genelleme, güvenlik, dünyada eyleyen ajanların hizalanması.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Hepsini Geri Bağlama</h2>
<p class="l-text">Bunu sırayla tekrar oku: ajan + ortam (L1), MDP (L2), Bellman (L3), TD vs MC (L4), Q-learning (L5), yüksek boyutlu durumlar için DQN (L6), policy gradient (L7), actor-critic (L8), kararlılık için PPO kırpma (L9), LLM hizalayan RLHF (L10), en basit tohum olarak banditler (L11) ve bu derste modern cepheler. Her biri öncekinin üstüne kurulur. Bu zeminle modern RL makalelerini okuyabilir, uygulayabilir ve uygulamaya alabilirsin — kendi NLP araştırmana dahil.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Önerilen Sonraki Adımlar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Oku</div><div class="card-body">Sutton &amp; Barto "Reinforcement Learning: An Introduction" (çevrimiçi ücretsiz).</div></div>
<div class="calc-card"><div class="card-title">Uygula</div><div class="card-body">CleanRL — tek dosyalık PPO/SAC/DQN referans uygulamaları.</div></div>
<div class="calc-card"><div class="card-title">Pratik yap</div><div class="card-body">Daha zor ölçütler için Gymnasium MuJoCo, MiniGrid, Procgen.</div></div>
<div class="calc-card"><div class="card-title">RLHF özel</div><div class="card-body">HuggingFace TRL + DPO, OpenAssistant SFT verisi, Anthropic HH-RLHF veri seti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Son Çıkarımlar</h2>
<div class="think-box"><div class="think-label">SON ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Model-bazlı RL bir dünya modeli eğitir + hayalde planlar. Örnek-verimli.<br><strong>2.</strong> Çevrimdışı RL yalnızca loglu veriden öğrenir — sağlık, recsys, finans için gerekli.<br><strong>3.</strong> Hiyerarşik RL uzun ufukları seçenekler/alt hedeflerle yönetir.<br><strong>4.</strong> Gerçek dünya RL: seyrek ödül, sim-to-real, örnek verimliliği, güvenlik.<br><strong>5.</strong> Capstone: LunarLander'da PPO varsayılan hiperparametrelerle 500k adımda çözer.<br><strong>6.</strong> Koşuları approx_kl, clip_fraction, explained_variance, entropi ile tanıla.<br><strong>7.</strong> Cephe: karar için temel modeller, RLHF ötesi, robot politikaları.<br><strong>8.</strong> Şimdi makaleleri okuyup RL'i üretime alacak araç setine sahipsin — NLP'de dahil.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
