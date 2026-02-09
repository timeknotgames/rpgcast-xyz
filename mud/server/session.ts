// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Session Manager
// Manages player connections (telnet + WebSocket), creates PlayerState
// ═══════════════════════════════════════════════════════════════

import type { PlayerState, GameSystem } from '../engine/types.js';
import { CHAR_EMOJI } from '../data/emoji.js';
import { saveCharacter } from '../auth/auth-handler.js';
import type { MudUser, MudCharacter } from '../auth/schema.js';

let sessionCounter = 0;

export interface Session {
  id: string;
  playerState: PlayerState;
  transport: 'telnet' | 'websocket';
  connectedAt: Date;
  lastActivity: Date;
  send: (message: string) => void;
  // Auth state (null = anonymous/guest)
  dbUser: MudUser | null;
  dbCharacterId: number | null;
  sessionToken: string | null;
}

const sessions = new Map<string, Session>();

/** Create a new player session */
export function createSession(
  name: string,
  transport: 'telnet' | 'websocket',
  send: (message: string) => void,
  system: GameSystem = 'dice-godz',
  startRoomId: string = 'R01'
): Session {
  sessionCounter++;
  const id = `player_${sessionCounter}_${Date.now()}`;

  const playerState: PlayerState = {
    id,
    name: name || `Adventurer_${sessionCounter}`,
    emoji: CHAR_EMOJI.player,
    currentRoomId: startRoomId,
    activeSystem: system,
    inventory: [],
    karma: 50,
    visitedRooms: new Set([startRoomId]),
    flags: {},
  };

  const session: Session = {
    id,
    playerState,
    transport,
    connectedAt: new Date(),
    lastActivity: new Date(),
    send,
    dbUser: null,
    dbCharacterId: null,
    sessionToken: null,
  };

  sessions.set(id, session);
  return session;
}

/** Remove a session */
export function removeSession(id: string): void {
  sessions.delete(id);
}

/** Get all active sessions */
export function getAllSessions(): Session[] {
  return Array.from(sessions.values());
}

/** Get session by ID */
export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

/** Update last activity timestamp */
export function touchSession(id: string): void {
  const session = sessions.get(id);
  if (session) session.lastActivity = new Date();
}

/** Broadcast a message to all sessions in a room */
export function broadcastToRoom(roomId: string, message: string, excludeId?: string): void {
  for (const session of sessions.values()) {
    if (session.playerState.currentRoomId === roomId && session.id !== excludeId) {
      session.send(message);
    }
  }
}

/** Broadcast to ALL connected sessions */
export function broadcastGlobal(message: string): void {
  for (const session of sessions.values()) {
    session.send(message);
  }
}

/** Session count */
export function sessionCount(): number {
  return sessions.size;
}

/** Save a session's character state to database */
export async function saveSessionCharacter(session: Session): Promise<void> {
  if (!session.dbCharacterId) return;
  const p = session.playerState;
  await saveCharacter(session.dbCharacterId, {
    currentRoomId: p.currentRoomId,
    visitedRooms: Array.from(p.visitedRooms),
    karma: p.karma,
    flags: p.flags,
    inventory: p.inventory,
    diceGodzSheet: p.diceGodzSheet,
    pathfinderSheet: p.pathfinderSheet,
    mm3eSheet: p.mm3eSheet,
    activeSystem: p.activeSystem,
  });
}

/** Find session by username (for whisper by account name) */
export function findSessionByUsername(username: string): Session | undefined {
  for (const session of sessions.values()) {
    if (session.dbUser?.username.toLowerCase() === username.toLowerCase()) {
      return session;
    }
  }
  return undefined;
}

// ── WELCOME BANNER ──
export const WELCOME_BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ⚔️  THE CRYING DEPTHS MUD  ⚔️                               ║
║   ───────────────────────────                                 ║
║   A Quillverse Adventure                                      ║
║                                                               ║
║   Two campaigns await:                                        ║
║     🏔️  Siege of the Crying Depths — dungeon crawl             ║
║     🏴‍☠️  Fugitive Seas — pirate democracy on the open ocean    ║
║                                                               ║
║   Three game systems:                                         ║
║     🎲 Dice Godz (TEK8 attainment)                            ║
║     📜 Pathfinder 1e (d20 + modifiers)                         ║
║     🦸 Mutants & Masterminds 3e (power levels)                 ║
║                                                               ║
║   Type "help" for commands                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;
