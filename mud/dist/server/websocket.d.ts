import { WebSocketServer } from 'ws';
import { GameLoop } from '../engine/game-loop.js';
export declare function createWebSocketServer(gameLoop: GameLoop, port?: number): WebSocketServer;
