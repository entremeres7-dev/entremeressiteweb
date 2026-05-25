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
import { isUsernameTakenByOther } from '@/lib/profile/resolveUsername';
import type { AppColors } from '@/constants/themes';
import { useTheme } from '@/context/ThemeContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useAuthScreenLayout } from '@/components/auth/authScreenLayoutContext';

type Props = {
  onSuccess?: () => void;
  onGoLogin?: () => void;
};

export function SignupForm({ onSuccess, onGoLogin }: Props) {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const { formExpanded, setFormExpanded } = useAuthScreenLayout();
  const styles = useThemedStyles((c) => buildStyles(c, formExpanded));
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [username, setUsername] = useState('');
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

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || password.length < 6) {
      Alert.alert('Erreur', 'Pseudo, email et mot de passe (6 caractères min.) requis.');
      return;
    }
    setLoading(true);
    try {
      const taken = await isUsernameTakenByOther(username);
      if (taken) {
        setLoading(false);
        Alert.alert(
          'Pseudo déjà utilisé',
          'Ce pseudo est déjà pris. Choisissez-en un autre (ex. Marie34, Julie_maman).',
        );
        return;
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Vérification du pseudo impossible.');
      return;
    }

    const { error, signedIn } = await signUp(email, password, username);
    setLoading(false);
    if (error) {
      Alert.alert('Inscription impossible', error);
      return;
    }
    if (signedIn) {
      onSuccess?.();
      return;
    }
    Alert.alert('Compte créé', 'Connectez-vous avec votre email et mot de passe.', [
      { text: 'OK', onPress: () => onGoLogin?.() },
    ]);
  };

  return (
    <View>
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Rejoignez la communauté EntreMeres</Text>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        placeholderTextColor={colors.textMuted}
        value={username}
        onChangeText={setUsername}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        autoCapitalize="none"
      />
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
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.onPink} />
        ) : (
          <Text style={styles.btnText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onGoLogin}>
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

function buildStyles(c: AppColors, expanded: boolean) {
  return StyleSheet.create({
    title: {
      color: c.text,
      fontSize: expanded ? 24 : 22,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      color: c.textMuted,
      fontSize: expanded ? 16 : 15,
      marginBottom: expanded ? 28 : 24,
      marginTop: 6,
      textAlign: 'center',
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
