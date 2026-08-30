import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IcecekKarti } from '@/components/IcecekKarti';
import { UrunKarti } from '@/components/UrunKarti';
import type { IcecekUrun, TantuniUrun } from '@/data/types';

const TANTUNI: TantuniUrun = {
  id: 'et-durum',
  ad: 'Et Dürüm',
  aciklama: {
    tr: 'İnce lavaşta bol sebzeli, baharatlı et tantuni.',
    en: 'Spiced beef tantuni with plenty of vegetables in thin lavash.',
  },
  gorsel: '/images/menu/et-tantuni-durum.webp',
  porsiyonlar: [
    { etiket: { tr: 'Tek · 60 gr', en: 'Single · 60 g' }, fiyat: 330 },
    { etiket: { tr: 'İçi Bol · 90 gr', en: 'Extra Filling · 90 g' }, fiyat: 460 },
  ],
};

const ICECEK: IcecekUrun = {
  id: 'ayran',
  ad: 'Ayran',
  gorsel: '/images/menu/ayran.webp',
  fiyat: 70,
};

describe('UrunKarti', () => {
  it('ürün adını başlık olarak gösterir', () => {
    render(<UrunKarti urun={TANTUNI} dil="tr" />);
    expect(screen.getByRole('heading', { name: 'Et Dürüm' })).toBeInTheDocument();
  });

  it('İngilizce modda ürün adı Türkçe kalır', () => {
    render(<UrunKarti urun={TANTUNI} dil="en" />);
    expect(screen.getByRole('heading', { name: 'Et Dürüm' })).toBeInTheDocument();
    expect(screen.queryByText('Beef Wrap')).not.toBeInTheDocument();
  });

  it('açıklamayı seçili dilde gösterir', () => {
    const { rerender } = render(<UrunKarti urun={TANTUNI} dil="tr" />);
    expect(screen.getByText(TANTUNI.aciklama.tr)).toBeInTheDocument();

    rerender(<UrunKarti urun={TANTUNI} dil="en" />);
    expect(screen.getByText(TANTUNI.aciklama.en)).toBeInTheDocument();
    expect(screen.queryByText(TANTUNI.aciklama.tr)).not.toBeInTheDocument();
  });

  it('iki porsiyonu etiketi ve fiyatıyla gösterir', () => {
    render(<UrunKarti urun={TANTUNI} dil="tr" />);
    expect(screen.getByText('Tek · 60 gr')).toBeInTheDocument();
    expect(screen.getByText('₺330')).toBeInTheDocument();
    expect(screen.getByText('İçi Bol · 90 gr')).toBeInTheDocument();
    expect(screen.getByText('₺460')).toBeInTheDocument();
  });

  it('porsiyon etiketlerini İngilizce moda çevirir', () => {
    render(<UrunKarti urun={TANTUNI} dil="en" />);
    expect(screen.getByText('Single · 60 g')).toBeInTheDocument();
    expect(screen.getByText('Extra Filling · 90 g')).toBeInTheDocument();
  });

  it('görsel alt metni her dilde Türkçe ürün adı', () => {
    const { rerender } = render(<UrunKarti urun={TANTUNI} dil="tr" />);
    expect(screen.getByAltText('Et Dürüm')).toBeInTheDocument();

    rerender(<UrunKarti urun={TANTUNI} dil="en" />);
    expect(screen.getByAltText('Et Dürüm')).toBeInTheDocument();
  });

  it('sipariş/sepet düğmesi içermez', () => {
    render(<UrunKarti urun={TANTUNI} dil="tr" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('IcecekKarti', () => {
  it('adı ve tek fiyatı gösterir', () => {
    render(<IcecekKarti urun={ICECEK} />);
    expect(screen.getByText('Ayran')).toBeInTheDocument();
    expect(screen.getByText('₺70')).toBeInTheDocument();
  });

  it('görsel alt metni ürün adı', () => {
    render(<IcecekKarti urun={ICECEK} />);
    expect(screen.getByAltText('Ayran')).toBeInTheDocument();
  });
});
