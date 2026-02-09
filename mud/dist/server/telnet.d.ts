import * as net from 'node:net';
import { GameLoop } from '../engine/game-loop.js';
export declare function createTelnetServer(gameLoop: GameLoop, port?: number): net.Server;
