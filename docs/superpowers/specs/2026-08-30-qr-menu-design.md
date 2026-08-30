# QR Menü Sayfaları — Konak & Bostanlı

**Tarih:** 2026-08-30
**Durum:** Tasarım onaylandı
**Repo:** sengulberkin09/Tantuni

## 1. Amaç ve kapsam

Hisarönü Tantuni Yakup Usta için, masaya konacak QR kodlardan açılan iki ayrı
görüntüleme amaçlı menü sayfası: biri Konak, biri Bostanlı şubesi.

Menü içerikleri, fiyatlar, görseller ve genel tasarım iki şube için ortak.
Yalnızca sayfa başlığı, adres, telefon ve çalışma saatleri şubeye göre değişir.

### Kapsam dışı

Bu spec'te açıkça **yok**:

- Sipariş, sepet, ödeme, fiyat toplama
- Trendyol Go / Yemeksepeti gibi dış sipariş linkleri
- QR kod görselinin kendisinin üretilmesi (ayrı iş)
- Mevcut `menu.html` sayfasının bu yapıya taşınması (mevcut site aynen kalıyor)

Sayfa tamamen pasif: tıklanabilir tek şeyler kategori sekmeleri, dil/tema
düğmeleri, telefon ve harita linkleridir.

## 2. Mimari ve yayın

Mevcut site repo kökünden GitHub Pages ile ham statik dosya olarak servis
ediliyor (`CNAME` → `hisaronutantuniyakupusta.com`), build adımı yok. QR menü
bunu bozmadan yanına ekleniyor.

`qr-menu/` klasöründe Next.js 15 (App Router, TypeScript) projesi durur.
`next.config.ts`:

- `output: 'export'` — statik HTML üretimi, sunucu gerekmez
- `basePath: '/qr'` — sayfalar `/qr/...` altından servis edilecek
- `trailingSlash: true` — GitHub Pages `/qr/konak/` isteğini `index.html`'e eşler
- `images: { unoptimized: true }` — statik export'ta görsel optimizasyonu yok

Build çıktısı (`qr-menu/out`) repo kökündeki `qr/` klasörüne kopyalanır ve
commit'lenir.

```
tantuni/
├── index.html, menu.html, ...      mevcut site — dokunulmuyor
├── css/, js/, images/              mevcut varlıklar — dokunulmuyor
├── qr-menu/                        Next.js kaynak kodu
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                → /qr/           (şube seçim)
│   │   ├── konak/page.tsx          → /qr/konak/     ← QR #1
│   │   └── bostanli/page.tsx       → /qr/bostanli/  ← QR #2
│   ├── components/
│   ├── data/
│   ├── tests/                      vitest testleri
│   ├── scripts/copy-out.mjs        out/ → ../qr/
│   ├── public/images/menu/*.webp
│   └── README.md                   güncelleme akışı
└── qr/                             BUILD ÇIKTISI — commit'lenir
    ├── index.html
    ├── konak/index.html
    └── bostanli/index.html
```

### Karar: görseller kopyalanacak

`images/menu/` altındaki 16 görsel `qr-menu/public/images/menu/` altına
kopyalanır ve commit'lenir.

Alternatif, kök `images/`'e root-absolute link vermekti; bu duplikasyonu
önlerdi ama `basePath` nedeniyle `next dev` altında 404 verirdi. Tüm klasör
100 KB olduğu için kopya pratikte bedava, karşılığında dev / build / prod
birebir aynı davranıyor.

Görseller `next/image` ile kullanılır (`unoptimized` global ayarlı):
`basePath` prefix'ini kendisi ekler, `width`/`height`/lazy-loading bedava gelir.

Logo `images/logo.webp` aynı şekilde `qr-menu/public/images/logo.webp`'e kopyalanır.

### Karar: /qr/ kökünde şube seçim sayfası

QR kodları doğrudan şube URL'ine gideceği için zorunlu değil, ama yanlış
basılmış, eski ya da elle yazılmış bir URL'de boş sayfa yerine iki butonlu
küçük bir seçim ekranı çıkar.

## 3. Veri katmanı

Fiyat ve ürün tek kaynakta; yalnızca şube bilgisi ikiye ayrılır.

```
qr-menu/data/
├── types.ts                tipler
├── menu.ts                 TEK kaynak: kategoriler, ürünler, fiyatlar, çeviriler
├── i18n.ts                 arayüz metinleri (TR/EN)
└── subeler/
    ├── konak.ts
    └── bostanli.ts
```

### types.ts

```ts
export type Dil = 'tr' | 'en';
export type Metin = { tr: string; en: string };

export type Porsiyon = {
  etiket: Metin;   // "Tek · 60 gr" / "Single · 60 g"
  fiyat: number;   // TL, tam sayı
};

export type TantuniUrun = {
  id: string;
  ad: string;                          // Türkçe, EN modda da aynı kalır
  aciklama: Metin;
  gorsel: string;                      // "/images/menu/et-tantuni-durum.webp"
  porsiyonlar: [Porsiyon, Porsiyon];   // tam iki porsiyon
};

export type IcecekUrun = {
  id: string;
  ad: string;                          // Türkçe, EN modda da aynı kalır
  gorsel: string;
  fiyat: number;                       // tek fiyat, porsiyon yok
};

export type Sube = {
  slug: 'konak' | 'bostanli';
  ad: string;                  // "Konak"
  baslik: string;              // "Hisarönü Tantuni Yakup Usta - Konak"
  adres: string;
  mapsUrl: string;
  telefonGosterim: string;     // "0552 888 35 33"
  telefonTel: string;          // "+905528883533"
  calismaSaatleri: string;     // Türkçe sabit, çevrilmiyor
};
```

`TantuniUrun` ile `IcecekUrun`'ün ayrı tipler olması kasıtlı: içeceğe
yanlışlıkla ikinci porsiyon eklenmesini tip düzeyinde engeller.

### menu.ts içeriği

Fiyat değişim tarihi ortak sabit: `FIYAT_DEGISIM_TARIHI = '15/08/2026'`.

**Et Ürünleri** (porsiyonlar: `Tek · 60 gr` / `İçi Bol · 90 gr`)

| id | Ad | Görsel | Tek | İçi Bol |
|----|----|--------|-----|---------|
| `et-durum` | Et Dürüm | `et-tantuni-durum.webp` | 330 | 460 |
| `et-ekmek-arasi` | Et Ekmek Arası | `et-tantuni-ekmek-arasi.webp` | 330 | 460 |
| `et-yogurtlu` | Et Yoğurtlu | `et-tantuni-yogurtlu.webp` | 420 | 600 |

Açıklamalar (TR mevcut `menu.html`'den birebir alınacak, uydurulmayacak):

- `et-durum` — TR: "İnce lavaşta bol sebzeli, baharatlı et tantuni."
  EN: "Spiced beef tantuni with plenty of vegetables in thin lavash."
- `et-ekmek-arasi` — TR: "Taze ekmek arasında bol sebzeli, baharatlı et tantuni."
  EN: "Spiced beef tantuni with plenty of vegetables in fresh bread."
- `et-yogurtlu` — TR: "Taze pişmiş et, ev yapımı yoğurt ve taze lavaş ile."
  EN: "Freshly cooked beef served with homemade yoghurt and fresh lavash."

**Tavuk Ürünleri** (aynı porsiyon etiketleri)

| id | Ad | Görsel | Tek | İçi Bol |
|----|----|--------|-----|---------|
| `tavuk-durum` | Tavuk Dürüm | `tavuk-tantuni-durum.webp` | 240 | 330 |
| `tavuk-ekmek-arasi` | Tavuk Ekmek Arası | `tavuk-tantuni-ekmek-arasi.webp` | 240 | 330 |
| `tavuk-yogurtlu` | Tavuk Yoğurtlu | `tavuk-tantuni-yogurtlu.webp` | 320 | 450 |

- `tavuk-durum` — TR: "İnce lavaşta bol sebzeli tavuk tantuni."
  EN: "Chicken tantuni with plenty of vegetables in thin lavash."
- `tavuk-ekmek-arasi` — TR: "Taze ekmek arasında bol sebzeli tavuk tantuni."
  EN: "Chicken tantuni with plenty of vegetables in fresh bread."
- `tavuk-yogurtlu` — TR: "Yumuşacık tavuk, yoğurt ve kavrulmuş biberlerle."
  EN: "Tender chicken with yoghurt and roasted peppers."

**İçecekler** (tek fiyat, açıklama yok)

| id | Ad | Görsel | Fiyat |
|----|----|--------|-------|
| `ayran` | Ayran | `ayran.webp` | 70 |
| `salgam` | Şalgam | `salgam.webp` | 70 |
| `kola` | Kola | `kola.webp` | 90 |
| `fanta` | Fanta | `fanta.webp` | 90 |
| `nigde-gazozu` | Niğde Gazozu | `nigde-gazozu.webp` | 70 |
| `ice-tea` | Ice Tea | `ice-tea.webp` | 90 |
| `sprite` | Sprite | `sprite.webp` | 90 |
| `meyve-suyu` | Meyve Suyu | `meyve-suyu.webp` | 90 |
| `maden-suyu` | Maden Suyu | `maden-suyu.webp` | 40 |
| `su` | Su | `su.webp` | 25 |

### Şube dosyaları

`subeler/konak.ts`:

- baslik: "Hisarönü Tantuni Yakup Usta - Konak"
- adres: "Konak, 902. Sk. No:7, 35250 Konak/İzmir"
- telefonGosterim: "0552 888 35 33" / telefonTel: "+905528883533"
- calismaSaatleri: "Her gün 10:30 – 20:15"

`subeler/bostanli.ts`:

- baslik: "Hisarönü Tantuni Yakup Usta - Bostanlı"
- adres: "Bostanlı, Cemal Gürsel Cd. No:530B, 35590 Karşıyaka/İzmir"
- telefonGosterim: "+90 541 762 37 75" / telefonTel: "+905417623775"
- calismaSaatleri: "Her gün, kapanış 01:30"

`mapsUrl` her iki şube için adres metninden kurulan bir Google Maps arama
URL'i olur (`https://www.google.com/maps/search/?api=1&query=<encoded adres>`).
Uydurma place ID kullanılmaz.

### Fiyat/ürün güncelleme akışı

1. `qr-menu/data/menu.ts` içinde sayıyı değiştir
2. `npm run build`
3. `qr/` çıktısını commit'le

Her iki şube sayfası otomatik güncellenir.

## 4. Dil desteği (TR / EN)

Sayfada TR/EN geçiş düğmesi bulunur. Varsayılan dil **Türkçe**.

### Neler çevrilir

- **Ürün açıklamaları** (`menu.ts` içinde `aciklama: { tr, en }`) — çevrilen tek
  ürün alanı. İçeceklerde açıklama olmadığı için onlarda çevrilecek bir şey yok.
- Kategori adları: Et Ürünleri / Meat, Tavuk Ürünleri / Chicken, İçecekler / Drinks
- Porsiyon etiketleri: "Tek · 60 gr" / "Single · 60 g",
  "İçi Bol · 90 gr" / "Extra Filling · 90 g"
- Arayüz metinleri (`i18n.ts`): "Adres" / "Address",
  "Çalışma Saatleri" / "Opening Hours", "Telefon" / "Phone",
  "Yol tarifi" / "Directions", "Fiyat değişim tarihi" / "Prices effective from"

### Neler çevrilmez

**Ürün adları her iki dilde de Türkçe kalır** — "Et Dürüm", "Tavuk Yoğurtlu",
"Şalgam" EN modda da aynen böyle görünür. Bu nedenle `ad` alanı `Metin` değil düz
`string`. Görsel `alt` metinleri de her zaman Türkçe ürün adını kullanır.

Şube bilgileri de sabit kalır: adres ve çalışma saatleri Türkçe yazıldığı gibi
görünür (ör. EN modda da "Her gün 10:30 – 20:15"). Etraflarındaki başlıklar
çevrilir, değerleri çevrilmez.

Bunların üçü de kasıtlı, hata değil.

Sonuç olarak EN mod, Türkçe ürün adlarının üstüne İngilizce açıklama ve arayüz
giydiren bir görünüm olur — yabancı ziyaretçi ürünün adını garsona söylediği gibi
okur, ne olduğunu açıklamadan anlar.

### Uygulama

Dil, ayrı route değil, tek sayfada React state ile değişir. QR'a basılacak URL
tek kalır (`/qr/konak/`), ki basılmış bir QR dil seçiminden etkilenmesin.

Statik HTML **TR** olarak üretilir. `<head>` içindeki kısa bir inline script
`localStorage`'daki seçimi (yoksa `navigator.language`'ı) okuyup
`document.documentElement.lang` değerini ayarlar; bileşen bunu mount'ta okuyup
state'e alır. Seçim `localStorage`'a yazılır.

**Bilinen ödünç:** İngilizce seçmiş bir ziyaretçi sayfaya tekrar girdiğinde
hydration'a kadar (~100 ms) Türkçe metin görebilir. Ürün adları zaten her iki
dilde Türkçe kaldığı için bu geçiş yalnızca açıklamaları, kategori sekmelerini
ve arayüz etiketlerini etkiler — sayfanın iskeleti oynamaz. Rahatsız edici
olursa alternatif, iki dilin metnini de DOM'a basıp `html[lang]` CSS kuralıyla
göstermek; daha karmaşık olduğu için şimdilik tercih edilmedi.

Dil düğmesi TR|EN şeklinde segmented control olarak header'da, tema düğmesinin
yanında durur.

## 5. Sayfa ve UI

Tek paylaşılan `components/QrMenu.tsx` bileşeni `sube` prop'u alır.
`app/konak/page.tsx` ve `app/bostanli/page.tsx` yalnızca kendi şube verisini
geçen üç satırlık dosyalardır.

### Dikey akış

1. **Header** — logo, şube başlığı, TR|EN düğmesi, tema düğmesi
2. **Kategori sekmeleri** — sticky; Et Ürünleri / Tavuk Ürünleri / İçecekler
3. **Ürün listesi** — seçili kategori
4. **Footer** — şube adresi, çalışma saatleri, telefon, fiyat değişim tarihi

### Sekme davranışı: filtre

Sekmeye basılınca yalnızca o kategori görünür, diğerleri gizlenir. QR okutan
kişi "Tavuk"a bastığında 3 ürün görür, kaydırmaz.

Erişilebilirlik: `role="tablist"` / `role="tab"` / `role="tabpanel"`,
`aria-selected`, ok tuşlarıyla gezinme — mevcut `menu.html` ile aynı desen.

### Kart düzeni

Tantuni ürünleri yatay kart: solda 92px kare görsel, sağda ad, açıklama ve iki
fiyat chip'i (`Tek · 60 gr — ₺330`). Mobilde tek sütun, ~375px'te ekranda 3-4
ürün görünür.

İçecekler 2 sütun grid, kompakt kart: görsel + ad + tek fiyat.

### Tema

Renkler mevcut "Köz Ateşi" temasından birebir alınır — flame `#e85d2c`,
charcoal `#1c1410`, cream `#f3e9dd`, gold `#f2b84b`. Fontlar Fraunces (başlık)
+ Inter (gövde). QR menü mevcut sitenin devamı gibi hisseder.

**Karanlık mod:** varsayılan sistem tercihine uyar (`prefers-color-scheme`),
header'daki düğme ile elle değiştirilir, seçim `localStorage`'da kalır. Sayfa
boyanmadan önce çalışan inline script ile tema flash'ı önlenir (dil scripti ile
aynı blokta).

### JS kapalıyken

Sayfa bozulmaz: üç kategori de açık, Türkçe render edilir. Filtre, dil ve tema
düğmeleri yalnızca hydration sonrası devreye girer.

### Mobil öncelik

Tasarım 375px'ten başlayıp yukarı doğru açılır. Dokunma hedefleri en az 44px.
Sayfa gövdesi yatay kaydırmaz.

## 6. Doğrulama

Statik, girdisiz, ağ çağrısı olmayan bir sayfa — klasik runtime hata yüzeyi yok.
Gerçek risk veride: eksik görsel, tipo fiyat, unutulmuş çeviri.

Doğrulama vitest ile yapılır. `qr-menu/tests/veri.test.ts` (`npm test`) şunları
doğrular:

- Her ürünün `gorsel` dosyası `public/` altında gerçekten var
- Her fiyat pozitif tam sayı
- Her ürünün `ad` alanı boş olmayan string
- Her `Metin` alanında (`aciklama`, porsiyon `etiket`, `i18n.ts` girdileri) hem
  `tr` hem `en` dolu — boş string reddedilir
- Tantuni ürünlerinde tam iki porsiyon var
- Ürün `id`'leri benzersiz
- Her şubede zorunlu alanların hepsi dolu, iki `slug` çakışmıyor

Testler `prebuild`'e bağlanır — bozuk veri build'e giremez.

Bileşen davranışları (sekme filtresi, TR/EN geçişi, tema düğmesi) da aynı vitest
kurulumunda `@testing-library/react` ile test edilir.

Ek doğrulama:

- `npm run build` temiz geçmeli, TypeScript hatasız
- `next dev` üzerinde 375px genişlikte iki sayfa da elle kontrol: sekme
  filtresi, TR/EN geçişi, dark mode toggle, `tel:` linki, maps linki
- Build sonrası `qr/konak/index.html` ve `qr/bostanli/index.html` üretilmiş
  olmalı, her biri kendi şube bilgisini içermeli

## 7. Riskler

- **Build çıktısının commit'lenmesi.** Fiyat değişince build alıp `qr/`
  klasörünü commit'lemek gerekir. Unutulursa site eski fiyatı gösterir.
  Azaltma: `qr-menu/README.md` içinde güncelleme akışı yazılı olacak.
- **Mevcut siteye sızma.** `qr-menu/` ve `qr/` dışında hiçbir dosya
  değiştirilmez; `css/style.css`, `js/script.js`, kökteki `*.html` dokunulmaz.
- **Fiyat doğruluğu.** Fiyatlar brief'ten alındı ve mevcut `menu.html` ile
  birebir uyuşuyor. `menu.html` ileride ayrışırsa iki kaynak arasında fark
  oluşabilir — bu spec kapsamında birleştirilmiyor.
