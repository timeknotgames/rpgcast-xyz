import type { PlayerState, GameSystem } from '../engine/types.js';
import type { MudUser } from '../auth/schema.js';
export interface Session {
    id: string;
    playerState: PlayerState;
    transport: 'telnet' | 'websocket';
    connectedAt: Date;
    lastActivity: Date;
    send: (message: string) => void;
    dbUser: MudUser | null;
    dbCharacterId: number | null;
    sessionToken: string | null;
}
/** Create a new player session */
export declare function createSession(name: string, transport: 'telnet' | 'websocket', send: (message: string) => void, system?: GameSystem, startRoomId?: string): Session;
/** Remove a session */
export declare function removeSession(id: string): void;
/** Get all active sessions */
export declare function getAllSessions(): Session[];
/** Get session by ID */
export declare function getSession(id: string): Session | undefined;
/** Update last activity timestamp */
export declare function touchSession(id: string): void;
/** Broadcast a message to all sessions in a room */
export declare function broadcastToRoom(roomId: string, message: string, excludeId?: string): void;
/** Broadcast to ALL connected sessions */
export declare function broadcastGlobal(message: string): void;
/** Session count */
export declare function sessionCount(): number;
/** Save a session's character state to database */
export declare function saveSessionCharacter(session: Session): Promise<void>;
/** Find session by username (for whisper by account name) */
export declare function findSessionByUsername(username: string): Session | undefined;
export declare const WELCOME_BANNER = "\n\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n\u2551                                                               \u2551\n\u2551   \u2694\uFE0F  THE CRYING DEPTHS MUD  \u2694\uFE0F                               \u2551\n\u2551   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                                 \u2551\n\u2551   A Quillverse Adventure                                      \u2551\n\u2551                                                               \u2551\n\u2551   Two campaigns await:                                        \u2551\n\u2551     \uD83C\uDFD4\uFE0F  Siege of the Crying Depths \u2014 dungeon crawl             \u2551\n\u2551     \uD83C\uDFF4\u200D\u2620\uFE0F  Fugitive Seas \u2014 pirate democracy on the open ocean    \u2551\n\u2551                                                               \u2551\n\u2551   Three game systems:                                         \u2551\n\u2551     \uD83C\uDFB2 Dice Godz (TEK8 attainment)                            \u2551\n\u2551     \uD83D\uDCDC Pathfinder 1e (d20 + modifiers)                         \u2551\n\u2551     \uD83E\uDDB8 Mutants & Masterminds 3e (power levels)                 \u2551\n\u2551                                                               \u2551\n\u2551   Type \"help\" for commands                                    \u2551\n\u2551                                                               \u2551\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n";
