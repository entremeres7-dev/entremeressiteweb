import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { cardElevation } from '@/constants/themeUtils';
import { DisplayNameWithTier } from '@/components/gamification/DisplayNameWithTier';
import type { MamanRencontre } from '@/lib/rencontres/types';

type Variant = 'mobile' | 'desktop';

type Props = {
  item: MamanRencontre;
  onPress: (m: MamanRencontre) => void;
  colors: AppColors;
  variant?: Variant;
  width?: number;
  photoHeight?: number;
};

export function MamanProfileCard({
  item,
  onPress,
  colors,
  variant = 'mobile',
  width,
  photoHeight = 140,
}: Props) {
  if (variant === 'desktop') {
    return (
      <TouchableOpacity
        style={[
          desktopStyles.card,
          {
            width: width ?? 280,
            backgroundColor: colors.card,
            borderColor: colors.border,
            ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
          },
          cardElevation(colors.bg),
        ]}
        onPress={() => onPress(item)}
        activeOpacity={0.92}
      >
        <View style={desktopStyles.photoWrap}>
          <Image source={{ uri: item.photoUrl }} style={desktopStyles.photo} contentFit="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.88)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={desktopStyles.overlay}>
            <DisplayNameWithTier
              name={item.name}
              tierEmoji={item.tierEmoji}
              style={desktopStyles.name}
              numberOfLines={1}
            />
            <View style={desktopStyles.metaRow}>
              {item.age != null ? <Text style={desktopStyles.meta}>{item.age} ans</Text> : null}
              {item.age != null && item.city ? <Text style={desktopStyles.metaDot}>·</Text> : null}
              <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={desktopStyles.meta} numberOfLines={1}>
                {item.city}
              </Text>
            </View>
            {item.tags.length > 0 ? (
              <View style={desktopStyles.tagsRow}>
                {item.tags.slice(0, 2).map((tag) => (
                  <View key={tag} style={desktopStyles.tag}>
                    <Text style={desktopStyles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        <View style={desktopStyles.footer}>
          <Text style={[desktopStyles.bio, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.bio}
          </Text>
          <View style={[desktopStyles.cta, { backgroundColor: colors.pink }]}>
            <Text style={[desktopStyles.ctaText, { color: colors.onPink }]}>Voir le profil</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.onPink} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        mobileStyles.card,
        {
          width,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        cardElevation(colors.bg),
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.photoUrl }}
        style={[mobileStyles.cardPhoto, { height: photoHeight }]}
        contentFit="cover"
      />
      <View style={mobileStyles.cardBody}>
        <View style={mobileStyles.cardNameRow}>
          <DisplayNameWithTier
            name={item.name}
            tierEmoji={item.tierEmoji}
            style={[mobileStyles.cardName, { color: colors.text }]}
            numberOfLines={1}
          />
          {item.age != null ? (
            <Text style={[mobileStyles.cardName, { color: colors.text }]} numberOfLines={1}>
              , {item.age}
            </Text>
          ) : null}
        </View>
        <Text style={[mobileStyles.cardCity, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.city}
        </Text>
        <Text style={[mobileStyles.cardBio, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.bio}
        </Text>
        <View style={[mobileStyles.cardFooter, { borderTopColor: colors.border }]}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.pink} />
          <Text style={[mobileStyles.cardAction, { color: colors.pink }]}>Discuter</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const mobileStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 220,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardPhoto: { width: '100%' },
  cardBody: { padding: 12 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  cardName: { fontSize: 15, fontWeight: '700', flexShrink: 1 },
  cardCity: { fontSize: 12, marginTop: 2 },
  cardBio: { fontSize: 11, lineHeight: 15, marginTop: 4 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cardAction: { fontSize: 12, fontWeight: '700' },
});

const desktopStyles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  photoWrap: {
    aspectRatio: 4 / 5,
    position: 'relative',
    backgroundColor: '#111',
  },
  photo: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    gap: 6,
  },
  name: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  meta: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: 'rgba(255,106,136,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    padding: 14,
    gap: 12,
  },
  bio: {
    fontSize: 13,
    lineHeight: 19,
    minHeight: 38,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 999,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
