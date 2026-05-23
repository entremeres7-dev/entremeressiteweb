import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';
import { registerPushDevice, deactivatePushDevice } from '@/lib/push/registerPushDevice';
import { ensureUserProfile } from '@/lib/profile/ensureUserProfile';
import { requestShowAuthPhase } from '@/lib/onboarding/onboardingPhase';

export type UserProfile = {
  id: string;
  username: string | null;
  photo: string | null;
  email: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<{ error: string | null; signedIn: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, photo, email')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    try {
      await ensureUserProfile(userId);
    } catch {
      // profil peut quand même exister
    }
    const p = await fetchProfile(userId);
    setProfile(p);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
        registerPushDevice(data.session.user.id).catch(() => {});
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
        registerPushDevice(nextSession.user.id).catch(() => {});
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { username: trimmedUsername } },
    });

    if (error) return { error: error.message, signedIn: false };

    const userId = data.session?.user?.id ?? data.user?.id;

    if (!userId) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        const msg = signInError.message.toLowerCase();
        if (msg.includes('confirm') || msg.includes('vérifi') || msg.includes('verif')) {
          return {
            error:
              'La confirmation par email est encore active sur Supabase. Désactivez-la dans Authentication → Providers → Email.',
            signedIn: false,
          };
        }
        return { error: signInError.message, signedIn: false };
      }

      const uid = signInData.session?.user?.id ?? signInData.user?.id;
      if (uid) {
        await ensureUserProfile(uid);
        await loadProfile(uid);
      }
      return { error: null, signedIn: true };
    }

    await ensureUserProfile(userId);
    await loadProfile(userId);
    return { error: null, signedIn: true };
  };

  const signOut = async () => {
    const uid = session?.user?.id;
    if (uid) await deactivatePushDevice(uid).catch(() => {});
    await supabase.auth.signOut();
    setProfile(null);
    requestShowAuthPhase();
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile: async () => {
        const { data } = await supabase.auth.getSession();
        const uid = data.session?.user?.id ?? session?.user?.id;
        if (uid) await loadProfile(uid);
      },
    }),
    [session, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
