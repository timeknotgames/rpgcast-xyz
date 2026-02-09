# RPGCast.xyz - Infrastructure Assessment & Roadmap

## Current State Assessment

### What's Built & Working

#### Token Infrastructure
- [x] Token creation via PumpPortal (embedded pump.fun)
- [x] Token registration with TEK8 guild + Rainbow Road metadata
- [x] Token discovery with filters (guild, verification, role)
- [x] IPFS metadata upload via Pinata
- [x] Trade widget for buy/sell via PumpPortal
- [x] Token detail pages
- [x] Verification badge system (pending/verified/flagged)

#### Champion System
- [x] Champion registration with wallet signature
- [x] Champion profiles (name, bio, guild, social links)
- [x] Champion directory listing
- [x] Game session scheduling (title, date, platform, tokens)
- [x] Champion-token relationships (creator/supporter/featured)

#### TEK8 Guild System
- [x] 8 guilds fully defined (D2-D100 dice system)
- [x] 40 Rainbow Roads (8 petals × 5 positions)
- [x] Petal attributes (element, sense, ability, etc.)
- [x] Garu Eggs and companion creature framework

#### Backend Infrastructure
- [x] Neon PostgreSQL shared database
- [x] Cloudflare Pages SSR deployment
- [x] Token-2022 minting service (rpgcast-backend)
- [x] Helius RPC integration
- [x] PumpPortal API integration

---

## What's Missing for MVP Gameplay

### 1. Token Holder Experience (CRITICAL)
**Current Gap**: Users can create/trade tokens but cannot "play" with them

**Needed**:
- [ ] **Token Staking/Commitment** - Stake tokens to territories/nations
- [ ] **Territory Claim System** - Link tokens to 40 Rainbow Road territories
- [ ] **Token Holder Dashboard** - View all owned tokens + game status
- [ ] **Portfolio Game State** - Track token positions in the game world

### 2. Cryptofae Discovery System (CRITICAL)
**Current Gap**: Cryptofae mentioned but no gameplay mechanic

**Needed**:
- [ ] **Cryptofae Database** - Species, attributes, discovery locations
- [ ] **Discovery Mechanics** - How token holders find/attract cryptofae
- [ ] **Cryptofae Bonding** - Link cryptofae to tokens or wallets
- [ ] **Cryptofae Trading/Gifting** - Transfer between players

### 3. Existing Token Onboarding (HIGH)
**Current Gap**: Only new pump.fun tokens supported

**Needed**:
- [ ] **Import Existing Solana Token** - Any SPL token by mint address
- [ ] **Token Verification Flow** - Prove ownership/creator status
- [ ] **Metadata Enhancement** - Add game attributes to existing tokens
- [ ] **Price Feed Integration** - Real-time prices for any token

### 4. 8xm.fun Launchpad Integration (HIGH)
**Current Gap**: Backend exists but not connected to rpgcast.xyz

**Needed**:
- [ ] **Launch Mode Selection** - pump.fun vs 8xm (Token-2022)
- [ ] **Token-2022 Benefits Display** - Royalties, metadata on-chain
- [ ] **Unified Token Registry** - Track tokens from both sources
- [ ] **Cross-platform Token View** - Same token appears on both sites

### 5. Game Session Integration (MEDIUM)
**Current Gap**: Sessions exist but don't affect game state

**Needed**:
- [ ] **Session Outcomes** - Record what happened in TTRPG sessions
- [ ] **Territory Changes** - Sessions affect map control
- [ ] **Champion Reputation** - Earn XP/reputation from hosting
- [ ] **Session Rewards** - Tokens/cryptofae distributed to participants

### 6. Persistent World Map (MEDIUM)
**Current Gap**: 40 territories defined but no visual/interactive map

**Needed**:
- [ ] **Interactive Territory Map** - Visual representation of Rainbow Roads
- [ ] **Territory Control Display** - Which nation owns which territory
- [ ] **Contest Visualization** - Show active territory battles
- [ ] **Historical Timeline** - Track world state changes over time

---

## Database Schema Additions Needed

```sql
-- Token holder game state
CREATE TABLE token_positions (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(64) NOT NULL,
  token_id INTEGER REFERENCES registered_tokens(id),
  territory_id VARCHAR(16),  -- Rainbow Road code (e.g., D12OUT)
  staked_amount BIGINT,
  staked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(wallet_address, token_id, territory_id)
);

-- Cryptofae creatures
CREATE TABLE cryptofae (
  id SERIAL PRIMARY KEY,
  species_name VARCHAR(64) NOT NULL,
  element VARCHAR(16),  -- Maps to TEK8 guild element
  rarity VARCHAR(16),   -- common, uncommon, rare, legendary
  description TEXT,
  image_url TEXT,
  discovery_location VARCHAR(16),  -- Territory where found
  attributes JSONB
);

-- Cryptofae ownership
CREATE TABLE cryptofae_bonds (
  id SERIAL PRIMARY KEY,
  cryptofae_id INTEGER REFERENCES cryptofae(id),
  wallet_address VARCHAR(64) NOT NULL,
  token_id INTEGER REFERENCES registered_tokens(id),
  bonded_at TIMESTAMP DEFAULT NOW(),
  bond_strength INTEGER DEFAULT 1
);

-- Territory control
CREATE TABLE territory_control (
  id SERIAL PRIMARY KEY,
  territory_id VARCHAR(16) NOT NULL UNIQUE,  -- D12OUT, D8UP, etc.
  controlling_nation_id INTEGER REFERENCES registered_tokens(id),
  control_strength INTEGER DEFAULT 0,
  contested BOOLEAN DEFAULT FALSE,
  last_changed TIMESTAMP DEFAULT NOW()
);

-- Session outcomes (game state changes)
CREATE TABLE session_outcomes (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES game_sessions(id),
  outcome_type VARCHAR(32),  -- territory_change, cryptofae_discovery, etc.
  affected_territory VARCHAR(16),
  winner_nation_id INTEGER REFERENCES registered_tokens(id),
  narrative_summary TEXT,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Imported tokens (non-pump.fun)
CREATE TABLE imported_tokens (
  id SERIAL PRIMARY KEY,
  mint_address VARCHAR(64) NOT NULL UNIQUE,
  source VARCHAR(32),  -- 'solana', '8xm', 'raydium', etc.
  verified_creator VARCHAR(64),
  imported_by VARCHAR(64) NOT NULL,
  imported_at TIMESTAMP DEFAULT NOW()
);
```

---

## Phased Implementation Roadmap

### Phase 1: Token Holder MVP (1-2 weeks)
**Goal**: Token holders can DO something with their tokens

1. **Token Holder Dashboard**
   - View all tokens in wallet
   - See game metadata for each token
   - Link to discovery page

2. **Territory Commitment**
   - Choose a territory (Rainbow Road) for your token
   - Display tokens committed to each territory
   - Basic "influence" calculation

3. **Existing Token Import**
   - Input any Solana mint address
   - Fetch metadata from chain
   - Add TEK8/Rainbow Road attributes

### Phase 2: Cryptofae System (2-3 weeks)
**Goal**: Introduce the creature discovery mechanic

1. **Cryptofae Species Database**
   - Create 40+ cryptofae (1 per territory minimum)
   - Rarity tiers, elemental alignments
   - Discovery requirements

2. **Discovery Mechanics**
   - Token holders can "explore" territories
   - Staked tokens increase discovery chance
   - Time-based discovery events

3. **Cryptofae Collection**
   - Wallet-based cryptofae inventory
   - Bond to specific tokens
   - Display in token detail pages

### Phase 3: Session-World Integration (2-3 weeks)
**Goal**: TTRPG sessions affect the persistent world

1. **Session Outcome Recording**
   - Champions record session results
   - Territory control changes
   - Cryptofae discoveries announced

2. **Territory Contest System**
   - Nations compete for territory control
   - Token staking affects contest outcome
   - Visual map updates

3. **Champion Reputation**
   - Track sessions hosted
   - Reputation score affects influence
   - Leaderboards

### Phase 4: Multi-Platform Integration (3-4 weeks)
**Goal**: Unified experience across all platforms

1. **8xm.fun Launchpad Integration**
   - Dual launch option (pump.fun vs Token-2022)
   - Shared token registry
   - Cross-platform token pages

2. **Multi-Chain Preparation**
   - Abstract token interfaces
   - Alchemy SDK integration
   - EVM chain support planning

3. **Platform Economics**
   - Revenue sharing model
   - Champion incentives
   - Creator benefits

---

## Revenue & Mutual Benefit Model

### Platform Revenue
- **Token-2022 Royalties**: 0-5% on trades (creator-set)
- **Featured Listings**: Champions pay to promote tokens
- **Premium Territories**: Special territories with bonuses
- **Cryptofae Sales**: Rare cryptofae auctions

### Creator Benefits
- **Visibility**: Tokens appear in curated discovery
- **Game Utility**: Tokens have actual gameplay use
- **Community**: Built-in player base through Champions
- **Cross-promotion**: Sessions feature their tokens

### Token Holder Benefits
- **Gameplay**: Actually use tokens in persistent world
- **Discovery**: Find cryptofae companions
- **Influence**: Affect world state through staking
- **Community**: Join Champion-led game sessions

### Champion Benefits
- **Reputation**: Build following through sessions
- **Revenue**: Featured token partnerships
- **Influence**: Shape the world narrative
- **Recognition**: Verified Champion status

---

## Immediate Next Steps

### This Week
1. [ ] Run new database migrations for token_positions, territory_control
2. [ ] Build Token Holder Dashboard page
3. [ ] Add "Import Existing Token" flow
4. [ ] Create territory commitment API

### Next Week
1. [ ] Design cryptofae species (start with 8, one per guild)
2. [ ] Build cryptofae discovery mechanic
3. [ ] Add territory map visualization
4. [ ] Connect session outcomes to world state

### Following Weeks
1. [ ] 8xm.fun launchpad integration
2. [ ] Champion reputation system
3. [ ] Territory contest mechanics
4. [ ] Multi-chain abstraction layer

---

## Technical Architecture Notes

### Shared Database Strategy
All platforms (rpgcast.xyz, 8xm.fun, quilu.xyz) share the same Neon PostgreSQL database. This enables:
- Unified token registry across platforms
- Shared user/wallet data
- Consistent game state
- Cross-platform features

### Multi-Backend Architecture
- **rpgcast-xyz**: Cloudflare Pages (frontend + API routes)
- **rpgcast-backend**: Node.js Express (Token-2022 minting)
- **8xm-sdk**: Distributed minting across Replit instances

### Future: Alchemy Integration
For multi-chain support, Alchemy provides:
- Unified API across EVM chains
- NFT APIs for cross-chain collections
- Token balance queries
- Transaction monitoring

---

## Success Metrics

### MVP Success
- [ ] 100 tokens registered with game metadata
- [ ] 10 active Champions hosting sessions
- [ ] 50 wallets with committed token positions
- [ ] 5 territory control changes from sessions

### Growth Metrics
- Token registrations per week
- Champion session frequency
- Territory contest participation
- Cryptofae discovery rate
- Cross-platform token launches

---

*Document created: 2026-02-04*
*Last updated: 2026-02-04*
