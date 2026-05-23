/** Régions administratives françaises (métropole + Corse). */

export const FRENCH_ADMIN_REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Pays de la Loire',
] as const;

export type FrenchAdminRegion = (typeof FRENCH_ADMIN_REGIONS)[number];

const FRANCE_ALIASES = new Set([
  'france',
  'fr',
  'republique-francaise',
  'république-française',
]);

/** [clé normalisée département, région] */
const ENTRIES: [string, FrenchAdminRegion][] = [
  // Île-de-France
  ['paris', 'Île-de-France'],
  ['75', 'Île-de-France'],
  ['seine-et-marne', 'Île-de-France'],
  ['77', 'Île-de-France'],
  ['yvelines', 'Île-de-France'],
  ['78', 'Île-de-France'],
  ['essonne', 'Île-de-France'],
  ['91', 'Île-de-France'],
  ['hauts-de-seine', 'Île-de-France'],
  ['92', 'Île-de-France'],
  ['seine-saint-denis', 'Île-de-France'],
  ['93', 'Île-de-France'],
  ['val-de-marne', 'Île-de-France'],
  ['94', 'Île-de-France'],
  ['val-doise', 'Île-de-France'],
  ["val-d'oise", 'Île-de-France'],
  ['95', 'Île-de-France'],

  // Centre-Val de Loire
  ['cher', 'Centre-Val de Loire'],
  ['18', 'Centre-Val de Loire'],
  ['eure-et-loir', 'Centre-Val de Loire'],
  ['28', 'Centre-Val de Loire'],
  ['indre', 'Centre-Val de Loire'],
  ['36', 'Centre-Val de Loire'],
  ['indre-et-loire', 'Centre-Val de Loire'],
  ['37', 'Centre-Val de Loire'],
  ['loir-et-cher', 'Centre-Val de Loire'],
  ['41', 'Centre-Val de Loire'],
  ['loiret', 'Centre-Val de Loire'],
  ['45', 'Centre-Val de Loire'],

  // Bourgogne-Franche-Comté
  ['cote-dor', 'Bourgogne-Franche-Comté'],
  ["côte-d'or", 'Bourgogne-Franche-Comté'],
  ['21', 'Bourgogne-Franche-Comté'],
  ['doubs', 'Bourgogne-Franche-Comté'],
  ['25', 'Bourgogne-Franche-Comté'],
  ['jura', 'Bourgogne-Franche-Comté'],
  ['39', 'Bourgogne-Franche-Comté'],
  ['nievre', 'Bourgogne-Franche-Comté'],
  ['nièvre', 'Bourgogne-Franche-Comté'],
  ['58', 'Bourgogne-Franche-Comté'],
  ['haute-saone', 'Bourgogne-Franche-Comté'],
  ['haute-saône', 'Bourgogne-Franche-Comté'],
  ['70', 'Bourgogne-Franche-Comté'],
  ['saone-et-loire', 'Bourgogne-Franche-Comté'],
  ['saône-et-loire', 'Bourgogne-Franche-Comté'],
  ['71', 'Bourgogne-Franche-Comté'],
  ['yonne', 'Bourgogne-Franche-Comté'],
  ['89', 'Bourgogne-Franche-Comté'],
  ['territoire-de-belfort', 'Bourgogne-Franche-Comté'],
  ['90', 'Bourgogne-Franche-Comté'],

  // Normandie
  ['calvados', 'Normandie'],
  ['14', 'Normandie'],
  ['eure', 'Normandie'],
  ['27', 'Normandie'],
  ['manche', 'Normandie'],
  ['50', 'Normandie'],
  ['orne', 'Normandie'],
  ['61', 'Normandie'],
  ['seine-maritime', 'Normandie'],
  ['76', 'Normandie'],

  // Hauts-de-France
  ['aisne', 'Hauts-de-France'],
  ['02', 'Hauts-de-France'],
  ['nord', 'Hauts-de-France'],
  ['59', 'Hauts-de-France'],
  ['oise', 'Hauts-de-France'],
  ['60', 'Hauts-de-France'],
  ['pas-de-calais', 'Hauts-de-France'],
  ['62', 'Hauts-de-France'],
  ['somme', 'Hauts-de-France'],
  ['80', 'Hauts-de-France'],

  // Grand Est
  ['ardennes', 'Grand Est'],
  ['08', 'Grand Est'],
  ['aube', 'Grand Est'],
  ['10', 'Grand Est'],
  ['marne', 'Grand Est'],
  ['51', 'Grand Est'],
  ['haute-marne', 'Grand Est'],
  ['52', 'Grand Est'],
  ['meurthe-et-moselle', 'Grand Est'],
  ['54', 'Grand Est'],
  ['meuse', 'Grand Est'],
  ['55', 'Grand Est'],
  ['moselle', 'Grand Est'],
  ['57', 'Grand Est'],
  ['bas-rhin', 'Grand Est'],
  ['67', 'Grand Est'],
  ['haut-rhin', 'Grand Est'],
  ['68', 'Grand Est'],
  ['vosges', 'Grand Est'],
  ['88', 'Grand Est'],

  // Pays de la Loire
  ['loire-atlantique', 'Pays de la Loire'],
  ['44', 'Pays de la Loire'],
  ['maine-et-loire', 'Pays de la Loire'],
  ['49', 'Pays de la Loire'],
  ['mayenne', 'Pays de la Loire'],
  ['53', 'Pays de la Loire'],
  ['sarthe', 'Pays de la Loire'],
  ['72', 'Pays de la Loire'],
  ['vendee', 'Pays de la Loire'],
  ['vendée', 'Pays de la Loire'],
  ['85', 'Pays de la Loire'],

  // Bretagne
  ['cotes-darmor', 'Bretagne'],
  ["côtes-d'armor", 'Bretagne'],
  ['22', 'Bretagne'],
  ['finistere', 'Bretagne'],
  ['finistère', 'Bretagne'],
  ['29', 'Bretagne'],
  ['ille-et-vilaine', 'Bretagne'],
  ['35', 'Bretagne'],
  ['morbihan', 'Bretagne'],
  ['56', 'Bretagne'],

  // Nouvelle-Aquitaine
  ['charente', 'Nouvelle-Aquitaine'],
  ['16', 'Nouvelle-Aquitaine'],
  ['charente-maritime', 'Nouvelle-Aquitaine'],
  ['17', 'Nouvelle-Aquitaine'],
  ['correze', 'Nouvelle-Aquitaine'],
  ['corrèze', 'Nouvelle-Aquitaine'],
  ['19', 'Nouvelle-Aquitaine'],
  ['creuse', 'Nouvelle-Aquitaine'],
  ['23', 'Nouvelle-Aquitaine'],
  ['dordogne', 'Nouvelle-Aquitaine'],
  ['24', 'Nouvelle-Aquitaine'],
  ['gironde', 'Nouvelle-Aquitaine'],
  ['33', 'Nouvelle-Aquitaine'],
  ['landes', 'Nouvelle-Aquitaine'],
  ['40', 'Nouvelle-Aquitaine'],
  ['lot-et-garonne', 'Nouvelle-Aquitaine'],
  ['47', 'Nouvelle-Aquitaine'],
  ['pyrenees-atlantiques', 'Nouvelle-Aquitaine'],
  ['pyrénées-atlantiques', 'Nouvelle-Aquitaine'],
  ['64', 'Nouvelle-Aquitaine'],
  ['deux-sevres', 'Nouvelle-Aquitaine'],
  ['deux-sèvres', 'Nouvelle-Aquitaine'],
  ['79', 'Nouvelle-Aquitaine'],
  ['vienne', 'Nouvelle-Aquitaine'],
  ['86', 'Nouvelle-Aquitaine'],
  ['haute-vienne', 'Nouvelle-Aquitaine'],
  ['87', 'Nouvelle-Aquitaine'],

  // Occitanie
  ['ariege', 'Occitanie'],
  ['ariège', 'Occitanie'],
  ['09', 'Occitanie'],
  ['aude', 'Occitanie'],
  ['11', 'Occitanie'],
  ['aveyron', 'Occitanie'],
  ['12', 'Occitanie'],
  ['gard', 'Occitanie'],
  ['30', 'Occitanie'],
  ['haute-garonne', 'Occitanie'],
  ['31', 'Occitanie'],
  ['gers', 'Occitanie'],
  ['32', 'Occitanie'],
  ['herault', 'Occitanie'],
  ['hérault', 'Occitanie'],
  ['34', 'Occitanie'],
  ['lot', 'Occitanie'],
  ['46', 'Occitanie'],
  ['lozere', 'Occitanie'],
  ['lozère', 'Occitanie'],
  ['48', 'Occitanie'],
  ['hautes-pyrenees', 'Occitanie'],
  ['hautes-pyrénées', 'Occitanie'],
  ['65', 'Occitanie'],
  ['pyrenees-orientales', 'Occitanie'],
  ['pyrénées-orientales', 'Occitanie'],
  ['66', 'Occitanie'],
  ['tarn', 'Occitanie'],
  ['81', 'Occitanie'],
  ['tarn-et-garonne', 'Occitanie'],
  ['82', 'Occitanie'],

  // PACA
  ['alpes-de-haute-provence', "Provence-Alpes-Côte d'Azur"],
  ['04', "Provence-Alpes-Côte d'Azur"],
  ['hautes-alpes', "Provence-Alpes-Côte d'Azur"],
  ['05', "Provence-Alpes-Côte d'Azur"],
  ['alpes-maritimes', "Provence-Alpes-Côte d'Azur"],
  ['06', "Provence-Alpes-Côte d'Azur"],
  ['bouches-du-rhone', "Provence-Alpes-Côte d'Azur"],
  ['bouches-du-rhône', "Provence-Alpes-Côte d'Azur"],
  ['13', "Provence-Alpes-Côte d'Azur"],
  ['var', "Provence-Alpes-Côte d'Azur"],
  ['83', "Provence-Alpes-Côte d'Azur"],
  ['vaucluse', "Provence-Alpes-Côte d'Azur"],
  ['84', "Provence-Alpes-Côte d'Azur"],

  // Auvergne-Rhône-Alpes
  ['ain', 'Auvergne-Rhône-Alpes'],
  ['01', 'Auvergne-Rhône-Alpes'],
  ['allier', 'Auvergne-Rhône-Alpes'],
  ['03', 'Auvergne-Rhône-Alpes'],
  ['ardeche', 'Auvergne-Rhône-Alpes'],
  ['ardèche', 'Auvergne-Rhône-Alpes'],
  ['07', 'Auvergne-Rhône-Alpes'],
  ['cantal', 'Auvergne-Rhône-Alpes'],
  ['15', 'Auvergne-Rhône-Alpes'],
  ['drome', 'Auvergne-Rhône-Alpes'],
  ['drôme', 'Auvergne-Rhône-Alpes'],
  ['26', 'Auvergne-Rhône-Alpes'],
  ['isere', 'Auvergne-Rhône-Alpes'],
  ['isère', 'Auvergne-Rhône-Alpes'],
  ['38', 'Auvergne-Rhône-Alpes'],
  ['loire', 'Auvergne-Rhône-Alpes'],
  ['42', 'Auvergne-Rhône-Alpes'],
  ['haute-loire', 'Auvergne-Rhône-Alpes'],
  ['43', 'Auvergne-Rhône-Alpes'],
  ['puy-de-dome', 'Auvergne-Rhône-Alpes'],
  ['puy-de-dôme', 'Auvergne-Rhône-Alpes'],
  ['63', 'Auvergne-Rhône-Alpes'],
  ['rhone', 'Auvergne-Rhône-Alpes'],
  ['rhône', 'Auvergne-Rhône-Alpes'],
  ['69', 'Auvergne-Rhône-Alpes'],
  ['savoie', 'Auvergne-Rhône-Alpes'],
  ['73', 'Auvergne-Rhône-Alpes'],
  ['haute-savoie', 'Auvergne-Rhône-Alpes'],
  ['74', 'Auvergne-Rhône-Alpes'],

  // Corse
  ['corse-du-sud', 'Corse'],
  ['2a', 'Corse'],
  ['2A', 'Corse'],
  ['haute-corse', 'Corse'],
  ['2b', 'Corse'],
  ['2B', 'Corse'],
];

const DEPT_TO_REGION: Record<string, FrenchAdminRegion> = Object.fromEntries(ENTRIES);

const REGION_TO_RAW_DEPTS = new Map<FrenchAdminRegion, string[]>();

for (const [deptKey, region] of ENTRIES) {
  const list = REGION_TO_RAW_DEPTS.get(region) ?? [];
  list.push(deptKey);
  REGION_TO_RAW_DEPTS.set(region, list);
}

/** Variantes texte pour matcher la colonne profil (casse, espaces). */
const REGION_DB_VARIANTS = new Map<FrenchAdminRegion, string[]>();

function buildDbVariants() {
  for (const region of FRENCH_ADMIN_REGIONS) {
    const keys = REGION_TO_RAW_DEPTS.get(region) ?? [];
    const variants = new Set<string>();
    for (const key of keys) {
      variants.add(key);
      variants.add(key.replace(/-/g, ' '));
      const titled = key
        .split(/[- ]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('-');
      variants.add(titled);
      variants.add(titled.replace(/-/g, ' '));
      if (/^\d+$/.test(key)) continue;
      variants.add(key.toUpperCase());
    }
    REGION_DB_VARIANTS.set(region, [...variants]);
  }
}
buildDbVariants();

export const REGION_SHORT_LABELS: Partial<Record<FrenchAdminRegion, string>> = {
  "Provence-Alpes-Côte d'Azur": 'PACA',
};

export function normalizeLocationKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, "'")
    .replace(/\s+/g, '-');
}

export function isFranceCountry(country: string | null | undefined): boolean {
  if (!country?.trim()) return true;
  return FRANCE_ALIASES.has(normalizeLocationKey(country));
}

export function getAdminRegionForDepartment(
  department: string | null | undefined,
): FrenchAdminRegion | null {
  if (!department?.trim()) return null;
  const key = normalizeLocationKey(department);
  return DEPT_TO_REGION[key] ?? null;
}

export function getRegionDisplayLabel(region: FrenchAdminRegion): string {
  return REGION_SHORT_LABELS[region] ?? region;
}

/** Valeurs possibles en base pour filtrer une région (départements du profil). */
export function getDepartmentDbValuesForAdminRegion(region: FrenchAdminRegion): string[] {
  return REGION_DB_VARIANTS.get(region) ?? [];
}
