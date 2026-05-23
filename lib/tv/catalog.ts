import type { ImageSourcePropType } from 'react-native';

/** Affiches TV — synchronisées avec website/assets/thumbs/ */
export const TV_THUMBS = {
  'couple-apres-bebe': require('@/assets/images/tv/couple-apres-bebe.png'),
  'couple-apres-bebe-temoignages': require('@/assets/images/tv/couple-apres-bebe-temoignages.png'),
  'recette-bebe': require('@/assets/images/tv/recette-bebe.png'),
  'mama-chef': require('@/assets/images/tv/mama-chef.png'),
  'sos-maman': require('@/assets/images/tv/sos-maman.png'),
  'allaitement-sans-filtre': require('@/assets/images/tv/allaitement-sans-filtre.png'),
  '24h-dans-la-vie': require('@/assets/images/tv/24h-dans-la-vie.png'),
  'histoires-du-soir': require('@/assets/images/tv/histoires-du-soir.png'),
  'comptines-entremeres': require('@/assets/images/tv/comptines-entremeres.png'),
  'idees-de-jeux': require('@/assets/images/tv/idees-de-jeux.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export type TvThumbKey = keyof typeof TV_THUMBS;

export type TvWatchParams = {
  showTitle: string;
  episodeLabel: string;
  episodeTitle: string;
  episodeSubtitle: string;
};

export type TvCatalogItem = {
  id: string;
  title: string;
  color: string;
  thumb?: TvThumbKey;
  /** Masque le titre sous l'affiche (logo déjà sur l'image) */
  hideTitle?: boolean;
  episode?: string;
  duration?: string;
  subtitle?: string;
};

export type TvHeroSlide = {
  id: string;
  tags: string;
  title: string;
  hook: string;
  episode: string;
  thumb: TvThumbKey;
  watch: TvWatchParams;
};

/** Hero carousel — aligné sur website/index.html spotlight */
export const TV_HERO_SLIDES: TvHeroSlide[] = [
  {
    id: 'couple-apres-bebe',
    tags: 'Couple · Société · 1 saison',
    title: 'COUPLE APRÈS BÉBÉ',
    hook: "QUAND BÉBÉ ARRIVE, LE COUPLE EST MIS À L'ÉPREUVE",
    episode: 'Épisode 1 — On se parle plus',
    thumb: 'couple-apres-bebe',
    watch: {
      showTitle: 'COUPLE APRÈS BÉBÉ',
      episodeLabel: 'Épisode 1',
      episodeTitle: 'ON SE PARLE PLUS',
      episodeSubtitle: "Quand bébé arrive, le couple est mis à l'épreuve.",
    },
  },
  {
    id: 'recettes-bebe',
    tags: 'Cuisine · Famille · 1 saison',
    title: 'RECETTES BÉBÉ',
    hook: 'DES IDÉES SIMPLES ET GOURMANDES POUR NOURRIR BÉBÉ SEREINEMENT',
    episode: 'Épisode 1 — Premières purées',
    thumb: 'recette-bebe',
    watch: {
      showTitle: 'RECETTES BÉBÉ',
      episodeLabel: 'Épisode 1',
      episodeTitle: 'PREMIÈRES PURÉES',
      episodeSubtitle: 'Des idées simples et gourmandes pour bébé.',
    },
  },
  {
    id: 'mama-chef',
    tags: 'Cuisine · Émission · 1 saison',
    title: 'MAMA CHEF',
    hook: "LES MAMANS S'AFFRONTENT AUTOUR DE LEURS PLUS BELLES RECETTES",
    episode: "Épisode 1 — Le gâteau d'anniversaire",
    thumb: 'mama-chef',
    watch: {
      showTitle: 'MAMA CHEF',
      episodeLabel: 'Épisode 1',
      episodeTitle: "LE GÂTEAU D'ANNIVERSAIRE",
      episodeSubtitle: 'Les mamans s\'affrontent autour de leurs plus belles recettes.',
    },
  },
  {
    id: 'allaitement-sans-filtre',
    tags: 'Documentaire · Santé · 1 saison',
    title: 'ALLAITEMENT SANS FILTRE',
    hook: 'LES VRAIES HISTOIRES DES MAMANS QUI ALLAITENT',
    episode: 'Épisode 1 — Premiers jours',
    thumb: 'allaitement-sans-filtre',
    watch: {
      showTitle: 'ALLAITEMENT SANS FILTRE',
      episodeLabel: 'Épisode 1',
      episodeTitle: 'PREMIERS JOURS',
      episodeSubtitle: 'Les vraies histoires des mamans qui allaitent.',
    },
  },
];

/** TOP 5 — ordre website */
export const TV_TOP_5: TvCatalogItem[] = [
  { id: 'top-1', title: 'RECETTES BÉBÉ', thumb: 'recette-bebe', color: '#4a2040' },
  { id: 'top-2', title: 'ÊTRE MÈRE : TÉMOIGNAGES', thumb: 'couple-apres-bebe-temoignages', color: '#3e2a4a' },
  { id: 'top-3', title: 'MAMA CHEF', thumb: 'mama-chef', color: '#1a3a4a' },
  { id: 'top-4', title: 'COUPLE APRÈS BÉBÉ', thumb: 'couple-apres-bebe', color: '#4a2020' },
  { id: 'top-5', title: 'SOS MAMAN', thumb: 'sos-maman', color: '#1a3a3a' },
];

/** Séries mamans */
export const TV_SERIES_MAMANS: TvCatalogItem[] = [
  { id: 'series-1', title: 'COUPLE APRÈS BÉBÉ', thumb: 'couple-apres-bebe', hideTitle: true, color: '#4a2040' },
  { id: 'series-2', title: 'RECETTES BÉBÉ', thumb: 'recette-bebe', color: '#3e2a4a' },
  { id: 'series-3', title: 'SOS MAMAN', thumb: 'sos-maman', color: '#1a3a4a' },
  { id: 'series-4', title: 'ALLAITEMENT SANS FILTRE', thumb: 'allaitement-sans-filtre', color: '#4a2020' },
  { id: 'series-5', title: 'MAMA CHEF', thumb: 'mama-chef', hideTitle: true, color: '#1a1a3a' },
  { id: 'series-6', title: 'RUN POUSSTTE', color: '#4a3800' },
];

/** Nouveautés */
export const TV_NOUVEAUTES: TvCatalogItem[] = [
  { id: 'new-1', title: 'SOS MAMAN', thumb: 'sos-maman', color: '#4a2040' },
  { id: 'new-2', title: 'ÊTRE MÈRE : TÉMOIGNAGES', thumb: 'couple-apres-bebe-temoignages', color: '#3e2a4a' },
  { id: 'new-3', title: 'RECETTES BÉBÉ', thumb: 'recette-bebe', color: '#4a3800' },
  { id: 'new-4', title: "24H DANS LA VIE D'UNE MAMAN", thumb: '24h-dans-la-vie', color: '#1a3a4a' },
  { id: 'new-5', title: 'COUPLE APRÈS BÉBÉ', thumb: 'couple-apres-bebe', hideTitle: true, color: '#4a2020' },
  { id: 'new-6', title: 'ALLAITEMENT SANS FILTRE', thumb: 'allaitement-sans-filtre', color: '#1a3a3a' },
];

/** Les moments à ne pas manquer */
export const TV_CLIPS: TvCatalogItem[] = [
  {
    id: 'clip-1',
    title: 'SOS Maman — Je craque devant les caméras',
    subtitle: 'SOS Maman',
    duration: '7m',
    thumb: 'sos-maman',
    color: '#4a2040',
  },
  {
    id: 'clip-2',
    title: 'Allaitement — Les vraies confessions',
    subtitle: 'Allaitement sans filtre',
    duration: '3m21',
    thumb: 'allaitement-sans-filtre',
    color: '#1a2e3a',
  },
  {
    id: 'clip-3',
    title: 'Couple après bébé — On se parle plus',
    subtitle: 'Couple après bébé',
    duration: '6m',
    thumb: 'couple-apres-bebe',
    color: '#4a2020',
  },
];

/** Pour les enfants */
export const TV_KIDS: TvCatalogItem[] = [
  { id: 'kids-1', title: 'Histoires du soir', thumb: 'histoires-du-soir', color: '#ff6a88' },
  { id: 'kids-2', title: 'Comptines EntreMeres', thumb: 'comptines-entremeres', hideTitle: true, color: '#ff6a88' },
  { id: 'kids-3', title: 'Idées de jeux', thumb: 'idees-de-jeux', color: '#f5f5f5' },
];

export function catalogItemToMaListeKey(item: TvCatalogItem, section: string): string {
  return `tv:${section}:${item.id}`;
}
