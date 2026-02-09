// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Command Parser
// Parses player text input into structured commands
// ═══════════════════════════════════════════════════════════════

import type { CommandName, ParsedCommand } from './types.js';

// Direction aliases
const DIRECTION_ALIASES: Record<string, CommandName> = {
  n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down',
  north: 'north', south: 'south', east: 'east', west: 'west', up: 'up', down: 'down',
};

// Command aliases
const COMMAND_ALIASES: Record<string, CommandName> = {
  // Movement
  go: 'go', move: 'go', walk: 'go', run: 'go',
  ...DIRECTION_ALIASES,
  // Look
  l: 'look', look: 'look', examine: 'examine', x: 'examine', inspect: 'examine',
  search: 'search',
  // Inventory
  i: 'inventory', inv: 'inventory', inventory: 'inventory',
  take: 'take', get: 'take', grab: 'take', pick: 'take', pickup: 'take',
  drop: 'drop', discard: 'drop',
  use: 'use', activate: 'use',
  equip: 'equip', wear: 'equip', wield: 'equip',
  unequip: 'unequip', remove: 'unequip',
  // Combat
  attack: 'attack', hit: 'attack', strike: 'attack', fight: 'attack', kill: 'attack',
  defend: 'defend', block: 'defend', parry: 'defend',
  flee: 'flee', escape: 'flee', retreat: 'flee',
  cast: 'cast', spell: 'cast',
  sing: 'sing', song: 'sing',
  play: 'play', perform: 'play', music: 'play',
  // Dice
  roll: 'roll',
  check: 'check',
  // Social
  talk: 'talk', speak: 'talk', greet: 'talk', ask: 'talk',
  say: 'say',
  yell: 'yell', shout: 'yell',
  whisper: 'whisper',
  // Character
  stats: 'stats', status: 'stats', score: 'stats',
  sheet: 'sheet', character: 'sheet', char: 'sheet',
  // System
  system: 'system', sys: 'system', mode: 'system',
  help: 'help', '?': 'help', commands: 'help',
  map: 'map', minimap: 'map',
  who: 'who', players: 'who', online: 'who',
  save: 'save',
  quit: 'quit', exit: 'quit', q: 'quit',
};

export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const first = parts[0].toLowerCase();
  const rest = parts.slice(1);

  // Check if it's a direction shorthand (just typing 'n', 'south', etc.)
  if (DIRECTION_ALIASES[first] && rest.length === 0) {
    return {
      command: DIRECTION_ALIASES[first],
      args: [],
      rawInput: trimmed,
    };
  }

  // Extended directions (southeast, nw, etc.) → route through 'go'
  const EXTENDED_DIRS: Record<string, string> = {
    ne: 'northeast', nw: 'northwest', se: 'southeast', sw: 'southwest',
    northeast: 'northeast', northwest: 'northwest', southeast: 'southeast', southwest: 'southwest',
  };
  if (EXTENDED_DIRS[first] && rest.length === 0) {
    return {
      command: 'go',
      args: [EXTENDED_DIRS[first]],
      rawInput: trimmed,
    };
  }

  // Check for 'go <direction>'
  if (first === 'go' && rest.length > 0) {
    const dir = rest[0].toLowerCase();
    if (DIRECTION_ALIASES[dir]) {
      return {
        command: DIRECTION_ALIASES[dir],
        args: rest.slice(1),
        rawInput: trimmed,
      };
    }
    // Non-standard direction (named exit)
    return {
      command: 'go',
      args: rest,
      rawInput: trimmed,
    };
  }

  // Look up command
  const command = COMMAND_ALIASES[first];
  if (!command) {
    return null; // Unknown command
  }

  return {
    command,
    args: rest,
    rawInput: trimmed,
  };
}

export function getHelpText(): string {
  return `
╔═══════════════════════════════════════════════╗
║  🎲 CRYING DEPTHS MUD — Commands             ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  MOVEMENT                                     ║
║    n/s/e/w/u/d  — Move in a direction         ║
║    go <exit>    — Use a named exit            ║
║                                               ║
║  EXPLORATION                                  ║
║    look (l)     — Look around                 ║
║    examine <x>  — Examine something closely   ║
║    search       — Search the room             ║
║    map          — Show dungeon map            ║
║                                               ║
║  ITEMS                                        ║
║    take <item>  — Pick up an item             ║
║    drop <item>  — Drop an item                ║
║    use <item>   — Use an item                 ║
║    inventory (i) — Check your pack            ║
║    equip <item> — Equip a weapon/armor        ║
║                                               ║
║  COMBAT                                       ║
║    attack <tgt> — Attack a target             ║
║    defend       — Take defensive stance       ║
║    cast <spell> — Cast a spell                ║
║    flee         — Attempt to flee combat      ║
║                                               ║
║  MUSIC (CrySword SAGA)                        ║
║    play <inst>  — Play an instrument          ║
║    sing         — Sing (D12 Ether check)      ║
║                                               ║
║  SOCIAL                                       ║
║    talk <npc>   — Talk to an NPC              ║
║    say <msg>    — Say something to the room   ║
║    yell <msg>   — Shout (heard in adj. rooms) ║
║    whisper <who> <msg> — Private message      ║
║                                               ║
║  CHARACTER                                    ║
║    stats        — Quick status view           ║
║    sheet        — Full character sheet         ║
║    roll <elem>  — Roll an elemental die       ║
║    check <elem> — Make an attainment check    ║
║                                               ║
║  SYSTEM                                       ║
║    system <sys> — Switch: dice-godz/pf/mm3e   ║
║    who          — List online players         ║
║    help         — This help text              ║
║    save         — Save your character         ║
║    quit         — Leave the game              ║
║                                               ║
╚═══════════════════════════════════════════════╝`;
}
