"""Sidebar v3 — clean premium single-color design.
   - Prominent current-page card at top
   - Flat group structure matching the main tutorials page
   - Single gold accent throughout (no rainbow)
   - Subtle hover / open states, clean typography
"""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# ===================================================================== LESSON DATA

NLP_LESSONS = [
    (1,  "L1",  "Text Preprocessing",           "Metin Ön İşleme"),
    (2,  "L2",  "BoW, TF-IDF &amp; n-grams",    "TDF, TF-IDF &amp; n-gramlar"),
    (3,  "L3",  "Text Classification",          "Metin Sınıflandırma"),
    (4,  "L4",  "Sentiment Analysis",           "Duygu Analizi"),
    (5,  "L5",  "Word Embeddings",              "Kelime Gömmeleri"),
    (6,  "L6",  "Topic Modeling",               "Konu Modelleme"),
    (7,  "L7",  "Sequence Labeling &amp; IE",   "Dizi Etiketleme &amp; BÇ"),
    (8,  "L8",  "Language Models",              "Dil Modelleri"),
    (9,  "L9",  "Seq2Seq &amp; Attention",      "Seq2Seq &amp; Dikkat"),
    (10, "L10", "Transformers &amp; BERT",      "Transformerler &amp; BERT"),
    (11, "L11", "Generative LLMs",              "Üretici LLM'ler"),
    (12, "L12", "Applied NLP",                  "Uygulamalı NLP"),
]

DL_LESSONS = [
    (1,  "L1",  "Neural Networks Intro (Perceptron, MLP)",     "Sinir Ağına Giriş (Perceptron, MLP)"),
    (2,  "L2",  "Activations &amp; Loss Functions",            "Aktivasyon &amp; Kayıp Fonksiyonları"),
    (3,  "L3",  "Backpropagation &amp; Computational Graphs",  "Backpropagation &amp; Hesap Grafı"),
    (4,  "L4",  "Optimization &amp; Training Dynamics",        "Optimizasyon &amp; Eğitim Dinamiği"),
    (5,  "L5",  "Regularization &amp; Normalization",          "Regularization &amp; Normalization"),
    (6,  "L6",  "CNN &amp; Computer Vision",                   "CNN &amp; Bilgisayarla Görü"),
    (7,  "L7",  "Transfer Learning &amp; Pre-training",        "Transfer Learning &amp; Pre-training"),
    (8,  "L8",  "RNN &amp; LSTM (Sequence Models)",            "RNN &amp; LSTM (Sıralı Modeller)"),
    (9,  "L9",  "Attention &amp; Transformers",                "Attention &amp; Transformers"),
    (10, "L10", "Generative Models (VAE, GAN, Diffusion)",     "Generative Modeller (VAE, GAN, Diffusion)"),
    (11, "L11", "Production, Efficiency &amp; MLOps",          "Üretim, Verimlilik &amp; MLOps"),
]

ML_THEORY_LESSONS = [
    (1,  "", "What is Machine Learning?",     "Makine Öğrenmesi Nedir?"),
    (2,  "", "Linear Regression",             "Lineer Regresyon"),
    (3,  "", "Logistic Regression &amp; Classification", "Lojistik Regresyon &amp; Sınıflandırma"),
    (4,  "", "Generalisation: Bias-Variance &amp; CV", "Genelleme: Bias-Variance &amp; CV"),
    (5,  "", "Evaluation &amp; Hyperparameter Tuning", "Değerlendirme &amp; Hyperparameter Tuning"),
    (6,  "", "Regularisation",                "Regularization"),
    (7,  "", "Trees &amp; Ensembles (XGBoost)", "Ağaçlar &amp; Ensemble (XGBoost)"),
    (8,  "", "Clustering",                    "Kümeleme (Clustering)"),
    (9,  "", "Dimensionality Reduction",      "Boyut İndirgeme"),
    (10, "", "Feature Engineering &amp; Imbalanced Data", "Özellik Mühendisliği &amp; Dengesiz Veri"),
    (11, "", "MLOps &amp; Production",        "MLOps &amp; Üretim"),
]

LINALG_LESSONS = [
    (1, "", "Vectors &amp; Spaces",   "Vektörler &amp; Uzaylar"),
    (2, "", "Matrices",               "Matrisler"),
    (3, "", "Linear Systems",         "Doğrusal Sistemler"),
    (4, "", "Eigenvalues",            "Özdeğerler"),
    (5, "", "SVD",                    "SVD"),
    (6, "", "Tensors",                "Tensörler"),
]

CALCULUS_LESSONS = [
    (1, "", "Limits &amp; Derivatives",    "Limitler &amp; Türevler"),
    (2, "", "Differentiation Rules",       "Türev Kuralları"),
    (3, "", "Partial Derivatives",         "Kısmi Türevler"),
    (4, "", "Chain Rule &amp; Backprop",   "Zincir Kuralı &amp; Backprop"),
    (5, "", "Integration for ML",          "ML İçin İntegral"),
    (6, "", "Optimization &amp; GD",       "Optimizasyon &amp; GD"),
]

ML_MATH_LESSONS = [
    (1, "", "Probability Fundamentals",       "Olasılık Temelleri"),
    (2, "", "Statistics &amp; Distributions", "İstatistik &amp; Dağılımlar"),
    (3, "", "Bayesian Thinking",              "Bayesçi Düşünme"),
    (4, "", "Information Theory",             "Bilgi Teorisi"),
    (5, "", "Optimization Theory",            "Optimizasyon Teorisi"),
    (6, "", "Numerical Methods",              "Sayısal Yöntemler"),
]

PYTHON_LESSONS = [
    (1, "", "Setup &amp; Fundamentals",           "Kurulum &amp; Temeller"),
    (2, "", "Control Flow &amp; Functions",      "Kontrol Akışı &amp; Fonksiyonlar"),
    (3, "", "Data Structures",                    "Veri Yapıları"),
    (4, "", "OOP &amp; Classes",                  "OOP &amp; Sınıflar"),
    (5, "", "File I/O &amp; Error Handling",      "Dosya I/O &amp; Hata Yönetimi"),
    (6, "", "Advanced Python",                    "İleri Python"),
]

NUMPY_LESSONS = [
    (1, "", "Arrays &amp; Creation",              "Diziler &amp; Oluşturma"),
    (2, "", "Indexing &amp; Slicing",             "İndeksleme &amp; Dilimleme"),
    (3, "", "Broadcasting &amp; Vectorization",   "Broadcasting &amp; Vektörizasyon"),
    (4, "", "Statistics &amp; Sorting",           "İstatistik &amp; Sıralama"),
    (5, "", "Linear Algebra",                     "Doğrusal Cebir"),
    (6, "", "Random &amp; Practical",             "Rastgele &amp; Pratik"),
]

PANDAS_LESSONS = [
    (1, "", "Series &amp; DataFrames",            "Series &amp; DataFrame"),
    (2, "", "Data Loading &amp; Export",          "Veri Yükleme &amp; Dışa Aktarma"),
    (3, "", "Selection &amp; Filtering",          "Seçim &amp; Filtreleme"),
    (4, "", "Data Cleaning",                      "Veri Temizleme"),
    (5, "", "GroupBy &amp; Aggregation",          "GroupBy &amp; Toplama"),
    (6, "", "Merging &amp; Reshaping",            "Birleştirme &amp; Yeniden Şekillendirme"),
]

C_LESSONS = [
    (1, "", "Hello World &amp; Compilation",    "Merhaba Dünya &amp; Derleme"),
    (2, "", "Variables &amp; Data Types",       "Değişkenler &amp; Veri Tipleri"),
    (3, "", "Pointers &amp; Memory",             "İşaretçiler &amp; Bellek"),
    (4, "", "Functions &amp; Recursion",         "Fonksiyonlar &amp; Özyineleme"),
    (5, "", "Arrays, Strings &amp; Structs",     "Diziler, Dizgiler &amp; Yapılar"),
    (6, "", "File I/O &amp; Preprocessor",       "Dosya G/Ç &amp; Önişlemci"),
]

CPP_LESSONS = [
    (1, "", "C++ Fundamentals &amp; Modern Setup",     "C++ Temelleri &amp; Modern Kurulum"),
    (2, "", "Object-Oriented Programming",              "Nesne Yönelimli Programlama"),
    (3, "", "Inheritance &amp; Polymorphism",           "Kalıtım &amp; Çok Biçimlilik"),
    (4, "", "Templates &amp; Generic Programming",      "Şablonlar &amp; Genel Programlama"),
    (5, "", "Smart Pointers &amp; Memory Management",   "Akıllı İşaretçiler &amp; Bellek Yönetimi"),
    (6, "", "Modern C++ (C++11/14/17/20)",              "Modern C++ (C++11/14/17/20)"),
    (7, "", "File I/O &amp; String Processing",         "Dosya G/Ç &amp; Dizi İşleme"),
    (8, "", "Mini Library Project",                     "Mini Kütüphane Projesi"),
]

JS_LESSONS = [
    (1, "", "JavaScript Fundamentals",                  "JavaScript Temelleri"),
    (2, "", "Operators, Conditionals &amp; Loops",      "Operatörler, Koşullar ve Döngüler"),
    (3, "", "Functions &amp; Scope",                    "Fonksiyonlar ve Kapsam"),
    (4, "", "Arrays &amp; Objects",                     "Diziler ve Nesneler"),
    (5, "", "DOM Manipulation &amp; Events",            "DOM Manipülasyonu ve Olaylar"),
    (6, "", "Asynchronous JavaScript",                  "Asenkron JavaScript"),
    (7, "", "ES6+ Modern Features",                     "ES6+ Modern Özellikler"),
    (8, "", "Error Handling, Storage &amp; Best Practices", "Hata Yönetimi, Depolama ve En İyi Uygulamalar"),
]

LATEX_LESSONS = [
    (1, "", "What is LaTeX &amp; Setup",                "LaTeX Nedir ve Kurulum"),
    (2, "", "Text Formatting &amp; Structure",          "Metin Biçimlendirme ve Yapı"),
    (3, "", "Mathematics in LaTeX",                     "LaTeX&rsquo;te Matematik"),
    (4, "", "Tables &amp; Figures",                     "Tablolar ve Şekiller"),
    (5, "", "Document Structure &amp; Layout",          "Doküman Yapısı ve Düzen"),
    (6, "", "Beamer Presentations",                     "Beamer Sunumları"),
    (7, "", "Bibliography &amp; Citations",             "Kaynakça ve Atıflar"),
    (8, "", "Advanced LaTeX",                           "İleri Düzey LaTeX"),
]

# NLP & DL full meta (for regenerating their HTML shells from scratch)
NLP_META = {
    1:  ("Cleaning, tokenization, normalization — <strong>foundation of every NLP pipeline</strong>.",
         "Temizleme, tokenleştirme, normalleştirme — <strong>her NLP boru hattının temeli</strong>.",
         "28 min", "⎇", "spaCy · NLTK"),
    2:  ("From raw text to numeric vectors — <strong>classical workhorses of NLP</strong>.",
         "Ham metinden sayısal vektörlere — <strong>NLP'nin klasik iş atları</strong>.",
         "25 min", "∑", "scikit-learn · gensim"),
    3:  ("Naive Bayes, SVM, Logistic Regression — <strong>the foundation of applied NLP</strong>.",
         "Naive Bayes, SVM, Lojistik Regresyon — <strong>uygulamalı NLP'nin temeli</strong>.",
         "28 min", "▣", "scikit-learn"),
    4:  ("Lexicons, ML, deep learning — <strong>reading emotion from text</strong>.",
         "Sözlükler, ML, derin öğrenme — <strong>metinden duygu okumak</strong>.",
         "30 min", "❤", "VADER · BERT"),
    5:  ("Word2Vec, GloVe, FastText, subword tokenization — <strong>dense, meaningful vectors</strong>.",
         "Word2Vec, GloVe, FastText, alt-kelime — <strong>yoğun, anlamlı vektörler</strong>.",
         "32 min", "vec", "gensim · PyTorch"),
    6:  ("LSA, LDA, NMF, BERTopic — <strong>discovering hidden themes</strong>.",
         "LSA, LDA, NMF, BERTopic — <strong>gizli temaları keşfetmek</strong>.",
         "30 min", "📚", "gensim · BERTopic"),
    7:  ("POS, NER, HMM, CRF, BiLSTM-CRF — <strong>structured knowledge from text</strong>.",
         "POS, NER, HMM, CRF, BiLSTM-CRF — <strong>metinden yapılandırılmış bilgi</strong>.",
         "45 min", "NER", "spaCy · seqeval"),
    8:  ("N-grams, smoothing, perplexity, neural LMs — <strong>mathematical spine of modern NLP</strong>.",
         "N-gramlar, düzeltme, karmaşıklık, sinirsel LM'ler — <strong>NLP'nin matematiksel omurgası</strong>.",
         "35 min", "P(x)", "KenLM · PyTorch"),
    9:  ("Encoder-decoder, attention, BLEU, ROUGE — <strong>the bridge to Transformers</strong>.",
         "Kodlayıcı-kod çözücü, dikkat, BLEU, ROUGE — <strong>Transformerlere köprü</strong>.",
         "40 min", "→", "PyTorch · sacrebleu"),
    10: ("Self-attention, multi-head, positional encoding — <strong>the architecture that ate NLP</strong>.",
         "Kendi-dikkat, çok başlı, pozisyonel kodlama — <strong>NLP'yi yutan mimari</strong>.",
         "50 min", "🤖", "transformers"),
    11: ("GPT, scaling laws, SFT, RLHF, LoRA — <strong>from pretrained to aligned assistant</strong>.",
         "GPT, ölçekleme yasaları, SFT, RLHF, LoRA — <strong>ön eğitimli modelden hizalı asistana</strong>.",
         "55 min", "GPT", "transformers · peft · trl"),
    12: ("RAG, agents, multilingual, evaluation, ethics — <strong>turning knowledge into systems</strong>.",
         "RAG, ajanlar, çok dilli, değerlendirme, etik — <strong>bilgiyi sistemlere dönüştürmek</strong>.",
         "50 min", "RAG", "langchain · ragas"),
}

DL_META = {
    1:  ("From a single neuron to a universal function approximator — <strong>the foundation of modern AI</strong>.",
         "Tek nörondan evrensel fonksiyon yaklaştırıcısına — <strong>modern yapay zekanın temeli</strong>.",
         "35 min", "σ", "PyTorch · NumPy"),
    2:  ("Chain rule through a computational graph — <strong>how deep networks learn</strong>.",
         "Hesaplama grafı üzerinde zincir kuralı — <strong>derin ağlar nasıl öğrenir</strong>.",
         "38 min", "∇", "PyTorch · Autograd"),
    3:  ("SGD, momentum, Adam, AdamW, LR schedules — <strong>the art of making gradient descent work</strong>.",
         "SGD, momentum, Adam, AdamW, LR planları — <strong>gradyan inişini işe yarar yapma sanatı</strong>.",
         "35 min", "η", "PyTorch"),
    4:  ("Dropout, BatchNorm, LayerNorm, weight decay, Mixup — <strong>taming overfitting</strong>.",
         "Dropout, BatchNorm, LayerNorm, ağırlık azaltma, Mixup — <strong>aşırı uyumu evcilleştirme</strong>.",
         "35 min", "λ", "PyTorch"),
    5:  ("Convolutions, pooling, ResNet, EfficientNet, ViT — <strong>how machines see</strong>.",
         "Evrişim, havuzlama, ResNet, EfficientNet, ViT — <strong>makineler nasıl görür</strong>.",
         "45 min", "⊛", "PyTorch · torchvision"),
    6:  ("Recurrence, BPTT, gates, vanishing gradients — <strong>the architecture before Transformers</strong>.",
         "Tekrarlama, BPTT, kapılar, kaybolan gradyanlar — <strong>Transformer öncesi mimari</strong>.",
         "40 min", "⟳", "PyTorch"),
    7:  ("FlashAttention, RoPE, KV cache, PagedAttention — <strong>engineering behind modern AI</strong>.",
         "FlashAttention, RoPE, KV önbelleği — <strong>modern AI arkasındaki mühendislik</strong>.",
         "50 min", "⚡", "PyTorch · vLLM"),
    8:  ("Autoencoders, VAEs, GANs, Diffusion — <strong>how machines create</strong>.",
         "Otoenkoderlar, VAE'ler, GAN'ler, Difüzyon — <strong>makineler nasıl üretir</strong>.",
         "50 min", "~", "PyTorch · diffusers"),
    9:  ("Mixed precision, quantization, pruning, LoRA — <strong>more model per GPU hour</strong>.",
         "Karışık hassasiyet, nicemleme, budama, LoRA — <strong>GPU saati başına daha fazla model</strong>.",
         "45 min", "½", "PyTorch · bitsandbytes"),
    10: ("DDP, FSDP, ZeRO, tensor &amp; pipeline parallelism — <strong>training models bigger than one GPU</strong>.",
         "DDP, FSDP, ZeRO, tensör &amp; boru hattı paralelliği — <strong>tek GPU'dan büyük modelleri eğitmek</strong>.",
         "45 min", "⧉", "PyTorch FSDP"),
    11: ("Saliency, Grad-CAM, SHAP, probing — <strong>opening the black box</strong>.",
         "Belirginlik, Grad-CAM, SHAP, sondalama — <strong>kara kutuyu açmak</strong>.",
         "42 min", "?", "PyTorch · Captum"),
    12: ("End-to-end project, W&amp;B, reproducibility, serving — <strong>from notebook to production</strong>.",
         "Uçtan uca proje, W&amp;B, tekrarlanabilirlik, sunum — <strong>not defterinden üretime</strong>.",
         "45 min", "▶", "Lightning · W&amp;B"),
}


# ===================================================================== TRACK DEFINITIONS
# track_id -> (folder, display_name_en, display_name_tr, lessons_list or None)
TRACKS = {
    "c":          ("c",         "C Language",     "C Dili",             C_LESSONS),
    "cpp":        ("cpp",       "C++",            "C++",                CPP_LESSONS),
    "python":     ("python",    "Python Core",    "Python Çekirdek",   PYTHON_LESSONS),
    "numpy":      ("numpy",     "NumPy",          "NumPy",              NUMPY_LESSONS),
    "pandas":     ("pandas",    "Pandas",         "Pandas",             PANDAS_LESSONS),
    "linalg":     ("linalg",    "Linear Algebra", "Doğrusal Cebir",    LINALG_LESSONS),
    "calculus":   ("calculus",  "Calculus",       "Kalkülüs",           CALCULUS_LESSONS),
    "ml-math":    ("math",      "ML Mathematics", "ML Matematik",       ML_MATH_LESSONS),
    "ml-theory":  ("ml-theory", "ML Theory",      "ML Teorisi",         ML_THEORY_LESSONS),
    "dl":         ("deep",      "Deep Learning",  "Derin Öğrenme",     DL_LESSONS),
    "nlp":        ("nlp",       "NLP Course",     "NLP Kursu",          NLP_LESSONS),
    "js":         ("js",        "JavaScript",     "JavaScript",         JS_LESSONS),
    "latex":      ("latex",     "LaTeX",          "LaTeX",              LATEX_LESSONS),
}

# Header display (title shown on current-page card)
TRACK_HEADERS = {
    "c":          ("C LANGUAGE",      "C DİLİ",           "6 Lessons",                "6 Ders"),
    "cpp":        ("C++",             "C++",              "8 Lessons",                "8 Ders"),
    "python":     ("PYTHON CORE",     "PYTHON ÇEKİRDEK", "6 Lessons",                "6 Ders"),
    "numpy":      ("NUMPY",           "NUMPY",            "6 Lessons",                "6 Ders"),
    "pandas":     ("PANDAS",          "PANDAS",           "6 Lessons",                "6 Ders"),
    "linalg":     ("LINEAR ALGEBRA",  "DOĞRUSAL CEBİR", "6 Lessons",                "6 Ders"),
    "calculus":   ("CALCULUS",        "KALKÜLÜS",         "6 Lessons",                "6 Ders"),
    "ml-math":    ("ML MATHEMATICS",  "ML MATEMATİK",     "6 Lessons",                "6 Ders"),
    "ml-theory":  ("MACHINE LEARNING","MAKİNE ÖĞRENMESİ", "11 Lessons",               "11 Ders"),
    "dl":         ("DEEP LEARNING",   "DERİN ÖĞRENME",   "12 Lessons · Graduate",    "12 Ders · Lisansüstü"),
    "nlp":        ("NLP COURSE",      "NLP KURSU",        "12 Lessons · Graduate",    "12 Ders · Lisansüstü"),
    "js":         ("JAVASCRIPT",      "JAVASCRIPT",       "8 Lessons",                "8 Ders"),
    "latex":      ("LATEX",           "LATEX",            "8 Lessons",                "8 Ders"),
}

# Group structure for the sidebar (matches main /tutorials/ page)
# Each entry: (id, en, tr, [tracks], emoji_for_collapsed_rail)
GROUPS = [
    ("langs",      "Programming Languages",       "Programlama Dilleri",
        ["c", "cpp", "python"],                    "\U0001F4BB"),  # 💻
    ("ds-libs",    "Data Science Libraries",      "Veri Bilimi Kütüphaneleri",
        ["numpy", "pandas"],                       "\U0001F4CA"),  # 📊
    ("math",       "Mathematics",                  "Matematik",
        ["linalg", "calculus", "ml-math"],         "\U0001F4D0"),  # 📐
    ("ml",         "Machine Learning",             "Makine Öğrenimi",
        ["ml-theory"],                             "\U0001F9E0"),  # 🧠
    ("dl-grp",     "Deep Learning",                "Derin Öğrenme",
        ["dl"],                                    "\U0001F916"),  # 🤖
    ("nlp-grp",    "Natural Language Processing",  "Doğal Dil İşleme",
        ["nlp"],                                   "\U0001F4AC"),  # 💬
    ("web",        "Web Development",              "Web Geliştirme",
        ["js"],                                    "\U0001F310"),  # 🌐
    ("tools",      "Tools",                        "Araçlar",
        ["latex"],                                 "\U0001F6E0\uFE0F"),  # 🛠️
]


# ===================================================================== SIDEBAR CSS

SIDEBAR_STYLE = r"""
<style>
/* Wider sidebar (was 250px, now 300px → +20%) for one-line lesson titles */
:root { --sb-w: 300px; }

.sidebar.sb-v3 {
  font-size: 0.92rem;
  padding: 1rem 0.75rem 2rem;
  overflow-y: auto;
  width: var(--sb-w);
  min-width: var(--sb-w);
  transition: width 0.3s var(--ease, ease), min-width 0.3s var(--ease, ease);
}

/* ===== COLLAPSED RAIL ===== Override core2.css full-hide; keep 56px rail visible */
body.sb-collapsed .sidebar.sb-v3 {
  margin-left: 0 !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  width: 56px !important;
  min-width: 56px !important;
  overflow: hidden;
  padding: 1rem 0.4rem 2rem;
}
body.sb-collapsed .sidebar.sb-v3 .sb-back,
body.sb-collapsed .sidebar.sb-v3 .sb-current,
body.sb-collapsed .sidebar.sb-v3 .sb-section-items,
body.sb-collapsed .sidebar.sb-v3 .sb-label-text,
body.sb-collapsed .sidebar.sb-v3 .sb-section-label::after { display: none !important; }
body.sb-collapsed .sidebar.sb-v3 .sb-section { margin: 0.55rem 0; }
body.sb-collapsed .sidebar.sb-v3 .sb-section-label {
  padding: 0.6rem 0;
  justify-content: center;
  gap: 0;
}
body.sb-collapsed .sidebar.sb-v3 .sb-section-label .sb-icon {
  font-size: 1.4rem;
  filter: grayscale(0.2) brightness(0.9);
  transition: filter 0.2s, transform 0.2s;
}
body.sb-collapsed .sidebar.sb-v3 .sb-section.open > .sb-section-label .sb-icon {
  filter: none;
  transform: scale(1.15);
}
body.sb-collapsed .sidebar.sb-v3 .sb-section.open > .sb-section-label {
  background: rgba(200,169,110,0.10);
  border-left: 2px solid #c8a96e;
}
body.sb-collapsed .sidebar.sb-v3 .sb-section-label:hover .sb-icon {
  filter: none;
  transform: scale(1.15);
}
/* Hover-to-peek: expand on hover when collapsed (desktop only) */
@media(min-width:901px){
  body.sb-collapsed .sidebar.sb-v3:hover {
    width: var(--sb-w) !important;
    min-width: var(--sb-w) !important;
    overflow-y: auto;
    padding: 1rem 0.75rem 2rem;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0,0,0,0.35);
  }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-back,
  body.sb-collapsed .sidebar.sb-v3:hover .sb-current,
  body.sb-collapsed .sidebar.sb-v3:hover .sb-label-text { display: revert !important; }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section.open > .sb-section-items { display: block !important; }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section-label {
    font-size: 0.72rem;
    padding: 0.55rem 0.55rem;
    justify-content: flex-start;
    gap: 0.5rem;
    background: transparent;
    border-left: none;
  }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section.open > .sb-section-label {
    background: rgba(200,169,110,0.05);
    border-left: none;
  }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section-label::after { display: inline-block !important; }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section { margin: 0.1rem 0; }
  /* Restore icon size to default in hover-peek (was 1.4rem in pure rail mode) */
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section-label .sb-icon {
    font-size: 1rem;
    transform: none;
  }
  body.sb-collapsed .sidebar.sb-v3:hover .sb-section.open > .sb-section-label .sb-icon {
    transform: scale(1.05);
  }
}
.sidebar.sb-v3 .sb-back {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.75rem; letter-spacing: 0.06em;
  color: rgba(235,230,220,0.55);
  text-decoration: none;
  margin-bottom: 0.9rem;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}
.sidebar.sb-v3 .sb-back:hover { color: #c8a96e; background: rgba(200,169,110,0.06); }

/* ========== CURRENT PAGE CARD (prominent) ========== */
.sidebar.sb-v3 .sb-current {
  position: relative;
  background: linear-gradient(135deg, rgba(200,169,110,0.10) 0%, rgba(200,169,110,0.02) 100%);
  border: 1px solid rgba(200,169,110,0.22);
  border-left: 4px solid #c8a96e;
  border-radius: 8px;
  padding: 0.85rem 0.95rem 0.9rem;
  margin: 0 0 1.2rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03);
}
.sidebar.sb-v3 .sb-current-eyebrow {
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 0.65rem; letter-spacing: 0.14em;
  color: rgba(200,169,110,0.75);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.sidebar.sb-v3 .sb-current-title {
  font-family: "Bebas Neue", "Outfit", sans-serif;
  font-size: 1.35rem; letter-spacing: 0.06em;
  color: #ebe6dc;
  line-height: 1.05;
  font-weight: 600;
}
.sidebar.sb-v3 .sb-current-sub {
  font-size: 0.72rem;
  color: rgba(235,230,220,0.6);
  margin-top: 0.35rem;
  letter-spacing: 0.02em;
}
.sidebar.sb-v3 .sb-current-lesson {
  display: flex; align-items: baseline; gap: 0.5rem;
  margin-top: 0.45rem;
  padding-top: 0.4rem;
  border-top: 1px dashed rgba(200,169,110,0.18);
}
.sidebar.sb-v3 .sb-current-lesson .num {
  font-family: "DM Mono", monospace;
  font-size: 0.8rem; font-weight: 500;
  color: #c8a96e;
  letter-spacing: 0.05em;
}
.sidebar.sb-v3 .sb-current-lesson .ttl {
  font-size: 0.84rem;
  color: #ebe6dc;
  line-height: 1.2;
}

/* ========== SECTION (TOP-LEVEL) ========== */
.sidebar.sb-v3 .sb-section {
  margin: 0.1rem 0;
}
.sidebar.sb-v3 .sb-section-label {
  cursor: pointer; user-select: none;
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 0.55rem;
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(200,169,110,0.85);
  border-radius: 5px;
  transition: color 0.15s, background 0.15s;
}
.sidebar.sb-v3 .sb-section-label .sb-icon {
  font-size: 1rem;
  line-height: 1;
  display: inline-block;
  filter: grayscale(0.15) brightness(0.95);
  transition: filter 0.15s, transform 0.15s;
}
.sidebar.sb-v3 .sb-section.open > .sb-section-label .sb-icon {
  filter: none;
  transform: scale(1.05);
}
.sidebar.sb-v3 .sb-section-label .sb-label-text { flex: 1; }
.sidebar.sb-v3 .sb-section-label::after {
  content: "▸"; font-size: 0.6rem;
  margin-left: auto;
  opacity: 0.45;
  transition: transform 0.2s;
}
.sidebar.sb-v3 .sb-section.open > .sb-section-label::after { transform: rotate(90deg); }
.sidebar.sb-v3 .sb-section-label:hover {
  color: #c8a96e;
  background: rgba(200,169,110,0.05);
}
.sidebar.sb-v3 .sb-section.open > .sb-section-label { color: #c8a96e; }

.sidebar.sb-v3 .sb-section-items {
  display: none;
  padding: 0.15rem 0 0.15rem 0.75rem;
  margin: 0 0 0.4rem 0.55rem;
  border-left: 1px solid rgba(200,169,110,0.12);
}
.sidebar.sb-v3 .sb-section.open > .sb-section-items { display: block; }

/* ========== TRACK (SUB-LEVEL inside a section) ========== */
.sidebar.sb-v3 .sb-track {
  margin: 0.05rem 0;
}
.sidebar.sb-v3 .sb-track-label {
  cursor: pointer; user-select: none;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  font-size: 0.82rem;
  color: rgba(235,230,220,0.78);
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
  text-decoration: none;
}
.sidebar.sb-v3 .sb-track-label::after {
  content: "▸"; font-size: 0.58rem;
  margin-left: auto;
  opacity: 0.35;
  transition: transform 0.2s;
}
.sidebar.sb-v3 .sb-track-label.no-children::after { display: none; }
.sidebar.sb-v3 .sb-track.open > .sb-track-label::after { transform: rotate(90deg); opacity: 0.8; }
.sidebar.sb-v3 .sb-track-label:hover {
  color: #c8a96e;
  background: rgba(200,169,110,0.05);
}
.sidebar.sb-v3 .sb-track.current > .sb-track-label {
  color: #c8a96e;
  font-weight: 600;
}

.sidebar.sb-v3 .sb-track-items {
  display: none;
  padding: 0.1rem 0 0.15rem 0.5rem;
  margin: 0 0 0.3rem 0.5rem;
  border-left: 1px solid rgba(200,169,110,0.1);
}
.sidebar.sb-v3 .sb-track.open > .sb-track-items { display: block; }

/* Single-track group (no label): drop the redundant left indent */
.sidebar.sb-v3 .sb-track.no-label { margin: 0; }
.sidebar.sb-v3 .sb-track.no-label > .sb-track-items {
  padding: 0;
  margin: 0;
  border-left: 0;
}

/* ========== LESSON ROW (numbered) ========== */
.sidebar.sb-v3 .sb-lesson {
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
  gap: 0.5rem;
  padding: 0.34rem 0.45rem;
  text-decoration: none;
  color: rgba(235,230,220,0.62);
  border-left: 2px solid transparent;
  border-radius: 3px;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.sidebar.sb-v3 .sb-lesson .num {
  font-family: "DM Mono", ui-monospace, monospace;
  font-size: 0.78rem; font-weight: 500;
  color: rgba(200,169,110,0.45);
  text-align: right;
  letter-spacing: 0.04em;
}
.sidebar.sb-v3 .sb-lesson .lbl {
  font-size: 0.8rem;
  line-height: 1.25;
}
.sidebar.sb-v3 .sb-lesson:hover {
  color: #ebe6dc;
  background: rgba(200,169,110,0.04);
}
.sidebar.sb-v3 .sb-lesson:hover .num { color: rgba(200,169,110,0.7); }
.sidebar.sb-v3 .sb-lesson.active {
  color: #c8a96e;
  background: rgba(200,169,110,0.08);
  border-left-color: #c8a96e;
}
.sidebar.sb-v3 .sb-lesson.active .num { color: #c8a96e; opacity: 1; }
.sidebar.sb-v3 .sb-lesson.active .lbl { font-weight: 500; }

/* Scroll polish */
.sidebar.sb-v3::-webkit-scrollbar { width: 5px; }
.sidebar.sb-v3::-webkit-scrollbar-track { background: transparent; }
.sidebar.sb-v3::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.18); border-radius: 3px; }

/* ========== MAIN CONTENT CENTERING (applies to every page with sb-v3) ========== */
/* Width: 1200px (was 920px, +30%) — uniform across every lesson page */
.layout .main { display: flex; flex-direction: column; align-items: stretch; }
.layout .main > .topic-hero    { max-width: 1200px; margin: 0 auto; width: 100%; }
.layout .main > .lesson-content { max-width: 1200px; margin: 0 auto; width: 100%; padding-left: 2rem; padding-right: 2rem; box-sizing: border-box; }
.layout .main > .lab-section    { max-width: 1200px; margin: 0 auto; width: 100%; padding-left: 2rem; padding-right: 2rem; box-sizing: border-box; }
.layout .main > .lesson-nav     { max-width: 1200px; margin: 1rem auto; width: 100%; padding-left: 2rem; padding-right: 2rem; box-sizing: border-box; }
@media(max-width:768px){
  .layout .main > .lesson-content,
  .layout .main > .lab-section,
  .layout .main > .lesson-nav { padding-left: 1rem; padding-right: 1rem; }
}

/* Toggle button — tangent to sidebar (just outside its right edge) */
body.sb-collapsed .sb-toggle-btn {
  left: 56px !important;            /* rail width */
  transform: translateX(2px) !important;
}
body.sb-collapsed .sb-toggle-btn:active { transform: translateX(2px) scale(.92) !important; }

/* ===== Visual styling for legacy l-* boxes used by c/cpp/js/latex lessons ===== */
.lesson-content .l-highlight {
  position: relative;
  margin: 1.4rem 0;
  padding: 1.05rem 1.4rem;
  background: linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.02) 100%);
  border: 1px solid rgba(200,169,110,0.22);
  border-left: 4px solid #c8a96e;
  border-radius: 10px;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(235,230,220,0.85);
  box-shadow: 0 2px 14px rgba(0,0,0,0.18);
}
html[data-theme="light"] .lesson-content .l-highlight { color: rgba(28,26,22,0.85); box-shadow: 0 2px 14px rgba(0,0,0,0.06); }
.lesson-content .l-highlight strong { color: #c8a96e; font-weight: 600; letter-spacing: 0.01em; }
.lesson-content .l-highlight code {
  font-family: var(--mono);
  font-size: 0.92em;
  padding: 0.1em 0.4em;
  border-radius: 4px;
  background: rgba(200,169,110,0.12);
  color: rgba(235,230,220,0.95);
}
html[data-theme="light"] .lesson-content .l-highlight code { background: rgba(0,0,0,0.06); color: rgba(28,26,22,0.92); }

/* Bigger, more readable lesson body text & lists */
.lesson-content .l-text { font-size: 1.04rem; line-height: 1.85; margin-bottom: 1.1rem; }
.lesson-content .l-list { margin: 0.9rem 0 1.4rem; }
.lesson-content .l-list li { font-size: 1.02rem; line-height: 1.85; margin-bottom: 0.35rem; padding-left: 1.4rem; }
.lesson-content .l-list li::before { font-size: 1.1em; }
.lesson-content .l-text strong { color: var(--text); font-weight: 600; }
.lesson-content .l-text code,
.lesson-content .l-list li code {
  font-family: var(--mono);
  font-size: 0.9em;
  padding: 0.12em 0.4em;
  border-radius: 4px;
  background: rgba(200,169,110,0.10);
  color: #c8a96e;
}
html[data-theme="light"] .lesson-content .l-text code,
html[data-theme="light"] .lesson-content .l-list li code { background: rgba(0,0,0,0.06); }

.lesson-content .l-note,
.lesson-content .l-warn { font-size: 1rem; line-height: 1.75; padding: 1.05rem 1.35rem; }

/* Auto-create section visual breaks where the original content has no h2/h3 */
.lesson-content .l-text + .l-highlight,
.lesson-content .code-wrap + .l-highlight { margin-top: 1.8rem; }

/* Cap calc-cards at 4 columns so formulas like cos(θ)=(a·b)/(‖a‖‖b‖) fit one line */
.lesson-content .calc-cards { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important; }
@media(max-width:1100px){
  .lesson-content .calc-cards { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important; }
}
@media(max-width:760px){
  .lesson-content .calc-cards { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important; }
}
@media(max-width:500px){
  .lesson-content .calc-cards { grid-template-columns: 1fr !important; }
}
</style>
<script>
(function(){
  if (window.__sbV3Wired) return;
  window.__sbV3Wired = true;
  document.addEventListener('click', function(e){
    var label = e.target.closest('.sidebar.sb-v3 .sb-section-label, .sidebar.sb-v3 .sb-track-label');
    if (!label) return;
    // Skip when label is a direct link (no-children monolithic tracks)
    if (label.classList.contains('no-children')) return;
    var wrapper = label.closest('.sb-section, .sb-track');
    if (wrapper) wrapper.classList.toggle('open');
  });
})();
</script>"""


# ===================================================================== SIDEBAR HTML BUILDER

def lesson_row(href_prefix, n, te, tt, is_active):
    cls = "sb-lesson" + (" active" if is_active else "")
    # data-en/data-tr on the .lbl span only (so .num span stays untouched by lang switch)
    return (f'              <a href="{href_prefix}/{n}" class="{cls}">'
            f'<span class="num">{n:02d}</span>'
            f'<span class="lbl" data-en="{te}" data-tr="{tt}">{te}</span>'
            f'</a>')


def track_block(track_id, active_track, active_n, hide_label=False):
    folder, name_en, name_tr, lessons = TRACKS[track_id]
    if lessons is None:
        # Monolithic track — just a link
        active = " current" if track_id == active_track else ""
        return (f'          <div class="sb-track{active}">\n'
                f'            <a href="/tutorials/{folder}/" class="sb-track-label no-children" '
                f'data-en="{name_en}" data-tr="{name_tr}">{name_en}</a>\n'
                f'          </div>')
    # Numbered-lesson track — expandable
    is_current = (track_id == active_track)
    # When hide_label=True (single-track group), keep the track always open
    open_cls = " open" if (is_current or hide_label) else ""
    current_cls = " current" if is_current else ""
    rows = "\n".join(
        lesson_row(f"/tutorials/{folder}", n, te, tt,
                   is_current and n == active_n)
        for n, _, te, tt in lessons
    )
    if hide_label:
        # Single-track group: skip the redundant track-label, render lessons directly
        return (f'          <div class="sb-track{open_cls}{current_cls} no-label">\n'
                f'            <div class="sb-track-items">\n{rows}\n            </div>\n'
                f'          </div>')
    return (f'          <div class="sb-track{open_cls}{current_cls}">\n'
            f'            <div class="sb-track-label" data-en="{name_en}" data-tr="{name_tr}">{name_en}</div>\n'
            f'            <div class="sb-track-items">\n{rows}\n            </div>\n'
            f'          </div>')


def build_sidebar(active_track, active_n):
    """Full sidebar HTML for a page on (active_track, active_n).
       active_n=0 means the track's overview/index page."""
    header_en, header_tr, sub_en, sub_tr = TRACK_HEADERS.get(
        active_track, ("TUTORIALS", "EĞİTİMLER", "", "")
    )

    # Current lesson card extra row
    current_lesson_html = ""
    if active_n > 0 and TRACKS.get(active_track, (None, None, None, None))[3]:
        lessons = TRACKS[active_track][3]
        for n, _, te, tt in lessons:
            if n == active_n:
                current_lesson_html = (
                    f'      <div class="sb-current-lesson">\n'
                    f'        <span class="num">L{n:02d}</span>\n'
                    f'        <span class="ttl" data-en="{te}" data-tr="{tt}">{te}</span>\n'
                    f'      </div>\n'
                )
                break

    # Sections
    section_html = []
    for gid, gen, gtr, members, emoji in GROUPS:
        # open if active track is in this group
        is_open = active_track in members
        section_open = " open" if is_open else ""
        # Hide redundant track label when group has exactly one numbered-lesson track.
        # Exception: 'web' will receive sibling tracks (HTML, CSS) later, so keep its
        # JavaScript track-label visible to preserve the structure.
        hide_label = (
            len(members) == 1
            and TRACKS.get(members[0], (None, None, None, None))[3] is not None
            and gid != "web"
        )
        tracks_html = "\n".join(
            track_block(tid, active_track, active_n, hide_label=hide_label)
            for tid in members
        )
        section_html.append(
            f'    <div class="sb-section{section_open}">\n'
            f'      <div class="sb-section-label">'
            f'<span class="sb-icon" aria-hidden="true">{emoji}</span>'
            f'<span class="sb-label-text" data-en="{gen}" data-tr="{gtr}">{gen}</span>'
            f'</div>\n'
            f'      <div class="sb-section-items">\n{tracks_html}\n      </div>\n'
            f'    </div>'
        )

    sections = "\n".join(section_html)

    return f'''  <aside class="sidebar sb-v3" id="sidebar">
{SIDEBAR_STYLE}
    <a href="/tutorials/" class="sb-back" data-en="← All Tutorials" data-tr="← Tüm Eğitimler">← All Tutorials</a>

    <div class="sb-current">
      <div class="sb-current-eyebrow" data-en="Current Track" data-tr="Aktif Eğitim">Current Track</div>
      <div class="sb-current-title" data-en="{header_en}" data-tr="{header_tr}">{header_en}</div>
      <div class="sb-current-sub" data-en="{sub_en}" data-tr="{sub_tr}">{sub_en}</div>
{current_lesson_html}    </div>

{sections}
  </aside>'''


# ===================================================================== SURGICAL REPLACER

SIDEBAR_RE = re.compile(r'\s*<aside class="sidebar[^"]*"[^>]*>.*?</aside>', re.DOTALL)


def replace_sidebar_in_file(filepath, new_sidebar_html):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    if not SIDEBAR_RE.search(html):
        return False
    new_html = SIDEBAR_RE.sub(lambda _: "\n" + new_sidebar_html, html, count=1)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_html)
    return True


# ===================================================================== NLP + DL FULL PAGE BUILDER

def build_nlp_or_dl_page(track_id, lesson):
    n, var, te, tt = lesson
    meta = NLP_META[n] if track_id == "nlp" else DL_META[n]
    de_en, de_tr, time, deco, tools = meta
    folder = TRACKS[track_id][0]
    js_prefix = "nlp-new" if track_id == "nlp" else "dl-new"
    var_prefix = "NLP" if track_id == "nlp" else "DL"
    track_name_en = "NLP" if track_id == "nlp" else "Deep Learning"
    track_name_tr = "NLP" if track_id == "nlp" else "Derin Öğrenme"
    eyebrow_en = f"Lesson {n:02d} · {track_name_en}"
    eyebrow_tr = f"Ders {n:02d} · {track_name_tr}"

    sidebar = build_sidebar(track_id, n)

    if n == 1:
        prev = '<a href="/tutorials/" class="ln-btn" data-en="← Tutorials" data-tr="← Eğitimler">← Tutorials</a>'
    else:
        prev = f'<a href="/tutorials/{folder}/{n-1}" class="ln-btn" data-en="← Lesson {n-1}" data-tr="← Ders {n-1}">← Lesson {n-1}</a>'
    if n == 12:
        if track_id == "dl":
            nxt = '<a href="/tutorials/nlp/1" class="ln-btn ln-next" data-en="NLP Course →" data-tr="NLP Kursu →">NLP Course →</a>'
        else:
            nxt = '<a href="/tutorials/" class="ln-btn ln-next" data-en="Tutorials →" data-tr="Eğitimler →">Tutorials →</a>'
    else:
        nxt = f'<a href="/tutorials/{folder}/{n+1}" class="ln-btn ln-next" data-en="Next: Lesson {n+1} →" data-tr="Sonraki: Ders {n+1} →">Next: Lesson {n+1} →</a>'

    loader_chars = "NLP" if track_id == "nlp" else "DL"
    loader_spans = "".join(f"<span>{c}</span>" for c in loader_chars)

    default_editor = ("import re\ntext = \"The quick brown FOX jumps over THE lazy dog.\"\n"
                      "tokens = re.findall(r\"[a-z]+\", text.lower())\n"
                      "print(tokens, len(tokens))") if track_id == "nlp" else (
                      "import numpy as np\n\ndef neuron(x, w, b):\n    return np.tanh(x @ w + b)\n\n"
                      "x = np.array([1.0, 2.0, 3.0])\nw = np.array([0.1, -0.2, 0.3])\n"
                      "print(\"out:\", neuron(x, w, 0.5))")

    return f'''<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{te} — {track_name_en} — Mikail Sarpkaya</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Outfit:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/core2.css">
<link rel="stylesheet" href="/tutorials/{folder}/{folder}.css?v=3">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.css" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/contrib/auto-render.min.js" crossorigin="anonymous" onload="renderMathInElement(document.querySelector('.lesson-content'),{{delimiters:[{{left:'$$',right:'$$',display:true}},{{left:'$',right:'$',display:false}}],throwOnError:false}});"></script>
<script src="https://cdn.plot.ly/plotly-2.35.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/theme/material-darker.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/python/python.min.js"></script>
</head>
<body>
<div id="loader"><div class="ld-name">{loader_spans}</div><div class="ld-bar-wrap"><div class="ld-bar"></div></div><div class="ld-sub">Loading…</div></div>
<nav id="nav"><a href="/tutorials/" class="nav-logo">MS</a><div class="nav-controls"><div class="color-picker-wrap"><button class="nav-btn" id="colorTog" aria-label="Accent color"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 0 14 3.5 3.5 0 0 1 0 7 10 10 0 1 0 0-20z"/></svg></button><div class="color-dropdown" id="colorDrop"><div class="cd-label">Accent Color</div><div class="color-presets" id="presets"></div><div class="color-custom"><label>Custom</label><input type="color" id="customColor" value="#c8a96e"></div></div></div><button class="nav-btn" id="themeTog" aria-label="Toggle theme"><svg id="iconMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><svg id="iconSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button><button class="nav-btn" id="langTog" aria-label="Language"><span class="lang-label" id="langLabel">EN</span></button></div></nav>
<div class="progress"><div class="progress-bar" id="progressBar"></div></div>
<div class="layout">
{sidebar}
  <button class="sb-toggle-btn" id="sbToggle"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/></svg></button>
  <main class="main">
    <section class="topic-hero">
      <div class="hero-grid"></div>
      <div class="hero-particles"><span></span><span></span><span></span><span></span><span></span><span></span></div>
      <div class="topic-eyebrow" data-en="{eyebrow_en}" data-tr="{eyebrow_tr}">{eyebrow_en}</div>
      <h1 class="topic-title" data-en="{te}" data-tr="{tt}">{te}</h1>
      <p class="topic-desc" data-en="{de_en}" data-tr="{de_tr}">{de_en}</p>
      <div class="topic-meta">
        <div class="meta-item"><span class="meta-label" data-en="Reading" data-tr="Okuma">Reading</span> {time}</div>
        <div class="meta-item"><span class="meta-label" data-en="Level" data-tr="Seviye">Level</span> <span data-en="Graduate" data-tr="Lisansüstü">Graduate</span></div>
        <div class="meta-item"><span class="meta-label" data-en="Tools" data-tr="Araçlar">Tools</span> {tools}</div>
      </div>
      <div class="topic-deco" aria-hidden="true">{deco}</div>
    </section>
    <section class="lesson-content" id="lessonContent"></section>
    <section class="lab-section" id="labSection">
      <h2 class="lab-title" data-en="🧪 Interactive Python Lab" data-tr="🧪 Etkileşimli Python Laboratuvarı">🧪 Interactive Python Lab</h2>
      <p class="lab-desc" data-en="Run Python code directly in your browser." data-tr="Python kodunu doğrudan tarayıcınızda çalıştırın.">Run Python code directly in your browser.</p>
      <div class="lab-status" id="labStatus"><span class="lab-loading" data-en="⏳ Loading Python..." data-tr="⏳ Python yükleniyor...">⏳ Loading Python...</span></div>
      <div class="lab-exercise"><div class="lab-exercise-header" data-en="🎯 Free Playground" data-tr="🎯 Serbest Alan">🎯 Free Playground</div><div class="lab-editor-wrap"><textarea class="lab-editor" id="editor1" spellcheck="false">{default_editor}</textarea><button class="lab-run-btn" onclick="runCode('editor1','output1')">▶ <span data-en="Run" data-tr="Çalıştır">Run</span></button></div><pre class="lab-output" id="output1">Click "Run" to execute...</pre></div>
    </section>
    <div class="lesson-nav">
      {prev}
      <span class="ln-center" data-en="Lesson {n} of 12" data-tr="Ders {n} / 12">Lesson {n} of 12</span>
      {nxt}
    </div>
    <footer class="tut-footer"><div>&copy; 2026 Mikail Sarpkaya. All rights reserved.</div><div><a href="https://mikailsarpkaya.com">mikailsarpkaya.com</a></div></footer>
  </main>
</div>
<button class="sb-mobile" id="sbMobile">☰</button>
<script src="/tutorials/core.js"></script>
<script src="/{js_prefix}-{var}.js?v=2"></script>
<script>
function loadLesson(lang){{if(typeof {var_prefix}_{var}==='undefined')return;var c=(lang==='tr'&&{var_prefix}_{var}.tr)?{var_prefix}_{var}.tr:{var_prefix}_{var}.en;var el=document.getElementById('lessonContent');if(el&&c){{el.innerHTML=c;el.querySelectorAll('script').forEach(function(o){{var s=document.createElement('script');s.textContent=o.textContent;o.parentNode.replaceChild(s,o);}});if(typeof renderMathInElement==='function')renderMathInElement(el,{{delimiters:[{{left:"$$",right:"$$",display:true}},{{left:"$",right:"$",display:false}}],throwOnError:false}});}}setTimeout(function(){{window.dispatchEvent(new Event("resize"));}},600);}}
var il='en';try{{il=localStorage.getItem('tut-lang')||'en';}}catch(e){{}}loadLesson(il);document.addEventListener('langchange',function(e){{loadLesson(e.detail.lang);}});
</script>
<script>
var pyR=false,pyI=null;async function initPyodide(){{try{{pyI=await loadPyodide({{indexURL:"https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"}});await pyI.loadPackage("numpy");pyR=true;var s=document.getElementById('labStatus');var l='en';try{{l=localStorage.getItem('tut-lang')||'en'}}catch(e){{}}if(s)s.innerHTML='<span class="lab-ready">'+(l==='tr'?'✅ Python hazır':'✅ Python ready')+'</span>';document.querySelectorAll('.lab-run-btn').forEach(function(b){{b.disabled=false;}});}}catch(e){{var s=document.getElementById('labStatus');if(s)s.innerHTML='<span class="lab-error">❌ '+e.message+'</span>';}}}}
async function runCode(eId,oId){{if(!pyR){{document.getElementById(oId).textContent='⏳ Loading...';return;}}var code=document.getElementById(eId).value;var o=document.getElementById(oId);o.textContent='⏳ Running...';o.className='lab-output';try{{pyI.runPython('import io,sys;sys.stdout=io.StringIO()');await pyI.runPythonAsync(code);var out=pyI.runPython('sys.stdout.getvalue()');o.textContent=out||'(no output)';o.classList.add('lab-success');}}catch(e){{o.textContent='❌ Error:\\n'+e.message;o.classList.add('lab-error-output');}}}}
var lO=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{initPyodide();lO.disconnect();}}}});}},{{rootMargin:'200px'}});var lE=document.getElementById('labSection');if(lE)lO.observe(lE);
var cmE={{}};document.querySelectorAll('.lab-editor').forEach(function(ta){{var cm=CodeMirror.fromTextArea(ta,{{mode:'python',theme:'material-darker',lineNumbers:true,indentUnit:4,tabSize:4,indentWithTabs:false,lineWrapping:true,viewportMargin:Infinity,extraKeys:{{'Tab':function(cm){{cm.replaceSelection('    ','end')}},'Shift-Enter':function(cm){{runCode(ta.id,ta.id.replace('editor','output'));}}}}}});cmE[ta.id]=cm;}});
var _rC=runCode;runCode=async function(e,o){{if(cmE[e])cmE[e].save();return _rC(e,o);}};
</script>
</body>
</html>
'''


# ===================================================================== MAIN

def main():
    # SIDEBAR-ONLY mode: do not rewrite NLP/DL full pages (preserves content versions, link tags).
    # Surgical replacement for ALL numbered-lesson tracks including NLP and DL.
    numbered_tracks = [
        ("nlp", 12), ("dl", 11),
        ("ml-theory", 11), ("linalg", 6), ("calculus", 6), ("ml-math", 6),
        ("python", 6), ("numpy", 6), ("pandas", 6),
        ("c", 6), ("cpp", 8), ("js", 8), ("latex", 8),
    ]
    for track_id, count in numbered_tracks:
        folder = TRACKS[track_id][0]
        for n in range(1, count + 1):
            filepath = ROOT / "tutorials" / folder / f"{n}.html"
            if filepath.exists():
                sb = build_sidebar(track_id, n)
                ok = replace_sidebar_in_file(filepath, sb)
                status = "OK" if ok else "NO_MATCH"
                print(f"  [{status}] {track_id}/{n}")
        idx = ROOT / "tutorials" / folder / "index.html"
        if idx.exists():
            sb = build_sidebar(track_id, 0)
            ok = replace_sidebar_in_file(idx, sb)
            status = "OK" if ok else "NO_MATCH"
            print(f"  [{status}] {track_id}/index")

    print("\nSidebar v3 applied to all pages.")


if __name__ == "__main__":
    main()
