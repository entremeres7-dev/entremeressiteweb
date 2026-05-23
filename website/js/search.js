(function () {
  'use strict';

  const openBtn = document.getElementById('search-open-btn');
  const dialog = document.getElementById('site-search');
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const emptyEl = document.getElementById('search-empty');
  const hintEl = document.getElementById('search-hint');

  if (!openBtn || !dialog || !input || !resultsEl) return;

  const STATIC_ITEMS = [
    { title: 'Conditions Générales d\'Utilisation', meta: 'CGU EntreMeres', kind: 'page', target: 'cgu.html' },
    { title: 'Politique de confidentialité', meta: 'Données personnelles', kind: 'page', target: 'politique-confidentialite.html' },
    { title: 'Casting EntreMeres TV', meta: 'Candidatez aux émissions', kind: 'section', target: '#casting' },
    { title: 'Foire aux questions', meta: 'FAQ EntreMeres TV', kind: 'section', target: '#faq' },
    { title: 'Partenariats', meta: 'Sponsoring et collaborations', kind: 'page', target: 'partenariats.html' },
  ];

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function pickText(el, selectors) {
    for (const sel of selectors) {
      const node = el.querySelector(sel);
      if (node?.textContent?.trim()) return node.textContent.trim();
    }
    return '';
  }

  function buildIndex() {
    const items = [...STATIC_ITEMS];

    document.querySelectorAll('.spotlight__slide').forEach((slide) => {
      const title = pickText(slide, ['.spotlight__title']);
      if (!title) return;
      items.push({
        title,
        meta: pickText(slide, ['.spotlight__tags', '.spotlight__hook']),
        kind: 'programme',
        element: slide,
        action: 'watch',
      });
    });

    document.querySelectorAll('.top5-card').forEach((card) => {
      const title = pickText(card, ['.poster__label']);
      if (!title) return;
      items.push({ title, meta: 'TOP 5', kind: 'programme', element: card, action: 'watch' });
    });

    document.querySelectorAll('.card').forEach((card) => {
      const title = pickText(card, ['.card__title']);
      if (!title) return;
      items.push({ title, meta: 'Série', kind: 'programme', element: card, action: 'watch' });
    });

    document.querySelectorAll('.clip-card').forEach((card) => {
      const title = pickText(card, ['.clip-card__title']);
      if (!title) return;
      items.push({
        title,
        meta: pickText(card, ['.clip-card__show']) || 'Clip',
        kind: 'clip',
        element: card,
        action: 'watch',
      });
    });

    document.querySelectorAll('.casting-card').forEach((card) => {
      const titleNode = card.querySelector('.casting-card__title');
      const title = titleNode?.textContent.trim();
      if (!title) return;
      items.push({
        title: title.replace(/^🤱\s*/, ''),
        meta: 'Casting',
        kind: 'casting',
        target: '#casting',
        show: card.querySelector('.casting-card__cta')?.dataset.show || title.replace(/^🤱\s*/, ''),
      });
    });

    document.querySelectorAll('.faq__item summary').forEach((node) => {
      const title = node.textContent.trim();
      if (!title) return;
      items.push({ title, meta: 'FAQ', kind: 'section', target: '#faq' });
    });

    return items;
  }

  const index = buildIndex();
  let activeIndex = -1;

  function openWatchModal() {
    const watchModal = document.getElementById('watch-soon');
    if (watchModal?.showModal) watchModal.showModal();
  }

  function navigate(item) {
    closeSearch();

    if (item.target && !item.element) {
      if (item.kind === 'page') {
        window.location.href = item.target;
        return;
      }
      if (item.kind === 'casting' && item.show) {
        const select = document.getElementById('casting-show-select');
        if (select) select.value = item.show;
      }
      document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (item.element) {
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (item.action === 'watch') {
        setTimeout(openWatchModal, 350);
      }
      return;
    }
  }

  function scoreItem(item, query) {
    const haystack = normalize([item.title, item.meta, item.kind].join(' '));
    if (!haystack.includes(query)) return 0;
    const titleNorm = normalize(item.title);
    if (titleNorm.startsWith(query)) return 3;
    if (titleNorm.includes(query)) return 2;
    return 1;
  }

  function renderResults(query) {
    resultsEl.innerHTML = '';
    activeIndex = -1;

    const q = normalize(query);
    if (!q) {
      emptyEl.hidden = true;
      hintEl.hidden = false;
      return;
    }

    hintEl.hidden = true;
    const matches = index
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'fr'))
      .slice(0, 12);

    if (!matches.length) {
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    const seen = new Set();
    const unique = matches.filter(({ item }) => {
      const key = normalize(item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.forEach(({ item }, i) => {
      const li = document.createElement('li');
      li.className = 'search-results__item';
      li.setAttribute('role', 'option');
      li.innerHTML = `
        <span class="search-results__title">${item.title}</span>
        <span class="search-results__meta">${item.meta || ''}</span>
      `;
      li.addEventListener('click', () => navigate(item));
      li.addEventListener('mouseenter', () => setActive(i));
      resultsEl.appendChild(li);
    });
  }

  function setActive(next) {
    const items = resultsEl.querySelectorAll('.search-results__item');
    items.forEach((el, i) => el.classList.toggle('search-results__item--active', i === next));
    activeIndex = next;
    if (items[next]) items[next].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    if (dialog.showModal) dialog.showModal();
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    if (dialog.open) dialog.close();
  }

  openBtn.addEventListener('click', openSearch);
  document.querySelectorAll('[data-close-search]').forEach((el) => {
    el.addEventListener('click', closeSearch);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeSearch();
  });

  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', (e) => {
    const items = resultsEl.querySelectorAll('.search-results__item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      items[activeIndex].click();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
})();
