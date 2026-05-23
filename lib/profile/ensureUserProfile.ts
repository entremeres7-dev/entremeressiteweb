import { supabase } from '@/supabaseClient';
import { resolveAvailableUsername } from '@/lib/profile/resolveUsername';

function usernameFromAuth(meta: Record<string, unknown> | undefined): string {
  const raw = meta?.username;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  return 'Maman';
}

function isDuplicateUsernameError(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes('duplicate key') && m.includes('username');
}

/** Garantit une ligne profiles avec pseudo + email (inscription / connexion). */
export async function ensureUserProfile(userId: string): Promise<void> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return;

  const user = authData.user;
  const desiredUsername = usernameFromAuth(user.user_metadata as Record<string, unknown>);
  const email = user.email ?? null;

  const { data: existing, error: readError } = await supabase
    .from('profiles')
    .select('id, username, email')
    .eq('id', userId)
    .maybeSingle();

  if (readError) throw new Error(readError.message);

  if (existing) {
    const patch: Record<string, string | null> = {};
    if (!existing.username?.trim()) {
      patch.username = await resolveAvailableUsername(desiredUsername, userId);
    }
    if (!existing.email?.trim() && email) patch.email = email;

    if (Object.keys(patch).length === 0) return;

    const { error: patchError } = await supabase.from('profiles').update(patch).eq('id', userId);
    if (patchError) throw new Error(patchError.message);
    return;
  }

  const username = await resolveAvailableUsername(desiredUsername, userId);

  const { error: insertError } = await supabase.from('profiles').insert({
    id: userId,
    username,
    email,
  });

  if (!insertError) return;

  if (isDuplicateUsernameError(insertError.message)) {
    const fallback = await resolveAvailableUsername(`${desiredUsername}_${userId.slice(0, 6)}`, userId);
    const { error: retryError } = await supabase.from('profiles').insert({
      id: userId,
      username: fallback,
      email,
    });
    if (retryError) throw new Error(retryError.message);
    return;
  }

  throw new Error(insertError.message);
}
