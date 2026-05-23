(function () {
  'use strict';

  const STORAGE_KEY = 'entremeres_cookie_consent';
  const CONSENT_VERSION = 1;

  function policyUrl() {
    return 'politique-confidentialite.html#s7';
  }

  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data?.version !== CONSENT_VERSION) return null;
      return data;
    } catch {
      return null;
    }
  }

  function writeConsent(analytics) {
    const data = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: !!analytics,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    applyConsent(data);
    hideBanner();
    closePreferences();
  }

  function loadAnalytics() {
    if (window.__entremeresAnalyticsLoaded) return;
    window.__entremeresAnalyticsLoaded = true;
    /* Point d'extension : Google Analytics, Plausible, etc. */
  }

  function applyConsent(consent) {
    if (consent?.analytics) loadAnalytics();
  }

  let bannerEl;
  let prefsDialog;
  let analyticsToggle;

  function hideBanner() {
    bannerEl?.classList.remove('cookie-banner--visible');
    bannerEl?.setAttribute('aria-hidden', 'true');
  }

  function showBanner() {
    bannerEl?.classList.add('cookie-banner--visible');
    bannerEl?.setAttribute('aria-hidden', 'false');
  }

  function openPreferences() {
    const consent = readConsent();
    if (analyticsToggle) analyticsToggle.checked = !!consent?.analytics;
    if (prefsDialog?.showModal) prefsDialog.showModal();
  }

  function closePreferences() {
    if (prefsDialog?.open) prefsDialog.close();
  }

  function buildUi() {
    bannerEl = document.createElement('div');
    bannerEl.className = 'cookie-banner';
    bannerEl.id = 'cookie-banner';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-live', 'polite');
    bannerEl.setAttribute('aria-label', 'Gestion des cookies');
    bannerEl.setAttribute('aria-hidden', 'true');
    bannerEl.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <p class="cookie-banner__title">Vos paramètres de confidentialité</p>
          <p class="cookie-banner__desc">
            EntreMeres TV utilise des cookies strictement nécessaires au fonctionnement du site (connexion, préférences).
            Avec votre accord, nous pouvons aussi utiliser des cookies de mesure d'audience pour améliorer nos services.
            <a href="${policyUrl()}">En savoir plus</a>
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-cookie-refuse>Tout refuser</button>
          <button type="button" class="btn btn--ghost btn--sm" data-cookie-customize>Personnaliser</button>
          <button type="button" class="btn btn--primary btn--sm" data-cookie-accept>Tout accepter</button>
        </div>
      </div>
    `;

    prefsDialog = document.createElement('dialog');
    prefsDialog.className = 'modal modal--cookies';
    prefsDialog.id = 'cookie-preferences';
    prefsDialog.setAttribute('aria-labelledby', 'cookie-prefs-title');
    prefsDialog.innerHTML = `
      <div class="modal__backdrop" data-close-cookie-prefs></div>
      <div class="modal__panel modal__panel--cookies">
        <button type="button" class="modal__close" data-close-cookie-prefs aria-label="Fermer">&times;</button>
        <h2 id="cookie-prefs-title" class="modal__title">Préférences cookies</h2>
        <p class="modal__text modal__text--left">Choisissez les cookies que vous autorisez. Les cookies nécessaires ne peuvent pas être désactivés.</p>
        <ul class="cookie-prefs">
          <li class="cookie-prefs__item cookie-prefs__item--locked">
            <div>
              <strong>Cookies nécessaires</strong>
              <span>Indispensables à la connexion et au bon fonctionnement du site.</span>
            </div>
            <span class="cookie-prefs__badge">Toujours actifs</span>
          </li>
          <li class="cookie-prefs__item">
            <label class="cookie-prefs__label">
              <span>
                <strong>Cookies de mesure d'audience</strong>
                <span>Nous aident à comprendre l'utilisation du site de manière anonyme.</span>
              </span>
              <input type="checkbox" id="cookie-analytics-toggle" />
            </label>
          </li>
        </ul>
        <div class="cookie-prefs__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-cookie-save-refuse>Tout refuser</button>
          <button type="button" class="btn btn--primary btn--sm" data-cookie-save>Enregistrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(bannerEl);
    document.body.appendChild(prefsDialog);

    analyticsToggle = document.getElementById('cookie-analytics-toggle');

    bannerEl.querySelector('[data-cookie-accept]')?.addEventListener('click', () => writeConsent(true));
    bannerEl.querySelector('[data-cookie-refuse]')?.addEventListener('click', () => writeConsent(false));
    bannerEl.querySelector('[data-cookie-customize]')?.addEventListener('click', openPreferences);

    prefsDialog.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
      writeConsent(analyticsToggle?.checked);
    });
    prefsDialog.querySelector('[data-cookie-save-refuse]')?.addEventListener('click', () => writeConsent(false));

    prefsDialog.querySelectorAll('[data-close-cookie-prefs]').forEach((el) => {
      el.addEventListener('click', closePreferences);
    });
    prefsDialog.addEventListener('click', (e) => {
      if (e.target === prefsDialog) closePreferences();
    });

    document.querySelectorAll('[data-open-cookie-prefs]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openPreferences();
      });
    });
  }

  buildUi();

  const existing = readConsent();
  if (existing) {
    applyConsent(existing);
  } else {
    showBanner();
  }

  window.EntreMeresCookies = {
    readConsent,
    openPreferences,
    resetConsent() {
      localStorage.removeItem(STORAGE_KEY);
      showBanner();
    },
  };
})();
