import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { buildLocationOptions } from '@/lib/rencontres/buildLocationOptions';

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

      const { countries: c, regionsByCountry: r } = buildLocationOptions(
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
