/* ==========================================================================
   QR Menü — ORTAK MENÜ VERİSİ
   Hisarönü Tantuni Yakup Usta

   BURASI TEK KAYNAK. Fiyat veya ürün değişikliği yalnızca bu dosyada yapılır;
   hem Konak hem Bostanlı sayfasına kendiliğinden yansır.

   Şube bilgileri burada DEĞİL — onlar sube-konak.js ve sube-bostanli.js
   dosyalarında, çünkü şubeden şubeye değişiyorlar.

   Metin alanlarının hepsi { tr, en } biçiminde. Marka adlarında (Fanta,
   Sprite, Ice Tea) iki dil aynı olabilir, bu normaldir.
   ========================================================================== */

var FIYAT_DEGISIM_TARIHI = '15/08/2026';

/* Tüm tantuni ürünleri aynı iki porsiyonu kullanıyor; sadece fiyatlar değişir. */
var ETIKET_TEK = { tr: 'Tek · 60 gr', en: 'Single · 60 g' };
var ETIKET_BOL = { tr: 'İçi Bol · 90 gr', en: 'Extra Filling · 90 g' };

function porsiyonlarKur(tek, bol) {
  return [
    { etiket: ETIKET_TEK, fiyat: tek },
    { etiket: ETIKET_BOL, fiyat: bol }
  ];
}

var KATEGORILER = [
  { id: 'et', ad: { tr: 'Et Ürünleri', en: 'Meat' } },
  { id: 'tavuk', ad: { tr: 'Tavuk Ürünleri', en: 'Chicken' } },
  { id: 'icecek', ad: { tr: 'İçecekler', en: 'Drinks' } }
];

var ET_URUNLERI = [
  {
    id: 'et-durum',
    ad: { tr: 'Et Dürüm', en: 'Beef Wrap' },
    aciklama: {
      tr: 'İnce lavaşta bol sebzeli, baharatlı et tantuni.',
      en: 'Spiced beef tantuni with plenty of vegetables in thin lavash.'
    },
    gorsel: '/images/menu/et-tantuni-durum.webp',
    porsiyonlar: porsiyonlarKur(330, 460)
  },
  {
    id: 'et-ekmek-arasi',
    ad: { tr: 'Et Ekmek Arası', en: 'Beef Sandwich' },
    aciklama: {
      tr: 'Taze ekmek arasında bol sebzeli, baharatlı et tantuni.',
      en: 'Spiced beef tantuni with plenty of vegetables in fresh bread.'
    },
    gorsel: '/images/menu/et-tantuni-ekmek-arasi.webp',
    porsiyonlar: porsiyonlarKur(330, 460)
  },
  {
    id: 'et-yogurtlu',
    ad: { tr: 'Et Yoğurtlu', en: 'Beef with Yoghurt' },
    aciklama: {
      tr: 'Taze pişmiş et, ev yapımı yoğurt ve taze lavaş ile.',
      en: 'Freshly cooked beef served with homemade yoghurt and fresh lavash.'
    },
    gorsel: '/images/menu/et-tantuni-yogurtlu.webp',
    porsiyonlar: porsiyonlarKur(420, 600)
  }
];

var TAVUK_URUNLERI = [
  {
    id: 'tavuk-durum',
    ad: { tr: 'Tavuk Dürüm', en: 'Chicken Wrap' },
    aciklama: {
      tr: 'İnce lavaşta bol sebzeli tavuk tantuni.',
      en: 'Chicken tantuni with plenty of vegetables in thin lavash.'
    },
    gorsel: '/images/menu/tavuk-tantuni-durum.webp',
    porsiyonlar: porsiyonlarKur(240, 330)
  },
  {
    id: 'tavuk-ekmek-arasi',
    ad: { tr: 'Tavuk Ekmek Arası', en: 'Chicken Sandwich' },
    aciklama: {
      tr: 'Taze ekmek arasında bol sebzeli tavuk tantuni.',
      en: 'Chicken tantuni with plenty of vegetables in fresh bread.'
    },
    gorsel: '/images/menu/tavuk-tantuni-ekmek-arasi.webp',
    porsiyonlar: porsiyonlarKur(240, 330)
  },
  {
    id: 'tavuk-yogurtlu',
    ad: { tr: 'Tavuk Yoğurtlu', en: 'Chicken with Yoghurt' },
    aciklama: {
      tr: 'Yumuşacık tavuk, yoğurt ve kavrulmuş biberlerle.',
      en: 'Tender chicken with yoghurt and roasted peppers.'
    },
    gorsel: '/images/menu/tavuk-tantuni-yogurtlu.webp',
    porsiyonlar: porsiyonlarKur(320, 450)
  }
];

/* İçeceklerde açıklama yok ve tek fiyat var. */
var ICECEKLER = [
  { id: 'ayran', ad: { tr: 'Ayran', en: 'Ayran (Yoghurt Drink)' }, gorsel: '/images/menu/ayran.webp', fiyat: 70 },
  { id: 'salgam', ad: { tr: 'Şalgam', en: 'Turnip Juice' }, gorsel: '/images/menu/salgam.webp', fiyat: 70 },
  { id: 'kola', ad: { tr: 'Kola', en: 'Coke' }, gorsel: '/images/menu/kola.webp', fiyat: 90 },
  { id: 'fanta', ad: { tr: 'Fanta', en: 'Fanta' }, gorsel: '/images/menu/fanta.webp', fiyat: 90 },
  { id: 'nigde-gazozu', ad: { tr: 'Niğde Gazozu', en: 'Niğde Soda' }, gorsel: '/images/menu/nigde-gazozu.webp', fiyat: 70 },
  { id: 'ice-tea', ad: { tr: 'Ice Tea', en: 'Ice Tea' }, gorsel: '/images/menu/ice-tea.webp', fiyat: 90 },
  { id: 'sprite', ad: { tr: 'Sprite', en: 'Sprite' }, gorsel: '/images/menu/sprite.webp', fiyat: 90 },
  { id: 'meyve-suyu', ad: { tr: 'Meyve Suyu', en: 'Fruit Juice' }, gorsel: '/images/menu/meyve-suyu.webp', fiyat: 90 },
  { id: 'maden-suyu', ad: { tr: 'Maden Suyu', en: 'Mineral Water' }, gorsel: '/images/menu/maden-suyu.webp', fiyat: 40 },
  { id: 'su', ad: { tr: 'Su', en: 'Water' }, gorsel: '/images/menu/su.webp', fiyat: 25 }
];

/* Arayüz metinleri. */
var ARAYUZ = {
  kategoriler: { tr: 'Kategoriler', en: 'Categories' },
  adres: { tr: 'Adres', en: 'Address' },
  calismaSaatleri: { tr: 'Çalışma Saatleri', en: 'Opening Hours' },
  telefon: { tr: 'Telefon', en: 'Phone' },
  yolTarifi: { tr: 'Yol tarifi', en: 'Directions' },
  fiyatDegisimTarihi: { tr: 'Fiyat değişim tarihi', en: 'Prices effective from' },
  subeSec: { tr: 'Şube seçin', en: 'Choose a branch' },
  gorseliBuyut: { tr: 'Fotoğrafı büyüt', en: 'Enlarge photo' },
  kapat: { tr: 'Kapat', en: 'Close' },
  dilSecimi: { tr: 'Dil seçimi', en: 'Language' },
  temayaGecKoyu: { tr: 'Karanlık temaya geç', en: 'Switch to dark theme' },
  temayaGecAcik: { tr: 'Aydınlık temaya geç', en: 'Switch to light theme' }
};
