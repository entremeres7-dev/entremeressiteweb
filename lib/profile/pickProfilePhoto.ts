import * as ImagePicker from 'expo-image-picker';
import { Alert, ActionSheetIOS, Platform } from 'react-native';

export async function pickProfilePhoto(): Promise<string | null> {
  const choose = (): Promise<'library' | 'camera' | 'cancel'> =>
    new Promise((resolve) => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Annuler', 'Galerie', 'Appareil photo'],
            cancelButtonIndex: 0,
          },
          (index) => {
            if (index === 1) resolve('library');
            else if (index === 2) resolve('camera');
            else resolve('cancel');
          },
        );
        return;
      }
      Alert.alert('Photo de profil', 'Choisissez une source', [
        { text: 'Annuler', style: 'cancel', onPress: () => resolve('cancel') },
        { text: 'Galerie', onPress: () => resolve('library') },
        { text: 'Appareil photo', onPress: () => resolve('camera') },
      ]);
    });

  const source = await choose();
  if (source === 'cancel') return null;

  if (source === 'library') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Autorisez l’accès à vos photos.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return null;
    return result.assets[0].uri;
  }

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Autorisez l’accès à la caméra.');
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return result.assets[0].uri;
}
