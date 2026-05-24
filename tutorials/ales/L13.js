window.ALES_LESSON = {
n: 13,
title: "Üslü Sayılar — Denklemler ve Sıralama",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>üslü denklemler ve sıralama</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $a^{x} = a^{y} \\Rightarrow x = y$ tabanı eşitleme tekniği, taban EBOB ile $2^{60}$ vs $3^{40}$ tipi farklı tabanlı karşılaştırma, ve değişken üslü denklemler çözüm içinde gösteriliyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tabanı Eşitleme Denklemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tabanı Eşitleme: $a^{x} = a^{y} \\Rightarrow x = y$</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğrudan Üs Denklemi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{x} = 32$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$32 = 2^{5}$ ⟹ $2^{x} = 2^{5} \\Rightarrow x = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Tabanı Çevirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3^{x} = 81$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$81 = 3 \\cdot 3 \\cdot 3 \\cdot 3 = 3^{4}$ ⟹ $x = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Bileşik Tabanı Çevirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $4^{x} = 64$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tabanları $2$'ye Çevir</div>
      <p class="ales-sol-step">$4 = 2^{2}$ ve $64 = 2^{6}$ ⟹ $(2^{2})^{x} = 2^{6} \\Rightarrow 2^{2x} = 2^{6} \\Rightarrow 2x = 6 \\Rightarrow x = 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan</div>
      <p class="ales-sol-step">$4^{x} = 64 = 4^{3}$ (çünkü $4^{3} = 64$) ⟹ $x = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Negatif Cevap</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5^{x} = \\dfrac{1}{125}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> -2 &nbsp; <strong>B)</strong> 0 &nbsp; <strong>C)</strong> <span class="key">-3</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{125} = \\dfrac{1}{5^{3}} = 5^{-3}$ ⟹ $x = -3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) -3</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Doğrusal Denklemli Üs</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{3x-1} = 16$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{5}$ &nbsp; <strong>B)</strong> $\\dfrac{4}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{5}{3}$</span> &nbsp; <strong>D)</strong> $\\dfrac{5}{2}$ &nbsp; <strong>E)</strong> $\\dfrac{7}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$16 = 2^{4}$ ⟹ $2^{3x-1} = 2^{4} \\Rightarrow 3x - 1 = 4 \\Rightarrow x = \\dfrac{5}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{5}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">İki Yana Tabanı Çevirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $9^{x} = 27^{x-1}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Taban $3$</div>
      <p class="ales-sol-step">$9 = 3^{2}$, $\\;27 = 3^{3}$ ⟹ $(3^{2})^{x} = (3^{3})^{x-1} \\Rightarrow 3^{2x} = 3^{3x-3}$.</p>
      <p class="ales-sol-step">$2x = 3x - 3 \\Rightarrow x = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İkinci Dereceden Üs</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $2^{x^{2} - 4} = 1$ ise $x$ değerlerinin toplamı kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> <span class="key">0</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1 = 2^{0}$ ⟹ $x^{2} - 4 = 0 \\Rightarrow x^{2} = 4 \\Rightarrow x = \\pm 2$.</p>
      <p class="ales-sol-step">İki kök: $-2$ ve $+2$. Toplam $= 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 0</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Sıralama (Üs EBOB Tekniği)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Sıralama: $2^{60}$ vs $3^{40}$ — Üs EBOB Tekniği</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Aynı Tabanda Sıralama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{15}$, $\\;2^{20}$, $\\;2^{18}$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $2^{20} < 2^{18} < 2^{15}$ &nbsp; <strong>B)</strong> <span class="key">$2^{15} < 2^{18} < 2^{20}$</span> &nbsp; <strong>C)</strong> $2^{18} < 2^{15} < 2^{20}$ &nbsp; <strong>D)</strong> $2^{15} < 2^{20} < 2^{18}$ &nbsp; <strong>E)</strong> $2^{18} < 2^{20} < 2^{15}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Taban aynı ($2 > 1$) ⟹ üs büyüdükçe sayı büyür.</p>
      <p class="ales-sol-step">Üsler: $15 < 18 < 20$ ⟹ $2^{15} < 2^{18} < 2^{20}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2^{15} < 2^{18} < 2^{20}$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Aynı Tabanda Negatif Üs</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\left(\\dfrac{1}{2}\\right)^{3}$, $\\;\\left(\\dfrac{1}{2}\\right)^{5}$, $\\;\\left(\\dfrac{1}{2}\\right)^{7}$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $\\left(\\dfrac{1}{2}\\right)^{3} < \\left(\\dfrac{1}{2}\\right)^{5} < \\left(\\dfrac{1}{2}\\right)^{7}$ &nbsp; <strong>B)</strong> $\\left(\\dfrac{1}{2}\\right)^{5} < \\left(\\dfrac{1}{2}\\right)^{3} < \\left(\\dfrac{1}{2}\\right)^{7}$ &nbsp; <strong>C)</strong> <span class="key">$\\left(\\dfrac{1}{2}\\right)^{7} < \\left(\\dfrac{1}{2}\\right)^{5} < \\left(\\dfrac{1}{2}\\right)^{3}$</span> &nbsp; <strong>D)</strong> $\\left(\\dfrac{1}{2}\\right)^{3} < \\left(\\dfrac{1}{2}\\right)^{7} < \\left(\\dfrac{1}{2}\\right)^{5}$ &nbsp; <strong>E)</strong> $\\left(\\dfrac{1}{2}\\right)^{7} < \\left(\\dfrac{1}{2}\\right)^{3} < \\left(\\dfrac{1}{2}\\right)^{5}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Taban $0 < a < 1$ ise üs büyüdükçe sayı <em>küçülür</em>.</p>
      <p class="ales-sol-step">$\\left(\\dfrac{1}{2}\\right)^{7} < \\left(\\dfrac{1}{2}\\right)^{5} < \\left(\\dfrac{1}{2}\\right)^{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\left(\\dfrac{1}{2}\\right)^{7} < \\left(\\dfrac{1}{2}\\right)^{5} < \\left(\\dfrac{1}{2}\\right)^{3}$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üs EBOB — Klasik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 2^{60}$ ve $b = 3^{40}$ sayılarından hangisi daha büyüktür?<br><br>
      <strong>A)</strong> $a$ daha büyük &nbsp; <strong>B)</strong> <span class="key">$b$ daha büyük</span> &nbsp; <strong>C)</strong> Eşit &nbsp; <strong>D)</strong> Karşılaştırılamaz &nbsp; <strong>E)</strong> İkisi de negatif
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üs EBOB Tekniği</div>
      <p class="ales-sol-step">Üslerin EBOB'unu bul: $\\text{EBOB}(60, 40) = 20$.</p>
      <p class="ales-sol-step">Her ikisini $20$'lik üse böl: $a = 2^{60} = (2^{3})^{20} = 8^{20}$, $\\;b = 3^{40} = (3^{2})^{20} = 9^{20}$.</p>
      <p class="ales-sol-step">Aynı üs, farklı taban: $9 > 8$ ⟹ $9^{20} > 8^{20}$ ⟹ $b > a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $b = 3^{40}$ daha büyük</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üç Sayı Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 4^{30}$, $\\;b = 8^{20}$, $\\;c = 16^{15}$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $a < b < c$ &nbsp; <strong>B)</strong> $c < b < a$ &nbsp; <strong>C)</strong> $b < a < c$ &nbsp; <strong>D)</strong> <span class="key">$a = b = c$</span> &nbsp; <strong>E)</strong> $a < c < b$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Taban $2$</div>
      <p class="ales-sol-step">$a = (2^{2})^{30} = 2^{60}$.</p>
      <p class="ales-sol-step">$b = (2^{3})^{20} = 2^{60}$.</p>
      <p class="ales-sol-step">$c = (2^{4})^{15} = 2^{60}$.</p>
      <p class="ales-sol-step">Üçü de $2^{60}$ ⟹ <strong>eşit</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $a = b = c$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Üs EBOB — 3 Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 2^{30}$, $\\;b = 3^{20}$, $\\;c = 5^{12}$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> $a < b < c$ &nbsp; <strong>B)</strong> $b < c < a$ &nbsp; <strong>C)</strong> <span class="key">$c < a < b$</span> &nbsp; <strong>D)</strong> $a < c < b$ &nbsp; <strong>E)</strong> $c < b < a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üs EBOB</div>
      <p class="ales-sol-step">$\\text{EBOB}(30, 20, 12)$: $30 = 2 \\cdot 3 \\cdot 5$, $20 = 2^{2} \\cdot 5$, $12 = 2^{2} \\cdot 3$. EBOB $= 2$.</p>
      <p class="ales-sol-step">Hepsini $2$'lik üse böl: $a = (2^{15})^{2} = 32768^{2}$, $\\;b = (3^{10})^{2} = 59049^{2}$, $\\;c = (5^{6})^{2} = 15625^{2}$.</p>
      <p class="ales-sol-step">Tabanlar: $15625 < 32768 < 59049$ ⟹ $c < a < b$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $c < a < b$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Kesirli Tabanda Sıralama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = \\left(\\dfrac{1}{2}\\right)^{20}$, $\\;b = \\left(\\dfrac{1}{3}\\right)^{15}$ sayılarından hangisi daha büyüktür?<br><br>
      <strong>A)</strong> <span class="key">$a$ daha büyük</span> &nbsp; <strong>B)</strong> $b$ daha büyük &nbsp; <strong>C)</strong> Eşit &nbsp; <strong>D)</strong> Karşılaştırılamaz &nbsp; <strong>E)</strong> İkisi de $0$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üs EBOB</div>
      <p class="ales-sol-step">$\\text{EBOB}(20, 15) = 5$.</p>
      <p class="ales-sol-step">$a = \\left(\\dfrac{1}{2}\\right)^{20} = \\left(\\dfrac{1}{2^{4}}\\right)^{5} = \\left(\\dfrac{1}{16}\\right)^{5}$.</p>
      <p class="ales-sol-step">$b = \\left(\\dfrac{1}{3}\\right)^{15} = \\left(\\dfrac{1}{3^{3}}\\right)^{5} = \\left(\\dfrac{1}{27}\\right)^{5}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{16} > \\dfrac{1}{27}$ ⟹ $a > b$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $a$ daha büyük</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Karma Sıralama</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a = 2^{40}$, $\\;b = 3^{30}$, $\\;c = 6^{20}$ sayılarını küçükten büyüğe sıralayın.<br><br>
      <strong>A)</strong> <span class="key">$a < b < c$</span> &nbsp; <strong>B)</strong> $c < b < a$ &nbsp; <strong>C)</strong> $b < a < c$ &nbsp; <strong>D)</strong> $a < c < b$ &nbsp; <strong>E)</strong> $a = b = c$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üs EBOB $= 10$</div>
      <p class="ales-sol-step">$a = (2^{4})^{10} = 16^{10}$.</p>
      <p class="ales-sol-step">$b = (3^{3})^{10} = 27^{10}$.</p>
      <p class="ales-sol-step">$c = (6^{2})^{10} = 36^{10}$.</p>
      <p class="ales-sol-step">$16 < 27 < 36$ ⟹ $a < b < c$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $a < b < c$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karma Değişken Üs Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma Değişken Üs Problemleri</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Verilenden Üretme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{x} = a$ ise $2^{x+3}$ ifadesi $a$ cinsinden nedir?<br><br>
      <strong>A)</strong> $a + 3$ &nbsp; <strong>B)</strong> $3a$ &nbsp; <strong>C)</strong> $6a$ &nbsp; <strong>D)</strong> <span class="key">$8a$</span> &nbsp; <strong>E)</strong> $a^{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{x+3} = 2^{x} \\cdot 2^{3} = a \\cdot 8 = 8a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $8a$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Pay-Payda</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3^{x} = 5$ ise $3^{2x}$ kaçtır?<br><br>
      <strong>A)</strong> 27 &nbsp; <strong>B)</strong> 30 &nbsp; <strong>C)</strong> 15 &nbsp; <strong>D)</strong> 35 &nbsp; <strong>E)</strong> <span class="key">25</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3^{2x} = (3^{x})^{2} = 5^{2} = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 25</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki Bilinmeyenli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{x} = 3$ ve $2^{y} = 5$ ise $2^{x+y}$ kaçtır?<br><br>
      <strong>A)</strong> 13 &nbsp; <strong>B)</strong> <span class="key">15</span> &nbsp; <strong>C)</strong> 10 &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{x+y} = 2^{x} \\cdot 2^{y} = 3 \\cdot 5 = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 15</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Negatif Üs ile</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $5^{x} = 2$ ise $5^{-2x}$ kaçtır?<br><br>
      <strong>A)</strong> $-4$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{4}$</span> &nbsp; <strong>D)</strong> $4$ &nbsp; <strong>E)</strong> $-\\dfrac{1}{4}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5^{-2x} = (5^{x})^{-2} = 2^{-2} = \\dfrac{1}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Karma — Bölüm Çıkarma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{x} = a$ ise $\\dfrac{2^{x+1} + 2^{x-1}}{2^{x}}$ ifadesi kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> $\\dfrac{5}{4}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{5}{2}$</span> &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay = $2^{x} \\cdot 2 + 2^{x} \\cdot 2^{-1} = 2^{x}\\left(2 + \\dfrac{1}{2}\\right) = 2^{x} \\cdot \\dfrac{5}{2}$.</p>
      <p class="ales-sol-step">$\\dfrac{2^{x} \\cdot (5/2)}{2^{x}} = \\dfrac{5}{2}$.</p>
      <p class="ales-sol-step"><strong>Not:</strong> Cevap $a$'dan bağımsız çıktı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{5}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Çarpan Ayırma — Denklem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $2^{x+1} + 2^{x} = 24$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Çarpan</div>
      <p class="ales-sol-step">$2^{x}(2 + 1) = 3 \\cdot 2^{x} = 24 \\Rightarrow 2^{x} = 8 = 2^{3} \\Rightarrow x = 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrula</div>
      <p class="ales-sol-step">$x = 3$: $2^{4} + 2^{3} = 16 + 8 = 24$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Pay-Payda Karma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4^{x+1} - 4^{x}}{4^{x-1}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Çarpan</div>
      <p class="ales-sol-step">Pay: $4^{x}(4 - 1) = 3 \\cdot 4^{x}$.</p>
      <p class="ales-sol-step">$\\dfrac{3 \\cdot 4^{x}}{4^{x-1}} = 3 \\cdot 4^{x - (x-1)} = 3 \\cdot 4^{1} = 12$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Terim Terim</div>
      <p class="ales-sol-step">$\\dfrac{4^{x+1}}{4^{x-1}} - \\dfrac{4^{x}}{4^{x-1}} = 4^{2} - 4^{1} = 16 - 4 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>
</section>
`
};
