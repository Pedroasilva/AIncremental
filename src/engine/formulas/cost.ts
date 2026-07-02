import { Decimal, D } from '../math/decimal';

/** Scaled producer cost: base * growth^n (classic idle curve). */
export function producerCost(base: number, growth: number, owned: number): Decimal {
  return D(base).mul(Decimal.pow(growth, owned));
}

/** Model training cost for a given tier: baseTrain * 12^tier. */
export function trainCost(baseTrain: number, tier: number): Decimal {
  return D(baseTrain).mul(Decimal.pow(12, tier));
}

/**
 * Cost discount from accumulated Understanding — asymptotic, capped.
 * discount = 1 - 1/(1 + k*understanding)
 */
export function understandingDiscount(understanding: Decimal, k = 0.05): number {
  const u = understanding.toNumber();
  const raw = 1 - 1 / (1 + k * u);
  return Math.min(raw, 0.9); // never cheaper than 10% of base
}

/** Prestige gain: floor(0.1 * sqrt(lifetime understanding + knowledge)). */
export function prestigeGain(understandingTotal: Decimal, knowledgeTotal: Decimal): Decimal {
  const sum = understandingTotal.add(knowledgeTotal);
  return Decimal.floor(Decimal.sqrt(sum).mul(0.1));
}
