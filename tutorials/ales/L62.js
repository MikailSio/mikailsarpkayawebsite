window.ALES_LESSON = {
n: 62,
title: "İntegral",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>integral</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Belirsiz integral kuralları, belirli integral, alan ve dönel cisim hacmi konuları ALES tarzında ele alınır. ALES Sayısal'da integral genelde 1-2 soru gelir.</p>
</div>

<!-- ============================================================
     ALT KONU 3.1 — Belirsiz İntegral
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">3.1</span>
    <h2 class="ales-sub-title">Belirsiz İntegral Kuralları</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Üs Kuralı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\int x^3 \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $3x^2 + C$ &nbsp; <strong>B)</strong> $\\dfrac{x^2}{2} + C$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{x^4}{4} + C$</span> &nbsp; <strong>D)</strong> $x^4 + C$ &nbsp; <strong>E)</strong> $4x^4 + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Üs kuralı: $\\int x^n dx = \\dfrac{x^{n+1}}{n+1} + C$ (n $\\ne -1$).</p>
      <p class="ales-sol-step">$n=3$: $\\dfrac{x^4}{4} + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{x^4}{4} + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Polinom</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\int (2x + 3) \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $x^2 + C$ &nbsp; <strong>B)</strong> $2x^2 + 3x + C$ &nbsp; <strong>C)</strong> <span class="key">$x^2 + 3x + C$</span> &nbsp; <strong>D)</strong> $\\dfrac{x^2}{2} + 3x + C$ &nbsp; <strong>E)</strong> $2x + 3 + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$\\int 2x \\, dx = x^2$, $\\int 3 \\, dx = 3x$.</p>
      <p class="ales-sol-step">Toplam: $x^2 + 3x + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $x^2 + 3x + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üç Terimli Polinom</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\int (3x^2 - 4x + 5) \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $x^3 - 2x^2 + 5 + C$ &nbsp; <strong>B)</strong> <span class="key">$x^3 - 2x^2 + 5x + C$</span> &nbsp; <strong>C)</strong> $3x^3 - 4x^2 + 5x + C$ &nbsp; <strong>D)</strong> $x^3 - 4x + 5 + C$ &nbsp; <strong>E)</strong> $x^3 + 2x^2 + 5x + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Terim terim: $\\dfrac{3x^3}{3} - \\dfrac{4x^2}{2} + 5x = x^3 - 2x^2 + 5x + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $x^3 - 2x^2 + 5x + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Üstel</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int e^x \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{e^x}{x} + C$ &nbsp; <strong>B)</strong> $xe^x + C$ &nbsp; <strong>C)</strong> <span class="key">$e^x + C$</span> &nbsp; <strong>D)</strong> $\\ln e^x + C$ &nbsp; <strong>E)</strong> $\\dfrac{e^{x+1}}{x+1} + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Temel kural: $\\int e^x dx = e^x + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $e^x + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">1/x</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int \\dfrac{1}{x} \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{-1}{x^2} + C$ &nbsp; <strong>B)</strong> $x + C$ &nbsp; <strong>C)</strong> <span class="key">$\\ln |x| + C$</span> &nbsp; <strong>D)</strong> $e^x + C$ &nbsp; <strong>E)</strong> $\\dfrac{1}{2x^2} + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Üs kuralı $n=-1$ için geçerli değil. Özel: $\\int \\dfrac{dx}{x} = \\ln|x| + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\ln|x| + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Trigonometrik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int (\\sin x + \\cos x) \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $\\cos x + \\sin x + C$ &nbsp; <strong>B)</strong> <span class="key">$-\\cos x + \\sin x + C$</span> &nbsp; <strong>C)</strong> $-\\cos x - \\sin x + C$ &nbsp; <strong>D)</strong> $\\cos x - \\sin x + C$ &nbsp; <strong>E)</strong> $\\sin x \\cdot \\cos x + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$\\int \\sin x \\, dx = -\\cos x$. $\\int \\cos x \\, dx = \\sin x$.</p>
      <p class="ales-sol-step">Toplam: $-\\cos x + \\sin x + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $-\\cos x + \\sin x + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Köklü</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\int \\sqrt{x} \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2\\sqrt{x}} + C$ &nbsp; <strong>B)</strong> $\\sqrt{x}/2 + C$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3}x^{3/2} + C$</span> &nbsp; <strong>D)</strong> $\\dfrac{3}{2}x^{1/2} + C$ &nbsp; <strong>E)</strong> $x^{3/2} + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$\\sqrt{x} = x^{1/2}$. Üs kuralı: $\\dfrac{x^{3/2}}{3/2} = \\dfrac{2}{3}x^{3/2}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3}x^{3/2} + C$</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 3.2 — Belirli İntegral ve Değişken Değiştirme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">3.2</span>
    <h2 class="ales-sub-title">Belirli İntegral ve Değişken Değiştirme</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Basit Belirli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\int_0^2 (2x+1) \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $4$ &nbsp; <strong>B)</strong> $5$ &nbsp; <strong>C)</strong> <span class="key">$6$</span> &nbsp; <strong>D)</strong> $7$ &nbsp; <strong>E)</strong> $8$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$F(x) = x^2 + x$.</p>
      <p class="ales-sol-step">$F(2) - F(0) = (4+2) - 0 = 6$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 6</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üs Kuralı Belirli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\int_1^3 x^2 \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{8}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{17}{3}$ &nbsp; <strong>C)</strong> $\\dfrac{20}{3}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{26}{3}$</span> &nbsp; <strong>E)</strong> $9$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$F(x) = \\dfrac{x^3}{3}$.</p>
      <p class="ales-sol-step">$F(3) - F(1) = \\dfrac{27}{3} - \\dfrac{1}{3} = \\dfrac{26}{3}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{26}{3}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Trig Belirli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int_0^{\\pi/2} \\sin x \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $-1$ &nbsp; <strong>B)</strong> $0$ &nbsp; <strong>C)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> <span class="key">$1$</span> &nbsp; <strong>E)</strong> $\\pi$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$F(x) = -\\cos x$.</p>
      <p class="ales-sol-step">$F(\\pi/2) - F(0) = -\\cos(\\pi/2) - (-\\cos 0) = 0 - (-1) = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Değişken Değiştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int 2x(x^2+1)^3 \\, dx$ hangisidir?<br><br>
      <strong>A)</strong> $(x^2+1)^4 + C$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{(x^2+1)^4}{4} + C$</span> &nbsp; <strong>C)</strong> $\\dfrac{(x^2+1)^3}{3} + C$ &nbsp; <strong>D)</strong> $2(x^2+1)^4 + C$ &nbsp; <strong>E)</strong> $\\dfrac{x^2(x^2+1)^4}{4} + C$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$u = x^2+1 \\Rightarrow du = 2x \\, dx$. İntegral: $\\int u^3 \\, du = \\dfrac{u^4}{4}$.</p>
      <p class="ales-sol-step">Yerine koy: $\\dfrac{(x^2+1)^4}{4} + C$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{(x^2+1)^4}{4} + C$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Üstel Belirli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\int_0^1 e^x \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$e-1$</span> &nbsp; <strong>D)</strong> $e$ &nbsp; <strong>E)</strong> $e+1$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$F(x) = e^x$.</p>
      <p class="ales-sol-step">$F(1) - F(0) = e - 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $e-1$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Logaritma Belirli</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\int_1^e \\dfrac{1}{x} \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> <span class="key">$1$</span> &nbsp; <strong>C)</strong> $e$ &nbsp; <strong>D)</strong> $e-1$ &nbsp; <strong>E)</strong> $\\ln 2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$F(x) = \\ln|x|$.</p>
      <p class="ales-sol-step">$F(e) - F(1) = \\ln e - \\ln 1 = 1 - 0 = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Değişken Değiştirme Belirli</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\int_0^1 2x(x^2+1) \\, dx$ değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{2}$</span> &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$u = x^2+1$, $du = 2x\\,dx$. Sınırlar: $x=0 \\Rightarrow u=1$; $x=1 \\Rightarrow u=2$.</p>
      <p class="ales-sol-step">$\\int_1^2 u \\, du = \\dfrac{u^2}{2}\\Big|_1^2 = \\dfrac{4}{2} - \\dfrac{1}{2} = \\dfrac{3}{2}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{2}$</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 3.3 — Alan ve Hacim Uygulamaları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">3.3</span>
    <h2 class="ales-sub-title">Alan Hesabı: Eğri Altı, İki Eğri Arası, Dönel Cisim</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Eğri Altı Alan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = x^2$ eğrisi ile $x$ ekseni ve $x=0, x=3$ doğruları arasında kalan alan kaç birim karedir?<br><br>
      <strong>A)</strong> $3$ &nbsp; <strong>B)</strong> $6$ &nbsp; <strong>C)</strong> <span class="key">$9$</span> &nbsp; <strong>D)</strong> $12$ &nbsp; <strong>E)</strong> $18$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Alan $= \\int_0^3 x^2 \\, dx = \\dfrac{x^3}{3}\\Big|_0^3 = \\dfrac{27}{3} = 9$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 9</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Eğri Altı — Doğru</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $y = 2x$, $x=1$ ve $x=4$ arasındaki alan kaç birim karedir?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $9$ &nbsp; <strong>C)</strong> $12$ &nbsp; <strong>D)</strong> <span class="key">$15$</span> &nbsp; <strong>E)</strong> $20$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Alan $= \\int_1^4 2x \\, dx = x^2\\Big|_1^4 = 16 - 1 = 15$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 15</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Parabol Alanı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = 4 - x^2$ eğrisi ile $x$ ekseni arasında kalan alan kaç birim karedir?<br><br>
      <strong>A)</strong> $\\dfrac{16}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{20}{3}$ &nbsp; <strong>C)</strong> $8$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{32}{3}$</span> &nbsp; <strong>E)</strong> $12$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Sıfırlar: $4-x^2=0 \\Rightarrow x=\\pm 2$.</p>
      <p class="ales-sol-step">$\\int_{-2}^{2}(4-x^2)\\,dx = \\left[4x - \\dfrac{x^3}{3}\\right]_{-2}^{2} = \\left(8-\\dfrac{8}{3}\\right) - \\left(-8+\\dfrac{8}{3}\\right) = \\dfrac{16}{3} + \\dfrac{16}{3} = \\dfrac{32}{3}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{32}{3}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İki Eğri Arası</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = x$ ve $y = x^2$ eğrileri arasında kalan alan kaç birim karedir?<br><br>
      <strong>A)</strong> $\\dfrac{1}{12}$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{1}{6}$</span> &nbsp; <strong>C)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>D)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>E)</strong> $1$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Kesişim: $x = x^2 \\Rightarrow x=0, x=1$. $[0,1]$ üzerinde $x \\ge x^2$.</p>
      <p class="ales-sol-step">$\\int_0^1 (x - x^2)\\,dx = \\dfrac{x^2}{2} - \\dfrac{x^3}{3}\\Big|_0^1 = \\dfrac{1}{2} - \\dfrac{1}{3} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{1}{6}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İki Eğri Arası — Genişletilmiş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $y = 2x$ ve $y = x^2$ eğrileri arasında kalan alan kaç birim karedir?<br><br>
      <strong>A)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{4}{3}$</span> &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $\\dfrac{8}{3}$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Kesişim: $2x = x^2 \\Rightarrow x(x-2) = 0 \\Rightarrow x=0, x=2$.</p>
      <p class="ales-sol-step">$[0,2]$ üzerinde $2x \\ge x^2$. $\\int_0^2 (2x - x^2)dx = x^2 - \\dfrac{x^3}{3}\\Big|_0^2 = 4 - \\dfrac{8}{3} = \\dfrac{4}{3}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{4}{3}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Dönel Hacim — x ekseni</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $y = x$ doğrusu, $x=0$, $x=2$ ve $x$ ekseni arasındaki bölge $x$ ekseni etrafında döndürülürse oluşan koninin hacmi kaç birim küptür?<br><br>
      <strong>A)</strong> $\\dfrac{2\\pi}{3}$ &nbsp; <strong>B)</strong> $2\\pi$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{8\\pi}{3}$</span> &nbsp; <strong>D)</strong> $4\\pi$ &nbsp; <strong>E)</strong> $8\\pi$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$V = \\pi \\int_a^b [f(x)]^2 dx = \\pi \\int_0^2 x^2 \\, dx$.</p>
      <p class="ales-sol-step">$\\pi \\cdot \\dfrac{x^3}{3}\\Big|_0^2 = \\pi \\cdot \\dfrac{8}{3} = \\dfrac{8\\pi}{3}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{8\\pi}{3}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Dönel Hacim — Parabol</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $y = \\sqrt{x}$ eğrisi, $x=0$ ve $x=4$ arasında $x$ ekseni etrafında döndürülürse hacim kaç birim küptür?<br><br>
      <strong>A)</strong> $2\\pi$ &nbsp; <strong>B)</strong> $4\\pi$ &nbsp; <strong>C)</strong> $6\\pi$ &nbsp; <strong>D)</strong> <span class="key">$8\\pi$</span> &nbsp; <strong>E)</strong> $16\\pi$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$V = \\pi \\int_0^4 (\\sqrt{x})^2 dx = \\pi \\int_0^4 x \\, dx$.</p>
      <p class="ales-sol-step">$\\pi \\cdot \\dfrac{x^2}{2}\\Big|_0^4 = \\pi \\cdot 8 = 8\\pi$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) $8\\pi$</span></p>
    </div>
  </div>
</section>
`
};
