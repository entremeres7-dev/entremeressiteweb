import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { PROFILE_COUNTRIES, REGIONS_BY_COUNTRY } from '@/constants/profileSetup';
import { buildLocationOptions } from '@/lib/rencontres/buildLocationOptions';
import { FRENCH_ADMIN_REGIONS, getRegionDisplayLabel, isFranceCountry } from '@/lib/rencontres/frenchRegions';

function mergeFilterOptions(
  rows: { country: string | null; region: string | null }[],
): { countries: string[]; regionsByCountry: Record<string, string[]> } {
  const { countries: fromData, regionsByCountry } = buildLocationOptions(rows);
  const countries = [...new Set([...PROFILE_COUNTRIES, ...fromData])].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );

  const mergedRegions: Record<string, string[]> = { ...regionsByCountry };

  for (const country of countries) {
    if (mergedRegions[country]?.length) continue;

    if (isFranceCountry(country)) {
      mergedRegions[country] = FRENCH_ADMIN_REGIONS.map((r) => getRegionDisplayLabel(r));
    } else if (REGIONS_BY_COUNTRY[country]?.length) {
      mergedRegions[country] = REGIONS_BY_COUNTRY[country];
    }
  }

  return { countries, regionsByCountry: mergedRegions };
}

export function useRencontreFilterOptions() {
  const [countries, setCountries] = useState<string[]>([]);
  const [regionsByCountry, setRegionsByCountry] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country, region')
        .not('photo', 'is', null)
        .neq('photo', '')
        .eq('is_hidden', false)
        .limit(500);

      if (error) throw error;

      const { countries: c, regionsByCountry: r } = mergeFilterOptions(
        (data ?? []) as { country: string | null; region: string | null }[],
      );
      setCountries(c);
      setRegionsByCountry(r);
    } catch {
      setCountries([]);
      setRegionsByCountry({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { countries, regionsByCountry, loading };
}
