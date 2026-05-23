# Audit Tab Bar – Fichiers complets pour revalidation

> Document généré pour l’audit complet de la tab bar.  
> À envoyer au relecteur pour vérification : `pointerEvents`, `zIndex`, overlays, modals.

---

## 1. Layout tabs (`app/(tabs)/_layout.tsx`)

```tsx
import { Tabs } from 'expo-router';
import { useTabBarVisibility } from '../../context/TabBarVisibilityContext';
import { CustomTabBar } from '../../components/CustomTabBar';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'expo-router';
import { View } from 'react-native';

const CameraUIContext = createContext<{
  cameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
}>({
  cameraOpen: false,
  setCameraOpen: () => {},
});

export const useCameraUI = () => {
  const ctx = useContext(CameraUIContext);
  if (!ctx) throw new Error('useCameraUI doit être utilisé dans CameraUIProvider');
  return ctx;
};

function CameraUIProvider({ children }: { children: React.ReactNode }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  return (
    <CameraUIContext.Provider value={{ cameraOpen, setCameraOpen }}>
      {children}
    </CameraUIContext.Provider>
  );
}

function TabsLayout() {
  const pathname = usePathname();
  const { setTabBarHidden } = useTabBarVisibility();

  useEffect(() => {
    setTabBarHidden(false);
  }, [pathname, setTabBarHidden]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
      <Tabs.Screen name="salon" options={{ title: 'Salon' }} />
      <Tabs.Screen name="rencontrer" options={{ title: 'Rencontres' }} />
      <Tabs.Screen name="quotidien" options={{ title: 'Quotidien' }} />
      <Tabs.Screen name="profil" options={{ title: 'Mon profil' }} />
      {/* Onglets cachés (compatibilité routes) */}
        <Tabs.Screen name="messages" options={{ href: null }} />
        <Tabs.Screen name="feed" options={{ href: null }} />
        <Tabs.Screen name="cuisine" options={{ href: null }} />
        <Tabs.Screen name="vente" options={{ href: null }} />
      </Tabs>
      <CustomTabBar />
    </View>
  );
}

export default function TabLayout() {
  return (
    <CameraUIProvider>
      <TabsLayout />
    </CameraUIProvider>
  );
}
```

---

## 2. CustomTabBar.tsx

```tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarVisibility } from '../context/TabBarVisibilityContext';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TAB_CONFIG: Record<
  string,
  { label: string; href: string; icon: (focused: boolean) => React.ReactNode }
> = {
  salon: {
    label: 'Salon',
    href: '/(tabs)/salon',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'heart' : 'heart-outline'}
        size={24}
        color={focused ? '#F27BA3' : '#B8A4B0'}
      />
    ),
  },
  rencontrer: {
    label: 'Rencontres',
    href: '/(tabs)/rencontrer',
    icon: (focused) => (
      <MaterialCommunityIcons
        name={focused ? 'account-heart' : 'account-heart-outline'}
        size={24}
        color={focused ? '#F27BA3' : '#B8A4B0'}
      />
    ),
  },
  quotidien: {
    label: 'Quotidien',
    href: '/(tabs)/quotidien',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'sunny' : 'sunny-outline'}
        size={24}
        color={focused ? '#F27BA3' : '#B8A4B0'}
      />
    ),
  },
  profil: {
    label: 'Mon profil',
    href: '/(tabs)/profil',
    icon: (focused) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={24}
        color={focused ? '#F27BA3' : '#B8A4B0'}
      />
    ),
  },
};

const VISIBLE_TABS = ['salon', 'rencontrer', 'quotidien', 'profil'];

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { tabBarHidden } = useTabBarVisibility();
  const bottomInset = Math.max(insets.bottom + 8, 16);

  if (tabBarHidden) return null;

  return (
    <View style={[styles.container, { bottom: bottomInset }]} pointerEvents="box-none">
      {VISIBLE_TABS.map((tabName) => {
        const config = TAB_CONFIG[tabName];
        if (!config) return null;
        const isFocused =
          pathname === config.href ||
          pathname === `/${tabName}` ||
          pathname.endsWith(`/${tabName}`);

        const onPress = () => {
          if (!isFocused) {
            router.replace(config.href as any);
          }
        };

        return (
          <TouchableOpacity
            key={tabName}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={config.label}
          >
            {config.icon(isFocused)}
            <Text
              style={[
                styles.label,
                isFocused ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    zIndex: 9999,
    ...(Platform.OS === 'ios' && {
      shadowOpacity: 0.12,
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  labelActive: {
    color: '#F27BA3',
  },
  labelInactive: {
    color: '#B8A4B0',
  },
});
```

---

## 3. TabBarVisibilityContext.tsx

```tsx
import React, { createContext, useContext, useState } from 'react';

interface TabBarVisibilityContextType {
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
}

// Valeur par défaut pour éviter undefined
const defaultTabBarVisibilityValue: TabBarVisibilityContextType = {
  tabBarHidden: false,
  setTabBarHidden: () => {},
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType>(defaultTabBarVisibilityValue);

export const TabBarVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabBarHidden, setTabBarHidden] = useState(false);

  return (
    <TabBarVisibilityContext.Provider value={{ tabBarHidden, setTabBarHidden }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = (): TabBarVisibilityContextType => {
  try {
    const context = useContext(TabBarVisibilityContext);
    if (!context) {
      console.warn('⚠️ useTabBarVisibility: contexte non disponible, utilisation des valeurs par défaut');
      return defaultTabBarVisibilityValue;
    }
    return context;
  } catch (error) {
    console.warn('⚠️ Erreur dans useTabBarVisibility, utilisation des valeurs par défaut:', error);
    return defaultTabBarVisibilityValue;
  }
};
```

---

## 4. Layout global (`app/_layout.tsx`)

> Le wrapper global est dans `app/_layout.tsx`.  
> Le provider `TabBarVisibilityProvider` entoure toute l’app (AuthProvider, ThemeProvider, etc.).

**Extrait pertinent :**
```tsx
<TabBarVisibilityProvider>
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <ToastProvider>
      <AuthErrorHandler>
        <AuthNavigator />
        ...
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ...
        </Stack>
```

---

## 5. Composants fullscreen / overlay utilisés

### Salon
- **Emoji picker** : `Modal visible` (quand `showEmojiPicker`) — fermeture via `onRequestClose` et `TouchableOpacity` backdrop
- **Menu rapide EntreMeres** : `Modal visible` (quand `showTopRightQuickNavModal`)
- **Image fullscreen** : `Modal visible` (quand `expandedImageUrl`)
- **Vidéo fullscreen** : `Modal visible` (quand `activeVideoModal`)
- **ReportContent** : composant `visible={showReportModal}`

### Quotidien
- **Menu tabs rapide** : `Modal visible` (quand `showTabsQuickMenu`)
- **Menu contextuel** (supprimer/signaler) : `Modal visible` (quand `menuVisible`)
- **Picker emojis** : `Modal visible` (quand `showReactionPicker`) avec `pointerEvents="box-none"` sur le container
- **Quick post modal** : `Modal visible` (quand `showQuickPostModal`)

### Rencontrer
- **Menu rapide EntreMeres** : `Modal visible` (quand `showTopRightQuickNavModal`)

### Profil
- Nombreux modals : edit, settings, language, badges, missions, instagram stories, logout, etc.

---

## 6. Points de vérification pour l’audit

| Point | Statut |
|-------|--------|
| `CustomTabBar` avec `zIndex: 9999` | ✅ |
| `CustomTabBar` avec `pointerEvents="box-none"` | ✅ |
| `LinearGradient` avec `pointerEvents="none"` (quotidien, rencontrer) | ✅ |
| Modals conditionnels : `{condition && <Modal visible ... />}` | ✅ (ne rendent pas quand fermés) |
| `paddingBottom` sur scrolls (120) | ✅ |
| Tab bar dans le layout : même `View` que `Tabs`, après le dernier `Tabs.Screen` | ✅ |

---

## 7. Comment envoyer salon.tsx et profil.tsx (code complet)

Le relecteur demande **le code complet** de ces deux fichiers (composants fullscreen les plus susceptibles d'être en cause).

**Option A – Copier-coller :** Ouvre `app/(tabs)/salon.tsx`, Ctrl+A, Ctrl+C, colle dans ton message avec en tête `salon.tsx`. Idem pour `app/(tabs)/profil.tsx`.

**Option B – Partage :** Envoie les fichiers en pièce jointe ou un lien / ZIP du repo.

**Composants fullscreen à vérifier en priorité :**
- *salon* : Modal emoji picker, menu rapide, image/vidéo fullscreen, **overlay d'enregistrement vocal** (`isRecording`, `zIndex: 1000`), InstagramStoriesManager, ReportContent
- *profil* : tous les modals (edit, settings, language, badges, missions, stories, logout, etc.)

---

*Document généré pour l’audit tab bar.*
