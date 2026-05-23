import { supabase } from '@/supabaseClient';

import { pushNotifySosMamanReply } from '@/lib/notifications/notifySosMamanReply';
import { fetchUserCoeurs, tryAwardGamificationPoints } from '@/lib/gamification/gamificationService';
import { fetchCoeursMap, parseCoeurs } from '@/lib/gamification/fetchProfilesCoeurs';
import { tierEmojiForCoeurs } from '@/lib/gamification/tierDisplayEmoji';
import { uploadSosPostPhotos } from './uploadSosPhotos';
import {
  ensureSosFeedSeenInitialized,
  getSosFeedLastSeen,
  markSosFeedSeen,
} from './sosFeedSeen';

import type {

  CreateSosMamanPostInput,

  SosMamanPollOption,

  SosMamanPost,

  SosMamanPostType,

  SosMamanReply,

} from './types';



type PostRow = {

  id: string;

  user_id: string;

  content: string;

  post_type?: SosMamanPostType;

  is_anonymous: boolean;

  created_at: string;

  image_urls?: string[] | null;

};



type ReplyRow = {

  id: string;

  post_id: string;

  user_id: string;

  content: string;

  is_anonymous: boolean;

  created_at: string;

};



const POST_SELECT = 'id, user_id, content, post_type, is_anonymous, created_at, image_urls';



type ProfileSummary = { name: string; photo: string | null; coeurs: number };

async function profileMap(userIds: string[]) {

  if (!userIds.length) return new Map<string, ProfileSummary>();



  const uniqueIds = Array.from(new Set(userIds));

  const [{ data }, coeursMap] = await Promise.all([
    supabase.from('profiles').select('id, username, photo').in('id', uniqueIds),
    fetchCoeursMap(uniqueIds),
  ]);

  return new Map(
    (data ?? []).map((p) => [
      p.id,
      {
        name: p.username?.trim() || 'Maman',
        photo: p.photo,
        coeurs: coeursMap.get(p.id) ?? parseCoeurs((p as { coeurs?: unknown }).coeurs),
      },
    ]),
  );

}

/** Garantit les cœurs du compte connecté (profil souvent lisible seul via RLS). */
async function ensureViewerCoeursInMap(
  map: Map<string, ProfileSummary>,
  viewerId: string,
): Promise<void> {
  if (!viewerId) return;
  try {
    const coeurs = await fetchUserCoeurs(viewerId);
    const existing = map.get(viewerId);
    if (existing) {
      map.set(viewerId, { ...existing, coeurs });
    }
  } catch {
    // ignore
  }
}

function displayAuthor(

  userId: string,

  isAnonymous: boolean,

  map: Map<string, ProfileSummary>,

) {

  if (isAnonymous) {
    return {
      author_name: 'Maman anonyme',
      author_photo: null as string | null,
      author_tier_emoji: null as string | null,
    };
  }

  const p = map.get(userId);

  return {
    author_name: p?.name ?? 'Maman',
    author_photo: p?.photo ?? null,
    author_tier_emoji: tierEmojiForCoeurs(p?.coeurs),
  };

}



function normalizePostType(value?: string | null): SosMamanPostType {

  if (value === 'confession' || value === 'poll' || value === 'question') return value;

  return 'question';

}



async function attachPollData(posts: SosMamanPost[], currentUserId: string): Promise<SosMamanPost[]> {

  const pollPostIds = posts.filter((p) => p.post_type === 'poll').map((p) => p.id);

  if (!pollPostIds.length) return posts;



  const [{ data: options }, { data: votes }] = await Promise.all([

    supabase

      .from('sos_maman_poll_options')

      .select('id, post_id, label, sort_order')

      .in('post_id', pollPostIds)

      .order('sort_order', { ascending: true }),

    supabase.from('sos_maman_poll_votes').select('post_id, option_id, user_id').in('post_id', pollPostIds),

  ]);



  const votesByOption = new Map<string, number>();

  const userVoteByPost = new Map<string, string>();

  for (const v of votes ?? []) {

    votesByOption.set(v.option_id, (votesByOption.get(v.option_id) ?? 0) + 1);

    if (v.user_id === currentUserId) userVoteByPost.set(v.post_id, v.option_id);

  }



  const optionsByPost = new Map<string, SosMamanPollOption[]>();

  for (const opt of options ?? []) {

    if (!optionsByPost.has(opt.post_id)) optionsByPost.set(opt.post_id, []);

    optionsByPost.get(opt.post_id)!.push({

      ...opt,

      votes_count: votesByOption.get(opt.id) ?? 0,

    });

  }



  return posts.map((post) => {

    if (post.post_type !== 'poll') return post;

    const pollOptions = optionsByPost.get(post.id) ?? [];

    const pollTotal = pollOptions.reduce((sum, o) => sum + o.votes_count, 0);

    return {

      ...post,

      poll_options: pollOptions,

      poll_total_votes: pollTotal,

      user_poll_option_id: userVoteByPost.get(post.id) ?? null,

    };

  });

}



function mapPostRow(

  post: PostRow,

  profiles: Map<string, ProfileSummary>,

  repliesCount: number,

  hasUnread: boolean,

): SosMamanPost {

  const author = displayAuthor(post.user_id, post.is_anonymous, profiles);

  return {

    id: post.id,

    user_id: post.user_id,

    content: post.content,

    image_urls: post.image_urls?.filter(Boolean) ?? [],

    post_type: normalizePostType(post.post_type),

    is_anonymous: post.is_anonymous,

    created_at: post.created_at,

    ...author,

    replies_count: repliesCount,

    has_unread_replies: hasUnread,

  };

}



export async function fetchSosMamanPosts(currentUserId: string): Promise<SosMamanPost[]> {

  const { data: posts, error } = await supabase

    .from('sos_maman_posts')

    .select(POST_SELECT)

    .order('created_at', { ascending: false })

    .limit(80);



  if (error) throw error;

  if (!posts?.length) return [];



  const postIds = posts.map((p) => p.id);

  const userIds = posts.map((p) => p.user_id);



  const [{ data: replies }, { data: reads }] = await Promise.all([

    supabase.from('sos_maman_replies').select('id, post_id, user_id, created_at').in('post_id', postIds),

    supabase

      .from('sos_maman_reads')

      .select('post_id, last_read_at')

      .eq('user_id', currentUserId)

      .in('post_id', postIds),

  ]);



  const profiles = await profileMap(userIds);
  await ensureViewerCoeursInMap(profiles, currentUserId);

  const readMap = new Map((reads ?? []).map((r) => [r.post_id, r.last_read_at]));



  const repliesByPost = new Map<string, ReplyRow[]>();

  for (const r of replies ?? []) {

    if (!repliesByPost.has(r.post_id)) repliesByPost.set(r.post_id, []);

    repliesByPost.get(r.post_id)!.push(r as ReplyRow);

  }



  const mapped = (posts as PostRow[]).map((post) => {

    const postReplies = repliesByPost.get(post.id) ?? [];

    const lastRead = readMap.get(post.id);

    const unreadFromOthers = postReplies.filter(

      (r) =>

        r.user_id !== currentUserId &&

        (!lastRead || new Date(r.created_at) > new Date(lastRead)),

    );

    return mapPostRow(post, profiles, postReplies.length, unreadFromOthers.length > 0);

  });



  return attachPollData(mapped, currentUserId);

}



export async function fetchSosMamanPostDetail(

  postId: string,

  currentUserId: string,

): Promise<{ post: SosMamanPost; replies: SosMamanReply[] }> {

  const { data: post, error } = await supabase

    .from('sos_maman_posts')

    .select(POST_SELECT)

    .eq('id', postId)

    .single();



  if (error) throw error;



  const { data: replyRows, error: repliesError } = await supabase

    .from('sos_maman_replies')

    .select('id, post_id, user_id, content, is_anonymous, created_at')

    .eq('post_id', postId)

    .order('created_at', { ascending: true });



  if (repliesError) throw repliesError;



  const userIds = [post.user_id, ...(replyRows ?? []).map((r) => r.user_id)];

  const profiles = await profileMap(userIds);
  await ensureViewerCoeursInMap(profiles, currentUserId);

  await supabase.from('sos_maman_reads').upsert({

    user_id: currentUserId,

    post_id: postId,

    last_read_at: new Date().toISOString(),

  });



  const replies: SosMamanReply[] = (replyRows ?? []).map((r) => {

    const a = displayAuthor(r.user_id, r.is_anonymous, profiles);

    return { ...(r as ReplyRow), ...a };

  });



  const basePost = mapPostRow(post as PostRow, profiles, replies.length, false);

  const [enriched] = await attachPollData([basePost], currentUserId);



  return { post: enriched, replies };

}



export async function createSosMamanPost(userId: string, input: CreateSosMamanPostInput): Promise<void> {

  const { content, isAnonymous, postType, pollOptions, photoUris } = input;

  const trimmed = content.trim();

  const localPhotos = photoUris ?? [];



  if (postType === 'poll') {

    const labels = (pollOptions ?? []).map((l) => l.trim()).filter(Boolean);

    if (labels.length < 2) throw new Error('Ajoutez au moins 2 choix pour le sondage.');

  }



  if (!trimmed && !localPhotos.length) {

    throw new Error('Ajoutez un texte ou au moins une photo.');

  }



  let imageUrls: string[] = [];

  if (localPhotos.length) {

    imageUrls = await uploadSosPostPhotos(userId, localPhotos);

  }



  const { data: created, error } = await supabase

    .from('sos_maman_posts')

    .insert({

      user_id: userId,

      content: trimmed,

      post_type: postType,

      is_anonymous: isAnonymous,

      image_urls: imageUrls,

    })

    .select('id')

    .single();



  if (error) throw error;



  if (postType === 'poll' && created?.id) {

    const labels = (pollOptions ?? []).map((l) => l.trim()).filter(Boolean);

    const { error: optError } = await supabase.from('sos_maman_poll_options').insert(

      labels.map((label, index) => ({

        post_id: created.id,

        label,

        sort_order: index,

      })),

    );

    if (optError) throw optError;

  }

  if (created?.id) {
    tryAwardGamificationPoints(userId, 'sos_publish', created.id);
  }

}



export async function voteSosMamanPoll(

  userId: string,

  postId: string,

  optionId: string,

): Promise<void> {

  const { error } = await supabase.from('sos_maman_poll_votes').upsert(

    {

      user_id: userId,

      post_id: postId,

      option_id: optionId,

    },

    { onConflict: 'user_id,post_id' },

  );

  if (error) throw error;

  tryAwardGamificationPoints(userId, 'sos_poll_vote', postId);

}



async function countNewSosPostsFromOthers(currentUserId: string): Promise<number> {
  await ensureSosFeedSeenInitialized(currentUserId);
  const lastSeen = await getSosFeedLastSeen(currentUserId);
  if (!lastSeen) return 0;

  const { count, error } = await supabase
    .from('sos_maman_posts')
    .select('id', { count: 'exact', head: true })
    .neq('user_id', currentUserId)
    .gt('created_at', lastSeen);

  if (error) throw error;
  return count ?? 0;
}

async function countOwnPostsWithUnreadReplies(currentUserId: string): Promise<number> {
  const { data: ownPosts, error: postsError } = await supabase
    .from('sos_maman_posts')
    .select('id')
    .eq('user_id', currentUserId);

  if (postsError) throw postsError;
  if (!ownPosts?.length) return 0;

  const postIds = ownPosts.map((p) => p.id);

  const [{ data: reads }, { data: replies }] = await Promise.all([
    supabase
      .from('sos_maman_reads')
      .select('post_id, last_read_at')
      .eq('user_id', currentUserId)
      .in('post_id', postIds),
    supabase
      .from('sos_maman_replies')
      .select('post_id, user_id, created_at')
      .in('post_id', postIds),
  ]);

  const readMap = new Map((reads ?? []).map((r) => [r.post_id, r.last_read_at]));
  const postsWithUnread = new Set<string>();

  for (const reply of replies ?? []) {
    if (reply.user_id === currentUserId) continue;
    const lastRead = readMap.get(reply.post_id);
    if (!lastRead || new Date(reply.created_at) > new Date(lastRead)) {
      postsWithUnread.add(reply.post_id);
    }
  }

  return postsWithUnread.size;
}

/** Badge SOS Maman : nouveaux SOS des autres + réponses non lues sur vos posts. */
export async function fetchSosMamanBadgeCount(currentUserId: string): Promise<number> {
  const [newPosts, unreadReplies] = await Promise.all([
    countNewSosPostsFromOthers(currentUserId),
    countOwnPostsWithUnreadReplies(currentUserId),
  ]);
  return newPosts + unreadReplies;
}

export { markSosFeedSeen };



export async function updateSosMamanPost(

  userId: string,

  postId: string,

  content: string,

): Promise<void> {

  const { error } = await supabase

    .from('sos_maman_posts')

    .update({ content: content.trim(), updated_at: new Date().toISOString() })

    .eq('id', postId)

    .eq('user_id', userId);

  if (error) throw error;

}



export async function deleteSosMamanPost(userId: string, postId: string): Promise<void> {

  const { error } = await supabase.from('sos_maman_posts').delete().eq('id', postId).eq('user_id', userId);

  if (error) throw error;

}



export async function updateSosMamanReply(

  userId: string,

  replyId: string,

  content: string,

): Promise<void> {

  const { error } = await supabase

    .from('sos_maman_replies')

    .update({ content: content.trim(), updated_at: new Date().toISOString() })

    .eq('id', replyId)

    .eq('user_id', userId);

  if (error) throw error;

}



export async function deleteSosMamanReply(userId: string, replyId: string): Promise<void> {

  const { error } = await supabase.from('sos_maman_replies').delete().eq('id', replyId).eq('user_id', userId);

  if (error) throw error;

}



export async function reportSosMamanContent(

  reporterId: string,

  opts: { postId?: string; replyId?: string; reason?: string },

): Promise<void> {

  const { error } = await supabase.from('sos_maman_reports').insert({

    reporter_id: reporterId,

    post_id: opts.postId ?? null,

    reply_id: opts.replyId ?? null,

    reason: opts.reason?.trim() || 'Signalement utilisateur',

  });

  if (error) throw error;

}



export async function createSosMamanReply(

  userId: string,

  postId: string,

  content: string,

  isAnonymous: boolean,

): Promise<void> {

  const { data: postRow } = await supabase

    .from('sos_maman_posts')

    .select('user_id')

    .eq('id', postId)

    .single();



  const { data: reply, error } = await supabase
    .from('sos_maman_replies')
    .insert({
      user_id: userId,
      post_id: postId,
      content: content.trim(),
      is_anonymous: isAnonymous,
    })
    .select('id')
    .single();

  if (error) throw error;

  if (reply?.id) {
    tryAwardGamificationPoints(userId, 'sos_reply', reply.id);
  }

  const authorId = postRow?.user_id;

  if (authorId && authorId !== userId) {
    if (reply?.id) {
      tryAwardGamificationPoints(authorId, 'sos_reply_received', reply.id);
    }
    const replierLabel = isAnonymous ? 'Une maman' : (await profileMap([userId])).get(userId)?.name ?? 'Une maman';
    await pushNotifySosMamanReply(authorId, postId, replierLabel);
  }

}


