import { showTvAvailabilityModal } from './tvAvailabilityModal';

export const TV_AVAILABILITY_LABEL = '1er septembre';

export const TV_AVAILABILITY_BRAND = 'EntreMeres TV';

export const TV_AVAILABILITY_TITLE = 'Disponible le 1er septembre';

export const TV_AVAILABILITY_BODY =
  'Les épisodes seront accessibles à partir du 1er septembre. Revenez bientôt pour regarder vos émissions préférées.';

export const TV_AVAILABILITY_CTA = 'Compris';

/** Lecture streaming — activer le 1er septembre */
export const TV_STREAMING_ENABLED = false;

export function alertTvWatchUnavailable(_showTitle?: string): void {
  showTvAvailabilityModal();
}
