import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: AppColors;
  compact?: boolean;
  minimal?: boolean;
};

function Chip({ label, active, onPress, colors, compact, minimal }: ChipProps) {
  const light = isLightTheme(colors.bg);
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        compact && styles.chipCompact,
        minimal && styles.chipMinimal,
        {
          backgroundColor: active ? colors.pinkSoft : light ? colors.surface : colors.card,
          borderColor: active ? colors.pink : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.chipText,
          compact && styles.chipTextCompact,
          minimal && styles.chipTextMinimal,
          { color: active ? colors.pink : colors.textSecondary, fontWeight: active ? '700' : '600' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type RowProps = {
  title: string;
  children: React.ReactNode;
  colors: AppColors;
  wrap?: boolean;
  sidebar?: boolean;
  toolbar?: boolean;
};

function FilterRow({
  title,
  children,
  colors,
  wrap,
  sidebar,
  toolbar,
  minimal,
}: RowProps & { toolbar?: boolean; minimal?: boolean }) {
  if (toolbar) {
    return (
      <View style={[styles.toolbarGroup, minimal && styles.toolbarGroupMinimal]}>
        <Text style={[styles.toolbarLabel, minimal && styles.toolbarLabelMinimal, { color: colors.textMuted }]}>
          {title}
        </Text>
        <View style={styles.toolbarChips}>{children}</View>
      </View>
    );
  }

  if (sidebar || wrap) {
    return (
      <View style={[styles.row, sidebar && styles.rowSidebar, minimal && styles.rowMinimal]}>
        <Text
          style={[
            styles.rowTitle,
            sidebar && styles.rowTitleSidebar,
            minimal && styles.rowTitleMinimal,
            { color: colors.textMuted },
          ]}
        >
          {title}
        </Text>
        <View style={[styles.wrapRow, sidebar && styles.wrapRowSidebar, minimal && styles.wrapRowMinimal]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={[styles.rowTitle, { color: colors.textMuted }]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

type Props = {
  colors: AppColors;
  timeFilter: 'all' | 'new';
  onTimeFilterChange: (f: 'all' | 'new') => void;
  countries: string[];
  regions: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
  onCountryChange: (country: string | null) => void;
  onRegionChange: (region: string | null) => void;
  countLabel: string;
  wrapChips?: boolean;
  layout?: 'inline' | 'sidebar' | 'toolbar';
  showTimeFilter?: boolean;
  minimal?: boolean;
  showRegionFilter?: boolean;
};

export function RencontreFilterChips({
  colors,
  timeFilter,
  onTimeFilterChange,
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  countLabel,
  wrapChips = false,
  layout = 'inline',
  showTimeFilter = true,
  minimal = false,
  showRegionFilter = true,
}: Props) {
  const sidebar = layout === 'sidebar';
  const toolbar = layout === 'toolbar';
  const compact = sidebar || toolbar || minimal;

  if (toolbar) {
    return (
      <View style={styles.toolbarWrap}>
        {showTimeFilter ? (
          <View style={styles.toolbarRow}>
            <Text style={[styles.toolbarSection, { color: colors.textMuted }]}>Afficher</Text>
            <View style={styles.toolbarChips}>
              <Chip label="Toutes" active={timeFilter === 'all'} onPress={() => onTimeFilterChange('all')} colors={colors} compact />
              <Chip label="Récentes" active={timeFilter === 'new'} onPress={() => onTimeFilterChange('new')} colors={colors} compact />
            </View>
          </View>
        ) : null}

        {countries.length > 0 ? (
          <FilterRow title="Pays" colors={colors} toolbar>
            <Chip label="Tous les pays" active={!selectedCountry} onPress={() => onCountryChange(null)} colors={colors} compact />
            {countries.map((c) => (
              <Chip
                key={c}
                label={c}
                active={selectedCountry === c}
                onPress={() => onCountryChange(selectedCountry === c ? null : c)}
                colors={colors}
                compact
              />
            ))}
          </FilterRow>
        ) : null}

        {showRegionFilter && selectedCountry && regions.length > 0 ? (
          <FilterRow title="Région" colors={colors} toolbar>
            <Chip label="Toutes" active={!selectedRegion} onPress={() => onRegionChange(null)} colors={colors} compact />
            {regions.map((r) => (
              <Chip
                key={r}
                label={r}
                active={selectedRegion === r}
                onPress={() => onRegionChange(selectedRegion === r ? null : r)}
                colors={colors}
                compact
              />
            ))}
          </FilterRow>
        ) : null}

        <Text style={[styles.toolbarCount, { color: colors.textSecondary }]}>{countLabel}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, sidebar && styles.wrapSidebar, minimal && styles.wrapMinimal]}>
      {showTimeFilter ? (
        <View style={[styles.timeRow, sidebar && styles.timeRowSidebar]}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Afficher</Text>
          <View style={styles.wrapRow}>
            <Chip
              label="Toutes"
              active={timeFilter === 'all'}
              onPress={() => onTimeFilterChange('all')}
              colors={colors}
              compact={compact}
            />
            <Chip
              label="Récentes"
              active={timeFilter === 'new'}
              onPress={() => onTimeFilterChange('new')}
              colors={colors}
              compact={compact}
            />
          </View>
          {!sidebar ? (
            <Text style={[styles.count, { color: colors.textMuted }]}>{countLabel}</Text>
          ) : null}
        </View>
      ) : null}

      {countries.length > 0 ? (
        <FilterRow title="Pays" colors={colors} wrap={wrapChips} sidebar={sidebar} minimal={minimal}>
          <Chip
            label={minimal ? 'Tous' : 'Tous les pays'}
            active={!selectedCountry}
            onPress={() => onCountryChange(null)}
            colors={colors}
            compact={compact}
            minimal={minimal}
          />
          {countries.map((c) => (
            <Chip
              key={c}
              label={c}
              active={selectedCountry === c}
              onPress={() => onCountryChange(selectedCountry === c ? null : c)}
              colors={colors}
              compact={compact}
              minimal={minimal}
            />
          ))}
        </FilterRow>
      ) : null}

      {showRegionFilter && selectedCountry && regions.length > 0 ? (
        <FilterRow title="Région" colors={colors} wrap={wrapChips} sidebar={sidebar} minimal={minimal}>
          <Chip
            label="Toutes"
            active={!selectedRegion}
            onPress={() => onRegionChange(null)}
            colors={colors}
            compact={compact}
            minimal={minimal}
          />
          {regions.map((r) => (
            <Chip
              key={r}
              label={r}
              active={selectedRegion === r}
              onPress={() => onRegionChange(selectedRegion === r ? null : r)}
              colors={colors}
              compact={compact}
              minimal={minimal}
            />
          ))}
        </FilterRow>
      ) : null}

      {sidebar ? (
        <View style={[styles.resultPill, { backgroundColor: colors.pinkSoft, borderColor: colors.border }]}>
          <Text style={[styles.resultPillText, { color: colors.pink }]}>{countLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, marginBottom: 16 },
  wrapSidebar: {
    gap: 18,
    marginBottom: 0,
  },
  wrapMinimal: {
    gap: 8,
    marginBottom: 0,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeRowSidebar: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  count: { fontSize: 12, marginLeft: 'auto' },
  row: { gap: 6 },
  rowMinimal: { gap: 4 },
  rowSidebar: { gap: 8 },
  rowTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 2,
  },
  rowTitleSidebar: {
    fontSize: 11,
  },
  rowTitleMinimal: {
    fontSize: 10,
    letterSpacing: 0.4,
  },
  scrollContent: { gap: 8, paddingRight: 8 },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wrapRowSidebar: {
    gap: 6,
  },
  wrapRowMinimal: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipCompact: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipMinimal: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextCompact: { fontSize: 12 },
  chipTextMinimal: { fontSize: 11 },
  toolbarWrap: { gap: 14 },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolbarSection: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    minWidth: 72,
  },
  toolbarGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  toolbarGroupMinimal: {
    gap: 6,
  },
  toolbarLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    minWidth: 72,
    paddingTop: 8,
  },
  toolbarLabelMinimal: {
    fontSize: 10,
    minWidth: 44,
    paddingTop: 6,
  },
  toolbarChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  toolbarCount: {
    fontSize: 13,
    fontWeight: '600',
    paddingTop: 2,
  },
  resultPill: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resultPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
