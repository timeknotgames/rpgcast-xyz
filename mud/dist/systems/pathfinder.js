// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Pathfinder 1e Game System
// Full d20 + modifier mechanics, gestalt class support
// ═══════════════════════════════════════════════════════════════
import { rollCheck, rolld20, rollMultiple } from '../engine/dice.js';
// ── ABILITY SCORE HELPERS ──
/** Calculate ability modifier: (score - 10) / 2, floor */
export function abilityMod(score) {
    return Math.floor((score - 10) / 2);
}
/** Calculate all ability modifiers from scores */
export function calculateAbilityMods(scores) {
    return {
        STR: abilityMod(scores.STR),
        DEX: abilityMod(scores.DEX),
        CON: abilityMod(scores.CON),
        INT: abilityMod(scores.INT),
        WIS: abilityMod(scores.WIS),
        CHA: abilityMod(scores.CHA),
    };
}
/** Roll 4d6 drop lowest for ability generation */
export function rollAbilityScore() {
    const { rolls } = rollMultiple(4, 6);
    const sorted = [...rolls].sort((a, b) => a - b);
    const dropped = sorted[0];
    const kept = sorted.slice(1);
    return { rolls, dropped, total: kept.reduce((a, b) => a + b, 0) };
}
/** Generate a full set of ability scores (4d6 drop lowest × 6) */
export function generateAbilityScores() {
    const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const scores = {};
    for (const ability of abilities) {
        scores[ability] = rollAbilityScore().total;
    }
    return scores;
}
/** Make a PF1e attack roll */
export function pfAttack(bab, abilityMod, otherMods, targetAC, damageDice, damageBonus, critRange = 20, // Threat on this or higher (20 = only nat 20)
critMultiplier = 2) {
    const totalMod = bab + abilityMod + otherMods;
    const check = rollCheck(totalMod, targetAC);
    const nat20 = check.roll.roll === 20;
    const nat1 = check.roll.roll === 1;
    const criticalThreat = check.roll.roll >= critRange;
    let criticalConfirmed = false;
    if (criticalThreat && check.success) {
        // Confirm critical: roll again vs AC
        const confirm = rollCheck(totalMod, targetAC);
        criticalConfirmed = confirm.success;
    }
    let totalDamage = 0;
    let damageRolls = [];
    if (check.success || nat20) {
        const { rolls, total } = rollMultiple(damageDice.count, damageDice.sides);
        damageRolls = rolls;
        totalDamage = total + damageBonus;
        if (criticalConfirmed) {
            // Roll additional damage dice for critical
            for (let i = 1; i < critMultiplier; i++) {
                const extra = rollMultiple(damageDice.count, damageDice.sides);
                damageRolls.push(...extra.rolls);
                totalDamage += extra.total + damageBonus;
            }
        }
        totalDamage = Math.max(1, totalDamage); // Minimum 1 damage on hit
    }
    let narrative = `⚔️ Attack: d20(${check.roll.roll}) + ${totalMod} = ${check.total} vs AC ${targetAC}`;
    if (nat20)
        narrative += ' — NAT 20!';
    else if (nat1)
        narrative += ' — NAT 1! Automatic miss!';
    if (check.success || nat20) {
        if (criticalConfirmed) {
            narrative += `\n💥 CRITICAL HIT (×${critMultiplier})! ${damageRolls.join('+')}+${damageBonus} = ${totalDamage} damage!`;
        }
        else if (criticalThreat) {
            narrative += `\n⚔️ Hit (critical not confirmed). ${damageRolls.join('+')}+${damageBonus} = ${totalDamage} damage.`;
        }
        else {
            narrative += `\n⚔️ Hit! ${damageRolls.join('+')}+${damageBonus} = ${totalDamage} damage.`;
        }
    }
    else {
        narrative += '\n🛡️ Miss!';
    }
    return {
        attackRoll: check.roll,
        totalAttack: check.total,
        targetAC,
        hit: check.success || nat20,
        nat20,
        nat1,
        criticalThreat,
        criticalConfirmed,
        damageRolls,
        totalDamage,
        narrative,
    };
}
/** Make a PF1e saving throw */
export function pfSavingThrow(saveBonus, dc, saveType) {
    const check = rollCheck(saveBonus, dc);
    const saveEmoji = { Fort: '💪', Ref: '⚡', Will: '🧠' }[saveType];
    let narrative = `${saveEmoji} ${saveType} save: d20(${check.roll.roll}) + ${saveBonus} = ${check.total} vs DC ${dc}`;
    if (check.nat20)
        narrative += ' — NAT 20! Auto-success!';
    else if (check.nat1)
        narrative += ' — NAT 1! Auto-fail!';
    else if (check.success)
        narrative += ' — Success!';
    else
        narrative += ' — Failed!';
    return { success: check.success, total: check.total, roll: check.roll, narrative };
}
/** Make a PF1e skill check */
export function pfSkillCheck(skillBonus, dc, skillName, take10, take20) {
    if (take20) {
        const total = 20 + skillBonus;
        return {
            success: total >= dc,
            total,
            narrative: `📋 ${skillName} (Take 20): 20 + ${skillBonus} = ${total} vs DC ${dc} — ${total >= dc ? 'Success!' : 'Failed!'}`,
        };
    }
    if (take10) {
        const total = 10 + skillBonus;
        return {
            success: total >= dc,
            total,
            narrative: `📋 ${skillName} (Take 10): 10 + ${skillBonus} = ${total} vs DC ${dc} — ${total >= dc ? 'Success!' : 'Failed!'}`,
        };
    }
    const check = rollCheck(skillBonus, dc);
    return {
        success: check.success,
        total: check.total,
        roll: check.roll,
        narrative: `📋 ${skillName}: d20(${check.roll.roll}) + ${skillBonus} = ${check.total} vs DC ${dc} — ${check.success ? 'Success!' : 'Failed!'}`,
    };
}
/** Roll initiative */
export function pfInitiative(dexMod, otherMods = 0) {
    const roll = rolld20();
    const total = roll.roll + dexMod + otherMods;
    return {
        total,
        roll,
        narrative: `⚡ Initiative: d20(${roll.roll}) + ${dexMod + otherMods} = ${total}`,
    };
}
/** Calculate Combat Maneuver Bonus */
export function calculateCMB(bab, strMod, sizeMod = 0) {
    return bab + strMod + sizeMod;
}
/** Calculate Combat Maneuver Defense */
export function calculateCMD(bab, strMod, dexMod, sizeMod = 0) {
    return 10 + bab + strMod + dexMod + sizeMod;
}
// ── SPELL CASTING ──
/** Calculate spell DC */
export function spellDC(spellLevel, castingMod) {
    return 10 + spellLevel + castingMod;
}
/** Use a spell (decrement prepared count) */
export function castSpell(sheet, spellName) {
    const spell = sheet.spells.find(s => s.name.toLowerCase() === spellName.toLowerCase());
    if (!spell) {
        return { success: false, narrative: `❌ You don't know the spell "${spellName}".` };
    }
    if (spell.prepared <= 0) {
        return { success: false, narrative: `❌ No remaining slots for ${spell.name} (${spell.maxPrepared} per day, all used).` };
    }
    spell.prepared--;
    return {
        success: true,
        spell,
        narrative: `🔮 Cast ${spell.name} (Level ${spell.level} ${spell.school})${spell.saveDC ? ` — DC ${spell.saveDC}` : ''}. ${spell.prepared}/${spell.maxPrepared} slots remaining.`,
    };
}
// ── CLASS FEATURE USAGE ──
/** Use a class feature with limited uses */
export function useClassFeature(sheet, featureName) {
    const feature = sheet.classFeatures.find(f => f.name.toLowerCase() === featureName.toLowerCase());
    if (!feature) {
        return { success: false, narrative: `❌ You don't have the feature "${featureName}".` };
    }
    if (feature.usesPerDay !== undefined && feature.usesRemaining !== undefined) {
        if (feature.usesRemaining <= 0) {
            return { success: false, narrative: `❌ ${feature.name} has no uses remaining today.` };
        }
        feature.usesRemaining--;
        return {
            success: true,
            feature,
            narrative: `✨ Used ${feature.name}! ${feature.description} (${feature.usesRemaining}/${feature.usesPerDay} uses remaining)`,
        };
    }
    return {
        success: true,
        feature,
        narrative: `✨ Used ${feature.name}! ${feature.description}`,
    };
}
// ── CHARACTER SHEET RENDERING ──
export function renderPathfinderSheet(sheet) {
    const lines = [];
    const mods = sheet.abilityMods;
    lines.push('╔═══════════════════════════════════════════════╗');
    lines.push('║  📜 PATHFINDER 1e CHARACTER SHEET            ║');
    lines.push('╠═══════════════════════════════════════════════╣');
    lines.push(`║  ${sheet.name} — ${sheet.race}`);
    lines.push(`║  ${sheet.classes.map(c => `${c.name} ${c.level}`).join(' // ')} (Gestalt)`);
    lines.push(`║  Alignment: ${sheet.alignment} | Level: ${sheet.level}`);
    lines.push('║');
    lines.push(`║  ❤️  HP: ${sheet.hp}/${sheet.maxHp}`);
    lines.push(`║  🛡️  AC: ${sheet.ac} (Touch ${sheet.touchAC}, Flat ${sheet.flatFootedAC})`);
    lines.push(`║  ⚡ Initiative: +${sheet.initiative} | Speed: ${sheet.speed}ft`);
    lines.push(`║  ⚔️  BAB: +${sheet.bab} | CMB: +${sheet.cmb} | CMD: ${sheet.cmd}`);
    lines.push('║');
    lines.push('║  ── ABILITIES ──');
    const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    for (const ab of abilities) {
        const mod = mods[ab];
        const sign = mod >= 0 ? '+' : '';
        lines.push(`║  ${ab}: ${sheet.abilities[ab].toString().padStart(2)} (${sign}${mod})`);
    }
    lines.push('║');
    lines.push('║  ── SAVES ──');
    lines.push(`║  💪 Fort: +${sheet.saves.Fort} | ⚡ Ref: +${sheet.saves.Ref} | 🧠 Will: +${sheet.saves.Will}`);
    lines.push('║');
    if (sheet.spells.length > 0) {
        lines.push('║  ── SPELLS ──');
        for (const spell of sheet.spells) {
            lines.push(`║  🔮 ${spell.name} (L${spell.level}) [${spell.prepared}/${spell.maxPrepared}]`);
        }
        lines.push('║');
    }
    if (sheet.classFeatures.length > 0) {
        lines.push('║  ── CLASS FEATURES ──');
        for (const feat of sheet.classFeatures) {
            const uses = feat.usesPerDay ? ` [${feat.usesRemaining}/${feat.usesPerDay}]` : '';
            lines.push(`║  ✨ ${feat.name}${uses}`);
        }
        lines.push('║');
    }
    lines.push('╚═══════════════════════════════════════════════╝');
    return lines.join('\n');
}
//# sourceMappingURL=pathfinder.js.map