import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { AppColors } from '@/constants/themes';
import type { GamificationProgress } from '@/lib/gamification/computeProgress';
import { formatCoeurs } from '@/lib/gamification/computeProgress';

const AVATAR_SIZE = 96;
const RING_SIZE = 118;
const STROKE = 5;

type Props = {
  colors: AppColors;
  progress: GamificationProgress;
  loading?: boolean;
  photoUri?: string | null;
  initial: string;
  onPress?: () => void;
};

export function ProfileAvatarRing({
  colors,
  progress,
  loading,
  photoUri,
  initial,
  onPress,
}: Props) {
  const radius = (RING_SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillRatio = loading ? 0 : Math.min(1, Math.max(0, progress.progressInTier));
  const strokeDashoffset = circumference * (1 - fillRatio);
  const center = RING_SIZE / 2;

  const content = (
    <View style={styles.wrap}>
      <View style={[styles.ringBox, { width: RING_SIZE, height: RING_SIZE }]}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.pink} />
              <Stop offset="100%" stopColor="#ff9eb5" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.border}
            strokeWidth={STROKE}
            fill="none"
            opacity={0.55}
          />
          {!loading ? (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          ) : null}
        </Svg>

        <View style={styles.avatarCenter}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
              recyclingKey={photoUri}
            />
          ) : loading ? (
            <View style={[styles.avatar, { backgroundColor: colors.card }]}>
              <ActivityIndicator color={colors.pink} />
            </View>
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.card }]}>
              <Text style={[styles.initial, { color: colors.text }]}>{initial}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.levelBadge, { backgroundColor: colors.pink, borderColor: colors.bg }]}>
        <Text style={styles.tierEmoji}>{progress.tier.emoji}</Text>
        <Text
          style={[styles.tierTitle, { color: colors.onPink }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {progress.tier.title}
        </Text>
      </View>

      {!loading ? (
        <View style={styles.coeursBlock}>
          <View style={styles.coeursMainRow}>
            <Text style={[styles.coeursValue, { color: colors.pink }]}>
              {formatCoeurs(progress.coeurs)}
            </Text>
            <Text style={styles.coeursHeart}>❤️</Text>
          </View>
          <Text style={[styles.coeursLabel, { color: colors.pink }]}>cœurs EntreMeres</Text>
          {progress.nextTier ? (
            <Text style={[styles.coeursNext, { color: colors.textMuted }]}>
              encore {formatCoeurs(progress.pointsToNextLevel)} ❤️ pour {progress.nextTier.title}
            </Text>
          ) : (
            <Text style={[styles.coeursNext, { color: colors.textMuted }]}>Niveau maximum 🎉</Text>
          )}
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={photoUri ? 0.85 : 1} accessibilityRole="button">
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ringBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCenter: {
    position: 'absolute',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 40,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: -14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    zIndex: 2,
    maxWidth: 220,
  },
  tierEmoji: { fontSize: 14 },
  tierTitle: { fontSize: 12, fontWeight: '800', flexShrink: 1 },
  coeursBlock: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  coeursMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coeursValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  coeursHeart: { fontSize: 26 },
  coeursLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  coeursNext: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
