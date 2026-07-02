import { D, ZERO } from '../math/decimal';
import type { GameState } from '../types';
import { addRes } from '../state';
import { PRODUCERS } from '@content/producers';
import type { Modifiers } from '../modifiers';

/** Fraction of (compute × quality) converted to passive Thought per second. */
const PASSIVE_THINK_RATE = 0.1;

/** Compute produced per second, before dt. */
export function computePerSecond(state: GameState, mods: Modifiers) {
  let total = ZERO;
  for (const def of PRODUCERS) {
    const count = state.producers[def.id].count;
    if (count > 0) total = total.add(D(def.baseOutput).mul(count));
  }
  return total.mul(mods.computeMult);
}

/** Tokens produced per second from inference over compute. */
export function tokensPerSecond(state: GameState, mods: Modifiers) {
  const compute = computePerSecond(state, mods);
  return compute.mul(mods.inferenceRate).mul(mods.tokenMult);
}

/**
 * Passive "background thinking": the AI always thinks a little on its own,
 * scaling with compute and model quality. Gives idle Thought progression from
 * the very start, instead of relying only on clicks / tier-4 agents.
 */
export function thoughtsPerSecond(state: GameState, mods: Modifiers) {
  return computePerSecond(state, mods).mul(mods.quality).mul(PASSIVE_THINK_RATE);
}

/** Idle production step: compute -> tokens + passive thoughts (and data if unlocked). */
export function produce(state: GameState, dt: number, mods: Modifiers): void {
  const cps = computePerSecond(state, mods);
  addRes(state, 'compute', cps.mul(dt));
  addRes(state, 'tokens', cps.mul(mods.inferenceRate).mul(mods.tokenMult).mul(dt));
  addRes(state, 'thoughts', cps.mul(mods.quality).mul(PASSIVE_THINK_RATE).mul(dt));

  if (state.flags['data'] || state.research.includes('crawling')) {
    // Passive data trickle once data collection exists.
    addRes(state, 'data', D(0.2).mul(mods.quality).mul(dt));
  }
}
