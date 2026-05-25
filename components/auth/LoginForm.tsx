import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { AuthTagline } from '@/components/auth/AuthTagline';
import { useAuthScreenLayout } from '@/components/auth/authScreenLayoutContext';

type Props = {
  onSuccess?: () => void;
  onGoSignup?: () => void;
};

export function LoginForm({ onSuccess, onGoSignup }: Props) {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { formExpanded, setFormExpanded } = useAuthScreenLayout();
  const styles = useThemedStyles((c) => buildStyles(c, formExpanded));
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      setFormExpanded(false);
    };
  }, [setFormExpanded]);

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setFormExpanded(true);
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setFormExpanded(false);
    }, 120);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erreur', 'Email et mot de passe requis.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Connexion impossible', error);
      return;
    }
    onSuccess?.();
  };

  return (
    <View>
      <View style={styles.taglineWrap}>
        <AuthTagline compact={formExpanded} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="username"
        importantForAutofill="yes"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        importantForAutofill="yes"
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.onPink} />
        ) : (
          <Text style={styles.btnText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onGoSignup}>
        <Text style={styles.linkText}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

function buildStyles(c: AppColors, expanded: boolean) {
  return StyleSheet.create({
    taglineWrap: {
      marginBottom: expanded ? 20 : 28,
    },
    input: {
      backgroundColor: c.surface,
      borderRadius: expanded ? 16 : 14,
      paddingHorizontal: expanded ? 18 : 16,
      paddingVertical: expanded ? 18 : 14,
      color: c.text,
      fontSize: expanded ? 18 : 16,
      marginBottom: expanded ? 16 : 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    btn: {
      backgroundColor: c.pink,
      borderRadius: 28,
      paddingVertical: expanded ? 18 : 16,
      alignItems: 'center',
      marginTop: expanded ? 12 : 8,
    },
    btnText: { color: c.onPink, fontSize: expanded ? 18 : 17, fontWeight: '700' },
    linkBtn: { alignItems: 'center', marginTop: expanded ? 24 : 20 },
    linkText: { color: c.pink, fontSize: 15, fontWeight: '600' },
  });
}
