import React from 'react';
import { Tabs } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { CustomTabBar } from '@/components/CustomTabBar';
import { WebTopNav } from '@/components/WebTopNav';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.pink} />
      </View>
    );
  }

  if (!session) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? <WebTopNav /> : null}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="accueil" options={{ title: 'TV' }} />
        <Tabs.Screen name="sos-maman" options={{ title: 'SOS Maman' }} />
        <Tabs.Screen name="rencontrer" options={{ title: 'Rencontres' }} />
        <Tabs.Screen name="messages" options={{ href: null, title: 'Messages' }} />
        <Tabs.Screen name="ma-liste" options={{ title: 'Ma liste' }} />
        <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
        {/* Routes legacy — redirections */}
        <Tabs.Screen name="explorer" options={{ href: null }} />
        <Tabs.Screen name="salon" options={{ href: null }} />
        <Tabs.Screen name="tv" options={{ href: null }} />
        <Tabs.Screen name="quotidien" options={{ href: null }} />
        <Tabs.Screen name="feed" options={{ href: null }} />
      </Tabs>
      <CustomTabBar />
    </View>
  );
}
