/**
 * RPGCast.xyz Platform Configuration
 */

export const PLATFORM = {
  name: 'RPGCast',
  version: '1.0.0',
  description: 'Curated pump.fun gateway for Quillverse tokens',

  // Partner info
  partners: [
    {
      id: '7abcs',
      name: '7abcs.com',
      url: 'https://7abcs.com',
      logo: 'https://i.imgur.com/y4EcwJ4.png',
      color: '#10b981',
    },
    {
      id: 'timeknot',
      name: 'TimeKnot Games',
      url: 'https://timeknot.com',
      logo: 'https://i.imgur.com/5g135Tj.png',
      color: '#8b5cf6',
    },
    {
      id: 'paladin',
      name: 'The Paladin Initiative',
      url: 'https://paladinking.com',
      logo: 'https://i.imgur.com/t8DT0wZ.png',
      color: '#f59e0b',
    },
  ],

  // Ecosystem links
  ecosystem: {
    quillverse: 'https://quillverse.org',
    '8xm': 'https://8xm.fun',
    quilu: 'https://quilu.xyz',
  },

  // External links
  links: {
    pumpfun: 'https://pump.fun',
    pumpfunCreate: 'https://pump.fun/create',
    solscan: 'https://solscan.io',
  },

  // Admin wallets (can verify tokens)
  admin: {
    getWallets: (): string[] => {
      const adminEnv = import.meta.env.ADMIN_WALLETS ||
                       (typeof process !== 'undefined' && process.env?.ADMIN_WALLETS) || '';
      return adminEnv.split(',').filter((w: string) => w.trim().length > 0);
    },
  },
};

// Game roles for tokens
export const GAME_ROLES = [
  { id: 'nation', name: 'Nation Token', description: 'Token for a Quillverse nation' },
  { id: 'champion', name: 'Champion Token', description: 'Token for a Champion player' },
  { id: 'garu', name: 'Garu Token', description: 'Token for a Garu companion creature' },
  { id: 'general', name: 'General Token', description: 'General ecosystem token' },
] as const;

export type GameRole = typeof GAME_ROLES[number]['id'];

// Verification statuses
export const VERIFICATION_STATUSES = {
  pending: { label: 'Unverified', color: 'yellow' },
  verified: { label: 'Verified', color: 'green' },
  flagged: { label: 'Flagged', color: 'red' },
} as const;

export type VerificationStatus = keyof typeof VERIFICATION_STATUSES;
