import { isFranceCountry } from '@/lib/rencontres/frenchRegions';

const COUNTRY_TO_ISO: Record<string, string> = {
  France: 'FR',
  Algérie: 'DZ',
  Belgique: 'BE',
  Suisse: 'CH',
  Canada: 'CA',
  Luxembourg: 'LU',
  Maroc: 'MA',
  Tunisie: 'TN',
};

function isoToFlagEmoji(iso: string): string {
  const code = iso.trim().toUpperCase();
  if (code.length !== 2) return '';
  return [...code].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join('');
}

/** Drapeau emoji à partir du pays profil (ex. « France » → 🇫🇷). */
export function countryToFlagEmoji(country: string | null | undefined): string | null {
  const trimmed = country?.trim();
  if (!trimmed) {
    return isoToFlagEmoji('FR');
  }
  if (trimmed === 'Autre') return '🌍';
  if (isFranceCountry(trimmed)) return isoToFlagEmoji('FR');

  const iso = COUNTRY_TO_ISO[trimmed];
  return iso ? isoToFlagEmoji(iso) : null;
}
