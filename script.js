/* =====================================================
   MikailSarpkaya Portfolio - Core Script
   - Theme (dark/light)
   - i18n (tr/en)
   - Footer year
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     Footer yılı otomatik güncelle
     ------------------------------ */
  const yearSpan = document.getElementById("y");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* =====================================================
     TEMA SİSTEMİ (KOYU / AÇIK)
     ===================================================== */
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggle");

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");

    localStorage.setItem("theme", theme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const isLight = root.getAttribute("data-theme") === "light";
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  }

  // İlk açılış: kayıtlı temayı uygula
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // Buton tıklaması
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  }


function buildNavPages() {
  const holder = document.getElementById("navPages");
  if (!holder) return;

  const page = (document.body && document.body.dataset && document.body.dataset.page) || "home";

  // Link tanımları
  const items = {
    home:        { href: "index.html",          key: "nav.home",        fallback: "Ana Sayfa" },
    projects:    { href: "projects.html",       key: "nav.projects",    fallback: "Projeler" },
    certificates:{ href: "certificates.html",   key: "nav.certificates",fallback: "Sertifikalarım" },
    about:       { href: "index.html#about",    key: "nav.about",       fallback: "Hakkımda" },
    contact:     { href: "index.html#contact",  key: "nav.contact",     fallback: "İletişim" }
  };

  // Sıralama kuralları (senin istediğine göre)
  // Home: Projeler + Sertifikalar (istersen About/Contact ekli bırakıyorum)
  // Projects/Certificates: önce Ana Sayfa, sonra Hakkımda, sonra diğerleri
  let order = [];
  if (page === "home") {
    order = ["projects", "certificates", "about", "contact"];
  } else if (page === "projects") {
    order = ["home", "about", "contact", "certificates"];
  } else if (page === "certificates") {
    order = ["home", "about", "contact", "projects"];
  }

  // Bulunduğun sayfayı sağdaki menüden kaldır
  const currentKey =
    page === "home" ? "home" :
    page === "projects" ? "projects" :
    page === "certificates" ? "certificates" : null;

  holder.innerHTML = "";
  order
    .filter(k => k !== currentKey)
    .forEach(k => {
      const a = document.createElement("a");
      a.href = items[k].href;
      a.textContent = items[k].fallback;
      a.setAttribute("data-i18n", items[k].key); // i18n varsa otomatik çevirsin
      holder.appendChild(a);
    });
}
buildNavPages();
   
  /* =====================================================
     DİL SİSTEMİ (TR / EN)
     ===================================================== */

  const translations = {
    tr: {
      "nav.projects": "Projeler",
      "nav.about": "Hakkımda",
      "nav.contact": "İletişim",
      "nav.certificates": "Sertifikalarım",

      "lang.aria": "Dili değiştir",
      "theme.aria": "Tema değiştir",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Elektrik-Elektronik Mühendisi · Veri Bilimi · Otomasyon · Web",
      "hero.cta.projects": "Projelerimi Gör",
      "hero.cta.github": "GitHub",

      "projects.title": "Projeler",
      "projects.wordapp.title": "Kelime Öğrenme Platformu",
      "projects.wordapp.desc": "Kişiselleştirilmiş kelime çalışma mantığı (liste seviyeleri, tekrar sistemi).",
      "projects.scraping.title": "Web Scraping & Veri Analizi",
      "projects.scraping.desc": "IMDb benzeri kaynaklardan veri çekme, temizleme ve analiz akışları.",
      "projects.portfolio.title": "Portföy Sitesi",
      "projects.portfolio.desc": "Netlify + Cloudflare ile CDN/SSL, otomatik deploy (CI gibi).",
      "projects.note": "Not: Proje linklerini birazdan tek tek ekleyeceğiz.",

      "about.title": "Hakkımda",
      "about.text": "Elektrik-Elektronik Mühendisiyim. Yazılım, veri bilimi ve yapay zeka alanlarında projeler geliştiriyorum. Özellikle Python tabanlı otomasyon, veri işleme ve web sistemleriyle ilgileniyorum.",

      "contact.title": "İletişim",
      "contact.mail.label": "Mail:",
      "contact.github.label": "GitHub:",
      "contact.domain.label": "Domain:",

      "footer.credly": "🎓 Credly",
      "footer.name": "Mikail Sarpkaya",

      "cert.pageTitle": "Sertifikalarım · Mikail Sarpkaya",
      "cert.title": "Sertifikalarım",
      "cert.subtitle": "Doğrulanabilir rozetler ve sertifika bağlantıları.",
      "cert.cta.home": "Ana Sayfa",
      "cert.cta.credly": "Credly Profilim",

      "cert.section.credly": "Credly Rozetler",
      "cert.section.credly.desc": "Rozetlerimi Credly üzerinden görebilir ve doğrulayabilirsin.",
      "cert.card.credly.title": "Credly Badges",
      "cert.card.credly.desc": "Rozet koleksiyonum (doğrulama bağlantısı).",
      "cert.card.view": "Görüntüle",

      "cert.card.coursera.title": "Coursera",
      "cert.card.coursera.desc": "Coursera sertifikalarım (profil / doğrulama).",
      "cert.card.coursera.linkText": "Coursera Profil Linki (burayı değiştir)",

      "cert.card.other.title": "Diğer",
      "cert.card.other.desc": "İstersen buraya IBM, Google, Microsoft vb. ekleyebiliriz."
      "projects.pageTitle": "Projeler · Mikail Sarpkaya",
      "projects.pageTitleH1": "Projeler",
      "projects.pageSubtitle": "Öne çıkanlar + geliştirmekte olduklarım.",
      "projects.backHome": "Ana Sayfa",
      "projects.featured": "Öne Çıkan",
      "projects.viewAll": "Tüm projeler",
      "projects.status.dev": "Geliştirme Aşamasında",
      "projects.status.planned": "Planlanıyor",
      "projects.abctohero.desc": "İngilizce kelimeleri zamanlar, modallar ve kalıplarla çalıştıran web uygulaması (Django + VPS).",
      "projects.abctohero.long": "İngilizce kelimeleri; zamanlar, modallar ve kalıplar altında örnek cümlelerle çalıştıran web uygulaması. Django + Gunicorn + Nginx + Cloudflare altyapısıyla VPS üzerinde çalışıyor.",
      "projects.abctohero.note": "Not: Şu an sadece admin panel açık, kullanıcı arayüzü geliştirme aşamasında."
    },

    en: {
      "nav.projects": "Projects",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.certificates": "Certificates",

      "lang.aria": "Switch language",
      "theme.aria": "Toggle theme",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Electrical & Electronics Engineer · Data Science · Automation · Web",
      "hero.cta.projects": "View Projects",
      "hero.cta.github": "GitHub",

      "projects.title": "Projects",
      "projects.wordapp.title": "Vocabulary Learning Platform",
      "projects.wordapp.desc": "Personalized vocabulary study (levels, spaced repetition logic).",
      "projects.scraping.title": "Web Scraping & Data Analysis",
      "projects.scraping.desc": "Data collection, cleaning and analysis pipelines from sources like IMDb.",
      "projects.portfolio.title": "Portfolio Website",
      "projects.portfolio.desc": "Netlify + Cloudflare CDN/SSL, automated deploy (CI-like).",
      "projects.note": "Note: We will add project links one by one.",

      "about.title": "About",
      "about.text": "I’m an Electrical & Electronics Engineer building projects in software, data science, and AI. I’m especially interested in Python-based automation, data processing, and web systems.",

      "contact.title": "Contact",
      "contact.mail.label": "Email:",
      "contact.github.label": "GitHub:",
      "contact.domain.label": "Website:",

      "footer.credly": "🎓 Credly",
      "footer.name": "Mikail Sarpkaya",

      "cert.pageTitle": "Certificates · Mikail Sarpkaya",
      "cert.title": "Certificates",
      "cert.subtitle": "Verifiable badges and certificate links.",
      "cert.cta.home": "Home",
      "cert.cta.credly": "My Credly Profile",

      "cert.section.credly": "Credly Badges",
      "cert.section.credly.desc": "You can view and verify my badges on Credly.",
      "cert.card.credly.title": "Credly Badges",
      "cert.card.credly.desc": "My badge collection (verification link).",
      "cert.card.view": "Open",

      "cert.card.coursera.title": "Coursera",
      "cert.card.coursera.desc": "My Coursera certificates (profile / verification).",
      "cert.card.coursera.linkText": "Coursera Profile Link (replace this)",

      "cert.card.other.title": "Other",
      "cert.card.other.desc": "We can add IBM, Google, Microsoft, etc."
      "projects.pageTitle": "Projects · Mikail Sarpkaya",
      "projects.pageTitleH1": "Projects",
      "projects.pageSubtitle": "Featured + in-progress work.",
      "projects.backHome": "Home",
      "projects.featured": "Featured",
      "projects.viewAll": "All projects",
      "projects.status.dev": "In Development",
      "projects.status.planned": "Planned",
      "projects.abctohero.desc": "An English-learning web app that groups vocabulary by tenses, modals and phrases (Django + VPS).",
      "projects.abctohero.long": "A vocabulary learning web app that groups examples under tenses, modals and phrases. Runs on a VPS with Django + Gunicorn + Nginx + Cloudflare.",
      "projects.abctohero.note": "Note: Currently only the admin panel is open; the user interface is under development."

    }
  };

  const langToggleBtn = document.getElementById("langToggle");
  let currentLang = localStorage.getItem("lang") || "tr";

  function applyTranslations(lang) {
    // 1) textContent çevirisi
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr"); // varsa attribute çevirisi

      const value = translations?.[lang]?.[key];
      if (!value) return;

      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });

    // 2) Lang butonu üstündeki yazı (TR iken EN yazsın)
    if (langToggleBtn) {
      langToggleBtn.textContent = lang === "tr" ? "EN" : "TR";
    }

    // 3) html lang attribute
    document.documentElement.setAttribute("lang", lang);

    currentLang = lang;
    localStorage.setItem("lang", lang);
  }

  // İlk açılış uygula
  applyTranslations(currentLang);

  // Buton tıklaması
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      applyTranslations(currentLang === "tr" ? "en" : "tr");
    });
  }
});
