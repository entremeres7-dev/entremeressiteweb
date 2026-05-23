import { TvWatchScreen } from '@/components/tv/TvWatchScreen';
import { SOS_MAMAN_EPISODE_1 } from '@/constants/sosMamanEpisode';
import { useLocalSearchParams } from 'expo-router';

export default function TvWatchRoute() {
  const params = useLocalSearchParams<{
    showTitle?: string;
    episodeLabel?: string;
    episodeTitle?: string;
    episodeSubtitle?: string;
    videoUri?: string;
  }>();

  return (
    <TvWatchScreen
      showTitle={params.showTitle}
      episodeLabel={params.episodeLabel}
      episodeTitle={params.episodeTitle}
      episodeSubtitle={params.episodeSubtitle}
      videoUri={params.videoUri ?? SOS_MAMAN_EPISODE_1.videoUrl}
    />
  );
}
