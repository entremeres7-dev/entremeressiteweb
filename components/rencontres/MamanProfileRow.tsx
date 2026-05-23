import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';
import type { MamanRencontre } from '@/lib/rencontres/types';

type Props = {
  item: MamanRencontre;
  colors: AppColors;
  onPress: (m: MamanRencontre) => void;
};

export function MamanProfileRow({ item, colors, onPress }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 640;

  return (
    <TouchableOpacity
      style={[
        styles.row,
        compact && styles.rowCompact,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
        },
        cardElevation(colors.bg),
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.92}
    >
      <Image
        source={{ uri: item.photoUrl }}
        style={[styles.photo, compact && styles.photoCompact]}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <DisplayNameWithTier
            name={item.name}
            tierEmoji={item.tierEmoji}
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          />
          {item.age != null ? (
            <Text style={[styles.age, { color: colors.textSecondary }]}>, {item.age} ans</Text>
          ) : null}
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.pink} />
          <Text style={[styles.city, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.city}
          </Text>
        </View>

        <Text style={[styles.bio, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.bio}
        </Text>

        {item.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.pinkSoft, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.pink }]}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {!compact ? (
        <View style={styles.actions}>
          <View style={[styles.primaryBtn, { backgroundColor: colors.pink }]}>
            <Text style={[styles.primaryBtnText, { color: colors.onPink }]}>Voir le profil</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.onPink} />
          </View>
          <Text style={[styles.hint, { color: colors.textMuted }]}>Cliquez pour ouvrir</Text>
        </View>
      ) : (
        <View style={[styles.primaryBtn, styles.primaryBtnCompact, { backgroundColor: colors.pink }]}>
          <Text style={[styles.primaryBtnText, { color: colors.onPink }]}>Voir le profil</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.onPink} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  rowCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#111',
    flexShrink: 0,
  },
  photoCompact: {
    width: '100%',
    height: 180,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  age: {
    fontSize: 18,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  city: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actions: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
    minWidth: 140,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
  },
  primaryBtnCompact: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  hint: {
    fontSize: 11,
  },
});
