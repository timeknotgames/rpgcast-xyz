// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Game Loop / Command Processor
// Dispatches parsed commands to world engine and game systems
// MULTI-USER: all commands are session-aware
// ═══════════════════════════════════════════════════════════════

import { World } from './world.js';
import { parseCommand, getHelpText } from './command-parser.js';
import { rollDie, rollCheck, rollPercentile, flipCoin, narrateRoll } from './dice.js';
import {
  attainmentCheck, createGodzWorldEgg, distributeOpulences,
  resolve360Combat, renderDiceGodzSheet, getAngleZone,
} from '../systems/dice-godz.js';
import { pfAttack, pfSavingThrow, pfSkillCheck, renderPathfinderSheet } from '../systems/pathfinder.js';
import { mm3eAttack, mm3eCheck, mm3eResistanceCheck, usePower, renderMM3eSheet } from '../systems/mm3e.js';
import { getAllSessions, broadcastToRoom, broadcastGlobal, sessionCount, getSession, saveSessionCharacter } from '../server/session.js';
import { parseGMCommand } from '../auth/gm-tools.js';
import { getLeaderboard } from '../auth/gm-tools.js';
import type { PlayerState, GameSystem, Element, CoreElement, Room, RoomCheck } from './types.js';
import { ELEMENT_EMOJI, UI_EMOJI, CHAR_EMOJI } from '../data/emoji.js';
import { CORE_ELEMENTS, ELEMENT_DICE } from './types.js';

export class GameLoop {
  world: World;
  private tickInterval: NodeJS.Timeout | null = null;

  constructor(world: World) {
    this.world = world;
    this.startTick();
  }

  // ── MAIN COMMAND DISPATCH ──

  processInput(playerId: string, rawInput: string): string {
    const player = this.world.getPlayer(playerId);
    if (!player) return '❌ Session not found. Try reconnecting.';

    const parsed = parseCommand(rawInput);
    if (!parsed) {
      // Check if the player typed an item/NPC name without a verb
      const room = this.world.getRoom(player.currentRoomId);
      const word = rawInput.trim().toLowerCase();
      if (room) {
        const matchItem = room.items?.find(i => i.name.toLowerCase().includes(word) || word.includes(i.name.toLowerCase()));
        if (matchItem) return `💡 To pick up ${matchItem.emoji} ${matchItem.name}, type: take ${matchItem.name.toLowerCase().split(' ')[0]}`;
        const matchNpc = room.npcs?.find(n => n.name.toLowerCase().includes(word) || word.includes(n.name.toLowerCase()));
        if (matchNpc) return `💡 To interact with ${matchNpc.emoji} ${matchNpc.name}, try: talk ${matchNpc.name.toLowerCase().split(' ')[0]}`;
      }
      return '❓ What? Type "help" for commands.';
    }

    switch (parsed.command) {
      // ── NAVIGATION ──
      case 'north': case 'south': case 'east': case 'west':
      case 'up': case 'down':
        return this.handleMove(player, parsed.command);

      case 'go':
        return this.handleMove(player, parsed.args[0] || '');

      // ── OBSERVATION ──
      case 'look':
        if (parsed.args.length > 0) return this.world.examine(playerId, parsed.args.join(' '));
        return this.world.lookRoom(playerId);

      case 'examine':
        return this.world.examine(playerId, parsed.args.join(' ') || '');

      case 'search':
        return this.handleSearch(player);

      case 'map':
        return this.world.renderMinimap(playerId);

      // ── INVENTORY ──
      case 'take':
        return this.world.takeItem(playerId, parsed.args.join(' '));

      case 'drop':
        return this.world.dropItem(playerId, parsed.args.join(' '));

      case 'inventory':
        return this.world.showInventory(playerId);

      case 'use':
        return this.handleUse(player, parsed.args.join(' '));

      case 'equip':
        return this.handleEquip(player, parsed.args.join(' '));

      case 'unequip':
        return this.handleUnequip(player, parsed.args.join(' '));

      // ── NPC INTERACTION ──
      case 'talk':
        return this.world.talkToNPC(playerId, parsed.args.join(' '));

      // ── COMBAT & CHECKS ──
      case 'attack':
        return this.handleAttack(player, parsed.args);

      case 'defend':
        return this.handleDefend(player);

      case 'flee':
        return this.handleFlee(player);

      case 'check':
        return this.handleCheck(player, parsed.args);

      case 'roll':
        return this.handleRoll(player, parsed.args);

      case 'cast':
        return this.handleCast(player, parsed.args);

      // ── MUSIC / PERFORMANCE ──
      case 'sing': case 'play':
        return this.handleMusic(player, parsed.args);

      // ── CHARACTER ──
      case 'stats': case 'sheet':
        return this.handleSheet(player);

      case 'system':
        return this.handleSystemSwitch(player, parsed.args[0]);

      // ── MULTI-USER COMMUNICATION ──
      case 'say':
        return this.handleSay(player, parsed.args.join(' '));

      case 'yell':
        return this.handleYell(player, parsed.args.join(' '));

      case 'whisper':
        return this.handleWhisper(player, parsed.args);

      case 'who':
        return this.handleWho();

      // ── META ──
      case 'help':
        return getHelpText();

      case 'save': {
        // Trigger actual save if authenticated
        const saveSession = getAllSessions().find(s => s.playerState.id === playerId);
        if (saveSession?.dbCharacterId) {
          saveSessionCharacter(saveSession).catch(() => {});
          return '💾 Character saved to database.';
        }
        return '💾 Progress noted. (Login to enable persistent saves.)';
      }

      case 'leaderboard':
      case 'lb':
        return this.handleLeaderboard(playerId);

      // ── GM COMMANDS ──
      case 'gm':
        return this.handleGM(playerId, parsed.args.join(' '));

      case 'quit':
        return 'Farewell, adventurer.';

      default:
        return `❓ Unknown command: "${parsed.rawInput}". Type "help" for commands.`;
    }
  }

  // ── MOVEMENT ──

  private handleMove(player: PlayerState, direction: string): string {
    if (!direction) return '❓ Which direction? (north, south, east, west, up, down)';

    const result = this.world.movePlayer(player.id, direction);

    if (result.success && result.newRoom) {
      // Notify other players in the OLD room
      broadcastToRoom(player.currentRoomId, `📢 ${player.name} has left heading ${direction}.`, player.id);
      // Notify players in the NEW room
      broadcastToRoom(result.newRoom.id, `📢 ${player.name} arrives.`, player.id);
    }

    return result.message;
  }

  // ── SEARCH ──

  private handleSearch(player: PlayerState): string {
    const room = this.world.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    // Roll a search check based on active system
    let searchResult: string;
    switch (player.activeSystem) {
      case 'dice-godz': {
        const check = attainmentCheck('Chaos', 40);
        searchResult = check.narrative + '\n';
        if (check.success) {
          searchResult += this.world.searchRoom(player.id);
        } else {
          searchResult += '🔍 You search but find nothing unusual.';
        }
        break;
      }
      case 'pathfinder': {
        const result = rollCheck(
          (player.pathfinderSheet?.skills['Perception'] || 0),
          15
        );
        searchResult = `🔍 Perception: d20+${player.pathfinderSheet?.skills['Perception'] || 0} = ${result.total} vs DC 15 — ${result.success ? 'Success!' : 'Failure'}\n`;
        if (result.success) {
          searchResult += this.world.searchRoom(player.id);
        } else {
          searchResult += 'You search but find nothing unusual.';
        }
        break;
      }
      case 'mm3e': {
        const result = rollCheck(
          (player.mm3eSheet?.abilities.AWE || 0),
          15
        );
        searchResult = `🔍 Awareness: d20+${player.mm3eSheet?.abilities.AWE || 0} = ${result.total} vs DC 15 — ${result.success ? 'Success!' : 'Failure'}\n`;
        if (result.success) {
          searchResult += this.world.searchRoom(player.id);
        } else {
          searchResult += 'You search but find nothing unusual.';
        }
        break;
      }
    }

    return searchResult;
  }

  // ── ITEM USE ──

  private handleUse(player: PlayerState, itemName: string): string {
    if (!itemName) return '❓ Use what? (use <item name>)';
    const item = player.inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    if (!item) return `❌ You don't have "${itemName}".`;
    if (!item.usable) return `❌ You can't use the ${item.name}.`;
    return `${item.emoji} You use the ${item.name}. ${item.description}`;
  }

  private handleEquip(player: PlayerState, itemName: string): string {
    if (!itemName) return '❓ Equip what?';
    const item = player.inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    if (!item) return `❌ You don't have "${itemName}".`;
    if (!item.equippable) return `❌ You can't equip the ${item.name}.`;
    item.equipped = true;
    return `⚔️ You equip the ${item.name}.`;
  }

  private handleUnequip(player: PlayerState, itemName: string): string {
    if (!itemName) return '❓ Unequip what?';
    const item = player.inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()) && i.equipped);
    if (!item) return `❌ You don't have that equipped.`;
    item.equipped = false;
    return `${item.emoji} You unequip the ${item.name}.`;
  }

  // ── COMBAT ──

  private handleAttack(player: PlayerState, args: string[]): string {
    const room = this.world.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const targetName = args.join(' ');
    if (!targetName) return '❓ Attack whom? (attack <target>)';

    const npc = room.npcs.find(n => n.name.toLowerCase().includes(targetName.toLowerCase()));
    if (!npc) return `❌ You don't see "${targetName}" here.`;

    if (!npc.hostile && !npc.combatStatsId) {
      return `${npc.emoji} ${npc.name} is not hostile. Perhaps try "talk" instead?`;
    }

    switch (player.activeSystem) {
      case 'dice-godz': {
        // Pick attacker element (default to strongest or first arg)
        const element: CoreElement = (args[0] as CoreElement) || 'Fire';
        const validElement = CORE_ELEMENTS.includes(element) ? element : 'Fire';
        const result = resolve360Combat(validElement, 'Chaos', player.diceGodzSheet?.currentAngle || 0);
        return `⚔️ You attack ${npc.emoji} ${npc.name}!\n${result.narrative}`;
      }
      case 'pathfinder': {
        const bab = player.pathfinderSheet?.bab || 0;
        const strMod = player.pathfinderSheet?.abilityMods?.STR || 0;
        const result = pfAttack(bab + strMod, 15, '1d8', strMod, 2);
        let msg = `⚔️ You attack ${npc.emoji} ${npc.name}!\n`;
        msg += `  Attack: d20+${bab + strMod} = ${result.roll} vs AC 15\n`;
        msg += result.hit ? `  💥 Hit! ${result.damage} damage.` : `  💨 Miss!`;
        if (result.critical) msg += ' CRITICAL!';
        return msg;
      }
      case 'mm3e': {
        const fgt = player.mm3eSheet?.abilities.FGT || 0;
        const str = player.mm3eSheet?.abilities.STR || 0;
        const result = mm3eAttack(fgt, 'close', false);
        let msg = `⚔️ You attack ${npc.emoji} ${npc.name}!\n`;
        msg += `  Attack: d20+${fgt} = ${result.total} vs Parry\n`;
        msg += result.hit ? `  💥 Hit! Effect DC ${15 + str} Toughness save.` : `  💨 Miss!`;
        return msg;
      }
    }
  }

  private handleDefend(player: PlayerState): string {
    return `🛡️ ${player.name} takes a defensive stance. +2 to defenses until next turn.`;
  }

  private handleFlee(player: PlayerState): string {
    const room = this.world.getRoom(player.currentRoomId);
    if (!room || room.exits.length === 0) return '❌ There is nowhere to flee!';

    // Pick a random unlocked exit
    const validExits = room.exits.filter(e => !e.locked && !e.hidden);
    if (validExits.length === 0) return '❌ All exits are locked! You cannot flee!';

    const exit = validExits[Math.floor(Math.random() * validExits.length)];
    return this.handleMove(player, exit.direction);
  }

  // ── SKILL / ATTAINMENT CHECKS ──

  private handleCheck(player: PlayerState, args: string[]): string {
    const room = this.world.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    // If element specified, do an attainment check
    const elementArg = args[0]?.charAt(0).toUpperCase() + (args[0]?.slice(1).toLowerCase() || '');
    if (elementArg && CORE_ELEMENTS.includes(elementArg as CoreElement)) {
      return this.doRoomCheck(player, room, elementArg as CoreElement);
    }

    // Show available checks
    if (room.checks.length === 0) return '🔍 There are no special checks available here.';

    const lines = ['🔍 Available checks:'];
    for (const check of room.checks) {
      const emoji = ELEMENT_EMOJI[check.element];
      lines.push(`  ${emoji} ${check.element} (${check.attainment}% needed)`);
    }
    lines.push('\nType: check <element> (e.g., "check fire")');
    return lines.join('\n');
  }

  private doRoomCheck(player: PlayerState, room: Room, element: CoreElement): string {
    const check = room.checks.find(c => c.element === element);
    if (!check) return `❌ No ${element} check available here.`;

    switch (player.activeSystem) {
      case 'dice-godz': {
        const result = attainmentCheck(element, check.attainment);
        const text = result.success ? check.successText : check.failureText;
        return `${result.narrative}\n\n${text}`;
      }
      case 'pathfinder': {
        // Map element to PF skill
        const skillMap: Record<string, string> = {
          Fire: 'Acrobatics', Earth: 'Survival', Air: 'Athletics',
          Chaos: 'Sense Motive', Ether: 'Perform', Water: 'Diplomacy',
        };
        const skill = skillMap[element] || 'Perception';
        const mod = player.pathfinderSheet?.skills[skill] || 0;
        const dc = 10 + Math.round(check.attainment / 5);
        const result = rollCheck(mod, dc);
        const success = result.success;
        const text = success ? check.successText : check.failureText;
        return `🎲 ${skill}: d20+${mod} = ${result.total} vs DC ${dc} — ${success ? '✅ Success!' : '❌ Failed'}\n\n${text}`;
      }
      case 'mm3e': {
        // Map element to M&M ability
        const abilityMap: Record<string, string> = {
          Fire: 'AGL', Earth: 'STA', Air: 'STR',
          Chaos: 'AWE', Ether: 'PRE', Water: 'AWE',
        };
        const ability = abilityMap[element] || 'AWE';
        const rank = (player.mm3eSheet?.abilities as Record<string, number>)?.[ability] || 0;
        const dc = 10 + Math.round(check.attainment / 5);
        const result = rollCheck(rank, dc);
        const success = result.success;
        const text = success ? check.successText : check.failureText;
        return `🎲 ${ability}: d20+${rank} = ${result.total} vs DC ${dc} — ${success ? '✅ Success!' : '❌ Failed'}\n\n${text}`;
      }
    }
  }

  // ── DICE ROLLING ──

  private handleRoll(player: PlayerState, args: string[]): string {
    const what = args[0]?.toLowerCase();

    // Roll GWE (Dice Godz character creation)
    if (what === 'gwe') {
      if (player.activeSystem !== 'dice-godz') {
        return '❌ GWE rolls are only available in Dice Godz mode. Type "system dice-godz" first.';
      }
      const sheet = createGodzWorldEgg();
      player.diceGodzSheet = sheet;
      player.karma = sheet.karma;
      return `🥚 YOUR GODZ WORLD EGG HAS HATCHED!\n\n${renderDiceGodzSheet(sheet)}\n\nDistribute your ${sheet.opulencePoints} Opulence Points with:\n  opulence strength 2 beauty 1 fame 1 ...`;
    }

    // Roll a specific die
    if (what && what.match(/^d?\d+$/)) {
      const max = parseInt(what.replace('d', ''), 10);
      if (max < 2 || max > 100) return '❌ Roll a die between d2 and d100.';
      const result = rollDie(max);
      return `🎲 D${max}: ${result}`;
    }

    // Roll a specific element
    const elementArg = what?.charAt(0).toUpperCase() + (what?.slice(1).toLowerCase() || '');
    if (elementArg && CORE_ELEMENTS.includes(elementArg as CoreElement)) {
      const die = ELEMENT_DICE[elementArg as Element];
      const result = rollDie(die);
      const emoji = ELEMENT_EMOJI[elementArg as Element];
      const pct = ((result / die) * 100).toFixed(1);
      return `${emoji} ${elementArg} (D${die}): ${result}/${die} (${pct}% attainment)`;
    }

    return '🎲 Roll what?\n  roll gwe — Create a Dice Godz character\n  roll d20 — Roll a d20\n  roll fire — Roll your Fire die (D4)\n  roll water — Roll your Water die (D20)';
  }

  // ── SPELLCASTING ──

  private handleCast(player: PlayerState, args: string[]): string {
    const spellName = args.join(' ');
    if (!spellName) return '❓ Cast what spell?';

    if (player.activeSystem === 'pathfinder' && player.pathfinderSheet) {
      const spell = player.pathfinderSheet.spells.find(s =>
        s.name.toLowerCase().includes(spellName.toLowerCase())
      );
      if (!spell) return `❌ You don't know "${spellName}".`;
      if (spell.prepared <= 0) return `❌ No more ${spell.name} prepared.`;
      spell.prepared--;
      return `✨ You cast ${spell.name}! (${spell.prepared} uses remaining)\n${spell.description}`;
    }

    if (player.activeSystem === 'mm3e' && player.mm3eSheet) {
      const power = player.mm3eSheet.powers.find(p =>
        p.name.toLowerCase().includes(spellName.toLowerCase())
      );
      if (!power) return `❌ You don't have the power "${spellName}".`;
      return `✨ You activate ${power.name}! (Rank ${power.rank})\n  ${power.descriptors.join(', ')}`;
    }

    if (player.activeSystem === 'dice-godz') {
      return '✨ In Dice Godz, use "check <element>" for elemental abilities.';
    }

    return '❓ Cannot cast in your current system.';
  }

  // ── MUSIC / PERFORMANCE ──

  private handleMusic(player: PlayerState, args: string[]): string {
    const room = this.world.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const emoji = ELEMENT_EMOJI.Ether;
    let response = `${emoji}🎵 ${player.name} plays music in ${room.name}...\n`;

    // Check for music-triggered events
    const musicEvents = room.events.filter(e => e.trigger === 'play_music');
    for (const event of musicEvents) {
      if (event.oneShot && player.flags[`event_${event.id}`]) continue;
      response += `\n${event.description}`;
      if (event.oneShot) player.flags[`event_${event.id}`] = true;
    }

    if (musicEvents.length === 0) {
      // Generic music response
      const check = attainmentCheck('Ether', 30);
      response += check.narrative + '\n';
      if (check.success) {
        response += '🎶 Your music echoes beautifully through the chamber.';
        broadcastToRoom(room.id, `🎶 You hear ${player.name} playing music nearby.`, player.id);
      } else {
        response += '🎵 Your playing is passable. The echoes fade quickly.';
      }
    }

    return response;
  }

  // ── CHARACTER SHEET ──

  private handleSheet(player: PlayerState): string {
    switch (player.activeSystem) {
      case 'dice-godz': {
        if (!player.diceGodzSheet) return '❌ No Dice Godz character yet. Type "roll gwe" to create one.';
        return renderDiceGodzSheet(player.diceGodzSheet);
      }
      case 'pathfinder': {
        if (!player.pathfinderSheet) return '❌ No Pathfinder character sheet loaded.';
        return renderPathfinderSheet(player.pathfinderSheet);
      }
      case 'mm3e': {
        if (!player.mm3eSheet) return '❌ No M&M 3e character sheet loaded.';
        return renderMM3eSheet(player.mm3eSheet);
      }
    }
  }

  // ── SYSTEM SWITCHING ──

  private handleSystemSwitch(player: PlayerState, system: string | undefined): string {
    if (!system) {
      return `🎮 Current system: ${player.activeSystem.toUpperCase()}\n\nSwitch with:\n  system dice-godz\n  system pathfinder\n  system mm3e`;
    }

    const systemMap: Record<string, GameSystem> = {
      'dice-godz': 'dice-godz', 'dg': 'dice-godz', 'godz': 'dice-godz',
      'pathfinder': 'pathfinder', 'pf': 'pathfinder', 'pf1e': 'pathfinder',
      'mm3e': 'mm3e', 'mm': 'mm3e', 'm&m': 'mm3e', 'mutants': 'mm3e',
    };

    const newSystem = systemMap[system.toLowerCase()];
    if (!newSystem) return '❌ Unknown system. Choose: dice-godz, pathfinder, or mm3e';

    player.activeSystem = newSystem;
    return `🎮 Switched to ${newSystem.toUpperCase()}. All checks and combat now use this system.`;
  }

  // ── MULTI-USER COMMUNICATION ──

  private handleSay(player: PlayerState, message: string): string {
    if (!message) return '❓ Say what?';
    broadcastToRoom(
      player.currentRoomId,
      `💬 ${player.emoji} ${player.name} says: "${message}"`,
      player.id
    );
    return `💬 You say: "${message}"`;
  }

  private handleYell(player: PlayerState, message: string): string {
    if (!message) return '❓ Yell what?';
    broadcastGlobal(`📢 ${player.emoji} ${player.name} yells: "${message}"`);
    return `📢 You yell: "${message}"`;
  }

  private handleWhisper(player: PlayerState, args: string[]): string {
    if (args.length < 2) return '❓ whisper <name> <message>';
    const targetName = args[0];
    const message = args.slice(1).join(' ');

    const sessions = getAllSessions();
    const target = sessions.find(s =>
      s.playerState.name.toLowerCase().includes(targetName.toLowerCase())
    );
    if (!target) return `❌ Player "${targetName}" not found.`;
    if (target.playerState.currentRoomId !== player.currentRoomId) {
      return `❌ ${targetName} is not in this room.`;
    }

    target.send(`🤫 ${player.emoji} ${player.name} whispers: "${message}"`);
    return `🤫 You whisper to ${target.playerState.name}: "${message}"`;
  }

  private handleWho(): string {
    const sessions = getAllSessions();
    if (sessions.length === 0) return '🌍 No adventurers online.';

    const lines = [`🌍 ${sessions.length} adventurer${sessions.length > 1 ? 's' : ''} online:\n`];
    for (const s of sessions) {
      const room = this.world.getRoom(s.playerState.currentRoomId);
      const system = s.playerState.activeSystem.toUpperCase();
      lines.push(`  ${s.playerState.emoji} ${s.playerState.name} [${system}] — ${room?.name || 'Unknown'} (${s.transport})`);
    }
    return lines.join('\n');
  }

  // ── GM COMMANDS ──

  private handleGM(playerId: string, args: string): string {
    const session = getAllSessions().find(s => s.playerState.id === playerId);
    if (!session?.dbUser) return '❌ You must be logged in to use GM commands.';

    // parseGMCommand is async, but we return synchronously — wrap in promise
    // For now, return a placeholder and queue the async result
    const userId = session.dbUser.id;
    parseGMCommand(userId, args).then(result => {
      session.send(`\n${result}`);
    }).catch(() => {
      session.send('\n❌ GM command failed.');
    });

    return '⚙️ Processing GM command...';
  }

  private handleLeaderboard(playerId: string): string {
    const session = getAllSessions().find(s => s.playerState.id === playerId);
    getLeaderboard().then(result => {
      if (session) session.send(`\n${result}`);
    }).catch(() => {
      if (session) session.send('\n📊 Leaderboard unavailable.');
    });
    return '📊 Fetching leaderboard...';
  }

  // ── GAME TICK ──

  private startTick(): void {
    // Tick every 30 seconds for ambient events, wandering monsters, etc.
    this.tickInterval = setInterval(() => {
      this.tick();
    }, 30_000);
  }

  private tick(): void {
    this.world.state.wanderingEncounterTimer++;

    // Every 5 ticks (2.5 minutes), check for wandering encounters
    if (this.world.state.wanderingEncounterTimer >= 5) {
      this.world.state.wanderingEncounterTimer = 0;

      // Send ambient sounds to players in rooms
      for (const session of getAllSessions()) {
        const room = this.world.getRoom(session.playerState.currentRoomId);
        if (room?.effects?.ambientSound) {
          session.send(`\n🔊 ${room.effects.ambientSound}`);
        }
      }
    }
  }

  stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}
