window.ALES_LESSON = {
n: 9,
title: "EBOB ve EKOK",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>EBOB ve EKOK</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Asal çarpanlardan EBOB, Öklid algoritması, altın formül $a \\cdot b = \\text{EBOB} \\cdot \\text{EKOK}$ ve klasik kelime problemleri çözüm içinde uygulanır.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — EBOB Hesaplama
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">EBOB Hesaplama — Asal Çarpanlardan ve Öklid</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">İki Sayı EBOB</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $24$ ile $36$ sayılarının EBOB'u kaçtır?<br><br>
      <strong>A)</strong> 17 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> 18 &nbsp; <strong>D)</strong> 10 &nbsp; <strong>E)</strong> <span class="key">12</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Asal Çarpanlar</div>
      <p class="ales-sol-step"><strong>Kural:</strong> EBOB = ortak asal çarpanların <em>en küçük</em> üslerinin çarpımı.</p>
      <p class="ales-sol-step">$24 = 2^{3} \\cdot 3$, $\\;36 = 2^{2} \\cdot 3^{2}$.</p>
      <p class="ales-sol-step">Ortak asallar: $2$ (en küçük üs $2$), $3$ (en küçük üs $1$). EBOB $= 2^{2} \\cdot 3 = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 12</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Üç Sayı EBOB</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $48,\\; 72,\\; 120$ sayılarının EBOB'u kaçtır?<br><br>
      <strong>A)</strong> 22 &nbsp; <strong>B)</strong> <span class="key">24</span> &nbsp; <strong>C)</strong> 29 &nbsp; <strong>D)</strong> 21 &nbsp; <strong>E)</strong> 26
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$48 = 2^{4} \\cdot 3$, $\\;72 = 2^{3} \\cdot 3^{2}$, $\\;120 = 2^{3} \\cdot 3 \\cdot 5$.</p>
      <p class="ales-sol-step">Üçünde de var: $2$ (min üs $3$), $3$ (min üs $1$). $5$ sadece birinde, alma.</p>
      <p class="ales-sol-step">EBOB $= 2^{3} \\cdot 3 = 24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 24</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Öklid Algoritması</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $84$ ile $132$ sayılarının EBOB'unu Öklid algoritmasıyla bulunuz.<br><br>
      <strong>A)</strong> 16 &nbsp; <strong>B)</strong> 15 &nbsp; <strong>C)</strong> <span class="key">12</span> &nbsp; <strong>D)</strong> 17 &nbsp; <strong>E)</strong> 18
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Öklid:</strong> EBOB$(a, b)$ = EBOB$(b, a \\bmod b)$. Kalan $0$ olunca son bölen EBOB.</p>
      <p class="ales-sol-step">$132 = 1 \\cdot 84 + 48$. EBOB$(84, 48)$. $84 = 1 \\cdot 48 + 36$. EBOB$(48, 36)$. $48 = 1 \\cdot 36 + 12$. EBOB$(36, 12)$. $36 = 3 \\cdot 12 + 0$.</p>
      <p class="ales-sol-step">Son sıfırdan farklı kalan $= 12$ ⟹ EBOB$(84, 132) = 12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 12</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Aralarında Asal</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $35$ ve $48$ aralarında asal mıdır?<br><br>
      <strong>A)</strong> Hayır (EBOB=5) &nbsp; <strong>B)</strong> Hayır (EBOB=7) &nbsp; <strong>C)</strong> <span class="key">Evet (EBOB=1)</span> &nbsp; <strong>D)</strong> Hayır (EBOB=2) &nbsp; <strong>E)</strong> Hayır (EBOB=3)</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> İki sayının EBOB'u $1$ ise aralarında asaldır.</p>
      <p class="ales-sol-step">$35 = 5 \\cdot 7$, $\\;48 = 2^{4} \\cdot 3$. Ortak asal yok ⟹ EBOB $= 1$.</p>
      <p class="ales-sol-step">Evet, aralarında asal.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Evet (EBOB = 1)</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">EBOB ile Sayı Bulma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a$ ve $b$ pozitif tam sayılardır. $a + b = 56$ ve EBOB$(a, b) = 8$ ise $(a, b)$ kaç farklı sıralı çift olabilir?<br><br>
      <strong>A)</strong> 3 &nbsp; <strong>B)</strong> 4 &nbsp; <strong>C)</strong> 5 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 7</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EBOB $= 8$ ⟹ $a = 8m,\\; b = 8n$ ($m, n$ aralarında asal).</p>
      <p class="ales-sol-step">$a + b = 8(m + n) = 56 \\Rightarrow m + n = 7$.</p>
      <p class="ales-sol-step">Aralarında asal $(m, n)$ çiftleri: $(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)$. Hepsi aralarında asal mı? $(1,6)$: ✓. $(2,5)$: ✓. $(3,4)$: ✓. Tersleri sıralı çift sayar.</p>
      <p class="ales-sol-step">Toplam: <strong>6 sıralı çift</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6 sıralı çift</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">EBOB ile Sadeleştirme</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $\\dfrac{504}{792}$ kesrinin en sade biçimi nedir?<br><br>
      <strong>A)</strong> 9/13 &nbsp; <strong>B)</strong> 7/12 &nbsp; <strong>C)</strong> <span class="key">7/11</span> &nbsp; <strong>D)</strong> 6/11 &nbsp; <strong>E)</strong> 11/7</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EBOB$(504, 792)$. Öklid: $792 = 1 \\cdot 504 + 288$. $504 = 1 \\cdot 288 + 216$. $288 = 1 \\cdot 216 + 72$. $216 = 3 \\cdot 72 + 0$. EBOB $= 72$.</p>
      <p class="ales-sol-step">$\\dfrac{504}{792} = \\dfrac{504/72}{792/72} = \\dfrac{7}{11}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 7/11</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">EBOB Karma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a, b$ pozitif tam sayılar ve $a < b$. EBOB$(a, b) = 12$, $a + b = 84$ ise $b - a$'nın alabileceği değerler kaç tanedir?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">3</span> &nbsp; <strong>C)</strong> 4 &nbsp; <strong>D)</strong> 5 &nbsp; <strong>E)</strong> 6</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a = 12m,\\; b = 12n$, $\\gcd(m,n) = 1$, $m < n$, $m + n = 7$.</p>
      <p class="ales-sol-step">$(m, n)$: $(1, 6),(2, 5),(3, 4)$. Hepsi aralarında asal ✓.</p>
      <p class="ales-sol-step">Farklar: $b - a = 12(n - m) = 12 \\cdot 5 = 60,\\; 12 \\cdot 3 = 36,\\; 12 \\cdot 1 = 12$.</p>
      <p class="ales-sol-step">Üç farklı değer: $\\{12, 36, 60\\}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 3 farklı değer</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — EKOK + a·b = EBOB·EKOK
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">EKOK ve Altın Formül a·b = EBOB·EKOK</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">İki Sayı EKOK</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $20$ ile $30$'un EKOK'u kaçtır?<br><br>
      <strong>A)</strong> 57 &nbsp; <strong>B)</strong> 58 &nbsp; <strong>C)</strong> <span class="key">60</span> &nbsp; <strong>D)</strong> 65 &nbsp; <strong>E)</strong> 62
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Kural:</strong> EKOK = tüm asal çarpanların <em>en büyük</em> üslerinin çarpımı.</p>
      <p class="ales-sol-step">$20 = 2^{2} \\cdot 5$, $\\;30 = 2 \\cdot 3 \\cdot 5$.</p>
      <p class="ales-sol-step">Tüm asallar: $2$ (max $2$), $3$ (max $1$), $5$ (max $1$). EKOK $= 2^{2} \\cdot 3 \\cdot 5 = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 60</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Üç Sayı EKOK</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $12,\\; 18,\\; 30$ sayılarının EKOK'u kaçtır?<br><br>
      <strong>A)</strong> 162 &nbsp; <strong>B)</strong> 189 &nbsp; <strong>C)</strong> 181 &nbsp; <strong>D)</strong> 171 &nbsp; <strong>E)</strong> <span class="key">180</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$12 = 2^{2} \\cdot 3$, $\\;18 = 2 \\cdot 3^{2}$, $\\;30 = 2 \\cdot 3 \\cdot 5$.</p>
      <p class="ales-sol-step">$2$ max $2$, $3$ max $2$, $5$ max $1$. EKOK $= 2^{2} \\cdot 3^{2} \\cdot 5 = 4 \\cdot 9 \\cdot 5 = 180$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 180</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Altın Formül</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $a = 12,\\; b = 18$ için EBOB ve EKOK hesaplayınız ve $a \\cdot b = \\text{EBOB} \\cdot \\text{EKOK}$ ilişkisini doğrulayınız.<br><br>
      <strong>A)</strong> EBOB=2, EKOK=108 &nbsp; <strong>B)</strong> EBOB=3, EKOK=72 &nbsp; <strong>C)</strong> <span class="key">EBOB=6, EKOK=36</span> &nbsp; <strong>D)</strong> EBOB=12, EKOK=18 &nbsp; <strong>E)</strong> EBOB=6, EKOK=72</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EBOB $= 6$ ($2 \\cdot 3$). EKOK $= 36$ ($2^{2} \\cdot 3^{2}$).</p>
      <p class="ales-sol-step">$a \\cdot b = 12 \\cdot 18 = 216$. EBOB $\\cdot$ EKOK $= 6 \\cdot 36 = 216$ ✓.</p>
      <p class="ales-sol-step"><strong>Genel kural:</strong> Her zaman geçerli — iki sayı için $a \\cdot b = \\gcd(a,b) \\cdot \\text{lcm}(a,b)$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) EBOB = 6, EKOK = 36 (çarpım eşit ✓)</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">EKOK ile Sayı Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki sayının çarpımı $360$ ve EBOB'u $6$ ise EKOK'u kaçtır?<br><br>
      <strong>A)</strong> 59 &nbsp; <strong>B)</strong> 55 &nbsp; <strong>C)</strong> 57 &nbsp; <strong>D)</strong> 65 &nbsp; <strong>E)</strong> <span class="key">60</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$a \\cdot b = \\text{EBOB} \\cdot \\text{EKOK} \\Rightarrow 360 = 6 \\cdot \\text{EKOK} \\Rightarrow \\text{EKOK} = 60$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 60</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">Bilinmeyen Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $a = 24$ ile bir sayının EBOB'u $8$ ve EKOK'u $120$ ise diğer sayı kaçtır?<br><br>
      <strong>A)</strong> 39 &nbsp; <strong>B)</strong> 43 &nbsp; <strong>C)</strong> 42 &nbsp; <strong>D)</strong> <span class="key">40</span> &nbsp; <strong>E)</strong> 50
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$24 \\cdot b = 8 \\cdot 120 = 960 \\Rightarrow b = 40$.</p>
      <p class="ales-sol-step">Doğrula: EBOB$(24, 40) = 8$ ✓. EKOK$(24, 40) = 120$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 40</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">EKOK Eşitlik</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      EKOK$(a, 12) = 60$ koşulunu sağlayan kaç farklı $a$ pozitif tam sayısı vardır?<br><br>
      <strong>A)</strong> 7 &nbsp; <strong>B)</strong> 3 &nbsp; <strong>C)</strong> 11 &nbsp; <strong>D)</strong> <span class="key">6</span> &nbsp; <strong>E)</strong> 12
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$60 = 2^{2} \\cdot 3 \\cdot 5$. $12 = 2^{2} \\cdot 3$. EKOK için $a$'nın asal çarpanları $\\{2, 3, 5\\}$ kümesinden olmalı, $5$ kesinlikle var (12 vermez).</p>
      <p class="ales-sol-step">$a$ formundaki: $a = 2^{x} \\cdot 3^{y} \\cdot 5^{z}$, $z = 1$. EKOK için max üsler $2, 1, 1$ olmalı.</p>
      <p class="ales-sol-step">$\\max(x, 2) = 2 \\Rightarrow x \\in \\{0, 1, 2\\}$. $\\max(y, 1) = 1 \\Rightarrow y \\in \\{0, 1\\}$. $z = 1$ kesin.</p>
      <p class="ales-sol-step">Sayım: $3 \\cdot 2 \\cdot 1 = 6$ değer.</p>
      <p class="ales-sol-step">Doğrula: $a \\in \\{5, 10, 15, 20, 30, 60\\}$ — 6 değer.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 6</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Üç Sayı</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $a, b, c$ pozitif tam sayıları için EBOB$(a,b) = 6$, EBOB$(a,c) = 4$, EBOB$(b,c) = 3$ ise EBOB$(a, b, c)$ en fazla kaç olabilir?<br><br>
      <strong>A)</strong> 2 &nbsp; <strong>B)</strong> <span class="key">1</span> &nbsp; <strong>C)</strong> 0 &nbsp; <strong>D)</strong> 7 &nbsp; <strong>E)</strong> 8
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EBOB$(a,b,c)$, hepsinin ortak böleni; EBOB$(a,b)$, EBOB$(a,c)$, EBOB$(b,c)$'nin de böleni olmalı.</p>
      <p class="ales-sol-step">EBOB$(6, 4, 3) = 1$.</p>
      <p class="ales-sol-step">Yani üçünün ortak EBOB'u en fazla $1$ olabilir.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 1</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Klasik Kelime Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Klasik ALES Kelime Problemleri</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Eşit Kutulara Bölme — EBOB</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir manavın elinde $48$ elma ve $72$ portakal vardır. Her kutuda eşit sayıda elma ve eşit sayıda portakal olacak şekilde bunları en az kaç kutuya yerleştirebilir?<br><br>
      <strong>A)</strong> 6 kutu &nbsp; <strong>B)</strong> 12 kutu &nbsp; <strong>C)</strong> 36 kutu &nbsp; <strong>D)</strong> <span class="key">24 kutu</span> &nbsp; <strong>E)</strong> 48 kutu</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Yöntem:</strong> "En az kutu" ⟹ "her kutuya en çok meyve" ⟹ EBOB.</p>
      <p class="ales-sol-step">EBOB$(48, 72) = 24$. Her kutuda $48/24 = 2$ elma ve $72/24 = 3$ portakal.</p>
      <p class="ales-sol-step">Toplam kutu: $24$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 24 kutu</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Fayans/Karo — EBOB</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $120$ cm × $180$ cm boyutlarındaki dikdörtgen bir zemini hiç kesmeden, mümkün olan en büyük kare fayanslarla döşemek istiyoruz. Kullanılan fayans sayısı kaç olur?<br><br>
      <strong>A)</strong> 4 fayans &nbsp; <strong>B)</strong> 5 fayans &nbsp; <strong>C)</strong> <span class="key">6 fayans</span> &nbsp; <strong>D)</strong> 8 fayans &nbsp; <strong>E)</strong> 12 fayans</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Yöntem:</strong> En büyük kare ⟹ kenar uzunluğu = EBOB$(120, 180) = 60$ cm.</p>
      <p class="ales-sol-step">Yatayda: $180/60 = 3$ fayans. Dikeyde: $120/60 = 2$ fayans.</p>
      <p class="ales-sol-step">Toplam: $3 \\cdot 2 = 6$ fayans.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6 fayans</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Pist Dönüşü — EKOK</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      İki bisikletçi aynı pisti turlarken biri turunu $6$ dakikada, diğeri $9$ dakikada tamamlıyor. İkisi aynı anda başlayıp aynı yöne ilerlerse en az kaç dakika sonra ilk kez yine aynı noktada karşılaşırlar?<br><br>
      <strong>A)</strong> 15 dakika &nbsp; <strong>B)</strong> 24 dakika &nbsp; <strong>C)</strong> 36 dakika &nbsp; <strong>D)</strong> 54 dakika &nbsp; <strong>E)</strong> <span class="key">18 dakika</span></div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Yöntem:</strong> "Aynı anda buluşma" ⟹ EKOK.</p>
      <p class="ales-sol-step">EKOK$(6, 9) = 18$. $18$ dakika sonra: birinci $3$ tur, ikinci $2$ tur tamamlamış.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 18 dakika</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Otobüs/Vapur — EKOK</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir terminalden $A$ otobüsü her $24$ dakikada, $B$ otobüsü her $36$ dakikada kalkıyor. Sabah $08:00$'da ikisi aynı anda kalktıysa öğleden önce bir sonraki ortak kalkış saat kaçta gerçekleşir?<br><br>
      <strong>A)</strong> 09:00 &nbsp; <strong>B)</strong> 08:36 &nbsp; <strong>C)</strong> 09:24 &nbsp; <strong>D)</strong> <span class="key">09:12</span> &nbsp; <strong>E)</strong> 10:00</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">EKOK$(24, 36) = 72$ dakika $= 1$ saat $12$ dakika.</p>
      <p class="ales-sol-step">$08:00 + 01:12 = 09:12$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 09:12</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Kalan Bir Sayı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $4, 6$ ve $8$'e bölündüğünde her biri için $3$ kalanını veren en küçük doğal sayı kaçtır? (Sıfır kalanlı $a=3$ trivial sayılır.)<br><br>
      <strong>A)</strong> 24 &nbsp; <strong>B)</strong> 25 &nbsp; <strong>C)</strong> <span class="key">27</span> &nbsp; <strong>D)</strong> 29 &nbsp; <strong>E)</strong> 51</div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kalan eşit ⟹ sayı $-$ kalan $= $ EKOK katı.</p>
      <p class="ales-sol-step">EKOK$(4, 6, 8) = 24$. Sayı $= 24k + 3$. En küçük doğal ($k = 0$): $3$. Ama $3$, $4$ ile bölündüğünde kalan $3$, $6$ ile bölündüğünde kalan $3$, $8$ ile bölündüğünde kalan $3$ — geçerli.</p>
      <p class="ales-sol-step">Eğer "$0$ olamaz" gerekiyorsa $k = 1 \\Rightarrow 27$. Tipik ALES'te en küçük pozitif: $3$ trivial sayılırsa $27$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 27</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Kalan Eksilen — EKOK</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      $5, 7, 9$ ile bölündüğünde sırasıyla $4, 6, 8$ kalanlarını veren en küçük doğal sayı kaçtır?<br><br>
      <strong>A)</strong> 315 &nbsp; <strong>B)</strong> 359 &nbsp; <strong>C)</strong> 299 &nbsp; <strong>D)</strong> 329 &nbsp; <strong>E)</strong> <span class="key">314</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Eksilen Kalan Tekniği</div>
      <p class="ales-sol-step">Her durumda <strong>bölen − kalan = 1</strong> (sabit). Bu durumda sayıya $1$ eklersek tüm bölenlere tam bölünür.</p>
      <p class="ales-sol-step">Sayı $+ 1 = $ EKOK$(5, 7, 9) \\cdot k = 315k$.</p>
      <p class="ales-sol-step">En küçük: $k = 1$ ⟹ sayı $= 315 - 1 = 314$.</p>
      <p class="ales-sol-step">Doğrula: $314/5 = 62$ kalan $4$ ✓. $314/7 = 44$ kalan $6$ ✓. $314/9 = 34$ kalan $8$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 314</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Çiçek Demeti — EBOB Sentez</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir çiçekçide $84$ gül, $126$ karanfil ve $210$ papatya vardır. Her demette eşit sayıda her çiçek olmak şartıyla, mümkün olan en az sayıda demet hazırlanırsa bir demette toplam kaç çiçek olur?<br><br>
      <strong>A)</strong> 8 çiçek &nbsp; <strong>B)</strong> 9 çiçek &nbsp; <strong>C)</strong> 11 çiçek &nbsp; <strong>D)</strong> 12 çiçek &nbsp; <strong>E)</strong> <span class="key">10 çiçek</span></div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">"En az demet" ⟹ "her demette en çok çiçek" ⟹ demet sayısı = EBOB.</p>
      <p class="ales-sol-step">EBOB$(84, 126, 210)$. $84 = 2^{2} \\cdot 3 \\cdot 7$, $126 = 2 \\cdot 3^{2} \\cdot 7$, $210 = 2 \\cdot 3 \\cdot 5 \\cdot 7$.</p>
      <p class="ales-sol-step">Ortak: $2 \\cdot 3 \\cdot 7 = 42$. Demet sayısı $= 42$.</p>
      <p class="ales-sol-step">Bir demette: $84/42 + 126/42 + 210/42 = 2 + 3 + 5 = 10$ çiçek.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 10 çiçek</span></div>
    </div>
  </div>
</section>
`
};
