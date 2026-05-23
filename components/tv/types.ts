export type { TvCatalogItem, TvHeroSlide, TvThumbKey, TvWatchParams } from '@/lib/tv/catalog';
export {
  TV_CLIPS,
  TV_HERO_SLIDES,
  TV_KIDS,
  TV_NOUVEAUTES,
  TV_SERIES_MAMANS,
  TV_THUMBS,
  TV_TOP_5,
  catalogItemToMaListeKey,
} from '@/lib/tv/catalog';

/** @deprecated Utiliser TvCatalogItem */
export type TvContentItem = import('@/lib/tv/catalog').TvCatalogItem;
