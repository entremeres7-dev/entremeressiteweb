import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/supabaseClient';

const BUCKET = 'profiles';

async function uriToArrayBuffer(uri: string): Promise<{ buffer: ArrayBuffer; mime: string }> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error('Impossible de lire la photo.');
  const blob = await response.blob();
  const buffer = await new Response(blob).arrayBuffer();
  return { buffer, mime: blob.type || 'image/jpeg' };
}

function extFromMime(mime: string): string {
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'jpeg';
}

export async function uploadProfilePhoto(userId: string, localUri: string): Promise<string> {
  const manipulated = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 800 } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
  );

  const { buffer, mime } = await uriToArrayBuffer(manipulated.uri);
  const ext = extFromMime(mime);
  const path = `${userId}_quiz_avatar_${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) {
    throw new Error(error.message || 'Échec de l’envoi de la photo.');
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('URL de photo introuvable.');
  return data.publicUrl;
}
