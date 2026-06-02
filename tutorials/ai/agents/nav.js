/* tutorials/lesson-nav.js
   Adds three enhancements to every lesson page:
   1) Prev/Next navigation at end of content (same track only)
   2) Progress tracking via localStorage — sidebar lessons get a ✓ once the user
      scrolls past 85% of the page, marking real engagement (not just landed).
   3) Site search modal (Ctrl/Cmd+K) — fuzzy filters all lessons via sidebar harvest. */
(function () {
  'use strict';

  const COMPLETED_KEY = 'mikail:completed:v1';
  function readCompleted() {
    try { return new Set(JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }
  function writeCompleted(set) {
    try { localStorage.setItem(COMPLETED_KEY, JSON.stringify([...set])); } catch(e) {}
  }

  function markCheckmarks() {
    const completed = readCompleted();
    document.querySelectorAll('a.sb-lesson').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Normalize trailing slashes / .html
      const norm = href.replace(/\.html$/, '').replace(/\/$/, '');
      const isDone = completed.has(norm);
      let mark = a.querySelector('.sb-check');
      if (isDone) {
        if (!mark) {
          mark = document.createElement('span');
          mark.className = 'sb-check';
          mark.textContent = '✓';
          mark.style.cssText = 'margin-left:auto;color:#7ad27a;font-weight:600;font-size:0.95em;opacity:0.85';
          a.appendChild(mark);
        }
      } else if (mark) {
        mark.remove();
      }
    });
  }

  function setupCompletionTracking() {
    // The page itself counts as a lesson — register completion when user scrolls
    // past 85% of body, signaling they actually read it.
    const myPath = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    if (!/\/tutorials\/[^/]+\/\d+/.test(myPath)) return;
    let marked = false;
    function check() {
      if (marked) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total > 0.85) {
        marked = true;
        const completed = readCompleted();
        completed.add(myPath);
        writeCompleted(completed);
        markCheckmarks();
        window.removeEventListener('scroll', check);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    // Also mark after 90 seconds even if user did not scroll (long video-watching reader)
    setTimeout(() => {
      if (!marked) {
        marked = true;
        const completed = readCompleted();
        completed.add(myPath);
        writeCompleted(completed);
        markCheckmarks();
      }
    }, 90000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }

  function init() {
    markCheckmarks();
    setupCompletionTracking();
    buildPrevNext();
    setupSearch();
  }

  // ---------- SEARCH MODAL ----------
  function harvestLessons() {
    const links = Array.from(document.querySelectorAll('a.sb-lesson'));
    const lessons = links.map(a => {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/tutorials\/([^/]+)\/(\d+)/);
      const track = m ? m[1] : '';
      const num = m ? m[2] : '';
      const lbl = a.querySelector('.lbl');
      const titleEn = lbl?.dataset?.en || lbl?.textContent || '';
      const titleTr = lbl?.dataset?.tr || titleEn;
      return { track, num, href, titleEn, titleTr };
    }).filter(l => l.track && l.num);
    // Add hub + glossary as discoverable special entries
    lessons.push({ track: '★', num: '', href: '/tutorials/', titleEn: 'Tutorials Hub', titleTr: 'Dersler Ana Sayfa' });
    lessons.push({ track: '★', num: '', href: '/tutorials/glossary/', titleEn: 'Glossary — All Terms', titleTr: 'Sözlük — Tüm Terimler' });
    return lessons;
  }

  function setupSearch() {
    if (window.__lessonSearchInit) return;
    window.__lessonSearchInit = true;

    // Floating search button (bottom-left so it doesn't fight with sidebar toggle)
    const fab = document.createElement('button');
    fab.id = 'lesson-search-fab';
    fab.innerHTML = '🔍';
    fab.title = 'Ders ara (Ctrl+K)';
    fab.style.cssText = [
      'position:fixed', 'bottom:18px', 'left:18px', 'z-index:9998',
      'width:42px', 'height:42px', 'border-radius:50%', 'border:none',
      'background:rgba(200,169,110,0.22)', 'color:#c8a96e',
      'font-size:18px', 'cursor:pointer', 'box-shadow:0 4px 12px rgba(0,0,0,.3)',
      'transition:transform .15s, background .2s', 'backdrop-filter:blur(6px)'
    ].join(';');
    fab.addEventListener('mouseenter', () => { fab.style.transform = 'scale(1.1)'; fab.style.background = 'rgba(200,169,110,0.4)'; });
    fab.addEventListener('mouseleave', () => { fab.style.transform = ''; fab.style.background = 'rgba(200,169,110,0.22)'; });
    fab.addEventListener('click', openModal);
    document.body.appendChild(fab);

    // Keyboard shortcut: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openModal();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  let modal = null, input = null, listEl = null, lessons = [], selectedIdx = 0;

  function openModal() {
    if (!modal) buildModal();
    lessons = harvestLessons();
    selectedIdx = 0;
    renderResults('');
    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 50);
  }
  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  function buildModal() {
    modal = document.createElement('div');
    modal.id = 'lesson-search-modal';
    modal.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:10000', 'display:none',
      'align-items:flex-start', 'justify-content:center',
      'background:rgba(0,0,0,0.65)', 'backdrop-filter:blur(4px)', 'padding:8vh 1rem 1rem'
    ].join(';');
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    const box = document.createElement('div');
    box.style.cssText = [
      'width:100%', 'max-width:600px', 'background:#161620', 'color:#eee',
      'border:1px solid rgba(200,169,110,0.3)', 'border-radius:14px',
      'box-shadow:0 16px 40px rgba(0,0,0,.55)', 'overflow:hidden',
      'display:flex', 'flex-direction:column', 'max-height:78vh'
    ].join(';');

    input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Ders ara… / Search lessons…';
    input.style.cssText = [
      'border:none', 'outline:none', 'background:transparent',
      'color:#fff', 'font:16px/1.4 system-ui,sans-serif',
      'padding:1rem 1.2rem', 'border-bottom:1px solid rgba(200,169,110,0.18)'
    ].join(';');
    input.addEventListener('input', () => { selectedIdx = 0; renderResults(input.value); });
    input.addEventListener('keydown', (e) => {
      const items = listEl.querySelectorAll('a');
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(items.length - 1, selectedIdx + 1); updateSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(0, selectedIdx - 1); updateSel(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const sel = items[selectedIdx];
        if (sel) location.href = sel.href;
      }
    });

    listEl = document.createElement('div');
    listEl.style.cssText = 'overflow-y:auto;flex:1;padding:0.4rem 0';

    const hint = document.createElement('div');
    hint.style.cssText = 'padding:0.5rem 1.2rem;font-size:0.72rem;color:rgba(200,169,110,0.6);border-top:1px solid rgba(200,169,110,0.12);display:flex;gap:1rem;align-items:center';
    hint.innerHTML = '<span>↑↓ gezin</span><span>↵ aç</span><span>Esc kapat</span><a href="/tutorials/glossary/" style="margin-left:auto;color:rgba(200,169,110,0.85);text-decoration:none;border:1px solid rgba(200,169,110,0.3);padding:2px 8px;border-radius:6px">📖 Glossary →</a>';

    box.appendChild(input);
    box.appendChild(listEl);
    box.appendChild(hint);
    modal.appendChild(box);
    document.body.appendChild(modal);
  }

  function updateSel() {
    const items = listEl.querySelectorAll('a');
    items.forEach((it, i) => {
      it.style.background = (i === selectedIdx) ? 'rgba(200,169,110,0.18)' : '';
    });
    const sel = items[selectedIdx];
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function score(lesson, q) {
    if (!q) return 1;
    const hay = (lesson.titleEn + ' ' + lesson.titleTr + ' ' + lesson.track).toLowerCase();
    const needle = q.toLowerCase();
    // Best: exact substring match in title (high priority)
    if ((lesson.titleEn + ' ' + lesson.titleTr).toLowerCase().includes(needle)) {
      return 1000 - hay.indexOf(needle);
    }
    // Track name match (medium priority)
    if (lesson.track.toLowerCase().includes(needle)) {
      return 500;
    }
    // Substring anywhere
    if (hay.includes(needle)) return 200 - hay.indexOf(needle);
    // Fuzzy: only meaningful if needle is short (<=4 chars) and almost all chars match consecutively
    if (needle.length > 4) return 0;
    let i = 0, hits = 0, gaps = 0, lastHit = -10;
    for (let k = 0; k < hay.length; k++) {
      if (i < needle.length && hay[k] === needle[i]) {
        if (lastHit >= 0) gaps += (k - lastHit - 1);
        lastHit = k;
        i++; hits++;
      }
    }
    if (i !== needle.length) return 0;
    return Math.max(0, 50 - gaps);
  }

  function renderResults(q) {
    const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en';
    const scored = lessons
      .map(l => ({ l, s: score(l, q.trim()) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30);
    listEl.innerHTML = '';
    if (!scored.length) {
      listEl.innerHTML = '<div style="padding:1.2rem;text-align:center;color:rgba(255,255,255,0.5)">Sonuç yok</div>';
      return;
    }
    scored.forEach(({ l }, i) => {
      const a = document.createElement('a');
      a.href = l.href;
      a.style.cssText = [
        'display:flex', 'align-items:center', 'gap:0.8rem',
        'padding:0.7rem 1.2rem', 'text-decoration:none', 'color:inherit',
        'transition:background .12s', 'border-left:3px solid transparent'
      ].join(';');
      a.innerHTML = [
        `<span style="background:rgba(200,169,110,0.15);color:#c8a96e;padding:2px 8px;border-radius:6px;font-size:0.72rem;font-weight:600;letter-spacing:0.04em">${l.track.toUpperCase()}</span>`,
        `<span style="color:rgba(200,169,110,0.7);font-family:ui-monospace,monospace;font-size:0.78rem;width:24px">${l.num.padStart(2, '0')}</span>`,
        `<span style="flex:1">${lang === 'tr' ? l.titleTr : l.titleEn}</span>`
      ].join('');
      a.addEventListener('mouseenter', () => { selectedIdx = i; updateSel(); });
      listEl.appendChild(a);
    });
    updateSel();
  }

  function buildPrevNext() {
    const active = document.querySelector('a.sb-lesson.active');
    if (!active) return;
    const links = Array.from(document.querySelectorAll('a.sb-lesson'));
    const idx = links.indexOf(active);
    if (idx < 0) return;

    const trackOf = a => {
      const m = (a.getAttribute('href') || '').match(/\/tutorials\/([^/]+)\//);
      return m ? m[1] : null;
    };
    const myTrack = trackOf(active);
    const prev = (idx > 0 && trackOf(links[idx - 1]) === myTrack) ? links[idx - 1] : null;
    const next = (idx < links.length - 1 && trackOf(links[idx + 1]) === myTrack) ? links[idx + 1] : null;
    if (!prev && !next) return;

    function curLang() {
      return (document.documentElement.lang === 'tr') ? 'tr' : 'en';
    }
    function labelOf(a) {
      const lbl = a.querySelector('.lbl');
      if (!lbl) return '';
      return lbl.dataset[curLang()] || lbl.textContent || '';
    }
    function numOf(a) { return (a.querySelector('.num')?.textContent || '').trim(); }

    const linkStyle = [
      'display:block', 'padding:1rem 1.25rem',
      'border:1px solid rgba(200,169,110,0.22)',
      'border-radius:12px', 'text-decoration:none', 'color:inherit',
      'background:rgba(200,169,110,0.05)',
      'transition:border-color .2s, background .2s, transform .15s'
    ].join(';');

    function build(link, dir) {
      if (!link) return '<div></div>';
      const arrow = dir === 'prev' ? '←' : '→';
      const align = dir === 'prev' ? 'left' : 'right';
      const lang = curLang();
      const labelTop = lang === 'tr'
        ? (dir === 'prev' ? 'Önceki Ders' : 'Sonraki Ders')
        : (dir === 'prev' ? 'Previous Lesson' : 'Next Lesson');
      const lessonWord = lang === 'tr' ? 'Ders' : 'Lesson';
      const top = dir === 'prev' ? `${arrow} ${labelTop}` : `${labelTop} ${arrow}`;
      return [
        `<a href="${link.href}" data-nav="${dir}" style="${linkStyle};text-align:${align}">`,
        `<div style="font-size:.72rem;color:rgba(200,169,110,0.75);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:0.45rem;font-weight:600">${top}</div>`,
        `<div style="font-size:.78rem;opacity:0.6;margin-bottom:0.2rem">${lessonWord} ${numOf(link)}</div>`,
        `<div style="font-size:1rem;font-weight:500;line-height:1.3">${labelOf(link)}</div>`,
        `</a>`
      ].join('');
    }

    const nav = document.createElement('nav');
    nav.className = 'lesson-nav';
    nav.id = '__lesson-nav';
    nav.style.cssText = [
      'display:grid', 'grid-template-columns:1fr 1fr', 'gap:1rem',
      'margin:3rem 0 2rem', 'padding-top:1.5rem',
      'border-top:1px solid rgba(200,169,110,0.18)'
    ].join(';');
    nav.innerHTML = build(prev, 'prev') + build(next, 'next');

    // Hover effect via inline style — cant use :hover from inline,
    // so attach JS handlers
    nav.querySelectorAll('a[data-nav]').forEach(a => {
      a.addEventListener('mouseenter', () => {
        a.style.borderColor = 'rgba(200,169,110,0.55)';
        a.style.background = 'rgba(200,169,110,0.10)';
        a.style.transform = 'translateY(-2px)';
      });
      a.addEventListener('mouseleave', () => {
        a.style.borderColor = 'rgba(200,169,110,0.22)';
        a.style.background = 'rgba(200,169,110,0.05)';
        a.style.transform = '';
      });
    });

    const content =
      document.getElementById('lessonContent') ||
      document.querySelector('.lesson-content') ||
      document.querySelector('main');
    if (content) {
      // Remove any prior nav (e.g. on language switch / dynamic reload)
      const old = content.querySelector('#__lesson-nav');
      if (old) old.remove();
      content.appendChild(nav);
    }

    // Re-render on language change so labels translate
    if (!window.__lessonNavLangHook) {
      window.__lessonNavLangHook = true;
      const obs = new MutationObserver(() => buildPrevNext());
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }
})();
