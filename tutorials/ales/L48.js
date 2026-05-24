window.ALES_LESSON = {
n: 48,
title: "Açılar ve Doğrular",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>açılar ve doğrular</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Tümler/bütünler/komşu/ters açı ilişkileri, paralel iki doğrunun bir kesenle yaptığı Z-F-U açıları ve saat akrep-yelkovan arasındaki açı hesabı bu derste işleniyor. Çözümleri inline SVG ile destekledik; problemi önce kendi başına dene.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Tümler/Bütünler/Komşu/Ters Açılar
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Tümler, Bütünler, Komşu ve Ters Açılar</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Tümler Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir açının tümleri (toplamı $90°$ olan açı), kendisinin $4$ katıdır. Bu açı kaç derecedir?<br><br>
      <strong>A)</strong> 19° &nbsp; <strong>B)</strong> 17° &nbsp; <strong>C)</strong> 20° &nbsp; <strong>D)</strong> 16° &nbsp; <strong>E)</strong> <span class="key">18°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Açıya $x$ dersek tümleri $90 - x$. Soru: $90 - x = 4x \\Rightarrow 5x = 90 \\Rightarrow x = 18°$.</p>
      <p class="ales-sol-step">Doğrula: tümleri $90 - 18 = 72 = 4 \\cdot 18$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 18°</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Bütünler Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir açının bütünleri (toplamı $180°$), açının kendisinden $40°$ fazladır. Açı kaç derecedir?<br><br>
      <strong>A)</strong> 71° &nbsp; <strong>B)</strong> <span class="key">70°</span> &nbsp; <strong>C)</strong> 69° &nbsp; <strong>D)</strong> 72° &nbsp; <strong>E)</strong> 68°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Açı $x$, bütünler $180 - x$. Veri: $180 - x = x + 40 \\Rightarrow 2x = 140 \\Rightarrow x = 70°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 70°</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Ters Açılar</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      İki doğru bir noktada kesişiyor. Oluşan ters açılardan biri $3x + 10$, diğeri $5x - 30$ derecedir. $x$ kaçtır?<br><br>
      <strong>A)</strong> $10$ &nbsp; <strong>B)</strong> $15$ &nbsp; <strong>C)</strong> <span class="key">$20$</span> &nbsp; <strong>D)</strong> $25$ &nbsp; <strong>E)</strong> $40$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 140" style="width:100%;max-width:300px">
        <line x1="20" y1="30" x2="200" y2="110" stroke="#fbbf24" stroke-width="2"/>
        <line x1="20" y1="110" x2="200" y2="30" stroke="#fbbf24" stroke-width="2"/>
        <text x="60" y="70" font-size="11" fill="currentColor" font-family="JetBrains Mono">3x+10</text>
        <text x="135" y="80" font-size="11" fill="currentColor" font-family="JetBrains Mono">5x-30</text>
      </svg>
      <div class="ales-diagram-caption">Ters açılar eşittir</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ters (zıt) açılar eşit: $3x + 10 = 5x - 30 \\Rightarrow 40 = 2x \\Rightarrow x = 20$.</p>
      <p class="ales-sol-step">Açı: $3(20) + 10 = 70°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $x = 20$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Komşu Bütünler</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir doğru üzerinde komşu bütünler iki açıdan biri diğerinin $\\dfrac{2}{3}$'üdür. Büyük olan açı kaç derecedir?<br><br>
      <strong>A)</strong> 109° &nbsp; <strong>B)</strong> <span class="key">108°</span> &nbsp; <strong>C)</strong> 107° &nbsp; <strong>D)</strong> 110° &nbsp; <strong>E)</strong> 106°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Büyük açıya $x$ dersek küçük $\\dfrac{2x}{3}$. Toplam $180°$:</p>
      <p class="ales-sol-step">$x + \\dfrac{2x}{3} = 180 \\Rightarrow \\dfrac{5x}{3} = 180 \\Rightarrow x = 108°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 108°</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Tümler ve Bütünler Karması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir açının bütünleri ile tümlerinin farkı kaç derecedir?<br><br>
      <strong>A)</strong> 91° &nbsp; <strong>B)</strong> 89° &nbsp; <strong>C)</strong> <span class="key">90°</span> &nbsp; <strong>D)</strong> 92° &nbsp; <strong>E)</strong> 88°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Genel İlişki</div>
      <p class="ales-sol-step">Açı $x$ olsun. Bütünler $= 180 - x$, tümler $= 90 - x$.</p>
      <p class="ales-sol-step">Fark: $(180 - x) - (90 - x) = 90°$. Açıdan bağımsızdır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 90°</span></div>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sayısal Doğrulama</div>
      <p class="ales-sol-step">$x = 30°$ alalım. Bütünler $150$, tümler $60$. Fark $150 - 60 = 90°$ ✓.</p>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Açıortay</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bütünler iki açıdan büyük olanın açıortayı ile küçük olanın açıortayı arasındaki açı kaç derecedir?<br><br>
      <strong>A)</strong> 91° &nbsp; <strong>B)</strong> <span class="key">90°</span> &nbsp; <strong>C)</strong> 89° &nbsp; <strong>D)</strong> 92° &nbsp; <strong>E)</strong> 88°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Açılar $\\alpha$ ve $\\beta$, $\\alpha + \\beta = 180°$. Açıortaylar yarıya böler.</p>
      <p class="ales-sol-step">Açıortaylar arası: $\\dfrac{\\alpha}{2} + \\dfrac{\\beta}{2} = \\dfrac{\\alpha + \\beta}{2} = \\dfrac{180}{2} = 90°$.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> Bütünler iki açının açıortayları daima diktir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 90°</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Üç Açı Toplamı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir noktada birleşen üç ışın yarım düzlem oluşturuyor (toplam $180°$). Açılar sırasıyla $2x + 5$, $3x - 10$ ve $x + 35$ derecedir. Orta açı kaç derecedir?<br><br>
      <strong>A)</strong> 61° &nbsp; <strong>B)</strong> 59° &nbsp; <strong>C)</strong> 62° &nbsp; <strong>D)</strong> <span class="key">60°</span> &nbsp; <strong>E)</strong> 58°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$(2x + 5) + (3x - 10) + (x + 35) = 180 \\Rightarrow 6x + 30 = 180 \\Rightarrow x = 25$.</p>
      <p class="ales-sol-step">Açılar: $55°$, $65°$, $60°$. Sıralama: $55 < 60 < 65$ ⟹ orta $60°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 60°</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Paralel Doğrularda Kesen (Z, F, U Açıları)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Paralel Doğrularda Kesen — Z, F, U Açıları</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Z (İç Ters) Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $d_1 \\parallel d_2$ paralel doğrularını kesen $k$ doğrusunun oluşturduğu iç ters açılar $4x + 20$ ve $6x - 10$ derecedir. $x$ kaçtır?<br><br>
      <strong>A)</strong> $5$ &nbsp; <strong>B)</strong> $10$ &nbsp; <strong>C)</strong> $12$ &nbsp; <strong>D)</strong> <span class="key">$15$</span> &nbsp; <strong>E)</strong> $30$
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 240 160" style="width:100%;max-width:320px">
        <line x1="10" y1="40" x2="230" y2="40" stroke="#fbbf24" stroke-width="2"/>
        <line x1="10" y1="120" x2="230" y2="120" stroke="#fbbf24" stroke-width="2"/>
        <line x1="50" y1="10" x2="190" y2="150" stroke="#06b6d4" stroke-width="2"/>
        <text x="100" y="55" font-size="10" fill="currentColor" font-family="JetBrains Mono">4x+20</text>
        <text x="135" y="115" font-size="10" fill="currentColor" font-family="JetBrains Mono">6x-10</text>
        <text x="215" y="36" font-size="10" fill="currentColor" font-family="JetBrains Mono">d1</text>
        <text x="215" y="116" font-size="10" fill="currentColor" font-family="JetBrains Mono">d2</text>
      </svg>
      <div class="ales-diagram-caption">Z (iç ters) açılar eşit</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">İç ters (Z) açılar eşit: $4x + 20 = 6x - 10 \\Rightarrow 30 = 2x \\Rightarrow x = 15$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x = 15$</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">F (Yöndeş) Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Paralel iki doğru bir kesenle kesişiyor. Yöndeş (F) açılardan biri $50°$ ise, diğer yöndeş açının bütünleri kaç derecedir?<br><br>
      <strong>A)</strong> 131° &nbsp; <strong>B)</strong> 129° &nbsp; <strong>C)</strong> 132° &nbsp; <strong>D)</strong> <span class="key">130°</span> &nbsp; <strong>E)</strong> 128°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yöndeş açılar eşittir ⟹ diğeri de $50°$.</p>
      <p class="ales-sol-step">Bütünleri: $180 - 50 = 130°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 130°</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">U (İç Açı) Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $d_1 \\parallel d_2$ olmak üzere kesenin oluşturduğu aynı taraftaki iç açılar (U açıları) $3x$ ve $2x + 30$ derecedir. $x$ kaçtır?<br><br>
      <strong>A)</strong> $15$ &nbsp; <strong>B)</strong> $20$ &nbsp; <strong>C)</strong> $25$ &nbsp; <strong>D)</strong> <span class="key">$30$</span> &nbsp; <strong>E)</strong> $36$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Aynı taraftaki iç açılar bütünlerdir (U): $3x + (2x + 30) = 180$.</p>
      <p class="ales-sol-step">$5x = 150 \\Rightarrow x = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x = 30$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Zigzag</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki şekilde $d_1 \\parallel d_2$. $\\widehat{A} = 40°$, $\\widehat{C} = 30°$ ise $\\widehat{B}$ kaç derecedir?<br><br>
      <strong>A)</strong> 71° &nbsp; <strong>B)</strong> <span class="key">70°</span> &nbsp; <strong>C)</strong> 69° &nbsp; <strong>D)</strong> 72° &nbsp; <strong>E)</strong> 68°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 240 160" style="width:100%;max-width:320px">
        <line x1="10" y1="30" x2="230" y2="30" stroke="#fbbf24" stroke-width="2"/>
        <line x1="10" y1="130" x2="230" y2="130" stroke="#fbbf24" stroke-width="2"/>
        <line x1="60" y1="30" x2="150" y2="80" stroke="#06b6d4" stroke-width="2"/>
        <line x1="150" y1="80" x2="100" y2="130" stroke="#06b6d4" stroke-width="2"/>
        <text x="55" y="22" font-size="11" fill="currentColor" font-family="JetBrains Mono">A</text>
        <text x="155" y="80" font-size="11" fill="currentColor" font-family="JetBrains Mono">B</text>
        <text x="95" y="145" font-size="11" fill="currentColor" font-family="JetBrains Mono">C</text>
      </svg>
      <div class="ales-diagram-caption">B noktasından paralel çizilir</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yardımcı Paralel</div>
      <p class="ales-sol-step">$B$ noktasından $d_1$'e paralel bir yardımcı doğru çiz. Bu çizgi $\\widehat{B}$ açısını ikiye böler.</p>
      <p class="ales-sol-step">Üst kısım: $\\widehat{A}$ ile iç ters ⟹ $40°$.</p>
      <p class="ales-sol-step">Alt kısım: $\\widehat{C}$ ile iç ters ⟹ $30°$.</p>
      <p class="ales-sol-step">$\\widehat{B} = 40° + 30° = 70°$.</p>
      <p class="ales-sol-step"><strong>Kestirme:</strong> Zigzag (testere) probleminde orta açı = uçlardaki açıların toplamı.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 70°</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İki Kesen Karması</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $d_1 \\parallel d_2$ ve bir kesenin $d_1$ ile yaptığı açı $35°$. Aynı kesen $d_2$'yi kestiğinde, alt yarıdüzlemde kesenin sağında oluşan açı kaç derecedir?<br><br>
      <strong>A)</strong> 146° &nbsp; <strong>B)</strong> 144° &nbsp; <strong>C)</strong> 147° &nbsp; <strong>D)</strong> <span class="key">145°</span> &nbsp; <strong>E)</strong> 143°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$d_1$ üst, $d_2$ alt. Kesen $d_1$ ile $35°$ açı yapıyorsa, yöndeş olan $d_2$'deki açı da $35°$.</p>
      <p class="ales-sol-step">Komşu bütünler ⟹ aynı tarafta diğer açı $180 - 35 = 145°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 145°</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">İki Zigzag — Üç Açı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $d_1 \\parallel d_2$. Aralarında zigzag çizilen $A,B,C,D$ noktaları için $\\widehat{A} = 50°$, $\\widehat{B} = 80°$, $\\widehat{D} = 40°$. $\\widehat{C}$ kaç derecedir? ($A$ ve $D$, $d_1$ ve $d_2$ üzerinde; $B,C$ aralarda)<br><br>
      <strong>A)</strong> 71° &nbsp; <strong>B)</strong> <span class="key">70°</span> &nbsp; <strong>C)</strong> 69° &nbsp; <strong>D)</strong> 72° &nbsp; <strong>E)</strong> 68°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Genelleştirilmiş Zigzag</div>
      <p class="ales-sol-step">$d_1$ tarafındaki açılar toplamı $=$ $d_2$ tarafındaki açıların toplamı.</p>
      <p class="ales-sol-step">$d_1$ tarafı: $\\widehat{A} + \\widehat{C}$, $d_2$ tarafı: $\\widehat{B} + \\widehat{D}$.</p>
      <p class="ales-sol-step">$50 + \\widehat{C} = 80 + 40 \\Rightarrow \\widehat{C} = 70°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 70°</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Açıortay ile Paralel</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $d_1 \\parallel d_2$ olmak üzere kesenin $d_1$ ile yaptığı dar açı $40°$'dir. Bu kesenin $d_1$'in üst tarafında kalan geniş açısının açıortayı, $d_2$ ile kaç derecelik dar açı yapar?<br><br>
      <strong>A)</strong> 31° &nbsp; <strong>B)</strong> 29° &nbsp; <strong>C)</strong> <span class="key">30°</span> &nbsp; <strong>D)</strong> 32° &nbsp; <strong>E)</strong> 28°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Üstte oluşan geniş açı $180 - 40 = 140°$. Açıortay onu ikiye böler ⟹ açıortayın kesenle yaptığı açı $70°$.</p>
      <p class="ales-sol-step">Açıortay yeni bir doğrudur. Kesenle $70°$ açı yapar; kesen ise $d_2$ ile $40°$ yapar.</p>
      <p class="ales-sol-step">Bu üç doğrunun oluşturduğu üçgenden açıortayın $d_2$ ile yaptığı dar açı $|70 - 40| = 30°$ olur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 30°</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Saat Akrep-Yelkovan Açısı
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Saat Akrep-Yelkovan Açısı</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Tam Saatte Açı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saat tam $4$'ü gösterirken akrep ile yelkovan arasındaki dar açı kaç derecedir?<br><br>
      <strong>A)</strong> 121° &nbsp; <strong>B)</strong> <span class="key">120°</span> &nbsp; <strong>C)</strong> 119° &nbsp; <strong>D)</strong> 122° &nbsp; <strong>E)</strong> 118°
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 140 140" style="width:100%;max-width:200px">
        <circle cx="70" cy="70" r="60" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <line x1="70" y1="70" x2="70" y2="20" stroke="#06b6d4" stroke-width="2"/>
        <line x1="70" y1="70" x2="113" y2="95" stroke="#fbbf24" stroke-width="3"/>
        <text x="68" y="14" font-size="10" fill="currentColor" font-family="JetBrains Mono">12</text>
        <text x="120" y="74" font-size="10" fill="currentColor" font-family="JetBrains Mono">3</text>
        <text x="65" y="135" font-size="10" fill="currentColor" font-family="JetBrains Mono">6</text>
      </svg>
      <div class="ales-diagram-caption">Saat 4: yelkovan 12'de, akrep 4'te</div>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Saat kadranı $360°$, $12$ saate bölünmüş. Her saat $360/12 = 30°$.</p>
      <p class="ales-sol-step">Yelkovan $12$'de, akrep $4$'te ⟹ aralarında $4$ saat dilimi $= 4 \\cdot 30 = 120°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 120°</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Buçukta</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saat $3$:$30$'u gösterirken akrep ile yelkovan arasındaki açı kaç derecedir?<br><br>
      <strong>A)</strong> 76° &nbsp; <strong>B)</strong> 74° &nbsp; <strong>C)</strong> 77° &nbsp; <strong>D)</strong> 73° &nbsp; <strong>E)</strong> <span class="key">75°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">Açı formülü: $\\left| 30 \\cdot S - 5{,}5 \\cdot D \\right|$ &nbsp; ($S$ saat, $D$ dakika).</p>
      <p class="ales-sol-step">$|30 \\cdot 3 - 5{,}5 \\cdot 30| = |90 - 165| = 75°$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sezgisel</div>
      <p class="ales-sol-step">Yelkovan $30$. dakikada $6$'da $= 180°$. Akrep $3$ ile $4$ arasında, $3$'ten $30$ dk geçtiği için yarı yolda $= 90 + 15 = 105°$ konumunda. Fark: $|180 - 105| = 75°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 75°</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Saat 6:00</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Saat tam $6$'yı gösterirken akrep ve yelkovan arasındaki açı kaç derecedir?<br><br>
      <strong>A)</strong> 181° &nbsp; <strong>B)</strong> <span class="key">180°</span> &nbsp; <strong>C)</strong> 179° &nbsp; <strong>D)</strong> 182° &nbsp; <strong>E)</strong> 178°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Akrep $6$'da, yelkovan $12$'de — tam zıt yönler.</p>
      <p class="ales-sol-step">$6 \\cdot 30 = 180°$ (doğru oluşturur).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 180°</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Akrep Hareketi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Saat $2$:$20$'yi gösterirken akrep ile yelkovan arasındaki dar açı kaç derecedir?<br><br>
      <strong>A)</strong> <span class="key">50°</span> &nbsp; <strong>B)</strong> 51° &nbsp; <strong>C)</strong> 49° &nbsp; <strong>D)</strong> 52° &nbsp; <strong>E)</strong> 48°
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Formül</div>
      <p class="ales-sol-step">$\\left| 30 \\cdot 2 - 5{,}5 \\cdot 20 \\right| = |60 - 110| = 50°$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Adım Adım Açı Hesabı</div>
      <p class="ales-sol-step">Yelkovan: $20$. dakikada $20 \\cdot 6 = 120°$ konumunda.</p>
      <p class="ales-sol-step">Akrep: saat $2$'de tam $60°$, dakikada $0{,}5°$ ilerler ⟹ $60 + 20 \\cdot 0{,}5 = 70°$.</p>
      <p class="ales-sol-step">Fark: $|120 - 70| = 50°$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 50°</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Çakışma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Saat $3$'ten sonra akrep ile yelkovanın ilk kez çakıştığı an saat $3$'ü kaç dakika geçedir?<br><br>
      <strong>A)</strong> $15$ dk &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{180}{11}$ dk ($\\approx 16{,}36$)</span> &nbsp; <strong>C)</strong> $\\dfrac{60}{11}$ dk &nbsp; <strong>D)</strong> $\\dfrac{90}{11}$ dk &nbsp; <strong>E)</strong> $20$ dk
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çakışma ⟹ açı $= 0$. $30 \\cdot 3 - 5{,}5 \\cdot D = 0 \\Rightarrow 90 = 5{,}5 D \\Rightarrow D = \\dfrac{90}{5{,}5} = \\dfrac{180}{11}$.</p>
      <p class="ales-sol-step">$\\dfrac{180}{11} \\approx 16{,}36$ dakika.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{180}{11}$ dakika</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Dik Konum</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Saat $4$ ile $5$ arası akrep ve yelkovanın ilk kez dik açı oluşturması saat $4$'ü kaç dakika geçtiğindedir?<br><br>
      <strong>A)</strong> $5$ dk &nbsp; <strong>B)</strong> <span class="key">$\\dfrac{60}{11}$ dk ($\\approx 5{,}45$)</span> &nbsp; <strong>C)</strong> $\\dfrac{90}{11}$ dk &nbsp; <strong>D)</strong> $\\dfrac{180}{11}$ dk &nbsp; <strong>E)</strong> $10$ dk
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Saat $4$:$00$'te akrep $120°$, yelkovan $0°$ konumunda. Aradaki açı $120°$.</p>
      <p class="ales-sol-step">Yelkovan dakikada $6°$, akrep $0{,}5°$ ⟹ göreceli kapanma $5{,}5°/$dakika.</p>
      <p class="ales-sol-step">$90°$'ye düşmesi için $30°$ kapanmalı: $D \\cdot 5{,}5 = 30 \\Rightarrow D = \\dfrac{60}{11}$ dakika.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\dfrac{60}{11}$ dakika</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">12 Saatte Çakışma Sayısı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $12$ saatlik bir periyotta akrep ile yelkovan kaç kez çakışır?<br><br>
      <strong>A)</strong> $10$ kez &nbsp; <strong>B)</strong> <span class="key">$11$ kez</span> &nbsp; <strong>C)</strong> $12$ kez &nbsp; <strong>D)</strong> $13$ kez &nbsp; <strong>E)</strong> $22$ kez
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Yelkovan $12$ saatte $12$ tur, akrep $1$ tur atar. Yelkovan akrep'i $12 - 1 = 11$ kez geçer.</p>
      <p class="ales-sol-step">Çakışmalar her $\\dfrac{12 \\cdot 60}{11} = \\dfrac{720}{11} \\approx 65{,}45$ dakikada bir olur.</p>
      <p class="ales-sol-step"><strong>Cevap:</strong> $11$ kez çakışırlar (saat $12$:$00$ başlangıç ve bitiş aynı kabul edilir).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $11$ kez</span></div>
    </div>
  </div>
</section>
`
};
