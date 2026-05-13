/* ═══════════════════════════════════════════════
   WORKOUTPAL — engine/generator.js
   Generates a complete session plan from:
   - duration (15/25/35/45 min)
   - objective (hypertrophy/strength/endurance/weightloss)
   - focus group (full_body/biceps/push/etc.)
   - available equipment
   ═══════════════════════════════════════════════ */

import {
  EXERCISES,
  getCompatibleExercises,
  getExercisesByPhase,
} from '../data/exercises.js';

// ── Objective profiles ─────────────────────────────────────
const PROFILES = {
  hypertrophy: {
    sets:        [3, 4],
    reps:        [8, 12],
    restSeconds: 90,
    format:      'standard',
    label:       'Hypertrophie',
  },
  strength: {
    sets:        [4, 5],
    reps:        [4, 6],
    restSeconds: 150,
    format:      'standard',
    label:       'Force',
  },
  endurance: {
    sets:        [2, 3],
    reps:        [15, 20],
    restSeconds: 45,
    format:      'circuit',
    label:       'Endurance',
  },
  weightloss: {
    sets:        [3, 4],
    reps:        [12, 15],
    restSeconds: 45,
    format:      'circuit',
    label:       'Perte de poids',
  },
};

// ── Duration → main exercise count ────────────────────────
const DURATION_MAP = {
  15: { mainCount: 3, warmupCount: 2, cooldownCount: 1 },
  25: { mainCount: 5, warmupCount: 2, cooldownCount: 2 },
  35: { mainCount: 7, warmupCount: 3, cooldownCount: 2 },
  45: { mainCount: 9, warmupCount: 3, cooldownCount: 3 },
};

// ── Focus → muscle group priorities ───────────────────────
// Used to pick warmup/cooldown exercises that match the session
const FOCUS_MUSCLE_PRIORITY = {
  full_body:   null,           // no filter — any warmup/cooldown
  upper_body:  ['epaules', 'pectoraux', 'trapezes'],
  lower_body:  ['quadriceps', 'ischio_jambiers', 'fessiers'],
  push:        ['epaules', 'pectoraux', 'triceps'],
  pull:        ['dos', 'lats', 'biceps'],
  core:        ['core', 'abdos'],
  arms:        ['biceps', 'triceps', 'avant_bras'],
  biceps:      ['biceps', 'avant_bras'],
  triceps:     ['triceps'],
  forearms:    ['avant_bras'],
  chest:       ['pectoraux'],
  shoulders:   ['epaules', 'trapezes'],
  back:        ['dos', 'lats'],
  lats:        ['lats', 'dos'],
  traps:       ['trapezes'],
  quads:       ['quadriceps'],
  hamstrings:  ['ischio_jambiers', 'fessiers'],
  glutes:      ['fessiers', 'ischio_jambiers'],
  calves:      ['mollets'],
};

// ── Focus label ────────────────────────────────────────────
const FOCUS_LABELS = {
  full_body:   'Full body',
  upper_body:  'Haut du corps',
  lower_body:  'Bas du corps',
  push:        'Push',
  pull:        'Pull',
  core:        'Core',
  arms:        'Bras complets',
  biceps:      'Biceps',
  triceps:     'Triceps',
  forearms:    'Avant-bras',
  chest:       'Pectoraux',
  shoulders:   'Épaules',
  back:        'Dos complet',
  lats:        'Dorsaux',
  traps:       'Trapèzes',
  quads:       'Quadriceps',
  hamstrings:  'Ischio-jambiers',
  glutes:      'Fessiers',
  calves:      'Mollets',
};

// ── Shuffle array ──────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Pick N exercises from pool, no duplicates ──────────────
function pick(pool, n) {
  return shuffle(pool).slice(0, n);
}

// ── Apply objective profile to an exercise ─────────────────
function applyProfile(exercise, profile, vestWeight = 5) {
  const [minSets, maxSets] = profile.sets;
  const [minReps, maxReps] = profile.reps;

  const sets = Math.round(minSets + Math.random() * (maxSets - minSets));
  const reps = exercise.isTimeBased
    ? exercise.defaultReps
    : Math.round(minReps + Math.random() * (maxReps - minReps));

  // Adjust weight based on exercise defaults + vest
  let weight = exercise.defaultWeight;
  if (exercise.equipment.includes('veste_lestee')) {
    weight = vestWeight;
  }

  return {
    exerciseId:   exercise.id,
    name:         exercise.name,
    muscles:      exercise.muscles,
    musclesLabel: exercise.musclesLabel,
    equipment:    exercise.equipment,
    phase:        exercise.phase,
    format:       exercise.phase === 'main' ? profile.format : 'standard',
    isTimeBased:  exercise.isTimeBased || false,
    defaultDuration: exercise.defaultDuration || null,
    sets,
    reps,
    weight,
    restSeconds: exercise.phase === 'main'
      ? profile.restSeconds
      : exercise.restSeconds,
    instructions: exercise.instructions,
    // Tracking: filled during session
    completedSets: [],
  };
}

// ── Build superset pairs (hypertrophy/strength only) ───────
function buildSupersets(mainExercises, profile) {
  // Only build supersets for hypertrophy/strength with 4+ exercises
  if (!['standard'].includes(profile.format) || mainExercises.length < 4) {
    return mainExercises;
  }

  const result = [];
  const pool   = [...mainExercises];

  // Try to pair push+pull or agonist/antagonist for ~30% of exercises
  const pushEx = pool.filter(e =>
    e.muscles.some(m => ['pectoraux', 'triceps', 'epaules'].includes(m))
  );
  const pullEx = pool.filter(e =>
    e.muscles.some(m => ['dos', 'lats', 'biceps'].includes(m))
  );

  const paired = new Set();
  if (pushEx.length && pullEx.length) {
    const a = pushEx[0];
    const b = pullEx[0];
    a.supersetWith = b.exerciseId;
    b.supersetWith = a.exerciseId;
    a.format = 'superset';
    b.format = 'superset';
    paired.add(a.exerciseId);
    paired.add(b.exerciseId);
  }

  return pool; // return with superset flags set
}

// ── Main generator ─────────────────────────────────────────
/**
 * Generate a complete session plan.
 * @param {object} params
 * @param {number} params.duration    - 15 | 25 | 35 | 45
 * @param {string} params.objective   - hypertrophy | strength | endurance | weightloss
 * @param {string} params.focus       - full_body | biceps | push | etc.
 * @param {string[]} params.equipment - user's equipment IDs
 * @param {number} params.vestWeight  - current vest weight in kg
 * @returns {object} session plan
 */
export function generateSession({ duration, objective, focus, equipment, vestWeight = 5 }) {
  const profile   = PROFILES[objective] || PROFILES.hypertrophy;
  const counts    = DURATION_MAP[duration] || DURATION_MAP[35];

  // ── 1. Warmup ─────────────────────────────────────────────
  const warmupPool = EXERCISES.filter(ex => {
    const phaseOk     = ex.phase === 'warmup';
    const equipOk     = ex.equipment.every(eq => equipment.includes(eq));
    const focusMuscles = FOCUS_MUSCLE_PRIORITY[focus];
    const focusOk     = !focusMuscles
      || ex.muscles.some(m => focusMuscles.includes(m))
      || focus === 'full_body';
    return phaseOk && equipOk;
  });

  const warmupExercises = pick(warmupPool, counts.warmupCount)
    .map(ex => applyProfile(ex, { ...profile, sets: [1, 2], restSeconds: 30 }, vestWeight));

  // ── 2. Main exercises ─────────────────────────────────────
  const mainPool = EXERCISES.filter(ex => {
    const phaseOk = ex.phase === 'main';
    const equipOk = ex.equipment.every(eq => equipment.includes(eq));
    const focusOk = !focus || focus === 'full_body'
      ? true
      : ex.focus?.includes(focus);
    return phaseOk && equipOk && focusOk;
  });

  // Fallback: if focus too narrow, broaden to category
  let mainCandidates = mainPool;
  if (mainCandidates.length < counts.mainCount) {
    mainCandidates = EXERCISES.filter(ex =>
      ex.phase === 'main' &&
      ex.equipment.every(eq => equipment.includes(eq))
    );
  }

  let mainExercises = pick(mainCandidates, counts.mainCount)
    .map(ex => applyProfile(ex, profile, vestWeight));

  // Apply superset logic for strength/hypertrophy
  if (['hypertrophy', 'strength'].includes(objective)) {
    mainExercises = buildSupersets(mainExercises, profile);
  }

  // ── 3. Cooldown ───────────────────────────────────────────
  const cooldownPool = EXERCISES.filter(ex => {
    const phaseOk = ex.phase === 'cooldown';
    const equipOk = ex.equipment.every(eq => equipment.includes(eq));
    const focusMuscles = FOCUS_MUSCLE_PRIORITY[focus];
    const focusOk = !focusMuscles
      || ex.muscles.some(m => focusMuscles.includes(m))
      || focus === 'full_body';
    return phaseOk && equipOk;
  });

  const cooldownExercises = pick(cooldownPool, counts.cooldownCount)
    .map(ex => applyProfile(ex, { ...profile, sets: [1, 1], restSeconds: 15 }, vestWeight));

  // ── 4. Assemble session ───────────────────────────────────
  const allExercises = [...warmupExercises, ...mainExercises, ...cooldownExercises];

  const focusLabel  = FOCUS_LABELS[focus]  || focus;
  const objLabel    = profile.label;
  const sessionName = `${objLabel} — ${focusLabel}`;

  return {
    id:              `sess_${Date.now()}`,
    name:            sessionName,
    date:            new Date().toISOString(),
    targetDuration:  duration,
    programType:     objective,
    focus,
    format:          profile.format,
    exercises:       allExercises,
    completed:       false,
    startedAt:       null,
    durationMinutes: null,
  };
}
