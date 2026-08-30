import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import BostanliSayfasi, { metadata as bostanliMeta } from '@/app/bostanli/page';
import KonakSayfasi, { metadata as konakMeta } from '@/app/konak/page';
import SubeSecimSayfasi from '@/app/page';
import { BOSTANLI, KONAK } from '@/data/subeler';

beforeEach(() => {
  document.documentElement.lang = 'tr';
  document.documentElement.setAttribute('data-tema', 'acik');
  window.matchMedia = ((sorgu: string) => ({
    matches: false,
    media: sorgu,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
});

describe('Konak sayfası', () => {
  it('yalnızca Konak şubesinin bilgilerini gösterir', () => {
    render(<KonakSayfasi />);
    expect(screen.getByRole('heading', { level: 1, name: KONAK.baslik })).toBeInTheDocument();
    expect(screen.getByText(KONAK.adres)).toBeInTheDocument();
    expect(screen.queryByText(BOSTANLI.adres)).not.toBeInTheDocument();
    expect(screen.queryByText(BOSTANLI.telefonGosterim)).not.toBeInTheDocument();
  });

  it('başlık metadata\'sı şube adını taşır', () => {
    expect(konakMeta.title).toContain('Konak');
  });
});

describe('Bostanlı sayfası', () => {
  it('yalnızca Bostanlı şubesinin bilgilerini gösterir', () => {
    render(<BostanliSayfasi />);
    expect(screen.getByRole('heading', { level: 1, name: BOSTANLI.baslik })).toBeInTheDocument();
    expect(screen.getByText(BOSTANLI.adres)).toBeInTheDocument();
    expect(screen.queryByText(KONAK.adres)).not.toBeInTheDocument();
    expect(screen.queryByText(KONAK.telefonGosterim)).not.toBeInTheDocument();
  });

  it('başlık metadata\'sı şube adını taşır', () => {
    expect(bostanliMeta.title).toContain('Bostanlı');
  });
});

describe('Şube seçim sayfası', () => {
  it('iki şubeye de link verir', () => {
    render(<SubeSecimSayfasi />);

    // href testte "/konak", build'de "/qr/konak/" olur: next/link sondaki
    // egik cizgiyi __NEXT_TRAILING_SLASH tanimli degilken kirpiyor, basePath'i
    // de yalnizca build sirasinda ekliyor. Burada dogrulanan sey yonlendirme
    // hedefi; gercek uretim URL'i Task 8'de build ciktisi uzerinden kontrol edilir.
    expect(screen.getByRole('link', { name: /Konak/ }).getAttribute('href'))
      .toMatch(/^\/konak\/?$/);
    expect(screen.getByRole('link', { name: /Bostanlı/ }).getAttribute('href'))
      .toMatch(/^\/bostanli\/?$/);
  });

  it('her iki şubenin çalışma saatlerini gösterir', () => {
    render(<SubeSecimSayfasi />);
    for (const sube of [KONAK, BOSTANLI]) {
      expect(screen.getByText(sube.calismaSaatleri)).toBeInTheDocument();
    }
  });
});
