(function (global) {
  'use strict';

  /** Préfixe des routes Expo Web exportées (npm run build:web). */
  global.ENTREMERES_APP_BASE = 'app';

  global.EntreMeresApp = {
    base: global.ENTREMERES_APP_BASE,
    route(name) {
      const base = global.ENTREMERES_APP_BASE.replace(/\/$/, '');
      const path = String(name || '').replace(/^\//, '');
      return `${base}/${path}`;
    },
    routes: {
      tv: 'app/',
      sos: 'app/sos-maman',
      rencontres: 'app/rencontrer',
      profil: 'app/profil',
      maListe: 'app/ma-liste',
      messages: 'app/messages',
    },
  };
})(window);
