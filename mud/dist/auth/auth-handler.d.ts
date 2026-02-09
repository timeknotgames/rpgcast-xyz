import type { MudUser, MudCharacter } from './schema.js';
export interface AuthResult {
    success: boolean;
    message: string;
    user?: MudUser;
    sessionToken?: string;
}
export interface CharacterLoadResult {
    success: boolean;
    characters: MudCharacter[];
}
export declare function registerUser(username: string, password: string, authSource?: 'local' | 'itch.io' | 'solana'): Promise<AuthResult>;
export declare function loginUser(username: string, password: string): Promise<AuthResult>;
export declare function walletLogin(walletAddress: string, signature: number[], message: string): Promise<AuthResult>;
export declare function linkWallet(userId: number, walletAddress: string): Promise<AuthResult>;
export declare function validateSession(token: string): Promise<MudUser | null>;
export declare function loadCharacters(userId: number): Promise<CharacterLoadResult>;
export declare function createCharacter(userId: number, name: string, system: string, emoji?: string): Promise<MudCharacter | null>;
export declare function saveCharacter(characterId: number, data: Partial<{
    currentRoomId: string;
    visitedRooms: string[];
    karma: number;
    flags: Record<string, unknown>;
    inventory: unknown[];
    diceGodzSheet: unknown;
    pathfinderSheet: unknown;
    mm3eSheet: unknown;
    activeSystem: string;
}>): Promise<void>;
export declare function setCharacterPublic(characterId: number, isPublic: boolean): Promise<void>;
export declare function getPublicCharacters(): Promise<MudCharacter[]>;
export declare function isUserAdmin(userId: number): Promise<boolean>;
export declare function isUserGM(userId: number): Promise<boolean>;
