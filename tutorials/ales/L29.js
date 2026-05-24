window.ALES_LESSON = {
n: 29,
title: "Polinomlar — Tanım, Derece, İşlemler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>polinomlar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Polinom derecesinin tanımı + $P(0)$ sabit terim, $P(1)$ katsayılar toplamı tüyolarıyla başlayıp polinom işlemleri ve Horner şeması ile bölme + kalan teoremine kadar gideceğiz.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Polinom Derecesi + P(0), P(1) Tüyoları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Polinom Derecesi + P(0), P(1) Tüyoları</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Derece</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 4x^5 - 3x^3 + 7x - 2$ polinomunun derecesi kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Polinomun derecesi: en yüksek üs.</p>
      <p class="ales-sol-step">$x^5$ ⟹ derece $5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">P(0) — Sabit Terim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 2x^4 - 5x^2 + 3x - 8$ ise $P(0)$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> $-3$ &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> <span class="key">$-8$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tüyo</div>
      <p class="ales-sol-step"><strong>$P(0)$ = sabit terim</strong> (her terimde $x = 0$ koyduğunda sabit terim hariç hepsi sıfır olur).</p>
      <p class="ales-sol-step">$P(0) = -8$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) −8</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">P(1) — Katsayılar Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 3x^4 - 2x^3 + 5x^2 - x + 4$ polinomunun katsayılar toplamı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tüyo</div>
      <p class="ales-sol-step"><strong>Katsayılar toplamı = $P(1)$.</strong></p>
      <p class="ales-sol-step">$P(1) = 3 - 2 + 5 - 1 + 4 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">P(1) Kompozit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = (2x - 1)^3 (x + 5)^2$ polinomunun katsayılar toplamı kaçtır?<br><br>
      <strong>A)</strong> 27 &nbsp; <strong>B)</strong> 29 &nbsp; <strong>C)</strong> <span class="key">36</span> &nbsp; <strong>D)</strong> 37 &nbsp; <strong>E)</strong> 41
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — $P(1)$</div>
      <p class="ales-sol-step">$P(1) = (2 \\cdot 1 - 1)^3 (1 + 5)^2 = 1^3 \\cdot 6^2 = 36$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> Açmadan, sadece $x = 1$ koyarak hesaplanır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 36</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Sabit Terim Kompozit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = (x^2 + 3)(2x - 5)$ polinomunun sabit terimi kaçtır?<br><br>
      <strong>A)</strong> $-3$ &nbsp; <strong>B)</strong> $-5$ &nbsp; <strong>C)</strong> <span class="key">$-15$</span> &nbsp; <strong>D)</strong> $15$ &nbsp; <strong>E)</strong> $-10$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — $P(0)$</div>
      <p class="ales-sol-step">$P(0) = (0 + 3)(0 - 5) = 3 \\cdot (-5) = -15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) −15</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Çift+Tek Terimler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 2x^4 - 3x^3 + x^2 - 4x + 7$ ise $P(1) - P(-1)$ kaçtır?<br><br>
      <strong>A)</strong> $14$ &nbsp; <strong>B)</strong> $-7$ &nbsp; <strong>C)</strong> $7$ &nbsp; <strong>D)</strong> <span class="key">$-14$</span> &nbsp; <strong>E)</strong> $20$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(1) = 2 - 3 + 1 - 4 + 7 = 3$.</p>
      <p class="ales-sol-step">$P(-1) = 2 + 3 + 1 + 4 + 7 = 17$.</p>
      <p class="ales-sol-step">$P(1) - P(-1) = 3 - 17 = -14$.</p>
      <p class="ales-sol-step"><strong>Tüyo:</strong> $P(1) - P(-1) = 2 \\cdot$ (tek dereceli terimlerin katsayılar toplamı) $= 2(-3 - 4) = -14$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) −14</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez Derece</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $P(x)$ derece $4$, $Q(x)$ derece $3$ ise $P(x) \\cdot Q(x)$ ile $P(x) + Q(x)$'in derecesi sırasıyla kaçtır?<br><br>
      <strong>A)</strong> Çarpım: 12, Toplam: 7 &nbsp; <strong>B)</strong> Çarpım: 4, Toplam: 3 &nbsp; <strong>C)</strong> <span class="key">Çarpım: 7, Toplam: 4</span> &nbsp; <strong>D)</strong> Çarpım: 7, Toplam: 3 &nbsp; <strong>E)</strong> Çarpım: 12, Toplam: 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Çarpım derece:</strong> Toplam: $4 + 3 = 7$.</p>
      <p class="ales-sol-step"><strong>Toplam derece:</strong> Maksimum: $\\max(4, 3) = 4$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Eğer iki polinom aynı derecede olsaydı toplamda baş katsayı sıfırlanabilirdi (derece düşebilir).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Çarpım: 7, Toplam: 4</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Polinom Toplama / Çıkarma / Çarpma
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Polinom Toplama, Çıkarma, Çarpma</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Toplama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 2x^2 + 3x - 1$ ve $Q(x) = x^2 - 2x + 4$ ise $P(x) + Q(x)$ nedir?<br><br>
      <strong>A)</strong> 0 x² + x + 3 &nbsp; <strong>B)</strong> 2 x² + x + 3 &nbsp; <strong>C)</strong> <span class="key">3 x² + x + 3</span> &nbsp; <strong>D)</strong> 6 x² + x + 3 &nbsp; <strong>E)</strong> 8 x² + x + 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı dereceli terimleri topla:</p>
      <p class="ales-sol-step">$x^2$: $2 + 1 = 3$. $x$: $3 - 2 = 1$. Sabit: $-1 + 4 = 3$.</p>
      <p class="ales-sol-step">$P(x) + Q(x) = 3x^2 + x + 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3 x² + x + 3</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Çıkarma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 3x^3 + 2x - 5$ ve $Q(x) = x^3 - x + 2$ ise $P(x) - Q(x)$ nedir?<br><br>
      <strong>A)</strong> 1 x³ + 3x − 7 &nbsp; <strong>B)</strong> <span class="key">2 x³ + 3x − 7</span> &nbsp; <strong>C)</strong> 3 x³ + 3x − 7 &nbsp; <strong>D)</strong> 5 x³ + 3x − 7 &nbsp; <strong>E)</strong> 7 x³ + 3x − 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(x) - Q(x) = (3 - 1)x^3 + 0 \\cdot x^2 + (2 - (-1))x + (-5 - 2)$.</p>
      <p class="ales-sol-step">$= 2x^3 + 3x - 7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 x³ + 3x − 7</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çarpma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(x + 2)(x^2 - 3x + 1)$ çarpımı nedir?<br><br>
      <strong>A)</strong> x³ + x² − 5x + 2 &nbsp; <strong>B)</strong> <span class="key">x³ − x² − 5x + 2</span> &nbsp; <strong>C)</strong> x³ − x² + 5x + 2 &nbsp; <strong>D)</strong> x³ − x² − 5x − 2 &nbsp; <strong>E)</strong> x³ + 5x − 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dağılım</div>
      <p class="ales-sol-step">$x \\cdot (x^2 - 3x + 1) = x^3 - 3x^2 + x$.</p>
      <p class="ales-sol-step">$2 \\cdot (x^2 - 3x + 1) = 2x^2 - 6x + 2$.</p>
      <p class="ales-sol-step">Topla: $x^3 - 3x^2 + 2x^2 + x - 6x + 2 = x^3 - x^2 - 5x + 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) x³ − x² − 5x + 2</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Belirli Katsayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(2x - 1)(3x^2 + 4x - 5)$ çarpımında $x^2$'nin katsayısı kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sadece İlgili Terimler</div>
      <p class="ales-sol-step">$x^2$ ortaya nasıl çıkar?</p>
      <p class="ales-sol-step">$2x \\cdot 4x = 8x^2$ ve $(-1) \\cdot 3x^2 = -3x^2$.</p>
      <p class="ales-sol-step">Toplam: $8 - 3 = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Karma — P + Q ile Q</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) + Q(x) = 4x^2 + 5x + 3$ ve $P(x) = 2x^2 - x + 7$ ise $Q(x)$ nedir?<br><br>
      <strong>A)</strong> 1 x² + 6x − 4 &nbsp; <strong>B)</strong> <span class="key">2 x² + 6x − 4</span> &nbsp; <strong>C)</strong> 3 x² + 6x − 4 &nbsp; <strong>D)</strong> 5 x² + 6x − 4 &nbsp; <strong>E)</strong> 7 x² + 6x − 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$Q(x) = (4x^2 + 5x + 3) - (2x^2 - x + 7)$.</p>
      <p class="ales-sol-step">$= 2x^2 + 6x - 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 x² + 6x − 4</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">P(g(x)) Hesabı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = x^2 + 2x - 1$ ise $P(x + 1)$ nedir?<br><br>
      <strong>A)</strong> x² + 2x &nbsp; <strong>B)</strong> x² + 4x &nbsp; <strong>C)</strong> <span class="key">x² + 4x + 2</span> &nbsp; <strong>D)</strong> x² + 4x − 2 &nbsp; <strong>E)</strong> x² + 2x + 2
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yerine Koyma</div>
      <p class="ales-sol-step">$P(x + 1) = (x + 1)^2 + 2(x + 1) - 1$.</p>
      <p class="ales-sol-step">$= x^2 + 2x + 1 + 2x + 2 - 1 = x^2 + 4x + 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) x² + 4x + 2</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Ters Bağıntı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $P(x - 2) = x^2 + 3x - 1$ ise $P(x)$ nedir?<br><br>
      <strong>A)</strong> x² + 3x − 1 &nbsp; <strong>B)</strong> x² + 7x + 5 &nbsp; <strong>C)</strong> <span class="key">x² + 7x + 9</span> &nbsp; <strong>D)</strong> x² + 5x + 9 &nbsp; <strong>E)</strong> x² − 7x + 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yerine Koyma Trick</div>
      <p class="ales-sol-step">$x - 2 = t$ dersek $x = t + 2$.</p>
      <p class="ales-sol-step">$P(t) = (t + 2)^2 + 3(t + 2) - 1 = t^2 + 4t + 4 + 3t + 6 - 1 = t^2 + 7t + 9$.</p>
      <p class="ales-sol-step">$P(x) = x^2 + 7x + 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) x² + 7x + 9</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Polinom Bölme + Kalan Teoremi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Polinom Bölme (Horner) + Kalan Teoremi</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Kalan Teoremi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = x^3 - 2x^2 + 5x - 1$ polinomunun $(x - 2)$ ile bölümünden kalan kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">9</span> &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Kalan Teoremi</div>
      <p class="ales-sol-step"><strong>Kalan Teoremi:</strong> $P(x)$'in $(x - a)$ ile bölümünden kalan $= P(a)$.</p>
      <p class="ales-sol-step">$P(2) = 8 - 8 + 10 - 1 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 9</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Kalan Teoremi (− işaret)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 2x^3 + x^2 - 3x + 4$ polinomunun $(x + 1)$ ile bölümünden kalan kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 8 &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x + 1) = (x - (-1))$ ⟹ $a = -1$.</p>
      <p class="ales-sol-step">$P(-1) = -2 + 1 + 3 + 4 = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Faktör Teoremi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = x^3 - 4x^2 + ax - 6$ polinomu $(x - 3)$ ile tam bölünüyorsa $a$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Faktör Teoremi</div>
      <p class="ales-sol-step">Tam bölünme ⟺ kalan $0$ ⟺ $P(3) = 0$.</p>
      <p class="ales-sol-step">$P(3) = 27 - 36 + 3a - 6 = 3a - 15 = 0 \\Rightarrow a = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Horner Bölme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = x^3 + 2x^2 - 5x - 6$ polinomunu $(x - 2)$ ile böl. Bölüm nedir?<br><br>
      <strong>A)</strong> x² + 2x + 3 &nbsp; <strong>B)</strong> x² + 4x − 3 &nbsp; <strong>C)</strong> <span class="key">x² + 4x + 3</span> &nbsp; <strong>D)</strong> x² − 4x + 3 &nbsp; <strong>E)</strong> x² + 3x + 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Horner Şeması</div>
      <p class="ales-sol-step">Katsayılar: $1, 2, -5, -6$. Bölen kökü: $a = 2$.</p>
      <p class="ales-sol-step">İlk katsayı düşer: $1$. $1 \\cdot 2 + 2 = 4$. $4 \\cdot 2 + (-5) = 3$. $3 \\cdot 2 + (-6) = 0$.</p>
      <p class="ales-sol-step">Bölüm katsayıları: $1, 4, 3$ ⟹ Bölüm: $x^2 + 4x + 3$. Kalan: $0$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrulama</div>
      <p class="ales-sol-step">$(x - 2)(x^2 + 4x + 3) = x^3 + 4x^2 + 3x - 2x^2 - 8x - 6 = x^3 + 2x^2 - 5x - 6$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) x² + 4x + 3</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İki Bilinmeyen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = x^3 + ax^2 + bx + 12$ polinomu $(x - 2)$ ve $(x + 3)$ ile tam bölünüyorsa $a + b$ kaçtır?<br><br>
      <strong>A)</strong> $-7$ &nbsp; <strong>B)</strong> <span class="key">$-9$</span> &nbsp; <strong>C)</strong> $-10$ &nbsp; <strong>D)</strong> $9$ &nbsp; <strong>E)</strong> $7$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Denklem</div>
      <p class="ales-sol-step">$P(2) = 0$: $8 + 4a + 2b + 12 = 0 \\Rightarrow 4a + 2b = -20 \\Rightarrow 2a + b = -10$.</p>
      <p class="ales-sol-step">$P(-3) = 0$: $-27 + 9a - 3b + 12 = 0 \\Rightarrow 9a - 3b = 15 \\Rightarrow 3a - b = 5$.</p>
      <p class="ales-sol-step">İki denklemi topla: $5a = -5 \\Rightarrow a = -1$. $b = -10 - 2(-1) = -8$.</p>
      <p class="ales-sol-step">$a + b = -9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) −9</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kalan Verilmiş</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $P(x) = 2x^4 - 3x^3 + kx + 1$ polinomunun $(x - 1)$ ile bölümünden kalan $5$ ise $k$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">5</span> &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P(1) = 5$.</p>
      <p class="ales-sol-step">$2 - 3 + k + 1 = 5 \\Rightarrow k = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — İki Lineer Bölüm</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $P(x)$ polinomunun $(x - 1)$ ile bölümünden kalan $3$, $(x + 2)$ ile bölümünden kalan $-6$'dır. $P(x)$'in $(x - 1)(x + 2)$ ile bölümünden kalan polinomu nedir?<br><br>
      <strong>A)</strong> 2 x &nbsp; <strong>B)</strong> <span class="key">3 x</span> &nbsp; <strong>C)</strong> 4 x &nbsp; <strong>D)</strong> 6 x &nbsp; <strong>E)</strong> 8 x
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Lineer Kalan</div>
      <p class="ales-sol-step">İkinci derece bölen ⟹ kalan en fazla birinci derece: $R(x) = ax + b$.</p>
      <p class="ales-sol-step">$P(1) = a + b = 3$ ve $P(-2) = -2a + b = -6$.</p>
      <p class="ales-sol-step">Birinciyi ikinciden çıkar: $-3a = -9 \\Rightarrow a = 3$, $\\;b = 0$.</p>
      <p class="ales-sol-step">$R(x) = 3x$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3 x</span></div>
    </div>
  </div>
</section>
`
};
