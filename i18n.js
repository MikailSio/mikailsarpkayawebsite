/**
 * i18n.js — mikailsarpkaya.com
 * EN | TR | DE | ES
 */

const LANGS  = ['en','tr','de','es'];
const LABELS = { en:'EN', tr:'TR', de:'DE', es:'ES' };
const NAMES  = { en:'English', tr:'Türkçe', de:'Deutsch', es:'Español' };

const T = {
  /* NAV */
  "nav.about":        {en:"About",         tr:"Hakkımda",        de:"Über mich",        es:"Sobre mí"},
  "nav.projects":     {en:"Projects",       tr:"Projeler",         de:"Projekte",          es:"Proyectos"},
  "nav.certificates": {en:"Certificates",   tr:"Sertifikalar",     de:"Zertifikate",       es:"Certificados"},
  "nav.research":     {en:"Research",       tr:"Araştırma",        de:"Forschung",         es:"Investigación"},
  "nav.tutorials":    {en:"Tutorials",      tr:"Eğitimler",        de:"Tutorials",         es:"Tutoriales"},
  "nav.cv":           {en:"CV ↗",           tr:"CV ↗",             de:"Lebenslauf ↗",      es:"CV ↗"},
  /* HERO */
  "hero.eyebrow":     {
    en:"Electrical & Electronics Engineer — EEE M.Sc.",
    tr:"Elektrik & Elektronik Mühendisi — EEE M.Sc.",
    de:"Elektro- & Elektronikingenieur — EEE M.Sc.",
    es:"Ingeniero Eléctrico y Electrónico — EEE M.Sc."},
  "hero.desc":        {
    en:"<strong>AI & NLP Researcher</strong> specializing in transformer-based text classification, sequence modeling with <em>LSTM / BiLSTM</em>, and large-scale Turkish language corpus construction.<br><br>EEE M.Sc. Student — Osmaniye Korkut Ata University<br>Dept. of Electrical & Electronics Engineering",
    tr:"<strong>Yapay Zeka & NLP Araştırmacısı</strong> — transformer tabanlı metin sınıflandırma, <em>LSTM / BiLSTM</em> dizi modelleme ve büyük ölçekli Türkçe dil korpusu oluşturma üzerine uzmanlaşmış.<br><br>Yüksek Lisans Öğrencisi — Osmaniye Korkut Ata Üniversitesi<br>Elektrik-Elektronik Mühendisliği Bölümü",
    de:"<strong>KI- & NLP-Forscher</strong> — spezialisiert auf Transformer-basierte Textklassifikation, Sequenzmodellierung mit <em>LSTM / BiLSTM</em> und großangelegten Aufbau türkischer Sprachkorpora.<br><br>EEE-M.Sc.-Student — Osmaniye Korkut Ata Universität<br>Fachbereich Elektro- & Elektroniktechnik",
    es:"<strong>Investigador en IA y NLP</strong> — especializado en clasificación de texto basada en transformers, modelado de secuencias con <em>LSTM / BiLSTM</em>, y construcción de corpus turcos a gran escala.<br><br>Estudiante de M.Sc. — Universidad Osmaniye Korkut Ata<br>Depto. de Ingeniería Eléctrica y Electrónica"},
  "hero.scroll":      {en:"Scroll to explore",tr:"Keşfetmek için kaydır",de:"Scrollen zum Erkunden",es:"Desplázate para explorar"},
  /* STATS */
  "stat.msc":  {en:"M.Sc.", tr:"M.Sc.",  de:"M.Sc.",       es:"M.Sc."},
  "stat.lang": {en:"Languages",          tr:"Programlama Dili",      de:"Sprachen",            es:"Lenguajes"},
  "stat.proj": {en:"Active Projects",    tr:"Aktif Proje",           de:"Aktive Projekte",     es:"Proyectos Activos"},
  "stat.cert": {en:"Certificates",       tr:"Sertifika",             de:"Zertifikate",         es:"Certificados"},
  /* ABOUT */
  "about.eyebrow": {en:"02 — Profile",  tr:"02 — Profil",      de:"02 — Profil",      es:"02 — Perfil"},
  "about.t1":      {en:"ABOUT",         tr:"HAKKIMDA",         de:"ÜBER",           es:"SOBRE"},
  "about.t2":      {en:"ME",            tr:"",                 de:"MICH",           es:"MÍ"},
  "about.p1":      {
    en:"I hold a <strong>B.Sc. in Electrical & Electronics Engineering</strong> from Osmaniye Korkut Ata University (2020) and I'm currently pursuing my M.Sc. at the same department. My thesis investigates transformer-based architectures — including <strong>BERT, RoBERTa</strong>, and hybrid CNN-LSTM models — for Turkish text classification tasks.",
    tr:"Osmaniye Korkut Ata Üniversitesi'nden <strong>Elektrik-Elektronik Mühendisliği lisans</strong> derecemi aldım (2020) ve aynı bölümde yüksek lisansıma devam ediyorum. Tezimde Türkçe metin sınıflandırma görevleri için <strong>BERT, RoBERTa</strong> ve hibrit CNN-LSTM modelleri dahil transformer tabanlı mimarileri araştırıyorum.",
    de:"Ich habe meinen <strong>B.Sc. in Elektro- & Elektroniktechnik</strong> an der Osmaniye Korkut Ata Universität (2020) abgeschlossen und absolviere derzeit meinen Master. Meine Thesis untersucht Transformer-Architekturen — darunter <strong>BERT, RoBERTa</strong> und hybride CNN-LSTM-Modelle — für türkische Textklassifikation.",
    es:"Tengo un <strong>B.Sc. en Ingeniería Eléctrica y Electrónica</strong> de la Universidad Osmaniye Korkut Ata (2020) y actualmente curso mi maestría. Mi tesis investiga arquitecturas transformer — incluyendo <strong>BERT, RoBERTa</strong> y modelos híbridos CNN-LSTM — para clasificación de texto turco."},
  "about.p2":      {
    en:"My research pipeline spans the full cycle: automated <strong>web scraping</strong> with BeautifulSoup & Scrapy, large-scale data cleaning with Pandas, corpus construction for low-resource languages, and model training via <strong>PyTorch & HuggingFace Transformers</strong>. I co-author journal papers with faculty advisors on NLP-driven classification systems.",
    tr:"Araştırma hattım tam döngüyü kapsıyor: BeautifulSoup & Scrapy ile otomatik <strong>web kazıma</strong>, Pandas ile büyük ölçekli veri temizleme, düşük kaynaklı diller için korpus oluşturma ve <strong>PyTorch & HuggingFace Transformers</strong> ile model eğitimi. Danışman hocalarımla NLP tabanlı sınıflandırma sistemleri üzerine dergi makaleleri yazıyorum.",
    de:"Meine Forschungspipeline umfasst den gesamten Zyklus: automatisiertes <strong>Web-Scraping</strong> mit BeautifulSoup & Scrapy, Datenbereinigung mit Pandas, Korpusaufbau für ressourcenarme Sprachen und Modelltraining mit <strong>PyTorch & HuggingFace Transformers</strong>. Ich veröffentliche gemeinsam mit meinen Betreuern Fachartikel zu NLP-Klassifikationssystemen.",
    es:"Mi pipeline de investigación abarca el ciclo completo: <strong>web scraping</strong> automatizado con BeautifulSoup y Scrapy, limpieza de datos a gran escala con Pandas, construcción de corpus para idiomas de bajos recursos, y entrenamiento de modelos con <strong>PyTorch y HuggingFace Transformers</strong>. Coautorizo artículos académicos sobre sistemas de clasificación basados en NLP."},
  "about.p3":      {
    en:"Beyond research, I build and deploy production web applications on <strong>Hetzner VPS</strong> with Nginx & Cloudflare — including <em>abctohero.com</em>, a cross-platform English learning app supporting 9 languages. I hold professional certificates from <strong>Stanford, IBM, Google, and DeepLearning.AI</strong> across ML, DL, and data analytics.",
    tr:"Araştırmanın ötesinde, <strong>Hetzner VPS</strong> üzerinde Nginx & Cloudflare ile üretim web uygulamaları geliştirip deploy ediyorum — 9 dil destekli çapraz platform İngilizce öğrenme uygulaması olan <em>abctohero.com</em> bunlardan biri. ML, DL ve veri analitiği alanlarında <strong>Stanford, IBM, Google ve DeepLearning.AI</strong>'dan profesyonel sertifikalara sahibim.",
    de:"Neben der Forschung entwickle und betreibe ich Webanwendungen auf <strong>Hetzner VPS</strong> mit Nginx & Cloudflare — darunter <em>abctohero.com</em>, eine plattformübergreifende Englischlern-App mit 9 Sprachen. Ich besitze Zertifikate von <strong>Stanford, IBM, Google und DeepLearning.AI</strong> in ML, DL und Datenanalyse.",
    es:"Más allá de la investigación, desarrollo y despliego aplicaciones web en <strong>Hetzner VPS</strong> con Nginx y Cloudflare — incluyendo <em>abctohero.com</em>, una app multiplataforma de inglés con 9 idiomas. Poseo certificados profesionales de <strong>Stanford, IBM, Google y DeepLearning.AI</strong> en ML, DL y analítica de datos."},
  "about.quote":   {
    en:"\"From raw data to trained models —<br>engineering intelligence, one pipeline at a time.\"",
    tr:"\"Ham veriden eğitilmiş modellere —<br>her pipeline'da bir adım daha ileri.\"",
    de:"\"Von Rohdaten zu trainierten Modellen —<br>Intelligenz entwickeln, eine Pipeline nach der anderen.\"",
    es:"\"De datos crudos a modelos entrenados —<br>ingeniería de inteligencia, un pipeline a la vez.\""},
  "about.art":     {en:"// Neural Architecture",tr:"// Sinir Mimarisi",de:"// Neuronale Architektur",es:"// Arquitectura Neuronal"},
  /* INDEX PROJECTS */
  "p1.label": {en:"001 — Featured",    tr:"001 — Öne Çıkan",      de:"001 — Highlight",    es:"001 — Destacado"},
  "p1.pull":  {en:"\"A cross-platform English learning app supporting 9 native languages — structured, progressive, and built for real learners.\"",
               tr:"\"9 dil destekli, çapraz platformlu İngilizce öğrenme uygulaması — yapılandırılmış, aşamalı ve gerçek öğrenciler için tasarlandı.\"",
               de:"\"Plattformübergreifende Englischlern-App mit 9 Sprachen — strukturiert, progressiv und für echte Lernende entwickelt.\"",
               es:"\"App multiplataforma para aprender inglés con soporte en 9 idiomas — estructurada, progresiva y diseñada para estudiantes reales.\""},
  "p1.desc":  {
    en:"A cross-platform English learning app supporting 9 native languages. Features a structured curriculum with vocabulary drills, grammar explanations, pronunciation guides, and interactive exercises. Available as a web app and mobile app (Android & iOS), deployed on Hetzner VPS with Nginx & Cloudflare.",
    tr:"9 dil destekli çapraz platform İngilizce öğrenme uygulaması. Kelime egzersizleri, gramer açıklamaları, telaffuz rehberleri ve interaktif alıştırmalar içeren yapılandırılmış müfredat. Web ve mobil uygulama (Android & iOS) olarak sunuluyor, Hetzner VPS üzerinde Nginx & Cloudflare ile deploy edildi.",
    de:"Plattformübergreifende Englischlern-App mit 9 Sprachen. Strukturierter Lehrplan mit Vokabelübungen, Grammatikerklärungen und interaktiven Übungen. Als Web- und Mobile-App (Android & iOS) verfügbar.",
    es:"App multiplataforma de inglés con soporte en 9 idiomas. Currículo estructurado con ejercicios de vocabulario, gramática y pronunciación. Disponible como web y app móvil (Android & iOS)."},
  "p1.cta":   {en:"Visit abctohero.com",tr:"abctohero.com'u Ziyaret Et",de:"abctohero.com besuchen",es:"Visitar abctohero.com"},
  "p2.label": {en:"002 — M.Sc. Thesis",tr:"002 — Yüksek Lisans Tezi",de:"002 — Masterarbeit",es:"002 — Tesis M.Sc."},
  "p2.pull":  {en:"\"Building domain-specific Turkish corpora and benchmarking BERT, RoBERTa, and hybrid LSTM architectures for text classification.\"",
               tr:"\"Alana özgü Türkçe korpuslar oluşturup BERT, RoBERTa ve hibrit LSTM mimarilerini metin sınıflandırma için kıyaslıyorum.\"",
               de:"\"Aufbau domänenspezifischer türkischer Korpora und Benchmarking von BERT, RoBERTa und hybriden LSTM-Architekturen.\"",
               es:"\"Construyendo corpus turcos de dominio específico y evaluando arquitecturas BERT, RoBERTa y LSTM híbridas.\""},
  "p2.desc":  {
    en:"M.Sc. thesis research: automated web scraping pipelines collect and clean large-scale Turkish text data. The processed corpus feeds into transformer models (BERT, RoBERTa) and recurrent architectures (LSTM, BiLSTM) for comparative text classification benchmarks. Co-authoring journal papers with faculty at Osmaniye Korkut Ata University.",
    tr:"Yüksek lisans tez araştırması: otomatik web kazıma pipeline'ları büyük ölçekli Türkçe metin verisi topluyor ve temizliyor. İşlenen korpus, karşılaştırmalı metin sınıflandırma kıyaslamaları için transformer modellerine (BERT, RoBERTa) ve tekrarlayan mimarilere (LSTM, BiLSTM) besleniyor. Osmaniye Korkut Ata Üniversitesi'nde öğretim üyeleriyle ortak dergi makaleleri hazırlıyorum.",
    de:"M.Sc.-Forschung: Automatisierte Web-Scraping-Pipelines sammeln und bereinigen türkische Textdaten. Der Korpus wird in Transformer-Modelle (BERT, RoBERTa) und rekurrente Architekturen (LSTM, BiLSTM) für vergleichende Benchmarks eingespeist.",
    es:"Investigación de tesis M.Sc.: pipelines automatizados de web scraping recopilan y limpian datos textuales turcos a gran escala. El corpus alimenta modelos transformer (BERT, RoBERTa) y arquitecturas recurrentes (LSTM, BiLSTM) para benchmarks comparativos."},
  "p2.cta":   {en:"See Research",tr:"Araştırmayı Gör",de:"Forschung ansehen",es:"Ver Investigación"},
  "p3.label": {en:"003 — Research",tr:"003 — Araştırma",de:"003 — Forschung",es:"003 — Investigación"},
  "p3.pull":  {en:"\"Fine-tuning large language models for domain-specific Turkish NLP tasks — evaluating prompt strategies, LoRA adapters, and zero-shot performance.\"",
               tr:"\"Alana özgü Türkçe NLP görevleri için büyük dil modellerinin ince ayarı — prompt stratejileri, LoRA adaptörleri ve zero-shot performans değerlendirmesi.\"",
               de:"\"Fine-Tuning großer Sprachmodelle für domänenspezifische türkische NLP — Bewertung von Prompt-Strategien, LoRA-Adaptern und Zero-Shot-Leistung.\"",
               es:"\"Fine-tuning de LLMs para tareas de NLP turco — evaluando estrategias de prompt, adaptadores LoRA y rendimiento zero-shot.\""},
  "p3.desc":  {
    en:"Systematic experimentation with LLM fine-tuning: comparing full fine-tuning vs. parameter-efficient methods (LoRA, QLoRA) on Turkish language benchmarks. Evaluating prompt engineering strategies, few-shot learning, and domain adaptation across multiple model families.",
    tr:"LLM ince ayarı üzerine sistematik deneyler: Türkçe dil kıyaslamalarında tam ince ayar ile parametre verimli yöntemlerin (LoRA, QLoRA) karşılaştırılması. Birden fazla model ailesi üzerinde prompt mühendisliği stratejileri, az örnekli öğrenme ve alan adaptasyonu değerlendirmesi.",
    de:"Systematische LLM-Fine-Tuning-Experimente: Vergleich von Full Fine-Tuning und parametereffizienten Methoden (LoRA, QLoRA) auf türkischen Benchmarks. Bewertung von Prompt-Engineering, Few-Shot-Learning und Domänenadaption.",
    es:"Experimentación sistemática con fine-tuning de LLMs: comparando fine-tuning completo vs. métodos eficientes en parámetros (LoRA, QLoRA) en benchmarks turcos. Evaluando ingeniería de prompts, few-shot learning y adaptación de dominio."},
  /* RESEARCH */
  "res.eyebrow": {en:"03",tr:"03",de:"03",es:"03"},
  "res.t1":      {en:"RESEARCH",   tr:"ARAŞTIRMA",   de:"FORSCHUNG",    es:"INVESTIGACIÓN"},
  "res.t2":      {en:"PAPERS",     tr:"MAKALELER",   de:"PAPERS",       es:"ARTÍCULOS"},
  "res.intro":   {
    en:"Academic research focused on applying deep learning architectures to Turkish NLP tasks. Working on transformer-based text classification (BERT, RoBERTa), sequence modeling (LSTM, BiLSTM), and large-scale corpus construction through automated web scraping. EEE M.Sc. Student at Osmaniye Korkut Ata University, Dept. of Electrical & Electronics Engineering.",
    tr:"Derin öğrenme mimarilerini Türkçe NLP görevlerine uygulamaya odaklanan akademik araştırma. Transformer tabanlı metin sınıflandırma (BERT, RoBERTa), dizi modelleme (LSTM, BiLSTM) ve otomatik web kazıma ile büyük ölçekli korpus oluşturma üzerine çalışıyorum. Osmaniye Korkut Ata Üniversitesi Elektrik-Elektronik Mühendisliği yüksek lisans öğrencisi.",
    de:"Akademische Forschung zur Anwendung von Deep-Learning-Architekturen auf türkische NLP-Aufgaben. Transformer-basierte Textklassifikation (BERT, RoBERTa), Sequenzmodellierung (LSTM, BiLSTM) und automatisierter Korpusaufbau. EEE-M.Sc.-Student an der Osmaniye Korkut Ata Universität.",
    es:"Investigación académica enfocada en aplicar arquitecturas de deep learning a tareas de NLP turco. Clasificación de texto con transformers (BERT, RoBERTa), modelado de secuencias (LSTM, BiLSTM) y construcción de corpus a gran escala. Estudiante de M.Sc. en la Universidad Osmaniye Korkut Ata."},
  "r1.title": {en:"Transformer & RNN-Based Turkish Text Classification — M.Sc. Thesis",
               tr:"Transformer & RNN Tabanlı Türkçe Metin Sınıflandırma — Yüksek Lisans Tezi",
               de:"Transformer- & RNN-basierte türkische Textklassifikation — Masterarbeit",
               es:"Clasificación de Texto Turco con Transformers y RNN — Tesis M.Sc."},
  "r1.desc":  {en:"Comparative study of BERT, RoBERTa, LSTM, and BiLSTM architectures on domain-specific Turkish text datasets. Includes automated corpus construction via web scraping, preprocessing pipelines, and benchmark evaluation across F1, precision, and recall metrics.",
               tr:"Alana özgü Türkçe metin veri setleri üzerinde BERT, RoBERTa, LSTM ve BiLSTM mimarilerinin karşılaştırmalı çalışması. Web kazıma ile otomatik korpus oluşturma, ön işleme pipeline'ları ve F1, kesinlik, duyarlılık metrikleri ile kıyaslama değerlendirmesi içerir.",
               de:"Vergleichsstudie von BERT, RoBERTa, LSTM und BiLSTM auf domänenspezifischen türkischen Textdatensätzen. Automatisierter Korpusaufbau, Preprocessing-Pipelines und Benchmark-Evaluation.",
               es:"Estudio comparativo de BERT, RoBERTa, LSTM y BiLSTM en datasets turcos de dominio específico. Incluye construcción automatizada de corpus y evaluación con métricas F1, precisión y recall."},
  "r1.badge": {en:"Ongoing",       tr:"Devam Ediyor",   de:"Laufend",         es:"En Curso"},
  "r2.title": {en:"NLP-Driven Text Classification with Deep Learning — Journal Paper",
               tr:"Derin Öğrenme ile NLP Tabanlı Metin Sınıflandırma — Dergi Makalesi",
               de:"NLP-gestützte Textklassifikation mit Deep Learning — Zeitschriftenartikel",
               es:"Clasificación de Texto con NLP y Deep Learning — Artículo de Revista"},
  "r2.desc":  {en:"Co-authored journal paper presenting a hybrid NLP pipeline that combines classical feature extraction (TF-IDF, word embeddings) with deep learning classifiers. Collaboration with faculty at Osmaniye Korkut Ata University.",
               tr:"Klasik özellik çıkarma (TF-IDF, kelime gömmeleri) ile derin öğrenme sınıflandırıcılarını birleştiren hibrit NLP pipeline'ı sunan ortak dergi makalesi. Osmaniye Korkut Ata Üniversitesi öğretim üyeleriyle işbirliği.",
               de:"Gemeinsam verfasster Fachartikel über eine hybride NLP-Pipeline mit klassischer Merkmalsextraktion (TF-IDF, Worteinbettungen) und Deep-Learning-Klassifikatoren.",
               es:"Artículo coautorado presentando un pipeline híbrido de NLP que combina extracción clásica de características (TF-IDF, word embeddings) con clasificadores de deep learning."},
  "r2.badge": {en:"In Preparation",tr:"Hazırlanıyor",  de:"In Vorbereitung", es:"En Preparación"},
  "r3.title": {en:"Scalable Web Scraping & Data Preprocessing for Turkish NLP Corpora",
               tr:"Türkçe NLP Korpusları için Ölçeklenebilir Web Kazıma & Veri Ön İşleme",
               de:"Skalierbares Web-Scraping & Datenvorverarbeitung für türkische NLP-Korpora",
               es:"Web Scraping Escalable y Preprocesamiento de Datos para Corpus NLP Turcos"},
  "r3.desc":  {en:"Design and implementation of multi-source scraping pipelines (BeautifulSoup, Scrapy) with automated cleaning, deduplication, and normalization — producing research-grade Turkish text corpora for downstream classification tasks.",
               tr:"Otomatik temizleme, tekilleştirme ve normalizasyon içeren çok kaynaklı kazıma pipeline'larının (BeautifulSoup, Scrapy) tasarımı ve uygulaması — sınıflandırma görevleri için araştırma düzeyinde Türkçe metin korpusları üretiyor.",
               de:"Entwurf mehrstufiger Scraping-Pipelines (BeautifulSoup, Scrapy) mit automatisierter Bereinigung und Deduplizierung — Produktion forschungstauglicher türkischer Textkorpora.",
               es:"Diseño de pipelines multi-fuente (BeautifulSoup, Scrapy) con limpieza automatizada y deduplicación — produciendo corpus turcos de calidad investigativa."},
  "r3.badge": {en:"Completed",     tr:"Tamamlandı",    de:"Abgeschlossen",   es:"Completado"},
  /* CONTACT */
  "con.eyebrow": {en:"04 — Get In Touch",tr:"04 — İletişim",      de:"04 — Kontakt",       es:"04 — Contacto"},
  "con.t1":      {en:"LET'S",           tr:"HADI",                de:"LASS UNS",           es:"HABLEMOS"},
  "con.t2":      {en:"TALK",            tr:"KONUŞALIM",           de:"REDEN",              es:""},
  "con.sub":     {
    en:"Open to research collaborations, academic discussions,<br>freelance projects, and interesting engineering challenges.",
    tr:"Araştırma işbirlikleri, akademik tartışmalar,<br>serbest projeler ve ilgi çekici mühendislik zorluklarına açığım.",
    de:"Offen für Forschungskooperationen, akademische Diskussionen,<br>Freelance-Projekte und Ingenieurherausforderungen.",
    es:"Abierto a colaboraciones, discusiones académicas,<br>proyectos freelance y desafíos de ingeniería."},
  "con.email":   {en:"Email Me",  tr:"E-posta Gönder", de:"E-Mail senden", es:"Enviar Email"},
  "con.cv":      {en:"View CV",   tr:"CV'yi Gör",      de:"Lebenslauf",    es:"Ver CV"},
  /* FOOTER */
  "footer":      {
    en:"© 2026 Mikail Sarpkaya. All rights reserved.",
    tr:"© 2026 Mikail Sarpkaya. Tüm hakları saklıdır.",
    de:"© 2026 Mikail Sarpkaya. Alle Rechte vorbehalten.",
    es:"© 2026 Mikail Sarpkaya. Todos los derechos reservados."},
  /* PROJECTS PAGE */
  "pp.eyebrow": {en:"02 — Works",  tr:"02 — Çalışmalar", de:"02 — Werke",   es:"02 — Trabajos"},
  "pp.t1":      {en:"ALL",         tr:"TÜM",             de:"ALLE",         es:"TODOS LOS"},
  "pp.t2":      {en:"PROJECTS",    tr:"PROJELER",        de:"PROJEKTE",     es:"PROYECTOS"},
  "pp.desc":    {
    en:"Software, research, and engineering projects — from production web apps to academic AI research.",
    tr:"Yazılım, araştırma ve mühendislik projeleri — üretim web uygulamalarından akademik yapay zeka araştırmasına.",
    de:"Software-, Forschungs- und Ingenieurprojekte — von Web-Apps bis zur KI-Forschung.",
    es:"Proyectos de software, investigación e ingeniería — desde apps web hasta investigación en IA."},
  "f.all":  {en:"All",         tr:"Tümü",      de:"Alle",     es:"Todos"},
  "f.ai":   {en:"AI / ML",    tr:"YZ / ML",   de:"KI / ML",  es:"IA / ML"},
  "f.web":  {en:"Web",        tr:"Web",       de:"Web",      es:"Web"},
  "f.edu":  {en:"Education",  tr:"Eğitim",    de:"Bildung",  es:"Educación"},
  "f.res":  {en:"Research",   tr:"Araştırma", de:"Forschung",es:"Investigación"},
  "st.live":{en:"Live",       tr:"Canlı",     de:"Live",     es:"En vivo"},
  "st.wip": {en:"In Progress",tr:"Devam Ediyor",de:"In Arbeit",es:"En progreso"},
  "st.res": {en:"Research",   tr:"Araştırma", de:"Forschung",es:"Investigación"},
  "pa.abc.t":{en:"AbcToHero — English Learning Platform",tr:"AbcToHero — İngilizce Öğrenme Platformu",de:"AbcToHero — Englischlernplattform",es:"AbcToHero — Plataforma de Inglés"},
  "pa.abc.d":{en:"Cross-platform English learning app with 9 language support. Vocabulary, grammar, pronunciation, and interactive exercises for learners at every level.",
              tr:"9 dil destekli çapraz platform İngilizce öğrenme uygulaması. Kelime, gramer, telaffuz ve her seviyeye uygun interaktif alıştırmalar.",
              de:"Plattformübergreifende Englischlern-App mit 9 Sprachen. Vokabular, Grammatik, Aussprache und interaktive Übungen für jedes Niveau.",
              es:"App multiplataforma de inglés con 9 idiomas. Vocabulario, gramática, pronunciación y ejercicios interactivos para todos los niveles."},
  "pa.nlp.t":{en:"NLP Thesis — Turkish Text Analysis",tr:"NLP Tezi — Türkçe Metin Analizi",de:"NLP-Thesis — Türkische Textanalyse",es:"Tesis NLP — Análisis de Texto Turco"},
  "pa.nlp.d":{en:"Graduate research combining web scraping, data cleaning, and transformer architectures for Turkish text analysis.",
              tr:"Türkçe metin analizi için web kazıma, veri temizleme ve transformer mimarilerini birleştiren lisansüstü araştırma.",
              de:"Masterforschung mit Web-Scraping und Transformer-Architekturen für türkische Textanalyse.",
              es:"Investigación de posgrado con web scraping y transformers para análisis de texto turco."},
  "pa.llm.t":{en:"LLM Fine-Tuning Experiments",tr:"LLM İnce Ayar Deneyleri",de:"LLM Fine-Tuning-Experimente",es:"Experimentos de Fine-Tuning en LLM"},
  "pa.llm.d":{en:"Research and fine-tuning experiments on Large Language Models for Turkish domain adaptation.",
              tr:"Türkçe alan adaptasyonu için Büyük Dil Modelleri üzerinde araştırma ve ince ayar deneyleri.",
              de:"Fine-Tuning-Experimente mit LLMs für türkische Domänenadaption.",
              es:"Experimentos de fine-tuning en LLMs para adaptación al dominio turco."},
  "pa.web.t":{en:"Personal Website — mikailsarpkaya.com",tr:"Kişisel Web Sitesi — mikailsarpkaya.com",de:"Persönliche Website — mikailsarpkaya.com",es:"Sitio Personal — mikailsarpkaya.com"},
  "pa.web.d":{en:"Professional portfolio deployed on Hetzner VPS with Nginx and Cloudflare.",
              tr:"Hetzner VPS üzerinde Nginx ve Cloudflare ile deploy edilmiş profesyonel portföy.",
              de:"Professionelles Portfolio auf Hetzner VPS mit Nginx und Cloudflare.",
              es:"Portafolio profesional en Hetzner VPS con Nginx y Cloudflare."},
  "pa.pip.t":{en:"Web Scraping & Data Pipeline",tr:"Web Kazıma & Veri Pipeline'ı",de:"Web-Scraping- & Datenpipeline",es:"Pipeline de Web Scraping y Datos"},
  "pa.pip.d":{en:"Automated data collection for Turkish language corpora. Multi-source scraping, cleaning, deduplication.",
              tr:"Türkçe dil korpusları için otomatik veri toplama. Çok kaynaklı kazıma, temizleme, tekilleştirme.",
              de:"Automatisierte Datenerfassung für türkische Sprachkorpora.",
              es:"Recolección automatizada de datos para corpus en turco."},
  /* CERTIFICATES PAGE */
  "cp.eyebrow":  {en:"03 — Education",  tr:"03 — Eğitim",      de:"03 — Bildung",      es:"03 — Educación"},
  "cp.t1":       {en:"CERTS &",         tr:"SERTİFİKA",        de:"ZERTIFIKATE",       es:"CERTS &"},
  "cp.t2":       {en:"LEARNING",        tr:"& ÖĞRENİM",        de:"& LERNEN",          es:"APRENDIZAJE"},
  "cp.desc":     {
    en:"Verified certificates from Coursera, IBM, Google, Stanford, and DeepLearning.AI — expanding knowledge across AI, ML, and engineering.",
    tr:"Coursera, IBM, Google, Stanford ve DeepLearning.AI'dan doğrulanmış sertifikalar — yapay zeka, ML ve mühendislik bilgisini genişletiyor.",
    de:"Verifizierte Zertifikate von Coursera, IBM, Google, Stanford und DeepLearning.AI.",
    es:"Certificados verificados de Coursera, IBM, Google, Stanford y DeepLearning.AI."},
  "cp.verify":   {en:"✓ Verify Certificate ↗",tr:"✓ Sertifikayı Doğrula ↗",de:"✓ Zertifikat prüfen ↗",es:"✓ Verificar Certificado ↗"},
  "cp.credly":   {en:"Credly Profile ↗",tr:"Credly Profilim ↗",de:"Credly-Profil ↗",es:"Perfil de Credly ↗"},
  "cp.portfolio":{en:"In Portfolio",    tr:"Portfolyoda",       de:"Im Portfolio",      es:"En Portafolio"},
  "cf.all":      {en:"All",             tr:"Tümü",             de:"Alle",              es:"Todos"},
  "cf.data":     {en:"Data",            tr:"Veri",             de:"Daten",             es:"Datos"},
  "cf.eng":      {en:"Engineering",     tr:"Mühendislik",      de:"Ingenieurwesen",    es:"Ingeniería"},
  /* TUTORIALS PAGE */
  "tp.eyebrow":  {en:"05 — Knowledge Base",  tr:"05 — Bilgi Tabanı",    de:"05 — Wissensbasis",       es:"05 — Base de Conocimiento"},
  "tp.t1":       {en:"SOFTWARE",             tr:"YAZILIM",              de:"SOFTWARE",                es:"TUTORIALES"},
  "tp.t2":       {en:"TUTORIALS",            tr:"EĞİTİMLERİ",           de:"TUTORIALS",               es:"DE SOFTWARE"},
  "tp.desc":     {
    en:"Practical guides written from real engineering and research experience. From <em>C fundamentals</em> to <em>Transformer architectures</em>.",
    tr:"Gerçek mühendislik ve araştırma deneyiminden yazılmış pratik rehberler. <em>C temelleri</em>nden <em>Transformer mimarileri</em>ne kadar.",
    de:"Praxisanleitungen aus echter Ingenieur- und Forschungserfahrung. Von <em>C-Grundlagen</em> bis zu <em>Transformer-Architekturen</em>.",
    es:"Guías prácticas de experiencia real. Desde <em>fundamentos de C</em> hasta <em>arquitecturas Transformer</em>."},
  "tp.sb.title": {en:"TUTORIALS",           tr:"EĞİTİMLER",            de:"TUTORIALS",               es:"TUTORIALES"},
  "tp.sb.sub":   {en:"Software & AI Guides",tr:"Yazılım & YZ Rehberleri",de:"Software- & KI-Leitfäden",es:"Guías de Software e IA"},
  "tp.g.sys":    {en:"Systems & Languages", tr:"Sistemler & Diller",   de:"Systeme & Sprachen",      es:"Sistemas y Lenguajes"},
  "tp.g.py":     {en:"Python Ecosystem",    tr:"Python Ekosistemi",    de:"Python-Ökosystem",        es:"Ecosistema Python"},
  "tp.g.ai":     {en:"AI & Machine Learning",tr:"YZ & Makine Öğrenmesi",de:"KI & Maschinelles Lernen",es:"IA y Machine Learning"},
  "tp.g.soon":   {en:"Coming Soon",         tr:"Yakında",              de:"Demnächst",               es:"Próximamente"},
  "tp.back":     {en:"← All Tutorials",     tr:"← Tüm Eğitimler",     de:"← Alle Tutorials",        es:"← Todos los Tutoriales"},
  "tp.linux":    {en:"Linux & Bash",        tr:"Linux & Bash",         de:"Linux & Bash",            es:"Linux y Bash"},
  "tp.git":      {en:"Git & GitHub",        tr:"Git & GitHub",         de:"Git & GitHub",            es:"Git y GitHub"},
  "tp.scr":      {en:"Web Scraping",        tr:"Web Kazıma",           de:"Web-Scraping",            es:"Web Scraping"},

};

/* ENGINE */
let lang = 'en';

function getLang() {
  const s = localStorage.getItem('ms_lang');
  if (s && LANGS.includes(s)) return s;
  const b = (navigator.language||'en').slice(0,2).toLowerCase();
  return LANGS.includes(b) ? b : 'en';
}

function t(key) {
  const e = T[key];
  if (!e) return '';
  return e[lang] ?? e['en'] ?? '';
}

function applyAll() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t(el.dataset.i18n);
    if (v !== '') el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-text]').forEach(el => {
    const v = t(el.dataset.i18nText);
    if (v !== '') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = t(el.dataset.i18nPh);
    if (v !== '') el.placeholder = v;
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('.ls-btn').forEach(b =>
    b.classList.toggle('ls-active', b.dataset.lang === lang)
  );
}

function setLang(l) {
  if (!LANGS.includes(l)) return;
  lang = l;
  localStorage.setItem('ms_lang', l);
  applyAll();
}

/* SWITCHER */
function buildSw(mobile) {
  const w = document.createElement('div');
  w.className = mobile ? 'ls-wrap ls-mobile' : 'ls-wrap';
  w.innerHTML = LANGS.map(l =>
    `<button class="ls-btn${l===lang?' ls-active':''}" data-lang="${l}"
      title="${NAMES[l]}" onclick="setLang('${l}')">${LABELS[l]}</button>`
  ).join('');
  return w;
}

function injectSw() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const hb = nav.querySelector('.hamburger');
  const sw = buildSw(false);
  hb ? nav.insertBefore(sw, hb) : nav.appendChild(sw);
  const mn = document.getElementById('mobileNav');
  if (mn) mn.appendChild(buildSw(true));
}

/* STYLES */
function injectCSS() {
  if (document.getElementById('ls-css')) return;
  const s = document.createElement('style');
  s.id = 'ls-css';
  s.textContent = `
    .ls-wrap{display:flex;align-items:center;gap:1px;margin-right:.5rem;}
    .ls-btn{background:none;border:1px solid transparent;color:rgba(232,224,208,.28);
      font-family:'DM Mono',monospace;font-size:.5rem;letter-spacing:.12em;
      padding:.26rem .46rem;cursor:pointer;transition:all .2s;text-transform:uppercase;line-height:1;}
    .ls-btn:hover{color:rgba(232,224,208,.75);border-color:rgba(200,169,110,.25);}
    .ls-active{color:var(--gold,#c8a96e)!important;border-color:rgba(200,169,110,.5)!important;
      background:rgba(200,169,110,.07)!important;}
    .ls-mobile{margin-top:1.2rem;gap:.5rem;}
    .ls-mobile .ls-btn{font-size:.75rem;padding:.45rem .9rem;}
    @media(max-width:768px){.ls-wrap:not(.ls-mobile){display:none;}}
  `;
  document.head.appendChild(s);
}

/* INIT */
function i18nInit() {
  lang = getLang();
  injectCSS();
  injectSw();
  applyAll();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', i18nInit)
  : i18nInit();
