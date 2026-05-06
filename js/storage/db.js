/* ═══════════════════════════════════════════════
   WORKOUTPAL — storage/db.js
   localStorage abstraction with JSON parsing
   ═══════════════════════════════════════════════ */

const PREFIX = 'wpal_';

export const db = {

  // ── Read ─────────────────────────────────────
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn(`[DB] get(${key}) failed:`, e);
      return null;
    }
  },

  // ── Write ────────────────────────────────────
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[DB] set(${key}) failed:`, e);
      return false;
    }
  },

  // ── Delete ───────────────────────────────────
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ── List all keys (without prefix) ───────────
  keys() {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        result.push(k.replace(PREFIX, ''));
      }
    }
    return result;
  },

  // ── Sessions helpers ──────────────────────────

  // Save a completed session
  saveSession(session) {
    const sessions = this.getSessions();
    sessions.unshift(session); // most recent first
    this.set('sessions', sessions);
  },

  // Get all sessions
  getSessions() {
    return this.get('sessions') || [];
  },

  // Get N most recent sessions
  getRecentSessions(n = 5) {
    return this.getSessions().slice(0, n);
  },

  // ── Personal Records helpers ──────────────────

  // Update a PR for an exercise if new record
  updatePR(exerciseId, { weight, reps, volume }) {
    const prs = this.get('prs') || {};
    const existing = prs[exerciseId] || { maxWeight: 0, maxReps: 0, bestVolume: 0 };
    let updated = false;

    if (weight > existing.maxWeight) { existing.maxWeight = weight; updated = true; }
    if (reps   > existing.maxReps)   { existing.maxReps   = reps;   updated = true; }
    if (volume > existing.bestVolume){ existing.bestVolume = volume; updated = true; }

    if (updated) {
      prs[exerciseId] = existing;
      this.set('prs', prs);
    }

    return updated; // returns true if a new PR was set
  },

  // Get all PRs
  getPRs() {
    return this.get('prs') || {};
  },

  // ── Stats helpers ─────────────────────────────

  // Total sessions in last N days
  sessionsInLastDays(days = 7) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.getSessions().filter(s => new Date(s.date).getTime() > cutoff);
  },

  // Total volume (kg·reps) in last N days
  volumeInLastDays(days = 7) {
    const sessions = this.sessionsInLastDays(days);
    let total = 0;
    sessions.forEach(s => {
      (s.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(set => {
          total += (set.weight || 0) * (set.reps || 0);
        });
      });
    });
    return Math.round(total);
  },

  // Streak: consecutive days with at least one session
  getStreak() {
    const sessions = this.getSessions();
    if (!sessions.length) return 0;

    const days = new Set(
      sessions.map(s => new Date(s.date).toDateString())
    );

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (days.has(d.toDateString())) {
        streak++;
      } else if (i > 0) {
        break; // gap found
      }
    }

    return streak;
  },

  // Sessions this week (Mon–Sun)
  sessionsThisWeek() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    return this.getSessions().filter(
      s => new Date(s.date) >= monday
    ).length;
  },

};
