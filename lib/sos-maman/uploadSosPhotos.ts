import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '@/supabaseClient';
import { MAX_SOS_POST_PHOTOS } from './pickSosPhotos';

const BUCKET = 'sos-maman-photos';

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
  return 'jpg';
}

async function prepareUri(uri: string): Promise<string> {
  const out = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG },
  );
  return out.uri;
}

export async function uploadSosPostPhotos(userId: string, localUris: string[]): Promise<string[]> {
  const uris = localUris.slice(0, MAX_SOS_POST_PHOTOS);
  if (!uris.length) return [];

  const urls: string[] = [];

  for (let i = 0; i < uris.length; i++) {
    const prepared = await prepareUri(uris[i]);
    const { buffer, mime } = await uriToArrayBuffer(prepared);
    const ext = extFromMime(mime);
    const path = `${userId}/${Date.now()}_${i}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: mime.startsWith('image/') ? mime : 'image/jpeg',
      upsert: false,
    });

    if (error) {
      throw new Error(error.message || 'Échec de l’envoi de la photo.');
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    if (data?.publicUrl) urls.push(data.publicUrl);
  }

  return urls;
}
