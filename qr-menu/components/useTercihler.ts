'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Dil } from '@/data/types';
import {
  DIL_ANAHTARI,
  TEMA_ANAHTARI,
  type Tema,
  dilCozumle,
  temaCozumle,
} from '@/lib/tercihler';

function kayittanOku(anahtar: string): string | null {
  try {
    return localStorage.getItem(anahtar);
  } catch {
    return null;
  }
}

function kayitaYaz(anahtar: string, deger: string): void {
  try {
    localStorage.setItem(anahtar, deger);
  } catch {
    // Gizli sekme / kapalı site verisi: tercih bu oturumda yaşar, sorun değil.
  }
}

export function useTercihler(): {
  dil: Dil;
  tema: Tema;
  setDil: (d: Dil) => void;
  setTema: (t: Tema) => void;
} {
  // Sunucuda üretilen HTML her zaman tr/acik; gerçek tercih mount'ta uygulanır.
  const [dil, setDilState] = useState<Dil>('tr');
  const [tema, setTemaState] = useState<Tema>('acik');

  useEffect(() => {
    const kok = document.documentElement;

    // <head>'deki script çoktan çözümledi; onu kaynak kabul et.
    // Script çalışmadıysa (ör. testler) aynı mantığı burada uygula.
    const kokDili = kok.lang;
    setDilState(
      kokDili === 'tr' || kokDili === 'en'
        ? kokDili
        : dilCozumle(kayittanOku(DIL_ANAHTARI), navigator.language),
    );

    const kokTemasi = kok.getAttribute('data-tema');
    setTemaState(
      kokTemasi === 'acik' || kokTemasi === 'koyu'
        ? kokTemasi
        : temaCozumle(
            kayittanOku(TEMA_ANAHTARI),
            window.matchMedia('(prefers-color-scheme: dark)').matches,
          ),
    );
  }, []);

  const setDil = useCallback((yeni: Dil) => {
    setDilState(yeni);
    document.documentElement.lang = yeni;
    kayitaYaz(DIL_ANAHTARI, yeni);
  }, []);

  const setTema = useCallback((yeni: Tema) => {
    setTemaState(yeni);
    document.documentElement.setAttribute('data-tema', yeni);
    kayitaYaz(TEMA_ANAHTARI, yeni);
  }, []);

  return { dil, tema, setDil, setTema };
}
