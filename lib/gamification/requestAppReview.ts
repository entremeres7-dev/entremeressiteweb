import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';

/** URLs stores — à compléter quand l’app est publiée */
const IOS_STORE_URL = 'https://apps.apple.com/app/id0000000000';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.entremeres.app';

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
}

function isDevBuild(): boolean {
  return __DEV__ && isExpoGo();
}

async function openStoreListing(): Promise<boolean> {
  const url = Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL;
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Demande d’avis native (build App Store / Play Store uniquement).
 * Dans Expo Go, affiche un message explicatif — pas de popup liée à « Expo Go ».
 */
export async function requestAppReview(): Promise<'review_requested' | 'expo_go' | 'unavailable' | 'cancelled'> {
  if (isExpoGo()) {
    Alert.alert(
      'Avis — mode développement',
      'Avec Expo Go, la fenêtre d’avis ne peut pas s’ouvrir pour EntreMeres (c’est normal : le système associe les avis à l’app installée depuis l’App Store ou le Play Store).\n\nUne fois l’app EntreMeres installée depuis le store, ce bouton ouvrira l’avis in-app.',
      [{ text: 'Compris' }],
    );
    return 'expo_go';
  }

  const available = await StoreReview.isAvailableAsync();
  if (!available) {
    if (isDevBuild()) {
      Alert.alert(
        'Avis indisponible',
        'Sur cet environnement de test, utilisez la version publiée EntreMeres pour noter l’application.',
      );
      return 'unavailable';
    }

    const opened = await openStoreListing();
    if (opened) return 'review_requested';

    Alert.alert(
      'Avis',
      'Les avis ne sont pas disponibles sur cet appareil pour le moment. Merci pour votre soutien 💗',
    );
    return 'unavailable';
  }

  await StoreReview.requestReview();
  return 'review_requested';
}
