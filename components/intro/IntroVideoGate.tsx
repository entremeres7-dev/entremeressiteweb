import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { CguAcceptanceScreen } from '@/components/legal/CguAcceptanceScreen';
import { CommunityCharterAcceptanceScreen } from '@/components/legal/CommunityCharterAcceptanceScreen';
import { ProfileSetupScreen } from '@/components/onboarding/ProfileSetupScreen';
import { SignupWelcomeScreen } from '@/components/onboarding/SignupWelcomeScreen';
import { isCurrentUserProfileComplete } from '@/lib/profile/profileSetupService';
import { clearSignupWelcomePending, shouldShowSignupWelcome } from '@/lib/onboarding/signupWelcome';
import { hasAcceptedCgu, markCguAccepted } from '@/lib/legal/cguStorage';
import {
  hasAcceptedCommunityCharter,
  markCommunityCharterAccepted,
} from '@/lib/legal/communityCharterStorage';
import { setShowAuthHandler } from '@/lib/onboarding/onboardingPhase';
import { redirectToLogin } from '@/lib/auth/redirectToLogin';
import { redirectToWebsiteLogin } from '@/lib/web/websiteAuth';

function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup';
}

type Phase = 'loading' | 'cgu' | 'auth' | 'welcome' | 'profile' | 'charter' | 'ready';

async function phaseWhenLoggedIn(): Promise<'welcome' | 'profile' | 'charter' | 'ready'> {
  const profileComplete = await isCurrentUserProfileComplete();
  if (!profileComplete) return 'profile';

  const charterAccepted = await hasAcceptedCommunityCharter();
  if (!charterAccepted) return 'charter';

  if (await shouldShowSignupWelcome()) return 'welcome';

  return 'ready';
}

async function phaseOnLaunch(session: boolean): Promise<Phase> {
  const accepted = await hasAcceptedCgu();
  if (!accepted) return 'cgu';
  if (!session) return 'auth';
  return phaseWhenLoggedIn();
}

type Props = {
  children: React.ReactNode;
};

export function IntroVideoGate({ children }: Props) {
  const { colors } = useTheme();
  const { session, loading: authLoading, refreshProfile } = useAuth();
  const pathname = usePathname();
  const onAuthRoute = isAuthRoute(pathname);
  const [phase, setPhase] = useState<Phase>('loading');
  const [loaderMessage, setLoaderMessage] = useState<string | null>(null);

  const activePhase: Phase =
    authLoading ? 'loading' : !session ? (phase === 'cgu' ? 'cgu' : 'auth') : phase;

  const onboardingModalVisible =
    activePhase === 'welcome' || activePhase === 'profile' || activePhase === 'charter';

  const resolveInitialPhase = useCallback(async () => {
    try {
      const next = await phaseOnLaunch(!!session);
      setPhase(next);
    } catch {
      setPhase(session ? 'ready' : 'auth');
    }
  }, [session]);

  useEffect(() => {
    if (authLoading) return;
    resolveInitialPhase();
  }, [authLoading, resolveInitialPhase]);

  useEffect(() => {
    if (authLoading || session || onAuthRoute) return;
    if (activePhase === 'auth') {
      if (Platform.OS === 'web') {
        redirectToWebsiteLogin();
      } else {
        redirectToLogin();
      }
    }
  }, [authLoading, session, activePhase, onAuthRoute]);

  useEffect(() => {
    if (authLoading) return;
    setShowAuthHandler(() => {
      redirectToLogin();
    });
    return () => setShowAuthHandler(null);
  }, [authLoading]);

  useEffect(() => {
    if (authLoading || !session) return;
    let cancelled = false;
    phaseWhenLoggedIn()
      .then((next) => {
        if (!cancelled) setPhase(next);
      })
      .catch(() => {
        if (!cancelled) setPhase('ready');
      });
    return () => {
      cancelled = true;
    };
  }, [session, authLoading]);

  useEffect(() => {
    if (authLoading || !session) {
      setLoaderMessage(null);
      return;
    }
    if (onboardingModalVisible || activePhase === 'ready') {
      setLoaderMessage(null);
      return;
    }
    let cancelled = false;
    shouldShowSignupWelcome().then((pending) => {
      if (cancelled) return;
      setLoaderMessage(
        pending ? 'Préparation de votre accueil…' : 'Un instant…',
      );
    });
    return () => {
      cancelled = true;
    };
  }, [session, authLoading, activePhase, onboardingModalVisible]);

  useEffect(() => {
    if (authLoading || session) return;
    if (phase === 'ready' || phase === 'profile' || phase === 'charter' || phase === 'welcome') {
      setPhase('auth');
    }
  }, [session, authLoading, phase]);

  useEffect(() => {
    if (!session || activePhase !== 'ready') return;
    if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
      router.replace('/(tabs)/accueil');
    }
  }, [session, activePhase, pathname]);

  const finishCgu = useCallback(async () => {
    await markCguAccepted();
    if (!session) {
      setPhase('auth');
      return;
    }
    try {
      setPhase(await phaseWhenLoggedIn());
    } catch {
      setPhase('ready');
    }
  }, [session]);

  const finishWelcome = useCallback(async () => {
    await clearSignupWelcomePending();
    setPhase('ready');
  }, []);

  const finishProfile = useCallback(async () => {
    await refreshProfile();
    try {
      setPhase(await phaseWhenLoggedIn());
    } catch {
      setPhase('charter');
    }
  }, [refreshProfile]);

  const finishCharter = useCallback(async () => {
    await markCommunityCharterAccepted();
    if (await shouldShowSignupWelcome()) {
      setPhase('welcome');
    } else {
      setPhase('ready');
    }
  }, []);

  const showAuthScreen = !session && onAuthRoute;
  const showChildren = !!session || showAuthScreen;
  const awaitingLoginRedirect = !session && activePhase === 'auth' && !onAuthRoute;
  const showBootLoader =
    authLoading ||
    activePhase === 'loading' ||
    (session && !onboardingModalVisible && activePhase !== 'ready') ||
    awaitingLoginRedirect;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {showChildren ? children : null}

      <Modal visible={activePhase === 'cgu'} animationType="slide" presentationStyle="fullScreen">
        <CguAcceptanceScreen colors={colors} onAccept={finishCgu} />
      </Modal>

      <Modal visible={activePhase === 'profile'} animationType="slide" presentationStyle="fullScreen">
        <ProfileSetupScreen onComplete={finishProfile} />
      </Modal>

      <Modal visible={activePhase === 'charter'} animationType="slide" presentationStyle="fullScreen">
        <CommunityCharterAcceptanceScreen colors={colors} onAccept={finishCharter} />
      </Modal>

      <Modal visible={activePhase === 'welcome'} animationType="fade" presentationStyle="fullScreen">
        <SignupWelcomeScreen onContinue={finishWelcome} />
      </Modal>

      {showBootLoader ? (
        <View style={[styles.loaderOverlay, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.pink} />
          {loaderMessage ? (
            <Text style={[styles.loaderText, { color: colors.textMuted }]}>{loaderMessage}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
});
