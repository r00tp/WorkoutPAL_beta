/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/history.js
   ═══════════════════════════════════════════════ */

import { db } from '../storage/db.js';

function safeDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { label: '—', day: '—', month: '—', monthKey: 'Inconnu' };
    const day   = d.getDate();
    const month = d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '');
    const monthKey = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    let label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    if (d.toDateString() === today.toDateString())     label = "Aujourd'hui";
    if (d.toDateString() === yesterday.toDateString()) label = 'Hier';
    return { label, day, month, monthKey };
  } catch (e) {
    return { label: '—', day: '—', month: '—', monthKey: 'Inconnu' };
  }
}

function groupByMonth(sessions) {
  const groups = {};
  sessions.forEach(s => {
    const key = safeDate(s.date).monthKey;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  return groups;
}

function renderEntry(session) {
  const dateInfo  = safeDate(session.date);
  const exCount   = Array.isArray(session.exercises) ? session.exercises.length : 0;
  const duration  = session.durationMinutes || '—';
  let   volume    = 0;
  try {
    (session.exercises || []).forEach(ex => {
      (ex.completedSets || ex.sets || []).forEach(set => {
        if (typeof set === 'object') volume += (set.weight || 0) * (set.reps || 0);
      });
    });
  } catch (e) {}

  return `<div class="history-entry" data-id="${session.id || ''}">
    <div class="history-entry-header">
      <div class="history-entry-date">
        <div class="history-entry-date-day">${dateInfo.day}</div>
        <div class="history-entry-date-month">${dateInfo.month}</div>
      </div>
      <div class="history-entry-info">
        <div class="history-entry-title">${session.name || 'Seance'}</div>
        <div class="history-entry-meta">${dateInfo.label}${session.programType ? ' · ' + session.programType : ''}</div>
      </div>
    </div>
    <div class="history-entry-stats">
      <div class="history-entry-stat">
        <div class="history-entry-stat-val">${duration}<span style="font-size:12px;font-weight:400"> min</span></div>
        <div class="history-entry-stat-label">Duree</div>
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
  </div>`;
}

export function renderHistory(container, params = {}) {
  let sessions = [], total7d = 0, total30d = 0, volume7d = 0;
  try {
    sessions = db.getSessions() || [];
    total7d  = db.sessionsInLastDays(7).length;
    total30d = db.sessionsInLastDays(30).length;
    volume7d = db.volumeInLastDays(7);
  } catch (e) {}

  let listHTML = '';
  if (!sessions.length) {
    listHTML = `<div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="14" width="48" height="40" rx="6" stroke="currentColor" stroke-width="2.5"/>
        <path d="M22 8v12M42 8v12M8 28h48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M22 38h8M22 46h20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <p>Aucune seance enregistree.<br>Lance ton premier entrainement !</p>
    </div>`;
  } else {
    try {
      const groups = groupByMonth(sessions);
      listHTML = Object.entries(groups).map(([month, list]) =>
        `<div class="history-month-header">${month}</div>` +
        list.map(renderEntry).join('')
      ).join('');
    } catch (e) {
      listHTML = sessions.map(renderEntry).join('');
    }
  }

  container.innerHTML = `
    <div class="screen-title">Historique</div>
    <div class="stat-grid" style="margin-bottom:var(--space-5);">
      <div class="stat-block">
        <div class="stat-value accent">${total7d}</div>
        <div class="stat-label">Seances / 7j</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${total30d}</div>
        <div class="stat-label">Seances / 30j</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${volume7d > 0 ? volume7d : '0'}</div>
        <div class="stat-label">Volume 7j</div>
      </div>
      <div class="stat-block">
        <div class="stat-value">${sessions.length}</div>
        <div class="stat-label">Total</div>
      </div>
    </div>
    <div id="history-list">${listHTML}</div>
    <div style="height:var(--space-8)"></div>
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
