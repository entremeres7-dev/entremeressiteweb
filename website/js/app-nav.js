(function () {
  'use strict';

  const GAMIFICATION_TIERS = [
    { level: 1, title: 'Nouvelle maman', emoji: '🌱', min: 0, max: 100 },
    { level: 2, title: 'Maman active', emoji: '🌸', min: 100, max: 500 },
    { level: 3, title: 'Maman pilier', emoji: '👑', min: 500, max: 1500 },
    { level: 4, title: 'Ambassadrice EntreMeres', emoji: '💎', min: 1500, max: null },
  ];

  function computeGamificationProgress(coeurs) {
    const safe = Math.max(0, Number(coeurs) || 0);
    let tier = GAMIFICATION_TIERS[0];
    for (const t of GAMIFICATION_TIERS) {
      if (safe >= t.min) tier = t;
    }
    const tierIndex = GAMIFICATION_TIERS.findIndex((t) => t.level === tier.level);
    const nextTier = tierIndex < GAMIFICATION_TIERS.length - 1 ? GAMIFICATION_TIERS[tierIndex + 1] : null;
    const tierSpan = nextTier ? nextTier.min - tier.min : 1;
    const inTier = safe - tier.min;
    const progressInTier = nextTier ? Math.min(1, Math.max(0, inTier / tierSpan)) : 1;
    return { coeurs: safe, tier, nextTier, progressInTier };
  }

  function formatCoeurs(value) {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  function bindAppLinks() {
    document.querySelectorAll('[data-app-route]').forEach((el) => {
      const route = el.getAttribute('data-app-route');
      if (route && window.EntreMeresApp?.route) {
        el.setAttribute('href', EntreMeresApp.route(route));
      }
    });
  }

  function renderGamificationPreview(container, profile) {
    if (!container || !profile) return;

    const progress = computeGamificationProgress(profile.coeurs);
    const pct = Math.round(progress.progressInTier * 100);

    container.innerHTML = `
      <div class="gamif-preview__head">
        <span class="gamif-preview__emoji">${progress.tier.emoji}</span>
        <div>
          <p class="gamif-preview__tier">${progress.tier.title}</p>
          <p class="gamif-preview__coeurs">${formatCoeurs(progress.coeurs)} cœurs</p>
        </div>
      </div>
      <div class="gamif-preview__bar" aria-hidden="true">
        <span class="gamif-preview__fill" style="width:${pct}%"></span>
      </div>
      <p class="gamif-preview__hint">${
        progress.nextTier
          ? `${formatCoeurs(progress.nextTier.min - progress.coeurs)} cœurs avant « ${progress.nextTier.title} »`
          : 'Vous avez atteint le palier maximum 💎'
      }</p>
    `;
  }

  bindAppLinks();
  document.addEventListener('DOMContentLoaded', bindAppLinks);

  window.EntreMeresGamification = {
    computeGamificationProgress,
    formatCoeurs,
    renderGamificationPreview,
    bindAppLinks,
  };
})();
