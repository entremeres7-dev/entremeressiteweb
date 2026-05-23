export const VISIBLE_TABS = ['accueil', 'ma-liste', 'sos-maman', 'rencontrer', 'profil'] as const;

export type AppTabName = (typeof VISIBLE_TABS)[number];

export const APP_TAB_LABELS: Record<AppTabName, string> = {
  accueil: 'TV',
  'ma-liste': 'Ma liste',
  'sos-maman': 'SOS Maman',
  rencontrer: 'Rencontres',
  profil: 'Profil',
};

export const APP_TAB_HREFS: Record<AppTabName, string> = {
  accueil: '/(tabs)/accueil',
  'ma-liste': '/(tabs)/ma-liste',
  'sos-maman': '/(tabs)/sos-maman',
  rencontrer: '/(tabs)/rencontrer',
  profil: '/(tabs)/profil',
};

export function isAppTabFocused(pathname: string, tabName: AppTabName, href: string): boolean {
  if (pathname === href || pathname.endsWith(`/${tabName}`)) return true;
  if (tabName === 'accueil' && (pathname.endsWith('/tv') || pathname.endsWith('/salon'))) return true;
  if (tabName === 'rencontrer' && pathname.endsWith('/explorer')) return true;
  return false;
}
