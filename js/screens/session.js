/* ═══════════════════════════════════════════════
   WORKOUTPAL — screens/session.js
   Sprint 3: Session picker + active session screen
   ═══════════════════════════════════════════════ */

import { db }                from '../storage/db.js';
import { showToast, haptic } from '../utils/ui.js';
import { generateSession }   from '../engine/generator.js';
import { bodyMapSVG }        from '../data/svgs.js';

// ── Config ────────────────────────────────────────────────
const DURATIONS = [15, 25, 35, 45];

const OBJECTIVES = [
  { id: 'hypertrophy', label: 'Hypertrophie', icon: '💪', sub: 'Volume & masse' },
  { id: 'strength',    label: 'Force',         icon: '🏋️', sub: 'Charges lourdes' },
  { id: 'endurance',   label: 'Endurance',     icon: '🔥', sub: 'Circuits cardio' },
  { id: 'weightloss',  label: 'Perte de poids',icon: '⚡', sub: 'HIIT & brûlage' },
];

const FOCUS_GROUPS = [
  { id: 'full_body',   label: '🌐 Full body'       },
  { id: 'upper_body',  label: '💪 Haut du corps'   },
  { id: 'lower_body',  label: '🦵 Bas du corps'    },
  { id: 'push',        label: '➡️ Push'             },
  { id: 'pull',        label: '⬅️ Pull'             },
  { id: 'core',        label: '🎯 Core'             },
  { id: 'arms',        label: '💪 Bras complets'   },
  { id: 'biceps',      label: '💪 Biceps'           },
  { id: 'triceps',     label: '🔱 Triceps'          },
  { id: 'forearms',    label: '🤜 Avant-bras'       },
  { id: 'chest',       label: '🫀 Pectoraux'        },
  { id: 'shoulders',   label: '🔝 Épaules'          },
  { id: 'back',        label: '🦾 Dos complet'      },
  { id: 'lats',        label: '🔻 Dorsaux'          },
  { id: 'traps',       label: '⛰️ Trapèzes'         },
  { id: 'quads',       label: '🦵 Quadriceps'       },
  { id: 'hamstrings',  label: '🔙 Ischio-jambiers'  },
  { id: 'glutes',      label: '🍑 Fessiers'         },
  { id: 'calves',      label: '🦶 Mollets'          },
];

const FORMAT_LABEL = {
  standard: '',
  superset: 'Superset',
  circuit:  'Circuit',
  amrap:    'AMRAP',
  emom:     'EMOM',
};

const PHASE_LABEL = {
  warmup:   'Échauffement',
  main:     'Entraînement',
  cooldown: 'Récupération',
};

// ── State ─────────────────────────────────────────────────
let pickerState = { duration: 35, objective: null, focus: 'full_body' };
let activeSession = null;     // current session plan
let currentExIndex = 0;       // current exercise index
let currentSetIndex = 0;      // current set index (0-based within exercise)
let sessionContainer = null;  // reference to screen-scroll div
let sessionStartTime = null;

// ═══════════════════════════════════════════════
//  PICKER
// ═══════════════════════════════════════════════

function renderPicker(container) {
  const profile = db.get('profile');
  pickerState.objective = pickerState.objective || profile?.goal || null;

  container.innerHTML = `
    <div class="session-picker">
      <div class="screen-title">Nouvelle<br><span style="color:var(--accent)">Séance</span></div>

      <div class="section-heading">Durée</div>
      <div class="duration-selector">
        ${DURATIONS.map(d => `
          <div class="duration-pill ${pickerState.duration === d ? 'selected' : ''}" data-duration="${d}">
            ${d}<span style="font-size:12px;font-weight:400;margin-left:2px">min</span>
          </div>`).join('')}
      </div>

      <div class="divider"></div>

      <div class="section-heading">Objectif</div>
      <div class="objective-grid">
        ${OBJECTIVES.map(o => `
          <div class="objective-chip ${pickerState.objective === o.id ? 'selected' : ''}" data-objective="${o.id}">
            <div class="objective-chip-icon">${o.icon}</div>
            <div class="objective-chip-label">${o.label}</div>
            <div class="objective-chip-sub">${o.sub}</div>
          </div>`).join('')}
      </div>

      <div class="divider"></div>

      <div class="section-heading">Zone ciblée</div>
      <div class="focus-scroll">
        ${FOCUS_GROUPS.map(f => `
          <div class="focus-chip ${pickerState.focus === f.id ? 'selected' : ''}" data-focus="${f.id}">
            ${f.label}
          </div>`).join('')}
      </div>

      <div class="divider"></div>

      <div style="padding-top:var(--space-3);padding-bottom:var(--space-8);">
        <button class="btn btn-primary" id="btn-start-session">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l9 6-9 6V4z" fill="currentColor"/>
          </svg>
          ${pickerState.objective ? 'Lancer la séance' : 'Choisis un objectif'}
        </button>
      </div>
    </div>
  `;

  // Duration
  container.querySelectorAll('.duration-pill').forEach(p => {
    p.addEventListener('click', () => {
      pickerState.duration = parseInt(p.dataset.duration);
      container.querySelectorAll('.duration-pill').forEach(x =>
        x.classList.toggle('selected', x.dataset.duration === p.dataset.duration));
    });
  });

  // Objective
  container.querySelectorAll('.objective-chip').forEach(c => {
    c.addEventListener('click', () => {
      pickerState.objective = c.dataset.objective;
      container.querySelectorAll('.objective-chip').forEach(x =>
        x.classList.toggle('selected', x.dataset.objective === c.dataset.objective));
      const btn = container.querySelector('#btn-start-session');
      if (btn) btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4l9 6-9 6V4z" fill="currentColor"/>
        </svg>
        Lancer la séance`;
    });
  });

  // Focus
  container.querySelectorAll('.focus-chip').forEach(c => {
    c.addEventListener('click', () => {
      pickerState.focus = c.dataset.focus;
      container.querySelectorAll('.focus-chip').forEach(x =>
        x.classList.toggle('selected', x.dataset.focus === c.dataset.focus));
    });
  });

  // Start button
  container.querySelector('#btn-start-session')?.addEventListener('click', () => {
    if (!pickerState.objective) { showToast('Choisis un objectif 👆'); return; }
    startSession(container);
  });
}

// ═══════════════════════════════════════════════
//  SESSION START
// ═══════════════════════════════════════════════

function startSession(container) {
  const profile = db.get('profile') || {};
  const plan = generateSession({
    duration:   pickerState.duration,
    objective:  pickerState.objective,
    focus:      pickerState.focus,
    equipment:  profile.equipment || [],
    vestWeight: profile.vestWeight || 5,
  });

  activeSession   = plan;
  currentExIndex  = 0;
  currentSetIndex = 0;
  sessionStartTime = Date.now();
  activeSession.startedAt = new Date().toISOString();

  sessionContainer = container;
  renderActiveSession(container);
}

// ═══════════════════════════════════════════════
//  ACTIVE SESSION — MAIN RENDER
// ═══════════════════════════════════════════════

function renderActiveSession(container) {
  if (!activeSession) return;

  const ex       = activeSession.exercises[currentExIndex];
  const total    = activeSession.exercises.length;
  const progress = ((currentExIndex) / total) * 100;
  const phaseLabel = PHASE_LABEL[ex.phase] || ex.phase;
  const isLast   = currentExIndex === total - 1;

  // Completed sets for this exercise
  const completedSets = ex.completedSets || [];
  const setsNeeded    = ex.sets;
  const setsDone      = completedSets.length;

  // Previous best (if any)
  const prs = db.getPRs();
  const pr  = prs[ex.exerciseId];

  container.innerHTML = `
    <!-- ── Header bar ── -->
    <div class="sess-header">
      <button class="btn-icon sess-quit-btn" id="btn-sess-quit" aria-label="Quitter">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="sess-progress-wrap">
        <div class="sess-progress-bar">
          <div class="sess-progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="sess-progress-label">${currentExIndex + 1} / ${total}</div>
      </div>
      <div class="sess-timer-mini" id="sess-elapsed">0:00</div>
    </div>

    <!-- ── Phase label ── -->
    <div class="sess-phase-label">
      <span class="badge ${ex.phase === 'warmup' ? 'badge-warning' : ex.phase === 'cooldown' ? 'badge-success' : 'badge-accent'}">
        ${phaseLabel}
      </span>
      ${ex.format && FORMAT_LABEL[ex.format] ? `<span class="badge badge-neutral" style="margin-left:6px">${FORMAT_LABEL[ex.format]}</span>` : ''}
    </div>

    <!-- ── Exercise name ── -->
    <div class="sess-ex-name">${ex.name}</div>

    <!-- ── Body map ── -->
    <div class="sess-bodymap">
      ${bodyMapSVG(ex.muscles)}
    </div>

    <!-- ── Muscles targeted ── -->
    <div class="sess-muscles">
      ${ex.musclesLabel.map(m => `<span class="badge badge-accent">${m}</span>`).join('')}
    </div>

    <!-- ── Plan for this exercise ── -->
    <div class="sess-plan-row">
      <div class="sess-plan-item">
        <div class="sess-plan-val">${setsNeeded}</div>
        <div class="sess-plan-label">Séries</div>
      </div>
      <div class="sess-plan-item">
        <div class="sess-plan-val">${ex.isTimeBased ? ex.defaultDuration + 's' : ex.reps}</div>
        <div class="sess-plan-label">${ex.isTimeBased ? 'Durée' : 'Reps'}</div>
      </div>
      <div class="sess-plan-item">
        <div class="sess-plan-val">${ex.weight > 0 ? ex.weight + 'kg' : 'BW'}</div>
        <div class="sess-plan-label">Charge</div>
      </div>
      <div class="sess-plan-item">
        <div class="sess-plan-val">${ex.restSeconds}s</div>
        <div class="sess-plan-label">Repos</div>
      </div>
    </div>

    ${pr ? `
    <div class="sess-pr-banner">
      🏆 Record : ${pr.maxWeight > 0 ? pr.maxWeight + 'kg' : ''} ${pr.maxReps > 0 ? '× ' + pr.maxReps + ' reps' : ''}
    </div>` : ''}

    <!-- ── Sets tracker ── -->
    <div class="sess-sets-section">
      <div class="section-heading">Séries</div>
      <div class="sess-sets-list" id="sess-sets-list">
        ${renderSetsList(ex, completedSets, setsNeeded)}
      </div>
    </div>

    <!-- ── Instructions (collapsible) ── -->
    <div class="sess-instructions-wrap" id="sess-instructions-wrap">
      <button class="sess-instructions-toggle" id="btn-instructions-toggle">
        <span>Instructions</span>
        <svg id="instr-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="sess-instructions-body" id="sess-instructions-body" style="display:none;">
        ${ex.instructions}
      </div>
    </div>

    <!-- ── Navigation ── -->
    <div class="sess-nav-row">
      <button class="btn btn-secondary sess-nav-btn" id="btn-prev-ex" ${currentExIndex === 0 ? 'disabled' : ''}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L5 9l6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Préc.
      </button>

      ${setsDone < setsNeeded
        ? `<button class="btn btn-primary sess-main-btn" id="btn-log-set">
             Valider la série ${setsDone + 1}
           </button>`
        : `<button class="btn ${isLast ? 'btn-primary' : 'btn-primary'} sess-main-btn" id="btn-next-ex">
             ${isLast ? '🏁 Terminer la séance' : 'Exercice suivant →'}
           </button>`
      }
    </div>

    <div style="height:var(--space-8)"></div>
  `;

  // ── Bind events ────────────────────────────────────────────
  bindActiveSessionEvents(container, ex);

  // Start elapsed timer
  startElapsedTimer(container);
}

// ── Render individual set rows ─────────────────────────────
function renderSetsList(ex, completedSets, setsNeeded) {
  let html = '';
  for (let i = 0; i < setsNeeded; i++) {
    const done = i < completedSets.length;
    const set  = completedSets[i];

    html += `
      <div class="sess-set-row ${done ? 'done' : i === completedSets.length ? 'active' : 'pending'}"
           data-set-index="${i}">
        <div class="sess-set-num">${i + 1}</div>
        ${done ? `
          <div class="sess-set-info">
            <span class="sess-set-reps">${ex.isTimeBased ? set.duration + 's' : set.reps + ' reps'}</span>
            ${set.weight > 0 ? `<span class="sess-set-weight">${set.weight} kg</span>` : '<span class="sess-set-weight">BW</span>'}
          </div>
          <div class="sess-set-rpe" title="Effort perçu">
            RPE <strong>${set.rpe}</strong>
          </div>
          <div class="sess-set-check">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l4 4 6-6" stroke="var(--success)" stroke-width="2.2" stroke-linecap="round"/>
            </svg>
          </div>
        ` : `
          <div class="sess-set-info">
            <span class="sess-set-reps" style="color:var(--text-tertiary)">
              ${ex.isTimeBased ? ex.defaultDuration + 's' : ex.reps + ' reps'}
            </span>
            <span class="sess-set-weight" style="color:var(--text-tertiary)">
              ${ex.weight > 0 ? ex.weight + ' kg' : 'BW'}
            </span>
          </div>
          <div class="sess-set-rpe" style="color:var(--text-tertiary)">—</div>
          <div class="sess-set-check" style="opacity:0.2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.6"/>
            </svg>
          </div>
        `}
      </div>
    `;
  }
  return html;
}

// ── Bind events for active session ────────────────────────
function bindActiveSessionEvents(container, ex) {
  // Quit
  container.querySelector('#btn-sess-quit')?.addEventListener('click', () => {
    confirmQuit(container);
  });

  // Instructions toggle
  container.querySelector('#btn-instructions-toggle')?.addEventListener('click', () => {
    const body    = container.querySelector('#sess-instructions-body');
    const chevron = container.querySelector('#instr-chevron');
    const open    = body.style.display !== 'none';
    body.style.display = open ? 'none' : 'block';
    chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  // Log set → open input modal
  container.querySelector('#btn-log-set')?.addEventListener('click', () => {
    openSetModal(container, ex);
  });

  // Next exercise
  container.querySelector('#btn-next-ex')?.addEventListener('click', () => {
    const isLast = currentExIndex === activeSession.exercises.length - 1;
    if (isLast) {
      finishSession(container);
    } else {
      currentExIndex++;
      currentSetIndex = 0;
      haptic('medium');
      renderActiveSession(container);
    }
  });

  // Prev exercise
  container.querySelector('#btn-prev-ex')?.addEventListener('click', () => {
    if (currentExIndex > 0) {
      currentExIndex--;
      currentSetIndex = 0;
      renderActiveSession(container);
    }
  });

  // Swipe horizontal to navigate
  initSwipe(container);
}

// ── Set input modal ────────────────────────────────────────
function openSetModal(container, ex) {
  const setNum = (ex.completedSets || []).length + 1;
  const prevSet = ex.completedSets?.slice(-1)[0];

  const defaultReps   = prevSet?.reps   ?? ex.reps;
  const defaultWeight = prevSet?.weight ?? ex.weight;
  const defaultDur    = prevSet?.duration ?? ex.defaultDuration;

  document.getElementById('sess-set-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'sess-set-modal';
  modal.className = 'sess-modal-overlay';
  modal.innerHTML = `
    <div class="sess-modal-sheet">
      <div class="lib-detail-handle"></div>
      <div class="sess-modal-title">Série ${setNum} — ${ex.name}</div>

      ${ex.isTimeBased ? `
        <div class="sess-modal-field">
          <label class="sess-modal-label">Durée (secondes)</label>
          <div class="sess-modal-stepper">
            <button class="stepper-btn" data-field="duration" data-delta="-5">−</button>
            <div class="stepper-value" id="modal-duration">${defaultDur}<span class="stepper-unit">s</span></div>
            <button class="stepper-btn" data-field="duration" data-delta="5">+</button>
          </div>
        </div>
      ` : `
        <div class="sess-modal-field">
          <label class="sess-modal-label">Répétitions</label>
          <div class="sess-modal-stepper">
            <button class="stepper-btn" data-field="reps" data-delta="-1">−</button>
            <div class="stepper-value" id="modal-reps">${defaultReps}<span class="stepper-unit">reps</span></div>
            <button class="stepper-btn" data-field="reps" data-delta="1">+</button>
          </div>
        </div>
      `}

      ${ex.weight !== undefined ? `
        <div class="sess-modal-field">
          <label class="sess-modal-label">Charge</label>
          <div class="sess-modal-stepper">
            <button class="stepper-btn" data-field="weight" data-delta="-0.5">−</button>
            <div class="stepper-value" id="modal-weight">${defaultWeight}<span class="stepper-unit">kg</span></div>
            <button class="stepper-btn" data-field="weight" data-delta="0.5">+</button>
          </div>
        </div>
      ` : ''}

      <div class="sess-modal-field">
        <label class="sess-modal-label">Effort perçu (RPE 1–10)</label>
        <div class="sess-rpe-grid" id="rpe-grid">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
            <button class="sess-rpe-btn ${n === 7 ? 'selected' : ''}" data-rpe="${n}">${n}</button>
          `).join('')}
        </div>
        <div class="sess-rpe-hint" id="rpe-hint">Difficile</div>
      </div>

      <button class="btn btn-primary" id="btn-modal-confirm" style="margin-top:var(--space-5)">
        ✓ Valider la série
      </button>
      <div style="height:calc(env(safe-area-inset-bottom,0px) + 16px)"></div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));

  // Stepper values
  const vals = {
    reps:     defaultReps,
    weight:   defaultWeight,
    duration: defaultDur,
    rpe:      7,
  };

  // Stepper buttons
  modal.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field;
      const delta = parseFloat(btn.dataset.delta);
      vals[field] = Math.max(0, Math.round((vals[field] + delta) * 10) / 10);

      const el = modal.querySelector(`#modal-${field}`);
      if (el) {
        const unit = field === 'reps' ? 'reps' : field === 'duration' ? 's' : 'kg';
        el.innerHTML = `${vals[field]}<span class="stepper-unit">${unit}</span>`;
      }
      haptic('light');
    });
  });

  // RPE selector
  const RPE_HINTS = ['','Très facile','Facile','Modéré','Modéré','Difficile','Difficile','Difficile','Très difficile','Maximum','Maximum absolu'];
  modal.querySelectorAll('.sess-rpe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      vals.rpe = parseInt(btn.dataset.rpe);
      modal.querySelectorAll('.sess-rpe-btn').forEach(b =>
        b.classList.toggle('selected', parseInt(b.dataset.rpe) === vals.rpe));
      const hint = modal.querySelector('#rpe-hint');
      if (hint) hint.textContent = RPE_HINTS[vals.rpe] || '';
      haptic('light');
    });
  });

  // Confirm
  modal.querySelector('#btn-modal-confirm')?.addEventListener('click', () => {
    const setData = {
      reps:     ex.isTimeBased ? ex.reps : vals.reps,
      duration: ex.isTimeBased ? vals.duration : null,
      weight:   vals.weight,
      rpe:      vals.rpe,
    };

    ex.completedSets = ex.completedSets || [];
    ex.completedSets.push(setData);

    // Check for PR
    const vol = setData.weight * setData.reps;
    const isPR = db.updatePR(ex.exerciseId, {
      weight: setData.weight,
      reps:   setData.reps,
      volume: vol,
    });
    if (isPR) showToast('🏆 Nouveau record personnel !', 'accent');

    closeModal();
    haptic('success');
    renderActiveSession(container);
  });

  // Close on backdrop tap
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 350);
  }
}

// ── Confirm quit dialog ────────────────────────────────────
function confirmQuit(container) {
  document.getElementById('sess-quit-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'sess-quit-modal';
  modal.className = 'sess-modal-overlay';
  modal.innerHTML = `
    <div class="sess-modal-sheet" style="padding-bottom:calc(env(safe-area-inset-bottom,0px) + 24px)">
      <div class="lib-detail-handle"></div>
      <div class="sess-modal-title">Quitter la séance ?</div>
      <p style="color:var(--text-secondary);font-size:15px;margin-bottom:var(--space-6);line-height:1.6;">
        La séance sera sauvegardée avec les séries déjà complétées.
      </p>
      <div style="display:flex;flex-direction:column;gap:var(--space-3);">
        <button class="btn btn-danger" id="btn-quit-confirm">Oui, quitter</button>
        <button class="btn btn-secondary" id="btn-quit-cancel">Continuer la séance</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));

  modal.querySelector('#btn-quit-confirm')?.addEventListener('click', () => {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 300);
    saveAndExit(container, false);
  });

  modal.querySelector('#btn-quit-cancel')?.addEventListener('click', () => {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 300);
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('open');
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// ── Finish session ─────────────────────────────────────────
function finishSession(container) {
  saveAndExit(container, true);
}

function saveAndExit(container, completed) {
  if (!activeSession) return;

  stopElapsedTimer();

  const elapsed = Math.round((Date.now() - sessionStartTime) / 60000);
  activeSession.completed       = completed;
  activeSession.durationMinutes = elapsed;

  // Only save if at least 1 set was completed
  const totalSets = activeSession.exercises
    .reduce((acc, ex) => acc + (ex.completedSets?.length || 0), 0);

  if (totalSets > 0) {
    db.saveSession(activeSession);
    showToast(completed ? '🏁 Séance terminée ! Bravo 💪' : '💾 Séance sauvegardée', 'success', 3000);
    haptic('heavy');
  }

  // Reset state
  activeSession    = null;
  currentExIndex   = 0;
  currentSetIndex  = 0;
  sessionStartTime = null;

  // Navigate home
  setTimeout(() => window.WorkoutPAL?.navigate('home'), 400);
}

// ── Elapsed timer ──────────────────────────────────────────
let elapsedInterval = null;

function startElapsedTimer(container) {
  stopElapsedTimer();
  elapsedInterval = setInterval(() => {
    if (!sessionStartTime) return;
    const el = container.querySelector('#sess-elapsed');
    if (!el) { stopElapsedTimer(); return; }
    const secs = Math.floor((Date.now() - sessionStartTime) / 1000);
    const m = Math.floor(secs / 60);
    const s = String(secs % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
  }, 1000);
}

function stopElapsedTimer() {
  if (elapsedInterval) { clearInterval(elapsedInterval); elapsedInterval = null; }
}

// ── Swipe to navigate exercises ────────────────────────────
function initSwipe(container) {
  let startX = 0;
  let startY = 0;
  const THRESHOLD = 60;

  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    // Only trigger on predominantly horizontal swipes
    if (Math.abs(dx) < THRESHOLD || dy > 80) return;

    // Don't swipe if a modal is open
    if (document.getElementById('sess-set-modal')) return;

    const ex = activeSession?.exercises[currentExIndex];
    const setsDone = ex?.completedSets?.length || 0;
    const setsNeeded = ex?.sets || 0;

    if (dx < 0 && setsDone >= setsNeeded) {
      // Swipe left = next exercise (only if all sets done)
      const isLast = currentExIndex === activeSession.exercises.length - 1;
      if (!isLast) { currentExIndex++; currentSetIndex = 0; haptic('medium'); renderActiveSession(container); }
    } else if (dx > 0 && currentExIndex > 0) {
      // Swipe right = previous exercise
      currentExIndex--; currentSetIndex = 0; renderActiveSession(container);
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════

export function renderSession(container, params = {}) {
  sessionContainer = container;

  if (params.autoStart && activeSession) {
    // Resume interrupted session
    renderActiveSession(container);
    return;
  }

  // Reset picker defaults (keep objective from last use)
  pickerState.duration = 35;
  pickerState.focus    = 'full_body';

  renderPicker(container);
}
