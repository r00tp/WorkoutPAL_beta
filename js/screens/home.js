/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/home.js
   ═══════════════════════════════════════════════ */

import { db }         from '../storage/db.js';
import { formatDate } from '../utils/ui.js';

const GOAL_LABELS = {
  hypertrophy: 'Hypertrophie',
  strength:    'Force',
  endurance:   'Endurance',
  weightloss:  'Perte de poids',
};

const MUSCLE_GROUPS = [
  { id: 'pectoraux', label: 'Pectoraux' },
  { id: 'dos',       label: 'Dos'       },
  { id: 'epaules',   label: 'Epaules'   },
  { id: 'biceps',    label: 'Biceps'    },
  { id: 'triceps',   label: 'Triceps'   },
  { id: 'jambes',    label: 'Jambes'    },
  { id: 'core',      label: 'Core'      },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon apres-midi';
  return 'Bonsoir';
}

function safeGetSessions() {
  try { return db.getSessions() || []; }
  catch (e) { return []; }
}

function safeFormatDate(dateStr) {
  try { return formatDate(dateStr) || ''; }
  catch (e) { return ''; }
}

function getMuscleUsage() {
  try {
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
      pct: Math.round((counts[m.id] / max) * 100),
    }));
  } catch (e) {
    return MUSCLE_GROUPS.map(m => ({ ...m, pct: 0 }));
  }
}

function buildStats() {
  try {
    return {
      streak:       db.getStreak()          || 0,
      weekSessions: db.sessionsThisWeek()   || 0,
      weekVolume:   db.volumeInLastDays(7)  || 0,
    };
  } catch (e) {
    return { streak: 0, weekSessions: 0, weekVolume: 0 };
  }
}

export function renderHome(container) {
  // — Profile —
  let profile = {};
  try { profile = db.get('profile') || {}; } catch (e) {}

  const goal     = GOAL_LABELS[profile.goal] || 'Entrainement';
  const greeting = getGreeting();
  const stats    = buildStats();
  const muscles  = getMuscleUsage();
  const sessions = safeGetSessions();
  const recent   = sessions.slice(0, 3);

  const volDisplay = stats.weekVolume >= 1000
    ? (stats.weekVolume / 1000).toFixed(1) + 't'
    : stats.weekVolume + 'kg';

  // — Muscle bars —
  const muscleBars = muscles.map(m => {
    const cls = m.pct < 30 ? 'low' : m.pct < 70 ? 'mid' : 'high';
    return `<div class="muscle-bar-row">
      <div class="muscle-bar-label">${m.label}</div>
      <div class="muscle-bar-track">
        <div class="muscle-bar-fill ${cls}" style="width:${m.pct}%"></div>
      </div>
    </div>`;
  }).join('');

  // — Recent sessions —
  let recentHTML = '';
  if (!recent.length) {
    recentHTML = `<div style="text-align:center;padding:32px 0;color:var(--text-tertiary);font-size:14px;line-height:1.6;">
      Aucune seance pour l'instant.<br>Lance ta premiere seance !
    </div>`;
  } else {
    recentHTML = recent.map(s => {
      const dur  = s.durationMinutes ? s.durationMinutes + ' min' : '';
      const exCt = (s.exercises && s.exercises.length) ? s.exercises.length + ' exercices' : '';
      const meta = [safeFormatDate(s.date), exCt].filter(Boolean).join(' · ');
      return `<div class="session-card-row" data-session-id="${s.id || ''}">
        <div class="session-card-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h2l2-5 4 10 2-5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="session-card-info">
          <div class="session-card-name">${s.name || 'Seance'}</div>
          <div class="session-card-meta">${meta}</div>
        </div>
        ${dur ? `<div class="session-card-duration">${dur}</div>` : ''}
      </div>`;
    }).join('');
  }

  container.innerHTML = `
    <div class="home-greeting">
      <div class="home-greeting-label">${greeting} 👋</div>
      <div class="home-greeting-title">Pret a<br><span>s'entrainer ?</span></div>
    </div>

    <div class="quick-start-card" id="quick-start-card">
      <div class="quick-start-label">Recommandee pour toi</div>
      <div class="quick-start-title">Seance ${goal}</div>
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
            <path d="M2 10l3-5 3 3 2-4 2 3" stroke="rgba(255,255,255,0.7)" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          Niveau intermediaire
        </div>
      </div>
      <button class="quick-start-btn" id="btn-quick-start">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 4l8 5-8 5V4z" fill="currentColor"/>
        </svg>
        Demarrer
      </button>
    </div>

    <div class="streak-row">
      <div class="streak-block">
        <div class="streak-value accent">${stats.streak}</div>
        <div class="streak-label">Streak</div>
      </div>
      <div class="streak-block">
        <div class="streak-value">${stats.weekSessions}</div>
        <div class="streak-label">Seances / sem.</div>
      </div>
      <div class="streak-block">
        <div class="streak-value">${stats.weekVolume > 0 ? volDisplay : '0'}</div>
        <div class="streak-label">Volume 7j</div>
      </div>
    </div>

    <div class="muscle-strip">
      <div class="muscle-strip-title">Muscles - 7 jours</div>
      <div class="muscle-bars">${muscleBars}</div>
    </div>

    <div class="section-heading">Recentes</div>
    <div class="recent-sessions">${recentHTML}</div>
    <div style="height:var(--space-8)"></div>
  `;

  container.querySelector('#btn-quick-start')?.addEventListener('click', () => {
    window.WorkoutPAL?.navigate('session');
  });

  container.querySelectorAll('.session-card-row').forEach(row => {
    row.addEventListener('click', () => {
      window.WorkoutPAL?.navigate('history', { highlightId: row.dataset.sessionId });
    });
  });
}
