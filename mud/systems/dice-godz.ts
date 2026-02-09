// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Dice Godz Game System
// CORRECTED: Only 6 dice rolled (D4,D6,D8,D10,D12,D20)
// D100 (Order) and D2 (Coin) are EMERGENT — not rolled at creation
// ═══════════════════════════════════════════════════════════════
// Source: DICE_GODZ_CHARACTER_CREATION_v3.1.md (definitive)
// Philosophy: Bhagavad Gita 3.42 — Senses → Mind → Intelligence → Wealth
// ═══════════════════════════════════════════════════════════════

import type {
  Element, CoreElement, DiceRoll, DiceGodzCharacterSheet,
  GWESet, ElementalComposition, Opulences, CombatResult,
} from '../engine/types.js';
import { ELEMENT_DICE, CORE_ELEMENTS } from '../engine/types.js';
import { rollDie, rollElement, formatAttainment, narrateRoll } from '../engine/dice.js';
import { ELEMENT_EMOJI } from '../data/emoji.js';

// ── CONSTANTS ──
const TARGET_ANGLE = 360;
const GHOST_LOCK_THRESHOLD = 333;
const MAX_DICE_AFTER_THRESHOLD = 5;
const MIN_SETS_BEFORE_SPECIALIZATION = 5;
const MAX_SETS_SAFETY = 100;

// Opulence Points by Karma tier
const KARMA_OP_TABLE: [number, number][] = [
  [90, 10],   // 90%+ karma = 10 OP
  [80, 8],    // 80-89% = 8 OP
  [70, 6],    // 70-79% = 6 OP
  [60, 5],    // 60-69% = 5 OP
  [50, 4],    // 50-59% = 4 OP
  [40, 3],    // 40-49% = 3 OP
  [30, 2],    // 30-39% = 2 OP
  [0, 1],     // <30% = 1 OP
];

// 360° Combat Angle Zones (8 cardinal directions)
interface AngleZone {
  name: string;
  range: [number, number];
  element: Element;
  description: string;
}

const ANGLE_ZONES: AngleZone[] = [
  { name: 'North',     range: [0, 45],    element: 'Ether', description: 'Zenith attacks, spiritual strikes' },
  { name: 'Northeast', range: [45, 90],   element: 'Air',   description: 'Aerial assaults, wind-based attacks' },
  { name: 'East',      range: [90, 135],  element: 'Fire',  description: 'Direct frontal attacks, burning strikes' },
  { name: 'Southeast', range: [135, 180], element: 'Water', description: 'Flowing attacks, fluid maneuvers' },
  { name: 'South',     range: [180, 225], element: 'Earth', description: 'Ground-based attacks, stone strikes' },
  { name: 'Southwest', range: [225, 270], element: 'Chaos', description: 'Wild attacks, unpredictable strikes' },
  { name: 'West',      range: [270, 315], element: 'Order', description: 'Precision attacks, mathematical strikes' },
  { name: 'Northwest', range: [315, 360], element: 'Coin',  description: 'Transactional strikes, mercantile attacks' },
];

// ── GWE CHARACTER CREATION ──

/** Generate a single GWE dice set */
export function rollGWESet(
  setNumber: number,
  remainingAngle: number,
  totalSets: number,
  specializedElements?: CoreElement[]
): GWESet {
  let diceToRoll: CoreElement[];

  if (totalSets < MIN_SETS_BEFORE_SPECIALIZATION) {
    // First 5 sets: roll ALL 6 core dice
    diceToRoll = [...CORE_ELEMENTS];
  } else if (specializedElements && specializedElements.length > 0) {
    // After 5 sets: player can specialize
    diceToRoll = specializedElements;
  } else {
    // Default specialization: all 6
    diceToRoll = [...CORE_ELEMENTS];
  }

  // Ghost-lock prevention: after 333°, limit to 5 dice max
  if (remainingAngle <= (TARGET_ANGLE - GHOST_LOCK_THRESHOLD)) {
    // Filter to only dice whose max won't overshoot
    diceToRoll = diceToRoll.filter(e => ELEMENT_DICE[e] <= remainingAngle);
    if (diceToRoll.length > MAX_DICE_AFTER_THRESHOLD) {
      diceToRoll = diceToRoll.slice(0, MAX_DICE_AFTER_THRESHOLD);
    }
  }

  // If no valid dice fit, use the smallest die and clamp to exact remaining
  if (diceToRoll.length === 0) {
    if (remainingAngle > 0 && remainingAngle <= 4) {
      // Final closing roll: roll D4 (Fire) clamped to exact remaining degrees
      const roll = Math.min(rollDie(4), remainingAngle);
      return { setNumber, rolls: { Fire: roll }, angle: roll, isGhost: false };
    }
    return { setNumber, rolls: {}, angle: 0, isGhost: true };
  }

  const rolls: Partial<Record<CoreElement, number>> = {};
  let angle = 0;

  for (const element of diceToRoll) {
    const max = ELEMENT_DICE[element];
    const roll = rollDie(max);
    rolls[element] = roll;
    angle += roll;
  }

  // Check if this set would overshoot — clamp to remaining angle
  if (angle > remainingAngle) {
    // Scale down proportionally to fit remaining angle
    const scale = remainingAngle / angle;
    angle = 0;
    for (const element of diceToRoll) {
      const clamped = Math.max(1, Math.round(rolls[element]! * scale));
      rolls[element] = clamped;
      angle += clamped;
    }
    // Final adjustment if rounding drifted
    if (angle > remainingAngle) {
      const firstElement = diceToRoll[0];
      rolls[firstElement] = Math.max(1, rolls[firstElement]! - (angle - remainingAngle));
      angle = remainingAngle;
    } else if (angle < remainingAngle) {
      const lastElement = diceToRoll[diceToRoll.length - 1];
      rolls[lastElement] = rolls[lastElement]! + (remainingAngle - angle);
      angle = remainingAngle;
    }
  }

  return { setNumber, rolls, angle, isGhost: false };
}

/** Calculate elemental composition from all GWE sets */
export function calculateElementalComposition(sets: GWESet[]): ElementalComposition {
  const percentages = {} as Record<CoreElement, number>;
  const eggPercentages = {} as Record<CoreElement, number>;
  let aaaTotal = 0;

  for (const element of CORE_ELEMENTS) {
    let totalRolled = 0;
    let timesRolled = 0;
    const dieMax = ELEMENT_DICE[element];

    for (const set of sets) {
      if (set.rolls[element] !== undefined) {
        totalRolled += set.rolls[element]!;
        timesRolled++;
      }
    }

    const maxPossible = timesRolled * dieMax;
    percentages[element] = maxPossible > 0 ? (totalRolled / maxPossible) * 100 : 0;
    aaaTotal += percentages[element];
  }

  for (const element of CORE_ELEMENTS) {
    eggPercentages[element] = percentages[element] > 0
      ? (percentages[element] / aaaTotal) * 100
      : 0;
  }

  return { percentages, aaaPercentage: aaaTotal, eggPercentages };
}

/** Calculate Karma percentage */
export function calculateKarma(sets: GWESet[]): number {
  let totalRolled = 0;
  let totalPossible = 0;

  for (const set of sets) {
    for (const element of CORE_ELEMENTS) {
      if (set.rolls[element] !== undefined) {
        totalRolled += set.rolls[element]!;
        totalPossible += ELEMENT_DICE[element];
      }
    }
  }

  return totalPossible > 0 ? (totalRolled / totalPossible) * 100 : 0;
}

/** Calculate Opulence Points from Karma */
export function calculateOP(karma: number): number {
  for (const [threshold, op] of KARMA_OP_TABLE) {
    if (karma >= threshold) return op;
  }
  return 1;
}

/** Generate a complete Godz World Egg */
export function createGodzWorldEgg(): DiceGodzCharacterSheet {
  const sets: GWESet[] = [];
  let totalAngle = 0;
  let setNumber = 0;

  while (totalAngle < TARGET_ANGLE && setNumber < MAX_SETS_SAFETY) {
    setNumber++;
    const remaining = TARGET_ANGLE - totalAngle;
    const set = rollGWESet(setNumber, remaining, sets.length);

    sets.push(set);
    totalAngle += set.angle;

    // Exact 360 check
    if (totalAngle === TARGET_ANGLE) break;

    // Overshoot protection (shouldn't happen with ghost-lock, but safety)
    if (totalAngle > TARGET_ANGLE) {
      // Undo last set and try again with fewer dice
      sets.pop();
      totalAngle -= set.angle;
      setNumber--;
      // Try with only the smallest dice
      const smallSet = rollGWESet(setNumber + 1, remaining, sets.length, ['Fire']);
      sets.push(smallSet);
      totalAngle += smallSet.angle;
      break;
    }
  }

  // Ensure exactly 360° — if a few degrees short, add a final closing set
  if (totalAngle < TARGET_ANGLE && totalAngle >= TARGET_ANGLE - 4) {
    const diff = TARGET_ANGLE - totalAngle;
    setNumber++;
    sets.push({ setNumber, rolls: { Fire: diff }, angle: diff, isGhost: false });
    totalAngle = TARGET_ANGLE;
  }

  const composition = calculateElementalComposition(sets);
  const karma = calculateKarma(sets);
  const opulencePoints = calculateOP(karma);
  const speed = sets.filter(s => !s.isGhost || s.angle > 0).length;

  return {
    gweSets: sets,
    totalAngle,
    speed,
    power: speed,
    karma,
    elementalComposition: composition,
    opulencePoints,
    opulences: { strength: 0, beauty: 0, fame: 0, knowledge: 0, wealth: 0, renunciation: 0 },
    orderScore: Math.round(karma), // Karma * 100 / 100 = karma as integer
    wealthState: 'scarcity',       // Starts as scarcity until Renunciation OP > 0
    hp: 10 + Math.round(composition.percentages.Earth / 10), // Earth-derived HP
    maxHp: 10 + Math.round(composition.percentages.Earth / 10),
    currentAngle: 0,
  };
}

/** Distribute Opulence Points across the 6 Opulences */
export function distributeOpulences(
  sheet: DiceGodzCharacterSheet,
  distribution: Partial<Opulences>
): DiceGodzCharacterSheet {
  const total = Object.values(distribution).reduce((a, b) => a + (b || 0), 0);
  if (total !== sheet.opulencePoints) {
    throw new Error(`Must distribute exactly ${sheet.opulencePoints} OP (got ${total})`);
  }

  const opulences: Opulences = {
    strength: distribution.strength || 0,
    beauty: distribution.beauty || 0,
    fame: distribution.fame || 0,
    knowledge: distribution.knowledge || 0,
    wealth: distribution.wealth || 0,
    renunciation: distribution.renunciation || 0,
  };

  // D2 Wealth State: Flow if Renunciation > 0, else Scarcity
  const wealthState = opulences.renunciation > 0 ? 'flow' : 'scarcity';

  // D100 Order Score: grows with Knowledge OP + base karma
  const orderScore = Math.round(sheet.karma) + (opulences.knowledge * 10);

  return { ...sheet, opulences, wealthState, orderScore };
}

// ── ATTAINMENT CHECKS ──

export interface AttainmentCheck {
  element: CoreElement;
  roll: DiceRoll;
  requiredAttainment: number; // 0-100 percentage
  actualAttainment: number;   // 0-100 percentage
  success: boolean;
  isCritical: boolean;
  narrative: string;
}

/** Make an attainment check (core Dice Godz mechanic) */
export function attainmentCheck(
  element: CoreElement,
  requiredPercent: number,
  bonusPercent: number = 0
): AttainmentCheck {
  const roll = rollElement(element);
  const actualAttainment = (roll.attainment * 100) + bonusPercent;
  const success = roll.isCritical || actualAttainment >= requiredPercent;

  const emoji = ELEMENT_EMOJI[element] || '🎲';
  let narrative: string;
  if (roll.isCritical) {
    narrative = `${emoji}💥 CRITICAL ${element}! D${roll.die}: ${roll.roll}/${roll.die} (${Math.round(actualAttainment)}% vs ${requiredPercent}% needed)`;
  } else if (success) {
    narrative = `${emoji}✅ ${element} check passed! D${roll.die}: ${roll.roll}/${roll.die} (${Math.round(actualAttainment)}% vs ${requiredPercent}% needed)`;
  } else {
    narrative = `${emoji}❌ ${element} check failed. D${roll.die}: ${roll.roll}/${roll.die} (${Math.round(actualAttainment)}% vs ${requiredPercent}% needed)`;
  }

  return { element, roll, requiredAttainment: requiredPercent, actualAttainment, success, isCritical: roll.isCritical, narrative };
}

// ── 360° COMBAT ──

/** Get the angle zone for a given angle */
export function getAngleZone(angle: number): AngleZone {
  const normalized = ((angle % 360) + 360) % 360;
  return ANGLE_ZONES.find(z => normalized >= z.range[0] && normalized < z.range[1]) || ANGLE_ZONES[0];
}

/** Get optimal angle for an element */
export function getOptimalAngle(element: Element): number {
  const zone = ANGLE_ZONES.find(z => z.element === element);
  if (!zone) return 0;
  return (zone.range[0] + zone.range[1]) / 2;
}

/** Calculate angular distance (shortest arc) */
export function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/** Calculate angle modifier based on distance from optimal */
export function angleModifier(distance: number): number {
  if (distance <= 22.5) return 0.25;  // Primary advantage
  if (distance <= 45) return 0.15;    // Secondary advantage
  if (distance <= 90) return 0;       // Neutral
  if (distance <= 135) return -0.15;  // Disadvantage
  return -0.25;                        // Severe disadvantage
}

/** Resolve 360° combat between attacker and defender */
export function resolve360Combat(
  attackerElement: CoreElement,
  defenderElement: CoreElement,
  attackAngle: number,
  attackerBonus: number = 0,
  defenderBonus: number = 0
): CombatResult {
  const attackerRoll = rollElement(attackerElement);
  const defenderRoll = rollElement(defenderElement);

  const optimalAngle = getOptimalAngle(attackerElement);
  const distance = angularDistance(attackAngle, optimalAngle);
  const modifier = angleModifier(distance);

  const attackerScore = Math.min(1, Math.max(0,
    attackerRoll.attainment + modifier + (attackerBonus / 100)
  ));
  const defenderScore = Math.min(1, Math.max(0,
    defenderRoll.attainment + (modifier < 0 ? Math.abs(modifier) * 0.5 : 0) + (defenderBonus / 100)
  ));

  const zone = getAngleZone(attackAngle);
  const success = attackerScore > defenderScore;
  const isCritical = attackerRoll.isCritical;

  const damage = success ? Math.max(1, Math.ceil((attackerScore - defenderScore) * 10)) : 0;

  const atkEmoji = ELEMENT_EMOJI[attackerElement];
  const defEmoji = ELEMENT_EMOJI[defenderElement];

  let narrative = `${atkEmoji} attacks from ${zone.name} (${Math.round(attackAngle)}°) — ${zone.description}\n`;
  narrative += `  Attacker: D${attackerRoll.die} rolled ${attackerRoll.roll} (${formatAttainment(attackerScore)} effective)\n`;
  narrative += `  Defender: D${defenderRoll.die} rolled ${defenderRoll.roll} (${formatAttainment(defenderScore)} effective)\n`;

  if (isCritical) {
    narrative += `  💥 CRITICAL HIT! ${damage * 2} damage!`;
  } else if (success) {
    narrative += `  ⚔️ Hit! ${damage} damage dealt.`;
  } else {
    narrative += `  🛡️ Blocked! No damage.`;
  }

  return {
    success,
    attackerRoll,
    defenderRoll,
    damage: isCritical ? damage * 2 : damage,
    narrative,
    isCritical,
    effects: [],
  };
}

// ── CHARACTER SHEET RENDERING ──

export function renderDiceGodzSheet(sheet: DiceGodzCharacterSheet): string {
  const lines: string[] = [];
  lines.push('╔═══════════════════════════════════════════════╗');
  lines.push('║  🎲 DICE GODZ CHARACTER SHEET                ║');
  lines.push('╠═══════════════════════════════════════════════╣');
  lines.push(`║  ☯️  Karma: ${sheet.karma.toFixed(1)}%`);
  lines.push(`║  ⚡ Speed: ${sheet.speed}  |  💪 Power: ${sheet.power}`);
  lines.push(`║  ❤️  HP: ${sheet.hp}/${sheet.maxHp}`);
  lines.push(`║  ⚪ Order (D100): ${sheet.orderScore}`);
  lines.push(`║  🪙 Wealth: ${sheet.wealthState === 'flow' ? '🌊 Flow' : '🏜️ Scarcity'}`);
  lines.push('║');
  lines.push('║  ── ELEMENTAL COMPOSITION ──');
  for (const elem of CORE_ELEMENTS) {
    const pct = sheet.elementalComposition.percentages[elem];
    const egg = sheet.elementalComposition.eggPercentages[elem];
    const emoji = ELEMENT_EMOJI[elem];
    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    lines.push(`║  ${emoji} ${elem.padEnd(6)} ${bar} ${pct.toFixed(1)}% (${egg.toFixed(1)}% egg)`);
  }
  lines.push('║');
  lines.push('║  ── OPULENCES ──');
  lines.push(`║  💪 Strength:    ${sheet.opulences.strength} (Bala/Air)`);
  lines.push(`║  🌸 Beauty:      ${sheet.opulences.beauty} (Shri/Fire)`);
  lines.push(`║  ⭐ Fame:        ${sheet.opulences.fame} (Yashas/Ether)`);
  lines.push(`║  📚 Knowledge:   ${sheet.opulences.knowledge} (Jnana/Order)`);
  lines.push(`║  💰 Wealth:      ${sheet.opulences.wealth} (Aishvarya/Coin)`);
  lines.push(`║  🧘 Renunciation: ${sheet.opulences.renunciation} (Vairagya/Chaos)`);
  lines.push('║');
  lines.push(`║  GWE Sets: ${sheet.gweSets.length} | Total Angle: ${sheet.totalAngle}°`);
  lines.push('╚═══════════════════════════════════════════════╝');
  return lines.join('\n');
}
