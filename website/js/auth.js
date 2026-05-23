(function (global) {
  'use strict';

  if (!global.supabase || !global.SUPABASE_URL || !global.SUPABASE_ANON_KEY) {
    console.error('Supabase non configuré. Lancez: node website/scripts/generate-config.js');
    global.EntreMeresAuth = { ready: Promise.reject(new Error('Supabase non configuré')) };
    return;
  }

  const client = global.supabase.createClient(global.SUPABASE_URL, global.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  function normalizeUsername(raw) {
    const cleaned = String(raw || '').trim().replace(/\s+/g, '_').slice(0, 24);
    return cleaned || 'Maman';
  }

  async function isUsernameFree(name, userId) {
    const { data, error } = await client.from('profiles').select('id').eq('username', name).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return true;
    return data.id === userId;
  }

  async function resolveAvailableUsername(desired, userId) {
    const base = normalizeUsername(desired);
    if (await isUsernameFree(base, userId)) return base;

    const shortId = userId.replace(/-/g, '').slice(0, 6);
    const withId = `${base}_${shortId}`;
    if (await isUsernameFree(withId, userId)) return withId;

    for (let n = 2; n < 100; n++) {
      const candidate = `${base}${n}`;
      if (await isUsernameFree(candidate, userId)) return candidate;
    }
    return `maman_${shortId}`;
  }

  async function isUsernameTakenByOther(username, userId) {
    const name = normalizeUsername(username);
    const { data, error } = await client.from('profiles').select('id').eq('username', name).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return false;
    return userId ? data.id !== userId : true;
  }

  async function ensureUserProfile(userId) {
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) return null;

    const user = authData.user;
    const desiredUsername = normalizeUsername(user.user_metadata?.username);
    const email = user.email ?? null;

    const { data: existing, error: readError } = await client
      .from('profiles')
      .select('id, username, email, photo, coeurs')
      .eq('id', userId)
      .maybeSingle();

    if (readError) throw new Error(readError.message);

    if (existing) {
      const patch = {};
      if (!existing.username?.trim()) patch.username = await resolveAvailableUsername(desiredUsername, userId);
      if (!existing.email?.trim() && email) patch.email = email;
      if (Object.keys(patch).length) {
        const { error } = await client.from('profiles').update(patch).eq('id', userId);
        if (error) throw new Error(error.message);
      }
      return { ...existing, ...patch };
    }

    const username = await resolveAvailableUsername(desiredUsername, userId);
    const { error: insertError } = await client.from('profiles').insert({ id: userId, username, email });
    if (insertError) throw new Error(insertError.message);
    return { id: userId, username, email, photo: null };
  }

  async function fetchProfile(userId) {
    const { data, error } = await client
      .from('profiles')
      .select('id, username, email, photo, coeurs, country, region, age, children')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  function isProfileSetupComplete(row) {
    if (!row) return false;
    return !!(
      row.username?.trim() &&
      row.photo?.trim() &&
      row.country?.trim() &&
      row.region?.trim() &&
      row.age != null &&
      row.age >= 16 &&
      row.children?.trim()
    );
  }

  async function isCurrentProfileComplete() {
    const session = await getSession();
    if (!session?.user) return false;
    try {
      await ensureUserProfile(session.user.id);
    } catch {
      /* continue */
    }
    const profile = await fetchProfile(session.user.id);
    return isProfileSetupComplete(profile);
  }

  async function getPostAuthRedirect(fallback) {
    const complete = await isCurrentProfileComplete();
    if (!complete) return 'completer-profil.html';
    return fallback || 'compte.html';
  }

  function compressPhotoFile(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Impossible de traiter la photo.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Compression de la photo impossible.'));
              return;
            }
            resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.85,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Fichier image invalide.'));
      };
      img.src = objectUrl;
    });
  }

  async function uploadProfilePhoto(userId, file) {
    const compressed = await compressPhotoFile(file);
    const storagePath = `${userId}_quiz_avatar_${Date.now()}.jpeg`;
    const { error } = await client.storage.from('profiles').upload(storagePath, compressed, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (error) throw new Error(error.message || 'Échec de l’envoi de la photo.');
    const { data } = client.storage.from('profiles').getPublicUrl(storagePath);
    if (!data?.publicUrl) throw new Error('URL de photo introuvable.');
    return data.publicUrl;
  }

  async function saveProfileSetup(input) {
    const session = await getSession();
    if (!session?.user) throw new Error('Session expirée. Reconnectez-vous.');

    const userId = session.user.id;
    await ensureUserProfile(userId);

    if (!input.photoFile) throw new Error('Ajoutez une photo pour continuer.');

    const country = String(input.country || '').trim();
    const region = String(input.region || '').trim();
    const age = parseInt(String(input.age), 10);
    const children = String(input.children || '').trim();

    if (!country) throw new Error('Sélectionnez votre pays.');
    if (!region) throw new Error('Sélectionnez votre région.');
    if (!Number.isFinite(age) || age < 16 || age > 70) {
      throw new Error('Indiquez un âge entre 16 et 70 ans.');
    }
    if (!children) throw new Error('Indiquez le nombre d’enfants.');

    const photoUrl = await uploadProfilePhoto(userId, input.photoFile);
    const username = await resolveAvailableUsername(session.user.user_metadata?.username || 'Maman', userId);

    const { error } = await client.from('profiles').upsert(
      {
        id: userId,
        username,
        email: session.user.email ?? null,
        photo: photoUrl,
        country,
        region,
        age,
        children,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

    if (error) throw new Error(error.message || 'Impossible d’enregistrer le profil.');
    return { photoUrl, username };
  }

  async function signIn(email, password) {
    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { error: error.message, session: null };
    const { data } = await client.auth.getSession();
    if (data.session?.user) await ensureUserProfile(data.session.user.id);
    return { error: null, session: data.session };
  }

  async function signUp(email, password, username) {
    const trimmedEmail = email.trim();
    const trimmedUsername = normalizeUsername(username);

    const taken = await isUsernameTakenByOther(trimmedUsername);
    if (taken) {
      return { error: 'Ce pseudo est déjà pris. Choisissez-en un autre.', signedIn: false, session: null };
    }

    const { data, error } = await client.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { username: trimmedUsername } },
    });

    if (error) return { error: error.message, signedIn: false, session: null };

    let userId = data.session?.user?.id ?? data.user?.id;

    if (!userId) {
      const retry = await client.auth.signInWithPassword({ email: trimmedEmail, password });
      if (retry.error) {
        const msg = retry.error.message.toLowerCase();
        if (msg.includes('confirm') || msg.includes('vérifi') || msg.includes('verif')) {
          return {
            error: 'Confirmez votre e-mail avant de vous connecter, ou désactivez la confirmation dans Supabase.',
            signedIn: false,
            session: null,
          };
        }
        return { error: retry.error.message, signedIn: false, session: null };
      }
      userId = retry.data.session?.user?.id ?? retry.data.user?.id;
      await ensureUserProfile(userId);
      return { error: null, signedIn: true, session: retry.data.session };
    }

    await ensureUserProfile(userId);
    return { error: null, signedIn: true, session: data.session };
  }

  async function signOut() {
    await client.auth.signOut();
  }

  async function getSession() {
    const { data } = await client.auth.getSession();
    return data.session;
  }

  async function getCurrentProfile() {
    const session = await getSession();
    if (!session?.user) return { session: null, profile: null };
    let profile = await fetchProfile(session.user.id);
    if (!profile) profile = await ensureUserProfile(session.user.id);
    return { session, profile };
  }

  function getAvatarInitial(profile, session) {
    const source =
      profile?.username?.trim() ||
      session?.user?.email?.split('@')[0] ||
      'M';
    return source.charAt(0).toUpperCase();
  }

  function renderAvatar(container, profile, session) {
    if (!container) return;

    const photo = profile?.photo?.trim() || '';
    const initial = getAvatarInitial(profile, session);

    container.textContent = '';

    if (photo) {
      const img = document.createElement('img');
      img.src = photo;
      img.alt = 'Photo de profil';
      img.className = 'auth-user__avatar-img';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', () => {
        container.textContent = '';
        const fallback = document.createElement('span');
        fallback.className = 'auth-user__avatar-initial';
        fallback.textContent = initial;
        container.appendChild(fallback);
      }, { once: true });
      container.appendChild(img);
      return;
    }

    const fallback = document.createElement('span');
    fallback.className = 'auth-user__avatar-initial';
    fallback.textContent = initial;
    container.appendChild(fallback);
  }

  let resolveReady;
  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });

  function finishReady(session) {
    if (!resolveReady) return;
    const done = resolveReady;
    resolveReady = null;
    done(session ?? null);
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') {
      finishReady(session);
    }
  });

  client.auth.getSession().then(({ data }) => {
    finishReady(data.session);
  });

  global.EntreMeresAuth = {
    client,
    signIn,
    signUp,
    signOut,
    getSession,
    getCurrentProfile,
    isProfileSetupComplete,
    isCurrentProfileComplete,
    getPostAuthRedirect,
    saveProfileSetup,
    renderAvatar,
    getAvatarInitial,
    onAuthStateChange: (cb) => client.auth.onAuthStateChange(cb),
    ready,
  };
})(window);
