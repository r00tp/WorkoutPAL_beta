/* ═══════════════════════════════════════════════
   WORKOUTPAL — data/svgs.js
   Body map SVG generator — front + back silhouette
   with highlighted muscle regions
   ═══════════════════════════════════════════════ */

// ── Muscle → view mapping ─────────────────────────────────
// front = visible in front view, back = visible in back view
const MUSCLE_META = {
  pectoraux:        { view: 'front' },
  epaules:          { view: 'both'  },
  biceps:           { view: 'front' },
  triceps:          { view: 'back'  },
  avant_bras:       { view: 'both'  },
  abdos:            { view: 'front' },
  core:             { view: 'front' },
  quadriceps:       { view: 'front' },
  mollets:          { view: 'both'  },
  trapezes:         { view: 'back'  },
  dos:              { view: 'back'  },
  lats:             { view: 'back'  },
  fessiers:         { view: 'back'  },
  ischio_jambiers:  { view: 'back'  },
};

// ── Color palette ─────────────────────────────────────────
const C = {
  body:     '#E8E8E6',   // base body shape
  outline:  '#C8C8C4',   // body outline
  muscle:   '#F2F2F0',   // non-highlighted muscle region
  active:   '#FF4D00',   // highlighted muscle
  activeA:  'rgba(255,77,0,0.18)',  // very light active tint
  label:    '#AAAAAA',
};

// ── Build a shape element ─────────────────────────────────
function circle(cx, cy, r, fill)  { return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`; }
function rect(x, y, w, h, rx, fill) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`; }
function ellipse(cx, cy, rx, ry, fill, opacity = 1) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
}

// ── Front figure (center x=52) ────────────────────────────
function frontFigure(muscles) {
  const hi = id => muscles.includes(id);

  // Base body shapes
  const base = [
    circle(52, 15, 10, C.body),                         // head
    `<rect x="47" y="25" width="10" height="6" rx="3" fill="${C.body}"/>`, // neck
    rect(37, 30, 30, 52, 8, C.body),                    // torso
    rect(20, 32, 12, 34, 6, C.body),                    // L upper arm
    rect(72, 32, 12, 34, 6, C.body),                    // R upper arm
    rect(18, 68, 10, 22, 5, C.body),                    // L forearm
    rect(76, 68, 10, 22, 5, C.body),                    // R forearm
    rect(34, 84, 14, 38, 6, C.body),                    // L thigh
    rect(56, 84, 14, 38, 6, C.body),                    // R thigh
    rect(35, 124, 12, 32, 6, C.body),                   // L calf
    rect(57, 124, 12, 32, 6, C.body),                   // R calf
  ].join('');

  // Muscle highlights
  const muscles = [
    // pectoraux
    ellipse(44, 42, 8, 8, hi('pectoraux') ? C.active : C.muscle, hi('pectoraux') ? 0.9 : 1),
    ellipse(60, 42, 8, 8, hi('pectoraux') ? C.active : C.muscle, hi('pectoraux') ? 0.9 : 1),
    // épaules
    ellipse(24, 37, 7, 5, hi('epaules') ? C.active : C.muscle, hi('epaules') ? 0.9 : 1),
    ellipse(80, 37, 7, 5, hi('epaules') ? C.active : C.muscle, hi('epaules') ? 0.9 : 1),
    // biceps
    ellipse(25, 50, 5, 9, hi('biceps') ? C.active : C.muscle, hi('biceps') ? 0.9 : 1),
    ellipse(79, 50, 5, 9, hi('biceps') ? C.active : C.muscle, hi('biceps') ? 0.9 : 1),
    // avant-bras
    ellipse(22, 76, 4, 8, hi('avant_bras') ? C.active : C.muscle, hi('avant_bras') ? 0.9 : 1),
    ellipse(82, 76, 4, 8, hi('avant_bras') ? C.active : C.muscle, hi('avant_bras') ? 0.9 : 1),
    // abdos / core
    rect(42, 52, 20, 26, 4, hi('abdos') || hi('core') ? C.active : C.muscle),
    // quadriceps
    ellipse(41, 102, 6, 14, hi('quadriceps') ? C.active : C.muscle, hi('quadriceps') ? 0.9 : 1),
    ellipse(63, 102, 6, 14, hi('quadriceps') ? C.active : C.muscle, hi('quadriceps') ? 0.9 : 1),
    // mollets (front visible)
    ellipse(41, 136, 5, 10, hi('mollets') ? C.active : C.muscle, hi('mollets') ? 0.9 : 1),
    ellipse(63, 136, 5, 10, hi('mollets') ? C.active : C.muscle, hi('mollets') ? 0.9 : 1),
  ].join('');

  return `<g>${base}${muscles}</g>`;
}

// ── Back figure (center x=158 = front+106) ───────────────
function backFigure(muscles) {
  const hi = id => muscles.includes(id);
  const o  = 106; // x-offset from front

  // Base body shapes (mirror of front)
  const base = [
    circle(52+o, 15, 10, C.body),
    `<rect x="${47+o}" y="25" width="10" height="6" rx="3" fill="${C.body}"/>`,
    rect(37+o, 30, 30, 52, 8, C.body),
    rect(20+o, 32, 12, 34, 6, C.body),
    rect(72+o, 32, 12, 34, 6, C.body),
    rect(18+o, 68, 10, 22, 5, C.body),
    rect(76+o, 68, 10, 22, 5, C.body),
    rect(34+o, 84, 14, 38, 6, C.body),
    rect(56+o, 84, 14, 38, 6, C.body),
    rect(35+o, 124, 12, 32, 6, C.body),
    rect(57+o, 124, 12, 32, 6, C.body),
  ].join('');

  // Muscle highlights (back-specific)
  const mscls = [
    // trapèzes
    ellipse(52+o, 38, 16, 7,  hi('trapezes') ? C.active : C.muscle, hi('trapezes') ? 0.9 : 1),
    // dos / lats
    ellipse(44+o, 56, 7, 14,  hi('dos') || hi('lats') ? C.active : C.muscle, hi('dos')||hi('lats') ? 0.9 : 1),
    ellipse(60+o, 56, 7, 14,  hi('dos') || hi('lats') ? C.active : C.muscle, hi('dos')||hi('lats') ? 0.9 : 1),
    // triceps (back of upper arm)
    ellipse(24+o, 50, 5, 9,   hi('triceps') ? C.active : C.muscle, hi('triceps') ? 0.9 : 1),
    ellipse(80+o, 50, 5, 9,   hi('triceps') ? C.active : C.muscle, hi('triceps') ? 0.9 : 1),
    // avant-bras (back)
    ellipse(22+o, 76, 4, 8,   hi('avant_bras') ? C.active : C.muscle, hi('avant_bras') ? 0.9 : 1),
    ellipse(82+o, 76, 4, 8,   hi('avant_bras') ? C.active : C.muscle, hi('avant_bras') ? 0.9 : 1),
    // épaules (back)
    ellipse(24+o, 37, 7, 5,   hi('epaules') ? C.active : C.muscle, hi('epaules') ? 0.9 : 1),
    ellipse(80+o, 37, 7, 5,   hi('epaules') ? C.active : C.muscle, hi('epaules') ? 0.9 : 1),
    // fessiers
    ellipse(43+o, 90, 9, 10,  hi('fessiers') ? C.active : C.muscle, hi('fessiers') ? 0.9 : 1),
    ellipse(61+o, 90, 9, 10,  hi('fessiers') ? C.active : C.muscle, hi('fessiers') ? 0.9 : 1),
    // ischio-jambiers
    ellipse(42+o, 108, 6, 13, hi('ischio_jambiers') ? C.active : C.muscle, hi('ischio_jambiers') ? 0.9 : 1),
    ellipse(62+o, 108, 6, 13, hi('ischio_jambiers') ? C.active : C.muscle, hi('ischio_jambiers') ? 0.9 : 1),
    // mollets (back)
    ellipse(41+o, 136, 5, 10, hi('mollets') ? C.active : C.muscle, hi('mollets') ? 0.9 : 1),
    ellipse(63+o, 136, 5, 10, hi('mollets') ? C.active : C.muscle, hi('mollets') ? 0.9 : 1),
  ].join('');

  return `<g>${base}${mscls}</g>`;
}

// ── Main export ───────────────────────────────────────────
/**
 * Generate a front+back body map SVG with highlighted muscles.
 * @param {string[]} muscles — array of muscle IDs to highlight
 * @returns {string} SVG markup string
 */
export function bodyMapSVG(muscles = []) {
  const front = frontFigure(muscles);
  const back  = backFigure(muscles);

  return `<svg viewBox="0 0 210 172" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${front}
    ${back}
    <!-- Divider -->
    <line x1="104" y1="10" x2="104" y2="162" stroke="${C.label}" stroke-width="1" stroke-dasharray="3,4"/>
    <!-- Labels -->
    <text x="52"  y="168" text-anchor="middle" font-size="9" fill="${C.label}" font-family="sans-serif" font-weight="600" letter-spacing="0.5">AVANT</text>
    <text x="158" y="168" text-anchor="middle" font-size="9" fill="${C.label}" font-family="sans-serif" font-weight="600" letter-spacing="0.5">ARRIÈRE</text>
  </svg>`;
}
