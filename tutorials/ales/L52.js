window.ALES_LESSON = {
n: 52,
title: "Çember ve Daire",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>çember ve daire</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Çevre $2\\pi r$ ve alan $\\pi r^{2}$ formülleri, merkez açı vs çevre açı (Thales), <strong>teğet-yarıçap dik kuralı</strong> (ALES'in en kritik teoremlerinden biri), kesişen kirişler güç teoremi ve daire dilimi (sektör) alan-yay uzunluğu. SVG diyagramlarla görselleştirildi.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Çevre/Alan + Merkez Açı vs Çevre Açı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Çevre, Alan ve Merkez Açı vs Çevre Açı (Thales)</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Çevre</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $7$ cm olan çemberin çevresi kaç cm'dir? ($\\pi$ kullanın)<br><br>
      <strong>A)</strong> $7\\pi$ &nbsp; <strong>B)</strong> $14$ &nbsp; <strong>C)</strong> <span class="key">$14\\pi$</span> &nbsp; <strong>D)</strong> $49\\pi$ &nbsp; <strong>E)</strong> $28\\pi$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 160 160" style="width:100%;max-width:200px">
        <circle cx="80" cy="80" r="60" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="2"/>
        <line x1="80" y1="80" x2="140" y2="80" stroke="#06b6d4" stroke-width="2"/>
        <text x="100" y="75" font-size="11" fill="currentColor" font-family="JetBrains Mono">r=7</text>
      </svg>
      <div class="ales-diagram-caption">Çevre = 2πr</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çevre $= 2\\pi r = 2\\pi \\cdot 7 = 14\\pi$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $14\\pi$ cm</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Alan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $5$ cm olan dairenin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $5\\pi$ &nbsp; <strong>B)</strong> $10\\pi$ &nbsp; <strong>C)</strong> $20\\pi$ &nbsp; <strong>D)</strong> <span class="key">$25\\pi$</span> &nbsp; <strong>E)</strong> $50\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A = \\pi r^{2} = \\pi \\cdot 25 = 25\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $25\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Çevre → Yarıçap</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Çevresi $18\\pi$ cm olan çemberin alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $9\\pi$ &nbsp; <strong>B)</strong> $18\\pi$ &nbsp; <strong>C)</strong> $36\\pi$ &nbsp; <strong>D)</strong> <span class="key">$81\\pi$</span> &nbsp; <strong>E)</strong> $324\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$2\\pi r = 18\\pi \\Rightarrow r = 9$.</p>
      <p class="ales-sol-step">$A = \\pi \\cdot 9^{2} = 81\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $81\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Merkez Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir çemberde aynı yayı gören merkez açı $80°$ ise çevre açı kaç derecedir?<br><br>
      <strong>A)</strong> 41° &nbsp; <strong>B)</strong> <span class="key">40°</span> &nbsp; <strong>C)</strong> 39° &nbsp; <strong>D)</strong> 42° &nbsp; <strong>E)</strong> 38°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 180" style="width:100%;max-width:280px">
        <circle cx="100" cy="100" r="70" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="100" cy="100" r="2" fill="#fbbf24"/>
        <line x1="100" y1="100" x2="40" y2="135" stroke="#06b6d4" stroke-width="2"/>
        <line x1="100" y1="100" x2="160" y2="135" stroke="#06b6d4" stroke-width="2"/>
        <line x1="100" y1="30" x2="40" y2="135" stroke="#a855f7" stroke-width="2"/>
        <line x1="100" y1="30" x2="160" y2="135" stroke="#a855f7" stroke-width="2"/>
        <text x="80" y="110" font-size="10" fill="currentColor" font-family="JetBrains Mono">80°</text>
        <text x="85" y="50" font-size="10" fill="currentColor" font-family="JetBrains Mono">40°</text>
      </svg>
      <div class="ales-diagram-caption">Çevre açı = merkez açının yarısı</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Aynı yayı gören çevre açı, merkez açının yarısıdır.</p>
      <p class="ales-sol-step">Çevre açı $= 80/2 = 40°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 40°</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Çapı Gören Çevre Açı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir çemberin çapını gören çevre açı (Thales açısı) kaç derecedir?<br><br>
      <strong>A)</strong> 91° &nbsp; <strong>B)</strong> <span class="key">90°</span> &nbsp; <strong>C)</strong> 89° &nbsp; <strong>D)</strong> 92° &nbsp; <strong>E)</strong> 88°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çap, $180°$'lik yayı görür ⟹ merkez açı $180°$.</p>
      <p class="ales-sol-step">Çevre açı $= 180/2 = 90°$. (Thales Teoremi)</p>
      <p class="ales-sol-step"><strong>Sonuç:</strong> Çapı gören her çevre açı diktir; çap üzerine kurulan üçgen daima dik üçgendir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 90°</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Aynı Yay Çevre Açıları</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir çemberde $A, B, C, D$ noktaları üzerinde olmak üzere $AB$ yayını gören iki çevre açıdan biri $35°$ ise diğeri kaç derecedir?<br><br>
      <strong>A)</strong> 36° &nbsp; <strong>B)</strong> 34° &nbsp; <strong>C)</strong> 37° &nbsp; <strong>D)</strong> <span class="key">35°</span> &nbsp; <strong>E)</strong> 33°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı yayı gören tüm çevre açılar eşittir.</p>
      <p class="ales-sol-step">Diğeri de $35°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 35°</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Üçgen + Çember</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Çemberin çapı $|AB| = 10$ cm. $C$ çember üzerinde bir nokta ve $|AC| = 6$ cm. $|BC|$ kaç cm'dir?<br><br>
      <strong>A)</strong> 9 cm &nbsp; <strong>B)</strong> 7 cm &nbsp; <strong>C)</strong> <span class="key">8 cm</span> &nbsp; <strong>D)</strong> 10 cm &nbsp; <strong>E)</strong> 6 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Thales</div>
      <p class="ales-sol-step">$AB$ çap olduğundan $\\widehat{ACB} = 90°$ (Thales) ⟹ $ABC$ dik üçgen, hipotenüs $AB = 10$.</p>
      <p class="ales-sol-step">Pisagor: $|BC|^{2} = 10^{2} - 6^{2} = 64 \\Rightarrow |BC| = 8$.</p>
      <p class="ales-sol-step">$6$-$8$-$10$ ($3$-$4$-$5$ üçlüsünün $2$ katı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 8 cm</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Teğet-Yarıçap Dik + Kesişen Kirişler
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Teğet-Yarıçap Dik Kuralı + Güç Teoremi</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Teğetin Uzunluğu</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $5$ cm olan çemberin merkezinden $13$ cm uzaklıktaki bir $P$ noktasından çizilen teğetin değme noktasına olan uzaklığı kaç cm'dir?<br><br>
      <strong>A)</strong> <span class="key">12 cm</span> &nbsp; <strong>B)</strong> 13 cm &nbsp; <strong>C)</strong> 11 cm &nbsp; <strong>D)</strong> 14 cm &nbsp; <strong>E)</strong> 10 cm
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 280 160" style="width:100%;max-width:340px">
        <circle cx="80" cy="80" r="50" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="80" cy="80" r="2" fill="#fbbf24"/>
        <line x1="80" y1="80" x2="240" y2="80" stroke="#06b6d4" stroke-width="2"/>
        <line x1="80" y1="80" x2="120" y2="50" stroke="#a855f7" stroke-width="2"/>
        <line x1="120" y1="50" x2="240" y2="80" stroke="#10b981" stroke-width="2"/>
        <rect x="115" y="50" width="10" height="10" fill="none" stroke="#a855f7" stroke-width="1.5" transform="rotate(-37 120 55)"/>
        <text x="240" y="95" font-size="11" fill="currentColor" font-family="JetBrains Mono">P</text>
        <text x="90" y="60" font-size="10" fill="currentColor" font-family="JetBrains Mono">5</text>
        <text x="160" y="73" font-size="10" fill="currentColor" font-family="JetBrains Mono">13</text>
        <text x="180" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">teğet</text>
      </svg>
      <div class="ales-diagram-caption">Teğet-yarıçap dik (90°)</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Teğet-Yarıçap Dik</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Teğet, değme noktasındaki yarıçapa diktir.</p>
      <p class="ales-sol-step">Merkez-değme-noktası dik üçgen: dik kenar $5$ (yarıçap), hipotenüs $13$ (merkez-P).</p>
      <p class="ales-sol-step">Teğet uzunluğu $= \\sqrt{13^{2} - 5^{2}} = 12$ cm. ($5$-$12$-$13$)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 12 cm</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İki Teğet Eşitliği</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir dış noktadan çembere çizilen iki teğetin değme noktalarına olan uzaklıkları arasında nasıl bir ilişki vardır?<br><br>
      <strong>A)</strong> Biri diğerinin iki katıdır &nbsp; <strong>B)</strong> Biri diğerinin yarısıdır &nbsp; <strong>C)</strong> <span class="key">Eşittir</span> &nbsp; <strong>D)</strong> Çarpımları yarıçapın karesidir &nbsp; <strong>E)</strong> Aralarında belirli bir ilişki yoktur
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Bir dış noktadan çembere çizilen iki teğet eşittir.</p>
      <p class="ales-sol-step">İspat: İki dik üçgen oluşur; ortak hipotenüs (merkez-dış nokta) ve eşit dik kenar (yarıçap) ⟹ üçgenler eş.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Eşittir</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Teğet — Sayısal</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $9$ cm olan çembere bir dış noktadan çizilen teğet $40$ cm uzunluğunda. Dış nokta merkeze kaç cm uzaktadır?<br><br>
      <strong>A)</strong> <span class="key">41 cm</span> &nbsp; <strong>B)</strong> 42 cm &nbsp; <strong>C)</strong> 40 cm &nbsp; <strong>D)</strong> 43 cm &nbsp; <strong>E)</strong> 39 cm
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Pisagor: $d^{2} = 9^{2} + 40^{2} = 81 + 1600 = 1681 \\Rightarrow d = 41$ cm.</p>
      <p class="ales-sol-step">($9$-$40$-$41$ Pisagor üçlüsü.)</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 41 cm</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Kesişen Kirişler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir çember içinde kesişen iki kirişten biri $4$ ve $9$ parçalarına ayrılıyor; diğer kiriş $6$ ve $x$ parçalarına ayrılıyor. $x$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">6</span> &nbsp; <strong>B)</strong> 5 &nbsp; <strong>C)</strong> 7 &nbsp; <strong>D)</strong> 4 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 200 200" style="width:100%;max-width:260px">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <line x1="30" y1="80" x2="170" y2="120" stroke="#06b6d4" stroke-width="2"/>
        <line x1="80" y1="30" x2="120" y2="170" stroke="#a855f7" stroke-width="2"/>
        <text x="42" y="76" font-size="10" fill="currentColor" font-family="JetBrains Mono">4</text>
        <text x="148" y="115" font-size="10" fill="currentColor" font-family="JetBrains Mono">9</text>
        <text x="80" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">6</text>
        <text x="115" y="160" font-size="10" fill="currentColor" font-family="JetBrains Mono">x</text>
      </svg>
      <div class="ales-diagram-caption">Kesişen kirişlerde parça çarpımları eşit</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Güç Teoremi</div>
      <p class="ales-sol-step"><strong>Kural:</strong> Çember içinde kesişen iki kirişin parçaları çarpımı eşittir.</p>
      <p class="ales-sol-step">$4 \\cdot 9 = 6 \\cdot x \\Rightarrow 36 = 6x \\Rightarrow x = 6$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 6</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Dış Noktada Kesişen Kirişler</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir dış noktadan çıkan iki kesen çemberi sırasıyla şu noktalarda keser: birincisi $A$ ve $B$ ($PA = 4$, $PB = 12$), ikincisi $C$ ve $D$ ($PC = 3$, $PD = ?$).<br><br>
      <strong>A)</strong> 15 &nbsp; <strong>B)</strong> 17 &nbsp; <strong>C)</strong> <span class="key">16</span> &nbsp; <strong>D)</strong> 14 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Dış Güç</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $PA \\cdot PB = PC \\cdot PD$ (kesen-kesen).</p>
      <p class="ales-sol-step">$4 \\cdot 12 = 3 \\cdot PD \\Rightarrow PD = 16$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 16</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Teğet-Kesen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir dış noktadan çembere bir teğet ve bir kesen çiziliyor. Teğet uzunluğu $6$, kesen $P$'den $A$'ya $4$ ve $A$'dan $B$'ye uzunluğu $x$. $x$ kaçtır?<br><br>
      <strong>A)</strong> 4 &nbsp; <strong>B)</strong> 6 &nbsp; <strong>C)</strong> <span class="key">5</span> &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 7
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Teğet-Kesen Güç</div>
      <p class="ales-sol-step"><strong>Kural:</strong> $t^{2} = PA \\cdot PB$ (teğet karesi $=$ kesen parçalarının çarpımı).</p>
      <p class="ales-sol-step">$6^{2} = 4 \\cdot (4 + x) \\Rightarrow 36 = 16 + 4x \\Rightarrow x = 5$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 5</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Üçgen + İçteğet Çember</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir dış $P$ noktasından çembere çizilen iki teğetin değme noktaları arası açı $\\widehat{P} = 50°$. Teğetlerin değme noktasında merkezle yapılan üçgenin tepe açısı (merkez açısı) kaç derecedir?<br><br>
      <strong>A)</strong> 131° &nbsp; <strong>B)</strong> 129° &nbsp; <strong>C)</strong> 132° &nbsp; <strong>D)</strong> 128° &nbsp; <strong>E)</strong> <span class="key">130°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$P$, iki teğetin değme noktaları $A, B$, merkez $O$. $OAPB$ dörtgeninde $\\widehat{A} = \\widehat{B} = 90°$ (teğet-yarıçap dik).</p>
      <p class="ales-sol-step">Dörtgen iç açıları toplamı $360°$: $90 + 90 + 50 + \\widehat{O} = 360 \\Rightarrow \\widehat{O} = 130°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 130°</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Daire Dilimi + Yay Uzunluğu
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Daire Dilimi (Sektör) ve Yay Uzunluğu</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Çeyrek Daire Alan</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $8$ cm olan dairenin çeyreği (90°'lik dilim) kaç cm²'dir?<br><br>
      <strong>A)</strong> $8\\pi$ &nbsp; <strong>B)</strong> $4\\pi$ &nbsp; <strong>C)</strong> <span class="key">$16\\pi$</span> &nbsp; <strong>D)</strong> $32\\pi$ &nbsp; <strong>E)</strong> $64\\pi$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 160 160" style="width:100%;max-width:200px">
        <circle cx="80" cy="80" r="60" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,3"/>
        <path d="M 80,80 L 140,80 A 60,60 0 0,0 80,20 Z" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" stroke-width="2"/>
        <text x="100" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">90°</text>
      </svg>
      <div class="ales-diagram-caption">Çeyrek dilim — alanın 1/4'ü</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çeyrek alan $= \\dfrac{\\pi r^{2}}{4} = \\dfrac{64\\pi}{4} = 16\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $16\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Sektör Alan Genel</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $6$ cm, merkez açısı $60°$ olan sektörün alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $3\\pi$ &nbsp; <strong>B)</strong> $4\\pi$ &nbsp; <strong>C)</strong> $5\\pi$ &nbsp; <strong>D)</strong> <span class="key">$6\\pi$</span> &nbsp; <strong>E)</strong> $12\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">Sektör alanı $= \\pi r^{2} \\cdot \\dfrac{\\theta}{360}$.</p>
      <p class="ales-sol-step">$A = \\pi \\cdot 36 \\cdot \\dfrac{60}{360} = 36\\pi \\cdot \\dfrac{1}{6} = 6\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $6\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Yay Uzunluğu</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $9$ cm, merkez açısı $40°$ olan yayın uzunluğu kaç cm'dir?<br><br>
      <strong>A)</strong> $\\pi$ &nbsp; <strong>B)</strong> <span class="key">$2\\pi$</span> &nbsp; <strong>C)</strong> $4\\pi$ &nbsp; <strong>D)</strong> $9\\pi$ &nbsp; <strong>E)</strong> $18\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">Yay uzunluğu $= 2\\pi r \\cdot \\dfrac{\\theta}{360}$.</p>
      <p class="ales-sol-step">$\\ell = 18\\pi \\cdot \\dfrac{40}{360} = 18\\pi \\cdot \\dfrac{1}{9} = 2\\pi$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $2\\pi$ cm</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Sektör — Açı Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $10$ cm olan dairenin alanı $25\\pi$ cm² olan sektörünün merkez açısı kaç derecedir?<br><br>
      <strong>A)</strong> <span class="key">90°</span> &nbsp; <strong>B)</strong> 91° &nbsp; <strong>C)</strong> 89° &nbsp; <strong>D)</strong> 92° &nbsp; <strong>E)</strong> 88°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\pi \\cdot 100 \\cdot \\dfrac{\\theta}{360} = 25\\pi$.</p>
      <p class="ales-sol-step">$\\dfrac{100\\theta}{360} = 25 \\Rightarrow \\theta = \\dfrac{25 \\cdot 360}{100} = 90°$.</p>
      <p class="ales-sol-step">Yani çeyrek daire.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 90°</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Halka Alanı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aynı merkezli iki çemberin yarıçapları $7$ cm ve $4$ cm. Aralarındaki halkanın alanı kaç cm²'dir?<br><br>
      <strong>A)</strong> $9\\pi$ &nbsp; <strong>B)</strong> $11\\pi$ &nbsp; <strong>C)</strong> $24\\pi$ &nbsp; <strong>D)</strong> <span class="key">$33\\pi$</span> &nbsp; <strong>E)</strong> $65\\pi$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 160 160" style="width:100%;max-width:200px">
        <circle cx="80" cy="80" r="60" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" stroke-width="2"/>
        <circle cx="80" cy="80" r="35" fill="rgba(255,255,255,0.7)" stroke="#06b6d4" stroke-width="2"/>
      </svg>
      <div class="ales-diagram-caption">Halka = büyük alan - küçük alan</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$A_{halka} = \\pi(R^{2} - r^{2}) = \\pi(49 - 16) = 33\\pi$ cm².</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $33\\pi$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Sektör + Üçgen</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $6$ cm olan dairenin $90°$'lik diliminden eş ölçülü dik üçgen çıkarıldığında geriye kalan alan kaç cm²'dir? (Üçgen iki yarıçapı kenar olarak alır.)<br><br>
      <strong>A)</strong> $9\\pi - 12$ &nbsp; <strong>B)</strong> $18\\pi - 18$ &nbsp; <strong>C)</strong> <span class="key">$9\\pi - 18$</span> &nbsp; <strong>D)</strong> $6\\pi - 18$ &nbsp; <strong>E)</strong> $9\\pi - 36$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Sektör alanı: $\\dfrac{\\pi \\cdot 36}{4} = 9\\pi$.</p>
      <p class="ales-sol-step">Üçgen (dik kenarlar yarıçap): $\\dfrac{6 \\cdot 6}{2} = 18$.</p>
      <p class="ales-sol-step">Kalan: $9\\pi - 18$ cm² (segment alanı).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $9\\pi - 18$ cm²</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Çevre + Yay</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yarıçapı $5$ cm, merkez açısı $72°$ olan dilimin çevresi kaç cm'dir?<br><br>
      <strong>A)</strong> $5 + 2\\pi$ &nbsp; <strong>B)</strong> $10 + \\pi$ &nbsp; <strong>C)</strong> <span class="key">$10 + 2\\pi$</span> &nbsp; <strong>D)</strong> $10 + 5\\pi$ &nbsp; <strong>E)</strong> $2\\pi$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Dilim çevresi $=$ iki yarıçap + yay uzunluğu.</p>
      <p class="ales-sol-step">Yay $= 2\\pi \\cdot 5 \\cdot \\dfrac{72}{360} = 10\\pi \\cdot \\dfrac{1}{5} = 2\\pi$ cm.</p>
      <p class="ales-sol-step">Çevre $= 5 + 5 + 2\\pi = 10 + 2\\pi$ cm.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $10 + 2\\pi$ cm</span></div>
    </div>
  </div>
</section>
`
};
