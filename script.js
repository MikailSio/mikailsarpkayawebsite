/* MikailSarpkaya - Theme (dark default) + i18n + Dynamic nav */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // ---------------- THEME (dark default) ----------------
  const themeBtn = document.getElementById("themeToggle");

  function setTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme"); // dark default
    localStorage.setItem("theme", theme);
    if (themeBtn) themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      setTheme(isLight ? "dark" : "light");
    });
  }

  // ---------------- i18n (TR/EN) ----------------
  const langBtn = document.getElementById("langToggle");

  const translations = {
    tr: {
      "nav.home": "Ana Sayfa",
      "nav.projects": "Projeler",
      "nav.certificates": "Sertifikalarım",
      "nav.about": "Hakkımda",
      "nav.contact": "İletişim",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Elektrik-Elektronik Mühendisi · Veri Bilimi · Otomasyon · Web",
      "hero.cta.projects": "Projelerimi Gör",
      "hero.cta.certificates": "Sertifikalarımı Gör",

      "about.title": "Hakkımda",
      "about.p1": "Elektrik-Elektronik Mühendisiyim. Yazılım, veri bilimi ve yapay zeka alanlarında ürün odaklı projeler geliştiriyorum.",
      "about.p2": "Odak alanlarım: Python ile otomasyon ve veri işleme, web uygulamaları, temel DevOps (VPS/Nginx/Cloudflare) ve analitik problem çözme.",
      "about.focus": "Odak",
      "about.stack": "Stack",

      "contact.title": "İletişim",
      "contact.text": "İş, freelance veya iş birliği için ulaşabilirsin.",
      "contact.mail": "Mail gönder",

      "projects.h1": "Projeler",
      "projects.sub": "Öne çıkanlar + geliştirmekte olduklarım.",
      "projects.featured": "Öne Çıkan",
      "projects.dev": "Geliştirme Aşamasında",
      "projects.planned": "Planlanıyor",
      "projects.open": "Siteyi Aç →",
      "projects.note": "Not: Şu an sadece admin panel açık, kullanıcı arayüzü geliştirme aşamasında.",

      "cert.h1": "Sertifikalarım",
      "cert.sub": "Doğrulanabilir rozetler ve sertifika bağlantıları.",
      "cert.credlyTitle": "Credly Rozetler",
      "cert.credlyDesc": "Rozetlerimi Credly üzerinden görebilir ve doğrulayabilirsin.",
      "cert.view": "Görüntüle"
    },
    en: {
      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.certificates": "Certificates",
      "nav.about": "About",
      "nav.contact": "Contact",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Electrical-Electronics Engineer · Data Science · Automation · Web",
      "hero.cta.projects": "View Projects",
      "hero.cta.certificates": "View Certificates",

      "about.title": "About",
      "about.p1": "I’m an Electrical-Electronics Engineer building product-oriented projects in software, data science, and AI.",
      "about.p2": "Focus: Python automation & data processing, web apps, basic DevOps (VPS/Nginx/Cloudflare), and analytical problem solving.",
      "about.focus": "Focus",
      "about.stack": "Stack",

      "contact.title": "Contact",
      "contact.text": "Reach out for work, freelance, or collaboration.",
      "contact.mail": "Send email",

      "projects.h1": "Projects",
      "projects.sub": "Highlights + work in progress.",
      "projects.featured": "Featured",
      "projects.dev": "In Development",
      "projects.planned": "Planned",
      "projects.open": "Open →",
      "projects.note": "Note: Only admin panel is open for now; UI is in progress.",

      "cert.h1": "Certificates",
      "cert.sub": "Verifiable badges and certificate links.",
      "cert.credlyTitle": "Credly Badges",
      "cert.credlyDesc": "You can view and verify my badges via Credly.",
      "cert.view": "View"
    }
  };

  function applyLang(lang) {
    localStorage.setItem("lang", lang);
    const dict = translations[lang] || translations.tr;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    if (langBtn) langBtn.textContent = lang === "tr" ? "EN" : "TR";
  }

  const savedLang = localStorage.getItem("lang") || "tr";
  applyLang(savedLang);

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const current = localStorage.getItem("lang") || "tr";
      applyLang(current === "tr" ? "en" : "tr");
    });
  }

  // ---------------- Dynamic NAV (your rules) ----------------
  // - Icons stay left near name (HTML)
  // - Right side: page buttons + language + theme
  // - Current page's button is hidden
  // - Projects/Certificates pages order: Home, About, then the other page (+ Contact)
  function buildNav() {
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

    let order = [];
    if (page === "home") {
      order = ["projects", "certificates"]; // home page shows only these on the right
    } else if (page === "projects") {
      order = ["home", "about", "contact", "certificates"];
    } else if (page === "certificates") {
      order = ["home", "about", "contact", "projects"];
    }

    holder.innerHTML = "";

    order.forEach((k) => {
      if (k === page) return; // hide current page button
      const a = document.createElement("a");
      a.className = "pill";
      a.href = items[k].href;
      a.setAttribute("data-i18n", items[k].key);
      // fallback text (will be replaced by applyLang anyway)
      a.textContent = items[k].key;
      holder.appendChild(a);
    });

    // After creating, re-apply language to update labels
    applyLang(localStorage.getItem("lang") || "tr");
  }

  buildNav();

  // ---------------- Footer year ----------------
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
});
