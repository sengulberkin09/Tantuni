/**
 * Adres metninden Google Maps arama URL'i kurar.
 * Uydurma place ID kullanmamak için bilerek arama sorgusu tercih edildi.
 */
export function haritaUrl(adres: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`;
}
