(function () {
  'use strict';

  const data = window.EntreMeresProfileSetupData;
  if (!data) {
    console.error('EntreMeresProfileSetupData manquant');
    return;
  }

  let selectedCountry = 'France';
  let selectedChildren = null;
  let photoFile = null;

  const errorEl = document.getElementById('profile-setup-error');
  const form = document.getElementById('profile-setup-form');
  const submitBtn = document.getElementById('profile-setup-submit');
  const photoInput = document.getElementById('profile-photo-input');
  const photoBtn = document.getElementById('profile-photo-btn');
  const photoPreview = document.getElementById('profile-photo-preview');
  const photoPlaceholder = document.getElementById('profile-photo-placeholder');
  const countryChipsEl = document.getElementById('profile-country-chips');
  const childrenChipsEl = document.getElementById('profile-children-chips');
  const regionSelect = document.getElementById('profile-region');
  const usernameEl = document.getElementById('profile-setup-username');

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }

  function hideError() {
    errorEl?.classList.remove('is-visible');
  }

  function renderChips(container, items, selected, onSelect, compact) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-chip' + (compact ? ' profile-chip--compact' : '');
      if (item === selected) btn.classList.add('is-active');
      btn.textContent = item;
      btn.addEventListener('click', () => onSelect(item));
      container.appendChild(btn);
    });
  }

  function fillRegions(country) {
    if (!regionSelect) return;
    const regions = data.REGIONS_BY_COUNTRY[country] || data.REGIONS_BY_COUNTRY.Autre || [];
    regionSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = regions.length ? 'Sélectionnez votre région' : 'Aucune région disponible';
    regionSelect.appendChild(placeholder);
    regions.forEach((region) => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
    regionSelect.disabled = regions.length === 0;
  }

  function setCountry(country) {
    selectedCountry = country;
    renderChips(countryChipsEl, data.PROFILE_COUNTRIES, selectedCountry, setCountry, false);
    fillRegions(country);
  }

  function setChildren(value) {
    selectedChildren = value;
    renderChips(childrenChipsEl, data.CHILDREN_OPTIONS, selectedChildren, setChildren, true);
  }

  function setPhotoPreview(file) {
    photoFile = file;
    if (!file) {
      photoPreview.hidden = true;
      photoPreview.removeAttribute('src');
      photoPlaceholder.hidden = false;
      return;
    }
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
    photoPlaceholder.hidden = true;
  }

  photoBtn?.addEventListener('click', () => photoInput?.click());

  photoInput?.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      showError('Choisissez une image (JPG, PNG ou WebP).');
      photoInput.value = '';
      setPhotoPreview(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showError('La photo ne doit pas dépasser 8 Mo.');
      photoInput.value = '';
      setPhotoPreview(null);
      return;
    }
    hideError();
    setPhotoPreview(file);
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    if (!photoFile) {
      showError('Ajoutez une photo pour continuer.');
      return;
    }
    if (!selectedCountry) {
      showError('Sélectionnez votre pays.');
      return;
    }
    const region = regionSelect?.value?.trim();
    if (!region) {
      showError('Sélectionnez votre région.');
      return;
    }
    const age = parseInt(form.age.value, 10);
    if (!Number.isFinite(age) || age < data.MIN_MOM_AGE || age > data.MAX_MOM_AGE) {
      showError(`Indiquez un âge entre ${data.MIN_MOM_AGE} et ${data.MAX_MOM_AGE} ans.`);
      return;
    }
    if (!selectedChildren) {
      showError('Indiquez le nombre d’enfants.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enregistrement…';

    try {
      await EntreMeresAuth.saveProfileSetup({
        photoFile,
        country: selectedCountry,
        region,
        age,
        children: selectedChildren,
      });
      window.location.href = 'compte.html';
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Enregistrement impossible.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'C’est parti';
    }
  });

  (async function init() {
    const session = await EntreMeresAuth.getSession();
    if (!session) {
      window.location.replace('login.html?redirect=completer-profil.html');
      return;
    }

    const complete = await EntreMeresAuth.isCurrentProfileComplete();
    if (complete) {
      window.location.replace('compte.html');
      return;
    }

    const { profile } = await EntreMeresAuth.getCurrentProfile();
    const username =
      profile?.username?.trim() ||
      session.user.user_metadata?.username?.trim() ||
      session.user.email?.split('@')[0] ||
      'Maman';
    if (usernameEl) usernameEl.textContent = '@' + username;

    setCountry('France');
    setChildren(null);
  })();
})();
