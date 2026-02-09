// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — WebSocket Server
// Browser-based MUD client interface for rpgcast.xyz
// ═══════════════════════════════════════════════════════════════

import { WebSocketServer, type WebSocket } from 'ws';
import { GameLoop } from '../engine/game-loop.js';
import {
  createSession, removeSession, touchSession,
  broadcastToRoom, WELCOME_BANNER, saveSessionCharacter, type Session,
} from './session.js';
import type { GameSystem } from '../engine/types.js';
import { registerUser, loginUser, walletLogin, loadCharacters, createCharacter, validateSession } from '../auth/auth-handler.js';
import { isPersistenceEnabled } from '../auth/db.js';

interface WSMessage {
  type: 'connect' | 'command' | 'ping' | 'register' | 'login' | 'wallet_login' | 'resume';
  name?: string;
  system?: GameSystem;
  campaign?: 'crying-depths' | 'fugitive-seas';
  createCharacter?: boolean;
  input?: string;
  username?: string;
  password?: string;
  walletAddress?: string;
  signature?: number[];
  signMessage?: string;
  sessionToken?: string;
  characterId?: number;
}

interface WSResponse {
  type: 'welcome' | 'output' | 'error' | 'room_update' | 'pong' | 'system_info' | 'auth' | 'characters';
  message?: string;
  data?: Record<string, unknown>;
}

export function createWebSocketServer(gameLoop: GameLoop, port: number = 4001): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    let session: Session | null = null;

    const sendJSON = (response: WSResponse) => {
      try {
        ws.send(JSON.stringify(response));
      } catch (_) {
        // Client may be disconnected
      }
    };

    const send = (message: string) => {
      sendJSON({ type: 'output', message });
    };

    // Send welcome
    sendJSON({
      type: 'welcome',
      message: WELCOME_BANNER,
      data: {
        systems: ['dice-godz', 'pathfinder', 'mm3e'],
        campaigns: ['crying-depths', 'fugitive-seas'],
        version: '1.0.0',
      },
    });

    ws.on('message', async (raw) => {
      let msg: WSMessage;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        sendJSON({ type: 'error', message: 'Invalid message format. Send JSON.' });
        return;
      }

      switch (msg.type) {
        case 'ping':
          sendJSON({ type: 'pong' });
          break;

        // ── AUTH: REGISTER ──
        case 'register': {
          if (!isPersistenceEnabled()) {
            sendJSON({ type: 'error', message: 'Registration unavailable (no database). Connect as guest.' });
            break;
          }
          if (!msg.username || !msg.password) {
            sendJSON({ type: 'error', message: 'Username and password required.' });
            break;
          }
          const regResult = await registerUser(msg.username, msg.password);
          sendJSON({
            type: 'auth',
            message: regResult.message,
            data: {
              success: regResult.success,
              sessionToken: regResult.sessionToken,
              userId: regResult.user?.id,
              username: regResult.user?.username,
            },
          });
          if (regResult.success && regResult.user) {
            (ws as any).__authUser = regResult.user;
            (ws as any).__authToken = regResult.sessionToken;
          }
          break;
        }

        // ── AUTH: LOGIN ──
        case 'login': {
          if (!isPersistenceEnabled()) {
            sendJSON({ type: 'error', message: 'Login unavailable (no database). Connect as guest.' });
            break;
          }
          if (!msg.username || !msg.password) {
            sendJSON({ type: 'error', message: 'Username and password required.' });
            break;
          }
          const loginResult = await loginUser(msg.username, msg.password);
          if (loginResult.success && loginResult.user) {
            (ws as any).__authUser = loginResult.user;
            (ws as any).__authToken = loginResult.sessionToken;
            // Load characters
            const { characters } = await loadCharacters(loginResult.user.id);
            sendJSON({
              type: 'auth',
              message: loginResult.message,
              data: {
                success: true,
                sessionToken: loginResult.sessionToken,
                userId: loginResult.user.id,
                username: loginResult.user.username,
                characters: characters.map(c => ({
                  id: c.id, name: c.name, emoji: c.emoji,
                  system: c.activeSystem, karma: c.karma,
                })),
              },
            });
          } else {
            sendJSON({ type: 'auth', message: loginResult.message, data: { success: false } });
          }
          break;
        }

        // ── AUTH: WALLET LOGIN ──
        case 'wallet_login': {
          if (!isPersistenceEnabled() || !msg.walletAddress || !msg.signature || !msg.signMessage) {
            sendJSON({ type: 'error', message: 'Wallet login requires address, signature, and message.' });
            break;
          }
          const walletResult = await walletLogin(msg.walletAddress, msg.signature, msg.signMessage);
          if (walletResult.success && walletResult.user) {
            (ws as any).__authUser = walletResult.user;
            (ws as any).__authToken = walletResult.sessionToken;
            const { characters } = await loadCharacters(walletResult.user.id);
            sendJSON({
              type: 'auth',
              message: walletResult.message,
              data: {
                success: true,
                sessionToken: walletResult.sessionToken,
                characters: characters.map(c => ({
                  id: c.id, name: c.name, emoji: c.emoji,
                  system: c.activeSystem, karma: c.karma,
                })),
              },
            });
          } else {
            sendJSON({ type: 'auth', message: walletResult.message, data: { success: false } });
          }
          break;
        }

        // ── AUTH: RESUME SESSION ──
        case 'resume': {
          if (!isPersistenceEnabled() || !msg.sessionToken) {
            sendJSON({ type: 'error', message: 'Session token required.' });
            break;
          }
          const user = await validateSession(msg.sessionToken);
          if (user) {
            (ws as any).__authUser = user;
            (ws as any).__authToken = msg.sessionToken;
            const { characters } = await loadCharacters(user.id);
            sendJSON({
              type: 'auth',
              message: `Welcome back, ${user.username}!`,
              data: {
                success: true,
                sessionToken: msg.sessionToken,
                userId: user.id,
                username: user.username,
                characters: characters.map(c => ({
                  id: c.id, name: c.name, emoji: c.emoji,
                  system: c.activeSystem, karma: c.karma,
                })),
              },
            });
          } else {
            sendJSON({ type: 'auth', message: 'Session expired. Please login again.', data: { success: false } });
          }
          break;
        }

        case 'connect': {
          if (session) {
            sendJSON({ type: 'error', message: 'Already connected. Disconnect first.' });
            break;
          }

          const rawName = (msg.name || '').slice(0, 30).replace(/[^\w\s'-]/g, '').trim();
          const name = (rawName.length >= 2 && /[a-zA-Z]/.test(rawName)) ? rawName : 'Adventurer';
          const system = msg.system || 'dice-godz';

          // Campaign → starting room
          const startRoom = msg.campaign === 'fugitive-seas' ? 'F01' : 'R01';
          const campaignLabel = msg.campaign === 'fugitive-seas' ? 'Fugitive Seas' : 'Siege of the Crying Depths';

          session = createSession(name, 'websocket', send, system, startRoom);

          // Wire auth if logged in
          const authUser = (ws as any).__authUser;
          const authToken = (ws as any).__authToken;
          if (authUser) {
            session.dbUser = authUser;
            session.sessionToken = authToken;
            // If characterId specified, load that character's state
            if (msg.characterId) {
              session.dbCharacterId = msg.characterId;
              const { characters } = await loadCharacters(authUser.id);
              const char = characters.find((c: any) => c.id === msg.characterId);
              if (char) {
                session.playerState.name = char.name;
                session.playerState.emoji = char.emoji;
                session.playerState.activeSystem = char.activeSystem as GameSystem;
                session.playerState.currentRoomId = char.currentRoomId;
                session.playerState.karma = char.karma;
                session.playerState.flags = char.flags as Record<string, any> || {};
                session.playerState.inventory = (char.inventory as any[]) || [];
                session.playerState.visitedRooms = new Set(char.visitedRooms as string[] || ['R01']);
                if (char.diceGodzSheet) session.playerState.diceGodzSheet = char.diceGodzSheet as any;
                if (char.pathfinderSheet) session.playerState.pathfinderSheet = char.pathfinderSheet as any;
                if (char.mm3eSheet) session.playerState.mm3eSheet = char.mm3eSheet as any;
              }
            } else if (!msg.characterId && authUser) {
              // Auto-create character for authenticated user if none specified
              const newChar = await createCharacter(authUser.id, name, system);
              if (newChar) session.dbCharacterId = newChar.id;
            }
          }

          gameLoop.world.addPlayer(session.playerState);

          // Optional character creation on connect
          let charMsg = '';
          if (msg.createCharacter && system === 'dice-godz') {
            const gweResult = gameLoop.processInput(session.id, 'roll gwe');
            charMsg = `\n\n${gweResult}`;
          } else if (!msg.createCharacter && system === 'dice-godz') {
            charMsg = '\n\nTip: Type "roll gwe" to create your Dice Godz character for the full experience.';
          }

          const lookMsg = gameLoop.world.lookRoom(session.id);

          sendJSON({
            type: 'output',
            message: `Welcome, ${name}! Playing ${system.toUpperCase()} in ${campaignLabel}.${charMsg}\n\n${lookMsg}`,
            data: {
              playerId: session.id,
              name,
              system,
              campaign: msg.campaign || 'crying-depths',
              roomId: session.playerState.currentRoomId,
              authenticated: !!session.dbUser,
              characterId: session.dbCharacterId,
              hasCharacterSheet: !!session.playerState.diceGodzSheet,
            },
          });

          broadcastToRoom(startRoom, `📢 ${name} has entered ${campaignLabel}.`, session.id);
          break;
        }

        case 'command': {
          if (!session) {
            sendJSON({ type: 'error', message: 'Not connected. Send {"type":"connect","name":"Your Name"} first.' });
            break;
          }

          const input = msg.input?.trim();
          if (!input) break;

          touchSession(session.id);

          if (input.toLowerCase() === 'quit') {
            const name = session.playerState.name;
            // Save before quit
            if (session.dbCharacterId) {
              await saveSessionCharacter(session).catch(() => {});
            }
            broadcastToRoom(
              session.playerState.currentRoomId,
              `📢 ${name} has left the Crying Depths.`,
              session.id
            );
            gameLoop.world.removePlayer(session.id);
            removeSession(session.id);
            sendJSON({ type: 'output', message: `Farewell, ${name}. Your progress has been saved.` });
            session = null;
            break;
          }

          const response = gameLoop.processInput(session.id, input);

          // Include room data for UI updates
          const player = session.playerState;
          const room = gameLoop.world.getRoom(player.currentRoomId);

          sendJSON({
            type: 'output',
            message: response,
            data: {
              roomId: player.currentRoomId,
              roomName: room?.name,
              roomEmoji: room?.emoji,
              hp: player.diceGodzSheet?.hp || player.pathfinderSheet?.hp,
              maxHp: player.diceGodzSheet?.maxHp || player.pathfinderSheet?.maxHp,
              karma: player.karma,
              system: player.activeSystem,
              inventoryCount: player.inventory.length,
              roomsVisited: player.visitedRooms.size,
            },
          });
          break;
        }
      }
    });

    ws.on('close', async () => {
      if (session) {
        // Save character state before removing
        if (session.dbCharacterId) {
          await saveSessionCharacter(session).catch(() => {});
        }
        broadcastToRoom(
          session.playerState.currentRoomId,
          `📢 ${session.playerState.name} has disconnected.`,
          session.id
        );
        gameLoop.world.removePlayer(session.id);
        removeSession(session.id);
      }
    });

    ws.on('error', (err) => {
      console.error(`[WS] Socket error: ${err.message}`);
    });
  });

  console.log(`🌐 WebSocket MUD server listening on port ${port}`);
  console.log(`   Connect from browser or use: wscat -c ws://localhost:${port}`);

  return wss;
}
