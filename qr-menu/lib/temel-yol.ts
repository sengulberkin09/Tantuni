/**
 * Sitenin yayınlandığı alt yol. next.config.ts'teki basePath ve
 * next/image src'leri bu tek kaynaktan besleniyor.
 *
 * next/image basePath'i KENDİLİĞİNDEN eklemiyor — bu yüzden görsel
 * yolları elle bu önekle kuruluyor. Öneki kaldırırsanız sayfalar
 * görselleri ana sitenin images/ klasöründen çekmeye başlar.
 */
export const TEMEL_YOL = '/qr';
