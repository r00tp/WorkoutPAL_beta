/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/profile.js
   ═══════════════════════════════════════════════ */

import { db }        from '../storage/db.js';
import { showToast } from '../utils/ui.js';
import { EXERCISES } from '../data/exercises.js';

const EQUIPMENT_LIST = [
  { id: 'halteres_5kg',        label: 'Haltères fixes 5 kg', icon: '🏋️' },
  { id: 'halteres_modulables', label: 'Haltères modulables',  icon: '🔧' },
  { id: 'hand_grip',           label: 'Hand grip 25 kg',      icon: '✊' },
  { id: 'elastique',           label: 'Élastique 20 kg',      icon: '🔁' },
  { id: 'veste_lestee',        label: 'Veste lestée',         icon: '🦺' },
  { id: 'tapis',               label: 'Tapis fitness',         icon: '🟩' },
];

const GOAL_OPTIONS = [
  { id: 'hypertrophy', label: 'Hypertrophie'   },
  { id: 'strength',    label: 'Force'           },
  { id: 'endurance',   label: 'Endurance'       },
  { id: 'weightloss',  label: 'Perte de poids'  },
];

const LEVEL_OPTIONS = [
  { id: 'beginner',     label: 'Débutant'       },
  { id: 'intermediate', label: 'Intermédiaire'  },
  { id: 'advanced',     label: 'Avancé'         },
];

export function renderProfile(container) {
  const profile    = db.get('profile') || {};
  const name       = profile.name       || 'Athlète';
  const level      = profile.level      || 'intermediate';
  const goal       = profile.goal       || 'hypertrophy';
  const equipment  = profile.equipment  || [];
  const vestWeight = profile.vestWeight || 5.0;

  const goalLabel  = GOAL_OPTIONS.find(g => g.id === goal)?.label  || goal;
  const levelLabel = LEVEL_OPTIONS.find(l => l.id === level)?.label || level;
  const sessions   = db.getSessions().length;
  const streak     = db.getStreak();

  container.innerHTML = `
    <div class="screen-title">Profil</div>

    <div class="profile-header">
      <div class="profile-avatar"><span class="profile-avatar-letter">${name.charAt(0)}</span></div>
      <div class="profile-info">
        <div class="profile-name">${name}</div>
        <div class="profile-level">${levelLabel}</div>
        <div class="profile-goal-badge"><span class="badge badge-accent">${goalLabel}</span></div>
      </div>
    </div>

    <div class="section-heading">Objectif principal</div>
    <div class="tag-list" style="margin-bottom:var(--space-5);">
      ${GOAL_OPTIONS.map(g => `<div class="tag ${goal === g.id ? 'selected' : ''}" data-goal="${g.id}">${g.label}</div>`).join('')}
    </div>

    <div class="section-heading">Niveau</div>
    <div class="tag-list" style="margin-bottom:var(--space-5);">
      ${LEVEL_OPTIONS.map(l => `<div class="tag ${level === l.id ? 'selected' : ''}" data-level="${l.id}">${l.label}</div>`).join('')}
    </div>

    <div class="section-heading">Équipement disponible</div>
    <div class="equipment-grid" style="margin-bottom:var(--space-5);">
      ${EQUIPMENT_LIST.map(eq => `
        <div class="equipment-item ${equipment.includes(eq.id) ? 'active' : ''}" data-equip="${eq.id}">
          <div class="equipment-item-icon">${eq.icon}</div>
          <div class="equipment-item-label">${eq.label}</div>
        </div>
      `).join('')}
    </div>

    <div class="section-heading">Veste lestée</div>
    <div class="settings-section" style="margin-bottom:var(--space-5);">
      <div class="list-row" style="cursor:default;">
        <div class="list-row-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 6h12v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6zM1 6h16M6 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="list-row-content">
          <div class="list-row-title">Poids actuel</div>
          <div class="weight-stepper">
            <button class="stepper-btn" id="vest-minus">−</button>
            <div class="stepper-value" id="vest-val">${vestWeight}<span class="stepper-unit">kg</span></div>
            <button class="stepper-btn" id="vest-plus">+</button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section" style="margin-bottom:var(--space-5);">
      <div class="list-row" id="btn-open-library">
        <div class="list-row-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M6 7h6M6 10h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="list-row-content">
          <div class="list-row-title">Bibliothèque d'exercices</div>
          <div class="list-row-subtitle">${EXERCISES.length} exercices disponibles</div>
        </div>
        <div class="list-row-chevron">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="list-row" style="cursor:default;">
        <div class="list-row-icon" style="background:var(--surface-2);color:var(--text-secondary);">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.6"/>
            <path d="M9 8v5M9 6h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="list-row-content">
          <div class="list-row-title">WorkoutPAL — v1.0</div>
          <div class="list-row-subtitle">${sessions} séance${sessions !== 1 ? 's' : ''} · Streak : ${streak} jour${streak !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>

    <div style="height:var(--space-8);"></div>
  `;

  // Library link
  container.querySelector('#btn-open-library')?.addEventListener('click', () => {
    window.WorkoutPAL?.navigate('library');
  });

  // Goal tags
  container.querySelectorAll('[data-goal]').forEach(tag => {
    tag.addEventListener('click', () => {
      const v = tag.dataset.goal;
      const p = db.get('profile') || {};
      db.set('profile', { ...p, goal: v });
      container.querySelectorAll('[data-goal]').forEach(t => t.classList.toggle('selected', t.dataset.goal === v));
      const badge = container.querySelector('.badge-accent');
      if (badge) badge.textContent = GOAL_OPTIONS.find(g => g.id === v)?.label || v;
      showToast('Objectif mis à jour ✓', 'success');
    });
  });

  // Level tags
  container.querySelectorAll('[data-level]').forEach(tag => {
    tag.addEventListener('click', () => {
      const v = tag.dataset.level;
      const p = db.get('profile') || {};
      db.set('profile', { ...p, level: v });
      container.querySelectorAll('[data-level]').forEach(t => t.classList.toggle('selected', t.dataset.level === v));
      const levelEl = container.querySelector('.profile-level');
      if (levelEl) levelEl.textContent = LEVEL_OPTIONS.find(l => l.id === v)?.label || v;
      showToast('Niveau mis à jour ✓', 'success');
    });
  });

  // Equipment
  container.querySelectorAll('[data-equip]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.equip;
      const p  = db.get('profile') || {};
      const eq = [...(p.equipment || [])];
      const idx = eq.indexOf(id);
      if (idx === -1) eq.push(id); else eq.splice(idx, 1);
      db.set('profile', { ...p, equipment: eq });
      item.classList.toggle('active', eq.includes(id));
    });
  });

  // Vest stepper
  let currentVest = vestWeight;
  container.querySelector('#vest-minus')?.addEventListener('click', () => {
    currentVest = Math.max(0.5, Math.round((currentVest - 0.5) * 10) / 10);
    const el = container.querySelector('#vest-val');
    if (el) el.innerHTML = `${currentVest}<span class="stepper-unit">kg</span>`;
    const p = db.get('profile') || {};
    db.set('profile', { ...p, vestWeight: currentVest });
  });
  container.querySelector('#vest-plus')?.addEventListener('click', () => {
    currentVest = Math.min(30, Math.round((currentVest + 0.5) * 10) / 10);
    const el = container.querySelector('#vest-val');
    if (el) el.innerHTML = `${currentVest}<span class="stepper-unit">kg</span>`;
    const p = db.get('profile') || {};
    db.set('profile', { ...p, vestWeight: currentVest });
  });
}
