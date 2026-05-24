window.ALES_LESSON = {
n: 16,
title: "Köklü Sayılar — Rasyonelleştirme",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>rasyonelleştirme</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Tek terimli paydada $\\dfrac{1}{\\sqrt{a}} \\to \\dfrac{\\sqrt{a}}{a}$, iki terimli paydada eşlenik tekniği $(a+\\sqrt{b}) \\to (a-\\sqrt{b})$ ve karma sadeleştirmeler çözüm içinde gösteriliyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tek Terimli Paydayı Rasyonelleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tek Terimli Payda: $\\dfrac{1}{\\sqrt{a}} = \\dfrac{\\sqrt{a}}{a}$</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Temel Rasyonelleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{2}}$ ifadesini paydası rasyonel olacak şekilde yazın.<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\sqrt{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{\\sqrt{2}}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{\\sqrt{2}}$ &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{2}}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Teknik:</strong> Pay ve paydayı aynı kökle çarp. $\\sqrt{a} \\cdot \\sqrt{a} = a$ olur, payda rasyonelleşir.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{2}} \\cdot \\dfrac{\\sqrt{2}}{\\sqrt{2}} = \\dfrac{\\sqrt{2}}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{\\sqrt{2}}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Sayı / Kök</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6}{\\sqrt{3}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\sqrt{3}$ &nbsp; <strong>B)</strong> $3\\sqrt{3}$ &nbsp; <strong>C)</strong> $6\\sqrt{3}$ &nbsp; <strong>D)</strong> <span class="key">$2\\sqrt{3}$</span> &nbsp; <strong>E)</strong> $2\\sqrt{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{6}{\\sqrt{3}} \\cdot \\dfrac{\\sqrt{3}}{\\sqrt{3}} = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $2\\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Sadeleşmeli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{10}{\\sqrt{5}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\sqrt{5}$ &nbsp; <strong>B)</strong> <span class="key">$2\\sqrt{5}$</span> &nbsp; <strong>C)</strong> $5\\sqrt{5}$ &nbsp; <strong>D)</strong> $2\\sqrt{10}$ &nbsp; <strong>E)</strong> $10\\sqrt{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{10}{\\sqrt{5}} \\cdot \\dfrac{\\sqrt{5}}{\\sqrt{5}} = \\dfrac{10\\sqrt{5}}{5} = 2\\sqrt{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2\\sqrt{5}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Pay Köklü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{12}}{\\sqrt{3}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Doğrudan Bölme</div>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{12}}{\\sqrt{3}} = \\sqrt{\\dfrac{12}{3}} = \\sqrt{4} = 2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Rasyonelleştir</div>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{12} \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\dfrac{\\sqrt{36}}{3} = \\dfrac{6}{3} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Çarpan Ayır + Rasyonelleştir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4}{\\sqrt{8}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $2\\sqrt{2}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\sqrt{2}$</span> &nbsp; <strong>D)</strong> $4\\sqrt{2}$ &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{2}}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{8} = 2\\sqrt{2}$ ⟹ $\\dfrac{4}{2\\sqrt{2}} = \\dfrac{2}{\\sqrt{2}}$.</p>
      <p class="ales-sol-step">$\\dfrac{2}{\\sqrt{2}} \\cdot \\dfrac{\\sqrt{2}}{\\sqrt{2}} = \\dfrac{2\\sqrt{2}}{2} = \\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Üçüncü Dereceli Kök</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt[3]{2}}$ ifadesini paydası rasyonel olacak şekilde yazın.<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt[3]{2}}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt[3]{4}}{4}$ &nbsp; <strong>C)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{\\sqrt[3]{4}}{2}$</span> &nbsp; <strong>E)</strong> $\\sqrt[3]{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — $\\sqrt[3]{4}$ ile Çarp</div>
      <p class="ales-sol-step"><strong>Hedef:</strong> $\\sqrt[3]{2} \\cdot \\sqrt[3]{?} = \\sqrt[3]{2^{3}} = 2$. Eksik üs $2$, yani $\\sqrt[3]{2^{2}} = \\sqrt[3]{4}$ ile çarp.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt[3]{2}} \\cdot \\dfrac{\\sqrt[3]{4}}{\\sqrt[3]{4}} = \\dfrac{\\sqrt[3]{4}}{\\sqrt[3]{8}} = \\dfrac{\\sqrt[3]{4}}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{\\sqrt[3]{4}}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez Toplam Rasyonelleştir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{2}} + \\dfrac{1}{\\sqrt{8}} + \\dfrac{1}{\\sqrt{18}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt{2}}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{11\\sqrt{2}}{6}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{11\\sqrt{2}}{12}$</span> &nbsp; <strong>D)</strong> $\\dfrac{11}{12}$ &nbsp; <strong>E)</strong> $\\dfrac{7\\sqrt{2}}{12}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Önce Köklü Sadeleştir</div>
      <p class="ales-sol-step">$\\sqrt{8} = 2\\sqrt{2}$, $\\sqrt{18} = 3\\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{2}} + \\dfrac{1}{2\\sqrt{2}} + \\dfrac{1}{3\\sqrt{2}} = \\dfrac{1}{\\sqrt{2}}\\left(1 + \\dfrac{1}{2} + \\dfrac{1}{3}\\right)$.</p>
      <p class="ales-sol-step">$1 + \\dfrac{1}{2} + \\dfrac{1}{3} = \\dfrac{6 + 3 + 2}{6} = \\dfrac{11}{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{11}{6\\sqrt{2}} = \\dfrac{11\\sqrt{2}}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{11\\sqrt{2}}{12}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Eşlenik Tekniği (İki Terimli Payda)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Eşlenik Tekniği: $\\dfrac{1}{a + \\sqrt{b}} \\to (a - \\sqrt{b})$</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Temel Eşlenik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2 + \\sqrt{3}}$ ifadesini paydası rasyonel olacak şekilde yazın.<br><br>
      <strong>A)</strong> $2 + \\sqrt{3}$ &nbsp; <strong>B)</strong> <span class="key">$2 - \\sqrt{3}$</span> &nbsp; <strong>C)</strong> $\\dfrac{2 - \\sqrt{3}}{7}$ &nbsp; <strong>D)</strong> $\\sqrt{3} - 2$ &nbsp; <strong>E)</strong> $\\dfrac{2 + \\sqrt{3}}{7}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşlenik ile Çarp</div>
      <p class="ales-sol-step"><strong>Teknik:</strong> $(a + \\sqrt{b})(a - \\sqrt{b}) = a^{2} - b$ — iki kare farkı, kök kaybolur.</p>
      <p class="ales-sol-step">Eşlenik: $2 - \\sqrt{3}$. Pay ve paydayı bununla çarp:</p>
      <p class="ales-sol-step">$\\dfrac{1}{2 + \\sqrt{3}} \\cdot \\dfrac{2 - \\sqrt{3}}{2 - \\sqrt{3}} = \\dfrac{2 - \\sqrt{3}}{4 - 3} = \\dfrac{2 - \\sqrt{3}}{1} = 2 - \\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2 - \\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Eşlenik Pratik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{5} - 1}$ ifadesini paydası rasyonel olacak şekilde yazın.<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt{5} - 1}{4}$ &nbsp; <strong>B)</strong> $\\sqrt{5} + 1$ &nbsp; <strong>C)</strong> $\\dfrac{\\sqrt{5} + 1}{6}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{\\sqrt{5} + 1}{4}$</span> &nbsp; <strong>E)</strong> $\\dfrac{1}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $\\sqrt{5} + 1$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{5} - 1} \\cdot \\dfrac{\\sqrt{5} + 1}{\\sqrt{5} + 1} = \\dfrac{\\sqrt{5} + 1}{5 - 1} = \\dfrac{\\sqrt{5} + 1}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{\\sqrt{5} + 1}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">İki Köklü Payda</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{7} + \\sqrt{3}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt{7} + \\sqrt{3}}{4}$ &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt{7} - \\sqrt{3}}{10}$ &nbsp; <strong>C)</strong> $\\sqrt{7} - \\sqrt{3}$ &nbsp; <strong>D)</strong> $\\dfrac{\\sqrt{21}}{4}$ &nbsp; <strong>E)</strong> <span class="key">$\\dfrac{\\sqrt{7} - \\sqrt{3}}{4}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $\\sqrt{7} - \\sqrt{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{7} + \\sqrt{3}} \\cdot \\dfrac{\\sqrt{7} - \\sqrt{3}}{\\sqrt{7} - \\sqrt{3}} = \\dfrac{\\sqrt{7} - \\sqrt{3}}{7 - 3} = \\dfrac{\\sqrt{7} - \\sqrt{3}}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $\\dfrac{\\sqrt{7} - \\sqrt{3}}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Sayı Pay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6}{3 - \\sqrt{3}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $3 - \\sqrt{3}$ &nbsp; <strong>B)</strong> $\\sqrt{3}$ &nbsp; <strong>C)</strong> <span class="key">$3 + \\sqrt{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{3 + \\sqrt{3}}{6}$ &nbsp; <strong>E)</strong> $6 + \\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $3 + \\sqrt{3}$.</p>
      <p class="ales-sol-step">$\\dfrac{6(3 + \\sqrt{3})}{(3 - \\sqrt{3})(3 + \\sqrt{3})} = \\dfrac{6(3 + \\sqrt{3})}{9 - 3} = \\dfrac{6(3 + \\sqrt{3})}{6} = 3 + \\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $3 + \\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Köklü Pay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{2}}{\\sqrt{3} + 1}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt{6} + \\sqrt{2}}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt{6} - \\sqrt{2}}{4}$ &nbsp; <strong>C)</strong> $\\sqrt{6} - \\sqrt{2}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{\\sqrt{6} - \\sqrt{2}}{2}$</span> &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{2}}{2}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $\\sqrt{3} - 1$.</p>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{2}(\\sqrt{3} - 1)}{(\\sqrt{3})^{2} - 1^{2}} = \\dfrac{\\sqrt{6} - \\sqrt{2}}{3 - 1} = \\dfrac{\\sqrt{6} - \\sqrt{2}}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{\\sqrt{6} - \\sqrt{2}}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Çıkar Eşlenik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{6} - 2}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> <span class="key">$\\dfrac{\\sqrt{6} + 2}{2}$</span> &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt{6} - 2}{2}$ &nbsp; <strong>C)</strong> $\\sqrt{6} + 2$ &nbsp; <strong>D)</strong> $\\dfrac{\\sqrt{6} + 2}{10}$ &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{6} + 2}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $\\sqrt{6} + 2$.</p>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{6} + 2}{6 - 4} = \\dfrac{\\sqrt{6} + 2}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $\\dfrac{\\sqrt{6} + 2}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Eşlenik Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{2} + 1} + \\dfrac{1}{\\sqrt{2} - 1}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\sqrt{2}$ &nbsp; <strong>B)</strong> <span class="key">$2\\sqrt{2}$</span> &nbsp; <strong>C)</strong> $2$ &nbsp; <strong>D)</strong> $4\\sqrt{2}$ &nbsp; <strong>E)</strong> $0$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Her Birini Rasyonelleştir</div>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{2} + 1} \\cdot \\dfrac{\\sqrt{2} - 1}{\\sqrt{2} - 1} = \\dfrac{\\sqrt{2} - 1}{2 - 1} = \\sqrt{2} - 1$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{2} - 1} \\cdot \\dfrac{\\sqrt{2} + 1}{\\sqrt{2} + 1} = \\dfrac{\\sqrt{2} + 1}{2 - 1} = \\sqrt{2} + 1$.</p>
      <p class="ales-sol-step">Toplam: $(\\sqrt{2} - 1) + (\\sqrt{2} + 1) = 2\\sqrt{2}$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Tek Bir Kesir</div>
      <p class="ales-sol-step">$\\dfrac{(\\sqrt{2} - 1) + (\\sqrt{2} + 1)}{(\\sqrt{2} + 1)(\\sqrt{2} - 1)} = \\dfrac{2\\sqrt{2}}{2 - 1} = 2\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2\\sqrt{2}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karma Rasyonelleştirme + Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma Rasyonelleştirme ve Sadeleştirme</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Topla, Sonra Rasyonelleştir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2}{\\sqrt{3}} + \\dfrac{4}{\\sqrt{3}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\sqrt{3}$ &nbsp; <strong>B)</strong> $6\\sqrt{3}$ &nbsp; <strong>C)</strong> $\\dfrac{6}{\\sqrt{3}}$ &nbsp; <strong>D)</strong> <span class="key">$2\\sqrt{3}$</span> &nbsp; <strong>E)</strong> $3\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı payda: $\\dfrac{6}{\\sqrt{3}} = \\dfrac{6\\sqrt{3}}{3} = 2\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $2\\sqrt{3}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Pay-Payda Köklü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{2}}{\\sqrt{8}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $2$ &nbsp; <strong>B)</strong> $\\dfrac{1}{4}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{\\sqrt{2}}{2}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{\\sqrt{4}}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Köklü Bölüm</div>
      <p class="ales-sol-step">$\\dfrac{\\sqrt{2}}{\\sqrt{8}} = \\sqrt{\\dfrac{2}{8}} = \\sqrt{\\dfrac{1}{4}} = \\dfrac{1}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Eşlenik Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sqrt{5} + \\sqrt{2}}{\\sqrt{5} - \\sqrt{2}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\dfrac{7 - 2\\sqrt{10}}{3}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{7 + 2\\sqrt{10}}{3}$</span> &nbsp; <strong>C)</strong> $\\dfrac{7 + 2\\sqrt{10}}{7}$ &nbsp; <strong>D)</strong> $7 + 2\\sqrt{10}$ &nbsp; <strong>E)</strong> $\\dfrac{7}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşlenik</div>
      <p class="ales-sol-step">Pay ve paydayı $(\\sqrt{5} + \\sqrt{2})$ ile çarp.</p>
      <p class="ales-sol-step">Pay: $(\\sqrt{5} + \\sqrt{2})^{2} = 5 + 2\\sqrt{10} + 2 = 7 + 2\\sqrt{10}$.</p>
      <p class="ales-sol-step">Payda: $(\\sqrt{5} - \\sqrt{2})(\\sqrt{5} + \\sqrt{2}) = 5 - 2 = 3$.</p>
      <p class="ales-sol-step">Sonuç: $\\dfrac{7 + 2\\sqrt{10}}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{7 + 2\\sqrt{10}}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Karma Sentez</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{3}{\\sqrt{5} + \\sqrt{2}}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> $\\sqrt{5} + \\sqrt{2}$ &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt{5} - \\sqrt{2}}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\sqrt{5} - \\sqrt{2}$</span> &nbsp; <strong>D)</strong> $3(\\sqrt{5} - \\sqrt{2})$ &nbsp; <strong>E)</strong> $\\sqrt{10}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşlenik: $\\sqrt{5} - \\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{3(\\sqrt{5} - \\sqrt{2})}{5 - 2} = \\dfrac{3(\\sqrt{5} - \\sqrt{2})}{3} = \\sqrt{5} - \\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\sqrt{5} - \\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Sentez Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{3} + \\sqrt{2}} - \\dfrac{1}{\\sqrt{3} - \\sqrt{2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $2\\sqrt{2}$ &nbsp; <strong>B)</strong> $0$ &nbsp; <strong>C)</strong> $-\\sqrt{2}$ &nbsp; <strong>D)</strong> <span class="key">$-2\\sqrt{2}$</span> &nbsp; <strong>E)</strong> $-2\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Her Birini Rasyonelleştir</div>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{3} + \\sqrt{2}} = \\dfrac{\\sqrt{3} - \\sqrt{2}}{3 - 2} = \\sqrt{3} - \\sqrt{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{3} - \\sqrt{2}} = \\dfrac{\\sqrt{3} + \\sqrt{2}}{3 - 2} = \\sqrt{3} + \\sqrt{2}$.</p>
      <p class="ales-sol-step">Fark: $(\\sqrt{3} - \\sqrt{2}) - (\\sqrt{3} + \\sqrt{2}) = -2\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-2\\sqrt{2}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Telescopik Toplam</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{\\sqrt{2} + \\sqrt{1}} + \\dfrac{1}{\\sqrt{3} + \\sqrt{2}} + \\dfrac{1}{\\sqrt{4} + \\sqrt{3}}$ toplamı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">1</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Her Terimi Rasyonelleştir</div>
      <p class="ales-sol-step"><strong>Genel:</strong> $\\dfrac{1}{\\sqrt{n+1} + \\sqrt{n}} = \\sqrt{n+1} - \\sqrt{n}$ (eşlenikle, payda $= 1$).</p>
      <p class="ales-sol-step">Terimler: $(\\sqrt{2} - \\sqrt{1}) + (\\sqrt{3} - \\sqrt{2}) + (\\sqrt{4} - \\sqrt{3})$.</p>
      <p class="ales-sol-step">İç terimler birbirini götürür (telescopik): $\\sqrt{4} - \\sqrt{1} = 2 - 1 = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Karma Rasyonelleştir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a = \\dfrac{1}{2 - \\sqrt{3}}$ ise $a^{2} - 4a$ değeri kaçtır?<br><br>
      <strong>A)</strong> -4 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">-1</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Önce Rasyonelleştir</div>
      <p class="ales-sol-step">$a = \\dfrac{1}{2 - \\sqrt{3}} \\cdot \\dfrac{2 + \\sqrt{3}}{2 + \\sqrt{3}} = \\dfrac{2 + \\sqrt{3}}{4 - 3} = 2 + \\sqrt{3}$.</p>
      <p class="ales-sol-step">$a - 2 = \\sqrt{3}$ ⟹ $(a-2)^{2} = 3 \\Rightarrow a^{2} - 4a + 4 = 3 \\Rightarrow a^{2} - 4a = -1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) -1</span></div>
    </div>
  </div>
</section>
`
};
