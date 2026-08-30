# QR Menü — Hisarönü Tantuni Yakup Usta

Konak ve Bostanlı şubeleri için görüntüleme amaçlı QR menü sayfaları.

- `/qr/konak/` — Konak şubesi (QR #1)
- `/qr/bostanli/` — Bostanlı şubesi (QR #2)
- `/qr/` — şube seçim sayfası

Sipariş, sepet veya ödeme içermez.

## Geliştirme

Aşağıdaki komutlar `qr-menu/` klasöründen çalıştırılır:

```
npm install
npm run dev      # http://localhost:3000/qr/konak/
npm test         # veri ve bileşen testleri
```

### Komutları PowerShell'den çalıştırın, Git Bash'ten değil

Bu projenin yolu Türkçe karakter içeriyor (`Masaüstü`). Git Bash, bu yolda
vitest'in worker sürecini başlatamıyor: komut 60 saniye takılıyor ve **sıfır
test çalıştırıyor**. Hata vermediği için testler geçmiş gibi görünebilir.

`npm run build` de etkileniyor, çünkü `prebuild` adımı vitest çalıştırıyor.

PowerShell'de sorun yok:

```
Set-Location 'C:\Users\sengu\OneDrive\Masaüstü\tantuni\qr-menu'
npm run build
```

Bir test koşusunun sağlıklı olduğunu dosya sayısından anlarsınız: **7 test
dosyası / 72 test**. Daha az dosya çalıştıysa koşu yarım kalmıştır, tekrar
çalıştırın.

`npm run build` yaklaşık **155 saniye** sürer (önce testler, sonra derleme).
Takıldığını düşünüp yarıda kesmeyin.

## Fiyat veya ürün güncelleme

1. `data/menu.ts` içinde fiyatı/ürünü değiştir — burası tek kaynak,
   her iki şube sayfasına da otomatik yansır.
2. Fiyat değişim tarihini güncelle: `FIYAT_DEGISIM_TARIHI`.
3. `npm run build` — testler önce çalışır, bozuk veri build'i durdurur.
   Build çıktısı otomatik olarak repo kökündeki `qr/` klasörüne kopyalanır.
4. `qr/` klasörünü commit'le ve push'la.

**Önemli:** `qr/` klasörü build çıktısıdır, elle düzenlenmez. Build alıp
commit'lemeyi unutursanız yayındaki site eski fiyatı göstermeye devam eder.

## Şube bilgisi güncelleme

Adres, telefon veya çalışma saati değişirse `data/subeler/konak.ts` ya da
`data/subeler/bostanli.ts` dosyasını düzenleyin, sonra yukarıdaki build
adımlarını tekrarlayın.

## Görseller

`qr-menu/public/images/menu/` altındaki dosyalar repo kökündeki
`images/menu/` klasörünün kopyasıdır. Ana sitede bir görsel değişirse
buraya da kopyalanmalı — bu komut **repo kökünden** çalıştırılır:

```
cp images/menu/*.webp qr-menu/public/images/menu/
cp images/logo.webp qr-menu/public/images/logo.webp
```

Sonra yukarıdaki build adımlarını tekrarlayın, yoksa yayındaki sayfalar eski
görseli göstermeye devam eder.
