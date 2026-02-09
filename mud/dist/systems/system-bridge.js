// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — System Bridge
// Unified interface across Dice Godz, PF1e, M&M 3e
// Routes combat, checks, and character display to the active system
// ═══════════════════════════════════════════════════════════════
import { rollDie } from '../engine/dice.js';
import { getNPCProfile } from '../data/npcs.js';
import { attainmentCheck, resolve360Combat, renderDiceGodzSheet, } from './dice-godz.js';
import { pfAttack, pfSkillCheck, pfInitiative, abilityMod, renderPathfinderSheet, } from './pathfinder.js';
import { mm3eAttack, mm3eResistanceCheck, mm3eInitiative, mm3eCheck, renderMM3eSheet, } from './mm3e.js';
/**
 * Perform a check using the player's active system.
 * In Dice Godz: attainment check on element.
 * In PF1e: skill check (maps element to closest skill).
 * In M&M 3e: standard check against DC.
 */
export function performCheck(player, element, requiredPercent, label) {
    switch (player.activeSystem) {
        case 'dice-godz': {
            const result = attainmentCheck(element, requiredPercent, 0);
            return {
                success: result.success,
                narrative: result.narrative,
                roll: result.roll,
            };
        }
        case 'pathfinder': {
            if (!player.pathfinderSheet)
                return { success: false, narrative: '❌ No Pathfinder sheet loaded.' };
            // Map elements to PF skills
            const skillMap = {
                Fire: 'Perception', Earth: 'Survival', Air: 'Athletics',
                Chaos: 'Sense Motive', Ether: 'Perform', Water: 'Diplomacy',
                Order: 'Knowledge', Coin: 'Appraise',
            };
            const skillName = skillMap[element] || 'Perception';
            const skillBonus = player.pathfinderSheet.skills[skillName] || 0;
            // Map attainment % to DC: 40% → DC 15, 60% → DC 20, 80% → DC 25
            const dc = Math.round(10 + (requiredPercent / 100) * 20);
            const result = pfSkillCheck(skillBonus, dc, `${label} (${skillName})`);
            return { success: result.success, narrative: result.narrative, roll: result.roll };
        }
        case 'mm3e': {
            if (!player.mm3eSheet)
                return { success: false, narrative: '❌ No M&M 3e sheet loaded.' };
            // Map elements to M&M abilities
            const abilityMap = {
                Fire: 'AGL', Earth: 'STA', Air: 'STR',
                Chaos: 'AWE', Ether: 'PRE', Water: 'AWE',
                Order: 'INT', Coin: 'PRE',
            };
            const abilityKey = abilityMap[element] || 'AWE';
            const rank = player.mm3eSheet.abilities[abilityKey] || 0;
            const dc = Math.round(10 + (requiredPercent / 100) * 15);
            const result = mm3eCheck(rank, dc, `${label} (${abilityKey})`);
            return { success: result.success, narrative: result.narrative, roll: result.roll };
        }
        default:
            return { success: false, narrative: '❌ Unknown game system.' };
    }
}
/**
 * Resolve an attack using the player's active system.
 */
export function performAttack(player, npc, action) {
    const profile = getNPCProfile(npc.id);
    if (!profile)
        return { hit: false, damage: 0, narrative: `❌ No combat stats found for ${npc.name}.` };
    switch (player.activeSystem) {
        case 'dice-godz': {
            if (!player.diceGodzSheet)
                return { hit: false, damage: 0, narrative: '❌ No Dice Godz sheet.' };
            const attackElement = (action.element || 'Air');
            const defenderElement = profile.diceGodz.primaryElement;
            const result = resolve360Combat(attackElement, defenderElement, player.diceGodzSheet.currentAngle);
            return {
                hit: result.success,
                damage: result.damage || 0,
                narrative: result.narrative,
                isCritical: result.isCritical,
            };
        }
        case 'pathfinder': {
            if (!player.pathfinderSheet)
                return { hit: false, damage: 0, narrative: '❌ No PF1e sheet.' };
            const sheet = player.pathfinderSheet;
            const strMod = abilityMod(sheet.abilities.STR);
            const result = pfAttack(sheet.bab, strMod, 0, profile.pathfinder.ac, { count: 1, sides: 8 }, // Default weapon damage
            strMod);
            return {
                hit: result.hit,
                damage: result.totalDamage,
                narrative: result.narrative,
                isCritical: result.criticalConfirmed,
            };
        }
        case 'mm3e': {
            if (!player.mm3eSheet)
                return { hit: false, damage: 0, narrative: '❌ No M&M 3e sheet.' };
            const sheet = player.mm3eSheet;
            const attackBonus = sheet.abilities.FGT; // Close attack by default
            const result = mm3eAttack(attackBonus, profile.mm3e.defenses.parry, 'close');
            let damage = 0;
            const conditions = [];
            if (result.hit) {
                // Target makes Toughness save
                const effectRank = sheet.abilities.STR + (result.criticalHit ? 5 : 0);
                const resist = mm3eResistanceCheck(profile.mm3e.defenses.toughness, effectRank, 'Toughness');
                damage = resist.degrees;
                conditions.push(...resist.conditions);
            }
            return {
                hit: result.hit,
                damage,
                narrative: result.narrative,
                conditions,
                isCritical: result.criticalHit,
            };
        }
        default:
            return { hit: false, damage: 0, narrative: '❌ Unknown system.' };
    }
}
// ── UNIFIED INITIATIVE ──
export function rollInitiative(player) {
    switch (player.activeSystem) {
        case 'dice-godz': {
            // Dice Godz: D4 Fire (Agility) attainment determines order
            const roll = rollDie(4);
            const total = Math.round((roll / 4) * 20); // Scale to 0-20
            return { total, narrative: `⚡ Initiative (Fire/Agility): D4(${roll}) → ${total}` };
        }
        case 'pathfinder': {
            if (!player.pathfinderSheet)
                return { total: 0, narrative: '❌ No PF1e sheet.' };
            const result = pfInitiative(abilityMod(player.pathfinderSheet.abilities.DEX));
            return { total: result.total, narrative: result.narrative };
        }
        case 'mm3e': {
            if (!player.mm3eSheet)
                return { total: 0, narrative: '❌ No M&M 3e sheet.' };
            const hasImprovedInit = player.mm3eSheet.advantages.includes('Improved Initiative');
            const result = mm3eInitiative(player.mm3eSheet.abilities.AGL, hasImprovedInit);
            return { total: result.total, narrative: result.narrative };
        }
        default:
            return { total: 0, narrative: '❌ Unknown system.' };
    }
}
// ── UNIFIED CHARACTER SHEET DISPLAY ──
export function renderCharacterSheet(player) {
    const header = `🎮 Active System: ${player.activeSystem.toUpperCase()}\n${'═'.repeat(48)}\n`;
    switch (player.activeSystem) {
        case 'dice-godz':
            if (!player.diceGodzSheet)
                return header + '❌ No Dice Godz character created. Use "roll gwe" to begin.';
            return header + renderDiceGodzSheet(player.diceGodzSheet);
        case 'pathfinder':
            if (!player.pathfinderSheet)
                return header + '❌ No Pathfinder character loaded.';
            return header + renderPathfinderSheet(player.pathfinderSheet);
        case 'mm3e':
            if (!player.mm3eSheet)
                return header + '❌ No M&M 3e character loaded.';
            return header + renderMM3eSheet(player.mm3eSheet);
        default:
            return '❌ Unknown game system. Use "system dice-godz|pathfinder|mm3e" to select.';
    }
}
// ── SYSTEM SWITCH ──
export function switchSystem(player, system) {
    const valid = ['dice-godz', 'pathfinder', 'mm3e'];
    const normalized = system.toLowerCase().replace(/\s+/g, '-');
    if (!valid.includes(normalized)) {
        return `❌ Unknown system "${system}". Choose: dice-godz, pathfinder, mm3e`;
    }
    player.activeSystem = normalized;
    return `🎮 Switched to ${normalized.toUpperCase()}. All checks and combat now use this system.`;
}
//# sourceMappingURL=system-bridge.js.map