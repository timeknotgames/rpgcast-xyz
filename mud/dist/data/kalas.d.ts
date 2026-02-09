import type { Element } from '../engine/types.js';
export type Ability = 'STR' | 'AGI' | 'END' | 'PER' | 'INT' | 'WIL' | 'CHA' | 'LCK';
export declare const ABILITY_ELEMENT: Record<Ability, Element>;
export interface Kala {
    id: number;
    sanskrit: string;
    english: string;
    description: string;
    abilities: [Ability, Ability];
    element: Element;
    category: KalaCategory;
}
export type KalaCategory = 'performing' | 'social' | 'intellectual' | 'technical' | 'mystical' | 'mastery';
export declare const KALAS: Kala[];
export interface Vidya {
    id: number;
    sanskrit: string;
    english: string;
    description: string;
    category: 'veda' | 'upaveda' | 'vedanga';
    abilities: [Ability, Ability];
    element: Element;
}
export declare const VIDYAS: Vidya[];
export interface CustomSkill {
    slotId: number;
    name: string;
    description: string;
    abilities: [Ability, Ability];
    element: Element;
    affinity: 'major' | 'minor' | 'standard';
    baseValue: number;
    currentValue: number;
    xp: number;
}
export declare function createCustomSkill(slotId: number, name: string, description: string, abilities: [Ability, Ability], element: Element, affinity?: 'major' | 'minor' | 'standard'): CustomSkill;
export interface GemstoneSpecies {
    speciesId: string;
    name: string;
    emoji: string;
    petal: Element;
    hexagramNumber: number;
    description: string;
    kalaAffinity: number;
    vidyaAffinity?: number;
    abilityBonus: Partial<Record<Ability, number>>;
    isBoundary: boolean;
    pf1eRaceTraits?: string[];
    mm3eTemplate?: string;
}
export interface SkillCheckResult {
    success: boolean;
    roll: number;
    target: number;
    margin: number;
    critical: boolean;
    narrative: string;
}
/** Roll D100 vs skill value (roll under = success) */
export declare function kalaCheck(skillValue: number, difficulty?: number): SkillCheckResult;
export declare function getKala(id: number): Kala | undefined;
export declare function getKalaByName(name: string): Kala | undefined;
export declare function getVidya(id: number): Vidya | undefined;
export declare function getKalasByElement(element: Element): Kala[];
export declare function getKalasByCategory(category: KalaCategory): Kala[];
/** Render a Kala for display in the MUD */
export declare function renderKala(kala: Kala): string;
/** Render all Kalas grouped by category */
export declare function renderKalaList(): string;
