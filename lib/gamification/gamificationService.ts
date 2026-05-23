import { supabase } from '@/supabaseClient';
import {
  GAMIFICATION_POINTS,
  type GamificationAction,
} from './constants';
import { parseCoeurs } from './fetchProfilesCoeurs';
import { computeGamificationProgress, type GamificationProgress } from './computeProgress';

type AwardResult = { awarded: boolean; total: number };

function parseAwardResult(data: unknown): AwardResult {
  if (!data || typeof data !== 'object') return { awarded: false, total: 0 };
  const row = data as { awarded?: boolean; total?: number };
  return {
    awarded: !!row.awarded,
    total: typeof row.total === 'number' ? row.total : 0,
  };
}

export async function awardGamificationPoints(
  userId: string,
  action: GamificationAction,
  referenceId: string,
): Promise<AwardResult> {
  const points = GAMIFICATION_POINTS[action];
  const { data, error } = await supabase.rpc('award_coeurs', {
    p_user_id: userId,
    p_action_type: action,
    p_reference_id: referenceId,
    p_points: points,
  });

  if (error) {
    if (error.message.includes('award_coeurs') || error.message.includes('does not exist')) {
      return { awarded: false, total: 0 };
    }
    throw error;
  }

  return parseAwardResult(data);
}

/** N'interrompt pas l'UX si la gamification n'est pas encore migrée */
export function tryAwardGamificationPoints(
  userId: string | null | undefined,
  action: GamificationAction,
  referenceId: string,
): void {
  if (!userId) return;
  awardGamificationPoints(userId, action, referenceId).catch(() => {});
}

export async function fetchUserCoeurs(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('coeurs')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (error.message.includes('coeurs')) return 0;
    throw error;
  }

  return parseCoeurs(data?.coeurs);
}

export async function fetchGamificationProgress(userId: string): Promise<GamificationProgress> {
  const coeurs = await fetchUserCoeurs(userId);
  return computeGamificationProgress(coeurs);
}

function weekReferenceId(): string {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `week_${now.getFullYear()}_${week}`;
}

export async function awardShareApp(userId: string): Promise<AwardResult> {
  return awardGamificationPoints(userId, 'share_app', weekReferenceId());
}

export async function awardStoreReview(userId: string): Promise<AwardResult> {
  return awardGamificationPoints(userId, 'store_review', 'lifetime');
}

export async function awardFriendAdded(userId: string, friendshipId: string): Promise<AwardResult> {
  return awardGamificationPoints(userId, 'friend_added', friendshipId);
}
