import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { GamificationProgress } from '@/lib/gamification/computeProgress';
import { computeGamificationProgress } from '@/lib/gamification/computeProgress';
import { fetchUserCoeurs } from '@/lib/gamification/gamificationService';
import { globalEvents, EVENT_TYPES } from '@/events';

export function useGamification() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GamificationProgress>(() =>
    computeGamificationProgress(0),
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setProgress(computeGamificationProgress(0));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const coeurs = await fetchUserCoeurs(user.id);
      setProgress(computeGamificationProgress(coeurs));
    } catch {
      setProgress(computeGamificationProgress(0));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => refresh();
    globalEvents.on(EVENT_TYPES.GAMIFICATION_UPDATED, onUpdate);
    return () => globalEvents.off(EVENT_TYPES.GAMIFICATION_UPDATED, onUpdate);
  }, [refresh]);

  const notifyUpdated = useCallback(() => {
    globalEvents.emit(EVENT_TYPES.GAMIFICATION_UPDATED);
  }, []);

  return { progress, loading, refresh, notifyUpdated };
}
