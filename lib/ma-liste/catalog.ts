import { SOS_MAMAN_EPISODE_1 } from '@/constants/sosMamanEpisode';
import type { TvCatalogItem } from '@/lib/tv/catalog';
import { catalogItemToMaListeKey } from '@/lib/tv/catalog';
import type { AddToMaListeInput } from './types';

export const SOS_MAMAN_LIST_ITEM: AddToMaListeInput = {
  contentKey: 'sos-maman:episode-1',
  title: 'SOS MAMAN',
  episode: `Épisode ${SOS_MAMAN_EPISODE_1.episodeNumber}`,
  color: '#5c2a3a',
  watchShowTitle: SOS_MAMAN_EPISODE_1.showTitle,
  watchEpisodeTitle: SOS_MAMAN_EPISODE_1.episodeTitle,
  watchEpisodeSubtitle: SOS_MAMAN_EPISODE_1.episodeSubtitle,
};

export function tvContentToSaveInput(
  item: TvCatalogItem,
  section: string,
): AddToMaListeInput {
  return {
    contentKey: catalogItemToMaListeKey(item, section),
    title: item.title,
    episode: item.episode ?? item.duration,
    color: item.color,
  };
}
