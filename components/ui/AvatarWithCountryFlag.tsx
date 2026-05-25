import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { countryToFlagEmoji } from '@/lib/country/countryFlag';

type Props = {
  colors: AppColors;
  photoUri: string | null;
  country: string | null | undefined;
  size: number;
  showFlag?: boolean;
};

export function AvatarWithCountryFlag({
  colors,
  photoUri,
  country,
  size,
  showFlag = true,
}: Props) {
  const radius = size / 2;
  const flag = showFlag ? countryToFlagEmoji(country) : null;
  const flagSize = Math.max(16, Math.round(size * 0.42));
  const flagFontSize = Math.max(10, Math.round(flagSize * 0.62));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: size, height: size, borderRadius: radius }} contentFit="cover" />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: colors.pinkSoft,
            },
          ]}
        >
          <Ionicons name="heart" size={Math.round(size * 0.42)} color={colors.pink} />
        </View>
      )}

      {flag ? (
        <View
          style={[
            styles.flagBadge,
            {
              width: flagSize,
              height: flagSize,
              borderRadius: flagSize / 2,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          accessibilityLabel={country?.trim() ? `Pays : ${country}` : 'Pays : France'}
        >
          <Text style={[styles.flagText, { fontSize: flagFontSize, lineHeight: flagFontSize + 2 }]}>{flag}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    flexShrink: 0,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  flagText: {
    textAlign: 'center',
  },
});
