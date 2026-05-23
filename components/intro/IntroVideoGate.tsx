import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { AuthOnboardingScreen } from '@/components/auth/AuthOnboardingScreen';
import { CguAcceptanceScreen } from '@/components/legal/CguAcceptanceScreen';
import { CommunityCharterAcceptanceScreen } from '@/components/legal/CommunityCharterAcceptanceScreen';
import { ProfileSetupScreen } from '@/components/onboarding/ProfileSetupScreen';
import { isCurrentUserProfileComplete } from '@/lib/profile/profileSetupService';
import { hasAcceptedCgu, markCguAccepted } from '@/lib/legal/cguStorage';
import {
  hasAcceptedCommunityCharter,
  markCommunityCharterAccepted,
} from '@/lib/legal/communityCharterStorage';
import { setShowAuthHandler } from '@/lib/onboarding/onboardingPhase';
import { redirectToWebsiteLogin } from '@/lib/web/websiteAuth';

type Phase = 'loading' | 'cgu' | 'auth' | 'profile' | 'charter' | 'ready';

async function phaseWhenLoggedIn(): Promise<'profile' | 'charter' | 'ready'> {
  const profileComplete = await isCurrentUserProfileComplete();
  if (!profileComplete) return 'profile';

  const charterAccepted = await hasAcceptedCommunityCharter();
  if (!charterAccepted) return 'charter';

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
  const [phase, setPhase] = useState<Phase>('loading');

  const resolveInitialPhase = useCallback(async () => {
    const next = await phaseOnLaunch(!!session);
    setPhase(next);
  }, [session]);

  useEffect(() => {
    if (authLoading) return;
    resolveInitialPhase();
  }, [authLoading, resolveInitialPhase]);

  useEffect(() => {
    if (authLoading) return;
    if (Platform.OS === 'web' && !session && phase === 'auth') {
      redirectToWebsiteLogin();
    }
  }, [authLoading, session, phase]);

  useEffect(() => {
    if (authLoading) return;
    setShowAuthHandler(() => {
      if (Platform.OS === 'web') {
        redirectToWebsiteLogin();
        return;
      }
      setPhase('auth');
    });
    return () => setShowAuthHandler(null);
  }, [authLoading]);

  useEffect(() => {
    if (authLoading) return;
    if (session && phase === 'auth') {
      phaseWhenLoggedIn().then(setPhase);
    }
  }, [session, authLoading, phase]);

  useEffect(() => {
    if (authLoading || session) return;
    if (phase === 'ready' || phase === 'profile' || phase === 'charter') {
      setPhase('auth');
    }
  }, [session, authLoading, phase]);

  const finishCgu = useCallback(async () => {
    await markCguAccepted();
    if (!session) {
      if (Platform.OS === 'web') {
        redirectToWebsiteLogin();
        return;
      }
      setPhase('auth');
      return;
    }
    setPhase(await phaseWhenLoggedIn());
  }, [session]);

  const enterApp = useCallback(async () => {
    setPhase(await phaseWhenLoggedIn());
  }, []);

  const finishProfile = useCallback(async () => {
    await refreshProfile();
    const charterAccepted = await hasAcceptedCommunityCharter();
    setPhase(charterAccepted ? 'ready' : 'charter');
  }, [refreshProfile]);

  const finishCharter = useCallback(async () => {
    await markCommunityCharterAccepted();
    setPhase('ready');
  }, []);

  return (
    <>
      <View style={[styles.backdrop, { backgroundColor: colors.bg }]} />
      {phase === 'ready' && session ? children : null}

      <Modal visible={phase === 'cgu'} animationType="slide" presentationStyle="fullScreen">
        <CguAcceptanceScreen colors={colors} onAccept={finishCgu} />
      </Modal>

      <Modal visible={phase === 'auth'} animationType="slide" presentationStyle="fullScreen">
        <AuthOnboardingScreen onAuthenticated={enterApp} />
      </Modal>

      <Modal visible={phase === 'profile'} animationType="slide" presentationStyle="fullScreen">
        <ProfileSetupScreen onComplete={finishProfile} />
      </Modal>

      <Modal visible={phase === 'charter'} animationType="slide" presentationStyle="fullScreen">
        <CommunityCharterAcceptanceScreen colors={colors} onAccept={finishCharter} />
      </Modal>

      {phase === 'loading' ? (
        <View style={[styles.loader, { backgroundColor: colors.bg }]} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
  },
});
