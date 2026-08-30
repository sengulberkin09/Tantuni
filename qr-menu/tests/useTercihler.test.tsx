import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useTercihler } from '@/components/useTercihler';
import { DIL_ANAHTARI, TEMA_ANAHTARI } from '@/lib/tercihler';

function sistemTemasiniAyarla(koyuMu: boolean) {
  window.matchMedia = ((sorgu: string) => ({
    matches: koyuMu,
    media: sorgu,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
}

describe('useTercihler', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('data-tema');
    sistemTemasiniAyarla(false);
  });

  it('inline script çoktan çözümlediyse <html> üzerindeki değerleri okur', () => {
    document.documentElement.lang = 'en';
    document.documentElement.setAttribute('data-tema', 'koyu');

    const { result } = renderHook(() => useTercihler());

    expect(result.current.dil).toBe('en');
    expect(result.current.tema).toBe('koyu');
  });

  it('<html> geçerli değer taşımıyorsa kayda ve sistem tercihine düşer', () => {
    localStorage.setItem(DIL_ANAHTARI, 'en');
    sistemTemasiniAyarla(true);

    const { result } = renderHook(() => useTercihler());

    expect(result.current.dil).toBe('en');
    expect(result.current.tema).toBe('koyu');
  });

  it('setDil state, <html lang> ve localStorage\'ı birlikte günceller', () => {
    const { result } = renderHook(() => useTercihler());

    act(() => {
      result.current.setDil('en');
    });

    expect(result.current.dil).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem(DIL_ANAHTARI)).toBe('en');
  });

  it('setTema state, <html data-tema> ve localStorage\'ı birlikte günceller', () => {
    const { result } = renderHook(() => useTercihler());

    act(() => {
      result.current.setTema('koyu');
    });

    expect(result.current.tema).toBe('koyu');
    expect(document.documentElement.dataset.tema).toBe('koyu');
    expect(localStorage.getItem(TEMA_ANAHTARI)).toBe('koyu');
  });

  describe('localStorage erişimi patladığında', () => {
    const orijinalSetItem = Storage.prototype.setItem;

    afterEach(() => {
      Storage.prototype.setItem = orijinalSetItem;
    });

    it('state ve DOM yine de güncellenir', () => {
      Storage.prototype.setItem = () => {
        throw new Error('gizli sekme: depolama yok');
      };

      const { result } = renderHook(() => useTercihler());

      act(() => {
        result.current.setTema('koyu');
      });

      expect(result.current.tema).toBe('koyu');
      expect(document.documentElement.dataset.tema).toBe('koyu');
    });
  });
});
