import { supabase } from '@/supabaseClient';
import { ensureUserProfile } from '@/lib/profile/ensureUserProfile';
import { resolveAvailableUsername } from '@/lib/profile/resolveUsername';
import { uploadProfilePhoto } from '@/lib/profile/uploadProfilePhoto';

export type ProfileSetupRow = {
  photo: string | null;
  country: string | null;
  region: string | null;
  age: number | null;
  children: string | null;
  username: string | null;
};

export type ProfileSetupInput = {
  photoUri: string;
  country: string;
  region: string;
  age: number;
  children: string;
};

export function isProfileSetupComplete(row: ProfileSetupRow | null | undefined): boolean {
  if (!row) return false;
  return !!(
    row.username?.trim() &&
    row.photo?.trim() &&
    row.country?.trim() &&
    row.region?.trim() &&
    row.age != null &&
    row.age >= 16 &&
    row.children?.trim()
  );
}

export async function fetchProfileSetup(userId: string): Promise<ProfileSetupRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('photo, country, region, age, children, username')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as ProfileSetupRow | null) ?? null;
}

export async function isCurrentUserProfileComplete(): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) return false;

  try {
    await ensureUserProfile(userId);
  } catch {
    // continue — on teste quand même la ligne existante
  }

  const row = await fetchProfileSetup(userId);
  return isProfileSetupComplete(row);
}

export async function saveProfileSetup(userId: string, input: ProfileSetupInput): Promise<void> {
  await ensureUserProfile(userId);

  const photoUrl = await uploadProfilePhoto(userId, input.photoUri);

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('Session invalide.');

  const meta = authData.user.user_metadata as { username?: string } | undefined;
  const desired = meta?.username?.trim() || 'Maman';
  const username = await resolveAvailableUsername(desired, userId);
  const email = authData.user.email ?? null;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      username,
      email,
      photo: photoUrl,
      country: input.country.trim(),
      region: input.region.trim(),
      age: input.age,
      children: input.children,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) throw new Error(error.message || 'Impossible d’enregistrer le profil.');
}
