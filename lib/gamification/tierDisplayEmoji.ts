import { computeGamificationProgress } from './computeProgress';

/** Emoji affiché à côté du pseudo (Maman active, pilier, ambassadrice — niveau ≥ 2). */
export function tierEmojiForCoeurs(coeurs: number | null | undefined): string | null {
  const { tier } = computeGamificationProgress(typeof coeurs === 'number' ? coeurs : 0);
  return tier.level >= 2 ? tier.emoji : null;
}
