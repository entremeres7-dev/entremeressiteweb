import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_LOGO = require('@/assets/images/logo2.png');

type Props = {
  compact?: boolean;
  source?: number;
  height?: number;
};

export function AuthHeroLogo({ compact = false, source, height = 52 }: Props) {
  const insets = useSafeAreaInsets();

  if (compact) return null;

  return (
    <View style={[styles.wrap, { top: insets.top + 12 }]} pointerEvents="none">
      <Image
        source={source ?? DEFAULT_LOGO}
        style={[styles.logo, { height }]}
        contentFit="contain"
        accessibilityLabel="EntreMeres"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 2,
  },  logo: {
    width: '88%',
    maxWidth: 340,
    height: 52,
  },
});
