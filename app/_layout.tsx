import 'react-native-get-random-values';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBarVisibilityProvider } from '@/context/TabBarVisibilityContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeStatusBar } from '@/components/ThemeStatusBar';
import { ActionSheetHost } from '@/components/ui/ActionSheetHost';
import { TvAvailabilityModalHost } from '@/components/tv/TvAvailabilityModalHost';
import { IntroVideoGate } from '@/components/intro/IntroVideoGate';
import { PushNotificationHandler } from '@/components/push/PushNotificationHandler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <TabBarVisibilityProvider>
              <IntroVideoGate>
              <PushNotificationHandler />
              <ThemeStatusBar />
              <ActionSheetHost />
              <TvAvailabilityModalHost />
              <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="chat/[peerId]" options={{ presentation: 'modal' }} />
              <Stack.Screen name="parametres" />
              <Stack.Screen name="aide-contact" />
              <Stack.Screen name="cgu" />
              <Stack.Screen name="mes-mamans" />
              <Stack.Screen name="sos-maman/[postId]" />
              <Stack.Screen
                name="tv/watch"
                options={{ presentation: 'fullScreenModal', animation: 'fade' }}
              />
              </Stack>
              </IntroVideoGate>
            </TabBarVisibilityProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
