/* plotly-fix.js v7
 * Global patch for Plotly responsive/cropping/theme issues.
 * - Wraps Plotly.newPlot to inject automargin on all axes
 * - Boosts hard-coded margin.r so legends don't get clipped
 * - Forces theme-aware font & grid colors (overrides hardcoded #ebe6dc per-lesson)
 * - Re-themes existing plots when data-theme attribute flips
 * - Forces autosize and responsive config
 * - Resizes all plots after layout settles + on theme/sidebar changes
 */
(function () {
  if (typeof window === 'undefined') return;

  /* ---------- THEME COLORS ---------- */
  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }
  function colors() {
    var L = isLight();
    return {
      text:   L ? '#1a1d24' : '#ebe6dc',
      grid:   L ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)',
      zero:   L ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.15)',
      paper:  'rgba(0,0,0,0)',
      plot:   'rgba(0,0,0,0)'
    };
  }
  /* Hardcoded dark-theme color tokens authors used in lesson layouts.
   * Any of these found on a font/text color attribute means "intent: chart
   * foreground" — replace with current theme's text color. */
  var DARK_TOKENS = ['#ebe6dc', '#EBE6DC', 'rgb(235,230,220)', 'rgb(235, 230, 220)'];
  function isDarkToken(v) { return typeof v === 'string' && DARK_TOKENS.indexOf(v) !== -1; }

  function patchLayoutColors(layout) {
    if (!layout || typeof layout !== 'object') return;
    var c = colors();

    /* font.color (global text) */
    if (!layout.font) layout.font = {};
    if (!layout.font.color || isDarkToken(layout.font.color)) layout.font.color = c.text;

    /* Force font size to match our CSS override (15px). Plotly's legend &
     * automargin width math uses layout.font.size; if it's left at the 12px
     * default, calculated margin.r falls short of rendered 15px text. */
    if (!layout.font.size || layout.font.size < 15) layout.font.size = 15;
    if (layout.legend && typeof layout.legend === 'object') {
      if (!layout.legend.font) layout.legend.font = {};
      if (!layout.legend.font.size || layout.legend.font.size < 15) layout.legend.font.size = 15;
    } else if (layout.legend === undefined) {
      layout.legend = { font: { size: 15 } };
    }

    /* title font */
    if (layout.title && typeof layout.title === 'object') {
      if (!layout.title.font) layout.title.font = {};
      if (!layout.title.font.color || isDarkToken(layout.title.font.color)) layout.title.font.color = c.text;
    }

    /* legend font */
    if (layout.legend && typeof layout.legend === 'object') {
      if (!layout.legend.font) layout.legend.font = {};
      if (!layout.legend.font.color || isDarkToken(layout.legend.font.color)) layout.legend.font.color = c.text;
    }

    /* axes grid + zero lines + tick text */
    ['xaxis','yaxis','xaxis2','yaxis2','xaxis3','yaxis3','xaxis4','yaxis4'].forEach(function(k){
      var ax = layout[k];
      if (!ax || typeof ax !== 'object') return;
      // gridcolor: replace dark-theme white-alpha values with theme-aware
      var g = (ax.gridcolor || '').toString();
      if (!ax.gridcolor || /rgba\s*\(\s*255\s*,\s*255\s*,\s*255/i.test(g)) ax.gridcolor = c.grid;
      var z = (ax.zerolinecolor || '').toString();
      if (!ax.zerolinecolor || /rgba\s*\(\s*255\s*,\s*255\s*,\s*255/i.test(z)) ax.zerolinecolor = c.zero;
      // tickfont
      if (ax.tickfont && isDarkToken(ax.tickfont.color)) ax.tickfont.color = c.text;
      // titlefont (axis label)
      if (ax.title && typeof ax.title === 'object' && ax.title.font && isDarkToken(ax.title.font.color)) {
        ax.title.font.color = c.text;
      }
    });

    /* annotations: replace dark-token font colors */
    if (Array.isArray(layout.annotations)) {
      layout.annotations.forEach(function(a){
        if (a && a.font && isDarkToken(a.font.color)) a.font.color = c.text;
      });
    }

    /* paper / plot background: keep transparent so .plotly-graph CSS bg shows through */
    if (layout.paper_bgcolor === undefined) layout.paper_bgcolor = c.paper;
    if (layout.plot_bgcolor === undefined)  layout.plot_bgcolor  = c.plot;
  }

  function patchLayoutMargins(layout, data) {
    if (!layout || typeof layout !== 'object') return;
    if (!layout.margin) layout.margin = {};

    /* Estimate whether a legend will be drawn: explicit true, or default
     * (undefined) with multiple traces. */
    var showLeg = layout.showlegend;
    var visTraces = Array.isArray(data) ? data.filter(function(t){
      return t && t.showlegend !== false;
    }) : [];
    if (showLeg === undefined && visTraces.length >= 2) showLeg = true;

    /* Adaptive right margin: based on the longest legend label so we don't
     * clip "2x + y = 6"-style names. Our CSS forces 15px legend text — at
     * that size Open Sans averages ~11px/char (wider chars push higher).
     * Add ~50px for the trace marker dash + label padding + a right gutter
     * so the rendered text doesn't kiss the box edge. Floor 160px, cap 260. */
    if (showLeg) {
      var maxLen = 0;
      visTraces.forEach(function(t){
        if (t && t.name) maxLen = Math.max(maxLen, String(t.name).length);
      });
      var needed = Math.min(260, Math.max(160, Math.round(maxLen * 11 + 50)));
      if (layout.margin.r === undefined || layout.margin.r < needed) {
        layout.margin.r = needed;
      }
    } else {
      /* No legend, but still ensure breathing room so hand-drawn shapes /
       * annotations near the right edge of xaxis range don't kiss the SVG
       * boundary. Many lessons set margin.r:20 which is too tight. */
      if (layout.margin.r === undefined || layout.margin.r < 50) {
        layout.margin.r = 50;
      }
    }
    /* Same idea on the left when explicit margin.l is too tight. We only
     * bump from very-small (typical hand-drawn-axis charts use 20). Charts
     * with visible y-axis usually already set 40-50 so we don't disturb. */
    if (layout.margin.l === undefined || layout.margin.l < 30) {
      layout.margin.l = 50;
    }
    /* Same for top/bottom — keep title/x-tick labels off the box edge. */
    if (layout.margin.t === undefined || layout.margin.t < 30) {
      layout.margin.t = layout.title ? 60 : 30;
    }
    if (layout.margin.b === undefined || layout.margin.b < 30) {
      layout.margin.b = 40;
    }
  }

  function injectAutomargin(layout) {
    if (!layout || typeof layout !== 'object') return;
    ['xaxis','yaxis','xaxis2','yaxis2','xaxis3','yaxis3','xaxis4','yaxis4'].forEach(function(k){
      if (layout[k] && typeof layout[k] === 'object' && layout[k].automargin === undefined) {
        layout[k].automargin = true;
      }
    });
    if (layout.polar && layout.polar.angularaxis && layout.polar.angularaxis.automargin === undefined) {
      layout.polar.angularaxis.automargin = true;
    }
    if (layout.polar && layout.polar.radialaxis && layout.polar.radialaxis.automargin === undefined) {
      layout.polar.radialaxis.automargin = true;
    }
    if (layout.autosize === undefined) layout.autosize = true;
  }

  /* ---------- PATCH PLOTLY.NEWPLOT ---------- */
  function patchPlotly() {
    if (!window.Plotly || window.Plotly.__patchedFix2) return false;
    var origNewPlot = window.Plotly.newPlot;
    if (typeof origNewPlot !== 'function') return false;

    window.Plotly.newPlot = function (div, data, layout, config) {
      try {
        layout = layout || {};
        injectAutomargin(layout);
        patchLayoutMargins(layout, data);
        patchLayoutColors(layout);
      } catch (e) {}
      config = config || {};
      if (config.responsive === undefined) config.responsive = true;

      var p = origNewPlot.call(this, div, data, layout, config);
      try {
        var el = (typeof div === 'string') ? document.getElementById(div) : div;
        if (el) {
          // Attach a ResizeObserver to this plot's container (the .plotly-graph
          // wrapper, which is the parent of the .js-plotly-plot div Plotly creates).
          var wrap = el.closest && el.closest('.plotly-graph, .calc-graph');
          if (wrap) attachResizeObserver(wrap);
          setTimeout(function () { try { window.Plotly.Plots.resize(el); } catch (e) {} }, 80);
          setTimeout(function () { try { window.Plotly.Plots.resize(el); } catch (e) {} }, 400);
          setTimeout(function () { try { window.Plotly.Plots.resize(el); } catch (e) {} }, 1200);
        }
      } catch (e) {}
      return p;
    };
    window.Plotly.__patchedFix2 = true;
    return true;
  }

  /* ---------- RE-THEME LIVE PLOTS ---------- */
  function rethemeAll() {
    if (!window.Plotly) return;
    var c = colors();
    var nodes = document.querySelectorAll('.plotly-graph, .calc-graph');
    nodes.forEach(function (el) {
      // Plotly stamps `.layout` and `.data` on the container div after render
      if (!el.layout || !el.data) return;
      try {
        var update = {
          'font.color': c.text,
          'paper_bgcolor': c.paper,
          'plot_bgcolor': c.plot
        };
        if (el.layout.title) update['title.font.color'] = c.text;
        if (el.layout.legend) update['legend.font.color'] = c.text;
        ['xaxis','yaxis','xaxis2','yaxis2'].forEach(function(k){
          if (el.layout[k]) {
            update[k+'.gridcolor'] = c.grid;
            update[k+'.zerolinecolor'] = c.zero;
            if (el.layout[k].tickfont) update[k+'.tickfont.color'] = c.text;
          }
        });
        // Annotations: re-color any whose font was dark-theme cream
        if (Array.isArray(el.layout.annotations)) {
          var anns = el.layout.annotations.map(function(a){
            var copy = Object.assign({}, a);
            if (copy.font) copy.font = Object.assign({}, copy.font, {color: c.text});
            return copy;
          });
          update.annotations = anns;
        }
        window.Plotly.relayout(el, update);
      } catch (e) {}
    });
  }

  function resizeAll() {
    if (!window.Plotly || !window.Plotly.Plots) return;
    var nodes = document.querySelectorAll('.plotly-graph .js-plotly-plot, .js-plotly-plot');
    nodes.forEach(function (el) {
      try { window.Plotly.Plots.resize(el); } catch (e) {}
    });
  }

  /* ResizeObserver per Plotly container — fires Plots.resize when the
     container's measured width changes. This catches the common bug where
     Plotly renders during initial layout (loader open, container=0) and
     then never re-fits when the real width arrives. */
  var resizeObserver = null;
  function attachResizeObserver(el) {
    if (!('ResizeObserver' in window)) return;
    if (el.__plotlyROAttached) return;
    el.__plotlyROAttached = true;
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(function(entries) {
        entries.forEach(function(entry) {
          var node = entry.target;
          var jsPlot = node.querySelector('.js-plotly-plot') || (node.matches('.js-plotly-plot') ? node : null);
          if (jsPlot && window.Plotly && window.Plotly.Plots) {
            clearTimeout(node.__plotlyROT);
            node.__plotlyROT = setTimeout(function(){
              try { window.Plotly.Plots.resize(jsPlot); } catch(e) {}
            }, 60);
          }
        });
      });
    }
    try { resizeObserver.observe(el); } catch(e) {}
  }
  function attachAllRO() {
    document.querySelectorAll('.plotly-graph, .calc-graph').forEach(attachResizeObserver);
  }

  function tryPatch() {
    if (patchPlotly()) return;
    var tries = 0;
    var iv = setInterval(function () {
      if (patchPlotly() || ++tries > 60) clearInterval(iv);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryPatch);
  } else {
    tryPatch();
  }

  window.addEventListener('load', function () {
    setTimeout(function(){ attachAllRO(); resizeAll(); }, 300);
    setTimeout(function(){ attachAllRO(); resizeAll(); }, 1200);
    setTimeout(function(){ attachAllRO(); resizeAll(); }, 2500);
  });
  window.addEventListener('resize', function () {
    clearTimeout(window.__plotlyResizeT);
    window.__plotlyResizeT = setTimeout(resizeAll, 120);
  });

  try {
    var mo = new MutationObserver(function (muts) {
      var themed = muts.some(function(m){ return m.attributeName === 'data-theme'; });
      if (themed) {
        clearTimeout(window.__plotlyThemeT);
        window.__plotlyThemeT = setTimeout(function(){ rethemeAll(); resizeAll(); }, 60);
      } else {
        clearTimeout(window.__plotlyMoT);
        window.__plotlyMoT = setTimeout(resizeAll, 200);
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'data-sidebar'] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-sidebar'] });
  } catch (e) {}

  /* expose for manual call from lesson code if needed */
  window.__plotlyRetheme = rethemeAll;
})();
