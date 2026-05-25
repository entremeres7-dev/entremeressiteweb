import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { DesktopContent } from '@/components/ui/DesktopContent';
import { MamanProfileRow } from './MamanProfileRow';
import { RencontreFilterChips } from './RencontreFilterChips';
import type { MamanRencontre, RencontreFilter } from '@/lib/rencontres/types';
import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';
import { NEW_MEMBER_DAYS } from '@/hooks/useRencontreProfiles';

type Props = {
  colors: AppColors;
  insetsBottom: number;
  timeFilter: RencontreFilter;
  onTimeFilterChange: (f: RencontreFilter) => void;
  countries: string[];
  regions: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
  onCountryChange: (country: string | null) => void;
  onRegionChange: (region: string | null) => void;
  countLabel: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isSearching: boolean;
  displayed: MamanRencontre[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onPressProfile: (m: MamanRencontre) => void;
};

export function RencontreDesktopView({
  colors,
  insetsBottom,
  timeFilter,
  onTimeFilterChange,
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  countLabel,
  searchQuery,
  onSearchQueryChange,
  isSearching,
  displayed,
  loading,
  loadingMore,
  refreshing,
  error,
  hasMore,
  onRefresh,
  onLoadMore,
  onPressProfile,
}: Props) {
  const styles = buildStyles(colors, compact);
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const gridColumns: 2 | 3 = width >= 960 ? 3 : 2;
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const toggleFilters = useCallback(() => {
    setFiltersExpanded((prev) => !prev);
  }, []);

  const hasGeoFilters = countries.length > 0 || (selectedCountry && regions.length > 0);

  const emptyMessage = isSearching
    ? `Aucune maman trouvée pour « ${searchQuery.trim()} ».`
    : timeFilter === 'new'
      ? `Aucune nouvelle inscription avec photo ces ${NEW_MEMBER_DAYS} derniers jours.`
      : selectedCountry || selectedRegion
        ? 'Aucune maman ne correspond à ces filtres pour le moment.'
        : 'Aucun profil avec photo pour le moment.';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + insetsBottom + 8 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />
      }
      keyboardShouldPersistTaps="handled"
    >
      <DesktopContent maxWidth={980} flex={false}>
        <View style={[styles.hero, { backgroundColor: colors.pinkSoft, borderColor: colors.border }]}>
          <View style={styles.heroTop}>
            <View style={[styles.heroIcon, { backgroundColor: colors.card }]}>
              <Ionicons name="heart" size={22} color={colors.pink} />
            </View>
            <View style={styles.heroText}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>Rencontres</Text>
              <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                Découvrez des mamans près de chez vous
              </Text>
            </View>
          </View>
          {!loading ? (
            <View style={[styles.countBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="people-outline" size={14} color={colors.pink} />
              <Text style={[styles.countBadgeText, { color: colors.text }]}>{countLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.pink} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Chercher par pseudo…"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => onSearchQueryChange('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Effacer la recherche"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {!isSearching ? (
          <View style={styles.toolbar}>
            <View style={[styles.segmented, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.segment,
                  timeFilter === 'all' && { backgroundColor: colors.pink },
                ]}
                onPress={() => onTimeFilterChange('all')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: timeFilter === 'all' ? colors.onPink : colors.textSecondary },
                  ]}
                >
                  Toutes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segment,
                  timeFilter === 'new' && { backgroundColor: colors.pink },
                ]}
                onPress={() => onTimeFilterChange('new')}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: timeFilter === 'new' ? colors.onPink : colors.textSecondary },
                  ]}
                >
                  Récentes
                </Text>
              </TouchableOpacity>
            </View>

            {hasGeoFilters ? (
              <TouchableOpacity
                style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={toggleFilters}
                activeOpacity={0.85}
              >
                <Ionicons name="options-outline" size={16} color={colors.pink} />
                <Text style={[styles.filterBtnText, { color: colors.text }]}>
                  {filtersExpanded ? 'Masquer' : 'Lieu'}
                </Text>
                {(selectedCountry || selectedRegion) && !filtersExpanded ? (
                  <View style={[styles.filterDot, { backgroundColor: colors.pink }]} />
                ) : null}
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {!isSearching && filtersExpanded && hasGeoFilters ? (
          <View style={[styles.filterPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <RencontreFilterChips
              colors={colors}
              timeFilter={timeFilter}
              onTimeFilterChange={onTimeFilterChange}
              countries={countries}
              regions={regions}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              onCountryChange={onCountryChange}
              onRegionChange={onRegionChange}
              countLabel={countLabel}
              layout="inline"
              wrapChips
              showTimeFilter={false}
              minimal
            />
          </View>
        ) : null}

        {isSearching ? (
          <Text style={[styles.searchHint, { color: colors.textMuted }]}>
            Résultats pour « {searchQuery.trim()} »
          </Text>
        ) : null}

        <View style={styles.listSection}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.pink} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Chargement des profils…
              </Text>
            </View>
          ) : error ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.pink }]} onPress={onRefresh}>
                <Text style={[styles.retryText, { color: colors.onPink }]}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : displayed.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.pinkSoft }]}>
                <Ionicons name="search-outline" size={32} color={colors.pink} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun profil</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{emptyMessage}</Text>
            </View>
          ) : (
            <View style={[styles.grid, compact && styles.gridCompact]}>
              {displayed.map((item) => (
                <MamanProfileRow
                  key={item.id}
                  item={item}
                  colors={colors}
                  onPress={onPressProfile}
                  columns={compact ? 2 : gridColumns}
                />
              ))}
            </View>
          )}

          {!loading && !error && displayed.length > 0 && hasMore ? (
            <TouchableOpacity
              style={[styles.loadMoreBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={onLoadMore}
              disabled={loadingMore}
              activeOpacity={0.85}
            >
              {loadingMore ? (
                <ActivityIndicator color={colors.pink} />
              ) : (
                <>
                  <Text style={[styles.loadMoreText, { color: colors.text }]}>Voir plus de profils</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.pink} />
                </>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </DesktopContent>
    </ScrollView>
  );
}

function buildStyles(c: AppColors, compact: boolean) {
  return StyleSheet.create({
    hero: {
      marginTop: compact ? 8 : 4,
      borderRadius: 20,
      padding: 18,
      gap: 14,
      borderWidth: StyleSheet.hairlineWidth,
      ...cardElevation(c.bg),
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroText: {
      flex: 1,
      minWidth: 0,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 4,
    },
    countBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
    },
    countBadgeText: {
      fontSize: 13,
      fontWeight: '700',
    },
    searchBar: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 13 : 10,
      ...cardElevation(c.bg),
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      paddingVertical: 0,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
    },
    segmented: {
      flex: 1,
      flexDirection: 'row',
      padding: 4,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      gap: 4,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 10,
    },
    segmentText: {
      fontSize: 13,
      fontWeight: '700',
    },
    filterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
    },
    filterBtnText: {
      fontSize: 13,
      fontWeight: '700',
    },
    filterDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    filterPanel: {
      marginTop: 10,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 12,
      ...cardElevation(c.bg),
    },
    searchHint: {
      marginTop: 12,
      fontSize: 13,
      fontWeight: '600',
    },
    listSection: {
      marginTop: 18,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridCompact: {
      gap: 0,
    },
    loadMoreBtn: {
      marginTop: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      ...cardElevation(c.bg),
    },
    loadMoreText: {
      fontSize: 15,
      fontWeight: '700',
    },
    centered: {
      paddingVertical: 64,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
    },
    emptyCard: {
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 40,
      alignItems: 'center',
      gap: 10,
      ...cardElevation(c.bg),
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 21,
      maxWidth: 320,
    },
    errorText: {
      color: '#ff6b6b',
      textAlign: 'center',
      fontSize: 14,
    },
    retryBtn: {
      marginTop: 8,
      paddingHorizontal: 22,
      paddingVertical: 11,
      borderRadius: 999,
    },
    retryText: {
      fontWeight: '700',
    },
  });
}
