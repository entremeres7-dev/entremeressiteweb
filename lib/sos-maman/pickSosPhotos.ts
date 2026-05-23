import * as ImagePicker from 'expo-image-picker';

export const MAX_SOS_POST_PHOTOS = 4;

export async function pickSosPhotos(remainingSlots: number): Promise<string[]> {
  if (remainingSlots <= 0) return [];

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Autorisez l’accès à vos photos pour publier une image.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: remainingSlots > 1,
    selectionLimit: remainingSlots,
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.length) return [];
  return result.assets.map((a) => a.uri);
}

export async function takeSosPhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Autorisez l’accès à la caméra pour prendre une photo.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return result.assets[0].uri;
}
