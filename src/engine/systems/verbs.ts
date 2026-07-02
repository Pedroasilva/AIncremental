import { Decimal, D } from '../math/decimal';
import type { GameState, VerbId } from '../types';
import { res, addRes } from '../state';
import { understandingDiscount } from '../formulas/cost';
import { VERB_UNLOCK_FLAG } from '@content/models';
import type { Modifiers } from '../modifiers';

/** A verb can only be performed once its unlock flag is set. */
export function isVerbUnlocked(state: GameState, verb: Exclude<VerbId, 'train'>): boolean {
  return !!state.flags[VERB_UNLOCK_FLAG[verb]];
}

export interface VerbCost {
  tokens?: number;
  thoughts?: number;
  data?: number;
  understanding?: number;
}

export const VERB_COST: Record<Exclude<VerbId, 'train'>, VerbCost> = {
  think: { tokens: 1 },
  investigate: { tokens: 10, thoughts: 5 },
  analyze: { tokens: 8, data: 2 },
  plan: { understanding: 20 },
};

function planBonus(state: GameState): number {
  return 1 + res(state, 'plans').toNumber() * 0.01;
}

/** Does the state currently afford one unit of the verb (with discount)? */
export function canAfford(state: GameState, verb: Exclude<VerbId, 'train'>): boolean {
  if (!isVerbUnlocked(state, verb)) return false;
  const cost = VERB_COST[verb];
  const disc = understandingDiscount(res(state, 'understanding'));
  const tokenNeed = D((cost.tokens ?? 0) * (1 - disc));
  if (res(state, 'tokens').lt(tokenNeed)) return false;
  if (cost.thoughts && res(state, 'thoughts').lt(cost.thoughts)) return false;
  if (cost.data && res(state, 'data').lt(cost.data)) return false;
  if (cost.understanding && res(state, 'understanding').lt(cost.understanding)) return false;
  return true;
}

/**
 * Apply one unit of a verb (used by both manual clicks and agents).
 * `power` scales agent throughput. Returns true if performed.
 */
export function applyVerb(
  state: GameState,
  verb: Exclude<VerbId, 'train'>,
  mods: Modifiers,
  power = 1,
): boolean {
  if (!canAfford(state, verb)) return false;

  const cost = VERB_COST[verb];
  const disc = understandingDiscount(res(state, 'understanding'));
  if (cost.tokens) addRes(state, 'tokens', D(cost.tokens * (1 - disc)).neg());
  if (cost.thoughts) addRes(state, 'thoughts', D(cost.thoughts).neg());
  if (cost.data) addRes(state, 'data', D(cost.data).neg());
  if (cost.understanding) addRes(state, 'understanding', D(cost.understanding).neg());

  const mult = D(mods.verbMult * planBonus(state) * power);

  switch (verb) {
    case 'think':
      addRes(state, 'thoughts', mult);
      state.context.load += 0.6 * power; // thinking fills the context window
      break;
    case 'investigate': {
      const gain = mult;
      addRes(state, 'knowledge', gain);
      state.lifetime.knowledge = new Decimal(state.lifetime.knowledge).add(gain).toString();
      break;
    }
    case 'analyze': {
      const gain = mult;
      addRes(state, 'understanding', gain);
      state.lifetime.understanding = new Decimal(state.lifetime.understanding).add(gain).toString();
      break;
    }
    case 'plan':
      addRes(state, 'plans', D(1));
      break;
  }
  return true;
}
