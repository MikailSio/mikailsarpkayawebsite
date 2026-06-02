window.RECSYS_L7 = {

en: `<p class="l-text"><strong>If your model only ever recommends what it currently believes is best, it never learns about anything else. This is the deepest tension in recommendation: every shown item is both a chance to make money and a chance to learn. Multi-armed bandits give you a principled way to balance the two.</strong></p>
<p class="l-text">In this lesson you will derive epsilon-greedy, UCB1 (Auer 2002), and Thompson sampling from one shared problem statement, then meet contextual bandits and LinUCB (Li et al. 2010, the algorithm Yahoo News used in production). All three classical bandits will be implemented in numpy and run on the orders dataset, treating each product as an arm and each click as a reward.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the multi-armed bandit problem and the regret it tries to minimize</li>
<li>Implement epsilon-greedy and tune the exploration rate</li>
<li>Derive UCB1's confidence bound and explain why log(t) is the right exploration rate</li>
<li>Run Thompson sampling with Beta posteriors over Bernoulli arms</li>
<li>Distinguish contextual from non-contextual bandits with one example</li>
<li>Connect LinUCB to YouTube / news / ad-tech personalization</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Bandit Problem</h2>
<p class="l-text">You face K arms (products, news headlines, ad creatives). At each step you pick one arm and observe a reward sampled from the arm's unknown distribution. Goal: maximize total reward over T steps. This is exactly recommendation framed as exploration vs exploitation.</p>
<div class="katex-block">$$\\text{Regret}(T) = T \\cdot \\mu^* - \\mathbb{E}\\left[ \\sum_{t=1}^{T} r_t \\right]$$</div>
<p class="l-text">where \\(\\mu^* = \\max_a \\mu_a\\) is the best arm's expected reward. A good algorithm has sub-linear regret, ideally \\(O(\\log T)\\).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Arm</div><div class="card-body">A choice (product, headline, ad).</div></div>
<div class="calc-card"><div class="card-title">Reward</div><div class="card-body">Click (0 / 1), watch time, revenue.</div></div>
<div class="calc-card"><div class="card-title">Horizon T</div><div class="card-body">Number of impressions in the experiment.</div></div>
<div class="calc-card"><div class="card-title">Regret</div><div class="card-body">Reward you would have made playing the best arm vs what you actually made.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Epsilon-Greedy: The Lazy Baseline</h2>
<p class="l-text">With probability \\(1 - \\epsilon\\) play the arm with the best estimated mean; with probability \\(\\epsilon\\) play a random arm. Trivially simple, surprisingly competitive when \\(\\epsilon\\) is annealed (decreased over time).</p>
<div class="calc-highlight">Epsilon-greedy with constant ε has linear regret. With \\(\\epsilon_t = 1/\\sqrt{t}\\) it can match UCB up to constants — and is much easier to ship.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. UCB1 (Auer 2002)</h2>
<p class="l-text">Upper Confidence Bound replaces the exploration randomness with explicit optimism: pick the arm with the highest <em>upper confidence bound</em> on the mean.</p>
<div class="katex-block">$$a_t = \\arg\\max_a \\left( \\hat{\\mu}_a + \\sqrt{\\frac{2 \\log t}{n_a}} \\right)$$</div>
<p class="l-text">Arms played few times have a large bonus; well-tested arms have a tight bound. UCB1 has provable \\(O(\\log T)\\) regret. The algorithm is deterministic given history — handy for debugging.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Thompson Sampling (1933, rediscovered 2010s)</h2>
<p class="l-text">Maintain a Beta(α, β) posterior over each arm's click probability. To pick, draw one sample from each arm's posterior and play the argmax sample. Bayesian and beautiful. Empirically Thompson often beats UCB on real data despite the simpler theory.</p>
<div class="katex-block">$$\\theta_a \\sim \\text{Beta}(\\alpha_a, \\beta_a), \\quad a_t = \\arg\\max_a \\theta_a$$</div>
<p class="l-text">After observing reward \\(r \\in \\{0, 1\\}\\): \\(\\alpha_a \\leftarrow \\alpha_a + r\\), \\(\\beta_a \\leftarrow \\beta_a + (1 - r)\\). Bayesian update is one line of code.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bandit Showdown on df_orders</h2>
<p class="l-text">We treat each product as an arm. The "true" click probability of an arm is the empirical purchase rate normalized to [0.05, 0.4]. Then we simulate 5000 impressions for each algorithm and plot cumulative reward.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

counts = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>().<span class="fn">sort_index</span>()
true_p = (counts / counts.<span class="fn">max</span>()).values * <span class="num">0.35</span> + <span class="num">0.05</span>
K = <span class="fn">len</span>(true_p)
T = <span class="num">5000</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">simulate_eps_greedy</span>(eps=<span class="num">0.1</span>):
    n = np.<span class="fn">zeros</span>(K); s = np.<span class="fn">zeros</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; eps <span class="kw">or</span> n.<span class="fn">min</span>() == <span class="num">0</span>:
            a = rng.<span class="fn">integers</span>(<span class="num">0</span>, K)
        <span class="kw">else</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(s / np.<span class="fn">maximum</span>(n, <span class="num">1</span>)))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        n[a] += <span class="num">1</span>; s[a] += r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

<span class="kw">def</span> <span class="fn">simulate_ucb</span>():
    n = np.<span class="fn">zeros</span>(K); s = np.<span class="fn">zeros</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T + <span class="num">1</span>):
        <span class="kw">if</span> n.<span class="fn">min</span>() == <span class="num">0</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmin</span>(n))
        <span class="kw">else</span>:
            mu = s / n
            bonus = np.<span class="fn">sqrt</span>(<span class="num">2.0</span> * np.<span class="fn">log</span>(t) / n)
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(mu + bonus))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        n[a] += <span class="num">1</span>; s[a] += r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

<span class="kw">def</span> <span class="fn">simulate_thompson</span>():
    a_p = np.<span class="fn">ones</span>(K); b_p = np.<span class="fn">ones</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        theta = rng.<span class="fn">beta</span>(a_p, b_p)
        a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(theta))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        a_p[a] += r; b_p[a] += <span class="num">1</span> - r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

eg = <span class="fn">simulate_eps_greedy</span>()
ub = <span class="fn">simulate_ucb</span>()
ts = <span class="fn">simulate_thompson</span>()
<span class="fn">print</span>(<span class="str">"Cumulative clicks at T:"</span>)
<span class="fn">print</span>(f<span class="str">"  eps-greedy(0.1)  : {eg[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  UCB1             : {ub[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  Thompson sampling: {ts[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  oracle           : {<span class="fn">int</span>(true_p.<span class="fn">max</span>() * T)}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Build per-arm click probabilities from product purchase counts. 2) Simulate three algorithms over T = 5000 impressions. 3) eps-greedy explores randomly 10% of the time. 4) UCB picks the arm with the largest mean + sqrt(2 log t / n) bonus. 5) Thompson draws from each arm's Beta posterior and plays the argmax. 6) Compare cumulative clicks vs the oracle (always-play-best). Thompson and UCB should both beat eps-greedy.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Contextual Bandits</h2>
<p class="l-text">Plain bandits ignore the user. Contextual bandits condition the arm choice on a context vector \\(x_t \\in \\mathbb{R}^d\\) (user features, time of day, device). Now the reward of an arm is a function of context: \\(\\mathbb{E}[r | a, x] = \\theta_a^T x\\).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why contextual</div><div class="card-body">Different users have different best arms. Static bandits cannot personalize.</div></div>
<div class="calc-card"><div class="card-title">LinUCB (Li 2010)</div><div class="card-body">Linear model per arm with confidence bound. Used by Yahoo News for headline selection.</div></div>
<div class="calc-card"><div class="card-title">Neural bandits</div><div class="card-body">Replace linear with MLP / transformer. NeuralUCB, Wide-Deep bandits.</div></div>
<div class="calc-card"><div class="card-title">Connection to RL</div><div class="card-body">Contextual bandits = single-step RL. No state transitions, just immediate reward.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. LinUCB Implementation</h2>
<p class="l-text">LinUCB maintains for each arm a covariance matrix \\(A_a\\) (Identity + sum of x x^T) and a response vector \\(b_a\\) (sum of r * x). The estimated weight is \\(\\hat{\\theta}_a = A_a^{-1} b_a\\) and the upper confidence bound is \\(\\hat{\\theta}_a^T x + \\alpha \\sqrt{x^T A_a^{-1} x}\\).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Synthetic context per impression: user age band one-hot (4 dims)</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
T, K, d = <span class="num">2000</span>, <span class="num">5</span>, <span class="num">4</span>
true_w = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.7</span>, (K, d))   <span class="cm"># each arm has its own preference</span>

A = [np.<span class="fn">eye</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]
b = [np.<span class="fn">zeros</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]
alpha = <span class="num">1.0</span>
reward = []
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    x = np.<span class="fn">eye</span>(d)[rng.<span class="fn">integers</span>(<span class="num">0</span>, d)]    <span class="cm"># pick a one-hot age band</span>
    ucbs = []
    <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(K):
        Ainv = np.<span class="fn">linalg</span>.inv(A[a])
        theta = Ainv @ b[a]
        ucbs.<span class="fn">append</span>(theta @ x + alpha * np.<span class="fn">sqrt</span>(x @ Ainv @ x))
    arm = <span class="fn">int</span>(np.<span class="fn">argmax</span>(ucbs))
    p_click = <span class="num">1.0</span> / (<span class="num">1.0</span> + np.<span class="fn">exp</span>(-(true_w[arm] @ x)))
    r = rng.<span class="fn">random</span>() &lt; p_click
    A[arm] += np.<span class="fn">outer</span>(x, x)
    b[arm] += r * x
    reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
<span class="fn">print</span>(f<span class="str">"LinUCB total clicks: {<span class="fn">sum</span>(reward)} / {T}"</span>)
<span class="fn">print</span>(f<span class="str">"Click rate: {<span class="fn">sum</span>(reward) / T:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generate 5 arms with secret 4-dim weight vectors. 2) For each impression draw a random one-hot context (age band). 3) For each arm compute the UCB on its predicted click probability. 4) Pick the highest-UCB arm. 5) Sample a click from a logistic of the true arm's weight x context. 6) Update the chosen arm's A and b. The click rate should converge above the random baseline.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. From Bandits to Full RL</h2>
<p class="l-text">Bandits are RL with one-step horizon. As soon as an action affects the next state (you show user a horror movie -&gt; their next-session preference shifts), you need the full RL machinery: Q-learning, policy gradients, RLHF. This is exactly what powers TikTok's session-aware autoplay and YouTube's session-RL paper (2019).</p>
<div class="calc-highlight">Bandits are the right tool when actions are independent. Full RL is needed when actions shape future state.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Cumulative Reward Curves</h2>
<div id="recsys7-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Bandits formalize exploration vs exploitation under unknown reward distributions.<br><strong>2.</strong> Eps-greedy is the cheap baseline; anneal ε for sub-linear regret.<br><strong>3.</strong> UCB1 (Auer 2002) is deterministic optimism with O(log T) regret.<br><strong>4.</strong> Thompson sampling (1933) is the Bayesian draw-from-posterior trick — often best in practice.<br><strong>5.</strong> Contextual bandits personalize per request; LinUCB (Li 2010) is the linear workhorse.<br><strong>6.</strong> When actions affect future state, escalate to full RL.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var x = []; var eg = []; var ub = []; var ts = []; var oracle = [];
  for (var t=0; t&lt;=5000; t+=200) {
    x.push(t);
    oracle.push(0.40 * t);
    eg.push(0.27 * t + 5*Math.random());
    ub.push(0.34 * t + 5*Math.random());
    ts.push(0.36 * t + 5*Math.random());
  }
  var data = [
    {x:x, y:oracle, name:'oracle (best arm)', type:'scatter', mode:'lines', line:{color:'#666', dash:'dash'}},
    {x:x, y:eg, name:'eps-greedy(0.1)', type:'scatter', mode:'lines', line:{color:'#999'}},
    {x:x, y:ub, name:'UCB1', type:'scatter', mode:'lines', line:{color:'#7cc'}},
    {x:x, y:ts, name:'Thompson', type:'scatter', mode:'lines', line:{color:T.accent}}
  ];
  var layout = {title:'Cumulative reward of bandit algorithms', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{title:'impression t', gridcolor:T.grid}, yaxis:{title:'cumulative reward', gridcolor:T.grid}, margin:{t:50,r:30,b:50,l:60}};
  ['recsys7-plot-en','recsys7-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Modelin yalnızca şu an en iyi olduğuna inandığını öneriyorsa, başka hiçbir şey hakkında asla öğrenemez. Bu, öneri sistemlerindeki en derin gerilimdir: gösterilen her madde, hem para kazanma hem öğrenme şansıdır. Multi-armed bandits sana ikisini dengelemenin ilkeli bir yolunu verir.</strong></p>
<p class="l-text">Bu derste epsilon-greedy, UCB1 (Auer 2002) ve Thompson sampling'i tek bir paylaşılan problem ifadesinden türeteceksin, sonra bağlamsal banditleri ve LinUCB'yi (Li vd. 2010, Yahoo News'in üretimde kullandığı algoritma) tanıyacaksın. Her üç klasik bandit numpy'da uygulanacak ve sipariş veri seti üzerinde çalıştırılacak, her ürün bir kol ve her tıklama bir ödül olarak ele alınacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Multi-armed bandit problemini ve minimize etmeye çalıştığı pişmanlığı (regret) ifade et</li>
<li>Epsilon-greedy uygula ve keşif oranını ayarla</li>
<li>UCB1'in güven sınırını türet ve neden log(t)'nin doğru keşif oranı olduğunu açıkla</li>
<li>Bernoulli kollar üzerinde Beta posteriorlarıyla Thompson sampling çalıştır</li>
<li>Bağlamsal banditleri bağlamsal olmayanlardan tek bir örnekle ayırt et</li>
<li>LinUCB'yi YouTube / haber / reklam teknolojisi (adtech) kişiselleştirmesine bağla</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Bandit Problemi</h2>
<p class="l-text">K kolla (ürünler, haber başlıkları, reklam kreatifleri) karşı karşıyasın. Her adımda bir kol seçer ve kolun bilinmeyen dağılımından örneklenmiş bir ödül gözlemlersin. Hedef: T adım boyunca toplam ödülü maksimize et. Bu, keşif vs sömürü olarak çerçevelenmiş öneridir.</p>
<div class="katex-block">$$\\text{Regret}(T) = T \\cdot \\mu^* - \\mathbb{E}\\left[ \\sum_{t=1}^{T} r_t \\right]$$</div>
<p class="l-text">burada \\(\\mu^* = \\max_a \\mu_a\\) en iyi kolun beklenen ödülüdür. İyi bir algoritmanın doğrusal-altı pişmanlığı vardır, ideali \\(O(\\log T)\\).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kol</div><div class="card-body">Bir seçim (ürün, başlık, reklam).</div></div>
<div class="calc-card"><div class="card-title">Ödül</div><div class="card-body">Tıklama (0 / 1), izleme süresi, gelir.</div></div>
<div class="calc-card"><div class="card-title">Ufuk T</div><div class="card-body">Deneydeki gösterim sayısı.</div></div>
<div class="calc-card"><div class="card-title">Pişmanlık</div><div class="card-body">En iyi kolu oynasaydın kazanacağın ödül ile gerçekte kazandığın arasındaki fark.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Epsilon-Greedy: Tembel Taban</h2>
<p class="l-text">\\(1 - \\epsilon\\) olasılıkla en iyi tahmin edilen ortalamaya sahip kolu oyna; \\(\\epsilon\\) olasılıkla rastgele bir kol oyna. Önemsiz şekilde basit, \\(\\epsilon\\) tavlandığında (zamanla azaltıldığında) şaşırtıcı derecede rekabetçi.</p>
<div class="calc-highlight">Sabit ε ile epsilon-greedy doğrusal pişmanlığa sahiptir. \\(\\epsilon_t = 1/\\sqrt{t}\\) ile UCB ile sabitlere kadar eşleşebilir — ve sahaya sürmek çok daha kolaydır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. UCB1 (Auer 2002)</h2>
<p class="l-text">Upper Confidence Bound, keşif rastgeleliğini açık iyimserlikle değiştirir: ortalamaya ait <em>üst güven sınırı</em> en yüksek olan kolu seç.</p>
<div class="katex-block">$$a_t = \\arg\\max_a \\left( \\hat{\\mu}_a + \\sqrt{\\frac{2 \\log t}{n_a}} \\right)$$</div>
<p class="l-text">Az oynanan kollar büyük bir bonusa sahiptir; iyi test edilmiş kolların sıkı bir sınırı vardır. UCB1'in kanıtlanabilir \\(O(\\log T)\\) pişmanlığı vardır. Algoritma geçmiş verildiğinde deterministiktir — hata ayıklama için kullanışlı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Thompson Sampling (1933, 2010'larda yeniden keşfedildi)</h2>
<p class="l-text">Her kolun tıklama olasılığı üzerinde bir Beta(α, β) posterioru tut. Seçmek için, her kolun posteriorundan bir örnek çek ve argmax örneği oyna. Bayesian ve güzel. Ampirik olarak Thompson, daha basit teoriye rağmen gerçek veride sıklıkla UCB'yi yener.</p>
<div class="katex-block">$$\\theta_a \\sim \\text{Beta}(\\alpha_a, \\beta_a), \\quad a_t = \\arg\\max_a \\theta_a$$</div>
<p class="l-text">Ödül \\(r \\in \\{0, 1\\}\\) gözlemlendikten sonra: \\(\\alpha_a \\leftarrow \\alpha_a + r\\), \\(\\beta_a \\leftarrow \\beta_a + (1 - r)\\). Bayesian güncelleme tek bir kod satırıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. df_orders Üzerinde Bandit Düellosu</h2>
<p class="l-text">Her ürünü bir kol olarak ele alıyoruz. Bir kolun "gerçek" tıklama olasılığı, [0,05, 0,4]'e normalize edilmiş ampirik satın alma oranıdır. Sonra her algoritma için 5000 gösterim simüle edip kümülatif ödülü çiziyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

counts = df_orders[<span class="str">"product_id"</span>].<span class="fn">value_counts</span>().<span class="fn">sort_index</span>()
true_p = (counts / counts.<span class="fn">max</span>()).values * <span class="num">0.35</span> + <span class="num">0.05</span>
K = <span class="fn">len</span>(true_p)
T = <span class="num">5000</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">simulate_eps_greedy</span>(eps=<span class="num">0.1</span>):
    n = np.<span class="fn">zeros</span>(K); s = np.<span class="fn">zeros</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; eps <span class="kw">or</span> n.<span class="fn">min</span>() == <span class="num">0</span>:
            a = rng.<span class="fn">integers</span>(<span class="num">0</span>, K)
        <span class="kw">else</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(s / np.<span class="fn">maximum</span>(n, <span class="num">1</span>)))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        n[a] += <span class="num">1</span>; s[a] += r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

<span class="kw">def</span> <span class="fn">simulate_ucb</span>():
    n = np.<span class="fn">zeros</span>(K); s = np.<span class="fn">zeros</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T + <span class="num">1</span>):
        <span class="kw">if</span> n.<span class="fn">min</span>() == <span class="num">0</span>:
            a = <span class="fn">int</span>(np.<span class="fn">argmin</span>(n))
        <span class="kw">else</span>:
            mu = s / n
            bonus = np.<span class="fn">sqrt</span>(<span class="num">2.0</span> * np.<span class="fn">log</span>(t) / n)
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(mu + bonus))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        n[a] += <span class="num">1</span>; s[a] += r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

<span class="kw">def</span> <span class="fn">simulate_thompson</span>():
    a_p = np.<span class="fn">ones</span>(K); b_p = np.<span class="fn">ones</span>(K); reward = []
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
        theta = rng.<span class="fn">beta</span>(a_p, b_p)
        a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(theta))
        r = rng.<span class="fn">random</span>() &lt; true_p[a]
        a_p[a] += r; b_p[a] += <span class="num">1</span> - r
        reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
    <span class="kw">return</span> np.<span class="fn">cumsum</span>(reward)

eg = <span class="fn">simulate_eps_greedy</span>()
ub = <span class="fn">simulate_ucb</span>()
ts = <span class="fn">simulate_thompson</span>()
<span class="fn">print</span>(<span class="str">"Cumulative clicks at T:"</span>)
<span class="fn">print</span>(f<span class="str">"  eps-greedy(0.1)  : {eg[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  UCB1             : {ub[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  Thompson sampling: {ts[-1]}"</span>)
<span class="fn">print</span>(f<span class="str">"  oracle           : {<span class="fn">int</span>(true_p.<span class="fn">max</span>() * T)}"</span>)</code></pre></div>
<p class="l-text"><strong>İşin özü:</strong> 1) Ürün satın alma sayılarından kol başına tıklama olasılıkları kur. 2) T = 5000 gösterim üzerinde üç algoritmayı simüle et. 3) eps-greedy zamanın %10'unda rastgele keşfeder. 4) UCB en büyük ortalama + sqrt(2 log t / n) bonusu olan kolu seçer. 5) Thompson her kolun Beta posteriorundan çekip argmax oynar. 6) Kümülatif tıklamaları oracle (her zaman en iyi oynar) ile karşılaştır. Thompson ve UCB ikisi de eps-greedy'yi yenmelidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bağlamsal Banditler</h2>
<p class="l-text">Düz banditler kullanıcıyı görmezden gelir. Bağlamsal banditler kol seçimini bir bağlam vektörü \\(x_t \\in \\mathbb{R}^d\\) (kullanıcı özellikleri, günün saati, cihaz) üzerine koşullar. Şimdi bir kolun ödülü bağlamın bir fonksiyonudur: \\(\\mathbb{E}[r | a, x] = \\theta_a^T x\\).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden bağlamsal</div><div class="card-body">Farklı kullanıcıların farklı en iyi kolları vardır. Statik banditler kişiselleştiremez.</div></div>
<div class="calc-card"><div class="card-title">LinUCB (Li 2010)</div><div class="card-body">Güven sınırlı kol başına lineer model. Yahoo News tarafından başlık seçiminde kullanıldı.</div></div>
<div class="calc-card"><div class="card-title">Sinir ağı banditleri</div><div class="card-body">Lineer'i MLP / transformer ile değiştir. NeuralUCB, Wide-Deep banditleri.</div></div>
<div class="calc-card"><div class="card-title">RL ile bağlantı</div><div class="card-body">Bağlamsal banditler = tek-adımlı RL. Durum geçişi yok, sadece anlık ödül.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. LinUCB Uygulaması</h2>
<p class="l-text">LinUCB her kol için bir kovaryans matrisi \\(A_a\\) (Identity + x x^T toplamı) ve bir yanıt vektörü \\(b_a\\) (r * x toplamı) tutar. Tahmin edilen ağırlık \\(\\hat{\\theta}_a = A_a^{-1} b_a\\) ve üst güven sınırı \\(\\hat{\\theta}_a^T x + \\alpha \\sqrt{x^T A_a^{-1} x}\\)'tir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

<span class="cm"># Gösterim başına sentetik bağlam: kullanıcı yaş bandı one-hot (4 boyut)</span>
rng = np.<span class="fn">random</span>.default_rng(<span class="num">0</span>)
T, K, d = <span class="num">2000</span>, <span class="num">5</span>, <span class="num">4</span>
true_w = rng.<span class="fn">normal</span>(<span class="num">0</span>, <span class="num">0.7</span>, (K, d))   <span class="cm"># her kolun kendi tercihi vardır</span>

A = [np.<span class="fn">eye</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]
b = [np.<span class="fn">zeros</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K)]
alpha = <span class="num">1.0</span>
reward = []
<span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(T):
    x = np.<span class="fn">eye</span>(d)[rng.<span class="fn">integers</span>(<span class="num">0</span>, d)]    <span class="cm"># bir one-hot yaş bandı seç</span>
    ucbs = []
    <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(K):
        Ainv = np.<span class="fn">linalg</span>.inv(A[a])
        theta = Ainv @ b[a]
        ucbs.<span class="fn">append</span>(theta @ x + alpha * np.<span class="fn">sqrt</span>(x @ Ainv @ x))
    arm = <span class="fn">int</span>(np.<span class="fn">argmax</span>(ucbs))
    p_click = <span class="num">1.0</span> / (<span class="num">1.0</span> + np.<span class="fn">exp</span>(-(true_w[arm] @ x)))
    r = rng.<span class="fn">random</span>() &lt; p_click
    A[arm] += np.<span class="fn">outer</span>(x, x)
    b[arm] += r * x
    reward.<span class="fn">append</span>(<span class="fn">int</span>(r))
<span class="fn">print</span>(f<span class="str">"LinUCB total clicks: {<span class="fn">sum</span>(reward)} / {T}"</span>)
<span class="fn">print</span>(f<span class="str">"Click rate: {<span class="fn">sum</span>(reward) / T:.3f}"</span>)</code></pre></div>
<p class="l-text"><strong>Mantık şöyle:</strong> 1) Gizli 4 boyutlu ağırlık vektörleriyle 5 kol oluştur. 2) Her gösterim için rastgele bir one-hot bağlam (yaş bandı) çek. 3) Her kol için tahmin edilen tıklama olasılığında UCB hesapla. 4) En yüksek UCB'li kolu seç. 5) Gerçek kolun ağırlığı x bağlamın logistic'inden bir tıklama örnekle. 6) Seçilen kolun A ve b'sini güncelle. Tıklama oranı rastgele tabandan üstte yakınsamalı.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Banditlerden Tam RL'ye</h2>
<p class="l-text">Banditler tek-adımlı ufkuyla RL'dir. Bir eylem sonraki durumu etkilediği anda (kullanıcıya korku filmi gösterirsin -&gt; sonraki oturum tercihi değişir), tam RL makinesine ihtiyacın var: Q-learning, policy gradients, RLHF. Bu tam olarak TikTok'un oturum farkındalıklı autoplay'ine ve YouTube'un session-RL makalesine (2019) güç veren şeydir.</p>
<div class="calc-highlight">Banditler eylemler bağımsız olduğunda doğru araçtır. Eylemler gelecekteki durumu şekillendirdiğinde tam RL gereklidir.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Kümülatif Ödül Eğrileri</h2>
<div id="recsys7-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Ana Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANA ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Banditler bilinmeyen ödül dağılımları altında keşif vs sömürüyü resmileştirir.<br><strong>2.</strong> Eps-greedy ucuz tabandır; alt-doğrusal pişmanlık için ε'yu tavla.<br><strong>3.</strong> UCB1 (Auer 2002) O(log T) pişmanlıklı deterministik iyimserliktir.<br><strong>4.</strong> Thompson sampling (1933) Bayesian posterior-dan-çek numarasıdır — pratikte sıklıkla en iyisi.<br><strong>5.</strong> Bağlamsal banditler istek başına kişiselleştirir; LinUCB (Li 2010) lineer beygirdir.<br><strong>6.</strong> Eylemler gelecekteki durumu etkilediğinde tam RL'ye yükselt.</div></div>
</div>

<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>`
};
