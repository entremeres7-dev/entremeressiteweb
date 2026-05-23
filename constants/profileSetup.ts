import { FRENCH_DEPARTMENTS } from '@/constants/frenchDepartments';

export const PROFILE_COUNTRIES = [
  'France',
  'Algérie',
  'Belgique',
  'Suisse',
  'Canada',
  'Luxembourg',
  'Maroc',
  'Tunisie',
  'Autre',
] as const;

export const REGIONS_BY_COUNTRY: Record<string, string[]> = {
  France: FRENCH_DEPARTMENTS,
  Algérie: [
    'Alger',
    'Oran',
    'Constantine',
    'Annaba',
    'Blida',
    'Batna',
    'Sétif',
    'Béjaïa',
    'Tizi Ouzou',
    'Tlemcen',
    'Mostaganem',
    'Biskra',
    'Boumerdès',
    'Tipaza',
    'Médéa',
  ],
  Belgique: [
    'Bruxelles',
    'Anvers',
    'Liège',
    'Gand',
    'Charleroi',
    'Brabant wallon',
    'Namur',
    'Luxembourg (BE)',
    'Flandre-Occidentale',
  ],
  Suisse: ['Genève', 'Vaud', 'Valais', 'Fribourg', 'Neuchâtel', 'Berne', 'Zurich', 'Bâle', 'Ticino'],
  Canada: ['Québec', 'Ontario', 'Colombie-Britannique', 'Alberta', 'Nouveau-Brunswick', 'Manitoba'],
  Luxembourg: ['Luxembourg', 'Diekirch', 'Grevenmacher'],
  Maroc: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'],
  Tunisie: ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte', 'Gabès', 'Kairouan'],
  Autre: [
    'Europe (hors liste)',
    'Afrique (hors liste)',
    'Amérique du Nord',
    'Amérique du Sud',
    'Asie',
    'Océanie',
  ],
};

export function getRegionsForCountry(country: string): string[] {
  return REGIONS_BY_COUNTRY[country] ?? REGIONS_BY_COUNTRY.Autre;
}

export const CHILDREN_OPTIONS = ['1', '2', '3', '4+'] as const;

export const MIN_MOM_AGE = 16;
export const MAX_MOM_AGE = 70;
