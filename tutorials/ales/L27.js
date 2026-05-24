window.ALES_LESSON = {
n: 27,
title: "Eşitsizlikler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>eşitsizlikler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. <strong>En kritik kural:</strong> Her iki tarafı negatif sayı ile çarpınca eşitsizlik yön değiştirir. Birinci derece → ikinci derece (parabol işareti) → kesirli (işaret tablosu) sırasıyla ilerleyeceğiz.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Birinci Derece Eşitsizlik
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Birinci Derece Eşitsizlik (Negatif Tuzağı)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Sade Eşitsizlik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3x - 6 > 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $x < 2$ &nbsp; <strong>B)</strong> $x \\geq 2$ &nbsp; <strong>C)</strong> <span class="key">$x > 2$</span> &nbsp; <strong>D)</strong> $x > -2$ &nbsp; <strong>E)</strong> $x > 6$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3x > 6 \\Rightarrow x > 2$.</p>
      <p class="ales-sol-step">Pozitif sayı ile böldük; yön değişmedi.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x > 2$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Negatif Tuzağı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $-2x + 8 \\geq 0$ eşitsizliğinin çözümü nedir?<br><br>
      <strong>A)</strong> $x \\geq 4$ &nbsp; <strong>B)</strong> $x \\geq -4$ &nbsp; <strong>C)</strong> $x \\leq -4$ &nbsp; <strong>D)</strong> <span class="key">$x \\leq 4$</span> &nbsp; <strong>E)</strong> $x = 4$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$-2x \\geq -8$. <strong>Negatif ile böl ⟹ yön değişir:</strong></p>
      <p class="ales-sol-step">$x \\leq 4$.</p>
      <p class="ales-sol-step"><strong>TUZAK:</strong> $\\geq$ yön değiştirip $\\leq$ olur. Yön değiştirmeyi unutmak en sık yapılan hata.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x \\leq 4$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">İki Tarafı Düzenle</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5x - 3 < 2x + 9$ eşitsizliğini sağlayan en büyük tam sayı kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">3</span> &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 6
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5x - 2x < 9 + 3 \\Rightarrow 3x < 12 \\Rightarrow x < 4$.</p>
      <p class="ales-sol-step">$x < 4$ ⟹ en büyük tam sayı $3$ (4 dahil değil).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 3</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Çift Eşitsizlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-3 < 2x - 5 \\leq 7$ eşitsizliğinin tam sayı çözüm sayısı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> <span class="key">5</span> &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üç tarafa $5$ ekle: $2 < 2x \\leq 12$. $2$ ile böl: $1 < x \\leq 6$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{2, 3, 4, 5, 6\\}$ ⟹ $5$ adet.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 5</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Kesirli Eşitsizlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x - 3}{2} \\geq \\dfrac{x + 1}{4}$ eşitsizliğini sağlayan en küçük tam sayı kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4$ ile çarp (pozitif, yön değişmez): $2(x - 3) \\geq x + 1$.</p>
      <p class="ales-sol-step">$2x - 6 \\geq x + 1 \\Rightarrow x \\geq 7$.</p>
      <p class="ales-sol-step">En küçük tam sayı: $7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">İki Yönlü Negatif</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-1 \\leq 3 - 2x < 5$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $-1 \\leq x < 2$ &nbsp; <strong>B)</strong> <span class="key">$-1 < x \\leq 2$</span> &nbsp; <strong>C)</strong> $1 < x \\leq 2$ &nbsp; <strong>D)</strong> $-2 \\leq x < 1$ &nbsp; <strong>E)</strong> $2 \\leq x < 5$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3$ çıkar: $-4 \\leq -2x < 2$.</p>
      <p class="ales-sol-step"><strong>$-2$ ile böl, üç tarafın da yönü değişir:</strong> $2 \\geq x > -1$.</p>
      <p class="ales-sol-step">Düzgün yaz: $-1 < x \\leq 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-1 < x \\leq 2$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sözel</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir sayının $4$ katından $7$ çıkarıldığında elde edilen sayı $25$'ten küçüktür. Bu koşulu sağlayan en büyük tam sayı kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> <span class="key">7</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$4x - 7 < 25 \\Rightarrow 4x < 32 \\Rightarrow x < 8$.</p>
      <p class="ales-sol-step">En büyük tam sayı: $7$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 7</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — İkinci Derece Eşitsizlik
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">İkinci Derece Eşitsizlik (Parabol İşareti)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Çarpanlama + İşaret</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 5x + 6 < 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> 1 &lt; x &lt; 3 &nbsp; <strong>B)</strong> <span class="key">2 &lt; x &lt; 3</span> &nbsp; <strong>C)</strong> 3 &lt; x &lt; 3 &nbsp; <strong>D)</strong> 6 &lt; x &lt; 3 &nbsp; <strong>E)</strong> 7 &lt; x &lt; 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x - 2)(x - 3) < 0$. Kökler $2$ ve $3$.</p>
      <p class="ales-sol-step"><strong>Parabol kuralı:</strong> $a > 0$ (aşağı bakan U). Kökler arasında negatif, dışında pozitif.</p>
      <p class="ales-sol-step">$< 0$ ⟹ kökler arasında: $2 < x < 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2 &lt; x &lt; 3</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Pozitif Bölge</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 4 \\geq 0$ eşitsizliğinin çözümü nedir?<br><br>
      <strong>A)</strong> $-2 \\leq x \\leq 2$ &nbsp; <strong>B)</strong> $-2 < x < 2$ &nbsp; <strong>C)</strong> <span class="key">$x \\leq -2$ veya $x \\geq 2$</span> &nbsp; <strong>D)</strong> $x < -2$ veya $x > 2$ &nbsp; <strong>E)</strong> $x \\geq 2$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x - 2)(x + 2) \\geq 0$. Kökler $-2$ ve $2$.</p>
      <p class="ales-sol-step">$\\geq 0$ ⟹ kökler dışında ve dahil: $x \\leq -2$ veya $x \\geq 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x \\leq -2$ veya $x \\geq 2$</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Aralıkta Tam Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 7x + 10 \\leq 0$ eşitsizliğinin tam sayı çözüm sayısı kaçtır?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x - 2)(x - 5) \\leq 0 \\Rightarrow 2 \\leq x \\leq 5$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{2, 3, 4, 5\\}$ ⟹ $4$ adet.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Negatif Lider Katsayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $-x^2 + 5x - 6 > 0$ eşitsizliğinin çözümü nedir?<br><br>
      <strong>A)</strong> <span class="key">2 &lt; x &lt; 3</span> &nbsp; <strong>B)</strong> 3 &lt; x &lt; 3 &nbsp; <strong>C)</strong> 5 &lt; x &lt; 3 &nbsp; <strong>D)</strong> 6 &lt; x &lt; 3 &nbsp; <strong>E)</strong> 7 &lt; x &lt; 3
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yön Değiştir</div>
      <p class="ales-sol-step">$-1$ ile çarp, yön değişir: $x^2 - 5x + 6 < 0$.</p>
      <p class="ales-sol-step">$(x - 2)(x - 3) < 0 \\Rightarrow 2 < x < 3$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Direkt Parabol</div>
      <p class="ales-sol-step">$a = -1 < 0$ ⟹ ters U parabol. Kökler arasında pozitif: $2 < x < 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2 &lt; x &lt; 3</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Δ &lt; 0 Durumu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 + x + 3 > 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> Çözüm yok &nbsp; <strong>B)</strong> $x > 0$ &nbsp; <strong>C)</strong> $x \\neq -3$ &nbsp; <strong>D)</strong> <span class="key">$x \\in \\mathbb{R}$</span> &nbsp; <strong>E)</strong> $x > -3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\Delta = 1 - 12 = -11 < 0$ ⟹ reel kök yok.</p>
      <p class="ales-sol-step">$a > 0$ olduğundan parabol her zaman <strong>pozitif</strong>tir.</p>
      <p class="ales-sol-step">Çözüm: tüm reel sayılar.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x \\in \\mathbb{R}$</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Çift Katlı Kök</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 6x + 9 \\leq 0$ eşitsizliğinin çözümü nedir?<br><br>
      <strong>A)</strong> $x \\in \\mathbb{R}$ &nbsp; <strong>B)</strong> Çözüm yok &nbsp; <strong>C)</strong> <span class="key">$x = 3$</span> &nbsp; <strong>D)</strong> $x \\leq 3$ &nbsp; <strong>E)</strong> $x \\geq 3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(x - 3)^2 \\leq 0$. Kare ifade hep $\\geq 0$. Tek olası: $(x - 3)^2 = 0$.</p>
      <p class="ales-sol-step">$x = 3$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $< 0$ olsaydı çözüm yok olurdu.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x = 3$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Parametre</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $x^2 - 2x + m > 0$ eşitsizliği <strong>her $x$ için</strong> sağlanıyorsa $m$ ne olmalıdır?<br><br>
      <strong>A)</strong> $m < 1$ &nbsp; <strong>B)</strong> <span class="key">$m > 1$</span> &nbsp; <strong>C)</strong> $m \\geq 1$ &nbsp; <strong>D)</strong> $m \\leq 1$ &nbsp; <strong>E)</strong> $m = 1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 1 > 0$ ve her $x$ için pozitif ⟺ parabolün $x$ eksenini kesmemesi ⟺ $\\Delta < 0$.</p>
      <p class="ales-sol-step">$\\Delta = 4 - 4m < 0 \\Rightarrow m > 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $m > 1$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Kesirli Eşitsizlik (İşaret Tablosu)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Kesirli Eşitsizlik (İşaret Tablosu)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Basit Kesir</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x - 2}{x + 3} > 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $-3 < x < 2$ &nbsp; <strong>B)</strong> $x < -3$ &nbsp; <strong>C)</strong> $x > 2$ &nbsp; <strong>D)</strong> <span class="key">$x < -3$ veya $x > 2$</span> &nbsp; <strong>E)</strong> $-3 \\leq x \\leq 2$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İşaret Tablosu</div>
      <p class="ales-sol-step">Kritik noktalar: pay sıfır $x = 2$, payda sıfır $x = -3$ (payda ASLA $0$ olamaz).</p>
      <p class="ales-sol-step">Sayı doğrusunda 3 bölge: $(-\\infty, -3)$, $(-3, 2)$, $(2, \\infty)$. Test:</p>
      <p class="ales-sol-step">$x = -4$: $(-)/(-) = +$ ✓ &nbsp;·&nbsp; $x = 0$: $(-)/(+) = -$ &nbsp;·&nbsp; $x = 3$: $(+)/(+) = +$ ✓.</p>
      <p class="ales-sol-step">Çözüm: $x < -3$ veya $x > 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x < -3$ veya $x > 2$</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Eşit Çözüm</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x - 1}{x + 4} \\leq 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $-4 \\leq x \\leq 1$ &nbsp; <strong>B)</strong> <span class="key">$-4 < x \\leq 1$</span> &nbsp; <strong>C)</strong> $-4 \\leq x < 1$ &nbsp; <strong>D)</strong> $x \\leq -4$ veya $x \\geq 1$ &nbsp; <strong>E)</strong> $-4 < x < 1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kritik: $x = 1$ (pay sıfır, dahil) ve $x = -4$ (payda sıfır, ASLA dahil değil).</p>
      <p class="ales-sol-step">Test bölgeler: $(-\\infty, -4)$ pozitif, $(-4, 1)$ negatif ✓, $(1, \\infty)$ pozitif.</p>
      <p class="ales-sol-step">$\\leq 0$: $-4 < x \\leq 1$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $-4$ DAHİL DEĞİL (payda sıfır).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-4 < x \\leq 1$</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Üç Faktör</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{(x - 1)(x + 2)}{x - 3} > 0$ eşitsizliğinin çözüm kümesi nedir?<br><br>
      <strong>A)</strong> $x < -2$ veya $1 < x < 3$ &nbsp; <strong>B)</strong> <span class="key">$-2 < x < 1$ veya $x > 3$</span> &nbsp; <strong>C)</strong> $x > 3$ &nbsp; <strong>D)</strong> $-2 < x < 3$ &nbsp; <strong>E)</strong> $x < -2$ veya $x > 1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kritik noktalar küçükten büyüğe: $-2, 1, 3$.</p>
      <p class="ales-sol-step">İşaret tablosu (en sağdan başla, hepsi $+$). Her noktada işaret bir kez değişir:</p>
      <p class="ales-sol-step">$(3, \\infty)$: $+$ &nbsp;·&nbsp; $(1, 3)$: $-$ &nbsp;·&nbsp; $(-2, 1)$: $+$ &nbsp;·&nbsp; $(-\\infty, -2)$: $-$.</p>
      <p class="ales-sol-step">$> 0$ ⟹ $-2 < x < 1$ veya $x > 3$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $-2 < x < 1$ veya $x > 3$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sıfıra Eşitle</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{2x + 1}{x - 4} \\geq 1$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $-5 \\leq x \\leq 4$ &nbsp; <strong>B)</strong> $x \\geq 4$ &nbsp; <strong>C)</strong> <span class="key">$x \\leq -5$ veya $x > 4$</span> &nbsp; <strong>D)</strong> $-5 < x < 4$ &nbsp; <strong>E)</strong> $x \\leq -5$ veya $x \\geq 4$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sıfıra Topla</div>
      <p class="ales-sol-step"><strong>Asla iki tarafı $x - 4$ ile çarpma</strong> — işaretini bilmiyorsun. Sıfıra topla:</p>
      <p class="ales-sol-step">$\\dfrac{2x + 1}{x - 4} - 1 \\geq 0 \\Rightarrow \\dfrac{2x + 1 - (x - 4)}{x - 4} \\geq 0 \\Rightarrow \\dfrac{x + 5}{x - 4} \\geq 0$.</p>
      <p class="ales-sol-step">Kritik: $x = -5$ (dahil), $x = 4$ (DAHİL DEĞİL).</p>
      <p class="ales-sol-step">$\\geq 0$ ⟹ $x \\leq -5$ veya $x > 4$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x \\leq -5$ veya $x > 4$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İkinci Derece Pay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x^2 - 4}{x + 1} < 0$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $-2 < x < 2$ &nbsp; <strong>B)</strong> $-2 < x < -1$ veya $x > 2$ &nbsp; <strong>C)</strong> <span class="key">$x < -2$ veya $-1 < x < 2$</span> &nbsp; <strong>D)</strong> $x < -1$ veya $x > 2$ &nbsp; <strong>E)</strong> $-1 < x < 2$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pay: $(x - 2)(x + 2)$. Kritik: $-2, -1, 2$.</p>
      <p class="ales-sol-step">İşaret testi: $(2, \\infty)$ $+$, $(-1, 2)$ $-$ ✓, $(-2, -1)$ $+$, $(-\\infty, -2)$ $-$ ✓.</p>
      <p class="ales-sol-step">$< 0$ ⟹ $x < -2$ veya $-1 < x < 2$.</p>
      <p class="ales-sol-step">Not: $x = -1$ payda sıfır, dahil değil. $\\pm 2$ pay sıfır, $<$ olduğundan dahil değil.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x < -2$ veya $-1 < x < 2$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kare Çarpan</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $(x - 1)^2 (x - 3) > 0$ eşitsizliğini çöz.<br><br>
      <strong>A)</strong> $x > 1$ &nbsp; <strong>B)</strong> $x \\neq 1$ ve $x > 3$ &nbsp; <strong>C)</strong> <span class="key">$x > 3$</span> &nbsp; <strong>D)</strong> $x \\geq 3$ &nbsp; <strong>E)</strong> $x < 1$ veya $x > 3$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Kare Hep Pozitif</div>
      <p class="ales-sol-step">$(x - 1)^2 \\geq 0$ her zaman. $x = 1$ ise tüm çarpım sıfır.</p>
      <p class="ales-sol-step">$> 0$ olması için: $(x - 1)^2 > 0$ (yani $x \\neq 1$) <strong>ve</strong> $(x - 3) > 0$ (yani $x > 3$).</p>
      <p class="ales-sol-step">$x > 3$ zaten $x \\neq 1$ koşulunu sağlar.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x > 3$</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez Tam Sayı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{x - 1}{x - 6} \\leq 0$ eşitsizliğinin tam sayı çözüm sayısı kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kritik: $x = 1$ (pay sıfır, dahil), $x = 6$ (payda sıfır, ASLA dahil değil).</p>
      <p class="ales-sol-step">$\\leq 0$ ⟹ $1 \\leq x < 6$.</p>
      <p class="ales-sol-step">Tam sayılar: $\\{1, 2, 3, 4, 5\\}$ ⟹ $5$ adet.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $6$ dahil olmadığı için sayım $5$, $6$ değil.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>
</section>
`
};
