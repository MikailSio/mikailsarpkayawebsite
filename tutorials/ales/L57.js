window.ALES_LESSON = {
n: 57,
title: "Tablo ve Grafik Yorumu",
content: `
<div class="ales-intro">
  <p>Bu derste <strong>tablo ve grafik yorumu</strong> üzerine 3 alt konu × 7 problem = <strong>21 ALES tipi soru</strong>. Pasta, sütun ve çizgi grafikleri ile çift değişkenli tablolar üzerinde çalışacaksın. Her problemde grafik/tablo inline olarak gösterilmiştir; veriden sayıyı çıkarmayı ve karşılaştırma yapmayı pratik et.</p>
</div>

<!-- ============================================================
     ALT KONU 1.1 — Pasta Grafiği Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.1</span>
    <h2 class="ales-sub-title">Pasta Grafiği Problemleri</h2>
  </div>

  <!-- Problem 1 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 1</span>
      <span class="ales-prob-type">Dilimden Sayı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir okuldaki <strong>800</strong> öğrencinin tercih ettiği spor dalları aşağıdaki pasta grafiğinde verilmiştir. <strong>Basketbol</strong> seçen öğrenci sayısı kaçtır?<br><br>
      <strong>A)</strong> 201 öğrenci &nbsp; <strong>B)</strong> <span class="key">200 öğrenci</span> &nbsp; <strong>C)</strong> 199 öğrenci &nbsp; <strong>D)</strong> 202 öğrenci &nbsp; <strong>E)</strong> 198 öğrenci
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 220" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="90" fill="#e5e7eb"/>
        <path d="M110,110 L110,20 A90,90 0 0,1 196.6,136.8 Z" fill="#4de87a"/>
        <path d="M110,110 L196.6,136.8 A90,90 0 0,1 113.1,199.95 Z" fill="#c8a96e"/>
        <path d="M110,110 L113.1,199.95 A90,90 0 0,1 24.36,86.55 Z" fill="#06b6d4"/>
        <path d="M110,110 L24.36,86.55 A90,90 0 0,1 110,20 Z" fill="#ff6b9d"/>
        <text x="140" y="70" font-size="11" fill="#0b1220">Futbol %40</text>
        <text x="155" y="155" font-size="11" fill="#0b1220">Basket %25</text>
        <text x="55" y="170" font-size="11" fill="#0b1220">Voleybol %20</text>
        <text x="35" y="60" font-size="11" fill="#0b1220">Yüzme %15</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Yüzdeyi sayıya çevir:</strong> Toplam $\\times$ yüzde $/ 100$.</p>
      <p class="ales-sol-step">$800 \\times \\dfrac{25}{100} = 800 \\times 0.25 = 200$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 200 öğrenci</span></div>
    </div>
  </div>

  <!-- Problem 2 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 2</span>
      <span class="ales-prob-type">Dilim Açısı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki pasta grafiğinde <strong>Yüzme</strong> diliminin merkez açısı kaç derecedir?<br><br>
      <strong>A)</strong> 55° &nbsp; <strong>B)</strong> 53° &nbsp; <strong>C)</strong> 56° &nbsp; <strong>D)</strong> 52° &nbsp; <strong>E)</strong> <span class="key">54°</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Pasta açı formülü:</strong> $\\text{aci} = \\dfrac{\\%}{100} \\times 360°$.</p>
      <p class="ales-sol-step">Yüzme %15 ⟹ $\\dfrac{15}{100} \\times 360 = 54°$.</p>
      <p class="ales-sol-step"><strong>Hız kontrolü:</strong> %1 = 3.6°. %15 = $15 \\times 3.6 = 54°$ ✓.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 54°</span></div>
    </div>
  </div>

  <!-- Problem 3 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 3</span>
      <span class="ales-prob-type">Eksik Dilim</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Bir aile aylık <strong>12 000 TL</strong> harcamasını şu şekilde dağıtıyor: Kira %35, Gıda %25, Ulaşım %15, Eğitim %10. Geri kalanı <strong>Diğer</strong> kalemine ayırıyor. Diğer'e ayrılan tutar kaç TL'dir?<br><br>
      <strong>A)</strong> 1801 TL &nbsp; <strong>B)</strong> 1799 TL &nbsp; <strong>C)</strong> 1802 TL &nbsp; <strong>D)</strong> <span class="key">1800 TL</span> &nbsp; <strong>E)</strong> 1798 TL
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="90" fill="#e5e7eb"/>
        <path d="M110,110 L110,20 A90,90 0 0,1 198.6,124.4 Z" fill="#4de87a"/>
        <path d="M110,110 L198.6,124.4 A90,90 0 0,1 161.6,189.4 Z" fill="#c8a96e"/>
        <path d="M110,110 L161.6,189.4 A90,90 0 0,1 87.6,198.4 Z" fill="#06b6d4"/>
        <path d="M110,110 L87.6,198.4 A90,90 0 0,1 22.27,144.4 Z" fill="#ff6b9d"/>
        <path d="M110,110 L22.27,144.4 A90,90 0 0,1 110,20 Z" fill="#a78bfa"/>
        <text x="125" y="55" font-size="10" fill="#0b1220">Kira %35</text>
        <text x="170" y="160" font-size="10" fill="#0b1220">Gıda %25</text>
        <text x="115" y="195" font-size="10" fill="#0b1220">Ulş %15</text>
        <text x="35" y="180" font-size="10" fill="#0b1220">Eğt %10</text>
        <text x="20" y="100" font-size="10" fill="#0b1220">Diğer ?</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Pastanın tamamı %100.</strong> Verilenleri topla: $35 + 25 + 15 + 10 = 85$.</p>
      <p class="ales-sol-step">Diğer kalemi: $100 - 85 = \\%15$.</p>
      <p class="ales-sol-step">Tutar: $12\\,000 \\times 0.15 = 1800$ TL.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 1800 TL</span></div>
    </div>
  </div>

  <!-- Problem 4 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 4</span>
      <span class="ales-prob-type">İki Dilim Toplam</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir şirketin <strong>1500</strong> çalışanının departman dağılımı: Üretim %40, Satış %30, AR-GE %20, İK %10. <strong>Satış ve AR-GE</strong> departmanlarında toplam kaç çalışan vardır?<br><br>
      <strong>A)</strong> 749 &nbsp; <strong>B)</strong> <span class="key">750</span> &nbsp; <strong>C)</strong> 751 &nbsp; <strong>D)</strong> 748 &nbsp; <strong>E)</strong> 752
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="90" fill="#e5e7eb"/>
        <path d="M110,110 L110,20 A90,90 0 0,1 196.6,136.8 Z" fill="#4de87a"/>
        <path d="M110,110 L196.6,136.8 A90,90 0 0,1 124.5,198.84 Z" fill="#c8a96e"/>
        <path d="M110,110 L124.5,198.84 A90,90 0 0,1 24.36,133.45 Z" fill="#06b6d4"/>
        <path d="M110,110 L24.36,133.45 A90,90 0 0,1 110,20 Z" fill="#ff6b9d"/>
        <text x="140" y="65" font-size="11" fill="#0b1220">Üretim 40%</text>
        <text x="155" y="160" font-size="11" fill="#0b1220">Satış 30%</text>
        <text x="65" y="190" font-size="11" fill="#0b1220">AR-GE 20%</text>
        <text x="40" y="80" font-size="11" fill="#0b1220">İK 10%</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Satış + AR-GE = $30 + 20 = \\%50$.</p>
      <p class="ales-sol-step">$1500 \\times 0.50 = 750$ çalışan.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 750</span></div>
    </div>
  </div>

  <!-- Problem 5 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 5</span>
      <span class="ales-prob-type">Dilim Farkı</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki şirkette <strong>Üretim</strong> departmanında çalışanlar, <strong>İK</strong> departmanından kaç kişi <strong>fazladır</strong>?<br><br>
      <strong>A)</strong> 451 kişi &nbsp; <strong>B)</strong> <span class="key">450 kişi</span> &nbsp; <strong>C)</strong> 449 kişi &nbsp; <strong>D)</strong> 452 kişi &nbsp; <strong>E)</strong> 448 kişi
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Yüzde Farkı Önce</div>
      <p class="ales-sol-step">Yüzde farkı: $40 - 10 = \\%30$.</p>
      <p class="ales-sol-step">Sayı farkı: $1500 \\times 0.30 = 450$ kişi.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Tek Tek</div>
      <p class="ales-sol-step">Üretim $= 1500 \\times 0.40 = 600$. İK $= 1500 \\times 0.10 = 150$. Fark $= 600 - 150 = 450$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 450 kişi</span></div>
    </div>
  </div>

  <!-- Problem 6 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 6</span>
      <span class="ales-prob-type">Açıdan Yüzdeye</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Bir pasta grafiğinde bir dilimin merkez açısı <strong>72°</strong> ve toplam <strong>2400</strong> kişiyi temsil ediyor. Bu dilim kaç kişiye karşılık gelir?<br><br>
      <strong>A)</strong> 481 &nbsp; <strong>B)</strong> 479 &nbsp; <strong>C)</strong> 482 &nbsp; <strong>D)</strong> 478 &nbsp; <strong>E)</strong> <span class="key">480</span>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Açı → oran:</strong> $\\dfrac{72}{360} = \\dfrac{1}{5} = 0.20$ yani %20.</p>
      <p class="ales-sol-step">$2400 \\times 0.20 = 480$ kişi.</p>
      <p class="ales-sol-step"><strong>Hız:</strong> Doğrudan oran kur — $\\dfrac{72}{360} \\times 2400 = \\dfrac{2400}{5} = 480$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 480</span></div>
    </div>
  </div>

  <!-- Problem 7 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 7</span>
      <span class="ales-prob-type">Sentez — Pasta + Oran</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir pasta grafikte A dilimi 90°, B dilimi 60°, C dilimi 30°'dir. D dilimi geri kalandır. A dilimi <strong>180</strong> kişi temsil ediyorsa, D dilimi kaç kişiyi temsil eder?<br><br>
      <strong>A)</strong> <span class="key">360</span> &nbsp; <strong>B)</strong> 359 &nbsp; <strong>C)</strong> 361 &nbsp; <strong>D)</strong> 358 &nbsp; <strong>E)</strong> 362
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Önce toplam kişi sayısını bul.</strong> A dilimi: $90°$ ⟹ pastanın $\\dfrac{1}{4}$'ü.</p>
      <p class="ales-sol-step">Toplam $= 180 \\times 4 = 720$ kişi.</p>
      <p class="ales-sol-step">D dilimi açısı: $360 - (90 + 60 + 30) = 360 - 180 = 180°$ (yani pastanın yarısı).</p>
      <p class="ales-sol-step">D = $720 \\times \\dfrac{1}{2} = 360$ kişi.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 360</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.2 — Sütun ve Çizgi Grafiği Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.2</span>
    <h2 class="ales-sub-title">Sütun ve Çizgi Grafiği Problemleri</h2>
  </div>

  <!-- Problem 8 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 8</span>
      <span class="ales-prob-type">Sütundan Okuma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki sütun grafik bir mağazanın 4 aylık satış adetlerini göstermektedir. <strong>Mart</strong> ayı satışı kaç adettir?<br><br>
      <strong>A)</strong> 301 adet &nbsp; <strong>B)</strong> 299 adet &nbsp; <strong>C)</strong> 302 adet &nbsp; <strong>D)</strong> <span class="key">300 adet</span> &nbsp; <strong>E)</strong> 298 adet
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 320 220" width="320" height="220" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="20" x2="40" y2="180" stroke="#0b1220" stroke-width="1.5"/>
        <line x1="40" y1="180" x2="310" y2="180" stroke="#0b1220" stroke-width="1.5"/>
        <text x="10" y="184" font-size="10">0</text>
        <text x="5" y="144" font-size="10">100</text>
        <text x="5" y="104" font-size="10">200</text>
        <text x="5" y="64" font-size="10">300</text>
        <text x="5" y="24" font-size="10">400</text>
        <line x1="38" y1="140" x2="42" y2="140" stroke="#0b1220"/>
        <line x1="38" y1="100" x2="42" y2="100" stroke="#0b1220"/>
        <line x1="38" y1="60" x2="42" y2="60" stroke="#0b1220"/>
        <line x1="38" y1="20" x2="42" y2="20" stroke="#0b1220"/>
        <rect x="60" y="120" width="40" height="60" fill="#4de87a"/>
        <rect x="120" y="100" width="40" height="80" fill="#4de87a"/>
        <rect x="180" y="60" width="40" height="120" fill="#c8a96e"/>
        <rect x="240" y="80" width="40" height="100" fill="#4de87a"/>
        <text x="65" y="195" font-size="11">Oca</text>
        <text x="125" y="195" font-size="11">Şub</text>
        <text x="187" y="195" font-size="11">Mar</text>
        <text x="247" y="195" font-size="11">Nis</text>
        <text x="68" y="115" font-size="10">150</text>
        <text x="128" y="95" font-size="10">200</text>
        <text x="188" y="55" font-size="10">300</text>
        <text x="248" y="75" font-size="10">250</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Mart sütunu $300$ değerine ulaşıyor.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) 300 adet</span></div>
    </div>
  </div>

  <!-- Problem 9 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 9</span>
      <span class="ales-prob-type">Toplam Hesabı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki grafiğe göre <strong>4 ay toplam</strong> satış kaç adettir?<br><br>
      <strong>A)</strong> <span class="key">900</span> &nbsp; <strong>B)</strong> 899 &nbsp; <strong>C)</strong> 901 &nbsp; <strong>D)</strong> 898 &nbsp; <strong>E)</strong> 902
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">$150 + 200 + 300 + 250 = 900$.</p>
      <p class="ales-sol-step"><strong>Hız ipucu:</strong> Çiftleri eşleştir — $(150+250) + (200+300) = 400 + 500 = 900$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 900</span></div>
    </div>
  </div>

  <!-- Problem 10 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 10</span>
      <span class="ales-prob-type">Yüzde Değişim</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aynı grafikte <strong>Şubat'tan Mart'a</strong> satışlar yüzde kaç <strong>artmıştır</strong>?<br><br>
      <strong>A)</strong> %33 &nbsp; <strong>B)</strong> %25 &nbsp; <strong>C)</strong> %40 &nbsp; <strong>D)</strong> <span class="key">%50</span> &nbsp; <strong>E)</strong> %100
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Yüzde değişim formülü:</strong> $\\%\\Delta = \\dfrac{\\text{yeni} - \\text{eski}}{\\text{eski}} \\times 100$.</p>
      <p class="ales-sol-step">$\\dfrac{300 - 200}{200} \\times 100 = \\dfrac{100}{200} \\times 100 = 50\\%$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) %50 artış</span></div>
    </div>
  </div>

  <!-- Problem 11 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 11</span>
      <span class="ales-prob-type">Çizgi — Maksimum</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki çizgi grafik bir öğrencinin haftalık deneme sınavı netlerini göstermektedir. <strong>En yüksek</strong> net hangi haftadadır ve kaçtır?<br><br>
      <strong>A)</strong> H4 — 72 net &nbsp; <strong>B)</strong> H5 — 68 net &nbsp; <strong>C)</strong> <span class="key">H6 — 75 net</span> &nbsp; <strong>D)</strong> H3 — 65 net &nbsp; <strong>E)</strong> H1 — 50 net
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 340 220" width="340" height="220" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="20" x2="40" y2="180" stroke="#0b1220" stroke-width="1.5"/>
        <line x1="40" y1="180" x2="320" y2="180" stroke="#0b1220" stroke-width="1.5"/>
        <text x="20" y="184" font-size="10">40</text>
        <text x="20" y="144" font-size="10">50</text>
        <text x="20" y="104" font-size="10">60</text>
        <text x="20" y="64" font-size="10">70</text>
        <text x="20" y="24" font-size="10">80</text>
        <polyline points="60,140 110,120 160,80 210,52 260,68 310,40" fill="none" stroke="#c8a96e" stroke-width="2.5"/>
        <circle cx="60"  cy="140" r="4" fill="#c8a96e"/>
        <circle cx="110" cy="120" r="4" fill="#c8a96e"/>
        <circle cx="160" cy="80"  r="4" fill="#c8a96e"/>
        <circle cx="210" cy="52"  r="4" fill="#c8a96e"/>
        <circle cx="260" cy="68"  r="4" fill="#c8a96e"/>
        <circle cx="310" cy="40"  r="4" fill="#c8a96e"/>
        <text x="50" y="195" font-size="10">H1</text>
        <text x="100" y="195" font-size="10">H2</text>
        <text x="150" y="195" font-size="10">H3</text>
        <text x="200" y="195" font-size="10">H4</text>
        <text x="250" y="195" font-size="10">H5</text>
        <text x="300" y="195" font-size="10">H6</text>
        <text x="48" y="135" font-size="9">50</text>
        <text x="98" y="115" font-size="9">55</text>
        <text x="148" y="75" font-size="9">65</text>
        <text x="198" y="47" font-size="9">72</text>
        <text x="248" y="63" font-size="9">68</text>
        <text x="298" y="35" font-size="9">75</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Noktalar: 50, 55, 65, 72, 68, 75. En yüksek değer <strong>75</strong>, <strong>6. hafta</strong>'da.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 6. hafta — 75 net</span></div>
    </div>
  </div>

  <!-- Problem 12 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 12</span>
      <span class="ales-prob-type">En Büyük Düşüş</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki grafikte <strong>iki ardışık hafta arasındaki en büyük düşüş</strong> kaç nettir ve hangi haftalar arasındadır?<br><br>
      <strong>A)</strong> H2 → H3, 10 net düşüş &nbsp; <strong>B)</strong> H3 → H4, 7 net düşüş &nbsp; <strong>C)</strong> H5 → H6, 7 net düşüş &nbsp; <strong>D)</strong> <span class="key">H4 → H5, 4 net düşüş</span> &nbsp; <strong>E)</strong> H1 → H2, 5 net düşüş
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ardışık farklar: H1→H2: $+5$, H2→H3: $+10$, H3→H4: $+7$, H4→H5: $\\mathbf{-4}$, H5→H6: $+7$.</p>
      <p class="ales-sol-step">Sadece bir negatif fark var: H4→H5 arasında <strong>4 net</strong> düşüş.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">D) H4 → H5, 4 net düşüş</span></div>
    </div>
  </div>

  <!-- Problem 13 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 13</span>
      <span class="ales-prob-type">Ortalama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki çizgi grafiğin <strong>haftalık ortalaması</strong> kaç nettir?<br><br>
      <strong>A)</strong> ≈ 62.50 &nbsp; <strong>B)</strong> ≈ 63.33 &nbsp; <strong>C)</strong> <span class="key">≈ 64.17</span> &nbsp; <strong>D)</strong> ≈ 65.00 &nbsp; <strong>E)</strong> ≈ 70.00
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Toplam: $50 + 55 + 65 + 72 + 68 + 75$.</p>
      <p class="ales-sol-step">Eşleştirerek topla: $(50+75) + (55+68) + (65+72) = 125 + 123 + 137 = 385$.</p>
      <p class="ales-sol-step">Ortalama: $\\dfrac{385}{6} \\approx 64.17$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) ≈ 64.17 net</span></div>
    </div>
  </div>

  <!-- Problem 14 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 14</span>
      <span class="ales-prob-type">Sentez — Yüzde Düşüş</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Bir mağazanın yıllık ciroları 2022: 800, 2023: 1000, 2024: 750 (bin TL). <strong>2023'ten 2024'e</strong> ciro yüzde kaç <strong>azalmıştır</strong>?<br><br>
      <strong>A)</strong> %20 &nbsp; <strong>B)</strong> %33 &nbsp; <strong>C)</strong> <span class="key">%25</span> &nbsp; <strong>D)</strong> %30 &nbsp; <strong>E)</strong> %50
    </div>
    <div class="ales-diagram">
      <svg viewBox="0 0 280 200" width="280" height="200" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="20" x2="40" y2="160" stroke="#0b1220" stroke-width="1.5"/>
        <line x1="40" y1="160" x2="270" y2="160" stroke="#0b1220" stroke-width="1.5"/>
        <text x="10" y="164" font-size="10">0</text>
        <text x="5" y="124" font-size="10">500</text>
        <text x="0" y="84" font-size="10">1000</text>
        <text x="0" y="44" font-size="10">1500</text>
        <rect x="70" y="96" width="50" height="64" fill="#4de87a"/>
        <rect x="140" y="80" width="50" height="80" fill="#c8a96e"/>
        <rect x="210" y="100" width="50" height="60" fill="#06b6d4"/>
        <text x="78" y="91" font-size="10">800</text>
        <text x="148" y="75" font-size="10">1000</text>
        <text x="222" y="95" font-size="10">750</text>
        <text x="78" y="178" font-size="11">2022</text>
        <text x="148" y="178" font-size="11">2023</text>
        <text x="218" y="178" font-size="11">2024</text>
      </svg>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Düşüş yüzdesi:</strong> $\\dfrac{\\text{eski} - \\text{yeni}}{\\text{eski}} \\times 100$.</p>
      <p class="ales-sol-step">$\\dfrac{1000 - 750}{1000} \\times 100 = \\dfrac{250}{1000} \\times 100 = 25\\%$.</p>
      <p class="ales-sol-step"><strong>Tuzak:</strong> Düşüşte payda <em>eski</em> (büyük) değerdir. $750$'yi payda yaparsan yanlış olur.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) %25 azalış</span></div>
    </div>
  </div>
</section>


<!-- ============================================================
     ALT KONU 1.3 — Çift Değişkenli Tablo Problemleri
     ============================================================ -->
<section class="ales-subtopic">
  <div class="ales-sub-head">
    <span class="ales-sub-num">1.3</span>
    <h2 class="ales-sub-title">Çift Değişkenli Tablo Problemleri</h2>
  </div>

  <!-- Problem 15 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 15</span>
      <span class="ales-prob-type">Hücre Okuma</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki tablo bir okulun sınıf-cinsiyet dağılımıdır. <strong>9. sınıftaki kız</strong> öğrenci sayısı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">60</span> &nbsp; <strong>B)</strong> 59 &nbsp; <strong>C)</strong> 61 &nbsp; <strong>D)</strong> 58 &nbsp; <strong>E)</strong> 62
    </div>
    <div class="ales-diagram">
      <table>
        <thead>
          <tr><th>Sınıf</th><th>Kız</th><th>Erkek</th><th>Toplam</th></tr>
        </thead>
        <tbody>
          <tr><td>9. Sınıf</td><td><strong>60</strong></td><td>50</td><td>110</td></tr>
          <tr><td>10. Sınıf</td><td>55</td><td>65</td><td>120</td></tr>
          <tr><td>11. Sınıf</td><td>40</td><td>60</td><td>100</td></tr>
          <tr><td>12. Sınıf</td><td>45</td><td>55</td><td>100</td></tr>
          <tr><td><strong>Toplam</strong></td><td><strong>200</strong></td><td><strong>230</strong></td><td><strong>430</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Satır = 9. Sınıf, sütun = Kız. Kesişim hücresi: <strong>60</strong>.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 60</span></div>
    </div>
  </div>

  <!-- Problem 16 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 16</span>
      <span class="ales-prob-type">Sütun Toplamı</span>
      <span class="ales-prob-difficulty easy">Kolay</span>
    </div>
    <div class="ales-prob-text">
      Aynı tabloya göre <strong>tüm okulda kaç kız öğrenci</strong> vardır?<br><br>
      <strong>A)</strong> 190 &nbsp; <strong>B)</strong> 195 &nbsp; <strong>C)</strong> <span class="key">200</span> &nbsp; <strong>D)</strong> 210 &nbsp; <strong>E)</strong> 230
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kız sütununu topla: $60 + 55 + 40 + 45$.</p>
      <p class="ales-sol-step">$60 + 55 = 115$, $40 + 45 = 85$, toplam $115 + 85 = 200$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) 200 kız</span></div>
    </div>
  </div>

  <!-- Problem 17 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 17</span>
      <span class="ales-prob-type">Eksik Hücre</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki eksik tabloda <strong>?</strong> ile gösterilen hücre kaçtır?<br><br>
      <strong>A)</strong> 34 &nbsp; <strong>B)</strong> 36 &nbsp; <strong>C)</strong> 33 &nbsp; <strong>D)</strong> 37 &nbsp; <strong>E)</strong> <span class="key">35</span>
    </div>
    <div class="ales-diagram">
      <table>
        <thead><tr><th>Şube</th><th>Erkek</th><th>Kadın</th><th>Toplam</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>30</td><td>20</td><td>50</td></tr>
          <tr><td>B</td><td>?</td><td>25</td><td>60</td></tr>
          <tr><td>C</td><td>40</td><td>30</td><td>70</td></tr>
          <tr><td><strong>Toplam</strong></td><td><strong>105</strong></td><td><strong>75</strong></td><td><strong>180</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Satır Yöntemi</div>
      <p class="ales-sol-step">B satırı: Erkek + Kadın = Toplam ⟹ $? + 25 = 60 \\Rightarrow ? = 35$.</p>
    </div>
    <div class="ales-alt-method">
      <div class="ales-alt-label">Alternatif — Sütun Yöntemi</div>
      <p class="ales-sol-step">Erkek sütunu toplam: $30 + ? + 40 = 105 \\Rightarrow ? = 35$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">E) 35</span></div>
    </div>
  </div>

  <!-- Problem 18 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 18</span>
      <span class="ales-prob-type">Koşullu Yüzde</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki <strong>180 kişilik</strong> tabloda <strong>kadın olanların yüzdesi</strong> kaçtır?<br><br>
      <strong>A)</strong> ≈ %33.33 &nbsp; <strong>B)</strong> ≈ %40.00 &nbsp; <strong>C)</strong> <span class="key">≈ %41.67</span> &nbsp; <strong>D)</strong> ≈ %50.00 &nbsp; <strong>E)</strong> ≈ %58.33
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Kadın toplam = 75, genel toplam = 180.</p>
      <p class="ales-sol-step">$\\dfrac{75}{180} \\times 100$. Sadeleştir: $\\dfrac{75}{180} = \\dfrac{5}{12}$.</p>
      <p class="ales-sol-step">$\\dfrac{5}{12} \\times 100 = \\dfrac{500}{12} \\approx 41.67\\%$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) ≈ %41.67</span></div>
    </div>
  </div>

  <!-- Problem 19 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 19</span>
      <span class="ales-prob-type">Ortalama</span>
      <span class="ales-prob-difficulty medium">Orta</span>
    </div>
    <div class="ales-prob-text">
      Aşağıdaki tablo 3 öğrencinin 4 dersten aldığı notları gösterir. <strong>Ahmet</strong>'in <strong>not ortalaması</strong> kaçtır?<br><br>
      <strong>A)</strong> 74 &nbsp; <strong>B)</strong> <span class="key">75</span> &nbsp; <strong>C)</strong> 76 &nbsp; <strong>D)</strong> 73 &nbsp; <strong>E)</strong> 77
    </div>
    <div class="ales-diagram">
      <table>
        <thead><tr><th>Öğrenci</th><th>Mat</th><th>Fiz</th><th>Kim</th><th>Bio</th></tr></thead>
        <tbody>
          <tr><td><strong>Ahmet</strong></td><td>80</td><td>70</td><td>90</td><td>60</td></tr>
          <tr><td>Ayşe</td><td>85</td><td>95</td><td>80</td><td>90</td></tr>
          <tr><td>Mert</td><td>60</td><td>75</td><td>70</td><td>85</td></tr>
        </tbody>
      </table>
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step">Ahmet'in toplamı: $80 + 70 + 90 + 60$.</p>
      <p class="ales-sol-step">Eşleştir: $(80+70) + (90+60) = 150 + 150 = 300$.</p>
      <p class="ales-sol-step">Ortalama $= \\dfrac{300}{4} = 75$.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">B) 75</span></div>
    </div>
  </div>

  <!-- Problem 20 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 20</span>
      <span class="ales-prob-type">Koşullu Sayma</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki tabloda <strong>en az bir derste 90 ve üzeri not alan</strong> öğrenci sayısı kaçtır?<br><br>
      <strong>A)</strong> <span class="key">2</span> &nbsp; <strong>B)</strong> 1 &nbsp; <strong>C)</strong> 3 &nbsp; <strong>D)</strong> 0 &nbsp; <strong>E)</strong> 4
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm — Satır Satır Tara</div>
      <p class="ales-sol-step"><strong>Ahmet:</strong> 80, 70, <strong>90</strong>, 60 → 90 var ✓</p>
      <p class="ales-sol-step"><strong>Ayşe:</strong> 85, <strong>95</strong>, 80, <strong>90</strong> → 90+ var ✓</p>
      <p class="ales-sol-step"><strong>Mert:</strong> 60, 75, 70, 85 → 90+ yok ✗</p>
      <p class="ales-sol-step">Sayım: 2 öğrenci.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">A) 2</span></div>
    </div>
  </div>

  <!-- Problem 21 -->
  <div class="ales-problem">
    <div class="ales-prob-head">
      <span class="ales-prob-n">Problem 21</span>
      <span class="ales-prob-type">Sentez — En Yüksek Ortalama</span>
      <span class="ales-prob-difficulty hard">Zor</span>
    </div>
    <div class="ales-prob-text">
      Yukarıdaki tabloda <strong>hangi öğrencinin not ortalaması en yüksektir</strong> ve bu ortalama kaçtır?<br><br>
      <strong>A)</strong> Ahmet — 75 &nbsp; <strong>B)</strong> Mert — 72.5 &nbsp; <strong>C)</strong> <span class="key">Ayşe — 87.5</span> &nbsp; <strong>D)</strong> Ayşe — 80 &nbsp; <strong>E)</strong> Ahmet — 85
    </div>
    <div class="ales-sol">
      <div class="ales-sol-label">Çözüm</div>
      <p class="ales-sol-step"><strong>Ahmet:</strong> $80+70+90+60 = 300 \\Rightarrow$ ort. $75$.</p>
      <p class="ales-sol-step"><strong>Ayşe:</strong> $85+95+80+90 = 350 \\Rightarrow$ ort. $87.5$.</p>
      <p class="ales-sol-step"><strong>Mert:</strong> $60+75+70+85 = 290 \\Rightarrow$ ort. $72.5$.</p>
      <p class="ales-sol-step"><strong>Hız ipucu:</strong> 4'e bölmek yerine sadece toplamları karşılaştır — en büyük toplam = en büyük ortalama.</p>
      <div class="ales-sol-answer">Cevap: <span class="key">C) Ayşe — 87.5</span></div>
    </div>
  </div>
</section>
`
};
