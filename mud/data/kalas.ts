// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — 64 Kalas (Arts) + 14 Vidyas (Techniques)
// The classical skill system from Vedic tradition
// Each Kala uses 2 of the 8 core abilities (mapped to TEK8 elements)
// Source: Kama Sutra via sanskritimagazine.com; Quillverse adaptation
// ═══════════════════════════════════════════════════════════════

import type { Element } from '../engine/types.js';

// ── ABILITIES (8 core, mapped to dice/elements) ──

export type Ability = 'STR' | 'AGI' | 'END' | 'PER' | 'INT' | 'WIL' | 'CHA' | 'LCK';

export const ABILITY_ELEMENT: Record<Ability, Element> = {
  AGI: 'Fire',    // D4 — Sight
  END: 'Earth',   // D6 — Smell
  STR: 'Air',     // D8 — Touch
  WIL: 'Chaos',   // D10 — Mind
  PER: 'Ether',   // D12 — Sound
  CHA: 'Water',   // D20 — Taste/Empathy
  INT: 'Order',   // D100 — Focus (emergent)
  LCK: 'Coin',    // D2 — Instinct (emergent)
};

// ── KALA DEFINITION ──

export interface Kala {
  id: number;            // 1-64
  sanskrit: string;      // Original Sanskrit name
  english: string;       // English translation
  description: string;   // What this art encompasses
  abilities: [Ability, Ability]; // Two associated abilities
  element: Element;  // Primary elemental affinity
  category: KalaCategory;
}

export type KalaCategory =
  | 'performing'    // Kalas 1-12: music, dance, visual arts
  | 'social'        // Kalas 13-24: adornment, aromatics, illusion
  | 'intellectual'  // Kalas 25-36: language, crafting, literature
  | 'technical'     // Kalas 37-48: engineering, medicine, combat
  | 'mystical'      // Kalas 49-56: prophecy, mechanics, conversation
  | 'mastery';      // Kalas 57-64: discipline, victory, awakening

// ── THE 64 KALAS ──

export const KALAS: Kala[] = [
  // ═══ PERFORMING ARTS (1-12) ═══
  { id: 1,  sanskrit: 'Gita Vidya',             english: 'Singing',           description: 'Art of song — voice as instrument of creation',                  abilities: ['CHA', 'PER'], element: 'Fire',  category: 'performing' },
  { id: 2,  sanskrit: 'Vadya Vidya',            english: 'Instruments',       description: 'Art of playing musical instruments',                             abilities: ['AGI', 'PER'], element: 'Ether', category: 'performing' },
  { id: 3,  sanskrit: 'Nritya Vidya',           english: 'Dancing',           description: 'Art of dance — body as expression of spirit',                     abilities: ['AGI', 'CHA'], element: 'Fire',  category: 'performing' },
  { id: 4,  sanskrit: 'Natya Vidya',            english: 'Theatrics',         description: 'Art of drama, roleplay, and theatrical performance',              abilities: ['CHA', 'INT'], element: 'Fire',  category: 'performing' },
  { id: 5,  sanskrit: 'Alekhya Vidya',          english: 'Painting',          description: 'Art of visual creation — image, color, form',                     abilities: ['AGI', 'PER'], element: 'Fire',  category: 'performing' },
  { id: 6,  sanskrit: 'Viseshakacchedya Vidya', english: 'Body Art',          description: 'Art of painting face and body with color',                        abilities: ['AGI', 'CHA'], element: 'Fire',  category: 'performing' },
  { id: 7,  sanskrit: 'Tandula-kusuma-bali',    english: 'Offerings',         description: 'Art of preparing sacred offerings from rice and flowers',          abilities: ['WIL', 'PER'], element: 'Earth', category: 'performing' },
  { id: 8,  sanskrit: 'Pushpastarana',          english: 'Flower Beds',       description: 'Art of making flower coverings and arrangements',                 abilities: ['AGI', 'PER'], element: 'Earth', category: 'performing' },
  { id: 9,  sanskrit: 'Dasana-vasananga-raga',  english: 'Adornment',         description: 'Art of personal preparation and body painting',                   abilities: ['AGI', 'CHA'], element: 'Water', category: 'performing' },
  { id: 10, sanskrit: 'Mani-bhumika-karma',     english: 'Jewelry Setting',   description: 'Art of making the groundwork of jewels',                          abilities: ['AGI', 'INT'], element: 'Earth', category: 'performing' },
  { id: 11, sanskrit: 'Aayya-racana',           english: 'Bed Covering',      description: 'Art of arranging coverings and comfort',                          abilities: ['AGI', 'PER'], element: 'Earth', category: 'performing' },
  { id: 12, sanskrit: 'Udaka-vadya',            english: 'Water Music',       description: 'Art of playing music in water — sacred sound meets sacred element', abilities: ['AGI', 'PER'], element: 'Water', category: 'performing' },

  // ═══ SOCIAL ARTS (13-24) ═══
  { id: 13, sanskrit: 'Udaka-ghata',            english: 'Water Play',        description: 'Art of splashing water — joy and purification',                   abilities: ['AGI', 'END'], element: 'Water', category: 'social' },
  { id: 14, sanskrit: 'Citra-yoga',             english: 'Color Mixing',      description: 'Art of admixture of colors — alchemical combination',             abilities: ['INT', 'PER'], element: 'Fire',  category: 'social' },
  { id: 15, sanskrit: 'Malya-grathana',         english: 'Wreath Design',     description: 'Art of designing wreaths and garlands',                           abilities: ['AGI', 'PER'], element: 'Earth', category: 'social' },
  { id: 16, sanskrit: 'Sekharapida-yojana',     english: 'Coronet Setting',   description: 'Art of setting the coronet upon the head',                        abilities: ['AGI', 'CHA'], element: 'Ether', category: 'social' },
  { id: 17, sanskrit: 'Nepathya-yoga',          english: 'Costume Design',    description: 'Art of theatrical dressing and costume',                          abilities: ['AGI', 'CHA'], element: 'Fire',  category: 'social' },
  { id: 18, sanskrit: 'Karnapatra-bhanga',      english: 'Ear Decoration',    description: 'Art of decorating the tragus of the ear',                         abilities: ['AGI', 'PER'], element: 'Ether', category: 'social' },
  { id: 19, sanskrit: 'Sugandha-yukti',         english: 'Aromatics',         description: 'Art of application of perfumes and aromatics',                    abilities: ['PER', 'INT'], element: 'Earth', category: 'social' },
  { id: 20, sanskrit: 'Bhushana-yojana',        english: 'Ornament Setting',  description: 'Art of applying or setting ornaments',                            abilities: ['AGI', 'PER'], element: 'Earth', category: 'social' },
  { id: 21, sanskrit: 'Aindra-jala',            english: 'Illusion',          description: 'Art of juggling and creating spectacle',                          abilities: ['INT', 'WIL'], element: 'Chaos', category: 'social' },
  { id: 22, sanskrit: 'Kaucumara',              english: 'Kaucumara',         description: 'A mystical art — transformation and transmutation',               abilities: ['INT', 'WIL'], element: 'Chaos', category: 'social' },
  { id: 23, sanskrit: 'Hasta-laghava',          english: 'Sleight of Hand',   description: 'Art of dexterity, prestidigitation, and misdirection',            abilities: ['AGI', 'INT'], element: 'Chaos', category: 'social' },
  { id: 24, sanskrit: 'Citra-sakapupa',         english: 'Culinary Arts',     description: 'Art of preparing varieties of delicious food',                    abilities: ['PER', 'INT'], element: 'Earth', category: 'social' },

  // ═══ INTELLECTUAL ARTS (25-36) ═══
  { id: 25, sanskrit: 'Panaka-rasa',            english: 'Drink Making',      description: 'Art of preparing palatable drinks and draughts',                  abilities: ['PER', 'INT'], element: 'Water', category: 'intellectual' },
  { id: 26, sanskrit: 'Suci-vaya-karma',        english: 'Needlework',        description: 'Art of needlework and weaving — thread as creation',              abilities: ['AGI', 'PER'], element: 'Air',   category: 'intellectual' },
  { id: 27, sanskrit: 'Sutra-krida',            english: 'Thread Games',      description: 'Art of playing with thread — patterns of connection',             abilities: ['AGI', 'INT'], element: 'Air',   category: 'intellectual' },
  { id: 28, sanskrit: 'Vina-damuraka-vadya',    english: 'Lute & Drum',       description: 'Art of playing lute and small drum together',                     abilities: ['AGI', 'PER'], element: 'Ether', category: 'intellectual' },
  { id: 29, sanskrit: 'Prahelika',              english: 'Riddles',           description: 'Art of making and solving riddles',                               abilities: ['INT', 'WIL'], element: 'Chaos', category: 'intellectual' },
  { id: 30, sanskrit: 'Durvacaka-yoga',         english: 'Difficult Speech',  description: 'Art of language difficult to answer — rhetoric and debate',        abilities: ['INT', 'CHA'], element: 'Air',   category: 'intellectual' },
  { id: 31, sanskrit: 'Pustaka-vacana',         english: 'Book Recitation',   description: 'Art of reciting books — oral tradition and memory',               abilities: ['INT', 'CHA'], element: 'Ether', category: 'intellectual' },
  { id: 32, sanskrit: 'Natikakhyayika',         english: 'Short Plays',       description: 'Art of enacting short plays and anecdotes',                       abilities: ['CHA', 'INT'], element: 'Fire',  category: 'intellectual' },
  { id: 33, sanskrit: 'Kavya-samasya-purana',   english: 'Verse Solving',     description: 'Art of solving enigmatic verses',                                 abilities: ['INT', 'PER'], element: 'Ether', category: 'intellectual' },
  { id: 34, sanskrit: 'Pattika-vetra-bana',     english: 'Shield Craft',      description: 'Art of designing shields, canes, and arrows',                     abilities: ['STR', 'AGI'], element: 'Air',   category: 'intellectual' },
  { id: 35, sanskrit: 'Tarku-karma',            english: 'Spinning',          description: 'Art of spinning by spindle — material transformation',            abilities: ['AGI', 'END'], element: 'Earth', category: 'intellectual' },
  { id: 36, sanskrit: 'Takshana',               english: 'Carpentry',         description: 'Art of working with wood — shaping the world',                    abilities: ['STR', 'INT'], element: 'Earth', category: 'intellectual' },

  // ═══ TECHNICAL ARTS (37-48) ═══
  { id: 37, sanskrit: 'Vastu-vidya',            english: 'Engineering',       description: 'Art of architecture and structural design',                       abilities: ['INT', 'STR'], element: 'Order', category: 'technical' },
  { id: 38, sanskrit: 'Raupya-ratna-pariksha',  english: 'Metal Testing',     description: 'Art of testing silver and jewels',                                abilities: ['PER', 'INT'], element: 'Earth', category: 'technical' },
  { id: 39, sanskrit: 'Dhatu-vada',             english: 'Metallurgy',        description: 'Art of working with metals — forge and flame',                    abilities: ['STR', 'INT'], element: 'Fire',  category: 'technical' },
  { id: 40, sanskrit: 'Mani-raga-jnana',        english: 'Gem Tinting',       description: 'Art of tinting and enhancing gemstones',                          abilities: ['PER', 'AGI'], element: 'Earth', category: 'technical' },
  { id: 41, sanskrit: 'Akara-jnana',            english: 'Mineralogy',        description: 'Art of knowing minerals — the language of stone',                 abilities: ['INT', 'PER'], element: 'Earth', category: 'technical' },
  { id: 42, sanskrit: 'Vrikshayur-veda-yoga',   english: 'Herbal Medicine',   description: 'Art of medical treatment by herbs — plant wisdom',                abilities: ['INT', 'WIL'], element: 'Earth', category: 'technical' },
  { id: 43, sanskrit: 'Mesha-kukkuta-yuddha',   english: 'Animal Combat',     description: 'Art of knowing modes of animal fighting',                         abilities: ['PER', 'WIL'], element: 'Chaos', category: 'technical' },
  { id: 44, sanskrit: 'Suka-sarika-pralapana',  english: 'Bird Speech',       description: 'Art of knowing conversation of birds',                            abilities: ['PER', 'CHA'], element: 'Air',   category: 'technical' },
  { id: 45, sanskrit: 'Utsadana',               english: 'Massage',           description: 'Art of healing with perfumes and touch',                          abilities: ['AGI', 'PER'], element: 'Water', category: 'technical' },
  { id: 46, sanskrit: 'Kesa-marjana-kausala',   english: 'Hair Styling',      description: 'Art of combing and styling hair',                                 abilities: ['AGI', 'CHA'], element: 'Water', category: 'technical' },
  { id: 47, sanskrit: 'Akshara-mushtika',       english: 'Finger Speech',     description: 'Art of talking with fingers — silent communication',              abilities: ['AGI', 'INT'], element: 'Air',   category: 'technical' },
  { id: 48, sanskrit: 'Dharana-matrika',        english: 'Amulet Craft',      description: 'Art of making and using protective amulets',                      abilities: ['WIL', 'INT'], element: 'Ether', category: 'technical' },

  // ═══ MYSTICAL ARTS (49-56) ═══
  { id: 49, sanskrit: 'Desa-bhasha-jnana',      english: 'Dialects',          description: 'Art of knowing provincial and foreign languages',                 abilities: ['INT', 'CHA'], element: 'Air',   category: 'mystical' },
  { id: 50, sanskrit: 'Nirmiti-jnana',          english: 'Prophecy',          description: 'Art of prediction by heavenly voice — divination',                abilities: ['PER', 'WIL'], element: 'Ether', category: 'mystical' },
  { id: 51, sanskrit: 'Yantra-matrika',         english: 'Mechanics',         description: 'Art of machines and mechanical devices',                          abilities: ['INT', 'AGI'], element: 'Order', category: 'mystical' },
  { id: 52, sanskrit: 'Mlecchita-kutarka',      english: 'Foreign Logic',     description: 'Art of foreign sophistry — understanding alien thought',          abilities: ['INT', 'WIL'], element: 'Chaos', category: 'mystical' },
  { id: 53, sanskrit: 'Samvacya',               english: 'Conversation',      description: 'Art of conversation — the sacred exchange of ideas',              abilities: ['CHA', 'INT'], element: 'Air',   category: 'mystical' },
  { id: 54, sanskrit: 'Manasi-kavya-kriya',     english: 'Mental Poetry',     description: 'Art of composing verse in the mind',                              abilities: ['INT', 'PER'], element: 'Ether', category: 'mystical' },
  { id: 55, sanskrit: 'Kriya-vikalpa',          english: 'Literary Design',   description: 'Art of designing literary or medicinal works',                    abilities: ['INT', 'WIL'], element: 'Order', category: 'mystical' },
  { id: 56, sanskrit: 'Chalitaka-yoga',         english: 'Shrine Building',   description: 'Art of constructing sacred spaces and shrines',                   abilities: ['STR', 'WIL'], element: 'Ether', category: 'mystical' },

  // ═══ MASTERY ARTS (57-64) ═══
  { id: 57, sanskrit: 'Abhidhana-kosha',        english: 'Lexicography',      description: 'Art of lexicography and knowledge of meters',                     abilities: ['INT', 'PER'], element: 'Order', category: 'mastery' },
  { id: 58, sanskrit: 'Vastra-gopana',          english: 'Cloth Concealment', description: 'Art of concealing cloths — the hidden and the revealed',          abilities: ['AGI', 'INT'], element: 'Chaos', category: 'mastery' },
  { id: 59, sanskrit: 'Dyuta-visesha',          english: 'Gambling',          description: 'Art of knowing games of chance — reading probability',            abilities: ['INT', 'LCK'], element: 'Coin', category: 'mastery' },
  { id: 60, sanskrit: 'Akarsha-krida',          english: 'Dice & Magnet',     description: 'Art of dice games and magnetic attraction',                       abilities: ['LCK', 'WIL'], element: 'Coin', category: 'mastery' },
  { id: 61, sanskrit: 'Balaka-kridanaka',       english: "Children's Toys",   description: 'Art of using toys — play as education and joy',                   abilities: ['AGI', 'CHA'], element: 'Water', category: 'mastery' },
  { id: 62, sanskrit: 'Vainayiki Vidya',        english: 'Discipline',        description: 'Art of enforcing discipline — order through wisdom',              abilities: ['WIL', 'INT'], element: 'Order', category: 'mastery' },
  { id: 63, sanskrit: 'Vaijayiki Vidya',        english: 'Victory',           description: 'Art of gaining victory — strategy and triumph',                   abilities: ['STR', 'WIL'], element: 'Air',   category: 'mastery' },
  { id: 64, sanskrit: 'Vaitaliki Vidya',        english: 'Dawn Music',        description: 'Art of awakening the master with music at dawn',                  abilities: ['PER', 'CHA'], element: 'Ether', category: 'mastery' },
];

// ── THE 14 VIDYAS (Techniques / Knowledge Systems) ──

export interface Vidya {
  id: number;
  sanskrit: string;
  english: string;
  description: string;
  category: 'veda' | 'upaveda' | 'vedanga';
  abilities: [Ability, Ability];
  element: Element;
}

export const VIDYAS: Vidya[] = [
  // 4 Vedas
  { id: 1,  sanskrit: 'RigVeda',      english: 'Hymns of Knowledge',    description: 'The oldest Veda — hymns of cosmic truth',                  category: 'veda',    abilities: ['PER', 'WIL'], element: 'Ether' },
  { id: 2,  sanskrit: 'SamVeda',      english: 'Hymns of Melody',       description: 'The Veda of song — music as divine communication',          category: 'veda',    abilities: ['PER', 'CHA'], element: 'Ether' },
  { id: 3,  sanskrit: 'YajurVeda',    english: 'Hymns of Ritual',       description: 'The Veda of ritual action — sacred procedure',              category: 'veda',    abilities: ['WIL', 'INT'], element: 'Order' },
  { id: 4,  sanskrit: 'AtharvaVeda',  english: 'Hymns of Magic',        description: 'The Veda of practical magic — herbs, spells, healing',      category: 'veda',    abilities: ['WIL', 'PER'], element: 'Chaos' },
  // 4 UpaVedas
  { id: 5,  sanskrit: 'ArthaShastra', english: 'Statecraft',            description: 'Treatise on governance, economy, and strategy',             category: 'upaveda', abilities: ['INT', 'WIL'], element: 'Order' },
  { id: 6,  sanskrit: 'Dhanurveda',   english: 'Archery Science',       description: 'Science of archery and ranged combat',                     category: 'upaveda', abilities: ['AGI', 'PER'], element: 'Air' },
  { id: 7,  sanskrit: 'GandharvaVeda', english: 'Performing Arts',      description: 'Treatise on theatre, dance, and music',                    category: 'upaveda', abilities: ['CHA', 'PER'], element: 'Ether' },
  { id: 8,  sanskrit: 'Ayurveda',     english: 'Life Science',          description: 'Science of longevity and holistic healing',                 category: 'upaveda', abilities: ['INT', 'PER'], element: 'Earth' },
  // 6 Vedangas
  { id: 9,  sanskrit: 'Shiksha',      english: 'Phonetics',             description: 'Science of correct pronunciation and sound',                category: 'vedanga', abilities: ['PER', 'INT'], element: 'Air' },
  { id: 10, sanskrit: 'Kalpa',        english: 'Ritual Art',            description: 'Art of performing rituals correctly',                       category: 'vedanga', abilities: ['WIL', 'INT'], element: 'Ether' },
  { id: 11, sanskrit: 'Vyakaran',     english: 'Grammar',               description: 'Sanskrit grammatical tradition — structure of language',    category: 'vedanga', abilities: ['INT', 'PER'], element: 'Order' },
  { id: 12, sanskrit: 'Nirukta',      english: 'Etymology',             description: 'Origins of words — the roots of meaning',                  category: 'vedanga', abilities: ['INT', 'PER'], element: 'Order' },
  { id: 13, sanskrit: 'Chhanda',      english: 'Metrics',               description: 'Study of poetic meters — rhythm as structure',              category: 'vedanga', abilities: ['PER', 'INT'], element: 'Ether' },
  { id: 14, sanskrit: 'Jyotish',      english: 'Astrology',             description: 'System of star-reading, astronomy, and prediction',         category: 'vedanga', abilities: ['INT', 'PER'], element: 'Ether' },
];

// ── CUSTOM SKILL SLOT ──
// 64 slots for campaign-specific or character-specific skills

export interface CustomSkill {
  slotId: number;          // C1-C64
  name: string;
  description: string;
  abilities: [Ability, Ability];
  element: Element;
  affinity: 'major' | 'minor' | 'standard';
  baseValue: number;       // Average of two abilities (0-20)
  currentValue: number;    // After training/XP
  xp: number;
}

export function createCustomSkill(
  slotId: number,
  name: string,
  description: string,
  abilities: [Ability, Ability],
  element: Element,
  affinity: 'major' | 'minor' | 'standard' = 'standard',
): CustomSkill {
  return {
    slotId,
    name,
    description,
    abilities,
    element,
    affinity,
    baseValue: 0,
    currentValue: 0,
    xp: 0,
  };
}

// ── SPECIES DEFINITION ──
// For the 64 Gemstone Species + custom species

export interface GemstoneSpecies {
  speciesId: string;         // e.g. 'ruby', 'labradorite', 'coral'
  name: string;
  emoji: string;
  petal: Element;        // Which TEK8 petal (determines lower trigram)
  hexagramNumber: number;    // 1-64 (I Ching mapping)
  description: string;
  kalaAffinity: number;      // Which Kala (1-64) this species has natural bonus in
  vidyaAffinity?: number;    // Optional Vidya affinity
  abilityBonus: Partial<Record<Ability, number>>; // Stat bonuses
  isBoundary: boolean;       // One of the 7 boundary species?
  // Cross-system support
  pf1eRaceTraits?: string[]; // Pathfinder 1e racial traits
  mm3eTemplate?: string;     // M&M 3e power template
}

// ── SKILL RESOLUTION ──

export interface SkillCheckResult {
  success: boolean;
  roll: number;
  target: number;
  margin: number;
  critical: boolean;
  narrative: string;
}

/** Roll D100 vs skill value (roll under = success) */
export function kalaCheck(skillValue: number, difficulty: number = 0): SkillCheckResult {
  const target = Math.max(1, skillValue - difficulty);
  const roll = Math.floor(Math.random() * 100) + 1;
  const success = roll <= target;
  const critical = roll <= Math.floor(target / 10) || roll === 1;
  const margin = target - roll;

  return {
    success,
    roll,
    target,
    margin,
    critical,
    narrative: critical && success
      ? `🌟 MASTERY! D100: ${roll} vs ${target} — Extraordinary success!`
      : success
        ? `✅ D100: ${roll} vs ${target} — Success (margin: +${margin})`
        : `❌ D100: ${roll} vs ${target} — Failed (margin: ${margin})`,
  };
}

// ── LOOKUP HELPERS ──

export function getKala(id: number): Kala | undefined {
  return KALAS.find(k => k.id === id);
}

export function getKalaByName(name: string): Kala | undefined {
  const lower = name.toLowerCase();
  return KALAS.find(k =>
    k.english.toLowerCase().includes(lower) ||
    k.sanskrit.toLowerCase().includes(lower)
  );
}

export function getVidya(id: number): Vidya | undefined {
  return VIDYAS.find(v => v.id === id);
}

export function getKalasByElement(element: Element): Kala[] {
  return KALAS.filter(k => k.element === element);
}

export function getKalasByCategory(category: KalaCategory): Kala[] {
  return KALAS.filter(k => k.category === category);
}

/** Render a Kala for display in the MUD */
export function renderKala(kala: Kala): string {
  return `[${kala.id}] ${kala.sanskrit} — ${kala.english}\n    ${kala.description}\n    Abilities: ${kala.abilities.join(' + ')} | Element: ${kala.element} | Category: ${kala.category}`;
}

/** Render all Kalas grouped by category */
export function renderKalaList(): string {
  const categories: KalaCategory[] = ['performing', 'social', 'intellectual', 'technical', 'mystical', 'mastery'];
  const lines: string[] = ['═══ THE 64 KALAS (Sacred Arts) ═══\n'];

  for (const cat of categories) {
    const kalas = getKalasByCategory(cat);
    lines.push(`── ${cat.toUpperCase()} ──`);
    for (const k of kalas) {
      lines.push(`  [${k.id}] ${k.sanskrit} — ${k.english} (${k.abilities.join('+')})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
