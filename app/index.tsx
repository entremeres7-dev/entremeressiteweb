import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useMemo } from 'react';

export default function Index() {
  const { session, loading } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        loader: {
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [colors],
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.pink} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/accueil" />;
}
