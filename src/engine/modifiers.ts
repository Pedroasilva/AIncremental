import { Decimal, D } from './math/decimal';
import type { GameState } from './types';
import { getModel } from '@content/models';
import { getNode } from '@content/research';

/** Aggregated multipliers derived from model, research and prestige. */
export interface Modifiers {
  computeMult: Decimal;
  tokenMult: Decimal;
  verbMult: number;
  window: number;
  hallucinationResist: number; // 0..~1
  extraSlots: number;
  inferenceRate: number;
  quality: number;
}

export function computeModifiers(state: GameState): Modifiers {
  const model = getModel(state.modelTier);

  let computeMult = D(1);
  let tokenMult = D(1);
  let verbMult = 1;
  let windowAdd = 0;
  let hallucinationResist = 0;
  let extraSlots = 0;

  for (const id of state.research) {
    const node = getNode(id);
    if (!node) continue;
    const e = node.effect;
    if (e.computeMult) computeMult = computeMult.mul(e.computeMult);
    if (e.tokenMult) tokenMult = tokenMult.mul(e.tokenMult);
    if (e.verbMult) verbMult *= e.verbMult;
    if (e.windowAdd) windowAdd += e.windowAdd;
    if (e.hallucinationReduce) hallucinationResist += e.hallucinationReduce;
    if (e.slotsAdd) extraSlots += e.slotsAdd;
  }

  // Prestige parameters give a permanent global production multiplier.
  const params = new Decimal(state.prestige.params);
  const prestigeMult = params.mul(0.02).add(1); // +2% per Θ
  computeMult = computeMult.mul(prestigeMult);
  tokenMult = tokenMult.mul(prestigeMult);

  return {
    computeMult,
    tokenMult,
    verbMult: verbMult * model.quality,
    window: model.window + windowAdd,
    hallucinationResist: Math.min(hallucinationResist, 0.95),
    extraSlots,
    inferenceRate: model.inferenceRate,
    quality: model.quality,
  };
}
