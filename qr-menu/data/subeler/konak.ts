import type { Sube } from '../types';
import { haritaUrl } from './harita';

const adres = 'Konak, 902. Sk. No:7, 35250 Konak/İzmir';

export const KONAK: Sube = {
  slug: 'konak',
  ad: 'Konak',
  baslik: 'Hisarönü Tantuni Yakup Usta - Konak',
  adres,
  mapsUrl: haritaUrl(adres),
  telefonGosterim: '0552 888 35 33',
  telefonTel: '+905528883533',
  calismaSaatleri: 'Her gün 10:30 – 20:15',
};
