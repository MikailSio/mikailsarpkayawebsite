window.ALES_LESSON = {
n: 54,
title: "Analitik Geometri — Doğru",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>analitik geometri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. İki nokta arası uzaklık ve orta nokta, eğim ve doğru denklemi ($y = mx + n$), <strong>paralel doğrularda $m_1 = m_2$</strong> ve <strong>dik doğrularda $m_1 \\cdot m_2 = -1$</strong> kuralları üzerine yoğunlaşıyoruz.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İki Nokta Arası Uzaklık + Orta Nokta
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İki Nokta Arası Uzaklık ve Orta Nokta</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Uzaklık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A(1, 2)$ ve $B(4, 6)$ noktaları arasındaki uzaklık kaç birimdir?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> $\\sqrt{7}$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <line x1="20" y1="160" x2="180" y2="160" stroke="currentColor" stroke-width="1"/>
        <line x1="40" y1="180" x2="40" y2="20" stroke="currentColor" stroke-width="1"/>
        <circle cx="60" cy="140" r="3" fill="#fbbf24"/>
        <circle cx="120" cy="60" r="3" fill="#fbbf24"/>
        <line x1="60" y1="140" x2="120" y2="60" stroke="#06b6d4" stroke-width="2"/>
        <line x1="60" y1="140" x2="120" y2="140" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3,2"/>
        <line x1="120" y1="140" x2="120" y2="60" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3,2"/>
        <text x="48" y="155" font-size="10" fill="currentColor" font-family="JetBrains Mono">A</text>
        <text x="125" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">B</text>
      </svg>
      <div class="ales-diagram-caption">Pisagor ile uzaklık</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Uzaklık Formülü</div>
      <p class="ales-sol-step">$|AB| = \\sqrt{(x_2 - x_1)^{2} + (y_2 - y_1)^{2}}$.</p>
      <p class="ales-sol-step">$|AB| = \\sqrt{(4-1)^{2} + (6-2)^{2}} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ br.</p>
      <p class="ales-sol-step">($3$-$4$-$5$ Pisagor üçlüsü)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Orta Nokta</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A(2, -3)$ ve $B(8, 5)$ noktalarının orta noktası nedir?<br><br>
      <strong>A)</strong> (3, 2) &nbsp; <strong>B)</strong> (10, 2) &nbsp; <strong>C)</strong> (6, 8) &nbsp; <strong>D)</strong> <span class="key">(5, 1)</span> &nbsp; <strong>E)</strong> (5, 2)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Orta nokta $\\left( \\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2} \\right)$.</p>
      <p class="ales-sol-step">$M = \\left( \\dfrac{2+8}{2}, \\dfrac{-3+5}{2} \\right) = (5, 1)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (5, 1)</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Negatif Koordinat</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A(-3, 4)$ ve $B(5, -2)$ noktaları arasındaki uzaklık kaç birimdir?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 14 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> <span class="key">10</span> &nbsp; <strong>E)</strong> $\\sqrt{28}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|AB| = \\sqrt{(5-(-3))^{2} + (-2-4)^{2}} = \\sqrt{64 + 36} = \\sqrt{100} = 10$ br.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 10</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bilinmeyenli Uzaklık</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A(1, 3)$ ve $B(x, 7)$ noktaları arasındaki uzaklık $5$ ise $x$ kaç olabilir?<br><br>
      <strong>A)</strong> 3 veya −3 &nbsp; <strong>B)</strong> 5 veya −5 &nbsp; <strong>C)</strong> 4 veya 2 &nbsp; <strong>D)</strong> 4 veya 0 &nbsp; <strong>E)</strong> <span class="key">4 veya −2</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sqrt{(x-1)^{2} + 16} = 5 \\Rightarrow (x-1)^{2} + 16 = 25 \\Rightarrow (x-1)^{2} = 9$.</p>
      <p class="ales-sol-step">$x - 1 = \\pm 3 \\Rightarrow x = 4$ veya $x = -2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4 veya −2</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Orta Noktadan Diğer Uç</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $AB$ doğru parçasının orta noktası $M(3, 4)$ ve uçlarından biri $A(1, 2)$ ise $B$ noktası nedir?<br><br>
      <strong>A)</strong> (2, 3) &nbsp; <strong>B)</strong> (4, 5) &nbsp; <strong>C)</strong> <span class="key">(5, 6)</span> &nbsp; <strong>D)</strong> (7, 8) &nbsp; <strong>E)</strong> (6, 5)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$M = \\left( \\dfrac{x_A + x_B}{2}, \\dfrac{y_A + y_B}{2} \\right) \\Rightarrow x_B = 2x_M - x_A$.</p>
      <p class="ales-sol-step">$x_B = 6 - 1 = 5$, $y_B = 8 - 2 = 6$.</p>
      <p class="ales-sol-step">$B(5, 6)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (5, 6)</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Üçgenin Ağırlık Merkezi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Köşeleri $A(2, 1)$, $B(4, 5)$, $C(6, 3)$ olan üçgenin ağırlık merkezi nedir?<br><br>
      <strong>A)</strong> (3, 4) &nbsp; <strong>B)</strong> <span class="key">(4, 3)</span> &nbsp; <strong>C)</strong> (5, 4) &nbsp; <strong>D)</strong> (4, 9) &nbsp; <strong>E)</strong> (12, 9)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">Ağırlık merkezi $G = \\left( \\dfrac{x_A + x_B + x_C}{3}, \\dfrac{y_A + y_B + y_C}{3} \\right)$.</p>
      <p class="ales-sol-step">$G = \\left( \\dfrac{2+4+6}{3}, \\dfrac{1+5+3}{3} \\right) = (4, 3)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) (4, 3)</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Eşit Uzaklık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $x$ ekseni üzerinde $A(2, 5)$ ve $B(6, 3)$ noktalarına eşit uzaklıkta bir nokta bulunmaktadır. Bu noktanın apsisi kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> <span class="key">2</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(x, 0)$ olsun. $|PA| = |PB|$ ⟹ $|PA|^{2} = |PB|^{2}$.</p>
      <p class="ales-sol-step">$(x-2)^{2} + 25 = (x-6)^{2} + 9$.</p>
      <p class="ales-sol-step">$x^{2} - 4x + 4 + 25 = x^{2} - 12x + 36 + 9 \\Rightarrow -4x + 29 = -12x + 45$.</p>
      <p class="ales-sol-step">$8x = 16 \\Rightarrow x = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 2</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Eğim ve Doğru Denklemi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Eğim ve Doğru Denklemi (y = mx + n)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki Noktadan Eğim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $A(1, 2)$ ve $B(4, 8)$ noktalarından geçen doğrunun eğimi kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">2</span> &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eğim $m = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\dfrac{8 - 2}{4 - 1} = \\dfrac{6}{3} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 2</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Eğim ve y-Kesimi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = 3x - 5$ doğrusunun eğimi ve $y$ eksenini kestiği nokta nedir?<br><br>
      <strong>A)</strong> m=−5, (0, 3) &nbsp; <strong>B)</strong> m=3, (0, 5) &nbsp; <strong>C)</strong> m=−3, (0, −5) &nbsp; <strong>D)</strong> <span class="key">m=3, (0, −5)</span> &nbsp; <strong>E)</strong> m=5, (0, −3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$y = mx + n$ formunda $m = 3$ (eğim), $n = -5$ ($y$ kesim).</p>
      <p class="ales-sol-step">Doğru $(0, -5)$ noktasından geçer.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) m=3, (0, −5)</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Genel Formdan Eğim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2x + 3y - 6 = 0$ doğrusunun eğimi kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>B)</strong> <span class="key">$-\\dfrac{2}{3}$</span> &nbsp; <strong>C)</strong> $\\dfrac{3}{2}$ &nbsp; <strong>D)</strong> $-\\dfrac{3}{2}$ &nbsp; <strong>E)</strong> 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$y$'yi yalnız bırak: $3y = -2x + 6 \\Rightarrow y = -\\dfrac{2}{3}x + 2$.</p>
      <p class="ales-sol-step">Eğim $m = -\\dfrac{2}{3}$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> $ax + by + c = 0$ ⟹ $m = -\\dfrac{a}{b}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-\\dfrac{2}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">İki Noktadan Doğru</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A(2, 3)$ ve $B(5, 9)$ noktalarından geçen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> y = 2x + 1 &nbsp; <strong>B)</strong> <span class="key">y = 2x − 1</span> &nbsp; <strong>C)</strong> y = 3x − 3 &nbsp; <strong>D)</strong> y = x + 1 &nbsp; <strong>E)</strong> y = −2x + 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eğim $m = \\dfrac{9 - 3}{5 - 2} = \\dfrac{6}{3} = 2$.</p>
      <p class="ales-sol-step">Nokta-eğim formu: $y - 3 = 2(x - 2) \\Rightarrow y = 2x - 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) y = 2x − 1</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Eksen Kesim Noktaları</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x$ eksenini $(4, 0)$, $y$ eksenini $(0, 6)$ noktasında kesen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> 2x + 3y = 12 &nbsp; <strong>B)</strong> 4x + 6y = 24 &nbsp; <strong>C)</strong> <span class="key">3x + 2y = 12</span> &nbsp; <strong>D)</strong> x + y = 10 &nbsp; <strong>E)</strong> 3x − 2y = 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eksenel Form</div>
      <p class="ales-sol-step">Eksenel form: $\\dfrac{x}{a} + \\dfrac{y}{b} = 1$ ⟹ $\\dfrac{x}{4} + \\dfrac{y}{6} = 1$.</p>
      <p class="ales-sol-step">İstendiği gibi: $6x + 4y = 24 \\Rightarrow 3x + 2y = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3x + 2y = 12</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Eğim Açısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir doğrunun $x$ ekseni ile yaptığı pozitif yönlü açı $45°$ ise eğimi kaçtır?<br><br>
      <strong>A)</strong> <span class="key">1</span> &nbsp; <strong>B)</strong> 0 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eğim $m = \\tan\\alpha$. $\\tan 45° = 1$.</p>
      <p class="ales-sol-step">$\\tan 30° = \\dfrac{1}{\\sqrt{3}}$, $\\tan 60° = \\sqrt{3}$ — sık karşılaşılan değerler.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Doğrultman</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $y = 2x + 1$ doğrusu üzerinde apsisi $3$ olan noktanın koordinatları ve orijine uzaklığı nedir?<br><br>
      <strong>A)</strong> (3, 5), $\\sqrt{34}$ &nbsp; <strong>B)</strong> (3, 6), $\\sqrt{45}$ &nbsp; <strong>C)</strong> <span class="key">(3, 7), $\\sqrt{58}$</span> &nbsp; <strong>D)</strong> (3, 7), $\\sqrt{50}$ &nbsp; <strong>E)</strong> (7, 3), $\\sqrt{58}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x = 3 \\Rightarrow y = 2 \\cdot 3 + 1 = 7 \\Rightarrow$ nokta $(3, 7)$.</p>
      <p class="ales-sol-step">Orijine uzaklık: $\\sqrt{3^{2} + 7^{2}} = \\sqrt{9 + 49} = \\sqrt{58}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (3, 7), $\\sqrt{58}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Paralel ve Dik Doğrular
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Paralel (m₁ = m₂) ve Dik (m₁·m₂ = −1)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Paralel Doğru</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = 3x + 7$ doğrusuna paralel ve $(2, 1)$ noktasından geçen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> y = 3x + 5 &nbsp; <strong>B)</strong> <span class="key">y = 3x − 5</span> &nbsp; <strong>C)</strong> y = −3x + 7 &nbsp; <strong>D)</strong> y = $-\\dfrac{1}{3}$x + 5 &nbsp; <strong>E)</strong> y = 3x + 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paralel ⟹ $m = 3$ (aynı eğim).</p>
      <p class="ales-sol-step">$(2, 1)$ noktasından: $y - 1 = 3(x - 2) \\Rightarrow y = 3x - 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) y = 3x − 5</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Dik Doğru</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = \\dfrac{1}{2}x + 3$ doğrusuna dik bir doğrunun eğimi kaçtır?<br><br>
      <strong>A)</strong> <span class="key">−2</span> &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> $-\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>E)</strong> −3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Dik doğrularda $m_1 \\cdot m_2 = -1$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{2} \\cdot m_2 = -1 \\Rightarrow m_2 = -2$.</p>
      <p class="ales-sol-step"><strong>Pratik:</strong> Eğimin negatif tersi $\\Rightarrow -\\dfrac{1}{m_1}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) −2</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Dik Doğru — Tam Denklem</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(0, 5)$ noktasından geçen ve $y = \\dfrac{1}{3}x + 2$ doğrusuna dik olan doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> y = 3x + 5 &nbsp; <strong>B)</strong> y = $-\\dfrac{1}{3}$x + 5 &nbsp; <strong>C)</strong> <span class="key">y = −3x + 5</span> &nbsp; <strong>D)</strong> y = $\\dfrac{1}{3}$x + 5 &nbsp; <strong>E)</strong> y = −3x + 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Dik eğim: $m = -3$.</p>
      <p class="ales-sol-step">$(0, 5)$ noktası ⟹ $y$ kesim $5$. Denklem: $y = -3x + 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) y = −3x + 5</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Paralel Genel Form</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2x + 3y = 6$ doğrusuna paralel ve $(1, 4)$ noktasından geçen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> 2x + 3y = 6 &nbsp; <strong>B)</strong> <span class="key">2x + 3y = 14</span> &nbsp; <strong>C)</strong> 3x − 2y = 14 &nbsp; <strong>D)</strong> 2x + 3y = 10 &nbsp; <strong>E)</strong> 3x + 2y = 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Paralel doğrunun denklemi $2x + 3y = k$ formundadır (sadece sabit değişir).</p>
      <p class="ales-sol-step">$(1, 4)$ koy: $2 + 12 = k \\Rightarrow k = 14$.</p>
      <p class="ales-sol-step">$2x + 3y = 14$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2x + 3y = 14</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Dik Doğru — Genel Form</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3x - 4y + 5 = 0$ doğrusuna dik ve $(2, 1)$ noktasından geçen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> 3x − 4y = 2 &nbsp; <strong>B)</strong> 3x + 4y = 10 &nbsp; <strong>C)</strong> 4x − 3y = 5 &nbsp; <strong>D)</strong> <span class="key">4x + 3y = 11</span> &nbsp; <strong>E)</strong> 4x + 3y = 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Verilen doğrunun eğimi: $m = -\\dfrac{3}{-4} = \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">Dik eğim: $m_2 = -\\dfrac{4}{3}$.</p>
      <p class="ales-sol-step">$y - 1 = -\\dfrac{4}{3}(x - 2) \\Rightarrow 3y - 3 = -4x + 8 \\Rightarrow 4x + 3y = 11$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 4x + 3y = 11</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Dik Doğru Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $A(2, 3)$ ve $B(5, 9)$ noktalarından geçen doğruya dik ve $A$ noktasından geçen doğrunun denklemi nedir?<br><br>
      <strong>A)</strong> y = 2x − 1 &nbsp; <strong>B)</strong> y = $\\dfrac{1}{2}$x + 2 &nbsp; <strong>C)</strong> <span class="key">y = $-\\dfrac{1}{2}$x + 4</span> &nbsp; <strong>D)</strong> y = $-\\dfrac{1}{2}$x + 3 &nbsp; <strong>E)</strong> y = −2x + 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$AB$ eğimi: $m_1 = \\dfrac{9 - 3}{5 - 2} = 2$.</p>
      <p class="ales-sol-step">Dik eğim: $m_2 = -\\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">$A(2, 3)$: $y - 3 = -\\dfrac{1}{2}(x - 2) \\Rightarrow y = -\\dfrac{1}{2}x + 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $y = -\\dfrac{1}{2}x + 4$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Üçgen Köşegeninde Diklik</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A(0, 0)$, $B(4, 0)$, $C(0, 3)$ üçgeninde $A$ köşesinden $BC$ kenarına çizilen yüksekliğin denklemi nedir?<br><br>
      <strong>A)</strong> y = $-\\dfrac{3}{4}$x &nbsp; <strong>B)</strong> y = $\\dfrac{3}{4}$x &nbsp; <strong>C)</strong> y = $-\\dfrac{4}{3}$x &nbsp; <strong>D)</strong> <span class="key">y = $\\dfrac{4}{3}$x</span> &nbsp; <strong>E)</strong> y = 4x − 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$BC$ eğimi: $m_{BC} = \\dfrac{3 - 0}{0 - 4} = -\\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">Yüksekliğin eğimi (dik): $m = \\dfrac{4}{3}$.</p>
      <p class="ales-sol-step">$A(0, 0)$ noktasından: $y = \\dfrac{4}{3}x$ veya $4x - 3y = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $y = \\dfrac{4}{3}x$</span></div>
    </div>
  </div>
</section>
`
};
