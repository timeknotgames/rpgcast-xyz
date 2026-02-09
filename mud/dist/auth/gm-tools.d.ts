export interface GMResult {
    success: boolean;
    message: string;
}
export declare function createCustomItem(userId: number, itemId: string, name: string, emoji: string, description: string, options?: {
    pickupable?: boolean;
    useEffect?: string;
    checkElement?: string;
    checkAttainment?: number;
    stats?: Record<string, unknown>;
}): Promise<GMResult>;
export declare function createCustomClass(userId: number, classId: string, name: string, gameSystem: string, description: string, baseStats: Record<string, unknown>, abilities?: unknown[]): Promise<GMResult>;
export declare function promoteToGM(adminId: number, targetUsername: string): Promise<GMResult>;
export declare function listCustomItems(): Promise<{
    items: Array<{
        itemId: string;
        name: string;
        emoji: string;
    }>;
}>;
export declare function getLeaderboard(limit?: number): Promise<string>;
export declare function parseGMCommand(userId: number, input: string): Promise<string>;
