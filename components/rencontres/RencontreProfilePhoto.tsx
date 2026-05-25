import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, ImageStyle } from 'react-native';

/** Ratio portrait adapté aux photos de profil (selfies). */
export const RENCONTRE_PHOTO_ASPECT = 4 / 5;

type Props = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageProps['contentFit'];
  /** Fond si pas de photo (recherche par pseudo). */
  placeholderColor?: string;
};

/** Photo Rencontres — recadrage centré sur le haut pour garder le visage visible. */
export function RencontreProfilePhoto({
  uri,
  style,
  contentFit = 'cover',
  placeholderColor = '#3d2a4a',
}: Props) {
  if (!uri?.trim()) {
    return (
      <View style={[style, styles.placeholder, { backgroundColor: placeholderColor }]}>
        <Ionicons name="person" size={40} color="rgba(255,255,255,0.45)" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      contentPosition="top"
      transition={150}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
