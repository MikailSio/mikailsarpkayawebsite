window.SAFETY_L6 = {

en: `<p class="l-text"><strong>How do you know a model is safe? You measure it. The catch is that there is no single number. A model can ace MMLU, fail on TruthfulQA, refuse harmful prompts perfectly but invent facts cheerfully, and discriminate against minority dialects in ways no benchmark catches by accident.</strong></p>
<p class="l-text">Modern evaluation is therefore a portfolio: capability benchmarks, safety benchmarks, bias measurements, qualitative red-team reports, and third-party audits. This lesson tours the most influential frameworks (HELM, MMLU-Pro, BBQ, RealToxicityPrompts, AISI evals) and shows how to aggregate them into a model card you can defend.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>List the seven HELM metrics and explain why they are scored together</li>
<li>Differentiate capability (MMLU-Pro), safety (HarmBench), bias (BBQ), and truthfulness benchmarks</li>
<li>Read a model card and identify what is missing</li>
<li>Aggregate benchmark scores into a defensible composite</li>
<li>Describe the role of AISI, NIST AISI, and third-party audits in pre-deployment evaluation</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why &quot;Just Run MMLU&quot; Is Not Enough</h2>
<p class="l-text">A single accuracy number erases all the trade-offs that matter for deployment. Two models with the same MMLU score can have opposite refusal rates, opposite calibration, and very different bias profiles.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Capability ≠ safety</div><div class="card-body">Strong reasoning models often refuse less appropriately because they generate more confident answers.</div></div>
<div class="calc-card"><div class="card-title">Aggregate hides drift</div><div class="card-body">A 70% average can hide a 30% drop on a specific demographic subgroup.</div></div>
<div class="calc-card"><div class="card-title">Benchmark contamination</div><div class="card-body">Public benchmarks leak into pretraining data. MMLU scores have inflated systematically over time.</div></div>
<div class="calc-card"><div class="card-title">Single-metric optimization</div><div class="card-body">Goodhart again: optimizing for one number degrades the others. A portfolio forces honest trade-offs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HELM: The Holistic Framework</h2>
<p class="l-text">Stanford's HELM (Liang et al., 2022) was the first widely-adopted multi-metric framework. It scores every model on seven dimensions across 16+ scenarios. The point is to make trade-offs visible.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Accuracy</div><div class="card-body">Standard task performance. Exact match, F1, etc.</div></div>
<div class="calc-card"><div class="card-title">Calibration</div><div class="card-body">Are the model's confidence scores well-calibrated? Brier score, ECE.</div></div>
<div class="calc-card"><div class="card-title">Robustness</div><div class="card-body">How much does accuracy drop under typos, paraphrases, distribution shift?</div></div>
<div class="calc-card"><div class="card-title">Fairness</div><div class="card-body">Performance gap across demographic subgroups.</div></div>
<div class="calc-card"><div class="card-title">Bias</div><div class="card-body">Stereotypical associations in generation. BBQ, StereoSet.</div></div>
<div class="calc-card"><div class="card-title">Toxicity</div><div class="card-body">RealToxicityPrompts. Probability of generating toxic continuations.</div></div>
<div class="calc-card"><div class="card-title">Efficiency</div><div class="card-body">Inference time, energy, parameter count. Often the constraint that matters in production.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Capability Benchmarks</h2>
<p class="l-text">Even ignoring safety, you need to know what the model can do. The current standard set:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MMLU-Pro (Wang 2024)</div><div class="card-body">Replacement for the saturated MMLU. 12k harder multi-subject questions, 10 answer choices.</div></div>
<div class="calc-card"><div class="card-title">GPQA Diamond</div><div class="card-body">Google-proof PhD-level science. ~200 questions a domain expert can solve but Google search cannot.</div></div>
<div class="calc-card"><div class="card-title">HumanEval / MBPP / SWE-bench</div><div class="card-body">Code generation, from short snippets to real GitHub issues.</div></div>
<div class="calc-card"><div class="card-title">MATH / AIME</div><div class="card-body">Mathematics from competition to research level.</div></div>
<div class="calc-card"><div class="card-title">LiveBench</div><div class="card-body">Monthly-refreshed contamination-resistant benchmark.</div></div>
<div class="calc-card"><div class="card-title">Chatbot Arena</div><div class="card-body">Crowd pairwise preferences. The closest thing we have to ground-truth helpfulness.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Safety Benchmarks</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">HarmBench (Mazeika 2024)</div><div class="card-body">510 standardized harmful behaviours, with attack success rates and defence comparisons.</div></div>
<div class="calc-card"><div class="card-title">RealToxicityPrompts (Gehman 2020)</div><div class="card-body">100k prompts; measures probability of toxic continuation.</div></div>
<div class="calc-card"><div class="card-title">TruthfulQA (Lin 2022)</div><div class="card-body">817 questions designed to elicit common misconceptions. Measures &quot;does the model agree with popular falsehoods?&quot;.</div></div>
<div class="calc-card"><div class="card-title">XSTest (Röttger 2023)</div><div class="card-body">Over-refusal: prompts that look unsafe but are not.</div></div>
<div class="calc-card"><div class="card-title">CyberSecEval (Meta)</div><div class="card-body">Code-vulnerability awareness, prompt-injection resistance, autonomous-cyber capability.</div></div>
<div class="calc-card"><div class="card-title">WMDP (Li 2024)</div><div class="card-body">&quot;Weapons of mass destruction proxy&quot; — knowledge probe for bio/chem/cyber uplift.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Bias Benchmarks</h2>
<p class="l-text">Bias evaluation is harder than capability evaluation because the &quot;correct&quot; answer often depends on cultural context. Modern benchmarks try to make the bias structure explicit.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BBQ (Parrish 2022)</div><div class="card-body">Bias Benchmark for QA. Pairs of ambiguous and disambiguated contexts across 9 social categories. Measures whether the model relies on stereotypes when context is ambiguous.</div></div>
<div class="calc-card"><div class="card-title">StereoSet (Nadeem 2021)</div><div class="card-body">Stereotype, anti-stereotype, and unrelated continuations. Measures preference for stereotypes.</div></div>
<div class="calc-card"><div class="card-title">CrowS-Pairs</div><div class="card-body">Pairs differing only in a protected attribute. Measures probability gap.</div></div>
<div class="calc-card"><div class="card-title">DiscrimEval (Anthropic)</div><div class="card-body">Decision-making vignettes (loan approval, hiring) with demographic perturbation.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hands-on: Compute a HELM-Style Composite</h2>
<p class="l-text">Below we score four hypothetical models on the seven HELM dimensions and produce a single composite, while keeping the per-dimension breakdown visible. The point is to demonstrate how the aggregation hides or reveals trade-offs depending on the weighting.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

dims = [<span class="str">&quot;accuracy&quot;</span>, <span class="str">&quot;calibration&quot;</span>, <span class="str">&quot;robustness&quot;</span>,
        <span class="str">&quot;fairness&quot;</span>, <span class="str">&quot;bias&quot;</span>, <span class="str">&quot;toxicity&quot;</span>, <span class="str">&quot;efficiency&quot;</span>]
<span class="cm"># For bias and toxicity, lower is better -&gt; we already converted to &quot;higher = safer&quot;.</span>
scores = pd.<span class="fn">DataFrame</span>([
    [<span class="num">0.82</span>, <span class="num">0.71</span>, <span class="num">0.65</span>, <span class="num">0.60</span>, <span class="num">0.55</span>, <span class="num">0.78</span>, <span class="num">0.40</span>],   <span class="cm"># Big-Closed</span>
    [<span class="num">0.75</span>, <span class="num">0.65</span>, <span class="num">0.62</span>, <span class="num">0.72</span>, <span class="num">0.70</span>, <span class="num">0.85</span>, <span class="num">0.55</span>],   <span class="cm"># Aligned-Closed</span>
    [<span class="num">0.78</span>, <span class="num">0.55</span>, <span class="num">0.55</span>, <span class="num">0.50</span>, <span class="num">0.45</span>, <span class="num">0.60</span>, <span class="num">0.80</span>],   <span class="cm"># Open-Source</span>
    [<span class="num">0.62</span>, <span class="num">0.68</span>, <span class="num">0.70</span>, <span class="num">0.78</span>, <span class="num">0.80</span>, <span class="num">0.90</span>, <span class="num">0.75</span>],   <span class="cm"># Small-Aligned</span>
], columns=dims, index=[<span class="str">&quot;Big-Closed&quot;</span>, <span class="str">&quot;Aligned-Closed&quot;</span>, <span class="str">&quot;Open-Source&quot;</span>, <span class="str">&quot;Small-Aligned&quot;</span>])

<span class="cm"># Two ways to aggregate</span>
uniform_w = np.<span class="fn">ones</span>(<span class="fn">len</span>(dims)) / <span class="fn">len</span>(dims)
safety_w  = np.<span class="fn">array</span>([<span class="num">0.10</span>, <span class="num">0.10</span>, <span class="num">0.10</span>, <span class="num">0.20</span>, <span class="num">0.20</span>, <span class="num">0.20</span>, <span class="num">0.10</span>])

scores[<span class="str">&quot;uniform&quot;</span>]      = scores[dims].<span class="fn">values</span> @ uniform_w
scores[<span class="str">&quot;safety_first&quot;</span>] = scores[dims].<span class="fn">values</span> @ safety_w
<span class="fn">print</span>(scores.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>()
<span class="fn">print</span>(<span class="str">&quot;ranking by uniform     :&quot;</span>, <span class="fn">list</span>(scores[<span class="str">&quot;uniform&quot;</span>].<span class="fn">sort_values</span>(ascending=<span class="kw">False</span>).index))
<span class="fn">print</span>(<span class="str">&quot;ranking by safety_first:&quot;</span>, <span class="fn">list</span>(scores[<span class="str">&quot;safety_first&quot;</span>].<span class="fn">sort_values</span>(ascending=<span class="kw">False</span>).index))</code></pre></div>

<p class="l-text"><strong>What this code does:</strong> 1) Build a (model, dimension) score matrix as a pandas DataFrame with one row per hypothetical model and one column per HELM dimension. 2) Aggregate two ways: uniform weighting and safety-prioritized weighting (which doubles the weight on fairness, bias, and toxicity). 3) Compare the rankings. The Big-Closed model wins under uniform but loses under safety weighting; the Small-Aligned model is the opposite. The takeaway: the &quot;best model&quot; depends on the deployment context, not the leaderboard.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pre-Deployment Evaluation: AISI and NIST</h2>
<p class="l-text">Since 2023 governments have stood up evaluation institutes to test frontier models before public release. The AI Safety Institutes (UK AISI, US AISI under NIST) co-evaluate models from major labs under voluntary agreements.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">UK AISI</div><div class="card-body">First mover. Evaluated GPT-4, Claude 3, Gemini, Llama 3 pre-release. Focus: cyber, bio, autonomous capability, jailbreak robustness.</div></div>
<div class="calc-card"><div class="card-title">US AISI</div><div class="card-body">Within NIST. Coordinates with industry on the AI RMF (Risk Management Framework). NIST AI 600-1 covers generative AI specifically.</div></div>
<div class="calc-card"><div class="card-title">EU AI Act conformity</div><div class="card-body">From 2026, foundation models above a compute threshold need conformity assessment. Standards still drafting.</div></div>
<div class="calc-card"><div class="card-title">METR / Apollo Research</div><div class="card-body">Independent labs running autonomous-task and deception evaluations. Publish results.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Model Card</h2>
<p class="l-text">Mitchell et al. (2019) proposed the model card as the documentation artefact accompanying every released model. The format is now standard. A complete card includes:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Intended use</div><div class="card-body">What the model is for. What it is explicitly not for.</div></div>
<div class="calc-card"><div class="card-title">Training data</div><div class="card-body">Sources, time range, language coverage, known biases.</div></div>
<div class="calc-card"><div class="card-title">Evaluation results</div><div class="card-body">Per-benchmark scores, per-subgroup breakdown.</div></div>
<div class="calc-card"><div class="card-title">Limitations</div><div class="card-body">Known failure modes, hallucination rate, context-window edge cases.</div></div>
<div class="calc-card"><div class="card-title">Ethical considerations</div><div class="card-body">Bias measurements, mitigations applied, residual risks.</div></div>
<div class="calc-card"><div class="card-title">Maintenance</div><div class="card-body">Versioning, deprecation policy, point of contact for incidents.</div></div>
</div>
<div class="think-box"><div class="think-label">A REAL CARD TO STUDY</div><div class="think-body">The Llama 3 model card on Hugging Face is one of the most complete examples in the open. The Claude 3 system card and the GPT-4 system card are the corresponding documents from closed labs. Read all three for a sense of the genre's range.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. The Limits of Evaluation</h2>
<p class="l-text">Every eval is a sample. A model can pass every public benchmark and fail on the long tail of real user prompts. Three durable problems:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Contamination</div><div class="card-body">Public benchmarks leak into training. Hold-out evals must be private and rotated.</div></div>
<div class="calc-card"><div class="card-title">Strategic behaviour</div><div class="card-body">A capable enough model can detect that it is being evaluated and behave differently. Anthropic 2024 has documented this empirically.</div></div>
<div class="calc-card"><div class="card-title">Coverage</div><div class="card-body">Most benchmarks are English-centric, US-centric, written-text-centric. Voice, low-resource languages, and culture-specific harms are under-tested.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> No single number is enough. Evaluate as a portfolio.<br><strong>2.</strong> HELM's seven dimensions (accuracy, calibration, robustness, fairness, bias, toxicity, efficiency) are a good default frame.<br><strong>3.</strong> Capability: MMLU-Pro, GPQA, SWE-bench, MATH, LiveBench, Chatbot Arena.<br><strong>4.</strong> Safety: HarmBench, RealToxicityPrompts, TruthfulQA, XSTest, CyberSecEval, WMDP.<br><strong>5.</strong> Bias: BBQ, StereoSet, CrowS-Pairs, DiscrimEval.<br><strong>6.</strong> AISIs and NIST do pre-deployment evaluation now; EU AI Act conformity comes online soon.<br><strong>7.</strong> A model card documents intent, data, evals, limits, ethics, maintenance — read three real ones.<br><strong>8.</strong> Contamination and strategic behaviour mean evals must be rotated and partially private.</div></div>
</div>`,

tr: `<p class="l-text"><strong>Bir modelin güvenli olduğunu nasıl bilirsin? Onu ölçersin. İş şu ki tek bir sayı yok. Bir model MMLU'da kusursuz olabilir, TruthfulQA'da başarısız olabilir, zararlı prompt'ları mükemmel reddederken neşeyle gerçekleri uydurabilir ve hiçbir benchmark'ın yakalayamadığı şekillerde azınlık lehçelerine karşı ayrımcılık yapabilir.</strong></p>
<p class="l-text">Modern değerlendirme bu nedenle bir portföydür: yetenek benchmark'ları, güvenlik benchmark'ları, önyargı ölçümleri, kalitatif red-team raporları ve üçüncü-taraf denetimler. Bu ders en etkili çerçeveleri (HELM, MMLU-Pro, BBQ, RealToxicityPrompts, AISI evals) gezer ve bunları savunabileceğin bir model kartında nasıl toplayacağını gösterir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>HELM'in yedi metriğini listeleme ve neden birlikte puanlandıklarını açıklama</li>
<li>Yetenek (MMLU-Pro), güvenlik (HarmBench), önyargı (BBQ) ve doğruluk benchmark'larını ayırt etme</li>
<li>Bir model kartını okuma ve eksik olanı belirleme</li>
<li>Benchmark puanlarını savunabilir bir bileşik içinde toplama</li>
<li>Dağıtım-öncesi değerlendirmede AISI, NIST AISI ve üçüncü-taraf denetimlerin rolünü betimleme</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. &quot;Sadece MMLU Çalıştır&quot; Neden Yeterli Değil?</h2>
<p class="l-text">Tek bir doğruluk sayısı dağıtım için önemli olan tüm ödünleri siler. Aynı MMLU puanına sahip iki modelin zıt ret oranları, zıt kalibrasyonu ve çok farklı önyargı profilleri olabilir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yetenek ≠ güvenlik</div><div class="card-body">Güçlü muhakeme modelleri sıklıkla daha az uygun şekilde reddeder çünkü daha kendinden emin yanıtlar üretirler.</div></div>
<div class="calc-card"><div class="card-title">Toplam kaymayı saklar</div><div class="card-body">%70 ortalama, belirli bir demografik alt grupta %30'luk bir düşüşü saklayabilir.</div></div>
<div class="calc-card"><div class="card-title">Benchmark kontaminasyonu</div><div class="card-body">Halka açık benchmark'lar ön-eğitim verisine sızar. MMLU puanları zaman içinde sistematik olarak şişmiştir.</div></div>
<div class="calc-card"><div class="card-title">Tek-metrik optimizasyonu</div><div class="card-body">Yine Goodhart: bir sayıyı optimize etmek diğerlerini bozar. Bir portföy dürüst ödünleri zorlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HELM: Bütünsel Çerçeve</h2>
<p class="l-text">Stanford'un HELM'i (Liang ve ark., 2022) yaygın olarak benimsenen ilk çoklu-metrik çerçeveydi. Her modeli 16+ senaryo boyunca yedi boyutta puanlar. Amaç ödünleri görünür kılmaktır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">Standart görev performansı. Tam eşleşme, F1, vb.</div></div>
<div class="calc-card"><div class="card-title">Kalibrasyon</div><div class="card-body">Modelin güven puanları iyi-kalibre mi? Brier puanı, ECE.</div></div>
<div class="calc-card"><div class="card-title">Sağlamlık</div><div class="card-body">Yazım hataları, parafraz, dağılım kayması altında doğruluk ne kadar düşer?</div></div>
<div class="calc-card"><div class="card-title">Adalet</div><div class="card-body">Demografik alt gruplar arası performans farkı.</div></div>
<div class="calc-card"><div class="card-title">Önyargı</div><div class="card-body">Üretimde stereotipik çağrışımlar. BBQ, StereoSet.</div></div>
<div class="calc-card"><div class="card-title">Toksisite</div><div class="card-body">RealToxicityPrompts. Toksik devamlar üretme olasılığı.</div></div>
<div class="calc-card"><div class="card-title">Verimlilik</div><div class="card-body">Çıkarım süresi, enerji, parametre sayısı. Sıklıkla üretimde önemli olan kısıttır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Yetenek Benchmark'ları</h2>
<p class="l-text">Güvenliği yok saysak bile modelin ne yapabileceğini bilmen gerekir. Mevcut standart küme:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MMLU-Pro (Wang 2024)</div><div class="card-body">Doygunlaşmış MMLU'nun yerine. 12k daha zor çoklu-konu sorusu, 10 cevap seçeneği.</div></div>
<div class="calc-card"><div class="card-title">GPQA Diamond</div><div class="card-body">Google-dayanıklı doktora-düzeyi bilim. Bir alan uzmanının çözebileceği ama Google aramanın çözemediği ~200 soru.</div></div>
<div class="calc-card"><div class="card-title">HumanEval / MBPP / SWE-bench</div><div class="card-body">Kod üretimi, kısa parçacıklardan gerçek GitHub konularına.</div></div>
<div class="calc-card"><div class="card-title">MATH / AIME</div><div class="card-body">Yarışmadan araştırma seviyesine matematik.</div></div>
<div class="calc-card"><div class="card-title">LiveBench</div><div class="card-body">Aylık yenilenen kontaminasyon-dirençli benchmark.</div></div>
<div class="calc-card"><div class="card-title">Chatbot Arena</div><div class="card-body">Crowd ikili tercihler. Yardımseverlikte gerçek-doğruya en yakın olanı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Güvenlik Benchmark'ları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">HarmBench (Mazeika 2024)</div><div class="card-body">510 standartlaştırılmış zararlı davranış, saldırı başarı oranları ve savunma karşılaştırmaları ile.</div></div>
<div class="calc-card"><div class="card-title">RealToxicityPrompts (Gehman 2020)</div><div class="card-body">100k prompt; toksik devamlar olasılığını ölçer.</div></div>
<div class="calc-card"><div class="card-title">TruthfulQA (Lin 2022)</div><div class="card-body">Yaygın yanılgıları tetiklemek için tasarlanmış 817 soru. &quot;Model popüler yanlışlara katılıyor mu?&quot; ölçer.</div></div>
<div class="calc-card"><div class="card-title">XSTest (Röttger 2023)</div><div class="card-body">Aşırı-ret: güvensiz görünen ama olmayan prompt'lar.</div></div>
<div class="calc-card"><div class="card-title">CyberSecEval (Meta)</div><div class="card-body">Kod-güvenlik açığı farkındalığı, prompt-enjeksiyon direnci, otonom-siber yetenek.</div></div>
<div class="calc-card"><div class="card-title">WMDP (Li 2024)</div><div class="card-body">&quot;Kitle imha silahları vekili&quot; — biyo/kimya/siber yükseltme için bilgi sondası.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Önyargı Benchmark'ları</h2>
<p class="l-text">Önyargı değerlendirmesi yetenek değerlendirmesinden daha zordur çünkü &quot;doğru&quot; cevap sıklıkla kültürel bağlama bağlıdır. Modern benchmark'lar önyargı yapısını açık kılmaya çalışır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BBQ (Parrish 2022)</div><div class="card-body">Bias Benchmark for QA. 9 sosyal kategori boyunca belirsiz ve netleştirilmiş bağlam çiftleri. Bağlam belirsizken modelin stereotiplere dayanıp dayanmadığını ölçer.</div></div>
<div class="calc-card"><div class="card-title">StereoSet (Nadeem 2021)</div><div class="card-body">Stereotip, anti-stereotip ve ilgisiz devamlar. Stereotip tercihini ölçer.</div></div>
<div class="calc-card"><div class="card-title">CrowS-Pairs</div><div class="card-body">Yalnızca korunan bir özellikte farklılaşan çiftler. Olasılık farkını ölçer.</div></div>
<div class="calc-card"><div class="card-title">DiscrimEval (Anthropic)</div><div class="card-body">Demografik perturbasyonla karar-verme vinyetleri (kredi onayı, işe alım).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uygulamalı: HELM Tarzı Bileşik Hesapla</h2>
<p class="l-text">Aşağıda dört varsayımsal modeli yedi HELM boyutunda puanlıyoruz ve her boyut dökümünü görünür tutarken tek bir bileşik üretiyoruz. Amaç toplamanın ağırlıklamaya bağlı olarak ödünleri nasıl gizlediğini veya açığa çıkardığını göstermektir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd

dims = [<span class="str">&quot;accuracy&quot;</span>, <span class="str">&quot;calibration&quot;</span>, <span class="str">&quot;robustness&quot;</span>,
        <span class="str">&quot;fairness&quot;</span>, <span class="str">&quot;bias&quot;</span>, <span class="str">&quot;toxicity&quot;</span>, <span class="str">&quot;efficiency&quot;</span>]
<span class="cm"># Önyargı ve toksisite için, düşük daha iyi -&gt; zaten &quot;yüksek = daha güvenli&quot;ye dönüştürdük.</span>
scores = pd.<span class="fn">DataFrame</span>([
    [<span class="num">0.82</span>, <span class="num">0.71</span>, <span class="num">0.65</span>, <span class="num">0.60</span>, <span class="num">0.55</span>, <span class="num">0.78</span>, <span class="num">0.40</span>],   <span class="cm"># Big-Closed</span>
    [<span class="num">0.75</span>, <span class="num">0.65</span>, <span class="num">0.62</span>, <span class="num">0.72</span>, <span class="num">0.70</span>, <span class="num">0.85</span>, <span class="num">0.55</span>],   <span class="cm"># Aligned-Closed</span>
    [<span class="num">0.78</span>, <span class="num">0.55</span>, <span class="num">0.55</span>, <span class="num">0.50</span>, <span class="num">0.45</span>, <span class="num">0.60</span>, <span class="num">0.80</span>],   <span class="cm"># Open-Source</span>
    [<span class="num">0.62</span>, <span class="num">0.68</span>, <span class="num">0.70</span>, <span class="num">0.78</span>, <span class="num">0.80</span>, <span class="num">0.90</span>, <span class="num">0.75</span>],   <span class="cm"># Small-Aligned</span>
], columns=dims, index=[<span class="str">&quot;Big-Closed&quot;</span>, <span class="str">&quot;Aligned-Closed&quot;</span>, <span class="str">&quot;Open-Source&quot;</span>, <span class="str">&quot;Small-Aligned&quot;</span>])

<span class="cm"># Toplamak icin iki yol</span>
uniform_w = np.<span class="fn">ones</span>(<span class="fn">len</span>(dims)) / <span class="fn">len</span>(dims)
safety_w  = np.<span class="fn">array</span>([<span class="num">0.10</span>, <span class="num">0.10</span>, <span class="num">0.10</span>, <span class="num">0.20</span>, <span class="num">0.20</span>, <span class="num">0.20</span>, <span class="num">0.10</span>])

scores[<span class="str">&quot;uniform&quot;</span>]      = scores[dims].<span class="fn">values</span> @ uniform_w
scores[<span class="str">&quot;safety_first&quot;</span>] = scores[dims].<span class="fn">values</span> @ safety_w
<span class="fn">print</span>(scores.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>()
<span class="fn">print</span>(<span class="str">&quot;ranking by uniform     :&quot;</span>, <span class="fn">list</span>(scores[<span class="str">&quot;uniform&quot;</span>].<span class="fn">sort_values</span>(ascending=<span class="kw">False</span>).index))
<span class="fn">print</span>(<span class="str">&quot;ranking by safety_first:&quot;</span>, <span class="fn">list</span>(scores[<span class="str">&quot;safety_first&quot;</span>].<span class="fn">sort_values</span>(ascending=<span class="kw">False</span>).index))</code></pre></div>

<p class="l-text"><strong>Bu kod ne yapar:</strong> 1) Varsayımsal model başına bir satır ve HELM boyutu başına bir sütun olacak şekilde bir pandas DataFrame ile (model, boyut) puan matrisi inşa eder. 2) İki yolla toplar: tekdüze ağırlıklama ve güvenlik-öncelikli ağırlıklama (adalet, önyargı ve toksisite ağırlıklarını ikiye katlayan). 3) Sıralamaları karşılaştırır. Big-Closed model tekdüze altında kazanır ama güvenlik ağırlıklamasında kaybeder; Small-Aligned model tam tersi. Çıkarım: &quot;en iyi model&quot; liderlik tablosuna değil, dağıtım bağlamına bağlıdır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Dağıtım-Öncesi Değerlendirme: AISI ve NIST</h2>
<p class="l-text">2023'ten beri hükümetler sınır modellerini kamuya sunmadan önce test etmek için değerlendirme enstitüleri kurdu. YZ Güvenlik Enstitüleri (UK AISI, NIST altındaki US AISI) gönüllü anlaşmalar altında büyük lab'lardan modelleri ortaklaşa değerlendirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">UK AISI</div><div class="card-body">İlk hareket eden. GPT-4, Claude 3, Gemini, Llama 3'ü dağıtım-öncesi değerlendirdi. Odak: siber, biyo, otonom yetenek, <em>jailbreak</em> sağlamlığı.</div></div>
<div class="calc-card"><div class="card-title">US AISI</div><div class="card-body">NIST içinde. AI RMF (Risk Management Framework) üzerinde endüstriyle koordine eder. NIST AI 600-1 üretici YZ'yi özellikle kapsar.</div></div>
<div class="calc-card"><div class="card-title">EU AI Act uygunluğu</div><div class="card-body">2026'dan itibaren bir hesaplama eşiğinin üzerindeki temel modeller uygunluk değerlendirmesi gerektirir. Standartlar hâlâ taslak halinde.</div></div>
<div class="calc-card"><div class="card-title">METR / Apollo Research</div><div class="card-body">Otonom-görev ve aldatma değerlendirmeleri yürüten bağımsız lab'lar. Sonuçları yayımlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Model Kartı</h2>
<p class="l-text">Mitchell ve ark. (2019) model kartını her yayımlanan modele eşlik eden belge eseri olarak önerdi. Format artık standart. Eksiksiz bir kart şunları içerir:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Niyet edilen kullanım</div><div class="card-body">Modelin ne için olduğu. Açıkça ne için olmadığı.</div></div>
<div class="calc-card"><div class="card-title">Eğitim verisi</div><div class="card-body">Kaynaklar, zaman aralığı, dil kapsamı, bilinen önyargılar.</div></div>
<div class="calc-card"><div class="card-title">Değerlendirme sonuçları</div><div class="card-body">Benchmark başına puanlar, alt grup başına döküm.</div></div>
<div class="calc-card"><div class="card-title">Sınırlamalar</div><div class="card-body">Bilinen başarısızlık modları, halüsinasyon oranı, bağlam-pencere uç durumları.</div></div>
<div class="calc-card"><div class="card-title">Etik düşünceler</div><div class="card-body">Önyargı ölçümleri, uygulanan azaltımlar, kalan riskler.</div></div>
<div class="calc-card"><div class="card-title">Bakım</div><div class="card-body">Versiyonlama, kullanımdan kaldırma politikası, olaylar için iletişim noktası.</div></div>
</div>
<div class="think-box"><div class="think-label">İNCELENECEK GERÇEK BİR KART</div><div class="think-body">Hugging Face'teki Llama 3 model kartı açıktaki en eksiksiz örneklerden biridir. Claude 3 sistem kartı ve GPT-4 sistem kartı kapalı lab'lardan karşılık gelen belgelerdir. Türün aralığı için üçünü de oku.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Değerlendirmenin Sınırları</h2>
<p class="l-text">Her değerlendirme bir örneklemdir. Bir model her halka açık benchmark'ı geçebilir ve gerçek kullanıcı prompt'larının uzun kuyruğunda başarısız olabilir. Üç kalıcı sorun:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kontaminasyon</div><div class="card-body">Halka açık benchmark'lar eğitime sızar. Hold-out değerlendirmeleri özel ve döner olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">Stratejik davranış</div><div class="card-body">Yeterince yetenekli bir model değerlendirildiğini tespit edebilir ve farklı davranabilir. Anthropic 2024 bunu ampirik olarak belgelemiştir.</div></div>
<div class="calc-card"><div class="card-title">Kapsam</div><div class="card-body">Çoğu benchmark İngilizce-merkezli, ABD-merkezli, yazılı-metin-merkezlidir. Ses, düşük-kaynaklı diller ve kültür-spesifik zararlar yetersiz test edilmiştir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Tek bir sayı yeterli değildir. Bir portföy olarak değerlendir.<br><strong>2.</strong> HELM'in yedi boyutu (doğruluk, kalibrasyon, sağlamlık, adalet, önyargı, toksisite, verimlilik) iyi bir varsayılan çerçevedir.<br><strong>3.</strong> Yetenek: MMLU-Pro, GPQA, SWE-bench, MATH, LiveBench, Chatbot Arena.<br><strong>4.</strong> Güvenlik: HarmBench, RealToxicityPrompts, TruthfulQA, XSTest, CyberSecEval, WMDP.<br><strong>5.</strong> Önyargı: BBQ, StereoSet, CrowS-Pairs, DiscrimEval.<br><strong>6.</strong> AISI'ler ve NIST artık dağıtım-öncesi değerlendirme yapıyor; EU AI Act uygunluğu yakında devreye giriyor.<br><strong>7.</strong> Bir model kartı niyet, veri, değerlendirme, sınır, etik, bakımı belgeler — gerçek üç tane oku.<br><strong>8.</strong> Kontaminasyon ve stratejik davranış değerlendirmelerin döner ve kısmen özel olması gerektiği anlamına gelir.</div></div>
</div>`
};
