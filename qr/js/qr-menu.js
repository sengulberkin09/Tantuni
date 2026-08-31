/* ==========================================================================
   QR Menü — render ve etkileşim
   menu-verisi.js ve sube-*.js dosyalarından beslenir.
   ========================================================================== */
(function () {
  'use strict';

  var DIL_ANAHTARI = 'tantuni-qr-dil';
  var TEMA_ANAHTARI = 'tantuni-qr-tema';

  var kok = document.documentElement;
  var dil = (kok.lang === 'en') ? 'en' : 'tr';
  var aktifKategori = 'et';

  /* ---------- Yardımcılar ---------- */

  function kayitaYaz(anahtar, deger) {
    try {
      localStorage.setItem(anahtar, deger);
    } catch (e) {
      /* Gizli sekmede localStorage yazılamaz; tercih bu oturumda yaşar. */
    }
  }

  function el(etiket, sinif) {
    var d = document.createElement(etiket);
    if (sinif) d.className = sinif;
    return d;
  }

  function metin(etiket, sinif, icerik) {
    var d = el(etiket, sinif);
    d.textContent = icerik;
    return d;
  }

  function gorselKur(src, alt, boyut, oncelikli) {
    var img = el('img');
    img.src = src;
    img.alt = alt;
    img.width = boyut;
    img.height = boyut;
    img.decoding = 'async';
    if (!oncelikli) img.loading = 'lazy';
    return img;
  }

  function fiyatYaz(tl) {
    return '₺' + tl;
  }

  /* ---------- Lightbox ----------
     Fotoğrafa dokununca büyük halini gösterir. Katman bir kez kurulup
     body'ye ekleniyor; dil değişince yeniden çizilmiyor. */

  var lightbox = null;
  var lightboxuAcan = null;

  function lightboxKur() {
    if (lightbox) return lightbox;

    var katman = el('div', 'lightbox');
    katman.hidden = true;
    katman.setAttribute('role', 'dialog');
    katman.setAttribute('aria-modal', 'true');

    var kutu = el('div', 'lightbox-kutu');
    var resim = el('img', 'lightbox-resim');
    kutu.appendChild(resim);

    var ad = el('p', 'lightbox-ad');
    kutu.appendChild(ad);
    katman.appendChild(kutu);

    var kapat = el('button', 'lightbox-kapat');
    kapat.type = 'button';
    kapat.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    kapat.addEventListener('click', lightboxKapat);
    katman.appendChild(kapat);

    /* Görselin dışına dokununca kapansın. */
    katman.addEventListener('click', function (olay) {
      if (olay.target === katman || olay.target === kutu) lightboxKapat();
    });

    /* Katmanda tek odaklanabilir öğe var; Tab dışarı kaçmasın. */
    katman.addEventListener('keydown', function (olay) {
      if (olay.key === 'Escape') {
        lightboxKapat();
      } else if (olay.key === 'Tab') {
        olay.preventDefault();
        kapat.focus();
      }
    });

    document.body.appendChild(katman);
    lightbox = { katman: katman, resim: resim, ad: ad, kapat: kapat };
    return lightbox;
  }

  function lightboxAc(urun, acanDugme) {
    var lb = lightboxKur();
    lb.resim.src = urun.gorsel;
    lb.resim.alt = urun.ad[dil];
    lb.ad.textContent = urun.ad[dil];
    lb.katman.setAttribute('aria-label', urun.ad[dil]);
    lb.kapat.setAttribute('aria-label', ARAYUZ.kapat[dil]);
    lb.kapat.title = ARAYUZ.kapat[dil];

    lb.katman.hidden = false;
    document.body.classList.add('lightbox-acik');
    lightboxuAcan = acanDugme || null;
    lb.kapat.focus();
  }

  function lightboxKapat() {
    if (!lightbox || lightbox.katman.hidden) return;
    lightbox.katman.hidden = true;
    document.body.classList.remove('lightbox-acik');

    /* Odağı fotoğrafa geri ver; dil değişmişse düğme kopmuş olabilir. */
    if (lightboxuAcan && lightboxuAcan.isConnected) lightboxuAcan.focus();
    lightboxuAcan = null;
  }

  /* Görseli tıklanabilir düğmeye sarar. */
  function gorselDugmesi(urun, boyut, sinif, oncelikli) {
    var dugme = el('button', 'gorsel-dugme');
    dugme.type = 'button';
    dugme.setAttribute('aria-label', ARAYUZ.gorseliBuyut[dil] + ': ' + urun.ad[dil]);

    var img = gorselKur(urun.gorsel, urun.ad[dil], boyut, oncelikli);
    img.className = sinif;
    dugme.appendChild(img);

    dugme.addEventListener('click', function () {
      lightboxAc(urun, dugme);
    });
    return dugme;
  }

  /* ---------- Kart yapıcılar ---------- */

  function tantuniKarti(urun, oncelikli) {
    var kart = el('article', 'urun-karti');

    kart.appendChild(gorselDugmesi(urun, 92, 'urun-gorsel', oncelikli));

    var govde = el('div', 'urun-govde');

    govde.appendChild(metin('h2', 'urun-ad', urun.ad[dil]));

    govde.appendChild(metin('p', 'urun-aciklama', urun.aciklama[dil]));

    var porsiyonlar = el('div', 'porsiyonlar');
    urun.porsiyonlar.forEach(function (p) {
      var kutu = el('span', 'porsiyon');
      kutu.appendChild(metin('span', 'porsiyon-etiket', p.etiket[dil]));
      kutu.appendChild(metin('span', 'porsiyon-fiyat', fiyatYaz(p.fiyat)));
      porsiyonlar.appendChild(kutu);
    });
    govde.appendChild(porsiyonlar);

    kart.appendChild(govde);
    return kart;
  }

  function icecekKarti(urun) {
    var kart = el('article', 'icecek-karti');

    kart.appendChild(gorselDugmesi(urun, 56, 'icecek-gorsel', false));

    kart.appendChild(metin('span', 'icecek-ad', urun.ad[dil]));

    kart.appendChild(metin('span', 'icecek-fiyat', fiyatYaz(urun.fiyat)));
    return kart;
  }

  /* ---------- Bölümler ---------- */

  function sekmeleriKur() {
    var serit = document.getElementById('sekmeler');
    serit.innerHTML = '';
    serit.setAttribute('aria-label', ARAYUZ.kategoriler[dil]);

    KATEGORILER.forEach(function (kategori) {
      var secili = kategori.id === aktifKategori;
      var dugme = metin('button', 'sekme', kategori.ad[dil]);
      dugme.type = 'button';
      dugme.setAttribute('role', 'tab');
      dugme.id = 'sekme-' + kategori.id;
      dugme.setAttribute('aria-controls', 'panel-' + kategori.id);
      dugme.setAttribute('aria-selected', secili ? 'true' : 'false');
      dugme.tabIndex = secili ? 0 : -1;

      dugme.addEventListener('click', function () {
        kategoriSec(kategori.id);
      });

      dugme.addEventListener('keydown', function (olay) {
        var yon = olay.key === 'ArrowRight' ? 1 : (olay.key === 'ArrowLeft' ? -1 : 0);
        if (yon === 0) return;
        olay.preventDefault();

        var suanki = KATEGORILER.findIndex(function (k) {
          return k.id === aktifKategori;
        });
        var sonraki = KATEGORILER[(suanki + yon + KATEGORILER.length) % KATEGORILER.length];
        kategoriSec(sonraki.id);
        document.getElementById('sekme-' + sonraki.id).focus();
      });

      serit.appendChild(dugme);
    });
  }

  function panelleriKur() {
    var kaplar = {
      et: document.getElementById('panel-et'),
      tavuk: document.getElementById('panel-tavuk'),
      icecek: document.getElementById('panel-icecek')
    };

    Object.keys(kaplar).forEach(function (id) {
      kaplar[id].innerHTML = '';
      kaplar[id].setAttribute('aria-labelledby', 'sekme-' + id);
    });

    ET_URUNLERI.forEach(function (urun, sira) {
      kaplar.et.appendChild(tantuniKarti(urun, sira === 0));
    });
    TAVUK_URUNLERI.forEach(function (urun) {
      kaplar.tavuk.appendChild(tantuniKarti(urun, false));
    });
    ICECEKLER.forEach(function (urun) {
      kaplar.icecek.appendChild(icecekKarti(urun));
    });

    document.getElementById('paneller').setAttribute('data-aktif', aktifKategori);
  }

  function altBilgiKur() {
    var alt = document.getElementById('alt-bilgi');
    alt.innerHTML = '';

    var liste = el('dl', 'sube-bilgi');

    liste.appendChild(metin('dt', null, ARAYUZ.adres[dil]));
    var adresSatiri = el('dd');
    var adresLink = el('a');
    adresLink.href = SUBE.mapsUrl;
    adresLink.target = '_blank';
    adresLink.rel = 'noopener noreferrer';
    var adresMetni = metin('span', 'adres-metni', SUBE.adres);
    adresMetni.lang = 'tr';
    adresLink.appendChild(adresMetni);
    adresLink.appendChild(metin('span', 'yol-tarifi', ARAYUZ.yolTarifi[dil]));
    adresSatiri.appendChild(adresLink);
    liste.appendChild(adresSatiri);

    liste.appendChild(metin('dt', null, ARAYUZ.calismaSaatleri[dil]));
    liste.appendChild(metin('dd', null, SUBE.calismaSaatleri[dil]));

    liste.appendChild(metin('dt', null, ARAYUZ.telefon[dil]));
    var telSatiri = el('dd');
    var telLink = metin('a', null, SUBE.telefonGosterim);
    telLink.href = 'tel:' + SUBE.telefonTel;
    telSatiri.appendChild(telLink);
    liste.appendChild(telSatiri);

    alt.appendChild(liste);
    alt.appendChild(metin(
      'p',
      'fiyat-tarihi',
      ARAYUZ.fiyatDegisimTarihi[dil] + ': ' + FIYAT_DEGISIM_TARIHI
    ));
  }

  function tercihDugmeleriKur() {
    var kap = document.getElementById('tercihler');
    kap.innerHTML = '';

    var dilKutusu = el('div', 'dil-secici');
    dilKutusu.setAttribute('role', 'group');
    dilKutusu.setAttribute('aria-label', ARAYUZ.dilSecimi[dil]);

    [{ kod: 'tr', kisa: 'TR', tamAd: 'Türkçe' },
     { kod: 'en', kisa: 'EN', tamAd: 'English' }].forEach(function (secenek) {
      var dugme = metin('button', 'dil-dugme', secenek.kisa);
      dugme.type = 'button';
      dugme.setAttribute('aria-pressed', secenek.kod === dil ? 'true' : 'false');
      dugme.setAttribute('aria-label', secenek.tamAd);
      dugme.addEventListener('click', function () {
        dilSec(secenek.kod);
      });
      dilKutusu.appendChild(dugme);
    });
    kap.appendChild(dilKutusu);

    var koyuMu = kok.getAttribute('data-tema') === 'koyu';
    var temaEtiketi = koyuMu ? ARAYUZ.temayaGecAcik[dil] : ARAYUZ.temayaGecKoyu[dil];

    var temaDugmesi = el('button', 'tema-dugme');
    temaDugmesi.type = 'button';
    temaDugmesi.setAttribute('aria-label', temaEtiketi);
    temaDugmesi.title = temaEtiketi;
    temaDugmesi.innerHTML = koyuMu
      ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    temaDugmesi.addEventListener('click', function () {
      temaSec(koyuMu ? 'acik' : 'koyu');
    });
    kap.appendChild(temaDugmesi);
  }

  /* ---------- Durum değişiklikleri ---------- */

  function kategoriSec(id) {
    aktifKategori = id;
    document.getElementById('paneller').setAttribute('data-aktif', id);
    KATEGORILER.forEach(function (kategori) {
      var dugme = document.getElementById('sekme-' + kategori.id);
      var secili = kategori.id === id;
      dugme.setAttribute('aria-selected', secili ? 'true' : 'false');
      dugme.tabIndex = secili ? 0 : -1;
    });
  }

  function dilSec(yeni) {
    dil = yeni;
    kok.lang = yeni;
    kayitaYaz(DIL_ANAHTARI, yeni);
    ciz();
  }

  function temaSec(yeni) {
    kok.setAttribute('data-tema', yeni);
    kayitaYaz(TEMA_ANAHTARI, yeni);
    tercihDugmeleriKur();
  }

  /* ---------- Çizim ---------- */

  function ciz() {
    tercihDugmeleriKur();
    sekmeleriKur();
    panelleriKur();
    altBilgiKur();
  }

  function baslat() {
    var basligiKur = document.getElementById('sube-baslik');
    if (basligiKur) basligiKur.textContent = SUBE.baslik;

    var sayfaBasligi = SUBE.baslik + ' | Menü';
    if (document.title !== sayfaBasligi) document.title = sayfaBasligi;

    ciz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', baslat);
  } else {
    baslat();
  }
})();
