// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Secure Auth (adapted from qtx)
// PBKDF2 password hashing with salt, token generation
// ═══════════════════════════════════════════════════════════════

import crypto from 'crypto';

export class SecureAuth {
  private static readonly SALT_LENGTH = 32;
  private static readonly HASH_LENGTH = 64;
  private static readonly ITERATIONS = 100000;

  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(this.SALT_LENGTH);
    const hash = crypto.pbkdf2Sync(password, salt, this.ITERATIONS, this.HASH_LENGTH, 'sha512');
    const combined = Buffer.concat([
      Buffer.from(this.ITERATIONS.toString(16).padStart(8, '0'), 'hex'),
      salt,
      hash,
    ]);
    return combined.toString('base64');
  }

  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const combined = Buffer.from(storedHash, 'base64');
      const iterations = parseInt(combined.subarray(0, 4).toString('hex'), 16);
      const salt = combined.subarray(4, 4 + this.SALT_LENGTH);
      const hash = combined.subarray(4 + this.SALT_LENGTH);
      const testHash = crypto.pbkdf2Sync(password, salt, iterations, this.HASH_LENGTH, 'sha512');
      return crypto.timingSafeEqual(hash, testHash);
    } catch {
      return false;
    }
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }
}
