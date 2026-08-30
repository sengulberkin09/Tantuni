import type { Sube } from '../types';
import { haritaUrl } from './harita';

const adres = 'Bostanlı, Cemal Gürsel Cd. No:530B, 35590 Karşıyaka/İzmir';

export const BOSTANLI: Sube = {
  slug: 'bostanli',
  ad: 'Bostanlı',
  baslik: 'Hisarönü Tantuni Yakup Usta - Bostanlı',
  adres,
  mapsUrl: haritaUrl(adres),
  telefonGosterim: '+90 541 762 37 75',
  telefonTel: '+905417623775',
  calismaSaatleri: 'Her gün, kapanış 01:30',
};
