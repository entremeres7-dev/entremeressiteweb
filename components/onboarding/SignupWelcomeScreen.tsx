import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';

const WELCOME_LOGO = require('@/assets/images/logo3.png');
const CELEBRATION_MS = 2800;

type Props = {
  onContinue: () => void;
};

const STEPS = [
  { icon: 'people-outline' as const, text: 'Rencontre entre mamans' },
  { icon: 'tv-outline' as const, text: 'Le streaming des mamans' },
  { icon: 'chatbubbles-outline' as const, text: 'SOS Maman et messages' },
];

export function SignupWelcomeScreen({ onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;
  const celebrateFade = useRef(new Animated.Value(0)).current;
  const celebrateScale = useRef(new Animated.Value(0.92)).current;
  const [celebrating, setCelebrating] = useState(false);

  const displayName = useMemo(() => {
    if (profile?.username?.trim()) return profile.username.trim();
    const meta = user?.user_metadata?.username;
    if (typeof meta === 'string' && meta.trim()) return meta.trim();
    return 'Maman';
  }, [profile?.username, user?.user_metadata?.username]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  useEffect(() => {
    if (!celebrating) return;

    Animated.parallel([
      Animated.timing(celebrateFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(celebrateScale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      onContinue();
    }, CELEBRATION_MS);

    return () => clearTimeout(timer);
  }, [celebrating, celebrateFade, celebrateScale, onContinue]);

  const handleStart = () => {
    if (celebrating) return;
    setCelebrating(true);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <StatusBar barStyle={isLightTheme(colors.bg) ? 'dark-content' : 'light-content'} />
      <ConfettiBurst active={celebrating} />

      {celebrating ? (
        <Animated.View
          style={[
            styles.celebration,
            {
              opacity: celebrateFade,
              transform: [{ scale: celebrateScale }],
            },
          ]}
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>Bienvenue dans la plateforme des mamans</Text>
          <Text style={styles.celebrationSubtitle}>
            {displayName}, vous faites partie d'EntreMeres 💗
          </Text>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.content,
            { opacity: fade, transform: [{ translateY: rise }] },
          ]}
        >
          <Image
            source={WELCOME_LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="EntreMeres"
          />
          <Text style={styles.eyebrow}>C'est parti !</Text>
          <Text style={styles.title}>Bienvenue, {displayName} 💗</Text>
          <Text style={styles.subtitle}>
            Votre profil est prêt et vous avez accepté la charte. Découvrez tout ce que
            EntreMeres vous réserve.
          </Text>

          <View style={styles.steps}>
            {STEPS.map((step) => (
              <View key={step.text} style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={18} color={colors.pink} />
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleStart} activeOpacity={0.88}>
            <Text style={styles.btnText}>Entrer dans l'app</Text>
            <Ionicons name="sparkles" size={18} color={colors.onPink} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.bg,
      paddingHorizontal: 28,
      justifyContent: 'center',
    },
    content: {
      alignItems: 'center',
    },
    celebration: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      zIndex: 11,
    },
    celebrationEmoji: {
      fontSize: 56,
      marginBottom: 20,
    },
    celebrationTitle: {
      color: c.text,
      fontSize: 28,
      fontWeight: '800',
      textAlign: 'center',
      lineHeight: 36,
    },
    celebrationSubtitle: {
      color: c.pink,
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 14,
      lineHeight: 24,
    },
    logo: {
      width: 200,
      height: 62,
      marginBottom: 28,
    },
    eyebrow: {
      color: c.pink,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    title: {
      color: c.text,
      fontSize: 26,
      fontWeight: '800',
      textAlign: 'center',
      lineHeight: 34,
    },
    subtitle: {
      color: c.textMuted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      marginTop: 14,
      maxWidth: 340,
    },
    steps: {
      alignSelf: 'stretch',
      marginTop: 28,
      gap: 12,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.card,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    stepIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.pinkSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepText: {
      flex: 1,
      color: c.text,
      fontSize: 15,
      fontWeight: '600',
    },
    btn: {
      marginTop: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.pink,
      borderRadius: 28,
      paddingVertical: 16,
      paddingHorizontal: 28,
      alignSelf: 'stretch',
    },
    btnText: {
      color: c.onPink,
      fontSize: 17,
      fontWeight: '700',
    },
  });
}
