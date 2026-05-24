window.RL_L2 = {

en: `<p class="l-text"><strong>Markov Decision Processes are the mathematical skeleton beneath every RL algorithm.</strong> If RL is the body, MDPs are the bones — every Q-learning, PPO, and RLHF result rests on this five-tuple.</p>
<p class="l-text">In this lesson you will learn the formal MDP definition, the Markov property, discounted return, value functions, and the Bellman equation that ties them all together.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define an MDP as the five-tuple (S, A, P, R, gamma) and identify each piece</li>
<li>State the Markov property and recognize why it makes RL tractable</li>
<li>Compute discounted return G_t and explain why gamma less than 1 matters</li>
<li>Distinguish state-value V_pi from action-value Q_pi for a fixed policy</li>
<li>Derive and apply the Bellman expectation equation by hand on a 4-state MDP</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The 5-tuple (S, A, P, R, γ)</h2>
<p class="l-text">An MDP is fully described by five objects. Get comfortable with this — every algorithm in this course manipulates these five things.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">S</div><div class="card-body">Set of states. CartPole: 4-dim continuous; Chess: ~10^46 board positions.</div></div>
<div class="calc-card"><div class="card-title">A</div><div class="card-body">Set of actions. CartPole: {left, right}; Robot arm: continuous torques.</div></div>
<div class="calc-card"><div class="card-title">P(s'|s,a)</div><div class="card-body">Transition probability — given state s and action a, probability of landing in s'.</div></div>
<div class="calc-card"><div class="card-title">R(s,a)</div><div class="card-body">Reward function — scalar reward for taking a in s.</div></div>
<div class="calc-card"><div class="card-title">γ ∈ [0,1)</div><div class="card-body">Discount factor — how much future rewards count vs immediate ones.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Markov Property</h2>
<p class="l-text">"The future depends only on the present, not on the past." Formally: P(S_{t+1} | S_t, A_t, S_{t-1}, ..., S_0) = P(S_{t+1} | S_t, A_t). All the history needed is packed into the current state. Real environments rarely satisfy this exactly, so we engineer states that approximately do (e.g. stack 4 frames in Atari to capture velocity).</p>
<div class="think-box"><div class="think-label">INTUITION</div><div class="think-body">Chess satisfies the Markov property: the board position alone tells you everything legal about the future. Poker does not: the hidden cards held by opponents matter, so we either ignore the issue (POMDP) or stuff our belief about hidden state into our state representation.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Discounted Return</h2>
<p class="l-text">The agent does not maximize a single reward — it maximizes a long-term sum. We discount future rewards by γ to (a) ensure the sum converges in infinite-horizon problems, (b) reflect that immediate reward is worth more (uncertainty about the future), and (c) give a knob between greedy (γ=0) and far-sighted (γ→1) behavior.</p>
<div class="katex-block">$$G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">G_t</div><div class="card-body">Return — total discounted reward from step t onward.</div></div>
<div class="calc-card"><div class="card-title">γ</div><div class="card-body">Discount factor. γ=0.99 is common; effective horizon ≈ 1/(1-γ) = 100 steps.</div></div>
<div class="calc-card"><div class="card-title">R_{t+1}</div><div class="card-body">Reward received after taking action at time t.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Value Function V^π(s)</h2>
<p class="l-text">"How good is it to be in state s, given that I will follow policy π afterwards?" The value function is the expected return starting from s.</p>
<div class="katex-block">$$V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\left[ G_t \\mid S_t = s \\right]$$</div>
<p class="l-text">If you know V^π for every state, you can compare states. Better still, if you know V^* (the value under the optimal policy), you have solved the problem in a meaningful sense — the optimal action in s is the one whose successor has the highest value.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Action-Value Function Q^π(s,a)</h2>
<p class="l-text">More useful in practice: "How good is it to take action a in state s, then follow π?"</p>
<div class="katex-block">$$Q^{\\pi}(s,a) = \\mathbb{E}_{\\pi}\\left[ G_t \\mid S_t = s,\\ A_t = a \\right]$$</div>
<p class="l-text">Q tells you directly which action to pick: argmax_a Q(s,a). This is why Q-learning, DQN, and friends are so popular — once you have Q, the policy is trivial.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">V vs Q</div><div class="card-body">V(s) averages over actions; Q(s,a) fixes the first action then averages. V(s) = Σ_a π(a|s) Q(s,a).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Bellman Equation</h2>
<p class="l-text">The single most important equation in RL. It says the value of a state equals the immediate reward plus the discounted value of the next state.</p>
<div class="katex-block">$$V^{\\pi}(s) = \\sum_{a} \\pi(a|s) \\sum_{s'} P(s'|s,a) \\left[ R(s,a) + \\gamma V^{\\pi}(s') \\right]$$</div>
<p class="l-text">The Bellman optimality version replaces the policy with a max:</p>
<div class="katex-block">$$V^{*}(s) = \\max_{a} \\sum_{s'} P(s'|s,a) \\left[ R(s,a) + \\gamma V^{*}(s') \\right]$$</div>
<p class="l-text">Every RL algorithm is, in some sense, an attempt to solve this equation when P and R are unknown.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Computing a Return in Code</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">discounted_return</span>(rewards, gamma=<span class="num">0.99</span>):
    <span class="str">"""Compute G_t for each step in a list of rewards."""</span>
    G = np.<span class="fn">zeros_like</span>(rewards, dtype=np.float32)
    running = <span class="num">0.0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">reversed</span>(<span class="fn">range</span>(<span class="fn">len</span>(rewards))):
        running = rewards[t] + gamma * running
        G[t] = running
    <span class="kw">return</span> G

<span class="cm"># Example: 5-step episode, reward of 1 only at the end</span>
rewards = [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>]
<span class="fn">print</span>(<span class="fn">discounted_return</span>(rewards, gamma=<span class="num">0.9</span>))
<span class="cm"># [0.6561 0.729  0.81   0.9    1.   ]</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Allocate an array for returns. 2) Walk backwards from the last step. 3) At each step, return = current reward + γ × next return. 4) Earlier steps get a smaller return because the +1 is far in the future. This backwards pass is exactly how the Bellman equation gets evaluated in practice.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Effect of γ on the Effective Horizon</h2>
<div id="rl2-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">Lower γ shrinks the agent's planning horizon. γ=0.5 means rewards 10 steps away are worth (0.5)^10 ≈ 0.001 — practically ignored.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> An MDP = (S, A, P, R, γ).<br><strong>2.</strong> Markov property: future depends only on present state + action.<br><strong>3.</strong> Return G_t is the discounted sum of future rewards.<br><strong>4.</strong> V^π(s) = expected return from s; Q^π(s,a) = expected return from (s,a).<br><strong>5.</strong> The Bellman equation: value now = immediate reward + γ × next value.<br><strong>6.</strong> Solving Bellman = solving the MDP. The rest of the course is "how, when P and R are unknown".</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var k = Array.from({length:50}, (_,i)=>i);
  var traces = [0.5, 0.9, 0.99].map(function(g, idx){
    var colors = ['#e88', T.accent, '#88e'];
    return {x:k, y:k.map(function(i){return Math.pow(g,i);}), name:'γ='+g, type:'scatter', mode:'lines', line:{color:colors[idx], width:2.5}};
  });
  [{id:'rl2-plot-en',title:'Discount weight γ^k vs steps into the future',xTitle:'Steps into future (k)'},
   {id:'rl2-plot-tr',title:'İndirim ağırlığı γ^k vs gelecek adımlar',xTitle:'Gelecek adımlar (k)'}].forEach(function(cfg){
    var el=document.getElementById(cfg.id);
    if(el && window.Plotly){
      var layout = {title:cfg.title,paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:cfg.xTitle,gridcolor:T.grid},yaxis:{title:'γ^k',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
      Plotly.newPlot(cfg.id,traces,layout,{displayModeBar:false});
    }
  });
},250);
</script>`,

tr: `<p class="l-text"><strong>Markov Karar Süreçleri her RL algoritmasının altındaki matematiksel iskelettir.</strong> RL gövdeyse MDP kemiklerdir — her Q-learning, PPO ve RLHF sonucu bu beşli üzerine oturur.</p>
<p class="l-text">Bu derste resmi MDP tanımını, Markov özelliğini, indirgenmiş getiri, değer fonksiyonlarını ve hepsini birbirine bağlayan Bellman denklemini öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir MDP'yi (S, A, P, R, gamma) beşlisi olarak tanımlamayı ve her parçayı tanımayı</li>
<li>Markov özelliğini ifade etmeyi ve RL'i çözülebilir kılmasının nedenini görmeyi</li>
<li>İndirgenmiş getiri G_t'yi hesaplamayı ve gamma'nın 1'den küçük olmasının önemini açıklamayı</li>
<li>Sabit bir politika için durum-değeri V_pi ile eylem-değeri Q_pi'yi ayırt etmeyi</li>
<li>Bellman beklenti denklemini türetip 4-durumlu bir MDP üstünde elle uygulamayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Beşli (S, A, P, R, γ)</h2>
<p class="l-text">Bir MDP beş nesneyle tam olarak tanımlanır. Bu beşliye alış — bu kurstaki her algoritma bu beş şeyi manipüle eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">S</div><div class="card-body">Durumlar kümesi. CartPole: 4-boyut sürekli; Satranç: ~10^46 tahta pozisyonu.</div></div>
<div class="calc-card"><div class="card-title">A</div><div class="card-body">Eylemler kümesi. CartPole: {sol, sağ}; Robot kol: sürekli torklar.</div></div>
<div class="calc-card"><div class="card-title">P(s'|s,a)</div><div class="card-body">Geçiş olasılığı — s durumunda a eylemi verildiğinde s' durumuna düşme olasılığı.</div></div>
<div class="calc-card"><div class="card-title">R(s,a)</div><div class="card-body">Ödül fonksiyonu — s'de a almanın skaler ödülü.</div></div>
<div class="calc-card"><div class="card-title">γ ∈ [0,1)</div><div class="card-body">İndirgeme katsayısı — gelecekteki ödüller anındakine göre ne kadar sayılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Markov Özelliği</h2>
<p class="l-text">"Gelecek sadece şimdiye bağlıdır, geçmişe değil." Resmi olarak: P(S_{t+1} | S_t, A_t, S_{t-1}, ..., S_0) = P(S_{t+1} | S_t, A_t). Geçmişten ihtiyaç duyulan her şey mevcut duruma paketlenmiştir. Gerçek ortamlar bunu nadiren tam olarak sağlar, bu yüzden yaklaşık sağlayan durumlar tasarlarız (ör. Atari'de hızı yakalamak için 4 kareyi üst üste yığarız).</p>
<div class="think-box"><div class="think-label">SEZGİ</div><div class="think-body">Satranç Markov özelliğini sağlar: tahta pozisyonu tek başına gelecek hakkında yasal her şeyi söyler. Poker sağlamaz: rakiplerin gizli kartları önemlidir, ya bunu yok sayarız (POMDP) ya da gizli durum hakkındaki inancımızı durum gösterimine sıkıştırırız.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. İndirgenmiş Getiri</h2>
<p class="l-text">Ajan tek bir ödülü değil, uzun vadeli toplamı maksimize eder. Gelecek ödülleri γ ile indirgeriz: (a) sonsuz ufuklu problemlerde toplamın yakınsamasını sağlar, (b) anlık ödülün daha değerli olduğunu yansıtır (gelecek belirsiz), (c) açgözlü (γ=0) ile uzak görüşlü (γ→1) davranış arasında bir düğme verir.</p>
<div class="katex-block">$$G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">G_t</div><div class="card-body">Getiri — t adımından itibaren toplam indirgenmiş ödül.</div></div>
<div class="calc-card"><div class="card-title">γ</div><div class="card-body">İndirgeme katsayısı. γ=0.99 yaygın; etkin ufuk ≈ 1/(1-γ) = 100 adım.</div></div>
<div class="calc-card"><div class="card-title">R_{t+1}</div><div class="card-body">t anında eylem alındıktan sonra alınan ödül.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Değer Fonksiyonu V^π(s)</h2>
<p class="l-text">"s durumunda olmak ne kadar iyi, sonrasında π politikasını izleyeceksem?" Değer fonksiyonu, s'den başlayan beklenen getiridir.</p>
<div class="katex-block">$$V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\left[ G_t \\mid S_t = s \\right]$$</div>
<p class="l-text">Her durum için V^π'i biliyorsan durumları kıyaslayabilirsin. Daha da iyisi, V^*'i (optimal politika altındaki değer) biliyorsan problemi anlamlı şekilde çözmüşsündür — s'deki optimal eylem, ardılı en yüksek değere sahip olandır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Eylem-Değer Fonksiyonu Q^π(s,a)</h2>
<p class="l-text">Pratikte daha kullanışlı: "s durumunda a eylemini almak, sonra π'yi izlemek ne kadar iyi?"</p>
<div class="katex-block">$$Q^{\\pi}(s,a) = \\mathbb{E}_{\\pi}\\left[ G_t \\mid S_t = s,\\ A_t = a \\right]$$</div>
<p class="l-text">Q sana hangi eylemi seçeceğini doğrudan söyler: argmax_a Q(s,a). Q-learning, DQN ve arkadaşlarının bu kadar popüler olmasının sebebi budur — Q'yu bir kez bildin mi politika basittir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">V vs Q</div><div class="card-body">V(s) eylemler üzerinden ortalama alır; Q(s,a) ilk eylemi sabitleyip sonra ortalama alır. V(s) = Σ_a π(a|s) Q(s,a).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bellman Denklemi</h2>
<p class="l-text">RL'deki tek en önemli denklem. Bir durumun değerinin, anlık ödül artı bir sonraki durumun indirgenmiş değerine eşit olduğunu söyler.</p>
<div class="katex-block">$$V^{\\pi}(s) = \\sum_{a} \\pi(a|s) \\sum_{s'} P(s'|s,a) \\left[ R(s,a) + \\gamma V^{\\pi}(s') \\right]$$</div>
<p class="l-text">Bellman optimallik versiyonu politikayı maks ile değiştirir:</p>
<div class="katex-block">$$V^{*}(s) = \\max_{a} \\sum_{s'} P(s'|s,a) \\left[ R(s,a) + \\gamma V^{*}(s') \\right]$$</div>
<p class="l-text">Her RL algoritması bir anlamda P ve R bilinmediğinde bu denklemi çözmeye çalışır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kodda Getiri Hesaplama</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">discounted_return</span>(rewards, gamma=<span class="num">0.99</span>):
    <span class="str">"""Bir odul listesinde her adim icin G_t hesapla."""</span>
    G = np.<span class="fn">zeros_like</span>(rewards, dtype=np.float32)
    running = <span class="num">0.0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">reversed</span>(<span class="fn">range</span>(<span class="fn">len</span>(rewards))):
        running = rewards[t] + gamma * running
        G[t] = running
    <span class="kw">return</span> G

<span class="cm"># Ornek: 5 adimlik bolum, sadece sonda 1 odul</span>
rewards = [<span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>]
<span class="fn">print</span>(<span class="fn">discounted_return</span>(rewards, gamma=<span class="num">0.9</span>))
<span class="cm"># [0.6561 0.729  0.81   0.9    1.   ]</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptıkları:</strong> 1) Getiriler için bir dizi ayır. 2) Son adımdan geriye doğru yürü. 3) Her adımda getiri = mevcut ödül + γ × sonraki getiri. 4) Önceki adımlar daha küçük getiri alır çünkü +1 uzakta. Bu geriye yürüyüş, Bellman denkleminin pratikte tam olarak değerlendirildiği yoldur.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. γ'nın Etkin Ufka Etkisi</h2>
<div id="rl2-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Düşük γ ajanın planlama ufkunu daraltır. γ=0.5 demek 10 adım uzaktaki ödüller (0.5)^10 ≈ 0.001 değerinde — pratikte yok sayılır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bir MDP = (S, A, P, R, γ).<br><strong>2.</strong> Markov özelliği: gelecek sadece mevcut durum + eyleme bağlı.<br><strong>3.</strong> Getiri G_t gelecekteki ödüllerin indirgenmiş toplamıdır.<br><strong>4.</strong> V^π(s) = s'den beklenen getiri; Q^π(s,a) = (s,a)'dan beklenen getiri.<br><strong>5.</strong> Bellman denklemi: şimdiki değer = anlık ödül + γ × sonraki değer.<br><strong>6.</strong> Bellman'ı çözmek = MDP'yi çözmek. Kursun geri kalanı "P ve R bilinmediğinde nasıl?".</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
