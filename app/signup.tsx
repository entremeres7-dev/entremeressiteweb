import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <AuthScreenLayout>
      <SignupForm
        onSuccess={() => router.replace('/')}
        onGoLogin={() => router.replace('/login')}
      />
    </AuthScreenLayout>
  );
}
