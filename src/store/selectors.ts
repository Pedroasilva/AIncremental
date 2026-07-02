import {
  computeModifiers,
  computePerSecond,
  tokensPerSecond,
  thoughtsPerSecond,
  res,
  type GameState,
  Decimal,
} from '@engine/index';

/** Live production rates for display. */
export function rates(state: GameState) {
  const mods = computeModifiers(state);
  return {
    compute: computePerSecond(state, mods),
    tokens: tokensPerSecond(state, mods),
    thoughts: thoughtsPerSecond(state, mods),
    mods,
  };
}

export function resource(state: GameState, id: Parameters<typeof res>[1]): Decimal {
  return res(state, id);
}
