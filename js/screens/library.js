/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/library.js
   Exercise browser: filter by category/muscle,
   tap to open detail with SVG body map
   ═══════════════════════════════════════════════ */

import { EXERCISES, CATEGORIES }  from '../data/exercises.js';
import { bodyMapSVG }              from '../data/svgs.js';

// ── State ─────────────────────────────────────────────────
let activeCategory = 'all';
let searchQuery    = '';

// ── Equipment labels (short) ──────────────────────────────
const EQUIP_LABELS = {
  halteres_5kg:        'Halt. 5 kg',
  halteres_modulables: 'Halt. modulables',
  hand_grip:           'Hand grip',
  elastique:           'Élastique',
  veste_lestee:        'Veste lestée',
  tapis:               'Tapis',
};

const DIFFICULTY_LABEL = ['', 'Facile', 'Intermédiaire', 'Difficile'];
const DIFFICULTY_COLOR = ['', 'var(--success)', 'var(--warning)', 'var(--accent)'];

// ── Filter exercises ──────────────────────────────────────
function filterExercises() {
  return EXERCISES.filter(ex => {
    const matchCat = activeCategory === 'all' || ex.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q
      || ex.name.toLowerCase().includes(q)
      || ex.musclesLabel.some(m => m.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
}

// ── Render category filter bar ────────────────────────────
function renderCategoryBar() {
  const all = { id: 'all', label: 'Tous', emoji: '⚡' };
  const cats = [all, ...CATEGORIES];

  return `
    <div class="library-filter-bar">
      ${cats.map(c => `
        <div class="lib-cat-chip ${activeCategory === c.id ? 'selected' : ''}" data-cat="${c.id}">
          <span>${c.emoji}</span> ${c.label}
        </div>
      `).join('')}
    </div>
  `;
}

// ── Render a single exercise card ─────────────────────────
function renderExerciseCard(ex) {
  const equipText = ex.equipment.length
    ? ex.equipment.map(e => EQUIP_LABELS[e] || e).join(', ')
    : 'Poids du corps';

  const diffColor = DIFFICULTY_COLOR[ex.difficulty] || 'var(--text-tertiary)';

  return `
    <div class="lib-exercise-card" data-ex-id="${ex.id}">
      <div class="lib-ex-left">
        <div class="lib-ex-name">${ex.name}</div>
        <div class="lib-ex-muscles">${ex.musclesLabel.join(' · ')}</div>
        <div class="lib-ex-meta">
          <span class="lib-ex-equip">${equipText}</span>
          <span class="lib-ex-dot">·</span>
          <span style="color:${diffColor};font-weight:600;">${DIFFICULTY_LABEL[ex.difficulty]}</span>
        </div>
      </div>
      <div class="lib-ex-arrow">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="var(--text-tertiary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `;
}

// ── Render exercise list ──────────────────────────────────
function renderExerciseList(container) {
  const exercises = filterExercises();
  const listEl = container.querySelector('#lib-exercise-list');
  if (!listEl) return;

  if (!exercises.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="22" cy="22" r="14" stroke="currentColor" stroke-width="2"/>
          <path d="M32 32l8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <p>Aucun exercice trouvé</p>
      </div>`;
    return;
  }

  listEl.innerHTML = `
    <div class="lib-count">${exercises.length} exercice${exercises.length > 1 ? 's' : ''}</div>
    ${exercises.map(renderExerciseCard).join('')}
    <div style="height:var(--space-8);"></div>
  `;

  // Bind tap events
  listEl.querySelectorAll('.lib-exercise-card').forEach(card => {
    card.addEventListener('click', () => {
      const ex = EXERCISES.find(e => e.id === card.dataset.exId);
      if (ex) openDetail(ex);
    });
  });
}

// ── Detail modal ──────────────────────────────────────────
function openDetail(ex) {
  // Remove existing modal
  document.getElementById('lib-detail-modal')?.remove();

  const equipText = ex.equipment.length
    ? ex.equipment.map(e => EQUIP_LABELS[e] || e).join(', ')
    : 'Poids du corps';

  const sets = ex.isTimeBased
    ? `${ex.defaultSets} × ${ex.defaultDuration}s`
    : `${ex.defaultSets} × ${ex.defaultReps} reps`;

  const weight = ex.defaultWeight > 0 ? `${ex.defaultWeight} kg` : 'Poids du corps';
  const rest   = `${ex.restSeconds}s repos`;
  const diff   = DIFFICULTY_LABEL[ex.difficulty];
  const diffColor = DIFFICULTY_COLOR[ex.difficulty];

  const svgMarkup = bodyMapSVG(ex.muscles);

  const modal = document.createElement('div');
  modal.id = 'lib-detail-modal';
  modal.className = 'lib-detail-overlay';
  modal.innerHTML = `
    <div class="lib-detail-sheet">
      <!-- Handle -->
      <div class="lib-detail-handle"></div>

      <!-- Header -->
      <div class="lib-detail-header">
        <div>
          <div class="lib-detail-category">${CATEGORIES.find(c=>c.id===ex.category)?.emoji || ''} ${CATEGORIES.find(c=>c.id===ex.category)?.label || ex.category}</div>
          <div class="lib-detail-title">${ex.name}</div>
        </div>
        <button class="btn-icon" id="lib-detail-close" aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Body map SVG -->
      <div class="lib-detail-svg-wrap">
        ${svgMarkup}
      </div>

      <!-- Muscles targeted -->
      <div class="lib-detail-muscles">
        ${ex.musclesLabel.map(m => `<span class="badge badge-accent">${m}</span>`).join('')}
      </div>

      <!-- Quick stats -->
      <div class="lib-detail-stats">
        <div class="lib-detail-stat">
          <div class="lib-detail-stat-val">${sets}</div>
          <div class="lib-detail-stat-label">Séries</div>
        </div>
        <div class="lib-detail-stat">
          <div class="lib-detail-stat-val">${weight}</div>
          <div class="lib-detail-stat-label">Charge</div>
        </div>
        <div class="lib-detail-stat">
          <div class="lib-detail-stat-val">${rest}</div>
          <div class="lib-detail-stat-label">Repos</div>
        </div>
        <div class="lib-detail-stat">
          <div class="lib-detail-stat-val" style="color:${diffColor};">${diff}</div>
          <div class="lib-detail-stat-label">Difficulté</div>
        </div>
      </div>

      <!-- Equipment -->
      <div class="lib-detail-section-title">Équipement</div>
      <div class="lib-detail-equip">${equipText}</div>

      <!-- Instructions -->
      <div class="lib-detail-section-title">Instructions</div>
      <div class="lib-detail-instructions">${ex.instructions}</div>

      <div style="height:var(--space-8);"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add('open'));
  });

  // Close events
  modal.querySelector('#lib-detail-close').addEventListener('click', closeDetail);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeDetail();
  });

  // Swipe down to close
  let startY = 0;
  const sheet = modal.querySelector('.lib-detail-sheet');
  sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 80) closeDetail();
  }, { passive: true });
}

function closeDetail() {
  const modal = document.getElementById('lib-detail-modal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => modal.remove(), 350);
}

// ── Main render ───────────────────────────────────────────
export function renderLibrary(container) {
  activeCategory = 'all';
  searchQuery    = '';

  container.innerHTML = `
    <div class="screen-title">Exercices</div>

    <!-- Search -->
    <div class="lib-search-wrap">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="lib-search-icon">
        <circle cx="7" cy="7" r="4.5" stroke="var(--text-tertiary)" stroke-width="1.6"/>
        <path d="M10.5 10.5l3 3" stroke="var(--text-tertiary)" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <input
        type="search"
        id="lib-search"
        class="lib-search-input"
        placeholder="Chercher un exercice ou muscle..."
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
      />
    </div>

    <!-- Category filter -->
    ${renderCategoryBar()}

    <!-- Exercise list -->
    <div id="lib-exercise-list"></div>
  `;

  // Initial render
  renderExerciseList(container);

  // Category filter
  container.querySelectorAll('.lib-cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.cat;
      container.querySelectorAll('.lib-cat-chip').forEach(c =>
        c.classList.toggle('selected', c.dataset.cat === activeCategory)
      );
      renderExerciseList(container);
    });
  });

  // Search input
  const searchInput = container.querySelector('#lib-search');
  searchInput?.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderExerciseList(container);
  });
}
