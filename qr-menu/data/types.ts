export type Dil = 'tr' | 'en';

/** İki dilde tutulan metin. Ürün adları bilerek bu tipi kullanmaz. */
export type Metin = { tr: string; en: string };

export type KategoriId = 'et' | 'tavuk' | 'icecek';

export type Kategori = {
  id: KategoriId;
  ad: Metin;
};

export type Porsiyon = {
  etiket: Metin;
  /** TL, tam sayı. */
  fiyat: number;
};

export type TantuniUrun = {
  id: string;
  /** Türkçe; EN modda da aynı kalır. */
  ad: string;
  aciklama: Metin;
  /** public/ köküne göre yol, ör. "/images/menu/et-tantuni-durum.webp" */
  gorsel: string;
  porsiyonlar: [Porsiyon, Porsiyon];
};

export type IcecekUrun = {
  id: string;
  /** Türkçe; EN modda da aynı kalır. */
  ad: string;
  gorsel: string;
  fiyat: number;
};

export type Sube = {
  slug: 'konak' | 'bostanli';
  ad: string;
  baslik: string;
  /** Türkçe sabit — çevrilmiyor. */
  adres: string;
  mapsUrl: string;
  telefonGosterim: string;
  /** tel: linki için, ör. "+905528883533" */
  telefonTel: string;
  /** Türkçe sabit — çevrilmiyor. */
  calismaSaatleri: string;
};
