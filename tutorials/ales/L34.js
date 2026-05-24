window.ALES_LESSON = {
n: 34,
title: "Hız-Zaman-Yol Problemleri",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>hız-zaman-yol</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Tek temel formül $V \\cdot t = Y$ üzerine kurulu, ama altın ezber: <strong>km/h $\\to$ m/sn için $\\times \\dfrac{5}{18}$, m/sn $\\to$ km/h için $\\times \\dfrac{18}{5}$</strong>.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Temel Formül + Birim Dönüşümü
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Temel V·t = Y + Birim Dönüşümü</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Yol Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saatteki hızı $80$ km olan bir araç $3$ saatte kaç km yol gider?<br><br>
      <strong>A)</strong> 231 &nbsp; <strong>B)</strong> 235 &nbsp; <strong>C)</strong> <span class="key">240</span> &nbsp; <strong>D)</strong> 245 &nbsp; <strong>E)</strong> 480
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$Y = V \\cdot t = 80 \\cdot 3 = 240$ km.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 240</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Hız Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $360$ km'lik yolu $4$ saatte alan aracın saatteki hızı kaç km'dir?<br><br>
      <strong>A)</strong> 45 &nbsp; <strong>B)</strong> 81 &nbsp; <strong>C)</strong> 89 &nbsp; <strong>D)</strong> <span class="key">90</span> &nbsp; <strong>E)</strong> 91
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$V = Y / t = 360 / 4 = 90$ km/saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 90</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">km/h → m/sn</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saatte $72$ km hızla giden bir aracın saniyedeki hızı kaç m'dir?<br><br>
      <strong>A)</strong> 10 &nbsp; <strong>B)</strong> <span class="key">20</span> &nbsp; <strong>C)</strong> 24 &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Altın Ezber</div>
      <p class="ales-sol-step"><strong>km/h $\\to$ m/sn:</strong> $\\times \\dfrac{5}{18}$ (sebebi: $1$ km $= 1000$ m, $1$ saat $= 3600$ sn).</p>
      <p class="ales-sol-step">$72 \\cdot \\dfrac{5}{18} = 4 \\cdot 5 = 20$ m/sn.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 20</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">m/sn → km/h</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saniyedeki hızı $25$ m olan bir aracın saatteki hızı kaç km'dir?<br><br>
      <strong>A)</strong> 72 &nbsp; <strong>B)</strong> 81 &nbsp; <strong>C)</strong> <span class="key">90</span> &nbsp; <strong>D)</strong> 93 &nbsp; <strong>E)</strong> 120
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>m/sn $\\to$ km/h:</strong> $\\times \\dfrac{18}{5}$.</p>
      <p class="ales-sol-step">$25 \\cdot \\dfrac{18}{5} = 5 \\cdot 18 = 90$ km/saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 90</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Zaman Hesabı + Birim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Saatte $90$ km hızla giden bir araç $300$ m yolu kaç saniyede alır?<br><br>
      <strong>A)</strong> 9 &nbsp; <strong>B)</strong> <span class="key">12</span> &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> 15 &nbsp; <strong>E)</strong> 17
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Birim Eşitle</div>
      <p class="ales-sol-step">Yol m, hız km/h ⟹ hızı m/sn'ye çevir: $90 \\cdot \\dfrac{5}{18} = 25$ m/sn.</p>
      <p class="ales-sol-step">$t = Y / V = 300 / 25 = 12$ sn.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Tren · Köprü Geçme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Uzunluğu $200$ m olan bir tren, $300$ m uzunluğundaki köprüyü saatte $36$ km hızla kaç saniyede tamamen geçer?<br><br>
      <strong>A)</strong> 47 &nbsp; <strong>B)</strong> <span class="key">50</span> &nbsp; <strong>C)</strong> 51 &nbsp; <strong>D)</strong> 55 &nbsp; <strong>E)</strong> 59
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Bir nesneyi tamamen geçmek için</strong> alınan yol $=$ tren uzunluğu $+$ köprü uzunluğu.</p>
      <p class="ales-sol-step">Toplam yol $= 200 + 300 = 500$ m.</p>
      <p class="ales-sol-step">Hız: $36 \\cdot \\dfrac{5}{18} = 10$ m/sn.</p>
      <p class="ales-sol-step">$t = 500 / 10 = 50$ sn.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 50</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Direği Geçme</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir tren $144$ km/saat hızla giderken yanından geçtiği bir telefon direğini $5$ sn'de geçiyor. Trenin uzunluğu kaç metredir?<br><br>
      <strong>A)</strong> 100 &nbsp; <strong>B)</strong> 197 &nbsp; <strong>C)</strong> <span class="key">200</span> &nbsp; <strong>D)</strong> 201 &nbsp; <strong>E)</strong> 209
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Bir noktayı (direği) geçmek için</strong> alınan yol $=$ tren uzunluğu (direk uzunluğu sıfır kabul edilir).</p>
      <p class="ales-sol-step">Hız: $144 \\cdot \\dfrac{5}{18} = 40$ m/sn.</p>
      <p class="ales-sol-step">Tren uzunluğu $= V \\cdot t = 40 \\cdot 5 = 200$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 200</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Aynı Yön / Zıt Yön Hareket
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Aynı Yön / Zıt Yön (Karşılaşma & Peşinden Gitme)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Zıt Yön Karşılaşma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aralarında $400$ km olan iki şehirden, birinden saatte $60$ km, diğerinden saatte $40$ km hızla iki araç birbirine doğru aynı anda hareket ediyor. Kaç saat sonra karşılaşırlar?<br><br>
      <strong>A)</strong> 1 saat &nbsp; <strong>B)</strong> 3 saat &nbsp; <strong>C)</strong> <span class="key">4 saat</span> &nbsp; <strong>D)</strong> 5 saat &nbsp; <strong>E)</strong> 9 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Zıt yönde:</strong> hızlar toplanır (yaklaşma hızı $= V_1 + V_2$).</p>
      <p class="ales-sol-step">Yaklaşma hızı $= 60 + 40 = 100$ km/h.</p>
      <p class="ales-sol-step">$t = 400 / 100 = 4$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4 saat</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Aynı Yön · Peşinden Gitme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saatte $50$ km hızla giden bir aracı, $4$ saat sonra aynı noktadan saatte $70$ km hızla bir başka araç takibe başlıyor. İkinci araç birinciyi kaç saat sonra yakalar?<br><br>
      <strong>A)</strong> 9 saat &nbsp; <strong>B)</strong> <span class="key">10 saat</span> &nbsp; <strong>C)</strong> 13 saat &nbsp; <strong>D)</strong> 15 saat &nbsp; <strong>E)</strong> 19 saat
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Birinci araç $4$ saatte: $50 \\cdot 4 = 200$ km öne çıkmıştır.</p>
      <p class="ales-sol-step"><strong>Aynı yönde:</strong> yaklaşma hızı $= V_2 - V_1 = 70 - 50 = 20$ km/h.</p>
      <p class="ales-sol-step">Yakalama süresi $= 200 / 20 = 10$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10 saat</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Karşılaşma + Konum</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A ve B şehirleri arası $300$ km'dir. A'dan saatte $40$ km, B'den saatte $60$ km hızla iki araç birbirine doğru aynı anda hareket ediyor. Karşılaştıkları noktanın A'ya uzaklığı kaç km'dir?<br><br>
      <strong>A)</strong> 96 km &nbsp; <strong>B)</strong> <span class="key">120 km</span> &nbsp; <strong>C)</strong> 123 km &nbsp; <strong>D)</strong> 125 km &nbsp; <strong>E)</strong> 129 km
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo Metodu</div>
      <p class="ales-sol-step">Yaklaşma hızı $= 40 + 60 = 100$. Karşılaşma süresi $= 300/100 = 3$ saat.</p>
      <table>
        <thead><tr><th>Araç</th><th>Hız</th><th>Süre</th><th>Yol</th></tr></thead>
        <tbody>
          <tr><td>A'dan</td><td>$40$</td><td>$3$</td><td>$120$ km</td></tr>
          <tr><td>B'den</td><td>$60$</td><td>$3$</td><td>$180$ km</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Karşılaşma noktası A'dan $120$ km uzaktadır. (Doğrula: $120 + 180 = 300$ ✓.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 120 km</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Farklı Saatte Çıkış</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      A ve B şehirleri arası $260$ km'dir. A'dan saat $08:00$'de saatte $50$ km hızla, B'den saat $09:00$'da saatte $60$ km hızla iki araç birbirine doğru hareket ediyor. Saat kaçta karşılaşırlar?<br><br>
      <strong>A)</strong> $\\approx 10{:}30$ &nbsp; <strong>B)</strong> $\\approx 10{:}45$ &nbsp; <strong>C)</strong> <span class="key">$\\approx 10{:}55$</span> &nbsp; <strong>D)</strong> $\\approx 11{:}10$ &nbsp; <strong>E)</strong> $\\approx 11{:}30$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">A aracı $1$ saat önce çıkmış: $50$ km öne almıştır.</p>
      <p class="ales-sol-step">$09:00$ itibariyle aralarındaki mesafe $= 260 - 50 = 210$ km.</p>
      <p class="ales-sol-step">Yaklaşma hızı $= 50 + 60 = 110$ km/h.</p>
      <p class="ales-sol-step">Süre $= 210 / 110 = 21/11$ saat $\\approx 1$ saat $54{,}5$ dk.</p>
      <p class="ales-sol-step">Karşılaşma saati $\\approx 09{:}00 + 1{:}55 \\approx 10{:}55$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\approx 10{:}55$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İki Tren · Geçme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Uzunlukları $150$ m ve $250$ m olan iki tren paralel raylarda zıt yönde, sırasıyla saatte $54$ km ve $90$ km hızla hareket ediyor. Birbirlerini tamamen geçmeleri kaç saniye sürer?<br><br>
      <strong>A)</strong> 8 sn &nbsp; <strong>B)</strong> 9 sn &nbsp; <strong>C)</strong> <span class="key">10 sn</span> &nbsp; <strong>D)</strong> 15 sn &nbsp; <strong>E)</strong> 19 sn
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Geçme yolu $= L_1 + L_2 = 150 + 250 = 400$ m.</p>
      <p class="ales-sol-step">Bağıl hız (zıt yön) $= 54 + 90 = 144$ km/h $= 144 \\cdot \\dfrac{5}{18} = 40$ m/sn.</p>
      <p class="ales-sol-step">$t = 400 / 40 = 10$ sn.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 10 sn</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Aynı Yön Tren</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Uzunlukları sırasıyla $100$ m ve $200$ m olan iki tren paralel raylarda <strong>aynı yönde</strong>, sırasıyla saatte $108$ km ve $72$ km hızla gidiyor. Hızlı tren yavaş treni tamamen geçer kaç saniye sürer?<br><br>
      <strong>A)</strong> 15 sn &nbsp; <strong>B)</strong> 24 sn &nbsp; <strong>C)</strong> 27 sn &nbsp; <strong>D)</strong> <span class="key">30 sn</span> &nbsp; <strong>E)</strong> 31 sn
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Geçme yolu $= 100 + 200 = 300$ m.</p>
      <p class="ales-sol-step">Bağıl hız (aynı yön) $= 108 - 72 = 36$ km/h $= 36 \\cdot \\dfrac{5}{18} = 10$ m/sn.</p>
      <p class="ales-sol-step">$t = 300 / 10 = 30$ sn.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 30 sn</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Karşılaşma + Bilinmeyen Hız</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      A ve B şehirleri arası $480$ km'dir. A'dan saatte $V$ km, B'den saatte $80$ km hızla aynı anda kalkan iki araç $3$ saat sonra karşılaşıyor. $V$ kaçtır?<br><br>
      <strong>A)</strong> 64 &nbsp; <strong>B)</strong> <span class="key">80</span> &nbsp; <strong>C)</strong> 81 &nbsp; <strong>D)</strong> 83 &nbsp; <strong>E)</strong> 96
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$3$ saatte birlikte $480$ km giderler ⟹ yaklaşma hızı $= 480/3 = 160$ km/h.</p>
      <p class="ales-sol-step">$V + 80 = 160 \\Rightarrow V = 80$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 80</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Akıntı / Rüzgâr + Harmonik Ortalama
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Akıntı / Rüzgâr + Harmonik Ortalama Hız</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Akıntı Yönünde / Karşı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Durgun sudaki hızı $20$ km/h olan bir tekne, hızı $4$ km/h olan bir nehirde akıntı yönünde ve akıntıya karşı saatte kaç km gider?<br><br>
      <strong>A)</strong> 12 ve 16 &nbsp; <strong>B)</strong> 21 ve 16 &nbsp; <strong>C)</strong> <span class="key">24 ve 16</span> &nbsp; <strong>D)</strong> 25 ve 16 &nbsp; <strong>E)</strong> 48 ve 16
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Akıntı yönünde (mansap):</strong> $V_t + V_a = 20 + 4 = 24$ km/h.</p>
      <p class="ales-sol-step"><strong>Akıntıya karşı (membaa):</strong> $V_t - V_a = 20 - 4 = 16$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 24 ve 16</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Akıntı + Mesafe</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir tekne akıntı yönünde $48$ km'lik yolu $2$ saatte alıyor. Akıntı hızı $4$ km/h ise teknenin durgun sudaki hızı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> 16 &nbsp; <strong>D)</strong> <span class="key">20</span> &nbsp; <strong>E)</strong> 21
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Akıntı yönündeki gerçek hız $= 48/2 = 24$ km/h.</p>
      <p class="ales-sol-step">$V_t + V_a = 24 \\Rightarrow V_t = 24 - 4 = 20$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 20</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki Bilinmeyen — Tekne+Akıntı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir tekne akıntı yönünde saatte $30$ km, akıntıya karşı saatte $18$ km gidiyor. Teknenin durgun sudaki hızı ile akıntı hızını bulunuz.<br><br>
      <strong>A)</strong> $V_t = 20$, $V_a = 10$ &nbsp; <strong>B)</strong> $V_t = 22$, $V_a = 8$ &nbsp; <strong>C)</strong> <span class="key">$V_t = 24$, $V_a = 6$</span> &nbsp; <strong>D)</strong> $V_t = 26$, $V_a = 4$ &nbsp; <strong>E)</strong> $V_t = 18$, $V_a = 12$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Toplam/Fark Yöntemi</div>
      <p class="ales-sol-step">$V_t + V_a = 30$ &nbsp; ve &nbsp; $V_t - V_a = 18$.</p>
      <p class="ales-sol-step">Toplayalım: $2V_t = 48 \\Rightarrow V_t = 24$ km/h.</p>
      <p class="ales-sol-step">Çıkaralım: $2V_a = 12 \\Rightarrow V_a = 6$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $V_t = 24$, $V_a = 6$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Gidiş-Dönüş Süresi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Durgun sudaki hızı $15$ km/h olan bir tekne, $6$ km'lik bir nehir parkurunu akıntı yönünde gidip akıntıya karşı geri dönüyor. Akıntı hızı $3$ km/h ise gidiş-dönüş toplam süresi kaç saattir?<br><br>
      <strong>A)</strong> 0 /6 saat (50 dk) &nbsp; <strong>B)</strong> 4 /6 saat (50 dk) &nbsp; <strong>C)</strong> <span class="key">5 /6 saat (50 dk)</span> &nbsp; <strong>D)</strong> 8 /6 saat (50 dk) &nbsp; <strong>E)</strong> 10 /6 saat (50 dk)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Mansap hızı $= 15 + 3 = 18$ km/h ⟹ gidiş süresi $= 6/18 = 1/3$ saat.</p>
      <p class="ales-sol-step">Membaa hızı $= 15 - 3 = 12$ km/h ⟹ dönüş süresi $= 6/12 = 1/2$ saat.</p>
      <p class="ales-sol-step">Toplam $= 1/3 + 1/2 = 2/6 + 3/6 = 5/6$ saat.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5 /6 saat (50 dk)</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Harmonik Ortalama Hız</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir araç A'dan B'ye saatte $60$ km hızla gidiyor, B'den A'ya saatte $40$ km hızla dönüyor. Gidiş-dönüş ortalama hızı kaç km/saattir?<br><br>
      <strong>A)</strong> 43 &nbsp; <strong>B)</strong> 47 &nbsp; <strong>C)</strong> <span class="key">48</span> &nbsp; <strong>D)</strong> 49 &nbsp; <strong>E)</strong> 96
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Harmonik Ortalama</div>
      <p class="ales-sol-step"><strong>Eşit yollu gidiş-dönüş ortalama hız formülü:</strong> $\\overline{V} = \\dfrac{2 V_1 V_2}{V_1 + V_2}$.</p>
      <p class="ales-sol-step">$\\overline{V} = \\dfrac{2 \\cdot 60 \\cdot 40}{60 + 40} = \\dfrac{4800}{100} = 48$ km/h.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Aritmetik ortalama $(60+40)/2 = 50$ <em>yanlış</em>; doğrusu $48$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sayısal Doğrulama</div>
      <p class="ales-sol-step">Yol $= 120$ km kabul et. Gidiş süresi $= 2$ sa, dönüş $= 3$ sa, toplam $5$ sa, toplam yol $240$ km. $240/5 = 48$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 48</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Akıntı + Eşit Süre</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Durgun sudaki hızı $V_t$ olan bir tekne, akıntı yönünde $36$ km, akıntıya karşı $24$ km yolu eşit sürelerde alıyor. Akıntı hızı $4$ km/h ise teknenin durgun sudaki hızı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> 19 &nbsp; <strong>D)</strong> <span class="key">20</span> &nbsp; <strong>E)</strong> 23
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşit süre koşulu: $\\dfrac{36}{V_t + 4} = \\dfrac{24}{V_t - 4}$.</p>
      <p class="ales-sol-step">İçler-dışlar: $36(V_t - 4) = 24(V_t + 4) \\Rightarrow 36 V_t - 144 = 24 V_t + 96$.</p>
      <p class="ales-sol-step">$12 V_t = 240 \\Rightarrow V_t = 20$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 20</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Ortalama Hız · Farklı Süre</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir araç yolun ilk $\\frac{1}{3}$'lük kısmını saatte $40$ km, kalan $\\frac{2}{3}$'lük kısmını saatte $80$ km hızla alıyor. Tüm yolun ortalama hızı kaçtır?<br><br>
      <strong>A)</strong> 30 &nbsp; <strong>B)</strong> 57 &nbsp; <strong>C)</strong> 59 &nbsp; <strong>D)</strong> <span class="key">60</span> &nbsp; <strong>E)</strong> 63
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Toplam Yol / Toplam Süre</div>
      <p class="ales-sol-step">Yol $= 240$ km kabul et (LCM kolaylığı). İlk kısım $= 80$ km, ikinci $= 160$ km.</p>
      <p class="ales-sol-step">İlk süre $= 80/40 = 2$ sa. İkinci süre $= 160/80 = 2$ sa. Toplam süre $= 4$ sa.</p>
      <p class="ales-sol-step">Ortalama hız $= 240/4 = 60$ km/h.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Genel Formül</div>
      <p class="ales-sol-step">$\\overline{V} = \\dfrac{Y_{\\text{top}}}{t_{\\text{top}}} = \\dfrac{Y}{\\dfrac{Y/3}{40} + \\dfrac{2Y/3}{80}} = \\dfrac{Y}{\\dfrac{Y}{120} + \\dfrac{Y}{120}} = \\dfrac{Y}{\\dfrac{2Y}{120}} = 60$ km/h.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 60</span></div>
    </div>
  </div>
</section>
`
};
