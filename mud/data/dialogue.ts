// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Dialogue Trees
// NPC conversations with branching choices
// ═══════════════════════════════════════════════════════════════

import type { DialogueTree } from '../engine/types.js';

// ── KING JOSEPH — Appears as dream echo in R04 (Weeping Alcove) ──
export const JOSEPH_DIALOGUE: DialogueTree = {
  id: 'dialogue_joseph',
  npcId: 'joseph_echo',
  startNodeId: 'j_start',
  nodes: {
    j_start: {
      id: 'j_start',
      speaker: 'King Joseph',
      emoji: '👑',
      text: 'A translucent figure shimmers into focus — a dark-skinned king in golden armor, his crown wreathed in dream-light. His eyes hold both sorrow and resolve.\n\n"You have come to the Crying Depths. I am Joseph, once king of the Seven Citadels. My form is only an echo now — trapped in soulstone, my body held below. But my purpose endures."',
      choices: [
        { text: '"What happened to you?"', nextNodeId: 'j_story' },
        { text: '"How do we stop the Night Hags?"', nextNodeId: 'j_plan' },
        { text: '"Where are the mogwai children?"', nextNodeId: 'j_mogwai' },
      ],
    },
    j_story: {
      id: 'j_story',
      speaker: 'King Joseph',
      emoji: '👑',
      text: '"The Night Hag Syndicate came to my kingdom with trade and treaties. Soulstone — they called it dream-crystal. A revolution in magic. I did not see the cost until my own people were dissolving into the stones."\n\nHis form flickers.\n\n"The Ancient Hag King — the Father of the Coven — he is not merely a hag. He is something older. Something that remembers when names had power over existence itself."',
      choices: [
        { text: '"The Hag King erases names?"', nextNodeId: 'j_names' },
        { text: '"How do we stop them?"', nextNodeId: 'j_plan' },
      ],
    },
    j_names: {
      id: 'j_names',
      speaker: 'King Joseph',
      emoji: '👑',
      text: '"His quill writes in the language before language. When he inscribes your name, you do not die — you are *unwritten*. You cease to have ever been. That is worse than death. That is anti-creation."\n\nHe reaches toward you but his hand passes through.\n\n"I was half-erased. My kingdom still stands but none remember I built it. Only dream-echoes like this one preserve the truth."',
      choices: [
        { text: '"We will restore your name."', nextNodeId: 'j_hope' },
        { text: '"Tell me about the Facility."', nextNodeId: 'j_plan' },
      ],
    },
    j_plan: {
      id: 'j_plan',
      speaker: 'King Joseph',
      emoji: '👑',
      text: '"Three things you must know:\n\n1. The RAIN CHAMBERS on Level 2 process dreams into raw material. Destroy or corrupt them.\n2. The HEXCODE MILL assigns numbers to souls. The recipe there can be reversed.\n3. The DREAM SPLICE on Level 3 powers everything. It feeds on a trapped Proto-Dream Dragon.\n\nFree the dragon, and the Facility collapses. But the Hag King will not allow it peacefully."',
      choices: [
        { text: '"Where are the mogwai?"', nextNodeId: 'j_mogwai' },
        { text: '"Thank you, King Joseph."', nextNodeId: 'j_farewell' },
      ],
      effect: 'set_flag:joseph_briefed',
    },
    j_mogwai: {
      id: 'j_mogwai',
      speaker: 'King Joseph',
      emoji: '👑',
      text: '"The mogwai nurseries are on Level 3 — rooms to the west and east of the Eidolon Chorus Hall. The children are fed *midnight bread* that corrupts them into gremlins — obedient, violent, forgetful of what they were."\n\nHis voice breaks.\n\n"But there is a recipe — a Recipe of Reversal — in the Hexcode Mill on Level 2. It can undo the corruption. Find it. Save them."',
      choices: [
        { text: '"We will save every one of them."', nextNodeId: 'j_hope' },
        { text: '"Tell me about the Facility layout."', nextNodeId: 'j_plan' },
      ],
      effect: 'set_flag:knows_mogwai_location',
    },
    j_hope: {
      id: 'j_hope',
      speaker: 'King Joseph',
      emoji: '👑',
      text: 'The echo brightens. For a moment, the king is fully visible — proud, alive, real.\n\n"Then the dream endures. I will watch from within the stone. When the time comes... play music near my soulstone. The stones remember what the flesh forgets."\n\nHe raises his hand in blessing.\n\n"May Desna guide your dreaming."',
      effect: 'set_flag:joseph_blessing',
    },
    j_farewell: {
      id: 'j_farewell',
      speaker: 'King Joseph',
      emoji: '👑',
      text: '"Go with light, even in this darkness. And remember — the Hag King fears music more than any blade. The CrySwords were forged from singing crystal for a reason."\n\nThe echo fades.',
      effect: 'set_flag:joseph_farewell',
    },
  },
};

// ── MOGWAI CHILD — R20/R21 (Nurseries) ──
export const MOGWAI_DIALOGUE: DialogueTree = {
  id: 'dialogue_mogwai',
  npcId: 'mogwai_child',
  startNodeId: 'm_start',
  nodes: {
    m_start: {
      id: 'm_start',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: 'A tiny creature — part dragon, part dream-wisp — huddles in the corner of the cage. Its scales shimmer between states of matter. It looks up at you with enormous eyes that contain entire starfields.\n\n"...not bread time? Not... bread...?"',
      choices: [
        { text: '"No bread. We are here to help you."', nextNodeId: 'm_trust' },
        { text: '"What is the bread?"', nextNodeId: 'm_bread' },
        { text: '[Play music]', nextNodeId: 'm_music', condition: 'has_instrument' },
      ],
    },
    m_trust: {
      id: 'm_trust',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: 'The mogwai tilts its head. A faint song rises from its throat — not quite sound, not quite light. Dream-song.\n\n"The... the singing ones? The Matron said the singing ones would never come. She said we would forget. But I... I remember a sound. Like..."\n\nIt hums a note that makes the soulstones nearby vibrate.',
      choices: [
        { text: '"What do you remember?"', nextNodeId: 'm_memory' },
        { text: '[Offer food that isn\'t midnight bread]', nextNodeId: 'm_feed' },
      ],
    },
    m_bread: {
      id: 'm_bread',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: '"Midnight bread. It makes us... different. Hungry-different. Angry-different. The ones who eat enough become..." It looks at a larger cage across the room where something snarls.\n\n"...become NOT-US. Gremlins. They do what the hags say. They forget the dream-songs. They forget the sky."',
      choices: [
        { text: '"We have a recipe to fix the bread."', nextNodeId: 'm_recipe', condition: 'has_recipe_of_reversal' },
        { text: '"We\'ll get you out of here."', nextNodeId: 'm_escape' },
      ],
    },
    m_music: {
      id: 'm_music',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: 'As the first notes fill the nursery, the mogwai\'s eyes widen. It rises from the floor, wings spreading involuntarily. All around the room, caged mogwai begin to hum — a harmony that builds and builds.\n\nThe cages vibrate. Dream-mucus on the walls begins to crystallize and crack.\n\n"THE SKY-SONG! You know the sky-song! The song from BEFORE!"',
      effect: 'set_flag:mogwai_awakened',
    },
    m_memory: {
      id: 'm_memory',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: '"Before the cages, there was... flying? No. Before that. Before the egg. There was a big voice. Like the whole world singing at once. And then... smaller voices. Like us. All singing together."\n\nIt clutches its tiny claws together.\n\n"The Matron said it was just a dream. But we ARE dreams. How can dreams have false dreams?"',
      choices: [
        { text: '"Your memory is real. You were free."', nextNodeId: 'm_escape' },
      ],
    },
    m_feed: {
      id: 'm_feed',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: 'The mogwai sniffs cautiously... then eagerly devours the offered food. Its scales brighten perceptibly.\n\n"Not... bitter. Not midnight. This is... this is..." It struggles for a word it has never learned. "Good? Is that the word? GOOD?"',
      effect: 'set_flag:mogwai_fed',
    },
    m_recipe: {
      id: 'm_recipe',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: '"Fix the bread? UN-gremlin them?"\n\nThe mogwai begins to bounce, dream-light cascading from its wings.\n\n"The big ones — the gremlins — they still sing in their sleep sometimes. Very quiet. Very sad. If you can reach the singing part... maybe they remember too."',
      effect: 'set_flag:mogwai_knows_recipe',
    },
    m_escape: {
      id: 'm_escape',
      speaker: 'Mogwai Child',
      emoji: '🐉',
      text: '"Out? Outside? Where the sky is?"\n\nEvery mogwai in the room presses against their cage bars, dream-light pulsing in synchrony.\n\n"We will sing for you. If you open the cages, we will sing the biggest dream-song. The kind that breaks walls."',
      effect: 'set_flag:mogwai_ready_escape',
    },
  },
};

// ── FACILITY OVERSEER — R10 (Processing Antechamber) ──
export const OVERSEER_DIALOGUE: DialogueTree = {
  id: 'dialogue_overseer',
  npcId: 'facility_overseer_1',
  startNodeId: 'o_start',
  nodes: {
    o_start: {
      id: 'o_start',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: 'A hunched figure in stained robes looks up from a clipboard of hexcodes. Her face is that of a Night Hag — but wearier, older, less cruel than the Coven members above.\n\n"Intruders. Of course. The spore network flagged you the moment you entered." She sighs. "I suppose you want to destroy everything. They always do."',
      choices: [
        { text: '"Surrender and we spare you."', nextNodeId: 'o_surrender' },
        { text: '"You\'re processing people into soulstones?"', nextNodeId: 'o_justify' },
        { text: '[Attack]', nextNodeId: 'o_fight' },
      ],
    },
    o_surrender: {
      id: 'o_surrender',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"Spare me? You misunderstand. I am not here by choice. The Coven binds its workers with name-contracts. Leave and the King writes you out. Stay and you process souls until your own dreams run dry."\n\nShe sets down the clipboard.\n\n"But if you could break the contracts... I would tell you everything about the inner chambers."',
      choices: [
        { text: '"How do we break name-contracts?"', nextNodeId: 'o_contracts' },
        { text: '"Tell us about the inner chambers first."', nextNodeId: 'o_info' },
      ],
    },
    o_justify: {
      id: 'o_justify',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"Processing. Such a clinical word. The Rain Chambers extract dream-essence. The Hexcode Mill assigns storage indices. The soulstones are... archive entries. Every emotion, memory, aspiration — catalogued, compressed, commodified."\n\nShe taps a soulstone on her desk. It flickers with someone\'s laugh.\n\n"The King calls it \'preservation.\' As if pickling a flower is the same as letting it grow."',
      choices: [
        { text: '"Help us shut it down."', nextNodeId: 'o_surrender' },
        { text: '"You\'re complicit in this."', nextNodeId: 'o_guilt' },
      ],
    },
    o_guilt: {
      id: 'o_guilt',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"Yes. I am. Every name on every stone passed through my hexcode stamp. I know exactly how many."\n\nShe holds up her hands. The fingertips are black — ink that has seeped into the skin permanently.\n\n"2,847 souls. I remember each production number. Would you like me to recite them? It is the only memorial they have."',
      choices: [
        { text: '"Help us free them instead."', nextNodeId: 'o_contracts' },
      ],
    },
    o_contracts: {
      id: 'o_contracts',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"The name-contracts are written with the King\'s Black Quill — an artifact older than the Coven. Destroying the Quill breaks all active contracts. But the Quill is bonded to the King himself. It is part of his body — growing from his writing hand like a claw."\n\nShe looks at you steadily.\n\n"Kill the King, break the Quill, free every name he ever captured. Including mine. Including your friend the Moorish King."',
      effect: 'set_flag:knows_quill_secret',
    },
    o_info: {
      id: 'o_info',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"Level 3 has five critical areas. The Eidolon Chorus Hall — where stolen eidolons are forced to sing the Facility\'s power grid alive. The two Mogwai Nurseries — where they breed and corrupt the young. The Dream Cage — where the most valuable prisoners are kept. And the Dream Splice — the core of everything. A captured proto-dragon, perpetually dreaming, its dreams harvested to power soulstone production."\n\nShe pauses.\n\n"Destroy the Dream Splice and it all falls. But the dragon may not survive the disconnection."',
      effect: 'set_flag:knows_facility_layout',
    },
    o_fight: {
      id: 'o_fight',
      speaker: 'Facility Overseer',
      emoji: '🔬',
      text: '"So be it. I was once a Coven apprentice, you know. My hexcodes are not merely administrative."',
      effect: 'start_combat:facility_overseer',
    },
  },
};

// ── COVEN HAG — R16 (Hag Quarters) ──
export const COVEN_HAG_DIALOGUE: DialogueTree = {
  id: 'dialogue_coven_hag',
  npcId: 'coven_hag_1',
  startNodeId: 'h_start',
  nodes: {
    h_start: {
      id: 'h_start',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: 'The Night Hag reclines on a throne of fused soulstones, each one containing a faintly screaming face. She regards you with amusement.\n\n"Oh. The rescue party. How *adorable*. Tell me, little heroes — do you know what happens to a dream when you wake up?"',
      choices: [
        { text: '"It fades."', nextNodeId: 'h_fades' },
        { text: '"It becomes memory."', nextNodeId: 'h_memory' },
        { text: '"Release the prisoners or die."', nextNodeId: 'h_threat' },
      ],
    },
    h_fades: {
      id: 'h_fades',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"Exactly. It *fades*. Lost. Wasted. All that beauty, terror, wonder — gone because flesh cannot hold dreams."\n\nShe strokes a soulstone lovingly.\n\n"We SAVE them. We give dreams permanence. Is that not mercy? Is that not art? Your moral outrage is really just jealousy that we found a way to keep what you discard every morning."',
      choices: [
        { text: '"Trapping souls is not preservation."', nextNodeId: 'h_truth' },
        { text: '[Attack]', nextNodeId: 'h_fight' },
      ],
    },
    h_memory: {
      id: 'h_memory',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"Memory? Memory is a *corruption* of the original dream. Faded, distorted, self-serving. We do not make memories. We make *perfect recordings*."\n\nShe stands, and her shadow fills the room with writhing forms.\n\n"Every soulstone is a soul at its most vivid moment. We do not kill — we curate."',
      choices: [
        { text: '"The souls are screaming."', nextNodeId: 'h_truth' },
        { text: '[Attack]', nextNodeId: 'h_fight' },
      ],
    },
    h_truth: {
      id: 'h_truth',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"Of COURSE they scream. Awareness without agency — that is the nature of all imprisonment. But be honest — is your waking life so different? You are trapped in flesh that decays. We are trapped in night that endures."\n\nHer voice drops.\n\n"The Father did not *choose* to become what he is. None of us did. We are simply what happens when the dream rejects you and you refuse to fade."',
      choices: [
        { text: '"Then let it end. Let them go."', nextNodeId: 'h_refuse' },
        { text: '"There must be another way."', nextNodeId: 'h_alternative' },
      ],
    },
    h_threat: {
      id: 'h_threat',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"Die? Oh child. I have died seven times and been dreamed back each dawn. Death is a *commute* for my kind."\n\nThe soulstone throne begins to pulse with dark energy.\n\n"But since you insist on unpleasantness..."',
      choices: [
        { text: '[Attack]', nextNodeId: 'h_fight' },
      ],
    },
    h_refuse: {
      id: 'h_refuse',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"End? You think I have that power? The Father\'s contracts bind us all — hag and prisoner alike. Even I cannot leave without his Quill\'s permission."\n\nShe leans forward, conspiratorial.\n\n"But I can look the other way while you descend to Level 3. Just... when you face the Father... do not listen to his song. He learned it from the proto-dragon, and it unmakes resolve."',
      effect: 'set_flag:hag_allowed_passage',
    },
    h_alternative: {
      id: 'h_alternative',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: '"Another way? Perhaps. The proto-dragon below — it dreams the Facility into existence. If it could be taught to dream *differently*... not destruction, not preservation, but *transformation*..."\n\nHer eyes glitter.\n\n"But that would require someone who speaks dream-language fluently. A summoner, perhaps. One with an eidolon bond strong enough to bridge the gap between sleeping and waking."',
      effect: 'set_flag:hag_alternative_hint',
    },
    h_fight: {
      id: 'h_fight',
      speaker: 'Coven Hag',
      emoji: '🧙‍♀️',
      text: 'The Coven Hag rises, soulstone throne shattering as she draws nightmare-energy into her claws.\n\n"Then we dream the old way — with blood and terror."',
      effect: 'start_combat:coven_hag',
    },
  },
};

// ── LOOKUP TABLE ──
export const DIALOGUE_TREES: Record<string, DialogueTree> = {
  dialogue_joseph: JOSEPH_DIALOGUE,
  dialogue_mogwai: MOGWAI_DIALOGUE,
  dialogue_overseer: OVERSEER_DIALOGUE,
  dialogue_coven_hag: COVEN_HAG_DIALOGUE,
};

/** Get dialogue tree by ID */
export function getDialogueTree(id: string): DialogueTree | undefined {
  return DIALOGUE_TREES[id];
}
