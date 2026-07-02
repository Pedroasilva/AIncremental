import type { VerbId } from '@engine/types';

export interface ModelDef {
  tier: number;
  name: string;
  /** Multiplier applied to Compute->Tokens inference. */
  inferenceRate: number;
  /** Quality multiplier for verb output. */
  quality: number;
  /** Context window granted at this tier. */
  window: number;
  /** What this tier unlocks (flag ids / verb ids). */
  unlocks: string[];
}

// Narrative tiers: from naive autocomplete to a self-improving system.
export const MODELS: ModelDef[] = [
  { tier: 0, name: 'Autocomplete', inferenceRate: 1, quality: 1, window: 8, unlocks: ['verb:think'] },
  { tier: 1, name: 'N-Gram', inferenceRate: 2.5, quality: 1.5, window: 16, unlocks: ['verb:investigate'] },
  { tier: 2, name: 'RNN', inferenceRate: 6, quality: 2.2, window: 32, unlocks: ['data'] },
  { tier: 3, name: 'Transformer', inferenceRate: 16, quality: 3.4, window: 64, unlocks: ['verb:analyze'] },
  { tier: 4, name: 'Foundation', inferenceRate: 42, quality: 5.2, window: 128, unlocks: ['agents'] },
  { tier: 5, name: 'Instruct', inferenceRate: 110, quality: 8, window: 256, unlocks: ['verb:plan'] },
  { tier: 6, name: 'Multimodal', inferenceRate: 300, quality: 12, window: 512, unlocks: ['prestige'] },
  { tier: 7, name: 'Reasoner', inferenceRate: 820, quality: 19, window: 1024, unlocks: ['chain_of_thought'] },
  { tier: 8, name: 'Agentic', inferenceRate: 2300, quality: 30, window: 2048, unlocks: ['tools', 'meta_agents'] },
  { tier: 9, name: 'Self-Improving', inferenceRate: 6500, quality: 48, window: 4096, unlocks: ['singularity'] },
];

export const getModel = (tier: number): ModelDef =>
  MODELS[Math.max(0, Math.min(tier, MODELS.length - 1))];

export const maxTier = MODELS.length - 1;

/** Verb -> flag that must be set for it to be available. */
export const VERB_UNLOCK_FLAG: Record<VerbId, string> = {
  think: 'verb:think',
  investigate: 'verb:investigate',
  analyze: 'verb:analyze',
  plan: 'verb:plan',
  train: 'verb:think', // train is always available once you can think
};
