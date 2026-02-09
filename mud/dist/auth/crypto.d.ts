export declare class SecureAuth {
    private static readonly SALT_LENGTH;
    private static readonly HASH_LENGTH;
    private static readonly ITERATIONS;
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, storedHash: string): Promise<boolean>;
    static generateSessionToken(): string;
}
