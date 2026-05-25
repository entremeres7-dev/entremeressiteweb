import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { AppColors } from '@/constants/themes';
import { useThemedStyles } from '@/hooks/useThemedStyles';

type Props = {
  compact?: boolean;
};

export function AuthTagline({ compact = false }: Props) {
  const styles = useThemedStyles((c) => buildStyles(c, compact));

  return (
    <Text style={styles.tagline}>
      Une communauté de mamans.{'\n'}
      <Text style={styles.taglineAccent}>Du soutien. Des rencontres.</Text>
    </Text>
  );
}

function buildStyles(c: AppColors, compact: boolean) {
  const fontSize = compact ? 17 : 20;
  const lineHeight = compact ? 24 : 28;

  return StyleSheet.create({
    tagline: {
      color: c.text,
      fontSize,
      fontWeight: '700',
      lineHeight,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    taglineAccent: {
      color: c.pink,
      fontSize,
      fontWeight: '700',
      lineHeight,
    },
  });
}
