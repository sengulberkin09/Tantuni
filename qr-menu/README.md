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

## `.nojekyll` dosyasını silmeyin

Repo kökünde (bu klasörün bir üstünde) boş bir `.nojekyll` dosyası var.
GitHub Pages branch tabanlı yayında varsayılan olarak Jekyll çalıştırır ve
Jekyll, adı alt çizgiyle başlayan klasörleri (`_next/` gibi) yayına
kopyalamaz. Bu sayfaların CSS'i ve JS'i tam olarak `_next/` altında —
`.nojekyll` yoksa Jekyll devreye girer, `_next/` yayından düşer, menü
stilsiz ve etkileşimsiz kalır (sekmeler, dil ve tema geçişi çalışmaz).

`.nojekyll` bilinçli olarak `qr-menu/` içinde değil **repo kökünde**:
`scripts/copy-out.mjs` her build'de `qr/` klasörünü tamamen silip yeniden
oluşturuyor (`rm(hedef, { recursive: true, force: true })`), o yüzden
`qr/.nojekyll` bir sonraki build'de kaybolurdu. Repo kökü bu silme
işleminin dışında, dosya orada kalıcı.

## Fiyat veya ürün güncelleme

1. `qr-menu/data/menu.ts` içinde fiyatı/ürünü değiştirin — burası tek kaynak,
   her iki şube sayfasına da otomatik yansır.
2. Fiyat değişim tarihini güncelleyin: `FIYAT_DEGISIM_TARIHI` (aynı dosyada).
3. PowerShell'de, `qr-menu/` klasöründen build alın. Testler önce çalışır,
   bozuk veri build'i durdurur. Çıktı otomatik olarak repo kökündeki `qr/`
   klasörüne kopyalanır:

   ```
   Set-Location 'C:\Users\sengu\OneDrive\Masaüstü\tantuni\qr-menu'
   npm run build
   ```

4. **Hem değiştirdiğiniz kaynak dosyayı hem `qr/` çıktısını** commit'leyip
   push'layın. Repo kökünden:

   ```
   git add qr-menu/data/menu.ts qr
   git commit -m "Menu: fiyat guncellemesi"
   git push
   ```

**İki tuzak:**

- `qr/` klasörü build çıktısıdır, elle düzenlenmez. Build alıp commit'lemeyi
  unutursanız yayındaki site eski fiyatı göstermeye devam eder.
- Yalnızca `qr/` klasörünü commit'lerseniz site doğru görünür ama fiyatın
  neden değiştiğinin git geçmişinde kaydı kalmaz. Kaynak dosyayı da ekleyin.

## Şube bilgisi güncelleme

Adres, telefon veya çalışma saati değişirse `qr-menu/data/subeler/konak.ts` ya
da `qr-menu/data/subeler/bostanli.ts` dosyasını düzenleyin, sonra yukarıdaki
build adımlarını tekrarlayın.

Commit'e kaynak dosyayı eklemeyi unutmayın — **repo kökünden**:

```
git add qr-menu/data/subeler qr
```

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

Görsel kopyalarını da commit'e ekleyin — **repo kökünden**:

```
git add qr-menu/public/images qr
```

## Yayından önce elle kontrol

Otomatik testler veriyi ve bileşen davranışını doğruluyor, ama gerçek telefonda
nasıl göründüğünü doğrulamıyor. Büyük bir değişiklikten sonra bunları elle
geçin.

`npm run dev` çalıştırın, tarayıcıyı **375px genişliğe** daraltın (Chrome/Edge:
F12 → cihaz araç çubuğu) ve `http://localhost:3000/qr/konak/` adresini açın:

- [ ] Sayfa yatay kaymıyor, hiçbir şey ekrandan taşmıyor
- [ ] Kategori sekmeleri yukarıda sabit kalıyor (aşağı kaydırınca kayboluyorsa hata)
- [ ] "İçecekler"e basınca **yalnızca** içecekler görünüyor
- [ ] Sol/sağ ok tuşlarıyla sekmeler arasında geçilebiliyor
- [ ] "EN"e basınca açıklamalar ve sekme adları İngilizce oluyor
- [ ] EN modunda ürün adları **Türkçe kalıyor** ("Et Dürüm", "Şalgam")
- [ ] EN modunda adres ve çalışma saatleri de **Türkçe kalıyor**
- [ ] Tema düğmesi karanlık moda geçiriyor
- [ ] Sayfayı yenileyince dil ve tema seçimi korunuyor
- [ ] Telefon numarasına dokununca arama başlıyor
- [ ] Adrese dokununca Google Maps açılıyor ve doğru şubeyi gösteriyor

Sonra `http://localhost:3000/qr/bostanli/`:

- [ ] Bostanlı adresi, telefonu ve saatleri görünüyor
- [ ] Konak'a ait hiçbir bilgi görünmüyor

Sonra `http://localhost:3000/qr/`:

- [ ] İki şube kartı da görünüyor, ikisinin linki de doğru sayfayı açıyor

Bitince dev sunucusunu `Ctrl+C` ile kapatın.

En az bir kez **gerçek bir telefondan**, basılı QR kodu okutarak da bakın —
`tel:` linki ve Google Maps davranışı masaüstü tarayıcıda tam olarak
doğrulanamaz.
