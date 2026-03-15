/**
 * shared.i18n.js — mikailsarpkaya.com/tutorials
 * Common i18n engine + shared UI translations for all tutorial pages.
 * Each page loads this FIRST, then its own local i18n file which merges via Object.assign(T, T_LOCAL).
 *
 * Usage in HTML:
 *   <script src="../shared.i18n.js"></script>
 *   <script src="core.i18n.js"></script>
 */

const LANGS  = ['en','tr','de','es'];
const LABELS = { en:'EN', tr:'TR', de:'DE', es:'ES' };
const NAMES  = { en:'English', tr:'Türkçe', de:'Deutsch', es:'Español' };

/* ── SHARED TRANSLATIONS (UI labels used across all tutorial pages) ── */
const T = {

  /* NAV */
  "nav.projects":     {en:"Projects",       tr:"Projeler",         de:"Projekte",          es:"Proyectos"},
  "nav.certificates": {en:"Certificates",   tr:"Sertifikalar",     de:"Zertifikate",       es:"Certificados"},
  "nav.research":     {en:"Research",       tr:"Araştırma",        de:"Forschung",         es:"Investigación"},
  "nav.tutorials":    {en:"Tutorials",      tr:"Eğitimler",        de:"Tutorials",         es:"Tutoriales"},
  "nav.cv":           {en:"CV ↗",           tr:"CV ↗",             de:"Lebenslauf ↗",      es:"CV ↗"},

  /* SIDEBAR */
  "tp.back":      {en:"← All Tutorials",     tr:"← Tüm Eğitimler",     de:"← Alle Tutorials",        es:"← Todos los Tutoriales"},
  "tp.sb.title":  {en:"TUTORIALS",           tr:"EĞİTİMLER",            de:"TUTORIALS",               es:"TUTORIALES"},
  "tp.sb.sub":    {en:"Software & AI Guides",tr:"Yazılım & YZ Rehberleri",de:"Software- & KI-Leitfäden",es:"Guías de Software e IA"},
  "tp.g.sys":     {en:"Systems & Languages", tr:"Sistemler & Diller",   de:"Systeme & Sprachen",      es:"Sistemas y Lenguajes"},
  "tp.g.py":      {en:"Python Ecosystem",    tr:"Python Ekosistemi",    de:"Python-Ökosystem",        es:"Ecosistema Python"},
  "tp.g.ai":      {en:"AI & Machine Learning",tr:"YZ & Makine Öğrenmesi",de:"KI & Maschinelles Lernen",es:"IA y Machine Learning"},
  "tp.g.nlp":     {en:"NLP & Transformers",  tr:"NLP & Transformer'lar",de:"NLP & Transformers",      es:"NLP y Transformers"},
  "tp.g.math":    {en:"Math & Foundations",  tr:"Matematik & Temeller", de:"Mathematik & Grundlagen", es:"Matemáticas y Fundamentos"},

  /* BADGES / LABELS */
  "lb.avail":  {en:"Available", tr:"Mevcut",    de:"Verfügbar",    es:"Disponible"},
  "lb.live":   {en:"Live",      tr:"Canlı",     de:"Live",         es:"En vivo"},
  "lb.new":    {en:"New",       tr:"Yeni",      de:"Neu",          es:"Nuevo"},
  "lb.soon":   {en:"Soon",      tr:"Yakında",   de:"Bald",         es:"Pronto"},

  /* META */
  "meta.lessons":  {en:"Lessons",       tr:"Ders",          de:"Lektionen",     es:"Lecciones"},
  "meta.level":    {en:"Level",         tr:"Seviye",        de:"Stufe",         es:"Nivel"},
  "meta.prereq":   {en:"Prerequisites", tr:"Ön Koşullar",   de:"Voraussetzungen",es:"Prerrequisitos"},

  /* CODE BLOCK */
  "ui.copy":    {en:"Copy",    tr:"Kopyala", de:"Kopieren", es:"Copiar"},
  "ui.copied":  {en:"Copied!", tr:"Kopyalandı!", de:"Kopiert!", es:"¡Copiado!"},

  /* LESSON NAV */
  "ui.back":    {en:"← Back",     tr:"← Geri",     de:"← Zurück",    es:"← Atrás"},
  "ui.next":    {en:"Next →",     tr:"Sonraki →",  de:"Nächste →",   es:"Siguiente →"},

  /* FOOTER */
  "footer": {
    en:"© 2026 Mikail Sarpkaya. All rights reserved.",
    tr:"© 2026 Mikail Sarpkaya. Tüm hakları saklıdır.",
    de:"© 2026 Mikail Sarpkaya. Alle Rechte vorbehalten.",
    es:"© 2026 Mikail Sarpkaya. Todos los derechos reservados."},

  /* ALIASES — backward compat for old migrated pages (tui.* → tp.*/ui.*) */
  "tui.back":     {en:"← All Tutorials",     tr:"← Tüm Eğitimler",     de:"← Alle Tutorials",        es:"← Todos los Tutoriales"},
  "tui.lessons":  {en:"Lessons",       tr:"Dersler",        de:"Lektionen",     es:"Lecciones"},
  "tui.level":    {en:"Level",         tr:"Seviye",         de:"Niveau",        es:"Nivel"},
  "tui.prereq":   {en:"Prerequisites", tr:"Ön Koşullar",   de:"Voraussetzungen",es:"Requisitos previos"},
  "tui.framework":{en:"Framework",     tr:"Framework",      de:"Framework",     es:"Framework"},
  "tui.copy":     {en:"Copy",          tr:"Kopyala",        de:"Kopieren",      es:"Copiar"},
  "tui.copied":   {en:"Copied!",       tr:"Kopyalandı!",   de:"Kopiert!",      es:"¡Copiado!"},
  "tui.next":     {en:"Next",          tr:"Sonraki",        de:"Nächste",       es:"Siguiente"},
};


/* ════════════════════════════════════════
   I18N ENGINE
   ════════════════════════════════════════ */
let lang = 'en';

function getLang() {
  const s = localStorage.getItem('ms_lang');
  if (s && LANGS.includes(s)) return s;
  const b = (navigator.language || 'en').slice(0, 2).toLowerCase();
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

/* ── SWITCHER WIDGET ── */
function buildSw(mobile) {
  const w = document.createElement('div');
  w.className = mobile ? 'ls-wrap ls-mobile' : 'ls-wrap';
  w.innerHTML = LANGS.map(l =>
    `<button class="ls-btn${l === lang ? ' ls-active' : ''}" data-lang="${l}"
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

/* ── INJECT CSS FOR SWITCHER ── */
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

/* ── INIT ── */
function i18nInit() {
  lang = getLang();
  injectCSS();
  injectSw();
  applyAll();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', i18nInit)
  : i18nInit();
