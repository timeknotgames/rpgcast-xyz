export type GameSystem = 'dice-godz' | 'pathfinder' | 'mm3e';
export type Element = 'Fire' | 'Earth' | 'Air' | 'Chaos' | 'Ether' | 'Water' | 'Order' | 'Coin';
export type CoreElement = 'Fire' | 'Earth' | 'Air' | 'Chaos' | 'Ether' | 'Water';
export type EmergentElement = 'Order' | 'Coin';
export declare const ELEMENT_DICE: Record<Element, number>;
export declare const ELEMENT_SENSE: Record<Element, string>;
export declare const ELEMENT_ABILITY: Record<Element, string>;
export declare const CORE_ELEMENTS: CoreElement[];
export interface DiceRoll {
    die: number;
    roll: number;
    element?: Element;
    attainment: number;
    isCritical: boolean;
    isFumble: boolean;
}
export interface RoomExit {
    direction: string;
    targetRoomId: string;
    description: string;
    locked?: boolean;
    lockCondition?: string;
    hidden?: boolean;
}
export interface RoomItem {
    id: string;
    name: string;
    emoji: string;
    description: string;
    pickupable: boolean;
    useEffect?: string;
    checkElement?: Element;
    checkAttainment?: number;
}
export interface RoomNPC {
    id: string;
    name: string;
    emoji: string;
    description: string;
    hostile: boolean;
    dialogueTreeId?: string;
    combatStatsId?: string;
    behavior: 'static' | 'patrol' | 'aggressive' | 'fleeing' | 'sleeping';
}
export interface RoomCheck {
    element: Element;
    attainment: number;
    successText: string;
    failureText: string;
    successEffect?: string;
    failureEffect?: string;
}
export interface RoomEvent {
    id: string;
    trigger: 'enter' | 'examine' | 'use_item' | 'combat_end' | 'talk' | 'play_music';
    triggerData?: string;
    description: string;
    oneShot: boolean;
    effect?: string;
}
export interface Room {
    id: string;
    name: string;
    emoji: string;
    level: number;
    act: string;
    description: string;
    shortDescription: string;
    exits: RoomExit[];
    items: RoomItem[];
    npcs: RoomNPC[];
    checks: RoomCheck[];
    events: RoomEvent[];
    effects: {
        attainmentModifier?: Partial<Record<Element, number>>;
        environmentalHazard?: string;
        ambientSound?: string;
    };
}
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
    effects?: Record<string, number>;
}
export interface PlayerState {
    id: string;
    name: string;
    emoji: string;
    currentRoomId: string;
    activeSystem: GameSystem;
    inventory: InventoryItem[];
    karma: number;
    visitedRooms: Set<string>;
    flags: Record<string, boolean | number | string>;
    diceGodzSheet?: DiceGodzCharacterSheet;
    pathfinderSheet?: PathfinderCharacterSheet;
    mm3eSheet?: MM3eCharacterSheet;
}
export interface GWESet {
    setNumber: number;
    rolls: Partial<Record<CoreElement, number>>;
    angle: number;
    isGhost: boolean;
}
export interface ElementalComposition {
    percentages: Record<CoreElement, number>;
    aaaPercentage: number;
    eggPercentages: Record<CoreElement, number>;
}
export interface Opulences {
    strength: number;
    beauty: number;
    fame: number;
    knowledge: number;
    wealth: number;
    renunciation: number;
}
export interface DiceGodzCharacterSheet {
    gweSets: GWESet[];
    totalAngle: number;
    speed: number;
    power: number;
    karma: number;
    elementalComposition: ElementalComposition;
    opulencePoints: number;
    opulences: Opulences;
    orderScore: number;
    wealthState: 'flow' | 'scarcity';
    hp: number;
    maxHp: number;
    currentAngle: number;
}
export type PFAbility = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
export type PFSave = 'Fort' | 'Ref' | 'Will';
export type PFAlignment = 'LG' | 'NG' | 'CG' | 'LN' | 'TN' | 'CN' | 'LE' | 'NE' | 'CE';
export interface PFAbilityScores {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}
export interface PFSpell {
    name: string;
    level: number;
    school: string;
    description: string;
    saveDC?: number;
    prepared: number;
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
    classes: {
        name: string;
        level: number;
    }[];
    alignment: PFAlignment;
    level: number;
    hp: number;
    maxHp: number;
    ac: number;
    touchAC: number;
    flatFootedAC: number;
    abilities: PFAbilityScores;
    abilityMods: PFAbilityScores;
    saves: Record<PFSave, number>;
    bab: number;
    cmb: number;
    cmd: number;
    initiative: number;
    speed: number;
    skills: Record<string, number>;
    feats: string[];
    classFeatures: PFClassFeature[];
    spells: PFSpell[];
    equipment: string[];
    specialAbilities: string[];
}
export type MM3eAbility = 'STR' | 'STA' | 'AGL' | 'DEX' | 'FGT' | 'INT' | 'AWE' | 'PRE';
export interface MM3ePower {
    name: string;
    type: 'damage' | 'affliction' | 'weaken' | 'move_object' | 'create' | 'protection' | 'immunity' | 'flight' | 'morph' | 'summon' | 'senses' | 'communication' | 'comprehend' | 'other';
    rank: number;
    descriptors: string[];
    extras?: string[];
    flaws?: string[];
    cost: number;
    totalCost: number;
    isArray?: boolean;
    arraySlot?: string;
}
export interface MM3eCondition {
    name: string;
    degree: number;
    description: string;
}
export interface MM3eCharacterSheet {
    name: string;
    identity: string;
    powerLevel: number;
    powerPoints: number;
    abilities: Record<MM3eAbility, number>;
    defenses: {
        dodge: number;
        parry: number;
        fortitude: number;
        toughness: number;
        will: number;
    };
    skills: Record<string, number>;
    advantages: string[];
    powers: MM3ePower[];
    conditions: MM3eCondition[];
    equipment: string[];
    complications: string[];
    bruisePenalty: number;
}
export interface CombatAction {
    type: 'attack' | 'defend' | 'use_item' | 'use_ability' | 'flee' | 'talk' | 'play_music' | 'sing';
    targetId?: string;
    itemId?: string;
    abilityId?: string;
    element?: Element;
    angle?: number;
}
export interface CombatResult {
    success: boolean;
    attackerRoll: DiceRoll;
    defenderRoll?: DiceRoll;
    damage?: number;
    narrative: string;
    effects?: string[];
    isCritical?: boolean;
    triggerEvent?: string;
}
export interface CombatState {
    active: boolean;
    system: GameSystem;
    participants: {
        id: string;
        name: string;
        emoji: string;
        isPlayer: boolean;
        initiative: number;
    }[];
    turnOrder: string[];
    currentTurnId: string;
    round: number;
    log: string[];
}
export interface DialogueNode {
    id: string;
    speaker: string;
    emoji: string;
    text: string;
    choices?: {
        text: string;
        nextNodeId: string;
        condition?: string;
    }[];
    effect?: string;
}
export interface DialogueTree {
    id: string;
    npcId: string;
    startNodeId: string;
    nodes: Record<string, DialogueNode>;
}
export interface GameState {
    players: Map<string, PlayerState>;
    rooms: Map<string, Room>;
    combat?: CombatState;
    globalFlags: Record<string, boolean | number | string>;
    currentAct: string;
    wanderingEncounterTimer: number;
    messageLog: string[];
}
export type CommandName = 'look' | 'go' | 'north' | 'south' | 'east' | 'west' | 'up' | 'down' | 'take' | 'drop' | 'use' | 'equip' | 'unequip' | 'inventory' | 'stats' | 'sheet' | 'talk' | 'examine' | 'search' | 'attack' | 'defend' | 'flee' | 'cast' | 'sing' | 'play' | 'roll' | 'check' | 'system' | 'help' | 'map' | 'who' | 'say' | 'yell' | 'whisper' | 'save' | 'quit' | 'leaderboard' | 'lb' | 'gm';
export interface ParsedCommand {
    command: CommandName;
    args: string[];
    rawInput: string;
}
