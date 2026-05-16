/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/history.js
   ═══════════════════════════════════════════════ */

import { db }                          from '../storage/db.js';
import { formatDate, formatDateShort } from '../utils/ui.js';

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function groupByMonth(sessions) {
  const groups = {};
  sessions.forEach(s => {
    const key = monthLabel(s.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  return groups;
}

function renderEntry(session) {
  const { day, month } = formatDateShort(session.date);
  const exCount  = session.exercises?.length ?? 0;
  const duration = session.durationMinutes ?? '—';
  const volume   = session.exercises
    ? session.exercises.reduce((acc, ex) =>
        acc + (ex.sets || []).reduce((a, s) => a + (s.weight || 0) * (s.reps || 0), 0), 0)
    : 0;

  return `
    <div class="history-entry" data-id="${session.id}">
      <div class="history-entry-header">
        <div class="history-entry-date">
          <div class="history-entry-date-day">${day}</div>
          <div class="history-entry-date-month">${month}</div>
        </div>
        <div class="history-entry-info">
          <div class="history-entry-title">${session.name || 'Séance'}</div>
          <div class="history-entry-meta">${formatDate(session.date)}${session.programType ? ' · ' + session.programType : ''}</div>
        </div>
      </div>
      <div class="history-entry-stats">
        <div class="history-entry-stat">
          <div class="history-entry-stat-val">${duration}<span style="font-size:12px;font-weight:400"> min</span></div>
          <div class="history-entry-stat-label">Durée</div>
        </div>
        <div class="history-entry-stat">
          <div class="history-entry-stat-val">${exCount}</div>
          <div class="history-entry-stat-label">Exercices</div>
        </div>
        <div class="history-entry-stat">
          <div class="history-entry-stat-val">${volume > 0 ? volume : '—'}${volume > 0 ? '<span style="font-size:12px;font-weight:400"> kg</span>' : ''}</div>
          <div class="history-entry-stat-label">Volume</div>
        </div>
      </div>
    </div>
  `;
}

export function renderHistory(container, params = {}) {
  const sessions = db.getSessions();
  const total7d  = db.sessionsInLastDays(7).length;
  const total30d = db.sessionsInLastDays(30).length;
  const volume7d = db.volumeInLastDays(7);

  let content = sessions.length
    ? Object.entries(groupByMonth(sessions)).map(([month, list]) =>
        `<div class="history-month-header">${month}</div>${list.map(renderEntry).join('')}`
      ).join('')
    : `<div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="14" width="48" height="40" rx="6" stroke="currentColor" stroke-width="2.5"/>
          <path d="M22 8v12M42 8v12M8 28h48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M22 38h8M22 46h20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <p>Aucune séance enregistrée.<br>Lance ton premier entraînement !</p>
       </div>`;

  container.innerHTML = `
    <div class="screen-title">Historique</div>
    <div class="stat-grid" style="margin-bottom:var(--space-5);">
      <div class="stat-block">
        <div class="stat-value accent">${total7d}</div>
        <div class="stat-label">Séances / 7 jours</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${total30d}</div>
        <div class="stat-label">Séances / 30 jours</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${volume7d > 0 ? volume7d : '—'}</div>
        <div class="stat-label">Volume 7j (kg·reps)</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${sessions.length}</div>
        <div class="stat-label">Total séances</div>
      </div>
    </div>
    <div id="history-list">${content}</div>
  `;

  if (params.highlightId) {
    const el = container.querySelector(`[data-id="${params.highlightId}"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '2px solid var(--accent)';
        setTimeout(() => { el.style.outline = ''; }, 1500);
      }, 150);
    }
  }
}
