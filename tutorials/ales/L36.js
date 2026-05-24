window.ALES_LESSON = {
n: 36,
title: "Havuz Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>havuz problemleri</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. İşçi-iş mantığının havuz versiyonu: <em>"$x$ saatte dolduran musluk, 1 saatte havuzun $\\dfrac{1}{x}$'ini doldurur."</em> Boşaltma muslukları <strong>negatif tempo</strong> olarak girer.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Doldurma Muslukları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Doldurma Muslukları (Saatte 1/a)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Tek Musluk · Saatlik İş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir havuzu tek başına $8$ saatte dolduran musluk, $1$ saatte havuzun kaçta kaçını doldurur?<br><br>
      <strong>A)</strong> <span class="key">1 /8</span> &nbsp; <strong>B)</strong> 2 /8 &nbsp; <strong>C)</strong> 4 /8 &nbsp; <strong>D)</strong> 5 /8 &nbsp; <strong>E)</strong> 6 /8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$x$ saatte dolduruyorsa 1 saatlik tempo $= \\dfrac{1}{x}$. Burada $\\dfrac{1}{8}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1 /8</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İki Musluk Birlikte</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir havuzu A musluğu $6$ saatte, B musluğu $12$ saatte dolduruyor. İki musluk birlikte açılırsa havuz kaç saatte dolar?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{2+1}{12} = \\dfrac{3}{12} = \\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">Birlikte 1 saatte $\\dfrac{1}{4}$ ⟹ tüm havuz $4$ saatte.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Hızlı Formül</div>
      <p class="ales-sol-step">$T = \\dfrac{ab}{a+b} = \\dfrac{6 \\cdot 12}{18} = 4$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üç Musluk</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A, B, C muslukları boş bir havuzu sırasıyla $4$, $6$, $12$ saatte dolduruyor. Üçü birlikte açılırsa havuz kaç saatte dolar?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">2</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{4} + \\dfrac{1}{6} + \\dfrac{1}{12} = \\dfrac{3 + 2 + 1}{12} = \\dfrac{6}{12} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Birlikte 1 saatte yarısı ⟹ tamamı $2$ saatte.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 2</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Bilinmeyen Süre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A ve B muslukları birlikte boş bir havuzu $4$ saatte dolduruyor. A musluğu tek başına $6$ saatte dolduruyorsa B tek başına havuzu kaç saatte doldurur?<br><br>
      <strong>A)</strong> <span class="key">12</span> &nbsp; <strong>B)</strong> 13 &nbsp; <strong>C)</strong> 14 &nbsp; <strong>D)</strong> 16 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{6} + \\dfrac{1}{B} = \\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{B} = \\dfrac{1}{4} - \\dfrac{1}{6} = \\dfrac{3-2}{12} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">B $= 12$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 12</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Kısmi Dolu Havuz</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{4}$'ü dolu olan bir havuza saatte $\\dfrac{1}{8}$'i kadar su veren bir musluk açılıyor. Havuz kaç saatte dolar?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> <span class="key">6</span> &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Doldurulacak miktar $= 1 - \\dfrac{1}{4} = \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">Süre $= \\dfrac{3/4}{1/8} = \\dfrac{3}{4} \\cdot 8 = 6$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 6</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Hacimle Hesap</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Hacmi $480$ litre olan bir havuza dakikada $20$ litre su akıtan bir musluk açılıyor. Havuz boştan kaç dakikada dolar?<br><br>
      <strong>A)</strong> 15 dk &nbsp; <strong>B)</strong> 21 dk &nbsp; <strong>C)</strong> <span class="key">24 dk</span> &nbsp; <strong>D)</strong> 25 dk &nbsp; <strong>E)</strong> 29 dk
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Süre $= 480 / 20 = 24$ dakika.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24 dk</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Üçlü Bilinmeyen</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A ile B birlikte boş havuzu $6$ saatte, A ile C birlikte $4$ saatte, B ile C birlikte $3$ saatte dolduruyor. Üçü birlikte havuzu kaç saatte doldurur?<br><br>
      <strong>A)</strong> 3 /3 saat &nbsp; <strong>B)</strong> 5 /3 saat &nbsp; <strong>C)</strong> 7 /3 saat &nbsp; <strong>D)</strong> <span class="key">8 /3 saat</span> &nbsp; <strong>E)</strong> 11 /3 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tempo Toplama</div>
      <p class="ales-sol-step">$(A+B) + (A+C) + (B+C) = 2(A+B+C)$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{6} + \\dfrac{1}{4} + \\dfrac{1}{3} = \\dfrac{2+3+4}{12} = \\dfrac{9}{12} = \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">$2(A+B+C) = \\dfrac{3}{4} \\Rightarrow (A+B+C) = \\dfrac{3}{8}$.</p>
      <p class="ales-sol-step">Üçü birlikte 1 saatte $\\dfrac{3}{8}$ ⟹ tamamı $\\dfrac{8}{3}$ saat $\\approx 2$ saat $40$ dk.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 8 /3 saat</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Boşaltma + Birlikte
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Boşaltma Muslukları + Birlikte (1/a − 1/b)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Doldur + Boşalt</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir havuzu A musluğu $6$ saatte dolduruyor; B musluğu (boşaltma) tam dolu havuzu $12$ saatte boşaltıyor. Havuz boşken her iki musluk birlikte açılırsa kaç saatte dolar?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">12</span> &nbsp; <strong>C)</strong> 14 &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Doldurma tempo: $\\dfrac{1}{6}$, boşaltma tempo (negatif): $-\\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{6} - \\dfrac{1}{12} = \\dfrac{2-1}{12} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">Tam dolma süresi $= 12$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İki Doldur · Bir Boşalt</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A musluğu havuzu $4$ saatte, B musluğu $6$ saatte dolduruyor; C musluğu (boşaltma) $8$ saatte boşaltıyor. Üçü birlikte boş havuzu kaç saatte doldurur?<br><br>
      <strong>A)</strong> 19 /7 saat &nbsp; <strong>B)</strong> <span class="key">24 /7 saat</span> &nbsp; <strong>C)</strong> 27 /7 saat &nbsp; <strong>D)</strong> 32 /7 saat &nbsp; <strong>E)</strong> 48 /7 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{4} + \\dfrac{1}{6} - \\dfrac{1}{8}$.</p>
      <p class="ales-sol-step">LCD $= 24$: $\\dfrac{6}{24} + \\dfrac{4}{24} - \\dfrac{3}{24} = \\dfrac{7}{24}$.</p>
      <p class="ales-sol-step">Süre $= \\dfrac{24}{7}$ saat $\\approx 3$ saat $26$ dk.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 24 /7 saat</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Yarı Dolu + Boşaltma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1}{2}$'si dolu olan bir havuza A musluğu açılıyor (saatte $\\dfrac{1}{6}$ doldurur) ve aynı anda B musluğu açılıyor (saatte $\\dfrac{1}{10}$ boşaltır). Havuz kaç saatte tamamen dolar?<br><br>
      <strong>A)</strong> 6.5 saat &nbsp; <strong>B)</strong> <span class="key">7.5 saat</span> &nbsp; <strong>C)</strong> 8 saat &nbsp; <strong>D)</strong> 8.5 saat &nbsp; <strong>E)</strong> 9 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{6} - \\dfrac{1}{10} = \\dfrac{5-3}{30} = \\dfrac{2}{30} = \\dfrac{1}{15}$.</p>
      <p class="ales-sol-step">Doldurulacak miktar $= 1 - \\dfrac{1}{2} = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Süre $= \\dfrac{1/2}{1/15} = \\dfrac{15}{2} = 7{,}5$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 7.5 saat</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Bilinmeyen Boşaltma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $5$ saatte dolduruyor. Boşaltma musluğu $C$ ile birlikte açıldığında havuz $10$ saatte doluyor. C musluğu tam dolu havuzu kaç saatte boşaltır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 8 &nbsp; <strong>C)</strong> <span class="key">10</span> &nbsp; <strong>D)</strong> 12 &nbsp; <strong>E)</strong> 15
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{1}{5} - \\dfrac{1}{C} = \\dfrac{1}{10}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{C} = \\dfrac{1}{5} - \\dfrac{1}{10} = \\dfrac{2-1}{10} = \\dfrac{1}{10}$.</p>
      <p class="ales-sol-step">C $= 10$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Boşaltma + Hacim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Hacmi $600$ litre olan bir havuzun A musluğu dakikada $30$ litre dolduruyor; B boşaltma musluğu dakikada $20$ litre boşaltıyor. Boş havuz, her iki musluk birlikte açılırsa kaç dakikada dolar?<br><br>
      <strong>A)</strong> 30 dk (1 saat) &nbsp; <strong>B)</strong> 51 dk (1 saat) &nbsp; <strong>C)</strong> 59 dk (1 saat) &nbsp; <strong>D)</strong> <span class="key">60 dk (1 saat)</span> &nbsp; <strong>E)</strong> 63 dk (1 saat)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Net dolma hızı $= 30 - 20 = 10$ L/dk.</p>
      <p class="ales-sol-step">Süre $= 600 / 10 = 60$ dakika $= 1$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 60 dk (1 saat)</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Doldurma + Boşaltma · Kısmi Dolu</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir havuzu A musluğu $4$ saatte dolduruyor, B musluğu $6$ saatte boşaltıyor. Havuz $\\dfrac{2}{3}$ doluyken hem A hem B aynı anda açılırsa havuz kaç saatte tamamen dolar?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">4</span> &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 9
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{4} - \\dfrac{1}{6} = \\dfrac{3-2}{12} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">Doldurulacak miktar $= 1 - \\dfrac{2}{3} = \\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">Süre $= \\dfrac{1/3}{1/12} = \\dfrac{12}{3} = 4$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 4</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Doldurma + İki Boşaltma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $3$ saatte dolduruyor; B ve C boşaltma muslukları sırasıyla $9$ ve $18$ saatte boşaltıyor. Üçü birlikte boş havuzu kaç saatte doldurur?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">6</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{3} - \\dfrac{1}{9} - \\dfrac{1}{18}$.</p>
      <p class="ales-sol-step">LCD $= 18$: $\\dfrac{6}{18} - \\dfrac{2}{18} - \\dfrac{1}{18} = \\dfrac{3}{18} = \\dfrac{1}{6}$.</p>
      <p class="ales-sol-step">Süre $= 6$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Kademeli Açma + "Havuz Dolmaz" Tuzağı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Kademeli Açma-Kapama + "Dolmaz" Tuzağı</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Önce A · Sonra A+B</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $8$ saatte dolduruyor. B musluğu $12$ saatte dolduruyor. A önce $2$ saat tek başına açılıp sonra B de açılırsa, havuz toplam kaç saatte dolar?<br><br>
      <strong>A)</strong> 2.8 saat (5 sa 36 dk) &nbsp; <strong>B)</strong> 4.1 saat (5 sa 36 dk) &nbsp; <strong>C)</strong> <span class="key">5.6 saat (5 sa 36 dk)</span> &nbsp; <strong>D)</strong> 5.85 saat (5 sa 36 dk) &nbsp; <strong>E)</strong> 6.5 saat (5 sa 36 dk)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A tek başına $2$ saatte: $\\dfrac{2}{8} = \\dfrac{1}{4}$. Kalan $= \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">A+B birlikte tempo: $\\dfrac{1}{8} + \\dfrac{1}{12} = \\dfrac{3+2}{24} = \\dfrac{5}{24}$.</p>
      <p class="ales-sol-step">Kalan süre $= \\dfrac{3/4}{5/24} = \\dfrac{3}{4} \\cdot \\dfrac{24}{5} = \\dfrac{18}{5} = 3{,}6$ saat.</p>
      <p class="ales-sol-step">Toplam $= 2 + 3{,}6 = 5{,}6$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5.6 saat (5 sa 36 dk)</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Açıkken Sonradan Boşaltma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $6$ saatte dolduruyor. $2$ saat tek başına açıldıktan sonra B boşaltma musluğu da açılıyor; B musluğu $12$ saatte tam dolu havuzu boşaltıyor. Havuz toplam kaç saatte dolar?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">10</span> &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 19 &nbsp; <strong>E)</strong> 20
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A tek başına $2$ saatte $\\dfrac{2}{6} = \\dfrac{1}{3}$. Kalan $= \\dfrac{2}{3}$.</p>
      <p class="ales-sol-step">A−B net tempo: $\\dfrac{1}{6} - \\dfrac{1}{12} = \\dfrac{2-1}{12} = \\dfrac{1}{12}$.</p>
      <p class="ales-sol-step">Kalan süre $= \\dfrac{2/3}{1/12} = \\dfrac{2}{3} \\cdot 12 = 8$ saat.</p>
      <p class="ales-sol-step">Toplam $= 2 + 8 = 10$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">"Havuz Dolmaz" Tuzağı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir havuzu A musluğu $10$ saatte dolduruyor, B musluğu $5$ saatte boşaltıyor. İkisi birlikte boş havuzdan açılırsa havuz dolar mı?<br><br>
      <strong>A)</strong> $5$ saatte dolar &nbsp; <strong>B)</strong> $10$ saatte dolar &nbsp; <strong>C)</strong> $15$ saatte dolar &nbsp; <strong>D)</strong> $20$ saatte dolar &nbsp; <strong>E)</strong> <span class="key">Dolmaz</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tempo Karşılaştırma</div>
      <p class="ales-sol-step">Net tempo: $\\dfrac{1}{10} - \\dfrac{1}{5} = \\dfrac{1-2}{10} = -\\dfrac{1}{10}$.</p>
      <p class="ales-sol-step">Negatif tempo ⟹ havuz <em>boşalma</em> yönünde değişir, dolmaz.</p>
      <p class="ales-sol-step"><strong>Kural:</strong> Dolması için doldurma toplamı $>$ boşaltma toplamı olmalı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Dolmaz (B daha hızlı boşaltıyor)</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Bir Saat Açık · Bir Saat Kapalı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $4$ saatte dolduruyor. A musluğu açılıp $1$ saat çalışıyor, sonra $1$ saat kapatılıyor; bu döngü tekrarlanıyor. Havuz tamamen kaç saatte dolar?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">7</span> &nbsp; <strong>D)</strong> 9 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Döngü Analizi</div>
      <p class="ales-sol-step">A 1 saatte $\\dfrac{1}{4}$ doldurur, sonra 1 saat hiçbir şey olmaz. Yani 2 saatte $\\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">$3$ döngü ($6$ saat) sonunda: $\\dfrac{3}{4}$. Kalan $\\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">Sonraki döngüde A açılır $\\to$ $1$ saat sonra havuz dolar.</p>
      <p class="ales-sol-step">Toplam $= 6 + 1 = 7$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Kademeli Musluk Açma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A musluğu $12$ saatte, B musluğu $8$ saatte boş havuzu dolduruyor. Önce sadece A açılıyor; $3$ saat sonra B de açılıyor. Havuz toplam kaç saatte dolar?<br><br>
      <strong>A)</strong> 5.6 saat (6 sa 36 dk) &nbsp; <strong>B)</strong> 6.35 saat (6 sa 36 dk) &nbsp; <strong>C)</strong> <span class="key">6.6 saat (6 sa 36 dk)</span> &nbsp; <strong>D)</strong> 8.1 saat (6 sa 36 dk) &nbsp; <strong>E)</strong> 13.2 saat (6 sa 36 dk)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A $3$ saatte: $\\dfrac{3}{12} = \\dfrac{1}{4}$. Kalan $= \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">A+B birlikte: $\\dfrac{1}{12} + \\dfrac{1}{8} = \\dfrac{2+3}{24} = \\dfrac{5}{24}$.</p>
      <p class="ales-sol-step">Kalan süre $= \\dfrac{3/4}{5/24} = \\dfrac{3}{4} \\cdot \\dfrac{24}{5} = \\dfrac{18}{5} = 3{,}6$ saat.</p>
      <p class="ales-sol-step">Toplam $= 3 + 3{,}6 = 6{,}6$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6.6 saat (6 sa 36 dk)</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Boşaltma Kapatılır</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A musluğu boş havuzu $6$ saatte dolduruyor; B boşaltma musluğu $12$ saatte boşaltıyor. İkisi birlikte $3$ saat çalışıyor, sonra B kapatılıyor. Havuz toplam kaç saatte dolar?<br><br>
      <strong>A)</strong> 7 saat &nbsp; <strong>B)</strong> 7.25 saat &nbsp; <strong>C)</strong> <span class="key">7.5 saat</span> &nbsp; <strong>D)</strong> 7.75 saat &nbsp; <strong>E)</strong> 9 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İlk $3$ saat (A−B): net tempo $\\dfrac{1}{6} - \\dfrac{1}{12} = \\dfrac{1}{12}$. $3$ saatte $\\dfrac{3}{12} = \\dfrac{1}{4}$.</p>
      <p class="ales-sol-step">Kalan $= 1 - \\dfrac{1}{4} = \\dfrac{3}{4}$. B kapatıldı, sadece A çalışıyor (tempo $\\dfrac{1}{6}$).</p>
      <p class="ales-sol-step">Kalan süre $= \\dfrac{3/4}{1/6} = \\dfrac{3}{4} \\cdot 6 = \\dfrac{18}{4} = 4{,}5$ saat.</p>
      <p class="ales-sol-step">Toplam $= 3 + 4{,}5 = 7{,}5$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7.5 saat</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sonradan Boşaltma · Tuzak</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A musluğu havuzu $5$ saatte dolduruyor. B musluğu $4$ saatte boşaltıyor. A açıldıktan $2$ saat sonra B de açılıyor. Havuz tamamen dolar mı?<br><br>
      <strong>A)</strong> $4$ saatte dolar &nbsp; <strong>B)</strong> $8$ saatte dolar &nbsp; <strong>C)</strong> $12$ saatte dolar &nbsp; <strong>D)</strong> $20$ saatte dolar &nbsp; <strong>E)</strong> <span class="key">Dolmaz</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A 2 saatte $\\dfrac{2}{5}$ doldurur. Kalan $= \\dfrac{3}{5}$.</p>
      <p class="ales-sol-step">A açık, B açık net tempo: $\\dfrac{1}{5} - \\dfrac{1}{4} = \\dfrac{4-5}{20} = -\\dfrac{1}{20}$.</p>
      <p class="ales-sol-step">Net tempo negatif ⟹ havuz <em>boşalmaya başlar</em>, asla dolmaz.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Dolmaz</span></div>
    </div>
  </div>
</section>
`
};
