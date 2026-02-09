// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Auth Handler
// Login, register, wallet auth for telnet & WebSocket
// Adapted from qtx auth system (same Neon DB, same patterns)
// ═══════════════════════════════════════════════════════════════
import { eq } from 'drizzle-orm';
import { SecureAuth } from './crypto.js';
import { db } from './db.js';
import { mudUsers, mudCharacters, mudSessions } from './schema.js';
// ── REGISTER ──
export async function registerUser(username, password, authSource = 'local') {
    if (!db)
        return { success: false, message: 'Persistence not available. Play as guest.' };
    // Validate
    const cleanName = username.trim().slice(0, 30).replace(/[^\w\s'-]/g, '');
    if (cleanName.length < 2)
        return { success: false, message: 'Username must be at least 2 characters.' };
    if (password.length < 4)
        return { success: false, message: 'Password must be at least 4 characters.' };
    // Check existing
    const existing = await db.select().from(mudUsers).where(eq(mudUsers.username, cleanName));
    if (existing.length > 0)
        return { success: false, message: `Username "${cleanName}" is already taken.` };
    // Hash password & create user
    const hashedPassword = await SecureAuth.hashPassword(password);
    const [newUser] = await db.insert(mudUsers).values({
        username: cleanName,
        password: hashedPassword,
        authSource,
    }).returning();
    // Create session token
    const token = SecureAuth.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db.insert(mudSessions).values({
        sid: token,
        userId: newUser.id,
        transport: 'unknown',
        expiresAt,
    });
    return { success: true, message: `Account created! Welcome, ${cleanName}.`, user: newUser, sessionToken: token };
}
// ── LOGIN ──
export async function loginUser(username, password) {
    if (!db)
        return { success: false, message: 'Persistence not available. Play as guest.' };
    const users = await db.select().from(mudUsers).where(eq(mudUsers.username, username.trim()));
    if (users.length === 0)
        return { success: false, message: 'Unknown username. Type "register" to create an account.' };
    const user = users[0];
    if (!user.password)
        return { success: false, message: 'This account uses OAuth/wallet login. Try itch.io or wallet auth.' };
    const valid = await SecureAuth.verifyPassword(password, user.password);
    if (!valid)
        return { success: false, message: 'Invalid password.' };
    // Update last login
    await db.update(mudUsers).set({ lastLogin: new Date() }).where(eq(mudUsers.id, user.id));
    // Create session
    const token = SecureAuth.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(mudSessions).values({
        sid: token,
        userId: user.id,
        transport: 'unknown',
        expiresAt,
    });
    return { success: true, message: `Welcome back, ${user.username}!`, user, sessionToken: token };
}
// ── WALLET LOGIN ──
export async function walletLogin(walletAddress, signature, message) {
    if (!db)
        return { success: false, message: 'Persistence not available.' };
    // Validate wallet format (Solana base58)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
        return { success: false, message: 'Invalid Solana wallet address.' };
    }
    // Basic signature check (length and format)
    if (!Array.isArray(signature) || signature.length === 0 || signature.some(b => typeof b !== 'number' || b < 0 || b > 255)) {
        return { success: false, message: 'Invalid signature.' };
    }
    // Find user by wallet
    const users = await db.select().from(mudUsers).where(eq(mudUsers.solanaWallet, walletAddress));
    if (users.length === 0) {
        return { success: false, message: 'No account linked to this wallet. Register first or link your wallet.' };
    }
    const user = users[0];
    await db.update(mudUsers).set({ lastLogin: new Date() }).where(eq(mudUsers.id, user.id));
    const token = SecureAuth.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(mudSessions).values({
        sid: token,
        userId: user.id,
        transport: 'unknown',
        expiresAt,
    });
    return { success: true, message: `Wallet login successful. Welcome, ${user.username}!`, user, sessionToken: token };
}
// ── LINK WALLET TO EXISTING ACCOUNT ──
export async function linkWallet(userId, walletAddress) {
    if (!db)
        return { success: false, message: 'Persistence not available.' };
    await db.update(mudUsers).set({
        solanaWallet: walletAddress,
    }).where(eq(mudUsers.id, userId));
    return { success: true, message: `Wallet ${walletAddress.slice(0, 8)}... linked to your account.` };
}
// ── SESSION VALIDATION ──
export async function validateSession(token) {
    if (!db)
        return null;
    const sessions = await db.select().from(mudSessions).where(eq(mudSessions.sid, token));
    if (sessions.length === 0)
        return null;
    const session = sessions[0];
    if (new Date() > session.expiresAt) {
        // Expired — clean up
        await db.delete(mudSessions).where(eq(mudSessions.sid, token));
        return null;
    }
    // Touch session
    await db.update(mudSessions).set({ lastActivity: new Date() }).where(eq(mudSessions.sid, token));
    // Get user
    const users = await db.select().from(mudUsers).where(eq(mudUsers.id, session.userId));
    return users.length > 0 ? users[0] : null;
}
// ── CHARACTER OPERATIONS ──
export async function loadCharacters(userId) {
    if (!db)
        return { success: false, characters: [] };
    const chars = await db.select().from(mudCharacters).where(eq(mudCharacters.userId, userId));
    return { success: true, characters: chars };
}
export async function createCharacter(userId, name, system, emoji = '🧙') {
    if (!db)
        return null;
    const [char] = await db.insert(mudCharacters).values({
        userId,
        name: name.slice(0, 30),
        emoji,
        activeSystem: system,
    }).returning();
    return char;
}
export async function saveCharacter(characterId, data) {
    if (!db)
        return;
    await db.update(mudCharacters).set({
        ...data,
        updatedAt: new Date(),
        lastPlayed: new Date(),
    }).where(eq(mudCharacters.id, characterId));
}
export async function setCharacterPublic(characterId, isPublic) {
    if (!db)
        return;
    await db.update(mudCharacters).set({ isPublic }).where(eq(mudCharacters.id, characterId));
}
export async function getPublicCharacters() {
    if (!db)
        return [];
    return db.select().from(mudCharacters).where(eq(mudCharacters.isPublic, true));
}
// ── GM / ADMIN CHECKS ──
export async function isUserAdmin(userId) {
    if (!db)
        return false;
    const users = await db.select().from(mudUsers).where(eq(mudUsers.id, userId));
    return users.length > 0 && users[0].isAdmin;
}
export async function isUserGM(userId) {
    if (!db)
        return false;
    const users = await db.select().from(mudUsers).where(eq(mudUsers.id, userId));
    return users.length > 0 && (users[0].isGM || users[0].isAdmin);
}
//# sourceMappingURL=auth-handler.js.map