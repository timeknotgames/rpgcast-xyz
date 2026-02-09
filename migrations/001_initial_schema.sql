-- RPGCast.xyz Database Schema
-- Run this against the shared Neon database (same as 8xm.fun)

-- Registered tokens (pump.fun tokens with game metadata)
CREATE TABLE IF NOT EXISTS registered_tokens (
  id SERIAL PRIMARY KEY,
  mint_address VARCHAR(64) NOT NULL UNIQUE,
  creator_wallet VARCHAR(64) NOT NULL,

  -- Game metadata (rpgcast.xyz specific)
  tek8_guild VARCHAR(8),           -- D2, D4, D6, D8, D10, D12, D20, D100
  rainbow_road VARCHAR(16),        -- D12OUT, D8UP, etc.
  game_role VARCHAR(32),           -- nation, champion, garu, general
  nation_name VARCHAR(128),

  -- Verification
  verification_status VARCHAR(32) DEFAULT 'pending',  -- pending, verified, flagged
  verified_by VARCHAR(64),
  verified_at TIMESTAMP,

  -- pump.fun data (cached)
  name VARCHAR(64),
  symbol VARCHAR(16),
  image_url TEXT,
  description TEXT,
  bonding_curve_complete BOOLEAN DEFAULT FALSE,

  -- Timestamps
  registered_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);

-- Champions (players who host game sessions)
CREATE TABLE IF NOT EXISTS champions (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(64) NOT NULL UNIQUE,
  display_name VARCHAR(64) NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  primary_guild VARCHAR(8),        -- TEK8 guild

  -- Social links
  discord_handle VARCHAR(64),
  twitter_handle VARCHAR(64),
  twitch_handle VARCHAR(64),

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Champion's associated tokens
CREATE TABLE IF NOT EXISTS champion_tokens (
  id SERIAL PRIMARY KEY,
  champion_id INTEGER REFERENCES champions(id),
  token_id INTEGER REFERENCES registered_tokens(id),
  relationship VARCHAR(32),        -- creator, supporter, featured
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(champion_id, token_id)
);

-- Game sessions promoted by champions
CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  champion_id INTEGER REFERENCES champions(id),

  -- Session details
  title VARCHAR(128) NOT NULL,
  description TEXT,
  session_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,

  -- Platform
  platform VARCHAR(32),            -- discord, twitch, youtube, in_person
  join_link TEXT,

  -- Featured tokens
  featured_token_ids INTEGER[],

  -- Status
  status VARCHAR(32) DEFAULT 'scheduled',  -- scheduled, live, completed, cancelled

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_registered_tokens_guild ON registered_tokens(tek8_guild);
CREATE INDEX IF NOT EXISTS idx_registered_tokens_road ON registered_tokens(rainbow_road);
CREATE INDEX IF NOT EXISTS idx_registered_tokens_status ON registered_tokens(verification_status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_date ON game_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_game_sessions_champion ON game_sessions(champion_id);
CREATE INDEX IF NOT EXISTS idx_champions_wallet ON champions(wallet_address);
