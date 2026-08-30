# QR Menü — Hisarönü Tantuni Yakup Usta

Konak ve Bostanlı şubeleri için görüntüleme amaçlı QR menü sayfaları.

- `/qr/konak/` — Konak şubesi (QR #1)
- `/qr/bostanli/` — Bostanlı şubesi (QR #2)
- `/qr/` — şube seçim sayfası

Sipariş, sepet veya ödeme içermez.

## Geliştirme

```bash
cd qr-menu
npm install
npm run dev      # http://localhost:3000/qr/konak/
npm test         # veri ve bileşen testleri
```

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
buraya da kopyalanmalı:

```bash
cp images/menu/*.webp qr-menu/public/images/menu/
```
