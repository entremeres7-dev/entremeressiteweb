import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { RencontreFilterChips } from '@/components/rencontres/RencontreFilterChips';

type Props = {
  colors: AppColors;
  storageKey: string;
  countries: string[];
  regions: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
  onCountryChange: (country: string | null) => void;
  onRegionChange: (region: string | null) => void;
  countLabel: string;
  compact?: boolean;
  /** SOS : une seule ligne repliée, chips plus petits, sans compteur. */
  variant?: 'default' | 'minimal';
  showCountLabel?: boolean;
  showRegionFilter?: boolean;
};

export function CollapsibleLocationFilters({
  colors,
  storageKey,
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  countLabel,
  compact = false,
  variant = 'default',
  showCountLabel = true,
  showRegionFilter = true,
}: Props) {
  const isMinimal = variant === 'minimal';
  const styles = buildStyles(colors, isMinimal);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((value) => {
      if (value === '1') setFiltersExpanded(true);
    });
  }, [storageKey]);

  const toggleFilters = useCallback(() => {
    setFiltersExpanded((prev) => {
      const next = !prev;
      AsyncStorage.setItem(storageKey, next ? '1' : '0').catch(() => {});
      return next;
    });
  }, [storageKey]);

  const hasActiveFilter = showRegionFilter
    ? !!(selectedCountry || selectedRegion)
    : !!selectedCountry;

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedCountry) parts.push(selectedCountry);
    if (showRegionFilter && selectedRegion) parts.push(selectedRegion);
    return parts.length ? parts.join(' · ') : 'Tous les pays';
  }, [selectedCountry, selectedRegion, showRegionFilter]);

  const clearFilters = useCallback(() => {
    onCountryChange(null);
    if (showRegionFilter) onRegionChange(null);
  }, [onCountryChange, onRegionChange, showRegionFilter]);

  if (isMinimal) {
    return (
      <View style={styles.filterBar}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterToggle}
            onPress={toggleFilters}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ expanded: filtersExpanded }}
            accessibilityLabel={filtersExpanded ? 'Masquer les filtres' : 'Filtrer par pays'}
          >
            <Ionicons name="funnel-outline" size={14} color={colors.pink} />
            <Text style={[styles.filterToggleTitle, { color: colors.text }]}>Filtrer</Text>
            {!filtersExpanded ? (
              <Text style={[styles.filterToggleSummary, { color: colors.textMuted }]} numberOfLines={1}>
                {filterSummary}
              </Text>
            ) : null}
            <Ionicons
              name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.textMuted}
              style={styles.chevron}
            />
          </TouchableOpacity>
          {hasActiveFilter && !filtersExpanded ? (
            <TouchableOpacity
              onPress={clearFilters}
              hitSlop={8}
              accessibilityLabel="Effacer les filtres"
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {filtersExpanded ? (
          <View style={styles.filterPanel}>
            <RencontreFilterChips
              colors={colors}
              timeFilter="all"
              onTimeFilterChange={() => {}}
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
              showRegionFilter={showRegionFilter}
            />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.filterBar, compact && styles.filterBarCompact]}>
      <TouchableOpacity
        style={[styles.filterToggle, compact && styles.filterToggleCompact]}
        onPress={toggleFilters}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityState={{ expanded: filtersExpanded }}
        accessibilityLabel={filtersExpanded ? 'Masquer les filtres' : 'Afficher les filtres'}
      >
        <View style={[styles.filterToggleLeft, compact && styles.filterToggleLeftCompact]}>
          <Ionicons name="options-outline" size={compact ? 18 : 20} color={colors.pink} />
          <Text style={[styles.filterToggleTitle, { color: colors.text }]}>
            {filtersExpanded ? 'Masquer les filtres' : 'Filtres'}
          </Text>
          {!filtersExpanded && !compact ? (
            <Text style={[styles.filterToggleSummary, { color: colors.textMuted }]} numberOfLines={1}>
              {filterSummary}
            </Text>
          ) : null}
        </View>
        <View style={[styles.filterToggleRight, compact && styles.filterToggleRightCompact]}>
          {!filtersExpanded && !compact && showCountLabel ? (
            <Text style={[styles.filterToggleCount, { color: colors.textSecondary }]} numberOfLines={1}>
              {countLabel}
            </Text>
          ) : null}
          <Ionicons
            name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
        </View>
        {!filtersExpanded && compact ? (
          <View style={styles.filterToggleMeta}>
            <Text style={[styles.filterToggleSummary, { color: colors.textMuted }]} numberOfLines={2}>
              {filterSummary}
            </Text>
            {showCountLabel ? (
              <Text style={[styles.filterToggleCount, { color: colors.textSecondary }]} numberOfLines={1}>
                {countLabel}
              </Text>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>

      {filtersExpanded ? (
        <View style={styles.filterPanel}>
          <RencontreFilterChips
            colors={colors}
            timeFilter="all"
            onTimeFilterChange={() => {}}
            countries={countries}
            regions={regions}
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            onCountryChange={onCountryChange}
            onRegionChange={onRegionChange}
            countLabel={countLabel}
            layout={compact ? 'inline' : 'toolbar'}
            wrapChips={compact}
            showTimeFilter={false}
            showRegionFilter={showRegionFilter}
          />
        </View>
      ) : null}
    </View>
  );
}

function buildStyles(colors: AppColors, minimal: boolean) {
  if (minimal) {
    return StyleSheet.create({
      filterBar: {
        marginBottom: 10,
      },
      filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      filterToggle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 4,
        paddingHorizontal: 2,
        minWidth: 0,
      },
      filterToggleTitle: {
        fontSize: 13,
        fontWeight: '600',
      },
      filterToggleSummary: {
        flex: 1,
        fontSize: 12,
      },
      chevron: {
        marginLeft: 2,
      },
      clearBtn: {
        marginLeft: 2,
      },
      filterPanel: {
        paddingTop: 8,
        paddingBottom: 4,
        paddingHorizontal: 2,
      },
    });
  }

  return StyleSheet.create({
    filterBar: {
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      overflow: 'hidden',
    },
    filterBarCompact: {
      marginBottom: 12,
      borderRadius: 14,
    },
    filterToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    filterToggleCompact: {
      flexWrap: 'wrap',
      paddingVertical: 12,
    },
    filterToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 0,
    },
    filterToggleLeftCompact: {
      flexBasis: '100%',
    },
    filterToggleTitle: {
      fontSize: 15,
      fontWeight: '700',
    },
    filterToggleSummary: {
      flex: 1,
      fontSize: 13,
    },
    filterToggleRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },
    filterToggleRightCompact: {
      marginLeft: 'auto',
    },
    filterToggleMeta: {
      flexBasis: '100%',
      gap: 4,
      paddingTop: 2,
    },
    filterToggleCount: {
      fontSize: 13,
      fontWeight: '600',
    },
    filterPanel: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    chevron: {},
    clearBtn: {},
  });
}
