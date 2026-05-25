import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';
import { RencontreProfilePhoto, RENCONTRE_PHOTO_ASPECT } from './RencontreProfilePhoto';
import type { MamanRencontre } from '@/lib/rencontres/types';

type Props = {
  item: MamanRencontre;
  colors: AppColors;
  onPress: (m: MamanRencontre) => void;
  columns?: 2 | 3;
};

export function MamanProfileRow({ item, colors, onPress, columns = 2 }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        columns === 3 ? styles.cardThreeCol : styles.cardTwoCol,
        cardElevation(colors.bg),
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null,
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.photoWrap}>
        <RencontreProfilePhoto
          uri={item.photoUrl}
          style={styles.photo}
          placeholderColor={item.color}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.88)']}
          locations={[0.4, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.photoTop}>
          <View style={styles.discoverPill}>
            <Ionicons name="sparkles" size={11} color="#fff" />
          </View>
        </View>
        <View style={styles.photoOverlay}>
          <DisplayNameWithTier
            name={item.name}
            tierEmoji={item.tierEmoji}
            style={styles.name}
            numberOfLines={1}
          />
          <View style={styles.metaRow}>
            {item.age != null ? <Text style={styles.meta}>{item.age} ans</Text> : null}
            {item.age != null && item.city ? <Text style={styles.metaDot}>·</Text> : null}
            <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.9)" />
            <Text style={styles.meta} numberOfLines={1}>
              {item.city}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Text style={[styles.bio, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.bio}
        </Text>
        {item.tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View
                key={`${item.id}-tag-${index}`}
                style={[styles.tag, { backgroundColor: colors.pinkSoft, borderColor: colors.border }]}
              >
                <Text style={[styles.tagText, { color: colors.pink }]} numberOfLines={1}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#111',
  },
  cardTwoCol: {
    width: '48.2%',
  },
  cardThreeCol: {
    width: '31.5%',
  },
  photoWrap: {
    aspectRatio: RENCONTRE_PHOTO_ASPECT,
    position: 'relative',
    backgroundColor: '#111',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoTop: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  discoverPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 11,
    paddingBottom: 11,
    gap: 3,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  meta: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
  },
  footer: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    gap: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bio: {
    fontSize: 11,
    lineHeight: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: '100%',
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
