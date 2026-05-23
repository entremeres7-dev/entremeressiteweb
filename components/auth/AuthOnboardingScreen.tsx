import React, { useState } from 'react';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

type Props = {
  onAuthenticated: () => void;
};

export function AuthOnboardingScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <AuthScreenLayout>
      {mode === 'login' ? (
        <LoginForm
          onSuccess={onAuthenticated}
          onGoSignup={() => setMode('signup')}
        />
      ) : (
        <SignupForm
          onSuccess={onAuthenticated}
          onGoLogin={() => setMode('login')}
        />
      )}
    </AuthScreenLayout>
  );
}
