(function () {
  'use strict';

  const CASTING_EMAIL = 'contact@entremeres.fr';

  const AVAILABILITY_LABELS = {
    semaine: 'En semaine',
    weekend: 'Le week-end',
    flexible: 'Flexible',
  };

  function readCastingFormData(form) {
    const fd = new FormData(form);
    return {
      show: String(fd.get('show') || '').trim(),
      firstname: String(fd.get('firstname') || '').trim(),
      lastname: String(fd.get('lastname') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      city: String(fd.get('city') || '').trim(),
      age: Number(fd.get('age')),
      children: Number(fd.get('children')),
      availability: String(fd.get('availability') || '').trim(),
      motivation: String(fd.get('motivation') || '').trim(),
    };
  }

  function setFormStatus(el, message, type) {
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || '';
    el.classList.remove('casting-form__status--success', 'casting-form__status--error');
    if (type) el.classList.add(`casting-form__status--${type}`);
  }

  async function saveCastingToSupabase(data) {
    const client = window.EntreMeresAuth?.client;
    if (!client) return;

    const { error } = await client.from('casting_applications').insert({
      show_name: data.show,
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      phone: data.phone,
      city: data.city,
      age: data.age,
      children_count: data.children,
      availability: data.availability,
      motivation: data.motivation,
    });

    if (error) throw new Error(error.message);
  }

  async function sendCastingEmail(data) {
    const availabilityLabel = AVAILABILITY_LABELS[data.availability] || data.availability;
    const payload = new FormData();
    payload.append('_subject', `[Casting EntreMeres TV] ${data.show} — ${data.firstname} ${data.lastname}`);
    payload.append('_captcha', 'false');
    payload.append('_template', 'table');
    payload.append('_replyto', data.email);
    payload.append('Émission', data.show);
    payload.append('Prénom', data.firstname);
    payload.append('Nom', data.lastname);
    payload.append('E-mail', data.email);
    payload.append('Téléphone', data.phone);
    payload.append('Ville', data.city);
    payload.append('Âge', String(data.age));
    payload.append('Nombre d\'enfants', String(data.children));
    payload.append('Disponibilités', availabilityLabel);
    payload.append('Motivation', data.motivation);

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CASTING_EMAIL)}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: payload,
    });

    let result = null;
    try {
      result = await response.json();
    } catch {
      /* ignore */
    }

    if (!response.ok || result?.success === false) {
      throw new Error(result?.message || 'Impossible d\'envoyer la candidature pour le moment.');
    }
  }

  const castingForm = document.getElementById('casting-form-el');
  const statusEl = document.getElementById('casting-form-status');

  castingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = readCastingFormData(castingForm);
    const submitBtn = castingForm.querySelector('button[type="submit"]');
    const defaultLabel = submitBtn?.textContent || 'Envoyer ma candidature';

    setFormStatus(statusEl, '', null);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    try {
      await sendCastingEmail(data);
      try {
        await saveCastingToSupabase(data);
      } catch (err) {
        console.warn('Archivage Supabase indisponible :', err);
      }

      setFormStatus(
        statusEl,
        `Merci ! Votre candidature pour « ${data.show} » a bien été envoyée. Vous serez recontactée si votre profil est retenu.`,
        'success',
      );
      castingForm.reset();
    } catch (err) {
      setFormStatus(
        statusEl,
        err?.message
          ? `${err.message} Vous pouvez aussi nous écrire à ${CASTING_EMAIL}.`
          : `Une erreur est survenue. Réessayez ou écrivez-nous à ${CASTING_EMAIL}.`,
        'error',
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    }
  });
})();
