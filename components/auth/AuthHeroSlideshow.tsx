import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const AUTH_BG_MAMANS = require('@/lib/1c0b4248-3400-4d2d-86fb-68d8e67c0557.png');

type Props = {
  style?: object;
};

export function AuthHeroSlideshow({ style }: Props) {
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Image
        source={AUTH_BG_MAMANS}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
        accessibilityLabel="Groupe de mamans EntreMeres"
      />
    </View>
  );
}
