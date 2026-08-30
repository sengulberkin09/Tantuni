import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ARAYUZ } from '@/data/i18n';
import { SUBELER } from '@/data/subeler';
import { TEMEL_YOL } from '@/lib/temel-yol';

export const metadata: Metadata = {
  title: 'Hisarönü Tantuni Yakup Usta | Menü',
  description: 'Konak ve Bostanlı şubelerinin QR menüleri.',
};

export default function SubeSecimSayfasi() {
  return (
    <div className="kabuk sube-secim">
      <Image
        className="logo secim-logo"
        src={`${TEMEL_YOL}/images/logo.webp`}
        alt="Hisarönü Tantuni Yakup Usta logosu"
        width={72}
        height={72}
        unoptimized
        priority
      />
      <h1 className="secim-baslik">Hisarönü Tantuni Yakup Usta</h1>
      <p className="secim-alt">{ARAYUZ.subeSec.tr}</p>

      <nav className="secim-listesi">
        {SUBELER.map((sube) => (
          <Link key={sube.slug} className="secim-karti" href={`/${sube.slug}/`}>
            <span className="secim-sube-ad">{sube.ad}</span>
            <span className="secim-sube-adres">{sube.adres}</span>
            <span className="secim-sube-saat">{sube.calismaSaatleri}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
