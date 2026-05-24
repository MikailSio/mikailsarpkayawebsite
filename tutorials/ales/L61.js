window.ALES_LESSON = {
n: 61,
title: "Türev",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>türev</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Türev kuralları (polinom, çarpım, bölüm, zincir), ekstremum-monotonluk uygulamaları ve trig/üstel/log türevlerini ALES tarzında pekiştirir.</p>
</div>

<!-- ============================================================
     ALT KONU 2.1 — Türev Kuralları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">2.1</span>
    <h2 class="ales-sub-title">Türev Kuralları: Polinom, Çarpım, Bölüm, Zincir</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Polinom Türevi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = 3x^2 - 5x + 7$ ise $f'(2)$ kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $6$ &nbsp; <strong>C)</strong> <span class="key">$7$</span> &nbsp; <strong>D)</strong> $9$ &nbsp; <strong>E)</strong> $12$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 6x - 5$.</p>
      <p class="ales-sol-step">$f'(2) = 6(2)-5 = 12-5 = 7$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 7</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Üs Kuralı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^5 + 4x^3 - 2x$ ise $f'(1)$ kaçtır?<br><br>
      <strong>A)</strong> $9$ &nbsp; <strong>B)</strong> $12$ &nbsp; <strong>C)</strong> <span class="key">$15$</span> &nbsp; <strong>D)</strong> $17$ &nbsp; <strong>E)</strong> $20$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 5x^4 + 12x^2 - 2$.</p>
      <p class="ales-sol-step">$f'(1) = 5 + 12 - 2 = 15$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 15</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Çarpım Kuralı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = (2x+1)(x^2-3)$ ise $f'(2)$ kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $13$ &nbsp; <strong>C)</strong> $17$ &nbsp; <strong>D)</strong> <span class="key">$22$</span> &nbsp; <strong>E)</strong> $25$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Çarpım kuralı: $f' = u'v + uv'$. $u=2x+1, u'=2$; $v=x^2-3, v'=2x$.</p>
      <p class="ales-sol-step">$f'(x) = 2(x^2-3) + (2x+1)(2x) = 2x^2-6 + 4x^2+2x = 6x^2+2x-6$.</p>
      <p class="ales-sol-step">$f'(2) = 6(4)+2(2)-6 = 24+4-6 = 22$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 22</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bölüm Kuralı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\dfrac{x+1}{x-1}$ ise $f'(2)$ kaçtır?<br><br>
      <strong>A)</strong> $-3$ &nbsp; <strong>B)</strong> <span class="key">$-2$</span> &nbsp; <strong>C)</strong> $-1$ &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Bölüm: $f' = \\dfrac{u'v - uv'}{v^2}$. $u=x+1, u'=1$; $v=x-1, v'=1$.</p>
      <p class="ales-sol-step">$f'(x) = \\dfrac{(1)(x-1) - (x+1)(1)}{(x-1)^2} = \\dfrac{-2}{(x-1)^2}$.</p>
      <p class="ales-sol-step">$f'(2) = \\dfrac{-2}{1} = -2$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $-2$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Zincir Kuralı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = (3x^2-1)^4$ ise $f'(1)$ kaçtır?<br><br>
      <strong>A)</strong> $24$ &nbsp; <strong>B)</strong> $48$ &nbsp; <strong>C)</strong> $96$ &nbsp; <strong>D)</strong> <span class="key">$192$</span> &nbsp; <strong>E)</strong> $384$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Zincir: $f'(x) = 4(3x^2-1)^3 \\cdot (6x) = 24x(3x^2-1)^3$.</p>
      <p class="ales-sol-step">$f'(1) = 24(1)(3-1)^3 = 24 \\cdot 8 = 192$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 192</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Köklü — Zincir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\sqrt{x^2+5}$ ise $f'(2)$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{2}{3}$</span> &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $\\dfrac{4}{3}$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f(x) = (x^2+5)^{1/2}$. Zincir: $f'(x) = \\dfrac{1}{2}(x^2+5)^{-1/2}\\cdot 2x = \\dfrac{x}{\\sqrt{x^2+5}}$.</p>
      <p class="ales-sol-step">$f'(2) = \\dfrac{2}{\\sqrt{9}} = \\dfrac{2}{3}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{2}{3}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Çarpım + Zincir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x \\cdot (x+1)^3$ ise $f'(1)$ kaçtır?<br><br>
      <strong>A)</strong> $8$ &nbsp; <strong>B)</strong> $12$ &nbsp; <strong>C)</strong> $16$ &nbsp; <strong>D)</strong> <span class="key">$20$</span> &nbsp; <strong>E)</strong> $24$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Çarpım: $f'(x) = (1)(x+1)^3 + x \\cdot 3(x+1)^2 = (x+1)^2[(x+1)+3x] = (x+1)^2(4x+1)$.</p>
      <p class="ales-sol-step">$f'(1) = (2)^2 \\cdot 5 = 4 \\cdot 5 = 20$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 20</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 2.2 — Ekstremum ve Monotonluk
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">2.2</span>
    <h2 class="ales-sub-title">Ekstremum (Min/Max) ve Monotonluk Testi</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Kritik Nokta</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^2 - 6x + 5$ fonksiyonunun ekstremum noktası nerede oluşur?<br><br>
      <strong>A)</strong> $x=1$ &nbsp; <strong>B)</strong> $x=2$ &nbsp; <strong>C)</strong> <span class="key">$x=3$</span> &nbsp; <strong>D)</strong> $x=5$ &nbsp; <strong>E)</strong> $x=6$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.</p>
      <p class="ales-sol-step">$f''(x) = 2 > 0$ olduğundan $x=3$ <strong>minimum</strong> noktasıdır.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $x=3$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Minimum Değer</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^2 - 4x + 7$ fonksiyonunun aldığı en küçük değer kaçtır?<br><br>
      <strong>A)</strong> $1$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> <span class="key">$3$</span> &nbsp; <strong>D)</strong> $4$ &nbsp; <strong>E)</strong> $7$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 2x-4 = 0 \\Rightarrow x=2$.</p>
      <p class="ales-sol-step">$f(2) = 4-8+7 = 3$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 3</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">İki Kritik Nokta</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^3 - 3x^2 + 4$ fonksiyonunun yerel maksimum noktası nerededir?<br><br>
      <strong>A)</strong> <span class="key">$x=0$</span> &nbsp; <strong>B)</strong> $x=1$ &nbsp; <strong>C)</strong> $x=2$ &nbsp; <strong>D)</strong> $x=3$ &nbsp; <strong>E)</strong> $x=4$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 3x^2 - 6x = 3x(x-2) = 0 \\Rightarrow x=0$ veya $x=2$.</p>
      <p class="ales-sol-step">$f''(x) = 6x-6$. $f''(0) = -6 < 0 \\Rightarrow$ maksimum. $f''(2) = 6 > 0 \\Rightarrow$ minimum.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">A) $x=0$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Monotonluk Aralığı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^3 - 12x$ fonksiyonu hangi aralıkta <strong>azalandır</strong>?<br><br>
      <strong>A)</strong> $(-\\infty, -2)$ &nbsp; <strong>B)</strong> $(-\\infty, 0)$ &nbsp; <strong>C)</strong> <span class="key">$(-2, 2)$</span> &nbsp; <strong>D)</strong> $(0, 2)$ &nbsp; <strong>E)</strong> $(2, \\infty)$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 3x^2 - 12 = 3(x^2-4) = 3(x-2)(x+2)$.</p>
      <p class="ales-sol-step">$f'(x) < 0 \\Leftrightarrow -2 < x < 2$. Bu aralıkta azalan.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $(-2, 2)$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Maksimum Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = -x^2 + 6x - 5$ fonksiyonunun aldığı en büyük değer kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> <span class="key">$4$</span> &nbsp; <strong>D)</strong> $6$ &nbsp; <strong>E)</strong> $9$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = -2x+6 = 0 \\Rightarrow x=3$.</p>
      <p class="ales-sol-step">$f(3) = -9+18-5 = 4$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 4</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Uygulama — Alan Maksimum</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Çevresi $40$ m olan bir dikdörtgenin alanı maksimum olduğunda kenar uzunluğu kaç metredir?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $8$ &nbsp; <strong>C)</strong> <span class="key">$10$</span> &nbsp; <strong>D)</strong> $15$ &nbsp; <strong>E)</strong> $20$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Kenarlar $x, y$ ve $2x+2y = 40 \\Rightarrow y = 20-x$. Alan: $A(x) = x(20-x) = 20x - x^2$.</p>
      <p class="ales-sol-step">$A'(x) = 20 - 2x = 0 \\Rightarrow x = 10$. Yani kare $(10 \\times 10)$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 10</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Uygulama — Minimum Maliyet</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $C(x) = x^2 - 8x + 25$ maliyet fonksiyonunun minimumda aldığı değer kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $7$ &nbsp; <strong>C)</strong> <span class="key">$9$</span> &nbsp; <strong>D)</strong> $13$ &nbsp; <strong>E)</strong> $17$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$C'(x) = 2x - 8 = 0 \\Rightarrow x = 4$.</p>
      <p class="ales-sol-step">$C(4) = 16 - 32 + 25 = 9$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 9</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 2.3 — Trig, Üstel, Log, İkinci Türev
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">2.3</span>
    <h2 class="ales-sub-title">Trig / Üstel / Log Türev ve İkinci Türev</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Sinüs Türevi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\sin x + \\cos x$ ise $f'(0)$ kaçtır?<br><br>
      <strong>A)</strong> $-1$ &nbsp; <strong>B)</strong> $0$ &nbsp; <strong>C)</strong> <span class="key">$1$</span> &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $\\pi$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = \\cos x - \\sin x$.</p>
      <p class="ales-sol-step">$f'(0) = \\cos 0 - \\sin 0 = 1 - 0 = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Üstel Türev</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = e^{2x}$ ise $f'(0)$ kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> <span class="key">$2$</span> &nbsp; <strong>D)</strong> $e$ &nbsp; <strong>E)</strong> $e^2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Zincir: $f'(x) = e^{2x} \\cdot 2 = 2e^{2x}$.</p>
      <p class="ales-sol-step">$f'(0) = 2 \\cdot e^0 = 2 \\cdot 1 = 2$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 2</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Logaritma Türevi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\ln(3x)$ ise $f'(2)$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{6}$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>E)</strong> $1$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f(x) = \\ln 3 + \\ln x$ ya da zincir: $f'(x) = \\dfrac{1}{3x}\\cdot 3 = \\dfrac{1}{x}$.</p>
      <p class="ales-sol-step">$f'(2) = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{2}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İkinci Türev</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^4 - 2x^3 + x$ ise $f''(1)$ kaçtır?<br><br>
      <strong>A)</strong> $-2$ &nbsp; <strong>B)</strong> <span class="key">$0$</span> &nbsp; <strong>C)</strong> $4$ &nbsp; <strong>D)</strong> $6$ &nbsp; <strong>E)</strong> $8$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 4x^3 - 6x^2 + 1$.</p>
      <p class="ales-sol-step">$f''(x) = 12x^2 - 12x$.</p>
      <p class="ales-sol-step">$f''(1) = 12(1)^2 - 12(1) = 12 - 12 = 0$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) 0</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Konkavlık</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x^3 - 6x^2 + 9x + 1$ fonksiyonunun büküm (dönüm) noktası hangi $x$ değerindedir?<br><br>
      <strong>A)</strong> $x=0$ &nbsp; <strong>B)</strong> $x=1$ &nbsp; <strong>C)</strong> <span class="key">$x=2$</span> &nbsp; <strong>D)</strong> $x=3$ &nbsp; <strong>E)</strong> $x=4$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 3x^2 - 12x + 9$, $f''(x) = 6x - 12$.</p>
      <p class="ales-sol-step">Büküm: $f''(x) = 0 \\Rightarrow 6x = 12 \\Rightarrow x = 2$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $x=2$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Trig — Zincir</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\sin(2x)$ ise $f'\\left(\\dfrac{\\pi}{6}\\right)$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{\\sqrt{2}}{2}$ &nbsp; <strong>C)</strong> <span class="key">$1$</span> &nbsp; <strong>D)</strong> $\\sqrt{3}$ &nbsp; <strong>E)</strong> $2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$f'(x) = 2\\cos(2x)$.</p>
      <p class="ales-sol-step">$f'(\\pi/6) = 2\\cos(\\pi/3) = 2 \\cdot \\dfrac{1}{2} = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Üstel Çarpan</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = x e^x$ ise $f'(0)$ kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> <span class="key">$1$</span> &nbsp; <strong>C)</strong> $e$ &nbsp; <strong>D)</strong> $2e$ &nbsp; <strong>E)</strong> $e^2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Çarpım kuralı: $f'(x) = 1 \\cdot e^x + x \\cdot e^x = e^x(1+x)$.</p>
      <p class="ales-sol-step">$f'(0) = e^0(1+0) = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) 1</span></p>
    </div>
  </div>
</section>
`
};
