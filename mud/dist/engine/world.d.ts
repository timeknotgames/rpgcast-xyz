import type { Room, PlayerState, GameState } from './types.js';
export declare class World {
    state: GameState;
    constructor(rooms: Room[]);
    getRoom(roomId: string): Room | undefined;
    getRoomList(): Room[];
    addPlayer(player: PlayerState): void;
    removePlayer(playerId: string): void;
    getPlayer(playerId: string): PlayerState | undefined;
    getPlayersInRoom(roomId: string): PlayerState[];
    movePlayer(playerId: string, direction: string): {
        success: boolean;
        message: string;
        newRoom?: Room;
    };
    renderRoom(room: Room, player: PlayerState): string;
    lookRoom(playerId: string): string;
    takeItem(playerId: string, itemName: string): string;
    dropItem(playerId: string, itemName: string): string;
    showInventory(playerId: string): string;
    talkToNPC(playerId: string, npcName: string): string;
    searchRoom(playerId: string): string;
    examine(playerId: string, target: string): string;
    setFlag(key: string, value: boolean | number | string): void;
    getFlag(key: string): boolean | number | string | undefined;
    broadcast(roomId: string, message: string, excludePlayerId?: string): void;
    renderMinimap(playerId: string): string;
}
