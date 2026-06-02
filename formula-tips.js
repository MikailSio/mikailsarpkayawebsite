/* ============================================================
   FORMULA TIPS — hover/tap tooltips for KaTeX formula symbols.
   Works site-wide. Symbols tagged with \htmlData{sym=key}{...}
   in LaTeX render to <span data-sym="key">; this engine attaches
   a single floating tooltip that reads text from FORMULA_TIPS.

   Requires KaTeX renderMathInElement({ trust: true, ... }).
   ============================================================ */

window.FORMULA_TIPS = window.FORMULA_TIPS || {};

/* ---- Symbol dictionary (extend as more formulas are tagged) ---- */
Object.assign(window.FORMULA_TIPS, {

  /* ===== One-hot encoding (NLP L2) ===== */
  'word_i': {
    en: 'One-hot vector representing the i-th word. V-dimensional column of numbers — not the word itself.',
    tr: 'i-inci kelimeyi temsil eden one-hot vektör. V boyutlu sayı sütunudur — kelimenin kendisi değil.'
  },
  'V': {
    en: 'Vocabulary size — the number of unique tokens in the corpus. Typically 20,000 – 100,000.',
    tr: 'Kelime dağarcığı boyutu — külliyattaki benzersiz token sayısı. Tipik olarak 20.000 – 100.000.'
  },
  'i': {
    en: 'Integer index assigned to this word during vocabulary construction (0 ≤ i < V).',
    tr: 'Bu kelimeye dağarcık kurulurken atanan tamsayı indeks (0 ≤ i < V).'
  },
  'one_hot': {
    en: 'The single hot bit — the only non-zero entry. All other V−1 entries are 0.',
    tr: 'Tek sıcak bit — sıfır olmayan tek giriş. Diğer V−1 girişin tamamı 0.'
  },
  'RV': {
    en: 'V-dimensional real space. Even though entries are 0 or 1, vectors live here because downstream ML treats them as real-valued.',
    tr: 'V boyutlu reel uzay. Girişler 0 veya 1 olsa da, aşağı akıştaki ML işlemleri reel değerli olarak işlediği için bu uzayda yaşar.'
  },

  /* ===== NLP L1 — Text Preprocessing ===== */
  'l1_bpe_merge':  { en: 'The best pair at this iteration — the adjacent symbol pair (a,b) BPE will merge into the new symbol "ab" and add to the vocabulary.', tr: 'Bu iterasyondaki en iyi çift — BPE\'nin yeni "ab" sembolüne birleştirip dağarcığa ekleyeceği bitişik (a,b) sembol çifti.' },
  'l1_bpe_pairs':  { en: 'The set of all adjacent symbol pairs currently present in the corpus. Starts at character level, grows as merges are applied.', tr: 'Külliyatta şu anda bulunan tüm bitişik sembol çiftlerinin kümesi. Karakter seviyesinde başlar, birleştirmeler uygulandıkça büyür.' },
  'l1_bpe_freq':   { en: 'Count of how many times the pair (a,b) appears adjacently across the entire corpus C, weighted by word frequency.', tr: 'Tüm külliyat C boyunca (a,b) çiftinin bitişik olarak kaç kez göründüğünün sayısı, kelime frekansıyla ağırlıklandırılmış.' },
  'l1_bpe_C':      { en: 'The training corpus, stored as words split into current symbols (initially characters) with their frequencies.', tr: 'Eğitim külliyatı — kelimeler şu anki sembollere (başlangıçta karakterler) bölünmüş ve frekanslarıyla saklanmış halde.' },
  'l1_lev_d':      { en: 'Levenshtein distance — minimum number of single-character edits (insert, delete, substitute) to turn string s into t.', tr: 'Levenshtein mesafesi — s dizesini t\'ye dönüştürmek için gereken en az tek karakterlik düzenleme (ekleme, silme, değiştirme) sayısı.' },
  'l1_lev_s':      { en: 'The source string. The recurrence s[-1] means "s with its last character removed".', tr: 'Kaynak dize. s[-1] "son karakteri çıkarılmış s" anlamına gelir.' },
  'l1_lev_t':      { en: 'The target string. The recurrence t[-1] means "t with its last character removed".', tr: 'Hedef dize. t[-1] "son karakteri çıkarılmış t" anlamına gelir.' },
  'l1_lev_cost':   { en: 'Indicator cost: 1 if the last characters of s and t differ (substitution needed), 0 if they match (free).', tr: 'Gösterge maliyeti: s ve t\'nin son karakterleri farklıysa 1 (değiştirme gerekli), aynıysa 0 (bedava).' },
  'l1_zipf_f':     { en: 'Frequency (count) of the word at rank r in the corpus — the y-axis of a Zipf plot.', tr: 'Külliyatta r. rütbedeki kelimenin frekansı (sayısı) — Zipf grafiğinin y ekseni.' },
  'l1_zipf_r':     { en: 'Rank position when words are sorted by frequency (1 = most frequent). "the" usually has r = 1 in English.', tr: 'Kelimeler frekansa göre sıralandığında rütbe konumu (1 = en sık). İngilizcede "the" genellikle r = 1\'dir.' },
  'l1_zipf_alpha': { en: 'Zipf exponent. α ≈ 1 for natural language; controls how steeply frequency drops with rank.', tr: 'Zipf üsteli. Doğal dil için α ≈ 1; frekansın rütbeyle ne kadar dik düştüğünü kontrol eder.' },

  /* ===== NLP L2 — BoW, TF-IDF, n-grams ===== */
  'l2_bow_v':         { en: 'BoW document vector — one count per vocabulary word, stacked into a V-dimensional array.', tr: 'BoW belge vektörü — dağarcıktaki her kelime için bir sayım, V boyutlu diziye yığılmış.' },
  'l2_bow_count':     { en: 'Raw integer count c_j of word j in document d. Zero if the word does not appear.', tr: 'd belgesindeki j kelimesinin ham tamsayı sayımı c_j. Kelime yoksa sıfır.' },
  'l2_bow_V':         { en: 'Vocabulary size — number of unique tokens in the corpus. Each becomes one column.', tr: 'Dağarcık boyutu — külliyattaki benzersiz token sayısı. Her biri bir sütun olur.' },
  'l2_ngram_prob':    { en: 'Conditional probability of word w_t given the previous n−1 words — the Markov assumption.', tr: 'Önceki n−1 kelime verildiğinde w_t kelimesinin koşullu olasılığı — Markov varsayımı.' },
  'l2_ngram_cnum':    { en: 'Count of the full n-gram (context plus the predicted word) in training data.', tr: 'Eğitim verisinde tam n-gram sayımı (bağlam + tahmin edilen kelime).' },
  'l2_ngram_cden':    { en: 'Count of the (n−1)-word context alone. Dividing gives the MLE of P(w_t | context).', tr: 'Sadece (n−1) kelimelik bağlamın sayımı. Bölmek P(w_t | bağlam)\'ın MLE\'sini verir.' },
  'l2_ppl_score':     { en: 'Perplexity — the exponentiated average per-token negative log-likelihood. Lower is better.', tr: 'Perplexity — token başına ortalama negatif log-olasılığın üsteli. Düşük daha iyi.' },
  'l2_ppl_N':         { en: 'Total number of tokens in the held-out test set.', tr: 'Tutulan test setindeki toplam token sayısı.' },
  'l2_ppl_p':         { en: 'Model probability of each token given its context.', tr: 'Her token için bağlamı verildiğinde modelin olasılığı.' },
  'l2_tf_score':      { en: 'Term frequency — how prominent term t is within document d (local importance).', tr: 'Terim frekansı — t teriminin d belgesi içindeki belirginliği (yerel önem).' },
  'l2_tf_t':          { en: 'A term — single word or n-gram drawn from the vocabulary.', tr: 'Bir terim — dağarcıktan tek kelime ya da n-gram.' },
  'l2_tf_d':          { en: 'A single document (sentence, review, article, ...).', tr: 'Tek bir belge (cümle, inceleme, makale, ...).' },
  'l2_tf_count':      { en: 'Raw count of term t inside document d.', tr: 'd belgesi içinde t teriminin ham sayımı.' },
  'l2_tf_doclen':     { en: 'Total tokens in document d — used to normalise so long docs do not dominate.', tr: 'd belgesindeki toplam token sayısı — uzun belgelerin baskın olmaması için normalleştirmede kullanılır.' },
  'l2_subtf_score':   { en: 'Sublinear TF: 1 + log(count). Dampens the effect of very frequent terms.', tr: 'Sublinear TF: 1 + log(count). Çok sık geçen terimlerin etkisini yumuşatır.' },
  'l2_subtf_count':   { en: 'Raw occurrence count of the term inside the document.', tr: 'Terimin belge içindeki ham geçiş sayısı.' },
  'l2_idf_score':     { en: 'Inverse document frequency — boosts terms that are rare across the corpus.', tr: 'Ters belge frekansı — külliyat genelinde nadir olan terimleri güçlendirir.' },
  'l2_idf_N':         { en: 'Total number of documents in the corpus. Sets the dynamic range of IDF.', tr: 'Külliyattaki toplam belge sayısı. IDF\'in dinamik aralığını belirler.' },
  'l2_idf_dft':       { en: 'Document frequency — how many documents contain term t at least once.', tr: 'Belge frekansı — t terimini en az bir kez içeren belge sayısı.' },
  'l2_tfidf_score':   { en: 'TF-IDF score — high when the term is frequent here and rare elsewhere.', tr: 'TF-IDF skoru — terim burada sık, başka yerlerde nadirse yüksek.' },
  'l2_tfidf_tf':      { en: 'The term-frequency factor for (t, d). Any TF variant may be plugged in here.', tr: '(t, d) için terim-frekansı faktörü. Herhangi bir TF varyantı buraya takılabilir.' },
  'l2_tfidf_idf':     { en: 'The IDF weight of term t — constant across documents, learned at fit time.', tr: 't teriminin IDF ağırlığı — belgeler arası sabit, fit sırasında öğrenilir.' },
  'l2_tfidfnorm_v':   { en: 'Unit-length TF-IDF row for document d. Cosine similarity becomes a plain dot product.', tr: 'd belgesinin birim-uzunluklu TF-IDF satırı. Kosinüs benzerliği basit iç çarpıma dönüşür.' },
  'l2_tfidfnorm_raw': { en: 'Raw TF-IDF row before L2 normalisation — its Euclidean norm is used as the denominator.', tr: 'L2 normalleştirmeden önceki ham TF-IDF satırı — Öklid normu paydada kullanılır.' },
  'l2_cos_score':     { en: 'Cosine similarity — the cosine of the angle between two document vectors, length-invariant.', tr: 'Kosinüs benzerliği — iki belge vektörü arasındaki açının kosinüsü, uzunluktan bağımsız.' },
  'l2_cos_dot':       { en: 'Dot product Σ a_i b_i — large when the two vectors point the same way.', tr: 'İç çarpım Σ a_i b_i — iki vektör aynı yöne baktığında büyüktür.' },
  'l2_cos_norm':      { en: 'Euclidean (L2) norm — the length of a vector; dividing by it removes magnitude.', tr: 'Öklid (L2) normu — vektörün uzunluğu; ona bölmek büyüklüğü yok eder.' },
  'l2_cos_i':         { en: 'Index variable ranging over vector components 1..n.', tr: '1..n vektör bileşenleri üzerinde gezen indeks değişkeni.' },
  'l2_cos_n':         { en: 'Dimensionality — length of the TF-IDF vectors (usually vocabulary size).', tr: 'Boyut — TF-IDF vektörlerinin uzunluğu (genellikle dağarcık boyutu).' },

  /* ===== NLP L3 — Text Classification ===== */
  'l3_nb_posterior':   { en: 'Posterior probability P(c|d): how likely class c is given the observed document. We pick the class that maximises this.', tr: 'Sonsal olasılık P(c|d): belge gözlendiğinde c sınıfının ne kadar olası olduğu. Bunu en büyük yapan sınıfı seçeriz.' },
  'l3_nb_prior':       { en: 'Class prior P(c): fraction of training documents belonging to class c before seeing the text.', tr: 'Sınıf önseli P(c): metni görmeden önce eğitim setinde c sınıfına ait belgelerin oranı.' },
  'l3_nb_likelihood':  { en: 'Per-word likelihood P(w_i|c): how frequent the word w_i is inside class c. Estimated with Laplace smoothing.', tr: 'Kelime bazlı olabilirlik P(w_i|c): w_i kelimesinin c sınıfı içinde ne sıklıkta geçtiği. Laplace düzeltmesiyle kestirilir.' },
  'l3_nb_n':           { en: 'Number of tokens (words) in the document being classified.', tr: 'Sınıflandırılan belgedeki token (kelime) sayısı.' },
  'l3_nb_chat':        { en: 'Predicted class — the argmax over all candidate classes of the log-posterior score.', tr: 'Tahmin edilen sınıf — tüm aday sınıflar üzerinde log-sonsal skorun argmax\'ı.' },
  'l3_nb_c':           { en: 'A candidate class label drawn from the set of all classes C.', tr: 'Tüm sınıflar kümesi C\'den bir aday sınıf etiketi.' },
  'l3_nb_count':       { en: 'Raw count: how many times word w_i appears across all training documents of class c.', tr: 'Ham sayım: w_i kelimesinin c sınıfının tüm eğitim belgelerinde toplam kaç kez geçtiği.' },
  'l3_nb_alpha':       { en: 'Laplace / additive smoothing constant. alpha=1 is classic Laplace; alpha<1 sharpens, alpha>1 flattens.', tr: 'Laplace / toplamsal düzeltme sabiti. alpha=1 klasik Laplace; alpha<1 keskinleştirir, alpha>1 düzleştirir.' },
  'l3_nb_class_total': { en: 'Total token count across all documents of class c. Normaliser for the likelihood.', tr: 'c sınıfının tüm belgelerindeki toplam token sayısı. Olabilirlik için normalleştirici.' },
  'l3_nb_vocab':       { en: 'Vocabulary size |V|. Multiplied by alpha in the denominator so the smoothed probabilities still sum to 1.', tr: 'Kelime dağarcığı boyutu |V|. Paydada alpha ile çarpılır, böylece düzeltilmiş olasılıklar toplam 1 kalır.' },
  'l3_nb_bern_like':   { en: 'Bernoulli NB likelihood: probability of the presence (x=1) or absence (x=0) of word i given class c.', tr: 'Bernoulli NB olabilirliği: c sınıfı verildiğinde i kelimesinin varlığı (x=1) ya da yokluğu (x=0) olasılığı.' },
  'l3_nb_theta':       { en: 'Theta_{i,c} = P(word i appears | class c). Fraction of class-c training documents in which word i is present.', tr: 'Theta_{i,c} = P(i kelimesi geçer | c sınıfı). i kelimesinin geçtiği c sınıfı eğitim belgelerinin oranı.' },
  'l3_logreg_z':       { en: 'Linear score z = w·x + b. Unbounded real number fed to the sigmoid.', tr: 'Doğrusal skor z = w·x + b. Sigmoide verilen sınırsız reel sayı.' },
  'l3_logreg_w':       { en: 'Weight vector w. One coefficient per feature (vocabulary word). Learned during training.', tr: 'Ağırlık vektörü w. Her özellik (kelime) için bir katsayı. Eğitim sırasında öğrenilir.' },
  'l3_logreg_x':       { en: 'Feature vector x of the document — typically TF-IDF or count values, one per vocabulary word.', tr: 'Belgenin özellik vektörü x — genellikle kelime başına TF-IDF veya sayım değerleri.' },
  'l3_logreg_b':       { en: 'Bias / intercept term. Shifts the decision boundary away from zero.', tr: 'Sapma / kesen terimi. Karar sınırını sıfırdan kaydırır.' },
  'l3_logreg_phat':    { en: 'Predicted probability p̂ = P(y=1|x). A calibrated number in (0,1).', tr: 'Tahmin edilen olasılık p̂ = P(y=1|x). (0,1) aralığında kalibre edilmiş bir sayı.' },
  'l3_logreg_sigmoid': { en: 'Sigmoid σ(z)=1/(1+e^-z). Squashes any real z into (0,1); σ(0)=0.5.', tr: 'Sigmoid σ(z)=1/(1+e^-z). Herhangi bir reel z\'yi (0,1)\'e sıkıştırır; σ(0)=0.5.' },
  'l3_softmax_pi':     { en: 'Probability that the document belongs to class k, from the softmax over raw scores.', tr: 'Ham skorlar üzerinden softmax\'ın ürettiği, belgenin k sınıfına ait olma olasılığı.' },
  'l3_softmax_zi':     { en: 'Raw score z_k = w_k·x + b_k for class k. Not yet a probability.', tr: 'k sınıfı için ham skor z_k = w_k·x + b_k. Henüz bir olasılık değil.' },
  'l3_softmax_K':      { en: 'Number of classes. Softmax reduces to sigmoid when K=2.', tr: 'Sınıf sayısı. K=2 olduğunda softmax sigmoide indirgenir.' },
  'l3_softmax_denom':  { en: 'Partition sum over all classes — ensures outputs are non-negative and sum to 1.', tr: 'Tüm sınıflar üzerinden bölme toplamı — çıktıların negatif olmamasını ve toplamlarının 1 olmasını sağlar.' },
  'l3_ce_N':           { en: 'Number of training examples in the batch / dataset.', tr: 'Yığındaki / veri setindeki eğitim örneği sayısı.' },
  'l3_ce_y':           { en: 'True label y_i ∈ {0,1}. Exactly one of the two log terms is kept per example.', tr: 'Gerçek etiket y_i ∈ {0,1}. Her örnek için iki log teriminden yalnızca biri kalır.' },
  'l3_ce_phat':        { en: 'Model\'s predicted probability for the positive class on example i.', tr: 'Modelin i örneği için pozitif sınıfa atadığı olasılık.' },
  'l3_prec':           { en: 'Precision = TP / (TP+FP). Of everything the model flagged as positive, what fraction actually was.', tr: 'Kesinlik = TP / (TP+FP). Modelin pozitif dediği her şeyin gerçekten pozitif olan oranı.' },
  'l3_rec':            { en: 'Recall = TP / (TP+FN). Of all the real positives out there, what fraction did the model catch.', tr: 'Duyarlılık = TP / (TP+FN). Gerçekte var olan tüm pozitiflerin modelin yakaladığı oranı.' },
  'l3_f1':             { en: 'F1 score: harmonic mean of precision and recall. Punishes models that lopsidedly optimise one at the cost of the other.', tr: 'F1 skoru: kesinlik ile duyarlılığın harmonik ortalaması. Birini diğerinin pahasına aşırı optimize eden modelleri cezalandırır.' },
  'l3_tp':             { en: 'True Positives — examples correctly predicted as the positive class.', tr: 'Doğru Pozitifler — pozitif sınıf olarak doğru tahmin edilen örnekler.' },
  'l3_fp':             { en: 'False Positives — negatives that the model wrongly flagged as positive.', tr: 'Yanlış Pozitifler — modelin yanlışlıkla pozitif olarak işaretlediği negatifler.' },
  'l3_fn':             { en: 'False Negatives — positives that the model missed (predicted as negative).', tr: 'Yanlış Negatifler — modelin kaçırdığı pozitifler (negatif olarak tahmin edildi).' },

  /* ===== NLP L4 — Sentiment Analysis ===== */
  'l4_lex_score':   { en: 'Document-level sentiment score S(d) — the signed, weighted sum of per-word valences over every scored token in document d.', tr: 'Belge düzeyinde duygu skoru S(d) — belgede puanlanan her tokenin işaretli, ağırlıklı valans toplamı.' },
  'l4_lex_i':       { en: 'Token index — runs over every scored word in the document (stopwords skipped).', tr: 'Token indeksi — belgedeki puanlanan her kelime üzerinde gezer (stopword\'ler atlanır).' },
  'l4_lex_neg':     { en: 'Sign flip from negation. n_i is the number of negation cues ("not", "never", "no") whose scope contains token i. Even = unchanged, odd = flipped.', tr: 'Olumsuzlamadan gelen işaret çevrimi. n_i, kapsamı i tokenini içeren olumsuzlama ipuçlarının ("değil", "asla", "hiç") sayısıdır. Çift = aynı, tek = ters.' },
  'l4_lex_beta':    { en: 'Local multiplier β_i from boosters ("very", "extremely" → β>1) or dampeners ("slightly", "barely" → β<1). VADER tunes these around 1.25 and 0.75 respectively.', tr: 'Güçlendirici ("çok", "son derece" → β>1) veya zayıflatıcı ("az", "hafifçe" → β<1) yerel çarpan β_i. VADER bunları ~1.25 ve ~0.75 civarında ayarlar.' },
  'l4_lex_w':       { en: 'Base sentiment weight of word i from the lexicon. Typically in [-4, +4] for VADER; ±1..±5 for AFINN; [-1, +1] for TextBlob.', tr: 'Sözlükten i kelimesinin temel duygu ağırlığı. VADER için tipik olarak [-4, +4]; AFINN için ±1..±5; TextBlob için [-1, +1].' },
  'l4_vader_comp':  { en: 'VADER compound score C — the normalised, single-value sentiment in [-1, +1]. Thresholds: C ≥ +0.05 positive, C ≤ -0.05 negative, else neutral.', tr: 'VADER compound skoru C — [-1, +1] aralığında normalize edilmiş tek değerli duygu. Eşikler: C ≥ +0.05 olumlu, C ≤ -0.05 olumsuz, aksi halde nötr.' },
  'l4_vader_sum':   { en: 'Raw sum of VADER valence scores across all matched lexicon words in the text, after booster, capitalisation, and negation rules are applied.', tr: 'Metindeki eşleşen tüm sözlük kelimelerinin VADER valans skorlarının — güçlendirici, büyük harf ve olumsuzlama kuralları uygulandıktan sonraki — ham toplamı.' },
  'l4_vader_alpha': { en: 'VADER normalisation constant α = 15. Controls how quickly the compound score saturates toward ±1 as more sentiment words accumulate.', tr: 'VADER normalizasyon sabiti α = 15. Daha fazla duygu kelimesi biriktikçe compound skorun ±1\'e ne kadar hızlı doyacağını kontrol eder.' },
  'l4_tb_pol':      { en: 'TextBlob document-level polarity p(d) ∈ [-1, +1]. The mean polarity over every scored adjective/phrase in the text.', tr: 'TextBlob belge düzeyi kutupluluk p(d) ∈ [-1, +1]. Metindeki puanlanan her sıfat/ifadenin ortalama kutupluluğu.' },
  'l4_tb_subj':     { en: 'TextBlob document-level subjectivity s(d) ∈ [0, 1]. 0 = pure fact, 1 = pure opinion. Independent of polarity.', tr: 'TextBlob belge düzeyi öznellik s(d) ∈ [0, 1]. 0 = saf gerçek, 1 = saf görüş. Kutupluluktan bağımsızdır.' },
  'l4_tb_i':        { en: 'Token index ranging over the scored adjectives/phrases whose polarity and subjectivity are listed in the Pattern lexicon.', tr: 'Pattern sözlüğünde kutupluluk ve öznelliği listelenen puanlanan sıfat/ifadeler üzerinde gezen token indeksi.' },
  'l4_tb_polw':     { en: 'Per-word polarity p_i ∈ [-1, +1] from the Pattern lexicon — hand-annotated for adjectives like "great" (+0.8), "terrible" (-1.0).', tr: 'Pattern sözlüğünden kelime başına kutupluluk p_i ∈ [-1, +1] — "great" (+0.8), "terrible" (-1.0) gibi sıfatlar için elle notlandırılmış.' },
  'l4_tb_subjw':    { en: 'Per-word subjectivity s_i ∈ [0, 1] from the Pattern lexicon. "Scientific" ≈ 0.1, "amazing" ≈ 0.9.', tr: 'Pattern sözlüğünden kelime başına öznellik s_i ∈ [0, 1]. "Scientific" ≈ 0.1, "amazing" ≈ 0.9.' },
  'l4_afinn_S':     { en: 'AFINN document score — a plain sum of integer valences. Magnitude grows with document length (no normalisation).', tr: 'AFINN belge skoru — tamsayı valansların basit toplamı. Belge uzunluğuyla büyüklüğü artar (normalizasyon yok).' },
  'l4_afinn_i':     { en: 'Token index over words present in the AFINN lexicon (~2,500 English words). Out-of-vocabulary words contribute 0.', tr: 'AFINN sözlüğünde (~2.500 İngilizce kelime) bulunan kelimeler üzerinde gezen token indeksi. Sözlük dışı kelimeler 0 katkı sağlar.' },
  'l4_afinn_a':     { en: 'AFINN integer valence for word i, a_i ∈ {-5,…,+5}. Hand-annotated by Finn Årup Nielsen (2011). "fantastic"=+4, "catastrophic"=-4.', tr: 'i kelimesi için AFINN tamsayı valansı, a_i ∈ {-5,…,+5}. Finn Årup Nielsen (2011) tarafından elle notlandırılmıştır. "fantastic"=+4, "catastrophic"=-4.' },
  'l4_neg_score':   { en: 'Predicted sentiment ŷ ∈ {-1, +1}. The sign of the total linear score after NOT_ features have been added.', tr: 'Tahmin edilen duygu ŷ ∈ {-1, +1}. NOT_ öznitelikleri eklendikten sonra toplam doğrusal skorun işareti.' },
  'l4_neg_i':       { en: 'Feature index running over the vocabulary. Negated and plain forms each get their own index.', tr: 'Kelime dağarcığı üzerinde gezen öznitelik indeksi. Olumsuzlanmış ve düz biçimlerin her biri kendi indeksini alır.' },
  'l4_neg_w':       { en: 'Weight for the plain feature w_i — learned by the classifier (LR, SVM, etc.). Typically w_good > 0, w_terrible < 0.', tr: 'Düz öznitelik w_i için ağırlık — sınıflandırıcı (LR, SVM vs.) tarafından öğrenilir. Tipik olarak w_good > 0, w_terrible < 0.' },
  'l4_neg_x':       { en: 'Plain feature value x_i — the TF-IDF or count of word i *outside* any negation window in the document.', tr: 'Düz öznitelik değeri x_i — belgedeki i kelimesinin herhangi bir olumsuzlama penceresi *dışındaki* TF-IDF veya sayımı.' },
  'l4_neg_wneg':    { en: 'Weight for the NOT_-prefixed feature. Learned separately; typically flipped in sign relative to w_i (w_NOT_good < 0).', tr: 'NOT_ önekli öznitelik için ağırlık. Ayrı olarak öğrenilir; tipik olarak w_i\'ye göre işareti terstir (w_NOT_good < 0).' },
  'l4_neg_xneg':    { en: 'Negated feature value — the count/TF-IDF of word i *inside* a negation window. Distinct feature from x_i.', tr: 'Olumsuzlanmış öznitelik değeri — olumsuzlama penceresi *içindeki* i kelimesinin sayımı/TF-IDF\'si. x_i\'den ayrı özniteliktir.' },
  'l4_absa_S':      { en: 'Aggregate sentiment toward aspect a over corpus D. The business-level dashboard number for "how do customers feel about {screen}?".', tr: 'D külliyatında a yönüne yönelik toplam duygu. "Müşteriler {ekran} hakkında ne hissediyor?" için iş düzeyinde gösterge sayısı.' },
  'l4_absa_Da':     { en: 'Subset of documents that explicitly mention aspect a. |D_a| ≠ |D| — most reviews stay silent on most aspects.', tr: 'a yönüne açıkça değinen belgelerin alt kümesi. |D_a| ≠ |D| — çoğu yorum çoğu yön hakkında sessiz kalır.' },
  'l4_absa_d':      { en: 'A single document from D_a that mentions aspect a and carries an extracted opinion about it.', tr: 'a yönünden bahseden ve onun hakkında çıkarılmış bir görüş taşıyan D_a\'dan tek bir belge.' },
  'l4_absa_sda':    { en: 'Per-document sentiment toward aspect a in document d — typically the polarity of the opinion word(s) linked to a via dependency parsing.', tr: 'd belgesinde a yönüne yönelik belge başına duygu — tipik olarak bağımlılık ayrıştırma yoluyla a\'ya bağlanan görüş kelime(leri)nin kutupluluğu.' },

  /* ===== NLP L5 — Word Embeddings (TR diacritics normalized) ===== */
  'l5_sg_prob':   { en: 'Conditional probability of context word w_O given centre word w_I under the Skip-gram softmax model.', tr: 'Skip-gram softmax modelinde merkez kelime w_I verildiğinde bağlam kelimesi w_O\'nun koşullu olasılığı.' },
  'l5_sg_vi':     { en: 'Input (centre) vector of w_I. Each word has two d-dim vectors; this one is used when the word is the centre.', tr: 'w_I\'nin giriş (merkez) vektörü. Her kelimenin iki d boyutlu vektörü vardır; bu, kelime merkezdeyken kullanılır.' },
  'l5_sg_uo':     { en: 'Output (context) vector of w_O. Used when the word appears as a context neighbour of some centre.', tr: 'w_O\'nun çıkış (bağlam) vektörü. Kelime başka bir merkezin bağlam komşusu olarak göründüğünde kullanılır.' },
  'l5_sg_V':      { en: 'Vocabulary size. Softmax denominator sums over all V words — the source of Word2Vec\'s scalability problem.', tr: 'Sözlük boyutu. Softmax paydası tüm V kelime üzerinde toplanır — Word2Vec\'in ölçeklenebilirlik sorununun kaynağıdır.' },
  'l5_sg_loss':   { en: 'Average negative log-likelihood over the whole corpus; what SGD minimises during Skip-gram training.', tr: 'Tüm derlem üzerinde ortalama negatif log-olabilirlik; Skip-gram eğitiminde SGD\'nin minimize ettiği kayıp.' },
  'l5_sg_T':      { en: 'Number of tokens in the training corpus. Normalises the loss so it does not scale with corpus size.', tr: 'Eğitim derlemindeki token sayısı. Kaybı normalize eder, böylece derlem boyutuyla ölçeklenmez.' },
  'l5_ns_J':      { en: 'Negative-sampling objective for a single (centre, context) pair. Replaces the expensive full softmax.', tr: 'Tek bir (merkez, bağlam) çifti için negatif örnekleme amacı. Pahalı tam softmax\'ın yerine geçer.' },
  'l5_ns_sigma':  { en: 'Logistic sigmoid 1/(1+e^-x). Turns the dot product into a probability that the pair is a real observation.', tr: 'Lojistik sigmoid 1/(1+e^-x). İç çarpımı çiftin gerçek bir gözlem olma olasılığına çevirir.' },
  'l5_ns_k':      { en: 'Number of negative samples per positive pair. Typically 5–20; larger for small corpora, smaller for web-scale data.', tr: 'Her pozitif çift için negatif örnek sayısı. Tipik 5–20; küçük derlemde büyük, web ölçekli veride küçük.' },
  'l5_ns_Pn':     { en: 'Noise distribution for sampling negatives. Word2Vec uses unigram frequency raised to 0.75 to slightly boost rare words.', tr: 'Negatif örnekleme dağılımı. Word2Vec, nadir kelimeleri hafifçe güçlendirmek için 0.75\'e yükseltilmiş unigram frekansını kullanır.' },
  'l5_sub_p':     { en: 'Probability of dropping an occurrence of word w_i from training. Higher for frequent words like "the".', tr: 'Eğitimden w_i kelimesinin bir geçişini atma olasılığı. "the" gibi sık kelimeler için daha yüksek.' },
  'l5_sub_t':     { en: 'Subsampling threshold. Typical t = 1e-5; tunes how aggressively frequent words are downweighted.', tr: 'Alt-örnekleme eşiği. Tipik t = 1e-5; sık kelimelerin ne kadar agresif aşağı ağırlıklandırıldığını ayarlar.' },
  'l5_sub_f':     { en: 'Empirical frequency of w_i in the corpus — count(w_i) divided by total tokens.', tr: 'w_i\'nin derlemdeki ampirik frekansı — count(w_i) bölü toplam token sayısı.' },
  'l5_glove_J':   { en: 'GloVe objective. A weighted least-squares fit between the dot product of word vectors and log co-occurrence.', tr: 'GloVe amaç fonksiyonu. Kelime vektörlerinin iç çarpımı ile log birlikte görünme arasında ağırlıklı en küçük kareler uyumu.' },
  'l5_glove_f':   { en: 'Weighting function. Caps the effect of extremely frequent pairs and zeroes out unseen pairs.', tr: 'Ağırlık fonksiyonu. Aşırı sık çiftlerin etkisini kısıtlar ve görülmemiş çiftleri sıfırlar.' },
  'l5_glove_wi':  { en: 'Vector for word i (the "row" word). Combined with the context vector w̃_j via dot product.', tr: 'i kelimesinin vektörü ("satır" kelime). İç çarpım ile bağlam vektörü w̃_j ile birleştirilir.' },
  'l5_glove_wj':  { en: 'Context-side vector for word j. GloVe usually sums w_i + w̃_i at the end for the final embedding.', tr: 'j kelimesinin bağlam tarafı vektörü. GloVe genellikle nihai gömme için w_i + w̃_i toplar.' },
  'l5_glove_bi':  { en: 'Per-word scalar bias. Absorbs the marginal frequency of word i so the dot product only models interaction.', tr: 'Kelime başı skaler sapma. i kelimesinin marjinal frekansını soğurur, böylece iç çarpım yalnızca etkileşimi modeller.' },
  'l5_glove_X':   { en: 'Co-occurrence count between words i and j inside a context window, summed across the corpus.', tr: 'i ve j kelimelerinin bağlam penceresinde birlikte görünme sayısı, derlem boyunca toplanmıştır.' },
  'l5_pmi':       { en: 'Pointwise mutual information: log of joint probability divided by product of marginals. Zero when independent.', tr: 'Noktasal karşılıklı bilgi: ortak olasılığın marjinal çarpımlarına bölünmesinin logu. Bağımsızken sıfırdır.' },
  'l5_pmi_joint': { en: 'Joint probability that words i and j occur together within a context window.', tr: 'i ve j kelimelerinin bağlam penceresinde birlikte görünme ortak olasılığı.' },
  'l5_pmi_pi':    { en: 'Marginal probability of word i. Product P(i)P(j) is the expected joint under independence.', tr: 'i kelimesinin marjinal olasılığı. P(i)P(j) çarpımı bağımsızlık altında beklenen ortak olasılıktır.' },
  'l5_sppmi':     { en: 'Shifted Positive PMI: PMI minus log(k), clipped at zero. Word2Vec-SGNS implicitly factorises this matrix.', tr: 'Kaydırılmış Pozitif PMI: PMI eksi log(k), sıfırda kesilmiş. Word2Vec-SGNS bu matrisi örtük olarak faktörize eder.' },
  'l5_sppmi_k':   { en: 'Number of negative samples used in SGNS; the shift log(k) reflects how SGNS differs from plain PMI factorisation.', tr: 'SGNS\'de kullanılan negatif örnek sayısı; log(k) kayması SGNS\'in saf PMI faktörizasyonundan nasıl ayrıldığını yansıtır.' },
  'l5_cos_sim':   { en: 'Cosine similarity — cosine of the angle between two vectors. Ranges in [−1, 1]; invariant to vector magnitude.', tr: 'Kosinüs benzerliği — iki vektör arasındaki açının kosinüsü. [−1, 1] aralığında; vektör büyüklüğünden bağımsız.' },
  'l5_cos_dot':   { en: 'Dot product a·b = Σ a_i b_i. Large and positive when vectors point the same way.', tr: 'İç çarpım a·b = Σ a_i b_i. Vektörler aynı yöne baktığında büyük ve pozitiftir.' },
  'l5_cos_na':    { en: 'Euclidean (L2) norm of vector a. Dividing by it removes magnitude and leaves pure direction.', tr: 'a vektörünün Öklid (L2) normu. Ona bölmek büyüklüğü kaldırır ve saf yönü bırakır.' },
  'l5_cos_nb':    { en: 'Euclidean (L2) norm of vector b. Together with ||a|| it converts dot product into a normalised similarity.', tr: 'b vektörünün Öklid (L2) normu. ||a|| ile birlikte iç çarpımı normalize edilmiş benzerliğe çevirir.' },

  /* ===== NLP L6 — Topic Modeling ===== */
  'l6_V':           { en: 'Document-term matrix of shape (D documents × N words). Rows = documents, columns = vocabulary terms.', tr: 'Boyutu (D belge × N kelime) olan belge-terim matrisi. Satırlar = belgeler, sütunlar = kelime dağarcığı.' },
  'l6_W':           { en: 'Document-topic matrix (D × K). Row d gives document d\'s mixture weight over the K topics.', tr: 'Belge-konu matrisi (D × K). d. satır, d belgesinin K konu üzerindeki karışım ağırlıklarını verir.' },
  'l6_H':           { en: 'Topic-word matrix (K × N). Row k gives topic k\'s weight over the N vocabulary words.', tr: 'Konu-kelime matrisi (K × N). k. satır, k konusunun N kelime üzerindeki ağırlıklarını verir.' },
  'l6_K':           { en: 'Number of latent topics — a hyperparameter set by the user. Chosen via coherence sweep.', tr: 'Gizli konu sayısı — kullanıcı tarafından belirlenen bir hiperparametre. Tutarlılık taramasıyla seçilir.' },
  'l6_lsa_U':       { en: 'Truncated left-singular matrix (D × K) from SVD. Each row is a document embedded in K-dim topic space.', tr: 'SVD\'den kesilmiş sol-tekil matris (D × K). Her satır, K boyutlu konu uzayına gömülmüş bir belgedir.' },
  'l6_lsa_sigma':   { en: 'Diagonal matrix of the top-K singular values. Captures the importance (variance) of each latent topic.', tr: 'En büyük K tekil değerin köşegen matrisi. Her gizli konunun önemini (varyansını) yakalar.' },
  'l6_lsa_Vt':      { en: 'Truncated right-singular matrix transposed (K × N). Each row is a topic expressed over the vocabulary.', tr: 'Kesilmiş sağ-tekil matrisin transpozu (K × N). Her satır, kelime dağarcığı üzerinden bir konu.' },
  'l6_lda_theta':   { en: 'Topic mixture for document d — a K-dim probability vector. Drawn from Dirichlet(α) per document.', tr: 'd belgesinin konu karışımı — K boyutlu olasılık vektörü. Belge başına Dirichlet(α)\'dan çekilir.' },
  'l6_lda_alpha':   { en: 'Dirichlet concentration parameter over document-topic distributions. Small α → sparse mixtures; large α → uniform.', tr: 'Belge-konu dağılımları üzerindeki Dirichlet yoğunluk parametresi. Küçük α → seyrek karışım; büyük α → düzgün.' },
  'l6_lda_phi':     { en: 'Word distribution for topic k — an N-dim probability vector over the vocabulary. Drawn from Dirichlet(β).', tr: 'k konusu için kelime dağılımı — kelime dağarcığı üzerinde N boyutlu olasılık vektörü. Dirichlet(β)\'dan çekilir.' },
  'l6_lda_beta':    { en: 'Dirichlet concentration parameter over topic-word distributions. Small β → focused topics; large β → broad topics.', tr: 'Konu-kelime dağılımları üzerindeki Dirichlet yoğunluk parametresi. Küçük β → odaklı konular; büyük β → geniş konular.' },
  'l6_lda_z':       { en: 'Topic assignment for the n-th word in document d — a latent integer in {1, …, K}.', tr: 'd belgesindeki n. kelime için konu ataması — {1, …, K} arasında gizli bir tamsayı.' },
  'l6_lda_w':       { en: 'The observed word at position n of document d — drawn from the chosen topic\'s word distribution φ_z.', tr: 'd belgesinin n konumundaki gözlemlenen kelime — seçilen konunun kelime dağılımı φ_z\'den çekilir.' },
  'l6_lda_Nd':      { en: 'Number of words in document d. Product over n=1..N_d marginalises each word position in the joint.', tr: 'd belgesindeki kelime sayısı. n=1..N_d üzerindeki çarpım, ortak olasılıktaki her kelime konumunu hesaba katar.' },
  'l6_nmf_X':       { en: 'Non-negative input matrix (usually TF-IDF or counts) that NMF factorises as X ≈ W H.', tr: 'NMF\'nin X ≈ W H şeklinde ayrıştırdığı negatif olmayan girdi matrisi (genellikle TF-IDF veya sayım).' },
  'l6_nmf_W':       { en: 'Non-negative document-topic factor (D × K). Entries ≥ 0 give additive topic loadings per document.', tr: 'Negatif olmayan belge-konu faktörü (D × K). ≥ 0 girişleri belge başına toplamsal konu yüklemelerini verir.' },
  'l6_nmf_H':       { en: 'Non-negative topic-word factor (K × N). Entries ≥ 0 give additive word contributions per topic.', tr: 'Negatif olmayan konu-kelime faktörü (K × N). ≥ 0 girişleri konu başına toplamsal kelime katkılarını verir.' },
  'l6_nmf_fro':     { en: 'Frobenius norm: √ΣΣ (X_ij − (WH)_ij)². Sum of squared entry-wise reconstruction errors.', tr: 'Frobenius normu: √ΣΣ (X_ij − (WH)_ij)². Girdi bazında kare yeniden yapılandırma hatalarının toplamı.' },
  'l6_perp':        { en: 'Perplexity — exponential of mean per-token negative log-likelihood on held-out documents. Lower = better, but correlates poorly with human judgement.', tr: 'Perplexity — tutulan belgelerde token başına ortalama negatif log-olasılığın üsteli. Düşük = daha iyi, ancak insan değerlendirmesiyle zayıf korelasyon gösterir.' },
  'l6_perp_N':      { en: 'Total token count in the held-out evaluation set. Normalises the log-likelihood to a per-token average.', tr: 'Tutulan değerlendirme setindeki toplam token sayısı. Log-olasılığı token başına ortalamaya normalleştirir.' },
  'l6_coh':         { en: 'UMass coherence score for a topic — sum of pairwise log co-occurrence probabilities over the top-M words. Higher (closer to 0) is better.', tr: 'Bir konu için UMass tutarlılık skoru — en önemli M kelime üzerindeki ikili log birlikte geçiş olasılıklarının toplamı. Yüksek (0\'a yakın) daha iyi.' },
  'l6_coh_M':       { en: 'Number of top words per topic used to compute coherence (typically 10 or 20).', tr: 'Tutarlılık hesabında kullanılan konu başına en önemli kelime sayısı (tipik olarak 10 veya 20).' },
  'l6_coh_D':       { en: 'Document-frequency function: D(w) = #docs containing w; D(w_i, w_j) = #docs containing both.', tr: 'Belge-frekansı fonksiyonu: D(w) = w içeren belge sayısı; D(w_i, w_j) = ikisini de içeren belge sayısı.' },
  'l6_coh_eps':     { en: 'Small smoothing constant (e.g. 1) added to the co-occurrence count so log is defined when words never co-occur.', tr: 'Birlikte geçiş sayımına eklenen küçük yumuşatma sabiti (örn. 1) — iki kelime hiç birlikte görünmediğinde log\'un tanımlı kalmasını sağlar.' }

});

/* ---- Tooltip engine (single shared bubble) ---- */
(function(){
  if (window.__symTipWired) return;
  window.__symTipWired = true;

  function getLang(){
    try { return localStorage.getItem('tut-lang') || 'en'; } catch(e){ return 'en'; }
  }

  function ensureTip(){
    var t = document.getElementById('__sym_tip');
    if (t) return t;
    t = document.createElement('div');
    t.id = '__sym_tip';
    t.className = 'sym-tip';
    t.setAttribute('role', 'tooltip');
    document.body.appendChild(t);
    return t;
  }

  function show(el){
    var sym = el.getAttribute('data-sym');
    var dict = window.FORMULA_TIPS || {};
    var entry = dict[sym];
    if (!entry) return;
    var lang = getLang();
    var text = (lang === 'tr' && entry.tr) ? entry.tr : entry.en;
    var tip = ensureTip();
    tip.textContent = text;
    tip.classList.add('show');

    // Measure after text is set
    var tr = tip.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    var gap = 10;
    var top = er.top - gap - tr.height;
    var placement = 'top';
    if (top < 8){
      top = er.bottom + gap;
      placement = 'bottom';
    }
    var left = er.left + er.width/2 - tr.width/2;
    left = Math.max(8, Math.min(window.innerWidth - tr.width - 8, left));
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    tip.setAttribute('data-pos', placement);
    // Arrow horizontal offset (so it still points to element center if tip was clamped)
    var arrowLeft = er.left + er.width/2 - left;
    arrowLeft = Math.max(14, Math.min(tr.width - 14, arrowLeft));
    tip.style.setProperty('--arrow-left', arrowLeft + 'px');
  }

  function hide(){
    var tip = document.getElementById('__sym_tip');
    if (tip) tip.classList.remove('show');
  }

  /* Desktop hover */
  document.addEventListener('mouseover', function(e){
    var el = e.target.closest && e.target.closest('[data-sym]');
    if (el) show(el);
  });
  document.addEventListener('mouseout', function(e){
    var el = e.target.closest && e.target.closest('[data-sym]');
    if (el) hide();
  });

  /* Touch / click toggle */
  document.addEventListener('click', function(e){
    var el = e.target.closest && e.target.closest('[data-sym]');
    var tip = document.getElementById('__sym_tip');
    if (el){
      e.preventDefault();
      if (tip && tip.classList.contains('show') && tip.__anchor === el){
        hide();
        tip.__anchor = null;
      } else {
        show(el);
        if (tip) tip.__anchor = el;
      }
    } else if (tip && tip.classList.contains('show')){
      hide();
      tip.__anchor = null;
    }
  });

  /* Keyboard accessibility — focus / blur */
  document.addEventListener('focusin', function(e){
    var el = e.target.closest && e.target.closest('[data-sym]');
    if (el) show(el);
  });
  document.addEventListener('focusout', function(e){
    var el = e.target.closest && e.target.closest('[data-sym]');
    if (el) hide();
  });

  /* Hide on scroll / resize to avoid stale position */
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);

  /* Make tagged symbols keyboard-focusable after every KaTeX render */
  window.__applyTipA11y = function(root){
    var scope = root || document;
    scope.querySelectorAll('[data-sym]').forEach(function(el){
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
  };
})();
