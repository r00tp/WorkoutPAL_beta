/* ═══════════════════════════════════════════════
   WORKOUTPAL — utils/ui.js
   DOM helpers, toast, transitions
   ═══════════════════════════════════════════════ */

// ── Toast ─────────────────────────────────────────────────
export function showToast(message, type = 'default', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'default' ? type : ''}`.trim();
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Create element with attributes ───────────────────────
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') {
      element.className = val;
    } else if (key === 'innerHTML') {
      element.innerHTML = val;
    } else if (key.startsWith('on') && typeof val === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === 'dataset') {
      Object.entries(val).forEach(([dk, dv]) => {
        element.dataset[dk] = dv;
      });
    } else {
      element.setAttribute(key, val);
    }
  });

  children.forEach(child => {
    if (child == null) return;
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

// ── Format duration (seconds → mm:ss or Xmin) ─────────────
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

// ── Format date ───────────────────────────────────────────
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today    = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString())     return 'Aujourd\'hui';
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';

  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

// ── Format date as day/month ──────────────────────────────
export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return {
    day:   d.getDate(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
  };
}

// ── Clamp number ──────────────────────────────────────────
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ── Capitalize first letter ───────────────────────────────
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Pluralize French ──────────────────────────────────────
export function pluralFr(n, singular, plural) {
  return n <= 1 ? singular : plural;
}

// ── Debounce ──────────────────────────────────────────────
export function debounce(fn, ms = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ── Haptic feedback (iOS vibration API) ───────────────────
export function haptic(type = 'light') {
  if (!navigator.vibrate) return;
  const patterns = {
    light:  [10],
    medium: [20],
    heavy:  [30],
    success:[10, 50, 10],
    error:  [50, 30, 50],
  };
  navigator.vibrate(patterns[type] || patterns.light);
}
