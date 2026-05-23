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
      .select('id, username, email, photo, coeurs')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
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
    renderAvatar,
    getAvatarInitial,
    onAuthStateChange: (cb) => client.auth.onAuthStateChange(cb),
    ready,
  };
})(window);
