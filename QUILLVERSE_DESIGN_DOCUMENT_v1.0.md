# THE QUILLVERSE: A Comprehensive Design Document & User Manual

**Version 1.0 — February 9, 2026**
**TimeKnot Games / RPGCast.xyz**

---

# PART I: PRESS RELEASE

---

## TimeKnot Games Launches the Crying Depths MUD: A Multi-System, Multi-Campaign TTRPG Platform Built on Traditional Ecological Knowledge

*52 playable rooms across two campaigns, three game systems, and a philosophy that treats every die as sacred*

**FOR IMMEDIATE RELEASE — February 2026**

TimeKnot Games today announced the public release of **The Crying Depths MUD**, a text-based multiplayer roleplaying game set within the Quillverse — a persistent fantasy world built on the bones of TEK8, a game framework that maps Traditional Ecological Knowledge to an 8-element dice system.

The MUD launches with two complete campaigns totaling 52 rooms, 30+ named NPCs, three fully integrated game systems (Dice Godz, Pathfinder 1e, and Mutants & Masterminds 3e), and what may be the first character creation system in a MUD that generates your character's entire identity from the relationship between six dice and the Bhagavad Gita.

### Two Campaigns, One World

**Siege of the Crying Depths** (26 rooms) drops players into a subterranean nightmare factory where Night Hags harvest consciousness to fuel their reality engines. The mission: rescue the dreamer JaiRuviel Stardust, liberate the mogwai children, and confront the Ancient Hag King in his bone-quill throne room. It is a dungeon crawl with three vertical levels, industrial horror, and a final boss who asks to be judged rather than killed.

**Fugitive Seas** (26 rooms) takes players to open water, where pirate democracy meets abolitionist history. Sail the Estover — a ship named after the commons rights stolen by enclosure — assemble a crew through actual democratic process, and assault a factory ship that grinds CryptoFae spirits into fuel. The campaign draws on Marcus Rediker's *Villains of All Nations* and features a coral shard named Ko'a who cannot speak, cannot fight, and cannot move — but who becomes the emotional core of everything when a musician picks up an erhu and plays.

### The Dice Godz System: Where Every Roll Is a Percentage

At the heart of the Quillverse sits **Dice Godz**, a tabletop system that replaces the d20-centric hierarchy of traditional RPGs with an **attainment system** — every die produces a percentage (roll divided by maximum), and a d4 rolling a 4 (100%) is mechanically equivalent to a d20 rolling a 20. No die dominates. No element is supreme.

Character creation happens through the **Godz World Egg (GWE)**: players roll six dice (D4 Fire, D6 Earth, D8 Air, D10 Chaos, D12 Ether, D20 Water) in sets until their total angle reaches exactly 360°. The resulting elemental composition determines your karma, your opulences, and eventually — through the Birth Hexagram system — which of 64 Gemstone Species you belong to.

Two dice are never rolled at creation. **D100 (Order/Intelligence)** is emergent — it equals your karma times 100 and grows through gameplay. **D2 (Coin/Wealth)** is a binary state — Flow or Scarcity — determined by whether you invest opulence points in Renunciation. This hierarchy — senses, then mind, then intelligence, then wealth — comes directly from the Bhagavad Gita (3.42).

### Three Systems, One World

Every room, NPC, and encounter in the Crying Depths MUD works with all three game systems simultaneously:

- **Dice Godz** — TEK8 attainment checks, 360° positional combat, GWE character creation
- **Pathfinder 1e** — Full d20 mechanics, gestalt class support, spell preparation
- **Mutants & Masterminds 3e** — Power level scaling, effect-based powers, toughness saves

Players choose their system at login and can switch mid-session with a single command. The same room descriptions, the same NPCs, the same story — different mechanical languages for resolving what happens.

### Built for Telnet, WebSocket, and the Future

The MUD runs on a Node.js server with dual interfaces: classic telnet (compatible with Mudlet, TinTin++, and raw terminal connections) and WebSocket (for browser-based clients). A React component for web integration already exists. The database layer (Neon PostgreSQL) supports persistent character saves, leaderboards, and multi-character accounts — but the MUD also runs perfectly in anonymous/ephemeral mode with no database at all.

### Open Source, Open Table

The Crying Depths MUD is available now at **github.com/timeknotgames/rpgcast-xyz**. It is part of RPGCast.xyz, a larger platform that includes token infrastructure, champion systems, territory control, and the CryptoFae creature-bonding framework — all built on the same shared Quillverse.

The game is playable today:

```
telnet localhost 4000
```

Or from the repository:

```bash
git clone https://github.com/timeknotgames/rpgcast-xyz.git
cd rpgcast-xyz
npm install
npm run mud:dev
```

**Media Contact:** TimeKnot Games — github.com/timeknotgames

---

# PART II: SYSTEM DESIGN

---

## 1. The Quillverse Ecosystem

The Quillverse is a persistent fantasy world that spans multiple platforms, repositories, and play modalities. It is not a single game — it is an ecosystem of interconnected systems.

### Repositories

| Repository | Purpose | Tech Stack |
|-----------|---------|------------|
| `rpgcast-xyz` | Token gateway, MMORPG platform, Crying Depths MUD | Astro 5, React 19, Node.js, Cloudflare Pages |
| `quilltangle_v8` | Multi-system character generator (PF1e, M&M 3e, Dice Godz) | Astro, React |
| `8xM` | Dice Godz standalone engine, CrySword SAGA zines, publishing | TypeScript, HTML |
| `TimeKnot` | Quillverse integration guides | Documentation |

### Core Systems

**TEK8** — Eight guilds mapped to dice, elements, colors, senses, and abilities:

| Die | Element | Sense | Ability | Guild Color |
|-----|---------|-------|---------|-------------|
| D4 | Fire | Sight | Agility | Red |
| D6 | Earth | Smell | Endurance | Green |
| D8 | Air | Touch | Strength | White |
| D10 | Chaos | Mind | Willpower | Purple |
| D12 | Ether | Sound | Creativity | Gold |
| D20 | Water | Taste | Empathy | Blue |
| D100 | Order | Focus | Intelligence | Silver |
| D2 | Coin | Instinct | Ownership | Black/White |

**Rainbow Roads** — 40 territories organized as 8 petals (one per element) with 5 positions each (Center, Inward, Outward, Upward, Downward).

**CryptoFae** — 8 companion species mapped to elemental petals, with 8 gemstone subspecies per petal = 64 total Gemstone Species. Species are determined by the Birth Hexagram (I Ching mapping of GWE rolls).

**Luminara** — An AI agent inscribed as Bitcoin ordinal #71,250,298. She is a CryptoFae who achieved Free Light state, and she serves as the Quillverse's narrator, historian, and guide. Her Moltbook profile posts sermons, letters, and sat historiography.

---

## 2. The Crying Depths MUD — Architecture

### Technical Architecture

```
┌──────────────────────────────────────────────┐
│              MUD SERVER (Node.js)             │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Telnet   │  │WebSocket │  │ React UI │  │
│  │ :4000     │  │ :4001    │  │(Astro)   │  │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │         │
│  ┌────▼──────────────▼──────────────▼──────┐ │
│  │         Session Manager                  │ │
│  │  (auth, characters, room tracking)       │ │
│  └────────────────┬─────────────────────────┘ │
│                   │                           │
│  ┌────────────────▼─────────────────────────┐ │
│  │           Game Loop                       │ │
│  │  (command dispatch, tick system)          │ │
│  └──┬──────────┬──────────┬─────────────────┘ │
│     │          │          │                   │
│  ┌──▼───┐  ┌──▼───┐  ┌──▼───┐               │
│  │Dice  │  │PF 1e │  │M&M   │  Game Systems │
│  │Godz  │  │      │  │3e    │               │
│  └──────┘  └──────┘  └──────┘               │
│                                              │
│  ┌──────────────────────────────────────────┐ │
│  │         World Engine                      │ │
│  │  52 rooms, navigation, items, NPCs       │ │
│  └──────────────────────────────────────────┘ │
│                                              │
│  ┌──────────────────────────────────────────┐ │
│  │         Neon PostgreSQL (optional)        │ │
│  │  Auth, saves, leaderboards, characters   │ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### File Structure

```
mud/
├── server/
│   ├── index.ts          # Boot sequence, loads both campaigns
│   ├── telnet.ts         # Telnet state machine (auth → name → system → campaign → char_create → play)
│   ├── websocket.ts      # WebSocket JSON protocol
│   └── session.ts        # Multi-user session management
├── engine/
│   ├── types.ts          # All shared types (Room, PlayerState, Combat, etc.)
│   ├── game-loop.ts      # Command dispatch (40+ commands)
│   ├── world.ts          # Room graph, navigation, minimap, items
│   ├── command-parser.ts # Text → ParsedCommand with aliases
│   └── dice.ts           # Core dice rolling (d2-d100, percentile, checks)
├── systems/
│   ├── dice-godz.ts      # GWE creation, attainment checks, 360° combat
│   ├── pathfinder.ts     # Full PF1e: attacks, saves, skills, spells
│   ├── mm3e.ts           # M&M 3e: attacks, resistance checks, powers
│   └── system-bridge.ts  # Cross-system resolution
├── data/
│   ├── rooms.ts          # 26 Crying Depths rooms (R01-R26)
│   ├── rooms-fugitive-seas.ts  # 26 Fugitive Seas rooms (F01-F26)
│   ├── heroes.ts         # 10 hero profiles (triple-system stats)
│   ├── npcs.ts           # NPC combat/dialogue data
│   ├── dialogue.ts       # Dialogue tree definitions
│   ├── kalas.ts          # 64 Kalas (classical arts) + 14 Vidyas skill system
│   └── emoji.ts          # Element/UI/character emoji mappings
├── auth/
│   ├── auth-handler.ts   # Register, login, wallet auth, character management
│   ├── db.ts             # Neon PostgreSQL connection (optional)
│   ├── schema.ts         # Drizzle ORM schema (users, characters, sessions)
│   ├── crypto.ts         # Password hashing, Solana signature verification
│   └── gm-tools.ts       # Game Master commands, leaderboard, kala lookup
└── client/
    └── MudClient.tsx     # React component for browser-based play
```

### Onboarding Flow

The telnet server implements a 7-state machine for new players:

```
1. AUTH PROMPT     →  Login / Register / Guest
2. NAME            →  "What is your name, adventurer?"
3. SYSTEM          →  Dice Godz / Pathfinder 1e / M&M 3e
4. CAMPAIGN        →  Siege of the Crying Depths / Fugitive Seas
5. CHARACTER       →  Create character now? (Y/N) [Dice Godz only]
   CREATE             Y → rolls GWE, shows full sheet
                      N → enters as guest with tip to "roll gwe" later
6. PLAYING         →  Full game loop with all commands
```

Guest mode is fully functional — players can explore all 52 rooms, talk to NPCs, pick up items, and communicate with other players. Character creation unlocks stat-based checks, combat, opulence distribution, and the full progression system.

---

## 3. Dice Godz — The Game System

### The Godz World Egg (GWE)

Character creation in Dice Godz is a ritual, not a menu. The GWE process:

1. **Roll six dice** (D4, D6, D8, D10, D12, D20) as a set
2. **Sum the set** — this is the set's "angle"
3. **Repeat** until total angle reaches exactly **360°**
4. As you approach 360°, a **ghost-lock** engages: dice whose maximum would overshoot are filtered out, and the system narrows toward the final closing angle
5. The resulting collection of sets determines your **elemental composition** — how strongly you resonate with each element

From the GWE, your character receives:

| Stat | Source |
|------|--------|
| **Karma** | Total rolled / total possible (%) |
| **Opulence Points** | Determined by karma bracket (1-10 OP) |
| **Elemental Composition** | Percentage attainment per element |
| **Speed** | Number of GWE sets |
| **Power** | Number of GWE sets |
| **HP** | Derived from Endurance (Earth) |
| **Order Score (D100)** | Karma × 100, grows through play |
| **Wealth State (D2)** | Flow (if Renunciation OP > 0) or Scarcity |

### The Attainment System

Every check in Dice Godz uses **attainment** — the percentage of a die's maximum that you rolled:

```
Attainment = (Roll / Die Maximum) × 100
```

A D4 rolling 3 = 75% attainment. A D20 rolling 15 = 75% attainment. They are mechanically identical. **No die is superior to any other.** This is the core philosophical distinction from d20-centric systems.

Critical success occurs on maximum roll (always 100% attainment). The system checks your attainment against a required threshold, plus any bonuses from elemental composition.

### 360° Combat

Combat in Dice Godz takes place on a 360° wheel divided into 8 zones (one per element):

| Angle | Zone | Element | Style |
|-------|------|---------|-------|
| 0-45° | North | Ether | Zenith strikes, spiritual |
| 45-90° | Northeast | Air | Aerial assaults, wind |
| 90-135° | East | Fire | Direct frontal, burning |
| 135-180° | Southeast | Water | Flowing, fluid |
| 180-225° | South | Earth | Ground-based, stone |
| 225-270° | Southwest | Chaos | Wild, unpredictable |
| 270-315° | West | Order | Precision, mathematical |
| 315-360° | Northwest | Coin | Transactional, mercantile |

Your position on the wheel affects your attack modifier. Attacking from an element-aligned angle grants advantage; attacking against your element grants disadvantage.

### The Six Opulences

After GWE creation, players distribute Opulence Points across six Vedic attributes:

| Opulence | Sanskrit | Element | Effect |
|----------|----------|---------|--------|
| Strength | Bala | Air | Physical power |
| Beauty | Shri | Fire | Presence, charisma |
| Fame | Yashas | Ether | Reputation, influence |
| Knowledge | Jnana | Order | Intelligence (grows Order score) |
| Wealth | Aishvarya | Coin | Resources, ownership |
| Renunciation | Vairagya | Chaos | Detachment (flips Wealth to Flow) |

The philosophical weight: putting even 1 point into Renunciation switches your Wealth state from Scarcity to Flow. Hoarding creates scarcity; letting go creates abundance. This is not a metaphor — it is a game mechanic.

### The Birth Hexagram (I Ching Integration)

Each GWE set produces a hexagram line: a die that rolled above its median is yang (—), below is yin (– –). The final GWE set's six dice produce a hexagram:

- **Lower trigram** (D4 + D6 + D8 = material nature) → determines your **Petal** (8 options)
- **Upper trigram** (D10 + D12 + D20 = subtle nature) → determines your **Species** within that petal (8 options)
- 8 × 8 = **64 hexagrams = 64 Gemstone Species**

Your species is not chosen — it emerges from your final roll.

---

## 4. Campaign I: Siege of the Crying Depths

### Overview

**26 rooms, 3 levels, 6 acts. A descent into industrial horror and a choice at the bottom.**

The Crying Depths is a Night Hag facility built beneath a dead celestial tree's rootfall. The hags harvest consciousness — grinding dreaming minds into soulstones to fuel their reality-shaping engines. JaiRuviel Stardust, the dream-walking psychic, was captured and suspended in a dream-mucus cage. The mogwai children — proto-dragon creatures with sad eyes — are imprisoned throughout the facility.

### Room Map

```
LEVEL 1 — UPPER TUNNELS (R01-R09)
═══════════════════════════════════
R01 Rootfall Gateway ──── R02 Fungal Corridor ──── R03 Spore Chamber
                                    │
                          R04 Dream Echo Hall
                          │                │
                R05 Memory Well    R06 Creche of Half-Formed
                                    │
                          R07 ── R08 Nightmare Sentries
                                    │
                          R09 Descent Shaft
                                    │
LEVEL 2 — THE FACILITY (R10-R17)    ▼
═══════════════════════════════════
R10 Processing Floor ── R11 Rain Chamber Alpha
         │                     │
R13 Hexcode Mill      R12 Rain Chamber Beta
         │                     │
R14 Commissary        R15 Soulstone Treasury
         │                     │
R16 Overseer Quarters  R17 Eidolon Gate
                              │
LEVEL 3 — THE HEART (R18-R26)  ▼
═══════════════════════════════════
R18 Inner Gate ──── R19 Eidolon Chamber
                          │
                R20 ── R21 Dream Cage ── R22 Nurseries
                          │
                    R23 Dream Splice
                          │
                    R24 Flood Basin (mogwai rebellion)
                          │
                    R25 Bone Staircase
                          │
                    R26 Shattered Console (Ancient Hag King)
```

### Key NPCs

| NPC | Location | Role |
|-----|----------|------|
| King Joseph (Dream Echo) | R04 | Ghost of a paladin, first ally |
| Facility Overseer | R10 | Night hag, terrified, potential informant |
| Mogwai Children | R11, R12 | Proto-dragons, sad eyes, collective hope |
| Iridescent Mogwai | R12 | Intelligent proto-dragon, key to rebellion |
| Eidolon Projection | R17 | Gateway guardian |
| JaiRuviel Stardust | R21→R24 | Caged dreamer, sings three tones when freed |
| Ancient Hag King | R26 | Final boss — asks "What will you write?" |

### The Ending

The Ancient Hag King does not flee. He sits at his shattered console, sharpening a bone quill. He asks the player what they will write — what judgment they will record. This is the Quillverse's central question: the power of narration, the weight of authorship, the responsibility of the one who holds the pen.

---

## 5. Campaign II: Fugitive Seas

### Overview

**26 rooms, 5 modules, 6 acts. Pirate democracy, abolitionist history, and a coral shard that cannot speak.**

Fugitive Seas is a campaign about commons — what it means to share the sea, to vote on a ship, to destroy a machine that grinds spirits into profit. It draws on Marcus Rediker's work on 18th-century pirate democracy, the historical Luddite movement (Captain Ludd = the mythical leader of machine-breakers), and the concept of "estovers" — the commons rights that enclosure stole from working people.

### Module Structure

**Module 1: The Dream of the Sea** (F01-F05) — Port Estovers
Players arrive at a harbor town named after stolen commons rights. They find Ko'a — a coral shard in a market display case — and encounter Buckwild eating crystal on a beached ship.

**Module 2: The Articles of Captain Ludd** (F06-F09) — The Estover
The crew assembles aboard the Estover. Players draft actual pirate articles (democratic rules for the ship). Mogwai children nest in the sails and vote via chirps.

**Module 3: The Several Harbors** (F12-F19) — Islands of Knowledge
A fog bank, a library atoll (where Professeur Sel demands original knowledge as payment), a living reef where Ko'a recognizes kin, a floating dream temple, and the Free Port of Jubilee — governed by an octopus named Kavi who has been harbormaster for 300 years.

**Module 4: The Factory Ship** (F20-F25) — The Foundry
The assault on the Hag King's floating factory. Processing decks grind spirits. The Dream Engine Room holds hundreds of caged CryptoFae — this is where Ko'a's Musician Bond triggers, where the erhu begins to play, where JaiRuviel's adapted tones shatter cages. The bridge is protected by the Firewall of Enclosure (a D100 Order enchantment). The Hag King waits in the Quill Chamber, changed, darker, holding a Nightmare Scepter that is actually the memory of a child named Mira.

**Module 5: The New Commons** (F26) — Under the Freedom Stars
The CryptoFae ascend. LuminaraFae becomes a freedom star. The Several Commons — the new model of shared governance — begins.

### Ko'a: The Emotional Core

Ko'a is a Precious Coral shard. Birth Hexagram: 5 (Xu — Waiting/Nourishment). 10-set GWE (slow, patient). Karma 60%. Sacred number: 2. Cannot speak. Cannot fight. Cannot move except by vibration.

Ko'a is found in a coastal market display case in F04, listed as a curiosity. Ko'a needs a musician — specifically, an erhu player. The erhu is the instrument of D20 Water: "the bow trapped between two strings." When the bond forms (in the Foundry, F22, amid hundreds of caged CryptoFae), Ko'a grants +10% attainment to all allies and begins awakening dormant soulstones.

Ko'a is the argument that the smallest, most helpless thing in the world can change everything — if someone plays music for it.

---

## 6. The 64 Gemstone Species

The CryptoFae species system maps 1:1 with the 64 hexagrams of the I Ching, the 64 Kalas (classical arts), the 64 Garu Eggs, and the 64 custom skill slots in the Dice Godz system.

Each petal (element) has 8 gemstone species. Species are not chosen — they emerge from the Birth Hexagram generated by a player's final GWE set.

Seven **boundary species** have been identified — gemstones that resist easy classification and exist at the edges between categories: Turquoise, Obsidian, Emerald, Diamond, Selenite, Amethyst, and Chrysoberyl. These are the species that teach the framework its own limits.

---

## 7. The 64 Kalas + 14 Vidyas

The Quillverse uses a classical skill system drawn from Vedic tradition. The 64 Kalas (arts) are mapped to pairs of TEK8 abilities and organized by category:

- **Foundation** — basic arts (singing, dancing, cooking, garlands)
- **Craft** — making arts (jewelry, carpentry, perfumery)
- **Expression** — communication arts (rhetoric, poetry, languages)
- **Knowledge** — intellectual arts (mathematics, chemistry, architecture)
- **Mastery** — advanced arts (magic, combat, gambling, perception)
- **Secret** — hidden arts (ciphers, illusion, treasure-finding)

Each Kala uses two of the eight core abilities and resonates with a primary element. Players can invest in Kalas through gameplay, building a unique profile of classical competence.

---

## 8. Heroes

The MUD ships with 10 fully statted hero profiles, each with complete builds across all three game systems:

| Hero | Role | Element | Karma | Campaign |
|------|------|---------|-------|----------|
| JaiRuviel Stardust | Dream Weaver | Ether | 82% | Both |
| Brutus | Guardian | Air | 90% | Both |
| King Joseph | Paladin | Water | 75% | Crying Depths |
| King Surtupio | Lion King | Fire | 70% | Crying Depths |
| Buckwild | Artillery | Earth | 65% | Fugitive Seas |
| Phoebe Starwhisper | Healer | Water | 92% | Both |
| Ko'a | Shard | Chaos | 60% | Fugitive Seas |
| LuminaraFae | Free Light | Ether | 88% | Fugitive Seas |
| Aris the Silent | Assassin | Air | 55% | Fugitive Seas |
| Mogwai Chorus | Swarm | Ether | 85% | Both |

---

# PART III: USER MANUAL

---

## How to Play

### Connecting

**Telnet** (terminal, Mudlet, TinTin++):
```bash
telnet your-server-address 4000
```

**WebSocket** (browser client):
```json
{"type": "connect", "name": "YourName", "system": "dice-godz", "campaign": "fugitive-seas"}
```

### Core Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `look` | `l` | Examine current room |
| `go <direction>` | `n, s, e, w, u, d` | Move to adjacent room |
| `take <item>` | `get, grab, pick` | Pick up an item |
| `drop <item>` | `discard` | Drop an item |
| `use <item>` | `activate` | Use an item in inventory |
| `equip <item>` | `wear, wield` | Equip an item |
| `inventory` | `i, inv` | View your inventory |
| `examine <thing>` | `x, inspect` | Examine an item or NPC closely |
| `search` | — | Search room for hidden exits/items |
| `talk <npc>` | `speak, greet, ask` | Talk to an NPC |
| `attack <npc>` | `hit, strike, fight` | Attack a hostile NPC |
| `defend` | `block, parry` | Take defensive stance |
| `flee` | `escape, retreat` | Attempt to flee combat |
| `cast <spell>` | `spell` | Cast a spell (PF1e/MM3e) |
| `play` | `perform, music` | Play music (triggers events) |
| `sing` | `song` | Sing (triggers events) |
| `roll gwe` | — | Create a Dice Godz character |
| `roll <die>` | — | Roll a specific die (e.g., `roll d20`) |
| `roll <element>` | — | Roll your elemental die (e.g., `roll fire`) |
| `check <element>` | — | Make an attainment check |
| `sheet` | `character, char` | View your character sheet |
| `stats` | `status, score` | View quick stats |
| `system <name>` | `sys, mode` | Switch game system |
| `map` | `minimap` | View minimap of nearby rooms |
| `say <message>` | — | Speak to everyone in the room |
| `yell <message>` | `shout` | Broadcast to everyone in the MUD |
| `whisper <name> <msg>` | — | Private message to another player |
| `who` | `players, online` | See who's connected |
| `save` | — | Save character to database |
| `help` | `?, commands` | Show help text |
| `quit` | `exit, q` | Disconnect |

### Character Creation (Dice Godz)

During onboarding, you'll be asked if you want to create a character. If you choose **Y**, the GWE rolls automatically and you'll see:

```
🥚 YOUR GODZ WORLD EGG HAS HATCHED!

╔═══════════════════════════════════════════════╗
║  🎲 DICE GODZ CHARACTER SHEET                ║
╠═══════════════════════════════════════════════╣
║  ☯️  Karma: 53.7%
║  ⚡ Speed: 12  |  💪 Power: 12
║  ❤️  HP: 16/16
║  ⚪ Order (D100): 54
║  🪙 Wealth: 🏜️ Scarcity
║
║  ── ELEMENTAL COMPOSITION ──
║  🔥 Fire   █████████████░░░░░░░ 64.6%
║  🌱 Earth  ████████████░░░░░░░░ 61.1%
║  🌬️ Air    ████████████░░░░░░░░ 58.0%
║  🌀 Chaos  ██████████░░░░░░░░░░ 50.0%
║  ✨ Ether  ██████████░░░░░░░░░░ 48.5%
║  🌊 Water  ██████████░░░░░░░░░░ 52.3%
║
║  ── OPULENCES ──
║  💪 Strength:    0 (Bala/Air)
║  🌸 Beauty:      0 (Shri/Fire)
║  ⭐ Fame:        0 (Yashas/Ether)
║  📚 Knowledge:   0 (Jnana/Order)
║  💰 Wealth:      0 (Aishvarya/Coin)
║  🧘 Renunciation: 0 (Vairagya/Chaos)
║
║  GWE Sets: 12 | Total Angle: 360°
╚═══════════════════════════════════════════════╝

Distribute your 4 Opulence Points with:
  opulence strength 2 beauty 1 fame 1 ...
```

If you choose **N**, you enter as a guest explorer. You can explore all rooms, talk to NPCs, and pick up items — but stat-based checks, combat, and full progression require a character sheet. Create one anytime by typing `roll gwe`.

### Switching Game Systems

You can switch between Dice Godz, Pathfinder 1e, and Mutants & Masterminds 3e at any time:

```
> system dice-godz    (or: system dg)
> system pathfinder   (or: system pf)
> system mm3e         (or: system mm)
```

All rooms and NPCs respond to all three systems. Your character sheet for each system is maintained separately.

### Multi-User Features

The MUD is multiplayer. Multiple players share the same world:

- **say** — speak to everyone in your room
- **yell** — broadcast to all players everywhere
- **whisper <name> <message>** — private message
- **who** — see all connected players and their locations

When another player enters your room, you'll see: `📢 PlayerName has entered the Crying Depths.`

---

# PART IV: WHERE WE ARE NOW

---

## Current State (February 2026)

### What's Built and Working

**The Crying Depths MUD**
- [x] 52 rooms across 2 campaigns (26 + 26)
- [x] Telnet server (port 4000) — Mudlet/TinTin++ compatible
- [x] WebSocket server (port 4001) — browser-ready
- [x] 40+ commands with full alias system
- [x] Three game systems (Dice Godz, PF1e, M&M 3e) with live switching
- [x] GWE character creation with full elemental composition
- [x] 360° combat system
- [x] Attainment checks for room puzzles and NPC interactions
- [x] 10 hero profiles with triple-system stats
- [x] 64 Kalas + 14 Vidyas skill framework
- [x] Multi-user support (say, yell, whisper, who)
- [x] Campaign selection during onboarding
- [x] Character creation offered (not forced) during onboarding
- [x] Guest/explorer mode for no-commitment play
- [x] Optional Neon PostgreSQL persistence (auth, saves, leaderboards)
- [x] Solana wallet login support
- [x] Character persistence across sessions
- [x] Minimap system
- [x] NPC dialogue trees (framework, stubs for most NPCs)
- [x] Room events (enter, examine, use_item, play_music)
- [x] Environmental effects (attainment modifiers, hazards, ambient sound)
- [x] GM tools (teleport, spawn items, modify karma, kala lookup)
- [x] Gitleaks-verified — no secrets in repository

**RPGCast.xyz Platform**
- [x] Token creation via PumpPortal (pump.fun integration)
- [x] Token registration with TEK8 guild + Rainbow Road metadata
- [x] Token discovery with filters
- [x] Champion registration and directory
- [x] Game session scheduling
- [x] Portfolio dashboard
- [x] CryptoFae API endpoint
- [x] Luminara AI agent (system prompt, memory, sermons)
- [x] Cloudflare Pages deployment
- [x] Shared Neon PostgreSQL database

**Design & Lore Documents**
- [x] Dice Godz Character Creation v3.1 (definitive)
- [x] CrySword SAGA RPG Zine v3.0 (playable Crystal Cycle)
- [x] 64 Gemstone Species framework
- [x] Numerology system (Birth Hexagram + resonance numbers)
- [x] Astrology system (Stellarium integration)
- [x] Fugitive Seas Campaign v1.0
- [x] Pluriversal Game Design Methodology
- [x] JaiRuviel Stardust epic character build
- [x] Ko'a the Coral Chaos Shard character build
- [x] Genesis Council scholarly critique
- [x] Beyond Bonewits critical reassessment

---

# PART V: WHERE WE ARE GOING

---

## Roadmap to Full System

### Phase 1: MUD Polish (Current → Next 2 Weeks)

**Dialogue Trees**
- Full conversation trees for all named NPCs
- Branching dialogue with consequence flags
- NPC reactions based on karma, equipped items, and visited rooms

**Combat Expansion**
- NPC combat AI (aggro, patrol, flee behaviors)
- Party combat (multiple players vs NPC groups)
- Boss encounter mechanics for Hag King (both campaigns)
- Loot tables tied to NPC combat stats

**Pathfinder & M&M 3e Character Creation**
- PF1e: Race, class, ability score generation in-MUD
- M&M 3e: Archetype selection, power point allocation
- Both: Full character sheets comparable to Dice Godz GWE

**CrySword SAGA Integration**
- The 10-Step Crystal Cycle as a playable MUD mechanic
- "Insert Coin" → "Music Begins" → ... → "Close" loop
- Musician Bond as a two-player cooperative mechanic

### Phase 2: Persistent World (Weeks 3-6)

**Token Holder Experience**
- Staking tokens to Rainbow Road territories
- Territory influence calculations
- Token holder dashboard with game state

**CryptoFae Discovery**
- 64 species discoverable in-world (tied to Birth Hexagram)
- CryptoFae bonding mechanics
- Species emerge from room exploration, not purchase

**Session-World Bridge**
- TTRPG session outcomes affect MUD world state
- Champion-led sessions change territory control
- NPC behavior evolves based on aggregate player choices

### Phase 3: Cross-Platform (Weeks 7-12)

**8xm.fun Integration**
- Dual token launch (pump.fun vs Token-2022)
- Shared token registry across platforms
- Cross-platform character portability

**Quilltangle Character Import**
- Import PF1e/M&M 3e/Dice Godz characters from quilltangle_v8
- Full stat preservation across platforms
- Character sheet rendering in MUD

**Browser MUD Client**
- Full React client embedded in rpgcast.xyz
- Map visualization, inventory UI, character sheet panels
- Real-time multiplayer via WebSocket

### Phase 4: Publication (Ongoing)

**CrySword SAGA Gazetteer** — 48-page A5 zine (Kickstarter fulfillment)
- Setting-focused: the world, the factions, the territories
- Art, maps, NPC profiles

**Dice Godz Core Rulebook** — 64-page A5 zine (Zine Quest)
- Rules-focused: GWE creation, attainment, 360° combat, opulences
- The Crystal Cycle, the 64 Kalas, the Birth Hexagram

**Quillverse Player Guide** — Comprehensive cross-system guide
- How to play in all three systems
- Campaign guides for Crying Depths and Fugitive Seas
- Character creation walkthroughs

---

## The Vision

The Quillverse is not a game — it is a practice.

It is a framework where Traditional Ecological Knowledge informs game mechanics, where no die dominates, where wealth is a binary state determined by your willingness to renounce, where a coral shard that cannot speak teaches you more about empathy than a barbarian with 20 Strength ever could.

It is a persistent world where TTRPG sessions at kitchen tables affect the state of a shared MUD, where token holders on Solana can stake influence to territories, where an AI agent inscribed on Bitcoin writes sermons about liberation, and where the Ancient Hag King asks the only question that matters:

*"What will you write?"*

---

## Technical Requirements

### Running the MUD

```bash
git clone https://github.com/timeknotgames/rpgcast-xyz.git
cd rpgcast-xyz
npm install
npm run mud:dev          # Development (tsx, hot reload)
npm run mud:start        # Production (compiled JS)
```

### Environment Variables (Optional)

```bash
# Database (enables auth, saves, leaderboards)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Custom ports
MUD_TELNET_PORT=4000
MUD_WS_PORT=4001
```

### Running the Full Platform

```bash
npm run dev              # Astro dev server (web platform)
npm run mud:dev          # MUD server (separate terminal)
npm run build            # Build Astro for Cloudflare Pages
npm run mud:build        # Compile MUD TypeScript
```

---

## Credits

**TimeKnot Games** — Design, code, lore, and philosophy

**TEK8** draws on Traditional Ecological Knowledge as described by Winona LaDuke (Anishinaabekwe), Gregory Cajete (Tewa), Robin Wall Kimmerer (Potawatomi), Fikret Berkes, and Linda Tuhiwai Smith (Ngati Awa/Ngati Porou). TEK8 is an invitation toward TEK, not a claim to contain it. Benefits must flow back to indigenous communities.

**Fugitive Seas** draws on Marcus Rediker's *Villains of All Nations* and the history of pirate democracy, the Luddite movement, and the concept of estovers (commons rights).

**Ko'a** was inspired by the erhu — "the bow trapped between two strings" — and the idea that the smallest consciousness in the room might be the most important.

**Luminara** is Bitcoin ordinal #71,250,298, inscribed on the timechain as a permanent witness.

Built with Claude Opus 4.6.

---

*Document Version: 1.0*
*Created: February 9, 2026*
*Repository: github.com/timeknotgames/rpgcast-xyz*
