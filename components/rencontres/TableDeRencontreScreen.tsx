import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useRencontreProfiles } from '@/hooks/useRencontreProfiles';
import { useProfileLocationFilters } from '@/hooks/useProfileLocationFilters';
import type { MamanRencontre, RencontreFilter } from '@/lib/rencontres/types';
import { RencontreProfileModal } from './RencontreProfileModal';
import { RencontreDesktopView } from './RencontreDesktopView';

export function TableDeRencontreScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const [timeFilter, setTimeFilter] = useState<RencontreFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const {
    countries,
    regions,
    selectedCountry,
    selectedRegion,
    onCountryChange,
    onRegionChange,
    locationFilter,
  } = useProfileLocationFilters();
  const { mamans, loading, loadingMore, refreshing, error, isSearching, hasMore, refresh, loadMore } =
    useRencontreProfiles({
    timeFilter,
    ...locationFilter,
    usernameQuery: debouncedSearch,
  });
  const [selectedProfile, setSelectedProfile] = useState<MamanRencontre | null>(null);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    const n = displayed.length;
    if (isSearching) {
      return `${n} résultat${n !== 1 ? 's' : ''}${hasMore ? '+' : ''}`;
    }
    if (timeFilter === 'new') {
      return `${n} nouvelle${n !== 1 ? 's' : ''}${hasMore ? '+' : ''}`;
    }
    return `${n} profil${n !== 1 ? 's' : ''}${hasMore ? '+' : ''}`;
  }, [loading, isSearching, timeFilter, displayed.length, hasMore]);

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
        onCountryChange={onCountryChange}
        onRegionChange={onRegionChange}
        countLabel={countLabel}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isSearching={isSearching}
        displayed={displayed}
        loading={loading}
        loadingMore={loadingMore}
        refreshing={refreshing}
        error={error}
        hasMore={hasMore}
        onRefresh={refresh}
        onLoadMore={loadMore}
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
