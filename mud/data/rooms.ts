// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — All 26 Rooms
// Encoded from CRYING_DEPTHS_DUNGEON_MAP_v1.0.md
// 3 Levels: Upper Tunnels, The Facility, The Heart
// ═══════════════════════════════════════════════════════════════

import type { Room } from '../engine/types.js';

export const ALL_ROOMS: Room[] = [

  // ═════════════════════════════════════════════
  // LEVEL 1: THE UPPER TUNNELS (ACT I-II)
  // ═════════════════════════════════════════════

  {
    id: 'R01',
    name: '🕳️ Rootfall Gateway',
    emoji: '🕳️',
    level: 1, act: 'I',
    description: `The entrance is not built — it is grown. Massive dead roots form an archway, calcified and gray, dripping with phosphorescent condensation. The air smells of wet stone and old grief. This is the dead star's rootfall — the remains of a celestial tree that fell here ages ago. The Night Hags built their facility beneath its corpse.`,
    shortDescription: 'The calcified root archway drips with phosphorescent light. The smell of old grief lingers.',
    exits: [
      { direction: 'south', targetRoomId: 'R02', description: 'A fungal-veined passage descends south' },
      { direction: 'southeast', targetRoomId: 'R03', description: 'A narrower passage branches southeast' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Earth', attainment: 40, successText: 'You detect a chemical sweetness beneath the decay — dream-mucus. Something alive is rotting below.', failureText: 'The air smells damp but you can\'t identify anything unusual.', successEffect: 'reveal_info' },
    ],
    events: [
      { id: 'R01_enter', trigger: 'enter', description: '🌑 You step through the dead roots. Behind you, the surface world fades. The lullabies begin — faint, distant, wrong.', oneShot: true },
    ],
    effects: { ambientSound: 'Distant dripping. Faint lullabies.' },
  },

  {
    id: 'R02',
    name: '🍄 Fungal Gallery',
    emoji: '🍄',
    level: 1, act: 'I',
    description: `A vast cavern of bioluminescent fungal towers, each 10-20 feet tall, pulsing with sickly blue-green light. The towers are veined with dream-mucus — thick, translucent strands that connect them like a neural network. The air thrums.`,
    shortDescription: 'The fungal towers pulse with blue-green light. Dream-mucus connects them like neurons.',
    exits: [
      { direction: 'north', targetRoomId: 'R01', description: 'The root archway is above' },
      { direction: 'east', targetRoomId: 'R03', description: 'A passage leads to the Spore Grotto' },
      { direction: 'south', targetRoomId: 'R05', description: 'A wide corridor continues south' },
    ],
    items: [],
    npcs: [
      { id: 'spore_drifter_1', name: 'Spore Drifters', emoji: '🍄', description: 'Mindless fungal constructs that patrol the gallery, trailing spore-clouds. They do not attack unless the dream-mucus network is disturbed.', hostile: false, behavior: 'patrol' },
    ],
    checks: [
      { element: 'Chaos', attainment: 50, successText: '💭 You touch a fungal tower and receive a flash-vision: the Facility\'s layout from the fungus network\'s perspective. You now have a sense of what lies below.', failureText: 'The tower pulses but reveals nothing.', successEffect: 'reveal_info' },
    ],
    events: [],
    effects: {
      environmentalHazard: 'Dream-mucus contact. Skin touch forces D12 Ether save (40%+) or hallucinate for 1D4 rounds.',
      ambientSound: 'Wet pulsing. Spore-clouds drifting.',
    },
  },

  {
    id: 'R03',
    name: '✨ Spore Grotto',
    emoji: '✨',
    level: 1, act: 'I',
    description: `A smaller cave branching off the gallery. The air is thick with floating spores that glow faintly gold. The ground is carpeted with soft, spongy growth. This place feels... healthier than the rest. Remnants of the original ecosystem before corruption.`,
    shortDescription: 'Golden spores float in warm air. The spongy ground is strangely comforting.',
    exits: [
      { direction: 'west', targetRoomId: 'R02', description: 'Back to the Fungal Gallery' },
      { direction: 'south', targetRoomId: 'R04', description: 'A passage leads deeper' },
    ],
    items: [
      { id: 'dreamcatcher_pendant', name: 'Dreamcatcher Pendant', emoji: '📿', description: 'A delicate pendant woven from luminous spider-silk and tiny crystals. It hums softly. Absorbs one fear or nightmare effect per session.', pickupable: true, checkElement: 'Air', checkAttainment: 50 },
    ],
    npcs: [],
    checks: [],
    events: [
      { id: 'R03_rest', trigger: 'enter', description: '🛏️ The golden spores have a therapeutic quality. Resting here for a moment restores some endurance. But don\'t linger too long...', oneShot: false },
    ],
    effects: { ambientSound: 'Gentle humming. Warmth.' },
  },

  {
    id: 'R04',
    name: '💧 Weeping Alcove',
    emoji: '💧',
    level: 1, act: 'I',
    description: `A natural hollow in the rock wall. Water seeps down the stone in thin rivulets. The sound is not water — it is weeping. The stone itself is crying. The walls contain embedded soulstone fragments — incomplete, cracked, leaking the emotions of their trapped subjects.`,
    shortDescription: 'The stone weeps. Soulstone fragments embedded in the walls leak fragments of grief.',
    exits: [
      { direction: 'north', targetRoomId: 'R03', description: 'Back to the Spore Grotto' },
      { direction: 'south', targetRoomId: 'R05', description: 'Joins the Lullaby Corridor' },
    ],
    items: [
      { id: 'unmarked_soulstone', name: 'Unmarked Soulstone', emoji: '💎', description: 'A small crystal pulsing with faint trapped light. No name, only a production number etched in hexcode. Evidence of the Syndicate\'s operations.', pickupable: true, checkElement: 'Air', checkAttainment: 30 },
    ],
    npcs: [
      { id: 'joseph_echo', name: 'King Joseph (Dream Echo)', emoji: '👑', description: 'A translucent figure in golden armor shimmers among the weeping stones. His crown of dream-light marks him as royalty — even half-erased, his presence commands reverence. His eyes hold centuries of sorrow.', hostile: false, dialogueTreeId: 'dialogue_joseph', behavior: 'static' },
    ],
    checks: [
      { element: 'Ether', attainment: 40, successText: '🎵 You press your ear to the wall. Through the stone, fragments of words: names, pleas, lullabies in broken tongues. Someone named Mira. Someone whispering "I want to go home."', failureText: 'You hear only the weeping of water on stone.', successEffect: 'reveal_info' },
    ],
    events: [
      { id: 'R04_joseph', trigger: 'enter', description: '👑 A translucent figure flickers into being among the weeping stones — a dark-skinned king in golden armor. His dream-echo watches you with ancient, knowing eyes.', oneShot: true },
    ],
    effects: {
      environmentalHazard: 'Emotional hazard: 5+ minutes here forces D20 Water/Empathy check (50%+) or cry uncontrollably for 1D6 rounds (loud — alerts guards).',
      ambientSound: 'Weeping. Dripping. Names half-spoken.',
    },
  },

  {
    id: 'R05',
    name: '🎶 The Lullaby Corridor',
    emoji: '🎶',
    level: 1, act: 'II',
    description: `A long, curving passage where the acoustics amplify every sound. Echoes of lullabies in broken tongues drift through the air — not from any visible source, but from the walls themselves. The melodies are heartbreaking and slightly wrong, like nursery rhymes with the words replaced. These are JaiRuviel's Eidolons, transmitted through stone. You are already inside his dream field.`,
    shortDescription: 'The corridor sings wrong lullabies. Every step echoes with borrowed grief.',
    exits: [
      { direction: 'north', targetRoomId: 'R02', description: 'Back toward the Fungal Gallery' },
      { direction: 'northeast', targetRoomId: 'R04', description: 'The Weeping Alcove branches off' },
      { direction: 'south', targetRoomId: 'R06', description: 'Deeper into the tunnels' },
    ],
    items: [],
    npcs: [],
    checks: [],
    events: [
      { id: 'R05_music_counter', trigger: 'play_music', description: '🎵 Your music rings through the corridor, meeting the lullabies and transforming them. For a moment, the wrongness fades — replaced by something almost beautiful. The party feels the oppressive weight lift.', oneShot: false, effect: 'cancel_debuff' },
    ],
    effects: {
      attainmentModifier: { Chaos: -10 }, // All Mind/Willpower checks at -10%
      ambientSound: 'Lullabies in broken tongues. Echoes upon echoes.',
    },
  },

  {
    id: 'R06',
    name: '🔗 Creche of the Half-Formed',
    emoji: '🔗',
    level: 1, act: 'II',
    description: `Rows of organic pods, each containing a half-formed gremlin — stunted, crying, not fully developed. Some twitch. Some reach out with tiny hands. The pods pulse with dream-mucus, feeding the creatures a cocktail of fear and sadness to keep them in perpetual pre-transformation. Behind the creche: a Hag Technician's journal.`,
    shortDescription: 'Organic pods line the walls. Half-formed gremlins twitch inside, crying softly.',
    exits: [
      { direction: 'north', targetRoomId: 'R05', description: 'Back to the Lullaby Corridor' },
      { direction: 'south', targetRoomId: 'R07', description: 'Guard post ahead (left)' },
      { direction: 'southeast', targetRoomId: 'R08', description: 'Guard post ahead (right)' },
    ],
    items: [
      { id: 'hag_journal', name: 'Hag Technician\'s Journal', emoji: '📜', description: 'Documents gremlin transformation rates, feeding schedules, and references to "the Dreamshard in the Heart." The handwriting is meticulous and cold.', pickupable: true },
    ],
    npcs: [],
    checks: [
      { element: 'Water', attainment: 60, successText: '💚 You carefully coax open a pod. A confused proto-gremlin blinks at you, then scurries into the dark — free, if bewildered. You feel a warmth in your chest.', failureText: '⚠️ The pod ruptures! Panicked gremlins burst forth in all directions!', successEffect: 'free_creature', failureEffect: 'trigger_combat' },
    ],
    events: [],
    effects: { ambientSound: 'Soft crying. Pod membranes pulsing.' },
  },

  {
    id: 'R07',
    name: '👁️ Guard Post Left',
    emoji: '👁️',
    level: 1, act: 'II',
    description: `A reinforced alcove flanking the descent shaft. A soulstone-powered alarm system glows faintly on the wall. Standing guard: a Nightmare Sentry — a semi-corporeal dream construct shaped like your worst fear. It looks different to each viewer.`,
    shortDescription: 'The left guard post. A Nightmare Sentry watches with eyes made of your own fear.',
    exits: [
      { direction: 'north', targetRoomId: 'R06', description: 'Back to the Creche' },
      { direction: 'east', targetRoomId: 'R08', description: 'The right guard post' },
      { direction: 'down', targetRoomId: 'R09', description: 'The Descent Shaft' },
    ],
    items: [],
    npcs: [
      { id: 'nightmare_sentry_L', name: 'Nightmare Sentry', emoji: '👁️', description: 'A shifting, semi-corporeal horror shaped from your deepest fear. It watches without blinking. Immune to physical attacks — only Sound or Empathy can harm it.', hostile: true, behavior: 'static', combatStatsId: 'nightmare_sentry' },
    ],
    checks: [
      { element: 'Fire', attainment: 70, successText: '🤫 You move with perfect silence past the Sentry. It doesn\'t notice you.', failureText: '👁️ The Sentry locks onto you! Its form shifts into something unspeakable.', successEffect: 'bypass', failureEffect: 'trigger_combat' },
    ],
    events: [],
    effects: {},
  },

  {
    id: 'R08',
    name: '👁️ Guard Post Right',
    emoji: '👁️',
    level: 1, act: 'II',
    description: `The mirror of the left guard post. Another Nightmare Sentry, another soulstone alarm. The air between the two posts crackles with nightmare energy.`,
    shortDescription: 'The right guard post. Another Nightmare Sentry guards the descent.',
    exits: [
      { direction: 'north', targetRoomId: 'R06', description: 'Back to the Creche' },
      { direction: 'west', targetRoomId: 'R07', description: 'The left guard post' },
      { direction: 'down', targetRoomId: 'R09', description: 'The Descent Shaft' },
    ],
    items: [],
    npcs: [
      { id: 'nightmare_sentry_R', name: 'Nightmare Sentry', emoji: '👁️', description: 'A shifting horror of personalized fear. It does not blink. It does not breathe. It only watches — and waits.', hostile: true, behavior: 'static', combatStatsId: 'nightmare_sentry' },
    ],
    checks: [],
    events: [],
    effects: {},
  },

  {
    id: 'R09',
    name: '🪜 Descent Shaft',
    emoji: '🪜',
    level: 1, act: 'II',
    description: `A vertical shaft, 60 feet deep, lined with calcified root-tendrils that serve as handholds. The air grows warmer and wetter as you look down. The lullabies grow louder. At the bottom: a faint blue glow and the sound of rain that never stops.`,
    shortDescription: 'The shaft drops 60 feet. Warmth rises from below. The rain never stops down there.',
    exits: [
      { direction: 'up', targetRoomId: 'R07', description: 'Back to the guard posts' },
      { direction: 'down', targetRoomId: 'R10', description: 'Climb down to the Facility' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Air', attainment: 40, successText: 'You descend carefully, finding solid handholds in the calcified roots.', failureText: 'You slip! Sliding 10 feet before catching yourself. Your hands sting.', failureEffect: 'take_damage_1' },
    ],
    events: [
      { id: 'R09_transition', trigger: 'enter', description: '⬇️ At the bottom, root-lined stone gives way to smooth, worked surfaces — bio-magitech corridors that hum with stolen energy. You have entered the Facility.', oneShot: true },
    ],
    effects: {},
  },

  // ═════════════════════════════════════════════
  // LEVEL 2: THE FACILITY (ACT II-III)
  // ═════════════════════════════════════════════

  {
    id: 'R10',
    name: '⚙️ Processing Antechamber',
    emoji: '⚙️',
    level: 2, act: 'II',
    description: `A clinical space. Smooth walls of fused stone and chitin. Bio-magitech conduits run along the ceiling, carrying pulses of blue light — dream energy flowing toward the Heart. Labels in hag-script direct traffic: "MULTIPLICATION →", "ENCODING →", "PRODUCT ←".`,
    shortDescription: 'Clinical bio-magitech corridors. Hag-script signs point toward horror.',
    exits: [
      { direction: 'up', targetRoomId: 'R09', description: 'Back up the shaft' },
      { direction: 'west', targetRoomId: 'R11', description: 'Rain Chamber Alpha' },
      { direction: 'east', targetRoomId: 'R12', description: 'Rain Chamber Beta' },
      { direction: 'south', targetRoomId: 'R13', description: 'The Hexcode Mill' },
    ],
    items: [],
    npcs: [
      { id: 'facility_overseer', name: 'Facility Overseer', emoji: '🔬', description: 'A lesser night hag in technician\'s garb. She looks terrified to see you. Not a combat threat — she may trade information for her life.', hostile: false, behavior: 'fleeing', dialogueTreeId: 'overseer_dialogue' },
    ],
    checks: [],
    events: [],
    effects: { ambientSound: 'Humming conduits. Blue light pulses.' },
  },

  {
    id: 'R11',
    name: '🌧️ Rain Chamber Alpha',
    emoji: '💦',
    level: 2, act: 'II',
    description: `An enormous cylindrical room, 40 feet across. Artificial rain falls continuously from ceiling-mounted dream-condensers. Inside: dozens of mogwai — small, furry, with enormous sad eyes — huddled together under the endless downpour, multiplying in agony. The water is warm and slightly viscous. It smells of tears.`,
    shortDescription: 'Endless rain. Mogwai huddle beneath, multiplying in sorrow.',
    exits: [
      { direction: 'east', targetRoomId: 'R10', description: 'Back to the Antechamber' },
    ],
    items: [],
    npcs: [
      { id: 'mogwai_alpha', name: 'Mogwai Children', emoji: '🐉', description: 'Thirty to fifty small creatures with enormous eyes that have forgotten what "rescue" means. They look up at you with resignation.', hostile: false, behavior: 'static' },
    ],
    checks: [
      { element: 'Fire', attainment: 50, successText: '⚙️ You find and disable the dream-condensers. The rain stops. The mogwai look up, confused by sudden dryness.', failureText: 'The condensers are too complex to disable without more knowledge.', successEffect: 'stop_rain_alpha' },
      { element: 'Water', attainment: 40, successText: '💚 You kneel and open your arms. Several mogwai approach cautiously, then nuzzle against you. They will follow.', failureText: 'The mogwai flinch away. They\'ve been tricked before.', successEffect: 'befriend_mogwai' },
    ],
    events: [],
    effects: { ambientSound: 'Endless rain. Soft sobbing.' },
  },

  {
    id: 'R12',
    name: '🌧️ Rain Chamber Beta',
    emoji: '💦',
    level: 2, act: 'II',
    description: `Another rain chamber, identical to Alpha. But here, one mogwai is different — slightly larger, with faintly iridescent fur. A proto-Dream Dragon, further along in development. It watches you with unmistakable intelligence.`,
    shortDescription: 'Rain Chamber Beta. One mogwai here is different — iridescent, watching, intelligent.',
    exits: [
      { direction: 'west', targetRoomId: 'R10', description: 'Back to the Antechamber' },
    ],
    items: [],
    npcs: [
      { id: 'mogwai_beta', name: 'Mogwai Children', emoji: '🐉', description: 'More mogwai in the rain. Their eyes are dull with acceptance.', hostile: false, behavior: 'static' },
      { id: 'proto_dragon', name: 'Iridescent Mogwai', emoji: '🌟', description: 'Larger than the others. Its fur shimmers with colors that shouldn\'t exist in this dark place. It watches you — not with fear, but with recognition. It knows what you are.', hostile: false, behavior: 'static', dialogueTreeId: 'proto_dragon_dialogue' },
    ],
    checks: [],
    events: [],
    effects: { ambientSound: 'Rain. One voice humming — not sobbing. Humming.' },
  },

  {
    id: 'R13',
    name: '⚙️ The Hexcode Mill',
    emoji: '⚙️',
    level: 2, act: 'II',
    description: `The industrial heart of Level 2. A massive churning machine of bone, crystal, and nightmare-metal. Tubes feed in from the Rain Chambers, carrying concentrated mogwai tears. The machine processes this into soulstone hexcode. The sound is unbearable: a low throbbing hum punctuated by thousands of compressed sobs.`,
    shortDescription: 'The Mill churns. Bone and crystal. The sound of a thousand compressed sobs.',
    exits: [
      { direction: 'north', targetRoomId: 'R10', description: 'Back to the Antechamber' },
      { direction: 'west', targetRoomId: 'R14', description: 'Feeding Station' },
      { direction: 'south', targetRoomId: 'R15', description: 'Soulstone Treasury' },
      { direction: 'east', targetRoomId: 'R16', description: 'Hag Quarters' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Ether', attainment: 60, successText: '🎵 You sing a counter-melody into the Mill. The machine flinches — its output drops. For a moment, the compressed sobs become a whisper of something like relief.', failureText: 'Your voice is swallowed by the machine\'s noise.', successEffect: 'disrupt_mill' },
      { element: 'Chaos', attainment: 70, successText: '💭 You reach into the machine\'s programming with your mind. A vision: the first mogwai it ever processed. A name: Lira. The machine remembers.', failureText: 'The machine\'s complexity overwhelms your mental probe.', successEffect: 'reveal_info' },
    ],
    events: [],
    effects: {
      environmentalHazard: 'Psychic erosion: D6 Endurance check (50%+) every 10 minutes or lose 1 HP.',
      ambientSound: 'THROBBING. Compressed sobs. Grinding crystal.',
    },
  },

  {
    id: 'R14',
    name: '🍞 Feeding Station',
    emoji: '🍞',
    level: 2, act: 'II',
    description: `Racks of enchanted food — midnight bread, cursed confections, poisoned delicacies. All designed to trigger gremlin transformations when fed to mogwai after midnight. The food looks delicious but radiates wrongness.`,
    shortDescription: 'Racks of cursed midnight food. Delicious-looking. Wrong-feeling.',
    exits: [
      { direction: 'east', targetRoomId: 'R13', description: 'Back to the Hexcode Mill' },
    ],
    items: [
      { id: 'midnight_bread', name: 'Midnight Bread', emoji: '🍞', description: 'Warm, fragrant bread. Eating it triggers aggressive confusion. Throwing it at enemies has... unpredictable effects.', pickupable: true, useEffect: 'confusion_self' },
      { id: 'recipe_reversal', name: 'Recipe of Reversal', emoji: '📜', description: 'A hag document describing how to un-curse midnight food. Useful for healing transformed gremlins.', pickupable: true },
    ],
    npcs: [],
    checks: [],
    events: [],
    effects: {},
  },

  {
    id: 'R15',
    name: '💎 Soulstone Treasury',
    emoji: '💎',
    level: 2, act: 'II',
    description: `A vault. Floor to ceiling: shelves of processed soulstones, each glowing faintly with trapped dream-light. Thousands of them. Each one a stolen consciousness. Each inscribed with hexcode that names no name — only a production number. In the back: a shelf of Named Soulstones with personal inscriptions.`,
    shortDescription: 'Thousands of soulstones. Thousands of stolen dreams. One shelf holds names.',
    exits: [
      { direction: 'north', targetRoomId: 'R13', description: 'Back to the Hexcode Mill' },
      { direction: 'south', targetRoomId: 'R17', description: 'Toward the Sleep-Walker\'s Threshold' },
    ],
    items: [
      { id: 'named_soulstones', name: 'Named Soulstones', emoji: '💠', description: 'A bundle of soulstones with personal inscriptions. Names of children. These belong to the ones Joseph\'s scouts found wandering. Returning these will restore their dreaming.', pickupable: true },
    ],
    npcs: [],
    checks: [],
    events: [
      { id: 'R15_weight', trigger: 'enter', description: '💧 The sheer weight of stolen consciousness presses against you. So many dreams. So many names reduced to numbers.', oneShot: true },
    ],
    effects: {
      environmentalHazard: 'Grief check on entry: D20 Water/Empathy (30%+) or disadvantage for 1D4 rounds (but gain 1 Karma).',
    },
  },

  {
    id: 'R16',
    name: '🏠 Hag Quarters',
    emoji: '🏠',
    level: 2, act: 'II',
    description: `Living quarters of the Coven of Seven. Walls decorated with pressed dream-flowers (flowers that exist only in nightmares). Furniture made of solidified sorrow. Mirrors that show your greatest fear instead of your reflection. Journals and correspondence litter the desks.`,
    shortDescription: 'The hags\' quarters. Dream-flower walls. Fear-mirrors. Cold journals.',
    exits: [
      { direction: 'west', targetRoomId: 'R13', description: 'Back to the Hexcode Mill' },
      { direction: 'south', targetRoomId: 'R17', description: 'Toward the Threshold' },
    ],
    items: [
      { id: 'dreamshadow_cloak', name: 'Dreamshadow Cloak', emoji: '🧥', description: 'A cloak woven from solidified shadow. Grants concealment in dim light. +20% to Agility checks in darkness.', pickupable: true },
      { id: 'trade_route_map', name: 'Dream Trade Route Map', emoji: '🗺️', description: 'A detailed map showing soulstone distribution networks across multiple kingdoms. Evidence of the Syndicate\'s reach.', pickupable: true },
    ],
    npcs: [],
    checks: [],
    events: [
      { id: 'R16_letter', trigger: 'examine', triggerData: 'journal', description: '📜 One letter references "The Father" with fearful reverence: "He says we move too fast. He says the old ways were better. He does not stop us, but he watches."', oneShot: true },
    ],
    effects: {},
  },

  {
    id: 'R17',
    name: '💭 The Sleep-Walker\'s Threshold',
    emoji: '💭',
    level: 2, act: 'III',
    description: `A long corridor that shimmers. The air becomes thick, dreamlike. Colors bleed. Sounds delay. You are no longer entirely in the material world — you are entering JaiRuviel's dream field. Each of you sees a brief personal vision: a memory suppressed, a fear unfaced. At the far end, a shimmering Eidolon projection watches with arms open and eyes closed.`,
    shortDescription: 'The corridor shimmers between worlds. Colors bleed. You are entering the dream.',
    exits: [
      { direction: 'north', targetRoomId: 'R15', description: 'Back toward the Treasury' },
      { direction: 'south', targetRoomId: 'R18', description: 'The Inner Gate' },
    ],
    items: [],
    npcs: [
      { id: 'eidolon_projection', name: 'Eidolon Projection', emoji: '🎵', description: 'A shimmering figure with arms open and eyes closed. Not JaiRuviel — an echo of him. It watches without malice. If you approach peacefully, it steps aside.', hostile: false, behavior: 'static' },
    ],
    checks: [],
    events: [
      { id: 'R17_vision', trigger: 'enter', description: '💭 The corridor takes you somewhere private. A flash: your mother\'s face. A door you didn\'t open. A word you didn\'t say. Then — back. The others are blinking too. Nobody speaks.', oneShot: true },
    ],
    effects: {
      attainmentModifier: { Fire: -20, Earth: -20, Air: -20, Chaos: 20, Ether: 20, Water: 20 },
      ambientSound: 'Silence that hums. Colors that sing.',
    },
  },

  {
    id: 'R18',
    name: '🚪 The Inner Gate',
    emoji: '🚪',
    level: 2, act: 'III',
    description: `A door of crystallized dream-mucus. It is warm to the touch. It breathes. Through it, the blue glow intensifies. The lullabies are no longer echoes — they are right there, on the other side, beautiful and terrible.`,
    shortDescription: 'The breathing door. Warm crystal. On the other side: the Heart.',
    exits: [
      { direction: 'north', targetRoomId: 'R17', description: 'Back to the Threshold' },
      { direction: 'south', targetRoomId: 'R19', description: 'Into the Heart', locked: true, lockCondition: 'Open with empathy (D20 Water), force (D8 Air 80%+), or a Named Soulstone.' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Water', attainment: 1, successText: '💧 You place your hand on the warm crystal and think of someone you love. The gate weeps — and opens.', failureText: '', successEffect: 'unlock_inner_gate' },
      { element: 'Air', attainment: 80, successText: '💪 With tremendous effort, you force the crystallized membrane apart. It shrieks as it tears.', failureText: 'The crystal flexes but does not break.', successEffect: 'unlock_inner_gate' },
    ],
    events: [],
    effects: {},
  },

  // ═════════════════════════════════════════════
  // LEVEL 3: THE HEART (ACT III-VI)
  // ═════════════════════════════════════════════

  {
    id: 'R19',
    name: '🎵 Eidolon Chorus Hall',
    emoji: '🎵',
    level: 3, act: 'III',
    description: `A cathedral-sized chamber where a dozen Eidolons float in slow orbit, singing. Their forms are translucent — part dragon, part weeping child, part starlight. The song is the most beautiful and most terrible thing you have ever heard. It is a lullaby of despair. They are not evil. They are enslaved, just as JaiRuviel is.`,
    shortDescription: 'The Eidolons sing. Beautiful. Terrible. Enslaved light making enslaved music.',
    exits: [
      { direction: 'north', targetRoomId: 'R18', description: 'Back through the Inner Gate' },
      { direction: 'west', targetRoomId: 'R20', description: 'Mogwai Nursery West' },
      { direction: 'south', targetRoomId: 'R21', description: 'The Dream Cage' },
      { direction: 'east', targetRoomId: 'R22', description: 'Mogwai Nursery East' },
    ],
    items: [],
    npcs: [
      { id: 'eidolon_chorus', name: 'Eidolon Chorus', emoji: '🎵', description: 'Twelve translucent beings orbiting in song. JaiRuviel\'s summoned companions — made to sing lullabies of despair. Their beauty is a weapon they did not choose.', hostile: false, behavior: 'static' },
    ],
    checks: [
      { element: 'Ether', attainment: 40, successText: '🎵 You sing WITH the Eidolons, harmonizing. The lullaby transforms — still sad, but no longer despairing. Something almost hopeful.', failureText: 'Your voice is lost in their chorus.', successEffect: 'harmonize_eidolons' },
    ],
    events: [],
    effects: {
      attainmentModifier: { Chaos: -10 }, // Drowsiness from lullabies
      ambientSound: 'The most beautiful song you have ever heard. You want to sleep.',
    },
  },

  {
    id: 'R20',
    name: '🐉 Mogwai Nursery West',
    emoji: '🐉',
    level: 3, act: 'III',
    description: `A side chamber where the youngest mogwai sleep — newborns, too young for tear harvesting. They sleep in clusters of 5-10, piled together for warmth, rising and falling with synchronized breathing. Each one is a potential Dream Dragon. Each one carries the seed of the Three Tones.`,
    shortDescription: 'Sleeping mogwai children. Tiny breaths in sync. Seeds of what they could become.',
    exits: [
      { direction: 'east', targetRoomId: 'R19', description: 'Back to the Chorus Hall' },
    ],
    items: [],
    npcs: [
      { id: 'nursery_mogwai_W', name: 'Sleeping Mogwai', emoji: '🐉', description: 'Tiny, furry, breathing in unison. They will not wake unless the Dream Cage is disrupted.', hostile: false, behavior: 'sleeping' },
    ],
    checks: [],
    events: [],
    effects: { ambientSound: 'Tiny breaths. Warmth. Peace that hurts.' },
  },

  {
    id: 'R21',
    name: '🔗 The Dream Cage',
    emoji: '🔗',
    level: 3, act: 'III',
    description: `The heart of the Facility. A sphere of crystallized dream-energy, 20 feet in diameter, hovering 10 feet above the floor. Inside: JaiRuviel Stardust, floating in gentle sleep. His skin shifts between black, green, and purple. His silver-black hair drifts like seaweed. His wings fold and unfold slowly, refracting light into labradorescent fire.

Around the cage: dozens of half-Dream Dragon mogwai flutter, softly sobbing. Their tears flow down the cage's surface into grooves that feed the Hexcode Mill.

He is beautiful. He is a machine of sorrow. His kindness is what makes all of this work.`,
    shortDescription: '🧚‍♂️ The Dream Cage. JaiRuviel floats inside, beautiful and weaponized. Mogwai weep around him.',
    exits: [
      { direction: 'north', targetRoomId: 'R19', description: 'Back to the Chorus Hall' },
      { direction: 'south', targetRoomId: 'R23', description: 'Deeper (only accessible after cage breaks)' },
    ],
    items: [],
    npcs: [
      { id: 'jairuviel_caged', name: 'JaiRuviel Stardust (Caged)', emoji: '🧚‍♂️', description: 'The Dreamshard. Half-Dream Dragon, half-Lampad. His eyes are closed. His wings refract imprisoned light into colors the captors never intended. He does not know you are here — but the Eidolons do.', hostile: true, behavior: 'sleeping', combatStatsId: 'jairuviel_sleepwalker' },
    ],
    checks: [
      { element: 'Water', attainment: 70, successText: '🧚‍♂️💧 You speak through the cage — not words, but feeling. You reach for the person beneath the programming. Something shifts. He hears you.', failureText: 'The cage repels your empathy. The programming holds.', successEffect: 'weaken_cage' },
      { element: 'Ether', attainment: 80, successText: '🎵 You play something that is NOT a lullaby. Something joyful. Something free. The cage cracks.', failureText: 'The cage absorbs your music and turns it into another lullaby.', successEffect: 'crack_cage' },
      { element: 'Chaos', attainment: 90, successText: '💭 A direct psychic contest with JaiRuviel\'s conditioned reflexes. Your mind meets his. For one infinite moment you see everything he has seen. The cage shatters.', failureText: 'His conditioned mind overwhelms yours. You reel back.', successEffect: 'shatter_cage' },
    ],
    events: [
      { id: 'R21_cage_break', trigger: 'combat_end', description: '💥 The Dream Cage dissolves in a cascade of freed light. ALL party members fall asleep simultaneously. The Dream Splice begins...', oneShot: true, effect: 'trigger_dream_splice' },
    ],
    effects: { ambientSound: 'Weeping. Labradorescent light. Heartbreak made visible.' },
  },

  {
    id: 'R22',
    name: '🐉 Mogwai Nursery East',
    emoji: '🐉',
    level: 3, act: 'III',
    description: `Another nursery. These mogwai are slightly older — some dream-walk in their sleep, tiny limbs twitching as they fly through nightmares JaiRuviel didn't choose to give them. One of them is humming. Not a lullaby. Something else. Something it learned in the dark.`,
    shortDescription: 'Older mogwai sleep-walk through nightmares. One hums a song that isn\'t a lullaby.',
    exits: [
      { direction: 'west', targetRoomId: 'R19', description: 'Back to the Chorus Hall' },
    ],
    items: [],
    npcs: [
      { id: 'nursery_mogwai_E', name: 'Sleeping Mogwai', emoji: '🐉', description: 'Slightly older than the western nursery. Some dream-walk. One hums.', hostile: false, behavior: 'sleeping' },
    ],
    checks: [],
    events: [],
    effects: { ambientSound: 'Twitching. Dream-whimpers. One voice humming.' },
  },

  {
    id: 'R23',
    name: '💭 The Dream Splice',
    emoji: '💭',
    level: 3, act: 'IV',
    description: `This room does not physically exist. It is a dimensional overlay that manifests when the Dream Cage breaks. You are asleep. You are in the dream. You face your younger self — the version that committed your worst act, made your cruelest choice.

JaiRuviel is here. Watching. Holding a single tear, luminous, still warm.`,
    shortDescription: '💭 The Dream Splice. You face your younger self. JaiRuviel watches.',
    exits: [
      { direction: 'south', targetRoomId: 'R24', description: 'Wake up (the Flood Basin)' },
    ],
    items: [
      { id: 'tear_of_compassion', name: 'Tear of Compassion', emoji: '💧', description: 'A single perfect dream dragon tear, luminous, still warm. Cannot be sold or traded. Anyone who holds it cannot speak a lie while holding it. Presented to JaiRuviel\'s chosen.', pickupable: true },
    ],
    npcs: [
      { id: 'jairuviel_free', name: 'JaiRuviel Stardust', emoji: '🧚‍♂️', description: 'Free now. Eyes open. He holds the tear. He watches you face yourself with infinite patience. When you are ready, he presses it to your brow: "Now you know what they see when they cry in their sleep."', hostile: false, behavior: 'static', dialogueTreeId: 'jairuviel_dream_splice' },
    ],
    checks: [
      { element: 'Water', attainment: 60, successText: '💧 You face it. You weep. You forgive yourself. You wake transformed. (+1 Karma, +10% all attainment for the session)', failureText: 'You can\'t face it. Not yet. You wake shaken but alive. (-10% attainment for 1D4 rounds)', successEffect: 'dream_splice_success' },
    ],
    events: [],
    effects: { ambientSound: 'Your own heartbeat. Your own memories.' },
  },

  {
    id: 'R24',
    name: '🏟️ The Flood Basin',
    emoji: '🏟️',
    level: 3, act: 'V',
    description: `A massive open chamber — the Facility's central processing floor. Rain Chamber pipes overhead. Hexcode Mill machinery along the walls. The floor is slightly concave, designed to drain... but the drains are old and clogged with years of crystallized tears.

JaiRuviel stands at the center. He turns. He sings three tones none have heard before.

The mogwai pause. Stop crying. And transform.`,
    shortDescription: '🧚‍♂️🎵 The Flood Basin. JaiRuviel sings the Three Tones. The Mogwai Rebellion begins.',
    exits: [
      { direction: 'north', targetRoomId: 'R21', description: 'Back toward the Dream Cage ruins' },
      { direction: 'east', targetRoomId: 'R25', description: 'Machine Control room' },
      { direction: 'south', targetRoomId: 'R26', description: 'The Shattered Console' },
    ],
    items: [],
    npcs: [
      { id: 'jairuviel_singing', name: 'JaiRuviel Stardust', emoji: '🧚‍♂️', description: 'Standing at the center, singing. Three tones. The air trembles. Reality bends. The mogwai are waking up — not into gremlins, but into something the hags never imagined.', hostile: false, behavior: 'static' },
      { id: 'awakened_mogwai', name: 'Awakened Dream Dragons', emoji: '✨', description: 'Former mogwai, now part Dream Dragon, part Trickster Spirit. Fierce, joyful, defiant. They turn on the machines that enslaved them.', hostile: false, behavior: 'aggressive' },
    ],
    checks: [],
    events: [
      { id: 'R24_rebellion', trigger: 'enter', description: '✨🐉✨ THE MOGWAI REBELLION! Mogwai transform into awakened Dream Dragon/Trickster Spirits! The Coven of Seven panics, throwing mogwai into water, shoving midnight bread — but the awakened fight back!', oneShot: true, effect: 'trigger_rebellion' },
    ],
    effects: { ambientSound: 'Three tones. Rushing water. Joyful roaring. Machines breaking.' },
  },

  {
    id: 'R25',
    name: '⚙️ Machine Control',
    emoji: '⚙️',
    level: 3, act: 'V',
    description: `A side room containing the master controls for the Rain Chambers, the Hexcode Mill, and the Facility's dream-energy distribution. During the Rebellion, reaching this room offers tactical options.`,
    shortDescription: 'Master controls for the entire Facility. Strategic advantage during the Rebellion.',
    exits: [
      { direction: 'west', targetRoomId: 'R24', description: 'Back to the Flood Basin' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Fire', attainment: 50, successText: '🌊 You reverse the rain chambers! Water floods the Facility, accelerating the rebellion!', failureText: 'The controls are locked with hag-wards.', successEffect: 'reverse_rain' },
      { element: 'Chaos', attainment: 60, successText: '💥 You overload the Hexcode Mill! A shockwave stuns all remaining hags!', failureText: 'The Mill resists your mental override.', successEffect: 'overload_mill' },
      { element: 'Ether', attainment: 70, successText: '🎵 You broadcast the Three Tones through the Facility\'s speaker system! Mogwai from the deepest tunnels awaken and join the fight!', failureText: 'The speakers crackle but the tones don\'t carry.', successEffect: 'broadcast_tones' },
    ],
    events: [],
    effects: {},
  },

  {
    id: 'R26',
    name: '💀 The Shattered Console',
    emoji: '💀',
    level: 3, act: 'VI',
    description: `When the floods recede and the dreamshadows burn off with dawn's light filtering through cracked ceiling roots...

One remains.

A gaunt figure draped in sorrowful black, with bones that sing when he walks. He sits upon a shattered dream-processing console — the last intact piece of machinery. He is sharpening a quill made from a stolen child's memory.

He had not fought. He had only watched.`,
    shortDescription: '💀 The Ancient Hag King sits on the ruins. Sharpening his quill. Watching.',
    exits: [
      { direction: 'north', targetRoomId: 'R24', description: 'Back to the Flood Basin' },
    ],
    items: [
      { id: 'black_quill', name: 'The Black Quill', emoji: '🪶', description: 'A quill made from a stolen child\'s memory. In the right hands: a relic of teaching. In the wrong hands: a tool of continued manipulation. It depends on what the players choose.', pickupable: false },
    ],
    npcs: [
      { id: 'ancient_hag_king', name: 'The Ancient Hag King', emoji: '💀', description: '"You fools. You\'ve broken the art. We used to harvest slowly... delicately. A single soul, bartered in dream, was a dance — not a factory." He does not fight. He does not flee. He waits for your judgment.', hostile: false, behavior: 'static', dialogueTreeId: 'hag_king_dialogue', combatStatsId: 'ancient_hag_king' },
    ],
    checks: [],
    events: [
      { id: 'R26_finale', trigger: 'enter', description: '🌅 Dawn light filters through cracked roots above. The floods recede. The dreamshadows burn off. One figure remains.\n\n💀 "You fools," he rasps. "You\'ve broken the art."\n\nThe question remains: What do you do with the Ancient Hag King?', oneShot: true, effect: 'trigger_finale' },
      { id: 'R26_jairuviel_peace', trigger: 'enter', description: '\n🧚‍♂️ Nearby, JaiRuviel kneels. Not in worship. Not in exhaustion. But in gratitude. The first mogwai child, tearless now, reaches up and places their small hand on his.\n\nFor the first time since he was taken, he sleeps without chains.', oneShot: true },
    ],
    effects: { ambientSound: 'Dawn birds. Dripping water. Bones singing softly.' },
  },
];
