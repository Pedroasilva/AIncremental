import type { GameState } from '../types';
import type { Modifiers } from '../modifiers';

/**
 * Context window pressure. Thinking raises load; it decays over time. Exceeding
 * the window builds a Hallucination value that penalizes output. Alignment
 * research (hallucinationResist) softens the risk.
 */
export function applyContext(state: GameState, dt: number, mods: Modifiers): void {
  const ctx = state.context;
  ctx.window = mods.window;

  // Load decays toward zero.
  ctx.load = Math.max(0, ctx.load - dt * 2);

  const over = Math.max(0, ctx.load - ctx.window);
  const risk = ctx.window > 0 ? (over / ctx.window) * (1 - mods.hallucinationResist) : 0;

  // Hallucination eases toward the current risk.
  ctx.hallucination += (Math.min(risk, 1) - ctx.hallucination) * Math.min(dt, 1);
  ctx.hallucination = Math.max(0, Math.min(ctx.hallucination, 1));
}

/** Output multiplier from hallucination (mild bonus low, penalty high). */
export function hallucinationMult(state: GameState): number {
  return 1 - state.context.hallucination * 0.5;
}
