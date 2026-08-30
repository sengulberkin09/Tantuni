import type { ReactNode } from 'react';

export const metadata = { title: 'Hisarönü Tantuni Yakup Usta' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
