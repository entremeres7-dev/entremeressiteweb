import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { AppColors } from '@/constants/themes';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { TV_THUMBS, type TvCatalogItem } from '@/lib/tv/catalog';

type RowVariant = 'landscape' | 'portrait' | 'top5' | 'clip';

type Props = {
  title: string;
  data: TvCatalogItem[];
  variant?: RowVariant;
  onSeeAll?: () => void;
  onItemPress?: (item: TvCatalogItem) => void;
  onItemLongPress?: (item: TvCatalogItem) => void;
};

function cardSize(variant: RowVariant) {
  switch (variant) {
    case 'portrait':
      return { width: 130, height: 195 };
    case 'top5':
      return { width: 118, height: 178 };
    case 'clip':
      return { width: 240, height: 135 };
    default:
      return { width: 220, height: 124 };
  }
}

function PosterImage({
  source,
  width,
  height,
  imageKey,
  contentPosition = 'top',
}: {
  source: ImageSourcePropType;
  width: number;
  height: number;
  imageKey: string;
  contentPosition?: 'top' | 'center';
}) {
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={contentPosition}
        recyclingKey={imageKey}
        transition={0}
      />
    </View>
  );
}

function ContentCard({
  item,
  variant,
  rank,
  onPress,
  onLongPress,
  styles,
}: {
  item: TvCatalogItem;
  variant: RowVariant;
  rank?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  styles: ReturnType<typeof buildStyles>;
}) {
  const size = cardSize(variant);
  const thumb = item.thumb ? TV_THUMBS[item.thumb] : null;
  const showTitle = !item.hideTitle;

  if (variant === 'top5' && rank != null) {
    return (
      <TouchableOpacity
        style={styles.top5Row}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.9}
      >
        <Text style={styles.top5Rank}>{rank}</Text>
        <View style={[styles.card, styles.top5Poster, { width: size.width, height: size.height }]}>
          {thumb ? (
            <PosterImage
              source={thumb}
              width={size.width}
              height={size.height}
              imageKey={item.id}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: item.color }]} />
          )}
          {showTitle ? (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          ) : null}
          {showTitle ? (
            <View style={styles.cardTextWrap} pointerEvents="none">
              <Text style={styles.cardTitle} numberOfLines={3}>
                {item.title}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { width: size.width, height: size.height }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      {thumb ? (
        <PosterImage
          source={thumb}
          width={size.width}
          height={size.height}
          imageKey={item.id}
          contentPosition={variant === 'portrait' ? 'top' : 'center'}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: item.color }]} />
      )}

      {showTitle ? (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}

      {variant === 'clip' && item.duration ? (
        <View style={styles.clipDuration}>
          <Text style={styles.clipDurationText}>{item.duration}</Text>
        </View>
      ) : null}

      {showTitle ? (
        <View style={styles.cardTextWrap} pointerEvents="none">
          <Text style={styles.cardTitle} numberOfLines={variant === 'clip' ? 2 : 3}>
            {item.title}
          </Text>
          {item.subtitle ? <Text style={styles.cardSubtitle}>{item.subtitle}</Text> : null}
          {item.episode ? <Text style={styles.cardEpisode}>{item.episode}</Text> : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export function TvContentRow({
  title,
  data,
  variant = 'landscape',
  onSeeAll,
  onItemPress,
  onItemLongPress,
}: Props) {
  const styles = useThemedStyles(buildStyles);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll ? (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={data.length}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ContentCard
            item={item}
            variant={variant}
            rank={variant === 'top5' ? index + 1 : undefined}
            styles={styles}
            onPress={() => onItemPress?.(item)}
            onLongPress={() => onItemLongPress?.(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: variant === 'top5' ? 14 : 10 }} />}
      />
    </View>
  );
}

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    section: { marginTop: 24 },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      color: c.text,
      fontSize: 16,
      fontWeight: '700',
    },
    seeAll: {
      color: c.pink,
      fontSize: 13,
      fontWeight: '500',
    },
    list: { paddingHorizontal: 16 },
    top5Row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 2,
    },
    top5Poster: {
      flexShrink: 0,
    },
    card: {
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#111',
    },
    cardTextWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 10,
      zIndex: 2,
    },
    cardTitle: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '800',
      lineHeight: 14,
      textShadowColor: 'rgba(0,0,0,0.85)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    cardSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 10,
      marginTop: 4,
      fontWeight: '500',
    },
    cardEpisode: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 10,
      fontWeight: '500',
      marginTop: 4,
    },
    clipDuration: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.72)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      zIndex: 3,
    },
    clipDurationText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '700',
    },
    top5Rank: {
      fontSize: 56,
      fontWeight: '900',
      lineHeight: 52,
      color: c.text,
      opacity: 0.35,
      marginBottom: -2,
      minWidth: 34,
      textAlign: 'center',
    },
  });
}
