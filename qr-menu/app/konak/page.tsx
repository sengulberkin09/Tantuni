import type { Metadata } from 'next';

import { QrMenu } from '@/components/QrMenu';
import { KONAK } from '@/data/subeler/konak';

export const metadata: Metadata = {
  title: `${KONAK.baslik} | Menü`,
  description: `${KONAK.ad} şubesi menüsü: et ve tavuk tantuni çeşitleri, içecekler ve güncel fiyatlar.`,
};

export default function KonakSayfasi() {
  return <QrMenu sube={KONAK} />;
}
