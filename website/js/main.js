(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const spotlight = document.querySelector('.spotlight');
  const modal = document.getElementById('connexion');
  const langSelects = document.querySelectorAll('.lang-select select');

  /* Header solid on scroll */
  if (header) {
    const onScroll = () => {
      header.classList.toggle('site-header--solid', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  const burger = document.querySelector('.burger');
  const mainNav = document.querySelector('.main-nav');
  if (burger && mainNav) {
    burger.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* Dropdown "Plus" */
  const moreBtn = document.querySelector('.main-nav__link--more');
  const moreMenu = document.querySelector('.main-nav__menu');
  if (moreBtn && moreMenu) {
    moreBtn.addEventListener('click', () => {
      const open = moreMenu.hasAttribute('hidden');
      moreMenu.toggleAttribute('hidden', !open);
      moreBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
        moreMenu.setAttribute('hidden', '');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Spotlight carousel */
  const slides = Array.from(document.querySelectorAll('.spotlight__slide'));
  const dots = Array.from(document.querySelectorAll('.spotlight__dot'));
  const prevBtn = document.querySelector('.spotlight__arrow--prev');
  const nextBtn = document.querySelector('.spotlight__arrow--next');
  const pauseBtn = document.querySelector('.spotlight__pause');
  let current = 0;
  let autoplay = true;
  let timer = null;

  function goTo(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('spotlight__slide--active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('spotlight__dot--active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    if (!autoplay) return;
    timer = setInterval(next, 6000);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (slides.length) {
    prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.goto));
        startAutoplay();
      });
    });
    pauseBtn?.addEventListener('click', () => {
      autoplay = !autoplay;
      pauseBtn.textContent = autoplay ? '⏸' : '▶';
      pauseBtn.setAttribute('aria-label', autoplay ? 'Mettre en pause' : 'Reprendre');
      if (autoplay) startAutoplay();
      else stopAutoplay();
    });
    startAutoplay();
  }

  /* Row scroll buttons TF1-style */
  document.querySelectorAll('[data-row]').forEach((row) => {
    const track = row.querySelector('.row-scroll__track');
    const prev = row.querySelector('.row-scroll__btn--prev');
    const next = row.querySelector('.row-scroll__btn--next');
    if (!track || !prev || !next) return;

    const scrollAmount = () => track.clientWidth * 0.75;

    const updateButtons = () => {
      prev.hidden = track.scrollLeft <= 4;
      next.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
  });

  /* Sync language selects — conservé si d'autres pages réintroduisent un select */
  langSelects.forEach((select) => {
    select.addEventListener('change', () => {
      langSelects.forEach((s) => { s.value = select.value; });
    });
  });

  /* Boutons Regarder → disponible le 1er septembre */
  const watchModal = document.getElementById('watch-soon');
  function openWatchModal() {
    if (watchModal?.showModal) watchModal.showModal();
    else alert('Disponible le 1er septembre');
  }
  function closeWatchModal() {
    if (watchModal?.open) watchModal.close();
  }
  document.querySelectorAll('.btn--play').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openWatchModal();
    });
  });

  /* Clic sur une affiche / vidéo du catalogue → modal septembre */
  document.querySelector('.catalog')?.addEventListener('click', (e) => {
    const card = e.target.closest('.top5-card, .clip-card, .card--landscape, .card--portrait');
    if (!card) return;
    e.preventDefault();
    openWatchModal();
  });

  document.querySelectorAll('.spotlight__slide').forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      e.preventDefault();
      openWatchModal();
    });
  });
  document.querySelectorAll('[data-close-watch]').forEach((el) => {
    el.addEventListener('click', closeWatchModal);
  });
  watchModal?.addEventListener('click', (e) => {
    if (e.target === watchModal) closeWatchModal();
  });

  /* Login modal */
  function openModal() {
    if (modal?.showModal) modal.showModal();
  }
  function closeModal() {
    if (modal?.open) modal.close();
  }

  document.querySelectorAll('a[href="#connexion"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const loginErrorEl = document.getElementById('login-error');

  /* Email forms → page inscription avec e-mail prérempli */
  document.querySelectorAll('.email-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value?.trim();
      if (!email) return;
      window.location.href = `signup.html?${new URLSearchParams({ email })}`;
    });
  });

  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.EntreMeresAuth) return;

    const email = loginForm.querySelector('input[type="email"]')?.value?.trim();
    const password = loginForm.querySelector('input[type="password"]')?.value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Connexion…';
    }

    const { error } = await EntreMeresAuth.signIn(email, password);

    if (error) {
      if (loginErrorEl) {
        loginErrorEl.textContent = error;
        loginErrorEl.hidden = false;
      } else {
        alert(error);
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "S'identifier";
      }
      return;
    }

    closeModal();
    const target = await EntreMeresAuth.getPostAuthRedirect('compte.html');
    window.location.href = target;
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      const parent = item.closest('.casting__faq, .faq');
      if (!parent) return;
      parent.querySelectorAll('.faq__item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Casting filters */
  const castingFilters = document.querySelectorAll('.casting__filter');
  const castingCards = document.querySelectorAll('.casting-card[data-status]');
  castingFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      castingFilters.forEach((b) => {
        b.classList.toggle('casting__filter--active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      castingCards.forEach((card) => {
        const status = card.dataset.status;
        const show = filter === 'all' || (filter === 'open' && status === 'open') || (filter === 'closed' && status === 'closed');
        card.hidden = !show;
      });
    });
  });

  /* Casting postuler buttons → scroll to form + pre-select show */
  const castingShowSelect = document.getElementById('casting-show-select');
  document.querySelectorAll('.casting-card__cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      const show = btn.dataset.show;
      if (castingShowSelect && show) castingShowSelect.value = show;
      document.getElementById('casting-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
