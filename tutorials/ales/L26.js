window.ALES_LESSON = {
n: 26,
title: "İkinci Derece Denklemler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>ikinci derece denklemler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Çarpanlara ayırma → diskriminant formülü → Vieta sırasıyla, en hızlı yöntemi seçmeyi öğrenirken gerçek ALES tarzı sorulara bol pratik. <strong>Vieta + diskriminant ALES'in en çok sorduğu konu</strong> — bu derse extra önem ver.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Çarpanlara Ayırma ile Çözüm
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Çarpanlara Ayırma ile Çözüm</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Basit Çarpanlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 5x + 6 = 0$ denkleminin kökleri toplamı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpımı $6$, toplamı $5$ olan iki sayı: $2$ ve $3$.</p>
      <p class="ales-sol-step">$(x - 2)(x - 3) = 0 \\Rightarrow x = 2$ veya $x = 3$.</p>
      <p class="ales-sol-step">Toplam: $2 + 3 = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İki Terimli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 16 = 0$ denkleminin kökleri nelerdir?<br><br>
      <strong>A)</strong> $\\pm 2$ &nbsp; <strong>B)</strong> $\\pm 8$ &nbsp; <strong>C)</strong> <span class="key">$\\pm 4$</span> &nbsp; <strong>D)</strong> $\\pm 16$ &nbsp; <strong>E)</strong> Yalnız $4$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Kare Farkı</div>
      <p class="ales-sol-step">$x^2 - 16 = (x - 4)(x + 4) = 0$.</p>
      <p class="ales-sol-step">$x = 4$ veya $x = -4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\pm 4$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Ortak Çarpan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 7x = 0$ denkleminin kökleri çarpımı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortak çarpan $x$: $x(x - 7) = 0 \\Rightarrow x = 0$ veya $x = 7$.</p>
      <p class="ales-sol-step">Çarpım: $0 \\cdot 7 = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Karma Çarpanlama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2x^2 - 7x + 3 = 0$ denkleminin pozitif kökü kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpı/Bölü</div>
      <p class="ales-sol-step">$a = 2,\\; c = 3$. $a \\cdot c = 6$. Toplamı $-7$, çarpımı $6$ olan: $-1$ ve $-6$.</p>
      <p class="ales-sol-step">$2x^2 - 6x - x + 3 = 0 \\Rightarrow 2x(x - 3) - (x - 3) = 0 \\Rightarrow (2x - 1)(x - 3) = 0$.</p>
      <p class="ales-sol-step">$x = 1/2$ veya $x = 3$. Pozitif olduğu zaten ikisi de pozitif; ama "büyük kök" anlamında pozitif tam: $3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Tam Kare</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 6x + 9 = 0$ denkleminin kökleri kaçtır?<br><br>
      <strong>A)</strong> 0 (çift katlı) &nbsp; <strong>B)</strong> 2 (çift katlı) &nbsp; <strong>C)</strong> <span class="key">3 (çift katlı)</span> &nbsp; <strong>D)</strong> 6 (çift katlı) &nbsp; <strong>E)</strong> 8 (çift katlı)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x^2 - 6x + 9 = (x - 3)^2 = 0$.</p>
      <p class="ales-sol-step">Çift katlı kök: $x_1 = x_2 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3 (çift katlı)</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Düzenleme + Çarpanlama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 + 4x = 12$ denkleminin negatif kökü kaçtır?<br><br>
      <strong>A)</strong> $-2$ &nbsp; <strong>B)</strong> $-3$ &nbsp; <strong>C)</strong> $-4$ &nbsp; <strong>D)</strong> <span class="key">$-6$</span> &nbsp; <strong>E)</strong> $-12$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sıfıra eşitle: $x^2 + 4x - 12 = 0$.</p>
      <p class="ales-sol-step">Çarpımı $-12$, toplamı $4$ olan: $6$ ve $-2$. $(x + 6)(x - 2) = 0$.</p>
      <p class="ales-sol-step">$x = -6$ veya $x = 2$. Negatif kök: $-6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $-6$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Birden Fazla Yöntem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $3x^2 - 12 = 0$ denklemini çöz.<br><br>
      <strong>A)</strong> $\\pm 4$ &nbsp; <strong>B)</strong> <span class="key">$\\pm 2$</span> &nbsp; <strong>C)</strong> $\\pm 3$ &nbsp; <strong>D)</strong> $\\pm 6$ &nbsp; <strong>E)</strong> $\\pm 12$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sade Düzenleme</div>
      <p class="ales-sol-step">$3x^2 = 12 \\Rightarrow x^2 = 4 \\Rightarrow x = \\pm 2$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çarpanlama</div>
      <p class="ales-sol-step">$3(x^2 - 4) = 3(x - 2)(x + 2) = 0 \\Rightarrow x = \\pm 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\pm 2$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Diskriminant ve Formül
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Diskriminant Δ ve Formül x = (−b ± √Δ) / 2a</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Δ Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 4x + 1 = 0$ denkleminin diskriminantı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\Delta = b^2 - 4ac$. $a = 1,\\; b = -4,\\; c = 1$.</p>
      <p class="ales-sol-step">$\\Delta = (-4)^2 - 4(1)(1) = 16 - 4 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Kök Sayısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 + 2x + 5 = 0$ denkleminin reel kök sayısı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\Delta = 4 - 20 = -16 < 0$.</p>
      <p class="ales-sol-step">$\\Delta < 0$ ⟹ reel kök yok.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\Delta > 0$: 2 farklı reel · $\\Delta = 0$: 1 çift kat reel · $\\Delta < 0$: reel yok.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çift Kat Kök</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - kx + 16 = 0$ denkleminin <strong>çift katlı</strong> kökü olması için $k$ değerlerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çift katlı kök ⟺ $\\Delta = 0$.</p>
      <p class="ales-sol-step">$\\Delta = k^2 - 4(1)(16) = k^2 - 64 = 0 \\Rightarrow k = \\pm 8$.</p>
      <p class="ales-sol-step">Toplam: $8 + (-8) = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Formül Uygulama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2x^2 - 3x - 1 = 0$ denkleminin köklerini formülle bul.<br><br>
      <strong>A)</strong> $\\dfrac{-3 \\pm \\sqrt{17}}{4}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{3 \\pm \\sqrt{17}}{4}$</span> &nbsp; <strong>C)</strong> $\\dfrac{3 \\pm \\sqrt{1}}{4}$ &nbsp; <strong>D)</strong> $\\dfrac{3 \\pm \\sqrt{17}}{2}$ &nbsp; <strong>E)</strong> $\\dfrac{-3 \\pm \\sqrt{5}}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 2,\\; b = -3,\\; c = -1$. $\\Delta = 9 + 8 = 17$.</p>
      <p class="ales-sol-step">$x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} = \\dfrac{3 \\pm \\sqrt{17}}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{3 \\pm \\sqrt{17}}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Reel Kök Koşulu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 2x + m = 0$ denkleminin <strong>iki farklı reel</strong> kökünün olması için $m$ ne olmalıdır?<br><br>
      <strong>A)</strong> $m > 1$ &nbsp; <strong>B)</strong> <span class="key">$m < 1$</span> &nbsp; <strong>C)</strong> $m = 1$ &nbsp; <strong>D)</strong> $m \\geq 1$ &nbsp; <strong>E)</strong> $m \\neq 0$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İki farklı reel ⟺ $\\Delta > 0$.</p>
      <p class="ales-sol-step">$\\Delta = 4 - 4m > 0 \\Rightarrow 4m < 4 \\Rightarrow m < 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $m < 1$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Çoklu Yöntem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 + 7x + 12 = 0$ denkleminin köklerini bul.<br><br>
      <strong>A)</strong> $3, 4$ &nbsp; <strong>B)</strong> <span class="key">$-3, -4$</span> &nbsp; <strong>C)</strong> $-3, 4$ &nbsp; <strong>D)</strong> $3, -4$ &nbsp; <strong>E)</strong> $-2, -6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpanlama</div>
      <p class="ales-sol-step">Çarpımı $12$, toplamı $7$ olan: $3$ ve $4$.</p>
      <p class="ales-sol-step">$(x + 3)(x + 4) = 0 \\Rightarrow x = -3, -4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">$\\Delta = 49 - 48 = 1$. $x = \\dfrac{-7 \\pm 1}{2} = -3$ veya $-4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-3, -4$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Δ ile Parametre</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $(m - 1)x^2 + 2x + 1 = 0$ denkleminin <strong>tek</strong> reel kökü olması için $m$'nin alabileceği değerler nelerdir?<br><br>
      <strong>A)</strong> Yalnız $m = 1$ &nbsp; <strong>B)</strong> Yalnız $m = 2$ &nbsp; <strong>C)</strong> <span class="key">$m \\in \\{1, 2\\}$</span> &nbsp; <strong>D)</strong> $m = 0$ &nbsp; <strong>E)</strong> $m \\in \\{-1, 2\\}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Durum 1:</strong> $m - 1 = 0$ ise denklem $2x + 1 = 0$ olup birinci derece, tek kökü var ($x = -1/2$). $m = 1$ ✓.</p>
      <p class="ales-sol-step"><strong>Durum 2:</strong> $m \\neq 1$ ise ikinci derece, çift katlı kök için $\\Delta = 0$.</p>
      <p class="ales-sol-step">$\\Delta = 4 - 4(m - 1) = 4 - 4m + 4 = 8 - 4m = 0 \\Rightarrow m = 2$.</p>
      <p class="ales-sol-step">Çözüm: $m = 1$ veya $m = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $m \\in \\{1, 2\\}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Vieta Bağıntıları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Vieta: x₁ + x₂ = −b/a, x₁·x₂ = c/a</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Direkt Vieta</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 9x + 14 = 0$ denkleminin kökleri toplamı ve çarpımı kaçtır?<br><br>
      <strong>A)</strong> Toplam $-9$, Çarpım $14$ &nbsp; <strong>B)</strong> Toplam $9$, Çarpım $-14$ &nbsp; <strong>C)</strong> <span class="key">Toplam $9$, Çarpım $14$</span> &nbsp; <strong>D)</strong> Toplam $-9$, Çarpım $-14$ &nbsp; <strong>E)</strong> Toplam $14$, Çarpım $9$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x_1 + x_2 = -b/a = -(-9)/1 = 9$.</p>
      <p class="ales-sol-step">$x_1 \\cdot x_2 = c/a = 14/1 = 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Toplam $9$, Çarpım $14$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Kareler Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 6x + 4 = 0$ denkleminin kökleri $x_1, x_2$ ise $x_1^2 + x_2^2$ kaçtır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 27 &nbsp; <strong>C)</strong> <span class="key">28</span> &nbsp; <strong>D)</strong> 31 &nbsp; <strong>E)</strong> 56
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$x_1 + x_2 = 6$, $\\;x_1 x_2 = 4$.</p>
      <p class="ales-sol-step">$x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2 x_1 x_2 = 36 - 8 = 28$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 28</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">1/x Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2x^2 - 5x + 3 = 0$ denkleminin kökleri $x_1, x_2$ ise $\\dfrac{1}{x_1} + \\dfrac{1}{x_2}$ kaçtır?<br><br>
      <strong>A)</strong> 2 /3 &nbsp; <strong>B)</strong> 4 /3 &nbsp; <strong>C)</strong> <span class="key">5 /3</span> &nbsp; <strong>D)</strong> 6 /3 &nbsp; <strong>E)</strong> 10 /3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hızlı Vieta</div>
      <p class="ales-sol-step">$\\dfrac{1}{x_1} + \\dfrac{1}{x_2} = \\dfrac{x_1 + x_2}{x_1 x_2}$.</p>
      <p class="ales-sol-step">$x_1 + x_2 = 5/2$, $\\;x_1 x_2 = 3/2$.</p>
      <p class="ales-sol-step">Sonuç: $\\dfrac{5/2}{3/2} = \\dfrac{5}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5 /3</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Verilen Kök ile Parametre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 8x + k = 0$ denkleminin köklerinden biri $3$ ise diğer kökü ve $k$ kaçtır?<br><br>
      <strong>A)</strong> $x_2 = 5, k = 24$ &nbsp; <strong>B)</strong> <span class="key">$x_2 = 5, k = 15$</span> &nbsp; <strong>C)</strong> $x_2 = 8, k = 24$ &nbsp; <strong>D)</strong> $x_2 = 4, k = 12$ &nbsp; <strong>E)</strong> $x_2 = -5, k = -15$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Vieta: $x_1 + x_2 = 8$. $3 + x_2 = 8 \\Rightarrow x_2 = 5$.</p>
      <p class="ales-sol-step">$k = x_1 \\cdot x_2 = 3 \\cdot 5 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $x_2 = 5, k = 15$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Kökler Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 7x + 10 = 0$ denkleminin köklerinin farkı ($|x_1 - x_2|$) kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$(x_1 - x_2)^2 = (x_1 + x_2)^2 - 4 x_1 x_2 = 49 - 40 = 9$.</p>
      <p class="ales-sol-step">$|x_1 - x_2| = 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Direkt Çözüm</div>
      <p class="ales-sol-step">$(x - 2)(x - 5) = 0 \\Rightarrow x = 2, 5$. Fark: $5 - 2 = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kök Eşitliği Kurulumu</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Kökleri $4$ ve $-3$ olan ikinci derece denklem aşağıdakilerden hangisidir?<br><br>
      <strong>A)</strong> $x^2 + x - 12 = 0$ &nbsp; <strong>B)</strong> $x^2 - x + 12 = 0$ &nbsp; <strong>C)</strong> $x^2 - 7x + 12 = 0$ &nbsp; <strong>D)</strong> <span class="key">$x^2 - x - 12 = 0$</span> &nbsp; <strong>E)</strong> $x^2 + 7x + 12 = 0$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Vieta Tersine</div>
      <p class="ales-sol-step">Toplam: $4 + (-3) = 1$. Çarpım: $4 \\cdot (-3) = -12$.</p>
      <p class="ales-sol-step">Denklem: $x^2 - (\\text{toplam})x + (\\text{product}) = 0 \\Rightarrow x^2 - x - 12 = 0$.</p>
      <p class="ales-sol-step">Doğrula: $(x - 4)(x + 3) = x^2 - x - 12$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x^2 - x - 12 = 0$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Vieta + Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 4x + 1 = 0$ denkleminin kökleri $x_1, x_2$ ise $\\dfrac{x_1}{x_2} + \\dfrac{x_2}{x_1}$ kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 11 &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> <span class="key">14</span> &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{x_1}{x_2} + \\dfrac{x_2}{x_1} = \\dfrac{x_1^2 + x_2^2}{x_1 x_2}$.</p>
      <p class="ales-sol-step">$x_1 + x_2 = 4$, $\\;x_1 x_2 = 1$. $x_1^2 + x_2^2 = 16 - 2 = 14$.</p>
      <p class="ales-sol-step">Sonuç: $\\dfrac{14}{1} = 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 14</span></div>
    </div>
  </div>
</section>
`
};
