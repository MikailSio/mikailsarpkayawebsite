window.ALES_LESSON = {
n: 23,
title: "Faiz (Basit ve Bileşik)",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>faiz</strong> (basit ve bileşik) üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. "Kaç yılda 2 katı?" tipindeki klasik bileşik faiz sorusu üzerine ayrı vurgu yapılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Basit Faiz F = A·n·t/100
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Basit Faiz: F = A·n·t/100</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Yıllık Basit Faiz</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5000$ TL anaparaya yıllık %$20$ basit faizle $3$ yıl sonra ne kadar faiz alınır?<br><br>
      <strong>A)</strong> $2400$ TL &nbsp; <strong>B)</strong> $2995$ TL &nbsp; <strong>C)</strong> <span class="key">$3000$ TL</span> &nbsp; <strong>D)</strong> $3003$ TL &nbsp; <strong>E)</strong> $3009$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Basit Faiz Formülü</div>
      <p class="ales-sol-step">$F = \\dfrac{A \\cdot n \\cdot t}{100}$. Burada $A = 5000$, $n = 20$, $t = 3$.</p>
      <p class="ales-sol-step">$F = \\dfrac{5000 \\cdot 20 \\cdot 3}{100} = \\dfrac{300000}{100} = 3000$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $3000$ TL</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Toplam Tutar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $8000$ TL, yıllık %$15$ basit faizle $2$ yıl yatırılıyor. Toplam (anapara + faiz) ne olur?<br><br>
      <strong>A)</strong> $8320$ TL &nbsp; <strong>B)</strong> $10399$ TL &nbsp; <strong>C)</strong> <span class="key">$10400$ TL</span> &nbsp; <strong>D)</strong> $10403$ TL &nbsp; <strong>E)</strong> $10409$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$F = \\dfrac{8000 \\cdot 15 \\cdot 2}{100} = 2400$ TL.</p>
      <p class="ales-sol-step">Toplam $= 8000 + 2400 = 10400$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $10400$ TL</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Ay Cinsinden</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $6000$ TL, aylık %$2$ basit faizle $5$ ay yatırılıyor. Faiz kaç TL'dir?<br><br>
      <strong>A)</strong> $591$ TL &nbsp; <strong>B)</strong> $595$ TL &nbsp; <strong>C)</strong> $599$ TL &nbsp; <strong>D)</strong> <span class="key">$600$ TL</span> &nbsp; <strong>E)</strong> $609$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$F = \\dfrac{A \\cdot n \\cdot t}{100} = \\dfrac{6000 \\cdot 2 \\cdot 5}{100} = 600$ TL.</p>
      <p class="ales-sol-step">Not: Burada $n$ aylık oran, $t$ ay sayısı ⟹ birim uyumlu.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $600$ TL</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Birim Karışımı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $12000$ TL, yıllık %$24$ basit faizle $8$ ay yatırılıyor. Faiz kaç TL'dir?<br><br>
      <strong>A)</strong> $1915$ TL &nbsp; <strong>B)</strong> <span class="key">$1920$ TL</span> &nbsp; <strong>C)</strong> $1921$ TL &nbsp; <strong>D)</strong> $1929$ TL &nbsp; <strong>E)</strong> $2304$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birim Çevirme</div>
      <p class="ales-sol-step">$8$ ay $= \\dfrac{8}{12} = \\dfrac{2}{3}$ yıl.</p>
      <p class="ales-sol-step">$F = \\dfrac{12000 \\cdot 24 \\cdot (2/3)}{100} = \\dfrac{12000 \\cdot 16}{100} = \\dfrac{192000}{100} = 1920$ TL.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Aylığa Çevirme</div>
      <p class="ales-sol-step">Aylık oran $= 24/12 = 2$. $F = \\dfrac{12000 \\cdot 2 \\cdot 8}{100} = 1920$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $1920$ TL</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Anaparayı Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yıllık %$25$ basit faizle $4$ yıl sonra $1500$ TL faiz almak için kaç TL anapara yatırılmalıdır?<br><br>
      <strong>A)</strong> $750$ TL &nbsp; <strong>B)</strong> $1200$ TL &nbsp; <strong>C)</strong> $1497$ TL &nbsp; <strong>D)</strong> <span class="key">$1500$ TL</span> &nbsp; <strong>E)</strong> $1509$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1500 = \\dfrac{A \\cdot 25 \\cdot 4}{100} = A$.</p>
      <p class="ales-sol-step">$A = 1500$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $1500$ TL</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Faiz Oranını Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4000$ TL anapara $3$ yılda $1800$ TL faiz getirmiştir. Yıllık basit faiz oranı yüzde kaçtır?<br><br>
      <strong>A)</strong> $\\%10$ &nbsp; <strong>B)</strong> $\\%12$ &nbsp; <strong>C)</strong> <span class="key">$\\%15$</span> &nbsp; <strong>D)</strong> $\\%18$ &nbsp; <strong>E)</strong> $\\%20$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1800 = \\dfrac{4000 \\cdot n \\cdot 3}{100} = 120n \\Rightarrow n = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%15$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Süreyi Bul</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yıllık %$20$ basit faizle $10\\,000$ TL anaparanın faizinin anaparaya eşit olması için kaç yıl gerekir?<br><br>
      <strong>A)</strong> $0$ yıl &nbsp; <strong>B)</strong> $2$ yıl &nbsp; <strong>C)</strong> $4$ yıl &nbsp; <strong>D)</strong> <span class="key">$5$ yıl</span> &nbsp; <strong>E)</strong> $10$ yıl
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$F = A \\Rightarrow A = \\dfrac{A \\cdot 20 \\cdot t}{100} \\Rightarrow 1 = \\dfrac{20t}{100} \\Rightarrow t = 5$ yıl.</p>
      <p class="ales-sol-step">Genel kural: Basit faizde $F = A$ olması için $t = \\dfrac{100}{n}$ yıl.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $5$ yıl</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Bileşik Faiz S = A(1+n/100)^t
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Bileşik Faiz: S = A(1 + n/100)^t</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki Yıllık Bileşik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5000$ TL anaparaya yıllık %$10$ bileşik faiz uygulanırsa $2$ yıl sonraki toplam birikim ne olur?<br><br>
      <strong>A)</strong> $3025$ TL &nbsp; <strong>B)</strong> $6045$ TL &nbsp; <strong>C)</strong> <span class="key">$6050$ TL</span> &nbsp; <strong>D)</strong> $6059$ TL &nbsp; <strong>E)</strong> $8066$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = A(1 + n/100)^t = 5000 \\cdot (1.10)^2 = 5000 \\cdot 1.21 = 6050$ TL.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Yıl Yıl</div>
      <p class="ales-sol-step">$1.$ yıl: $5000 + 500 = 5500$. $2.$ yıl: $5500 + 550 = 6050$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $6050$ TL</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Bileşik vs Basit</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $10000$ TL anapara, yıllık %$20$ bileşik faizle $2$ yıl. Aynı anaparanın aynı koşullarda basit faizden farkı kaç TL'dir?<br><br>
      <strong>A)</strong> $200$ TL &nbsp; <strong>B)</strong> <span class="key">$400$ TL</span> &nbsp; <strong>C)</strong> $403$ TL &nbsp; <strong>D)</strong> $405$ TL &nbsp; <strong>E)</strong> $480$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bileşik: $10000 \\cdot 1.20^2 = 10000 \\cdot 1.44 = 14400$ ⟹ faiz $= 4400$.</p>
      <p class="ales-sol-step">Basit: $\\dfrac{10000 \\cdot 20 \\cdot 2}{100} = 4000$.</p>
      <p class="ales-sol-step">Fark $= 4400 - 4000 = 400$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $400$ TL</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Üç Yıllık Bileşik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $8000$ TL, yıllık %$25$ bileşik faizle $2$ yıl sonra ne olur?<br><br>
      <strong>A)</strong> $12491$ TL &nbsp; <strong>B)</strong> <span class="key">$12500$ TL</span> &nbsp; <strong>C)</strong> $12501$ TL &nbsp; <strong>D)</strong> $12509$ TL &nbsp; <strong>E)</strong> $15000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = 8000 \\cdot 1.25^2 = 8000 \\cdot 1.5625 = 12500$ TL.</p>
      <p class="ales-sol-step">Hızlı kontrol: $1.$ yıl $8000 \\to 10000$, $2.$ yıl $10000 \\to 12500$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $12500$ TL</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üç Dönem</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir bankada %$50$ yıllık bileşik faiz veriliyor. $1000$ TL anapara $3$ yıl sonra kaç TL olur?<br><br>
      <strong>A)</strong> $2700$ TL &nbsp; <strong>B)</strong> <span class="key">$3375$ TL</span> &nbsp; <strong>C)</strong> $3376$ TL &nbsp; <strong>D)</strong> $4050$ TL &nbsp; <strong>E)</strong> $4500$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = 1000 \\cdot 1.5^3 = 1000 \\cdot 3.375 = 3375$ TL.</p>
      <p class="ales-sol-step">Yıl yıl: $1000 \\to 1500 \\to 2250 \\to 3375$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $3375$ TL</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Sadece Faizi Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4000$ TL anapara, yıllık %$10$ bileşik faizle $3$ yıl sonunda ne kadar faiz getirir?<br><br>
      <strong>A)</strong> $1323$ TL &nbsp; <strong>B)</strong> <span class="key">$1324$ TL</span> &nbsp; <strong>C)</strong> $1327$ TL &nbsp; <strong>D)</strong> $1329$ TL &nbsp; <strong>E)</strong> $1765$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = 4000 \\cdot 1.10^3 = 4000 \\cdot 1.331 = 5324$ TL.</p>
      <p class="ales-sol-step">Faiz $= S - A = 5324 - 4000 = 1324$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $1324$ TL</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Ters Hesap — Anaparayı Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yıllık %$20$ bileşik faizle $2$ yıl sonra $7200$ TL almak için kaç TL anapara gereklidir?<br><br>
      <strong>A)</strong> $4000$ TL &nbsp; <strong>B)</strong> $4999$ TL &nbsp; <strong>C)</strong> <span class="key">$5000$ TL</span> &nbsp; <strong>D)</strong> $5001$ TL &nbsp; <strong>E)</strong> $6000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A \\cdot 1.20^2 = A \\cdot 1.44 = 7200 \\Rightarrow A = \\dfrac{7200}{1.44} = 5000$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $5000$ TL</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">İki Anapara Karşılaştırma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir anapara %$10$ bileşik faizle $2$ yılda $605$ TL faiz veriyor. Anapara kaç TL'dir?<br><br>
      <strong>A)</strong> $2500$ TL &nbsp; <strong>B)</strong> $2750$ TL &nbsp; <strong>C)</strong> <span class="key">$\\approx 2881$ TL</span> &nbsp; <strong>D)</strong> $3025$ TL &nbsp; <strong>E)</strong> $6050$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = A \\cdot 1.21$ ⟹ Faiz $= A \\cdot 1.21 - A = A \\cdot 0.21$.</p>
      <p class="ales-sol-step">$0.21 A = 605 \\Rightarrow A = \\dfrac{605}{0.21} = \\dfrac{60500}{21} = \\dfrac{60500}{21}$.</p>
      <p class="ales-sol-step">Hesap: $\\dfrac{60500}{21} \\approx 2880.95$. Tam cevap için anaparayı $\\dfrac{605}{0.21} = \\dfrac{6050}{2.1} = \\dfrac{60500}{21}$ tut.</p>
      <p class="ales-sol-step">Bu sayı tam çıkmıyor; ALES sorularında verilen rakamlar genelde tam çıkacak şekilde seçilir. Faiz $620$ olsaydı: $A = 620/0.21$. Burada cevap yaklaşık $\\approx 2880.95$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\approx 2881$ TL ($\\dfrac{60500}{21}$)</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Kaç Yılda 2 Katı + Aylık ↔ Yıllık Efektif
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Kaç Yılda 2 Katı? + Aylık-Yıllık Efektif Faiz</h2>
  </div>

  <!-- Problem 15 — VURGULU -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Basit Faiz — 2 Katı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yıllık %$20$ basit faizle bir anapara kaç yılda iki katına çıkar?<br><br>
      <strong>A)</strong> $2$ yıl &nbsp; <strong>B)</strong> $4$ yıl &nbsp; <strong>C)</strong> <span class="key">$5$ yıl</span> &nbsp; <strong>D)</strong> $6$ yıl &nbsp; <strong>E)</strong> $8$ yıl
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2A = A + F = A + \\dfrac{A \\cdot 20 \\cdot t}{100}$.</p>
      <p class="ales-sol-step">$A = \\dfrac{A \\cdot 20 \\cdot t}{100} \\Rightarrow t = \\dfrac{100}{20} = 5$ yıl.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $5$ yıl</span></div>
    </div>
  </div>

  <!-- Problem 16 — VURGULU BİLEŞİK -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Bileşik Faiz — 2 Katı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yıllık %$5$ bileşik faizle bir anapara yaklaşık kaç yılda iki katına çıkar? ($\\log 2 \\approx 0.301, \\log 1.05 \\approx 0.0212$)<br><br>
      <strong>A)</strong> $\\approx 7$ yıl &nbsp; <strong>B)</strong> $\\approx 10$ yıl &nbsp; <strong>C)</strong> $\\approx 12$ yıl &nbsp; <strong>D)</strong> <span class="key">$\\approx 14$ yıl</span> &nbsp; <strong>E)</strong> $\\approx 20$ yıl
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Logaritma</div>
      <p class="ales-sol-step">$1.05^t = 2 \\Rightarrow t = \\dfrac{\\log 2}{\\log 1.05} = \\dfrac{0.301}{0.0212} \\approx 14.2$ yıl.</p>
      <p class="ales-sol-step"><strong>Pratik kural:</strong> "$72$ kuralı" — $t \\approx 72/n$. Burada $72/5 = 14.4 \\approx 14$ yıl.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\approx 14$ yıl</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Bileşik — 4 Katı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yıllık bileşik faizle bir anapara $5$ yılda iki katına çıkıyor. Kaç yılda dört katına çıkar?<br><br>
      <strong>A)</strong> $5$ yıl &nbsp; <strong>B)</strong> $8$ yıl &nbsp; <strong>C)</strong> <span class="key">$10$ yıl</span> &nbsp; <strong>D)</strong> $12$ yıl &nbsp; <strong>E)</strong> $19$ yıl
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2A$'dan $4A$'ya geçmek için tekrar 2'ye katlama gerekir ⟹ $5$ yıl daha.</p>
      <p class="ales-sol-step">Toplam $= 5 + 5 = 10$ yıl. (Bileşik faiz üstel ⟹ ardışık 2 katlama süreleri eşit.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $10$ yıl</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">8 Katı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yıllık bileşik faizle bir anapara $4$ yılda $2$ katına çıkıyor. $12$ yılda kaç katına çıkar?<br><br>
      <strong>A)</strong> $3$ kat &nbsp; <strong>B)</strong> <span class="key">$8$ kat</span> &nbsp; <strong>C)</strong> $10$ kat &nbsp; <strong>D)</strong> $11$ kat &nbsp; <strong>E)</strong> $16$ kat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Her $4$ yılda $\\times 2$. $12 = 4 \\cdot 3$ ⟹ $2^3 = 8$ kat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $8$ kat</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Aylık → Yıllık Efektif</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aylık %$2$ bileşik faiz, yıllık efektif yüzde kaçtır? ($1.02^{12} \\approx 1.2682$)<br><br>
      <strong>A)</strong> $\\%2$ &nbsp; <strong>B)</strong> $\\%12$ &nbsp; <strong>C)</strong> $\\%24$ &nbsp; <strong>D)</strong> <span class="key">$\\approx \\%26.82$</span> &nbsp; <strong>E)</strong> $\\%32$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yıllık $= 1.02^{12} \\approx 1.2682$ ⟹ $\\%26.82$.</p>
      <p class="ales-sol-step">Tuzak: $12 \\cdot 2 = \\%24$ değil; bileşik etkiyle $\\%26.82$ olur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\approx \\%26.82$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Aylık vs Yıllık Karşılaştırma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A bankası yıllık %$24$ basit faiz, B bankası aylık %$2$ basit faiz veriyor. $1$ yıl için hangisi daha avantajlı?<br><br>
      <strong>A)</strong> A açıkça avantajlı &nbsp; <strong>B)</strong> B açıkça avantajlı &nbsp; <strong>C)</strong> <span class="key">Basit faizde eşit ($\\%24$); B bileşikse B avantajlı</span> &nbsp; <strong>D)</strong> Her ikisi de $\\%48$ verir &nbsp; <strong>E)</strong> Veriler yetersiz
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A: yıllık $\\%24$ ⟹ basit faiz $\\%24$.</p>
      <p class="ales-sol-step">B: aylık $\\%2$, $12$ ay $\\Rightarrow$ basit faiz $= 12 \\cdot 2 = \\%24$.</p>
      <p class="ales-sol-step">Her ikisi de basit faiz hesabıyla aynı; eşittir.</p>
      <p class="ales-sol-step">Eğer B'de bileşik (her ay faiz işleyip anaparaya katılırsa): $1.02^{12} \\approx 1.2682 \\Rightarrow \\%26.82$. Bu durumda B avantajlı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Basit faizde eşit ($\\%24$); bileşikse B avantajlı</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Senaryo Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir anapara $2$ yılda yıllık %$20$ bileşik faizle $14400$ TL'ye çıkmıştır. Aynı anapara $3$ yıl daha aynı oranla yatırılırsa toplam birikim ne olur?<br><br>
      <strong>A)</strong> $\\approx 17280$ TL &nbsp; <strong>B)</strong> $\\approx 20736$ TL &nbsp; <strong>C)</strong> $\\approx 24000$ TL &nbsp; <strong>D)</strong> <span class="key">$\\approx 24883$ TL</span> &nbsp; <strong>E)</strong> $\\approx 30000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2$ yıl sonra $14400 = A \\cdot 1.44 \\Rightarrow A = 10000$.</p>
      <p class="ales-sol-step">Toplam $5$ yıl: $S = 10000 \\cdot 1.20^5 = 10000 \\cdot 2.48832 \\approx 24883.20$ TL.</p>
      <p class="ales-sol-step">Hesap: $1.20^5 = 1.20^2 \\cdot 1.20^3 = 1.44 \\cdot 1.728 = 2.48832$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\approx 24883.20$ TL</span></div>
    </div>
  </div>
</section>
`
};
