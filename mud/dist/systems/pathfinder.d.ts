import type { PathfinderCharacterSheet, PFAbilityScores, PFSave, PFSpell, PFClassFeature, DiceRoll } from '../engine/types.js';
/** Calculate ability modifier: (score - 10) / 2, floor */
export declare function abilityMod(score: number): number;
/** Calculate all ability modifiers from scores */
export declare function calculateAbilityMods(scores: PFAbilityScores): PFAbilityScores;
/** Roll 4d6 drop lowest for ability generation */
export declare function rollAbilityScore(): {
    rolls: number[];
    dropped: number;
    total: number;
};
/** Generate a full set of ability scores (4d6 drop lowest × 6) */
export declare function generateAbilityScores(): PFAbilityScores;
export interface PFAttackResult {
    attackRoll: DiceRoll;
    totalAttack: number;
    targetAC: number;
    hit: boolean;
    nat20: boolean;
    nat1: boolean;
    criticalThreat: boolean;
    criticalConfirmed: boolean;
    damageRolls?: number[];
    totalDamage: number;
    narrative: string;
}
/** Make a PF1e attack roll */
export declare function pfAttack(bab: number, abilityMod: number, otherMods: number, targetAC: number, damageDice: {
    count: number;
    sides: number;
}, damageBonus: number, critRange?: number, // Threat on this or higher (20 = only nat 20)
critMultiplier?: number): PFAttackResult;
/** Make a PF1e saving throw */
export declare function pfSavingThrow(saveBonus: number, dc: number, saveType: PFSave): {
    success: boolean;
    total: number;
    roll: DiceRoll;
    narrative: string;
};
/** Make a PF1e skill check */
export declare function pfSkillCheck(skillBonus: number, dc: number, skillName: string, take10?: boolean, take20?: boolean): {
    success: boolean;
    total: number;
    roll?: DiceRoll;
    narrative: string;
};
/** Roll initiative */
export declare function pfInitiative(dexMod: number, otherMods?: number): {
    total: number;
    roll: DiceRoll;
    narrative: string;
};
/** Calculate Combat Maneuver Bonus */
export declare function calculateCMB(bab: number, strMod: number, sizeMod?: number): number;
/** Calculate Combat Maneuver Defense */
export declare function calculateCMD(bab: number, strMod: number, dexMod: number, sizeMod?: number): number;
/** Calculate spell DC */
export declare function spellDC(spellLevel: number, castingMod: number): number;
/** Use a spell (decrement prepared count) */
export declare function castSpell(sheet: PathfinderCharacterSheet, spellName: string): {
    success: boolean;
    spell?: PFSpell;
    narrative: string;
};
/** Use a class feature with limited uses */
export declare function useClassFeature(sheet: PathfinderCharacterSheet, featureName: string): {
    success: boolean;
    feature?: PFClassFeature;
    narrative: string;
};
export declare function renderPathfinderSheet(sheet: PathfinderCharacterSheet): string;
