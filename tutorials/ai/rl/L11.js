window.RL_L11 = {

en: `<p class="l-text"><strong>Multi-armed bandits are RL stripped down to its purest form: just the explore-exploit tradeoff, no states, no transitions.</strong> Despite their simplicity, bandits power A/B testing, ad serving, news feed ranking, recommender systems, and clinical trials. Knowing them well will sharpen your RL intuition AND give you a tool you can ship to production tomorrow.</p>
<p class="l-text">In this lesson you will learn the bandit setting, ε-greedy, UCB, Thompson sampling, the regret framework, and contextual bandits as the bridge to full RL.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the K-armed bandit setting and the explore-exploit dilemma</li>
<li>Implement epsilon-greedy, UCB1, and Thompson sampling on Bernoulli arms</li>
<li>Define cumulative regret and read the log-T lower bound from Lai-Robbins</li>
<li>Run an A/B test as a 2-armed bandit and beat fixed-split traffic</li>
<li>Extend to contextual bandits with LinUCB as the bridge to full RL</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Bandit Setup</h2>
<p class="l-text">A row of K slot machines (arms). Each round you pick one arm, get a stochastic reward (e.g. Bernoulli with unknown p_a). Goal: maximize total reward over T rounds. There is no "state" — every round is identical.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">K</div><div class="card-body">Number of arms (e.g. 10 different ad creatives, 5 article variants).</div></div>
<div class="calc-card"><div class="card-title">μ_a</div><div class="card-body">True mean reward of arm a — unknown.</div></div>
<div class="calc-card"><div class="card-title">N_t(a)</div><div class="card-body">Number of times arm a has been pulled by round t.</div></div>
<div class="calc-card"><div class="card-title">Q̂_t(a)</div><div class="card-body">Empirical mean — sample average of rewards from arm a.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Regret — The Universal Yardstick</h2>
<p class="l-text">Regret = total reward of always picking the best arm − total reward you actually got.</p>
<div class="katex-block">$$\\mathcal{R}(T) = T \\cdot \\mu^{*} - \\sum_{t=1}^{T} \\mu_{a_t}$$</div>
<p class="l-text">Sublinear regret (R(T) / T → 0) means we are learning the right arm. Optimal algorithms achieve O(log T) regret — almost flat. Bad ones grow linearly.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ε-Greedy</h2>
<p class="l-text">Same idea as Q-learning: with prob 1−ε pick argmax Q̂, with prob ε pick uniformly. Simple, robust, but linear regret unless ε decays as 1/t. A common production-friendly variant: ε starts at 0.1, decays slowly. Strong baseline for tasks with a few thousand rounds.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. UCB — Upper Confidence Bound</h2>
<p class="l-text">"Optimism in the face of uncertainty." For each arm, compute an upper confidence bound on its true mean. Always pick the arm with the highest bound.</p>
<div class="katex-block">$$a_t = \\arg\\max_{a} \\left[ \\hat{Q}_t(a) + c \\sqrt{\\frac{\\ln t}{N_t(a)}} \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q̂_t(a)</div><div class="card-body">Empirical mean reward.</div></div>
<div class="calc-card"><div class="card-title">c</div><div class="card-body">Exploration constant. c=2 in classical UCB1.</div></div>
<div class="calc-card"><div class="card-title">ln t / N_t(a)</div><div class="card-body">Confidence radius — shrinks as we pull the arm more often.</div></div>
</div>
<p class="l-text">UCB1 achieves O(log T) regret without any hyperparameter tuning. It pulls poorly-tested arms enough to know their value, then exploits.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Thompson Sampling — Bayesian Bandits</h2>
<p class="l-text">Maintain a posterior over each arm's mean. Each round, sample from each posterior, pick the arm with the highest sample, observe reward, update posterior. Beautifully simple and often the best in practice.</p>
<p class="l-text">For Bernoulli arms, conjugate prior is Beta. Start each arm with Beta(1,1) (uniform). After observing s successes and f failures, posterior is Beta(1+s, 1+f).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Beta(α,β)</div><div class="card-body">Conjugate prior for Bernoulli rewards. Mean = α/(α+β).</div></div>
<div class="calc-card"><div class="card-title">Sample then pick</div><div class="card-body">Each round: draw θ_a ~ Beta(α_a, β_a), pick argmax θ_a.</div></div>
<div class="calc-card"><div class="card-title">Update</div><div class="card-body">If reward 1: α += 1; if 0: β += 1.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hands-on: Three Algorithms vs 10-Armed Bandit</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)

K, T = <span class="num">10</span>, <span class="num">5000</span>
true_means = np.random.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, K)
optimal = true_means.<span class="fn">max</span>()

<span class="kw">def</span> <span class="fn">pull</span>(a):
    <span class="kw">return</span> <span class="fn">float</span>(np.random.<span class="fn">rand</span>() &lt; true_means[a])

<span class="kw">def</span> <span class="fn">epsilon_greedy</span>(eps=<span class="num">0.1</span>):
    Q = np.<span class="fn">zeros</span>(K); N = np.<span class="fn">zeros</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        a = np.random.<span class="fn">randint</span>(K) <span class="kw">if</span> np.random.<span class="fn">rand</span>() &lt; eps <span class="kw">else</span> <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q))
        r = <span class="fn">pull</span>(a); N[a] += <span class="num">1</span>; Q[a] += (r - Q[a]) / N[a]
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

<span class="kw">def</span> <span class="fn">ucb1</span>(c=<span class="num">2.0</span>):
    Q = np.<span class="fn">zeros</span>(K); N = np.<span class="fn">zeros</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        <span class="kw">if</span> t &lt;= K: a = t-<span class="num">1</span>
        <span class="kw">else</span>:
            ucb = Q + c * np.<span class="fn">sqrt</span>(np.<span class="fn">log</span>(t) / N)
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(ucb))
        r = <span class="fn">pull</span>(a); N[a] += <span class="num">1</span>; Q[a] += (r - Q[a]) / N[a]
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

<span class="kw">def</span> <span class="fn">thompson</span>():
    alpha = np.<span class="fn">ones</span>(K); beta = np.<span class="fn">ones</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        samples = np.random.<span class="fn">beta</span>(alpha, beta)
        a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(samples))
        r = <span class="fn">pull</span>(a)
        <span class="kw">if</span> r == <span class="num">1</span>: alpha[a] += <span class="num">1</span>
        <span class="kw">else</span>: beta[a] += <span class="num">1</span>
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

reg_eps = <span class="fn">epsilon_greedy</span>(); reg_ucb = <span class="fn">ucb1</span>(); reg_ts = <span class="fn">thompson</span>()
<span class="fn">print</span>(<span class="str">"eps-greedy final regret:"</span>, reg_eps[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"UCB1 final regret:      "</span>, reg_ucb[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"Thompson final regret:  "</span>, reg_ts[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generate 10 arms with random Bernoulli probabilities. 2) Implement three algorithms — each plays 5000 rounds. 3) ε-greedy: random with prob 0.1, else argmax mean. 4) UCB1: pull each arm once, then optimistic upper bound. 5) Thompson: Beta(α,β) per arm, sample-then-pick. 6) Track cumulative regret. Typical result: Thompson and UCB1 finish near each other, both crushing ε-greedy by 3–10x.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Regret Comparison</h2>
<div id="rl11-plot-en" style="width:100%;height:400px;"></div>
<p class="l-text">UCB and Thompson grow logarithmically. ε-greedy with constant ε grows linearly — eventually dominated.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Production Use Cases</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A/B testing</div><div class="card-body">Bandit allocates traffic dynamically — fewer users see losing variants. Faster than fixed splits.</div></div>
<div class="calc-card"><div class="card-title">News / feed ranking</div><div class="card-body">LinkedIn, YouTube, Yahoo News — bandits explore new items.</div></div>
<div class="calc-card"><div class="card-title">Ad serving</div><div class="card-body">Google, Meta — bandits balance learning new ad performance with revenue.</div></div>
<div class="calc-card"><div class="card-title">Clinical trials</div><div class="card-body">Adaptive trials assign more patients to better-performing treatments.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Contextual Bandits — Bridge to Full RL</h2>
<p class="l-text">In practice, the "best arm" depends on context — user features, time of day, query. Contextual bandit: each round get context x_t, pick action a, observe reward r_t. Goal: learn π(a | x).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LinUCB</div><div class="card-body">Linear reward model + UCB. Yahoo News deployed this.</div></div>
<div class="calc-card"><div class="card-title">Neural bandits</div><div class="card-body">NN reward model with uncertainty (e.g. via dropout or ensembles).</div></div>
</div>
<p class="l-text">A contextual bandit with state transitions (next context depends on action) is a full MDP — back to RL. So the spectrum is: bandit → contextual bandit → MDP.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Bandits = RL with one state. Pure explore-exploit.<br><strong>2.</strong> Regret R(T) = optimal_total − actual_total. Sublinear is good; logarithmic is best.<br><strong>3.</strong> ε-greedy: simple, robust, linear regret if ε constant.<br><strong>4.</strong> UCB1: optimism in face of uncertainty, log-T regret, no tuning.<br><strong>5.</strong> Thompson sampling: Bayesian, sample-then-pick, often best in practice.<br><strong>6.</strong> Production uses: A/B testing, recommendations, ads, clinical trials.<br><strong>7.</strong> Contextual bandits add side info → linear or NN models with uncertainty.<br><strong>8.</strong> Add transitions → you have an MDP. Bandits are the seed of all RL.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var t = Array.from({length:50}, (_,i)=>(i+1)*100);
  var eps_r = t.map(function(tt){return tt*0.05 + Math.sqrt(tt)*0.5;});
  var ucb_r = t.map(function(tt){return Math.log(tt+1)*8 + Math.sqrt(tt)*0.3;});
  var ts_r = t.map(function(tt){return Math.log(tt+1)*7 + Math.sqrt(tt)*0.25;});
  var data = [
    {x:t,y:eps_r,name:'ε-greedy (ε=0.1)',type:'scatter',mode:'lines',line:{color:'#888',width:2}},
    {x:t,y:ucb_r,name:'UCB1',type:'scatter',mode:'lines',line:{color:'#88e',width:2}},
    {x:t,y:ts_r,name:'Thompson',type:'scatter',mode:'lines',line:{color:T.accent,width:2.2}}
  ];
  var layout = {title:'10-armed bandit — cumulative regret',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Round',gridcolor:T.grid},yaxis:{title:'Cumulative regret',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl11-plot-en','rl11-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Çok kollu eşkıyalar (multi-armed bandits) RL'in en saf hâline indirgenmiş hâlidir: sadece keşif-sömürü ödünleşimi, durum yok, geçiş yok.</strong> Basitliklerine rağmen banditler A/B testlemeyi, reklam sunumunu, haber akışı sıralamasını, öneri sistemlerini ve klinik denemeleri besler. Onları iyi bilmek RL sezgini keskinleştirir VE yarın üretime alabileceğin bir araç verir.</p>
<p class="l-text">Bu derste bandit ortamını, ε-greedy'yi, UCB'yi, Thompson örneklemesini, pişmanlık (regret) çerçevesini ve tam RL'e köprü olarak bağlamsal banditleri öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>K-kollu bandit ortamını ve keşif-sömürü ikilemini tanımlamayı</li>
<li>Bernoulli kollarda epsilon-greedy, UCB1 ve Thompson örneklemesini uygulamayı</li>
<li>Kümülatif pişmanlığı tanımlamayı ve Lai-Robbins log-T alt sınırını okumayı</li>
<li>A/B testini 2-kollu bandit olarak çalıştırıp sabit-bölme trafiği yenmeyi</li>
<li>LinUCB ile bağlamsal banditlere geçip tam RL'e köprü kurmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Bandit Kurulumu</h2>
<p class="l-text">K slot makinesi (kol) sırası. Her turda birini seçersin, stokastik ödül alırsın (ör. bilinmeyen p_a olasılıklı Bernoulli). Amaç: T tur boyunca toplam ödülü maksimize. "Durum" yok — her tur özdeş.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">K</div><div class="card-body">Kol sayısı (ör. 10 farklı reklam yaratıcı, 5 makale varyantı).</div></div>
<div class="calc-card"><div class="card-title">μ_a</div><div class="card-body">a kolunun gerçek ortalama ödülü — bilinmeyen.</div></div>
<div class="calc-card"><div class="card-title">N_t(a)</div><div class="card-body">t turuna kadar a kolunun çekilme sayısı.</div></div>
<div class="calc-card"><div class="card-title">Q_t(a)</div><div class="card-body">Ampirik ortalama — a kolundan gelen ödüllerin örneklem ortalaması.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pişmanlık — Evrensel Ölçüt</h2>
<p class="l-text">Pişmanlık = en iyi kolu hep seçmenin toplam ödülü − gerçekten aldığın toplam ödül.</p>
<div class="katex-block">$$\\mathcal{R}(T) = T \\cdot \\mu^{*} - \\sum_{t=1}^{T} \\mu_{a_t}$$</div>
<p class="l-text">Sublineer pişmanlık (R(T) / T → 0) doğru kolu öğrendiğimiz anlamına gelir. Optimal algoritmalar O(log T) pişmanlığa ulaşır — neredeyse düz. Kötüler doğrusal büyür.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ε-Greedy</h2>
<p class="l-text">Q-learning'le aynı fikir: 1−ε olasılıkla argmax Q, ε olasılıkla tekdüze. Basit, sağlam ama ε 1/t gibi azalmazsa pişmanlık doğrusaldır. Yaygın üretim-dostu varyant: ε 0.1'den başlar yavaşça azalır. Birkaç bin turluk görevler için güçlü taban.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. UCB — Üst Güven Sınırı</h2>
<p class="l-text">"Belirsizlik karşısında iyimserlik." Her kol için gerçek ortalamasının üst güven sınırını hesapla. Hep en yüksek sınıra sahip kolu seç.</p>
<div class="katex-block">$$a_t = \\arg\\max_{a} \\left[ \\hat{Q}_t(a) + c \\sqrt{\\frac{\\ln t}{N_t(a)}} \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q_t(a)</div><div class="card-body">Ampirik ortalama ödül.</div></div>
<div class="calc-card"><div class="card-title">c</div><div class="card-body">Keşif sabiti. Klasik UCB1'de c=2.</div></div>
<div class="calc-card"><div class="card-title">ln t / N_t(a)</div><div class="card-body">Güven yarıçapı — kolu daha çok çektikçe küçülür.</div></div>
</div>
<p class="l-text">UCB1 hiçbir hiperparametre ayarı olmadan O(log T) pişmanlık başarır. Az test edilmiş kolları değerlerini bilecek kadar çeker, sonra sömürür.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Thompson Örneklemesi — Bayesçi Banditler</h2>
<p class="l-text">Her kolun ortalaması üzerinde sonsal sakla. Her turda, her sonsaldan örnekle, en yüksek örneği veren kolu seç, ödülü gözle, sonsalı güncelle. Çok güzel basit ve pratikte çoğu zaman en iyi.</p>
<p class="l-text">Bernoulli kollar için eşlenik ön Beta'dır. Her kolu Beta(1,1) (tekdüze) ile başlat. s başarı f başarısızlık gözledikten sonra sonsal Beta(1+s, 1+f).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Beta(α,β)</div><div class="card-body">Bernoulli ödüller için eşlenik ön. Ortalama = α/(α+β).</div></div>
<div class="calc-card"><div class="card-title">Örnekle, sonra seç</div><div class="card-body">Her turda: θ_a ~ Beta(α_a, β_a) çek, argmax θ_a seç.</div></div>
<div class="calc-card"><div class="card-title">Güncelle</div><div class="card-body">Ödül 1 ise α += 1; 0 ise β += 1.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uygulama: 10-Kollu Bandit'e Üç Algoritma</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)

K, T = <span class="num">10</span>, <span class="num">5000</span>
true_means = np.random.<span class="fn">uniform</span>(<span class="num">0</span>, <span class="num">1</span>, K)
optimal = true_means.<span class="fn">max</span>()

<span class="kw">def</span> <span class="fn">pull</span>(a):
    <span class="kw">return</span> <span class="fn">float</span>(np.random.<span class="fn">rand</span>() &lt; true_means[a])

<span class="kw">def</span> <span class="fn">epsilon_greedy</span>(eps=<span class="num">0.1</span>):
    Q = np.<span class="fn">zeros</span>(K); N = np.<span class="fn">zeros</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        a = np.random.<span class="fn">randint</span>(K) <span class="kw">if</span> np.random.<span class="fn">rand</span>() &lt; eps <span class="kw">else</span> <span class="fn">int</span>(np.<span class="fn">argmax</span>(Q))
        r = <span class="fn">pull</span>(a); N[a] += <span class="num">1</span>; Q[a] += (r - Q[a]) / N[a]
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

<span class="kw">def</span> <span class="fn">ucb1</span>(c=<span class="num">2.0</span>):
    Q = np.<span class="fn">zeros</span>(K); N = np.<span class="fn">zeros</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        <span class="kw">if</span> t &lt;= K: a = t-<span class="num">1</span>
        <span class="kw">else</span>:
            ucb = Q + c * np.<span class="fn">sqrt</span>(np.<span class="fn">log</span>(t) / N)
            a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(ucb))
        r = <span class="fn">pull</span>(a); N[a] += <span class="num">1</span>; Q[a] += (r - Q[a]) / N[a]
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

<span class="kw">def</span> <span class="fn">thompson</span>():
    alpha = np.<span class="fn">ones</span>(K); beta = np.<span class="fn">ones</span>(K); regret = []; cum = <span class="num">0</span>
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, T+<span class="num">1</span>):
        samples = np.random.<span class="fn">beta</span>(alpha, beta)
        a = <span class="fn">int</span>(np.<span class="fn">argmax</span>(samples))
        r = <span class="fn">pull</span>(a)
        <span class="kw">if</span> r == <span class="num">1</span>: alpha[a] += <span class="num">1</span>
        <span class="kw">else</span>: beta[a] += <span class="num">1</span>
        cum += optimal - true_means[a]; regret.<span class="fn">append</span>(cum)
    <span class="kw">return</span> regret

reg_eps = <span class="fn">epsilon_greedy</span>(); reg_ucb = <span class="fn">ucb1</span>(); reg_ts = <span class="fn">thompson</span>()
<span class="fn">print</span>(<span class="str">"eps-greedy son pismanlik:"</span>, reg_eps[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"UCB1 son pismanlik:      "</span>, reg_ucb[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"Thompson son pismanlik:  "</span>, reg_ts[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>Çalışma mantığı:</strong> 1) Rastgele Bernoulli olasılıklarıyla 10 kol üret. 2) Üç algoritma kur — her biri 5000 tur oynar. 3) ε-greedy: 0.1 olasılıkla rastgele, yoksa argmax ortalama. 4) UCB1: her kolu bir kez çek, sonra iyimser üst sınır. 5) Thompson: kol başına Beta(α,β), önce örnekle sonra seç. 6) Kümülatif pişmanlığı izle. Tipik sonuç: Thompson ve UCB1 yakın bitirir, ikisi de ε-greedy'yi 3–10× ezer.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pişmanlık Karşılaştırması</h2>
<div id="rl11-plot-tr" style="width:100%;height:400px;"></div>
<p class="l-text">UCB ve Thompson logaritmik büyür. Sabit ε ile ε-greedy doğrusal büyür — sonunda baskılanır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Üretim Kullanım Senaryoları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A/B testleme</div><div class="card-body">Bandit trafiği dinamik dağıtır — daha az kullanıcı kaybeden varyantı görür. Sabit bölmeden hızlı.</div></div>
<div class="calc-card"><div class="card-title">Haber / akış sıralama</div><div class="card-body">LinkedIn, YouTube, Yahoo News — banditler yeni öğeleri keşfeder.</div></div>
<div class="calc-card"><div class="card-title">Reklam sunumu</div><div class="card-body">Google, Meta — banditler yeni reklam performansını öğrenmeyi gelirle dengeler.</div></div>
<div class="calc-card"><div class="card-title">Klinik denemeler</div><div class="card-body">Uyarlanır denemeler daha çok hastayı daha iyi performans gösteren tedaviye atar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bağlamsal Banditler — Tam RL'e Köprü</h2>
<p class="l-text">Pratikte "en iyi kol" bağlama bağlıdır — kullanıcı özellikleri, günün saati, sorgu. Bağlamsal bandit: her turda bağlam x_t al, eylem a seç, ödül r_t gözle. Amaç: π(a | x) öğren.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LinUCB</div><div class="card-body">Doğrusal ödül modeli + UCB. Yahoo News bunu kullandı.</div></div>
<div class="calc-card"><div class="card-title">Sinir banditler</div><div class="card-body">Belirsizlikli NN ödül modeli (ör. dropout ya da ensemble ile).</div></div>
</div>
<p class="l-text">Durum geçişi olan bağlamsal bandit (sonraki bağlam eyleme bağlı) tam bir MDP'dir — RL'e geri. Yani spektrum: bandit → bağlamsal bandit → MDP.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Banditler = tek durumlu RL. Saf keşif-sömürü.<br><strong>2.</strong> Pişmanlık R(T) = optimal_toplam − gerçek_toplam. Sublineer iyi; logaritmik en iyi.<br><strong>3.</strong> ε-greedy: basit, sağlam, ε sabitse doğrusal pişmanlık.<br><strong>4.</strong> UCB1: belirsizlik karşısında iyimserlik, log-T pişmanlık, ayar gerekmez.<br><strong>5.</strong> Thompson örneklemesi: Bayesçi, önce örnekle sonra seç, pratikte çoğu zaman en iyi.<br><strong>6.</strong> Üretim kullanımları: A/B testleme, öneri, reklam, klinik denemeler.<br><strong>7.</strong> Bağlamsal banditler yan bilgi ekler → belirsizlikli doğrusal ya da NN modeller.<br><strong>8.</strong> Geçişler ekle → MDP'n var. Banditler tüm RL'in tohumudur.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
