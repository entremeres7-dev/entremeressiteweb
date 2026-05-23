import { GAMIFICATION_TIERS, type GamificationTier } from './constants';

export type GamificationProgress = {
  coeurs: number;
  level: number;
  tier: GamificationTier;
  nextTier: GamificationTier | null;
  pointsToNextLevel: number;
  progressInTier: number;
};

export function formatCoeurs(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function computeGamificationProgress(coeurs: number): GamificationProgress {
  const safe = Math.max(0, coeurs);
  let tier = GAMIFICATION_TIERS[0];
  for (const t of GAMIFICATION_TIERS) {
    if (safe >= t.min) tier = t;
  }

  const tierIndex = GAMIFICATION_TIERS.findIndex((t) => t.level === tier.level);
  const nextTier = tierIndex < GAMIFICATION_TIERS.length - 1 ? GAMIFICATION_TIERS[tierIndex + 1] : null;

  const tierSpan = nextTier ? nextTier.min - tier.min : 1;
  const inTier = safe - tier.min;
  const progressInTier = nextTier ? Math.min(1, Math.max(0, inTier / tierSpan)) : 1;
  const pointsToNextLevel = nextTier ? Math.max(0, nextTier.min - safe) : 0;

  return {
    coeurs: safe,
    level: tier.level,
    tier,
    nextTier,
    pointsToNextLevel,
    progressInTier,
  };
}

export type TierStatus = 'obtained' | 'current' | 'locked';

export function tierStatusForList(tier: GamificationTier, coeurs: number): TierStatus {
  if (tier.max !== null && coeurs >= tier.max) return 'obtained';
  if (coeurs >= tier.min && (tier.max === null || coeurs < tier.max)) return 'current';
  return 'locked';
}
