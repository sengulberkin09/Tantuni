import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { ARAYUZ } from '@/data/i18n';
import {
  ET_URUNLERI,
  FIYAT_DEGISIM_TARIHI,
  ICECEKLER,
  KATEGORILER,
  TAVUK_URUNLERI,
} from '@/data/menu';
import { SUBELER } from '@/data/subeler';
import type { Metin } from '@/data/types';

const PUBLIC_DIZINI = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const TANTUNILER = [...ET_URUNLERI, ...TAVUK_URUNLERI];
const TUM_URUNLER = [...TANTUNILER, ...ICECEKLER];

function metinGecerliMi(m: Metin): boolean {
  return typeof m.tr === 'string' && m.tr.trim() !== ''
    && typeof m.en === 'string' && m.en.trim() !== '';
}

describe('menü verisi', () => {
  it('üç kategoriyi doğru sırayla tanımlar', () => {
    expect(KATEGORILER.map((k) => k.id)).toEqual(['et', 'tavuk', 'icecek']);
  });

  it('her kategori adı iki dilde dolu', () => {
    for (const k of KATEGORILER) {
      expect(metinGecerliMi(k.ad), `kategori ${k.id}`).toBe(true);
    }
  });

  it('beklenen ürün sayılarını içerir', () => {
    expect(ET_URUNLERI).toHaveLength(3);
    expect(TAVUK_URUNLERI).toHaveLength(3);
    expect(ICECEKLER).toHaveLength(10);
  });

  it('ürün id\'leri benzersiz', () => {
    const idler = TUM_URUNLER.map((u) => u.id);
    expect(new Set(idler).size).toBe(idler.length);
  });

  it('her ürünün adı boş olmayan bir string', () => {
    for (const u of TUM_URUNLER) {
      expect(typeof u.ad, u.id).toBe('string');
      expect(u.ad.trim(), u.id).not.toBe('');
    }
  });

  it('her ürünün görseli public/ altında gerçekten var', () => {
    for (const u of TUM_URUNLER) {
      expect(u.gorsel.startsWith('/images/'), u.id).toBe(true);
      expect(existsSync(join(PUBLIC_DIZINI, u.gorsel)), `${u.id} -> ${u.gorsel}`).toBe(true);
    }
  });

  it('tantuni ürünlerinde açıklama iki dilde dolu', () => {
    for (const u of TANTUNILER) {
      expect(metinGecerliMi(u.aciklama), u.id).toBe(true);
    }
  });

  it('tantuni ürünlerinde tam iki porsiyon var ve etiketleri iki dilde dolu', () => {
    for (const u of TANTUNILER) {
      expect(u.porsiyonlar, u.id).toHaveLength(2);
      for (const p of u.porsiyonlar) {
        expect(metinGecerliMi(p.etiket), u.id).toBe(true);
      }
    }
  });

  it('her fiyat pozitif tam sayı', () => {
    const fiyatlar = [
      ...TANTUNILER.flatMap((u) => u.porsiyonlar.map((p) => p.fiyat)),
      ...ICECEKLER.map((u) => u.fiyat),
    ];
    for (const f of fiyatlar) {
      expect(Number.isInteger(f)).toBe(true);
      expect(f).toBeGreaterThan(0);
    }
  });

  it('İçi Bol porsiyon her zaman Tek porsiyondan pahalı', () => {
    for (const u of TANTUNILER) {
      expect(u.porsiyonlar[1].fiyat, u.id).toBeGreaterThan(u.porsiyonlar[0].fiyat);
    }
  });

  it('brief\'teki fiyatları birebir taşır', () => {
    const fiyatlariAl = (id: string) => {
      const u = TANTUNILER.find((x) => x.id === id);
      if (!u) throw new Error(`ürün yok: ${id}`);
      return u.porsiyonlar.map((p) => p.fiyat);
    };
    expect(fiyatlariAl('et-durum')).toEqual([330, 460]);
    expect(fiyatlariAl('et-ekmek-arasi')).toEqual([330, 460]);
    expect(fiyatlariAl('et-yogurtlu')).toEqual([420, 600]);
    expect(fiyatlariAl('tavuk-durum')).toEqual([240, 330]);
    expect(fiyatlariAl('tavuk-ekmek-arasi')).toEqual([240, 330]);
    expect(fiyatlariAl('tavuk-yogurtlu')).toEqual([320, 450]);

    const icecekFiyati = (id: string) => ICECEKLER.find((x) => x.id === id)?.fiyat;
    expect(icecekFiyati('ayran')).toBe(70);
    expect(icecekFiyati('salgam')).toBe(70);
    expect(icecekFiyati('nigde-gazozu')).toBe(70);
    expect(icecekFiyati('kola')).toBe(90);
    expect(icecekFiyati('fanta')).toBe(90);
    expect(icecekFiyati('ice-tea')).toBe(90);
    expect(icecekFiyati('sprite')).toBe(90);
    expect(icecekFiyati('meyve-suyu')).toBe(90);
    expect(icecekFiyati('maden-suyu')).toBe(40);
    expect(icecekFiyati('su')).toBe(25);
  });

  it('fiyat değişim tarihi spec ile aynı', () => {
    expect(FIYAT_DEGISIM_TARIHI).toBe('15/08/2026');
  });
});

describe('arayüz metinleri', () => {
  it('her girdi iki dilde dolu', () => {
    for (const [anahtar, metin] of Object.entries(ARAYUZ)) {
      expect(metinGecerliMi(metin), anahtar).toBe(true);
    }
  });
});

describe('şubeler', () => {
  it('tam iki şube var ve slug\'ları çakışmıyor', () => {
    expect(SUBELER).toHaveLength(2);
    expect(new Set(SUBELER.map((s) => s.slug)).size).toBe(2);
  });

  it('her şubede zorunlu alanların hepsi dolu', () => {
    const alanlar = [
      'slug', 'ad', 'baslik', 'adres', 'mapsUrl',
      'telefonGosterim', 'telefonTel', 'calismaSaatleri',
    ] as const;
    for (const s of SUBELER) {
      for (const alan of alanlar) {
        expect(typeof s[alan], `${s.slug}.${alan}`).toBe('string');
        expect(s[alan].trim(), `${s.slug}.${alan}`).not.toBe('');
      }
    }
  });

  it('telefonTel alanı aranabilir biçimde', () => {
    for (const s of SUBELER) {
      expect(s.telefonTel, s.slug).toMatch(/^\+90\d{10}$/);
    }
  });

  it('mapsUrl adresi kodlanmış olarak taşır', () => {
    for (const s of SUBELER) {
      expect(s.mapsUrl).toContain('https://www.google.com/maps/search/?api=1&query=');
      expect(s.mapsUrl).toContain(encodeURIComponent(s.adres));
    }
  });

  it('şube bilgileri brief ile birebir aynı', () => {
    const konak = SUBELER.find((s) => s.slug === 'konak')!;
    expect(konak.baslik).toBe('Hisarönü Tantuni Yakup Usta - Konak');
    expect(konak.adres).toBe('Konak, 902. Sk. No:7, 35250 Konak/İzmir');
    expect(konak.telefonGosterim).toBe('0552 888 35 33');
    expect(konak.telefonTel).toBe('+905528883533');
    expect(konak.calismaSaatleri).toBe('Her gün 10:30 – 20:15');

    const bostanli = SUBELER.find((s) => s.slug === 'bostanli')!;
    expect(bostanli.baslik).toBe('Hisarönü Tantuni Yakup Usta - Bostanlı');
    expect(bostanli.adres).toBe('Bostanlı, Cemal Gürsel Cd. No:530B, 35590 Karşıyaka/İzmir');
    expect(bostanli.telefonGosterim).toBe('+90 541 762 37 75');
    expect(bostanli.telefonTel).toBe('+905417623775');
    expect(bostanli.calismaSaatleri).toBe('Her gün, kapanış 01:30');
  });
});
