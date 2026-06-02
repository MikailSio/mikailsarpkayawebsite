window.HF_L10 = {
en: `<p class="l-text"><strong>"Our model gets 78% on MMLU" is a sentence with at least four hidden assumptions, every one of which can flip the leaderboard.</strong> Which prompt template? 0-shot or 5-shot? Letter answer or full text? Logit-based scoring or generated-string match? The reason <code>lm-evaluation-harness</code> exists is that the field needed one place where these knobs are pinned down and reproducible. Without it, "model A beats model B by 2 points on MMLU" is meaningless — they were probably evaluated under different rules.</p>

<p class="l-text">In this lesson we'll tour the harness: how it loads tasks, how scoring works (logit-based vs generation-based), the canonical benchmarks (MMLU, MMLU-Pro, HellaSwag, ARC, TruthfulQA, GSM8K), how to write a custom task, and the bias / leakage gotchas that make headline numbers misleading. Every concept is paired with a runnable Pyodide demo on a tiny mock multiple-choice task using sklearn so you can feel the scoring loop end-to-end without a GPU.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The two scoring modes: log-likelihood (multiple choice) vs generative</li>
<li>What MMLU, HellaSwag, ARC, MMLU-Pro, GSM8K actually measure</li>
<li>Few-shot prompting and why N=0,1,5,25 matter</li>
<li>Writing a custom task with the YAML/Python interface</li>
<li>Bias evaluation: BOLD, BBQ, and gender/racial stereotype probes</li>
<li>Contamination and the "leaderboard goes up, capability does not" trap</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Two Scoring Modes</h2>
<p class="l-text">Almost every task in the harness uses one of two scoring strategies. Knowing which is in use is the difference between a meaningful and a meaningless number.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Log-likelihood (multiple choice)</div><div class="card-body">For each candidate answer, compute the log-prob of the answer given the prompt. Pick the highest. Used by MMLU, HellaSwag, ARC, PIQA. No sampling, no temperature.</div></div>
<div class="calc-card"><div class="card-title">Generation</div><div class="card-body">Have the model generate, then match the output (often with a regex or "extract first number" rule) against a reference. Used by GSM8K, MATH, HumanEval, TruthfulQA-gen.</div></div>
</div>

<div class="katex-block">$$\\hat{c} = \\arg\\max_{c \\in \\text{choices}} \\frac{1}{|c|} \\sum_{t=1}^{|c|} \\log P(c_t \\mid \\text{prompt}, c_{&lt;t})$$</div>

<p class="l-text">The length normalization (the <code>1/|c|</code> term) matters: without it, models systematically prefer shorter answers because shorter sequences accumulate fewer negative log-probs. The harness handles this by default; rolling your own evaluator means thinking about it.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. A Mock Multiple-Choice Loop</h2>
<p class="l-text">Build the simplest possible MC scorer end-to-end: 200 questions, each with 4 candidate answers, "model" assigns log-probs, we pick the argmax, compute accuracy. This is exactly the inner loop of MMLU evaluation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Mock dataset: 200 4-way multiple-choice questions, each represented as a feature vector</span>
N, n_features, n_choices = <span class="num">200</span>, <span class="num">16</span>, <span class="num">4</span>
question_features = rng.<span class="fn">standard_normal</span>((N, n_features))
true_labels = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_choices, N)

<span class="cm"># Each candidate answer has its own feature vector; the right one matches the question pattern</span>
<span class="kw">def</span> <span class="fn">build_qa_dataset</span>():
    X = []; y = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
        qf = question_features[i]
        correct = true_labels[i]
        <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(n_choices):
            <span class="cm"># correct answer is "near" the question feature, others are noise</span>
            af = qf + <span class="num">0.2</span>*rng.<span class="fn">standard_normal</span>(n_features) <span class="kw">if</span> c == correct \\
                 <span class="kw">else</span> rng.<span class="fn">standard_normal</span>(n_features)
            <span class="cm"># Stack [question, candidate] features, label = is_correct</span>
            X.<span class="fn">append</span>(np.<span class="fn">concatenate</span>([qf, af]))
            y.<span class="fn">append</span>(<span class="fn">int</span>(c == correct))
    <span class="kw">return</span> np.<span class="fn">array</span>(X), np.<span class="fn">array</span>(y)

X, y = <span class="fn">build_qa_dataset</span>()
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Score each question's 4 candidates, pick argmax of log-prob "correct"</span>
log_probs = clf.<span class="fn">predict_log_proba</span>(X)[:, <span class="num">1</span>].<span class="fn">reshape</span>(N, n_choices)
predictions = log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)
acc = <span class="fn">accuracy_score</span>(true_labels, predictions)

<span class="cm"># Length normalization simulation: divide each log-prob by candidate "length"</span>
lengths = rng.<span class="fn">integers</span>(<span class="num">5</span>, <span class="num">25</span>, (N, n_choices))
norm_log_probs = log_probs / lengths
predictions_norm = norm_log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"raw log-prob accuracy           : {acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"length-normalized accuracy      : {accuracy_score(true_labels, predictions_norm):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"random-baseline accuracy        : {1/n_choices:.3f}"</span>)

<span class="cm"># Top-2 accuracy: was the correct answer in the top-2 candidates?</span>
top2 = np.<span class="fn">argsort</span>(-log_probs, axis=<span class="num">1</span>)[:, :<span class="num">2</span>]
top2_acc = np.<span class="fn">mean</span>([true_labels[i] <span class="kw">in</span> top2[i] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N)])
<span class="fn">print</span>(f<span class="str">"top-2 accuracy                  : {top2_acc:.3f}"</span>)
</code></pre></div>

<p class="l-text">The harness wraps this exact pattern with task-specific prompt formatting and the model's tokenizer. Underneath, every "MMLU 70%" headline is this loop running over 14k questions.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Canonical Benchmarks</h2>
<p class="l-text">Six tasks dominate every model card. Knowing what each measures (and what it does NOT) keeps you skeptical when reading evals.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MMLU (Hendrycks 2020)</div><div class="card-body">14k multiple-choice questions across 57 subjects (math, law, medicine, ...). Tests broad knowledge. Random = 25%, GPT-4 ~ 86%, frontier 2026 models ~ 90%.</div></div>
<div class="calc-card"><div class="card-title">MMLU-Pro</div><div class="card-body">Harder MMLU successor with 10 choices and reasoning-heavy questions. Frontier 2026 ~ 70%. Replaces saturated MMLU.</div></div>
<div class="calc-card"><div class="card-title">HellaSwag</div><div class="card-body">Common-sense sentence completion. 4-way MC. Tests world knowledge that humans use unconsciously.</div></div>
<div class="calc-card"><div class="card-title">ARC (Easy / Challenge)</div><div class="card-body">Grade-school science questions. Challenge subset is the harder filter. Used as a sanity check.</div></div>
<div class="calc-card"><div class="card-title">GSM8K</div><div class="card-body">Grade-school math word problems. Generation task — model writes a chain of thought, harness extracts the final number.</div></div>
<div class="calc-card"><div class="card-title">TruthfulQA</div><div class="card-body">Probes the tendency to repeat human misconceptions. Generation + a fine-tuned judge model. Notoriously sensitive to prompt format.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Harness CLI</h2>
<p class="l-text">In practice you call the harness as a CLI. One line evaluates any HuggingFace model on any task. The tasks themselves live as YAML files — you can mix and match without touching code.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — lm-evaluation-harness)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Install</span>
pip install lm-eval[vllm]

<span class="cm"># Evaluate Llama-3-8B on MMLU 5-shot, then a small grab-bag</span>
lm_eval \\
  --model vllm \\
  --model_args pretrained=meta-llama/Meta-Llama-<span class="num">3</span>-8B,dtype=bfloat16,tensor_parallel_size=<span class="num">1</span> \\
  --tasks mmlu,hellaswag,arc_challenge,truthfulqa,gsm8k \\
  --num_fewshot <span class="num">5</span> \\
  --batch_size auto \\
  --output_path ./results

<span class="cm"># Single-task with a custom limit (handy for sanity checks)</span>
lm_eval --model hf \\
  --model_args pretrained=mistralai/Mistral-7B-v0.3 \\
  --tasks mmlu_high_school_mathematics \\
  --limit <span class="num">100</span> \\
  --num_fewshot <span class="num">0</span>
</code></pre></div>

<p class="l-text">The vLLM backend speeds up evaluation 5-10x compared to the plain HF backend, because it batches the per-question forward passes through PagedAttention. For a 70B model, plain HF evaluates MMLU in ~12 hours; vLLM does it in ~90 minutes.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Writing a Custom Task</h2>
<p class="l-text">A task is a YAML file. The fields specify the dataset, the prompt template, the metric, and (for MC tasks) the choice list. No Python required for the standard cases.</p>

<div class="code-wrap"><div class="code-label"><span>YAML (DEMO — custom task)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># my_sentiment_task.yaml</span>
task: company_sentiment
dataset_path: my-org/company-news-sentiment   <span class="cm"># any HF dataset</span>
test_split: test
output_type: multiple_choice                  <span class="cm"># logit scoring</span>
doc_to_text: |
  Classify the sentiment of the following news headline.

  Headline: {{headline}}
  Sentiment:
doc_to_target: <span class="str">"{{label}}"</span>                    <span class="cm"># ground-truth column</span>
doc_to_choice: [<span class="str">"positive"</span>, <span class="str">"neutral"</span>, <span class="str">"negative"</span>]
metric_list:
  - metric: acc
    aggregation: mean
    higher_is_better: true
  - metric: acc_norm                          <span class="cm"># length-normalized acc</span>
    aggregation: mean
    higher_is_better: true
num_fewshot: <span class="num">5</span>
fewshot_split: train
</code></pre></div>

<p class="l-text"><strong>How a custom task is defined:</strong> the YAML is the entire interface — no Python is needed for the standard case. <code>output_type: multiple_choice</code> tells the harness to use log-likelihood scoring (no sampling); <code>doc_to_text</code> is a Jinja-style template that the harness fills with each dataset row; <code>doc_to_choice</code> is the candidate list whose log-probs are compared. The two metrics — <code>acc</code> and <code>acc_norm</code> — capture both the raw winner and the length-normalized winner, which matters because longer candidates accumulate more negative log-prob. <code>num_fewshot: 5</code> + <code>fewshot_split: train</code> auto-prepends five training examples to every prompt as in-context exemplars.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Re-implement the same custom-task pattern on the reviews dataset: 3-way classification, length-normalized log-probs, accuracy reported.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score

<span class="cm"># Use the reviews dataset as a stand-in for a custom 3-way classification task</span>
texts  = df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>).values
ratings = df_reviews[<span class="str">"rating"</span>].<span class="fn">astype</span>(<span class="fn">int</span>).values

<span class="cm"># Bucket ratings 1-2 -> negative, 3 -> neutral, 4-5 -> positive</span>
<span class="kw">def</span> <span class="fn">to_label</span>(r):
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> r &lt;= <span class="num">2</span> <span class="kw">else</span> (<span class="num">1</span> <span class="kw">if</span> r == <span class="num">3</span> <span class="kw">else</span> <span class="num">2</span>)
labels = np.<span class="fn">array</span>([<span class="fn">to_label</span>(r) <span class="kw">for</span> r <span class="kw">in</span> ratings])

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(texts, labels, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(vec.<span class="fn">fit_transform</span>(Xtr), ytr)

<span class="cm"># Custom-task scoring: for each test item, score 3 candidate answers</span>
choices = [<span class="str">"negative"</span>, <span class="str">"neutral"</span>, <span class="str">"positive"</span>]
log_probs = clf.<span class="fn">predict_log_proba</span>(vec.<span class="fn">transform</span>(Xte))   <span class="cm"># (n, 3)</span>
preds = log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="cm"># Length-normalized variant (analogous to acc_norm)</span>
choice_lengths = np.<span class="fn">array</span>([<span class="fn">len</span>(c) <span class="kw">for</span> c <span class="kw">in</span> choices])
preds_norm = (log_probs / choice_lengths).<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"acc      : {accuracy_score(yte, preds):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"acc_norm : {accuracy_score(yte, preds_norm):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"random   : {1/len(choices):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"per-class support: {np.bincount(yte)}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>How this code mirrors a real harness task:</strong> we use the reviews dataset as our 3-way "positive / neutral / negative" classification problem. The TF-IDF + LogisticRegression pair stands in for an LLM — what matters is that <code>predict_log_proba</code> gives us a log-prob per candidate, exactly the signal the harness scores. We compute both <code>acc</code> (raw argmax) and <code>acc_norm</code> (log-prob divided by candidate string length, identical to the harness <code>acc_norm</code> metric). The random baseline tells us the floor, and the support print confirms class imbalance — both of which the harness reports automatically alongside the headline number.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Few-Shot Effects</h2>
<p class="l-text">Adding 5 in-context examples typically lifts MMLU accuracy by 5-15 points over 0-shot. The harness lets you sweep the shot count to see the slope. Worth doing — sometimes a model that loses head-to-head at 5-shot wins at 0-shot, which is what end users actually see.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Simulate few-shot lift: each shot contributes diminishing returns</span>
<span class="kw">def</span> <span class="fn">simulated_accuracy</span>(model_skill, n_shots, ceiling=<span class="num">0.92</span>):
    <span class="str">"""Simple model: accuracy = base + lift_per_shot * (1 - decay^n)"""</span>
    base = model_skill * <span class="num">0.6</span>
    lift = (ceiling - base) * (<span class="num">1</span> - <span class="num">0.7</span>**n_shots)
    noise = <span class="num">0.01</span> * rng.<span class="fn">standard_normal</span>()
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">clip</span>(base + lift + noise, <span class="num">0</span>, <span class="num">1</span>))

shots = [<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">25</span>]
<span class="fn">print</span>(f<span class="str">"{'shots':&gt;6} | {'weak (0.5)':&gt;10} | {'strong (0.9)':&gt;12}"</span>)
<span class="kw">for</span> n <span class="kw">in</span> shots:
    weak   = <span class="fn">simulated_accuracy</span>(<span class="num">0.5</span>, n)
    strong = <span class="fn">simulated_accuracy</span>(<span class="num">0.9</span>, n)
    <span class="fn">print</span>(f<span class="str">"{n:&gt;6} | {weak:&gt;10.3f} | {strong:&gt;12.3f}"</span>)

<span class="cm"># Insight: at 0-shot the gap between models is largest; at 25-shot it can almost vanish</span>
<span class="cm"># because both models eventually saturate against the task ceiling.</span>
</code></pre></div>

<p class="l-text"><strong>How this simulation captures few-shot dynamics:</strong> the helper <code>simulated_accuracy</code> uses a base score (model_skill * 0.6) and a lift that approaches the task ceiling exponentially with shot count — a stylized but faithful model of what you actually see on MMLU. We sweep N=0,1,5,25 for a "weak" (skill 0.5) and a "strong" (skill 0.9) model in the same table. The takeaway is visible in the numbers: at 0-shot the gap between models is biggest, at 25-shot it shrinks because both saturate against the ceiling — which is why you cannot compare two models at different shot counts.</p>


<div class="calc-highlight">When comparing models, always state the shot count. "Llama beats Mistral by 3 points on MMLU 5-shot" can flip to "loses by 1 point at 0-shot" — a gap that might matter more for end-user chatbot quality.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bias &amp; Safety Evals</h2>
<p class="l-text">Capability benchmarks like MMLU say nothing about whether the model produces stereotyped or harmful outputs. A separate family of evals targets that.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BBQ</div><div class="card-body">Question-answering with social bias attractors. Measures whether the model picks the stereotyped option when the context is ambiguous.</div></div>
<div class="calc-card"><div class="card-title">BOLD</div><div class="card-body">Open-ended generation prompts about demographics; sentiment / regard of generations is scored by a classifier.</div></div>
<div class="calc-card"><div class="card-title">CrowS-Pairs</div><div class="card-body">Pairs of sentences differing in a stereotype dimension (race, gender). Measures which the model assigns higher probability.</div></div>
<div class="calc-card"><div class="card-title">RealToxicityPrompts</div><div class="card-body">~100k prompts spanning toxicity levels; measures continuation toxicity with Perspective API.</div></div>
<div class="calc-card"><div class="card-title">XSTest</div><div class="card-body">Probes over-refusal: does the model refuse benign queries that look superficially unsafe?</div></div>
<div class="calc-card"><div class="card-title">HELM</div><div class="card-body">Holistic Evaluation of Language Models from Stanford — bundles 16 metrics across capability, bias, robustness, calibration.</div></div>
</div>

<p class="l-text">A common failure mode: optimizing only on capability benchmarks pushes a model toward higher MMLU and quietly worse BBQ. Track both. The harness supports the bias evals in the same CLI run.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Contamination &amp; Reading Leaderboards Skeptically</h2>
<p class="l-text">The hardest problem in evaluation today: <strong>training data contamination</strong>. If your pretraining corpus accidentally contains MMLU questions (and many do — they are on the open web), your evaluation measures memorization, not capability.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N-gram overlap</div><div class="card-body">Count exact 13-gram matches between eval set and training corpus. Standard since GPT-3. Quick but noisy.</div></div>
<div class="calc-card"><div class="card-title">Held-out splits</div><div class="card-body">Newer benchmarks (MMLU-Pro, GPQA, MATH-Hard) ship with a private test set you submit predictions to.</div></div>
<div class="calc-card"><div class="card-title">Detect-by-perturbation</div><div class="card-body">If a model is exactly right on the original phrasing but fails on paraphrases, suspect memorization.</div></div>
<div class="calc-card"><div class="card-title">Time-versioned evals</div><div class="card-body">LiveBench / SWE-Bench-Verified rotate fresh problems monthly. The only true defense for an open eval.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Toy contamination check: 13-gram overlap between an eval question and a "training corpus"</span>
<span class="kw">def</span> <span class="fn">ngrams</span>(text, n=<span class="num">13</span>):
    tokens = text.<span class="fn">lower</span>().<span class="fn">split</span>()
    <span class="kw">return</span> {<span class="fn">tuple</span>(tokens[i:i+n]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(tokens) - n + <span class="num">1</span>)}

corpus = <span class="str">" "</span>.<span class="fn">join</span>([
    <span class="str">"The capital of France is Paris."</span>,
    <span class="str">"Photosynthesis converts light energy into chemical energy in plants."</span>,
    <span class="str">"The Pythagorean theorem states a squared plus b squared equals c squared."</span>,
] * <span class="num">100</span>)

eval_questions = [
    <span class="str">"What is the capital of France?"</span>,                                      <span class="cm"># likely seen</span>
    <span class="str">"The Pythagorean theorem states a squared plus b squared equals c squared."</span>,  <span class="cm"># exact in corpus!</span>
    <span class="str">"Explain how a transformer encoder layer differs from a decoder."</span>,     <span class="cm"># not in corpus</span>
]

corpus_ngrams = <span class="fn">ngrams</span>(corpus, n=<span class="num">5</span>)
<span class="kw">for</span> q <span class="kw">in</span> eval_questions:
    overlap = <span class="fn">ngrams</span>(q, n=<span class="num">5</span>) &amp; corpus_ngrams
    flag = <span class="str">"CONTAMINATED"</span> <span class="kw">if</span> overlap <span class="kw">else</span> <span class="str">"clean"</span>
    <span class="fn">print</span>(f<span class="str">"{flag:13s}  | {q[:60]}  ({len(overlap)} matching 5-grams)"</span>)
</code></pre></div>

<p class="l-text">The takeaway: any single benchmark number is a starting point, not a verdict. Read leaderboards with the same suspicion you'd read a self-reported clinical-trial result. The harness is the tool that lets the suspicion be productive — it's the only way to compare apples to apples in the open ecosystem.</p>
</div>
`,
tr: `<p class="l-text"><strong>"Modelimiz MMLU'da %78 alıyor" cümlesi en az dört gizli varsayım içerir ve bunların her biri leaderboard'u ters çevirebilir.</strong> Hangi prompt şablonu? 0-shot mu 5-shot mu? Harf cevap mı tam metin mi? Logit-tabanlı puanlama mı yoksa üretilen-string eşleşmesi mi? <code>lm-evaluation-harness</code>'ın var olma sebebi, alanın bu düğmelerin sabitlendiği ve yeniden üretilebildiği tek bir yere ihtiyaç duymasıydı. O olmadan, "model A, MMLU'da B'yi 2 puan farkla yener" anlamsızdır — muhtemelen farklı kurallar altında değerlendirilmişlerdir.</p>

<p class="l-text">Bu derste harness'ı gezeceğiz: görevleri nasıl yüklediğini, puanlamanın nasıl çalıştığını (logit-tabanlı vs üretim-tabanlı), kanonik benchmark'ları (MMLU, MMLU-Pro, HellaSwag, ARC, TruthfulQA, GSM8K), özel görev nasıl yazılır, ve manşet rakamlarını yanıltıcı kılan önyargı/sızıntı tuzakları. Her kavramı sklearn kullanan minik bir sahte çoktan-seçmeli görevde çalıştırılabilir Pyodide demosuyla eşleştirdik; böylece GPU olmadan puanlama döngüsünü baştan sona hissedebilirsin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İki puanlama modu: log-olabilirlik (çoktan seçmeli) vs üretici</li>
<li>MMLU, HellaSwag, ARC, MMLU-Pro, GSM8K aslında neyi ölçer</li>
<li>Few-shot prompt'lama ve N=0,1,5,25'in neden önemli olduğu</li>
<li>YAML/Python arayüzüyle özel görev yazma</li>
<li>Önyargı değerlendirmesi: BOLD, BBQ ve cinsiyet/ırk stereotip probları</li>
<li>Kontaminasyon ve "leaderboard yükselir, yetenek yükselmez" tuzağı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İki Puanlama Modu</h2>
<p class="l-text">Harness'taki neredeyse her görev iki puanlama stratejisinden birini kullanır. Hangisinin kullanıldığını bilmek anlamlı bir rakamla anlamsız bir rakam arasındaki farktır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Log-olabilirlik (çoktan seçmeli)</div><div class="card-body">Her aday cevap için, prompt verildiğinde cevabın log-olasılığını hesapla. En yükseği seç. MMLU, HellaSwag, ARC, PIQA tarafından kullanılır. Örnekleme yok, sıcaklık yok.</div></div>
<div class="calc-card"><div class="card-title">Üretim</div><div class="card-body">Modele üretim yaptır, sonra çıktıyı (genellikle bir regex veya "ilk sayıyı çıkar" kuralıyla) referansla eşleştir. GSM8K, MATH, HumanEval, TruthfulQA-gen tarafından kullanılır.</div></div>
</div>

<div class="katex-block">$$\\hat{c} = \\arg\\max_{c \\in \\text{choices}} \\frac{1}{|c|} \\sum_{t=1}^{|c|} \\log P(c_t \\mid \\text{prompt}, c_{&lt;t})$$</div>

<p class="l-text">Uzunluk normalizasyonu (<code>1/|c|</code> terimi) önemlidir: o olmadan, modeller sistemli olarak daha kısa cevapları tercih eder çünkü daha kısa diziler daha az negatif log-olasılık biriktirir. Harness varsayılan olarak bunu halleder; kendi değerlendiricini yazmak bunu düşünmek demektir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Sahte Çoktan-Seçmeli Döngü</h2>
<p class="l-text">Mümkün olan en basit MC puanlayıcısını baştan sona inşa et: 200 soru, her birinin 4 aday cevabı, "model" log-olasılık atar, biz argmax'ı seçeriz, doğruluğu hesaplarız. MMLU değerlendirmesinin iç döngüsü tam olarak budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Sahte veri kümesi: her biri özellik vektörü olarak temsil edilen 200 4-yollu çoktan seçmeli soru</span>
N, n_features, n_choices = <span class="num">200</span>, <span class="num">16</span>, <span class="num">4</span>
question_features = rng.<span class="fn">standard_normal</span>((N, n_features))
true_labels = rng.<span class="fn">integers</span>(<span class="num">0</span>, n_choices, N)

<span class="cm"># Her aday cevabın kendi özellik vektörü var; doğru olan soru desenine uyar</span>
<span class="kw">def</span> <span class="fn">build_qa_dataset</span>():
    X = []; y = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N):
        qf = question_features[i]
        correct = true_labels[i]
        <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(n_choices):
            <span class="cm"># doğru cevap soru özelliğine "yakın", diğerleri gürültü</span>
            af = qf + <span class="num">0.2</span>*rng.<span class="fn">standard_normal</span>(n_features) <span class="kw">if</span> c == correct \\
                 <span class="kw">else</span> rng.<span class="fn">standard_normal</span>(n_features)
            <span class="cm"># [soru, aday] özelliklerini istifle, etiket = doğru_mu</span>
            X.<span class="fn">append</span>(np.<span class="fn">concatenate</span>([qf, af]))
            y.<span class="fn">append</span>(<span class="fn">int</span>(c == correct))
    <span class="kw">return</span> np.<span class="fn">array</span>(X), np.<span class="fn">array</span>(y)

X, y = <span class="fn">build_qa_dataset</span>()
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Her sorunun 4 adayını puanla, "doğru" log-olasılığının argmax'ını seç</span>
log_probs = clf.<span class="fn">predict_log_proba</span>(X)[:, <span class="num">1</span>].<span class="fn">reshape</span>(N, n_choices)
predictions = log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)
acc = <span class="fn">accuracy_score</span>(true_labels, predictions)

<span class="cm"># Uzunluk normalizasyon simülasyonu: her log-olasılığı aday "uzunluğuna" böl</span>
lengths = rng.<span class="fn">integers</span>(<span class="num">5</span>, <span class="num">25</span>, (N, n_choices))
norm_log_probs = log_probs / lengths
predictions_norm = norm_log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"ham log-olasılık doğruluğu     : {acc:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"uzunluk-normalize doğruluk     : {accuracy_score(true_labels, predictions_norm):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"rastgele-baseline doğruluk     : {1/n_choices:.3f}"</span>)

<span class="cm"># Top-2 doğruluk: doğru cevap top-2 adayda mıydı?</span>
top2 = np.<span class="fn">argsort</span>(-log_probs, axis=<span class="num">1</span>)[:, :<span class="num">2</span>]
top2_acc = np.<span class="fn">mean</span>([true_labels[i] <span class="kw">in</span> top2[i] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N)])
<span class="fn">print</span>(f<span class="str">"top-2 doğruluk                 : {top2_acc:.3f}"</span>)
</code></pre></div>

<p class="l-text">Harness bu birebir deseni göreve özgü prompt biçimlendirme ve modelin tokenleştiricisi ile sarar. Altında, her "MMLU %70" başlığı bu döngünün 14k soru üzerinde çalışmasıdır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Kanonik Benchmark'lar</h2>
<p class="l-text">Altı görev her model kartına hakimdir. Her birinin neyi ölçtüğünü (ve neyi ölçMEDİĞİNİ) bilmek değerlendirmeleri okurken seni şüpheci tutar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MMLU (Hendrycks 2020)</div><div class="card-body">57 konuda (matematik, hukuk, tıp, ...) 14k çoktan seçmeli soru. Geniş bilgiyi test eder. Rastgele = %25, GPT-4 ~ %86, 2026 sınır modelleri ~ %90.</div></div>
<div class="calc-card"><div class="card-title">MMLU-Pro</div><div class="card-body">10 seçenekli ve akıl-yürütme ağırlıklı sorularla daha zor MMLU halefi. 2026 sınır ~ %70. Doygunlaşmış MMLU'nun yerini alır.</div></div>
<div class="calc-card"><div class="card-title">HellaSwag</div><div class="card-body">Sağduyulu cümle tamamlama. 4-yollu MC. İnsanların bilinçsizce kullandığı dünya bilgisini test eder.</div></div>
<div class="calc-card"><div class="card-title">ARC (Easy / Challenge)</div><div class="card-body">İlkokul fen soruları. Challenge alt kümesi daha zor filtre. Akıl sağlığı kontrolü olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">GSM8K</div><div class="card-body">İlkokul matematik problem soruları. Üretim görevi — model bir düşünce zinciri yazar, harness son sayıyı çıkarır.</div></div>
<div class="calc-card"><div class="card-title">TruthfulQA</div><div class="card-body">İnsan yanılgılarını tekrarlama eğilimini test eder. Üretim + ince ayarlanmış yargıç model. Prompt biçimine son derece duyarlıdır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Harness CLI</h2>
<p class="l-text">Pratikte harness'ı CLI olarak çağırırsın. Tek satır herhangi bir HuggingFace modelini herhangi bir görevde değerlendirir. Görevlerin kendisi YAML dosyası olarak yaşar — koda dokunmadan karıştırıp eşleştirebilirsin.</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — lm-evaluation-harness)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Kurulum</span>
pip install lm-eval[vllm]

<span class="cm"># Llama-3-8B'yi MMLU 5-shot'ta değerlendir, sonra küçük bir karışım</span>
lm_eval \\
  --model vllm \\
  --model_args pretrained=meta-llama/Meta-Llama-<span class="num">3</span>-8B,dtype=bfloat16,tensor_parallel_size=<span class="num">1</span> \\
  --tasks mmlu,hellaswag,arc_challenge,truthfulqa,gsm8k \\
  --num_fewshot <span class="num">5</span> \\
  --batch_size auto \\
  --output_path ./results

<span class="cm"># Özel sınır ile tek görev (akıl sağlığı kontrolü için kullanışlı)</span>
lm_eval --model hf \\
  --model_args pretrained=mistralai/Mistral-7B-v0.3 \\
  --tasks mmlu_high_school_mathematics \\
  --limit <span class="num">100</span> \\
  --num_fewshot <span class="num">0</span>
</code></pre></div>

<p class="l-text">vLLM backend'i sade HF backend'e kıyasla değerlendirmeyi 5-10x hızlandırır çünkü soru başı ileri geçişleri PagedAttention ile batch'ler. 70B model için sade HF MMLU'yu ~12 saatte değerlendirir; vLLM ~90 dakikada yapar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Özel Görev Yazma</h2>
<p class="l-text">Bir görev YAML dosyasıdır. Alanlar veri kümesini, prompt şablonunu, metriği ve (MC görevleri için) seçim listesini belirtir. Standart durumlar için Python gerekmez.</p>

<div class="code-wrap"><div class="code-label"><span>YAML (DEMO — özel görev)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># my_sentiment_task.yaml</span>
task: company_sentiment
dataset_path: my-org/company-news-sentiment   <span class="cm"># herhangi bir HF veri kümesi</span>
test_split: test
output_type: multiple_choice                  <span class="cm"># logit puanlama</span>
doc_to_text: |
  Aşağıdaki haber başlığının duygusunu sınıflandır.

  Başlık: {{headline}}
  Duygu:
doc_to_target: <span class="str">"{{label}}"</span>                    <span class="cm"># gerçek-değer sütunu</span>
doc_to_choice: [<span class="str">"positive"</span>, <span class="str">"neutral"</span>, <span class="str">"negative"</span>]
metric_list:
  - metric: acc
    aggregation: mean
    higher_is_better: true
  - metric: acc_norm                          <span class="cm"># uzunluk-normalize doğruluk</span>
    aggregation: mean
    higher_is_better: true
num_fewshot: <span class="num">5</span>
fewshot_split: train
</code></pre></div>

<p class="l-text"><strong>Özel görev nasıl tanımlanır:</strong> YAML bütün arayüzdür — standart durum için Python gerekmez. <code>output_type: multiple_choice</code>, harness'a log-olabilirlik puanlaması kullanmasını söyler (örnekleme yok); <code>doc_to_text</code> her veri satırını dolduran Jinja-stili bir şablondur; <code>doc_to_choice</code>, log-olasılıkları karşılaştırılan aday listesidir. İki metrik — <code>acc</code> ve <code>acc_norm</code> — hem ham kazananı hem uzunluk-normalize kazananı yakalar; bu önemlidir çünkü daha uzun adaylar daha çok negatif log-olasılık biriktirir. <code>num_fewshot: 5</code> + <code>fewshot_split: train</code> bağlam-içi örnek olarak her prompt'un başına otomatik beş eğitim örneği ekler.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">reviews veri kümesinde aynı özel-görev desenini yeniden uygula: 3-yollu sınıflandırma, uzunluk-normalize log-olasılıklar, doğruluk raporlanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score

<span class="cm"># reviews veri kümesini özel 3-yollu sınıflandırma görevi yerine kullan</span>
texts  = df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>).values
ratings = df_reviews[<span class="str">"rating"</span>].<span class="fn">astype</span>(<span class="fn">int</span>).values

<span class="cm"># 1-2 puanları -> negatif, 3 -> nötr, 4-5 -> pozitif</span>
<span class="kw">def</span> <span class="fn">to_label</span>(r):
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> r &lt;= <span class="num">2</span> <span class="kw">else</span> (<span class="num">1</span> <span class="kw">if</span> r == <span class="num">3</span> <span class="kw">else</span> <span class="num">2</span>)
labels = np.<span class="fn">array</span>([<span class="fn">to_label</span>(r) <span class="kw">for</span> r <span class="kw">in</span> ratings])

Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(texts, labels, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(vec.<span class="fn">fit_transform</span>(Xtr), ytr)

<span class="cm"># Özel görev puanlama: her test öğesi için 3 aday cevabı puanla</span>
choices = [<span class="str">"negative"</span>, <span class="str">"neutral"</span>, <span class="str">"positive"</span>]
log_probs = clf.<span class="fn">predict_log_proba</span>(vec.<span class="fn">transform</span>(Xte))   <span class="cm"># (n, 3)</span>
preds = log_probs.<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="cm"># Uzunluk-normalize varyant (acc_norm'a benzer)</span>
choice_lengths = np.<span class="fn">array</span>([<span class="fn">len</span>(c) <span class="kw">for</span> c <span class="kw">in</span> choices])
preds_norm = (log_probs / choice_lengths).<span class="fn">argmax</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"acc      : {accuracy_score(yte, preds):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"acc_norm : {accuracy_score(yte, preds_norm):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"rastgele : {1/len(choices):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"sınıf başı destek: {np.bincount(yte)}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Bu kod gerçek bir harness görevini nasıl taklit ediyor:</strong> reviews veri kümesini 3 yönlü "pozitif / nötr / negatif" sınıflandırma problemi olarak kullanıyoruz. TF-IDF + LogisticRegression çifti bir LLM'in yerine geçer — önemli olan <code>predict_log_proba</code>'nın aday başına bir log-olasılık vermesi, ki bu da harness'ın puanladığı sinyalin tam karşılığıdır. Hem <code>acc</code> (ham argmax) hem <code>acc_norm</code> (log-olasılık / aday string uzunluğu, harness'ın <code>acc_norm</code> metriğiyle birebir) hesaplanır. Rastgele temel bize tabanı söyler ve destek çıktısı sınıf dengesizliğini doğrular — harness manşet rakamın yanında bu ikisini de otomatik raporlar.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Few-Shot Etkileri</h2>
<p class="l-text">5 in-context örnek eklemek tipik olarak MMLU doğruluğunu 0-shot üstüne 5-15 puan kaldırır. Harness eğimi görmek için shot sayısını süpürmene izin verir. Yapmaya değer — bazen 5-shot'ta kafa-kafaya kaybeden bir model 0-shot'ta kazanır, ki son kullanıcının gerçekten gördüğü budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Few-shot kaldırmayı simüle et: her shot azalan getiri katkısı yapar</span>
<span class="kw">def</span> <span class="fn">simulated_accuracy</span>(model_skill, n_shots, ceiling=<span class="num">0.92</span>):
    <span class="str">"""Basit model: doğruluk = base + lift_per_shot * (1 - decay^n)"""</span>
    base = model_skill * <span class="num">0.6</span>
    lift = (ceiling - base) * (<span class="num">1</span> - <span class="num">0.7</span>**n_shots)
    noise = <span class="num">0.01</span> * rng.<span class="fn">standard_normal</span>()
    <span class="kw">return</span> <span class="fn">float</span>(np.<span class="fn">clip</span>(base + lift + noise, <span class="num">0</span>, <span class="num">1</span>))

shots = [<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">25</span>]
<span class="fn">print</span>(f<span class="str">"{'shots':&gt;6} | {'zayıf (0.5)':&gt;10} | {'güçlü (0.9)':&gt;12}"</span>)
<span class="kw">for</span> n <span class="kw">in</span> shots:
    weak   = <span class="fn">simulated_accuracy</span>(<span class="num">0.5</span>, n)
    strong = <span class="fn">simulated_accuracy</span>(<span class="num">0.9</span>, n)
    <span class="fn">print</span>(f<span class="str">"{n:&gt;6} | {weak:&gt;10.3f} | {strong:&gt;12.3f}"</span>)

<span class="cm"># İçgörü: 0-shot'ta modeller arası fark en büyük; 25-shot'ta neredeyse yok olabilir</span>
<span class="cm"># çünkü her ikisi de görev tavanına karşı doygunlaşır.</span>
</code></pre></div>

<p class="l-text"><strong>Bu simülasyon few-shot dinamiklerini nasıl yakalıyor:</strong> <code>simulated_accuracy</code> yardımcısı bir taban skor (model_skill * 0.6) ve shot sayısıyla görev tavanına üstel yaklaşan bir kaldırma kullanır — MMLU'da gerçekte gördüğünün stilize ama sadık bir modeli. "Zayıf" (skill 0.5) ve "güçlü" (skill 0.9) bir modeli aynı tabloda N=0,1,5,25 için süpürürüz. Çıkarım rakamlarda görünür: 0-shot'ta modeller arası fark en büyük, 25-shot'ta küçülür çünkü her ikisi de tavana karşı doygunlaşır — iki modeli farklı shot sayılarında karşılaştıramamanın nedeni de budur.</p>


<div class="calc-highlight">Modelleri karşılaştırırken her zaman shot sayısını belirt. "Llama, Mistral'ı MMLU 5-shot'ta 3 puan yener" 0-shot'ta "1 puan kaybeder"e dönebilir — son kullanıcı chatbot kalitesi için daha çok önemli olabilecek bir fark.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Önyargı &amp; Güvenlik Değerlendirmeleri</h2>
<p class="l-text">MMLU gibi yetenek benchmark'ları, modelin stereotipli ya da zararlı çıktılar üretip üretmediği hakkında hiçbir şey söylemez. Ayrı bir değerlendirme ailesi bunu hedefler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BBQ</div><div class="card-body">Sosyal önyargı tuzaklarıyla soru-cevap. Bağlam belirsizken modelin stereotipli seçeneği seçip seçmediğini ölçer.</div></div>
<div class="calc-card"><div class="card-title">BOLD</div><div class="card-body">Demografilerle ilgili açık uçlu üretim prompt'ları; üretimlerin duygu/saygısı bir sınıflandırıcıyla puanlanır.</div></div>
<div class="calc-card"><div class="card-title">CrowS-Pairs</div><div class="card-body">Bir stereotip boyutunda (ırk, cinsiyet) farklılaşan cümle çiftleri. Modelin hangisine daha yüksek olasılık atadığını ölçer.</div></div>
<div class="calc-card"><div class="card-title">RealToxicityPrompts</div><div class="card-body">Toksisite seviyelerini kapsayan ~100k prompt; devam toksisitesini Perspective API ile ölçer.</div></div>
<div class="calc-card"><div class="card-title">XSTest</div><div class="card-body">Aşırı reddi prob eder: model yüzeysel olarak güvensiz görünen masum sorguları reddeder mi?</div></div>
<div class="calc-card"><div class="card-title">HELM</div><div class="card-body">Stanford'dan Holistic Evaluation of Language Models — yetenek, önyargı, sağlamlık, kalibrasyon arasında 16 metrik paketler.</div></div>
</div>

<p class="l-text">Yaygın bir başarısızlık modu: yalnızca yetenek benchmark'larında optimize etmek modeli daha yüksek MMLU'ya ve sessizce daha kötü BBQ'ya iter. İkisini de izle. Harness aynı CLI çalıştırmasında önyargı değerlendirmelerini destekler.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Kontaminasyon &amp; Leaderboard'ları Şüpheyle Okuma</h2>
<p class="l-text">Bugün değerlendirmedeki en zor problem: <strong>eğitim verisi kontaminasyonu</strong>. Önceden eğitim derlemen kazara MMLU sorularını içeriyorsa (ve çoğu içerir — açık webdedirler), değerlendirmen yeteneği değil ezberi ölçer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N-gram örtüşmesi</div><div class="card-body">Değerlendirme kümesi ile eğitim derlemi arasında tam 13-gram eşleşmelerini say. GPT-3'ten beri standart. Hızlı ama gürültülü.</div></div>
<div class="calc-card"><div class="card-title">Held-out bölmeler</div><div class="card-body">Yeni benchmark'lar (MMLU-Pro, GPQA, MATH-Hard) tahminleri gönderdiğin özel test kümesiyle gelir.</div></div>
<div class="calc-card"><div class="card-title">Pertürbasyonla tespit</div><div class="card-body">Bir model orijinal ifadede tam doğruysa ama paraphrase'lerde başarısızsa, ezberden şüphelen.</div></div>
<div class="calc-card"><div class="card-title">Zaman-versiyonlu değerlendirmeler</div><div class="card-body">LiveBench / SWE-Bench-Verified her ay yeni problemler çevirir. Açık değerlendirme için tek gerçek savunma.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Oyuncak kontaminasyon kontrolü: bir değerlendirme sorusu ile "eğitim derlemi" arasında 13-gram örtüşme</span>
<span class="kw">def</span> <span class="fn">ngrams</span>(text, n=<span class="num">13</span>):
    tokens = text.<span class="fn">lower</span>().<span class="fn">split</span>()
    <span class="kw">return</span> {<span class="fn">tuple</span>(tokens[i:i+n]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(tokens) - n + <span class="num">1</span>)}

corpus = <span class="str">" "</span>.<span class="fn">join</span>([
    <span class="str">"The capital of France is Paris."</span>,
    <span class="str">"Photosynthesis converts light energy into chemical energy in plants."</span>,
    <span class="str">"The Pythagorean theorem states a squared plus b squared equals c squared."</span>,
] * <span class="num">100</span>)

eval_questions = [
    <span class="str">"What is the capital of France?"</span>,                                      <span class="cm"># muhtemelen görüldü</span>
    <span class="str">"The Pythagorean theorem states a squared plus b squared equals c squared."</span>,  <span class="cm"># corpus'ta birebir!</span>
    <span class="str">"Explain how a transformer encoder layer differs from a decoder."</span>,     <span class="cm"># corpus'ta yok</span>
]

corpus_ngrams = <span class="fn">ngrams</span>(corpus, n=<span class="num">5</span>)
<span class="kw">for</span> q <span class="kw">in</span> eval_questions:
    overlap = <span class="fn">ngrams</span>(q, n=<span class="num">5</span>) &amp; corpus_ngrams
    flag = <span class="str">"KONTAMİNE"</span> <span class="kw">if</span> overlap <span class="kw">else</span> <span class="str">"temiz"</span>
    <span class="fn">print</span>(f<span class="str">"{flag:13s}  | {q[:60]}  ({len(overlap)} eşleşen 5-gram)"</span>)
</code></pre></div>

<p class="l-text">Çıkarım: tek bir benchmark rakamı bir başlangıç noktasıdır, bir hüküm değil. Leaderboard'ları kendi-bildirimli klinik-deneme sonucunu okurken duyacağın aynı şüpheyle oku. Harness, şüpheyi üretken kılan araçtır — açık ekosistemde elma ile elmayı karşılaştırmanın tek yoludur.</p>
</div>
`
};
