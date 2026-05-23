import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { AuthHeroSlideshow } from '@/components/auth/AuthHeroSlideshow';

type Props = {
  children: React.ReactNode;
};

export function AuthScreenLayout({ children }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors } = useTheme();
  const heroHeight = Math.round(height * 0.46);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.hero, { height: heroHeight }]}>
        <AuthHeroSlideshow />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.55)', colors.bg]}
          locations={[0.35, 0.72, 1]}
          style={styles.heroFade}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: 12, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroFade: {
    ...StyleSheet.absoluteFillObject,
  },
  body: {
    flex: 1,
    marginTop: -24,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 28,
  },
});
