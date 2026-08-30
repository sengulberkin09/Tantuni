/* ==========================================================================
   Menü verisi kontrolü — isteğe bağlı, bağımlılık yok.
   Repo kökünden çalıştırın:  node qr/kontrol.js

   Fiyat veya ürün değiştirdikten sonra çalıştırın. Yaygın hataları yakalar:
   diskte olmayan görsel, sıfır/eksi/ondalıklı fiyat, boş çeviri, tekrar eden
   ürün id'si, İngilizce yerine Türkçe metnin yapıştırılması.
   ========================================================================== */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const kok = path.join(__dirname, '..');
const kaynak = fs.readFileSync(path.join(__dirname, 'js', 'menu-verisi.js'), 'utf8');

/* menu-verisi.js düz script; değerleri okumak için çalıştırıp döndürüyoruz. */
const veri = new Function(
  kaynak + ';return {FIYAT_DEGISIM_TARIHI,KATEGORILER,ET_URUNLERI,TAVUK_URUNLERI,ICECEKLER,ARAYUZ};'
)();

let hata = 0;
function bildir(kosul, mesaj) {
  if (!kosul) {
    console.error('  HATA: ' + mesaj);
    hata++;
  }
}

function metinGecerli(m, nerede) {
  bildir(m && typeof m.tr === 'string' && m.tr.trim() !== '', nerede + ' — tr boş');
  bildir(m && typeof m.en === 'string' && m.en.trim() !== '', nerede + ' — en boş');
}

const tantuniler = veri.ET_URUNLERI.concat(veri.TAVUK_URUNLERI);
const tumUrunler = tantuniler.concat(veri.ICECEKLER);

console.log('Menü verisi kontrol ediliyor...\n');

/* Kategoriler */
bildir(veri.KATEGORILER.length === 3, 'üç kategori bekleniyordu');
veri.KATEGORILER.forEach(k => metinGecerli(k.ad, 'kategori ' + k.id));

/* Ürün id benzersizliği */
const idler = tumUrunler.map(u => u.id);
bildir(new Set(idler).size === idler.length, 'tekrar eden ürün id var');

/* Her ürün */
tumUrunler.forEach(u => {
  bildir(typeof u.ad === 'string' && u.ad.trim() !== '', u.id + ' — ad boş');
  const dosya = path.join(kok, u.gorsel.replace(/^\//, ''));
  bildir(fs.existsSync(dosya), u.id + ' — görsel diskte yok: ' + u.gorsel);
});

/* Tantuni ürünleri: açıklama + iki porsiyon */
tantuniler.forEach(u => {
  metinGecerli(u.aciklama, u.id + ' açıklaması');
  /* Türkçe metnin İngilizce alanına yapıştırılması en olası veri hatası. */
  bildir(
    u.aciklama.tr !== u.aciklama.en,
    u.id + ' — tr ve en açıklaması birebir aynı, çeviri unutulmuş olabilir'
  );
  bildir(u.porsiyonlar.length === 2, u.id + ' — tam iki porsiyon olmalı');
  u.porsiyonlar.forEach(p => metinGecerli(p.etiket, u.id + ' porsiyon etiketi'));
  bildir(
    u.porsiyonlar[1].fiyat > u.porsiyonlar[0].fiyat,
    u.id + ' — İçi Bol, Tek porsiyondan pahalı olmalı'
  );
});

/* Fiyatlar */
const fiyatlar = tantuniler
  .reduce((h, u) => h.concat(u.porsiyonlar.map(p => p.fiyat)), [])
  .concat(veri.ICECEKLER.map(u => u.fiyat));
fiyatlar.forEach(f => {
  bildir(Number.isInteger(f) && f > 0, 'geçersiz fiyat: ' + f);
});

/* Arayüz metinleri */
Object.keys(veri.ARAYUZ).forEach(a => metinGecerli(veri.ARAYUZ[a], 'ARAYUZ.' + a));

/* Fiyat değişim tarihi */
bildir(
  /^\d{2}\/\d{2}\/\d{4}$/.test(veri.FIYAT_DEGISIM_TARIHI),
  'fiyat değişim tarihi GG/AA/YYYY biçiminde olmalı: ' + veri.FIYAT_DEGISIM_TARIHI
);

/* Şube dosyaları */
['konak', 'bostanli'].forEach(slug => {
  const dosya = path.join(__dirname, 'js', 'sube-' + slug + '.js');
  bildir(fs.existsSync(dosya), 'şube dosyası yok: ' + dosya);
  if (!fs.existsSync(dosya)) return;

  const sube = new Function(
    fs.readFileSync(dosya, 'utf8') + ';return SUBE;'
  )();
  ['slug', 'ad', 'baslik', 'adres', 'mapsUrl', 'telefonGosterim', 'telefonTel', 'calismaSaatleri']
    .forEach(alan => {
      bildir(
        typeof sube[alan] === 'string' && sube[alan].trim() !== '',
        slug + '.' + alan + ' boş'
      );
    });
  bildir(sube.slug === slug, slug + ' — slug dosya adıyla uyuşmuyor');
  bildir(
    /^\+90\d{10}$/.test(sube.telefonTel),
    slug + '.telefonTel aranabilir biçimde olmalı (+90XXXXXXXXXX): ' + sube.telefonTel
  );
});

if (hata === 0) {
  console.log('Tüm kontroller geçti.');
  console.log(
    '  ' + tantuniler.length + ' tantuni, ' + veri.ICECEKLER.length + ' içecek, ' +
    'fiyat değişim tarihi ' + veri.FIYAT_DEGISIM_TARIHI
  );
  process.exit(0);
}
console.error('\n' + hata + ' sorun bulundu. Yayına almadan önce düzeltin.');
process.exit(1);
