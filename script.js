/* =====================================================
   Sayfa Yüklendiğinde Çalışacak Ana Blok
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------
     Footer yılı otomatik güncelle
     --------------------------------- */
  const yearSpan = document.getElementById("y");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* =====================================================
     DİL SİSTEMİ (TR / EN)
     ===================================================== */

  // Çeviri sözlüğü
  const translations = {
    tr: {
      "nav.projects": "Projeler",
      "nav.about": "Hakkımda",
      "nav.contact": "İletişim",
      "nav.certificates": "Sertifikalarım",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Elektrik-Elektronik Mühendisi · Veri Bilimi · Otomasyon · Web",

      "projects.title": "Projeler",
      "about.title": "Hakkımda",
      "contact.title": "İletişim"
    },
    en: {
      "nav.projects": "Projects",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.certificates": "Certificates",

      "hero.title": "AI & Software-Oriented Engineer",
      "hero.subtitle": "Electrical & Electronics Engineer · Data Science · Automation · Web",

      "projects.title": "Projects",
      "about.title": "About Me",
      "contact.title": "Contact"
    }
  };

  let currentLang = "tr";
  const langToggleBtn = document.getElementById("langToggle");

  // Dili sayfaya uygula
  function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Buton yazısını güncelle
    if (langToggleBtn) {
      langToggleBtn.textContent = lang === "tr" ? "EN" : "TR";
    }

    currentLang = lang;
    localStorage.setItem("lang", lang); // Dil tercihini kaydet
  }

  // Dil butonuna tıklama
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setLanguage(currentLang === "tr" ? "en" : "tr");
    });
  }

  // Sayfa ilk açıldığında kayıtlı dili uygula
  const savedLang = localStorage.getItem("lang") || "tr";
  setLanguage(savedLang);

  /* =====================================================
     TEMA SİSTEMİ (KOYU / AÇIK)
     ===================================================== */

  const themeToggleBtn = document.getElementById("themeToggle");
  const root = document.documentElement;

  // Kayıtlı tema varsa uygula
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  // Tema ikonunu güncelle
  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    const isLight = root.getAttribute("data-theme") === "light";
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  }

  updateThemeIcon();

  // Tema butonuna tıklama
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";

      if (isLight) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }

      updateThemeIcon();
    });
  }

});
