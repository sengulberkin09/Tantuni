/* ==========================================================================
   Önbellek kırıcı sürüm damgası — bağımlılık yok.
   Repo kökünden çalıştırın:  node qr/surum.js

   NEDEN GEREKLİ
   GitHub Pages dosyaları "Cache-Control: max-age=600" ile servis ediyor ve
   dosya adlarımız hiç değişmiyor. Bir ziyaretçi sayfayı bir kez açtıktan
   sonra tarayıcısı qr-menu.js ve qr-menu.css'i önbellekte tutuyor; siz
   fiyatı değiştirip yayınlasanız bile o ziyaretçi eski fiyatı görmeye devam
   edebiliyor.

   NE YAPIYOR
   Her css/js dosyasının içeriğinden kısa bir özet (hash) çıkarıp HTML'deki
   bağlantıya "?v=..." olarak yazıyor. İçerik değişince adres de değişiyor,
   tarayıcı dosyayı yeniden indiriyor. İçerik değişmemişse damga da aynı
   kalıyor, gereksiz indirme olmuyor.

   NE ZAMAN ÇALIŞTIRILIR
   qr/js/ veya qr/css/ altında bir dosyayı her değiştirdiğinizde, commit'ten
   önce. Unutursanız "node qr/kontrol.js" uyarır.
   ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const qrDizini = __dirname;
const SAYFALAR = ['index.html', 'konak/index.html', 'bostanli/index.html'];

/* "/qr/js/qr-menu.js" gibi bir yolu diskteki dosyaya çevirir. */
function diskYolu(webYolu) {
  return path.join(qrDizini, webYolu.replace(/^\/qr\//, ''));
}

function damga(dosya) {
  return crypto
    .createHash('sha1')
    .update(fs.readFileSync(dosya))
    .digest('hex')
    .slice(0, 8);
}

/* href/src içindeki /qr/... css ve js bağlantılarını yakalar, ?v= kısmı olsun ya da olmasın. */
const BAGLANTI = /(href|src)="(\/qr\/(?:css|js)\/[^"?]+\.(?:css|js))(\?v=[^"]*)?"/g;

/**
 * @param {boolean} yaz  true ise dosyayı günceller, false ise yalnızca kontrol eder.
 * @returns {{guncellenen: string[], eksik: string[]}}
 */
function surumleriIsle(yaz) {
  const guncellenen = [];
  const eksik = [];

  for (const sayfa of SAYFALAR) {
    const tamYol = path.join(qrDizini, sayfa);
    const once = fs.readFileSync(tamYol, 'utf8');

    const sonra = once.replace(BAGLANTI, (tam, nitelik, yol, mevcut) => {
      const dosya = diskYolu(yol);
      if (!fs.existsSync(dosya)) {
        eksik.push(sayfa + ' -> ' + yol);
        return tam;
      }
      const yeni = '?v=' + damga(dosya);
      if (mevcut !== yeni) guncellenen.push(sayfa + ' -> ' + yol + ' ' + yeni);
      return nitelik + '="' + yol + yeni + '"';
    });

    if (yaz && sonra !== once) fs.writeFileSync(tamYol, sonra);
  }

  return { guncellenen, eksik };
}

module.exports = { surumleriIsle };

/* Doğrudan çalıştırıldıysa dosyaları güncelle. */
if (require.main === module) {
  const { guncellenen, eksik } = surumleriIsle(true);

  eksik.forEach(e => console.error('  HATA: bağlantı diskte yok — ' + e));

  if (guncellenen.length === 0) {
    console.log('Sürüm damgaları zaten güncel.');
  } else {
    console.log('Sürüm damgası güncellendi:');
    guncellenen.forEach(g => console.log('  ' + g));
    console.log('\nGüncellenen HTML dosyalarını da commit etmeyi unutmayın.');
  }

  process.exit(eksik.length ? 1 : 0);
}
