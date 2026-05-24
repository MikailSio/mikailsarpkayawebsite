window.ALES_LESSON = {
n: 46,
title: "Mantık ve Önermeler",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>mantık ve önermeler</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Bağlaçlar ($\\neg, \\land, \\lor, \\to, \\leftrightarrow$), doğruluk tabloları, De Morgan ve karşıtı/tersi/karşıt-tersi denklikleri problem içinde uygulanırken anlatılıyor.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Bağlaçlar ve Doğruluk Değerleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Bağlaçlar ve Doğruluk Değerleri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Önerme mi Değil mi?</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden hangileri <strong>önerme</strong>dir?<br>
      <strong>I.</strong> $5 + 3 = 8$<br>
      <strong>II.</strong> Lütfen kapıyı kapat.<br>
      <strong>III.</strong> Ankara, Türkiye'nin başkentidir.<br>
      <strong>IV.</strong> $x + 2 = 5$<br>
      <strong>V.</strong> Bugün hava soğuktur.<br><br>
      <strong>A)</strong> I, II, III &nbsp; <strong>B)</strong> I, III, IV &nbsp; <strong>C)</strong> <span class="key">I, III, V</span> &nbsp; <strong>D)</strong> II, III, V &nbsp; <strong>E)</strong> I, II, III, V
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önerme: doğru ya da yanlış değer alabilen ifade.</p>
      <p class="ales-sol-step"><strong>I.</strong> Doğru ✓ &nbsp; <strong>II.</strong> Emir ifadesi, önerme değil ✗ &nbsp; <strong>III.</strong> Doğru ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> Açık önerme ($x$'e bağlı, kesin doğru/yanlış değil) ✗ &nbsp; <strong>V.</strong> Önermedir (doğru/yanlış belirlenebilir) ✓</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) I, III, V</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Konjonksiyon ∧</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p$: "$5 > 3$" ve $q$: "$2 + 2 = 5$" önermeleri için $p \\land q$'nun doğruluk değeri nedir?<br><br>
      <strong>A)</strong> D (Doğru) &nbsp; <strong>B)</strong> <span class="key">Y (Yanlış)</span> &nbsp; <strong>C)</strong> Belirsiz &nbsp; <strong>D)</strong> Hem D hem Y &nbsp; <strong>E)</strong> Tanımsız
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p$ doğru (D), $q$ yanlış (Y).</p>
      <p class="ales-sol-step">$p \\land q$ ancak ikisi de D ise D, aksi halde Y.</p>
      <p class="ales-sol-step">D $\\land$ Y $=$ Y.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Y (Yanlış)</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Disjonksiyon ∨</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p$: "$3$, asal sayıdır" ve $q$: "$10 < 5$" önermeleri için $p \\lor q$'nun doğruluk değeri nedir?<br><br>
      <strong>A)</strong> Y (Yanlış) &nbsp; <strong>B)</strong> Belirsiz &nbsp; <strong>C)</strong> <span class="key">D (Doğru)</span> &nbsp; <strong>D)</strong> Tanımsız &nbsp; <strong>E)</strong> Hem D hem Y
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p$ D, $q$ Y. $p \\lor q$ en az biri D ise D'dir.</p>
      <p class="ales-sol-step">D $\\lor$ Y $=$ D.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) D (Doğru)</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Koşullu →</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p \\to q$ önermesi <strong>hangi durumda</strong> yanlıştır?<br><br>
      <strong>A)</strong> p = D, q = D &nbsp; <strong>B)</strong> <span class="key">p = D, q = Y</span> &nbsp; <strong>C)</strong> p = Y, q = D &nbsp; <strong>D)</strong> p = Y, q = Y &nbsp; <strong>E)</strong> Her durumda
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Koşullu önerme yalnızca $p$ doğru, $q$ yanlış olduğunda yanlıştır. Diğer üç durumda doğrudur.</p>
      <table>
        <thead><tr><th>$p$</th><th>$q$</th><th>$p \\to q$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>D</td><td>D</td></tr>
          <tr><td>D</td><td>Y</td><td><strong>Y</strong></td></tr>
          <tr><td>Y</td><td>D</td><td>D</td></tr>
          <tr><td>Y</td><td>Y</td><td>D</td></tr>
        </tbody>
      </table>
      <div class="ales-sol-answer">Cevap: <span class="key">B) p = D, q = Y</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">İki Yönlü ↔</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p$: "$4$, çift sayıdır" (D) ve $q$: "$9$, asal sayıdır" (Y) için $p \\leftrightarrow q$ kaçtır?<br><br>
      <strong>A)</strong> D &nbsp; <strong>B)</strong> Belirsiz &nbsp; <strong>C)</strong> Tanımsız &nbsp; <strong>D)</strong> <span class="key">Y</span> &nbsp; <strong>E)</strong> Hem D hem Y
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p \\leftrightarrow q$ aynı doğruluk değerinde D, farklıda Y.</p>
      <p class="ales-sol-step">D $\\leftrightarrow$ Y $=$ Y.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) Y</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Bileşik İfade</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p$ D, $q$ Y, $r$ D ise $(p \\land q) \\lor r$ kaçtır?<br><br>
      <strong>A)</strong> <span class="key">D</span> &nbsp; <strong>B)</strong> Y &nbsp; <strong>C)</strong> Belirsiz &nbsp; <strong>D)</strong> Tanımsız &nbsp; <strong>E)</strong> Hem D hem Y
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p \\land q$ = D $\\land$ Y = Y.</p>
      <p class="ales-sol-step">Y $\\lor$ D = D.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) D</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Negatif İçeren Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $p$ Y, $q$ D ise $(\\neg p \\land q) \\to (p \\lor \\neg q)$ önermesinin doğruluk değeri nedir?<br><br>
      <strong>A)</strong> D &nbsp; <strong>B)</strong> Belirsiz &nbsp; <strong>C)</strong> Tanımsız &nbsp; <strong>D)</strong> Hem D hem Y &nbsp; <strong>E)</strong> <span class="key">Y</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\neg p$ = D, $\\neg q$ = Y.</p>
      <p class="ales-sol-step">Sol: $\\neg p \\land q$ = D $\\land$ D = D.</p>
      <p class="ales-sol-step">Sağ: $p \\lor \\neg q$ = Y $\\lor$ Y = Y.</p>
      <p class="ales-sol-step">D $\\to$ Y = Y.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Y</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Doğruluk Tablosu, Tautoloji, Çelişki
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Doğruluk Tablosu, Tautoloji ve Çelişki</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki Değişkenli Tablo</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p \\to q$'nun doğruluk tablosunun satır değerleri (DD, DY, YD, YY sırasıyla) nedir?<br><br>
      <strong>A)</strong> D, D, D, D &nbsp; <strong>B)</strong> D, Y, Y, D &nbsp; <strong>C)</strong> <span class="key">D, Y, D, D</span> &nbsp; <strong>D)</strong> D, D, Y, D &nbsp; <strong>E)</strong> Y, D, D, D
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$q$</th><th>$p \\to q$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>D</td><td>D</td></tr>
          <tr><td>D</td><td>Y</td><td>Y</td></tr>
          <tr><td>Y</td><td>D</td><td>D</td></tr>
          <tr><td>Y</td><td>Y</td><td>D</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Sadece $p$ D, $q$ Y olduğunda Y, diğer üç durumda D.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) D, Y, D, D</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Tautoloji Tanıma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p \\lor \\neg p$ önermesinin durumu nedir?<br><br>
      <strong>A)</strong> Çelişki &nbsp; <strong>B)</strong> <span class="key">Tautoloji</span> &nbsp; <strong>C)</strong> Belirsiz &nbsp; <strong>D)</strong> Açık önerme &nbsp; <strong>E)</strong> Tanımsız
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$\\neg p$</th><th>$p \\lor \\neg p$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>Y</td><td>D</td></tr>
          <tr><td>Y</td><td>D</td><td>D</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Her durumda D $\\Rightarrow$ <strong>tautoloji</strong> (her zaman doğru).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Tautoloji</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Çelişki Tanıma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p \\land \\neg p$ önermesinin durumu nedir?<br><br>
      <strong>A)</strong> Tautoloji &nbsp; <strong>B)</strong> Belirsiz &nbsp; <strong>C)</strong> Açık önerme &nbsp; <strong>D)</strong> <span class="key">Çelişki</span> &nbsp; <strong>E)</strong> Tanımsız
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$\\neg p$</th><th>$p \\land \\neg p$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>Y</td><td>Y</td></tr>
          <tr><td>Y</td><td>D</td><td>Y</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Her durumda Y $\\Rightarrow$ <strong>çelişki</strong> (her zaman yanlış).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) Çelişki</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Denklik Tablosu</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p \\to q$ ile $\\neg p \\lor q$ önermelerinin denkliği nedir?<br><br>
      <strong>A)</strong> Çelişkili &nbsp; <strong>B)</strong> Sadece p=D iken denk &nbsp; <strong>C)</strong> <span class="key">Denk</span> &nbsp; <strong>D)</strong> Denk değil &nbsp; <strong>E)</strong> Sadece q=D iken denk
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$q$</th><th>$\\neg p$</th><th>$p \\to q$</th><th>$\\neg p \\lor q$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>D</td><td>Y</td><td>D</td><td>D</td></tr>
          <tr><td>D</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td></tr>
          <tr><td>Y</td><td>D</td><td>D</td><td>D</td><td>D</td></tr>
          <tr><td>Y</td><td>Y</td><td>D</td><td>D</td><td>D</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">İki sütun da satır satır aynı $\\Rightarrow$ $p \\to q \\equiv \\neg p \\lor q$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Denk</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Bileşik Tautoloji</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $(p \\land q) \\to p$ önermesi tautoloji midir?<br><br>
      <strong>A)</strong> Hayır, çelişkidir &nbsp; <strong>B)</strong> Sadece p=D iken D &nbsp; <strong>C)</strong> Hayır, açık önermedir &nbsp; <strong>D)</strong> Belirsiz &nbsp; <strong>E)</strong> <span class="key">Evet, tautolojidir</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$q$</th><th>$p \\land q$</th><th>$(p \\land q) \\to p$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>D</td><td>D</td><td>D</td></tr>
          <tr><td>D</td><td>Y</td><td>Y</td><td>D</td></tr>
          <tr><td>Y</td><td>D</td><td>Y</td><td>D</td></tr>
          <tr><td>Y</td><td>Y</td><td>Y</td><td>D</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">Her satır D $\\Rightarrow$ tautoloji.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) Evet, tautolojidir</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Üç Değişken Karma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p$ D, $q$ D, $r$ Y ise $(p \\to q) \\land (q \\to r)$ kaçtır?<br><br>
      <strong>A)</strong> D &nbsp; <strong>B)</strong> <span class="key">Y</span> &nbsp; <strong>C)</strong> Belirsiz &nbsp; <strong>D)</strong> Hem D hem Y &nbsp; <strong>E)</strong> Tanımsız
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p \\to q$ = D $\\to$ D = D.</p>
      <p class="ales-sol-step">$q \\to r$ = D $\\to$ Y = Y.</p>
      <p class="ales-sol-step">D $\\land$ Y = Y.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) Y</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Denklik Sayma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdakilerden kaç tanesi tautoloji'dir?<br>
      <strong>I.</strong> $p \\lor \\neg p$<br>
      <strong>II.</strong> $p \\to (p \\lor q)$<br>
      <strong>III.</strong> $(p \\land q) \\to (p \\lor q)$<br>
      <strong>IV.</strong> $\\neg(p \\land \\neg p)$<br>
      <strong>V.</strong> $p \\to \\neg p$<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> <span class="key">4</span> &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 1
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>I.</strong> Üçüncü hâl yasası, tautoloji ✓</p>
      <p class="ales-sol-step"><strong>II.</strong> $p$ D ise $p \\lor q$ D, $D \\to D$ = D. $p$ Y ise $Y \\to (\\dots)$ = D. Tautoloji ✓</p>
      <p class="ales-sol-step"><strong>III.</strong> Önceki problemde gösterildi gibi her durum D. Tautoloji ✓</p>
      <p class="ales-sol-step"><strong>IV.</strong> $p \\land \\neg p$ çelişki (Y), negasyonu D. Tautoloji ✓</p>
      <p class="ales-sol-step"><strong>V.</strong> $p$ D iken $D \\to Y$ = Y. Tautoloji <strong>değil</strong> ✗</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 4 (I, II, III, IV)</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — De Morgan + Karşıtı/Tersi/Karşıt-Tersi
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">De Morgan ve Karşıtı/Tersi/Karşıt-Tersi</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">De Morgan ∨ → ∧</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\neg(p \\lor q)$ önermesini De Morgan kuralı ile sadeleştirin.<br><br>
      <strong>A)</strong> ¬p ∨ ¬q &nbsp; <strong>B)</strong> p ∧ q &nbsp; <strong>C)</strong> <span class="key">¬p ∧ ¬q</span> &nbsp; <strong>D)</strong> p ∨ q &nbsp; <strong>E)</strong> ¬(p ∧ q)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">De Morgan: $\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$.</p>
      <p class="ales-sol-step">"En az biri doğru"nun değili, "ikisi de yanlış"tır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) ¬p ∧ ¬q</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">De Morgan ∧ → ∨</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $\\neg(p \\land q)$ önermesini sadeleştirin.<br><br>
      <strong>A)</strong> ¬p ∧ ¬q &nbsp; <strong>B)</strong> <span class="key">¬p ∨ ¬q</span> &nbsp; <strong>C)</strong> p ∨ q &nbsp; <strong>D)</strong> p ∧ q &nbsp; <strong>E)</strong> ¬(p ∨ q)
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$.</p>
      <p class="ales-sol-step">"İkisi de doğru"nun değili, "en az biri yanlış"tır.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) ¬p ∨ ¬q</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Karşıtı/Tersi/Karşıt-Tersi Tanım</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $p \\to q$ önermesinin karşıtı, tersi ve karşıt-tersi sırasıyla nedir?<br><br>
      <strong>A)</strong> q→p, ¬q→¬p, ¬p→¬q &nbsp; <strong>B)</strong> ¬p→¬q, q→p, ¬q→¬p &nbsp; <strong>C)</strong> <span class="key">q→p, ¬p→¬q, ¬q→¬p</span> &nbsp; <strong>D)</strong> ¬q→¬p, q→p, ¬p→¬q &nbsp; <strong>E)</strong> q→p, ¬q→¬p, p→q
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Karşıtı (converse):</strong> $q \\to p$.</p>
      <p class="ales-sol-step"><strong>Tersi (inverse):</strong> $\\neg p \\to \\neg q$.</p>
      <p class="ales-sol-step"><strong>Karşıt-tersi (contrapositive):</strong> $\\neg q \\to \\neg p$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) q→p, ¬p→¬q, ¬q→¬p</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Karşıt-Tersi Denkliği — Tablo</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $p \\to q$ önermesi ile aşağıdakilerden hangisi denk'tir?<br><br>
      <strong>A)</strong> Karşıtı (q → p) &nbsp; <strong>B)</strong> Tersi (¬p → ¬q) &nbsp; <strong>C)</strong> Hepsi denk &nbsp; <strong>D)</strong> <span class="key">Karşıt-tersi (¬q → ¬p)</span> &nbsp; <strong>E)</strong> Hiçbiri
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <table>
        <thead><tr><th>$p$</th><th>$q$</th><th>$p \\to q$</th><th>Karşıtı $q \\to p$</th><th>Tersi $\\neg p \\to \\neg q$</th><th>Karşıt-tersi $\\neg q \\to \\neg p$</th></tr></thead>
        <tbody>
          <tr><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td></tr>
          <tr><td>D</td><td>Y</td><td>Y</td><td>D</td><td>D</td><td>Y</td></tr>
          <tr><td>Y</td><td>D</td><td>D</td><td>Y</td><td>Y</td><td>D</td></tr>
          <tr><td>Y</td><td>Y</td><td>D</td><td>D</td><td>D</td><td>D</td></tr>
        </tbody>
      </table>
      <p class="ales-sol-step">$p \\to q$ ve $\\neg q \\to \\neg p$ sütunları satır satır aynı $\\Rightarrow$ <strong>denk</strong>.</p>
      <p class="ales-sol-step">Karşıtı ve tersi sütunları $p \\to q$'dan farklı (2. ve 3. satırda).</p>
      <p class="ales-sol-step"><strong>Bonus:</strong> Karşıtı ve tersi <em>kendi aralarında</em> denktir (ikisi birbirinin karşıt-tersisidir).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) Karşıt-tersi (¬q → ¬p)</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Sözel Karşıt-Tersi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      "Eğer yağmur yağarsa, sokak ıslanır." önermesinin karşıt-tersi nedir?<br><br>
      <strong>A)</strong> "Sokak ıslanırsa yağmur yağıyordur." &nbsp; <strong>B)</strong> "Yağmur yağmıyorsa sokak ıslanmaz." &nbsp; <strong>C)</strong> <span class="key">"Sokak ıslanmıyorsa yağmur yağmıyor."</span> &nbsp; <strong>D)</strong> "Sokak ıslanırsa hortum sıkıldı." &nbsp; <strong>E)</strong> "Yağmur yağarsa sokak ıslanmaz."
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$p$: yağmur yağar, $q$: sokak ıslanır. Orijinal: $p \\to q$.</p>
      <p class="ales-sol-step">Karşıt-tersi: $\\neg q \\to \\neg p$ $=$ "Sokak ıslanmıyorsa yağmur yağmıyor."</p>
      <p class="ales-sol-step"><strong>Not:</strong> Bu önerme orijinaliyle denktir. Karşıtı "Sokak ıslanırsa yağmur yağar" değil, çünkü hortumla da ıslanabilir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) "Sokak ıslanmıyorsa yağmur yağmıyor."</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Bileşik De Morgan</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\neg(p \\to q)$ önermesini sadeleştirin.<br><br>
      <strong>A)</strong> <span class="key">p ∧ ¬q</span> &nbsp; <strong>B)</strong> ¬p ∧ q &nbsp; <strong>C)</strong> ¬p ∨ q &nbsp; <strong>D)</strong> ¬p ∨ ¬q &nbsp; <strong>E)</strong> p → ¬q
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Önce $p \\to q \\equiv \\neg p \\lor q$.</p>
      <p class="ales-sol-step">$\\neg(\\neg p \\lor q) \\equiv \\neg(\\neg p) \\land \\neg q \\equiv p \\land \\neg q$.</p>
      <p class="ales-sol-step"><strong>Yorum:</strong> "Eğer $p$ ise $q$"nun değili, "$p$ doğrudur ama $q$ doğru değil"dir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) p ∧ ¬q</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Karma Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      "Eğer bir sayı $4$ ile bölünüyorsa $2$ ile de bölünür." önermesinin karşıtı, tersi ve karşıt-tersi yazıldığında <strong>doğru</strong> olanların sayısı kaçtır?<br><br>
      <strong>A)</strong> 0 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 2 &nbsp; <strong>D)</strong> 3 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Orijinal: "$4$ ile bölünür $\\to$ $2$ ile bölünür" — D (her zaman).</p>
      <p class="ales-sol-step"><strong>Karşıtı:</strong> "$2$ ile bölünür $\\to$ $4$ ile bölünür" — Y (örn: $6$, $2$ ile bölünür ama $4$ ile bölünmez).</p>
      <p class="ales-sol-step"><strong>Tersi:</strong> "$4$ ile bölünmez $\\to$ $2$ ile bölünmez" — Y (örn: $6$, $4$ ile bölünmez ama $2$ ile bölünür).</p>
      <p class="ales-sol-step"><strong>Karşıt-tersi:</strong> "$2$ ile bölünmez $\\to$ $4$ ile bölünmez" — D (orijinal D ise karşıt-tersi de D).</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1 (sadece karşıt-tersi)</span></div>
    </div>
  </div>
</section>
`
};
