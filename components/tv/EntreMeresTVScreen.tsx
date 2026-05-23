import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useMaListe } from '@/hooks/useMaListe';
import { tvContentToSaveInput } from '@/lib/ma-liste/catalog';
import { alertTvWatchUnavailable } from '@/lib/tv/availability';
import {
  TV_CLIPS,
  TV_KIDS,
  TV_SERIES_MAMANS,
  TV_TOP_5,
  type TvCatalogItem,
  type TvHeroSlide,
} from '@/lib/tv/catalog';
import { TvHeader } from './TvHeader';
import { TvHeroSection } from './TvHeroSection';
import { TvContentRow } from './TvContentRow';

import { TAB_BAR_CLEARANCE } from '@/constants/tabBarLayout';

type MaListeSection = 'top5' | 'series' | 'clips' | 'kids' | 'hero';

export function EntreMeresTVScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isLight } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const { session, add, isSaved } = useMaListe();

  const promptAdd = useCallback(
    async (label: string, input: Parameters<typeof add>[0]) => {
      if (!session) {
        Alert.alert('Connexion requise', 'Connectez-vous pour sauvegarder dans Ma liste.', [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/login') },
        ]);
        return;
      }
      const result = await add(input);
      if (!result.ok) {
        if (result.reason === 'login') return;
        Alert.alert('Erreur', result.message ?? 'Ajout impossible');
        return;
      }
      if (result.alreadySaved) {
        Alert.alert('Ma liste', `« ${label} » est déjà dans votre liste.`);
        return;
      }
      Alert.alert('Ma liste', `« ${label} » a été ajouté à votre liste.`, [
        { text: 'OK' },
        { text: 'Voir Ma liste', onPress: () => router.push('/(tabs)/ma-liste') },
      ]);
    },
    [session, add, router],
  );

  const handleWatch = useCallback(
    (slide: TvHeroSlide) => {
      alertTvWatchUnavailable(slide.title);
    },
    [],
  );

  const handleAddHeroToList = useCallback(
    (slide: TvHeroSlide) => {
      const input = {
        contentKey: `tv:hero:${slide.id}`,
        title: slide.title,
        episode: slide.episode,
        color: '#4a2040',
        watchShowTitle: slide.watch.showTitle,
        watchEpisodeTitle: slide.watch.episodeTitle,
        watchEpisodeSubtitle: slide.watch.episodeSubtitle,
      };
      if (isSaved(input.contentKey)) {
        Alert.alert('Ma liste', `« ${slide.title} » est déjà dans votre liste.`);
        return;
      }
      promptAdd(slide.title, input);
    },
    [promptAdd, isSaved],
  );

  const handleAddContentToList = useCallback(
    (item: TvCatalogItem, section: MaListeSection) => {
      const input = tvContentToSaveInput(item, section);
      if (isSaved(input.contentKey)) {
        Alert.alert('Ma liste', `« ${input.title} » est déjà dans votre liste.`);
        return;
      }
      promptAdd(input.title, input);
    },
    [promptAdd, isSaved],
  );

  const handleContentPress = useCallback((_item: TvCatalogItem) => {
    alertTvWatchUnavailable();
  }, []);

  const handleProfile = useCallback(() => {
    router.push('/(tabs)/profil');
  }, [router]);

  const showTvHeader = Platform.OS !== 'web';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      {showTvHeader ? (
        <View style={{ paddingTop: insets.top, backgroundColor: colors.bg }}>
          <TvHeader onProfile={handleProfile} />
        </View>
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_CLEARANCE + insets.bottom },
        ]}
      >
        <TvHeroSection onWatch={handleWatch} onAddToList={handleAddHeroToList} />
        <TvContentRow
          title="TOP 5"
          data={TV_TOP_5}
          variant="top5"
          onItemPress={handleContentPress}
          onItemLongPress={(item) => handleAddContentToList(item, 'top5')}
        />
        <TvContentRow
          title="Séries mamans"
          data={TV_SERIES_MAMANS}
          onItemPress={handleContentPress}
          onItemLongPress={(item) => handleAddContentToList(item, 'series')}
        />
        <TvContentRow
          title="Les moments à ne pas manquer"
          data={TV_CLIPS}
          variant="clip"
          onItemPress={handleContentPress}
          onItemLongPress={(item) => handleAddContentToList(item, 'clips')}
        />
        <TvContentRow
          title="Pour les enfants"
          data={TV_KIDS}
          variant="portrait"
          onItemPress={handleContentPress}
          onItemLongPress={(item) => handleAddContentToList(item, 'kids')}
        />
      </ScrollView>
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
    },
    scrollContent: {
      paddingBottom: 16,
    },
  });
}
