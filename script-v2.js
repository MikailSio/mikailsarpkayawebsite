/* ═══════════════════════════════════════════════
   MIKAIL SARPKAYA — script-v2.js
   Premium interactions (Refokus-style)
   ═══════════════════════════════════════════════ */

const isTouch = window.matchMedia('(pointer: coarse)').matches;

/* ────────────────────────────────────────
   1) Custom Cursor — CS:GO-style crosshair
   1:1 follow (no lag), expands on interactive,
   dark outline for visibility on any background
   ──────────────────────────────────────── */
(function customCursor() {
  if (isTouch) return;
  // Gate native cursor-hiding behind a class added ONLY here. If this script fails to load
  // or it's a touch device, the native cursor stays visible (no invisible-cursor trap).
  document.documentElement.classList.add('has-custom-cursor');

  const cross = document.createElement('div');
  cross.className = 'cursor-cross';
  // inner layer rotates (+ -> x) smoothly; outer layer handles instant position
  cross.innerHTML = '<div class="cc-inner"><i class="t"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="dot"></i></div>';
  document.body.appendChild(cross);

  let visible = false;
  // .card-clickable is added by JS only to cards that actually have a link (see makeCardsClickable)
  // a/button already cover nav links, cert-verify links, card-link, tut-umbrella, filter & lang
  // buttons. .card-clickable + .hamburger are <div>s, so they're listed explicitly. A non-link
  // cert-verify (the "In Progress" <span>) is intentionally excluded so it stays "+".
  const INTERACTIVE = 'a, button, [data-magnetic], .card-clickable, .hamburger';

  // show = smooth fade-in via CSS; hide = instant (kill transition) so no lingering ghost
  function showCursor() { cross.style.transition = ''; cross.style.opacity = 1; visible = true; }
  function hideCursor() { cross.style.transition = 'none'; cross.style.opacity = 0; visible = false; }

  window.addEventListener('mousemove', e => {
    // Over a native scrollbar? Hide our crosshair — it can't track during a scrollbar drag
    // (no mousemove fires), so it would otherwise freeze at the grab point. Let the OS cursor show.
    if (e.clientX >= document.documentElement.clientWidth ||
        e.clientY >= document.documentElement.clientHeight) {
      if (visible) hideCursor();
      return;
    }
    if (!visible) showCursor();
    // 1:1 instant follow — crosshair precision, no lerp
    cross.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });

  // Hide reliably when pointer leaves the window or tab loses focus (instant — no fade ghost)
  document.documentElement.addEventListener('mouseleave', hideCursor);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget) hideCursor(); });
  window.addEventListener('blur', hideCursor);

  document.addEventListener('mouseover', e => {
    if (e.target.closest(INTERACTIVE)) cross.classList.add('grow');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(INTERACTIVE)) cross.classList.remove('grow');
  });

  // Click feedback — quick "fire" pulse (lines snap out then back)
  window.addEventListener('mousedown', () => cross.classList.add('fire'));
  window.addEventListener('mouseup', () => cross.classList.remove('fire'));
})();

/* ────────────────────────────────────────
   1b) Make whole project/cert cards clickable
   (only cards that contain a link — so cursor × is honest)
   ──────────────────────────────────────── */
(function makeCardsClickable() {
  document.querySelectorAll('.card, .cert-card').forEach(card => {
    const link = card.querySelector('a[href]');
    if (!link) return; // skip cards without a link (e.g., "In Progress" cert)
    card.classList.add('card-clickable');
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return; // real link clicked — let it work natively
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // honor open-in-new-tab
      if (link.target === '_blank') window.open(link.href, '_blank', 'noopener');
      else window.location.href = link.href;
    });
  });
})();

/* ────────────────────────────────────────
   2) Magnetic hover — buttons get subtly pulled toward cursor
   ──────────────────────────────────────── */
(function magneticHover() {
  if (isTouch) return;
  const selector = '.cta-btn, .c-btn, .nav-logo, [data-magnetic]';
  document.querySelectorAll(selector).forEach(el => {
    const strength = parseFloat(el.dataset.magnetic) || 0.3;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ────────────────────────────────────────
   3) Cursor-tracking 3D tilt — hero accent rotates with mouse
   ──────────────────────────────────────── */
(function cursorTrack() {
  if (isTouch) return;
  const els = document.querySelectorAll('[data-cursor-track]');
  if (!els.length) return;

  function onMove(e) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    els.forEach(el => {
      const intensity = parseFloat(el.dataset.cursorTrack) || 1;
      const rY = x * 25 * intensity;
      const rX = -y * 25 * intensity;
      el.style.transform = `perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    });
  }
  window.addEventListener('mousemove', onMove, { passive: true });
})();

/* ────────────────────────────────────────
   4) Number counters — animate when in view
   ──────────────────────────────────────── */
(function counters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.counterSuffix || '';
      const dur = 1800;
      const t0 = performance.now();
      (function tick(now) {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        const v = Math.round(target * e);
        el.textContent = v.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(t0);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
})();

/* ────────────────────────────────────────
   5) Marquee — auto-scrolling banner (looped seamlessly)
   ──────────────────────────────────────── */
(function marquee() {
  document.querySelectorAll('.marquee').forEach(m => {
    const inner = m.querySelector('.marquee-inner');
    if (!inner || inner.dataset.marqueeReady) return;
    inner.dataset.marqueeReady = '1';                    // idempotent — never doubles twice
    inner.innerHTML = inner.innerHTML + inner.innerHTML; // double for seamless loop
  });
})();

/* ────────────────────────────────────────
   6) Parallax — elements move at different speed than scroll
   ──────────────────────────────────────── */
(function parallax() {
  if (isTouch) return;
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  function onScroll() {
    const sy = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translate3d(0, ${sy * speed * -0.5}px, 0)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ────────────────────────────────────────
   7) Text scramble — random chars on hover, then settle
   ──────────────────────────────────────── */
(function scramble() {
  const POOL = '!<>-_\\/[]{}—=+*^?#__';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const final = el.textContent;
    let raf;
    function run() {
      let frame = 0;
      const queue = [];
      for (let i = 0; i < final.length; i++) {
        const start = Math.floor(Math.random() * 10);
        const end = start + Math.floor(Math.random() * 20) + 5;
        queue.push({ to: final[i], start, end });
      }
      cancelAnimationFrame(raf);
      (function update() {
        let out = '', done = 0;
        for (let i = 0; i < queue.length; i++) {
          const q = queue[i];
          if (frame >= q.end) { out += q.to; done++; }
          else if (frame >= q.start) {
            if (!q.char || Math.random() < 0.3) q.char = POOL[Math.floor(Math.random() * POOL.length)];
            out += `<span class="scramble-char">${q.char}</span>`;
          } else out += ' ';
        }
        el.innerHTML = out;
        if (done < queue.length) { frame++; raf = requestAnimationFrame(update); }
        else el.textContent = final;
      })();
    }
    el.addEventListener('mouseenter', run);
  });
})();

/* ────────────────────────────────────────
   8) Scroll-triggered reveal (enhanced)
   ──────────────────────────────────────── */
(function reveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.sr').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.08 + 's';
    obs.observe(el);
  });
})();

/* 9) Smooth scroll — removed; native is faster. CSS scroll-behavior:smooth handles anchors. */

/* ────────────────────────────────────────
   10) Page chrome — loader, nav shadow, mobile menu, content filters.
   Consolidated here (was duplicated inline on every page, with conflicting
   reveal/transitionDelay logic). Single source of truth now.
   ──────────────────────────────────────── */
(function loader() {
  const el = document.getElementById('loader');
  if (!el) return;
  window.addEventListener('load', () => setTimeout(() => el.classList.add('hidden'), 1200));
})();

(function navShadow() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
})();

// Global — invoked from inline onclick="toggleMobile()" in the markup
window.toggleMobile = function () {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileNav');
  if (!h || !m) return;
  const open = m.classList.toggle('open');
  h.classList.toggle('open', open);
  h.setAttribute('aria-expanded', open ? 'true' : 'false');
};

(function filters() {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  // One generic handler for both pages — .card on /projects, .cert-card on /certificates.
  const items = document.querySelectorAll('.card[data-category], .cert-card[data-category]');
  btns.forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    items.forEach(c => { c.style.display = (f === 'all' || c.dataset.category.includes(f)) ? 'flex' : 'none'; });
  }));
})();
