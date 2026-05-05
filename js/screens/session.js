/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/session.js
   Session picker UI (Sprint 1 shell)
   Full generation logic added in Sprint 3
   ═══════════════════════════════════════════════ */

import { db }         from '../storage/db.js';
import { showToast }  from '../utils/ui.js';

const DURATIONS = [15, 25, 35, 45];

const OBJECTIVES = [
  { id: 'hypertrophy', label: 'Hypertrophie', icon: '💪', sub: 'Volume & masse musculaire' },
  { id: 'strength',    label: 'Force',         icon: '🏋️', sub: 'Charges lourdes & progression' },
  { id: 'endurance',   label: 'Endurance',     icon: '🔥', sub: 'Circuits & cardio' },
  { id: 'weightloss',  label: 'Perte de poids',icon: '⚡', sub: 'HIIT & brûlage calorique' },
];

// Focus groups: global + précis (ta demande de séances globales ET précises)
const FOCUS_GROUPS = [
  { id: 'full_body',   label: '🌐 Full body',        group: 'global'  },
  { id: 'upper_body',  label: '💪 Haut du corps',    group: 'global'  },
  { id: 'lower_body',  label: '🦵 Bas du corps',     group: 'global'  },
  { id: 'push',        label: '➡️ Push',              group: 'global'  },
  { id: 'pull',        label: '⬅️ Pull',              group: 'global'  },
  { id: 'core',        label: '🎯 Core',              group: 'global'  },
  { id: 'arms',        label: '💪 Bras complets',    group: 'bras'    },
  { id: 'biceps',      label: '💪 Biceps',            group: 'bras'    },
  { id: 'triceps',     label: '🔱 Triceps',           group: 'bras'    },
  { id: 'forearms',    label: '🤜 Avant-bras',        group: 'bras'    },
  { id: 'chest',       label: '🫀 Pectoraux',         group: 'torse'   },
  { id: 'shoulders',   label: '🔝 Épaules',           group: 'torse'   },
  { id: 'back',        label: '🦾 Dos complet',       group: 'dos'     },
  { id: 'lats',        label: '🔻 Dorsaux',           group: 'dos'     },
  { id: 'traps',       label: '⛰️ Trapèzes',          group: 'dos'     },
  { id: 'quads',       label: '🦵 Quadriceps',        group: 'jambes'  },
  { id: 'hamstrings',  label: '🔙 Ischio-jambiers',   group: 'jambes'  },
  { id: 'glutes',      label: '🍑 Fessiers',          group: 'jambes'  },
  { id: 'calves',      label: '🦶 Mollets',           group: 'jambes'  },
];

let state = {
  duration:  35,
  objective: null,
  focus:     'full_body',
};

function renderDurationSelector() {
  return `
    <div class="section-heading">Durée</div>
    <div class="duration-selector">
      ${DURATIONS.map(d => `
        <div class="duration-pill ${state.duration === d ? 'selected' : ''}" data-duration="${d}">
          ${d}<span style="font-size:12px;font-weight:400;margin-left:2px">min</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderObjectiveChips() {
  return `
    <div class="section-heading">Objectif</div>
    <div class="objective-grid">
      ${OBJECTIVES.map(o => `
        <div class="objective-chip ${state.objective === o.id ? 'selected' : ''}" data-objective="${o.id}">
          <div class="objective-chip-icon">${o.icon}</div>
          <div class="objective-chip-label">${o.label}</div>
          <div class="objective-chip-sub">${o.sub}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFocusChips() {
  return `
    <div class="section-heading">Zone ciblée</div>
    <div class="focus-scroll">
      ${FOCUS_GROUPS.map(f => `
        <div class="focus-chip ${state.focus === f.id ? 'selected' : ''}" data-focus="${f.id}">
          ${f.label}
        </div>
      `).join('')}
    </div>
  `;
}

function renderStartButton() {
  const ready = !!state.objective;
  return `
    <div style="padding-top:var(--space-3);padding-bottom:var(--space-8);">
      <button class="btn btn-primary" id="btn-start-session">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4l9 6-9 6V4z" fill="currentColor"/>
        </svg>
        ${ready ? 'Lancer la séance' : 'Choisis un objectif'}
      </button>
    </div>
  `;
}

function bindEvents(container) {
  container.querySelectorAll('.duration-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.duration = parseInt(pill.dataset.duration);
      container.querySelectorAll('.duration-pill').forEach(p =>
        p.classList.toggle('selected', p.dataset.duration === pill.dataset.duration)
      );
    });
  });

  container.querySelectorAll('.objective-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.objective = chip.dataset.objective;
      container.querySelectorAll('.objective-chip').forEach(c =>
        c.classList.toggle('selected', c.dataset.objective === chip.dataset.objective)
      );
      const btn = container.querySelector('#btn-start-session');
      if (btn) btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4l9 6-9 6V4z" fill="currentColor"/>
        </svg>
        Lancer la séance
      `;
    });
  });

  container.querySelectorAll('.focus-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.focus = chip.dataset.focus;
      container.querySelectorAll('.focus-chip').forEach(c =>
        c.classList.toggle('selected', c.dataset.focus === chip.dataset.focus)
      );
    });
  });

  container.querySelector('#btn-start-session')?.addEventListener('click', () => {
    if (!state.objective) {
      showToast('Choisis un objectif 👆', 'default');
      return;
    }
    // Sprint 3: generateur appelé ici
    showToast('⚙️ Générateur de séances — disponible au Sprint 3', 'accent');
  });
}

export function renderSession(container, params = {}) {
  const profile = db.get('profile');
  state.duration  = 35;
  state.objective = profile?.goal || null;
  state.focus     = 'full_body';

  container.innerHTML = `
    <div class="session-picker">
      <div class="screen-title">Nouvelle<br><span style="color:var(--accent)">Séance</span></div>
      ${renderDurationSelector()}
      <div class="divider"></div>
      ${renderObjectiveChips()}
      <div class="divider"></div>
      ${renderFocusChips()}
      <div class="divider"></div>
      ${renderStartButton()}
    </div>
  `;

  bindEvents(container);
}
