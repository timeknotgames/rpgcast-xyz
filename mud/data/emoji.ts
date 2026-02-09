// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Emoji Map
// All characters, NPCs, objects, and elements represented by emoji
// ═══════════════════════════════════════════════════════════════

// ── PLAYER CHARACTERS & ALLIES ──
export const CHAR_EMOJI = {
  jairuviel: '🧚‍♂️',   // Male fairy — Half-Dream Dragon / Half-Lampad
  joseph: '👑',        // King Joseph — Moorish Paladin King
  surtupio: '🦁',      // King Surtupio — Pure Celestial Lion
  buckwild: '🦌',      // Buckwild — Cybernetic Stag God
  phoebe: '🔥',        // Phoebe — Phoenix Healer
  aris: '🏹',          // Aris — Afro-Elven Ranger
  brutus: '🐕',        // Brutus — Brindle Pit Bull Dream Dragon Eidolon
  koa: '🪸',           // Ko'a — Escaped Coral Chaos Shard
  luminara: '🌙',      // LuminaraFae — Anti-Lucifer, light-bearer
  player: '🧙',        // Generic player character
} as const;

// ── VILLAINS & HOSTILE NPCs ──
export const VILLAIN_EMOJI = {
  ancientHagKing: '💀',     // The Father of the Matron Hag
  covenHag: '🧙‍♀️',          // Coven of Seven members
  nightmareSentry: '👁️',    // Nightmare Sentry — dream construct
  sporeDrifter: '🍄',       // Spore Drifter — fungal patrol
  gremlin: '👹',            // Gremlin — corrupted mogwai
  facilityOverseer: '🔬',   // Hag technician
} as const;

// ── CREATURES & NEUTRALS ──
export const CREATURE_EMOJI = {
  mogwai: '🐉',             // Mogwai children — dream dragon offspring
  awakenedMogwai: '✨',     // Awakened Dream Dragon/Trickster Spirit
  eidolon: '🎵',            // Eidolon — JaiRuviel's summoned beings
  protoDragon: '🌟',        // Proto-Dream Dragon (Room 12)
  dreamEcho: '👻',          // Dream Echo — translucent memory replay
} as const;

// ── ITEMS & OBJECTS ──
export const ITEM_EMOJI = {
  soulstone: '💎',          // Soulstone / Dreamstone
  namedSoulstone: '💠',     // Named Soulstone (personal inscription)
  tearOfCompassion: '💧',   // The Tear of Compassion artifact
  blackQuill: '🪶',         // Ancient Hag King's memory quill
  crySword: '⚔️',           // CrySword — living crystal weapon
  dreamcatcherPendant: '📿', // Absorbs fear/nightmare effects
  dreamshadowCloak: '🧥',   // Concealment in dim light
  tradeRouteMap: '🗺️',      // Dream Trade Route Map
  recipeOfReversal: '📜',   // Recipe to un-curse midnight food
  midnightBread: '🍞',      // Cursed food — triggers gremlin transformation
  instrument: '🎻',         // Generic instrument
  erhu: '🎻',               // Erhu — D20 Water Flow Instrument
} as const;

// ── ELEMENTS (TEK8) ──
export const ELEMENT_EMOJI = {
  Fire: '🔥',     // D4 — Sight — Agility
  Earth: '🌱',    // D6 — Smell — Endurance
  Air: '🌬️',     // D8 — Touch — Strength
  Chaos: '🌀',    // D10 — Mind — Willpower
  Ether: '✨',    // D12 — Sound — Creativity
  Water: '🌊',    // D20 — Taste — Empathy
  Order: '⚪',    // D100 — Focus — Intelligence (emergent)
  Coin: '🪙',     // D2 — Instinct — Ownership (emergent)
} as const;

// ── ENVIRONMENT ──
export const ENV_EMOJI = {
  door: '🚪',
  lockedDoor: '🔒',
  stairs: '🪜',
  up: '⬆️',
  down: '⬇️',
  north: '⬆️',
  south: '⬇️',
  east: '➡️',
  west: '⬅️',
  treasure: '🗝️',
  trap: '⚠️',
  rest: '🛏️',
  water: '💦',
  fungus: '🍄',
  cage: '🔗',
  machine: '⚙️',
  ruins: '🏚️',
  light: '💡',
  darkness: '🌑',
  music: '🎶',
  silence: '🤫',
  flood: '🌊',
  fire: '🔥',
  dream: '💭',
} as const;

// ── UI ELEMENTS ──
export const UI_EMOJI = {
  hp: '❤️',
  mana: '🔮',
  karma: '☯️',
  attack: '⚔️',
  defense: '🛡️',
  gold: '🪙',
  xp: '⭐',
  level: '📊',
  critical: '💥',
  miss: '💨',
  heal: '💚',
  buff: '⬆️',
  debuff: '⬇️',
  death: '☠️',
  victory: '🏆',
  quest: '📋',
  inventory: '🎒',
  map: '🗺️',
  chat: '💬',
  system: '📢',
  dice: '🎲',
  separator: '═',
} as const;

// ── ROOM TYPE INDICATORS ──
export const ROOM_EMOJI = {
  tunnel: '🕳️',
  cavern: '🏔️',
  chamber: '🏛️',
  corridor: '🚶',
  cage: '🔗',
  vault: '🏦',
  quarters: '🏠',
  arena: '🏟️',
  throne: '🪑',
  shrine: '⛩️',
} as const;

// Helper to render a room's emoji map showing occupants
export function renderRoomView(
  roomEmoji: string,
  occupants: { emoji: string; name: string; position?: string }[],
  items: { emoji: string; name: string }[],
  exits: { direction: string; emoji: string }[]
): string {
  const lines: string[] = [];

  lines.push('┌─────────────────────────────┐');
  lines.push(`│  ${roomEmoji}  Room View                │`);
  lines.push('├─────────────────────────────┤');

  if (occupants.length > 0) {
    lines.push('│ Beings:                     │');
    for (const o of occupants) {
      const label = `│   ${o.emoji} ${o.name}`;
      lines.push(label.padEnd(30) + '│');
    }
  }

  if (items.length > 0) {
    lines.push('│ Items:                      │');
    for (const i of items) {
      const label = `│   ${i.emoji} ${i.name}`;
      lines.push(label.padEnd(30) + '│');
    }
  }

  if (exits.length > 0) {
    lines.push('│ Exits:                      │');
    for (const e of exits) {
      const label = `│   ${e.emoji} ${e.direction}`;
      lines.push(label.padEnd(30) + '│');
    }
  }

  lines.push('└─────────────────────────────┘');
  return lines.join('\n');
}

export type CharEmoji = typeof CHAR_EMOJI;
export type VillainEmoji = typeof VILLAIN_EMOJI;
export type CreatureEmoji = typeof CREATURE_EMOJI;
export type ItemEmoji = typeof ITEM_EMOJI;
export type ElementEmoji = typeof ELEMENT_EMOJI;
