import type { MM3eCharacterSheet, MM3ePower, DiceRoll } from '../engine/types.js';
export declare const DAMAGE_CONDITIONS: readonly ["", "Dazed", "Staggered", "Incapacitated"];
export declare const AFFLICTION_CONDITIONS: {
    readonly 1: readonly ["Dazed", "Fatigued", "Hindered", "Impaired", "Vulnerable"];
    readonly 2: readonly ["Compelled", "Defenseless", "Disabled", "Exhausted", "Immobile", "Stunned"];
    readonly 3: readonly ["Asleep", "Controlled", "Incapacitated", "Paralyzed", "Transformed", "Unaware"];
};
/** Standard M&M check: d20 + rank vs DC */
export declare function mm3eCheck(rank: number, dc: number, label?: string): {
    roll: DiceRoll;
    total: number;
    success: boolean;
    margin: number;
    narrative: string;
};
/** Attack check: d20 + attack bonus vs target defense */
export declare function mm3eAttack(attackBonus: number, targetDefense: number, attackType: 'close' | 'ranged'): {
    roll: DiceRoll;
    total: number;
    hit: boolean;
    nat20: boolean;
    nat1: boolean;
    criticalHit: boolean;
    narrative: string;
};
export interface ResistanceResult {
    roll: DiceRoll;
    total: number;
    dc: number;
    margin: number;
    degrees: number;
    conditions: string[];
    narrative: string;
}
/**
 * Make a resistance check (toughness save vs damage, etc.)
 * M&M3e: DC = effect rank + 15
 * Failure by 1-5 = 1st degree, 6-10 = 2nd degree, 11-15 = 3rd degree, 16+ = 4th degree
 */
export declare function mm3eResistanceCheck(resistanceBonus: number, effectRank: number, resistanceType: 'Toughness' | 'Fortitude' | 'Will' | 'Dodge', bruisePenalty?: number): ResistanceResult;
/** Use a power from a character's power list */
export declare function usePower(sheet: MM3eCharacterSheet, powerName: string): {
    success: boolean;
    power?: MM3ePower;
    narrative: string;
};
export declare function mm3eInitiative(agilityRank: number, improvedInit?: boolean): {
    total: number;
    roll: DiceRoll;
    narrative: string;
};
/** Add a condition to a character */
export declare function addCondition(sheet: MM3eCharacterSheet, conditionName: string, degree?: number, description?: string): MM3eCharacterSheet;
/** Remove a condition */
export declare function removeCondition(sheet: MM3eCharacterSheet, conditionName: string): MM3eCharacterSheet;
/** Check if character is incapacitated */
export declare function isIncapacitated(sheet: MM3eCharacterSheet): boolean;
/** Check if attack + effect respects PL cap */
export declare function checkPLCap(powerLevel: number, attackBonus: number, effectRank: number): {
    valid: boolean;
    message: string;
};
/** Check if defense + resistance respects PL cap */
export declare function checkDefensePLCap(powerLevel: number, dodgeOrParry: number, toughnessOrFortOrWill: number): {
    valid: boolean;
    message: string;
};
export declare function renderMM3eSheet(sheet: MM3eCharacterSheet): string;
