// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — GM & Admin Tools
// Create items, classes, manage game state via MUD commands
// ═══════════════════════════════════════════════════════════════

import { eq } from 'drizzle-orm';
import { db, isPersistenceEnabled } from './db.js';
import { mudCustomItems, mudCustomClasses, mudUsers, mudLeaderboards } from './schema.js';
import { isUserGM, isUserAdmin } from './auth-handler.js';
import { KALAS, VIDYAS, renderKalaList, getKala, getKalaByName, getKalasByElement, type Ability, type CustomSkill, type GemstoneSpecies, createCustomSkill, kalaCheck, renderKala } from '../data/kalas.js';
import type { CoreElement } from '../engine/types.js';

export interface GMResult {
  success: boolean;
  message: string;
}

// ── CREATE CUSTOM ITEM ──
// Usage: /createitem <id> <emoji> <name> | <description> [| pickupable | element:Fire | attainment:50]
export async function createCustomItem(
  userId: number,
  itemId: string,
  name: string,
  emoji: string,
  description: string,
  options?: {
    pickupable?: boolean;
    useEffect?: string;
    checkElement?: string;
    checkAttainment?: number;
    stats?: Record<string, unknown>;
  }
): Promise<GMResult> {
  if (!db) return { success: false, message: 'Persistence not available.' };
  if (!(await isUserGM(userId))) return { success: false, message: 'GM privileges required.' };

  try {
    await db.insert(mudCustomItems).values({
      createdBy: userId,
      itemId: itemId.toLowerCase().replace(/\s/g, '_'),
      name,
      emoji,
      description,
      pickupable: options?.pickupable ?? true,
      useEffect: options?.useEffect,
      checkElement: options?.checkElement,
      checkAttainment: options?.checkAttainment,
      stats: options?.stats ?? {},
    });
    return { success: true, message: `${emoji} Item "${name}" (${itemId}) created successfully.` };
  } catch (err: any) {
    if (err.code === '23505') return { success: false, message: `Item ID "${itemId}" already exists.` };
    return { success: false, message: `Error creating item: ${err.message}` };
  }
}

// ── CREATE CUSTOM CLASS ──
export async function createCustomClass(
  userId: number,
  classId: string,
  name: string,
  gameSystem: string,
  description: string,
  baseStats: Record<string, unknown>,
  abilities: unknown[] = [],
): Promise<GMResult> {
  if (!db) return { success: false, message: 'Persistence not available.' };
  if (!(await isUserGM(userId))) return { success: false, message: 'GM privileges required.' };

  try {
    await db.insert(mudCustomClasses).values({
      createdBy: userId,
      classId: classId.toLowerCase().replace(/\s/g, '_'),
      name,
      gameSystem,
      description,
      baseStats,
      abilities,
    });
    return { success: true, message: `Class "${name}" (${classId}) created for ${gameSystem}.` };
  } catch (err: any) {
    if (err.code === '23505') return { success: false, message: `Class ID "${classId}" already exists.` };
    return { success: false, message: `Error creating class: ${err.message}` };
  }
}

// ── PROMOTE USER TO GM ──
export async function promoteToGM(adminId: number, targetUsername: string): Promise<GMResult> {
  if (!db) return { success: false, message: 'Persistence not available.' };
  if (!(await isUserAdmin(adminId))) return { success: false, message: 'Admin privileges required.' };

  const target = await db.select().from(mudUsers).where(eq(mudUsers.username, targetUsername));
  if (target.length === 0) return { success: false, message: `User "${targetUsername}" not found.` };

  await db.update(mudUsers).set({ isGM: true }).where(eq(mudUsers.id, target[0].id));
  return { success: true, message: `${targetUsername} promoted to Game Master.` };
}

// ── LIST CUSTOM ITEMS ──
export async function listCustomItems(): Promise<{ items: Array<{ itemId: string; name: string; emoji: string }> }> {
  if (!db) return { items: [] };
  const items = await db.select({
    itemId: mudCustomItems.itemId,
    name: mudCustomItems.name,
    emoji: mudCustomItems.emoji,
  }).from(mudCustomItems);
  return { items };
}

// ── LEADERBOARD ──
export async function getLeaderboard(limit: number = 10): Promise<string> {
  if (!db) return 'Leaderboard unavailable (no database).';

  const entries = await db.select().from(mudLeaderboards)
    .orderBy(mudLeaderboards.roomsExplored)
    .limit(limit);

  if (entries.length === 0) return 'No leaderboard entries yet. Start exploring!';

  let board = '═══ LEADERBOARD ═══\n';
  entries.forEach((entry, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    board += `${medal} ${entry.characterName} — ${entry.roomsExplored} rooms, ${entry.monstersDefeated} kills, Karma ${entry.highestKarma}\n`;
  });
  return board;
}

// ── PARSE GM COMMAND ──
// Handles /gm commands in the game loop
export async function parseGMCommand(userId: number, input: string): Promise<string> {
  const parts = input.trim().split(/\s+/);
  const subcommand = parts[0]?.toLowerCase();

  switch (subcommand) {
    case 'createitem': {
      // /gm createitem <id> <emoji> <name> | <description>
      const rest = parts.slice(1).join(' ');
      const [header, description] = rest.split('|').map(s => s.trim());
      if (!header || !description) return 'Usage: /gm createitem <id> <emoji> <name> | <description>';
      const headerParts = header.split(/\s+/);
      const itemId = headerParts[0];
      const emoji = headerParts[1];
      const name = headerParts.slice(2).join(' ');
      if (!itemId || !emoji || !name) return 'Usage: /gm createitem <id> <emoji> <name> | <description>';
      const result = await createCustomItem(userId, itemId, name, emoji, description);
      return result.message;
    }

    case 'createclass': {
      // /gm createclass <id> <system> <name> | <description>
      const rest = parts.slice(1).join(' ');
      const [header, description] = rest.split('|').map(s => s.trim());
      if (!header || !description) return 'Usage: /gm createclass <id> <system> <name> | <description>\n  Systems: dice-godz, pathfinder, mm3e';
      const hparts = header.split(/\s+/);
      const classId = hparts[0];
      const gameSystem = hparts[1];
      const className = hparts.slice(2).join(' ');
      if (!classId || !gameSystem || !className) return 'Usage: /gm createclass <id> <system> <name> | <description>';
      const result = await createCustomClass(userId, classId, className, gameSystem, description, {}, []);
      return result.message;
    }

    case 'promote': {
      const targetName = parts[1];
      if (!targetName) return 'Usage: /gm promote <username>';
      const result = await promoteToGM(userId, targetName);
      return result.message;
    }

    case 'items': {
      const { items } = await listCustomItems();
      if (items.length === 0) return 'No custom items created yet.';
      return 'Custom Items:\n' + items.map(i => `  ${i.emoji} ${i.name} (${i.itemId})`).join('\n');
    }

    case 'leaderboard':
    case 'lb': {
      return getLeaderboard();
    }

    // ═══ KALA / SKILL COMMANDS (available to all players) ═══

    case 'kalas': {
      // /gm kalas [category|element|search]
      const filter = parts[1]?.toLowerCase();
      if (!filter) return renderKalaList();
      // Filter by element
      const elementMap: Record<string, string> = {
        fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water',
        chaos: 'Chaos', ether: 'Ether', order: 'Order', coin: 'Coin',
      };
      if (elementMap[filter]) {
        const kalas = getKalasByElement(elementMap[filter] as any);
        return `═══ ${elementMap[filter].toUpperCase()} KALAS ═══\n` +
          kalas.map(k => `  [${k.id}] ${k.sanskrit} — ${k.english} (${k.abilities.join('+')})`).join('\n');
      }
      // Search by name
      const found = getKalaByName(filter);
      if (found) return renderKala(found);
      return `No Kala found matching "${filter}". Try: /gm kalas [fire|earth|air|water|chaos|ether|order|money]`;
    }

    case 'kala': {
      // /gm kala <number> — show details of specific Kala
      const id = parseInt(parts[1], 10);
      if (isNaN(id) || id < 1 || id > 64) return 'Usage: /gm kala <1-64>';
      const kala = getKala(id);
      if (!kala) return 'Kala not found.';
      return renderKala(kala);
    }

    case 'vidyas': {
      const lines = ['═══ THE 14 VIDYAS (Sacred Techniques) ═══\n'];
      lines.push('── VEDAS ──');
      VIDYAS.filter(v => v.category === 'veda').forEach(v => {
        lines.push(`  [${v.id}] ${v.sanskrit} — ${v.english} (${v.abilities.join('+')})`);
      });
      lines.push('\n── UPAVEDAS ──');
      VIDYAS.filter(v => v.category === 'upaveda').forEach(v => {
        lines.push(`  [${v.id}] ${v.sanskrit} — ${v.english} (${v.abilities.join('+')})`);
      });
      lines.push('\n── VEDANGAS ──');
      VIDYAS.filter(v => v.category === 'vedanga').forEach(v => {
        lines.push(`  [${v.id}] ${v.sanskrit} — ${v.english} (${v.abilities.join('+')})`);
      });
      return lines.join('\n');
    }

    case 'kalacheck': {
      // /gm kalacheck <kala_name> [difficulty]
      const kalaName = parts[1];
      const difficulty = parseInt(parts[2], 10) || 0;
      if (!kalaName) return 'Usage: /gm kalacheck <kala_name|id> [difficulty]';
      const kala = isNaN(parseInt(kalaName, 10))
        ? getKalaByName(kalaName)
        : getKala(parseInt(kalaName, 10));
      if (!kala) return `Kala "${kalaName}" not found.`;
      // Use base value of 50 for demo (in real play, uses character's skill value)
      const result = kalaCheck(50, difficulty);
      return `${kala.sanskrit} (${kala.english}) Check:\n${result.narrative}`;
    }

    // ═══ SPECIES COMMANDS (GM only for creation) ═══

    case 'createspecies': {
      // /gm createspecies <id> <emoji> <petal> <kala#> <name> | <description>
      if (!(await isUserGM(userId))) return 'GM privileges required for species creation.';
      const rest = parts.slice(1).join(' ');
      const [header, description] = rest.split('|').map(s => s.trim());
      if (!header || !description) return 'Usage: /gm createspecies <id> <emoji> <petal> <kala#> <name> | <description>\n  Petals: Fire, Earth, Air, Water, Chaos, Ether, Order, Money\n  Kala#: 1-64 (which Kala this species has affinity with)';
      const hparts = header.split(/\s+/);
      if (hparts.length < 4) return 'Usage: /gm createspecies <id> <emoji> <petal> <kala#> <name> | <description>';
      const speciesId = hparts[0];
      const emoji = hparts[1];
      const petal = hparts[2] as CoreElement;
      const kalaNum = parseInt(hparts[3], 10);
      const speciesName = hparts.slice(4).join(' ');
      if (!speciesName || isNaN(kalaNum) || kalaNum < 1 || kalaNum > 64) {
        return 'Invalid arguments. Kala# must be 1-64.';
      }
      const kala = getKala(kalaNum);
      // Store as a custom class with gameSystem 'species'
      const speciesResult = await createCustomClass(
        userId, speciesId, speciesName, 'species', description,
        { petal, kalaAffinity: kalaNum, kalaName: kala?.english, emoji, isBoundary: false },
        [] // abilities filled via web admin or future commands
      );
      if (speciesResult.success) {
        return `${emoji} Species "${speciesName}" created!\n  Petal: ${petal} | Kala Affinity: [${kalaNum}] ${kala?.sanskrit} — ${kala?.english}`;
      }
      return speciesResult.message;
    }

    case 'species': {
      // /gm species — list all custom species
      if (!db) return 'No database available.';
      const species = await db.select({
        classId: mudCustomClasses.classId,
        name: mudCustomClasses.name,
        description: mudCustomClasses.description,
        baseStats: mudCustomClasses.baseStats,
      }).from(mudCustomClasses).where(eq(mudCustomClasses.gameSystem, 'species'));
      if (species.length === 0) return 'No custom species created yet.';
      const lines = ['═══ CUSTOM SPECIES ═══\n'];
      for (const s of species) {
        const stats = s.baseStats as Record<string, any>;
        const emoji = stats.emoji || '💎';
        lines.push(`  ${emoji} ${s.name} (${s.classId}) — Petal: ${stats.petal || '?'}, Kala: [${stats.kalaAffinity}] ${stats.kalaName || '?'}`);
      }
      return lines.join('\n');
    }

    default:
      return [
        '═══ GM COMMANDS ═══',
        '',
        '── Items & Classes ──',
        '/gm createitem <id> <emoji> <name> | <description>',
        '/gm createclass <id> <system> <name> | <description>',
        '/gm items               — List custom items',
        '',
        '── Species (GM only) ──',
        '/gm createspecies <id> <emoji> <petal> <kala#> <name> | <desc>',
        '/gm species             — List custom species',
        '',
        '── 64 Kalas & 14 Vidyas ──',
        '/gm kalas [element]     — Browse the 64 Sacred Arts',
        '/gm kala <1-64>         — View specific Kala details',
        '/gm vidyas              — Browse the 14 Vidyas',
        '/gm kalacheck <name>    — Roll a Kala skill check',
        '',
        '── Admin ──',
        '/gm promote <username>  — Promote user to GM',
        '/gm leaderboard         — View leaderboard',
        '/gm help                — This message',
      ].join('\n');
  }
}
