import React from 'react';
import { useRouter } from 'expo-router';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { LoginForm } from '@/components/auth/LoginForm';

const LOGIN_LOGO = require('@/assets/images/logo3.png');

export default function LoginScreen() {
  const router = useRouter();

  return (
    <AuthScreenLayout heroLogoSource={LOGIN_LOGO} heroLogoHeight={58}>
      <LoginForm
        onGoSignup={() => router.push('/signup')}
      />
    </AuthScreenLayout>
  );
}
