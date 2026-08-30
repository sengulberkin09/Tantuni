import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { QrMenu } from '@/components/QrMenu';
import { ET_URUNLERI, TAVUK_URUNLERI } from '@/data/menu';
import { KONAK } from '@/data/subeler/konak';

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

afterEach(() => {
  localStorage.clear();
});

describe('QrMenu — başlık ve şube bilgisi', () => {
  it('şube başlığını gösterir', () => {
    render(<QrMenu sube={KONAK} />);
    expect(screen.getByRole('heading', { level: 1, name: KONAK.baslik })).toBeInTheDocument();
  });

  it('adres, çalışma saatleri ve telefonu gösterir', () => {
    render(<QrMenu sube={KONAK} />);
    expect(screen.getByText(KONAK.adres)).toBeInTheDocument();
    expect(screen.getByText(KONAK.calismaSaatleri)).toBeInTheDocument();
    expect(screen.getByText(KONAK.telefonGosterim)).toBeInTheDocument();
  });

  it('telefonu tel: linki olarak verir', () => {
    render(<QrMenu sube={KONAK} />);
    const link = screen.getByRole('link', { name: KONAK.telefonGosterim });
    expect(link).toHaveAttribute('href', `tel:${KONAK.telefonTel}`);
  });

  it('fiyat değişim tarihini gösterir', () => {
    render(<QrMenu sube={KONAK} />);
    expect(screen.getByText(/15\/08\/2026/)).toBeInTheDocument();
  });
});

describe('QrMenu — kategori filtresi', () => {
  it('üç sekmeyi tablist içinde sunar', () => {
    render(<QrMenu sube={KONAK} />);
    const sekmeler = within(screen.getByRole('tablist')).getAllByRole('tab');
    expect(sekmeler.map((s) => s.textContent)).toEqual([
      'Et Ürünleri', 'Tavuk Ürünleri', 'İçecekler',
    ]);
  });

  it('açılışta Et Ürünleri sekmesi seçili', () => {
    render(<QrMenu sube={KONAK} />);
    expect(screen.getByRole('tab', { name: 'Et Ürünleri' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'İçecekler' })).toHaveAttribute('aria-selected', 'false');
  });

  it('sekmeye basınca aktif kategori değişir', async () => {
    render(<QrMenu sube={KONAK} />);

    await userEvent.click(screen.getByRole('tab', { name: 'İçecekler' }));

    expect(screen.getByRole('tab', { name: 'İçecekler' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Et Ürünleri' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByTestId('paneller')).toHaveAttribute('data-aktif', 'icecek');
  });

  it('sağ ok tuşu sonraki sekmeye geçer', async () => {
    render(<QrMenu sube={KONAK} />);

    screen.getByRole('tab', { name: 'Et Ürünleri' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Tavuk Ürünleri' })).toHaveAttribute('aria-selected', 'true');
  });

  it('sol ok tuşu ilk sekmeden sonuncuya sarar', async () => {
    render(<QrMenu sube={KONAK} />);

    screen.getByRole('tab', { name: 'Et Ürünleri' }).focus();
    await userEvent.keyboard('{ArrowLeft}');

    expect(screen.getByRole('tab', { name: 'İçecekler' })).toHaveAttribute('aria-selected', 'true');
  });

  it('üç panelin üçünü de DOM\'a basar (JS kapalı senaryosu)', () => {
    render(<QrMenu sube={KONAK} />);
    expect(screen.getByText('Et Dürüm')).toBeInTheDocument();
    expect(screen.getByText('Tavuk Dürüm')).toBeInTheDocument();
    expect(screen.getByText('Ayran')).toBeInTheDocument();
  });
});

describe('QrMenu — dil geçişi', () => {
  it('EN\'e geçince açıklamalar ve sekmeler çevrilir, ürün adları Türkçe kalır', async () => {
    render(<QrMenu sube={KONAK} />);

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('tab', { name: 'Meat' })).toBeInTheDocument();
    // Porsiyon etiketi tum tantuni urunlerinde ortak; uc panel de DOM'a
    // oldugu icin her birinde bir kez gorunmeli.
    const tantuniSayisi = ET_URUNLERI.length + TAVUK_URUNLERI.length;
    expect(screen.getAllByText('Single · 60 g')).toHaveLength(tantuniSayisi);
    // Ürün adı çevrilmiyor:
    expect(screen.getByText('Et Dürüm')).toBeInTheDocument();
  });

  it('EN modunda adres ve çalışma saatleri Türkçe kalır', async () => {
    render(<QrMenu sube={KONAK} />);

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText(KONAK.calismaSaatleri)).toBeInTheDocument();
  });

  it('dil seçimini localStorage\'a yazar', async () => {
    render(<QrMenu sube={KONAK} />);

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(localStorage.getItem('tantuni-qr-dil')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});

describe('QrMenu — tema geçişi', () => {
  it('tema düğmesi html üzerindeki data-tema değerini değiştirir', async () => {
    render(<QrMenu sube={KONAK} />);

    await userEvent.click(screen.getByRole('button', { name: 'Karanlık temaya geç' }));

    expect(document.documentElement.getAttribute('data-tema')).toBe('koyu');
    expect(localStorage.getItem('tantuni-qr-tema')).toBe('koyu');
  });
});

describe('QrMenu — sipariş yok', () => {
  it('sipariş, sepet veya ödeme metni içermez', () => {
    const { container } = render(<QrMenu sube={KONAK} />);
    const metin = container.textContent ?? '';
    for (const yasak of ['Sipariş', 'Sepet', 'Ödeme', 'Trendyol', 'Yemeksepeti']) {
      expect(metin).not.toContain(yasak);
    }
  });
});
