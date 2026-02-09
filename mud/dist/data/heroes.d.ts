import type { NPCCombatProfile } from './npcs.js';
export declare const JAIRUVIEL_STARDUST: NPCCombatProfile;
export declare const BRUTUS: NPCCombatProfile;
export declare const KING_JOSEPH: NPCCombatProfile;
export declare const KING_SURTUPIO: NPCCombatProfile;
export declare const BUCKWILD: NPCCombatProfile;
export declare const PHOEBE: NPCCombatProfile;
export declare const KOA: NPCCombatProfile;
export declare const LUMINARAFAE: NPCCombatProfile;
export declare const ARIS: NPCCombatProfile;
export declare const MOGWAI_CHORUS: NPCCombatProfile;
export declare const HERO_PROFILES: Record<string, NPCCombatProfile>;
/** Get hero profile by id, fuzzy match on name */
export declare function getHeroProfile(idOrName: string): NPCCombatProfile | undefined;
/** All profiles combined (heroes + enemies) for universal lookup */
export declare function getAllProfiles(): Record<string, NPCCombatProfile>;
