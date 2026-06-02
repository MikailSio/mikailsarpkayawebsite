window.RL_L10 = {

en: `<p class="l-text"><strong>RLHF — Reinforcement Learning from Human Feedback — is what turned GPT-3 into ChatGPT.</strong> A raw language model knows how to predict the next token; RLHF teaches it to be helpful, harmless, and honest. This is the lesson where reinforcement learning meets natural language processing — exactly the bridge from reinforcement learning to modern NLP.</p>
<p class="l-text">In this lesson you will learn the three-stage RLHF pipeline (SFT → RM → PPO), the reward model loss, the KL-regularized RL objective, DPO as a simpler alternative, and run a minimal RLHF loop with HuggingFace TRL.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Walk through the three RLHF stages: SFT, reward model, and PPO fine-tuning</li>
<li>Train a Bradley-Terry reward model from human preference pairs</li>
<li>Apply the KL-regularized RL objective that keeps the policy near the SFT model</li>
<li>Compare RLHF with DPO, which optimizes preferences without an explicit RM</li>
<li>Run a minimal RLHF loop on a small LLM with HuggingFace TRL</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Alignment Problem</h2>
<p class="l-text">A pretrained LLM is trained to predict the next token on internet text. It can generate plausible text — but it does not know that helpfulness, refusing harmful requests, or admitting ignorance are desired. We need to align its output distribution with human preferences. RL is well-suited because human preferences are hard to express as a differentiable loss but easy to express as comparisons ("this response is better than that one").</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pretraining</div><div class="card-body">Next-token prediction on huge corpus. Knowledge but not behavior.</div></div>
<div class="calc-card"><div class="card-title">SFT</div><div class="card-body">Imitate human-written ideal responses.</div></div>
<div class="calc-card"><div class="card-title">RLHF</div><div class="card-body">Tune toward what humans actually prefer when comparing outputs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Stage 1 — Supervised Fine-Tuning (SFT)</h2>
<p class="l-text">Collect (prompt, ideal completion) pairs from human labelers. Fine-tune the pretrained LLM to maximize log P(completion | prompt) — standard cross-entropy. Result: π_SFT, a model that already produces decent answers most of the time. This is also the reference policy for the KL penalty later.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Stage 2 — Reward Model</h2>
<p class="l-text">Show humans pairs of completions (y_w "winner", y_l "loser") for the same prompt x. Train a reward model r_φ(x, y) — typically initialized from the SFT model with a scalar head — to score winners higher.</p>
<div class="katex-block">$$L_{RM}(\\phi) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma\\left( r_{\\phi}(x, y_w) - r_{\\phi}(x, y_l) \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ</div><div class="card-body">Sigmoid — Bradley-Terry preference model: P(w &gt; l) = σ(r_w − r_l).</div></div>
<div class="calc-card"><div class="card-title">y_w / y_l</div><div class="card-body">Winner / loser — chosen / rejected response.</div></div>
<div class="calc-card"><div class="card-title">r_φ(x,y)</div><div class="card-body">Scalar score for completion y given prompt x.</div></div>
</div>
<p class="l-text">After training, r_φ is a learned proxy for human preference — we can score any new (x,y) without asking a human.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Stage 3 — RL with KL Penalty</h2>
<p class="l-text">Use PPO to fine-tune the SFT model to maximize r_φ — but with a KL penalty back to π_SFT to prevent reward hacking and language collapse.</p>
<div class="katex-block">$$\\max_{\\theta} \\ \\mathbb{E}_{x \\sim D,\\ y \\sim \\pi_{\\theta}} \\left[ r_{\\phi}(x, y) - \\beta \\, \\text{KL}\\left( \\pi_{\\theta}(\\cdot | x) \\,\\|\\, \\pi_{\\text{SFT}}(\\cdot | x) \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">π_θ</div><div class="card-body">Policy (the LM being trained). State = prompt + tokens so far. Action = next token.</div></div>
<div class="calc-card"><div class="card-title">r_φ(x,y)</div><div class="card-body">Reward at end of generation — terminal reward.</div></div>
<div class="calc-card"><div class="card-title">β</div><div class="card-body">KL coefficient, typically 0.01–0.1. Big = stay close to SFT. Small = chase reward hard.</div></div>
<div class="calc-card"><div class="card-title">π_SFT</div><div class="card-body">Reference policy. Frozen.</div></div>
</div>
<p class="l-text">Why the KL? Without it, π_θ exploits quirks of r_φ — produces gibberish that scores high on the reward model but is no longer fluent English. The KL anchors π_θ to fluent SFT behavior while letting it shift toward higher reward.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The LM as an MDP</h2>
<p class="l-text">Mapping language generation to RL:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">State s_t</div><div class="card-body">Prompt x + tokens generated so far (y_1, ..., y_{t-1}).</div></div>
<div class="calc-card"><div class="card-title">Action a_t</div><div class="card-body">Next token y_t — sampled from π_θ(·|s_t).</div></div>
<div class="calc-card"><div class="card-title">Reward</div><div class="card-body">r_φ(x, y) at terminal step. Per-step KL penalty as dense reward.</div></div>
<div class="calc-card"><div class="card-title">Episode</div><div class="card-body">One full generation. Length up to max_new_tokens.</div></div>
</div>
<p class="l-text">PPO can be applied directly: collect rollouts (generations), compute advantages with the per-token KL-regularized rewards, run the clipped surrogate update. This is exactly InstructGPT and ChatGPT's training recipe.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Minimal RLHF with HuggingFace TRL</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> PPOTrainer, PPOConfig, AutoModelForCausalLMWithValueHead
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> torch

<span class="cm"># 1. Load SFT model + ref model + reward model</span>
model_name = <span class="str">"lvwerra/gpt2-imdb"</span>
tok = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name); tok.pad_token = tok.eos_token
model = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)
ref_model = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)

<span class="kw">from</span> transformers <span class="kw">import</span> pipeline
reward_pipe = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>, model=<span class="str">"lvwerra/distilbert-imdb"</span>)

<span class="kw">def</span> <span class="fn">reward_fn</span>(text):
    out = <span class="fn">reward_pipe</span>(text)[<span class="num">0</span>]
    <span class="cm"># We want positive sentiment -&gt; reward = positive class score</span>
    <span class="kw">return</span> out[<span class="str">"score"</span>] <span class="kw">if</span> out[<span class="str">"label"</span>] == <span class="str">"POSITIVE"</span> <span class="kw">else</span> <span class="num">1</span> - out[<span class="str">"score"</span>]

<span class="cm"># 2. PPO config</span>
cfg = <span class="fn">PPOConfig</span>(model_name=model_name, learning_rate=<span class="num">1.4e-5</span>, batch_size=<span class="num">64</span>,
                mini_batch_size=<span class="num">8</span>, init_kl_coef=<span class="num">0.2</span>, target=<span class="num">6.0</span>)
ppo_trainer = <span class="fn">PPOTrainer</span>(cfg, model, ref_model, tok)

<span class="cm"># 3. Training loop</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train"</span>).<span class="fn">shuffle</span>(seed=<span class="num">42</span>)
<span class="kw">for</span> batch <span class="kw">in</span> ds.<span class="fn">iter</span>(batch_size=<span class="num">64</span>):
    queries = [<span class="fn">tok</span>(p[:<span class="num">200</span>], return_tensors=<span class="str">"pt"</span>).input_ids[<span class="num">0</span>] <span class="kw">for</span> p <span class="kw">in</span> batch[<span class="str">"text"</span>]]
    responses = [ppo_trainer.<span class="fn">generate</span>(q, max_new_tokens=<span class="num">30</span>, do_sample=<span class="kw">True</span>) <span class="kw">for</span> q <span class="kw">in</span> queries]
    response_texts = [tok.<span class="fn">decode</span>(r[<span class="num">0</span>]) <span class="kw">for</span> r <span class="kw">in</span> responses]
    rewards = [torch.<span class="fn">tensor</span>(<span class="fn">reward_fn</span>(t)) <span class="kw">for</span> t <span class="kw">in</span> response_texts]
    stats = ppo_trainer.<span class="fn">step</span>(queries, [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> responses], rewards)
    <span class="fn">print</span>(stats[<span class="str">"objective/kl"</span>], stats[<span class="str">"ppo/mean_scores"</span>])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TRL (HF) is blocked. RLHF reward modeling is just a binary classifier on (response_a, response_b, preferred). We use sklearn LogisticRegression.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
pairs = [
    ('Polite reply: thank you for asking', 'rude reply: shut up', 0),
    ('Helpful answer: here is the code', 'unhelpful: I dont know', 0),
    ('Clear: 2+2=4',                      'wrong: 2+2=5',       0),
    ('rude: shut up',                     'Polite: thank you',   1),
    ('unhelpful: idk',                    'Helpful: try this',   1),
    ('wrong: pi=4',                       'Right: pi≈3.14',      1),
]
texts = [p[0] + ' || ' + p[1] for p in pairs]
y = [p[2] for p in pairs]
X = TfidfVectorizer().fit_transform(texts)
rm = LogisticRegression().fit(X, y)
print('Reward model accuracy:', round(rm.score(X, y), 3))
print('Coefs (truncated):', np.round(rm.coef_[0][:8], 2))</code></pre></div>
</div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Load a pretrained GPT-2 IMDB SFT checkpoint as both the policy and reference. 2) Use a pretrained sentiment classifier as the reward model — score = "how positive does this completion sound?". 3) Configure PPO with KL coefficient 0.2 (will adapt to keep KL ≈ 6). 4) For each batch of IMDB prompts, generate 30 new tokens, score with the sentiment model, run PPO step. 5) Over training, the model learns to extend reviews in a positive direction while staying close to the original GPT-2 distribution. This is RLHF in microcosm.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. DPO — Direct Preference Optimization</h2>
<p class="l-text">Rafailov et al 2023. The full RLHF pipeline (SFT → RM → PPO) is brittle — three training stages, reward hacking, hyperparameter sensitivity. DPO removes the reward model entirely. It uses a clever derivation showing that the optimal RLHF policy can be expressed in closed form via the SFT model and the preference data, leading to a simple supervised loss:</p>
<div class="katex-block">$$L_{DPO}(\\theta) = -\\mathbb{E}\\left[ \\log \\sigma\\left( \\beta \\log \\frac{\\pi_{\\theta}(y_w|x)}{\\pi_{\\text{SFT}}(y_w|x)} - \\beta \\log \\frac{\\pi_{\\theta}(y_l|x)}{\\pi_{\\text{SFT}}(y_l|x)} \\right) \\right]$$</div>
<p class="l-text">Train directly on preference pairs, no PPO, no separate reward model. Often matches or beats RLHF, much simpler. Used in Llama 3 and many open instruct-tuned models.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. RLAIF and Constitutional AI</h2>
<p class="l-text">Anthropic's Constitutional AI swaps human feedback for AI feedback against a written constitution (a list of principles). The model critiques and revises its own outputs based on the constitution; preferences are derived from that. RLAIF (RL from AI Feedback) is the same concept generalized — used to scale alignment without exhausting human raters.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Why This Matters for NLP Research</h2>
<p class="l-text">For an NLP practitioner, RLHF is the connection point. Sentiment analysis, dialogue systems, toxicity reduction, summarization quality, instruction following — all are now framed as alignment problems. Knowing how to fine-tune with TRL, build a reward model, and apply DPO is increasingly a baseline expectation. The research frontier in 2025–2026 is mostly about better preference data, smarter reward models (process supervision, debate, self-critique), and cheaper alignment (DPO, IPO, KTO).</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. KL Behavior During Training</h2>
<div id="rl10-plot-en" style="width:100%;height:380px;"></div>
<p class="l-text">A well-tuned RLHF run shows reward climbing and KL stabilizing near the target. If KL explodes, the model is collapsing to gibberish; if reward stalls, β is too aggressive.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> RLHF aligns LLMs with human preferences via three stages: SFT, reward model, PPO.<br><strong>2.</strong> Reward model loss: −log σ(r_w − r_l) on pairs (Bradley-Terry).<br><strong>3.</strong> RL objective: maximize r_φ(x,y) − β KL(π_θ ‖ π_SFT). KL keeps fluency.<br><strong>4.</strong> The LM is the policy; tokens are actions; reward is given at end of generation.<br><strong>5.</strong> HuggingFace TRL gives a working PPO loop in ~30 lines.<br><strong>6.</strong> DPO replaces the entire pipeline with a single supervised loss on preference pairs — increasingly the default.<br><strong>7.</strong> RLAIF / Constitutional AI scale alignment with model-generated preferences.<br><strong>8.</strong> RLHF is where RL meets NLP — the most consequential application of RL in 2024–2026.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var step = Array.from({length:60}, (_,i)=>i*100);
  var reward = step.map(function(s,i){return -0.5 + 1.4*(1 - Math.exp(-i/20)) + (Math.random()-0.5)*0.05;});
  var kl = step.map(function(s,i){return Math.min(8, 0.5 + i*0.15) + (Math.random()-0.5)*0.5;});
  var data = [
    {x:step,y:reward,name:'Mean reward',type:'scatter',mode:'lines',line:{color:T.accent,width:2},yaxis:'y'},
    {x:step,y:kl,name:'KL to SFT',type:'scatter',mode:'lines',line:{color:'#88e',width:2},yaxis:'y2'}
  ];
  var layout = {title:'RLHF training — reward and KL over time',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'PPO step',gridcolor:T.grid},yaxis:{title:'Reward',gridcolor:T.grid,side:'left'},yaxis2:{title:'KL',gridcolor:T.grid,overlaying:'y',side:'right'},margin:{t:50,r:60,b:50,l:60}};
  ['rl10-plot-en','rl10-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>RLHF — İnsan Geri Bildiriminden Pekiştirmeli Öğrenme — GPT-3'ü ChatGPT'ye dönüştüren şeydir.</strong> Ham bir dil modeli sonraki tokeni nasıl tahmin edeceğini bilir; RLHF ona yardımcı, zararsız ve dürüst olmayı öğretir. Bu, pekiştirmeli öğrenmenin doğal dil işlemeyle buluştuğu derstir — pekiştirmeli öğrenmeden modern NLP'ye geçmek için kritik köprü.</p>
<p class="l-text">Bu derste üç-aşamalı RLHF pipeline'ını (SFT → RM → PPO), ödül modeli kaybını, KL-düzenleyicili RL amacını, daha basit bir alternatif olan DPO'yu öğrenecek ve HuggingFace TRL ile minimal bir RLHF döngüsü çalıştıracaksın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>RLHF'in üç aşamasını izlemeyi: SFT, ödül modeli ve PPO ince ayarı</li>
<li>İnsan tercih çiftlerinden Bradley-Terry ödül modeli eğitmeyi</li>
<li>Politikayı SFT modeline yakın tutan KL-düzenleyicili RL amacını uygulamayı</li>
<li>RLHF ile tercihleri açık RM olmadan optimize eden DPO'yu karşılaştırmayı</li>
<li>HuggingFace TRL ile küçük bir LLM üstünde minimal RLHF döngüsü çalıştırmayı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Hizalama Problemi</h2>
<p class="l-text">Önceden eğitilmiş LLM, internet metninde sonraki tokeni tahmin etmek üzere eğitilmiştir. Akla yatkın metin üretebilir — ama yardımcı olmanın, zararlı istekleri reddetmenin ya da bilmediğini kabul etmenin istendiğini bilmez. Çıktı dağılımını insan tercihleriyle hizalamamız gerekir. RL buna uygundur çünkü insan tercihleri türevlenebilir kayıp olarak ifade etmesi zordur ama karşılaştırma olarak ifade etmesi kolaydır ("bu yanıt şundan iyi").</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ön eğitim</div><div class="card-body">Devasa korpusta sonraki-token tahmini. Bilgi var ama davranış yok.</div></div>
<div class="calc-card"><div class="card-title">SFT</div><div class="card-body">İnsanın yazdığı ideal yanıtları taklit et.</div></div>
<div class="calc-card"><div class="card-title">RLHF</div><div class="card-body">İnsanlar çıktıları karşılaştırırken ne tercih ediyorsa ona göre ayarla.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Aşama 1 — Denetimli İnce Ayar (SFT)</h2>
<p class="l-text">İnsan etiketleyicilerden (prompt, ideal tamamlama) çiftleri topla. Önceden eğitilmiş LLM'i log P(tamamlama | prompt)'u maksimize edecek şekilde ince ayarla — standart çapraz entropi. Sonuç: π_SFT, çoğu zaman zaten makul cevaplar üreten bir model. Bu aynı zamanda ileride KL cezası için referans politikadır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Aşama 2 — Ödül Modeli</h2>
<p class="l-text">İnsanlara aynı prompt x için tamamlama çiftleri (y_w "kazanan", y_l "kaybeden") göster. Bir ödül modeli r_φ(x, y) eğit — tipik olarak SFT modelinden skaler başlıkla başlatılır — kazananları daha yüksek puanlasın diye.</p>
<div class="katex-block">$$L_{RM}(\\phi) = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma\\left( r_{\\phi}(x, y_w) - r_{\\phi}(x, y_l) \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">σ</div><div class="card-body">Sigmoid — Bradley-Terry tercih modeli: P(w &gt; l) = σ(r_w − r_l).</div></div>
<div class="calc-card"><div class="card-title">y_w / y_l</div><div class="card-body">Kazanan / kaybeden — seçilen / reddedilen yanıt.</div></div>
<div class="calc-card"><div class="card-title">r_φ(x,y)</div><div class="card-body">Prompt x verili y tamamlaması için skaler skor.</div></div>
</div>
<p class="l-text">Eğitimden sonra r_φ insan tercihinin öğrenilmiş bir vekilidir — insana sormadan herhangi bir yeni (x,y)'yi puanlayabiliriz.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Aşama 3 — KL Cezalı RL</h2>
<p class="l-text">PPO ile SFT modelini r_φ'yi maksimize edecek şekilde ince ayarla — ama ödül hilesini ve dil çöküşünü önlemek için π_SFT'ye geri KL cezasıyla.</p>
<div class="katex-block">$$\\max_{\\theta} \\ \\mathbb{E}_{x \\sim D,\\ y \\sim \\pi_{\\theta}} \\left[ r_{\\phi}(x, y) - \\beta \\, \\text{KL}\\left( \\pi_{\\theta}(\\cdot | x) \\,\\|\\, \\pi_{\\text{SFT}}(\\cdot | x) \\right) \\right]$$</div>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">π_θ</div><div class="card-body">Politika (eğitilen LM). Durum = prompt + şu ana kadarki tokenler. Eylem = sonraki token.</div></div>
<div class="calc-card"><div class="card-title">r_φ(x,y)</div><div class="card-body">Üretim sonunda ödül — terminal ödül.</div></div>
<div class="calc-card"><div class="card-title">β</div><div class="card-body">KL katsayısı, tipik 0.01–0.1. Büyük = SFT'ye yakın kal. Küçük = ödülü sıkı kovala.</div></div>
<div class="calc-card"><div class="card-title">π_SFT</div><div class="card-body">Referans politika. Dondurulmuş.</div></div>
</div>
<p class="l-text">KL neden? Onsuz π_θ, r_φ'nin tuhaflıklarını sömürür — ödül modelinde yüksek puan alan ama artık akıcı İngilizce olmayan saçmalıklar üretir. KL, π_θ'yi akıcı SFT davranışına demirler ama daha yüksek ödüle doğru kaymasına izin verir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. MDP Olarak LM</h2>
<p class="l-text">Dil üretimini RL'e eşleme:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Durum s_t</div><div class="card-body">Prompt x + şu ana kadar üretilen tokenler (y_1, ..., y_{t-1}).</div></div>
<div class="calc-card"><div class="card-title">Eylem a_t</div><div class="card-body">Sonraki token y_t — π_θ(·|s_t)'den örneklenir.</div></div>
<div class="calc-card"><div class="card-title">Ödül</div><div class="card-body">Terminal adımda r_φ(x, y). Yoğun ödül olarak adım başına KL cezası.</div></div>
<div class="calc-card"><div class="card-title">Bölüm</div><div class="card-body">Bir tam üretim. Uzunluk en fazla max_new_tokens.</div></div>
</div>
<p class="l-text">PPO doğrudan uygulanabilir: yürütme (üretim) topla, token başına KL-düzenleyicili ödüllerle avantajları hesapla, kırpılmış vekil güncellemesini çalıştır. Bu tam olarak InstructGPT ve ChatGPT'nin eğitim tarifidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HuggingFace TRL ile Minimal RLHF</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> trl <span class="kw">import</span> PPOTrainer, PPOConfig, AutoModelForCausalLMWithValueHead
<span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer
<span class="kw">from</span> datasets <span class="kw">import</span> load_dataset
<span class="kw">import</span> torch

<span class="cm"># 1. SFT modeli + ref model + ödül modeli yükle</span>
model_name = <span class="str">"lvwerra/gpt2-imdb"</span>
tok = AutoTokenizer.<span class="fn">from_pretrained</span>(model_name); tok.pad_token = tok.eos_token
model = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)
ref_model = AutoModelForCausalLMWithValueHead.<span class="fn">from_pretrained</span>(model_name)

<span class="kw">from</span> transformers <span class="kw">import</span> pipeline
reward_pipe = <span class="fn">pipeline</span>(<span class="str">"sentiment-analysis"</span>, model=<span class="str">"lvwerra/distilbert-imdb"</span>)

<span class="kw">def</span> <span class="fn">reward_fn</span>(text):
    out = <span class="fn">reward_pipe</span>(text)[<span class="num">0</span>]
    <span class="cm"># Pozitif duygu istiyoruz -&gt; ödül = pozitif sınıf skoru</span>
    <span class="kw">return</span> out[<span class="str">"score"</span>] <span class="kw">if</span> out[<span class="str">"label"</span>] == <span class="str">"POSITIVE"</span> <span class="kw">else</span> <span class="num">1</span> - out[<span class="str">"score"</span>]

<span class="cm"># 2. PPO yapılandırması</span>
cfg = <span class="fn">PPOConfig</span>(model_name=model_name, learning_rate=<span class="num">1.4e-5</span>, batch_size=<span class="num">64</span>,
                mini_batch_size=<span class="num">8</span>, init_kl_coef=<span class="num">0.2</span>, target=<span class="num">6.0</span>)
ppo_trainer = <span class="fn">PPOTrainer</span>(cfg, model, ref_model, tok)

<span class="cm"># 3. Eğitim döngüsü</span>
ds = <span class="fn">load_dataset</span>(<span class="str">"imdb"</span>, split=<span class="str">"train"</span>).<span class="fn">shuffle</span>(seed=<span class="num">42</span>)
<span class="kw">for</span> batch <span class="kw">in</span> ds.<span class="fn">iter</span>(batch_size=<span class="num">64</span>):
    queries = [<span class="fn">tok</span>(p[:<span class="num">200</span>], return_tensors=<span class="str">"pt"</span>).input_ids[<span class="num">0</span>] <span class="kw">for</span> p <span class="kw">in</span> batch[<span class="str">"text"</span>]]
    responses = [ppo_trainer.<span class="fn">generate</span>(q, max_new_tokens=<span class="num">30</span>, do_sample=<span class="kw">True</span>) <span class="kw">for</span> q <span class="kw">in</span> queries]
    response_texts = [tok.<span class="fn">decode</span>(r[<span class="num">0</span>]) <span class="kw">for</span> r <span class="kw">in</span> responses]
    rewards = [torch.<span class="fn">tensor</span>(<span class="fn">reward_fn</span>(t)) <span class="kw">for</span> t <span class="kw">in</span> response_texts]
    stats = ppo_trainer.<span class="fn">step</span>(queries, [r[<span class="num">0</span>] <span class="kw">for</span> r <span class="kw">in</span> responses], rewards)
    <span class="fn">print</span>(stats[<span class="str">"objective/kl"</span>], stats[<span class="str">"ppo/mean_scores"</span>])</code></pre></div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TRL (HF) bloklu. RLHF ödül modellemesi aslında (yanıt_a, yanıt_b, tercih) üçlüsü üzerinde ikili bir sınıflandırıcıdır. sklearn LogisticRegression kullanıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
pairs = [
    ('Polite reply: thank you for asking', 'rude reply: shut up', 0),
    ('Helpful answer: here is the code', 'unhelpful: I dont know', 0),
    ('Clear: 2+2=4',                      'wrong: 2+2=5',       0),
    ('rude: shut up',                     'Polite: thank you',   1),
    ('unhelpful: idk',                    'Helpful: try this',   1),
    ('wrong: pi=4',                       'Right: pi≈3.14',      1),
]
texts = [p[0] + ' || ' + p[1] for p in pairs]
y = [p[2] for p in pairs]
X = TfidfVectorizer().fit_transform(texts)
rm = LogisticRegression().fit(X, y)
print('Reward model accuracy:', round(rm.score(X, y), 3))
print('Coefs (truncated):', np.round(rm.coef_[0][:8], 2))</code></pre></div>
</div>
<p class="l-text"><strong>Burada şunlar oluyor:</strong> 1) Önceden eğitilmiş GPT-2 IMDB SFT checkpoint'ini hem politika hem referans olarak yükle. 2) Önceden eğitilmiş bir duygu sınıflandırıcısını ödül modeli olarak kullan — skor = "bu tamamlama ne kadar pozitif geliyor?". 3) PPO'yu KL katsayısı 0.2 ile yapılandır (KL ≈ 6 tutmak için adapte olur). 4) Her IMDB prompt batch'i için 30 yeni token üret, duygu modeliyle puanla, PPO adımı çalıştır. 5) Eğitim boyunca model orijinal GPT-2 dağılımına yakın kalarak yorumları pozitif yöne uzatmayı öğrenir. Bu RLHF mikrokozmosudur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. DPO — Doğrudan Tercih Optimizasyonu</h2>
<p class="l-text">Rafailov et al 2023. Tam RLHF pipeline (SFT → RM → PPO) kırılgandır — üç eğitim aşaması, ödül hilesi, hiperparametre hassasiyeti. DPO ödül modelini tamamen kaldırır. Optimal RLHF politikasının SFT modeli ve tercih verisi üzerinden kapalı formda ifade edilebileceğini gösteren akıllı bir türetimle basit bir denetimli kayba ulaşır:</p>
<div class="katex-block">$$L_{DPO}(\\theta) = -\\mathbb{E}\\left[ \\log \\sigma\\left( \\beta \\log \\frac{\\pi_{\\theta}(y_w|x)}{\\pi_{\\text{SFT}}(y_w|x)} - \\beta \\log \\frac{\\pi_{\\theta}(y_l|x)}{\\pi_{\\text{SFT}}(y_l|x)} \\right) \\right]$$</div>
<p class="l-text">Tercih çiftlerinde doğrudan eğit, PPO yok, ayrı ödül modeli yok. Çoğunlukla RLHF'i yakalar ya da yener, çok daha basit. Llama 3 ve birçok açık instruct-tuned modelde kullanıldı.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. RLAIF ve Anayasal AI</h2>
<p class="l-text">Anthropic'in Anayasal AI'si insan geri bildirimini yazılı bir anayasaya (ilkeler listesi) karşı AI geri bildirimiyle değiştirir. Model anayasaya göre kendi çıktısını eleştirir ve revize eder; tercihler oradan türetilir. RLAIF (AI Geri Bildiriminden RL) genelleştirilmiş aynı kavramdır — insan değerlendiricileri tüketmeden hizalamayı ölçeklemek için kullanılır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. NLP Araştırması İçin Neden Önemli?</h2>
<p class="l-text">Bir NLP pratisyeni için RLHF bağlantı noktasıdır. Duygu analizi, diyalog sistemleri, toksisite azaltma, özet kalitesi, talimat takibi — hepsi artık hizalama problemi olarak çerçeveleniyor. TRL ile ince ayar, ödül modeli kurma ve DPO uygulama bilgisi giderek temel beklenti hâline geliyor. 2025–2026 araştırma cephesi çoğunlukla daha iyi tercih verisi, daha akıllı ödül modelleri (süreç denetimi, münazara, kendini eleştiri) ve daha ucuz hizalama (DPO, IPO, KTO) hakkında.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Eğitim Sırasında KL Davranışı</h2>
<div id="rl10-plot-tr" style="width:100%;height:380px;"></div>
<p class="l-text">İyi ayarlanmış bir RLHF koşusu ödülün tırmandığını ve KL'in hedef civarında stabilleştiğini gösterir. KL patlarsa model saçmalığa çöküyordur; ödül takılırsa β çok agresiftir.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> RLHF, LLM'leri insan tercihleriyle üç aşamada hizalar: SFT, ödül modeli, PPO.<br><strong>2.</strong> Ödül modeli kaybı: çiftler üzerinde −log σ(r_w − r_l) (Bradley-Terry).<br><strong>3.</strong> RL amacı: r_φ(x,y) − β KL(π_θ ‖ π_SFT) maksimize. KL akıcılığı korur.<br><strong>4.</strong> LM politikadır; tokenler eylemlerdir; ödül üretim sonunda verilir.<br><strong>5.</strong> HuggingFace TRL sana ~30 satırda çalışan bir PPO döngüsü verir.<br><strong>6.</strong> DPO tüm pipeline'ı tercih çiftlerinde tek bir denetimli kayıpla değiştirir — giderek varsayılan.<br><strong>7.</strong> RLAIF / Anayasal AI hizalamayı model-üretimli tercihlerle ölçekler.<br><strong>8.</strong> RLHF, RL'in NLP ile buluştuğu yerdir — 2024–2026'da RL'in en sonuçlu uygulaması.</div></div>
</div>
<script>/* Plot defined in EN section above; same div ids ('-en','-tr') are shared. */</script>
`
};
