import React from 'react';
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
  displayed: MamanRencontre[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
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
  displayed,
  loading,
  refreshing,
  error,
  onRefresh,
  onPressProfile,
}: Props) {
  const styles = buildStyles(colors);
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const openHint = Platform.OS === 'web' ? 'cliquez sur une ligne' : 'appuyez sur une ligne';

  const emptyMessage =
    timeFilter === 'new'
      ? `Aucune nouvelle inscription avec photo ces ${NEW_MEMBER_DAYS} derniers jours.`
      : selectedCountry || selectedRegion
        ? 'Aucune maman ne correspond à ces filtres pour le moment.'
        : 'Aucun profil avec photo pour le moment.';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + insetsBottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />
      }
    >
      <DesktopContent maxWidth={980} flex={false}>
        <View style={[styles.pageHeader, compact && styles.pageHeaderCompact]}>
          <View style={styles.pageHeaderLeft}>
            <View style={[styles.iconBadge, compact && styles.iconBadgeCompact, { backgroundColor: colors.pinkSoft }]}>
              <Ionicons name="people" size={compact ? 20 : 24} color={colors.pink} />
            </View>
            <View style={styles.pageHeaderText}>
              <Text style={[styles.pageTitle, compact && styles.pageTitleCompact]}>Rencontres</Text>
              <Text style={[styles.pageSubtitle, compact && styles.pageSubtitleCompact]}>
                Des mamans près de chez vous, prêtes à échanger
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.filterBar, compact && styles.filterBarCompact, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
            layout="toolbar"
          />
        </View>

        <View style={styles.listSection}>
          {!loading && displayed.length > 0 ? (
            <Text style={[styles.listHint, { color: colors.textMuted }]}>
              {countLabel} — {openHint} pour voir le profil complet
            </Text>
          ) : null}

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.pink} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Chargement des profils…
              </Text>
            </View>
          ) : error ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.pink }]} onPress={onRefresh}>
                <Text style={[styles.retryText, { color: colors.onPink }]}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : displayed.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={44} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{emptyMessage}</Text>
            </View>
          ) : (
            displayed.map((item) => (
              <MamanProfileRow key={item.id} item={item} colors={colors} onPress={onPressProfile} />
            ))
          )}
        </View>
      </DesktopContent>
    </ScrollView>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      paddingTop: 28,
      paddingBottom: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    pageHeaderCompact: {
      paddingTop: 16,
      paddingBottom: 16,
    },
    pageHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      flex: 1,
    },
    pageHeaderText: {
      flex: 1,
      minWidth: 0,
    },
    iconBadge: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iconBadgeCompact: {
      width: 44,
      height: 44,
      borderRadius: 12,
    },
    pageTitle: {
      color: c.text,
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: -0.6,
    },
    pageTitleCompact: {
      fontSize: 26,
    },
    pageSubtitle: {
      color: c.textSecondary,
      fontSize: 15,
      marginTop: 4,
      lineHeight: 22,
    },
    pageSubtitleCompact: {
      fontSize: 14,
      lineHeight: 20,
    },
    filterBar: {
      marginTop: 20,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 16,
      ...cardElevation(c.bg),
    },
    filterBarCompact: {
      marginTop: 16,
      padding: 12,
    },
    listSection: {
      marginTop: 24,
    },
    listHint: {
      fontSize: 13,
      marginBottom: 14,
    },
    centered: {
      paddingVertical: 72,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
    },
    emptyCard: {
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 48,
      alignItems: 'center',
      gap: 12,
      ...cardElevation(c.bg),
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 22,
      maxWidth: 440,
    },
    errorText: {
      color: '#ff6b6b',
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 8,
    },
    retryBtn: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 999,
    },
    retryText: {
      fontWeight: '700',
    },
  });
}
