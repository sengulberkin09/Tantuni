import type {
  IcecekUrun,
  Kategori,
  Metin,
  Porsiyon,
  TantuniUrun,
} from './types';

export const FIYAT_DEGISIM_TARIHI = '15/08/2026';

const ETIKET_TEK: Metin = { tr: 'Tek · 60 gr', en: 'Single · 60 g' };
const ETIKET_BOL: Metin = { tr: 'İçi Bol · 90 gr', en: 'Extra Filling · 90 g' };

/** Her tantuni ürünü aynı iki porsiyonu kullanıyor; yalnızca fiyatlar değişiyor. */
function porsiyonlar(tek: number, bol: number): [Porsiyon, Porsiyon] {
  return [
    { etiket: ETIKET_TEK, fiyat: tek },
    { etiket: ETIKET_BOL, fiyat: bol },
  ];
}

export const KATEGORILER: Kategori[] = [
  { id: 'et', ad: { tr: 'Et Ürünleri', en: 'Meat' } },
  { id: 'tavuk', ad: { tr: 'Tavuk Ürünleri', en: 'Chicken' } },
  { id: 'icecek', ad: { tr: 'İçecekler', en: 'Drinks' } },
];

export const ET_URUNLERI: TantuniUrun[] = [
  {
    id: 'et-durum',
    ad: 'Et Dürüm',
    aciklama: {
      tr: 'İnce lavaşta bol sebzeli, baharatlı et tantuni.',
      en: 'Spiced beef tantuni with plenty of vegetables in thin lavash.',
    },
    gorsel: '/images/menu/et-tantuni-durum.webp',
    porsiyonlar: porsiyonlar(330, 460),
  },
  {
    id: 'et-ekmek-arasi',
    ad: 'Et Ekmek Arası',
    aciklama: {
      tr: 'Taze ekmek arasında bol sebzeli, baharatlı et tantuni.',
      en: 'Spiced beef tantuni with plenty of vegetables in fresh bread.',
    },
    gorsel: '/images/menu/et-tantuni-ekmek-arasi.webp',
    porsiyonlar: porsiyonlar(330, 460),
  },
  {
    id: 'et-yogurtlu',
    ad: 'Et Yoğurtlu',
    aciklama: {
      tr: 'Taze pişmiş et, ev yapımı yoğurt ve taze lavaş ile.',
      en: 'Freshly cooked beef served with homemade yoghurt and fresh lavash.',
    },
    gorsel: '/images/menu/et-tantuni-yogurtlu.webp',
    porsiyonlar: porsiyonlar(420, 600),
  },
];

export const TAVUK_URUNLERI: TantuniUrun[] = [
  {
    id: 'tavuk-durum',
    ad: 'Tavuk Dürüm',
    aciklama: {
      tr: 'İnce lavaşta bol sebzeli tavuk tantuni.',
      en: 'Chicken tantuni with plenty of vegetables in thin lavash.',
    },
    gorsel: '/images/menu/tavuk-tantuni-durum.webp',
    porsiyonlar: porsiyonlar(240, 330),
  },
  {
    id: 'tavuk-ekmek-arasi',
    ad: 'Tavuk Ekmek Arası',
    aciklama: {
      tr: 'Taze ekmek arasında bol sebzeli tavuk tantuni.',
      en: 'Chicken tantuni with plenty of vegetables in fresh bread.',
    },
    gorsel: '/images/menu/tavuk-tantuni-ekmek-arasi.webp',
    porsiyonlar: porsiyonlar(240, 330),
  },
  {
    id: 'tavuk-yogurtlu',
    ad: 'Tavuk Yoğurtlu',
    aciklama: {
      tr: 'Yumuşacık tavuk, yoğurt ve kavrulmuş biberlerle.',
      en: 'Tender chicken with yoghurt and roasted peppers.',
    },
    gorsel: '/images/menu/tavuk-tantuni-yogurtlu.webp',
    porsiyonlar: porsiyonlar(320, 450),
  },
];

export const ICECEKLER: IcecekUrun[] = [
  { id: 'ayran', ad: 'Ayran', gorsel: '/images/menu/ayran.webp', fiyat: 70 },
  { id: 'salgam', ad: 'Şalgam', gorsel: '/images/menu/salgam.webp', fiyat: 70 },
  { id: 'kola', ad: 'Kola', gorsel: '/images/menu/kola.webp', fiyat: 90 },
  { id: 'fanta', ad: 'Fanta', gorsel: '/images/menu/fanta.webp', fiyat: 90 },
  { id: 'nigde-gazozu', ad: 'Niğde Gazozu', gorsel: '/images/menu/nigde-gazozu.webp', fiyat: 70 },
  { id: 'ice-tea', ad: 'Ice Tea', gorsel: '/images/menu/ice-tea.webp', fiyat: 90 },
  { id: 'sprite', ad: 'Sprite', gorsel: '/images/menu/sprite.webp', fiyat: 90 },
  { id: 'meyve-suyu', ad: 'Meyve Suyu', gorsel: '/images/menu/meyve-suyu.webp', fiyat: 90 },
  { id: 'maden-suyu', ad: 'Maden Suyu', gorsel: '/images/menu/maden-suyu.webp', fiyat: 40 },
  { id: 'su', ad: 'Su', gorsel: '/images/menu/su.webp', fiyat: 25 },
];
