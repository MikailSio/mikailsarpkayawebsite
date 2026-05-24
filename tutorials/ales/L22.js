window.ALES_LESSON = {
n: 22,
title: "Yüzde Hesabı",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>yüzde hesabı</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Özellikle <strong>"%20 zam + %20 indirim = orijinal değil!"</strong> tuzağına ayrı vurgu yapacağız: ardışık yüzde değişim sorularının çoğu burada düşülür.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Bir Sayının Yüzdesi + Tersine Gitme
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Bir Sayının Yüzdesi ve Geriye Gitme</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Doğrudan Yüzde</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $250$'nin %$40$'ı kaçtır?<br><br>
      <strong>A)</strong> $97$ &nbsp; <strong>B)</strong> <span class="key">$100$</span> &nbsp; <strong>C)</strong> $103$ &nbsp; <strong>D)</strong> $105$ &nbsp; <strong>E)</strong> $133$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\%p$'lik kısım $= \\dfrac{p}{100} \\cdot \\text{sayi}$.</p>
      <p class="ales-sol-step">$\\dfrac{40}{100} \\cdot 250 = \\dfrac{40 \\cdot 250}{100} = \\dfrac{10000}{100} = 100$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $100$</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Yüzdesini Bul</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $80$, $200$'ün yüzde kaçıdır?<br><br>
      <strong>A)</strong> $\\%25$ &nbsp; <strong>B)</strong> $\\%30$ &nbsp; <strong>C)</strong> <span class="key">$\\%40$</span> &nbsp; <strong>D)</strong> $\\%50$ &nbsp; <strong>E)</strong> $\\%60$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{80}{200} \\cdot 100 = 40$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%40$</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Geriye Gitme</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir sayının %$25$'i $60$ ise, bu sayı kaçtır?<br><br>
      <strong>A)</strong> $239$ &nbsp; <strong>B)</strong> <span class="key">$240$</span> &nbsp; <strong>C)</strong> $249$ &nbsp; <strong>D)</strong> $288$ &nbsp; <strong>E)</strong> $480$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{25}{100} \\cdot x = 60 \\Rightarrow x = \\dfrac{60 \\cdot 100}{25} = 240$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Pratik</div>
      <p class="ales-sol-step">$\\%25 = \\dfrac{1}{4}$ ⟹ tüm sayı $= 4 \\cdot 60 = 240$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $240$</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">Yüzde + Sözel</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir okulda $400$ öğrenci vardır. Bunların %$45$'i kızdır. Erkek öğrenci sayısı kaçtır?<br><br>
      <strong>A)</strong> $110$ &nbsp; <strong>B)</strong> $176$ &nbsp; <strong>C)</strong> <span class="key">$220$</span> &nbsp; <strong>D)</strong> $229$ &nbsp; <strong>E)</strong> $293$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Erkek yüzdesi $= \\%(100 - 45) = \\%55$.</p>
      <p class="ales-sol-step">Erkek sayısı $= \\dfrac{55}{100} \\cdot 400 = 220$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $220$</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Geriye Gitme — Karma</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir sınıftaki kız sayısı tüm sınıfın %$60$'ını oluşturuyor. Sınıfta $12$ erkek varsa, sınıfın toplam mevcudu kaçtır?<br><br>
      <strong>A)</strong> $21$ &nbsp; <strong>B)</strong> $25$ &nbsp; <strong>C)</strong> $27$ &nbsp; <strong>D)</strong> <span class="key">$30$</span> &nbsp; <strong>E)</strong> $35$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kız $= \\%60$ ⟹ erkek $= \\%40$. $\\%40$ $= 12 \\Rightarrow \\%100 = \\dfrac{12 \\cdot 100}{40} = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $30$</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Yüzdenin Yüzdesi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      $300$ sayısının %$20$'sinin %$50$'si kaçtır?<br><br>
      <strong>A)</strong> $21$ &nbsp; <strong>B)</strong> $29$ &nbsp; <strong>C)</strong> <span class="key">$30$</span> &nbsp; <strong>D)</strong> $35$ &nbsp; <strong>E)</strong> $60$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Sırayla</div>
      <p class="ales-sol-step">$\\%20$ $= \\dfrac{20}{100} \\cdot 300 = 60$.</p>
      <p class="ales-sol-step">$\\%50$ of $60$ $= 30$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Çarpan Birleştirme</div>
      <p class="ales-sol-step">$0.20 \\cdot 0.50 \\cdot 300 = 0.10 \\cdot 300 = 30$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $30$</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Geriye + Çıkarma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir sayının %$30$'u, başka bir sayının %$50$'sine eşittir. İlk sayının ikinci sayıya oranı nedir?<br><br>
      <strong>A)</strong> $3:5$ &nbsp; <strong>B)</strong> <span class="key">$5:3$</span> &nbsp; <strong>C)</strong> $2:3$ &nbsp; <strong>D)</strong> $3:2$ &nbsp; <strong>E)</strong> $1:1$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\dfrac{30}{100} a = \\dfrac{50}{100} b \\Rightarrow 30a = 50b \\Rightarrow \\dfrac{a}{b} = \\dfrac{50}{30} = \\dfrac{5}{3}$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $5:3$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Yüzde Artış / Azalış
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Yüzde Artış ve Azalış</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Zam (Artış)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ürünün $200$ TL fiyatı %$20$ zamlanıyor. Yeni fiyat kaç TL'dir?<br><br>
      <strong>A)</strong> $239$ TL &nbsp; <strong>B)</strong> <span class="key">$240$ TL</span> &nbsp; <strong>C)</strong> $241$ TL &nbsp; <strong>D)</strong> $249$ TL &nbsp; <strong>E)</strong> $480$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpan Yöntemi</div>
      <p class="ales-sol-step">$\\%20$ zam ⟹ çarpan $= 1 + 0.20 = 1.20$.</p>
      <p class="ales-sol-step">Yeni fiyat $= 200 \\cdot 1.20 = 240$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $240$ TL</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">İndirim (Azalış)</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      $500$ TL'lik bir ürüne %$15$ indirim yapılıyor. Yeni fiyat kaç TL'dir?<br><br>
      <strong>A)</strong> $212$ TL &nbsp; <strong>B)</strong> $420$ TL &nbsp; <strong>C)</strong> $422$ TL &nbsp; <strong>D)</strong> <span class="key">$425$ TL</span> &nbsp; <strong>E)</strong> $430$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\%15$ indirim ⟹ çarpan $= 1 - 0.15 = 0.85$.</p>
      <p class="ales-sol-step">Yeni fiyat $= 500 \\cdot 0.85 = 425$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $425$ TL</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Artış Yüzdesini Bul</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir maaş $4000$ TL'den $5000$ TL'ye çıkmıştır. Yüzde kaç zam yapılmıştır?<br><br>
      <strong>A)</strong> $\\%10$ &nbsp; <strong>B)</strong> $\\%20$ &nbsp; <strong>C)</strong> <span class="key">$\\%25$</span> &nbsp; <strong>D)</strong> $\\%30$ &nbsp; <strong>E)</strong> $\\%50$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Artış $= 5000 - 4000 = 1000$. Yüzde $= \\dfrac{1000}{4000} \\cdot 100 = 25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%25$</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Eski Fiyatı Bul</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün %$25$ zamdan sonra $300$ TL olmuştur. Eski fiyatı kaç TL'dir?<br><br>
      <strong>A)</strong> $231$ TL &nbsp; <strong>B)</strong> $237$ TL &nbsp; <strong>C)</strong> <span class="key">$240$ TL</span> &nbsp; <strong>D)</strong> $241$ TL &nbsp; <strong>E)</strong> $243$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpanı Geri Çevir</div>
      <p class="ales-sol-step">Eski $\\cdot 1.25 = 300 \\Rightarrow$ Eski $= \\dfrac{300}{1.25} = 240$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $240$ TL</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">İndirim Sonrası Eski Fiyat</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün %$20$ indirim sonrası $400$ TL olmuştur. Eski fiyatı kaçtır?<br><br>
      <strong>A)</strong> $491$ TL &nbsp; <strong>B)</strong> <span class="key">$500$ TL</span> &nbsp; <strong>C)</strong> $503$ TL &nbsp; <strong>D)</strong> $600$ TL &nbsp; <strong>E)</strong> $1000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski $\\cdot 0.80 = 400 \\Rightarrow$ Eski $= \\dfrac{400}{0.80} = 500$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $500$ TL</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Verilen Yeni-Eski Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir maaşa %$30$ zam yapıldığında zam tutarı $750$ TL'dir. Eski maaş kaç TL'dir?<br><br>
      <strong>A)</strong> $2495$ TL &nbsp; <strong>B)</strong> $2497$ TL &nbsp; <strong>C)</strong> <span class="key">$2500$ TL</span> &nbsp; <strong>D)</strong> $2503$ TL &nbsp; <strong>E)</strong> $3000$ TL
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$\\%30 \\cdot$ Eski $= 750 \\Rightarrow$ Eski $= \\dfrac{750 \\cdot 100}{30} = 2500$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $2500$ TL</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Negatif Artış</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir nüfus $\\%20$ azalmıştır. Eski nüfusa dönmek için yeni nüfusa yüzde kaç artış yapılmalıdır?<br><br>
      <strong>A)</strong> $\\%15$ &nbsp; <strong>B)</strong> $\\%20$ &nbsp; <strong>C)</strong> <span class="key">$\\%25$</span> &nbsp; <strong>D)</strong> $\\%30$ &nbsp; <strong>E)</strong> $\\%80$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Eski $= 100$ alalım. Yeni $= 100 \\cdot 0.80 = 80$.</p>
      <p class="ales-sol-step">$80 \\to 100$ artış: $\\dfrac{100 - 80}{80} \\cdot 100 = \\dfrac{20}{80} \\cdot 100 = 25$.</p>
      <p class="ales-sol-step">Tuzak: $\\%20$ azalış $\\neq$ $\\%20$ artışla geri gel; $\\%25$ artış lazım.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%25$</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Ardışık Yüzde Değişim (TUZAK)
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Ardışık Yüzde Değişim (TUZAK!)</h2>
  </div>

  <!-- Problem 15 — KLASİK TUZAK -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">%20 Zam + %20 İndirim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün önce %$20$ zamlanıyor, sonra %$20$ indiriliyor. Sonuç orijinal fiyatın yüzde kaçıdır?<br><br>
      <strong>A)</strong> $\\%100$ &nbsp; <strong>B)</strong> $\\%104$ &nbsp; <strong>C)</strong> <span class="key">$\\%96$</span> &nbsp; <strong>D)</strong> $\\%80$ &nbsp; <strong>E)</strong> $\\%120$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Çarpanları Sırayla Uygula</div>
      <p class="ales-sol-step">Çarpan $= 1.20 \\cdot 0.80 = 0.96$ ⟹ orijinalin $\\%96$'sı.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> $\\%20 - \\%20 = 0$ değil! Net $\\%4$ azalış olur.</p>
      <p class="ales-sol-step">Pratik kontrol: $100 \\to 120 \\to 96$. Doğru.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%96$ (yani $\\%4$ azalış)</span></div>
    </div>
  </div>

  <!-- Problem 16 — TUZAK 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">%50 Zam + %50 İndirim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne önce %$50$ zam, sonra %$50$ indirim yapılıyor. Yüzde net değişim nedir?<br><br>
      <strong>A)</strong> Değişmez &nbsp; <strong>B)</strong> $\\%50$ artış &nbsp; <strong>C)</strong> $\\%25$ artış &nbsp; <strong>D)</strong> <span class="key">$\\%25$ azalış</span> &nbsp; <strong>E)</strong> $\\%50$ azalış
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 1.50 \\cdot 0.50 = 0.75$ ⟹ orijinalin $\\%75$'i.</p>
      <p class="ales-sol-step">Net azalış $\\%25$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $\\%25$ azalış</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">İki Ardışık Zam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir maaşa önce %$10$, ardından %$20$ zam yapılıyor. Net zam yüzdesi nedir?<br><br>
      <strong>A)</strong> $\\%30$ &nbsp; <strong>B)</strong> $\\%31$ &nbsp; <strong>C)</strong> <span class="key">$\\%32$</span> &nbsp; <strong>D)</strong> $\\%33$ &nbsp; <strong>E)</strong> $\\%35$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 1.10 \\cdot 1.20 = 1.32$ ⟹ net $\\%32$ artış.</p>
      <p class="ales-sol-step">Tuzak: $\\%10 + \\%20 = \\%30$ değil; $\\%32$ — çünkü ikinci zam birinciden artmış miktarın üzerine geliyor.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%32$</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">İki Ardışık İndirim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne önce %$20$, ardından %$10$ indirim yapılıyor. Net indirim yüzdesi nedir?<br><br>
      <strong>A)</strong> $\\%30$ &nbsp; <strong>B)</strong> $\\%29$ &nbsp; <strong>C)</strong> <span class="key">$\\%28$</span> &nbsp; <strong>D)</strong> $\\%25$ &nbsp; <strong>E)</strong> $\\%32$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 0.80 \\cdot 0.90 = 0.72$ ⟹ orijinalin $\\%72$'si kalır.</p>
      <p class="ales-sol-step">Net indirim $= 100 - 72 = 28$ ⟹ $\\%28$.</p>
      <p class="ales-sol-step">Tuzak: $\\%20 + \\%10 = \\%30$ değil; $\\%28$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%28$</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Zam + İndirim — Tersi</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir ürün önce %$25$ indirim, ardından %$25$ zam görüyor. Sonuç orijinalin yüzde kaçıdır?<br><br>
      <strong>A)</strong> $\\%100$ &nbsp; <strong>B)</strong> $\\%87.5$ &nbsp; <strong>C)</strong> <span class="key">$\\%93.75$</span> &nbsp; <strong>D)</strong> $\\%96.25$ &nbsp; <strong>E)</strong> $\\%106.25$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 0.75 \\cdot 1.25 = 0.9375$ ⟹ orijinalin $\\%93.75$'i.</p>
      <p class="ales-sol-step">Net azalış $\\%6.25$. Sıra önemli değil — zam–indirim ve indirim–zam aynı çarpan.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) $\\%93.75$</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Üç Ardışık</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne sırayla %$20$ zam, %$10$ zam ve %$25$ indirim uygulanıyor. Net değişim yüzdesi nedir?<br><br>
      <strong>A)</strong> $\\%5$ artış &nbsp; <strong>B)</strong> <span class="key">$\\%1$ azalış</span> &nbsp; <strong>C)</strong> $\\%5$ azalış &nbsp; <strong>D)</strong> $\\%1$ artış &nbsp; <strong>E)</strong> Değişmez
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Çarpan $= 1.20 \\cdot 1.10 \\cdot 0.75 = 1.32 \\cdot 0.75 = 0.99$.</p>
      <p class="ales-sol-step">Sonuç orijinalin $\\%99$'u ⟹ net $\\%1$ azalış.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) $\\%1$ azalış</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Ters TUZAK</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir ürüne %$40$ zam yapılmış, ardından %$x$ indirim yapıldığında orijinal fiyata dönülmüştür. $x$ kaçtır?<br><br>
      <strong>A)</strong> $\\%40$ &nbsp; <strong>B)</strong> $\\%35$ &nbsp; <strong>C)</strong> $\\%30$ &nbsp; <strong>D)</strong> <span class="key">$\\dfrac{200}{7} \\approx \\%28.6$</span> &nbsp; <strong>E)</strong> $\\%25$
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$1.40 \\cdot (1 - x/100) = 1 \\Rightarrow 1 - \\dfrac{x}{100} = \\dfrac{1}{1.40} = \\dfrac{5}{7}$.</p>
      <p class="ales-sol-step">$\\dfrac{x}{100} = 1 - \\dfrac{5}{7} = \\dfrac{2}{7} \\Rightarrow x = \\dfrac{200}{7} \\approx 28.57$.</p>
      <p class="ales-sol-step">Yani %$40$ zammı geri almak için %$\\dfrac{200}{7} \\approx \\%28.6$ indirim gerekir, %$40$ değil.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) $x = \\dfrac{200}{7} \\approx \\%28.6$</span></div>
    </div>
  </div>
</section>
`
};
