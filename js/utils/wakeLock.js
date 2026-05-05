/* ═══════════════════════════════════════════════
   WORKOUTPAL — utils/wakeLock.js
   Screen Wake Lock API — keeps screen on during sessions
   ═══════════════════════════════════════════════ */

let wakeLock = null;

// ── Request wake lock ──────────────────────────────────────
export async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    console.info('[WakeLock] Not supported on this device');
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('[WakeLock] Active ✓');

    // Re-acquire on visibility change (iOS releases it when backgrounded)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return true;
  } catch (err) {
    console.warn('[WakeLock] Request failed:', err.message);
    return false;
  }
}

// ── Release wake lock ──────────────────────────────────────
export async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('[WakeLock] Released ✓');
    } catch (err) {
      console.warn('[WakeLock] Release failed:', err.message);
    }
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange);
}

// ── Re-acquire when tab becomes visible ───────────────────
async function handleVisibilityChange() {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('[WakeLock] Re-acquired after visibility change ✓');
    } catch (err) {
      console.warn('[WakeLock] Re-acquire failed:', err.message);
    }
  }
}

// ── Check if active ───────────────────────────────────────
export function isWakeLockActive() {
  return wakeLock !== null && !wakeLock.released;
}
