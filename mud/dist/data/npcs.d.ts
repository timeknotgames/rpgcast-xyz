import type { CoreElement } from '../engine/types.js';
export interface NPCCombatProfile {
    id: string;
    name: string;
    emoji: string;
    tier: 'minion' | 'standard' | 'elite' | 'boss';
    diceGodz: {
        primaryElement: CoreElement;
        attainments: Partial<Record<CoreElement, number>>;
        hp: number;
        maxHp: number;
        karma: number;
        angle: number;
        specialAbility?: string;
    };
    pathfinder: {
        hp: number;
        maxHp: number;
        ac: number;
        touchAC: number;
        flatFootedAC: number;
        bab: number;
        saves: {
            Fort: number;
            Ref: number;
            Will: number;
        };
        attacks: {
            name: string;
            bonus: number;
            damage: string;
            critRange?: number;
            critMult?: number;
        }[];
        specialAbilities: string[];
        cr: number;
    };
    mm3e: {
        powerLevel: number;
        abilities: {
            STR: number;
            STA: number;
            AGL: number;
            DEX: number;
            FGT: number;
            INT: number;
            AWE: number;
            PRE: number;
        };
        defenses: {
            dodge: number;
            parry: number;
            fortitude: number;
            toughness: number;
            will: number;
        };
        attacks: {
            name: string;
            bonus: number;
            effectRank: number;
            type: 'damage' | 'affliction' | 'weaken';
        }[];
        conditions: string[];
    };
}
export declare const SPORE_DRIFTER: NPCCombatProfile;
export declare const NIGHTMARE_SENTRY: NPCCombatProfile;
export declare const GREMLIN: NPCCombatProfile;
export declare const FACILITY_OVERSEER: NPCCombatProfile;
export declare const COVEN_HAG: NPCCombatProfile;
export declare const SLEEP_WALKER: NPCCombatProfile;
export declare const PROTO_DREAM_DRAGON: NPCCombatProfile;
export declare const ANCIENT_HAG_KING: NPCCombatProfile;
export declare const MOGWAI_CHILD: NPCCombatProfile;
export declare const DREAM_ECHO: NPCCombatProfile;
export declare const NPC_PROFILES: Record<string, NPCCombatProfile>;
/** Get NPC profile by id, fuzzy match on name */
export declare function getNPCProfile(idOrName: string): NPCCombatProfile | undefined;
