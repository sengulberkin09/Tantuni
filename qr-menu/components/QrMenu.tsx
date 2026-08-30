'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { IcecekKarti } from '@/components/IcecekKarti';
import { TercihKontrolleri } from '@/components/TercihKontrolleri';
import { UrunKarti } from '@/components/UrunKarti';
import { useTercihler } from '@/components/useTercihler';
import { ARAYUZ } from '@/data/i18n';
import { TEMEL_YOL } from '@/lib/temel-yol';
import {
  ET_URUNLERI,
  FIYAT_DEGISIM_TARIHI,
  ICECEKLER,
  KATEGORILER,
  TAVUK_URUNLERI,
} from '@/data/menu';
import type { KategoriId, Sube } from '@/data/types';

/**
 * JS kapalıyken üç paneli de açar; aksi halde CSS yalnızca aktif olanı gösterir.
 * display değeri .urun-listesi / .icecek-listesi ile aynı kalmalı (grid) —
 * block yaparsanız kartların gap'i ve içeceklerin iki sütunlu düzeni bozulur.
 */
const NOSCRIPT_STILI = '.panel { display: grid !important; }';

export function QrMenu({ sube }: { sube: Sube }) {
  const { dil, tema, setDil, setTema } = useTercihler();
  const [aktif, setAktif] = useState<KategoriId>('et');
  const sekmeRefleri = useRef<Record<string, HTMLButtonElement | null>>({});

  function okTusu(olay: React.KeyboardEvent<HTMLButtonElement>) {
    const yon = olay.key === 'ArrowRight' ? 1 : olay.key === 'ArrowLeft' ? -1 : 0;
    if (yon === 0) return;
    olay.preventDefault();

    const suanki = KATEGORILER.findIndex((k) => k.id === aktif);
    const sonraki = KATEGORILER[(suanki + yon + KATEGORILER.length) % KATEGORILER.length];
    setAktif(sonraki.id);
    sekmeRefleri.current[sonraki.id]?.focus();
  }

  return (
    <div className="kabuk">
      <noscript><style>{NOSCRIPT_STILI}</style></noscript>

      <header className="baslik">
        <div className="baslik-ust">
          <Image
            className="logo"
            src={`${TEMEL_YOL}/images/logo.webp`}
            alt="Hisarönü Tantuni Yakup Usta logosu"
            width={48}
            height={48}
            unoptimized
            priority
          />
          <TercihKontrolleri dil={dil} tema={tema} onDil={setDil} onTema={setTema} />
        </div>
        <h1 className="sube-baslik">{sube.baslik}</h1>
      </header>

      <div className="sekmeler" role="tablist" aria-label={ARAYUZ.kategoriler[dil]}>
        {KATEGORILER.map((kategori) => {
          const secili = kategori.id === aktif;
          return (
            <button
              key={kategori.id}
              ref={(el) => { sekmeRefleri.current[kategori.id] = el; }}
              type="button"
              role="tab"
              id={`sekme-${kategori.id}`}
              aria-controls={`panel-${kategori.id}`}
              aria-selected={secili}
              tabIndex={secili ? 0 : -1}
              className="sekme"
              onClick={() => setAktif(kategori.id)}
              onKeyDown={okTusu}
            >
              {kategori.ad[dil]}
            </button>
          );
        })}
      </div>

      <main className="paneller" data-aktif={aktif} data-testid="paneller">
        <section
          className="panel urun-listesi"
          id="panel-et"
          role="tabpanel"
          aria-labelledby="sekme-et"
          tabIndex={0}
        >
          {ET_URUNLERI.map((urun, sira) => (
            <UrunKarti key={urun.id} urun={urun} dil={dil} oncelikli={sira === 0} />
          ))}
        </section>

        <section
          className="panel urun-listesi"
          id="panel-tavuk"
          role="tabpanel"
          aria-labelledby="sekme-tavuk"
          tabIndex={0}
        >
          {TAVUK_URUNLERI.map((urun) => (
            <UrunKarti key={urun.id} urun={urun} dil={dil} />
          ))}
        </section>

        <section
          className="panel icecek-listesi"
          id="panel-icecek"
          role="tabpanel"
          aria-labelledby="sekme-icecek"
          tabIndex={0}
        >
          {ICECEKLER.map((urun) => (
            <IcecekKarti key={urun.id} urun={urun} />
          ))}
        </section>
      </main>

      <footer className="alt-bilgi">
        <dl className="sube-bilgi">
          <dt>{ARAYUZ.adres[dil]}</dt>
          <dd>
            {/* Adres kendi span'inde: testler ve ekran okuyucular için
                "Yol tarifi" etiketinden ayrı bir metin düğümü olmalı. */}
            <a href={sube.mapsUrl} target="_blank" rel="noopener noreferrer">
              <span className="adres-metni">{sube.adres}</span>
              <span className="yol-tarifi">{ARAYUZ.yolTarifi[dil]}</span>
            </a>
          </dd>

          <dt>{ARAYUZ.calismaSaatleri[dil]}</dt>
          <dd>{sube.calismaSaatleri}</dd>

          <dt>{ARAYUZ.telefon[dil]}</dt>
          <dd><a href={`tel:${sube.telefonTel}`}>{sube.telefonGosterim}</a></dd>
        </dl>

        <p className="fiyat-tarihi">
          {`${ARAYUZ.fiyatDegisimTarihi[dil]}: ${FIYAT_DEGISIM_TARIHI}`}
        </p>
      </footer>
    </div>
  );
}
