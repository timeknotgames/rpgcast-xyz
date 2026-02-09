import type { PlayerState, CombatAction, Element, DiceRoll, RoomNPC } from '../engine/types.js';
export interface UnifiedCheckResult {
    success: boolean;
    narrative: string;
    roll?: DiceRoll;
}
/**
 * Perform a check using the player's active system.
 * In Dice Godz: attainment check on element.
 * In PF1e: skill check (maps element to closest skill).
 * In M&M 3e: standard check against DC.
 */
export declare function performCheck(player: PlayerState, element: Element, requiredPercent: number, label: string): UnifiedCheckResult;
export interface UnifiedAttackResult {
    hit: boolean;
    damage: number;
    narrative: string;
    conditions?: string[];
    isCritical?: boolean;
}
/**
 * Resolve an attack using the player's active system.
 */
export declare function performAttack(player: PlayerState, npc: RoomNPC, action: CombatAction): UnifiedAttackResult;
export declare function rollInitiative(player: PlayerState): {
    total: number;
    narrative: string;
};
export declare function renderCharacterSheet(player: PlayerState): string;
export declare function switchSystem(player: PlayerState, system: string): string;
