import { supabase } from '@/supabaseClient';

/** Appelle la Edge Function send-push pour prévenir l'auteure d'une confidence. */
export async function pushNotifySosMamanReply(
  postAuthorId: string,
  postId: string,
  replierLabel: string,
): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-push', {
      body: {
        toUserId: postAuthorId,
        title: 'SOS Maman',
        body: `${replierLabel} a répondu à votre confidence`,
        data: {
          type: 'sos_maman_reply',
          postId,
          screen: 'sos-maman',
        },
      },
    });
    if (error) console.warn('[SOS Maman] push:', error.message);
  } catch (e) {
    console.warn('[SOS Maman] push indisponible:', e);
  }
}
