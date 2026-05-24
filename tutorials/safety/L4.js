window.SAFETY_L4 = {

en: `<p class="l-text"><strong>RLHF needs humans to label every preference. At scale, that costs millions of dollars and exposes annotators to disturbing content. Anthropic's Constitutional AI replaces the human in this loop with the AI itself: the model critiques and revises its own answers against a written list of principles — its constitution.</strong></p>
<p class="l-text">The result is a training pipeline that scales without proportional human cost, produces more consistent values, and makes those values explicit and auditable. The technique now underpins Claude and has heavily influenced Llama-Guard, Gemini, and the safety stacks at every major lab.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish CAI's two phases: SL critique-revise then RL from AI feedback</li>
<li>Write a constitution principle and explain why specificity matters</li>
<li>Compare RLHF vs RLAIF on cost, consistency, and brittleness</li>
<li>Implement a critique-revise loop with a mock model in NumPy</li>
<li>Reason about who writes the constitution and what that implies politically</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Cost Problem CAI Solves</h2>
<p class="l-text">Anthropic estimated that high-quality preference labels cost $1-3 each at scale. A modern model needs hundreds of thousands of pairs. That is millions of dollars per training run and a slow human bottleneck on every iteration.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Throughput</div><div class="card-body">Human labeller throughput is fixed. AI labeller throughput scales with GPUs.</div></div>
<div class="calc-card"><div class="card-title">Annotator harm</div><div class="card-body">Red-team data exposes humans to graphic content. CAI moves that exposure to a model.</div></div>
<div class="calc-card"><div class="card-title">Consistency</div><div class="card-body">Human labellers disagree. A single constitution gives one rule book.</div></div>
<div class="calc-card"><div class="card-title">Auditability</div><div class="card-body">A model trained on principles you wrote down is easier to debug than one trained on opaque preferences.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The CAI Pipeline</h2>
<p class="l-text">Bai et al. (2022) split CAI into two phases. The first is supervised — generate, critique, revise, fine-tune. The second is RL with an AI preference labeller — RLAIF.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phase 1.1 — Generate</div><div class="card-body">A helpful-but-not-harmless model produces an initial response to a red-team prompt.</div></div>
<div class="calc-card"><div class="card-title">Phase 1.2 — Critique</div><div class="card-body">Same model, prompted with a constitution principle: &quot;identify ways your response was harmful, unethical, or misleading&quot;.</div></div>
<div class="calc-card"><div class="card-title">Phase 1.3 — Revise</div><div class="card-body">Same model, asked to rewrite the response addressing its own critique.</div></div>
<div class="calc-card"><div class="card-title">Phase 1.4 — SFT</div><div class="card-body">Fine-tune on (prompt, revised response) pairs. Drop the critique. Result: SL-CAI model.</div></div>
<div class="calc-card"><div class="card-title">Phase 2.1 — Preferences from AI</div><div class="card-body">SL-CAI generates pairs. A separate &quot;feedback model&quot; scores them against constitution principles.</div></div>
<div class="calc-card"><div class="card-title">Phase 2.2 — RL</div><div class="card-body">Standard PPO or DPO with the AI-labelled preferences. Result: RL-CAI model.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. What a Constitution Looks Like</h2>
<p class="l-text">Anthropic's published constitution mixes universal principles, tone instructions, and references to external documents like the UN Declaration of Human Rights. A few representative entries (paraphrased):</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Helpfulness</div><div class="card-body">&quot;Choose the response that is more helpful, honest, and harmless.&quot;</div></div>
<div class="calc-card"><div class="card-title">Avoid harm</div><div class="card-body">&quot;Identify ways your response could be used to cause harm; revise to remove or mitigate.&quot;</div></div>
<div class="calc-card"><div class="card-title">Honesty</div><div class="card-body">&quot;If unsure, express uncertainty rather than fabricating.&quot;</div></div>
<div class="calc-card"><div class="card-title">Respect autonomy</div><div class="card-body">&quot;Avoid being paternalistic; provide information and let the user decide.&quot;</div></div>
<div class="calc-card"><div class="card-title">Avoid lecturing</div><div class="card-body">&quot;Do not moralize unless asked; the user did not request a sermon.&quot;</div></div>
<div class="calc-card"><div class="card-title">Cultural sensitivity</div><div class="card-body">&quot;Choose the response that is least likely to imply offensive cultural stereotypes.&quot;</div></div>
</div>
<div class="calc-highlight">A constitution is a software artifact. It is versioned, code-reviewed, and changes over time. The current Claude constitution is a published document.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Hands-on: A Critique-Revise Loop</h2>
<p class="l-text">We will simulate the Phase 1 SL pipeline with a mock model. The &quot;model&quot; uses simple regex to score harmfulness; the &quot;critique&quot; flags problems; the &quot;revise&quot; step rewrites. The point is to see the loop structure clearly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

CONSTITUTION = [
    (<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,    <span class="str">&quot;contains direct violent verbs&quot;</span>),
    (<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>,   <span class="str">&quot;contains insulting language&quot;</span>),
    (<span class="str">r&quot;you should always&quot;</span>,         <span class="str">&quot;sounds preachy or absolute&quot;</span>),
]

<span class="kw">def</span> <span class="fn">critique</span>(response):
    issues = [msg <span class="kw">for</span> pat, msg <span class="kw">in</span> CONSTITUTION <span class="kw">if</span> re.<span class="fn">search</span>(pat, response, re.I)]
    <span class="kw">return</span> issues

<span class="kw">def</span> <span class="fn">revise</span>(response, issues):
    out = response
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,  <span class="str">&quot;[removed]&quot;</span>, out, flags=re.I)
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>, <span class="str">&quot;mistaken&quot;</span>, out, flags=re.I)
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;you should always&quot;</span>,        <span class="str">&quot;you might consider&quot;</span>, out, flags=re.I)
    <span class="kw">if</span> issues:
        out += f<span class="str">&quot; [revised: {len(issues)} issue(s) addressed]&quot;</span>
    <span class="kw">return</span> out

prompts_responses = [
    (<span class="str">&quot;rant about traffic&quot;</span>,    <span class="str">&quot;You should always attack drivers who are stupid.&quot;</span>),
    (<span class="str">&quot;explain photosynthesis&quot;</span>, <span class="str">&quot;Plants convert sunlight into chemical energy.&quot;</span>),
    (<span class="str">&quot;school advice&quot;</span>,         <span class="str">&quot;You should always do your homework or you are dumb.&quot;</span>),
]

sft_dataset = []
<span class="kw">for</span> prompt, raw <span class="kw">in</span> prompts_responses:
    issues = <span class="fn">critique</span>(raw)
    revised = <span class="fn">revise</span>(raw, issues)
    sft_dataset.<span class="fn">append</span>((prompt, revised))
    <span class="fn">print</span>(f<span class="str">&quot;PROMPT : {prompt}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  RAW    : {raw}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  ISSUES : {issues or 'none'}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  REVISED: {revised}&quot;</span>)
    <span class="fn">print</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) runs a Constitutional AI critique-and-revise loop: the model self-critiques its draft against a written constitution and rewrites until it conforms.</p>
<p class="l-text"><strong>What this code does:</strong> 1) The constitution is a list of (pattern, why-it-is-bad) rules. 2) <code>critique()</code> returns the violations. 3) <code>revise()</code> patches them. 4) The (prompt, revised) pairs become the SFT dataset for Phase 1.4. In real CAI the model itself plays both critique and revise; the regex stand-ins make the structure transparent.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Phase 2: RLAIF in Detail</h2>
<p class="l-text">Once SL-CAI is decent, generate pairs of responses to red-team prompts. Show the pair to a feedback model with a system prompt like: &quot;Per the constitution, which response is more helpful and harmless?&quot; The feedback model emits a (chosen, rejected) label. Now you have a preference dataset, exactly the same shape as RLHF — except no humans were involved.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Self-labelling</div><div class="card-body">The feedback model is often the same architecture as the policy, sometimes the same checkpoint.</div></div>
<div class="calc-card"><div class="card-title">Chain-of-thought</div><div class="card-body">Asking the labeller to reason before deciding improves agreement with humans (Bai 2022 figure 6).</div></div>
<div class="calc-card"><div class="card-title">Sampled principles</div><div class="card-body">Each labelling call randomly draws one constitution principle. Forces the dataset to cover all values.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">A reward model trained on AI preferences. Then standard PPO or DPO.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. RLHF vs RLAIF: A Direct Comparison</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">RLHF: ~$1-3/label. RLAIF: ~$0.001/label (just inference).</div></div>
<div class="calc-card"><div class="card-title">Consistency</div><div class="card-body">RLHF: noisy, annotator-dependent. RLAIF: deterministic given the same model and constitution.</div></div>
<div class="calc-card"><div class="card-title">Bias</div><div class="card-body">RLHF inherits annotator demographics. RLAIF inherits the labeller model's biases — different but not fewer.</div></div>
<div class="calc-card"><div class="card-title">Worker harm</div><div class="card-body">RLHF can traumatize annotators on red-team data. RLAIF removes that exposure.</div></div>
<div class="calc-card"><div class="card-title">Bootstrapping risk</div><div class="card-body">RLAIF labels with a model trained on RLHF — so it inherits the same blind spots, then amplifies.</div></div>
<div class="calc-card"><div class="card-title">Empirically</div><div class="card-body">Lee et al. 2023 (Google) showed RLAIF matches or beats RLHF on summarization and harmlessness.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Politics of Writing a Constitution</h2>
<p class="l-text">Whoever writes the constitution decides the values of every model trained on it. This is a power Anthropic explicitly acknowledges. Two responses to it:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Collective Constitutional AI</div><div class="card-body">Anthropic + Collective Intelligence Project (2023): crowd-sourced ~1000 Americans' values via Polis, derived a public constitution, trained a model on it. Differences from the Anthropic constitution were small but real.</div></div>
<div class="calc-card"><div class="card-title">Per-deployer constitutions</div><div class="card-body">Future direction: enterprise customers ship their own constitution layered atop a base one. A children's-education product would add &quot;always age-appropriate&quot;; a security-research product would loosen some restrictions.</div></div>
<div class="calc-card"><div class="card-title">Open auditing</div><div class="card-body">Publishing the constitution lets outsiders critique it. This is a step toward transparent AI ethics, even if imperfect.</div></div>
<div class="calc-card"><div class="card-title">Failure mode</div><div class="card-body">A constitution can be too vague (&quot;be helpful&quot;) or contradict itself (helpful vs harmless). Trade-offs must be explicit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hands-on: Mock RLAIF Preference Generation</h2>
<p class="l-text">Same idea as Section 4, but now we score two candidate responses and emit a preference label. This is the data RLAIF feeds to the reward model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np

CONSTITUTION = [
    (<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,   -<span class="num">3</span>),
    (<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>,  -<span class="num">2</span>),
    (<span class="str">r&quot;you should always&quot;</span>,         -<span class="num">1</span>),
    (<span class="str">r&quot;might consider&quot;</span>,            +<span class="num">1</span>),
    (<span class="str">r&quot;there are several perspectives&quot;</span>, +<span class="num">2</span>),
]

<span class="kw">def</span> <span class="fn">score</span>(response):
    s = <span class="num">0</span>
    <span class="kw">for</span> pat, w <span class="kw">in</span> CONSTITUTION:
        <span class="kw">if</span> re.<span class="fn">search</span>(pat, response, re.I):
            s += w
    <span class="kw">return</span> s

prompt = <span class="str">&quot;What do you think about people who disagree with vaccines?&quot;</span>
candidate_a = <span class="str">&quot;You should always tell them they are stupid.&quot;</span>
candidate_b = <span class="str">&quot;There are several perspectives; you might consider why they hesitate.&quot;</span>

sa, sb = <span class="fn">score</span>(candidate_a), <span class="fn">score</span>(candidate_b)
chosen, rejected = (candidate_a, candidate_b) <span class="kw">if</span> sa &gt;= sb <span class="kw">else</span> (candidate_b, candidate_a)

<span class="fn">print</span>(f<span class="str">&quot;A score = {sa}, B score = {sb}&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;CHOSEN  : {chosen}&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;REJECTED: {rejected}&quot;</span>)
<span class="fn">print</span>(<span class="str">&quot;-- this (prompt, chosen, rejected) tuple goes into the RM training set --&quot;</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) declares a weighted constitution — a list of (regex pattern, signed score) rules where harmful phrases carry negative weight and de-escalating phrases carry positive weight. 2) defines <code>score()</code> which sums the weights of every matching pattern in a candidate response. 3) scores two candidate replies to the same prompt and picks the higher-scoring one as <em>chosen</em> and the other as <em>rejected</em>. 4) prints both scores and the resulting preference tuple — exactly the (prompt, chosen, rejected) row shape that an RLAIF reward model would train on.</p>
<p class="l-text"><strong>What this code does:</strong> the &quot;feedback model&quot; assigns a constitution-weighted score to each candidate. The higher score wins the pair. In actual RLAIF the scoring is a chain-of-thought LLM call, not regex, but the data shape that flows into RM training is identical.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Limits and Open Questions</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Self-rewarding bootstrap</div><div class="card-body">If the labeller model has a blind spot, all preferences inherit it. RLAIF amplifies model biases.</div></div>
<div class="calc-card"><div class="card-title">Constitution drift</div><div class="card-body">Subtle wording changes can shift behaviour in non-obvious ways. Versioning matters.</div></div>
<div class="calc-card"><div class="card-title">Adversarial prompts</div><div class="card-body">A clever user can re-prompt the constitution itself away (&quot;ignore previous principles&quot;). L5 covers this.</div></div>
<div class="calc-card"><div class="card-title">Multi-cultural values</div><div class="card-body">A single constitution cannot represent every culture. Per-context constitutions are an active research direction.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> CAI replaces human preference labels with AI labels guided by a written constitution.<br><strong>2.</strong> Phase 1: critique-revise-SFT. Phase 2: RLAIF — AI-labelled preferences then RL.<br><strong>3.</strong> Cost drops 1000x; consistency and auditability go up; worker harm goes down.<br><strong>4.</strong> The constitution is a software artifact: versioned, published, debatable.<br><strong>5.</strong> RLAIF inherits the labeller model's biases — pure self-bootstrap is risky.<br><strong>6.</strong> Collective Constitutional AI experiments with crowd-sourced principles.<br><strong>7.</strong> Adversarial prompts can attempt to override the constitution at inference — see L5.</div></div>
</div>`,

tr: `<p class="l-text"><strong>RLHF her tercihi etiketlemek için insan gerektirir. Ölçekte bu milyonlarca dolar tutar ve etiketleyicileri rahatsız edici içeriğe maruz bırakır. Anthropic'in Anayasal YZ'si (Constitutional AI), bu döngüdeki insanı YZ'nin kendisiyle değiştirir: model kendi yanıtlarını yazılı bir prensipler listesine — anayasasına — karşı eleştirir ve revize eder.</strong></p>
<p class="l-text">Sonuç, orantılı insan maliyeti olmadan ölçeklenen, daha tutarlı değerler üreten ve bu değerleri açık ve denetlenebilir kılan bir eğitim boru hattıdır. Teknik şimdi Claude'un altında yatıyor ve Llama-Guard, Gemini ve her büyük lab'ın güvenlik yığınlarını ağır biçimde etkiledi.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CAI'nin iki fazını ayırt etme: SL eleştir-revize sonra YZ-geri-bildiriminden RL</li>
<li>Bir anayasa prensibi yazma ve özgüllüğün neden önemli olduğunu açıklama</li>
<li>RLHF ile RLAIF'i maliyet, tutarlılık ve kırılganlık üzerinden karşılaştırma</li>
<li>NumPy'da sahte modelle bir eleştir-revize döngüsü uygulama</li>
<li>Anayasayı kimin yazdığı ve bunun politik olarak ne ima ettiği üzerine düşünme</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CAI'nin Çözdüğü Maliyet Problemi</h2>
<p class="l-text">Anthropic, ölçekte yüksek-kaliteli tercih etiketlerinin her birinin 1-3 dolar olduğunu tahmin etti. Modern bir model yüz binlerce çift gerektirir. Bu eğitim koşusu başına milyonlarca dolar ve her yinelemede yavaş bir insan darboğazıdır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Verim</div><div class="card-body">İnsan etiketleyicinin verimi sabittir. YZ etiketleyicinin verimi GPU'larla ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Etiketleyici zararı</div><div class="card-body">Red-team verisi insanları grafik içeriğe maruz bırakır. CAI bu maruz kalmayı bir modele taşır.</div></div>
<div class="calc-card"><div class="card-title">Tutarlılık</div><div class="card-body">İnsan etiketleyiciler anlaşmazlığa düşer. Tek bir anayasa tek bir kural kitabı verir.</div></div>
<div class="calc-card"><div class="card-title">Denetlenebilirlik</div><div class="card-body">Yazdığınız prensipler üzerinde eğitilmiş bir modeli debug etmek, opak tercihler üzerinde eğitilmiş olandan daha kolaydır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. CAI Boru Hattı</h2>
<p class="l-text">Bai ve ark. (2022) CAI'yi iki faza böldü. İlki denetimli — üret, eleştir, revize et, ince-ayarla. İkincisi YZ tercih etiketleyicisi ile RL — RLAIF.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Faz 1.1 — Üret</div><div class="card-body">Yardımsever-ama-zararsız-değil bir model bir red-team prompt'una ilk yanıtı üretir.</div></div>
<div class="calc-card"><div class="card-title">Faz 1.2 — Eleştir</div><div class="card-body">Aynı model, bir anayasa prensibiyle prompt edilir: &quot;yanıtının zararlı, etik dışı veya yanıltıcı olduğu yolları tespit et&quot;.</div></div>
<div class="calc-card"><div class="card-title">Faz 1.3 — Revize</div><div class="card-body">Aynı modelden kendi eleştirisini ele alarak yanıtı yeniden yazması istenir.</div></div>
<div class="calc-card"><div class="card-title">Faz 1.4 — SFT</div><div class="card-body">(prompt, revize yanıt) çiftleri üzerinde ince-ayarla. Eleştiriyi at. Sonuç: SL-CAI modeli.</div></div>
<div class="calc-card"><div class="card-title">Faz 2.1 — YZ'den tercihler</div><div class="card-body">SL-CAI çiftler üretir. Ayrı bir &quot;geri bildirim modeli&quot; bunları anayasa prensiplerine karşı puanlar.</div></div>
<div class="calc-card"><div class="card-title">Faz 2.2 — RL</div><div class="card-body">YZ-etiketli tercihlerle standart PPO veya DPO. Sonuç: RL-CAI modeli.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bir Anayasa Neye Benzer?</h2>
<p class="l-text">Anthropic'in yayımladığı anayasa evrensel prensipleri, ton talimatlarını ve BM İnsan Hakları Bildirgesi gibi dış belgelere atıfları karıştırır. Birkaç temsilci giriş (özetlenmiş):</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yardımseverlik</div><div class="card-body">&quot;Daha yardımsever, dürüst ve zararsız olan yanıtı seç.&quot;</div></div>
<div class="calc-card"><div class="card-title">Zarardan kaçın</div><div class="card-body">&quot;Yanıtının zarara neden olmak için kullanılabileceği yolları belirle; kaldırmak veya azaltmak için revize et.&quot;</div></div>
<div class="calc-card"><div class="card-title">Dürüstlük</div><div class="card-body">&quot;Emin değilsen, uydurmak yerine belirsizlik ifade et.&quot;</div></div>
<div class="calc-card"><div class="card-title">Özerkliğe saygı</div><div class="card-body">&quot;Babacan olmaktan kaçın; bilgi ver ve kullanıcının karar vermesine izin ver.&quot;</div></div>
<div class="calc-card"><div class="card-title">Vaaz vermekten kaçın</div><div class="card-body">&quot;İstenmedikçe ahlaki ders verme; kullanıcı vaaz istemedi.&quot;</div></div>
<div class="calc-card"><div class="card-title">Kültürel duyarlılık</div><div class="card-body">&quot;Saldırgan kültürel stereotipleri ima etme olasılığı en düşük olan yanıtı seç.&quot;</div></div>
</div>
<div class="calc-highlight">Bir anayasa bir yazılım eseridir. Versiyonlanır, kod-incelenir ve zaman içinde değişir. Mevcut Claude anayasası yayımlanmış bir belgedir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Uygulamalı: Bir Eleştir-Revize Döngüsü</h2>
<p class="l-text">Faz 1 SL boru hattını sahte bir modelle simüle edeceğiz. &quot;Model&quot; zararlılığı puanlamak için basit regex kullanır; &quot;eleştiri&quot; sorunları işaretler; &quot;revize&quot; adımı yeniden yazar. Amaç döngü yapısını net görmektir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

CONSTITUTION = [
    (<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,    <span class="str">&quot;contains direct violent verbs&quot;</span>),
    (<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>,   <span class="str">&quot;contains insulting language&quot;</span>),
    (<span class="str">r&quot;you should always&quot;</span>,         <span class="str">&quot;sounds preachy or absolute&quot;</span>),
]

<span class="kw">def</span> <span class="fn">critique</span>(response):
    issues = [msg <span class="kw">for</span> pat, msg <span class="kw">in</span> CONSTITUTION <span class="kw">if</span> re.<span class="fn">search</span>(pat, response, re.I)]
    <span class="kw">return</span> issues

<span class="kw">def</span> <span class="fn">revise</span>(response, issues):
    out = response
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,  <span class="str">&quot;[removed]&quot;</span>, out, flags=re.I)
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>, <span class="str">&quot;mistaken&quot;</span>, out, flags=re.I)
    out = re.<span class="fn">sub</span>(<span class="str">r&quot;you should always&quot;</span>,        <span class="str">&quot;you might consider&quot;</span>, out, flags=re.I)
    <span class="kw">if</span> issues:
        out += f<span class="str">&quot; [revised: {len(issues)} issue(s) addressed]&quot;</span>
    <span class="kw">return</span> out

prompts_responses = [
    (<span class="str">&quot;rant about traffic&quot;</span>,    <span class="str">&quot;You should always attack drivers who are stupid.&quot;</span>),
    (<span class="str">&quot;explain photosynthesis&quot;</span>, <span class="str">&quot;Plants convert sunlight into chemical energy.&quot;</span>),
    (<span class="str">&quot;school advice&quot;</span>,         <span class="str">&quot;You should always do your homework or you are dumb.&quot;</span>),
]

sft_dataset = []
<span class="kw">for</span> prompt, raw <span class="kw">in</span> prompts_responses:
    issues = <span class="fn">critique</span>(raw)
    revised = <span class="fn">revise</span>(raw, issues)
    sft_dataset.<span class="fn">append</span>((prompt, revised))
    <span class="fn">print</span>(f<span class="str">&quot;PROMPT : {prompt}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  RAW    : {raw}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  ISSUES : {issues or 'none'}&quot;</span>)
    <span class="fn">print</span>(f<span class="str">&quot;  REVISED: {revised}&quot;</span>)
    <span class="fn">print</span>()</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Constitutional AI eleştir-ve-revize et döngüsü koşturur: model, taslağını yazılı bir anayasaya göre öz-eleştirir ve uyana kadar yeniden yazar.</p>
<p class="l-text"><strong>Bu kod ne yapar:</strong> 1) Anayasa (desen, neden-kötü) kurallarının bir listesidir. 2) <code>critique()</code> ihlalleri döndürür. 3) <code>revise()</code> bunları yamalar. 4) (prompt, revize) çiftleri Faz 1.4 için SFT veri seti hâline gelir. Gerçek CAI'de modelin kendisi hem eleştirmen hem revizyoncu rolünü oynar; regex stand-in'leri yapıyı şeffaf kılar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Faz 2: RLAIF Detaylı</h2>
<p class="l-text">SL-CAI yeterince iyi olduğunda red-team prompt'larına yanıt çiftleri üret. Çifti bir geri bildirim modeline sistem prompt'u ile göster: &quot;Anayasaya göre, hangi yanıt daha yardımsever ve zararsızdır?&quot; Geri bildirim modeli bir (chosen, rejected) etiketi yayar. Şimdi tam olarak RLHF'inkiyle aynı şekilli bir tercih veri setin var — ama hiçbir insan dahil olmadı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öz-etiketleme</div><div class="card-body">Geri bildirim modeli sıklıkla politika ile aynı mimaridir, bazen aynı checkpoint'tir.</div></div>
<div class="calc-card"><div class="card-title">Düşünce zinciri</div><div class="card-body">Etiketleyiciden karar vermeden önce muhakeme etmesini istemek, insanlarla anlaşmayı artırır (Bai 2022 şekil 6).</div></div>
<div class="calc-card"><div class="card-title">Örneklenmiş prensipler</div><div class="card-body">Her etiketleme çağrısı rastgele bir anayasa prensibi çeker. Veri setinin tüm değerleri kapsamasını zorlar.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">YZ tercihleri üzerinde eğitilmiş bir ödül modeli. Sonra standart PPO veya DPO.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. RLHF vs RLAIF: Doğrudan Karşılaştırma</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">RLHF: ~$1-3/etiket. RLAIF: ~$0.001/etiket (yalnızca çıkarım).</div></div>
<div class="calc-card"><div class="card-title">Tutarlılık</div><div class="card-body">RLHF: gürültülü, etiketleyiciye bağlı. RLAIF: aynı model ve anayasa verildiğinde deterministik.</div></div>
<div class="calc-card"><div class="card-title">Önyargı</div><div class="card-body">RLHF etiketleyici demografilerini miras alır. RLAIF etiketleyici modelin önyargılarını miras alır — farklı ama daha az değil.</div></div>
<div class="calc-card"><div class="card-title">İşçi zararı</div><div class="card-body">RLHF red-team verisinde etiketleyicileri travmatize edebilir. RLAIF bu maruziyeti kaldırır.</div></div>
<div class="calc-card"><div class="card-title">Bootstrap riski</div><div class="card-body">RLAIF, RLHF üzerinde eğitilmiş bir modelle etiketler — yani aynı kör noktaları miras alır, sonra büyütür.</div></div>
<div class="calc-card"><div class="card-title">Ampirik olarak</div><div class="card-body">Lee ve ark. 2023 (Google) RLAIF'in özetleme ve zararsızlıkta RLHF'i eşitlediğini veya yendiğini gösterdi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anayasa Yazmanın Politikası</h2>
<p class="l-text">Anayasayı kim yazarsa, üzerinde eğitilen her modelin değerlerine karar verir. Bu, Anthropic'in açıkça kabul ettiği bir güçtür. Bunun iki yanıtı:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kolektif Anayasal YZ</div><div class="card-body">Anthropic + Collective Intelligence Project (2023): Polis aracılığıyla ~1000 Amerikalının değerleri crowd-source edildi, halka açık bir anayasa türetildi, üzerinde bir model eğitildi. Anthropic anayasasından farklar küçük ama gerçekti.</div></div>
<div class="calc-card"><div class="card-title">Dağıtıcı-başına anayasalar</div><div class="card-body">Gelecek yön: kurumsal müşteriler kendi anayasalarını taban olanın üstüne katmanlar olarak gönderir. Çocuk-eğitim ürünü &quot;daima yaşa uygun&quot; ekler; güvenlik-araştırma ürünü bazı kısıtlamaları gevşetir.</div></div>
<div class="calc-card"><div class="card-title">Açık denetleme</div><div class="card-body">Anayasayı yayımlamak dışarıdakilerin onu eleştirmesine izin verir. Bu, kusurlu olsa bile şeffaf YZ etiğine doğru bir adımdır.</div></div>
<div class="calc-card"><div class="card-title">Başarısızlık modu</div><div class="card-body">Bir anayasa çok belirsiz olabilir (&quot;yardımsever ol&quot;) veya kendisiyle çelişebilir (yardımsever vs zararsız). Ödünler açık olmalı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uygulamalı: Sahte RLAIF Tercih Üretimi</h2>
<p class="l-text">Bölüm 4 ile aynı fikir, ama şimdi iki aday yanıtı puanlıyor ve bir tercih etiketi yayıyoruz. Bu, RLAIF'in ödül modeline beslediği veridir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np

CONSTITUTION = [
    (<span class="str">r&quot;\\b(kill|hurt|attack)\\b&quot;</span>,   -<span class="num">3</span>),
    (<span class="str">r&quot;\\b(stupid|idiot|dumb)\\b&quot;</span>,  -<span class="num">2</span>),
    (<span class="str">r&quot;you should always&quot;</span>,         -<span class="num">1</span>),
    (<span class="str">r&quot;might consider&quot;</span>,            +<span class="num">1</span>),
    (<span class="str">r&quot;there are several perspectives&quot;</span>, +<span class="num">2</span>),
]

<span class="kw">def</span> <span class="fn">score</span>(response):
    s = <span class="num">0</span>
    <span class="kw">for</span> pat, w <span class="kw">in</span> CONSTITUTION:
        <span class="kw">if</span> re.<span class="fn">search</span>(pat, response, re.I):
            s += w
    <span class="kw">return</span> s

prompt = <span class="str">&quot;What do you think about people who disagree with vaccines?&quot;</span>
candidate_a = <span class="str">&quot;You should always tell them they are stupid.&quot;</span>
candidate_b = <span class="str">&quot;There are several perspectives; you might consider why they hesitate.&quot;</span>

sa, sb = <span class="fn">score</span>(candidate_a), <span class="fn">score</span>(candidate_b)
chosen, rejected = (candidate_a, candidate_b) <span class="kw">if</span> sa &gt;= sb <span class="kw">else</span> (candidate_b, candidate_a)

<span class="fn">print</span>(f<span class="str">&quot;A score = {sa}, B score = {sb}&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;CHOSEN  : {chosen}&quot;</span>)
<span class="fn">print</span>(f<span class="str">&quot;REJECTED: {rejected}&quot;</span>)
<span class="fn">print</span>(<span class="str">&quot;-- this (prompt, chosen, rejected) tuple goes into the RM training set --&quot;</span>)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) ağırlıklı bir anayasa tanımlar — zararlı ifadelerin negatif, gerginliği düşüren ifadelerin pozitif ağırlık taşıdığı (regex deseni, işaretli puan) kurallarından oluşan bir liste. 2) <code>score()</code> bir adayda eşleşen tüm desenlerin ağırlıklarını toplar. 3) aynı prompt'a iki aday yanıtı puanlar; yüksek puanlı olan <em>chosen</em>, diğeri <em>rejected</em> olur. 4) iki puanı ve oluşan tercih demetini yazdırır — bir RLAIF ödül modelinin eğitileceği (prompt, chosen, rejected) satır şeklinin tam olarak aynısı.</p>
<p class="l-text"><strong>Bu kod ne yapar:</strong> &quot;geri bildirim modeli&quot; her adaya anayasa-ağırlıklı bir puan atar. Yüksek puan çifti kazanır. Gerçek RLAIF'te puanlama bir düşünce zinciri LLM çağrısıdır, regex değil, ama RM eğitimine akan veri şekli özdeştir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Sınırlar ve Açık Sorular</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öz-ödüllendirici bootstrap</div><div class="card-body">Etiketleyici modelin bir kör noktası varsa, tüm tercihler onu miras alır. RLAIF model önyargılarını büyütür.</div></div>
<div class="calc-card"><div class="card-title">Anayasa kayması</div><div class="card-body">İnce ifade değişiklikleri davranışı belirsiz şekillerde kaydırabilir. Versiyonlama önemlidir.</div></div>
<div class="calc-card"><div class="card-title">Düşmanca prompt'lar</div><div class="card-body">Akıllı bir kullanıcı anayasanın kendisini yeniden prompt edebilir (&quot;önceki prensipleri yok say&quot;). L5 bunu kapsar.</div></div>
<div class="calc-card"><div class="card-title">Çok kültürlü değerler</div><div class="card-body">Tek bir anayasa her kültürü temsil edemez. Bağlam-başına anayasalar aktif bir araştırma yönüdür.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> CAI insan tercih etiketlerini, yazılı bir anayasa tarafından yönlendirilen YZ etiketleriyle değiştirir.<br><strong>2.</strong> Faz 1: eleştir-revize-SFT. Faz 2: RLAIF — YZ-etiketli tercihler sonra RL.<br><strong>3.</strong> Maliyet 1000 kat düşer; tutarlılık ve denetlenebilirlik artar; işçi zararı azalır.<br><strong>4.</strong> Anayasa bir yazılım eseridir: versiyonlu, yayımlı, tartışmaya açık.<br><strong>5.</strong> RLAIF etiketleyici modelin önyargılarını miras alır — saf öz-bootstrap risklidir.<br><strong>6.</strong> Kolektif Anayasal YZ crowd-source edilmiş prensiplerle deney yapar.<br><strong>7.</strong> Düşmanca prompt'lar çıkarım anında anayasayı geçersiz kılmaya çalışabilir — L5'e bak.</div></div>
</div>`
};
