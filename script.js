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
