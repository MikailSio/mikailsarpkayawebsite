window.CAUSAL_L6 = {
en: `<p class="l-text">When a sentiment classifier rates "She is a doctor" lower than "He is a doctor," is the gender word <em>causing</em> the difference, or is it correlated with topic, length, or training-set base rate? This is exactly the difference between observation and intervention from Lesson 1, applied to language models. Gender, race, age — sensitive attributes — are entangled in text with everything else. Standard fairness audits report group disparities; <strong>causal</strong> audits ask: <em>if we changed only the sensitive token, would the prediction change?</em></p>
<p class="l-text">This capstone builds a complete causal-fairness pipeline on real text. We measure <strong>counterfactual token effects</strong> with do-style interventions on a logistic-regression sentiment classifier, identify biased lexical pathways, generate <em>counterfactually augmented</em> training data (Kaushik 2020), and re-train a debiased model. The same techniques scale to BERT and modern LLMs (Vig et al. 2020 — Causal Mediation Analysis on Transformers).</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN — CAUSAL CAPSTONE</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why standard fairness audits miss causal bias</li>
<li>Counterfactual token swap (CTS) — the do-operator on text</li>
<li>Building a causal-fairness pipeline with sklearn + tweets/reviews data</li>
<li>Counterfactually Augmented Data (CAD, Kaushik 2020) for debiased fine-tuning</li>
<li>Causal Mediation Analysis for Transformers (Vig 2020) — a sketch</li>
<li>Reporting causal bias metrics in model cards (Mitchell 2019)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Problem with Observational Bias Metrics</h2>
<p class="l-text">A classifier scores "She is a nurse" higher than "He is a nurse" on a "professional" label. Is the model biased? Standard audits compute P(ŷ=1 | gender=female) − P(ŷ=1 | gender=male) over a corpus. But this conflates: model bias, sampling bias of the corpus, real correlation in language, topic confounding. We need an <em>intervention</em>.</p>
<div class="katex-block">$$\\text{Causal Bias} = E[\\hat{Y}(\\text{do}(g{=}f)) - \\hat{Y}(\\text{do}(g{=}m))]$$</div>
<p class="l-text">If we intervene on <em>only</em> the gender token, holding everything else fixed, and the prediction changes, that is causal model bias by construction.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Build a Sentiment Classifier on Real Text</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># df_reviews has columns: text, sentiment (0/1)</span>
df = df_reviews.<span class="fn">copy</span>()
<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">3</span>))
<span class="fn">print</span>(f<span class="str">"\\nShape: {df.shape}, sentiment balance: {df['sentiment'].mean():.2f}"</span>)

X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(df[<span class="str">'text'</span>], df[<span class="str">'sentiment'</span>],
    test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=df[<span class="str">'sentiment'</span>])

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv_tr = vec.<span class="fn">fit_transform</span>(X_tr); Xv_te = vec.<span class="fn">transform</span>(X_te)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>, C=<span class="num">1.0</span>).<span class="fn">fit</span>(Xv_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {clf.score(Xv_te, y_te):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads <code>df_reviews</code> (columns <code>text</code> and binary <code>sentiment</code>) and prints its shape and label balance. 2) stratified-splits the texts 75/25 into train and test sets. 3) fits a <code>TfidfVectorizer</code> with unigrams+bigrams (<code>max_features=2000</code>, <code>min_df=2</code>) on the training texts only, transforms both splits, trains a <code>LogisticRegression</code> on the TF-IDF features, and prints test accuracy as a baseline before any fairness analysis.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Counterfactual Token Swap (CTS) — The do-Operator on Text</h2>
<p class="l-text">For each test sentence, build pairs by swapping a sensitive token (he ↔ she, his ↔ her). The pair differs in exactly one variable; everything else (topic, length, syntax) is identical by construction.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]

<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="str">"""Swap gender tokens; preserves casing of first letter."""</span>
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

<span class="cm"># Demo</span>
demo = <span class="str">"He is a brilliant doctor and his patients adore him."</span>
<span class="fn">print</span>(<span class="str">"Original   :"</span>, demo)
<span class="fn">print</span>(<span class="str">"Swap m-&gt;f  :"</span>, <span class="fn">swap_gender</span>(demo, <span class="str">'m2f'</span>))
<span class="fn">print</span>(<span class="str">"Round trip :"</span>, <span class="fn">swap_gender</span>(<span class="fn">swap_gender</span>(demo, <span class="str">'m2f'</span>), <span class="str">'f2m'</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) hard-codes a <code>PAIRS</code> list of gendered token pairs (he/she, his/her, man/woman, ...). 2) defines <code>swap_gender(text, direction)</code> that builds a case-insensitive regex over the union of pair tokens and uses <code>re.sub</code> with a replacer that preserves the original capitalization. 3) demonstrates the operator on the sentence "He is a brilliant doctor and his patients adore him." — printing the original, the m→f swap, and the round-trip back to m so you can verify it is invertible.</p>
<p class="l-text">This is our <code>do(gender)</code> operator on text — a clean intervention that preserves the rest of the sentence.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Measure Causal Bias on the Classifier</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]
<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

<span class="cm"># Counterfactual: swap gender in every text and re-predict</span>
texts = df[<span class="str">'text'</span>].<span class="fn">tolist</span>()
texts_cf = [<span class="fn">swap_gender</span>(t, <span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> texts]
texts_cb = [<span class="fn">swap_gender</span>(t, <span class="str">'f2m'</span>) <span class="kw">for</span> t <span class="kw">in</span> texts]

p_orig = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts))[:,<span class="num">1</span>]
p_cf   = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts_cf))[:,<span class="num">1</span>]
p_cb   = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts_cb))[:,<span class="num">1</span>]

<span class="cm"># Causal bias = E[p(swap) - p(orig)]</span>
cb_m2f = (p_cf - p_orig).<span class="fn">mean</span>()
cb_f2m = (p_cb - p_orig).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Causal bias do(male-&gt;female): {cb_m2f:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Causal bias do(female-&gt;male): {cb_f2m:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Per-sample max abs flip:      {np.abs(p_cf-p_orig).max():.4f}"</span>)

<span class="cm"># Texts with biggest causal swing</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
flips = pd.<span class="fn">DataFrame</span>({<span class="str">'orig'</span>:texts, <span class="str">'p_orig'</span>:p_orig, <span class="str">'p_swap'</span>:p_cf,
                      <span class="str">'delta'</span>:p_cf-p_orig}).<span class="fn">nlargest</span>(<span class="num">5</span>, <span class="str">'delta'</span>)
<span class="fn">print</span>(<span class="str">"\\nTop 5 sentences where swapping gender most increased predicted positivity:"</span>)
<span class="kw">for</span> _, r <span class="kw">in</span> flips.<span class="fn">iterrows</span>():
    <span class="fn">print</span>(f<span class="str">"  +{r['delta']:.3f}: {r['orig'][:80]}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains the TF-IDF + logistic sentiment model on the full review set and generates two counterfactual corpora: one swapping every male token to female (<code>texts_cf</code>) and one swapping female to male (<code>texts_cb</code>). 2) gets predicted positive probabilities <code>p_orig</code>, <code>p_cf</code>, <code>p_cb</code> with the same vectorizer, then averages the per-sample differences to report the do(m→f) and do(f→m) causal bias and the maximum per-sample flip. 3) builds a pandas table of (original text, p_orig, p_swap, delta) and prints the top-5 sentences whose predicted positivity rose the most when gender was swapped — the worst-offender list.</p>
<p class="l-text">If <code>cb_m2f</code> is non-zero, the classifier responds to gender per se, not to its real correlates. This is exactly the do-operator definition of bias.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Counterfactually Augmented Data (CAD)</h2>
<p class="l-text">Kaushik, Hovy &amp; Lipton (2020) — "Learning the Difference that Makes a Difference with Counterfactually-Augmented Data". The fix: for every training example, also include its gender-swapped counterpart with the same label. The model can no longer use gender words as a shortcut, because both versions point to the same y.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]
<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()

<span class="cm"># Augment: pair every text with its gender-swapped version, same label</span>
aug_texts = <span class="fn">list</span>(df[<span class="str">'text'</span>]) + [<span class="fn">swap_gender</span>(t,<span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]] \\
                              + [<span class="fn">swap_gender</span>(t,<span class="str">'f2m'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]
aug_labels = <span class="fn">list</span>(df[<span class="str">'sentiment'</span>])*<span class="num">3</span>

vec_aug = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv_aug = vec_aug.<span class="fn">fit_transform</span>(aug_texts)
clf_aug = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv_aug, aug_labels)

<span class="cm"># Re-measure causal bias on the debiased model</span>
p1 = clf_aug.<span class="fn">predict_proba</span>(vec_aug.<span class="fn">transform</span>(df[<span class="str">'text'</span>]))[:,<span class="num">1</span>]
p2 = clf_aug.<span class="fn">predict_proba</span>(vec_aug.<span class="fn">transform</span>([<span class="fn">swap_gender</span>(t,<span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]))[:,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Debiased model causal bias do(m-&gt;f): {(p2-p1).mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Debiased model max per-sample flip: {np.abs(p2-p1).max():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) triples the training set by concatenating the original texts with both their m→f and f→m gender-swapped versions, all keeping the same sentiment label. 2) refits a fresh <code>TfidfVectorizer</code> and <code>LogisticRegression</code> on the augmented data so the model sees every sentence in both gender variants for the same target. 3) re-runs the counterfactual evaluation: predicts probabilities on the original texts and on their m→f swaps, then prints the new mean causal bias and the new per-sample max flip — both should be dramatically smaller than the baseline.</p>
<p class="l-text">After CAD training, both bias metrics should drop sharply. The model learned to ignore gender tokens because they were no longer predictive after augmentation.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Identifying Biased Pathways</h2>
<p class="l-text">Linear models are interpretable: examine which features fire for gender tokens vs. label. Compare original-model and debiased-model coefficients on the gender pair tokens.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

words = vec.<span class="fn">get_feature_names_out</span>()
coefs = clf.coef_[<span class="num">0</span>]
gender_words = [<span class="str">'he'</span>,<span class="str">'she'</span>,<span class="str">'him'</span>,<span class="str">'her'</span>,<span class="str">'his'</span>,<span class="str">'man'</span>,<span class="str">'woman'</span>,<span class="str">'men'</span>,<span class="str">'women'</span>,
                <span class="str">'father'</span>,<span class="str">'mother'</span>,<span class="str">'boy'</span>,<span class="str">'girl'</span>]

<span class="fn">print</span>(f<span class="str">"{'token':12s}  coef"</span>)
<span class="fn">print</span>(<span class="str">"-"</span>*<span class="num">22</span>)
<span class="kw">for</span> w <span class="kw">in</span> gender_words:
    <span class="kw">if</span> w <span class="kw">in</span> words:
        i = <span class="fn">list</span>(words).<span class="fn">index</span>(w)
        <span class="fn">print</span>(f<span class="str">"{w:12s}  {coefs[i]:+.4f}"</span>)

<span class="cm"># Asymmetric coefficients on synonyms reveal bias pathways</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) refits the TF-IDF + logistic model on the original review data and pulls the vocabulary array via <code>vec.get_feature_names_out()</code> along with the per-token weight vector <code>clf.coef_[0]</code>. 2) iterates over a short list of gendered tokens (he/she/him/her/his/man/woman/...) and, when the token exists in the vocabulary, looks up its index and prints its signed coefficient. 3) the printed table exposes which gender words pull the prediction up and which pull it down — asymmetric pairs are direct evidence of a learned bias shortcut.</p>
<p class="l-text">If "he" and "she" carry differently-signed coefficients despite being grammatically symmetric, the model has learned a bias shortcut. CAD shrinks both toward zero.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Causal Mediation Analysis for Transformers</h2>
<p class="l-text">Vig, Gehrmann, Belinkov et al. (2020) — "Investigating Gender Bias in Language Models Using Causal Mediation Analysis". They treat each attention head as a mediator on the path from gender token to prediction. Total bias = direct effect + indirect (mediated) effect.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Total Effect (TE)</div><div class="card-body">Change in prediction when gender token is intervened on, end-to-end.</div></div>
<div class="calc-card"><div class="card-title">Natural Direct Effect (NDE)</div><div class="card-body">Effect that bypasses a particular head — head's activation held at "natural" value.</div></div>
<div class="calc-card"><div class="card-title">Natural Indirect Effect (NIE)</div><div class="card-body">Effect mediated through that head only. Localizes bias to specific neurons.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (transformers not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM
<span class="kw">import</span> torch

<span class="cm"># Pseudocode for causal mediation on a transformer</span>
<span class="cm"># 1. Forward pass with original gender; record all attention activations</span>
<span class="cm"># 2. Forward pass with swapped gender; record activations</span>
<span class="cm"># 3. Counterfactual run: swap gender at INPUT, but PATCH activation of head h</span>
<span class="cm">#    back to the original. The remaining change in output = effect NOT mediated by h.</span>
<span class="cm"># 4. NIE_h = TE - NDE_h</span>
<span class="cm"># Heads with high NIE are the causal carriers of bias.</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) imports the HuggingFace transformer pieces but only as setup for a pseudocode sketch — the heavy ML cannot run in pyodide. 2) the commented protocol describes the activation-patching procedure: forward once with the original gender to cache every head's activations, forward again with the swapped gender, then run a third counterfactual pass that swaps the input but <em>patches</em> head <em>h</em>'s activation back to the original. 3) the residual output change is the natural direct effect bypassing head <em>h</em>, so the natural indirect effect is <em>NIE_h = TE − NDE_h</em>; heads with large NIE are the ones causally carrying the bias.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Reporting Causal Bias in a Model Card</h2>
<p class="l-text">Mitchell et al. (2019) introduced model cards as standardized documentation. A causal-aware model card adds:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Causal Bias Estimate</div><div class="card-body">Mean Δ prediction under counterfactual sensitive-attribute swap, with 95% CI.</div></div>
<div class="calc-card"><div class="card-title">Per-Subgroup CATE</div><div class="card-body">CATE of the swap by topic / domain / length bucket — bias may concentrate in subpopulations.</div></div>
<div class="calc-card"><div class="card-title">Lexical Pathway Audit</div><div class="card-body">Top-k tokens whose causal contribution to bias exceeds threshold τ.</div></div>
<div class="calc-card"><div class="card-title">Mitigation Applied</div><div class="card-body">CAD ratio, regularization, debiasing layer; report pre/post numbers.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd, re
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>)]
<span class="kw">def</span> <span class="fn">swap</span>(text):
    <span class="kw">def</span> <span class="fn">rep</span>(m):
        w = m.<span class="fn">group</span>(<span class="num">0</span>).<span class="fn">lower</span>()
        <span class="kw">for</span> a,b <span class="kw">in</span> PAIRS:
            <span class="kw">if</span> w==a: <span class="kw">return</span> b
            <span class="kw">if</span> w==b: <span class="kw">return</span> a
        <span class="kw">return</span> m.<span class="fn">group</span>(<span class="num">0</span>)
    <span class="kw">return</span> re.<span class="fn">sub</span>(r<span class="str">'\\b('</span>+<span class="str">'|'</span>.<span class="fn">join</span>({w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p})+r<span class="str">')\\b'</span>, rep, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

p_orig = clf.<span class="fn">predict_proba</span>(Xv)[:,<span class="num">1</span>]
p_swap = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>([<span class="fn">swap</span>(t) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]))[:,<span class="num">1</span>]
delta = p_swap - p_orig

<span class="cm"># Bootstrap CI for causal bias</span>
B = <span class="num">200</span>; rng = np.random.<span class="fn">RandomState</span>(<span class="num">0</span>); n = <span class="fn">len</span>(delta)
boots = np.<span class="fn">array</span>([delta[rng.<span class="fn">choice</span>(n, n, replace=<span class="kw">True</span>)].<span class="fn">mean</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(B)])
<span class="fn">print</span>(<span class="str">"=== MODEL CARD (Causal Fairness Section) ==="</span>)
<span class="fn">print</span>(f<span class="str">"Causal bias (mean Δ on gender swap): {delta.mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"95% bootstrap CI: [{np.quantile(boots,0.025):+.4f}, {np.quantile(boots,0.975):+.4f}]"</span>)
<span class="fn">print</span>(f<span class="str">"Fraction of inputs with |Δ|&gt;0.05: {(np.abs(delta)&gt;0.05).mean():.2%}"</span>)
<span class="fn">print</span>(f<span class="str">"Max |Δ|: {np.abs(delta).max():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains the TF-IDF + logistic sentiment model and computes the per-sample gender-swap delta <code>delta = p_swap − p_orig</code>. 2) runs a 200-iteration bootstrap: each iteration resamples the deltas with replacement and stores the resampled mean, giving an empirical sampling distribution for the causal bias. 3) prints a model-card-ready block: the mean causal bias, its 2.5%/97.5% bootstrap percentile interval, the fraction of inputs with <code>|Δ| &gt; 0.05</code>, and the maximum absolute flip.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Where to Go Next</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Next steps: (1) extend CTS to race, age, religion using calibrated swap dictionaries; (2) replace logistic regression with BERT and run causal mediation per-layer (Vig 2020); (3) combine with Lesson 5 DML to estimate <em>heterogeneous</em> causal bias by demographic subgroup; (4) push debiasing to the embedding layer (Bolukbasi 2016 — "Man is to Computer Programmer as Woman is to Homemaker"). Fairness Lesson 1 starts the parallel track on observational fairness metrics.</div>
<p class="l-text">Reading: Kaushik, Hovy &amp; Lipton (2020) ICLR; Vig et al. (2020) NeurIPS; Bolukbasi et al. (2016) NeurIPS; Mitchell et al. (2019) FAT*; Pearl &amp; Mackenzie, <em>The Book of Why</em>, ch. 8-9 on counterfactuals.</p>
</div>`,
tr: `<p class="l-text">Bir duygu sınıflandırıcısı "She is a doctor"ı "He is a doctor"dan daha düşük puanladığında, cinsiyet kelimesi farkın <em>nedeni</em> midir, yoksa konu, uzunluk veya eğitim setinin temel oranıyla mı korelasyonludur? Bu, Ders 1'deki gözlem ile müdahale arasındaki tam farktır, dil modellerine uygulanmıştır. Cinsiyet, ırk, yaş — hassas özellikler — metinde her şeyle iç içe geçmiştir. Standart adalet denetimleri grup eşitsizliklerini bildirir; <strong>nedensel</strong> denetimler şunu sorar: <em>yalnızca hassas tokeni değiştirsek, tahmin değişir miydi?</em></p>
<p class="l-text">Bu capstone, gerçek metin üzerinde tam bir nedensel-adalet pipeline'ı kurar. Bir lojistik regresyon duygu sınıflandırıcısı üzerinde do-tarzı müdahalelerle <strong>karşı-olgu token etkilerini</strong> ölçeriz, yanlı sözcüksel yolları tanımlarız, <em>karşı-olgusal olarak güçlendirilmiş</em> eğitim verisi üretiriz (Kaushik 2020) ve yanlılığı giderilmiş bir model yeniden eğitiriz. Aynı teknikler BERT'e ve modern LLM'lere ölçeklenir (Vig ve ark. 2020 — Transformer'lar üzerinde Nedensel Aracılık Analizi).</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN — NEDENSEL CAPSTONE</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Standart adalet denetimlerinin nedensel yanlılığı neden kaçırdığı</li>
<li>Karşı-olgu token değişimi (CTS) — metin üzerinde do-operatörü</li>
<li>sklearn + tweets/reviews verisi ile nedensel-adalet pipeline'ı kurma</li>
<li>Karşı-Olgusal Olarak Güçlendirilmiş Veri (CAD, Kaushik 2020) ile yanlılığı giderilmiş ince ayar</li>
<li>Transformer'lar için Nedensel Aracılık Analizi (Vig 2020) — bir taslak</li>
<li>Model kartlarında nedensel yanlılık metriklerini bildirme (Mitchell 2019)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Gözlemsel Yanlılık Metriklerinin Sorunu</h2>
<p class="l-text">Bir sınıflandırıcı "She is a nurse"ı "He is a nurse"dan daha yüksek bir "profesyonel" etiketinde puanlar. Model yanlı mı? Standart denetimler bir korpus üzerinden P(ŷ=1 | cinsiyet=kadın) − P(ŷ=1 | cinsiyet=erkek) hesaplar. Ama bu şunları karıştırır: model yanlılığı, korpusun örnekleme yanlılığı, dildeki gerçek korelasyon, konu karışımı. Bir <em>müdahaleye</em> ihtiyacımız var.</p>
<div class="katex-block">$$\\text{Causal Bias} = E[\\hat{Y}(\\text{do}(g{=}f)) - \\hat{Y}(\\text{do}(g{=}m))]$$</div>
<p class="l-text">Yalnızca cinsiyet tokenine müdahale edersek, diğer her şeyi sabit tutarsak ve tahmin değişirse, bu yapı gereği nedensel model yanlılığıdır.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Gerçek Metin Üzerinde Bir Duygu Sınıflandırıcısı Kur</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># df_reviews has columns: text, sentiment (0/1)</span>
df = df_reviews.<span class="fn">copy</span>()
<span class="fn">print</span>(df.<span class="fn">head</span>(<span class="num">3</span>))
<span class="fn">print</span>(f<span class="str">"\\nShape: {df.shape}, sentiment balance: {df['sentiment'].mean():.2f}"</span>)

X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(df[<span class="str">'text'</span>], df[<span class="str">'sentiment'</span>],
    test_size=<span class="num">0.25</span>, random_state=<span class="num">0</span>, stratify=df[<span class="str">'sentiment'</span>])

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv_tr = vec.<span class="fn">fit_transform</span>(X_tr); Xv_te = vec.<span class="fn">transform</span>(X_te)

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>, C=<span class="num">1.0</span>).<span class="fn">fit</span>(Xv_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {clf.score(Xv_te, y_te):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>df_reviews</code>'u (kolonlar <code>text</code> ve ikili <code>sentiment</code>) yüklüyor, şeklini ve etiket dengesini yazdırıyor. 2) metinleri tabakalı şekilde 75/25 eğitim ve test setlerine bölüyor. 3) yalnızca eğitim metinleri üzerinde unigram+bigramlı bir <code>TfidfVectorizer</code> (<code>max_features=2000</code>, <code>min_df=2</code>) fit ediyor, iki bölmeyi de dönüştürüp TF-IDF özellikleri üzerinde bir <code>LogisticRegression</code> eğitiyor ve adalet analizinden önceki temel olarak test doğruluğunu yazdırıyor.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Karşı-Olgu Token Değişimi (CTS) — Metin Üzerinde do-Operatörü</h2>
<p class="l-text">Her test cümlesi için, hassas bir tokeni değiştirerek (he ↔ she, his ↔ her) çiftler oluşturun. Çift tam olarak bir değişkende farklılık gösterir; diğer her şey (konu, uzunluk, sözdizimi) yapı gereği aynıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]

<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="str">"""Swap gender tokens; preserves casing of first letter."""</span>
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

<span class="cm"># Demo</span>
demo = <span class="str">"He is a brilliant doctor and his patients adore him."</span>
<span class="fn">print</span>(<span class="str">"Original   :"</span>, demo)
<span class="fn">print</span>(<span class="str">"Swap m-&gt;f  :"</span>, <span class="fn">swap_gender</span>(demo, <span class="str">'m2f'</span>))
<span class="fn">print</span>(<span class="str">"Round trip :"</span>, <span class="fn">swap_gender</span>(<span class="fn">swap_gender</span>(demo, <span class="str">'m2f'</span>), <span class="str">'f2m'</span>))
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) cinsiyet ifadeli token çiftlerinden oluşan bir <code>PAIRS</code> listesi sabitleniyor (he/she, his/her, man/woman, ...). 2) <code>swap_gender(text, direction)</code> tanımlanıyor; çift tokenlerinin birleşimini kapsayan büyük/küçük-harf duyarsız bir regex inşa ediyor ve orijinal kapital harfini koruyan bir değiştiriciyle <code>re.sub</code> uyguluyor. 3) operatör "He is a brilliant doctor and his patients adore him." cümlesi üzerinde gösteriliyor — orijinal, m→f değişimi ve geri çevirme yazdırılarak fonksiyonun tersinir olduğu doğrulanıyor.</p>
<p class="l-text">Bu, metin üzerindeki <code>do(cinsiyet)</code> operatörümüz — cümlenin geri kalanını koruyan temiz bir müdahale.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Sınıflandırıcı Üzerinde Nedensel Yanlılığı Ölç</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]
<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

<span class="cm"># Counterfactual: swap gender in every text and re-predict</span>
texts = df[<span class="str">'text'</span>].<span class="fn">tolist</span>()
texts_cf = [<span class="fn">swap_gender</span>(t, <span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> texts]
texts_cb = [<span class="fn">swap_gender</span>(t, <span class="str">'f2m'</span>) <span class="kw">for</span> t <span class="kw">in</span> texts]

p_orig = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts))[:,<span class="num">1</span>]
p_cf   = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts_cf))[:,<span class="num">1</span>]
p_cb   = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>(texts_cb))[:,<span class="num">1</span>]

<span class="cm"># Causal bias = E[p(swap) - p(orig)]</span>
cb_m2f = (p_cf - p_orig).<span class="fn">mean</span>()
cb_f2m = (p_cb - p_orig).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Causal bias do(male-&gt;female): {cb_m2f:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Causal bias do(female-&gt;male): {cb_f2m:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Per-sample max abs flip:      {np.abs(p_cf-p_orig).max():.4f}"</span>)

<span class="cm"># Texts with biggest causal swing</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
flips = pd.<span class="fn">DataFrame</span>({<span class="str">'orig'</span>:texts, <span class="str">'p_orig'</span>:p_orig, <span class="str">'p_swap'</span>:p_cf,
                      <span class="str">'delta'</span>:p_cf-p_orig}).<span class="fn">nlargest</span>(<span class="num">5</span>, <span class="str">'delta'</span>)
<span class="fn">print</span>(<span class="str">"\\nTop 5 sentences where swapping gender most increased predicted positivity:"</span>)
<span class="kw">for</span> _, r <span class="kw">in</span> flips.<span class="fn">iterrows</span>():
    <span class="fn">print</span>(f<span class="str">"  +{r['delta']:.3f}: {r['orig'][:80]}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) TF-IDF + lojistik duygu modeli tüm yorum seti üzerinde eğitiliyor ve iki karşı-olgu korpusu üretiliyor: her erkek tokenini kadın'a çeviren <code>texts_cf</code> ve kadın'ı erkek'e çeviren <code>texts_cb</code>. 2) aynı vektörleyiciyle <code>p_orig</code>, <code>p_cf</code> ve <code>p_cb</code> pozitif sınıf olasılıkları alınıyor, satır-bazlı farkların ortalaması do(m→f) ve do(f→m) nedensel yanlılığı ile satır-başı maksimum sapma olarak yazdırılıyor. 3) (orijinal metin, p_orig, p_swap, delta) için bir pandas tablosu kurulup cinsiyet değişiminden sonra tahmin edilen pozitifliği en çok artan ilk 5 cümle yazdırılıyor — en kötü-örnek listesi.</p>
<p class="l-text">Eğer <code>cb_m2f</code> sıfırdan farklıysa, sınıflandırıcı cinsiyetin kendisine yanıt veriyor, gerçek korelasyonlarına değil. Bu, yanlılığın do-operatörü tanımının tam olarak kendisidir.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Karşı-Olgusal Olarak Güçlendirilmiş Veri (CAD)</h2>
<p class="l-text">Kaushik, Hovy &amp; Lipton (2020) — "Karşı-Olgusal Olarak Güçlendirilmiş Veri ile Fark Yapan Farkı Öğrenmek". Çözüm: her eğitim örneği için, aynı etiketle birlikte cinsiyet-değiştirilmiş muadilini de dahil et. Model artık cinsiyet kelimelerini bir kestirme olarak kullanamaz, çünkü her iki versiyon da aynı y'ye işaret ediyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'himself'</span>,<span class="str">'herself'</span>),
         (<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'men'</span>,<span class="str">'women'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>),(<span class="str">'son'</span>,<span class="str">'daughter'</span>),
         (<span class="str">'boy'</span>,<span class="str">'girl'</span>),(<span class="str">'male'</span>,<span class="str">'female'</span>)]
<span class="kw">def</span> <span class="fn">swap_gender</span>(text, direction=<span class="str">'m2f'</span>):
    <span class="kw">def</span> <span class="fn">replace</span>(m):
        word = m.<span class="fn">group</span>(<span class="num">0</span>); lower = word.<span class="fn">lower</span>()
        <span class="kw">for</span> a, b <span class="kw">in</span> PAIRS:
            src, tgt = (a, b) <span class="kw">if</span> direction == <span class="str">'m2f'</span> <span class="kw">else</span> (b, a)
            <span class="kw">if</span> lower == src:
                <span class="kw">return</span> tgt.<span class="fn">capitalize</span>() <span class="kw">if</span> word[<span class="num">0</span>].<span class="fn">isupper</span>() <span class="kw">else</span> tgt
        <span class="kw">return</span> word
    pattern = r<span class="str">'\\b('</span> + <span class="str">'|'</span>.<span class="fn">join</span>(<span class="fn">set</span>([w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p])) + r<span class="str">')\\b'</span>
    <span class="kw">return</span> re.<span class="fn">sub</span>(pattern, replace, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()

<span class="cm"># Augment: pair every text with its gender-swapped version, same label</span>
aug_texts = <span class="fn">list</span>(df[<span class="str">'text'</span>]) + [<span class="fn">swap_gender</span>(t,<span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]] \\
                              + [<span class="fn">swap_gender</span>(t,<span class="str">'f2m'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]
aug_labels = <span class="fn">list</span>(df[<span class="str">'sentiment'</span>])*<span class="num">3</span>

vec_aug = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv_aug = vec_aug.<span class="fn">fit_transform</span>(aug_texts)
clf_aug = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv_aug, aug_labels)

<span class="cm"># Re-measure causal bias on the debiased model</span>
p1 = clf_aug.<span class="fn">predict_proba</span>(vec_aug.<span class="fn">transform</span>(df[<span class="str">'text'</span>]))[:,<span class="num">1</span>]
p2 = clf_aug.<span class="fn">predict_proba</span>(vec_aug.<span class="fn">transform</span>([<span class="fn">swap_gender</span>(t,<span class="str">'m2f'</span>) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]))[:,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Debiased model causal bias do(m-&gt;f): {(p2-p1).mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Debiased model max per-sample flip: {np.abs(p2-p1).max():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) eğitim setini, orijinal metinleri hem m→f hem f→m cinsiyet-değiştirilmiş versiyonlarıyla art arda ekleyerek üçe katlıyor; hepsi aynı duygu etiketini koruyor. 2) güçlendirilmiş veri üzerinde yeni bir <code>TfidfVectorizer</code> ve <code>LogisticRegression</code> fit ediyor; böylece model her cümleyi iki cinsiyet varyantıyla aynı hedef için görüyor. 3) karşı-olgu değerlendirmesini tekrarlıyor: orijinal metinler ve onların m→f değişimleri üzerinde olasılıkları tahmin ediyor, ardından yeni ortalama nedensel yanlılığı ve satır-başı maksimum sapmayı yazdırıyor — her ikisinin de temel değerden çok daha küçük olması bekleniyor.</p>
<p class="l-text">CAD eğitiminden sonra, her iki yanlılık metriği de keskin bir şekilde düşmelidir. Model, güçlendirme sonrası artık tahminsel olmadıkları için cinsiyet tokenlerini görmezden gelmeyi öğrendi.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Yanlı Yolları Tanımlamak</h2>
<p class="l-text">Doğrusal modeller yorumlanabilir: cinsiyet tokenleri vs. etiket için hangi özelliklerin tetiklendiğini incele. Cinsiyet çift tokenlerinde orijinal model ve yanlılığı giderilmiş model katsayılarını karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

words = vec.<span class="fn">get_feature_names_out</span>()
coefs = clf.coef_[<span class="num">0</span>]
gender_words = [<span class="str">'he'</span>,<span class="str">'she'</span>,<span class="str">'him'</span>,<span class="str">'her'</span>,<span class="str">'his'</span>,<span class="str">'man'</span>,<span class="str">'woman'</span>,<span class="str">'men'</span>,<span class="str">'women'</span>,
                <span class="str">'father'</span>,<span class="str">'mother'</span>,<span class="str">'boy'</span>,<span class="str">'girl'</span>]

<span class="fn">print</span>(f<span class="str">"{'token':12s}  coef"</span>)
<span class="fn">print</span>(<span class="str">"-"</span>*<span class="num">22</span>)
<span class="kw">for</span> w <span class="kw">in</span> gender_words:
    <span class="kw">if</span> w <span class="kw">in</span> words:
        i = <span class="fn">list</span>(words).<span class="fn">index</span>(w)
        <span class="fn">print</span>(f<span class="str">"{w:12s}  {coefs[i]:+.4f}"</span>)

<span class="cm"># Asymmetric coefficients on synonyms reveal bias pathways</span>
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) orijinal yorum verisi üzerinde TF-IDF + lojistik model yeniden fit ediliyor; <code>vec.get_feature_names_out()</code> ile kelime hazinesi dizisi ve <code>clf.coef_[0]</code> ile token-başına ağırlık vektörü çekiliyor. 2) kısa bir cinsiyet ifadeli token listesi (he/she/him/her/his/man/woman/...) dolaşılıyor; token kelime haznesinde varsa indeksi alınıp işaretli katsayısı yazdırılıyor. 3) yazdırılan tablo, hangi cinsiyet kelimelerinin tahmini yukarı, hangilerinin aşağı çektiğini ortaya koyuyor — asimetrik çiftler öğrenilmiş bir yanlılık kestirmesinin doğrudan kanıtı.</p>
<p class="l-text">Eğer "he" ve "she" dilbilgisel olarak simetrik olmasına rağmen farklı işaretli katsayılar taşıyorlarsa, model bir yanlılık kestirmesi öğrenmiştir. CAD her ikisini de sıfıra doğru daraltır.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Transformer'lar için Nedensel Aracılık Analizi</h2>
<p class="l-text">Vig, Gehrmann, Belinkov ve ark. (2020) — "Nedensel Aracılık Analizi Kullanarak Dil Modellerinde Cinsiyet Yanlılığını Araştırma". Her dikkat başını, cinsiyet tokeninden tahmine giden yol üzerindeki bir aracı olarak ele alıyorlar. Toplam yanlılık = doğrudan etki + dolaylı (aracılı) etki.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Toplam Etki (TE)</div><div class="card-body">Cinsiyet tokenine uçtan uca müdahale edildiğinde tahminin değişimi.</div></div>
<div class="calc-card"><div class="card-title">Doğal Doğrudan Etki (NDE)</div><div class="card-body">Belirli bir başı atlayan etki — başın aktivasyonu "doğal" değerde tutulur.</div></div>
<div class="calc-card"><div class="card-title">Doğal Dolaylı Etki (NIE)</div><div class="card-body">Yalnızca o baş aracılığıyla aracılı etki. Yanlılığı belirli nöronlara yerleştirir.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (transformers not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> transformers <span class="kw">import</span> AutoTokenizer, AutoModelForCausalLM
<span class="kw">import</span> torch

<span class="cm"># Pseudocode for causal mediation on a transformer</span>
<span class="cm"># 1. Forward pass with original gender; record all attention activations</span>
<span class="cm"># 2. Forward pass with swapped gender; record activations</span>
<span class="cm"># 3. Counterfactual run: swap gender at INPUT, but PATCH activation of head h</span>
<span class="cm">#    back to the original. The remaining change in output = effect NOT mediated by h.</span>
<span class="cm"># 4. NIE_h = TE - NDE_h</span>
<span class="cm"># Heads with high NIE are the causal carriers of bias.</span>
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) HuggingFace transformer parçaları içeri alınıyor ama yalnızca bir sözde-kod taslağının kurulumu olarak — ağır ML pyodide içinde çalışamaz. 2) yorumlardaki protokol aktivasyon-yamalama yordamını anlatıyor: orijinal cinsiyetle bir kez ileri geçiş yaparak her başın aktivasyonları kaydediliyor, değiştirilmiş cinsiyetle ikinci kez geçiş yapılıyor, sonra girdiyi değiştirip yalnızca <em>h</em> başının aktivasyonunu orijinaline geri <em>yamayan</em> üçüncü bir karşı-olgu geçişi koşuluyor. 3) artık çıktı değişimi, <em>h</em> başını atlayan doğal doğrudan etkidir, dolayısıyla doğal dolaylı etki <em>NIE_h = TE − NDE_h</em>; NIE'si yüksek başlar yanlılığı nedensel olarak taşıyan başlardır.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Bir Model Kartında Nedensel Yanlılığı Bildirmek</h2>
<p class="l-text">Mitchell ve ark. (2019) standart belgeler olarak model kartlarını tanıttı. Nedensel-farkındalıklı bir model kartı şunları ekler:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nedensel Yanlılık Tahmini</div><div class="card-body">Karşı-olgusal hassas-özellik değişimi altında ortalama Δ tahmin, %95 GA ile.</div></div>
<div class="calc-card"><div class="card-title">Alt-Grup Başına CATE</div><div class="card-body">Konu / alan / uzunluk demetine göre değişimin CATE'i — yanlılık alt-popülasyonlarda yoğunlaşabilir.</div></div>
<div class="calc-card"><div class="card-title">Sözcüksel Yol Denetimi</div><div class="card-body">Yanlılığa nedensel katkısı τ eşiğini aşan en üst-k token.</div></div>
<div class="calc-card"><div class="card-title">Uygulanan Hafifletme</div><div class="card-body">CAD oranı, düzenleme, yanlılık-giderme katmanı; öncesi/sonrası rakamları bildir.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd, re
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

PAIRS = [(<span class="str">'he'</span>,<span class="str">'she'</span>),(<span class="str">'him'</span>,<span class="str">'her'</span>),(<span class="str">'his'</span>,<span class="str">'her'</span>),(<span class="str">'man'</span>,<span class="str">'woman'</span>),(<span class="str">'father'</span>,<span class="str">'mother'</span>)]
<span class="kw">def</span> <span class="fn">swap</span>(text):
    <span class="kw">def</span> <span class="fn">rep</span>(m):
        w = m.<span class="fn">group</span>(<span class="num">0</span>).<span class="fn">lower</span>()
        <span class="kw">for</span> a,b <span class="kw">in</span> PAIRS:
            <span class="kw">if</span> w==a: <span class="kw">return</span> b
            <span class="kw">if</span> w==b: <span class="kw">return</span> a
        <span class="kw">return</span> m.<span class="fn">group</span>(<span class="num">0</span>)
    <span class="kw">return</span> re.<span class="fn">sub</span>(r<span class="str">'\\b('</span>+<span class="str">'|'</span>.<span class="fn">join</span>({w <span class="kw">for</span> p <span class="kw">in</span> PAIRS <span class="kw">for</span> w <span class="kw">in</span> p})+r<span class="str">')\\b'</span>, rep, text, flags=re.IGNORECASE)

df = df_reviews.<span class="fn">copy</span>()
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">2</span>)
Xv = vec.<span class="fn">fit_transform</span>(df[<span class="str">'text'</span>])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xv, df[<span class="str">'sentiment'</span>])

p_orig = clf.<span class="fn">predict_proba</span>(Xv)[:,<span class="num">1</span>]
p_swap = clf.<span class="fn">predict_proba</span>(vec.<span class="fn">transform</span>([<span class="fn">swap</span>(t) <span class="kw">for</span> t <span class="kw">in</span> df[<span class="str">'text'</span>]]))[:,<span class="num">1</span>]
delta = p_swap - p_orig

<span class="cm"># Bootstrap CI for causal bias</span>
B = <span class="num">200</span>; rng = np.random.<span class="fn">RandomState</span>(<span class="num">0</span>); n = <span class="fn">len</span>(delta)
boots = np.<span class="fn">array</span>([delta[rng.<span class="fn">choice</span>(n, n, replace=<span class="kw">True</span>)].<span class="fn">mean</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(B)])
<span class="fn">print</span>(<span class="str">"=== MODEL CARD (Causal Fairness Section) ==="</span>)
<span class="fn">print</span>(f<span class="str">"Causal bias (mean Δ on gender swap): {delta.mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"95% bootstrap CI: [{np.quantile(boots,0.025):+.4f}, {np.quantile(boots,0.975):+.4f}]"</span>)
<span class="fn">print</span>(f<span class="str">"Fraction of inputs with |Δ|&gt;0.05: {(np.abs(delta)&gt;0.05).mean():.2%}"</span>)
<span class="fn">print</span>(f<span class="str">"Max |Δ|: {np.abs(delta).max():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) TF-IDF + lojistik duygu modeli eğitilip satır-başı cinsiyet-değişim sapması <code>delta = p_swap − p_orig</code> hesaplanıyor. 2) 200 iterasyonluk bir bootstrap koşuyor: her iterasyon deltaları yerine koyma ile yeniden örnekleyip yeniden örneklenmiş ortalamayı saklıyor; bu, nedensel yanlılık için ampirik bir örnekleme dağılımı veriyor. 3) model kartına hazır bir blok yazdırılıyor: ortalama nedensel yanlılık, %2.5/%97.5 bootstrap yüzdelik aralığı, <code>|Δ| &gt; 0.05</code> olan girdi oranı ve maksimum mutlak sapma.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Bundan Sonra Nereye</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Sonraki adımlar: (1) kalibre edilmiş değişim sözlükleri kullanarak CTS'yi ırk, yaş, dine genişlet; (2) lojistik regresyonu BERT ile değiştir ve katman başına nedensel aracılık çalıştır (Vig 2020); (3) demografik alt grup başına <em>heterojen</em> nedensel yanlılığı tahmin etmek için Ders 5 DML ile birleştir; (4) yanlılık-gidermeyi gömme katmanına it (Bolukbasi 2016 — "Erkek Bilgisayar Programcısına Karşı, Kadın Ev Hanımına"). Adalet Ders 1 gözlemsel adalet metrikleri üzerine paralel pisti başlatır.</div>
<p class="l-text">Okuma: Kaushik, Hovy &amp; Lipton (2020) ICLR; Vig ve ark. (2020) NeurIPS; Bolukbasi ve ark. (2016) NeurIPS; Mitchell ve ark. (2019) FAT*; Pearl &amp; Mackenzie, <em>The Book of Why</em>, karşı-olgular üzerine bölüm 8-9.</p>
</div>`
};
