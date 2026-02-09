import type { DialogueTree } from '../engine/types.js';
export declare const JOSEPH_DIALOGUE: DialogueTree;
export declare const MOGWAI_DIALOGUE: DialogueTree;
export declare const OVERSEER_DIALOGUE: DialogueTree;
export declare const COVEN_HAG_DIALOGUE: DialogueTree;
export declare const DIALOGUE_TREES: Record<string, DialogueTree>;
/** Get dialogue tree by ID */
export declare function getDialogueTree(id: string): DialogueTree | undefined;
