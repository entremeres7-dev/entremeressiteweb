import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createSosMamanPost,
  createSosMamanReply,
  deleteSosMamanPost,
  deleteSosMamanReply,
  fetchSosMamanPostDetail,
  fetchSosMamanPosts,
  reportSosMamanContent,
  updateSosMamanPost,
  updateSosMamanReply,
  voteSosMamanPoll,
} from '@/lib/sos-maman/sosMamanService';
import type { CreateSosMamanPostInput, SosMamanPost, SosMamanReply } from '@/lib/sos-maman/types';
import { globalEvents, EVENT_TYPES } from '@/events';

export function useSosMamanFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SosMamanPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      setNeedsSetup(false);
      try {
        const list = await fetchSosMamanPosts(user.id);
        setPosts(list);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur';
        if (msg.includes('does not exist') || msg.includes('schema cache')) {
          setNeedsSetup(true);
        } else {
          setError(msg);
        }
        setPosts([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    load();
  }, [load]);

  const publish = useCallback(
    async (input: CreateSosMamanPostInput) => {
      if (!user?.id) return false;
      await createSosMamanPost(user.id, input);
      await load(true);
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
      globalEvents.emit(EVENT_TYPES.GAMIFICATION_UPDATED);
      return true;
    },
    [user?.id, load],
  );

  const removePost = useCallback(
    async (postId: string) => {
      if (!user?.id) return;
      await deleteSosMamanPost(user.id, postId);
      await load(true);
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
    },
    [user?.id, load],
  );

  const editPost = useCallback(
    async (postId: string, content: string) => {
      if (!user?.id) return;
      await updateSosMamanPost(user.id, postId, content);
      await load(true);
    },
    [user?.id, load],
  );

  const reportPost = useCallback(
    async (postId: string) => {
      if (!user?.id) return;
      await reportSosMamanContent(user.id, { postId });
    },
    [user?.id],
  );

  return {
    posts,
    loading,
    refreshing,
    error,
    needsSetup,
    refresh: () => load(true),
    publish,
    removePost,
    editPost,
    reportPost,
    currentUserId: user?.id ?? null,
  };
}

export function useSosMamanThread(postId: string) {
  const { user } = useAuth();
  const [post, setPost] = useState<SosMamanPost | null>(null);
  const [replies, setReplies] = useState<SosMamanReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id || !postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSosMamanPostDetail(postId, user.id);
      setPost(data.post);
      setReplies(data.replies);
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [user?.id, postId]);

  useEffect(() => {
    load();
  }, [load]);

  const reply = useCallback(
    async (content: string, isAnonymous: boolean) => {
      if (!user?.id) return false;
      await createSosMamanReply(user.id, postId, content, isAnonymous);
      await load();
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
      globalEvents.emit(EVENT_TYPES.GAMIFICATION_UPDATED);
      return true;
    },
    [user?.id, postId, load],
  );

  const removeReply = useCallback(
    async (replyId: string) => {
      if (!user?.id) return;
      await deleteSosMamanReply(user.id, replyId);
      await load();
      globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
    },
    [user?.id, load],
  );

  const editReply = useCallback(
    async (replyId: string, content: string) => {
      if (!user?.id) return;
      await updateSosMamanReply(user.id, replyId, content);
      await load();
    },
    [user?.id, load],
  );

  const removePost = useCallback(async () => {
    if (!user?.id || !postId) return;
    await deleteSosMamanPost(user.id, postId);
    globalEvents.emit(EVENT_TYPES.SOS_MAMAN_BADGE_REFRESH);
  }, [user?.id, postId]);

  const editPost = useCallback(
    async (content: string) => {
      if (!user?.id || !postId) return;
      await updateSosMamanPost(user.id, postId, content);
      await load();
    },
    [user?.id, postId, load],
  );

  const reportContent = useCallback(
    async (opts: { postId?: string; replyId?: string }) => {
      if (!user?.id) return;
      await reportSosMamanContent(user.id, opts);
    },
    [user?.id],
  );

  const votePoll = useCallback(
    async (optionId: string) => {
      if (!user?.id || !postId) return;
      await voteSosMamanPoll(user.id, postId, optionId);
      await load();
      globalEvents.emit(EVENT_TYPES.GAMIFICATION_UPDATED);
    },
    [user?.id, postId, load],
  );

  return {
    post,
    replies,
    loading,
    error,
    reload: load,
    reply,
    removeReply,
    editReply,
    removePost,
    editPost,
    reportContent,
    votePoll,
    currentUserId: user?.id ?? null,
  };
}
