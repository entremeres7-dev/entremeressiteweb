import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useRencontreProfiles } from '@/hooks/useRencontreProfiles';
import { useRencontreFilterOptions } from '@/hooks/useRencontreFilterOptions';
import { isFranceCountry } from '@/lib/rencontres/frenchRegions';
import type { MamanRencontre, RencontreFilter } from '@/lib/rencontres/types';
import { RencontreProfileModal } from './RencontreProfileModal';
import { RencontreDesktopView } from './RencontreDesktopView';

export function TableDeRencontreScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const [timeFilter, setTimeFilter] = useState<RencontreFilter>('all');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { countries, regionsByCountry } = useRencontreFilterOptions();
  const { mamans, loading, refreshing, error, refresh } = useRencontreProfiles({
    timeFilter,
    country: selectedCountry,
    adminRegionLabel: selectedRegion,
  });
  const [selectedProfile, setSelectedProfile] = useState<MamanRencontre | null>(null);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());

  const franceCountryName = useMemo(
    () => countries.find((c) => isFranceCountry(c)) ?? 'France',
    [countries],
  );

  const regions = useMemo(() => {
    if (selectedCountry) return regionsByCountry[selectedCountry] ?? [];
    return regionsByCountry[franceCountryName] ?? [];
  }, [selectedCountry, regionsByCountry, franceCountryName]);

  const handleCountryChange = useCallback((country: string | null) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
  }, []);

  const handleRegionChange = useCallback(
    (region: string | null) => {
      setSelectedRegion(region);
      if (region && !selectedCountry) {
        const fr =
          countries.find((c) => c.toLowerCase().includes('france')) ?? countries[0] ?? 'France';
        setSelectedCountry(fr);
      }
    },
    [selectedCountry, countries],
  );

  const displayed = useMemo(
    () => mamans.filter((m) => !passedIds.has(m.id)),
    [mamans, passedIds],
  );

  const handlePress = useCallback((maman: MamanRencontre) => {
    setSelectedProfile(maman);
  }, []);

  const handlePass = useCallback((profile: MamanRencontre) => {
    setPassedIds((prev) => new Set(prev).add(profile.id));
  }, []);

  const countLabel = useMemo(() => {
    if (loading) return '…';
    if (timeFilter === 'new') {
      return `${displayed.length} nouvelle${displayed.length !== 1 ? 's' : ''}`;
    }
    if (selectedCountry || selectedRegion) {
      return `${displayed.length} profil${displayed.length !== 1 ? 's' : ''}`;
    }
    return 'Des milliers de mamans';
  }, [loading, timeFilter, displayed.length, selectedCountry, selectedRegion]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />

      <RencontreDesktopView
        colors={colors}
        insetsBottom={insets.bottom}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        countries={countries}
        regions={regions}
        selectedCountry={selectedCountry}
        selectedRegion={selectedRegion}
        onCountryChange={handleCountryChange}
        onRegionChange={handleRegionChange}
        countLabel={countLabel}
        displayed={displayed}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={refresh}
        onPressProfile={handlePress}
      />

      <RencontreProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onPass={handlePass}
      />
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
  });
}
