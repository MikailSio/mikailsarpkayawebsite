window.ALES_LESSON = {
n: 30,
title: "Çarpanlara Ayırma ve Özdeşlikler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>çarpanlara ayırma ve özdeşlikler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Ortak çarpan + gruplandırma → temel özdeşlikler ($(a \\pm b)^2$, $a^2 - b^2$, $a^3 \\pm b^3$) → rasyonel sadeleştirme. <strong>$(a+b)(a-b) = a^2 - b^2$ ile saniyelerle çözülür</strong>.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Ortak Çarpan + Gruplandırma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Ortak Çarpan + Gruplandırma</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Ortak Çarpan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $6x^2 + 9x$ ifadesinin çarpanlara ayrılmış hâli nedir?<br><br>
      <strong>A)</strong> 0 x(2x + 3) &nbsp; <strong>B)</strong> 2 x(2x + 3) &nbsp; <strong>C)</strong> <span class="key">3 x(2x + 3)</span> &nbsp; <strong>D)</strong> 6 x(2x + 3) &nbsp; <strong>E)</strong> 8 x(2x + 3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayısal OBEB: $\\gcd(6, 9) = 3$. Değişken ortak: $x$.</p>
      <p class="ales-sol-step">$6x^2 + 9x = 3x(2x + 3)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3 x(2x + 3)</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Ortak Parantez</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a(x - 2) + b(x - 2)$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x + 2)(a + b) &nbsp; <strong>B)</strong> <span class="key">(x − 2)(a + b)</span> &nbsp; <strong>C)</strong> (x − 2)(a − b) &nbsp; <strong>D)</strong> (x − 2)(ab) &nbsp; <strong>E)</strong> (x − 2)(a + b + 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortak parantez: $(x - 2)$.</p>
      <p class="ales-sol-step">$a(x - 2) + b(x - 2) = (x - 2)(a + b)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) (x − 2)(a + b)</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Gruplandırma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $ax + ay + bx + by$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> <span class="key">(x + y)(a + b)</span> &nbsp; <strong>B)</strong> (x − y)(a + b) &nbsp; <strong>C)</strong> (x + y)(a − b) &nbsp; <strong>D)</strong> (a + b)(ax + by) &nbsp; <strong>E)</strong> (xy)(a + b)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İkişerli Grupla</div>
      <p class="ales-sol-step">$(ax + ay) + (bx + by) = a(x + y) + b(x + y)$.</p>
      <p class="ales-sol-step">$= (x + y)(a + b)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) (x + y)(a + b)</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Çapraz Gruplandırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^3 - x^2 + 2x - 2$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x + 1)(x² + 2) &nbsp; <strong>B)</strong> (x − 1)(x² − 2) &nbsp; <strong>C)</strong> <span class="key">(x − 1)(x² + 2)</span> &nbsp; <strong>D)</strong> (x − 2)(x² + 1) &nbsp; <strong>E)</strong> (x + 2)(x² − 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x^3 - x^2) + (2x - 2) = x^2(x - 1) + 2(x - 1) = (x - 1)(x^2 + 2)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (x − 1)(x² + 2)</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İşaret Trick</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a(x - y) - b(y - x)$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x − y)(a − b) &nbsp; <strong>B)</strong> (x + y)(a + b) &nbsp; <strong>C)</strong> (y − x)(a + b) &nbsp; <strong>D)</strong> <span class="key">(x − y)(a + b)</span> &nbsp; <strong>E)</strong> (x − y)(ab)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İşaret Çevir</div>
      <p class="ales-sol-step">$y - x = -(x - y)$ ⟹ $-b(y - x) = -b \\cdot (-(x - y)) = b(x - y)$.</p>
      <p class="ales-sol-step">$a(x - y) + b(x - y) = (x - y)(a + b)$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> ALES'te $(x-y)$ ve $(y-x)$ karşılaşırsa biri eksi olur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (x − y)(a + b)</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Karma Gruplandırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - xy + xz - yz$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x + y)(x − z) &nbsp; <strong>B)</strong> <span class="key">(x − y)(x + z)</span> &nbsp; <strong>C)</strong> (x − y)(x − z) &nbsp; <strong>D)</strong> (x + y)(x + z) &nbsp; <strong>E)</strong> (x − z)(x + y)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x^2 - xy) + (xz - yz) = x(x - y) + z(x - y) = (x - y)(x + z)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) (x − y)(x + z)</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez Üç Terim</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $2ax + 3by + 2bx + 3ay$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (a − b)(2x + 3y) &nbsp; <strong>B)</strong> (a + b)(3x + 2y) &nbsp; <strong>C)</strong> (a + b)(2x − 3y) &nbsp; <strong>D)</strong> <span class="key">(a + b)(2x + 3y)</span> &nbsp; <strong>E)</strong> (a + b)(2x + 3y + 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yeniden Sırala</div>
      <p class="ales-sol-step">$x$ ve $y$'ye göre grupla: $(2ax + 2bx) + (3ay + 3by) = 2x(a + b) + 3y(a + b)$.</p>
      <p class="ales-sol-step">$= (a + b)(2x + 3y)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (a + b)(2x + 3y)</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Özdeşlikler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Özdeşlikler ((a±b)², a²−b², a³±b³)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Tam Kare</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(x + 5)^2$ ifadesini açın.<br><br>
      <strong>A)</strong> x² + 25 &nbsp; <strong>B)</strong> x² + 5x + 25 &nbsp; <strong>C)</strong> <span class="key">x² + 10x + 25</span> &nbsp; <strong>D)</strong> x² − 10x + 25 &nbsp; <strong>E)</strong> x² + 10x + 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$(a + b)^2 = a^2 + 2ab + b^2$.</p>
      <p class="ales-sol-step">$(x + 5)^2 = x^2 + 10x + 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) x² + 10x + 25</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İki Kare Farkı — Hızlı Hesap</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $103^2 - 97^2$ değeri kaçtır?<br><br>
      <strong>A)</strong> 1197 &nbsp; <strong>B)</strong> <span class="key">1200</span> &nbsp; <strong>C)</strong> 1203 &nbsp; <strong>D)</strong> 1205 &nbsp; <strong>E)</strong> 2400
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$a^2 - b^2 = (a - b)(a + b)$.</p>
      <p class="ales-sol-step">$103^2 - 97^2 = (103 - 97)(103 + 97) = 6 \\cdot 200 = 1200$.</p>
      <p class="ales-sol-step"><strong>Saniyede çöz:</strong> Tek tek karelemeden bu özdeşlikle uçar.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1200</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Ters Yön — Tanı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 16$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x − 4)² &nbsp; <strong>B)</strong> (x + 4)² &nbsp; <strong>C)</strong> (x − 8)(x + 2) &nbsp; <strong>D)</strong> <span class="key">(x − 4)(x + 4)</span> &nbsp; <strong>E)</strong> (x − 16)(x + 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x^2 - 4^2 = (x - 4)(x + 4)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (x − 4)(x + 4)</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Çıkarma + Kareye</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x + y = 7$ ve $xy = 10$ ise $x^2 + y^2$ kaçtır?<br><br>
      <strong>A)</strong> 20 &nbsp; <strong>B)</strong> 28 &nbsp; <strong>C)</strong> <span class="key">29</span> &nbsp; <strong>D)</strong> 32 &nbsp; <strong>E)</strong> 34
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özdeşlik</div>
      <p class="ales-sol-step">$(x + y)^2 = x^2 + 2xy + y^2 \\Rightarrow x^2 + y^2 = (x + y)^2 - 2xy$.</p>
      <p class="ales-sol-step">$= 49 - 20 = 29$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 29</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Küp Toplamı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^3 + 8$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (x + 2)(x² + 2x + 4) &nbsp; <strong>B)</strong> <span class="key">(x + 2)(x² − 2x + 4)</span> &nbsp; <strong>C)</strong> (x − 2)(x² + 2x + 4) &nbsp; <strong>D)</strong> (x + 2)³ &nbsp; <strong>E)</strong> (x + 2)(x² + 4)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$.</p>
      <p class="ales-sol-step">$x^3 + 2^3 = (x + 2)(x^2 - 2x + 4)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) (x + 2)(x² − 2x + 4)</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Küp Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $27x^3 - 1$ ifadesini çarpanlara ayırın.<br><br>
      <strong>A)</strong> (3x − 1)(9x² − 3x + 1) &nbsp; <strong>B)</strong> (3x + 1)(9x² − 3x + 1) &nbsp; <strong>C)</strong> <span class="key">(3x − 1)(9x² + 3x + 1)</span> &nbsp; <strong>D)</strong> (3x − 1)³ &nbsp; <strong>E)</strong> (3x − 1)(9x² + 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$. Burada $a = 3x,\\; b = 1$.</p>
      <p class="ales-sol-step">$(3x)^3 - 1^3 = (3x - 1)(9x^2 + 3x + 1)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (3x − 1)(9x² + 3x + 1)</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Çift Özdeşlik</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $x - y = 3$ ve $xy = 5$ ise $x^3 - y^3$ kaçtır?<br><br>
      <strong>A)</strong> 36 &nbsp; <strong>B)</strong> 58 &nbsp; <strong>C)</strong> 63 &nbsp; <strong>D)</strong> <span class="key">72</span> &nbsp; <strong>E)</strong> 81
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x - y)^3 = x^3 - 3x^2y + 3xy^2 - y^3 = (x^3 - y^3) - 3xy(x - y)$.</p>
      <p class="ales-sol-step">$x^3 - y^3 = (x - y)^3 + 3xy(x - y) = 27 + 3 \\cdot 5 \\cdot 3 = 27 + 45 = 72$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — $a^3 - b^3$ Özdeşliği</div>
      <p class="ales-sol-step">$x^3 - y^3 = (x - y)(x^2 + xy + y^2)$. $x^2 + y^2 = (x-y)^2 + 2xy = 9 + 10 = 19$.</p>
      <p class="ales-sol-step">$= 3 \\cdot (19 + 5) = 3 \\cdot 24 = 72$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 72</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Rasyonel İfade Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma Rasyonel İfade Sadeleştirme</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Pay Çarpanlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x^2 - 9}{x - 3}$ ifadesini sadeleştirin ($x \\neq 3$).<br><br>
      <strong>A)</strong> x − 3 &nbsp; <strong>B)</strong> <span class="key">x + 3</span> &nbsp; <strong>C)</strong> x² − 3 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> x(x + 3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x^2 - 9 = (x - 3)(x + 3)$.</p>
      <p class="ales-sol-step">$\\dfrac{(x - 3)(x + 3)}{x - 3} = x + 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) x + 3</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Pay ve Payda Çarpanlama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x^2 - 5x + 6}{x^2 - 4}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> (x + 3)/(x − 2) &nbsp; <strong>B)</strong> (x − 3)/(x − 2) &nbsp; <strong>C)</strong> (x + 3)/(x + 2) &nbsp; <strong>D)</strong> <span class="key">(x − 3)/(x + 2)</span> &nbsp; <strong>E)</strong> (x − 6)/(x − 4)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $(x - 2)(x - 3)$. Payda: $(x - 2)(x + 2)$.</p>
      <p class="ales-sol-step">$\\dfrac{(x - 2)(x - 3)}{(x - 2)(x + 2)} = \\dfrac{x - 3}{x + 2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (x − 3)/(x + 2)</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İşaret Çevirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4 - x^2}{x - 2}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> x + 2 &nbsp; <strong>B)</strong> x − 2 &nbsp; <strong>C)</strong> <span class="key">−(x + 2)</span> &nbsp; <strong>D)</strong> −(x − 2) &nbsp; <strong>E)</strong> 2 − x
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4 - x^2 = (2 - x)(2 + x) = -(x - 2)(x + 2)$.</p>
      <p class="ales-sol-step">$\\dfrac{-(x - 2)(x + 2)}{x - 2} = -(x + 2)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −(x + 2)</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Toplama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{x - 1} + \\dfrac{1}{x + 1}$ ifadesini tek kesir hâline getirin.<br><br>
      <strong>A)</strong> 1 x / (x² − 1) &nbsp; <strong>B)</strong> <span class="key">2 x / (x² − 1)</span> &nbsp; <strong>C)</strong> 3 x / (x² − 1) &nbsp; <strong>D)</strong> 5 x / (x² − 1) &nbsp; <strong>E)</strong> 7 x / (x² − 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ortak payda: $(x - 1)(x + 1) = x^2 - 1$.</p>
      <p class="ales-sol-step">$\\dfrac{(x + 1) + (x - 1)}{x^2 - 1} = \\dfrac{2x}{x^2 - 1}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 x / (x² − 1)</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Çarpma + Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x^2 - 1}{x + 2} \\cdot \\dfrac{x + 2}{x - 1}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> x − 1 &nbsp; <strong>B)</strong> <span class="key">x + 1</span> &nbsp; <strong>C)</strong> x² − 1 &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> (x + 1)(x + 2)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $(x - 1)(x + 1)(x + 2)$. Payda: $(x + 2)(x - 1)$.</p>
      <p class="ales-sol-step">Sadeleştir: $x + 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) x + 1</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sentez — Bölme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x^2 - 9}{x^2 + 2x - 3} \\div \\dfrac{x + 3}{x - 1}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> (x − 3)/(x − 1) &nbsp; <strong>B)</strong> (x + 3)/(x − 3) &nbsp; <strong>C)</strong> <span class="key">(x − 3)/(x + 3)</span> &nbsp; <strong>D)</strong> (x − 1)/(x + 3) &nbsp; <strong>E)</strong> (x + 3)/(x − 1)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bölme = Tersi ile çarp: $\\dfrac{x^2 - 9}{x^2 + 2x - 3} \\cdot \\dfrac{x - 1}{x + 3}$.</p>
      <p class="ales-sol-step">Çarpanlama: $x^2 - 9 = (x-3)(x+3)$, $\\;x^2 + 2x - 3 = (x+3)(x-1)$.</p>
      <p class="ales-sol-step">$\\dfrac{(x-3)(x+3)}{(x+3)(x-1)} \\cdot \\dfrac{x-1}{x+3} = \\dfrac{x - 3}{x + 3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (x − 3)/(x + 3)</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Karma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{a^2 - b^2}{a + b} + \\dfrac{a^3 + b^3}{a^2 - ab + b^2}$ ifadesini sadeleştirin.<br><br>
      <strong>A)</strong> 1 a &nbsp; <strong>B)</strong> <span class="key">2 a</span> &nbsp; <strong>C)</strong> 5 a &nbsp; <strong>D)</strong> 6 a &nbsp; <strong>E)</strong> 7 a
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Birinci: $\\dfrac{(a-b)(a+b)}{a+b} = a - b$.</p>
      <p class="ales-sol-step">İkinci: $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$ ⟹ $\\dfrac{(a+b)(a^2 - ab + b^2)}{a^2 - ab + b^2} = a + b$.</p>
      <p class="ales-sol-step">Toplam: $(a - b) + (a + b) = 2a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 a</span></div>
    </div>
  </div>
</section>
`
};
