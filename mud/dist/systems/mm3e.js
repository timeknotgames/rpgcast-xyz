// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Mutants & Masterminds 3e Game System
// Full d20 + rank mechanics, effect rolls, conditions track
// ═══════════════════════════════════════════════════════════════
import { rolld20, rollCheck } from '../engine/dice.js';
// ── CONSTANTS ──
// Condition ladder (graduated conditions)
export const DAMAGE_CONDITIONS = ['', 'Dazed', 'Staggered', 'Incapacitated'];
export const AFFLICTION_CONDITIONS = {
    1: ['Dazed', 'Fatigued', 'Hindered', 'Impaired', 'Vulnerable'],
    2: ['Compelled', 'Defenseless', 'Disabled', 'Exhausted', 'Immobile', 'Stunned'],
    3: ['Asleep', 'Controlled', 'Incapacitated', 'Paralyzed', 'Transformed', 'Unaware'],
};
// ── CORE MECHANICS ──
/** Standard M&M check: d20 + rank vs DC */
export function mm3eCheck(rank, dc, label) {
    const check = rollCheck(rank, dc);
    const prefix = label ? `${label}: ` : '';
    let narrative = `${prefix}d20(${check.roll.roll}) + ${rank} = ${check.total} vs DC ${dc}`;
    if (check.nat20)
        narrative += ' — NAT 20!';
    else if (check.nat1)
        narrative += ' — NAT 1!';
    narrative += check.success ? ' — Success!' : ' — Failed!';
    return {
        roll: check.roll,
        total: check.total,
        success: check.success,
        margin: check.total - dc,
        narrative,
    };
}
/** Attack check: d20 + attack bonus vs target defense */
export function mm3eAttack(attackBonus, targetDefense, attackType) {
    const check = rollCheck(attackBonus, targetDefense);
    const nat20 = check.roll.roll === 20;
    const nat1 = check.roll.roll === 1;
    // Critical on nat 20 in M&M = +5 to effect DC
    const criticalHit = nat20 && check.success;
    const emoji = attackType === 'close' ? '⚔️' : '🎯';
    let narrative = `${emoji} ${attackType === 'close' ? 'Close' : 'Ranged'} Attack: d20(${check.roll.roll}) + ${attackBonus} = ${check.total} vs Defense ${targetDefense}`;
    if (nat20)
        narrative += ' — NAT 20!';
    else if (nat1)
        narrative += ' — NAT 1! Auto-miss!';
    narrative += (check.success || nat20) && !nat1 ? ' — Hit!' : ' — Miss!';
    if (criticalHit)
        narrative += ' 💥 CRITICAL!';
    return {
        roll: check.roll,
        total: check.total,
        hit: (check.success || nat20) && !nat1,
        nat20,
        nat1,
        criticalHit,
        narrative,
    };
}
/**
 * Make a resistance check (toughness save vs damage, etc.)
 * M&M3e: DC = effect rank + 15
 * Failure by 1-5 = 1st degree, 6-10 = 2nd degree, 11-15 = 3rd degree, 16+ = 4th degree
 */
export function mm3eResistanceCheck(resistanceBonus, effectRank, resistanceType, bruisePenalty = 0) {
    const dc = effectRank + 15;
    const totalBonus = resistanceBonus - bruisePenalty;
    const check = rollCheck(totalBonus, dc);
    let degrees = 0;
    const conditions = [];
    if (!check.success) {
        const failMargin = dc - check.total;
        if (failMargin >= 16)
            degrees = 4;
        else if (failMargin >= 11)
            degrees = 3;
        else if (failMargin >= 6)
            degrees = 2;
        else
            degrees = 1;
    }
    // Apply conditions based on resistance type and degrees
    if (resistanceType === 'Toughness') {
        if (degrees >= 1)
            conditions.push('Bruise (-1 Toughness)');
        if (degrees >= 2)
            conditions.push('Dazed (1 round)');
        if (degrees >= 3)
            conditions.push('Staggered');
        if (degrees >= 4)
            conditions.push('Incapacitated');
    }
    else if (resistanceType === 'Fortitude') {
        if (degrees >= 1)
            conditions.push('1st degree effect');
        if (degrees >= 2)
            conditions.push('2nd degree effect');
        if (degrees >= 3)
            conditions.push('3rd degree effect');
    }
    else if (resistanceType === 'Will') {
        if (degrees >= 1)
            conditions.push('1st degree effect');
        if (degrees >= 2)
            conditions.push('2nd degree effect');
        if (degrees >= 3)
            conditions.push('3rd degree effect');
    }
    const emoji = {
        Toughness: '🛡️',
        Fortitude: '💪',
        Will: '🧠',
        Dodge: '⚡',
    }[resistanceType];
    let narrative = `${emoji} ${resistanceType} save: d20(${check.roll.roll}) + ${totalBonus} = ${check.total} vs DC ${dc}`;
    if (bruisePenalty > 0)
        narrative += ` (includes -${bruisePenalty} bruise penalty)`;
    if (check.success) {
        narrative += '\n  ✅ Resisted!';
    }
    else {
        narrative += `\n  ❌ Failed by ${dc - check.total} — ${degrees} degree(s) of failure!`;
        if (conditions.length > 0) {
            narrative += `\n  Conditions: ${conditions.join(', ')}`;
        }
    }
    return {
        roll: check.roll,
        total: check.total,
        dc,
        margin: check.total - dc,
        degrees,
        conditions,
        narrative,
    };
}
// ── POWER USAGE ──
/** Use a power from a character's power list */
export function usePower(sheet, powerName) {
    const power = sheet.powers.find(p => p.name.toLowerCase() === powerName.toLowerCase());
    if (!power) {
        return { success: false, narrative: `❌ You don't have the power "${powerName}".` };
    }
    const descriptors = power.descriptors.length > 0
        ? ` (${power.descriptors.join(', ')})`
        : '';
    const extras = power.extras && power.extras.length > 0
        ? ` [${power.extras.join(', ')}]`
        : '';
    return {
        success: true,
        power,
        narrative: `✨ ${power.name}${descriptors} — Rank ${power.rank}${extras}`,
    };
}
// ── INITIATIVE ──
export function mm3eInitiative(agilityRank, improvedInit = false) {
    const bonus = agilityRank + (improvedInit ? 4 : 0);
    const roll = rolld20();
    const total = roll.roll + bonus;
    return {
        total,
        roll,
        narrative: `⚡ Initiative: d20(${roll.roll}) + ${bonus} = ${total}`,
    };
}
// ── CONDITION MANAGEMENT ──
/** Add a condition to a character */
export function addCondition(sheet, conditionName, degree = 1, description) {
    const existing = sheet.conditions.find(c => c.name === conditionName);
    if (existing) {
        // Upgrade degree if worse
        existing.degree = Math.max(existing.degree, degree);
    }
    else {
        sheet.conditions.push({
            name: conditionName,
            degree,
            description: description || conditionName,
        });
    }
    // Track bruise penalty
    if (conditionName.includes('Bruise')) {
        sheet.bruisePenalty++;
    }
    return sheet;
}
/** Remove a condition */
export function removeCondition(sheet, conditionName) {
    sheet.conditions = sheet.conditions.filter(c => c.name !== conditionName);
    return sheet;
}
/** Check if character is incapacitated */
export function isIncapacitated(sheet) {
    return sheet.conditions.some(c => c.name === 'Incapacitated' || c.name === 'Asleep' || c.name === 'Paralyzed');
}
// ── PL VALIDATION ──
/** Check if attack + effect respects PL cap */
export function checkPLCap(powerLevel, attackBonus, effectRank) {
    const total = attackBonus + effectRank;
    const maxTotal = powerLevel * 2;
    if (total > maxTotal) {
        return {
            valid: false,
            message: `❌ PL cap exceeded: Attack ${attackBonus} + Effect ${effectRank} = ${total} (max ${maxTotal} at PL ${powerLevel})`,
        };
    }
    return {
        valid: true,
        message: `✅ PL cap OK: Attack ${attackBonus} + Effect ${effectRank} = ${total} ≤ ${maxTotal}`,
    };
}
/** Check if defense + resistance respects PL cap */
export function checkDefensePLCap(powerLevel, dodgeOrParry, toughnessOrFortOrWill) {
    const total = dodgeOrParry + toughnessOrFortOrWill;
    const maxTotal = powerLevel * 2;
    if (total > maxTotal) {
        return {
            valid: false,
            message: `❌ Defense PL cap exceeded: ${dodgeOrParry} + ${toughnessOrFortOrWill} = ${total} (max ${maxTotal})`,
        };
    }
    return { valid: true, message: `✅ Defense PL cap OK.` };
}
// ── CHARACTER SHEET RENDERING ──
export function renderMM3eSheet(sheet) {
    const lines = [];
    lines.push('╔═══════════════════════════════════════════════╗');
    lines.push('║  🦸 MUTANTS & MASTERMINDS 3e SHEET           ║');
    lines.push('╠═══════════════════════════════════════════════╣');
    lines.push(`║  ${sheet.name} — ${sheet.identity}`);
    lines.push(`║  Power Level: ${sheet.powerLevel} | PP: ${sheet.powerPoints}`);
    lines.push('║');
    lines.push('║  ── ABILITIES ──');
    const abilities = ['STR', 'STA', 'AGL', 'DEX', 'FGT', 'INT', 'AWE', 'PRE'];
    for (const ab of abilities) {
        const rank = sheet.abilities[ab];
        const label = {
            STR: 'Strength', STA: 'Stamina', AGL: 'Agility', DEX: 'Dexterity',
            FGT: 'Fighting', INT: 'Intellect', AWE: 'Awareness', PRE: 'Presence',
        }[ab];
        lines.push(`║  ${ab}: ${rank >= 0 ? '+' : ''}${rank} (${label})`);
    }
    lines.push('║');
    lines.push('║  ── DEFENSES ──');
    lines.push(`║  🛡️ Dodge: ${sheet.defenses.dodge} | Parry: ${sheet.defenses.parry}`);
    lines.push(`║  💪 Fortitude: ${sheet.defenses.fortitude} | 🧠 Will: ${sheet.defenses.will}`);
    lines.push(`║  🛡️ Toughness: ${sheet.defenses.toughness}${sheet.bruisePenalty > 0 ? ` (-${sheet.bruisePenalty} bruise)` : ''}`);
    lines.push('║');
    if (sheet.powers.length > 0) {
        lines.push('║  ── POWERS ──');
        for (const power of sheet.powers) {
            const descriptors = power.descriptors.join(', ');
            lines.push(`║  ✨ ${power.name}: Rank ${power.rank} (${descriptors}) [${power.totalCost}pp]`);
        }
        lines.push('║');
    }
    if (sheet.conditions.length > 0) {
        lines.push('║  ── ACTIVE CONDITIONS ──');
        for (const cond of sheet.conditions) {
            lines.push(`║  ⚠️ ${cond.name} (Degree ${cond.degree})`);
        }
        lines.push('║');
    }
    if (sheet.advantages.length > 0) {
        lines.push('║  ── ADVANTAGES ──');
        lines.push(`║  ${sheet.advantages.join(', ')}`);
        lines.push('║');
    }
    lines.push('╚═══════════════════════════════════════════════╝');
    return lines.join('\n');
}
//# sourceMappingURL=mm3e.js.map