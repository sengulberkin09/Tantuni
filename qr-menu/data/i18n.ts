import type { Metin } from './types';

/** Ürün adları burada yok — onlar her iki dilde de Türkçe kalıyor. */
export const ARAYUZ = {
  kategoriler: { tr: 'Kategoriler', en: 'Categories' },
  adres: { tr: 'Adres', en: 'Address' },
  calismaSaatleri: { tr: 'Çalışma Saatleri', en: 'Opening Hours' },
  telefon: { tr: 'Telefon', en: 'Phone' },
  yolTarifi: { tr: 'Yol tarifi', en: 'Directions' },
  fiyatDegisimTarihi: { tr: 'Fiyat değişim tarihi', en: 'Prices effective from' },
  subeSec: { tr: 'Şube seçin', en: 'Choose a branch' },
  dilSecimi: { tr: 'Dil seçimi', en: 'Language' },
  temayaGecKoyu: { tr: 'Karanlık temaya geç', en: 'Switch to dark theme' },
  temayaGecAcik: { tr: 'Aydınlık temaya geç', en: 'Switch to light theme' },
} satisfies Record<string, Metin>;
