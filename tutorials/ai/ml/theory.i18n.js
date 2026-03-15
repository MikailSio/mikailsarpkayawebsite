/**
 * ml.i18n.js — ML Theory translations (EN/TR/DE/ES)
 * Extracted from main i18n.js. Loaded after shared.i18n.js.
 */
const T_LOCAL = {
  "ml.eyebrow":  {en:"Tutorial · Machine Learning",tr:"Eğitim · Makine Öğrenmesi",de:"Tutorial · Maschinelles Lernen",es:"Tutorial · Machine Learning"},
  "ml.t1":       {en:"MACHINE",tr:"MAKİNE",de:"MASCHINELLES",es:"MACHINE"},
  "ml.t2":       {en:"LEARNING",tr:"ÖĞRENMESİ",de:"LERNEN",es:"LEARNING"},
  "ml.desc":     {
    en:"The mathematical foundations of supervised and unsupervised learning. From <strong>linear regression</strong> to <strong>ensemble methods</strong> — understand the algorithms before jumping into deep learning. Every neural network builds on these core concepts.",
    tr:"Gözetimli ve gözetimsiz öğrenmenin matematiksel temelleri. <strong>Doğrusal regresyon</strong>dan <strong>topluluk yöntemlerine</strong> kadar — derin öğrenmeye geçmeden önce algoritmaları anlayın. Her sinir ağı bu temel kavramlar üzerine inşa edilir.",
    de:"Die mathematischen Grundlagen von überwachtem und unüberwachtem Lernen. Von <strong>linearer Regression</strong> bis zu <strong>Ensemble-Methoden</strong> — verstehen Sie die Algorithmen vor dem Einstieg in Deep Learning.",
    es:"Los fundamentos matemáticos del aprendizaje supervisado y no supervisado. Desde <strong>regresión lineal</strong> hasta <strong>métodos ensemble</strong> — comprenda los algoritmos antes de saltar al deep learning."},
  "ml.level":    {en:"Beginner → Intermediate",tr:"Başlangıç → Orta",de:"Anfänger → Mittel",es:"Principiante → Intermedio"},
  "ml.prereq":   {en:"Python, NumPy",tr:"Python, NumPy",de:"Python, NumPy",es:"Python, NumPy"},
  /* ML Lessons */
  "ml.l1.t":     {en:"Linear Regression",tr:"Doğrusal Regresyon",de:"Lineare Regression",es:"Regresión Lineal"},
  "ml.l1.s":     {en:"Hypothesis function · Cost function (MSE) · Ordinary Least Squares · 10 min",tr:"Hipotez fonksiyonu · Maliyet fonksiyonu (MSE) · En Küçük Kareler · 10 dk",de:"Hypothesenfunktion · Kostenfunktion (MSE) · Kleinste Quadrate · 10 Min.",es:"Función hipótesis · Función de costo (MSE) · Mínimos cuadrados · 10 min"},
  "ml.l1.p1":    {
    en:"Linear regression is the <strong>starting point of machine learning</strong>. It models the relationship between a dependent variable y and one or more independent variables X by fitting a straight line (or hyperplane) that minimizes prediction error.",
    tr:"Doğrusal regresyon, <strong>makine öğrenmesinin başlangıç noktasıdır</strong>. Bağımlı değişken y ile bir veya daha fazla bağımsız değişken X arasındaki ilişkiyi, tahmin hatasını en aza indiren düz bir çizgi (veya hiperdüzlem) uydurarak modeller.",
    de:"Lineare Regression ist der <strong>Ausgangspunkt des maschinellen Lernens</strong>. Sie modelliert die Beziehung zwischen einer abhängigen Variable y und einer oder mehreren unabhängigen Variablen X durch Anpassung einer Geraden.",
    es:"La regresión lineal es el <strong>punto de partida del machine learning</strong>. Modela la relación entre una variable dependiente y y una o más variables independientes X ajustando una línea recta que minimiza el error de predicción."},
  "ml.l1.math1": {
    en:"<strong>Hypothesis:</strong> h(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ — or in matrix form: <code>h(X) = Xθ</code>",
    tr:"<strong>Hipotez:</strong> h(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ — veya matris formunda: <code>h(X) = Xθ</code>",
    de:"<strong>Hypothese:</strong> h(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ — oder in Matrixform: <code>h(X) = Xθ</code>",
    es:"<strong>Hipótesis:</strong> h(x) = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ — o en forma matricial: <code>h(X) = Xθ</code>"},
  "ml.l1.p2":    {
    en:"The <strong>cost function</strong> measures how far our predictions are from actual values. For linear regression, we use <strong>Mean Squared Error (MSE)</strong>:",
    tr:"<strong>Maliyet fonksiyonu</strong>, tahminlerimizin gerçek değerlerden ne kadar uzak olduğunu ölçer. Doğrusal regresyon için <strong>Ortalama Kare Hatası (MSE)</strong> kullanırız:",
    de:"Die <strong>Kostenfunktion</strong> misst, wie weit unsere Vorhersagen von den tatsächlichen Werten entfernt sind. Für lineare Regression verwenden wir den <strong>mittleren quadratischen Fehler (MSE)</strong>:",
    es:"La <strong>función de costo</strong> mide cuán lejos están nuestras predicciones de los valores reales. Para regresión lineal usamos el <strong>Error Cuadrático Medio (MSE)</strong>:"},
  "ml.l1.math2": {
    en:"<strong>MSE:</strong> J(θ) = (1/2m) Σ(h(xⁱ) − yⁱ)² — where m is the number of training samples.",
    tr:"<strong>MSE:</strong> J(θ) = (1/2m) Σ(h(xⁱ) − yⁱ)² — burada m eğitim örneklerinin sayısıdır.",
    de:"<strong>MSE:</strong> J(θ) = (1/2m) Σ(h(xⁱ) − yⁱ)² — wobei m die Anzahl der Trainingsbeispiele ist.",
    es:"<strong>MSE:</strong> J(θ) = (1/2m) Σ(h(xⁱ) − yⁱ)² — donde m es el número de muestras de entrenamiento."},
  "ml.l1.p3":    {
    en:"The goal is to find θ values that minimize J(θ). Two approaches: <strong>closed-form solution</strong> (Normal Equation) or <strong>iterative optimization</strong> (Gradient Descent).",
    tr:"Amaç, J(θ)'yi minimize eden θ değerlerini bulmaktır. İki yaklaşım: <strong>kapalı form çözüm</strong> (Normal Denklem) veya <strong>yinelemeli optimizasyon</strong> (Gradyan İnişi).",
    de:"Das Ziel ist es, θ-Werte zu finden, die J(θ) minimieren. Zwei Ansätze: <strong>geschlossene Lösung</strong> (Normalgleichung) oder <strong>iterative Optimierung</strong> (Gradientenabstieg).",
    es:"El objetivo es encontrar valores θ que minimicen J(θ). Dos enfoques: <strong>solución cerrada</strong> (Ecuación Normal) u <strong>optimización iterativa</strong> (Descenso de Gradiente)."},
  "ml.l1.tip":   {
    en:"<strong>R² Score:</strong> 1.0 means perfect prediction, 0.0 means the model is no better than predicting the mean. Negative R² means worse than mean prediction.",
    tr:"<strong>R² Skoru:</strong> 1.0 mükemmel tahmin, 0.0 modelin ortalama tahmin etmekten daha iyi olmadığını gösterir. Negatif R² ortalama tahmininden daha kötü demektir.",
    de:"<strong>R²-Score:</strong> 1.0 bedeutet perfekte Vorhersage, 0.0 bedeutet nicht besser als der Mittelwert. Negatives R² bedeutet schlechter als Mittelwert-Vorhersage.",
    es:"<strong>R² Score:</strong> 1.0 significa predicción perfecta, 0.0 significa que el modelo no es mejor que predecir la media. R² negativo significa peor que la predicción media."},

  "ml.l2.t":     {en:"Gradient Descent & Optimization",tr:"Gradyan İnişi & Optimizasyon",de:"Gradientenabstieg & Optimierung",es:"Descenso de Gradiente y Optimización"},
  "ml.l2.s":     {en:"Learning rate · Batch / Mini-batch / Stochastic GD · Convergence · 12 min",tr:"Öğrenme oranı · Toplu / Mini-toplu / Stokastik Gİ · Yakınsama · 12 dk",de:"Lernrate · Batch / Mini-batch / Stochastischer GD · Konvergenz · 12 Min.",es:"Tasa de aprendizaje · Batch / Mini-batch / GD Estocástico · Convergencia · 12 min"},
  "ml.l2.p1":    {
    en:"Gradient Descent is the <strong>core optimization algorithm</strong> behind nearly all ML and DL models. Instead of solving analytically, we iteratively update parameters in the direction that reduces the cost function.",
    tr:"Gradyan İnişi, neredeyse tüm ML ve DL modellerinin arkasındaki <strong>temel optimizasyon algoritmasıdır</strong>. Analitik olarak çözmek yerine, maliyet fonksiyonunu azaltan yönde parametreleri yinelemeli olarak güncelleriz.",
    de:"Gradientenabstieg ist der <strong>zentrale Optimierungsalgorithmus</strong> hinter fast allen ML- und DL-Modellen. Anstatt analytisch zu lösen, aktualisieren wir Parameter iterativ in Richtung der Kostenreduktion.",
    es:"El Descenso de Gradiente es el <strong>algoritmo de optimización central</strong> detrás de casi todos los modelos ML y DL. En lugar de resolver analíticamente, actualizamos parámetros iterativamente en la dirección que reduce la función de costo."},
  "ml.l2.math":  {
    en:"<strong>Update rule:</strong> θⱼ := θⱼ − α · (∂J/∂θⱼ) — where α is the <strong>learning rate</strong> that controls step size.",
    tr:"<strong>Güncelleme kuralı:</strong> θⱼ := θⱼ − α · (∂J/∂θⱼ) — burada α, adım boyutunu kontrol eden <strong>öğrenme oranıdır</strong>.",
    de:"<strong>Aktualisierungsregel:</strong> θⱼ := θⱼ − α · (∂J/∂θⱼ) — wobei α die <strong>Lernrate</strong> ist, die die Schrittweite steuert.",
    es:"<strong>Regla de actualización:</strong> θⱼ := θⱼ − α · (∂J/∂θⱼ) — donde α es la <strong>tasa de aprendizaje</strong> que controla el tamaño del paso."},
  "ml.l2.p2":    {
    en:"Three variants exist based on how much data is used per update:",
    tr:"Güncelleme başına ne kadar veri kullanıldığına göre üç varyant vardır:",
    de:"Drei Varianten existieren je nach Datenmenge pro Aktualisierung:",
    es:"Existen tres variantes según cuántos datos se usan por actualización:"},
  "ml.l2.p3":    {
    en:"<strong>Batch GD:</strong> Uses the entire dataset per step — stable but slow for large datasets. <strong>Stochastic GD (SGD):</strong> Uses a single random sample — fast but noisy. <strong>Mini-batch GD:</strong> Uses a subset (typically 32-256 samples) — the practical sweet spot used in deep learning.",
    tr:"<strong>Toplu Gİ:</strong> Her adımda tüm veri setini kullanır — kararlı ama büyük veri setleri için yavaş. <strong>Stokastik Gİ (SGD):</strong> Tek rastgele örnek kullanır — hızlı ama gürültülü. <strong>Mini-toplu Gİ:</strong> Bir alt küme kullanır (tipik olarak 32-256 örnek) — derin öğrenmede kullanılan pratik denge noktası.",
    de:"<strong>Batch-GD:</strong> Verwendet den gesamten Datensatz pro Schritt — stabil aber langsam. <strong>Stochastischer GD (SGD):</strong> Verwendet eine einzelne Stichprobe — schnell aber verrauscht. <strong>Mini-batch-GD:</strong> Verwendet eine Teilmenge (typisch 32-256) — der praktische Sweet Spot im Deep Learning.",
    es:"<strong>GD por lotes:</strong> Usa todo el dataset por paso — estable pero lento. <strong>GD Estocástico (SGD):</strong> Usa una muestra aleatoria — rápido pero ruidoso. <strong>GD Mini-batch:</strong> Usa un subconjunto (típicamente 32-256) — el punto ideal en deep learning."},
  "ml.l2.warn":  {
    en:"<strong>Learning rate matters:</strong> Too high → divergence (cost oscillates or explodes). Too low → extremely slow convergence. Common starting values: 0.01, 0.001, 0.0001.",
    tr:"<strong>Öğrenme oranı önemlidir:</strong> Çok yüksek → sapma (maliyet salınır veya patlar). Çok düşük → aşırı yavaş yakınsama. Yaygın başlangıç değerleri: 0.01, 0.001, 0.0001.",
    de:"<strong>Lernrate ist wichtig:</strong> Zu hoch → Divergenz (Kosten oszillieren oder explodieren). Zu niedrig → extrem langsame Konvergenz. Übliche Startwerte: 0,01, 0,001, 0,0001.",
    es:"<strong>La tasa de aprendizaje importa:</strong> Muy alta → divergencia (costo oscila o explota). Muy baja → convergencia extremadamente lenta. Valores iniciales comunes: 0.01, 0.001, 0.0001."},

  "ml.l3.t":     {en:"Logistic Regression & Classification",tr:"Lojistik Regresyon & Sınıflandırma",de:"Logistische Regression & Klassifikation",es:"Regresión Logística y Clasificación"},
  "ml.l3.s":     {en:"Sigmoid function · Binary Cross-Entropy · Decision boundary · 10 min",tr:"Sigmoid fonksiyonu · İkili Çapraz Entropi · Karar sınırı · 10 dk",de:"Sigmoid-Funktion · Binäre Kreuzentropie · Entscheidungsgrenze · 10 Min.",es:"Función sigmoide · Entropía cruzada binaria · Frontera de decisión · 10 min"},
  "ml.l3.p1":    {
    en:"Despite its name, logistic regression is a <strong>classification algorithm</strong>. It predicts the probability that an input belongs to a particular class by passing the linear combination through a <strong>sigmoid function</strong>.",
    tr:"Adına rağmen, lojistik regresyon bir <strong>sınıflandırma algoritmasıdır</strong>. Doğrusal kombinasyonu <strong>sigmoid fonksiyonundan</strong> geçirerek bir girdinin belirli bir sınıfa ait olma olasılığını tahmin eder.",
    de:"Trotz des Namens ist logistische Regression ein <strong>Klassifikationsalgorithmus</strong>. Er sagt die Wahrscheinlichkeit vorher, dass eine Eingabe zu einer bestimmten Klasse gehört, indem die Linearkombination durch eine <strong>Sigmoid-Funktion</strong> geleitet wird.",
    es:"A pesar de su nombre, la regresión logística es un <strong>algoritmo de clasificación</strong>. Predice la probabilidad de que una entrada pertenezca a una clase particular pasando la combinación lineal a través de una <strong>función sigmoide</strong>."},
  "ml.l3.math":  {
    en:"<strong>Sigmoid:</strong> σ(z) = 1 / (1 + e⁻ᶻ) — maps any real number to the range (0, 1). The output is interpreted as P(y=1|x).",
    tr:"<strong>Sigmoid:</strong> σ(z) = 1 / (1 + e⁻ᶻ) — herhangi bir reel sayıyı (0, 1) aralığına eşler. Çıktı P(y=1|x) olarak yorumlanır.",
    de:"<strong>Sigmoid:</strong> σ(z) = 1 / (1 + e⁻ᶻ) — bildet jede reelle Zahl auf den Bereich (0, 1) ab. Die Ausgabe wird als P(y=1|x) interpretiert.",
    es:"<strong>Sigmoid:</strong> σ(z) = 1 / (1 + e⁻ᶻ) — mapea cualquier número real al rango (0, 1). La salida se interpreta como P(y=1|x)."},
  "ml.l3.p2":    {
    en:"The cost function is <strong>Binary Cross-Entropy (Log Loss)</strong>: J(θ) = −(1/m) Σ [yⁱ log(h(xⁱ)) + (1−yⁱ) log(1−h(xⁱ))]. This penalizes confident wrong predictions heavily.",
    tr:"Maliyet fonksiyonu <strong>İkili Çapraz Entropi (Log Loss)</strong>'dir: J(θ) = −(1/m) Σ [yⁱ log(h(xⁱ)) + (1−yⁱ) log(1−h(xⁱ))]. Yanlış güvenli tahminleri ağır şekilde cezalandırır.",
    de:"Die Kostenfunktion ist <strong>Binäre Kreuzentropie (Log Loss)</strong>: J(θ) = −(1/m) Σ [yⁱ log(h(xⁱ)) + (1−yⁱ) log(1−h(xⁱ))]. Falsche, selbstbewusste Vorhersagen werden stark bestraft.",
    es:"La función de costo es <strong>Entropía Cruzada Binaria (Log Loss)</strong>: J(θ) = −(1/m) Σ [yⁱ log(h(xⁱ)) + (1−yⁱ) log(1−h(xⁱ))]. Penaliza fuertemente las predicciones erróneas con alta confianza."},
  "ml.l3.tip":   {
    en:"<strong>Multi-class:</strong> Logistic regression extends to multi-class via <strong>One-vs-Rest (OvR)</strong> or <strong>Softmax regression</strong> (multinomial). Scikit-learn handles this automatically with <code>multi_class='multinomial'</code>.",
    tr:"<strong>Çok sınıflı:</strong> Lojistik regresyon, <strong>Bire-Karşı-Hepsi (OvR)</strong> veya <strong>Softmax regresyonu</strong> (multinomial) ile çok sınıfa genişletilir. Scikit-learn bunu <code>multi_class='multinomial'</code> ile otomatik yapar.",
    de:"<strong>Mehrklassen:</strong> Logistische Regression erweitert sich auf Mehrklassen über <strong>One-vs-Rest (OvR)</strong> oder <strong>Softmax-Regression</strong>. Scikit-learn handhabt dies automatisch.",
    es:"<strong>Multi-clase:</strong> La regresión logística se extiende a multi-clase vía <strong>One-vs-Rest (OvR)</strong> o <strong>regresión Softmax</strong> (multinomial). Scikit-learn lo maneja automáticamente."},

  "ml.l4.t":     {en:"Regularization — Overfitting & Underfitting",tr:"Düzenleme — Aşırı Öğrenme & Yetersiz Öğrenme",de:"Regularisierung — Overfitting & Underfitting",es:"Regularización — Sobreajuste y Subajuste"},
  "ml.l4.s":     {en:"L1 (Lasso) · L2 (Ridge) · ElasticNet · Bias-Variance tradeoff · 10 min",tr:"L1 (Lasso) · L2 (Ridge) · ElasticNet · Yanlılık-Varyans dengesi · 10 dk",de:"L1 (Lasso) · L2 (Ridge) · ElasticNet · Bias-Varianz-Kompromiss · 10 Min.",es:"L1 (Lasso) · L2 (Ridge) · ElasticNet · Compensación sesgo-varianza · 10 min"},
  "ml.l4.p1":    {
    en:"<strong>Overfitting</strong> occurs when a model memorizes training data (high variance, low bias) — it performs well on training data but poorly on unseen data. <strong>Underfitting</strong> means the model is too simple to capture patterns (high bias, low variance).",
    tr:"<strong>Aşırı öğrenme</strong>, model eğitim verilerini ezberlediğinde (yüksek varyans, düşük yanlılık) meydana gelir — eğitim verilerinde iyi performans gösterir ama görülmemiş verilerde kötü. <strong>Yetersiz öğrenme</strong>, modelin kalıpları yakalamak için çok basit olduğu anlamına gelir (yüksek yanlılık, düşük varyans).",
    de:"<strong>Overfitting</strong> tritt auf, wenn ein Modell Trainingsdaten auswendig lernt (hohe Varianz, niedriger Bias). <strong>Underfitting</strong> bedeutet, das Modell ist zu einfach, um Muster zu erfassen (hoher Bias, niedrige Varianz).",
    es:"<strong>Sobreajuste</strong> ocurre cuando un modelo memoriza datos de entrenamiento (alta varianza, bajo sesgo). <strong>Subajuste</strong> significa que el modelo es demasiado simple para capturar patrones (alto sesgo, baja varianza)."},

  "ml.l5.t":     {en:"Support Vector Machines (SVM)",tr:"Destek Vektör Makineleri (SVM)",de:"Support Vector Machines (SVM)",es:"Máquinas de Vectores de Soporte (SVM)"},
  "ml.l5.s":     {en:"Maximum margin · Kernel trick · RBF · C parameter · 10 min",tr:"Maksimum marjin · Çekirdek hilesi · RBF · C parametresi · 10 dk",de:"Maximale Marge · Kernel-Trick · RBF · C-Parameter · 10 Min.",es:"Margen máximo · Truco del kernel · RBF · Parámetro C · 10 min"},
  "ml.l5.p1":    {
    en:"SVM finds the <strong>hyperplane that maximizes the margin</strong> between two classes. The data points closest to the decision boundary are called <strong>support vectors</strong> — only these points influence the model.",
    tr:"SVM, iki sınıf arasındaki <strong>marjini maksimize eden hiperdüzlemi</strong> bulur. Karar sınırına en yakın veri noktalarına <strong>destek vektörleri</strong> denir — modeli yalnızca bu noktalar etkiler.",
    de:"SVM findet die <strong>Hyperebene, die den Abstand maximiert</strong> zwischen zwei Klassen. Die nächsten Datenpunkte zur Entscheidungsgrenze heißen <strong>Stützvektoren</strong>.",
    es:"SVM encuentra el <strong>hiperplano que maximiza el margen</strong> entre dos clases. Los puntos más cercanos a la frontera de decisión se llaman <strong>vectores de soporte</strong>."},

  "ml.l6.t":     {en:"Decision Trees & Ensemble Methods",tr:"Karar Ağaçları & Topluluk Yöntemleri",de:"Entscheidungsbäume & Ensemble-Methoden",es:"Árboles de Decisión y Métodos Ensemble"},
  "ml.l6.s":     {en:"Gini / Entropy · Random Forest · Gradient Boosting · XGBoost · 12 min",tr:"Gini / Entropi · Rastgele Orman · Gradyan Artırma · XGBoost · 12 dk",de:"Gini / Entropie · Random Forest · Gradient Boosting · XGBoost · 12 Min.",es:"Gini / Entropía · Random Forest · Gradient Boosting · XGBoost · 12 min"},
  "ml.l6.p1":    {
    en:"Decision trees split data recursively based on feature thresholds. At each node, the algorithm chooses the split that maximizes <strong>information gain</strong> (via Gini impurity or Entropy). Trees are intuitive but prone to overfitting.",
    tr:"Karar ağaçları, özellik eşiklerine göre verileri özyinelemeli olarak böler. Her düğümde algoritma, <strong>bilgi kazancını</strong> (Gini safsızlığı veya Entropi yoluyla) maksimize eden bölünmeyi seçer. Ağaçlar sezgiseldir ancak aşırı öğrenmeye eğilimlidir.",
    de:"Entscheidungsbäume teilen Daten rekursiv basierend auf Merkmalsschwellenwerten. An jedem Knoten wählt der Algorithmus die Teilung, die den <strong>Informationsgewinn</strong> maximiert (Gini-Unreinheit oder Entropie).",
    es:"Los árboles de decisión dividen datos recursivamente según umbrales de características. En cada nodo, el algoritmo elige la división que maximiza la <strong>ganancia de información</strong> (Gini o Entropía)."},
  "ml.l6.tip":   {
    en:"<strong>In practice:</strong> Random Forest is a strong baseline for tabular data. XGBoost/LightGBM often win Kaggle competitions. Start with Random Forest, then try boosting if you need more accuracy.",
    tr:"<strong>Pratikte:</strong> Rastgele Orman, tablo veriler için güçlü bir temel modeldir. XGBoost/LightGBM genellikle Kaggle yarışmalarını kazanır. Rastgele Orman ile başlayın, daha fazla doğruluk gerekiyorsa artırma deneyin.",
    de:"<strong>In der Praxis:</strong> Random Forest ist eine starke Baseline für tabellarische Daten. XGBoost/LightGBM gewinnen oft Kaggle-Wettbewerbe.",
    es:"<strong>En la práctica:</strong> Random Forest es una base sólida para datos tabulares. XGBoost/LightGBM frecuentemente ganan competencias Kaggle."},

  "ml.l7.t":     {en:"Unsupervised Learning — Clustering",tr:"Gözetimsiz Öğrenme — Kümeleme",de:"Unüberwachtes Lernen — Clustering",es:"Aprendizaje No Supervisado — Clustering"},
  "ml.l7.s":     {en:"K-Means · DBSCAN · Silhouette score · Elbow method · 10 min",tr:"K-Means · DBSCAN · Siluet skoru · Dirsek yöntemi · 10 dk",de:"K-Means · DBSCAN · Silhouette-Score · Ellbogen-Methode · 10 Min.",es:"K-Means · DBSCAN · Puntuación Silhouette · Método del codo · 10 min"},
  "ml.l7.p1":    {
    en:"Unsupervised learning finds patterns in <strong>unlabeled data</strong>. Clustering groups similar data points together without predefined categories — useful for customer segmentation, anomaly detection, and document grouping in NLP.",
    tr:"Gözetimsiz öğrenme, <strong>etiketlenmemiş verilerde</strong> kalıplar bulur. Kümeleme, önceden tanımlanmış kategoriler olmadan benzer veri noktalarını gruplar — müşteri segmentasyonu, anomali tespiti ve NLP'de belge gruplama için kullanışlıdır.",
    de:"Unüberwachtes Lernen findet Muster in <strong>nicht-markierten Daten</strong>. Clustering gruppiert ähnliche Datenpunkte ohne vordefinierte Kategorien — nützlich für Kundensegmentierung und Dokumentengruppierung.",
    es:"El aprendizaje no supervisado encuentra patrones en <strong>datos sin etiquetar</strong>. El clustering agrupa puntos similares sin categorías predefinidas — útil para segmentación de clientes y agrupación de documentos en NLP."},
  "ml.l7.tip":   {
    en:"<strong>NLP connection:</strong> Clustering is used for document grouping, topic modeling, and word embedding analysis (e.g., clustering Word2Vec vectors to find semantic groups).",
    tr:"<strong>NLP bağlantısı:</strong> Kümeleme, belge gruplama, konu modelleme ve kelime gömme analizi için kullanılır (örn. semantik gruplar bulmak için Word2Vec vektörlerini kümeleme).",
    de:"<strong>NLP-Verbindung:</strong> Clustering wird für Dokumentengruppierung, Topic Modeling und Worteinbettungsanalyse verwendet.",
    es:"<strong>Conexión NLP:</strong> El clustering se usa para agrupación de documentos, modelado de temas y análisis de word embeddings."},
  /* Shared Tutorial UI */
  "tui.lessons":  {en:"Lessons",tr:"Dersler",de:"Lektionen",es:"Lecciones"},
  "tui.level":    {en:"Level",tr:"Seviye",de:"Niveau",es:"Nivel"},
  "tui.prereq":   {en:"Prerequisites",tr:"Ön Koşullar",de:"Voraussetzungen",es:"Requisitos previos"},
  "tui.copy":     {en:"Copy",tr:"Kopyala",de:"Kopieren",es:"Copiar"},
  "tui.copied":   {en:"Copied!",tr:"Kopyalandı!",de:"Kopiert!",es:"¡Copiado!"},
  "tui.back":     {en:"← All Tutorials",tr:"← Tüm Eğitimler",de:"← Alle Tutorials",es:"← Todos los Tutoriales"},
};
Object.assign(T, T_LOCAL);
