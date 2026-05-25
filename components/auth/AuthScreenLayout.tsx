import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { AuthHeroSlideshow } from '@/components/auth/AuthHeroSlideshow';
import { AuthHeroLogo } from '@/components/auth/AuthHeroLogo';
import { AuthScreenLayoutContext } from '@/components/auth/authScreenLayoutContext';

type Props = {
  children: React.ReactNode;
  heroLogoSource?: number;
  heroLogoHeight?: number;
};

const EXPANDED_HERO_HEIGHT = 72;
const DEFAULT_HERO_HEIGHT = Math.round(Dimensions.get('screen').height * 0.46);

export function AuthScreenLayout({ children, heroLogoSource, heroLogoHeight }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [formExpanded, setFormExpanded] = useState(false);

  const heroHeight = formExpanded ? EXPANDED_HERO_HEIGHT : DEFAULT_HERO_HEIGHT;

  const layoutContext = useMemo(
    () => ({ formExpanded, setFormExpanded }),
    [formExpanded],
  );

  return (
    <AuthScreenLayoutContext.Provider value={layoutContext}>
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="light-content" />

        <View style={[styles.hero, { height: heroHeight }]}>
          <AuthHeroSlideshow />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.45)', colors.bg]}
            locations={[0.45, 0.82, 1]}
            style={styles.heroFade}
          />
          <AuthHeroLogo
            compact={formExpanded}
            source={heroLogoSource}
            height={heroLogoHeight}
          />
        </View>

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              formExpanded && styles.scrollExpanded,
              {
                paddingTop: formExpanded ? 16 : 12,
                paddingBottom: insets.bottom + 24,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.form,
                formExpanded && styles.formExpanded,
                formExpanded && {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </AuthScreenLayoutContext.Provider>
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
    marginTop: 4,
  },
  scroll: {
    flexGrow: 1,
  },
  scrollExpanded: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  form: {
    paddingHorizontal: 28,
  },
  formExpanded: {
    marginHorizontal: 12,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
