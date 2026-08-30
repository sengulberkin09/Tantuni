import { afterEach, describe, expect, it } from 'vitest';

import {
  DIL_ANAHTARI,
  TEMA_ANAHTARI,
  TERCIH_SCRIPTI,
  dilCozumle,
  temaCozumle,
} from '@/lib/tercihler';

describe('dilCozumle', () => {
  it('kayıtlı geçerli seçimi her şeyin önüne alır', () => {
    expect(dilCozumle('en', 'tr-TR')).toBe('en');
    expect(dilCozumle('tr', 'en-US')).toBe('tr');
  });

  it('kayıt yoksa tarayıcı dili İngilizce ise en döner', () => {
    expect(dilCozumle(null, 'en-US')).toBe('en');
    expect(dilCozumle(null, 'EN')).toBe('en');
  });

  it('kayıt yoksa ve tarayıcı dili İngilizce değilse tr döner', () => {
    expect(dilCozumle(null, 'tr-TR')).toBe('tr');
    expect(dilCozumle(null, 'de-DE')).toBe('tr');
    expect(dilCozumle(null, undefined)).toBe('tr');
  });

  it('bozuk kayıtlı değeri yok sayar', () => {
    expect(dilCozumle('klingon', 'tr-TR')).toBe('tr');
    expect(dilCozumle('', 'en-US')).toBe('en');
  });
});

describe('temaCozumle', () => {
  it('kayıtlı geçerli seçimi sistem tercihinin önüne alır', () => {
    expect(temaCozumle('acik', true)).toBe('acik');
    expect(temaCozumle('koyu', false)).toBe('koyu');
  });

  it('kayıt yoksa sistem tercihini izler', () => {
    expect(temaCozumle(null, true)).toBe('koyu');
    expect(temaCozumle(null, false)).toBe('acik');
  });

  it('bozuk kayıtlı değeri yok sayar', () => {
    expect(temaCozumle('mor', true)).toBe('koyu');
  });
});

function tarayiciDiliniAyarla(dil: string) {
  Object.defineProperty(navigator, 'language', { value: dil, configurable: true });
}

function sistemTemasiniAyarla(koyuMu: boolean) {
  window.matchMedia = ((sorgu: string) => ({
    matches: koyuMu,
    media: sorgu,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
}

describe('TERCIH_SCRIPTI', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-tema');
  });

  it('localStorage anahtarlarını içerir', () => {
    expect(TERCIH_SCRIPTI).toContain(DIL_ANAHTARI);
    expect(TERCIH_SCRIPTI).toContain(TEMA_ANAHTARI);
  });

  it('kapatılmamış script etiketi içermez (XSS koruması)', () => {
    expect(TERCIH_SCRIPTI).not.toContain('</script');
  });

  it('çalıştırıldığında html üzerinde lang ve data-tema ayarlar', () => {
    localStorage.setItem(DIL_ANAHTARI, 'en');
    localStorage.setItem(TEMA_ANAHTARI, 'koyu');
    // matchMedia jsdom'da tanımlı değil; script'in ihtiyacı olduğu için ekliyoruz.
    sistemTemasiniAyarla(false);

    new Function(TERCIH_SCRIPTI)();

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dataset.tema).toBe('koyu');
  });

  it('kayıt yokken İngilizce tarayıcı ve koyu sistemde script, TS fonksiyonlarıyla aynı sonucu verir', () => {
    localStorage.clear();
    tarayiciDiliniAyarla('en-GB');
    sistemTemasiniAyarla(true);
    document.documentElement.removeAttribute('data-tema');
    document.documentElement.removeAttribute('lang');

    new Function(TERCIH_SCRIPTI)();

    // Script ile TS fonksiyonlari ayni sonucu vermeli - sapma olursa burada patlar.
    expect(document.documentElement.lang).toBe(dilCozumle(null, 'en-GB'));
    expect(document.documentElement.dataset.tema).toBe(temaCozumle(null, true));
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dataset.tema).toBe('koyu');
  });

  it('kayıt yokken Türkçe tarayıcı ve aydınlık sistemde script, TS fonksiyonlarıyla aynı sonucu verir', () => {
    localStorage.clear();
    tarayiciDiliniAyarla('tr-TR');
    sistemTemasiniAyarla(false);
    document.documentElement.removeAttribute('data-tema');
    document.documentElement.removeAttribute('lang');

    new Function(TERCIH_SCRIPTI)();

    expect(document.documentElement.lang).toBe(dilCozumle(null, 'tr-TR'));
    expect(document.documentElement.dataset.tema).toBe(temaCozumle(null, false));
    expect(document.documentElement.lang).toBe('tr');
    expect(document.documentElement.dataset.tema).toBe('acik');
  });
});
