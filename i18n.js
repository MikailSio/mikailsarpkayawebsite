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
    en:"Electrical & Electronics Engineer — M.Sc. Candidate",
    tr:"Elektrik & Elektronik Mühendisi — Yüksek Lisans Öğrencisi",
    de:"Elektro- & Elektronikingenieur — M.Sc.-Kandidat",
    es:"Ingeniero Eléctrico y Electrónico — Estudiante de Máster"},
  "hero.desc":        {
    en:"<strong>AI & Software-Oriented Engineer</strong> building intelligent systems at the intersection of <em>NLP</em>, <em>Deep Learning</em> &amp; <em>Data Science</em>.<br><br>Osmaniye Korkut Ata University<br>Based in Turkey — Osmaniye",
    tr:"<strong>Yapay Zeka & Yazılım Odaklı Mühendis</strong> — <em>NLP</em>, <em>Derin Öğrenme</em> ve <em>Veri Bilimi</em> kesişiminde akıllı sistemler geliştiriyor.<br><br>Osmaniye Korkut Ata Üniversitesi<br>Türkiye — Osmaniye",
    de:"<strong>KI- & Software-orientierter Ingenieur</strong> entwickelt intelligente Systeme an der Schnittstelle von <em>NLP</em>, <em>Deep Learning</em> &amp; <em>Data Science</em>.<br><br>Osmaniye Korkut Ata Universität<br>Türkei — Osmaniye",
    es:"<strong>Ingeniero orientado a IA y Software</strong> construyendo sistemas inteligentes en la intersección de <em>NLP</em>, <em>Deep Learning</em> &amp; <em>Data Science</em>.<br><br>Universidad Osmaniye Korkut Ata<br>Turquía — Osmaniye"},
  "hero.scroll":      {en:"Scroll to explore",tr:"Keşfetmek için kaydır",de:"Scrollen zum Erkunden",es:"Desplázate para explorar"},
  /* STATS */
  "stat.msc":  {en:"Graduate Student", tr:"Yüksek Lisans Öğrencisi",  de:"Masterstudent",       es:"Estudiante de Posgrado"},
  "stat.lang": {en:"Languages",          tr:"Programlama Dili",      de:"Sprachen",            es:"Lenguajes"},
  "stat.proj": {en:"Active Projects",    tr:"Aktif Proje",           de:"Aktive Projekte",     es:"Proyectos Activos"},
  "stat.cert": {en:"Certificates",       tr:"Sertifika",             de:"Zertifikate",         es:"Certificados"},
  /* ABOUT */
  "about.eyebrow": {en:"02 — Profile",  tr:"02 — Profil",      de:"02 — Profil",      es:"02 — Perfil"},
  "about.t1":      {en:"ENGINEER",      tr:"MÜHENDİS",         de:"INGENIEUR",        es:"INGENIERO"},
  "about.t2":      {en:"RESEARCHER",    tr:"ARAŞTIRMACI",      de:"FORSCHER",         es:"INVESTIGADOR"},
  "about.t3":      {en:"BUILDER",       tr:"YAPICI",           de:"ENTWICKLER",       es:"CONSTRUCTOR"},
  "about.p1":      {
    en:"I'm an <strong>Electrical & Electronics Engineer</strong> (B.Sc. 2020, Korkut Ata University) currently pursuing my Master's degree at the same institution, focused on NLP and Deep Learning.",
    tr:"<strong>Elektrik & Elektronik Mühendisiyim</strong> (Lisans 2020, Korkut Ata Üniversitesi), şu anda NLP ve Derin Öğrenme odaklı yüksek lisansımı sürdürüyorum.",
    de:"Ich bin <strong>Elektro- & Elektronikingenieur</strong> (B.Sc. 2020, Korkut Ata Universität) und absolviere meinen Master mit Schwerpunkt NLP und Deep Learning.",
    es:"Soy <strong>Ingeniero Eléctrico y Electrónico</strong> (Lic. 2020, Universidad Korkut Ata), cursando mi maestría enfocada en NLP y Deep Learning."},
  "about.p2":      {
    en:"I work at the intersection of <strong>academic research</strong> and production software — from transformer-based NLP models to web apps deployed on Hetzner VPS with Nginx & Cloudflare.",
    tr:"<strong>Akademik araştırma</strong> ile üretim yazılımının kesişiminde çalışıyorum — transformer tabanlı NLP modellerinden Hetzner VPS üzerinde Nginx & Cloudflare ile deploy edilmiş web uygulamalarına kadar.",
    de:"Ich arbeite an der Schnittstelle von <strong>akademischer Forschung</strong> und Produktionssoftware — von Transformer-NLP-Modellen bis zu Web-Apps auf Hetzner VPS.",
    es:"Trabajo en la intersección de <strong>investigación académica</strong> y software de producción — desde modelos NLP transformer hasta apps en Hetzner VPS."},
  "about.p3":      {
    en:"Continuously expanding knowledge through Coursera, IBM, Google, Stanford and DeepLearning.AI certifications — and building things that matter.",
    tr:"Coursera, IBM, Google, Stanford ve DeepLearning.AI sertifikaları ile bilgimi sürekli genişletiyorum — ve önemli şeyler inşa ediyorum.",
    de:"Kontinuierliche Wissenserweiterung durch Coursera-, IBM-, Google-, Stanford- und DeepLearning.AI-Zertifikate.",
    es:"Ampliando continuamente el conocimiento con certificaciones de Coursera, IBM, Google, Stanford y DeepLearning.AI."},
  "about.quote":   {
    en:"\"Engineering intelligence,<br>one model at a time.\"",
    tr:"\"Her model,<br>bir adım daha ileri.\"",
    de:"\"Intelligenz entwickeln,<br>ein Modell nach dem anderen.\"",
    es:"\"Ingeniería de inteligencia,<br>un modelo a la vez.\""},,
  "about.art":     {en:"// Neural Architecture",tr:"// Sinir Mimarisi",de:"// Neuronale Architektur",es:"// Arquitectura Neuronal"},
  /* INDEX PROJECTS */
  "p1.label": {en:"001 — Featured",    tr:"001 — Öne Çıkan",      de:"001 — Highlight",    es:"001 — Destacado"},
  "p1.pull":  {en:"\"From zero to fluent — an AI-powered path through English.\"",
               tr:"\"Sıfırdan akıcıya — yapay zeka destekli İngilizce yolculuğu.\"",
               de:"\"Von null bis fließend — ein KI-gestützter Weg durch Englisch.\"",
               es:"\"De cero a fluido — un camino impulsado por IA a través del inglés.\""},
  "p1.desc":  {
    en:"An interactive English learning platform for learners starting from scratch. Features vocabulary, grammar, and practice exercises. Deployed live at abctohero.com with a companion mobile app in development.",
    tr:"Sıfırdan başlayanlar için interaktif İngilizce öğrenme platformu. Kelime bilgisi, gramer ve alıştırmalar. abctohero.com'da canlı, mobil uygulama geliştirme aşamasında.",
    de:"Interaktive Englischlernplattform für Anfänger. Mit Vokabular, Grammatik und Übungen. Live unter abctohero.com.",
    es:"Plataforma interactiva de inglés para principiantes. Vocabulario, gramática y ejercicios en abctohero.com."},
  "p1.cta":   {en:"Visit abctohero.com",tr:"abctohero.com'u Ziyaret Et",de:"abctohero.com besuchen",es:"Visitar abctohero.com"},
  "p2.label": {en:"002 — M.Sc. Thesis",tr:"002 — Yüksek Lisans Tezi",de:"002 — Masterarbeit",es:"002 — Tesis M.Sc."},
  "p2.pull":  {en:"\"Teaching machines to understand Turkish language at scale.\"",
               tr:"\"Makinelere Türkçeyi büyük ölçekte anlamayı öğretmek.\"",
               de:"\"Maschinen beibringen, Türkisch in großem Maßstab zu verstehen.\"",
               es:"\"Enseñando a las máquinas a entender el turco a gran escala.\""},
  "p2.desc":  {
    en:"Graduate research combining automated web scraping pipelines, data cleaning, and transformer-based deep learning architectures for Turkish text analysis.",
    tr:"Türkçe metin analizi için otomatik web kazıma, veri temizleme ve transformer tabanlı derin öğrenme mimarilerini birleştiren lisansüstü araştırma.",
    de:"Masterforschung mit Web-Scraping-Pipelines und Transformer-Architekturen für türkische Textanalyse.",
    es:"Investigación de posgrado con web scraping y transformers para análisis de texto turco."},
  "p2.cta":   {en:"See Research",tr:"Araştırmayı Gör",de:"Forschung ansehen",es:"Ver Investigación"},
  "p3.label": {en:"003 — Research",tr:"003 — Araştırma",de:"003 — Forschung",es:"003 — Investigación"},
  "p3.pull":  {en:"\"Exploring the limits of large language models through fine-tuning experiments.\"",
               tr:"\"İnce ayar deneyleriyle büyük dil modellerinin sınırlarını keşfetmek.\"",
               de:"\"Die Grenzen großer Sprachmodelle durch Fine-Tuning erkunden.\"",
               es:"\"Explorando los límites de los LLM mediante fine-tuning.\""},
  "p3.desc":  {
    en:"Research and fine-tuning experiments on Large Language Models. Investigating model performance, prompt engineering, and domain adaptation for Turkish.",
    tr:"Büyük Dil Modelleri üzerinde araştırma ve ince ayar deneyleri. Model performansı, prompt mühendisliği ve Türkçe için alan adaptasyonu.",
    de:"Fine-Tuning-Experimente mit LLMs. Modellleistung, Prompt-Engineering und Domänenadaption für Türkisch.",
    es:"Investigación y fine-tuning en LLMs. Rendimiento de modelos, ingeniería de prompts y adaptación para turco."},
  /* RESEARCH */
  "res.eyebrow": {en:"03",tr:"03",de:"03",es:"03"},
  "res.t1":      {en:"RESEARCH",   tr:"ARAŞTIRMA",   de:"FORSCHUNG",    es:"INVESTIGACIÓN"},
  "res.t2":      {en:"PAPERS",     tr:"MAKALELER",   de:"PAPERS",       es:"ARTÍCULOS"},
  "res.intro":   {
    en:"Academic work at the intersection of Natural Language Processing and Deep Learning. Focused on Turkish language understanding and intelligent text classification. M.Sc. candidate at Osmaniye Korkut Ata University.",
    tr:"Doğal Dil İşleme ve Derin Öğrenme kesişiminde akademik çalışmalar. Türkçe dil anlama ve akıllı metin sınıflandırması odaklı. Osmaniye Korkut Ata Üniversitesi yüksek lisans adayı.",
    de:"Akademische Arbeit an der Schnittstelle von NLP und Deep Learning. Schwerpunkt auf türkischem Sprachverständnis. M.Sc.-Kandidat an der Osmaniye Korkut Ata Universität.",
    es:"Trabajo académico en la intersección de NLP y Deep Learning. Enfocado en la comprensión del turco. Estudiante de Máster en la Universidad Osmaniye Korkut Ata."},
  "r1.title": {en:"Deep Learning & NLP Integration for Turkish Text Analysis",
               tr:"Türkçe Metin Analizi için Derin Öğrenme ve NLP Entegrasyonu",
               de:"Deep Learning & NLP-Integration für türkische Textanalyse",
               es:"Integración de Deep Learning y NLP para Análisis de Texto Turco"},
  "r1.desc":  {en:"M.Sc. thesis — transformer architectures with domain-specific corpus construction via automated web scraping and data cleaning pipelines.",
               tr:"Yüksek lisans tezi — otomatik web kazıma ve veri temizleme pipeline'ları ile alana özgü korpus oluşturumu içeren transformer mimarileri.",
               de:"Masterarbeit — Transformer-Architekturen mit Korpusaufbau über Web-Scraping-Pipelines.",
               es:"Tesis M.Sc. — arquitecturas transformer con corpus de dominio específico."},
  "r1.badge": {en:"Ongoing",       tr:"Devam Ediyor",   de:"Laufend",         es:"En Curso"},
  "r2.title": {en:"NLP-Based Text Classification Model — Journal Paper",
               tr:"NLP Tabanlı Metin Sınıflandırma Modeli — Dergi Makalesi",
               de:"NLP-basiertes Textklassifikationsmodell — Zeitschriftenartikel",
               es:"Modelo de Clasificación de Texto con NLP — Artículo de Revista"},
  "r2.desc":  {en:"Co-authored paper combining NLP methods and deep learning for text classification. Collaboration with faculty at Korkut Ata University.",
               tr:"NLP yöntemleri ve derin öğrenmeyi birleştiren ortak makale. Korkut Ata Üniversitesi akademisyenleriyle işbirliği.",
               de:"Gemeinsam verfasster Artikel zu NLP und Deep Learning für Textklassifikation.",
               es:"Artículo coautor combinando NLP y deep learning para clasificación de texto."},
  "r2.badge": {en:"In Preparation",tr:"Hazırlanıyor",  de:"In Vorbereitung", es:"En Preparación"},
  "r3.title": {en:"Automated Web Scraping & Data Preprocessing Pipelines",
               tr:"Otomatik Web Kazıma ve Veri Ön İşleme Pipeline'ları",
               de:"Automatisierte Web-Scraping- und Datenvorverarbeitungs-Pipelines",
               es:"Pipelines Automatizados de Web Scraping y Preprocesamiento"},
  "r3.desc":  {en:"Design and implementation of automated data collection systems for Turkish language corpora used in downstream NLP tasks.",
               tr:"NLP görevlerinde kullanılan Türkçe dil korpusları için otomatik veri toplama sistemleri.",
               de:"Entwurf automatisierter Datenerfassungssysteme für türkische Sprachkorpora.",
               es:"Diseño de sistemas automatizados de recolección de datos para corpus en turco."},
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
    en:"© 2025 Mikail Sarpkaya. All rights reserved.",
    tr:"© 2025 Mikail Sarpkaya. Tüm hakları saklıdır.",
    de:"© 2025 Mikail Sarpkaya. Alle Rechte vorbehalten.",
    es:"© 2025 Mikail Sarpkaya. Todos los derechos reservados."},
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
  "pa.abc.d":{en:"Interactive English learning platform for learners starting from scratch. Vocabulary, grammar, practice exercises, and adaptive learning paths.",
              tr:"Sıfırdan başlayan öğrenciler için interaktif İngilizce öğrenme platformu. Kelime, gramer ve alıştırmalar.",
              de:"Interaktive Englischlernplattform für Anfänger. Vokabular, Grammatik und Übungsaufgaben.",
              es:"Plataforma interactiva de inglés para principiantes. Vocabulario, gramática y ejercicios prácticos."},
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
  /* TUT-C */
  "tc.eyebrow":  {en:"Tutorial 01 · Systems Programming",tr:"Eğitim 01 · Sistem Programlama",de:"Tutorial 01 · Systemprogrammierung",es:"Tutorial 01 · Programación de Sistemas"},
  "tc.desc":     {
    en:"The foundation of systems programming. C gives you direct control over memory and hardware. Understanding C makes you a <strong>better programmer</strong> in any language.",
    tr:"Sistem programlamanın temeli. C size bellek ve donanım üzerinde doğrudan kontrol sağlar. C'yi anlamak sizi her dilde <strong>daha iyi bir programcı</strong> yapar.",
    de:"Die Grundlage der Systemprogrammierung. C gibt direkte Kontrolle über Speicher und Hardware und macht Sie zu einem <strong>besseren Programmierer</strong>.",
    es:"La base de la programación de sistemas. C da control directo sobre memoria y hardware. Entender C te hace un <strong>mejor programador</strong>."},
  "tc.level":    {en:"Beginner → Intermediate",tr:"Başlangıç → Orta",de:"Anfänger → Mittel",es:"Principiante → Intermedio"},
  "tc.lessons":  {en:"Lessons",  tr:"Ders",      de:"Lektionen", es:"Lecciones"},
  "tc.compiler": {en:"Compiler", tr:"Derleyici", de:"Compiler",  es:"Compilador"},
  "tc.l1":       {en:"Hello World & Compilation", tr:"Hello World & Derleme",       de:"Hello World & Kompilierung",   es:"Hello World y Compilación"},
  "tc.l2":       {en:"Variables & Data Types",    tr:"Değişkenler & Veri Tipleri",  de:"Variablen & Datentypen",       es:"Variables y Tipos de Datos"},
  "tc.l3":       {en:"Pointers & Memory",         tr:"İşaretçiler & Bellek",        de:"Zeiger & Speicher",            es:"Punteros y Memoria"},
  "tc.l4":       {en:"Functions & Recursion",     tr:"Fonksiyonlar & Özyineleme",   de:"Funktionen & Rekursion",       es:"Funciones y Recursión"},
  "tc.l5":       {en:"Arrays & Strings",          tr:"Diziler & Karakter Dizileri", de:"Arrays & Strings",             es:"Arrays y Cadenas"},
  "tc.l6":       {en:"File I/O in C",             tr:"C'de Dosya G/Ç",              de:"Datei-E/A in C",               es:"E/S de Archivos en C"},
  "tc.next":     {en:"Next: C++ →",  tr:"Sonraki: C++ →", de:"Nächste: C++ →", es:"Siguiente: C++ →"},
  "tc.navlbl":   {en:"C Language · 6 / 6 lessons ·",tr:"C Dili · 6 / 6 ders ·",de:"C · 6 / 6 Lektionen ·",es:"Lenguaje C · 6 / 6 lecciones ·"},
  /* SHARED LESSON LABELS */
  "lb.avail": {en:"Available", tr:"Mevcut",   de:"Verfügbar",   es:"Disponible"},
  "lb.new":   {en:"New",       tr:"Yeni",     de:"Neu",         es:"Nuevo"},
  "lb.soon":  {en:"Soon",      tr:"Yakında",  de:"Bald",        es:"Pronto"},
  "lb.5min":  {en:"5 min read",tr:"5 dk",    de:"5 Min.",      es:"5 min"},
  "lb.8min":  {en:"8 min read",tr:"8 dk",    de:"8 Min.",      es:"8 min"},
  "lb.10min": {en:"10 min read",tr:"10 dk",  de:"10 Min.",     es:"10 min"},
  "lb.12min": {en:"12 min read",tr:"12 dk",  de:"12 Min.",     es:"12 min"},
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
