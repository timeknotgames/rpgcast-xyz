// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Core Type Definitions
// Shared types across all systems (Dice Godz, PF1e, M&M 3e)
// ═══════════════════════════════════════════════════════════════

// ── GAME SYSTEM SELECTION ──
export type GameSystem = 'dice-godz' | 'pathfinder' | 'mm3e';

// ── TEK8 ELEMENTS ──
export type Element = 'Fire' | 'Earth' | 'Air' | 'Chaos' | 'Ether' | 'Water' | 'Order' | 'Coin';
export type CoreElement = 'Fire' | 'Earth' | 'Air' | 'Chaos' | 'Ether' | 'Water'; // The 6 rolled dice
export type EmergentElement = 'Order' | 'Coin'; // Derived, not rolled

export const ELEMENT_DICE: Record<Element, number> = {
  Fire: 4, Earth: 6, Air: 8, Chaos: 10, Ether: 12, Water: 20, Order: 100, Coin: 2,
};

export const ELEMENT_SENSE: Record<Element, string> = {
  Fire: 'Sight', Earth: 'Smell', Air: 'Touch', Chaos: 'Mind',
  Ether: 'Sound', Water: 'Taste', Order: 'Focus', Coin: 'Instinct',
};

export const ELEMENT_ABILITY: Record<Element, string> = {
  Fire: 'Agility', Earth: 'Endurance', Air: 'Strength', Chaos: 'Willpower',
  Ether: 'Creativity', Water: 'Empathy', Order: 'Intelligence', Coin: 'Ownership',
};

export const CORE_ELEMENTS: CoreElement[] = ['Fire', 'Earth', 'Air', 'Chaos', 'Ether', 'Water'];

// ── DICE ROLLING ──
export interface DiceRoll {
  die: number;            // Max value of die (4, 6, 8, 10, 12, 20, 100, 2)
  roll: number;           // Actual rolled value
  element?: Element;      // Associated element
  attainment: number;     // roll / die (0.0 to 1.0)
  isCritical: boolean;    // roll === die (max roll)
  isFumble: boolean;      // roll === 1
}

// ── ROOM SYSTEM ──
export interface RoomExit {
  direction: string;      // 'north', 'south', 'east', 'west', 'up', 'down', or named
  targetRoomId: string;   // Room ID to move to
  description: string;    // "A dark tunnel leads north"
  locked?: boolean;
  lockCondition?: string; // What unlocks it
  hidden?: boolean;       // Requires search to find
}

export interface RoomItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pickupable: boolean;
  useEffect?: string;     // What happens when used
  checkElement?: Element; // Element for pickup/use check
  checkAttainment?: number; // Required attainment % (0-100)
}

export interface RoomNPC {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hostile: boolean;
  dialogueTreeId?: string;
  combatStatsId?: string;   // References combat stats in the game system
  behavior: 'static' | 'patrol' | 'aggressive' | 'fleeing' | 'sleeping';
}

export interface RoomCheck {
  element: Element;
  attainment: number;     // Required percentage (0-100)
  successText: string;
  failureText: string;
  successEffect?: string; // 'reveal_exit', 'give_item', 'trigger_event', etc.
  failureEffect?: string;
}

export interface RoomEvent {
  id: string;
  trigger: 'enter' | 'examine' | 'use_item' | 'combat_end' | 'talk' | 'play_music';
  triggerData?: string;   // Item ID, NPC ID, etc.
  description: string;
  oneShot: boolean;       // Only triggers once
  effect?: string;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
  level: number;
  act: string;            // 'I', 'II', 'III', 'IV', 'V', 'VI'
  description: string;    // Full text shown on 'look'
  shortDescription: string; // Shown on repeat visits
  exits: RoomExit[];
  items: RoomItem[];
  npcs: RoomNPC[];
  checks: RoomCheck[];    // Available skill checks in the room
  events: RoomEvent[];
  effects: {              // Ongoing room effects
    attainmentModifier?: Partial<Record<Element, number>>; // +/- to attainment checks
    environmentalHazard?: string;
    ambientSound?: string;
  };
}

// ── INVENTORY ──
export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  quantity: number;
  usable: boolean;
  equippable: boolean;
  equipped?: boolean;
  slot?: 'weapon' | 'armor' | 'accessory' | 'consumable';
  effects?: Record<string, number>; // stat modifiers when equipped
}

// ── PLAYER ──
export interface PlayerState {
  id: string;
  name: string;
  emoji: string;
  currentRoomId: string;
  activeSystem: GameSystem;
  inventory: InventoryItem[];
  karma: number;           // 0-100 percentage
  visitedRooms: Set<string>;
  flags: Record<string, boolean | number | string>; // Quest flags, choices, etc.
  // System-specific character sheets stored separately
  diceGodzSheet?: DiceGodzCharacterSheet;
  pathfinderSheet?: PathfinderCharacterSheet;
  mm3eSheet?: MM3eCharacterSheet;
}

// ── DICE GODZ CHARACTER SHEET ──
export interface GWESet {
  setNumber: number;
  rolls: Partial<Record<CoreElement, number>>;
  angle: number;
  isGhost: boolean;
}

export interface ElementalComposition {
  percentages: Record<CoreElement, number>;  // % rolled vs possible per element
  aaaPercentage: number;                     // Sum of all elemental %
  eggPercentages: Record<CoreElement, number>; // AAA% / individual %
}

export interface Opulences {
  strength: number;     // Bala / Air
  beauty: number;       // Shri / Fire
  fame: number;         // Yashas / Ether
  knowledge: number;    // Jnana / Order (emergent)
  wealth: number;       // Aishvarya / Coin (emergent)
  renunciation: number; // Vairagya / Chaos
}

export interface DiceGodzCharacterSheet {
  gweSets: GWESet[];
  totalAngle: number;        // Should be 360
  speed: number;             // Total sets
  power: number;             // Total sets
  karma: number;             // Percentage (0-100)
  elementalComposition: ElementalComposition;
  opulencePoints: number;    // OP to distribute
  opulences: Opulences;
  orderScore: number;        // D100 — karma * 100, grows through gameplay
  wealthState: 'flow' | 'scarcity'; // D2 — based on Renunciation OP
  hp: number;                // Endurance-derived
  maxHp: number;
  currentAngle: number;      // Position in 360° combat
}

// ── PATHFINDER 1e CHARACTER SHEET ──
export type PFAbility = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
export type PFSave = 'Fort' | 'Ref' | 'Will';
export type PFAlignment = 'LG' | 'NG' | 'CG' | 'LN' | 'TN' | 'CN' | 'LE' | 'NE' | 'CE';

export interface PFAbilityScores {
  STR: number; DEX: number; CON: number;
  INT: number; WIS: number; CHA: number;
}

export interface PFSpell {
  name: string;
  level: number;
  school: string;
  description: string;
  saveDC?: number;
  prepared: number;  // Slots remaining
  maxPrepared: number;
}

export interface PFClassFeature {
  name: string;
  description: string;
  usesPerDay?: number;
  usesRemaining?: number;
}

export interface PathfinderCharacterSheet {
  name: string;
  race: string;
  classes: { name: string; level: number }[]; // Gestalt: both classes
  alignment: PFAlignment;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  touchAC: number;
  flatFootedAC: number;
  abilities: PFAbilityScores;
  abilityMods: PFAbilityScores; // Derived: (ability - 10) / 2
  saves: Record<PFSave, number>;
  bab: number;                   // Base Attack Bonus
  cmb: number;                   // Combat Maneuver Bonus
  cmd: number;                   // Combat Maneuver Defense
  initiative: number;
  speed: number;                 // ft
  skills: Record<string, number>; // Skill name → total bonus
  feats: string[];
  classFeatures: PFClassFeature[];
  spells: PFSpell[];
  equipment: string[];
  specialAbilities: string[];    // Racial, template, etc.
}

// ── MUTANTS & MASTERMINDS 3e CHARACTER SHEET ──
export type MM3eAbility = 'STR' | 'STA' | 'AGL' | 'DEX' | 'FGT' | 'INT' | 'AWE' | 'PRE';

export interface MM3ePower {
  name: string;
  type: 'damage' | 'affliction' | 'weaken' | 'move_object' | 'create' |
        'protection' | 'immunity' | 'flight' | 'morph' | 'summon' |
        'senses' | 'communication' | 'comprehend' | 'other';
  rank: number;
  descriptors: string[];
  extras?: string[];
  flaws?: string[];
  cost: number;              // Points per rank
  totalCost: number;
  isArray?: boolean;         // Part of a power array
  arraySlot?: string;        // Which array
}

export interface MM3eCondition {
  name: string;
  degree: number;            // 1-4 for graduated conditions
  description: string;
}

export interface MM3eCharacterSheet {
  name: string;
  identity: string;
  powerLevel: number;        // PL cap
  powerPoints: number;       // Total PP spent
  abilities: Record<MM3eAbility, number>; // Rank (-5 to 20+)
  defenses: {
    dodge: number;
    parry: number;
    fortitude: number;
    toughness: number;
    will: number;
  };
  skills: Record<string, number>; // Skill name → total bonus
  advantages: string[];
  powers: MM3ePower[];
  conditions: MM3eCondition[];   // Current active conditions
  equipment: string[];
  complications: string[];
  bruisePenalty: number;         // Accumulated from failed toughness saves
}

// ── COMBAT ──
export interface CombatAction {
  type: 'attack' | 'defend' | 'use_item' | 'use_ability' | 'flee' | 'talk' | 'play_music' | 'sing';
  targetId?: string;
  itemId?: string;
  abilityId?: string;
  element?: Element;        // For Dice Godz elemental attacks
  angle?: number;           // For 360° combat
}

export interface CombatResult {
  success: boolean;
  attackerRoll: DiceRoll;
  defenderRoll?: DiceRoll;
  damage?: number;
  narrative: string;
  effects?: string[];       // Status effects applied
  isCritical?: boolean;
  triggerEvent?: string;    // Special narrative event triggered
}

export interface CombatState {
  active: boolean;
  system: GameSystem;
  participants: { id: string; name: string; emoji: string; isPlayer: boolean; initiative: number }[];
  turnOrder: string[];      // IDs in initiative order
  currentTurnId: string;
  round: number;
  log: string[];            // Combat narrative log
}

// ── DIALOGUE ──
export interface DialogueNode {
  id: string;
  speaker: string;
  emoji: string;
  text: string;
  choices?: { text: string; nextNodeId: string; condition?: string }[];
  effect?: string;          // Flag to set, item to give, etc.
}

export interface DialogueTree {
  id: string;
  npcId: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

// ── GAME STATE ──
export interface GameState {
  players: Map<string, PlayerState>;
  rooms: Map<string, Room>;
  combat?: CombatState;
  globalFlags: Record<string, boolean | number | string>;
  currentAct: string;       // 'I' through 'VI'
  wanderingEncounterTimer: number;
  messageLog: string[];
}

// ── COMMANDS ──
export type CommandName =
  | 'look' | 'go' | 'north' | 'south' | 'east' | 'west' | 'up' | 'down'
  | 'take' | 'drop' | 'use' | 'equip' | 'unequip'
  | 'inventory' | 'stats' | 'sheet'
  | 'talk' | 'examine' | 'search'
  | 'attack' | 'defend' | 'flee' | 'cast' | 'sing' | 'play'
  | 'roll' | 'check'
  | 'system' | 'help' | 'map' | 'who' | 'say' | 'yell' | 'whisper'
  | 'save' | 'quit';

export interface ParsedCommand {
  command: CommandName;
  args: string[];
  rawInput: string;
}
