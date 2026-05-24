window.ALES_LESSON = {
n: 49,
title: "Üçgenler — Temel Özellikler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>üçgenler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. İç açı toplamı $180°$ ve dış açı kuralı, üçgen eşitsizliği ($|a-b| < c < a+b$), kenar-açı ilişkisi (büyük açı karşısında büyük kenar) ve alan formülleri (taban×yükseklik$/2$, iki kenar arası açı sinüslü). SVG diyagramlarla destekledik.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İç Açı Toplamı 180° + Dış Açı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İç Açı Toplamı 180° ve Dış Açı</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Üç Açıdan İkisi Verilmiş</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki iç açısı $50°$ ve $70°$ ise üçüncü açı kaç derecedir?<br><br>
      <strong>A)</strong> 61° &nbsp; <strong>B)</strong> 59° &nbsp; <strong>C)</strong> 62° &nbsp; <strong>D)</strong> 58° &nbsp; <strong>E)</strong> <span class="key">60°</span>
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 150" style="width:100%;max-width:300px">
        <polygon points="20,130 180,130 100,30" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <text x="22" y="125" font-size="11" fill="currentColor" font-family="JetBrains Mono">50°</text>
        <text x="160" y="125" font-size="11" fill="currentColor" font-family="JetBrains Mono">70°</text>
        <text x="92" y="42" font-size="11" fill="currentColor" font-family="JetBrains Mono">?</text>
      </svg>
      <div class="ales-diagram-caption">İç açıların toplamı 180°</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üçgende iç açılar toplamı $180°$: $50 + 70 + x = 180 \\Rightarrow x = 60°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60°</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">İkizkenar Tepe Açısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ikizkenar üçgende taban açıları $40°$ ise tepe açısı kaç derecedir?<br><br>
      <strong>A)</strong> 101° &nbsp; <strong>B)</strong> <span class="key">100°</span> &nbsp; <strong>C)</strong> 99° &nbsp; <strong>D)</strong> 102° &nbsp; <strong>E)</strong> 98°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İkizkenar üçgende taban açıları eşittir. İki taban açısı $40 + 40 = 80°$.</p>
      <p class="ales-sol-step">Tepe açısı $= 180 - 80 = 100°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 100°</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Eşkenar Üçgen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Eşkenar bir üçgenin her iç açısı kaç derecedir?<br><br>
      <strong>A)</strong> 61° &nbsp; <strong>B)</strong> 59° &nbsp; <strong>C)</strong> <span class="key">60°</span> &nbsp; <strong>D)</strong> 62° &nbsp; <strong>E)</strong> 58°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşkenar üçgenin tüm açıları eşittir. Toplam $180°$, üç eşit parça ⟹ her açı $60°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 60°</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Dış Açı Kuralı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki uzak iç açısı $35°$ ve $75°$ ise üçüncü açının dış açısı kaç derecedir?<br><br>
      <strong>A)</strong> <span class="key">110°</span> &nbsp; <strong>B)</strong> 111° &nbsp; <strong>C)</strong> 109° &nbsp; <strong>D)</strong> 112° &nbsp; <strong>E)</strong> 108°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 240 150" style="width:100%;max-width:320px">
        <polygon points="30,130 200,130 110,30" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="200" y1="130" x2="230" y2="130" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="32" y="125" font-size="11" fill="currentColor" font-family="JetBrains Mono">35°</text>
        <text x="100" y="42" font-size="11" fill="currentColor" font-family="JetBrains Mono">75°</text>
        <text x="207" y="120" font-size="11" fill="currentColor" font-family="JetBrains Mono">dış</text>
      </svg>
      <div class="ales-diagram-caption">Dış açı = uzak iki iç açının toplamı</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dış Açı Teoremi</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Bir köşedeki dış açı, uzak iki iç açının toplamına eşittir.</p>
      <p class="ales-sol-step">Dış açı $= 35 + 75 = 110°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 110°</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif</div>
      <p class="ales-sol-step">Üçüncü iç açı $= 180 - 35 - 75 = 70°$. Dış açı bütünleri ⟹ $180 - 70 = 110°$.</p>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Açıortay Açısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $ABC$ üçgeninde $\\widehat{A} = 80°$. $B$ ve $C$ açılarının açıortayları $I$ noktasında kesişiyor. $\\widehat{BIC}$ kaç derecedir?<br><br>
      <strong>A)</strong> 131° &nbsp; <strong>B)</strong> 129° &nbsp; <strong>C)</strong> 132° &nbsp; <strong>D)</strong> <span class="key">130°</span> &nbsp; <strong>E)</strong> 128°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Genel Formül</div>
      <p class="ales-sol-step">Açıortayların kesim noktasında: $\\widehat{BIC} = 90° + \\dfrac{\\widehat{A}}{2}$.</p>
      <p class="ales-sol-step">$\\widehat{BIC} = 90 + \\dfrac{80}{2} = 90 + 40 = 130°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 130°</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Doğrudan</div>
      <p class="ales-sol-step">$\\widehat{B} + \\widehat{C} = 180 - 80 = 100°$. Açıortaylar ikiye böler: $\\dfrac{B}{2} + \\dfrac{C}{2} = 50°$.</p>
      <p class="ales-sol-step">$BIC$ üçgeni: $\\widehat{BIC} = 180 - 50 = 130°$.</p>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Dış Açıortay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $ABC$ üçgeninde $\\widehat{A} = 60°$ olup $B$ ve $C$ köşelerindeki dış açıların açıortayları $D$ noktasında kesişiyor. $\\widehat{BDC}$ kaç derecedir?<br><br>
      <strong>A)</strong> 61° &nbsp; <strong>B)</strong> 59° &nbsp; <strong>C)</strong> 62° &nbsp; <strong>D)</strong> 58° &nbsp; <strong>E)</strong> <span class="key">60°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Genel Formül</div>
      <p class="ales-sol-step">$D$ dış açıortayların kesimi ise: $\\widehat{BDC} = 90° - \\dfrac{\\widehat{A}}{2}$.</p>
      <p class="ales-sol-step">$\\widehat{BDC} = 90 - 30 = 60°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60°</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">İç-Dış Karma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgende iç açılar $2x$, $3x$, $4x$ derecedir. En büyük dış açı kaç derecedir?<br><br>
      <strong>A)</strong> 141° &nbsp; <strong>B)</strong> 139° &nbsp; <strong>C)</strong> 142° &nbsp; <strong>D)</strong> <span class="key">140°</span> &nbsp; <strong>E)</strong> 138°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2x + 3x + 4x = 180 \\Rightarrow 9x = 180 \\Rightarrow x = 20$.</p>
      <p class="ales-sol-step">İç açılar: $40°, 60°, 80°$. En küçük iç açı = en büyük dış açıyı verir (bütünler).</p>
      <p class="ales-sol-step">En büyük dış açı $= 180 - 40 = 140°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 140°</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Üçgen Eşitsizliği ve Kenar-Açı İlişkisi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Üçgen Eşitsizliği ve Kenar-Açı İlişkisi</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Üçüncü Kenar Aralığı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki kenarı $7$ cm ve $10$ cm ise üçüncü kenar $a$ kaç değer aralığındadır?<br><br>
      <strong>A)</strong> $0 < a < 17$ &nbsp; <strong>B)</strong> <span class="key">$3 < a < 17$</span> &nbsp; <strong>C)</strong> $3 < a < 10$ &nbsp; <strong>D)</strong> $7 < a < 10$ &nbsp; <strong>E)</strong> $3 \\leq a \\leq 17$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Üçgen Eşitsizliği</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $|a-b| < c < a+b$.</p>
      <p class="ales-sol-step">$|10 - 7| < a < 10 + 7 \\Rightarrow 3 < a < 17$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $3 < a < 17$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Tam Sayı Sayısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki kenarı $5$ cm ve $8$ cm. Üçüncü kenar tam sayı olmak üzere kaç farklı değer alabilir?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> <span class="key">9</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$|8 - 5| < a < 8 + 5 \\Rightarrow 3 < a < 13$.</p>
      <p class="ales-sol-step">Tam sayılar: $4, 5, 6, 7, 8, 9, 10, 11, 12$ ⟹ $9$ değer.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 9</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Kenar-Açı İlişkisi</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgende iç açılar $40°, 60°, 80°$. Bu açıların karşısındaki kenarlar sırasıyla $a, b, c$ ise hangisi en uzundur?<br><br>
      <strong>A)</strong> a &nbsp; <strong>B)</strong> b &nbsp; <strong>C)</strong> <span class="key">c</span> &nbsp; <strong>D)</strong> a = b &nbsp; <strong>E)</strong> Hepsi eşit
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Büyük açının karşısında büyük kenar bulunur.</p>
      <p class="ales-sol-step">En büyük açı $80°$ ⟹ karşısındaki kenar $c$ en uzundur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) c</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Üçgen Olma Kontrolü</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki üçlü kenar uzunluklarından hangileri bir üçgen oluşturmaz?<br>
      <strong>I.</strong> $5, 6, 10$ &nbsp; <strong>II.</strong> $4, 5, 9$ &nbsp; <strong>III.</strong> $3, 4, 6$ &nbsp; <strong>IV.</strong> $2, 3, 6$<br><br>
      <strong>A)</strong> Yalnız II &nbsp; <strong>B)</strong> Yalnız IV &nbsp; <strong>C)</strong> <span class="key">II ve IV</span> &nbsp; <strong>D)</strong> I ve III &nbsp; <strong>E)</strong> I ve IV
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üçgen eşitsizliği: en büyük kenar $<$ diğer iki kenarın toplamı.</p>
      <p class="ales-sol-step"><strong>I.</strong> $10 < 5 + 6 = 11$ ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> $9 < 4 + 5 = 9$ — eşit, üçgen olmaz ✗</p>
      <p class="ales-sol-step"><strong>III.</strong> $6 < 3 + 4 = 7$ ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $6 < 2 + 3 = 5$ ✗</p>
      <p class="ales-sol-step">II ve IV üçgen oluşturmaz.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) II ve IV</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İkizkenarda Üçüncü Kenar</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ikizkenar üçgenin iki kenarı $4$ cm ve $9$ cm. Çevresi kaç cm'dir?<br><br>
      <strong>A)</strong> 23 cm &nbsp; <strong>B)</strong> 21 cm &nbsp; <strong>C)</strong> <span class="key">22 cm</span> &nbsp; <strong>D)</strong> 24 cm &nbsp; <strong>E)</strong> 20 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — İki Olası Durum</div>
      <p class="ales-sol-step"><strong>Durum 1:</strong> Eşit kenarlar $4$ olsun ⟹ kenarlar $4, 4, 9$. Üçgen eşitsizliği: $9 < 4 + 4 = 8$? Hayır ⟹ olmaz.</p>
      <p class="ales-sol-step"><strong>Durum 2:</strong> Eşit kenarlar $9$ olsun ⟹ kenarlar $9, 9, 4$. $9 < 9 + 4 = 13$ ✓.</p>
      <p class="ales-sol-step">Çevre $= 9 + 9 + 4 = 22$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 22 cm</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Açı Sıralama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $ABC$ üçgeninde $|AB| = 6$, $|BC| = 9$, $|AC| = 7$. Açıları küçükten büyüğe sırala.<br><br>
      <strong>A)</strong> $\\widehat{A} < \\widehat{B} < \\widehat{C}$ &nbsp; <strong>B)</strong> $\\widehat{B} < \\widehat{A} < \\widehat{C}$ &nbsp; <strong>C)</strong> <span class="key">$\\widehat{C} < \\widehat{B} < \\widehat{A}$</span> &nbsp; <strong>D)</strong> $\\widehat{C} < \\widehat{A} < \\widehat{B}$ &nbsp; <strong>E)</strong> $\\widehat{A} = \\widehat{B} = \\widehat{C}$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bir köşedeki açı, karşı kenara baktığı kadar büyüktür. Köşelerin karşı kenarları:</p>
      <p class="ales-sol-step">$\\widehat{A}$ karşısı $|BC| = 9$, $\\widehat{B}$ karşısı $|AC| = 7$, $\\widehat{C}$ karşısı $|AB| = 6$.</p>
      <p class="ales-sol-step">Kenar sırası küçük→büyük: $6, 7, 9$ ⟹ açı sırası: $\\widehat{C} < \\widehat{B} < \\widehat{A}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\widehat{C} < \\widehat{B} < \\widehat{A}$</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Çevre Aralığı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki kenarı $6$ ve $11$. Çevresi $C$ olmak üzere $C$ hangi aralıktadır?<br><br>
      <strong>A)</strong> $17 < C < 34$ &nbsp; <strong>B)</strong> $22 < C < 28$ &nbsp; <strong>C)</strong> $5 < C < 17$ &nbsp; <strong>D)</strong> <span class="key">$22 < C < 34$</span> &nbsp; <strong>E)</strong> $22 \\leq C \\leq 34$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üçüncü kenar $a$ için: $|11 - 6| < a < 11 + 6 \\Rightarrow 5 < a < 17$.</p>
      <p class="ales-sol-step">Çevre $C = 6 + 11 + a = 17 + a$.</p>
      <p class="ales-sol-step">$5 < a < 17 \\Rightarrow 22 < C < 34$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $22 < C < 34$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Alan Formülleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Alan Formülleri</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Taban × Yükseklik</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Tabanı $12$ cm, bu tabana ait yüksekliği $5$ cm olan bir üçgenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> 60 cm² &nbsp; <strong>B)</strong> 17 cm² &nbsp; <strong>C)</strong> 25 cm² &nbsp; <strong>D)</strong> <span class="key">30 cm²</span> &nbsp; <strong>E)</strong> 36 cm²
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 150" style="width:100%;max-width:300px">
        <polygon points="20,130 180,130 100,30" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="100" y1="30" x2="100" y2="130" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="105" y="80" font-size="11" fill="currentColor" font-family="JetBrains Mono">h=5</text>
        <text x="90" y="145" font-size="11" fill="currentColor" font-family="JetBrains Mono">a=12</text>
      </svg>
      <div class="ales-diagram-caption">A = (taban × yükseklik) / 2</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = \\dfrac{a \\cdot h}{2} = \\dfrac{12 \\cdot 5}{2} = 30$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 30 cm²</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Yükseklik Bulma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Alanı $48$ cm² ve tabanı $16$ cm olan üçgenin tabana ait yüksekliği kaç cm'dir?<br><br>
      <strong>A)</strong> 7 cm &nbsp; <strong>B)</strong> 5 cm &nbsp; <strong>C)</strong> 8 cm &nbsp; <strong>D)</strong> 4 cm &nbsp; <strong>E)</strong> <span class="key">6 cm</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$48 = \\dfrac{16 \\cdot h}{2} = 8h \\Rightarrow h = 6$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 6 cm</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki Kenar — Aradaki Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki kenarı $8$ cm ve $10$ cm; aradaki açı $30°$. Alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> 40 cm² &nbsp; <strong>B)</strong> 30 cm² &nbsp; <strong>C)</strong> <span class="key">20 cm²</span> &nbsp; <strong>D)</strong> 80 cm² &nbsp; <strong>E)</strong> 10 cm²
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sinüslü Alan Formülü</div>
      <p class="ales-sol-step">$A = \\dfrac{1}{2} \\cdot a \\cdot b \\cdot \\sin(C) = \\dfrac{1}{2} \\cdot 8 \\cdot 10 \\cdot \\sin 30°$.</p>
      <p class="ales-sol-step">$\\sin 30° = \\dfrac{1}{2} \\Rightarrow A = \\dfrac{1}{2} \\cdot 80 \\cdot \\dfrac{1}{2} = 20$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 20 cm²</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Eşkenar Üçgen Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir kenarı $6$ cm olan eşkenar üçgenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $18\\sqrt{3}$ cm² &nbsp; <strong>B)</strong> $36\\sqrt{3}$ cm² &nbsp; <strong>C)</strong> $6\\sqrt{3}$ cm² &nbsp; <strong>D)</strong> $12\\sqrt{3}$ cm² &nbsp; <strong>E)</strong> <span class="key">$9\\sqrt{3}$ cm²</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">Eşkenar üçgen alan: $A = \\dfrac{a^{2}\\sqrt{3}}{4}$.</p>
      <p class="ales-sol-step">$A = \\dfrac{36 \\sqrt{3}}{4} = 9\\sqrt{3}$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) $9\\sqrt{3}$ cm²</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sinüslü</div>
      <p class="ales-sol-step">Açı $60°$, $\\sin 60° = \\dfrac{\\sqrt{3}}{2}$. $A = \\dfrac{1}{2} \\cdot 6 \\cdot 6 \\cdot \\dfrac{\\sqrt{3}}{2} = 9\\sqrt{3}$.</p>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">İki Üçgenin Alan Oranı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aynı yüksekliğe sahip iki üçgenin tabanları $5$ cm ve $8$ cm ise alanlarının oranı nedir?<br><br>
      <strong>A)</strong> 8:5 &nbsp; <strong>B)</strong> 25:64 &nbsp; <strong>C)</strong> 1:1 &nbsp; <strong>D)</strong> <span class="key">5:8</span> &nbsp; <strong>E)</strong> 3:5
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A_1 = \\dfrac{5h}{2}$, $A_2 = \\dfrac{8h}{2}$. Oran: $\\dfrac{A_1}{A_2} = \\dfrac{5}{8}$.</p>
      <p class="ales-sol-step"><strong>Genel:</strong> Aynı yükseklikli üçgenlerin alanları, tabanları ile orantılıdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 5:8</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kenarortay ve Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Alanı $36$ cm² olan $ABC$ üçgeninde $D$, $BC$ kenarının orta noktasıdır. $ABD$ üçgeninin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> 12 cm² &nbsp; <strong>B)</strong> 9 cm² &nbsp; <strong>C)</strong> 24 cm² &nbsp; <strong>D)</strong> 36 cm² &nbsp; <strong>E)</strong> <span class="key">18 cm²</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kenarortay üçgeni iki eşit alanlı parçaya böler ($BD = DC$, yükseklik aynı).</p>
      <p class="ales-sol-step">$A(ABD) = A(ABC)/2 = 36/2 = 18$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 18 cm²</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karışık — Alan + İlişki</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir üçgenin iki kenarı $a = 9$ ve $b = 12$ olup aradaki açı $\\theta$. Alan en büyük olduğunda alan kaç cm²'dir?<br><br>
      <strong>A)</strong> 108 cm² &nbsp; <strong>B)</strong> 45 cm² &nbsp; <strong>C)</strong> 60 cm² &nbsp; <strong>D)</strong> 27 cm² &nbsp; <strong>E)</strong> <span class="key">54 cm²</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = \\dfrac{1}{2} ab \\sin\\theta$. $\\sin\\theta$ en fazla $1$ ($\\theta = 90°$).</p>
      <p class="ales-sol-step">Maksimum alan: $A_{max} = \\dfrac{1}{2} \\cdot 9 \\cdot 12 \\cdot 1 = 54$ cm².</p>
      <p class="ales-sol-step"><strong>Yorum:</strong> İki kenar verildiğinde alanı maksimum yapan açı $90°$'dir; o zaman üçgen dik olur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 54 cm²</span></div>
    </div>
  </div>
</section>
`
};
