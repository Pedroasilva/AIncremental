import { D, ZERO } from '../math/decimal';
import type { GameState } from '../types';
import { addRes } from '../state';
import { PRODUCERS } from '@content/producers';
import type { Modifiers } from '../modifiers';

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

/** Idle production step: compute -> tokens, plus passive data if unlocked. */
export function produce(state: GameState, dt: number, mods: Modifiers): void {
  addRes(state, 'compute', computePerSecond(state, mods).mul(dt));
  addRes(state, 'tokens', tokensPerSecond(state, mods).mul(dt));

  if (state.flags['data'] || state.research.includes('crawling')) {
    // Passive data trickle once data collection exists.
    addRes(state, 'data', D(0.2).mul(mods.quality).mul(dt));
  }
}
