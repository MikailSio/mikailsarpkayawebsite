window.ALES_LESSON = {
n: 50,
title: "Pisagor ve Özel Üçgenler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>Pisagor teoremi ve özel üçgenler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Pisagor üçlüleri (3-4-5, 5-12-13, 8-15-17), <strong>30-60-90 üçgeni</strong> ($1:\\sqrt{3}:2$) ve <strong>45-45-90 üçgeni</strong> ($1:1:\\sqrt{2}$) ALES'in her sınavda çıkardığı çekirdek konulardır. SVG diyagramlarıyla özel üçgen oranlarını içselleştir.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Pisagor Teoremi ve Üçlüler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Pisagor Teoremi (a² + b² = c²) ve Üçlüleri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Klasik 3-4-5</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Dik kenarları $3$ cm ve $4$ cm olan dik üçgenin hipotenüsü kaç cm'dir?<br><br>
      <strong>A)</strong> 6 cm &nbsp; <strong>B)</strong> 4 cm &nbsp; <strong>C)</strong> 7 cm &nbsp; <strong>D)</strong> 3 cm &nbsp; <strong>E)</strong> <span class="key">5 cm</span>
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 160" style="width:100%;max-width:280px">
        <polygon points="30,140 170,140 30,40" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <rect x="30" y="130" width="10" height="10" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="15" y="95" font-size="12" fill="currentColor" font-family="JetBrains Mono">3</text>
        <text x="95" y="155" font-size="12" fill="currentColor" font-family="JetBrains Mono">4</text>
        <text x="105" y="85" font-size="12" fill="currentColor" font-family="JetBrains Mono">c=?</text>
      </svg>
      <div class="ales-diagram-caption">3-4-5 Pisagor üçlüsü</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pisagor: $c^{2} = 3^{2} + 4^{2} = 9 + 16 = 25 \\Rightarrow c = 5$.</p>
      <p class="ales-sol-step">3-4-5 üçlüsü ezberlenmeli — ALES'in en çok çıktığı üçlüdür.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 5 cm</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">5-12-13</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Hipotenüsü $13$ cm, dik kenarlarından biri $5$ cm olan dik üçgenin diğer dik kenarı kaç cm'dir?<br><br>
      <strong>A)</strong> 13 cm &nbsp; <strong>B)</strong> <span class="key">12 cm</span> &nbsp; <strong>C)</strong> 11 cm &nbsp; <strong>D)</strong> 14 cm &nbsp; <strong>E)</strong> 10 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$5^{2} + b^{2} = 13^{2} \\Rightarrow 25 + b^{2} = 169 \\Rightarrow b^{2} = 144 \\Rightarrow b = 12$.</p>
      <p class="ales-sol-step">Pisagor üçlüleri: <strong>3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12 cm</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Üçlünün Katı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Dik kenarları $9$ cm ve $12$ cm olan üçgenin hipotenüsü kaçtır?<br><br>
      <strong>A)</strong> <span class="key">15 cm</span> &nbsp; <strong>B)</strong> 16 cm &nbsp; <strong>C)</strong> 14 cm &nbsp; <strong>D)</strong> 17 cm &nbsp; <strong>E)</strong> 13 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Hızlı Tanıma</div>
      <p class="ales-sol-step">$9 = 3 \\cdot 3$, $12 = 3 \\cdot 4$ ⟹ $3$-$4$-$5$ üçlüsünün $3$ katı.</p>
      <p class="ales-sol-step">Hipotenüs $= 3 \\cdot 5 = 15$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 15 cm</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan</div>
      <p class="ales-sol-step">$9^{2} + 12^{2} = 81 + 144 = 225 = 15^{2}$ ✓.</p>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">8-15-17</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Hipotenüsü $17$ cm, dik kenarlarından biri $15$ cm olan üçgenin diğer dik kenarı kaç cm'dir?<br><br>
      <strong>A)</strong> <span class="key">8 cm</span> &nbsp; <strong>B)</strong> 9 cm &nbsp; <strong>C)</strong> 7 cm &nbsp; <strong>D)</strong> 10 cm &nbsp; <strong>E)</strong> 6 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$8$-$15$-$17$ Pisagor üçlüsünden ⟹ diğer dik kenar $8$ cm.</p>
      <p class="ales-sol-step">Doğrula: $8^{2} + 15^{2} = 64 + 225 = 289 = 17^{2}$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 8 cm</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Yükseklik Hipotenüse</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $3$-$4$-$5$ dik üçgeninde hipotenüse ait yükseklik kaç cm'dir?<br><br>
      <strong>A)</strong> $\\dfrac{5}{12}$ cm &nbsp; <strong>B)</strong> $\\dfrac{12}{7}$ cm &nbsp; <strong>C)</strong> $\\dfrac{5}{2}$ cm &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{12}{5}$ cm</span> &nbsp; <strong>E)</strong> $\\dfrac{7}{5}$ cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Alan Karşılaştırma</div>
      <p class="ales-sol-step">Alan iki yoldan: dik kenarlardan $A = \\dfrac{3 \\cdot 4}{2} = 6$.</p>
      <p class="ales-sol-step">Hipotenüsten: $A = \\dfrac{5 \\cdot h}{2} = 6 \\Rightarrow h = \\dfrac{12}{5} = 2{,}4$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\dfrac{12}{5}$ cm</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Köşegen — Dikdörtgen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Kenarları $6$ cm ve $8$ cm olan dikdörtgenin köşegeni kaç cm'dir?<br><br>
      <strong>A)</strong> <span class="key">10 cm</span> &nbsp; <strong>B)</strong> 11 cm &nbsp; <strong>C)</strong> 9 cm &nbsp; <strong>D)</strong> 12 cm &nbsp; <strong>E)</strong> 8 cm
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 160" style="width:100%;max-width:300px">
        <rect x="30" y="40" width="160" height="100" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="30" y1="40" x2="190" y2="140" stroke="#06b6d4" stroke-width="2"/>
        <text x="15" y="95" font-size="11" fill="currentColor" font-family="JetBrains Mono">6</text>
        <text x="105" y="155" font-size="11" fill="currentColor" font-family="JetBrains Mono">8</text>
        <text x="100" y="80" font-size="11" fill="currentColor" font-family="JetBrains Mono">d</text>
      </svg>
      <div class="ales-diagram-caption">Dikdörtgen köşegeni Pisagor</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Köşegen $= \\sqrt{6^{2} + 8^{2}} = \\sqrt{36 + 64} = \\sqrt{100} = 10$ cm.</p>
      <p class="ales-sol-step">Yine $3$-$4$-$5$ üçlüsünün $2$ katı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 10 cm</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İkizkenar Dik Üçgen Bileşke</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İki dik üçgenin hipotenüsleri ortak ve $13$ cm. Bir üçgenin dik kenarları $5$ ve $12$, diğerinin dik kenarlarından biri $13/\\sqrt{2}$ cm. Diğer dik kenar kaçtır?<br><br>
      <strong>A)</strong> $13$ cm &nbsp; <strong>B)</strong> $\\dfrac{13}{2}$ cm &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{13\\sqrt{2}}{2}$ cm</span> &nbsp; <strong>D)</strong> $13\\sqrt{2}$ cm &nbsp; <strong>E)</strong> $\\dfrac{13\\sqrt{3}}{2}$ cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İkinci üçgenin hipotenüsü $13$ ve bir dik kenarı $\\dfrac{13}{\\sqrt{2}}$.</p>
      <p class="ales-sol-step">Diğer kenar: $b^{2} = 13^{2} - \\left(\\dfrac{13}{\\sqrt{2}}\\right)^{2} = 169 - \\dfrac{169}{2} = \\dfrac{169}{2}$.</p>
      <p class="ales-sol-step">$b = \\dfrac{13}{\\sqrt{2}} = \\dfrac{13\\sqrt{2}}{2}$ cm.</p>
      <p class="ales-sol-step"><strong>Yorum:</strong> İki dik kenarı eşit ⟹ bu üçgen $45$-$45$-$90$ ikizkenar dik üçgen.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{13\\sqrt{2}}{2}$ cm</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — 30-60-90 Üçgeni (1:√3:2)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">30-60-90 Üçgeni (1 : √3 : 2)</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Temel Oran</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $30°$ açısının karşısındaki kenar $5$ cm olan $30$-$60$-$90$ üçgeninin hipotenüsü ve $60°$ karşısındaki kenarı kaçtır?<br><br>
      <strong>A)</strong> $5\\sqrt{2}$, $10$ &nbsp; <strong>B)</strong> $5\\sqrt{3}$, $5$ &nbsp; <strong>C)</strong> $10$, $5\\sqrt{3}$ &nbsp; <strong>D)</strong> <span class="key">$5\\sqrt{3}$, $10$</span> &nbsp; <strong>E)</strong> $5$, $10\\sqrt{3}$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <polygon points="30,160 170,160 30,40" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <rect x="30" y="150" width="10" height="10" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="10" y="105" font-size="11" fill="currentColor" font-family="JetBrains Mono">5</text>
        <text x="100" y="170" font-size="11" fill="currentColor" font-family="JetBrains Mono">5√3</text>
        <text x="100" y="100" font-size="11" fill="currentColor" font-family="JetBrains Mono">10</text>
        <text x="48" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">30°</text>
        <text x="148" y="155" font-size="10" fill="currentColor" font-family="JetBrains Mono">60°</text>
      </svg>
      <div class="ales-diagram-caption">30-60-90 oranı 1 : √3 : 2</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$30$-$60$-$90$ üçgeninde kenarlar $1 : \\sqrt{3} : 2$ oranındadır.</p>
      <p class="ales-sol-step">$30°$ karşısı $5$ ⟹ $60°$ karşısı $5\\sqrt{3}$ ve hipotenüs $5 \\cdot 2 = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $5\\sqrt{3}$, $10$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Hipotenüs Verilmiş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $30$-$60$-$90$ üçgeninde hipotenüs $14$ cm. $30°$ karşısındaki kenar kaç cm'dir?<br><br>
      <strong>A)</strong> <span class="key">7 cm</span> &nbsp; <strong>B)</strong> 8 cm &nbsp; <strong>C)</strong> 6 cm &nbsp; <strong>D)</strong> 9 cm &nbsp; <strong>E)</strong> 5 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$30°$ karşısı = hipotenüsün yarısı $= 14/2 = 7$ cm.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> Bir dik üçgende $30°$ karşısındaki kenar daima hipotenüsün yarısıdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 7 cm</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">60° Karşısı Verilmiş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $30$-$60$-$90$ üçgeninde $60°$'nin karşısındaki kenar $9\\sqrt{3}$ cm. Hipotenüs kaç cm'dir?<br><br>
      <strong>A)</strong> 19 cm &nbsp; <strong>B)</strong> 17 cm &nbsp; <strong>C)</strong> 20 cm &nbsp; <strong>D)</strong> <span class="key">18 cm</span> &nbsp; <strong>E)</strong> 16 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Oranlar $1 : \\sqrt{3} : 2$. $\\sqrt{3}$ kısmı $9\\sqrt{3}$ ⟹ birim $= 9$.</p>
      <p class="ales-sol-step">Hipotenüs $= 2 \\cdot 9 = 18$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 18 cm</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Eşkenar Üçgenin Yüksekliği</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $8$ cm olan eşkenar üçgenin yüksekliği kaç cm'dir?<br><br>
      <strong>A)</strong> $8\\sqrt{3}$ cm &nbsp; <strong>B)</strong> $4$ cm &nbsp; <strong>C)</strong> <span class="key">$4\\sqrt{3}$ cm</span> &nbsp; <strong>D)</strong> $2\\sqrt{3}$ cm &nbsp; <strong>E)</strong> $4\\sqrt{2}$ cm
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <polygon points="100,30 30,160 170,160" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="100" y1="30" x2="100" y2="160" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <rect x="100" y="150" width="10" height="10" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
        <text x="105" y="100" font-size="11" fill="currentColor" font-family="JetBrains Mono">h</text>
        <text x="65" y="170" font-size="11" fill="currentColor" font-family="JetBrains Mono">4</text>
        <text x="135" y="170" font-size="11" fill="currentColor" font-family="JetBrains Mono">4</text>
      </svg>
      <div class="ales-diagram-caption">Yükseklik eşkenarı 30-60-90'a böler</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — 30-60-90 Yöntemi</div>
      <p class="ales-sol-step">Yükseklik tabanı dik açıyla ikiye böler ⟹ oluşan yarım üçgen $30$-$60$-$90$.</p>
      <p class="ales-sol-step">$30°$ karşısı $4$ (yarısı), hipotenüs $8$, $60°$ karşısı $4\\sqrt{3}$ ⟹ yükseklik $h = 4\\sqrt{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $4\\sqrt{3}$ cm</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Formül</div>
      <p class="ales-sol-step">Eşkenar üçgen yüksekliği: $h = \\dfrac{a\\sqrt{3}}{2} = \\dfrac{8\\sqrt{3}}{2} = 4\\sqrt{3}$.</p>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">30-60-90 Çevre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $30$-$60$-$90$ üçgeninin çevresi $6 + 6\\sqrt{3} + 12$ cm'dir. Hipotenüs kaç cm'dir?<br><br>
      <strong>A)</strong> 13 cm &nbsp; <strong>B)</strong> 11 cm &nbsp; <strong>C)</strong> 14 cm &nbsp; <strong>D)</strong> 10 cm &nbsp; <strong>E)</strong> <span class="key">12 cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kenarlar $1 : \\sqrt{3} : 2$ oranında ⟹ $6, 6\\sqrt{3}, 12$ tam bu desende.</p>
      <p class="ales-sol-step">Hipotenüs (en uzun) $= 12$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12 cm</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Eşkenar Üçgen Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $10$ cm olan eşkenar üçgenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $50\\sqrt{3}$ cm² &nbsp; <strong>B)</strong> <span class="key">$25\\sqrt{3}$ cm²</span> &nbsp; <strong>C)</strong> $100$ cm² &nbsp; <strong>D)</strong> $50$ cm² &nbsp; <strong>E)</strong> $25$ cm²
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yükseklik $h = \\dfrac{10\\sqrt{3}}{2} = 5\\sqrt{3}$.</p>
      <p class="ales-sol-step">$A = \\dfrac{10 \\cdot 5\\sqrt{3}}{2} = 25\\sqrt{3}$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $25\\sqrt{3}$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Kompozit Şekil</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Hipotenüsü $20$ cm olan $30$-$60$-$90$ üçgeninin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $100\\sqrt{3}$ cm² &nbsp; <strong>B)</strong> $25\\sqrt{3}$ cm² &nbsp; <strong>C)</strong> $50$ cm² &nbsp; <strong>D)</strong> <span class="key">$50\\sqrt{3}$ cm²</span> &nbsp; <strong>E)</strong> $200$ cm²
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hipotenüs $= 2 \\cdot$ birim $= 20 \\Rightarrow$ birim $= 10$.</p>
      <p class="ales-sol-step">Dik kenarlar: $10$ ve $10\\sqrt{3}$.</p>
      <p class="ales-sol-step">$A = \\dfrac{10 \\cdot 10\\sqrt{3}}{2} = 50\\sqrt{3}$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $50\\sqrt{3}$ cm²</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — 45-45-90 Üçgeni (1:1:√2)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">45-45-90 Üçgeni (1 : 1 : √2)</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Temel Oran</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Dik kenarları $7$ cm olan ikizkenar dik üçgenin hipotenüsü kaç cm'dir?<br><br>
      <strong>A)</strong> $14$ cm &nbsp; <strong>B)</strong> $7\\sqrt{3}$ cm &nbsp; <strong>C)</strong> <span class="key">$7\\sqrt{2}$ cm</span> &nbsp; <strong>D)</strong> $7$ cm &nbsp; <strong>E)</strong> $\\dfrac{7}{\\sqrt{2}}$ cm
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <polygon points="30,160 170,160 30,20" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <rect x="30" y="150" width="10" height="10" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="10" y="95" font-size="11" fill="currentColor" font-family="JetBrains Mono">7</text>
        <text x="95" y="170" font-size="11" fill="currentColor" font-family="JetBrains Mono">7</text>
        <text x="105" y="80" font-size="11" fill="currentColor" font-family="JetBrains Mono">7√2</text>
        <text x="40" y="40" font-size="10" fill="currentColor" font-family="JetBrains Mono">45°</text>
        <text x="148" y="155" font-size="10" fill="currentColor" font-family="JetBrains Mono">45°</text>
      </svg>
      <div class="ales-diagram-caption">45-45-90 oranı 1 : 1 : √2</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$45$-$45$-$90$ üçgeninde kenarlar $1 : 1 : \\sqrt{2}$.</p>
      <p class="ales-sol-step">Hipotenüs $= 7 \\cdot \\sqrt{2} = 7\\sqrt{2}$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $7\\sqrt{2}$ cm</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Hipotenüs → Dik Kenar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İkizkenar dik üçgenin hipotenüsü $10\\sqrt{2}$ cm ise her bir dik kenar kaç cm'dir?<br><br>
      <strong>A)</strong> 11 cm &nbsp; <strong>B)</strong> <span class="key">10 cm</span> &nbsp; <strong>C)</strong> 9 cm &nbsp; <strong>D)</strong> 12 cm &nbsp; <strong>E)</strong> 8 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Hipotenüs $= a\\sqrt{2} = 10\\sqrt{2} \\Rightarrow a = 10$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 10 cm</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Karenin Köşegeni</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $6$ cm olan karenin köşegeni kaç cm'dir?<br><br>
      <strong>A)</strong> $6$ cm &nbsp; <strong>B)</strong> $12$ cm &nbsp; <strong>C)</strong> $6\\sqrt{3}$ cm &nbsp; <strong>D)</strong> <span class="key">$6\\sqrt{2}$ cm</span> &nbsp; <strong>E)</strong> $3\\sqrt{2}$ cm
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 180 180" style="width:100%;max-width:240px">
        <rect x="30" y="30" width="120" height="120" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="30" y1="30" x2="150" y2="150" stroke="#06b6d4" stroke-width="2"/>
        <text x="15" y="95" font-size="11" fill="currentColor" font-family="JetBrains Mono">6</text>
        <text x="80" y="100" font-size="11" fill="currentColor" font-family="JetBrains Mono">d</text>
      </svg>
      <div class="ales-diagram-caption">Kare köşegeni: kenar × √2</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karenin köşegeni $45$-$45$-$90$ üçgeninin hipotenüsüdür: $d = 6\\sqrt{2}$ cm.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> Kare köşegeni $= a\\sqrt{2}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6\\sqrt{2}$ cm</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İkizkenar Dik Üçgen Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Hipotenüsü $8$ cm olan ikizkenar dik üçgenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $32$ cm² &nbsp; <strong>B)</strong> $8$ cm² &nbsp; <strong>C)</strong> $24$ cm² &nbsp; <strong>D)</strong> $64$ cm² &nbsp; <strong>E)</strong> <span class="key">$16$ cm²</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Dik kenar $a$: $a\\sqrt{2} = 8 \\Rightarrow a = \\dfrac{8}{\\sqrt{2}} = 4\\sqrt{2}$.</p>
      <p class="ales-sol-step">$A = \\dfrac{a^{2}}{2} = \\dfrac{(4\\sqrt{2})^{2}}{2} = \\dfrac{32}{2} = 16$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 16 cm²</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Köşegen Formülü</div>
      <p class="ales-sol-step">Hipotenüs köşegen rolü oynar; $A = \\dfrac{d^{2}}{4}$ değil — burada üçgen, dolayısıyla yarım kare $A = \\dfrac{8^{2}}{4} = 16$ cm² (kare alanının yarısı $\\dfrac{(a\\sqrt{2})^2}{4}$).</p>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Karenin Yarısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Köşegeni $14$ cm olan karenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $196$ cm² &nbsp; <strong>B)</strong> $49$ cm² &nbsp; <strong>C)</strong> <span class="key">$98$ cm²</span> &nbsp; <strong>D)</strong> $56$ cm² &nbsp; <strong>E)</strong> $112$ cm²
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Köşegen Formülü</div>
      <p class="ales-sol-step">Karenin alanı = $\\dfrac{d^{2}}{2} = \\dfrac{14^{2}}{2} = \\dfrac{196}{2} = 98$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 98 cm²</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Kenar Bul</div>
      <p class="ales-sol-step">$a\\sqrt{2} = 14 \\Rightarrow a = 7\\sqrt{2}$. $A = a^{2} = (7\\sqrt{2})^{2} = 98$ ✓.</p>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">İçinde 30-60-90 ve 45-45-90</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Şekilde $\\widehat{A} = 90°$, $\\widehat{B} = 45°$, $\\widehat{ADC} = 60°$, $|AB| = 6$ cm. $|CD|$ kaç cm'dir? ($D$, $AB$ ile $C$ arasında, $\\angle ADC = 60°$)<br><br>
      <strong>A)</strong> $6\\sqrt{3}$ cm &nbsp; <strong>B)</strong> $4\\sqrt{2}$ cm &nbsp; <strong>C)</strong> $2\\sqrt{3}$ cm &nbsp; <strong>D)</strong> $6$ cm &nbsp; <strong>E)</strong> <span class="key">$4\\sqrt{3}$ cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$ABC$: $\\widehat{A} = 90°$, $\\widehat{B} = 45°$ ⟹ ikizkenar dik üçgen, $|AC| = |AB| = 6$.</p>
      <p class="ales-sol-step">$ACD$: $\\widehat{DAC} = 90°$, $\\widehat{ADC} = 60°$ ⟹ $30$-$60$-$90$ üçgeni, $|AC| = 6$ ($60°$ karşısı).</p>
      <p class="ales-sol-step">$|AC| = 6 = $ birim $\\cdot \\sqrt{3} \\Rightarrow$ birim $= \\dfrac{6}{\\sqrt{3}} = 2\\sqrt{3}$.</p>
      <p class="ales-sol-step">Hipotenüs $|CD| = 2 \\cdot 2\\sqrt{3} = 4\\sqrt{3}$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $4\\sqrt{3}$ cm</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">İkizkenar Dik Yükseklik</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İkizkenar dik üçgende dik kenar $a$ ise hipotenüse ait yükseklik kaçtır?<br><br>
      <strong>A)</strong> $a\\sqrt{2}$ &nbsp; <strong>B)</strong> $\\dfrac{a}{2}$ &nbsp; <strong>C)</strong> <span class="key">$\\dfrac{a\\sqrt{2}}{2}$</span> &nbsp; <strong>D)</strong> $\\dfrac{a\\sqrt{3}}{2}$ &nbsp; <strong>E)</strong> $a$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Alan iki yoldan: $A = \\dfrac{a \\cdot a}{2} = \\dfrac{a^{2}}{2}$.</p>
      <p class="ales-sol-step">Hipotenüs $= a\\sqrt{2}$. $A = \\dfrac{a\\sqrt{2} \\cdot h}{2} = \\dfrac{a^{2}}{2} \\Rightarrow h = \\dfrac{a}{\\sqrt{2}} = \\dfrac{a\\sqrt{2}}{2}$.</p>
      <p class="ales-sol-step">Yani yükseklik = hipotenüsün yarısı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\dfrac{a\\sqrt{2}}{2}$</span></div>
    </div>
  </div>
</section>
`
};
