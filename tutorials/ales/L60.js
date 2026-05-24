window.ALES_LESSON = {
n: 60,
title: "Limit ve Süreklilik",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>limit ve süreklilik</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. ALES Sayısal'ın son bölümü kalkülüstür ve genelde 3-5 soru gelir. Burada <em>polinom limitleri</em>, <em>belirsiz biçimler</em> ($0/0$, $\\infty/\\infty$) ve <em>parçalı fonksiyonların sürekliliği</em> üzerinde durulur. Her problem 5-şıklı ALES formatında verilmiştir.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Polinom ve Rasyonel Limitler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Polinom ve Rasyonel Limitler (Yerine Koyma)</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Polinom Limiti</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 2}(x^2 + 3x - 1)$ değeri kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> <span class="key">9</span> &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 13 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Polinom her noktada süreklidir. Doğrudan $x=2$ yerine koy.</p>
      <p class="ales-sol-step">$2^2 + 3(2) - 1 = 4 + 6 - 1 = 9$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) 9</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Rasyonel — Pay Sıfır Değil</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 1}\\dfrac{2x+3}{x+4}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>C)</strong> <span class="key">1</span> &nbsp; <strong>D)</strong> $\\dfrac{5}{4}$ &nbsp; <strong>E)</strong> $\\dfrac{3}{2}$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Paydanın limiti $1+4=5 \\ne 0$ olduğundan doğrudan yerine koy.</p>
      <p class="ales-sol-step">$\\dfrac{2(1)+3}{1+4} = \\dfrac{5}{5} = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üç Terimli</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to -1}(x^3 - 2x^2 + 5x + 4)$ değeri kaçtır?<br><br>
      <strong>A)</strong> $-6$ &nbsp; <strong>B)</strong> $-5$ &nbsp; <strong>C)</strong> <span class="key">$-4$</span> &nbsp; <strong>D)</strong> $-2$ &nbsp; <strong>E)</strong> $0$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$x=-1$ koy: $(-1)^3 - 2(-1)^2 + 5(-1) + 4 = -1 - 2 - 5 + 4 = -4$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $-4$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Köklü İfade</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 9}\\dfrac{\\sqrt{x}+1}{x-5}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{2}{3}$ &nbsp; <strong>C)</strong> $\\dfrac{3}{4}$ &nbsp; <strong>D)</strong> <span class="key">$1$</span> &nbsp; <strong>E)</strong> $\\dfrac{5}{4}$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$x=9$ koy. Pay: $\\sqrt{9}+1 = 3+1 = 4$. Payda: $9-5 = 4$.</p>
      <p class="ales-sol-step">Sonuç: $\\dfrac{4}{4} = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Sonsuzda Limit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to \\infty}\\dfrac{3x^2 + 2x - 1}{6x^2 - 5}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $\\dfrac{1}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{1}{2}$</span> &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Pay ve paydanın derecesi eşit (2). Limit $=$ baş katsayıların oranı.</p>
      <p class="ales-sol-step">$\\dfrac{3}{6} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{1}{2}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Sonsuzda Limit — Derece Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to \\infty}\\dfrac{2x+7}{x^2-3}$ değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">$0$</span> &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> $2$ &nbsp; <strong>D)</strong> $3$ &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Pay derecesi $1$, payda derecesi $2$. Payda daha hızlı büyür.</p>
      <p class="ales-sol-step">Pay derecesi $<$ Payda derecesi $\\Rightarrow$ limit $= 0$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">A) 0</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sonsuz — Üst Derece</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to \\infty}\\dfrac{x^3-2x}{x^2+5}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> $1$ &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> <span class="key">$\\infty$</span>
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Pay derecesi $3$, payda derecesi $2$. Pay daha hızlı büyür.</p>
      <p class="ales-sol-step">Pay derecesi $>$ Payda derecesi ve baş katsayılar pozitif $\\Rightarrow$ limit $= +\\infty$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">E) $\\infty$</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Belirsiz Biçimler (0/0, infty/infty)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Belirsiz Biçimler: Faktörleme ve L'Hôpital</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">0/0 — Faktörleme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 2}\\dfrac{x^2-4}{x-2}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> $3$ &nbsp; <strong>D)</strong> <span class="key">$4$</span> &nbsp; <strong>E)</strong> $8$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$x=2$ koyunca $\\dfrac{0}{0}$ belirsizliği. Pay'ı faktörle: $x^2-4 = (x-2)(x+2)$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to 2}\\dfrac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2}(x+2) = 4$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) 4</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">0/0 — İkinci Derece</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 3}\\dfrac{x^2-5x+6}{x-3}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $-1$ &nbsp; <strong>B)</strong> $0$ &nbsp; <strong>C)</strong> <span class="key">$1$</span> &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Pay: $x^2-5x+6 = (x-2)(x-3)$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to 3}\\dfrac{(x-2)(x-3)}{x-3} = \\lim_{x \\to 3}(x-2) = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">0/0 — Küp Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 1}\\dfrac{x^3-1}{x-1}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $1$ &nbsp; <strong>B)</strong> $2$ &nbsp; <strong>C)</strong> <span class="key">$3$</span> &nbsp; <strong>D)</strong> $4$ &nbsp; <strong>E)</strong> $6$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Küp farkı özdeşliği: $x^3-1 = (x-1)(x^2+x+1)$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to 1}(x^2+x+1) = 1+1+1 = 3$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 3</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">0/0 — L'Hôpital</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 0}\\dfrac{\\sin x}{x}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$1$</span> &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Klasik temel limit ya da L'Hôpital uygula. Pay türevi: $\\cos x$. Payda türevi: $1$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to 0}\\dfrac{\\cos x}{1} = \\cos 0 = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">0/0 — Köklü Eşlenik</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 4}\\dfrac{\\sqrt{x}-2}{x-4}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{1}{4}$</span> &nbsp; <strong>C)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>D)</strong> $1$ &nbsp; <strong>E)</strong> $2$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Eşlenikle çarp: pay ve paydayı $(\\sqrt{x}+2)$ ile çarp.</p>
      <p class="ales-sol-step">$\\dfrac{(\\sqrt{x}-2)(\\sqrt{x}+2)}{(x-4)(\\sqrt{x}+2)} = \\dfrac{x-4}{(x-4)(\\sqrt{x}+2)} = \\dfrac{1}{\\sqrt{x}+2}$.</p>
      <p class="ales-sol-step">$x=4$: $\\dfrac{1}{2+2} = \\dfrac{1}{4}$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{1}{4}$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">L'Hôpital — Üstel</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 0}\\dfrac{e^x-1}{x}$ değeri kaçtır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> <span class="key">$1$</span> &nbsp; <strong>D)</strong> $e$ &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$\\dfrac{0}{0}$ belirsizliği. L'Hôpital: pay türevi $e^x$, payda türevi $1$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to 0}\\dfrac{e^x}{1} = e^0 = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">infty/infty — L'Hôpital</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to \\infty}\\dfrac{\\ln x}{x}$ değeri kaçtır?<br><br>
      <strong>A)</strong> <span class="key">$0$</span> &nbsp; <strong>B)</strong> $\\dfrac{1}{e}$ &nbsp; <strong>C)</strong> $1$ &nbsp; <strong>D)</strong> $e$ &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$\\dfrac{\\infty}{\\infty}$ belirsizliği. L'Hôpital: pay türevi $\\dfrac{1}{x}$, payda türevi $1$.</p>
      <p class="ales-sol-step">$\\lim_{x \\to \\infty}\\dfrac{1/x}{1} = \\lim_{x \\to \\infty}\\dfrac{1}{x} = 0$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">A) 0</span></p>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Süreklilik, Parçalı Fonksiyonlar, Yan Limitler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Süreklilik, Parçalı Fonksiyonlar, Yan Limitler</h2>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Süreklilik Koşulu</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir $f$ fonksiyonunun $x=a$ noktasında sürekli olması için aşağıdakilerden hangisi <strong>yeterli değildir</strong>?<br><br>
      <strong>A)</strong> $f(a)$ tanımlı &nbsp; <strong>B)</strong> $\\lim_{x \\to a}f(x)$ var &nbsp; <strong>C)</strong> $\\lim_{x \\to a}f(x) = f(a)$ &nbsp; <strong>D)</strong> Sol ve sağ limit eşit &nbsp; <strong>E)</strong> <span class="key">$f$ türevli</span>
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Süreklilik üç koşul ister: (i) $f(a)$ tanımlı, (ii) $\\lim_{x \\to a}f(x)$ var, (iii) ikisi eşit.</p>
      <p class="ales-sol-step">Türevli olmak süreklilikten <em>daha güçlüdür</em>; süreklilik için gerekli değildir. (Örn: $|x|$, $x=0$'da sürekli ama türevsiz.)</p>
      <p class="ales-sol-answer">Cevap: <span class="key">E) $f$ türevli</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Parçalı — Süreklilik için a</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\begin{cases} x+a, & x < 1 \\\\ 3x-1, & x \\ge 1 \\end{cases}$ fonksiyonunun $x=1$'de sürekli olması için $a$ kaç olmalıdır?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> <span class="key">$1$</span> &nbsp; <strong>C)</strong> $2$ &nbsp; <strong>D)</strong> $3$ &nbsp; <strong>E)</strong> $4$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Sol limit: $\\lim_{x \\to 1^-}(x+a) = 1+a$.</p>
      <p class="ales-sol-step">Sağ limit ve değer: $3(1)-1 = 2$.</p>
      <p class="ales-sol-step">Eşitle: $1+a = 2 \\Rightarrow a = 1$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) 1</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Parçalı — İki Parametre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\begin{cases} 2x+b, & x \\le 0 \\\\ x^2-3, & x > 0 \\end{cases}$ fonksiyonunun her yerde sürekli olması için $b$ kaç olmalıdır?<br><br>
      <strong>A)</strong> $-5$ &nbsp; <strong>B)</strong> <span class="key">$-3$</span> &nbsp; <strong>C)</strong> $0$ &nbsp; <strong>D)</strong> $2$ &nbsp; <strong>E)</strong> $3$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$x=0$'da sol değer: $2(0)+b = b$.</p>
      <p class="ales-sol-step">Sağ limit: $\\lim_{x \\to 0^+}(x^2-3) = -3$.</p>
      <p class="ales-sol-step">Eşitle: $b = -3$.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">B) $-3$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Yan Limitler — Mutlak Değer</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\lim_{x \\to 0}\\dfrac{|x|}{x}$ için doğru olan hangisidir?<br><br>
      <strong>A)</strong> $0$ &nbsp; <strong>B)</strong> $1$ &nbsp; <strong>C)</strong> $-1$ &nbsp; <strong>D)</strong> <span class="key">Limit yoktur (sol $=-1$, sağ $=+1$)</span> &nbsp; <strong>E)</strong> $\\infty$
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">$x>0$ için $|x|/x = 1$. $x<0$ için $|x|/x = -1$.</p>
      <p class="ales-sol-step">Sağ limit $1$, sol limit $-1$. Eşit olmadığından limit yoktur.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">D) Limit yoktur</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Süreksizlik Noktası</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\dfrac{x^2-9}{x-3}$ fonksiyonu hangi noktada süreksizdir?<br><br>
      <strong>A)</strong> $x=0$ &nbsp; <strong>B)</strong> $x=-3$ &nbsp; <strong>C)</strong> <span class="key">$x=3$</span> &nbsp; <strong>D)</strong> $x=9$ &nbsp; <strong>E)</strong> Süreklidir
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Payda $x-3 = 0 \\Rightarrow x=3$ noktasında fonksiyon tanımsız.</p>
      <p class="ales-sol-step">Limit $\\lim_{x \\to 3}\\dfrac{(x-3)(x+3)}{x-3} = 6$ olmasına rağmen $f(3)$ tanımsız olduğundan süreksiz (kaldırılabilir süreksizlik).</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) $x=3$</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Parçalı — Süreklilik Kontrol</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\begin{cases} x^2, & x < 2 \\\\ 5, & x = 2 \\\\ 3x-2, & x > 2 \\end{cases}$ fonksiyonu $x=2$'de hangi durumdadır?<br><br>
      <strong>A)</strong> Süreklidir &nbsp; <strong>B)</strong> Sol limit yoktur &nbsp; <strong>C)</strong> <span class="key">Süreksizdir ($f(2)=5$ farklı)</span> &nbsp; <strong>D)</strong> Tanımsızdır &nbsp; <strong>E)</strong> Sağ limit yoktur
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Sol limit: $\\lim_{x \\to 2^-} x^2 = 4$.</p>
      <p class="ales-sol-step">Sağ limit: $\\lim_{x \\to 2^+}(3x-2) = 4$. Limit $=4$ var.</p>
      <p class="ales-sol-step">Ama $f(2)=5 \\ne 4$. Üçüncü süreklilik koşulu sağlanmıyor.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) Süreksizdir</span></p>
    </div>
  </div>

  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sıçrama Süreksizliği</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $f(x) = \\begin{cases} x+1, & x \\le 0 \\\\ x-2, & x > 0 \\end{cases}$ fonksiyonu için $x=0$'da süreksizlik tipi nedir?<br><br>
      <strong>A)</strong> Süreklidir &nbsp; <strong>B)</strong> Kaldırılabilir &nbsp; <strong>C)</strong> <span class="key">Sıçrama (jump)</span> &nbsp; <strong>D)</strong> Sonsuz &nbsp; <strong>E)</strong> Salınımlı
    </div>
    <div class="ales-sol">
      <p class="ales-sol-step">Sol limit: $\\lim_{x \\to 0^-}(x+1) = 1$.</p>
      <p class="ales-sol-step">Sağ limit: $\\lim_{x \\to 0^+}(x-2) = -2$.</p>
      <p class="ales-sol-step">İki sonlu limit farklı $\\Rightarrow$ sıçrama süreksizliği.</p>
      <p class="ales-sol-answer">Cevap: <span class="key">C) Sıçrama</span></p>
    </div>
  </div>
</section>
`
};
