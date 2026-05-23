import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthScreenLayout>
      <LoginForm
        onSuccess={() => router.replace('/(tabs)/accueil')}
        onGoSignup={() => router.push('/signup')}
      />
    </AuthScreenLayout>
  );
}
