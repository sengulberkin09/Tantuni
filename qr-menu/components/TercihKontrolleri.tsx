'use client';

import { ARAYUZ } from '@/data/i18n';
import type { Dil } from '@/data/types';
import type { Tema } from '@/lib/tercihler';

type Props = {
  dil: Dil;
  tema: Tema;
  onDil: (d: Dil) => void;
  onTema: (t: Tema) => void;
};

const DILLER: { kod: Dil; kisa: string; tamAd: string }[] = [
  { kod: 'tr', kisa: 'TR', tamAd: 'Türkçe' },
  { kod: 'en', kisa: 'EN', tamAd: 'English' },
];

export function TercihKontrolleri({ dil, tema, onDil, onTema }: Props) {
  const sonrakiTema: Tema = tema === 'acik' ? 'koyu' : 'acik';
  const temaEtiketi =
    tema === 'acik' ? ARAYUZ.temayaGecKoyu[dil] : ARAYUZ.temayaGecAcik[dil];

  return (
    <div className="tercihler">
      <div className="dil-secici" role="group" aria-label={ARAYUZ.dilSecimi[dil]}>
        {DILLER.map(({ kod, kisa, tamAd }) => (
          <button
            key={kod}
            type="button"
            className="dil-dugme"
            aria-pressed={kod === dil}
            aria-label={tamAd}
            onClick={() => onDil(kod)}
          >
            {kisa}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="tema-dugme"
        aria-label={temaEtiketi}
        title={temaEtiketi}
        onClick={() => onTema(sonrakiTema)}
      >
        {tema === 'acik' ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
