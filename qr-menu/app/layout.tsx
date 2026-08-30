import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { TERCIH_SCRIPTI } from '@/lib/tercihler';
import { TEMEL_YOL } from '@/lib/temel-yol';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hisarönü Tantuni Yakup Usta',
  // QR menü, mevcut menu.html ile aynı içeriği taşıyor; arama sonuçlarında
  // ana site görünsün diye bu sayfalar indekslenmiyor.
  robots: { index: false, follow: false },
  icons: { icon: `${TEMEL_YOL}/images/logo.webp` },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e85d2c',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;0,900;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Sayfa boyanmadan dil ve temayı ayarlar — flash önleme. */}
        <script dangerouslySetInnerHTML={{ __html: TERCIH_SCRIPTI }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
