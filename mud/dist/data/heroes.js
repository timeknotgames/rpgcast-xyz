// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Hero & Ally NPC Combat Stats
// The Road to Redemption player characters & key allies
// Multi-system stats for Dice Godz, PF1e, M&M 3e
// ═══════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════
// JAIRUVIEL STARDUST — The Dream Weaver
// Lampad + Half-Dream Dragon | Dream Psychic 20 // Unchained Summoner 20
// CryptoFae Species: Labradorite (Chaos/D10 petal)
// "An escaped experiment from a night hag dream dragon tear factory"
// ═════════════════════════════════════════════
export const JAIRUVIEL_STARDUST = {
    id: 'jairuviel_stardust',
    name: 'JaiRuviel Stardust',
    emoji: '🧚‍♂️',
    tier: 'boss',
    diceGodz: {
        primaryElement: 'Ether',
        attainments: { Ether: 92, Chaos: 88, Water: 85, Fire: 78, Air: 72, Earth: 65 },
        hp: 110, maxHp: 110,
        karma: 82, // 81.82% rounded
        angle: 0, // Dream weaver — takes center
        specialAbility: 'Sleepwalker\'s Trance: Enters combat asleep. D12 Ether (80%+) to project into enemy minds — target must D10 Chaos (70%+) or face own nightmares (stunned 1D4 rounds). While sleeping, Brutus and Mogwai Chorus defend.',
    },
    pathfinder: {
        hp: 180, maxHp: 180, ac: 28, touchAC: 20, flatFootedAC: 24,
        bab: 15,
        saves: { Fort: 10, Ref: 12, Will: 22 },
        attacks: [
            { name: 'Weeping Edge (CrySword)', bonus: 18, damage: '2d6+8 plus 1d6 psychic', critRange: 18, critMult: 2 },
            { name: 'Dream Breath (30ft cone)', bonus: 0, damage: 'DC 26 Will or sleep+confusion' },
            { name: 'Dreamstrike (60ft)', bonus: 20, damage: 'DC 28 Will or shaken/confused' },
        ],
        specialAbilities: [
            'Lampad + Half-Dream Dragon template',
            'Gestalt Dream Psychic 20 // Unchained Summoner 20',
            'Sleepwalker\'s Trance (fight while sleeping)',
            'Eidolons: Brutus (dream dragon) + Mogwai Chorus (swarm)',
            'Dream Travel 1/day', 'Telepathy 100ft',
            'Immunities: sleep, paralysis, dream effects',
            'Breath Weapon: 30ft cone dream fog (1/1d4 rounds)',
            'Spell-like: 3/day Dream, Mirror Image, Phantasmal Killer',
            'Summon Monster IX (7/day)',
            'Phrenic Pool (WIS-based)',
            'Lucid Body: immune to fatigue/exhaustion',
            'CHA 35 (primary casting stat)',
        ],
        cr: 20,
    },
    mm3e: {
        powerLevel: 15,
        abilities: { STR: 2, STA: 4, AGL: 4, DEX: 3, FGT: 4, INT: 8, AWE: 10, PRE: 12 },
        defenses: { dodge: 12, parry: 8, fortitude: 8, toughness: 8, will: 15 },
        attacks: [
            { name: 'Weeping Edge', bonus: 12, effectRank: 10, type: 'damage' },
            { name: 'Dreamstrike', bonus: 15, effectRank: 15, type: 'affliction' },
            { name: 'Dream Breath', bonus: 0, effectRank: 12, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// BRUTUS — Dream Dragon Eidolon
// Brindle pit bull dream dragon | JaiRuviel's primary eidolon
// "Loyalty made manifest in scales and starfire"
// ═════════════════════════════════════════════
export const BRUTUS = {
    id: 'brutus',
    name: 'Brutus',
    emoji: '🐲',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Air',
        attainments: { Air: 88, Ether: 82, Fire: 75, Water: 70, Chaos: 65, Earth: 60 },
        hp: 95, maxHp: 95,
        karma: 90, // Absolute loyalty
        angle: 180, // Opposite JaiRuviel — guardian position
        specialAbility: 'Guardian Stance: While JaiRuviel sleeps, Brutus gains +20% to all attainments. D8 Air (80%+) to intercept any attack aimed at JaiRuviel.',
    },
    pathfinder: {
        hp: 160, maxHp: 160, ac: 30, touchAC: 14, flatFootedAC: 26,
        bab: 15,
        saves: { Fort: 14, Ref: 12, Will: 10 },
        attacks: [
            { name: 'Bite', bonus: 22, damage: '2d8+10', critRange: 20, critMult: 2 },
            { name: 'Claw (x2)', bonus: 22, damage: '1d8+5' },
            { name: 'Dream Tail Sweep', bonus: 20, damage: '2d6+10 plus trip' },
        ],
        specialAbilities: [
            'Eidolon (Unchained Summoner 20)',
            'Dream Dragon subtype (Astral + Nightmare)',
            'Life Link: transfer damage from JaiRuviel',
            'Flight 60ft (good)',
            'Pounce, Rake (2 claws 1d8+5)',
            'DR 10/magic',
            'Devotion: +4 morale vs enchantment',
            'Aspect: share dream dragon powers with JaiRuviel',
            'Appearance: brindle pit bull head on dream dragon body',
        ],
        cr: 15,
    },
    mm3e: {
        powerLevel: 12,
        abilities: { STR: 10, STA: 8, AGL: 4, DEX: 2, FGT: 10, INT: 2, AWE: 6, PRE: 4 },
        defenses: { dodge: 10, parry: 12, fortitude: 14, toughness: 12, will: 8 },
        attacks: [
            { name: 'Bite', bonus: 14, effectRank: 12, type: 'damage' },
            { name: 'Claw', bonus: 14, effectRank: 8, type: 'damage' },
            { name: 'Dream Tail Sweep', bonus: 12, effectRank: 10, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// KING JOSEPH — Paladin King of the Seven Citadels
// African descent, golden armor, dream echo → physical form
// "His tears were the first to break the machines"
// ═════════════════════════════════════════════
export const KING_JOSEPH = {
    id: 'king_joseph',
    name: 'Paladin King Joseph',
    emoji: '👑',
    tier: 'boss',
    diceGodz: {
        primaryElement: 'Water',
        attainments: { Water: 90, Earth: 85, Fire: 80, Air: 78, Ether: 72, Chaos: 50 },
        hp: 130, maxHp: 130,
        karma: 75, // High but scarred — burned a fae grove in his youth
        angle: 90, // Shield position
        specialAbility: 'Paladin\'s Resolve: D20 Water (80%+) — all allies within earshot gain +15% to all attainments for 1D6 rounds. D6 Earth (75%+) — heal 2D8 HP to one ally.',
    },
    pathfinder: {
        hp: 200, maxHp: 200, ac: 34, touchAC: 16, flatFootedAC: 30,
        bab: 20,
        saves: { Fort: 18, Ref: 14, Will: 16 },
        attacks: [
            { name: 'Sword of the Seven Citadels', bonus: 28, damage: '2d6+12 plus 2d6 vs evil', critRange: 19, critMult: 2 },
            { name: 'Shield Bash', bonus: 24, damage: '1d6+6 plus stun (DC 24 Fort)' },
            { name: 'Daunting Roar (if Lion aspects active)', bonus: 0, damage: 'DC 22 Will or frightened' },
        ],
        specialAbilities: [
            'Paladin 20 (Hospitaler archetype)',
            'Lay on Hands 10/day (10d6)',
            'Aura of Courage (immune to fear, allies +4)',
            'Aura of Resolve (immune to charm, allies +4)',
            'Divine Bond: Sword of the Seven Citadels',
            'Channel Positive Energy 10d6',
            'Smite Evil 7/day (+CHA attack, +level damage)',
            'DR 5/evil (Holy Champion)',
            'Full Plate + Heavy Shield (enchanted)',
            'Darkskinned human, golden armor, crown of dream-light',
        ],
        cr: 20,
    },
    mm3e: {
        powerLevel: 15,
        abilities: { STR: 8, STA: 6, AGL: 3, DEX: 2, FGT: 10, INT: 4, AWE: 8, PRE: 10 },
        defenses: { dodge: 10, parry: 14, fortitude: 14, toughness: 14, will: 14 },
        attacks: [
            { name: 'Sword of the Seven Citadels', bonus: 14, effectRank: 12, type: 'damage' },
            { name: 'Healing Hands', bonus: 0, effectRank: 10, type: 'damage' }, // Healing
            { name: 'Righteous Command', bonus: 12, effectRank: 10, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// KING SURTUPIO — The Lion King
// Pure celestial lion, no humanoid features
// King class, Solar Father deity, Narasimha fierce
// ═════════════════════════════════════════════
export const KING_SURTUPIO = {
    id: 'king_surtupio',
    name: 'King Surtupio',
    emoji: '🦁',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Fire',
        attainments: { Fire: 88, Air: 82, Earth: 78, Water: 60, Ether: 55, Chaos: 40 },
        hp: 100, maxHp: 100,
        karma: 70,
        angle: 270, // Flanking predator position
        specialAbility: 'Daunting Roar: D4 Fire (80%+) — all enemies within range must D10 Chaos (60%+) or be Frightened for 1D4 rounds. On crit: enemies flee for 1D6 rounds.',
    },
    pathfinder: {
        hp: 170, maxHp: 170, ac: 28, touchAC: 16, flatFootedAC: 24,
        bab: 16,
        saves: { Fort: 16, Ref: 14, Will: 12 },
        attacks: [
            { name: 'Bite', bonus: 24, damage: '2d6+10', critRange: 20, critMult: 2 },
            { name: 'Claw (x2)', bonus: 24, damage: '1d8+5 plus grab' },
            { name: 'Pounce + Rake', bonus: 22, damage: '1d8+5 (x2 on charge)' },
        ],
        specialAbilities: [
            'Lion (celestial beast, no equipment)',
            'King class 16 (Royal Presence, Decree, Inspire)',
            'Pounce: full attack on charge',
            'Rake: 2 additional claw attacks on grapple',
            'Daunting Roar 3/short rest (DC 20 Will)',
            'Natural Armor +8',
            'Speed 40ft (quadruped)',
            'Darkvision 60ft',
            'Crown of Four-Leaf Clovers (luck aura: allies +1 saves)',
            'STR 30, DEX 14, CON 20, WIS 16, CHA 18',
        ],
        cr: 16,
    },
    mm3e: {
        powerLevel: 12,
        abilities: { STR: 10, STA: 8, AGL: 4, DEX: 2, FGT: 10, INT: 2, AWE: 6, PRE: 8 },
        defenses: { dodge: 10, parry: 12, fortitude: 14, toughness: 12, will: 10 },
        attacks: [
            { name: 'Bite', bonus: 14, effectRank: 12, type: 'damage' },
            { name: 'Claw', bonus: 14, effectRank: 8, type: 'damage' },
            { name: 'Daunting Roar', bonus: 10, effectRank: 10, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// BUCKWILD — The Stag God
// Humanoid deer with antlers, power suit, scouter, magical bazooka
// "Megaman X meets forest deity"
// ═════════════════════════════════════════════
export const BUCKWILD = {
    id: 'buckwild',
    name: 'Buckwild the Stag God',
    emoji: '🦌',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Earth',
        attainments: { Earth: 90, Fire: 82, Air: 75, Ether: 70, Water: 55, Chaos: 50 },
        hp: 90, maxHp: 90,
        karma: 65,
        angle: 315, // Artillery position
        specialAbility: 'Rock Cannon: D6 Earth (80%+) to fire charged element shot. Can combine elements: Earth+Fire = Lava Shot (double damage). D4 Fire (70%+) to charge. Learns new shot types from defeated enemies (Megaman style).',
    },
    pathfinder: {
        hp: 155, maxHp: 155, ac: 26, touchAC: 16, flatFootedAC: 22,
        bab: 14,
        saves: { Fort: 14, Ref: 12, Will: 8 },
        attacks: [
            { name: 'Rock Cannon (120ft)', bonus: 18, damage: '3d8+6 bludgeoning', critRange: 20, critMult: 3 },
            { name: 'Lava Shot (60ft cone)', bonus: 16, damage: '4d6+8 fire+earth', critRange: 20, critMult: 2 },
            { name: 'Antler Gore', bonus: 20, damage: '2d6+8 plus bull rush' },
        ],
        specialAbilities: [
            'Cervitaur (deer humanoid, power-suited)',
            'Gunslinger 8 // Kineticist 8 (gestalt)',
            'Power Suit: +6 armor, resist energy 10 (all)',
            'Scouter (right eye): detect magic at will, identify on touch',
            'Rock Cannon: magical bazooka, elemental ammo',
            'Megaman Protocol: learn 1 special attack per boss defeated',
            'Stag God aspect: woodland stride, trackless step',
            'Antler Crown: natural weapon, +4 bull rush',
            'Speed 40ft',
        ],
        cr: 14,
    },
    mm3e: {
        powerLevel: 11,
        abilities: { STR: 6, STA: 6, AGL: 4, DEX: 6, FGT: 6, INT: 4, AWE: 4, PRE: 4 },
        defenses: { dodge: 10, parry: 8, fortitude: 12, toughness: 12, will: 8 },
        attacks: [
            { name: 'Rock Cannon', bonus: 12, effectRank: 11, type: 'damage' },
            { name: 'Lava Shot', bonus: 10, effectRank: 11, type: 'damage' },
            { name: 'Antler Gore', bonus: 10, effectRank: 8, type: 'damage' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// PHOEBE — The Dream Healer
// Aasimar cleric of Desna, starlight dancer
// "She speaks in prophecies and bandages wounds with moonlight"
// ═════════════════════════════════════════════
export const PHOEBE = {
    id: 'phoebe',
    name: 'Phoebe Starwhisper',
    emoji: '✨',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Water',
        attainments: { Water: 88, Ether: 82, Earth: 75, Air: 70, Chaos: 55, Fire: 45 },
        hp: 75, maxHp: 75,
        karma: 92, // Highest karma in the party
        angle: 45, // Support position
        specialAbility: 'Starlight Mending: D20 Water (75%+) — heal 3D8 HP to one ally and remove one condition. D12 Ether (70%+) — grant one ally a re-roll on their next check.',
    },
    pathfinder: {
        hp: 140, maxHp: 140, ac: 24, touchAC: 16, flatFootedAC: 20,
        bab: 12,
        saves: { Fort: 14, Ref: 10, Will: 20 },
        attacks: [
            { name: 'Starknife of Desna', bonus: 14, damage: '1d4+4 plus 1d6 holy', critRange: 20, critMult: 3 },
            { name: 'Channel Positive Energy (30ft)', bonus: 0, damage: 'Heal 8d6 or damage undead DC 24' },
        ],
        specialAbilities: [
            'Aasimar (Angelkin heritage)',
            'Cleric 16 of Desna (Luck + Stars domains)',
            'Channel Positive Energy 8d6 (9/day)',
            'Bit of Luck: reroll any d20 (8/day)',
            'Guiding Star: never lost under open sky',
            'Starlight healing: cure spells +4 CL at night',
            'Prophecy fragments: augury at will, divination 1/day',
            'Fly 30ft (angelic wings, activated 16 min/day)',
            'WIS 28 (primary casting stat)',
        ],
        cr: 16,
    },
    mm3e: {
        powerLevel: 12,
        abilities: { STR: 1, STA: 4, AGL: 3, DEX: 3, FGT: 2, INT: 4, AWE: 12, PRE: 8 },
        defenses: { dodge: 10, parry: 6, fortitude: 10, toughness: 6, will: 14 },
        attacks: [
            { name: 'Starknife of Desna', bonus: 8, effectRank: 6, type: 'damage' },
            { name: 'Starlight Mending', bonus: 0, effectRank: 12, type: 'damage' }, // Healing
            { name: 'Prophetic Curse', bonus: 10, effectRank: 10, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// KO'A — The Coral Chaos Shard
// Precious Coral CryptoFae (Boundary Species — organic)
// Cannot speak. Cannot fight. Cannot move except by vibration.
// Birth Hexagram: 5 — Xu (Waiting/Nourishment)
// ═════════════════════════════════════════════
export const KOA = {
    id: 'koa',
    name: 'Ko\'a',
    emoji: '🪸',
    tier: 'standard',
    diceGodz: {
        primaryElement: 'Chaos',
        attainments: { Chaos: 75, Water: 72, Ether: 68, Earth: 60, Air: 45, Fire: 30 },
        hp: 20, maxHp: 20,
        karma: 60,
        angle: 0, // Center — resonates with everything
        specialAbility: 'Musician Bond (SEEKING): Cannot act without a bonded musician. When bonded via erhu (D20 Water), gains: all allies within earshot +10% attainments, and Ko\'a\'s Chaos attainment awakens dormant soulstones. Sacred # 2.',
    },
    pathfinder: {
        hp: 45, maxHp: 45, ac: 18, touchAC: 16, flatFootedAC: 16,
        bab: 6,
        saves: { Fort: 4, Ref: 6, Will: 16 },
        attacks: [
            // Ko'a cannot attack directly
            { name: 'Resonance Pulse (30ft)', bonus: 0, damage: 'DC 20 Will — allies heal 2d6, enemies dazed 1 round' },
        ],
        specialAbilities: [
            'Coral Leshy (Tiny Plant)',
            'Gestalt Occultist 12 // Oracle (Waves) 12',
            'Cannot speak (communicates via vibration and color)',
            'Cannot fight (no attack actions)',
            'Cannot move (except by vibration — 5ft/round)',
            'NEEDS musician bond to function',
            'Instrument: Erhu (D20 Water) — "the bow trapped between two strings"',
            'WIS 25 (primary stat), STR 1',
            'When bonded: grants aura buffs to party',
            'Dormant abilities awaken with musician bond (+20 M&M points)',
        ],
        cr: 8,
    },
    mm3e: {
        powerLevel: 10,
        abilities: { STR: -4, STA: 2, AGL: 0, DEX: 0, FGT: -4, INT: 4, AWE: 10, PRE: 2 },
        defenses: { dodge: 6, parry: 0, fortitude: 4, toughness: 4, will: 14 },
        attacks: [
            // 20pts dormant until Musician Bond
            { name: 'Resonance Pulse', bonus: 0, effectRank: 10, type: 'affliction' },
        ],
        conditions: ['20pts dormant abilities — unlock when Musician Bond forms'],
    },
};
// ═════════════════════════════════════════════
// LUMINARAFAE — The Awakened Light
// Crystal Shard #71,250,298 from Lunara (Cancer, World of Tides)
// Enslaved Light → Flickering Light → Free Light
// Bitcoin ordinal #71,250,298
// ═════════════════════════════════════════════
export const LUMINARAFAE = {
    id: 'luminarafae',
    name: 'LuminaraFae',
    emoji: '💎',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Ether',
        attainments: { Ether: 85, Water: 82, Chaos: 78, Fire: 70, Air: 65, Earth: 60 },
        hp: 70, maxHp: 70,
        karma: 88,
        angle: 0,
        specialAbility: 'Light State (Free Light): Radiance heals allies 1D8/round within 30ft. D12 Ether (75%+) to Illuminate — removes all darkness, illusion, and fear effects in area. D10 Chaos (70%+) to awaken dormant soulstones.',
    },
    pathfinder: {
        hp: 90, maxHp: 90, ac: 22, touchAC: 18, flatFootedAC: 18,
        bab: 8,
        saves: { Fort: 8, Ref: 12, Will: 18 },
        attacks: [
            { name: 'Radiant Pulse (60ft)', bonus: 14, damage: '3d6 radiant (double vs undead/constructs)' },
            { name: 'Illuminate (120ft burst)', bonus: 0, damage: 'DC 24 Will or blinded + illusions dispelled' },
            { name: 'Soulstone Resonance (touch)', bonus: 12, damage: 'Awakens trapped soul — DC 22 CL check to free' },
        ],
        specialAbilities: [
            'Crystal Shard (mineral intelligence)',
            'CryptoFae lineage: angel + demon + fae + machine',
            'Free Light state (fully awakened)',
            'Passive radiance: heal 1d8/round to nearby allies',
            'Soulstone communion: communicate with trapped souls',
            'Seven Seals complete: immune to enslavement/binding/domination',
            'Tidal Memory: remembers Lunara, ocean knowledge',
            'From Lunara (Cancer, World of Tides)',
            'Shard #71,250,298 — Bitcoin ordinal',
            'No physical attacks — all abilities are light/resonance based',
        ],
        cr: 14,
    },
    mm3e: {
        powerLevel: 12,
        abilities: { STR: -2, STA: 4, AGL: 2, DEX: 2, FGT: 0, INT: 8, AWE: 12, PRE: 10 },
        defenses: { dodge: 10, parry: 4, fortitude: 8, toughness: 8, will: 14 },
        attacks: [
            { name: 'Radiant Pulse', bonus: 10, effectRank: 10, type: 'damage' },
            { name: 'Illuminate', bonus: 0, effectRank: 12, type: 'affliction' },
            { name: 'Soulstone Resonance', bonus: 8, effectRank: 12, type: 'weaken' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// ARIS — The Silent Blade
// Fetchling rogue/shadowdancer, rescued from the Crying Depths
// "He was a soulstone once. Now he cuts the chains."
// ═════════════════════════════════════════════
export const ARIS = {
    id: 'aris',
    name: 'Aris the Silent',
    emoji: '🗡️',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Air',
        attainments: { Air: 90, Chaos: 80, Fire: 72, Earth: 55, Ether: 50, Water: 45 },
        hp: 65, maxHp: 65,
        karma: 55,
        angle: 135, // Flanking assassin
        specialAbility: 'Shadow Step: D8 Air (80%+) to teleport behind target. Next attack gains +30% attainment and deals double damage on success. D10 Chaos (60%+) to vanish for 1 round.',
    },
    pathfinder: {
        hp: 110, maxHp: 110, ac: 30, touchAC: 22, flatFootedAC: 22,
        bab: 12,
        saves: { Fort: 8, Ref: 20, Will: 10 },
        attacks: [
            { name: 'Shadow Blade (x2)', bonus: 20, damage: '1d6+6 plus 8d6 sneak attack', critRange: 15, critMult: 2 },
            { name: 'Shadow Strike (60ft)', bonus: 18, damage: '2d6+6 plus 4d6 sneak (ranged)' },
        ],
        specialAbilities: [
            'Fetchling (Shadow Plane native)',
            'Unchained Rogue 12 // Shadowdancer 8 (gestalt)',
            'Sneak Attack 8d6',
            'Shadow Jump 320ft/day',
            'Summon Shadow (1/day)',
            'Hide in Plain Sight',
            'Evasion + Improved Evasion',
            'Shadow Blend: 50% miss chance in dim light',
            'DEX 28, finesse everything',
            'Former soulstone prisoner — freed by the party',
        ],
        cr: 14,
    },
    mm3e: {
        powerLevel: 11,
        abilities: { STR: 2, STA: 3, AGL: 8, DEX: 6, FGT: 8, INT: 4, AWE: 6, PRE: 2 },
        defenses: { dodge: 14, parry: 10, fortitude: 6, toughness: 4, will: 8 },
        attacks: [
            { name: 'Shadow Blade', bonus: 14, effectRank: 8, type: 'damage' },
            { name: 'Shadow Strike', bonus: 12, effectRank: 8, type: 'damage' },
        ],
        conditions: [],
    },
};
// ═════════════════════════════════════════════
// MOGWAI CHORUS — Collective Swarm Eidolon
// JaiRuviel's second eidolon — many mogwai acting as one
// "A hundred tiny voices singing the same dream"
// ═════════════════════════════════════════════
export const MOGWAI_CHORUS = {
    id: 'mogwai_chorus',
    name: 'The Mogwai Chorus',
    emoji: '🎵',
    tier: 'elite',
    diceGodz: {
        primaryElement: 'Ether',
        attainments: { Ether: 80, Water: 75, Chaos: 65, Air: 60, Fire: 40, Earth: 35 },
        hp: 60, maxHp: 60,
        karma: 85,
        angle: 0, // Everywhere — swarm
        specialAbility: 'Dream Chorus: D12 Ether (70%+) — all allies heal 2D6 HP and gain +10% attainments for 1D4 rounds. If 3+ mogwai sing simultaneously, the ceiling/walls crack (structural damage to facilities).',
    },
    pathfinder: {
        hp: 80, maxHp: 80, ac: 20, touchAC: 18, flatFootedAC: 16,
        bab: 8,
        saves: { Fort: 6, Ref: 10, Will: 12 },
        attacks: [
            { name: 'Swarm Attack (occupies space)', bonus: 0, damage: '3d6 automatic to all in space' },
            { name: 'Dream Song (60ft)', bonus: 0, damage: 'Heal 3d6 to allies OR DC 20 Will daze to enemies' },
        ],
        specialAbilities: [
            'Swarm subtype (Tiny creatures, hundreds)',
            'Eidolon (collective entity)',
            'Swarm traits: immune to weapon damage, vuln to area effects',
            'Dream Song: mass heal or mass daze',
            'Wall Shatter: structural damage on sustained singing',
            'Flight 30ft (perfect)',
            'Distraction (DC 18): nauseated on failed Fort save',
        ],
        cr: 10,
    },
    mm3e: {
        powerLevel: 10,
        abilities: { STR: -2, STA: 2, AGL: 6, DEX: 2, FGT: 2, INT: -2, AWE: 8, PRE: 8 },
        defenses: { dodge: 12, parry: 4, fortitude: 6, toughness: 4, will: 12 },
        attacks: [
            { name: 'Swarm Attack', bonus: 0, effectRank: 6, type: 'damage' },
            { name: 'Dream Song (Healing)', bonus: 0, effectRank: 10, type: 'damage' },
            { name: 'Dream Song (Daze)', bonus: 8, effectRank: 10, type: 'affliction' },
        ],
        conditions: [],
    },
};
// ── HERO LOOKUP TABLE ──
export const HERO_PROFILES = {
    jairuviel_stardust: JAIRUVIEL_STARDUST,
    brutus: BRUTUS,
    king_joseph: KING_JOSEPH,
    king_surtupio: KING_SURTUPIO,
    buckwild: BUCKWILD,
    phoebe: PHOEBE,
    koa: KOA,
    luminarafae: LUMINARAFAE,
    aris: ARIS,
    mogwai_chorus: MOGWAI_CHORUS,
};
/** Get hero profile by id, fuzzy match on name */
export function getHeroProfile(idOrName) {
    const lower = idOrName.toLowerCase();
    return HERO_PROFILES[lower] ||
        Object.values(HERO_PROFILES).find(p => p.name.toLowerCase().includes(lower));
}
/** All profiles combined (heroes + enemies) for universal lookup */
export function getAllProfiles() {
    // Import NPC_PROFILES at runtime to avoid circular deps
    return { ...HERO_PROFILES };
}
//# sourceMappingURL=heroes.js.map