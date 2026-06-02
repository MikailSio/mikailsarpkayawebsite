window.RL_L3 = {

en: `<p class="l-text"><strong>If you know the entire MDP — every transition probability and every reward — you do not need to "learn" anything. You can solve it directly with dynamic programming.</strong> This is the cleanest setting in RL and the foundation everyone else builds on.</p>
<p class="l-text">In this lesson you will learn Bellman optimality, policy iteration, value iteration, and code a complete grid-world solver from scratch.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the Bellman optimality equation for V* and Q*</li>
<li>Explain why the Bellman operator is a gamma-contraction and converges</li>
<li>Implement policy evaluation followed by policy improvement in a loop</li>
<li>Implement value iteration as a single sweeping update until convergence</li>
<li>Solve a 4x4 GridWorld from scratch in numpy and visualize the optimal policy</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The "Known MDP" Setting</h2>
<p class="l-text">Dynamic programming (DP) assumes P(s'|s,a) and R(s,a) are fully known. This is rare in practice — but it gives us provably correct answers and the conceptual machinery (Bellman backups, contraction mappings) that all model-free RL inherits.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Known</div><div class="card-body">Tabletop puzzles, simple games with known rules, simulated grid worlds.</div></div>
<div class="calc-card"><div class="card-title">Unknown</div><div class="card-body">Robotics, video games from pixels, dialogue. Most real RL.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bellman Optimality</h2>
<p class="l-text">The optimal value V^*(s) satisfies:</p>
<div class="katex-block">$$V^{*}(s) = \\max_{a} \\left[ R(s,a) + \\gamma \\sum_{s'} P(s'|s,a) V^{*}(s') \\right]$$</div>
<p class="l-text">This is a fixed-point equation: V^* equals a function of itself. The Banach fixed-point theorem guarantees that iterating the right-hand side converges to V^* exponentially fast (because γ &lt; 1 makes the operator a contraction).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Policy Iteration</h2>
<p class="l-text">Alternate two steps until the policy stops changing:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Evaluation</div><div class="card-body">For the current policy π, compute V^π by solving the linear Bellman equations (or iterating).</div></div>
<div class="calc-card"><div class="card-title">Improvement</div><div class="card-body">Set π'(s) = argmax_a [R(s,a) + γ Σ P(s'|s,a) V^π(s')]. Greedy w.r.t. current value.</div></div>
</div>
<p class="l-text">Each improvement step gives a strictly better (or equal) policy. With finite states/actions, we hit the optimum in a finite number of iterations.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Value Iteration</h2>
<p class="l-text">Skip the explicit policy. Just smash Bellman optimality:</p>
<div class="katex-block">$$V_{k+1}(s) \\leftarrow \\max_{a} \\left[ R(s,a) + \\gamma \\sum_{s'} P(s'|s,a) V_k(s') \\right]$$</div>
<p class="l-text">Iterate until V stops changing. Then read off the policy: π^*(s) = argmax_a [...]. Simpler to code, often faster in practice.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A 4×4 Grid World</h2>
<p class="l-text">States = 16 cells (0..15). Goal at cell 15 (+1 reward). Actions = up/down/left/right. Each step costs −0.04 (live penalty). Movement is deterministic for simplicity.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

GRID = <span class="num">4</span>
N_STATES = GRID * GRID
GOAL = <span class="num">15</span>
ACTIONS = [(-<span class="num">1</span>,<span class="num">0</span>),(<span class="num">1</span>,<span class="num">0</span>),(<span class="num">0</span>,-<span class="num">1</span>),(<span class="num">0</span>,<span class="num">1</span>)]  <span class="cm"># up, down, left, right</span>
GAMMA = <span class="num">0.95</span>

<span class="kw">def</span> <span class="fn">step</span>(s, a):
    r, c = <span class="fn">divmod</span>(s, GRID)
    dr, dc = ACTIONS[a]
    nr, nc = <span class="fn">max</span>(<span class="num">0</span>,<span class="fn">min</span>(GRID-<span class="num">1</span>,r+dr)), <span class="fn">max</span>(<span class="num">0</span>,<span class="fn">min</span>(GRID-<span class="num">1</span>,c+dc))
    s_next = nr*GRID + nc
    <span class="kw">if</span> s_next == GOAL:
        <span class="kw">return</span> s_next, <span class="num">1.0</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, -<span class="num">0.04</span>, <span class="kw">False</span>

<span class="kw">def</span> <span class="fn">value_iteration</span>(theta=<span class="num">1e-6</span>):
    V = np.<span class="fn">zeros</span>(N_STATES)
    <span class="kw">while</span> <span class="kw">True</span>:
        delta = <span class="num">0</span>
        <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(N_STATES):
            <span class="kw">if</span> s == GOAL: <span class="kw">continue</span>
            v_old = V[s]
            best = -np.inf
            <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
                s_next, r, done = <span class="fn">step</span>(s, a)
                target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> GAMMA * V[s_next])
                <span class="kw">if</span> target &gt; best: best = target
            V[s] = best
            delta = <span class="fn">max</span>(delta, <span class="fn">abs</span>(v_old - V[s]))
        <span class="kw">if</span> delta &lt; theta: <span class="kw">break</span>
    <span class="kw">return</span> V

V = <span class="fn">value_iteration</span>()
<span class="fn">print</span>(V.<span class="fn">reshape</span>(GRID, GRID).<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Define the 4×4 grid, four moves, and a step function returning (next state, reward, done). 2) Initialize V to zeros. 3) Loop: for each non-goal state, compute the max-Bellman target over the four actions and update V. 4) Stop when the largest change in any state is below θ. 5) Print V — values rise as you near the goal, decrease in the corner farthest away.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Reading Off the Optimal Policy</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">greedy_policy</span>(V):
    pi = np.<span class="fn">zeros</span>(N_STATES, dtype=<span class="ty">int</span>)
    <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(N_STATES):
        <span class="kw">if</span> s == GOAL: <span class="kw">continue</span>
        best_a, best_val = <span class="num">0</span>, -np.inf
        <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
            s_next, r, done = <span class="fn">step</span>(s, a)
            target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> GAMMA * V[s_next])
            <span class="kw">if</span> target &gt; best_val:
                best_val, best_a = target, a
        pi[s] = best_a
    <span class="kw">return</span> pi

pi = <span class="fn">greedy_policy</span>(V)
arrows = [<span class="str">'^'</span>,<span class="str">'v'</span>,<span class="str">'&lt;'</span>,<span class="str">'&gt;'</span>]
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(GRID):
    <span class="fn">print</span>(<span class="str">' '</span>.<span class="fn">join</span>(arrows[pi[r*GRID+c]] <span class="kw">if</span> r*GRID+c != GOAL <span class="kw">else</span> <span class="str">'G'</span> <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(GRID)))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) For each state, look at all four actions and pick the one with the highest Bellman target. 2) Print arrows. The result is a vector field pointing toward the goal — exactly the optimal navigation policy.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Convergence Visualization</h2>
<div id="rl3-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">Value iteration shrinks the Bellman error geometrically. Each iteration multiplies the remaining error by at most γ.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Limitations of DP</h2>
<p class="l-text">Two killers: (a) we usually do not know P, and (b) even when we do, the state space might be too big to sweep over (chess: 10^46 states). The rest of the course addresses these. Monte Carlo and TD avoid needing P; deep RL avoids needing to enumerate states.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> DP solves the MDP exactly when P and R are known.<br><strong>2.</strong> Bellman optimality is a fixed-point equation; iterating it converges to V^*.<br><strong>3.</strong> Policy iteration alternates evaluation + improvement; value iteration just iterates the max-Bellman.<br><strong>4.</strong> Greedy w.r.t. V^* gives π^*.<br><strong>5.</strong> A 4×4 gridworld can be solved in &lt; 100 lines of numpy.<br><strong>6.</strong> Real RL relaxes "P known" (model-free) and "states enumerable" (deep RL).</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var k = Array.from({length:40}, (_,i)=>i+1);
  var err = k.map(function(i){return Math.pow(0.95,i);});
  var data = [{x:k,y:err,name:'||V_k - V*||',type:'scatter',mode:'lines+markers',line:{color:T.accent,width:2.5}}];
  var layout = {title:'Value iteration — error shrinks geometrically (γ=0.95)',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Iteration k',gridcolor:T.grid},yaxis:{title:'Sup-norm error',type:'log',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['rl3-plot-en','rl3-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Tüm MDP'yi biliyorsan — her geçiş olasılığını ve her ödülü — hiçbir şey "öğrenmene" gerek yok. Dinamik programlama ile doğrudan çözebilirsin.</strong> Bu RL'in en temiz ortamıdır ve diğer her şeyin üzerine inşa edildiği zemindir.</p>
<p class="l-text">Bu derste Bellman optimalliği, politika iterasyonu, değer iterasyonu ve sıfırdan tam bir grid-world çözücüsü kodlayacaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>V* ve Q* için Bellman optimallik denklemini ifade etmeyi</li>
<li>Bellman operatörünün gamma-daraltma olduğunu ve neden yakınsadığını açıklamayı</li>
<li>Politika değerlendirme ve politika iyileştirmeyi bir döngü içinde uygulamayı</li>
<li>Değer iterasyonunu yakınsayana kadar tek geçişli bir güncelleme olarak yazmayı</li>
<li>4x4 GridWorld'ü numpy'da sıfırdan çözmeyi ve optimal politikayı görselleştirmeyi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. "Bilinen MDP" Ortamı</h2>
<p class="l-text">Dinamik programlama (DP), P(s'|s,a) ve R(s,a)'nın tam olarak bilindiğini varsayar. Pratikte nadirdir — ama bize kanıtlanabilir doğru cevaplar ve tüm model-bağımsız RL'in miras aldığı kavramsal makineyi (Bellman güncellemeleri, daraltma dönüşümleri) verir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bilinen</div><div class="card-body">Masa üstü bulmacalar, kuralı bilinen basit oyunlar, simüle gridworld'ler.</div></div>
<div class="calc-card"><div class="card-title">Bilinmeyen</div><div class="card-body">Robotik, piksellerden video oyunları, diyalog. RL'in çoğu.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bellman Optimalliği</h2>
<p class="l-text">Optimal değer V^*(s) şunu sağlar:</p>
<div class="katex-block">$$V^{*}(s) = \\max_{a} \\left[ R(s,a) + \\gamma \\sum_{s'} P(s'|s,a) V^{*}(s') \\right]$$</div>
<p class="l-text">Bu bir sabit nokta denklemidir: V^* kendi fonksiyonuna eşittir. Banach sabit nokta teoremi, sağ tarafı iterasyonla V^*'a üstel hızlı yakınsadığını garantiler (çünkü γ &lt; 1 operatörü daraltıcı yapar).</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Politika İterasyonu</h2>
<p class="l-text">Politika değişmeyene kadar iki adımı sırayla yap:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değerlendirme</div><div class="card-body">Mevcut π politikası için V^π'i hesapla (lineer Bellman'ı çözerek ya da iterasyonla).</div></div>
<div class="calc-card"><div class="card-title">İyileştirme</div><div class="card-body">π'(s) = argmax_a [R(s,a) + γ Σ P(s'|s,a) V^π(s')]. Mevcut değere göre açgözlü.</div></div>
</div>
<p class="l-text">Her iyileştirme adımı kesinlikle daha iyi (ya da eşit) bir politika verir. Sonlu durum/eylemde optimuma sonlu sayıda iterasyonda ulaşırız.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Değer İterasyonu</h2>
<p class="l-text">Açık politikayı atla. Doğrudan Bellman optimalliğini ez:</p>
<div class="katex-block">$$V_{k+1}(s) \\leftarrow \\max_{a} \\left[ R(s,a) + \\gamma \\sum_{s'} P(s'|s,a) V_k(s') \\right]$$</div>
<p class="l-text">V değişmeyene kadar iterasyon yap. Sonra politikayı oku: π^*(s) = argmax_a [...]. Kodlaması daha basit, çoğunlukla pratikte daha hızlı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 4×4 Grid Dünyası</h2>
<p class="l-text">Durumlar = 16 hücre (0..15). Hedef 15. hücrede (+1 ödül). Eylemler = yukarı/aşağı/sol/sağ. Her adım −0.04 maliyet (yaşam cezası). Hareket basitlik için deterministik.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

GRID = <span class="num">4</span>
N_STATES = GRID * GRID
GOAL = <span class="num">15</span>
ACTIONS = [(-<span class="num">1</span>,<span class="num">0</span>),(<span class="num">1</span>,<span class="num">0</span>),(<span class="num">0</span>,-<span class="num">1</span>),(<span class="num">0</span>,<span class="num">1</span>)]  <span class="cm"># yukari, asagi, sol, sag</span>
GAMMA = <span class="num">0.95</span>

<span class="kw">def</span> <span class="fn">step</span>(s, a):
    r, c = <span class="fn">divmod</span>(s, GRID)
    dr, dc = ACTIONS[a]
    nr, nc = <span class="fn">max</span>(<span class="num">0</span>,<span class="fn">min</span>(GRID-<span class="num">1</span>,r+dr)), <span class="fn">max</span>(<span class="num">0</span>,<span class="fn">min</span>(GRID-<span class="num">1</span>,c+dc))
    s_next = nr*GRID + nc
    <span class="kw">if</span> s_next == GOAL:
        <span class="kw">return</span> s_next, <span class="num">1.0</span>, <span class="kw">True</span>
    <span class="kw">return</span> s_next, -<span class="num">0.04</span>, <span class="kw">False</span>

<span class="kw">def</span> <span class="fn">value_iteration</span>(theta=<span class="num">1e-6</span>):
    V = np.<span class="fn">zeros</span>(N_STATES)
    <span class="kw">while</span> <span class="kw">True</span>:
        delta = <span class="num">0</span>
        <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(N_STATES):
            <span class="kw">if</span> s == GOAL: <span class="kw">continue</span>
            v_old = V[s]
            best = -np.inf
            <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
                s_next, r, done = <span class="fn">step</span>(s, a)
                target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> GAMMA * V[s_next])
                <span class="kw">if</span> target &gt; best: best = target
            V[s] = best
            delta = <span class="fn">max</span>(delta, <span class="fn">abs</span>(v_old - V[s]))
        <span class="kw">if</span> delta &lt; theta: <span class="kw">break</span>
    <span class="kw">return</span> V

V = <span class="fn">value_iteration</span>()
<span class="fn">print</span>(V.<span class="fn">reshape</span>(GRID, GRID).<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Akışı izleyelim:</strong> 1) 4×4 grid, dört hareket ve (sonraki durum, ödül, bitti) döndüren bir step fonksiyonu tanımla. 2) V'yi sıfırla başlat. 3) Döngü: hedef olmayan her durum için dört eylem üzerinden maks-Bellman hedefini hesapla ve V'yi güncelle. 4) Herhangi bir durumdaki en büyük değişim θ'nın altına düştüğünde dur. 5) V'yi yazdır — değerler hedefe yaklaştıkça yükselir, en uzak köşede düşer.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Optimal Politikayı Okuma</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">greedy_policy</span>(V):
    pi = np.<span class="fn">zeros</span>(N_STATES, dtype=<span class="ty">int</span>)
    <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">range</span>(N_STATES):
        <span class="kw">if</span> s == GOAL: <span class="kw">continue</span>
        best_a, best_val = <span class="num">0</span>, -np.inf
        <span class="kw">for</span> a <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>):
            s_next, r, done = <span class="fn">step</span>(s, a)
            target = r + (<span class="num">0</span> <span class="kw">if</span> done <span class="kw">else</span> GAMMA * V[s_next])
            <span class="kw">if</span> target &gt; best_val:
                best_val, best_a = target, a
        pi[s] = best_a
    <span class="kw">return</span> pi

pi = <span class="fn">greedy_policy</span>(V)
arrows = [<span class="str">'^'</span>,<span class="str">'v'</span>,<span class="str">'&lt;'</span>,<span class="str">'&gt;'</span>]
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(GRID):
    <span class="fn">print</span>(<span class="str">' '</span>.<span class="fn">join</span>(arrows[pi[r*GRID+c]] <span class="kw">if</span> r*GRID+c != GOAL <span class="kw">else</span> <span class="str">'G'</span> <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(GRID)))</code></pre></div>
<p class="l-text"><strong>Çalışma mantığı:</strong> 1) Her durum için dört eyleme bak ve en yüksek Bellman hedefini veren eylemi seç. 2) Okları yazdır. Sonuç hedefe doğru yönelen bir vektör alanı — tam olarak optimal navigasyon politikası.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yakınsama Görselleştirmesi</h2>
<div id="rl3-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">Değer iterasyonu Bellman hatasını geometrik olarak küçültür. Her iterasyon kalan hatayı en fazla γ ile çarpar.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. DP'nin Kısıtları</h2>
<p class="l-text">İki katil: (a) genelde P'yi bilmeyiz ve (b) bilsek bile durum uzayı taranamayacak kadar büyük olabilir (satranç: 10^46 durum). Kursun geri kalanı bunlarla ilgilenir. Monte Carlo ve TD P'ye ihtiyaç duymaz; derin RL durumları sıralamaya ihtiyaç duymaz.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> DP, P ve R bilindiğinde MDP'yi tam çözer.<br><strong>2.</strong> Bellman optimalliği bir sabit nokta denklemidir; iterasyon V^*'a yakınsar.<br><strong>3.</strong> Politika iterasyonu değerlendirme + iyileştirme; değer iterasyonu sadece maks-Bellman.<br><strong>4.</strong> V^*'a göre açgözlü olmak π^*'ı verir.<br><strong>5.</strong> 4×4 gridworld &lt; 100 satır numpy ile çözülebilir.<br><strong>6.</strong> Gerçek RL "P bilinen" (model-bağımsız) ve "durumlar sıralanabilir" (derin RL) varsayımlarını gevşetir.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
