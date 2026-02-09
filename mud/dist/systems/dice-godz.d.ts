import type { Element, CoreElement, DiceRoll, DiceGodzCharacterSheet, GWESet, ElementalComposition, Opulences, CombatResult } from '../engine/types.js';
interface AngleZone {
    name: string;
    range: [number, number];
    element: Element;
    description: string;
}
/** Generate a single GWE dice set */
export declare function rollGWESet(setNumber: number, remainingAngle: number, totalSets: number, specializedElements?: CoreElement[]): GWESet;
/** Calculate elemental composition from all GWE sets */
export declare function calculateElementalComposition(sets: GWESet[]): ElementalComposition;
/** Calculate Karma percentage */
export declare function calculateKarma(sets: GWESet[]): number;
/** Calculate Opulence Points from Karma */
export declare function calculateOP(karma: number): number;
/** Generate a complete Godz World Egg */
export declare function createGodzWorldEgg(): DiceGodzCharacterSheet;
/** Distribute Opulence Points across the 6 Opulences */
export declare function distributeOpulences(sheet: DiceGodzCharacterSheet, distribution: Partial<Opulences>): DiceGodzCharacterSheet;
export interface AttainmentCheck {
    element: CoreElement;
    roll: DiceRoll;
    requiredAttainment: number;
    actualAttainment: number;
    success: boolean;
    isCritical: boolean;
    narrative: string;
}
/** Make an attainment check (core Dice Godz mechanic) */
export declare function attainmentCheck(element: CoreElement, requiredPercent: number, bonusPercent?: number): AttainmentCheck;
/** Get the angle zone for a given angle */
export declare function getAngleZone(angle: number): AngleZone;
/** Get optimal angle for an element */
export declare function getOptimalAngle(element: Element): number;
/** Calculate angular distance (shortest arc) */
export declare function angularDistance(a: number, b: number): number;
/** Calculate angle modifier based on distance from optimal */
export declare function angleModifier(distance: number): number;
/** Resolve 360° combat between attacker and defender */
export declare function resolve360Combat(attackerElement: CoreElement, defenderElement: CoreElement, attackAngle: number, attackerBonus?: number, defenderBonus?: number): CombatResult;
export declare function renderDiceGodzSheet(sheet: DiceGodzCharacterSheet): string;
export {};
