import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TercihKontrolleri } from '@/components/TercihKontrolleri';

describe('TercihKontrolleri', () => {
  beforeEach(() => {
    document.documentElement.lang = 'tr';
    document.documentElement.setAttribute('data-tema', 'acik');
  });

  it('iki dil düğmesini gösterir ve aktif olanı işaretler', () => {
    render(<TercihKontrolleri dil="tr" tema="acik" onDil={() => {}} onTema={() => {}} />);

    const tr = screen.getByRole('button', { name: 'Türkçe' });
    const en = screen.getByRole('button', { name: 'English' });

    expect(tr).toHaveAttribute('aria-pressed', 'true');
    expect(en).toHaveAttribute('aria-pressed', 'false');
  });

  it('EN düğmesine basınca onDil("en") çağırır', async () => {
    const onDil = vi.fn();
    render(<TercihKontrolleri dil="tr" tema="acik" onDil={onDil} onTema={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(onDil).toHaveBeenCalledWith('en');
  });

  it('zaten aktif olan dile basınca da aynı dili bildirir', async () => {
    const onDil = vi.fn();
    render(<TercihKontrolleri dil="tr" tema="acik" onDil={onDil} onTema={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: 'Türkçe' }));

    expect(onDil).toHaveBeenCalledWith('tr');
  });

  it('aydınlık temadayken tema düğmesi koyuya geçmeyi önerir', async () => {
    const onTema = vi.fn();
    render(<TercihKontrolleri dil="tr" tema="acik" onDil={() => {}} onTema={onTema} />);

    const dugme = screen.getByRole('button', { name: 'Karanlık temaya geç' });
    await userEvent.click(dugme);

    expect(onTema).toHaveBeenCalledWith('koyu');
  });

  it('koyu temadayken tema düğmesi aydınlığa geçmeyi önerir', async () => {
    const onTema = vi.fn();
    render(<TercihKontrolleri dil="tr" tema="koyu" onDil={() => {}} onTema={onTema} />);

    await userEvent.click(screen.getByRole('button', { name: 'Aydınlık temaya geç' }));

    expect(onTema).toHaveBeenCalledWith('acik');
  });

  it('EN modunda tema düğmesinin etiketi İngilizce olur', () => {
    render(<TercihKontrolleri dil="en" tema="acik" onDil={() => {}} onTema={() => {}} />);

    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });

  it('dil düğmeleri erişilebilir bir grup içinde', () => {
    render(<TercihKontrolleri dil="tr" tema="acik" onDil={() => {}} onTema={() => {}} />);

    expect(screen.getByRole('group', { name: 'Dil seçimi' })).toBeInTheDocument();
  });
});
