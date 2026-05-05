/* ═══════════════════════════════════════════════
   WORKOUTPAL — app.js
   SPA Router, screen management, app bootstrap
   ═══════════════════════════════════════════════ */

import { renderHome }    from './screens/home.js';
import { renderSession } from './screens/session.js';
import { renderHistory } from './screens/history.js';
import { renderProfile } from './screens/profile.js';
import { renderLibrary } from './screens/library.js';
import { showToast }     from './utils/ui.js';
import { db }            from './storage/db.js';

// ── Screen registry ───────────────────────────────────────
const SCREENS = {
  home:    { render: renderHome,    label: 'Accueil',    hasTab: true  },
  session: { render: renderSession, label: 'Séance',     hasTab: true  },
  history: { render: renderHistory, label: 'Historique', hasTab: true  },
  profile: { render: renderProfile, label: 'Profil',     hasTab: true  },
  library: { render: renderLibrary, label: 'Exercices',  hasTab: false },
};

let currentScreen = null;

// ── Navigation history stack ──────────────────────────────
let navStack = [];

// ── Navigate to a screen ──────────────────────────────────
export function navigate(screenId, params = {}) {
  if (!SCREENS[screenId]) {
    console.warn(`[Router] Unknown screen: ${screenId}`);
    return;
  }

  const prev = currentScreen;
  currentScreen = screenId;

  // Track history for back navigation
  if (prev && prev !== screenId) navStack.push(prev);

  // Update hash
  window.location.hash = screenId;

  // Update nav tabs (only for screens with tabs)
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === screenId);
  });

  // Show/hide back button in header for sub-screens
  updateHeaderActions(screenId, prev);

  // Animate out old screen
  if (prev && prev !== screenId) {
    const prevEl = document.getElementById(`screen-${prev}`);
    if (prevEl) {
      prevEl.classList.remove('active');
      prevEl.classList.add('exit');
      setTimeout(() => prevEl.classList.remove('exit'), 300);
    }
  }

  // Animate in new screen
  const nextEl = document.getElementById(`screen-${screenId}`);
  if (nextEl) {
    nextEl.classList.add('active');
    const scrollContainer = nextEl.querySelector('.screen-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      SCREENS[screenId].render(scrollContainer, params);
    }
  }
}

// ── Header action updates ─────────────────────────────────
function updateHeaderActions(screenId, prevScreen) {
  const actionsEl = document.getElementById('header-actions');
  if (!actionsEl) return;

  const screen = SCREENS[screenId];

  // Sub-screens get a back button
  if (!screen?.hasTab) {
    actionsEl.innerHTML = `
      <button class="btn-icon" id="btn-header-back" aria-label="Retour">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    document.getElementById('btn-header-back')?.addEventListener('click', () => {
      const back = navStack.length > 0 ? navStack.pop() : 'profile';
      // Don't push to navStack when going back
      navStack = navStack.filter(s => s !== back);
      navigate(back);
    });
  } else {
    actionsEl.innerHTML = '';
  }
}

// ── Init navigation tabs ──────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target && target !== currentScreen) {
        navigate(target);
      }
    });
  });
}

// ── First run check ───────────────────────────────────────
function checkFirstRun() {
  const profile = db.get('profile');
  if (!profile) {
    // Create default profile for our user
    db.set('profile', {
      name: 'Athlète',
      level: 'intermediate',
      goal: 'hypertrophy',
      equipment: [
        'halteres_5kg',
        'halteres_modulables',
        'hand_grip',
        'elastique',
        'veste_lestee',
        'tapis'
      ],
      vestWeight: 5.0,
      createdAt: new Date().toISOString()
    });

    db.set('settings', {
      restSound: true,
      haptic: true,
      keepScreenOn: true,
    });
  }
}

// ── Bootstrap ─────────────────────────────────────────────
function init() {
  // First run setup
  checkFirstRun();

  // Init toast container
  if (!document.getElementById('toast-container')) {
    const toastEl = document.createElement('div');
    toastEl.id = 'toast-container';
    document.body.appendChild(toastEl);
  }

  // Init navigation
  initNav();

  // Read hash or default to home
  const hash = window.location.hash.replace('#', '') || 'home';
  const startScreen = SCREENS[hash] ? hash : 'home';

  navigate(startScreen);

  // Listen to hash changes (back button)
  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (SCREENS[h] && h !== currentScreen) {
      navigate(h);
    }
  });

  console.log('[WorkoutPAL] v1.0 — Sprint 1 loaded ✓');
}

// ── Expose globally for screens to use ───────────────────
window.WorkoutPAL = { navigate, showToast };

// ── Start ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
