window.ALES_LESSON = {
n: 35,
title: "İşçi-İş Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>işçi-iş</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Altın taban: <em>"$x$ günde işi bitiren işçi, 1 günde işin $\\dfrac{1}{x}$'ini yapar."</em> Paralel çalışmada tempolar (1 günlük iş miktarları) toplanır: $\\dfrac{1}{a} + \\dfrac{1}{b} = \\dfrac{1}{T}$.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Birim İş 1/x Temel
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Birim İş 1/x ile Temel</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Günlük İş Miktarı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir işçi bir işi $12$ günde bitiriyor. Bu işçinin 1 günde yaptığı iş, işin kaçta kaçıdır?<br><br>
      <strong>A)</strong> 0 /12 &nbsp; <strong>B)</strong> <span class="key">1 /12</span> &nbsp; <strong>C)</strong> 4 /12 &nbsp; <strong>D)</strong> 5 /12 &nbsp; <strong>E)</strong> 6 /12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x$ günde biten iş için 1 günlük iş $= \\dfrac{1}{x}$. Burada $\\dfrac{1}{12}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1 /12</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Belli Sürede Yapılan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir işçi bir işi $20$ günde bitiriyor. Bu işçi $8$ günde işin kaçta kaçını yapar?<br><br>
      <strong>A)</strong> 1 /5 &nbsp; <strong>B)</strong> <span class="key">2 /5</span> &nbsp; <strong>C)</strong> 3 /5 &nbsp; <strong>D)</strong> 5 /5 &nbsp; <strong>E)</strong> 6 /5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">1 günde $\\dfrac{1}{20}$ ⟹ $8$ günde $\\dfrac{8}{20} = \\dfrac{2}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 /5</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Kalan İş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir işçi bir işi $15$ günde bitiriyor. Bu işçi $6$ gün çalıştıktan sonra işi bırakırsa geriye işin kaçta kaçı kalır?<br><br>
      <strong>A)</strong> 2 /5 &nbsp; <strong>B)</strong> <span class="key">3 /5</span> &nbsp; <strong>C)</strong> 4 /5 &nbsp; <strong>D)</strong> 6 /5 &nbsp; <strong>E)</strong> 8 /5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$6$ günde yapılan: $\\dfrac{6}{15} = \\dfrac{2}{5}$. Kalan: $1 - \\dfrac{2}{5} = \\dfrac{3}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3 /5</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İşin Belli Kısmı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir işçi $24$ günde bitirdiği bir işin $\\dfrac{3}{4}$'ünü kaç günde yapar?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> <span class="key">18</span> &nbsp; <strong>D)</strong> 19 &nbsp; <strong>E)</strong> 24
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Tüm iş için $24$ gün ⟹ $\\dfrac{3}{4}$ için $24 \\cdot \\dfrac{3}{4} = 18$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 18</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Çoklu İşçi · Eşit Verim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5$ işçi bir işi $20$ günde bitiriyor. Aynı verimdeki $4$ işçi aynı işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 20 &nbsp; <strong>B)</strong> <span class="key">25</span> &nbsp; <strong>C)</strong> 28 &nbsp; <strong>D)</strong> 30 &nbsp; <strong>E)</strong> 34
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ters Orantı</div>
      <p class="ales-sol-step">İşçi sayısı azalırsa süre artar (ters orantı). Toplam adam-gün $= 5 \\cdot 20 = 100$.</p>
      <p class="ales-sol-step">$4$ işçi için süre $= 100 / 4 = 25$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 25</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Bilinmeyen Süre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir işçi bir işin yarısını $7$ günde yapıyor. Aynı tempoyla işin tamamını kaç günde bitirir?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> <span class="key">14</span> &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yarısı $7$ gün ⟹ tamamı $7 \\cdot 2 = 14$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 14</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Adam-Gün-Saat</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $4$ işçi günde $6$ saat çalışarak bir işi $10$ günde bitiriyor. Aynı verimdeki $5$ işçi günde $8$ saat çalışarak aynı işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Adam·Gün·Saat Sabit</div>
      <p class="ales-sol-step">Toplam iş $= 4 \\cdot 6 \\cdot 10 = 240$ adam-saat.</p>
      <p class="ales-sol-step">Yeni süre $= \\dfrac{240}{5 \\cdot 8} = \\dfrac{240}{40} = 6$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Paralel Çalışma 1/a + 1/b = 1/T
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Paralel Çalışma (Tempolar Toplanır)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki İşçi Birlikte</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A bir işi tek başına $6$ günde, B aynı işi tek başına $12$ günde bitiriyor. Birlikte çalışırlarsa işi kaç günde bitirirler?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tempo Toplama</div>
      <p class="ales-sol-step">$\\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{2}{12} + \\dfrac{1}{12} = \\dfrac{3}{12} = \\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">1 günde işin $\\dfrac{1}{4}$'ü ⟹ tüm iş $4$ günde.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Formül</div>
      <p class="ales-sol-step">$T = \\dfrac{a \\cdot b}{a + b} = \\dfrac{6 \\cdot 12}{6 + 12} = \\dfrac{72}{18} = 4$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üç İşçi Birlikte</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A bir işi $4$ günde, B aynı işi $6$ günde, C aynı işi $12$ günde bitiriyor. Üçü birlikte çalışırsa işi kaç günde bitirirler?<br><br>
      <strong>A)</strong> <span class="key">2</span> &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{4} + \\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{3}{12} + \\dfrac{2}{12} + \\dfrac{1}{12} = \\dfrac{6}{12} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Birlikte günde işin yarısı ⟹ tüm iş $2$ günde.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Tek Başına Süre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A ile B birlikte bir işi $6$ günde bitiriyor. A tek başına $10$ günde bitirebiliyorsa B tek başına bu işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 12 &nbsp; <strong>C)</strong> <span class="key">15</span> &nbsp; <strong>D)</strong> 18 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{10} + \\dfrac{1}{B} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{B} = \\dfrac{1}{6} - \\dfrac{1}{10} = \\dfrac{5 - 3}{30} = \\dfrac{2}{30} = \\dfrac{1}{15}$.</p>
      <p class="ales-sol-step">B $= 15$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Kısmi İş — Kalan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A bir işi $10$ günde, B aynı işi $15$ günde bitiriyor. A ile B birlikte $4$ gün çalıştıktan sonra B işten ayrılırsa, A kalan işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 8 /3 gün (≈ 3 gün 8 saat) &nbsp; <strong>B)</strong> <span class="key">10 /3 gün (≈ 3 gün 8 saat)</span> &nbsp; <strong>C)</strong> 11 /3 gün (≈ 3 gün 8 saat) &nbsp; <strong>D)</strong> 12 /3 gün (≈ 3 gün 8 saat) &nbsp; <strong>E)</strong> 20 /3 gün (≈ 3 gün 8 saat)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Birlikte 1 günlük tempo: $\\dfrac{1}{10} + \\dfrac{1}{15} = \\dfrac{3+2}{30} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">$4$ günde yapılan: $\\dfrac{4}{6} = \\dfrac{2}{3}$. Kalan: $\\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">A tek başına 1 günde $\\dfrac{1}{10}$ yapıyor ⟹ $\\dfrac{1}{3}$ için süre $= \\dfrac{1/3}{1/10} = \\dfrac{10}{3}$ gün $\\approx 3{,}33$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10 /3 gün (≈ 3 gün 8 saat)</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Eşit Verimli İşçiler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $6$ işçi bir işi $15$ günde bitiriyor. Aynı işin $9$ günde bitirilmesi için kaç işçi daha eklenmelidir?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Adam·Gün Sabit</div>
      <p class="ales-sol-step">İş $= 6 \\cdot 15 = 90$ adam-gün.</p>
      <p class="ales-sol-step">$9$ günde bitirilmesi için işçi sayısı $= 90/9 = 10$.</p>
      <p class="ales-sol-step">Ek işçi $= 10 - 6 = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İki Eşit Tek Başına</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A ile B birlikte bir işi $8$ günde bitiriyor. A tek başına bu işi B'den $12$ gün daha kısa sürede bitirebildiğine göre B tek başına işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 19 &nbsp; <strong>B)</strong> 21 &nbsp; <strong>C)</strong> <span class="key">24</span> &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 33
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">B $= x$, A $= x - 12$ (A daha hızlı).</p>
      <p class="ales-sol-step">$\\dfrac{1}{x - 12} + \\dfrac{1}{x} = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">Pay eşitle: $\\dfrac{x + (x-12)}{x(x-12)} = \\dfrac{1}{8} \\Rightarrow \\dfrac{2x - 12}{x^{2} - 12x} = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">$8(2x - 12) = x^{2} - 12x \\Rightarrow 16x - 96 = x^{2} - 12x \\Rightarrow x^{2} - 28x + 96 = 0$.</p>
      <p class="ales-sol-step">$(x - 24)(x - 4) = 0 \\Rightarrow x = 24$ veya $x = 4$. $x > 12$ olmalı ⟹ $x = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Birlikte + Tek</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A ile B birlikte bir işi $12$ günde, A ile C birlikte aynı işi $15$ günde, B ile C birlikte aynı işi $20$ günde bitiriyor. Üçü birlikte çalışırsa işi kaç günde bitirirler?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 19 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tempo Toplama</div>
      <p class="ales-sol-step">$(A+B) + (A+C) + (B+C) = 2(A+B+C)$ tempolarda.</p>
      <p class="ales-sol-step">$\\dfrac{1}{12} + \\dfrac{1}{15} + \\dfrac{1}{20} = \\dfrac{5}{60} + \\dfrac{4}{60} + \\dfrac{3}{60} = \\dfrac{12}{60} = \\dfrac{1}{5}$.</p>
      <p class="ales-sol-step">$2(A+B+C) = \\dfrac{1}{5} \\Rightarrow (A+B+C) = \\dfrac{1}{10}$.</p>
      <p class="ales-sol-step">Üçü birlikte $10$ günde bitirir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Sıralı Çalışma + Farklı Verim
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Sıralı Çalışma + Farklı Verim</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Devir Teslim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A bir işin $\\dfrac{1}{3}$'ünü $4$ günde bitirip işi bırakıyor. Kalanı B tek başına $10$ günde bitiriyor. B tek başına tüm işi kaç günde bitirir?<br><br>
      <strong>A)</strong> <span class="key">15</span> &nbsp; <strong>B)</strong> 18 &nbsp; <strong>C)</strong> 20 &nbsp; <strong>D)</strong> 24 &nbsp; <strong>E)</strong> 30
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">B $\\dfrac{2}{3}$ işi $10$ günde yaptıysa, tüm işi $10 \\cdot \\dfrac{3}{2} = 15$ günde bitirir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 15</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Verim Oranı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A'nın bir günde yaptığı iş, B'nin bir günde yaptığı işin $3$ katıdır. B tek başına işi $24$ günde bitirebiliyorsa A tek başına aynı işi kaç günde bitirir?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">8</span> &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A, B'den $3$ kat hızlı ⟹ A'nın süresi B'nin $1/3$'ü ⟹ $24/3 = 8$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 8</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Erkek + Kadın İşçi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$ erkek ve $4$ kadın bir işi $10$ günde bitiriyor. Bir erkeğin günlük yaptığı iş, bir kadının $2$ katıysa, $1$ kadın bu işi tek başına kaç günde bitirir?<br><br>
      <strong>A)</strong> 50 &nbsp; <strong>B)</strong> 99 &nbsp; <strong>C)</strong> <span class="key">100</span> &nbsp; <strong>D)</strong> 120 &nbsp; <strong>E)</strong> 200
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eşdeğer Birim</div>
      <p class="ales-sol-step">$1$ erkek $= 2$ kadın. $3$ erkek $= 6$ kadın. Toplam $= 6 + 4 = 10$ kadın gücünde.</p>
      <p class="ales-sol-step">$10$ kadın gücü, $10$ günde bitiriyor ⟹ adam-gün $= 10 \\cdot 10 = 100$.</p>
      <p class="ales-sol-step">$1$ kadın için süre $= 100$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 100</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Önce A Sonra A+B</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A bir işi $20$ günde, B aynı işi $30$ günde bitiriyor. A tek başına $5$ gün çalıştıktan sonra B'ye katılırsa, kalan iş kaç günde biter?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A $5$ günde $\\dfrac{5}{20} = \\dfrac{1}{4}$ yapar. Kalan $= \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">A+B birlikte tempo $= \\dfrac{1}{20} + \\dfrac{1}{30} = \\dfrac{3+2}{60} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">$\\dfrac{3}{4}$ için süre $= \\dfrac{3/4}{1/12} = \\dfrac{3}{4} \\cdot 12 = 9$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">A Bırakır B Devam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A ile B birlikte bir işe başlıyor. A $4$ gün çalışıp ayrılıyor; B kalanı tek başına $6$ günde bitiriyor. A tek başına $12$ günde, B tek başına $24$ günde bitirebildiğine göre veriler tutarlı mıdır? Tutarsızsa, B kalanı kaç günde bitirir?<br><br>
      <strong>A)</strong> $6$ gün (tutarlı) &nbsp; <strong>B)</strong> $8$ gün &nbsp; <strong>C)</strong> $10$ gün &nbsp; <strong>D)</strong> <span class="key">$12$ gün (tutarsız)</span> &nbsp; <strong>E)</strong> $16$ gün
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tutarlılık</div>
      <p class="ales-sol-step">A+B birlikte 1 günde: $\\dfrac{1}{12} + \\dfrac{1}{24} = \\dfrac{2+1}{24} = \\dfrac{3}{24} = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">Birlikte $4$ günde: $\\dfrac{4}{8} = \\dfrac{1}{2}$ iş yapılır. Kalan $\\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">B kalanı $\\dfrac{1/2}{1/24} = 12$ günde bitirir; ancak soruda $6$ gün veriliyor — <strong>tutarsız</strong>.</p>
      <p class="ales-sol-step"><em>Düzeltilmiş:</em> Eğer B kalanı $12$ günde bitirseydi toplam süre $= 4 + 12 = 16$ gün olurdu.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $12$ gün (tutarsız)</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sırayla Devreye Giriş</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A bir işi $18$ günde, B aynı işi $9$ günde bitirebiliyor. A önce $3$ gün tek başına çalışıyor, sonra B katılıyor. İş toplam kaç günde biter?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">8</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A $3$ günde $\\dfrac{3}{18} = \\dfrac{1}{6}$ yapar. Kalan $\\dfrac{5}{6}$.</p>
      <p class="ales-sol-step">A+B birlikte: $\\dfrac{1}{18} + \\dfrac{1}{9} = \\dfrac{1+2}{18} = \\dfrac{3}{18} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">Birlikte $\\dfrac{5}{6}$ için süre $= \\dfrac{5/6}{1/6} = 5$ gün.</p>
      <p class="ales-sol-step">Toplam $= 3 + 5 = 8$ gün.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Adam-Saat + Verim Değişimi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $6$ işçi bir işin $\\dfrac{1}{3}$'ünü $8$ günde bitirebildiğine göre, kalanın $4$ günde bitirilmesi için kaç işçinin daha katılması gerekir?<br><br>
      <strong>A)</strong> <span class="key">18</span> &nbsp; <strong>B)</strong> 19 &nbsp; <strong>C)</strong> 23 &nbsp; <strong>D)</strong> 27 &nbsp; <strong>E)</strong> 36
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tempo Hesabı</div>
      <p class="ales-sol-step">$6$ işçi $8$ günde $\\dfrac{1}{3}$ iş ⟹ $1$ işçi 1 günde işin $\\dfrac{1/3}{6 \\cdot 8} = \\dfrac{1}{144}$'ünü yapar.</p>
      <p class="ales-sol-step">Kalan $\\dfrac{2}{3}$'i $4$ günde için gerekli işçi sayısı: $\\dfrac{2/3}{4 \\cdot \\dfrac{1}{144}} = \\dfrac{2/3}{\\dfrac{4}{144}} = \\dfrac{2/3 \\cdot 144}{4} = \\dfrac{96}{4} = 24$ işçi.</p>
      <p class="ales-sol-step">Eklenecek $= 24 - 6 = 18$ işçi.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 18</span></div>
    </div>
  </div>
</section>
`
};
