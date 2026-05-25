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
import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';
import { CollapsibleLocationFilters } from '@/components/shared/CollapsibleLocationFilters';
import type { SosMamanPost } from '@/lib/sos-maman/types';
import { SosPostCard } from './SosPostCard';

type Props = {
  colors: AppColors;
  insetsBottom: number;
  posts: SosMamanPost[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  needsSetup: boolean;
  currentUserId: string | null;
  onRefresh: () => void;
  onPressPost: (post: SosMamanPost) => void;
  onMenuPost: (post: SosMamanPost) => void;
  onPressAuthor?: (post: SosMamanPost) => void;
  onPublish: () => void;
  countries: string[];
  regions: string[];
  selectedCountry: string | null;
  selectedRegion: string | null;
  onCountryChange: (country: string | null) => void;
  onRegionChange: (region: string | null) => void;
  hasLocationFilter: boolean;
};

export function SosMamanDesktopView({
  colors,
  insetsBottom,
  posts,
  loading,
  refreshing,
  error,
  needsSetup,
  currentUserId,
  onRefresh,
  onPressPost,
  onMenuPost,
  onPressAuthor,
  onPublish,
  countries,
  regions,
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  hasLocationFilter,
}: Props) {
  const styles = buildStyles(colors);
  const { width } = useWindowDimensions();
  const isNativeMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  const compact = isNativeMobile || width < 640;
  const publicationCount = loading ? '…' : String(posts.length);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + insetsBottom + 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />
      }
    >
      <DesktopContent maxWidth={980} flex={false}>
        <View style={[styles.pageHeader, compact && styles.pageHeaderCompact]}>
          {compact ? (
            <>
              <View style={styles.pageHeaderTopRow}>
                <View style={styles.pageHeaderTitleRow}>
                  <View style={[styles.iconBadge, styles.iconBadgeCompact, { backgroundColor: colors.pinkSoft }]}>
                    <Ionicons name="heart" size={20} color={colors.pink} />
                  </View>
                  <View style={styles.pageHeaderTitleBlock}>
                    <Text style={[styles.pageTitle, styles.pageTitleCompact]} numberOfLines={1}>
                      SOS Maman
                    </Text>
                    <Text style={[styles.pageMeta, { color: colors.textMuted }]} numberOfLines={1}>
                      {publicationCount} publication{posts.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.publishBtn, styles.publishBtnCompact, { backgroundColor: colors.pink }]}
                  onPress={onPublish}
                  activeOpacity={0.9}
                >
                  <Ionicons name="add" size={18} color={colors.onPink} />
                  <Text style={[styles.publishBtnText, styles.publishBtnTextCompact, { color: colors.onPink }]}>
                    Publier
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.pageHeaderLeft}>
                <View style={[styles.iconBadge, { backgroundColor: colors.pinkSoft }]}>
                  <Ionicons name="heart" size={24} color={colors.pink} />
                </View>
                <View style={styles.pageHeaderText}>
                  <Text style={styles.pageTitle}>SOS Maman</Text>
                  <Text style={styles.pageSubtitle}>
                    Questions, confidences et sondages — les mamans vous répondent avec bienveillance
                  </Text>
                </View>
              </View>
              <View style={styles.pageHeaderActions}>
                <View style={[styles.countBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.countValue, { color: colors.text }]}>
                    {publicationCount}
                  </Text>
                  <Text style={[styles.countLabel, { color: colors.textMuted }]}>
                    publication{posts.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.publishBtn, { backgroundColor: colors.pink }]}
                  onPress={onPublish}
                  activeOpacity={0.9}
                >
                  <Ionicons name="add" size={20} color={colors.onPink} />
                  <Text style={[styles.publishBtnText, { color: colors.onPink }]}>Publier</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <CollapsibleLocationFilters
          colors={colors}
          storageKey="sos_maman_filters_expanded"
          countries={countries}
          regions={regions}
          selectedCountry={selectedCountry}
          selectedRegion={selectedRegion}
          onCountryChange={onCountryChange}
          onRegionChange={onRegionChange}
          countLabel={`${publicationCount} publication${posts.length !== 1 ? 's' : ''}`}
          variant="minimal"
          showCountLabel={false}
          showRegionFilter={false}
        />

        {needsSetup ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="construct-outline" size={40} color={colors.pink} />
            <Text style={[styles.setupTitle, { color: colors.text }]}>Tables à activer dans Supabase</Text>
            <Text style={[styles.setupText, { color: colors.textMuted }]}>
              Exécutez database/create_sos_maman_tables.sql puis database/add_sos_maman_photos.sql
              dans l’éditeur SQL Supabase, puis rechargez l’app.
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.pink} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Chargement des publications…</Text>
          </View>
        ) : error ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.pink }]} onPress={onRefresh}>
              <Text style={[styles.retryText, { color: colors.onPink }]}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : posts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {hasLocationFilter
                ? 'Aucune publication ne correspond à ces filtres pour le moment.'
                : 'Posez une question, lancez un sondage ou partagez une confidence.\nLes mamans sont là pour vous 💗'}
            </Text>
            <TouchableOpacity
              style={[styles.publishBtn, styles.publishBtnLarge, { backgroundColor: colors.pink }]}
              onPress={onPublish}
              activeOpacity={0.9}
            >
              <Ionicons name="add" size={20} color={colors.onPink} />
              <Text style={[styles.publishBtnText, { color: colors.onPink }]}>Publier une demande</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.listSection, compact && styles.listSectionCompact]}>
            {!compact ? (
              <Text style={[styles.listHint, { color: colors.textMuted }]}>
                Cliquez sur une publication pour lire les réponses des mamans
              </Text>
            ) : null}
            {posts.map((post) => (
              <SosPostCard
                key={post.id}
                post={post}
                colors={colors}
                currentUserId={currentUserId}
                variant="desktop"
                onPress={() => onPressPost(post)}
                onMenu={onMenuPost}
                onPressAuthor={onPressAuthor}
              />
            ))}
          </View>
        )}
      </DesktopContent>
    </ScrollView>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24,
      paddingTop: 28,
      paddingBottom: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    pageHeaderCompact: {
      flexDirection: 'column',
      gap: 0,
      paddingTop: 12,
      paddingBottom: 12,
    },
    pageHeaderTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      width: '100%',
    },
    pageHeaderTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 0,
    },
    pageHeaderTitleBlock: {
      flex: 1,
      minWidth: 0,
    },
    pageMeta: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2,
    },
    pageHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
      flex: 1,
    },
    pageHeaderText: {
      flex: 1,
    },
    pageHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 0,
    },
    iconBadge: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBadgeCompact: {
      width: 40,
      height: 40,
      borderRadius: 12,
      flexShrink: 0,
    },
    pageTitle: {
      color: c.text,
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: -0.6,
    },
    pageTitleCompact: {
      fontSize: 22,
      letterSpacing: -0.3,
    },
    pageSubtitle: {
      color: c.textSecondary,
      fontSize: 15,
      marginTop: 4,
      lineHeight: 22,
      maxWidth: 520,
    },
    countBadge: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      minWidth: 84,
      ...cardElevation(c.bg),
    },
    countValue: {
      fontSize: 24,
      fontWeight: '900',
      lineHeight: 26,
    },
    countLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
    publishBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 999,
      ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
    },
    publishBtnCompact: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexShrink: 0,
    },
    publishBtnTextCompact: {
      fontSize: 14,
    },
    publishBtnLarge: {
      marginTop: 8,
      paddingHorizontal: 22,
      paddingVertical: 14,
    },
    publishBtnText: {
      fontWeight: '700',
      fontSize: 15,
    },
    listSection: {
      marginTop: 24,
    },
    listSectionCompact: {
      marginTop: 12,
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
      marginTop: 24,
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
    setupTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    setupText: {
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 480,
    },
    errorText: {
      color: '#ff6b6b',
      textAlign: 'center',
      fontSize: 14,
    },
    retryBtn: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 999,
      marginTop: 4,
    },
    retryText: {
      fontWeight: '700',
    },
  });
}
