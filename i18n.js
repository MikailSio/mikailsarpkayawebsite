/* ═══════════════════════════════════════
   i18n.js — 4-language support (TR/EN/DE/ES)
   ═══════════════════════════════════════ */
const translations = {
  en: {
    "nav.home":"Home","nav.about":"About","nav.projects":"Projects","nav.certificates":"Certificates","nav.tutorials":"Tutorials",
    "cp.eyebrow":"Credentials","cp.t1":"CERTS &","cp.t2":"LEARNING","cp.desc":"Verified certificates from Coursera, IBM, and SiliconMade Academy — continuously expanding knowledge across engineering and programming.",
    "cf.all":"All","cf.eng":"Engineering","cf.ai":"AI / Data",
    "cert.sma.name":"Basic Programming Education","cert.sma2.name":"AI & Data Science Education","cert.portfolio":"In Progress","cert.credly.label":"More badges on","cert.credly.cta":"View my Credly profile",
    "pp.eyebrow":"Works","pp.t1":"ALL","pp.t2":"PROJECTS","pp.desc":"Software, research, and engineering projects — from production web apps to academic AI research.",
    "f.all":"All","f.ai":"AI / ML","f.web":"Web","f.edu":"Education",
    "pa.abc.tag":"Featured","pa.abc.t":"AbcToHero — Language Learning Platform","pa.abc.d":"A platform I built to learn English while watching TV shows. From 60 series, unique words extracted scene by scene (2/4/6-minute windows, re-deduplicated when widened). Your profile keeps a \"known words\" pool that removes marked words from your curriculum site-wide. ~107k scenes, 54k+ words, etymology pages for the important root words. Separate study tracks for YDS exam prep and the Top 7000 basics. Designed for cross-language learning across 4 languages (TR/EN/DE/ES). Android app on the way.",
    "pa.site.d":"Personal portfolio and tutorial site. Custom-built with vanilla HTML/CSS/JS. UI in 4 languages (TR/EN/DE/ES); tutorials currently in TR/EN. Deployed on Linux VPS with Nginx and Cloudflare.",
    "st.live":"Live","st.wip":"In Progress",
    "hero.eyebrow":"Electrical & Electronics Engineer — EEE M.Sc.",
    "hero.desc":"<strong>I'm an AI & NLP researcher</strong> — spending most of my time with deep learning and transformer architectures.<br><br>EEE M.Sc. (NLP focus) — Osmaniye Korkut Ata University<br><strong>TÜBİTAK 1001 Research Fellow</strong>",
    "hero.scroll":"Scroll to explore",
    "about.quote":"\"What I cannot create, I do not understand.\"<span class=\"quote-author\">— Richard Feynman</span><br>\"AI is the new electricity.\"<span class=\"quote-author\">— Andrew Ng</span>",
    "about.eyebrow":"Profile","about.t1":"ABOUT","about.t2":"ME",
    "about.p1":"My academic journey started at Osmaniye Korkut Ata University with <strong>Electrical & Electronics Engineering</strong>; now I'm continuing with my <strong>M.Sc.</strong> in the same department, focused on <strong>NLP</strong>. Next year I'm spending two semesters at <em>Tarragona / URV</em> on <strong>Erasmus</strong> — I'll be working on my M.Sc. thesis there while taking courses from their <strong>Computer Security Engineering and AI</strong> program. That's why I've been doubling down on math foundations and cybersecurity lately.",
    "about.p2":"The tutorials and projects here — from Python basics to transformer architectures — are records I keep to lock down what I'm learning. <strong>I come back to them often</strong> — adding what I've newly learned and emerging technologies as they come, so my knowledge stays fresh. I learn by explaining; AI helps along the way.",
    "about.p3":"I don't enjoy keeping things just in theory — building and sharing is the real fun. I run a few projects on a <strong>Linux VPS</strong> with Nginx & Cloudflare; the one I care about most is <em>abctohero.com</em>, a platform I built to learn English while watching TV shows. From 60 series, I extracted <strong>130k+ raw words</strong> from the subtitles and filtered them down to a <strong>54k+ word pool</strong> — the important root words have their own etymology pages.<br><br>On the academic side, I'm a <strong>research scholarship holder</strong> in a <strong>TÜBİTAK 1001</strong> project led by my advisor <em>(area: machine learning for rehabilitation devices)</em>.",
    "p1.label":"Featured Project","p1.pull":"I wanted to learn English the way I actually watch shows — so I built it: scene by scene, from real episodes, with vocabulary straight from the screen.","p1.desc":"From 60 TV shows, unique words are extracted scene by scene from the subtitles — pick 2, 4, or 6-minute windows (a wider window merges smaller scenes and re-deduplicates, so no repeats). ~107k scenes in total. Your profile keeps a <strong>\"known words\" pool</strong>: words you mark as known drop out of your curriculum site-wide; you can take them back out anytime. 54k+ words in the database, with etymology pages (roots, derivations, meanings) for the important root words. Words are also tagged for <strong>YDS exam prep</strong> and the <strong>Top 7000 basics</strong> — each with its own study pages. Designed for <strong>cross-language learning across 4 languages</strong> (TR/EN/DE/ES) — pick your native and your target. Django + PostgreSQL under the hood. Android app on the way.","p1.cta":"Visit abctohero.com","p1.details":"Project details",
    "tut.eyebrow":"Learning Path","tut.t1":"TUTORIAL","tut.t2":"SERIES","tut.intro":"Personal notes I keep along the AI/ML learning path — from Python basics to transformer architectures. Records I write for myself and revise from time to time; if they help someone else too, that's a bonus. Currently in TR/EN.","tut.cta":"Browse All Tutorials",
    "tut.um.ai":"AI / Machine Learning","tut.um.ai.topics":"ML · Deep Learning · NLP · Computer Vision · Audio · Multimodal · Transformers · RNN · GNN · Reinforcement Learning · Generative AI · Agents · RAG · Embeddings · Vector DBs · Time Series",
    "tut.um.math":"Mathematics","tut.um.math.topics":"Linear Algebra · Calculus · Probability · Statistics · Discrete Math · Differential Equations · Fourier Analysis · Complex Analysis",
    "tut.um.lang":"Programming Languages","tut.um.lang.topics":"Python · C · C++ · JavaScript · SQL · LaTeX",
    "tut.um.tools":"Tools & Libraries","tut.um.tools.topics":"PyTorch · NumPy · Pandas · sklearn · Matplotlib · HuggingFace · LangChain · Git · GPU Programming",
    "tut.um.sys":"Systems & DevOps","tut.um.sys.topics":"MLOps · Docker · Nginx · Linux VPS · Cloudflare · Edge Computing · IoT",
    "tut.um.sec":"Security & Ethics","tut.um.sec.topics":"Network Security · ML Security · Cryptography · Privacy-Preserving ML · Fairness · AI Safety · AI Compliance · Digital Forensics",
    "tut.um.ales":"ALES Exam Prep","tut.um.ales.topics":"62 lessons — Numbers · Algebra · Geometry · Functions · Calculus · Statistics · Exam Strategies",
    "tut.cat.base":"Fundamentals","tut.cat.math":"Mathematics","tut.cat.ml":"Machine Learning","tut.cat.nlp":"Natural Language Processing","tut.cat.sys":"Systems Programming",
    "tut.lvl.beg":"Beginner","tut.lvl.int":"Intermediate","tut.lvl.adv":"Advanced","tut.lessons":"6 Lessons",
    "tut.d.python":"Variables, loops, functions, OOP","tut.d.numpy":"Arrays, indexing, broadcasting","tut.d.pandas":"DataFrames, cleaning, groupby","tut.d.math":"Vectors, matrices, eigen, probability","tut.d.calc":"Derivatives, gradients, optimization","tut.d.ml":"Regression, trees, evaluation","tut.d.dl":"Perceptrons, CNNs, PyTorch","tut.d.nlp":"Preprocessing, BoW, TF-IDF","tut.d.emb":"Word2Vec, GloVe, subword","tut.d.rnn":"Sequences, gates, seq2seq","tut.d.tf":"Attention, BERT, GPT","tut.d.hf":"Fine-tuning, deployment, LoRA","tut.d.c":"Pointers, memory, structs",
    "con.ghost":"CONNECT","con.eyebrow":"Get In Touch","con.t1":"LET'S","con.t2":"TALK","con.sub":"Open to research collaborations, academic discussions,<br>freelance projects, and interesting engineering challenges.","con.email":"Email Me","con.cv":"View CV",
    "footer":"© 2026 Mikail Sarpkaya. All rights reserved."
  },
  tr: {
    "nav.home":"Ana Sayfa","nav.about":"Hakkımda","nav.projects":"Projeler","nav.certificates":"Sertifikalar","nav.tutorials":"Dersler",
    "cp.eyebrow":"Belgeler","cp.t1":"SERTİFİKA &","cp.t2":"ÖĞRENİM","cp.desc":"Coursera, IBM ve SiliconMade Academy'den doğrulanmış sertifikalar — mühendislik ve programlama alanında sürekli genişleyen bilgi birikimi.",
    "cf.all":"Tümü","cf.eng":"Mühendislik","cf.ai":"YZ / Veri",
    "cert.sma.name":"Temel Programlama Eğitimi","cert.sma2.name":"Yapay Zeka ve Veri Bilimi Eğitimi","cert.portfolio":"Devam Ediyor","cert.credly.label":"Daha fazla rozet","cert.credly.cta":"Credly profilime bak",
    "pp.eyebrow":"Çalışmalar","pp.t1":"TÜM","pp.t2":"PROJELER","pp.desc":"Yazılım, araştırma ve mühendislik projeleri — üretim web uygulamalarından akademik YZ araştırmasına.",
    "f.all":"Tümü","f.ai":"YZ / ML","f.web":"Web","f.edu":"Eğitim",
    "pa.abc.tag":"Öne Çıkan","pa.abc.t":"AbcToHero — Dil Öğrenme Platformu","pa.abc.d":"Dizi izlerken İngilizce öğrenmek için kurduğum platform. 60 dizinin altyazılarından sahne sahne benzersiz kelimeler (2/4/6 dk pencere, geniş pencerede yeniden benzersizleştiriliyor). Profilindeki 'bildiklerim havuzu' bildiğin kelimeleri müfredattan çıkarıyor. ~107k sahne, 54k+ kelime, kök kelimelerin etimoloji sayfaları. YDS ve temel 7000 için ayrı çalışma modülleri. 4 dil arası öğrenme için tasarlandı (TR/EN/DE/ES). Android uygulaması yolda.",
    "pa.site.d":"Kişisel portfolyo ve ders sitesi. Vanilla HTML/CSS/JS ile özel yapım. Arayüz 4 dilde (TR/EN/DE/ES); dersler şu an TR/EN. Linux VPS üzerinde Nginx ve Cloudflare ile deploy edildi.",
    "st.live":"Yayında","st.wip":"Devam Ediyor",
    "hero.eyebrow":"Elektrik & Elektronik Mühendisi — EEE Yüksek Lisans",
    "hero.desc":"<strong>AI & NLP üzerine çalışan bir araştırmacıyım</strong> — şu sıralar derin öğrenme ve transformer mimarileriyle vakit geçiriyorum.<br><br>EEE Yüksek Lisans (NLP odaklı) — Osmaniye Korkut Ata Üniversitesi<br><strong>TÜBİTAK 1001 Araştırma Bursiyeri</strong>",
    "hero.scroll":"Keşfetmek için kaydır",
    "about.quote":"\"Yaratamadığım şeyi anlamıyorum.\"<span class=\"quote-author\">— Richard Feynman</span><br>\"Yapay zeka yeni elektriktir.\"<span class=\"quote-author\">— Andrew Ng</span>",
    "about.eyebrow":"Profil","about.t1":"HAKKIMDA","about.t2":"",
    "about.p1":"Osmaniye Korkut Ata Üniversitesi'nde <strong>Elektrik & Elektronik Mühendisliği</strong> ile başlayan akademik yolculuğuma, şimdi aynı bölümde <strong>NLP</strong> üzerine <strong>yüksek lisansa</strong> devam ediyorum. Önümüzdeki yıl <strong>Erasmus</strong> kapsamında 2 yarıyıl <em>Tarragona / URV</em>'de geçireceğim — orada yüksek lisans tezimi yürütürken aynı zamanda <strong>Bilgisayar Güvenliği & Yapay Zeka</strong> programının derslerinden almayı planlıyorum. Son aylarda matematik temellerine ve siber güvenliğe ağırlık vermem de bu yüzden.",
    "about.p2":"Buradaki dersler ve projeler — Python'dan transformer mimarilerine kadar — öğrendiklerimi pekiştirmek için tuttuğum kayıtlar. <strong>Sık sık dönüp güncelliyorum</strong> — yeni öğrendiklerimi ve gelişen teknolojileri de buraya ekliyorum, bilgilerimin taze kalması için. Anlatarak öğreniyorum; yapay zeka da bu yolda yardımcım.",
    "about.p3":"Sadece teoride kalmayı sevmiyorum — üretmek ve paylaşmak işin esas keyfi. <strong>Linux VPS</strong> üstünde Nginx & Cloudflare ile birkaç proje çalıştırıyorum; en değer verdiğim <em>abctohero.com</em>, dizi izlerken İngilizce öğrenmek için kurduğum platform. 60 dizinin altyazılarından çıkardığım <strong>130k+ ham kelimeyi</strong> filtreleyip <strong>54k+ kelimelik bir havuza</strong> indirdim — önemli kök kelimelerin ayrı etimoloji sayfaları var.<br><br>Akademik tarafta, danışmanımın yürütücüsü olduğu bir <strong>TÜBİTAK 1001</strong> araştırma projesinde <strong>bursiyer</strong> olarak yer alıyorum <em>(alan: makine öğrenmesi tabanlı rehabilitasyon)</em>.",
    "p1.label":"Öne Çıkan Proje","p1.pull":"\"İngilizceyi dizi izlediğim gibi öğrenmek istedim — sonra bunu yaptım: sahne sahne, gerçek bölümlerden, ekranın sana verdiği kelimelerle.\"","p1.desc":"60 dizinin altyazılarından <strong>sahne sahne benzersiz kelimeler</strong> çıkarılıyor — 2, 4 veya 6 dakikalık pencere seçenekleri (geniş pencere seçince küçük sahneler birleşip yeniden benzersizleştiriliyor, tekrar yok). Sitede toplam <strong>~107k sahne</strong> var. Profilinde <strong>'bildiklerim havuzu'</strong> tutuluyor: bildiğini işaretlediğin kelimeler tüm site genelinde müfredattan çıkıyor — gerekirse geri çıkarabilirsin. Veritabanında <strong>54k+ kelime</strong>, önemli kök kelimelerin etimoloji sayfaları var (kökler, türevler, anlamlar). Kelimeler ayrıca <strong>YDS</strong> ve <strong>temel 7000</strong> için etiketli, her birinin kendi çalışma sayfaları mevcut. Platform <strong>4 dil arası öğrenme</strong> için tasarlandı (TR/EN/DE/ES) — ana dilini seçip diğer üçünden birini öğreniyorsun. Django + PostgreSQL üstünde. Android uygulaması yolda.","p1.cta":"abctohero.com'u ziyaret et","p1.details":"Proje detayları",
    "tut.eyebrow":"Öğrenme Yolu","tut.t1":"DERS","tut.t2":"SERİSİ","tut.intro":"AI/ML öğrenme yolunda tuttuğum kişisel notlar — Python temellerinden transformer mimarilerine kadar. Kendim için tuttuğum, arada güncellediğim kayıtlar; başkasının da işine yararsa ne güzel. Şu an TR/EN dil desteği var.","tut.cta":"Tüm Derslere Göz At",
    "tut.um.ai":"Yapay Zeka / Makine Öğrenmesi","tut.um.ai.topics":"ML · Derin Öğrenme · NLP · Bilgisayarla Görü · Ses · Multimodal · Transformer · RNN · GNN · Pekiştirmeli Öğrenme · Üretken Yapay Zeka · Ajanlar · RAG · Embedding · Vektör DB · Zaman Serileri",
    "tut.um.math":"Matematik","tut.um.math.topics":"Lineer Cebir · Türev/İntegral · Olasılık · İstatistik · Ayrık Matematik · Diferansiyel Denklemler · Fourier Analizi · Kompleks Analiz",
    "tut.um.lang":"Programlama Dilleri","tut.um.lang.topics":"Python · C · C++ · JavaScript · SQL · LaTeX",
    "tut.um.tools":"Araçlar & Kütüphaneler","tut.um.tools.topics":"PyTorch · NumPy · Pandas · sklearn · Matplotlib · HuggingFace · LangChain · Git · GPU Programlama",
    "tut.um.sys":"Sistemler & DevOps","tut.um.sys.topics":"MLOps · Docker · Nginx · Linux VPS · Cloudflare · Edge Computing · IoT",
    "tut.um.sec":"Güvenlik & Etik","tut.um.sec.topics":"Ağ Güvenliği · ML Güvenliği · Kriptografi · Gizlilik Korumalı ML · Adalet · YZ Güvenliği · YZ Uyumluluğu · Dijital Adli Bilişim",
    "tut.um.ales":"ALES Sayısal Hazırlık","tut.um.ales.topics":"62 ders — Sayılar · Cebir · Geometri · Fonksiyonlar · Türev/İntegral · İstatistik · Sınav Taktikleri",
    "tut.cat.base":"Temel","tut.cat.math":"Matematik","tut.cat.ml":"Makine Öğrenmesi","tut.cat.nlp":"Doğal Dil İşleme","tut.cat.sys":"Sistem Programlama",
    "tut.lvl.beg":"Başlangıç","tut.lvl.int":"Orta","tut.lvl.adv":"İleri","tut.lessons":"6 Ders",
    "tut.d.python":"Değişkenler, döngüler, fonksiyonlar, OOP","tut.d.numpy":"Diziler, indeksleme, broadcasting","tut.d.pandas":"DataFrame, temizleme, gruplama","tut.d.math":"Vektörler, matrisler, özdeğer, olasılık","tut.d.calc":"Türev, gradyan, optimizasyon","tut.d.ml":"Regresyon, ağaçlar, değerlendirme","tut.d.dl":"Perseptron, CNN, PyTorch","tut.d.nlp":"Ön işleme, BoW, TF-IDF","tut.d.emb":"Word2Vec, GloVe, alt kelime","tut.d.rnn":"Diziler, kapılar, seq2seq","tut.d.tf":"Dikkat, BERT, GPT","tut.d.hf":"İnce ayar, dağıtım, LoRA","tut.d.c":"İşaretçiler, bellek, yapılar",
    "con.ghost":"KONUŞALIM","con.eyebrow":"İletişime Geç","con.t1":"HADI","con.t2":"KONUŞALIM","con.sub":"Araştırma iş birlikleri, akademik tartışmalar,<br>freelance projeler ve ilginç mühendislik zorluklarına açığım.","con.email":"E-posta Gönder","con.cv":"CV Görüntüle",
    "footer":"© 2026 Mikail Sarpkaya. Tüm hakları saklıdır."
  },
  de: {
    "nav.home":"Startseite","nav.about":"Über mich","nav.projects":"Projekte","nav.certificates":"Zertifikate","nav.tutorials":"Tutorials",
    "cp.eyebrow":"Nachweise","cp.t1":"ZERTIFIKATE &","cp.t2":"LERNEN","cp.desc":"Verifizierte Zertifikate von Coursera, IBM und SiliconMade Academy — ständig wachsendes Wissen in Technik und Programmierung.",
    "cf.all":"Alle","cf.eng":"Technik","cf.ai":"KI / Daten",
    "cert.sma.name":"Grundlegende Programmierausbildung","cert.sma2.name":"KI & Data Science Ausbildung","cert.portfolio":"In Bearbeitung","cert.credly.label":"Weitere Abzeichen auf","cert.credly.cta":"Mein Credly-Profil ansehen",
    "pp.eyebrow":"Arbeiten","pp.t1":"ALLE","pp.t2":"PROJEKTE","pp.desc":"Software-, Forschungs- und Ingenieurprojekte — von produktiven Webanwendungen bis zu akademischer KI-Forschung.",
    "f.all":"Alle","f.ai":"KI / ML","f.web":"Web","f.edu":"Bildung",
    "pa.abc.tag":"Hervorgehoben","pa.abc.t":"AbcToHero — Sprachlernplattform","pa.abc.d":"Eine Plattform, die ich gebaut habe, um Englisch beim Serienschauen zu lernen. Aus 60 Serien werden Wörter szenenweise extrahiert (2/4/6-Minuten-Fenster, neu dedupliziert bei breiterer Wahl). Dein Profil verwaltet einen 'Bekannte-Wörter-Pool', der markierte Wörter aus deinem Curriculum entfernt. ~107k Szenen, 54k+ Wörter, Etymologie-Seiten für die wichtigen Stammwörter. Separate Lernspuren für YDS-Prüfung und Top-7000-Grundwortschatz. Konzipiert für sprachübergreifendes Lernen in 4 Sprachen (TR/EN/DE/ES). Android-App unterwegs.",
    "pa.site.d":"Persönliche Portfolio- und Tutorial-Seite. Individuell mit Vanilla HTML/CSS/JS erstellt. Oberfläche in 4 Sprachen (TR/EN/DE/ES); Tutorials derzeit auf TR/EN. Auf Linux VPS mit Nginx und Cloudflare deployt.",
    "st.live":"Live","st.wip":"In Arbeit",
    "hero.eyebrow":"Elektro- & Elektronikingenieur — EEE M.Sc.",
    "hero.desc":"<strong>Ich bin ein KI- und NLP-Forscher</strong> — verbringe gerade viel Zeit mit Deep Learning und Transformer-Architekturen.<br><br>M.Sc. in EEE (NLP-Schwerpunkt) — Osmaniye Korkut Ata Universität<br><strong>TÜBİTAK 1001 Forschungsstipendiat</strong>",
    "hero.scroll":"Zum Erkunden scrollen",
    "about.quote":"\"Was ich nicht erschaffen kann, verstehe ich nicht.\"<span class=\"quote-author\">— Richard Feynman</span><br>\"KI ist die neue Elektrizität.\"<span class=\"quote-author\">— Andrew Ng</span>",
    "about.eyebrow":"Profil","about.t1":"ÜBER","about.t2":"MICH",
    "about.p1":"Meine akademische Reise begann an der Osmaniye Korkut Ata Universität mit <strong>Elektro- & Elektroniktechnik</strong>; jetzt setze ich meinen <strong>M.Sc.</strong> in derselben Abteilung fort, mit Schwerpunkt <strong>NLP</strong>. Im kommenden Jahr verbringe ich zwei Semester an der <em>URV in Tarragona</em> über <strong>Erasmus</strong> — ich werde dort meine M.Sc.-Arbeit weiterführen und gleichzeitig Kurse aus dem <strong>Computer Security Engineering und KI</strong> Programm belegen. Deshalb vertiefe ich mich seit Monaten in Mathematikgrundlagen und Cybersicherheit.",
    "about.p2":"Die Tutorials und Projekte hier — von Python-Grundlagen bis zu Transformer-Architekturen — sind Aufzeichnungen, die ich führe, um Gelerntes zu festigen. <strong>Ich komme oft darauf zurück</strong> — füge neu Gelerntes und aufkommende Technologien hinzu, damit mein Wissen frisch bleibt. Ich lerne durchs Erklären; KI hilft dabei.",
    "about.p3":"Ich bleibe nicht gern nur bei der Theorie — Bauen und Teilen ist der eigentliche Spaß. Ich betreibe ein paar Projekte auf einem <strong>Linux VPS</strong> mit Nginx & Cloudflare; das, was mir am meisten am Herzen liegt, ist <em>abctohero.com</em>, eine Plattform, die ich gebaut habe, um Englisch beim Serienschauen zu lernen. Aus 60 Serien habe ich <strong>130k+ Rohwörter</strong> aus den Untertiteln extrahiert und auf einen <strong>Pool von 54k+ Wörtern</strong> gefiltert — wichtige Stammwörter haben eigene Etymologie-Seiten.<br><br>Akademisch bin ich <strong>Forschungsstipendiat</strong> in einem <strong>TÜBİTAK 1001</strong> Projekt unter Leitung meines Betreuers <em>(Bereich: Maschinelles Lernen für Rehabilitationsgeräte)</em>.",
    "p1.label":"Hervorgehobenes Projekt","p1.pull":"\"Ich wollte Englisch so lernen, wie ich Serien tatsächlich schaue — also habe ich es gebaut: Szene für Szene, aus echten Episoden, mit Vokabular direkt vom Bildschirm.\"","p1.desc":"Aus 60 Serien werden <strong>Wörter Szene für Szene</strong> aus den Untertiteln extrahiert — 2, 4 oder 6 Minuten Fenster (bei größerem Fenster werden kleinere Szenen zusammengeführt und neu dedupliziert, keine Wiederholungen). Insgesamt <strong>~107k Szenen</strong>. In deinem Profil hältst du einen <strong>'Bekannte Wörter' Pool</strong>: Als bekannt markierte Wörter fallen aus deinem Curriculum auf der ganzen Seite — jederzeit zurücknehmbar. <strong>54k+ Wörter</strong> in der Datenbank, Etymologie-Seiten (Stämme, Ableitungen, Bedeutungen) für die wichtigen Stammwörter. Wörter sind außerdem für <strong>YDS-Prüfung</strong> und <strong>Top-7000-Grundwortschatz</strong> markiert — jeweils mit eigenen Lernseiten. Konzipiert für <strong>sprachübergreifendes Lernen in 4 Sprachen</strong> (TR/EN/DE/ES) — wähle deine Muttersprache und deine Zielsprache. Django + PostgreSQL. Android-App ist unterwegs.","p1.cta":"abctohero.com besuchen","p1.details":"Projektdetails",
    "tut.eyebrow":"Lernpfad","tut.t1":"TUTORIAL","tut.t2":"SERIE","tut.intro":"Persönliche Notizen, die ich auf dem AI/ML-Lernpfad führe — von Python-Grundlagen bis zu Transformer-Architekturen. Aufzeichnungen, die ich für mich schreibe und ab und zu überarbeite; falls sie auch jemand anderem helfen, umso besser. Derzeit auf TR/EN.","tut.cta":"Alle Tutorials durchsuchen",
    "tut.um.ai":"KI / Maschinelles Lernen","tut.um.ai.topics":"ML · Deep Learning · NLP · Bildverarbeitung · Audio · Multimodal · Transformer · RNN · GNN · Reinforcement Learning · Generative KI · Agenten · RAG · Embeddings · Vektor-DBs · Zeitreihen",
    "tut.um.math":"Mathematik","tut.um.math.topics":"Lineare Algebra · Analysis · Wahrscheinlichkeit · Statistik · Diskrete Mathematik · Differentialgleichungen · Fourier-Analyse · Komplexe Analysis",
    "tut.um.lang":"Programmiersprachen","tut.um.lang.topics":"Python · C · C++ · JavaScript · SQL · LaTeX",
    "tut.um.tools":"Tools & Bibliotheken","tut.um.tools.topics":"PyTorch · NumPy · Pandas · sklearn · Matplotlib · HuggingFace · LangChain · Git · GPU-Programmierung",
    "tut.um.sys":"Systeme & DevOps","tut.um.sys.topics":"MLOps · Docker · Nginx · Linux VPS · Cloudflare · Edge Computing · IoT",
    "tut.um.sec":"Sicherheit & Ethik","tut.um.sec.topics":"Netzwerksicherheit · ML-Sicherheit · Kryptographie · Datenschutzfreundliches ML · Fairness · KI-Sicherheit · KI-Compliance · Digitale Forensik",
    "tut.um.ales":"ALES Prüfungsvorbereitung","tut.um.ales.topics":"62 Lektionen — Zahlen · Algebra · Geometrie · Funktionen · Analysis · Statistik · Prüfungsstrategien",
    "tut.cat.base":"Grundlagen","tut.cat.math":"Mathematik","tut.cat.ml":"Maschinelles Lernen","tut.cat.nlp":"Sprachverarbeitung","tut.cat.sys":"Systemprogrammierung",
    "tut.lvl.beg":"Anfänger","tut.lvl.int":"Mittel","tut.lvl.adv":"Fortgeschritten","tut.lessons":"6 Lektionen",
    "tut.d.python":"Variablen, Schleifen, Funktionen, OOP","tut.d.numpy":"Arrays, Indexierung, Broadcasting","tut.d.pandas":"DataFrames, Bereinigung, Gruppierung","tut.d.math":"Vektoren, Matrizen, Eigenwerte, Wahrscheinlichkeit","tut.d.calc":"Ableitungen, Gradienten, Optimierung","tut.d.ml":"Regression, Bäume, Bewertung","tut.d.dl":"Perzeptrone, CNNs, PyTorch","tut.d.nlp":"Vorverarbeitung, BoW, TF-IDF","tut.d.emb":"Word2Vec, GloVe, Subwort","tut.d.rnn":"Sequenzen, Gates, Seq2Seq","tut.d.tf":"Attention, BERT, GPT","tut.d.hf":"Feinabstimmung, Bereitstellung, LoRA","tut.d.c":"Zeiger, Speicher, Strukturen",
    "con.ghost":"KONTAKT","con.eyebrow":"Kontakt aufnehmen","con.t1":"LASS","con.t2":"UNS REDEN","con.sub":"Offen für Forschungskooperationen, akademische Diskussionen,<br>Freelance-Projekte und interessante Ingenieur-Herausforderungen.","con.email":"E-Mail senden","con.cv":"CV ansehen",
    "footer":"© 2026 Mikail Sarpkaya. Alle Rechte vorbehalten."
  },
  es: {
    "nav.home":"Inicio","nav.about":"Sobre mí","nav.projects":"Proyectos","nav.certificates":"Certificados","nav.tutorials":"Tutoriales",
    "cp.eyebrow":"Credenciales","cp.t1":"CERTIFICADOS &","cp.t2":"APRENDIZAJE","cp.desc":"Certificados verificados de Coursera, IBM y SiliconMade Academy — conocimiento en constante expansión en ingeniería y programación.",
    "cf.all":"Todos","cf.eng":"Ingeniería","cf.ai":"IA / Datos",
    "cert.sma.name":"Educación Básica en Programación","cert.sma2.name":"Educación en IA y Ciencia de Datos","cert.portfolio":"En Curso","cert.credly.label":"Más insignias en","cert.credly.cta":"Ver mi perfil de Credly",
    "pp.eyebrow":"Trabajos","pp.t1":"TODOS LOS","pp.t2":"PROYECTOS","pp.desc":"Proyectos de software, investigación e ingeniería — desde aplicaciones web en producción hasta investigación académica en IA.",
    "f.all":"Todos","f.ai":"IA / ML","f.web":"Web","f.edu":"Educación",
    "pa.abc.tag":"Destacado","pa.abc.t":"AbcToHero — Plataforma de Aprendizaje de Idiomas","pa.abc.d":"Una plataforma que construí para aprender inglés viendo series. De 60 series, palabras únicas extraídas escena por escena (ventanas de 2/4/6 minutos, re-deduplicadas al ampliarse). Tu perfil mantiene un 'pool de palabras conocidas' que retira del currículum las palabras marcadas. ~107k escenas, 54k+ palabras, páginas de etimología para palabras raíz importantes. Pistas de estudio separadas para examen YDS y Top 7000 básicos. Diseñada para aprendizaje cruzado entre 4 idiomas (TR/EN/DE/ES). App Android en camino.",
    "pa.site.d":"Sitio personal de portafolio y tutoriales. Construido con HTML/CSS/JS vanilla. Interfaz en 4 idiomas (TR/EN/DE/ES); tutoriales actualmente en TR/EN. Desplegado en Linux VPS con Nginx y Cloudflare.",
    "st.live":"En Vivo","st.wip":"En Progreso",
    "hero.eyebrow":"Ingeniero Eléctrico & Electrónico — EEE M.Sc.",
    "hero.desc":"<strong>Soy un investigador en IA & NLP</strong> — pasando bastante tiempo con deep learning y arquitecturas transformer.<br><br>M.Sc. en EEE (enfoque NLP) — Universidad Osmaniye Korkut Ata<br><strong>Becario de Investigación TÜBİTAK 1001</strong>",
    "hero.scroll":"Desplázate para explorar",
    "about.quote":"\"Lo que no puedo crear, no lo entiendo.\"<span class=\"quote-author\">— Richard Feynman</span><br>\"La IA es la nueva electricidad.\"<span class=\"quote-author\">— Andrew Ng</span>",
    "about.eyebrow":"Perfil","about.t1":"SOBRE","about.t2":"MÍ",
    "about.p1":"Mi camino académico empezó en la Universidad Osmaniye Korkut Ata con <strong>Ingeniería Eléctrica & Electrónica</strong>; ahora continúo con mi <strong>M.Sc.</strong> en el mismo departamento, enfocado en <strong>NLP</strong>. El próximo año voy a pasar dos semestres en <em>Tarragona / URV</em> con <strong>Erasmus</strong> — trabajaré allí en mi tesis de M.Sc. mientras tomo cursos del programa de <strong>Ingeniería en Seguridad Informática e IA</strong>. Por eso últimamente le dedico más tiempo a los fundamentos matemáticos y a la ciberseguridad.",
    "about.p2":"Los tutoriales y proyectos aquí — desde lo básico de Python hasta las arquitecturas transformer — son registros que llevo para consolidar lo que estoy aprendiendo. <strong>Vuelvo a ellos con frecuencia</strong> — añadiendo lo que voy aprendiendo y las tecnologías emergentes, para que mis conocimientos se mantengan frescos. Aprendo explicando; la IA me ayuda en el camino.",
    "about.p3":"No me conforma quedarme solo en la teoría — construir y compartir es la verdadera diversión. Ejecuto algunas cosas en un <strong>Linux VPS</strong> con Nginx & Cloudflare; lo que más me importa es <em>abctohero.com</em>, una plataforma que construí para aprender inglés viendo series. De 60 series extraje <strong>130k+ palabras brutas</strong> de los subtítulos y las filtré hasta llegar a un <strong>conjunto de 54k+ palabras</strong> — las palabras raíz importantes tienen sus propias páginas de etimología.<br><br>En el lado académico, soy <strong>becario de investigación</strong> en un proyecto <strong>TÜBİTAK 1001</strong> dirigido por mi asesor <em>(área: aprendizaje automático para dispositivos de rehabilitación)</em>.",
    "p1.label":"Proyecto Destacado","p1.pull":"\"Quería aprender inglés como realmente veo series — así que lo construí: escena por escena, de episodios reales, con el vocabulario que viene directo de la pantalla.\"","p1.desc":"De 60 series se extraen <strong>palabras únicas escena por escena</strong> desde los subtítulos — ventanas de 2, 4 o 6 minutos (al elegir una ventana mayor, las escenas pequeñas se fusionan y se vuelven a deduplicar, sin repeticiones). Unas <strong>~107k escenas</strong> en total. En tu perfil mantienes un <strong>'pool de palabras conocidas'</strong>: las palabras marcadas como conocidas salen de tu currículum en todo el sitio — puedes volver a sacarlas cuando quieras. <strong>54k+ palabras</strong> en la base de datos, con páginas de etimología (raíces, derivaciones, significados) para las palabras raíz importantes. Las palabras también están etiquetadas para <strong>examen YDS</strong> y el <strong>vocabulario básico Top 7000</strong> — cada uno con sus propias páginas de estudio. Diseñada para <strong>aprendizaje cruzado entre 4 idiomas</strong> (TR/EN/DE/ES) — elige tu idioma nativo y el que quieres aprender. Django + PostgreSQL. App de Android en camino.","p1.cta":"Visitar abctohero.com","p1.details":"Detalles del proyecto",
    "tut.eyebrow":"Ruta de Aprendizaje","tut.t1":"SERIE DE","tut.t2":"TUTORIALES","tut.intro":"Notas personales que llevo en el camino de aprendizaje AI/ML — desde lo básico de Python hasta las arquitecturas transformer. Registros que escribo para mí y reviso de vez en cuando; si también ayudan a alguien más, mejor. Actualmente en TR/EN.","tut.cta":"Ver Todos los Tutoriales",
    "tut.um.ai":"IA / Aprendizaje Automático","tut.um.ai.topics":"ML · Deep Learning · NLP · Visión por Computador · Audio · Multimodal · Transformers · RNN · GNN · Aprendizaje por Refuerzo · IA Generativa · Agentes · RAG · Embeddings · Vector DBs · Series Temporales",
    "tut.um.math":"Matemáticas","tut.um.math.topics":"Álgebra Lineal · Cálculo · Probabilidad · Estadística · Matemática Discreta · Ecuaciones Diferenciales · Análisis de Fourier · Análisis Complejo",
    "tut.um.lang":"Lenguajes de Programación","tut.um.lang.topics":"Python · C · C++ · JavaScript · SQL · LaTeX",
    "tut.um.tools":"Herramientas & Bibliotecas","tut.um.tools.topics":"PyTorch · NumPy · Pandas · sklearn · Matplotlib · HuggingFace · LangChain · Git · Programación GPU",
    "tut.um.sys":"Sistemas & DevOps","tut.um.sys.topics":"MLOps · Docker · Nginx · Linux VPS · Cloudflare · Edge Computing · IoT",
    "tut.um.sec":"Seguridad & Ética","tut.um.sec.topics":"Seguridad de Red · Seguridad ML · Criptografía · ML Preservando Privacidad · Equidad · Seguridad IA · Cumplimiento IA · Forense Digital",
    "tut.um.ales":"Preparación Examen ALES","tut.um.ales.topics":"62 lecciones — Números · Álgebra · Geometría · Funciones · Cálculo · Estadística · Estrategias de Examen",
    "tut.cat.base":"Fundamentos","tut.cat.math":"Matemáticas","tut.cat.ml":"Aprendizaje Automático","tut.cat.nlp":"Procesamiento de Lenguaje","tut.cat.sys":"Programación de Sistemas",
    "tut.lvl.beg":"Principiante","tut.lvl.int":"Intermedio","tut.lvl.adv":"Avanzado","tut.lessons":"6 Lecciones",
    "tut.d.python":"Variables, bucles, funciones, POO","tut.d.numpy":"Arrays, indexación, broadcasting","tut.d.pandas":"DataFrames, limpieza, agrupación","tut.d.math":"Vectores, matrices, eigenvalores, probabilidad","tut.d.calc":"Derivadas, gradientes, optimización","tut.d.ml":"Regresión, árboles, evaluación","tut.d.dl":"Perceptrones, CNNs, PyTorch","tut.d.nlp":"Preprocesamiento, BoW, TF-IDF","tut.d.emb":"Word2Vec, GloVe, subpalabra","tut.d.rnn":"Secuencias, puertas, seq2seq","tut.d.tf":"Atención, BERT, GPT","tut.d.hf":"Ajuste fino, despliegue, LoRA","tut.d.c":"Punteros, memoria, estructuras",
    "con.ghost":"CONTACTO","con.eyebrow":"Contacto","con.t1":"","con.t2":"HABLEMOS","con.sub":"Abierto a colaboraciones de investigación, discusiones académicas,<br>proyectos freelance y desafíos de ingeniería interesantes.","con.email":"Enviar Email","con.cv":"Ver CV",
    "footer":"© 2026 Mikail Sarpkaya. Todos los derechos reservados."
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const t = translations[lang];
  if (!t) return;

  // data-i18n → innerHTML (paragraphs with <strong>, <em>, <br>)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });

  // data-i18n-text → textContent (simple text)
  document.querySelectorAll('[data-i18n-text]').forEach(el => {
    const k = el.getAttribute('data-i18n-text');
    if (t[k] !== undefined) el.textContent = t[k];
  });

  // Update active lang button + expose pressed state to assistive tech
  document.querySelectorAll('.lang-btn').forEach(b => {
    const on = b.textContent === lang.toUpperCase();
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  document.documentElement.lang = lang;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));
