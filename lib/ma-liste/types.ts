export type MaListeItem = {
  id: string;
  user_id: string;
  content_key: string;
  title: string;
  episode: string | null;
  color: string;
  watch_show_title: string | null;
  watch_episode_title: string | null;
  watch_episode_subtitle: string | null;
  created_at: string;
};

export type AddToMaListeInput = {
  contentKey: string;
  title: string;
  episode?: string;
  color: string;
  watchShowTitle?: string;
  watchEpisodeTitle?: string;
  watchEpisodeSubtitle?: string;
};
