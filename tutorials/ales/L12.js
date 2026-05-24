window.ALES_LESSON = {
n: 12,
title: "Üslü Sayılar — Negatif ve Sıfır Üs",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>negatif üs ve sıfır üs</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $a^{0} = 1$ ve $a^{-n} = \\dfrac{1}{a^{n}}$ kuralları, $(-a)^{n}$ işaret ayrımı ve klasik ALES tuzağı $(-2)^{4}$ vs $-2^{4}$ farkı çözüm içinde uygulanıyor. Önce kendin dene, sonra çözüme bak.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Sıfır Üs ve Negatif Üs Tanımları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Sıfır Üs ve Negatif Üs: $a^{0}$ ve $a^{-n}$</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Sıfır Üs</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $7^{0} + 100^{0} - 3 \\cdot 5^{0}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> -2 &nbsp; <strong>B)</strong> -4 &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">-1</span> &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a \\neq 0$ için $a^{0} = 1$.</p>
      <p class="ales-sol-step">$1 + 1 - 3 \\cdot 1 = 2 - 3 = -1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) -1</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Negatif Üs Tanım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{-3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $-8$ &nbsp; <strong>B)</strong> $-\\dfrac{1}{8}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{8}$</span> &nbsp; <strong>D)</strong> $\\dfrac{1}{6}$ &nbsp; <strong>E)</strong> $8$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $a^{-n} = \\dfrac{1}{a^{n}}$.</p>
      <p class="ales-sol-step">$2^{-3} = \\dfrac{1}{2^{3}} = \\dfrac{1}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{8}$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Kesirli Tabanın Negatif Üssü</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\left(\\dfrac{2}{3}\\right)^{-2}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{4}{9}$ &nbsp; <strong>B)</strong> $-\\dfrac{4}{9}$ &nbsp; <strong>C)</strong> $-\\dfrac{9}{4}$ &nbsp; <strong>D)</strong> $\\dfrac{2}{9}$ &nbsp; <strong>E)</strong> <span class="key">$\\dfrac{9}{4}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ters Alma Kuralı</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\left(\\dfrac{a}{b}\\right)^{-n} = \\left(\\dfrac{b}{a}\\right)^{n}$ — kesir ters çevrilip üs pozitife döner.</p>
      <p class="ales-sol-step">$\\left(\\dfrac{2}{3}\\right)^{-2} = \\left(\\dfrac{3}{2}\\right)^{2} = \\dfrac{9}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $\\dfrac{9}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Negatif Üslerle Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $2^{-1} + 2^{-2} + 2^{-3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{8}$ &nbsp; <strong>B)</strong> $\\dfrac{3}{8}$ &nbsp; <strong>C)</strong> $\\dfrac{5}{8}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{7}{8}$</span> &nbsp; <strong>E)</strong> $\\dfrac{1}{6}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{-1} = \\dfrac{1}{2}$, $\\;2^{-2} = \\dfrac{1}{4}$, $\\;2^{-3} = \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">Ortak payda 8: $\\dfrac{4}{8} + \\dfrac{2}{8} + \\dfrac{1}{8} = \\dfrac{7}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{7}{8}$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Aynı Tabanda Negatif Üs Çarpımı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3^{5} \\cdot 3^{-3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 6 &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> <span class="key">9</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a^{m} \\cdot a^{n} = a^{m+n}$ kuralı negatif üslerde de geçerli.</p>
      <p class="ales-sol-step">$3^{5} \\cdot 3^{-3} = 3^{5 + (-3)} = 3^{2} = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 9</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Negatif Üs Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2^{-3}}{2^{-5}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{a^{m}}{a^{n}} = a^{m-n}$ ⟹ $2^{-3 - (-5)} = 2^{-3 + 5} = 2^{2} = 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Negatif Üsleri Yere Taşı</div>
      <p class="ales-sol-step">Paydadaki negatif üs paya çıkar (ve tersi): $\\dfrac{2^{-3}}{2^{-5}} = \\dfrac{2^{5}}{2^{3}} = 2^{2} = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Negatif Üs Denklem</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $3^{x} = \\dfrac{1}{27}$ ise $x$ kaçtır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">-3</span> &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> -1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{27} = \\dfrac{1}{3^{3}} = 3^{-3}$.</p>
      <p class="ales-sol-step">$3^{x} = 3^{-3} \\Rightarrow x = -3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) -3</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — (-a)^n Çift/Tek Üs ve Parantez Tuzağı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">$(-a)^{n}$ Çift/Tek Üs ve Parantez Tuzağı</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Klasik Parantez Tuzağı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(-2)^{4}$ ile $-2^{4}$ ifadelerinin değerleri sırasıyla kaçtır?<br><br>
      <strong>A)</strong> $-16$ ve $+16$ &nbsp; <strong>B)</strong> $+16$ ve $+16$ &nbsp; <strong>C)</strong> <span class="key">$+16$ ve $-16$</span> &nbsp; <strong>D)</strong> $-16$ ve $-16$ &nbsp; <strong>E)</strong> $-8$ ve $+8$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — ALES Klasik Tuzağı</div>
      <p class="ales-sol-step"><strong>Kritik fark:</strong> $(-2)^{4}$ — $-2$'nin 4. kuvveti. $-2^{4}$ — sadece $2$'nin 4. kuvveti, sonuna $-$ konur.</p>
      <p class="ales-sol-step">$(-2)^{4} = (-2)(-2)(-2)(-2) = +16$ (çift sayıda $-$ ⟹ artı).</p>
      <p class="ales-sol-step">$-2^{4} = -(2^{4}) = -16$ (üs önce, sonra $-$).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $+16$ ve $-16$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Tek Üs İşaret</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(-3)^{3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">-27</span> &nbsp; <strong>B)</strong> -22 &nbsp; <strong>C)</strong> -37 &nbsp; <strong>D)</strong> -32 &nbsp; <strong>E)</strong> -25
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Negatif tabanın <em>tek</em> üssü negatif, <em>çift</em> üssü pozitiftir.</p>
      <p class="ales-sol-step">$(-3)^{3} = (-3)(-3)(-3) = 9 \\cdot (-3) = -27$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) -27</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Toplam — Parantez Farkı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $(-3)^{2} + (-3)^{3} - 3^{2}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> -26 &nbsp; <strong>B)</strong> -29 &nbsp; <strong>C)</strong> <span class="key">-27</span> &nbsp; <strong>D)</strong> -25 &nbsp; <strong>E)</strong> -22
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(-3)^{2} = +9$ (çift üs).</p>
      <p class="ales-sol-step">$(-3)^{3} = -27$ (tek üs).</p>
      <p class="ales-sol-step">$-3^{2} = -9$.</p>
      <p class="ales-sol-step">Toplam: $9 + (-27) - 9 = -27$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) -27</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Negatif Taban Karşılaştırma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = (-2)^{6}$, $\\;b = -2^{6}$, $\\;c = (-2)^{5}$ ise $a, b, c$ sayılarının küçükten büyüğe sıralaması nedir?<br><br>
      <strong>A)</strong> $a < b < c$ &nbsp; <strong>B)</strong> $c < b < a$ &nbsp; <strong>C)</strong> $a < c < b$ &nbsp; <strong>D)</strong> <span class="key">$b < c < a$</span> &nbsp; <strong>E)</strong> $b < a < c$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = (-2)^{6} = +64$ (çift üs).</p>
      <p class="ales-sol-step">$b = -2^{6} = -(64) = -64$.</p>
      <p class="ales-sol-step">$c = (-2)^{5} = -32$ (tek üs).</p>
      <p class="ales-sol-step">$-64 < -32 < 64$ ⟹ $b < c < a$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $b < c < a$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Negatif Tabanlı Çarpım</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(-2)^{3} \\cdot (-2)^{4}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> -140 &nbsp; <strong>B)</strong> <span class="key">-128</span> &nbsp; <strong>C)</strong> -116 &nbsp; <strong>D)</strong> -134 &nbsp; <strong>E)</strong> -127
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpım Kuralı</div>
      <p class="ales-sol-step">Aynı taban: $(-2)^{3+4} = (-2)^{7} = -128$ (tek üs).</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan Çarpım</div>
      <p class="ales-sol-step">$(-2)^{3} = -8$, $(-2)^{4} = 16$. Çarpım: $-8 \\cdot 16 = -128$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) -128</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İşaret Tahmini</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(-1)^{99} + (-1)^{100} + (-1)^{101}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> -5 &nbsp; <strong>C)</strong> <span class="key">-1</span> &nbsp; <strong>D)</strong> -2 &nbsp; <strong>E)</strong> -4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(-1)^{n}$: $n$ çiftse $+1$, tekse $-1$.</p>
      <p class="ales-sol-step">$99$ tek ⟹ $-1$. $100$ çift ⟹ $+1$. $101$ tek ⟹ $-1$.</p>
      <p class="ales-sol-step">$-1 + 1 - 1 = -1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) -1</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Karma İşaret</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{(-2)^{8}}{(-2)^{5}} - (-2)^{3}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">0</span> &nbsp; <strong>C)</strong> 1 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{(-2)^{8}}{(-2)^{5}} = (-2)^{8-5} = (-2)^{3} = -8$.</p>
      <p class="ales-sol-step">$(-2)^{3} = -8$.</p>
      <p class="ales-sol-step">$-8 - (-8) = -8 + 8 = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 0</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Karma Negatif Üslü İfade Sadeleştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Karma Negatif Üslü İfade Sadeleştirme</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Negatif Üs ile Pay-Payda</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2^{-2}}{3^{-2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{4}{9}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{36}$ &nbsp; <strong>C)</strong> $36$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{9}{4}$</span> &nbsp; <strong>E)</strong> $\\dfrac{2}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Negatif üsleri yerleri değiştirerek pozitife çevir: $\\dfrac{2^{-2}}{3^{-2}} = \\dfrac{3^{2}}{2^{2}} = \\dfrac{9}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{9}{4}$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Karma — Üs Toplama</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $2^{-3} \\cdot 2^{5} \\cdot 2^{-1}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 5 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> <span class="key">2</span> &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2^{-3 + 5 + (-1)} = 2^{1} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 2</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Negatif Üslü Üssün Üssü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(2^{-3})^{-2}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 65 &nbsp; <strong>B)</strong> 67 &nbsp; <strong>C)</strong> <span class="key">64</span> &nbsp; <strong>D)</strong> 54 &nbsp; <strong>E)</strong> 59
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(a^{m})^{n} = a^{mn}$ ⟹ $(2^{-3})^{-2} = 2^{(-3)(-2)} = 2^{6} = 64$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 64</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Karma Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{4^{-2} \\cdot 2^{6}}{8^{-1}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 22 &nbsp; <strong>B)</strong> 29 &nbsp; <strong>C)</strong> <span class="key">32</span> &nbsp; <strong>D)</strong> 34 &nbsp; <strong>E)</strong> 37
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tek Tabanda Topla</div>
      <p class="ales-sol-step">Hepsini taban $2$'ye çevir: $4 = 2^{2}$, $8 = 2^{3}$.</p>
      <p class="ales-sol-step">$4^{-2} = (2^{2})^{-2} = 2^{-4}$, $\\;8^{-1} = (2^{3})^{-1} = 2^{-3}$.</p>
      <p class="ales-sol-step">$\\dfrac{2^{-4} \\cdot 2^{6}}{2^{-3}} = \\dfrac{2^{2}}{2^{-3}} = 2^{2 - (-3)} = 2^{5} = 32$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 32</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Toplam — Negatif Üs Karması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\left(\\dfrac{1}{2}\\right)^{-3} + \\left(\\dfrac{1}{3}\\right)^{-2}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">17</span> &nbsp; <strong>C)</strong> 18 &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\left(\\dfrac{1}{2}\\right)^{-3} = 2^{3} = 8$.</p>
      <p class="ales-sol-step">$\\left(\\dfrac{1}{3}\\right)^{-2} = 3^{2} = 9$.</p>
      <p class="ales-sol-step">$8 + 9 = 17$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 17</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Çift Negatif Tabanlı Karma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $A = (-3)^{-2} + 3^{-2} - (-3)^{0}$ ise $A$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{7}{9}$ &nbsp; <strong>B)</strong> $-\\dfrac{11}{9}$ &nbsp; <strong>C)</strong> <span class="key">$-\\dfrac{7}{9}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{9}$ &nbsp; <strong>E)</strong> $-\\dfrac{2}{9}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(-3)^{-2} = \\dfrac{1}{(-3)^{2}} = \\dfrac{1}{9}$ (çift üs ⟹ pozitif).</p>
      <p class="ales-sol-step">$3^{-2} = \\dfrac{1}{9}$.</p>
      <p class="ales-sol-step">$(-3)^{0} = 1$.</p>
      <p class="ales-sol-step">$A = \\dfrac{1}{9} + \\dfrac{1}{9} - 1 = \\dfrac{2}{9} - 1 = -\\dfrac{7}{9}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $-\\dfrac{7}{9}$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — Çoklu Taban</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{6^{-2} \\cdot 2^{4}}{3^{-2}}$ ifadesinin değeri kaçtır?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 1 &nbsp; <strong>E)</strong> 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpan Açma</div>
      <p class="ales-sol-step">$6 = 2 \\cdot 3$ ⟹ $6^{-2} = 2^{-2} \\cdot 3^{-2}$.</p>
      <p class="ales-sol-step">$\\dfrac{2^{-2} \\cdot 3^{-2} \\cdot 2^{4}}{3^{-2}} = 2^{-2 + 4} \\cdot 3^{-2 - (-2)} = 2^{2} \\cdot 3^{0} = 4 \\cdot 1 = 4$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sayısal Doğrula</div>
      <p class="ales-sol-step">$6^{-2} = \\dfrac{1}{36}$, $\\;3^{-2} = \\dfrac{1}{9}$.</p>
      <p class="ales-sol-step">$\\dfrac{(1/36) \\cdot 16}{1/9} = \\dfrac{16}{36} \\cdot 9 = \\dfrac{144}{36} = 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4</span></div>
    </div>
  </div>
</section>
`
};
