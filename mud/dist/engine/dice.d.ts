import type { DiceRoll, Element } from './types.js';
/** Roll a single die (1 to max), returns value */
export declare function rollDie(max: number): number;
/** Roll a die and get full DiceRoll result */
export declare function rollDiceResult(max: number, element?: Element): DiceRoll;
/** Roll an element's die (Dice Godz) */
export declare function rollElement(element: Element): DiceRoll;
/** Roll d20 (Pathfinder / M&M 3e) */
export declare function rolld20(): DiceRoll;
/** Roll d20 + modifier vs DC (PF1e standard check) */
export declare function rollCheck(modifier: number, dc: number): {
    roll: DiceRoll;
    total: number;
    success: boolean;
    margin: number;
    nat20: boolean;
    nat1: boolean;
};
/** Roll multiple dice and sum (e.g. 2d6, 3d8) */
export declare function rollMultiple(count: number, max: number): {
    rolls: number[];
    total: number;
};
/** Flip a coin (D2) — returns 'heads' (1) or 'tails' (2) */
export declare function flipCoin(): {
    roll: number;
    result: 'heads' | 'tails';
};
/** Roll percentile (D100) */
export declare function rollPercentile(): number;
/** Calculate attainment as percentage string */
export declare function formatAttainment(attainment: number): string;
/** Render a dice roll as narrative text with emoji */
export declare function narrateRoll(roll: DiceRoll, context?: string): string;
