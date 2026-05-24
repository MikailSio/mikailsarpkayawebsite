window.ALES_LESSON = {
n: 51,
title: "Çokgenler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>çokgenler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. $n$ kenarlı çokgenin iç açıları toplamı $(n-2) \\cdot 180°$, dış açıları toplamı her zaman $360°$, düzgün çokgen iç açısı ve köşegen sayısı $\\dfrac{n(n-3)}{2}$, ve dörtgenler (paralelkenar, dikdörtgen, kare, eşkenar dörtgen, yamuk) üzerine alan-çevre soruları.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — İç ve Dış Açı Toplamları
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">İç ve Dış Açı Toplamları</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Beşgen İç Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir beşgenin iç açıları toplamı kaç derecedir?<br><br>
      <strong>A)</strong> <span class="key">540°</span> &nbsp; <strong>B)</strong> 541° &nbsp; <strong>C)</strong> 539° &nbsp; <strong>D)</strong> 542° &nbsp; <strong>E)</strong> 538°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <polygon points="100,20 180,80 150,170 50,170 20,80" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
      </svg>
      <div class="ales-diagram-caption">5 kenarlı çokgen: (5-2)·180 = 540°</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n$ kenarlı çokgende iç açılar toplamı $(n - 2) \\cdot 180°$.</p>
      <p class="ales-sol-step">$n = 5$: $(5 - 2) \\cdot 180 = 3 \\cdot 180 = 540°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 540°</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Kenar Sayısı Bul</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İç açıları toplamı $1080°$ olan çokgenin kenar sayısı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">8</span> &nbsp; <strong>B)</strong> 7 &nbsp; <strong>C)</strong> 9 &nbsp; <strong>D)</strong> 6 &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(n - 2) \\cdot 180 = 1080 \\Rightarrow n - 2 = 6 \\Rightarrow n = 8$.</p>
      <p class="ales-sol-step">$8$ kenarlı çokgen $=$ sekizgen.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 8</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Dış Açılar Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir on iki gen (dodecagon)'in dış açılarının toplamı kaç derecedir?<br><br>
      <strong>A)</strong> 361° &nbsp; <strong>B)</strong> 359° &nbsp; <strong>C)</strong> 362° &nbsp; <strong>D)</strong> 358° &nbsp; <strong>E)</strong> <span class="key">360°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Tüm dışbükey çokgenlerin dış açıları toplamı $360°$ — kenar sayısından bağımsızdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 360°</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Altıgen Açıları</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir altıgenin beş iç açısı sırasıyla $100°, 130°, 110°, 140°, 120°$. Altıncı iç açı kaç derecedir?<br><br>
      <strong>A)</strong> 121° &nbsp; <strong>B)</strong> 119° &nbsp; <strong>C)</strong> <span class="key">120°</span> &nbsp; <strong>D)</strong> 122° &nbsp; <strong>E)</strong> 118°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Altıgen iç açılar toplamı $(6 - 2) \\cdot 180 = 720°$.</p>
      <p class="ales-sol-step">Bilinenlerin toplamı: $100 + 130 + 110 + 140 + 120 = 600$.</p>
      <p class="ales-sol-step">Altıncı: $720 - 600 = 120°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 120°</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Köşegen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir on gen (decagon)'in köşegen sayısı kaçtır?<br><br>
      <strong>A)</strong> 34 &nbsp; <strong>B)</strong> 36 &nbsp; <strong>C)</strong> 33 &nbsp; <strong>D)</strong> 37 &nbsp; <strong>E)</strong> <span class="key">35</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Köşegen formülü: $\\dfrac{n(n - 3)}{2}$.</p>
      <p class="ales-sol-step">$n = 10$: $\\dfrac{10 \\cdot 7}{2} = 35$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 35</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Köşegenden Kenar</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir çokgenin köşegen sayısı $20$ ise kenar sayısı kaçtır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 6 &nbsp; <strong>D)</strong> <span class="key">8</span> &nbsp; <strong>E)</strong> 10
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{n(n - 3)}{2} = 20 \\Rightarrow n(n - 3) = 40$.</p>
      <p class="ales-sol-step">Dene: $n = 8$ ⟹ $8 \\cdot 5 = 40$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 8</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Dış Açıdan Kenar</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Düzgün bir çokgenin bir dış açısı $24°$ ise kenar sayısı kaçtır?<br><br>
      <strong>A)</strong> 14 &nbsp; <strong>B)</strong> 16 &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> 17 &nbsp; <strong>E)</strong> <span class="key">15</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Düzgün çokgenin bir dış açısı $= \\dfrac{360°}{n}$.</p>
      <p class="ales-sol-step">$\\dfrac{360}{n} = 24 \\Rightarrow n = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 15</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Düzgün Çokgen İç Açı + Köşegen
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Düzgün Çokgen İç Açı + Köşegen</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Düzgün Beşgen İç Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Düzgün beşgenin bir iç açısı kaç derecedir?<br><br>
      <strong>A)</strong> 109° &nbsp; <strong>B)</strong> 107° &nbsp; <strong>C)</strong> 110° &nbsp; <strong>D)</strong> <span class="key">108°</span> &nbsp; <strong>E)</strong> 106°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İç açı $= \\dfrac{(n - 2) \\cdot 180}{n} = \\dfrac{3 \\cdot 180}{5} = 108°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 108°</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Düzgün Altıgen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Düzgün altıgenin bir iç açısı kaç derecedir?<br><br>
      <strong>A)</strong> 121° &nbsp; <strong>B)</strong> 119° &nbsp; <strong>C)</strong> 122° &nbsp; <strong>D)</strong> <span class="key">120°</span> &nbsp; <strong>E)</strong> 118°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 180 160" style="width:100%;max-width:240px">
        <polygon points="90,20 150,55 150,125 90,160 30,125 30,55" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <text x="80" y="95" font-size="12" fill="currentColor" font-family="JetBrains Mono">120°</text>
      </svg>
      <div class="ales-diagram-caption">Düzgün altıgen — bir iç açı 120°</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{(6 - 2) \\cdot 180}{6} = \\dfrac{720}{6} = 120°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 120°</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Düzgün Sekizgen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Düzgün sekizgenin bir iç açısı kaç derecedir?<br><br>
      <strong>A)</strong> 136° &nbsp; <strong>B)</strong> 134° &nbsp; <strong>C)</strong> 137° &nbsp; <strong>D)</strong> <span class="key">135°</span> &nbsp; <strong>E)</strong> 133°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{(8 - 2) \\cdot 180}{8} = \\dfrac{1080}{8} = 135°$.</p>
      <p class="ales-sol-step">Dış açı $= 180 - 135 = 45°$. Doğrula: $360/8 = 45°$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 135°</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">İç Açıdan Kenar</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir iç açısı $144°$ olan düzgün çokgenin kenar sayısı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">10</span> &nbsp; <strong>B)</strong> 9 &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> 8 &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dış Açı Yöntemi</div>
      <p class="ales-sol-step">Dış açı $= 180 - 144 = 36°$. $\\dfrac{360}{n} = 36 \\Rightarrow n = 10$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 10</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — İç Açı Formülünden</div>
      <p class="ales-sol-step">$\\dfrac{(n-2) \\cdot 180}{n} = 144 \\Rightarrow 180n - 360 = 144n \\Rightarrow 36n = 360 \\Rightarrow n = 10$.</p>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Bir Köşeden Çıkan Köşegen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir on ikigenin (12 kenarlı) bir köşesinden kaç köşegen çıkar?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 11 &nbsp; <strong>E)</strong> <span class="key">9</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Bir köşeden çıkan köşegen sayısı $= n - 3$ (kendisine ve iki komşuya çizilemez).</p>
      <p class="ales-sol-step">$n = 12 \\Rightarrow 12 - 3 = 9$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 9</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Köşegen — Üçgen Sayısı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir köşeden çıkan köşegenler bir on bir gen'i kaç üçgene böler?<br><br>
      <strong>A)</strong> 8 &nbsp; <strong>B)</strong> 10 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> <span class="key">9</span> &nbsp; <strong>E)</strong> 11
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$n$ kenarlı çokgen, bir köşeden $n - 2$ üçgene bölünür.</p>
      <p class="ales-sol-step">$n = 11 \\Rightarrow 9$ üçgen.</p>
      <p class="ales-sol-step"><strong>İpucu:</strong> Bu yüzden iç açı toplamı $(n-2) \\cdot 180$ — her üçgenden $180°$ gelir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 9</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">İç + Dış Karması</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Düzgün bir çokgende bir iç açı, bir dış açının $5$ katıdır. Bu çokgenin kenar sayısı kaçtır?<br><br>
      <strong>A)</strong> 11 &nbsp; <strong>B)</strong> <span class="key">12</span> &nbsp; <strong>C)</strong> 13 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> 14
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İç + dış $= 180°$. İç $= 5 \\cdot$ dış ⟹ $5d + d = 180 \\Rightarrow d = 30°$.</p>
      <p class="ales-sol-step">Dış açı $\\dfrac{360}{n} = 30 \\Rightarrow n = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 12</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Dörtgenler (Paralelkenar, Dikdörtgen, Kare, Eşkenar Dörtgen, Yamuk)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Dörtgenler — Alan ve Çevre</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Dikdörtgen</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Kısa kenarı $5$ cm, uzun kenarı $12$ cm olan dikdörtgenin alanı ve çevresi kaçtır?<br><br>
      <strong>A)</strong> $A = 60, Ç = 24$ &nbsp; <strong>B)</strong> $A = 17, Ç = 60$ &nbsp; <strong>C)</strong> <span class="key">$A = 60$ cm², $Ç = 34$ cm</span> &nbsp; <strong>D)</strong> $A = 34, Ç = 60$ &nbsp; <strong>E)</strong> $A = 120, Ç = 34$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Alan $= a \\cdot b = 5 \\cdot 12 = 60$ cm².</p>
      <p class="ales-sol-step">Çevre $= 2(a + b) = 2 \\cdot 17 = 34$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $A = 60$ cm², $Ç = 34$ cm</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Kare</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Çevresi $36$ cm olan karenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $36$ &nbsp; <strong>B)</strong> $72$ &nbsp; <strong>C)</strong> <span class="key">$81$</span> &nbsp; <strong>D)</strong> $108$ &nbsp; <strong>E)</strong> $144$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Karede $4a = 36 \\Rightarrow a = 9$ cm.</p>
      <p class="ales-sol-step">$A = a^{2} = 81$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $81$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Paralelkenar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Tabanı $14$ cm, bu tabana ait yüksekliği $6$ cm olan paralelkenarın alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $20$ &nbsp; <strong>B)</strong> $40$ &nbsp; <strong>C)</strong> $42$ &nbsp; <strong>D)</strong> <span class="key">$84$</span> &nbsp; <strong>E)</strong> $168$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 240 150" style="width:100%;max-width:300px">
        <polygon points="40,130 160,130 200,40 80,40" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="80" y1="40" x2="80" y2="130" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="60" y="85" font-size="11" fill="currentColor" font-family="JetBrains Mono">h=6</text>
        <text x="95" y="145" font-size="11" fill="currentColor" font-family="JetBrains Mono">a=14</text>
      </svg>
      <div class="ales-diagram-caption">Paralelkenar alanı: taban × yükseklik</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = a \\cdot h = 14 \\cdot 6 = 84$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $84$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Eşkenar Dörtgen — Köşegen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Köşegenleri $10$ cm ve $24$ cm olan eşkenar dörtgenin alanı ve bir kenarı kaçtır?<br><br>
      <strong>A)</strong> $A = 240$, kenar $= 13$ &nbsp; <strong>B)</strong> $A = 60$, kenar $= 13$ &nbsp; <strong>C)</strong> <span class="key">$A = 120$ cm², kenar $= 13$ cm</span> &nbsp; <strong>D)</strong> $A = 120$, kenar $= 17$ &nbsp; <strong>E)</strong> $A = 240$, kenar $= 26$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 180" style="width:100%;max-width:280px">
        <polygon points="110,20 200,90 110,160 20,90" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="110" y1="20" x2="110" y2="160" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <line x1="20" y1="90" x2="200" y2="90" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="115" y="50" font-size="10" fill="currentColor" font-family="JetBrains Mono">d2/2</text>
      </svg>
      <div class="ales-diagram-caption">Eşkenar dörtgen — köşegenler dik kesişir</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eşkenar dörtgen alanı $= \\dfrac{d_1 \\cdot d_2}{2} = \\dfrac{10 \\cdot 24}{2} = 120$ cm².</p>
      <p class="ales-sol-step">Köşegenler dik kesişir ve birbirini ortalar ⟹ kenar = $\\sqrt{5^{2} + 12^{2}} = 13$ cm. ($5$-$12$-$13$)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $A = 120$ cm², kenar $= 13$ cm</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Yamuk Alan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Paralel kenarları $8$ cm ve $14$ cm, yüksekliği $6$ cm olan yamuğun alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $44$ &nbsp; <strong>B)</strong> $48$ &nbsp; <strong>C)</strong> $56$ &nbsp; <strong>D)</strong> <span class="key">$66$</span> &nbsp; <strong>E)</strong> $132$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 240 160" style="width:100%;max-width:300px">
        <polygon points="40,140 200,140 170,40 70,40" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="120" y1="40" x2="120" y2="140" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="100" y="35" font-size="11" fill="currentColor" font-family="JetBrains Mono">a=8</text>
        <text x="100" y="155" font-size="11" fill="currentColor" font-family="JetBrains Mono">b=14</text>
        <text x="125" y="95" font-size="11" fill="currentColor" font-family="JetBrains Mono">h=6</text>
      </svg>
      <div class="ales-diagram-caption">Yamuk: A = (a+b)·h / 2</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = \\dfrac{(a + b) \\cdot h}{2} = \\dfrac{(8 + 14) \\cdot 6}{2} = \\dfrac{132}{2} = 66$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $66$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Dikdörtgen — Köşegen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Köşegeni $13$ cm, kısa kenarı $5$ cm olan dikdörtgenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $30$ &nbsp; <strong>B)</strong> $40$ &nbsp; <strong>C)</strong> $50$ &nbsp; <strong>D)</strong> <span class="key">$60$</span> &nbsp; <strong>E)</strong> $65$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pisagor: uzun kenar $= \\sqrt{13^{2} - 5^{2}} = \\sqrt{144} = 12$ ($5$-$12$-$13$ üçlüsü).</p>
      <p class="ales-sol-step">$A = 5 \\cdot 12 = 60$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $60$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karışık — Yamuk + Pisagor</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      İkizkenar yamuğun paralel kenarları $6$ cm ve $14$ cm, yan kenarı $5$ cm. Alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $20$ &nbsp; <strong>B)</strong> $25$ &nbsp; <strong>C)</strong> <span class="key">$30$</span> &nbsp; <strong>D)</strong> $36$ &nbsp; <strong>E)</strong> $40$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İkizkenar yamukta tabanlardan üst tabanı simetrik konumlandır: alt tabanın iki ucundan $\\dfrac{14 - 6}{2} = 4$ cm içeride köşeler düşer.</p>
      <p class="ales-sol-step">Yan kenar (5) hipotenüs, alt taban farkı yarısı (4) bir dik kenar ⟹ Pisagor: yükseklik $h = \\sqrt{5^{2} - 4^{2}} = 3$.</p>
      <p class="ales-sol-step">$A = \\dfrac{(6 + 14) \\cdot 3}{2} = 30$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $30$ cm²</span></div>
    </div>
  </div>
</section>
`
};
