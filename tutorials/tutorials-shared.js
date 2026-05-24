/* tutorials-shared.js — mikailsarpkaya.com/tutorials */
(function(){
  /* ── Theme Toggle ── */
  window.toggleTheme = function(){
    document.documentElement.classList.toggle('light-theme');
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('tut-theme', isLight ? 'light' : 'dark');
    // Update icon
    const btn = document.getElementById('themeTog');
    if(btn){
      btn.innerHTML = isLight
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
    }
  };

  /* ── Language Toggle ── */
  window.toggleLang = function(){
    const btn = document.getElementById('langTog');
    if(!btn) return;
    const label = btn.querySelector('.lang-label');
    if(!label) return;
    const current = label.textContent.trim();
    const next = current === 'EN' ? 'TR' : 'EN';
    label.textContent = next;
    localStorage.setItem('tut-lang', next);
    // i18n swap — dispatch event for pages that support it
    document.dispatchEvent(new CustomEvent('langChange', {detail: {lang: next.toLowerCase()}}));
  };

  /* ── Restore preferences ── */
  const savedTheme = localStorage.getItem('tut-theme');
  if(savedTheme === 'light'){
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('light-theme');
  }

  const savedLang = localStorage.getItem('tut-lang');
  if(savedLang){
    const label = document.querySelector('#langTog .lang-label');
    if(label) label.textContent = savedLang;
  }

  /* ── Sidebar Toggle (desktop) ── */
  const togDesktop = document.querySelector('.sb-toggle-desktop');
  if(togDesktop){
    togDesktop.addEventListener('click', function(){
      document.body.classList.toggle('sb-collapsed');
      // Also support hub's collapsed class
      const sb = document.querySelector('.sidebar');
      if(sb) sb.classList.toggle('collapsed');
      this.classList.toggle('shifted');
    });
  }

  /* ── Sidebar Group Toggle ── */
  document.querySelectorAll('.sb-group-label').forEach(function(l){
    l.addEventListener('click', function(){
      this.parentElement.classList.toggle('open');
    });
  });

  /* ── Mobile Nav Toggle ── */
  window.toggleMobile = function(){
    var h = document.getElementById('hamburger');
    var m = document.getElementById('mobileNav');
    if(h) h.classList.toggle('open');
    if(m) m.classList.toggle('open');
  };

  /* ── Mobile Sidebar Toggle ── */
  window.toggleSidebar = function(){
    var sb = document.querySelector('.sidebar');
    if(sb) sb.classList.toggle('open');
  };

  /* ── Lesson Block Toggle ── */
  window.toggleLesson = function(header){
    var block = header.closest ? header.closest('.lesson-block') : header.parentElement;
    if(!block && typeof header === 'string') block = document.getElementById(header);
    if(block) block.classList.toggle('open');
  };

  /* ── Loader dismiss ── */
  var loader = document.getElementById('loader');
  if(loader){
    window.addEventListener('load', function(){
      setTimeout(function(){ loader.classList.add('hidden'); }, 1200);
    });
  }

  /* ── Copy Code Button ── */
  window.copyCode = function(btn){
    var block = btn.closest('.code-block') || btn.closest('.code-wrap');
    if(!block) return;
    var code = block.querySelector('pre code') || block.querySelector('pre');
    if(!code) return;
    navigator.clipboard.writeText(code.textContent).then(function(){
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function(){ btn.textContent = orig; }, 1500);
    });
  };

  /* ── Nav scroll effect ── */
  var nav = document.getElementById('nav');
  if(nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Color Picker ── */
  var PRESETS = [
    {name:'Lavanta',  hex:'#b8a9d4', bg:'#0a0a0f'},
    {name:'Altın',    hex:'#c8a96e', bg:'#0a0806'},
    {name:'Turkuaz',  hex:'#4de8cc', bg:'#060a0a'},
    {name:'Yeşil',    hex:'#4de87a', bg:'#060a06'},
    {name:'Kırmızı',  hex:'#e84d4d', bg:'#0f0606'},
    {name:'Mavi',     hex:'#4d8be8', bg:'#06080f'},
    {name:'Turuncu',  hex:'#e8944d', bg:'#0f0a06'},
    {name:'Pembe',    hex:'#e84da5', bg:'#0f060a'},
    {name:'Cyan',     hex:'#4dcce8', bg:'#060c0f'},
    {name:'Sarı',     hex:'#e8d44d', bg:'#0f0e06'}
  ];

  function hexToRgb(hex){
    var r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return {r:r,g:g,b:b};
  }

  function applyAccentColor(hex, bg){
    var rgb = hexToRgb(hex);
    var root = document.documentElement;
    root.style.setProperty('--hub-accent', hex);
    root.style.setProperty('--hub-accent-dim', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.1)');
    root.style.setProperty('--hub-border', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.06)');
    root.style.setProperty('--hub-muted', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.4)');
    root.style.setProperty('--hub-text', 'rgba(238,228,210,.88)');
    root.style.setProperty('--particle-color', rgb.r+','+rgb.g+','+rgb.b);
    if(bg) root.style.setProperty('--hub-bg', bg);
    // Legacy aliases
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--gold', hex);
    root.style.setProperty('--muted', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.4)');
    root.style.setProperty('--border', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.06)');
    // Update active swatch
    document.querySelectorAll('.color-swatch').forEach(function(s){ s.classList.remove('active'); });
    var match = document.querySelector('.color-swatch[data-color="'+hex+'"]');
    if(match) match.classList.add('active');
    // Save
    localStorage.setItem('tut-accent', hex);
    if(bg) localStorage.setItem('tut-accent-bg', bg);
  }

  window.toggleColorPicker = function(){
    var dd = document.querySelector('.color-dropdown');
    if(dd) dd.classList.toggle('open');
  };

  // Close dropdown on outside click
  document.addEventListener('click', function(e){
    var dd = document.querySelector('.color-dropdown');
    var wrap = document.querySelector('.color-picker-wrap');
    if(dd && wrap && !wrap.contains(e.target)) dd.classList.remove('open');
  });

  // Custom color input
  var customInput = document.getElementById('customColor');
  if(customInput){
    customInput.addEventListener('input', function(){
      applyAccentColor(this.value, null);
    });
  }

  // Preset clicks
  document.querySelectorAll('.color-swatch').forEach(function(sw){
    sw.addEventListener('click', function(){
      applyAccentColor(this.dataset.color, this.dataset.bg || null);
    });
  });

  // Restore saved accent
  var savedAccent = localStorage.getItem('tut-accent');
  var savedBg = localStorage.getItem('tut-accent-bg');
  if(savedAccent){
    applyAccentColor(savedAccent, savedBg);
  }

})();
