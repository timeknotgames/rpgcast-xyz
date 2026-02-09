// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Database Schema (Drizzle ORM / Neon)
// Adapted from qtx auth schema for MUD persistence
// Uses the same Neon PostgreSQL instance (sweet-heart-33815315)
// ═══════════════════════════════════════════════════════════════

import { pgTable, pgSchema, text, serial, integer, boolean, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

// Use a dedicated schema to avoid collisions with rpgcast-xyz tables
export const mud = pgSchema('crying_depths');

// ── USERS ──
// Auth: username/password, itch.io OAuth, Solana wallet
export const mudUsers = mud.table('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  password: text('password'), // nullable for OAuth/wallet users
  email: text('email').unique(),
  avatarEmoji: text('avatar_emoji').default('🧙'),

  // Auth sources (same as qtx)
  authSource: text('auth_source').default('local').notNull(), // 'local', 'itch.io', 'solana'
  itchUserId: text('itch_user_id').unique(),
  itchUsername: text('itch_username'),
  solanaWallet: text('solana_wallet_address').unique(),

  // MUD-specific
  isAdmin: boolean('is_admin').default(false).notNull(),
  isGM: boolean('is_gm').default(false).notNull(),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── CHARACTERS ──
// Each user can have multiple characters across different game systems
export const mudCharacters = mud.table('characters', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => mudUsers.id).notNull(),
  name: text('name').notNull(),
  emoji: text('emoji').default('🧙').notNull(),
  activeSystem: text('active_system').default('dice-godz').notNull(), // 'dice-godz', 'pathfinder', 'mm3e'
  isPublic: boolean('is_public').default(false).notNull(), // Public listing toggle

  // Position & progress
  currentRoomId: text('current_room_id').default('R01').notNull(),
  visitedRooms: jsonb('visited_rooms').default('["R01"]').notNull(), // JSON array of room IDs
  karma: integer('karma').default(50).notNull(),
  flags: jsonb('flags').default('{}').notNull(), // Game state flags

  // Inventory (JSON array of item objects)
  inventory: jsonb('inventory').default('[]').notNull(),

  // Dice Godz sheet (nullable — only if using that system)
  diceGodzSheet: jsonb('dice_godz_sheet'), // Full DiceGodzCharacterSheet as JSON

  // Pathfinder sheet (nullable)
  pathfinderSheet: jsonb('pathfinder_sheet'), // Full PathfinderCharacterSheet as JSON

  // M&M 3e sheet (nullable)
  mm3eSheet: jsonb('mm3e_sheet'), // Full MM3eCharacterSheet as JSON

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastPlayed: timestamp('last_played'),
});

// ── SESSIONS ──
// Active login sessions (PostgreSQL-backed, same pattern as qtx PgStore)
export const mudSessions = mud.table('sessions', {
  sid: text('sid').primaryKey(),
  userId: integer('user_id').references(() => mudUsers.id).notNull(),
  characterId: integer('character_id').references(() => mudCharacters.id),
  transport: text('transport').notNull(), // 'telnet', 'websocket'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
});

// ── LEADERBOARDS ──
export const mudLeaderboards = mud.table('leaderboards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => mudUsers.id).notNull(),
  characterId: integer('character_id').references(() => mudCharacters.id).notNull(),
  characterName: text('character_name').notNull(),
  gameSystem: text('game_system').notNull(),

  // Stats
  roomsExplored: integer('rooms_explored').default(0).notNull(),
  monstersDefeated: integer('monsters_defeated').default(0).notNull(),
  questsCompleted: integer('quests_completed').default(0).notNull(),
  highestKarma: integer('highest_karma').default(50).notNull(),
  totalPlayTime: integer('total_play_time').default(0).notNull(), // seconds
  deaths: integer('deaths').default(0).notNull(),

  // Dice Godz specific
  gweCompleted: integer('gwe_completed').default(0).notNull(),
  highestAttainment: real('highest_attainment').default(0).notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── GM CUSTOM ITEMS ──
// Items created by GMs/admins
export const mudCustomItems = mud.table('custom_items', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => mudUsers.id).notNull(),
  itemId: text('item_id').notNull().unique(), // Unique string ID for game reference
  name: text('name').notNull(),
  emoji: text('emoji').default('📦').notNull(),
  description: text('description').notNull(),
  pickupable: boolean('pickupable').default(true).notNull(),
  useEffect: text('use_effect'), // Effect when used
  checkElement: text('check_element'), // Element for pickup check
  checkAttainment: integer('check_attainment'), // Required attainment %
  stats: jsonb('stats').default('{}').notNull(), // Arbitrary stat bonuses
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── GM CUSTOM CLASSES ──
// Custom class definitions by GMs
export const mudCustomClasses = mud.table('custom_classes', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => mudUsers.id).notNull(),
  classId: text('class_id').notNull().unique(),
  name: text('name').notNull(),
  gameSystem: text('game_system').notNull(), // Which system this class is for
  description: text('description').notNull(),
  baseStats: jsonb('base_stats').notNull(), // System-specific base stats
  abilities: jsonb('abilities').default('[]').notNull(), // Array of abilities
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── CUSTOM SPECIES ──
// Gemstone species with Kala affinities, cross-system support
export const mudCustomSpecies = mud.table('custom_species', {
  id: serial('id').primaryKey(),
  createdBy: integer('created_by').references(() => mudUsers.id).notNull(),
  speciesId: text('species_id').notNull().unique(),
  name: text('name').notNull(),
  emoji: text('emoji').default('💎').notNull(),
  petal: text('petal').notNull(), // TEK8 element (Fire, Earth, Air, etc.)
  hexagramNumber: integer('hexagram_number').default(0).notNull(),
  description: text('description').notNull(),
  kalaAffinity: integer('kala_affinity').default(1).notNull(), // 1-64
  vidyaAffinity: integer('vidya_affinity'), // 1-14 (optional)
  abilityBonus: jsonb('ability_bonus').default('{}').notNull(),
  isBoundary: boolean('is_boundary').default(false).notNull(),
  // Cross-system support
  pf1eRaceTraits: jsonb('pf1e_race_traits').default('[]').notNull(),
  mm3eTemplate: text('mm3e_template'),
  customSkills: jsonb('custom_skills').default('[]').notNull(), // Array of custom skill slot assignments
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Type exports ──
export type MudUser = typeof mudUsers.$inferSelect;
export type MudCharacter = typeof mudCharacters.$inferSelect;
export type MudSession = typeof mudSessions.$inferSelect;
export type MudLeaderboardEntry = typeof mudLeaderboards.$inferSelect;
export type MudCustomItem = typeof mudCustomItems.$inferSelect;
export type MudCustomClass = typeof mudCustomClasses.$inferSelect;
export type MudCustomSpecies = typeof mudCustomSpecies.$inferSelect;
