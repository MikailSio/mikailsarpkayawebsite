/* ════════════════════════════════════════
   mikailsarpkaya.com — Ortak JavaScript
   ════════════════════════════════════════ */

// ── I18N VERİLERİ ──
const i18n = {
  tr: {
    "nav.home":"Ana Sayfa","nav.about":"Hakkımda","nav.projects":"Projeler",
    "nav.certificates":"Sertifikalar","nav.contact":"İletişim",

    "hero.tag":"⚡ Elektronik Mühendisi",
    "hero.greeting":"Merhaba, ben",
    "hero.sub":"alanlarında araştırma yapıyor, projeler geliştiriyorum.",
    "hero.cta1":"Projelerime Bak →","hero.cta2":"İletişime Geç",
    "about.label":"// Hakkımda","about.title":"Yapay Zeka & Mühendislik",
    "about.p1":"Elektrik & Elektronik Mühendisliği lisans eğitimimin ardından, aynı alanda yüksek lisansıma devam etmekteyim. Yapay Zeka ve Makine Öğrenmesi üzerine uzmanlaşmayı hedefliyorum.",
    "about.p2":"Büyük Dil Modelleri (LLM), Derin Öğrenme mimarileri ve veri işleme pipeline'ları üzerine aktif olarak çalışıyorum.",
    "about.p3":"Sürekli öğrenme anlayışıyla Coursera, IBM ve Google gibi platformlardan sertifikalar alarak bilgimi güncel tutuyorum.",
    "skill.ai":"Yapay Zeka (AI)","skill.ml":"Makine Öğrenmesi","skill.dl":"Derin Öğrenme",
    "skill.data":"Veri İşleme",    "skill.ee":"Elektrik & Elektronik Müh.",
    "skill.msc":"Yüksek Lisans (Devam)","skill.web":"Web Geliştirme",
    "about.video.label":"// Tanıtım Videosu","about.video.soon":"Yakında eklenecek…","projects.title":"Öne Çıkan Çalışmalar",
    "proj.abc.title":"AbcToHero – İngilizce Öğrenme",
    "proj.abc.desc":"Sıfırdan İngilizce öğrenmek isteyenler için geliştirilen interaktif web platformu.",
    "proj1.title":"LLM Araştırma Projesi",
    "proj1.desc":"Büyük Dil Modelleri üzerine yapılan araştırma ve fine-tuning deneyleri.",
    "proj3.title":"Kişisel Web Sitesi",
    "proj3.desc":"Profesyonel profil, sertifikalar ve projeler için merkezi platform. Hetzner VPS üzerinde.",
    "cert.label":"// Sertifikalar","cert.title":"Eğitim & Sertifikalar",
    "cert.credly":"Credly Profilim","cert.verify":"✓ Sertifikayı Doğrula",
    "cert.swe.name":"Introduction to Software Engineering","cert.swe.issuer":"Coursera / IBM",
    "cert.sm1.name":"Temel Programlama Eğitimi","cert.sm1.issuer":"SiliconMade Academy",
    "cert.sm2.name":"Yapay Zeka ve Veri Bilimi Eğitimi","cert.sm2.issuer":"SiliconMade Academy",
    "contact.label":"// İletişim","contact.title":"Birlikte Çalışalım",
    "contact.desc":"Proje fikirleri, iş birlikleri veya araştırma konularında benimle iletişime geçebilirsin.",
    "contact.email":"✉️ E-posta Gönder","contact.cv":"CV İndir",
    "page.projects.tag":"Projeler","page.projects.title":"Tüm <span>Projeler</span>",
    "page.projects.desc":"Üzerinde çalıştığım projeler ve araştırmalar.",
    "page.cert.tag":"Sertifikalar","page.cert.title":"Eğitim & <span>Sertifikalar</span>",
    "page.cert.desc":"Tamamladığım kurslar ve aldığım sertifikalar.",
    "typed":["Yapay Zeka","Makine Öğrenmesi","Derin Öğrenme","LLM","Veri Bilimi"]
  },
  en: {
    "nav.home":"Home","nav.about":"About","nav.projects":"Projects",
    "nav.certificates":"Certificates","nav.contact":"Contact",
    "hero.tag":"⚡ Electronics Engineer",
    "hero.greeting":"Hi, I'm",
    "hero.sub":"I research and build projects in",
    "hero.cta1":"View Projects →","hero.cta2":"Get in Touch",
    "about.label":"// About Me","about.title":"AI & Engineering",
    "about.p1":"I completed my undergraduate degree in Electrical & Electronics Engineering and am currently pursuing my Master's degree in the same field, specializing in Artificial Intelligence and Machine Learning.",
    "about.p2":"I actively work on Large Language Models (LLMs), Deep Learning architectures, and data processing pipelines.",
    "about.p3":"I keep my knowledge current by earning certificates from platforms like Coursera, IBM, and Google.",
    "skill.ai":"Artificial Intelligence","skill.ml":"Machine Learning","skill.dl":"Deep Learning",
    "skill.data":"Data Processing",    "skill.ee":"Electrical & Electronics Eng.",
    "skill.msc":"MSc (In Progress)","skill.web":"Web Development",
    "about.video.label":"// Introduction Video","about.video.soon":"Coming soon…","projects.title":"Featured Work",
    "proj.abc.title":"AbcToHero – English Learning",
    "proj.abc.desc":"An interactive web platform for learning English from scratch.",
    "proj1.title":"LLM Research Project",
    "proj1.desc":"Research and fine-tuning experiments on Large Language Models.",
    "proj3.title":"Personal Website",
    "proj3.desc":"Central platform for professional profile, certificates and projects. Hosted on Hetzner VPS.",
    "cert.label":"// Certificates","cert.title":"Education & Certificates",
    "cert.credly":"My Credly Profile","cert.verify":"✓ Verify Certificate",
    "cert.swe.name":"Introduction to Software Engineering","cert.swe.issuer":"Coursera / IBM",
    "cert.sm1.name":"Introduction to Programming","cert.sm1.issuer":"SiliconMade Academy",
    "cert.sm2.name":"AI & Data Science Training","cert.sm2.issuer":"SiliconMade Academy",
    "contact.label":"// Contact","contact.title":"Let's Work Together",
    "contact.desc":"Feel free to reach out for project ideas, collaborations, or research topics.",
    "contact.email":"✉️ Send Email","contact.cv":"Download CV",
    "page.projects.tag":"Projects","page.projects.title":"All <span>Projects</span>",
    "page.projects.desc":"Projects and research I'm working on.",
    "page.cert.tag":"Certificates","page.cert.title":"Education & <span>Certificates</span>",
    "page.cert.desc":"Courses I've completed and certificates I've earned.",
    "typed":["Artificial Intelligence","Machine Learning","Deep Learning","LLMs","Data Science"]
  },
  de: {
    "nav.home":"Startseite","nav.about":"Über mich","nav.projects":"Projekte",
    "nav.certificates":"Zertifikate","nav.contact":"Kontakt",
    "hero.tag":"⚡ Elektronikingenieur",
    "hero.greeting":"Hallo, ich bin",
    "hero.sub":"Ich forsche und entwickle Projekte im Bereich",
    "hero.cta1":"Projekte ansehen →","hero.cta2":"Kontakt aufnehmen",
    "about.label":"// Über mich","about.title":"KI & Ingenieurwesen",
    "about.p1":"Ich habe meinen Bachelor in Elektro- und Elektroniktechnik abgeschlossen und absolviere derzeit meinen Master im selben Fachbereich mit Schwerpunkt auf Künstlicher Intelligenz und maschinellem Lernen.",
    "about.p2":"Ich arbeite aktiv an Large Language Models (LLMs), Deep-Learning-Architekturen und Datenverarbeitungs-Pipelines.",
    "about.p3":"Ich halte mein Wissen aktuell durch Zertifikate von Plattformen wie Coursera, IBM und Google.",
    "skill.ai":"Künstliche Intelligenz","skill.ml":"Maschinelles Lernen","skill.dl":"Deep Learning",
    "skill.data":"Datenverarbeitung",    "skill.ee":"Elektro- & Elektroniktechnik",
    "skill.msc":"Master (Laufend)","skill.web":"Webentwicklung",
    "about.video.label":"// Vorstellungsvideo","about.video.soon":"Demnächst verfügbar…","projects.title":"Ausgewählte Arbeiten",
    "proj.abc.title":"AbcToHero – Englisch lernen",
    "proj.abc.desc":"Interaktive Webplattform zum Englischlernen von Grund auf.",
    "proj1.title":"LLM-Forschungsprojekt",
    "proj1.desc":"Forschung und Fine-Tuning-Experimente zu Large Language Models.",
    "proj3.title":"Persönliche Website",
    "proj3.desc":"Zentrale Plattform für Profil, Zertifikate und Projekte. Auf Hetzner VPS gehostet.",
    "cert.label":"// Zertifikate","cert.title":"Ausbildung & Zertifikate",
    "cert.credly":"Mein Credly-Profil","cert.verify":"✓ Zertifikat verifizieren",
    "cert.swe.name":"Einführung in Software Engineering","cert.swe.issuer":"Coursera / IBM",
    "cert.sm1.name":"Grundlagen der Programmierung","cert.sm1.issuer":"SiliconMade Academy",
    "cert.sm2.name":"KI & Datenwissenschaft","cert.sm2.issuer":"SiliconMade Academy",
    "contact.label":"// Kontakt","contact.title":"Lass uns zusammenarbeiten",
    "contact.desc":"Schreib mir für Projektideen, Kooperationen oder Forschungsthemen.",
    "contact.email":"✉️ E-Mail senden","contact.cv":"CV herunterladen",
    "page.projects.tag":"Projekte","page.projects.title":"Alle <span>Projekte</span>",
    "page.projects.desc":"Projekte und Forschung, an denen ich arbeite.",
    "page.cert.tag":"Zertifikate","page.cert.title":"Ausbildung & <span>Zertifikate</span>",
    "page.cert.desc":"Abgeschlossene Kurse und erworbene Zertifikate.",
    "typed":["Künstliche Intelligenz","Maschinelles Lernen","Deep Learning","LLMs","Datenwissenschaft"]
  }
};

// ── DİL YÖNETİMİ ──
let currentLang = localStorage.getItem('lang') || 'tr';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const t = i18n[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) {
      // innerHTML yerine textContent — ama page-title için innerHTML gerekli
      if (el.classList.contains('page-hero-title')) {
        el.innerHTML = t[k];
      } else {
        el.textContent = t[k];
      }
    }
  });
  document.querySelectorAll('[data-i18n-mob]').forEach(el => {
    const k = el.getAttribute('data-i18n-mob');
    if (t[k]) el.textContent = t[k];
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent === lang.toUpperCase());
  });
  document.documentElement.lang = lang;

  // Sertifika doğrulama linkleri
  document.querySelectorAll('.cert-verify').forEach(el => {
    if (t['cert.verify']) el.textContent = t['cert.verify'];
  });

  // Typed efektini resetle
  if (typeof resetTyped === 'function') resetTyped(t.typed);
}

// ── TEMA YÖNETİMİ ──
let isDark = localStorage.getItem('theme') !== 'light';

function toggleTheme() {
  isDark = !isDark;
  applyTheme();
}
function applyTheme() {
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ── HAMBURGERi MENU ── 
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
document.addEventListener('click', e => {
  const m = document.getElementById('mobileMenu');
  const h = document.getElementById('hamburger');
  if (m && h && !m.contains(e.target) && !h.contains(e.target)) {
    m.classList.remove('open');
    h.classList.remove('open');
  }
});

// ── SERTİFİKA GÖRSELLERİ ──
function initCertImages() {
  document.querySelectorAll('.cert-card').forEach(card => {
    const imgSrc = card.getAttribute('data-img');
    const verifySrc = card.getAttribute('data-verify');
    const wrap = card.querySelector('.cert-img-wrap');
    const verifyLink = card.querySelector('.cert-verify');
    if (imgSrc && wrap) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = 'certificate';
      img.onload = () => img.classList.add('loaded');
      wrap.prepend(img);
    }
    if (verifySrc && verifySrc !== '#' && verifyLink) {
      verifyLink.href = verifySrc;
      verifyLink.target = '_blank';
    }
  });
}

// ── TYPED EFEKTİ (sadece index.html) ──
let typedWords = [], wi = 0, ci = 0, del = false, typedTimer;

function startTyped(words) {
  typedWords = words;
  const el = document.getElementById('typed');
  if (!el) return;
  function type() {
    const w = typedWords[wi];
    el.textContent = del ? w.substring(0, ci--) : w.substring(0, ci++);
    if (!del && ci > w.length) { del = true; typedTimer = setTimeout(type, 3000); return; }
    if (del && ci < 0) { del = false; wi = (wi + 1) % typedWords.length; }
    typedTimer = setTimeout(type, del ? 100 : 160);
  }
  type();
}

function resetTyped(words) {
  clearTimeout(typedTimer);
  wi = 0; ci = 0; del = false;
  const el = document.getElementById('typed');
  if (el) el.textContent = '';
  startTyped(words);
}

// ── PARTİKÜL CANVAS ──
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const isMobile = window.innerWidth < 768;
  const PC = isMobile ? 50 : 120;
  const LD = isMobile ? 90 : 120;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.r2(); }
    r2() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + .3;
      this.vx = (Math.random() - .5) * .25; this.vy = (Math.random() - .5) * .25;
      this.a = Math.random() * .45 + .1;
      this.c = Math.random() > .5 ? '124,77,255' : '0,229,255';
    }
    upd() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.r2(); }
    drw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.c},${this.a})`; ctx.fill(); }
  }
  for (let i = 0; i < PC; i++) particles.push(new P());

  let last = 0;
  function animate(ts) {
    if (ts - last < (isMobile ? 40 : 16)) { requestAnimationFrame(animate); return; }
    last = ts;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].upd(); particles[i].drw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LD) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,77,255,${.12 * (1 - d / LD)})`;
          ctx.lineWidth = .4; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ── SCROLL REVEAL ──
function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: .12 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── AKTİF NAV LİNKİ ──
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href.includes(page) && page !== 'index.html');
  });
}

// ── BAŞLATMA ──
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  setLang(currentLang);
  initCanvas();
  initReveal();
  initCertImages();
  setActiveNav();
  if (document.getElementById('typed')) {
    startTyped(i18n[currentLang].typed);
  }
});
