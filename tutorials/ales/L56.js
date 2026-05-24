window.ALES_LESSON = {
n: 56,
title: "Trigonometri Temel Oranlar",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>trigonometri temel oranlar</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. sin/cos/tan/cot tanımları (SOH-CAH-TOA), özel açılar tablosu ($30°, 45°, 60°$), ve <strong>$\\sin^{2}\\alpha + \\cos^{2}\\alpha = 1$</strong> özdeşliği — ALES'in trigonometriden çıkardığı her sorunun çekirdeği.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — sin/cos/tan/cot Tanımları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">sin / cos / tan / cot — SOH-CAH-TOA</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Temel Tanım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $3$-$4$-$5$ dik üçgeninde $\\alpha$, $3$ kenarın karşısındaki açı ise $\\sin\\alpha$, $\\cos\\alpha$, $\\tan\\alpha$ değerleri sırasıyla hangisidir?<br><br>
      <strong>A)</strong> 4/5, 3/5, 4/3 &nbsp; <strong>B)</strong> 3/4, 4/3, 5/3 &nbsp; <strong>C)</strong> <span class="key">3/5, 4/5, 3/4</span> &nbsp; <strong>D)</strong> 5/3, 5/4, 3/4 &nbsp; <strong>E)</strong> 3/5, 3/4, 4/3
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 160" style="width:100%;max-width:280px">
        <polygon points="30,140 170,140 30,40" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <rect x="30" y="130" width="10" height="10" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="15" y="95" font-size="12" fill="currentColor" font-family="JetBrains Mono">3</text>
        <text x="95" y="155" font-size="12" fill="currentColor" font-family="JetBrains Mono">4</text>
        <text x="105" y="85" font-size="12" fill="currentColor" font-family="JetBrains Mono">5</text>
        <text x="148" y="135" font-size="10" fill="currentColor" font-family="JetBrains Mono">α</text>
      </svg>
      <div class="ales-diagram-caption">3-4-5 üçgen</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — SOH-CAH-TOA</div>
      <p class="ales-sol-step"><strong>SOH:</strong> $\\sin = \\dfrac{\\text{karsi}}{\\text{hipotenus}}$, <strong>CAH:</strong> $\\cos = \\dfrac{\\text{komsu}}{\\text{hipotenus}}$, <strong>TOA:</strong> $\\tan = \\dfrac{\\text{karsi}}{\\text{komsu}}$.</p>
      <p class="ales-sol-step">$\\alpha$ açısı: karşı $= 3$, komşu $= 4$, hipotenüs $= 5$.</p>
      <p class="ales-sol-step">$\\sin\\alpha = \\dfrac{3}{5}$, $\\cos\\alpha = \\dfrac{4}{5}$, $\\tan\\alpha = \\dfrac{3}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) sin=3/5, cos=4/5, tan=3/4</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">cot Tanımı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $5$-$12$-$13$ dik üçgeninde $5$ kenarın karşısındaki açı $\\beta$ ise $\\cot\\beta$ kaçtır?<br><br>
      <strong>A)</strong> 5/12 &nbsp; <strong>B)</strong> 11/5 &nbsp; <strong>C)</strong> 12/6 &nbsp; <strong>D)</strong> 12/10 &nbsp; <strong>E)</strong> <span class="key">12/5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\cot\\beta = \\dfrac{1}{\\tan\\beta} = \\dfrac{\\text{komsu}}{\\text{karsi}} = \\dfrac{12}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12/5</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Bilinmeyen Kenar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir dik üçgende $\\sin\\alpha = \\dfrac{3}{5}$ ve hipotenüs $20$ cm ise $\\alpha$'nın karşısındaki kenar kaç cm'dir?<br><br>
      <strong>A)</strong> 13 cm &nbsp; <strong>B)</strong> <span class="key">12 cm</span> &nbsp; <strong>C)</strong> 11 cm &nbsp; <strong>D)</strong> 14 cm &nbsp; <strong>E)</strong> 10 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sin\\alpha = \\dfrac{\\text{karsi}}{\\text{hip}} = \\dfrac{3}{5}$ ⟹ $\\dfrac{\\text{karsi}}{20} = \\dfrac{3}{5} \\Rightarrow \\text{karsi} = 12$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12 cm</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">tan'dan Diğerleri</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\tan\\alpha = \\dfrac{3}{4}$ olduğuna göre $\\sin\\alpha$ ve $\\cos\\alpha$ kaçtır? ($\\alpha$ dar açı)<br><br>
      <strong>A)</strong> sin=4/5, cos=3/5 &nbsp; <strong>B)</strong> <span class="key">sin=3/5, cos=4/5</span> &nbsp; <strong>C)</strong> sin=3/4, cos=4/3 &nbsp; <strong>D)</strong> sin=4/3, cos=3/4 &nbsp; <strong>E)</strong> sin=3/5, cos=3/4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üçgen Çiz</div>
      <p class="ales-sol-step">$\\tan = \\dfrac{\\text{karsi}}{\\text{komsu}} = \\dfrac{3}{4}$ ⟹ üçgen oluştur: karşı $3$, komşu $4$.</p>
      <p class="ales-sol-step">Hipotenüs Pisagor: $\\sqrt{9 + 16} = 5$.</p>
      <p class="ales-sol-step">$\\sin\\alpha = \\dfrac{3}{5}$, $\\cos\\alpha = \\dfrac{4}{5}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) sin=3/5, cos=4/5</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">cos'tan tan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\cos\\alpha = \\dfrac{12}{13}$ ise $\\tan\\alpha$ kaçtır? ($\\alpha$ dar)<br><br>
      <strong>A)</strong> 12/5 &nbsp; <strong>B)</strong> 6/12 &nbsp; <strong>C)</strong> 4/12 &nbsp; <strong>D)</strong> <span class="key">5/12</span> &nbsp; <strong>E)</strong> 5/13
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Komşu $12$, hipotenüs $13$ ⟹ karşı $= \\sqrt{169 - 144} = 5$.</p>
      <p class="ales-sol-step">$\\tan\\alpha = \\dfrac{5}{12}$.</p>
      <p class="ales-sol-step">($5$-$12$-$13$ üçlüsü)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5/12</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Yükseklik Hesabı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ağacın $20$ m uzaktan tepesine bakıldığında yatayla yapılan açı $\\alpha$ olup $\\tan\\alpha = \\dfrac{3}{4}$ ise ağacın boyu kaç m'dir?<br><br>
      <strong>A)</strong> 16 m &nbsp; <strong>B)</strong> 14 m &nbsp; <strong>C)</strong> <span class="key">15 m</span> &nbsp; <strong>D)</strong> 17 m &nbsp; <strong>E)</strong> 13 m
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\tan\\alpha = \\dfrac{\\text{boy}}{\\text{mesafe}} = \\dfrac{h}{20} = \\dfrac{3}{4}$.</p>
      <p class="ales-sol-step">$h = 20 \\cdot \\dfrac{3}{4} = 15$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 15 m</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Karışık Oran</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\sin\\alpha = \\dfrac{1}{2}$ ($\\alpha$ dar açı) olduğuna göre $\\dfrac{\\sin\\alpha + \\cos\\alpha}{\\tan\\alpha}$ kaçtır?<br><br>
      <strong>A)</strong> $\\dfrac{\\sqrt{3}}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{1 + \\sqrt{3}}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{\\sqrt{3} + 3}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{3 - \\sqrt{3}}{2}$ &nbsp; <strong>E)</strong> $\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karşı $1$, hip $2$ ⟹ komşu $\\sqrt{4 - 1} = \\sqrt{3}$. ($30°$ açısı; $30$-$60$-$90$)</p>
      <p class="ales-sol-step">$\\cos\\alpha = \\dfrac{\\sqrt{3}}{2}$, $\\tan\\alpha = \\dfrac{1}{\\sqrt{3}}$.</p>
      <p class="ales-sol-step">Pay: $\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2} = \\dfrac{1 + \\sqrt{3}}{2}$.</p>
      <p class="ales-sol-step">Bölüm: $\\dfrac{(1 + \\sqrt{3})/2}{1/\\sqrt{3}} = \\dfrac{\\sqrt{3}(1 + \\sqrt{3})}{2} = \\dfrac{\\sqrt{3} + 3}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{\\sqrt{3} + 3}{2}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Özel Açılar Tablosu
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Özel Açılar Tablosu — 30°, 45°, 60°</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">sin 30°</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sin 30° + \\cos 60°$ kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> 2 &nbsp; <strong>C)</strong> <span class="key">1</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tablo</div>
      <p class="ales-sol-step">$\\sin 30° = \\dfrac{1}{2}$, $\\cos 60° = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{1}{2} + \\dfrac{1}{2} = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 1</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">tan 45°</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\tan 45° \\cdot \\sin 45° \\cdot \\cos 45°$ kaçtır?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">1/2</span> &nbsp; <strong>C)</strong> 2/2 &nbsp; <strong>D)</strong> 1/3 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\tan 45° = 1$, $\\sin 45° = \\dfrac{\\sqrt{2}}{2}$, $\\cos 45° = \\dfrac{\\sqrt{2}}{2}$.</p>
      <p class="ales-sol-step">$1 \\cdot \\dfrac{\\sqrt{2}}{2} \\cdot \\dfrac{\\sqrt{2}}{2} = \\dfrac{2}{4} = \\dfrac{1}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1/2</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">sin 60°</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sin 60° \\cdot \\cos 30°$ kaçtır?<br><br>
      <strong>A)</strong> 4/3 &nbsp; <strong>B)</strong> <span class="key">3/4</span> &nbsp; <strong>C)</strong> 2/4 &nbsp; <strong>D)</strong> 3/5 &nbsp; <strong>E)</strong> 1/4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sin 60° = \\dfrac{\\sqrt{3}}{2}$, $\\cos 30° = \\dfrac{\\sqrt{3}}{2}$.</p>
      <p class="ales-sol-step">Çarpım: $\\dfrac{3}{4}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3/4</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">tan 60°</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\tan 60° + \\cot 60°$ kaçtır?<br><br>
      <strong>A)</strong> $\\sqrt{3}$ &nbsp; <strong>B)</strong> $\\dfrac{2\\sqrt{3}}{3}$ &nbsp; <strong>C)</strong> $2\\sqrt{3}$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{4\\sqrt{3}}{3}$</span> &nbsp; <strong>E)</strong> $\\dfrac{\\sqrt{3}}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\tan 60° = \\sqrt{3}$, $\\cot 60° = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3}$.</p>
      <p class="ales-sol-step">Toplam: $\\sqrt{3} + \\dfrac{\\sqrt{3}}{3} = \\dfrac{3\\sqrt{3} + \\sqrt{3}}{3} = \\dfrac{4\\sqrt{3}}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{4\\sqrt{3}}{3}$</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Karışık Tablo</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sin^{2} 30° + \\cos^{2} 60° + \\tan^{2} 45°$ kaçtır?<br><br>
      <strong>A)</strong> 2/3 &nbsp; <strong>B)</strong> 2/2 &nbsp; <strong>C)</strong> 3/3 &nbsp; <strong>D)</strong> <span class="key">3/2</span> &nbsp; <strong>E)</strong> 3/4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\sin^{2} 30° = \\dfrac{1}{4}$, $\\cos^{2} 60° = \\dfrac{1}{4}$, $\\tan^{2} 45° = 1$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{1}{4} + \\dfrac{1}{4} + 1 = \\dfrac{3}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 3/2</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Eşkenar Üçgen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $a$ olan eşkenar üçgenin yüksekliği trigonometri ile hangisidir?<br><br>
      <strong>A)</strong> $\\dfrac{a}{2}$ &nbsp; <strong>B)</strong> $\\dfrac{a\\sqrt{2}}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{a\\sqrt{3}}{2}$</span> &nbsp; <strong>D)</strong> $a\\sqrt{3}$ &nbsp; <strong>E)</strong> $\\dfrac{a\\sqrt{3}}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşkenar üçgenin yüksekliği taban kenarın bir ucundan $60°$ açı ile yapılır.</p>
      <p class="ales-sol-step">Yükseklik karşısı, taban kenar hipotenüstür: $h = a \\sin 60° = a \\cdot \\dfrac{\\sqrt{3}}{2} = \\dfrac{a\\sqrt{3}}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{a\\sqrt{3}}{2}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">İki Ağaç Mesafesi</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $30$ m yüksekliğinden bakıldığında bir geminin alçalma açısı $30°$. Geminin gözlemciden yatay uzaklığı kaç m'dir?<br><br>
      <strong>A)</strong> $30$ &nbsp; <strong>B)</strong> $15\\sqrt{3}$ &nbsp; <strong>C)</strong> <span class="key">$30\\sqrt{3}$</span> &nbsp; <strong>D)</strong> $60$ &nbsp; <strong>E)</strong> $10\\sqrt{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yatay uzaklık $d$, yükseklik $30$. Alçalma açısı $30°$ ⟹ $\\tan 30° = \\dfrac{30}{d}$.</p>
      <p class="ales-sol-step">$\\dfrac{1}{\\sqrt{3}} = \\dfrac{30}{d} \\Rightarrow d = 30\\sqrt{3}$ m.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $30\\sqrt{3}$ m</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — sin² + cos² = 1 + Tümler/Bütünler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">sin² + cos² = 1 ve Tümler/Bütünler Dönüşümler</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Pisagor Özdeşlik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sin\\alpha = \\dfrac{4}{5}$ ise $\\cos\\alpha$ kaçtır? ($\\alpha$ dar)<br><br>
      <strong>A)</strong> 5/3 &nbsp; <strong>B)</strong> 4/5 &nbsp; <strong>C)</strong> 2/5 &nbsp; <strong>D)</strong> 3/6 &nbsp; <strong>E)</strong> <span class="key">3/5</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pisagor Özdeşliği</div>
      <p class="ales-sol-step">$\\sin^{2}\\alpha + \\cos^{2}\\alpha = 1 \\Rightarrow \\cos^{2}\\alpha = 1 - \\dfrac{16}{25} = \\dfrac{9}{25}$.</p>
      <p class="ales-sol-step">$\\cos\\alpha = \\dfrac{3}{5}$ (dar açıda pozitif).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 3/5</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Tümler Açı Dönüşüm</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\sin 70°$ değeri hangi cosinus değerine eşittir?<br><br>
      <strong>A)</strong> $\\cos 70°$ &nbsp; <strong>B)</strong> <span class="key">$\\cos 20°$</span> &nbsp; <strong>C)</strong> $\\cos 110°$ &nbsp; <strong>D)</strong> $-\\cos 20°$ &nbsp; <strong>E)</strong> $\\cos 160°$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Tümler Dönüşümü</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $\\sin\\alpha = \\cos(90° - \\alpha)$.</p>
      <p class="ales-sol-step">$\\sin 70° = \\cos(90° - 70°) = \\cos 20°$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> $\\tan\\alpha = \\cot(90° - \\alpha)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) cos 20°</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İfade Sadeleştirme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{\\sin\\alpha}{\\cos\\alpha}$ ifadesi hangisine eşittir?<br><br>
      <strong>A)</strong> $\\sin\\alpha$ &nbsp; <strong>B)</strong> $\\cos\\alpha$ &nbsp; <strong>C)</strong> <span class="key">$\\tan\\alpha$</span> &nbsp; <strong>D)</strong> $\\cot\\alpha$ &nbsp; <strong>E)</strong> $1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{\\sin\\alpha}{\\cos\\alpha} = \\tan\\alpha$ (tanım).</p>
      <p class="ales-sol-step">Karşılığı: $\\dfrac{\\cos\\alpha}{\\sin\\alpha} = \\cot\\alpha$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) tan α</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(1 - \\sin^{2}\\alpha)(1 + \\tan^{2}\\alpha)$ ifadesini sadeleştir.<br><br>
      <strong>A)</strong> <span class="key">1</span> &nbsp; <strong>B)</strong> 0 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1 - \\sin^{2}\\alpha = \\cos^{2}\\alpha$.</p>
      <p class="ales-sol-step">$1 + \\tan^{2}\\alpha = 1 + \\dfrac{\\sin^{2}\\alpha}{\\cos^{2}\\alpha} = \\dfrac{\\cos^{2}\\alpha + \\sin^{2}\\alpha}{\\cos^{2}\\alpha} = \\dfrac{1}{\\cos^{2}\\alpha}$.</p>
      <p class="ales-sol-step">Çarpım: $\\cos^{2}\\alpha \\cdot \\dfrac{1}{\\cos^{2}\\alpha} = 1$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 1</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Bütünler Dönüşüm</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sin 150° + \\cos 120°$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">0</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Bütünler Açı Dönüşümleri</div>
      <p class="ales-sol-step"><strong>Kurallar:</strong> $\\sin(180° - \\alpha) = \\sin\\alpha$; $\\cos(180° - \\alpha) = -\\cos\\alpha$.</p>
      <p class="ales-sol-step">$\\sin 150° = \\sin(180° - 30°) = \\sin 30° = \\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">$\\cos 120° = \\cos(180° - 60°) = -\\cos 60° = -\\dfrac{1}{2}$.</p>
      <p class="ales-sol-step">Toplam: $\\dfrac{1}{2} - \\dfrac{1}{2} = 0$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 0</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">İki Bilinmeyenli</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\sin\\alpha + \\cos\\alpha = \\dfrac{7}{5}$ ise $\\sin\\alpha \\cdot \\cos\\alpha$ kaçtır?<br><br>
      <strong>A)</strong> 25/12 &nbsp; <strong>B)</strong> <span class="key">12/25</span> &nbsp; <strong>C)</strong> 13/25 &nbsp; <strong>D)</strong> 11/25 &nbsp; <strong>E)</strong> 12/26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Karesini Al</div>
      <p class="ales-sol-step">$(\\sin\\alpha + \\cos\\alpha)^{2} = \\sin^{2}\\alpha + 2\\sin\\alpha\\cos\\alpha + \\cos^{2}\\alpha$.</p>
      <p class="ales-sol-step">$= 1 + 2\\sin\\alpha\\cos\\alpha = \\dfrac{49}{25}$.</p>
      <p class="ales-sol-step">$2\\sin\\alpha\\cos\\alpha = \\dfrac{49}{25} - 1 = \\dfrac{24}{25} \\Rightarrow \\sin\\alpha\\cos\\alpha = \\dfrac{12}{25}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12/25</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karmaşık Manipülasyon</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{1 - \\cos\\alpha}{\\sin\\alpha} + \\dfrac{\\sin\\alpha}{1 - \\cos\\alpha}$ ifadesini sadeleştir.<br><br>
      <strong>A)</strong> <span class="key">$\\dfrac{2}{\\sin\\alpha}$</span> &nbsp; <strong>B)</strong> $\\dfrac{2}{\\cos\\alpha}$ &nbsp; <strong>C)</strong> $\\dfrac{1}{\\sin\\alpha}$ &nbsp; <strong>D)</strong> $2\\sin\\alpha$ &nbsp; <strong>E)</strong> $2$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Ortak Payda</div>
      <p class="ales-sol-step">Ortak payda $\\sin\\alpha (1 - \\cos\\alpha)$:</p>
      <p class="ales-sol-step">$\\dfrac{(1 - \\cos\\alpha)^{2} + \\sin^{2}\\alpha}{\\sin\\alpha (1 - \\cos\\alpha)}$.</p>
      <p class="ales-sol-step">Pay: $1 - 2\\cos\\alpha + \\cos^{2}\\alpha + \\sin^{2}\\alpha = 1 - 2\\cos\\alpha + 1 = 2 - 2\\cos\\alpha = 2(1 - \\cos\\alpha)$.</p>
      <p class="ales-sol-step">$\\dfrac{2(1 - \\cos\\alpha)}{\\sin\\alpha (1 - \\cos\\alpha)} = \\dfrac{2}{\\sin\\alpha}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) $\\dfrac{2}{\\sin\\alpha}$</span></div>
    </div>
  </div>
</section>
`
};
