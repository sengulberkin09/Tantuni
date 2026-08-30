import Image from 'next/image';

import type { IcecekUrun } from '@/data/types';
import { TEMEL_YOL } from '@/lib/temel-yol';

type Props = {
  urun: IcecekUrun;
};

export function IcecekKarti({ urun }: Props) {
  return (
    <article className="icecek-karti">
      <Image
        className="icecek-gorsel"
        src={`${TEMEL_YOL}${urun.gorsel}`}
        alt={urun.ad}
        width={56}
        height={56}
        unoptimized
        loading="lazy"
      />
      <span className="icecek-ad">{urun.ad}</span>
      <span className="icecek-fiyat">{`₺${urun.fiyat}`}</span>
    </article>
  );
}
