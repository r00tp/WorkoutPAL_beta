/* ═══════════════════════════════════════════════
   WORKOUTPAL — data/exercises.js
   Exercise library — 30 exercises
   Catégories : mobilité, push, pull, jambes, core, récupération
   ═══════════════════════════════════════════════ */

/**
 * FOCUS IDs (must match session.js FOCUS_GROUPS):
 * full_body, upper_body, lower_body, push, pull, core
 * arms, biceps, triceps, forearms
 * chest, shoulders
 * back, lats, traps
 * quads, hamstrings, glutes, calves
 *
 * MUSCLE IDs (must match svgs.js MUSCLE_META):
 * pectoraux, epaules, biceps, triceps, avant_bras,
 * abdos, core, quadriceps, mollets,
 * trapezes, dos, lats, fessiers, ischio_jambiers
 *
 * EQUIPMENT IDs (must match profile.js EQUIPMENT_LIST):
 * halteres_5kg, halteres_modulables, hand_grip,
 * elastique, veste_lestee, tapis
 * [] = bodyweight
 */

export const EXERCISES = [

  /* ════════════════════════════════════════
     ÉCHAUFFEMENT / MOBILITÉ
  ════════════════════════════════════════ */

  {
    id: 'rotation_epaules',
    name: 'Rotations d\'épaules',
    category: 'mobilite',
    muscles: ['epaules', 'trapezes'],
    musclesLabel: ['Épaules', 'Trapèzes'],
    equipment: [],
    type: 'mobilite',
    focus: ['full_body', 'upper_body', 'push', 'pull', 'shoulders'],
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 15,
    defaultWeight: 0,
    restSeconds: 30,
    difficulty: 1,
    instructions: 'Debout, bras le long du corps. Effectue de grands cercles vers l\'avant avec les deux épaules simultanément pendant 10 répétitions, puis vers l\'arrière. Amplitude maximale, mouvement lent et contrôlé.',
  },

  {
    id: 'cercles_bras',
    name: 'Cercles de bras',
    category: 'mobilite',
    muscles: ['epaules', 'avant_bras'],
    musclesLabel: ['Épaules', 'Avant-bras'],
    equipment: [],
    type: 'mobilite',
    focus: ['full_body', 'upper_body', 'arms'],
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 12,
    defaultWeight: 0,
    restSeconds: 30,
    difficulty: 1,
    instructions: 'Bras tendus à l\'horizontale sur les côtés. Effectue de petits cercles vers l\'avant pendant 10 répétitions, puis de grands cercles. Inverse le sens. Maintiens les bras à hauteur des épaules tout au long.',
  },

  {
    id: 'rotation_hanches',
    name: 'Rotations de hanches',
    category: 'mobilite',
    muscles: ['core', 'fessiers'],
    musclesLabel: ['Core', 'Fessiers'],
    equipment: [],
    type: 'mobilite',
    focus: ['full_body', 'lower_body', 'core'],
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 10,
    defaultWeight: 0,
    restSeconds: 30,
    difficulty: 1,
    instructions: 'Pieds écartés à largeur de hanches, mains sur les hanches. Effectue de grands cercles avec les hanches, comme si tu utilisais un hula hoop. 10 cercles dans chaque direction. Mouvement fluide et ample.',
  },

  {
    id: 'chat_vache',
    name: 'Chat / Vache',
    category: 'mobilite',
    muscles: ['dos', 'core'],
    musclesLabel: ['Dos', 'Core'],
    equipment: ['tapis'],
    type: 'mobilite',
    focus: ['full_body', 'back', 'core'],
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 10,
    defaultWeight: 0,
    restSeconds: 30,
    difficulty: 1,
    instructions: 'À quatre pattes sur le tapis, poignets sous les épaules, genoux sous les hanches. Inspiration : creuse le dos, lève la tête et le coccyx (vache). Expiration : arrondis le dos, rentre le menton (chat). Enchaîne lentement.',
  },

  {
    id: 'bras_croises',
    name: 'Étirement épaules croisés',
    category: 'mobilite',
    muscles: ['epaules', 'trapezes'],
    musclesLabel: ['Épaules', 'Trapèzes'],
    equipment: [],
    type: 'mobilite',
    focus: ['full_body', 'upper_body', 'shoulders'],
    phase: 'warmup',
    defaultSets: 2,
    defaultReps: 8,
    defaultWeight: 0,
    restSeconds: 20,
    difficulty: 1,
    instructions: 'Debout, amène un bras tendu devant la poitrine à hauteur d\'épaule. Utilise l\'autre bras pour le rapprocher du corps et maintiens 20 secondes. Répète de l\'autre côté. Sens l\'étirement dans l\'épaule arrière.',
  },

  /* ════════════════════════════════════════
     PUSH — Pectoraux / Épaules / Triceps
  ════════════════════════════════════════ */

  {
    id: 'pompes',
    name: 'Pompes',
    category: 'push',
    muscles: ['pectoraux', 'triceps', 'epaules'],
    musclesLabel: ['Pectoraux', 'Triceps', 'Épaules'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['push', 'chest', 'upper_body', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0,
    restSeconds: 90,
    difficulty: 2,
    instructions: 'Mains à largeur d\'épaules sur le tapis, corps gainé en planche. Descends la poitrine jusqu\'à 2–3 cm du sol en pliant les coudes à 45°. Pousse fort vers le haut en expirant. Ne laisse pas les hanches s\'affaisser.',
  },

  {
    id: 'pompes_lestees',
    name: 'Pompes lestées',
    category: 'push',
    muscles: ['pectoraux', 'triceps', 'epaules'],
    musclesLabel: ['Pectoraux', 'Triceps', 'Épaules'],
    equipment: ['tapis', 'veste_lestee'],
    type: 'strength',
    focus: ['push', 'chest', 'upper_body'],
    phase: 'main',
    defaultSets: 4,
    defaultReps: 8,
    defaultWeight: 5,
    restSeconds: 120,
    difficulty: 3,
    instructions: 'Même technique que les pompes classiques, mais avec la veste lestée portée. La résistance additionnelle augmente la surcharge. Contrôle la descente sur 2–3 secondes. Adapte le poids de la veste à ton niveau.',
  },

  {
    id: 'pompes_diamant',
    name: 'Pompes diamant',
    category: 'push',
    muscles: ['triceps', 'pectoraux'],
    musclesLabel: ['Triceps', 'Pectoraux'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['push', 'triceps', 'arms', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0,
    restSeconds: 90,
    difficulty: 3,
    instructions: 'Mains formant un losange (index et pouces se touchent) sous le sternum. Corps en planche rigide. Descends lentement en gardant les coudes proches du corps. Les triceps sont fortement sollicités. Monte en explosif.',
  },

  {
    id: 'presse_epaules_halteres',
    name: 'Développé épaules haltères',
    category: 'push',
    muscles: ['epaules', 'triceps', 'trapezes'],
    musclesLabel: ['Épaules', 'Triceps', 'Trapèzes'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['push', 'shoulders', 'arms', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 5,
    restSeconds: 90,
    difficulty: 2,
    instructions: 'Debout ou assis, haltères à hauteur des épaules, paumes vers l\'avant. Pousse les haltères verticalement jusqu\'à extension complète des bras. Redescends lentement. Garde le dos droit et le core engagé tout au long.',
  },

  {
    id: 'elevations_laterales',
    name: 'Élévations latérales',
    category: 'push',
    muscles: ['epaules'],
    musclesLabel: ['Épaules'],
    equipment: ['halteres_modulables'],
    type: 'strength',
    focus: ['push', 'shoulders', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 3,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Debout, haltères le long du corps, légère flexion des coudes. Lève les bras sur les côtés jusqu\'à hauteur des épaules (pas plus haut). Contrôle la descente sur 2–3 secondes. Évite de balancer le buste.',
  },

  {
    id: 'extensions_triceps',
    name: 'Extensions triceps haltère',
    category: 'push',
    muscles: ['triceps'],
    musclesLabel: ['Triceps'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['push', 'triceps', 'arms', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Debout, tiens un haltère à deux mains au-dessus de la tête, bras tendus. Plie les coudes pour descendre l\'haltère derrière la tête. Les coudes restent fixes, seuls les avant-bras bougent. Remonte en contractant les triceps.',
  },

  /* ════════════════════════════════════════
     PULL — Dos / Biceps / Avant-bras
  ════════════════════════════════════════ */

  {
    id: 'curl_biceps',
    name: 'Curl biceps haltères',
    category: 'pull',
    muscles: ['biceps', 'avant_bras'],
    musclesLabel: ['Biceps', 'Avant-bras'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['pull', 'biceps', 'arms', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Debout, haltères en supination (paumes vers le haut), coudes plaqués contre le buste. Fléchis les coudes pour monter les haltères vers les épaules. Contraction maximale en haut. Descente contrôlée sur 2–3 secondes.',
  },

  {
    id: 'curl_marteau',
    name: 'Curl marteau',
    category: 'pull',
    muscles: ['biceps', 'avant_bras'],
    musclesLabel: ['Biceps', 'Avant-bras'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['pull', 'biceps', 'forearms', 'arms', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 5,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Même position qu\'un curl classique, mais la prise est neutre (pouces vers le haut). Monte les haltères en gardant les poignets neutres. Cette variante cible plus le brachial et les avant-bras que le curl classique.',
  },

  {
    id: 'rowing_haltere',
    name: 'Rowing haltère',
    category: 'pull',
    muscles: ['dos', 'lats', 'biceps', 'trapezes'],
    musclesLabel: ['Dos', 'Dorsaux', 'Biceps', 'Trapèzes'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['pull', 'back', 'lats', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 5,
    restSeconds: 90,
    difficulty: 2,
    instructions: 'Un genou et une main sur une surface stable pour te soutenir, corps parallèle au sol. Tire l\'haltère vers ta hanche en ramenant le coude vers le plafond. Descends lentement. Garde le dos plat et les épaules dans l\'axe.',
  },

  {
    id: 'tirage_elastique',
    name: 'Tirage vertical élastique',
    category: 'pull',
    muscles: ['dos', 'lats', 'biceps'],
    musclesLabel: ['Dos', 'Dorsaux', 'Biceps'],
    equipment: ['elastique'],
    type: 'strength',
    focus: ['pull', 'back', 'lats', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 0,
    restSeconds: 75,
    difficulty: 2,
    instructions: 'Fixe l\'élastique en hauteur (porte, croc). Saisis les extrémités, recule pour créer de la tension. Tire les coudes vers le bas et l\'arrière en contractant les dorsaux. Reviens lentement. Sens l\'étirement des lats à chaque rep.',
  },

  {
    id: 'elevations_frontales',
    name: 'Élévations frontales',
    category: 'pull',
    muscles: ['epaules', 'trapezes'],
    musclesLabel: ['Épaules', 'Trapèzes'],
    equipment: ['halteres_modulables'],
    type: 'strength',
    focus: ['pull', 'shoulders', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 12,
    defaultWeight: 3,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Debout, haltères devant les cuisses, paumes vers le bas. Lève les bras tendus vers l\'avant jusqu\'à hauteur des épaules. Maintiens 1 seconde en haut. Redescends lentement. N\'oscille pas avec le buste.',
  },

  {
    id: 'hand_grip_exercise',
    name: 'Hand grip',
    category: 'pull',
    muscles: ['avant_bras'],
    musclesLabel: ['Avant-bras'],
    equipment: ['hand_grip'],
    type: 'strength',
    focus: ['pull', 'forearms', 'arms'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0,
    restSeconds: 45,
    difficulty: 1,
    instructions: 'Tiens le hand grip dans une main. Serre à fond jusqu\'à fermeture complète, maintiens 1 seconde, puis relâche lentement. Travaille les deux mains en alternance. Concentre-toi sur la contraction des avant-bras et la force de préhension.',
  },

  {
    id: 'facepull_elastique',
    name: 'Face pull élastique',
    category: 'pull',
    muscles: ['epaules', 'trapezes', 'dos'],
    musclesLabel: ['Épaules', 'Trapèzes', 'Dos'],
    equipment: ['elastique'],
    type: 'strength',
    focus: ['pull', 'shoulders', 'back', 'upper_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Fixe l\'élastique à hauteur des yeux. Saisis les deux extrémités, paumes vers le bas. Tire vers le visage en écartant les mains et en faisant pivoter les paumes vers le haut. Les coudes montent à hauteur des épaules. Contrôle le retour.',
  },

  /* ════════════════════════════════════════
     JAMBES — Quadriceps / Ischio / Fessiers / Mollets
  ════════════════════════════════════════ */

  {
    id: 'squat',
    name: 'Squat',
    category: 'jambes',
    muscles: ['quadriceps', 'fessiers'],
    musclesLabel: ['Quadriceps', 'Fessiers'],
    equipment: [],
    type: 'strength',
    focus: ['lower_body', 'quads', 'glutes', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0,
    restSeconds: 75,
    difficulty: 1,
    instructions: 'Pieds à largeur d\'épaules, orteils légèrement ouverts. Pousse les hanches vers l\'arrière et descends jusqu\'à ce que les cuisses soient parallèles au sol (ou plus bas). Genoux dans l\'axe des orteils. Pousse sur les talons pour remonter.',
  },

  {
    id: 'squat_leste',
    name: 'Squat lesté',
    category: 'jambes',
    muscles: ['quadriceps', 'fessiers', 'ischio_jambiers'],
    musclesLabel: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
    equipment: ['veste_lestee'],
    type: 'strength',
    focus: ['lower_body', 'quads', 'glutes', 'full_body'],
    phase: 'main',
    defaultSets: 4,
    defaultReps: 10,
    defaultWeight: 5,
    restSeconds: 120,
    difficulty: 3,
    instructions: 'Même technique que le squat classique, veste lestée portée. La surcharge augmente le travail musculaire. Descente lente et contrôlée sur 3 secondes. Maintiens la posture stricte : dos plat, genoux alignés, regard droit devant.',
  },

  {
    id: 'fentes',
    name: 'Fentes avant',
    category: 'jambes',
    muscles: ['quadriceps', 'fessiers', 'ischio_jambiers'],
    musclesLabel: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['lower_body', 'quads', 'glutes', 'hamstrings', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 0,
    restSeconds: 75,
    difficulty: 2,
    instructions: 'Debout, fais un grand pas vers l\'avant. Descends jusqu\'à ce que le genou arrière frôle le sol, genou avant à 90°. Reviens à la position de départ en poussant sur le talon avant. Alterne les jambes. Garde le buste vertical.',
  },

  {
    id: 'fentes_halteres',
    name: 'Fentes avec haltères',
    category: 'jambes',
    muscles: ['quadriceps', 'fessiers', 'ischio_jambiers'],
    musclesLabel: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['lower_body', 'quads', 'glutes', 'hamstrings'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 8,
    defaultWeight: 5,
    restSeconds: 90,
    difficulty: 3,
    instructions: 'Même technique que les fentes avant, mais avec un haltère dans chaque main le long du corps. La surcharge augmente significativement l\'intensité. Maintiens les épaules en arrière et le buste droit pendant tout le mouvement.',
  },

  {
    id: 'souleve_terre_roumain',
    name: 'Soulevé de terre roumain',
    category: 'jambes',
    muscles: ['ischio_jambiers', 'fessiers', 'dos'],
    musclesLabel: ['Ischio-jambiers', 'Fessiers', 'Dos'],
    equipment: ['halteres_5kg'],
    type: 'strength',
    focus: ['lower_body', 'hamstrings', 'glutes', 'back', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 10,
    defaultWeight: 5,
    restSeconds: 90,
    difficulty: 3,
    instructions: 'Debout, haltères devant les cuisses. Pousse les hanches vers l\'arrière en laissant glisser les haltères le long des jambes. Dos plat, légère flexion des genoux. Descends jusqu\'à sentir l\'étirement des ischio-jambiers. Reviens en contractant les fessiers.',
  },

  {
    id: 'hip_thrust',
    name: 'Hip thrust',
    category: 'jambes',
    muscles: ['fessiers', 'ischio_jambiers', 'core'],
    musclesLabel: ['Fessiers', 'Ischio-jambiers', 'Core'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['lower_body', 'glutes', 'hamstrings'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 15,
    defaultWeight: 0,
    restSeconds: 75,
    difficulty: 2,
    instructions: 'Couché sur le dos, pieds à plat sur le sol, genoux fléchis à 90°. Pousse les hanches vers le plafond en contractant les fessiers. Corps aligné de l\'épaule au genou en haut. Maintiens 1 seconde. Descends lentement. Peut se faire avec haltères sur les hanches.',
  },

  {
    id: 'mollets_debout',
    name: 'Mollets debout',
    category: 'jambes',
    muscles: ['mollets'],
    musclesLabel: ['Mollets'],
    equipment: [],
    type: 'strength',
    focus: ['lower_body', 'calves'],
    phase: 'main',
    defaultSets: 4,
    defaultReps: 20,
    defaultWeight: 0,
    restSeconds: 45,
    difficulty: 1,
    instructions: 'Debout, pieds à largeur de hanches. Monte sur la pointe des pieds le plus haut possible, maintiens 1 seconde. Redescends lentement en 3 secondes. Pour augmenter l\'amplitude, place l\'avant du pied sur un rebord et laisse le talon descendre sous le niveau du sol.',
  },

  /* ════════════════════════════════════════
     CORE — Abdominaux / Gainage
  ════════════════════════════════════════ */

  {
    id: 'planche',
    name: 'Planche (Plank)',
    category: 'core',
    muscles: ['core', 'epaules'],
    musclesLabel: ['Core', 'Épaules'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['core', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 60,
    difficulty: 2,
    isTimeBased: true,
    defaultDuration: 40,
    instructions: 'Sur les avant-bras et les orteils, corps en ligne droite de la tête aux talons. Contracte les abdos, les fessiers et les quadriceps. Ne laisse pas les hanches monter ou s\'affaisser. Regarde le sol. Maintiens la position le temps imparti.',
  },

  {
    id: 'crunchs',
    name: 'Crunchs',
    category: 'core',
    muscles: ['abdos'],
    musclesLabel: ['Abdominaux'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['core'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0,
    restSeconds: 45,
    difficulty: 1,
    instructions: 'Couché sur le dos, genoux fléchis, pieds à plat. Mains derrière la nuque, coudes ouverts. Contracte les abdos pour décoller les épaules du sol, menton légèrement rentré. Ne tire pas sur la nuque. Expire en montant, inspire en redescendant.',
  },

  {
    id: 'russian_twist',
    name: 'Russian Twist',
    category: 'core',
    muscles: ['abdos', 'core'],
    musclesLabel: ['Obliques', 'Core'],
    equipment: ['tapis', 'halteres_modulables'],
    type: 'strength',
    focus: ['core'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 16,
    defaultWeight: 2,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Assis sur le tapis, genoux fléchis, pieds légèrement décollés du sol. Buste à 45°. Tiens un haltère à deux mains. Tourne le buste à droite puis à gauche en touchant le sol de chaque côté. Contrôle le mouvement, ne balance pas.',
  },

  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'core',
    muscles: ['core', 'epaules', 'quadriceps'],
    musclesLabel: ['Core', 'Épaules', 'Quadriceps'],
    equipment: ['tapis'],
    type: 'cardio',
    focus: ['core', 'full_body'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 20,
    defaultWeight: 0,
    restSeconds: 60,
    difficulty: 2,
    instructions: 'Position de pompe haute, mains sous les épaules. Ramène alternativement chaque genou vers la poitrine en un mouvement rapide. Les hanches restent basses. Le rythme peut être rapide (cardio) ou lent et contrôlé (core). Garde le dos droit.',
  },

  {
    id: 'gainage_lateral',
    name: 'Gainage latéral',
    category: 'core',
    muscles: ['core', 'epaules'],
    musclesLabel: ['Obliques', 'Épaules'],
    equipment: ['tapis'],
    type: 'strength',
    focus: ['core'],
    phase: 'main',
    defaultSets: 3,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 45,
    difficulty: 2,
    isTimeBased: true,
    defaultDuration: 30,
    instructions: 'Couché sur le côté, appui sur l\'avant-bras et le bord du pied. Soulève les hanches pour aligner le corps de la tête aux pieds. L\'autre main sur la hanche ou vers le plafond. Maintiens la position sans laisser les hanches tomber. Répète de l\'autre côté.',
  },

  /* ════════════════════════════════════════
     RÉCUPÉRATION ACTIVE
  ════════════════════════════════════════ */

  {
    id: 'etirement_pectoraux',
    name: 'Étirement pectoraux',
    category: 'recuperation',
    muscles: ['pectoraux', 'epaules'],
    musclesLabel: ['Pectoraux', 'Épaules'],
    equipment: [],
    type: 'mobilite',
    focus: ['push', 'chest', 'upper_body', 'full_body'],
    phase: 'cooldown',
    defaultSets: 2,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 15,
    difficulty: 1,
    isTimeBased: true,
    defaultDuration: 30,
    instructions: 'Debout, entrelace les doigts derrière le dos, bras tendus. Ouvre la poitrine vers l\'avant et lève légèrement les bras. Maintiens 30 secondes. Variante : appuie une main contre un mur et pivote le buste pour étirer le pectoral.',
  },

  {
    id: 'etirement_ischio',
    name: 'Étirement ischio-jambiers',
    category: 'recuperation',
    muscles: ['ischio_jambiers', 'dos'],
    musclesLabel: ['Ischio-jambiers', 'Dos'],
    equipment: ['tapis'],
    type: 'mobilite',
    focus: ['lower_body', 'hamstrings', 'full_body'],
    phase: 'cooldown',
    defaultSets: 2,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 15,
    difficulty: 1,
    isTimeBased: true,
    defaultDuration: 30,
    instructions: 'Assis sur le tapis, jambes tendues devant toi. Penche le buste vers l\'avant en gardant le dos droit (ne l\'arrondis pas). Essaie d\'atteindre tes orteils. Maintiens 30 secondes. Tu dois sentir l\'étirement derrière les cuisses, pas dans le bas du dos.',
  },

  {
    id: 'etirement_quadriceps',
    name: 'Étirement quadriceps',
    category: 'recuperation',
    muscles: ['quadriceps', 'fessiers'],
    musclesLabel: ['Quadriceps', 'Fessiers'],
    equipment: [],
    type: 'mobilite',
    focus: ['lower_body', 'quads', 'full_body'],
    phase: 'cooldown',
    defaultSets: 2,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 15,
    difficulty: 1,
    isTimeBased: true,
    defaultDuration: 30,
    instructions: 'Debout, attrape une cheville derrière toi et ramène le talon vers la fesse. Genou vers le bas, hanches droites. Maintiens 30 secondes de chaque côté. Pour l\'équilibre, pose une main sur un mur. Sens l\'étirement à l\'avant de la cuisse.',
  },

  {
    id: 'etirement_dos_enfant',
    name: 'Pose de l\'enfant',
    category: 'recuperation',
    muscles: ['dos', 'lats', 'epaules'],
    musclesLabel: ['Dos', 'Dorsaux', 'Épaules'],
    equipment: ['tapis'],
    type: 'mobilite',
    focus: ['back', 'upper_body', 'full_body'],
    phase: 'cooldown',
    defaultSets: 2,
    defaultReps: 1,
    defaultWeight: 0,
    restSeconds: 15,
    difficulty: 1,
    isTimeBased: true,
    defaultDuration: 40,
    instructions: 'À genoux sur le tapis, assieds-toi sur les talons. Étends les bras devant toi au sol et laisse le front toucher le tapis. Pousse doucement les hanches vers les talons. Maintiens 40 secondes. Respiration profonde pour relâcher le dos.',
  },

];

/* ── Helpers ──────────────────────────────────────────────── */

/** Get exercise by ID */
export function getExercise(id) {
  return EXERCISES.find(e => e.id === id) || null;
}

/** Filter exercises by focus group */
export function getExercisesByFocus(focusId) {
  return EXERCISES.filter(e => e.focus?.includes(focusId));
}

/** Filter exercises by category */
export function getExercisesByCategory(category) {
  return EXERCISES.filter(e => e.category === category);
}

/** Filter exercises by phase (warmup / main / cooldown) */
export function getExercisesByPhase(phase) {
  return EXERCISES.filter(e => e.phase === phase);
}

/** Filter exercises by available equipment */
export function getExercisesByEquipment(availableEquipment) {
  return EXERCISES.filter(e =>
    e.equipment.every(eq => availableEquipment.includes(eq)) ||
    e.equipment.length === 0
  );
}

/** Get exercises matching focus + equipment + phase */
export function getCompatibleExercises({ focus, equipment = [], phase = 'main' }) {
  return EXERCISES.filter(e => {
    const hasEquipment = e.equipment.every(eq => equipment.includes(eq));
    const matchesFocus = !focus || e.focus?.includes(focus);
    const matchesPhase = !phase || e.phase === phase;
    return hasEquipment && matchesFocus && matchesPhase;
  });
}

/** All unique categories */
export const CATEGORIES = [
  { id: 'mobilite',     label: 'Mobilité',     emoji: '🔄' },
  { id: 'push',         label: 'Push',          emoji: '➡️' },
  { id: 'pull',         label: 'Pull',          emoji: '⬅️' },
  { id: 'jambes',       label: 'Jambes',        emoji: '🦵' },
  { id: 'core',         label: 'Core',          emoji: '🎯' },
  { id: 'recuperation', label: 'Récupération',  emoji: '🧘' },
];
