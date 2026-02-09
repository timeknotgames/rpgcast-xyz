// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — World Engine
// Room graph, navigation, game state, event processing
// ═══════════════════════════════════════════════════════════════

import type {
  Room, PlayerState, GameState, RoomNPC, RoomItem,
  ParsedCommand, GameSystem, InventoryItem, CombatState,
} from './types.js';
import { renderRoomView, ENV_EMOJI, UI_EMOJI } from '../data/emoji.js';

// ── WORLD CLASS ──
export class World {
  state: GameState;

  constructor(rooms: Room[]) {
    this.state = {
      players: new Map(),
      rooms: new Map(rooms.map(r => [r.id, r])),
      globalFlags: {},
      currentAct: 'I',
      wanderingEncounterTimer: 0,
      messageLog: [],
    };
  }

  // ── ROOM ACCESS ──

  getRoom(roomId: string): Room | undefined {
    return this.state.rooms.get(roomId);
  }

  getRoomList(): Room[] {
    return Array.from(this.state.rooms.values());
  }

  // ── PLAYER MANAGEMENT ──

  addPlayer(player: PlayerState): void {
    this.state.players.set(player.id, player);
  }

  removePlayer(playerId: string): void {
    this.state.players.delete(playerId);
  }

  getPlayer(playerId: string): PlayerState | undefined {
    return this.state.players.get(playerId);
  }

  getPlayersInRoom(roomId: string): PlayerState[] {
    return Array.from(this.state.players.values()).filter(p => p.currentRoomId === roomId);
  }

  // ── MOVEMENT ──

  movePlayer(playerId: string, direction: string): {
    success: boolean;
    message: string;
    newRoom?: Room;
  } {
    const player = this.getPlayer(playerId);
    if (!player) return { success: false, message: '❌ Player not found.' };

    const currentRoom = this.getRoom(player.currentRoomId);
    if (!currentRoom) return { success: false, message: '❌ Current room not found.' };

    // Find matching exit
    const exit = currentRoom.exits.find(e =>
      e.direction.toLowerCase() === direction.toLowerCase() ||
      e.targetRoomId.toLowerCase() === direction.toLowerCase()
    );

    if (!exit) {
      const availableExits = currentRoom.exits.map(e => e.direction).join(', ');
      return { success: false, message: `❌ You can't go "${direction}". Exits: ${availableExits}` };
    }

    if (exit.locked) {
      return { success: false, message: `🔒 The way ${exit.direction} is locked. ${exit.lockCondition || ''}` };
    }

    if (exit.hidden && !player.flags[`found_exit_${exit.targetRoomId}`]) {
      return { success: false, message: `❌ You can't go that way.` };
    }

    const newRoom = this.getRoom(exit.targetRoomId);
    if (!newRoom) return { success: false, message: '❌ Destination room not found.' };

    // Move player
    player.currentRoomId = newRoom.id;
    const firstVisit = !player.visitedRooms.has(newRoom.id);
    player.visitedRooms.add(newRoom.id);

    // Trigger enter events
    const enterEvents = newRoom.events.filter(e => e.trigger === 'enter');
    const eventMessages: string[] = [];
    for (const event of enterEvents) {
      if (event.oneShot && player.flags[`event_${event.id}`]) continue;
      eventMessages.push(event.description);
      if (event.oneShot) player.flags[`event_${event.id}`] = true;
    }

    // Build response
    const desc = firstVisit ? newRoom.description : newRoom.shortDescription;
    const roomView = this.renderRoom(newRoom, player);
    const eventText = eventMessages.length > 0 ? '\n\n' + eventMessages.join('\n') : '';

    return {
      success: true,
      message: `${ENV_EMOJI[exit.direction as keyof typeof ENV_EMOJI] || '🚶'} You move ${exit.direction}.\n\n${desc}\n\n${roomView}${eventText}`,
      newRoom,
    };
  }

  // ── ROOM RENDERING ──

  renderRoom(room: Room, player: PlayerState): string {
    const occupants: { emoji: string; name: string }[] = [];

    // Add NPCs
    for (const npc of room.npcs) {
      occupants.push({ emoji: npc.emoji, name: npc.name });
    }

    // Add other players
    for (const p of this.getPlayersInRoom(room.id)) {
      if (p.id !== player.id) {
        occupants.push({ emoji: p.emoji, name: p.name });
      }
    }

    const items = room.items.map(i => ({ emoji: i.emoji, name: i.name }));
    const exits = room.exits
      .filter(e => !e.hidden || player.flags[`found_exit_${e.targetRoomId}`])
      .map(e => ({
        direction: e.direction,
        emoji: ENV_EMOJI[e.direction as keyof typeof ENV_EMOJI] || '🚪',
      }));

    return renderRoomView(room.emoji, occupants, items, exits);
  }

  lookRoom(playerId: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    return `${room.name}\n${'═'.repeat(40)}\n\n${room.description}\n\n${this.renderRoom(room, player)}`;
  }

  // ── ITEM INTERACTIONS ──

  takeItem(playerId: string, itemName: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const itemIndex = room.items.findIndex(i =>
      i.name.toLowerCase().includes(itemName.toLowerCase())
    );
    if (itemIndex === -1) return `❌ You don't see "${itemName}" here.`;

    const item = room.items[itemIndex];
    if (!item.pickupable) return `❌ You can't pick up the ${item.name}.`;

    // Remove from room, add to inventory
    room.items.splice(itemIndex, 1);
    player.inventory.push({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      description: item.description,
      quantity: 1,
      usable: !!item.useEffect,
      equippable: false,
    });

    return `${item.emoji} You take the ${item.name}.`;
  }

  dropItem(playerId: string, itemName: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const invIndex = player.inventory.findIndex(i =>
      i.name.toLowerCase().includes(itemName.toLowerCase())
    );
    if (invIndex === -1) return `❌ You don't have "${itemName}".`;

    const item = player.inventory[invIndex];
    player.inventory.splice(invIndex, 1);

    room.items.push({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      description: item.description,
      pickupable: true,
    });

    return `${item.emoji} You drop the ${item.name}.`;
  }

  showInventory(playerId: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    if (player.inventory.length === 0) {
      return `${UI_EMOJI.inventory} Your pack is empty.`;
    }

    const lines = [`${UI_EMOJI.inventory} Inventory:`];
    for (const item of player.inventory) {
      const qty = item.quantity > 1 ? ` (×${item.quantity})` : '';
      const eq = item.equipped ? ' [equipped]' : '';
      lines.push(`  ${item.emoji} ${item.name}${qty}${eq}`);
    }
    return lines.join('\n');
  }

  // ── NPC INTERACTION ──

  talkToNPC(playerId: string, npcName: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const npc = room.npcs.find(n =>
      n.name.toLowerCase().includes(npcName.toLowerCase())
    );
    if (!npc) return `❌ You don't see "${npcName}" here.`;

    if (npc.hostile && npc.behavior === 'aggressive') {
      return `${npc.emoji} ${npc.name} snarls at you! They don't seem interested in talking.`;
    }

    // Return NPC description + dialogue prompt
    return `${npc.emoji} ${npc.name}\n${npc.description}\n\n${npc.dialogueTreeId ? '💬 (Dialogue available — type "talk" again to continue)' : '💬 They have nothing more to say.'}`;
  }

  // ── SEARCH ──

  searchRoom(playerId: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const found: string[] = [];

    // Reveal hidden exits
    for (const exit of room.exits) {
      if (exit.hidden && !player.flags[`found_exit_${exit.targetRoomId}`]) {
        player.flags[`found_exit_${exit.targetRoomId}`] = true;
        found.push(`🔍 You discover a hidden passage: ${exit.description}`);
      }
    }

    // Check for room-specific search results
    const searchChecks = room.checks.filter(c => c.successEffect === 'reveal_exit' || c.successEffect === 'give_item');
    if (searchChecks.length > 0) {
      found.push('🔍 There are things here worth examining more closely...');
    }

    if (found.length === 0) {
      return '🔍 You search the area but find nothing new.';
    }

    return found.join('\n');
  }

  // ── EXAMINE ──

  examine(playerId: string, target: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    // Check NPCs
    const npc = room.npcs.find(n => n.name.toLowerCase().includes(target.toLowerCase()));
    if (npc) return `${npc.emoji} ${npc.name}\n${npc.description}`;

    // Check room items
    const roomItem = room.items.find(i => i.name.toLowerCase().includes(target.toLowerCase()));
    if (roomItem) return `${roomItem.emoji} ${roomItem.name}\n${roomItem.description}`;

    // Check inventory
    const invItem = player.inventory.find(i => i.name.toLowerCase().includes(target.toLowerCase()));
    if (invItem) return `${invItem.emoji} ${invItem.name}\n${invItem.description}`;

    return `❌ You don't see "${target}" here.`;
  }

  // ── GLOBAL FLAGS ──

  setFlag(key: string, value: boolean | number | string): void {
    this.state.globalFlags[key] = value;
  }

  getFlag(key: string): boolean | number | string | undefined {
    return this.state.globalFlags[key];
  }

  // ── BROADCAST ──

  broadcast(roomId: string, message: string, excludePlayerId?: string): void {
    for (const player of this.getPlayersInRoom(roomId)) {
      if (player.id !== excludePlayerId) {
        this.state.messageLog.push(`[${player.id}] ${message}`);
      }
    }
  }

  // ── MINIMAP ──

  renderMinimap(playerId: string): string {
    const player = this.getPlayer(playerId);
    if (!player) return '❌ Player not found.';

    const room = this.getRoom(player.currentRoomId);
    if (!room) return '❌ Room not found.';

    const lines: string[] = [];
    lines.push('🗺️  MINIMAP');
    lines.push('─'.repeat(30));
    lines.push(`📍 You are in: ${room.name} [${room.id}]`);
    lines.push(`   Level ${room.level} — Act ${room.act}`);
    lines.push('');
    lines.push('   Exits:');
    for (const exit of room.exits) {
      if (exit.hidden && !player.flags[`found_exit_${exit.targetRoomId}`]) continue;
      const targetRoom = this.getRoom(exit.targetRoomId);
      const visited = player.visitedRooms.has(exit.targetRoomId) ? '✓' : '?';
      const locked = exit.locked ? ' 🔒' : '';
      lines.push(`   ${ENV_EMOJI[exit.direction as keyof typeof ENV_EMOJI] || '🚪'} ${exit.direction} → ${targetRoom?.name || '???'} [${visited}]${locked}`);
    }
    lines.push('');
    lines.push(`   Rooms explored: ${player.visitedRooms.size}/${this.state.rooms.size}`);

    return lines.join('\n');
  }
}
