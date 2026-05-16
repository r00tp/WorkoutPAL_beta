/* ═══════════════════════════════════════════════
   WORKOUTPAL — data/svgs.js
   Body map SVG — front + back silhouette
   with highlighted muscle regions
   ═══════════════════════════════════════════════ */

const C = {
  body:   '#E8E8E6',
  muscle: '#F0F0EE',
  active: '#FF4D00',
  label:  '#AAAAAA',
};

function circle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}
function rect(x, y, w, h, rx, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
}
function ellipse(cx, cy, rx, ry, fill, opacity = 1) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}"/>`;
}

// ── Front figure ──────────────────────────────────────────
function frontFigure(activeIds) {
  const hi = id => activeIds.includes(id);

  const baseShapes = [
    circle(52, 15, 10, C.body),
    `<rect x="47" y="25" width="10" height="6" rx="3" fill="${C.body}"/>`,
    rect(37, 30, 30, 52, 8, C.body),
    rect(20, 32, 12, 34, 6, C.body),
    rect(72, 32, 12, 34, 6, C.body),
    rect(18, 68, 10, 22, 5, C.body),
    rect(76, 68, 10, 22, 5, C.body),
    rect(34, 84, 14, 38, 6, C.body),
    rect(56, 84, 14, 38, 6, C.body),
    rect(35, 124, 12, 32, 6, C.body),
    rect(57, 124, 12, 32, 6, C.body),
  ].join('');

  const muscleShapes = [
    ellipse(44, 42, 8, 8,  hi('pectoraux')  ? C.active : C.muscle, 0.9),
    ellipse(60, 42, 8, 8,  hi('pectoraux')  ? C.active : C.muscle, 0.9),
    ellipse(24, 37, 7, 5,  hi('epaules')    ? C.active : C.muscle, 0.9),
    ellipse(80, 37, 7, 5,  hi('epaules')    ? C.active : C.muscle, 0.9),
    ellipse(25, 50, 5, 9,  hi('biceps')     ? C.active : C.muscle, 0.9),
    ellipse(79, 50, 5, 9,  hi('biceps')     ? C.active : C.muscle, 0.9),
    ellipse(22, 76, 4, 8,  hi('avant_bras') ? C.active : C.muscle, 0.9),
    ellipse(82, 76, 4, 8,  hi('avant_bras') ? C.active : C.muscle, 0.9),
    rect(42, 52, 20, 26, 4, (hi('abdos') || hi('core')) ? C.active : C.muscle),
    ellipse(41, 102, 6, 14, hi('quadriceps') ? C.active : C.muscle, 0.9),
    ellipse(63, 102, 6, 14, hi('quadriceps') ? C.active : C.muscle, 0.9),
    ellipse(41, 136, 5, 10, hi('mollets')   ? C.active : C.muscle, 0.9),
    ellipse(63, 136, 5, 10, hi('mollets')   ? C.active : C.muscle, 0.9),
  ].join('');

  return `<g>${baseShapes}${muscleShapes}</g>`;
}

// ── Back figure ───────────────────────────────────────────
function backFigure(activeIds) {
  const hi = id => activeIds.includes(id);
  const o  = 106;

  const baseShapes = [
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

  const muscleShapes = [
    ellipse(52+o, 38, 16, 7,  hi('trapezes')         ? C.active : C.muscle, 0.9),
    ellipse(44+o, 56,  7, 14, (hi('dos')||hi('lats')) ? C.active : C.muscle, 0.9),
    ellipse(60+o, 56,  7, 14, (hi('dos')||hi('lats')) ? C.active : C.muscle, 0.9),
    ellipse(24+o, 50,  5,  9, hi('triceps')           ? C.active : C.muscle, 0.9),
    ellipse(80+o, 50,  5,  9, hi('triceps')           ? C.active : C.muscle, 0.9),
    ellipse(22+o, 76,  4,  8, hi('avant_bras')        ? C.active : C.muscle, 0.9),
    ellipse(82+o, 76,  4,  8, hi('avant_bras')        ? C.active : C.muscle, 0.9),
    ellipse(24+o, 37,  7,  5, hi('epaules')           ? C.active : C.muscle, 0.9),
    ellipse(80+o, 37,  7,  5, hi('epaules')           ? C.active : C.muscle, 0.9),
    ellipse(43+o, 90,  9, 10, hi('fessiers')          ? C.active : C.muscle, 0.9),
    ellipse(61+o, 90,  9, 10, hi('fessiers')          ? C.active : C.muscle, 0.9),
    ellipse(42+o, 108, 6, 13, hi('ischio_jambiers')   ? C.active : C.muscle, 0.9),
    ellipse(62+o, 108, 6, 13, hi('ischio_jambiers')   ? C.active : C.muscle, 0.9),
    ellipse(41+o, 136, 5, 10, hi('mollets')           ? C.active : C.muscle, 0.9),
    ellipse(63+o, 136, 5, 10, hi('mollets')           ? C.active : C.muscle, 0.9),
  ].join('');

  return `<g>${baseShapes}${muscleShapes}</g>`;
}

// ── Main export ───────────────────────────────────────────
export function bodyMapSVG(muscleIds = []) {
  return `<svg viewBox="0 0 210 172" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${frontFigure(muscleIds)}
    ${backFigure(muscleIds)}
    <line x1="104" y1="10" x2="104" y2="162" stroke="${C.label}" stroke-width="1" stroke-dasharray="3,4"/>
    <text x="52"  y="168" text-anchor="middle" font-size="9" fill="${C.label}" font-family="sans-serif" font-weight="600" letter-spacing="0.5">AVANT</text>
    <text x="158" y="168" text-anchor="middle" font-size="9" fill="${C.label}" font-family="sans-serif" font-weight="600" letter-spacing="0.5">ARRIÈRE</text>
  </svg>`;
}
