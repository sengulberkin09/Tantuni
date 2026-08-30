import type { Dil } from '@/data/types';

export type Tema = 'acik' | 'koyu';

export const DIL_ANAHTARI = 'tantuni-qr-dil';
export const TEMA_ANAHTARI = 'tantuni-qr-tema';

export function dilCozumle(kayitli: string | null, tarayiciDili: string | undefined): Dil {
  if (kayitli === 'tr' || kayitli === 'en') return kayitli;
  if (tarayiciDili && tarayiciDili.toLowerCase().startsWith('en')) return 'en';
  return 'tr';
}

export function temaCozumle(kayitli: string | null, sistemKoyuMu: boolean): Tema {
  if (kayitli === 'acik' || kayitli === 'koyu') return kayitli;
  return sistemKoyuMu ? 'koyu' : 'acik';
}

/**
 * <head> içinde, sayfa boyanmadan önce çalışır: tema flash'ını ve
 * EN kullanıcısında dil sıçramasını önler.
 *
 * Buradaki çözümleme mantığı bilerek dilCozumle/temaCozumle ile aynı;
 * o fonksiyonlar React tarafında ve testlerde bu davranışın tanımı olarak
 * kullanılıyor. İkisi birlikte değiştirilmeli.
 */
export const TERCIH_SCRIPTI = `
(function () {
  try {
    var kok = document.documentElement;
    var d = localStorage.getItem('${DIL_ANAHTARI}');
    if (d !== 'tr' && d !== 'en') {
      var nav = (navigator.language || '').toLowerCase();
      d = nav.indexOf('en') === 0 ? 'en' : 'tr';
    }
    kok.lang = d;

    var t = localStorage.getItem('${TEMA_ANAHTARI}');
    if (t !== 'acik' && t !== 'koyu') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'koyu' : 'acik';
    }
    kok.setAttribute('data-tema', t);
  } catch (e) {}
})();
`;
