import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const AUTH_BG_MAMANS = require('@/lib/1c0b4248-3400-4d2d-86fb-68d8e67c0557.png');
const AUTH_BG_TV = require('@/lib/imagepicture.png');

const HOLD_MS = 4500;
const FADE_MS = 1000;

type Props = {
  style?: object;
};

export function AuthHeroSlideshow({ style }: Props) {
  const crossfade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;

    const runCycle = () => {
      Animated.sequence([
        Animated.timing(crossfade, {
          toValue: 1,
          duration: FADE_MS,
          useNativeDriver: true,
        }),
        Animated.delay(HOLD_MS),
        Animated.timing(crossfade, {
          toValue: 0,
          duration: FADE_MS,
          useNativeDriver: true,
        }),
        Animated.delay(HOLD_MS),
      ]).start(({ finished }) => {
        if (finished && mounted) runCycle();
      });
    };

    runCycle();

    return () => {
      mounted = false;
      crossfade.stopAnimation();
    };
  }, [crossfade]);

  const tvOpacity = crossfade;
  const mamansOpacity = crossfade.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: mamansOpacity }]}>
        <Image
          source={AUTH_BG_MAMANS}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="top"
          accessibilityLabel="Groupe de mamans EntreMeres"
        />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: tvOpacity }]}>
        <Image
          source={AUTH_BG_TV}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="center"
          accessibilityLabel="EntreMeres TV sur télévision, ordinateur, tablette et mobile"
        />
      </Animated.View>
    </View>
  );
}
