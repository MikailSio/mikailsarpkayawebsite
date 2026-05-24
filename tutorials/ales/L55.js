window.ALES_LESSON = {
n: 55,
title: "Analitik Geometri — Parabol",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>parabol</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $y = ax^{2} + bx + c$ grafiği ve tepe noktası ($x_T = -\\dfrac{b}{2a}$), eksen kesimleri (kökler — diskriminant) ve simetri ekseni, son olarak min/max optimizasyon problemleri (kar, alan).</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Parabol Grafiği ve Tepe Noktası
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Parabol Grafiği ve Tepe Noktası</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Açıklık Yönü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = -2x^{2} + 3x - 1$ parabolünün açıklığı yukarı mı aşağı mıdır?<br><br>
      <strong>A)</strong> Yukarı &nbsp; <strong>B)</strong> <span class="key">Aşağı</span> &nbsp; <strong>C)</strong> Sağa &nbsp; <strong>D)</strong> Sola &nbsp; <strong>E)</strong> Belirsiz
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 160" style="width:100%;max-width:280px">
        <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" stroke-width="1"/>
        <line x1="100" y1="20" x2="100" y2="140" stroke="currentColor" stroke-width="1"/>
        <path d="M 30,140 Q 100,20 170,140" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      </svg>
      <div class="ales-diagram-caption">a&lt;0 ⟹ açıklık aşağı</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a > 0$ ⟹ açıklık yukarı; $a < 0$ ⟹ açıklık aşağı.</p>
      <p class="ales-sol-step">$a = -2 < 0$ ⟹ aşağı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Aşağı</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Tepe Noktası</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} - 4x + 7$ parabolünün tepe noktası nedir?<br><br>
      <strong>A)</strong> (4, 7) &nbsp; <strong>B)</strong> (−2, 19) &nbsp; <strong>C)</strong> (2, 7) &nbsp; <strong>D)</strong> <span class="key">(2, 3)</span> &nbsp; <strong>E)</strong> (−2, 3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x_T = -\\dfrac{b}{2a} = -\\dfrac{-4}{2} = 2$.</p>
      <p class="ales-sol-step">$y_T = 2^{2} - 4 \\cdot 2 + 7 = 4 - 8 + 7 = 3$.</p>
      <p class="ales-sol-step">Tepe: $T(2, 3)$. Açıklık yukarı ⟹ minimum nokta.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) (2, 3)</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">y-Kesimi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = 2x^{2} - 5x + 3$ parabolünün $y$ eksenini kestiği noktanın ordinatı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> <span class="key">3</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$y$ ekseni: $x = 0 \\Rightarrow y = c = 3$.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> $y$ kesim noktasının ordinatı $= c$ (sabit terim).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 3</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Tam Kare Form</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = (x - 3)^{2} + 5$ parabolünün tepe noktası nedir?<br><br>
      <strong>A)</strong> (−3, 5) &nbsp; <strong>B)</strong> (3, −5) &nbsp; <strong>C)</strong> <span class="key">(3, 5)</span> &nbsp; <strong>D)</strong> (5, 3) &nbsp; <strong>E)</strong> (−3, −5)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tepe Form</div>
      <p class="ales-sol-step">$y = a(x - h)^{2} + k$ formunda tepe $(h, k)$'dir.</p>
      <p class="ales-sol-step">$h = 3$, $k = 5$ ⟹ tepe $(3, 5)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (3, 5)</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Min/Max Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = -x^{2} + 6x - 8$ fonksiyonunun maksimum değeri kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">1</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = -1 < 0$ ⟹ açıklık aşağı, tepe maksimumdur.</p>
      <p class="ales-sol-step">$x_T = -\\dfrac{6}{-2} = 3$.</p>
      <p class="ales-sol-step">$y_T = -9 + 18 - 8 = 1$. Maksimum değer $= 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Diskriminant Formülü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} - 2x - 3$ parabolünün tepe noktasının ordinatını $-\\dfrac{\\Delta}{4a}$ formülü ile bulun.<br><br>
      <strong>A)</strong> $-3$ &nbsp; <strong>B)</strong> $-2$ &nbsp; <strong>C)</strong> $4$ &nbsp; <strong>D)</strong> <span class="key">$-4$</span> &nbsp; <strong>E)</strong> $-5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\Delta = b^{2} - 4ac = 4 + 12 = 16$.</p>
      <p class="ales-sol-step">$y_T = -\\dfrac{\\Delta}{4a} = -\\dfrac{16}{4} = -4$.</p>
      <p class="ales-sol-step">Doğrula: $x_T = 1$, $y_T = 1 - 2 - 3 = -4$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) −4</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Tepe Verilmiş — Bilinmeyen Bul</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $y = ax^{2} + 4x + c$ parabolünün tepe noktası $T(-2, -1)$ ise $a + c$ kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> <span class="key">4</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x_T = -\\dfrac{4}{2a} = -2 \\Rightarrow a = 1$.</p>
      <p class="ales-sol-step">$T(-2, -1)$ paraboldedir: $-1 = (-2)^{2} + 4 \\cdot (-2) + c = 4 - 8 + c = c - 4$.</p>
      <p class="ales-sol-step">$c = 3$. $a + c = 1 + 3 = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 4</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Eksen Kesimleri ve Simetri Ekseni
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Eksen Kesimleri ve Simetri Ekseni</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">x-Kesimleri (Kökler)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} - 5x + 6$ parabolü $x$ eksenini hangi noktalarda keser?<br><br>
      <strong>A)</strong> (−2, 0) ve (−3, 0) &nbsp; <strong>B)</strong> (1, 0) ve (6, 0) &nbsp; <strong>C)</strong> <span class="key">(2, 0) ve (3, 0)</span> &nbsp; <strong>D)</strong> (5, 0) ve (6, 0) &nbsp; <strong>E)</strong> (0, 2) ve (0, 3)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x$ ekseni: $y = 0 \\Rightarrow x^{2} - 5x + 6 = 0$.</p>
      <p class="ales-sol-step">$(x - 2)(x - 3) = 0 \\Rightarrow x = 2$ veya $x = 3$.</p>
      <p class="ales-sol-step">Kesim noktaları: $(2, 0)$ ve $(3, 0)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) (2, 0) ve (3, 0)</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Diskriminant ile Kök Sayısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} + 2x + 5$ parabolü $x$ eksenini kaç noktada keser?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Diskriminant</div>
      <p class="ales-sol-step">$\\Delta = 2^{2} - 4 \\cdot 1 \\cdot 5 = 4 - 20 = -16 < 0$.</p>
      <p class="ales-sol-step">$\\Delta < 0$ ⟹ $x$ eksenini kesmez ($0$ nokta).</p>
      <p class="ales-sol-step"><strong>Özet:</strong> $\\Delta > 0$: 2 kesim; $\\Delta = 0$: 1 (teğet); $\\Delta < 0$: 0.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Simetri Ekseni</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = 2x^{2} - 8x + 1$ parabolünün simetri ekseni nedir?<br><br>
      <strong>A)</strong> x = 4 &nbsp; <strong>B)</strong> x = −2 &nbsp; <strong>C)</strong> x = 1 &nbsp; <strong>D)</strong> <span class="key">x = 2</span> &nbsp; <strong>E)</strong> x = −4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Simetri ekseni $x = -\\dfrac{b}{2a} = -\\dfrac{-8}{4} = 2$.</p>
      <p class="ales-sol-step">Yani $x = 2$ doğrusudur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) x = 2</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Köklerin Toplamı/Çarpımı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^{2} - 7x + 12 = 0$ denkleminin kökleri $x_1$ ve $x_2$ ise $x_1 + x_2$ ve $x_1 \\cdot x_2$ kaçtır?<br><br>
      <strong>A)</strong> Toplam=−7, Çarpım=12 &nbsp; <strong>B)</strong> <span class="key">Toplam=7, Çarpım=12</span> &nbsp; <strong>C)</strong> Toplam=7, Çarpım=−12 &nbsp; <strong>D)</strong> Toplam=12, Çarpım=7 &nbsp; <strong>E)</strong> Toplam=−7, Çarpım=−12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Vieta</div>
      <p class="ales-sol-step">$x_1 + x_2 = -\\dfrac{b}{a} = 7$.</p>
      <p class="ales-sol-step">$x_1 \\cdot x_2 = \\dfrac{c}{a} = 12$.</p>
      <p class="ales-sol-step">Kökler: $3$ ve $4$ ($3 + 4 = 7$, $3 \\cdot 4 = 12$ ✓).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Toplam=7, Çarpım=12</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Kökler Verilmiş — Denklem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x$ eksenini $-2$ ve $5$ noktalarında kesen, $y$ eksenini $-10$ noktasında kesen parabolün denklemi nedir?<br><br>
      <strong>A)</strong> y = x² + 3x − 10 &nbsp; <strong>B)</strong> y = x² − 3x + 10 &nbsp; <strong>C)</strong> <span class="key">y = x² − 3x − 10</span> &nbsp; <strong>D)</strong> y = x² + 3x + 10 &nbsp; <strong>E)</strong> y = −x² − 3x − 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kökler $-2, 5$ ⟹ $y = a(x + 2)(x - 5)$.</p>
      <p class="ales-sol-step">$x = 0$, $y = -10$: $-10 = a \\cdot 2 \\cdot (-5) = -10a \\Rightarrow a = 1$.</p>
      <p class="ales-sol-step">$y = (x + 2)(x - 5) = x^{2} - 3x - 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) y = x² − 3x − 10</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Simetri ve Kökler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} - 6x + 5$ parabolünün köklerinden biri $1$ ise diğeri kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> <span class="key">5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Simetri</div>
      <p class="ales-sol-step">Simetri ekseni $x = -\\dfrac{-6}{2} = 3$. Kökler simetrik konumdadır.</p>
      <p class="ales-sol-step">Bir kök $1$, diğer kök simetrik nokta $\\Rightarrow 2 \\cdot 3 - 1 = 5$.</p>
      <p class="ales-sol-step">Doğrula: $5^{2} - 30 + 5 = 0$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karışık — İki Bilinmeyen</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $y = x^{2} + bx + c$ parabolü $x$ eksenini $-1$ ve $4$ noktalarında kesiyor. $b + c$ kaçtır?<br><br>
      <strong>A)</strong> $-1$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$-7$</span> &nbsp; <strong>D)</strong> $7$ &nbsp; <strong>E)</strong> $-3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Vieta</div>
      <p class="ales-sol-step">Kökler toplamı: $-1 + 4 = 3 = -b \\Rightarrow b = -3$.</p>
      <p class="ales-sol-step">Kökler çarpımı: $-1 \\cdot 4 = -4 = c$.</p>
      <p class="ales-sol-step">$b + c = -3 + (-4) = -7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −7</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Min/Max Optimizasyon
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Min/Max Optimizasyon (Kar / Alan)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Maksimum Kar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir firmanın kar fonksiyonu $K(x) = -x^{2} + 20x - 36$ TL'dir ($x$: üretim adedi). Maksimum kar kaç TL'dir?<br><br>
      <strong>A)</strong> 65 TL &nbsp; <strong>B)</strong> 63 TL &nbsp; <strong>C)</strong> 66 TL &nbsp; <strong>D)</strong> 62 TL &nbsp; <strong>E)</strong> <span class="key">64 TL</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = -1 < 0$ ⟹ tepe maksimumdur.</p>
      <p class="ales-sol-step">$x_T = -\\dfrac{20}{-2} = 10$ adet.</p>
      <p class="ales-sol-step">$K(10) = -100 + 200 - 36 = 64$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 64 TL</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Toplamı Sabit — Çarpım Maks</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Toplamı $20$ olan iki sayının çarpımı en fazla kaç olabilir?<br><br>
      <strong>A)</strong> 99 &nbsp; <strong>B)</strong> <span class="key">100</span> &nbsp; <strong>C)</strong> 101 &nbsp; <strong>D)</strong> 98 &nbsp; <strong>E)</strong> 102
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sayılar $x$ ve $20 - x$. Çarpım $f(x) = x(20 - x) = -x^{2} + 20x$.</p>
      <p class="ales-sol-step">$x_T = -\\dfrac{20}{-2} = 10$, $f(10) = 100$.</p>
      <p class="ales-sol-step">Sayılar $10$ ve $10$, çarpım $100$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 100</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Çarpımı Sabit — Toplam Min</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Pozitif gerçel iki sayının çarpımı $36$. Toplamları en az kaç olabilir?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — AGM Eşitsizliği</div>
      <p class="ales-sol-step">İki pozitif sayı $a, b$ için: $\\dfrac{a + b}{2} \\geq \\sqrt{ab}$.</p>
      <p class="ales-sol-step">$\\dfrac{a + b}{2} \\geq \\sqrt{36} = 6 \\Rightarrow a + b \\geq 12$.</p>
      <p class="ales-sol-step">Eşitlik $a = b = 6$ olduğunda. Min toplam $= 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Maksimum Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Çevresi $40$ m olan dikdörtgen bir bahçenin alanı en çok kaç m² olabilir?<br><br>
      <strong>A)</strong> 80 m² &nbsp; <strong>B)</strong> 99 m² &nbsp; <strong>C)</strong> <span class="key">100 m²</span> &nbsp; <strong>D)</strong> 200 m² &nbsp; <strong>E)</strong> 50 m²
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 140" style="width:100%;max-width:280px">
        <rect x="40" y="30" width="120" height="80" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2"/>
        <text x="20" y="75" font-size="11" fill="currentColor" font-family="JetBrains Mono">y</text>
        <text x="95" y="125" font-size="11" fill="currentColor" font-family="JetBrains Mono">x</text>
      </svg>
      <div class="ales-diagram-caption">Çevre 2x+2y=40, alan A=xy</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2x + 2y = 40 \\Rightarrow y = 20 - x$.</p>
      <p class="ales-sol-step">Alan $A(x) = x(20 - x) = -x^{2} + 20x$.</p>
      <p class="ales-sol-step">$x_T = 10$, $A(10) = 100$ m². Bu kare ($10 \\times 10$).</p>
      <p class="ales-sol-step"><strong>Sonuç:</strong> Sabit çevreli dikdörtgenler arasında alanı maksimum olan karedir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 100 m²</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Mermi Yörüngesi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir mermi yörüngesi $y = -5t^{2} + 30t$ ile veriliyor ($y$: yükseklik m, $t$: zaman s). Mermi en yüksek kaç m'ye ulaşır?<br><br>
      <strong>A)</strong> 46 m &nbsp; <strong>B)</strong> <span class="key">45 m</span> &nbsp; <strong>C)</strong> 44 m &nbsp; <strong>D)</strong> 47 m &nbsp; <strong>E)</strong> 43 m
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$t_T = -\\dfrac{30}{-10} = 3$ saniye.</p>
      <p class="ales-sol-step">$y(3) = -45 + 90 = 45$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 45 m</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Karelerin Toplamı Min</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a + b = 12$ olduğuna göre $a^{2} + b^{2}$ en az kaçtır?<br><br>
      <strong>A)</strong> 71 &nbsp; <strong>B)</strong> <span class="key">72</span> &nbsp; <strong>C)</strong> 73 &nbsp; <strong>D)</strong> 70 &nbsp; <strong>E)</strong> 74
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$b = 12 - a$ ⟹ $f(a) = a^{2} + (12 - a)^{2} = 2a^{2} - 24a + 144$.</p>
      <p class="ales-sol-step">$a_T = -\\dfrac{-24}{4} = 6$. $f(6) = 72 - 144 + 144 = 72$.</p>
      <p class="ales-sol-step">$a = b = 6$ ⟹ $36 + 36 = 72$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 72</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Maksimum Gelir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir ürünün fiyatı $50$ TL iken haftada $200$ adet satılıyor. Fiyat $1$ TL artırılırsa satış $5$ adet düşüyor. Maksimum haftalık gelir için fiyat kaç TL olmalıdır?<br><br>
      <strong>A)</strong> 46 TL &nbsp; <strong>B)</strong> 44 TL &nbsp; <strong>C)</strong> 47 TL &nbsp; <strong>D)</strong> 43 TL &nbsp; <strong>E)</strong> <span class="key">45 TL</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Fiyat artışı $x$ TL olsun. Yeni fiyat: $50 + x$, yeni satış: $200 - 5x$.</p>
      <p class="ales-sol-step">Gelir: $G(x) = (50 + x)(200 - 5x) = 10000 - 250x + 200x - 5x^{2} = -5x^{2} - 50x + 10000$.</p>
      <p class="ales-sol-step">$x_T = -\\dfrac{-50}{-10} = -5$.</p>
      <p class="ales-sol-step">Yeni fiyat $= 50 + (-5) = 45$ TL. (Yani fiyatı $5$ TL düşürmek!)</p>
      <p class="ales-sol-step">$G(-5) = -125 + 250 + 10000 = 10125$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 45 TL</span></div>
    </div>
  </div>
</section>
`
};
