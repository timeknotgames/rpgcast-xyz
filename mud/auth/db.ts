// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Database Connection (Neon PostgreSQL)
// Same instance as rpgcast-xyz (sweet-heart-33815315)
// Uses 'crying_depths' schema to avoid table collisions
// ═══════════════════════════════════════════════════════════════

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema.js';

// Neon requires WebSocket for serverless driver
neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn(
    '⚠️  DATABASE_URL not set — auth/persistence disabled.\n' +
    '   Set DATABASE_URL to enable character saves, leaderboards, and auth.\n' +
    '   The MUD will still run in anonymous/ephemeral mode.'
  );
}

export const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;
export const db = pool ? drizzle({ client: pool, schema }) : null;

/** Check if persistence is available */
export function isPersistenceEnabled(): boolean {
  return db !== null;
}

/** Initialize the crying_depths schema (run on first startup) */
export async function initializeSchema(): Promise<void> {
  if (!pool) return;

  try {
    // Create schema if not exists
    await pool.query('CREATE SCHEMA IF NOT EXISTS crying_depths');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT,
        password TEXT,
        email TEXT UNIQUE,
        avatar_emoji TEXT DEFAULT '🧙',
        auth_source TEXT NOT NULL DEFAULT 'local',
        itch_user_id TEXT UNIQUE,
        itch_username TEXT,
        solana_wallet_address TEXT UNIQUE,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        is_gm BOOLEAN NOT NULL DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create characters table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.characters (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES crying_depths.users(id),
        name TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '🧙',
        active_system TEXT NOT NULL DEFAULT 'dice-godz',
        is_public BOOLEAN NOT NULL DEFAULT false,
        current_room_id TEXT NOT NULL DEFAULT 'R01',
        visited_rooms JSONB NOT NULL DEFAULT '["R01"]',
        karma INTEGER NOT NULL DEFAULT 50,
        flags JSONB NOT NULL DEFAULT '{}',
        inventory JSONB NOT NULL DEFAULT '[]',
        dice_godz_sheet JSONB,
        pathfinder_sheet JSONB,
        mm3e_sheet JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_played TIMESTAMP
      )
    `);

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.sessions (
        sid TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES crying_depths.users(id),
        character_id INTEGER REFERENCES crying_depths.characters(id),
        transport TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        last_activity TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create leaderboards table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.leaderboards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES crying_depths.users(id),
        character_id INTEGER NOT NULL REFERENCES crying_depths.characters(id),
        character_name TEXT NOT NULL,
        game_system TEXT NOT NULL,
        rooms_explored INTEGER NOT NULL DEFAULT 0,
        monsters_defeated INTEGER NOT NULL DEFAULT 0,
        quests_completed INTEGER NOT NULL DEFAULT 0,
        highest_karma INTEGER NOT NULL DEFAULT 50,
        total_play_time INTEGER NOT NULL DEFAULT 0,
        deaths INTEGER NOT NULL DEFAULT 0,
        gwe_completed INTEGER NOT NULL DEFAULT 0,
        highest_attainment REAL NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create custom_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.custom_items (
        id SERIAL PRIMARY KEY,
        created_by INTEGER NOT NULL REFERENCES crying_depths.users(id),
        item_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '📦',
        description TEXT NOT NULL,
        pickupable BOOLEAN NOT NULL DEFAULT true,
        use_effect TEXT,
        check_element TEXT,
        check_attainment INTEGER,
        stats JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create custom_classes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.custom_classes (
        id SERIAL PRIMARY KEY,
        created_by INTEGER NOT NULL REFERENCES crying_depths.users(id),
        class_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        game_system TEXT NOT NULL,
        description TEXT NOT NULL,
        base_stats JSONB NOT NULL,
        abilities JSONB NOT NULL DEFAULT '[]',
        is_published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create custom_species table (extends custom_classes for species-specific data)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crying_depths.custom_species (
        id SERIAL PRIMARY KEY,
        created_by INTEGER NOT NULL REFERENCES crying_depths.users(id),
        species_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL DEFAULT '💎',
        petal TEXT NOT NULL,
        hexagram_number INTEGER NOT NULL DEFAULT 0,
        description TEXT NOT NULL,
        kala_affinity INTEGER NOT NULL DEFAULT 1,
        vidya_affinity INTEGER,
        ability_bonus JSONB NOT NULL DEFAULT '{}',
        is_boundary BOOLEAN NOT NULL DEFAULT false,
        pf1e_race_traits JSONB NOT NULL DEFAULT '[]',
        mm3e_template TEXT,
        custom_skills JSONB NOT NULL DEFAULT '[]',
        is_published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log('✅ Database schema initialized (crying_depths)');
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err);
  }
}
