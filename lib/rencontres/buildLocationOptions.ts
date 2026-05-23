import {
  FRENCH_ADMIN_REGIONS,
  getAdminRegionForDepartment,
  getRegionDisplayLabel,
  isFranceCountry,
  type FrenchAdminRegion,
} from './frenchRegions';

/** Construit listes pays / régions administratives à partir des profils. */
export function buildLocationOptions(
  rows: { country: string | null; region: string | null }[],
): { countries: string[]; regionsByCountry: Record<string, string[]> } {
  const countrySet = new Set<string>();
  const regionsMap = new Map<string, Set<string>>();

  for (const row of rows) {
    const country = row.country?.trim() || 'France';
    const department = row.region?.trim();

    countrySet.add(country);

    if (!department) continue;

    if (isFranceCountry(country)) {
      const adminRegion = getAdminRegionForDepartment(department);
      if (adminRegion) {
        if (!regionsMap.has(country)) regionsMap.set(country, new Set());
        regionsMap.get(country)!.add(getRegionDisplayLabel(adminRegion));
      }
    }
  }

  const countries = [...countrySet].sort((a, b) => a.localeCompare(b, 'fr'));
  const regionsByCountry: Record<string, string[]> = {};

  for (const c of countries) {
    if (isFranceCountry(c)) {
      const labels = FRENCH_ADMIN_REGIONS.map((r) => getRegionDisplayLabel(r));
      const fromData = regionsMap.get(c);
      if (fromData?.size) {
        const ordered = labels.filter((l) => fromData.has(l));
        regionsByCountry[c] = ordered.length ? ordered : labels;
      } else {
        regionsByCountry[c] = labels;
      }
    } else if (regionsMap.has(c)) {
      regionsByCountry[c] = [...regionsMap.get(c)!].sort((a, b) => a.localeCompare(b, 'fr'));
    }
  }

  return { countries, regionsByCountry };
}

/** Résout le libellé filtre (ex. PACA) vers la région administrative. */
export function resolveAdminRegionFromLabel(label: string): FrenchAdminRegion | null {
  for (const r of FRENCH_ADMIN_REGIONS) {
    if (getRegionDisplayLabel(r) === label || r === label) return r;
  }
  return null;
}
