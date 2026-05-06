/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/home.js
   Dashboard: greeting, quick start, stats, recent
   ═══════════════════════════════════════════════ */

import { db }            from '../storage/db.js';
import { formatDate }    from '../utils/ui.js';

// ── Greeting based on time ────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

// ── Goal label mapping ────────────────────────────────────
const GOAL_LABELS = {
  hypertrophy: 'Hypertrophie',
  strength:    'Force',
  endurance:   'Endurance',
  weightloss:  'Perte de poids',
};

// ── Muscle groups to track ────────────────────────────────
const MUSCLE_GROUPS = [
  { id: 'pectoraux',   label: 'Pectoraux'  },
  { id: 'dos',         label: 'Dos'        },
  { id: 'epaules',     label: 'Épaules'    },
  { id: 'biceps',      label: 'Biceps'     },
  { id: 'triceps',     label: 'Triceps'    },
  { id: 'jambes',      label: 'Jambes'     },
  { id: 'core',        label: 'Core'       },
];

// ── Compute muscle usage (last 7 days) ────────────────────
function getMuscleUsage() {
  const sessions = db.sessionsInLastDays(7);
  const counts = {};
  MUSCLE_GROUPS.forEach(m => { counts[m.id] = 0; });

  sessions.forEach(s => {
    (s.exercises || []).forEach(ex => {
      (ex.muscles || []).forEach(m => {
        if (counts[m] !== undefined) counts[m]++;
      });
    });
  });

  const max = Math.max(...Object.values(counts), 1);
  return MUSCLE_GROUPS.map(m => ({
    ...m,
    count: counts[m.id],
    pct:   Math.round((counts[m.id] / max) * 100),
  }));
}

// ── Render quick-start card ───────────────────────────────
function renderQuickStart(profile) {
  const goal = GOAL_LABELS[profile.goal] || 'Entraînement';
  return `
    <div class="quick-start-card" id="quick-start-card">
      <div class="quick-start-label">Recommandée pour toi</div>
      <div class="quick-start-title">Séance ${goal}</div>
      <div class="quick-start-meta">
        <div class="quick-start-meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.7)" stroke-width="1.4"/>
            <path d="M7 4v3l2 2" stroke="rgba(255,255,255,0.7)" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          35 min
        </div>
        <div class="quick-start-meta-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 10l3-5 3 3 2-4 2 3" stroke="rgba(255,255,255,0.7)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Niveau intermédiaire
        </div>
      </div>
      <button class="quick-start-btn" id="btn-quick-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 4l8 5-8 5V4z" fill="currentColor"/>
        </svg>
        Démarrer
      </button>
    </div>
  `;
}

// ── Render weekly stats ───────────────────────────────────
function renderStats() {
  const streak         = db.getStreak();
  const weekSessions   = db.sessionsThisWeek();
  const weekVolume     = db.volumeInLastDays(7);

  const volumeDisplay = weekVolume >= 1000
    ? `${(weekVolume / 1000).toFixed(1)}t`
    : `${weekVolume}kg`;

  return `
    <div class="streak-row">
      <div class="streak-block">
        <div class="streak-value accent">${streak}</div>
        <div class="streak-label">Jours streak</div>
      </div>
      <div class="streak-block">
        <div class="streak-value">${weekSessions}</div>
        <div class="streak-label">Séances / sem.</div>
      </div>
      <div class="streak-block">
        <div class="streak-value">${weekVolume > 0 ? volumeDisplay : '—'}</div>
        <div class="streak-label">Volume 7j</div>
      </div>
    </div>
  `;
}

// ── Render muscle heatmap ─────────────────────────────────
function renderMuscleStrip() {
  const muscles = getMuscleUsage();

  const bars = muscles.map(m => {
    const cls = m.pct < 30 ? 'low' : m.pct < 70 ? 'mid' : 'high';
    return `
      <div class="muscle-bar-row">
        <div class="muscle-bar-label">${m.label}</div>
        <div class="muscle-bar-track">
          <div class="muscle-bar-fill ${cls}" style="width:${m.pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="muscle-strip">
      <div class="muscle-strip-title">Muscles travaillés — 7 jours</div>
      <div class="muscle-bars">${bars}</div>
    </div>
  `;
}

// ── Render recent sessions ────────────────────────────────
function renderRecentSessions() {
  const sessions = db.getRecentSessions(3);

  if (!sessions.length) {
    return `
      <div class="section-heading">Récentes</div>
      <div style="text-align:center; padding: 32px 0; color: var(--text-tertiary); font-size:14px;">
        Aucune séance pour l'instant.<br>Lance ta première séance ! 💪
      </div>
    `;
  }

  const rows = sessions.map(s => {
    const duration = s.durationMinutes ? `${s.durationMinutes} min` : '';
    const exCount  = s.exercises ? `${s.exercises.length} exercices` : '';
    const meta     = [formatDate(s.date), exCount].filter(Boolean).join(' · ');

    return `
      <div class="session-card-row" data-session-id="${s.id}">
        <div class="session-card-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h2l2-5 4 10 2-5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="session-card-info">
          <div class="session-card-name">${s.name || 'Séance'}</div>
          <div class="session-card-meta">${meta}</div>
        </div>
        ${duration ? `<div class="session-card-duration">${duration}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="section-heading">Séances récentes</div>
    <div class="recent-sessions">${rows}</div>
  `;
}

// ── Main render ───────────────────────────────────────────
export function renderHome(container) {
  const profile = db.get('profile') || {};
  const greeting = getGreeting();

  container.innerHTML = `
    <div class="home-greeting">
      <div class="home-greeting-label">${greeting} 👋</div>
      <div class="home-greeting-title">Prêt à<br><span>t'entraîner ?</span></div>
    </div>

    ${renderQuickStart(profile)}
    ${renderStats()}
    ${renderMuscleStrip()}
    ${renderRecentSessions()}
  `;

  // ── Event: Quick start ──────────────────────────────────
  container.querySelector('#btn-quick-start')?.addEventListener('click', () => {
    window.WorkoutPAL?.navigate('session', { autoStart: true });
  });

  // ── Event: Recent session tap ───────────────────────────
  container.querySelectorAll('.session-card-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.sessionId;
      window.WorkoutPAL?.navigate('history', { highlightId: id });
    });
  });
}
