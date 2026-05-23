export type SosMamanPostType = 'confession' | 'question' | 'poll';

export type SosMamanPollOption = {
  id: string;
  post_id: string;
  label: string;
  sort_order: number;
  votes_count: number;
};

export type SosMamanPost = {
  id: string;
  user_id: string;
  content: string;
  image_urls: string[];
  post_type: SosMamanPostType;
  is_anonymous: boolean;
  created_at: string;
  author_name: string;
  author_photo: string | null;
  author_tier_emoji: string | null;
  replies_count: number;
  has_unread_replies: boolean;
  poll_options?: SosMamanPollOption[];
  poll_total_votes?: number;
  user_poll_option_id?: string | null;
};

export type SosMamanReply = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author_name: string;
  author_photo: string | null;
  author_tier_emoji: string | null;
};

export type CreateSosMamanPostInput = {
  content: string;
  isAnonymous: boolean;
  postType: SosMamanPostType;
  pollOptions?: string[];
  /** URIs locales (galerie / caméra) à envoyer avant publication */
  photoUris?: string[];
};
