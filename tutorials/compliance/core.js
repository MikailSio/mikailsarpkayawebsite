/* ============================================================
   tutorials.js — Shared logic for all tutorial pages
   ============================================================ */

(function(){
  'use strict';

  /* ========== COLOR PICKER ========== */
  const PRESETS = [
    {c:'#4de87a',n:'Green'},{c:'#06b6d4',n:'Cyan'},{c:'#3b82f6',n:'Blue'},{c:'#c8a96e',n:'Gold'},
    {c:'#ec4899',n:'Pink'},{c:'#a855f7',n:'Purple'},{c:'#f97316',n:'Orange'},{c:'#facc15',n:'Yellow'}
  ];

  const presetEl = document.getElementById('presets');
  if (presetEl) {
    PRESETS.forEach(p => {
      const d = document.createElement('div');
      d.className = 'color-swatch';
      d.style.background = p.c;
      d.dataset.color = p.c;
      d.title = p.n;
      d.addEventListener('click', () => setAccent(p.c));
      presetEl.appendChild(d);
    });
  }

  function setAccent(color) {
    document.documentElement.style.setProperty('--accent', color);
    document.querySelectorAll('.color-swatch').forEach(s =>
      s.classList.toggle('active', s.dataset.color === color)
    );
    const custom = document.getElementById('customColor');
    if (custom) custom.value = color;
    try { localStorage.setItem('tut-accent', color); } catch(e) {}
  }

  // Toggle dropdown
  const colorTog = document.getElementById('colorTog');
  const colorDrop = document.getElementById('colorDrop');
  if (colorTog && colorDrop) {
    colorTog.addEventListener('click', e => { e.stopPropagation(); colorDrop.classList.toggle('open'); });
    document.addEventListener('click', () => colorDrop.classList.remove('open'));
    colorDrop.addEventListener('click', e => e.stopPropagation());
  }
  const customInput = document.getElementById('customColor');
  if (customInput) customInput.addEventListener('input', e => setAccent(e.target.value));

  // Restore accent
  try {
    const saved = localStorage.getItem('tut-accent');
    if (saved) setAccent(saved);
    else { const first = document.querySelector('.color-swatch'); if (first) first.classList.add('active'); }
  } catch(e) {}

  /* ========== THEME ========== */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const moon = document.getElementById('iconMoon');
    const sun = document.getElementById('iconSun');
    if (moon) moon.style.display = theme === 'dark' ? '' : 'none';
    if (sun) sun.style.display = theme === 'light' ? '' : 'none';
    try { localStorage.setItem('tut-theme', theme); } catch(e) {}
  }

  const themeTog = document.getElementById('themeTog');
  if (themeTog) {
    themeTog.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }
  try {
    const savedTheme = localStorage.getItem('tut-theme');
    if (savedTheme) setTheme(savedTheme);
  } catch(e) {}

  /* ========== LANGUAGE ========== */
  let lang = 'en';
  try { lang = localStorage.getItem('tut-lang') || 'en'; } catch(e) {}

  window.setLang = function(l) {
    lang = l;
    const label = document.getElementById('langLabel');
    if (label) label.textContent = l.toUpperCase();

    document.querySelectorAll('[data-' + l + ']').forEach(el => {
      const val = el.getAttribute('data-' + l);
      if (val) el.innerHTML = val;
    });

    try { localStorage.setItem('tut-lang', l); } catch(e) {}

    // Fire custom event so page-specific JS can react
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
  };

  const langTog = document.getElementById('langTog');
  if (langTog) {
    langTog.addEventListener('click', () => window.setLang(lang === 'en' ? 'tr' : 'en'));
  }
  // Apply saved lang on load
  if (lang === 'tr') window.setLang('tr');

  /* ========== SIDEBAR ========== */
  // sb-group-label: click + keyboard + aria-expanded sync
  // NOTE: .sb-section-label is handled by inline delegated handler in shell HTML
  // (which also handles .sb-track-label). Don't double-bind here or clicks cancel out.
  document.querySelectorAll('.sb-group-label').forEach(label => {
    const sync = () => {
      const open = label.parentElement.classList.contains('open');
      label.setAttribute('aria-expanded', String(open));
    };
    label.addEventListener('click', () => {
      label.parentElement.classList.toggle('open');
      sync();
    });
    label.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); label.click(); }
    });
    sync();
  });
  const sbToggle = document.getElementById('sbToggle');
  if (sbToggle) sbToggle.addEventListener('click', () => document.body.classList.toggle('sb-collapsed'));
  const sbMobile = document.getElementById('sbMobile');
  const sbEl = document.getElementById('sidebar');
  if (sbMobile && sbEl) {
    sbMobile.addEventListener('click', () => {
      const opened = sbEl.classList.toggle('mobile-open');
      // Body scroll lock while drawer open
      document.body.style.overflow = opened ? 'hidden' : '';
      sbMobile.setAttribute('aria-expanded', String(opened));
    });
    // Esc closes drawer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sbEl.classList.contains('mobile-open')) {
        sbEl.classList.remove('mobile-open');
        document.body.style.overflow = '';
        sbMobile.setAttribute('aria-expanded', 'false');
      }
    });
  }
  // Sync html[lang] when lang switches (a11y for screen readers)
  const origSetLang = window.setLang;
  if (typeof origSetLang === 'function') {
    window.setLang = function(l) {
      document.documentElement.setAttribute('lang', l);
      return origSetLang.call(this, l);
    };
  }

  /* ========== LESSON ACCORDION ========== */
  // Make accordion headers keyboard-accessible
  document.querySelectorAll('.lesson-header').forEach(h => {
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '0');
    if (!h.hasAttribute('role')) h.setAttribute('role', 'button');
    if (!h.hasAttribute('aria-expanded')) {
      h.setAttribute('aria-expanded', String(h.closest('.lesson-block')?.classList.contains('open') || false));
    }
  });
  function toggleAccordion(header) {
    const block = header.closest('.lesson-block');
    if (!block) return;
    block.classList.toggle('open');
    header.setAttribute('aria-expanded', String(block.classList.contains('open')));
    updateProgress();
  }
  document.addEventListener('click', e => {
    const header = e.target.closest('.lesson-header');
    if (header) toggleAccordion(header);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = e.target.closest('.lesson-header');
    if (!header) return;
    e.preventDefault();
    toggleAccordion(header);
  });

  /* ========== PROGRESS BAR ========== */
  function updateProgress() {
    const total = document.querySelectorAll('.lesson-block').length;
    const open = document.querySelectorAll('.lesson-block.open').length;
    const bar = document.getElementById('progressBar');
    if (bar && total) bar.style.width = (open / total * 100) + '%';
  }
  updateProgress();

  /* ========== COPY CODE ========== */
  document.addEventListener('click', e => {
    if (e.target.classList.contains('code-copy')) {
      const pre = e.target.closest('.code-wrap')?.querySelector('pre code');
      if (pre) {
        navigator.clipboard.writeText(pre.textContent).catch(() => {});
        const orig = e.target.textContent;
        e.target.textContent = 'COPIED!';
        setTimeout(() => e.target.textContent = orig, 1500);
      }
    }
  });

  /* ========== LOADER ========== */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 1200);
  });

})();
