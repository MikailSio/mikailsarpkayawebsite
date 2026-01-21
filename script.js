(function () {
  const THEME_KEY = "ms_theme";
  const LANG_KEY = "ms_lang";

  const translations = {
    tr: {
      "nav.home": "Ana Sayfa",
      "nav.projects": "Projeler",
      "nav.certificates": "Sertifikalarım",
      "nav.about": "Hakkımda",
      "nav.contact": "İletişim",
      "hero.title": "AI & Software-Oriented Engineer",
      "hero.sub": "Elektrik-Elektronik Mühendisi · Veri Bilimi · Otomasyon · Web",
      "hero.btnProjects": "Projelerimi Gör",
      "hero.btnCertificates": "Sertifikalarımı Gör",
      "about.title": "Hakkımda",
      "about.p1": "Elektrik-Elektronik Mühendisiyim. Yazılım, veri bilimi ve yapay zeka alanlarında ürün odaklı projeler geliştiriyorum.",
      "about.p2": "Odak alanlarım: Python ile otomasyon ve veri işleme, web uygulamaları, temel DevOps (VPS/Nginx/Cloudflare) ve analitik problem çözme.",
      "about.focusTitle": "Odak",
      "about.focus1": "Otomasyon & backend geliştirme",
      "about.focus2": "Veri temizleme / analiz akışları",
      "about.focus3": "Ürünleştirme: deploy, izleme, iyileştirme",
      "about.stackTitle": "Stack",
      "contact.title": "İletişim",
      "contact.p1": "İş, freelance veya iş birliği için ulaşabilirsin.",
      "contact.mail": "Mail gönder",
      "footer": "© MikailSarpkaya"
    },
    en: {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.certificates": "Certificates",
      "nav.about": "About",
      "nav.contact": "Contact",
      "hero.title": "AI & Software-Oriented Engineer",
      "hero.sub": "Electrical-Electronics Engineer · Data Science · Automation · Web",
      "hero.btnProjects": "View Projects",
      "hero.btnCertificates": "View Certificates",
      "about.title": "About",
      "about.p1": "I’m an Electrical-Electronics Engineer building product-oriented projects in software, data science, and AI.",
      "about.p2": "Focus: Python automation & data processing, web apps, basic DevOps (VPS/Nginx/Cloudflare), and analytical problem solving.",
      "about.focusTitle": "Focus",
      "about.focus1": "Automation & backend development",
      "about.focus2": "Data cleaning / analysis pipelines",
      "about.focus3": "Productization: deploy, monitor, iterate",
      "about.stackTitle": "Stack",
      "contact.title": "Contact",
      "contact.p1": "Reach out for work, freelance, or collaboration.",
      "contact.mail": "Send email",
      "footer": "© MikailSarpkaya"
    }
  };

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const tBtn = document.getElementById("themeToggle");
    if (tBtn) tBtn.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  function applyLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    const dict = translations[lang] || translations.tr;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    const lBtn = document.getElementById("langToggle");
    if (lBtn) lBtn.textContent = lang === "tr" ? "EN" : "TR";
  }

  function buildNavPages() {
    const holder = document.getElementById("navPages");
    if (!holder) return;

    const page = document.body?.dataset?.page || "home";

    const items = {
      home: { href: "index.html", key: "nav.home" },
      projects: { href: "projects.html", key: "nav.projects" },
      certificates: { href: "certificates.html", key: "nav.certificates" },
      about: { href: "index.html#about", key: "nav.about" },
      contact: { href: "index.html#contact", key: "nav.contact" }
    };

    // İstediğin sıra:
    // Home: Projeler + Sertifikalar (istersen about/contact da ekledim)
    // Projects/Certificates: önce Ana Sayfa, sonra Hakkımda, sonra diğerleri
    let order = [];
    if (page === "home") order = ["projects", "certificates"];
    if (page === "projects") order = ["home", "about", "certificates"];
    if (page === "certificates") order = ["home", "about", "projects"];

    // Projects/Certificates sayfalarında ayrıca "İletişim" de istiyorsan:
    if (page !== "home") order.splice(2, 0, "contact"); // home, about, contact, other

    holder.innerHTML = "";
    order.forEach((k) => {
      // bulunduğun sayfayı asla gösterme
      if (k === page) return;

      const a = document.createElement("a");
      a.href = items[k].href;
      a.setAttribute("data-i18n", items[k].key);
      a.textContent = items[k].key; // applyLang gelince değişecek
      holder.appendChild(a);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Theme init
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);

    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    // Nav build
    buildNavPages();

    // Lang init
    const savedLang = localStorage.getItem(LANG_KEY) || "tr";
    applyLang(savedLang);

    const langBtn = document.getElementById("langToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const current = localStorage.getItem(LANG_KEY) || "tr";
        applyLang(current === "tr" ? "en" : "tr");
      });
    }
  });
})();
