// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — NPC Combat Stats & Data
// Multi-system stats for all NPCs across Dice Godz, PF1e, M&M 3e
// ═══════════════════════════════════════════════════════════════

import type {
  DiceGodzCharacterSheet, PathfinderCharacterSheet, MM3eCharacterSheet,
  Element, CoreElement,
} from '../engine/types.js';

// ── NPC COMBAT PROFILE ──
// Each NPC has stats for all 3 game systems so the active system determines combat

export interface NPCCombatProfile {
  id: string;
  name: string;
  emoji: string;
  tier: 'minion' | 'standard' | 'elite' | 'boss';

  // Dice Godz stats
  diceGodz: {
    primaryElement: CoreElement;
    attainments: Partial<Record<CoreElement, number>>; // percentage 0-100
    hp: number;
    maxHp: number;
    karma: number;
    angle: number; // position in 360° combat
    specialAbility?: string;
  };

  // Pathfinder 1e stats
  pathfinder: {
    hp: number;
    maxHp: number;
    ac: number;
    touchAC: number;
    flatFootedAC: number;
    bab: number;
    saves: { Fort: number; Ref: number; Will: number };
    attacks: { name: string; bonus: number; damage: string; critRange?: number; critMult?: number }[];
    specialAbilities: string[];
    cr: number;
  };

  // M&M 3e stats
  mm3e: {
    powerLevel: number;
    abilities: { STR: number; STA: number; AGL: number; DEX: number; FGT: number; INT: number; AWE: number; PRE: number };
    defenses: { dodge: number; parry: number; fortitude: number; toughness: number; will: number };
    attacks: { name: string; bonus: number; effectRank: number; type: 'damage' | 'affliction' | 'weaken' }[];
    conditions: string[];
  };
}

// ═════════════════════════════════════════════
// LEVEL 1 — UPPER TUNNELS NPCs
// ═════════════════════════════════════════════

export const SPORE_DRIFTER: NPCCombatProfile = {
  id: 'spore_drifter',
  name: 'Spore Drifter',
  emoji: '🍄',
  tier: 'minion',

  diceGodz: {
    primaryElement: 'Earth',
    attainments: { Earth: 60, Chaos: 30, Air: 20 },
    hp: 8, maxHp: 8,
    karma: 15,
    angle: 90,
    specialAbility: 'Spore Cloud: D6 Earth (40%+) or -10% to all attainments for 1D4 rounds',
  },

  pathfinder: {
    hp: 13, maxHp: 13, ac: 12, touchAC: 10, flatFootedAC: 12,
    bab: 1,
    saves: { Fort: 4, Ref: 0, Will: 0 },
    attacks: [
      { name: 'Slam', bonus: 2, damage: '1d4+1' },
      { name: 'Spore Cloud (10ft)', bonus: 0, damage: '1d4 Wisdom' },
    ],
    specialAbilities: ['Plant traits', 'Spore cloud (DC 12 Fort)', 'Mindless'],
    cr: 1,
  },

  mm3e: {
    powerLevel: 3,
    abilities: { STR: 1, STA: 2, AGL: -2, DEX: -2, FGT: 0, INT: -5, AWE: -2, PRE: -5 },
    defenses: { dodge: 1, parry: 1, fortitude: 4, toughness: 4, will: -2 },
    attacks: [
      { name: 'Slam', bonus: 2, effectRank: 2, type: 'damage' },
      { name: 'Spore Cloud', bonus: 0, effectRank: 3, type: 'affliction' },
    ],
    conditions: [],
  },
};

export const NIGHTMARE_SENTRY: NPCCombatProfile = {
  id: 'nightmare_sentry',
  name: 'Nightmare Sentry',
  emoji: '👁️',
  tier: 'standard',

  diceGodz: {
    primaryElement: 'Chaos',
    attainments: { Chaos: 65, Fire: 50, Ether: 45, Water: 30 },
    hp: 22, maxHp: 22,
    karma: 25,
    angle: 180,
    specialAbility: 'Fear Gaze: D10 Chaos (55%+) or Frightened for 1D6 rounds. D12 Sound immunity negates.',
  },

  pathfinder: {
    hp: 38, maxHp: 38, ac: 17, touchAC: 13, flatFootedAC: 14,
    bab: 4,
    saves: { Fort: 3, Ref: 5, Will: 6 },
    attacks: [
      { name: 'Shadow Claw', bonus: 7, damage: '1d8+3', critRange: 19 },
      { name: 'Fear Gaze (30ft)', bonus: 0, damage: '0 (DC 16 Will or frightened)' },
    ],
    specialAbilities: ['Darkvision 60ft', 'Fear Gaze (DC 16 Will)', 'Shadow blend', 'Dream-tethered'],
    cr: 4,
  },

  mm3e: {
    powerLevel: 6,
    abilities: { STR: 2, STA: 2, AGL: 3, DEX: 1, FGT: 4, INT: 0, AWE: 4, PRE: 4 },
    defenses: { dodge: 6, parry: 6, fortitude: 5, toughness: 4, will: 8 },
    attacks: [
      { name: 'Shadow Claw', bonus: 8, effectRank: 4, type: 'damage' },
      { name: 'Fear Gaze', bonus: 6, effectRank: 6, type: 'affliction' },
    ],
    conditions: [],
  },
};

export const GREMLIN: NPCCombatProfile = {
  id: 'gremlin',
  name: 'Gremlin',
  emoji: '👹',
  tier: 'minion',

  diceGodz: {
    primaryElement: 'Fire',
    attainments: { Fire: 55, Air: 40, Chaos: 35 },
    hp: 6, maxHp: 6,
    karma: 5,
    angle: 45,
    specialAbility: 'Frenzy: When HP < 50%, all attainments +15% but cannot flee',
  },

  pathfinder: {
    hp: 9, maxHp: 9, ac: 15, touchAC: 13, flatFootedAC: 13,
    bab: 1,
    saves: { Fort: 1, Ref: 4, Will: 1 },
    attacks: [
      { name: 'Bite', bonus: 4, damage: '1d4+1', critRange: 20, critMult: 2 },
      { name: 'Claw', bonus: 4, damage: '1d3+1' },
    ],
    specialAbilities: ['Corrupted mogwai', 'Darkvision 60ft', 'Light sensitivity', 'Pack tactics (+1 per adjacent gremlin)'],
    cr: 1,
  },

  mm3e: {
    powerLevel: 2,
    abilities: { STR: 0, STA: 1, AGL: 3, DEX: 2, FGT: 2, INT: -3, AWE: 1, PRE: -2 },
    defenses: { dodge: 4, parry: 3, fortitude: 2, toughness: 2, will: 1 },
    attacks: [
      { name: 'Bite', bonus: 4, effectRank: 1, type: 'damage' },
      { name: 'Claw', bonus: 4, effectRank: 1, type: 'damage' },
    ],
    conditions: [],
  },
};

// ═════════════════════════════════════════════
// LEVEL 2 — THE FACILITY NPCs
// ═════════════════════════════════════════════

export const FACILITY_OVERSEER: NPCCombatProfile = {
  id: 'facility_overseer',
  name: 'Facility Overseer',
  emoji: '🔬',
  tier: 'standard',

  diceGodz: {
    primaryElement: 'Ether',
    attainments: { Ether: 70, Chaos: 60, Water: 50, Fire: 40 },
    hp: 30, maxHp: 30,
    karma: 35,
    angle: 225,
    specialAbility: 'Hexcode Binding: D12 Ether (60%+) to trap target in soulstone prep for 1D4 rounds',
  },

  pathfinder: {
    hp: 52, maxHp: 52, ac: 18, touchAC: 13, flatFootedAC: 16,
    bab: 5,
    saves: { Fort: 4, Ref: 4, Will: 8 },
    attacks: [
      { name: 'Hexcode Prod', bonus: 6, damage: '1d6+2 plus 1d4 Wisdom drain' },
      { name: 'Dream Siphon (touch)', bonus: 8, damage: '2d6 nonlethal + fatigue' },
    ],
    specialAbilities: ['Hag magic', 'Dream siphon (DC 18 Will)', 'Hexcode binding', 'See Invisibility'],
    cr: 5,
  },

  mm3e: {
    powerLevel: 7,
    abilities: { STR: 1, STA: 2, AGL: 2, DEX: 2, FGT: 3, INT: 6, AWE: 5, PRE: 3 },
    defenses: { dodge: 7, parry: 5, fortitude: 6, toughness: 4, will: 9 },
    attacks: [
      { name: 'Hexcode Prod', bonus: 6, effectRank: 5, type: 'damage' },
      { name: 'Dream Siphon', bonus: 8, effectRank: 7, type: 'weaken' },
      { name: 'Hexcode Binding', bonus: 7, effectRank: 7, type: 'affliction' },
    ],
    conditions: [],
  },
};

export const COVEN_HAG: NPCCombatProfile = {
  id: 'coven_hag',
  name: 'Coven Hag',
  emoji: '🧙‍♀️',
  tier: 'elite',

  diceGodz: {
    primaryElement: 'Chaos',
    attainments: { Chaos: 80, Ether: 75, Water: 65, Fire: 55, Earth: 50, Air: 45 },
    hp: 55, maxHp: 55,
    karma: 45,
    angle: 270,
    specialAbility: 'Nightmare Weave: D10 Chaos (70%+) creates illusion. D20 Water (60%+) to see through.',
  },

  pathfinder: {
    hp: 85, maxHp: 85, ac: 22, touchAC: 15, flatFootedAC: 19,
    bab: 8,
    saves: { Fort: 7, Ref: 6, Will: 12 },
    attacks: [
      { name: 'Claw', bonus: 11, damage: '1d6+4 plus curse', critRange: 20, critMult: 2 },
      { name: 'Nightmare Bolt (120ft)', bonus: 9, damage: '4d6 psychic' },
    ],
    specialAbilities: [
      'Night Hag abilities', 'Coven magic (CL 12)', 'Dream haunting',
      'Heartstone', 'Change shape', 'SR 24', 'DR 10/cold iron and magic',
    ],
    cr: 9,
  },

  mm3e: {
    powerLevel: 10,
    abilities: { STR: 3, STA: 4, AGL: 3, DEX: 2, FGT: 5, INT: 7, AWE: 8, PRE: 6 },
    defenses: { dodge: 8, parry: 7, fortitude: 8, toughness: 8, will: 12 },
    attacks: [
      { name: 'Claw', bonus: 10, effectRank: 6, type: 'damage' },
      { name: 'Nightmare Bolt', bonus: 8, effectRank: 10, type: 'damage' },
      { name: 'Nightmare Weave', bonus: 10, effectRank: 10, type: 'affliction' },
    ],
    conditions: [],
  },
};

export const SLEEP_WALKER: NPCCombatProfile = {
  id: 'sleep_walker',
  name: 'Sleep-Walker',
  emoji: '🧟',
  tier: 'minion',

  diceGodz: {
    primaryElement: 'Water',
    attainments: { Water: 40, Earth: 35, Chaos: 25 },
    hp: 12, maxHp: 12,
    karma: 10,
    angle: 135,
    specialAbility: 'Dream Grasp: If both combatants fail D20 Water (30%+), enter shared dream state',
  },

  pathfinder: {
    hp: 19, maxHp: 19, ac: 11, touchAC: 10, flatFootedAC: 11,
    bab: 2,
    saves: { Fort: 4, Ref: 0, Will: 0 },
    attacks: [
      { name: 'Slam', bonus: 4, damage: '1d6+3' },
    ],
    specialAbilities: ['Undead traits', 'Dream-tethered', 'Cannot be turned (dream magic not divine)'],
    cr: 2,
  },

  mm3e: {
    powerLevel: 4,
    abilities: { STR: 3, STA: 0, AGL: -1, DEX: -1, FGT: 1, INT: -4, AWE: -2, PRE: -4 },
    defenses: { dodge: 2, parry: 2, fortitude: 0, toughness: 4, will: 0 },
    attacks: [
      { name: 'Slam', bonus: 4, effectRank: 4, type: 'damage' },
    ],
    conditions: [],
  },
};

// ═════════════════════════════════════════════
// LEVEL 3 — THE HEART NPCs
// ═════════════════════════════════════════════

export const PROTO_DREAM_DRAGON: NPCCombatProfile = {
  id: 'proto_dream_dragon',
  name: 'Proto-Dream Dragon',
  emoji: '🌟',
  tier: 'elite',

  diceGodz: {
    primaryElement: 'Ether',
    attainments: { Ether: 85, Water: 80, Chaos: 70, Air: 60, Fire: 55, Earth: 50 },
    hp: 80, maxHp: 80,
    karma: 70,
    angle: 0,
    specialAbility: 'Dream Breath: D12 Ether (75%+) — cone of crystalline dreams. Victims must D10 Chaos (60%+) or become soulstone for 1 round.',
  },

  pathfinder: {
    hp: 150, maxHp: 150, ac: 26, touchAC: 12, flatFootedAC: 24,
    bab: 14,
    saves: { Fort: 12, Ref: 10, Will: 14 },
    attacks: [
      { name: 'Bite', bonus: 18, damage: '2d8+8', critRange: 20, critMult: 2 },
      { name: 'Claw', bonus: 18, damage: '1d8+4' },
      { name: 'Dream Breath (60ft cone)', bonus: 0, damage: 'DC 22 Will or crystallize' },
    ],
    specialAbilities: [
      'Dragon traits', 'Dream Breath (DC 22)', 'Frightful presence (DC 20)',
      'DR 10/magic', 'SR 25', 'Fly 80ft (average)',
      'Trapped in the Machine — cannot leave Room R22 without destroying the Dream Splice',
    ],
    cr: 12,
  },

  mm3e: {
    powerLevel: 12,
    abilities: { STR: 8, STA: 8, AGL: 2, DEX: 1, FGT: 8, INT: 6, AWE: 8, PRE: 8 },
    defenses: { dodge: 8, parry: 10, fortitude: 12, toughness: 14, will: 12 },
    attacks: [
      { name: 'Bite', bonus: 12, effectRank: 10, type: 'damage' },
      { name: 'Dream Breath', bonus: 0, effectRank: 12, type: 'affliction' },
    ],
    conditions: [],
  },
};

export const ANCIENT_HAG_KING: NPCCombatProfile = {
  id: 'ancient_hag_king',
  name: 'The Ancient Hag King',
  emoji: '💀',
  tier: 'boss',

  diceGodz: {
    primaryElement: 'Chaos',
    attainments: { Chaos: 95, Ether: 90, Water: 85, Fire: 80, Earth: 75, Air: 70 },
    hp: 120, maxHp: 120,
    karma: 5, // Deeply corrupted — almost no karma
    angle: 0, // Controls the center
    specialAbility: 'Father of Nightmares: All attainment checks in his presence suffer -15%. His angle is always 0 (center). On defeat, all soulstones in the Crying Depths shatter — freeing or destroying their contents.',
  },

  pathfinder: {
    hp: 230, maxHp: 230, ac: 32, touchAC: 18, flatFootedAC: 28,
    bab: 18,
    saves: { Fort: 14, Ref: 12, Will: 20 },
    attacks: [
      { name: 'Quill of Forgotten Names', bonus: 24, damage: '3d6+10 plus name-erasure', critRange: 18, critMult: 3 },
      { name: 'Nightmare Cascade (120ft line)', bonus: 0, damage: 'DC 28 Will or dominated for 1d4 rounds' },
      { name: 'Soul Rend (touch)', bonus: 22, damage: '4d8+8 negative energy plus DC 26 Fort or 2 negative levels' },
    ],
    specialAbilities: [
      'Unique Night Hag Patriarch', 'Ancient coven magic (CL 20)',
      'Dream dominion (all sleeping creatures within 1 mile)',
      'Name-erasure (permanently forget 1 memory on crit)',
      'DR 15/cold iron and good', 'SR 30', 'Regeneration 10 (good and silver)',
      'Heartstone of Ages (if destroyed, permanently dies)',
      'The Four Futures — outcome depends on how players approach',
    ],
    cr: 18,
  },

  mm3e: {
    powerLevel: 15,
    abilities: { STR: 6, STA: 8, AGL: 4, DEX: 3, FGT: 10, INT: 12, AWE: 12, PRE: 14 },
    defenses: { dodge: 10, parry: 12, fortitude: 12, toughness: 14, will: 15 },
    attacks: [
      { name: 'Quill of Forgotten Names', bonus: 14, effectRank: 12, type: 'damage' },
      { name: 'Nightmare Cascade', bonus: 12, effectRank: 15, type: 'affliction' },
      { name: 'Soul Rend', bonus: 14, effectRank: 13, type: 'weaken' },
    ],
    conditions: [],
  },
};

// ═════════════════════════════════════════════
// ALLY / COMPANION NPCs (not hostile)
// ═════════════════════════════════════════════

export const MOGWAI_CHILD: NPCCombatProfile = {
  id: 'mogwai_child',
  name: 'Mogwai Child',
  emoji: '🐉',
  tier: 'minion',

  diceGodz: {
    primaryElement: 'Ether',
    attainments: { Ether: 45, Water: 40, Chaos: 30 },
    hp: 4, maxHp: 4,
    karma: 80,
    angle: 180,
    specialAbility: 'Dream Sing: D12 Ether (35%+) — heals 1d4 HP to nearby allies',
  },

  pathfinder: {
    hp: 6, maxHp: 6, ac: 14, touchAC: 14, flatFootedAC: 12,
    bab: 0,
    saves: { Fort: 0, Ref: 2, Will: 4 },
    attacks: [],
    specialAbilities: ['Dream song (heal 1d4)', 'Tiny size', 'Flight 30ft (perfect)', 'Vulnerability to midnight food'],
    cr: 0.5,
  },

  mm3e: {
    powerLevel: 2,
    abilities: { STR: -4, STA: 0, AGL: 3, DEX: 1, FGT: -2, INT: -2, AWE: 4, PRE: 4 },
    defenses: { dodge: 6, parry: 0, fortitude: 1, toughness: 0, will: 6 },
    attacks: [],
    conditions: [],
  },
};

export const DREAM_ECHO: NPCCombatProfile = {
  id: 'dream_echo',
  name: 'Dream Echo',
  emoji: '👻',
  tier: 'standard',

  diceGodz: {
    primaryElement: 'Water',
    attainments: { Water: 55, Ether: 50, Chaos: 45 },
    hp: 1, maxHp: 1, // Can't be killed, just disrupted
    karma: 50,
    angle: 0,
    specialAbility: 'Memory Replay: Provides information about the facility. Cannot be attacked.',
  },

  pathfinder: {
    hp: 1, maxHp: 1, ac: 10, touchAC: 10, flatFootedAC: 10,
    bab: 0,
    saves: { Fort: 0, Ref: 0, Will: 0 },
    attacks: [],
    specialAbilities: ['Incorporeal', 'Cannot be attacked or harmed', 'Memory replay — provides lore'],
    cr: 0,
  },

  mm3e: {
    powerLevel: 0,
    abilities: { STR: -5, STA: -5, AGL: 0, DEX: 0, FGT: -5, INT: 0, AWE: 4, PRE: 2 },
    defenses: { dodge: 10, parry: 0, fortitude: 0, toughness: 0, will: 8 },
    attacks: [],
    conditions: [],
  },
};

// ── LOOKUP TABLE ──
export const NPC_PROFILES: Record<string, NPCCombatProfile> = {
  spore_drifter: SPORE_DRIFTER,
  nightmare_sentry: NIGHTMARE_SENTRY,
  gremlin: GREMLIN,
  facility_overseer: FACILITY_OVERSEER,
  coven_hag: COVEN_HAG,
  sleep_walker: SLEEP_WALKER,
  proto_dream_dragon: PROTO_DREAM_DRAGON,
  ancient_hag_king: ANCIENT_HAG_KING,
  mogwai_child: MOGWAI_CHILD,
  dream_echo: DREAM_ECHO,
};

/** Get NPC profile by id, fuzzy match on name */
export function getNPCProfile(idOrName: string): NPCCombatProfile | undefined {
  const lower = idOrName.toLowerCase();
  return NPC_PROFILES[lower] ||
    Object.values(NPC_PROFILES).find(p => p.name.toLowerCase().includes(lower));
}
