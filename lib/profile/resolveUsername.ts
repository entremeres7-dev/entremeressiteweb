import { supabase } from '@/supabaseClient';

function normalizeBase(raw: string): string {
  const cleaned = raw.trim().replace(/\s+/g, '_').slice(0, 24);
  return cleaned || 'Maman';
}

async function isUsernameFree(name: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', name)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return true;
  return data.id === userId;
}

/** Pseudo unique en base (contrainte profiles_username_key). */
export async function resolveAvailableUsername(desired: string, userId: string): Promise<string> {
  const base = normalizeBase(desired);

  if (await isUsernameFree(base, userId)) return base;

  const shortId = userId.replace(/-/g, '').slice(0, 6);
  const withId = `${base}_${shortId}`;
  if (await isUsernameFree(withId, userId)) return withId;

  for (let n = 2; n < 100; n++) {
    const candidate = `${base}${n}`;
    if (await isUsernameFree(candidate, userId)) return candidate;
  }

  return `maman_${shortId}`;
}

export async function isUsernameTakenByOther(
  username: string,
  userId?: string,
): Promise<boolean> {
  const name = normalizeBase(username);
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', name)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return false;
  if (userId && data.id === userId) return false;
  return true;
}
