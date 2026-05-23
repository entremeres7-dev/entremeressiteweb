import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppColors } from '@/constants/themes';
import { isLightTheme } from '@/constants/themeUtils';
import {
  CHILDREN_OPTIONS,
  MAX_MOM_AGE,
  MIN_MOM_AGE,
  PROFILE_COUNTRIES,
} from '@/constants/profileSetup';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { pickProfilePhoto } from '@/lib/profile/pickProfilePhoto';
import { ensureUserProfile } from '@/lib/profile/ensureUserProfile';
import { saveProfileSetup } from '@/lib/profile/profileSetupService';
import { RegionSelectField } from '@/components/onboarding/RegionSelectField';

type Props = {
  onComplete: () => void;
};

export function ProfileSetupScreen({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const styles = createStyles(colors);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [country, setCountry] = useState<string>('France');
  const [region, setRegion] = useState<string | null>(null);
  const [ageText, setAgeText] = useState('');
  const [children, setChildren] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const displayUsername = useMemo(() => {
    if (profile?.username?.trim()) return profile.username.trim();
    const meta = user?.user_metadata?.username;
    if (typeof meta === 'string' && meta.trim()) return meta.trim();
    return 'Maman';
  }, [profile?.username, user?.user_metadata?.username]);

  useEffect(() => {
    if (!user?.id) return;
    ensureUserProfile(user.id)
      .then(() => refreshProfile())
      .catch(() => {});
  }, [user?.id, refreshProfile]);

  const pickPhoto = async () => {
    try {
      const uri = await pickProfilePhoto();
      if (uri) setPhotoUri(uri);
    } catch (e) {
      Alert.alert('Photo', e instanceof Error ? e.message : 'Impossible de choisir une photo.');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Erreur', 'Session expirée. Reconnectez-vous.');
      return;
    }
    if (!photoUri) {
      Alert.alert('Photo requise', 'Ajoutez une photo pour continuer.');
      return;
    }
    if (!country) {
      Alert.alert('Pays', 'Sélectionnez votre pays.');
      return;
    }
    if (!region) {
      Alert.alert('Région', 'Sélectionnez votre région dans la liste.');
      return;
    }
    const age = parseInt(ageText.trim(), 10);
    if (!Number.isFinite(age) || age < MIN_MOM_AGE || age > MAX_MOM_AGE) {
      Alert.alert('Âge', `Indiquez un âge entre ${MIN_MOM_AGE} et ${MAX_MOM_AGE} ans.`);
      return;
    }
    if (!children) {
      Alert.alert('Enfants', 'Indiquez le nombre d’enfants.');
      return;
    }

    setLoading(true);
    try {
      await saveProfileSetup(user.id, {
        photoUri,
        country,
        region,
        age,
        children,
      });
      await refreshProfile();
      onComplete();
    } catch (e) {
      Alert.alert('Erreur', e instanceof Error ? e.message : 'Enregistrement impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setRegion(null);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isLightTheme(colors.bg) ? 'dark-content' : 'light-content'} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 28 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Votre profil maman</Text>
        <Text style={styles.pseudo}>@{displayUsername}</Text>
        <Text style={styles.subtitle}>
          Complétez votre profil pour rejoindre la communauté et rencontrer des mamans près de chez vous.
        </Text>

        <Text style={styles.label}>Photo *</Text>
        <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto} activeOpacity={0.85}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={36} color={colors.pink} />
              <Text style={styles.photoHint}>Ajouter une photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Pays *</Text>
        <View style={styles.chipRow}>
          {PROFILE_COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, country === c && styles.chipOn]}
              onPress={() => handleCountryChange(c)}
            >
              <Text style={[styles.chipText, country === c && styles.chipTextOn]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <RegionSelectField
          key={country}
          colors={colors}
          country={country}
          value={region}
          onChange={setRegion}
        />

        <Text style={styles.label}>Votre âge *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. 32"
          placeholderTextColor={colors.textMuted}
          value={ageText}
          onChangeText={setAgeText}
          keyboardType="number-pad"
          maxLength={2}
        />

        <Text style={styles.label}>Nombre d’enfants *</Text>
        <View style={styles.chipRow}>
          {CHILDREN_OPTIONS.map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.chip, styles.chipCompact, children === n && styles.chipOn]}
              onPress={() => setChildren(n)}
            >
              <Text style={[styles.chipText, children === n && styles.chipTextOn]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submit, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPink} />
          ) : (
            <Text style={styles.submitText}>C’est parti</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    scroll: { paddingHorizontal: 24, paddingTop: 16 },
    title: {
      color: c.text,
      fontSize: 26,
      fontWeight: '800',
      marginBottom: 4,
    },
    pseudo: {
      color: c.pink,
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      color: c.textMuted,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 24,
    },
    label: {
      color: c.text,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 10,
      marginTop: 8,
    },
    photoBtn: {
      alignSelf: 'center',
      marginBottom: 8,
    },
    photo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: c.pink,
    },
    photoPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: c.card,
      borderWidth: 2,
      borderColor: c.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    photoHint: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipCompact: {
      minWidth: 52,
      alignItems: 'center',
    },
    chipOn: {
      backgroundColor: c.pink,
      borderColor: c.pink,
    },
    chipText: {
      color: c.text,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextOn: {
      color: c.onPink,
    },
    input: {
      backgroundColor: c.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: c.text,
      fontSize: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    submit: {
      backgroundColor: c.pink,
      borderRadius: 28,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 28,
    },
    submitDisabled: { opacity: 0.6 },
    submitText: {
      color: c.onPink,
      fontSize: 17,
      fontWeight: '700',
    },
  });
}
