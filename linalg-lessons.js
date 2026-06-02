/* linalg-lang.js — Linear Algebra: interactive lesson content with Plotly + KaTeX */
(function(){
'use strict';

var L = {
en: {
  eyebrow: 'Tutorial \u00b7 Mathematics',
  heroDesc: 'Vectors, matrices, eigenvalues, SVD, and tensors \u2014 the <strong>mathematical backbone</strong> of machine learning and deep learning.',
  metaLessons: 'Lessons', metaLevel: 'Level', metaTools: 'Tools',
  prevLabel: '\u2190 All Tutorials', nextLabel: 'Next: Calculus \u2192', badge: 'Available',
  lessons: []
},
tr: {
  eyebrow: 'E\u011fitim \u00b7 Matematik',
  heroDesc: 'Vekt\u00f6rler, matrisler, \u00f6zde\u011ferler, SVD ve tens\u00f6rler \u2014 makine \u00f6\u011frenimi ve derin \u00f6\u011frenmenin <strong>matematiksel temeli</strong>.',
  metaLessons: 'Dersler', metaLevel: 'Seviye', metaTools: 'Ara\u00e7lar',
  prevLabel: '\u2190 T\u00fcm E\u011fitimler', nextLabel: 'Sonraki: Kalk\u00fcl\u00fcs \u2192', badge: 'Mevcut',
  lessons: []
}
};

// Load lessons from external global vars if available
if(typeof LINALG_L1 !== 'undefined') {
  L.en.lessons.push({ title: 'Vectors & Vector Spaces', sub: 'notation, addition, dot product, norms, cosine similarity, orthogonality, span, basis', time: '22 min read', body: LINALG_L1.en });
  L.tr.lessons.push({ title: 'Vekt\u00f6rler & Vekt\u00f6r Uzaylar\u0131', sub: 'notasyon, toplama, i\u00e7 \u00e7arp\u0131m, normlar, kosin\u00fcs benzerli\u011fi, diklik, kapsam, taban', time: '22 dk okuma', body: LINALG_L1.tr });
}
if(typeof LINALG_L2 !== 'undefined') {
  L.en.lessons.push({ title: 'Matrices & Transformations', sub: 'multiplication, transpose, inverse, determinant, rank, linear transformations', time: '22 min read', body: LINALG_L2.en });
  L.tr.lessons.push({ title: 'Matrisler & D\u00f6n\u00fc\u015f\u00fcmler', sub: '\u00e7arp\u0131m, devrik, ters, determinant, rank, do\u011frusal d\u00f6n\u00fc\u015f\u00fcmler', time: '22 dk okuma', body: LINALG_L2.tr });
} else {
  L.en.lessons.push({ title: 'Matrices & Transformations', sub: 'multiplication, transpose, inverse, determinant, rank, linear transformations', time: '22 min read', body: '<p class="l-text"><em>Coming soon...</em></p>' });
  L.tr.lessons.push({ title: 'Matrisler & D\u00f6n\u00fc\u015f\u00fcmler', sub: '\u00e7arp\u0131m, devrik, ters, determinant, rank', time: '22 dk okuma', body: '<p class="l-text"><em>Yak\u0131nda...</em></p>' });
}
if(typeof LINALG_L3 !== 'undefined') {
  L.en.lessons.push({ title: 'Systems of Linear Equations', sub: 'Ax=b, Gaussian elimination, LU decomposition, least squares', time: '20 min read', body: LINALG_L3.en });
  L.tr.lessons.push({ title: 'Do\u011frusal Denklem Sistemleri', sub: 'Ax=b, Gauss eliminasyon, LU ayr\u0131\u015ft\u0131rma', time: '20 dk okuma', body: LINALG_L3.tr });
} else {
  L.en.lessons.push({ title: 'Systems of Linear Equations', sub: 'Ax=b, Gaussian elimination, LU decomposition, least squares', time: '20 min read', body: '<p class="l-text"><em>Coming soon...</em></p>' });
  L.tr.lessons.push({ title: 'Do\u011frusal Denklem Sistemleri', sub: 'Ax=b, Gauss eliminasyon, LU ayr\u0131\u015ft\u0131rma', time: '20 dk okuma', body: '<p class="l-text"><em>Yak\u0131nda...</em></p>' });
}
if(typeof LINALG_L4 !== 'undefined') {
  L.en.lessons.push({ title: 'Eigenvalues & Eigenvectors', sub: 'characteristic equation, diagonalization, spectral theorem, PCA', time: '20 min read', body: LINALG_L4.en });
  L.tr.lessons.push({ title: '\u00d6zde\u011ferler & \u00d6zvekt\u00f6rler', sub: 'karakteristik denklem, k\u00f6\u015fegenle\u015ftirme, spektral teorem, PCA', time: '20 dk okuma', body: LINALG_L4.tr });
} else {
  L.en.lessons.push({ title: 'Eigenvalues & Eigenvectors', sub: 'characteristic equation, diagonalization, spectral theorem, PCA', time: '20 min read', body: '<p class="l-text"><em>Coming soon...</em></p>' });
  L.tr.lessons.push({ title: '\u00d6zde\u011ferler & \u00d6zvekt\u00f6rler', sub: 'karakteristik denklem, k\u00f6\u015fegenle\u015ftirme', time: '20 dk okuma', body: '<p class="l-text"><em>Yak\u0131nda...</em></p>' });
}
if(typeof LINALG_L5 !== 'undefined') {
  L.en.lessons.push({ title: 'SVD & Matrix Decomposition', sub: 'singular value decomposition, low-rank approximation, PCA, image compression', time: '20 min read', body: LINALG_L5.en });
  L.tr.lessons.push({ title: 'SVD & Matris Ayr\u0131\u015ft\u0131rma', sub: 'tekil de\u011fer ayr\u0131\u015ft\u0131rmas\u0131, PCA', time: '20 dk okuma', body: LINALG_L5.tr });
} else {
  L.en.lessons.push({ title: 'SVD & Matrix Decomposition', sub: 'singular value decomposition, low-rank approximation, PCA, image compression', time: '20 min read', body: '<p class="l-text"><em>Coming soon...</em></p>' });
  L.tr.lessons.push({ title: 'SVD & Matris Ayr\u0131\u015ft\u0131rma', sub: 'tekil de\u011fer ayr\u0131\u015ft\u0131rmas\u0131, PCA', time: '20 dk okuma', body: '<p class="l-text"><em>Yak\u0131nda...</em></p>' });
}
if(typeof LINALG_L6 !== 'undefined') {
  L.en.lessons.push({ title: 'Tensors & Multidimensional Arrays', sub: 'tensor operations, broadcasting, reshaping, einsum', time: '18 min read', body: LINALG_L6.en });
  L.tr.lessons.push({ title: 'Tens\u00f6rler & \u00c7ok Boyutlu Diziler', sub: 'tens\u00f6r i\u015flemleri, yay\u0131l\u0131m, einsum', time: '18 dk okuma', body: LINALG_L6.tr });
} else {
  L.en.lessons.push({ title: 'Tensors & Multidimensional Arrays', sub: 'tensor operations, broadcasting, reshaping, einsum', time: '18 min read', body: '<p class="l-text"><em>Coming soon...</em></p>' });
  L.tr.lessons.push({ title: 'Tens\u00f6rler & \u00c7ok Boyutlu Diziler', sub: 'tens\u00f6r i\u015flemleri, yay\u0131l\u0131m, einsum', time: '18 dk okuma', body: '<p class="l-text"><em>Yak\u0131nda...</em></p>' });
}

function render(lang) {
  var t = L[lang] || L.en, fb = L.en;
  var ey = document.getElementById('eyebrow');
  if(ey) ey.textContent = t.eyebrow;
  var hd = document.getElementById('heroDesc');
  if(hd) hd.innerHTML = t.heroDesc;
  document.querySelectorAll('.meta-label').forEach(function(el){
    var k=el.dataset.key; if(k&&t[k]) el.textContent=t[k];
  });
  var pv=document.getElementById('prevLabel');
  if(pv) pv.textContent=t.prevLabel;
  var nx=document.getElementById('nextLabel');
  if(nx) nx.textContent=t.nextLabel;
  document.querySelectorAll('.lesson-block').forEach(function(block,i){
    var lesson=t.lessons[i], fall=fb.lessons[i];
    if(!lesson) return;
    var ti=block.querySelector('.lesson-title');
    var su=block.querySelector('.lesson-sub');
    var tm=block.querySelector('.l-time');
    var ba=block.querySelector('.l-badge-text');
    var bo=block.querySelector('.lesson-body');
    if(ti) ti.innerHTML=lesson.title;
    if(su) su.innerHTML=lesson.sub;
    if(tm) tm.textContent=lesson.time;
    if(ba) ba.textContent=t.badge;
    var content=lesson.body||(fall?fall.body:'');
    if(bo&&content) bo.innerHTML=content;
  });
  // Execute inline scripts (Plotly graphs injected via innerHTML)
  document.querySelectorAll('.lesson-body script').forEach(function(old){
    var s = document.createElement('script');
    s.textContent = old.textContent;
    old.parentNode.replaceChild(s, old);
  });
  // KaTeX render
  setTimeout(function(){
    if(typeof renderMathInElement==='function'){
      document.querySelectorAll('.lesson-body').forEach(function(el){
        renderMathInElement(el,{delimiters:[
          {left:"$$",right:"$$",display:true},
          {left:"$",right:"$",display:false}
        ],throwOnError:false});
      });
    }
  }, 200);
}
render('en');
document.addEventListener('langchange',function(e){render(e.detail.lang);});
try{if(localStorage.getItem('tut-lang')==='tr') render('tr');}catch(e){}

})();
