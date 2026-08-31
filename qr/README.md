# QR Menü — Hisarönü Tantuni Yakup Usta

Konak ve Bostanlı şubeleri için görüntüleme amaçlı QR menü sayfaları.

- `/qr/konak/` — Konak şubesi (QR #1)
- `/qr/bostanli/` — Bostanlı şubesi (QR #2)
- `/qr/` — şube seçim sayfası

Sipariş, sepet veya ödeme içermez.

**Build adımı yok.** Sitenin geri kalanıyla aynı teknoloji: düz HTML + CSS + JS.
Dosyayı düzenleyip commit'lediğinizde yayına girer.

## Dosyalar

```
qr/
├── index.html              şube seçim sayfası
├── konak/index.html        Konak sayfası
├── bostanli/index.html     Bostanlı sayfası
├── css/qr-menu.css         tüm stiller
├── kontrol.js              veri + sürüm damgası kontrolü
├── surum.js                önbellek kırıcı ?v= damgasını günceller
└── js/
    ├── menu-verisi.js      ORTAK: ürünler, fiyatlar, çeviriler
    ├── sube-konak.js       Konak adres/telefon/saat
    ├── sube-bostanli.js    Bostanlı adres/telefon/saat
    └── qr-menu.js          menüyü çizer, sekme/dil/tema
```

İki şube sayfası birbirinin aynısı; yalnızca dört satırda ayrışıyorlar (başlık,
açıklama, `h1` ve yükledikleri `sube-*.js` dosyası).

Görseller ana sitenin `images/menu/` klasöründen okunuyor — kopya yok, bir
görseli değiştirmek her iki sayfaya da anında yansır.

## Fiyat veya ürün güncelleme

1. `qr/js/menu-verisi.js` dosyasını açın. **Tek kaynak burası** — her iki şube
   sayfası da bu dosyadan besleniyor.
2. Fiyatı değiştirin. Tantuni ürünlerinde `porsiyonlarKur(tek, içiBol)`,
   içeceklerde `fiyat:` alanı.
3. Fiyat değişim tarihini güncelleyin: dosyanın başındaki
   `FIYAT_DEGISIM_TARIHI`.
4. Repo kökünden kontrol edin:

   ```
   node qr/kontrol.js
   ```

   Bayat sürüm damgası varsa uyarır. O zaman:

   ```
   node qr/surum.js
   ```

5. Commit'leyip push'layın (damga değiştiyse HTML dosyaları da değişmiştir):

   ```
   git add qr
   git commit -m "Menu: fiyat guncellemesi"
   git push
   ```

Build almanız gerekmez, kopyalanacak çıktı yoktur.

### Neden sürüm damgası var

GitHub Pages dosyaları `Cache-Control: max-age=600` ile servis ediyor ve dosya
adlarımız hiç değişmiyor. Sayfayı bir kez açmış bir ziyaretçinin tarayıcısı
`qr-menu.js` ve `qr-menu.css`'i önbellekte tutar — siz fiyatı değiştirip
yayınlasanız bile o kişi bir süre **eski fiyatı görmeye devam edebilir.**

`node qr/surum.js` her css/js dosyasının içeriğinden kısa bir özet çıkarıp
HTML'deki bağlantıya `?v=...` olarak yazıyor. İçerik değişince adres de
değişiyor, tarayıcı dosyayı yeniden indiriyor.

`node qr/kontrol.js` damgaların bayat olup olmadığını da denetler, yani
unutursanız yakalanır.

**Not:** damga yalnızca css ve js için var. Bir ürün fotoğrafını **aynı adla**
değiştirirseniz ziyaretçiler bir süre eski fotoğrafı görebilir; yeni fotoğrafa
farklı bir dosya adı verip `menu-verisi.js` içindeki yolu güncellemek en
temizi.

## Şube bilgisi güncelleme

Adres, telefon veya çalışma saati değişirse `qr/js/sube-konak.js` ya da
`qr/js/sube-bostanli.js` dosyasını düzenleyin.

Adresi değiştirirseniz `mapsUrl` içindeki adres metnini de aynı şekilde
güncelleyin — Google Maps linki oradan kuruluyor.

Şube adı ya da başlığı değişirse ilgili sayfanın `index.html` dosyasındaki
`<title>`, `<meta name="description">` ve `<h1>` metinlerini de elle güncelleyin;
bunlar JavaScript kapalıyken de görünsün diye HTML'e yazılı.

## Ürün ekleme

`menu-verisi.js` içinde ilgili diziye (`ET_URUNLERI`, `TAVUK_URUNLERI` veya
`ICECEKLER`) yeni bir kayıt ekleyin. Görseli önce `images/menu/` klasörüne
koyun. `node qr/kontrol.js` görselin gerçekten var olduğunu doğrular.

## Fotoğraf büyütme

Ürün fotoğrafına dokununca büyük hali koyu bir katman üzerinde açılır. Kapatma:
sağ üstteki X, görselin dışına dokunma veya `Esc`.

Fotoğraflar `<button>` içine sarılıyor — ekran okuyucu ve klavye kullanıcısı
tıklanabilir olduğunu böyle anlıyor. Katman `qr/js/qr-menu.js` içinde bir kez
kurulup `<body>`ye ekleniyor, ekstra kütüphane yok.

Yeni bir ürün eklediğinizde ayrıca bir şey yapmanız gerekmez; fotoğraf
büyütme tüm ürünlere kendiliğinden uygulanır.

## Stil değiştirirken dikkat

Kategori sekmelerinin filtresi tamamen CSS ile çalışıyor: JavaScript yalnızca
`#paneller` üzerindeki `data-aktif` değerini değiştiriyor, panelleri gösterip
gizleyen `qr/css/qr-menu.css`.

Bu üç kural bu sırayla ve bu özgüllükte kalmalı:

```css
.panel                              { display: grid; }   /* JS kapalı: hepsi açık */
.paneller[data-aktif] .panel        { display: none; }   /* JS açık: hepsi gizli */
.paneller[data-aktif="et"] #panel-et { display: grid; }  /* seçili olan geri açılır */
```

Panellere **id ile** (`#panel-et { ... }`) düzen kuralı yazmayın. Id özgüllüğü
(0,1,0,0) gizleme kuralını (0,0,3,0) ezer; üç panel birden açık kalır ve sayfa
hep ilk kategoride takılı kalmış gibi görünür — sekmeler tıklanır, `data-aktif`
değişir, ama hiçbir şey olmaz. Düzen için `.urun-listesi` ve `.icecek-listesi`
sınıflarını kullanın.

## Diller

Çevrilenler: ürün adları, açıklamalar, porsiyon etiketleri, kategori adları,
çalışma saatleri, arayüz metinleri.

**Çevrilmeyen tek şey adres.** Tabelada ve haritada yazdığı gibi görünmesi
gerekiyor; ziyaretçi taksiciye ya da haritaya bu metni gösteriyor.

Metin alanlarının hepsi `{ tr: '...', en: '...' }` biçiminde. Marka adlarında
(Fanta, Sprite, Ice Tea) iki dil aynı, bu normaldir.

Ziyaretçinin tarayıcı dili İngilizce ise sayfa İngilizce açılır; seçim
tarayıcıda hatırlanır.

Yeni ürün eklerken `en` alanını doldurmayı unutmayın — `node qr/kontrol.js`
boş çeviriyi yakalar, ama Türkçe metnin İngilizce alanına yapıştırılmasını
yalnızca açıklamalarda yakalayabilir (ürün adlarında marka adları yüzünden
aynı olmak meşru).

## JavaScript kapalıysa

Menü tarayıcıda çiziliyor, çünkü build adımı olmadan fiyatları tek dosyada
tutmanın başka yolu yok. JavaScript kapalıysa sayfa bir uyarı gösterip ana
sitedeki `menu.html` sayfasına yönlendirir. Pratikte QR okutan telefonların
hepsinde JavaScript açıktır.

## Yayına almadan önce elle kontrol

Otomatik kontrol veriyi doğruluyor, gerçek telefonda nasıl göründüğünü değil.
Büyük bir değişiklikten sonra bunları elle geçin.

Tarayıcıyı **375px genişliğe** daraltın (Chrome/Edge: F12 → cihaz araç çubuğu)
ve `/qr/konak/` sayfasını açın:

- [ ] Sayfa yatay kaymıyor
- [ ] Üç sekme de tam görünüyor; "İçecekler" kırpılmıyor
- [ ] Kategori sekmeleri yukarıda sabit kalıyor
- [ ] "İçecekler"e basınca yalnızca içecekler görünüyor
- [ ] Sol/sağ ok tuşlarıyla sekmeler arasında geçiliyor
- [ ] "EN"e basınca açıklamalar ve sekme adları İngilizce oluyor
- [ ] EN modunda ürün adları da İngilizce ("Beef Wrap", "Turnip Juice")
- [ ] EN modunda çalışma saatleri İngilizce ("Daily ...")
- [ ] EN modunda adres Türkçe kalıyor (bilerek böyle)
- [ ] Tema düğmesi karanlık moda geçiriyor
- [ ] Sayfayı yenileyince dil ve tema seçimi korunuyor
- [ ] Fiyatlar okunaklı, ürün görselleri yükleniyor
- [ ] Ürün fotoğrafına dokununca büyüyor; X, dışına dokunma ve `Esc` kapatıyor

Bir şey güncellemediği halde eski görünüyorsa **önce sert yenileme yapın**
(`Ctrl+Shift+R`, telefonda sekmeyi kapatıp açın). Sürüm damgası bunu
önlüyor ama siz damgayı güncellemeden yayınladıysanız tarayıcı eski dosyayı
tutuyor olabilir.

`/qr/bostanli/` sayfasında:

- [ ] Bostanlı adresi, telefonu ve saatleri görünüyor
- [ ] Konak'a ait hiçbir bilgi görünmüyor

`/qr/` sayfasında:

- [ ] İki şube kartı da görünüyor, linkler doğru sayfayı açıyor

En az bir kez **gerçek bir telefondan**, basılı QR kodu okutarak bakın —
telefon numarasına dokununca arama başlamalı, adrese dokununca Google Maps
doğru şubeyi göstermeli. Bu ikisi masaüstü tarayıcıda tam doğrulanamaz.
