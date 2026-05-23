export type ProfileRow = {
  id: string;
  username: string | null;
  age: number | null;
  region: string | null;
  country: string | null;
  photo: string | null;
  bio: string | null;
  status: string | null;
  job: string | null;
  children: string | null;
  created_at: string;
  coeurs?: number | null;
};

export type RencontreFilter = 'all' | 'new';

export type RencontreLocationFilter = {
  timeFilter: RencontreFilter;
  country: string | null;
  /** Libellé région affiché (ex. PACA, Île-de-France) — filtre les départements associés */
  adminRegionLabel: string | null;
};

export type MamanRencontre = {
  id: string;
  name: string;
  tierEmoji: string | null;
  age: number | null;
  city: string;
  country: string | null;
  region: string | null;
  bio: string;
  tags: string[];
  photoUrl: string;
  color: string;
  createdAt: string;
};
