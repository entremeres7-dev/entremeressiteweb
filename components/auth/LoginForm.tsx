import React, { useState } from 'react';
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

type Props = {
  onSuccess?: () => void;
  onGoSignup?: () => void;
};

export function LoginForm({ onSuccess, onGoSignup }: Props) {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(buildStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      <Text style={styles.tagline}>
        Une communauté de mamans.{'\n'}
        <Text style={styles.taglineAccent}>Du soutien. Des rencontres.</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
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

function buildStyles(c: AppColors) {
  return StyleSheet.create({
    tagline: {
      color: c.text,
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 28,
      lineHeight: 30,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    taglineAccent: {
      color: c.pink,
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 30,
    },
    input: {
      backgroundColor: c.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: c.text,
      fontSize: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    btn: {
      backgroundColor: c.pink,
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    btnText: { color: c.onPink, fontSize: 17, fontWeight: '700' },
    linkBtn: { alignItems: 'center', marginTop: 20 },
    linkText: { color: c.pink, fontSize: 15, fontWeight: '600' },
  });
}
