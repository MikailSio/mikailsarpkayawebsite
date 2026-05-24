window.ALES_LESSON = {
n: 17,
title: "Bilimsel Gösterim",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>bilimsel gösterim</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $a \\times 10^{n}$ formuna çevirme ($1 \\leq |a| < 10$), bilimsel gösterimde dört işlem ve uzaklık-kütle gibi gerçek-dünya soruları çözüm içinde gösteriliyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Bilimsel Forma Çevirme ve Okuma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">$a \\times 10^{n}$ Forma Çevirme ve Okuma</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Büyük Sayı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $45000$ sayısının bilimsel gösterimi nedir?<br><br>
      <strong>A)</strong> $45 \\times 10^{3}$ &nbsp; <strong>B)</strong> $4.5 \\times 10^{3}$ &nbsp; <strong>C)</strong> <span class="key">$4.5 \\times 10^{4}$</span> &nbsp; <strong>D)</strong> $4.5 \\times 10^{5}$ &nbsp; <strong>E)</strong> $0.45 \\times 10^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a \\times 10^{n}$ formunda $1 \\leq a < 10$ olmalı. Virgülü <em>sola</em> kaydırırsan üs <em>artar</em>.</p>
      <p class="ales-sol-step">$45000 = 4.5 \\times 10^{4}$ (virgül 4 basamak sola kaydı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $4.5 \\times 10^{4}$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Küçük Ondalık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $0.00072$ sayısının bilimsel gösterimi nedir?<br><br>
      <strong>A)</strong> $7.2 \\times 10^{-3}$ &nbsp; <strong>B)</strong> $72 \\times 10^{-5}$ &nbsp; <strong>C)</strong> $7.2 \\times 10^{4}$ &nbsp; <strong>D)</strong> $0.72 \\times 10^{-3}$ &nbsp; <strong>E)</strong> <span class="key">$7.2 \\times 10^{-4}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Virgülü <em>sağa</em> kaydırırsan üs <em>azalır</em> (negatif olur).</p>
      <p class="ales-sol-step">$0.00072 = 7.2 \\times 10^{-4}$ (virgül 4 basamak sağa kaydı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $7.2 \\times 10^{-4}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Bilimsel — Normal</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3.14 \\times 10^{5}$ sayısının normal gösterimi nedir?<br><br>
      <strong>A)</strong> <span class="key">314000</span> &nbsp; <strong>B)</strong> 314010 &nbsp; <strong>C)</strong> 361100 &nbsp; <strong>D)</strong> 298300 &nbsp; <strong>E)</strong> 313999
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$10^{5}$ ile çarp = virgülü 5 basamak <em>sağa</em> kaydır.</p>
      <p class="ales-sol-step">$3.14 \\to 31.4 \\to 314 \\to 3140 \\to 31400 \\to 314000$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 314000</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bilimsel Negatif Üs</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5.6 \\times 10^{-3}$ sayısının normal gösterimi nedir?<br><br>
      <strong>A)</strong> 0.0028 &nbsp; <strong>B)</strong> 0.1056 &nbsp; <strong>C)</strong> 1.0056 &nbsp; <strong>D)</strong> <span class="key">0.0056</span> &nbsp; <strong>E)</strong> 0.2056
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$10^{-3}$ ile çarp = virgülü 3 basamak <em>sola</em> kaydır.</p>
      <p class="ales-sol-step">$5.6 \\to 0.56 \\to 0.056 \\to 0.0056$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 0.0056</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Bilimsel Forma Düzenleme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $42.5 \\times 10^{6}$ ifadesini standart bilimsel gösterimle yazın.<br><br>
      <strong>A)</strong> $4.25 \\times 10^{6}$ &nbsp; <strong>B)</strong> $42.5 \\times 10^{7}$ &nbsp; <strong>C)</strong> $0.425 \\times 10^{8}$ &nbsp; <strong>D)</strong> <span class="key">$4.25 \\times 10^{7}$</span> &nbsp; <strong>E)</strong> $4.25 \\times 10^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Standart bilimsel gösterimde $1 \\leq a < 10$ olmalı; $42.5$ uygun değil.</p>
      <p class="ales-sol-step">$42.5 = 4.25 \\times 10^{1}$ ⟹ $42.5 \\times 10^{6} = 4.25 \\times 10^{1} \\times 10^{6} = 4.25 \\times 10^{7}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $4.25 \\times 10^{7}$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Bilimsel — Düzenleme (Küçük)</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $0.058 \\times 10^{-3}$ ifadesini standart bilimsel gösterimle yazın.<br><br>
      <strong>A)</strong> $5.8 \\times 10^{-3}$ &nbsp; <strong>B)</strong> <span class="key">$5.8 \\times 10^{-5}$</span> &nbsp; <strong>C)</strong> $5.8 \\times 10^{-4}$ &nbsp; <strong>D)</strong> $0.58 \\times 10^{-4}$ &nbsp; <strong>E)</strong> $58 \\times 10^{-6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$0.058 = 5.8 \\times 10^{-2}$ (virgülü 2 basamak sağa kaydır, üs azaltıyor).</p>
      <p class="ales-sol-step">$0.058 \\times 10^{-3} = 5.8 \\times 10^{-2} \\times 10^{-3} = 5.8 \\times 10^{-5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $5.8 \\times 10^{-5}$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sayı Tanıma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a = 5.4 \\times 10^{8}$ sayısı kaç basamaklıdır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Genel kural:</strong> $a \\times 10^{n}$ formundaki sayı (1 ≤ a < 10), $n+1$ basamaklıdır.</p>
      <p class="ales-sol-step">$5.4 \\times 10^{8} = 540000000$ ⟹ <strong>9 basamak</strong>.</p>
      <p class="ales-sol-step">Doğrula: $5$ rakamından sonra $8$ tane $0$ ⟹ toplam $9$ rakam.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Bilimsel Gösterimde İşlemler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Bilimsel Gösterimde Çarpma, Bölme, Toplama</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(2 \\times 10^{3}) \\cdot (3 \\times 10^{4})$ ifadesinin değeri nedir?<br><br>
      <strong>A)</strong> $6 \\times 10^{12}$ &nbsp; <strong>B)</strong> $5 \\times 10^{7}$ &nbsp; <strong>C)</strong> $6 \\times 10^{6}$ &nbsp; <strong>D)</strong> <span class="key">$6 \\times 10^{7}$</span> &nbsp; <strong>E)</strong> $6 \\times 10^{8}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar ve üsler ayrı: $(2 \\cdot 3) \\times 10^{3+4} = 6 \\times 10^{7}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6 \\times 10^{7}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Bölme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{8 \\times 10^{6}}{2 \\times 10^{2}}$ ifadesinin değeri nedir?<br><br>
      <strong>A)</strong> $4 \\times 10^{3}$ &nbsp; <strong>B)</strong> $4 \\times 10^{8}$ &nbsp; <strong>C)</strong> <span class="key">$4 \\times 10^{4}$</span> &nbsp; <strong>D)</strong> $6 \\times 10^{4}$ &nbsp; <strong>E)</strong> $4 \\times 10^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{8}{2} \\times 10^{6 - 2} = 4 \\times 10^{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $4 \\times 10^{4}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çarpma — Düzenleme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(5 \\times 10^{4}) \\cdot (4 \\times 10^{5})$ ifadesini standart bilimsel formda yazın.<br><br>
      <strong>A)</strong> $20 \\times 10^{9}$ &nbsp; <strong>B)</strong> $2 \\times 10^{9}$ &nbsp; <strong>C)</strong> $2 \\times 10^{20}$ &nbsp; <strong>D)</strong> <span class="key">$2 \\times 10^{10}$</span> &nbsp; <strong>E)</strong> $2 \\times 10^{11}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(5 \\cdot 4) \\times 10^{4+5} = 20 \\times 10^{9}$.</p>
      <p class="ales-sol-step">$20 = 2 \\times 10^{1}$ ⟹ $20 \\times 10^{9} = 2 \\times 10^{10}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $2 \\times 10^{10}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Negatif Üs Çarpımı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(3 \\times 10^{-4}) \\cdot (2 \\times 10^{6})$ ifadesinin değeri nedir?<br><br>
      <strong>A)</strong> $6 \\times 10^{-24}$ &nbsp; <strong>B)</strong> $6 \\times 10^{-2}$ &nbsp; <strong>C)</strong> $6 \\times 10^{10}$ &nbsp; <strong>D)</strong> <span class="key">$6 \\times 10^{2}$</span> &nbsp; <strong>E)</strong> $6 \\times 10^{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(3 \\cdot 2) \\times 10^{-4 + 6} = 6 \\times 10^{2} = 600$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6 \\times 10^{2}$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Toplama — Üsleri Eşitle</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4 \\times 10^{5} + 3 \\times 10^{4}$ ifadesini standart bilimsel formda yazın.<br><br>
      <strong>A)</strong> $7 \\times 10^{9}$ &nbsp; <strong>B)</strong> $7 \\times 10^{5}$ &nbsp; <strong>C)</strong> $4.03 \\times 10^{5}$ &nbsp; <strong>D)</strong> <span class="key">$4.3 \\times 10^{5}$</span> &nbsp; <strong>E)</strong> $4.3 \\times 10^{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Önce Üsleri Eşitle</div>
      <p class="ales-sol-step">Toplamadan önce üsler aynı olmalı. Küçüğü büyüğe çevir: $3 \\times 10^{4} = 0.3 \\times 10^{5}$.</p>
      <p class="ales-sol-step">$4 \\times 10^{5} + 0.3 \\times 10^{5} = 4.3 \\times 10^{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $4.3 \\times 10^{5}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Bölüm — Negatif Üs</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6 \\times 10^{-2}}{3 \\times 10^{-5}}$ ifadesinin değeri nedir?<br><br>
      <strong>A)</strong> $2 \\times 10^{-7}$ &nbsp; <strong>B)</strong> $2 \\times 10^{-3}$ &nbsp; <strong>C)</strong> <span class="key">$2 \\times 10^{3}$</span> &nbsp; <strong>D)</strong> $2 \\times 10^{7}$ &nbsp; <strong>E)</strong> $3 \\times 10^{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{6}{3} \\times 10^{-2 - (-5)} = 2 \\times 10^{3}$.</p>
      <p class="ales-sol-step">Sayısal: $2000$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2 \\times 10^{3}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karma Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{(4 \\times 10^{5}) \\cdot (9 \\times 10^{-3})}{6 \\times 10^{4}}$ ifadesinin değeri nedir?<br><br>
      <strong>A)</strong> $6 \\times 10^{2}$ &nbsp; <strong>B)</strong> $6 \\times 10^{-3}$ &nbsp; <strong>C)</strong> $0.6$ &nbsp; <strong>D)</strong> <span class="key">$6 \\times 10^{-2}$</span> &nbsp; <strong>E)</strong> $6 \\times 10^{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $(4 \\cdot 9) \\times 10^{5 - 3} = 36 \\times 10^{2}$.</p>
      <p class="ales-sol-step">Bölüm: $\\dfrac{36 \\times 10^{2}}{6 \\times 10^{4}} = 6 \\times 10^{2 - 4} = 6 \\times 10^{-2} = 0.06$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6 \\times 10^{-2}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Gerçek-Dünya Soruları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">ALES Gerçek-Dünya Soruları (Uzaklık, Kütle, Zaman)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Uzaklık (km'den m'ye)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Dünya'nın Güneş'e olan uzaklığı yaklaşık $1.5 \\times 10^{8}$ km'dir. Bu uzaklık metre cinsinden bilimsel gösterimle nedir?<br><br>
      <strong>A)</strong> $1.5 \\times 10^{8}$ m &nbsp; <strong>B)</strong> $1.5 \\times 10^{5}$ m &nbsp; <strong>C)</strong> $1.5 \\times 10^{10}$ m &nbsp; <strong>D)</strong> <span class="key">$1.5 \\times 10^{11}$ m</span> &nbsp; <strong>E)</strong> $1.5 \\times 10^{12}$ m
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1$ km $= 10^{3}$ m.</p>
      <p class="ales-sol-step">$1.5 \\times 10^{8} \\text{ km} = 1.5 \\times 10^{8} \\times 10^{3} \\text{ m} = 1.5 \\times 10^{11}$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $1.5 \\times 10^{11}$ m</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Atom Çapı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir atom yaklaşık $1 \\times 10^{-10}$ m çapındadır. Bu uzunluk nanometre ($1 \\text{ nm} = 10^{-9}$ m) cinsinden kaçtır?<br><br>
      <strong>A)</strong> $10$ nm &nbsp; <strong>B)</strong> $1$ nm &nbsp; <strong>C)</strong> $0.01$ nm &nbsp; <strong>D)</strong> $0.001$ nm &nbsp; <strong>E)</strong> <span class="key">$0.1$ nm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1 \\times 10^{-10}}{10^{-9}} = 1 \\times 10^{-10 - (-9)} = 1 \\times 10^{-1} = 0.1$ nm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $0.1$ nm</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Hız ve Zaman</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Işık saniyede $3 \\times 10^{8}$ m yol alır. Işığın bir dakikada aldığı yol bilimsel gösterimle kaç metredir?<br><br>
      <strong>A)</strong> $1.8 \\times 10^{8}$ m &nbsp; <strong>B)</strong> $1.8 \\times 10^{9}$ m &nbsp; <strong>C)</strong> <span class="key">$1.8 \\times 10^{10}$ m</span> &nbsp; <strong>D)</strong> $1.8 \\times 10^{11}$ m &nbsp; <strong>E)</strong> $1.8 \\times 10^{12}$ m
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1$ dakika $= 60$ s.</p>
      <p class="ales-sol-step">$60 \\cdot (3 \\times 10^{8}) = 180 \\times 10^{8} = 1.8 \\times 10^{2} \\times 10^{8} = 1.8 \\times 10^{10}$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $1.8 \\times 10^{10}$ m</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Kütle Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir bakteri yaklaşık $10^{-12}$ kg, bir karınca yaklaşık $10^{-6}$ kg ağırlığındadır. Karınca bakteriden kaç kat ağırdır?<br><br>
      <strong>A)</strong> $10^{2}$ &nbsp; <strong>B)</strong> $10^{-6}$ &nbsp; <strong>C)</strong> $10^{12}$ &nbsp; <strong>D)</strong> $10^{18}$ &nbsp; <strong>E)</strong> <span class="key">$10^{6}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{10^{-6}}{10^{-12}} = 10^{-6 - (-12)} = 10^{6}$.</p>
      <p class="ales-sol-step">Karınca, bakterinin $10^{6}$ (bir milyon) katı ağırdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $10^{6}$ kat</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Nüfus / Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ülkenin nüfusu $8 \\times 10^{7}$, yüzölçümü $4 \\times 10^{5}$ km$^{2}$'dir. Kilometre kare başına ortalama kaç kişi düşer?<br><br>
      <strong>A)</strong> $20$ &nbsp; <strong>B)</strong> $2000$ &nbsp; <strong>C)</strong> $400$ &nbsp; <strong>D)</strong> <span class="key">$200$</span> &nbsp; <strong>E)</strong> $250$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yoğunluk $= \\dfrac{\\text{nufus}}{\\text{alan}} = \\dfrac{8 \\times 10^{7}}{4 \\times 10^{5}} = 2 \\times 10^{2} = 200$ kişi/km$^{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $200$ kişi/km$^{2}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Yıldız Uzaklığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Işık hızı $3 \\times 10^{5}$ km/s'dir. Bir yıldızdan gelen ışık dünyaya $4 \\times 10^{8}$ saniyede ulaşıyorsa, yıldızın uzaklığı bilimsel gösterimle kaç km'dir?<br><br>
      <strong>A)</strong> $12 \\times 10^{13}$ km &nbsp; <strong>B)</strong> $1.2 \\times 10^{13}$ km &nbsp; <strong>C)</strong> <span class="key">$1.2 \\times 10^{14}$ km</span> &nbsp; <strong>D)</strong> $1.2 \\times 10^{40}$ km &nbsp; <strong>E)</strong> $1.2 \\times 10^{15}$ km
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yol = hız × zaman.</p>
      <p class="ales-sol-step">$d = (3 \\times 10^{5}) \\cdot (4 \\times 10^{8}) = 12 \\times 10^{13}$ km.</p>
      <p class="ales-sol-step">Standart formda: $12 = 1.2 \\times 10^{1}$ ⟹ $1.2 \\times 10^{14}$ km.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $1.2 \\times 10^{14}$ km</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Kütle Toplam</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir yıldızın kütlesi $2 \\times 10^{30}$ kg, bir gezegeninki ise $6 \\times 10^{24}$ kg'dir. Bu iki gök cisminin kütle oranı (yıldız/gezegen) nedir?<br><br>
      <strong>A)</strong> $3.33 \\times 10^{4}$ &nbsp; <strong>B)</strong> $3 \\times 10^{6}$ &nbsp; <strong>C)</strong> <span class="key">$\\approx 3.33 \\times 10^{5}$</span> &nbsp; <strong>D)</strong> $3.33 \\times 10^{-5}$ &nbsp; <strong>E)</strong> $\\dfrac{1}{3} \\times 10^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Oran $= \\dfrac{2 \\times 10^{30}}{6 \\times 10^{24}} = \\dfrac{2}{6} \\times 10^{30 - 24} = \\dfrac{1}{3} \\times 10^{6}$.</p>
      <p class="ales-sol-step">Standart formda: $\\dfrac{1}{3} = 0.333...$, kabaca $3.33 \\times 10^{-1}$ ⟹ $3.33 \\times 10^{-1} \\times 10^{6} = 3.33 \\times 10^{5}$.</p>
      <p class="ales-sol-step">Yıldız, gezegenden yaklaşık $3.33 \\times 10^{5}$ kat ağırdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\approx 3.33 \\times 10^{5}$ kat</span></div>
    </div>
  </div>
</section>
`
};
