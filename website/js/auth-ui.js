(function () {
  'use strict';

  const authGuest = document.getElementById('auth-guest');
  const authUser = document.getElementById('auth-user');
  const authUsername = document.getElementById('auth-username');
  const authAvatar = document.getElementById('auth-avatar');
  const logoutBtn = document.getElementById('auth-logout');

  function applyHeaderState(session, profile) {
    const loggedIn = !!session?.user;

    if (authGuest) authGuest.hidden = loggedIn;
    if (authUser) authUser.hidden = !loggedIn;

    if (authUsername) {
      if (profile?.username) {
        authUsername.textContent = profile.username;
      } else if (session?.user?.email) {
        authUsername.textContent = session.user.email.split('@')[0];
      }
    }

    if (loggedIn && authAvatar && window.EntreMeresAuth?.renderAvatar) {
      EntreMeresAuth.renderAvatar(authAvatar, profile, session);
    }

    document.body.classList.toggle('is-logged-in', loggedIn);

    if (window.EntreMeresGamification?.bindAppLinks) {
      EntreMeresGamification.bindAppLinks();
    }
  }

  async function refreshHeader(knownSession) {
    if (!window.EntreMeresAuth?.getSession) return;

    try {
      const session =
        knownSession !== undefined ? knownSession : await EntreMeresAuth.getSession();

      applyHeaderState(session, null);

      if (!session?.user) return;

      try {
        const { profile } = await EntreMeresAuth.getCurrentProfile();
        applyHeaderState(session, profile);
      } catch (profileError) {
        console.warn('Profil non chargé, session conservée', profileError);
      }
    } catch (e) {
      console.error(e);
    }
  }

  logoutBtn?.addEventListener('click', async () => {
    await EntreMeresAuth.signOut();
    window.location.href = 'index.html';
  });

  if (window.EntreMeresAuth) {
    EntreMeresAuth.ready.then((session) => {
      refreshHeader(session);
    });
    EntreMeresAuth.onAuthStateChange((_event, session) => {
      refreshHeader(session);
    });
  }

  window.EntreMeresAuthUI = { refreshHeader };
})();
