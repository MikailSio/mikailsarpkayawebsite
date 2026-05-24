"""Second-pass: fix compound and conjugated TR words missed by first pass."""
import re
from pathlib import Path

PAIRS = [
    ("birlestirecegnizi", "birleştireceğinizi"),
    ("birlestirecegniz", "birleştireceğiniz"),
    ("sekillendirecegnizi", "şekillendireceğinizi"),
    ("sekillendirecegniz", "şekillendireceğiniz"),
    ("birlestirmek", "birleştirmek"),
    ("birlestirmeler", "birleştirmeler"),
    ("birlestirme", "birleştirme"),
    ("birlestir", "birleştir"),

    ("ogretir", "öğretir"),
    ("ogretmek", "öğretmek"),
    ("ogrenec", "öğrenec"),  # öğreneceksiniz, öğrenecek
    ("ogretiyor", "öğretiyor"),

    ("duydugu", "duyduğu"),
    ("oldugu", "olduğu"),
    ("olduguna", "olduğuna"),
    ("oldugunda", "olduğunda"),
    ("varsa", "varsa"),  # no change
    ("gerekirse", "gerekirse"),  # no change
    ("yoksa", "yoksa"),  # no change

    ("islemlerdir", "işlemlerdir"),
    ("islemler", "işlemler"),
    ("islemleri", "işlemleri"),
    ("islem", "işlem"),
    ("Islem", "İşlem"),

    ("tablolari", "tabloları"),
    ("depolari", "depoları"),
    ("kaynaklari", "kaynakları"),

    ("hazir", "hazır"),
    ("Hazir", "Hazır"),

    ("nasil", "nasıl"),
    ("Nasil", "Nasıl"),

    ("yapilan", "yapılan"),
    ("yapildig", "yapıldığ"),
    ("yapmak", "yapmak"),  # no change

    ("baglan", "bağlan"),
    ("baglant", "bağlant"),
    ("baglar", "bağlar"),
    ("baglar", "bağlar"),

    ("sekiller", "şekiller"),
    ("sekilde", "şekilde"),
    ("Sekilde", "Şekilde"),

    ("herseyi", "her şeyi"),
    ("herseyin", "her şeyin"),

    ("hangisi", "hangisi"),  # no change
    ("hangileri", "hangileri"),  # no change

    ("kontrolu", "kontrolü"),

    ("uretebilir", "üretebilir"),
    ("uretmek", "üretmek"),
    ("uretim", "üretim"),
    ("uretici", "üretici"),
    ("uretici", "üretici"),

    ("verecegi", "vereceği"),

    ("alir", "alır"),
    ("alirim", "alırım"),
    ("alirsiniz", "alırsınız"),
    ("alirken", "alırken"),

    ("sectiginiz", "seçtiğiniz"),
    ("seciminiz", "seçiminiz"),
    ("secim", "seçim"),
    ("Secim", "Seçim"),

    ("ozelle", "özelle"),
    ("ozellestir", "özelleştir"),

    ("dusunce", "düşünce"),
    ("dusunceler", "düşünceler"),

    ("kullanici", "kullanıcı"),
    ("Kullanici", "Kullanıcı"),

    ("calismak", "çalışmak"),
    ("calismakta", "çalışmakta"),
    ("calistig", "çalıştığ"),

    ("anlamlandirma", "anlamlandırma"),
    ("anlamlandir", "anlamlandır"),

    ("anlatim", "anlatım"),
    ("anlatir", "anlatır"),

    ("tasimak", "taşımak"),
    ("tasiyan", "taşıyan"),
    ("tasir", "taşır"),

    ("yagis", "yağış"),

    ("birakir", "bırakır"),
    ("birakmak", "bırakmak"),
    ("birakilan", "bırakılan"),

    ("acik", "açık"),
    ("Acik", "Açık"),
    ("aciklamali", "açıklamalı"),
    ("aciklamak", "açıklamak"),
    ("aciklayici", "açıklayıcı"),

    ("dilegi", "dileği"),  # rare
    ("dilemek", "dilemek"),  # no change

    ("genis", "geniş"),
    ("genisle", "genişle"),

    ("yuksek", "yüksek"),
    ("Yuksek", "Yüksek"),

    ("dusuk", "düşük"),
    ("Dusuk", "Düşük"),

    ("orta", "orta"),  # no change

    ("zihinsel", "zihinsel"),  # no change

    ("uzerine", "üzerine"),
    ("uzerinde", "üzerinde"),
    ("Uzerine", "Üzerine"),
    ("Uzerinde", "Üzerinde"),
    ("uzerinden", "üzerinden"),

    ("gore", "göre"),
    ("Gore", "Göre"),

    ("benzer", "benzer"),  # no change

    ("dogru", "doğru"),
    ("Dogru", "Doğru"),

    ("yanlis", "yanlış"),
    ("Yanlis", "Yanlış"),

    ("yanli", "yanlı"),

    ("oturdu", "oturdu"),  # no change

    ("turetilen", "türetilen"),
    ("turetilmis", "türetilmiş"),
    ("turettigi", "türettiği"),

    ("guncelle", "güncelle"),
    ("guncelleme", "güncelleme"),
    ("guncellenen", "güncellenen"),

    ("gostergesi", "göstergesi"),
    ("gostergeleri", "göstergeleri"),

    ("guvenli", "güvenli"),
    ("Guvenli", "Güvenli"),
    ("guvenlik", "güvenlik"),
    ("guvence", "güvence"),

    # corrections to first pass typos
    ("birlestime", "birleştirme"),

    # add: dogu, dogur, etc.
    ("dogur", "doğur"),
    ("doguran", "doğuran"),
    ("dogus", "doğuş"),

    # arasinda
    ("arasinda", "arasında"),
    ("arasindaki", "arasındaki"),
    ("Arasinda", "Arasında"),

    ("ozet", "özet"),
    ("Ozet", "Özet"),

    ("ozellik", "özellik"),
    ("ozellikle", "özellikle"),
    ("Ozellikle", "Özellikle"),

    ("uzun", "uzun"),  # no change

    ("kayit", "kayıt"),
    ("Kayit", "Kayıt"),
    ("kayitlar", "kayıtlar"),
    ("kayitli", "kayıtlı"),

    ("kullanim", "kullanım"),
    ("kullanima", "kullanıma"),
    ("kullanimi", "kullanımı"),
    ("kullanimi", "kullanımı"),

    # cikar
    ("cikar", "çıkar"),
    ("cikarir", "çıkarır"),
    ("cikarmak", "çıkarmak"),
    ("cikardik", "çıkardık"),
    ("cikartmak", "çıkartmak"),

    # cok
    ("cok", "çok"),
    ("Cok", "Çok"),
    ("cokca", "çokça"),

    # eger
    ("eger", "eğer"),
    ("Eger", "Eğer"),

    # iyi
    ("iyi", "iyi"),  # no change

    # ihtimal
    ("ihtimal", "ihtimal"),  # no change
    ("ihtimalle", "ihtimalle"),

    # nicin
    ("nicin", "niçin"),
    ("Nicin", "Niçin"),
    ("nedenleri", "nedenleri"),  # no change

    # tasit
    ("tasit", "taşıt"),

    # cesit
    ("cesit", "çeşit"),
    ("cesitli", "çeşitli"),
    ("cesitliligi", "çeşitliliği"),

    # tipinde
    ("tipinde", "tipinde"),  # no change

    # vurgu
    ("vurgu", "vurgu"),  # no change
    ("vurgular", "vurgular"),
    ("vurgulu", "vurgulu"),

    # tablonun
    ("tablonun", "tablonun"),  # no change

    # ulasmak
    ("ulasmak", "ulaşmak"),
    ("ulasir", "ulaşır"),
    ("ulasilan", "ulaşılan"),

    # gelir
    ("gelir", "gelir"),  # no change

    # icin (very common)
    ("icin", "için"),
    ("Icin", "İçin"),

    # iceren
    ("iceren", "içeren"),
    ("iceriyor", "içeriyor"),
    ("icerigi", "içeriği"),
    ("icerige", "içeriğe"),
    ("icerik", "içerik"),
    ("Icerik", "İçerik"),

    # opsiyonel
    ("opsiyonel", "opsiyonel"),  # no change

    # her, kim — no change

    # acm vs acim — careful
    ("acim", "açım"),

    # gostermek mostly handled

    # ekleme
    ("eklem", "eklem"),  # no change for joint
    ("ekleme", "ekleme"),  # no change for adding

    # cikis
    ("cikis", "çıkış"),
    ("Cikis", "Çıkış"),

    # giris
    ("giris", "giriş"),
    ("Giris", "Giriş"),

    # parca
    ("parca", "parça"),
    ("Parca", "Parça"),
    ("parcali", "parçalı"),
    ("parcalama", "parçalama"),

    # gec, ger
    ("gec", "geç"),  # WAIT - this is risky because "Geçen" might match
    # actually "gec" alone as standalone word is rare; leave conjugations
    ("gecirmek", "geçirmek"),
    ("gectigi", "geçtiği"),
    ("gecmek", "geçmek"),
    ("gecmis", "geçmiş"),

    ("gercek", "gerçek"),
    ("Gercek", "Gerçek"),

    # surec
    ("surec", "süreç"),
    ("surecler", "süreçler"),
    ("Surec", "Süreç"),

    # ureti
    ("uret", "üret"),
    ("Uret", "Üret"),

    # ucret
    ("ucret", "ücret"),
    ("Ucret", "Ücret"),
    ("ucretli", "ücretli"),
    ("ucretsiz", "ücretsiz"),

    # tek
    ("tek", "tek"),  # no change

    # tum
    ("tum", "tüm"),
    ("Tum", "Tüm"),

    # buyumeyle
    ("buyume", "büyüme"),
    ("buyumesi", "büyümesi"),

    # cesitli
    ("cesit", "çeşit"),

    # hicbiri
    ("hicbiri", "hiçbiri"),
    ("hicbirinin", "hiçbirinin"),

    # birsey
    ("birsey", "bir şey"),
    ("birseyi", "bir şeyi"),
]

def fix(path: Path):
    txt = path.read_text(encoding='utf-8')
    original = txt
    cnt = 0
    for bad, good in PAIRS:
        if bad == good:
            continue
        pat = r'\b' + re.escape(bad) + r'\b'
        new_txt, n = re.subn(pat, good, txt)
        if n:
            cnt += n
            txt = new_txt
    if txt != original:
        path.write_text(txt, encoding='utf-8')
        return cnt
    return 0

ROOT = Path(r"E:\web\mikailsarpkaya.com\tutorials")
targets = ["pandas/L1.js", "pandas/L2.js", "pandas/L6.js"]
for t in targets:
    p = ROOT / t
    if p.exists():
        n = fix(p)
        print(f"  {t}: {n} replacements")
