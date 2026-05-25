import { resolveAdminRegionFromLabel } from './buildLocationOptions';
import {
  getDepartmentDbValuesForAdminRegion,
  isFranceCountry,
} from './frenchRegions';

export type ProfileLocationFilter = {
  country: string | null;
  /** Libellé région affiché (ex. PACA, Alger) */
  adminRegionLabel: string | null;
};

export function hasProfileLocationFilter(filter: ProfileLocationFilter): boolean {
  return !!(filter.country || filter.adminRegionLabel);
}

/** Applique pays / région uniquement si l'utilisateur a choisi un filtre explicite. */
export function applyProfileLocationFilter<T extends { or: (...args: unknown[]) => T; eq: (...args: unknown[]) => T; in: (...args: unknown[]) => T }>(
  query: T,
  { country, adminRegionLabel }: ProfileLocationFilter,
): T {
  if (!country && !adminRegionLabel) return query;

  if (country) {
    if (isFranceCountry(country)) {
      query = query.or(`country.eq.${country},country.is.null,country.eq.`);
    } else {
      query = query.eq('country', country);
    }
  }

  if (country && adminRegionLabel) {
    if (isFranceCountry(country)) {
      const adminRegion = resolveAdminRegionFromLabel(adminRegionLabel);
      if (adminRegion) {
        const deptValues = getDepartmentDbValuesForAdminRegion(adminRegion);
        if (deptValues.length > 0) {
          query = query.in('region', deptValues);
        }
      }
    } else {
      query = query.eq('region', adminRegionLabel);
    }
  }

  return query;
}
