// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Universal Dice Engine
// Shared rolling functions used by all three game systems
// ═══════════════════════════════════════════════════════════════
import { ELEMENT_DICE } from './types.js';
/** Roll a single die (1 to max), returns value */
export function rollDie(max) {
    return Math.floor(Math.random() * max) + 1;
}
/** Roll a die and get full DiceRoll result */
export function rollDiceResult(max, element) {
    const roll = rollDie(max);
    return {
        die: max,
        roll,
        element,
        attainment: roll / max,
        isCritical: roll === max,
        isFumble: roll === 1,
    };
}
/** Roll an element's die (Dice Godz) */
export function rollElement(element) {
    const max = ELEMENT_DICE[element];
    return rollDiceResult(max, element);
}
/** Roll d20 (Pathfinder / M&M 3e) */
export function rolld20() {
    return rollDiceResult(20);
}
/** Roll d20 + modifier vs DC (PF1e standard check) */
export function rollCheck(modifier, dc) {
    const roll = rolld20();
    const total = roll.roll + modifier;
    const nat20 = roll.roll === 20;
    const nat1 = roll.roll === 1;
    return {
        roll,
        total,
        success: nat20 || (!nat1 && total >= dc),
        margin: total - dc,
        nat20,
        nat1,
    };
}
/** Roll multiple dice and sum (e.g. 2d6, 3d8) */
export function rollMultiple(count, max) {
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(rollDie(max));
    }
    return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}
/** Flip a coin (D2) — returns 'heads' (1) or 'tails' (2) */
export function flipCoin() {
    const roll = rollDie(2);
    return { roll, result: roll === 1 ? 'heads' : 'tails' };
}
/** Roll percentile (D100) */
export function rollPercentile() {
    return rollDie(100);
}
/** Calculate attainment as percentage string */
export function formatAttainment(attainment) {
    return `${Math.round(attainment * 100)}%`;
}
/** Render a dice roll as narrative text with emoji */
export function narrateRoll(roll, context) {
    const pct = formatAttainment(roll.attainment);
    const dieLabel = roll.element
        ? `${roll.element} D${roll.die}`
        : `D${roll.die}`;
    if (roll.isCritical) {
        return `🎲💥 CRITICAL! ${dieLabel}: ${roll.roll}/${roll.die} (${pct})${context ? ` — ${context}` : ''}`;
    }
    if (roll.isFumble) {
        return `🎲💨 Fumble! ${dieLabel}: ${roll.roll}/${roll.die} (${pct})${context ? ` — ${context}` : ''}`;
    }
    return `🎲 ${dieLabel}: ${roll.roll}/${roll.die} (${pct})${context ? ` — ${context}` : ''}`;
}
//# sourceMappingURL=dice.js.map