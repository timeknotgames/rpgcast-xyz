-- RPGCast.xyz Phase 1: Gameplay Tables
-- Token holder positions, territory control, and token imports

-- Token holder positions (staking tokens to territories)
CREATE TABLE IF NOT EXISTS token_positions (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(64) NOT NULL,
  token_mint VARCHAR(64) NOT NULL,
  territory_id VARCHAR(16) NOT NULL,  -- Rainbow Road code (e.g., D12OUT)
  committed_at TIMESTAMP DEFAULT NOW(),
  influence_score INTEGER DEFAULT 1,
  UNIQUE(wallet_address, token_mint, territory_id)
);

-- Territory control state
CREATE TABLE IF NOT EXISTS territory_control (
  id SERIAL PRIMARY KEY,
  territory_id VARCHAR(16) NOT NULL UNIQUE,  -- D12OUT, D8UP, etc.
  controlling_token_mint VARCHAR(64),  -- Nation token that controls this
  control_strength INTEGER DEFAULT 0,
  contested BOOLEAN DEFAULT FALSE,
  last_changed TIMESTAMP DEFAULT NOW()
);

-- Imported tokens (non-pump.fun Solana tokens)
CREATE TABLE IF NOT EXISTS imported_tokens (
  id SERIAL PRIMARY KEY,
  mint_address VARCHAR(64) NOT NULL UNIQUE,
  source VARCHAR(32) DEFAULT 'solana',  -- 'solana', '8xm', 'raydium', etc.
  name VARCHAR(64),
  symbol VARCHAR(16),
  image_url TEXT,
  description TEXT,
  decimals INTEGER DEFAULT 9,
  -- Game metadata (added during import)
  tek8_guild VARCHAR(8),
  rainbow_road VARCHAR(16),
  game_role VARCHAR(32) DEFAULT 'general',
  -- Import info
  imported_by VARCHAR(64) NOT NULL,
  imported_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- Cryptofae species (starter set)
CREATE TABLE IF NOT EXISTS cryptofae_species (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  element VARCHAR(16) NOT NULL,  -- Maps to TEK8 guild element
  guild_id VARCHAR(8) NOT NULL,  -- D2, D4, D6, etc.
  rarity VARCHAR(16) DEFAULT 'common',  -- common, uncommon, rare, legendary
  description TEXT,
  image_url TEXT,
  home_territory VARCHAR(16),  -- Primary discovery location
  discovery_hint TEXT,
  attributes JSONB DEFAULT '{}'
);

-- Cryptofae discoveries (wallet owns cryptofae)
CREATE TABLE IF NOT EXISTS cryptofae_discoveries (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(64) NOT NULL,
  species_id INTEGER REFERENCES cryptofae_species(id),
  discovered_at TIMESTAMP DEFAULT NOW(),
  discovery_territory VARCHAR(16),
  bonded_token_mint VARCHAR(64),  -- Optional: bond to specific token
  nickname VARCHAR(64),
  UNIQUE(wallet_address, species_id)  -- One of each species per wallet
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_positions_wallet ON token_positions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_token_positions_territory ON token_positions(territory_id);
CREATE INDEX IF NOT EXISTS idx_token_positions_mint ON token_positions(token_mint);
CREATE INDEX IF NOT EXISTS idx_territory_control_token ON territory_control(controlling_token_mint);
CREATE INDEX IF NOT EXISTS idx_imported_tokens_guild ON imported_tokens(tek8_guild);
CREATE INDEX IF NOT EXISTS idx_cryptofae_discoveries_wallet ON cryptofae_discoveries(wallet_address);

-- Insert 8 starter cryptofae (one per guild)
INSERT INTO cryptofae_species (name, element, guild_id, rarity, description, home_territory, discovery_hint) VALUES
  ('Ethersong', 'Ether', 'D12', 'uncommon', 'A shimmering spirit that resonates with creative vibrations. Its crystalline form refracts light into impossible colors.', 'D12OUT', 'Found near places of artistic expression and spiritual gathering.'),
  ('Zephling', 'Air', 'D8', 'common', 'A playful wisp that carries whispered secrets on the wind. Teachers and translators often find these companions.', 'D8UP', 'Appears when knowledge is freely shared.'),
  ('Emberkin', 'Fire', 'D4', 'common', 'A tiny flame sprite that dances around forges and workshops. Smiths treasure their warmth and inspiration.', 'D4OUT', 'Drawn to acts of creation and transformation.'),
  ('Tideling', 'Water', 'D20', 'uncommon', 'A flowing creature of living memory. Healers and storykeepers attract these empathic beings.', 'D20DWN', 'Emerges during moments of deep emotional truth.'),
  ('Stoneheart', 'Earth', 'D6', 'common', 'A steady, patient creature made of living crystal. Grounders find them in places of growth and stability.', 'D6OUT', 'Appears where roots run deep and foundations are strong.'),
  ('Trickwisp', 'Chaos', 'D10', 'rare', 'An ever-shifting sprite of pure possibility. Tricksters and remixers attract these agents of change.', 'D10U45', 'Found in moments of unexpected transformation.'),
  ('Codex', 'Order', 'D100', 'rare', 'A geometric entity of pure structure. Archivists and codemakers attract these keepers of pattern.', 'D100DWN', 'Appears when complex systems are understood.'),
  ('Fortunate', 'Coin', 'D2', 'uncommon', 'A dual-natured spirit of balance and exchange. Weavers and distributors attract these arbiters of value.', 'D2OUT', 'Found where fair exchanges occur.')
ON CONFLICT (name) DO NOTHING;

-- Initialize all 40 territories as unclaimed
INSERT INTO territory_control (territory_id, control_strength) VALUES
  -- D12 Ether territories
  ('D12OUT', 0), ('D12UP', 0), ('D12DWN', 0), ('D12U45', 0), ('D12D45', 0),
  -- D8 Air territories
  ('D8OUT', 0), ('D8UP', 0), ('D8DWN', 0), ('D8U45', 0), ('D8D45', 0),
  -- D4 Fire territories
  ('D4OUT', 0), ('D4UP', 0), ('D4DWN', 0), ('D4U45', 0), ('D4D45', 0),
  -- D20 Water territories
  ('D20OUT', 0), ('D20UP', 0), ('D20DWN', 0), ('D20U45', 0), ('D20D45', 0),
  -- D6 Earth territories
  ('D6OUT', 0), ('D6UP', 0), ('D6DWN', 0), ('D6U45', 0), ('D6D45', 0),
  -- D10 Chaos territories
  ('D10OUT', 0), ('D10UP', 0), ('D10DWN', 0), ('D10U45', 0), ('D10D45', 0),
  -- D100 Order territories
  ('D100OUT', 0), ('D100UP', 0), ('D100DWN', 0), ('D100U45', 0), ('D100D45', 0),
  -- D2 Coin territories
  ('D2OUT', 0), ('D2UP', 0), ('D2DWN', 0), ('D2U45', 0), ('D2D45', 0)
ON CONFLICT (territory_id) DO NOTHING;
