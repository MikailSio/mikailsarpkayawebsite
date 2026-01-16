document.addEventListener("DOMContentLoaded", () => {
document.getElementById("y").textContent = new Date().getFullYear();
/* =====================
   Dil (TR / EN) Sistemi
   ===================== */

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

const toggleBtn = document.getElementById("langToggle");

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  toggleBtn.textContent = lang === "tr" ? "EN" : "TR";
  currentLang = lang;
}

// Butona tıklama
toggleBtn.addEventListener("click", () => {
  setLanguage(currentLang === "tr" ? "en" : "tr");
});

// Sayfa ilk açıldığında
setLanguage("tr");
// =========================
// Tema (Koyu / Açık) Toggle
// =========================
(function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const root = document.documentElement;

  // Sayfa açılırken: kayıtlı tema varsa uygula
  const saved = localStorage.getItem("theme");
  if (saved === "light") root.setAttribute("data-theme", "light");

  // Buton ikonunu güncelle
  function syncIcon() {
    const isLight = root.getAttribute("data-theme") === "light";
    btn.textContent = isLight ? "☀️" : "🌙";
  }
  syncIcon();

  // Tıklandığında temayı değiştir ve kaydet
  btn.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "light");

    localStorage.setItem("theme", root.getAttribute("data-theme") === "light" ? "light" : "dark");
    syncIcon();
  });
})();
   
});
