window.RL_L4 = {

en: `<p class="l-text"><strong>Real environments do not hand you transition probabilities. You must learn from experience — by sampling.</strong> Monte Carlo and Temporal Difference learning are the two foundational ways to do this, and the dialectic between them powers everything from Q-learning to PPO.</p>
<p class="l-text">In this lesson you will learn model-free prediction, MC vs TD trade-offs, the TD(0) update, and the bias-variance tension at the core of RL.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Estimate V_pi from sampled episodes without knowing P or R (model-free)</li>
<li>Implement first-visit and every-visit Monte Carlo estimators in numpy</li>
<li>Apply the TD(0) bootstrapped update and compare with full MC returns</li>
<li>Reason about bias and variance to choose between MC, TD(0), and n-step</li>
<li>Estimate values on a small Random Walk MRP and plot learning curves</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Model-Free RL</h2>
<p class="l-text">Model-free = we never write down P or R. We just collect (state, action, reward, next state) tuples by interacting and update value estimates from those tuples. This is exactly how an animal learns — by trying and remembering outcomes.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model-based</div><div class="card-body">Learn P̂ and R̂ first, then plan with DP. Sample-efficient, complex.</div></div>
<div class="calc-card"><div class="card-title">Model-free</div><div class="card-body">Skip the model, learn V or Q directly from samples. Simple, the workhorse.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Monte Carlo Estimation</h2>
<p class="l-text">Run a complete episode. Compute the actual return G_t for every visited state. Average those returns over many episodes. The law of large numbers gives you V^π(s).</p>
<div class="katex-block">$$V(s) \\leftarrow V(s) + \\alpha \\left( G_t - V(s) \\right)$$</div>
<p class="l-text">where G_t is the empirical return from this episode and α is the learning rate. The update nudges V toward the observed return.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pros</div><div class="card-body">Unbiased — G_t is a real return, not a guess. Conceptually simple.</div></div>
<div class="calc-card"><div class="card-title">Cons</div><div class="card-body">High variance. Must wait until episode ends. Useless in continuing tasks.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Temporal Difference TD(0)</h2>
<p class="l-text">Why wait until the episode ends? After one step we already have a (noisy) estimate of the return: R_{t+1} + γ V(S_{t+1}). Use it.</p>
<div class="katex-block">$$V(S_t) \\leftarrow V(S_t) + \\alpha \\left[ R_{t+1} + \\gamma V(S_{t+1}) - V(S_t) \\right]$$</div>
<p class="l-text">The bracket is the TD error δ_t. We bootstrap — use our current estimate of V(S_{t+1}) as a stand-in for the unknown true return.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">α</div><div class="card-body">Learning rate, e.g. 0.1.</div></div>
<div class="calc-card"><div class="card-title">δ_t</div><div class="card-body">TD error — surprise. If positive, we underestimated; if negative, we overestimated.</div></div>
<div class="calc-card"><div class="card-title">Bootstrap</div><div class="card-body">Update an estimate using another estimate. Lower variance, but biased.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Bias-Variance Trade-off</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MC</div><div class="card-body">Unbiased, high variance. Many random rewards summed.</div></div>
<div class="calc-card"><div class="card-title">TD(0)</div><div class="card-body">Biased (V is wrong at first), low variance. Only one random reward.</div></div>
<div class="calc-card"><div class="card-title">n-step / TD(λ)</div><div class="card-body">Look n steps ahead. Knob between MC and TD(0).</div></div>
</div>
<p class="l-text">In practice TD(0) is preferred — much faster early learning, online updates, works in continuing tasks. The bias washes out as V improves.</p>
</div>

<div class="lesson-block" id="section-sarsa">
<h2 class="lesson-title">5. From Prediction to Control: SARSA</h2>
<p class="l-text">Everything so far estimates <em>V(s)</em> — value of a state under a fixed policy. But we ultimately want to <em>improve</em> the policy. For that we need <em>Q(s, a)</em> — value of taking action <em>a</em> in state <em>s</em>. Once we have Q, the greedy policy is trivial: <code>argmax_a Q(s,a)</code>.</p>
<p class="l-text"><strong>SARSA</strong> — named after the five symbols in its update — is TD(0) applied to Q. After taking action <em>a</em> in state <em>s</em>, observing reward <em>r</em>, transitioning to <em>s'</em>, and choosing the next action <em>a'</em> by the current policy, update:</p>
<div class="katex-block">$$Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma\\, Q(s', a') - Q(s, a) \\right]$$</div>
<p class="l-text">The five symbols (<em>s, a, r, s', a'</em>) give the algorithm its name. SARSA is <strong>on-policy</strong>: it learns Q for the policy it is currently following (usually ε-greedy on Q).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SARSA (on-policy)</div><div class="card-body">Target = r + γ Q(s', a'), where a' is the action actually chosen. Learns the value of the behavior policy itself.</div></div>
<div class="calc-card"><div class="card-title">Q-Learning (off-policy)</div><div class="card-body">Target = r + γ max_a Q(s', a). Learns the value of the optimal policy regardless of what you actually do. Covered in L5.</div></div>
<div class="calc-card"><div class="card-title">When SARSA wins</div><div class="card-body">Safer in exploration-sensitive domains. The "cliff walking" example — SARSA learns the safe path, Q-learning the optimal-but-risky one.</div></div>
</div>
<p class="l-text">SARSA is the simplest possible control algorithm. Q-learning extends it to off-policy. Every modern algorithm — DQN, PPO, SAC — descends from this exact bootstrap-with-Q idea.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">6. Hands-on: TD(0) on a Random Walk</h2>
<p class="l-text">Classic Sutton chain: 5 states A-B-C-D-E with terminals at both ends. Random policy. Reward +1 only on right exit.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># States 0..6, 0 and 6 are terminal. Start at 3.</span>
<span class="kw">def</span> <span class="fn">step</span>(s):
    a = np.random.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>])
    s_next = s + a
    <span class="kw">if</span> s_next == <span class="num">0</span>:
        <span class="kw">return</span> s_next, <span class="num">0.0</span>, <span class="kw">True</span>
    <span class="kw">if</span> s_next == <span class="num">6</span>:
        <span class="kw">return</span> s_next, <span class="num">1.0</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, <span class="num">0.0</span>, <span class="kw">False</span>

V = np.<span class="fn">full</span>(<span class="num">7</span>, <span class="num">0.5</span>)
V[<span class="num">0</span>] = V[<span class="num">6</span>] = <span class="num">0.0</span>
alpha, gamma = <span class="num">0.1</span>, <span class="num">1.0</span>
N_EPISODES = <span class="num">500</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(N_EPISODES):
    s, done = <span class="num">3</span>, <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        s_next, r, done = <span class="fn">step</span>(s)
        td_target = r + gamma * V[s_next]
        V[s] += alpha * (td_target - V[s])
        s = s_next

<span class="fn">print</span>(<span class="str">"Learned V:"</span>, V[<span class="num">1</span>:<span class="num">6</span>].<span class="fn">round</span>(<span class="num">3</span>))
<span class="cm"># True values: [1/6, 2/6, 3/6, 4/6, 5/6] = [.167, .333, .5, .667, .833]</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) 7-state chain, terminal at 0 and 6. 2) Initialize all non-terminal V to 0.5 (uniform prior). 3) Each episode start at center, random walk until terminal. 4) After each step, apply the TD(0) update: nudge V(s) toward r + γV(s'). 5) After 500 episodes V converges to the true uniform-policy values [1/6, 2/6, ..., 5/6].</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">7. n-step TD and TD(λ)</h2>
<p class="l-text">A spectrum sits between TD(0) and MC: use n actual rewards then bootstrap.</p>
<div class="katex-block">$$G^{(n)}_t = R_{t+1} + \\gamma R_{t+2} + \\cdots + \\gamma^{n-1} R_{t+n} + \\gamma^n V(S_{t+n})$$</div>
<p class="l-text">TD(λ) cleverly averages all n-step returns with weights (1-λ)λ^{n-1}, giving smooth interpolation between TD(0) (λ=0) and MC (λ=1). Used inside GAE — we will see it in actor-critic.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">8. Convergence Comparison</h2>
<div id="rl4-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">TD(0) typically reaches lower error sooner; MC catches up but oscillates more.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Model-free RL learns V or Q from samples without knowing P.<br><strong>2.</strong> Monte Carlo: complete episode → average returns. Unbiased, high variance.<br><strong>3.</strong> TD(0): one-step bootstrap. Biased, low variance, online.<br><strong>4.</strong> TD error δ = R + γV(s') − V(s) is the learning signal.<br><strong>5.</strong> SARSA = TD(0) on Q(s,a) using the action actually chosen (on-policy).<br><strong>6.</strong> Q-learning replaces a' with max-action — off-policy, learns optimal Q regardless of behavior.<br><strong>7.</strong> n-step / TD(λ) interpolate between MC and TD.<br><strong>8.</strong> TD generally wins in practice; MC is used for high-variance fallback and offline analysis.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ep = Array.from({length:100}, (_,i)=>(i+1)*5);
  var td = ep.map(function(e){return 0.4*Math.exp(-e/100) + 0.05*Math.random();});
  var mc = ep.map(function(e){return 0.4*Math.exp(-e/200) + 0.12*Math.random();});
  var data = [
    {x:ep,y:td,name:'TD(0)',type:'scatter',mode:'lines',line:{color:T.accent,width:2.5}},
    {x:ep,y:mc,name:'Monte Carlo',type:'scatter',mode:'lines',line:{color:'#88e',width:2.5}}
  ];
  var layout = {title:'Random Walk — RMS error vs episode',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Episode',gridcolor:T.grid},yaxis:{title:'RMS error',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl4-plot-en','rl4-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Gerçek ortamlar sana geçiş olasılıklarını vermez. Deneyimden öğrenmek zorundasın — örnekleyerek.</strong> Monte Carlo ve Temporal Difference (TD) öğrenme bunu yapmanın iki temel yoludur ve aralarındaki diyalektik Q-learning'den PPO'ya kadar her şeyi besler.</p>
<p class="l-text">Bu derste model-bağımsız tahmini, MC vs TD ödünleşimini, TD(0) güncellemesini ve RL'in özünde yatan yanlılık-varyans gerilimini öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>P ve R'yi bilmeden örneklenmiş bölümlerden V_pi tahmin etmeyi (model-bağımsız)</li>
<li>İlk-ziyaret ve her-ziyaret Monte Carlo tahmincilerini numpy'da uygulamayı</li>
<li>TD(0) bootstrapped güncellemesini uygulayıp tam MC getirisiyle karşılaştırmayı</li>
<li>MC, TD(0) ve n-adım arasında seçim yapmak için yanlılık-varyans dengesini akıl yürütmeyi</li>
<li>Küçük bir Random Walk MRP üstünde değerleri tahmin etmeyi ve öğrenme eğrilerini çizmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Model-Bağımsız RL</h2>
<p class="l-text">Model-bağımsız = P ya da R'yi asla yazmayız. Sadece etkileşim yoluyla (durum, eylem, ödül, sonraki durum) demetlerini toplar ve değer tahminlerini bunlardan günceller. Bir hayvanın öğrendiği şekildedir — deneyerek ve sonuçları hatırlayarak.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Model-bazlı</div><div class="card-body">Önce P ve R'yi öğren, sonra DP ile planla. Örnek-verimli, karmaşık.</div></div>
<div class="calc-card"><div class="card-title">Model-bağımsız</div><div class="card-body">Modeli atla, V ya da Q'yu örneklerden doğrudan öğren. Basit, iş gücü.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Monte Carlo Tahmini</h2>
<p class="l-text">Tam bir bölüm çalıştır. Ziyaret edilen her durum için gerçek getiri G_t'yi hesapla. Bu getirileri birçok bölüm üzerinde ortala. Büyük sayılar yasası sana V^π(s)'i verir.</p>
<div class="katex-block">$$V(s) \\leftarrow V(s) + \\alpha \\left( G_t - V(s) \\right)$$</div>
<p class="l-text">G_t bu bölümdeki ampirik getiri ve α öğrenme oranı. Güncelleme V'yi gözlenen getiriye doğru iter.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Artıları</div><div class="card-body">Yansız — G_t gerçek bir getiri, tahmin değil. Kavramsal olarak basit.</div></div>
<div class="calc-card"><div class="card-title">Eksileri</div><div class="card-body">Yüksek varyans. Bölüm bitene kadar beklemek gerekir. Sürekli görevlerde işe yaramaz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Temporal Difference TD(0)</h2>
<p class="l-text">Bölüm bitene kadar neden bekleyelim? Bir adım sonra getiri için (gürültülü de olsa) bir tahminimiz var: R_{t+1} + γ V(S_{t+1}). Onu kullan.</p>
<div class="katex-block">$$V(S_t) \\leftarrow V(S_t) + \\alpha \\left[ R_{t+1} + \\gamma V(S_{t+1}) - V(S_t) \\right]$$</div>
<p class="l-text">Köşeli parantez TD hatası δ_t. Bootstrap yaparız — V(S_{t+1})'in mevcut tahminini bilinmeyen gerçek getirinin yerine geçirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">α</div><div class="card-body">Öğrenme oranı, ör. 0.1.</div></div>
<div class="calc-card"><div class="card-title">δ_t</div><div class="card-body">TD hatası — sürpriz. Pozitifse az tahmin etmişiz; negatifse fazla.</div></div>
<div class="calc-card"><div class="card-title">Bootstrap</div><div class="card-body">Bir tahmini başka bir tahminle güncellemek. Daha düşük varyans, ama yanlı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yanlılık-Varyans Ödünleşimi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MC</div><div class="card-body">Yansız, yüksek varyans. Birçok rastgele ödül toplanır.</div></div>
<div class="calc-card"><div class="card-title">TD(0)</div><div class="card-body">Yanlı (V başta yanlış), düşük varyans. Sadece bir rastgele ödül.</div></div>
<div class="calc-card"><div class="card-title">n-adım / TD(λ)</div><div class="card-body">n adım ileri bak. MC ile TD(0) arasında düğme.</div></div>
</div>
<p class="l-text">Pratikte TD(0) tercih edilir — çok daha hızlı erken öğrenme, çevrimiçi güncellemeler, sürekli görevlerde çalışır. V iyileştikçe yanlılık silinir.</p>
</div>

<div class="lesson-block" id="section-sarsa-tr">
<h2 class="lesson-title">5. Tahminden Kontrole: SARSA</h2>
<p class="l-text">Buraya kadar her şey <em>V(s)</em>'yi — sabit bir politika altındaki durum değerini — kestiriyordu. Ama nihai amaç politikayı <em>iyileştirmek</em>. Bunun için <em>Q(s, a)</em>'ya — durum <em>s</em>'te eylem <em>a</em>'nın değerine — ihtiyacımız var. Q elinde varsa açgözlü politika kolay: <code>argmax_a Q(s,a)</code>.</p>
<p class="l-text"><strong>SARSA</strong> — adını güncellemesindeki beş sembolden alır — TD(0)'ın Q'ya uygulanmış hâlidir. <em>s</em>'te <em>a</em> yaptıktan sonra <em>r</em> ödülü gözleyip <em>s'</em>'e geçer, mevcut politikaya göre bir sonraki <em>a'</em> eylemini seçer ve şöyle günceller:</p>
<div class="katex-block">$$Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma\\, Q(s', a') - Q(s, a) \\right]$$</div>
<p class="l-text">Beş sembol (<em>s, a, r, s', a'</em>) algoritmanın adını verir. SARSA <strong>politika-içi (on-policy)</strong>'dır: hâlihazırda izlediği politikanın (genelde Q üzerinde ε-açgözlü) Q'sunu öğrenir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SARSA (politika-içi)</div><div class="card-body">Hedef = r + γ Q(s', a'), burada a' aslen seçilmiş eylemdir. Davranış politikasının kendisinin değerini öğrenir.</div></div>
<div class="calc-card"><div class="card-title">Q-Öğrenme (politika-dışı)</div><div class="card-body">Hedef = r + γ max_a Q(s', a). Ne yaptığınızdan bağımsız olarak optimal politikanın değerini öğrenir. L5'te ele alınır.</div></div>
<div class="calc-card"><div class="card-title">SARSA ne zaman kazanır</div><div class="card-body">Keşfe duyarlı alanlarda daha güvenli. "Uçurum yürüyüşü" örneği — SARSA güvenli yolu öğrenir, Q-öğrenme optimal-ama-riskli olanı.</div></div>
</div>
<p class="l-text">SARSA en sade kontrol algoritmasıdır. Q-öğrenme onu politika-dışına taşır. DQN, PPO, SAC dâhil tüm modern algoritmalar tam olarak bu Q-ile-bootstrap fikrinden türer.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">6. Uygulama: Rastgele Yürüyüşte TD(0)</h2>
<p class="l-text">Klasik Sutton zinciri: A-B-C-D-E olmak üzere 5 durum, iki uçta sonlandırıcılar. Rastgele politika. Sadece sağ çıkışta +1 ödül.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="cm"># Durumlar 0..6, 0 ve 6 sonlandirici. 3'ten basla.</span>
<span class="kw">def</span> <span class="fn">step</span>(s):
    a = np.random.<span class="fn">choice</span>([-<span class="num">1</span>, <span class="num">1</span>])
    s_next = s + a
    <span class="kw">if</span> s_next == <span class="num">0</span>:
        <span class="kw">return</span> s_next, <span class="num">0.0</span>, <span class="kw">True</span>
    <span class="kw">if</span> s_next == <span class="num">6</span>:
        <span class="kw">return</span> s_next, <span class="num">1.0</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, <span class="num">0.0</span>, <span class="kw">False</span>

V = np.<span class="fn">full</span>(<span class="num">7</span>, <span class="num">0.5</span>)
V[<span class="num">0</span>] = V[<span class="num">6</span>] = <span class="num">0.0</span>
alpha, gamma = <span class="num">0.1</span>, <span class="num">1.0</span>
N_EPISODES = <span class="num">500</span>

<span class="kw">for</span> ep <span class="kw">in</span> <span class="fn">range</span>(N_EPISODES):
    s, done = <span class="num">3</span>, <span class="kw">False</span>
    <span class="kw">while</span> <span class="kw">not</span> done:
        s_next, r, done = <span class="fn">step</span>(s)
        td_target = r + gamma * V[s_next]
        V[s] += alpha * (td_target - V[s])
        s = s_next

<span class="fn">print</span>(<span class="str">"Ogrenilen V:"</span>, V[<span class="num">1</span>:<span class="num">6</span>].<span class="fn">round</span>(<span class="num">3</span>))
<span class="cm"># Gercek degerler: [1/6, 2/6, 3/6, 4/6, 5/6] = [.167, .333, .5, .667, .833]</span></code></pre></div>
<p class="l-text"><strong>Adım adım inceleyelim:</strong> 1) 7-durumlu zincir, 0 ve 6'da sonlandırıcı. 2) Tüm sonlandırıcı olmayan V'leri 0.5 ile başlat (tek-tip ön-bilgi). 3) Her bölüm merkezde başlar, sonlandırıcıya kadar rastgele yürüyüş. 4) Her adımdan sonra TD(0) güncellemesi uygula: V(s)'i r + γV(s')'a doğru it. 5) 500 bölüm sonra V gerçek tek-tip politika değerlerine [1/6, 2/6, ..., 5/6] yakınsar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">7. n-adım TD ve TD(λ)</h2>
<p class="l-text">TD(0) ile MC arasında bir spektrum var: n gerçek ödül kullan, sonra bootstrap.</p>
<div class="katex-block">$$G^{(n)}_t = R_{t+1} + \\gamma R_{t+2} + \\cdots + \\gamma^{n-1} R_{t+n} + \\gamma^n V(S_{t+n})$$</div>
<p class="l-text">TD(λ) tüm n-adım getirilerini (1-λ)λ^{n-1} ağırlıklarıyla akıllıca ortalar, TD(0) (λ=0) ile MC (λ=1) arasında pürüzsüz interpolasyon verir. GAE içinde kullanılır — actor-critic'te göreceğiz.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">8. Yakınsama Kıyaslaması</h2>
<div id="rl4-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">TD(0) tipik olarak daha düşük hataya daha erken ulaşır; MC yetişir ama daha çok salınır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Model-bağımsız RL, P'yi bilmeden örneklerden V ya da Q öğrenir.<br><strong>2.</strong> Monte Carlo: tam bölüm → getiri ortalaması. Yansız, yüksek varyans.<br><strong>3.</strong> TD(0): tek adım bootstrap. Yanlı, düşük varyans, çevrimiçi.<br><strong>4.</strong> TD hatası δ = R + γV(s') − V(s) öğrenme sinyalidir.<br><strong>5.</strong> SARSA = aslen seçilen eylemle Q(s,a) üzerinde TD(0) (politika-içi).<br><strong>6.</strong> Q-öğrenme a' yerine max-eylem alır — politika-dışı, davranıştan bağımsız optimal Q öğrenir.<br><strong>7.</strong> n-adım / TD(λ) MC ile TD arasında interpolasyon yapar.<br><strong>8.</strong> Pratikte TD genelde kazanır; MC yüksek varyanslı yedek ve çevrimdışı analiz için kullanılır.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
