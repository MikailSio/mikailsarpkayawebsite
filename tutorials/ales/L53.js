window.ALES_LESSON = {
n: 53,
title: "Katı Cisimler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>katı cisimler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Küp ve dikdörtgenler prizması (V, S), silindir ve küre (V$=\\frac{4}{3}\\pi r^{3}$, S$=4\\pi r^{2}$), koni ve piramit (eğik yükseklik $\\ell = \\sqrt{r^{2}+h^{2}}$). SVG diyagramlarla 3B perspektif.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Küp ve Dikdörtgenler Prizması
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Küp ve Dikdörtgenler Prizması</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Küp Hacmi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $5$ cm olan küpün hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> 25 &nbsp; <strong>B)</strong> 75 &nbsp; <strong>C)</strong> 100 &nbsp; <strong>D)</strong> <span class="key">125</span> &nbsp; <strong>E)</strong> 150
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 180 160" style="width:100%;max-width:240px">
        <polygon points="40,140 130,140 130,50 40,50" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="130,140 160,120 160,30 130,50" fill="rgba(251,191,36,0.30)" stroke="#fbbf24" stroke-width="2"/>
        <polygon points="40,50 70,30 160,30 130,50" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="2"/>
        <text x="78" y="105" font-size="11" fill="currentColor" font-family="JetBrains Mono">a=5</text>
      </svg>
      <div class="ales-diagram-caption">Küp: V = a³</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$V = a^{3} = 5^{3} = 125$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 125 cm³</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Küp Yüzey Alanı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $4$ cm olan küpün tüm yüzey alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> 64 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> <span class="key">96</span> &nbsp; <strong>D)</strong> 48 &nbsp; <strong>E)</strong> 120
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Küp $6$ kare yüzeyden oluşur. $S = 6a^{2} = 6 \\cdot 16 = 96$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 96 cm²</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Hacimden Kenar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Hacmi $216$ cm³ olan küpün bir kenarı kaç cm'dir?<br><br>
      <strong>A)</strong> 7 cm &nbsp; <strong>B)</strong> 5 cm &nbsp; <strong>C)</strong> 8 cm &nbsp; <strong>D)</strong> 4 cm &nbsp; <strong>E)</strong> <span class="key">6 cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a^{3} = 216 \\Rightarrow a = \\sqrt[3]{216} = 6$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6 cm</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Dikdörtgenler Prizması Hacim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Boyutları $3$ cm, $4$ cm ve $5$ cm olan dikdörtgenler prizmasının hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> 12 &nbsp; <strong>B)</strong> 47 &nbsp; <strong>C)</strong> 94 &nbsp; <strong>D)</strong> 120 &nbsp; <strong>E)</strong> <span class="key">60</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$V = a \\cdot b \\cdot c = 3 \\cdot 4 \\cdot 5 = 60$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60 cm³</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Yüzey Alanı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Boyutları $2$ cm, $3$ cm, $5$ cm olan dikdörtgenler prizmasının yüzey alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> 31 &nbsp; <strong>B)</strong> 30 &nbsp; <strong>C)</strong> 60 &nbsp; <strong>D)</strong> <span class="key">62</span> &nbsp; <strong>E)</strong> 56
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = 2(ab + bc + ac) = 2(6 + 15 + 10) = 2 \\cdot 31 = 62$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 62 cm²</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Cisim Köşegeni</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Boyutları $3$ cm, $4$ cm, $12$ cm olan dikdörtgenler prizmasının cisim köşegeni kaç cm'dir?<br><br>
      <strong>A)</strong> 14 cm &nbsp; <strong>B)</strong> <span class="key">13 cm</span> &nbsp; <strong>C)</strong> 12 cm &nbsp; <strong>D)</strong> 15 cm &nbsp; <strong>E)</strong> 11 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Cisim Köşegeni Formülü</div>
      <p class="ales-sol-step">$d = \\sqrt{a^{2} + b^{2} + c^{2}}$.</p>
      <p class="ales-sol-step">$d = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 13 cm</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Küpün Köşegeni</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $a$ olan küpün cisim köşegeni nedir?<br><br>
      <strong>A)</strong> $a\\sqrt{2}$ &nbsp; <strong>B)</strong> $2a$ &nbsp; <strong>C)</strong> <span class="key">$a\\sqrt{3}$</span> &nbsp; <strong>D)</strong> $a\\sqrt{5}$ &nbsp; <strong>E)</strong> $3a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$d = \\sqrt{a^{2} + a^{2} + a^{2}} = a\\sqrt{3}$.</p>
      <p class="ales-sol-step">Bunu ezberlemek faydalı: küp köşegeni $= a\\sqrt{3}$, yüzey köşegeni $= a\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $a\\sqrt{3}$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Silindir ve Küre
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Silindir ve Küre</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Silindir Hacim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $5$ cm, yüksekliği $10$ cm olan silindirin hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> $50\\pi$ &nbsp; <strong>B)</strong> $100\\pi$ &nbsp; <strong>C)</strong> $150\\pi$ &nbsp; <strong>D)</strong> <span class="key">$250\\pi$</span> &nbsp; <strong>E)</strong> $500\\pi$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 160 200" style="width:100%;max-width:200px">
        <ellipse cx="80" cy="40" rx="50" ry="15" fill="rgba(251,191,36,0.30)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="30" y1="40" x2="30" y2="160" stroke="#fbbf24" stroke-width="2"/>
        <line x1="130" y1="40" x2="130" y2="160" stroke="#fbbf24" stroke-width="2"/>
        <ellipse cx="80" cy="160" rx="50" ry="15" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" stroke-width="2"/>
        <text x="40" y="115" font-size="10" fill="currentColor" font-family="JetBrains Mono">h=10</text>
        <text x="65" y="42" font-size="10" fill="currentColor" font-family="JetBrains Mono">r=5</text>
      </svg>
      <div class="ales-diagram-caption">Silindir: V = πr²h</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$V = \\pi r^{2} h = \\pi \\cdot 25 \\cdot 10 = 250\\pi$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $250\\pi$ cm³</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Silindir Yüzey</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $4$ cm, yüksekliği $10$ cm olan silindirin tüm yüzey alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $80\\pi$ &nbsp; <strong>B)</strong> $96\\pi$ &nbsp; <strong>C)</strong> $128\\pi$ &nbsp; <strong>D)</strong> $160\\pi$ &nbsp; <strong>E)</strong> <span class="key">$112\\pi$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yan yüzey $= 2\\pi r h = 2\\pi \\cdot 4 \\cdot 10 = 80\\pi$.</p>
      <p class="ales-sol-step">İki taban $= 2 \\cdot \\pi r^{2} = 2 \\cdot 16\\pi = 32\\pi$.</p>
      <p class="ales-sol-step">Toplam $= 80\\pi + 32\\pi = 112\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $112\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Küre Hacim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $3$ cm olan kürenin hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> $9\\pi$ &nbsp; <strong>B)</strong> $27\\pi$ &nbsp; <strong>C)</strong> <span class="key">$36\\pi$</span> &nbsp; <strong>D)</strong> $48\\pi$ &nbsp; <strong>E)</strong> $108\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">$V = \\dfrac{4}{3}\\pi r^{3} = \\dfrac{4}{3}\\pi \\cdot 27 = 36\\pi$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $36\\pi$ cm³</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Küre Yüzey</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $7$ cm olan kürenin yüzey alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $49\\pi$ &nbsp; <strong>B)</strong> $98\\pi$ &nbsp; <strong>C)</strong> $147\\pi$ &nbsp; <strong>D)</strong> <span class="key">$196\\pi$</span> &nbsp; <strong>E)</strong> $343\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$S = 4\\pi r^{2} = 4\\pi \\cdot 49 = 196\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $196\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Hacimden Yarıçap</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Hacmi $\\dfrac{500\\pi}{3}$ cm³ olan kürenin yarıçapı kaç cm'dir?<br><br>
      <strong>A)</strong> 6 cm &nbsp; <strong>B)</strong> 4 cm &nbsp; <strong>C)</strong> 7 cm &nbsp; <strong>D)</strong> 3 cm &nbsp; <strong>E)</strong> <span class="key">5 cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{4}{3}\\pi r^{3} = \\dfrac{500\\pi}{3} \\Rightarrow r^{3} = \\dfrac{500}{4} = 125 \\Rightarrow r = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5 cm</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Silindirin İçindeki Küre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $r$ olan kürenin içine sığacağı en küçük silindirin hacmi, kürenin hacminin kaç katıdır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> $\\dfrac{4}{3}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{3}{2}$</span> &nbsp; <strong>D)</strong> 2 &nbsp; <strong>E)</strong> $\\dfrac{2}{3}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Küreyi tam saran silindirin yarıçapı $r$, yüksekliği $2r$.</p>
      <p class="ales-sol-step">$V_{silindir} = \\pi r^{2} \\cdot 2r = 2\\pi r^{3}$.</p>
      <p class="ales-sol-step">$V_{küre} = \\dfrac{4}{3}\\pi r^{3}$.</p>
      <p class="ales-sol-step">Oran: $\\dfrac{V_{sil}}{V_{küre}} = \\dfrac{2}{4/3} = \\dfrac{3}{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{3}{2}$ katı</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Eritme — Hacim Korunumu</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $3$ cm olan bir küre eritilip yarıçapı $1$ cm olan kaç tane küçük küre yapılabilir?<br><br>
      <strong>A)</strong> 26 &nbsp; <strong>B)</strong> 28 &nbsp; <strong>C)</strong> <span class="key">27</span> &nbsp; <strong>D)</strong> 25 &nbsp; <strong>E)</strong> 29
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hacim Korunumu</div>
      <p class="ales-sol-step">Büyük küre hacmi: $\\dfrac{4}{3}\\pi \\cdot 27 = 36\\pi$.</p>
      <p class="ales-sol-step">Küçük küre hacmi: $\\dfrac{4}{3}\\pi \\cdot 1 = \\dfrac{4\\pi}{3}$.</p>
      <p class="ales-sol-step">Sayı: $\\dfrac{36\\pi}{4\\pi/3} = 36 \\cdot \\dfrac{3}{4} = 27$ tane.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 27</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Koni ve Piramit
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Koni ve Piramit (Eğik Yükseklik = √(r² + h²))</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Koni Hacim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Taban yarıçapı $4$ cm, yüksekliği $9$ cm olan koninin hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> $144\\pi$ &nbsp; <strong>B)</strong> <span class="key">$48\\pi$</span> &nbsp; <strong>C)</strong> $36\\pi$ &nbsp; <strong>D)</strong> $24\\pi$ &nbsp; <strong>E)</strong> $72\\pi$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 180 180" style="width:100%;max-width:220px">
        <ellipse cx="90" cy="150" rx="55" ry="15" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="35" y1="150" x2="90" y2="20" stroke="#fbbf24" stroke-width="2"/>
        <line x1="145" y1="150" x2="90" y2="20" stroke="#fbbf24" stroke-width="2"/>
        <line x1="90" y1="150" x2="90" y2="20" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="95" y="90" font-size="10" fill="currentColor" font-family="JetBrains Mono">h=9</text>
        <text x="105" y="155" font-size="10" fill="currentColor" font-family="JetBrains Mono">r=4</text>
      </svg>
      <div class="ales-diagram-caption">Koni: V = (1/3)πr²h</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$V = \\dfrac{1}{3}\\pi r^{2} h = \\dfrac{1}{3}\\pi \\cdot 16 \\cdot 9 = 48\\pi$ cm³.</p>
      <p class="ales-sol-step">Koni hacmi $=$ aynı taban+yükseklikteki silindirin $\\dfrac{1}{3}$'ü.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $48\\pi$ cm³</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Eğik Yükseklik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Taban yarıçapı $6$ cm, yüksekliği $8$ cm olan koninin eğik (yan) yüksekliği kaç cm'dir?<br><br>
      <strong>A)</strong> <span class="key">10 cm</span> &nbsp; <strong>B)</strong> 11 cm &nbsp; <strong>C)</strong> 9 cm &nbsp; <strong>D)</strong> 12 cm &nbsp; <strong>E)</strong> 8 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Pisagor</div>
      <p class="ales-sol-step">$\\ell = \\sqrt{r^{2} + h^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm.</p>
      <p class="ales-sol-step">($6$-$8$-$10$ Pisagor üçlüsü)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 10 cm</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Koni Yüzey Alanı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Taban yarıçapı $5$ cm, eğik yüksekliği $12$ cm olan koninin tüm yüzey alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $60\\pi$ &nbsp; <strong>B)</strong> $25\\pi$ &nbsp; <strong>C)</strong> $120\\pi$ &nbsp; <strong>D)</strong> $169\\pi$ &nbsp; <strong>E)</strong> <span class="key">$85\\pi$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yan yüzey $= \\pi r \\ell = \\pi \\cdot 5 \\cdot 12 = 60\\pi$.</p>
      <p class="ales-sol-step">Taban $= \\pi r^{2} = 25\\pi$.</p>
      <p class="ales-sol-step">Toplam $= 60\\pi + 25\\pi = 85\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $85\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Kare Piramit Hacim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Taban kenarı $6$ cm, yüksekliği $10$ cm olan kare tabanlı piramitin hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> 360 &nbsp; <strong>B)</strong> 60 &nbsp; <strong>C)</strong> 240 &nbsp; <strong>D)</strong> <span class="key">120</span> &nbsp; <strong>E)</strong> 100
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Piramit hacmi $= \\dfrac{1}{3} \\cdot$ taban alanı $\\cdot$ yükseklik.</p>
      <p class="ales-sol-step">$V = \\dfrac{1}{3} \\cdot 36 \\cdot 10 = 120$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 120 cm³</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Düzgün Üçgen Piramit</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Taban kenarı $6$ cm olan eşkenar üçgen tabanlı piramidin yüksekliği $5$ cm. Hacmi kaç cm³'tür?<br><br>
      <strong>A)</strong> $9\\sqrt{3}$ &nbsp; <strong>B)</strong> $45\\sqrt{3}$ &nbsp; <strong>C)</strong> $30\\sqrt{3}$ &nbsp; <strong>D)</strong> $5\\sqrt{3}$ &nbsp; <strong>E)</strong> <span class="key">$15\\sqrt{3}$</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşkenar üçgen alanı: $\\dfrac{a^{2}\\sqrt{3}}{4} = \\dfrac{36\\sqrt{3}}{4} = 9\\sqrt{3}$.</p>
      <p class="ales-sol-step">$V = \\dfrac{1}{3} \\cdot 9\\sqrt{3} \\cdot 5 = 15\\sqrt{3}$ cm³.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $15\\sqrt{3}$ cm³</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Koni Açımı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $r = 3$ cm, eğik yüksekliği $\\ell = 9$ cm olan koninin yan yüzeyi açıldığında oluşan dilim merkez açısı kaç derecedir?<br><br>
      <strong>A)</strong> 121° &nbsp; <strong>B)</strong> 119° &nbsp; <strong>C)</strong> 122° &nbsp; <strong>D)</strong> <span class="key">120°</span> &nbsp; <strong>E)</strong> 118°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Açılan yan yüzey, yarıçapı $\\ell = 9$ olan dairenin bir dilimidir.</p>
      <p class="ales-sol-step">Dilimin yayı $=$ koni tabanının çevresi $= 2\\pi r = 6\\pi$.</p>
      <p class="ales-sol-step">Tam dairenin çevresi $2\\pi \\ell = 18\\pi$. Açı oranı: $\\dfrac{6\\pi}{18\\pi} = \\dfrac{1}{3}$.</p>
      <p class="ales-sol-step">Merkez açı $= 360 \\cdot \\dfrac{1}{3} = 120°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 120°</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Koni Hacim Karşılaştırma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İki koniden birinin yarıçapı diğerinin $2$ katı, yüksekliği yarısı kadardır. Birinci koninin hacmi ikincisinin kaç katıdır?<br><br>
      <strong>A)</strong> 1 &nbsp; <strong>B)</strong> $\\dfrac{1}{2}$ &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> <span class="key">2</span> &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Koni 1: $r_1 = 2r$, $h_1 = h/2$ ⟹ $V_1 = \\dfrac{1}{3}\\pi (2r)^{2} \\cdot \\dfrac{h}{2} = \\dfrac{1}{3}\\pi \\cdot 4r^{2} \\cdot \\dfrac{h}{2} = \\dfrac{2\\pi r^{2} h}{3}$.</p>
      <p class="ales-sol-step">Koni 2: $V_2 = \\dfrac{1}{3}\\pi r^{2} h$.</p>
      <p class="ales-sol-step">Oran: $\\dfrac{V_1}{V_2} = \\dfrac{2/3}{1/3} = 2$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 2 katı</span></div>
    </div>
  </div>
</section>
`
};
