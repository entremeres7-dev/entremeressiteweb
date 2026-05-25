import { useCallback, useMemo, useState } from 'react';
import { useRencontreFilterOptions } from '@/hooks/useRencontreFilterOptions';
import type { ProfileLocationFilter } from '@/lib/rencontres/applyProfileLocationFilter';

export function useProfileLocationFilters(options?: { withRegion?: boolean }) {
  const withRegion = options?.withRegion ?? true;
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { countries, regionsByCountry } = useRencontreFilterOptions();

  const regions = useMemo(() => {
    if (!withRegion || !selectedCountry) return [];
    return regionsByCountry[selectedCountry] ?? [];
  }, [withRegion, selectedCountry, regionsByCountry]);

  const handleCountryChange = useCallback((country: string | null) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
  }, []);

  const handleRegionChange = useCallback((region: string | null) => {
    if (!withRegion) return;
    setSelectedRegion(region);
  }, [withRegion]);

  const locationFilter = useMemo<ProfileLocationFilter>(
    () => ({
      country: selectedCountry,
      adminRegionLabel: withRegion ? selectedRegion : null,
    }),
    [selectedCountry, selectedRegion, withRegion],
  );

  return {
    countries,
    regions,
    selectedCountry,
    selectedRegion: withRegion ? selectedRegion : null,
    onCountryChange: handleCountryChange,
    onRegionChange: handleRegionChange,
    locationFilter,
    hasLocationFilter: withRegion
      ? !!(selectedCountry || selectedRegion)
      : !!selectedCountry,
  };
}