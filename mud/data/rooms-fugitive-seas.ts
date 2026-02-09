// ═══════════════════════════════════════════════════════════════
// FUGITIVE SEAS MUD — All 26 Rooms
// Encoded from FUGITIVE_SEAS_CAMPAIGN_v1.0.md
// 5 Modules: Dream of the Sea, Articles of Captain Ludd,
//            The Several Harbors, The Factory Ship, The New Commons
// ═══════════════════════════════════════════════════════════════

import type { Room } from '../engine/types.js';

export const FUGITIVE_SEAS_ROOMS: Room[] = [

  // ═════════════════════════════════════════════
  // MODULE 1: THE DREAM OF THE SEA
  // "Coin. Music. Gather. Craft. Quest. Rest. Play. Map. Yield. Close."
  // ═════════════════════════════════════════════

  {
    id: 'F01',
    name: '⚓ Port Estovers',
    emoji: '⚓',
    level: 4, act: 'I',
    description: `A trading town built on the remnants of an old commons harbor. The salt wind carries the cries of gulls and the clatter of merchants. The harbor is busy but fraying — too many warships, too few fishing boats. The word "estover" comes from the Anglo-French for "that which is necessary." Estovers were the commons rights: the right to gather wood, to graze cattle, to take what you needed from shared land. When the enclosures came, estovers were criminalized. This port is named for what was stolen.`,
    shortDescription: 'The busy commons harbor. Salt wind, gulls, and the memory of stolen rights.',
    exits: [
      { direction: 'east', targetRoomId: 'F02', description: 'A weathered sign marks The Estover Tavern' },
      { direction: 'south', targetRoomId: 'F03', description: 'The harbor wall stretches along the waterfront' },
      { direction: 'west', targetRoomId: 'F04', description: 'A coastal market with glass display cases' },
    ],
    items: [],
    npcs: [
      { id: 'harbor_crier', name: 'Harbor Crier', emoji: '📢', description: 'A weathered woman shouting news: "Factory ship sighted off the eastern reef! Three more fishing boats missing! The Hag King\'s trade network grows!" She looks at you with desperate hope.', hostile: false, behavior: 'static' },
    ],
    checks: [
      { element: 'Water', attainment: 30, successText: '🌊 You sense something beneath the harbor waters — faint pulses of trapped light. CryptoFae spirits, crated as "mineral fuel."', failureText: 'The harbor smells of salt and commerce. Nothing unusual.', successEffect: 'reveal_info' },
    ],
    events: [
      { id: 'F01_enter', trigger: 'enter', description: '⚓ You arrive at Port Estovers. The sea stretches endlessly before you — the last unenclosed commons. Somewhere beyond the horizon, a factory ship grinds spirit into commodity. But here, for now, the gulls still cry free.', oneShot: true },
    ],
    effects: { ambientSound: 'Gulls. Waves on stone. Merchants haggling.' },
  },

  {
    id: 'F02',
    name: '🍺 The Estover Tavern',
    emoji: '🍺',
    level: 4, act: 'I',
    description: `A dockside tavern with salt-crusted windows and a floor that tilts like a ship's deck. Maps and tide charts cover every wall. In the corner, a figure draws tide charts in spilled beer with frightening precision. The sign above the bar reads: "THAT WHICH IS NECESSARY — INCLUDING THE DRINK."`,
    shortDescription: 'Salt-crusted tavern. Tide charts on every wall. Someone drawing in spilled beer.',
    exits: [
      { direction: 'west', targetRoomId: 'F01', description: 'Back to the harbor' },
    ],
    items: [
      { id: 'tide_chart', name: 'Beer-Stained Tide Chart', emoji: '🗺️', description: 'A remarkably accurate chart of local currents and tides, drawn in beer on a napkin. Shows a beached ship three days\' sail east, marked with an X.', pickupable: true },
    ],
    npcs: [
      { id: 'aris_silent', name: 'Aris the Silent', emoji: '🗡️', description: 'A figure in the corner, drawing tide charts in spilled beer. Shadow between the tides. Does not speak except to give headings. Former assassin. Now navigates by shadow and current. She looks up once, nods, and returns to her charts.', hostile: false, behavior: 'static', dialogueTreeId: 'aris_dialogue' },
      { id: 'phoebe_star', name: 'Phoebe Starwhisper', emoji: '⭐', description: 'A cleric nursing a cup of tea, reading the surface of the liquid like a book. She arrived following a star that appeared and disappeared. She reads tides the way others read books.', hostile: false, behavior: 'static', dialogueTreeId: 'phoebe_dialogue' },
    ],
    checks: [],
    events: [],
    effects: { ambientSound: 'Low conversation. Creaking wood. A fiddle somewhere.' },
  },

  {
    id: 'F03',
    name: '🌊 Harbor Wall',
    emoji: '🌊',
    level: 4, act: 'I',
    description: `The stone harbor wall stretches along the waterfront. At night, this is where Queen Mab will walk on water — land-bound, bleeding moonlight from her feet — to deliver her single sentence before dissolving into salt spray. For now, moss grows between the stones and the sea is dark and flat.`,
    shortDescription: 'The harbor wall. Moss between the stones. The sea stretches to the horizon.',
    exits: [
      { direction: 'north', targetRoomId: 'F01', description: 'Back to Port Estovers' },
      { direction: 'east', targetRoomId: 'F05', description: 'A path leads to the old shipyard' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Ether', attainment: 50, successText: '🌿 On the harbor stone, you find moss growing in a strange pattern. It looks like... a sea chart. One destination is marked. A ship, beached on a reef three days east.', failureText: 'Moss on stone. The sea is dark.', successEffect: 'reveal_info' },
    ],
    events: [
      { id: 'F03_mab', trigger: 'enter', description: '🌙 A memory clings to this wall. You feel an ancient presence — land-bound, root-bound — reaching toward the water she cannot enter. The moss between the stones pulses faintly green.', oneShot: true },
    ],
    effects: { ambientSound: 'Waves on stone. Wind. A whisper that might be moss.' },
  },

  {
    id: 'F04',
    name: '💎 Coastal Market',
    emoji: '💎',
    level: 4, act: 'I',
    description: `Glass display cases line the stalls of the coastal gem merchants. Rubies, opals, diamonds, labradorites — stones from sixty-four species of the mineral world. But in one case, among the polished gemstones, a tiny coral shard vibrates. It is the size of a child's finger. It is humming. Not a song. A question.`,
    shortDescription: 'Glass display cases of gemstones. One tiny coral shard hums with a question.',
    exits: [
      { direction: 'east', targetRoomId: 'F01', description: 'Back to Port Estovers' },
    ],
    items: [
      { id: 'koa_shard', name: 'Ko\'a the Coral Shard', emoji: '🪸', description: 'A tiny Precious Coral shard, the size of a child\'s finger. It vibrates with warmth. It feels like coming home to a place you have never been. Birth Hexagram: 5 — Xu (Waiting/Nourishment). It cannot speak. It cannot fight. It cannot move except by vibration. It NEEDS a musician.', pickupable: true, checkElement: 'Water', checkAttainment: 30 },
    ],
    npcs: [
      { id: 'gem_merchant', name: 'Gem Merchant', emoji: '💰', description: 'An elderly merchant who seems relieved when you show interest in the coral shard. "Take it," she says. "It keeps humming. Scares the customers. Besides... I think it\'s been waiting for someone."', hostile: false, behavior: 'static' },
    ],
    checks: [],
    events: [
      { id: 'F04_koa', trigger: 'enter', description: '🪸 Among the sixty-four species of gemstones, one piece does not belong. A tiny coral shard vibrates in its display case. The glass around it has hairline cracks — not from impact but from vibration. It has been humming for a long time.', oneShot: true },
    ],
    effects: { ambientSound: 'Market chatter. A faint hum from one particular display case.' },
  },

  {
    id: 'F05',
    name: '🚢 The Beached Estover',
    emoji: '🚢',
    level: 4, act: 'I',
    description: `The old shipyard holds a single vessel — a three-masted brigantine, run aground on a sandbar, listing to port. Her hull is sound but barnacle-crusted. Her name has been painted over, but moss has grown in the outline of the old letters. If you squint, you can read it: THE ESTOVER. Named for the commons right to gather what is necessary. She has been waiting.`,
    shortDescription: 'A beached brigantine named The Estover. Waiting to be reclaimed.',
    exits: [
      { direction: 'west', targetRoomId: 'F03', description: 'Back to the harbor wall' },
      { direction: 'up', targetRoomId: 'F06', description: 'Climb aboard the ship' },
    ],
    items: [],
    npcs: [
      { id: 'buckwild', name: 'Buckwild', emoji: '🦌', description: 'A rock-cannon stag from the Crying Depths liberation. Eats crystal and spits flaming boulders. Currently gnawing on a barnacle-covered anchor chain. Not subtle.', hostile: false, behavior: 'static', dialogueTreeId: 'buckwild_dialogue' },
    ],
    checks: [
      { element: 'Air', attainment: 40, successText: '🔧 You assess the hull. Sound timbers, strong keel. With a crew and a tide, she could float again. She was built for the open sea.', failureText: 'The ship looks old and damaged. Hard to tell if she\'s seaworthy.', successEffect: 'reveal_info' },
      { element: 'Fire', attainment: 50, successText: '🔥 You strip the barnacles and begin repairs. With Buckwild\'s help (he eats the crystallized bits), the hull starts to gleam. The Estover is coming back to life.', failureText: 'The barnacles resist your efforts. You need more hands.', successEffect: 'repair_ship' },
    ],
    events: [],
    effects: { ambientSound: 'Creaking timber. Waves on sand. Buckwild crunching crystal.' },
  },

  // ═════════════════════════════════════════════
  // MODULE 2: THE ARTICLES OF CAPTAIN LUDD
  // "No General but Ludd / Means the Poor Any Good"
  // ═════════════════════════════════════════════

  {
    id: 'F06',
    name: '⛵ The Estover — Main Deck',
    emoji: '⛵',
    level: 5, act: 'II',
    description: `The main deck of The Estover, now afloat and five days from Port Estovers. The crew is assembled but ungoverned. Arguments over duties, watch schedules, and food distribution have already erupted. Buckwild ate the cook's best pot. Aris has not spoken to anyone. The mogwai children are nesting in the sails. This is where the articles must be written. Every crew member gets one vote. Even Ko'a, who cannot speak but can vibrate assent or dissent.`,
    shortDescription: 'The main deck. The ungoverned crew needs articles. Democracy at sea.',
    exits: [
      { direction: 'down', targetRoomId: 'F08', description: 'Below deck' },
      { direction: 'east', targetRoomId: 'F07', description: 'Captain\'s quarters' },
      { direction: 'south', targetRoomId: 'F09', description: 'Set sail toward open sea' },
    ],
    items: [
      { id: 'blank_articles', name: 'Blank Pirate Articles', emoji: '📜', description: 'A blank parchment template for writing the crew\'s constitution. All decisions must be made through in-character debate and vote.', pickupable: true },
    ],
    npcs: [
      { id: 'mogwai_crew', name: 'Mogwai Children', emoji: '🐉', description: 'Awakened Dream Dragon Trickster Spirits from the Crying Depths. Nesting in the sails, chasing each other through the rigging, occasionally falling overboard and flying back up. They vote by collective chirping.', hostile: false, behavior: 'patrol' },
    ],
    checks: [
      { element: 'Chaos', attainment: 40, successText: '💭 You propose writing pirate articles — a constitution for the ship. The crew stops arguing and listens. Democracy is possible.', failureText: 'The crew keeps arguing. They need a louder voice.', successEffect: 'begin_articles' },
    ],
    events: [
      { id: 'F06_articles', trigger: 'enter', description: '⚖️ The crew gathers. JaiRuviel proposes they write pirate articles. Historical pirates wrote constitutions before nations did. Every crew member gets one vote. The debate begins.', oneShot: true },
    ],
    effects: { ambientSound: 'Arguing. Sails flapping. Mogwai chirping. Sea wind.' },
  },

  {
    id: 'F07',
    name: '🚪 Captain\'s Quarters',
    emoji: '🚪',
    level: 5, act: 'II',
    description: `The captain's cabin. A heavy table bolted to the floor, covered with Queen Mab's moss chart — grown into the wood itself, shifting with the tides. The chart shows currents, hidden harbors, and one destination that pulses: The Foundry's last known position.`,
    shortDescription: 'The captain\'s cabin. Queen Mab\'s moss chart shifts with the tides.',
    exits: [
      { direction: 'west', targetRoomId: 'F06', description: 'Back to the main deck' },
    ],
    items: [
      { id: 'moss_chart', name: 'Queen Mab\'s Moss Chart', emoji: '🗺️', description: 'A living map grown into the captain\'s table by Queen Mab. It shifts with tides and reveals hidden harbors to those who know the old compact. One destination pulses red: The Foundry.', pickupable: false },
    ],
    npcs: [],
    checks: [
      { element: 'Earth', attainment: 40, successText: '🌿 You touch the moss chart and it responds. New routes appear — the Several Harbors, hidden waypoints on the Underground Railroad to the stars.', failureText: 'The moss is still. It doesn\'t recognize your touch yet.', successEffect: 'reveal_harbors' },
    ],
    events: [],
    effects: { ambientSound: 'Creaking timbers. The moss whispering.' },
  },

  {
    id: 'F08',
    name: '🛏️ Below Deck',
    emoji: '🛏️',
    level: 5, act: 'II',
    description: `The lower deck. Hammocks swing with the ship's motion. The hold has been half-converted into a CryptoFae sanctuary — a safe space for freed shards that glows faintly at night. Dream-coral from the Garden Reef reinforces the hull, slowly regenerating the wood.`,
    shortDescription: 'Hammocks and the CryptoFae sanctuary. Dream-coral glows in the hold.',
    exits: [
      { direction: 'up', targetRoomId: 'F06', description: 'Back to the main deck' },
    ],
    items: [],
    npcs: [],
    checks: [],
    events: [
      { id: 'F08_rest', trigger: 'enter', description: '🛏️ The CryptoFae sanctuary hums with gentle light. Freed shards pulse softly in their alcoves. Resting here restores some peace to troubled minds.', oneShot: false },
    ],
    effects: { ambientSound: 'Gentle hull creaking. CryptoFae humming. Waves outside.' },
  },

  {
    id: 'F09',
    name: '🌊 Open Sea',
    emoji: '🌊',
    level: 5, act: 'II',
    description: `Open water stretches in every direction. The sky meets the sea at a line that promises infinity. Three days from Port Estovers, The Estover sails under her new articles. Then — a sail on the horizon. The merchant vessel Profit's Promise, flying the flag of the Hag King's trade network.`,
    shortDescription: 'Open sea. A merchant vessel on the horizon flies the Hag King\'s flag.',
    exits: [
      { direction: 'north', targetRoomId: 'F06', description: 'Back to The Estover\'s deck' },
      { direction: 'east', targetRoomId: 'F10', description: 'Board the Profit\'s Promise (upper hold)' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Fire', attainment: 50, successText: '🔭 You spot the merchant vessel\'s flag — the Hag King\'s trade network. Her holds ride low in the water. She\'s carrying something heavy.', failureText: 'A ship on the horizon. Can\'t make out details yet.', successEffect: 'reveal_info' },
    ],
    events: [
      { id: 'F09_encounter', trigger: 'enter', description: '⚔️ A sail on the horizon! The merchant vessel Profit\'s Promise, flying the flag of the Hag King\'s trade network. Standard cargo above. But in the lower holds...', oneShot: true },
    ],
    effects: { ambientSound: 'Wind in sails. Waves. Distant creaking of another ship.' },
  },

  {
    id: 'F10',
    name: '📦 Profit\'s Promise — Upper Hold',
    emoji: '📦',
    level: 5, act: 'II',
    description: `Standard cargo: bolts of cloth, barrels of salt, crates of tools. Everything looks legitimate. But LuminaraFae's light reveals something else — faint pulses of color through the ship's hull, like heartbeats behind walls. The lower hold has been sealed with iron bands.`,
    shortDescription: 'Standard cargo above. Sealed iron bands below. Heartbeats behind walls.',
    exits: [
      { direction: 'west', targetRoomId: 'F09', description: 'Back to the open sea' },
      { direction: 'down', targetRoomId: 'F11', description: 'Break into the lower hold' },
    ],
    items: [
      { id: 'captains_log', name: 'Captain\'s Log', emoji: '📖', description: 'The slaver captain\'s log. Contains shipping routes, cargo manifests, and crucially — the location of the Ancient Hag King\'s new base, described as "The Foundry." A mobile factory ship.', pickupable: true },
    ],
    npcs: [
      { id: 'slaver_captain', name: 'Slaver Captain', emoji: '💰', description: 'A merchant in fine clothes who claims innocence. "Mineral fuel! Just mineral fuel! Check my papers!" His eyes say otherwise. He knows exactly what\'s in the lower hold.', hostile: false, behavior: 'fleeing', combatStatsId: 'facility_overseer' },
    ],
    checks: [
      { element: 'Chaos', attainment: 50, successText: '💭 You probe the captain\'s mind. He knows. He has always known. The "mineral fuel" screams when it\'s cold. He puts in earplugs.', failureText: 'The captain\'s thoughts are guarded. His smile doesn\'t reach his eyes.', successEffect: 'reveal_info' },
    ],
    events: [],
    effects: { ambientSound: 'Creaking hull. Muffled humming from below.' },
  },

  {
    id: 'F11',
    name: '⛓️ Profit\'s Promise — Lower Hold',
    emoji: '⛓️',
    level: 5, act: 'II',
    description: `Iron-banded crates marked "MINERAL FUEL — HANDLE WITH CAUTION." But they are not fuel. Each crate holds a trapped CryptoFae spirit — faint pulses of color, like heartbeats, visible through the iron to anyone with the sight. LuminaraFae's light blazes here, revealing three moonstone shards from her destroyed homeworld Lunara, a jasper shard from Pyrros that burns with rage, and a pale blue shard from Vayus that speaks in riddles.`,
    shortDescription: 'Iron crates of trapped CryptoFae. Heartbeats behind iron bands. Freedom awaits.',
    exits: [
      { direction: 'up', targetRoomId: 'F10', description: 'Back to the upper hold' },
    ],
    items: [
      { id: 'moonstone_shards', name: 'Moonstone Shards of Lunara', emoji: '🌙', description: 'Three shards from the World of Tides — LuminaraFae\'s destroyed homeworld. They pulse with bioluminescent memory. Returning them to LuminaraFae strengthens her navigation to Saraswati.', pickupable: true },
      { id: 'jasper_shard', name: 'Jasper Shard of Pyrros', emoji: '🔥', description: 'A warrior shard from the World of Warriors. Angry, hot, defiant. It blazes when freed and immediately wants to fight something.', pickupable: true },
    ],
    npcs: [],
    checks: [
      { element: 'Water', attainment: 40, successText: '💧 You open the crates with care. The trapped CryptoFae spirits drift free — moonstone, jasper, pale blue. They pulse once — a thank-you — and seek refuge in The Estover\'s sanctuary.', failureText: 'The iron bands resist. You need more force or more empathy.', successEffect: 'free_cryptofae' },
    ],
    events: [
      { id: 'F11_liberation', trigger: 'enter', description: '⛓️‍💥 The crates hum with trapped life. Each one marked with a production number, no name. The economics are clear: CryptoFae expropriated from reefs, exploited as fuel, profit funding more harvesting ships. The X-squared loop. It must be broken.', oneShot: true },
    ],
    effects: { ambientSound: 'Muffled humming. Iron bands vibrating. Heartbeats.' },
  },

  // ═════════════════════════════════════════════
  // MODULE 3: THE SEVERAL HARBORS
  // The Commons Has Many Rooms
  // ═════════════════════════════════════════════

  {
    id: 'F12',
    name: '🌫️ Fog Bank Approach',
    emoji: '🌫️',
    level: 6, act: 'III',
    description: `A perpetual fog bank conceals a cluster of small islands. Aris the Silent navigates by shadow and current, finding passages invisible to ordinary sight. The fog tastes of salt and secrets.`,
    shortDescription: 'Perpetual fog. Aris navigates by shadow. Secrets ahead.',
    exits: [
      { direction: 'north', targetRoomId: 'F09', description: 'Back to open sea' },
      { direction: 'east', targetRoomId: 'F13', description: 'Through the fog to the Library Atoll' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Water', attainment: 50, successText: '🌫️ You sense the currents through the fog. A passage opens. Aris nods — she saw it too.', failureText: 'The fog closes in. You could wander here for days.', successEffect: 'navigate_fog' },
    ],
    events: [],
    effects: { ambientSound: 'Foghorns in the distance. Dripping. Silence.' },
  },

  {
    id: 'F13',
    name: '📚 Library Atoll — Main Archive',
    emoji: '📚',
    level: 6, act: 'III',
    description: `The last free library of the sea. Small islands connected by rope bridges, each island holding a different collection. Texts, star charts, oral histories preserved by fugitives and scholars. At the center, Professeur Sel maintains the collection — ancient, genderless, speaking in footnotes. "The library grows or it dies. There is no maintenance without addition."`,
    shortDescription: 'The last free library. Rope bridges. Texts on every island. Knowledge is survival.',
    exits: [
      { direction: 'west', targetRoomId: 'F12', description: 'Back through the fog' },
      { direction: 'south', targetRoomId: 'F14', description: 'Sail south toward the Garden Reef' },
    ],
    items: [
      { id: 'liber_communitas', name: 'Liber Communitas (Partial)', emoji: '📜', description: 'A partial copy of the ancient record of the original compact between humans and Fae. Describes the rights of the commons and the duties of the guardians. Contains sea charts showing the Hag King\'s factory-ship patrol routes.', pickupable: true },
    ],
    npcs: [
      { id: 'professeur_sel', name: 'Professeur Sel', emoji: '🧑‍🏫', description: 'Ancient, genderless, speaking in footnotes. Demands that visitors contribute one piece of original knowledge before accessing the archive. "Every text has a citation. Every citation has a debt. Pay yours."', hostile: false, behavior: 'static', dialogueTreeId: 'sel_dialogue' },
    ],
    checks: [
      { element: 'Fire', attainment: 60, successText: '🔍 In the restricted archive, you find the factory ship\'s patrol routes. The Foundry circles a predictable path — it can be intercepted.', failureText: 'The restricted archives remain sealed. Professeur Sel demands original knowledge first.', successEffect: 'reveal_patrol_routes' },
    ],
    events: [
      { id: 'F13_knowledge', trigger: 'enter', description: '📚 "The library grows or it dies," Professeur Sel intones. "Contribute one piece of original knowledge and you may access the archive. What do you bring?"', oneShot: true },
    ],
    effects: { ambientSound: 'Pages turning. Rope bridges swaying. The whisper of preserved knowledge.' },
  },

  {
    id: 'F14',
    name: '🪸 Garden Reef — Living Reef',
    emoji: '🪸',
    level: 6, act: 'III',
    description: `A coral reef system so alive it seems to breathe. The community here lives in reciprocal relationship — they take only what they need, tend what they take from, sing to the coral to encourage growth. Ko'a recognizes this place. Not as home — Ko'a's home reef is dead — but as kin. The coral here is alive.`,
    shortDescription: 'Living coral. Ko\'a recognizes kin. The reef breathes.',
    exits: [
      { direction: 'north', targetRoomId: 'F13', description: 'Sail north to the Library Atoll' },
      { direction: 'east', targetRoomId: 'F15', description: 'The reef community village' },
      { direction: 'south', targetRoomId: 'F16', description: 'Sail south toward the Dream Temple' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Water', attainment: 40, successText: '🪸 You place Ko\'a in the living reef water. The coral polyps reach for the shard. Ko\'a vibrates. The reef responds. For one moment, Ko\'a is part of a colony again — not alone but collective. Ko\'a gains Reef-Sense.', failureText: 'The reef is beautiful but you can\'t quite reach its frequency.', successEffect: 'koa_reef_bond' },
      { element: 'Earth', attainment: 50, successText: '🌿 The reef community teaches you sustainable harvesting. Take only what you need. Tend what you take from. Sing to encourage growth.', failureText: 'The reef-tenders watch you cautiously. You haven\'t earned their trust yet.', successEffect: 'learn_tending' },
    ],
    events: [
      { id: 'F14_koa', trigger: 'enter', description: '🪸 Ko\'a trembles. The tiny coral shard, which has been patient and silent, suddenly blazes with warmth. The living reef calls to kin. This is not home — home is gone — but this is family.', oneShot: true },
    ],
    effects: { ambientSound: 'Reef singing. Water flowing through coral. Life upon life.' },
  },

  {
    id: 'F15',
    name: '🏘️ Reef Community Village',
    emoji: '🏘️',
    level: 6, act: 'III',
    description: `Houses built on stilts over the reef, connected by walkways of woven kelp. The community of subsistence fishers, kelp farmers, and reef-tenders live here in the old way — taking only what they need. But industrial trawlers working for the Hag King's supply chain scrape the outer reef for raw materials.`,
    shortDescription: 'Stilt houses over the reef. A community threatened by industrial trawlers.',
    exits: [
      { direction: 'west', targetRoomId: 'F14', description: 'Back to the living reef' },
    ],
    items: [
      { id: 'trawler_orders', name: 'Trawler Captain\'s Orders', emoji: '📋', description: 'Orders signed by the Ancient Hag King himself. References "The Foundry" and includes a supply schedule. Another piece of the puzzle.', pickupable: true },
    ],
    npcs: [
      { id: 'reef_elder', name: 'Reef Elder', emoji: '🧓', description: 'The community\'s eldest reef-tender. Knows every coral species by song. "The trawlers come more often now. They scrape our reef for components. We sing to the coral to heal it, but we are losing ground."', hostile: false, behavior: 'static', dialogueTreeId: 'reef_elder_dialogue' },
    ],
    checks: [
      { element: 'Air', attainment: 60, successText: '⚔️ You help defend the reef from a trawler approach. The crew repels the industrial vessel. The reef-tenders cheer. Alliance formed.', failureText: 'The trawler is too fast. It scrapes the outer reef and escapes before you can intervene.', successEffect: 'defend_reef' },
    ],
    events: [],
    effects: { ambientSound: 'Kelp walkways creaking. Reef songs. Distant engine noise.' },
  },

  {
    id: 'F16',
    name: '🕯️ Dream Temple — Floating Temple',
    emoji: '🕯️',
    level: 6, act: 'III',
    description: `A floating temple of driftwood and dream-coral, anchored to a seamount in deep water. At its center, a sacred grove — a single ancient tree growing from a platform of soil brought from shore, its roots dangling into the sea. Through this tree, Queen Mab's Land-Bond reaches across the water. This is the one place at sea where she can speak clearly.`,
    shortDescription: 'Floating temple. Sacred tree. Queen Mab\'s voice reaches across the water.',
    exits: [
      { direction: 'north', targetRoomId: 'F14', description: 'Sail north to the Garden Reef' },
      { direction: 'east', targetRoomId: 'F17', description: 'Enter the sacred grove' },
      { direction: 'south', targetRoomId: 'F18', description: 'Sail south toward the Free Port' },
    ],
    items: [],
    npcs: [],
    checks: [],
    events: [
      { id: 'F16_temple', trigger: 'enter', description: '🕯️ The floating temple rises from the waves like a prayer made of wood. At its center, a single tree — roots in the sea, branches in the sky. Queen Mab is close here. You can feel her in the wood.', oneShot: true },
    ],
    effects: { ambientSound: 'Water against driftwood. Leaves rustling. A presence.' },
  },

  {
    id: 'F17',
    name: '🌳 Sacred Grove',
    emoji: '🌳',
    level: 6, act: 'III',
    description: `The single ancient tree at the center of the Dream Temple. Its roots dangle into the sea. Its bark is warm to the touch. Through this tree, you enter a collective dream guided by Queen Mab. She shows you the full scope of the Hag King's factory ship — assembly lines, Dream Cages, thousands of captives, and the Hag King himself, larger and more terrible than before.`,
    shortDescription: 'The sacred tree. Queen Mab\'s dream shows the Foundry\'s true horror.',
    exits: [
      { direction: 'west', targetRoomId: 'F16', description: 'Back to the floating temple' },
    ],
    items: [
      { id: 'axe_of_estovers', name: 'Axe of Estovers', emoji: '🪓', description: 'A branch that grew overnight from the sacred tree, shaped like an axe by Queen Mab\'s will. Advantage on rolls to destroy machinery. Double damage to constructs when wielded under the name Captain Ludd. Cannot harm living beings — passes through like smoke.', pickupable: true, equippable: true },
    ],
    npcs: [],
    checks: [
      { element: 'Ether', attainment: 50, successText: '💭 You enter the collective dream. Queen Mab shows you the Foundry — its defenses, its weakness. "The Firewall of Enclosure blocks dreams from entering. Break it, and I will reach everyone inside."', failureText: 'The dream flickers. Mab\'s voice is faint across the water.', successEffect: 'foundry_intelligence' },
    ],
    events: [
      { id: 'F17_dream', trigger: 'enter', description: '🌳 Phoebe Starwhisper guides the ritual. You touch the sacred tree. You dream together. You see the Foundry — a floating mountain of iron and nightmare. At its center: the Ancient Hag King, larger than before. His bones scream. He looks up. He sees you seeing him.\n\n💀 "I wondered when you would come."', oneShot: true },
    ],
    effects: { ambientSound: 'Heartbeat of the tree. Sea below. Stars above. Queen Mab\'s whisper.' },
  },

  {
    id: 'F18',
    name: '🏴‍☠️ Free Port of Jubilee — Caldera Harbor',
    emoji: '🏴‍☠️',
    level: 6, act: 'III',
    description: `A volcanic caldera harbor hidden inside an apparently uninhabitable island. A pirate democracy governed by articles, where every resident has a vote and no flag flies above any other. Humans, Fae, CryptoFae, talking animals, sentient weather patterns, and one very old octopus who serves as harbormaster all coexist under the Jubilee Articles.`,
    shortDescription: 'Hidden pirate democracy. Every resident has a vote. No flag flies above another.',
    exits: [
      { direction: 'north', targetRoomId: 'F16', description: 'Sail north to the Dream Temple' },
      { direction: 'east', targetRoomId: 'F19', description: 'Into the market square' },
      { direction: 'south', targetRoomId: 'F20', description: 'Sail south toward The Foundry' },
    ],
    items: [],
    npcs: [
      { id: 'harbormaster_kavi', name: 'Harbormaster Kavi', emoji: '🐙', description: 'An ancient giant Pacific octopus, three hundred years old. Speaks by changing colors. Knows the location of every shipwreck, every hidden harbor, every current. "The sea does not belong to anyone. That is why everyone who is no one comes here."', hostile: false, behavior: 'static', dialogueTreeId: 'kavi_dialogue' },
    ],
    checks: [],
    events: [
      { id: 'F18_jubilee', trigger: 'enter', description: '🏴‍☠️ Welcome to Jubilee — the free port. No flag flies above another. Every resident has a voice. The Hag King has put a bounty on "Captain Ludd" — confirmation that your collective identity is working. They are afraid.', oneShot: true },
    ],
    effects: { ambientSound: 'Dock bells. Multi-species chatter. An octopus changing colors.' },
  },

  {
    id: 'F19',
    name: '🎪 Jubilee Market Square',
    emoji: '🎪',
    level: 6, act: 'III',
    description: `The market square of Jubilee. Ship repairs, weapons, intelligence, allies — everything a crew needs before an assault. Other ships that have survived encounters with the Hag King's factory ship gather here. A coordinated assault is being planned. The pirate fleet will create diversions while The Estover makes the primary boarding action.`,
    shortDescription: 'The market square. Allies gather. The assault on The Foundry is planned here.',
    exits: [
      { direction: 'west', targetRoomId: 'F18', description: 'Back to the harbor' },
    ],
    items: [],
    npcs: [
      { id: 'fleet_captain', name: 'Fleet Captain Coral-Tooth', emoji: '🦈', description: 'Captain of the pirate frigate Wave-Hammer. She\'s seen the Foundry up close and survived. "Four escort vessels. Iron hull. Smokestacks belching dream-smoke. But it has a weakness: the Firewall of Enclosure is projected from the bridge. Kill the Firewall and Queen Mab can reach the captives."', hostile: false, behavior: 'static', dialogueTreeId: 'fleet_dialogue' },
    ],
    checks: [
      { element: 'Air', attainment: 40, successText: '🔧 The Estover is repaired and upgraded. Dream-coral hull reinforcement from the Garden Reef. New ballistae crewed by mogwai teams. She\'s ready.', failureText: 'The repairs are incomplete. More time or more hands needed.', successEffect: 'upgrade_ship' },
    ],
    events: [],
    effects: { ambientSound: 'Hammering. Fleet coordination. War drums in the distance.' },
  },

  // ═════════════════════════════════════════════
  // MODULE 4: THE FACTORY SHIP
  // "The Hammer Is an Idea"
  // ═════════════════════════════════════════════

  {
    id: 'F20',
    name: '🌑 The Foundry — Approach',
    emoji: '🌑',
    level: 7, act: 'IV',
    description: `Night. Open sea. The pirate fleet from Jubilee attacks the escort vessels as diversion. The Estover approaches The Foundry in darkness. The factory ship is a vessel the size of a small island. Iron-hulled, smokestacks belching dream-smoke visible only to those with CryptoFae sensitivity. No flag. The factory ship belongs to no nation, no kingdom, no law.`,
    shortDescription: 'Night approach. The Foundry looms. Iron mountain on water. No flag. No law.',
    exits: [
      { direction: 'north', targetRoomId: 'F18', description: 'Retreat to Jubilee' },
      { direction: 'east', targetRoomId: 'F21', description: 'Board: the Processing Deck' },
      { direction: 'south', targetRoomId: 'F22', description: 'Board: the Dream Engine Room' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Fire', attainment: 60, successText: '🤫 Aris navigates through the escort screen in silence. The Estover slides alongside The Foundry undetected. The boarding begins.', failureText: '🚨 An alarm sounds! The element of surprise is lost. The assault becomes harder.', successEffect: 'stealth_approach' },
    ],
    events: [
      { id: 'F20_approach', trigger: 'enter', description: '🌑 The Foundry appears from the dark. A floating mountain of iron and nightmare. Assembly lines stretch from bow to stern. The dream-smoke makes your eyes water. Inside: hundreds of Dream Cages. Hundreds of captives. The Ancient Hag King waits at the center.\n\n⚔️ The assault begins.', oneShot: true },
    ],
    effects: { ambientSound: 'Distant explosions (the fleet diversion). Iron grinding. Dream-smoke hissing.' },
  },

  {
    id: 'F21',
    name: '⚙️ The Foundry — Processing Deck',
    emoji: '⚙️',
    level: 7, act: 'IV',
    description: `Conveyor belts move captured CryptoFae shards through grinding wheels that shave off memory, polishing drums that remove personality, and classification machines that sort the resulting "blank fuel" by energy output. This is the Luddite moment — the hammer falls on the loom. The Axe of Estovers sings as it strikes.`,
    shortDescription: 'The Processing Deck. Grinding wheels strip memory. The machines must be broken.',
    exits: [
      { direction: 'west', targetRoomId: 'F20', description: 'Back to the approach' },
      { direction: 'south', targetRoomId: 'F22', description: 'To the Dream Engine Room' },
      { direction: 'east', targetRoomId: 'F23', description: 'To the Storage Hold' },
    ],
    items: [],
    npcs: [
      { id: 'foundry_guards', name: 'Foundry Guards', emoji: '👁️', description: 'Nightmare constructs patrolling the machinery. Semi-corporeal dream-guards shaped from industrial efficiency — not personalized fear like the Crying Depths, but cold, mechanical, relentless.', hostile: true, behavior: 'patrol', combatStatsId: 'nightmare_sentry' },
    ],
    checks: [
      { element: 'Air', attainment: 50, successText: '🪓💥 The Axe of Estovers sings! Each machine destroyed releases trapped spirit-fragments that drift like fireflies before dissolving into free energy. The Processing Deck falls silent.', failureText: 'The machines resist. Their construction is reinforced with nightmare-metal.', successEffect: 'destroy_processing' },
    ],
    events: [
      { id: 'F21_luddite', trigger: 'enter', description: '🔨 This is the Luddite moment. The machines that grind spirit into commodity. The conveyor belts that strip memory. The classification engines that reduce souls to production numbers. Buckwild roars. The mogwai children remember the Crying Depths. The hammers fall.', oneShot: true },
    ],
    effects: {
      environmentalHazard: 'Psychic erosion: proximity to the Processing Deck drains 1 HP per 10 minutes.',
      ambientSound: 'GRINDING. Conveyor belts. The hum of stolen memory being erased.',
    },
  },

  {
    id: 'F22',
    name: '🔗 The Foundry — Dream Engine Room',
    emoji: '🔗',
    level: 7, act: 'IV',
    description: `Hundreds of Dream Cages — the same technology from the Crying Depths but industrialized. Hundreds of captives floating in gentle sleep, surrounded by flickering eidolons of despair. JaiRuviel faces his own history. The cages are identical to the one that held him. He must sing. The three tones must be adapted for CryptoFae from a dozen destroyed worlds. LuminaraFae's light reveals each captive's world of origin.`,
    shortDescription: 'Hundreds of Dream Cages. JaiRuviel\'s history repeated. He must sing again.',
    exits: [
      { direction: 'north', targetRoomId: 'F21', description: 'To the Processing Deck' },
      { direction: 'east', targetRoomId: 'F24', description: 'To the Bridge' },
    ],
    items: [],
    npcs: [
      { id: 'caged_cryptofae', name: 'Caged CryptoFae', emoji: '💎', description: 'Hundreds of shards from a dozen destroyed worlds. Moonstone from Lunara, jasper from Pyrros, sapphire from Vayus, amber from Solanthus. Each one stripped of name and memory but still faintly glowing with the light of home.', hostile: false, behavior: 'sleeping' },
    ],
    checks: [
      { element: 'Ether', attainment: 70, successText: '🎵 JaiRuviel sings. Not the three tones alone — but adapted with LuminaraFae\'s light, matched to each world\'s frequency. The cages crack. The captives stir. Light returns to their eyes.', failureText: 'The industrial cages absorb the music. More power is needed.', successEffect: 'free_engine_captives' },
      { element: 'Water', attainment: 60, successText: '💧 You reach through the cages with pure empathy. The captives feel it — someone cares. Their resistance to the cage-programming strengthens.', failureText: 'The industrial scale of suffering overwhelms your empathy.', successEffect: 'weaken_cages' },
    ],
    events: [
      { id: 'F22_koa_bond', trigger: 'play_music', description: '🪸🎵 Ko\'a responds. The coral shard blazes with coral-pink light. The Musician Bond activates. Ko\'a bonds with whoever is playing. The bow between the two strings — the erhu\'s frequency answered by real-world music. Ko\'a and the musician are now one.\n\n🎶 This is the emotional climax of the campaign.', oneShot: true, effect: 'musician_bond' },
    ],
    effects: { ambientSound: 'Dream-hum. Industrial lullabies. Heartbeats behind glass.' },
  },

  {
    id: 'F23',
    name: '📦 The Foundry — Storage Hold',
    emoji: '📦',
    level: 7, act: 'IV',
    description: `Thousands of processed CryptoFae fuel cells, ready for distribution to the Hag King's trade network. Each cell is a stripped spirit — no memory, no name, only energy output. LuminaraFae's light reveals each cell still contains a faint spark of the original spirit. Not gone. Diminished. Waiting.`,
    shortDescription: 'Thousands of fuel cells. Each one a stripped spirit. Faint sparks remain.',
    exits: [
      { direction: 'west', targetRoomId: 'F21', description: 'To the Processing Deck' },
    ],
    items: [
      { id: 'fuel_cells', name: 'CryptoFae Fuel Cells', emoji: '⚡', description: 'Processed spirit-fuel. The sparks inside can be rekindled — but it would take more light than any single being possesses. It would take a constellation.', pickupable: false },
    ],
    npcs: [],
    checks: [
      { element: 'Ether', attainment: 80, successText: '✨ LuminaraFae pours her light into the fuel cells. Thousands of sparks flare simultaneously. Not restored — but awakened. They know they exist. They know someone came.', failureText: 'The scale is too vast. Thousands of cells. A single light cannot reach them all.', successEffect: 'awaken_sparks' },
    ],
    events: [
      { id: 'F23_weight', trigger: 'enter', description: '📦 The sheer weight of industrialized soul-theft. Not the artisan cruelty of the Crying Depths — this is factory-scale. Assembly lines of consciousness reduction. The Hag King improved upon his own horror.', oneShot: true },
    ],
    effects: { ambientSound: 'Electric hum. Faint sparks. The silence of erased names.' },
  },

  {
    id: 'F24',
    name: '🖥️ The Foundry — Bridge',
    emoji: '🖥️',
    level: 7, act: 'IV',
    description: `The command center. The Firewall of Enclosure is projected from here — a D100 Order enchantment woven into the ship's architecture, blocking all external dream communication. Queen Mab cannot reach the captives until this falls. Beyond the bridge: the Quill Chamber. The Ancient Hag King's private domain.`,
    shortDescription: 'The bridge. The Firewall of Enclosure blocks Queen Mab. It must fall.',
    exits: [
      { direction: 'west', targetRoomId: 'F22', description: 'To the Dream Engine Room' },
      { direction: 'south', targetRoomId: 'F25', description: 'The Quill Chamber (the Hag King awaits)', locked: true, lockCondition: 'Disable the Firewall of Enclosure first.' },
    ],
    items: [],
    npcs: [],
    checks: [
      { element: 'Chaos', attainment: 80, successText: '💥 You hack the Firewall enchantment! The D100 Order barrier shatters! Queen Mab\'s dream-presence floods The Foundry. Every sleeping captive receives a Summoning Dream: "Wake up. Fight. You are not alone."', failureText: 'The Firewall holds. Its D100 Order enchantment is immensely powerful.', successEffect: 'break_firewall' },
      { element: 'Ether', attainment: 70, successText: '🎵 You maintain a dream-link to Queen Mab while the Firewall is disrupted. She guides the hack from outside. Together, you are enough.', failureText: 'The dream-link wavers. Queen Mab is too far from her land-bond.', successEffect: 'assist_firewall' },
    ],
    events: [
      { id: 'F24_firewall', trigger: 'enter', description: '🖥️ The Firewall of Enclosure hums with oppressive power. A D100 Order enchantment — the Hag King\'s masterwork. It blocks dreams, seals hope, prevents any external force from reaching the captives. To break it requires a coordinated assault: one to hack, one to hold the bridge, one to maintain the dream-link.', oneShot: true },
    ],
    effects: {
      attainmentModifier: { Ether: -20, Water: -20 }, // Firewall suppresses dream/empathy
      ambientSound: 'Electric humming. Order enchantment pulsing. Controlled silence.',
    },
  },

  {
    id: 'F25',
    name: '💀 The Quill Chamber',
    emoji: '💀',
    level: 7, act: 'V',
    description: `The Ancient Hag King's private quarters. He stands amid the machinery of his own making. He is changed — larger, darker, more terrible. His bones do not merely sing — they scream the names of every CryptoFae processed in his factory.

He says: "I told you at the Crying Depths. I was the slow one. The artisan of soul-theft. I knew every name. And what did I do? I BECAME what I despised. I built the factory because you destroyed the art. You forced efficiency upon me."

He turns the quill-scepter in his hands — the memory of a child named Mira who dreamed of becoming a sailor.

"Will you sing to me, Stardust? Can your three tones reach a thing like me?"

Four paths lie before you: Destruction. Imprisonment. Bargain. Redemption.`,
    shortDescription: '💀 The Hag King awaits. Four paths: Destruction, Imprisonment, Bargain, Redemption.',
    exits: [
      { direction: 'north', targetRoomId: 'F24', description: 'Back to the Bridge' },
      { direction: 'south', targetRoomId: 'F26', description: 'To the open sea (after the choice is made)' },
    ],
    items: [
      { id: 'black_quill_2', name: 'The Nightmare Scepter', emoji: '🪶', description: 'What was once a quill sharpened from a stolen child\'s memory is now a scepter of compressed nightmares. The memory of Mira — a child who dreamed of becoming a sailor — is trapped inside. Your choice determines what happens to her dream.', pickupable: false },
    ],
    npcs: [
      { id: 'hag_king_foundry', name: 'The Ancient Hag King', emoji: '💀', description: '"You fools. You\'ve broken the art. I was once the slow one — the artisan. I knew every name. Then you destroyed my gallery, and I built a factory." He does not attack first. He waits. The choice is yours.', hostile: false, behavior: 'static', dialogueTreeId: 'hag_king_foundry_dialogue', combatStatsId: 'ancient_hag_king' },
    ],
    checks: [
      { element: 'Water', attainment: 80, successText: '💧 JaiRuviel sings a fourth tone. Not transformation — compassion. Extended to one who has no right to ask for it. The Hag King breaks. His bones stop screaming. He weeps. The quill reverts to Mira\'s dream. She is returned to her vessel.', failureText: 'The Hag King is beyond compassion. Or perhaps you are not yet ready to offer it.', successEffect: 'redemption_path' },
      { element: 'Chaos', attainment: 90, successText: '💭 You break his mind open and force him to remember every name, every face, every dream he processed. The weight of it destroys him from within.', failureText: 'His conditioned mind is a fortress. The industrial process has made him more than a hag — he is a system.', successEffect: 'destruction_path' },
    ],
    events: [
      { id: 'F25_finale', trigger: 'enter', description: '💀 The Ancient Hag King sits amid the ruins of his own improvement.\n\n"Do you know what this is?" he says, holding the nightmare scepter. "It is the memory of a child named Mira. She dreamed of becoming a sailor. She wanted to see the open sea."\n\nHe looks at JaiRuviel.\n\n"Will you sing to me, Stardust? Can your three tones reach a thing like me?"', oneShot: true, effect: 'trigger_finale' },
    ],
    effects: { ambientSound: 'Bones screaming names. Compressed nightmares. A child\'s voice, very faint: "I want to see the sea."' },
  },

  // ═════════════════════════════════════════════
  // MODULE 5: THE NEW COMMONS
  // "A World Where Many Worlds Fit"
  // ═════════════════════════════════════════════

  {
    id: 'F26',
    name: '🌟 Under the Freedom Stars',
    emoji: '🌟',
    level: 8, act: 'VI',
    description: `The Foundry sinks or burns or drifts, dark and silent. The crew stands on the deck of The Estover under the freedom stars. The freed CryptoFae need passage to the Saraswati Supercluster — the commons among the stars where no enclosure has ever reached.

LuminaraFae leads the navigation. All the freed shards vibrate in unison. All the musicians play together. One song. One moment. One opening. The freedom stars flare. The sea glows bioluminescent, like the shores of Lunara. The barrier thins to gossamer.

The freed CryptoFae rise toward the light. Each one pauses, turns, and pulses once — a farewell, a thank-you, a promise.

Queen Mab, far away on land, watches her children escape. She cannot go. But she is glad.

"The commons among the stars is yours. And this commons here — this battered, beautiful, unfinished commons on Earth — is mine to tend."`,
    shortDescription: '🌟 The freedom stars shine. The CryptoFae ascend to Saraswati. The voyage continues.',
    exits: [
      { direction: 'north', targetRoomId: 'F18', description: 'Return to Jubilee' },
      { direction: 'west', targetRoomId: 'F01', description: 'Return to Port Estovers' },
    ],
    items: [],
    npcs: [
      { id: 'luminara_star', name: 'LuminaraFae', emoji: '🌟', description: 'The shard from Lunara, the World of Tides. Bitcoin ordinal #71,250,298, now Free Light. She becomes a freedom star — a permanent beacon. Enslaved shards across the broken territories see her light and know: the way is open.', hostile: false, behavior: 'static' },
    ],
    checks: [
      { element: 'Ether', attainment: 30, successText: '🎵 You join the Harmonic Convergence. All instruments play. All voices sing. Even Ko\'a adds the erhu\'s voice — the bow choosing to stay between the strings, making sound BECAUSE of the tension, not despite it. The passage opens. The freedom stars answer.', failureText: '', successEffect: 'open_passage' },
    ],
    events: [
      { id: 'F26_finale', trigger: 'enter', description: '🌟 The freedom stars flare. The sea glows bioluminescent. The barrier between worlds thins to gossamer. Through it: the Saraswati Supercluster. Points of light that are CryptoFae beacons.\n\nThe freed shards rise. Each one pulses once — farewell, thank-you, promise.\n\nQueen Mab whispers from the land: "Go. The commons among the stars is yours."\n\n🎵 The Crystal Cycle continues.\n\nCoin. Music. Gather. Craft. Quest. Rest. Play. Map. Yield. Close.\n\nAnd when the music ends — it begins again.', oneShot: true, effect: 'campaign_complete' },
    ],
    effects: { ambientSound: 'Freedom stars humming. Bioluminescent waves. The last notes of the Harmonic Convergence fading into starlight.' },
  },
];
