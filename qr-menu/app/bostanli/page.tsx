import type { Metadata } from 'next';

import { QrMenu } from '@/components/QrMenu';
import { BOSTANLI } from '@/data/subeler/bostanli';

export const metadata: Metadata = {
  title: `${BOSTANLI.baslik} | Menü`,
  description: `${BOSTANLI.ad} şubesi menüsü: et ve tavuk tantuni çeşitleri, içecekler ve güncel fiyatlar.`,
};

export default function BostanliSayfasi() {
  return <QrMenu sube={BOSTANLI} />;
}
