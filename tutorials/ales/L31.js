window.ALES_LESSON = {
n: 31,
title: "Fonksiyonlar — Tanım, Bileşke, Ters",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>fonksiyonlar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Tanım/değer kümesi + fonksiyon değerleri → bileşke fonksiyon ($f \\circ g \\neq g \\circ f$ tuzağı) → ters fonksiyon $f^{-1}$. ALES'te bileşke ve ters her sınavda çıkar.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tanım/Değer Kümesi + Fonksiyon Değerleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tanım/Değer Kümesi + Fonksiyon Değerleri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Fonksiyon Değeri</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 2x^2 - 5x + 3$ ise $f(2)$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$f(2) = 2(4) - 5(2) + 3 = 8 - 10 + 3 = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">f(a) = 0 Çözümü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 3x - 12$ ise $f(a) = 0$ olan $a$ değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> <span class="key">4</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3a - 12 = 0 \\Rightarrow a = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Tanım Kümesi — Kök</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\sqrt{x - 5}$ fonksiyonunun en geniş tanım kümesi nedir?<br><br>
      <strong>A)</strong> (−∞, 5] &nbsp; <strong>B)</strong> (5, ∞) &nbsp; <strong>C)</strong> <span class="key">[5, ∞)</span> &nbsp; <strong>D)</strong> ℝ \\ {5} &nbsp; <strong>E)</strong> [0, 5]
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karekök içi $\\geq 0$: $x - 5 \\geq 0 \\Rightarrow x \\geq 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) [5, ∞)</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Tanım Kümesi — Kesir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\dfrac{2x + 1}{x^2 - 4}$ fonksiyonunun tanım kümesi nedir?<br><br>
      <strong>A)</strong> ℝ &nbsp; <strong>B)</strong> ℝ \\ {2} &nbsp; <strong>C)</strong> ℝ \\ {−2} &nbsp; <strong>D)</strong> <span class="key">ℝ \\ {−2, 2}</span> &nbsp; <strong>E)</strong> ℝ \\ {−1/2}
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Payda $\\neq 0$: $x^2 - 4 \\neq 0 \\Rightarrow x \\neq \\pm 2$.</p>
      <p class="ales-sol-step">Tanım kümesi: $\\mathbb{R} \\setminus \\{-2, 2\\}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) ℝ \\ {−2, 2}</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Karma Tanım — Kök + Kesir</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\dfrac{\\sqrt{x - 1}}{x - 3}$ fonksiyonunun tanım kümesi nedir?<br><br>
      <strong>A)</strong> [1, ∞) &nbsp; <strong>B)</strong> (1, 3) ∪ (3, ∞) &nbsp; <strong>C)</strong> <span class="key">[1, 3) ∪ (3, ∞)</span> &nbsp; <strong>D)</strong> ℝ \\ {3} &nbsp; <strong>E)</strong> [3, ∞)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Şart</div>
      <p class="ales-sol-step"><strong>Şart 1:</strong> Karekök için $x - 1 \\geq 0 \\Rightarrow x \\geq 1$.</p>
      <p class="ales-sol-step"><strong>Şart 2:</strong> Payda için $x - 3 \\neq 0 \\Rightarrow x \\neq 3$.</p>
      <p class="ales-sol-step">Kesişim: $x \\geq 1$ ve $x \\neq 3$ ⟹ $[1, 3) \\cup (3, \\infty)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) [1, 3) ∪ (3, ∞)</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sözel Fonksiyon Değeri</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = ax + b$ fonksiyonu için $f(1) = 5$ ve $f(3) = 13$ ise $f(0)$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a + b = 5$ ve $3a + b = 13$.</p>
      <p class="ales-sol-step">Çıkar: $2a = 8 \\Rightarrow a = 4$. $b = 5 - 4 = 1$.</p>
      <p class="ales-sol-step">$f(0) = b = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez — f(x+1)</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x + 1) = 2x + 5$ ise $f(3)$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yerine Koyma</div>
      <p class="ales-sol-step">$x + 1 = 3 \\Rightarrow x = 2$.</p>
      <p class="ales-sol-step">$f(3) = 2(2) + 5 = 9$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Önce $f(x)$ Bul</div>
      <p class="ales-sol-step">$x + 1 = t \\Rightarrow x = t - 1$. $f(t) = 2(t - 1) + 5 = 2t + 3$. $f(3) = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Bileşke Fonksiyon
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Bileşke (f∘g)(x) — Sıra Önemli</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Basit Bileşke</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 2x + 1$ ve $g(x) = x^2$ ise $(f \\circ g)(x)$ nedir?<br><br>
      <strong>A)</strong> 1 x² + 1 &nbsp; <strong>B)</strong> <span class="key">2 x² + 1</span> &nbsp; <strong>C)</strong> 3 x² + 1 &nbsp; <strong>D)</strong> 6 x² + 1 &nbsp; <strong>E)</strong> 7 x² + 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(f \\circ g)(x) = f(g(x)) = f(x^2) = 2x^2 + 1$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> $g$ önce uygulanır, sonra $f$ — sağdaki içerideki.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 x² + 1</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Sıra Önemli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Önceki problem fonksiyonları için $(g \\circ f)(x)$ nedir?<br><br>
      <strong>A)</strong> 1 x² + 4x + 1 &nbsp; <strong>B)</strong> 2 x² + 4x + 1 &nbsp; <strong>C)</strong> <span class="key">4 x² + 4x + 1</span> &nbsp; <strong>D)</strong> 7 x² + 4x + 1 &nbsp; <strong>E)</strong> 9 x² + 4x + 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(g \\circ f)(x) = g(f(x)) = g(2x + 1) = (2x + 1)^2 = 4x^2 + 4x + 1$.</p>
      <p class="ales-sol-step"><strong>TUZAK:</strong> $(f \\circ g)(x) = 2x^2 + 1$ ile karşılaştır — birbirinin aynı değil!</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4 x² + 4x + 1</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Bileşke Değeri</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x + 3$ ve $g(x) = 2x - 1$ ise $(f \\circ g)(2)$ kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İçten Dışa</div>
      <p class="ales-sol-step">$g(2) = 2(2) - 1 = 3$.</p>
      <p class="ales-sol-step">$f(g(2)) = f(3) = 3 + 3 = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üç Bileşke</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x + 1$, $g(x) = 2x$, $h(x) = x^2$ ise $(f \\circ g \\circ h)(2)$ kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — En İçten Dışa</div>
      <p class="ales-sol-step">$h(2) = 4$. $g(h(2)) = g(4) = 8$. $f(g(h(2))) = f(8) = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">f Belli, g Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 2x - 1$ ve $(f \\circ g)(x) = 4x + 5$ ise $g(x)$ nedir?<br><br>
      <strong>A)</strong> 1 x + 3 &nbsp; <strong>B)</strong> <span class="key">2 x + 3</span> &nbsp; <strong>C)</strong> 3 x + 3 &nbsp; <strong>D)</strong> 6 x + 3 &nbsp; <strong>E)</strong> 7 x + 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$f(g(x)) = 2 g(x) - 1 = 4x + 5$.</p>
      <p class="ales-sol-step">$2 g(x) = 4x + 6 \\Rightarrow g(x) = 2x + 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 x + 3</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">g Belli, f Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $g(x) = x + 2$ ve $(f \\circ g)(x) = x^2 + 4x + 7$ ise $f(x)$ nedir?<br><br>
      <strong>A)</strong> x² + 7 &nbsp; <strong>B)</strong> x² − 3 &nbsp; <strong>C)</strong> <span class="key">x² + 3</span> &nbsp; <strong>D)</strong> x² + 4x + 7 &nbsp; <strong>E)</strong> x² − 4x + 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yerine Koyma</div>
      <p class="ales-sol-step">$f(g(x)) = f(x + 2) = x^2 + 4x + 7$.</p>
      <p class="ales-sol-step">$x + 2 = t \\Rightarrow x = t - 2$. $f(t) = (t - 2)^2 + 4(t - 2) + 7 = t^2 - 4t + 4 + 4t - 8 + 7 = t^2 + 3$.</p>
      <p class="ales-sol-step">$f(x) = x^2 + 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) x² + 3</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Tekrarlı Bileşke</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x + 2$ ise $(f \\circ f \\circ f)(5)$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> <span class="key">11</span> &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$f(5) = 7$. $f(f(5)) = f(7) = 9$. $f(f(f(5))) = f(9) = 11$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> $f^n(x) = x + 2n$. $f^3(5) = 5 + 6 = 11$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 11</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Ters Fonksiyon f^(-1)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Ters Fonksiyon f⁻¹</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Lineer Ters</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 3x - 6$ ise $f^{-1}(x)$ nedir?<br><br>
      <strong>A)</strong> 3x + 6 &nbsp; <strong>B)</strong> (x − 6)/3 &nbsp; <strong>C)</strong> <span class="key">(x + 6)/3</span> &nbsp; <strong>D)</strong> (x + 6) &nbsp; <strong>E)</strong> 1/(3x − 6)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — $y = f(x)$, $x$ ile $y$'yi yer değiştir</div>
      <p class="ales-sol-step">$y = 3x - 6 \\Rightarrow x = 3y - 6$ (yer değiştir) $\\Rightarrow y = \\dfrac{x + 6}{3}$.</p>
      <p class="ales-sol-step">$f^{-1}(x) = \\dfrac{x + 6}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (x + 6)/3</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Ters Değeri</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 2x + 7$ ise $f^{-1}(11)$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">2</span> &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tüyo</div>
      <p class="ales-sol-step"><strong>$f^{-1}(a) = b \\Leftrightarrow f(b) = a$.</strong></p>
      <p class="ales-sol-step">$f(b) = 11 \\Rightarrow 2b + 7 = 11 \\Rightarrow b = 2$.</p>
      <p class="ales-sol-step">$f^{-1}(11) = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Kesirli Ters</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\dfrac{2x + 3}{x - 1}$ ise $f^{-1}(x)$ nedir?<br><br>
      <strong>A)</strong> (x − 3)/(x + 2) &nbsp; <strong>B)</strong> (x − 1)/(2x + 3) &nbsp; <strong>C)</strong> (2x + 3)/(x + 1) &nbsp; <strong>D)</strong> <span class="key">(x + 3)/(x − 2)</span> &nbsp; <strong>E)</strong> (x + 2)/(x − 3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$y = \\dfrac{2x + 3}{x - 1} \\Rightarrow y(x - 1) = 2x + 3 \\Rightarrow xy - y = 2x + 3$.</p>
      <p class="ales-sol-step">$xy - 2x = y + 3 \\Rightarrow x(y - 2) = y + 3 \\Rightarrow x = \\dfrac{y + 3}{y - 2}$.</p>
      <p class="ales-sol-step">$f^{-1}(x) = \\dfrac{x + 3}{x - 2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (x + 3)/(x − 2)</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">f(f^-1) = x</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 4x - 9$ ise $f(f^{-1}(7))$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Özellik</div>
      <p class="ales-sol-step"><strong>Temel özellik:</strong> $f(f^{-1}(x)) = x$.</p>
      <p class="ales-sol-step">$f(f^{-1}(7)) = 7$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> Ters fonksiyonu hesaplamaya gerek yok.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Bileşke ile Ters</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 3x + 1$ ve $g(x) = x - 2$ ise $(f \\circ g)^{-1}(10)$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(f \\circ g)(x) = f(x - 2) = 3(x - 2) + 1 = 3x - 5$.</p>
      <p class="ales-sol-step">$(f \\circ g)^{-1}(10) = a \\Leftrightarrow 3a - 5 = 10 \\Rightarrow a = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sentez Parametre</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = ax + 2$ ve $f^{-1}(5) = 1$ ise $a$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$f^{-1}(5) = 1 \\Leftrightarrow f(1) = 5$.</p>
      <p class="ales-sol-step">$f(1) = a + 2 = 5 \\Rightarrow a = 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Sabit Nokta</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 2x - 6$ fonksiyonu için $f(x) = f^{-1}(x)$ olan $x$ değeri kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$f^{-1}(x) = \\dfrac{x + 6}{2}$.</p>
      <p class="ales-sol-step">$2x - 6 = \\dfrac{x + 6}{2} \\Rightarrow 4x - 12 = x + 6 \\Rightarrow 3x = 18 \\Rightarrow x = 6$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sabit Nokta Trick</div>
      <p class="ales-sol-step">Lineer $f$ için $f(x) = f^{-1}(x)$ ⟺ $f(x) = x$ (genelde). $2x - 6 = x \\Rightarrow x = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>
</section>
`
};
