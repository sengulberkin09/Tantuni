import Image from 'next/image';

import type { Dil, TantuniUrun } from '@/data/types';

type Props = {
  urun: TantuniUrun;
  dil: Dil;
  /** İlk kart için lazy-loading kapatılır. */
  oncelikli?: boolean;
};

export function UrunKarti({ urun, dil, oncelikli = false }: Props) {
  return (
    <article className="urun-karti">
      <Image
        className="urun-gorsel"
        src={urun.gorsel}
        // Ürün adları çevrilmediği için alt metin de her dilde Türkçe.
        alt={urun.ad}
        width={92}
        height={92}
        unoptimized
        priority={oncelikli}
        loading={oncelikli ? undefined : 'lazy'}
      />

      <div className="urun-govde">
        <h3 className="urun-ad">{urun.ad}</h3>
        <p className="urun-aciklama">{urun.aciklama[dil]}</p>

        <div className="porsiyonlar">
          {urun.porsiyonlar.map((porsiyon) => (
            <span className="porsiyon" key={porsiyon.etiket.tr}>
              <span className="porsiyon-etiket">{porsiyon.etiket[dil]}</span>
              <span className="porsiyon-fiyat">{`₺${porsiyon.fiyat}`}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
