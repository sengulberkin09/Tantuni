import type { NextConfig } from 'next';

import { TEMEL_YOL } from './lib/temel-yol';

const nextConfig: NextConfig = {
  // GitHub Pages statik dosya servis ediyor: sunucu yok, export şart.
  output: 'export',
  // Sayfalar repo kökündeki qr/ klasöründen, yani /qr/ altından servis edilecek.
  basePath: TEMEL_YOL,
  // /qr/konak/ isteğinin konak/index.html'e düşmesi için.
  trailingSlash: true,
  // Statik export'ta Next'in görsel optimizasyon sunucusu yok.
  images: { unoptimized: true },
};

export default nextConfig;
