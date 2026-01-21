// ================== YEAR ==================
const y = document.getElementById("y");
if (y) y.textContent = new Date().getFullYear();

// ================== THEME ==================
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = savedTheme;

function syncThemeBtn() {
  if (!themeToggle) return;
  const t = document.documentElement.dataset.theme;
  themeToggle.textContent = t === "dark" ? "🌙" : "☀️";
}
syncThemeBtn();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    syncThemeBtn();
  });
}

// ================== I18N ==================
const translations = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.certificates": "Certificates",
    "nav.contact": "Contact",
    "nav.abctohero": "AbcToHero",
	"nav.about": "About",
	"about.h": "About",
	"about.text": "I’m an Electrical & Electronics Engineer building projects in software, data science, and AI. I focus on Python-based automation, data processing/analytics pipelines, and web systems. My goal is to build practical, maintainable solutions that can be shipped to production.",

    "hero.title": "AI & Software-Oriented Engineer",
    "hero.meta": "Electrical-Electronics Engineer · Data Science · Automation · Web",

    "home.projectsH": "Projects",
    "home.badgeDev": "In Development",
    "home.abcDesc": "English learning web app that practices vocabulary, tenses, modals and patterns (Django + VPS).",
    "home.allProjects": "All projects",
    "home.note": "Note: I’m organizing project details on a separate page.",

    "contact.h": "Contact",
    "contact.emailLabel": "Email",
    "contact.webLabel": "Website",

    "projects.h": "Projects",
    "projects.p": "A selection of my work.",

    "certs.h": "Certificates",
    "certs.p": "Verified achievements and training.",
    "certs.credlyBtn": "View on Credly",

    "footer.name": "Mikail Sarpkaya"
  },

  tr: {
    "nav.home": "Ana Sayfa",
    "nav.projects": "Projeler",
    "nav.certificates": "Sertifikalar",
    "nav.contact": "İletişim",
    "nav.abctohero": "AbcToHero",

	"nav.about": "Hakkımda",
	"about.h": "Hakkımda",
	"about.text": "Elektrik-Elektronik Mühendisiyim. Yazılım, veri bilimi ve yapay zeka alanlarında projeler geliştiriyorum. Özellikle Python tabanlı otomasyonlar, veri işleme/analiz akışları ve web sistemleri üzerine odaklanıyorum. Amacım; gerçek problemleri çözen, sürdürülebilir ve üretim ortamına taşınabilir sistemler geliştirmek.",

    "hero.title": "Yapay Zeka & Yazılım Odaklı Mühendis",
    "hero.meta": "Elektrik-Elektronik Mühendisi · Veri Bilimi · Otomasyon · Web",

    "home.projectsH": "Projeler",
    "home.badgeDev": "Geliştirme Aşamasında",
    "home.abcDesc": "İngilizce kelimeleri, zamanlar/modallar ve kalıplarla çalıştıran web uygulaması (Django + VPS).",
    "home.allProjects": "Tüm projeler",
    "home.note": "Not: Projeleri ayrı sayfada daha detaylı toparlıyorum.",

    "contact.h": "İletişim",
    "contact.emailLabel": "E-posta",
    "contact.webLabel": "Web Sitesi",

    "projects.h": "Projeler",
    "projects.p": "Çalışmalarımdan seçmeler.",

    "certs.h": "Sertifikalar",
    "certs.p": "Doğrulanabilir eğitim ve başarılar.",
    "certs.credlyBtn": "Credly'de Gör",

    "footer.name": "Mikail Sarpkaya"
  }
};

const langToggle = document.getElementById("langToggle");
let currentLang = localStorage.getItem("lang") || "en";

function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = translations[currentLang]?.[key];
    if (typeof value === "string") el.textContent = value;
  });

  if (langToggle) langToggle.textContent = currentLang.toUpperCase();
}

applyTranslations();

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "tr" : "en";
    localStorage.setItem("lang", currentLang);
    applyTranslations();
  });
}
